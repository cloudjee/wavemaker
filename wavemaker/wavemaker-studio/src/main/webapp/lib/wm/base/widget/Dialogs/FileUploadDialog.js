/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Dialogs.FileUploadDialog");
dojo.require("wm.base.widget.Dialogs.GenericDialog");

/* Remove this for 6.4; do not localize */
dojo.declare("wm.FileUploadDialog", wm.GenericDialog, {
    uploadService: "",
    uploadOperation: "",
    width: "500px",
    height: "120px",
    showInput: true,
    button1Caption: "Upload",
    button2Caption: "Cancel",
    button1Close: true,
    button2Close: true,
    postInit: function() {
        this.widgets_data.genericInfoPanel[3].textInput = ["wm.FileUpload", 
							   {  caption: "",
                                                              uploadButton: false,
							      padding: "0,20,0,20",
							      width: "100%",
							      height: "28px",
							      captionSize: "100px",						   
							      captionAlign: "left",
							      captionPosition: "left",
							      uploadButtonPosition: "right",
							      uploadButtonWidth: "100px",
							      uploadButtonHeight: "30px",
							      service: "",
							      operation: ""}, 
							   {  onUploadSuccess: "importClickCallback",
							      onUploadError: "importClickError",
							      onBegin:       "startImportClick"}, {}];
        this.inherited(arguments);
        this.fileUploader = this.$.textInput;
        this.setUploadService(this.uploadService);
        this.setUploadOperation(this.uploadOperation);
    },
    startImportClick: function(inSender) {
        if (window["studio"])
	    studio.beginWait("Importing File...");
    },			  
    importClickCallback: function(inSource, inResponse) {
        if (window["studio"])
	    studio.endWait();
	wm.fire(this.owner, "dismiss");
    },
    importClickError: function(inSource,inError) {
        if (window["studio"])
	    studio.endWait();
        app.toastDialog.showToast("Import failed!", 3000, "Warning");
	// any notification to user must be done by the component that requested the file
    },
    setUploadService: function(inService) {
	this.uploadService = inService;
	this.fileUploader.setService(inService);
    },
    setUploadOperation: function(inOperation) {
	this.uploadOperation = inOperation;
	this.fileUploader.setOperation(inOperation);
    },


    buttonClick: function(inSender) {
	var name = inSender.name;
	var id = parseInt(name.match(/\d+/)[0]);
	switch(id) {
	case 1:  this.onButton1Click(inSender);break;
	case 2:  this.onButton2Click(inSender);break;
	case 3:  this.onButton3Click(inSender);break;
	case 4:  this.onButton4Click(inSender);break;
	case 5:  this.onButton5Click(inSender);break;
	case 6:  this.onButton6Click(inSender); break;
	}
	if (this["button" + id + "Close"]) this.dismiss();
    },

    onButton1Click: function(inButton) {
        this.fileUploader.upload();
    },

    onButton2Click: function(inButton) {},
    onButton3Click: function(inButton) {},
    onButton4Click: function(inButton) {},
    onButton5Click: function(inButton) {},
    onButton6Click: function(inButton) {}
});

