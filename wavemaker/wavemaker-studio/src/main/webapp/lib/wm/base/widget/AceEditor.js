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


// https://github.com/ajaxorg/ace/wiki/Embedding---API
dojo.provide("wm.base.widget.AceEditor");


dojo.declare("wm.AceEditor", wm.Control, {
    // design mode property
    scrim: true,

    minWidth: "300",
    minHeight: "150",

    // Access to bespin objects
    _editor: null,
    _env: null,

    // bespin props
    syntax: "javascript", // useful options: javascript, css, html, java, xml
    theme: "clouds", // to use this, you must load or build in other themes; see Makefile.dryice.js to see how to build it in
    fontSize: "10",
    fontFace: "Monaco, Lucida Console, monospace",
    dataValue: "dojo.declare('myclass', null, {\n});",
    tabSize: 4,

    // wm.Control props
    width: "100%",
    height: "200px",
    margin: "6",
    //libPrefix: "lib/github/ace/", 
    libPrefix: "app/lib/ace/", 
    init: function() {
	var head = document.getElementsByTagName("head")[0];
	if (!wm.AceEditor.libraryLoading) {
	    wm.AceEditor.libraryLoading = true;
	    var script = document.createElement("script");
	    var prefix = this.libPrefix;
	    if (prefix.indexOf("lib/") == 0) {
		prefix = dojo.moduleUrl("lib").path + prefix.substring(4);
	    }
	    script.src = prefix + ((djConfig.isDebug || dojo.isIE == 8) ? "ace-uncompressed.js" : "ace.js");
	    head.appendChild(script);
	}
	this.inherited(arguments);
	this.waitForLibraryLoad();
    },
    waitForLibraryLoad: function() {
	if (window.ace && window.requireace && dojo.isDescendant(this.domNode, document.body)) {
	    this._editor = ace.edit(this.domNode.id);
	    this._editor.owner = this;
	    var mode = window.requireace("ace/mode/" + this.syntax).Mode;
	    this._editor.getSession().setMode(new mode());
	    this._editor.getSession().on('change', dojo.hitch(this, "_change"));
	    this._editor.getSession().on('changeSelection', dojo.hitch(this, "_changeSelection"));
	    this._editor.getSession().on('changeCursor', dojo.hitch(this, "_changeCursor"));
	    this.setTheme(this.theme);
	    if (this.dataValue)
		this.setDataValue(this.dataValue);
	} else {
	    window.setTimeout(dojo.hitch(this, "waitForLibraryLoad"), 100);
	}
    },
    postInit: function() {
	this.inherited(arguments);
	this.connect(this.domNode, "onkeydown", this, "handleKeyDown");
    },
    reservedCtrlKeys: ["a","c","v","x"],

    handleKeyDown: function(e) {

	/* !e.altKey because on italian keyboards, "}" is Alt-Shift-"]", which comes up in the dom
	 * event as e.ctrlKey: true, e.altKey: true, and then we call stopEvent on it and user's can't
	 * type "}"
	 */
	if (e.ctrlKey && app._keys[e.keyCode] != "CTRL" && !e.altKey) {
	    if (dojo.indexOf(this.reservedCtrlKeys, app._keys[e.keyCode]) == -1) {
		this.onCtrlKey(app._keys[e.keyCode], e.shiftKey);
		dojo.stopEvent(e);
	    }
	}
    },
        onCtrlKey: function(letter) {
	},

    focus: function() {
	if (this._editor)
	    this._editor.focus();
    },
    blur: function() {
	if (this._editor)
	    this._editor.blur();
    },
    setSyntax: function(inSyntax) {
	this.syntax = inSyntax;
	if (this._editor) {
	    var mode = window.requireace("ace/mode/" + this.syntax).Mode;
	    this._editor.getSession().setMode(new mode());
	}
    },
    setTheme: function(inTheme) {
	if (this._editor)
	    this._editor.setTheme("ace/theme/" + inTheme);
    },
    renderBounds: function() {
	this.inherited(arguments);
	if (this._editor)
	    this._editor.resize();
    },
    // setText method is here for EditArea compatibility
    setText: function(inValue){ 
	this.setDataValue(inValue);
    }, 
    setDataValue: function(inValue) {
	this.dataValue = inValue || ""; // we use this.dataValue in case we get a value before the editor has loaded/initialized
	this._cachedDataValue = this.dataValue;
	if (this._editor) {
	    this._editor.getSession().setValue(this.dataValue);
	}
    },
    updateIsDirty: function() {
	var dataValue = this.getDataValue();
	var wasDirty = this.isDirty;
	var isDirty = true;
	if (!dataValue && !this._cachedDataValue)
	    isDirty = false;
	else
	    isDirty = dataValue != this._cachedDataValue;
	if (isDirty != wasDirty) {
	    this.valueChanged("isDirty", this.isDirty = isDirty);
	    wm.fire(this.parent, "updateIsDirty");
	}
    },
    clearDirty: function() {
	this._cachedDataValue = this.dataValue;
    },
    reset: function() {
	this.setDataValue(this._cachedDataValue);
    },
    getText: function() {return this.getDataValue();}, // for EditArea compatibility
    getDataValue: function() {
	if (this._editor) 
	    this.dataValue = this._editor.getSession().getValue();
	return this.dataValue;
    },
    getSelectedText: function() {
	if (this._editor)
	    return this._editor.getSession().doc.getTextRange(this._editor.getSelectionRange());
    },
    getSelectionRange: function() {
	if (this._editor)
	    return this._editor.getSelectionRange();
	return {end:{column:0,row:0},start:{column:0,row:0}};
    },
    setSelectionRange: function(startRow, startColumn, endRow, endColumn) {
	if (this._editor)
	    this._editor.getSelection().setSelectionRange({start: {row: startRow, column: startColumn},
							   end: {row: endRow, column: endColumn}});
    },
    setCursorPosition: function(row, column) {
	if (this._editor)
	    this._editor.moveCursorTo(row,column);
    },
    setCursorPositionInText: function(index) {
	if (this._editor) {
	    var text = this.getDataValue();
	    text = text.substring(0,index);
	    var rows = text.split(/\n/);
	    this.setCursorPosition(rows.length-1, wm.Array.last(rows).length);
	}
    },
    getPositionInText: function() {

	var range = this.getSelectionRange();
	var text = this.getDataValue();
	var startRowNumb = range.start.row;
	var currentRowNumb = 0;
	for (var i = 0; i < text.length; i++) {
	    if (text[i] == "\n") currentRowNumb++;
	    if (currentRowNumb >= startRowNumb) break;
	}
	return i + range.start.column;
    },
    selectCurrentBlock: function() {
	var startCharIndex = this.getPositionInText();
	var startBlockIndex, endBlockIndex;
	var braceCount = 0;
	var text = this.getDataValue();
	
	// find the start of the block
	for (var i = startCharIndex; i >= 0; i--) {
	    if (text[i] == "{") {
		braceCount++;
		if (braceCount > 0) {
		    startBlockIndex = i;
		    break;
		}
	    } else if (text[i] == "}") {
		braceCount--; // likely to go negative
	    }
	}
	
	// find the end of the block
	var length = text.length;
	braceCount = 0;
	for (var i = startCharIndex; i < length; i++) {
	    if (text[i] == "}") {
		braceCount++;
		if (braceCount > 0) {
		    endBlockIndex = i;
		    break;
		}
	    } else if (text[i] == "{") {
		braceCount--;
	    }
	}
	if (startBlockIndex !== undefined && endBlockIndex !== undefined) {
	    var startRowData = text.substring(0,startBlockIndex).split(/\n/);
	    var startRow = startRowData.length-1;
	    var startColumn = startRowData[startRowData.length-1].length;

	    var endRowData = text.substring(0,endBlockIndex).split(/\n/);
	    var endRow = endRowData.length-1;
	    var endColumn = endRowData[endRowData.length-1].length+1;
	    this.setSelectionRange(startRow, startColumn, endRow, endColumn);
	}

    },
    replaceSelectedText: function(inText) {
	if (this._editor)
	    this._editor.insert(inText);
    },
    setLineNumber: function(inNumber) {
	if (this._editor)
	    this._editor.gotoLine(parseInt(inNumber));
    },
    promptGotoLine: function() {
	app.prompt("Enter line number:", this._editor.getCursorPosition().row + 1, dojo.hitch(this, function(inResult) {
	    this.setLineNumber(inResult);
	    this.focus();
	}));
    },

    find: function(inText, isRev) {
	if (this._editor) {
	    this._editor.find(inText, {
		backwards: Boolean(isRev),
		wrap: true,
		caseSensitive: false,
		wholeWord: false,
		regExp: false
	    });
	    if (isRev)
		this._editor.findPrevious();
	}
    },
    findRegex: function(inText, isRev) {
	if (this._editor) {
	    this._editor.find(inText, {
		backwards: Boolean(isRev),
		wrap: true,
		caseSensitive: true,
		wholeWord: false,
		regExp: true
	    });
	}
    },
    /* You must have called find or findRegex before calling replace! */
    replace: function(inNewText) {
	if (this._editor) {
	    this._editor.replace(inNewText);
	    this._editor.findNext();
	}
    },
    replaceAll: function(inNewText) {
	if (this._editor) {
	    this._editor.replaceAll(inNewText);
	}
    },
    getCursorPosition: function() {
	if (this._editor) {
	    return this._editor.getCursorPosition();
	} else {
	    return {row: 0, column: 0};
	}
    },


    getTextBeforeCursor: function(getSingleTerm) {
	var position = this.getCursorPosition();
	var text = dojo.trim(this.getDataValue().split(/\n/)[position.row].substring(0,position.column))
	if (getSingleTerm) {
	    text = text.replace(/^.*[^a-zA-Z0-9.]/,"");
	}
	return text;
    },

    setWordWrap: function(inWrap) {
	if (this._editor)
	    this._editor.getSession().setUseWrapMode(inWrap);
    },
    toggleWordWrap: function() {
	if (this._editor) 
	    this._editor.getSession().setUseWrapMode(!this._editor.getSession().getUseWrapMode());
    },

    hasJavascriptErrors: function() {
	if (!this._editor || !this._editor.session || !this._editor.session.$annotations) return false;
	for (lines in this._editor.session.$annotations) {
	    var line = this._editor.session.$annotations[lines];
	    for (annotation in line) {
		if (line[annotation].type == "error")
		    return line[annotation].text;
	    }
	}
	return false;
    },

    showHelp: function() {
	if (!wm.AceEditor.helpDialog) {
	    var d = wm.AceEditor.helpDialog = new wm.Dialog({owner: app,
							     name: "AceHelpDialog",
							     title: "Editor Help",
							     corner: "tl",
							     width: "220px",
							     height: "350px",
							     useContainerWidget: true,
							     modal: false});
	    var helpHtml = new wm.Html({owner: d,
					parent: d.containerWidget,
					width: "100%",
					height: "100%"});
	    helpHtml.setHtml("<table>" +
			     "<tr><td>Ctrl-L</td><td>Goto Line</td></tr>" +
			     "<tr><td>Ctrl-7</td><td>Toggle Comment Selected Line</td></tr>" +
			     "<tr><td>Ctrl-L</td><td>Goto Line</td></tr>" +
			     "<tr><td>Ctrl-F</td><td>Find</td></tr>" +
			     "<tr><td>Ctrl-R</td><td>Replace</td></tr>" +
			     "<tr><td>Alt-UP</td><td>Move Line Up</td></tr>" +
			     "<tr><td>Alt-DOWN</td><td>Move Line Down</td></tr>" +
			     "<tr><td>CTRL-S</td><td>Save project</td></tr>" +
			     "<tr><td>CTRL-I</td><td>Reformat code (adjusts indentation)</td></tr>" +
			     "<tr><td nowrap>CTRL-PERIOD</td><td>Open autocompletion dialog (when editting javascript only)</td></tr>");
	}
	wm.AceEditor.helpDialog.show();
    },

    showSearch: function() {
	if (!this._searchDialog) {
	    this._searchDialog = new wm.Dialog({owner: this,
						width: "350px",
						height: "150px",
						title: "Search and Replace",
						corner: "tc",
						useContainerWidget: true,
						useButtonBar: true,
						modal: false,
						onClose: dojo.hitch(this, "focus")}); // this could cause trouble if closing dialog when viewing another layer
	    this._searchEditor = new wm.Text({owner: this,
					      parent: this._searchDialog.containerWidget,
					      name: "searchEditor",
					      caption: "Search",
					      captionSize: "100px",
						 captionAlign: "left",
					      width: "100%",
					      onEnterKeyPress: dojo.hitch(this, "onFindClick")});
	    
	    this._searchEditor.editor.set("selectOnClick",true);
	    var checkboxPanel = new wm.Panel({owner: this,
					     parent: this._searchDialog.containerWidget,
					     name: "checkboxPanel",
					     layoutKind: "left-to-right",
					     height: "20px",
					     width: "100%",
					     horizontalAlign: "left",
					     verticalAlign: "top"}); 
	    this._regexEditor = new wm.Checkbox({owner: this,
						 parent: checkboxPanel,
						 name: "regexEditor",
						 caption: "RegExp",
						 captionAlign: "left",
						 captionSize: "100px",
						 width: "100%"});
	    this._isRevEditor = new wm.Checkbox({owner: this,
						 parent: checkboxPanel,
						 name: "revEditor",
						 caption: "Reverse",
						 captionSize: "147px",
						 width: "100%"});
	    this._replaceEditor = new wm.Text({owner: this,
					      parent: this._searchDialog.containerWidget,
					      name: "replaceEditor",
					      caption: "Replace",
					      captionSize: "100px",
						 captionAlign: "left",
					       width: "100%",
					      onEnterKeyPress: dojo.hitch(this, "onReplaceClick")});
/*
	    var buttonPanel =  new wm.Panel({owner: this,
					     parent: this._searchDialog.containerWidget,
					     name: "buttonPanel",
					     layoutKind: "left-to-right",
					     height: "40px",
					     width: "100%",
					     horizontalAlign: "right",
					     verticalAlign: "bottom"});
					     */
	    this._findButton = new wm.Button({owner: this,
					      parent: this._searchDialog.buttonBar,
					      name: "findButton",
					      caption: "Find",
					      width: "100px",
					      onclick: dojo.hitch(this, "onFindClick")});
	    this._replaceButton = new wm.Button({owner: this,
					      parent: this._searchDialog.buttonBar,
					      name: "replaceButton",
					      caption: "Replace",
						 width: "100px",
					      onclick: dojo.hitch(this, "onReplaceClick")});
	    this._replaceAllButton = new wm.Button({owner: this,
					      parent: this._searchDialog.buttonBar,
					      name: "replaceAllButton",
					      caption: "Replace All",
					      width: "100px",
						    onclick: dojo.hitch(this, "onReplaceAllClick")});
	    this._searchDialog.connect(this._searchDialog, "onShow", this._searchEditor, "selectText");
	}
	this._searchDialog.show();
	this._searchEditor.focus();
    },
    onFindClick: function() {
	var searchText = this._searchEditor.getDataValue();
	var isRev = this._isRevEditor.getChecked();
	if (this._regexEditor.getChecked()) {
	    this.findRegex(searchText, isRev);	    
	} else {
	    this.find(searchText, isRev);
	}
    },
    onReplaceClick: function() {
	if (this.getSelectedText().toLowerCase() == this._searchEditor.getDataValue().toLowerCase()) {
	    this.replaceSelectedText(this._replaceEditor.getDataValue()); 
	}
	this.onFindClick();
    },
    onReplaceAllClick: function() {
	this.onFindClick();
	this.replaceAll(this._replaceEditor.getDataValue());
    },

    _change: function() {
	this.updateIsDirty();
	this.onChange(this.getDataValue());
    },
    _changeSelection: function() {
	this.onChangeSelection(this.getSelectedText());
    },
    _changeCursor: function() {
	this.onChangeCursor();
    },
    onChange: function(newValue) {
	//console.log("VALUE:"+newValue);
    },
    onSelectionChange: function(newSelection) {
    },
    onCursorChange: function() {
    },
    _end:0
});
wm.AceEditor.libraryLoading = false;

wm.Object.extendSchema(wm.AceEditor, {
    dataValue: {ignore: 1, bindable: 1, group: "editData", order: 3, simpleBindProp: true, type: "String"}
});