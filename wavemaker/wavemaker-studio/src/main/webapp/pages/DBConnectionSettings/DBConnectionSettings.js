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
 

dojo.provide("wm.studio.pages.DBConnectionSettings.DBConnectionSettings");

dojo.declare("DBConnectionSettings", wm.Page, {
    i18n: true,
    msgDialog: null,
    ip: null,

    start: function() {
        if (studio.isCloud()) {
            this.testConnectionBtn.hide();
            this.saveBtn.hide();
            this.conUserInput.setParent(this.hiddenEditorsPanel);
            this.conPasswordInput.setParent(this.hiddenEditorsPanel);
            this.conHostInput.setParent(this.hiddenEditorsPanel);
            this.conPortInput.setParent(this.hiddenEditorsPanel);
            this.conExtra2Input.setParent(this.hiddenEditorsPanel);
            this.conConnectionUrlInput.setParent(this.hiddenEditorsPanel);
            this.conDriverClassInput.setParent(this.hiddenEditorsPanel);
            this.conDialectInput.setParent(this.hiddenEditorsPanel);
        }

        this.msgDialog = new wm.PageDialog({
            owner: app,
            title: "Confirm Schema Changes",
            pageName: "DDLDialog",
            _classes: {
                domNode: ["studiodialog"]
            },
            hideControls: true
        });
        this.msgDialog.connect(this.msgDialog, "onPageReady", this, "_updateDDL");
        this.msgDialogLoaded = true;

        initDBTypeDropdown(this.conDBdropdown);

        studio.runtimeService.requestAsync(
        LOAD_IP_OP, [], dojo.hitch(this, "_loadedIP"));
        this.setup();
        this._enableAll(false);
    },
    setup: function() {
        studio.dataService.requestAsync(LOAD_DATA_MODEL_NAMES_OP, [], dojo.hitch(this, "_loadedDataModelNames"));
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
                this.conDriverClassInput.getDataValue(),
                this.conDialectInput.getDataValue());
    },
    reimportBtnClick: function(inSender) {
        var dmn = this._getSelectedDataModelName();
        app.confirm(this.getDictionaryItem("CONFIRM_REIMPORT", {
            modelName: dmn
        }), false, 
        dojo.hitch(this, function() {
            studio.beginWait(this.getDictionaryItem("WAIT_REIMPORT", {
                modelName: dmn
            }));
            studio.dataService.requestAsync(REIMPORT_DB_OP, [
            dmn, this.conUserInput.getDataValue(), this.conPasswordInput.getDataValue(), /* If running in cloudfoundry, we want the internal cloud foundry database name, not our service name */
            studio.isCloud() ? this._originalConnectionString : this.conConnectionUrlInput.getDataValue(), this.conTablePatternInput.getDataValue(), this.conSchemaPatternInput.getDataValue(), this.conDriverClassInput.getDataValue(), this.conDialectInput.getDataValue(), this.conRevengNamingStrategyInput.getDataValue(), this.executeAsMenu.getDataValue() == "Logged in user", this.activeDirectoryDomain.getDataValue()], dojo.hitch(this, "_reImportResult"), dojo.hitch(this, "_reImportError"));
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
/*
        exportBtnClick2: function() {
            studio.beginWait(this.getDictionaryItem("WAIT_LOADING_DDL"));
            studio.dataService.requestAsync(LOAD_DDL_OP, 
                            [
                                "MyTestDatabase",
                                "root",
                                "",
                                "jdbc:mysql://localhost:3306/MyTestDatabase",
                                "*",
                                "",
                                "",
                                this.overrideFlagInput.getChecked()
                            ],
                            dojo.hitch(this, "_getDDLResult"), 
                            dojo.hitch(this, "_getDDLError"));
    },
    */
    exportBtnClick2: function() {
        studio.beginWait(this.getDictionaryItem("WAIT_LOADING_DDL"));
        if (studio.isCloud()) {
            studio.dataService.requestAsync("cfGetExportDDL", 
                            [
                                this._getSelectedDataModelName(),
                                this.conExtraInput.getDataValue(),
                                this.conDBdropdown.getDataValue().toLowerCase(),
                                this.conSchemaPatternInput.getDataValue(),
                                this.conDriverClassInput.getDataValue(),                                
                                this.conDialectInput.getDataValue(),
                                this.overrideFlagInput.getChecked()
                            ],
                            dojo.hitch(this, "_getDDLResult"), 
                            dojo.hitch(this, "_getDDLError"));
        } else {
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
        }
    },

    saveBtnClick: function(inSender) {
        var input = {
            username: this.conUserInput.getDataValue(),
            password: this.conPasswordInput.getDataValue(),
            connectionUrl: this.conConnectionUrlInput.getDataValue(),
            driverClassName: this.conDriverClassInput.getDataValue(),
            dialect: this.conDialectInput.getDataValue(),
            tableFilter: this.conTablePatternInput.getDataValue(),
            schemaFilter: this.conSchemaPatternInput.getDataValue(),
            reverseNamingStrategy: this.conRevengNamingStrategyInput.getDataValue(),
            executeAs: this.executeAsMenu.getDataValue() == "Logged in user",
            activeDirectoryDomain: this.activeDirectoryDomain.getDataValue()
        };
        studio.setLiveLayoutReady(false);
        studio.dataService.requestAsync(SAVE_CONNECTION_PROPS_OP, [this._getSelectedDataModelName(), input], dojo.hitch(this, "_propWriteOk"), dojo.hitch(this, "_propWriteFailed"));
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
        if (studio.isCloud()) {
             this.conExtraInput.setDataValue(this.dataModelList._data[this.dataModelList.getSelectedIndex()]);
        } else if (!this.conExtraInput.getDataValue() && inValue && (inValue.toLowerCase() == "mysql" || inValue.toLowerCase() == "postgres" || inValue.toLowerCase() == "hsqldb")) {
             this.conExtraInput.setDataValue(this.dataModelList._data[this.dataModelList.getSelectedIndex()]);
        }
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
        if (studio.isCloud()) {
            this.beginCFExport();
        } else {
            this.executeExport();
        }
    },
    beginCFExport: function() {
        /* Step 1: find out if the service exists */
        var d = this.cfService.requestAsync("getService", ["","", this.conExtraInput.getDataValue()], 
                                             dojo.hitch(this, function(inService) {
                                                  if (inService) {
                                                      this.executeCFExportCheckIsBound();
                                                  } else {
                                                      this.executeCFExportCreateService();
                                                  }
                                             }),
                                             dojo.hitch(this, function(inError) {
                                                 this.executeCFExportCreateService();
                                             })
                                            );
    },
    /* Step 2: Create the service if it doesn't exist, this will cause a bind and force us to wait for studio to restart */
    executeCFExportCreateService: function() {
        var d = this.cfService.requestAsync("createService", ["","",  "", this.conExtraInput.getDataValue(), this.conDBdropdown.getDataValue().toLowerCase()]);
        d.addCallbacks(dojo.hitch(this, "waitForStudioToRestart"),
                   function(inError) {
                   app.toastError(inError);
                   studio.endWait();
                   });
    },

    /* Step 3: Check if the service is bound; if it is executeCFExport else bind the service */
    executeCFExportCheckIsBound: function() {
        var serviceName = this.conExtraInput.getDataValue();
        this.cfService.requestAsync("isServiceBound", ["", "", serviceName, ""], dojo.hitch(this, function(isBound) {
            if (isBound) {
                this.executeCFExport();
            } else {
                this.doBind(serviceName);
            }
        }), function(inError) {
            app.toastError(inError);
            studio.endWait();
        });
    },
    /* Step 4: Bind the service and then wait for studio to restart */
    doBind: function(serviceName) {
        //studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING") + " Binding Service");
        // this will restart the studio server
        this.cfService.requestAsync("bindService", ["", "", serviceName, ""], dojo.hitch(this, function() {
            this.waitForStudioToRestart(serviceName);
        }), 
        function(inError) {
            app.alert(inError);
            studio.endWait();
        });
    },
    waitForStudioToRestart: function(serviceName) {
        window.setTimeout(dojo.hitch(this, function() {
            this.waitForStudioToRestart2(serviceName);
        }), 5000);
    },
    waitForStudioToRestart2: function(serviceName) {
        studio.studioService.requestAsync("getOpenProject", [], dojo.hitch(this, function(inResult) {
            // if a project is still open, the server hasn't yet restarted
            this.waitForStudioToRestart(serviceName);
        }), 
        dojo.hitch(this, function(inError) {
            // server has restarted, and is now responding
            if (inError.message.match(/No open project/i)) {
                this.waitForStudioToRestart3(serviceName);
            } else {
                // threw an error, the server has definitely restarted, but isn't yet online
                this.waitForStudioToRestart(serviceName);
            }
        }));
    },
    waitForStudioToRestart3: function(serviceName) {
        studio.studioService.requestAsync("openProject", [studio.project.projectName], dojo.hitch(this, function() {
            this.executeCFExport();
        }));
    },

    executeCFExport: function() {
        var dbname = this.conExtraInput.getDataValue();
        studio.dataService.requestAsync("cfExportDatabase", [
            this._getSelectedDataModelName(),
                dbname,            
                this.conDBdropdown.getDataValue().toLowerCase(),
                this.conSchemaPatternInput.getDataValue(),
                this.conDriverClassInput.getDataValue(),
                this.conDialectInput.getDataValue(),
                this.conRevengNamingStrategyInput.getDataValue(),
                this.overrideFlagInput.getChecked()
            ],
            dojo.hitch(this, function(inData) {
                this._exportResult(inData, dbname);
            }), 
            dojo.hitch(this, "_exportError"));
    },
    executeExport: function() {
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
        this.conHostInput.setRequired(true);
        this.conExtraInput.setRequired(true);
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

        this._originalConnectionString = inData.connectionUrl;
        var l = parseConnectionUrl(inData.connectionUrl, inData);

        if (l == null) {
            this.conDBdropdown.setDisplayValue(inData.connectionUrl.length > 5 ? "Other" : "");

            this.conHostInput.setShowing(false);
            this.conHostInput.setRequired(false);
            
            this.conPortInput.setShowing(false);

            this.conExtraInput.setCaption("");
            this.conExtraInput.setShowing(false);
            this.conExtraInput.setRequired(false);
            
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
                if (studio.isCloud()) {
                this.conExtraInput.setDataValue(this.dataModelList._data[this.dataModelList.getSelectedIndex()]);
                } else {
                this.conExtraInput.setDataValue("");                
                }
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

            if (studio.isCloud() || !this.conExtraInput.getDataValue() && (this.conDBdropdown.getDataValue().toLowerCase() == "mysql" || this.conDBdropdown.getDataValue().toLowerCase() == "postgres"  || this.conDBdropdown.getDataValue().toLowerCase() == "hsqldb")) {
            this.conExtraInput.setDataValue(this.dataModelList._data[this.dataModelList.getSelectedIndex()]);
            }

        }
        
        


        this.conUserInput.setDataValue(inData.username);
        this.conPasswordInput.setDataValue(inData.password);
        if(l) {
            if (this.conDBdropdown.getDataValue().toLowerCase() == "hsqldb"){
            this.conConnectionUrlInput.setDataValue(buildInitialCxnUrl(l[0], l[3], inData.connectionUrl, this.overrideFlagInput.getChecked()));
            } else {
            this._updateConConnectionUrl();
            }
        } else {
            this.conConnectionUrlInput.setDataValue(inData.connectionUrl);
        }
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
    _testConnection: function(url, username, password, driverClassName, dialect) {
        studio.beginWait(this.getDictionaryItem("WAIT_TEST_CONNECTION", {url: url}));
        studio.dataService.requestAsync(
            TEST_CONNECTION_OP,
            [username, password, url, driverClassName, dialect],
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
            app.toastSuccess(this.getDictionaryItem("TOAST_REIMPORT_SUCCESS"));
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
    _exportResult: function(inData, cfdbname) {
        studio.endWait();
        var n = this._getSelectedDataModelName();
        this._loadConnectionProperties(n);
        if (inData != "") {
            this.msgDialog.page.setup(false);
            this.msgDialog.page.ddlEditor.setDataValue(inData);
            this.msgDialog.show();
        } else {
            if (studio.isCloud()) {
                this.doImport(cfdbname);
            } else {
                app.toastSuccess(this.getDictionaryItem("TOAST_EXPORT_SUCCESS"));
            }
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

    doImport: function(serviceName, type) {
        studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING_GENERATING"));
        studio.dataService.requestAsync("cfImportDatabase", [serviceName, 
                                                            "com." + serviceName,
                                                            ".*",
                                                            ".*",
                                                            "", 
                                                            "", 
                                                            "",
                                                            false, 
                                                            ""], 
                                        dojo.hitch(this, "_importResult"), 
                                        function(inError) {
                                            app.alert(inError.toString());
                                            studio.endWait();
                                        }
        );

    },
    
    _importResult: function() {
        studio.endWait();        
        studio.updateServices();
        this.owner.owner.hide();        
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
