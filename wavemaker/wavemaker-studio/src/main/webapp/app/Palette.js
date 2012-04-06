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
 
dojo.provide("wm.studio.app.Palette");

// creation sequence
//	- mousedown on a palette button invokes start
//		- start calls studio.make to create a component
//		- if component is a widget, then start initiates mouse dragging on the new object
//	- wm.drag.end is hooked to finish (globally, we rely on flags to know if it's relevant)
//		- finish method cleans up the design surface and clears flags

/**
	@class
	@name wm.Palette
	@inherits wm.Tree
*/
dojo.declare("wm.DraggableServiceTree", wm.Tree, {
	init: function() {
		this.inherited(arguments);
		this.connect(this.domNode, "onmousedown", this, "mousedown");
		this.dragger = new wm.design.Mover();
		this.dragger.ondrop = dojo.hitch(this, "dragDrop");
	},
	mousedown: function(e) {
		var t = this.findEventNode(e);
		if (t) {
		    if (t.component && t.component.hasServiceTreeDrop && t.component.hasServiceTreeDrop(t)) {
			this.drag(e, t.component.name, t.component, t);
			}
			else if (t.parent == this.root && e.target != t.btnNode)
			{
				t.setOpen(t.closed);
			}
		}
	},
    drag: function(inEvent, inType, obj, node) {
		if (!studio.page)
			return;
			this.dragger.beginDrag(inEvent, {
				caption: inType,
				type: inType,
			    control: obj,
			    node: node
			});
	},
	dragDrop: function() {
	    if (!this.dragger.target)
		return;

	    var info = this.dragger.info;
	    var component = info.control;
            var owner = this.dragger.target.owner;
            while (owner != studio.page && owner != studio.application)
                owner = owner.owner;

	    var comp = component.onServiceTreeDrop(this.dragger.target, owner, info.node);

		if (comp) {
			if (!(comp instanceof wm.ServerComponent)) {
				// create an undo task
				new wm.AddTask(comp);
			}
			if (comp instanceof wm.Control) {
				//comp.designMoveControl(this.dragger.target, this.dragger.dropRect);
				this.dragger.target.designMoveControl(comp, this.dragger.dropRect);
			}
		    studio.refreshDesignTrees();
		    studio.select(comp);
		}
	}
});

dojo.declare("wm.Palette", wm.Tree, {
	init: function() {
		this.items = [];
		this.inherited(arguments);
		this.connect(this.domNode, "onmousedown", this, "mousedown");
		this.dragger = new wm.design.Mover();
		this.dragger.ondrop = dojo.hitch(this, "dragDrop");
	},
    filterNodes: function(searchRegExp, optionalNode) {
	var openAll = !"".match(searchRegExp);
	var kids = optionalNode ? optionalNode.kids : this.root.kids;
	for (var i = 0; i < kids.length; i++) {
	    kids[i].setOpen(openAll || !optionalNode && i <= 2);
	    if (kids[i].klass && (kids[i].klass.toLowerCase().match(searchRegExp) || kids[i].content.toLowerCase().match(searchRegExp)) || !kids[i].klass) {
		kids[i].domNode.style.display = "block";
		this.filterNodes(searchRegExp, kids[i]);
	    } else {
		kids[i].domNode.style.display = "none";
	    }
	}
    },
	mousedown: function(e) {
		var t = this.findEventNode(e);
		if (t) {
			if (t.klass)
			{
				if (t.klass == 'wm.Template' && t.name != '')
				{
					t.props.name = t.name;
				}
				this.drag(e, t.klass, t.props, t);
			}
			else if (t.parent == this.root && e.target != t.btnNode)
			{
				t.setOpen(t.closed);
			}
		}
	},
	drag: function(inEvent, inType, inProps, obj) {
		if (!studio.page)
			return;
			this.dragger.beginDrag(inEvent, {
				caption: inType,
				type: inType,
				props: inProps,
				obj: obj
			});
/*
	    wm.forEachVisibleWidget(studio.page.root, function(w) {
		w.setMargin("4");
	    });
	    */
	},
	dragDrop: function() {
/*
	    wm.forEachVisibleWidget(studio.page.root, function(w) {
		w.setMargin("0");
	    });
	    */
		if (!this.dragger.target)
			return;
		var info = this.dragger.info;
		var props = dojo.clone(info.props || {});
	        if (props.name)
	            props.name = props.name.replace(/\s/g,"");
		var ctor = dojo.getObject(info.type);
                var owner = this.dragger.target.owner;
                while (owner != studio.page && owner != studio.application)
                    owner = owner.owner;
		dojo.mixin(props, {
			_designer: studio.page._designer,
			name: studio.page.getUniqueName(props.name || studio.makeName(info.type)),
		    owner: owner,
			parent: this.dragger.target
		});
		if (ctor.prototype instanceof wm.Control) {
			props.height = ctor.prototype.height || props.height || "48px";
			props.width = ctor.prototype.width  || props.width || "96px";
		}

                studio.application.loadThemePrototypeForClass(ctor);
		var comp = new ctor(props);
		if (comp) {
			if (!(comp instanceof wm.ServerComponent)) {
				// create an undo task
				new wm.AddTask(comp);
			}
			if (comp instanceof wm.Control && comp instanceof wm.Dialog == false) {
				//comp.designMoveControl(this.dragger.target, this.dragger.dropRect);
				this.dragger.target.designMoveControl(comp, this.dragger.dropRect);
			}
			if (!wm.fire(comp, "afterPaletteDrop")) {
				// FIXME: should not refresh entire tree when dropping from palette.
				studio.refreshDesignTrees();
			    //studio.inspector.resetInspector();
				studio.select(comp);
			}
		}
	},
	makeGroup: function(inGroup, inParentIndex) {
		if (this.findItemByName(inGroup))
			return;

	    var f = function(inGroup, inParent, inParentIndex, inClosed) {
		for (var i = 0; i < inParent.kids.length; i++) {
		    if (inParent.kids[i].name == inGroup)
			return inParent.kids[i];
		}

		var props = {
			content: inGroup,
		        data: inGroup,
			name: inGroup,
			closed: inClosed
		}
		if (inParentIndex !== undefined)
			props.parentIndex = inParentIndex;
		var n = new wm.TreeNode(inParent, props);
/*
		if (n == this.root.kids[0] || n == this.root.kids[1] || n == this.root.kids[2])
			n.setOpen(true);
			*/
		return n;
	    };

	    var names = inGroup.split("/");
	    var node = this.root;
	    for (var i = 0; i < names.length; i++) {
		node = f(names[i], node, i == 0 ? inParentIndex : undefined, i == 0 && this.root.kids.length > 0);
	    }
	    return node;
	},
    addItem: function(inTab, inName, inDescription, inImage, inClass, inProps, isBeta) {
		if (inTab){
			var p = this.findItemByName(inTab) || this.makeGroup(inTab);
			wm.fire(this.findItemByName(inName, p), "destroy");
			var n = new wm.TreeNode(p, {
					name: inName,
			    content: inName + (isBeta ? " " + bundlePackage.isBeta : ""),
			                data: {description: inDescription,
					       klass: inClass},
					image: inImage,
					klass: inClass,
					props: inProps
				});
		    this.createContextMenu(n);
		}
		wm.Palette.items[inClass] = { desc: inDescription, image: inImage, klass: inClass };

	},
    createContextMenu:function(inNode) {
	    var f = function(e) {
		dojo.stopEvent(e);		
		var menuObj = studio.contextualMenu;
		menuObj.removeAllChildren();
		var ctor = dojo.getObject(inNode.klass);
		if (ctor)
		    var prototype = ctor.prototype;
		if (prototype && !prototype._noPaletteCopy) {
 		    menuObj.addAdvancedMenuChildren(menuObj.dojoObj, 
						    {label: studio.getDictionaryItem("wm.Palette.MENU_ITEM_COPY", {className: inNode.klass}),
						     iconClass: "Studio_canvasToolbarImageList16_3",
						     onClick: dojo.hitch(this, function() {
							 studio.clipboard = "{" + inNode.klass.replace(/^.*\./,"") + "1: ['" + inNode.klass + "'," + (inNode.props ? dojo.toJson(inNode.props) : "{}") + "]}";
							 studio.clipboardClass = inNode.klass;
							 studio.updateCutPasteUi();
						     })
						    });
		}
		menuObj.addAdvancedMenuChildren(menuObj.dojoObj, 
						{label: studio.getDictionaryItem("wm.Palette.MENU_ITEM_DOCS", {className: inNode.klass}),
						 iconClass: "StudioHelpIcon", 
						 onClick: dojo.hitch(this, function() {
						     window.open(studio.getDictionaryItem("wm.Palette.URL_CLASS_DOCS", {studioVersionNumber: wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/,"$1"), className: inNode.klass.replace(/^.*\./,""), shortName: inNode.klass.replace(/^.*\./,"")}));
						 })
						});


		menuObj.update(e, inNode.domNode);
	    }

	dojo.connect(inNode.domNode, "oncontextmenu", this, f);
	if (dojo.isFF) {
	    dojo.connect(inNode.domNode, "onmousedown", this, function(e) {
	    if (e.button == 2 || e.ctrlKey) 
		dojo.hitch(this, f)(e);
	    });
	}


    },
	removeItem: function(inTab, inName) {
		var g = this.findItemByName(inTab);
		if (g) {
			for (var i=0, nodes=g.kids, l = nodes.length, n; i<l; i++) {
				n = nodes[i];
				if (n && n.name == inName) {
					g.remove(n);
					if (!g.kids || !g.kids.length)
						g.destroy();
					return;
				}
			}
		}
	},
	getItemNames: function(inTab) {
		var g = this.findItemByName(inTab), names = [];
		if (g)
			for (var i=0, nodes=g.kids, l = nodes.length, n; i<l; i++)
				names.push(nodes[i].name);
		return names;
	},
	findItemByName: function(inName, inParent) {
	    var names = inName.split("/");
	    
	    var f = function(inName,inParent) {
		for (var i=0, nodes=inParent.kids, n; (n=nodes[i]); i++) {
			if (inName == (n||0).name)
				return n;
		}
	    };
	    var node = inParent || this.root;
	    for (var i = 0; node && i < names.length; i++) {
		node = f(names[i],node);
	    }
	    return node;
	},

    onselect: function(inNode) {
	if (!inNode) return;
	var data = inNode.data;
	if (!data.description) {
	    studio.paletteTips.hide();
	    return;
	}
	studio.paletteTips.show();
	studio.paletteTips.setCaption( "<span class='StudioHelpIcon'>&nbsp;</span>" + data.description);
	var node = dojo.query(".StudioHelpIcon", studio.paletteTips.domNode)[0];
	dojo.connect(node, "onmouseover", this, function(e) {
	    app.createToolTip(studio.getDictionaryItem("wm.Palette.TIP_DOCS"), node, e, "100px");
	});
	dojo.connect(node, "onmouseout", this, function() {
	    app.hideToolTip();
	});
	dojo.connect(node, "onclick", this, function(e) {
	    window.open(studio.getDictionaryItem("wm.Palette.URL_CLASS_DOCS", {studioVersionNumber: wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/,"$1"), className: inNode.klass.replace(/^.*\./,""), shortName: inNode.klass.replace(/^.*\./,"")}));
	});

    },

	// bc
	setLayerIndex: function() {
	},
	clearSection: function(inName) {
		var p = this.findItemByName(inName);
		if (p) {
			dojo.forEach(p.kids, function(n) {
				delete wm.Palette.items[n.klass];
			});
			p.removeChildren();
		}
	},
	removeSection: function(inName) {
		wm.fire(this.findItemByName(inName), "destroy");
	}
});

wm.Palette.items = [];
