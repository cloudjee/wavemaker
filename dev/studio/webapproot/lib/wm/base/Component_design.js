/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
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
        documentation: {group: "docs", readonly: true, order: 1},
        generateDocumentation: {group: "docs", readonly: true, order: 2},
        themeable: {ignore: 1},
        theme: {ignore: 1},
        isDestroyed: {ignore: 1},
        deletionDisabled: {ignore: 1},
	components: { ignore: 1 },
	designWrapper: { ignore: 1 },
	eventBindings: { ignore: 1 },
	id: { ignore: 1 },
	ignoredProps: { ignore: 1 },
	name: { group: "common", order: 0, readonly: true },
	owner: { group: "common", order: 1, readonly: true, options: ["Page", "Application"] },
	publishClass: { ignore: 1 },
	readonlyProps: { ignore: 1 },
	referenceProps: { ignore: 1 },
	state: { ignore: 1 },
        binding: { ignore: 1, writeonly: 1},
        runtimeId: {ignore: 1},
        rootId: {ignore: 1}
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
		props.owner = {ignore: 1};
            }

	    if (this.deletionDisabled) {
                props = dojo.clone(props);
		props.name = {ignore: 1};
	    }
		return props;
	},
	listDataProperties: function(inType) {
		var props = this.listProperties(), p, list = {};
		for (var i in props) {
			p = props[i];
			if (p.bindable || (inType && p[inType]) || (!inType && (p.bindTarget || p.bindSource))) {
				// data property types may change, copy property and update so update them
				p = dojo.mixin({}, props[i]);
				p.type = p.isObject ? (this.getValue(i)||0).type : p.type;
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
	isWriteableProp: function(inPropSchema) {
		var ps = inPropSchema;
		return !ps || ((ps.writeonly || !(ps.ignore || ps.readonly)) && !ps.isEvent &&  !ps.componentonly);
	},
	writeProps: function() {
		// iterates over all props and checks it's writeable via isWriteableProp
		// NOTE: previously used listWriteableProps, which was eliminated as unnecessary.
		var props = this.listProperties(), src = this._designee, p = src.constructor.prototype, out = {};
		var propList = [];
		for (var n in props) propList.push(n);
		propList = propList.sort();
		for (var i = 0; i < propList.length; i++) {
			var n = propList[i];
			if (this.isWriteableProp(props[n])) {
			 if (wm.isInstanceType(src, wm.Application) && src[n] !== undefined)
			   out[n] = src[n];
			 else if (n in src && !(src[n] instanceof wm.Variable) && (n == "_classes" && src[n] && src[n].domNode && src[n].domNode.length > 0 || n != "_classes" && src[n] != p[n]))
			   out[n] = src[n];
			}
		}
		
		return out;
	},
	writeEvents: function(inEvents) {
		return this.eventBindings;
		//dojo.mixin(inEvents, this.eventBindings);
	},
	_isWriteableComponent: function(inName, inProperties) {
	    if (!inName || (this.components[inName] instanceof wm.Widget && !wm.isInstanceType(this.components[inName], wm.Dialog)))
			return false;
		var ps = inProperties[inName];
		return !ps || ((ps.writeonly || !(ps.ignore || ps.readonly)) && !ps.isEvent && !ps.isCustomMethod);
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
		studio.refreshDesignTrees();
		inspect(this, true);
	},
	get_owner: function() {
		return this.owner == (studio && studio.application) ? "Application" : "Page";
	},
	setEvent: function(n, v) {
		// events can be components, only update source if event is a function reference
		var o = this.eventBindings[n], oc = this.getComponent(o), nc = this.getComponent(v);
		if (!(nc instanceof wm.Component || oc instanceof wm.Component))
			eventChange(o, v);
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
				this.setEvent(p, n + e.slice(l));
		}
	},
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
	/**
		Return a custom property editor for the given property.
		@param {String} inName The name of the property.
		@param {Any} inValue The currently value of the property.
		@param {Any} inDefault The default value of the property.
		@returns {String} Html string for the property editor.
	*/
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
		   case "documentation":
		   case "generateDocumentation":
		       return makeReadonlyButtonEdit(inName, inValue, inDefault);
		}

	        if (inName.match(/^custom/) && dojo.isFunction(this.constructor.prototype[inName])) {
		    var funclist =  getAllEventsInCode();
		    funclist.unshift("");
		    return new wm.propEdit.Select({component: this, value: inValue, name: inName, defaultValue: inDefault, options:funclist});
		}
		//
		var s = this.schema[inName] || 0;
		var c = (this[inName] || 0).declaredClass;
		// Look for the property class name in the Component editors registry
		p = wm.Component.property[c] || 0;
		if (p.makePropEdit) {
			return p.makePropEdit.apply(this[inName], arguments);
		}
		// Operation
		if (s.operation) {
			return makeReadonlyButtonEdit(inName, inValue, inDefault);
		}
		// Enumeration
		if (s.options) {
			return new wm.propEdit.Select({component: this, value: inValue, name: inName, defaultValue: inDefault, options: s.options});
		}
		// reference property?
		var type = s.componentType;
		if (type)
			return makeReferencePropEdit(dojo.getObject(type), inName, inValue);
		// subcomponent?
		if (this.components[inName])
			// FIXME: ok for these to always be readonly?
			// or should the subcompoment handle the decision?
			//return makeInputButtonEdit(inName, inValue, inDefault);
			return makeReadonlyButtonEdit(inName, inValue, inDefault);
		// boolean?
		if (typeof inDefault == "boolean")
			return makeCheckPropEdit(inName, inValue, inDefault);
		// use default
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
	generateSharedEventName: function(inEventName) {
		var n = inEventName;
		var name = this.declaredClass;
		name = name.replace(/^.*\./,"");
		return "on" + name +  n.slice(2, 3).toUpperCase() + n.slice(3);
	},
        generateDocumentation: function() {
	    var html = "<i>Generated Documentation</i>\n";
	    var eventSection = "";
	    var props = this.listProperties();
	    for (var i in props)
		if (props[i].isEvent) {
		    var propvalue = this.getProp(i);
		    if (propvalue) {
			eventSection += "<h4>" + i + "</h4>\n executes ";
			var comp = this.owner.components[propvalue] || this.owner.getValue(propvalue);
			if (comp) {
			    if (comp instanceof wm.ServiceCall || comp instanceof wm.ServiceVariable) {
				eventSection += propvalue + " (" + comp.declaredClass + ")";
				eventSection += "<ul style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>";
				eventSection += "<li><b>Type:</b>: " + comp.type + "</li>";
				eventSection += "<li><b>Operation</b>: " + comp.operation + "</li>";
				var params = comp.input.getData();
				for (var j in params) {
				    if (wm.isInstanceType(params[j], wm.Component)) {
					eventSection += "<li><b>" + j + "</b>:" + params[j].toString() + "</li>";
				    } else {
					eventSection += "<li><b>" + j + "</b>:" + params[j] + "</li>";
				    }
				}
				eventSection += "</ul>";
			    } else if (wm.isInstanceType(comp, wm.Dialog)) {
				eventSection += propvalue + " (" + comp.declaredClass + ")";
			    }
			} else {
			    eventSection += propvalue + " (Function)";
			}
		    }
		}
	    if (!eventSection) {
		eventSection = "No event handlers";
	    }
	    eventSection = "<h4>Event Handlers</h4><div style='margin-left:15px;'>" +	eventSection + "</div>";
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
		eventsFromSection = "No bindings";
	    }
	    eventsFromSection = "<h4>The following object event handlers activate this component</h4><ul  style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>\n" + eventsFromSection + "</ul>";
	    html += eventsFromSection;



	    var bindingSection = "";
	    if (this.components.binding) {
		var wires = this.components.binding.components;
		if (!wm.isEmpty(wires)) {
		    for (var i in wires) {
			bindingSection += "<li><b>this." + wires[i].targetProperty + "</b> is bound to <i>" + (wires[i].source || wires[i].expression) + "</i></li>\n";
		    }
		}
	    } 
	    if (!bindingSection) {
		bindingSection += "No bindings";
	    }
	    bindingSection = "<h4>This object has the following bindings</h4><ul  style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>\n" + bindingSection + "</ul>";
	    html += bindingSection

	    var bindToSection = "";
	    var bindingHash = {};
	    this.owner.generateBindingDescriptions(bindingHash,this);
	    if (!wm.isEmpty(bindingHash)) {
		var wire;
		for (var i in bindingHash) {
		    wire = bindingHash[i];
		    bindToSection += "<li>" + wire.target.getId() + "." + wire.targetProperty + " is bound to <i>" + (wire.source || wire.expression) + "</i></li>\n";
		}
	    }
	    if (!bindToSection) {
		bindToSection = "No bindings";
	    }
	    bindToSection = "<h4>The following objects are bound to this</h4><ul  style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>\n" + bindToSection + "</ul>";
	    html += bindToSection;
	    console.log(html);
	    return html;
	},
        generateBindingDescriptions: function(inHash, comparisonObj) {
	    if (this.components.binding) {
		var wires = this.components.binding.components;
		for (var i in wires) {
		    var source = wires[i].source;
		    var componentIds = [];
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
		    if (componentIds.indexOf(comparisonObj.getId()) != -1)
			inHash[wires[i].target.getId()] = wires[i];
		}
	    }
	    
		for (var i in this.components) {
		    this.components[i].generateBindingDescriptions(inHash,comparisonObj);
		}

	},
	editProp: function(inName, inValue) {
	switch (inName) {
	        case "documentation":
	            studio.documentationDialog.setHtml(this.documentation);
	            studio.documentationDialog.setTitle("Document " + this.getId());
	            studio.documentationDialog.editComponent = this;
	            studio.documentationDialog.show();
	            return;
	        case "generateDocumentation":
	            this.documentation = ((this.documentation) ? this.documentation + "<br/><br/><br/>" : "") + this.generateDocumentation();
	            this.editProp("documentation");
	            return;
	}


		// operation?
		var s = (this.schema[inName] || 0);
		if (s.operation) {
			return wm.fire(this, s.operation);
		}
		// subcomponent?
		var c = this.components[inName];
		if (c)
			return this.editComponentProp(c);
		// otherwise an event
		var n=inName, v = inValue || this.generateEventName(n);
		this.setEvent(n, v);
		eventEdit(this, n, v, c == studio.application);
	},
        getSharedEventLookupName: function(inProp) {return inProp;}
});
