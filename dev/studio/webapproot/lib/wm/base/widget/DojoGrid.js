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
    liveEditing: false,
	selectedItem: null,
	emptySelection: true,
	isRowSelected: false,
	selectionMode: "single",
	addDialogName:'',
	addFormName:'',
	columns:[],
	selectFirstRow: false,
	caseSensitiveSort:true,
	
	init: function() {
		dojo['require']("dojox.grid.DataGrid");
		dojo['require']("dojox.grid.cells.dijit");
		dojo['require']("dojo.data.ItemFileWriteStore");
		dojo['require']("dojo.string");
		dojo['require']("wm.base.lib.currencyMappings");
		dojo['require']("dijit.Dialog");

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

		if (this.variable && this.variable.getData()) 
			this.renderDojoObj();
	},
	dataSetToSelectedItem: function() {
		this.selectedItem.setLiveView((this.variable|| 0).liveView);
		this.selectedItem.setType(this.variable && this.variable.type ? this.variable.type : "any");
	},
	setSelectedRow: function(rowIndex, isSelected) {
	    if (this._setRowTimeout) {
		window.clearTimeout(this._setRowTimeout);
		delete this._setRowTimeout;
	    }

	  if (isSelected == undefined) 
	    isSelected = true;
	  if (isSelected) {
	    this.dojoObj.selection.select(rowIndex);
	  } else {
	    this.dojoObj.selection.setSelected(rowIndex,isSelected);
	  }
	},
	selectItemOnGrid: function(obj, pkList){
		if (!this.store)
			return;
		if (obj instanceof wm.Variable)
			obj = obj.getData();

		var dateFields = this.getDateFields();
		if (!pkList)
			pkList = wm.data.getIncludeFields(this.variable.type);
		var q = {};
		dojo.forEach(pkList, function(f){
			q[f] = obj[f];
		        if (dojo.indexOf(dateFields, f) != -1)
				q[f] = new Date(obj[f]);
		});

		var _this = this;
		var sItem = function(items, request){
		        if (items.length < 1) {
                            _this.deselectAll();
			    return;
                        }
		    var idx =  _this.dojoObj.getItemIndex(items[0]);
		    if (idx == -1)
			idx = _this.variable.getItemIndexByPrimaryKey(obj, pkList) || -1;
		    if (idx >= 0)
			this._setRowTimeout = setTimeout(function(){
			    _this.dojoObj.scrollToRow(idx);
			    wm.onidle(_this, function() {
				this.setSelectedRow(idx);
			    });
			},0);
                    else 
                        _this.deselectAll();
		};
		this.store.fetch({query:q, onComplete: sItem});
	},
	deselectAll: function() {
            if (this.dojoObj)
                this.dojoObj.selection.clear();
	    this.updateSelectedItem(-1);
	    this.onSelectionChange();
	},

    select: function(rowIndex, isSelected) {
        this.setSelectedRow(rowIndex, isSelected);
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
		if (this.selectionMode == 'multiple')
			this.updateAllSelectedItem();
		else
			this.updateSelectedItem( this.getSelectedIndex());
		if (!this.rendering)
		    this.onSelectionChange();
                this._curSelectionObj = [];
                for (var i = 0; i < newSelection.length; i++)
                    this._curSelectionObj.push(newSelection[i]);
            }

	},
	cellEditted: function(inValue, inRowIndex, inFieldName) {
		// values of the selectedItem must be updated, but do NOT call a selectionChange event, as its the same selected item, just different values
		var rowIdx = this.getSelectedIndex();
		if (rowIdx != inRowIndex) {
			this.setSelectedRow(inRowIndex, true);
		}
	    var oldObj = this.selectedItem.getData();
	    if (oldObj[inFieldName] == inValue)
		return;


	    // A bug in dojox.grid editting causes it to set "user.name" but read from "user: {name: currentname}" so we copy in the data to compenate
	    if (inFieldName.indexOf(".")) {
		var elements = inFieldName.split(".");
		var firstElement = elements.shift();
		var obj = this.getCell(inRowIndex, firstElement);
		if (obj[elements.join(".")])
		    obj[elements.join(".")][0] = inValue;
		else
		    obj[elements.join(".")] = [inValue];                
	    }

		this.updateSelectedItem( this.getSelectedIndex());
	        if (this.liveEditing)
		    this.writeSelectedItem();

	    // A bug in dojox.grid editting causes it to set "user.name" but read from "user: {name: currentname}" so we copy in the data to compenate
	    if (inFieldName.indexOf(".")) {
		var elements = inFieldName.split(".");
		var firstElement = elements.shift();
		var obj = this.getCell(inRowIndex, firstElement);
		if (obj[elements.join(".")])
		    obj[elements.join(".")][0] = inValue;
		else
		    obj[elements.join(".")] = [inValue];

	    }
		this.onCellEdited(inValue, inRowIndex, inFieldName);
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
	    this.setValue("isRowSelected", this.hasSelection());
	},

    createNewLiveVariable: function() {
	return new wm.LiveVariable({owner: this,
				    operation: "update",
				    name: "liveVar",
				    liveSource: this.getDataSet().liveSource,
				    autoUpdate: false,
				    startUpdate: false});
    },
    writeSelectedItem: function() {
	var deferred;
	var rowIndex = this.getSelectedIndex();
	var operation = this.getRow(rowIndex)._new ? "insert" : "update";
	var sourceData = this.selectedItem.getData();
	if (operation == "insert") {
	    this.setCell(rowIndex, "_new", false); // after we insert it, all future ops are update
	    for (prop in sourceData)
		if (sourceData[prop] == "&nbsp;")
		    sourceData[prop] = "";
	}

	if (!this.liveVariables) {
	    this.liveVariables = [];
	    this.liveVariables.unshift(this.createNewLiveVariable());
	}
	var livevar = 	this.liveVariables[0];
	if (livevar._requester) {
	    if (this._writingSelectedItemTimeStamp == this._selectedItemTimeStamp && operation != "insert") {
		// for this case we Could create a new variable or reuse an old one, 
		// but I don't want to worry about a possible race condition between writing
		// selectedItem after change 1, after change 2 and after change 3...
		livevar.setSourceData(sourceData);

		livevar.operation = operation;
		livevar.setUpdateOnResult(true);
	    } else {
		livevar = null;
		for (var i = 0; i < this.liveVariables.length; i++) {
		    if (!this.liveVariables[i]._requester) {
			livevar = this.liveVariables[i];
			break;
		    }
		    if (!livevar) {
			this.liveVariables.unshift(this.createNewLiveVariable());
			livevar = this.liveVariables[0];
		    }
		    livevar.setSourceData(sourceData);
		    livevar.operation = operation;
		    deferred = livevar.update();
		}
	    }
	}else {
	    livevar.setSourceData(sourceData);
	    this._writingSelectedItemTimeStamp = this._selectedItemTimeStamp;
	    livevar.operation = operation;
	    deferred = livevar.update();
	    }
	if (operation == "insert")
	    this.handleInsertResult(deferred,rowIndex); // in separate method to localize the variables
	},
    handleInsertResult: function(deferred,rowIndex) {
	deferred.addCallback(dojo.hitch(this, 
				    function(result) {
					this.setUneditableFields(rowIndex, result);
				    }));
	deferred.addErrback(dojo.hitch(this,
				    function(result) {
					console.error(result);
					this.deleteRow(rowIndex);
				    }));
    },
    setUneditableFields: function(rowIndex, data) {
	var oldData = this.getRow(rowIndex);
	var type = wm.typeManager.getType(this.getDataSet().type);
	var columns = this.columns;
	for (var i = 0; i < columns.length; i++) {
	    var field = type.fields[columns[i].id];
	    if (field.exclude.length) {
		this.setCell(rowIndex, columns[i].id, data[columns[i].id]);
	    } else if (oldData[columns[i].id] == "&nbsp;")
		oldData[columns[i].id] = ""; // only needed &nbsp; so that the row wasn't 1px high
	}

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
		//this.setValue("emptySelection", !this.hasSelection());
	},
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
        getCellNode: function(rowIndex, fieldName) {
	    var cells = this.dojoObj.layout.cells;
	    for (var i = 0; i < cells.length; i++) {
		if (cells[i].field == fieldName) {
		    return this.dojoObj.layout.cells[i].getNode(rowIndex);
		}
	    }
	},
	/* This method is flawed; tab does not work if cells are edited this way */
	editCell: function(rowIndex, fieldName) {
	  var cells = this.dojoObj.layout.cells;
	  for (var i = 0; i < cells.length; i++) {
	    if (cells[i].field == fieldName) {
		this.dojoObj.edit.setEditCell(cells[i], rowIndex);
		this.dojoObj.focus.setFocusCell(cells[i],rowIndex);
		return;
	    }
	  }
	},
        setCell: function(rowIndex, fieldName, newValue, noRendering) {
	  if (rowIndex < 0) {
	    console.error("setCell requires 0 or greater for row index");
	    return;
	  }

	    var item = this.dojoObj.getItem(rowIndex);

	    this.dojoObj.store._setValueOrValues(item, fieldName, newValue, !noRendering);

	      this.updateSelectedItem(rowIndex);

	},
	deleteRow: function(rowIndex) {
	    if (this.liveEditing) {
		if (!this.liveVariables) {
		    this.liveVariables = [];
		    this.liveVariables.unshift(this.createNewLiveVariable());
		}
		var livevar = this.liveVariables[0];
		if (livevar._requester) { 
		    // could just create a new variable, but I'm being lazy for my first pass
		    app.toastWarning(wm.getDictionaryItem("wm.DojoGrid.TOAST_DELETE_LATER"))
		    return;
		}
		livevar.operation = "delete";
		livevar.setSourceData(this.getRow(rowIndex));
		livevar.update();
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

	  var schema = this.selectedItem._dataSchema;
	  for (var key in schema) {
	    if (!(key in data)) {
	      data[key] = "";
	    }
	  }
	    data._new = true;

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
    addEmptyRow: function(selectOnAdd) {
	var type = wm.typeManager.getType(this.getDataSet().type);
	var obj = {};
	for (var prop in type.fields) {
	    switch(type.fields[prop].type) {
	    case "java.lang.Integer":
	    case "java.lang.Double":
	    case "java.lang.Float":
	    case "java.lang.Short":
		obj[prop] = "0";
		break;
	    case "java.lang.Date":
		obj[prop] = new Date().getTime();
		break;
	    case "java.lang.Boolean":
		obj[prop] = false;
		break;
	    default:
		obj[prop] = "&nbsp;";
	    }
	}
	this.addRow(obj,selectOnAdd);
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
	getIsRowSelected: function(){
		return !this.getEmptySelection();
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

		if (!this.variable)
			return;
		
	    if (this.isAncestorHidden()) {
		if (!this._layerConnections) 
		    this.connectToAllLayers(this, "renderDojoObj");
		return;
	    } else if (this._layerConnections) {
		this.disconnectFromAllLayers();
	    }
		this.rendering = true;
		var structure = this.getStructure();
		if (structure[0].length == 0)
			structure = {};

	    var props = {escapeHTMLInData:false, structure:structure, store:this.store, singleClickEdit: this.singleClickEdit, columnReordering:true, query: this.query || {}};
	    this.addDojoProps(props);
		this.dojoObj = new dojox.grid.DataGrid(props,dojo.create('div', {style:'width:100%;height:100%'}, this.gridNode));
		this.connectDojoEvents();
		this.setSelectionMode(this.selectionMode);
		this.dojoRenderer();
		
		if (!this.selectedItem.getData() && this.selectFirstRow)
			this.updateSelectedItem(0);

		var selectedData = this.selectedItem.getData();
		if (selectedData)
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
		    dojo.connect(this.dojoObj,'onCellContextMenu', this, '_onCellRightClick');
		    dojo.connect(this.dojoObj, "onApplyCellEdit", this, "cellEditted");
		    dojo.connect(this.dojoObj, 'onClick', this, '_onClick');
		    dojo.connect(this.dojoObj,'onCellDblClick', this,'_onCellDblClick');
                }
	},
	getDataSet: function() {
		return this.variable;
	},
	setDataSet: function (inValue, inDefault){	    
	    if (this._typeChangedConnect) {
		this.disconnectEvent("typeChanged");
		delete this._typeChangedConnect;
	    }

	    this.variable = inValue;
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
		this.setDojoStore();
                if (inValue && inValue instanceof wm.Variable)
                    this.selectedItem.setType(inValue.type); // broadcasts a message to all who are bound to the selectedItem
		var thisObj = this;
		dojo.addOnLoad(function(){thisObj.renderDojoObj();});
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
		var dataList = this.variable.getData();

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
			storeData.items[storeData.items.length] = dojo.mixin({},obj, dates);
		}, this);
		this.store = new dojo.data.ItemFileWriteStore({data: storeData});

		if (!this.caseSensitiveSort)
			this.makeSortingInsensitive();
	},
	makeSortingInsensitive: function(){
		this.store.comparatorMap = {};
		dojo.forEach(this.columns, function(col){
			if (col.displayType == 'Text')
				this.store.comparatorMap[col.id] = dojo.hitch(this, 'sortNoCase');
		}, this);
	},
	sortNoCase: function(a,b){
	  var a = a.toLowerCase();
	  var b = b.toLowerCase();
	                                        
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
		var hasAutoField = false;
		dojo.forEach(this.columns, function(col){
			var obj = {	hidden:(!col.show), 
					field: col.id, 
					name:col.title, 
					width: col.width == '100%' ? 'auto' : col.width, 
					fieldType:col.fieldType, 
					options: col.options, // at the moment, there's no UI for entering these, but I can hard code adding these into my page.js
					editable:col.editable || col.fieldType, // col.editable is obsolete
					expression:col.expression, 
					displayType:col.displayType};

			if (col.show && obj.width && obj.width == 'auto')
				hasAutoField = true;
				
			if (col.align && col.align != ''){
				obj.styles = 'text-align:'+col.align + ';';				
			}
			
			if (col.formatFunc && col.formatFunc != ''){
			    /* TODO: Localize? */
				switch(col.formatFunc){
					case 'wm_date_formatter':
					case 'Date (WaveMaker)':				    
						obj.formatter = dojo.hitch(this, 'dateFormatter');			
						break;
					case 'wm_localdate_formatter':
					case 'Local Date (WaveMaker)':				    
						obj.formatter = dojo.hitch(this, 'localDateFormatter');			
						break;
					case 'wm_number_formatter':
					case 'Number (WaveMaker)':				    
						obj.formatter = dojo.hitch(this, 'numberFormatter');
						break;
					case 'wm_currency_formatter':
					case 'Currency (WaveMaker)':				    
						obj.formatter = dojo.hitch(this, 'currencyFormatter');
						break;
					case 'wm_image_formatter':
					case 'Image (WaveMaker)':				    
						obj.formatter = dojo.hitch(this, 'imageFormatter');
						break;
				    break;
					default:
						if (!this.isDesignLoaded())
							obj.formatter = dojo.hitch(this, 'customFormatter', col.formatFunc);
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

		if (!hasAutoField){
			structure.push({ field: 'wmAutoField', name:' ', width: 'auto', value: ' '});
		}
		
		structure = [structure];
	        //this.onGetStructure(structure);
		return structure; 
	},
    setColumnComboBoxOptions: function(inFieldName, inOptions) {
          for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].id == inFieldName) {
		this.columns[i].options = inOptions;
		this.columns[i].fieldType = "dojox.grid.cells.ComboBox";
		this.renderDojoObj();
		break;
            }
          }
    },
        //onGetStructure: function(inStructure) {},
	setColumnData: function(){
		if (!this.variable || (this.variable.type == this.dsType && this.columns.length > 0)){
  		return;
		}
		
		this.dsType = this.variable.type;
		this.columns = [];
		var viewFields = this.getViewFields();
		dojo.forEach(viewFields, function(f,i){
		  var align = 'left';
			var width = '100%';
      var formatFunc = '';
		  if (f.displayType == 'Number'){
		    align = 'right';
				width = '80px';
		  } else if (f.displayType == 'Date'){
                      width = '80px';
				formatFunc = 'wm_date_formatter';
			}
		  this.columns.push({show:i < 15, id: f.dataIndex, title:f.caption, width:width, displayType:f.displayType, noDelete:true, align: align, formatFunc: formatFunc});
		}, this);
		
		if (this.isDesignLoaded()) {
		  if (!this.contextMenu) this.designCreate(); // special case from themedesigner
		  this.contextMenu.setDataSet(this.columns);
		}
	},

    // if the type changes, we need to adjust rather than regenerate our columns
    updateColumnData: function(){
	
	var viewFields = this.getViewFields();
	dojo.forEach(viewFields, function(f,i){
	    // if the column already exists, skip it
	    if (dojo.some(this.columns, function(item) {return item.id == f.dataIndex;})) return;

	    var align = 'left';
	    var width = '100%';
	    var formatFunc = '';
	    if (f.displayType == 'Number'){
		align = 'right';
		width = '80px';
	    } else if (f.displayType == 'Date'){
		width = '80px';
		formatFunc = 'wm_date_formatter';
	    }
	    this.columns.push({show:i < 15, id: f.dataIndex, title:wm.capitalize(f.dataIndex), width:width, displayType:f.displayType, noDelete:true, align: align, formatFunc: formatFunc});
	}, this);

	var newcolumns = [];
	dojo.forEach(this.columns, dojo.hitch(this, function(col) {
	    // we don't update custom fields
	    if (col.isCustomField) {
		newcolumns.push(col);
		return;
	    }
	    // If the column is still in the viewFields after whatever change happened, then do nothing
	    if (dojo.some(viewFields, dojo.hitch(this, function(field) {
		return field.dataIndex == col.id;
	    }))) {
		newcolumns.push(col);
		return;
	    }

	    // col is no longer relevant
	    return;
	}));
	this.columns = newcolumns;

	if (this.isDesignLoaded()) {
	    if (!this.contextMenu) this.designCreate(); // special case from themedesigner
	    this.contextMenu.setDataSet(this.columns);
	}
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
      fields = wm.getDefaultView(this.variable.type) || [];
		return fields;
	},
	_onGridEvent: function(evt){
		var params = {};
		if (!evt.grid){
			params.cellNode == evt.target;
			params.rowNode = evt.target.parentNode.parentNode.parentNode.parentNode;
			params.rowId = evt.target.parentNode.parentNode.parentNode.parentNode.gridRowIndex;
			params.selectedItem = this.selectedItem;
			params.fieldId = this.dojoObj.structure[0][evt.target.idx].field;
			return params;
		}
		params.cellNode = evt.cellNode;
		params.rowNode = evt.rowNode;
		params.rowId = evt.rowIndex;
		params.selectedItem = this.selectedItem;
		params.fieldId = evt.cell.field;
		return params;
	},
	_onClick: function(evt){
		var params = this._onGridEvent(evt);
    // This will happen if user clicks on empty area of grid.
		if (!params.rowId && params.rowId != 0)
			return;
		if (params.rowId == -1){
		  this.onHeaderClick(evt, params.selectedItem, params.rowId, params.fieldId, params.rowNode, params.cellNode);	
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
	addColumnToCSV: function(csvArray, value){
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
			    try {
				var value = obj[col.id];
			    if (!value) {
				var value = obj;
				var colid = col.id;
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
							value = this.dateFormatter(value);			
							break;
						case 'wm_localdate_formatter':
							value = this.localDateFormatter(value);			
							break;
						case 'wm_number_formatter':
							value = this.numberFormatter(value);	
							break;
						case 'wm_currency_formatter':
							value = this.currencyFormatter(value);	
							break;
						case 'wm_image_formatter':
							value = this.imageFormatter(value);	
							break;
						default:
							if (!this.isDesignLoaded())
								value = dojo.hitch(this.owner, col.formatFunc)(value);
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
	    if (!inDatum || inDatum instanceof Date == false)
		return inDatum;
	    inDatum.setHours(inDatum.getHours() + wm.timezoneOffset,0,0);

	    var constraints = {selector:'date', formatLength:'short', locale:dojo.locale};
	    return dojo.date.locale.format(inDatum, constraints);
	},
	localDateFormatter: function(inDatum){
	    if (!inDatum || inDatum instanceof Date == false)
		return inDatum;
		var constraints = {selector:'date', formatLength:'short', locale:dojo.locale};
		return dojo.date.locale.format(inDatum, constraints);
	},
	numberFormatter: function(inValue){
		return dojo.number.format(inValue);
	},
	currencyFormatter: function(inValue){
		return dojo.currency.format(inValue, {currency:wm.getLocaleCurrency()});
	},
	imageFormatter: function(inValue){
		if (inValue && inValue != '')
			return '<img src="'+ inValue +'">';
		return inValue;
	},
	customFormatter: function(formatFunc, inValue, rowIdx, cellObj){
    if (this.owner[formatFunc]) {
      var rowObj = this.getRow(rowIdx);
      return dojo.hitch(this.owner, formatFunc, inValue, rowIdx, cellObj.index, cellObj.field, cellObj, rowObj)();
    }else {
      return inValue;
    }
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
	editActionCall: function(evt){
		if (this.addDialog){
			this.addDialog.show();
		}
		
		if (this.liveForm){
		    this.liveForm.beginDataUpdate();
		}
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
	onAddButtonClick: function(inEvent){},
	/* Action buttons implementation*/
	
	
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
		return this.itemToJSONObject(this.store, this.getRowData(idx) || {});
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
