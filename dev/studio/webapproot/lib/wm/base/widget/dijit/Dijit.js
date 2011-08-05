/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.dijit.Dijit");
// include tooltip so the master tooltip is created right away
dojo.require("dijit.Tooltip");

// style dijit a11y node to hidden so that it does not interfere with wm.box
// a11yTestNode is created in dijit.util.wai and if it is changed to be 
// style="visibility: hidden" there then this code can be removed 
// FIXME: make a dojo ticket to make this happen
// hide master tooltip node also
dojo.addOnLoad(function() {
	var invisible = function(inId) {
		var n = dojo.byId(inId);
		n&&(n.style.visibility='hidden');
	}
	invisible('a11yTestNode');
});

// Note: dijit events and properties must be exposed manually.
// This gives finer control over what is exposed via our API.
/**
	Wrapper class to contain a Dijit.
	@name wm.Dijit
	@class
	@extends wm.Control
*/
dojo.declare("wm.Dijit", wm.Control, {
	/** @lends wm.Dijit.prototype */
	dijitClass: null,
	// FIXME: ignore props not intended for dijit
	nonDijitProps: {
		name: 1,
		flex: 1,
		box: 1,
		left: 1,
		top: 1,
		width: 1,
		height: 1,
		owner: 1,
		parent: 1,
		publishClass: 1,
		dijitClass: 1,
		domNode: 1,
		id: 1
	},
	prepare: function(inProps) {
		this.dijitProps = {};
		for (var i in inProps)
			if (!(i in this.nonDijitProps))
				this.dijitProps[i] = inProps[i];
		this.inherited(arguments);
	},
	destroy: function() {
		this.dijit.destroy();
		this.inherited(arguments);
	},
	setDomNode: function(inDomNode) {	    
		inDomNode = this.initDijit(inDomNode);
		this.inherited(arguments);
	},
	initDijit: function(inDomNode) {
	    if (this.dijitClass) {
		if (typeof this.dijitClass == "string") 
		    dojo["require"](this.dijitClass);
		var n = document.createElement('div');
		inDomNode.appendChild(n);
		var p = dojo.mixin({srcNodeRef: n}, this.getProperties());
		var newclass = typeof this.dijitClass == "string" ? dojo.getObject(this.dijitClass) : this.dijitClass;
		try {
		    this.dijit = newclass ? new newclass(p) : null;
		    this.setEvents();
		} catch(e) {
		    console.error(e);
		}
	    }
	    return inDomNode;
	},
	// return properties intended for the dijit
	getProperties: function() {
		return this.dijitProps;
	},
	// connect our events to dijit events of the same name
	setEvents: function() {
		for (var n in this.dijit) {
			// only if n starts with "on" (indexOf == 0)
			if (!n.indexOf("on")) {
				// we match "_on<Event>" first
				var e = '_' + n;
				if (!this[e])
					// we match "on<Event>" second
					e = n;
				// connect our facade event to the dijit event
				if (this[e])
					this.connect(this.dijit, n, this, e);
			}
		}
	}
});

wm.Object.extendSchema(wm.Dijit, {
	/*dojoAttachEvent: {ignore: 1},
	dojoAttachPoint: {ignore: 1},
	baseClass: {ignore: 1},
	widgetsInTemplate: {ignore: 1},
	templateString: {ignore: 1},
	alt: {ignore: 1},
	dir: {ignore: 1},
	type: {ignore: 1},
	waiRole: {ignore: 1},
	waiState: {ignore: 1},
	intermediateChanges:  {ignore: 1},*/
	box: {ignore: 1}
});

dojo.declare("wm.DijitWrapper", wm.Dijit, {
});

dojo.declare("wm.CustomDijit", wm.Dijit, {
    scrim: true,
    renderBoundsX: true,
    renderBoundsY: true,
    renderBounds: function() {
	this.inherited(arguments);
	if (this.dijit) {
	    var b = this.getStyleBounds();
	    if (!this.renderBoundsX)
		delete b.w;
	    if (!this.renderBoundsY)
		delete b.h;
	    
	    dojo.marginBox(this.dijit.domNode, b);
	}
    }
});


dojo.declare("wm.DijitDesigner", wm.CustomDijit, {
    dijitPropList: "",
    dijitClass: "",

    setProp: function(inName, inValue) {
	if (inName.indexOf("wmdijit") == 0) {
	    this[inName] = inValue;
	    this.dijitSet(inName,inValue);	    	    
	} else {
	    this.inherited(arguments); 
	}
    },
    dijitSet: function(inName, inValue) {
	if (inName.indexOf("wmdijit") == 0) {
	    inName = wm.decapitalize(inName.substring(7));
	}
	if (this.dijit["set" + wm.capitalize(inName)]) {
		this.dijit["set" + wm.capitalize(inName)](inValue);
	} else {
	    this.dijit.set(inName, inValue);
	}
    },
    getProp: function(inName) {
	if (inName.indexOf("wmdijit") == 0) {
	    return this.dijitGet(inName);
	} else {
	    return this.inherited(arguments); 
	}
    },
    dijitGet: function(inName) {
	var value = null;
	try {
	if (inName.indexOf("wmdijit") == 0) {
	    inName = wm.decapitalize(inName.substring(7));
	}
	if (this.dijit["get" + wm.capitalize(inName)]) {
	    value = this.dijit["get" + wm.capitalize(inName)]();
	} else {
	    value = this.dijit.get(inName);
	}
	if (value instanceof Date)
	    value = this._isDesignLoaded ? dojo.date.locale.format(value, {formatLength: "short"}) : value.getTime();
	else if (value instanceof Node)
	    value = value.id;
	} catch(e) {}
	return value;
    },

    getProperties: function() {
	var props = {};
	var dijitPropList = this.dijitPropList.split(/,/);
	for (var i = 0; i < dijitPropList.length; i++) {
	    var propName = dijitPropList[i];
	    /* This if statement should capture all dijit properties now */
	    if (propName.indexOf("wmdijit") == 0) {
		props[wm.decapitalize(propName.substring(7))] = this[propName];
	    } else {
		props[propName] = this[propName];
	    }
	}

	return props;
    },
    /* We no longer need the parent classes handling of events */
    setEvents: function() {
	for (var propName in this.dijit) {
	    if (propName.indexOf("on") == 0 && !propName.match(/(Mouse|Key)/)) {
		var eventName = "onDijit" + propName.substring(2);
		if (!this[eventName]) {
		    this[eventName] = function() {};
		}
		this.connect(this.dijit, propName, this, eventName);
	    }
	}
    }, 



    _end: 0
});

