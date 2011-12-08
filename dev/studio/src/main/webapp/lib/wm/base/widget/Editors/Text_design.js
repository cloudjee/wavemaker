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


dojo.provide("wm.base.widget.Editors.Text_design");
dojo.require("wm.base.widget.Editors.Text");
dojo.require("wm.base.widget.Editors.AbstractEditor_design");/* need parent class schema */



wm.Object.extendSchema(wm.ResizableEditor, {
    autoSizeHeight: {type: "Boolean", group: "advanced layout", order: 31, writeonly: true},
    autoSizeWidth: {type: "Boolean", group: "advanced layout", order: 32, writeonly: true},
    autoSize: {type: "String", options: ["none", "width", "height"], group: "advanced layout"},
    maxHeight:     {type: "Number", group: "advanced layout", order: 60}
});


wm.Object.extendSchema(wm.Text, {
    placeHolder: {group: "Labeling", doc: 1}, // TODO: ignoring this only for 6.2 as it needs polish, particularly if its to work with themes
    promptMessage: {group: "Labeling", order: 6},
    tooltipDisplayTime: {group: "Labeling", order: 7},
    password: {group: "editor", order: 5, doc: 1},
    maxChars: {group: "editor", order: 6, doc: 1},
    changeOnKey: {group: "events", order: 3},
    regExp: {group: "validation", order: 2, doc: 1},
    invalidMessage: {group: "validation", order: 3},
    showMessages: {group: "validation", order: 4},
    onEnterKeyPress: {ignore: 0},
    setPlaceHolder: {method:1, doc: 1},
    setPassword: {method:1, doc: 1},
    setRegExp: {method:1, doc: 1},
    resetButton: {group: "editor"}
    
});


wm.Object.extendSchema(wm.LargeTextArea, {
	changeOnEnter: { ignore: 1 },
        onEnterKeyPress: {ignore: 1},
        password: {ignore: 1},
    resetButton: {ignore: 1},
    regExp: {ignore: 1},
    invalidMessage: {ignore: 1},
    showMessages: {ignore: 1},
    promptMessage: {ignore: 1},
    tooltipDisplayTime: {ignore: 1},
    placeHolder: {ignore: 1}

});

wm.LargeTextArea.extend({
    themeableDemoProps: {height: "100%"}
});

wm.Object.extendSchema(wm.ColorPicker, {
    regExp: {ignore: true},
    resetButton: {ignore: 1}
});