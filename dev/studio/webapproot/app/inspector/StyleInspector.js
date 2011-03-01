/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
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
		properties: ["wm.Layer", {flex: 1, title: bundleStudio.I_BasicStyles, box: "v"}, {}, {
		    stylePropHtml: ["wm.Html", {width: "100%", height: "100%"}]
		}],

		classes: ["wm.Layer", {flex: 1, title: bundleStudio.I_Classes, box: "v"}, {}, {
			classTree: ["wm.Tree", {flex: 1}, {}, {}],
			bevel1: ["wm.Bevel", {}, {}, {}],
			classEdit: ["wm.Editor", {caption: bundleStudio.I_Custom, captionSize: 40, captionUnits: "px", height: "22px"}, {}, {
				editor: ["wm._TextEditor", {changeOnEnter: true}, {}]
			}]
		}],
		custom: ["wm.Layer", {flex: 1, title: bundleStudio.I_Custom_Styles, box: "v"}, {}, {
		    textArea: ["wm.LargeTextArea", {width: "100%", height: "100%", border: 0}, {}, {}],
			panel1: ["wm.Panel", {_classes: {domNode: [ "wm-darksnazzy"]}, layoutKind: "left-to-right", height: "34", boxPosition: "bottomRight", border: 0, padding: 2}, {}, {
				applyStylesButton: ["wm.Button", {caption: bundleStudio.I_Apply, border: 1, width: "60"}, {}]
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
	},
	initClasses: function() {
		this.classTree = this.$.client.widgets.classes.widgets.classTree;
		this.classEdit = this.$.client.widgets.classes.widgets.classEdit;
		this.classTree.clear();
		this.connect(this.classEdit.domNode, "onmousedown", this, "textMousedown");
		this.connect(this.classEdit, "onchange", this, "classEditChange");
		this.connect(this.classTree, "oncheckboxclick", this, "classCheckboxClick");
		var n = defaultCssClasses;
		for (var i in n) {
			if (!(i in Array.prototype)) {
				var node = new wm.TreeNode(this.classTree.root, {content: i, name: i, isCategory: true});
				for (var j=0, g=n[i], c; (c=g[j]); j++) {
					new wm.TreeCheckNode(node, {content: c, closed: true, name: c});
				}
			}
		}
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
		this.classTree.setShowing(isWidget);
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