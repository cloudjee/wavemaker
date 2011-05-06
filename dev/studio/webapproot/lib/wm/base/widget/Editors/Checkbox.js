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


dojo.provide("wm.base.widget.Editors.Checkbox");
dojo.require("wm.base.widget.Editors.AbstractEditor");

dojo.declare("wm.Checkbox", wm.AbstractEditor, {
    /* Formating */
	width: "120px",

	dataType: "string",
	startChecked: false,
        checkedValue: "true",
	_createEditor: function(inNode, inProps) {
		return new dijit.form.CheckBox(this.getEditorProps(inNode, inProps));
	},
	setRequired: function() {
	},
	connectEditor: function() {
		this.inherited(arguments);
		if (this.captionNode)
			this.addEditorConnect(this.captionNode, "onclick", this, "captionClicked");
	},
	// checkbox cannot be sized, but should be adjusted in container
	sizeEditor: function() {
	    if (this._cupdating)
		return;
	    this.inherited(arguments);
	    var node = this.editorNode;
	    node.style.width = "16px";
	    node.style.height = "16px";
            var height = parseInt(node.style.lineHeight);
            node.style.marginTop = (Math.floor(height-16)/2) + "px";
	},

	styleEditor: function() {
		this.inherited(arguments);
		dojo.addClass(this.editor.domNode.parentNode, "wmeditor-cbeditor");
	        var n = this.captionNode;
		if (n) {
			n.style.cursor = "pointer";
			dojo.setSelectable(n, false);
		}
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
	    if (this.editor)
		return Boolean(this.editor.checked);
	    else
		return Boolean(this.dataValue);
	},

    // pass in the false parameer so that there is no delayed firing of side-effects to the checking of the checkbox; fire our own changed event
    // handler instead so that it onchange fires now.
	setChecked: function(inChecked) {
	    this.editor.set('checked',inChecked, false);
	    if (!this._cupdating)
		this.changed();
	},
	captionClicked: function() {
	    if (!this.readonly && !this.disabled && !this.isDesignLoaded()) {
		var isChecked = this.getChecked();
		wm.onidle(this, function() {
		    this.setChecked(!isChecked);
		});
	    }
	},
	getDisplayValue: function() {
		return this.getTypedValue(this.displayValue);
	},
	setDisplayValue: function(inValue) {
	},
	getEditorValue: function() {
	    var c = this.editor && this.editor.checked;
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
	        this._setEditorValueCalled = true;
		if (this.editor) {
		    this.editor.set('checked',Boolean(inValue));
		}
	},

        updateReadonlyValue: function(){
	},
	setStartChecked: function(inChecked) {
		this.startChecked = inChecked;
		this.createEditor();
	},
	setDataType: function(inDataType) {
		this.dataType = inDataType;
		if (inDataType == "boolean")
			this.displayValue = true;
	},
	setDisabled: function(inDisabled) {
	    this.inherited(arguments);
	    if (!this.editor) return;
	    if (this.readonly)
		this.editor.set("disabled",true);
	},
	setReadonly: function(inReadonly) {
	    this.readonly = inReadonly;
	    if (!this.editor) return;
	    if (!this.readOnlyNode) this.readOnlyNode = this.editor;
	    if (inReadonly || !this.disabled)
		this.editor.set("disabled",inReadonly);
	},
	getMinWidthProp: function() {
		if (this.minWidth) return this.minWidth;
		if (this.captionPosition == "top" || this.captionPosition == "bottom" || !this.caption) return 40;
		else if (this.captionSize.match(/\%/)) return 80;
		else return 20 + parseInt(this.captionSize);
	},

});




wm.Object.extendSchema(wm.Checkbox, {
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

wm.Checkbox.extend({
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "dataType":
				return makeSelectPropEdit(inName, inValue, ["string", "boolean", "number"], inDefault);
		}
		return this.inherited(arguments);
	}
});