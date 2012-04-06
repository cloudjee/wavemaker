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

dojo.provide("wm.base.widget.TextArea");

/* DEPRECATED, but still used by a couple of studio's pages */

dojo.declare("wm.TextArea", wm.Box, {
	inputValue: '',
	width: "1flex",
	height: "1flex",
	margin: 2,
	readonly: false,
	build: function() {
		this.domNode = document.createElement('textarea');
		this.domNode.setAttribute("spellCheck", "false");
		this.renderTextArea();
	},
	setDomNode: function(inDomNode) {
		this.inherited(arguments);
		dojo.addClass(this.domNode, "wmtextarea");
	},
	init: function() {
		this.readonly = this.readOnly;
		this.inherited(arguments);
		this.connect(this.domNode, "onclick", this, "onclick");
		this.connect(this.domNode, "onkeypress", this, "onkeypress");
		this.connect(this.domNode, "onblur", this, "onblur");
	},
	renderTextArea: function() {
		this.setValue("inputValue", this.inputValue);
		this.setInputValue(this.inputValue);
		this.setReadonly(this.readonly);
		this.setDisabled(this.disabled);
	},
	clear: function() {
		this.setInputValue("");
	},
	setInputValue: function(inValue) {
		this.inputValue = inValue;
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
	setReadonly: function(inReadonly) {
		this.setDomProp("readOnly", inReadonly);
	},
	setDisabled: function(inDisabled) {
		this.inherited(arguments);
		this.setDomProp("disabled", inDisabled);
		dojo[inDisabled ? "addClass" : "removeClass"](this.domNode, "wmtextarea-disabled");
	},
	// commit DOM node changes to the widget using notification system
	inputChanged: function() {
		if (this.inputValue != this.getNodeValue()) {
			this.setValue("inputValue", this.getNodeValue());
			this.onchange(this.inputValue);
		}
	},
	// events
	onchange: function(newValue) {
	},
	onclick: function(inEvent) {
	},
	onkeypress: function(inEvent) {
	},
	onblur: function(inEvent) {
		this.inputChanged();
	}
});

wm.Object.extendSchema(wm.TextArea, {
	inputValue: { bindable: 1, group: "common", order: 1, focus: 1 }
});

// design only...
wm.TextArea.description = "A multi-line text input.";

wm.TextArea.extend({
	scrim: true
});