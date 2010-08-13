/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
dojo.provide("wm.base.widget.Editors.Checkbox");
dojo.require("wm.base.widget.Editors.Base");

//===========================================================================
// CheckBox Editor
//===========================================================================
dojo.declare("wm._CheckBoxEditor", wm._BaseEditor, {
	dataType: "string",
	startChecked: false,
	_hasReadonlyValue: false,
	_createEditor: function(inNode, inProps) {
		return new dijit.form.CheckBox(this.getEditorProps(inNode, inProps));
	},
	setRequired: function() {
	},
	connectEditor: function() {
		this.inherited(arguments);
		if (this.owner.captionLabel)
			this.addEditorConnect(this.owner.captionLabel, "onclick", this, "captionClicked");
	},
	styleEditor: function() {
		this.inherited(arguments);
		dojo.addClass(this.editor.domNode.parentNode, "wmeditor-cbeditor");
		var n = this.owner.captionLabel.domNode;
		if (n) {
			n.style.cursor = "pointer";
			dojo.setSelectable(n, false);
		}
	},
	// checkbox cannot be sized, but should be adjusted in container
	sizeEditor: function() {
	    this.editor.domNode.style.width = "16px";
	},
	renderBounds: function() {
		this.inherited(arguments);
		// when caption is on right, move editor next to it.
		this.domNode.style.textAlign=(this.owner.captionPosition == "right") ? "right" : "";
	},
	setInitialValue: function() {
		this.owner.beginEditUpdate();
		if (this.startChecked)
			this.setChecked(true);
		this.owner.endEditUpdate();
	},
	getChecked: function() {
		return Boolean(this.editor.checked);
	},
	setChecked: function(inChecked) {
		this.editor.attr('checked',inChecked);
	},
	captionClicked: function() {
		if (!this.owner.readonly && !this.owner.disabled)
			this.setChecked(!this.getChecked());
	},
	getDisplayValue: function() {
		return this.getTypedValue(this.owner.displayValue);
	},
	setDisplayValue: function(inValue) {
	},
	getEditorValue: function() {
		var c = this.editor && this.editor.checked, v = this.getDisplayValue();
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
		if (inValue == null)
		{
			inValue = this.startChecked;
		}

		if (this.editor) {
			var
				t = (inValue === this.getDisplayValue()),
				f = (inValue === this.makeEmptyValue());
			// if we're set to neither checked or unchcked value, does not have a readonly value.
			this._hasReadonlyValue = t || f;
			this.editor.attr('checked',t);
			this.updateReadonlyValue();
		}
	},
	_getReadonlyValue: function() {
		var v = this._hasReadonlyValue ? this.getEditorValue() : "";
		return wm.capitalize(String(v));
	},
	setReadonlyValue: function(){
		if (!this.domNode)
		{
			return;
		}

		var v = this._hasReadonlyValue ? this.getEditorValue() : "";
		var tempCheckbox = new dijit.form.CheckBox({},dojo.doc.createElement('div'));
		tempCheckbox.attr('checked', v);
		tempCheckbox.attr('disabled', true);
		while (this.domNode.childNodes.length > 0)
		{
			this.domNode.removeChild(this.domNode.childNodes[0]);
		}

		this.domNode.appendChild(tempCheckbox.domNode);
	},
	setStartChecked: function(inChecked) {
		this.startChecked = inChecked;
		this.createEditor();
	},
	setDataType: function(inDataType) {
		this.dataType = inDataType;
		if (inDataType == "boolean")
			this.owner.displayValue = true;
	}
});


dojo.declare("wm.Checkbox", wm.AbstractEditor, {
	dataType: "string",
	startChecked: false,
        checkedValue: 1,
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
	    this.inherited(arguments);
	    var node = this.editorNode;
	    node.style.width = "16px";
	    node.style.height = "16px";
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
		if (this.startChecked)
			this.setChecked(true);
		this.endEditUpdate();
	},
	getChecked: function() {
		return Boolean(this.editor.checked);
	},
	setChecked: function(inChecked) {
		this.editor.attr('checked',inChecked);
	},
	captionClicked: function() {
	        if (!this.readonly && !this.disabled && !this.isDesignLoaded())
			this.setChecked(!this.getChecked());
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
		if (inValue == null)
		{
			inValue = this.startChecked;
		}

		if (this.editor) {
		    this.editor.attr('checked',Boolean(inValue));
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
		this.editor.attr("disabled",true);
	},
	setReadonly: function(inReadonly) {
	    this.readonly = inReadonly;
	    if (!this.editor) return;
	    if (!this.readOnlyNode) this.readOnlyNode = this.editor;
	    if (inReadonly || !this.disabled)
		this.editor.attr("disabled",inReadonly);
	}
});



// design only...
wm._CheckBoxEditor.extend({
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "dataType":
				return makeSelectPropEdit(inName, inValue, ["string", "boolean", "number"], inDefault);
		}
		return this.inherited(arguments);
	}
});

wm.Object.extendSchema(wm._CheckBoxEditor, {
	changeOnKey: { ignore: 1 },
	changeOnEnter: { ignore: 1 },
	startChecked: { bindable: 1, type: "Boolean"},
	displayValue: { isOwnerProperty: 1, ignore: 1, writeonly: 1, type: "any" },
	checkedValue: { isOwnerProperty: 1, readonly: 1, bindable: 1, group: "edit", order: 40, type: "any"},
	required: {ignore: 1}
});


wm.Object.extendSchema(wm.Checkbox, {
        readOnlyCheckbox: {ignore: 1},
        startChecked: { group: "editor", bindable: 1, type: "Boolean"},
        dataType:  { group: "editData"},
	displayValue: {ignore: 1, writeonly: 1, type: "any" },
        checkedValue: {group: "editor", bindable: 1,order: 40, type: "any"},
        required: {ignore: 1}
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