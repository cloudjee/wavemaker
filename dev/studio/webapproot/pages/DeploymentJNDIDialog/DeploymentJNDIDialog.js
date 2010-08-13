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

dojo.provide("wm.studio.pages.DeploymentJNDIDialog.DeploymentJNDIDialog");

dojo.declare("DeploymentJNDIDialog", wm.Part, {

	// has to match constant in DataModelDeploymentConfiguration
	JNDI_NAME_PROPERTY: ".jndi.dsname",

	// has to match fq class name of class that saves properties
	PROP_PREFIX: "com.wavemaker.tools.deployment.ServiceDeploymentManager",

	start: function() {
		this.jndiNames = {}; // <serviceid>.jndi.dsname -> jndi name
		this.deploymentTarget = null;
		this.currentEditors = [];
		this.dataModelNames = [];
	},
	setup: function() {
		this._setDataTypes();
		this._reset();
		//this.useJNDICheckbox.components.editor.setChecked(false);
		this.jndiEditor.setDataValue("");

		studio.dataService.requestAsync(LOAD_DATA_MODEL_NAMES_OP, [], 
			dojo.hitch(this, "_dataModelNamesCallback"));

		studio.studioService.requestAsync("getProperties", 
			[this.PROP_PREFIX],
			dojo.hitch(this, "_getPropertiesResult"));

		studio.deploymentService.requestAsync(
			"getDeploymentTargetNames", [], 
			dojo.hitch(this, "_getDeploymentTargetNamesResult"));
			
	},
/*
	useJNDICheckboxChange: function(inSender, inDisplayValue, inDataValue) {
		this.jndiEditor.setDisabled(!inDataValue);
		this.dbtypeEditor.setDisabled(inDataValue);
		this.hostEditor.setDisabled(inDataValue);
		this.portEditor.setDisabled(inDataValue);

		if (!inDataValue) {
			this.jndiEditor.setDataValue("");
		}
	},
        */
	dataModelListSelect: function(inSender, inItem) {
		this._dataModelListSelect(true);
	},
        dataModelNameChange: function(inSender) {
		this._saveJNDIName();
        },
	okButtonClick: function(inSender) {
		this._saveJNDIName();
		this.owner.owner.dismiss();
	},
	cancelButtonClick: function(inSender) {
		this._reset(); 
		this.owner.owner.dismiss();    
	},
	_getParms: function() {
		this.accessKeyId = this.ec2Dialog.eC2Dialog.accessKeyId.getDataValue();
		this.secretAccessKey = this.ec2Dialog.eC2Dialog.secretAccessKey.getDataValue();

		if (this.accessKeyId == undefined || this.accessKeyId == null || this.accessKeyId == "" ||
			this.secretAccessKey == undefined || this.secretAccessKey == null || this.secretAccessKey == "") return;

		if (this.deploymentTarget == "deploy2EC2")
		{
			this.connHandle_showEC2HostList = dojo.connect(this, "_saveEC2InstanceJsonStr", this, "_showEC2HostList");
			studio.deploymentService.request("getEC2InstanceInfo", 
				[this.deploymentTarget, this.myAMI, this.accessKeyId, this.secretAccessKey], 
				dojo.hitch(this, "_saveEC2InstanceJsonStr"), dojo.hitch(this, "_svcError"));
		}
		else //deploy2RightScale
		{
			this.connHandle_showS3BucketList = dojo.connect(this, "_saveS3BucketJsonStr", this, "_showS3BucketList");
			studio.deploymentService.request("getS3BucketInfo", 
				[this.deploymentTarget, this.accessKeyId, this.secretAccessKey], 
				dojo.hitch(this, "_saveS3BucketJsonStr"), dojo.hitch(this, "_svcError"));
		}
	},
	_getParms1: function() {
		this.ec2InstanceInfo = this.ec2HostDialog.eC2HostList.hostList.getDisplayValue(); 
	},
	_dataModelNamesCallback: function(dataModelNames) {
		this.dataModelNames = dataModelNames;
		this.dataModelList._data = dataModelNames;
		this.dataModelList._render();
		var d = !this.dataModelNames || this.dataModelNames.length == 0;
		if (d)
			this.dataModelNameEditor.setDataValue("");
		//this.useJNDICheckbox.setDisabled(d);
		this.jndiEditor.setDisabled(d);
	},
	_listedDeploymentNames: function(inData) {
		this.appsVar.setType("com.wavemaker.tools.deployment.AppInfo");
		this.appsVar.setData(inData);
		this.applist.setDataSet(this.appsVar);
	},
	_svcError: function(inData) {
		studio.endWait();
		app.alert(inData);
	},
	_getDeploymentTargetNamesResult: function(inData) {
		this.deploymentTargetSelect.editor.setOptions(inData.join(","));
	},
	_dataModelListSelect: function(saveCurrentSelection) {
		if (saveCurrentSelection) {
			this._saveJNDIName();
		}
		//this.useJNDICheckbox.setDisabled(false);
		var i = this.dataModelList.selected.index;
		var dataModelName = this.dataModelList._data[i];
		this.dataModelNameEditor.setDataValue(dataModelName);
		var key = this._getKey(dataModelName);
		if (this.jndiNames[key] == null) {
			//this.useJNDICheckbox.components.editor.setChecked(false);
			//this.jndiEditor.setDisabled(true);
			this.jndiEditor.setDataValue("");
		} else {
			//this.useJNDICheckbox.components.editor.setChecked(true);
			//this.jndiEditor.setDisabled(false);
			this.jndiEditor.setDataValue(this.jndiNames[key]);
		}
	},
	_saveJNDIName: function() {
		var key = this._getKey(this.dataModelNameEditor.getDataValue());
		var j = this.jndiEditor.getDataValue();
		if (j == null) {
			j = "";
		} else {
			j = dojo.string.trim(j);
		}

		//if (this.useJNDICheckbox.components.editor.getChecked()) {
			if (j == "") {
				this.jndiNames[key] = null;
			} else {
				this.jndiNames[key] = j;
			}
/*
		} else {
			this.jndiNames[key] = null;
		}
                */
	},
	_getKey: function(dataModelName) {
		return dataModelName + this.JNDI_NAME_PROPERTY;
	},
	_prepareJNDINames: function() {
		var rtn = {};
		for (var i in this.jndiNames) {
			if (this.jndiNames[i] != null) {
				rtn[i] = this.jndiNames[i];
			}
		}
		return rtn;
	},
	_reset: function() {
		this.jndiNames = {};
	},
	_getPropertiesResult: function(inData) {
		this.jndiNames = inData;
		if (this.dataModelNames.length > 0) {
			this.dataModelList.selectByIndex(0);
			this._dataModelListSelect(false);
		}
	},
	_loadedDeploymentOptions: function(inData) {
		if (this.ec2Dialog) {
			this.ec2Dialog.dismiss();
		}

		this._clearEditors();
		var editorInfo = {};
		for (var k in inData) {
			editorInfo[k] = {dataValue: inData[k]}
		}
		this._addEditors(editorInfo);
		studio.endWait(); 
	},

	_setDataTypes: function() {
		wm.typeManager.addType("com.wavemaker.tools.deployment.AppInfo", {internal: true, fields: {
			name: {type: "java.lang.String", isObject: false, isList: false},
			href: {type: "java.lang.String", isObject: false, isList: false},
			description: {type: "java.lang.String", isObject: false, isList: false}
			}}
		);

	},
	_end: 0
});
