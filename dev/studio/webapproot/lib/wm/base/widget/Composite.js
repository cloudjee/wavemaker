/*
 *  Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
 *
 */
dojo.provide("wm.base.widget.Composite");
dojo.require("wm.base.widget.Panel");

// Property Facade Publishing: helper API

// publish property "name" in "ctor" as a facade for target property "id"
wm.publishProperty = function(ctor, name, id, schema) {
	var pt = ctor.prototype;
	// fixme: expensive
	var parts = id.split(".");
	var target = parts.shift();
	var property = parts.join(".");
	if (schema.isEvent) {
		// event property name has to start with "on"
		if (name.slice(0,2) != "on")
			name = "on" + name;
		// initialize value in prototype
		pt[name] = function(inSender) {};
		// build getter/setter
		/*
		var capP = name.slice(0, 1).toUpperCase() + name.slice(1);
		pt["get" + capP] = function(inValue) {
			return this[name] = this.getValue(target).getValue(property);
		}
		pt["set" + capP] = function(inValue) {
			this.getValue(target).setValue(property, this[name] = inValue);
		}
		*/
	} else if (target) {
		// initialize value in prototype
		pt[name] = undefined;
		// build getter/setter
		var capP = name.slice(0, 1).toUpperCase() + name.slice(1);
		pt["get" + capP] = function(inValue) {
			return this[name] = this.getValue(target).getValue(property);
		}
		pt["set" + capP] = function(inValue) {
			this.getValue(target).setValue(property, this[name] = inValue);
		}
		// build special setter to avoid circular connection between setter and wire
		var pName = "source" + name;
		var pCapP = pName.slice(0, 1).toUpperCase() + pName.slice(1);
		pt["set" + pCapP] = function(inValue) {
			var t = this.getValue(target);
			if (t) {
				t._setProp(property, this[name] = inValue);
				this.valueChanged(name, inValue);
			}
		}
	}
	// extend schema
	var exSchema = {};
	if (schema)
		exSchema[name] = schema;
	wm.Object.extendSchema(ctor, exSchema);
	// register published properties
	var pb = pt.published = (pt.published || {});
	pb[name] = {name: name, id: id, target: target, property: property};
}

// Cause inCtor to publish inProperties (Array of property descriptors, [[ctor, name, id, schema]...])
wm.publish = function(inCtor, inProperties) {
	for (var i=0, p; p=inProperties[i]; i++) {
		p.unshift(inCtor);
		wm.publishProperty.apply(this, p);
	}
}

// To be mixed in with a container widget to create a composite,
// a custom widget which can own components and 
// exposes published component properties
dojo.declare("wm.CompositeMixin", null, {
        scrim: true, // prevent the user from interacting with the contents of the composite in designer
	lock: true, // prevent user from adding additional controls
	init: function() {
		//this.published = {};
		// FIXME: does createComposite need to come before inherited?
		this.initDomNode();
		this.createComposite();
		this.inherited(arguments);
	},
	postInit: function() {
		this.inherited(arguments);
		// initialize published properties
		for (var p in this.published) {
			// id qualifier to localize ids
			var pre = this.name + ".";
			var pub = this.published[p];
			if (this.schema[pub.name].isEvent) {
				var c = this.marshallFacade(pub.name);
				if (c.comp)
					dojo.connect(c.comp, pub.property, this, pub.name);
			} else {
				// propagate loaded values to underlying properties
				if (this[p] != this.constructor.prototype[p])
					this.setValue(p, this[p]);
				// watch changes on our source property, will propagate values up from source
				// (possibly round-tripping a value set above)
				// instead of using the real target name, use a special one ("source" + realTargetName)
				// to avoid circular connection
				new wm.Wire({target: this, targetProperty: "source" + pub.name, source: pre + pub.id, owner: this}).connectWire();
			}
		}

                this.start(); // this is created from a wm.Page where startup code goes in start method
                this.onStart();
	},
    start: function() {}, // meant to be overridden by the end user's composite
    onStart: function() {}, // meant to be overriden as standard event handler
	// get the target component for facade property inName
	marshallFacade: function(inName) {
		if (this.published) {
			var p = this.published[inName];
			if (p) {
				// FIXME: can't reuse "published[inName]".since "published"
				// is shared among all instances. But we do want to have
				// something to cache p.comp since getValue(p.target) is expensive
				p.comp = this.getValue(p.target);
			}
			return p;
		}
	},
	createComposite: function() {
		// We don't have a concept of binding scoped to the
		// Widget, so we do a fixup here.
		// FIXME: fix scoping in publisher instead because
		// we have more ready information at publish time.
		var c = dojo.clone(this.constructor.components);
		this.updateComponentsBinding(c);
		// construct designed components with "owner: this"
		this.createComponents(c, this);
	},
	updateComponentsBinding: function(inComponents) {
		// construct a directory of component names that are
		// local to this composite
		this.buildComponentsDir(inComponents);
		// locate bindings to local components and qualify
		// with a (widget name prefix?)
		this._updateComponentsBinding(inComponents);
	},
	buildComponentsDir: function(inComponents) {
		this._dir = {};
		this._buildComponentsDir(inComponents);
	},
	_buildComponentsDir: function(inComponents) {
		for (var i in inComponents) {
			this._dir[i] = true;
			this._buildComponentsDir(inComponents[i][3]);
		}
	},
	_fixupValue: function(inValue) {
		var v = inValue;
		if (v && v.split) {
			v = v.split(".").shift();
			if (v == "*")
				v = this.name;
			else if (this._dir[v])
				v = this.name + "." + inValue;
		}
		return v;
	},
	_fixupExpression: function(inValue) {
		var pre = this.name + ".";
		var srcs = wm.expression.getSources(inValue);
		for (var i in srcs) {
			inValue = inValue.replace(srcs[i], pre + srcs[i]);
		}
		return inValue;
	},
	_fixupProperties: function(inClass, inProps) {
		// qualify ids that refer to local components with "<name>."
		for (var p in inProps) {
			var v = inProps[p];
			switch(inClass){
				case "wm.Wire":
					switch(p){
						case "expression":
							v = this._fixupExpression(v);
							break;
						case "source":
							v = this._fixupValue(v);
							break; // switch(p)
					}
					break; // switch(inClass)
				default:
					switch(p){
						case "dataSet":
						case "dataOutput":
						case "liveSource":
						case "defaultButton":
							v = this._fixupValue(v);
							break; // switch(p)
					}
					break; // switch(inClass)
			}
			inProps[p] = v;
		}
	},
	_fixupEvents: function(inProps) {
		// qualify events that refer to local components with "<name>."
		for (var p in inProps) {
			inProps[p] = this._fixupValue(inProps[p]);
		}
	},
	_updateComponentsBinding: function(inComponents) {
		for (var i in inComponents) {
			var c = inComponents[i];
			this._fixupProperties(c[0], c[1]);
			this._fixupEvents(c[2]);
			this._updateComponentsBinding(c[3]); // children
			//c._isBindableSource = false;
		}
	}
});

// design only
wm.CompositeMixin.extend({
	// ask owner of the underlying property to generate an editor for facade property inName
	makePropEdit: function(inName, inValue, inDefault) {
		var p = this.marshallFacade(inName);
		if (p && p.comp) {
			// FIXME: default has to come from source prototype for inspector to correctly discern type
			// we should be able to discern this from schema
			inDefault = p.comp.constructor.prototype[p.property];
			//console.log(this, ": forwarding makePropEdit for published [", inName, "] to ", p);
			var e = p.comp.makePropEdit(p.property, inValue, inDefault);
			if (dojo.isString(e)) 
				return e.replace('name="' + p.property + '"', 'name="' + inName + '"');
			else if (e) {
				e.name = inName;
				return e;
			}
		}
		return this.inherited(arguments);
	},
	// ask owner of the underlying property to handle an edit-click request for facade property inName
	editProp: function(inName, inValue, inInspector) {
		var p = this.marshallFacade(inName);
		if (p && p.comp) {
			//console.log(this, ": forwarding editProp for published [", inName, "] to ", p);
			return p.comp.editProp(p.property, inValue, inInspector);
		}
		return this.inherited(arguments);
	},
	writeComponents: function(inIndent, inOptions) {
		var
			s = [];
			c = this.components.binding.write(inIndent);
		if (c) 
			s.push(c);
		return s;
	}
});

dojo.declare("wm.Composite", [wm.Container, wm.CompositeMixin], {
});

wm.Object.extendSchema(wm.Composite, {
	box: {ignore: 1},
	boxPosition: {ignore: 1},
	freeze: { ignore: 1 },
	lock: { ignore: 1 } // prevent user from unlocking in studio
});
