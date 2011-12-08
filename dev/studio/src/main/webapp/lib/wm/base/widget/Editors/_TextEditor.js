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


dojo.provide("wm.base.widget.Editors._TextEditor");
dojo.require("wm.base.widget.Editors.Base");
dojo.require("dijit.form.SimpleTextarea");



//===========================================================================
// Text Editor
//===========================================================================
dojo.declare("wm._TextEditor", wm._BaseEditor, {
	promptMessage: "",
	invalidMessage: "",
	password: false,
	maxChars: "",
	regExp: ".*",
	_passwordChar: "&#8226;",
	tooltipDisplayTime:2000,
	getEditorProps: function(inNode, inProps) {
		var p = dojo.mixin(this.inherited(arguments), {
			promptMessage: this.promptMessage,
			invalidMessage: this.invalidMessage || "$_unset_$",
			regExp: this.regExp,
			value: this.owner.displayValue,
			required: this.required,
			tooltipDisplayTime: this.tooltipDisplayTime
		});
		// this dijit supports setting password type at creation time only
		if (this.password)
			p.type = "password";
		
		// maxChar property should only be set if user sets a limit otherwise, textEditor and all its sub-class will not work in IE8(Compatible mode for IE7)
		if(this.maxChars)
			p.maxLength = this.maxChars;

		return dojo.mixin(p, inProps || {});
	},
	validationEnabled: function() {
	  return (this.regExp && this.regExp != ".*") || this.required;
	},
	setPassword: function(inPassword) {
		this.password = inPassword;
		this.createEditor();
	},
	_createEditor: function(inNode, inProps) {
		if (this.singleLine)
		{
		  if (this.validationEnabled() || this.promptMessage)
			return new dijit.form.ValidationTextBox(this.getEditorProps(inNode, inProps));
		  else
			return new dijit.form.TextBox(this.getEditorProps(inNode, inProps));
		}
		else
		{
			return new dijit.form.SimpleTextarea(this.getEditorProps(inNode, inProps));
		}
	},
	validator: function(inValue, inConstraints) {
		var l = Number(this.maxChars);
		return this.maxChars !== "" && !isNaN(l) ? inValue.length <= l : true;
	},
	_getReadonlyValue: function() {
		var v = this.inherited(arguments);
		if (this.password) {
			for (var i=0, a=[], l=v.length; i<l; i++)
				a.push(this._passwordChar);
			v = a.join('');
		}
		return v;
	}
});


//===========================================================================
// TextArea Editor
//===========================================================================
dojo.declare("wm._TextAreaEditor", wm._TextEditor, {
        _editorPaddingLeft: 3,
        _editorPaddingRight: 3,
	_createEditor: function(inNode, inProps) {
	        return new dijit.form.SimpleTextarea(this.getEditorProps(inNode, inProps));
	},
	sizeEditor: function() {
		this.inherited(arguments);
		this.domNode.style.height = '';		
		this.domNode.style.lineHeight = '';
	}
});

// design only
wm.Object.extendSchema(wm._TextAreaEditor, {
	changeOnEnter: { ignore: 1 },
	password: {ignore: 1}
});
