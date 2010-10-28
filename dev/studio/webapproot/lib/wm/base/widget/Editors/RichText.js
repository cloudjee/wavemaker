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
 
dojo.provide("wm.base.widget.Editors.RichText");

dojo.require("wm.base.widget.Editors.Text");

dojo.require("dijit.Editor");
dojo.require("dijit._editor.plugins.AlwaysShowToolbar");
dojo.require("dijit._editor.plugins.FontChoice");
dojo.require("dijit._editor.plugins.TextColor");
dojo.require("dijit._editor.plugins.LinkDialog");

//===========================================================================
// Rich Text Editor  
//===========================================================================

dojo.declare("wm.RichText", wm.LargeTextArea, {
	width: "100%",
	height: "200px",
	padding: "0",
	_ready: false,
	emptyValue: "emptyString",
	dataValue: "",
	displayValue: "",
	plugins: null,
	toolbarUndo: true,
	toolbarStyle: true,
	toolbarStyleAll: false,
	toolbarAlign: true,
	toolbarList: true,
	toolbarLink: false,
	toolbarFont: false,
	toolbarColor: false,
	classNames: "wmeditor wmrichtext",
	afterPaletteDrop: function() {
  	this.setCaption(this.name);
	},
	init: function() {
		this.inherited(arguments);
		this.plugins = [];
		this.updatePlugins();
	},
	/* uncomment this after GA
	getEditorProps: function(inNode, inProps) {
  	var p = dojo.mixin(this.inherited(arguments), {
	   value: this.displayValue
	 });
	 return dojo.mixin(p, inProps || {});
	},
	*/
	updatePlugins: function() {
	  this.plugins = ["dijit._editor.plugins.AlwaysShowToolbar", "dijit._editor.plugins.EnterKeyHandling"];
	  if (this.toolbarUndo) {
	      this.plugins.push("undo");
	      this.plugins.push("redo");
	      this.plugins.push("|");
	  }
	  if (this.toolbarStyle) {
	      this.plugins.push("bold");
	      this.plugins.push("italic");
	      this.plugins.push("underline");
	      if (this.toolbarStyleAll) {
	          this.plugins.push("strikethrough");
	          this.plugins.push("subscript");
	          this.plugins.push("superscript");
	      }
	      this.plugins.push("|");
	  }
	  if (this.toolbarAlign) {
	      this.plugins.push("justifyLeft");
	      this.plugins.push("justifyRight");
	      this.plugins.push("justifyCenter");
	      this.plugins.push("justifyFull");
	      this.plugins.push("|");
	  }
	
	  if (this.toolbarList) {
	      this.plugins.push("insertOrderedList");
	      this.plugins.push("insertUnorderedList");
	      this.plugins.push("indent");
	      this.plugins.push("outdent");
	      this.plugins.push("|");
	  }
	  if (this.toolbarLink) {
	      this.plugins.push("createLink");
	      this.plugins.push("unlink");
	      this.plugins.push("|");
	  }
	  if (this.toolbarFont) {
	      //this.plugins.push("dijit._editor.plugins.FontChoice");
	      this.plugins.push("fontName");
	      this.plugins.push("fontSize");
	      this.plugins.push("formatBlock");
	      this.plugins.push("|");
	  }
	  if (this.toolbarColor) {
	      this.plugins.push("dijit._editor.plugins.TextColor");
	      this.plugins.push("foreColor");
	      this.plugins.push("hiliteColor");
	      this.plugins.push("|");
	  }
	},
	setReadonly: function(inReadonly) {
		if (this.readonly && !inReadonly) {
			var val = this.getDataValue();
      this.inherited(arguments, [inReadonly, true]);
			this.setDataValue(val);
		} else
      this.inherited(arguments, [inReadonly, true]);
	},
	//Character Formatting: bold, italic, underline, strikethrough, subscript, superscript, removeFormat, forecolor, hilitecolor
	//Paragraph Formatting:: indent, outdent,justifyCenter, justifyFull, justifyLeft, justifyRight, delete, selectall
	//Inserting Objects:insertOrderedList, insertUnorderedList, createlink (use LinkDialog plugin), inserthtml
	//Misc.: undo, redo, cut, copy, paste
	// FontChoice       Adds font drop down.
	//LinkDialog        Provides a dialog for inserting URLs
	//TextColor
	sizeEditor: function() {
		if (!this._ready) return;
		this.inherited(arguments);
		var h = parseInt(this.editorNode.style.height);
		var toolh = this.editorNode.childNodes[0].clientHeight;
		this.editor.iframe.style.height = (h-toolh) + "px";
		if (this.editor.focusNode) {
  		this.editor.focusNode.style.height =  (h-toolh) + "px";
		}
	},
	_createEditor: function(inNode, inProps) {
		this._ready = false;
		this.editorNode = document.createElement("div");
		this.domNode.appendChild(this.editorNode);
		this.editor = new dijit.Editor({height: parseInt(this.height), plugins: this.plugins}, this.editorNode);
		this.onLoad();
		return this.editor;
	},
	onLoad: function() {
		this._ready = true;
		this._cupdating = false;
		this.sizeEditor();
		this.connect(this.editor, "onFocus", this, function() {dojo.addClass(this.editorNode, "Focused");});
		this.connect(this.editor, "onBlur", this, function() {dojo.removeClass(this.editorNode, "Focused");});
		this.editor.set("value", this.dataValue || "");
		if (this.editor.focusNode) {
      this.updateFocusNode();
		} else {
			this.connect(this.editor, "onLoad", this, "updateFocusNode");
		}
	},
	updateFocusNode: function(){
		this.editor.focusNode.style.lineHeight = "12px"; // needed for safari... 
		this.editor.focusNode.style.overflow = "auto";
	},
	isReady: function() {
  	return Boolean(this._ready && this.editor && this.editor.focusNode);
	},
	setDisabled: function() {
    wm.logging && console.warn("wm.RichText.setDisabled is not supported");
	},
	getEditorValue: function() {
		try {
  		    var result =  this.inherited(arguments);
		    if (result.match(/^\s*\<.*\>\s*$/) && !result.match(/\>\w/)) result = "";
		    return result;
		} catch(e) {
		}
		return this.dataValue;
	},
	_setEditorAttempts: 0,
	setEditorValue: function(inValue) {
    if (this.editor && !this.editor.isLoaded){
			this.editor.onLoadDeferred.addCallback(dojo.hitch(this, 'setEditorValue', inValue));
		  return;
		}
		
		if (inValue === null || inValue === undefined) 
  		inValue = "\n\n";
		if (dojo.isString(inValue)) 
	 	  inValue += "";
		try {
		  this.editor.set('value', inValue);
		  this.updateReadonlyValue(inValue);
		} catch (e) {
		  console.warn("setEditorValue Failed: " + e);
		}
	}
 });
 
 
 wm.Object.extendSchema(wm.RichText, {
	changeOnEnter: { ignore: 1 },
	changeOnKey: { ignore: 1 },
	password: {ignore: 1},
	emptyValue: {ignore: 1},
	regExp: {ignore: 1},
	invalidMessage: {ignore: 1},
	maxChars: {ignore: 1},
	singleLine: {ignore: 1},
	tooltipDisplayTime: {ignore: 1},
	disabled: {ignore: 1},
	promptMessage: {ignore: 1},
	displayValue: {ignore: 1},
	toolbarUndo: {group: "toolbar", order: 1, shortname: "undo"},
	toolbarStyle: {group: "toolbar", order: 2, shortname: "styles"},
	toolbarStyleAll: {group: "toolbar", order: 3, shortname: "more styles"},
	toolbarAlign: {group: "toolbar", order: 4, shortname: "align"},
	toolbarList: {group: "toolbar", order: 5, shortname: "lists"},
	toolbarLink: {group: "toolbar", order: 6, shortname: "link"},
	toolbarFont: {ignore: 1},
     toolbarFont: {group: "toolbar", order: 7, shortname: "font"},
	toolbarColor: {group: "toolbar", order: 8, shortname: "color"}
 });
 
 wm.RichText.extend({
	setToolbarUndo:function(val) {
		this.toolbarUndo = val;
		this.updatePlugins();
		this.createEditor();
	},
	setToolbarStyle:function(val) {
		this.toolbarStyle = val;
		this.updatePlugins();
		this.createEditor();
	},
	setToolbarStyleAll:function(val) {
		if (val) this.toolbarStyle = true;
		this.toolbarStyleAll = val;
		this.updatePlugins();
		this.createEditor();
	},
	setToolbarAlign:function(val) {
		this.toolbarAlign = val;
		this.updatePlugins();
		this.createEditor();
	},
	setToolbarList:function(val) {
		this.toolbarList = val;
		this.updatePlugins();
		this.createEditor();
	},
	setToolbarLink:function(val) {
		this.toolbarLink = val;
		this.updatePlugins();
		this.createEditor();
	},
	setToolbarFont:function(val) {
		this.toolbarFont = val;
		this.updatePlugins();
		this.createEditor();
	},
	setToolbarColor:function(val) {
		this.toolbarColor = val;
		this.updatePlugins();
		this.createEditor();
	}
 });