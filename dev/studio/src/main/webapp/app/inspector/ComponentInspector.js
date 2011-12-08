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


 /* New definition for property schema
  * ignore: not written; not editable EVEN IF IT IS A bindTarget (this EVEN IF is new and will cause a few bugs till everything is updated)
  * hidden, writeonly: both mean that the user doesn't see them.  writeonly though shows if its bindable/bindTarget. Both are written whether visible or not.
  * ignoretmp: This property is ignored for its current state; currently we disable/enable the disabled property editor; previously hidden/shown as needed
  * ignoreHint: Hint to give to property editors shown as disabled due to ignoretmp
  * options: array of options for a wm.SelectMenu
  * shortname: Alternate name to show instead of the real name; used for localization and for human readable prop names
  * operation: Show a button instead of an editor; component must have a method with the same name as the property name. If boolean, calls this.propertyName(); if a string it calls this[prop.operation]()
  * method: treat a property as a method, there only for property documentation and autocompletion
  * pageProperty: Used by the bind dialog to determine the property to use to find the subpage and let the user browse the subpage's properties
  * editor: Name of an editor class; typically an editor from propertyEdit.js which knows how to setup its own options
  * editorProps: Properties to pass in when creating editor; only has meaning if "editor" is specified
  * subtype: Currently supports a value of "file" telling it that the bind button should go to the resources panel
  * extensionMatch: For subtype=file, contains an array of valid file extensions to bind to
  * nonlocalizable: property should not be written to localization dictionaries
  * doc: if the property isn't a method, and its not visible (ignored), this signals that its still something the user should know about, just not in the properties panel
  * simpleBindProp: This property is the only property to show for this widget under the basic bind dialog
  * categoryParent: OLD DEF: Adds a tree node to the property panel to the node with the given name; selecting the node shows the properties for the component specified in categoryProps
  * categoryProps.component: inspector will inspect this[categoryProps.component] (i.e. this.dataOutput) 
  * categoryProps.inspector: OLD DEF: Specifies which inspector to use to inspect this component
  * createWire: creates a wire instead of calling setProp
  * readonly: useful for bindable props; user can see them, bind them, but not directly edit the property.  They only write the binding, not the value! TODO: USE THIS!  NOTE: readonly is ignored when setting the property editor's readonly state if createWire is true
  * subcomponent: the property refers to a subcomponent whose properties should be displayed in the property panel
  *
  * How to control what editor shows up for a property
  * 1. Default behavior: the type of the current value determines the type of editor; if its a number you get a wm.Number; if its boolean you get a checkbox; else you get wm.Text
  * 2. Your type schema can specify an editor; this overrides the type from default behavior    width: { group: "layout", order: 20, doc: 1, editor: "wm.prop.SizeEditor"}
  * 3. makePropEdit method in any given component can override all other methods of specifying the editor; you can return an editor from makePropEdit to be used for editing the prop
  */
 /* TODO:
  * 1. For every widget, change group: 'method' to method: true
  * 2. For every widget add operation: 1 to group: "operation" or other buttons
  * 3. Remove use of ignore when what we really want is writeonly or readonly
  * 4. Find all setPropEdit methods and remove them
  * 5. Finda all editProp methods and remove everything that can be removed
  * 6. Find all makeEditProp methods and remove everything that can be removed
  * 7. Make a _design files for every component
  * 8. Find all bindable/bindTarget properties that should be readonly and make them readonly
  */
 dojo.declare("wm.PropertyInspector", wm.AccordionLayers, {
     ignoreHintPrefix: "<p><b>Disabled</b></p>",
     classNames: "wminspector",
     layerBorder: 0,
     autoScroll: true,
     inspected: null,
     props: null,
     dataSets: [],
     postInit: function() {
	 this.inherited(arguments);
	 this.layers[0].destroy();
     },
     inspect: function(inComponent, forceInspect) {	
	 if (this.inspected == inComponent && !forceInspect) {
	     return this.reinspect();
	 }
	 this._inspecting = true;
	 var activeLayer = this.getActiveLayer();
	 if (activeLayer)
	     this._activeLayer = activeLayer.caption;
	 try {
	     this.inspected = inComponent;
	     while (this.layers.length)
		 this.layers[0].destroy();
	     while(this.dataSets.length)
		 this.dataSets[0].destroy();
	     this.props = this.getProps(inComponent,false);
	     this.editorHash = {};
	     this.bindEditorHash = {};
	     this.subcomponents = {};
	     this.generateGroups(inComponent);
	 } catch(e) {
	     console.error(e);
	 } finally {
	     this._inspecting = false;
	 }
	 if (this._reselectLayerIndex !== undefined && this._reselectLayerIndex < this.layers.length)
	     this.setLayerIndex(this._reselectLayerIndex);
	 else
	     this.setLayerIndex(0);
     },
     reinspect: function(inSubComponent) {
	 var inComponent = inSubComponent || this.inspected;
	 this._inspecting = true;
	 try {
	     var props = this.getProps(inComponent,false);
	     for (var i = 0; i < props.length; i++) {
		 var p = props[i];
		 var propName = p.name;


		 if (p.subcomponent) {
		     var subcomponent = inComponent.$[propName];
		     if (this.subcomponents[subcomponent.getId()] && 
			 this.subcomponents[subcomponent.getId()].className == subcomponent.declaredClass) {
			 this.reinspect(subcomponent);
		     } else if (this.subcomponents[subcomponent.getId()]) {
			 var subComponentParent = this.subcomponents[subcomponent.getId()].parent;
			 delete this.subcomponents[subcomponent.getId()];

			 subComponentParent.removeAllControls();
			 for (var name in this.editorHash) {
			     var componentid = name.replace(/\.[^\.]*$/,"");
			     if (componentid == subcomponent.getId()) {
				     delete this.editorHash[name];
			     }
			 };
			 var props = this.props;
			 this.props = this.getProps(subcomponent,true);
			 this.generateEditors(subcomponent, "", subComponentParent);
			 this.props = props;

			 this.subcomponents[subcomponent.getId()] = {className: subcomponent.declaredClass,
								     parent: subComponentParent};
		     } else {
			 var currentLayer;
			 dojo.forEach(this.layers, function(l) {if (l._groupName == p.group) currentLayer = l;});
			 if (!currentLayer) {
			     var y = this.addLayer(g.displayName);
			     y.header.setMargin("0,2,2,2");
			     y.header.setBorder("1");
			     y.header.setBorderColor("#333");
			     currentLayer._groupName = p.group;
			     this.generateLayer = currentLayer;
			 }

			 this.generateEditors(subcomponent, p.group, currentLayer);
		     }
		 } else {
		     var e = this.editorHash[inComponent.getId() + "." + propName];
		     if (e && e.isDestroyed) {
			 delete this.editorHash[inComponent.getId() + "." + propName];
			 e = undefined;
		     }
		     var binde = this.bindEditorHash[inComponent.getId() + "." + propName];
		     if (!e) {
			 continue;
		     }
		     /* Menus must be regenerated; at least until we have a better way of getting the list of options updated */
		     if (e instanceof wm.SelectMenu || e instanceof wm.prop.SelectMenu) {
			 var parent = e.parent;

			 parent.removeAllControls();
			 e = this.generateEditor(inComponent,p, parent.parent, parent);
			 this.editorHash[inComponent.getId() + "." + propName] = e;
		     } else if (e) {
			 var newVal;
			 if (inComponent.$.binding && inComponent.$.binding.wires[propName]) {
			     newVal = inComponent.$.binding.wires[propName].source;
			 } else {
			     newVal = inComponent.getProp(propName);
			 }

			 // if you call getDataValue on a NumberEditor whose displayValue is a bind expression, you get back undefined
			 // because its not a number
			 if (e instanceof wm.AbstractEditor) {
			     var oldVal = e.showing ? e.getDataValue() : binde && binde.showing ? binde.getDataValue() : e.getDataValue();
			     if (newVal !== oldVal) {
				 e.setDataValue(newVal);
			     } else if (typeof newVal == "object" && newVal !== null) {
				 e.setDataValue(newVal);// make sure the editor sees the updated hash or array
			     }
			 }
			 e.setDisabled(p.ignoretmp);
			 e.setHint(p.ignoretmp && p.ignoretmp ? this.ignoreHintPrefix +  p.ignoreHint : "");
		     }

		     if (p.bindable || p.bindTarget) {
			 var isBound = inComponent.$.binding && inComponent.$.binding.wires[propName];
			 e.setShowing(!isBound);
			 this.bindEditorHash[inComponent.getId() + "." + propName].setShowing(isBound);
			 e.parent.setHeight((isBound ? this.bindEditorHash[inComponent.getId() + "." + propName].bounds.h : e.bounds.h) +  "px");
			 var wire = inComponent.$.binding.wires[propName];
			 this.bindEditorHash[inComponent.getId() + "." + propName].setDataValue(wire ? wire.expression || wire.source : "");
		     }
		 }

	     }
	 } catch(e) {
	     console.error(e);
	 } finally {
	     this._inspecting = false;
	     this.reflow();
	 }
     },
     isEditableProp: function(inProp) {
	 if (inProp.ignore)
	     return false;
	 if (inProp.bindTarget || inProp.bindable) 
	     return true; // shows up even if writeonly/hidden are true; user can't set the value but can bind the value
	 if (inProp.writeonly || inProp.hidden) /* writeonly and hidden appear to be identical */
	     return false;
	 if (inProp.method)
	     return false;
	 return true;
     },
     getProps: function(inComponent,isSubComponent) {
	 if (isSubComponent && (inComponent.declaredClass == "wm.Variable" || inComponent.declaredClass == "wm.ServiceInput")) {
	     var props = [];
	     var propsHash = inComponent._dataSchema;
	     for (var i in propsHash) {
		 propsHash[i].name = i;
		 props.push(propsHash[i]);
	     }
	     return props;
	 }

	 var allProps = inComponent ? inComponent.listProperties() : {};
	 var props = [];
	 for (var i in allProps) {
	     if (this.isEditableProp(allProps[i])) {	     
		     var p = dojo.mixin({name: i}, allProps[i]);
		 if (allProps[i].isEvent || inComponent.isEventProp(i)) {
		     p.group = "events";
		     if (i.match(/\d$/)) continue; // ignore events that end in numbers; these are the "and-then" events, which are handled by the event editor
		 } else if (allProps[i].isCustomMethod) 
		     p.group = "CustomMethods";
		 else if (!allProps[i].group) 
		     p.group = "Properties";
		 props[i] = p;
	     }
	 }
	 if (isSubComponent) {
	     delete props.owner;
	     delete props.name;
	     delete props.viewDocumentation;
	     delete props.generateDocumentation;
	 }
	 var newprops = [];
	 for (var propName in props) {
	     newprops.push(props[propName]);
	 }

	 newprops = newprops.sort(function(a,b) {
	     if (a.order !== undefined && b.order !== undefined)
		 return a.order - b.order;
	     else if (a.order !== undefined)
		 return -1;
	     else if (b.order !== undefined)
		 return 1;
	     else
		 return wm.compareStrings(a.name,b.name);
	 });

	 return newprops;
     },
     generateEditors: function(inComponent, inGroupName, inLayer) {
	 var props = this.props;
	 for (var i = 0; i < props.length; i++) {
	     var p = props[i];
	     var propName = p.name;
	     if (!inGroupName || inGroupName == p.group) {
		 if (p.operation) {
		     this.generateButton(inComponent, p, inLayer);
		 } else {
		     var e = this.generateEditor(inComponent,p, inLayer);
		 }
	     }
	 }
     },
     generateButton: function(inComponent,inProp, inLayer) {
	 var b = new wm.Button({
	     owner: this,
	     parent: inLayer,
	     width: "100%",
	     height: "30px",
	     caption: inProp.shortname || inProp.name
	 });
	 this.editorHash[inComponent.getId() + "." + inProp.name] = b;
	 b.connect(b, "onclick", this, function() {
	     inComponent[typeof inProp.operation == "string" ? inProp.operation : inProp.name]();
	     this.reinspect();
	 });
     },

     generateEditor: function(inComponent, inProp, inLayer, optionalParent) {
	 var value;
	 var isBound = false;
	 var propName = inProp.name;
	 var panel = optionalParent;
	 if (!panel) {
	     panel = new wm.Panel({
			 owner: this,
			 parent: inLayer,
			 name: "propEditPanel_" + inProp.name,
			 layoutKind: inProp.subcomponent ? "top-to-bottom" : "left-to-right",
			 width: "100%",
			 height: "30px", /* must adjust height to match editor height */
			 verticalAlign: "top",
			 horizontalAlign: "left"});
	 }


	 if (inComponent.$.binding && inComponent.$.binding.wires[propName]) {
	     value = inComponent.$.binding.wires[propName].source;
	     isBound = true;
	 } else {
	     value = inComponent.getProp(propName);
	 }
	 var editorProps = {
	     owner: this,
	     parent: panel,
	     disabled: Boolean(inProp.ignoretmp || inProp.writeonly),
	     hint: inProp.ignoretmp && inProp.ignoreHint ? this.ignoreHintPrefix + inProp.ignoreHint : "",
	     showing: !isBound,
	     name: "propEdit_" + inProp.name,
	     propName: inProp.name,
	     width: "100%",
	     height: "45px",
	     captionSize: "20px",
	     captionPosition: "top",
	     captionAlign: "left",
	     caption: inProp.shortname || inProp.name,
	     dataValue: value,
	     createWire: inProp.createWire,
	     inspected: inComponent /* Used by some of the custom editors in propertyEdit.js */
	 };

	 if (inProp.isEvent) {
	     editorProps.propName = inProp.name;

	     var e = new wm.prop.EventEditorSet(editorProps);
	     this.editorHash[inComponent.getId() + "." + inProp.name] = e;
/*
	     var addEventLabel = new wm.Label({owner: this,
					       parent: panel,
					       caption: "+",
					       width: "16px",
					       height: "16px",
					       onclick: dojo.hitch(this, function() {
						   for (var i = 1; this.inspected.eventBindings[props.propName + i] !== undefined; i++) ;
						   this.inspected.eventBindings[props.propName + i] = "-";
						   this.inspected[props.propName + i] = function(){};
						   var parent = e.parent.parent;
						   var newIndex = parent.indexOfControl(e.parent)+1;
						   var newe = this.generateEditor(this.inspected, 
										  {isEvent: true,
										   group: "events",
										   name: props.propName + i},
										  parent);
						   parent.c$ = parent.c$.sort(function(a,b) {return wm.compareStrings(a.name,b.name);});
						   parent.setHeight(parent.getPreferredFitToContentHeight() + "px");										  
						   parent.reflow();
					       })});
					       */
					       
	 } else {
	  var e = inComponent.makePropEdit(inProp.name, value, editorProps);
	  if (!e || e instanceof wm.Control == false) {
	      var ctor;
	      if (inProp.subcomponent) {		

		  var props = this.props;
		  var subcomponent = inComponent.$[propName];
		  this.subcomponents[subcomponent.getId()] = {className: subcomponent.declaredClass,
							      parent: panel};
		  this.props = this.getProps(subcomponent,true);
		  this.generateEditors(subcomponent,"", panel);
		  this.props = props; // cache the current props until the subcomponent inspection is done

		      panel.setHeight(panel.getPreferredFitToContentHeight() + "px");
		  return;
	      } 
	      if (inProp.editor) {
		  ctor = dojo.getObject(inProp.editor);
		  if (ctor && ctor.prototype instanceof wm.Control) {
		      var standardHeight = parseInt(wm.AbstractEditor.prototype.height);
		      var ctorHeight = parseInt(ctor.prototype.height);
		      if (ctorHeight > standardHeight) {
			  editorProps.height = (parseInt(editorProps.height) + ctorHeight-standardHeight) + "px";
		      }
		  }
		  if (inProp.editorProps) {
		      editorProps = dojo.mixin(editorProps, inProp.editorProps);
		  }
	      } else if (inProp.options) {
		  ctor = wm.SelectMenu;
		  editorProps.options = inProp.options;
		  editorProps.displayField = editorProps.dataField = "dataValue";
	      } else {
		  switch(String(inProp.type).toLowerCase() || typeof value) {
		  case "boolean":
		      ctor = wm.Checkbox;
		      editorProps.startChecked = Boolean(value);
		      editorProps.captionSize = "100%";
		      editorProps.captionPosition = "left";
		      editorProps.emptyValue = "false";
		      editorProps.dataType = "boolean";
		      editorProps.checkedValue = true;
		      editorProps.height = wm.Checkbox.prototype.height;
		      break;
		  case "number":
		      ctor = wm.Number;
		      break;
		  default:
		      ctor = wm.Text;
		  }
	      }
	      var e =  new ctor(editorProps);
	  }
	  if (inProp.readonly && e.setReadonly && !inProp.createWire && !e.createWire) {
	      e.setReadonly(true);
	  }

	  e.connect(e, "onchange", this, function(inDisplayValue, inDataValue) {
	      if (inComponent.isDestroyed) return;
	      if (!this._inspecting) {
		  try {
		  if (e.createWire) {
		      if (!inDataValue) {
			  inComponent.$.binding.removeWire(inProp.name);
			  inComponent.setProp(inProp.name, undefined);
		      } else if (inDataValue && typeof inDataValue == "string") {
			  inComponent.$.binding.addWire("", inProp.name, inDataValue);
		      }
		  } else {
  /* TODO: PROPINSPECTOR CHANGE: Need to use the UNDOABLE TASK MANAGER */
		      inComponent.setProp(inProp.name, inDataValue);
		  }
		  } catch(e) {}
		  if (inComponent.isDestroyed) return; // in case the widget was destroyed by this operation, stop now...
		  if(!e.noReinspect)
		      this.reinspect();
	      }
	  });
	 }
	 this.editorHash[inComponent.getId() + "." + inProp.name] = e;

	 if (inProp.bindable || inProp.bindTarget) {
	     var bindableEditor = new wm.Text(dojo.mixin(editorProps, 
							 {	
							     captionSize: (e.captionSize == "100%") ? "80px" : e.captionSize,
							     disabled: true,
							     hint: inProp.ignoretmp && inProp.ignoreHint ?  this.ignoreHintPrefix + inProp.ignoreHint : "",
							     resetButton: true,
							     showing: isBound,
							     name: "propEdit_" + inProp.name,
							     _resetButtonUrl: "images/inspector_bind_disabled.gif"
							 }));
	     bindableEditor._onResetClick = dojo.hitch(this, function() {
		 var parent = e.parent;
		 var w = inComponent.$.binding.wires[propName];
		 if (w) 
		     inComponent.$.binding.removeWire(w.getWireId());
		 bindableEditor.hide();
		 e.clear();
		 /* Clear causes onchange which causes reinspect which may destroy the editor */
		 if (!e.isDestroyed) {
		     e.show();
		     parent.setHeight(e.bounds.h + "px");
		 }
	     });
	     this.bindEditorHash[inComponent.getId() + "." + inProp.name] = bindableEditor;


	     var l = new wm.Label({owner:this,
				   parent: panel,
				   _classes: {domNode: ["wminspector-bindProp"]},
				   caption: "",
				   width: "20px",
				   height: "20px"});
	     var self = this;
	     l.onclick = function() {
		 studio.bindDialog.page.update({object: inComponent, targetProperty: propName});
		 var p = self.getBindDialogProps(inComponent,propName);
		 studio.bindDialog.page.update(p);
		 studio.bindDialog.show();
	     };
	 } else if (!inProp.isEvent) {
	     new wm.Spacer({owner:this,
			    parent: panel,
			    width: "20px",
			    height: "20px"});
	 }
	 var self = this;
	 var helpButton = wm.Label({owner: this,
				    caption: "",
					 parent: panel,
					 width: "20px",
					 height: "20px",
					 onclick: function() {
					     studio.helpPopup = self.getHelpDialog();
					     self.beginHelp(propName, e.parent.domNode, inComponent.declaredClass);
					 },
					 _classes: {domNode: ["EditorHelpIcon"]}});

	 panel.setHeight(panel.getPreferredFitToContentHeight() + "px");
	 return e;
     },
	 beginHelp: function(inPropName, inNode, inType) {
	       var bd = studio.helpPopup;
	       bd.page.setHeader(inType,inPropName);

	       bd.sourceNode = inNode;
	       //bd.positionNode = inNode.parentNode;
	       bd.fixPositionNode = inNode.parentNode;
	       bd.corner = "tl";
	     if (window.location.search.match(/editpropdoc/)) {
		 var classList = [];
		 studio.palette.forEachNode(function(node) {
		     if (node.klass) {
			 try {
			     var prototype = dojo.getObject(node.klass).prototype;
			     if (node.klass.match(/^wm\./) && node.klass != "wm.example.myButton" && prototype instanceof wm._BaseEditor == false && prototype instanceof wm.Editor == false && (!prototype.schema[inPropName] || !prototype.schema[inPropName].ignore)) {
				 if (prototype[inPropName] !== undefined || prototype["get" + wm.capitalize(inPropName)] !== undefined) {
				     var name = node.klass.replace(/^.*\./,"");
				     if (dojo.indexOf(classList, name) == -1)
					 classList.push(name);
				 }
			     }
			 } catch(e){}
		     }
		 });

		 dojo.forEach(classList, function(className,i) {
		     window.setTimeout(function() {
			 var version = wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/,"$1");
			 var url = studio.getDictionaryItem("wm.Palette.URL_CLASS_DOCS", {studioVersionNumber: version,
											  className: className.replace(/^.*\./,"") + "_" + inPropName});

			 app.toastInfo("Testing " + className + "." + inPropName);
			 studio.studioService.requestAsync("getPropertyHelp", [url + "?synopsis"], function(inResponse) {
			     if (inResponse.indexOf("No documentation found for this topic") != -1 || !inResponse) {
				 window.open(studio.getDictionaryItem("URL_EDIT_PROPDOCS", {studioVersionNumber: wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/,"$1")}) + 
					     className + "_" + inPropName + 
					     "?parent=wmjsref_" + version + "&template=wmjsref_" + version + ".PropertyClassTemplate&name=" + className + "_" + inPropName + "&component=" + className + "&property=" + inPropName, "HelpEdit " + i);
			     }
			 });
		     },
				       i * 1300);
		 });
	     } else {
		 if (inType == studio.application.declaredClass)
		     inType = "wm.Application";
		 var url = studio.getDictionaryItem("wm.Palette.URL_CLASS_DOCS", {studioVersionNumber: wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/,"$1"),
										  className: inType.replace(/^.*\./,"") + "_" + inPropName});

		 // clear previous content before showing.
		 bd.page.setContent("");
		 this._loadingContent = true;
		 bd.show();
		 studio.loadHelp(inType, inPropName, function(inResponse) {
		     wm.cancelJob("PropDoc");
		     this._loadingContent = false;
		     if (inResponse.indexOf("No documentation found for this topic") != -1 || !inResponse)
			 inResponse = "<a href='" + url + "' target='docs'>Open Docs</a><br/>" + inResponse;
		     bd.page.setContent(inResponse);
		 });

		 //  And in case of proxy problems, show the link so the user can open it themselves
		 wm.job("PropDoc", 1700, dojo.hitch(this, function() {
		     if (this._loadingContent)
			 bd.page.setContent("<a href='" + url + "' target='docs'>Open Docs</a><br/>If docs fail to show here, this may be due to a proxy server; just click the link to open it in a new page"); 
		 }));
	     }
	       /*
	       dojo.xhrGet({
		     url: "http://dev.wavemaker.com/wiki/bin/view/WM5_Documentation/",
		     handleAs: "html",
		     load: function(response,ioArgs) {
			   alert("Loaded: " + response);
		     },
		     error: function(response,ioArgs) {
			   console.log("HELP SYSTEM: Failed to load!");
			   console.dir(ioArgs);

 }
	       });
	       */
	       return true;
	 },


	 getHelpDialog: function() {
		 if (!studio.helpPopup) {
		     var props = {
			 owner: this,
			 pageName: "PopupHelp",
			 width: "500px",
			 height: "275px",
			 modal: false,
			 noEscape: false,
			 useContainerWidget: false,
			 hideControls: true,
			 corner: "tl"
		     };
		     var d = studio.helpPopup = new wm.PageDialog(props);
		 }
		 var b = studio.helpPopup;
		 return b;
	 },
     /* TODO: Make sure we handle subcomponents correctly, there was a lot of extra code in the previous version of inspector */
     getBindDialogProps: function(inComponent,inPropName) {
	     return {object: inComponent, targetProperty: inPropName};
	 },




     generateGroups: function(inComponent) {
	 var groups = this.initGroups(this.props);
	 for (var i = 0; i < groups.length; i++) {
	     var g = groups[i];
	     var layer = this.addLayer(g.displayName);
	     layer.header.setMargin("0,2,2,2");
	     layer.header.setBorder("1");
	     layer.header.setBorderColor("#333");
	     layer._groupName = g.name;
	     this.generateLayer = layer;
	     //this.generateEditors(inComponent,g.name, layer);
	     g.layer = layer;
	     if (this._activeLayer == g.displayName) {
		 this._reselectLayerIndex = this.layers.length-1;		
	     }
	     layer.connect(layer, "onShow", this, function() { 
		 var l = this.getActiveLayer();
		 var group;
		 for (var i = 0; i < groups.length; i++) {
		     if (groups[i].layer == l) {
			 group = groups[i];
			 break;
		     }
		 }
		 l.focusFirstEditor();
		 if (l.c$.length == 0) {
		     if (inComponent.isDestroyed) return;
		     this.generateEditors(inComponent, group.name, l);
		     l.reflow();
		 }
	     });
	 }
	 for (var i = 0; i < this.layers.length; i++) {
	     this.layers[i].setPadding("10,4,10,4");
	     this.layers[i].setFitToContentHeight(true);
	 }	
     },
	 // property groups
	 initGroups: function(inProps) {
	     var groups = this.buildGroups(inProps);
		 // sort groups
		 this.sortGroups(groups);
		 // fill in extra properties
		 dojo.forEach(groups, function(g) {
			 dojo.mixin(g, wm.propertyGroups[g.name] || {displayName: g.name});
		 });
		 return groups;
	 },
	 buildGroups: function(inProps) {
		 var groups = [], groupsArray = [], defaultGroup = "Properties";
		 dojo.forEach(inProps, dojo.hitch(this, function(o, n) {
			 if (!this.isEditableProp(o))
				 return;
			 var
				 name = (o && o.group) || defaultGroup || "ungrouped",
				 g = groups[name] || (groups[name] = []),
				 order = o && o.order != undefined ? o.order : 1000,
				 p = dojo.mixin({}, o, {name: n, order: order});
		     if (name != "method")
			 g.push(p);
		 }));
	     for (var i in groups) {
		 if (typeof(groups[i]) != "function") {
			 groupsArray.push({name: i, props: groups[i]});
		 }
	     }
		 return groupsArray;
	 },
	 sortGroups: function(inGroups) {
		 // sort groups
		 inGroups.sort(function(a, b) {
			 return ((wm.propertyGroups[a.name] || 0).order || 28) - ((wm.propertyGroups[b.name] || 0).order || 28); // things with no order go after layout and before style
		 });
		 // sort props in each group
		 dojo.forEach(inGroups, function(g) {
			 if (g.props.sort)
				 g.props.sort(function(a, b) {
					 var o = a.order - b.order;
					 return o == 0 ? wm.compareStrings(a.name, b.name) : o;
				 });
		 });
		 return inGroups;
	 },
     propertySearch: function(inDisplayValue) {
	 this.multiActive = Boolean(inDisplayValue);

	 /* Search only works if all property editors are generated */
	 if (inDisplayValue) {
	     for (var i = 0; i < this.layers.length; i++) {
		 var layer = this.layers[i];
		 if (layer.c$.length === 0) {
		     this.generateEditors(this.inspected, layer._groupName, layer);
		 }
	     }
	 }

	 var props = this.props;
	 for (var i = 0; i < props.length; i++) {
	     var prop = props[i];
	     var key = this.inspected.getId() + "." + prop.name;
	     var editor = this.editorHash[key];
	     if (editor) {
		 if (inDisplayValue === "") {
		     if (editor.parent instanceof wm.Layer) {
			 editor.show();
		     } else {
			 editor.parent.show();
		     }
		 
		 } else if (prop.name.toLowerCase().indexOf(inDisplayValue.toLowerCase()) != -1 ||
			    prop.shortname && prop.shortname.toLowerCase().indexOf(inDisplayValue.toLowerCase()) != -1) {
		     if (editor.parent instanceof wm.Layer) {
			 editor.show();
		     } else {
			 editor.parent.show();
		     }
		 } else {
		     if (editor.parent instanceof wm.Layer) {
			 editor.hide();
		     } else {
			 editor.parent.hide();
		     }
		 }
	     }
	 }

	 if (inDisplayValue !== "") {
	     for (var i = 0; i < this.layers.length; i++) {
		 var count = 0;
		 var layer = this.layers[i];
		 for (var j = 0; j < layer.c$.length; j++) { 
		     if (layer.c$[j].showing) {
			 count++;
		     }
		 }
		 if (count === 0) {
		     this.setLayerInactive(this.layers[i]);
		 } else {
		     this.layers[i].activate();
		 }
	     }
	 }
     },
     _end: 0
 });


