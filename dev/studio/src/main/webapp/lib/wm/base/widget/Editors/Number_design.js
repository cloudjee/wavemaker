/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
dojo.require("wm.base.widget.Editors.AbstractEditor_design");

wm.Number.extend({
    themeableStyles: [{name: "wm.NumberSpinner-Down-Arrow_Image", displayName: "Down Arrow"}, {name: "wm.NumberSpinner-Up-Arrow_Image", displayName: "Up Arrow"}]
});

wm.Object.extendSchema(wm.Number, {
/*
    customFormatter: {ignore:1},
    customParser: {ignore:1},*/
    resetButton: {ignore: 1},
    dataValue: {type: "Number"},
    defaultInsert:{type: "Number"},
    places: {group: "editor", order: 2, doc: 1, type: "number"},
    minimum:  { group: "editor", order: 3, emptyOK: true, doc: 1, bindTarget: true, type: "number"},
    maximum: { group: "editor", order: 4, emptyOK: true, doc: 1, bindTarget: true, type: "number"},
    rangeMessage: {  group: "editor", order: 5},
    spinnerButtons: {group: "editor", order: 6, type: "boolean"},
    regExp: { ignore: 1 },
    maxChars: { ignore: 1},
    setMaximum: {method:1, doc: 1},
    setMinimum: {method:1, doc: 1}
});



wm.Object.extendSchema(wm.Currency, {
    password: {ignore:1},
    currency: {group: "editor", order: 2, doc: 1},
    places: {  group: "editor", order: 5, doc: 1},
    rangeMessage: {  group: "editor", order: 6},
    spinnerButtons: {ignore: 1}
});


wm.Object.extendSchema(wm.Slider, {
    discreteValues: {group: "editor", order: 2},
    minimum:  { group: "editor", order: 3, doc: 1, bindTarget: true},
    maximum: { group: "editor", order: 4, doc: 1, bindTarget: true},
    showButtons: {  group: "editor", order: 5},
    verticalSlider: {  group: "editor", order: 6, ignore: 1},
    editorBorder: { ignore: 1 },
    changeOnKey: { ignore: 1 },
    changeOnEnter: { ignore: 1 }
});


