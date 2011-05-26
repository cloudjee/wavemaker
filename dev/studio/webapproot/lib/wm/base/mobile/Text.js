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
dojo.provide("wm.base.mobile.Text");
dojo.require("wm.base.mobile.AbstractEditor");

dojo.declare("wm.mobile.Text", wm.mobile.AbstractEditor, {
        resetButton: false,
        placeHolder: "",
	changeOnKey: false,
	changeOnEnter: true,

	showMessages: true,
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
		        placeHolder: this.placeHolder,
			regExp: this.regExp,
			value: this.displayValue,
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
        setPlaceHolder: function(inPlaceHolder) {
	    this.placeHolder = inPlaceHolder;
	    if (this.editor)
		this.editor.placeholder =  inPlaceHolder;
	},
	setPassword: function(inPassword) {
		this.password = inPassword;
		this.createEditor();
	        var pos = this.captionPosition;
	        this.captionPosition = "";
	        this.setCaptionPosition(pos);

	},
    setRegExp: function(inExpr) {
	this.regExp = inExpr;
	if (!this._cupdating)
	    this.createEditor();
    },
/* a way to create an html editor and transform it to a dijit onclick; this approach may still be desired at some point... for both performance and usability reasons.  Usability reasons though could be handled with a click to exit readonly mode
    __createEditor: function(node,inProps) {
	    if (this.fakeEditor) {
		dojo.destroy(this.fakeEditor);		
		delete this.fakeEditor;
		return this._createEditor2(node,inProps);
	    }
	  
	    var input = dojo.create("input", {type: "text",
					      id:    this.id + "_INPUT",
					      className: "dijit dijitReset dijitLeft dijitTextBox",
					      style: {width: "100%", height: "100%"}}, node, "first");
	    this.fakeEditor = input;
	    dojo.connect(input, "onfocus", this, function() {
		this.createEditor(inProps);
		this.editor.focus();
	    });
	    return {domNode: input};

    },

	_createEditor: function(inNode, inProps) {
	    var node = dojo.create("input", {type: "text", placeholder: this.placeHolder});
	    this.domNode.appendChild(node);
	    return node;
	},
    */

        destroy: function() {
	    if (this._resetButtonNode) 
		dojo.destroy(this._resetButtonNode);
	    if (this._resetButtonConnect)
		dojo.disconnect(this._resetButtonConnect);
	    this.inherited(arguments);
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
	},
    setResetButton: function(inReset) {
	if (this._resetButtonConnect) {
	    dojo.disconnect(this._resetButtonConnect);
	    delete this._resetButtonConnect;
	}
	this.resetButton = inReset;
	dojo[inReset ? "addClass":"removeClass"](this.domNode, "wmreseteditor");
	this.createEditor();
    }
});


dojo.declare("wm.mobile.LargeTextArea", wm.mobile.Text, {
        _editorPaddingLeft: 3,
        _editorPaddingRight: 3,
	width: "300px",
	height: "96px",
	captionSize: "24px",
	captionPosition: "top",
        captionAlign: "left",
	singleLine: false,

        changeOnEnter: false,
	_createEditor: function(inNode, inProps) {
	    var node = dojo.create("textarea", {});
	    this.domNode.appendChild(node);
	    return node;
	},
        validationEnabled: function() {return false;},
	sizeEditor: function() {
		this.inherited(arguments);
	},
        setSingleLine: function(inSingleLine) {
            this.inherited(arguments);
            this.captionNode.style.lineHeight = "normal";
        },
        getReadOnlyNodeLineHeight: function() {return "normal";},

        // readonly node always wraps unless autoResizeWidth is used
        getReadOnlyNodeWhiteSpace: function() {
		if (this.autoSizeWidth)
			return this.inherited(arguments);
		else
			return "normal";
	},
        getReadOnlyNodeOverflow: function() {
		if (this.autoSizeWidth || this.autoSizeHeight)
			return this.inherited(arguments);
		else
			return "auto";
	},
        getMinHeightProp: function() {
            return this.minHeight || 80; // scrollbars sometimes have trouble when an editor is too short
        }
});



wm.Object.extendSchema(wm.mobile.Text, {
    placeHolder: {group: "Labeling", doc: 1}, // TODO: ignoring this only for 6.2 as it needs polish, particularly if its to work with themes
    promptMessage: {group: "Labeling", order: 6},
    tooltipDisplayTime: {group: "Labeling", order: 7},
    password: {group: "editor", order: 5, doc: 1},
    maxChars: {group: "editor", order: 6, doc: 1},
    changeOnKey: {group: "events", order: 3},
    regExp: {group: "validation", order: 2, doc: 1},
    invalidMessage: {group: "validation", order: 3},
    showMessages: {group: "validation", order: 4},
    onEnterKeyPress: {ignore: 0},
    setPlaceHolder: {group: "method", doc: 1},
    setPassword: {group: "method", doc: 1},
    setRegExp: {group: "method", doc: 1}
});


wm.Object.extendSchema(wm.mobile.LargeTextArea, {
	changeOnEnter: { ignore: 1 },
        onEnterKeyPress: {ignore: 1},
	password: {ignore: 1}
});

wm.mobile.LargeTextArea.extend({
     themeableDemoProps: {height: "100%"}
});

