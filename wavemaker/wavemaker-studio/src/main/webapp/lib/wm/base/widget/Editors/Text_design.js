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


dojo.provide("wm.base.widget.Editors.Text_design");
dojo.require("wm.base.widget.Editors.Text");
dojo.require("wm.base.widget.Editors.AbstractEditor_design");/* need parent class schema */



wm.Object.extendSchema(wm.ResizableEditor, {
    autoSizeHeight: {ignore: 0, writeonly: true},
    autoSizeWidth: {ignore: 0, writeonly: true},
    autoSize: {ignore: 0},
    maxHeight:{type: "Number", group: "display", subgroup: "layout", order: 60, advanced: 1}
});


    
wm.Object.extendSchema(wm.Text, {
    /* DISPLAY GROUP */
    //placeHolder: {group: "display", subgroup: "help"}, 
    placeHolder: {group: "editor text", subgroup: "help"}, 

    /* EDITOR GROUP */
    /* Behavior subgroup */
    maxChars: {group: "editor", subgroup: "behavior", order: 6},
    resetButton: {group: "editor", subgroup: "behavior", advanced:1},
    selectOnClick: {group: "editor", subgroup: "behavior", order: 10, advanced:1},

    /* Validation subgroup */
    regExp: {group: "editor", subgroup: "validation", order: 10, advanced: 1},

    /* Dojo Tooltips subgroup */
    showMessages: {group: "editor text", subgroup: "dojo tooltips", order: 1, advanced: 1},
    promptMessage: {group: "editor text", subgroup: "dojo tooltips", order: 10, advanced: 1},
    invalidMessage: {group: "editor text", subgroup: "dojo tooltips", order: 20, advanced: 1},
    tooltipDisplayTime: {group: "editor text", subgroup: "dojo tooltips", order: 30, advanced: 1},
    
    /* Value display sugroup */
    password: {group: "editor", subgroup: "display", order: 5, doc: 1},

    /* EVENTS GROUP */
    changeOnKey: {ignore: 0},
    onEnterKeyPress: {ignore: 0},

    /* METHODS */
    setPlaceHolder: {method:1},
    setPassword: {method:1},
    setRegExp: {method:1},
    selectText: {method:1}

    
});


wm.Object.extendSchema(wm.LargeTextArea, {
    changeOnEnter:     {ignore: 1},
    onEnterKeyPress:   {ignore: 1},
    password:          {ignore: 1},
    resetButton:       {ignore: 1},
    regExp:            {ignore: 1},
    invalidMessage:    {ignore: 1},
    showMessages:      {ignore: 1},
    promptMessage:     {ignore: 1},
    tooltipDisplayTime:{ignore: 1},
    placeHolder:       {ignore: 1}
});

wm.LargeTextArea.extend({
    themeableDemoProps: {height: "100%"}
});

wm.Object.extendSchema(wm.ColorPicker, {
    defaultColor: {group: "editor", subgroup: "value"},
    regExp:      {ignore: 1},
    resetButton: {ignore: 1},
    password:    {ignore: 1}
});