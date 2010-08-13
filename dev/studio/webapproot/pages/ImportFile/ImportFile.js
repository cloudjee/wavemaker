/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
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

dojo.provide("wm.studio.pages.ImportFile.ImportFile");

dojo.declare("ImportFile", wm.Page, {
    title: "Upload a File",
    buttonCaption: "Upload",
    uploadService: "resourceFileService",
    uploadOperation: "uploadFile",
    start: function() {
	this.setTitle(this.title);
	this.setButtonCaption(this.buttonCaption);
	this.setUploadService(this.uploadService);
	this.setUploadOperation(this.uploadOperation);
	/* Caller must directly call setCaption, setTitle, etc... as these parameters are not being effectively passed in
	if (this.caption) this.setCaption(this.caption);
	if (this.title) this.setTitle(this.title);
	if (this.service) this.setUploadService(this.service);
	if (this.operation) this.setUploadOperation(this.operation);
	*/
    },
    setTitle: function(inTitle) {
	this.title = inTitle;
	this.dialogLabel.setCaption(this.title);
    },
    setCaption: function(inLabel) {
      this.fileUploader.setCaption(inLabel);
    },
    setButtonCaption: function(inCaption) {
	this.buttonCaption = inCaption;
	this.fileUploader.setUploadButtonCaption(this.buttonCaption);
    },
    setUploadService: function(inService) {
	this.uploadService = inService;
	this.fileUploader.setService(inService);
    },
    setUploadOperation: function(inOperation) {
	this.uploadOperation = inOperation;
	this.fileUploader.setOperation(inOperation);
    },
    cancelButtonClick: function(inSender) {
	wm.fire(this.owner, "dismiss");
    },

    startImportClick: function(inSender) {
	studio.beginWait("Importing File...");
    },			  
    importClickCallback: function(inSource, inResponse) {
	studio.endWait();
	wm.fire(this.owner, "dismiss");
    },
    importClickError: function(inSource,inError) {
	studio.endWait();
	// any notification to user must be done by the component that requested the file
    },

    _end: 0
});
