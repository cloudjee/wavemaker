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
dojo.provide("wm.studio.pages.DeploymentPage_Cloud_storage.DeploymentPage_Cloud_eucalyptuss3");

dojo.declare("DeploymentPage_Cloud_eucalyptuss3", wm.Page, { 
    accessKeyIdValue: null,
    secretAccessKeyValue: null,
	signatureVersion: "1",
	serviceURL: null,
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
			app.alert("Please log in so you can manage your containers.  ALTERNATIVE: Download the war and use your hosting provider's tools instead.");
			return;
		}
		this.MainLayers.setLayer("ContainerListLayer");
    },

	collectContainerBaseInfo: function() {
		this.MainLayers.setLayer("CreateContainerLayer");
	},

    createContainerClick: function() {
		if (this.containerName.getDataValue().indexOf(".") != -1) {
			app.alert("ERROR: You must not include periods (.) in the container name.");
			return;
		}
		this.callCreateContainer(this.containerName.getDataValue(), 
								this.containerLocation.getEditorValue(), 
								"ContainerListLayer");			      
	},

    createContainerBackClick: function() {
		this.MainLayers.setLayer("ContainerListLayer");
    },

	/**************************************************************************************************
     * Layer: Creat Container Layer
     **************************************************************************************************/
	setDefaultLoc: function() {
		this.containerLocation.setEditorValue("default");
	},

    /**************************************************************************************************
     * Container List Panel 
     **************************************************************************************************/
    showContainerList: function() {
		this.callContainerList("Loading your container list", "ContainerListLayer");
    },
    deleteContainerClick: function() {
	    studio.beginWait("Deleting"); // in future may be used to do more than just kill a container
		this.serviceURL = "http://" + this.cloudIPAddr.getDataValue() + ":" + this.cloudPort.getDataValue()
									+ "/services/Walrus";
	    this.cloudStorageService.requestAsync("deleteContainer", 
						 ["eucalyptus",
						  this.ContainerList.selectedItem.getData().containerName,
						  null,
						  null,
						  this.accessKeyIdValue,
						  this.secretAccessKeyValue,
						  this.serviceURL],
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
		this.serviceProvider.setEditorValue("eucalyptus");
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
			this.serviceURL = "http://" + this.cloudIPAddr.getDataValue() + ":" + this.cloudPort.getDataValue()
									+ "/services/Walrus";
			this.cloudStorageService.requestAsync("getContainerList", 
							 ["eucalyptus", null, null, this.accessKeyIdValue, this.secretAccessKeyValue,
								this.serviceURL],
							 dojo.hitch(this, function(inData) {
								 studio.endWait();
								 this.ContainerListVar.setData(inData);
								 dojo.query("#" + this.ContainerList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
								 dojo.query("#" + this.ContainerList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
								 if (inLayer) this.MainLayers.setLayer(inLayer);
							 }),
							 dojo.hitch(this, "_svcError"));
		} else if (inLayer) 
			this.MainLayers.setLayer(inLayer);
    },

    callCreateContainerEnabled: true,
    callCreateContainer: function(inContainerName, inLocation, inLayer) {
	if (this.callCreateContainerEnabled) {
	    studio.beginWait("Creating " + inContainerName + ". It may take several minutes. Please wait.");
		this.serviceURL = "http://" + this.cloudIPAddr.getDataValue() + ":" + this.cloudPort.getDataValue()
									+ "/services/Walrus";
	    this.cloudStorageService.requestAsync("createContainer", 
						 ["eucalyptus",
						  inContainerName,
						  inLocation, //location
						  null,
						  null,
						  this.accessKeyIdValue,
						  this.secretAccessKeyValue,
						  this.serviceURL],
						  dojo.hitch(this,function(inResult) {
						     studio.endWait();
							 app.alert("Container " + this.containerName.getDataValue() + " has been created successfully");
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

    _end: 0
});
