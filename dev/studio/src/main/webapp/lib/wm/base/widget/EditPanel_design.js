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

dojo.provide("wm.base.widget.EditPanel_design");
dojo.require("wm.base.widget.EditPanel");


wm.EditPanel.description = "Controls for editing a form.";

wm.Object.extendSchema(wm.EditPanel, {
	addControls: { group: "operation", order: 7},
	removeControls: { group: "operation", order: 8},
	liveForm: { group: "common", order: 200},
	savePanel: {ignore: 1, writeonly: 1},
	operationPanel: {ignore: 1, writeonly: 1},
	formUneditable: {ignore: 1, bindSource: 1},
    formInvalid: {ignore: 1, bindSource: 1}

});

wm.EditPanel.extend({
	addControls: "(addControls)",
	removeControls: "(removeControls)",
	_defaultClasses: {domNode: ["wm_Padding_4px"]},
        //_buttonWidth: "100px",
	designCreate: function() {
		this.inherited(arguments);
		this.subscribe("wmwidget-idchanged", this, "widgetNameChanged");
		
	},
	//FIXME: fix potential bad controls info caused by copy/paste
	// requirement (currently necessitated only for copy /paste)
	// is that op/save panels must be children of this editPanel
	designPasted: function() {
		if (!this._controlsOk())
			this._resetContents();
	},
	_resetContents: function() {
		this.setLiveForm("");
		this._unsetControls();
		wm.forEach(this.widgets, function(w) {
			w.destroy();
		});
	},
	_unsetControls: function() {
		this.operationPanel = this.savePanel = null;
	},
	_createSavePanel: function() {
		var
	    props = {showing: false, layoutKind: "left-to-right", horizontalAlign: "right", verticalAlign: "top", width: "100%", height: "100%", border: "0"},
			p = this.owner.loadComponent("savePanel1", this, "wm.Panel", props);
		this.savePanel = p.getId();
		//
		var
			n = this.getId(),
			sb = this.owner.loadComponent("saveButton1", p, this.editPanelStyle, 
						      {caption: studio.getDictionaryItem("wm.EditPanel.SAVE_CAPTION")}, 
						      {onclick: n + ".saveData"});
		this.owner.loadComponent("cancelButton1", p, this.editPanelStyle, 
					 {caption: studio.getDictionaryItem("wm.EditPanel.CANCEL_CAPTION")}, 
					 {onclick: n + ".cancelEdit"});
		sb.$.binding.addWire("", "disabled", n + ".formInvalid");
		this.reflow();
	},
	_createOperationPanel: function() {
		var
	    props = {layoutKind: "left-to-right", horizontalAlign: "right", verticalAlign: "top", width: "100%", height: "100%", border: "0"},
			p = this.owner.loadComponent("operationPanel1", this, "wm.Panel", props);
		this.operationPanel = p.getId();
		//
		var n = this.getId();
		this.owner.loadComponent("newButton1", p, this.editPanelStyle, 
					 {caption: studio.getDictionaryItem("wm.EditPanel.NEW_CAPTION")}, 
					 {onclick: n + ".beginDataInsert"});
	        var u = this.owner.loadComponent("updateButton1", p, this.editPanelStyle, 
						 {caption: studio.getDictionaryItem("wm.EditPanel.UPDATE_CAPTION")}, 
						 {onclick: n + ".beginDataUpdate"});
		var d = this.owner.loadComponent("deleteButton1", p, this.editPanelStyle, 
						 {caption: studio.getDictionaryItem("wm.EditPanel.DELETE_CAPTION")}, 
						 {onclick: n + ".deleteData"});
		this.reflow();
		//
		u.$.binding.addWire("", "disabled", n + ".formUneditable");
		d.$.binding.addWire("", "disabled", n + ".formUneditable");
	},

	removeControls: function() {
	    if (confirm(studio.getDictionaryItem("wm.EditPanel.REMOVE_CONTROLS_CONFIRM", {name: this.getId()}))) {
			this._removeControls();
		}
	},
	_removeControls: function() {
		this._destroyControls();
		this.reflow();
		this.updateDesignTrees();
	},
	_destroyControls: function() {
		var o = this.getValueById(this.operationPanel);
		wm.fire(o, "destroy");
		var s = this.getValueById(this.savePanel);
		wm.fire(s, "destroy");
		this._unsetControls();
	},
	_addControls: function() {
		this._destroyControls();
		this._createSavePanel();
		this._createOperationPanel();
		this.setLock(true);
		this.updateControlsStatus();
		this.updateDesignTrees();
		this.reflow();
	},
	updateDesignTrees: function() {
		wm.fire(studio, "refreshVisualTree");
	},
	set_liveForm: function(inLiveForm) {
		this.setLiveForm(inLiveForm);
		var a = this.getValueById(this.liveForm);
		if (a) {
			if (!this.c$.length)
				this._addControls();
			a.setReadonly(true);
		}
	},
	getLiveFormNames: function() {
		var l = [""];
		wm.forEachWidget(studio.page.root, function(w) {
			if (w instanceof wm.LiveForm)
				l.push(w.getId());
		});
		return l;
	},
	widgetNameChanged: function(inOldId, inNewId, inOldRtId, inNewRtId) {
		var monitored = {
			"operationPanel": 1,
			"savePanel": 1,
			"liveForm": 1
		};
		for (var i in monitored)
			if (this[i] == inOldId)
				this[i] = inNewId;
	},
	// check if save / operation panels are children
	// (if they are not, then we assume controls are not setup properly)
	_controlsOk: function() {
		var
			op = this.getValueById(this.operationPanel),
			sp = this.getValueById(this.savePanel);
		return ((!op || op.parent == this) && (!sp || sp.parent == this));
	},
	makePropEdit: function(inName, inValue, inDefault) {
	    var prop = this.schema ? this.schema[inName] : null;
	    var name =  (prop && prop.shortname) ? prop.shortname : inName;
		switch (inName) {
			case "addControls":
			case "removeControls":
				return makeReadonlyButtonEdit(name, inValue, inDefault);
			case "liveForm":
				return makeSelectPropEdit(inName, inValue, this.getLiveFormNames(inValue), inDefault);
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "addControls":
				return this._addControls();
			case "removeControls":
				return this.removeControls();
		}
		return this.inherited(arguments);
	}
});