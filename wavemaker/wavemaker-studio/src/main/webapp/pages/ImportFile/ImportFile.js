/*
 * Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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
 

dojo.provide("wm.studio.pages.ImportFile.ImportFile");

dojo.declare("ImportFile", wm.Page, {
    i18n: true,
    start: function() {
	this.filename.editor.set("placeHolder", this.getDictionaryItem("PLACEHOLDER"));
    },
    onShow: function() {
	this.filename.setDataValue("");
    },
    openProject: function() {
	this.owner.dismiss();
	studio.project.openProject(this.fileUploader.variable.getData()[0].path);
    },
    selectLastItem: function() {
	wm.onidle(this, function() {
	    this.list.eventSelect(this.list.getItem(this.list.getCount()-1));
	});
    },
    onChange: function() {
	var data = this.fileUploader.variable.getData();
	this.fileUploader.reset();
	if (data) {
	    data = data[0];
	    this.fileUploader.variable.setData([data]);
	}
	
    },
    onSuccess: function() {
	    this.openProject();
    },
    _end: 0
});
