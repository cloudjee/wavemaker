/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
		//this.componentsTree.clear();
		//this.dataTree.clear();
	},
	refreshDesignTrees: function() {
		//this.refreshComponentsTree();
		this.refreshWidgetsTree();
		// re-select selected component
		this.selectInTree(this.selected);
	},
	refreshWidgetsTree: function() {
		this.tree.clear();
		this.widgetsTree.clear();
		if (this.application)
			this.appComponentsToTree(this.tree);
		if (this.page) {
			this.pageComponentsToTree(this.tree);
			this.widgetToTree(this.widgetsTree.root, this.page.root);
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
	    var dialogs = this.getTreeComponents(this.page.components, null, [wm.Dialog]);

	    var cmpCount = 0;
	    for (cmp in components) cmpCount++;
	    for (cmp in dialogs) cmpCount++;
	    this.useHierarchy =  (cmpCount > 6);

	    this.componentsToTree(n, components);
	    this.componentsToTree(n, dialogs);
	    this.useHierarchy = false;
	},
	appComponentsToTree: function(inTree) {
		// app components
		var n = this.newTreeNode(inTree.root, "images/project_16t.png", "Project (" + studio.project.projectName + ")");
	        n.component = n.owner = this.application
	        this.application._studioTreeNode = n;
	    this.excTypes = [wm.Query, wm.LiveView];
		if (this.application) {
		    this.svrComps = this.getTreeComponents(this.application.getServerComponents(), this.excTypes);
		    this.otherComps = this.getTreeComponents(this.application.components, this.excTypes);
		    
		    var cmpCount = 0;
		    for (cmp in this.svrComps) cmpCount++;
		    for (cmp in this.otherComps) cmpCount++;
		    this.useHierarchy =  (cmpCount > 6);
			

		    this.componentsToTree(n, this.svrComps);
		    this.componentsToTree(n, this.otherComps);
		    this.useHierarchy = false;
		}
	},
	addQryAndViewToTree: function(inNode) {
		this.componentsToTree_rev(inNode, this.svrComps, this.excTypes);
		this.componentsToTree_rev(inNode, this.otherComps, this.excTypes);
	},
	newTreeNode: function(inParent, inImage, inName, inClosed, inProps) {
		inProps = dojo.mixin(inProps || {}, {image: inImage, content: inName, closed: inClosed});
		return new wm.TreeNode(inParent, inProps);
	},
	getClassNameImage: function(inClassName) {
		var i = wm.Palette.items[inClassName] || 0;
		return i.image;
	},
	getComponentImage: function(inComponent) {
		var ci = this.getClassNameImage(inComponent.publishClass);
		return ci || inComponent.image || ("images/wm/" + (inComponent instanceof wm.Widget ? "widget" : "component") + ".png");
	},
	newComponentNode: function(inParent, inComponent, inName, inImage, inProps) {
		var
			// get node closed state
			o = inComponent && inComponent._studioTreeNode,
			closed = o ? o.closed : (inProps && inProps.closed),
			img = inImage || this.getComponentImage(inComponent),
			name = inName || inComponent._treeNodeName || inComponent.name,
			n = this.newTreeNode(inParent, img, name, closed, inProps);
		if (inComponent) {
			n.component = inComponent;
			inComponent._studioTreeNode = n;
		}
		return n;
	},
	widgetToTree: function(inNode, inWidget) {
		if (inWidget) {
		    if (inWidget.flags.notInspectable || inWidget.isParentLocked() || inWidget instanceof wm.Dialog)
				return;
		    var n = this.newComponentNode(inNode, inWidget);
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
		    props.closed = inComponent instanceof wm.Dialog || inComponent instanceof wm.Control == false;
			inNode = wm.fire(inComponent, "preNewComponentNode", [inNode, props]) || inNode;
			var n = this.newComponentNode(inNode, inComponent, null, null, props);
  		        if (inComponent instanceof wm.TypeDefinition || inComponent instanceof wm.DesignableDialog)
			    this.subWidgetsToTree(n, inComponent);
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
		    if (c.declaredClass != lastClass) {
			var img = this.getComponentImage(c);
			lastParent = this.newTreeNode(inNode, img, c.declaredClass);
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
				var key;
				if (comp instanceof wm.Query)
					key = comp.dataModelName;
				else if (comp instanceof wm.LiveView) {
					key = comp.service;
				}

				if (key == inNode.content)
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
				while ((p != this.page.root) && !(p instanceof wm.Layer))
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
	}
})
