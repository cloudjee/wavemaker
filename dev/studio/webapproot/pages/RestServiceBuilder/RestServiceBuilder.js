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
dojo.provide("wm.studio.pages.RestServiceBuilder.RestServiceBuilder");

dojo.declare("RestServiceBuilder", wm.Page, {
	IMPORT_TYPE_URL: "URL",
	IMPORT_TYPE_FILE: "File",
	start: function() {
		this.updateSelect(this.inParamTypeInput, ["string", "int"]);
		this.updateSelect(this.methodInput, ["GET", "POST"]);
		this.methodInput.setValue("displayValue", "GET");
		this.contentTypeInput.setValue("displayValue", "text/xml");
		this.updateSelect(this.pathTypeInput, [this.IMPORT_TYPE_URL]);
		this.pathTypeInput.setValue("displayValue", this.IMPORT_TYPE_URL);
		this.schemaFileRadioInputChange();
		this.schemaTextRadioInputChange();
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
	saveButtonClick: function(inSender) {
		this.buildRestService(false);
	},
	buildRestService: function(inOverwrite) {
		var w = (inOverwrite == undefined || inOverwrite == null) ? false : inOverwrite;
		var sname = this.serviceNameInput.getValue("displayValue");
		var opname = this.serviceOpInput.getValue("displayValue");
		if (!sname || sname.length == 0 || !opname || opname.length == 0) {
			app.alert("Service name and operation name are required!");
			return;
		}
		var d = this.inParamsList._data;
		var url = this.urlInput.getValue("displayValue");
		if (!url || url.length == 0) {
			app.alert("Missing Service URL!");
			return;
		}
		var m = this.methodInput.getValue("displayValue");
		var ct = this.contentTypeInput.getValue("displayValue");
		var output;
		if (this.outIsRawStringInput.getChecked()) {
			output = "string";
		} else {
			output = this.outTypeInput.getValue("displayValue");
//			if (!output || output.length == 0) {
//				app.alert("Missing Output Type!");
//				return;
//			}
		}
		if (!output || output == "(None)") output = null;
		var schemaPath = null, schemaText = null;
		if (output != "string") {
			if (this.isSchemaFileRadioSelected()) {
				if (this.pathTypeInput.getValue("displayValue") == this.IMPORT_TYPE_URL) {
					schemaPath = this.xmlSchemaUrlInput.getValue("displayValue");
				} else {
					schemaPath = this.xmlSchemaFileInput.fileNode.value;
				}
			} else {
				schemaText = this.xmlSchemaTextInput.getValue("displayValue");
			}
		}
		studio.beginWait("Importing REST Service...");
		studio.webService.requestAsync("buildRestService", 
			[sname, opname, d, url, m, ct, output, schemaText, schemaPath, w], 
			dojo.hitch(this, "buildRestServiceSuccess"), 
			dojo.hitch(this, "buildRestServiceError"));
	},
	buildRestServiceSuccess: function(inResponse) {
		studio.endWait();
		if (inResponse == "$already_exists$") {
                    app.confirm('The service name already exists. Overwrite?', false,
                                dojo.hitch(this, function() {
				    this.buildRestService(true);
                                }));
	        } else {
			this.owner.owner.importCompleted(inResponse);
		}
	},
	buildRestServiceError: function(inError) {
		studio.endWait();
		app.alert("Error occurred while importing REST service!\n" + inError);
	},
	clearAll: function(inSender) {
		this.serviceNameInput.clear();
		this.serviceOpInput.clear();
		this.methodInput.setValue("displayValue", "GET");
		this.contentTypeInput.setValue("displayValue", "text/xml");
		this.inParamsList.clear();
		this.urlInput.clear();
		this.updateSelect(this.outTypeInput, null);
		this.outTypeInput.clear();
		this.outIsRawStringInput.setChecked(false);
		this.xmlSchemaFileInput.fileNode.value = "";
		this.xmlSchemaUrlInput.clear();
		this.xmlSchemaTextInput.clear();
	},
	populateButtonClick: function(inSender) {
		this.owner.owner.layers.setLayer("restUrlLayer");
		this.owner.owner.importButton.setDisabled(true);
		this.owner.owner.restUrlPage.page.clearAll();
	},
	populate: function() {
		var url = this.owner.owner.restUrlPage.page.url;
		if (url) {
			studio.beginWait("Populating...");
			studio.webService.requestAsync("generateRESTWsdlSettings", 
				[url], 
				dojo.hitch(this, "generateRESTWsdlSettingsSuccess"), 
				dojo.hitch(this, "generateRESTWsdlSettingsError"));
		}
	},
	generateRESTWsdlSettingsSuccess: function(inResponse) {
		studio.endWait();
		this.serviceNameInput.setValue("displayValue", inResponse.serviceName);
		this.serviceOpInput.setValue("displayValue", inResponse.operationName);
		var d = inResponse.inputs;
		this.inParamsList.renderData(d);
		this.urlInput.setValue("displayValue", inResponse.parameterizedUrl);
		this.schemaTextRadioInput.components.editor.setChecked(true);
		if (inResponse.outputType && inResponse.outputType == "string") {
			this.outIsRawStringInput.setChecked(true);
		} else {
			this.outIsRawStringInput.setChecked(false);
			this.xmlSchemaTextInput.setValue("displayValue", inResponse.xmlSchemaText);
			this.getSchemaElementTypes(inResponse.outputType);
		}
	},
	generateRESTWsdlSettingsError: function(inError) {
		studio.endWait();
	},
	addInParamButtonClick: function(inSender) {
		var name = dojo.trim(this.inParamNameInput.getValue("displayValue"));
		var type = dojo.trim(this.inParamTypeInput.getValue("displayValue"));
		if (name && type) {
			var d = this.inParamsList._data;
			if (d == null) {
				d = [];
			}
			for (var i = 0; i < d.length; i++) {
				if (d[i] && d[i].name == name) {
					app.alert("Parameter name already exists, please type in another one!");
					return;
				}
			}
			d.push({name: name, type: type});

			this.inParamsList.renderData(d);
			this.inParamNameInput.clear();
			this.inParamTypeInput.clear();
		}
	},
	removeInParamButtonClick: function(inSender) {
		if (this.inParamsList.selected) {
			var d = this.inParamsList._data;
			var nd = [];
			for (var i = 0; i < d.length; i++) {
				if (i != this.inParamsList.selected.index) {
					nd.push(d[i]);
				}
			}
			this.inParamsList.renderData(nd);
		}
	},
	parameterizedButtonClick: function(inSender) {
		var url = this.urlInput.getValue("displayValue");
		if (url) {
			var d = this.inParamsList._data;
			if (d && d.length > 0) {
				var queryString = "";
				for (var i = 0; i < d.length; i++) {
					queryString = queryString + d[i].name + "={" + d[i].name + "}" + (i+1 == d.length ? "" : "&");
				}
			    app.confirm("This will append the query string '" + queryString + 
					"' to the Service URL. Proceed?", false,
                                        dojo.hitch(this, function() {
					    this.urlInput.setValue("displayValue", (url + (url.indexOf("?") > -1 ? "&" : "?") + queryString));
                                        }));
				}
			}
        },
	outIsRawStringInputChange: function(inSender, inDisplayValue, inDataValue) {
		var b = inSender.getChecked();
		this.outTypeInput.editor.setDisabled(b);
		this.xmlSchemaLabel.setDisabled(b);
		this.schemaFileRadioInput.setDisabled(b);
		this.schemaTextRadioInput.setDisabled(b);
		this.importXmlSchemaButton.setDisabled(b);
		if (b) {
			this.pathTypeInput.setDisabled(b);
			this.xmlSchemaFileInput.fileNode.disabled = b;
			this.xmlSchemaUrlInput.setDisabled(b);
			this.xmlSchemaTextInput.setDisabled(b);
			this.xml2SchemaButton.setDisabled(b);
		} else {
			this.schemaFileRadioInputChange();
			this.schemaTextRadioInputChange();
		}
	},
	isSchemaFileRadioSelected: function() {
		//return (this.schemaFileRadioInput.displayValue == this.schemaFileRadioInput.dataValue);
		return (this.schemaFileRadioInput.getGroupValue() == 1);
	},
	schemaFileRadioInputChange: function(inSender, inDisplayValue, inDataValue) {
		var b = this.isSchemaFileRadioSelected();
		this.pathTypeInput.setDisabled(b);
		this.xmlSchemaFileInput.fileNode.disabled = b;
		this.xmlSchemaUrlInput.setDisabled(b);
		this.xmlSchemaTextInput.setDisabled(!b);
		this.xml2SchemaButton.setDisabled(!b);
	},
	schemaTextRadioInputChange: function(inSender, inDisplayValue, inDataValue) {
		var b = this.isSchemaFileRadioSelected();
		this.pathTypeInput.setDisabled(!b);
		this.xmlSchemaFileInput.fileNode.disabled = !b;
		this.xmlSchemaUrlInput.setDisabled(!b);
		this.xmlSchemaTextInput.setDisabled(b);
		this.xml2SchemaButton.setDisabled(b);
	},
	importXmlSchemaButtonClick: function(inSender) {
		this.getSchemaElementTypes();
	},
	getSchemaElementTypes: function(inType) {
		var schemaPath = null, schemaText = null;
		if (this.isSchemaFileRadioSelected()) {
			if (this.pathTypeInput.getValue("displayValue") == this.IMPORT_TYPE_URL) {
				schemaPath = this.xmlSchemaUrlInput.getValue("displayValue");
			} else {
				schemaPath = this.xmlSchemaFileInput.fileNode.value;
			}
		} else {
			schemaText = this.xmlSchemaTextInput.getValue("displayValue");
		}
		studio.webService.requestAsync("getSchemaElementTypes", 
			[schemaPath, schemaText], 
			dojo.hitch(this, "getSchemaElementTypesSuccess", inType), 
			dojo.hitch(this, "getSchemaElementTypesError"));
	},
	getSchemaElementTypesSuccess: function(inType, inResponse) {
		var r = inResponse;
		if (r) {
			var o = (this.inParamTypeInput.editor.options.split(",")).concat(r);
			this.updateSelect(this.inParamTypeInput, o);
			r.push("(None)");
		}
		this.updateSelect(this.outTypeInput, r);
		if (inType) {
			this.outTypeInput.setValue("displayValue", inType);
		} else if (r && r.length > 0) {
			this.outTypeInput.setValue("displayValue", r[0]);
		}
	},
	getSchemaElementTypesError: function(inError) {
		
	},
	xml2SchemaButtonClick: function(inSender) {
		var xml = this.xmlSchemaTextInput.getValue("displayValue");
	    if (xml) {
                app.confirm("This will generate a XML Schema for the sample XML response entered in the text area. Proceed?", false,
                            dojo.hitch(this, function() {
			        studio.beginWait("Generating XML Schema...");
			        studio.webService.requestAsync("convertXmlToSchema", 
				                               [xml], 
				                               dojo.hitch(this, "convertXmlToSchemaSuccess"), 
				                               dojo.hitch(this, "convertXmlToSchemaError"));
                            }));
		}
	},
	convertXmlToSchemaSuccess: function(inResponse) {
		studio.endWait();
		this.xmlSchemaTextInput.setValue("displayValue", inResponse);
		this.getSchemaElementTypes();
	},
	convertXmlToSchemaError: function(inError) {
		studio.endWait();
		app.alert("Error occurred while Generating XML Schema!\n" + inError);
	},
	pathTypeInputChange: function(inSender, inValue) {
		var b = (inValue == this.IMPORT_TYPE_URL);
		this.xmlSchemaFileInput.setShowing(!b);
		this.xmlSchemaUrlInput.setShowing(b);
	},
	_end: 0
});