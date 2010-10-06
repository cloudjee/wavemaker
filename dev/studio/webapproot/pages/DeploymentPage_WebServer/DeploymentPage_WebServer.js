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
// TODO: Waiting indicators
dojo.provide("wm.studio.pages.DeploymentPage_WebServer.DeploymentPage_WebServer");

dojo.declare("DeploymentPage_WebServer", wm.Page, { 
	deploymentTarget: "tomcat",
	currentTarget: "",
	currentAction: "",
	start: function() {
	wm.typeManager.addType("com.wavemaker.tools.deployment.TargetInfo", {internal: true, 	
		"fields": {
			"container": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"description": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"destType": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"dnsHost": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"name": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"password": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"port": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"privateIp": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"publicIp": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"server": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"serviceProvider": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"user": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			}
		}}); //fields


		wm.typeManager.addType("com.wavemaker.tools.cloudmgr.CloudFile", {internal: true, 	
		"fields": {
			"containerName": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"fileName": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"lastModified": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"owner": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			},
			"size": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "long"
			},
			"sizeString": {
				"exclude": [],
				"include": [],
				"isList": false,
				"noChange": [],
				"required": true,
				"type": "java.lang.String"
			}
		}}), //fields

		this._setDataTypes();

		this.currentEditors = [];
	},
	reset: function() {
	},
	setup: function() {
		this.reset();
	},

	depTargetShow: function() {
		this.getDepTargetList("Loading deployment targets from deploymentTargets.xml");
    },

	getDepTargetList: function(message, inLayer) {
	    studio.beginWait(message);
	    studio.deploymentService.requestAsync("getDeploymentTargetList",[] ,
			dojo.hitch(this, "getDepTargetListComplete"),
			dojo.hitch(this, "_svcError"));
    },

	getDepTargetListComplete: function(inData) {
		studio.endWait();
		this.targetListVar.setData(inData);
		this.DepTargetList.setDataSet(this.targetListVar);
		// Style the wm.List
		dojo.query("#" + this.DepTargetList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
		dojo.query("#" + this.DepTargetList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
	},

    /* Event handler for this.ListServicesButton; shows all contexts within a tomcat server. 
      Button only visible if main task is managing servers */
	listAppsButtonClick: function(inSender) {
		this.loadServerManagerAppList();
	},

	DeployPropertiesBackButtonClick: function(inSender) {
		this.MainLayers.setLayer("DepTargetListLayer");
	},

    DeployPropertiesOKButtonClick: function(inSender) {
		this.MainLayers.setLayer("appListLayer");
    },

	targetPropertiesOKClick: function() {
		studio.deploymentService.requestAsync("updateDeploymentTarget", 
			 [this.targetName.getDataValue(),
			  this.targetDescription.getDataValue(),
			  this.destType.getEditorValue(),
			  this.serviceProvider.getEditorValue(),
			  this.container.getDataValue() == undefined ? "" : this.container.getDataValue(),
			  this.serverType.getEditorValue() == undefined ? "" : this.serverType.getEditorValue(),
			  this.dnsHost.getDataValue() == undefined ?  "" : this.dnsHost.getDataValue(),
			  this.publicIP.getDataValue() == undefined ?  "" : this.publicIP.getDataValue(), 
			  this.privateIP.getDataValue() == undefined ?  "" : this.privateIP.getDataValue(),
			  this.portNumber.getDataValue() == undefined ?  "" : this.portNumber.getDataValue(),
			  this.serverUser.getDataValue() == undefined ? "" : this.serverUser.getDataValue(),
			  this.serverPassword1.getDataValue() == undefined ? "" : this.serverUser.getDataValue(),
			  this.currentAction == "Add" ? false : true],
			 dojo.hitch(this,function(inResult) {
				 app.alert(inResult.toString());
			 }),
			 dojo.hitch(this, "_svcError"));
	},

	targetPropertiesDestTypeChanged: function() {
		if (this.destType.getDataValue() == "storage") {
			this.serverType.setReadonly(true);
			this.dnsHost.setReadonly(true);
			this.publicIP.setReadonly(true);
			this.privateIP.setReadonly(true);
			this.portNumber.setReadonly(true);
			this.serverUser.setReadonly(true);
			this.serverPassword1.setReadonly(true);
			this.serverPassword2.setReadonly(true);
		} else {
			this.serverType.setReadonly(false);
			this.dnsHost.setReadonly(false);
			this.publicIP.setReadonly(false);
			this.privateIP.setReadonly(false);
			this.portNumber.setReadonly(false);
			this.serverUser.setReadonly(false);
			this.serverPassword1.setReadonly(false);
			this.serverPassword2.setReadonly(false);
		}
	},

	targetPropertiesBackClick: function(inSender) {
		this.MainLayers.setLayer("DepTargetListLayer");
	},

    showAppListLayer: function() {
		this.loadServerManagerAppList();

    },

	appListDeployButtonClick: function(inSender) {
		this.MainLayers.setLayer("contextRootLayer");
	},

	appListRefreshButtonClick: function(inSender) {
		this.MainLayers.setLayer("appListLayer");
	},

	appListRedeployButtonClick: function(inSender) {

		var cr = this._getContextRoot();
		if (cr == null ) return;
		if (cr == "/manager") {
		  app.alert("Undeploying the Tomcat Manager will disable parts of this service; as such we do not support this action");
		  return;
		}

		studio.beginWait("Re-Deploying...");

		studio.deploymentService.requestAsync("redeploy",
						  [this.deploymentTarget, cr, this._getProperties()],
						  dojo.hitch(this, "redeployComplete"),
						  dojo.hitch(this, "_svcError"));
	},

	appListBackButtonClick: function(inSender) {
		this.MainLayers.setLayer("DeployPropertiesLayer");
	},

	AMCredentialOKButtonClick: function(inSender) {
		this.MainLayers.setLayer("AMFileListLayer");
	},

	getAMCloudFilesComplete: function(inData) {
		studio.endWait();
		this.amFileListVar.setData(inData);
		this.amContainer.setDataValue(this.DepTargetList.selectedItem.data.container);
		dojo.query("#" + this.AMFileList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
		dojo.query("#" + this.AMFileList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
	},

	AMCredentialBackButtonClick: function(inSender) {
		this.MainLayers.setLayer("DepTargetListLayer");
	},

	AMFileListRefreshButtonClick: function(inSender) {
		this.amShowFiles();
	},

	AMFileListBackButtonClick: function(inSender) {
		this.MainLayers.setLayer("AMCredentialLayer");
	},

	AMFileListUploadWarButtonClick: function(inSender) {
		studio.beginWait("Uploading WAR File to Amazon S3 ...");
	    this.cloudStorageService.requestAsync("copyWarFileToCloudStorage",["amazon", this.DepTargetList.selectedItem.data.container, null, null,
				this.accessKeyId.getDataValue(), this.secretAccessKey.getDataValue()],
			dojo.hitch(this, "getAMCloudFilesComplete"),
			dojo.hitch(this, "_svcError"));
	},

	AMFileListUploadEarButtonClick: function(inSender) {
		studio.beginWait("Uploading EAR File to Amazon S3 ...");
	    this.cloudStorageService.requestAsync("copyEarFileToCloudStorage",["amazon", this.DepTargetList.selectedItem.data.container, null, null,
				this.accessKeyId.getDataValue(), this.secretAccessKey.getDataValue()],
			dojo.hitch(this, "getAMCloudFilesComplete"),
			dojo.hitch(this, "_svcError"));
	},

	AMFileListDeleteButtonClick: function(inSender) {
		studio.beginWait("Deleting a File in Amazon S3 ...");
	    this.cloudStorageService.requestAsync("deleteFileInCloudStorage",["amazon", this.DepTargetList.selectedItem.data.container,
				this.AMFileList.selectedItem.data.fileName, null, null,
				this.accessKeyId.getDataValue(), this.secretAccessKey.getDataValue()],
			dojo.hitch(this, "getAMCloudFilesComplete"),
			dojo.hitch(this, "_svcError"));
	},

	amShowFiles: function(inSender) {
		studio.beginWait("Getting the file list...");
	    this.cloudStorageService.requestAsync("getCloudFiles",["amazon", this.DepTargetList.selectedItem.data.container, null, null,
				this.accessKeyId.getDataValue(), this.secretAccessKey.getDataValue()],
			dojo.hitch(this, "getAMCloudFilesComplete"),
			dojo.hitch(this, "_svcError"));
	},


	RSCredentialOKButtonClick: function(inSender) {
		this.MainLayers.setLayer("RSFileListLayer");
	},

	RSCredentialBackButtonClick: function(inSender) {
		this.MainLayers.setLayer("DepTargetListLayer");
	},

	RSFileListRefreshButtonClick: function(inSender) {
		this.rsShowFiles();
	},

	RSFileListBackButtonClick: function(inSender) {
		this.MainLayers.setLayer("RSCredentialLayer");
	},

	RSFileListUploadWarButtonClick: function(inSender) {
		studio.beginWait("Uploading WAR File to RackSpace Storage ...");
	    this.cloudStorageService.requestAsync("copyWarFileToCloudStorage",["rackspace", this.DepTargetList.selectedItem.data.container,
				this.rsusername.getDataValue(), this.rspassword.getDataValue(), null, null] ,
			dojo.hitch(this, "getRSCloudFilesComplete"),
			dojo.hitch(this, "_svcError"));
	},

	RSFileListUploadEarButtonClick: function(inSender) {
		studio.beginWait("Uploading EAR File to RackSpace Storage ...");
	    this.cloudStorageService.requestAsync("copyEarFileToCloudStorage",["rackspace", this.DepTargetList.selectedItem.data.container,
				this.rsusername.getDataValue(), this.rspassword.getDataValue(), null, null] ,
			dojo.hitch(this, "getRSCloudFilesComplete"),
			dojo.hitch(this, "_svcError"));
	},

	RSFileListDeleteButtonClick: function(inSender) {
		studio.beginWait("Deleting a File in RackSpace Storage ...");
	    this.cloudStorageService.requestAsync("deleteFileInCloudStorage",["rackspace", this.DepTargetList.selectedItem.data.container,
				this.RSFileList.selectedItem.data.fileName, this.rsusername.getDataValue(), this.rspassword.getDataValue(), null, null] ,
			dojo.hitch(this, "getRSCloudFilesComplete"),
			dojo.hitch(this, "_svcError"));
	},

	rsShowFiles: function(inSender) {
		studio.beginWait("Getting the file list...");
	    this.cloudStorageService.requestAsync("getCloudFiles",["rackspace", this.DepTargetList.selectedItem.data.container, 
			this.rsusername.getDataValue(), this.rspassword.getDataValue(), null, null] ,
			dojo.hitch(this, "getRSCloudFilesComplete"),
			dojo.hitch(this, "_svcError"));
	},

	getRSCloudFilesComplete: function(inData) {
		studio.endWait();
		this.rsFileListVar.setData(inData);
		this.rsContainer.setDataValue(this.DepTargetList.selectedItem.data.container);
		dojo.query("#" + this.RSFileList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
		dojo.query("#" + this.RSFileList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
	},

	

	/* Event handler for this.DeployButton which (re) deploys the current war file to a tomcat server */
	contextRootOKButtonClick: function(inSender) {
		// Get the servlet context name we are trying to deploy it to
		var cr = this._getContextRoot();
		if (cr == null) return;

		studio.beginWait("Deploying...");

		// Send the redeploy command to server
		studio.deploymentService.requestAsync("deploy",
						  [this.deploymentTarget, cr, this._getProperties()],
						  dojo.hitch(this, "deployComplete"),
						  dojo.hitch(this, "_svcError"));
	},

	contextRootBackButtonClick: function(inSender) {
		this.MainLayers.setLayer("appListLayer");
	},
		
	setDefaultContext: function() {
		this.contextRoot.setDataValue("/" + studio.project.projectName);
	},

	/* Callback method for this.deployButtonClick */
	deployComplete: function(inData) {
		studio.endWait();
            app.toastDialog.showToast(inData, 5000, "Success");
		//app.alert(inData);
		this.MainLayers.setLayer("appListLayer");
	},

	redeployComplete: function(inData) {
		studio.endWait();
            app.toastDialog.showToast(inData, 5000, "Success");
		//app.alert(inData);
	},

	/* Event handler for this.undeployButton which undeploys the selected service from a tomcat server */
	appListUndeployButtonClick: function(inSender) {
            app.confirm("Are you sure you want to undeploy this application?", false,
                        dojo.hitch(this, function() {
		            // Get the servlet context root for the selected service 
		            // (depends on the text box with context being updated each time the user selects something in the list of servlets)
		            var cr = this._getContextRoot();
		            if (cr == null ) return;
		            if (cr == "/manager") {
		                app.alert("Undeploying the Tomcat Manager will disable parts of this service; as such we do not support this action");
		                return;
		            }
		            studio.beginWait("Undeploying...");
		            studio.deploymentService.requestAsync("undeploy", 
					                          [this.deploymentTarget, cr, this._getProperties()],
					                          dojo.hitch(this, "undeployComplete"),
					                          dojo.hitch(this, "_svcError"));
                        }));
	},

	/* Callback routine for this.undeployButtonClick */
	undeployComplete: function(inData) {
		studio.endWait();
		//app.alert(inData);
            app.toastDialog.showToast(inData, 5000, "Success");
		this.loadServerManagerAppList();
	},

	DepTargetListRefreshButtonClick: function() {
		this.depTargetShow();
    },	
	
	DepTargetListAddButtonClick: function() {
		this.currentAction = "Add";
		this.resetTargetProperties();
		this.MainLayers.setLayer("TargetPropertiesLayer");
    },

	DepTargetListEditButtonClick: function() {
		this.currentAction = "Edit";
		this.setTargetProperties();
		this.MainLayers.setLayer("TargetPropertiesLayer");
    },

	DepTargetListDeleteButtonClick: function() {
		studio.deploymentService.requestAsync("deleteDeploymentTarget", 
			 [this.DepTargetList.selectedItem.data.name],
			 dojo.hitch(this, "getDepTargetListComplete"),
			 dojo.hitch(this, "_svcError"));
    },
	
	DepTargetListOKButtonClick: function() {
		var currentTarget = this.DepTargetList.selectedItem.getData();
		if (currentTarget.destType == "server") {
			this.setDeploymentOptions(currentTarget);
			this.MainLayers.setLayer("DeployPropertiesLayer");
		} else if (currentTarget.serviceProvider == "amazon") {
			this.MainLayers.setLayer("AMCredentialLayer");
		} else {
			this.MainLayers.setLayer("RSCredentialLayer");
		}
    },

	setTargetProperties: function() {
		this.targetName.setDataValue(this.DepTargetList.selectedItem.data.name);
		this.targetDescription.setDataValue(this.DepTargetList.selectedItem.data.description);
		this.destType.setDataValue(this.DepTargetList.selectedItem.data.destType);
		this.serviceProvider.setDataValue(this.DepTargetList.selectedItem.data.serviceProvider);
		this.container.setDataValue(this.DepTargetList.selectedItem.data.container);
		this.serverType.setDataValue(this.DepTargetList.selectedItem.data.server);
		this.dnsHost.setDataValue(this.DepTargetList.selectedItem.data.dnsHost);
		this.privateIP.setDataValue(this.DepTargetList.selectedItem.data.privateIp);
		this.publicIP.setDataValue(this.DepTargetList.selectedItem.data.publicIp);
		this.portNumber.setDataValue(this.DepTargetList.selectedItem.data.port);
		this.serverUser.setDataValue(this.DepTargetList.selectedItem.data.user);
		this.serverPassword1.setDataValue(this.DepTargetList.selectedItem.data.password);
		this.serverPassword2.setDataValue(this.DepTargetList.selectedItem.data.password);
	},

	resetTargetProperties: function() {
		this.targetName.setDataValue("");
		this.targetDescription.setDataValue("");
		this.destType.setDataValue("");
		this.serviceProvider.setDataValue("");
		this.container.setDataValue("");
		this.serverType.setDataValue("");
		this.dnsHost.setDataValue("");
		this.privateIP.setDataValue("");
		this.publicIP.setDataValue("");
		this.portNumber.setDataValue("");
		this.serverUser.setDataValue("");
		this.serverPassword1.setDataValue("");
		this.serverPassword2.setDataValue("");
	},

	/* Event Handler for this.applist (a wm.List); updates the context root textfield for easy redeploy/undeployment of the thing selected */
	onAppListSelectionChange: function(inSender) {
		var selectedItemVar = inSender.selectedItem;
		var name = selectedItemVar.data.name;
		this.contextRoot.setDataValue(name);
	},

	/* Sends a request to the server for a list of services on a given tomcat server; for the this.showServerManager step */
	loadServerManagerAppList: function() {
		studio.beginWait("Connecting to server...");
		studio.deploymentService.requestAsync("listDeploymentNames", 
					  [this.deploymentTarget, this._getProperties()], 
					  dojo.hitch(this, "loadServerManagerAppListComplete"),
					  dojo.hitch(this, "_svcError"));    
	},

	/* Callback for this.loadServerManagerAppList updates the wm.list and advances to the next step */
	loadServerManagerAppListComplete: function(inData) {
		studio.endWait();
		// Update the Variable and wm.List with the new list of services
		this.appsVar.setType("com.wavemaker.tools.deployment.AppInfo");
		  console.log("INDATA:");console.log(inData);
		this.appsVar.setData(inData);
		this.applist.setDataSet(this.appsVar);
		this.applist.setColumnWidths("150px,290px,150px");

		// Style the wm.List
		dojo.query("#" + this.applist.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
		dojo.query("#" + this.applist.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
	},

	/* Generic ajax error handler */
	_svcError: function(inData) {
		studio.endWait();
		app.alert(inData.toString());
	},

	_setDataTypes: function() {
		wm.typeManager.addType("com.wavemaker.tools.deployment.AppInfo", {internal: true, fields: {
				name: {type: "java.lang.String", isObject: false, isList: false},
				href: {type: "java.lang.String", isObject: false, isList: false},
				description: {type: "java.lang.String", isObject: false, isList: false}
			}}
		);
	},

	setDeploymentOptions: function(item) {
		
		var propObj = {};

		if (item.serviceProvider == "opsource") { 
			propObj.host = item.privateIp;
			var htmlVal = "<font size=2>";
			htmlVal += "To access an OpSource server instance, you should first establish a VPN connection to the server's Network at OpSource. ";
			htmlVal += "Please click <a href='https://admin.opsourcecloud.net/cloudui/ms/login.htm' target='_blank'>here</a> to connect.";
			htmlVal += "</font>";
			this.helpLabel.setHtml(htmlVal);
			this.helpLabel.show();
		} else {
			this.helpLabel.setHtml("");
			this.helpLabel.show();
			if (item.serviceProvider == "rackspace")
				propObj.host = item.publicIp;
			else
				propObj.host = item.dnsHost;
		}

		propObj.port = item.port;
		propObj.username = item.user;
		propObj.password = item.password;
		this._clearEditors();
		var editorInfo = {};
		for (var k in propObj) {
		  editorInfo[k] = {dataValue: propObj[k]}
		}

		this._addEditors(editorInfo);
		studio.endWait(); 
	},

	_clearEditors: function() {
		dojo.map(this.currentEditors, function(o) {o.destroy();});
		this.currentEditors = [];
	},

	_addEditors: function(editorInfo) {
		var self = this, p = this.DeployPropertiesPanel;
		wm.forEachProperty(editorInfo, function(o, n) {
			var props = dojo.mixin({name: n, caption: n, 
			owner: self, parent: p}, o);
			var e = new wm.Editor(props);
			if (n == "password") e.editor.setPassword(true);
			self.currentEditors.push(e);
		});
		p.reflow();
	},

	/* Get the values the user entered in for the server so we can process a deploy click */
	_getProperties: function() {
		var rtn = {}
		dojo.map(this.currentEditors, function(e) {
			rtn[e.caption] = e.dataValue; }
		);
		return rtn;
	},

	/* Get the user-entered context root */
	_getContextRoot: function() {
		var rtn = this.contextRoot.getDataValue();
		if (rtn == null) {
			app.alert("Please enter a context root");
		}
		return rtn;
	},

	_end: 0
});
