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
 

dojo.provide("wm.studio.pages.ImportCloudFoundryDatabase.ImportCloudFoundryDatabase");

dojo.declare("ImportCloudFoundryDatabase", wm.Page, {
    i18n: true,
    
    start: function() {
	this.update();
    },
    onShow: function() {
	this.update();
    },
    update: function(inImportDataModel) {
	var token = dojo.cookie( "Studio.DeploymentDialog.CFTOKEN");
	if (token) {
	    this.cloudFoundryService.requestAsync("listServices", [token,this.loginDialogTargetEditor.getDataValue()],
						  dojo.hitch(this, function(inResult) {
						      this.populateCloudFoundryAppList(inResult, optionalCallback);
						  }),
						  dojo.hitch(this, function(inError) {
						      app.alert(inError);
						      this.cfLoginDialog.show();
						  }));	
	} else {
	    this.cfLoginDialog.show();
	}
    },
	cancelBtnClick: function(inSender) {
	    this.owner.owner.hide();
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



    cfLoginOkClick: function() {
	studio.beginWait(this.getDictionaryItem("WAIT_LOGGING_IN"));
	this.cloudFoundryService.requestSync(
	    "login",
	    [this.loginDialogUserEditor.getDataValue(), this.loginDialogPasswordEditor.getDataValue(), this.loginDialogTargetEditor.getDataValue()],
	    dojo.hitch(this, function(inData) {
		dojo.cookie( "Studio.DeploymentDialog.CFTOKEN", inData, {expires: 1});
		studio.endWait();
		this.cfLoginDialog.hide();
		this.update();
	    }),
	    dojo.hitch(this, function(inError) {
		studio.endWait();
		var message = inError.message;
		if (message.match(/^403/)) {
		    app.toastError(this.getDictionaryItem("INVALID_USER_PASS"));
		} else {
		    app.toastError(message);
		}
		this.loginDialogUserEditor.focus();
	    }));
    },

  _end: 0
});
