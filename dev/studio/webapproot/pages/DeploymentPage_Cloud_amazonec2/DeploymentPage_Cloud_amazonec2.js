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
// TODO: Waiting indicators
dojo.provide("wm.studio.pages.DeploymentPage_Cloud_amazonec2.DeploymentPage_Cloud_amazonec2");

dojo.declare("DeploymentPage_Cloud_amazonec2", wm.Page, { 
        i18n: true,

	signatureVersion: "2",
	serviceURL: "https://ec2.amazonaws.com",
	loginError: false,
    start: function() {
	wm.typeManager.addType("com.wavemaker.tools.cloudmgr.CloudSecurityGroup", {internal: true, 			
									     "fields": {
											"description": {
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
											"owner": {
												"exclude": [],
												"include": [],
												"isList": false,
												"noChange": [],
												"required": true,
												"type": "java.lang.String"
											}
									     }});

	wm.typeManager.addType("com.wavemaker.tools.cloudmgr.CloudKeyPair", {internal: true, 			
									     "fields": {
											"fingerprint": {
												"exclude": [],
												"include": [],
												"isList": false,
												"noChange": [],
												"required": true,
												"type": "java.lang.String"
											},
											"keyname": {
												"exclude": [],
												"include": [],
												"isList": false,
												"noChange": [],
												"required": true,
												"type": "java.lang.String"
											},
											"material": {
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
											"created": {
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

	var htmlVal = this.getDictionaryItem("HTML");
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
		this.accessKeyIdValue = this.accessKeyId.getDataValue();
		this.secretAccessKeyValue = this.secretAccessKey.getDataValue();

		// Validate the form
		if (!this.accessKeyIdValue || !this.secretAccessKeyValue) {
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
		this.callServerBaseInfo("Retrieving your server options");
    },

	collectServerBaseInfo: function() {
		this.MainLayers.setLayer("CreateServersLayer");
	},

    createServerClick: function() {

		var selectedGrps = new Array();
		var len = this.SecurityGroupList.items.length;
		var cnt = 0;
		for (var i=0; i<len; i++)
		{
			if (this.SecurityGroupList.items[i].selected) {
				selectedGrps[cnt] = this.SecurityGroupList.items[i].getData().name;
				cnt++;
			}
		}

		this.callCreateServer(this.ImageList.selectedItem.getData().id,
							this.KeyPairList.selectedItem.getData().keyname,
							this.VMTypeList.getDataValue(),
							selectedGrps,
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
						 ["amazon",
						  this.HostList.selectedItem.getData().serverId,
						  null,
						  null,
						  this.accessKeyIdValue,
						  this.secretAccessKeyValue,
						  this.signatureVersion,
						  this.serviceURL],
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
		this.targetName.setDataValue(this.HostList.selectedItem.data.serverId);
		this.targetDescription.setDataValue(this.HostList.selectedItem.data.serverDesc);
		this.destType.setEditorValue("server");
		this.serviceProvider.setEditorValue("amazon");
		this.serverType.setEditorValue("tomcat");
		this.dnsHost.setDataValue(this.HostList.selectedItem.data.dnsHost);
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
			  this.dnsHost.getDataValue(), //dnsHost
			  "", //publicIp
			  "", //privateIp
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
							 [ "amazon", null, null, null, this.accessKeyIdValue, this.secretAccessKeyValue,
								this.signatureVersion,
								this.serviceURL],
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
						 ["amazon", null, null, this.accessKeyIdValue, this.secretAccessKeyValue,
						  this.signatureVersion,
						  this.serviceURL],
						 dojo.hitch(this,function(inResult) {
						     responseCount++;
						     if (responseCount >=2) studio.endWait();
							 studio.endWait();
						     this.ImageListVar.setData(inResult);
						     dojo.query("#" + this.ImageList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
						     dojo.query("#" + this.ImageList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
						 }),
						 dojo.hitch(this, "_svcError"));

	    this.cloudServerService.requestAsync("getSecurityGroupList", 
						 ["amazon", null, null, this.accessKeyIdValue, this.secretAccessKeyValue,
						  this.signatureVersion,
						  this.serviceURL],
						 dojo.hitch(this,function(inResult) {
						     responseCount++;
						     if (responseCount >=2) studio.endWait();
						     this.SecurityGroupListVar.setData(inResult);
						     dojo.query("#" + this.SecurityGroupList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
						     dojo.query("#" + this.SecurityGroupList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
						 }),
						 dojo.hitch(this, "_svcError"));

		this.cloudServerService.requestAsync("getKeyPairList", 
						 ["amazon", null, null, this.accessKeyIdValue, this.secretAccessKeyValue,
						  this.signatureVersion,
						  this.serviceURL],
						 dojo.hitch(this,function(inResult) {
						     responseCount++;
						     if (responseCount >=2) studio.endWait();
						     this.KeyPairListVar.setData(inResult);
						     dojo.query("#" + this.KeyPairList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
						     dojo.query("#" + this.KeyPairList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
						 }),
						 dojo.hitch(this, "_svcError"));

		this.VMTypeList.setDataValue("m1.small");
						
	} else if (inLayer) 
	    this.MainLayers.setLayer(inLayer);
    },

    callCreateServerEnabled: true,
    callCreateServer: function(inImage, inKeyPair, inVMType, inSecGroup, inLayer) {
	if (this.callCreateServerEnabled) {
	    studio.beginWait(this.getDictionaryItem("WAIT_CREATING_EC2"))

	    this.cloudServerService.requestAsync("createServer", 
						 ["amazon",
						  null,
						  null,
						  inImage,
						  null,
						  null,
						  null,
						  inKeyPair,
						  inVMType,
						  inSecGroup,
						  null,
						  null,
						  this.accessKeyIdValue,
						  this.secretAccessKeyValue,
						  this.signatureVersion,
						  this.serviceURL],
						  dojo.hitch(this,function(inResult) {
						     studio.endWait();
						      app.alert(this.getDictionaryItem("ALERT_EC2_SUCCESS"));
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
