/*
 * Copyright (C) 2010-2012 VMware, Inc. All rights reserved.
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
 

dojo.provide("wm.base.widget.DojoGrid_design");
dojo.require("wm.base.widget.DojoGrid");

wm.DojoGrid.extend({

    themeableStyles: [],
    themeableSharedStyles: ["-Even Rows", "Row-Background-Color","Row-Font-Color",
			    "-Odd Rows","Row-Background-Odd-Color","Row-Font-Odd-Color",
			    "-Hover Row", "Row-Background-Hover-Color","Row-Font-Hover-Color",
			    "-Selected Row", "Row-Background-Selected-Color", "Row-Font-Selected-Color", 
			    "-Misc", "Row-Border-Color", 
			    "-Header Styles", "Header-Background-Color", "Header-Font-Color", "Header-Image", "Header-Image-Position","Header-Image-Repeat"],
	afterPaletteDrop: function() {
		this.caption = this.caption || this.name;
		this.renderDojoObj();
	},
/* made obsolete by adding createWire to the property editor 
	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
			var ds = this.getValueById(inDataSet);
			if (ds)
				this.components.binding.addWire("", "dataSet", ds.getId());
		} else if (!inDataSet && !this._cupdating) {
		    this.components.binding.removeWireByProp("dataSet");
		    this.setDataSet(inDataSet);
		} else {
		    this.setDataSet(inDataSet);
		}
	},
	*/
	listProperties: function() {
	    var props = this.inherited(arguments);
	    props.dataSet.type = "Object";// should be able to bind to ANY type of variable (as long as its a list); could not find where this value is set to the dataset's type, but I don't want that happening.
	    
	    props.onLiveEditBeforeInsert.ignoretmp = !this.liveEditing;
	    props.onLiveEditBeforeUpdate.ignoretmp = !this.liveEditing;
	    props.onLiveEditBeforeDelete.ignoretmp = !this.liveEditing;

	    props.onLiveEditInsertSuccess.ignoretmp = !this.liveEditing;
	    props.onLiveEditUpdateSuccess.ignoretmp = !this.liveEditing;
	    props.onLiveEditDeleteSuccess.ignoretmp = !this.liveEditing;

	    props.onLiveEditInsertError.ignoretmp = !this.liveEditing;
	    props.onLiveEditUpdateError.ignoretmp = !this.liveEditing;
	    props.onLiveEditDeleteError.ignoretmp = !this.liveEditing;

	    props.onLiveEditInsertResult.ignoretmp = !this.liveEditing;
	    props.onLiveEditUpdateResult.ignoretmp = !this.liveEditing;
	    props.onLiveEditDeleteResult.ignoretmp = !this.liveEditing; 

	    return props;
	},
	designCreate: function() {
		// if this is being created in studio, supply a default caption
		if (this._studioCreating)
			this.studioCreate();
		this.inherited(arguments);
	},
	showMenuDialog: function(e){
	    studio.gridDesignerDialog.show();
	    studio.gridDesignerDialog.page.setGrid(this);
	},
	_formatterSignature: function(inValue, rowId, cellId, cellField, cellObj, rowObj){
	},

	setSingleClickEdit: function(inValue){
		this.singleClickEdit = inValue;
		if (this.dojoObj)
			this.dojoObj.singleClickEdit = this.singleClickEdit;
		this.dojoObj.render();
	},
        set_columns: function(inColumns){
	    this.columns = inColumns;
	    if (this.dojoObj) {
		this.dojoObj.attr('structure', this.getStructure());
		this.dojoObj.render();
	    }
	},
	_onResizeColumn: function(idx, inDrag, delta){
	        var sArray = this.columns;
		sArray[idx].width = delta.w + 'px';
	        if (this.contextMenu)
		    this.contextMenu.setDataSet(sArray);
		wm.fire(studio.inspector, "reinspect");
	},
	_onMoveColumn: function(arg1, arg2, oldPos, newPos){
	    var sArray = this.columns;
	    var tmp=sArray[oldPos];
	    sArray.splice(oldPos,1);
	    sArray.splice(newPos,0,tmp);
	},

    set_selectionMode: function(inMode) {
	this.setSelectionMode(inMode);
	this.renderDojoObj();
    },

    editColumns:function() {
	return this.showMenuDialog();
    },
	updateNow: function() {
		var ds = this.getValueById((this.components.binding.wires["dataSet"] || 0).source);
		wm.fire(ds, "update");
	},

    get_columns: function() {
	return this.columns || [];
	//return this.contextMenu ? this.contextMenu.getUpdatedDataSet() : this.columns || [];
    },
    get_localizationStructure: function() {
	var l = this.localizationStructure = {};
	if (studio.languageSelect.getDisplayValue() == "default") {
	    return l;
	} else {
	    for (var i = 0; i < this.columns.length; i++) {
		var c = this.columns[i];
		l[c.field] = c.title;
	    }
	    return l;
	}	
    },
    deviceTypeChange: function() {
	if (this.isDestroyed) return;
	var hasMobileColumn;
	for (var i = 0; i < this.columns.length; i++) {
	    var c = this.columns[i];
	    if (c.mobileColumn && c.show) {
		hasMobileColumn = true;
		break;
	    }
	}

        dojo.toggleClass(this.domNode, "dojoGridNoHeader", this.noHeader || Boolean(hasMobileColumn && studio.currentDeviceType == "phone"));
	this.renderDojoObj();
    }
/*
	update: function() {
		var ds = this.getValueById((this.components.binding.wires["dataSet"] || 0).source);
		wm.fire(ds, "update");
	},

    get_columns: function() {
	return this.columns || [];
	//return this.contextMenu ? this.contextMenu.getUpdatedDataSet() : this.columns || [];
    },
    get_localizationStructure: function() {
	var l = this.localizationStructure = {};
	if (studio.languageSelect.getDisplayValue() == "default") {
	    return l;
	} else {
	    for (var i = 0; i < this.columns.length; i++) {
		var c = this.columns[i];
		l[c.id] = c.title;
	    }
	    return l;
	}	
    }
/*
	writeProps: function(){
		try{
		    var props = this.inherited(arguments);
		    props.columns = this.contextMenu ? this.contextMenu.getUpdatedDataSet() : [];
		    if (props.columns.length == 0)
			props.columns = this.columns;
		    return props;
		} catch(e){
			console.info('Error while saving dashboard data..............', e);
		}
	}
	*/
});

wm.Object.extendSchema(wm.DojoGrid, {
    /* widgetName group */
    dataSet:           {group: "widgetName", subgroup: "data", order: 1, requiredGroup: 1, bindTarget: 1, isList: true, simpleBindTarget: true, editor: "wm.prop.DataSetSelect", editorProps: {listMatch: true, widgetDataSets: true, allowAllTypes: true}},
    editColumns:       {group: "widgetName", subgroup: "data", order:5, shortname: "Edit Columns", requiredGroup: 1, contextMenu: true, operation: 1},
    deleteColumn:      {group: "widgetName", subgroup: "behavior",  order: 10, advanced:1},
    deleteConfirm:     {group: "widgetName", subgroup: "confirmation", order: 10, advanced:1},
    caseSensitiveSort: {group: "widgetName", subgroup: "behavior", order: 40, advanced:1},
    selectFirstRow:    {group: "widgetName", subgroup: "selection", order: 41},
    selectionMode:     {group: "widgetName", subgroup: "selection", order: 31, options: ["single", "multiple", "extended", "none", "checkbox", "radio"]},
    singleClickEdit:   {group: "widgetName", subgroup: "editing", order: 32},
    liveEditing:       {group: "widgetName", subgroup: "editing", order: 1},

    /* Display group; layout subgroup */
    //noHeader: {group: "display", subgroup: "layout", order: 50, advanced:1},
    noHeader: {group: "widgetName", subgroup: "layout", order: 50, advanced:1},

    /* Operations group */
    updateNow: {group:"operation", operation: 1},

    /* BindSource hidden group */
    selectedItem: {ignore:1, bindSource: 1, simpleBindProp: true, doc: 1},
    emptySelection: { ignore: true, bindSource: 1, type: "Boolean",  doc: 1},
    isRowSelected: { ignore: true, bindSource: 1, type: "Boolean",   doc: 1},

    /* Common Group */
    manageHistory: {ignore:0},

    /* Event handlers */
    onSelectionChange:{order:3, advanced:1},
    onSelect: {order: 1},
    onDeselect: {order: 2},
    onSort:           {order:10},
    onCellEdited:     {order:20},
    onLiveEditBeforeUpdate:  {events: ["js", "sharedjs", "sharedEventHandlers"], order: 600, advanced:1},
    onLiveEditBeforeInsert:  {events: ["js", "sharedjs", "sharedEventHandlers"], order: 601, advanced:1},
    onLiveEditBeforeDelete:  {events: ["js", "sharedjs", "sharedEventHandlers"], order: 602, advanced:1},
    onLiveEditInsertSuccess: {order:610, advanced:1},
    onLiveEditUpdateSuccess: {order:611, advanced:1},
    onLiveEditDeleteSuccess: {order:612, advanced:1},
    onLiveEditInsertResult: {order:620, advanced:1},
    onLiveEditUpdateResult: {order:621, advanced:1},
    onLiveEditDeleteResult: {order:622, advanced:1},
    onLiveEditInsertError: {order:630, advanced:1},
    onLiveEditUpdateError: {order:631, advanced:1},
    onLiveEditDeleteError: {order:632, advanced:1},
    onRowDeleted:     {order:650,advanced:1},

    onClick:          {order: 100},
    onCellDblClick:   {order: 101},
    onCellRightClick: {advanced:1, order: 102},
    onGridButtonClick:{order:103},
    onHeaderClick:    {order:104,advanced:1},
    

    /* Ignored group */
    addFormName: {hidden:1},
    customFormatter: {ignore: 1},
    rendering: {ignore: 1},
    variable: { ignore: 1 },
    caption:{ignore:1},
    scrollX:{ignore:1},
    scrollY:{ignore:1},
    disabled:{ignore:1},
    query: {ignore:1},
    store:{ignore:1},
    menu:{ignore:1},
    storeGUID:{ignore:1},
    dataValue:{ignore:1},
    onMouseOver: {ignore: 1},
    onMouseOut: {ignore: 1},
    onRightClick: {ignore: 1},



/* TODO: Localize */
    rightClickTBody: {ignore:1},
    dsType:{hidden:true},
    columns:{writeonly:1, nonlocalizable: true},
    localizationStructure: {hidden:true},

    /* Method group */
    setColumnComboBoxOptions: {method:1},
    select: {method:1},
    deselectAll: {method:1},
    getSelectedIndex:{method:1, returns: "Number"},
    getRow: {method:1, returns: "Object"},
    findRowIndexByFieldValue:  {method:1, returns: "Number"},
    getCell:  {method:1, returns: "String"},
    setCell:  {method:1},
    editCell:  {method:1},
    deleteRow:  {method:1},
    addRow:  {method:1},
    addEmptyRow:  {method:1},
    getRowCount: {method:1, returns: "Number"},
    getDataSet: {method:1, returns: "wm.Variable"},
    setDataSet: {method:1},
    showCSVData: {method:1},
    setSortIndex:{method:1},
    setSortField:{method:1},
    setQuery: {method:1},
    setColumnShowing: {method:1},
    setColumnWidth: {method:1}
});
