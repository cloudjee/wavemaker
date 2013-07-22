/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
