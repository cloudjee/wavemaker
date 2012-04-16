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

dojo.provide("wm.studio.pages.Security.Security");

dojo.declare(
    "Security",
    wm.Page,
    {
        i18n : true,
        start : function() {
            this._defaultPanel1aHeight = this.panel1a.height;
            this._defaultPanelBottomHeight = this.panelBottom.height;
            this.SELECT_ONE = this.getDictionaryItem("MENU_SELECT_ONE");
            this.NO_VALUE = this.getDictionaryItem("MENU_NO_VALUE");
            this.loginTemplateFolder = dojo.moduleUrl("wm.studio.app") + "templates/security/";
            this.loginPageTemplateFolder = this.loginTemplateFolder + "pages/Login/";
            this.populatingOptions = false;
            this.subscribe("wm-project-changed", this, "studioProjectChanged");
            this.update();
            this._setDataTypes();
            this.setupServicesLayer();
        },
        getHelpDialog : function() {
            if (!this.helpDialog) {
                var props = {
                    owner : this,
                    pageName : "PopupHelp",
                    width : "500px",
                    height : "200px",
                    useContainerWidget : false,
                    modal : false,
                    noEscape : false,
                    hideControls : true,
                    corner : "tr"
                };
                var d = this.helpDialog = new wm.PageDialog(props);
            }
            var b = this.helpDialog;
            return b;
        },
        studioProjectChanged : function() {
            this.update();
            this.updateRoles();
        },
        update : function() {
            // 1) reset all inputs.
            // 2) retrieve project Security settings and populate
            // those settings in the Editor.
            this.clearSelectInput(this.secProviderInput);
            this.initSecProviderInput();
            this.initLdapRoleProviderInput(); // added by Girish
            this.databaseOptions = {};
            this.ldapOptions = {};
            this.secEnableInput.setChecked(true);
            this.servicesLayer.setShowing(true);
            this.showLoginPageInput.setChecked(true);
            this.ldapSearchRoleCheckbox.setChecked(false);
            this.ldapSearchRoleCheckboxChange(this.ldapSearchRoleCheckbox);
            this.dbRoleBySQLCheckbox.setChecked(false);
            this.dbRoleBySQLCheckboxChange(this.dbRoleBySQLCheckbox);
            this.ldapRoleBySQLCheckbox.setChecked(false);
            this.ldapRoleBySQLCheckboxChange(this.ldapRoleBySQLCheckbox);
            this.demoUserList.renderData([ {
                userid : "demo",
                password : "demo"
            } ]);
            this.resetDatabaseInputs();
            this.resetLDAPInputs();
            this.populateGeneralOptions();
            this.populateRolesSetup();
        },
        /*
         * TODO: Localize "Demo" and "Database"; challenge: make
         * sure that if the server sends words like "Demo" and
         * "Database" that we don't mess with tests on that
         */
        initSecProviderInput : function() {
            this.secProviderInput.setOptions(this.SELECT_ONE + "," + this.secProviderInput.options);
            this.secProviderInputChange(this.secProviderInput, this.secProviderInput.getDataValue());
        },
        initLdapRoleProviderInput : function() {
            var l = [ this.SELECT_ONE, "LDAP", "Database" ];
            this.updateSelect(this.ldapRoleProviderInput, l);
            this.ldapRoleProviderInput.setDataValue(this.SELECT_ONE);
        },
        updateSelect : function(inSelect, inData) {
            var s = inSelect, o;
            if (inData == null) {
                o = null;
            } else {
                o = inData.join(",");
            }
            s.displayValue = "";
            s.setOptions(o);
        },
        clearSelectInput : function(inSelect) {
            inSelect.beginEditUpdate();
            inSelect.components.options = null;
            inSelect.clear();
            inSelect.endEditUpdate();
        },
        getEditorDisplayValue : function(editor) {
            var v = editor.getDisplayValue();
            return v == this.NO_VALUE ? null : v;
        },
        resetDatabaseInputs : function() {
            this.clearSelectInput(this.dbDataModelInput);
            this.clearSelectInput(this.dbEntityInput);
            this.clearSelectInput(this.dbUsernameInput);
            this.clearSelectInput(this.dbUseridInput);
            this.clearSelectInput(this.dbPasswordInput);
            this.clearSelectInput(this.dbRoleInput);
            // Is this required? Seemed to be working without but
            // added for hygene
            this.clearSelectInput(this.tenantIdField);
            this.defTenantId.clear();
            this.dbRoleBySQLCheckbox.beginEditUpdate();
            this.dbRoleBySQLCheckbox.setChecked(false);
            this.dbRoleBySQLCheckboxChange(this.dbRoleBySQLCheckbox);
            this.dbRoleBySQLCheckbox.endEditUpdate();
            this.dbRoleBySQLInput.clear();
            this.dbTestSQLInput.clear();
            this.dbTestSQLResultList.clear();
            this.dbTestSQLErrorLabel.setCaption("");
        },
        resetLDAPInputs : function() {
            this.ldapUrlInput.setDataValue("ldap://localhost:389/dc=wavemaker,dc=com");
            this.ldapManagerDnInput.setDataValue("cn=manager,dc=wavemaker,dc=com");
            this.ldapManagerPasswordInput.setDataValue("manager");
            this.ldapUserDnPatternInput.setDataValue("cn={0},ou=people");
            this.ldapSearchRoleCheckbox.setChecked(false);
            this.ldapGroupSearchBaseInput.setDataValue("ou=groups");
            this.ldapGroupRoleAttributeInput.setDataValue("cn");
            this.ldapGroupSearchFilterInput.setDataValue("(member={0})");
            this.ldapConnectionResultLabel.setCaption("");
            // Added by Girish
            this.clearSelectInput(this.ldapRoleDbDataModelInput);
            this.clearSelectInput(this.ldapRoleDbEntityInput);
            this.clearSelectInput(this.ldapRoleDbRoleInput);
            this.clearSelectInput(this.ldapRoleDbUsernameInput);
        },
        resetJOSSOInputs : function() {
            // TODO
        },
        secProviderInputChange : function(inSender, inValue) {
            if (inValue == "Demo") {
                this.layers.setLayer("demoLayer");
                this.secEnableInput.setShowing(true);
                this.securityCheckboxChange();
            } else if (inValue == "Database") {
                this.layers.setLayer("databaseLayer");
                // don't call this if the call is originated from
                // getGeneralOptionsResult's
                // secProviderInput event change callback
                if (!this.populatingOptions) {
                    this.getDataModelList();
                }
                this.secEnableInput.setShowing(true);
                this.securityCheckboxChange();
            } else if (inValue == "LDAP") {
                this.layers.setLayer("ldapLayer");
                this.secEnableInput.setShowing(true);
                this.securityCheckboxChange();
                // GD (we need to get the data model list too, since
                // they can use DB to get roles)
                if (!this.populatingOptions) {
                    this.getDataModelList();
                }
            } else if (inValue == "JOSSO") {
                this.layers.setLayer("jossoLayer");
                this.servicesLayer.setShowing(false);
                this.secEnableInput.setShowing(true);
                this.securityCheckboxChange();
            } else {
                this.layers.setLayer("emptyLayer");
                this.secEnableInput.setChecked(false);
                this.servicesLayer.setShowing(false);
                this.securityCheckboxChange();
                this.secEnableInput.setShowing(false);
            }
            this.setDirty();
        },
        populateGeneralOptions : function() {
            studio.securityConfigService.requestSync("getGeneralOptions", null, dojo.hitch(this, "getGeneralOptionsResult"));
        },
        getGeneralOptionsResult : function(inResponse) {
            if (inResponse) {
                this.secEnableInput.setChecked(inResponse.enforceSecurity);
                this.servicesLayer.setShowing(inResponse.enforceSecurity);
                this.showLoginPageInput.setChecked(inResponse.enforceIndexHtml);
                var t = inResponse.dataSourceType;
                this.populatingOptions = true;
                this.secProviderInput.setDataValue(t);
                if (t == "Demo") {
                    this.populateDemoOptions();
                } else if (t == "Database") {
                    this.getDataModelList();
                    this.populateDatabaseOptions();
                } else if (t == "LDAP") {
                    this.populateLDAPOptions();
                } else if (t == "JOSSO") {
                    this.populateJOSSOOptions();
                }
                this.populatingOptions = false;
            } else {
                // set to default
                this.secProviderInput.setDataValue(this.SELECT_ONE);
            }
            this.secProviderInputChange(this.secProviderInput, this.secProviderInput.getDataValue());
        },
        populateJOSSOOptions : function() {
            studio.securityConfigService.requestAsync("getJOSSOOptions", null, dojo.hitch(this, "getJOSSOOptionsResult"));
        },
        getJOSSOOptionsResult : function(inResponse) {
            this.roleList.renderData(inResponse);
        },
        populateDemoOptions : function() {
            studio.securityConfigService.requestSync("getDemoOptions", null, dojo.hitch(this, "getDemoOptionsResult"));
        },
        getDemoOptionsResult : function(inResponse) {
            this.demoUserList.renderData(inResponse.users);
        },
        populateDatabaseOptions : function() {
            studio.securityConfigService.requestSync("getDatabaseOptions", null, dojo.hitch(this, "getDatabaseOptionsResult"));
        },
        getDatabaseOptionsResult : function(inResponse) {
            this.databaseOptions = inResponse;
            this.dbDataModelInput.setDataValue(inResponse.modelName);
            this.dbDataModelInput.changed();
        },
        populateLDAPOptions : function() {
            studio.securityConfigService.requestSync("getLDAPOptions", null, dojo.hitch(this, "getLDAPOptionsResult"));
        },
        getLDAPOptionsResult : function(inResponse) {
            this.ldapOptions = inResponse;
            this.ldapUrlInput.setDataValue(inResponse.ldapUrl);
            this.ldapManagerDnInput.setDataValue(inResponse.managerDn);
            this.ldapManagerPasswordInput.setDataValue(inResponse.managerPassword);
            this.ldapUserDnPatternInput.setDataValue(inResponse.userDnPattern);
            this.ldapSearchRoleCheckbox.setChecked(!inResponse.groupSearchDisabled);
            this.ldapGroupSearchBaseInput.setDataValue(inResponse.groupSearchBase);
            this.ldapGroupRoleAttributeInput.setDataValue(inResponse.groupRoleAttribute);
            this.ldapGroupSearchFilterInput.setDataValue(inResponse.groupSearchFilter);
            this.ldapRoleProviderInput.setDataValue(inResponse.roleProvider);
            this.ldapRoleDbDataModelInput.setDataValue(inResponse.roleModel);
            this.ldapRoleBySQLCheckbox.setChecked(inResponse.roleQuery);
            this.ldapRoleBySQLInput.setDataValue(inResponse.roleQuery);
            this.ldapRoleDbEntityInput.setDataValue(inResponse.roleEntity);
            this.ldapRoleDbEntityInputChange();
        },
        saveButtonClick : function(inSender) {
            studio.saveAll(this);
        },
        toastToSuccess : function() {
            this.onSaveSuccess();
        },
        saveError : function(inError) {
            studio._saveErrors.push({
                owner : this,
                message : inError.message
            });
            this.saveComplete();
        },
        configDemoResult : function(inResponse) {
            this.updateStudioServices();
            this.toastToSuccess();
        },
        configDatabaseResult : function(inResponse) {
            this.updateStudioServices();
            this.toastToSuccess();
        },
        configLDAPResult : function(inResponse) {
            this.updateStudioServices();
            this.toastToSuccess();
        },
        configJOSSOResult : function(inResponse) {
            this.updateStudioServices();
            this.toastToSuccess();
        },
        updateStudioServices : function() {
            studio.updateServices();
        },
        checkErrorOnInputFields : function(dataSourceType) {
            if (!this.secEnableInput.getChecked())
                return err;
            var err = null;
            if (dataSourceType == "Demo") {
                if (this.demoUserList._data == null || this.demoUserList._data.length == 0) {
                    err = this.getDictionaryItem("ERROR_DEMO_NO_USER")
                }
            } else if (dataSourceType == "Database") {
                if (!(this.dbDataModelInput.getDataValue() && this.dbEntityInput.getDataValue() && this.getEditorDisplayValue(this.dbUsernameInput) && this.getEditorDisplayValue(this.dbUseridInput) && this
                        .getEditorDisplayValue(this.dbPasswordInput))) {
                    err = this.getDictionaryItem("ERROR_DATABASE_INPUT_REQUIRED");
                }
            } else if (dataSourceType == "LDAP") {
                if (!(this.ldapUrlInput.getDataValue() && this.ldapUserDnPatternInput.getDataValue())) {
                    err = this.getDictionaryItem("ERROR_LDAP_INPUT_REQUIRED");
                }
            } else if (dataSourceType == "JOSSO") {
                // To do
            }
            return err;
        },
        demoAddUserButtonClick : function(inSender) {
            var userid = this.demoUsernameInput.getDataValue();
            if (userid) {
                userid = dojo.trim(userid);
            }
            var password = this.demoPasswordInput.getDataValue();
            if (password) {
                password = dojo.trim(password);
            }
            var role = this.demoRoleInput.getDataValue();
            if (role) {
                role = dojo.trim(role);
            }
            if (userid && password) {
                var d = this.demoUserList._data;
                if (d == null) {
                    d = [];
                }
                for ( var i = 0; i < d.length; i++) {
                    if (d[i] && d[i].userid == userid) {
                        app.alert(this.getDictionaryItem("ALERT_USERNAME_EXISTS"));
                        return;
                    }
                }
                if (role) {
                    d.push({
                        userid : userid,
                        password : password,
                        roles : [ role ]
                    });
                } else {
                    d.push({
                        userid : userid,
                        password : password,
                        roles : null
                    });
                }
                this.demoUserList.renderData(d);
                this.demoUsernameInput.clear();
                this.demoPasswordInput.clear();
                this.demoRoleInput.clear();
                this.setDirty();
            } else {
                app.alert(this.getDictionaryItem("ALERT_USER_INPUT_REQUIRED"));
            }
        },
        demoDeleteUserButtonClick : function(inSender) {
            if (this.demoUserList.selected) {
                var d = this.demoUserList._data;
                var nd = [];
                for ( var i = 0; i < d.length; i++) {
                    if (i != this.demoUserList.selected.index) {
                        nd.push(d[i]);
                    }
                }
                this.demoUserList.renderData(nd);
                this.setDirty();
            }
        },
        dbDataModelInputChange : function(inSender, inValue) {
            this.getTableList("db");
            this.setDirty();
        },
        ldapRoleDbDataModelInputChange : function(inSender, inValue) {
            this.getTableList("ldap");
            this.setDirty();
        },
        dbEntityInputChange : function(inSender, inValue) {
            this.getPropertyList("db");
            this.setDirty();
        },
        ldapRoleDbEntityInputChange : function(inSender, inValue) {
            this.getPropertyList("ldap");
            this.setDirty();
        },
        getDataModelList : function() {
            studio.dataService.requestSync("getDataModelNames", null, dojo.hitch(this, "getDataModelListResult"));
        },
        getDataModelListResult : function(inResponse) {
            if (inResponse) {
                var t = this.dbEntityInput.getDataValue();
                if (t) {
                    this.databaseOptions.entityName = t;
                }
                this.updateSelect(this.dbDataModelInput, inResponse);
                // GD: Populate the data models for LDAP/DB
                // Security/Role as well
                this.updateSelect(this.ldapRoleDbDataModelInput, inResponse);
            }
        },
        getTableList : function(inType) {
            // Refer to the right select box to get list of tables
            // in that data model
            if (inType == "db") {
                var d = this.dbDataModelInput.getDataValue();
            } else {
                var d = this.ldapRoleDbDataModelInput.getDataValue();
            }
            if (d) {
                var scope = this;
                studio.dataService.requestSync("getEntityNames", [ d ], function(inResponse) {
                    scope.getTableListResult(inResponse, inType)
                });
            } else {
                // null out the right entityInput (could be DB or
                // LDAP)
                if (inType == "db") {
                    this.updateSelect(this.dbEntityInput, null);
                } else if (inType == "ldap") {
                    this.updateSelect(this.ldapRoleDbEntityInput, null);
                }
            }
        },
        getTableListResult : function(inResponse, inType) {
            if (inResponse) {
                if (inType == "db") {
                    this.updateSelect(this.dbEntityInput, inResponse);
                    this.dbEntityInput.setDataValue(this.databaseOptions.entityName);
                } else if (inType == "ldap") {
                    this.updateSelect(this.ldapRoleDbEntityInput, inResponse);
                    this.ldapRoleDbEntityInput.setDataValue(this.ldapOptions.roleEntity);
                }
            }
        },
        getPropertyList : function(inType) {
            if (inType == "db") {
                var d = this.dbDataModelInput.getDataValue();
                var t = this.dbEntityInput.getDataValue();
            } else if (inType == "ldap") {
                var d = this.ldapRoleDbDataModelInput.getDataValue();
                var t = this.ldapRoleDbEntityInput.getDataValue();
            }
            if (d && t) {
                var scope = this;
                studio.securityConfigService.requestSync("getDatabaseProperties", [ d, t ], function(inResponse) {
                    scope.getDatabasePropertiesResult(inResponse, inType)
                });
            } else {
                if (inType == "db") {
                    this.updateSelect(this.dbUsernameInput, null);
                    this.updateSelect(this.dbUseridInput, null);
                    this.updateSelect(this.dbPasswordInput, null);
                    this.updateSelect(this.dbRoleInput, null);
                } else if (inType == "ldap") {
                    this.updateSelect(this.ldapRoleDbRoleInput, null);
                    this.updateSelect(this.ldapRoleDbUsernameInput, null);
                }
            }
        },
        getDatabasePropertiesResult : function(inResponse, inType) {
            if (inResponse) {
                var pnames = [];
                for ( var i = 0, p; p = inResponse[i]; i++) {
                    if (p.compositeProperties && p.compositeProperties.length > 0) {
                        for ( var j = 0, cp; cp = p.compositeProperties[j]; j++) {
                            pnames.push(cp.name);
                        }
                    } else {
                        pnames.push(p.name);
                    }
                }
                pnames.push(this.NO_VALUE);
                // GD: Lot of stuff going on here which is only
                // applicable to when Database security is being
                // used
                // For LDAP security with DB roles, it's slightly
                // different..hence the if/else
                if (inType == "db") {
                    var u = this.getEditorDisplayValue(this.dbUsernameInput);
                    var id = this.getEditorDisplayValue(this.dbUseridInput);
                    var p = this.getEditorDisplayValue(this.dbPasswordInput);
                    var r = this.getEditorDisplayValue(this.dbRoleInput);
                    var tid = this.getEditorDisplayValue(this.tenantIdField);
                    if (u) {
                        this.databaseOptions.unamePropertyName = u;
                    }
                    if (id) {
                        this.databaseOptions.uidPropertyName = id;
                    }
                    if (p) {
                        this.databaseOptions.pwPropertyName = p;
                    }
                    if (r) {
                        this.databaseOptions.rolePropertyName = r;
                    }
                    if (tid) {
                        this.databaseOptions.tenantIdField = tid;
                    }
                    this.updateSelect(this.dbUsernameInput, pnames);
                    this.updateSelect(this.dbUseridInput, pnames);
                    this.updateSelect(this.dbPasswordInput, pnames);
                    this.updateSelect(this.dbRoleInput, pnames);
                    this.updateSelect(this.tenantIdField, pnames);
                    this.dbUsernameInput.setDataValue(this.databaseOptions.unamePropertyName);
                    this.dbUseridInput.setDataValue(this.databaseOptions.uidPropertyName);
                    // TODO this pwColumnName is causing an error
                    // sometimes cause it's trying to do a replace
                    // on a null value. Need to find out more about
                    // this
                    // GD: Inserting a temporary try/catch to
                    // gracefully catch the error and carry on
                    try {
                        this.dbPasswordInput.setDataValue(this.databaseOptions.pwPropertyName || this.databaseOptions.pwColumnName.replace(/,.*$/, ""));
                    } catch (e) {
                        console.error("Error while trying to set dbPasswordInput: " + e);
                    }
                    this.dbRoleInput.setDataValue(this.databaseOptions.rolePropertyName);
                    this.tenantIdField.setDataValue(this.databaseOptions.tenantIdField); // xxx
                    this.defTenantId.setDataValue(this.databaseOptions.defTenantId || ""); // xxx
                    this.dbRoleBySQLCheckbox.setChecked(this.databaseOptions.useRolesQuery);
                    this.dbRoleBySQLCheckboxChange(this.dbRoleBySQLCheckbox);
                    if (this.databaseOptions.rolesByUsernameQuery) {
                        this.dbRoleBySQLInput.setDataValue(this.databaseOptions.rolesByUsernameQuery);
                    }
                } else if (inType == "ldap") {
                    var r = this.getEditorDisplayValue(this.ldapRoleDbRoleInput);
                    var u = this.getEditorDisplayValue(this.ldapRoleDbUsernameInput);
                    if (r) {
                        this.ldapOptions.roleProperty = r;
                    }
                    if (u) {
                        this.ldapOptions.usernameProperty = u;
                    }
                    this.updateSelect(this.ldapRoleDbRoleInput, pnames);
                    this.updateSelect(this.ldapRoleDbUsernameInput, pnames);
                    this.ldapRoleDbRoleInput.setDataValue(this.ldapOptions.roleProperty);
                    this.ldapRoleDbUsernameInput.setDataValue(this.ldapOptions.roleUsername);
                }
            }
        },
        dbRoleBySQLCheckboxChange : function(inSender, inDisplayValue, inDataValue) {
            var c = inSender.getChecked();
            this.dbRoleInput.setDisabled(c);
            this.dbRoleBySQLInput.setShowing(c);
            this.dbRoleBySQLEnablePanel.setShowing(c);
            this.setDirty();
        },
        ldapRoleBySQLCheckboxChange : function(inSender, inDisplayValue, inDataValue) {
            var c = inSender.getChecked();
            this.ldapRoleDbRoleInput.setDisabled(c);
            this.ldapRoleBySQLInput.setShowing(c);
            this.ldapRoleBySQLEnablePanel.setShowing(c);
            this.setDirty();
        },

        dbTestSQLButtonClick : function(inSender) {
            studio.beginWait(this.getDictionaryItem("WAIT_TEST_SQL"));
            studio.securityConfigService.requestAsync("testRolesByUsernameQuery", [ this.dbDataModelInput.getDataValue(), this.dbRoleBySQLInput.getDataValue(), this.dbTestSQLInput.getDataValue() ], dojo.hitch(this,
                    "testRolesByUsernameQueryResult"), dojo.hitch(this, "testRolesByUsernameQueryError"));

        },
        testRolesByUsernameQueryResult : function(inResponse) {
            studio.endWait();
            this.dbTestSQLErrorPanel.hide();
            this.dbTestSQLErrorLabel.setCaption("");
            this.dbTestSQLResultList.renderData(inResponse);
            this.dbTestSQLResultListPanel.show();
        },
        testRolesByUsernameQueryError : function(inResponse) {
            studio.endWait();
            this.dbTestSQLResultList.renderData([]);
            this.dbTestSQLResultListPanel.hide();
            this.dbTestSQLErrorLabel.setCaption(inResponse.message);
            this.dbTestSQLErrorPanel.show();
        },
        ldapSearchRoleCheckboxChange : function(inSender, inDisplayValue, inDataValue) {
            var c = inSender.getChecked();
            this.ldapRoleProviderInput.setShowing(c);
            if (!c) {
                this.ldapRoleProviderInput.setDataValue(this.SELECT_ONE);
            }
            var ldapRoleProvider = this.ldapRoleProviderInput.getDataValue();
            this.setDirty();
        },
        ldapRoleProviderInputChange : function(inSender, inDisplayValue, inDataValue) {
            this.ldapRoleLdapPanel.setShowing(inDataValue == "LDAP");
            this.ldapRoleDBPanel.setShowing(inDataValue == "Database");
        },
        ldapConnectionButtonClick : function(inSender) {
            studio.beginWait(this.getDictionaryItem("WAIT_TEST_LDAP"));
            studio.securityConfigService.requestAsync("testLDAPConnection", [ this.ldapUrlInput.getDataValue(), this.ldapManagerDnInput.getDataValue(), this.ldapManagerPasswordInput.getDataValue() ], dojo.hitch(this,
                    "testLDAPConnectionResult"), dojo.hitch(this, "testLDAPConnectionError"));
        },
        testLDAPConnectionResult : function(inResponse) {
            studio.endWait();
            this.ldapConnectionResultLabel.domNode.style.color = "";
            this.ldapConnectionResultLabel.setCaption(this.getDictionaryItem("TEST_LDAP_MESSAGE_SUCCESS"));
        },
        testLDAPConnectionError : function(inError) {
            studio.endWait();
            this.ldapConnectionResultLabel.domNode.style.color = "red";
            this.ldapConnectionResultLabel.setCaption(inError.message);
        },
        addRoleButtonClick : function(inSender) {
            var role = this.addRoleInput.getDataValue();
            if (role) {
                role = dojo.trim(role);
            }
            if (role) {
                var d = this.roleList._data;
                if (d == null) {
                    d = [];
                }
                for ( var i = 0; i < d.length; i++) {
                    if (typeof (d[i]) == "string" ? d[i] == role : d[i].role == role) {
                        app.alert(this.getDictionaryItem("ALERT_ROLE_EXISTS"));
                        return;
                    }
                }
                if (d.length && this.isJOSSO()) {
                    app.alert(this.getDictionaryItem("ALERT_JOSSO_ONLY_ONE_ROLE"));
                    return;
                }
                d.push(role);

                this.roleList.renderData(d);
                this.updateSelect(this.demoRoleInput, d);
                this.addRoleInput.clear();
                this.addRoleInput.focus();
                this.setDirty();
            } else {
                app.alert(this.getDictionaryItem("ALERT_ROLE_EMPTY"));
            }
        },
        deleteRoleButtonClick : function(inSender) {
            if (this.roleList.selected) {
                var d = this.roleList._data;
                var nd = [];
                var deletedIndex = -1;
                for ( var i = 0; i < d.length; i++) {
                    if (i != this.roleList.selected.index) {
                        nd.push(d[i]);
                    } else
                        deletedIndex = i;

                }
                this.roleList.renderData(nd);
                this.updateSelect(this.demoRoleInput, nd);
                this.setDirty();
                if (this.roleList._data.length > deletedIndex)
                    this.roleList.selectByIndex(deletedIndex);
            }
        },
        populateRolesSetup : function() {
            studio.securityConfigService.requestAsync("getRoles", this.isJOSSO(), dojo.hitch(this, "getRolesResult"));
        },
        getRolesResult : function(inResponse) {
            this.roleList.renderData(inResponse);
            this.updateSelect(this.demoRoleInput, inResponse);
            this._cachedData = this.getCachedData();// at this point
                                                    // we've
                                                    // finished
                                                    // initializingt
                                                    // security page
        },
        saveRolesSetup : function() {
            if (this.isJOSSO())
                studio.securityConfigService.requestAsync("setJOSSORoles", [ this.roleList._data ], dojo.hitch(this, "setRolesResult"));
            else
                studio.securityConfigService.requestAsync("setRoles", [ this.roleList._data ], dojo.hitch(this, "setRolesResult"));
        },
        setRolesResult : function() {
            wm.roles = this.roleList._data || [];
        },
        copyLoginFiles : function() {
            if (this.isJOSSO()) {
                if (!webFileExists("login-redirect.jsp")) {
                    var loginhtml = "<%--\n  ~ JOSSO: Java Open Single Sign-On\n  ~\n  ~ Copyright 2004-2009, Atricore, Inc.\n  ~\n  ~ This is free software; you can redistribute it and/or modify it\n  ~ under the terms of the GNU Lesser General Public License as\n  ~ published by the Free Software Foundation; either version 2.1 of  \n~ the License, or (at your option) any later version.  \n~  \n~ This software is distributed in the hope that it will be useful,  \n~ but WITHOUT ANY WARRANTY; without even the implied warranty of  \n~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU  \n~ Lesser General Public License for more details.  \n~  ~ You should have received a copy of the GNU Lesser General Public  \n~ License along with this software; if not, write to the Free  \n~ Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  \n~ 02110-1301 USA, or see the FSF site: http://www.fsf.org.  \n~  \n--%>\n\n<%@page contentType=\"text/html; charset=UTF-8\" language=\"java\" session=\"true\" %>\n<%\n response.sendRedirect(request.getContextPath() + \"/josso_login/\");\n%>";
                    studio.project.saveProjectData("login-redirect.jsp", loginhtml);
                }
            } else {
                if (!webFileExists("login.html")) {
                    var loginhtml = loadDataSync(this.loginTemplateFolder + "login.html");
                    studio.project.saveProjectData("login.html", wm.makeLoginHtml(loginhtml, studio.project.projectName));
                }
                if (!webFileExists(wm.pagesFolder + "Login/Login.js")) {
                    var loginPageCss = loadDataSync(this.loginPageTemplateFolder + "Login.css");
                    var loginPageHtml = loadDataSync(this.loginPageTemplateFolder + "Login.html");
                    var loginPageJs = loadDataSync(this.loginPageTemplateFolder + "Login.js");
                    var loginPageWidgetsJs = loadDataSync(this.loginPageTemplateFolder + "Login.widgets.js");
                    /* WM-3071: Stupid windows/FF4+ only fix */
                    var regEx = new RegExp(String.fromCharCode(13), "g")
                    loginPageJs = loginPageJs.replace(regEx, "");
                    var n = wm.pagesFolder + "Login/Login";
                    studio.project.saveProjectData(n + ".css", loginPageCss);
                    studio.project.saveProjectData(n + ".html", loginPageHtml);
                    studio.project.saveProjectData(n + ".js", loginPageJs);
                    studio.project.saveProjectData(n + ".widgets.js", loginPageWidgetsJs);
                    studio.project.updatePageList(); // sync
                                                        // request
                    studio.project.pagesChanged();
                }
            }
        },

        demoUserListFormat : function(inSender, ioData, inColumn, inData, inHeader) {
            if (inHeader) {
                if (inColumn == 0) {
                    ioData.data = "<div>" + this.getDictionaryItem("DEMO_USER_USERNAME") + "</div>";
                } else if (inColumn == 1) {
                    ioData.data = "<div>" + this.getDictionaryItem("DEMO_USER_PASSWORD") + "</div>"
                } else if (inColumn == 2) {
                    ioData.data = "<div>" + this.getDictionaryItem("DEMO_USER_ROLE") + "</div>"
                }
            }
        },
        updateRoles : function() {
            studio.securityConfigService.requestSync("getRoles", this.isJOSSO(), dojo.hitch(this, "getRolesUpdateResult"));
        },
        getRolesUpdateResult : function(inData) {
            wm.roles = inData || [];
        },
        showJossoLayer : function() {
            this.secEnableInput.setChecked(true);
            this.servicesLayer.setShowing(false);
            this.securityCheckboxChange();

            var roles = this.roleList._data;
            if (roles && roles.length) {
                this.roleList._render();
            }
        },
        showDemoLayer : function() {
            this.secEnableInput.setDisabled(false);
            this.showLoginPageInput.setShowing(true);
        },
        showDBLayer : function() {
            this.secEnableInput.setDisabled(false);
            this.showLoginPageInput.setShowing(true);
        },
        showLDAPLayer : function() {
            this.secEnableInput.setDisabled(false);
            this.showLoginPageInput.setShowing(true);
        },
        securityCheckboxChange : function() {
            var enabled = this.secEnableInput.getChecked();
            this.servicesLayer.setShowing(enabled);
            this.showLoginPageInput.setShowing(enabled);
            this.panel4a.setShowing(enabled);
            this.panelBottom.setShowing(enabled);
            this.panelBottom.setShowing(enabled);
            if (this.isJOSSO())
                this.showLoginPageInput.setShowing(false);
            this.setDirty();
        },
        isJOSSO : function() {
            return this.secProviderInput.getDataValue() == "JOSSO";
        },
        getCachedData : function() {
            var rolesQuery = null;
            if (this.dbRoleBySQLCheckbox.getChecked()) {
                rolesQuery = this.dbRoleBySQLInput.getDataValue();
            }
            var result = [ dojo.toJson(this.demoUserList._data), dojo.toJson(this.roleList._data), this.secProviderInput.getDataValue(), this.secEnableInput.getChecked(), this.showLoginPageInput.getChecked(),
                    this.dbRoleBySQLCheckbox.getChecked(), this.dbDataModelInput.getDataValue(), this.dbEntityInput.getDataValue(), this.getEditorDisplayValue(this.dbUsernameInput),
                    this.getEditorDisplayValue(this.dbUseridInput), this.getEditorDisplayValue(this.dbPasswordInput), this.getEditorDisplayValue(this.dbRoleInput), this.getEditorDisplayValue(this.tenantIdField) || "",
                    this.defTenantId.getDataValue() || 0, rolesQuery, this.ldapUrlInput.getDataValue(), this.ldapManagerDnInput.getDataValue(), this.ldapManagerPasswordInput.getDataValue(),
                    this.ldapUserDnPatternInput.getDataValue(), !this.ldapSearchRoleCheckbox.getChecked(), this.ldapGroupSearchBaseInput.getDataValue(), this.ldapGroupRoleAttributeInput.getDataValue(),
                    this.ldapGroupSearchFilterInput.getDataValue(), dojo.toJson(this.varServList.getData()) ];
            return result.join("|");
        },

        dirty : false,
        setDirty : function() {
            wm.job(this.getRuntimeId() + "_hasChanged", 500, dojo.hitch(this, function() {
                if (this.isDestroyed)
                    return;
                var changed = this._cachedData != this.getCachedData();
                var caption = (!changed ? "" : "<img class='StudioDirtyIcon'  src='images/blank.gif' /> ") + studio.getDictionaryItem("wm.Security.TAB_CAPTION");
                this.dirty = changed;

                if (caption != this.owner.parent.caption) {
                    this.owner.parent.setCaption(caption);
                    studio.updateServicesDirtyTabIndicators();
                }
            }));
        },

        /*
         * getDirty, save, saveComplete are all common methods all
         * services should provide so that studio can interact with
         * them
         */
        getDirty : function() {
            return this.dirty;
        },
        save : function() {
            if (this.secProviderInput.getDataValue() == this.SELECT_ONE) {
                this.saveError({
                    owner : this,
                    message : this.getDictionaryItem("ALERT_NO_SECURITY_PROVIDER")
                });
                return;
            }
            if (this.ldapSearchRoleCheckbox.getChecked() === true && this.ldapRoleProviderInput.getDataValue() === null) {
                this.saveError({
                    owner : this,
                    message : this.getDictionaryItem("ALERT_NO_ROLE_PROVIDER")
                });
                return;
            }
            if (this.secProviderInput.getDataValue() == this.SELECT_ONE) {
                return;
            }
            /*
             * Localization changes the caption, so get the english
             * version of the caption from the layer name so that we
             * don't have to change all code to use layer name
             * instead of caption
             */
            var t = this.layers.getLayer().name;
            switch (t) {
            case "demoLayer":
                t = "Demo";
                break;
            case "emptyLayer":
                t = "Empty";
                break;
            case "databaseLayer":
                t = "Database";
                break;
            case "ldapLayer":
                t = "LDAP";
                break;
            case "jossoLayer":
                t = "JOSSO";
                break;
            }
            var err = this.checkErrorOnInputFields(t)
            if (err) {
                studio._saveErrors.push({
                    owner : this,
                    message : err
                });
                this.saveComplete();
            } else {
                this.copyLoginFiles();
                wm.onidle(this, function() {
                    if (t == "Demo") {
                        studio.securityConfigService.requestSync("configDemo", [ this.demoUserList._data, this.secEnableInput.getChecked(), this.showLoginPageInput.getChecked() ], dojo.hitch(this, "configDemoResult"), dojo
                                .hitch(this, "saveError"));

                    } else if (t == "Database") {
                        var rolesQuery = null;
                        if (this.dbRoleBySQLCheckbox.getChecked()) {
                            rolesQuery = this.dbRoleBySQLInput.getDataValue();
                        }
                        studio.securityConfigService.requestSync("configDatabase", [ this.dbDataModelInput.getDataValue(), this.dbEntityInput.getDataValue(), this.getEditorDisplayValue(this.dbUsernameInput),
                                this.getEditorDisplayValue(this.dbUseridInput), this.getEditorDisplayValue(this.dbPasswordInput), this.getEditorDisplayValue(this.dbRoleInput),
                                this.getEditorDisplayValue(this.tenantIdField) || "", this.defTenantId.getDataValue() || 0, rolesQuery, this.secEnableInput.getChecked(), this.showLoginPageInput.getChecked() ], dojo.hitch(this,
                                "configDatabaseResult"), dojo.hitch(this, "saveError"));

                    } else if (t == "LDAP") {
                        var rolesQuery = null;
                        if (this.ldapRoleBySQLCheckbox.getChecked()) {
                            rolesQuery = this.ldapRoleBySQLInput.getDataValue();
                        }
                        studio.securityConfigService.requestSync("configLDAP", [ this.ldapUrlInput.getDataValue(), this.ldapManagerDnInput.getDataValue(), this.ldapManagerPasswordInput.getDataValue(),
                                this.ldapUserDnPatternInput.getDataValue(), !this.ldapSearchRoleCheckbox.getChecked(), this.ldapGroupSearchBaseInput.getDataValue(), this.ldapGroupRoleAttributeInput.getDataValue(),
                                this.ldapGroupSearchFilterInput.getDataValue(),
                                // Added by Girish
                                this.ldapRoleDbDataModelInput.getDataValue(), this.ldapRoleDbEntityInput.getDataValue(), this.ldapRoleDbUsernameInput.getDataValue(), this.ldapRoleDbRoleInput.getDataValue(), rolesQuery,
                                this.ldapRoleProviderInput.getDataValue(), this.secEnableInput.getChecked(), this.showLoginPageInput.getChecked() ], dojo.hitch(this, "configLDAPResult"), dojo.hitch(this, "saveError"));
                    } else if (t == "JOSSO") {
                        var roles = this.roleList._data;
                        studio.securityConfigService.requestSync("configJOSSO", [ this.secEnableInput.getChecked(), roles[0] ], dojo.hitch(this, "configJOSSOResult"));
                        studio.application.loadServerComponents();
                        studio.refreshServiceTree();
                        return;
                    }
                    this.saveRolesSetup();
                    this.saveServicesSetup();
                    studio.application.loadServerComponents();
                    studio.refreshServiceTree();
                });
            }

        },
        saveComplete : function() {
        },
        onSaveSuccess : function() {
            this._cachedData = this.getCachedData();
            this.setDirty();
            this.saveComplete();
        },
        getProgressIncrement : function() {
            return 5; // 1 tick is very fast; this is 5 times
                        // slower than that
        },

        setupServicesLayer : function() {
            try {
                var success = true;
                studio.securityConfigService.requestSync("getSecurityFilterODS", null, dojo.hitch(this, "getSecurityFilterODSResult"), dojo.hitch(this, function(inError) {
                    this._urlMap = [];
                }));
                /* Get the role list */
                var d = this.roleList._data;
                if (d == null) {
                    d = [];
                }
                var data = [ {
                    name : this.getDictionaryItem("SERVICE_DEFAULT_SETTING"),
                    dataValue : ""
                }, {
                    name : this.getDictionaryItem("SERVICE_ANONYMOUS_USERS"),
                    dataValue : "IS_AUTHENTICATED_ANONYMOUSLY"
                }, {
                    name : this.getDictionaryItem("SERVICE_AUTHENTICATED_USERS"),
                    dataValue : "IS_AUTHENTICATED_FULLY"
                } ];
                for ( var i = 0; i < d.length; i++) {
                    data.push({
                        name : d[i],
                        dataValue : "ROLE_" + d[i]
                    });
                }
                this.varRoleList.setData(data);

                /* Get the service list and generate */
                var attributes = this.findServiceSecurityForService("runtimeService");
                var serviceList = [ {
                    name : this.getDictionaryItem("SERVICE_DATABASE_SERVICES_NAME"),
                    URL : "/runtimeservice.json",
                    attributes : attributes,
                    Settings : this.getAttributesDisplay(attributes)
                } ];

                studio.tree.forEachNode(dojo.hitch(this, function(node) {
                    if (node.component instanceof wm.ServerComponent && node.component instanceof wm.DataModel == false && node.component instanceof wm.Security == false) {
                        var attributes = this.findServiceSecurityForService(node.component.name)
                        serviceList.push({
                            name : node.component.name,
                            URL : "/" + wm.decapitalize(node.component.name) + ".json",
                            attributes : attributes,
                            Settings : this.getAttributesDisplay(attributes)
                        });
                    }
                    // Entries not in Services tree were not put in
                    // the serviceList
                }));
                this.varServList.setData(serviceList);

            } catch (e) {
                console.error('ERROR IN setupServicesLayer: ' + e);
            }
        },
        servicesLayerShow : function(inSender) {
            this.setupServicesLayer();
            this.serviceListSelect(this.serviceList);
        },
        serviceListSelect : function(inSender) {
            var selectedData = inSender.selectedItem.getData();
            if (selectedData) {
                this.servicesSettingsPanel.show();
                this.servicesInnerHeader.setCaption(this.getDictionaryItem("SERVICE_TITLE_AND_NAME", {
                    serviceName : selectedData.name
                }));
            } else {
                this.servicesInnerHeader.setCaption(this.getDictionaryItem("SERVICE_TITLE"));
                this.servicesSettingsPanel.hide();
            }
        },
        getSecurityFilterODSResult : function(inResponse) {
            this._urlMap = dojo.clone(inResponse);
            this.varUrlMap.setData(inResponse);
        },
        etAttributesDisplay : function(inAttribute) {
            if (!inAttribute)
                inAttribute = "";
            var data = this.varRoleList.getData();
            for ( var i = 0; i < data.length; i++) {
                if (data[i].dataValue == inAttribute)
                    return data[i].name;
            }
        },
        findServiceSecurityForService : function(inName) {
            inName = inName.toLowerCase();
            for ( var i = 0; i < this._urlMap.length; i++) {
                var str = this._urlMap[i];
                var realName;
                if (str.URL.indexOf("/") == 0 && str.URL.match(/\.(json|download|upload)$/)) {
                    realName = str.URL.substring(1, str.URL.indexOf("."));
                }
                if (realName == inName) {
                    return str.attributes;
                }
            }
        },

        /*
         * When the settings are changed, update the data in
         * varServList; varServList should 1. Store all data we read
         * from the server 2. Store all changes to the data we read
         * from the server 3. Be used to generate the data we write
         * back to the server
         */
        serviceSettingsChange : function(inSender) {
            var value = inSender.getDataValue();
            var index = this.serviceList.getSelectedIndex();
            if (index >= 0) {
                var oldValue = this.serviceList.dataSet.getItem(index).getValue("attributes");
                if (oldValue != value) {
                    this.serviceList.dataSet.getItem(index).setValue("attributes", value);
                    this.serviceList.dataSet.getItem(index).setValue("Settings", this.getAttributesDisplay(value));
                    this.serviceList.selectByIndex(index);
                    this.setDirty();
                }
            }
        },
        saveServicesSetup : function() {
            /* TODO: Remove from submission any "DEFAULT" values */
            
            // don't use the name as it will be localized
            var databaseServiceURL = "/runtimeservice.json"; 
            var data = this.varServList.getData();
            var sendData = [];
            var databaseAttributes = "";

            /*
             * This block determines the logic for setting //
             * /*.json security (default security)
             */
            var starAttributes;
            if (!this.secEnableInput.getChecked()) {
                starAttributes = "IS_AUTHENTICATED_ANONYMOUSLY";
            } else if (!this.showLoginPageInput.getChecked()) {
                starAttributes = "IS_AUTHENTICATED_FULLY";
            } else {
                starAttributes = "IS_AUTHENTICATED_FULLY";
            }

            for ( var i = 0; i < data.length; i++) {
                if (data[i].attributes) {
                    sendData.push(data[i].URL + ":" + data[i].attributes);
                    if (data[i].URL == databaseServiceURL) {
                        databaseAttributes = data[i].attributes;
                    }
                }
            }
            if (databaseAttributes) {
                var components = studio.application.getServerComponents();
                for ( var i = 0; i < components.length; i++) {
                    if (components[i] instanceof wm.DataModel) {
                        sendData.push("/" + components[i].name + ".json:" + databaseAttributes);
                    }
                }
            }
            // this._urlMap contains non displayed entries

            sendData.push("/*.json:" + starAttributes);
            sendData.push("/*.upload:" + starAttributes);
            sendData.push("/*.download:" + starAttributes);

            studio.securityConfigService.requestSync("setSecurityFilterODS", [ sendData, this.secEnableInput.getChecked(), this.showLoginPageInput.getChecked() ], dojo.hitch(this, "saveServicesSetupSuccess"), dojo.hitch(this,
                    "saveServicesSetupError"));
        },
        saveServicesSetupSuccess : function() {
        },
        saveServicesSetupError : function(inError) {
            studio._saveErrors.push({
                owner : this,
                message : inError.message
            });
        },
        listURLMapSelect : function(inSender) {
            this.buttonDelRule.setDisabled(false);
        },
        listURLMapDeselect : function(inSender) {
            this.buttonDelRule.setDisabled(true);
        },
        // Make SecurityURLMap type available to studio
        // Cleanup required ?
        _setDataTypes : function() {
            if (!wm.typeManager.types["com.wavemaker.studio.SecurityServiceMap"]) {
                wm.typeManager.addType("com.wavemaker.studio.SecurityServiceMap", {
                    internal : true,
                    fields : {
                        URL : {
                            type : "java.lang.String",
                            isObject : false,
                            isList : false
                        },
                        name : {
                            type : "java.lang.String",
                            isObject : false,
                            isList : false
                        },
                        attributes : {
                            type : "java.lang.String",
                            isObject : false,
                            isList : false
                        },
                        Settings : {
                            type : "java.lang.String",
                            isObject : false,
                            isList : false
                        }
                    }
                });
            }
            if (!wm.typeManager.types["com.wavemaker.studio.SecurityConfigService$SecurityURLMap"]) {
                wm.typeManager.addType("com.wavemaker.studio.SecurityConfigService$SecurityURLMap", {
                    internal : true,
                    fields : {
                        URL : {
                            type : "java.lang.String",
                            isObject : false,
                            isList : false
                        },
                        attributes : {
                            type : "java.lang.String",
                            isObject : false,
                            isList : false
                        }
                    }
                });
            }

        },
        _end : 0
    });
