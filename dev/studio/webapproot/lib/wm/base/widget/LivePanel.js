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
	this.dialog.hide();
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
	    if (this._canChangeEditorReadonly(["update"], e, this, false)) {
		if (e.readonly) e.setReadonly(false);
	    } else {
		if (!e.readonly) e.setReadonly(true);
	    }
	}));
	this.dialog.show();
    },

    /* When the user hits New, update the liveform's edit state to "insert" and show the dialog */
    popupLivePanelInsert: function() {
	this.liveForm.beginDataInsert();
	dojo.forEach(this.liveForm.getFormEditorsArray(), dojo.hitch(this.liveForm, function(e) {
	    if (this._canChangeEditorReadonly(["insert"], e, this, false)) {
		if (e.readonly) e.setReadonly(false);
	    } else {
		if (!e.readonly) e.setReadonly(true);
	    }
	}));
	this.dialog.show();
    },



    createComboBoxPopupLivePanel: function(usePaging) {
	this.setLayoutKind("left-to-right");
	this.comboBox = new wm.SelectMenu({
	    name: studio.page.getUniqueName(this.liveDataName + "Select"),
	    owner: this.owner,
	    width:'100%',
	    height: wm.Button.prototype.height,
	    margin: wm.Button.prototype.margin,
	    padding: wm.Button.prototype.padding,
	    caption: "Select " + this.liveDataName,
	    captionSize: "250px",
	    parent: this,
	});
    },
    editableGridNew: function() {
	this.dataGrid.addEmptyRow(true);
	wm.onidle(this, function() {
	    var type = wm.typeManager.getType(this.dataGrid.getDataSet().type)
	    var columns = this.dataGrid.columns;
	    for (var i = 0; i < columns.length; i++) {
		var field = type.fields[columns[i].id];
		if (field.exclude.length == 0) {
		    this.dataGrid.editCell(this.dataGrid.getSelectedIndex(), columns[i].id);
		    break;
		}
	    }
	});
    },
    editableGridDelete: function() {
	this.dataGrid.deleteRow(this.dataGrid.getSelectedIndex());
    }
});
