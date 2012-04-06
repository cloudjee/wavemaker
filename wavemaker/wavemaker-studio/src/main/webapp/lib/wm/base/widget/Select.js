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

dojo.provide("wm.base.widget.Select");

/* DEPRECATED; use wm.base.widget.Editors.Select / wm.SelectMenu */

dojo.declare("wm.Select", wm.Box, {
	menuSize: '',
	dataField: '',
	constructor: function() {
	},
	build: function() {
		this.domNode = document.createElement('select');
		this.renderSelect();
	},
	setDomNode: function(inDomNode) {
		this.inherited(arguments);
		dojo.addClass(this.domNode, "wmselect");
	},
	init: function() {
		this.inherited(arguments);
		this.connect(this.domNode, "onchange", this, "change");
		this.connect(this.domNode, "onkeyup", this, "keychange");
	},
	keychange: function(inEvent) {
		if (dojo.isMoz && (inEvent.keyCode == dojo.keys.UP_ARROW || inEvent.keyCode == dojo.keys.DOWN_ARROW))
			this.change();
	},
	change: function() {
		// commit DOM node changes to the widget using notification system
		if (this.inputValue != this.getNodeValue())
			this.setValue("inputValue", this.getNodeValue());
		this.onchange(this.getInputValue());
	},
	clearOptions: function() {
		this._data = [];
		this.domNode.options.length = 0;
	},
	createOption: function(inValue) {
		this._data.push(inValue);
		this.domNode.options[this.domNode.options.length] = new Option(inValue, inValue);
	},
	_setOptionData: function(inOptionData) {
		this.clearOptions();
		dojo.forEach(inOptionData, dojo.hitch(this, function(r) {
			this.createOption(r);
		}));
	},
	setOptionData: function(inOptionData) {
		this._setOptionData(inOptionData);
		this.change();
	},
	setMenuSize: function(inMenuSize) {
		this.menuSize = inMenuSize;
		if (this.menuSize)
			this.domNode.size = this.menuSize;
	},
	getInputValue: function() {
		return this.inputValue = this.getNodeValue();
	},
	getNodeValue: function() {
		var s = this.domNode, i = s.selectedIndex;
		return i >= 0 ? s.options[i].value : null;
	},
	getSelectedIndex: function() {
		return this.domNode.selectedIndex;
	},
	setSelectedIndex: function(inIndex) {
		this.domNode.selectedIndex = inIndex;
	},
	setInputValue: function(inValue) {
		for (var i=0, d; (d=this._data[i]); i++)
			if (inValue == d) {
				this.inputValue = inValue;
				this.setSelectedIndex(i);
				return;
			}
	},
	
	// events
	onchange: function(inValue) {
	},
	getDataField: function() {
		return this.dataField;
	},
	setDataField: function(inDataField) {
		this.dataField = inDataField;
		this.renderSelect();
	},
	_getFirstDataField: function() {
		if (!this.dataSet)
			return;
		var schema = this.dataSet._dataSchema;
		for (var i in schema) {
			var ti = schema[i];
			if (!ti.isList && !ti.isObject) {
				return i;
			}
		}
	},
	_getData: function() {
		var
			data = [],
			dataSet = this.dataSet,
			f = this.dataField || this._getFirstDataField(),
			l = dataSet && dataSet.data.list,
			count = l && l.length || 0;
		for (var i=0, d; (i<count) && (d=dataSet.getItem(i)); i++)
			data.push(f ? d.getValue(f) : d);
		return data;
	},
	setDataSet: function(inDataSet) {
		this.dataSet = inDataSet;
		this.renderSelect();
	},
	renderSelect: function() {
		this.setMenuSize(this.menuSize);
		if (this.dataSet)
			this.setOptionData(this._getData());
	}
});

wm.Object.extendSchema(wm.Select, {
	inputValue: { bindSource: 1, type: "String" },
	dataSet: { bindTarget: 1, type: "wm.Variable" }
});


// design only...
wm.Select.description = "A menu of items.";

wm.Select.extend({
	scrim: true,
	// FIXME: for simplicity, allow only top level , non-list, non-object fields.
	_addFields: function(inList, inSchema, inName) {
		if (!inSchema)
			return;
		var p = inName ? inName + '.' : '';
		for (var i in inSchema) {
			var ti = inSchema[i], n = p + i;
			if (!ti.isList && !ti.isObject) {
				inList.push(n);
			}
		}
	},
	_listFields: function(inList, inSchema, inName) {
		var list = [ "" ];
		if (this.dataSet)
			this._addFields(list, this.dataSet._dataSchema, '');
		return list;
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "dataField":
				return makeSelectPropEdit(inName, inValue, this._listFields(), inDefault);
		}
		return this.inherited(arguments);
	}
});