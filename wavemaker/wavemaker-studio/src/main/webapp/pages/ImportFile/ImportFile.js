/*
 * Copyright (C) 2008-2013 VMware, Inc. All rights reserved.
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
	dojo.addClass(this.fileUploader.button.domNode, "StudioButton");
    },
   
    onHide: function() {
    	if (this._onSuccessConnect) dojo.disconnect(this._onSuccessConnect);
    	if (this._onErrorConnect) dojo.disconnect(this._onErrorConnect);    	
    },
    /*
    openProject: function() {
	this.owner.dismiss();
	studio.project.openProject(this.fileUploader.variable.getData()[0].path);
    },
    */
    setService: function(inService, inOperation) {
		this.fileUploader.service = inService;
		this.fileUploader.operation = inOperation;
		this.fileUploader.createDijit();
    },
    getPath: function() {
    	return this.fileUploader.variable.getData()[0].path;
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
	    //this.openProject();
    },
    onError: function() {},
    _end: 0
});
