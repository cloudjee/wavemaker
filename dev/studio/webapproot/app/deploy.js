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
 

dojo.provide("wm.studio.app.deploy");

Studio.extend({
	//=====================================================================
	// Deployment
	//=====================================================================
	deployClick: function(inSender) {
		this.project.saveProject(true);
		/*
		if (wm.studioConfig.isPalmApp) {
			var p = prompt("Enter the path to Palm workspace:", "/Users/mmcnulty/workspace");
			if (p != null) {
				studio.beginWait("Building WAR File...");
				studio.deploymentService.requestAsync("buildPalm", [{"palmDir": p + "/" + studio.project.projectName}], dojo.hitch(this, "deployClickCallback"), dojo.hitch(this, "deployClickError"));
			}
			return;
		}
		*/

		this.navGoToDeploymentPage();
	},
        onDeployOkClicked: function(jndiNames, optionalCallback) {
	    var msg = this.getDictionaryItem("WAIT_BUILDING_WAR");
		studio.beginWait(msg);
		var _this = this;

	    studio.deploymentService.requestAsync("buildWar", [jndiNames], 
						  function(inResponse) {
						      studio.endWait(msg);
						      app.alert(this.getDictionaryItem("ALERT_BUILDING_WAR_SUCCESS", {inResponse: inResponse}));
						      app.alertDialog.setWidth("100%");
						      optionalCallback();
						  });

	},
	deployClickError: function(inError) {
	    studio.endWait();
	    app.alert(this.getDictionaryItem("ALERT_BUILDING_WAR_FAILED", {error: inError.message}));
	},
	//=====================================================================
	// Live Data
	//=====================================================================
	refreshLiveData: function() {
		if (!wm.studioConfig.preventLiveData && !this._deploying)
			this.deploy(""/*"Refreshing Live Layout..."*/, dojo.hitch(this, "isSecurityEnabled"));
	},
	makeLiveDataCall: function(inCallback) {
		if (this.isLiveLayoutReady()) {
			return inCallback();
		} else {
			// update live data
			this.refreshLiveData();
			if (this._deploying && this._deployer) {
				// deferred to return immediately
				var liveDataDeferred = new dojo.Deferred();
				// add our callback to deployer handling liveData update
				this._deployer.addCallback(function(inResult) {
					// call our callback
					var r = inCallback();
					// if it's a deferred, fire the liveDataDeferred when it's ready
					if (r instanceof dojo.Deferred)
						r.addCallback(function(inResult) {
							if (liveDataDeferred.fired == -1)
								liveDataDeferred.callback(true);
							return inResult;
						});
					// if not, just fire the liveDataDeferred now
					else {
						if (liveDataDeferred.fired == -1)
							liveDataDeferred.callback(true);
					}
					return inResult;
				});
				return liveDataDeferred;
			}
		}
	},
	isSecurityEnabled: function() {
		//With the new enhancement to allow displaying live data in designer regardless the security setup, don't need to
		//check if security is enabled.
		return;
		//studio.securityConfigService.requestAsync("isSecurityEnabled", null, dojo.hitch(this, "isSecurityEnabledResult"));
	},
	isSecurityEnabledResult: function(inResponse) {
		if (inResponse) {
		    app.alert(this.getDictionaryItem("ALERT_LIVE_LAYOUT_SECURITY_WARNING"));
		    
		    
		}
	},
        downloadInIFrame: function(url) {

		      var iframe = dojo.byId("downloadFrame");
		      if (iframe) iframe.parentNode.removeChild(iframe);

		      iframe = document.createElement("iframe");
		      dojo.attr(iframe, {id: "downloadFrame",
					 name: "downloadFrame"});
		      dojo.style(iframe, {top: "1px",
					  left: "1px",
					  width: "1px",
					  height: "1px",
					  visibility: "hidden"}); 
		      dojo.body().appendChild(iframe);

		      iframe.src = url;

		      // dojo iframe stuff just didn't work for repeated exports.  The problem: it expects to load data surrounded by <textarea>mydata</textarea>
		      // what it got was a successfully downloaded file, but it goes right on in an infinite loop testing to see if that textarea has shown up yet.
		      // If we give it a textarea, I don't think we can save the result as a file to the hard drive
		      //dojo.io.iframe.create("downloadFrame","","http://localhost:8080/wavemaker/services/deploymentService.download?method=downloadProject");
	},
	//=====================================================================
	// Export
	//=====================================================================
	exportClick: function(inSender) {
		studio.beginWait("Building ZIP File...");
	    studio.deploymentService.requestAsync("exportProject", null, dojo.hitch(this, "exportClickCallback"), dojo.hitch(this, "exportClickError"));
	    	},			  
	exportClickCallback: function(inResponse) {
	    studio.endWait("Building ZIP File...");
	    if (!studio.isCloud()) {
		app.alert(this.getDictionaryItem("ALERT_BUILDING_ZIP_SUCCESS", {inResponse: inResponse}));
		app.alertDialog.setWidth("100%");
	    } else {
		this.downloadInIFrame("services/deploymentService.download?method=downloadProjectZip");
	    }
	},
	exportClickError: function(inError) {
	    studio.endWait();
	    app.alert(this.getDictionaryItem("ALERT_BUILDING_ZIP_FAILED", {error: inError.message}));
	},

	//=====================================================================
	// Import
	//=====================================================================
	getImportProjectDialog: function() {
	  if (!this.importProjectDialog) {
	      this.importProjectDialog = new wm.PageDialog({owner: studio, 
							    pageName: "ImportFile", 
							    width: "500px", 
							    height: "120px", 
							    hideControls: true, 
							    title: this.getDictionaryItem("TITLE_IMPORT_PROJECT"), 
							    modal: false});
	  }
	    return this.importProjectDialog;
	},
/*
	getImportFileDialog: function() {
	  if (!this.importFileDialog) {
              this.importFileDialog = new wm.FileUploadDialog({title: this.getDictionaryItem("TITLE_IMPORT_PROJECT"), 
                                                               noEscape: false,
                                                               uploadService: "deploymentService",
                                                               uploadOperation: "uploadProjectZipFile",
                                                               owner: studio
                                                              });
              this.importFileDialog.setUserPrompt(this.getDictionaryItem("PROMPT_IMPORT_PROJECT"));
		    this.importFileDialog.connect(this.importFileDialog, "importClickCallback", this, "importProjectClickCallback");
		    this.importFileDialog.connect(this.importFileDialog, "importClickError", this, "importProjectClickError");
	  }
	  return this.importFileDialog;
    },
    */
    importClick: function(inSender) {
      if (this.project.projectName) {
	  this.confirmAppChange(this.getDictionaryItem("CONFIRM_CLOSE_PROJECT_LOSE_UNSAVED",{projectName: this.project.projectName}),
                                undefined, dojo.hitch(this, function() {
	                            this.project.closeProject();
                                    //this.importFileDialog = this.getImportFileDialog().show();
				    this.getImportProjectDialog().show();
                                }));
      } else
	  this.getImportProjectDialog().show();
          //this.importFileDialog = this.getImportFileDialog().show();
    },
/*
   importProjectClickCallback: function(inSource, inResponse) {
      studio.endWait();
      var d = studio.startPageDialog.page.refreshProjectList();
       
       app.toastDialog.showToast(this.getDictionaryItem("TOAST_IMPORT_PROJECT", {inResponse: inResponse}), 3000, "Success");		
      wm.fire(this.owner, "dismiss");
      studio.project.openProject(inResponse);
      },

   importProjectClickError: function(inSource,inError) {
      studio.endWait();
       app.alert(this.getDictionaryItem("ALERT_IMPORT_PROJECT_FAILED", {error: inError}));
    },
      */
	//=====================================================================
	// Widget Deploy
	//=====================================================================
	deployComponent: function(inName, inNamespace, inDisplayName, inGroup, inData) {
		var klass = inNamespace ? inNamespace + '.' + inName : inName;
		studio.deploymentService.requestAsync("deployClientComponent", 
			[inName, inNamespace, inData], 
			dojo.hitch(this, "deployComponentCallback", 'common.packages.' + klass, inDisplayName, inGroup), 
			dojo.hitch(this, "deployComponentError", inName, inNamespace));
	},
	deployComponentCallback: function(inModule, inDisplayName, inGroup, inResponse) {
		// FIXME: Dojo has no re-require method, workaround:
		// unflag this module
		delete dojo._loadedModules[inModule];
		// destroy Dojo's URL cache completely
		dojo._loadedUrls = [];
		// remove from palette
		studio.palette.removeItem(inGroup, inDisplayName);
		// re-require our module 
		// use "require" to avoid interacting with the Dojo build system.
		dojo["require"](inModule);
		// if we get here, no exceptions occured
	    app.alert(this.getDictionaryItem("ALERT_DEPLOY_SUCCESS"));
		wm.fire(studio.inspector, "reinspect");
	},
	deployComponentError: function(inName, inNamespace, inError) {
		try {
			studio.deploymentService.requestAsync("undeployClientComponent",
				[inName, inNamespace, true]);
		} catch(e) {
			console.debug(e);
		}
	    app.alert(this.getDictionaryItem("ALERT_DEPLOY_FAILED", {error: inError}));
	    app.alertDialog.setWidth("100%");
	},
	//=====================================================================
	// Widget Undeploy
	//=====================================================================
	undeployComponent: function(inName, inNamespace, inDisplayName, inGroup, inRemoveSource) {
		var klass = inNamespace + "." + inName;
		studio.deploymentService.requestAsync("undeployClientComponent",
			[inName, inNamespace, inRemoveSource],
			dojo.hitch(this, "undeployComponentCallback", inDisplayName, inGroup),
			dojo.hitch(this, "undeployComponentError"));
	},
	undeployComponentCallback: function(inDisplayName, inGroup, inResponse) {
	    if (inResponse == true) {
		studio.palette.removeItem(inGroup, inDisplayName);
		wm.fire(studio.inspector, "reinspect");
		app.alert(this.getDictionaryItem("ALERT_UNDEPLOY_COMPONENT_SUCCESS"));
	    } else {
		app.alert(this.getDictionaryItem("ALERT_UNDEPLOY_COMPONENT_FAILED"));
	    }
	},
	undeployComponentError: function(inError) {
	    app.alert(this.getDictionaryItem("ALERT_UNDEPLOY_COMPONENT_FAILED2", {error: inError}));

	}
});
