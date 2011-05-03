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
	testConnectionBtnClick: function(inSender) {
		this._testConnection(
				this.conConnectionUrlInput.getInputValue(),
				this.conUserInput.getInputValue(),
				this.conPasswordInput.getInputValue(),
				this.conDriverClassInput.getInputValue());
	},
	reimportBtnClick: function(inSender) {
		var dmn = this._getSelectedDataModelName();
	    app.confirm(this.getDictionaryItem("CONFIRM_REIMPORT", {modelName: dmn}), false,
                        dojo.hitch(this, function() {
			    studio.beginWait(this.getDictionaryItem("WAIT_REIMPORT", {modelName: dmn}));
		studio.dataService.requestAsync(REIMPORT_DB_OP, [
				dmn, 
				this.conUserInput.getInputValue(),
				this.conPasswordInput.getInputValue(),
				this.conConnectionUrlInput.getInputValue(),
				this.conTablePatternInput.getInputValue(),
				this.conSchemaPatternInput.getInputValue(),
				this.conDriverClassInput.getInputValue(),
				this.conDialectInput.getInputValue(),
				this.conRevengNamingStrategyInput.getInputValue()
			],
			dojo.hitch(this, "_reImportResult"), 
			dojo.hitch(this, "_reImportError")
		                               )
                        }));
	},
	exportBtnClick: function(inSender) {
		if (this.overrideFlagInput.getDataValue()) {
		    app.confirm(this.getDictionaryItem("CONFIRM_EXPORT"), false, dojo.hitch(this, function() {
			this.exportBtnClick2();
		    }));
		} else {
		    this.exportBtnClick2();
		}
	},
        exportBtnClick2: function() {
			studio.beginWait(this.getDictionaryItem("WAIT_LOADING_DDL"));
			studio.dataService.requestAsync(LOAD_DDL_OP, 
							[
							    this._getSelectedDataModelName(),
							    this.conUserInput.getInputValue(),
							    this.conPasswordInput.getInputValue(),
							    this.conConnectionUrlInput.getInputValue(),
							    this.conSchemaPatternInput.getInputValue(),
							    this.conDriverClassInput.getInputValue(),
							    this.conDialectInput.getInputValue(),
							    this.overrideFlagInput.getDataValue()
							],
							dojo.hitch(this, "_getDDLResult"), 
							dojo.hitch(this, "_getDDLError"));
	},
	saveBtnClick: function(inSender) {
		var input = 
			{username:this.conUserInput.getInputValue(),
			password:this.conPasswordInput.getInputValue(),
			connectionUrl:this.conConnectionUrlInput.getInputValue(),
			driverClassName:this.conDriverClassInput.getInputValue(), 
			dialect:this.conDialectInput.getInputValue(),
			tableFilter:this.conTablePatternInput.getInputValue(),
			schemaFilter:this.conSchemaPatternInput.getInputValue(),
			reverseNamingStrategy:this.conRevengNamingStrategyInput.getInputValue()};
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
		var username = this.conUserInput.getInputValue();
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
						this.conHostLabel,
						this.conHostInput,
						this.conPortLabel,
						this.conPortInput,
						this.conExtraInputLabel,
						this.conExtraInput,
						this.conExtra2InputLabel,
						this.conExtra2Input,
						this.conTablePatternInput,
						this.conSchemaPatternInput
						//this.overrideFlagInput
						);

		this.conDriverClassInput.setInputValue("");
		this.conDialectInput.setInputValue("");
		this.conRevengNamingStrategyInput.setInputValue("");
							 
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
				this.conUserInput.getInputValue(),
				this.conPasswordInput.getInputValue(),
				this.conConnectionUrlInput.getInputValue(),
				this.conSchemaPatternInput.getInputValue(),
				this.conDriverClassInput.getInputValue(),
				this.conDialectInput.getInputValue(),
				this.conRevengNamingStrategyInput.getInputValue(),
				this.overrideFlagInput.getDataValue()
			],
			dojo.hitch(this, "_exportResult"), 
			dojo.hitch(this, "_exportError"));
	},
	onDDLCancelClicked: function() {
	},

	overrideFlagInputChanged: function() {
	    var checked = this.overrideFlagInput.getDataValue();
		
		var dbtype = this.conDBdropdown.getDisplayValue();
		var h = this.conHostInput.getInputValue();
		var p = this.conPortInput.getInputValue();
		var e = this.conExtraInput.getInputValue();
		var e2 = checked;

		var s = buildConnectionUrl(dbtype, h, p, e, e2);

		this.conConnectionUrlInput.setInputValue(s);
	},
	
	_updateSchemaFilter: function(dbtype, username, schemaFilterInput) {
		if (isOracle(dbtype) || isDB2(dbtype)) {
			schemaFilterInput.setInputValue(username.toUpperCase());
		}
	},
	_updateConConnectionUrl: function() {
		var dbtype = this.conDBdropdown.getDisplayValue();
		var h = this.conHostInput.getInputValue();
		var p = this.conPortInput.getInputValue();
		var e = this.conExtraInput.getInputValue();

		var e2;
		if (isHSQLDB(dbtype))
			e2 = this.overrideFlagInput.getDataValue();
		else
			e2 = this.conExtra2Input.getInputValue();

		var s = buildConnectionUrl(dbtype, h, p, e, e2);

		this.conConnectionUrlInput.setInputValue(s);
	},
	_loadedDataModelNames: function(inDataModelNames) {
		this.dataModelList._data =  inDataModelNames;
		this.dataModelList._render();
		if (inDataModelNames.length == 0) {
			this._loadedConnectionProperties(null);
			this._enableAll(false);
		} else {
			this.dataModelList.selectByIndex(0);
			this.dataModelListSelect();
		} 
	},
	_loadedConnectionProperties: function(inData) {
	    this._disableChangeEvents = true;
	    try {
		this.conHostInput.setInputValue("");
		this.conPortInput.setInputValue("");
		this.conExtraInput.setInputValue("");
		this.conExtra2Input.setInputValue("");

		this.conUserInput.setInputValue("");
		this.conPasswordInput.setInputValue("");
		this.conConnectionUrlInput.setInputValue("");
		this.conTablePatternInput.setInputValue("");
		this.conSchemaPatternInput.setInputValue("");
		this.conDriverClassInput.setInputValue("");
		this.conDialectInput.setInputValue("");
		this.conRevengNamingStrategyInput.setInputValue("");

		if (inData == null || inData.length == 0) {
			return;
		}

		var l = parseConnectionUrl(inData.connectionUrl, inData);

		if (l == null) {
			this.conDBdropdown.setDisplayValue(" ");

			this.conHostInput.parent.setShowing(false);
			this.conPortInput.parent.setShowing(false);

			this.conExtraInputLabel.setCaption("");
			this.conExtraInput.setShowing(false);
			this.conExtra2InputLabel.setCaption("");
			this.conExtra2Input.setShowing(false);
			
		} else {

		        this.conDBdropdown.beginEditUpdate(); // don't allow onchange events
			this.conDBdropdown.setDisplayValue(l[0]);
		        this.conDBdropdown.endEditUpdate();

			setupWidgetsForDatabaseType(
				l[0], this.ip, this.conHostLabel,
				this.conHostInput, this.conPortLabel,
				this.conPortInput, this.conExtraInputLabel,
				this.conExtraInput, this.conExtra2InputLabel,
				this.conExtra2Input, 
				this.conTablePatternInput,
				this.conSchemaPatternInput
				//this.newDatabaseInput
				);	

			if (l[1] == null) {
				this.conHostInput.setInputValue("");
			} else {
				this.conHostInput.setInputValue(l[1]);
			}
			if (l[2] == null) {
				this.conPortInput.setInputValue("");
			} else {
				this.conPortInput.setInputValue(l[2]);
			}
			if (l[3] == null) {
				this.conExtraInput.setInputValue("");
			} else {
				this.conExtraInput.setInputValue(l[3]);
			}
			if (l[4] == null) {
				this.conExtra2Input.setInputValue("");
			} else {
				this.conExtra2Input.setInputValue(l[4]);
			}
		}
		
		this.conUserInput.setInputValue(inData.username);
		this.conPasswordInput.setInputValue(inData.password);
		if(l){
		this.conConnectionUrlInput.setInputValue(buildInitialCxnUrl(l[0], l[3], inData.connectionUrl, this.overrideFlagInput.getDataValue()));
		}
	  else {this.conConnectionUrlInput.setInputValue(inData.connectionUrl);}
		this.conTablePatternInput.setInputValue(inData.tableFilter);
		this.conSchemaPatternInput.setInputValue(inData.schemaFilter);
		this.conDriverClassInput.setInputValue(inData.driverClassName);
		this.conDialectInput.setInputValue(inData.dialect);
		var rns = inData.reverseNamingStrategy;
		this.conRevengNamingStrategyInput.setInputValue(rns);
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
		if (inError.message) {
		    msg = ": " + inError.message;
		}
	    app.alert(this.getDictionaryItem("ALERT_LOAD_DDL_FAILED", {error: inError.message}));
	},
	_updateDDL: function() {
		this.msgDialog.page.setup(true);
		this.msgDialog.page.ddlEditor.setInputValue(this.msgDialog.ddl);
		this.msgDialog.page.dataObjectEditor = this;
		this.msgDialogLoaded = true;
	},
	_exportResult: function(inData) {
		studio.endWait();
		var n = this._getSelectedDataModelName();
		this._loadConnectionProperties(n);
		if (inData != "") {
			this.msgDialog.page.setup(false);
			this.msgDialog.page.ddlEditor.setInputValue(inData);
			this.msgDialog.show();
		}
	},
	_exportError: function(inError) {
		studio.endWait();
		var msg = "";
		if (inError.message) {
		    msg = ": " + inError.message;
		}
	    app.alert(this.getDictionaryItem("ALERT_EXPORT_FAILED", {error: inError.message}));

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
	_end: 0
});
