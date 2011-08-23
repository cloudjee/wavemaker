/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
 

dojo.provide("wm.studio.pages.DBConnectionSettings.DBConnectionSettings");

dojo.declare("DBConnectionSettings", wm.Page, {
        i18n: true,
	msgDialog: null,
	ip: null,

	start: function() {
		this.msgDialog = new wm.PageDialog(
			{owner: app, pageName: "DDLDialog", 
			hideControls: true});
		this.msgDialog.connect(this.msgDialog, 
			"onPageReady", this, "_updateDDL");
		this.msgDialogLoaded = true;

		initDBTypeDropdown(this.conDBdropdown);

		studio.runtimeService.requestAsync(
			LOAD_IP_OP, [], dojo.hitch(this, "_loadedIP"));
		this.setup();
		this._enableAll(false);
	},
	setup: function() {
		studio.dataService.requestAsync(LOAD_DATA_MODEL_NAMES_OP, 
			 [], dojo.hitch(this, "_loadedDataModelNames"));
	},
    setSelectedModel: function(inName) {
	if (dojo.isArray(this.dataModelList._data)) {
	    var index = dojo.indexOf(this.dataModelList._data, inName);
	    if (index >= 0) {
		this.dataModelList.selectByIndex(index);
		this.dataModelListSelect();		
	    }
	}
	this._defaultModelName = inName;
    },
	testConnectionBtnClick: function(inSender) {
		this._testConnection(
				this.conConnectionUrlInput.getDataValue(),
				this.conUserInput.getDataValue(),
				this.conPasswordInput.getDataValue(),
				this.conDriverClassInput.getDataValue());
	},
	reimportBtnClick: function(inSender) {
		var dmn = this._getSelectedDataModelName();
	    app.confirm(this.getDictionaryItem("CONFIRM_REIMPORT", {modelName: dmn}), false,
                        dojo.hitch(this, function() {
			    studio.beginWait(this.getDictionaryItem("WAIT_REIMPORT", {modelName: dmn}));
		studio.dataService.requestAsync(REIMPORT_DB_OP, [
				dmn, 
				this.conUserInput.getDataValue(),
				this.conPasswordInput.getDataValue(),
				this.conConnectionUrlInput.getDataValue(),
				this.conTablePatternInput.getDataValue(),
				this.conSchemaPatternInput.getDataValue(),
				this.conDriverClassInput.getDataValue(),
				this.conDialectInput.getDataValue(),
		                this.conRevengNamingStrategyInput.getDataValue(),
		                this.executeAsMenu.getDataValue() == "Logged in user",
		                this.activeDirectoryDomain.getDataValue()
			],
			dojo.hitch(this, "_reImportResult"), 
			dojo.hitch(this, "_reImportError")
		                               )
                        }));
	},
	exportBtnClick: function(inSender) {
	    var f = dojo.hitch(this, function() {
		if (this.overrideFlagInput.getChecked()) {
		    app.confirm(this.getDictionaryItem("CONFIRM_EXPORT"), false, dojo.hitch(this, function() {
			this.exportBtnClick2();
		    }));
		} else {
		    this.exportBtnClick2();
		}
	    });

	    if (this.modelIsDirty) {
		app.confirm(this.getDictionaryItem("CONFIRM_SAVE_MODEL_FIRST"), false, f);
	    } else {
		f();
	    }
	},
        exportBtnClick2: function() {
			studio.beginWait(this.getDictionaryItem("WAIT_LOADING_DDL"));
			studio.dataService.requestAsync(LOAD_DDL_OP, 
							[
							    this._getSelectedDataModelName(),
							    this.conUserInput.getDataValue(),
							    this.conPasswordInput.getDataValue(),
							    this.conConnectionUrlInput.getDataValue(),
							    this.conSchemaPatternInput.getDataValue(),
							    this.conDriverClassInput.getDataValue(),
							    this.conDialectInput.getDataValue(),
							    this.overrideFlagInput.getChecked()
							],
							dojo.hitch(this, "_getDDLResult"), 
							dojo.hitch(this, "_getDDLError"));
	},
	saveBtnClick: function(inSender) {
		var input = 
			{username:this.conUserInput.getDataValue(),
			password:this.conPasswordInput.getDataValue(),
			connectionUrl:this.conConnectionUrlInput.getDataValue(),
			driverClassName:this.conDriverClassInput.getDataValue(), 
			dialect:this.conDialectInput.getDataValue(),
			tableFilter:this.conTablePatternInput.getDataValue(),
			schemaFilter:this.conSchemaPatternInput.getDataValue(),
			 reverseNamingStrategy:this.conRevengNamingStrategyInput.getDataValue(),
			 executeAs: this.executeAsMenu.getDataValue() == "Logged in user",
			 activeDirectoryDomain: this.activeDirectoryDomain.getDataValue()};
		studio.setLiveLayoutReady(false);
		studio.dataService.requestAsync(SAVE_CONNECTION_PROPS_OP,
			[this._getSelectedDataModelName(), input],
			dojo.hitch(this, "_propWriteOk"),
			dojo.hitch(this, "_propWriteFailed"));
	},
	cancelBtnClick: function(inSender) {
		wm.dismiss(inSender);
	},
	dataModelListSelect: function(inSender, inItem) {
		this._enableAll(true);
		var n = this._getSelectedDataModelName();
		this._loadConnectionProperties(n);
	},
	onConUsernameKeyPress: function() {
		setTimeout(dojo.hitch(this, "conUsernameChanged"), 0);
	},
	conUsernameChanged: function() {
	    if (this._disableChangeEvents) return;
		var db = this.conDBdropdown.getDisplayValue();
		var username = this.conUserInput.getDataValue();
		this._updateSchemaFilter(db, username, 
					this.conSchemaPatternInput);
	},
	onConPasswordKeyPress: function() {
		setTimeout(dojo.hitch(this, "conPasswordChanged"), 0);
	},
	conPasswordChanged: function() {
	},
	conDBdropdownChanged: function(inSender, inValue) {
	    if (this._disableChangeEvents) return;
		setupWidgetsForDatabaseType(inValue,
						this.ip,
					    //this.conHostLabel,
						this.conHostInput,
						//this.conPortLabel,
						this.conPortInput,
						//this.conExtraInputLabel,
						this.conExtraInput,
						//this.conExtra2InputLabel,
						this.conExtra2Input,
						this.conTablePatternInput,
						this.conSchemaPatternInput,
					    this.conUserInput,
					    this.conPasswordInput,
					    this.executeAsMenu,
					    this.activeDirectoryDomain
						//this.overrideFlagInput
						);

		this.conDriverClassInput.setDataValue("");
		this.conDialectInput.setDataValue("");
		this.conRevengNamingStrategyInput.setDataValue("");
							 
		this._updateConConnectionUrl();
		this.conUsernameChanged();
	},
	onConHostKeyPress: function(inSender) {
		setTimeout(dojo.hitch(this, "conHostChanged", inSender), 0);
	},
	conHostChanged: function(inSender) {
		this._updateConConnectionUrl();
		this.connectionSettingsChanged = true;
	},
	onConPortKeyPress: function() {
		setTimeout(dojo.hitch(this, "conPortChanged"), 0);
	},
	conPortChanged: function() {
		this._updateConConnectionUrl();
	},
	onConExtraKeyPress: function() {
		setTimeout(dojo.hitch(this, "conExtraChanged"), 0);
	},
	conExtraChanged: function() {
		this._updateConConnectionUrl();
	},
	onConExtra2KeyPress: function() {
		setTimeout(dojo.hitch(this, "conExtra2Changed"), 0);
	},
	conExtra2Changed: function() {
		this._updateConConnectionUrl();
	},
	onConConnectionUrlKeyPress: function() {
		setTimeout(dojo.hitch(this, "conConnectionUrlChanged"), 0);
	},
	conConnectionUrlChanged: function() {
		this.connectionSettingsChanged = true;
	},
	onConTablePatternKeyPress: function() {
		setTimeout(dojo.hitch(this, "conTablePatternChanged"), 0);
	},
	conTablePatternChanged: function() {
	},
	onConSchemaPatternKeyPress: function() {
		setTimeout(dojo.hitch(this, "conSchemaPatternChanged"), 0);
	},
	conSchemaPatternChanged: function() {
	},
	onConDriverClassKeyPress: function() {
		setTimeout(dojo.hitch(this, "conDriverClassChanged"), 0);
	},
	conDriverClassChanged: function() {
	},
	onConDialectKeyPress: function() {
		setTimeout(dojo.hitch(this, "conDialectChanged"), 0);
	},
	conDialectChanged: function() {
	},
	onConRevengKeyPress: function() {
		setTimeout(dojo.hitch(this, "conRevengChanged"), 0);
	},
	conRevengChanged: function() {
	},
	onDDLOkClicked: function() {
	        studio.beginWait(this.getDictionaryItem("WAIT_DDL_OK"));
		studio.dataService.requestAsync(EXPORT_DB_OP, [
				this._getSelectedDataModelName(),
				this.conUserInput.getDataValue(),
				this.conPasswordInput.getDataValue(),
				this.conConnectionUrlInput.getDataValue(),
				this.conSchemaPatternInput.getDataValue(),
				this.conDriverClassInput.getDataValue(),
				this.conDialectInput.getDataValue(),
				this.conRevengNamingStrategyInput.getDataValue(),
				this.overrideFlagInput.getChecked()
			],
			dojo.hitch(this, "_exportResult"), 
			dojo.hitch(this, "_exportError"));
	},
	onDDLCancelClicked: function() {
	},

	overrideFlagInputChanged: function() {
	    var checked = this.overrideFlagInput.getChecked();
		
		var dbtype = this.conDBdropdown.getDisplayValue();
		var h = this.conHostInput.getDataValue();
		var p = this.conPortInput.getDataValue();
		var e = this.conExtraInput.getDataValue();
		var e2 = checked;

		var s = buildConnectionUrl(dbtype, h, p, e, e2);

		this.conConnectionUrlInput.setDataValue(s);
	},
	
	_updateSchemaFilter: function(dbtype, username, schemaFilterInput) {
		if (isOracle(dbtype) || isDB2(dbtype)) {
			schemaFilterInput.setDataValue(username.toUpperCase());
		}
	},
	_updateConConnectionUrl: function() {
		var dbtype = this.conDBdropdown.getDisplayValue();
		var h = this.conHostInput.getDataValue();
		var p = this.conPortInput.getDataValue();
		var e = this.conExtraInput.getDataValue();

		var e2;
		if (isHSQLDB(dbtype))
			e2 = this.overrideFlagInput.getChecked();
		else
			e2 = this.conExtra2Input.getDataValue();

		var s = buildConnectionUrl(dbtype, h, p, e, e2);

		this.conConnectionUrlInput.setDataValue(s);
	},
	_loadedDataModelNames: function(inDataModelNames) {
		this.dataModelList._data =  inDataModelNames;
		this.dataModelList._render();
		if (inDataModelNames.length == 0) {
			this._loadedConnectionProperties(null);
			this._enableAll(false);
		} else {
		    if (this._defaultModelName) {
			var index = dojo.indexOf(this.dataModelList._data, this._defaultModelName);
			if (index >= 0) {
			    this.dataModelList.selectByIndex(index);
			} else {
			    this.dataModelList.selectByIndex(0);
			}
		    } else {
			this.dataModelList.selectByIndex(0);
		    }
		    this.dataModelListSelect();
		} 
	},
	_loadedConnectionProperties: function(inData) {
	    this._disableChangeEvents = true;
	    try {
		this.conHostInput.setDataValue("");
		this.conPortInput.setDataValue("");
		this.conExtraInput.setDataValue("");
		this.conExtra2Input.setDataValue("");

		this.conUserInput.setDataValue("");
		this.conPasswordInput.setDataValue("");
		this.conConnectionUrlInput.setDataValue("");
		this.conTablePatternInput.setDataValue("");
		this.conSchemaPatternInput.setDataValue("");
		this.conDriverClassInput.setDataValue("");
		this.conDialectInput.setDataValue("");
		this.conRevengNamingStrategyInput.setDataValue("");
		this.activeDirectoryDomain.setDataValue("");

		if (inData == null || inData.length == 0) {
			return;
		}

		var l = parseConnectionUrl(inData.connectionUrl, inData);

		if (l == null) {
			this.conDBdropdown.setDisplayValue(" ");

			this.conHostInput.setShowing(false);
			this.conPortInput.setShowing(false);

			this.conExtraInput.setCaption("");
			this.conExtraInput.setShowing(false);
			this.conExtra2Input.setCaption("");
			this.conExtra2Input.setShowing(false);
			
		} else {

		        this.conDBdropdown.beginEditUpdate(); // don't allow onchange events
			this.conDBdropdown.setDisplayValue(l[0]);
		        this.conDBdropdown.endEditUpdate();

			setupWidgetsForDatabaseType(
				l[0], 
			    this.ip, 
			    //this.conHostLabel,
				this.conHostInput, 
			    //this.conPortLabel,
				this.conPortInput, 
			    //this.conExtraInputLabel,
				this.conExtraInput, 
			    //this.conExtra2InputLabel,
				this.conExtra2Input, 
				this.conTablePatternInput,
				this.conSchemaPatternInput,
					    this.conUserInput,
					    this.conPasswordInput,
			    this.executeAsMenu,
					    this.activeDirectoryDomain
				//this.newDatabaseInput
				);	

			if (l[1] == null) {
				this.conHostInput.setDataValue("");
			} else {
				this.conHostInput.setDataValue(l[1]);
			}
			if (l[2] == null) {
				this.conPortInput.setDataValue("");
			} else {
				this.conPortInput.setDataValue(l[2]);
			}
			if (l[3] == null) {
				this.conExtraInput.setDataValue("");
			} else {
				this.conExtraInput.setDataValue(l[3]);
			}
			if (l[4] == null) {
				this.conExtra2Input.setDataValue("");
			} else {
				this.conExtra2Input.setDataValue(l[4]);
			}
		    if (inData.executeAs == null) {
			this.executeAsMenu.setDataValue("Database credentials");
		    } else {
			this.executeAsMenu.setDataValue(inData.executeAs ? "Logged in user" : "Database credentials");
		    }
		    if (inData.activeDirectoryDomain) {
			this.activeDirectoryDomain.setDataValue(inData.activeDirectoryDomain);
		    }
		}
		
		this.conUserInput.setDataValue(inData.username);
		this.conPasswordInput.setDataValue(inData.password);
		if(l){
		this.conConnectionUrlInput.setDataValue(buildInitialCxnUrl(l[0], l[3], inData.connectionUrl, this.overrideFlagInput.getChecked()));
		}
	  else {this.conConnectionUrlInput.setDataValue(inData.connectionUrl);}
		this.conTablePatternInput.setDataValue(inData.tableFilter);
		this.conSchemaPatternInput.setDataValue(inData.schemaFilter);
		this.conDriverClassInput.setDataValue(inData.driverClassName);
		this.conDialectInput.setDataValue(inData.dialect);
		var rns = inData.reverseNamingStrategy;
		this.conRevengNamingStrategyInput.setDataValue(rns);
	    } catch(e) {
		;
	    } finally {
		this._disableChangeEvents = false;
	    }
	},
	_loadedIP: function(inData) {
		this.ip = inData;
	},
	_testConnection: function(url, username, password, driverClassName) {
	    studio.beginWait(this.getDictionaryItem("WAIT_TEST_CONNECTION", {url: url}));
		studio.dataService.requestAsync(
			TEST_CONNECTION_OP,
			[username, password, url, driverClassName],
			dojo.hitch(this, "_connectionSucceeded"), 
			dojo.hitch(this, "_connectionFailed"));
	},
	_connectionSucceeded: function() {
		studio.endWait();
	    app.alert(this.getDictionaryItem("ALERT_CONNECTION_SUCCESS"));
	},
	_connectionFailed: function(inError) {
	    studio.endWait();
	    app.alert(this.getDictionaryItem("ALERT_CONNECTION_FAILED", {error: inError.message})); 
	    app.alertDialog.setWidth("600px");
	},
	_propWriteOk: function(inData) {
	    app.alert(this.getDictionaryItem("ALERT_CONNECTION_PROPS_SUCCESS"));
	},
	_propWriteFailed: function(inData) {
	    app.alert(this.getDictionaryItem("ALERT_CONNECTION_PROPS_FAILED"));
	},
	_getSelectedDataModelName: function() {
		var i = this.dataModelList.selected.index;
		return this.dataModelList._data[i];
	},
	_reImportError: function(inError) {
		studio.endWait();
		var msg = "";
/*
		if (inError.message) {
		    msg = ": " + inError.message;
		}
		*/
	    app.alert(this.getDictionaryItem("ALERT_REIMPORT_FAILED", {error: inError.message}));
	},
	_reImportResult: function() {
		studio.endWait();
		studio.updateServices();		
	    //studio.application.loadServerComponents("wm.Query");
/*
		wm.fire(studio.getEditor("DataObjectsEditor").page, "update");		
		wm.fire(studio.getEditor("QueryEditor").page, "update");
		*/
	},
	_getDDLResult: function(inData) {
		studio.endWait();
		this.msgDialog.ddl = inData;
		this.msgDialog.show();
		if (this.msgDialogLoaded) {
			this._updateDDL();
		}
	},
	_getDDLError: function(inError) {
		studio.endWait();
		var msg = "";
	    if (inError.message.match(/Unknown database/)) {
		app.alert(this.getDictionaryItem("ALERT_EXPORT_OVERWRITE_NEEDED"))
	    } else {
		if (inError.message) {
		    msg = ": " + inError.message;
		}
		app.alert(this.getDictionaryItem("ALERT_LOAD_DDL_FAILED", {error: inError.message}));
	    }
	},
	_updateDDL: function() {
		this.msgDialog.page.setup(true);
		this.msgDialog.page.ddlEditor.setDataValue(this.msgDialog.ddl);
		this.msgDialog.page.dataObjectEditor = this;
		this.msgDialogLoaded = true;
	},
	_exportResult: function(inData) {
		studio.endWait();
		var n = this._getSelectedDataModelName();
		this._loadConnectionProperties(n);
		if (inData != "") {
			this.msgDialog.page.setup(false);
			this.msgDialog.page.ddlEditor.setDataValue(inData);
			this.msgDialog.show();
		} else {
		    app.toastSuccess(this.getDictionaryItem("TOAST_EXPORT_SUCCESS"));
		}
	},
	_exportError: function(inError) {
		studio.endWait();
		var msg = "";
		if (inError.message) {
		    msg = ": " + inError.message;
		} else {
		    msg = inError;
		}
		app.alert(this.getDictionaryItem("ALERT_EXPORT_FAILED", {error: msg}));
	    
	},
	_loadConnectionProperties: function(dataModelName) {
		studio.dataService.requestAsync(
			LOAD_CONNECTION_PROPS_OP,
			[dataModelName], 
			dojo.hitch(this, "_loadedConnectionProperties"));
	},
	_enableAll: function(enable) {
		this.conUserInput.setDisabled(!enable);
		this.conPasswordInput.setDisabled(!enable);
		this.conDBdropdown.setDisabled(!enable);
		this.conHostInput.setDisabled(!enable);
		this.conPortInput.setDisabled(!enable);
		this.conExtraInput.setDisabled(!enable);
		this.conExtra2Input.setDisabled(!enable);
		this.conConnectionUrlInput.setDisabled(!enable);
		this.conTablePatternInput.setDisabled(!enable);
		this.conSchemaPatternInput.setDisabled(!enable);
		this.conDriverClassInput.setDisabled(!enable);
		this.conDialectInput.setDisabled(!enable);
		this.conRevengNamingStrategyInput.setDisabled(!enable);
		this.testConnectionBtn.setDisabled(!enable);
		this.saveBtn.setDisabled(!enable);
		this.reimportBtn.setDisabled(!enable);
		this.exportBtn.setDisabled(!enable);
	},
    executeAsMenuChange: function(inSender) {
	this.activeDirectoryDomain.setDisabled(this.executeAsMenu.getDataValue() != "Logged in user");
    },
	_end: 0
});
