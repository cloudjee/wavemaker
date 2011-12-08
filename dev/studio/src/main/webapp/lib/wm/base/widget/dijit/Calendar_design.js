/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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
	disabled: {ignore: 1},
    specialDates: { group: "data", order: 0, type: "wm.Variable", isList: true, bindTarget: true, editor: "wm.prop.DataSetSelect", editorProps: {listMatch:1,allowAllTypes:1,widgetDataSets:0}},
    displayDate: {ignore: 1},
    useLocalTime: {group: "data", type: "boolean"},
    useDialog: {group: "data", order: 1, type: "boolean"},
    dateValue: { ignore: 1, bindable: 1, type: "Date", simpleBindProp: true },
    setDate: {method:1},
    getDateValue: {method:1},
    setDisplayDate: {method:1},
    setSpecialDates: {method:1}
});

wm.dijit.Calendar.extend({
    scrim: true
});