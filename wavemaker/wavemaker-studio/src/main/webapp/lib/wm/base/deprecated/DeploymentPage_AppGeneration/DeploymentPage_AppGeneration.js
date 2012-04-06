/*
 * Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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
dojo.provide("wm.studio.pages.DeploymentPage_AppGeneration.DeploymentPage_AppGeneration");

dojo.declare("DeploymentPage_AppGeneration", wm.Part, { 
  i18n: true,

  // has to match constant in DataModelDeploymentConfiguration
  JNDI_NAME_PROPERTY: ".jndi.dsname",

  appTimestamp: 0,

  start: function() {
/*
	dojo.query("#" + this.archiveType.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
	dojo.query("#" + this.archiveType.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
	*/
  },
  setup: function() {      
      this.reset();      
      this.JNDIDialog = this.getJNDIDialog();
      //this.archiveType.eventSelect(this.archiveType.getItem(0));
/*
      studio.deploymentService.requestAsync("getWarDate", 
					    [], 
					    dojo.hitch(this, function(inResult) {
							if (inResult == null) {
							    this.lastGeneratedLabel.setCaption(this.getDictionaryItem("LABEL_LAST_GENERATED_NEVER"));
								this.downloadAppButton.setDisabled(true);
							} else {
								this.appTimestamp = inResult;
							        this.lastGeneratedLabel.setCaption(this.getDictionaryItem("LABEL_LAST_GENERATED_NEVER", {timestamp: inResult}));
								this.downloadAppButton.setDisabled(false);
							}				
					    }));
					    */
  },
	reset: function() {
		this.generateAppButton.setDisabled(false);
	    var showJNDI =  (studio.isModuleEnabled("security-driver", "wm.josso"));
	    this.jndiRowPanel.setShowing(showJNDI);
	},
/*
	archiveTypeSelectionChange: function() {
	//this.generatePanel.show();
	},
	*/
   /* Event handler for this.Generate_WAR; generates the war file and optionally downloads it after completion */  
  generateAppButtonClick: function(inSender) {
      var _this = this;
      if (!this.useJNDICheckbox.getChecked() && studio.JNDIDialog && studio.JNDIDialog.page) {
    	  studio.JNDIDialog.page._reset();
      }
      studio.onDeployOkClicked(this._prepareJNDINames(),
			       function() {
				   _this.generateAppButtonClickComplete();
			       });
      
  },
  useOldAppButtonClick: function() {
      this.generateAppButtonClickComplete();
  },
   /* Callback method linked to this.generateWARButtonClick */
  generateAppButtonClickComplete: function() {
      // We now have an up-to-date WAR file, so the user no longer needs to click on the generate war button
      var d = new Date();
      this.appTimestamp = d.getTime();
      //this.lastGeneratedLabel.setCaption(this.getDictionaryItem("LABEL_LAST_GENERATED_NEVER", {timestamp: d}));
      //this.downloadAppButton.setDisabled(false);
      studio.trackerImage.setSource("http://wavemaker.com/img/blank.gif?op=generateWar&v=" + escape(wm.studioConfig.studioVersion) + "&r=" + String(Math.random(new Date().getTime())).replace(/\D/,"").substring(0,8));

      if (this._downloadWar)
	  this.downloadWarClick();
      else if (this._downloadEar)
	  this.downloadEarClick();

      if (this._downloadWar || this._downloadEar) app.alert("Your file is being downloaded");
      delete this._downloadWar;
      delete this._downloadEar;

  },

/*
	downloadAppClick: function() {
		if (this.archiveType.selectedItem.getData().dataValue == "earfile") {
			studio.downloadInIFrame("services/deploymentService.download?method=downloadProjectEar");
		} else {
			studio.downloadInIFrame("services/deploymentService.download?method=downloadProjectWar");
		}
	},
		*/
	downloadWarClick: function() {
	    if (_fileExists("dist/" + studio.project.projectName +".war"))
		studio.downloadInIFrame("services/deploymentService.download?method=downloadProjectWar");
	    else {
		this.generateAppButtonClick();
		this._downloadWar = true;
	    }
	},
	downloadEarClick: function() {
	    if (_fileExists("dist/" + studio.project.projectName +".ear"))
		studio.downloadInIFrame("services/deploymentService.download?method=downloadProjectEar");
	    else {
		this.generateAppButtonClick();
		this._downloadEar = true;
	    }
	},
     useAppBackButtonClick: function() {
	 this.MainLayers.setLayer("GenerateAppLayer");
     },


    /************* JNDI SECTION **************/


 /* All JNDI stuff has been moved out of the main window into a dialog box.  We will always need to have the dialog 
    in memory as we'll be grabbing values from it when we generateWAR */
  getJNDIDialog: function() {
    if (!studio.JNDIDialog) {
      var
	props = {
	  owner: this,
	  pageName: "DeploymentJNDIDialog",
	  scrimBackground: true,
	  hideOnClick: false,
	    positionLocation: " l",
	    width: "500px",
	    height: "450px",
	    modal: true,
	    hideControls: true
	},
	d = studio.JNDIDialog = new wm.PageDialog(props);
/*
	d.setContainerOptions(true, 500, 450);
	d.setPositionLeft(400);
	d.setPositionTop(200);
	*/
	this.dataModelList = d.page.dataModelList;
	this.dataModelNameEditor = d.page.dataModelNameEditor;
	this.jndiEditor = d.page.jndiEditor;
	this.portEditor = d.page.portEditor;
	this.hostEditor = d.page.hostEditor;
	this.dbtypeEditor = d.page.dbtypeEditor;
    }
    var b = studio.JNDIDialog;
    return b;
  },

   /* Event handler for this.jndiButton */
   setupJNDIButtonClick: function(inSender) {
      this.getJNDIDialog().show();
       studio.JNDIDialog.page.setup();
   },

   /* Event handler for this.useJNDICheckbox */
  useJNDICheckboxChange: function(inSender, inDisplayValue, inDataValue) {
    this.jndiButton.setDisabled(!inDataValue);
    if(inDataValue) this.setupJNDIButtonClick(this.jndiButton);
    },
    
  _prepareJNDINames: function() {
    var rtn = {};
      var names = (!studio.JNDIDialog || !studio.JNDIDialog.page) ? {} : studio.JNDIDialog.page.jndiNames;
    for (var i in names) {
      if (names[i] != null) {
        rtn[i] = names[i];
      }
    }
    return rtn;
  },
  /* Called from this.generateWARButtonClick to gather data for generating the WAR file */
/*
  _saveJNDIName: function() {

    var key = this._getKey(this.dataModelNameEditor.getDataValue());
    var j = this.jndiEditor.getDataValue();
    if (j == null) {
      j = "";
    } else {
      j = dojo.string.trim(j);
    }

    if (this.useJNDICheckbox.getChecked()) {
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
  */
  _end: 0
});
