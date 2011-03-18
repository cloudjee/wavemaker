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
dojo.provide("wm.studio.app.trees");


Studio.extend({
	//=========================================================================
	// Trees
	//=========================================================================
    
	clearTrees: function() {
		this.tree.clear();
		this.widgetsTree.clear();
	        this.compTree.clear();
		//this.dataTree.clear();
	},
	refreshDesignTrees: function() {
		//this.refreshComponentsTree();
		this.refreshWidgetsTree();
		// re-select selected component
	     
	    this.selectInTree(this.selected && (this.selected.owner == studio.page || this.selected.owner == studio.application) ? this.selected : studio.page.root);

	},
    /* This is really the "refreshAllTrees" method */
	refreshWidgetsTree: function(optionalSearch) {
	    this.refreshVisualTree("");
	    this.refreshServiceTree("");
	    this.refreshComponentTree("");
	},
    refreshVisualTree: function(optionalSearch) {
		this.widgetsTree.clear();
   	        this._searchText = (optionalSearch) ? optionalSearch.toLowerCase() :  "";
	        if (optionalSearch)
	            this.regex = new RegExp(this._searchText.toLowerCase());

		if (this.page) {
		    var dialogs = this.getTreeComponents(this.application.components, null, [wm.Dialog, wm.PopupMenu]);
		    for (var d in dialogs) {
			this.widgetToTree(this.widgetsTree.root, dialogs[d]);
		    }
		    dialogs = this.getTreeComponents(this.page.components, null, [wm.Dialog, wm.PopupMenu]);
		    for (var d in dialogs) {
			this.widgetToTree(this.widgetsTree.root, dialogs[d]);
		    }
		    this.widgetToTree(this.widgetsTree.root, this.page.root);

		}
    },
    refreshServiceTree: function(optionalSearch) {
	this.tree.clear();
   	this._searchText = (optionalSearch) ? optionalSearch.toLowerCase() :  "";
	if (this._searchText)
	    this.regex = new RegExp(this._searchText);
	this.useHierarchy = true;
	this.appServicesToTree(this.tree);
	this.useHierarchy = false;
    },
    refreshComponentTree: function(optionalSearch) {
	this.compTree.clear();
   	this._searchText = (optionalSearch) ? optionalSearch.toLowerCase() :  "";
	if (optionalSearch)
	    this.regex = new RegExp(this._searchText.toLowerCase());
	this.useHierarchy = true;
	this.appComponentsToTree(this.compTree);
	if (studio.page) // called without a page when loading app level definitions at project load time
	    this.pageComponentsToTree(this.compTree);
	this.useHierarchy = false;
    },

    addDndItemsToSource: function(node, results) {
	if (node != this.widgetsTree.root && node.parent != this.widgetsTree.root)
	    results.push(node.domNode);
	if (node.kids)
	    for (var i = 0; i < node.kids.length; i++) {
		this.addDndItemsToSource(node.kids[i], results);
	    }
    },
	    getTreeComponents: function(inComponents, inExcludeTypes, inIncludeTypes) {
		var list = {}, c;
		for (var i in inComponents) {
			c = inComponents[i];
			//if (!(inExcludeType && (c instanceof inExcludeType)))
		    if (inExcludeTypes) {
			if (!(this._instanceOf(c, inExcludeTypes)))
				list[i] = c;
		    } else if (inIncludeTypes) {
			if ((this._instanceOf(c, inIncludeTypes)))
				list[i] = c;
		    } else {
				list[i] = c;
		    }
		}
		return list;
	},
	_instanceOf: function(t, types) {
		var ret = false;
		for (var i=0; i<types.length; i++) {
			var m = types[i];
			if (t instanceof m) {
				ret = true;
				break;
			}
		}
		return ret;			
	},
	systemComponentsToTree: function(inTree) {
		// part components
		var n = this.newTreeNode(inTree.root, "images/wm/pane.png", "System Components");
		n.owner = this.page;
		this.componentsToTree(n, this.getTreeComponents(this.page.components));
	},
	pageComponentsToTree: function(inTree) {
		// part components
		var n = this.newTreeNode(inTree.root, "images/wm/pane.png", "Page (" + this.page.declaredClass + ")");
		n.owner = this.page;

	        n.component = this.page;
	        this.page._studioTreeNode = n;

	    var components  = this.getTreeComponents(this.page.components, [wm.Control]);

		    if (this._searchText) {
			var _components = {};
			for (var name in components) {
			    var c = components[name];
			    if (name.toLowerCase().match(this.regex)) {
				_components[name] = c;
			    }
			}
			components = _components;

/*
			var _dialogs = {};
			for (var name in dialogs) {
			    var c = dialogs[name];
			    if (name.toLowerCase().match(this.regex)) {
				_dialogs[name] = c;
			    }
			}
			dialogs = _dialogs;
			*/
		    }

	    var cmpCount = 0;
	    for (cmp in components) cmpCount++;
	    //for (cmp in dialogs) cmpCount++;
	    //this.useHierarchy =  (cmpCount > 6);
	    this.useHierarchy =  true;
	    this.componentsToTree(n, components);
	    //this.componentsToTree(n, dialogs);
	    this.useHierarchy = false;
	},
	appServicesToTree: function(inTree) {
	    // app components
	    var n = this.newTreeNode(inTree.root, "images/project_16t.png", "Project (" + studio.project.projectName + ")");
	    n.component = n.owner = this.application
	    //this.application._studioTreeNode = n;
	    this.excTypes = [wm.Query, wm.LiveView, wm.Control];
	    if (this.application) {
		this.svrComps = this.application.getServerComponents();
                var svrComps = this.getTreeComponents(this.svrComps, this.excTypes);

		/* Currently we can't search the contentx of services because it requires a service call
		 * to load all of the entities of the data model; other components it may be possible
		 * I haven't yet investigated.  I can't think of any reason why we couldn't preload
		 * all data when a project is loaded in studio so we can support searching.
		 */
		if (this._searchText) {
		    var svrCompSearch = {};
		    for (var i in svrComps) {
			var c = svrComps[i];
			var name = c.name;
			if (name.toLowerCase().match(this.regex)) {
			    svrCompSearch[name] = c;
			} 
		    }
                    svrComps = svrCompSearch;

		}

		    this.componentsToTree(n, svrComps);
 
	    }
	},
	appComponentsToTree: function(inTree) {
		// app components
		var n = this.newTreeNode(inTree.root, "images/project_16t.png", "Project (" + studio.project.projectName + ")");
	        n.component = n.owner = this.application
	    //this.application._studioTreeNode = n;
	    this.excTypes = [wm.Query, wm.LiveView, wm.Control];
		if (this.application) {
		    this.otherComps = this.getTreeComponents(this.application.components, this.excTypes);
		    		    
		    if (this._searchText) {
			var otherComps = {};
			for (var name in this.otherComps) {
			    var c = this.otherComps[name];
			    if (name.toLowerCase().match(this.regex)) {
				otherComps[name] = c;
			    }
			}
			this.otherComps = otherComps;
		    }

		    this.componentsToTree(n, this.otherComps);
		}
	},
	addQryAndViewToTree: function(inNode) {
		this.componentsToTree_rev(inNode, this.svrComps, this.excTypes);
		this.componentsToTree_rev(inNode, this.application.components, this.excTypes);
	},
	newTreeNode: function(inParent, inImage, inName, inClosed, inProps) {
		inProps = dojo.mixin(inProps || {}, {image: inImage, content: inName, closed: inClosed});
		var node = new wm.TreeNode(inParent, inProps);
	    return node;
	},
	getClassNameImage: function(inClassName) {
		var i = wm.Palette.items[inClassName] || 0;
		return i.image;
	},
	getComponentImage: function(inComponent) {
		var ci = this.getClassNameImage(inComponent.publishClass);
		return ci || inComponent.image || wm.packageImages[inComponent.publishClass] || ("images/wm/" + (inComponent instanceof wm.Widget ? "widget" : "component") + ".png");
	},
	newComponentNode: function(inParent, inComponent, inName, inImage, inProps) {

			// get node closed state
	    var o = inComponent && inComponent._studioTreeNode;
	    var closed = o ? o.closed : (inProps && inProps.closed);
	    var img = inImage || this.getComponentImage(inComponent);
	    var name = inName || inComponent._treeNodeName || inComponent.getId();
	    var n = this.newTreeNode(inParent, img, name, closed, inProps);

	    if (inComponent) {
		n.component = inComponent;
		inComponent._studioTreeNode = n;
		if (n.tree == this.widgetsTree && (inComponent.flags.noModelDrop || inComponent instanceof wm.Container == false)) {
		    n.tree.setNoDrop(n, true);
		}

		if (inComponent && inComponent.showContextMenu) {
		    dojo.connect(n.domNode, "oncontextmenu", inComponent, "showContextMenu");
		    if (dojo.isFF) {
			dojo.connect(n.domNode, "onmousedown", this, function(e) {
			    if (e.button == 2 || e.ctrlKey) inComponent.showContextMenu(e);
			});
		    }
		}

	    }
	    return n;
	},
    onWidgetTreeNodeDrop: function(inSender, inMovedNode, inNewParentNode, inIndexInParent, inOldParent) {
	    var movedComponent = inMovedNode.component;
	    var parentComponent = inNewParentNode.component;
	    parentComponent.designMoveControl(movedComponent, {i: inIndexInParent});
	},
	widgetToTree: function(inNode, inWidget) {
		if (inWidget) {
		    if (inWidget.flags.notInspectable || inWidget.isParentLocked())
				return;		    
		    // create a new node if we are displaying this widget, else pass in the parent node.  If we're in search mode, then all widgets get added to the root node
		    var n = (this._searchText && !inWidget.name.toLowerCase().match(this.regex)) ? inNode : this.newComponentNode(inNode, inWidget, null, null, {closed: inWidget instanceof wm.Dialog});
		    if (inWidget instanceof wm.Dialog == false || inWidget instanceof wm.DesignableDialog)
			this.subWidgetsToTree(n, inWidget);
		}
	},
	subWidgetsToTree: function(inNode, inWidget) {
	    this.widgetsToTree(inNode, (inWidget instanceof wm.Control) ? inWidget.getOrderedWidgets() : []);
		var c = inWidget.collection;
		if (c && !inWidget.flags.notInspectable) {
			this.collectionToTree(inNode, inWidget.getCollection(c));
		}
	},
	widgetsToTree: function(inNode, inWidgets) {
		dojo.forEach(inWidgets, dojo.hitch(this, function(w) {
			this.widgetToTree(inNode, w);
		}));
	},
	componentToTree: function(inNode, inComponent, inType) {
		if (inComponent && !inComponent.flags.notInspectable && (!inType || inComponent instanceof inType)) {
		    var props = {};
		    props.closed = true;
		    inNode = wm.fire(inComponent, "preNewComponentNode", [inNode, props]) || inNode;

		    if (this._searchText && !inComponent.name.toLowerCase().match(this.regex)) {
			return;
		    } else {
			var searchText = this._searchText;
			this._searchText = "";
		    }

		    var n = this.newComponentNode(inNode, inComponent, null, null, props);
		    if (n && n.tree == studio.tree && studio.application._metaData["service_invalid_" + inComponent.getRuntimeId()])
			dojo.addClass(n.domNode, "Error");

  		    if (inComponent instanceof wm.TypeDefinition)
			    this.subWidgetsToTree(n, inComponent);
		    this._searchText = searchText;
		}
	},
	collectionToTree: function(inNode, inCollection, inType) {
		for (var i=0; (c=inCollection[i]); i++)
			this.componentToTree(inNode, c, inType);
	},
	componentsToTree: function(inNode, inComponents, inType) {
	    var n = [], cn;
	    if (!this.useHierarchy) {
		for (cn in inComponents) { n.push(cn); }
		n.sort();
		for (var i=0; (cn=n[i]); i++)
		    this.componentToTree(inNode, inComponents[cn], inType);
	    } else {
		for (cn in inComponents) { n.push(inComponents[cn]); }
		n.sort(function(a,b) {
		    if (a.declaredClass > b.declaredClass) return 1;
		    if (a.declaredClass < b.declaredClass) return -1;
		    if (a.name > b.name) return 1;
		    if (a.name < b.name) return -1;
		    return 0;
		});
		var lastClass = "";
		var lastParent = null;
		for (var i = 0; i < n.length; i++) {
		    var c = n[i];
		    if (c instanceof wm.TypeDefinitionField) {
			;
		    } else if (c.declaredClass != lastClass) {
			var img = this.getComponentImage(c);
			var lastParent = this.newTreeNode(inNode, img, "<span class='TreeHeader'>" +c.declaredClass + "</span>");
			this.buildTreeGroupContextMenu(lastParent, c.declaredClass);
			lastClass = c.declaredClass;
		    }
		    this.componentToTree(lastParent, c, inType);
		}
	    }
	},
	componentsToTree_rev: function(inNode, inComponents, inTypes, inType) {
		var n = [], cn;
		for (cn in inComponents) { n.push(cn); }
		n.sort();
		for (var i=0; (cn=n[i]); i++) {
			var comp = inComponents[cn];
			if (this._instanceOf(comp, inTypes)) {
				var key = "";
				if (comp instanceof wm.Query)
					key = comp.dataModelName;
				else if (comp instanceof wm.LiveView) {
					key = comp.service;
                                }

				if (key && key == inNode.content)
					this.componentToTree(inNode, comp, inType);
			}
		}
	},
	addComponentToTree: function(inComponent, inType) {
		this.refreshDesignTrees();
	},
	removeComponentFromTree: function(inComponent) {
		// FIXME: scroll tree to top to avoid flashing
		this.tree.domNode.scrollTop = 0;
		//this.componentsTree.domNode.scrollTop = 0;
		this.refreshDesignTrees();
	},
	renameComponentOnTree: function(inOld, inNew, inComponent) {
		var n = inComponent._studioTreeNode;
		if (n)
			n.setContent(inNew);
	},
	selectInTree: function(inComponent) {
		if (inComponent) {
			var n = inComponent._studioTreeNode;
			if (n) {
				n.tree.select(n);
				// find and goto layer on which tree resides
				var p = n.parent;
				while (p && (p != this.page.root) && !(p instanceof wm.Layer))
					p = p.parent;
				if (p)
					p.show();
				//if (p && p instanceof wm.Layer)
				//	p.parent._setLayer(p);
			}
		}
	},
	refreshComponentOnTree: function(inComponent) {
		var n = inComponent._studioTreeNode;
		if (n) {
			n.removeChildren();
			this.subWidgetsToTree(n, inComponent);
		}
	},
	// FIXME: stopgaps until these things are properly Componentized
	treeNodeSelect: function(inNode) {
		var c = inNode.component;
		this.select(c);
		if (c) {
			if (c.designSelect) {
				return c.designSelect();
			}
			this.navGotoDesignerClick();
		}
		if (!c) {
			var c = inNode.content;
			switch(c){
				case "Designer":
					this.navGotoDesignerClick();
					break;
				case "Source":
					this.navGotoSourceClick();
					break;
			}
		}
	},
    buildTreeGroupContextMenu: function(inNode, inClassName) {
	dojo.connect(inNode.domNode, dojo.isFF ? "onmousedown" : "oncontextmenu", this, function(e) {
		if (dojo.isFF && !(e.button == 2 || e.ctrlKey)) return;
		dojo.stopEvent(e);		
	    var menuObj = studio.contextualMenu;
	    menuObj.removeAllChildren();
	    if (inClassName != "wm.DataModel") 
	    menuObj.addAdvancedMenuChildren(menuObj.dojoObj, 
					    {label: "New " + inClassName,
					     onClick: dojo.hitch(this, function() {
						 var props = {owner: studio.page,
							      _designer: studio.page._designer,
							      name: studio.page.getUniqueName(studio.makeName(inClassName))};
						 var ctor = dojo.getObject(inClassName);

						 /* all this code copied from Palette.js */
						 studio.application.loadThemePrototypeForClass(ctor);
						 var comp = new ctor(props);

						 if (!(comp instanceof wm.ServerComponent)) {
						     // create an undo task
						     new wm.AddTask(comp);
						 }
						 if (comp instanceof wm.Control) {
						     //comp.designMoveControl(this.dragger.target, this.dragger.dropRect);
						     this.dragger.target.designMoveControl(comp, this.dragger.dropRect);
						 }
						 if (!wm.fire(comp, "afterPaletteDrop")) {
						     // FIXME: should not refresh entire tree when dropping from palette.
						     studio.refreshDesignTrees();
						     studio.inspector.resetInspector();
						     studio.select(comp);
						 }


					     })
					    });
	    menuObj.addAdvancedMenuChildren(menuObj.dojoObj, 
					    {label: inClassName + " docs...", 
					     onClick: dojo.hitch(this, function() {
						 window.open("http://dev.wavemaker.com/wiki/bin/PropertyDocumentation/" + inClassName.replace(/^.*\./,""));
					     })
					    });


	    menuObj.update(e, inNode.domNode);
	});

    }
})
