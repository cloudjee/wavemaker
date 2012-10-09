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
    /* Editor group; values subgroup*/
    dataValue: {editor: "wm.Date", type: "Number"},
    defaultInsert: { editor: "wm.Date", type: "Number"},
    editorType: {options: ["Date", "Time", "DateTime"]},

    /* Behavior subgroup */
    openOnClick: {group: "widgetName", subgroup: "behavior", order: 50},

    /* Editor group; validation subgroup */
    minimum: {group: "editor", subgroup: "validation", order: 2, doc: 1, bindTarget: true, editor: "wm.Date"},
    maximum: {group: "editor", subgroup: "validation", order: 3, doc: 1, bindTarget: true, editor: "wm.Date"},

    useLocalTime: {group: "editor", subgroup: "value", order: 21, advanced: 1},
    formatLength: {ignore:1},

    /* Ignored Group */
    password: {ignore:1},
    regExp: {ignore:1},
    maxChars: {ignore:1},
    changeOnKey: { ignore: 1 },
    resetButton: {ignore: 1},
     selectOnClick: {ignore: 1},
     dateMode: {ignore:1}
});

wm.Object.extendSchema(wm.Time, {
    dataValue: {editor: "wm.Time", type: "Number"},

    /* Editor group; display subgroup */
    timePattern:{group: "editor", subgroup: "display", order: 4,  doc: 1,options:["HH:mm", "HH:mm:ss", "HH:mm a", "HH:mm:ss a"]},
    useLocalTime: {group: "editor", subgroup: "value", order: 21, advanced: 1},

    /* Ignored group */
    use24Time: {hidden:1},
    useWMDropDown: {hidden:1},
    minimum: { ignore: 1},
    maximum: { ignore: 1}
});



wm.Object.extendSchema(wm.DateTime, {
    dataValue: {type: "Number"}, // editor specified in makePropEdit
    defaultInsert: {type: "Number"},

    /* Editor group; behavior subgroup */
    editorType: {options: ["Date", "Time", "DateTime"]},

    /* Editor group; display subgroup */
    use24Time: {group: "editor", subgroup: "display", order: 10, ignoreHint: "Only available if dateMode is not 'Date'", advanced: 1},
    formatLength: {ignore:1},

    /* Editor group; value subgroup */
    dateMode: {group: "editor", subgroup: "value", order: 20,options:["Date and Time", "Date", "Time"]},
    useLocalTime: {group: "editor", subgroup: "value", order: 21, advanced: 1},

    selectOnClick: {ignore: 1},
    placeHolder: {ignore: 1}
});

wm.DateTime.extend({
    afterPaletteDrop: function() {
        this.inherited(arguments);
        this.flow();
    },
    makePropEdit: function(inName, inValue, inEditorProps) {
        switch (inName) {
        case "dataValue":
        case "defaultInsert":
        case "maximum":
        case "minimum":
            return new wm.DateTime(dojo.mixin({
                dateMode: this.dateMode
            }, inEditorProps));
        }
        return this.inherited(arguments);
    },

    set_use24Time: function(inValue) {
        this.use24Time = inValue;
        this.createEditor();
    },
    listProperties: function() {
        var p = this.inherited(arguments);
        p.use24Time.ignoretmp = this.dateMode == "Date";
        return p;
    }
});