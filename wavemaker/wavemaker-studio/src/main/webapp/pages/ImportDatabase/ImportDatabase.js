/*
 * Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
 

dojo.provide("wm.studio.pages.ImportDatabase.ImportDatabase");

dojo.declare("ImportDatabase", wm.Page, {
        i18n: true,
	ip: null,

	start: function() {
		initDBTypeDropdown(this.dbdropdown);
		studio.runtimeService.requestAsync(
			LOAD_IP_OP, [], dojo.hitch(this, "_loadedIP"));
		this.update();
	},
    onShow: function() {
	this.panel2.activate();
    },
	update: function(inImportDataModel) {
		var d = inImportDataModel;
		if (d) {
			this.serviceNameInput.setDataValue(d.dataModelName || "");
			this.serviceNameChanged();
			this.usernameInput.setDataValue(d.userName || "");
			this.usernameChanged();
			this.passwordInput.setDataValue(d.password || "");
			if (d.dbtype) {
				this.dbdropdown.setDisplayValue(d.dbtype);
				this.importDBdropdownChanged();
			}
			this.hostInput.setDataValue(d.host || ((studio.isCloud()) ? "mysql.wavemaker.com" : "localhost"));
			this.importHostChanged();
			this.portInput.setDataValue(d.port || "3306");
			this.importPortChanged()
			this.extraInput.setDataValue(d.dbName || "");
			this.importExtraChanged();
			if (d.noPrompt)
				setTimeout(dojo.hitch(this, "importBtnClick"), 100);
		}
	},
	cancelBtnClick: function(inSender) {
		this._close();
	},
/*
	onServiceNameKeyPress: function() {
		setTimeout(dojo.hitch(this, "serviceNameChanged"), 0);
	},
	*/
	serviceNameChanged: function() {
		this._updatePackage();
	},
/*
	onUsernameKeyPress: function() {
		setTimeout(dojo.hitch(this, "usernameChanged"), 0);
	},
	*/
	usernameChanged: function() {
		var db = this.dbdropdown.getDisplayValue();
		this._updateSchemaFilter(db, this.usernameInput.getDataValue(),
					this.schemaPatternInput);
	},

	importDBdropdownChanged: function(inSender, inValue) {
	    if (inValue == "Oracle" && studio.isJarMissing("ojdbc.jar")) {
		wm.DataModel.prototype.showOracleJarDialog();
		inSender.setDisplayValue("HSQLDB");
		return;
	    } else if (inValue == "DB2" && studio.isJarMissing("db2jcc.jar")) {
		wm.DataModel.prototype.showDB2JarDialog();
		inSender.setDisplayValue("HSQLDB");
		return;
	    }

		setupWidgetsForDatabaseType(inValue,
					    this.ip,
					    //this.hostLabel,
					    this.hostInput,
					    //this.portLabel,
					    this.portInput,
					    //this.extraInputLabel,
					    this.extraInput,
					    //this.extra2InputLabel,
					    this.extra2Input,
					    this.tablePatternInput,
					    this.schemaPatternInput,
					    this.usernameInput,
					    this.passwordInput,
					    this.executeAsMenu,
					   this.activeDirectoryDomain);
							 
		this._updateImportConnectionUrl();
		this.usernameChanged(); 
	},
/*
	onImportHostKeyPress: function(inSender) {
		setTimeout(dojo.hitch(this, "importHostChanged", inSender), 0);
	},
	*/
	importHostChanged: function(inSender) {
		this._updateImportConnectionUrl();
	},
/*
	onImportPortKeyPress: function() {
		setTimeout(dojo.hitch(this, "importPortChanged"), 0);
	},
	*/
	importPortChanged: function() {
		this._updateImportConnectionUrl();
	},
/*
	onImportExtraKeyPress: function() {
		setTimeout(dojo.hitch(this, "importExtraChanged"), 0);
	},
	*/
	importExtraChanged: function() {
		this._updateServiceName();
		this._updateImportConnectionUrl();
	},
/*
	onImportExtra2KeyPress: function() {
		setTimeout(dojo.hitch(this, "importExtra2Changed"), 0);
	},
	*/
	importExtra2Changed: function() {
		this._updateImportConnectionUrl();
	},
	testConnectionBtnClick: function(inSender) {
		this._testConnection(this.connectionUrlInput.getDataValue(),
					this.usernameInput.getDataValue(),
					this.passwordInput.getDataValue(),
					this.driverClassInput.getDataValue());
		//this._testConnection(this.extraInput.getDataValue());
	},
	importBtnClick: function(inSender) {
	    if (this.dbdropdown.getDataValue("").toLowerCase() == "mysql" && dojo.isMac) {
		app.confirm(this.getDictionaryItem("CONFIRM_MYSQL_MAC_IMPORT"), false, dojo.hitch(this, "importBtnClick2"));
	    } else if (this.dbdropdown.getDataValue("").toLowerCase() == "postgresql") {
		app.confirm(this.getDictionaryItem("CONFIRM_POSTGRES_IMPORT"), false, dojo.hitch(this, "importBtnClick2"));
	    } else {
		this.importBtnClick2();
	    }
	},
	importBtnClick2: function(inSender) {
		this.dataModelName = null;
	    studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING"));
		studio.dataService.requestAsync(IMPORT_DB_OP,
					[this.serviceNameInput.getDataValue(),
					this.packageInput.getDataValue(),
					this.usernameInput.getDataValue(),
					this.passwordInput.getDataValue(),
					this.connectionUrlInput.getDataValue(),
					this.tablePatternInput.getDataValue(),
					this.schemaPatternInput.getDataValue(),
					this.driverClassInput.getDataValue(),
					this.dialectInput.getDataValue(),
					 this.revengNamingStrategyInput.getDataValue(),
					 this.executeAsMenu.getDataValue() == "Logged in user",
					 this.activeDirectoryDomain.getDataValue()],
					dojo.hitch(this, "_importResult"), 
					dojo.hitch(this, "_importError"));
	},

	/*importBtnClick2: function(inSender) {
	this.dataModelName = null;
	studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING"));
	studio.dataService.requestAsync("cfImportDatabase",
				[this.serviceNameInput.getDataValue(),
				this.packageInput.getDataValue(),
				//this.usernameInput.getDataValue(),
				//this.passwordInput.getDataValue(),
				//this.connectionUrlInput.getDataValue(),
				this.tablePatternInput.getDataValue(),
				this.schemaPatternInput.getDataValue(),
				this.driverClassInput.getDataValue(),
				this.dialectInput.getDataValue(),
				 this.revengNamingStrategyInput.getDataValue(),
				 this.executeAsMenu.getDataValue() == "Logged in user",
				 this.activeDirectoryDomain.getDataValue()],
				dojo.hitch(this, "_importResult"), 
				dojo.hitch(this, "_importError"));
	},*/

	_updatePackage: function() {
		this.packageInput.setDataValue("");
		var s = this.serviceNameInput.getDataValue().toLowerCase();
		this.packageInput.setDataValue(DEFAULT_PACKAGE_ROOT + s);
	},
	_updateSchemaFilter: function(dbtype, username, schemaFilterInput) {
		if (isOracle(dbtype) || isDB2(dbtype)) {
			schemaFilterInput.setDataValue(username.toUpperCase());
		}
	},
	_updateImportConnectionUrl: function() {
		var dbtype = this.dbdropdown.getDisplayValue();
		var h = this.hostInput.getDataValue();
		var p = this.portInput.getDataValue();
		var e = this.extraInput.getDataValue();
		var e2 = this.extra2Input.getDataValue();

		var s = buildConnectionUrl(dbtype, h, p, e, e2);

		this.connectionUrlInput.setDataValue(s);
	},
	_updateServiceName: function() {
		var e = this.extraInput.getDataValue();
		this.serviceNameChanged();
	        if (!e.match(/db$/i))
		    e += "DB";
		this.serviceNameInput.setDataValue(e);
	},
	_testConnection: function(url, username, password, driverClassName) {
		studio.beginWait("Test Connection: " + url);
		studio.dataService.requestAsync(TEST_CONNECTION_OP,
			[username, password, url, driverClassName],
			dojo.hitch(this, "_connectionSucceeded"), 
			dojo.hitch(this, "_connectionFailed"));
	},
	/*_testConnection: function(serviceName) {
		studio.beginWait("Test Connection: " + serviceName);
		studio.dataService.requestAsync("cfTestConnection",
			[serviceName],
			dojo.hitch(this, "_connectionSucceeded"), 
			dojo.hitch(this, "_connectionFailed"));
	},*/
	_connectionSucceeded: function() {
		studio.endWait();
	    app.alert(this.getDictionaryItem("ALERT_CONNECTION_SUCCESS"));
	},
	_connectionFailed: function(inError) {
	    studio.endWait();
	    app.alert(this.getDictionaryItem("ALERT_CONNECTION_FAILED", {error: inError.message}));
	    app.alertDialog.setWidth("600px");
	},
	_importResult: function() {
		studio.endWait();
		this.dataModelName = this.serviceNameInput.getDataValue();
		studio.updateServices();
/*
	        var layers = studio.databaseSubTab.layers;
	    for (var i = 0; i < layers.length; i++) {
		var pageContainer = layers[i].c$[0];
		if (pageContainer.page instanceof DataObjectsEditor ||
		    pageContainer.page instanceof QueryEditor) {
		    pageContainer.page.update();
		}
	    }
	    */
	    this._close("Import");
	},
	_importError: function(inError) {
		studio.endWait();
		var msg = "";
		if (inError.message) {
		    msg = ": " + inError.message;
		}
	    app.alert(this.getDictionaryItem("ALERT_IMPORT_FAILED", {error: inError.message}));
	    app.alertDialog.setWidth("600px");
	},
	_loadedIP: function(inData) {
		this.ip = inData;
	},
/*
	newBtnClick: function(inSender) {
		var f = this.newDataModelInput.getDataValue();
		this.dataModelName = f;
		studio.beginWait("Adding " + f);
		studio.dataService.requestAsync(NEW_DATA_MODEL_OP, 
			[f], 
			dojo.hitch(this, "newDataModelResult"), 
			dojo.hitch(this, "newDataModelError"));
	},
	newDataModelError: function(inError) {
		this.dataModelName = null;
		app.alert(inError);
	},
	newDataModelResult: function() {
		wm.fire(studio.getEditor("DataObjectsEditor").page, "newDataModelResult");
		this._close("New");
	},

	*/
	_close: function(inWhy) {
		wm.fire(this.owner, "dismiss", [inWhy]);
	},
    executeAsMenuChange: function(inSender) {
	this.activeDirectoryDomain.setDisabled(this.executeAsMenu.getDataValue() != "Logged in user");
    },
  _end: 0
});
