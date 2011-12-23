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

dojo.provide("wm.base.data.SimpleStore");
dojo.require("dojo.data.util.simpleFetch");

dojo.declare("wm.base.data.SimpleStore", null, {
	constructor: function(inData, inIdentity) {
		// assumed to be a list .isList = true
		this.data = inData || [];
		this.identity = inIdentity;
	},
	getCount: function() {
		return this.data.length;
	},
	// find item by identity
	_fetchItemByIdentity: function(inIdentity) {
		var id = this.identity;
		for (var i=0, data = this.data, l=this.getCount(), d; i<l && (d=data[i]); i++)
			if (d[id] === inIdentity)
				return d;
	},
	
	_getQuery: function(inRequest) {
		var query = inRequest.query;
		if (dojo.isString(query)) {
			var q = query;
			query = {};
			query[this.identity] = q;
		}
		return query;
	},
	// one level deep object matching
	_objectsMatch: function(inA, inB) {
		var
			ac = 0,
			a = inA instanceof wm.Variable ? inA.getData() : inA,
			b = inB instanceof wm.Variable ? inB.getData() : inB;
		for (var i in a) {
			// ignore object properties since we are matching only 1 level deep
			if (dojo.isObject(a[i]))
				continue;
			ac++;
			if (a[i] != (b && b[i]))
				return;
		}
		var bc = 0;
		for (var i in b) {
			// ignore object properties since we are matching only 1 level deep
			if (!dojo.isObject(b[i]))
				bc++;
		}
		return ac == bc;
	},
	_itemInQuery: function(inItem, inQuery, inIgnoreCase, inExactMatch) {
		var
			d = inItem, w = "*", a, b, exact;
		for (var i in inQuery) {
		        a = d[i];
                        if (dojo.isString(a)) a = a.replace(/\\([^\\])/g,"$1");

		        b = inQuery[i];
                        if (dojo.isString(b)) b = b.replace(/\\([^\\])/g,"$1");

			if (b == w)
				continue;
		    exact = inExactMatch || (typeof b == "string" && b.indexOf(w) == - 1);
			if (dojo.isString(a) && dojo.isString(b) && !exact) {
				if (b.charAt(b.length-1) == w)
					b = b.slice(0, -1);
				if (inIgnoreCase) {
					a = a.toLowerCase();
					b = b.toLowerCase();
				}
				if (a.indexOf(b) != 0)
					return;
			}
			else if (dojo.isObject(a) && dojo.isObject(b)) {
				return this._objectsMatch(a, b);
			}
			else if (a !== b)
				return;
		}
		return true;
	},
	
	_fetchItems: function(inRequest, inFetchHandler, inErrorHandler) {
		var
			query = this._getQuery(inRequest),
			opts = inRequest.queryOptions,
			ignoreCase = opts && opts.ignoreCase,
			exactMatch = opts && opts.exactMatch,
			result = [];
		for (var i=0, data = this.data, l=this.getCount(), d; i<l && (d=data[i]); i++)
			if (this._itemInQuery(d, query, ignoreCase, exactMatch)) {
				result.push(d);
				if (exactMatch)
					break;
			}
		inFetchHandler(result, inRequest);
		// FIXME: ever an error condition?
	},
	
	_assertIsItem: function(/* item */ item){
		if(!this.isItem(item)){ 
			throw new Error("Invalid item:", item);
		}
	},
	getValue: function(	/* item */ item, 
						/* attribute-name-string */ attribute, 
						/* value? */ defaultValue){
		this._assertIsItem(item);
		var v = item[attribute];
		return v !== undefined ? v : defaultValue;
	},
	getValues: function(/* item */ item,
						/* attribute-name-string */ attribute){
		var d = this.getValue(item, attribute);
		return d ? [d] : []; // an array that may contain literals and items
	},
	
	getAttributes: function(/* item */ item){
		this._assertIsItem(item);
		var
			result = [];
			for (var i in item)
				result.push(i);
		return result; // array
	},

	hasAttribute: function(/* item */ item,
							/* attribute-name-string */ attribute){
		this._assertIsItem(item);
		for (var i in item)
			if (attribute == i)
				return true;
		return false;
	},

	containsValue: function(/* item */ item,
							/* attribute-name-string */ attribute, 
							/* anything */ value){
		this._assertIsItem(item);
		return (this.getValue(item, attribute) === value);
	},

	isItem: function(/* anything */ something){
		return something && dojo.isObject(something);
	},

	isItemLoaded: function(/* anything */ something) {
		return this.isItem(something);
	},

	loadItem: function(/* object */ keywordArgs){
		if (!this.isItemLoaded(keywordArgs.item)) {
			throw new Error('Unimplemented API: dojo.data.api.Read.loadItem');
		}
	},
	
	getFeatures: function(){
		return {
			'dojo.data.api.Read': true,
			'dojo.data.api.Identity': true
		};
	},

	close: function(/*dojo.data.api.Request || keywordArgs || null */ request){
	},

	getLabel: function(/* item */ item){
		this._assertIsItem(item);
		return (item || []).toString();
	},

	getLabelAttributes: function(/* item */ item){
		return this.getAttributes(item);
	},
	
	getIdentity: function(/* item */ item){
		this._assertIsItem(item);
		return item[this.identity] || null;
	},

	getIdentityAttributes: function(/* item */ item){
		return this.identity;
	},

	fetchItemByIdentity: function(/* object */ keywordArgs){
		var inIdentity = keywordArgs.identity;
		if (inIdentity === undefined) {
			if(keywordArgs.onError)
				keywordArgs.onError.call(scope, "No item found");
			return;
		}
		var
			item = this._fetchItemByIdentity(inIdentity),
			scope = keywordArgs.scope ? keywordArgs.scope : dojo.global;
		if (item) {
				if(keywordArgs.onItem)
					keywordArgs.onItem.call(scope, item);
		} else {
			if(keywordArgs.onError)
				keywordArgs.onError.call(scope, "No item found");
		}
	}
});

//Mix in the simple fetch implementation to this class.
dojo.extend(wm.base.data.SimpleStore,dojo.data.util.simpleFetch);
