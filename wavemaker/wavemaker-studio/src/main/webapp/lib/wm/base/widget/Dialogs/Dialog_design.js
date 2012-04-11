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
    listProperties: function() {
	var p = this.inherited(arguments);
	p.minHeight.ignoretmp = false; // need these to control docking behavior
	p.minWidth.ignoretmp = false; // need these to control docking behavior
	return p;
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
    },
    set_containerPadding: function(inPadding) {
	this.containerPadding = inPadding;
	if (this.containerWidget) this.containerWidget.setPadding(inPadding);
    },
    /* Do not write showing=true to widgets.js */
    write: function(inIndent, inOptions) {
	if (!this.docked) {
	    var showing = this.showing;
	    this.showing = false;
	    var result = this.inherited(arguments);
	    this.showing = showing;
	    return result;
	} else {
	    return this.inherited(arguments);
	}
    }
});


wm.Object.extendSchema(wm.Dialog, {
    /* Display group; text subgroup */
    title: {group: "widgetName", subgroup: "text", order: 1, requiredGroup: 1, bindTarget: true},

    /* Display group; layout subgroup */
    positionNear: {group: "widgetName", subgroup: "layout", order: 61, editor: "wm.prop.WidgetSelect", editorProps: {
	widgetType: "wm.Control", excludeType: "wm.Dialog"
    }},
    corner:       {group: "widgetName", subgroup: "layout", order: 60, editor: "wm.prop.SelectMenu", editorProps: {
	options: ["top left", "top center", "top right", "center left", "center center", "center right", "bottom left", "bottom center", "bottom right"],
	values: ["tl", "tc", "tr", "cl", "cc", "cr", "bl", "bc", "br"]
    }},
    mobileTitlebarHeight: {group: "widgetName", subgroup: "layout", order: 100, advanced:1},
    titlebarButtons: {group: "widgetName", subgroup: "layout", order: 120,advanced:1},

    /* Common group */
    owner: {ignore:0},
    manageURL: {ignore:0},
    manageHistory: {ignore:0},

    /* Styles group */
    titlebarBorder:      {group: "widgetName", subgroup: "style", order: 5},
    titlebarBorderColor: {group: "widgetName", subgroup: "style", order: 6, editor: "wm.ColorPicker"},
    titlebarHeight:      {group: "widgetName", subgroup: "style", order: 7},
    footerBorder:        {group: "widgetName", subgroup: "style", order: 8},
    footerBorderColor:   {group: "widgetName", subgroup: "style", order: 9, editor: "wm.ColorPicker"},
    containerPadding: {group: "widgetName", subgroup: "style", order: 10},

    /* Dialog group; behaviors subgroup */
    modal:    {group: "widgetName", subgroup: "behavior",  order: 50},
    noEscape: {group: "widgetName", subgroup: "behavior",  order: 51},
    noMinify: {group: "widgetName", subgroup: "behavior",  order: 53},
    noMaxify: {group: "widgetName", subgroup: "behavior",  order: 54},


    /* Docking group */
    noTopBottomDocking: {group: "dialog", subgroup: "docking", type: "boolean"},
    noLeftRightDocking: {group: "dialog", subgroup: "docking", type: "boolean"},
    showTitleButtonsWhenDocked:{group: "dialog", subgroup: "docking", type: "boolean"},

    onShow: {advanced:0},
    onHide: {advanced:0},
    onMiscButtonClick: {advanced:1},

    /* Ignore group */
    wrapInPanel: {ignore:1},
    buttonBarId: {hidden:1},
    containerWidgetId: {hidden:1},
    resizeToFit: {ignore: 1},
    fixPositionNode: {ignore: 1},
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

    /* Method group */
    setModal: {method:1},
    minify: {method:1},
    setPositionNear: {method:1}
});









wm.Object.extendSchema(wm.GenericDialog, {   
    /* Subwidgets group; buttons subgroup */
    button1Caption: {group: "subwidgets", subgroup: "buttons", order: 61},
    button2Caption: {group: "subwidgets", subgroup: "buttons", order: 63},
    button3Caption: {group: "subwidgets", subgroup: "buttons", order: 65},
    button4Caption: {group: "subwidgets", subgroup: "buttons", order: 67},

    /* Subwidgets group; behavior subgroup */
    enterKeyIsButton: {group: "subwidgets", subgroup: "behavior", order: 60, options: ["","1","2","3","4"]},
    button1Close: {group: "subwidgets", subgroup: "behavior", order: 62},
    button2Close: {group: "subwidgets", subgroup: "behavior", order: 64},
    button3Close: {group: "subwidgets", subgroup: "behavior", order: 66},
    button4Close: {group: "subwidgets", subgroup: "behavior", order: 68},

    /* Display group; text subgroup */
    userPrompt: {group: "display", subgroup: "text", order: 54, bindTarget: true},

    /* Editor group */
    showInput: {group: "editor", subgroup: "display", order: 55, bindTarget: true},
    inputDataValue: {group: "editor", subgroup: "value", order: 56, bindTarget: true},
    regExp: {group: "editor", subgroup: "validation", order: 57, advanced: 1},

    /* Methods group */
    setShowInput: {method:1},
    setInputDataValue: {method:1},
    getInputDataValue: {method:1, returns: "String"},
    setUserPrompt: {method:1},
    setButton1Caption: {method:1},
    setButton2Caption: {method:1},
    setButton3Caption: {method:1},
    setButton4Caption: {method:1},

/* Ignored group */
    widgets_json: {ignore: 1}
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
    pageName: {group: "display", subgroup: "misc", bindable: 1, type: "string", order: 54, pageProperty: "page", editor: "wm.prop.PagesSelect"},
    deferLoad:{group: "display", subgroup: "misc", type: "boolean", order: 55},
    hideControls: {group: "display", subgroup: "layout"},
    footerBorder: {group: "style", order: 100},
    footerBorderColor:  {group: "style", order: 101}
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
    },
    set_image: function(inImage) {	
	this.setImage(inImage);
	this.connectOnce(this._picture.img, "onload", this, function() {
	    this.setImageWidth(this._picture.img.naturalWidth + "px");
	    this.setImageHeight(this._picture.img.naturalHeight + "px");
	});
    }
});

wm.Object.extendSchema(wm.LoadingDialog, {
    /* Display group; misc subgroup */
    widgetToCover: {group: "widgetName", subgroup: "layout", order: 1, requiredGroup: 1, bindTarget: 1, createWire: 1, editor: "wm.prop.WidgetSelect", editorProps: {widgetType: "wm.Control", excludeType: "wm.Dialog"}, order: 100},
    serviceVariableToTrack: {group: "widgetName", subgroup: "misc", order: 2, requiredGroup: 1, bindTarget: 1, createWire: 1, editor: "wm.prop.WidgetSelect", editorProps: {widgetType: "wm.ServiceVariable"}, order: 101},    

    /* Display group; text subgroup */
    caption:      {group: "widgetName", subgroup: "text", order: 102, bindTarget: 1},
    captionWidth: {group: "widgetName", subgroup: "text", order: 103, editor: "wm.prop.SizeEditor"},
    image:        {group: "widgetName", subgroup: "graphics", order: 110, type: "String", bindTarget: 1, subtype: "File", extensionMatch: ["jpg","jpeg","gif","png","tiff"]},
    imageWidth:   {group: "widgetName", subgroup: "layout", order: 111, editor: "wm.prop.SizeEditor"},
    imageHeight:  {group: "widgetName", subgroup: "layout", order: 112, editor: "wm.prop.SizeEditor"},
    
    /* Ignore group */
    positionNear: {ignore:1},
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