/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.LivePanel_design");
dojo.require("wm.base.widget.LivePanel");

wm.LivePanel.extend({
	afterPaletteDrop: function() {
	    wm.Container.prototype.afterPaletteDrop.call(this);
	    if (!studio.LivePanelTypeChooserDialog) {
		studio.LivePanelTypeChooserDialog = new wm.PageDialog({owner: studio,
								       name: "LivePanelTypeChooserDialog",
								       pageName: "NewLivePanelDialog",
								       width: "510px",
								       height: "300px",
								       modal: true,
								       hideControls: true,
								       title: studio.getDictionaryItem("wm.LivePanel.CHOOSER_TITLE")});
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
		studio.LivePanelTypeChooserDialog.page.connect(
		    studio.LivePanelTypeChooserDialog.page,
		    "onOkClick",
		    this,
		    function(inName) {
			dojo.disconnect(studio.LivePanelTypeOKConnection);
			dojo.disconnect(studio.LivePanelTypeCancelConnection);
			delete studio.LivePanelTypeCancelConnection;
			delete studio.LivePanelTypeOKConnection;
			studio.beginWait(studio.getDictionaryItem("wm.LivePanel.WAIT_GENERATING"));
			wm.onidle(this, function() {
			    switch(inName) {
			    case "wm.LiveVariable":
				var lvar = this.createLiveSource(this.liveSource);
				studio.select(lvar);
				studio.endWait();
				this.destroy();
				studio.refreshComponentTree();
				return;
			    case studio.LivePanelTypeChooserDialog.page.getDictionaryItem("TRADITIONAL"):
				this.createTraditionalLivePanel(inName.match(/Paging$/));
				break;
			    case studio.LivePanelTypeChooserDialog.page.getDictionaryItem("DIALOG"):
				this.createPopupLivePanel(inName.match(/Paging$/));
				break;
			    case studio.LivePanelTypeChooserDialog.page.getDictionaryItem("BREADCRUMB"):
				this.createBreadcrumbLivePanel(inName.match(/Paging$/));
				break;
			    case studio.LivePanelTypeChooserDialog.page.getDictionaryItem("GRID"):
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
		});
	},
    createBreadcrumbLivePanel: function(usePaging) {
	this.breadcrumbs = new wm.BreadcrumbLayers({
	    name: studio.page.getUniqueName(this.liveDataName + "Layers"),
	    owner: this.owner,
	    height:'100%',
	    width: "100%",
	    parent: this
	});
	if (this.breadcrumbs.layers[0]) this.breadcrumbs.layers[0].destroy();

	var gridLayer = this.gridLayer = this.breadcrumbs.addLayer(wm.capitalize(this.liveDataName) + " List");

	this.setAutoScroll(false);
	this.dataGrid = new wm.DojoGrid({
	    name: studio.page.getUniqueName(this.liveDataName + "DojoGrid"),
	    owner: this.owner,
	    height:'100%',
	    width: "100%",
	    parent: gridLayer
	});
	if (usePaging) 
	    var navigator = new wm.DataNavigator({
		name: studio.page.getUniqueName(this.liveDataName + "DataNav"),
		owner: this.owner,
		width:'100%',
		parent: gridLayer,
		byPage: true		
	    });

	/* Generate the button panel under the grid */
	var gridButtonPanel = new wm.Panel({owner: studio.page,
					    name: studio.page.getUniqueName(this.liveDataName + "GridButtonPanel"),
					    parent: gridLayer,
					    layoutKind: "left-to-right",
					    width: "100%",
					    height: wm.Button.prototype.height,
					    horizontalAlign: "right",
					    verticalAlign: "top"});
	var newButton = new wm.Button({owner: studio.page,
				       name: studio.page.getUniqueName(this.liveDataName + "NewButton"),
				       parent: gridButtonPanel,
				       caption: studio.getDictionaryItem("wm.EditPanel.NEW_CAPTION")});
	var updateButton = new wm.Button({owner: studio.page,
					  name: studio.page.getUniqueName(this.liveDataName + "UpdateButton"),
					  parent: gridButtonPanel,
					  caption: studio.getDictionaryItem("wm.EditPanel.UPDATE_CAPTION")});
	var deleteButton = new wm.Button({owner: studio.page,
					  name: studio.page.getUniqueName(this.liveDataName + "DeleteButton"),
				       parent: gridButtonPanel,
				       caption: studio.getDictionaryItem("wm.EditPanel.DELETE_CAPTION")});

	var detailsLayer = this.detailsLayer = this.breadcrumbs.addLayer("Edit " + wm.capitalize(this.liveDataName));
	detailsLayer.setAutoScroll(true);

	/* Generate the LiveForm, LiveVariable and LiveView */
	this.liveForm = new wm.LiveForm({
				name: studio.page.getUniqueName(this.liveDataName + "LiveForm1"),
				owner: this.owner,
	                        parent: detailsLayer,
				verticalAlign: "top",
				horizontalAlign: "left",
                   		margin: "4",
                   		alwaysPopulateEditors: true,
                   		liveEditing: false,
                   		//editPanelStyle: "none",
	                        _noEditPanel: true,
				_liveSource: this.liveSource
			});
		this.liveForm.createLiveSource(this.liveSource);
		var lvar = this.liveForm.dataSet.name;
  	        if (usePaging) {
		    this.liveForm.dataSet.maxResults = 30;
		    navigator.setLiveSource(lvar);
		}
	this.dataGrid.$.binding.addWire("", "dataSet", lvar);


	var liveFormConnect = this.liveForm.connect(this.liveForm, "finishAddEditors", this, function() {
	    dojo.disconnect(liveFormConnect);
	    this.liveForm.setReadonly(false);
	    this.liveForm.setFitToContentHeight(false);
	    this.liveForm.setHeight("100%");
	});	    

	this.liveForm.set_dataSet(this.dataGrid.name + ".selectedItem");


	/* Create the buttonbar */
	var formButtonPanel = new wm.Panel({owner: studio.page,
					    name: studio.page.getUniqueName(this.liveDataName + "FormButtonPanel"),
					    parent: detailsLayer,
					    layoutKind: "left-to-right",
					    width: "100%",
					    height: wm.Button.prototype.height,
					    horizontalAlign: "right",
					    verticalAlign: "top"});	
	var saveButton = this.saveButton = new wm.Button({owner: studio.page,
							  name: studio.page.getUniqueName(this.liveDataName + "SaveButton"),
							  parent: formButtonPanel,
							  caption: studio.getDictionaryItem("wm.EditPanel.SAVE_CAPTION")});
	var cancelButton = new wm.Button({owner: studio.page,
					  name: studio.page.getUniqueName(this.liveDataName + "CancelButton"),
					  parent: formButtonPanel,
					  caption: studio.getDictionaryItem("wm.EditPanel.CANCEL_CAPTION")});
					      

	/* Generate all edit event handlers */
	this.dataGrid.eventBindings.onSelect = this.name + ".popupLivePanelEdit";
	newButton.eventBindings.onclick = this.name + ".popupLivePanelInsert";
	updateButton.eventBindings.onclick = this.name + ".popupLivePanelEdit";
	deleteButton.eventBindings.onclick = this.liveForm.name + ".deleteData";
	saveButton.eventBindings.onclick = this.liveForm.name + ".saveDataIfValid";
	cancelButton.eventBindings.onclick = this.gridLayer.name;

	this.liveForm.eventBindings.onSuccess = this.name + ".popupLiveFormSuccess";
	//this.liveForm.eventBindings.onResult = this.name + ".popupLiveFormResult";
	//this.liveForm.eventBindings.onBeforeOperation = this.name + ".popupLiveFormBeforeOperation";

	this.saveButton.$.binding.addWire(null, "disabled", "", "${" + this.liveForm.name + ".invalid} || !${" + this.liveForm.name + ".isDirty}");
	updateButton.$.binding.addWire(null, "disabled", this.dataGrid.name + ".emptySelection","");
	deleteButton.$.binding.addWire(null, "disabled", this.dataGrid.name + ".emptySelection","");
	this.$.binding.addWire(null, "gridLayer", this.gridLayer.name, ""); // insures that if "gridLayer" is renamed, we will still know the name of our gridLayer
	this.$.binding.addWire(null, "detailsLayer", this.detailsLayer.name, ""); // insures that if "detailsLayer" is renamed, we will still know the name of our detailsLayer
	this.$.binding.addWire(null, "liveForm", this.liveForm.name, "");
	this.$.binding.addWire(null, "dataGrid", this.dataGrid.name, "");
	this.$.binding.addWire(null, "saveButton", this.saveButton.name, "");
    },


    createPopupLivePanel: function(usePaging) {
	this.setAutoScroll(false);
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
				       caption: studio.getDictionaryItem("wm.EditPanel.NEW_CAPTION")});
	var updateButton = new wm.Button({owner: studio.page,
					  name: studio.page.getUniqueName(this.liveDataName + "UpdateButton"),
					  parent: gridButtonPanel,
					  caption: studio.getDictionaryItem("wm.EditPanel.UPDATE_CAPTION")});
	var deleteButton = new wm.Button({owner: studio.page,
					  name: studio.page.getUniqueName(this.liveDataName + "DeleteButton"),
				       parent: gridButtonPanel,
				       caption: studio.getDictionaryItem("wm.EditPanel.DELETE_CAPTION")});

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
                   		//editPanelStyle: "none",
	                        _noEditPanel: true,
				_liveSource: this.liveSource
			});
		this.liveForm.createLiveSource(this.liveSource);
		var lvar = this.liveForm.dataSet.name;
  	        if (usePaging) {
		    this.liveForm.dataSet.maxResults = 30;
		    navigator.setLiveSource(lvar);
		}
	 this.dataGrid.$.binding.addWire("", "dataSet", lvar);


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
							  caption: studio.getDictionaryItem("wm.EditPanel.SAVE_CAPTION")});
	var cancelButton = new wm.Button({owner: studio.page,
					  name: studio.page.getUniqueName(this.liveDataName + "CancelButton"),
					parent: dialog.buttonBar,
					  caption: studio.getDictionaryItem("wm.EditPanel.CANCEL_CAPTION")});
					      

	/* Generate all edit event handlers */
	this.dataGrid.eventBindings.onCellDblClick = this.name + ".popupLivePanelEdit";
	newButton.eventBindings.onclick = this.name + ".popupLivePanelInsert";
	updateButton.eventBindings.onclick = this.name + ".popupLivePanelEdit";
	deleteButton.eventBindings.onclick = this.liveForm.name + ".deleteData";
	saveButton.eventBindings.onclick = this.liveForm.name + ".saveDataIfValid";
	cancelButton.eventBindings.onclick = this.dialog.name + ".hide";
	cancelButton.eventBindings.onclick1 = this.liveForm.name + ".cancelEdit";

	this.liveForm.eventBindings.onSuccess = this.name + ".popupLiveFormSuccess";
	//this.liveForm.eventBindings.onResult = this.name + ".popupLiveFormResult";
	//this.liveForm.eventBindings.onBeforeOperation = this.name + ".popupLiveFormBeforeOperation";

	this.saveButton.$.binding.addWire(null, "disabled", this.liveForm.name + ".invalid","");
	updateButton.$.binding.addWire(null, "disabled", this.dataGrid.name + ".emptySelection","");
	deleteButton.$.binding.addWire(null, "disabled", this.dataGrid.name + ".emptySelection","");
	this.$.binding.addWire(null, "dialog", dialog.name, ""); // insures that if "dialog" is renamed, we will still know the name of our dialog
	this.$.binding.addWire(null, "liveForm", this.liveForm.name, "");
	this.$.binding.addWire(null, "dataGrid", this.dataGrid.name, "");
	this.$.binding.addWire(null, "saveButton", this.saveButton.name, "");
    },

	createLiveSource: function(inType) {
	    var r = this.getRoot();
	    var ti = wm.typeManager.getType(inType)
	    if (!ti)
		return;
	    var name = inType.split('.').pop().toLowerCase();
  	    var lvar = r.createComponent(name + "LiveVariable1", "wm.LiveVariable", {type: inType});
	    var lv = new wm.LiveView({owner: lvar, name: "liveView", service: ti.service, dataType: inType, _defaultView: true});
	    lv.getRelatedFields(); // make sure its calculated its list of related fields before we create/fire a livevar
	    lvar.setLiveView(lv);
	    return lvar;
	},

    createEditableGrid: function() {
	this.dataGrid = new wm.DojoGrid({
	    name: studio.page.getUniqueName(this.liveDataName + "DojoGrid"),
	    owner: this.owner,
	    height:'100%',
	    width: "100%",
	    parent: this,
	    liveEditing: true,
	    deleteColumn: true,
	    singleClickEdit: true
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
					  caption: studio.getDictionaryItem("wm.EditPanel.NEW_CAPTION")});

	newButton.eventBindings.onclick = this.dataGrid.name + ".addEmptyRow";
	this.$.binding.addWire(null, "dataGrid", this.dataGrid.name, "");

	var lvar = this.createLiveSource(this.liveSource);
/*
	var livevar = this.liveVariable = new wm.LiveVariable({owner: studio.page,
					   name: studio.page.getUniqueName(this.liveDataName + "LiveVariable1"),
					   liveSource: this.liveSource,
					   operation: "read"});
	this.$.binding.addWire(null, "liveVariable", lvar.name, "");
					   */
	this.dataGrid.$.binding.addWire("", "dataSet", lvar.name, "");

	var columns = this.dataGrid.columns;
	var r = this.getRoot();

	var type = wm.typeManager.getType(lvar.type)
	for (var i = 0; i < columns.length; i++) {
	    if (columns[i].mobileColumn) {
		;
	    } else {
		var fieldName = columns[i].field;
		if (fieldName.indexOf(".") != -1) {
		    /* Editing a subobject */
		    var objectName = fieldName.replace(/\..*?$/, "");
		    var obj = lvar.getValue(objectName);
		    var displayField = wm.typeManager.getDisplayField(obj.type);

	            var fieldName = fieldName.replace(/^.*?\./,"");
	            if (fieldName != displayField) {
			columns[i].show = false;
		    } else {
  			var subvar = r.createComponent(objectName + "LiveVariable1", "wm.LiveVariable", {type: obj.type});
			columns[i].title = wm.capitalize(objectName);
			columns[i].fieldType = "dojox.grid.cells.ComboBox";
			columns[i].editorProps = {selectDataSet: subvar.name,
						  displayField: displayField};
		    }

		} else {
		    /* Editing a field of the main object */
		    var field = type.fields[fieldName];
		    if (field.exclude.length == 0) { 
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
			default:
			    columns[i].fieldType = "dojox.grid.cells._Widget";
			}
		    }
		}
	    }
	}
	    this.dataGrid.renderDojoObj();
	studio.endWait();
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
	this.dataGrid.setDataSet(livevar.name);

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
	    //this.set_deviceSizes(["1150","900","750","600","450"]);
	        var fancyPanel1 = new wm.FancyPanel({parent: this,
                                                     horizontalAlign: "left",
                                                     verticalAlign: "top",
						     owner: this.owner,
						     name: this.liveDataName + "GridPanel",
                                                     minHeight: 180,
						     mobileFolding: true,
						     mobileFoldingCaption:wm.capitalize(this.liveDataName) + " List",
						     mobileFoldingIndex: 0,						     
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
						     mobileFolding: true,
						     mobileFoldingCaption:"Edit " + wm.capitalize(this.liveDataName),
						     mobileFoldingIndex: 0,
						     title: studio.getDictionaryItem("wm.LivePanel.DETAILS_PANEL_TITLE")});
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
	    	this.dataGrid.$.binding.addWire("", "dataSet", lvar, "");
		this.liveForm.set_dataSet(this.dataGrid.name + ".selectedItem");
		this.liveForm.eventBindings.onSuccess = lvar;
		fancyPanel2.setFitToContentHeight(true);
	},


    _end: 0
});


wm.Object.extendSchema(wm.LivePanel, {
    themeStyleType: {ignore: 1},
	liveDataName: {ignore: 1},
    liveSource: {ignore: 1},
    dataGrid: {ignore: 1},
    dialog: {ignore: 1},
    liveForm: {ignore: 1},
    saveButton: {ignore: 1},
    liveVariable: {ignore: 1},
    livevar: {ignore: 1}

});
