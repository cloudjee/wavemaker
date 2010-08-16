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
dojo.provide("wm.base.widget.DojoGrid");

dojo.declare("wm.DojoGrid", wm.Control, {
	margin: 4,
	width:'100%',
	height:'200px',
	variable:null,
	dataSet:null,
	dsType:null,
	store:null,
	query:'',
	dojoObj:null,
	singleClickEdit:false,
	selectedItem: null,
	emptySelection: true,
	selectionMode: "single",
	addDialogName:'',
	addFormName:'',
	columns:[],
	
	init: function() {
		dojo['require']("dojox.grid.DataGrid");
		dojo['require']("dojox.grid.cells.dijit");
		dojo['require']("dojo.data.ItemFileWriteStore");
		dojo['require']("dojo.string");
		if (this.isDesignLoaded()){
			var js = "dijit.Dialog";
			dojo["require"](js);
		}
		
		this.inherited(arguments);
		var varProps = {name: "selectedItem", owner: this, 
						json: this.selectionMode == 'multiple' ? '[]' : '', 
						type: this.variable ? this.variable.type : "any" };
		this.selectedItem = new wm.Variable(varProps);
		this.updateSelectedItem(-1);
		this.setSelectionMode(this.selectionMode);
		this.updateDOMNode();
	},
	updateDOMNode: function(){
		if (this.showAddButton || this.showDeleteButton)
		{
			if (!this.actionNode) {
				this.actionNode = dojo.create('div', {style: 'height:27px'}, this.domNode);
				this.gridNode = dojo.create('div', {style: 'width:100%;height:100%'}, this.domNode);
			}
			this.addActionButtons();
		}
		else
		{
			if (this.actionNode){
				dojo.destroy(this.actionNode);
				delete this.actionNode;				
			}
			
			this.gridNode = this.domNode;
		}
	},
	postInit: function() {
		this.inherited(arguments);
		var thisObj = this;
		if (this.addDialogName && this.addDialogName != ''){
			this.addDialog = this.widgets[this.addDialogName];
			if (this.isDesignLoaded()){
				this.addDialog.setOwner(this);
			}
			
			if (this.addDialog){
				this.liveForm = this.addDialog.widgets[this.addFormName];
				if (this.liveForm){
					dojo.connect(this.liveForm, 'cancelEdit', this, 'cancelEdit');
					dojo.connect(this.liveForm, 'onSuccess', this, '_onDBAddRow');
					dojo.connect(this.liveForm, 'onDeleteData', this, '_onDBDeleteRow');
				}
			}
		}
	},
	dataSetToSelectedItem: function() {
		this.selectedItem.setLiveView((this.variable|| 0).liveView);
		this.selectedItem.setType(this.variable && this.variable.type ? this.variable.type : "any");
	},
	setSelectedRow: function(rowIndex, isSelected) {
	  if (isSelected == undefined) 
	    isSelected = true;
	  if (isSelected) {
	    this.dojoObj.selection.select(rowIndex);
	  } else {
	    this.dojoObj.selection.setSelected(rowIndex,isSelected);
	  }
	},
	deselect: function() {
	  this.updateSelectedItem(-1);
	  this.onSelectionChange();
	},
	select: function() {
		if (this.selectionMode == 'multiple')
			this.updateAllSelectedItem();
		else
			this.updateSelectedItem( this.getSelectedIndex());
		this.onSelectionChange();
	},
	selectionChange: function() {
		if (this.selectionMode == 'multiple')
			this.updateAllSelectedItem();
		else
			this.updateSelectedItem( this.getSelectedIndex());
	  this.onSelectionChange();
	},
	cellEditted: function(inValue, inRowIndex, inFieldName) {
		// values of the selectedItem must be updated, but do NOT call a selectionChange event, as its the same selected item, just different values
		if (this.getSelectedIndex() != inRowIndex) {
			this.setSelectedRow(inRowIndex, true);
		}
		this.updateSelectedItem( this.getSelectedIndex());
		this.onCellEditted(inValue, inRowIndex, inFieldName);
	},
	updateSelectedItem: function(selectedIndex) {
		if (selectedIndex == -1) {
			this.selectedItem.clearData();
		} else {	    
			var newdata = this.itemToJSONObject(this.store, this.getRowData(selectedIndex));
			for (prop in newdata){
				if (newdata[prop] instanceof Date)
					newdata[prop] = newdata[prop].getTime();
			}
			this.selectedItem.setData(newdata);
		}
		this.setValue("emptySelection", !this.hasSelection());
	},
	updateAllSelectedItem: function(){
		if (!this.dojoObj) return;
		this.selectedItem.clearData();
		var items = this.dojoObj.selection.getSelected();
		var objList = [];
		dojo.forEach(items, function(obj){
			objList.push(this.itemToJSONObject(this.store, obj));
		}, this);

        this.selectedItem._setArrayData(objList);
		//this.setValue("emptySelection", !this.hasSelection());
	},
	onSelectionChange: function() {},
	onCellEditted: function(inValue, inRowIndex, inFieldName) {},
	getSelectedIndex: function() {
	  if (!this.dojoObj) return -1; // just in case the dojoObj hasn't been fully created yet
	  return this.dojoObj.selection.selectedIndex;
	},
	getRowData: function(rowIndex) {
	  return this.dojoObj.getItem(rowIndex);
	}, 
	findRowIndexByFieldValue: function(inFieldName, inFieldValue) {
	  var item;
	  for (var i = 0; i < this.getRowCount(); i++) {
	    item = this.dojoObj.getItem(i);
	    if (this.store.getValue(item,inFieldName) == inFieldValue) {
	      return this.dojoObj.getItemIndex(item);
	    }
	  }
	  return -1;
	},
	getCell: function(rowIndex, fieldName) {
	    var item = this.dojoObj.getItem(rowIndex);
	    return this.dojoObj.store.getValue(item,fieldName);
	},
	/* This method is flawed; tab does not work if cells are edited this way */
	editCell: function(rowIndex, fieldName) {
	  var cells = this.dojoObj.layout.cells;
	  for (var i = 0; i < cells.length; i++) {
	    if (cells[i].field == fieldName) {
	      this.dojoObj.edit.setEditCell(cells[i], rowIndex);
	      return;
	    }
	  }
	},
	setCell: function(rowIndex, fieldName, newValue) {
	  if (rowIndex < 0) {
	    console.error("setCell requires 0 or greater for row index");
	    return;
	  }

	    var item = this.dojoObj.getItem(rowIndex);
	    this.dojoObj.store.setValue(item, fieldName, newValue);
	    // Update the selectedItem variable if we just updated the selected item
	    if (this.getSelectedIndex() == rowIndex) {
	      this.updateSelectedItem(rowIndex);
	    }
	},
	deleteRow: function(rowIndex) {
	  this.updateSelectedItem(-1);
	  var item = this.getRowData(rowIndex);
	  this.dojoObj.store.deleteItem(item);
	},
	addRow: function(inFields, selectOnAdd) {
	  if (this.getRowCount() == 0 && this.variable) {
	    this.variable.setData([inFields]);
	    this.renderDojoObj();
	    if (selectOnAdd) {
	      this.setSelectedRow(0);
	      this.selectionChange(); // needs committing
	    }
	    return;
	  }
	  var data = dojo.clone(inFields);

	  var schema = this.selectedItem._dataSchema;
	  for (var key in schema) {
	    if (!(key in data)) {
	      data[key] = "";
	    }
	  }
	  var result = this.store.newItem(data);

	  if (selectOnAdd) {
	    var rowNumb = this.dojoObj.getItemIndex(result);
	    this.setSelectedRow(rowNumb);
	    this.selectionChange(); // needs committing
		var self = this;
		setTimeout(function(){
			self.dojoObj.scrollToRow(rowNumb);	
		},0);
		
	  }
	  return result;
	},
	getRowCount: function() {
	  return this.dojoObj.rowCount;
	},
	hasSelection: function() {
	  return Boolean(this.getSelectedIndex() != -1);
	},

	getEmptySelection: function() {
		return !this.hasSelection();
	},
	getEmptySelection: function() {
	  var result = Boolean(!this.selectedItem.getData() || this.getSelectedIndex() == -1);
	  return result;
	},
    renderBounds: function() {
	    this.inherited(arguments);
		if (this.showAddButton || this.showDeleteButton) {
			var position = this.getStyleBounds();
			this.gridNode.style.height = (position.h - 27) + 'px';
		}

	    this.resizeDijit();
	},
	resizeDijit: function() {
		if (this.dojoObj)
			this.dojoObj.resize();
	},
	renderDojoObj: function() {
		if (this._cupdating)
			return;
		if (this.variable)
			this.dataSetToSelectedItem();
		if (this.dojoObj != null){
			this.dojoObj.destroy();
		}

		var structure = this.getStructure();
		if (structure[0].length == 0)
			structure = {};

		var props = {escapeHTMLInData:false, structure:structure, store:this.store, singleClickEdit: this.singleClickEdit, columnReordering:true, query: this.query || {}};
		this.dojoObj = new dojox.grid.DataGrid(props,dojo.create('div', {style:'width:100%;height:100%'}, this.gridNode));
		this.connectDojoEvents();
		this.setSelectionMode(this.selectionMode);
		this.dojoRenderer();
	},
	dojoRenderer: function (){
		if (!this.dojoObj)
			return;
		this.dojoObj.startup();
	},
	connectDojoEvents: function(){
		dojo.connect(this.dojoObj, 'onCellClick', this, 'onCellClick');
		dojo.connect(this.dojoObj, 'onClick', this, 'onClick');
		dojo.connect(this.dojoObj,'onCellDblClick', this,'onCellDblClick');
		dojo.connect(this.dojoObj,'onCellContextMenu', this, 'onCellRightClick');
		//dojo.connect(this.dojoObj, "onDeselect", this, "deselect");
		//dojo.connect(this.dojoObj, "onSelected", this, "select");
		dojo.connect(this.dojoObj, "onSelectionChanged", this, "selectionChange");
		dojo.connect(this.dojoObj, "onApplyCellEdit", this, "cellEditted");

		if (this.isDesignLoaded()) {
			dojo.connect(this.dojoObj,'onMoveColumn', this, '_onMoveColumn');
			dojo.connect(this.dojoObj, 'onHeaderContextMenu', this, 'showMenuDialog');
			dojo.connect(this.dojoObj, 'onRowContextMenu', this, 'showMenuDialog');
			//dojo.connect(this.dojoObj, 'onCellClick', this, 'hideMenuDialog');
		}
	},
	getDataSet: function() {
		return this.variable;
	},
	setDataSet: function (inValue, inDefault){
		this.variable = inValue;
		if (this.isDesignLoaded() && !this._loading)
			this.setColumnData();
		this.setDojoStore();
		/*
		if (this.isDesignLoaded()){
			this.createRightClickMenu();
			this.updateRightClickMenu();
		}
		*/

		var thisObj = this;
		dojo.addOnLoad(function(){thisObj.renderDojoObj();});
	},
	setDojoStore: function(){
		if (!this.variable){
			this.store = null;
			this.dsType = null;
			return;
		}

		var storeData = {'items':[]};
		var dataList = this.variable.getData();
		var dateFields = this.getDateFields();
		dojo.forEach(dataList, function(obj){
			var dates = {};
			dojo.forEach(dateFields, function(f){
				if (obj[f])
					dates[f] = new Date(obj[f]);
			});
			storeData.items[storeData.items.length] = dojo.mixin({},obj, dates);
		}, this);
		this.store = new dojo.data.ItemFileWriteStore({data: storeData});
	},
	setQuery: function(q){
		this.query = q;
		if (this.dojoObj)
			this.dojoObj.setQuery(q);
	},
	getStructure: function(){
		var structure = [];
		dojo.forEach(this.columns, function(col){
			var obj = {	hidden:(!col.show), field: col.id, name:col.title, width: col.width, fieldType:col.fieldType, 
						editable:col.editable,expression:col.expression, displayType:col.displayType};

			if (col.align && col.align != ''){
				obj.styles = 'text-align:'+col.align + ';';				
			}
			
			if (col.formatFunc && col.formatFunc != ''){
				switch(col.formatFunc){
					case 'wm_date_formatter':
						obj.formatter = dojo.hitch(this, 'dateFormatter');			
						break;
					case 'wm_number_formatter':
						obj.formatter = dojo.hitch(this, 'numberFormatter');
						break;
					default:
						if (!this.isDesignLoaded())
							obj.formatter = dojo.hitch(this.owner, col.formatFunc);
						break;
				}
			}

			if (obj.fieldType && obj.fieldType != '') {
				obj.type = dojo.getObject(obj.fieldType);
			}
			
			if (obj.expression && obj.expression != '' && !obj.get) {
				obj.get = dojo.hitch(this, 'getExpressionValue', obj.expression);
			} else if (obj.field && obj.field.indexOf('.') != -1) {
				// If there's a object hirarchy, dojo does not support that but user is trying to show data from child object in a column.
				// For example:	dataSet = [{name:'account name', contact:{ name:'contact name'}}, ...]
				// and user has two columns -> name, contact.name
				// then we include a default expression to get values for contact.name
				obj.get = dojo.hitch(this, 'getExpressionValue', '${' + obj.field + '}');
			}
			
			structure.push(obj);
		}, this);

		structure = [structure];
		this.onGetStructure(structure);
		return structure; 
	},
	onGetStructure: function(inStructure) {},
	setColumnData: function(){
		if (!this.variable || (this.variable.type == this.dsType && this.columns.length > 0)){
			return;
		}

		this.dsType = this.variable.type;
		this.columns = [];
		var viewFields = this.getViewFields();
		dojo.forEach(viewFields, function(f){
			this.columns.push({show:true, id: f.dataIndex, title:wm.capitalize(f.dataIndex), width:'auto', displayType:f.displayType, noDelete:true});
		}, this);
		
		if (this.isDesignLoaded())
			this.contextMenu.setDataSet(this.columns);
	},
	getDateFields: function(){
		var dateFields = [];
		dojo.forEach(this.columns, function(col){
			if (col.displayType == 'Date')
				dateFields.push(col.id)	;
		});
		
		return dateFields;
	},
	setSelectionMode: function(inMode) {
	  this.selectionMode = inMode;
	  if (this.dojoObj) this.dojoObj.selection.setMode(this.selectionMode);
	},
	getViewFields: function(){
		var fields = [];
		if (this.variable instanceof wm.LiveVariable)
			fields = this.variable.getViewFields();
		else if (this.variable instanceof wm.Variable)
		{
			for (prop in this.variable._dataSchema)
			{
				if (this.variable._dataSchema[prop].isList)
					continue;
				fields[fields.length] = {dataIndex: prop};
			}
		}
		return fields;
	},
	onClick: function(evt){
	},
	onCellClick: function(evt){
	},
	onCellDblClick: function(evt){
	},
	onCellRightClick: function(evt){
	},
	addColumnToCSV: function(csvArray, value){
		if (dojo.isString(value))
			value = value.replace(/\"/g, '\\\"');
		csvArray.push("\"" + value + "\"");
		csvArray.push(',');
	},
	addBreakToCSV: function(csvArray){
		csvArray.pop(); // this pops the last comma.
		csvArray.push('<br>');
	},
	showCSVData: function(){
		if (!this.csvDialog){
			this.csvDialog = new dijit.Dialog({ title: "CSV Data for " + this.name});
			dojo.body().appendChild(this.csvDialog.domNode);
			this.csvDialog.startup();
		}
		
		this.csvDialog.attr('content', this.toCSV());
		this.csvDialog.show();
	},
	toCSV: function(){
		var csvData = [];
		dojo.forEach(this.columns, function(col, idx){
			if (!col.show)
				return;
			this.addColumnToCSV(csvData, col.title);
		}, this);
		
		if (csvData.length == 0){
			return 'CSV Data cannot be extracted for this Grid.';
		}
		
		this.addBreakToCSV(csvData);
		
		var dataList = this.variable.getData();
		dojo.forEach(dataList, function(obj){
			dojo.forEach(this.columns, function(col, idx){
				if (!col.show)
					return;
				var value = obj[col.id];
				if (col.expression){
					value = this.getExpressionValue(col.expression, idx, obj, true);
				} else if (col.formatFunc){
					switch(col.formatFunc){
						case 'wm_date_formatter':
							value = this.dateFormatter(value);			
							break;
						case 'wm_number_formatter':
							value = this.numberFormatter(value);	
							break;
						default:
							if (!this.isDesignLoaded())
								value = dojo.hitch(this.owner, col.formatFunc)(value);
							break;
					}
				}

				this.addColumnToCSV(csvData, value);
			}, this);
			this.addBreakToCSV(csvData);
		}, this);
		
		return csvData.join('');
	},
	getExpressionValue: function(exp, idx, dataObj, isSimpleDataObj){
		var expValue = '..';
		if (!dataObj)
			return expValue;
		var json = dataObj;
		if (!isSimpleDataObj)
			json = this.itemToJSONObject(this.store, dataObj);
		if (!json)
			return expValue;
		try
		{
			expValue = wm.expression.getValue(exp, json);
		}
		catch(e)
		{
			// User entered a wrong expression and so we will return value as ".." for the grid column.
		}

		return expValue;
	},
	dateFormatter: function(inDatum){
		var constraints = {selector:'date', formatLength:'short'};
		return dojo.date.locale.format(new Date(inDatum), constraints);
	},
	numberFormatter: function(inValue){
		return isNaN(inValue) ? 0 : inValue;
	},
	
	/* Action buttons implementation*/
	addActionButtons: function(){
		if (this.showAddButton && !this.addButton){
			this.addButton = this.createActionButton('Add', dojo.hitch(this, 'addActionCall'), this.actionNode);
		}

		if (this.showDeleteButton && !this.deleteButton){
			this.deleteButton = this.createActionButton('Delete', dojo.hitch(this, 'deleteActionCall'), this.actionNode);
		}
	},
	createActionButton: function(title, onclick, parentNode){
		var button = dojo.create('span', {'innerHTML':title, 'class':'gridActionButton'}, parentNode);
		this._connections.push(dojo.connect(button, 'onclick', onclick));
		this._connections.push(dojo.connect(button, 'onmousedown', this, 'actionButtonMouseDown'));
		this._connections.push(dojo.connect(button, 'onmouseup', this, 'actionButtonMouseUp'));
		return button;
	},
	actionButtonMouseDown: function(evt){
		dojo.toggleClass(evt.currentTarget, 'gridActionButtonMouseDown');
	},
	actionButtonMouseUp: function(evt){
		dojo.toggleClass(evt.currentTarget, 'gridActionButtonMouseDown');
	},
	addActionCall: function(evt){
		if (this.addDialog){
			this.addDialog.show();
		}
		
		if (this.liveForm){
			this.liveForm.beginDataInsert();
		}
		this.onAddButtonClick(evt);
	},
	cancelEdit: function(){
		this.addDialog.hide();
	},
	_onDBAddRow: function(inData){
		this.addRow(inData, true);
		this.addDialog.hide();
	},
	_onDBDeleteRow: function(inResult){
		this.deleteRow(this.deletingRowIdx);
		this.onDeleteSuccess(inResult);
	},
	deleteActionCall: function(){
	  	this.deletingRowIdx = this.getSelectedIndex();
		this.liveForm.setDataSet(this.selectedItem);
		this.liveForm._confirmDelete = false;
		this.liveForm.deleteData();
	},
	onDeleteSuccess: function(inResult){},
	saveActionCall: function(){},
	onAddButtonClick: function(inEvent){}
	/* Action buttons implementation*/
	
});

wm.DojoGrid.description = "A dojo grid.";

wm.DojoGrid.extend({
	itemToJSONObject: function(store, item) {
	  // summary: Function to convert an item into a JSON format.
	  // store:
	  //    The datastore the item came from.
	  // item:
	  //    The item in question.
	  var json = {};
	  if (item && store) {
	    //Determine the attributes we need to process.
	    var attributes = store.getAttributes(item);
	    if (attributes && attributes.length > 0) {
	      var i;
	      for (i = 0; i < attributes.length; i++) {
	        var values = store.getValues(item, attributes[i]);
	        if (values) {
	          //Handle multivalued and single-valued attributes.
	          if (values.length > 1 ) {
	            var j;
	            json[attributes[i]] = [];
	            for (j = 0; j < values.length; j++ ) {
	              var value = values[j];
	              //Check that the value isn't another item. If it is, process it as an item.
	              if (store.isItem(value)) {
	                json[attributes[i]].push(this.itemToJSONObject(store, value));
	              } else {
	                json[attributes[i]].push(value);
	              }
	            }
	          } else {
	            if (store.isItem(values[0])) {
	               json[attributes[i]] = this.itemToJSONObject(store, values[0]);
	            } else {
	               json[attributes[i]] = values[0];
	            }
	          }
	        }
	      }
	    }
	  }
	
	  return json;
	}
	
});
