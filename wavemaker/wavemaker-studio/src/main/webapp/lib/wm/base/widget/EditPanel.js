/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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
        mobileHeight: "40px",
        enableTouchHeight: true,
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
	},

        setThemeStyleType: function(inType) {
	    return wm.Container.prototype.setThemeStyleType.call(this, inType);
	},
        getThemeStyleType: function(inType) {
	    return wm.Container.prototype.getThemeStyleType.call(this, inType);
	}
});
