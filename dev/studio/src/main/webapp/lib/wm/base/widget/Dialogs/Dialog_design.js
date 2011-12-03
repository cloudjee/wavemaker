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


dojo.provide("wm.base.widget.Dialogs.Dialog_design");

dojo.require("wm.base.widget.Dialogs.Dialog");
dojo.require("wm.base.widget.Dialogs.DesignableDialog");
dojo.require("wm.base.widget.Dialogs.WidgetsJsDialog"); 
dojo.require("wm.base.widget.Dialogs.GenericDialog"); 
dojo.require("wm.base.widget.Dialogs.PageDialog");
dojo.require("wm.base.widget.Dialogs.Toast");
dojo.require("wm.base.widget.Dialogs.ColorPickerDialog");
dojo.require("wm.base.widget.Container_design");

wm.Dialog.extend({
    themeableStyles: ["wm.Dialog_Inner-Radius"],
    // backward-compatibility fixups
	afterPaletteDrop: function() {
	    this.inherited(arguments);
	    this.setParent(null);
	    studio.designer.domNode.appendChild(this.domNode);
	    this.show();
	},
    set_owner: function(inOwner) {
	var oldOwner = this.owner;
	this.inherited(arguments);
	var self = this;

	wm.forEachWidget(this,function(w) {
	    if (w != self && w.owner == oldOwner) {
		w.set_owner(inOwner);
	    }
	});
	studio.refreshDesignTrees();
    }
});


wm.Object.extendSchema(wm.Dialog, {
    title: {group: "display", order: 1, bindTarget: true},

    /* TODO: Localize */
    owner: { group: "common", order: 1, readonly: true, options: ["Page", "Application"] },

    titlebarBorder: {group: "style", order: 5},
    titlebarBorderColor: {group: "style", order: 6, editor: "wm.ColorPicker"},
    titlebarHeight: {group: "style", order: 7},
    footerBorder: {group: "style", order: 8},
    footerBorderColor: {group: "style", order: 9, editor: "wm.ColorPicker"},

    modal: {group: "display", order: 50},
    noEscape: {group: "display", order: 51},
    noMinify: {group: "display", order: 51},
    noMaxify: {group: "display", order: 51},
    corner: {group: "layout", order: 52,editor: "wm.prop.SelectMenu", editorProps: {
	options: ["top left", "top center", "top right", "center left", "center center", "center right", "bottom left", "bottom center", "bottom right"],
	values: ["tl", "tc", "tr", "cl", "cc", "cr", "bl", "bc", "br"]}},
    positionNear: {group: "layout", order: 53, editor: "wm.prop.WidgetSelect", editorProps: {widgetType: "wm.Control", excludeType: "wm.Dialog"}},
    fixPositionNode: {ignore: 1},

    noTopBottomDocking: {group: "docking", type: "boolean"},
    noLeftRightDocking: {group: "docking", type: "boolean"},

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
    setModal: {method:1},
    minify: {method:1},
    setPositionNear: {method:1}
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
    inputDataValue: {group: "editData", order: 56, bindTarget: true},
    regExp: {group: "editData", order: 57},

    footerBorder: {group: "style", order: 100},
    footerBorderColor:  {group: "style", order: 101},
    setShowInput: {method:1},
    setInputDataValue: {method:1},
    getInputDataValue: {method:1, returns: "String"},
    setUserPrompt: {method:1},
    setButton1Caption: {method:1},
    setButton2Caption: {method:1},
    setButton3Caption: {method:1},
    setButton4Caption: {method:1}
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
    footerBorderColor:  {group: "style", order: 101},
    hideControls: {group: "display"}
});
// design-time
wm.Dialog.description = "Popup dialog.";




wm.ColorPickerDialog.cssLoaded = false;



wm.Object.extendSchema(wm.DesignableDialog, {
/*    owner: {ignore: true} */ // See JIRA-2118: Can't drag and drop to an app level container
    createButtonBar: {group: "operation", order: 20, operation:1}
});

wm.DesignableDialog.extend({
    set_owner: function(inOwner) {
        var oldOwner = this.owner;
        this.inherited(arguments);
        var owner = this.owner;
        wm.forEachWidget(this, function(w) {
            if (w.owner == oldOwner)
                w.setOwner(owner);
        });
    },
    afterPaletteDrop: function() {
	this.inherited(arguments);
        this.createButtonBar();
    },

    writeProps: function() {
	var out = this.inherited(arguments);
	out.containerWidgetId = this.containerWidget && !this.containerWidget.isDestroyed ? this.containerWidget.getId() : "";
	out.buttonBarId = this.buttonBar && !this.buttonBar.isDestroyed ? this.buttonBar.getId() : "";
	return out;
    }
});



wm.LoadingDialog.extend({
    set_widgetToCover: function(inWidget) {
	    this.widgetToCover = inWidget;
	    this.renderBounds();
    },
    set_serviceVariableToTrack: function(inWidget) {
	    this.serviceVariableToTrack = inWidget;
    },
    set_captionWidth: function(inWidth) {
	this.captionWidth = inWidth;
	this._label.setWidth(inWidth);
	this._label.doAutoSize();
    }


});

wm.Object.extendSchema(wm.LoadingDialog, {
    positionNear: {ignore:1},
    widgetToCover: {bindTarget: 1, createWire: 1, group: "edit", editor: "wm.prop.WidgetSelect", editorProps: {widgetType: "wm.Control", excludeType: "wm.Dialog"}, order: 100},
    serviceVariableToTrack: {bindTarget: 1, createWire: 1, group: "edit", editor: "wm.prop.WidgetSelect", editorProps: {widgetType: "wm.ServiceVariable"}, order: 101},    
    caption: {bindTarget: 1, group: "edit", order: 102},
    captionWidth:{group: "edit", order: 103, editor: "wm.prop.SizeEditor"},
    image: {group: "edit", order: 110, type: "String", bindTarget: 1, subtype: "File", extensionMatch: ["jpg","jpeg","gif","png","tiff"]},
    imageWidth:{group: "edit", order: 111, editor: "wm.prop.SizeEditor"},
    imageHeight:{group: "edit", order: 112, editor: "wm.prop.SizeEditor"},
    noTopBottomDocking: {ignore:1},
    noLeftRightDocking: {ignore:1},
    width: {ignore: 1},
    height: {ignore: 1},
    autoScroll: {ignore: 1},
    scrollX: {ignore: 1},
    scrollY: {ignore: 1},
    touchScroll: {ignore: 1},
    border: {ignore: 1},
    borderColor: {ignore: 1},
    margin: {ignore: 1},
    padding: {ignore: 1},
    layoutKind: {ignore: 1},
    verticalAlign: {ignore: 1},
    horizontalAlign: {ignore: 1},
    lock: {ignore: 1},
    freeze: {ignore: 1},

    title: {ignore: 1},
    modal: {ignore: 1},
    noEscape: {ignore: 1},
    noMinify: {ignore: 1},
    noMaxify: {ignore: 1},
    corner: {ignore: 1},
    disabled: {ignore: 1},

    titlebarBorder: {ignore: 1},
    titlebarBorderColor: {ignore: 1},
    titlebarHeight: {ignore: 1},
    footerBorder: {ignore: 1},
    footerBorderColor: {ignore: 1},
    onEnterKeyPress: {ignore: 1}
});