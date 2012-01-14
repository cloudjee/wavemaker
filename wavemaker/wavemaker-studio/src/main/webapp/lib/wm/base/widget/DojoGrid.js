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

dojo.provide("wm.base.widget.DojoGrid");

dojo.declare("wm.DojoGrid", wm.Control, {
    deleteConfirm: "Are you sure you want to delete this?",
    deleteColumn: false,
    noHeader: false,
	margin: 4,
	width:'100%',
	height:'200px',
    minWidth: 150, 
    minHeight: 60,
	variable:null,
	dataSet:null,
	dsType:null,
	store:null,
	query:'',
        queryOptions: {ignoreCase: true},
	dojoObj:null,
	singleClickEdit:false,
    liveEditing: false,
	selectedItem: null,
	emptySelection: true,
	isRowSelected: false,
	selectionMode: "single", // was single, multiple, none; adding checkbox, radio
        _selectionMode: "",
	addFormName:'',
	columns:null,
	selectFirstRow: false,
	caseSensitiveSort:true,
    requiredLibs: ["dojox.grid.DataGrid",
		  "dojox.grid.cells.dijit",
		  "dojo.data.ItemFileWriteStore",
		  "dojo.string",
		  "wm.base.lib.currencyMappings",
		   "dojox.grid._CheckBoxSelector",
		   "dojox.grid._RadioSelector"],

    setLocalizationStructure: function(inStructure) {
	this.localizationStructure = inStructure;
	for (var i = 0; i < this.columns.length; i++) {
	    var c = this.columns[i];
	    if (this.localizationStructure[c.field]) {
		c.title = this.localizationStructure[c.field];
	    }
	}
	if (!this._cupdating && this.dojoObj) {
	    this.renderDojoObj();
	}
	    
    },
	init: function() {
	    this.setSelectionMode(this.selectionMode);
	    if (!this.columns) {
		this.columns = [];
	    } else if (this.localizationStructure) {
		this.setLocalizationStructure(this.localizationStructure);
	    }
	    for (var i = 0; i < this.requiredLibs.length; i++) {
		dojo['require'](this.requiredLibs[i]);
	    }
	    /* Small upgrade task for getting to 6.4 */
	    for (var i = 0; i < this.columns.length; i++) {
		if (this.columns[i].id) {
		    this.columns[i].field = this.columns[i].id;
		    delete this.columns[i].id;
		}
	    }

		this.inherited(arguments);
		var varProps = {name: "selectedItem", owner: this, 
						json: this._selectionMode == 'multiple' ? '[]' : '', 
						type: this.variable ? this.variable.type : "any" };
		this.selectedItem = new wm.Variable(varProps);
		
		this.updateSelectedItem(-1);
		this.setSelectionMode(this.selectionMode);
	},

        setNoHeader: function (inValue) {
            this.noHeader = inValue;
            dojo.toggleClass(this.domNode, "dojoGridNoHeader", inValue);
        },

	postInit: function() {
		this.inherited(arguments);
	        if (this.noHeader)
		    this.setNoHeader(this.noHeader);

	    if (this.variable && this.variable.getData() || this.columns && this.columns.length) {
			this.renderDojoObj();
	    }
	},
	dataSetToSelectedItem: function() {
		this.selectedItem.setLiveView((this.variable|| 0).liveView);
		this.selectedItem.setType(this.variable && this.variable.type ? this.variable.type : "any");
	},
        setSelectedRow: function(rowIndex, isSelected, onSuccess) {
	    if (!this.dataSet) return;
	    if (this._setRowTimeout) {
		window.clearTimeout(this._setRowTimeout);
		delete this._setRowTimeout;
	    }

	  if (isSelected == undefined) 
	    isSelected = true;

	  if (isSelected) {
	      /* If this returns an empty object, its because the row hasn't been processed by the grid, and will only be processed 
	       * when scrolled into view
	       */
	      if (wm.isEmpty(this.getRow(rowIndex))) {
		  this.dojoObj.scrollToRow(rowIndex);
		  wm.onidle(this, function() {
		      this.setSelectedRow(rowIndex);
		      if (onSuccess) onSuccess();
		  });
	      } else {
		  this.dojoObj.selection.select(rowIndex);
		  this.onSelectionChange();
		  this.onSelect();
		  this.dojoObj.scrollToRow(rowIndex);
		  if (onSuccess) onSuccess();
	      }
	  } else {
	      this.dojoObj.selection.setSelected(rowIndex,isSelected);
	      this.onSelectionChange();
	      this.onDeselect();
	  }

	},
	selectItemOnGrid: function(obj, pkList){
		if (!this.store)
			return;
	        if (obj instanceof wm.Variable)
		    obj = obj.getData();
	        if (obj === undefined || obj === null)
		    obj = {};

		var dateFields = this.getDateFields();
		if (!pkList)
			pkList = wm.data.getIncludeFields(this.variable.type);

	    /* If there are no primary keys, then all fields are used to match this item -- this may fail, not trying will definitely fail */
	        if (pkList.length == 0) {
		    var fields = wm.typeManager.getTypeSchema(this.variable.type)
		    for (var fieldName in fields) {
			pkList.push(fieldName);
		    }
		}

		var q = {};
		dojo.forEach(pkList, function(f){
			q[f] = obj[f];
		        if (dojo.indexOf(dateFields, f) != -1)
				q[f] = new Date(obj[f]);
		});

		var _this = this;
		var sItem = function(items, request){
		        if (items.length < 1) {
			    if (_this.selectFirstRow) {
				_this.setSelectedRow(0);
			    } else {
				_this.deselectAll();
			    }
			    return;
                        }
		    var idx =  _this.dojoObj.getItemIndex(items[0]);
		    if (idx == -1)
			idx = _this.variable.getItemIndexByPrimaryKey(obj, pkList) || -1;
		    if (idx == -1 && this.selectFirstRow)
			idx = 0;

		    if (idx >= 0) {
			if (this._setRowTimeout) {
			    window.clearTimeout(this._setRowTimeout);
			}

			this._setRowTimeout = setTimeout(function(){
			    _this.dojoObj.scrollToRow(idx);
			    wm.onidle(_this, function() {
				this.setSelectedRow(idx);
			    });
			},0);
                    } else 
                        _this.deselectAll();
		};
		this.store.fetch({query:q, onComplete: sItem});
	},
	deselectAll: function() {
            if (this.dojoObj)
                this.dojoObj.selection.clear();
	    this.updateSelectedItem(-1);
	    this.onSelectionChange();
	    this.onDeselect();
	},

    select: function(rowIndex, isSelected, onSuccess) {
        this.setSelectedRow(rowIndex, isSelected, onSuccess);
    },
/* Functionality moved to selectionChange
	select: function() {
	    this._selectedItemTimeStamp = new Date().getTime();
		if (this.selectionMode == 'multiple')
			this.updateAllSelectedItem();
		else
			this.updateSelectedItem( this.getSelectedIndex());
		this.onSelectionChange();
	},
	*/
	selectionChange: function() {
            var newSelection = this.dojoObj.selection.getSelected();
            var hasChanged = false;
            if (!this._curSelectionObj || !wm.Array.equals(this._curSelectionObj, newSelection))
                hasChanged = true;
            if (hasChanged) {
		this._selectedItemTimeStamp = new Date().getTime();
		if (this._selectionMode == 'multiple') {
			this.updateAllSelectedItem();
		} else {
			this.updateSelectedItem( this.getSelectedIndex());
		}
		if (!this.rendering) {
		    this.onSelectionChange();
		    if (newSelection) {
			this.onSelect();
		    } else {
			this.onDeselect();
		    }
		}
                this._curSelectionObj = [];
                for (var i = 0; i < newSelection.length; i++)
                    this._curSelectionObj.push(newSelection[i]);
            }

	},
	cellEditted: function(inValue, inRowIndex, inFieldName) {
	    var wmvar = this.getRowData(inRowIndex)._wmVariable;
	    if (wmvar) 
		wmvar = wmvar[0];

	    // when going from one checkbox to another, the onblur
	    // fires an onchange/cellEditted change for the checkbox
	    // we're leaving and fires this event twice: once for the
	    // row we're leaving and once for the row we clicked on.
	    // I only want this fired if there's an actual change. 
	    if (wmvar) {
		var allowLazyLoad = wmvar._allowLazyLoad;
		wmvar._allowLazyLoad = false;
		var oldValue = wmvar.getValue(inFieldName);
		wmvar._allowLazyLoad = allowLazyLoad;
		if (oldValue === inValue) return; 
	    }

		// values of the selectedItem must be updated, but do NOT call a selectionChange event, as its the same selected item, just different place the data is stored
		var rowIdx = this.getSelectedIndex();
		if (rowIdx != inRowIndex) {
			this.setSelectedRow(inRowIndex, true);
		} else {
		        this.updateSelectedItem( rowIdx);
		}

	    var allowLazyLoad = this.selectedItem._allowLazyLoad;
	    this.selectedItem._allowLazyLoad = false;
	    var oldValue = this.selectedItem.getValue(inFieldName);
	    this.selectedItem._allowLazyLoad = allowLazyLoad;
	    if (oldValue === inValue) return;
	    this.selectedItem.setValue(inFieldName,inValue);

	    // A bug in dojox.grid editting causes it to set "user.name" but read from "user: {name: currentname}" so we copy in the data to compenate
	    if (inFieldName.indexOf(".") != -1) {
		var elements = inFieldName.split(".");
		var firstElement = elements.shift();
		var obj = this.getCell(inRowIndex, firstElement);
		if (obj[elements.join(".")])
		    obj[elements.join(".")][0] = inValue;
		else
		    obj[elements.join(".")] = [inValue];                
	    }

	    // update the _wmVariable object

		if (wmvar) {
		    // if we fire a notification, the grid will be regenerated in the middle of processing
		    // the edit event
		    wmvar.beginUpdate(); 
		    wmvar.setValue(inFieldName, inValue);
		    wmvar.endUpdate();
		}
	    
 
	        if (this.liveEditing)
		    this.writeSelectedItem();
		this.onCellEdited(inValue, inRowIndex, inFieldName);
	},
	updateSelectedItem: function(selectedIndex) {
	    if (selectedIndex == -1 || this.getRowCount() == 0) {
		this.selectedItem.clearData();
	    } else {
/*
		var newdata = this.itemToJSONObject(this.store, this.getRowData(selectedIndex));
		for (prop in newdata){
		    if (newdata[prop] instanceof Date)
			newdata[prop] = newdata[prop].getTime();
		}*/
		if (selectedIndex < this.getRowCount())
		    this.selectedItem.setDataSet(this.getRowData(selectedIndex)._wmVariable[0]);
		else 
		    this.selectedItem.setDataSet(null);
	    }
	    this.setValue("emptySelection", !this.hasSelection());
	    this.setValue("isRowSelected", this.hasSelection());
	},

    createNewLiveVariable: function() {
	var lvar = new wm.LiveVariable({owner: this,
				    operation: "update",
				    backlogBehavior: "executeAll",
				    name: "liveVar",
				    type: this.dataSet.type,
				    liveSource: this.getDataSet().liveSource,
				    autoUpdate: false,
				    startUpdate: false});
	this.connect(lvar, "onSuccess", this, "_onLiveEditSuccess");
	this.connect(lvar, "onSuccess", this, "_onLiveEditError");
	this.connect(lvar, "onSuccess", this, "_onLiveEditResult");
	return lvar;
    },
    writeSelectedItem: function() {
	var deferred;
	var rowIndex = this.getSelectedIndex();
	if (dojo.isArray(rowIndex)) {
	    if (rowIndex.length == 0) return;
	    rowIndex = rowIndex[0];
	}
	var row = this.getRow(rowIndex);
	var operation = row._wmVariable.data._new ? "insert" : "update";
	var sourceData = this.selectedItem.getData();
	if (dojo.isArray(sourceData)) sourceData = sourceData[0];
	if (operation == "insert") {
	    /*
	    for (prop in sourceData) {
		if (sourceData[prop] == "&nbsp;") {
		    sourceData[prop] = "";
		}
	    }
	    */
	    /* Verify we have all required fields; return without writing if anything is missing */
	    var fields = this.selectedItem._dataSchema;
	    for (var field in fields) {
		if (sourceData[field] === undefined || sourceData[field] === null) {
		    if (fields[field].required) {
			console.warn("Can not write a '" + this.selectedItem.type + "' when required field '" + field + "' has no value");
			return;
		    }
		}
	    }
	}

	/* Strip out date objects from sourceData */
	var fields = this.selectedItem._dataSchema;
	for (var field in fields) {
	    if (sourceData[field] instanceof Date)
		sourceData[field] = sourceData[field].getTime();
	}

	if (operation === "insert") {
	    this.onLiveEditBeforeInsert(sourceData);
	} else {
	    this.onLiveEditBeforeUpdate(sourceData);
	}	    

	if (!this.liveVariable) {
	    this.liveVariable = this.createNewLiveVariable();
	}
	this.liveVariable.setSourceData(sourceData);
	this.liveVariable.operation = operation;
	var deferred = this.liveVariable.update();	    
	if (operation == "insert")
	    this.handleInsertResult(deferred,rowIndex); // in separate method to localize the variables
	/* TODO: test that for both insert and update that the row's fields have been updated with any new data from the server response */
	},
    onLiveEditBeforeInsert: function(inData) {},
    onLiveEditBeforeUpdate: function(inData) {},
    onLiveEditBeforeDelete: function(inData) {},
    _onLiveEditSuccess: function(inDeprecated) {
	this["onLiveEdit" + wm.capitalize(this.liveVariable.operation) + "Success"](this.liveVariable.getData());
    },
    _onLiveEditError: function(inError) {
	this["onLiveEdit" + wm.capitalize(this.liveVariable.operation) + "Error"](inError);
    },
    _onLiveEditResult: function(inDeprecated) {
	this["onLiveEdit" + wm.capitalize(this.liveVariable.operation) + "Result"](this.liveVariable.getData());
    },
    onLiveEditInsertSuccess: function(inData) {},
    onLiveEditUpdateSuccess: function(inData) {},
    onLiveEditDeleteSuccess: function(inData) {},
    onLiveEditInsertResult: function(inData) {},
    onLiveEditUpdateResult: function(inData) {},
    onLiveEditDeleteResult: function(inData) {},
    onLiveEditInsertError: function(inError) {},
    onLiveEditUpdateError: function(inError) {},
    onLiveEditDeleteError: function(inError) {},

    handleInsertResult: function(deferred,rowIndex) {
	deferred.addCallback(dojo.hitch(this, 
				    function(result) {
					var data = this.getRowData(rowIndex);
					delete data._wmVariable[0].data._new;
					this.setUneditableFields(rowIndex, result);
					this.updateSelectedItem(rowIndex);
				    }));
	deferred.addErrback(dojo.hitch(this,
				    function(result) {
					console.error(result);					
				    }));
    },
    setUneditableFields: function(rowIndex, data) {
	var oldData = this.getRow(rowIndex);
	var type = wm.typeManager.getType(this.getDataSet().type);
	var columns = this.columns;
	for (var i = 0; i < columns.length; i++) {
	    var field = type.fields[columns[i].field];
	    if (field) {
		if (field.exclude.length) {
		    this.setCell(rowIndex, columns[i].field, data[columns[i].field]);
		    oldData[columns[i].field] = data[columns[i].field];
		} else if (oldData[columns[i].field] == "&nbsp;")
		    oldData[columns[i].field] = ""; // only needed &nbsp; so that the row wasn't 1px high
	    }
	}
	oldData._wmVariable.setData(oldData);
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
	    this.selectedItem.notify();
	    this.setValue("emptySelection", !this.hasSelection());
	    this.setValue("isRowSelected", this.hasSelection());
	},
	getSelectedIndex: function() {
	    if (!this.dojoObj) return -1; // just in case the dojoObj hasn't been fully created yet
	    if (this._selectionMode == "multiple") {
		var selectedHash = this.dojoObj.selection.selected;
		var result = [];
		for (var row in selectedHash) {
		    result.push(Number(row));
		}
		return result;
	    } else {
		return this.dojoObj.selection.selectedIndex;
	    }
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
        getCellNode: function(rowIndex, fieldName) {
	    var cells = this.dojoObj.layout.cells;
	    for (var i = 0; i < cells.length; i++) {
		if (cells[i].field == fieldName) {
		    return this.dojoObj.layout.cells[i].getNode(rowIndex);
		}
	    }
	},
	/* This method is flawed; tab does not work if cells are edited this way */
	editCell: function (rowIndex, fieldName) { 
	    /* Avoids a common error of calling addNewRow followed by editCell; the wm.onidle insures that the row has been created before editing */
	    wm.onidle(this, function () {
	        var cells = this.dojoObj.layout.cells;
	        for (var i = 0; i < cells.length; i++) {
	            if (cells[i].field == fieldName) {
	                this.dojoObj.edit.setEditCell(cells[i], rowIndex);
	                this.dojoObj.focus.setFocusCell(cells[i], rowIndex);
	                return;
	            }
	        }
	    });
	},
	
    cancelEdit: function() {
	this.dojoObj.edit.cancel();
    },
        setCell: function(rowIndex, fieldName, newValue, noRendering) {
	  if (rowIndex < 0) {
	    console.error("setCell requires 0 or greater for row index");
	    return;
	  }

	    var item = this.dojoObj.getItem(rowIndex);

	    this.dojoObj.store._setValueOrValues(item, fieldName, newValue, !noRendering);
	    if (item._wmVariable && item._wmVariable[0]) {
		item._wmVariable[0].beginUpdate();
		item._wmVariable[0].setValue(fieldName, newValue);
		item._wmVariable[0].endUpdate();
	    }
	    if (this.getSelectedIndex() == rowIndex) {
		this.updateSelectedItem(rowIndex);
	    }

	    if (item._wmVariable && item._wmVariable[0]) {
		item._wmVariable[0].beginUpdate();
		item._wmVariable[0].setValue(fieldName, newValue);
		item._wmVariable[0].endUpdate();
	    }
	    if (this.getSelectedIndex() == rowIndex) {
		this.updateSelectedItem(rowIndex);
	    }

	},
	deleteRow: function(rowIndex) {
	    var sourceData;
	    if (this.liveEditing) {
		sourceData = this.getRow(rowIndex);
	    }
	    if (this.liveEditing && (!sourceData._wmVariable || !sourceData._wmVariable.data._new)) {

		/* Strip out date objects from sourceData */
		var fields = this.selectedItem._dataSchema;
		for (var field in fields) {
		    if (sourceData[field] instanceof Date)
			sourceData[field] = sourceData[field].getTime();
		}
		var livevar = this.liveVariable;
		if (!livevar) {
		    livevar = this.liveVariable = this.createNewLiveVariable();
		}
		livevar.operation = "delete";
		this.onLiveEditBeforeDelete(sourceData);
		livevar.setSourceData(sourceData);
		var deferred = livevar.update();
		deferred.addCallback(dojo.hitch(this, 
				    function(result) {
					if (this.getSelectedIndex() == rowIndex)
					    this.updateSelectedItem(-1);
					var item = this.getRowData(rowIndex);
					this.dojoObj.store.deleteItem(item);
					this.dojoObj.render();
				    }));
		deferred.addErrback(dojo.hitch(this,
					       function(result) {
						   console.error(result);
						   app.toastError(result.message);
					       }));
		
		return;
	    }
	  this.updateSelectedItem(-1);
	  var item = this.getRowData(rowIndex);
	  this.dojoObj.store.deleteItem(item);
	    this.dojoObj.render();
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
	    var v = new wm.Variable({type: this.dataSet.type});
	    v.setData(data);

	    /* Adding it to the dojo store does not work well if its a large store where not all of the data is loaded into the store; it seems to get confused */
/*
	    data._wmVariable = v;
	  var schema = this.selectedItem._dataSchema;
	  for (var key in schema) {
	    if (!(key in data)) {
	      data[key] = "";
	    }
	  }
	    data._new = true;
	    data._wmVariable = new wm.Variable({type: this.dataSet.type, owner: this});
	    data._wmVariable.setData(data);
	    debugger;
	    var result = this.store.newItem(data);
	    */
	    this.dataSet.addItem(v,0);
	    this.dataSet.getItem(0).data._new = true;
	  if (selectOnAdd || selectOnAdd === undefined) {
	    this.setSelectedRow(0);
	    this.selectionChange(); // needs committing
		var self = this;
		setTimeout(function(){
			self.dojoObj.scrollToRow(0);
		    for (var i = 0; i < self.columns.length; i++) {
			if (self.columns[i].fieldType) {
			    self.editCell(0, self.columns[i].field);
			    break;
			}
		    }
		},0);
		
	  }
	},
    addEmptyRow: function(selectOnAdd) {
	    var obj = {};
	var hasVisibleValue = false;
	for (var i = 0; i < this.columns.length; i++) {
	    var column = this.columns[i];
	    var columnid = column.field||column.id;

	    var parts = columnid.split(".");
	    var typeName = this.dataSet.type;
	    var type = wm.typeManager.getType(typeName);
	    for (var partnum = 0; partnum < parts.length; partnum++) {
		if (type && type.fields) {
		    var field = type.fields[parts[partnum]];
		    if (field) {
			typeName = type.fields[parts[partnum]].type;
			type = wm.typeManager.getType(typeName);
		    } else {
			type = "java.lang.String";
		    }
		}
	    }
	    var value = null;
	    switch(typeName) {
	    case "java.lang.Integer":
	    case "java.lang.Double":
	    case "java.lang.Float":
	    case "java.lang.Short":
		value = 0;
		break;
	    case "java.lang.Date":
		value = new Date().getTime();
		hasVisibleValue = true;
		break;
	    case "java.lang.Boolean":
		value = false;
		break;
	    default:
		value =	hasVisibleValue ? null :"&nbsp;";
		hasVisibleValue = true;
	     }
	    var subobj = obj;
	    for (var partnum = 0; partnum < parts.length; partnum++) {
		if (partnum +1 < parts.length) {
		    if (!subobj[parts[partnum]]) {
			subobj[parts[partnum]] = {};
		    }
		    subobj = subobj[parts[partnum]];
		} else {
		    subobj[parts[partnum]] = value;
		}
	    }
	}
	this.addRow(obj,selectOnAdd);
    },
	getRowCount: function() {
	    return Math.max(this.dojoObj.rowCount, this.dojoObj._by_idx.length);
	},
	hasSelection: function() {
	  return Boolean(this.getSelectedIndex() != -1);
	},

	getEmptySelection: function() {
		return !this.hasSelection();
	},
/*
	getEmptySelection: function() {
	  var result = Boolean(!this.selectedItem || !this.selectedItem.getData() || this.getSelectedIndex() == -1);
	  return result;
	},
	*/
	getIsRowSelected: function(){
		return !this.getEmptySelection();
	},
        renderBounds: function() {
	    this.inherited(arguments);
	    this.resizeDijit();
	},
	resizeDijit: function() {
		if (this.dojoObj)
			this.dojoObj.resize();
	},
    /* Users connect to this to add in custom advanced props */
    addDojoProps: function(inProps) {
    },
	renderDojoObj: function() {
	  if (this._cupdating)
			return;
		if (this.dojoObj != null){
			this.dojoObj.destroy();
			this.dojoObj = null;
		}

	    if (!this.variable && (!this.columns || !this.columns.length))
		return;

	    if (this.isAncestorHidden() && !this._renderHiddenGrid) {
		this._renderDojoObjSkipped = true;
		return;
	    } 
	        this._renderDojoObjSkipped = false;
		this.rendering = true;
	        if (this._resetStore) {
		    this.setDojoStore();
		    delete this._resetStore;
		}
		var structure = this.getStructure();
		if (structure[0].length == 0)
			structure = {};
	    var props = {escapeHTMLInData:false, structure:structure, store:this.store, singleClickEdit: this.singleClickEdit, columnReordering:true, queryOptions: this.queryOptions, query: this.query || {}, updateDelay: 0};	    
	    this.addDojoProps(props);
	    this.dojoObj = new dojox.grid.DataGrid(props,dojo.create('div', {style:'width:100%;height:100%'}, this.domNode));
	    this.connectDojoEvents();
	    this.setSelectionMode(this.selectionMode);
	    this.dojoRenderer();
		
		var selectedData = this.selectedItem.getData();
	    var isSelectedDataArray = dojo.isArray(selectedData);
	    if ( isSelectedDataArray && selectedData.length || !isSelectedDataArray && selectedData || this.selectFirstRow)
			this.selectItemOnGrid(this.selectedItem);
        

/*
            if (this.isDesignLoaded()) {
                var scrollNode = this.dojoObj.scroller.contentNodes[0].parentNode;

                if (dojo.isFF) {
                    // this works for firefox
		    this.connect(scrollNode,'onmousedown', this, function(evt) {
                        if (evt.button == 2 || evt.ctrlKey) {
                            dojo.stopEvent(evt);
                            this.showMenuDialog();
                        }
                    });
                }

                if (dojo.isWebKit) {
                    // This works for webkit browsers
		    this.connect(scrollNode,'oncontextmenu', this, function(evt) {
                        dojo.stopEvent(evt);
                        this.showMenuDialog();
                        return false;
                    });
                }


		}
	    */

    var _this = this;
    setTimeout(function(){
			   _this.rendering = false;
		}, 0)
	},
	dojoRenderer: function (){
		if (!this.dojoObj)
			return;
		this.dojoObj.startup();
	        this.dojoObj.updateDelay = 1; // reset this after creation; I just want this set to zero to insure that everything is generated promptly when we first create the grid.
	    if (this._isDesignLoaded) {
		var self = this;
		wm.job(this.getRuntimeId() + ".renderBounds", 1, function() {
		    self.renderBounds();		    
		});
	    }
	},

	    _onShowParent: function() {
		if (this._renderDojoObjSkipped) {
		    this.renderDojoObj();
		}
	    },

	connectDojoEvents: function(){
		//dojo.connect(this.dojoObj, 'onCellClick', this, 'onCellClick');

		//dojo.connect(this.dojoObj, "onDeselect", this, "deselect");
		//dojo.connect(this.dojoObj, "onSelected", this, "select");
	        //dojo.connect(this.dojoObj, "onSelected", this, "selectionChange");
		dojo.connect(this.dojoObj, "onSelectionChanged", this, "selectionChange");
	        //dojo.connect(this.dojoObj, "onDeselected", this, "selectionChange");

		if (this.isDesignLoaded()) {
			dojo.connect(this.dojoObj,'onMoveColumn', this, '_onMoveColumn');
			dojo.connect(this.dojoObj,'onResizeColumn', this, '_onResizeColumn');


			dojo.connect(this.dojoObj.domNode, 'oncontextmenu', this, 'showContextMenu');

		    if (dojo.isFF) {
			dojo.connect(this.dojoObj, 'onHeaderCellMouseDown', this, function(evt) {
                            if (evt.button == 2 || evt.ctrlKey) {
				dojo.stopEvent(evt);			    
				this.showContextMenu(evt);
			    }
			});
		    } else {
			dojo.connect(this.dojoObj, 'onHeaderContextMenu', this, 'showContextMenu');
		    }
			dojo.connect(this.dojoObj, 'onRowContextMenu', this, 'showContextMenu');


			//dojo.connect(this.dojoObj, 'onCellClick', this, 'hideMenuDialog');
		        dojo.connect(this.dojoObj,'onCellContextMenu', this, 'showContextMenu');                        
			
		} else {
		    //dojo.connect(this.dojoObj,'onRowStyle', this, '_onRowStyle');
		    dojo.connect(this.dojoObj,'onCellContextMenu', this, '_onCellRightClick');
		    dojo.connect(this.dojoObj, "onApplyCellEdit", this, "cellEditted");
		    dojo.connect(this.dojoObj, 'onClick', this, '_onClick');
		    dojo.connect(this.dojoObj,'onCellDblClick', this,'_onCellDblClick');
		    dojo.connect(this.dojoObj, "sort", this, "_onSort");
                }
/*
	    if (this.dojoObj.views.views[0]) {
		dojo.connect(this.dojoObj.views.views[0], "buildRow", this, "buildRow");
	    }
	    */
	    dojo.connect(this.dojoObj, "onStyleRow", this, "styleRow");
	},
/*
        buildRow: function(inRowIndex, inRowNode) {
	    try {
		var rowData = this.getRowData(inRowIndex);
		if (rowData) {
		    var isNew = this.getRowData(inRowIndex)._wmVariable[0].data._new
		    if (isNew) {
			dojo.addClass(inRowNode, "NewRow");
		    }
		    this.onRenderRow(inRowIndex, inRowNode);
		}
	    } catch(e){ }
	},
	*/
        styleRow: function(inRow) {
	    try {
		var inRowIndex = inRow.index;
		var rowData = this.getRowData(inRowIndex);
		if (rowData) {
		    var isNew = this.getRowData(inRowIndex)._wmVariable[0].data._new
		    if (isNew) {
			inRow.customClasses += " dojoxGridRow-inserting";
		    }
		    this.onStyleRow(inRow, rowData);
		}
	    } catch(e) {}
	},
        onStyleRow: function(inRow/* inRow.customClasses += " myClass" */, rowData) {},
	getDataSet: function() {
		return this.variable;
	},
	setDataSet: function (inValue, inDefault){	    
	    if (this._typeChangedConnect) {
		this.disconnectEvent("typeChanged");
		delete this._typeChangedConnect;
	    }

	    this.dataSet = this.variable = inValue;
	    var updatedColumns = false;
	    if (this.variable) {
		this.dataSetToSelectedItem();

		// If we're in design mode, then subscribe to be notified if the type definition is changed;
		// also call updateColumnData in case the type definition was changed while editting some other page
		if (this._isDesignLoaded) {
		    this._typeChangedConnect = this.connect(this.variable, "typeChanged", this, function() {
			this.updateColumnData(); // if the type changes for this.variable, reapply this variable's new type info
			this.setDojoStore();
			this.renderDojoObj();
		    });
		    this.updateColumnData();
		    updatedColumns = true;
		}
	    }
		if (this._isDesignLoaded && !this._loading && !updatedColumns)
		    this.setColumnData();
	    
	    this._resetStore = true;
	    //this.setDojoStore();
                if (inValue && inValue instanceof wm.Variable)
                    this.selectedItem.setType(inValue.type); // broadcasts a message to all who are bound to the selectedItem
	    if (this.allLibsLoaded()) {
		this.renderDojoObj();
	    } else {
		var thisObj = this;
		dojo.addOnLoad(function(){thisObj.renderDojoObj();});
	    }
	},
    allLibsLoaded: function() {
	for (var i = 0; i < this.requiredLibs.length; i++) {
	    if (!dojo.getObject(this.requiredLibs[i]))
		return false;
	}
	return true;
    },
        setSortIndex: function(inSortIndex, inAsc) {
	    this.dojoObj.setSortIndex(inSortIndex, inAsc);
	},
        setSortField: function(inSortField, inAsc) {
	    var cells = this.dojoObj.layout.cells;
	    for (var i = 0; i < cells.length; i++) {
		if (cells[i].field == inSortField) {
		    this.dojoObj.setSortIndex(cells[i].index, inAsc);
		}
	    }
	},
        customSort: function(a,b) {return "";},
	setDojoStore: function(){
		if (!this.variable){
			this.store = null;
			this.dsType = null;
			return;
		}

		var storeData = {'items':[]};
		var dataList = this.variable.getData() || [];

	    // If the user has provided a customSort method, use it
	    // if its designtime, customSort will be the name of the method rather
	    // than the actual method, so don't try running it 
	    if (this.customSort != this.constructor.prototype.customSort && dojo.isFunction(this.customSort))
		dataList = dataList.sort(this.customSort);


		var dateFields = this.getDateFields();
		dojo.forEach(dataList, function(obj){
			var dates = {};
			dojo.forEach(dateFields, function(f){
				if (obj[f])
					dates[f] = new Date(obj[f]);
			});
		    //obj = wm.flattenObject(obj,true);
			obj = dojo.mixin({},obj, dates);
		}, this);

	    if (dataList) {
		for (var i = 0; i < dataList.length; i++)
		    dataList[i]._wmVariable = this.variable.getItem(i);
	    }

	    storeData.items = dataList;
	    this.store = new dojo.data.ItemFileWriteStore({data: storeData});
	    if (!this.caseSensitiveSort)
		this.makeSortingInsensitive();
	},
	makeSortingInsensitive: function(){
		this.store.comparatorMap = {};
		dojo.forEach(this.columns, function(col){
			if (col.displayType == 'Text')
				this.store.comparatorMap[col.field] = dojo.hitch(this, 'sortNoCase');
		}, this);
	},
	sortNoCase: function(a,b){
	    var a = String(a).toLowerCase();
	    var b = String(b).toLowerCase();
	                                        
	  if (a>b) return 1;
	  if (a<b) return -1;
	  return 0;
	},		
	setQuery: function(q){
		this.query = q;
		if (this.dojoObj)
			this.dojoObj.setQuery(q);
	},
	getStructure: function(){
		var structure = [];

	    if (this.deleteColumn) {
		structure.push({hidden: false,
				name: "-",
				width: "20px",
				"get": dojo.hitch(this, 'getExpressionValue', "'<div class=\\'wmDeleteColumn\\'></div>'"),
				field: "_deleteColumn"});
	    }

		dojo.forEach(this.columns, function(col){
		    var options = col.options || col.editorProps && col.editorProps.options; // editorProps is the currently supported method
			var obj = {	hidden:(!col.show), 
					field: col.field, 
					constraint: col.constraints,
					name:col.title ? col.title : "-", 
					width: col.width,
					fieldType:col.fieldType == "dojox.grid.cells._Widget" && col.editorProps && col.editorProps.regExp ? "dojox.grid.cells.ValidationTextBox" : col.fieldType,
					widgetProps: col.editorProps,
					options: typeof options == "string" ? options.split(/\s*,\s*/) : options,
					editable:col.editable || col.fieldType, // col.editable is obsolete
					expression:col.expression, 					
					displayType:col.displayType};
		    if (obj.widgetProps) {
			obj.widgetProps = dojo.mixin({owner:this}, obj.widgetProps);
			if (obj.fieldType == "dojox.grid.cells.ComboBox") {
			    obj.fieldType = "wm.grid.cells.ComboBox";
			    obj.widgetProps.searchAttr = obj.widgetProps.displayField;
			}
		    }
		    if (obj.fieldType == "dojox.grid.cells.DateTextBox") {
			obj.fieldType = "wm.grid.cells.DateTextBox";
		    }
		    if (obj.fieldType == "wm.grid.cells.DateTextBox") {
			if (!obj.widgetProps) {
			    obj.widgetProps = {owner: this};
			}
		    }

		    if (col.editorProps && col.editorProps.selectDataSet && col.fieldType == "dojox.grid.cells.ComboBox") {
			var selectDataSet = this.owner.getValueById(col.editorProps.selectDataSet);
			if (selectDataSet) {
			    if (!selectDataSet.isEmpty()) {
				var options = [];
				var count = selectDataSet.getCount();
				for (var i = 0; i < count; i++) {
				    var item = selectDataSet.getItem(i);
				    options.push({name: item.getValue(col.editorProps.displayField), dataValue: item.getData()});
				}
				obj.options = options;
			    }
			    if (this["_connectOnSetData." + col.field]) dojo.disconnect(this["_connectOnSetData." + col.field]);
			    this["_connectOnSetData." + col.field] = this.connect(selectDataSet, "onSetData", dojo.hitch(this, "updateEditorDataSet", selectDataSet, col.field)); // recalculate the columns/regen the grid each time our dataSet changes
			}
		    }
				
		    /* TODO: Add more style options; a bold column? A column with a thick right border?  Let the user edit it as style... */
			if (col.align && col.align != ''){
				obj.styles = 'text-align:'+col.align + ';';				
			}
			
		    if (col.formatFunc && col.formatFunc != '' || col.backgroundColor || col.textColor || col.cssClass) {
			    /* TODO: Localize? */
				switch(col.formatFunc){
					case 'wm_date_formatter':
					case 'Date (WaveMaker)':				    
				    obj.formatter = dojo.hitch(this, 'dateFormatter', col.formatProps||{}, col.backgroundColor, col.textColor, col.cssClass);
						break;
					case 'wm_localdate_formatter':
					case 'Local Date (WaveMaker)':				    
						obj.formatter = dojo.hitch(this, 'localDateFormatter',  col.formatProps||{}, col.backgroundColor, col.textColor, col.cssClass);
						break;
					case 'wm_time_formatter':
					case 'Time (WaveMaker)':				    
						obj.formatter = dojo.hitch(this, 'timeFormatter',  col.formatProps||{}, col.backgroundColor, col.textColor, col.cssClass);
						break;
					case 'wm_number_formatter':
					case 'Number (WaveMaker)':				    
						obj.formatter = dojo.hitch(this, 'numberFormatter',  col.formatProps||{}, col.backgroundColor, col.textColor, col.cssClass);
						break;
					case 'wm_currency_formatter':
					case 'Currency (WaveMaker)':				    
						obj.formatter = dojo.hitch(this, 'currencyFormatter',  col.formatProps||{}, col.backgroundColor, col.textColor, col.cssClass);
						break;
					case 'wm_image_formatter':
					case 'Image (WaveMaker)':				    
						obj.formatter = dojo.hitch(this, 'imageFormatter',  col.formatProps||{}, col.backgroundColor, col.textColor, col.cssClass);
						break;
					case 'wm_link_formatter':
					case 'Link (WaveMaker)':				    
						obj.formatter = dojo.hitch(this, 'linkFormatter',  col.formatProps||{}, col.backgroundColor, col.textColor, col.cssClass);
						break;

					case 'wm_button_formatter':
				                obj.formatter = dojo.hitch(this, 'buttonFormatter',  col.field, col.formatProps||{}, col.backgroundColor, col.textColor, col.cssClass);
						break;

				    break;
					default:

					     obj.formatter = dojo.hitch(this, 'customFormatter', col.formatFunc, col.backgroundColor, col.textColor, col.cssClass);

				    
						break;
				}
		    }

			if (obj.fieldType && obj.fieldType != '') {
				obj.type = dojo.getObject(obj.fieldType);
			}
		    if (obj.expression && obj.expression != '' && !obj.get) {
				obj.get = dojo.hitch(this, 'getExpressionValue', obj.expression);
			} else if (obj.field && obj.field.indexOf('.') != -1 && !obj.get) {
				// If there's a object hirarchy, dojo does not support that but user is trying to show data from child object in a column.
				// For example:	dataSet = [{name:'account name', contact:{ name:'contact name'}}, ...]
				// and user has two columns -> name, contact.name
				// then we include a default expression to get values for contact.name
				obj.get = dojo.hitch(this, 'getExpressionValue', '${' + obj.field + '}');
			}

		    structure.push(obj);
		}, this);

		
	    structure = [structure];
	    if (this.selectionMode == "checkbox")
		structure.unshift({type: "dojox.grid._CheckBoxSelector"});
	    else if (this.selectionMode == "radio")
		structure.unshift({type: "dojox.grid._RadioSelector"});

	    return structure; 
	},

    /* Hack to update the combobox editor items without rerendering the grid */
    updateEditorDataSet: function(dataSet, fieldId) {
	var cells = this.dojoObj.layout.cells;
	if (cells) {
	    for (var i = 0; i < cells.length; i++) {
		if (cells[i].field === fieldId) {
		    cells[i].options = dataSet.getData();
		    if (cells[i].widget) {
			cells[i].widget.set("store", wm.grid.cells.ComboBox.prototype.generateStore(cells[i].options, cells[i].widgetProps.displayField));
		    }
		    break;
		}
	    }
	}
    },
    getColumnIndex: function(inFieldName) {
          for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].field == inFieldName) {
		return i;
	    }
	  }
	return -1;
    },
    getColumn: function(inFieldName) {
	var index = this.getColumnIndex(inFieldName);
	if (index != -1)
	    return this.columns[index];
    },
    setColumns: function(inColumns) {
	this.columns = inColumns;
	this.renderDojoObj();
    },

    setColumnShowing: function(inFieldName, inShowing, noRender) {
	var index = this.getColumnIndex(inFieldName);
	if (index != -1 && this.columns[index].show != inShowing) {	    
	    this.columns[index].show = inShowing;
	    if (!noRender) {
		this.renderDojoObj();
	    }
	}
    },
    getColumnShowing: function(inFieldName, inShowing, noRender) {
	var index = this.getColumnIndex(inFieldName);
	if (index != -1) 
	    return this.columns[index].show;
    },

    setColumnWidth: function(inFieldName, inWidth, noRender) {
	var index = this.getColumnIndex(inFieldName);
	if (index != -1 && this.columns[index].width != inWidth) {	    
	    this.columns[index].width = inWidth;
	    if (!noRender) {
		this.renderDojoObj();
	    }
	}
    },

    setColumnComboBoxOptions: function(inFieldName, inOptions) {
          for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].field == inFieldName) {
		this.columns[i].options = inOptions;
		this.columns[i].fieldType = "dojox.grid.cells.ComboBox";
		this.renderDojoObj();
		break;
            }
          }
    },
        //onGetStructure: function(inStructure) {},
	setColumnData: function () {
	    if (!this.variable || (this.variable.type == this.dsType && this.columns.length > 0)) {
	        return;
	    }

	    this.dsType = this.variable.type;
	    this.columns = [];
	    var viewFields = this.getViewFields();
	    dojo.forEach(viewFields, function (f, i) {
	        var align = 'left';
	        var width = '100%';
	        var formatFunc = '';
	        if (f.displayType == 'Number') {
	            align = 'right';
	            width = '80px';
	        } else if (f.displayType == 'Date') {
	            width = '80px';
	            formatFunc = 'wm_date_formatter';
	        }
	        this.columns.push({
	            show: i < 15,
	            field: f.dataIndex,
	            title: f.caption,
	            width: width,
	            displayType: f.displayType,
	            align: align,
	            formatFunc: formatFunc
	        });
	    }, this);

	    if (this.isDesignLoaded()) {
	        if (!this.contextMenu) this.designCreate(); // special case from themedesigner
	        this.contextMenu.setDataSet(this.columns);
	    }
	},

    // if the type changes, we need to adjust rather than regenerate our columns
    updateColumnData: function () {
	var defaultSchema = {dataValue: {type: this.variable.type}}; // this is the schema to use if there is no schema (i.e. the type is a literal)
        var viewFields = this.getViewFields() || defaultSchema;
        dojo.forEach(viewFields, function (f, i) {
            // if the column already exists, skip it
            if (dojo.some(this.columns, function (item) {
                return item.field == f.dataIndex;
            })) return;

	    var schema = wm.typeManager.getTypeSchema(this.variable.type) || defaultSchema;
            // don't show one-to-many subentities in the grid
            if (wm.typeManager.isPropInList(schema, f.dataIndex)) return;

            var align = 'left';
            var width = '100%';
            var formatFunc = '';
            if (f.displayType == 'Number') {
                align = 'right';
                width = '80px';
            } else if (f.displayType == 'Date') {
                width = '80px';
                formatFunc = 'wm_date_formatter';
            }
            this.columns.push({
                show: i < 15,
                field: f.dataIndex,
                title: wm.capitalize(f.dataIndex),
                width: width,
                displayType: f.displayType,
                align: align,
                formatFunc: formatFunc
            });
        }, this);

        var newcolumns = [];
        dojo.forEach(this.columns, dojo.hitch(this, function (col) {
            // we don't update custom fields
            if (col.isCustomField) {
                newcolumns.push(col);
                return;
            }
            // If the column is still in the viewFields after whatever change happened, then do nothing
            if (dojo.some(viewFields, dojo.hitch(this, function (field) {
                return field.dataIndex == col.field;
            }))) {
                newcolumns.push(col);
                return;
            }

            // col is no longer relevant
            return;
        }));
        this.columns = newcolumns;

/*
	if (this.isDesignLoaded()) {
	    if (!this.contextMenu) this.designCreate(); // special case from themedesigner
	    this.contextMenu.setDataSet(this.columns);
	}
	*/
    },

	getDateFields: function(){
		var dateFields = [];
		dojo.forEach(this.columns, function(col){
			if (col.displayType == 'Date')
				dateFields.push(col.field)	;
		});
		
		return dateFields;
	},
	setSelectionMode: function(inMode) {
	  this.selectionMode = inMode;
	    if (inMode == "checkbox")
		inMode = "multiple";
	    else if (inMode == "radio")
		inMode = "single";
	    this._selectionMode = inMode;
	  if (this.dojoObj) this.dojoObj.selection.setMode(inMode);
	},
	getViewFields: function(){
		var fields = [];
		if (this.variable instanceof wm.LiveVariable)
			fields = this.variable.getViewFields();
		else if (this.variable instanceof wm.Variable)
      fields = wm.getDefaultView(this.variable.type) || [];
		return fields;
	},
    setDeleteColumn: function(inDelete) {
	this.deleteColumn = inDelete;
	this.renderDojoObj();
    },


	_onGridEvent: function(evt){
		var params = {};

		if (!evt.grid){
		    if (dojo.IEGridEvent) {
			evt.target = dojo.IEGridEvent.target;
			evt.grid = dojo.IEGridEvent.grid;
			evt.cell = dojo.IEGridEvent.cell;
			evt.cellIndex = dojo.IEGridEvent.cellIndex;
			evt.rowIndex = dojo.IEGridEvent.rowIndex;
			evt.rowNode  = dojo.IEGridEvent.rowNode;
			evt.sourceView = dojo.IEGridEvent.sourceView;
		    } else 
			return {};
		}
		
		params.cellNode = evt.cellNode;
		params.rowNode = evt.rowNode;
		params.rowId = evt.rowIndex;
		params.selectedItem = this.selectedItem;
	        if (evt.cell)
		    params.fieldId = evt.cell.field;
		return params;
	},
        _onSort: function() {
		var selectedData = this.selectedItem.getData();
		if (selectedData)
			this.selectItemOnGrid(this.selectedItem);
	    var structure = this.dojoObj.structure[0];
	    var fieldName = structure[Math.abs(this.dojoObj.sortInfo)-1].field;
	    this.onSort(fieldName);
	},
        onSort: function(inSortField) {
	},
	_onClick: function(evt){
		var params = this._onGridEvent(evt);

    // This will happen if user clicks on empty area of grid.
		if (!params.rowId && params.rowId != 0)
			return;
		if (params.rowId == -1){
		    this.onHeaderClick(evt, params.selectedItem, params.rowId, params.fieldId, params.rowNode, params.cellNode);	
		} else if (params.fieldId == "_deleteColumn"){
		    var rowData = this.getRow(params.rowId);
		    if (this.deleteConfirm) {
			app.confirm(this.deleteConfirm, false, dojo.hitch(this, function() {
			    this.deleteRow(params.rowId);
			    this.onRowDeleted(params.rowId, rowData);
			}));
		    } else {
			this.deleteRow(params.rowId);
			this.onRowDeleted(params.rowId, rowData);
		    }
		} else {
		    this.onClick(evt, params.selectedItem, params.rowId, params.fieldId, params.rowNode, params.cellNode);
		}
	},
	_onCellDblClick: function(evt){
		var params = this._onGridEvent(evt);
		this.onCellDblClick(evt, params.selectedItem, params.rowId, params.fieldId, params.rowNode, params.cellNode);
	},
	_onCellRightClick: function(evt){
		var params = this._onGridEvent(evt);
		this.onCellRightClick(evt, params.selectedItem, params.rowId, params.fieldId, params.rowNode, params.cellNode);
	},
        onRowDeleted: function(rowId, rowData) {},
	onClick: function(evt, selectedItem, rowId, fieldId, rowNode, cellNode){
	},
	onCellDblClick: function(evt, selectedItem, rowId, fieldId, rowNode, cellNode){
	},
	onCellRightClick: function(evt, selectedItem, rowId, fieldId, rowNode, cellNode){
	},
  onCellEdited: function(inValue, rowId, fieldId) {},
	onHeaderClick: function(evt, selectedItem, rowId, fieldId, rowNode, cellNode){
  }, 
  onSelectionChange: function() {},
  onSelect: function() {},
    onDeselect: function() {},
        addColumnToCSV: function(csvArray, value, formatFunc){
	    if (dojo.isString(value))
		value = value.replace(/\"/g, '\\\"');
		csvArray.push("\"" + value + "\"");
		csvArray.push(',');
	},
	addBreakToCSV: function(csvArray){
		csvArray.pop(); // this pops the last comma.
		csvArray.push('\n');
	},
	showCSVData: function(){
/*
		if (!this.csvDialog){
			this.csvDialog = new dijit.Dialog({ title: "CSV Data for " + this.name});
			dojo.body().appendChild(this.csvDialog.domNode);
			this.csvDialog.startup();
		}
		
		this.csvDialog.attr('content', this.toCSV());
		this.csvDialog.show();
*/
	    app.echoFile(this.toCSV(), "text/csv", this.name + ".csv");
	},
    toHtml: function() {
	var html = "<table border='0' cellspacing='0' cellpadding='0' class='wmdojogrid'><thead><tr>";
		dojo.forEach(this.columns, function(col, idx){
			if (!col.show)
				return;
		    html += "<th style='" + (col.width.match(/px/) ? col.width : "") + "'>" + col.title + "</th>";
		}, this);
	html += "</tr></thead><tbody>";

		var dataList = this.variable.getData();
	dojo.forEach(dataList, function(obj, rowId){
			dojo.forEach(this.columns, function(col, idx){
				if (!col.show)
					return;
			    try {
				var value = obj[col.field || col.id];
			    if (!value) {
				var value = obj;
				var colid = col.field || col.id;
				while(colid.indexOf(".") != -1) {
				    var index = colid.indexOf(".");
				    value = value[colid.substring(0,index)];
				    colid = colid.substring(index+1);

				}
				value = value[colid];
			    }
				if (col.expression){
					value = this.getExpressionValue(col.expression, idx, obj, true);
				} else if (col.formatFunc){
					switch(col.formatFunc){
						case 'wm_date_formatter':
					        case 'Date (WaveMaker)':				    
							value = this.dateFormatter(value);			
							break;
						case 'wm_localdate_formatter':
					        case 'Local Date (WaveMaker)':				    
							value = this.localDateFormatter(value);			
							break;
						case 'wm_time_formatter':
					        case 'Time (WaveMaker)':				    
							value = this.timeFormatter(value);			
							break;
						case 'wm_number_formatter':
					        case 'Number (WaveMaker)':				    
							value = this.numberFormatter(value);	
							break;
						case 'wm_currency_formatter':
					        case 'Currency (WaveMaker)':				    
							value = this.currencyFormatter(value);	
							break;
						case 'wm_image_formatter':
					        case 'Image (WaveMaker)':				    
					    // spreadsheet shouldn't be given HTML
							//value = this.imageFormatter(value);	
							break;
						case 'wm_link_formatter':
					        case 'Link (WaveMaker)':				    
					    // spreadsheet shouldn't be given HTML
					    //value = this.linkFormatter(value);	
							break;

						default:
							if (!this.isDesignLoaded())
							    value = dojo.hitch(this.owner, col.formatFunc)(value, rowId, idx, col.field || col.id, {}, obj);
							break;
					}
				}
			    } catch(e){value = "";}
			    html += "<td>" + value + "</td>";
			}, this);
		    html += "</tr>";
		}, this);
		
	return html += "</tbody></table>";
	},


	toCSV: function(){
		var csvData = [];
		dojo.forEach(this.columns, function(col, idx){
			if (!col.show)
				return;
		    this.addColumnToCSV(csvData, col.title, col.formatFunc);
		}, this);
		
		if (csvData.length == 0){
			return 'CSV Data cannot be extracted for this Grid.';
		}
		
		this.addBreakToCSV(csvData);
		
		var dataList = this.variable.getData();
	        dojo.forEach(dataList, function(obj, rowId){
			dojo.forEach(this.columns, function(col, idx){
				if (!col.show)
					return;
			    try {
				var value = obj[col.field ];
			    if (!value) {
				var value = obj;
				var colid = col.field;
				while(colid.indexOf(".") != -1) {
				    var index = colid.indexOf(".");
				    value = value[colid.substring(0,index)];
				    colid = colid.substring(index+1);

				}
				value = value[colid];
			    }
				if (col.expression){
					value = this.getExpressionValue(col.expression, idx, obj, true);
				} else if (col.formatFunc){
				    /* TODO FOR 6.5: Calls to formatters are missing some parameters; at least pass null if no parameter is needed */
					switch(col.formatFunc){
						case 'wm_date_formatter':
					        case 'Date (WaveMaker)':				    
							value = this.dateFormatter(value);			
							break;
						case 'wm_localdate_formatter':
					        case 'Local Date (WaveMaker)':				    
							value = this.localDateFormatter(value);			
							break;
						case 'wm_time_formatter':
					        case 'Time (WaveMaker)':				    
							value = this.timeFormatter(value);			
							break;
						case 'wm_number_formatter':
					        case 'Number (WaveMaker)':				    
							value = this.numberFormatter(value);	
							break;
						case 'wm_currency_formatter':
					        case 'Currency (WaveMaker)':				    
							value = this.currencyFormatter(value);	
							break;
						case 'wm_image_formatter':
					        case 'Image (WaveMaker)':				    
					    // spreadsheet shouldn't be given HTML
							//value = this.imageFormatter(value);	
							break;
						case 'wm_link_formatter':
					        case 'Link (WaveMaker)':				    
					    // spreadsheet shouldn't be given HTML
					    //value = this.linkFormatter(value);	
							break;

						default:
							if (!this.isDesignLoaded())
							    value = dojo.hitch(this.owner, col.formatFunc)(value, rowId, idx, col.field || col.id, {}, obj);
							break;
					}
				}
			    } catch(e){value = "";}
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
		if (typeof dataObj == "object" && dataObj !== null && dataObj._0 !== undefined)
			json = this.itemToJSONObject(this.store, dataObj);
		if (!json)
			return expValue;
		try
		{
		    expValue = wm.expression.getValue(exp, json, this.owner);
		}
		catch(e)
		{
			// User entered a wrong expression and so we will return value as ".." for the grid column.
		}
	    return expValue;
	},
    dateFormatter: function(formatterProps, backgroundColorFunc, textColorFunc, cssClassFunc,inValue, rowIdx, cellObj){
	this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);	
	    if (!inValue) {
		return inValue;
	    } else if (typeof inValue == "number") {
		inValue = new Date(inValue);
	    } else if (inValue instanceof Date == false) {
		return inValue;
	    }
	    if (!formatterProps.useLocalTime) {
		inValue.setHours(inValue.getHours() + wm.timezoneOffset);
	    }
	var constraints = {selector:formatterProps.dateType || 'date', formatLength:formatterProps.formatLength || 'short', locale:dojo.locale, datePattern: formatterProps.datePattern, timePattern: formatterProps.timePattern};
	    return dojo.date.locale.format(inValue, constraints);
	},
    /* DEPRECATED */
	localDateFormatter: function(formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
	    this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
	    if (!inValue) {
		return inValue;
	    } else if (typeof inValue == "number") {
		inValue = new Date(inValue);
	    } else if (inValue instanceof Date == false) {
		return inValue;
	    } else if (typeof inDatum == "number") {
		inDatum = new Date(inDatum);
	    } else if (inDatum instanceof Date == false) {
		return inDatum;
	    }
		var constraints = {selector:'date', formatLength:'short', locale:dojo.locale};
		return dojo.date.locale.format(inValue, constraints);
	},
    /* DEPRECATED */
	timeFormatter: function(formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
	    this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
	    if (!inValue) {
		return inValue;
	    } else if (typeof inValue == "number") {
		inValue = new Date(inValue);
	    } else if (inValue instanceof Date == false) {
		return inValue;
	    }
	    inValue.setHours(inValue.getHours() + wm.timezoneOffset,0,0);
	    
	    var constraints = {selector:'time', formatLength:'short', locale:dojo.locale};
	    return dojo.date.locale.format(inValue, constraints);
	},
	numberFormatter: function(formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
	    this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
	    var constraints = {
		places: formatterProps.dijits || 0, 
		round: formatterProps.round ? 0 : -1,
		type: formatterProps.numberType
	    };
	    return dojo.number.format(inValue, constraints);
	},
	currencyFormatter: function(formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
	    this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
	    return dojo.currency.format(inValue, {
		currency: formatterProps.currency || (this._isDesignLoaded ? studio.application.currencyLocale : app.currencyLocale) || wm.getLocaleCurrency(),
		places: formatterProps.dijits == undefined ? 2 : formatterProps.dijits,
		round: formatterProps.round ? 0 : -1
	    });
	},
	imageFormatter: function(formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
	    this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
	    if (inValue && inValue != '') {
		var width = formatterProps.width ? ' width="' + formatterProps.width + 'px"' : "";
		var height = formatterProps.height ? ' height="' + formatterProps.height + 'px"' : "";
		if (formatterProps.prefix)
		    inValue = formatterProps.prefix + inValue;

		if (formatterProps.postfix)
		    inValue = inValue + formatterProps.postfix;

		return '<img ' + width + height + ' src="'+ inValue +'">';
	    }
		return inValue;
	},
    buttonFormatter: function(field, formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
	    this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
	    if (inValue && inValue != '') {
		var classList = formatterProps.buttonclass ? ' class="' + formatterProps.buttonclass + '" ' : ' class="wmbutton" ';
		var onclick = "onclick='" + this.getRuntimeId() + ".gridButtonClicked(\"" + field + "\"," + rowIdx + ")' ";
		return '<button ' + onclick + formatterProps.buttonclick + '" style="width:100%;display:inline-block" ' + classList + '>' + inValue + '</button>';
	    }
	    return inValue;
	},
    gridButtonClicked: function(fieldName, rowIndex) {
	var rowData = this.getRow(rowIndex);
	this.onGridButtonClick(fieldName, rowData, rowIndex);
    },
    onGridButtonClick: function(fieldName, rowData, rowIndex) {},
	linkFormatter: function(formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
	    this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
	    if (inValue && inValue != '') {
		var displayValue = String(inValue);
		var linkValue = String(inValue);
		if (formatterProps.prefix)
		    linkValue = formatterProps.prefix + linkValue;
		if (formatterProps.postfix)
		    linkValue = linkValue + formatterProps.postfix;
		var target = formatterProps.target || "_NewWindow";
		if (linkValue.indexOf("://") == -1 && linkValue.charAt(0) != "/")
		    linkValue = "http://" + linkValue;
		return '<a href="'+ linkValue +'" target="' + target + '">' + displayValue + "</a>";
	    }
	    return inValue;
	},
    customFormatter: function(formatFunc, backgroundColorFunc, textColorFunc,cssClassFunc, inValue, rowIdx, cellObj){
	var rowObj = this.getRow(rowIdx);
	this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);

	if (formatFunc && this.owner[formatFunc]) {
	    return dojo.hitch(this.owner, formatFunc, inValue, rowIdx, cellObj.index, cellObj.field, cellObj, rowObj)();
	}else {
	    return inValue;
	}
    },
    handleColorFuncs: function(cellObj, backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx) {
	var rowObj = this.getRow(rowIdx);
		 if (backgroundColorFunc) {
		     var result = this.getExpressionValue(backgroundColorFunc, null, rowObj, true);
		     if (result) {
			 cellObj.customStyles.push("background-color: " + result);
		     }
		 }

		 if (textColorFunc) {
		     var result = this.getExpressionValue(textColorFunc, null, rowObj, true);
		     if (result) {
			 cellObj.customStyles.push("color: " + result);
		     }
		 }

	if (cssClassFunc) {
		     var result = this.getExpressionValue(cssClassFunc, null, rowObj, true);
		     if (result) {
			 cellObj.customClasses.push(result);
		     }
	}
	     },
	
	
	/* Helper functions for developers */
	
	getNumColumns: function(includeInvisibleColumns){
		if (includeInvisibleColumns)
			return this.columns.length;
		return dojo.filter(this.columns, function(col){return col.show;}).length;
	},
	getNumRows: function(){
		return this.getRowCount();
	},
	getRow: function(idx){
	    var rowData = this.getRowData(idx) || {};
	    var json =  this.itemToJSONObject(this.store, rowData);
	    if (rowData._wmVariable)
		json._wmVariable = rowData._wmVariable[0];
	    return json;
	}
	
	/* Helper functions for developers */
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
	      var attributes = wm.isEmpty(item) ? [] : store.getAttributes(item);
	      attributes = dojo.filter(attributes, function(inValue) {return inValue.indexOf("_") == -1;})
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

dojo.require("dojox.grid.cells.dijit");
dojo.declare("wm.grid.cells.ComboBox", dojox.grid.cells._Widget, {
		widgetClass: dijit.form.ComboBox,
		getWidgetProps: function(inDatum){
			return dojo.mixin({}, this.widgetProps||{}, {
				value: inDatum,
			    store: this.generateStore(this.options, this.widgetProps.displayField)
			});
		},
    generateStore: function(options, displayField) {
			var items=[];
			dojo.forEach(options, function(o){
			    //items.push(o.dataValue);
			    items.push(o);
			});
			var store = new dojo.data.ItemFileReadStore({data: {identifier: displayField, items: items}});
	return store;
    },
		apply: function(inRowIndex){		    
		    //this.inherited(arguments);
		    if (this.grid.canEdit(this, inRowIndex)) {
			if (!this.widget) return;
		    var name = this.field;
		    var objName = name.replace(/\..*?$/,"");
		    var item = this.widget.item;
		    var store = this.widget.store;
		    if (this.widgetProps.owner) {
			var value = this.widgetProps.owner.itemToJSONObject(store, item);
			var rowitem = this.grid.getItem(inRowIndex);
			this.grid.doApplyCellEdit(value, inRowIndex, objName);
		    }
		    }
		    this._finish(inRowIndex);

		},

		getValue: function(){
			var e = this.widget;
			// make sure to apply the displayed value
			e.set('displayedValue', e.get('displayedValue'));
			return e.get('value');
		}
	});

dojo.declare("wm.grid.cells.DateTextBox", dojox.grid.cells.DateTextBox, {
    apply: function(inRowIndex){
	var owner = this.widgetProps.owner;
	var column = owner.getColumn(this.field);
	var formatterProps = column.formatterProps;
	var useLocalTime = formatterProps && formatterProps.useLocalTime;	
	var value = this.getValue(inRowIndex);
	if (!useLocalTime) {
	    value.setHours(-wm.timezoneOffset,0,0);
	}
	this.applyEdit(value, inRowIndex);
	this._finish(inRowIndex);
    }    

});



	dojo.declare("dojox.grid.cells.NumberTextBox", dojox.grid.cells._Widget, {
		widgetClass: dijit.form.NumberTextBox
	});
	dojox.grid.cells.NumberTextBox.markupFactory = function(node, cell){
		dojox.grid.cells._Widget.markupFactory(node, cell);
	};



	dojo.declare("dojox.grid.cells.ValidationTextBox", dojox.grid.cells._Widget, {
	    widgetClass: dijit.form.ValidationTextBox,
		getWidgetProps: function(inDatum){
		    var props = this.inherited(arguments);
		    return props;
		},

	});
	dojox.grid.cells.ValidationTextBox.markupFactory = function(node, cell){
		dojox.grid.cells._Widget.markupFactory(node, cell);
	};
	dojo.declare("dojox.grid.cells.TimeTextBox", dojox.grid.cells._Widget, {
		widgetClass: dijit.form.TimeTextBox
	});
	dojox.grid.cells.TimeTextBox.markupFactory = function(node, cell){
		dojox.grid.cells._Widget.markupFactory(node, cell);
	};
