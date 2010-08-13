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
dojo.provide("wm.studio.pages.ImportWebService.ImportWebService");


dojo.declare("ImportWebService", wm.Page, {
	TYPE_SOAP: "SOAP",
	TYPE_REST_WSDL: "REST (WSDL / WADL)",
	TYPE_REST_BUILDER: "REST (Build-A-Service)",
	TYPE_FEED: "Feed",
	IMPORT_TYPE_URL: "URL",
	IMPORT_TYPE_FILE: "File",
	start: function() {
		this.updateSelect(this.typeInput, [this.TYPE_SOAP, this.TYPE_REST_WSDL, this.TYPE_REST_BUILDER, this.TYPE_FEED]);
		this.typeInput.setValue("displayValue", this.TYPE_SOAP);
		this.updateSelect(this.wsdlPathTypeInput, [this.IMPORT_TYPE_URL, this.IMPORT_TYPE_FILE]);
		this.wsdlPathTypeInput.setValue("displayValue", this.IMPORT_TYPE_URL);
	},
	reset: function() {
		this.typeInput.setValue("displayValue", this.TYPE_SOAP);
		this.wsdlPathTypeInput.setValue("displayValue", this.IMPORT_TYPE_URL);
		this.wsdlUrlInput.clear();
		this.wsdlFileInput.fileNode.value = "";
		this.serviceIdAutoYesRadio.components.editor.setChecked(true);
		this.serviceIdInput.clear();
		this.restServiceBuilderPage.page.clearAll();
	},
	updateSelect: function(inSelect, inData) {
		var s = inSelect, o;
		if (inData == null) {
			o = null;
		} else {
			o = inData.join(",");
		}
		s.displayValue = "";
		s.editor.setOptions(o);
	},
	typeInputChange:  function(inSender, inValue) {
		if (inValue == this.TYPE_SOAP) {
			this.layers.setLayer("wsdlLayer");
			this.wsdlPathTypeInput.setCaption("WSDL");
			this.wsdlGroupLabel.setCaption("WSDL Information")
		} else if (inValue == this.TYPE_REST_WSDL) {
			this.layers.setLayer("wsdlLayer");
			this.wsdlPathTypeInput.setCaption("WSDL / WADL");
			this.wsdlGroupLabel.setCaption("WSDL / WADL Information");
		} else if (inValue == this.TYPE_REST_BUILDER) {
			this.layers.setLayer("restBuilderLayer");
		} else if (inValue == this.TYPE_FEED) {
			this.layers.setLayer("feedLayer");
		}
	},
	importButtonClick: function(inSender) {
		this.serviceId = null;
		var t = this.typeInput.getValue("displayValue");
		if (t == this.TYPE_SOAP || t == this.TYPE_REST_WSDL) {
			this.importWSDL(false);
		} else if (t == this.TYPE_FEED) {
			if (wm.services.byName["FeedService"]) {
				app.alert("Feed Service has already been imported.")
			} else {
				studio.beginWait("Importing Feed Service...");
				studio.webService.requestAsync("registerFeedService", null, dojo.hitch(this, "registerFeedServiceResult"), dojo.hitch(this, "registerFeedServiceError"));
			}
		} else if (t == this.TYPE_REST_BUILDER) {
			this.restServiceBuilderPage.page.saveButtonClick();
		}
	},
	cancelButtonClick: function(inSender, inEvent) {
		wm.fire(this.owner, "dismiss", [inEvent]);
	},
	importWSDL: function(inOverwrite) {
		var w = (inOverwrite == undefined || inOverwrite == null) ? false : inOverwrite;
		var f, id = this.serviceIdInput.getValue("displayValue");
		if (w)
			studio.application.removeServerComponentByName(this.overWriteId, "wm.WebService");
		if (this.wsdlPathTypeInput.getValue("displayValue") == this.IMPORT_TYPE_URL) {
			f = this.wsdlUrlInput.getValue("displayValue");
			if (!f) {
				app.alert("Must select a WSDL file!");
			} else {
				studio.beginWait("Importing Web Service...");
				studio.webService.requestAsync("importWSDL", [f, id, w], dojo.hitch(this, "importWSDLResult"), dojo.hitch(this, "importWSDLError"));
			}
		} else {
			f = this.wsdlFileInput.fileNode.value;
			if (!f) {
				app.alert("Must select a WSDL file!");
			} else {
				studio.beginWait("Importing Web Service...");
				dojo.io.iframe.send({
					url: "services/webService.upload",
					content: {serviceId: id, overwrite: w},
					form: this.wsdlFileInput.formNode,
					handleAs: "json",
					handle: dojo.hitch(this, "uploadWSDLComplete")
				});
			}
		}
	},
	uploadWSDLComplete: function(inResponse) {
		if (inResponse.result) {
			this.importWSDLResult(inResponse.result);
		} else if (inResponse.error) {
			this.importWSDLError(inResponse.error)
		} else {
			app.alert(inResponse);
		}
	},
	importCompleted: function(inResponse) {
		this.serviceId = inResponse;
		wm.fire(this.owner, "dismiss", ["Import"]);
	},
	importWSDLResult: function(inResponse) {
		studio.endWait();
		if (inResponse.slice(0,16) == "$already_exists$") {
		    app.confirm('The service name already exists. Overwrite?', false,
                                dojo.hitch(this, function() {
				    this.overWriteId = inResponse.slice(16);
				    this.importWSDL(true);
                                }));
		} else {
			this.importCompleted(inResponse);
		}
	},
	importWSDLError: function(inError) {
		studio.endWait();
		app.alert("Error occurred while importing WSDL!\n" + inError);
	},
	registerFeedServiceResult: function(inResponse) {
		studio.endWait();
		this.importCompleted(inResponse);
	},
	registerFeedServiceError: function(inError) {
		studio.endWait();
		app.alert("Error occurred while registering Feed service!\n" + inError);
	},
	navGotoDesignerClick: function() {
		studio.tabs.setLayer("workspace");
	},
	wsdlPathTypeInputChange: function(inSender, inValue) {
		var b = inValue == this.IMPORT_TYPE_URL;
		this.wsdlFileInput.setShowing(!b);
		this.wsdlUrlInput.setShowing(b);
	},
	serviceIdAutoYesRadioChange: function(inSender, inDisplayValue, inDataValue) {
		this.serviceIdInput.setDisabled(inDataValue == 1);
	},
	_end: 0
});
