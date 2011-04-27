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
dojo.provide("wm.studio.pages.ImportWebService.ImportWebService");


dojo.declare("ImportWebService", wm.Page, {
	TYPE_SOAP: "SOAP",
	TYPE_REST_WSDL: "REST (WSDL / WADL)",
        TYPE_REST_BUILDER: null,
	TYPE_FEED: "Feed",
    //TYPE_SALESFORCE: "SOAP-Salesforce", //xxx
	IMPORT_TYPE_URL: "URL",
	IMPORT_TYPE_FILE: "File",
	start: function() {
	        this.TYPE_REST_BUILDER = this.getDictionaryItem("REST_BUILDER");
		this.updateSelect(this.typeInput, [this.TYPE_SOAP, this.TYPE_REST_WSDL, this.TYPE_REST_BUILDER, this.TYPE_FEED/*, this.TYPE_SALESFORCE*/]); //xxx
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
		this.usernameInput.setInputValue("");
		this.passwordInput.setInputValue("");
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
		        this.wsdlGroupLabel.setCaption(this.getDictionaryItem("CAPTION_WSDL_GROUP_SOAP"));
			this.usernameLabel.setShowing(false);
			this.passwordLabel.setShowing(false);
			this.usernameInput.setShowing(false);
			this.passwordInput.setShowing(false);
			this.serviceIdAutoYesRadio.components.editor.setChecked(true);
			this.serviceIdInput.clear();
			//this.serviceIdInput.setDisabled(true);
/*
		} else if (inValue == this.TYPE_SALESFORCE) { //xxx
			this.layers.setLayer("wsdlLayer");
			this.wsdlPathTypeInput.setCaption("WSDL");
		        this.wsdlGroupLabel.setCaption(this.getDictionaryItem("CAPTION_WSDL_GROUP_SALESFORCE"));
			this.usernameLabel.setShowing(true);
			this.passwordLabel.setShowing(true);
			this.usernameInput.setShowing(true);
			this.passwordInput.setShowing(true);
			this.serviceIdAutoNoRadio.components.editor.setChecked(true);
			this.serviceIdInput.setDataValue("salesforceService");
			this.serviceIdInput.setDisabled(true);
			*/
		} else if (inValue == this.TYPE_REST_WSDL) {
			this.layers.setLayer("wsdlLayer");
			this.wsdlPathTypeInput.setCaption("WSDL / WADL");
		        this.wsdlGroupLabel.setCaption(this.getDictionaryItem("CAPTION_WSDL_GROUP_WSDL"));
			this.usernameLabel.setShowing(false);
			this.passwordLabel.setShowing(false);
			this.usernameInput.setShowing(false);
			this.passwordInput.setShowing(false);
			this.serviceIdAutoYesRadio.components.editor.setChecked(true);
			this.serviceIdInput.clear();
			//this.serviceIdInput.setDisabled(true);
		} else if (inValue == this.TYPE_REST_BUILDER) {
			this.layers.setLayer("restBuilderLayer");
		} else if (inValue == this.TYPE_FEED) {
			this.layers.setLayer("feedLayer");
		}
	},
	importButtonClick: function(inSender) {
		this.serviceId = null;
		var t = this.typeInput.getValue("displayValue");
		if (t == this.TYPE_SOAP || t == this.TYPE_REST_WSDL/* || t == this.TYPE_SALESFORCE*/) {
			this.importWSDL(false);
		} else if (t == this.TYPE_FEED) {
			if (wm.services.byName["FeedService"]) {
			    app.alert(this.getDictionaryItem("ALERT_ALREADY_IMPORTED"));
			} else {
			    studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING_FEED"));
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
		var un = this.usernameInput.getInputValue(); //xxx
		var pw = this.passwordInput.getInputValue(); //xxx
		if (w)
			studio.application.removeServerComponentByName(this.overWriteId, "wm.WebService");
		if (this.wsdlPathTypeInput.getValue("displayValue") == this.IMPORT_TYPE_URL) {
			f = this.wsdlUrlInput.getValue("displayValue");
			if (!f) {
			    app.alert(this.getDictionaryItem("ALERT_NO_WSDL"));
			} else {
			    studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING_WEB"));
				studio.webService.requestAsync("importWSDL", [f, id, w], dojo.hitch(this, "importWSDLResult"), dojo.hitch(this, "importWSDLError"));
			}
		} else {
			f = this.wsdlFileInput.fileNode.value;
			if (!f) {
			    app.alert(this.getDictionaryItem("ALERT_NO_WSDL"));
			} else {
			    studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING_WEB"));
				dojo.io.iframe.send({
					url: "services/webService.upload",
					content: {serviceId: id, overwrite: w, username: un, password: pw}, //xxx
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
		    app.confirm(this.getDictionaryItem("CONFIRM_OVERWRITE"), false, 
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
	    app.alert(this.getDictionaryItem("IMPORT_WSDL_FAILED", {error: inError}));
	},
	registerFeedServiceResult: function(inResponse) {
		studio.endWait();
		this.importCompleted(inResponse);
	},
	registerFeedServiceError: function(inError) {
		studio.endWait();
	    app.alert(this.getDictionaryItem("IMPORT_FEED_FAILED", {error: inError}));
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
	    /*if (this.typeInput.getValue("displayValue") != this.TYPE_SALESFORCE) { //xxx
			this.serviceIdInput.setDisabled(inDataValue == 1);
		}*/
			this.serviceIdInput.setDisabled(inDataValue == 1);
	},
	_end: 0
});
