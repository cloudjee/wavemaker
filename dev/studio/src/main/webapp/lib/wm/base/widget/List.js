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
		return (this.list.format ? this.list.format(inIndex, inData) : inData);
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
        autoScroll: false,
	constructor: function() {
		this._data = [];
	},
	updateNow: "(update now)",
	columnWidths: "",
	dataFields: "",
        classNames: "wmlist",
	init: function() {
		this.inherited(arguments);
		this.createSelectedItem();
		this.createBuilder();
		if (this.columnWidths && this.dataFields.split(",").length != this.columnWidths.split(",").length) {
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
	_setDataFields: function(inDataFields) {
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
		if (!this.canSetDataSet(inDataSet))
			this.dataSet = "";
		else
			this.dataSet = inDataSet;
		var t = (inDataSet||0).type || "AnyData";
		this.setSelectedItemType(t);
		this.dataSetToSelectedItem(inDataSet);
		this.onsetdata(this.dataSet);
		this.renderDataSet(this.dataSet);
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
		var d = inDataSet instanceof wm.Variable ? inDataSet.getData() : [];
		this.renderData(d);
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
	getHeading: function(inField) {
		var d = this._dataSource, s = d && d.schema || 0, si = s[inField] || 0;
		if (si.label) return wm.capitalize(si.label);
		else {
		  var fieldName = inField.replace(/^.*\./, "");
		  return wm.capitalize(fieldName);
		}
	},
	getItemData: function(inIndex) {
		return this._data[inIndex];
	},
	// item rendering override.
	getCellContent: function(inRow, inCol, inHeader) {
		var
			f = this._dataFields && this._dataFields[inCol],
			cellData,
			i = this._formatIndex != null ? this._formatIndex : this.getCount();
		if (inHeader) {
			cellData = '<div>' + this.getHeading(f);
		} else if (this.dataSet && this.dataSet.isList) {
			var v = this.dataSet.getItem(i);
			cellData = v.getValue(f);
		}
		if (cellData == undefined) {
			var d = this.getItemData(i);
			f = wm.decapitalize(f);
			cellData = f ? d[f] : d;
		}
		var info = {column: inCol, data: cellData, header: inHeader};
		this.onformat(info, inCol, cellData, inHeader,v);
		this._formatIndex = null;
		return info.data;
	},
	getColWidth: function(inCol) {
		var c = this._columnWidths;
		return c && (c[inCol] != undefined) ? c[inCol] : Math.round(100 / this.builder.colCount) + '%';
	},
	getCellStyle: function(inRow, inCol) {
		return "width: " + this.getColWidth(inCol) + ';';
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

// design-time only
wm.Object.extendSchema(wm.List, {
	disabled: { ignore: 1 },
	selectedItem: { ignore: 1, bindSource: 1, isObject: true, simpleBindProp: true },
	dataSet: { readonly: true, group: "data", order: 1, bindTarget: 1, type: "wm.Variable", isList: true},
    emptySelection: { ignore: true, bindSource: 1, type: "Boolean" },
    getEmptySelection: {group: "method", returns: "Boolean"},
    setColumnWidths: {group: "method"},
    //getDataItemCount: {group: "method", returns: "Number"},
    setDataSet: {group: "method"},
    getItemData: {group: "method", returns: "Object"}   

});

wm.List.description = "Displays list of items.";

wm.List.extend({
	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
			var ds = this.getValueById(inDataSet);
			if (ds)
				this.components.binding.addWire("", "dataSet", ds.getId());
		} else
			this.setDataSet(inDataSet);
	},
	makePropEdit: function(inName, inValue, inDefault) {
	        var prop = this.schema ? this.schema[inName] : null;
	        var name =  (prop && prop.shortname) ? prop.shortname : inName;
		switch (inName) {
			case "updateNow":
				return makeReadonlyButtonEdit(name, inValue, inDefault);
			case "dataSet":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.dataSet ? this.dataSet.getId() : "", allowAllTypes: true, listMatch: true});
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "updateNow":
				return this.update();
		}
		this.inherited(arguments);
	}
});


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


dojo.declare("wm.FocusablePanel", wm.Panel, {
	
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
wm.Object.extendSchema(wm.FocusableList, {
	focusEventTime: { ignore: 1 },
	nextFocus: {bindable: 1, type: "wm.FocusableList"},
	priorFocus: {bindable: 1, type: "wm.FocusableList"},
	hasFocus: {ignore:1},
	focusOnStart: {type: "boolean"},
	defaultFocusListIndex: {}
	
});

wm.Object.extendSchema(wm.FocusablePanel, {
	focusEventTime: { ignore: 1 }
});



