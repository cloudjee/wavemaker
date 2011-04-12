/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
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
	box: {ignore: 1},
	lock: {ignore: 1},
	liveForm: {ignore: 1},
	layoutKind: {ignore: 1},
	byPage: {group: "common", order: 250},
	liveSource: { readonly: 1, bindable: 1, type: "wm.LiveVariable", group: "common", order: 200},
	firstRecord: { group: "operation", order: 5},
	previousRecord: { group: "operation", order: 10},
	nextRecord: { group: "operation", order: 15},
    lastRecord: { group: "operation", order: 20},
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
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "firstRecord":
			case "previousRecord":
			case "nextRecord":
			case "lastRecord":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
			case "liveSource":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, widgetDataSets: true, listMatch: true});
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "firstRecord":
				return this.setFirst();
			case "previousRecord":
				return this.setPrevious();
			case "nextRecord":
				return this.setNext();
			case "lastRecord":
				return this.setLast();
		}
		return this.inherited(arguments);
	}
});
