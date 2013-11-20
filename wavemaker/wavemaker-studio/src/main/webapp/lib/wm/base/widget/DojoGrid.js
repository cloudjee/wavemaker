/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
    _regenerateOnDeviceChange: 1,
    resortOnDataUpdate: true,
    columnReordering: true, // allows user to drag and drop reorder columns
    manageHistory: true,
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
    sortingEnabled: true,
    classNames: "wmdojogrid GridListStyle",
    requiredLibs: ["dojox.grid.DataGrid",
           "dojox.grid.cells.dijit",
           "dojo.data.ItemFileWriteStore",
           "dojo.string",
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
        } /* Small upgrade task for getting to 6.4 */
        for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].id) {
                this.columns[i].field = this.columns[i].id;
                delete this.columns[i].id;
            }
        }

        this.inherited(arguments);
        var varProps = {
            name: "selectedItem",
            owner: this,
            json: this._selectionMode == 'multiple' ? '[]' : '',
            type: this.variable ? this.variable.type : "any"
        };
        this.selectedItem = new wm.Variable(varProps);

        this.updateSelectedItem(-1);
        this.setSelectionMode(this.selectionMode);
        if (!this.styles || !this.styles.fontSize)
            dojo.addClass(this.domNode, "wmNoFontSize");
    },

    setNoHeader: function(inValue) {
        this.noHeader = inValue;
        dojo.toggleClass(this.domNode, "dojoGridNoHeader", inValue);
    },

    postInit: function() {
        this.inherited(arguments);
        this.subscribe("window-resize", this, "resize");
        if (this.noHeader) this.setNoHeader(this.noHeader);

        if (this.variable && this.variable.getData() || this.columns && this.columns.length) {
            this.renderDojoObj();
        }
        if (this._isDesignLoaded) {
            this.subscribe("deviceSizeRecalc", dojo.hitch(this, "deviceTypeChange"));
        }
    },

    dataSetToSelectedItem: function() {
    	this.selectedItem.dataSet = "";
        this.selectedItem.setLiveView((this.variable|| 0).liveView);
        this.selectedItem.setType(this.variable && this.variable.type ? this.variable.type : "any");
    },
    setSelectedRow: function(rowIndex, isSelected, onSuccess) {
        if (!this.dataSet) return; /* Can't select the row unless the grid is rendered */
        if (!this.dojoObj && !this._renderHiddenGrid) {
            this._renderHiddenGrid = true;
            this.renderDojoObj();
            this._renderHiddenGrid = false;
        }
        if (this._setRowTimeout) {
            window.clearTimeout(this._setRowTimeout);
            delete this._setRowTimeout;
        }

        if (isSelected == undefined) isSelected = true;

        if (isSelected) {
            /* If this returns an empty object, its because the row hasn't been processed by the grid, and will only be processed
             * when scrolled into view
             */
            if (wm.isEmpty(this.getRow(rowIndex))) {
                this.scrollToRow(rowIndex);

                wm.onidle(this, function() {
                    this.setSelectedRow(rowIndex);
                    if (onSuccess) onSuccess();
                });
            } else {
                if (this._selectionMode == "multiple" && dojo.indexOf(this.getSelectedIndex(), rowIndex) != -1) return;
                this.dojoObj.selection.select(rowIndex);
                if (!this._cupdating) {
                    this.onSelectionChange();
                    this.onSelect();
                }
                this.scrollToRow(rowIndex);

                if (onSuccess) onSuccess();
            }
        } else {
            this.dojoObj.selection.setSelected(rowIndex, isSelected);
            this.onSelectionChange();
            this.onDeselect();
        }

    },
    scrollToRow: function(inRow) {
        if (this.dojoObj && (this.dojoObj.scroller.firstVisibleRow > inRow || this.dojoObj.scroller.lastVisibleRow < inRow)) {
            this.dojoObj.scrollToRow(inRow);
        }
    },
    /* TODO: This does not appear to support multi-select */
    setSelectedItem: function(inData) {
        if (inData instanceof wm.Variable) inData = inData.getData();
        if (!inData) {
            this.deselectAll();
            return;
        }
        wm.forEachProperty(inData, function(inValue, inKey) {
            if (typeof inValue == "object") delete inData[inKey];
        });
        this.selectByQuery(inData);
    },
    selectItemOnGrid: function(obj, pkList) {
        if (!this.store) return;
        if (obj instanceof wm.Variable) obj = obj.getData();
        if (obj === undefined || obj === null) obj = {};

        var dateFields = this.getDateFields();
        if (!pkList) pkList = this.primaryKeyFields || wm.data.getIncludeFields(this.variable.type);

        /* If there are no primary keys, then all fields are used to match this item -- this may fail, not trying will definitely fail */
        if (pkList.length == 0) {
            var fields = wm.typeManager.getTypeSchema(this.variable.type);
            for (var fieldName in fields) {
                pkList.push(fieldName);
            }
        }

        var q = {};
        dojo.forEach(pkList, function(f) {
            q[f] = obj[f];
            if (dojo.indexOf(dateFields, f) != -1) q[f] = new Date(obj[f]);
        });

        var _this = this;
        var sItem = function(items, request) {
                if (items.length < 1) {
                    if (_this.selectFirstRow) {
                        _this.setSelectedRow(0);
                    } else {
                        _this.deselectAll();
                    }
                    return;
                }
                var idx = _this.dojoObj.getItemIndex(items[0]);
                if (idx == -1) idx = _this.variable.getItemIndexByPrimaryKey(obj, pkList);
                if (idx == -1 && this.selectFirstRow) idx = 0;

                if (idx >= 0) {
                    if (this._setRowTimeout) {
                        window.clearTimeout(this._setRowTimeout);
                    }

                    this._setRowTimeout = setTimeout(function() {
                        _this.scrollToRow(idx);
                        wm.onidle(_this, function() {
                            this._cupdating = true; // don't trigger events since we're actually reselecting the same value that was already selected
                            try {
                                this.setSelectedRow(idx);
                            } catch (e) {}
                            this._cupdating = false;
                        });
                    }, 0);
                } else _this.deselectAll();
            };
        this.store.fetch({
            query: q,
            onComplete: sItem
        });
    },
    deselectAll: function() {
        var hasSelection = this.hasSelection();
        if (this.dojoObj) this.dojoObj.selection.clear();
        this.updateSelectedItem(-1);
        if (hasSelection) {
            this.onSelectionChange();
            this.onDeselect();
        }
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
        if (!this._curSelectionObj || !wm.Array.equals(this._curSelectionObj, newSelection)) hasChanged = true;
        if (hasChanged) {
            this._selectedItemTimeStamp = new Date().getTime();
            if (this._selectionMode == 'multiple') {
                this.updateAllSelectedItem();
            } else {
                if (!this._isDesignLoaded && !this._handlingBack && this.manageHistory) {
                    app.addHistory({
                        id: this.getRuntimeId(),
                        options: {
                            selectedRow: this._lastSelectedIndex
                        },
                        title: "SelectionChange"
                    });
                }
                this.updateSelectedItem(this.getSelectedIndex());
            }
            if (!this.rendering && !this._cupdating) {
                this.onSelectionChange(); /* TODO: This will fire onSelect when in multiselect mode and something is deselected */
                if (newSelection && newSelection.length) {
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
    resize: function() {
        this.cancelEdit();
    },
    cellEditted: function(inValue, inRowIndex, inFieldName) { /* Sometimes the grid cancels editing in a wierd state */
        if (inValue && typeof inValue == "object" && inValue instanceof Date === false && this.dojoObj.edit.info.cell.widget.store) {
            /* We need to work with an object that lacks the wm.DojoStoreId because we're using dojo.toJson for comparing values */
            inValue = this.itemToJSONObject(this.dojoObj.edit.info.cell.widget.store, inValue)
            delete inValue.wmDojoStoreId;
        }


        var isInvalid;
        /* Checkboxes and other editors that have one editor per column tend not to consistently provide the cell.widget property.
         * Fortunately, we can ignore the invalid state of a checkbox.
         */
        if (this.dojoObj.edit.info.cell && this.dojoObj.edit.info.cell.widget) {
            var editor = this.dojoObj.edit.info.cell.widget;
            if (editor instanceof dijit.form.ComboBox && typeof inValue == "object") {
                if (wm.isEmpty(inValue) && editor.getValue('displayedValue')) {
                    isInvalid = true;
                }
            } else {
                isInvalid = editor.isValid && !editor.isValid();
            }
            if (isInvalid) {
                wm.onidle(this, function() {
                    if (this.selectedItem.getValue(inFieldName) instanceof wm.Variable == false) {
                        var col = dojo.filter(this.columns, function(inCol) {return inCol.field == inFieldName;})[0]
                        if (col) this.setCellStatusIndicator(this.getCellNode(rowIdx, inFieldName), col, "invalid");
                    } else {
                        for (var i = 0; i < this.columns.length; i++) {
                            if (this.columns[i].field.indexOf(inFieldName + ".") == 0) {
                                this.setCellStatusIndicator(tthis.getCellNode(rowIdx, this.columns[i].field), this.columns[i], "invalid");
                            }
                        }
                    }
                });
            }
        }
        var wmvar = this.getRowData(inRowIndex)._wmVariable;
        if (wmvar) wmvar = wmvar[0];

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
            if (oldValue instanceof wm.Variable) oldValue = oldValue.getData();
            if (typeof oldValue == "object" && typeof inValue == "object" &&  dojo.toJson(oldValue) == dojo.toJson(inValue)) return;
            if (oldValue === inValue) return;
        }

        // values of the selectedItem must be updated, but do NOT call a selectionChange event, as its the same selected item, just different place the data is stored
        if (this.selectionMode != "none") {
            var rowIdx = this.getSelectedIndex();
            if (rowIdx != inRowIndex) {
                this.setSelectedRow(inRowIndex, true);
            } else {
                this.updateSelectedItem(rowIdx);
            }


            var allowLazyLoad = this.selectedItem._allowLazyLoad;
            this.selectedItem._allowLazyLoad = false;
            var oldValue = this.selectedItem.getValue(inFieldName);
            this.selectedItem._allowLazyLoad = allowLazyLoad;
            if (oldValue instanceof wm.Variable) oldValue = oldValue.getData();
            if (typeof oldValue == "object" && typeof inValue == "object" &&  dojo.toJson(oldValue) == dojo.toJson(inValue)) return;
            if (oldValue === inValue) return;
            this.selectedItem.setValue(inFieldName, inValue);
        }

        // A bug in dojox.grid editting causes it to set "user.name" but read from "user: {name: currentname}" so we copy in the data to compenate
        if (inFieldName.indexOf(".") != -1) {
            var elements = inFieldName.split(".");
            var firstElement = elements.shift();
            var obj = this.getCell(inRowIndex, firstElement);
            if (obj[elements.join(".")]) obj[elements.join(".")][0] = inValue;
            else obj[elements.join(".")] = [inValue];
        }

        // update the _wmVariable object
        if (wmvar) {
            // if we fire a notification, the grid will be regenerated in the middle of processing
            // the edit event
            wmvar.beginUpdate();
            wmvar.setValue(inFieldName, inValue);
            wmvar.endUpdate();
        }


        if (this.liveEditing && !isInvalid) {
            this.writeSelectedItem(); /* Without onidle, we are adding class to the cell with the editor rather than the cell that replaces the editor when editing is done */
            wm.onidle(this, function() {
                if (this.selectedItem.getValue(inFieldName) instanceof wm.Variable == false) {
                    var col = dojo.filter(this.columns, function(inCol) {return inCol.field == inFieldName;})[0]
                    this.setCellStatusIndicator(this.getCellNode(inRowIndex, inFieldName), col, "dirty");
                } else {
                    for (var i = 0; i < this.columns.length; i++) {
                        if (this.columns[i].field.indexOf(inFieldName + ".") == 0) {
                            this.setCellStatusIndicator(this.getCellNode(inRowIndex, this.columns[i].field), this.columns[i], "dirty");
                        }
                    }
                }
            });
        }
        this.onCellEdited(inValue, inRowIndex, inFieldName, isInvalid);
    },
    updateSelectedItem: function(selectedIndex) {
        this._lastSelectedIndex = selectedIndex;
        if (selectedIndex == -1 || this.getRowCount() == 0) {
            this.selectedItem.clearData();
        } else {
            /*
        var newdata = this.itemToJSONObject(this.store, this.getRowData(selectedIndex));
        for (prop in newdata){
            if (newdata[prop] instanceof Date)
            newdata[prop] = newdata[prop].getTime();
        }*/
            if (selectedIndex < this.getRowCount()) {
                var rowData = this.getRowData(selectedIndex);
                if (rowData) {
                    this.selectedItem.setDataSet(rowData._wmVariable[0]);
                } else {
                    this._storeFetch(dojo.hitch(this, function(inItems) {
                        this.selectedItem.setDataSet(inItems[0]._wmVariable[0]);
                    }));
                }
            } else {
                this.selectedItem.setDataSet(null);
            }
        }
        this.setValue("emptySelection", !this.hasSelection());
        this.setValue("isRowSelected", this.hasSelection());
    },
    createNewLiveVariable: function() {
    var lvar = new wm.LiveVariable({owner: this,
                    operation: "update",
                    inFlightBehavior: "executeAll",
                    name: "liveVar",
                    type: this.dataSet.type,
                    liveSource: this.getDataSet().liveSource,
                    autoUpdate: false,
                    startUpdate: false});
    this.connect(lvar, "onSuccess", this, "_onLiveEditSuccess");
    this.connect(lvar, "onError", this, "_onLiveEditError");
    this.connect(lvar, "onResult", this, "_onLiveEditResult");
    return lvar;
    },
    isEmptyLiveType: function(inType, inValue) {
        var typeDef = wm.typeManager.getType(inType);
        if (typeDef && typeDef.liveService) {
            var primaryKey = wm.typeManager.getPrimaryKey(typeDef);
            if (primaryKey && inValue && (inValue[primaryKey] === undefined || inValue[primaryKey] === null || inValue[primaryKey] === 0)) return true;
        }
        return false;
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

        /* This handles the case where there was a related object; the user has cleared it, and with it removed, getData() does NOT
        * return anything to send to the server for that field, resulting in the relationship NOT being updated
        */
        wm.forEachProperty(this.selectedItem._dataSchema, dojo.hitch(this, function(fieldDef, fieldName) {
            if (wm.typeManager.isStructuredType(fieldDef.type) && sourceData[fieldName] === null && this.selectedItem && this.selectedItem.data && this.selectedItem.data[fieldName]) {
                sourceData[fieldName] = {};
            }
        }));
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
                if (sourceData[field] === undefined || sourceData[field] === null || this.isEmptyLiveType(fields[field].type, sourceData[field])) {
                    if (fields[field].required) {
                        console.warn("Can not write a '" + this.selectedItem.type + "' when required field '" + field + "' has no value");
                        return;
                    }
                }
            }
        }
        console.log("OP:" + operation);
        /* Strip out date objects from sourceData */
        var fields = this.selectedItem._dataSchema;
        for (var field in fields) {
            if (sourceData[field] instanceof Date) sourceData[field] = sourceData[field].getTime();
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
        if (operation == "insert") this.handleInsertResult(deferred, rowIndex); // in separate method to localize the variables
        else if (operation == "update") this.handleUpdateResult(deferred, rowIndex);
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
    },    onLiveEditInsertSuccess: function(inData) {},
    onLiveEditUpdateSuccess: function(inData) {},
    onLiveEditDeleteSuccess: function(inData) {},
    onLiveEditInsertResult: function(inData) {},
    onLiveEditUpdateResult: function(inData) {},
    onLiveEditDeleteResult: function(inData) {},
    onLiveEditInsertError: function(inError) {},
    onLiveEditUpdateError: function(inError) {},
    onLiveEditDeleteError: function(inError) {},

    handleInsertResult: function(deferred, rowIndex) {
        deferred.addCallback(dojo.hitch(this, function(result) {
            var data = this.getRowData(rowIndex);
            delete data._wmVariable[0].data._new;
            this.setUneditableFields(rowIndex, result);
            this.updateSelectedItem(rowIndex);
            var cellNode = this.dojoObj.layout.cells[0].getNode(rowIndex);
            if (cellNode) {
                var parentNode = cellNode.parentNode;
            }
            if (parentNode) {
                var dirtyCells = dojo.query("td.dirty",parentNode).removeClass('dirty saveFailed').addClass("saved");
            }
        }));
        deferred.addErrback(dojo.hitch(this, function(result) {
            console.error(result);
        }));
    },
    setCellStatusIndicator: function(inNode, inColumn, inStatus) {
        if (!inNode || !inColumn) return;

        // Do not try showing the status icons for checkbox fields that are
        // right aligned or which just don't have enough space.  25px was
        // a guesstimation, not an exact number
        if (inNode.clientWidth < 25) return;

        dojo.removeClass(inNode, "dirty saveFailed saved");
        dojo.addClass(inNode, inColumn.align + "Align " + inStatus);
if (inColumn.align == "right") {}
    },
    handleUpdateResult: function(deferred, rowIndex) {
        deferred.addCallback(dojo.hitch(this, function(result) {
            var data = this.getRowData(rowIndex);
            var cellNode = this.dojoObj.layout.cells[0].getNode(rowIndex);
            if (cellNode) {
                var parentNode = cellNode.parentNode;
            }
            if (parentNode) {
                dojo.query("td.dirty",parentNode).forEach(dojo.hitch(this, function(cell) {
                    var col = this.columns[dojo.attr(cell, "idx")];
                    var field = col.field;
                    var gridValue = this.getCell(rowIndex, field);
                    var resultFieldValue = field.indexOf(".") == -1 ? result[field] : wm.expression.getValue("${" + field + "}", result);
                    if (gridValue == resultFieldValue) {
                        this.setCellStatusIndicator(cell, col, "saved");
                    }
                }));

            }
        }));
        deferred.addErrback(dojo.hitch(this, function(result) {
            console.error(result);
                        var cellNode = this.dojoObj.layout.cells[0].getNode(rowIndex);
            if (cellNode) {
                var parentNode = cellNode.parentNode;
            }
            if (parentNode) {
                dojo.query("td.dirty",parentNode).forEach(dojo.hitch(this, function(cell) {
                    dojo.addClass(cell, "saveFailed");
                }));
            }
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
                } else if (oldData[columns[i].field] == "&nbsp;") oldData[columns[i].field] = ""; // only needed &nbsp; so that the row wasn't 1px high
            }
        }
        oldData._wmVariable.beginUpdate();
        oldData._wmVariable.setData(oldData);
        oldData._wmVariable.endUpdate();
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
        var col;
        var idx;
        for (var i = 0; i < this.columns.length; i++) {
        if (this.columns[i].field == fieldName ||
           this.columns[i].id == fieldName) {
            col = this.columns[i];
            idx = i;
            break;
        }
        }
        if (col && col.isCustomField) {
        if (col.expression) {
            return this.getExpressionValue(col.expression, rowIndex, this.getRow(rowIndex), true);

        } else if (col.formatFunc){
            switch(col.formatFunc){
            case 'wm_date_formatter':
            case 'Date (WaveMaker)':
            case 'wm_localdate_formatter':
            case 'Local Date (WaveMaker)':
            case 'wm_time_formatter':
            case 'Time (WaveMaker)':
            case 'wm_number_formatter':
            case 'Number (WaveMaker)':
            case 'wm_currency_formatter':
            case 'Currency (WaveMaker)':
            case 'wm_image_formatter':
            case 'Image (WaveMaker)':
            case 'wm_link_formatter':
            case 'Link (WaveMaker)':
            return undefined;// custom field with a formatter rather than a func to generate a value? Empty cell.
            default:
            if (!this.isDesignLoaded())
                return dojo.hitch(this.owner, col.formatFunc)("", rowIndex, idx, col.field || col.id, {customStyles:[], customClasses:[]}, this.getRow(rowIndex));
            }
        }
        return undefined;// custom field with no function to generate a value? Empty cell.
        } else {
        return this.dojoObj.store.getValue(item,fieldName);
        }
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
        if (this.dojoObj && this.dojoObj.edit)
           this.dojoObj.edit.cancel();
    },
    applyEdit: function() {
        if (this.dojoObj && this.dojoObj.edit)
           this.dojoObj.edit.apply();
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
                if (sourceData[field] instanceof Date) sourceData[field] = sourceData[field].getTime();
            }
            var livevar = this.liveVariable;
            if (!livevar) {
                livevar = this.liveVariable = this.createNewLiveVariable();
            }
            livevar.operation = "delete";
            this.onLiveEditBeforeDelete(sourceData);
            livevar.setSourceData(sourceData);
            var deferred = livevar.update();
            deferred.addCallback(dojo.hitch(this, function(result) {
                if (this.getSelectedIndex() == rowIndex) this.updateSelectedItem(-1);
                var item = this.getRowData(rowIndex);
                this.dojoObj.store.deleteItem(item);
                //this.dojoObj.render();
            }));
            deferred.addErrback(dojo.hitch(this, function(result) {
                console.error(result);
                app.toastError(result.message);
            }));

            return;
        }
        this.updateSelectedItem(-1);
        var item = this.getRowData(rowIndex);
        this.dojoObj.store.deleteItem(item);
        if (this.dataSet && this.dataSet.data && this.dataSet.data._list) {
            var dataSetIndex = dojo.indexOf(this.dataSet.data._list, item._wmVariable[0]);
            if (dataSetIndex != -1) {
                this.dataSet.beginUpdate();
                this.dataSet.removeItem(dataSetIndex);
                this.dataSet.endUpdate();
            }
        }
        //this.dojoObj.render();
    },

    addRow: function(inFields, selectOnAdd, ignoreLiveEditing) {
            var editCell = null;
            var newIndex, item;
            for (var i = 0; i < this.columns.length; i++) {
                if (this.columns[i].fieldType && this.columns[i].fieldType != "dojox.grid.cells.Bool") {
                    editCell = this.columns[i];
                    break;
                }
            }
            if (this.getRowCount() == 0 && this.variable) {
                this.variable.beginUpdate();
                this.variable.setData([inFields]);
                this.variable.endUpdate();
                this.variable.getItem(0).data._new = true;
                item = this.variable.getItem(0);
                newIndex = 0;
            } else {
                /*
                if (selectOnAdd) {
                    this.setSelectedRow(0);
                    this.selectionChange(); // needs committing
                    wm.onidle(this, function() {
                        this.editCell(0, editCell.field);
                    });
                }
                return;
            }*/
            var data = dojo.clone(inFields);
            var v = new wm.Variable({
                type: this.dataSet.type
            });
            v.setData(data);

/* Add to top of list
            this.dataSet.addItem(v, 0);
            this.dataSet.getItem(0).data._new = true;
            if (selectOnAdd || selectOnAdd === undefined) {
                this.setSelectedRow(0);
                this.selectionChange(); // needs committing
                wm.onidle(this, function() {
                    this.dojoObj.scrollToRow(0);
                    this.editCell(0, editCell.field);
                });

            }
            */
            newIndex = this.dataSet.getCount();
            this.dataSet.beginUpdate();
            this.dataSet.addItem(v);
            this.dataSet.endUpdate();
            item = this.dataSet.getItem(newIndex);
        }
            item.data._new = true;
            var obj = item.getData();
            var dateFields = this.getDateFields();
            this.replaceDateFields(dateFields, obj);
            obj._wmVariable = item;
            this.store.newItem(obj);
            var cell = this.dojoObj.layout.cells[0].getNode(newIndex);
            if (!cell) this.dojoObj.render();
            if (selectOnAdd || selectOnAdd === undefined) {
                this.setSelectedRow(newIndex);
                this.selectionChange(); // needs committing
                if (this.liveEditing && (ignoreLiveEditing || ignoreLiveEditing === undefined)) {
                    this.writeSelectedItem();
                }
                wm.onidle(this, function() {
                    this.dojoObj.scrollToRow(newIndex);
                    if (editCell) {
                        this.editCell(newIndex, editCell.field);
                    }
                });

            }

    },

    addEmptyRow: function(selectOnAdd) {
        var set = function(obj, parts, value) {
                for (var partnum = 0; partnum < parts.length; partnum++) {
                    if (partnum + 1 < parts.length) {
                        if (!obj[parts[partnum]]) {
                            obj[parts[partnum]] = {};
                        }
                        obj = obj[parts[partnum]];
                    } else {
                        obj[parts[partnum]] = value;
                    }
                }
            };

        var obj = {};
        var hasVisibleValue = this.deleteColumn || this.selectionMode == "checkbox" || this.selectionMode == "radio"; // if there is a delete column, checkbox or radio selection modes then there a visible element shown in the row
        var possibleFieldsToFill = [];
        for (var i = 0; i < this.columns.length; i++) {
            var column = this.columns[i];
            var columnid = column.field || column.id;
            if (columnid == "PHONE COLUMN") continue;
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
            switch (typeName) {
            case "java.lang.Integer":
            case "java.lang.Double":
            case "java.lang.Float":
            case "java.lang.Short":
                value = 0;
                if (column.show) hasVisibleValue = true;

                break;
            case "java.util.Date":
                value = new Date().getTime();
                if (column.show) hasVisibleValue = true;
                break;
            case "java.lang.Boolean":
                value = false;
                break;
            default:
                value = "";
                possibleFieldsToFill.push(column);
            }

            set(obj, parts, value);
        }

        if (!hasVisibleValue && possibleFieldsToFill.length) {
            var column = possibleFieldsToFill[0];
            var columnid = column.field || column.id;
            var parts = columnid.split(".");
            set(obj, parts, value);
            set(obj, parts, "&nbsp;");
        }

        this.addRow(obj, selectOnAdd);
    },
    getRowCount: function() {
        if (!this.dojoObj && this.dataSet) {
            return this.dataSet.getCount();
        } else if (!this.dojoObj) {
            return 0;
        } else {
            return Math.max(this.dojoObj.rowCount, this.dojoObj._by_idx.length);
        }
    },
    hasSelection: function() {
        var index = this.getSelectedIndex();
        if (dojo.isArray(index)) return Boolean(index.length);
        else return Boolean(index != -1);
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
        if(this._cupdating) return;
        if(this.dojoObj != null) {
            this.dojoObj.destroy();
            this.dojoObj = null;
        }

        if(!this.variable && (!this.columns || !this.columns.length)) {
            return;
        }
        if(this.isAncestorHidden() && !this._renderHiddenGrid) {
            this._renderDojoObjSkipped = true;
            return;
        }
        this._renderDojoObjSkipped = false;
        this.rendering = true;
        if(this._resetStore) {
            this.setDojoStore();
            delete this._resetStore;
        }
        var structure = this.getStructure();
        if(structure[0].length == 0) structure = {};
        var props = {
            escapeHTMLInData: false,
            structure: structure,
            store: this.store,
            singleClickEdit: this.singleClickEdit,
            columnReordering: this.columnReordering,
            queryOptions: this.queryOptions,
            query: this.query || {},
            updateDelay: 0
        };
        this.addDojoProps(props);
        this.dojoObj = new dojox.grid.DataGrid(props, dojo.create('div', {
            style: 'width:100%;height:100%'
        }, this.domNode));
        this.dojoObj.canSort = dojo.hitch(this, "canSort");
        if(this._disabled) this.dojoObj.set("disabled", true);
        this.connectDojoEvents();
        this.setSelectionMode(this.selectionMode);
        this.dojoRenderer();
        if(this._lastSortFieldName && this.resortOnDataUpdate) {
            this.setSortField(this._lastSortFieldName, this._lastSortAsc);
        }

        var selectedData = this.selectedItem.getData();
        var isSelectedDataArray = dojo.isArray(selectedData);
        if(isSelectedDataArray && selectedData.length || !isSelectedDataArray && selectedData || this.selectFirstRow) this.selectItemOnGrid(this.selectedItem);

        this.onRenderData();
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
        setTimeout(function() {
            _this.rendering = false;
        }, 0)
    },
    canSort: function() {
        return this.dojoObj && !this.dojoObj.isLoading && this.sortingEnabled;
    },
    dojoRenderer: function() {
        if (!this.dojoObj) return;

        /* Tweak Headers is ugly hack to fix WM-4721 */
        var tweakHeader =  (this.noHeader && (this.selectionMode == "checkbox" || this.selectionMode == "radio"));
        if (tweakHeader) this.setNoHeader(false);
        this.dojoObj.startup();
        if (tweakHeader) wm.onidle(this, function() {this.setNoHeader(true)});
        if (this.styles && this.styles.fontSize) this.dojoObj.domNode.style.fontSize = this.styles.fontSize;
        this.dojoObj.updateDelay = 1; // reset this after creation; I just want this set to zero to insure that everything is generated promptly when we first create the grid.
        if (this._isDesignLoaded) {
            var self = this;
            wm.job(this.getRuntimeId() + ".renderBounds", 1, function() {
                self.renderBounds();
            });
        }
        wm.onidle(this, "_postDojoRenderer");
    },
    _postDojoRenderer: function() {
        if (!this.dojoObj) return; // destroyed after dojoRenderer finished
        var v = this.dojoObj.views.views[0];
        if (v && v.scrollboxNode.scrollHeight == v.scrollboxNode.clientHeight && v._hasVScroll) {
            this.dojoObj.prerender();
        }
    },
    onRenderData: function() {},
    _onShowParent: function() {
        if (this._renderDojoObjSkipped) {
            wm.onidle(this, "renderDojoObj");
        }
    },
    setShowing: function(inShowing) {
        var wasShowing = this.showing;
        this.inherited(arguments);
        if (!wasShowing && inShowing) {
            this._onShowParent();
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
                var isNew = rowData._wmVariable[0].data._new;
                if (isNew && this.liveEditing) {
                    inRow.customClasses += " dojoxGridRow-inserting";
                }
                this.onStyleRow(inRow, rowData);
            }
        } catch (e) {}
    },
    onStyleRow: function(inRow /* inRow.customClasses += " myClass"; inRow.customStyles += ";background-color:red"; */ , rowData) {},
    getDataSet: function() {
        if (this.variable) return this.variable;
        else if (this.$.binding && this.$.binding.wires.dataSet) {
            return this.getValueById(this.$.binding.wires.dataSet.source);
        }
    },
    setDataSet: function(inValue, inDefault) {
        if (this._typeChangedConnect) {
            this.disconnectEvent("typeChanged");
            delete this._typeChangedConnect;
        }

        this.dataSet = this.variable = inValue;
        var updatedColumns = false;
        if (this.variable) {
            this.dataSetToSelectedItem();

            // If we're in design mode, then subscribe to be notified if the type definition is changed;
            // also call updateColumnData in case the type definition was changed while editting some other page.
            // Only make this call if we have a new dataSet (inValue), we have an existing columns array, and its not a change in type from our current dataSet.
            if (this._isDesignLoaded && this.columns.length && inValue && inValue.type ) {
                if (this._typeChangedConnect) dojo.disconnect(this._typeChangedConnect);
                this._typeChangedConnect = this.connect(inValue, "typeChanged", this, function() {
                	wm.job(this.getRuntimeId() + ".typeChanged", 50, this, function() {
                        if (!this.isDestroyed) {
    	                    this.updateColumnData(); // if the type changes for this.variable, reapply this variable's new type info
    	                    this.setDojoStore();
    	                    this.renderDojoObj();
                        }
	                });
                });
                this.updateColumnData();
                updatedColumns = true;
            }
        }
        if (this._isDesignLoaded && !this._loading && !updatedColumns) this.setColumnData();

        this._resetStore = true;
        //this.setDojoStore();
        if (inValue && inValue instanceof wm.Variable) this.selectedItem.setType(inValue.type); // broadcasts a message to all who are bound to the selectedItem
        if (this.allLibsLoaded()) {
            this.renderDojoObj();
        } else {
            var thisObj = this;
            dojo.addOnLoad(function() {
                thisObj.renderDojoObj();
            });
        }
    },
    allLibsLoaded: function() {
        for (var i = 0; i < this.requiredLibs.length; i++) {
            if (!dojo.getObject(this.requiredLibs[i])) return false;
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
    customSort: function(a, b) {
        return "";
    },
    setDojoStore: function() {
        if (!this.variable) {
            this.store = null;
            this.dsType = null;
            return;
        }

        var storeData = {
            'items': []
        };
        var dataList = this.variable.getData() || [];
        if (!dojo.isArray(dataList) && !wm.isEmpty(dataList)) {
            dataList = [dataList];
        }
        // If the user has provided a customSort method, use it
        // if its designtime, customSort will be the name of the method rather
        // than the actual method, so don't try running it
        if (this.customSort != this.constructor.prototype.customSort && dojo.isFunction(this.customSort)) dataList = dataList.sort(this.customSort);


        var dateFields = this.getDateFields();
        dojo.forEach(dataList, dojo.hitch(this, "replaceDateFields", dateFields));

        if (dataList) {
            for (var i = 0; i < dataList.length; i++)
            dataList[i]._wmVariable = this.variable.getItem(i);
        }

        storeData.items = dataList;
        this.store = new dojo.data.ItemFileWriteStore({
            data: storeData
        });
        if (!this.caseSensitiveSort) this.makeSortingInsensitive();
    },
    replaceDateFields: function(dateFields, obj) {
        var dates = {};
        dojo.forEach(dateFields, function(f) {
            if (obj[f]) dates[f] = new Date(obj[f]);
        });
        //obj = wm.flattenObject(obj,true);
        obj = dojo.mixin({}, obj, dates);
    },
    makeSortingInsensitive: function() {
        this.store.comparatorMap = {};
        dojo.forEach(this.columns, function(col) {
            if (col.displayType == 'Text' || col.displayType == "String") this.store.comparatorMap[col.field] = dojo.hitch(this, 'sortNoCase');
        }, this);
    },
    sortNoCase: function(a, b) {
        var a = String(a).toLowerCase();
        var b = String(b).toLowerCase();

        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    },
    setDisabled: function(inDisabled) {
        this.inherited(arguments);
        if (this.dojoObj) {
            this.dojoObj.set("disabled", this._disabled);
        }
    },

    /* WARNING: This uses dojo store's query syntax, not wm.Variable query syntax */
    setQuery: function(q){
        this.query = q;
        if (this.dojoObj)
            this.dojoObj.setQuery(q);
    },

    /* WARNING: This uses wm.Variable query syntax, not dojo store's query syntax */
    selectByQuery: function(inQuery) {
    if (!this.dojoObj || !this.dataSet) return;

    if (!inQuery) {
        this.deselectAll();
        return;
    }

    /* Step 1: Find all matching items from the dataset */
    var items = this.dataSet.query(inQuery);

    /* Step 2: Find and select all rows associated with those items */
    this._storeFetch(dojo.hitch(this, function(inItems) {
                      this.deselectAll();
                      for(var i = 0; i < inItems.length; i++) {
                      if (dojo.indexOf(items.data._list, inItems[i]._wmVariable[0]) != -1) {
                          this.dojoObj.selection.addToSelection(i);
                          if (this._selectionMode == "single") {
                          break;
                          }
                      }
                      }
    }));
    },
    _storeFetch: function(onComplete) {
    this.dojoObj.store.fetch({sort: this.dojoObj.getSortProps(),
                  query: this.dojoObj.query,
                  queryOptions: this.dojoObj.queryOptions,
                  onComplete: onComplete});
    },
    getStructure: function() {
        var structure = [];
        var isMobile = this._isDesignLoaded ? studio.currentDeviceType == "phone" : wm.device == "phone";
        var isMobileStyle = isMobile || (this._isDesignLoaded ? studio.currentDeviceType == "tablet" : wm.device == "tablet");
        if (this.deleteColumn) {
            structure.push({
                hidden: false,
                name: "-",
                width: "20px",
                "get": dojo.hitch(this, 'getExpressionValue', "'<div class=\\'wmDeleteColumn\\'></div>'"),
                field: "_deleteColumn"
            });
        }

        var designMode = (this._isDesignLoaded || window["studio"] && this.isOwnedBy(studio.page));
        var useMobileColumn = false;
        var isPhone = designMode ? studio.currentDeviceType == "phone" : wm.device == "phone";
        var isTablet = designMode ? studio.currentDeviceType == "tablet" : wm.device == "tablet";
        var isAllPhoneCol = true;
        if (isPhone || isTablet) {
            for (var i = 0; i < this.columns.length; i++) {
                var c = this.columns[i];
                if (c.mobileColumn) {
                    useMobileColumn = true;
                }
                if (c.show) {
                    isAllPhoneCol = false;
                }
            }
        }
        if (useMobileColumn && (isAllPhoneCol || studio.currentDeviceType == "phone" || designMode && !this.owner._loadingPage && wm.List.prototype.desktopWidthExcedesBounds.call(this))) {
            ;
        } else {
            useMobileColumn = false;
        }

        /* IE 9 requires that widths be normalized */
        var totalPercentWidth = 0;
        dojo.forEach(this.columns, function(col) {
            var show = useMobileColumn && col.mobileColumn || !useMobileColumn && col.show;
            if (show && col.width.indexOf("%") != -1) {
                totalPercentWidth += parseInt(col.width);
            }
        });

        dojo.forEach(this.columns, function(col) {
            if (!useMobileColumn && col.field == "PHONE COLUMN" && !col.show) {
                return; // don't even include this complicated column in the structure unless we're in design mode
            }
            var options = col.options || col.editorProps && col.editorProps.options; // editorProps is the currently supported method
            var show = useMobileColumn && col.mobileColumn || !useMobileColumn && col.show;
            var width = col.width;
            if (show && width.indexOf("%") != -1) {
                width = Math.floor((100 * parseInt(width) / totalPercentWidth)) + "%";
            }
            var obj = {
                hidden: !show,
                field: col.field,
                constraint: col.constraints,
                name: col.title ? col.title : "-",
                width: width,
                fieldType: col.fieldType == "dojox.grid.cells._Widget" && col.editorProps && col.editorProps.regExp ? "dojox.grid.cells.ValidationTextBox" : col.fieldType,
                widgetProps: col.editorProps,
                options: typeof options == "string" ? options.split(/\s*,\s*/) : options,
                editable: show && (col.editable || col.fieldType),
                // col.editable is obsolete.  While users may like to hide/show columns with editors, a hidden column of editors breaks tabbing from editor to editor.
                expression: col.expression,
                displayType: col.displayType
            };
            if (obj.widgetProps) {
                obj.widgetProps = dojo.mixin({
                    owner: this
                }, obj.widgetProps);
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
                    obj.widgetProps = {
                        owner: this
                    };
                }
            }

            if (col.editorProps && col.editorProps.selectDataSet && col.fieldType == "dojox.grid.cells.ComboBox") {
                var selectDataSet = this.owner[col.editorProps.selectDataSet] || this.owner.getValueById(col.editorProps.selectDataSet);
                if (selectDataSet) {
                    if (!selectDataSet.isEmpty()) {
                        obj.options = wm.grid.cells.ComboBox.prototype.cleansComboBoxOptions(selectDataSet);
                        /*
                var options = [];
                var count = selectDataSet.getCount();
                for (var i = 0; i < count; i++) {
                    var item = selectDataSet.getItem(i);
                    options.push({name: item.getValue(col.editorProps.displayField), dataValue: item.getData()});
                }
                obj.options = options;
                */
                    }
                    if (this["_connectOnSetData." + col.field]) dojo.disconnect(this["_connectOnSetData." + col.field]);
                    this["_connectOnSetData." + col.field] = this.connect(selectDataSet, "onSetData", dojo.hitch(this, "updateEditorDataSet", selectDataSet, col.field)); // recalculate the columns/regen the grid each time our dataSet changes
                }
            }

            /* TODO: Add more style options; a bold column? A column with a thick right border?  Let the user edit it as style... */
            if (col.align && col.align != '') {
                obj.styles = 'text-align:' + col.align + ';';
            }

            if (col.formatFunc && col.formatFunc != '' || col.backgroundColor || col.textColor || col.cssClass) { /* TODO: Localize? */
                switch (col.formatFunc) {
                case 'wm_date_formatter':
                case 'Date (WaveMaker)':
                    obj.formatter = dojo.hitch(this, 'dateFormatter', col.formatProps || {}, col.backgroundColor, col.textColor, col.cssClass);
                    break;
                case 'wm_localdate_formatter':
                case 'Local Date (WaveMaker)':
                    obj.formatter = dojo.hitch(this, 'localDateFormatter', col.formatProps || {}, col.backgroundColor, col.textColor, col.cssClass);
                    break;
                case 'wm_time_formatter':
                case 'Time (WaveMaker)':
                    obj.formatter = dojo.hitch(this, 'timeFormatter', col.formatProps || {}, col.backgroundColor, col.textColor, col.cssClass);
                    break;
                case 'wm_number_formatter':
                case 'Number (WaveMaker)':
                    obj.formatter = dojo.hitch(this, 'numberFormatter', col.formatProps || {}, col.backgroundColor, col.textColor, col.cssClass);
                    break;
                case 'wm_array_formatter':
                    obj.formatter = dojo.hitch(this, 'arrayFormatter', col.field, col.formatProps || {}, col.backgroundColor, col.textColor, col.cssClass);
                    break;

                case 'wm_currency_formatter':
                case 'Currency (WaveMaker)':
                    obj.formatter = dojo.hitch(this, 'currencyFormatter', col.formatProps || {}, col.backgroundColor, col.textColor, col.cssClass);
                    break;
                case 'wm_image_formatter':
                case 'Image (WaveMaker)':
                    obj.formatter = dojo.hitch(this, 'imageFormatter', col.formatProps || {}, col.backgroundColor, col.textColor, col.cssClass);
                    break;
                case 'wm_link_formatter':
                case 'Link (WaveMaker)':
                    obj.formatter = dojo.hitch(this, 'linkFormatter', col.formatProps || {}, col.backgroundColor, col.textColor, col.cssClass);
                    break;
                case 'wm_button_formatter':
                    obj.formatter = dojo.hitch(this, 'buttonFormatter', col.field, col.formatProps || {}, col.backgroundColor, col.textColor, col.cssClass);
                    break;
                default:
                    try {
                        obj.formatter = dojo.hitch(this, 'customFormatter', col.formatFunc, col.backgroundColor, col.textColor, col.cssClass);
                    } catch (e) {}

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
                // For example: dataSet = [{name:'account name', contact:{ name:'contact name'}}, ...]
                // and user has two columns -> name, contact.name
                // then we include a default expression to get values for contact.name
                obj.get = dojo.hitch(this, 'getExpressionValue', '${' + obj.field + '}');
            }

            structure.push(obj);
        }, this);


        structure = [structure];
        if (this.selectionMode == "checkbox") structure.unshift({
            type: "dojox.grid._CheckBoxSelector",
            width: isMobileStyle ? "40px" : "20px"
        });
        else if (this.selectionMode == "radio") structure.unshift({
            type: "dojox.grid._RadioSelector",
            width: isMobileStyle ? "40px" : "20px"
        });

        return structure;
    },
    /* Hack to update the combobox editor items without rerendering the grid */
    updateEditorDataSet: function(dataSet, fieldId) {
        var cells = this.dojoObj.layout.cells;
        if (cells) {
            for (var i = 0; i < cells.length; i++) {
                if (cells[i].field === fieldId) {
                    cells[i].options = wm.grid.cells.ComboBox.prototype.cleansComboBoxOptions(dataSet);
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
        var maxColumns = Math.round(this.bounds.w / 80);
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
                show: i < maxColumns,
                field: f.dataIndex,
                title: f.caption,
                width: width,
                displayType: f.displayType,
                align: align,
                formatFunc: formatFunc
            });
        }, this);
        if (this._isDesignLoaded) this.regenerateMobileColumn(this.columns);
    },

    // if the type changes, we need to adjust rather than regenerate our columns
    updateColumnData: function() {
        var defaultSchema = {
            dataValue: {
                type: this.variable.type
            }
        }; // this is the schema to use if there is no schema (i.e. the type is a literal)
        var viewFields = this.getViewFields() || defaultSchema;
        var w = this.width == "100%" ? this.parent.bounds.w : this.parent.bounds.w; // this may not have been rendered yet
        var maxColumns = Math.round(w / 80);
        dojo.forEach(viewFields, function(f, i) {
            // if the column already exists, skip it
            if (dojo.some(this.columns, function(item) {
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
                show: false, // we are adding to the user's existing grid design; provide the columns as options but don't automatically show them.
                field: f.dataIndex,
                title: wm.capitalize(f.dataIndex),
                width: width,
                displayType: f.displayType,
                align: align,
                formatFunc: formatFunc
            });
        }, this);


        var newcolumns = [];
        var hasMobileColumn = false;
        dojo.forEach(this.columns, dojo.hitch(this, function(col) {
            if (col.mobileColumn || col.field == "PHONE COLUMN") hasMobileColumn = true;

            // we don't update custom fields
            if (col.isCustomField || col.field == "PHONE COLUMN") {
                newcolumns.push(col);
                return;
            }
            // If the column is still in the viewFields after whatever change happened, then do nothing
            if (dojo.some(viewFields, dojo.hitch(this, function(field) {
                return field.dataIndex == col.field;
            }))) {
                newcolumns.push(col);
                return;
            }

            // col is no longer relevant
            return;
        }));
        if (!hasMobileColumn) {
            newcolumns.push({
                mobileColumn: true,
                align: "left",
                field: "PHONE COLUMN",
                show: false,
                title: "-",
                width: "100%",
                // Grid designer is needed to generate a the full expression, this at least will do something interesting
                // until the designer/developer opens the grid designer.
                expression: "'<div class=\"MobileRowTitle\">" + newcolumns[0].title + ": ' + \${" + newcolumns[0].field + "} + '</div>'"

            });
        }
          /* If there are no showing columns, make them all show */
        if (dojo.every(newcolumns, function(col) {return !col.show;})) {
            var maxColumns = Math.max(1,Math.round(this.bounds.w / 80));
            dojo.forEach(newcolumns, function(col,i) { if (i < maxColumns && col.field != "PHONE COLUMN") col.show = true;});
        }
        this.columns = newcolumns;
        if (this._isDesignLoaded) this.regenerateMobileColumn(this.columns);
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
                dateFields.push(col.field)  ;
        });

        return dateFields;
    },
    setSelectionMode: function(inMode) {
        this.selectionMode = inMode;
        if (inMode == "checkbox") {
            this._selectionMode = "multiple";
            if (this.dojoObj) this.dojoObj.selection.setMode("multiple");
        } else if (inMode == "radio") {
            this._selectionMode = "single";
            if (this.dojoObj) this.dojoObj.selection.setMode("single");
        } else if (inMode == "extended") {
            this._selectionMode = "multiple";
            if (this.dojoObj) this.dojoObj.selection.setMode(inMode);
        } else {
            this._selectionMode = inMode;
            if (this.dojoObj) this.dojoObj.selection.setMode(inMode);
        }
    },

     getViewFields: function() {
        var fields = [];
        if (this.variable instanceof wm.LiveVariable) {
            fields = this.variable.getViewFields();
        } else if (this.variable.name && this.variable.owner instanceof wm.LiveVariable) {
            fields = this.variable.owner.getViewFields();
        } else if (this.variable instanceof wm.Variable && wm.typeManager.getType(this.variable.type) && wm.typeManager.getType(this.variable.type).liveService) {
            fields = wm.getDefaultView(this.variable.type) || [];
        } else {
            fields = wm.typeManager.getFieldList(this.variable._dataSchema, "", 3);
        }

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
        this._lastSortFieldName = fieldName;
        this._lastSortAsc = this.dojoObj.sortInfo > 0;
    },
    onSort: function(inSortField) {
    },
    _onClick: function(evt){
        if (evt.target && dojo.hasClass(evt.target, "dojoxGridScrollbox")) {
            this.applyEdit();
            return;
        }
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
    onCellEdited: function(inValue, rowId, fieldId, isInvalid) {},
    onHeaderClick: function(evt, selectedItem, rowId, fieldId, rowNode, cellNode){
    },


    handleBack: function(inOptions) {
        this._handlingBack = true;
        try {
            var selectedRow = inOptions.selectedRow;
            if (selectedRow == -1) this.deselectAll();
            else this.select(selectedRow);
        } catch (e) {}
        delete this._handlingBack;
        return true;
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
    showCSVData: function(showHiddenColumns){
/*
        if (!this.csvDialog){
            this.csvDialog = new dijit.Dialog({ title: "CSV Data for " + this.name});
            dojo.body().appendChild(this.csvDialog.domNode);
            this.csvDialog.startup();
        }

        this.csvDialog.attr('content', this.toCSV());
        this.csvDialog.show();
*/
        app.echoFile(this.toCSV(showHiddenColumns), "text/csv", this.name + ".csv");
    },
    toHtml: function() {
        if (this._renderDojoObjSkipped) {
            this._renderHiddenGrid = true;
            this.renderDojoObj();
            this._renderHiddenGrid = false;
        }
        var style = this.toHtmlStyles();
        var html = "<table " + style + " border='0' cellspacing='0' cellpadding='0' class='wmdojogrid'><thead><tr>";
        dojo.forEach(this.columns, function(col, idx) {
            if (!col.show) return;
            html += "<th style='" + (col.width.match(/px/) ? col.width : "") + "'>" + col.title + "</th>";
        }, this);
        html += "</tr></thead><tbody>";

        var dataList = this.variable.getData();
        dojo.forEach(dataList, function(obj, rowId) {
            dojo.forEach(this.columns, function(col, idx) {
                if (!col.show) return;
                try {
                    var value = obj[col.field || col.id];
                    if (!value && !col.isCustomField) {
                        var value = obj;
                        var colid = col.field || col.id;
                        while (colid.indexOf(".") != -1) {
                            var index = colid.indexOf(".");
                            value = value[colid.substring(0, index)];
                            colid = colid.substring(index + 1);

                        }
                        value = value[colid];
                    }
                    if (col.expression) {
                        value = this.getExpressionValue(col.expression, idx, obj, true);
                    }
                    if (col.formatFunc) {
                        switch (col.formatFunc) {
                        case 'wm_date_formatter':
                        case 'Date (WaveMaker)':
                            value = this.dateFormatter(col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_localdate_formatter':
                        case 'Local Date (WaveMaker)':
                            value = this.localDateFormatter(col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_time_formatter':
                        case 'Time (WaveMaker)':
                            value = this.timeFormatter(col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_number_formatter':
                        case 'Number (WaveMaker)':
                            value = this.numberFormatter(col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_array_formatter':
                            value = this.arrayFormatter(col.field, col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_currency_formatter':
                        case 'Currency (WaveMaker)':
                            value = this.currencyFormatter(col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_image_formatter':
                        case 'Image (WaveMaker)':
                            value = this.imageFormatter(col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_link_formatter':
                        case 'Link (WaveMaker)':
                            // spreadsheet shouldn't be given HTML
                            //value = this.linkFormatter(value);
                            break;

                        default:
                            if (!this.isDesignLoaded()) value = dojo.hitch(this.owner, col.formatFunc)(value, rowId, idx, col.field || col.id, {
                                customStyles: [],
                                customClasses: []
                            }, obj);
                            break;
                        }
                    }
                } catch (e) {
                    value = "";
                }
                html += "<td>" + value + "</td>";
            }, this);
            html += "</tr>";
        }, this);

        return html += "</tbody></table>";
    },


    toCSV: function(showHiddenColumns){
        if (this._renderDojoObjSkipped) {
            this._renderHiddenGrid = true;
            this.renderDojoObj();
            this._renderHiddenGrid = false;
        }
        var csvData = [];
        dojo.forEach(this.columns, function(col, idx){
            if (!col.show && !showHiddenColumns || col.field == "PHONE COLUMN")
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
                if (!col.show && !showHiddenColumns || col.field == "PHONE COLUMN")
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
                }
                if (col.formatFunc){
                    /* TODO FOR 6.5: Calls to formatters are missing some parameters; at least pass null if no parameter is needed */
                    if (col.formatFunc) {
                        switch (col.formatFunc) {
                        case 'wm_date_formatter':
                        case 'Date (WaveMaker)':
                            value = this.dateFormatter(col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_localdate_formatter':
                        case 'Local Date (WaveMaker)':
                            value = this.localDateFormatter(col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_time_formatter':
                        case 'Time (WaveMaker)':
                            value = this.timeFormatter(col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_number_formatter':
                        case 'Number (WaveMaker)':
                            value = this.numberFormatter(col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_array_formatter':
                            value = this.arrayFormatter(col.field, col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_currency_formatter':
                        case 'Currency (WaveMaker)':
                            value = this.currencyFormatter(col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_image_formatter':
                        case 'Image (WaveMaker)':
                            value = this.imageFormatter(col.formatProps || {}, "", "", "", value, idx);
                            break;
                        case 'wm_link_formatter':
                        case 'Link (WaveMaker)':
                            // spreadsheet shouldn't be given HTML
                            //value = this.linkFormatter(value);
                            break;

                        default:
                            if (!this.isDesignLoaded()) value = dojo.hitch(this.owner, col.formatFunc)(value, rowId, idx, col.field || col.id, {
                                customStyles: [],
                                customClasses: []
                            }, obj);
                            break;
                        }
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

        if (this._isDesignLoaded && studio.currentDeviceType != "desktop") {
            exp = exp.replace(/\$\{wm\.rowId\}/g, String(idx));
            exp = exp.replace(/\$\{this\}/g, dojo.toJson(json));
            exp = exp.replace(/\$\{wm\.runtimeId\}/g, this.getRuntimeId()).replace(/wm\.List\.prototype\./g, "app.getValueById('" + this.getRuntimeId() + "').");
        }

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
    if (this instanceof wm.DojoGrid) {
        this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
    }
        if (!inValue) {
        return inValue;
        } else if (typeof inValue == "number" || inValue instanceof Date) {
        inValue = new Date(inValue); // clone the object if its a date; create the object if its a number
        } else if (inValue instanceof Date == false) {
        return inValue;
        }

        var dateType = formatterProps.dateType || 'date';
        if (!formatterProps.useLocalTime) {
            /* See WM-4490 to understand this calculation */
            var adjustSixHours = dateType == "date" ? 360 : 0;
            inValue.setHours(0, 60*inValue.getHours() + inValue.getMinutes() +wm.timezoneOffset * 60 + adjustSixHours);
        }
    var constraints = {fullYear: true, selector: dateType, formatLength:formatterProps.formatLength || 'short', locale:dojo.locale, datePattern: formatterProps.datePattern, timePattern: formatterProps.timePattern};
        return dojo.date.locale.format(inValue, constraints);
    },
    /* DEPRECATED */
    localDateFormatter: function(formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
    if (this instanceof wm.DojoGrid) {
        this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
    }
        if (!inValue) {
        return inValue;
        } else if (typeof inValue == "number" || inValue instanceof Date) {
        inValue = new Date(inValue); // clone the object if its a date; create the object if its a number
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
    if (this instanceof wm.DojoGrid) {
        this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
    }
        if (!inValue) {
        return inValue;
        } else if (typeof inValue == "number" || inValue instanceof Date) {
        inValue = new Date(inValue); // clone the object if its a date; create the object if its a number
        } else if (inValue instanceof Date == false) {
        return inValue;
        }
        inValue.setHours(inValue.getHours() + wm.timezoneOffset,0,0);

        var constraints = {selector:'time', formatLength:'short', locale:dojo.locale};
        return dojo.date.locale.format(inValue, constraints);
    },
    numberFormatter: function(formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
    if (this instanceof wm.DojoGrid) {
        this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
    }
        var constraints = {
        places: formatterProps.dijits || 0,
        round: formatterProps.round ? 0 : -1,
        type: formatterProps.numberType
        };
        return dojo.number.format(inValue, constraints);
    },
    currencyFormatter: function(formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
        var isDesignLoaded = false;
        if (this instanceof wm.DojoGrid) {
        this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
        isDesignLoaded = this._isDesignLoaded;
        }
        return dojo.currency.format(inValue, {
        currency: formatterProps.currency || (isDesignLoaded ? studio.application.currencyLocale : app.currencyLocale) || "USD",
        places: formatterProps.dijits == undefined ? 2 : formatterProps.dijits,
        round: formatterProps.round ? 0 : -1
        });
    },
    imageFormatter: function(formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
        if (this instanceof wm.DojoGrid) {
        this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
        }
        if (inValue && inValue != '') {
        var width = formatterProps.width ? ' width="' + formatterProps.width + 'px"' : "";
        var height = formatterProps.height ? ' height="' + formatterProps.height + 'px"' : "";
        if (formatterProps.prefix) {
           	if (formatterProps.prefix.match(/\/$/) && inValue.indexOf("/") == 0) inValue = inValue.substring(1);
            inValue = formatterProps.prefix + inValue;
		}
        if (formatterProps.postfix)
            inValue = inValue + formatterProps.postfix;

        return '<img ' + width + height + ' src="'+ inValue +'">';
        }
        return inValue;
    },
    /* Can't support this for mobile because "this" is required */
    buttonFormatter: function(field, formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
        this.handleColorFuncs(cellObj,backgroundColorFunc, textColorFunc,cssClassFunc, rowIdx);
        if (inValue !== null && inValue !== undefined && inValue !== '') {
            var classList = formatterProps.buttonclass ? ' class="' + formatterProps.buttonclass + '" ' : ' class="wmbutton" ';
            var onclick = "onclick='app.getValueById(\"" + this.getRuntimeId() + "\").gridButtonClicked(event,\"" + field + "\"," + rowIdx + ")' ";
            return '<button ' + onclick + formatterProps.buttonclick  + classList + '>' + inValue + '</button>';
        }
        return inValue;
    },
    gridButtonClicked: function(event,fieldName, rowIndex) {
        event = event || window.event;
        // prevent row selection which would trigger an onSelect/onSelectionChange events which could trigger navigation or other tasks contrary to executing of this button
        dojo.stopEvent(event);
        this.applyEdit();
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
    arrayFormatter: function(field, formatterProps, backgroundColorFunc, textColorFunc,cssClassFunc,inValue, rowIdx, cellObj){
        if (!formatterProps.joinFieldName) formatterProps.joinFieldName = "dataValue";
        if (!formatterProps.separator) formatterProps.separator = ",";
        var str = "";
        var data = this.getRow(rowIdx);
        if (data)
            var wmvar = data._wmVariable;
        if (wmvar)
            var data = wmvar.getValue(field).getData();
        if (data) {



            dojo.forEach(data, function(item) {
                if (str) str += formatterProps.separator + " ";
                str += item[formatterProps.joinFieldName];
            });
        }
        return str;
    },
    customFormatter: function(formatFunc, backgroundColorFunc, textColorFunc, cssClassFunc, inValue, rowIdx, cellObj) {
        try {
            var rowObj = this.getRow(rowIdx);
            this.handleColorFuncs(cellObj, backgroundColorFunc, textColorFunc, cssClassFunc, rowIdx);

            if (formatFunc && this.owner[formatFunc]) {
                return dojo.hitch(this.owner, formatFunc, inValue, rowIdx, cellObj.index, cellObj.field, cellObj, rowObj)();
            } else {
                return inValue;
            }
        } catch (e) {}
        return "";
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
          attributes = dojo.filter(attributes, function(inValue) {return inValue.indexOf("_") !== 0;})
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
    restrictValues: true,
    isSimpleType: false,
    widgetClass: dijit.form.ComboBox,
    getWidgetProps: function(inDatum) {
        if (this.widgetProps && this.widgetProps.isSimpleType) {
            this.isSimpleType = this.widgetProps.isSimpleType;
        }

        this.restrictValues = this.widgetProps && this.widgetProps.restrictValues !== undefined ? this.widgetProps.restrictValues : true;

        return dojo.mixin({}, this.widgetProps || {}, {
            value: inDatum,
            store: this.generateStore(this.options, this.widgetProps.displayField)
        });
    },
    cleansComboBoxOptions: function(inDataSet) {
        var data = inDataSet.getData();
        for (var i = 0; i < data.length; i++) {
            var o = data[i];
            wm.forEachProperty(o, function(value,name) {
                if (typeof value == "object") delete o[name];
            });
        }
        return data;
    },
    generateStore: function(options, displayField) {
        var items = [];

        dojo.forEach(options, function(o,i) {
            if (typeof o == "string") {
                var tmp = {};
                tmp[displayField] = o;
                o = tmp;
            }
            o.wmDojoStoreId = i;
            //items.push(o.dataValue);
            items.push(o);
        }, this);
        var store = new dojo.data.ItemFileReadStore({
            data: {
                identifier: "wmDojoStoreId",
                items: items
            }
        });
        return store;
    },
    apply: function(inRowIndex) {
        //this.inherited(arguments);
        if (this.grid.canEdit(this, inRowIndex)) {
            if (!this.widget) return;
            var name = this.field;
            var objName = name.replace(/\..*?$/, "");
            var item = this.widget.item;
            var store = this.widget.store;
            if (this.widgetProps.owner) {
                var displayValue = this.widget.get("value");
                if (displayValue === "") {
                    value = null;
                } else {
                    // if the item isn't set but the user has entered a value,
                    // verify that there isn't a match.  Typically caused by
                    // using the initial value rather than selecting a value
                    if (!item && displayValue) {
                        dojo.forEach(this.options, dojo.hitch(this, function(option) {
                            try {
                                if (option[this.widgetProps.displayField][0] == displayValue) {
                                    this.widget.set("item", option);
                                    item = option;
                                }
                            } catch(e) {}
                        }));
                    }
                    var value = this.widgetProps.owner.itemToJSONObject(store, item);
                    if (this.isSimpleType && typeof value == "object") {
                        value = value[this.widgetProps.displayField];
                    }
                    var rowitem = this.grid.getItem(inRowIndex);
                    if (!this.restrictValues && this.isSimpleType && value === undefined) {
                        value = this.widget.get("value");
                    }
                }
                if (value && !this.isSimpleType) value = item;
                this.grid.doApplyCellEdit(value, inRowIndex, objName);
            }
        }
        this._finish(inRowIndex);
    },

    getValue: function() {
        var e = this.widget;
        // make sure to apply the displayed value
        e.set('displayedValue', e.get('displayedValue'));
        return e.get('value');
    }
});


dojo.declare("wm.grid.cells.DateTextBox", dojox.grid.cells.DateTextBox, {
    apply: function(inRowIndex) {
        var owner = this.widgetProps.owner;
        var column = owner.getColumn(this.field);
        var formatterProps = column.formatterProps;
        var useLocalTime = formatterProps && formatterProps.useLocalTime;
        var value = this.getValue(inRowIndex);
        if (!useLocalTime && value) {
            value.setHours(0,
                           -60 * wm.timezoneOffset + 6, /* See WM-4490 to understand this calculation */
                           0);
            //value.setHours(-wm.timezoneOffset, 0, 0);
        }
        this.applyEdit(value, inRowIndex);
        this._finish(inRowIndex);
    },
    getWidgetProps: function(inDatum){
        if (this.constraint) {
            if (typeof this.constraint.max == "number")
                this.constraint.max = new Date(this.constraint.max);
            if (typeof this.constraint.min == "number")
                this.constraint.min = new Date(this.constraint.min);
        }
        return dojo.mixin(this.inherited(arguments), {
            value: inDatum ? new Date(inDatum) : null
        });
    }

});



dojo.declare("dojox.grid.cells.NumberTextBox", dojox.grid.cells._Widget, {
    widgetClass: dijit.form.NumberTextBox,
    apply: function(inRowIndex) {
        var value = this.getValue(inRowIndex);
        if (isNaN(value)) value = null;
        this.applyEdit(value, inRowIndex);
        this._finish(inRowIndex);
    }
});
dojox.grid.cells.NumberTextBox.markupFactory = function(node, cell) {
    dojox.grid.cells._Widget.markupFactory(node, cell);
};



dojo.declare("dojox.grid.cells.ValidationTextBox", dojox.grid.cells._Widget, {
    widgetClass: dijit.form.ValidationTextBox,
    getWidgetProps: function(inDatum) {
        var props = this.inherited(arguments);
        return props;
    }
});
dojox.grid.cells.ValidationTextBox.markupFactory = function(node, cell) {
    dojox.grid.cells._Widget.markupFactory(node, cell);
};
dojo.declare("dojox.grid.cells.TimeTextBox", dojox.grid.cells._Widget, {
    widgetClass: dijit.form.TimeTextBox
});
dojox.grid.cells.TimeTextBox.markupFactory = function(node, cell) {
    dojox.grid.cells._Widget.markupFactory(node, cell);
};
