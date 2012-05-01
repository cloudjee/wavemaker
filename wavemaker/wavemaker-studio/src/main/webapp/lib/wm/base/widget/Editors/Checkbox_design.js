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


dojo.provide("wm.base.widget.Editors.Checkbox_design");
dojo.require("wm.base.widget.Editors.Checkbox");
dojo.require("wm.base.widget.Editors.Radiobutton");
dojo.require("wm.base.widget.Editors.AbstractEditor_design");


wm.Checkbox.extend({
    _regenerateOnDeviceChange: true,
    listProperties: function() {
	var p = this.inherited(arguments);
	var type;
		switch(this.dataType) {
		case "boolean":
		    type = "boolean";
		    break;
		case "number":
		    type = "number";
		    break;
		default:
		    type = "string";
		}

	p.dataValue.type = p.defaultInsert.type = p.checkedValue.type = type;
	return p;
    },
    set_dataType: function(inType) {
	this.setDataType(inType);
	studio.reinspect(true);
    },
    set_startChecked: function(inChecked) {
	this.dataValue = Boolean(inChecked);
	this.setStartChecked(inChecked);
    }

});

wm.Object.extendSchema(wm.Checkbox, {
    editorType: {options: ["wm.Checkbox", "wm.RadioButton"]},
    dataValue:    {readonly: 1, type: "boolean"}, // for binding only; such as to a form's dataSet or a service variable's data
    startChecked: { group: "editor", subgroup: "value", order: 50, type: "Boolean"},
    dataType:     { group: "editor", subgroup: "value", order: 55, options: ["string", "boolean", "number"]},
    displayValue: {writeonly: 1},
    checkedValue: {group: "editor", subgroup: "value",  bindTarget: 1,order: 40, type: "any", doc: 1},    
    checked: {ignore: 1, bindSource: 1},
    required: {ignore: 1},
    getChecked: {method:1, returns: "Boolean"},
    setChecked: {method:1}
});

wm.Object.extendSchema(wm.RadioButton, {
    radioGroup: { type: "string", group: "editor", subgroup: "value", order: 50},
    groupValue: { ignore: 1, bindSource: 1, type: "any",simpleBindProp: true},
    dataValue: {ignore: 1, bindable: 1, type: "any"} // use getDataValue()
});

