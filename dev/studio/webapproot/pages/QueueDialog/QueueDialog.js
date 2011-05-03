/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
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