!/*
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
dojo.provide("wm.studio.pages.DeploymentPage_Cloud_rackspacestorage.DeploymentPage_Cloud_rackspacestorage");

dojo.declare("DeploymentPage_Cloud_rackspacestorage", wm.Page, { 
    i18n: true,

    usernameValue: null,
    passwordValue: null,
	loginError: false,
	//accountValue: null,
	//timeoutValue: null,
    start: function() {
	wm.typeManager.addType("com.wavemaker.tools.cloudmgr.CloudContainer", {internal: true, 			
									     "fields": {
											"containerName": {
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
											"files": {
												"exclude": [],
												"include": [],
												"isList": true,
												"noChange": [],
												"required": true,
												"type": "com.wavemaker.tools.cloudmgr.CloudFile"
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
		this.usernameValue = this.username.getDataValue();
		this.passwordValue = this.password.getDataValue();

		// Validate the form
		if (!this.usernameValue || !this.passwordValue) {
		    app.alert(this.getDictionaryItem("ALERT_NO_CREDENTIALS"));
		    return;
		}
		this.showContainerList();
		if (!this.loginError)
			this.MainLayers.setLayer("ContainerListLayer");
		else
			this.loginError = false;
    },

	collectContainerBaseInfo: function() {
		this.MainLayers.setLayer("CreateContainerLayer");
	},

    createContainerClick: function() {
		this.callCreateContainer(this.containerName.getDataValue(), "ContainerListLayer");			      
	},

    createContainerBackClick: function() {
		this.MainLayers.setLayer("ContainerListLayer");
    },


    /**************************************************************************************************
     * Container List Panel 
     **************************************************************************************************/
    showContainerList: function() {
		this.callContainerList(this.getDictionaryItem("WAIT_LOADING_LIST"), "ContainerListLayer");
    },
    deleteContainerClick: function() {
	    studio.beginWait("Deleting"); // in future may be used to do more than just kill a container
	    this.cloudStorageService.requestAsync("deleteContainer", 
						 ["rackspace",
						  this.ContainerList.selectedItem.getData().containerName,
						  this.usernameValue,
						  this.passwordValue,
						  null,
						  null],
						 dojo.hitch(this,function(inResult) {
						     studio.endWait();
						     this.ContainerListVar.setData(inResult);
						     dojo.query("#" + this.ContainerList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
						     dojo.query("#" + this.ContainerList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
						 }),
						 dojo.hitch(this, "_svcError"));
    },
    containerListBackClick: function() {
		this.MainLayers.setLayer("CredentialLayer");
    },
	containerListRefreshClick: function() {
		this.showContainerList();
    },

	/**************************************************************************************************
     * Target properties Panel 
     **************************************************************************************************/
	
	addToDepTargetClick: function() {
		this.MainLayers.setLayer("TargetPropertiesLayer");
	},

	setDefaultProperties: function() {
		this.targetName.setDataValue(this.ContainerList.selectedItem.data.containerName);
		this.destType.setEditorValue("storage");
		this.serviceProvider.setEditorValue("rackspace");
		this.container.setDataValue(this.ContainerList.selectedItem.data.containerName);
	},

	targetPropertiesOKClick: function() {
		this.deploymentService.requestAsync("updateDeploymentTarget", 
			 [this.targetName.getDataValue(),
			  this.targetDescription.getDataValue(),
			  this.destType.getEditorValue(),
			  this.serviceProvider.getEditorValue(),
			  this.container.getDataValue(),
			  "", //server type
			  "", //dnsHost
			  "", //publicIp
			  "", //privateIp
			  "", //port
			  "", //user
			  "", //password
			  this.overrideFlag.getDataValue()],
			 dojo.hitch(this,function(inResult) {
				 app.alert(inResult.toString());
			 }),
			 dojo.hitch(this, "_svcError"));
	},

	targetPropertiesBackClick: function() {
		this.MainLayers.setLayer("ContainerListLayer");
	},

    /**************************************************************************************************
     * SERVICE CALLS 
     **************************************************************************************************/
    callContainerListEnabled: true,
    callContainerList: function(message, inLayer) {
		if (this.callContainerListEnabled) {
			studio.beginWait(message);
			this.cloudStorageService.requestSync("getContainerList", 
							 ["rackspace", this.usernameValue, this.passwordValue, null, null],
							 dojo.hitch(this, function(inData) {
								 studio.endWait();
								 this.ContainerListVar.setData(inData);
								 dojo.query("#" + this.ContainerList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
								 dojo.query("#" + this.ContainerList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
								 //if (inLayer) this.MainLayers.setLayer(inLayer);
							 }),
							 dojo.hitch(this, "_svcError1"));
		} else if (inLayer) 
			this.MainLayers.setLayer(inLayer);
    },

    callCreateContainerEnabled: true,
    callCreateContainer: function(inContainerName, inLayer) {
	if (this.callCreateContainerEnabled) {
	    studio.beginWait(this.getDictionaryItem("WAIT_CREATING", {containerName: inContainerName}));
	    this.cloudStorageService.requestAsync("createContainer", 
						 ["rackspace",
						  inContainerName,
						  null, //location
						  this.usernameValue,
						  this.passwordValue,
						  null,
						  null],
						  dojo.hitch(this,function(inResult) {
						     studio.endWait();
						      app.alert(this.getDictionaryItem("ALERT_CREATING_SUCCESS", {containerName: this.containerName.getDataValue()}));
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
