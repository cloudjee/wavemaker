/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.mobile.Checkbox");
dojo.require("wm.base.mobile.AbstractEditor");

dojo.declare("wm.mobile.Checkbox", wm.mobile.AbstractEditor, {
    /* Formating */
	width: "120px",

	dataType: "string",
	startChecked: false,
        checkedValue: "true",
    postInit: function() {
	this.inherited(arguments);
	this.setChecked(this.checked);
    },
    _createEditor: function(inNode, inProps) {
	var node = dojo.create("div", {className: "wmmobcheckboxnode"}, this.domNode);
	dojo.create("div", {className: "wmmobcheckboxX1"}, node);
	dojo.create("div", {className: "wmmobcheckboxX2"}, node);
	return node;
    },
    clicked: function() {
	if (!this.readonly && !this.disabled && !this.isDesignLoaded()) {
	    this.setChecked(!this.checked);
	}
    },
	setRequired: function() {
	},

	// checkbox cannot be sized, but should be adjusted in container
	sizeEditor: function() {
	    if (this._cupdating)
		return;
	    var b = this.getContentBounds();
	    var s = this.editor.style;
	    
	    var checkboxSize = 25;
	    s.width = checkboxSize + "px";
	    s.height = checkboxSize + "px";
	    s.left = this.captionPosition == "left" ? (b.w - checkboxSize) + "px" : "0px";

	    s = this.captionNode.style;
	    s.height = b.h + "px";	    
	    s.width = (b.w - checkboxSize) + "px";
	    s.lineHeight = b.h + "px";
	    s.left = this.captionPosition != "left" ? (b.w - checkboxSize) + "px" : "0px";
	},
	render: function() {
	        this.inherited(arguments);
		// when caption is on right, move editor next to it.
		this.domNode.style.textAlign=(this.captionPosition == "right") ? "right" : "";
	},
	setInitialValue: function() {
		this.beginEditUpdate();
	    // if setEditorValue has been called, then startChecked no longer controls the checkbox's initial state;
	    // the dataValue only controls the state now.
	        if (this.startChecked && !this._setEditorValueCalled || Boolean(this.dataValue))
			this.setChecked(true);
		this.endEditUpdate();
	},
	getChecked: function() {
	    return this.checked;
	},
	setChecked: function(inChecked) {
	    var wasChecked = this.checked;
	    this.checked = inChecked;
	    if (this.checked) {
		dojo.removeClass(this.editor, "Unchecked");
		dojo.addClass(this.editor, "Checked");
	    } else {
		dojo.removeClass(this.editor, "Checked");
		dojo.addClass(this.editor, "Unchecked");
	    }
	    if (inChecked != wasChecked)
		this.changed();
	},

	getDisplayValue: function() {
		return this.getTypedValue(this.displayValue);
	},
	setDisplayValue: function(inValue) {
	},
	getEditorValue: function() {
	    var c = this.checked;
	    var v = this.checkedValue;
	    if (v === undefined)
		v = this.getTypedValue(1);
		return c ? v : this.makeEmptyValue();
	},
	getTypedValue: function(inValue) {
		var v = inValue;
		switch (this.dataType) {
			case "string":
				// return "" for all false values but 0 which is "0"
				v = v || v === 0 ? v : "";
				return String(v);
			case "number": 
				// if not a number, return number value of boolean value
				var n = Number(v);
				return isNaN(n) ? Number(Boolean(v)) : n;
			default:
				return Boolean(v);
		}
	},
	setEditorValue: function(inValue) {
	    this.setChecked(Boolean(inValue));
	},

        updateReadonlyValue: function(){
	},
	setStartChecked: function(inChecked) {
		this.startChecked = inChecked;
	},
	setDataType: function(inDataType) {
		this.dataType = inDataType;
		if (inDataType == "boolean")
			this.displayValue = true;
	},
	setDisabled: function(inDisabled) {
	    this.inherited(arguments);
	    dojo[inDisabled ? "addClass" : "removeClass"](this.domNode, "Disabled");
	},
	setReadonly: function(inReadonly) {
	    this.readonly = inReadonly;
	    dojo[inReadonly ? "addClass" : "removeClass"](this.domNode, "Readonly");
	}
});



wm.Object.extendSchema(wm.mobile.Checkbox, {
    dataValue: {ignore: 1, bindable: 1, group: "editData", order: 3, simpleBindProp: true, type: "Boolean"},
        readOnlyCheckbox: {ignore: 1},
        startChecked: { group: "editor", bindable: 1, type: "Boolean"},
    dataType:  { group: "editData", doc: 1},
	displayValue: {ignore: 1, writeonly: 1, type: "any" },
    checkedValue: {group: "editor", bindable: 1,order: 40, type: "any", doc: 1},    
    required: {ignore: 1},
    getChecked: {group: "method", doc: 1, returns: "Boolean"},
    setChecked: {group: "method", doc: 1}
});

wm.mobile.Checkbox.extend({
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "dataType":
				return makeSelectPropEdit(inName, inValue, ["string", "boolean", "number"], inDefault);
		}
		return this.inherited(arguments);
	}
});