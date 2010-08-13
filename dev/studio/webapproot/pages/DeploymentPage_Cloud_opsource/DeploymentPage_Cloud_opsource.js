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
dojo.provide("wm.studio.pages.DeploymentPage_Cloud_opsource.DeploymentPage_Cloud_opsource");

dojo.declare("DeploymentPage_Cloud_opsource", wm.Page, { 
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

		var htmlVal = "<font size=2>";	
		htmlVal += "Please click <a href='http://www.opsourcecloud.com' target='_blank'>here</a> to ";
		htmlVal += "create an OpSource account if you do not have one.<br/><br/>";
		htmlVal += "If you have an OpSource account, please click <a href='https://admin.opsourcecloud.net/cloudui/ms/login.htm' target='_blank'>here</a> ";
		htmlVal += "to perform the following prerequisite tasks if needed, before creating server instances.<br/><br/>";
		htmlVal += "&nbsp;&nbsp;&nbsp;&nbsp;- Create an OpSource account<br/>";
		htmlVal += "&nbsp;&nbsp;&nbsp;&nbsp;- Create custom server images<br/>";
		htmlVal += "&nbsp;&nbsp;&nbsp;&nbsp;- Create networks<br/>";
		htmlVal += "</font>";
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
			app.alert("Please log in so you can manage your servers.  ALTERNATIVE: Download the war and use your hosting provider's tools instead.");
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
		this.callServerBaseInfo("Retrieving your server options");
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
		this.callServerList("Loading your server list", "ServerListLayer");
    },
    deleteServerClick: function() {
	    studio.beginWait("Terminating"); // in future may be used to do more than just kill a server
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
				 app.alert(inResult);
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
	    studio.beginWait("Creating " + inServerName + ". It may take several minutes. Please wait.");
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
							 app.alert("Server " + this.serverName.getDataValue() + " has been created successfully");
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
		app.alert(inData);
	},

	_svcError1: function(inData) {
		studio.endWait();
		this.loginError = true;
		app.alert(inData);
	},

    _end: 0
});
