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

dojo.provide("wm.base.widget.DataGrid");
dojo.require("wm.base.widget.dijit.Grid");
dojo.require("wm.base.widget.Formatters");
dojo.require('wm.base.lib.data');
dojo.require("dojox.grid.compat._data.model");
/**
	@name dojox.grid.cell
	@class
	An object that describes a cell in the Grid.
	@todo document cell object
	@noindex
*/

/**
	@name wm.DataGrid.Event
	@class
	A browser Event object, with some additional properties.
	@property {wm.dijit.Grid} grid The Dijit Grid that owns the click
	@property {dojox.GridView} sourceView The View (scrolling region) that owns the click
	@property {Number} cellIndex The index of the cell that owns the click (or -1)
	@property {Number} rowIndex The index of the row that owns the click (or -1)
	@noindex
*/

/**
	@name wm.MavericksModel
	@class
*/
dojo.declare("wm.MavericksModel", dojox.grid.data.Model, {
	maxObjectDepth: 5,
	allChange: function(){
		this.notify("AllChange", arguments);
		this.notify("Change", arguments);
	},
	setData: function(inData) {
		this.variable = inData;
		this.schemaToFields();
	},
	_schemaToFields: function(inSchema, inName, inRelated, inDepth) {
		if (!inSchema || inDepth > this.maxObjectDepth)
			return;
		var p = inName ? inName + '.' : '', inDepth = inDepth || 0;
		inDepth++;
		for (var i in inSchema) {
			var ti = inSchema[i], n = p + i;
			var field = { name: n.replace(/\./g, "_"), key: n, field: n, compare: wm.data.compare };
			if (ti.isList) {
				this.fields.set(this.fields.values.length, field);
			} else if (wm.typeManager.isStructuredType(ti.type)) {
				if (!inRelated || inRelated && dojo.indexOf(inRelated, n) != -1) {
					// only need depth protection if we do not have related objects
					var d = inRelated ? 0 : inDepth;
					this._schemaToFields(wm.typeManager.getTypeSchema(ti.type), n, inRelated, d);
				}
			} else {
				this.fields.set(this.fields.values.length, field);
			}
		}
	},
	schemaToFields: function() {
		this.fields.clear();
		if (this.variable)
			this._schemaToFields(this.variable._dataSchema, '', this.variable.related);
	},
	getRowCount: function(){
	      return this.variable && this.variable.isList && (this.variable.getCount() || 1);
	},
	measure: function(){
		this.count = this.getRowCount();
		this.allChange();
	},
	getRow: function(inRowIndex){
		//console.debug(this, "getRow called");
		return this.variable.getItem(inRowIndex);
	},
	getDatum: function(inRowIndex, inField){
		var
			i = this.getRow(inRowIndex),
			f = i && (inField >= 0) && this.fields.values[inField];
		return f && (i.data[f.key] || i.getValue(f.key));
	},
	setDatum: function(inDatum, inRowIndex, inField){
		if (inDatum !== undefined) {
			var i = this.variable.getItem(inRowIndex);
			if (i) {
				i.beginUpdate();
				i.setValue(this.fields.values[inField].key, inDatum);
				i.endUpdate();
				this.notify("DatumChange", arguments);
			}
		}
	},
	beginModifyRow: function(inRowIndex){
	},
	endModifyRow: function(inRowIndex) {
	},
	cancelModifyRow: function(inRowIndex) {
		this.allChange();
	},
	// sort
	sort: function(/* (+|-)column_index+1, ... */){
		this.variable.sort(this.makeComparator(arguments));
	},
	// FIXME: data will be sorted on field key values;
	// any data formatting performed by a grid column expression will be ignored
	generateComparator: function(inCompare, inField, inTrueForAscend, inSubCompare){
		// we assume that a and b are wm.Variables
		return function(a, b){
			a = a.getValue(inField);
			b = b.getValue(inField);
			var ineq = inCompare(a, b);
			return ineq ? (inTrueForAscend ? ineq : -ineq) : inSubCompare && inSubCompare(a, b);
		}
	}
});

/**
	Encapsulates a column in a DataGrid.
	@name wm.DataGridColumn
	@class
	@extends wm.Component
*/
dojo.declare("wm.DataGridColumn", wm.Component, {
	/** @lends wm.DataGridColumn.prototype */
	/**
		This column will be as wide as needed to fill available space.
		If there is no space avaiable, the column will be invisible.
		If multiple columns are <i>autoSize</i>, the available space 
		is divided evenly.
	*/
	autoSize: false,
	/**
		This column will be as wide as needed to fill available space.
		If there is no space avaiable, the column will be invisible.
		If multiple columns are <i>autoSize</i>, the available space 
		is divided evenly.
	*/
	dataExpression: "",
	field: "",
	caption: "",
	columnWidth: "120px",
	display: "",
	index: 0,
	showing: true,
	addColumn:  function() {this.owner.doAddColumn();},
    removeColumn: function() {this.owner.doRemoveColumn(this);},
	init: function() {
	    this._cupdating = true;
		// BC
		delete this.format;
		this.caption = this.label || this.caption;
		delete this.label;
		//
		this.inherited(arguments);
		this.setDisplay(this.display);
	},
	// FIXME: in progress attempt to allow deleting of columns natively
	/*destroy: function() {
		if (this._destroying)
			return;
		var o = this.owner;
		this.inherited(arguments);
		if (o) {
			this._destroying = true;
			o.doRemoveColumn(this);
		}
	},*/
	setField: function(inField) {
		this.field = inField;
		this.caption = this.caption || this.field;
	},
	setIndex: function(inIndex) {
		this.owner.setColumnIndex(this, inIndex);
	},
	setColumnWidth: function(inColumnWidth) {
		this.columnWidth = inColumnWidth;
		this.autoSize = false;
		this.owner.columnsChanged();  		
	},
	formatChanged: function() {
            if (this.isDesignLoaded() && !this._cupdating) this.owner.renderGrid();
		//this.owner.columnsChanged();
	},
	valueChanged: function(inProp, inValue) {
		this.inherited(arguments);
		//this.owner.columnsChanged();
	},
	getCellProps: function() {
		var cell = { 
			name: this.caption, 
			field: this.field, 
			dataExpression: this.dataExpression,
			hide: !this.showing
		};
		if (this.autoSize)
			cell.width = "auto";
		else if (this.columnWidth)
			cell.width = this.columnWidth;
		if (this.components.format)
			dojo.mixin(cell, this.components.format.getColProps());
		if (this.editor) {
			cell.editor = this.editor;
		}
		if (this.selectOptions) {
			cell.options = this.selectOptions;
		}
		if (this.dataExpression)
		{
			cell.get = this.getExpressionDatum;
			cell.formatter = this.gridFormatter;
		}
		return cell;
	},
        postInit: function() {
	    this.inherited(arguments);
	    this._cupdating = false;
	},
	// cell getter for a column that contains an expression.
	// called in context of grid cell
	getExpressionDatum: function(inRowIndex) {
		return wm.expression.getValue(this.dataExpression, this.grid.model.getRow(inRowIndex));
	},
	gridFormatter: function(inValue){
		if(typeof(inValue) == 'string')
			inValue = inValue.replace(/&lt;/g,'<');

		return inValue;
	},
	setDisplay: function(inDisplay) {
		var c = this.display = inDisplay;
		if (c.slice(0, 5) != "wm")
			c = "wm." + c + "Formatter";
		var ctor = dojo.getObject(c);
		if (!ctor) {
			this.display = ""
			ctor = wm.DataFormatter;
		}
		wm.fire(this.components.format, "destroy");
		new ctor({name: "format", owner: this});
                if (this.isDesignLoaded() && !this._cupdating) this.owner.renderGrid();
	},
	/**
		Fires when the user clicks the mouse in this cell.
		<br/><br/>
		@param {Number} inRowIndex The clicked row.
		@param {dojox.grid.cell} inCell Various fields describing the clicked cell.
		@param {wm.DataGrid.Event} inEvent The browser event object, decorated.
	*/
	onClick: function(inRowIndex, inCell, inEvent) {
	}
});

wm.DataGridColumn.extend({
	listProperties: function() {
		var p = this.inherited(arguments);
		p.columnWidth.ignoretmp = this.autoSize;
		return p;
	},
	set_index: function(inIndex) {
		var reselect = (studio.selected == this);
		this.setIndex(inIndex);
		if (reselect) {
			wm.onidle(this, function() {
				studio.select(null);
				studio.select(this);
			});
		}
	},
	setCaption:function(inValue){
		this.caption = inValue;
		this.owner.columnsChanged();
	},
	isParentLocked: function() {
		return this.owner && this.owner.isParentLocked();
	},
	isParentFrozen: function() {
		return this.owner && this.owner.isParentFrozen();
	},
	makePropEdit: function(inName, inValue, inEditorProps) {
	    switch (inName) {
	    case "field":
		return new wm.SelectMenu(dojo.mixin(inEditorProps, {options: this.owner._listFields()}));
		}
		return this.inherited(arguments);
	}
});

/**
	Widget for displaying and editing tabulated data.
	@name wm.DataGrid
	@class
	@extends wm.dijit.Grid
*/
dojo.declare("wm.DataGrid", wm.dijit.Grid, {
	/** @lends wm.DataGrid.prototype */
    addColumn: function() {this.doAddColumn();},
	autoColumns:  function() {this.doAddColumn();},
	clearColumns: function() {this.doClearColumn();},
	updateNow: function() {this.update();},
	collection: "Columns",
        //fireOnReselect: false,
	init: function() {
		this.inherited(arguments);
		this.dijit.canEdit = dojo.hitch(this, "canEdit");
		this._columns = [];
		this.selectedItem = new wm.Variable({name: "selectedItem", owner: this});
		if (this.isDesignLoaded()) {
			this.connect(this.dijit, "onHeaderCellClick", this, "headerCellDesignClick");
			this.connect(this.dijit, "setCellWidth", this, "setDesignCellWidth");
		}
		this.connect(this.dijit, "sort", this, "sort");
	},
	// BC
	doSetSizeBc: function() {
		// Previously the default units for DataGrid were "flex" so "sizeUnits" was not streamed.
		// Fixup here is to default DataGrids with explicit "size" to "flex" units.
		if (this.size && !this.sizeUnits)
			this.sizeUnits = "flex";
		this.inherited(arguments);
	},
	headerCellDesignClick: function(e){
		var c = this._columns[e.cell.index];
		if (c) 
			studio.select(c);
		//this.dijit.constructor.prototype.onHeaderCellClick.call(this.dijit, e);
		dojo.stopEvent(e);
	},
	setDesignCellWidth: function(inIndex, inUnitWidth) {
		this._columns[inIndex].columnWidth = inUnitWidth;
	},
	postInit: function() {
		this.inherited(arguments);
		this._clearColumns();
		for (var i in this.components) {
			var c = this.components[i];
			if (c instanceof wm.DataGridColumn)
				this._columns.push(c);
		}
		this.renderGrid();
		dojo.publish(this.name+'.selectedItem-created');
	},
	destroy: function (){
		if (this.isDestroyed)
			return;
		this.inherited(arguments);
		this._clearColumns();
		delete this.selectedItem;
		delete this.dataSet;
		this.destroyDijit();
		this.isDestroyed = true;
	},
	destroyDijit: function(){
		if (this.dijit){
			try{
				if (this.dijit.edit && this.dijit.edit.grid)
				{
					try{
						this.dijit.edit.grid.destroy();
					}
					catch(e){
						console.info('destroy Error:', e);
					}
				}

				if (this.dijit.focus)
					delete this.dijit.focus.grid;
				if (this.dijit.views)
					delete this.dijit.views.grid;
				if (this.dijit.selection)
					delete this.dijit.selection.grid;
				if (this.dijit.rows)
					delete this.dijit.rows.grid;
				if (this.dijit.scroller){
					delete this.dijit.scroller.contentNodes;
					delete this.dijit.scroller.pageNodes;	
				}
				if (this.dijit.params){
					delete this.dijit.params.parentNode;
					delete this.dijit.params.srcNodeRef;	
				}
				if (this.dijit.layout){
					delete this.dijit.layout.cells;
					delete this.dijit.layout.grid;
					delete this.dijit.layout.structure;
				}
				
				delete this.dijit._connects;
				//delete this.dijit.layout;
				delete this.dijit.parentNode;
				delete this.dijit.rows;
				//delete this.dijit.scroller;
				delete this.dijit.lastFocusNode;
				delete this.dijit.edit;
				delete this.dijit.focus;
				
				delete this.dijit.structure;
				delete this.dijit.views;
				delete this.dijit.viewsHeaderNode;
				delete this.dijit.viewsNode;
				//delete this.dijit;
			}
			catch(e){
				// do nothing.
			}
		}

		if (this.dijitProps){
			delete this.dijitProps.parentNode;
			delete this.dijitProps;	
		}
	},
	// columns and structure
	getCollection: function(inName) {
		var cn = [];
		for (var i in this.components) {
			var c = this.components[i];
			if (c instanceof wm.DataGridColumn)
				cn.push(c);
		}
		cn.sort(function(a, b) {
			return a.index - b.index;
		});
		return cn;
	},
	columnsToStructure: function() {
		// a subrow is an array of cells
		// a view is a structure, with an array of subrows named 'rows'
		// a grid layout is an array of views
		var subrow = [], rows = [], view = {rows: rows}, s = [view];
		// currently we have exactly one subrow
		this._columns.sort(this._columnsSorter);
		for (var i=0, c; (c=this._columns[i]); i++) {
			var cell = c.getCellProps();
			this.onSetColumns(cell, i);
			subrow.push(cell);
		}
		this.adjustRowCellProps(subrow);
		rows.push(subrow);
	// =========================================
	// r&d: let's make another subrow for detail
	/*	cell = { 
			name: ' ', get: dojo.hitch(this, "getDetail"), colSpan: 4, styles: 'padding: 0; margin: 0;'
		};
		rows.push([cell]);*/
		return s;
	},
	/*getDetail: function(inRowIndex) {
		var item = this.dataSet.getItem(inRowIndex);
		return new Date(item.getValue("lastUpdate"));
		//
		var fas = item.getValue("filmActors");
		var n = [];
		for (var i=0, l=fas.getCount(), f; i<l; i++) {
			f = fas.getItem(i).getValue("film")
			n.push(f.getValue("title"));
		}
		return n.join('<br>');
	},*/
	// =========================================
		// ensure cell meets requirements
	adjustRowCellProps: function(inRow) {
		var flex = 0;
		// support translating width in flex to %
		// get total flex
		dojo.forEach(inRow, function(c) {
			var u = wm.splitUnits(c.width);
			if (u.units == "flex")
				flex += u.value;
		});
		// convert flex value to %
		dojo.forEach(inRow, function(c) {
			var u = wm.splitUnits(c.width);
			if (flex && u.units == "flex" && u.value)
				c.width = Math.round(u.value * 100/ flex) + "%";
		});
	},
	setStructure: function(inStructure) {
		this.onSetStructure(inStructure);
		this.dijit.setStructure(inStructure && inStructure.length ? inStructure : null);
	},
	columnsChanged: function() {
		if (!this._loading && !this._updating) {
			this.setStructure(this.columnsToStructure());
			if (this.isDesignLoaded())
				studio.refreshComponentOnTree(this);
		}
	},
	setColumnIndex: function(inColumn, inIndex) {
		inColumn.index = inIndex - 0.5;
		this._columns.sort(this._columnsSorter);
		for (var i=0, c; (c=this._columns[i]); i++)
			c.index = i;
		this.columnsChanged();
	},
	_columnsSorter: function(inA, inB) {
		return inA.index - inB.index;
	},
	_addFields: function(inList, inSchema, inName, inRelated, inDepth) {
		if (!inSchema || inDepth > this.dijit.model.maxObjectDepth)
			return;
		var p = inName ? inName + '.' : '', inDepth = inDepth || 0;
		inDepth++;
		for (var i in inSchema) {
			var ti = inSchema[i], n = p + i;
			// list column not exposed
			if (ti.isList) {
			} else if (wm.typeManager.isStructuredType(ti.type)) {
				// only show field info for available structured objects
				if (!inRelated || inRelated && dojo.indexOf(inRelated, n) != -1) {
					var d = inRelated ? 0 : inDepth;
					this._addFields(inList, wm.typeManager.getTypeSchema(ti.type), n, inRelated, d);
				}
			} else {
				inList.push(n);
			}
		}
	},
	_listFields: function(inList, inSchema, inName) {
		var list = [ "" ];
		if (this.dataSet)
			this._addFields(list, this.dataSet._dataSchema, '', (this.dataSet ||0).related);
		return list;
	},
	_clearColumns: function() {
		for (var i=0, c; (c=this._columns[i]); i++)
			c.destroy();
		this._columns = [];
	},
	_typifyColumn: function(ioColumn, inType) {
		var t = wm.typeManager.getPrimitiveType(inType) || inType;
		ioColumn.display = dojo.indexOf(wm.formatters, t) != -1 ? t : "";
	},
	_hasColumnForField: function(inField) {
		for (var i=0, columns=this._columns, c; (c=columns[i]); i++)
			if (c.field == inField)
				return true;
	},
	_viewToColumns: function(inView, inName) {
		var p = inName ? inName + '.' : '', col;
		for (var i=0, f, field; f=inView[i]; i++) {
			// ignore view field if it's not to be included in lists
			field = f.dataIndex;
			if (!f.includeLists || this._hasColumnForField(field))
				continue;
			this._index++;
			col = {
				name: f.dataIndex.replace(/\.(\S)/g, function(w) {return w.slice(1).toUpperCase();} ),
				label: f.caption,
				field: field,
				owner: this,
				index: f.order === undefined ? this._index : f.order,
				autoSize: f.autoSize
			};
			if (!col.autoSize && f.width && f.widthUnits)
				col.columnWidth = f.width + f.widthUnits;
			this._typifyColumn(col, f.displayType);
			this._adjustColumnProps(col);
			this._addColumn(col);
		}
	},
	_schemaToColumns: function(inSchema, inName) {
		if (!inSchema)
			return;
		var p = inName ? inName + '.' : '';
		for (var i in inSchema) {
			var ti = inSchema[i], n = p + i;
			if (this._hasColumnForField(n))
				continue;
			if (ti.isList) {
			} else if (wm.typeManager.isStructuredType(ti.type)) {
			} else {
				this._index++;
				var name = n.replace(/\./g, "_");
				var col = { name: name, label: n, field: n, owner: this, index: this._index };
				this._typifyColumn(col, ti.type);
				this._adjustColumnProps(col);
				this._addColumn(col);
			}
		}
	},
	_adjustColumnProps: function(inColProps) {
		// make sure we have a valid name
		var name = inColProps.name || "column";
		// ensure name ends with a number (to avoid reserved word, e.g. state, id)
		name = name.match(/[0-9]$/) ? name : name + 1;
		name = this.getUniqueName(name);
		inColProps.name = name;
	},
	_addColumn: function(inColProps) {
		this._columns.push(new wm.DataGridColumn(inColProps));
	},
	_getStartColIndex: function() {
		var m = 0;
		dojo.forEach(this._columns, function(c) {
			m = Math.max(m, c.index);
		});
		return m == 0 ? m : m++;
	},
	dataSetToColumns: function() {
		this._updating = true;
		if (this.dataSet) {
			this._index = this._getStartColIndex();
			if (this.dataSet.liveView && this.dataSet.liveView.service)
				this._viewToColumns(this.dataSet.getViewListFields(), '')
			else
				this._schemaToColumns(this.dataSet._dataSchema, '');
		}
		this._updating = false;
		if (this.isDesignLoaded())
			studio.refreshComponentOnTree(this);
	},
	createDefaultColumns: function() {
		var col = {name: "column1", autoSize: true, owner: this};
		this._adjustColumnProps(col);
		this._addColumn(col);
	},
	// 
	_hasDefaultColumns: function() {
		var c = this._columns[0];
		return (!c || (!c.field && !c.dataExpression) && this._columns.length == 1);
	},
	// virtual binding target
	setDataSet: function(inDataSet) {
		var d = this.dataSet = inDataSet;
		/*if (d && !d.isList)
			d = this.dataSet = null;*/
		// disable lazy loading for dataSets assigned to grid.
		// note: do allow this so that sub-grids can lazy load.
		/*
		if (d)
			d._allowLazyLoad = false;
		*/
		// always have a model so that grid does not cause rendering error if model is removed (should be fixed in grid).
		this.dijit.setModel(new wm.MavericksModel(null, d));
		if (d && this._hasDefaultColumns()) {
			this._clearColumns();
			this.dataSetToColumns();
		}
		this.renderGrid();
                if (inDataSet && inDataSet.type && inDataSet.type != "any" && inDataSet.type != this.selectedItem.type)
                    this.selectedItem.setType(inDataSet.type);
 	},
	preRender: function() {
		this.dataSetToSelectedItem();
		if (this._columns.length == 0)
			this.createDefaultColumns();
		// save previous sort / selection info
		this._lastSort = this.dijit.sortInfo;
		this._lastSelectedIndex = this.getSelectedIndex();
		// clear sort indicator
		this.dijit.sortInfo = 0;
		// handle selection
		this.clearSelection();
	},
	renderGrid: function() {
		// make sure to set selectedItem type so that it's not out of sync.
		if (!this._loading) {
			this.preRender();
			this.onBeforeRender();
			this.setStructure(this.columnsToStructure());
			this.onAfterRender();
		}
		
	},
	// selection
	/**
		Select a row by index.
		<br/>
		Previous selection is cleared.
		@param {Number} inIndex Integer index of row to select. 
	*/
	select: function(inIndex) {
		this.dijit.selection.select(inIndex);
	},
	/**
		Clear the selection such that no rows are selected.
	*/
	clearSelection: function() {
		this.dijit.selection.clear();
		this.updateSelected();
	},
	/**
		Returns true if there any selected rows.
		@returns @Boolean True if any rows are selected.
	*/
	hasSelection: function() {
		return Boolean(this.dijit.selection.getFirstSelected() != -1);
	},
	/**
		Returns the index of the selected row.
		@returns @Number Integer index of selected row.
	*/
	getSelectedIndex: function() {
		return this.dijit.selection.selectedIndex;
	},
	/**
		Returns true if there are no selected rows.
		<br/><br/>
		This method exists to support the bindable emptySelection 
		virtual property (i.e. it implements <code>getValue("emptySelection")</code>.).
		<br />
		@returns @Boolean True if no rows are selected.
	*/
	getEmptySelection: function() {
		return !this.hasSelection();
	},
	dataSetToSelectedItem: function() {
		this.selectedItem.setLiveView((this.dataSet|| 0).liveView);
		this.selectedItem.setType(this.dataSet ? this.dataSet.type : "any");
	},
	// FIXME: not clear why we have this.selected and this.selectedItem which is a copy
	updateSelected: function() {
		if (!this.selectedItem)
			return;
			
		var s = this.dijit.selection.selectedIndex;
		this.selected = this.dataSet && s >= 0 ? this.dataSet.getItem(s) : null;
		if (this.selected)
			this.selectedItem.setData(this.selected);
		else
			this.selectedItem.clearData();

		// update "emptySelection" property (to trigger bindings)
		this.setValue("emptySelection", !this.hasSelection());
	},
	// events
	/**
		Fires when the user clicks the mouse in a cell.
		<br/><br/>
		<i>inEvent</i> object is decorated with information
		about the clicked cell.
		<br/><br/>
		@param {wm.DataGrid.Event} inEvent The browser event object, decorated.
	*/
	onCellClick: function(inEvent) {
		if (inEvent.cell) {
			var i = inEvent.cell.index;
			var c = this._columns[i];
			wm.fire(c, "onClick", [inEvent.rowIndex, inEvent.cell, inEvent]);
		}
	},
	/**
		Fires when the user clicks the mouse in the grid header.
		<br/><br/>
		<i>inEvent</i> object is decorated with information
		about the clicked header.
		<br/><br/>
		@param {wm.DataGrid.Event} inEvent The browser event object, decorated.
	*/
	onHeaderCellClick: function(inEvent) {
	},
	/**
		Fires when the user double clicks the mouse in the grid row.
		<br/><br/>
		<i>inEvent</i> object is decorated with information
		contains reference to grid, cell, and rowIndex.
		<br/><br/>
		@param {wm.DataGrid.Event} inEvent The browser event object, decorated.
	*/
	onRowDblClick: function(inEvent) {
	},
	_onSelected: function(inIndex) {
		// buffer selection
		wm.job(this.getRuntimeId(), 250, dojo.hitch(this, "onSelected", inIndex));
	},
	_onSelectionChanged: function() {
		wm.job(this.getRuntimeId() + "-selectionChanged", 250, dojo.hitch(this, "onSelectionChanged"));
	},
	/**
		Event that occurs when the selection is changed.
		<br/><br/>
		Selections are buffered, so only the last in a series of rapid selections will
		trigger this event.
		<br />
	*/
	onSelectionChanged: function() {
	},
	/**
		Event that occurs when a selection is made.
		<br/><br/>
		Selections are buffered, so only the last in a series of rapid selections will
		trigger this event.
		<br />
		@param {Number} inIndex The index of the selected row.
	*/
	onSelected: function(inIndex) {
		this.updateSelected();
	},
	_onDeselected: function(inIndex) {
		// buffer deselection
		wm.job(this.getRuntimeId(), 250, dojo.hitch(this, "onDeselected", inIndex));
	},
	/**
		Event that occurs when a selection is removed.
		<br/><br/>
		Deselections are buffered, so only the last in a series of rapid deselections will
		trigger this event.
		<br />
		@param {Number} inIndex The index of the de-selected row.
	*/
	onDeselected: function(inIndex) {
		this.updateSelected();
	},
	/**
		Allows user code to customize column objects.
		<br/><br/>
		This event is fired for each column in the Grid. Custom code
		can modify the column object to alter behavior or appearance 
		of the Grid.
		<br/><br/>
		@param {wm.DataGridColumn} inColumn Object whose properties describe the grid column.
		@param {Number} inIndex Numeric index of the column 
	*/
	onSetColumns: function(inColumn, inIndex) {
	},
	/**
		Allows user code to customize grid structure.
		<br/><br/>
		This event is fired whenever the Grid is initialized. Custom code
		can modify the structure object to alter behavior or appearance 
		of the Grid.
		<br/><br/>
		ToDo: document inStructure properties.
		<br/><br/>
		@param {Object} inStructure Object whose properties describe the grid structure.
	*/
	onSetStructure: function(inStructure) {
	},
	/**
		Event that fires before the Grid is populated.
		<br/><br/>
		This event is fired before the Grid is populated, allowing custom code
		to cache information or do tasks.
	*/
	onBeforeRender: function() {
	},
	/**
		Event that fires after the Grid is populated.
		<br/><br/>
		This event is fired after the Grid is populated, allowing custom code
		to cache information or do tasks.
	*/
	onAfterRender: function() {
	},
	// server update
	/**
		Force an update of the data model bound to this grid.
	*/
	update: function() {
		var ds = this.getValueById((this.components.binding.wires["dataSet"] || 0).source);
		wm.fire(ds, "update");
	},
	canEdit: function(inCell, inRowIndex) {
		ioEdit = {canEdit: Boolean(inCell.editor)};
		this.onCanEdit(ioEdit, inCell, inRowIndex);
		return ioEdit.canEdit;
	},
	onCanEdit: function(ioEdit, inCell, inRowIndex) {
	},
	sort: function() {
		this.onSort(this.dijit.getSortField());
	},
	onSort: function(inSortInfo) {
	}
});

wm.DataGrid.extend({
	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
			var ds = this.getValueById(inDataSet);
			if (ds)
				this.components.binding.addWire("", "dataSet", ds.getId());
		} else
			this.setDataSet(inDataSet);
	},
	doAddColumn: function(inColumn) {
		var col = {name: "column1", index: this._columns.length, label: "", owner: this };
		if (!this._columns.length)
			col.columnWidth = "auto";
		this._adjustColumnProps(col);
		this._addColumn(col);
		this.columnsChanged();
		if (this.isDesignLoaded()){
			var i = this._columns.length - 1;
			var c = (i>=0 ? this._columns[i] : this);
			studio.select(c);
		}
	},
	doRemoveColumn: function(inColumn) {
		inColumn.destroy();
		// FIXME: hack 
		this._columns = [];
		this.loaded();
		// end hack
		this.columnsChanged();
		if (this.isDesignLoaded()){
			var i = inColumn.index - 1;
			var c = this._columns[i < 0 ? 0 : i] || this;
			studio.select(c);
		}
	},
	doClearColumns: function() {
		this._clearColumns();
		this.renderGrid();
	},
	doAutoColumns: function() {
		//if (this._hasDefaultColumns())
		this._clearColumns();
		this.dataSetToColumns();
		this.renderGrid();
	}
});

// design-time only
wm.Object.extendSchema(wm.DataGridColumn, {
	caption: { group: "common", order: 100, focus: 1 },

    /* Operations gropu */
    addColumn: { group: "operation", order: 10,operation:1},
    removeColumn: { group: "operation", order: 20,operation:1},
	autoSize: { group: "layout", order: 10 },
    columnWidth: { group: "layout", order: 20, editor: "wm.prop.SizeEditor"},
	index: { group: "layout", order: 30 },
    field: { group: "data", order: 10, editor: "wm.prop.FieldSelect"},
	dataExpression: { group: "data", order: 15 },
    display: { group: "data", order: 20, options: [""].concat(wm.formatters) },
	format: { group: "data", order: 30, categoryParent: "Properties", categoryProps: {component: "format"}},
    showing: {ignore: 1},
    format:{ignore:1}
});

wm.Object.extendSchema(wm.DataGrid, {
	selectedItem: { ignore: true, isObject: true, bindSource: true, simpleBindProp: true },
	emptySelection: { ignore: true, bindSource: 1, type: "Boolean" },
    dataSet: { readonly: true, group: "data", order: 0, type: "wm.Variable", isList: true, bindTarget: true, createWire: 1, editor: "wm.prop.DataSetSelect", editorProps: {listMatch: true, widgetDataSets: true, allowAllTypes: true}},
    addColumn: { group: "operation", order: 1, operation:1},
	autoColumns: { group: "operation", order: 5, operation:1},
	clearColumns: { group: "operation", order: 10, operation:1},
	updateNow: { group: "operation", order: 15, operation:1},
	collection: { ignore: true },
	disabled: { ignore: true }
});
