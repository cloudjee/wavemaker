/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

dojo.provide("wm.studio.pages.DeploymentDialog.DeploymentDialog");

dojo.declare("DeploymentDialog", wm.Page, {
    /* Page Properties */
    validateVisibleOnly: true,
    i18n: true,

    /* Page Static Variables */
    CF_DEPLOY: "CLOUD_FOUNDRY",
    CJ_DEPLOY: "CLOUD_JEE",
    TC_DEPLOY: "TOMCAT",
    FILE_DEPLOY: "FILE",

    /* Page caches and state */
    currentDatabaseBoxes: [],
    hsqldbDatabaseBoxes: [],
    cfDatabaseNameList: [],
    _currentDeploymentIndex: -1,
	currentPortMappingBox: null,

    /* Extra Widgets */
    hsqldbBox: {
    hsqldbPanel1: ["wm.FancyPanel", {"borderColor":"black","innerBorder":"1", "height":"120px","margin":"10,10,10,0","title":"Database 1", labelHeight: "24"}, {}, {
        html1: ["wm.Html", {padding: "5", width: "100%", height: "100%", _classes: {domNode: ["HSQLDBHtml"]}, html: ""}]
    }]
    },
    databaseBox: {
    databasePanel1: ["wm.FancyPanel", {"borderColor":"black","innerBorder":"1", "fitToContentHeight":true,"height":"149px","margin":"10,10,10,0","title":"Database 1", labelHeight: "24"}, {}, {
        databaseInnerPanel1: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left", margin: "5,50,5,50"},{}, {
        databaseConnectionEditor1: ["wm.SelectMenu", {"caption":"","captionAlign":"left","captionSize":"140px","dataField":"dataValue","displayField":"dataValue","displayValue":"","helpText":"","options":"Standard, JNDI","width":"280px"}, {onchange: "updateDatabaseLayers"}],
        databaseLayers1: ["wm.Layers", {fitToContentHeight: true}, {}, {
            databaseConnectionsLayer1: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
                databaseTypeEditor1: ["wm.Text", {"border":"0","caption":"","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","readonly":true,"width":"100%"}, {}],
                databaseUserEditor1: ["wm.Text", {"border":"0","caption":"","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", required: true}, {}],
                databasePasswordEditor1: ["wm.Text", {"border":"0","caption":"","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","password":true,"width":"100%", required: false}, {}],
                databaseHostEditor1: ["wm.Text", {"border":"0","caption":"","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", emptyValue: "emptyString"}, {onchange: "updateDbConnectionUrl"}],
                databasePortEditor1: ["wm.Text", {"border":"0","caption":"","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%"}, {onchange: "updateDbConnectionUrl"}],
                databaseNameEditor1: ["wm.Text", {"border":"0","caption":"","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%"}, {onchange: "updateDbConnectionUrl"}],
                databaseURLEditor1: ["wm.Text", {"border":"0","caption":"","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", required: true}, {}]
            }],
            databaseJNDILayer1: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
                databaseJNDINameEditor1: ["wm.Text", {"border":"0","caption":"","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", required: true}, {}]
            }],
            databaseCloudJeeLayer1: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
                databaseCloudJeeType1: ["wm.Text", {"border":"0","caption":"","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"MYSQL","readonly":true,"width":"100%"}, {}],
                databaseCloudJeeNameEditor1:["wm.Text", {"border":"0","caption":"","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","readonly":true,"width":"100%"}, {}],

                /* Height set from dictionary */
                databaseCloudJeeTips1: ["wm.Html", {border: "0", margin: "10,0,0,0", width: "100%", height: "60px","showing":false}]/*,
                databaseCloudJeeWarnings1: ["wm.Html", {border: "0", margin: "10,0,0,0", padding: "5", border: "1", borderColor: "red", width: "100%", height: "60px", showing: false}]*/
            }]
        }]
        }]
    }]
    },

	portMappingBox: {
    portMappingPanel: ["wm.FancyPanel", {"borderColor":"black","innerBorder":"1", "fitToContentHeight":true,"height":"149px","margin":"10,10,10,0","title":"Database 1", labelHeight: "24"}, {}, {
        portMappingInnerPanel1: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", verticalAlign: "top",			horizontalAlign: "left", margin: "5,50,5,50"},{}, {
        httpPortEditor: ["wm.Text", {"border":"0","caption":"Http Port","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", emptyValue: "emptyString", helpText: "If you are setting an https port, and want to automatically redirect http requests to that port, enter the port that http requests are received on (e.g. 80 or 8094)", placeHolder: "80"}],	
		httpsPortEditor: ["wm.Text", {"border":"0","caption":"Https Port","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", emptyValue: "emptyString", helpText: "Port that https requests go to (e.g. 443)", placeHolder: 443}, {onchange: "httpsPortChanged"}],  
        }]
    }]
    },

    start: function() {
        this.localizeStuff();
        if (studio.isCloud()) {
            this.tomcatRadio.hide();
            this.newDeploymentDialog.setHeight("160px");
        }
    },
    onShow: function() {

    },
    reset: function() {
        this._currentDeploymentIndex = -1;
        this.initDeploymentListVar();
    },
    localizeStuff: function() {
        this.hsqldbBox.hsqldbPanel1[3].html1[1].html = this.getDictionaryItem("DBBOX_HSQLDB_HTML");
        var innerPanelChildren = this.databaseBox.databasePanel1[3].databaseInnerPanel1[3];
        innerPanelChildren.databaseConnectionEditor1[1].caption = this.getDictionaryItem("DBBOX_CONNECTION_CAPTION");
        var layersChildren = innerPanelChildren.databaseLayers1[3];
        var connectionsLayerChildren = layersChildren.databaseConnectionsLayer1[3];
        connectionsLayerChildren.databaseTypeEditor1[1].caption = this.getDictionaryItem("DBBOX_TYPE_CAPTION");
        connectionsLayerChildren.databaseUserEditor1[1].caption = this.getDictionaryItem("DBBOX_USERNAME_CAPTION");
        connectionsLayerChildren.databasePasswordEditor1[1].caption = this.getDictionaryItem("DBBOX_PASSWORD_CAPTION");
        connectionsLayerChildren.databaseHostEditor1[1].caption = this.getDictionaryItem("DBBOX_HOST_CAPTION");
        connectionsLayerChildren.databasePortEditor1[1].caption = this.getDictionaryItem("DBBOX_PORT_CAPTION");
        connectionsLayerChildren.databaseNameEditor1[1].caption = this.getDictionaryItem("DBBOX_NAME_CAPTION");
        connectionsLayerChildren.databaseURLEditor1[1].caption = this.getDictionaryItem("DBBOX_URL_CAPTION");

        var jndiLayerChildren = layersChildren.databaseJNDILayer1[3];
        jndiLayerChildren.databaseJNDINameEditor1[1].caption = this.getDictionaryItem("DBBOX_JNDINAME_CAPTION");

        var cloudfoundryLayerChildren = layersChildren.databaseCloudJeeLayer1[3];
        cloudfoundryLayerChildren.databaseCloudJeeType1[1].caption = this.getDictionaryItem("DBBOX_CFTYPE_CAPTION");
        cloudfoundryLayerChildren.databaseCloudJeeNameEditor1[1].caption = this.getDictionaryItem("DBBOX_CFNAME_CAPTION");
        cloudfoundryLayerChildren.databaseCloudJeeNameEditor1[1].helpText = this.getDictionaryItem("DBBOX_CFNAME_HELP");
        cloudfoundryLayerChildren.databaseCloudJeeTips1[1].html = this.getDictionaryItem("CF_DB_NODATA_WARNING");
        cloudfoundryLayerChildren.databaseCloudJeeTips1[1].height = this.getDictionaryItem("CF_DB_NODATA_WARNING_HEIGHT");
        /*cloudfoundryLayerChildren.databaseCloudJeeWarnings1[1].html = this.getDictionaryItem("CF_MULTIPLE_DB_WARNING");*/
    },
    selectFirst: function() {
        this.initDeploymentListVar();
        if (this.deploymentListVar.getCount() > 0) {
            this.deploymentList.select(0);
            //this.deploymentListSelect(this.deploymentList, this.deploymentList.getItem(0), true);
        } else {

        }
    },
    initDeploymentListVar: function() {
        var deployments = [];
        this.deploymentListVar.clearData();
        dojo.forEach(studio._deploymentData, dojo.hitch(this, function(deployment, i) {
            this.deploymentListVar.addItem({
                name: deployment.name,
                dataValue: deployment
            });
        }));
    },
  cancelButtonClick: function(inSender) {
      try {


      } catch(e) {
          console.error('ERROR IN cancelButtonClick: ' + e);
      }
  },
  okButtonClick: function(inSender) {
      try {


      } catch(e) {
          console.error('ERROR IN okButtonClick: ' + e);
      }
  },
  closeButtonClick: function(inSender) {
      try {
      if (this.getIsDirty()) {
          this.confirmSaveDialog.show();
          this.saveDialogDontSaveButton.onclick = dojo.hitch(this, function() {
          this.confirmSaveDialog.hide();
          var selectedIndex = this.deploymentList.getSelectedIndex();
          if (!this.deploymentListVar.getItem(selectedIndex).getValue("dataValue").deploymentId) {
              this.deploymentListVar.removeItem(selectedIndex);
          }
          this._currentDeploymentIndex = -1;
          this.editPanel.clearDirty();
          this.owner.owner.hide();
          });

          this.saveDialogCancelButton.onclick = dojo.hitch(this, function() {
          this.confirmSaveDialog.hide();
          });

          this.saveDialogSaveButton.onclick = dojo.hitch(this, function() {
          var c1 = dojo.connect(this, "saveSuccess", this, function() {
              this.confirmSaveDialog.hide();
              this.editPanel.clearDirty();
              this.owner.owner.hide();
              dojo.disconnect(c1);
              dojo.disconnect(c2);
          });
          var c2 = dojo.connect(this, "saveFailed", this, function() {
              dojo.disconnect(c1);
              dojo.disconnect(c2);
          });
          this.saveButtonClick();
          });
      } else {
              this.owner.owner.hide();
      }

      } catch(e) {
          console.error('ERROR IN closeButtonClick: ' + e);
      }
  },

    generateCurrentDeploymentDataStruct: function() {
        switch (this.deploymentList.selectedItem.getValue("dataValue").deploymentType) {
        case this.TC_DEPLOY:
            return this.generateTomcatDeploymentStruct();
        case this.CJ_DEPLOY:
            return this.generateCloudJeeDeploymentStruct();
        case this.FILE_DEPLOY:
            return this.generateFileDeploymentStruct();
        }
    },
    generateTomcatDeploymentStruct: function() { /* Start from the  original data as it contains the deploymentId and perhaps other data we haven't bothered to put into the form */
        var data = this.deploymentList.selectedItem.getValue("dataValue");
        data.name = this.tcDeploymentNameEditor.getDataValue();
        data.applicationName = this.tcNameEditor.getDataValue();
        data.host = this.tcHostEditor.getDataValue();
        data.port = this.tcPortEditor.getDataValue();
        data.username = this.tcUserEditor.getDataValue();
        data.password = this.tcPasswordEditor.getDataValue();

		if (studio.application.isSSLUsed) {
			data.httpPort = this.httpPortEditor.getDataValue();
			data.httpsPort = this.httpsPortEditor.getDataValue();
		}

        /* Delete the old databases and replace it with a new databases structure */
        data.databases = this.generateStandardDatabaseStruct();
        return data;
    },
    generateCloudJeeDeploymentStruct: function() { /* Start from the  original data as it contains the deploymentId and perhaps other data we haven't bothered to put into the form */
        var data = this.deploymentList.selectedItem.getValue("dataValue");
        data.applicationName = this.cjNameEditor.getDataValue();
        data.name = this.cjDeploymentNameEditor.getDataValue();
        data.target = this.cjHostEditor.getDataValue();
        data.deploymentUrl = this.cjUrlEditor.getDataValue();
        data.token = this.getTokenCookie(data.target);

        /* Delete the old databases and replace it with a new databases structure */
        var databases = data.databases = [];

        dojo.forEach(this.currentDatabaseBoxes, dojo.hitch(this, function(box, i) {
            databases.push({
                dataModelId: box.dataModel.name,
                dbName: box.dataConnection.db,
                connectionUrl: "jdbc\:mysql\://localhost\:3306/test",//this.getTargetUrl(data),// used to store db type, not because its required
                username: "root",
                password: "cloudjee123",
                jndiName: null
            });
        }));
        return data;
    },

    generateFileDeploymentStruct: function() { /* Start from the  original data as it contains the deploymentId and perhaps other data we haven't bothered to put into the form */
        var data = this.deploymentList.selectedItem.getValue("dataValue");
        data.name = this.fileDeploymentNameEditor.getDataValue();
        data.archiveType = this.warRadioButton.getGroupValue();

		if (studio.application.isSSLUsed) {
			data.httpPort = this.httpPortEditor.getDataValue();
			data.httpsPort = this.httpsPortEditor.getDataValue();
		}

        /* Delete the old databases and replace it with a new databases structure */
        data.databases = this.generateStandardDatabaseStruct();
        return data;
    },
    generateStandardDatabaseStruct: function() {
        var databases = [];
        dojo.forEach(this.currentDatabaseBoxes, dojo.hitch(this, function(box, i) {

            databases.push({
                dataModelId: box.dataModel.name,
                dbName: this["databaseNameEditor" + (i + 1)].getDataValue(),
                connectionUrl: this["databaseURLEditor" + (i + 1)].getDataValue(),
                username: this["databaseUserEditor" + (i + 1)].getDataValue(),
                password: this["databasePasswordEditor" + (i + 1)].getDataValue() ? this["databasePasswordEditor" + (i + 1)].getDataValue() : "",
                jndiName: this["databaseLayers" + (i + 1)].layerIndex == 1 ? this["databaseJNDINameEditor" + (i + 1)].getDataValue() : null
            });

        }));
        return databases;
    },
    /*cjGetUrlbuttonClick: function(inSender){
        try{
        this.cjUrlEditor.clear();
        var data = this.generateCloudJeeDeploymentStruct();
        studio.beginWait(this.getDictionaryItem("WAIT_GENERATE"));
        studio.deploymentService.requestAsync("getDeploymentURL", [data],
                        dojo.hitch(this, function(inResult) {
                            this.cjGetUrlSuccess(inResult,false);
                        }),
                        dojo.hitch(this, "cjGetUrlFailed"));
        } catch(e) {
          console.error('ERROR IN cjGetUrlbuttonClick: ' + e);
      }
      },   */
    cjGetUrlSuccess: function(inResult){
        this.cjUrlEditor.setDataValue(inResult.replace(/^https/,"http"));
        studio.endWait();
    },

    cjGetUrlFailed: function(inResult){
        studio.endWait();
        app.toastError(this.getDictionaryItem("TOAST_GENERATE_FAIL"));
    },
    saveButtonClick: function(inSender) {
      try {

          var data = this.generateCurrentDeploymentDataStruct();
      studio.beginWait(this.getDictionaryItem("WAIT_SAVE"));
      studio.deploymentService.requestAsync("save", [data],
                        dojo.hitch(this, function(inResult) {
                            this.saveSuccess(inResult,false);
                        }),
                        dojo.hitch(this, "saveFailed"));

      } catch(e) {
          console.error('ERROR IN saveButtonClick: ' + e);
      }
  },
    saveSuccess: function(inResult, deploying) {
    var selectedIndex = this.deploymentList.getSelectedIndex();
        var data = this.generateCurrentDeploymentDataStruct();
    data.deploymentId = inResult;
    this.deploymentListVar.setValue("dataValue", data);
    this.editPanel.clearDirty();
    this.deploymentList._cupdating = true;
    this.deploymentList.select(selectedIndex);
    this.deploymentList._cupdating = false;
    this.refreshStudioDeploymentsMenu();

    if (!deploying) {
        studio.endWait();
        app.toastSuccess(this.getDictionaryItem("TOAST_SAVE_SUCCESS"));
    }
    },
    refreshStudioDeploymentsMenu: function() {
    var newData = [];
    var data = this.deploymentListVar.getData()
    for (var i = 0; i < data.length; i++) {
        newData.push(data[i].dataValue);
    }
    studio._deploymentData = newData;
    studio.updateDeploymentsMenu();

    },
    saveFailed: function(inError) {
    studio.endWait();
    app.toastError(this.getDictionaryItem("TOAST_SAVE_FAILED", {error: inError.message}));
    },
    deploymentListPopupMenuOpen: function(inSender,inEvent) {
    var target = inEvent.target;
    while (target && target.tagName != "BODY" && !dojo.hasClass(target,"wmlist-item"))
        target = target.parentNode;
    if (!target) return;
    var index = dojo.indexOf(target.parentNode.childNodes, target);
    if (index != -1) {
        this._contextMenuIndex = index;
        this.deploymentListPopupMenu.update(inEvent);
    }
    },
    contextDeploy: function() {
    this.deploy(this.deploymentListVar.getItem(this._contextMenuIndex).getValue("dataValue"));
    },
  deployButtonClick: function(inSender) {
      var data = this.generateCurrentDeploymentDataStruct();
      studio.deploymentService.requestAsync("save", [data],
                        dojo.hitch(this, function(inResult) {
                        this.saveSuccess(inResult,true);
                        var selectedIndex = this.deploymentList.getSelectedIndex();
                        var dataAfterSave = this.deploymentListVar.getItem(selectedIndex).getValue("dataValue");
                        this.deploy(dataAfterSave);
                        }),
                        dojo.hitch(this, "saveFailed"));
  },

    deployAfterVerifyingNoChanges: function(inData) {
    var databases = {};
    var databaseCount = 0;
    var components = studio.application.getServerComponents();
    dojo.forEach(components, dojo.hitch(this, function(c,i) {
        if (c instanceof wm.DataModel) {

        studio.dataService.requestSync(
            LOAD_CONNECTION_PROPS_OP,
            [c.dataModelName],
            dojo.hitch(this, function(inData) {
            var l = parseConnectionUrl(inData.connectionUrl, inData);
            if (l)
                var connection = {dbtype: l[0],
                          host: l[1],
                          port: l[2],
                          db: l[3]};
            if (connection.dbtype != "HSQLDB") {
                databases[c.name] = c;
                databaseCount++;
            }
            }));
        }
    }));

    var invalid = false;
    if (databaseCount != inData.databases.length) {
        invalid = true;
    } else {
        for (var i = 0; i < inData.databases.length; i++) {
        if (!databases[inData.databases[i].dataModelId]) {
            invalid = true;
        }
        }
    }
    if (invalid) {
        studio.endWait();
        this.initDeploymentListVar();
        this.owner.owner.show();
        for (var i = 0; i < this.deploymentListVar.getCount(); i++) {
        if (this.deploymentListVar.getItem(i).getValue("dataValue").deploymentId == inData.deploymentId) {
            this.deploymentList.select(i);
            //this.deploymentListSelect(this.deploymentList, this.deploymentList.getItem(i),true);
        }
        }
    } else {
        this.deploy(inData);
    }
    },

    /* When deploy is called, show a confirmation dialog with the deployment settings */
  deploy: function(inData) {
      try {
          if (inData.deploymentType == this.FILE_DEPLOY) {
              this.deploy2(inData);
          } else {
              studio.endWait();
              app.confirm(this.getDictionaryItem("CONFIRM_DEPLOY_HEADER") + this.generateDeploymentHTMLSynopsis(inData), false,
                dojo.hitch(this, function() {
                  if (inData.deploymentType == this.CJ_DEPLOY) {
                      this.cloudJeeDeployConfirmed(inData);
                      this.cleanupCFDeployCheckboxes();
                  } else {
                      this.deploy2(inData);
                  }
                }),
                dojo.hitch(this, function() {
                  if (inData.deploymentType == this.CJ_DEPLOY) {
                      this.cleanupCFDeployCheckboxes();
                  }
                })
              );
              app.confirmDialog.setWidth("450px");
              if (inData.deploymentType == this.CJ_DEPLOY) {
                  this._updateSchemaCheckboxes = {};
                  this._updateSchemaCheckboxesValue = {};
                  var databases = {};
                  // Only show the checkboxes if an existing database has been selected
                  var showCheckboxes = false;
                  if (this.currentDatabaseBoxes.length) {
                      dojo.forEach(this.currentDatabaseBoxes, function(dataBox) {
                        var id = dataBox.name.match(/(\d+)$/)[1];
                          var databaseEditor = this["databaseCloudJeeNameEditor" + id];
                          databases[dataBox.dataModel.dataModelName] = {updateSchema: false, /*databaseEditor.selectedItem.isEmpty()*/
                                                                        name: databaseEditor.getDataValue()};
                          if (databaseEditor.selectedItem && !databaseEditor.selectedItem.isEmpty()) showCheckboxes = true;
                      }, this);
                  } else if (inData.databases && inData.databases.length) {
                      dojo.forEach(inData.databases, function(d) {
                        showCheckboxes = true;
                        databases[d.dataModelId] = {updateSchema: false,
                                                    name: d.dbName};
                      });
                  }
                  /* Was a label, but in order to get the nice tooltips, changed it into a readonly editor */
                  this._alertLabel = new wm.Text({
                      owner: this,
                      parent: app.confirmDialog.containerWidget.c$[0],
                      showing: showCheckboxes,
                      width: "200px",
                      caption: "",
                      readonly: true,
                      helpText:  this.getDictionaryItem("CHECKBOX_UPDATE_SCHEMA_HELP"),
                      dataValue: this.getDictionaryItem("CHECKBOX_UPDATE_SCHEMA")
                  });
                  wm.forEachProperty(databases, dojo.hitch(this, function(inValue, inName) {

                      var c = new wm.Checkbox({
                          owner: this,
                          parent: app.confirmDialog.containerWidget.c$[0],
                          showing: showCheckboxes,
                          "_classes": {
                              "domNode": ["StudioEditor"]
                          },
                          caption: inName + ": " + inValue.name,
                          startChecked: inValue.updateSchema,
                          width: "240px",
                          captionSize: "100%",
                          minEditorWidth: 32,
                          captionAlign: "left",
                          captionPosition: "right",
                          name: "confirmUpdateSchemaCheckbox" + inName
                      });
                      this._updateSchemaCheckboxes[inName] = c;
                  }));
                  /*
              this._updateSchemaCheckbox = new wm.Checkbox({owner: this,
                                    parent: app.confirmDialog.containerWidget.c$[0],
                                    "_classes":{"domNode":["wm_FontColor_White"]},
                                    caption: this.getDictionaryItem("CHECKBOX_UPDATE_SCHEMA"),
                                    helpText: this.getDictionaryItem("CHECKBOX_UPDATE_SCHEMA_HELP"),
                                    startChecked: false,
                                    width: "240px",
                                    captionSize: "100%",
                                    minEditorWidth: 32,
                                    captionAlign: "left",
                                    captionPosition: "right",
                                    name: "confirmUpdateSchemaCheckbox"});

              this._updateSchemaCheckbox.captionNode.style.color = "white";
              */

          }
      }
  } catch (e) {
      console.error('ERROR IN deployButtonClick: ' + e);
  }
  },
  cleanupCFDeployCheckboxes: function() {
      if (this._alertLabel) {
          this._alertLabel.destroy();
          delete this._alertLabel;
      }
      wm.forEachProperty(this._updateSchemaCheckboxes, dojo.hitch(this, function(inCheckbox, inName) {
          inCheckbox.destroy();
      }));
      delete this._updateSchemaCheckboxes;
  },
  cloudJeeDeployConfirmed: function(inData) {
        //this._updateSchema = this._updateSchemaCheckbox ? this._updateSchemaCheckbox.getChecked() : this._updateSchemaCheckboxValue;

        var updateSchema = {};
        wm.forEachProperty(this._updateSchemaCheckboxes, dojo.hitch(this, function(inCheckbox, inName) {
            updateSchema[inName] = inCheckbox.getChecked();
        }));
        var d = inData.databases;
        for (var i = 0; i < d.length; i++) {
            d[i].updateSchema = updateSchema[d[i].dataModelId];
        }

        if (!inData.token) inData.token = this.getTokenCookie(inData.target);
        this.confirmToken(inData.token, inData.target, dojo.hitch(this, function(inToken) {
            inData.token = inToken;
            this.deploy2(inData);
        }));
    },
    confirmToken: function(inToken, inTargetUrl,inCallback) {
    if (!inToken || !inTargetUrl) {
        studio.endWait(); // in case beginWait was called before confirmToken was called
        this.showCFLogin(inCallback, inTargetUrl);
    } else {
        this.cloudJeeService.requestAsync("listApps", [inToken,inTargetUrl],
                          dojo.hitch(this, function(inData) {
                              inCallback(inToken);
                          }),
                          dojo.hitch(this, function(inData) {
                              studio.endWait(); // in case beginWait was called before confirmToken was called
                              this.showCFLogin(inCallback, inTargetUrl);
                          }));
    }
    },
    showCFLogin: function(inCallback, inTargetUrl) {
        if (inTargetUrl) {
            this.loginDialogTargetEditor.setDataValue(inTargetUrl);
            this.loginDialogTargetEditor.setReadonly(true);
        } else {
            this.loginDialogTargetEditor.setDataValue("https://apps.wavemaker.com");
            this.loginDialogTargetEditor.setReadonly(true);
        }
        this.cjLoginDialog.show();
        this.loginDialogUserEditor.focus();
        this.cjLoginDialogSuccessHandler = inCallback;
    },
    deploy2: function(inData) {
        this._deployData = inData;

        if(inData.deploymentType == this.CJ_DEPLOY){
            studio.beginWait(this.getDictionaryItem("WAIT_CJ_BUILDWAR", {
                 warName: inData.applicationName + ".war"
            }));
        }else{
            studio.beginWait(this.getDictionaryItem("WAIT_DEPLOY", {
                deploymentName: inData.name
            }));
        }

        studio.deploymentService.requestAsync("deploy", [inData], dojo.hitch(this, function(inResult) {
            if(inData.deploymentType == this.CJ_DEPLOY){
                 studio.beginWait(this.getDictionaryItem("WAIT_CJ_DEPLOY", {
                    warName: inData.applicationName + ".war"
                  }));
                 studio.deploymentService.requestAsync("deployWar", [inData], dojo.hitch(this, function(inResult) {
                          this.deploySuccess(inResult, inData);
                  }), dojo.hitch(this, "deployFailed"));
              } else{
                this.deploySuccess(inResult, inData);
              }
        }), dojo.hitch(this, "deployFailed"));

        var type = inData.deploymentType;
        if (type == this.FILE_DEPLOY) type = inData.archiveType;
        studio.trackerImage.setSource("http://wavemaker.com/img/blank.gif?op=" + type + "&v=" + escape(wm.studioConfig.studioVersion) + "&r=" + String(Math.random(new Date().getTime())).replace(/\D/, "").substring(0, 8));
    },
    deploySuccess: function(inResult, inData) {
        studio.endWait();
        if (inResult == "SUCCESS" || inResult.match(/^OK/) || inResult.match(/http:/)) {
            switch (inData.deploymentType) {
            case this.TC_DEPLOY:
                app.alert(this.getDictionaryItem("ALERT_DEPLOY_SUCCESS", {
                    url: this.getTargetUrl(inData),
                    version: studio.application.getFullVersionNumber()
                }));
                break;
            case this.CJ_DEPLOY:
                app.alert(this.getDictionaryItem("ALERT_DEPLOY_SUCCESS", {
                    url: inResult,
                    version: studio.application.getFullVersionNumber()
                }));
                break;
            case this.FILE_DEPLOY:
                app.alert(this.getDictionaryItem("ALERT_FILE_DEPLOY_SUCCESS", {
                    version: studio.application.getFullVersionNumber(),
                    projectName: studio.project.projectName
                }));
                app.alertDialog.setWidth("600px");
                var b = new wm.Button({
                    owner: this,
                    _classes: {
                        domNode: ["StudioButton"]
                    },
                    parent: app.alertDialog.buttonBar,
                    caption: studio.getDictionaryItem("ALERT_DOWNLOAD_BUTTON_CAPTION"),
                    width: "140px"
                });
                b.parent.moveControl(b, 0);
                app.alertDialog.buttonBar.reflow();
                b.connect(b, "onclick", this, function() {
                    app.alertDialog.hide();
                    if (this._deployData.archiveType == "WAR") {
                        studio.downloadInIFrame("services/deploymentService.download?method=downloadProjectWar");
                    } else {
                        studio.downloadInIFrame("services/deploymentService.download?method=downloadProjectEar");
                    }
                });
                app.alertDialog.connectOnce(app.alertDialog, "onClose", function() {
                    b.destroy();
                });



                break;
            }
            studio.application.incSubversionNumber();
            var src = studio.project.generateApplicationSource();
            studio.project.saveProjectData(studio.project.projectName + ".js", src);

            return;
        } else if (inResult.match(/^ERROR\:.*Not enough memory/)) {
            var memory = inResult.match(/\d+[MG]/);
            this.manageCloudJeeButtonClick();
            app.alert(this.getDictionaryItem("ALERT_CF_OUT_OF_MEMORY", {
                memory: memory[0] || "unknown"
            }));
        } else if (inResult.match(/^ERROR.*The URI.*has already been taken or reserved/)) {
            app.alert(this.getDictionaryItem("ALERT_CF_NAME_TAKEN", {
                name: inData.deploymentUrl
            }));
            this.cjUrlEditor.setInvalid();
        } else {
            this.deployFailed({
                message: inResult
            });
        }
    },
    deployFailed: function(inError) {
        studio.endWait();
        app.alert(this.getDictionaryItem("TOAST_DEPLOY_FAILED", {
            error: inError.message
        }));
    },
  copyButtonClick: function(inSender) {
      if (this.getIsDirty()) {
      var copyFunc = dojo.hitch(this, function() {
              var selectedIndex = this.deploymentList.getSelectedIndex();
              this.copyDeployment();
              if (!this.deploymentListVar.getItem(selectedIndex).getValue("dataValue").deploymentId) {
                  this.deploymentListVar.removeItem(selectedIndex);
                  this.deploymentList._cupdating = true;
                  this.deploymentList.select(this.deploymentListVar.getCount()-1);
                  this.deploymentList._cupdating = false;
              }
      });
          this.confirmSaveDialog.show();
          this.saveDialogDontSaveButton.onclick = dojo.hitch(this, function() {
          this.confirmSaveDialog.hide();
          copyFunc();
          });

          this.saveDialogCancelButton.onclick = dojo.hitch(this, function() {
          this.confirmSaveDialog.hide();
          });

          this.saveDialogSaveButton.onclick = dojo.hitch(this, function() {
          var c1 = dojo.connect(this, "saveSuccess", this, function() {
              this.confirmSaveDialog.hide();
              copyFunc();
              dojo.disconnect(c1);
              dojo.disconnect(c2);
          });
          var c2 = dojo.connect(this, "saveFailed", this, function() {
              dojo.disconnect(c1);
              dojo.disconnect(c2);
          });
          this.saveButtonClick();
          });

/*
      app.confirm(this.getDictionaryItem("CONFIRM_UNSAVED_CHANGES"), false,
              dojo.hitch(this, function() {
              var selectedIndex = this.deploymentList.getSelectedIndex();
              this.copyDeployment();
              if (!this.deploymentListVar.getItem(selectedIndex).getValue("dataValue").deploymentId) {
                  this.deploymentListVar.removeItem(selectedIndex);
                  this.deploymentList.selectByIndex(this.deploymentListVar.getCount()-1);
              }
              })
             );
             */
      } else {
      this.copyDeployment();
      }
  },
  copyDeployment: function() {
      try {

          var nameEditor;
      switch(this.settingLayers.getActiveLayer()) {
      case this.tomcatLayer:
          nameEditor = this.tcDeploymentNameEditor;
          break;

      case this.cloudJeeLayer:
          nameEditor = this.cjDeploymentNameEditor;
          break;
      case this.appFileLayer:
          nameEditor = this.appFileLayer;
          break;
      }
      var name = nameEditor.getDataValue() + " Copy";

      this.setUniqueDeploymentName(name, nameEditor, this.deploymentList.selectedItem.getValue("dataValue").deploymentType);
      } catch(e) {
          console.error('ERROR IN copyButtonClick: ' + e);
      }
  },
    getTargetUrl: function(inData) {
        if (inData.deploymentType == this.CJ_DEPLOY) {
            return inData.deploymentUrl;
        } else if (inData.deploymentType == this.TC_DEPLOY) {
            return "http://" + inData.host + ":" + inData.port + "/" + inData.applicationName;
        } else {
            return "";
        }
    },
    generateDeploymentHTMLSynopsis: function(inData) {
        if (!inData) {
            var i = this.deploymentList.getSelectedIndex();
            var data = this.deploymentListVar.getItem(i).getValue("dataValue");
        } else {
            data = inData;
        }
        var name = data.name;
        var target = this.getTargetUrl(inData);
        var type = "";
        if (data.deploymentType == this.CJ_DEPLOY) {
            type = "WaveMaker Cloud";
        } else if (data.deploymentType == this.TC_DEPLOY) {
            type = "Tomcat";
        } else if (data.deploymentType == this.FILE_DEPLOY) {
            type = "File Generation";
        }
        var html = "";
        html += "<table style='margin-left: 30px;margin-top:15px;'>";
        html += "<tr><td style='width:100px;vertical-align:top'>" + this.getDictionaryItem("SYNOPSIS_NAME") + "</td><td>" + name + "</td></tr>";
        if (target) html += "<tr><td>" + this.getDictionaryItem("SYNOPSIS_TARGET") + "</td><td>" + target + "</td></tr>";
        html += "<tr><td>" + this.getDictionaryItem("SYNOPSIS_TYPE") + "</td><td>" + type + "</td></tr>";
        /*dojo.forEach(data.databases, dojo.hitch(this, function(database, i) {
            var connection;
            if (database.jndiName) {
                html += "<tr><td>" + database.dataModelId + "</td><td>JNDI:" + database.jndiName + "</td></tr>";
            } else if (database.connectionUrl) {
                var l = parseConnectionUrl(database.connectionUrl, database);
                if (l) {
                    var connection = {
                        dbtype: l[0],
                        host: l[1],
                        port: l[2],
                        db: l[3]
                    };
                    html += "<tr><td>" + database.dataModelId + "</td><td>" + (connection.dbtype == "HSQLDB" ? "HSQLDB" : connection.host) + "</td></tr>";
                } else {
                    html += "<tr><td>" + database.dataModelId + "</td><td>" + database.dbName + "</td></tr>";
                }
            }
        }));*/
        return html;
    },
  deleteButtonClick: function(inSender) {
      try {
          var i = this.deploymentList.getSelectedIndex();
          var item = this.deploymentList.selectedItem.getValue("dataValue");

      var deleteFunc = dojo.hitch(this, function() {
          var onsuccess = dojo.hitch(this, function() {
          dojo.forEach(this.currentDatabaseBoxes, function(w) {
              w.destroy();
          });
          dojo.forEach(this.hsqldbDatabaseBoxes, function(w) {
              w.destroy();
          });

          this.defaultLayer.activate();
          this._currentDeploymentIndex = -1;
          this.refreshStudioDeploymentsMenu();
          studio.endWait();
          });

          this.deploymentListVar.removeItem(i);
          if (item.deploymentId) {
          studio.beginWait(this.getDictionaryItem("DELETING"));
          studio.deploymentService.requestAsync("delete", [item.deploymentId], onsuccess);
          } else {
          onsuccess();
          }
      });
      if (item.deploymentId)
          app.confirm(this.getDictionaryItem("CONFIRM_DELETE_HEADER") + this.generateDeploymentHTMLSynopsis(item), false, deleteFunc);
      else
          deleteFunc();
      } catch(e) {
          console.error('ERROR IN deleteButtonClick: ' + e);
      }
  },
/*
    contextDelete: function() {
    var data = this.deploymentListVar.getItem(this._contextMenuIndex).getValue("dataValue");
    app.confirm(this.getDictionaryItem("CONFIRM_DELETE_HEADER") + this.generateDeploymentHTMLSynopsis(data), false, dojo.hitch(this, function() {
        var selectedIndex = this.deploymentList.getSelectedIndex();

            this.deploymentListVar.removeItem(this._contextMenuIndex);

        if (selectedIndex == this._contextMenuIndex) {
          dojo.forEach(this.currentDatabaseBoxes, function(w) {
          w.destroy();
          });
        dojo.forEach(this.hsqldbDatabaseBoxes, function(w) {
            w.destroy();
        });

        this._currentDeploymentIndex = -1;
        } else if (selectedIndex > this._contextMenuIndex) {
        this.deploymentList.selectByIndex(selectedIndex-1);
        this._currentDeploymentIndex = selectedIndex-1;
        } else {
        this.deploymentList.selectByIndex(selectedIndex);
        this._currentDeploymentIndex = selectedIndex;
        }
        this.refreshStudioDeploymentsMenu();
    }));
    },
    */
  addButtonClick: function(inSender) {
      if (this.getIsDirty()) {
/*
      app.confirm(this.getDictionaryItem("CONFIRM_UNSAVED_CHANGES"), false,
              dojo.hitch(this, function() {
              var selectedIndex = this.deploymentList.getSelectedIndex();
              if (!this.deploymentListVar.getItem(selectedIndex).getValue("dataValue").deploymentId) {
                  this.deploymentListVar.removeItem(selectedIndex);
                  this.deploymentList.selectByIndex(this.deploymentListVar.getCount()-1);
              }

              this.newDeploymentDialog.show();
              }));
              */

      var notSavedFunc = dojo.hitch(this, function() {
              var selectedIndex = this.deploymentList.getSelectedIndex();
              if (!this.deploymentListVar.getItem(selectedIndex).getValue("dataValue").deploymentId) {
                  this.deploymentListVar.removeItem(selectedIndex);
                  this.deploymentList._cupdating = true;
                  this.deploymentList.selectByIndex(this.deploymentListVar.getCount()-1);
                  this.deploymentList._cupdating = false;
              }
      });
          this.confirmSaveDialog.show();
          this.saveDialogDontSaveButton.onclick = dojo.hitch(this, function() {
          this.confirmSaveDialog.hide();
          notSavedFunc();
          this.newDeploymentDialog.show();
          });

          this.saveDialogCancelButton.onclick = dojo.hitch(this, function() {
          this.confirmSaveDialog.hide();
          });

          this.saveDialogSaveButton.onclick = dojo.hitch(this, function() {
          var c1 = dojo.connect(this, "saveSuccess", this, function() {
              this.confirmSaveDialog.hide();
              notSavedFunc();
              dojo.disconnect(c1);
              dojo.disconnect(c2);
              this.newDeploymentDialog.show();
          });
          var c2 = dojo.connect(this, "saveFailed", this, function() {
              dojo.disconnect(c1);
              dojo.disconnect(c2);
          });
          this.saveButtonClick();
          });

      } else {
          this.newDeploymentDialog.show();
      if (dojo.isIE == 8)
          wm.onidle(this.newDeploymentDialog, "reflow");
      }
  },
    onNewDeployOk: function() {
        this._openningDeployment = true;
        var groupvalue = this.tomcatRadio.getGroupValue();
        switch (groupvalue) {
        case "tc":
            this.editPanel.clearData(); // insures that even hidden editors no longer flag as invalid or dirty
            this.newTomcatDeploy();
            break;
        case "cj":
            this.editPanel.clearData(); // insures that even hidden editors no longer flag as invalid or dirty
            this.newCloudJeeDeploy();
            break;
        case "files":
            this.editPanel.clearData(); // insures that even hidden editors no longer flag as invalid or dirty
            this.newAppFileDeploy();
            break;
        }
        this.newDeploymentDialog.hide();
        this.owner.owner.show();
        this._openningDeployment = false;
    },
    onNewDeployCancel: function() {
        this.newDeploymentDialog.hide();
    },




    updateDbConnectionUrl: function(inSender) {
        var name = inSender.name;
        var number = name.match(/(\d+)$/);
        number = number[1];

        var box = this["databasePanel" + number];
        var designConnectionUrl = box.dataProperties.connectionUrl;
        var data = parseConnectionUrl(designConnectionUrl);
        if (data) {
            var extrasField = data[3];
            if (designConnectionUrl.toLowerCase().indexOf("hsqldb") != 0) {
                extrasField = this["databaseNameEditor" + number].getDataValue();
            }
        }
        var result = buildConnectionUrl(this["databaseTypeEditor" + number].getDataValue(), this["databaseHostEditor" + number].getDataValue(), this["databasePortEditor" + number].getDataValue(), extrasField);
        this["databaseURLEditor" + number].setDataValue(result);
    },
    updateDatabaseLayers: function(inSender) {
        var name = inSender.name;
        var number = name.match(/(\d+)$/);
        number = number[1];
        if (inSender.getDataValue() == "JNDI") {
            this["databaseJNDILayer" + number].activate();
        } else if (inSender.getDataValue() == "Standard") {
            this["databaseConnectionsLayer" + number].activate();
        }

    },
    setUniqueDeploymentName: function(inName, inEditor, inType) {
        if (this.deploymentListVar.getCount() == 0) this.initDeploymentListVar();
        this.deploymentList.deselectAll();
        var match = false;
        var data = this.deploymentListVar.getData() || [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].name == inName) {
                match = true;
                break;
            }
        }
        if (match) {
            var number = inName.match(/(\d+)\s*$/);
            if (number) {
                number = parseInt(number[1]) + 1;
                inName = inName.replace(/\s*(\d+)\s*$/, " " + number);
            } else {
                number = 1;
                inName = inName.replace(/\s*$/, " " + number);
            }

            return this.setUniqueDeploymentName(inName, inEditor, inType);
        } else {
            inEditor.setDataValue(inName);
            var deploymentDescriptor = {
                "applicationName": studio.project.projectName,
                "archiveType": "WAR",
                "databases": [],
                "deploymentId": null,
                "deploymentType": inType,
                "host": null,
                "name": inName,
                "port": 0,
                "target": null,
                "token": null
            };
            this.deploymentListVar.addItem({
                name: inName,
                dataValue: deploymentDescriptor
            });
            this._selectingListItem = true;
            this.deploymentList._cupdating = true;
            this.deploymentList.select(this.deploymentListVar.getCount() - 1);
            this.deploymentList._cupdating = false;
            this._currentDeploymentIndex = this.deploymentList.getSelectedIndex();

            delete this._selectingListItem;
            return inName;
        }

    },
    getDbProps: function(inDataModel) {


    },
    generateDataModelBoxes: function() {
        dojo.forEach(this.currentDatabaseBoxes, function(w) {
            w.destroy();
        });
        dojo.forEach(this.hsqldbDatabaseBoxes, function(w) {
            w.destroy();
        });

        this.currentDatabaseBoxes = [];
        this.hsqldbDatabaseBoxes = [];
        var components = studio.application.getServerComponents();
        var nonHSQLDBCount = 0;
        dojo.forEach(components, dojo.hitch(this, function(c, i) {
            if (c instanceof wm.DataModel) {

                studio.dataService.requestSync(
                LOAD_CONNECTION_PROPS_OP, [c.dataModelName], dojo.hitch(this, function(inData) {
                    var l = parseConnectionUrl(inData.connectionUrl, inData);
                    if (l) var connection = {
                        dbtype: l[0],
                        host: l[1],
                        port: l[2],
                        db: l[3]
                    };
                    if (connection.dbtype != "HSQLDB") {
                        nonHSQLDBCount++;
                        var box = this.editPanel.createComponents(this.databaseBox, this)[0];
                        box.dataModel = c;
                        box.dataProperties = inData;
                        box.dataConnection = connection;
                        box.setTitle(this.getDictionaryItem("DATABASE_BOX_TITLE", {
                            databaseName: c.dataModelName
                        }));
                        /*if (nonHSQLDBCount > 1) {
                this["databaseCloudJeeWarnings" + nonHSQLDBCount].setShowing(true);
                }*/
                        this.currentDatabaseBoxes.push(box);
                    } else {
                        var box = this.editPanel.createComponents(this.hsqldbBox, this)[0];
                        box.setTitle(this.getDictionaryItem("DATABASE_BOX_TITLE", {
                            databaseName: c.dataModelName
                        }));
                        this.hsqldbDatabaseBoxes.push(box);
                    }
                }));
            }
        }));

        return this.currentDatabaseBoxes;
    },
	generatePortMappingBox: function() {
		if (this.deploymentList.selectedItem.getValue("dataValue.deploymentType") === this.CJ_DEPLOY ||
			!studio.application.isSSLUsed) {
			if (this.currentPortMappingBox) this.currentPortMappingBox.hide();
			return null;
		}

        //this.currentPortMappingBox.destroy();

        //this.currentPortMappingBox = {};
		if (!this.currentPortMappingBox) {
			var box = this.editPanel.createComponents(this.portMappingBox, this)[0];
			box.setTitle(this.getDictionaryItem("PORT_MAPPING_BOX_TITLE"));		
			this.currentPortMappingBox = box;
		}
		// TODO: set readonly true/false on port editor based on whether its a tomcat or generate war deployment
        this.currentPortMappingBox.show();
        this.httpPortEditor.setReadonly(this.deploymentList.selectedItem.getValue("dataValue.deploymentType") === this.TC_DEPLOY);
		return this.currentPortMappingBox;
    },
    populateDataModelBoxesStandard: function() {
        dojo.forEach(this.currentDatabaseBoxes, dojo.hitch(this, function(b, i) {
            var dataModel = b.dataModel;
            var inData = b.dataProperties;
            var connection = b.dataConnection;
            this["databaseLayers" + (i + 1)].setLayerIndex(0);
            this["databaseConnectionEditor" + (i + 1)].setDataValue("Standard");


            if (connection) {
                this["databaseTypeEditor" + (i + 1)].setDataValue(connection.dbtype);
                this["databaseUserEditor" + (i + 1)].setDataValue(inData.username);
                this["databasePasswordEditor" + (i + 1)].setDataValue(inData.password);
                this["databaseHostEditor" + (i + 1)].setDataValue(connection.host);
                this["databasePortEditor" + (i + 1)].setDataValue(connection.port);
                this["databaseNameEditor" + (i + 1)].setDataValue(connection.db);
                this["databaseJNDINameEditor" + (i + 1)].setDataValue(connection.db);
            }
        }));

        this.editPanel.reflow();
    },

    /* Used for tomcat and app file, but NOT cloudfoundry; populates editors and sets the layers for each database spec */
    populateDataModelBoxes: function(inDatabases) {
        dojo.forEach(this.currentDatabaseBoxes, dojo.hitch(this, function(b, i) {
            var dataModel = b.dataModel;

            for (var k = 0; k < inDatabases.length; k++) {
                if (inDatabases[k].dataModelId == dataModel.name) {
                    var inData = inDatabases[k];
                }
            }
            if (!inData) return;

            var connection;
            if (inData.connectionUrl) {
                var l = parseConnectionUrl(inData.connectionUrl.replace(/\\/g, ""), inData);
                connection = {
                    dbtype: l[0],
                    host: l[1],
                    port: l[2],
                    db: l[3]
                };
            }

            if (inData.jndiName) {
                this["databaseConnectionEditor" + (i + 1)].setDataValue("JNDI");
                this["databaseLayers" + (i + 1)].setLayerIndex(1);
                this["databaseJNDINameEditor" + (i + 1)].setDataValue(inData.jndiName);
            } else {
                this["databaseConnectionEditor" + (i + 1)].setDataValue("Standard");
                this["databaseLayers" + (i + 1)].setLayerIndex(0);
                this["databaseJNDINameEditor" + (i + 1)].setDataValue(dataModel.name);
            }

            this["databaseTypeEditor" + (i + 1)].setDataValue(connection.dbtype);
            if (l) {
                this["databaseUserEditor" + (i + 1)].setDataValue(inData.username);
                this["databasePasswordEditor" + (i + 1)].setDataValue(inData.password);
                if (connection.dbtype == "HSQLDB") {
                    this["databaseHostEditor" + (i + 1)].hide();
                    this["databasePortEditor" + (i + 1)].hide();
                    this["databaseNameEditor" + (i + 1)].setRequired(true);
                    this["databaseNameEditor" + (i + 1)].setCaption(this.getDictionaryItem("HSQLDB_DATABASE_NAME_CAPTION"));
                } else {
                    this["databaseHostEditor" + (i + 1)].setDataValue(connection.host);
                    this["databasePortEditor" + (i + 1)].setDataValue(connection.port);
                }
                this["databaseNameEditor" + (i + 1)].setDataValue(connection.db);
            }
        }));
        this.editPanel.reflow();
    },

	populatePortMappingBoxStandard: function() {
		studio.securityConfigService.requestAsync("getPortMapping", null,
				dojo.hitch(this, function(inResult) {
					this.httpPortEditor.setDataValue(inResult.http);
					this.httpsPortEditor.setDataValue(inResult.https);
				}));
					
	},

	populatePortMappingBox: function(inData) {
	   if (this.httpsPortEditor && inData.httpsPort) {
    		this.httpPortEditor.setDataValue(this.deploymentList.selectedItem.getValue("dataValue.deploymentType") === this.TC_DEPLOY ? inData.port : inData.httpPort);
    		this.httpsPortEditor.setDataValue(inData.httpsPort);    		
    	}
	},
    portChanged: function(inSender, inDisplayValue, inDataValue) {
        if (this.deploymentList.selectedItem.getValue("dataValue.deploymentType") === this.TC_DEPLOY && this.httpPortEditor && studio.application.isSSLUsed) {
            this.httpPortEditor.setDataValue(inDataValue);
        }
    },
    newTomcatDeploy: function() {
        this.editLayer.activate();
        this.tomcatLayer.activate();
        var targetName = this.setUniqueDeploymentName("Tomcat 1", this.tcDeploymentNameEditor, this.TC_DEPLOY);
        this.tcHostEditor.setDataValue("localhost");
        this.tcPortEditor.setDataValue(window.location.port); // good values for deploying to localhost, bad for deploying to almost anything else
        this.tcNameEditor.setDataValue(studio.project.projectName);
        this.tcUserEditor.setDataValue("manager");
        this.tcPasswordEditor.setDataValue("manager");

		var box = this.generatePortMappingBox();
		this.populatePortMappingBoxStandard();
        var boxes = this.generateDataModelBoxes();
        this.populateDataModelBoxesStandard();
    },
    populateTomcatDeploy: function(inData) {
        this.editLayer.activate();
        this.tomcatLayer.activate();
        this.tcDeploymentNameEditor.setDataValue(inData.name);
        this.tcDeploymentTypeEditor.setDataValue("Tomcat Server");
        this.tcHostEditor.setDataValue(inData.host);
        this.tcPortEditor.setDataValue(inData.port);
        this.tcNameEditor.setDataValue(inData.applicationName);
        this.tcUserEditor.setDataValue(inData.username);
        this.tcPasswordEditor.setDataValue(inData.password);

        var box = this.generatePortMappingBox();
		this.populatePortMappingBox(inData);
		var boxes = this.generateDataModelBoxes();
        this.populateDataModelBoxes(inData.databases);
    },



    newAppFileDeploy: function() {
        this.editLayer.activate();
        this.appFileLayer.activate();
        var targetName = this.setUniqueDeploymentName("File 1", this.fileDeploymentNameEditor, this.FILE_DEPLOY);
        this.warRadioButton.setChecked(true);
		var box = this.generatePortMappingBox();
		this.populatePortMappingBoxStandard();
        var boxes = this.generateDataModelBoxes();
        this.populateDataModelBoxesStandard();

    },
    populateAppFileDeploy: function(inData) {
        this.editLayer.activate();
        this.appFileLayer.activate();
        this.fileDeploymentNameEditor.setDataValue(inData.name);
        this.warRadioButton.setGroupValue(inData.archiveType);
		var box = this.generatePortMappingBox();
		this.populatePortMappingBox(inData);
        var boxes = this.generateDataModelBoxes();
        this.populateDataModelBoxes(inData.databases);
    },
    newCloudJeeDeploy: function() {
        this.editLayer.activate();
        this.owner.owner.show();
        this.cloudJeeLayer.activate();
        var targetName = this.setUniqueDeploymentName("CloudJee 1", this.cjDeploymentNameEditor, this.CJ_DEPLOY);
        this.cjHostEditor.setDataValue("");
        this.cjNameEditor.setDataValue(studio.project.projectName);
        this.cjUrlEditor.setDataValue("");
        this.cjDeploymentTypeEditor.setDataValue("WaveMaker Cloud");

		var boxes = this.generateDataModelBoxes();
        dojo.forEach(boxes, dojo.hitch(this, function(b, i) {
            var dataModel = b.dataModel;
            var connection = b.dataConnection;
            if (connection.dbtype.toLowerCase() != "mysql" && connection.dbtype.toLowerCase() != "postgresql") app.alert(this.getDictionaryItem("ALERT_INVALID_DB_TYPE", {
                name: connection.dbtype
            }));
            this["databaseLayers" + (i + 1)].setLayerIndex(2);
            if (studio.isCloud()) {
                this["databaseCloudJeeNameEditor" + (i + 1)].setDataValue(dataModel.dataModelName);
            } else {
                this["databaseCloudJeeNameEditor" + (i + 1)].setDataValue(connection.db);
            }

            this["databaseCloudJeeNameEditor" + (i + 1)].setDataValue(connection.db);
            this["databaseCloudJeeType" + (i + 1)].setDataValue(connection.dbtype);
            this["databaseConnectionEditor" + (i + 1)].hide();
        }));
        
        if (this.portMappingPanel) this.portMappingPanel.hide();

        this.editPanel.reflow();
        
        /* onidle insures that this dialog is on top */
        wm.onidle(this, function() {
            this.loginDialogTargetEditor.setReadonly(false);
            this.showCFLogin(dojo.hitch(this, "loadDatabaseServices"), "");
        });
    },

    populateCloudJeeDeploy: function(inData) {
        this.editLayer.activate();
        this.cloudJeeLayer.activate();

        this.cjDeploymentNameEditor.setDataValue(inData.name);
        this.cjDeploymentTypeEditor.setDataValue("WaveMaker Cloud");
        this.cjNameEditor.setDataValue(inData.applicationName);
        this.cjHostEditor.setDataValue(inData.target);
        this.cjUrlEditor.setDataValue(inData.deploymentUrl);
        var boxes = this.generateDataModelBoxes();

        dojo.forEach(boxes, dojo.hitch(this, function(b, i) {
            var dataModel = b.dataModel;
            var inDbData;
            dojo.forEach(inData.databases, dojo.hitch(this, function(db) {
                if (db.dataModelId == dataModel.name) inDbData = db;
            }));
            this["databaseLayers" + (i + 1)].setLayerIndex(2);
            if (inDbData) {
                this["databaseCloudJeeNameEditor" + (i + 1)].setDataValue(inDbData.dbName);
                this["databaseConnectionEditor" + (i + 1)].hide();
            } else {
                this["databaseCloudJeeNameEditor" + (i + 1)].setDataValue(dataModel.name);
                this["databaseConnectionEditor" + (i + 1)].hide();
            }
        }));

        if (this.portMappingPanel) this.portMappingPanel.hide();

        this.editPanel.reflow();            
        var target = this.cjHostEditor.getDataValue();
        var token = this.getTokenCookie(target);
        this.confirmToken(token, target, dojo.hitch(this, "loadDatabaseServices"));
    },

    getIsDirty: function() {
        if (this._currentDeploymentIndex < 0 || this.deploymentListVar.getCount() == 0) return false;
        return this.editPanel.getIsDirty() || this._currentDeploymentIndex >= 0 && !this.deploymentListVar.getItem(this._currentDeploymentIndex).getValue("dataValue").deploymentId;
    },
    deploymentListSelect: function(inSender, inItem, forceSelect) {
        if (inItem) this.editLayer.activate();
        if (!this._selectingListItem) {
            // if its dirty, or never been saved, confirm the user wants to lose changes
            if (!forceSelect && this.getIsDirty()) {

                var newIndex = this.deploymentList.getSelectedIndex();
                var oldSelectedIndex = this._currentDeploymentIndex;
                var selectFunc = dojo.hitch(this, function() {
                    this._currentDeploymentIndex = newIndex;
                    this.openDeployment(inSender.selectedItem.getData().dataValue);
                    if (oldSelectedIndex >= 0 && !this.deploymentListVar.getItem(oldSelectedIndex).getValue("dataValue").deploymentId) {
                        this.deploymentListVar.removeItem(oldSelectedIndex);
                        this.deploymentList._cupdating = true;
                        this.deploymentList.select(this._currentDeploymentIndex);
                        this.deploymentList._cupdating = false;
                    }
                });
                this.confirmSaveDialog.show();
                this.saveDialogDontSaveButton.onclick = dojo.hitch(this, function() {
                    this.confirmSaveDialog.hide();
                    selectFunc();
                });

                this.saveDialogCancelButton.onclick = dojo.hitch(this, function() {
                    this.deploymentList._cupdating = true;
                    this.deploymentList.select(this._currentDeploymentIndex);
                    this.deploymentList._cupdating = false;
                    this.confirmSaveDialog.hide();
                });

                this.saveDialogSaveButton.onclick = dojo.hitch(this, function() {
                    var c1 = dojo.connect(this, "saveSuccess", this, function() {
                        this.confirmSaveDialog.hide();
                        this.deploymentList._cupdating = true;
                        this.deploymentList.select(newIndex);
                        this.deploymentList._cupdating = false
                        selectFunc();
                        dojo.disconnect(c1);
                        dojo.disconnect(c2);
                    });
                    var c2 = dojo.connect(this, "saveFailed", this, function() {
                        dojo.disconnect(c1);
                        dojo.disconnect(c2);
                    });
                    this.deploymentList._cupdating = true;
                    this.deploymentList.select(this._currentDeploymentIndex);
                    this.deploymentList._cupdating = false
                    this.saveButtonClick();
                });
            } else {
                this._currentDeploymentIndex = this.deploymentList.getSelectedIndex();
                this.openDeployment(inSender.selectedItem.getData().dataValue);
            }
        }
    },
    openDeployment: function(data) {
        this._openningDeployment = true;
        this.editPanel.clearData(); // insures that even hidden editors no longer flag as invalid or dirty
        switch (data.deploymentType) {
        case this.TC_DEPLOY:
            this.populateTomcatDeploy(data);
            this.manageUndeployButton.hide();
            break;
        case this.CJ_DEPLOY:
            this.populateCloudJeeDeploy(data);
            this.manageUndeployButton.show();
            break;
        case this.FILE_DEPLOY:
            this.populateAppFileDeploy(data);
            this.manageUndeployButton.hide();
            break;
        }
        this._openningDeployment = false;
    },
    deploymentNameChange: function(inSender) {
        if (this._openningDeployment) return;
        var value = inSender.getDisplayValue();
        var i = this.deploymentList.getSelectedIndex();
        this.deploymentListVar.getItem(i).setValue("name", value);
        this._selectingListItem = true;
        this.deploymentList._cupdating = true;
        this.deploymentList.select(i);
        this.deploymentList._cupdating = false;
        delete this._selectingListItem;
    },


    /* Handling for the cloudfoundry login dialog */
    cjLoginCancelClick: function() {
        this.cloudJeeAppListDialog.hide();
        this.cjLoginDialog.hide();
    },
    cjLoginOkClick: function() {
    studio.beginWait(this.getDictionaryItem("WAIT_LOGGING_IN"));
    this.cloudJeeService.requestAsync(
        "login",
        [this.loginDialogUserEditor.getDataValue(), this.loginDialogPasswordEditor.getDataValue(), this._deployData && this._deployData.target ? this._deployData.target : this.loginDialogTargetEditor.getDataValue()],
        dojo.hitch(this, function(inData) {
            this.setTokenCookie(this.loginDialogTargetEditor.getDataValue(), inData);
            studio.endWait();
            this.cjLoginDialog.hide();
            if (this.cjLoginDialogSuccessHandler) {
                this.cjLoginDialogSuccessHandler(inData);
            }
            var that = this;
            this.cloudJeeService.requestAsync("username",[inData],
              dojo.hitch(this, function(inName){
                      this.cjHostEditor.setDataValue("https://" + inName + ".apps.mywavemaker.com");
                      this.cjUrlEditor.setDataValue("https://" + inName + ".apps.mywavemaker.com/" + studio.project.projectName);

                       this.setTokenCookie(this.cjHostEditor.getDataValue(), inData);

              }),
              dojo.hitch(this, function(inError) {
                              studio.endWait();
                              var message = inError.message;
                              if (message.match(/^403/)) {
                                  app.toastError(this.getDictionaryItem("INVALID_USER_PASS"));
                              } else {
                                  app.toastError(message);
                              }
               }));


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

    getSelectedDeploymentType: function() {
    if (this.deploymentList.selectedItem)
        var data = this.deploymentList.selectedItem.getData();
    if (data)
        return data.deploymentType;
    },


    refreshCloudJeeAppList: function(optionalCallback, inOptionalTargetUrl) {
    if (inOptionalTargetUrl) {
        this.loginDialogTargetEditor.setDataValue(inOptionalTargetUrl);
    }
    var token = this.getTokenCookie(this.loginDialogTargetEditor.getDataValue());
    this.confirmToken(inOptionalTargetUrl ? token : null, inOptionalTargetUrl, dojo.hitch(this, function(inToken) {
        token = inToken;
        this.deploymentLoadingDialog.widgetToCover = this.cloudJeeAppList;
        this.deploymentLoadingDialog.show();
        this.cloudJeeService.requestAsync("listApps", [token,this.loginDialogTargetEditor.getDataValue()],
                          dojo.hitch(this, function(inResult) {

                              this.populateCloudJeeAppList(inResult, optionalCallback);
                          }),
                          dojo.hitch(this, function(inError) {
                              app.alert(inError);
                              this.deploymentLoadingDialog.hide();
                          }));
    }));
    },
    populateCloudJeeAppList: function(inResult, optionalCallback) {
    var results = [];
    for (var i = 0; i < inResult.length; i++) {
        results.push({id: inResult[i].name, name: "<a href=" + inResult[i].url +" target='_NewWindow'>" + inResult[i].name + "</a>", state: inResult[i].appState/*, services: inResult[i].services ? inResult[i].services.join(", ") : ""*/});
    }
    this.cachedCloudJeeDeploymentList = inResult;
    this.cloudJeeAppList.renderData(results);
    this.deploymentLoadingDialog.hide();
    if (optionalCallback)
        optionalCallback();
    },
    cloudJeeUndeployFromListButtonClick: function() {
    var selectedItem = this.cloudJeeAppList._data[this.cloudJeeAppList.getSelectedIndex()];
    if (!selectedItem) return;
    var name = selectedItem.id;
    if (!name) return;
    var data = {
        "applicationName": name,
        "archiveType": null,
        "databases": null,
        "deploymentId": null,
        "deploymentType": this.CJ_DEPLOY,
        "host": null,
        "name": name,
        "port": 0,
        "target": this.loginDialogTargetEditor.getDataValue(),
        "token": this.getTokenCookie(this.loginDialogTargetEditor.getDataValue())
        };
    app.confirm(this.getDictionaryItem("CONFIRM_UNDEPLOY", {projectName:name}), false, dojo.hitch(this, function(inData){this.undeploy(data);}), function(){return;});
    },
    undeploy: function(inData) {
    studio.beginWait(this.getDictionaryItem("WAIT_UNDEPLOY"));
    this.confirmToken(inData.token, inData.target, dojo.hitch(this, function(inToken) {
        inData.token = inToken;
        studio.deploymentService.requestAsync("undeploy", [inData,false/*this.deleteServicesCheckbox.getChecked()*/],
                          dojo.hitch(this, function(inResult) {
                              studio.endWait();
                              this.refreshCloudJeeAppList(null,this.loginDialogTargetEditor.getDataValue());
                          }),
                          dojo.hitch(this, function(inError) {
                              studio.endWait();
                              app.alert(inError);
                          }));
    }));
    },
    cloudJeeStartFromListButtonClick: function() {
    var selectedItem = this.cloudJeeAppList._data[this.cloudJeeAppList.getSelectedIndex()];
    if (!selectedItem) return;
    var name = selectedItem.id;
    if (!name) return;
    var data = {
        "target": this.loginDialogTargetEditor.getDataValue(),
        "token": this.getTokenCookie(this.loginDialogTargetEditor.getDataValue()),
        "applicationName": name
        };
    this.startApp(data);
    },
    startApp: function(inData) {
    studio.beginWait(this.getDictionaryItem("WAIT_START"));
    this.confirmToken(inData.token, inData.target, dojo.hitch(this, function(inToken) {
        inData.token = inToken;
        this.cloudJeeService.requestAsync("startApplication", [inData.token, inData.target, inData.applicationName],
                          dojo.hitch(this, function(inResult) {
                              studio.endWait();
                              this.refreshCloudJeeAppList(null,this.loginDialogTargetEditor.getDataValue());
                          }),
                          dojo.hitch(this, function(inError) {
                              studio.endWait();
                              app.alert(inError);
                          }));
    }));
    },
    cloudJeeStopFromListButtonClick: function() {
    var selectedItem = this.cloudJeeAppList._data[this.cloudJeeAppList.getSelectedIndex()];
    if (!selectedItem) return;
    var name = selectedItem.id;
    if (!name) return;
    var data = {
        "target": this.loginDialogTargetEditor.getDataValue(),
        "token": this.getTokenCookie(this.loginDialogTargetEditor.getDataValue()),
        "applicationName": name
        };
    this.stopApp(data);
    },
    stopApp: function(inData) {
    studio.beginWait(this.getDictionaryItem("WAIT_STOP"));
    this.confirmToken(inData.token, inData.target, dojo.hitch(this, function(inToken) {
        inData.token = inToken;
        this.cloudJeeService.requestAsync("stopApplication", [inData.token, inData.target, inData.applicationName],
                          dojo.hitch(this, function(inResult) {
                              studio.endWait();
                              this.refreshCloudJeeAppList(null,this.loginDialogTargetEditor.getDataValue());
                          }),
                          dojo.hitch(this, function(inError) {
                              studio.endWait();
                              app.alert(inError);
                          }));
    }));
    },
    cloudJeeAppListCloseButtonClick: function() {
        this.cloudJeeAppListDialog.hide();
    },
    showCloudJeeAppListDialog: function(optionalCallback, optionalTargetUrl) {
        this.cloudJeeAppListDialog.show();
        this.refreshCloudJeeAppList(optionalCallback, optionalTargetUrl);
    },
    manageCloudJeeButtonClick: function() {
        var data = this.deploymentList.selectedItem.getValue("dataValue");
        var selectName;
        if (data) {
            selectName = data.target;
        } else if (this._deployData) {
            selectName = this._deployData.target;
        }
        this.showCloudJeeAppListDialog(dojo.hitch(this, function() {
            if (data) {
                for (var i = 0; i < this.cachedCloudJeeDeploymentList.length; i++) {
                    if (this.cachedCloudJeeDeploymentList[i].name == data.applicationName) {
                        var item = this.cloudJeeAppList.getItem(i);
                        this.cloudJeeAppList.eventSelect(item);
                        break;
                    }
                }
            }
        }), selectName);
    },
    cloudJeeTargetChange: function(inSender, inDisplayValue, inDataValue) {
        if (inDisplayValue.match(/^https\:\/\/api\./)) {
            var hostname = (inDisplayValue||"").substring("https://api.".length);
            this.cjUrlEditor.setDataValue((this.cjUrlEditor.getDataValue() || "").replace(/\..*$/,"." + hostname));
        }
    },
    cloudJeeApplicationNameChanged: function() {

    },
    loadDatabaseServices: function() {
            /*this.dataServiceListService.requestAsync("listDatabaseServices", [studio.isCloud() ? "" : this.getTokenCookie(this.loginDialogTargetEditor.getDataValue()),studio.isCloud() ? "" : this.loginDialogTargetEditor.getDataValue()],
                dojo.hitch(this, function(inResult) {
                    this.dataServiceListVar.setData(inResult);
                })
            ); */
    },
    CFTOKEN_COOKIE: "Studio.DeploymentDialog.CFTOKEN",
    getTokenCookie: function(inTargetUrl) {
       return   dojo.cookie(this.CFTOKEN_COOKIE + ":" + inTargetUrl);
    },
    setTokenCookie: function(inTargetUrl, inToken) {
       dojo.cookie(this.CFTOKEN_COOKIE + ":" + inTargetUrl, inToken, {expires: 1});
    },
    _end:0
});