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
dojo.provide("wm.base.widget.LivePanel");
dojo.require("wm.base.widget.LiveForm");

dojo.declare("wm.LivePanel", wm.Panel, {
	height: "100%",
	width: "100%",
	layoutKind: "top-to-bottom",
	liveDataName: "",
        autoScroll: true,
	afterPaletteDrop: function() {
	    wm.Container.prototype.afterPaletteDrop.call(this);
	    if (!studio.LivePanelTypeChooserDialog) {
		studio.LivePanelTypeChooserDialog = new wm.PageDialog({owner: studio,
								       name: "LivePanelTypeChooserDialog",
								       pageName: "NewLivePanelDialog",
								       width: "350px",
								       height: "300px",
								       modal: true,
								       hideControls: true,
								       title: "Pick LivePanel Layout"});
	    }
	    studio.LivePanelTypeChooserDialog.show();

	    studio.LivePanelTypeCancelConnection = 
		studio.LivePanelTypeChooserDialog.page.connect(studio.LivePanelTypeChooserDialog.page,"onCancelClick",this,function() {
		    dojo.disconnect(studio.LivePanelTypeOKConnection);
		    dojo.disconnect(studio.LivePanelTypeCancelConnection);
		    this.destroy();
		    studio.refreshWidgetsTree();
		});

	    studio.LivePanelTypeOKConnection = 
		studio.LivePanelTypeChooserDialog.page.connect(studio.LivePanelTypeChooserDialog.page,"onOkClick",this,function(inName) {
							    dojo.disconnect(studio.LivePanelTypeOKConnection);
							    dojo.disconnect(studio.LivePanelTypeCancelConnection);
							    delete studio.LivePanelTypeCancelConnection;
							    delete studio.LivePanelTypeOKConnection;

							    switch(inName) {
							    case "Traditional":
								this.createTraditionalLivePanel(inName.match(/Paging$/));
								break;
							    case "Dialog":
							    	this.createPopupLivePanel(inName.match(/Paging$/));
								break;
							    case "Editable Grid":
							    	this.createEditableGrid();
								break;
							    case "Live Form Only":
							    	this.createLiveForm();
								break;
							    case "Grid Only":
							    	this.createGrid();
								break;
							    }
							    this.reflow();
							    studio.refreshWidgetsTree();
		});
	},
    createPopupLivePanel: function(usePaging) {
	this.dataGrid = new wm.DojoGrid({
	    name: studio.page.getUniqueName(this.liveDataName + "DojoGrid"),
	    owner: this.owner,
	    height:'100%',
	    width: "100%",
	    parent: this
	});
	if (usePaging) 
	    var navigator = new wm.DataNavigator({
		name: studio.page.getUniqueName(this.liveDataName + "DataNav"),
		owner: this.owner,
		width:'100%',
		parent: this,
		byPage: true		
	    });

	/* Generate the button panel under the grid */
	var gridButtonPanel = new wm.Panel({owner: studio.page,
					    name: studio.page.getUniqueName(this.liveDataName + "GridButtonPanel"),
					    parent: this,
					    layoutKind: "left-to-right",
					    width: "100%",
					    height: wm.Button.prototype.height,
					    horizontalAlign: "right",
					    verticalAlign: "top"});
	var newButton = new wm.Button({owner: studio.page,
				       name: studio.page.getUniqueName(this.liveDataName + "NewButton"),
				       parent: gridButtonPanel,
				       caption: "New"});
	var updateButton = new wm.Button({owner: studio.page,
					name: studio.page.getUniqueName(this.liveDataName + "UpdateButton"),
				       parent: gridButtonPanel,
				       caption: "Update"});
	var deleteButton = new wm.Button({owner: studio.page,
					  name: studio.page.getUniqueName(this.liveDataName + "DeleteButton"),
				       parent: gridButtonPanel,
				       caption: "Delete"});

	var dialog = this.dialog = new wm.DesignableDialog({owner: studio.page,
					      name: studio.page.getUniqueName(this.liveDataName + "Dialog"),
					      width: "500px",
					      height: "400px",
					      modal: true,
					      title: this.liveDataName});


	/* Generate the LiveForm, LiveVariable and LiveView */
	this.liveForm = new wm.LiveForm({
				name: studio.page.getUniqueName(this.liveDataName + "LiveForm1"),
				owner: this.owner,
		                parent: dialog.containerWidget,
				verticalAlign: "top",
				horizontalAlign: "left",
                   		margin: "4",
                   		alwaysPopulateEditors: true,
                   		liveEditing: false,
                   		editPanelStyle: "none",
				_liveSource: this.liveSource
			});
		this.liveForm.createLiveSource(this.liveSource);
		var lvar = this.liveForm.dataSet.name;
  	        if (usePaging) {
		    this.liveForm.dataSet.maxResults = 30;
		    navigator.setLiveSource(lvar);
		}
		this.dataGrid.set_dataSet(lvar);


	var liveFormConnect = this.liveForm.connect(this.liveForm, "finishAddEditors", this, function() {
	    dojo.disconnect(liveFormConnect);
	    this.liveForm.setReadonly(false);
	    this.dialog.setHeight(this.dialog.titleBar.bounds.h + this.liveForm.bounds.h + this.dialog.buttonBar.bounds.h + this.dialog.padBorderMargin.t + this.dialog.padBorderMargin.b + this.dialog.containerWidget.padBorderMargin.t + this.dialog.containerWidget.padBorderMargin.b);
	});	    

		this.liveForm.set_dataSet(this.dataGrid.name + ".selectedItem");


	/* Create the buttonbar */
	dialog.createButtonBar();
	var saveButton = this.saveButton = new wm.Button({owner: studio.page,
							  name: studio.page.getUniqueName(this.liveDataName + "SaveButton"),
							  parent: dialog.buttonBar,
							  caption: "Save"});
	var cancelButton = new wm.Button({owner: studio.page,
					  name: studio.page.getUniqueName(this.liveDataName + "CancelButton"),
					parent: dialog.buttonBar,
					caption: "Cancel"});
					      

	/* Generate all edit event handlers */
	this.dataGrid.eventBindings.onCellDblClick = this.name + ".popupLivePanelEdit";
	newButton.eventBindings.onclick = this.name + ".popupLivePanelInsert";
	updateButton.eventBindings.onclick = this.name + ".popupLivePanelEdit";
	deleteButton.eventBindings.onclick = this.liveForm.name + ".deleteData";
	saveButton.eventBindings.onclick = this.liveForm.name + ".saveDataIfValid";
	cancelButton.eventBindings.onclick = this.dialog.name + ".hide";

	this.liveForm.eventBindings.onSuccess = this.name + ".popupLiveFormSuccess";
	//this.liveForm.eventBindings.onResult = this.name + ".popupLiveFormResult";
	//this.liveForm.eventBindings.onBeforeOperation = this.name + ".popupLiveFormBeforeOperation";

	this.saveButton.$.binding.addWire(null, "disabled", this.liveForm.name + ".invalid","");
	this.$.binding.addWire(null, "dialog", dialog.name, ""); // insures that if "dialog" is renamed, we will still know the name of our dialog
	this.$.binding.addWire(null, "liveForm", this.liveForm.name, "");
	this.$.binding.addWire(null, "dataGrid", this.dataGrid.name, "");
	this.$.binding.addWire(null, "saveButton", this.saveButton.name, "");
    },
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




    createEditableGrid: function() {
	this.dataGrid = new wm.DojoGrid({
	    name: studio.page.getUniqueName(this.liveDataName + "DojoGrid"),
	    owner: this.owner,
	    height:'100%',
	    width: "100%",
	    parent: this,
	    liveEditing: true
	});
	
	var gridButtonPanel = new wm.Panel({owner: studio.page,
					    name: studio.page.getUniqueName(this.liveDataName + "GridButtonPanel"),
					    parent: this,
					    layoutKind: "left-to-right",
					    width: "100%",
					    height: wm.Button.prototype.height,
					    horizontalAlign: "right",
					    verticalAlign: "top"});
	var newButton = new wm.Button({owner: studio.page,
				       name: studio.page.getUniqueName(this.liveDataName + "NewButton"),
				       parent: gridButtonPanel,
				       caption: "New"});
	var deleteButton = new wm.Button({owner: studio.page,
					  name: studio.page.getUniqueName(this.liveDataName + "DeleteButton"),
					  parent: gridButtonPanel,
					  caption: "Delete"});

	newButton.eventBindings.onclick = this.name + ".editableGridNew";
	deleteButton.eventBindings.onclick = this.name + ".editableGridDelete";
	this.$.binding.addWire(null, "dataGrid", this.dataGrid.name, "");


	var livevar = this.liveVariable = new wm.LiveVariable({owner: studio.page,
					   name: studio.page.getUniqueName(this.liveDataName + "LiveVariable1"),
					   liveSource: this.liveSource,
					   operation: "read"});
	this.$.binding.addWire(null, "liveVariable", this.livevar.name, "");
	this.dataGrid.set_dataSet(livevar.name);

	var columns = this.dataGrid.columns;

	var type = wm.typeManager.getType(livevar.type)
	for (var i = 0; i < columns.length; i++) {
	    var field = type.fields[columns[i].id]
	    if (field.exclude.length == 0)
		columns[i].editable = true;
	    switch(field.type) {
	    case "java.util.Date":
		columns[i].fieldType = "dojox.grid.cells.DateTextBox";
		break;
	    case "java.lang.Boolean":
		columns[i].fieldType = "dojox.grid.cells.Bool";
		break;
	    case "java.lang.Integer":
	    case "java.lang.Double":
	    case "java.lang.Float":
	    case "java.lang.Short":
		columns[i].fieldType = "dojox.grid.cells.NumberTextBox";
		break;
	}
	}
	    this.dataGrid.renderDojoObj();
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
    },
    createGrid: function() {
	this.dataGrid = new wm.DojoGrid({
	    name: studio.page.getUniqueName(this.liveDataName + "DojoGrid"),
	    owner: this.owner,
	    height:'100%',
	    width: "100%",
	    parent: this
	});
	
	var livevar = new wm.LiveVariable({owner: studio.page,
					   name: studio.page.getUniqueName(this.liveDataName + "LiveVariable1"),
					   liveSource: this.liveSource,
					   operation: "read"});
	this.dataGrid.set_dataSet(livevar.name);

    },
    createLiveForm: function() {
	this.liveForm = new wm.LiveForm({
	    name: studio.page.getUniqueName(this.liveDataName + "LiveForm"),
	    owner: this.owner,
	    height:'100%',
	    width: "100%",
	    parent: this,
	    verticalAlign: "top",
	    horizontalAlign: "left",
	    _liveSource: this.liveSource
	});
	var livevar = new wm.LiveVariable({owner: studio.page,
					   name: studio.page.getUniqueName(this.liveDataName + "LiveVariable1"),
					   liveSource: this.liveSource,
					   operation: "read"});
	var liveFormConnect = this.liveForm.connect(this.liveForm, "finishAddEditors", function() {
	    livevar.destroy(); // don't need this except to help generate editors
	    dojo.disconnect(liveFormConnect);
	    studio.refreshWidgetsTree();
	});	    
	this.liveForm.set_dataSet(livevar);


    },
    	createTraditionalLivePanel: function(usePaging) {
	        var fancyPanel1 = new wm.FancyPanel({parent: this,
                                                     horizontalAlign: "left",
                                                     verticalAlign: "top",
						     owner: this.owner,
						     name: this.liveDataName + "GridPanel",
                                                     minHeight: "180",
						     title: wm.capitalize(this.liveDataName)});
		this.dataGrid = new wm.DojoGrid({
                                border: "0", // wm.FancyPanel + theme change; fancy panel provides the border; ignore any default borders provided by theme
				name: studio.page.getUniqueName(this.liveDataName + "DojoGrid"),
				owner: this.owner,
				height:'100%',
				parent: fancyPanel1.containerWidget, // wm.FancyPanel change; revert to returning "this"
				_classes: {"domNode":["omgDataGrid"]}
			});
	    if (usePaging) 
		var navigator = new wm.DataNavigator({
		    name: studio.page.getUniqueName(this.liveDataName + "DataNav"),
		    owner: this.owner,
		    width:'100%',
		    parent: fancyPanel1.containerWidget,
		    byPage: true
		});
	        var fancyPanel2 = new wm.FancyPanel({parent: this,
                                                     horizontalAlign: "left",
                                                     verticalAlign: "top",
						     owner: this.owner,
						     name: this.liveDataName + "DetailsPanel",
						    title: "Details"});
		this.liveForm = new wm.LiveForm({
				name: studio.page.getUniqueName(this.liveDataName + "LiveForm1"),
				owner: this.owner,
		                parent: fancyPanel2.containerWidget, // wm.FancyPanel change; revert to returning "this"
		                margin: "0,40,0,40",
				verticalAlign: "top",
				horizontalAlign: "left",
				_liveSource: this.liveSource
			});
	        this.reflow(); // added for fancypanel support
		this.liveForm.createLiveSource(this.liveSource);
		var lvar = this.liveForm.dataSet.name;

	    if (usePaging) {
		this.liveForm.dataSet.maxResults = 30;
		navigator.setLiveSource(lvar);
	    }
		this.dataGrid.set_dataSet(lvar);
		this.liveForm.set_dataSet(this.dataGrid.name + ".selectedItem");
		this.liveForm.eventBindings.onSuccess = lvar;
		fancyPanel2.setFitToContentHeight(true);
	}
});

wm.Object.extendSchema(wm.LivePanel, {
    themeStyleType: {ignore: 1},
	liveDataName: {ignore: 1},
	liveSource: {ignore: 1}
});
