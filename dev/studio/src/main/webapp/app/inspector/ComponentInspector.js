/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
 
dojo.provide("wm.studio.app.inspector.ComponentInspector");
dojo.require("wm.studio.app.inspector.Inspector");
dojo.require("wm.studio.app.inspector.BindInspector");
dojo.require("wm.studio.app.inspector.StyleInspector");
dojo.require("wm.studio.app.inspector.SecurityInspector");
dojo.require("wm.base.widget.Tree");

dojo.declare("wm.ComponentInspector", wm.Layers, {
    inspectors: {
	Properties: wm.BindInspector,
	"Events": wm.EventInspector,
	"CustomMethods": wm.CustomMethodInspector,
	Styles: wm.StyleInspector,
	Security: wm.SecurityInspector,
	Data: wm.DataInspector,
	Navigation: wm.NavigationInspector
    },
    init: function() {
	//this.subscribe("wmwidget-rename", this, "reinspect");
	this.inherited(arguments);
	this._inspectors = {};
	for (var i in this.inspectors) {
	    var ctor = this.inspectors[i];
	    this._inspectors[i] = new ctor({border: 0, name: i, parent: this.addLayer(i), owner: this});
	}
    },
    /* Inspect the specified component
     * NOTE: inInspectorProps is actually a tree node from the tree over the properties panel, 
     *       and is used to tell us which subcomponent we are editting properties for
     */
    inspect: function(inComponent, inInspectorProps) {
	try {
	    var wasInspecting = this.inspected;

	    var c = this.inspected = inComponent;
	    if (inInspectorProps)
		this.inspectorProps = inInspectorProps;
	    var ip = this.inspectorProps ;
	    var n = ip && ip.inspector;
	    var inspector = this.getInspector();

	    var changedNode = (this._lastNodeName != ip._nodeName);
	    this._lastNodeName = ip._nodeName;

	    // If we're inspecting the same component with the same inspector, call reinspect
	    if (inspector == this._currentInspector && inComponent == wasInspecting && !changedNode && this.dijits && inspector.tableContainer.innerHTML) {

		// Update all values in the property inspector UI
		this._currentInspector.reinspect();
	    } else if (inspector) {

		// If we have any dijits, we'll need to destroy them all as we'll be reusing those IDs
		if (this.dijits) dojo.forEach(this.dijits,function(d) {
		    var node = d.domNode;
		    while (node && node.id.match(/^propinspect_row/) == null) {
			node = node.parentNode;
		    }
		    d.destroy();
		    if (node)
			dojo.destroy(node); // we need to clean up these node IDs so that data fields in the data inspector can use these names as well
		});

		// Cache the current inspector
		this._currentInspector = inspector;

		// Generate the property inspector UI
		inspector.inspect(c);

		// Turn all editors into dijits and cache them so we can destroy them later
		try {
		    this.dijits = dojo.parser.parse(this.domNode);
		} catch(e) {
		    dijit.registry._hash = {};
		    this.dijits = dojo.parser.parse(this.domNode);
		}
	    }
	} catch(e) {
	    console.error(e);
	}
    },

    /* Lookup which inspector should do the editting based on which node in the top property tree is selected */
    getInspector: function() {
	var selected = this.parent.tree.selected.inspector;
	switch(selected) {
	case "Properties":
	    return this._inspectors.Properties;
	case "Events":
	    return this._inspectors.Events;
	case "CustomMethods":
	    return this._inspectors.CustomMethods;
	case "Security":
	    return this._inspectors.Security;
	case "Data":
	    return this._inspectors.Data;
	case "Navigation":
	    return this._inspectors.Navigation;
	case "Styles":
	    if (this._inspectors.Styles.getActiveLayer().name == "properties") {
		return this._inspectors.Properties;
	    } else {
		return this._inspectors.Styles;
	    }
	}

    },

    /* If reinspect is called, verify that we are using the same inspector or we need to call inspect to generate new
     * editors instead of reinspect to populate existing editors
     */
    reinspect: function() {	    
	var requiredInspector = this.getInspector();
	var inspectorProps = this.parent.tree.selected.inspector;
	if (this._currentInspector != requiredInspector || this.inspectorProps.inspector != inspectorProps || !requiredInspector.tableContainer.innerHTML)
	    return this.inspect(this.inspected);
	if (this.inspected && this.inspectorProps) {
	    this._currentInspector.reinspect(this.inspected);
	}
    },

    /* Focus on the default property; we've discontinued doing this, but may resume... */
    focusDefault: function() {
	var inspector = this.getInspector();
	wm.fire(inspector, "focusDefault");
    },

    /* I believe that select mode is used when seting up composites and wm.Property classes */
    setSelectMode: function(inMode) {
	for (var i in this.inspectors) {
	    this._inspectors[i].setSelectMode(inMode);
	}
    },
    writeChildren: function() {
    }
});

// magic schema stuff:
// category: inspector root tree node name
// categoryProps: inspector root tree node properties
// categoryParent: a parent node in the inspector
dojo.declare("wm.ComponentInspectorPanel", wm.Panel, {

    /* The ComponentInspectorPanel is a Tree, splitter and a ComponentInspector */
    init: function() {
	this.inherited(arguments);
	var t = ['{',
		 'inspectorTree: ["wm.Tree", {height: "120px", border: 0}, {}, {}],',
		 'splitter3: ["wm.Splitter", {layout: "top", border: 0}, {}, {}],',
		 'inspectorLayers: ["wm.ComponentInspector", {border: 0, flex: 1, box: "v", autoScroll: false}, {}, {}]',
		 '}'];
	this.readComponents(t.join(''));
	this.tree = this.owner.inspectorTree;
	this.inspector = this.owner.inspectorLayers;
	this.connect(this.tree, "onselect", this, "treeSelect");
    },

    clearTree: function() {
	if (this.tree)
	    this.tree.clear();
	this.treeNodes = {};
    },

    // whether a tree node is shown is controlled by the property info first and then the inspector
    canInspect: function(inInspector, inNodeProps) {
	var i = inInspector, cs = inNodeProps.canInspect, ics = "canInspect", r;
	if (cs && this[cs])
	    r = this[cs](this.inspected, this.props);
	else if (i && i[ics])
	    r = i[ics](this.inspected, this.props);
	else
	    r = true;
	if (inInspector)
	    inInspector.active = r;
	return r;
    },

    // Add nodes to the tree...
	_addTreeNode: function(inInspector, inParent, inProps) {
		var i = inInspector, a = inProps.addTreeNode, ia = (i||0).addTreeNode;
		if (a && this[a])
			return this[a](inParent, this.inspected, inProps, this.props)
		else if (ia)
			return ia.apply(i, [inParent, this.inspected, inProps, this.props, this.treeNodes]);
		else
			return new wm.TreeNode(inParent, inProps);
	},
	addTreeNode: function(inNodeName, inProps, inParent) {
		inParent = inParent || this.tree.root;
		inProps = inProps || {};
		inProps.inspected = this.inspected && this.inspected.getId();
		inProps._nodeName = inNodeName;
	        inProps.content = wm.extendSchemaDictionary["NODE_" + inNodeName] || inProps.content || inNodeName;
		inProps.inspector = inProps.inspector || inParent.inspector;
		inProps.image = inProps.image || inParent.image;
		// FIXME: need to potentially create inspector if it doesn't exist
		var ni = this.getInspector(inProps.inspector);
		if (!this.canInspect(ni, inProps))
			return;
		// add node
		var n = this._addTreeNode(ni, inParent, inProps);
		if (n)
			this.treeNodes[n._nodeName || inNodeName] = n;
		return n;
	},
	addTreeSubNode: function(inName, inProps, inParent) {
		var
			np = { content: inName };
		dojo.mixin(np, inProps || {});
		this.addTreeNode(inParent._nodeName + '.' + inName, np, inParent);
	},
	// FIXME: let's not add these to prop tree
	/*addCollectionTreeNode: function(inComponent) {
		var
			collection = inComponent.collection,
			comps = inComponent.getCollection();
		if (!this.treeNodes[collection])
			this.addTreeNode(collection, {image: "images/item.png", isCollection: true});
		var n = this.treeNodes[collection];
		dojo.forEach(comps, dojo.hitch(this, function(c) {
			this.addComponentTreeNode(c.name, {isCollection: true}, n);
		}));
	},*/
	initTree: function(inComponent) {
		this.clearTree();
		this.props = inComponent && inComponent.listProperties();
	    this.addTreeNode("Properties", {content: studio.getDictionaryItem("wm.ComponentInpsectorPanel.PROPERTY_NODE_CAPTION"), image: "images/properties_16.png", inspector: "Properties"});
		this.addTreeNode("Events", {content: studio.getDictionaryItem("wm.ComponentInpsectorPanel.EVENT_NODE_CAPTION"), image: "images/star_16.png", inspector: "Events"});
		this.addTreeNode("CustomMethods", {content: studio.getDictionaryItem("wm.ComponentInpsectorPanel.CUSTOMMETHOD_NODE_CAPTION"), image: "images/star_16.png", inspector: "CustomMethods"});
		// component props
		var props = this.props, p;
		for (var i in props) {
			p = props[i];
			if (p.category && !(p.category in this.treeNodes) && p.categoryProps)
				this.addTreeNode(p.category, p.categoryProps);
			// specific to adding components.
			else if (p.categoryParent) {
				var n = this.treeNodes[p.categoryParent];
				if (n)
					this.addTreeSubNode(i, p.categoryProps, n);
			}
		}
		// FIXME: let's not put these in tree
		// auto add collection
		/*for (var i in props)
			if (i == "collection")
				this.addCollectionTreeNode(inComponent);
		*/
	},
	// FIXME: just refreshes the node if it's part of a collection right now
	/*refreshTree: function() {
		var c = this.selectedNode, c = (n || 0).component;
		var nodes = this.tree.root.kids;
		for (var i=0, n; (n=nodes[i]); i++)
			if (n.isCollection) {
				n.removeChildren();
				this.addCollectionTreeNode(this.inspected);
				break;
			}
		if (c && n)
			this._selectComponent(n, c);
	},*/
	_selectComponent: function(inNode, inComponentName) {
		for (var i=0, kids = inNode.kids; (k=kids[i]); i++)
			if (k.component == inComponentName) {
				k.tree.select(k);
				this.selectedNode = k;
				return true;
			}
	},
	getInspector: function(inInspectorName) {
		return this.inspector._inspectors[inInspectorName];
	},
	updateInspectorLayer: function(inInspectorName) {
		var
			n = this.inspectorName = inInspectorName,
			i = this.getInspector(n);
		wm.fire((i||0).parent, "activate");
	},
	resetInspector: function() {
		this.inspectorName = null;
	},
	// inspector api
	inspect: function(inComponent) {
	        if (inComponent.noInspector) return;
		this.inspected = inComponent;
		this.initTree(inComponent);
		// update tree selection...
		var n = this.selectedNode = this.treeNodes[this.inspectorName] || this.treeNodes["Properties"];
	        this.tree.select(n);	        
	},
	reinspect: function() {
		// if we have a component, inspect it
		var n = (this.selectedNode ||0).component;
		if (n) {
			this.inspectComponent(n, this.selectedNode);
		} else if (this.inspector.inspected == this.inspected) {
		    this.inspector.reinspect();
		} else {
		    this.inspector.inspect(this.inspected, this.selectedNode);
		}
	},
	focusDefault: function() {
		wm.fire(this.inspector, "focusDefault");
	},
	treeSelect: function(inNode) {
		if (inNode.inspector)
			this.updateInspectorLayer(inNode.inspector);
		this.selectedNode = inNode._nodeName && this.treeNodes[inNode._nodeName];
		this.reinspect();
	},
	inspectComponent: function(inComponentName, inInspectorProps) {
		this.inspector.inspect(this.inspected.getComponent(inComponentName), inInspectorProps);
	},
	refreshComponent: function(inSubComponent) {
		// look for component in properties or collection node
		var n = (inSubComponent || 0).name;
		for (var i=0, kids = this.tree.root.kids, k, f; (k=kids[i]); i++)
			if (k._nameName == "Properties" || k.isCollection) {
				var f = this._selectComponent(k, n);
				if (f)
					break;
			}
	},
	setSelectMode: function(inMode) {
		this.inspector.setSelectMode(inMode);
	},
	writeChildren: function() {
	}
});