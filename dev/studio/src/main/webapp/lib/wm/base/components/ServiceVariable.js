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

dojo.provide("wm.base.components.ServiceVariable");
dojo.require("wm.base.components.Variable");
dojo.require("wm.base.components.ServiceCall");


//===========================================================================
// Main service calling class: calls services with input data and returns data
//===========================================================================
/**
	Main service calling class: calls services with input data and returns data
	@name wm.ServiceVariable
	@class
	@extends wm.Variable
	@extends wm.ServiceCall
*/
dojo.declare("wm.ServiceVariable", [wm.Variable, wm.ServiceCall], {
        downloadFile: false,
	total: 0,
	_page: 0,
	/** Maximum number of results to return */
	maxResults: 0,
	designMaxResults: 50,
	processResult: function(inResult) {
		this.setData(inResult);
		this.inherited(arguments);
	},
    setType: function() {
	if (this.input) 
	    var oldInputType = this.input.type + "|" + dojo.toJson(this.input._dataSchema);

	this.inherited(arguments);
	if (this._isDesignLoaded && this.input) {
	    this.setService(this.service);	    
	    if (this == studio.selected)
		studio.inspector.inspect(this);
	}
	
    },
	getTotal: function() {
		return this.total || this.getCount();
	},
	getPageCount: function() {
		return Math.ceil(this.getTotal() / (this.getCount() || 1));
	},
	setPage: function(inPage) {
		this._page = Math.max(0, Math.min(this.getPageCount() - 1, inPage));
		this.firstRow = this._page * this.maxResults;
		this.update();
	},
	getPage: function() {
		return this._page;
	},
	setFirstPage: function() {
		this.setPage(0);
	},
	setPreviousPage: function() {
		this.setPage(this._page-1);
	},
	setNextPage: function() {
		this.setPage(this._page+1);
	},
	setLastPage: function() {
		this.setPage(this.getPageCount());
	},
	operationChanged: function(forceUpdate) {
		this.inherited(arguments);
		// output has named type matching operation returnType
		var op = this._operationInfo;
		if (op || forceUpdate) {
		  this.setType(op.returnType);
		  this.clearData();
	  }
		if ((this.autoUpdate || this.startUpdate) && !this._loading && this.isDesignLoaded()) {
		  this.update();
		}
	},
    toString: function(inText) {   
	var t = inText || "";
	t += "; " + wm.getDictionaryItem("wm.ServiceVariable.toString_FIRING", {isFiring: Boolean(this._requester)})
	return this.inherited(arguments, [t]);
    }
});

wm.Object.extendSchema(wm.ServiceVariable, {
        downloadFile: {},
        isList: {ignore: 1},
	operation: { group: "common", order: 24},
	clearInput: { group: "operation", order: 30},
	onSetData: {ignore: 1},
        onCanUpdate: {events: ["js", "sharedjs", "sharedEventHandlers"]},
    input: { ignore: 1 , doc: 1, type: "wm.Variable", writeonly: 1, componentonly: 1, categoryParent: "Properties", categoryProps: {component: "input", bindToComponent: true, inspector: "Data"}},
	service: {group: "common", order: 23 },
	autoUpdate: {group: "common", order: 25},
	startUpdate: {group: "common", order: 26},
    firstRow: {group: "data",order: 15},
        maxResults: {group: "data", order: 17},
        designMaxResults: {group: "data", order: 18},
	updateNow: { group: "operation", order: 10},
	queue: { group: "deprecated", order: 20},
	json: {ignore: 1},
	listType: {ignore: 1},
	isList: {ignore: 1},
        saveInCookie: {ignore: 1},
	// binding inherited from Variable, keep it and write it but don't show it
	// potentially needed for source bindings.
	binding: {ignore: 1, writeonly: 1},
	type: { ignore: 1 },
	dataSet: { ignore: 1, defaultBindTarget: 1, isObject: true, type: "any"},
	startUpdateComplete: { ignore: 1},
    total: {ignore: 1},
    getTotal: {group: "method", returns: "Number"},
    getPageCount: {group: "method", returns: "Number"},
    setNextPage: {group: "method"},
    setPreviousPage: {group: "method"},
    setLastPage: {group: "method"},
    update: {group: "method"}

});


wm.ServiceVariable.description = "Data from a service.";

/**#@+ @design */
wm.ServiceVariable.extend({
	/** @lends wm.ServiceVariable.prototype */
	listProperties: function() {
	    var p = this.inherited(arguments);
	    var operationType = this.getOperationType();

	    p.firstRow.ignoretmp = !Boolean(operationType == "hqlquery");
	    p.maxResults.ignoretmp = !Boolean(operationType == "hqlquery");
	    p.designMaxResults.ignoretmp = !Boolean(operationType == "hqlquery");

	    return p;
	}
	    
});
/**#@- @design */
