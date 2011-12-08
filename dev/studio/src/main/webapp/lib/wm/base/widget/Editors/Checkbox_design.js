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


dojo.provide("wm.base.widget.Editors.Checkbox_design");
dojo.require("wm.base.widget.Editors.Checkbox");
dojo.require("wm.base.widget.Editors.AbstractEditor_design");


wm.Object.extendSchema(wm.Checkbox, {
    dataValue: {bindable: 1, group: "editData", order: 3, simpleBindProp: true, type: "Boolean"},
        readOnlyCheckbox: {ignore: 1},
        startChecked: { group: "editor", type: "Boolean"},
    dataType:  { group: "editData", doc: 1, options: ["string", "boolean", "number"]},
	displayValue: {writeonly: 1, type: "any" },
    checkedValue: {group: "editor", bindTarget: 1,order: 40, type: "any", doc: 1},    
    required: {ignore: 1},
    getChecked: {method:1, doc: 1, returns: "Boolean"},
    setChecked: {method:1, doc: 1}
});

wm.Object.extendSchema(wm.RadioButton, {
    checkedValue: {group: "editor", bindTarget: 1,order: 40, type: "any", doc: 1},
    radioGroup: { type: "string", group: "editor", order: 50,doc: 1},
    groupValue: { ignore: 1, bindSource: 1, group: "editData", type: "any",simpleBindProp: true},
    dataValue: {ignore: 1, bindable: 1, group: "editData", order: 3, simpleBindProp: false, type: "String"}, // use getDataValue()
});

