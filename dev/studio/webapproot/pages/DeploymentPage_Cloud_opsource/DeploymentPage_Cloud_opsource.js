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
 
// TODO: Waiting indicators
dojo.provide("wm.studio.pages.DeploymentPage_Cloud_opsource.DeploymentPage_Cloud_opsource");

dojo.declare("DeploymentPage_Cloud_opsource", wm.Page, { 
    i18n: true,

    usernameValue: null,
    passwordValue: null,
	loginError: false,
    start: function() {
	wm.typeManager.addType("com.wavemaker.tools.cloudmgr.CloudNetwork", {internal: true, 			
									     "fields": {
										 "decsription": {
										     "exclude": [],
										     "include": [],
										     "isList": false,
										     "noChange": [],
										     "required": true,
										     "type": "java.lang.String"
										 },
										 "id": {
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
										 }
									     }});

	wm.typeManager.addType("com.wavemaker.tools.cloudmgr.CloudImage", {internal: true, 			
									   "fields": {
									       "CPUCount": {
										   "exclude": [],
										   "include": [],
										   "isList": false,
										   "noChange": [],
										   "required": true,
										   "type": "java.lang.String"
									       },
									       "OS": {
										   "exclude": [],
										   "include": [],
										   "isList": false,
										   "noChange": [],
										   "required": true,
										   "type": "java.lang.String"
									       },
									       "OSStorage": {
										   "exclude": [],
										   "include": [],
										   "isList": false,
										   "noChange": [],
										   "required": true,
										   "type": "java.lang.String"
									       },
									       "SOS": {
										   "exclude": [],
										   "include": [],
										   "isList": false,
										   "noChange": [],
										   "required": true,
										   "type": "java.lang.String"
									       },
									       "created": {
										   "exclude": [],
										   "include": [],
										   "isList": false,
										   "noChange": [],
										   "required": true,
										   "type": "java.lang.String"
									       },
									       "decsription": {
										   "exclude": [],
										   "include": [],
										   "isList": false,
										   "noChange": [],
										   "required": true,
										   "type": "java.lang.String"
									       },
									       "extraStorage": {
										   "exclude": [],
										   "include": [],
										   "isList": false,
										   "noChange": [],
										   "required": true,
										   "type": "java.lang.String"
									       },
									       "id": {
										   "exclude": [],
										   "include": [],
										   "isList": false,
										   "noChange": [],
										   "required": true,
										   "type": "java.lang.String"
									       },
									       "memory": {
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
									       }
									   }
									  });
    
	wm.typeManager.addType("com.wavemaker.tools.cloudmgr.CloudServer", {internal: true, 			
									   "fields": {
				"created": {
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
				"flavorId": {
					"exclude": [],
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"imageId": {
					"exclude": [],
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"networkId": {
					"exclude": [],
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"privateIpAddress": {
					"exclude": [],
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"publicIpAddress": {
					"exclude": [],
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"serverDesc": {
					"exclude": [],
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"serverId": {
					"exclude": [],
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"serverName": {
					"exclude": [],
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"status": {
					"exclude": [],
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "int"
				}
		}});

	var htmlVal = this.getDictionaryItem("HTML")
		this.helpLabel.setHtml(htmlVal);
		this.helpLabel.show();
    },
    setup: function() {      
	this.reset();      
    },
    reset: function() {
    },


    /**************************************************************************************************
     * Layer: Credential Layer
     **************************************************************************************************/
    CredentialBackButtonClick: function() {
		this.owner.setPageName("DeploymentPage_Cloud");
    },
    CredentialOKButtonClick: function() {
		// Store the access info for their account
		this.usernameValue = this.username.getDataValue();
		this.passwordValue = this.password.getDataValue();

		// Validate the form
		if (!this.usernameValue || !this.passwordValue) {
		    app.alert(this.getDictionaryItem("ALERT_ENTER_CREDENTIALS"));
			return;
		}
		this.showServerList();
		if (!this.loginError)
			this.MainLayers.setLayer("ServerListLayer");
		else
			this.loginError = false;
    },

    /**************************************************************************************************
     * Create Server Panel 
     **************************************************************************************************/
    createServerShow: function() {
	this.callServerBaseInfo(this.getDictionaryItem("RETRIEVING_OPTIONS"));
    },

	collectServerBaseInfo: function() {
		this.MainLayers.setLayer("CreateServersLayer");
	},

    createServerClick: function() {
		//if (this.rootPassword1.getDataValue() != this.rootPassword2.getDataValue()) {
		//	app.alert("Please re-enter admin password");
		//	return;
		//}

		this.callCreateServer(this.ImageList.selectedItem.getData().id,
							this.NetworkList.selectedItem.getData().id,
							this.serverName.getDataValue(),
							this.serverDescription.getDataValue(),
							null,
							"ServerListLayer");			      
		},

    createServerBackClick: function() {
		this.MainLayers.setLayer("ServerListLayer");
    },


    /**************************************************************************************************
     * Server List Panel 
     **************************************************************************************************/
    showServerList: function() {
	this.callServerList(this.getDictionaryItem("LOADING_SERVER_LIST"), "ServerListLayer");
    },
    deleteServerClick: function() {
	studio.beginWait(this.getDictionaryItem("WAIT_DELETING")); // in future may be used to do more than just kill a server
	    this.cloudServerService.requestAsync("deleteServer", 
						 ["opsource",
						  this.HostList.selectedItem.getData().serverId,
						  this.usernameValue,
						  this.passwordValue,
						  null,
						  null,
						  null,
						  null],
						 dojo.hitch(this,function(inResult) {
						     studio.endWait();
						     this.HostNamesVar.setData(inResult);
						     dojo.query("#" + this.HostList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
						     dojo.query("#" + this.HostList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
						 }),
						 dojo.hitch(this, "_svcError"));
    },
    serverListBackClick: function() {
		this.MainLayers.setLayer("CredentialLayer");
    },
	serverListRefreshClick: function() {
		this.showServerList();
    },

	/**************************************************************************************************
     * Target properties Panel 
     **************************************************************************************************/
	
	addToDepTargetClick: function() {
		this.MainLayers.setLayer("TargetPropertiesLayer");
	},

	setDefaultProperties: function() {
		this.targetName.setDataValue(this.HostList.selectedItem.data.serverName);
		this.targetDescription.setDataValue(this.HostList.selectedItem.data.serverDesc);
		this.destType.setEditorValue("server");
		this.serviceProvider.setEditorValue("opsource");
		this.serverType.setEditorValue("tomcat");
		this.privateIP.setDataValue(this.HostList.selectedItem.data.privateIpAddress);
		this.portNumber.setDataValue("8080");
		this.serverUser.setDataValue("");
		this.serverPassword1.setDataValue("");
	},

	targetPropertiesOKClick: function() {
		this.deploymentService.requestAsync("updateDeploymentTarget", 
			 [this.targetName.getDataValue(),
			  this.targetDescription.getDataValue(),
			  this.destType.getEditorValue(),
			  this.serviceProvider.getEditorValue(),
			  "",
			  this.serverType.getEditorValue(),
			  "", //dnsHost
			  "", //publicIp
			  this.privateIP.getDataValue(),
			  this.portNumber.getDataValue(),
			  this.serverUser.getDataValue() == undefined ? "" : this.serverUser.getDataValue(),
			  this.serverPassword1.getDataValue() == undefined ? "" : this.serverUser.getDataValue(),
			  this.overrideFlag.getDataValue()],
			 dojo.hitch(this,function(inResult) {
				 app.alert(inResult.toString());
			 }),
			 dojo.hitch(this, "_svcError"));
	},

	targetPropertiesBackClick: function() {
		this.MainLayers.setLayer("ServerListLayer");
	},

    /**************************************************************************************************
     * SERVICE CALLS 
     **************************************************************************************************/
    callServerListEnabled: true,
    callServerList: function(message, inLayer) {
		if (this.callServerListEnabled) {
			studio.beginWait(message);
			this.cloudServerService.requestSync("getServerList", 
							 [ "opsource",null,this.usernameValue,this.passwordValue,null,null,null,null],
							 dojo.hitch(this, function(inData) {
								 studio.endWait();
								 this.HostNamesVar.setData(inData);
								 dojo.query("#" + this.HostList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
								 dojo.query("#" + this.HostList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
								 //if (inLayer) this.MainLayers.setLayer(inLayer);
							 }),
							 dojo.hitch(this, "_svcError1"));
		} else if (inLayer) 
			this.MainLayers.setLayer(inLayer);
    },

    callServerBaseInfoEnabled: true,
    callServerBaseInfo: function(message, inLayer) {
	if (this.callServerBaseInfoEnabled) {
	    studio.beginWait(message);
	    var responseCount = 0;
	    this.cloudServerService.requestAsync("getImageList", 
						 ["opsource",this.usernameValue,this.passwordValue,null,null,null,null],
						 dojo.hitch(this,function(inResult) {
						     responseCount++;
						     if (responseCount >=2) studio.endWait();
						     this.ImageListVar.setData(inResult);
						     dojo.query("#" + this.ImageList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
						     dojo.query("#" + this.ImageList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
						 }),
						 dojo.hitch(this, "_svcError"));

	    this.cloudServerService.requestAsync("getNetworkList", 
						 ["opsource",this.usernameValue,this.passwordValue,null,null],
						 dojo.hitch(this,function(inResult) {
						     responseCount++;
						     if (responseCount >=2) studio.endWait();
						     this.NetworkListVar.setData(inResult);
						     dojo.query("#" + this.NetworkList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
						     dojo.query("#" + this.NetworkList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
						 }),
						 dojo.hitch(this, "_svcError"));
	} else if (inLayer) 
	    this.MainLayers.setLayer(inLayer);
    },

    callCreateServerEnabled: true,
    callCreateServer: function(inImage, inNetwork, inServerName, inDesc, inAdminPass, inLayer) {
	if (this.callCreateServerEnabled) {
	    studio.beginWait(this.getDictionaryItem("WAIT_CREATING", {serverName: inServerName}));
	    this.cloudServerService.requestAsync("createServer", 
						 ["opsource",
						  inServerName,
						  inDesc,
						  inImage,
						  "",
						  inNetwork,
						  inAdminPass,
						  null,
						  null,
						  null,
						  this.usernameValue,
						  this.passwordValue,
						  null,
						  null,
						  null,
						  null],
						  dojo.hitch(this,function(inResult) {
						     studio.endWait();
						      app.alert(this.getDictionaryItem("ALERT_CREATING_SUCCESS", {serverName: this.serverName.getDataValue()}));
						     //this.showServerList();
							 this.MainLayers.setLayer(inLayer);
						  }),
						  dojo.hitch(this, "_svcError"));
	} else if (inLayer) 
	    this.MainLayers.setLayer(inLayer);

    },

	/* Generic ajax error handler */
	_svcError: function(inData) {
		studio.endWait();
		app.alert(inData.toString());
	},

	_svcError1: function(inData) {
		studio.endWait();
		this.loginError = true;
		app.alert(inData.toString());
	},

    _end: 0
});
