/*
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.List_design");
dojo.require("wm.base.widget.List");
dojo.require("wm.base.Control_design");


wm.Object.extendSchema(wm.VirtualList, {
	// FIXME: disabling this as we're not using it at all, and grid supports it.
	multiSelect: { ignore: 1 },
	box: { ignore: 1 },
    toggleSelect: { group: "common", order: 100},
    getCount: {method:1, returns: "Number"},
    getItem: {method:1, returns: "wm.ListItem"},
    getItemByCallback: {method:1, returns: "wm.ListItem"},
    getItemByFieldName: {method:1, returns: "wm.ListItem"},
    removeItem: {method:1},
    setHeaderVisible: {method:1},
    clear: {method:1},
    getSelectedIndex: {method:1, returns: "Number"},
    selectByIndex: {method:1},
    select: {method:1},
    eventSelect: {method:1},
    eventDeselect: {method:1},
    deselectAll: {method:1}
});


// design-time only
wm.Object.extendSchema(wm.List, {
    updateNow: {group: "operation", operation:1},    
	disabled: { ignore: 1 },
	selectedItem: { ignore: 1, bindSource: 1, isObject: true, simpleBindProp: true },
    dataSet: { group: "data", readonly: 1, order: 1, bindTarget: 1, type: "wm.Variable", isList: true,  createWire: 1, editor: "wm.prop.DataSetSelect", editorProps: {listMatch: true, widgetDataSets: true, allowAllTypes: true}},
    emptySelection: { ignore: true, bindSource: 1, type: "Boolean" },
    getEmptySelection: {method:1, returns: "Boolean"},
    setColumnWidths: {method:1},
    //getDataItemCount: {method:1, returns: "Number"},
    setDataSet: {method:1},
    getItemData: {method:1, returns: "Object"}   

});

wm.List.description = "Displays list of items.";

wm.List.extend({
    updateNow: function() {this.update();}
});



wm.Object.extendSchema(wm.FocusableList, {
	focusEventTime: { ignore: 1 },
	nextFocus: {bindable: 1, type: "wm.FocusableList"},
	priorFocus: {bindable: 1, type: "wm.FocusableList"},
	hasFocus: {ignore:1},
	focusOnStart: {type: "boolean"},
	defaultFocusListIndex: {}
	
});

wm.Object.extendSchema(wm.FocusablePanel, {
	focusEventTime: { ignore: 1 }
});



