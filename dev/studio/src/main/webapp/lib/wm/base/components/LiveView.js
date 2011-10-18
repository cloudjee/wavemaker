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

dojo.provide("wm.base.components.LiveView");
dojo.require("wm.base.Component");
dojo.require('wm.base.lib.data');

// View related utitlities
wm.getViewField = function(inTypeSchema, inPropName) {
	if (inTypeSchema) {
		var propInfo = wm.typeManager.getPropertyInfoFromSchema(inTypeSchema, inPropName);
		return {
			caption: wm.capitalize(inPropName.split(".").pop()),
			sortable: true,
			dataIndex: inPropName,
			type: propInfo.type,
			//displayType: wm.getPrimitiveDisplayType(propInfo.type),
			displayType: wm.getDisplayType(propInfo), //xxx
			required: propInfo.required,
			readonly: dojo.indexOf(propInfo.noChange||[], "read") >= 0, 
			includeLists: true,
			includeForms: true,
			order: propInfo.fieldOrder,
			subType: propInfo.fieldSubType //xxx
		};
	}
}

wm.getDefaultView = function(inTypeName, inPropertyPath) {
	inPropertyPath = inPropertyPath || "";
	var
		v = [], tm = wm.typeManager,
		schema = tm.getTypeSchema(inTypeName),
		propSchema = inPropertyPath ? tm.getTypeSchema(tm.getPropertyInfoFromSchema(schema, inPropertyPath).type) : schema,
		fields = wm.typeManager.getSimplePropNames(propSchema);
		wm.forEach(fields, function(f) {
			v.push(wm.getViewField(schema, (inPropertyPath ? inPropertyPath + "." : "") + f));
		});
	return v;
}

/**
	Component that provides information about live service, datatype,
	related objects, and field information.
	@name wm.LiveView
	@class
	@extends wm.Component
*/
dojo.declare("wm.LiveView", wm.Component, {
	/** @lends wm.LiveView.prototype */
	/** Name of the service on which this view operates. */
	service: "",
	/** Fully qualified data type we operate on. */
	dataType: "",
	/** Fields to fetch */
	related: [],
	/** Fields to display */
	view: [],
	constructor: function() {
		this.related = [];
		this.view = [];
	},
	init: function() {
		this.inherited(arguments);
		this.setDataType(this.dataType);
	},
	loaded: function() {
		this.inherited(arguments);
		this.viewChanged();
	},
	viewChanged: function() {
		dojo.publish(this.getRuntimeId() + "-viewChanged", [this.getId()]);
	},
	createDefaultView: function() {
		this.setFields(this.related || [], wm.getDefaultView(this.dataType));
	},
	getRelatedFields: function(){
		if (!this.related || this.related.length == 0)
			this.related = this.getRequiredRelatedFields();
		return this.related || [];
	},
	getRequiredRelatedFields: function(){
		try
		{
			var ts = [];
			var schema = wm.typeManager.getTypeSchema(this.dataType);
			for (var i in schema) {
				var field = schema[i];
				var isRelatedField = wm.typeManager.isStructuredType(field.type);
				if (isRelatedField && field.required)
				{
					if (field.type == "com.sforce.soap.enterprise.salesforceservice.QueryResultType") 
						continue; //xxx
					this.addRelated(i);
					ts.push(i);
				}
			}
			
			return ts;
		}
		catch(e)
		{
			console.info('error finding required fields.', e);
		}
		
		return [];
	},
	setFields: function(inRelated, inView) {
		this.related = inRelated;
		this._sortView(inView);
		this.view = inView;
	},
	getFieldIndex: function(inField) {
		var di = dojo.isObject(inField) ? inField.dataIndex : inField;
		for (var i=0, view=this.view, f; f=view[i]; i++)
			if (f.dataIndex == di)
				return i;
		return -1;
	},
	hasField: function(inField) {
		return (this.getFieldIndex(inField) > -1);
	},
	getRelatedIndex: function(inRelated) {
		for (var i=0, related=this.related, r; r=related[i]; i++)
			if (r == inRelated)
				return i;
		return -1;
	},
	hasRelated: function(inRelated) {
		return (this.getRelatedIndex(inRelated) > -1);
	},
	addField: function(inField) {
		var f = inField && wm.getViewField(wm.typeManager.getTypeSchema(this.dataType), inField);
		if (f && !this.hasField(f)) {
			this.view.push(f)
			this._sortView(this.view);
		}
		return f;
	},
	removeField: function(inField) {
		var i = this.getFieldIndex(inField);
		if (i > -1)
			this.view.splice(i, 1);
	},
	addRelated: function(inRelated) {
		if (inRelated && !this.hasRelated(inRelated)) {
			this.related.push(inRelated);
			this.addRelatedDefaultView(inRelated);
		}
	},
	removeRelated: function(inRelated) {
		var i = this.getRelatedIndex(inRelated);
		if (i > -1)
			this.related.splice(i, 1);
	},
	addRelatedDefaultView: function(inRelated) {
		var relatedFields = wm.getDefaultView(this.dataType, inRelated);
		dojo.forEach(relatedFields, function(f) {
			if (!this.hasField(f))
				this.view.push(f);
		}, this);
		this._sortView();
	},
	
	_sortView: function(inView) {
		if (dojo.isArray(inView)) {
			var t = this.dataType;
			// sort view by order or alpha place property chain
			inView.sort(function(a, b) {
				// if either has order, compare by order
				if (wm.isNumber(a.order) || wm.isNumber(b.order)) {
					return wm.compareNumbers(a.order, b.order);
				// otherwise compare by "shallowest" or alpha
				} else {
					a = a.dataIndex;
					b = b.dataIndex;
					var al = a.split(".").length, bl = b.split(".").length;
					return al == bl ? wm.data.compare(a, b) : wm.compareNumbers(al, bl);
				}
			});
		}
	},
	_copyView: function(inView) {
		var view = [];
		for (var i=0, v; (v=inView[i]); i++)
			view.push(dojo.mixin({}, v));
		return view;
	},
	getViewById: function(inLiveViewId) {
		if (inLiveViewId instanceof wm.LiveView)
			return inLiveViewId;
		else if (inLiveViewId)
			return this.getRoot().app.getValueById(inLiveViewId);
	},
	copyLiveView: function(inLiveView) {
		var lv = this.getViewById(inLiveView);
		if (lv) {
			this.setService(lv.service);
			this.setDataType(lv.dataType);
			var v = this._copyView(lv.view);
			this.setFields(lv.related, v);
		} else
			this.clearView();
	},
	clearView: function() {
		this.setService("");
		this.setDataType("");
		this.setFields([], []);
	},
	setService: function(inService) {
		this.service = inService;
	},
	//$ Set the dataType for the dataView. This is a type that supports crud operations.
	setDataType: function(inType) {
	    if (this._typeChangeSubscribe) {
		dojo.disconnect(this._typeChangeSubscribe);
		delete this._typeChangeSubscribe;
	    }
		var t = this.dataType;
		this.dataType = inType;
		if (t != this.dataType)
			this.dataTypeChanged();
		if (this._defaultView)
			this.createDefaultView();

	    if (this._isDesignLoaded && this.owner instanceof wm.Variable) {
		var typeInfo = wm.typeManager.getType(this.dataType);
		if (typeInfo) {
		    this._typeChangeSubscribe = this._subscribeTypeChange = dojo.subscribe("ServiceTypeChanged-" + typeInfo.service, dojo.hitch(this, function() {
			this.owner.typeChanged(this.owner.type);
		    }));
		}
	    }
	},
	dataTypeChanged: function() {
		// FIXME: we need to do something smart here. changing the datatype should probably zot
		// the view info and may need to inform things bound to this and/or update.
		this.related = [];
		this.view = [];
	},
	hasRelatedProp: function(inRelatedProp) {
		for (var i=0, related=this.related, r; (r=related[i]); i++)
			if (r == inRelatedProp)
				return true;
	},
	getListView: function(inPropPath) {
		var schema = wm.typeManager.getTypeSchema(this.getSubType(inPropPath));
		return dojo.filter(this.getSubView(inPropPath), function(v) {
			return !wm.typeManager.isPropInList(schema, v.dataIndex);
		})
	},
	// get the type of a property path from our dataType
	getSubType: function(inPropPath) {
		if (inPropPath) {
			var schema = wm.typeManager.getTypeSchema(this.dataType);
			return (schema && (wm.typeManager.getPropertyInfoFromSchema(schema, inPropPath) || 0).type) || this.dataType;
		} else
			return this.dataType;
	},
	// get a related list starting at inPropPath
	getSubRelated: function(inPropPath) {
		inPropPath = inPropPath ? inPropPath + "." : "";
		if (inPropPath) {
			var list = [], l = inPropPath.length;
			dojo.forEach(this.related, function(r) {
				if (r.indexOf(inPropPath) == 0)
					list.push(r.substring(l));
			});
			return list;
		} 
		else
			return this.related;
	},
	// get a view starting at inPropPath
	getSubView: function(inPropPath) {

	    // update the view if we're designing and the view is managed by a variable
	    if (this._isDesignLoaded && this.owner instanceof wm.Variable)
		this.createDefaultView();

		inPropPath = inPropPath ? inPropPath + "." : "";
		var view = this._copyView(this.view);
		if (inPropPath) {
			var list = [], l = inPropPath.length;
			dojo.forEach(view, function(v) {
				if (v.dataIndex.indexOf(inPropPath) == 0) {
					v.dataIndex = v.dataIndex.substring(l);
					list.push(v);
				}
			});
			return list;
		} else
			return view;
	},
	
	//check if any picklist(for salesforce for now) exists
	pickListExists: function() { //xxx
		var exists = false;
		if (SALESFORCE_SERVICE == this.service) {
			for (var i=0; i<this.view.length; i++) {
				var e = this.view[i];
				if ("picklist" == e.subType) {
					exists = true;
					break;
				}
			}
		}

		return exists;
	}
});

wm.Object.extendSchema(wm.LiveView, {
	related: { ignore: 1, writeonly: 1 },
	view: { ignore: 1, writeonly: 1 },
	service: { ignore: 1, writeonly: 1 },
	dataType: {ignore: 1, writeonly: 1}
});
