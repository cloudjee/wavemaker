/*
 * Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
 
dojo.provide("wm.studio.app.inspector.StyleInspector");
dojo.require("wm.studio.app.inspector.Inspector");

dojo.declare("wm.StyleInspector", [wm.Layers, wm.InspectorBase], {
    layersType: 'Tabs',
    clientBorder: "2,0,0,0",
    clientBorderColor: "#959DAB",
    flex: 1,
    box: 'v',
    _source: {
	    properties: ["wm.Layer", {flex: 1, caption: "", box: "v"}, {}, {
		    stylePropHtml: ["wm.Html", {width: "100%", height: "100%"}]
		}],

		classes: ["wm.Layer", {"_classes":{"domNode":["wm_FontColor_Black"]},flex: 1, caption: "", box: "v"}, {}, {
			//classTree: ["wm.Tree", {flex: 1}, {}, {}],
		        classListPanel: ["wm.Panel", {height: "100%", width: "100%", layoutKind: "top-to-bottom", padding: "4", margin: "0", autoScroll: true}],
			bevel1: ["wm.Bevel", {}, {}, {}],
		        classEdit: ["wm.Text", {changeOnEnter: true, caption: "", captionSize: "60px", height: "22px"}, {}, {}]
		}],
		custom: ["wm.Layer", {flex: 1, caption: "", box: "v"}, {}, {
		    textArea: ["wm.LargeTextArea", {width: "100%", height: "100%", border: 0}, {}, {}],
			panel1: ["wm.Panel", {_classes: {domNode: [ "wm-darksnazzy"]}, layoutKind: "left-to-right", height: "34", boxPosition: "bottomRight", border: 0, padding: 2}, {}, {
				applyStylesButton: ["wm.Button", {caption: "", border: 1, width: "60"}, {}]
			}]
		}]
	},
/* when any of its internal layers changes, this fires */
    onchange: function() {
	if (!this._cupdating) {
	    if (this.getLayer(this.indexOfLayerName("properties")).isActive())
		studio.inspector.reinspect(); 
	    else
		this.inspect(this.owner.inspected, this.owner.inspectorProps);
	}
    },
	init: function() {
		//this.createComponents(this._source); //, this);
		// inherited init deals with showing layers so call after adding layers
		this.inherited(arguments);
		this.createComponents(this._source); //, this);
		this.initClasses();
		this.initStyles();
		dojo.addClass(this.layers[0].domNode, "wminspector");
		dojo.addClass(this.layers[1].domNode, "wmstyleinspector");
		dojo.addClass(this.layers[2].domNode, "wmstyleinspector");

	    
	    this.layers[0].setCaption(studio.getDictionaryItem("wm.StyleInspector.BASIC_STYLE_LAYER_CAPTION"));
	    this.layers[1].setCaption(studio.getDictionaryItem("wm.StyleInspector.CLASSES_LAYER_CAPTION"));
	    this.layers[2].setCaption(studio.getDictionaryItem("wm.StyleInspector.CUSTOM_LAYER_CAPTION"));
	    this.layers[1].c$[2].setCaption(studio.getDictionaryItem("wm.StyleInspector.CUSTOM_CLASS_CAPTION"));
	    this.layers[2].c$[1].c$[0].setCaption(studio.getDictionaryItem("wm.StyleInspector.CUSTOM_BUTTON_CAPTION"));

	    dojo.connect(this.layers[1], "onShow", this, function() {
			 this.classListPanel.reflow();
	    });
	},
	initClasses: function() {
	        this.classEdit = this.$.client.widgets.classes.widgets.classEdit;
	        this.classListPanel = this.$.client.widgets.classes.widgets.classListPanel;
	        this.classListPanel.removeAllControls();
	    /*
		this.classTree = this.$.client.widgets.classes.widgets.classTree;
		this.classTree.clear();
		*/
		this.connect(this.classEdit.domNode, "onmousedown", this, "textMousedown");
		this.connect(this.classEdit, "onchange", this, "classEditChange");
	    //this.connect(this.classTree, "oncheckboxclick", this, "classCheckboxClick");
		var n = defaultCssClasses;
		for (var i in n) {
			if (!(i in Array.prototype)) {
			    this.addStyleEditor(i, n);
/*
				var node = new wm.TreeNode(this.classTree.root, {content: i, name: i, isCategory: true});
				for (var j=0, g=n[i], c; (c=g[j]); j++) {
					new wm.TreeCheckNode(node, {content: c, closed: true, name: c});
				}
				*/
			}
		}
	    this.classListPanel.reflow();
	},
    addStyleEditor: function(i,n) {
			    var s = new wm.SelectMenu({owner: this,
						       parent: this.classListPanel,
						       caption: i,
						       name: i,
						       allowNone: true,
						       dataField: "dataValue",
						       displayField: "dataValue",
						       captionPosition: "top",
						       captionAlign: "left",
						       captionSize: "20px",
						       height: "40px",
						       width: "100%"});
			    s.connect(s, "onchange", this, function() {
				this.classChange(s);
			    });
			    var options = "";
			    for (var j=0, g=n[i], c; (c=g[j]); j++) {
				if (options) options += ",";
				options += c;
			    }
			    s.setOptions(options);
    },
	initStyles: function() {
	    this.text = this.getLayer(this.indexOfLayerName("custom")).c$[0];
	    this.text.connect(this.text, "onchange", this, function(inValue) {
		this._setInspectedProp("styles", inValue);
	    });
	},
	_setInspectedProp: function(inProp, inValue) {
		if (inProp == "styles")
			this.owner.inspected.setNodeStyles(inValue, this.nodeClass);
		else
			this.inherited(arguments);
	},
        reinspect: function(inInspected, inProps) {
	    this.inspect(inInspected, inProps);
	},
	inspect: function(inInspected, inProps) {
		var ins = inInspected, def = "domNode";
		var isWidget = ins instanceof wm.Widget;
		//
	        //this.classTree.setShowing(isWidget);
	        this.classListPanel.setShowing(isWidget);
		if (!isWidget)
			return;
		//
		this.nodeName = (inProps||0).nodeName || def;
		this.nodeClass = (inProps||0).nodeClass || "";
	        var c = (ins._getUserNodeClasses) ? ins._getUserNodeClasses(this.nodeName) : ins._classes[this.nodeName] || [];
		if (!dojo.isArray(c)) {
			console.debug("inspector: ", ins, " has non-array _classes");
			//ins._classes = [];
			return;
		}
		this.extraClasses = [].concat(c);
	    dojo.forEach(this.classListPanel.c$, dojo.hitch(this, function(editor) {
		var prefix = "wm_" + editor.caption + "_";
		var data = editor.dataSet.getData();
		for (var i = 0; i < data.length; i++) {
		    var className = prefix + data[i].dataValue;
		    if (ins._classes.domNode && dojo.indexOf(ins._classes.domNode, className) != -1) {
			editor.setDataValue(data[i].dataValue);
			this.extraClasses.splice(dojo.indexOf(this.extraClasses, className), 1);
			return;
		    }
		}
		editor.setDataValue("");

	    }));
/*
		this.classTree.forEachNode(dojo.hitch(this, function(inNode) {
			if (inNode.setChecked) {
				var
					nc = this.classFromNode(inNode),
					check = (dojo.indexOf(c, nc) >= 0);
				inNode.setChecked(check);
				// user classes are those not marked on tree
				if (check)
					this.extraClasses.splice(dojo.indexOf(this.extraClasses, nc), 1);
			}
		}));
		*/
		this.classEdit.beginEditUpdate();
		this.classEdit.setDataValue(this.extraClasses.join(' '));
		this.classEdit.endEditUpdate();
		//
		var s = ins.getNodeStyles(this.nodeClass);
		this.text.setDataValue(s);
	},
	classFromNode: function(inNode) {
		return ["wm", inNode.parent.name, inNode.name].join("_");
	},
        classChange: function(inSender) {
	    var inspected = this.owner.inspected;
	    var data = inSender.dataSet.getData();
	    var value = inSender.getDataValue();
	    var prefix = "wm_" + inSender.caption + "_";
	    for (var i = 0; i < data.length; i++) {
		var v = data[i].dataValue;
		if (v == value) {
		    if (!inspected._classes.domNode || dojo.indexOf(inspected._classes.domNode, prefix+v) == -1)
			inspected.addUserClass(prefix + v);
		} else {
		    inspected.removeUserClass(prefix + v);
		}
	    }
	    inspected.reflowParent();	    
	},
	classCheckboxClick: function(inNode) {
		//dojo.stopEvent(inEvent);
		var i = this.owner.inspected;
		i[inNode.getChecked() ? "addUserClass" : "removeUserClass"](this.classFromNode(inNode), this.nodeName);
		i.reflowParent();
	},
	classEditChange: function() {
		var
			i = this.owner.inspected,
			v = this.classEdit.getValue("dataValue") || "",
			classes = v.split(' ');
		// remove old extra classes
		dojo.forEach(this.extraClasses, dojo.hitch(this, function(c) {
			i.removeUserClass(dojo.trim(c), this.nodeName);
		}));
		// add new extra classes
		dojo.forEach(classes, dojo.hitch(this, function(c) {
			var klass = dojo.trim(c);
			if (klass)
			i.addUserClass(klass, this.nodeName);
		}));
		this.extraClasses = classes;
		i.reflowParent();
	},
	textMousedown: function() {
		studio.studioKeyPriority = false;
	}
});