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
dojo.require("wm.base.widget.Box");
dojo.provide("wm.base.widget.EditArea");

//wm.loadModule("edit_area/edit_area_loader");

dojo.declare("wm.EditArea", wm.Box, {
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
		n.id = this.getRuntimeId();
		this.domNode.appendChild(this.textAreaNode);
		this.textAreaDom = new wm.DomNode(this.textAreaNode);
		this._startHandle = new dojo.Deferred();
	},
	getScrim: function() {
		if (!this._scrim) {
		    this._scrim = new wm.Scrim({owner: this});
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
		if (this.isReallyShowing()) {
			if (!this.isStarted())
				this.initEdit();
			else
				this.resize();
		}
	},
	initEdit: function() {
		var id = this.getRuntimeId();
		if (this._editAreaInitialized)
			return;
		this.getScrim().setShowing(true);
		editAreaLoader.init({
			id: id, // id of the textarea to transform
			start_highlight: true, // if start with highlight
			word_wrap:true,
			allow_resize: "no",
			allow_toggle: false,
			language: "en",
			syntax: this.syntax,
			toolbar: " ",
			cursor_position:"auto",
			replace_tab_by_spaces: 2,
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
		var id = this.getRuntimeId();
		this._editAreaInitialized = false;
		editAreaLoader.delete_instance(id);
		window.area = null;
	},
	isStarted: function() {
		return Boolean(this.area && this.area.textarea && this._editAreaInitialized && this._isStarted);
	},
	resize: function() {
		if (this.isStarted()) {
			try{
				this.off();
				this.textAreaDom.setBox(this.getContentBounds());
				this.on();
			}catch(x){
			}
		} 
		/*else if (this.area)
			setTimeout(dojo.hitch(this, "resize"), 100);*/
	},
	getText: function() {
		if (this.isStarted())
			return editAreaLoader.getValue(this.area.textarea.id);
		else
			return this.textAreaNode.value;
	},
	setText: function(inText) {
		if (this.isStarted()) {
			// FIXME: get exception due to editArea focus attempt when setting text and
			// not really showing
			if (this.isReallyShowing())
				editAreaLoader.setValue(this.area.textarea.id, inText);
			else {
				this.off();
				this.textAreaNode.value = inText;
			}
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
		this.getScrim().setShowing(false);
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
			return window.frames["frame_" + this.getRuntimeId()];
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
	}
});