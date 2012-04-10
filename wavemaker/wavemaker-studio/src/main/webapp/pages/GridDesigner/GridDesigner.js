/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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
dojo.declare("GridDesigner", wm.Page, {
    start: function() {
	wm.typeManager.types.gridDefinitionType.fields.field.include = ["update"];
    },
	updateFormatterList: function(){
	    this.fullFormattersVar.setData(this.formattersVar);
	    dojo.forEach(getAllEventsInCode(), dojo.hitch(this, function(f){
		    if (f.match(/Format$/))
			this.fullFormattersVar.addItem({name:f, dataValue:f});			
	    }));
			this.fullFormattersVar.addItem({name:studio.getDictionaryItem("wm.DojoGrid.ADD_FORMATTER"), dataValue:"- Add Formatter"});
	},
    updateDataSets: function() {
	var list = [{dataValue:""}];
	wm.listMatchingComponentIds([studio.page, studio.application], function(c) {
	    if (c instanceof wm.Variable && c.isList && c.name && c.name.indexOf("_") != 0) {
		list.push({dataValue: c.getId()});
	    }
	});
	this.liveSourceVar.setData(list);
    },
    setGrid: function(inGrid) {
	this.currentGrid = inGrid;
	this.currentDataSet = inGrid.dataSet;
	this.initialColumns = inGrid.columns

	var columns = dojo.clone(inGrid.columns);
	var mobileIndex = -1;
	for (var i = 0; i < columns.length; i++) {
	    if (!columns[i].mobileColumn) {
		columns[i].mobileColumn = false;
	    } else
		mobileIndex = i;
	}
	if (mobileIndex == -1) {
	    columns.push({show: true,
			  field: "MOBILE COLUMN",
			  title: "-",
			  width: "100%",
			  align: "left",
			  expression: "",
			  mobileColumn: true});
	    mobileIndex = columns.length-1;
	}
	this.columnsVar.setData(columns);
	this.mobileColumn = this.columnsVar.getItem(mobileIndex);
	this.regenerateMobileColumn();
	this.updateFormatterList();
	this.updateDataSets();
    },
    regenerateMobileColumn: function() {
	if (!this.mobileColumn || this.mobileColumn.getValue("isCustomField")) return;
	var mobileExpr = "";
	var count = this.columnsVar.getCount();


	for (var i = 0; i < count; i++) {
	    var column = this.columnsVar.getItem(i).getData();
	    if (!column.mobileColumn && column.show) {

		if (column.expression) {
		    // don't even TRY to handle this
		} else {
		    var value = "\${" + column.field + "}";
		    var formatProps = column.formatProps ? dojo.toJson(column.formatProps) : "{}";
		    if (column.formatFunc) {
			switch(column.formatFunc) {
			case "wm_date_formatter": 
			case 'Date (WaveMaker)': 
			case 'wm_localdate_formatter':
			case 'Local Date (WaveMaker)':				    
			    value = "wm.DojoGrid.prototype.dateFormatter(" + formatProps + ", null,null,null," + value +")";
			    break;
			case 'wm_number_formatter':
			case 'Number (WaveMaker)':				    
			    value = "wm.DojoGrid.prototype.numberFormatter(" + formatProps + ", null,null,null," + value +")";
			    break;
			case 'wm_currency_formatter':
			case 'Currency (WaveMaker)':				    
			    value = "wm.DojoGrid.prototype.currencyFormatter(" + formatProps + ", null,null,null," + value +")";
			    break;
			case 'wm_image_formatter':
			case 'Image (WaveMaker)':				    
			    value = "wm.DojoGrid.prototype.imageFormatter(" + formatProps + ", null,null,null," + value +")";
			    break;
			case 'wm_link_formatter':
			case 'Link (WaveMaker)':				    
			    value = "wm.DojoGrid.prototype.linkFormatter(" + formatProps + ", null,null,null," + value +")";
			    break;
			case 'wm_button_formatter':
			    value = null;
			    break;
			}
		    }
		    if (value) {
			if (!mobileExpr) {
			    mobileExpr = "\"<div class='MobileRowTitle'>" + wm.capitalize(column.field) + ": \" + " + value +  " + \"</div>\"\n";
			} else {
			    mobileExpr += "+ \"<div class='MobileRow'>" + wm.capitalize(column.field) + ": \" + " + value + " + \"</div>\"\n";
			}
		    }
		}
	    }
	}
	if (studio.currentDeviceType != "phone") 
	    this.mobileColumn.beginUpdate();
	this.mobileColumn.setValue("expression", mobileExpr);
	if (studio.currentDeviceType != "phone") 
	    this.mobileColumn.endUpdate();
    },
    getColumnByField: function(inName) {
	for (var i = 0; i < this.currentGrid.columns.length; i++) {
	    if (this.currentGrid.columns[i].field == inName)
		return this.currentGrid.columns[i];
	}
    },
    moveUp: function(inSender) {
	var item = this.grid.selectedItem.getData();
	var selectedIndex = this.grid.getSelectedIndex();
	if (selectedIndex <= 0) return;
	this.columnsVar.beginUpdate();
	this.columnsVar.removeItem(selectedIndex);
	this.columnsVar.addItem(item, selectedIndex-1);
	this.columnsVar.endUpdate();
	this.columnsVar.notify();
	this.updateGrid();
    },
    moveDown: function(inSender) {
	var item = this.grid.selectedItem.getData();
	var selectedIndex = this.grid.getSelectedIndex();
	if (selectedIndex == -1 || selectedIndex >= this.columnsVar.getCount()) return;
	this.columnsVar.beginUpdate();
	this.columnsVar.removeItem(selectedIndex);
	this.columnsVar.addItem(item, selectedIndex+1);
	this.columnsVar.endUpdate();
	this.columnsVar.notify();
	this.updateGrid();	
    },
    addButtonClick: function(inSender) {
      try {
	  var newName = "customField";
	  for (var i = 0; this.getColumnByField(newName + i); i++) {}
	      
	  app.prompt("Enter an ID/fieldName for this column; this must be a unique name",
		     newName + i,
		     dojo.hitch(this, function(inResult) {
			 if (inResult && !this.getColumnByField(inResult)) {
			     this.grid.deselectAll();
			     this.grid.selectedItem.setDataSet(null);
			     this.columnsVar.addItem({field: inResult,
						      width: "100%",
						      title: wm.capitalize(inResult),
						      align: "left",
						      isCustomField: true,
						      show: true});
			     this.updateGrid();
			     window.setTimeout(dojo.hitch(this, function() {
				 this.grid.select(this.grid.getRowCount() - 1);
			     }), 1000);
			 }
		     }));
      } catch(e) {
          console.error('ERROR IN addButtonClick: ' + e); 
      } 
  },
    deleteButtonClick: function(inSender) {
	var row = this.grid.getSelectedIndex() ;
	if (row == -1) return;
	this.columnsVar.removeItem(row);
	this.updateGrid();
	window.setTimeout(dojo.hitch(this, function() {
	    this.grid.select(0);
	}), 10);

    },
    changeItem: function(inName, inValue, optionalRowIndex) {
	if (this.columnsVar.isEmpty()) return;
	var row = (optionalRowIndex === undefined) ? this.grid.getSelectedIndex() : optionalRowIndex;
	if (row == -1) return;

	var item = this.columnsVar.getItem(row);

	if (item.getValue("mobileColumn") && inName == "expression") {
	    item.beginUpdate();
	    item.setValue("isCustomField", true);
	    item.endUpdate();
	}

	if (item.getValue(inName) != inValue) {
	    item.beginUpdate(); // we don't need to regenerate the grid when this item changes
	    item.setValue(inName, inValue);
	    item.endUpdate();

	    if (item.getValue("mobileColumn") == false) {
		this.regenerateMobileColumn();
	    }

	    this.updateGrid(row);

	    return true;
	}
	return false;
    },
    updateGrid: function() {
	this.regenerateMobileColumn();
	    var columns = this.columnsVar.getData();
	for (var i = 0; i < columns.length; i++) {
	    var col = columns[i];
	    if (col.editorProps) {
		for (var name in col.editorProps) {
		    if (col.editorProps[name] === null)
			delete col.editorProps[name];
		}
	    }
	    if (col.constraints) {
		for (var name in col.constraints) {
		    if (col.constraints[name] === null)
			delete col.constraints[name];
		}
	    }
	    if (col.formatProps) {
		for (var name in col.formatProps) {
		    if (col.formatProps[name] === null)
			delete col.formatProps[name];
		}
	    }
	}
	this.currentGrid.set_columns(columns);
    },
    onTitleChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("title", inDataValue);
    },
    onWidthChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("width", this.widthSizeEditor.getDataValue() + this.widthTypeEditor.getDataValue());
    },
    onAlignChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("align", inDataValue);
    },
    onFormatChange: function(inSender, inDisplayValue, inDataValue) {
	var isCustom = false;
	if (inDataValue == "- Add Formatter") {
	    inDataValue = wm.getValidJsName(this.currentGrid.name + wm.getValidJsName(wm.capitalize(this.grid.selectedItem.getValue("field"))) + 'Format');
	    isCustom = true;
	}
	if (this.changeItem("formatFunc", inDataValue)) {
	    var row = this.grid.getSelectedIndex();
	    var item = this.columnsVar.getItem(row);
	    var formatProps = item.getValue("formatProps");
	    formatProps.beginUpdate();
	    item.getValue("formatProps").clearData();
	    formatProps.endUpdate();
	}
	switch(inDataValue) {
	case "wm_currency_formatter":
	    this.currencyLayer.activate();
	    break;
	case "wm_number_formatter":
	    this.numberLayer.activate();
	    break;
	case "wm_image_formatter":
	    this.imageLayer.activate();
	    break;

	case "wm_button_formatter":
	    this.buttonLayer.activate();
	    break;
	case "wm_link_formatter":
	    this.linkLayer.activate();
	    break;

	case "wm_date_formatter":
	    this.dateLayer.activate();
	    if (!this.dateFormatLength.getDataValue())
		this.dateFormatLength.setDataValue("short");
	    break;
	default:
	    this.formatBlankLayer.activate();
	    if (isCustom) {
		eventEdit(this.currentGrid, "_formatterSignature", inDataValue, true);
		this.owner.owner.hide();
	    }
	}
    },
    onEditFieldChange: function(inSender, inDisplayValue, inDataValue) {
	if (this.changeItem("fieldType", inDataValue)) {
	    var row = this.grid.getSelectedIndex();
	    var item = this.columnsVar.getItem(row);

	    var editorProps = item.getValue("editorProps");
	    editorProps.beginUpdate();

	    var constraints = item.getValue("constraints");
	    constraints.beginUpdate();

	    item.getValue("editorProps").clearData();
	    item.getValue("constraints").clearData();

	    editorProps.endUpdate();
	    constraints.endUpdate();
	}
	switch(inDataValue) {
	case "dojox.grid.cells._Widget":
	    this.editorTextLayer.activate();
	    break;
	case "dojox.grid.cells.NumberTextBox":
	    this.editorNumberLayer.activate();
	    break;
	case "dojox.grid.cells.DateTextBox":
	    this.editorDateLayer.activate();
	    break;
	case "dojox.grid.cells.TimeTextBox":
	    this.editorTimeLayer.activate();
	    break;
	case "dojox.grid.cells.Checkbox":
	    this.editorCheckboxLayer.activate();
	    break;
	case "dojox.grid.cells.ComboBox":
	    this.editorComboBoxLayer.activate();
	    break;
	case "dojox.grid.cells.Select":
	    this.editorSelectLayer.activate();
	    break;

	default:
	    this.editorPropBlankLayer.activate();
	}

    },
    onDisplayExprChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("expression", inDataValue);
    },
    onBackExprChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("backgroundColor", inDataValue);
    },
    onColorExprChange:function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("textColor", inDataValue);
    },
    onCancelClick: function() {
	this.currentGrid.set_columns(this.initialColumns);
	this.owner.owner.hide();
    },
    onOkClick: function() {
	this.owner.owner.hide();
    },
    onCellEdited: function(inSender, inValue, rowId, fieldId) {
	this.updateGrid(rowId);
    },


    /* Currency Formatter Changes */
    onCurrencyTypeChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.currency", inDataValue);
    },
    onCurrencyDijitsChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.dijits", inDataValue);
    },
    onCurrencyRoundChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.round", inDataValue);
    },
    onDateLengthChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.formatLength", inDataValue);
    },
    onDatePatternChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.datePattern", inDataValue);
    },
    onTimePatternChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.timePattern", inDataValue);
    },
    onUseLocalTimeChange:function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.useLocalTime", inDataValue);
    },
    onDateTimeChange:function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.dateType", inDataValue);
    },

    onNumberTypeChange:function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.numberType", inDataValue);
    },
    onNumberDijitsChange:function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.dijits", inDataValue);
    },
    onNumberRoundChange:function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.round", inDataValue);
    },
    onLinkPrefixChange:function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.prefix", inDataValue);
    },
    onLinkPostfixChange:function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.postfix", inDataValue);
    },
    onTargetChange:function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.target", inDataValue);
    },
    onImageWidthChange:function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.width", inDataValue);
    },
    onImageHeightChange:function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.height", inDataValue);
    },
    onButtonClassChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("formatProps.buttonclass", inDataValue);
    },
    onRegexChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("editorProps.regExp", inDataValue);
    },
    onRequiredChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("editorProps.required", inDataValue);
    },
    onInvalidChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("editorProps.invalidMessage", inDataValue);
    },
    onOptionsChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("editorProps.options", inDataValue);
    },
    onDataSetChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("editorProps.selectDataSet", inDataValue);
	var c = studio.page.getValueById(inDataValue);
	var options = [];
	if (c)
	    var type = wm.typeManager.getType(c.type);
	if (type) {
	    var fields = type.fields;
	}
	if (fields) {
	    for (var fieldName in fields) {
		var fieldDef = fields[fieldName];
		if (!wm.typeManager.isStructuredType(fieldDef.type))
		    options.push(fieldName);
	    }
	}
	this.comboBoxDisplayFieldEditor.setOptions(options.join(","));
    },
    onDisplayFieldChange:function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("editorProps.displayField", inDataValue);
    },
    onMaximumChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("constraints.max", inDataValue);
    },
    onMinimumChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("constraints.min", inDataValue);
    },
    onCustomCssClassChange: function(inSender, inDisplayValue, inDataValue) {
	this.changeItem("cssClass", inDataValue);
    },

  _end: 0
});