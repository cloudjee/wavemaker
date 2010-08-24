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

dojo.declare("wm.List", wm.VirtualList, {
	autoScroll: true,
	constructor: function() {
		this._data = [];
	},
	binding: "(data)",
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
		var f = this.items&&this.items[0], n = f&&f.domNode.firstChild, b = n&&dojo.marginBox(n);
		if (b && this.headerNode.firstChild)
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
	emptySelection: { ignore: true, bindSource: 1, type: "Boolean" }
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
		switch (inName) {
			case "updateNow":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
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
	    console.log(this.name + " has focus now");
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
	      console.log("set next to " + next);
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
	    console.log(this.name + " has focus now");
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

dojo.declare("wm.PageListRow", wm.Container, {
    layoutKind: "left-to-right",
    horizontalAlign: "left",
    verticalAlign: "top",
    border: "0,0,1,0",
    margin: "2,0,2,0",
    padding: "4",
    width: "100%",
    height: "40px",

/*
    widgetsJson: {	
	label1: ["wm.Label", {width: "100px", height: "20px"}, {}, {
	    binding: ["wm.Binding", {}, {}, {
		wire: ["wm.Wire", {"targetProperty":"caption","source":"variable.dataValue.hey"}, {}]
	    }]
	}],
	label2: ["wm.Label", {width: "100px", height: "20px"}, {}, {
	    binding: ["wm.Binding", {}, {}, {
		wire: ["wm.Wire", {"targetProperty":"caption","source":"variable.dataValue.you"}, {}]
	    }]
	}]},
	*/
    variable: null,
    itemNumber: null,
    init: function() {
	this.inherited(arguments);
	this.variable = new wm.Variable({name: "variable", owner: this});
	this.itemNumber = new wm.Variable({name: "itemNumber", owner: this, type: "NumberData"});
	this._first = true;
    },
    renderRow: function(inData, inNode, index) {
	if (this._first) {
	    dojo.destroy(this.domNode);
	    this._first = false;
	}
	// Prepare this object to represent a new row
	this.domNode = inNode;
	this.dom.node = inNode;
	this.components = {};
	this.c$ = [];
	this.widgets = {};
	this.domNode.innerHTML = "";
	this.variable.setData(inData);
	this.itemNumber.setData({dataValue: index+1});

	var widgetsJson = dojo.clone(this.owner._widgetsJson);
	this.fixWireIds(widgetsJson);

	this.createComponents(widgetsJson, this);
	//this.destroyWires(this);
	this.invalidCss = true;
	this.render();

	this.reflow();
	this.bounds.h = this.c$[0].bounds.h + this.padBorderMargin.h;
	this.renderBounds();
    },
    fixWireIds: function(inComponents) {
	for (var i in inComponents) {
	    var c = inComponents[i];
	    if (c[0] == "wm.Wire") {
		c[1].source = this.getId() + "." + c[1].source;
		if (c[1].expression) {
		    c[1].expression = c[1].expression.replace(this.owner._wireRegex, "${" + this.getId() + ".$1");
		}
	    }
	    this.fixWireIds(c[3]);
	}
    },
/*
    destroyWires: function(inComponent) {
	// don't want wires to modify individual rows when we don't have live components to listen to those wires
	if (inComponent instanceof wm.PageListRow == false)
	    for (var i in inComponent.components) {
		if (inComponent.components[i] instanceof wm.Binding) {
		    inComponent.components[i].destroy();
		    delete inComponent.components[i];
		}
	    }

	var length = (inComponent.c$) ? inComponent.c$.length : 0;
	for (var i = 0; i < length; i++) {
	    this.destroyWires(inComponent.c$[i]);
	}
    },
    */
    makeEvents: function(inEvents, inComponent) {
	this.owner.owner.makeEvents(inEvents, inComponent); // pass event binding up to something whose owner is the page, as the page is where the functions and other handlers are
    }
});

/* TODO: Only render rows that are visible
 * auto loading new rows from server?
 */
dojo.declare("wm.WidgetList", wm.Container, {
    manageLiveVar: false,
    scrollX: false,
    scrollY: true,
    dataSet: null,
    pageName: "",
    width: "100%",
    height: "100%",
    avgHeight: 150,
/*
    dataSet: [{hey: "there", you: "guys"},
	      {hey: "there2", you: "guys2"},
	      {hey: "there3", you: "guys3"}],
	      */
    // why use an object for this? So you can subclass it and change how 
    // your row is generated. Is this needed? Too early in this exploration to know.
    rowRenderers: null,
    currentRenderer: null,
    nodes: null,
    init: function() {
	this.inherited(arguments);
	this._wireRegex = new RegExp("\\$\\{(variable|itemNumber)", "g");

	this.nodes = [];
	this.rowRenderers = [];
	this.currentRenderer = this.rowRenderers[0];

	this.setDataSet(this.dataSet);
        if (this.pageName)
	    this.setPageName(this.pageName);
	this.connect(this.domNode, "onscroll", this, "renderRows");
    },
    setPageName: function(inPage) {
	this.pageName = inPage;
	var path = this.getPath() + wm.pagesFolder + inPage + "/" + inPage + ".widgets.js";
	if (!dojo.getObject(inPage))
	    window[inPage] = {};
		
	this._widgetsJson = dojo.fromJson(dojo._getText(path));
	this.cleanupWidgets(this._widgetsJson);
	this.renderRows(); 
    },
    cleanupWidgets: function(inComponents) {
	for (var i in inComponents) {
	    var c = inComponents[i];
	    if (c[0] == "wm.Layout") {
		c[0] = "wm.Panel";
		if (!c[1].layoutKind) 
		    c[1].layoutKind = "top-to-bottom"; // layout kind that is default for wm.Layout
		c[1].height = "100px";
		c[1].fitToContentHeight = true;
		c[1].verticalAlign = "top";
		c[1].horizontalAlign = "top";
		
	    } else {
		delete inComponents[i]; // get rid of all variables and nonvisual components that are outside of wm.Layout
	    }
	}
    },
    setDataSet: function(inDataSet) {
	if (this.dataSet && this.manageLiveVar)
	    dojo.disconnect(this._dataSetConnection);
	this.dataSet = inDataSet;
	if (inDataSet && inDataSet instanceof wm.Variable) {
	    var h = this.avgHeight;

	    if (this.manageLiveVar)
		this._dataSetConnection = dojo.connect(this.dataSet, "onSuccess", this, "renderRows");

	    for (var i = 0; i < this.rowRenderers.length; i++)
		this.rowRenderers[i].variable.setType(inDataSet.type);

	    var length;
	    if (this.manageLiveVar) {
		this.dataSet.maxResults = Math.max(20,this.bounds.h * 2 / h);
		this._totalPages = this.dataSet.getTotalPages() || 1;
		length = this.dataSet.dataSetCount-1; // fix to this also in renderRows
	    } else
		length = this.dataSet.getCount();


	    for (var i = 0; i < length; i++) {
		if (!this.nodes[i]) {
		    this.nodes[i] = document.createElement("div");		
		    var s = this.nodes[i].style;
		    s.position = "absolute";
		    s.top = (h * i) + "px";
		    s.height = h + "px";
		    this.domNode.appendChild(this.nodes[i]);
		}
		// if the list has shrunk, delete the excess dom nodes
		for (i = this.nodes.length-1; i >= length; i--) {
		    dojo.destroy(this.nodes.pop());
		}
	    }

	    if (!this._cupdating)
		this.renderRows();
	}
    },
    destroy: function() {
	for (var i = 0; i < this.nodes.length; i++) dojo.destroy(this.nodes[i]);
	delete this.nodes;
	dojo.disconnect(this._dataSetConnection);
	this.inherited(arguments);
    },
    postInit: function() {
	this.inherited(arguments);
	//this.renderRows();
    },
    renderBounds: function() {
	this.inherited(arguments);
	this._hasBounds = true;
	this.renderRows(); // can't properly render the rows until we have a size of our own. keep in mind we can't just call reflow on all rows; all rows are rendered by a single renderer object
    },
    renderRows: function() {
	if (!this._hasBounds) return;
	if (!this.dataSet || this.dataSet instanceof wm.Variable == false || !this._widgetsJson) return;

	var data = this.dataSet.getData();
	if (!data || data.length == 0) return;
	if (this.dataSet.firstRow) {
	    var placeholder = [];
	    for (var k = 0; k< this.dataSet.firstRow; k++) placeholder.push("");
	    data = placeholder.concat(data);
	}
	
	
	var heightSum = 0;
	var heightCount = 0;
	var curAvg = this.avgHeight;
	var bounds = this.getContentBounds();

	var length;
	if (this.manageLiveVar) 
		length = this.dataSet.dataSetCount-1; // fix to this also in setDataSet
	else
	    length = this.dataSet.getCount();

	for (var i = 0; i < length; i++) {
	    this.currentRenderer = this.rowRenderers[i];	    
	    if (!this.currentRenderer) {
		var name = "rowRenderer" + i;
		this.currentRenderer = this[name] = this.rowRenderers[i] = new wm.PageListRow({name: name, owner: this, parent: this});
		this.currentRenderer.variable.setType(this.dataSet.type);
		this.nodes[i].id = this.currentRenderer.getId() + "_row" + i;
		this.currentRenderer.bounds.h = curAvg;
		this.currentRenderer.height = curAvg + "px";
	    }


	    this.currentRenderer.bounds.w = bounds.w;


	    if (this.isScrolledIntoView(heightSum, this.currentRenderer.bounds.h , bounds)) {
		if (this.currentRenderer.c$.length == 0) {
		    if (!data[i]) {
			if (!this.dataSet._requester) 
			    this.dataSet.setPage(Math.floor(i/(this.dataSet.maxResults || 1)));
			this.currentRenderer._noData = true;
		    }
		} else if (data[i] && this.currentRenderer._noData) {
			this.currentRenderer.variable.setData(data[i]);
			delete this.currentRenderer._noData;
		}

		this.currentRenderer.inFlow = true;
		if (this.currentRenderer.c$.length) {
		    this.currentRenderer.renderBounds();
		    this.currentRenderer.reflow();
		} else
		    this.currentRenderer.renderRow(data[i], this.nodes[i], i);
	    } else 
		    this.currentRenderer.inFlow = false;

	    this.currentRenderer.bounds.w = bounds.w;
	    this.currentRenderer.bounds.t = heightSum;
	    this.currentRenderer.domNode.style.top = heightSum + "px";
	    heightSum += this.currentRenderer.bounds.h;
	    heightCount++;
	    curAvg = Math.floor(heightSum/heightCount);
	}

    },
    isScrolledIntoView: function(nodeTop, nodeHeight, bounds) {
	var top = this.domNode.scrollTop;
	var bottom = top + bounds.h;
	var nodeBottom = nodeTop + nodeHeight;
	return (nodeBottom >= top && nodeTop <= bottom);
    },
    getTargetItem: function(inSender) {
	var c = inSender;
	while (c != this && c instanceof wm.PageListRow == false)
	    c = c.parent;
	var index = dojo.indexOf(this.rowRenderers, c);
	if (index >= 0)
	    return this.dataSet.getItem(index);
    }

});

// design only
wm.WidgetList.extend({
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "pageName":
				return new wm.propEdit.PagesSelect({component: this, name: inName, value: inValue});
			case "dataSet":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.dataSet ? this.dataSet.getId() : "", allowAllTypes: true, listMatch: true});
		}
		return this.inherited(arguments);
	},
	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
			var ds = this.getValueById(inDataSet);
			if (ds)
				this.components.binding.addWire("", "dataSet", ds.getId());
		} else
			this.setDataSet(inDataSet);
	},
});

wm.Object.extendSchema(wm.WidgetList, {
	dataSet: { readonly: true, group: "data", order: 1, bindTarget: 1, type: "wm.Variable", isList: true},
	pageName: {group: "common", bindable: 1, type: "string", order: 50}
});