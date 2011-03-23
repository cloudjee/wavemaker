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
dojo.provide("wm.base.widget.EditPanel");

dojo.declare("wm.EditPanel", wm.Panel, {
	border: "0",
	operationPanel: "",
	savePanel: "",
	liveForm: "",
	layoutKind: "top-to-bottom",
        verticalAlign: "top",
        horizontalAlign: "right",
	lock: true,
	formUneditable: false,
	formInvalid: true,
	width: "100%",
	height: "40px",
        editPanelStyle: "wm.Button",
        isCustomized: false,
	destroy: function() {
		this._unsubscribeLiveForm();
		this.inherited(arguments);
	},
	init: function() {
		this.inherited(arguments);
		this.setLiveForm(this.liveForm);
		this.updateControlsStatus();                
	},
        setLock: function(inValue) {
            this.inherited(arguments);
            if (!inValue)
                this.isCustomized = true;
        },
	loaded: function() {
		this.inherited(arguments);
		if (wm.pasting)
			wm.fire(this, "designPasted");
	},
	setLiveForm: function(inLiveForm) {
		if (inLiveForm instanceof wm.Component)
			inLiveForm = inLiveForm.getId();
		this.liveForm = inLiveForm;
		this._subscribeLiveForm();
	},
	_subscribeLiveForm: function() {
		this._unsubscribeLiveForm();
		var c = this._liveFormSubscriptions = [];
		var w = this._liveFormWires = [];
		if (this.liveForm) {
			// update control status when liveForm dataSet changes
			var form = this.getValueById(this.liveForm);
			c.push(dojo.connect(form, "setDataSet", this, "updateControlsStatus"));
			c.push(dojo.connect(form, "beginEdit", this, "_beginEdit"));
			c.push(dojo.connect(form, "endEdit", this, "_endEdit"));
			// liveForm wires.
			w.push(new wm.Wire({
				owner: this,
				targetId: this.getId(),
				targetProperty: "formInvalid",
				source: [this.liveForm, "invalid"].join(".")
			}).connectWire());
		}
	},
	_unsubscribeLiveForm: function() {
		dojo.forEach(this._liveFormSubscriptions, dojo.disconnect);
		dojo.forEach(this._liveFormWires, function(w) { wm.fire(w, "destroy")});
	},
	_beginEdit: function() {
		this._toggleEdit(true);
	},
	_endEdit: function() {
		this._toggleEdit(false);
	},
	_toggleEdit: function(inEdit) {
		wm.fire(this.getValueById(this.operationPanel), "setShowing", [!inEdit]);
		wm.fire(this.getValueById(this.savePanel), "setShowing", [inEdit]);
	},
	updateControlsStatus: function() {
		this.setValue("formUneditable", !wm.fire(this.getValueById(this.liveForm), "hasEditableData"));
	},
	beginDataInsert: function() {
		wm.fire(this.getValueById(this.liveForm), "beginDataInsert");
	},
	beginDataUpdate: function() {
		wm.fire(this.getValueById(this.liveForm), "beginDataUpdate");
	},
	deleteData: function() {
		wm.fire(this.getValueById(this.liveForm), "deleteData");
	},
	saveData: function() {
		wm.fire(this.getValueById(this.liveForm), "saveData");
	},
	cancelEdit: function() {
		wm.fire(this.getValueById(this.liveForm), "cancelEdit");
	}
});

//===========================================================================
// Design-time
//===========================================================================

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
		switch (inName) {
			case "addControls":
			case "removeControls":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
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