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

dojo.provide("wm.base.widget.List");
dojo.require("wm.base.widget.VirtualList");
dojo.require("wm.base.widget.Table.builder");
dojo.require('wm.base.lib.data');

// Data List: a list with a model
dojo.declare("wm.ListItem", wm.VirtualListItem, {
	create: function() {
		this.inherited(arguments);
		dojo.addClass(this.domNode, 'wmlist-item');
	},

	format: function(inData, inIndex) {
	    this.list.inSetContent = true;
	    var result =  (this.list.format ? this.list.format(inIndex, inData) : inData);
	    delete this.list.inSetContent;
	    return result;
	},
	setContent: function(inData, inImage) {
		var f = this.format(inData, this.index);
		this.inherited(arguments, [f]);
		this._data = this.getData();
	},
	getData: function() {
		return this.list.getItemData(this.index);
	},
	update: function() {
	    var html = this.format(this.getData(), this.index);
		this.domNode.innerHTML = html;
	},
	getColumnFromNode: function(inNode) {
		if (inNode) {
			while (inNode.tagName != "TD")
				inNode = inNode.parentNode;
			var td = inNode, tr = inNode.parentNode;
			for (var i=0, c; (c=tr.childNodes[i]); i++)
				if (c == td)
					return i;
		}
		return -1;
	}
});

wm.Object.extendSchema(wm.ListItem, {
    getData: {group: "method", returns: "Object"}
});

dojo.declare("wm.List", wm.VirtualList, {
    query: {},
    width:'100%',
    height:'200px',
    minWidth: 150,
    minHeight: 60,
        autoScroll: false,
	constructor: function() {
		this._data = [];
	},
	columnWidths: "",
	dataFields: "",
        classNames: "wmlist",
    columns: "",
    _columnsHash: "",
    setColumns: function(inColumns) {
	this.columns = inColumns;
	this._columnsHash = {};
	for (var i = 0; i < this.columns.length; i++) {
	    var column = this.columns[i];
	    this._columnsHash[column.field] = column;
	}
    },
	init: function() {
	    if (this.columns) {
		this.setColumns(this.columns);
	    }
	    if (this.noHeader) { // another grid property
		this.headerVisible = false;
	    }
		this.inherited(arguments);
		this.createSelectedItem();
		this.createBuilder();
		if (!this.columns && this.columnWidths && this.dataFields.split(",").length != this.columnWidths.split(",").length) {
		  console.error("Column width count does not match field list count");
		}
		this._setDataFields(this.dataFields);
		this.setColumnWidths(this.columnWidths);
		this._render();
		this.domNode.onboundschange = dojo.hitch(this, "updateHeaderWidth");
	},
	createSelectedItem: function() {
	         //this.selectedItem = new wm.Variable({name: "selectedItem", owner: this, async: true});
		 this.selectedItem = new wm.Variable({name: "selectedItem", owner: this});
	},
	createBuilder: function() {
		this.builder = new wm.table.builder(this.className+'-table', this.className+'-row', this.className+'-cell');
		this.builder.getCellContent = dojo.hitch(this, 'getCellContent');
		this.builder.getCellStyle = dojo.hitch(this, 'getCellStyle');
		this.builder.getCellClass = dojo.hitch(this, 'getCellClass');
	},
	createItem: function(inContent) {
		return new wm.ListItem(this, inContent);
	},
	_setSelected: function(inItem) {
		this.selected = inItem;
		var
			d = this.selected ? this.selected.getData() : {},
			s = this.selectedItem;
		if (dojo.isObject(d) && !wm.typeManager.getType(s.type))
			s.setDataSchema(d);
		if (this.selected && dojo.isObject(d))
			s.setData(d);
		else
			s.clearData();
		this.setValue("emptySelection", Boolean(!this.selected));

	},
	getEmptySelection: function() {
	  return Boolean(!this.selected);
	},
	hasSelection: function() {
	    return Boolean(this.selected);
	},

	_setDataFields: function(inDataFields) {
	    if (this.columns) {
		this._dataFields = [];
		for (var i = 0; i < this.columns.length; i++) {
		    if (this.columns[i].show) {
			this._dataFields.push(this.columns[i].field);
		    }
		}		
	    } else {
		var d = this.dataFields = inDataFields  || '';
		if (d) {
			var s = d.split(','), d=[];
			for (var i=0, v, f; (f=s[i]); i++) {
				v = dojo.trim(f);
				if (v)
					d.push(v);
			}
		// if no user defined fields, attempt to infer from data
		} else {
			// attempt to infer from dataSet schema
			var schema = (this.dataSet || 0)._dataSchema;
			if (schema) {
				var d = []
				for (var i in schema) {
					var ti = schema[i];
					if (!(ti||0).isList && !wm.typeManager.isStructuredType((ti||0).type))
						d.push(i);
				}
			// failing all else, attempt to infer from data itself
			} else {
				// data may be a single object (a row) or an array of rows
				var row = this._data;
				// if data is an array, grab up the first row
				if (dojo.isArray(row))
					row = row[0];
				// if row is an object, infer fields from properties
				if (dojo.isObject(row) && !dojo.isArray(row)) {
					d = [];
					for (var i in row)
						if (!dojo.isObject(row[i]))
							d.push(dojo.trim(i));
				}
			}
		}
		this.trimDataSetObjectFields(d);
		this._dataFields = d;
	    }
	},
	getDataSetObjectFields: function() {
		var o = {};
		if (!this.dataSet)
			return o;
		var t = this.dataSet.type, tt = wm.typeManager.getTypeSchema(t) || {};
		for (var i in tt) {
			if (wm.typeManager.isStructuredType(tt[i]))
				o[i] = tt[i];
		}
		return o;
	},
	trimDataSetObjectFields: function(inData) {
		var f = this.getDataSetObjectFields();
		for (var i in f) {
			for (var j=0, df; (df=inData[j]); j++) {
				if (df == i) {
					inData.splice(j, 1);
					break;
				}
			}
		}
	},
	setDataFields: function(inDataFields) {
		this._setDataFields(inDataFields);
		this._render();
	},
	setColumnWidths: function(inColumnWidths) {
		var c = this.columnWidths = inColumnWidths;
		this._columnWidths = dojo.isArray(c) ? c : c.split(',');
		this._render();
	},
	// rendering
	shouldShowHeader: function() {
		var dataHeader = this._dataFields && this.getCount();
		return (this.headerVisible && (dataHeader || this._headerContent));
	},
	getHeaderContent: function() {
		return this._headerContent || this.builder.generateHeaderHtml();
	},
	renderHeader: function() {
		var s = this.shouldShowHeader();
		this._setHeaderVisible(s);
		if (s) {
			this.headerNode.innerHTML = this.getHeaderContent();
			this.updateHeaderWidth();
		}
	},
	updateHeaderWidth: function() {
	    var f = this.items&&this.items[0];
	    var n = f&&f.domNode.firstChild;
	    var b = n&&dojo.marginBox(n);
	    if (b && this.headerNode.firstChild && b.w)
		dojo.marginBox(this.headerNode.firstChild, {w: b.w});
	},
	_render: function() {
		this.renderData(this._data);
	},
	clear: function() {
		this._data = null;
		this.inherited(arguments);
	},
	getDataItemCount: function() {
		return this._data.length;
	},
	//
	canSetDataSet: function(inDataSet) {
		return Boolean(inDataSet && inDataSet.isList);
	},
	// virtual binding target
	setDataSet: function(inDataSet) {
	    try {
		if (!this.canSetDataSet(inDataSet))
			this.dataSet = "";
		else
			this.dataSet = inDataSet;
		var t = (inDataSet||0).type || "AnyData";
		this.setSelectedItemType(t);
		this.dataSetToSelectedItem(inDataSet);
		this.onsetdata(this.dataSet);
		this.renderDataSet(this.dataSet);
	    } catch(e){alert(e.toString());}
	},
	setSelectedItemType: function(inType) {
		this.selectedItem.setType(inType);
	},
	update: function() {
		var ds = this.getValueById((this.components.binding.wires["dataSet"] || 0).source);
		wm.fire(ds, "update");
	},
	//
	renderDataSet: function(inDataSet) {
	    if (this.owner instanceof wm.Page) {
		console.log("ANCESTOR: " + this.isAncestorHidden());
	    }
	    if (this.isAncestorHidden() && !this._renderHiddenGrid) {
		if (this.owner instanceof wm.Page) {
		    console.log(this.parent);
		}
		this._renderDojoObjSkipped = true;
		return;
	    } 
	        this._renderDojoObjSkipped = false;
		var d = inDataSet instanceof wm.Variable ? inDataSet.getData() : [];
	        d = this.runQuery(d);
		this.renderData(d);
	},
	    _onShowParent: function() {
		if (this._renderDojoObjSkipped) {
		    this.renderDataSet(this.dataSet);
		}
	    },

	renderData: function(inData) {
		this.clear();
		this._data = inData;
		if (!this.dataFields)
			this._setDataFields();
		this.updateBuilder();
		if (!this._data)
			return;
		for (var i=0, l=this.getDataItemCount(); i<l; i++){
		  this.addItem(this.getItemData(i), i);
		}
		this.renderHeader();
	    dojo.query(".wmlist-item:nth-child(odd)",this.domNode).addClass("Odd");
		this.reflow();

	    if (this._listTouchScroll) {
		wm.job(this.getRuntimeId() + "ListSetupScroller", 1, dojo.hitch(this._listTouchScroll, "setupScroller"));
	    }
	},
    runQuery: function(inData) {
	if (wm.isEmpty(this.query)) {
	    return inData;
	} else {
	    var newData = [];
	    for (var i = 0; i < inData.length; i++) {
		var d = inData[i];
		var w = "*";
		var isMatch = true;
		for (var key in this.query) {
		    var a = d[key];
                    if (dojo.isString(a)) a = a.replace(/\\([^\\])/g,"$1");
		    var b = this.query[key];
                    if (dojo.isString(b)) {
			b = b.replace(/\\([^\\])/g,"$1");
			if (b.charAt(0) == w)
			    b = b.substring(1);
		    }
		    if (b == w)
			continue;
		    if (dojo.isString(a) && dojo.isString(b)) {
			if (b.charAt(b.length-1) == w)
			    b = b.slice(0, -1);
			a = a.toLowerCase();
			b = b.toLowerCase();
			if (a.indexOf(b) != 0) {
			    isMatch = false;
			    break;
			}
			    
		    }
		    else if (a !== b) {
			isMatch = false;
			break;
		    }
		}
		if (isMatch) {
		    newData.push(d);
		}
	    }
	    return newData;
	}
    },

	getHeading: function(inField) {
	    if (this.columns) {
		var column = this._columnsHash[inField];
		var heading = column.title;
		return heading == null ? "" : heading;
	    } else {
		var d = this._dataSource;
		var s = d && d.schema || 0;
		var si = s[inField] || 0;
		if (si.label) return wm.capitalize(si.label);
		else {
		    var fieldName = inField.replace(/^.*\./, "");
		    return wm.capitalize(fieldName);
		}
	    }
	},
	getItemData: function(inIndex) {
	    return this._data[inIndex];
	},
	// item rendering override.
	getCellContent: function(inRow, inCol, inHeader) {
	    var dataFields = this._dataFields && this._dataFields[inCol];
	    var cellData;
	    var i = this._formatIndex != null ? this._formatIndex : this.getCount();

	    /* If its a header... */
	    if (inHeader) {
		cellData = '<div>' + this.getHeading(dataFields);
	    } 

/*
	    else if (this.columns) {
		var value = this._data[i];
		cellData = value[dataFields];
		cellData = this.formatCell(dataFields,cellData, value, i, inCol);
	    }
	    */
	    else if (this.columns) {
		var value = this._data[i];
		var cellData = value;
		var props = dataFields.split(".");
		for (var propIndex = 0; propIndex < props.length; propIndex++) {
		    cellData = cellData[props[propIndex]];
		}

		cellData = this.formatCell(dataFields,cellData, value, i, inCol);
	    }

	    /* Else if the data came from a call to renderData([{randomHash},{randomHash},....]) */
	    if (cellData == undefined) {
		var d = this.getItemData(i);
		f = wm.decapitalize(dataFields);
		cellData = dataFields ? d[dataFields] : d;
	    }
	    var info = {column: inCol, data: cellData, header: inHeader};
	    this.onformat(info, inCol, cellData, inHeader,value);
	    if (!this.inSetContent) {
		this._formatIndex = null;
	    }
	    return info.data;
	},
	getColWidth: function(inCol) {
	    if (this.columns) {
		return this.columns[inCol].width;
	    } else {
		var c = this._columnWidths;
		return c && (c[inCol] != undefined) ? c[inCol] : Math.round(100 / this.builder.colCount) + '%';
	    }
	},
	getCellStyle: function(inRow, inCol) {
	    if (this.columns) {
		var text = [];
		var field = this._dataFields[inCol];
		var col = this._columnsHash[field];
		var align = col.align;

		if (inRow != -1) {
		    // ignore inRow parameter; its always -1 or 0 (header or cell)
		    inRow = this._formatIndex != null ? this._formatIndex : this.getCount();
		    var data = this._data[inRow];
		    if (col.backgroundColor) {
			var backgroundColor = wm.expression.getValue(col.backgroundColor, data,this.owner);
			if (backgroundColor) {
			    text.push("background-color:" + backgroundColor);
			}
		    }
		    if (col.textColor) {
			var textColor = wm.expression.getValue(col.textColor, data,this.owner);
			if (textColor) {
			    text.push("color:" + textColor);
			}
		    }
		}
		var width = this.getColWidth(inCol);
		if (width) {
		    text.push("width:" + width);
		}
		if (align) {
		    text.push("text-align:" + align);
		}
		return text.join(";");
	    } else {
		return "width: " + this.getColWidth(inCol) + ';';
	    }
	},
	updateBuilder: function() {
		this.builder.colCount = this._dataFields ? this._dataFields.length : 1;
		this.builder.rowCount = 1;
	},
	format: function(inIndex, inData) {
		this._formatIndex = inIndex;
		return this.builder.generateHtml(inData);
	},
	onformat: function(ioData, inColumn, inData, inHeader,inVariable) {
	  },
	onsetdata: function(inData) {
	  }
});

/* This block contains methods created solely to work with this.columns; or added for DojoGrid compatability */
wm.List.extend({
    renderDojoObj: function() {
	this._render();
    },
    formatCell: function(inField, inValue, inItem, inRowId,inColumnIndex) {
	if (!this._columnsHash) {
	    return inValue;
	} else {
	    var col = this._columnsHash[inField];
	var value = "";
	if (col.expression) {
	    try	{
		value = wm.expression.getValue(col.expression, inItem,this.owner);
	    }catch(e){}
	} else {
	    value = inValue;
	}

	if (col.formatFunc){
	    switch(col.formatFunc){
	    case 'wm_date_formatter':
	    case 'Date (WaveMaker)':				    
		value = this.dateFormatter(col.formatProps||{}, value);
		break;
	    case 'wm_localdate_formatter':
	    case 'Local Date (WaveMaker)':				    
		value = this.localDateFormatter(col.formatProps||{}, value);
		break;
	    case 'wm_time_formatter':
	    case 'Time (WaveMaker)':				    
		value = this.timeFormatter(col.formatProps||{}, value);
		break;
	    case 'wm_number_formatter':
	    case 'Number (WaveMaker)':				    
		value = this.numberFormatter(col.formatProps||{}, value);
		break;
	    case 'wm_currency_formatter':
	    case 'Currency (WaveMaker)':				    
		value = this.currencyFormatter(col.formatProps||{}, value);
		break;
	    case 'wm_image_formatter':
	    case 'Image (WaveMaker)':				    
		value = this.imageFormatter(col.formatProps||{}, value);	
		break;
	    case 'wm_link_formatter':
	    case 'Link (WaveMaker)':				    
		value = this.linkFormatter(col.formatProps||{}, value);	
		break;
	    case 'wm_button_formatter':
		value = this.buttonFormatter(inField, col.formatProps||{}, inRowId, value);
		break;
	    default:
		if (!this.isDesignLoaded()) {
		    if (this.owner[col.formatFunc]) {
			value = dojo.hitch(this.owner, col.formatFunc)(value, inRowId, inColumnIndex, inField, {}, inItem);
		    }
		} else {
		    value = "<i>runtime only...</i>";
		}
		break;
	    }
	}
	return value;
	}
    },
    dateFormatter: function(formatterProps, inValue) {
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
    numberFormatter: function(formatterProps, inValue) {
	    var constraints = {
		places: formatterProps.dijits || 0, 
		round: formatterProps.round ? 0 : -1,
		type: formatterProps.numberType
	    };
	    return dojo.number.format(inValue, constraints);
	},
    currencyFormatter: function(formatterProps, inValue) {
	    return dojo.currency.format(inValue, {
		currency: formatterProps.currency || (this._isDesignLoaded ? studio.application.currencyLocale : app.currencyLocale) || wm.getLocaleCurrency(),
		places: formatterProps.dijits == undefined ? 2 : formatterProps.dijits,
		round: formatterProps.round ? 0 : -1
	    });
	},
    imageFormatter: function(formatterProps, inValue) {
	if (inValue && inValue != '') {
	    var width = formatterProps.width ? ' width="' + formatterProps.width + 'px"' : "";
	    var height = formatterProps.height ? ' height="' + formatterProps.height + 'px"' : "";
	    if (formatterProps.prefix)
		inValue = formatterProps.prefix + inValue;

	    if (formatterProps.postfix)
		inValue = inValue + formatterProps.postfix;

	    return '<img ' + width + height + ' src="'+ inValue +'">';
	}
	return "";
    },
    linkFormatter: function(formatterProps, inValue) {
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
    buttonFormatter: function(field, formatterProps, rowId, inValue) {
	    if (inValue && inValue != '') {
		var classList = formatterProps.buttonclass ? ' class="' + formatterProps.buttonclass + '" ' : ' class="wmbutton" ';
		var onclick = "onclick='" + this.getRuntimeId() + ".gridButtonClicked(\"" + field + "\"," + rowId + ")' ";
		return '<button ' + onclick + formatterProps.buttonclick + '" style="width:94%;display:inline-block" ' + classList + '>' + inValue + '</button>';
	    }
	    return inValue;
	},
    gridButtonClicked: function(fieldName, rowIndex) {
	var rowData = this._data[rowIndex];
	this.onGridButtonClick(fieldName, rowData, rowIndex);
    },
    onGridButtonClick: function(fieldName, rowData, rowIndex) {},
    setSelectedRow: function(inIndex) {
	this.eventSelect(this.items[inIndex]);
    },
    select: function(inItemOrIndex) { 
	if (typeof inItemOrIndex != "object") {
	    this.deselectAll(true);
	    this.eventSelect(this.items[inItemOrIndex]);
	} else {
	    this.inherited(arguments);
	}
    },
    getRow: function(inRow) {
	return this._data[inRow];
    },
    findRowIndexByFieldValue: function(inFieldName, inFieldValue) {
	var item;
	for (var i = 0; i < this._data.length; i++) {
	    item = this._data[i];
	    if (item[inFieldName] === inFieldValue) {
		return i;
	    }
	}
	return -1;
    },
    getCell: function(rowIndex, fieldName) {
	var row = this._data[rowIndex];
	if (row) {
	    return row[fieldName];
	}
	return "";
    },
    setCell: function(rowIndex, fieldName, newValue, noRendering) {
	var item = this.dataSet.getItem(rowIndex);
	item.beginUpdate();
	item.setValue(fieldName, newValue);
	item.endUpdate();
	var row = this._data[rowIndex];
	if (row) {
	    row[fieldName] = newValue;
	    if (!noRendering) {
		this.items[rowIndex].setContent(row);
	    }
	}
    },
	getIsRowSelected: function(){
		return !this.getEmptySelection();
	},
    deleteRow: function(rowIndex) {
	this.dataSet.removeItem(rowIndex);
	this._render();
    },
    getRowCount: function() {
	return this.items.length;
    },
    addRow: function(inFields, selectOnAdd) {
	if (this.getRowCount() == 0 && this.variable) {
	    this.dataSet.setData([inFields]);
	    if (selectOnAdd) {
		this.select(0);
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
	      this.select(0);
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
		value =	"";
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
    getDataSet: function() {return this.dataSet;},
    setSortIndex: function(){console.warn("setSortIndex not implemented for wm.List");},
    setSortField: function(){console.warn("setSortField not implemented for wm.List");},
    setQuery: function(inQuery) {
	this.query = inQuery;
	this.renderDataSet(this.dataSet);
    },
    getColumnIndex: function(inFieldName) {
          for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].field == inFieldName) {
		return i;
	    }
	  }
	return -1;
    },
    getColumnShowing: function(inFieldName, inShowing, noRender) {
	var index = this.getColumnIndex(inFieldName);
	if (index != -1) 
	    return this.columns[index].show;
    },
    setColumnShowing: function(inFieldName, inShowing, noRender) {
	var index = this.getColumnIndex(inFieldName);
	if (index != -1 && this.columns[index].show != inShowing) {	    
	    this.columns[index].show = inShowing;
	    this.setColumns(this.columns);//regenerate this._dataFields
	    this._setDataFields();
	    if (!noRender) {
		this._render();
	    }
	}

    },

    setColumnWidth: function(inFieldName, inWidth, noRender) {
	this._columnsHash[inFieldName].width = inWidth;
	if (!noRender) {
	    this._render();
	}
    },
    getCellClass: function(inRow, inCol) {
	if (!this.columns) return;
	if (inRow != -1) {
	    // ignore inRow parameter; its always -1 or 0 (header or cell)
	    inRow = this._formatIndex != null ? this._formatIndex : this.getCount();
	    var field = this._dataFields[inCol];
	    var col = this._columnsHash[field];
	    var data = this._data[inRow];
	    if (col.cssClass) {
		return wm.expression.getValue(col.cssClass, data,this.owner);
	    }
	}
	return "";
    },
});

if (wm.isMobile) {
    wm.DojoGrid = wm.List;
}

wm.FocusablePanelRegistry = [];
dojo.declare("wm.FocusableList", wm.List, {

	init: function() {
		this.inherited(arguments);
		wm.FocusablePanelRegistry.push(this);
		dojo.connect(document, "keydown", this, "keydown");
	},
	nextFocus: null,
	nextFocusableItemField: null,
	priorFocus: null,
        hasFocus: false,
	focusOnStart: false,
	focusEventTime: 0,
	defaultFocusListIndex: 0,
	getNextFocus: function() {
	  if (!(this.nextFocus instanceof Object))
	    this.setNextFocus(this.nextFocus);
	  return this.nextFocus;
	}, 
	setNextFocus: function(inFocusable) {
	  if (!(inFocusable instanceof Object)) {
	    var tmp = this.getRoot()[inFocusable];
	    this.nextFocus = tmp || this.nextFocus;
	  } else
	    this.nextFocus = inFocusable;
	},
	getPriorFocus: function() {
	  if (!(this.priorFocus instanceof Object))
	    this.setPriorFocus(this.priorFocus);
	  return this.priorFocus;
	}, 
	setPriorFocus: function(inFocusable) {
	  if (!(inFocusable instanceof Object))
	    this.priorFocus = this.getRoot()[inFocusable];
	  else
	    this.priorFocus = inFocusable;
	},
	setFocus: function(inFocus,e) {
	  this.focusEventTime = (e) ? e.timeStamp : 0;
	  this.hasFocus = inFocus;
	  if (inFocus) {
	      //console.log(this.name + " has focus now");
	    this.show();
	      dojo.addClass(this.domNode, "wmselectedlist");
	    this.setBorderColor("rgb(0,0,160)");
	    for (var i = 0; i < wm.FocusablePanelRegistry.length; i++)
	      if (wm.FocusablePanelRegistry[i] != this)
		wm.FocusablePanelRegistry[i].setFocus(false, e);
	    if (this.getSelectedIndex() == -1) {
	      this.deselectAll(true);
	      if (this.defaultFocusListIndex != -1) {
		this.eventSelect(this.getItem(this.defaultFocusListIndex));
	      }
	    }
	    if (this.getNextFocus() instanceof Object)
	      this.getNextFocus().show();
	  } else {
	      dojo.removeClass(this.domNode, "wmselectedlist");
	    this.setBorderColor("transparent");
	  }
	},
	show: function() {
	  this.inherited(arguments);
	  var parent = this.parent;
	  while(parent && !(parent instanceof wm.Layer)) {
	    parent = parent.parent;
	  }
	  if (this.autoShowLayer) {
	    if (parent && (parent instanceof wm.Layer) && !parent.active) 
	      parent.parent.setLayer(parent);
	  }
	},
	onclick: function(inEvent, inItem) {
	  this.inherited(arguments);
	  this.setFocus(true, inEvent);
	},
	eventSelect: function(inItem) {
	  if (this.nextFocusableItemField) {
	    var data = inItem.getData();
	    var tmpObj = new wm.Object();
	    tmpObj.data =  data;
	    
	    var next  =tmpObj.getValue("data." + this.nextFocusableItemField);
	    if (next) {
		//console.log("set next to " + next);
	      this.setNextFocus(next);
	      if (this.getNextFocus() instanceof Object) this.getNextFocus().show();
	    }
	  }
	  this.inherited(arguments);
	},
	keydown: function(e) {
          if (e.target && e.target.nodeName.toLowerCase() == "input") return;
	  if (!this.hasFocus || this.focusEventTime == e.timeStamp) return;
	  if (e.ctrlKey || e.shiftKey) return;
	  
	  if (e.keyCode == dojo.keys.UP_ARROW) {
	    var index = this.getSelectedIndex();
	    index = index - 1;
	    if (index < 0) index = this.getCount() + index;
	    index = index % this.getCount();
	    this.deselectAll(true);
	    this.eventSelect(this.getItem(index));
	    dojo.stopEvent(e);
	  } else if (e.keyCode == dojo.keys.DOWN_ARROW) {
	    var index = this.getSelectedIndex();
	    index = (index + 1) % this.getCount();
	    this.deselectAll(true);
	    this.eventSelect(this.getItem(index));
	    dojo.stopEvent(e);
	  } else if (e.keyCode == dojo.keys.RIGHT_ARROW && this.nextFocus) {
	    this.getNextFocus().setFocus(true, e);
	    dojo.stopEvent(e);
	  } else if (e.keyCode == dojo.keys.LEFT_ARROW && this.priorFocus) {
	    this.deselectAll();
	    this.getPriorFocus().setFocus(true, e);
	    dojo.stopEvent(e);
	    if (this.nextFocus)
	      this.getNextFocus().hideNextChain();
	  }
	},
	setDataSet: function(inDataSet) {
	  this.inherited(arguments);
	  if (this.focusOnStart) {
	    this.setFocus(true, 0);
	    window.focus();
	  }
	  this.focusOnStart = false;
	},
	hideNextChain: function() {
	  this.hide();
	  if (this.nextFocus)
	    this.getNextFocus().hideNextChain();
	}
});


dojo.require("wm.base.widget.Container");
dojo.declare("wm.FocusablePanel", wm.Container, {
	
	init: function() {
		this.inherited(arguments);
		wm.FocusablePanelRegistry.push(this);
		dojo.connect(document, "keydown", this, "keydown");
		dojo.connect(this.domNode, 'click', this, 'onclick');
		if (this.focusOnStart) this.setFocus(true, 0);
	},
	autoShowLayer: false,
	autoFormFocus: null,
	nextFocus: null,
	priorFocus: null,
        hasFocus: false,
	focusOnStart: false,
	focusEventTime: 0,
	getNextFocus: function() {
	  if (!(this.nextFocus instanceof Object))
	    this.setNextFocus(this.nextFocus);
	  return this.nextFocus;
	}, 
	setNextFocus: function(inFocusable) {
	  if (!(inFocusable instanceof Object)) {
	    var tmp = this.getRoot()[inFocusable];
	    this.nextFocus = tmp || this.nextFocus;
	  } else
	    this.nextFocus = inFocusable;
	},
	getPriorFocus: function() {
	  if (!(this.priorFocus instanceof Object))
	    this.setPriorFocus(this.priorFocus);
	  return this.priorFocus;
	}, 
	setPriorFocus: function(inFocusable) {
	  if (!(this.priorFocus instanceof Object))
	    this.priorFocus = this.getRoot()[inFocusable];
	  else
	    this.priorFocus = inFocusable;
	},
	setFocus: function(inFocus, e) {
	  this.focusEventTime = e.timeStamp;
	  this.hasFocus = inFocus;
	  if (inFocus) {
	      //console.log(this.name + " has focus now");
	    this.show();
	    this.setBorderColor("rgb(0,0,160)");
	    if (this.autoFormFocus)
	      this.getRoot()[this.autoFormFocus].focus();
	    for (var i = 0; i < wm.FocusablePanelRegistry.length; i++)
	      if (wm.FocusablePanelRegistry[i] != this)
		wm.FocusablePanelRegistry[i].setFocus(false, e);
	    if (this.getNextFocus() instanceof Object)
	      this.getNextFocus().show();
	  } else {
	    this.setBorderColor("transparent");
	  }
	},
	show: function() {
	  this.inherited(arguments);
	  var parent = this.parent;
	  while(parent && !(parent instanceof wm.Layer)) {
	    parent = parent.parent;
	  }
	  if (this.autoShowLayer) {
	    if (parent && (parent instanceof wm.Layer) && !parent.active) 
	      parent.parent.setLayer(parent);
	  }
	},
	onclick: function(inEvent, inItem) {
	  this.inherited(arguments);
	  this.setFocus(true, inEvent);
	},
	keydown: function(e) {
          if (e.target && e.target.nodeName.toLowerCase() == "input") return;
	  if (!this.hasFocus || this.focusEventTime == e.timeStamp) return;
	  if (e.ctrlKey || e.shiftKey) return;
	  
	  if (e.keyCode == dojo.keys.RIGHT_ARROW && this.nextFocus) {
	    this.getNextFocus().setFocus(true, e);
	    dojo.stopEvent(e);
	  } else if (e.keyCode == dojo.keys.LEFT_ARROW && this.priorFocus) {
	    this.getPriorFocus().setFocus(true, e);
	    dojo.stopEvent(e);
	    if (this.nextFocus)
	      this.getNextFocus().hideNextChain();
	  } else if (e.keyCode == dojo.keys.ENTER || e.keyCode == dojo.keys.NUMPAD_ENTER) {
	      this.ondblclick({}, this.selectedItem);
	  }

	},
	hideNextChain: function() {
	  this.hide();
	  if (this.nextFocus)
	    this.getNextFocus().hideNextChain();
	}

});
