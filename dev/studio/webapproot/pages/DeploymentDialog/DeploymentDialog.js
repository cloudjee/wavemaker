/*
 * Copyright (C) 2011 VMWare, Inc. All rights reserved.
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
 
// TODO: Waiting indicators
// TODO: After adding new items, must update the file/deployment menu
dojo.provide("wm.studio.pages.DeploymentDialog.DeploymentDialog");

dojo.declare("DeploymentDialog", wm.Page, { 
    /* Page Properties */
    validateVisibleOnly: true,
    i18n: true,

    /* Page Static Variables */
    CF_DEPLOY: "CLOUD_FOUNDRY",
    TC_DEPLOY: "TOMCAT",
    FILE_DEPLOY: "FILE",

    /* Page caches and state */
    currentDatabaseBoxes: [],
    cfDatabaseNameList: [],
    _currentDeploymentIndex: -1,

    /* Extra Widgets */
    databaseBox: {
	databasePanel1: ["wm.FancyPanel", {"borderColor":"black","innerBorder":"1", "fitToContentHeight":true,"height":"149px","margin":"10,10,10,0","title":"Database 1"}, {}, {	    
	    databaseInnerPanel1: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left", margin: "5,50,5,50"},{}, {
		databaseConnectionEditor1: ["wm.SelectMenu", {"caption":"Database Connection","captionAlign":"left","captionSize":"140px","dataField":"dataValue","displayField":"dataValue","displayValue":"","helpText":"<ul><li>Settings: Setup the settings just as you do when importing databases</li><li>JNDI: The Java Naming and Directory Interface is a Java API for a directory service that allows Java clients to discover and lookup data and objects via a name</li></ul>","options":"Standard, JNDI","width":"280px"}, {onchange: "updateDatabaseLayers"}],
		databaseLayers1: ["wm.Layers", {fitToContentHeight: true}, {}, {
		    databaseConnectionsLayer1: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
			databaseTypeEditor1: ["wm.Text", {"border":"0","caption":"Type","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","readonly":true,"width":"100%"}, {}],
			databaseUserEditor1: ["wm.Text", {"border":"0","caption":"User name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", required: true}, {}],
			databasePasswordEditor1: ["wm.Text", {"border":"0","caption":"Password","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","password":true,"width":"100%", required: true}, {}],
			databaseHostEditor1: ["wm.Text", {"border":"0","caption":"Host/IP Address","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", emptyValue: "emptyString"}, {onchange: "updateDbConnectionUrl"}],
			databasePortEditor1: ["wm.Text", {"border":"0","caption":"Port","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%"}, {onchange: "updateDbConnectionUrl"}],
			databaseNameEditor1: ["wm.Text", {"border":"0","caption":"Database Name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%"}, {onchange: "updateDbConnectionUrl"}],
			databaseURLEditor1: ["wm.Text", {"border":"0","caption":"Connection URL","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", required: true}, {}]
		    }],
		    databaseJNDILayer1: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
			databaseJNDINameEditor1: ["wm.Text", {"border":"0","caption":"JNDI Name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", required: true}, {}]
		    }],
		    databaseCloudFoundryLayer1: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
			databaseCloudFoundryType1: ["wm.Text", {"border":"0","caption":"Type","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"MYSQL","readonly":true,"width":"100%"}, {}],
			databaseCloudFoundryHostEditor1: ["wm.SelectMenu", {"caption":"Service name","captionAlign":"left","captionSize":"140px","dataField":"dataValue","displayField":"dataValue","displayValue":"","width":"100%", required: true}, {}],
			databaseCloudFoundryNameEditor1: ["wm.Text", {"border":"0","caption":"Database Name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", required: true/*, helpText: "Rename your database if you already have a database of that name on CloudFoundry and don't want to reuse that database.  Note: each database is on its own cloud server and counts against your quota"*/}, {}]
		    }]
		}]
	    }]
	}]
    },

    start: function() {


    },
    onShow: function() {

    },
    selectFirst: function() {
	this.initDeploymentListVar();
	if (this.deploymentListVar.getCount() > 0) {
	    this.deploymentList.selectByIndex(0);
	    this.deploymentListSelect(this.deploymentList, this.deploymentList.getItem(0),true);
	} else {
	    
	}
    },
    initDeploymentListVar: function() {
	var deployments = [];
	this.deploymentListVar.clearData();
	dojo.forEach(studio._deploymentData, dojo.hitch(this, function(deployment,i) {	
	    this.deploymentListVar.addItem({name: deployment.name, dataValue: deployment});
	}));
    },
    loginCancelButtonClick: function(inSender) {
      try {
          
          
      } catch(e) {
          console.error('ERROR IN loginCancelButtonClick: ' + e); 
      } 
  },
  loginOKButtonClick: function(inSender) {
      try {
          
          
      } catch(e) {
          console.error('ERROR IN loginOKButtonClick: ' + e); 
      } 
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
		  this.editPanel.clearDirty()
		  this.owner.owner.hide();
	      });

	      this.saveDialogCancelButton.onclick = dojo.hitch(this, function() {
		  this.confirmSaveDialog.hide();
	      });

	      this.saveDialogSaveButton.onclick = dojo.hitch(this, function() {
		  var c1 = dojo.connect(this, "saveSuccess", this, function() {
		      this.confirmSaveDialog.hide();
		      this.editPanel.clearDirty()
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
	case this.CF_DEPLOY:
	    return this.generateCloudFoundryDeploymentStruct();
	case this.FILE_DEPLOY:
	    return this.generateFileDeploymentStruct();
	}
    },
    generateTomcatDeploymentStruct: function() {
	/* Start from the  original data as it contains the deploymentId and perhaps other data we haven't bothered to put into the form */
	var data = this.deploymentList.selectedItem.getValue("dataValue");
	data.name = this.tcDeploymentNameEditor.getDataValue();
	data.applicationName = this.tcNameEditor.getDataValue();
	data.host = this.tcHostEditor.getDataValue();
	data.port = this.tcPortEditor.getDataValue();
	data.username = this.tcUserEditor.getDataValue();
	data.password = this.tcPasswordEditor.getDataValue();
	
	/* Delete the old databases and replace it with a new databases structure */
	data.databases = this.generateStandardDatabaseStruct();
	return data;
    },
    generateCloudFoundryDeploymentStruct: function() {
	/* Start from the  original data as it contains the deploymentId and perhaps other data we haven't bothered to put into the form */
	var data = this.deploymentList.selectedItem.getValue("dataValue");
	data.applicationName = this.cfNameEditor.getDataValue();
	data.name = this.cfDeploymentNameEditor.getDataValue();
	data.target = this.cfHostEditor.getDataValue();

	/* Delete the old databases and replace it with a new databases structure */
	var databases = data.databases = []

	dojo.forEach(this.currentDatabaseBoxes, dojo.hitch(this, function(box,i) {
		databases.push({
		    dataModelId: box.dataModel.name,
		    dbName: this["databaseCloudFoundryNameEditor" + (i+1)].getDataValue(),
		    connectionUrl: this.updateDbConnectionUrl(), // used to store db type, not because its required
		    username: null,
		    password: null,
		    jndiName: null,
		    serviceName: this["databaseCloudFoundryHostEditor" + (i+1)].getDataValue()
		});
	}));
	return data;
    },

    generateFileDeploymentStruct: function() {
	/* Start from the  original data as it contains the deploymentId and perhaps other data we haven't bothered to put into the form */
	var data = this.deploymentList.selectedItem.getValue("dataValue");
	data.name = this.fileDeploymentNameEditor.getDataValue();
	data.archiveType = this.warRadioButton.getGroupValue();

	/* Delete the old databases and replace it with a new databases structure */
	data.databases = this.generateStandardDatabaseStruct();
	return data;
    },
    generateStandardDatabaseStruct: function() {
	var databases = [];
	dojo.forEach(this.currentDatabaseBoxes, dojo.hitch(this, function(box,i) {

		databases.push({
		    dataModelId: box.dataModel.name,
		    dbName: this["databaseNameEditor" + (i+1)].getDataValue(),
		    connectionUrl:this["databaseURLEditor" + (i+1)].getDataValue(),
		    username: this["databaseUserEditor" + (i+1)].getDataValue(),
		    password: this["databasePasswordEditor" + (i+1)].getDataValue(),
		    jndiName: this["databaseLayers" + (i+1)].layerIndex == 1 ? this["databaseJNDINameEditor" + (i+1)].getDataValue() : null,
		    serviceName: null
		});

	}));
	return databases;
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
	this.deploymentList.selectByIndex(selectedIndex);
	var newData = [];
	var data = this.deploymentListVar.getData()
	for (var i = 0; i < data.length; i++) {
	    newData.push(data[i].dataValue);
	}
	studio._deploymentData = newData;
	studio.updateDeploymentsMenu();

	if (!deploying) {
	    studio.endWait();
	    app.toastSuccess(this.getDictionaryItem("TOAST_SAVE_SUCCESS"));
	}
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
      studio.beginWait(this.getDictionaryItem("WAIT_DEPLOY", {deploymentName: this.deploymentList.selectedItem.getValue("name")}));
      studio.deploymentService.requestAsync("save", [data], 
					    dojo.hitch(this, function(inResult) {
						this.saveSuccess(inResult,true);
						var selectedIndex = this.deploymentList.getSelectedIndex();
 						var dataAfterSave = this.deploymentListVar.getItem(selectedIndex).getValue("dataValue");
						this.deploy(dataAfterSave);
					    }),
					    dojo.hitch(this, "saveFailed"));
  },
  deploy: function(inData) {
      try {
	  if (inData.deploymentType == this.FILE_DEPLOY) {
	      this.deploy2(inData);
	  } else {
	      app.confirm(this.getDictionaryItem("CONFIRM_DEPLOY_HEADER") + this.generateDeploymentHTMLSynopsis(inData), false, dojo.hitch(this, function() {
		  this.deploy2(inData);
	      }));
	      app.confirmDialog.setWidth("450px");
	  }
      } catch(e) {
          console.error('ERROR IN deployButtonClick: ' + e); 
      } 
  },
    deploy2: function(inData) {
	studio.beginWait(this.getDictionaryItem("WAIT_DEPLOY", {deploymentName: inData.name}));
	studio.deploymentService.requestAsync("deploy", [inData],
					      dojo.hitch(this, function(inResult) {
						  this.deploySuccess(inResult,inData);
					      }),
					      dojo.hitch(this, "deployFailed"));
    },
    deploySuccess: function(inResult, inData) {
	studio.endWait();
	switch (inData.deploymentType) {
	case this.TC_DEPLOY:
	case this.CF_DEPLOY:
	    app.alert("<p>" + this.getDictionaryItem("TOAST_DEPLOY_SUCCESS") +"</p><p><a target='_NewWindow' href='" + this.getTargetUrl(inData) + "'>" + this.getTargetUrl() + "</a></p>");
	    return;
	case this.FILE_DEPLOY:
	    app.toastSuccess(this.getDictionaryItem("TOAST_FILE_GENERATION_SUCCESS"));
	    if (this.deploymentList.selectedItem.getValue("dataValue").archiveType == "WAR") {
		studio.downloadInIFrame("services/deploymentService.download?method=downloadProjectWar");
	    } else {
		studio.downloadInIFrame("services/deploymentService.download?method=downloadProjectEar");
	    }
	    return;
	}
    },
    deployFailed: function(inError) {
	studio.endWait();
	app.toastError(this.getDictionaryItem("TOAST_DEPLOY_FAILED", {error: inError.message}));
    },
  copyButtonClick: function(inSender) {
      if (this.getIsDirty()) {
	  var copyFunc = dojo.hitch(this, function() {
			  var selectedIndex = this.deploymentList.getSelectedIndex();
			  this.copyDeployment();
			  if (!this.deploymentListVar.getItem(selectedIndex).getValue("dataValue").deploymentId) {
			      this.deploymentListVar.removeItem(selectedIndex);
			      this.deploymentList.selectByIndex(this.deploymentListVar.getCount()-1);
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
	  case this.cloudFoundryLayer:
	      nameEditor = this.cfDeploymentNameEditor;
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
	if (inData.deploymentType == this.CF_DEPLOY) {
	    return "http://" + inData.applicationName + "." + inData.target + "/";
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
	if (data.deploymentType == this.CF_DEPLOY) {
	    type = "CloudFoundry";
	} else if (data.deploymentType == this.TC_DEPLOY) {
	    type = "Tomcat";
	} else if (data.deploymentType == this.FILE_DEPLOY) {
	    type = "File Generation";
	}
	var html = "";
	html += "<table style='margin-left: 30px;margin-top:15px;'>";
	html += "<tr><td style='width:100px;vertical-align:top'>" + this.getDictionaryItem("SYNOPSIS_NAME") + "</td><td>" + name + "</td></tr>";
	if (target)
	    html += "<tr><td>" + this.getDictionaryItem("SYNOPSIS_TARGET") + "</td><td>" + target + "</td></tr>";
	html += "<tr><td>" + this.getDictionaryItem("SYNOPSIS_TYPE") + "</td><td>" + type + "</td></tr>";
	dojo.forEach(data.databases, dojo.hitch(this, function(database,i) {
	    var connection;
	    if (database.jndiName) {
		html += "<tr><td>" + database.dataModelId + "</td><td>JNDI:" + database.jndiName + "</td></tr>";
	    } else if (database.connectionUrl) {
		    var l = parseConnectionUrl(database.connectionUrl, database);
		    var connection = {dbtype: l[0],
				      host: l[1],
				      port: l[2],
				      db: l[3]};
		
		html += "<tr><td>" + database.dataModelId + "</td><td>" + (connection.dbtype == "HSQLDB" ? "HSQLDB" : connection.host) + "</td></tr>";
	    }
	}));
	return html;
    },
  deleteButtonClick: function(inSender) {
      try {
	  app.confirm(this.getDictionaryItem("CONFIRM_DELETE_HEADER") + this.generateDeploymentHTMLSynopsis(), false, dojo.hitch(this, function() {
	      var i = this.deploymentList.getSelectedIndex();
              this.deploymentListVar.removeItem(i);
	      app.toastWarning("TODO: Delete from server");
	      dojo.forEach(this.currentDatabaseBoxes, function(w) {
		  w.destroy();
	      });
	      this.defaultLayer.activate();
	      this._currentDeploymentIndex = -1;
	      studio.updateDeploymentsMenu();
	  }));
      } catch(e) {
          console.error('ERROR IN deleteButtonClick: ' + e); 
      } 
  },
    contextDelete: function() {
	var data = this.deploymentListVar.getItem(this._contextMenuIndex).getValue("dataValue");
	app.confirm(this.getDictionaryItem("CONFIRM_DELETE_HEADER") + this.generateDeploymentHTMLSynopsis(data), false, dojo.hitch(this, function() {
	    var selectedIndex = this.deploymentList.getSelectedIndex();
            this.deploymentListVar.removeItem(this._contextMenuIndex);
	    app.toastWarning("TODO: Delete from server");
	    if (selectedIndex == this._contextMenuIndex) {
	      dojo.forEach(this.currentDatabaseBoxes, function(w) {
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
	    studio.updateDeploymentsMenu();
	}));
    },
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
	  var addFunc = dojo.hitch(this, function() {
			  var selectedIndex = this.deploymentList.getSelectedIndex();
			  if (!this.deploymentListVar.getItem(selectedIndex).getValue("dataValue").deploymentId) {
			      this.deploymentListVar.removeItem(selectedIndex);
			      this.deploymentList.selectByIndex(this.deploymentListVar.getCount()-1);
			  }
	  });
	      this.confirmSaveDialog.show();
	      this.saveDialogDontSaveButton.onclick = dojo.hitch(this, function() {
		  this.confirmSaveDialog.hide();
		  addFunc();
	      });

	      this.saveDialogCancelButton.onclick = dojo.hitch(this, function() {
		  this.confirmSaveDialog.hide();
	      });

	      this.saveDialogSaveButton.onclick = dojo.hitch(this, function() {
		  var c1 = dojo.connect(this, "saveSuccess", this, function() {
		      this.confirmSaveDialog.hide();
		      addFunc();
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
          this.newDeploymentDialog.show(); 
      }
  },
    onNewDeployOk: function() {
	var groupvalue = this.tomcatRadio.getGroupValue();
	switch(groupvalue) {
	case "tc":
	    this.editPanel.clearData(); // insures that even hidden editors no longer flag as invalid or dirty
	    this.newTomcatDeploy();
	    break;
	case "cf":
	    this.editPanel.clearData(); // insures that even hidden editors no longer flag as invalid or dirty
	    this.newCloudFoundryDeploy2();
	    break;
	case "files":
	    this.editPanel.clearData(); // insures that even hidden editors no longer flag as invalid or dirty
	    this.newAppFileDeploy();
	    break;
	}
	this.newDeploymentDialog.hide();
	this.owner.owner.show();
    },
    onNewDeployCancel: function() {
	this.newDeploymentDialog.hide();
    },




    updateDbConnectionUrl: function(inSender) {
	var name = inSender.name;
	var number = name.match(/(\d+)$/);
	number = number[1];
	var result;
	if (this["databaseTypeEditor" + number].getDataValue() == "HSQLDB") {
	    result = "jdbc:hsqldb:file:" + this["databaseNameEditor" + number].getDataValue() + ";shutdown=true;ifexists=true";
	} else {
	    result = "jdbc:" + this["databaseTypeEditor" + number].getDataValue() + "://" + this["databaseHostEditor" + number].getDataValue() + ":" + this["databasePortEditor" + number].getDataValue() + "/" + this["databaseNameEditor" + number].getDataValue();
	}
	this["databaseURLEditor" + number].setDataValue(result);
	return result;
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
	    if (this.deploymentListVar.getCount() == 0)
		this.initDeploymentListVar();
	    var deploymentDescriptor = {
		"applicationName": studio.project.projectName,
		"archiveType": "WAR",
		"databases": [],
		"deploymentId": null,
		"deploymentType": inType,
		"host": null,
		"name": name,
		"port": 0,
		"target": null
	    };
	    this.deploymentListVar.addItem({name: inName, dataValue: deploymentDescriptor});
	    this._selectingListItem = true;
	    this.deploymentList.selectByIndex(this.deploymentListVar.getCount()-1);
	    this._currentDeploymentIndex = this.deploymentList.getSelectedIndex();
	    delete this._selectingListItem;
	    return inName;
	}
		
    },
    generateDataModelBoxes: function() {
	dojo.forEach(this.currentDatabaseBoxes, function(w) {
	    w.destroy();
	});
	this.currentDatabaseBoxes = [];
	var components = studio.application.getServerComponents();
	dojo.forEach(components, dojo.hitch(this, function(c,i) {
	    if (c instanceof wm.DataModel) {
		var box = this.editPanel.createComponents(this.databaseBox, this)[0];
		box.dataModel = c;
		box.setTitle(this.getDictionaryItem("DATABASE_BOX_TITLE", {databaseName: c.name}));
		this.currentDatabaseBoxes.push(box);
	    }
	}));
	return this.currentDatabaseBoxes;
    },
    populateDataModelBoxesStandard: function() {
	dojo.forEach(this.currentDatabaseBoxes, dojo.hitch(this, function(b, i) {
	    var dataModel = b.dataModel;
	    this["databaseLayers" + (i+1)].setLayerIndex(0);
	    this["databaseConnectionEditor" + (i+1)].setDataValue("Standard");
	    studio.dataService.requestSync(
		LOAD_CONNECTION_PROPS_OP,
		[dataModel.dataModelName], 
		dojo.hitch(this, function(inData) {
		    var l = parseConnectionUrl(inData.connectionUrl, inData);
		    var connection = {dbtype: l[0],
				      host: l[1],
				      port: l[2],
				      db: l[3]};
		    if (l) {
			this["databaseTypeEditor" + (i+1)].setDataValue(connection.dbtype);
			this["databaseUserEditor" + (i+1)].setDataValue(inData.username);
			this["databasePasswordEditor" + (i+1)].setDataValue(inData.password);
			if (connection.dbtype == "HSQLDB") {
			    this["databaseHostEditor" + (i+1)].hide();
			    this["databasePortEditor" + (i+1)].hide();
			    this["databaseNameEditor" + (i+1)].setRequired(true);
			    this["databaseNameEditor" + (i+1)].setCaption(this.getDictionaryItem("HSQLDB_DATABASE_NAME_CAPTION"));
			} else {
			    this["databaseHostEditor" + (i+1)].setDataValue(connection.host);
			    this["databasePortEditor" + (i+1)].setDataValue(connection.port);
			}
			this["databaseNameEditor" + (i+1)].setDataValue(connection.db);
			this["databaseJNDINameEditor" + (i+1)].setDataValue(connection.db);
		    }
		})
	    );
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
		var l = parseConnectionUrl(inData.connectionUrl.replace(/\\/g,""), inData);
		connection = {dbtype: l[0],
				  host: l[1],
				  port: l[2],
				  db: l[3]};
	    }
	    
	    if (inData.jndiName) {
		this["databaseConnectionEditor" + (i+1)].setDataValue("JNDI");		
		this["databaseLayers" + (i+1)].setLayerIndex(1);
		this["databaseJNDINameEditor" + (i+1)].setDataValue(inData.jndiName);
	    } else {
		this["databaseConnectionEditor" + (i+1)].setDataValue("Standard");
		this["databaseLayers" + (i+1)].setLayerIndex(0);
		this["databaseJNDINameEditor" + (i+1)].setDataValue(dataModel.name);
	    }

	    this["databaseTypeEditor" + (i+1)].setDataValue( connection.dbtype);
	    if (l) {
		this["databaseUserEditor" + (i+1)].setDataValue(inData.username);
		this["databasePasswordEditor" + (i+1)].setDataValue(inData.password);
		if (connection.dbtype == "HSQLDB") {
		    this["databaseHostEditor" + (i+1)].hide();
		    this["databasePortEditor" + (i+1)].hide();
		    this["databaseNameEditor" + (i+1)].setRequired(true);
		    this["databaseNameEditor" + (i+1)].setCaption(this.getDictionaryItem("HSQLDB_DATABASE_NAME_CAPTION"));
		} else {
		    this["databaseHostEditor" + (i+1)].setDataValue(connection.host);
		    this["databasePortEditor" + (i+1)].setDataValue(connection.port);
		}
		this["databaseNameEditor" + (i+1)].setDataValue(connection.db);
	    }
	}));
	this.editPanel.reflow();
    },

    newTomcatDeploy: function() {
	this.editLayer.activate();
	this.tomcatLayer.activate();
	var targetName = this.setUniqueDeploymentName("New Tomcat Deployment", this.tcDeploymentNameEditor, this.TC_DEPLOY);
	this.tcHostEditor.setDataValue("localhost");
	this.tcPortEditor.setDataValue(window.location.port); // good values for deploying to localhost, bad for deploying to almost anything else
	this.tcNameEditor.setDataValue(studio.project.projectName);
	this.tcUserEditor.setDataValue("manager");
	this.tcPasswordEditor.setDataValue("manager");

	var boxes = this.generateDataModelBoxes();
	this.populateDataModelBoxesStandard();
    },
    populateTomcatDeploy: function(inData) {
	this.editLayer.activate();
	this.tomcatLayer.activate();

	this.tcDeploymentNameEditor.setDataValue(inData.name);
	this.tcHostEditor.setDataValue(inData.host);
	this.tcPortEditor.setDataValue(inData.port);
	this.tcNameEditor.setDataValue(inData.applicationName);
	this.tcUserEditor.setDataValue(inData.username);
	this.tcPasswordEditor.setDataValue(inData.password);

	var boxes = this.generateDataModelBoxes();
	this.populateDataModelBoxes(inData.databases);
    },



    newAppFileDeploy: function() {
	this.editLayer.activate();
	this.appFileLayer.activate();
	var targetName = this.setUniqueDeploymentName("New File Deployment", this.fileDeploymentNameEditor, this.FILE_DEPLOY);
	this.warRadioButton.setChecked(true);
	var boxes = this.generateDataModelBoxes();
	this.populateDataModelBoxesStandard();

    },
    populateAppFileDeploy: function(inData) {
	this.editLayer.activate();
	this.appFileLayer.activate();
	this.fileDeploymentNameEditor.setDataValue(inData.name);
	this.warRadioButton.setGroupValue(inData.archiveType);
	var boxes = this.generateDataModelBoxes();
	this.populateDataModelBoxes(inData.databases);
    },
    newCloudFoundryDeploy: function() {
	this.cfLoginDialog.show();
	this.onCFCloudLoginSuccess = dojo.hitch(this, "newCloudFoundryDeploy2");
    },
    newCloudFoundryDeploy2: function() {
	this.editLayer.activate();
	this.owner.owner.show();
	this.cloudFoundryLayer.activate();
	var targetName = this.setUniqueDeploymentName("New CloudFoundry Deployment", this.cfDeploymentNameEditor, this.CF_DEPLOY);
	this.cfHostEditor.setDataValue("api.cloudfoundry.com");
	this.cfNameEditor.setDataValue(studio.project.projectName);

	var boxes = this.generateDataModelBoxes();
	dojo.forEach(boxes, dojo.hitch(this, function(b, i) {
	    var dataModel = b.dataModel;
	    this["databaseLayers" + (i+1)].setLayerIndex(2);
	    this["databaseCloudFoundryNameEditor" + (i+1)].setDataValue(dataModel.name);
	    this["databaseConnectionEditor" + (i+1)].hide();
	}));
	this.editPanel.reflow();
    },
		        
    populateCloudFoundryDeploy: function(inData) {
	this.editLayer.activate();
	this.cloudFoundryLayer.activate();

	this.cfDeploymentNameEditor.setDataValue(inData.name);

	this.cfNameEditor.setDataValue(inData.applicationName);
	this.cfHostEditor.setDataValue(inData.target);

	var boxes = this.generateDataModelBoxes();
	dojo.forEach(boxes, dojo.hitch(this, function(b, i) {
	    var dataModel = b.dataModel;
	    var inDbData;
	    dojo.forEach(inData.databases, dojo.hitch(this, function(db) {
		if (db.dataModelId == dataModel.name) 
		    inDbData = db;
	    }));
	    this["databaseLayers" + (i+1)].setLayerIndex(2);
	    if (inDbData) {
		this["databaseCloudFoundryNameEditor" + (i+1)].setDataValue(inDbData.dbName); // TODO Check if there is a separate datamodel name and wmServiceName
		if (this.cfDatabaseNameList.length) {
		    this["databaseCloudFoundryHostEditor" + (i+1)].setDataValue(inDbData.serviceName);
		} else {
		    this["databaseCloudFoundryHostEditor" + (i+1)].hide();
		}
		this["databaseConnectionEditor" + (i+1)].hide();
	    } else {
		this["databaseCloudFoundryNameEditor" + (i+1)].setDataValue(dataModel.name);
		this["databaseConnectionEditor" + (i+1)].hide();
	    }
	}));
	this.editPanel.reflow();
    },
    
    getIsDirty: function() {
	return this.editPanel.getIsDirty() || this._currentDeploymentIndex >= 0 && !this.deploymentListVar.getItem(this._currentDeploymentIndex).getValue("dataValue").deploymentId;
    },
    deploymentListSelect: function(inSender, inItem, forceSelect) {
	if (inItem)
	    this.editLayer.activate();
	if (!this._selectingListItem) {
	    // if its dirty, or never been saved, confirm the user wants to lose changes
	    if (!forceSelect && this.getIsDirty()) {
/*
		app.confirm(this.getDictionaryItem("CONFIRM_UNSAVED_CHANGES"), false, 
			    dojo.hitch(this, function() {				
				var oldSelectedIndex = this._currentDeploymentIndex;
				this._currentDeploymentIndex = this.deploymentList.getSelectedIndex();
				this.openDeployment(inSender.selectedItem.getData().dataValue);
				if (oldSelectedIndex >= 0 && !this.deploymentListVar.getItem(oldSelectedIndex).getValue("dataValue").deploymentId) {
				    this.deploymentListVar.removeItem(oldSelectedIndex);
				    this.deploymentList.selectByIndex(this._currentDeploymentIndex);
				}

			    }),
			    dojo.hitch(this, function() {
				this.deploymentList.selectByIndex(this._currentDeploymentIndex);
			    })
			   );
			   */

		var newIndex = this.deploymentList.getSelectedIndex();
		var oldSelectedIndex = this._currentDeploymentIndex;
		var selectFunc = dojo.hitch(this, function() {
		                this._currentDeploymentIndex = newIndex;
				this.openDeployment(inSender.selectedItem.getData().dataValue);
				if (oldSelectedIndex >= 0 && !this.deploymentListVar.getItem(oldSelectedIndex).getValue("dataValue").deploymentId) {
				    this.deploymentListVar.removeItem(oldSelectedIndex);
				    this.deploymentList.selectByIndex(this._currentDeploymentIndex);
				}
		});
	      this.confirmSaveDialog.show();
	      this.saveDialogDontSaveButton.onclick = dojo.hitch(this, function() {
		  this.confirmSaveDialog.hide();
		  selectFunc();
	      });

	      this.saveDialogCancelButton.onclick = dojo.hitch(this, function() {
		  this.deploymentList.selectByIndex(this._currentDeploymentIndex);
		  this.confirmSaveDialog.hide();
	      });

	      this.saveDialogSaveButton.onclick = dojo.hitch(this, function() {
		  var c1 = dojo.connect(this, "saveSuccess", this, function() {
		      this.confirmSaveDialog.hide();
		      this.deploymentList.selectByIndex(newIndex);
		      selectFunc();
		      dojo.disconnect(c1);
		      dojo.disconnect(c2);
		  });
		  var c2 = dojo.connect(this, "saveFailed", this, function() {
		      dojo.disconnect(c1);
		      dojo.disconnect(c2);
		  });
		  this.deploymentList.selectByIndex(this._currentDeploymentIndex);
		  this.saveButtonClick();
	      });
	    } else {
		this._currentDeploymentIndex = this.deploymentList.getSelectedIndex();
		this.openDeployment(inSender.selectedItem.getData().dataValue);		
	    }
	}
    },
    openDeployment: function(data) {	     

	    this.editPanel.clearData(); // insures that even hidden editors no longer flag as invalid or dirty
	    switch(data.deploymentType) {
	    case this.TC_DEPLOY:
		this.populateTomcatDeploy(data);
		break;
	    case this.CF_DEPLOY:
		this.populateCloudFoundryDeploy(data);
		break;
	    case this.FILE_DEPLOY:
		this.populateAppFileDeploy(data);
		break;
	    }
    },
    deploymentNameChange: function(inSender) {
	var value = inSender.getDisplayValue();
	var i = this.deploymentList.getSelectedIndex();
	this.deploymentListVar.getItem(i).setValue("name", value);
	this._selectingListItem = true;
	this.deploymentList.selectByIndex(i);
	delete this._selectingListItem;
    },


    /* Handling for the cloudfoundry login dialog */
    cfLoginCancelClick: function() {
	this.cfLoginDialog.hide();
    },
    cfLoginOkClick: function() {
	this.cfLoginDialog.hide();
	if (this.onCFCloudLoginSuccess)
	    this.onCFCloudLoginSuccess();
    },
        
    getSelectedDeploymentType: function() {
	if (this.deploymentList.selectedItem)
	    var data = this.deploymentList.selectedItem.getData();
	if (data)
	    return data.deploymentType;
    },
    _end:0
});