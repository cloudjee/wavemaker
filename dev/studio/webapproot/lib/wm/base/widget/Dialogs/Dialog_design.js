/*
 *  Copyright (C) 2011 WaveMaker Software, Inc.
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

dojo.provide("wm.base.widget.Dialogs.Dialog_design");

dojo.require("wm.base.widget.Dialogs.Dialog");
dojo.require("wm.base.widget.Dialogs.DesignableDialog");
dojo.require("wm.base.widget.Dialogs.WidgetsJsDialog"); 
dojo.require("wm.base.widget.Dialogs.GenericDialog"); 
dojo.require("wm.base.widget.Dialogs.PageDialog");
dojo.require("wm.base.widget.Dialogs.Toast");
dojo.require("wm.base.widget.Dialogs.ColorPickerDialog");

wm.Dialog.extend({
    themeableStyles: ["wm.Dialog_Inner-Radius"],
    // backward-compatibility fixups
	afterPaletteDrop: function() {
	    this.inherited(arguments);
	    this.setParent(null);
	    studio.designer.domNode.appendChild(this.domNode);
	    this.show();
	},
    makePropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
        case "corner":
            inValue = inValue.replace(/^c/, "center ").replace(/^t/, "top ").replace(/^b/, "bottom ").replace(/l$/, "left").replace(/r$/, "right").replace(/c$/, "center");
            return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: ["top left", "top center", "top right", "center left", "center center", "center right", "bottom left", "bottom center", "bottom right"]});
	}
	return this.inherited(arguments);
    }

});


wm.Object.extendSchema(wm.Dialog, {
    title: {group: "display", order: 1, bindTarget: true},

    /* TODO: Localize */
    owner: { group: "common", order: 1, readonly: true, options: ["Page", "Application"] },

    titlebarBorder: {group: "style", order: 5},
    titlebarBorderColor: {group: "style", order: 6},
    titlebarHeight: {group: "style", order: 7},
    footerBorder: {group: "style", order: 8},
    footerBorderColor: {group: "style", order: 9},

    modal: {group: "display", order: 50},
    noEscape: {group: "display", order: 51},
    noMinify: {group: "display", order: 51},
    noMaxify: {group: "display", order: 51},
    corner: {group: "layout", order: 52},

    noBevel: {ignore: 1},
    imageList: {ignore: 1},
    fitToContentWidth: {ignore: 1},
    fitToContentHeight: {ignore: 1},
    useContainerWidget: {ignore: 1},
    containerClass: {ignore: 1},
    useButtonBar: {ignore: 1}, // user doesn't decide this; buttonbar is autosizing; if nothing in there, then it doesn't show.
    lock: {ignore: 1},
    freeze: {ignore: 1},
    padding: {ignore: 1},
    margin: {ignore: 1},
    autoScroll: {ignore: 1},
    scrollX: {ignore: 1},
    scrollY: {ignore: 1},
    touchScrolling: {ignore: 1},
    layoutKind: {ignore: 1},
    horizontalAlign: {ignore: 1},
    verticalAlign: {ignore: 1},
    showing: {ignore: 1},
    setModal: {group: "method"},
    minify: {group: "method"}
});









wm.Object.extendSchema(wm.GenericDialog, {
    
    enterKeyIsButton1: {group: "Buttons", order: 60},
    widgets_json: {ignore: 1},
    button1Caption: {group: "Buttons", order: 61},
    button1Close: {group: "Buttons", order: 62},
    button2Caption: {group: "Buttons", order: 63},
    button2Close: {group: "Buttons", order: 64},
    button3Caption: {group: "Buttons", order: 65},
    button3Close: {group: "Buttons", order: 66},
    button4Caption: {group: "Buttons", order: 67},
    button4Close: {group: "Buttons", order: 68},

    userPrompt: {group: "display", order: 54, bindTarget: true},
    showInput: {group: "display", order: 55, bindTarget: true},
    inputDataValue: {group: "editData", order: 56, bindable: true, simpleBindProp: true},
    regExp: {group: "editData", order: 57},

    footerBorder: {group: "style", order: 100},
    footerBorderColor:  {group: "style", order: 101},
    setShowInput: {group:"method"},
    setInputDataValue: {group:"method"},
    getInputDataValue: {group:"method", returns: "String"},
    setUserPrompt: {group:"method"},
    setButton1Caption: {group:"method"},
    setButton2Caption: {group:"method"},
    setButton3Caption: {group:"method"},
    setButton4Caption: {group:"method"}
});

wm.GenericDialog.extend({

});





wm.Object.extendSchema(wm.Toast, {
    modal: {ignore: 1},
    backgroundColor: {}
});
// Any project can overwrite this array in their page.start method.
wm.Toast.classList = ["wm_FontSizePx_16px","wm_TextDecoration_Bold"];

wm.PageDialog.extend({
    themeable: false
});

wm.Object.extendSchema(wm.PageDialog, {
    pageName: {group: "display", bindable: 1, type: "string", order: 54, pageProperty: "page"},
    deferLoad:{group: "display", type: "boolean", order: 55},
    footerBorder: {group: "style", order: 100},
    footerBorderColor:  {group: "style", order: 101}
});
// design-time
wm.Dialog.description = "Popup dialog.";




wm.ColorPickerDialog.cssLoaded = false;



wm.Object.extendSchema(wm.DesignableDialog, {
/*    owner: {ignore: true} */ // See JIRA-2118: Can't drag and drop to an app level container
    createButtonBar: {group: "operation", order: 20}
});
