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
dojo.provide("wm.studio.app.inspect");
dojo.require("wm.studio.app.util");

wm.bubble = function(e) {
	dojo.fixEvent(e);
	var t = e.target, n = "_on" + e.type;
	while (t && !t[n]){
		t = t.parentNode;
	}
	if (t) 
		t[n](e);
}

/**
	Return a Select property editor for the given property.
	@param {String} inName The property name.
	@param {Array} inOptions An array of options displayed in the Select.
	@param {Any} inDefault The default property value.
	@param {Array} inValues (Optional) An array of matching values for each option displayed in the Select.
	@returns {String} Html string for the Select property editor.
*/
makeSelectPropEdit = function(inName, inValue, inOptions, inDefault, inValues) {
	var html = [ '<select name="', inName, '" onfocus="wm.bubble(event)" onchange="wm.bubble(event)">' ];
	for (var i=0, l=inOptions.length, o, v; (o=inOptions[i])||(i<l); i++) {
		v = inValues ? inValues[i] : o;
		html.push('<option', 
			' value="' + v + '"',
			(inValue==v ? ' selected="selected"' : ''), '>', 
			(o==inDefault ? ''+o+' (default)' : o),
			'</option>');
	}
	html.push('</select>');
	return html.join('');
}

makeCheckPropEdit = function(inName, inValue, inDefault) {
	return [ 
		'<input style="width: auto; height: auto; background: transparent;" type="checkbox" name="', inName, '"', (inValue==inDefault ? ' class="prop-default"' : ''), (inValue ? 'checked="checked"' : '') + '"/>'
	].join('');
}

makeInputPropEdit = function(inName, inValue, inDefault, inReadonly) {
	inValue = inValue === undefined ? "" : inValue;
	// FIXME: need more escaping here likely. just doing quotes for now
	inValue = String(inValue).replace(/\"/g, "&quot;") || "";
	return [
		'<input name="', inName, '"',
		'onfocus="wm.bubble(event)" onblur="wm.bubble(event)"',
		(inValue==inDefault ? ' class="prop-default"' : ''),
		(inReadonly === true ? ' readOnly="true"' : ''),
		' value="', inValue, '"/>'
	].join('');
}

makeTextPropEdit = function(inName, inValue, inDefault, inRows) {
	return [
		'<textarea name="', inName, '"', ' wrap="soft" rows="', inRows||8, '"', ' onfocus="wm.bubble(event)" onblur="wm.bubble(event)"', (inValue==inDefault ? ' class="prop-default"' : ''), '">', inValue, '</textarea>'
	].join('');
}

addButtonToEdit = function(inEdit, inValue, inDefault, inContent) {
	var b = '<button class="wminspector-prop-button" type="button">' + (inContent||"&hellip;") + '</button>';
	return '<table class="prop-table" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td' + (inValue==inDefault ? ' class="prop-default"' : '') + '>' + inEdit + '</td><td class="prop-button">' + b + '</td></tr></table>';
}

makeInputButtonEdit = function(inName, inValue, inDefault, inContent) {
	var i = makeInputPropEdit(inName, inValue, inDefault);
	return addButtonToEdit(i, inValue, inDefault, inContent);
}

makeBoundEdit = function(inName, inValue) {
	return [
		'<table class="bound-prop-table" cellpadding="0" cellspacing="0" border="0">',
		'<tr><td class="bound-prop">', makeInputPropEdit(inName, inValue, "", true), '</td>',
		'<td class="bound-prop-button"></td></tr>',
		'</table>'
	].join('');
}

makeReadonlyButtonEdit = function(inName, inValue, inDefault, inContent) {
	var i = makeInputPropEdit(inName, inValue, inDefault, true);
	return addButtonToEdit(i, inValue, inDefault, inContent);
};

inspectFileboxUrlChange = function() { 
	var v = this.value.replace(/\\/g, "/").replace(/C:\/www\/root/, ""); //"
	this.parentNode.reset();
	this.inspected.set_content(v);
}

makePictureSourcePropEdit = function(inName, inValue, inDefault) {
	return makeInputPropEdit(inName, inValue, inDefault);
}

makePropEdit = function(inComponent, inName, inValue) {
	var c = inComponent, d = c.constructor.prototype[inName];
	return c.makePropEdit(inName, inValue, d) || makeInputPropEdit(inName, inValue, d);
}

makeReferencePropEdit = function(inType, inName, inValue) {
	var list = [ "(none)" ];
	for (var i in wm.Component.byId) {
		var c = wm.Component.byId[i];
		if (c instanceof inType) {
			if (c.isOwnedBy(studio.page) || c.isOwnedBy(studio.application)) {
				list.push(c.id); //name);
			}
		}
	}
	return makeSelectPropEdit(inName, inValue, list);
}

inspect = function(inComponent, inDoFocus) {
	// call on timeout so IE can blur inspectedEditor before rebuilding inspector
	//if (inComponent)
		setTimeout(function() { _inspect(inComponent, inDoFocus) }, 1);
}

_setInspectedCaption = function(inComponent) {
	var c = inComponent;
	studio.inspected.setCaption(c ? c.name  + ': ' + c._designee.declaredClass : "(none)");
}

_inspect = function(inComponent, inDoFocus) {
    if (inComponent.isDestroyed) return;
	var c = inspected = inComponent; 
	// update label
	_setInspectedCaption(c);
	// inspect component
	//studio.inspector.setLayerByCaption("Properties");
	studio.inspector.inspect(inComponent);
/*
	if (inDoFocus)
		studio.inspector.focusDefault();
                */	
}

// event inspection
dojo.declare("wm.EventEditor", dijit.form.ComboBox, {
	eventActions: {
	    noEvent: {caption: "- No Event"},
	    jsFunc: {caption: " - Javascript..."},
	    jsSharedFunc: {caption: " - Javascript Shared..."},
	    newService: {caption: " - New Service..."},
	    newNavigation: {caption:" - New Navigation..."},
	    serviceVariables: {caption: "Service Variables:", list: "serviceVariable"},
	    navigations: {caption: "Navigations:", list: "navigationCall"},
     	    existingCalls: {caption: "Shared Event Handlers:", list: "sharedEventHandlers"},
            dialogs: {caption: "Show Dialogs:", list: "dialogs"},
	    liveForms: {caption: "Live Forms:", list: "liveForms"}
	},
	isEventAction: function(inValue) {
		var ea = this.eventActions;
		for (var i in ea)
			if (inValue == ea[i].caption)
				return true;
	},
	//FIXME: cache this
	generateStore: function() {
	    var sc = wm.listComponents([studio.application, studio.page], wm.ServiceVariable);
			var lightboxList = wm.listComponents([studio.application, studio.page], wm.DojoLightbox);
	    var nc = wm.listComponents([studio.application, studio.page], wm.NavigationCall);
      var sharedEventHandlers = eventList(this.inspected.getSharedEventLookupName(this.propName), wm.isInstanceType(studio.selected.owner, wm.Application) ? studio.appsourceEditor : studio.editArea);
	    var dialogList = wm.listComponents([studio.application, studio.page], wm.Dialog);
            dialogList = dialogList.concat(wm.listComponents([studio.application, studio.page], wm.DojoLightbox));
	    var lf = wm.listComponents([studio.application, studio.page], wm.LiveForm);
	    var items=[];
	    var eventSchema = this.inspected.schema[this.propName];

	        wm.forEachProperty(this.eventActions, function(o, name) {
				var n = o.caption, l = o.list;
				if (l) {
				    var a;
				    switch(l) {
					    case "navigationCall":
							if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "navigation") == -1) return;
		                   	a = nc;
							break;
		                case "serviceVariable":
							if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "service") == -1) return;
		                    a = sc;
							break;
		                case "sharedEventHandlers":
							if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "javascript") == -1) return;
		        	        a = sharedEventHandlers;
							break;
					    case "dialogs":
								if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "dialog") == -1) return;
								a = dialogList;
								break;
					    case "lightboxes":
								if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "lightbox") == -1) return;
								a = lightboxList;
								break;
					    case "liveForms":
								if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "liveForm") == -1) return;
								a = lf;
								break;
				    }	
					
					if (a && a.length) {
						items.push({name: n, value: n});
						dojo.forEach(a, function(obj) {
							var aa = (wm.isInstanceType(obj, wm.Component)) ? obj.getId() : obj;
							if (obj instanceof wm.LiveForm){
								items.push({name: aa + '.beginDataInsert', value: aa + '.beginDataInsert'});
								items.push({name: aa + '.saveData', value: aa + '.saveData'});
								items.push({name: aa + '.beginDataUpdate', value: aa + '.beginDataUpdate'});
							    //items.push({name: aa + '.updateData', value: aa + '.updateData'});
								items.push({name: aa + '.cancelEdit', value: aa + '.cancelEdit'});
								items.push({name: aa + '.deleteData', value: aa + '.deleteData'});
							} else {
								items.push({name: aa, value: aa});
							}
						})
					}
				} else {
				    if (eventSchema && eventSchema.events)
					switch(name) {
						case "noEvent":
						    if ( dojo.indexOf(eventSchema.events, "disableNoEvent") != -1) return;
						case "jsFunc":
						    if (dojo.indexOf(eventSchema.events, "js") == -1) return;
						    break;
						case "jsSharedFunc":
						    if (dojo.indexOf(eventSchema.events, "sharedjs") == -1) return;
						    break;
						case "newService":
						    if ( dojo.indexOf(eventSchema.events, "service") == -1) return;
						    break;
						case "newNavigation":
						    if (dojo.indexOf(eventSchema.events, "navigation") == -1) return;
						    break;
					}
				    items.push({name: n, value: n});
				}
			});
/*
		dojo.forEach(sharedEventHandlers, function(e) {
		  items.push({name: e, value: e});
		});
*/
		return new wm.base.data.SimpleStore(items, "name");
	},
	postMixInProperties: function() {
		this.store = this.generateStore();
		this.inherited(arguments);
	},
	postCreate: function() {
		this.inherited(arguments);
		this.domNode.style.width = this.domNode.style.height = "100%";
	},
	attr: function(inName,inValue) {
	  if (inName == "value" || inName == "item") {
	  	var value = inName == "value" ? inValue : inValue.name;
		var c = this.inspected, o = c.getValue(this.propName);
		if (this.isEventAction(value))
			this.doEventAction(value);
		else {
			this.inherited(arguments);
			this.inspected.setProp(this.propName, value);
		}
	  }
	},

	doEventAction: function(inEventName) {
		var ea = this.eventActions, c = this.inspected, p = this.propName, v;
		switch (inEventName) {
		        case ea.noEvent.caption:
				this.attr("value","");			  
				break;
			case ea.jsFunc.caption:
				v = c.generateEventName(p);
				this.attr("value",v);
				try{c.updatingEvent(p,v);}catch (e){/*do nothing as this might happen if there's a component which does not extends wm.control class*/}
				eventEdit(c, p, v);
				break;
			case ea.jsSharedFunc.caption:
				v = c.generateSharedEventName(p);
				this.attr("value",v);
				try{c.updatingEvent(p,v);}catch (e){/*do nothing as this might happen if there's a component which does not extends wm.control class*/}
				eventEdit(c, p, v);
                                studio.inspector.reinspect();
				break;
			case ea.newService.caption:
				studio.newComponentButtonClick({componentType: "wm.ServiceVariable"});
				this.attr("value",studio.selected.name);
				break;
			case ea.newNavigation.caption:
				studio.newComponentButtonClick({componentType: "wm.NavigationCall"});
				this.attr("value",studio.selected.name);
				break;
		}
	}
});

// inspector formatting (allow widgets in inspectors)
formatEventProp = function(inComponent, inName, inValue, inNode) {
	return new wm.EventEditor({inspected: inComponent, propName: inName, value: inValue, srcNodeRef: inNode});
}

formatPropEdit = function(inComponent, inName, inValue, inNode, noEventProps) {
	// event
	if(!noEventProps &&inName.slice(0,2)=="on")
		return formatEventProp.apply(this, arguments);
	else
		return wm.fire(inComponent, "formatPropEdit", inName, inValue, inNode);
}
