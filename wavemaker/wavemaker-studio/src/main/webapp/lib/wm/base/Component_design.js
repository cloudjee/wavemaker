/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.Component_design");
dojo.require('wm.base.Component');

//===========================================================================
// Design Schema
//===========================================================================
wm.Object.extendSchema(wm.Component, {
    viewDocumentation: {group: "docs", writeonly: true},
    //generateDocumentation: {group: "docs", readonly: true, order: 2, shortname: "Generate Docs", operation: true},
        themeable: {ignore: 1},
        theme: {ignore: 1},
        isDestroyed: {ignore: 1},
        deletionDisabled: {ignore: 1},
	components: { ignore: 1 },
	designWrapper: { ignore: 1 },
	eventBindings: { ignore: 1 },
	id: { ignore: 1 },
	ignoredProps: { ignore: 1 },
    name: {readonly:1, group: "common", order: 0, requiredGroup: true},
    owner: { group: "common", order: 1, ignore: 1, unwritable: true, options: ["Page", "Application"], doc: 1},
	publishClass: { ignore: 1 },
	readonlyProps: { ignore: 1 },
	referenceProps: { ignore: 1 },
        binding: { ignore: 1, writeonly: 1},
        runtimeId: {ignore: 1},
    rootId: {ignore: 1},


    destroy: {method:1, doc: 1},
    toString: {method:1, doc: 1, returns: "String"},
    getId: {method:1, doc: 1, returns: "String"},
    getRuntimeId: {method:1, doc: 1, returns: "String"},
    $: {ignore: true,doc: 1},
    localizedDeclaredClass: {ignore:1}
});

//=======================================================
// Design time prototype
//=======================================================
wm.Component.extend({
    themeable: false,
	designCreate: function() {
		this.eventBindings = {};
		this.referenceProps = {};
		this.publishClass = this.publishClass || this.declaredClass;
		this.subscribe("wmwidget-idchanged", this, "renameComponentEvents");
		if (!(wm.isInstanceType(this, wm.Control)))
			this.designWrapper = new wm.ComponentWrapper({ surface: this._designer, component: this, owner: this.owner });
	},
	designDestroy: function() {
		wm.fire(this.designWrapper, "destroy");
	},
	//=======================================================
	// Reflection
	//=======================================================
	getPropFlags: function(inName, inTypeInfo) {
		inTypeInfo.isEvent = this.isEventProp(inName);
		inTypeInfo.isCustomMethod = this.isCustomMethodProp(inName);	    
	},
	listProperties: function() {
		var props = this.inherited(arguments);
	    if (this.isDesignLoaded() && (this.owner != studio.application && this.owner != studio.page)) {
                props = dojo.clone(props);
		if (props.owner) props.owner.ignoretmp = 1;
		else props.owner = {ignoretmp: 1};
            }

	    if (this.deletionDisabled) {
                props = dojo.clone(props);
		props.name = {ignoretmp: 1};
	    }
		return props;
	},
	listWriteableProperties: function() {
	    var results = {};
	    var props = this.listProperties();
	    for (var i in props) {
		p = props[i];
		if (this.isWriteableProp(p,i)) {
		    results[i] = p;
		}
	    }
	    return results;
	},
	listDataProperties: function(inType) {
		var props = this.listProperties(), p, list = {};
		for (var i in props) {
			p = props[i];
			if (p.bindable || (inType && p[inType]) || (!inType && (p.bindTarget || p.bindSource))) {
				// data property types may change, copy property and update so update them
				p = dojo.mixin({}, props[i]);
				p.type = p.isObject ? (this.getValue(i)||p).type : p.type;
				list[i] = p;
			}
		}
		return list;
	},
	//=======================================================
	// Streaming Out
	//=======================================================
	serialize: function(inOptions) {
		return "{" + this.write('', inOptions||0) + "}";
	},
	copyProps: function(inProps, inNames, inPrefix) {
		var target = this._designee, p = target.constructor.prototype, pf = inPrefix || '';
		for (var i=0, n; (n=inNames[i]); i++) 
			if ((n in target) && (target[n]!=p[n]))
				inProps[pf + n] = target[n];
	},
        isWriteableProp: function(inPropSchema, inName) {
	    var ps = inPropSchema;
	    if (!ps) return true;
	    if (ps.method || ps.unwritable) return false;

	    /* Its not writable if its bound; the binding is the source of the value */
	    if (inName && this.$.binding && this.$.binding.wires[inName])
		return false;

	    return ((ps.writeonly || !(ps.ignore || ps.ignoretmp || ps.readonly)) && !ps.isEvent &&  !ps.componentonly);
	},
	writeProps: function() {
	    // make sure the proper prototype is loaded so we correctly write the properties that are different from default
	    if (studio && studio.application)
		studio.application.loadThemePrototypeForClass(this.constructor, this);

		// iterates over all props and checks it's writeable via isWriteableProp
		// NOTE: previously used listWriteableProps, which was eliminated as unnecessary.  [MK: Added back for use in localization]
	    var props = this.listProperties();
	    var src = this._designee;
	    var p = src.constructor.prototype;
	    var out = {};
	    var propList = [];
		for (var n in props) propList.push(n);
		propList = propList.sort();
	        for (var i = 0; i < propList.length; i++) {
		    var n = propList[i];		    
		    if (this.isWriteableProp(props[n],n)) {
			var value = (window["studio"] && studio._designLanguage !== undefined && studio._designLanguage != "default") ? src["_original_i18n_" + n] || src[n] : src[n];
			if (n == "showing" && this._mobileShowingRequested) {
			    value = this._mobileShowingRequested;
			}
			if (value instanceof Date) value = value.getTime();
			if (wm.isInstanceType(src, wm.Application) && value !== undefined) {
			    out[n] = value;
			} else if (n in src && !(value instanceof wm.Variable) && (n == "_classes" && value && value.domNode && value.domNode.length > 0 || n != "_classes" && value !== p[n])) {
			    if (value instanceof Date) {
				try {
				    out[n] = value.getTime();
				} catch(e) {}
			    } else if (dojo.isArray(value) && (!value.length || value[0] instanceof wm.Component || value[0] instanceof Node)) {
				;
			    } else {
				out[n] = value;
			    }
			}
		    }
		}
		
		return out;
	},
	writeEvents: function(inEvents) {
	    for (var eventName in this.eventBindings) {
		if (this.eventBindings[eventName] == "-")
		    delete this.eventBindings[eventName];
	    }
	    return this.eventBindings;
	    //dojo.mixin(inEvents, this.eventBindings);
	},
	_isWriteableComponent: function(inName, inProperties) {
	    var c = this.components[inName];

	    /* If it has no name, then its not a user generated component, its an internal component and in any case is unsafe to write */
	    if (!inName || inName.match(/^_/)) {
		return false;
	    }

	    /* If its a widget that is owned by something, don't write it; widgets are written as part of writing widgets NOT writing this.components.
	     * Exceptions to this are Dialogs and PopupMenus which are outside the widget heirarchy 
	     */
	    else if (c instanceof wm.Control == true && c instanceof wm.Dialog == false  && c instanceof wm.PopupMenu == false) {
		return false;
	    }

	    
	    var ps = inProperties[inName];
	    return !ps || ((ps.writeonly || !(ps.ignore || ps.ignoretmp || ps.readonly)) && !ps.isEvent && !ps.isCustomMethod);
	},
	writeComponents: function(inIndent, inOptions) {
		// iterates over all props and checks it's writeable via isWriteableComponent
		var s = [], p = this.listProperties();
		for (var cn in this.components) {
			if (this._isWriteableComponent(cn, p)) {
				var c = this.components[cn].write(inIndent, inOptions);
				if (c) 
					s.push(c);
			}
		}
		return s;
		//return s.join(',' + sourcer_nl);
	},
	write: function(inIndent, inOptions) {
/*
		if (!this.owner) // FIXME: ??
			return '';
*/
		// type
		var o = [ '"' + this.publishClass + '"' ];
		// props
		var p = this.writeProps(inOptions);
		o.push(toJson(p));
		// events
		var e = this.writeEvents();
		o.push(toJson(e));
		// descendents
		var s = this.writeComponents(inIndent + sourcer_tab, inOptions);
		if (s.length) {
			s = '{' + sourcer_nl + s.join(',' + sourcer_nl) + sourcer_nl + inIndent + '}';
			o.push(s);
		}
		// <indent>name: [ type, {props}, {events}, {children} ]
		return [inIndent, this.name, ': [', o.join(', '), ']'].join('');
		//return sourcer_component(this, inIndent);
	},
        getDocumentationHash: function() {
	    var hash = {};
	    if (this.documentation) hash[this.name] = this.documentation;
	    for (var i in this.components) {
		var tmp = this.components[i].getDocumentationHash();
		if (!wm.isEmpty(tmp)) dojo.mixin(hash,tmp);
	    }
	    if (this._metaData)
		hash.__metaData = this._metaData;
	    return hash;
	},
	//=======================================================
	// Other...
	//=======================================================
	set_name: function(inName) {
		var o = this.name, n = inName;
		if (n == o || !n)
			return;
		//
		n = wm.getValidJsName(n);
		//
		// ensure name is unique
		var un = this.owner.getUniqueName(n);
		if (n != un) 
			return n;
		//
		var oldRtId = this.getRuntimeId(), oldId = this.getId();
		this.renameFunctionEvents(n);
		this.setName(n);
		var rtId = this.getRuntimeId(), id = this.getId();
		//
		dojo.publish("wmwidget-rename", [o, n, this]);
		// messages for id and runtimeId change
		dojo.publish("wmwidget-idchanged", [oldId, id, oldRtId, rtId, this]);
		return n;
	},
	set_owner: function(inOwner) {
		inOwner = inOwner == "Application" ? studio.application : studio.page;
		var n = inOwner.getUniqueName(this.name);
		if (n != this.name)
			this.set_name(n);
		var id = this.getId(), rtId = this.getRuntimeId();
		this.setOwner(inOwner);
		dojo.publish("wmwidget-idchanged", [id, this.getId(), rtId, this.getRuntimeId(), this]);
	    /* This is false if changing the owner of a dialog and all its contents; don't refresh the design trees
	     * once per widget within the dialog; */
	        if (this == studio.selected) {
		    studio.refreshDesignTrees();
		    studio.inspect(this, true);
		}
	},
	get_owner: function() {
		return this.owner == (studio && studio.application) ? "Application" : "Page";
	},
        setEvent: function(n, v, renameOk) {
		// events can be components, only update source if event is a function reference
		var o = this.eventBindings[n], oc = this.getComponent(o), nc = this.getComponent(v);
	    if (renameOk && !(nc instanceof wm.Component || oc instanceof wm.Component) && v.indexOf(".") == -1)
		    eventChange(this.owner instanceof wm.Page ? studio.editArea : studio.appsourceEditor, o, v);

		if (v)
			this.eventBindings[n] = v;
		else 
			delete this.eventBindings[n];
	},
	renameFunctionEvents: function(inName) {
		var n=inName, l=this.name.length, eb=this.eventBindings, e;
		for (var p in eb) {
			e = eb[p];
			if (e && !this.getComponent(e) && e.slice(0, l) == this.name)
			    this.setEvent(p, n + e.slice(l), true);
		}
	},
	renameComponentEvents: function(originalId, newId) {
	    var eventBindings = this.eventBindings;
	    for (var eventName in eventBindings) {
		var eventValue = eventBindings[eventName];
		// If the eventValue is the exact name of the component, change it to the exact new name of the component
		if (eventValue == originalId) {
		    this.setEvent(eventName, newId, true);
		}

		// If the eventValue is a subcomponent of this object, or it is a method of this object, rename
		// the prefix and keep the postfix unchanged
		else if (eventValue.indexOf(originalId + ".") == 0) {
		    newId = newId + "." + eventValue.substring(originalId.length+1);
		    this.setEvent(eventName, newId, false);
		}
	    }
	},
/*
	renameComponentEvents: function(originalId, newId) {
		var eventBindings = this.eventBindings;
		for (var eventName in eventBindings) {
			var bindingElements = eventBindings[eventName].split('.');
			var scope = bindingElements.shift();
			if (scope == originalId) {  //scope is page
				if (bindingElements.length) {
					bindingElements.unshift(newId);
					newId = bindingElements.join('.');
				}
				this.setEvent(eventName, newId);
			}
				else if (scope == "app" ) {
					this.setEvent(eventName, newId);
			}
		}
	},
	*/
	/**
		Return a custom property editor for the given property.
		@param {String} inName The name of the property.
		@param {Any} inValue The currently value of the property.
		@param {Any} inDefault The default value of the property.
		@returns {String} Html string for the property editor.
	*/
	makePropEdit: function(inName, inValue, inEditorProps) {
	        if (inName.match(/^custom/) && dojo.isFunction(this.constructor.prototype[inName])) {
		    var funclist =  getAllEventsInCode();
		    var customName = this.name + wm.capitalize(inName);
		    if (dojo.indexOf(funclist, customName) == -1)
			funclist.unshift(customName);
		    inEditorProps.allowNone = true;
		    inEditorProps.options = funclist;
		    inEditorProps.displayField = inEditorProps.dataField = "dataValue";		    
		    return new wm.SelectMenu(inEditorProps);
		}

	},
        setPropEdit: function(inName, inValue, inDefault) {
	    return false; // unhandled
	},
	editComponentProp: function(inComponent) {
		if (inComponent) {
			// registered type?
			var p = wm.Component.property[inComponent.declaredClass];
			if (p && p.editProp)
				return p.editProp.apply(inComponent, arguments);
			// subcomponent
			return studio.select(inComponent);
		}
	},
	generateEventName: function(inEventName) {
		var n = inEventName;
	    return (this instanceof wm.Application) ? inEventName :  this.name + n.slice(2, 3).toUpperCase() + n.slice(3)
	},
        getSharedEventLookupName: function(inProp) {return inProp;},
	generateSharedEventName: function(inEventName) {
	        var n = this.getSharedEventLookupName(inEventName);
		var name = this.declaredClass;
		name = name.replace(/^.*\./,"");
		return "on" + name +  n.slice(2, 3).toUpperCase() + n.slice(3);
	},
    viewDocumentation: function() {
	studio.documentationDialog.setHtml(this.documentation);
	studio.documentationDialog.setTitle(studio.getDictionaryItem("wm.Component.DOCUMENTATION_DIALOG_TITLE", {name: this.getId()}))
	studio.documentationDialog.editComponent = this;
	studio.documentationDialog.show();
    }, // TODO: Need to update checkbox after setting documentation
        generateDocumentation: function() {
	    var html = ((this.documentation) ? this.documentation + "<br/><br/><br/>" : "");


	    html += "<i>" + studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_TOPNOTE") + "</i>\n";
	    var eventSection = "";
	    var props = this.listProperties();
	    for (var i in props)
		if (props[i].isEvent) {
		    var propvalue = this.getProp(i);
		    if (propvalue) {
			eventSection +=  studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_EVENT_HEADER", {eventName: i});

			var comp = this.owner.components[propvalue] || this.owner.getValue(propvalue);
			if (comp) {
			    if (comp instanceof wm.ServiceCall || comp instanceof wm.ServiceVariable) {
				eventSection += propvalue + " (" + comp.declaredClass + ")";
				eventSection += "<ul style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>";
				eventSection += "<li>" +
				    studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_EVENT_TARGET_TYPE", {componentType: comp.type}) +
				    "</li>";
				eventSection += "<li>" + 
				    studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_EVENT_TARGET_OPERATION", {operation: comp.operation}) +
				    "</li>";
				var params = comp.input.getData();
				for (var j in params) {
				    if (wm.isInstanceType(params[j], wm.Component)) {
					eventSection += "<li><b>" + j + "</b>:" + params[j].toString() + "</li>";
				    } else {
					eventSection += "<li><b>" + j + "</b>:" + params[j] + "</li>";
				    }
				}
				eventSection += "</ul>";
			    } else if (wm.isInstanceType(comp, wm.Dialog) || 
				       wm.isInstanceType(comp, wm.PopupMenu)) {
				eventSection += propvalue + " (" + comp.declaredClass + ")";
			    }
			} else {
			    eventSection +=  studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_EVENT_FUNCTION", {functionName: propvalue});
			}
		    }
		}
	    if (!eventSection) {
		eventSection = studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_NO_EVENT_HANDLER");
	    }
	    eventSection = studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_EVENT_SECTION",
						    {eventHtml: eventSection});
	    html += eventSection;

	    var eventsFromSection = "";
	    var complist = wm.listOfWidgetType(wm.Component);
	    for (var i = 0; i < complist.length; i++) {
		var eventBindings = complist[i].eventBindings;
		if (!wm.isEmpty(eventBindings)) {
		    for (evt in eventBindings) {
			if (eventBindings[evt] == this.getId())
			    eventsFromSection += "<li>" + complist[i].getId() + "." + evt + "</li>\n";
		    }
		}
	    }
	    if (!eventsFromSection) {
		eventsFromSection = studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_NO_BINDING");
	    }
	    eventsFromSection = studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_EVENT_HANDLERS_HEADER",
							 {eventHtml: eventsFromSection});
	    html += eventsFromSection;

	    var bindingSection = "";
	    if (this.components.binding) {
		var wires = this.components.binding.components;
		if (!wm.isEmpty(wires)) {
		    for (var i in wires) {
			bindingSection += studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_BINDING",
								   {property: "this." + wires[i].targetProperty,
								    source: wires[i].source || wires[i].expression});

		    }
		}
	    } 
	    if (!bindingSection) {
		bindingSection += studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_NO_BINDING");
	    }
	    bindingSection = studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_BINDING_SECTION",
						      {bindingHtml: bindingSection});

	    html += bindingSection;

	    var bindToSection = "";
	    var bindingHash = {};
	    this.owner.generateBindingDescriptions(bindingHash,this);
	    if (!wm.isEmpty(bindingHash)) {
		var wire;
		for (var i in bindingHash) {
		    wire = bindingHash[i];
		    bindToSection += studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_BOUND_TO",
							      {targetComponent: wire.target.getId(),
							       targetProperty: wire.targetProperty,
							       source: wire.source || wire.expression});

		}
	    } 
	    if (!bindToSection) {
		bindToSection = studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_NO_BINDING");
	    }
	    bindToSection = studio.getDictionaryItem("wm.Component.GENERATE_DOCUMENTATION_BOUND_TO_SECTION",
						     {bindHtml: bindToSection});

	    html += bindToSection;
	    return html;
	},
       /* builds up inHash to contain a list of all bindings from all other components to comparisonObj;
       * If this refers to the current page, then it iterates over every component/widget owned by the page
       */
        generateBindingDescriptions: function(inHash, comparisonObj) {
	    /* Step one: See if this component has any bindings; if there are, iterate over them and see if any are related to comparisonObj */
	    if (this.components.binding) {
		var wires = this.components.binding.components;
		for (var i in wires) {
		    var source = wires[i].source;
		    var componentIds = [];
		    /* Extract the component id from source or expression */
		    if (source) {
			componentIds.push(source.replace(/\.[^\.]*/,""));
		    } else {
			var expression = wires[i].expression;
			var ids = expression.match(/\{(.*?)\}/g) || [];
			for (var j = 0; j < ids.length; j++) {
			    ids[j] = ids[j].substring(1,ids[j].length-1)
			    var idparts = ids[j].split(/\./);
			    idparts.pop(); // get rid of the property name, keep the ids that got us to that property.
			    if (idparts[0] == "app") idparts.shift();
			    // add to our list all components in the path: liveform.livevariable.customer should result in liveform and liveform.livevariable being added to our list
			    while (idparts.length) {
				componentIds.push(idparts.join("."));
				idparts.pop();
			    }
			}
		    }

		    /* If any of the componentIds affect comparisonObj then its a match; add it to our hash */
		    var comparisonId = comparisonObj.getId();
		    for (var j = 0; j < componentIds.length; j++) {
			var parts = componentIds[j].split(".");
			while(parts.length) {
			    if (parts.join(".").indexOf(comparisonId) != -1) {
				inHash[wires[i].target.getId()] = wires[i];
				break;
			    }
			    parts.pop();
			}
		    }
		}
	    }
	    
	    /* Step 2: Iterate over every component owned by the current component (we started with a wm.Page) and
	     * see if they have any subcomponents bound to comparisonObj
	     */
		for (var i in this.components) {
		    this.components[i].generateBindingDescriptions(inHash,comparisonObj);
		}

	},
	editProp: function(inName, inValue) {
		// otherwise an event
		var n=inName, v = inValue || this.generateEventName(n);
	        this.setEvent(n, v, false);
		eventEdit(this, n, v, c == studio.application);
	},

    createDesignContextMenu: function(menuObj) {},
    showContextMenu: function(e) {
		if (dojo.isFF && !(e.button == 2 || e.ctrlKey)) return;
		dojo.stopEvent(e);		
		var menuObj = studio.contextualMenu;
		menuObj.removeAllChildren();
	this.createDesignContextMenu(menuObj);
		var props = this.listProperties();
		for (p in props) {
		    if (props[p].contextMenu === undefined && props[p].group == "operation" || props[p].contextMenu
/*
			props[p].simpleBindTarget || 
			props[p].simpleBindProp && (props[p].bindable || props[p].bindTarget)*/)
			this.addContextMenuItem(menuObj,p, props[p]);
		}
		
	if (this instanceof wm.Control) {
	    var submenuOptions = {label: "Select", 
				  iconClass: "Studio_silkIconImageList_83",
				  children: [{label: this.name,
					      iconClass: wm.packageImages[this.declaredClass] || "Studio_paletteImageList_0",
					      onClick: this._makeSelectComponentMethod(this)}]};
	    var parent = this.parent;
	    while(parent && parent != studio.designer) {
		if (!parent.flags || !parent.flags.notInspectable && !parent.noInspector)
		    submenuOptions.children.push({label: parent.name,
						  //iconClass: "Studio_silkIconImageList_83",
						  iconClass: wm.packageImages[parent.declaredClass] || "Studio_paletteImageList_0",
						  onClick: this._makeSelectComponentMethod(parent)});

		if (parent instanceof wm.Layers) {
		    var layersOptions = {//iconClass: parent.declaredClass.toLowerCase().replace(/\./g,"_"),
			                 iconClass: "Studio_silkIconImageList_83",
			label: studio.getDictionaryItem("wm.Component.CONTEXT_MENU_LAYERS", {parentName: parent.name}),
					 children: []};
		    parent.createDesignContextMenu(menuObj, layersOptions.children);
		    var layersMenu = menuObj.addAdvancedMenuChildren(menuObj.dojoObj, layersOptions);
		}

		parent = parent.parent;
	    }
	    if (submenuOptions.children.length > 1)
		menuObj.addAdvancedMenuChildren(menuObj.dojoObj, submenuOptions);
	}


	menuObj.addAdvancedMenuChildren(menuObj.dojoObj, {iconClass: "StudioHelpIcon", 
							  label: studio.getDictionaryItem("wm.Component.CONTEXT_MENU_HELP", {"className": this.declaredClass}),
							  onClick: dojo.hitch(this, function() {
							      var url = studio.getDictionaryItem("wm.Palette.URL_CLASS_DOCS", {className: this.declaredClass.replace(/^.*\./,"")});
							      window.open(url);
							  })
							 });
	    
	    menuObj.update(e, this.domNode);
    },
	_makeSelectComponentMethod: function(inComp) {
	    return dojo.hitch(this, function() {
		studio.select(inComp);
	    });
	},
    addContextMenuItem: function(inMenu, inPropName, inProp) {
	/* This menu does not appear to get added */
	    inMenu.addAdvancedMenuChildren(inMenu.dojoObj, 
					   {label: inProp.simpleBindProp ? "Bind " + inPropName : inPropName, 
					    iconClass: "Studio_silkIconImageList_30",
					    onClick: dojo.hitch(this, function() {
/*
	       if (inProp.simpleBindProp || inProp.simpleBindTarget) {
		   studio.bindDialog.page.update(dojo.mixin({object: this,
							targetProperty: inPropName,
						       },inProp));
		   studio.bindDialog.show();
	       } else
	       */
		this[typeof inProp.operation == "string" ? inProp.operation : inPropName]();
	   })});
    },
    hasLocalizedProp: function(inName) {
	if (this.listProperties()[inName].nonlocalizable) return false;
	return this["_original_i18n_" + inName] !== undefined && this["_original_i18n_" + inName] != this.getProp(inName);
    }
});
