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

dojo.provide("wm.base.widget.EditArea");

//wm.loadModule("edit_area/edit_area_loader");

dojo.declare("wm.EditArea", wm.Control, {
    wordWrap: true,
    _forceShowing: true,
	scrim: true,
	syntax: "js",
	_scrim: null,
	build: function() {
		this.domNode = dojo.byId(this.domNode||undefined);
		if (!this.domNode)
			this.domNode = document.createElement('div');
		var n = this.textAreaNode = document.createElement('textarea');
		// defeat default textArea border /padding
		n.style.border = n.style.padding = 0;
		n.style.width = "100%";
		n.style.height = "100%";
	    n.id = this.getRuntimeId().replace(/\s/g,"_");
		this.domNode.appendChild(this.textAreaNode);
		this.textAreaDom = new wm.DomNode(this.textAreaNode);
		this._startHandle = new dojo.Deferred();
	},

	getScrim: function() {
		if (!this._scrim) {
		    this._scrim = new wm.Scrim({owner: this});
		    this.domNode.appendChild(this._scrim.domNode);
		}
		return this._scrim;
	},
	isOn: function() {
		var id = this.area.textarea.id;
		return editAreas && (editAreas[id] ||0)["displayed"];
	},
	isReallyShowing: function() {
		return wm.widgetIsShowing(this);
	},
	on: function() {
		this.toggle(true);
	},
	off: function() {
		this.toggle(false);
	},
	toggle: function(inOn) {
		if (this.isStarted()) {
			try{
				editAreaLoader.toggle(this.area.textarea.id, inOn ? "on" : "off");
				// unfocus to avoid problem when hiding entire widget
				if (!inOn)
					this.area.textarea.blur();
			}catch(x){
			}
		}
	},
	_onShowParent: function(){
		this.render();
	},
	render: function() {
		this.inherited(arguments);
		if (!this._cupdating && this.isReallyShowing()) {
			if (!this.isStarted())
				this.initEdit();
			else
				this.resize();
		}
	},
        renderBounds: function() {
	    this.inherited(arguments);
	    var node = dojo.byId("frame_" + this.getRuntimeId().replace(/\./g,"_"));
	    if (!node)
		return;
	    var style = node.style;
	    var bounds = this.getBounds();
	    style.top = bounds.t + "px";
	    style.left = bounds.l + "px";
	    style.width = bounds.w + "px";
	    style.height = bounds.h + "px";
	},
	initEdit: function() {
	    var id = this.getRuntimeId().replace(/\./g,"_");
	    console.log("initEdit: " + id);
		if (this._editAreaInitialized)
			return;
		this.getScrim().setShowing(true);
		editAreaLoader.init({
			id: id, // id of the textarea to transform
			start_highlight: true, // if start with highlight
		    word_wrap:this.wordWrap,
			allow_resize: "no",
			allow_toggle: false,
			language: "en",
			syntax: this.syntax,
			toolbar: " ",
			cursor_position:"auto",
			replace_tab_by_spaces: 4,
			callSave: dojo.hitch(this, 'saveScript'),
			EA_init_callback: this.getRuntimeId() + "._onStarted",
			EA_load_callback: this.getRuntimeId() + "._onLoaded"
		});
		this.area = editAreas[id];
		//this.resize();
		this._editAreaInitialized = true;
	},
	deleteEdit: function() {
		if (!this._editAreaInitialized)
			return;
		this.off();
		this._startHandle = new dojo.Deferred();
	        var id = this.getRuntimeId().replace(/\./g,"_");
		this._editAreaInitialized = false;
		editAreaLoader.delete_instance(id);
		window.area = null;
	},
	isStarted: function() {
		return Boolean(this.area && this.area.textarea && this._editAreaInitialized && this._isStarted && this._isLoaded);
	},
	resize: function() {
		if (this.isStarted()) {
			try{
				this.off();
				this.textAreaDom.setBox(this.getContentBounds());
				this.on();
			    wm.job(this.getRuntimeId() + "resize", 20, dojo.hitch(this, function() {
				if (this.isReallyShowing()) 
				    this.focus();
			    }));
			}catch(x){
			}
		} 
		/*else if (this.area)
			setTimeout(dojo.hitch(this, "resize"), 100);*/
	},
        focus: function() {
	    if (this.area && this.area.textarea)
		this.area.textarea.focus();
	},
        blur: function() {},
        getDataValue: function() {return this.getText();},
	getText: function() {
		if (this.isStarted())
			return editAreaLoader.getValue(this.area.textarea.id);
		else
			return this.textAreaNode.value;
	},
        setDataValue: function(inText) {this.setText(inText);},
	setText: function(inText) {
		if (this.isStarted()) {
		    // FIXME: get exception due to editArea focuswe attempt when setting text and
			// not really showing

// if statement bad because getText gets from different place than we set in the else clause
//			if (this.isReallyShowing())
				editAreaLoader.setValue(this.area.textarea.id, inText);
		    if (this.isReallyShowing()) {
			this.off();
			this.on();
		    }

/*			else {
				this.off();
				this.textAreaNode.value = inText;
			}*/
			this.resetUndo();
		} else
		    this.textAreaNode.value = inText;
	},
	setSelectionRange: function(inStart, inEnd) {
		if (this.isStarted()) {
			inStart = inStart || 0;
			inEnd = inEnd !== undefined ? inEnd : inStart;
			editAreaLoader.setSelectionRange(this.area.textarea.id, inStart, inEnd);
		}
	},
	// FIXME: edit area does not have native support for resetting undo state,
	// so add it (we need this so that we can control when newly set text cannot be undone)
	resetUndo: function() {
		var f = this.getEditFrame(), area = f && f.editArea;
		if (area) {
			area.previous = [];
			area.next = [];
			area.last_undo = "";
		}
	},
	_onStarted: function() {
	    this._isStarted = true;
		setTimeout(dojo.hitch(this, function() {
			//this.resize();
			this._startHandle && this._startHandle.callback(true);
		}), 1);
	},
	_onLoaded: function() {
	    this._isLoaded = true;
	    dojo.byId("frame_" + this.getRuntimeId().replace(/\./g,"_")).style.position = "absolute";
	    this.editorStarted();
	    this.renderBounds();
	    this.getScrim().setShowing(false);
	    if (this.textAreaNode.value != this.getText())
		this.setText(this.textAreaNode.value); // strange timing error causes this to happen

/* This stupid hack forces a refocus which is needed for FF 3.6 to show the cursor */
	    var tmp = document.createElement("input");
	    tmp.type = "text";
	    this.parent.domNode.appendChild(tmp);
	    tmp.focus();
	    dojo.destroy(tmp);
	    this.focus();
/* End stupid hack */
	},
	callAfterStarted: function(inFunction) {
		if (!dojo.isFunction(inFunction))
			return;
		if (!this.isStarted() && this._startHandle) {
			this._startHandle.addCallback(inFunction);
		} else
			inFunction();
	},
	getEditFrame: function() {
		// get the iframe for the editor... using Edit Area method
		if (this.isStarted())
		    return window.frames["frame_" + this.getRuntimeId().replace(/\./g,"_")];
	},
	setSyntax: function(inSyntax) {
		this.syntax = inSyntax;
		if (this.isStarted())
			editAreaLoader.execCommand(this.area.textarea.id, "change_syntax", this.syntax);
	},
	saveScript: function(e){
		if (studio)
			studio.saveScriptClick();
		dojo.stopEvent(e);
	},
    promptGotoLine: function() {
	app.prompt(studio.getDictionaryItem("wm.EditArea.ENTER_LINE_NUMBER"), 0, dojo.hitch(this, function(inValue) {this.goToLine(inValue);}));
    },
    goToLine: function(inLineNumber, selectLine) {
	editAreaLoader.execCommand(this.area.textarea.id, "go_to_line", String(inLineNumber));
	if (selectLine) {
	    var start = editAreaLoader.getSelectionRange(this.area.textarea.id).start;
	    var end = this.getText().indexOf("\n", start);
	    if (end == -1)
		end = this.getText().indexOf("\r", start);
	    if (end == -1) return;
	    this.setSelectionRange(start,end);
	}
    },
    getSelectedText: function() {
	var range = editAreaLoader.getSelectionRange(this.area.textarea.id);
	var start = range.start;
	var end = range.end;
	var text = this.getText();
	return text.substring(start,end);
    },
    getTextBeforeCursor: function(selectText) {
	var range = editAreaLoader.getSelectionRange(this.area.textarea.id);
	var start = range.start;
	var text = this.getText().substring(0,start);
	var lines = text.split(/\n/);
	var text = lines[lines.length-1].match(/\S*$/)[0];
	if (selectText)
	    this.setSelectionRange(start-text.length,start);
	return text;
    },
    replaceSelectedText: function(newtext) {
	var range = editAreaLoader.getSelectionRange(this.area.textarea.id);
	var start = range.start;
	var end = range.end;
	var text = this.getText();
	text = text.substring(0,start) + newtext + text.substring(end);
	this.setText(text);
	this.setSelectionRange(start,start+newtext.length);

    },
    setCursorPosition: function(row, column) {
	this.gotoLine(row, false);
	/* Column doesn't yet work */
    },
    toggleWordWrap: function() {
	this.wordWrap = !this.wordWrap;
	editAreaLoader.execCommand(this.area.textarea.id, "set_word_wrap", this.wordWrap);
    },
    setWordWrap: function(inWrap) {
	this.wordWrap = inWrap;
	editAreaLoader.execCommand(this.area.textarea.id, "set_word_wrap", inWrap);
    },
    showHelp: function() {
	editAreaLoader.execCommand(this.area.textarea.id, "show_help",1);
    },
    showSearch: function() {
	editAreaLoader.execCommand(this.area.textarea.id, "show_search",1);
    },
	editorStarted: function() {
		var f = this.getEditFrame();

		if (f)
		    this.connect(f.document, "keydown", this, "keydown");

	},
    reservedCtrlKeys: ["a","c","v","x"],
	keydown: function(e) {
	    if (e.ctrlKey && app._keys[e.keyCode] != "CTRL") {
		if (dojo.indexOf(this.reservedCtrlKeys, app._keys[e.keyCode]) == -1) {
		    this.onCtrlKey(app._keys[e.keyCode]);
		    dojo.stopEvent(e);
		}
	    } else {
		if (this._keydownTimeout) window.clearTimeout(this._keydownTimeout);
		this._keydownTimeout = wm.job(this.getRuntimeId() + "onKeyDown", 100, dojo.hitch(this, function() {
		    this.onChange();
		}));

	    }
	    
	},
    onChange: function() {},
        onCtrlKey: function(letter) {

	},
    destroy: function() {
	this.deleteEdit();
	this.inherited(arguments);
    }
});
