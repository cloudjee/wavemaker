/*
 *  Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.components.ServiceCall_design");
dojo.require("wm.base.components.ServiceCall");
dojo.require("wm.base.components.ServiceVariable");
dojo.require("wm.base.components.Variable_design");


/**#@+ @design */
wm.ServiceCall.extend({
	clearInput: "(clear input)",
	updateNow: "(update now)",
	queue: "(serviceCalls)",
	getUniqueName: function(inName) {
	    if (inName === "input") return "input";
	    return this.inherited(arguments);
	},
	/** @lends wm.ServiceCall.prototype */
	doDesigntimeUpdate: function() {
		this._designTime = true; //The line is not being used now.  It may be used in the future to differenciate requests from 
		//Studio from requests deployed application.
		return studio.makeLiveDataCall(dojo.hitch(this, "_update"));
	},
	doClearInput: function() {
		this.input.destroy();
		this.input = this.createInput();
	},
	set_operation: function(inOperation) {
		this.setOperation(inOperation);
		if (this.isDesignLoaded() && studio.selected == this)
			studio.inspector.inspect(studio.selected);
	},
	getServicesList: function() {
		return [""].concat(wm.services.getNamesList()||[]);
	},
	showQueueDialog: function() {
		var d = wm.ServiceQueue.dialog, q = this.$.queue;
		if (d) {
			d.page.binding = q;
			d.page.update();
		}else{
		    /* TODO: Convert to new dialogs */
			wm.ServiceQueue.dialog = d = new wm.PageDialog({
				name: "queueDialog",
				owner: studio,
				contentWidth: 600,
				contentHeight: 400,
				hideControls: true,
				pageName: "QueueDialog",
				pageProperties: {binding: q}
			});
		}
		d.show();
	}
});


wm.Object.extendSchema(wm.ServiceCall, {
    startUpdateComplete: { ignore: 1},
    setService: {method:1},
    setOperation: {method:1},
    update: {method:1},
    canUpdate: {method:1}
});
wm.Object.extendSchema(wm.ServiceInput, {
	dataSet: { ignore: 1, isObject: true, type: "any"}
});
wm.ServiceInput.extend({
    writeProps: function() {
	return {type: this.type};
    }
});



wm.Object.extendSchema(wm.ServiceVariable, {

    /* Events group */
    onPrepareSetData: {}, // {} is here as a reminder that we get this event and has no functional meaning
    onSetData: {},
    onCanUpdate: {events: ["js", "sharedjs", "sharedEventHandlers"], advanced:1},
    onBeforeUpdate: {advanced:1},

    /* Data group; type subgroup */
    service:          {group: "data", subgroup: "service", order: 23, requiredGroup: 1 },
    operation:        {group: "data", subgroup: "service", order: 24, requiredGroup: 1, bindTarget: 1 },

    /* Data group; behavior subgroup */
    autoUpdate:       {group: "data", subgroup: "behavior", order: 25, requiredGroup: 1},
    startUpdate:      {group: "data", subgroup: "behavior", order: 26, requiredGroup: 1},
    inFlightBehavior: {group: "data", subgroup: "behavior", order: 27, options: ["executeLast", "executeAll", "dontExecute"]},

    /* Data group; serverOptions subgroup */
    firstRow:         {group: "data", subgroup: "serverOptions", order: 15},
    maxResults:       {group: "data", subgroup: "serverOptions", order: 17},
    designMaxResults: {group: "data", subgroup: "serverOptions", order: 18},
    downloadFile:     {group: "data", subgroup: "serverOptions", order: 20, advanced: 1},

    /* Data group; its own subgroup */
    input:            {group: "data", order: 3, putWiresInSubcomponent: "input", bindTarget: 1, editor: "wm.prop.FieldGroupEditor"},

    /* Operations group */
    updateNow:        {group: "operation", operation: "update",      order: 10},
    clearInput:       {group: "operation", operation: "doClearInput",order: 30},

    /* Special deprecated group.... */
    queue: { group: "deprecated", order: 20,operation: "showQueueDialog"},

    /* Not in properties panel, but selecting this component in the bind dialog should bind to the dataSet */
    dataSet: { ignore: 1, bindable: 0, bindSource: 1, defaultBindTarget: 1, type: "any"},

    /* Ignored group */
    json: {ignore: 1},
    editJson: {ignore: 1},
    listType: {ignore: 1},
    isList: {ignore: 1},
    saveInCookie: {ignore: 1},
    type: { ignore: 1 },
    startUpdateComplete: { ignore: 1},
    isList: {ignore: 1},
    total: {ignore: 1},

    /* Method group */
    getTotal: {method:1, returns: "Number"},
    getPageCount: {method:1, returns: "Number"},
    setNextPage: {method:1},
    setPreviousPage: {method:1},
    setLastPage: {method:1},
    update: {method:1}

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
