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
dojo.provide("wm.studio.pages.Security.Security");

dojo.declare("Security", wm.Page, {
	start: function() {
	    this.SELECT_ONE = this.getDictionaryItem("MENU_SELECT_ONE");
	    this.NO_VALUE   = this.getDictionaryItem("MENU_NO_VALUE");
		this.loginTemplateFolder = dojo.moduleUrl("wm.studio.app") + "templates/security/";
		this.loginPageTemplateFolder = this.loginTemplateFolder + "pages/Login/";
		this.populatingOptions = false;
		this.subscribe("wm-project-changed", this, "studioProjectChanged");
		this.update();
		dojo.connect(dojo.byId("HelpUID1"), "onclick", this, "showUIDHelp1");
		dojo.connect(dojo.byId("HelpUID2"), "onclick", this, "showUIDHelp2");
	},

	showUIDHelp1: function() {
	    var bd = this.getHelpDialog();
	    bd.page.setHeader("",this.getDictionaryItem("HELP_DIALOG_HEADER_USERNAME"));
	    bd.sourceNode = this.databaseLayer.domNode;
	    bd.page.setContent(this.getDictionaryItem("HELP_DIALOG_CONTENT_USERNAME"));
	    bd.show();
	},
	showUIDHelp2: function() {
	    var bd = this.getHelpDialog();
	    bd.page.setHeader("",this.getDictionaryItem("HELP_DIALOG_HEADER_USERID"));
	    bd.sourceNode = this.databaseLayer.domNode;
	    bd.page.setContent(this.getDictionaryItem("HELP_DIALOG_CONTENT_USERID"));	  
	    bd.show();
	},
	getHelpDialog: function() {
		if (!this.helpDialog) {
		    var props = {
			owner: this,
			pageName: "PopupHelp",
			//scrimBackground: true,
			//hideOnClick: false,
			//positionLocation: " l",
                        width: "500px",
                        height: "200px",
                        useContainerWidget: false,
                        modal: false,
                        noEscape: false,
                        hideControls: true,
                        corner: "tr"
			};
		    var d = this.helpDialog = new wm.PageDialog(props);
		}
		var b = this.helpDialog;
		return b;
	},
	studioProjectChanged: function() {
		this.update();
		this.updateRoles();
	},
	update: function() {
		// 1) reset all inputs.
		// 2) retrieve project Security settings and populate those settings in the Editor.
		this.clearSelectInput(this.secProviderInput);
		this.initSecProviderInput();
		this.databaseOptions = {};
		this.secEnableInput.setChecked(true);
		this.showLoginPageInput.setChecked(true);
		this.ldapSearchRoleCheckbox.setChecked(false);
		this.ldapSearchRoleCheckboxChange(this.ldapSearchRoleCheckbox);
		this.dbRoleBySQLCheckbox.setChecked(false);
		this.dbRoleBySQLCheckboxChange(this.dbRoleBySQLCheckbox);
		this.demoUserList.renderData([{userid: "demo", password: "demo"}]);
		this.resetDatabaseInputs();
		this.resetLDAPInputs();
		this.populateGeneralOptions();
		this.populateRolesSetup();
	},
    /* TODO: Localize "Demo" and "Database"; challenge: make sure that if the server sends words like "Demo" and "Database" that we don't mess with tests on that */
	initSecProviderInput: function() {
		var l = [this.SELECT_ONE, "Demo", "Database"];
		if (studio.isModuleEnabled("security-driver", "wm.ldap"))
			l.push("LDAP");
		if (studio.isModuleEnabled("security-driver", "wm.josso"))
			l.push("JOSSO");
		this.updateSelect(this.secProviderInput, l);
		this.secProviderInputChange(this.secProviderInput, this.secProviderInput.editor.getEditorValue());
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
	clearSelectInput: function(inSelect) {
		inSelect.beginEditUpdate();
		inSelect.components.editor.options = null;
		inSelect.clear();
		inSelect.endEditUpdate();
	},
	getEditorDisplayValue: function(editor) {
		var v = editor.getDisplayValue();
		return v == this.NO_VALUE ? null : v;
	},
	/*
	disableAll: function(inDisable) {
		this.secEnableInput.setDisabled(inDisable);
		this.showLoginPageInput.setDisabled(inDisable);
		this.addRoleInput.setDisabled(inDisable);
		this.addRoleButton.setDisabled(inDisable);
		this.deleteRoleButton.setDisabled(inDisable);
		this.roleList.setDisabled(inDisable);
	},
	*/
	resetDatabaseInputs: function() {
		this.clearSelectInput(this.dbDataModelInput);
		this.clearSelectInput(this.dbEntityInput);
		this.clearSelectInput(this.dbUsernameInput);
		this.clearSelectInput(this.dbUseridInput);
		this.clearSelectInput(this.dbPasswordInput);
		this.clearSelectInput(this.dbRoleInput);
		// Is this required?  Seemed to be working without but added for hygene
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
	resetLDAPInputs: function() {
		this.ldapUrlInput.setDataValue("ldap://localhost:389/dc=wavemaker,dc=com");
		this.ldapManagerDnInput.setDataValue("cn=manager,dc=wavemaker,dc=com");
		this.ldapManagerPasswordInput.setDataValue("manager");
		this.ldapUserDnPatternInput.setDataValue("cn={0},ou=people");
		this.ldapSearchRoleCheckbox.setChecked(false);
		this.ldapGroupSearchBaseInput.setDataValue("ou=groups");
		this.ldapGroupRoleAttributeInput.setDataValue("cn");
		this.ldapGroupSearchFilterInput.setDataValue("(member={0})");
		this.ldapConnectionResultLabel.setCaption("");
	},
	resetJOSSOInputs: function() {
  //TODO 		
	},	
	
	secProviderInputChange: function(inSender, inValue) {
		if (inValue == "Demo") {
			this.layers.setLayer("demoLayer");
			//this.disableAll(false);
			this.secEnableInput.setShowing(true);
			this.securityCheckboxChange();
		} else if (inValue == "Database") {
			this.layers.setLayer("databaseLayer");
			//this.disableAll(false);
			// don't call this if the call is originated from getGeneralOptionsResult's
			// secProviderInput event change callback
			if (!this.populatingOptions) {
				this.getDataModelList();
			}
			this.secEnableInput.setShowing(true);
			this.securityCheckboxChange();
		} else if (inValue == "LDAP") {
			this.layers.setLayer("ldapLayer");
			//this.disableAll(false);
			this.secEnableInput.setShowing(true);
			this.securityCheckboxChange();
		} else if (inValue == "JOSSO") {
			this.layers.setLayer("jossoLayer");
			//this.disableAll(false);
			this.secEnableInput.setShowing(true);
			this.securityCheckboxChange();
		}
		 else {
			this.layers.setLayer("emptyLayer");
			//this.disableAll(true);
			this.secEnableInput.editor.setChecked(false);
			this.securityCheckboxChange();
			this.secEnableInput.setShowing(false);			
		 }
	    this.setDirty();
	},
	populateGeneralOptions: function() {
		studio.securityConfigService.requestSync("getGeneralOptions", null, 
			dojo.hitch(this, "getGeneralOptionsResult"));
	},
	getGeneralOptionsResult: function(inResponse) {
		if (inResponse) {
		    //this.disableAll(false);
			this.secEnableInput.setChecked(inResponse.enforceSecurity);
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
		this.secProviderInputChange(this.secProviderInput, this.secProviderInput.editor.getEditorValue());
	},
	populateJOSSOOptions: function(){
	  studio.securityConfigService.requestAsync("getJOSSOOptions", null, dojo.hitch(this, "getJOSSOOptionsResult"));	
	},	
	getJOSSOOptionsResult: function(inResponse) {
		this.roleList.renderData(inResponse);
  },
	populateDemoOptions: function() {
		studio.securityConfigService.requestSync("getDemoOptions", null, 
			dojo.hitch(this, "getDemoOptionsResult"));
	},
	getDemoOptionsResult: function(inResponse) {
		this.demoUserList.renderData(inResponse.users);
	},
	populateDatabaseOptions: function() {
		studio.securityConfigService.requestSync("getDatabaseOptions", null, 
			dojo.hitch(this, "getDatabaseOptionsResult"));
	},
	getDatabaseOptionsResult: function(inResponse) {
		this.databaseOptions = inResponse;
		this.dbDataModelInput.setDataValue(inResponse.modelName);
                this.dbDataModelInput.editor.changed();
	},
	populateLDAPOptions: function() {
		studio.securityConfigService.requestSync("getLDAPOptions", null, 
			dojo.hitch(this, "getLDAPOptionsResult"));
	},
	getLDAPOptionsResult: function(inResponse) {
		this.ldapUrlInput.setDataValue(inResponse.ldapUrl);
		this.ldapManagerDnInput.setDataValue(inResponse.managerDn);
		this.ldapManagerPasswordInput.setDataValue(inResponse.managerPassword);
		this.ldapUserDnPatternInput.setDataValue(inResponse.userDnPattern);
		this.ldapSearchRoleCheckbox.setChecked(!inResponse.groupSearchDisabled);
		this.ldapGroupSearchBaseInput.setDataValue(inResponse.groupSearchBase);
		this.ldapGroupRoleAttributeInput.setDataValue(inResponse.groupRoleAttribute);
		this.ldapGroupSearchFilterInput.setDataValue(inResponse.groupSearchFilter);
	},
	saveButtonClick: function(inSender) {
	    studio.saveAll(this);
	},
        toastToSuccess: function() {
/*
	    studio.endWait("Saving Security Settings");
            app.toastDialog.showToast("Security settings saved; Security is " + 
				      (this.secEnableInput.getChecked() ? "ON" : "OFF"),
                                      5000,
                                      "Success");
				      */
	    this.onSaveSuccess();
        },
        saveError: function(inError) {
	    studio._saveErrors.push({owner: this,
				     message: inError.message});
	    this.saveComplete();
	},
	configDemoResult: function(inResponse) {
		this.updateStudioServices();
               this.toastToSuccess();
	},
	configDatabaseResult: function(inResponse) {
		this.updateStudioServices();
               this.toastToSuccess();
	},
	configLDAPResult: function(inResponse) {
		this.updateStudioServices();
               this.toastToSuccess();
	},
	configJOSSOResult: function(inResponse) {
		this.updateStudioServices();
               this.toastToSuccess();
	},
	updateStudioServices: function() {
		studio.updateServices();
	},
	checkErrorOnInputFields: function(dataSourceType) {
	    if (!this.secEnableInput.getChecked()) return err;
		var err = null;
		if (dataSourceType == "Demo") {
			if (this.demoUserList._data == null || this.demoUserList._data.length == 0) {
			    err = this.getDictionaryItem("ERROR_DEMO_NO_USER")
			}
		} else if (dataSourceType == "Database") {
		    if (!(this.dbDataModelInput.getDataValue() && 
				this.dbEntityInput.getDataValue() && 
				this.getEditorDisplayValue(this.dbUsernameInput) &&
				this.getEditorDisplayValue(this.dbUseridInput) && 
				this.getEditorDisplayValue(this.dbPasswordInput))) {
			err = this.getDictionaryItem("ERROR_DATABASE_INPUT_REQUIRED");
			}
		} else if (dataSourceType == "LDAP") {
			if (!(this.ldapUrlInput.getDataValue() && 
				this.ldapUserDnPatternInput.getDataValue())) {
			    err = this.getDictionaryItem("ERROR_LDAP_INPUT_REQUIRED");
			}
		} else if (dataSourceType == "JOSSO") {
			// To do
		} return err;
	},
	demoAddUserButtonClick: function(inSender) {
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
			for (var i = 0; i < d.length; i++) {
				if (d[i] && d[i].userid == userid) {
				    app.alert(this.getDictionaryItem("ALERT_USERNAME_EXISTS"));
					return;
				}
			}
			if (role) {
				d.push({userid: userid, password: password, roles: [role]});
			} else {
				d.push({userid: userid, password: password, roles: null});
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
	demoDeleteUserButtonClick: function(inSender) {
		if (this.demoUserList.selected) {
			var d = this.demoUserList._data;
			var nd = [];
			for (var i = 0; i < d.length; i++) {
				if (i != this.demoUserList.selected.index) {
					nd.push(d[i]);
				}
			}
			this.demoUserList.renderData(nd);
		    this.setDirty();
		}
	},
	dbDataModelInputChange: function(inSender, inValue) {
		this.getTableList();
	        this.setDirty();
	},
	dbEntityInputChange: function(inSender, inValue) {
		this.getPropertyList();
	        this.setDirty();
	},
	getDataModelList: function() {
		studio.dataService.requestSync("getDataModelNames", null, 
			dojo.hitch(this, "getDataModelListResult"));
	},
	getDataModelListResult: function(inResponse) {
		if (inResponse) {
			var t = this.dbEntityInput.getDataValue();
			if (t) {
				this.databaseOptions.entityName = t;
			}
			this.updateSelect(this.dbDataModelInput, inResponse);
		}
	},
	getTableList: function() {
		var d = this.dbDataModelInput.getDataValue();
		if (d) {
			studio.dataService.requestSync("getEntityNames", [d], 
				dojo.hitch(this, "getTableListResult"));
		} else {
			this.updateSelect(this.dbEntityInput, null);
		}
	},
	getTableListResult: function(inResponse) {
		if (inResponse) {
			this.updateSelect(this.dbEntityInput, inResponse);
			this.dbEntityInput.setDataValue(this.databaseOptions.entityName);
		}
	},
	getPropertyList: function() {
		var d = this.dbDataModelInput.getDataValue();
		var t = this.dbEntityInput.getDataValue();
		if (d && t) {
			studio.securityConfigService.requestSync("getDatabaseProperties", [d, t], 
				dojo.hitch(this, "getDatabasePropertiesResult"));
		} else {
			this.updateSelect(this.dbUsernameInput, null);
			this.updateSelect(this.dbUseridInput, null);
			this.updateSelect(this.dbPasswordInput, null);
			this.updateSelect(this.dbRoleInput, null);
		}
	},
	getDatabasePropertiesResult: function(inResponse) {
		if (inResponse) {
			var pnames = [];
			for (var i = 0, p; p = inResponse[i]; i++) {
				if (p.compositeProperties && p.compositeProperties.length > 0) {
					for (var j = 0, cp; cp = p.compositeProperties[j]; j++) {
						pnames.push(cp.name);
					}
				} else {
					pnames.push(p.name);
				}
			}
			pnames.push(this.NO_VALUE);
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
		    this.dbPasswordInput.setDataValue(this.databaseOptions.pwPropertyName || this.databaseOptions.pwColumnName.replace(/,.*$/,""));
			this.dbRoleInput.setDataValue(this.databaseOptions.rolePropertyName);
			this.tenantIdField.setDataValue(this.databaseOptions.tenantIdField); //xxx
			this.defTenantId.setDataValue(this.databaseOptions.defTenantId || ""); //xxx
			this.dbRoleBySQLCheckbox.setChecked(this.databaseOptions.useRolesQuery);
			this.dbRoleBySQLCheckboxChange(this.dbRoleBySQLCheckbox);
			if (this.databaseOptions.rolesByUsernameQuery) {
				this.dbRoleBySQLInput.setDataValue(this.databaseOptions.rolesByUsernameQuery);
			}
		}
	},
	dbRoleBySQLCheckboxChange: function(inSender, inDisplayValue, inDataValue) {
		var c = inSender.components.editor.editor.checked;
		this.dbRoleInput.setDisabled(c);
		this.dbRoleBySQLInput.setShowing(c);
		this.dbRoleBySQLEnablePanel.setShowing(c);
	        this.setDirty();
	},
	dbTestSQLButtonClick: function(inSender) {
	    studio.beginWait(this.getDictionaryItem("WAIT_TEST_SQL"));
		studio.securityConfigService.requestAsync(
			"testRolesByUsernameQuery",
			[this.dbDataModelInput.getDataValue(),
			this.dbRoleBySQLInput.getDataValue(),
			this.dbTestSQLInput.getDataValue()],
			dojo.hitch(this, "testRolesByUsernameQueryResult"),
			dojo.hitch(this, "testRolesByUsernameQueryError"));
			
	},
	testRolesByUsernameQueryResult: function(inResponse) {
		studio.endWait();
		this.dbTestSQLErrorLabel.setCaption("");
		this.dbTestSQLResultList.renderData(inResponse);
	},
	testRolesByUsernameQueryError: function(inResponse) {
		studio.endWait();
		this.dbTestSQLResultList.renderData([]);
		this.dbTestSQLErrorLabel.setCaption(inResponse.message);
	},
	ldapSearchRoleCheckboxChange: function(inSender, inDisplayValue, inDataValue) {
		var c = inSender.components.editor.editor.checked;
		this.ldapGroupSearchBaseInput.setShowing(c);
		this.ldapGroupRoleAttributeInput.setShowing(c);
		this.ldapGroupSearchFilterInput.setShowing(c);
	        this.setDirty();
	},
	ldapConnectionButtonClick: function(inSender) {
	    studio.beginWait(this.getDictionaryItem("WAIT_TEST_LDAP"));
		studio.securityConfigService.requestAsync(
			"testLDAPConnection",
			[this.ldapUrlInput.getDataValue(),
			this.ldapManagerDnInput.getDataValue(),
			this.ldapManagerPasswordInput.getDataValue()], 
			dojo.hitch(this, "testLDAPConnectionResult"),
			dojo.hitch(this, "testLDAPConnectionError"));
	},
	testLDAPConnectionResult: function(inResponse) {
		studio.endWait();
		this.ldapConnectionResultLabel.domNode.style.color = "";
	    this.ldapConnectionResultLabel.setCaption(this.getDictionaryItem("TEST_LDAP_MESSAGE_SUCCESS"));
	},
	testLDAPConnectionError: function(inError) {
		studio.endWait();
		this.ldapConnectionResultLabel.domNode.style.color = "red";
		this.ldapConnectionResultLabel.setCaption(inError.message);
	},
	addRoleButtonClick: function(inSender) {
		var role = this.addRoleInput.getDataValue();
		if (role) {
			role = dojo.trim(role);
		}
		if (role) {
			var d = this.roleList._data;
			if (d == null) {
				d = [];
			}
			for (var i = 0; i < d.length; i++) {
				if (d[i].role == role) {
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
	deleteRoleButtonClick: function(inSender) {
		if (this.roleList.selected) {
			var d = this.roleList._data;
			var nd = [];
			var deletedIndex = -1;
			for (var i = 0; i < d.length; i++) {
				if (i != this.roleList.selected.index) {
					nd.push(d[i]);
				} else 
				    deletedIndex = i;

			}
			this.roleList.renderData(nd);
			this.updateSelect(this.demoRoleInput, nd);
		    this.setDirty();
		}
	},
	populateRolesSetup: function() {
		if(this.isJOSSO())
		  studio.securityConfigService.requestAsync("getJOSSORoles", null, dojo.hitch(this, "getRolesResult"));	
		else
		  studio.securityConfigService.requestAsync("getRoles", null, dojo.hitch(this, "getRolesResult"));	
	},
	getRolesResult: function(inResponse) {
		this.roleList.renderData(inResponse);
		this.updateSelect(this.demoRoleInput, inResponse);
	        this._cachedData = this.getCachedData();// at this point we've finished initializingt security page
	},
	saveRolesSetup: function() {
		if(this.isJOSSO())
		 studio.securityConfigService.requestAsync("setJOSSORoles", [this.roleList._data], dojo.hitch(this, "setRolesResult"));
		else
		  studio.securityConfigService.requestAsync("setRoles", [this.roleList._data], dojo.hitch(this, "setRolesResult"));
	},
	setRolesResult: function() {
		wm.roles = this.roleList._data || [];
	},
	copyLoginFiles: function() {
	  if (this.isJOSSO()) {
		   if (!webFileExists("login-redirect.jsp")) {
		       var loginhtml = this.getDictionaryItem("JOSSO_DETAILS");
		      studio.project.saveProjectData("login-redirect.jsp", loginhtml);
		     }
	    }else {
		if (!webFileExists("login.html")) {
			var loginhtml = loadDataSync(this.loginTemplateFolder + "login.html");
		    studio.project.saveProjectData("login.html", wm.makeLoginHtml(loginhtml, studio.project.projectName, studio.application.theme));
		}
		if (!webFileExists(wm.pagesFolder + "Login/Login.js")) {
			var loginPageCss = loadDataSync(this.loginPageTemplateFolder + "Login.css");
			var loginPageHtml = loadDataSync(this.loginPageTemplateFolder +  "Login.html");
			var loginPageJs = loadDataSync(this.loginPageTemplateFolder + "Login.js");
			var loginPageWidgetsJs = loadDataSync(this.loginPageTemplateFolder + "Login.widgets.js");
			
			var n = wm.pagesFolder + "Login/Login";
			studio.project.saveProjectData(n + ".css", loginPageCss);
			studio.project.saveProjectData(n + ".html", loginPageHtml);
			studio.project.saveProjectData(n + ".js", loginPageJs);
			studio.project.saveProjectData(n + ".widgets.js", loginPageWidgetsJs);
			studio.project.updatePageList(); // sync request
			studio.project.pagesChanged();
		}
	    }
	},

	demoUserListFormat: function(inSender, ioData, inColumn, inData, inHeader) {
		if (inHeader) {
			if (inColumn == 0) {
			    ioData.data = "<div>" + this.getDictionaryItem("DEMO_USER_USERNAME");
			} else if (inColumn == 1) {
			    ioData.data = "<div>" + this.getDictionaryItem("DEMO_USER_PASSWORD");
			} else if (inColumn == 2) {
			    ioData.data = "<div>" + this.getDictionaryItem("DEMO_USER_ROLE");
			}
		}
	},
	updateRoles: function() {
		if (this.isJOSSO())
		  studio.securityConfigService.requestSync("getJOSSORoles", [], dojo.hitch(this, "getRolesUpdateResult"));
	  else
	   	studio.securityConfigService.requestSync("getRoles", [], dojo.hitch(this, "getRolesUpdateResult"));
	},
	getRolesUpdateResult: function(inData) {
		wm.roles = inData || [];
	},
  
	showJossoLayer: function() {
	    this.secEnableInput.editor.setChecked(true);
	    this.securityCheckboxChange();

	    var roles = this.roleList._data;
	    if (roles.length) {
				this.roleList._render();
	    }
	},
	showDemoLayer: function() {
	    this.secEnableInput.setDisabled(false);
	    this.showLoginPageInput.setShowing(true);
	},
	showDBLayer: function() {
	    this.secEnableInput.setDisabled(false);
	    this.showLoginPageInput.setShowing(true);
	},
	showLDAPLayer: function() {
	    this.secEnableInput.setDisabled(false);
	    this.showLoginPageInput.setShowing(true);
	},
	securityCheckboxChange: function() {
	    var enabled = this.secEnableInput.editor.getChecked();

	    this.showLoginPageInput.setShowing(enabled);
	    this.panel4a.setShowing(enabled);
	    this.panelBottom.setShowing(enabled);
	    this.panelBottom.setShowing(enabled);

	    
	    if (this.isJOSSO())  this.showLoginPageInput.setShowing(false);
	    this.panel1a.setHeight((this.isJOSSO()) ? "70px" : "350px");
	    this.setDirty();
	},
	isJOSSO: function() {
	    return this.secProviderInput.editor.getEditorValue() == "JOSSO";
	},


    getCachedData: function() {
	var rolesQuery = null;
	if (this.dbRoleBySQLCheckbox.getChecked()) {
	    rolesQuery = this.dbRoleBySQLInput.getDataValue();
	}
	var result = [dojo.toJson(this.demoUserList._data),
		      dojo.toJson(this.roleList._data),
		      this.secProviderInput.getDataValue(),
		      this.secEnableInput.getChecked(),
		      this.showLoginPageInput.getChecked(),
		      this.dbRoleBySQLCheckbox.getChecked(),
		      this.dbDataModelInput.getDataValue(),
		      this.dbEntityInput.getDataValue(),
		      this.getEditorDisplayValue(this.dbUsernameInput),
		      this.getEditorDisplayValue(this.dbUseridInput),
		      this.getEditorDisplayValue(this.dbPasswordInput),
		      this.getEditorDisplayValue(this.dbRoleInput),
		      this.getEditorDisplayValue(this.tenantIdField) || "",
		      this.defTenantId.getDataValue() || 0,
		      rolesQuery,
		      this.ldapUrlInput.getDataValue(),
		      this.ldapManagerDnInput.getDataValue(),
		      this.ldapManagerPasswordInput.getDataValue(),
		      this.ldapUserDnPatternInput.getDataValue(),
		      !this.ldapSearchRoleCheckbox.getChecked(),
		      this.ldapGroupSearchBaseInput.getDataValue(),
		      this.ldapGroupRoleAttributeInput.getDataValue(),
		      this.ldapGroupSearchFilterInput.getDataValue()];
	return result.join("|");
    },

    dirty: false,
    setDirty: function() {

	    wm.job(this.getRuntimeId() + "_hasChanged", 500, dojo.hitch(this, function() {
		if (this.isDestroyed) return;
		var changed = this._cachedData != this.getCachedData();
		var caption = (!changed ? "" : "<img class='StudioDirtyIcon'  src='images/blank.gif' /> ") +
		    studio.getDictionaryItem("wm.Security.TAB_CAPTION");
		this.dirty = changed;

		if (caption != this.owner.parent.caption) {
		    this.owner.parent.setCaption(caption);
		    studio.updateServicesDirtyTabIndicators();
		}
	    }));

    },

    /* getDirty, save, saveComplete are all common methods all services should provide so that studio can 
     * interact with them
     */
    getDirty: function() {
	return this.dirty;
    },
    save: function() {
		if (this.secProviderInput.getDataValue() == this.SELECT_ONE) {
			return;
		}
		var t = this.layers.getLayer().caption;
		var err = this.checkErrorOnInputFields(t)
		if (err) {
		    studio._saveErrors.push({owner: this,
					     message: err});
		    this.saveComplete();
		} else {
			this.copyLoginFiles();
		    //studio.beginWait("Saving Security Settings");
		    wm.onidle(this, function() {
			if (t == "Demo") {
				studio.securityConfigService.requestSync(
					"configDemo",
					[this.demoUserList._data,
					this.secEnableInput.getChecked(),
					this.showLoginPageInput.getChecked()],
				    dojo.hitch(this, "configDemoResult"),
				    dojo.hitch(this, "saveError"));

			} else if (t == "Database") {
				var rolesQuery = null;
				if (this.dbRoleBySQLCheckbox.getChecked()) {
					rolesQuery = this.dbRoleBySQLInput.getDataValue();
				}
				studio.securityConfigService.requestSync(
					"configDatabase",
					[this.dbDataModelInput.getDataValue(),
					 this.dbEntityInput.getDataValue(),
					this.getEditorDisplayValue(this.dbUsernameInput),
					this.getEditorDisplayValue(this.dbUseridInput),
					this.getEditorDisplayValue(this.dbPasswordInput),
					this.getEditorDisplayValue(this.dbRoleInput),
					this.getEditorDisplayValue(this.tenantIdField) || "",
					this.defTenantId.getDataValue() || 0,
					rolesQuery,
					this.secEnableInput.getChecked(),
					this.showLoginPageInput.getChecked()],
				    dojo.hitch(this, "configDatabaseResult"),
				    dojo.hitch(this, "saveError")
				);
			    
			} else if (t == "LDAP") {
				studio.securityConfigService.requestSync(
					"configLDAP",
					[this.ldapUrlInput.getDataValue(),
					this.ldapManagerDnInput.getDataValue(),
					this.ldapManagerPasswordInput.getDataValue(),
					this.ldapUserDnPatternInput.getDataValue(),
					!this.ldapSearchRoleCheckbox.getChecked(),
					this.ldapGroupSearchBaseInput.getDataValue(),
					this.ldapGroupRoleAttributeInput.getDataValue(),
					this.ldapGroupSearchFilterInput.getDataValue(),
					this.secEnableInput.getChecked(),
					this.showLoginPageInput.getChecked()],
				    dojo.hitch(this, "configLDAPResult"),
				    dojo.hitch(this, "saveError"));
			} else if (t == "JOSSO") {
			    var roles = this.roleList._data;
	    		studio.securityConfigService.requestSync(
					"configJOSSO",
					[this.secEnableInput.getChecked(), roles[0]],
					dojo.hitch(this, "configJOSSOResult"));
					studio.application.loadServerComponents();
					studio.refreshServiceTree();
					return;			
		}
			this.saveRolesSetup();
			studio.application.loadServerComponents();
			studio.refreshServiceTree();
		    });
		}

    },
    saveComplete: function() {
    },
    onSaveSuccess: function() {
	this._cachedData = this.getCachedData();
	this.setDirty();
	this.saveComplete();
    },
    getProgressIncrement: function() {
	return 5; //  1 tick is very fast; this is 5 times slower than that
    },

	_end: 0
});
