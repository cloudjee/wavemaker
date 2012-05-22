/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

/* TODO:
 * 1. When list size changes, recalc list item heights
 * 2. using clientHeight may fail when there is margin, padding and border!
 */

dojo.provide("wm.base.widget.List");
dojo.require("wm.base.widget.VirtualList");
dojo.require("wm.base.widget.Table.builder");
dojo.require('wm.base.lib.data');

// Data; List: a list with a model
dojo.declare("wm.ListItem", wm.VirtualListItem, {
	create: function() {
	    this.inherited(arguments);
	    if (!this.domNode.id) {
		dojo.addClass(this.domNode, 'wmlist-item');
		this.rowId = this.list.nextRowId++;
		this.domNode.id = this.list.getRuntimeId() + "_ITEM_" + this.rowId;
	    }
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
	},
    select: function() {
	this.inherited(arguments);
	if (this.list.columns && (this.list.selectionMode == "checkbox" || this.list.selectionMode == "radio")) {
	    dojo.query("input",this.domNode)[0].checked = true;
	}
    },
    deselect: function() {
	this.inherited(arguments);
	if (this.list.columns && (this.list.selectionMode == "checkbox" || this.list.selectionMode == "radio")) {
	    dojo.query("input",this.domNode)[0].checked = false;
	}
    }
});

wm.Object.extendSchema(wm.ListItem, {
    getData: {group: "method", returns: "Object"}
});

dojo.declare("wm.List", wm.VirtualList, {    
    selectFirstRow: false,
    renderVisibleRowsOnly: true,
    autoSizeHeight: false,
    nextRowId: 0,
    query: {},
    width:'100%',
    height:'200px',
    minWidth: 150,
    minHeight: 60,
    deleteColumn: false,
    deleteConfirm: "Are you sure you want to delete this?",
        autoScroll: false,
	constructor: function() {
		this._data = [];
	},
	columnWidths: "",
	dataFields: "",
        classNames: "wmlist",
    columns: "",
    _columnsHash: "",
    /* TODO: Replace iterating over thousands of items with a hash lookup, also need to return the item index which is what is more often needed */
    getItemForNode: function(inRowNode) {
	var index = wm.Array.indexOf(this.items, inRowNode.id.replace(/^.*_/,""), function(item, id) {
	    return item && item.rowId == id;
	});
	if (index == -1) return null;
	return this.items[index];
    },
    deleteItem: function(inItem) {
	var index = this.inherited(arguments);
	dojo.query(".wmlist-item.Odd",this.domNode).removeClass("Odd");
	dojo.query(".wmlist-item:nth-child(odd)",this.domNode).addClass("Odd");
	var data = this._data[index];
	wm.Array.removeElementAt(this._data, index);
	this.onRowDeleted(index, data);
    },
	onRowDeleted: function(rowId, rowData){},
    setColumns: function(inColumns) {
	this.columns = inColumns;
	this._setSelectionColumn(this.selectionMode); // add in any controllers based on selection mode
	this._setDeleteColumn(this.deleteColumn); // add in any controllers based on deleteColumn
	this._columnsHash = {};
	var totalWidth = 0;
	for (var i = 0; i < this.columns.length; i++) {
	    var column = this.columns[i];
	    this._columnsHash[column.field] = column;
	    if (!column.width) column.width = "100%";
	    if (column.width.match(/\%/)) totalWidth += Number(column.width);
	}
	if (!this.isDesignLoaded() && dojo.isIE <= 8) {
	    for (var i = 0; i < this.columns.length; i++) {
		var column = this.columns[i];
		var w = column.width;
		if (w.match(/\%/)) {
		    column.width = (w * 100/totalWidth) + "%";
		}
	    }
	}
    },
	setSelectionMode: function(inMode) {
	  this.selectionMode = inMode;
	    if (inMode == "checkbox" || inMode == "extended")
		inMode = "multiple";
	    else if (inMode == "radio")
		inMode = "single";
	    else if (inMode == "extended") {
		inMode = this.selectionMode = "multiple";
	    }
	    this._selectionMode = inMode;

	    if (!this.columns) {
		this.convertToColumns();
	    } else {
		this.setColumns(this.columns);
	    }
	    this._render();
	},
        _setSelectionColumn: function() {
	    if (this.columns) {
		var found = false;
		for (var i = 0; i < this.columns.length; i++) {
		    if (this.columns[i].controller == "radio" || this.columns[i].controller == "checkbox") {
			found = true;
			if (this.selectionMode == "checkbox" || this.selectionMode == "radio") {
			    this.columns[i].controller = this.selectionMode;
			} else {
			    wm.Array.removeElementAt(this.columns,i);
			}
			break;
		    }
		}
		if (!found && (this.selectionMode == "radio" || this.selectionMode == "checkbox")) {
		    var index = this.columns[0].controller ? 1 : 0;
		    wm.Array.insertElementAt(this.columns, {width: "25px", title: "-", controller: this.selectionMode, field: "_selector", show: true}, index);
		}
	    }
	},
    convertToColumns: function() {
	if (this.dataFields) {
	    var fields = this.dataFields.split(/\s*,\s*/);
	} else if (this.dataSet && this.dataSet._dataSchema) {
	    var fields = wm.typeManager.getSimplePropNames(this.dataSet._dataSchema);
	}
	if (fields && fields.length) {
	    this.columns = [];
	    for (var i = 0; i < fields.length; i++) {
		this.columns.push({width: "100%",
				   field: fields[i],
				   show: true,
				   title: wm.capitalize(fields[i])
				  });
	    }
	}
	if (this.columns) {
	    this.setColumns(this.columns);
	}
	
    },
	init: function() {
	    this.setSelectionMode(this.selectionMode);
	    if (this.noHeader) { // another grid property
		this.headerVisible = false;
	    }
		this.inherited(arguments);

	    var spacerNodeTop = this.spacerNodeTop = document.createElement('div');
	    spacerNodeTop.className = "wmlist-spacer";
	    this.listNode.appendChild(spacerNodeTop);

	    var spacerNodeBottom = this.spacerNodeBottom = document.createElement('div');
	    spacerNodeBottom.className = "wmlist-spacer";
	    this.listNode.appendChild(spacerNodeBottom);

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
        postInit: function() {
	    this.inherited(arguments);
	    if (this.renderVisibleRowsOnly) {
		this.connect(this.listNode, "onscroll", this, "_onScroll");
/*
		if (wm.isFakeMobile) {
		    this.connect(this.domNode,'onmousedown', this, "_ontouchstart");
		} else if (wm.isMobile) {
		    this.connect(this.listNode, "ontouchstart", this, "_ontouchstart");
		    this.connect(this.listNode, "ontouchmove", this, "_ontouchmove");
		    this.connect(this.listNode, "ontouchend", this, "_ontouchend");
		}
		*/
	    }
	},
    _ontouchstart: function(e) {
	if (this._touchY && this._touchY.animationId) {
	    window.clearInterval(this._touchY.animationId);
	}
	this._touchY = {y: e.touches ? e.touches[0].clientY : e.y,
			time: new Date().getTime()};
/*
	if (wm.isFakeMobile) {
	    this.connect(this.domNode,'onmousemove', this, "_ontouchmove");
	    this.connect(this.domNode,'onmouseup', this, "_ontouchend");
	}
	*/

	/* Block any parent scrolling if this list has room to scroll */
	if (this.listNode.scrollHeight > this.listNode.clientHeight) {
	    dojo.stopEvent(e);
	}
    },
    _ontouchmove: function(e) {
	/* Do nothing if no room to scroll */
	if (this.listNode.scrollHeight <= this.listNode.clientHeight) return;

	if (this._touchedItem) this._touchedItem.touchMove();
	var y =   e.touches ? e.touches[0].clientY : e.y;
	var delta = this._touchY.y - y;
	var time = new Date().getTime();
	var deltaTime = time - this._touchY.time;
	var scrollTop = this.listNode.scrollTop;
	var newScrollTop = scrollTop + delta;
	if (newScrollTop < 0) {
	    newScrollTop = 0;
	} else if (newScrollTop > this.listNode.scrollHeight) {
	    newScrollTop =  this.listNode.scrollHeight;
	}
	this.listNode.scrollTop = newScrollTop;
	this._touchY = {y: y,
			velocity: delta / deltaTime,
			time: new Date().getTime()};
	dojo.stopEvent(e);
    },
    _ontouchend: function(e) { 
	/* Do nothing if no room to scroll */
	if (this.listNode.scrollHeight <= this.listNode.clientHeight) return;

	if (this._touchedItem) this._touchedItem.touchEnd();
	if (this._touchY.velocity != Infinity && Math.abs(this._touchY.velocity) > 0.01) {
	    this._touchY.animationId = window.setInterval(dojo.hitch(this, "_onAnimateScroll"), 50);
	}
	dojo.stopEvent(e);
/*
	if (wm.isFakeMobile) {
	    this.disconnectEvent("onmousemove");
	    this.disconnectEvent("onmouseup");
	}
	*/
    },
    _onAnimateScroll: function() {
	this._touchY.velocity *= 0.9;
	if (this._touchY.velocity == Infinity || Math.abs(this._touchY.velocity) < 0.01) {
	    window.clearInterval(this._touchY.animationId);
	    delete this._touchY.animationId;
	    return;
	}
	this.listNode.scrollTop += Math.min(this._touchY.velocity * 50, this.listNode.clientHeight); // velocity is px per ms; 50ms is our animation interval
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
        createItem: function(inContent, optionalDomNode) {
	    return new wm.ListItem(this, inContent, null,optionalDomNode);
	},
	getEmptySelection: function() {
	    return !this.hasSelection();
	},
	hasSelection: function() {
	    if (dojo.isArray(this.selected))
		return this.selected.length > 0;
	    else
		return Boolean(this.selected);
	},

    setDeleteColumn: function(inDelete) {
	this.deleteColumn = inDelete;
	if (!this.columns) {
	    this.convertToColumns();
	} else {
	    this.setColumns(this.columns);
	}
	this._render();
    },
    _setDeleteColumn: function() {
	if (this.columns) {
	    var found = false;
		for (var i = 0; i < this.columns.length; i++) {
		    if (this.columns[i].controller == "deleteColumn") {
			found = true;
			if (!this.deleteColumn) {
			    wm.Array.removeElementAt(this.columns,i);
			}
			break;
		    }
		}
	    if (!found && this.deleteColumn) {
		this.columns.unshift({width: "25px", title: "-", controller: "deleteColumn", field: "_deleteColumn", show: true});
	    }
	    }
    },

	_setDataFields: function(inDataFields) {
	    if (!this.columns && this.dataSet) {
		this.convertToColumns();
	    }
	    if (this.columns) {
		this._dataFields = [];

		var useMobileColumn = false;
		if (wm.device == "phone") {
		    for (var i = 0; i < this.columns.length; i++) {
			var c = this.columns[i];
			if (c.mobileColumn && c.show) {
			    useMobileColumn = true;
			    break;
			}
		    }
		}
		this._useMobileColumn = useMobileColumn;
		if (useMobileColumn && !this._isDesignLoaded) {
		    this.headerVisible = false;
		}
		for (var i = 0; i < this.columns.length; i++) {
		    var c = this.columns[i];
		    var show = useMobileColumn && c.mobileColumn || !useMobileColumn && !c.mobileColumn && c.show || c.controller;
		    if (show) {
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
	    var dataHeader = this._dataFields;// && this.getCount();
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
	    if (this.columns) return;
	    var f = this.items&&this.items[0];
	    var n = f&&f.domNode.firstChild;
	    var b = n&&dojo.marginBox(n);
	    if (b && this.headerNode.firstChild && b.w)
		dojo.marginBox(this.headerNode.firstChild, {w: b.w});
	},
	_render: function() {
	    if (!this._cupdating) {
		if (this.dataSet)
		    this.renderDataSet(this.dataSet);
		else
		    this.renderData(this._data);
	    }
	},
	clear: function(noEvents) {
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

	    if (this.isAncestorHidden() && !this._renderHiddenGrid) {
		this._renderDojoObjSkipped = true;
		return;
	    } 

	        this._renderDojoObjSkipped = false;
		var d = inDataSet instanceof wm.Variable ? inDataSet.getData() : [];
	        d = this.runQuery(d);
		this.renderData(d);
	},
    doAutoSize: function() {},
    setAutoSizeHeight: function(inValue) {
	this.autoSize = inValue;
	this._render();
    },
    setBestHeight: function() {
	if (this.autoSizeHeight) {
            this._doingAutoSize = true;
	    var height = 0;
	    if (this.items.length) {
		var coords = dojo.coords(this.items[this.items.length-1].domNode);
		height = coords.h + coords.t;
	    } else if (this.headerVisible) {
		var coords = dojo.coords(this.headerNode);
		height = coords.h + coords.t;
	    }
	    height += this.padBorderMargin.b + this.padBorderMargin.t + 2;
	    this.setHeight(height + "px");
	    this._doingAutoSize = false;
	}
    },
	    _onShowParent: function() {
		if (this._renderDojoObjSkipped && !this._headerRendered) {
		    wm.onidle(this, "_render");
		} else if (this.spacerNodeTop.clientHeight) {
		    this.listNode.scrollTop = this.spacerNodeTop.clientHeight;
		}
	    },
    setShowing: function(inShowing) {
	var wasShowing = this.showing;
	this.inherited(arguments);
	if (!wasShowing && inShowing) {
	    this._onShowParent();
	}
    },
	renderData_optimized: function(inData) {
/*
	    if (this.columns && (this.selectionMode == "checkbox" || this.selectionMode == "radio")) {
		    this.columns.unshift({width: "25px", title: "-", controller: this.selectionMode, field: "_selector", show: true});
		    this._columnsHash._selector = this.columns[0];
		}
	    if (this.columns && this.deleteColumn) {
		this.columns.unshift({width: "25px", title: "-", controller: "deleteColumn", field: "_deleteColumn", show: true});
		this._columnsHash._deleteColumn = this.columns[0];
	    }
	    */


	        var selectedData = this.selectedItem.getData();
		this.clear(true);
		this._data = inData;
		if (!this.dataFields)
			this._setDataFields();
		this.updateBuilder();
		if (!this._data)
			return;

	    this.renderHeader();
	    this._headerRendered = true;
	    /* changed from iterating over all items to doing 20 at a time so that rendering the grid, especially on mobile
	     * devices would not block up the thread for large grids.  Rener 20, then do any other processing that is waiting,
	     * then render the next 20
	     */
	    var i = 0;
	    var f = dojo.hitch(this,function(start, interval,nextFunc,doneFunc) {
		var max = Math.min(i+interval,this.getDataItemCount());
		for (;i < max; i++) {
		  this.addItem(this.getItemData(i), i);
		    this._formatIndex = null;
		}
		if (i < this.getDataItemCount()) {
		    wm.onidle(this, function() {
			nextFunc(i,interval,nextFunc, doneFunc);
		    });
		} else {
		    doneFunc();
		}
	    });

	    var onDone = dojo.hitch(this, function() {
		dojo.query(".wmlist-item:nth-child(odd)",this.domNode).addClass("Odd");
		this.reflow();

		if (this._listTouchScroll && !this._listTouchScroll.scrollers.outer.style.width) {
		    wm.job(this.getRuntimeId() + "ListSetupScroller", 1, dojo.hitch(this._listTouchScroll, "setupScroller"));
		}

		/*
		  if (this.columns && this.deleteColumn) {
		  this.columns.shift();
		  delete this._columnsHash._deleteColumn;
		  }
		  if (this.columns && (this.selectionMode == "checkbox" || this.selectionMode == "radio")) {
		  this.columns.shift();
		  delete this._columnsHash._selector;
		  }
		*/

		var isSelectedDataArray = dojo.isArray(selectedData);
		if (this.columns && ( isSelectedDataArray && selectedData.length || !isSelectedDataArray && selectedData || this.selectFirstRow))
		    this.selectItemOnGrid(selectedData);
		this.onRenderData();
	    });

	    f(0,20,f,onDone);
/*
		for (var i=0, l=this.getDataItemCount(); i<l; i++){
		  this.addItem(this.getItemData(i), i);
		}
		this.renderHeader();*/

	},
    renderBounds: function() {
	var h = parseInt(this.domNode.style.height);
	if (this.inherited(arguments) && this.renderVisibleRowsOnly) {
	    if (this._renderDojoObjSkipped) {
		this._render();
	    } else {
		var topItem = this.listNode.childNodes.length > 2 ? this.getItemForNode(this.listNode.childNodes[1]) : null;
		if (this.bounds.h > h) {
		    this._onScroll("down");
		} else {
		    this._onScroll("up");
		}
	    }
	}
    },
	renderData: function(inData) {
	    var maxRows = wm.device == "phone" ? this.maxRenderedRowsPhone : this.maxRenderedRows;
	    if (this.selectedItem.type) {
		var selectedData = this.selectedItem.getData();
	    }
	    this.clear(true);
	    this._data = inData;
	    if (!this.dataFields)
		this._setDataFields();
	    this.updateBuilder();

	    this.renderHeader();

	    this.spacerNodeBottom.style.height = "0px";
	    this.spacerNodeTop.style.height = "0px";

	    if (!this._data)
		return;

	    this._scrollDirection = "down";
	    if (this.renderVisibleRowsOnly) {
		if (!this.isAncestorHidden() && !this._loading) {
		    this.scrollDownAddItems(0);
		    this.avgHeight = this.getAverageItemHeight();
		    this.updateBottomSpacerHeight();
		} else {
		    this._renderDojoObjSkipped = true;
		}
	    } else {
		var totalCount = this.getDataItemCount();
		for (var i = 0; i < totalCount; i++) {
		    this.addItem(this.getItemData(i), i);
		}
		if (this.autoSizeHeight) {
		    if (!this.isAncestorHidden()) {
			this.setBestHeight();
		    } else {
			this._renderDojoObjSkipped = true;
		    }
		}
	    }
	    this.reflow();

	    if (this._listTouchScroll && !this._listTouchScroll.scrollers.outer.style.width) {
		wm.job(this.getRuntimeId() + "ListSetupScroller", 1, dojo.hitch(this._listTouchScroll, "setupScroller"));
	    }

		/*
		  if (this.columns && this.deleteColumn) {
		  this.columns.shift();
		  delete this._columnsHash._deleteColumn;
		  }
		  if (this.columns && (this.selectionMode == "checkbox" || this.selectionMode == "radio")) {
		  this.columns.shift();
		  delete this._columnsHash._selector;
		  }
		*/

		var isSelectedDataArray = dojo.isArray(selectedData);
		if (this.columns && ( isSelectedDataArray && selectedData.length || !isSelectedDataArray && selectedData || this.selectFirstRow))
		    this.selectItemOnGrid(selectedData);
		this.onRenderData();

	},
	_renderItem: function(i) {
	    if (this.items[i]) {
		/* in IE 8, domNodes removed from body are given a parentNode with no tagName */
		if (!this.items[i].domNode.parentNode || !this.items[i].domNode.parentNode.tagName) {
		    var parent = this.listNode;
		    var sibling = this.findNextSiblingNode(i);
		    parent.insertBefore(this.items[i].domNode,sibling);
		    if (this._isScrolling) {
			if (this._scrollDirection == "down") {
			    this.updateBottomSpacerHeight();
			    if (sibling != this.spacerNodeBottom) {
				this.spacerNodeTop.style.height = (this.spacerNodeTop.clientHeight - this.items[i].domNode.clientHeight) + "px";
			    }
			} else {
			    this.spacerNodeTop.style.height = (this.spacerNodeTop.clientHeight - this.getAverageItemHeight()) + "px";
			}
		    }
		}
	    } else {
		/* Its a spacer node, destroy the spacer and generate the real item */
		var hadSpacer = false;
		this._formatIndex = i;
		this.addItem(this.getItemData(i), i);
		this._formatIndex = null;
		if (this._isScrolling) {
		    if (this._scrollDirection == "down") {
			this.updateBottomSpacerHeight();
		    } else if (!hadSpacer) {
			this.spacerNodeTop.style.height = (this.spacerNodeTop.clientHeight - this.items[i].height) + "px";
		    }
		}
	    }

	    /* Sanity check... */
	    if (i == 0) {
		this.spacerNodeTop.style.height = "0px";
	    } else if (i ==  this.getDataItemCount() - 1) {
		this.spacerNodeBottom.style.height = "0px";
	    }
    },
    getNodeFromItem: function(inItem) {
	if (inItem) {
	    return inItem.domNode;
	} else {
	    return null;
	}
    },
    findNextSiblingNode: function(inIndex) {
	var parent = this.listNode;
	if (inIndex == 0) {
	    return parent.childNodes[1];
	} 
 	if (this.items[inIndex-1]) {
	    var priorSiblingNode = this.getNodeFromItem(this.items[inIndex-1]);
	    /* in IE 8, domNodes removed from body are given a parentNode with no tagName */
	    if (priorSiblingNode.parentNode && priorSiblingNode.parentNode.tagName) {
		    return parent.childNodes[dojo.indexOf(parent.childNodes, priorSiblingNode)+1];
	    }
	}
 	if (this.items[inIndex+1]) {
	    var node = this.getNodeFromItem(this.items[inIndex+1]);
		if (node.parentNode && node.parentNode.tagName) {
		    return node;
		}
	}
	for (var i = inIndex-2; i >= 0; i--) {
	    if (this.items[i]) {
	    var node = this.getNodeFromItem(this.items[i]);
	    if (node.parentNode && node.parentNode.tagName) {
		return parent.childNodes[dojo.indexOf(parent.childNodes, node)+1];
	    }
	    }
	}
        return parent.childNodes[1];
    },
    addItem: function(inContent, inIndex, optionalDomNode) {
	var item = this.createItem(inContent, optionalDomNode);
	    var parent = this.listNode;
	    dojo.setSelectable(item.domNode, false);
	    if (inIndex!= undefined) {
		this.items[inIndex] = item;
		item.index = inIndex;
		var sibling = this.findNextSiblingNode(inIndex);
		if (sibling) {
		    parent.insertBefore(item.domNode, sibling);
		} else {
		    parent.insertBefore(item.domNode, this.spacerNodeBottom);
		}
	    } else {
		this.items.push(item);
		item.index = this.items.length-1;
		var sibling = (this.items.length == inIndex+1) ? this.spacerNodeBottom : parent.childNodes[inIndex+1]; // +1 to get past the spacerNode
		parent.insertBefore(item.domNode, sibling);
	    }

	    return item;
    },
    addSpacer: function(inIndex, avgItemHeight) {
	var spacerNode = document.createElement('div');
	spacerNode.className = "wmlist-spacer";
	spacerNode.style.height = avgItemHeight + "px";
	var sibling = this.listNode.childNodes[inIndex+1]; // +1 to get past the spacerNode
	this.listNode.insertBefore(spacerNode, sibling);
	this.items[inIndex] = spacerNode;
    },
        addVisibleItems: function(startAddingFrom) {
	    //console.log("Add Visible Items:" + this._scrollDirection);
	    var parent = this.listNode;
	    var totalCount = this.getDataItemCount();
	    if (totalCount == 0) return;

	    var scrollTop = this.getScrollTop();
	    var targetHeight = this.getListNodeHeight() + scrollTop; // basically the height of our widget, minus the height of our header

	    var avgItemHeight = this.avgHeight = this.getAverageItemHeight();
	    if (startAddingFrom === undefined) {
		/* Skip through our list to the item that our guestimate says should be at scrollTop.
		   We'll subtract 10 from that both because its a guestimate, and because I want to pregenerate
		   a few rows in case the user scrolls up
		*/
		startAddingFrom = Math.floor(scrollTop/avgItemHeight);
		startAddingFrom = Math.max(0,startAddingFrom-10);
		startAddingFrom = Math.min(startAddingFrom, totalCount);

	    }
	    /* Find any ungenerated items prior to startAddingFrom, and generate a placeholder */

	    if (this._scrollDirection == "down") {
		for (var i = 0; i < startAddingFrom; i++) {

		    /* TODO: Reuse this single spacer on all of the items siblings */
		    if (!this.items[i]) {
			this.addSpacer(i,avgItemHeight);
			currentHeight += avgItemHeight;
		    }
		}
	    } else {
		// figure out how many items we've skipped and adjust the topSpacer accordingly
		var firstItemNode = parent.childNodes[1];
		var firstItemBeforeAdding = this.getItemForNode(firstItemNode);
	    }

	    /* Keep adding items/rows until the rows are below the bottom of the list's viewport */
	    var currentHeight = targetHeight-1; // just force currentHeight < targetHeight
	    for (var i = startAddingFrom; i < totalCount && currentHeight < targetHeight; i++) {
		this._renderItem(i);
		if (!this.items[i]) {
		    this._renderItem(i);
		}
		currentHeight = this.items[i].domNode.offsetTop + this.items[i].domNode.clientHeight;
	    }
	
	    
	    /* Add 10 more rows so they don't have to be suddenly rendered if the user starts scrolling */
	    var extraTenMax = i + 10;
	    for (; i < totalCount && i < extraTenMax; i++) {
		this._renderItem(i);
	    }

	    this.addOddClasses();
	},
    updateTopSpacerHeight: function() {
	var firstRow = this.listNode.childNodes[1];
	if (!firstRow) {
	    this.spacerNodeTop.style.height = "0px";
	} else {
	    var item = this.getItemForNode(firstRow);
	    var indexOfItem = dojo.indexOf(this.items,item);
	    var preferredHeight = indexOfItem * this.getAverageItemHeight();
	    this.spacerNodeTop.style.height = preferredHeight + "px";
	}
    },
    updateBottomSpacerHeight: function() {
	var totalCount = this.getDataItemCount();

	// find the last item that is rendered
	var rows = this.listNode.childNodes;
	if (rows <= 2) {
	    this.spacerNodeBottom.style.height = "0px";
	    return;
	}
	var lastRow = rows[rows.length-2];
	var lastItem = this.getItemForNode(lastRow);
	var lastIndex = dojo.indexOf(this.items, lastItem);
	var unshownCount = totalCount - lastIndex - 1;

	if (unshownCount > 0) {
	    this.spacerNodeBottom.style.height = (unshownCount * this.avgHeight) + "px";
	} else {
	    this.spacerNodeBottom.style.height = "0px";
	}
    },
    getListNodeHeight: function() {
	if (this._listTouchScroll) {
	    return this._listTouchScroll.scrollers.outer.clientHeight;
	} else {
	    return this.listNode.clientHeight;
	}
    },
    getScrollTop: function() {
	if (this._listTouchScroll) {
	    var listNode = this._listTouchScroll.scrollers.outer;
	    var matches = listNode.style.WebkitTransform.match(/,\s*-?(\d+)/);
	    if (matches) {
		return parseInt(matches[1]);
	    } else {
		return 0;
	    }
	} else {
	    var listNode = this.listNode;
	    return listNode.scrollTop;
	}
    
    },
    updateAverageItemHeight: function() {
	var h = 0;
	var count = 0;
	var rows = this.listNode.childNodes;
	for (var i = 1; i < rows.length - 2; i++) {
	    h += rows[i].clientHeight;
	}
	if (h > 0) {
	    this.avgHeight = h/(rows.length-3);
	}
	return this.avgHeight;

    },
    getAverageItemHeight: function() {
	return this.avgHeight;
    },
    _onScroll: function(direction, doCleanup) {
	try {
	    // sometimes the last scroll event causes scrollTop to change, triggering a new onScroll event
	    // and causes infinite loop
	    if (this._lastScrollTime && ( new Date().getTime() - this._lastScrollTime) < 10) {
		//app.toastWarning("Too Soon:" + this._lastScrollTime);
		return;
	    }
	    this._isScrolling = true;
	    var scrollTop = this.getScrollTop();

	    if (direction == "down" || direction != "up" && (this._lastScrollTop === undefined || this._lastScrollTop < scrollTop)) {
		this._scrollDirection = "down";
		this.scrollDownRemoveItems();
		this.scrollDownAddItems();
		// sometimes events don't come at the right time, so cleanup is needed
		wm.job(this.getRuntimeId() + ".testScrollTop", 200, this, "scrollDownAddItems");
	    } 

	    /* Else if our spacer has scrolled back into view, render older rows */
	    else {

		this._scrollDirection = "up";
		this.scrollUpRemoveItems();
		this.scrollUpAddItems();
		// sometimes events don't come at the right time, so cleanup is needed
		wm.job(this.getRuntimeId() + ".testScrollTop", 200, this, "scrollUpAddItems");
	    }
	} catch(e) {}
	this._lastScrollTop = scrollTop;
	this._lastScrollTime = new Date().getTime();
	//app.toastSuccess("ScrollTop UPDATING3: " + scrollTop + "; LAST: " + this._lastScrollTop);
	this._isScrolling = false;	
    },
    _testScrollTop: function() {
	this._onScroll(null, true);
    },

    /* 1. Once we generate an item, that item stays in the items array.  
       1a. Never destroy its node once generated, switch from showing/hiding it as it scrolls in/out of view
       1b. Each row knows if it should be shown or not
       2. List knows if/when an item has been skipped and can insert items into the middle
       3. List should have some way to narrow down calculations to just those rows that have been scrolled out of view and into view
          and ignore all other rows
	  */

    scrollDownAddItems: function(startAddingFrom) {
	var avgItemHeight = 0;
	var parent = this.listNode;
	var totalCount = this.getDataItemCount();
	if (totalCount == 0) return;	

	var scrollTop = this.getScrollTop();
	var listNodeHeight = this.getListNodeHeight();
	var currentHeight = 0;

	// Render items until we've passed the height of the scrollTop + the height of the list area
	var targetHeight = listNodeHeight + scrollTop + this.spacerNodeTop.offsetTop;

	/* If this isn't our first render call (from renderData() ), then we're scrolling down.  We could be 5px
	 * down or 5000px down, come up with a guess for where we should start generating rows.
	 * We'll subtract 10 from that both because its a guestimate, and because I want to pregenerate
	 * a few rows in case the user scrolls up.
	*/

	if (startAddingFrom === undefined) {
	    /* If there are rows showing, then use them as the basis from which we determine what rows to add */
	    if (this.listNode.childNodes.length > 2) {
		var item = this.getItemForNode(this.listNode.childNodes[this.listNode.childNodes.length-2]);
		var index = dojo.indexOf(this.items, item);
		startAddingFrom = index + 1;
		currentHeight = item.domNode.offsetTop + item.domNode.clientHeight;
	    }

	    /* If there are no rows showing, do a guesstimate based on scrollTop */
	    else {
		avgItemHeight = this.getAverageItemHeight();
		startAddingFrom = Math.floor(scrollTop/avgItemHeight);
		currentHeight = this.spacerNodeTop.clientHeight;
	    }
/*
	    startAddingFrom = Math.max(0,startAddingFrom-10);
	    startAddingFrom = Math.min(startAddingFrom, totalCount);
	    */

	    /* If there are only 2 nodes (top spacer and bottom spacer, and we've already scrolled,
	     * then the user has fast scrolled and removeRows had to delete ALL rows.
	     * There are no prior rows to append next to for proper
	     * positioning.  So make a best guess for a 
	     * topSpacer height that will allow our new rows to show in the correct place
	     */
	    if (parent.childNodes.length == 2) {
		var topSpacer = avgItemHeight * startAddingFrom;
		var topSpacerWas = this.spacerNodeTop.clientHeight;
		var topSpacerChange = topSpacer - topSpacerWas;
		this.spacerNodeTop.style.height = topSpacer + "px";
		var bottomSpacer = this.spacerNodeBottom.clientHeight;
		bottomSpacer = bottomSpacer - topSpacerChange;
		this.spacerNodeBottom.style.height = bottomSpacer + "px";
	    }
	}


	    /* Keep adding items/rows until the rows are below the bottom of the list's viewport */
	    for (var i = startAddingFrom; i < totalCount && currentHeight < targetHeight; i++) {
		this._renderItem(i);
		// this calculation is correct, but probing the domNode forces the node to render
		// and slows performance; just use the average estimate for now
		//currentHeight = this.items[i].domNode.offsetTop + this.items[i].domNode.clientHeight;
		if (!avgItemHeight) avgItemHeight = this.items[i].domNode.clientHeight || 22;
		currentHeight += avgItemHeight;
	    }
	    
	// Render one more
	if (i < totalCount) {
	    this._renderItem(i);
	}

	    /* Add 10 more rows so they don't have to be suddenly rendered if the user starts scrolling 
	    var extraTenMax = i + 10;
	    for (; i < totalCount && i < extraTenMax; i++) {
		this._renderItem(i);
	    }
*/
	this.addOddClasses();
	    this.updateAverageItemHeight();
//	app.toastSuccess("ScrollTop: " + scrollTop + "; generated: " + i);
	   //this.addOddClasses();
    },
    addOddClasses: function() {
	/* this doesn't need a seperate thread, but no reason to slow the main execution thread for this */
	wm.job(this.getRuntimeId() + ".addOddClasses", 10, this, function() {
	    dojo.query(".wmlist-item", this.domNode).forEach(function(node) {
		var id = parseInt(node.id.replace(/^.*_/,""));
		dojo.toggleClass(node, "Odd", Boolean(id % 2));
	    });
	});
    },
    scrollDownRemoveItems: function() {

	var scrollTop = this.getScrollTop();

	var currentHeight = this.spacerNodeTop.clientHeight;

	var avgHeight = this.getAverageItemHeight();

	// if its greater than this height, do not remove it
	var keepAroundHeight = scrollTop - avgHeight;// - 10 * avgHeight;
	
	var currentHeight = this.spacerNodeTop.clientHeight;
	var rows = this.listNode.childNodes;
	var rowsToDelete = [];
	for (var i = 1; i < rows.length - 1; i++) {
	    var node = rows[i];
	    var h = node.clientHeight;
	    if (h + currentHeight < keepAroundHeight) {
		rowsToDelete.push(node);
		currentHeight += h;
	    } else {
		break;
	    }
	}

	this.spacerNodeTop.style.height = currentHeight + "px";
	dojo.forEach(rowsToDelete, function(node) {
	    node.parentNode.removeChild(node);
	});
    },
    scrollUpRemoveItems: function() {

	var avgItemHeight = this.avgHeight = this.getAverageItemHeight();
	var listNode = this._listTouchScroll ? this.listNode.parentNode : this.listNode;
	var maxHeight = this.getScrollTop() + this.getListNodeHeight() + this.spacerNodeTop.offsetTop;
	var rows = this.listNode.childNodes;
	var spacerHeight = parseInt(this.spacerNodeBottom.style.height) || 0;

	while (rows.length > 2) {
	    var row = rows[rows.length-2];
	    if (row.offsetTop  > maxHeight) {
		row.parentNode.removeChild(row);
		//this.spacerNodeBottom.style.height = (this.spacerNodeBottom.clientHeight + h)  + "px";
		//console.log("REMOVING ITEM " + row.id.replace(/^.*_/,""));
	    } else {
		break;
	    }
	}

	this.updateBottomSpacerHeight();
    },
    scrollUpAddItems: function() {

	var parent = this.listNode;
	var totalCount = this.getDataItemCount();
	if (totalCount == 0) return;
	
	var scrollTop = this.getScrollTop();
	var maxHeight = this.getListNodeHeight() + scrollTop + this.spacerNodeTop.offsetTop; // basically the height of our widget, minus the height of our header
	var avgItemHeight = this.getAverageItemHeight();
	var minHeight = scrollTop;
	
	/* Skip through our list to the item that our guestimate says should be at scrollTop.
	   We'll subtract 10 from that both because its a guestimate, and because I want to pregenerate
		   a few rows in case the user scrolls up
	*/
	var startAddingFrom;
	if (this.listNode.childNodes.length > 2) {
	    var item = this.getItemForNode(this.listNode.childNodes[this.listNode.childNodes.length-2]);
	    var index = dojo.indexOf(this.items, item);
	    startAddingFrom = index - 1;
	} else {
	    startAddingFrom = Math.floor(maxHeight/avgItemHeight);
	}

	/* If there are only 2 nodes (top spacer and bottom spacer, and we've already scrolled,
	 * then the user has fast scrolled, there are no prior rows to append next to for proper
	 * positioning, and removeRows has deleted ALL rows.  So make a best guess for a 
	 * topSpacer height that will allow our new rows to show in the correct place
	 */
	var guestimateSpacers =  (scrollTop && parent.childNodes.length == 2);
	if (guestimateSpacers) {
	    this.spacerNodeBottom.style.height = avgItemHeight * (totalCount - startAddingFrom) + "px";	    
	}

	for (var i = startAddingFrom; i >= 0 ; i--) {
	    this._renderItem(i);

	    if (this.items[i].domNode.offsetTop < minHeight) break;

	    //console.log("NODE " + i);
	}
	/* Render one last one to insure no gaps */
	if (i >= 0) {
	    this._renderItem(i);
	}
	this.updateAverageItemHeight();

	/* Should have already been 0px, but make minor corrections here */
	if (scrollTop <= 0) {
	    this.spacerNodeTop.style.height = "0px";
	} else if (guestimateSpacers) {
	    this.spacerNodeTop.style.height = avgItemHeight * i + "px";
	}
	this.addOddClasses();
	//this.addOddClasses();
    },
    onRenderData:function(){},
	selectItemOnGrid: function(obj, pkList){
	        if (obj instanceof wm.Variable)
		    obj = obj.getData();
	        if (obj === undefined || obj === null)
		    obj = {};

		var dateFields = [];
		dojo.forEach(this.columns, function(col){
			if (col.displayType == 'Date')
				dateFields.push(col.field)	;
		});


		if (!pkList)
		    pkList = this.dataSet ? wm.data.getIncludeFields(this.dataSet.type) : this._pkList || [];
	    
	    /* If there are no primary keys, then all fields are used to match this item -- this may fail, not trying will definitely fail */
	        if (pkList.length == 0 && this.dataSet) {
		    var fields = wm.typeManager.getTypeSchema(this.dataSet.type)
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

	    var items = this.runQuery(this._data,q);
	    if (items.length < 1) {
		if (this.selectFirstRow) {
		    this.setSelectedRow(0);
		} else {
		    this.deselectAll();
		}
		return;
            }
	    if (items[0]._rowNumber != undefined) {
		this._cupdating = true; // don't trigger events since we're actually reselecting the same value that was already selected (NOTE: If users call this method directly, the assumption may be invalid)
		this.setSelectedRow(items[0]._rowNumber);
		this._cupdating = false; 
	    } else if (this.selectFirstRow) {
		this.setSelectedRow(0);
	    } else {
                this.deselectAll();
	    }
	},

    runQuery: function(inData, optionalQuery) {
	var query = optionalQuery || this.query;
	if (wm.isEmpty(query)) {
	    return inData;
	} else {
	    var newData = [];
	    for (var i = 0; i < inData.length; i++) {
		var d = inData[i];
		if (this.queryItem(query, d, i)) {
		    d._rowNumber = i;
		    newData.push(d);
		}
	    }
	    return newData;
	}
    },
    queryItem: function(query, inItem, inRowIndex) {
	var w = "*";
	var isMatch = true;
	for (var key in query) {
	    if (this._columnsHash && this._columnsHash[key] && this._columnsHash[key].isCustomField) {
		var col = this._columnsHash[key];
		if (col.expression) {    
		    inItem[key] = wm.expression.getValue(col.expression, inItem,this.owner);
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
			break;
		    default:
			if (!this.isDesignLoaded())
			    inItem[key] = dojo.hitch(this.owner, col.formatFunc)("", inRowIndex, dojo.indexOf(this.columns, col), key, {customStyles:[], customClasses:[]}, inItem);
		    }
		}
	    }
	    var a = inItem[key];
            if (dojo.isString(a)) a = a.replace(/\\([^\\])/g,"$1");
		    var b = query[key];
		    var matchStart = true;
                    if (dojo.isString(b)) {
			b = b.replace(/\\([^\\])/g,"$1");
			if (b.charAt(0) == w) {
			    b = b.substring(1);
			    matchStart = false;
			}
		    }
		    if (b == w)
			continue;
		    if (dojo.isString(a) && dojo.isString(b)) {
			if (b.charAt(b.length-1) == w)
			    b = b.slice(0, -1);
			a = a.toLowerCase();
			b = b.toLowerCase();
			var matchIndex = a.indexOf(b);
			if (matchIndex == -1 ||
			   matchIndex > 0 && matchStart) {
			    isMatch = false;
			    break;
			}
			    
		    }
		    else if (a !== b) {
			isMatch = false;
			break;
		    }
		}
	return isMatch;
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
	    if (this._firstItemIndex !== undefined) {
		i += this._firstItemIndex;
	    }
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
		var columnDef = this.columns[inCol];
		if (columnDef.controller) {
		    if (columnDef.controller == "deleteColumn") {
			cellData = "<div wmcontroller='true' class='wmDeleteColumn'><div wmcontroller='true' class='wmDeleteColumnImage'/></div>";
		    } else {
			cellData = "<input wmcontroller='true' type='" + columnDef.controller + "' />";
		    }
		} else {
		    var value = this._data[i];
		    var cellData = value;
		    var props = dataFields.split(".");
		    for (var propIndex = 0; propIndex < props.length; propIndex++) {
			cellData = cellData[props[propIndex]];
		    }
		    if (inCol==0) {
			this.lastCellData = cellData;
		    }
		    cellData = this.formatCell(dataFields,cellData, value, i, inCol);
		}
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
	    return "<div class='wmlist-content'>" + info.data + "</div>";
	},
	getColWidth: function(inCol) {
	    if (this.columns) {
		return this.columns[inCol].width;
	    } else {
		var c = this._columnWidths;
		if (!c || c.length == 0 || c.length == 1 && !c[0] || c[inCol] === undefined) {
		    return Math.round(100 / this.builder.colCount) + '%';
		} else {
		    return c[inCol];
		}
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
		var width = col.width;
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
		value = this.dateFormatter(col.formatProps||{}, null,null,null,value);
		break;
	    case 'wm_localdate_formatter':
	    case 'Local Date (WaveMaker)':				    
		value = this.localDateFormatter(col.formatProps||{}, null,null,null,value);
		break;
	    case 'wm_time_formatter':
	    case 'Time (WaveMaker)':				    
		value = this.timeFormatter(col.formatProps||{}, null,null,null,value);
		break;
	    case 'wm_number_formatter':
	    case 'Number (WaveMaker)':				    
		value = this.numberFormatter(col.formatProps||{}, null,null,null,value);
		break;
	    case 'wm_currency_formatter':
	    case 'Currency (WaveMaker)':				    
		value = this.currencyFormatter(col.formatProps||{}, null,null,null,value);
		break;
	    case 'wm_image_formatter':
	    case 'Image (WaveMaker)':				    
		value = this.imageFormatter(col.formatProps||{}, null,null,null,value);	
		break;
	    case 'wm_link_formatter':
	    case 'Link (WaveMaker)':				    
		value = this.linkFormatter(col.formatProps||{}, null,null,null,value);	
		break;
	    case 'wm_button_formatter':
		value = this.buttonFormatter(inField, col.formatProps||{}, inRowId, value);
		break;
	    default:
		if (!this.isDesignLoaded()) {
		    if (this.owner[col.formatFunc]) {
			value = dojo.hitch(this.owner, col.formatFunc)(value, inRowId, inColumnIndex, inField, {customStyles:[],customClasses: []}, inItem);
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
    dateFormatter: function(formatterProps, ignore1,ignore2,ignore3,inValue) {
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
    numberFormatter: function(formatterProps, ignore1,ignore2,ignore3, inValue) {
	    var constraints = {
		places: formatterProps.dijits || 0, 
		round: formatterProps.round ? 0 : -1,
		type: formatterProps.numberType
	    };
	    return dojo.number.format(inValue, constraints);
	},
    currencyFormatter: function(formatterProps, ignore1,ignore2,ignore3, inValue) {
	    var isDesignLoaded = false;
	    if (this instanceof wm.DojoGrid) {
		isDesignLoaded = this._isDesignLoaded;
	    }

	    return dojo.currency.format(inValue, {
		currency: formatterProps.currency || (isDesignLoaded ? studio.application.currencyLocale : app.currencyLocale) || "USD",
		places: formatterProps.dijits == undefined ? 2 : formatterProps.dijits,
		round: formatterProps.round ? 0 : -1
	    });
	},
    imageFormatter: function(formatterProps, ignore1,ignore2,ignore3, inValue) {
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
    linkFormatter: function(formatterProps, ignore1,ignore2,ignore3, inValue) {
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
    getCell: function(rowIndex, inFieldName) {
	var row = this._data[rowIndex];
	if (row) {

	var col = this._columnsHash ? this._columnsHash[inFieldName] : null;
	if (col && col.isCustomField) {
	    if (col.expression) {
		return wm.expression.getValue(col.expression, row,this.owner);

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
			return dojo.hitch(this.owner, col.formatFunc)("", rowIndex, dojo.indexOf(this.columns, col), inFieldName, {customStyles:[], customClasses:[]}, row);
		}		    	    
	    }
	    return undefined;// custom field with no function to generate a value? Empty cell.
	} else {
		    return row[inFieldName];
		
	    }
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
	if (index != -1) {
	    var c = this.columns[index];
	    var show = this._useMobileColumn && c.mobileColumn || !this._useMobileColumn && !c.mobileColumn && c.show;
	    return show;
	}
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
    }
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
