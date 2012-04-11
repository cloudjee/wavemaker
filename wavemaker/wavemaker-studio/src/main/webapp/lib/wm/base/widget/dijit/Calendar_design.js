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

dojo.provide("wm.base.widget.dijit.Calendar_design");
dojo.require("wm.base.widget.dijit.Calendar");
dojo.require("wm.base.widget.dijit.Dijit_design");

wm.Object.extendSchema(wm.dijit.Calendar, {

    /* widgetName group */
    specialDates: { group: "widgetName", subgroup: "data", order: 0, type: "wm.Variable", isList: true, bindTarget: true, editor: "wm.prop.DataSetSelect", editorProps: {listMatch:1,allowAllTypes:1,widgetDataSets:0}, advanced:1},
    useDialog: {group: "widgetName", subgroup: "selection", order: 1, type: "boolean",advanced:1},

    /* Editor group; value subgroup */
    dateValue: {bindable: 1, group: "editor", subgroup: "value", order: 11, simpleBindProp: true, type: "Date", editor: "wm.Date"},
    useLocalTime: {group: "editor", subgroup: "value", type: "boolean"},


    /* Editor group; validation subgroup */
    minimum: {group: "editor", subgroup: "validation", order: 2, doc: 1, bindTarget: true, editor: "wm.Date"},
    maximum: {group: "editor", subgroup: "validation", order: 3, doc: 1, bindTarget: true, editor: "wm.Date"}, 

    /* Ignored group */
    disabled: {ignore: 1},
    displayDate: {ignore: 1},

    /* Method group */
    setDate: {method:1},
    getDateValue: {method:1},
    setDisplayDate: {method:1},
    setSpecialDates: {method:1}
});

wm.dijit.Calendar.extend({
    scrim: true,
    set_dateValue: function(inValue) {
	this.dateValue = inValue;
	this.setDateValue(inValue);
    }
});