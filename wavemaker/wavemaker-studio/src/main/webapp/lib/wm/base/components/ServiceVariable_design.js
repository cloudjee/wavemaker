/*
 *  Copyright (C) 2012-2013 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.components.ServiceVariable_design");
dojo.require("wm.base.components.ServiceCall_design");
dojo.require("wm.base.components.Variable_design");
dojo.require("wm.base.components.ServiceVariable");


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
    loadingDialog:    {group: "data", subgroup: "behavior", order: 100, bindTarget: 1, createWire: 1, editor: "wm.prop.WidgetSelect", editorProps: {widgetType: "wm.Control", excludeType: "wm.Dialog"}},

    /* Data group; serverOptions subgroup */
    firstRow:         {group: "data", subgroup: "serverOptions", order: 15, type: "number"},
    maxResults:       {group: "data", subgroup: "serverOptions", order: 17},
    designMaxResults: {group: "data", subgroup: "serverOptions", order: 18},
    downloadFile:     {group: "data", subgroup: "serverOptions", order: 20, advanced: 1},

    /* Data group; its own subgroup */
    input:            {group: "dataSet", order: 3, putWiresInSubcomponent: "input", bindTarget: 1, editor: "wm.prop.FieldGroupEditor", editorProps: {showMainInput: false, multiLayer: true}},

    /* Operations group */
    updateNow:        {group: "operation", operation: "updateNow",      order: 10},
    clearInput:       {group: "operation", operation: "doClearInput",order: 30},

    /* Special deprecated group.... */
    queue: { group: "deprecated", order: 20,operation: "showQueueDialog"},


    dataSet: { ignore: 1, bindable: 0, bindSource: 0, type: "any"},

    /* Ignored group */
    json: {ignore: 1},
    editJson: {ignore: 1},
    listType: {ignore: 1},
    isList: {ignore: 1},
    saveInCookie: {ignore: 1},
    type: { ignore: 1 },
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

    updateNow: function() {
        /* Running in CloudFoundry, set LiveLayoutReady to 0 if its -1 (CF-only flag that its ready but out of date) */
        if (studio.isLiveLayoutReady() == -1) studio.setLiveLayoutReady(0);
        this.update();
    },
    /** @lends wm.ServiceVariable.prototype */
    listProperties: function() {
        var p = this.inherited(arguments);
        var operationType = this.getOperationType();

        p.firstRow.ignoretmp = !Boolean(operationType == "hqlquery");
        p.maxResults.ignoretmp = !Boolean(operationType == "hqlquery");
        p.designMaxResults.ignoretmp = !Boolean(operationType == "hqlquery");

        return p;
    },
    afterPaletteDrop: function() {
        this.inherited(arguments);
        this.inFlightBehavior = "executeLast";
    }

});
/**#@- @design */