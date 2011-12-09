/*
 * Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
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

	updateGridStructure: function(){
	    this.columns = this.contextMenu.getUpdatedDataSet();
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
    customFormatter: {ignore: 1},
    rendering: {ignore: 1},
	variable: { ignore: 1 },
	caption:{ignore:1},
	scrollX:{ignore:1},
	scrollY:{ignore:1},
	disabled:{ignore:1},
	query: {ignore:1},
    editColumns:{group: "edit", order:40, contextMenu: true, operation: 1},
    singleClickEdit: {group: "edit", order: 32},
    caseSensitiveSort: {group: "display", order: 40},
    selectFirstRow: {group: "display", order: 41},
    noHeader: {group: "display", order: 50},
    liveEditing: {group: "LiveEditing", order: 1},
    deleteColumn: {group: "LiveEditing", order: 10},
    deleteConfirm: {group: "LiveEditing", order: 10},
	store:{ignore:1},
	menu:{ignore:1},
	storeGUID:{ignore:1},
	dataValue:{ignore:1},
    updateNow: {group:"operation", operation: 1},
    selectedItem: {ignore:1, bindSource: 1, simpleBindProp: true, doc: 1},
    emptySelection: { ignore: true, bindSource: 1, type: "Boolean",  doc: 1},
    isRowSelected: { ignore: true, bindSource: 1, type: "Boolean",   doc: 1},
    dataSet: {bindTarget: 1, group: "edit", order: 30, isList: true, simpleBindTarget: true, doc: 1, createWire: 1, editor: "wm.prop.DataSetSelect", editorProps: {listMatch: true, widgetDataSets: true, allowAllTypes: true}},
    setColumnComboBoxOptions: {group: "method"},
    onLiveEditBeforeUpdate:  {events: ["js", "sharedjs", "sharedEventHandlers"]},
    onLiveEditBeforeInsert:  {events: ["js", "sharedjs", "sharedEventHandlers"]},
    onLiveEditBeforeDelete:  {events: ["js", "sharedjs", "sharedEventHandlers"]},

/* TODO: Localize */
    selectionMode: {group: "edit", order: 31, options: ["single", "multiple", "extended", "none", "checkbox", "radio"]},
    rightClickTBody: {ignore:1},
    dsType:{hidden:true},
    columns:{writeonly:1, nonlocalizable: true},
    localizationStructure: {hidden:true},
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
    setColumnWidth: {method:1},
    onMouseOver: {ignore: 1},
    onMouseOut: {ignore: 1},
    onRightClick: {ignore: 1}
});
