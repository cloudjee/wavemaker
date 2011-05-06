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
		var n = document.createElement('div');
		inDomNode.appendChild(n);
		var p = dojo.mixin({srcNodeRef: n}, this.getProperties());
		var newclass = typeof this.dijitClass == "string" ? dojo.getObject(this.dijitClass) : this.dijitClass;
		this.dijit = newclass ? new newclass(p) : null;
		this.setEvents();
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


dojo.declare("wm.DijitControl", wm.Dijit, {
    scrim: true,
    renderBoundsX: true,
    renderBoundsY: true,
    dijitClass: "",    
    setDijitClass: function(inClass) {
	this.dijitClass = inClass;
	if (this.dijit) {
	    this.dijit.destroy();
	}
	this.initDijit(this.domNode);
    },
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
    },
    setProp: function(inName, inValue) {
	this.inherited(arguments);
	var parentPrototype = this.constructor.superclass.constructor.superclass;
	if (parentPrototype[inName] === undefined && this.dijit) {
	    if (this.dijit["set" + wm.capitalize(inName)])
		this.dijit["set" + wm.capitalize(inName)](inValue);
	    else
		this.dijit.set(inName, inValue);
	}
    },
    getProperties: function() {
	return {};
    },
    setEvent: function() {},
    setRenderBoundsX: function(bind) {
	this.renderBoundsX = bind;
	if (!bind && this.dijit)
	    this.dijit.domNode.style.width = "";
    },
    setRenderBoundsY: function(bind) {
	this.renderBoundsY = bind;
	if (!bind && this.dijit)
	    this.dijit.domNode.style.height = "";
    },
    listProperties: function() {
	var props = dojo.clone(this.inherited(arguments));
	if(this.dijit)
	    this.addToPropList(this.dijit, props);
	return props;
    },
    addToPropList: function(obj, props) {
	for (var propName in obj) {
	    if (props[propName]) continue; // don't overwrite wavemaker props with dojo props no matter how important they might be
	    if (propName.indexOf("_") == 0) continue; // private prop
	    if (dojo.indexOf(wm.DijitControl.ignorelist, propName) != -1) continue;
	    if (propName.indexOf("on") == 0) {
		props[propName] = {isEvent: true};
	    } else if (typeof obj[propName] == "number") {
		props[propName] = {isEvent: false,
				   type: "number"};
	    } else if (typeof obj[propName] == "string") {
		props[propName] = {isEvent: false,
				   type: "string"};
	    }
	}
    }

});

/* basically, I'm listing all properties of dijit._Widget as suitable for ignoring; dijit._Widget's functionality is overridden by wm.Control;
 * also skipping any property that says its dependent on the dijit being in a specific type of container.
 * ignore value because calling setValue is causes infinite recursion errors */
wm.DijitControl.ignorelist = ["value", "baseClass", "class", "closable", "colspan", "column", "dir", "dndType", "dojoAttachEvent", "dojoAttachPoint", "dragRestriction", "iconClass", "id", "label", "lang", "layoutAlign", "layoutPriority", "minSize", "nodesWithKeyClick", "observer", "params", "region", "selected", "showTitle", "sizeMin", "sizeShare", "slideFrom", "spanLabel", "splitter", "srcNodeRef", "style", "toggleSplitterClosedThreshold", "waiRole", "waiState", "tabIndex", "templateString", "onShow", "onHide", "onClose"];

wm.Object.extendSchema(wm.DijitControl, {
    onMouseOver: {ignore: true},
    onMouseOut: {ignore: true}
});