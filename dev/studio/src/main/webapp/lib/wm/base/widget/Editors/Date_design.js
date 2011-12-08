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


dojo.provide("wm.base.widget.Editors.Date_design");
dojo.require("wm.base.widget.Editors.Date");
dojo.require("wm.base.widget.Editors.Text_design"); /* Needs the parent schema */


wm.Object.extendSchema(wm.Date, {
    dataValue: { writeonly: true},
    defaultInsert: { writeonly: true},
    editorType: {group: "common", order: 501, options: ["Date", "Time", "DateTime"]},
    changeOnKey: { ignore: 1 },
    minimum: {group: "editor", order: 2,  doc: 1, bindTarget: true},
    maximum: {group: "editor", order: 3, doc: 1, bindTarget: true}, 
    format:  {group: "editor", doc: 0, ignore: 1},
    invalidMessage: {group: "validation", order: 3},
    showMessages: {group: "validation", order: 4},
    promptMessage: {group: "Labeling", order: 6},
    password: {ignore:1},
    regExp: {ignore:1},
    maxChars: {ignore:1},
    resetButton: {ignore: 1}
});

wm.Object.extendSchema(wm.Time, {
    editorType: {group: "common", order: 501, options: ["Date", "Time", "DateTime"]},
    format: { ignore: 1 },
    minimum: {group: "editor", order: 2, ignore: 1},
    maximum: {group: "editor", order: 3, ignore: 1},
    timePattern:{group: "editor", order: 4,  doc: 1,options:["HH:mm", "HH:mm:ss", "HH:mm a", "HH:mm:ss a"]},
    invalidMessage: {group: "validation", order: 3},
    showMessages: {group: "validation", order: 4},
    promptMessage: {group: "Labeling", order: 6},
    password: {ignore:1},
    regExp: {ignore:1},
    maxChars: {ignore:1},
    changeOnKey: {ignore: 1}
});



wm.Object.extendSchema(wm.DateTime, {
    dataValue: { writeonly: true},
    defaultInsert: { writeonly: true},
    editorType: {group: "common", order: 501, options: ["Date", "Time", "DateTime"]},
    changeOnKey: { ignore: 1 },
    invalidMessage: {group: "validation", order: 3},
    showMessages: {group: "validation", order: 4},
    promptMessage: {group: "Labeling", order: 6},
    password: {ignore:1},
    regExp: {ignore:1},
    maxChars: {ignore:1},
    changeOnKey: {ignore: 1},
    dateMode: {group: "editor", order: 2,options:["Date and Time", "Date", "Time"]},
    formatLength: {group: "editor", order: 3,options:["short", "medium", "long"]},
    resetButton: {ignore: 1},
    timePanelHeight: {group: "style", editor: "wm.prop.SizeEditor", editorProps: {pxOnly: 1}},
    useLocalTime: {group: "editor", order: 4},
     selectOnClick: {ignore: 1}
});

wm.DateTime.extend({

    setFormatLength: function(inValue) {
	// must get value before changing formatLength because formatLength determines how to parse the value
	var value = this.getDataValue();
	this.formatLength = inValue; 
	this.setDataValue(value);
    }
});