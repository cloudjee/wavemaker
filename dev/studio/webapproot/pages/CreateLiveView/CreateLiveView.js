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
dojo.provide("wm.studio.pages.CreateLiveView.CreateLiveView");

dojo.declare("CreateLiveView", wm.Page, {
        i18n: true,
	start: function() {
		this.update();
	},
	update: function() {
		this.updateServicesSelect()
		this.updateDataTypeList();
		this.okButton.setDisabled(true);
	},
	updateServicesSelect: function() {
		var options=[];
		this.serviceSelectEditor.clear();
		for (var i in wm.dataSources.sources)
			options.push(i);
		this.serviceSelectEditor.editor.setOptions(options.join());
		if (options.length)
			this.serviceSelectEditor.setDisplayValue(options[0]);
	},
	updateDataTypeList: function() {
		var
			d = this.serviceSelectEditor.getDataValue(),
			types = wm.dataSources.sources[d] ||[];
		this.dataTypeList.renderData(types);
		this.okButton.setDisabled(true);
	},
	dataTypeListSelect: function() {
		this.okButton.setDisabled(false);
	},
	dataTypeListFormat: function(inSender, ioData) {
		var i = '<img src="images/wm/data.png" height="16" width="16" align="absmiddle"> ', d = ioData.data;
		ioData.data = d ? i + d : d;
	},
    onListDblClick: function(inSender) {
	wm.fire(this.owner, "dismiss", ["OK"]);
    },
	okButtonClick: function(inSender, inEvent) {
		wm.fire(this.owner, "dismiss", [inEvent]);
	},
	cancelButtonClick: function(inSender, inEvent) {
		wm.fire(this.owner, "dismiss", [inEvent]);
	},
	_end: 0
});
