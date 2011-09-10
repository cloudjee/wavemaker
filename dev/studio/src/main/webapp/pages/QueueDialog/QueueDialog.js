/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
 
dojo.provide("wm.studio.pages.QueueDialog.QueueDialog");

dojo.declare("QueueDialog", wm.Page, {
        i18n: true,
	start: function() {
		this.list.toggleSelect = true;
		this.update();
	},
	update: function() {
		//console.log('QueueDialog.update');
		if (this.binding) {
			this.updateSelect();
			this.updateList();
		}
	},
	updateSelect: function() {
		var d = this.binding.getAvailableServicesList();
		this.select.setOptionData(d);
	},
	updateList: function() {
		var d=[], services = this.binding.getServicesList();
		dojo.forEach(services, function(s) {
			d.push(s.name);
		});
		// FIXME: causes rendering problem in list
		//this.list._headerContent = "Queue";
		this.list._data = d;
		this.list._render();
	},
	listSelect: function(inSender, inItem) {
		var d = inItem.getData(), i = dojo.indexOf(this.select._data, d);
		if (i != -1)
			this.select.setSelectedIndex(i);
	},
	addButtonClick: function(inSender) {
		var
			s = this.list.selected,
			i = (s ? s.index : this.list.getCount()-1) + 1,
			d = this.list._data,
			v = this.select.getInputValue();
		if (i != undefined)
			d.splice(i, 0, v)
		else
			d.push(v);
		this.list._render();
		this.selectListItem(i);
	},
	deleteButtonClick: function(inSender) {
		var
			s = this.list.selected,
			i = s && s.index,
			d = this.list._data;
		if (i != undefined) {
			d.splice(i, 1);
			this.list._render();
			this.selectListItem(i);
		}
	},
	selectListItem: function(inIndex) {
		var item = this.list.getItem(inIndex != undefined ? inIndex : this.list._data.length-1);
		this.list.select(item);
	},
	applyButtonClick: function(inSender) {
		this.binding.services = this.list._data.join(",");
		wm.fire(this.owner, "dismiss");
	},
	cancelButtonClick: function(inSender) {
		wm.fire(this.owner, "dismiss");
	},
	moveUpButtonClick: function() {
		this.moveSelected(-1);
	},
	moveDownButtonClick: function() {
		this.moveSelected(1);
	},
	moveSelected: function(inDelta) {
		var
			swap = function(inData, inIndex1, inIndex2) {
				var t = inData[inIndex1];
				inData[inIndex1] = inData[inIndex2];
				inData[inIndex2] = t;
			},
			l = this.list,
			s = l.selected;
		if (!s)
			return;
		var b = s.index, e = b + inDelta;
		e = Math.max(0, Math.min(e, this.list.getCount()-1));
		if (b != e) {
			swap(l._data, b, e);
			l._render();
			this.selectListItem(e);
		}
	},
	_end: 0
});