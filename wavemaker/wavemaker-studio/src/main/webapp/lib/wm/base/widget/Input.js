/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Input");
/* DEPRECATED (but still used in a few of studio's pages */

dojo.declare("wm.Input", wm.Box, {
	inputValue: "",
	margin: 2,
	maxLength: "",
	inputType: "text",
	checked: false,
	readOnly: false,
	changeOnKey: false,
	build: function() {
		this.domNode = document.createElement('input');
		this.renderInput();
	},
	setDomNode: function(inDomNode) {
		this.inherited(arguments);
		dojo.addClass(this.domNode, "wminput");
	},
	init: function() {
		this.inherited(arguments);
		this.connect(this.domNode, "onclick", this, "onclick");
		this.connect(this.domNode, "onchange", this, "onchange");
		this.connect(this.domNode, "onblur", this, "onblur");
		this.connect(this.domNode, "onkeypress", this, "onkeypress");
		
	},
	renderInput: function() {
		this.setValue("inputValue", this.inputValue);
		this.setInputType(this.inputType);
		this.setMaxLength(this.maxLength);
		this.setChecked(this.checked);
		this.setReadOnly(this.readOnly);
	},
	renderData: function() {
		var d = this.owner[this.dataSource];
		this.setInputValue(d && d.data && d.data[this.dataField] || this.inputValue);
		this.setChecked(this.checked || this.inputValue != "");
	},
	// Note: doesn't send any change messages (setValue does)
	setInputValue: function(inValue) {
		this.inputValue = inValue || "";
		this.domNode.value = this.inputValue;
	},
	getInputValue: function() {
		return this.inputValue = this.getNodeValue();
	},
	getNodeValue: function() {
		return this.domNode.value;
	},
	setDomProp: function(inProp, inValue) {
		this[inProp] = inValue;
		if (inValue)
			this.domNode.setAttribute(inProp, inValue);
		else
			this.domNode.removeAttribute(inProp);
	},
	setChecked: function(inChecked) {
		this.domNode.checked = inChecked;
		//this.setDomProp("checked", inChecked ? "checked" : "");
	},
	getChecked: function() {
		return this.domNode.checked;
	},
	setDisabled: function(inDisabled) {
		this.setDomProp("disabled", inDisabled);
	},
	setReadOnly: function(inReadonly) {
		this.setDomProp("readOnly", inReadonly);
	},
	setMaxLength: function(inMaxLength) {
		this.maxLength = inMaxLength;
		if (this.maxLength)
			this.domNode.maxLength = this.maxLength;
		else
			this.domNode.removeAttribute('maxlength');
		// NOTE: input feedback used to rerender the input
		this.setInputValue(this.getNodeValue());
	},
	setInputType: function(inInputType) {
		this.inputType = inInputType;
		if (this.inputType) {
			this.domNode.type = this.inputType;
			this.reflowParent();
		}
	},
	// commit DOM node changes to the widget using notification system
	inputChanged: function() {
		if (this.inputValue != this.getNodeValue())
			this.setValue("inputValue", this.getNodeValue());
	},
	canFocus: function() {
		return this.showing;
	},
	focus: function() {
		this.domNode.focus();
	},
	// events
	onclick: function() {
	},
	onchange: function() {
	},
	onblur: function() {
		this.inputChanged();
	},
	onkeypress: function(e) {
		if (this.changeOnKey)
			setTimeout(dojo.hitch(this, "inputChanged"), 2);
	    if (e.keyCode == dojo.keys.ENTER)
			setTimeout(dojo.hitch(this, "onenterkey"), 2);
	},
    onenterkey: function() {}
});

// design only...
wm.Input.description = "A text input.";

wm.Object.extendSchema(wm.Input, {
	inputValue: { bindable: 1, group: "common", order: 1, focus: 1 }
});

wm.Input.extend({
	scrim: true,
	makePropEdit: function(inName, inValue, inDefault) {
		if (inName == "inputType")
			return makeSelectPropEdit(inName, inValue, ["text", "checkbox", "password", "file", "hidden"], inDefault);
		return this.inherited("makePropEdit", arguments);
	}
});
