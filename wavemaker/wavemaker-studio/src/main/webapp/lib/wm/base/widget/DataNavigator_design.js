/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.DataNavigator_design");
dojo.require("wm.base.widget.DataNavigator");

// design-time only
wm.Object.extendSchema(wm.DataNavigator, {

    /* Data group; serverOptions subgroup */
    byPage: {group: "widgetName", subgroup: "behavior", order: 250},

    liveSource: {group: "widgetName", subgroup: "data", order: 1, requiredGroup:1, readonly: 1, bindable: 1, type: "wm.LiveVariable",editor: "wm.prop.DataSetSelect", editorProps: {widgetDataSet: 1, listMatch:1}},

    /* Operations group */
    firstRecord: { group: "operation", order: 5, operation:"setFirst"},
    previousRecord: { group: "operation", order: 10, operation:"setPrevious"},
    nextRecord: { group: "operation", order: 15, operation:"setNext"},
    lastRecord: { group: "operation", order: 20, operation:"setLast"},


    /* Ignored group */
    dockBottom: {ignore:1},
    dockRight: {ignore:1},
    dockLeft: {ignore:1},
    dockTop: {ignore:1},
    resizeToFit: {ignore:1},
    box: {ignore: 1},
    lock: {ignore: 1},
    freeze: {ignore:1},
    liveForm: {ignore: 1},
    layoutKind: {ignore: 1},
    autoScroll: {ignore: true},
    scrollX: {ignore: true},
    scrollY: {ignore: true},
    touchScrolling: {ignore: true}
});

wm.DataNavigator.extend({
	_defaultClasses: {domNode: ["wm_Padding_4px"]},
	firstRecord: "(first record)",
	previousRecord: "(previous record)",
	nextRecord: "(next record)",
	lastRecord: "(last record)",
	writeChildren: function() {
		// we don't want to stream our child widgets
		// since we create them at runtime.
		return [];
	},
	afterPaletteDrop: function() {
		this.inherited(arguments);
	    this.setLayoutKind("left-to-right");
	    this.setWidth("100%");
	}
});
