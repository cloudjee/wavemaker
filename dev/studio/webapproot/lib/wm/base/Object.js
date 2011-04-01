/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.Object");
dojo.require('wm.base.lib.util');

/**
	Base class that supports property inspection and binding.
	<br/><br/>
	Almost all objects in WaveMaker are instances of <i>wm.Object</i>.
	In particular, all Components and Widgets descend from <i>wm.Object</i> 
	<br/><br/>
	<i>wm.Object</i> supports a generalized property system: in order to
	access or modify properties on a <i>wm.Object</i> use the
	<a href="#getValue">getValue</a>/<a href="#setValue">setValue</a> API.
	<br/><br/>
	<a href="#getValue">getValue</a> takes the name of the property to examine. 
	<a href="#setValue">setValue</a> takes 
	the name of the property and the value to set. 
	<a href="#getValue">getValue</a>/<a href="#setValue">setValue</a> support dot notation.
	<br/><br/>
	For all objects that descend from <i>wm.Object</i>.use the
	<a href="#getValue">getValue</a>/<a href="#setValue">setValue</a>
	API to access documented properties 
	<br/><br/>
	Examples
	@example
	// To examine the name of a Component
	var n = this.myComponent.getValue("name");
	<br/>
	// To change the name of the Component
	this.myComponent.setValue("name", "newName");
	<br/>
	//"panel1" contains an object named "label1"
	this.panel1.setValue("label1.caption", "hello world");
	
	@name wm.Object
	@class
*/
dojo.declare("wm.Object", null, {
	/** @lends wm.Object.prototype */
	// hey ma, no props!
	//===========================================================================
	// Construction
	//===========================================================================
	constructor: function() {
		this.type = this.declaredClass;
	},
	/**
		Returns a string identifier (primarily for debugging).
	*/
	toString: function() {
		return '[' + this.declaredClass + ']';
	},
	//===========================================================================
	// Properties
	//===========================================================================
	/** @private */
	getProp: function(inPropertyName) {
		var g = this._getPropWorker(this, inPropertyName, "get");
		if (g)
			return g.call(this, inPropertyName);
		else
			return this._getProp(inPropertyName);
	},
	_getProp: function(inProp) {
		return this[inProp];
	},
	/** @private */
	setProp: function(inProp, inValue) {
		if (this.isDestroyed)
			return;
		var s = this._getPropWorker(this, inProp, "set");
		if (s)
			s.call(this, inValue);
		else
			this._setProp(inProp, inValue);
		this.valueChanged(inProp, this.getProp(inProp));
	},
	_setProp: function(inProp, inValue) {
		if (inProp in this)
			this[inProp] = inValue;
	},
	_getPropWorker: function(inObj, inProp, inPrefix) {
		//if (inProp=="dataValue" || inProp=="value")
		//	return null;
		var w = inObj._isDesignLoaded && inObj[inPrefix + "_" + inProp] || this[inPrefix + inProp.slice(0, 1).toUpperCase() + inProp.slice(1)];
		if (dojo.isFunction(w))
			return w;
	},
	//===========================================================================
	// Values
	//===========================================================================
	/** @private */
	valueChanged: function(inProp, inValue) {
	},
	_getValue: function(inProp) {
		// private API for getting a named value/property
		// for Object, values are props
		return this.getProp(inProp);
	},
	_setValue: function(inProp, inValue) {
		// private API for setting a named value/property
		// for Object, values are props
		this.setProp(inProp, inValue);
	},
	/**
		Get the value of a named property.
		
		Supports dot notation, e.g. 
		@example this.getValue("customer.name.first")
		
		@param {String} inName Name of property
		
		@see <a href="#setValue">setValue</a>
	*/
	getValue: function(inName) {
		// public API for getting a named value/property using dot-notation
		// all *actual* getting is delegated, we only manage dots here
		// inProp is like "foo.bar.baz" or ["foo", "bar", "baz"]
		if (!inName)
			return;

		// Replace all [\d+] with .[\d+] so that split will work properly and separate out array index substrings
	    var parts = dojo.isString(inName) ? inName.replace(/([^\.])\[/g, "$1.[").split('.') : inName;

	    // if we get something stupid like "studio.wip.widgetname" thats not going to be resolvable by this object as this object won't 
	    // know what studio is.  window does know what studio is...
	    var o = (parts[0] == "studio" && this instanceof wm.Application) ? window : this;
	    var p;
		while (parts.length > 1) {
			p = parts.shift();
			var pmatch;
			// replace ${myVar[5]} with ${myVar.[5]}
			if (this instanceof wm.Variable || this instanceof Array) {
			  pmatch =  p.match(/^\[(\d+)\]$/);
		        }
			if (pmatch && this instanceof wm.Variable)
			  o = o.getItem(pmatch[1]);
			else if (pmatch && this instanceof Array)
			  o = o[pmatch1];
			else
			  o = o.getValue ? o.getValue(p) : o[p];
			if (!o) {
				wm.logging && console.debug(this, "notice: Object.getValue: couldn't marshall property ", p, " for ", inName);
				return;
			}
			if (o.getValue)
				return o.getValue(parts);
		}
		p = parts.shift();
		return o._getValue ? o._getValue(p) : o[p];
	},
	/**
		Set the value of a named property. 
		Using this method to set properties is <b>required</b> to support binding.
		
		Supports dot notation, e.g. 
		@example this.setValue("customer.name.first", "Harry")
		
		@param {String} inName Name of property
		@param {Any} inValue Value to set on property
		
		@see <a href="#setValue">getValue</a>
	*/
	setValue: function(inName, inValue) {
		// public API for setting a named value/property using dot-notation
		// all *actual* setting is delegated, we only manage dots here
		// inProp is like "foo.bar.baz" or ["foo", "bar", "baz"]
		var parts = dojo.isString(inName) ? inName.split('.') : inName, o=this, p;
		while (parts.length > 1) {
			o = o.getValue(parts.shift());
			// it's possible this value is not yet settable
			if (!o)
				return;
			if (o instanceof wm.Object)
				return o.setValue(parts, inValue);
		}
		p = parts.shift();
		o._setValue ? o._setValue(p, inValue) : o[p] = inValue;
	}
});

//===========================================================================
// Class Properties
//===========================================================================
/** @lends wm.Object */
dojo.mixin(wm.Object, {
	/**
		@private
		Object metadata (aka "schema") is stored using function prototypes
		(aka classes) to take advantage of built-in copy-on-write 
		prototype chaining.
		Schema class is stored in a class-property called "schemaClass",
		and an instance of it is made available in the related class prototype 
		as "schema".
	*/
	//FIXME: have I confused myself into using a overly complex mechanism? 
	makeSchema: function(inClass) {
		//console.info("makeSchema:", inClass.prototype);
		// make an empty function so we get a prototype
		inClass.schemaClass = function(){};
		var superClass = inClass.superclass;
		try{
			if (inClass._meta.parents && inClass._meta.parents.length > 1){
				superClass = inClass._meta.parents[0].prototype;
			}
		}
		catch(e){
			// do nothing.
		}
		
		// if we have a superclass, chain to it's schema
		if (superClass) {
			var ctor = this.getSchemaClass(superClass.constructor);
			inClass.schemaClass.prototype = new ctor();
		}
		inClass.prototype.schema = new inClass.schemaClass();
		return inClass.schemaClass;
	},
	/** @private */
	// Get the schema class for class inClass. Manufacture the schema class if necessary.
	getSchemaClass: function(inClass) {
		return inClass.schemaClass || wm.Object.makeSchema(inClass);
	},
	/**
		Add entries to a class schema.
		Note that "inClass" is a class (function), not a class-name (string).
		
		@param {Function} inClass Add schema entries to this class.
		@param {Object} inSchema Schema entries in object notation.
		
		@example
wm.Object.extendSchema(wm.MyButton, {
	confirmPrompt: { writeonly: 1} // configure flags for confirmPrompt property
});
	*/
	extendSchema: function(inClass, inSchema) {
	    if (!wm.extendSchemaDictionary && wm.studioConfig) {
		dojo.requireLocalization("language", "schema");
		wm.extendSchemaDictionary = dojo.i18n.getLocalization("language", "schema");
	    }
	    if (!wm.extendSchemaDictionary) 
		wm.extendSchemaDictionary = {};
	    var className = inClass.prototype.declaredClass;
	    var dictionary = wm.extendSchemaDictionary[className];
	    if (dictionary) {
		for (var i in dictionary) {
		    if (inSchema[i]) {
			inSchema[i].shortname = dictionary[i];
		    } else {
			inSchema[i] = {shortname: dictionary[i]};
		    }
		}
	    }
		dojo.extend(wm.Object.getSchemaClass(inClass), inSchema);
		// expunge memoized property information
		delete inClass._publishedProps;
	}
});

//===========================================================================
// Design Schema
//===========================================================================

wm.Object.extendSchema(wm.Object, {
	declaredClass: { ignore: 1 },
	schema: { ignore: 1 },
	schemaClass: { ignore: 1 },
    type: { ignore: 1 },
    setValue: {ignore: 1, group: "method"},
    getValue: {ignore: 1, group: "method", returns: "Any"}
});

//===========================================================================
// Design Time Extensions
//===========================================================================
/** @lends wm.Object.prototype */
/**#@+ @design */
wm.Object.extend({
	//===========================================================================
	// Extensions for property enumeration
	//===========================================================================
	/**
		Hook for subclasses to add flags to the typeInfo structure
		for property <i>inName</i>.
		Called from <a href="#getPropertyType">getPropertyType</a>.
		@param {String} inName Name of property.
		@param {Object} inTypeInfo Type info structure to modify.
	*/
	getPropFlags: function(inName, inTypeInfo) {
	},
	/**
		Get type information for a property.
		Returns a structure containing schema information for property <i>inName</i>,
		including at least the following fields:
		<ul>
			<li>type: <i>(string) name of type</i></li>
			<li>isObject: <i>(boolean) true if property is itself a wm.Object</i></li>
			<li>isEvent: <i>(boolean) true if property represents an event</i></li>
		</ul>
	*/
	getPropertyType: function(inName) {
		var v = this.getProp(inName);
		var t = {
			type: v && v.type || typeof v,
			isObject: v instanceof wm.Object
		}
		this.getPropFlags(inName, t);
		var s = this.schema[inName] || {
		    noprop: Boolean((v === undefined) || (v === null) || inName.charAt(0)=='_' || (dojo.isFunction(v) || dojo.isObject(v)) && !t.isCustomMethod)
		};
		return dojo.mixin(t, s);
	},
	// $ Build property information into ioProps from the properties of
	// $ inSchema filtered by inGetTypeInfo function (or getPropertyType by default).
	_listSchemaProperties: function(ioProps, inSchema, inGetTypeInfo) {
		var getInfo = this[inGetTypeInfo||"getPropertyType"], op = Object.prototype;
		for (var p in inSchema) {
			if (p == 'inherited'){
				//console.info('ignoring inherited function here..... for id = ', inSchema.id);
				continue;	
			}
			
			if (!(p in ioProps) && !(p in op)) {
				var t = getInfo.call(this, p);
				if (!t.noprop)
					ioProps[p] = t;
			}
		}
		return ioProps;
	},
	//$ Combine property information from basic reflection with
	//$ explicit schema information to form a list
	//$ of property information records.
	_listProperties: function() {
		var props = {};
		this._listSchemaProperties(props, this);
		return this._listSchemaProperties(props, this.schema);
	},
	/**
		Return memoized list of property information records.
	*/
	listProperties: function() {
		return this.constructor._publishedProps || (this.constructor._publishedProps = this._listProperties());
	},
	/**
		Return memoized list of value information records.
		wm.Object does not distinguish properties from values, so
		the base implementation just calls <a href="#listProperties">listProperties</a>.
	*/
	listDataProperties: function() {
		return this.listProperties();
	}
});

/**#@-*/

//===========================================================================
// One-stop wm.Objects
//===========================================================================
wm.define = function(inClass, inSuperclasses, inProperties) {
	if (arguments.length < 3) {
		inProperties = inSuperclasses;
		inSuperclasses = wm.Control;
	}
	var schema = inProperties.published;
	delete inProperties.published;
	var ctor = dojo.declare(inClass, inSuperclasses, inProperties);
	wm.Object.extendSchema(ctor, schema);
	return ctor;
}
