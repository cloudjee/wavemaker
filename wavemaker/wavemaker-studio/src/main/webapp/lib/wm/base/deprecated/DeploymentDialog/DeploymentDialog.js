/*
 * Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.declare("DeploymentDialog", wm.Part, {
        i18n: true,

	// has to match constant in DataModelDeploymentConfiguration
	JNDI_NAME_PROPERTY: ".jndi.dsname",

	// has to match fq class name of class that saves properties
	PROP_PREFIX: "com.wavemaker.tools.deployment.ServiceDeploymentManager",

	accessKeyId: null,
	secretAccessKey: null,
	deployOpt: null,
	ec2InstanceJsonStr: null,
	ec2InstanceId: null,
	ec2InstanceInfo: null,
	myAMI: "ami-21779c48",

	s3BucketJsonStr: null,
	warFile: null,
	bucketName: null,

	connHandle_showEC2HostList: null,
	connHandle_setHostList: null,
	connHandle_showS3BucketList: null,
	
	start: function() {
		this.jndiNames = {}; // <serviceid>.jndi.dsname -> jndi name
		this.deploymentTarget = null;
		this.currentEditors = [];
		this.dataModelNames = [];
	},
	setup: function() {
		this._setDataTypes();
		this._reset();
		this.useJNDICheckbox.components.editor.setChecked(false);
		this.jndiEditor.setDataValue("");

		studio.dataService.requestAsync(LOAD_DATA_MODEL_NAMES_OP, [], 
			dojo.hitch(this, "_dataModelNamesCallback"));

		studio.studioService.requestAsync("getProperties", 
			[this.PROP_PREFIX],
			dojo.hitch(this, "_getPropertiesResult"));

		studio.deploymentService.requestAsync(
			"getDeploymentTargetNames", [], 
			dojo.hitch(this, "_getDeploymentTargetNamesResult"));
			
		this.contextRoot.setDataValue(studio.project.projectName);
	},
	useJNDICheckboxChange: function(inSender, inDisplayValue, inDataValue) {
		this.jndiEditor.setDisabled(!inDataValue);
		this.dbtypeEditor.setDisabled(inDataValue);
		this.hostEditor.setDisabled(inDataValue);
		this.portEditor.setDisabled(inDataValue);

		if (!inDataValue) {
			this.jndiEditor.setDataValue("");
		}
	},
	dataModelListSelect: function(inSender, inItem) {
		this._dataModelListSelect(true);
	},
	okButtonClick: function(inSender) {
		this._saveJNDIName();
		this.owner.owner.dismiss();
		this.studio.onDeployOkClicked(this._prepareJNDINames());
		this._reset();
	},
	cancelButtonClick: function(inSender) {
		this._reset(); 
		this.owner.owner.dismiss();    
	},
	listAppsButtonClick: function(inSender) {
		this._loadDeployedApps();
	},
	deployButtonClick: function(inSender) {
		var cr = this._getContextRoot();
		if (cr == null) return;
		var v = [this.deploymentTarget, cr,
				this._getProperties()];
		studio.beginWait("Deploying...");
		studio.deploymentService.requestAsync("deploy", v,
			dojo.hitch(this, "_deployed"), dojo.hitch(this, "_svcError"));
	},
	undeployButtonClick: function(inSender) {
		var cr = this._getContextRoot();
		if (cr == null) return;
		var v = [this.deploymentTarget, cr, this._getProperties()];
		studio.beginWait("Undeploying...");
		studio.deploymentService.requestAsync("undeploy", v,
			dojo.hitch(this, "_undeployed"), dojo.hitch(this, "_svcError"));
	},
	redeployButtonClick: function(inSender) {
		var cr = this._getContextRoot();
		if (cr == null) return;
		var v = [this.deploymentTarget, cr, this._getProperties()];
		studio.beginWait("Redeploying...");
		studio.deploymentService.requestAsync("redeploy", v,
			dojo.hitch(this, "_redeployed"), dojo.hitch(this, "_svcError"));
	},
	deploymentTargetSelectChange: function(
		inSender, inDisplayValue, inDataValue) {

		if (inDataValue == "") {
		    return;
		}
	
		this.deploymentTarget = inDataValue;

		if (inDataValue == "deploy2EC2" || inDataValue == "deploy2RightScale") //deploy2EC2 or deploy2RightScale
		{	
			if (!this.ec2Dialog) {
				var props = {
					owner: studio,
					pageName: "EC2Dialog",
					hideControls: true
				};
				this.ec2Dialog = new wm.PageDialog(props);
				this.ec2Dialog.setContainerOptions(true, 370, 145);

				dojo.connect(this.ec2Dialog.eC2Dialog, "okButtonClick", this, "_getParms");
			}
			this.ec2Dialog.show();
		} else { //deploy2Tomcat
			studio.deploymentService.request("getConfigurableProperties", 
				[inDataValue], 
				dojo.hitch(this, "_loadedDeploymentOptions"), dojo.hitch(this, "_svcError"));
		}
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
	_showEC2HostList: function() {
		if (!this.ec2HostDialog) {
			var props = {
				owner: studio,
				pageName: "EC2HostList",
				hideControls: true
			};
			this.ec2HostDialog = new wm.PageDialog(props);
			this.ec2HostDialog.setContainerOptions(true, 750, 160);
			dojo.connect(this.ec2HostDialog.eC2HostList, "okButtonClick", this, "_getParms1");
			dojo.connect(this.ec2HostDialog.eC2HostList, "dismissToContinue", this, "_getEC2Config1");
			dojo.connect(this.ec2HostDialog.eC2HostList, "newButtonClick", this, "_launchEC2Instance");
			dojo.connect(this.ec2HostDialog.eC2HostList, "terminateButtonClick", this, "_terminateEC2Instance");
		}
		if (this.ec2HostDialog.page) {
			this._setHostList();
		}

		this.ec2HostDialog.show();
		dojo.disconnect(this.connHandle_showEC2HostList);
	},
	_showS3BucketList: function() {
		if (!this.s3BucketList) {
			var props = {
				owner: studio,
				pageName: "S3BucketList",
				hideControls: true
			};
			this.s3BucketList = new wm.PageDialog(props);
			this.s3BucketList.setContainerOptions(true, 750, 160);
			dojo.connect(this.s3BucketList.s3BucketList, "copyWarButtonClick", this, "_copyWarFileToS3");
			dojo.connect(this.s3BucketList.s3BucketList, "deleteWarButtonClick", this, "_deleteWarFileInS3");
			this.connHandle_showS3BucketDialog = dojo.connect(this.s3BucketList.s3BucketList, "newButtonClick", this, "_showS3BucketDialog");
			dojo.connect(this.s3BucketList.s3BucketList, "deleteButtonClick", this, "_deleteS3Bucket");
		}
		if (this.s3BucketList.page) {
			this._setBucketList();
		}

		this.s3BucketList.show();
		dojo.disconnect(this.connHandle_showS3BucketList);
	},
	_showS3BucketDialog: function() {
		if (!this.s3BucketDialog) {
			var props = {
				owner: studio,
				pageName: "S3BucketDialog",
				hideControls: true
			};
			this.s3BucketDialog = new wm.PageDialog(props);
			this.s3BucketDialog.setContainerOptions(true, 390, 140);
			dojo.connect(this.s3BucketDialog.s3BucketDialog, "okButtonClick", this, "_createS3Bucket");
		}

		this.s3BucketDialog.show();
		this.s3BucketDialog.s3BucketDialog.locName.setDataValue("Default");
	},
	_getParms1: function() {
		this.ec2InstanceInfo = this.ec2HostDialog.eC2HostList.hostList.getDisplayValue(); 
	},
	_saveEC2InstanceJsonStr: function(inData) {
		this.ec2InstanceJsonStr = inData; 
	},
	_saveS3BucketJsonStr: function(inData) {
		this.s3BucketJsonStr = inData; 
	},
	_saveEC2InstanceJsonStr1: function(inData) {
		app.alert("Succesfully terminated the instance, Id = " + this.ec2InstanceId);
		this.ec2InstanceJsonStr = inData;
		this._setHostList();
	},
	_setHostList: function() {
		this.ec2HostDialog.eC2HostList.hostNames.setJson(this.ec2InstanceJsonStr);
		this.ec2HostDialog.eC2HostList.hostList.editor.setDataSet(this.ec2HostDialog.eC2HostList.hostNames);
		dojo.disconnect(this.connHandle_setHostList);
	},
	_launchEC2Instance: function() {
		studio.beginWait("It may take several minutes to acquire an EC2 Instance. Please wait...");
		studio.deploymentService.request("launchEC2Instance", 
			[this.deploymentTarget, this.myAMI, this.accessKeyId, this.secretAccessKey],
			dojo.hitch(this, "_postLaunch"), dojo.hitch(this, "_svcError"));
	},
	_postLaunch: function(inData) {
		studio.endWait();
		app.alert("Succesfully launched a new instance, Id = " + inData);
		this.connHandle_setHostList = dojo.connect(this, "_saveEC2InstanceJsonStr", this, "_setHostList");
		studio.deploymentService.request("getEC2InstanceInfo", 
				[this.deploymentTarget, this.myAMI, this.accessKeyId, this.secretAccessKey], 
				dojo.hitch(this, "_saveEC2InstanceJsonStr"), dojo.hitch(this, "_svcError"));
		
	},
	_getEC2Config1: function() {
		studio.deploymentService.request("getConfigurableProperties",
			[this.deploymentTarget, this.ec2InstanceInfo, this.accessKeyId, this.secretAccessKey],
			dojo.hitch(this, "_loadedDeploymentOptions"), dojo.hitch(this, "_svcError"));
	},
	_terminateEC2Instance: function() {
		this.ec2InstanceId = this.ec2HostDialog.eC2HostList.hostList.getDataValue();
		if (this.ec2InstanceId == null || this.ec2InstanceId == undefined || this.ec2InstanceId == "") return;
		studio.deploymentService.request("terminateEC2Instance", 
			[this.deploymentTarget, this.ec2InstanceId, "ami-21779c48", this.accessKeyId, this.secretAccessKey], 
			dojo.hitch(this, "_saveEC2InstanceJsonStr1"), dojo.hitch(this, "_svcError"));
		this._setHostList();
	},
	_createS3Bucket: function() {
		this.bucketName = this.s3BucketDialog.s3BucketDialog.bucket.getDataValue();
		var locName = this.s3BucketDialog.s3BucketDialog.locName.getDataValue();
		studio.deploymentService.request("createS3Bucket", 
			[this.deploymentTarget, this.bucketName, locName, this.accessKeyId, this.secretAccessKey],
			dojo.hitch(this, "_postCreateS3Bucket"), dojo.hitch(this, "_svcError"));
	},
	_postCreateS3Bucket: function(inData) {
		if (this.s3BucketDialog) {
			this.s3BucketDialog.dismiss();
		}
		app.alert("Succesfully created a new S3 bucket, name = " + this.bucketName);
		this.s3BucketJsonStr = inData;
		this._setBucketList();
	},
	_deleteS3Bucket: function() {
		//studio.beginWait("It may take several minutes to acquire an EC2 Instance. Please wait...");
		this.bucketName = this.s3BucketList.s3BucketList.bucketList.getDataValue();
		studio.deploymentService.request("deleteS3Bucket", 
			[this.deploymentTarget, this.bucketName, this.accessKeyId, this.secretAccessKey],
			dojo.hitch(this, "_postDeleteS3Bucket"), dojo.hitch(this, "_svcError"));
	},
	_postDeleteS3Bucket: function(inData) {
		app.alert("Succesfully deleted S3 bucket, name = " + this.bucketName);
		this.s3BucketJsonStr = inData;
		this._setBucketList();
	},
	_setBucketList: function() {
		this.s3BucketList.s3BucketList.bucketNames.setJson(this.s3BucketJsonStr);
		this.s3BucketList.s3BucketList.bucketList.editor.setDataSet(this.s3BucketList.s3BucketList.bucketNames);
	},
	_copyWarFileToS3: function() {
		this.bucketName = this.s3BucketList.s3BucketList.bucketList.getDataValue();
		if (this.bucketName == null || this.bucketName == undefined || this.bucketName == "") return;
		studio.beginWait("It may take several minutes to upload the WAR file to S3. Please wait...");
		studio.deploymentService.request("copyWarFileToS3", 
			[this.deploymentTarget, this.bucketName, this.accessKeyId, this.secretAccessKey], 
			dojo.hitch(this, "_postCopyWarFile"), dojo.hitch(this, "_svcError"));
	},
	_postCopyWarFile: function(inData) {
		studio.endWait();
		app.alert("WAR file " + inData.toString() + " has been uploaded to S3 bucket " + this.bucketName);
	},
	_deleteWarFileInS3: function() {
		this.bucketName = this.s3BucketList.s3BucketList.bucketList.getDataValue();
		if (this.bucketName == null || this.bucketName == undefined || this.bucketName == "") return;
		studio.deploymentService.request("deleteWarFileInS3", 
			[this.deploymentTarget, this.bucketName, this.accessKeyId, this.secretAccessKey], 
			dojo.hitch(this, "_postDeleteWarFile"), dojo.hitch(this, "_svcError"));
	},
	_postDeleteWarFile: function(inData) {
		studio.endWait();
		app.alert("WAR file " + inData.toString() + " in S3 bucket " + this.bucketName + " has been deleted");
	},

	onAppGridCellClick: function(inSender, inEvent) {
	    var row = this.appsVar.getItem(inEvent.rowIndex);
	    this.contextRoot.setDataValue(row.getValue("name"));
	},
	_dataModelNamesCallback: function(dataModelNames) {
		this.dataModelNames = dataModelNames;
		this.dataModelList._data = dataModelNames;
		this.dataModelList._render();
		var d = !this.dataModelNames || this.dataModelNames.length == 0;
		if (d)
			this.dataModelNameEditor.setDataValue("");
		this.useJNDICheckbox.setDisabled(d);
		this.jndiEditor.setDisabled(d);
	},
	_loadDeployedApps: function() {
		studio.deploymentService.requestAsync("listDeploymentNames", 
			[this.deploymentTarget, this._getProperties()], 
			dojo.hitch(this, "_listedDeploymentNames"));		
	},
	_listedDeploymentNames: function(inData) {
		this.appsVar.setType("com.wavemaker.tools.deployment.AppInfo");
		this.appsVar.setData(inData);
		this.applist.setDataSet(this.appsVar);
	},
	_deployed: function(inData) {
		studio.endWait();
		app.alert(inData.toString());
		this._loadDeployedApps();
	},
	_svcError: function(inData) {
		studio.endWait();
		app.alert(inData.toString());
	},
	_undeployed: function(inData) {
		studio.endWait();
		app.alert(inData.toString());
		this._loadDeployedApps();
	},
	_redeployed: function(inData) {
		studio.endWait();
		app.alert(inData.toString());
	},
	_getDeploymentTargetNamesResult: function(inData) {
		this.deploymentTargetSelect.editor.setOptions(inData.join(","));
	},
	_dataModelListSelect: function(saveCurrentSelection) {
		if (saveCurrentSelection) {
			this._saveJNDIName();
		}
		this.useJNDICheckbox.setDisabled(false);
		var i = this.dataModelList.selected.index;
		var dataModelName = this.dataModelList._data[i];
		this.dataModelNameEditor.setDataValue(dataModelName);
		var key = this._getKey(dataModelName);
		if (this.jndiNames[key] == null) {
			this.useJNDICheckbox.components.editor.setChecked(false);
			this.jndiEditor.setDisabled(true);
			this.jndiEditor.setDataValue("");
		} else {
			this.useJNDICheckbox.components.editor.setChecked(true);
			this.jndiEditor.setDisabled(false);
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

		if (this.useJNDICheckbox.components.editor.getChecked()) {
			if (j == "") {
				this.jndiNames[key] = null;
			} else {
				this.jndiNames[key] = j;
			}
		} else {
			this.jndiNames[key] = null;
		}
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
	_clearEditors: function() {
		dojo.map(this.currentEditors, function(o) {o.destroy();});
		this.currentEditors = [];
	},
	_addEditors: function(editorInfo) {
		var self = this, p = this.propertiesPanel
		wm.forEachProperty(editorInfo, function(o, n) {
			var props = dojo.mixin({name: n, caption: n, 
				owner: self, parent: p}, o);
			var e = new wm.Editor(props);
			if (n == "password")
				e.editor.setPassword(true);
			self.currentEditors.push(e);
		});
		p.reflow();
	},
	_getProperties: function() {
		var rtn = {}
		dojo.map(this.currentEditors, function(e) {
			rtn[e.caption] = e.dataValue; }
		);
		return rtn;
	},
	_getContextRoot: function() {
		var rtn = this.contextRoot.getDataValue();
		if (rtn == null) {
			app.alert("Please enter a context root");
		}
		return rtn;
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