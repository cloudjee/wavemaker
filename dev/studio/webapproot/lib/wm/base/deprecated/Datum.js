/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.components.Datum");

/**
	Return an array representing "field path" <em>inPath</em>.
	Data fields can represented by strings using dot-notation, e.g.
		"customer.address.city"
	or as an array of fields, e.g.
		["customer", "address", "city"]
	Call <em>toPathArray</em> to ensure a path is in Array format.
*/
wm.toPathArray = function(inPath) {
	return inPath && (typeof inPath == "string") ? inPath.split('.') : inPath || [];
};

/**
	Return a string representing "field path" <em>inPath</em>.
	Data fields can represented by strings using dot-notation, e.g.
		"customer.address.city"
	or as an Array of fields, e.g.
		["customer", "address", "city"]
	Call toPathString to ensure a path is in String format.
*/
wm.toPathString = function(inPath) {
	return typeof inPath == "string" ? inPath : inPath.join('.');
};

/**
	Get a function that efficiently returns data item identified by
	<em>inPath</em> from an input data object.
	@example
	var g = wm.getGetter("customer.address.city");
	var city = g(data);
*/
wm.getGetter = function(inPath) {
	// FIXME: won't work in Adobe Air
	//return new Function("d", "return d.getValue()." + wm.toPathString(inPath));
	return new Function("i", "return i." + wm.toPathString(inPath));
};

/**
	Return an array of field information for an object using JS reflection.
	Field records have the form:
		{field: <name: String>, type: <type: String>[, fields: <sub-fields: Array>]}
*/
wm.reflectSchema = function(inObject, inId) {
	var schema = [], o, t, id, s;
	if (inObject) {
		for (var n in inObject) {
			o = inObject[n];
			t = o === null ? "string" : o instanceof Array ? "array" : typeof o;
			id = inId ? inId + n : n;
			s = {field: n, type: t, id: id, getter: wm.getGetter(id)};
			if (t == "object")
				s.fields = wm.reflectSchema(o, id + ".");
			else if (t == "array")
				// assume that list data will be accessed via local id, so we ignore
				// the aggregate id
				s.fields = wm.reflectSchema(o[0], "");
			schema.push(s);
		}
	}
	return schema;
};

/**
	Find the portion of inSchema that describes field inField.
	Field records (schema) have the form:
		{field: <name: String>, type: <type: String>[, fields: <sub-fields: Array>]}
*/
wm.findFieldSchema = function(inSchema, inFieldId) {
	var id = wm.toPathArray(inFieldId);
	var s = inSchema;
	while (id.length) {
		var f = id.shift();
		for (var i=0, si; si=s[i]; i++) {
			if (si.field == f)
				return wm.findFieldSchema(si.fields, id);
		}
		return [];
	}
	return s;
}

/**
	Stores a data value.
	A data value may be primitive or structured.
	Schema information may be utilized for lazy loading or typing services.
	There are two access methods:
		- getNamedValue: slow access supports lazy loading
		- getGetter: fast access but no support for lazy loading
	@class
	@name wm.Datum
	@extends wm.Object
*/
dojo.declare("wm.Datum", wm.Component, {
	value: null,
	updating: false,
	constructor: function() {
	},
	create: function() {
		this.inherited(arguments);
		this.id = this.name;
	},
	notify: function(inMessage, inInfo) {
		this.updating = true;
		var m = this.id + "." + inMessage;
		var i = inInfo || [];
		console.group(m);
		console.info("Datum.notify: publishing", m, i);
		dojo.publish(m, [i, this]);
		console.groupEnd(m);
		this.updating = false;
	},
	changed: function(inPath) {
		if (!this.updating)
			this.notify("field-changed", inPath);
	},
	_setValue: function(inValue) {
		this.value = inValue;
	},
	setValue: function(inValue) {
		if (inValue !== this.value && !this.updating) {
			// store the previous value in the cache
			this.cacheValue();
			this._setValue(inValue);
			// if the cache is empty, store this value in the cache
			this.cacheValue();
			this.changed();
		}
	},
	getValue: function() {
		return this.value;
	},
	isDirty: function() {
		return "cache" in this;
	},
	cacheValue: function() {
		if (!("cache" in this)) {
			var v = this.getValue();
			if (v !== null)
				this.cache = dojo.clone(v);
		}
	},
	_decache: function() {
		delete this.cache;
	},
	commit: function() {
		this._decache();
		this.notify("field-changed");
	},
	rollback: function() {
		if (this.isDirty()){
			this.value = this.cache;
			//delete this.cache;
			this.changed();
		}
	},
	clear: function() {
		this._decache();
		this.cacheValue();
		this.setValue(null);
	},
	marshall: function(inName, inValue, inType) {
		if (this.source) {
			console.info('wm.Datum.marshall: marshalling {} for "', inName, '"');
			this.source.marshall(inName, inValue, inType);
		} else {
			console.info('wm.Datum.marshall: no source to marshall "', inName, '"');
			inValue[inName] = null; //{};
		}
	},
	getNamedValue: function(inPath, inNotNull) {
		// inPath may be an array or a dot-string
		var p = wm.toPathArray(inPath);
		var v = this.getValue();
		// FIXME: allow value to be 'null' for structures
		if (p.length && v == null)
			v = this.value = {};
		for (var i=0, l=p.length; i<l; i++) {
			// process items left-to-right
			var n = p[i];
			// TODO: fetch the type record for item 'n'
			var t = null;
			// marshall this data value if necessary
			if (!v || typeof v != "object") {
				console.error("Datum.getNamedValue: attempt to extract value from non-object", inPath);
				return null;
			} else if (!(n in v)) {
				this.marshall(n, v, t);
				// FIXME: more junk to allow value to be 'null' for structures
				// if we marshalled null, but will descend more
				// substitute an empty object
				if ((i<l-1 || inNotNull) && v[n] == null) 
					v[n] = {};
			}
			// grab up this data value
			v = v[n];
		}
		return v;
	},
	setNamedValue: function(inPath, inValue) {
		// inPath may be an array or a dot-string
		var p = wm.toPathArray(inPath);
		this.cacheValue();
		var field = p.pop();
		var v = this.getNamedValue(p, true);
		p.push(field);
		// FIXME: more junk to allow value to be 'null' for structures
		// if we marshalled null, substitute an empty object
		if (v==null || typeof v != "object") {
			console.error("Datum.getNamedValue: attempt to set value on non-object", p);
			return;
		}
		if (v[field] !== inValue) {
			v[field]= inValue;
			this.changed(p);
		}
	},
	reflectSchema: function() {
		return wm.reflectSchema(this.getValue());
	}
});

dojo.mixin(wm.Datum, {
	getGetter: wm.getGetter
});

wm.NIL = {};

dojo.declare("wm.Data", wm.Datum, {
	cursor: 0,
	items: [],
	create: function() {
		this.inherited(arguments);
		this.iterator = new wm.Iterator(this);
		this.setData(this.data);
	},
	setData: function(inData) {
		this.items = [ null ];
		if (inData) {
			if ((typeof inData != 'object') || !("length" in inData)) {
				this.items[0] = inData;
			} else {
				// CAVEAT: we are referencing input data:  powerful but dangerous
				this.items = inData;
			}
		}
		this.reset();
	},
	getLength: function() {
		return this.items.length;
	},
	isValidIndex: function(inIndex) {
		return inIndex >= 0 && inIndex < this.items.length;
	},
	getItem: function(inCursor) {
		return this.isValidIndex(inCursor) ? this.items[this.cursor] : wm.NIL;
	},
	setCursor: function(inCursor) {
		if (this.isValidIndex(inCursor)) {
			this.cursor = inCursor;
			this.value = this.items[this.cursor];
			this.changed();
		}
		return this;
	},
	_setValue: function(inValue) {
		this.items[this.cursor] = inValue;
		this.value = inValue;
	},
	// iterator facade
	sort: function(inBy, inTrueToDescend) {
		this.setCursor(this.iterator.sort(inBy, inTrueToDescend));
	},
	unsort: function(inBy) {
		this.setCursor(this.iterator.unsort());
	},
	reset: function() {
		this.setCursor(this.iterator.reset());
	},
	next: function() {
		this.setCursor(this.iterator.next());
	},
	prev: function() {
		this.setCursor(this.iterator.prev());
	}
});

wm.EOF = {};

dojo.declare("wm.Iterator", null, {
	index: 0,
	constructor: function(inData) {
		this.data = inData;
		this.reset();
	},
	getCursor: function() {
		return this.cursor = this.map ? this.map[this.index] : this.index;
	},
	setIndex: function(inIndex) {
		this.index = inIndex;
		this.data.setCursor(this.getCursor());
	},
	reset: function() {
		this.index = 0;
		this.length = this.data.getLength();
		return this.getCursor();
	},
	next: function() {
		if (++this.index >= this.length)
			this.index = 0;
		return this.getCursor();
	},
	prev: function() {
		if (--this.index < 0)
			this.index = this.length - 1;
		return this.getCursor();
	},
	initMap: function() {
		this.map = [];
		//this.imap = [];
		for (var i=0; i<this.length; i++) {
			this.map.push(i);
			//this.imap.push(i);
		}
	},
	getArraySort: function(inQuery, inTrueToDescend) {
		var i$ = this.data.items;
		var cmp = wm.Iterator.compare;
		var path = wm.toPathString(inQuery);
		var sign = inTrueToDescend ? -1 : 1;
		var fn;
		/*
		eval([
			"fn = function(a, b) {",
			"  a = i$[a]." + path + ";",
			"  b = i$[b]." + path + ";",
			"  return cmp(a, b) * sign;",
			"}"
		].join(''));
		*/
		var code = cmp.toString().match(/{([\s\S]*)}/)[1];
		eval([
			"fn = function(a, b) {",
			"  a = i$[a]." + path + ";",
			"  b = i$[b]." + path + ";",
			code,
			"}"
		].join(''));
		console.log(fn.toString());
		return fn;
	},
	unsort: function() {
		this.initMap();
		return this.getCursor();
	},
	sort: function(inBy, inTrueToDescend) {
		this.reset();
		this.initMap();
		var sorter = this.getArraySort(inBy, inTrueToDescend);
		console.time("wm.Iterator.sort");
		this.map.sort(sorter);
		console.timeEnd("wm.Iterator.sort");
		return this.getCursor();
	}
});

dojo.mixin(wm.Iterator, {
	compare: function(a, b, sign) {
		if (a > b) 
			return sign;
		else if (a < b)
			return -(sign);
		else
			return 0;
	}
});

dojo.declare("wm.AbstractIterator", null, {
	// FIXME: meanings of "cursor" and "index" are backwards as used
	index: -1,
	constructor: function() {
	},
	//getLength // abstract
	//getItem // abstract
	//getArraySort // abstract
	isValidIndex: function(inIndex) {
		return inIndex >= 0 && inIndex < this.length;
	},
	getCursor: function() {
		return this.cursor = this.map ? this.map[this.index] : this.index;
	},
	setIndex: function(inIndex) {
		this.index = inIndex;
		return this.value = (this.isValidIndex(this.index) ? this.getItem(this.getCursor()) : wm.NIL);
	},
	reset: function() {
		this.length = this.getLength();
		this.setIndex(-1);
	},
	next: function() {
		return this.setIndex(++this.index);
	},
	prev: function() {
		return this.setIndex(--this.index);
	},
	initMap: function() {
		this.map = [];
		//this.imap = [];
		for (var i=0; i<this.length; i++) {
			this.map.push(i);
			//this.imap.push(i);
		}
	},
	unsort: function() {
		delete this.map;
		return this.getCursor();
	},
	sort: function(inBy, inTrueToDescend) {
		this.reset();
		this.initMap();
		var sorter = this.getArraySort(inBy, inTrueToDescend);
		console.time("wm.AbstractIterator.sort");
		this.map.sort(sorter);
		console.timeEnd("wm.AbstractIterator.sort");
		return this.getCursor();
	}
});

dojo.declare("wm.DataIterator", wm.AbstractIterator, {
	constructor: function(inData, inRoot) {
		this.root = inRoot;
		this.setData(inData);
	},
	setData: function(inData) {
		this.data = $$(inData);
	},
	getItems: function() {
		return this.items = (this.root ? this.data.getNamedValue(this.root) : this.data.items);
	},
	getLength: function() {
		return !this.data ? 0 : (this.getItems() ? this.items.length : 0);
	},
	getItem: function(inIndex) {
		// CAVEAT: won't lazy load
		return this.items[inIndex];
	},
	getArraySort: function(inQuery, inTrueToDescend) {
		var path = wm.toPathString(inQuery);
		var sign = inTrueToDescend ? -1 : 1;
		var cmp = wm.Iterator.compare;
		var code = cmp.toString().match(/{([\s\S]*)}/)[1];
		var i$ = this.getItems();
		var fn;
		eval([
			"fn = function(a, b) {",
			"  a = i$[a]." + path + ";",
			"  b = i$[b]." + path + ";",
			code,
			"}"
		].join(''));
		console.log(fn.toString());
		return fn;
	}
});

registerPackage(["Components", "Data", "wm.Data", "wm.base.components.Datum", "images/wm/variable_24.png", ""]);
