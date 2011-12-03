dojo.declare("GridDesigner", wm.Page, {
    start: function() {
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
	this.columnsVar.setData(columns);
	this.updateFormatterList();
	this.updateDataSets();
    },
    getColumnByField: function(inName) {
	for (var i = 0; i < this.currentGrid.columns.length; i++) {
	    if (this.currentGrid.columns[i].field == inName)
		return this.currentGrid.columns[i];
	}
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

			     if (this.currentGrid.dojoObj) {
				 this.currentGrid.dojoObj.attr('structure', this.currentGrid.getStructure());
				 this.currentGrid.dojoObj.render();
			     }

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
	window.setTimeout(dojo.hitch(this, function() {
	    this.grid.select(0);
	}), 10);

    },
    changeItem: function(inName, inValue, optionalRowIndex) {
	if (this.columnsVar.isEmpty()) return;
	var row = (optionalRowIndex === undefined) ? this.grid.getSelectedIndex() : optionalRowIndex;
	if (row == -1) return;

	var item = this.columnsVar.getItem(row);
	if (item.getValue(inName) != inValue) {
	    item.beginUpdate(); // we don't need to regenerate the grid when this item changes
	    item.setValue(inName, inValue);
	    item.endUpdate();
	    this.updateGrid(row);
	    return true;
	}
	return false;
    },
    updateGrid: function(inRow) {
	    var columns = this.columnsVar.getData();
	    var col = columns[inRow];
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
	    this.currentGrid.columns = columns;
	    if (this.currentGrid.dojoObj) {
		this.currentGrid.dojoObj.attr('structure', this.currentGrid.getStructure());
		this.currentGrid.dojoObj.render();
	    }
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
		eventEdit(this.currentGrid, "_fomratterSignature", inDataValue, true);
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
	this.currentGrid.columns = this.initialColumns;
	if (this.currentGrid.dojoObj) {
	    this.currentGrid.dojoObj.attr('structure', this.currentGrid.getStructure());
	    this.currentGrid.dojoObj.render();
	}
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