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
dojo.provide("wm.studio.pages.DeploymentPage_AppGeneration.DeploymentPage_AppGeneration");

dojo.declare("DeploymentPage_AppGeneration", wm.Part, { 

  // has to match constant in DataModelDeploymentConfiguration
  JNDI_NAME_PROPERTY: ".jndi.dsname",

  appTimestamp: 0,

  start: function() {
	dojo.query("#" + this.archiveType.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
	dojo.query("#" + this.archiveType.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
  },
  setup: function() {      
      this.reset();      
      this.JNDIDialog = this.getJNDIDialog();
      this.archiveType.eventSelect(this.archiveType.getItem(0));
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
  },
	reset: function() {
		this.generateAppButton.setDisabled(false);
	    var showJNDI =  (studio.isModuleEnabled("security-driver", "wm.josso"));
	    this.jndiRowPanel.setShowing(showJNDI);
	},
	archiveTypeSelectionChange: function() {
	//this.generatePanel.show();
	},

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
      this.lastGeneratedLabel.setCaption(this.getDictionaryItem("LABEL_LAST_GENERATED_NEVER", {timestamp: d}));
      this.downloadAppButton.setDisabled(false);
      studio.trackerImage.setSource("http://wavemaker.com/img/blank.gif?op=generateWar&v=" + escape(wm.studioConfig.studioVersion) + "&r=" + String(Math.random(new Date().getTime())).replace(/\D/,"").substring(0,8));
  },

	downloadAppClick: function() {
		if (this.archiveType.selectedItem.getData().dataValue == "earfile") {
			studio.downloadInIFrame("services/deploymentService.download?method=downloadProjectEar");
		} else {
			studio.downloadInIFrame("services/deploymentService.download?method=downloadProjectWar");
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
	  positionLocation: " l"
	},
	d = studio.JNDIDialog = new wm.PagePopup(props);
	d.setContainerOptions(true, 500, 450);
	d.setPositionLeft(400);
	d.setPositionTop(200);
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
