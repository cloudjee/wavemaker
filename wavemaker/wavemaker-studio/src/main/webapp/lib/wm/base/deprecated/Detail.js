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

dojo.provide("wm.base.widget.Detail");
dojo.require("wm.base.widget.List");

dojo.declare("wm.Detail", wm.List, {
	labelPosition: 'left',
	labelAlign: 'left',
	headerVisible: false,
	prepare: function() {
		this.inherited(arguments);
		this.className = 'wmdetail';
	},
	build: function() {
		this.inherited(arguments);
		this.createBuilder();
	},
	// rendering
	updateBuilder: function() {
		var v = this.isVertical();
		this.builder.colCount = (v ? 1 : 2);
		this.builder.rowCount = (v ? 2 : 1);
	},
	getDataItemCount: function() {
		return this._dataFields.length;
	},
	getItemData: function(inIndex) {
		var f = this._dataFields[inIndex];
		return this._data[f];
	},
	// item rendering override.
	getCellContent: function(inRow, inCol) {
		var 
			i = this.getCount(),
			d = this._data,
			isLabel = this.isLabel(inRow, inCol),
			f = this._dataFields[i],
			infoData = isLabel ? this.getHeading(f) : d&&d[f];
		var info = {row: inRow, data: infoData, isLabel: isLabel};
		this.onformat(info, inRow, infoData, isLabel);
		return info.data;
	},
	onformat: function(ioData, inRow, inData, inIsLabel) {
	},
	isLabel: function(inRow, inCol) {
		var d = this.getDetailPosition();
		return (d.row != inRow || d.col != inCol);
	},
	getDetailPosition: function() {
		switch (this.labelPosition) {
			case 'top': return {row: 1, col: 0};
			case 'right': return {row: 0, col: 0};
			case 'bottom': return {row: 0, col: 0};
			default: return {row: 0, col: 1};
		};
	},
	isVertical: function() {
		var l = this.labelPosition;
		return (l == 'top' || l == 'bottom');
	},
	getCellStyle: function(inRow, inCol) {
		var l = this.isLabel(inRow, inCol), v = this.isVertical(), r= [
			(l ? 'text-align:' + this.labelAlign : ''),
			'font-weight:' + (l ? 'bold' : 'normal'),
			(!v ? 'width: ' + this.getColWidth(inCol) + ';' : '')
		];
		return r.join(';')
	},
	setLabelPosition: function(inLabelPosition) {
		this.labelPosition = inLabelPosition;
		this._render();
	},
	setLabelAlign: function(inLabelAlign) {
		this.labelAlign = inLabelAlign;
		this._render();
	},
	canSetDataSet: function(inDataSet) {
		return Boolean(inDataSet);
	},
	_oncanselect: function(inItem, inSelectInfo) {
		inSelectInfo.canSelect = false;
	},
	_oncanmouseover: function(inEvent, inItem, inMouseOverInfo) {
		inMouseOverInfo.canMouseOver = false;
	},
	// remove list selection behavior with direct implementation
	onclick: function(inEvent, inItem) {
	},
	// no selectedItem
	createSelectedItem: function() {
	},
	setSelectedItemType: function(inType) {
	},
	_setSelected: function(inItem) {
	}
});

// design-time only
wm.Detail.description = "Displays a detailed list.";

wm.Object.extendSchema(wm.Detail, {
	headerVisible: {ignore: 1},
	selectedItem: {ignore: 1},
	dataSet: { group: "data", readonly: true, order: 1, bindTarget: 1, type: "wm.Variable"}
});

wm.Detail.extend({
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "labelAlign":
				return makeSelectPropEdit(inName, inValue, ["left", "center", "right"], inDefault);
			case "labelPosition":
				return makeSelectPropEdit(inName, inValue, ["top", "right", "bottom", "left"], inDefault);
			case "dataSet":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.dataSet ? this.dataSet.getId() : "", allowAllTypes: true, listMatch: false});
			default: 
				return this.inherited(arguments);
		}
	}
});



dojo.extend(wm.Detail, {
	
});