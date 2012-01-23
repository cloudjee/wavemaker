/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.LivePanel");
dojo.require("wm.base.widget.LiveForm");

dojo.declare("wm.LivePanel", wm.Panel, {
	height: "100%",
	width: "100%",
	layoutKind: "top-to-bottom",
	liveDataName: "",
        autoScroll: true,
    /* Whenever the LiveForm gets a successful response from the server, dismiss the dialog
     * and update the grid's data
     */
    popupLiveFormSuccess: function() {
	if (this.dialog) {
	    this.dialog.hide();
	} else if (this.gridLayer) {
	    this.gridLayer.activate();
	}
	this.dataGrid.getDataSet().update();
    },
    /* Whenever the LiveForm's variable sends a request, 
     * disable the save button until the variable's request is no longer inflight
     *
    popupLiveFormBeforeOperation: function() {
	this.saveButton.setDisabled(true);
    },
    */
    /* When LiveForm returns with any result,
     * Enable the save button after any liveform op is done -- though bindings may later disable it again *
    popupLiveFormResult: function() {
	this.saveButton.setDisabled(false);
    },
    */
    /* When the user hits edit, update the liveform's edit state to "update" and show the dialog */
    popupLivePanelEdit: function() {
	this.liveForm.beginDataUpdate();
	dojo.forEach(this.liveForm.getFormEditorsArray(), dojo.hitch(this.liveForm, function(e) {
	    if (e.ignoreParentReadonly)
		return;
	    if (this._canChangeEditorReadonly(["update"], e, this, false)) {
		if (e.readonly) e.setReadonly(false);
	    } else {
		if (!e.readonly) e.setReadonly(true);
	    }
	}));
	if (this.dialog) {
	    this.dialog.show();
	} else if (this.detailsLayer) {
	    this.detailsLayer.activate();
	}
    },

    /* When the user hits New, update the liveform's edit state to "insert" and show the dialog */
    popupLivePanelInsert: function() {
	this.liveForm.beginDataInsert();
	dojo.forEach(this.liveForm.getFormEditorsArray(), dojo.hitch(this.liveForm, function(e) {
	    if (e.ignoreParentReadonly)
		return;
	    if (this._canChangeEditorReadonly(["insert"], e, this, false)) {
		if (e.readonly) e.setReadonly(false);
	    } else {
		if (!e.readonly) e.setReadonly(true);
	    }
	}));
	if (this.dialog) {
	    this.dialog.show();
	} else if (this.detailsLayer) {
	    this.detailsLayer.activate();
	}
    }



});
