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

dojo.provide("wm.base.debug.StylePanel");

dojo.declare("wm.debug.StylePanel", wm.Layer, {
    width: "100%",
    height: "100%",
    caption: "Styles/Position",
    layoutKind: "top-to-bottom",
    verticalAlign: "top",
    horizontalAlign: "left",
    autoScroll: true,


/* This hack (providing getRoot and getRuntimeId) is needeed to be able to write event handlers such as onShow: "serviceGridPanel.activate"; without it, we'd need something like
 * app.debugDialog.serviceGridPanel.activate
 */
    getRoot: function() {
	return this;
    },
	getRuntimeId: function(inId) {
		inId = this.name + (inId ? "." + inId : "");
		return this.owner != app.pageContainer ? this.owner.getRuntimeId(inId) : inId;
	},
	getId: function(inName) {
		return inName;
	},


    postInit: function() {
	this.inherited(arguments);
	this.createComponents({
		    showingStatus: ["wm.Label", {width: "100%", singleLine: false, height: "60px"}],
		    widthInput: ["wm.Text", {width:"100%",caption: "width", captionSize: "100px"}, {onchange: "widthChange"}],
		    actualWidth: ["wm.Text", {width:"100%",readonly: true, caption: "Actual Width", captionSize: "100px"}],
		    heightInput: ["wm.Text", {width:"100%",caption: "height", captionSize: "100px"}, {onchange: "heightChange"}],
		    actualHeight: ["wm.Text", {width:"100%",readonly: true, caption: "Actual Height", captionSize: "100px"}],
		    marginInput: ["wm.Text", {width:"100%",caption: "margin", captionSize: "100px"}, {onchange: "marginChange"}],
		    paddingInput: ["wm.Text", {width:"100%",caption: "padding", captionSize: "100px"}, {onchange: "paddingChange"}],
		    borderInput: ["wm.Text", {width:"100%",caption: "border", captionSize: "100px"}, {onchange: "borderChange"}],
		    borderColorInput: ["wm.ColorPicker", {width:"100%",caption: "borderColor", captionSize: "100px"}, {onchange: "borderColorChange"}],
		    highlightButton: ["wm.Button", {caption: "Highlight Parents", hint: "click this to see each of this widget's parents; do this if you can't see the widget, this may help you discover a parent that needs to be scrollable in order to show this widget", width: "180px"},{onclick: "highlightParents"}],
		    styleInput: ["wm.AceEditor", {syntax: "css", width: "100%", height: "100%",minWidth:"150"}, {onChange: "stylesChange"}]
	}, this);

    },
    inspect: function(inComponent) {
	if (inComponent) {
	    this.selectedItem = inComponent;
	}

	if (this.selectedItem instanceof wm.Control == false) {
	    this.hide();
	    return;
	}
	if (this._inInspect) return;
	this._inInspect = true;
	this.show();

	try {
	    /* Presentation Panel */
	    if (!this.selectedItem.showing) {
		this.$.showingStatus.setCaption("Widget is Hidden: Widget's showing property is set to false");
	    } else if (this.selectedItem.isAncestorHidden()) {
		this.$.showingStatus.setCaption("Widget is Hidden: It is in a hidden container");
	    } else {
		this.$.showingStatus.setCaption("Widget is Showing: If you can't see it, it may be scrolled out of view (in there is no scrollbar, this can make it harder to find)");
	    }

	    this.$.widthInput.setDataValue(this.selectedItem.width);
	    this.$.actualWidth.setDataValue(this.selectedItem.bounds.w + "px");
	    this.$.heightInput.setDataValue(this.selectedItem.height);
	    this.$.actualHeight.setDataValue(this.selectedItem.bounds.h + "px");
	    this.$.marginInput.setDataValue(this.selectedItem.margin);
	    this.$.paddingInput.setDataValue(this.selectedItem.padding);
	    this.$.borderInput.setDataValue(this.selectedItem.border);
	    this.$.borderColorInput.setDataValue(this.selectedItem.borderColor);

	    var styles = "";
	    for (var styleName in this.selectedItem.styles) {
		styles += styleName.replace(/([A-Z])/g, function(inText) {return "-" + inText.toLowerCase();});
		styles += ": " + this.selectedItem.styles[styleName] + ";\n";
	    }
	    this.$.styleInput.setDataValue(styles);
	} catch(e) {
	}
	this._inInspect = false;
    },
    widthChange: function(inSender, inDisplayValue, inDataValue) {
	if (this._inInspect || !this.selectedItem) return;
	this.selectedItem.setWidth(inDataValue);
	this.inspect();
    },
    heightChange: function(inSender, inDisplayValue, inDataValue) {
	if (this._inInspect || !this.selectedItem) return;
	this.selectedItem.setHeight(inDataValue);
	this.inspect();
    },
    marginChange: function(inSender, inDisplayValue, inDataValue) {
	if (this._inInspect || !this.selectedItem) return;
	this.selectedItem.setMargin(inDataValue);
	this.inspect();
    },
    paddingChange: function(inSender, inDisplayValue, inDataValue) {
	if (this._inInspect || !this.selectedItem) return;
	this.selectedItem.setPadding(inDataValue);
	this.inspect();
    },
    borderChange: function(inSender, inDisplayValue, inDataValue) {
	if (this._inInspect || !this.selectedItem) return;
	this.selectedItem.setBorder(inDataValue);
	this.inspect();
    },
    borderColorChange: function(inSender, inDisplayValue, inDataValue) {
	if (this._inInspect || !this.selectedItem) return;
	this.selectedItem.setBorderColor(inDataValue);
	this.inspect();
    },
    stylesChange: function(inSender, inDataValue) {
	if (this._inInspect || !this.selectedItem ) return;
	wm.onidle(this, function() {
	    var styles = inDataValue;
	    var entries = styles.split(/;/);
	    var stylesObj = {};
	    for (var i = 0; i < entries.length; i++) {
		var entry = entries[i];
		if (entry.indexOf(":") != -1) {
		    var styleName = dojo.trim(entry.substring(0,entry.indexOf(":")));	    
		    var styleValue = dojo.trim(entry.substring(1+entry.indexOf(":")));
		    styleName = styleName.replace(/-([a-z])/g,function(inValue) {return inValue.substring(1).toUpperCase();})
		    if (styleName && styleValue) {
			stylesObj[styleName] = styleValue;
		    }
		}
	    }
	    this.selectedItem.invalidCss = true;
	    this.selectedItem.styles = stylesObj;
	    this.selectedItem.renderCss();
	    if (!dojo.isDescendant(document.activeElement, this.$.styleInput.domNode)) {
		this.inspect();
	    }
	});
    },
    highlightParents: function() {
	if (this.highlightWidget) {
	    this.highlightWidget.setBorder(this.highlightWidgetBorder);
	    this.highlightWidget.setBorderColor(this.highlightWidgetBorderColor);
	    this.highlightWidget = this.highlightWidget.parent;
	} else {
	    this.highlightWidget = this.selectedItem;
	}
	if (!this.highlightWidget) return;
	this.highlightWidgetBorder = this.highlightWidget.border;
	this.highlightWidgetBorderColor = this.highlightWidget.borderColor;
	this.highlightWidget.setBorder("4");
	this.highlightWidget.setBorderColor("red");
	app.toastDialog.showToast("Highlighting " + this.highlightWidget.toString(), 2000, "", "cc");
	wm.job("highlightParents", 2000, dojo.hitch(this,"highlightParents"));
    }
});