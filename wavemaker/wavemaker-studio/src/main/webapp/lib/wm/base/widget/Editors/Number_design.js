/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
    /* Editor group; value subgroup */
    dataValue: {type: "Number"},
    defaultInsert:{type: "Number"},

    /* Editor group; display subgroup */
    places: {group: "editor", subgroup: "display", order: 2, type: "number"},

    /* Editor group; validation subgroup */
    minimum:  { group: "editor", subgroup: "validation", order: 3, bindTarget: true, type: "Number", editor: "wm.Number", editorProps: {emptyValue: "unset"}},
    maximum: { group: "editor",  subgroup: "validation", order: 4, bindTarget: true, type: "Number", editor: "wm.Number", editorProps: {emptyValue: "unset"}},


    /* Editor group; dojo tooltips subgroup */
    rangeMessage: {  group: "editor", subgroup: "dojo tooltips", order: 5, advanced:1},

    /* Editor group; behavior subgroup */
    spinnerButtons: {group: "editor", subgroup: "behavior", order: 6, type: "boolean"},

    /* Ignored group */
    resetButton: {ignore: 1},
    regExp: { ignore: 1 },
    maxChars: { ignore: 1},

    /* Methods group */
    setMaximum: {method:1},
    setMinimum: {method:1}
});



wm.Object.extendSchema(wm.Currency, {
    /* Editor group; display subgroup */
    currency: {group: "editor", subgroup: "display", order: 2},

    /* Ignored group */
    password: {ignore:1},
    spinnerButtons: {ignore: 1}
});


wm.Object.extendSchema(wm.Slider, {
    /* Editor group; value subgroup */
    discreteValues: {group: "editor", subgroup: "value", order: 2},
    minimum:  { group: "editor", subgroup: "value", order: 3, bindTarget: true},
    maximum: { group: "editor", subgroup: "value", order: 4, bindTarget: true},
    integerValues: {group: "editor", subgroup:"value", order: 10},

    dynamicSlider: {group: "editor", subgroup: "behavior"},

    /* Display group; visual subgroup */
    showButtons: {  group: "display", subgroup: "visual", order: 5},
    verticalSlider: {  group: "display", subgroup: "visual", order: 6, ignore: 1},

    /* Ignored group */
    editorBorder: { ignore: 1 },
    changeOnKey: { ignore: 1 },
    changeOnEnter: { ignore: 1 }
});


