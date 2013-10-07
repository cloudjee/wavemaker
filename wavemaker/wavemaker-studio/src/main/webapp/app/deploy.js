/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
	deployClickError: function(inError) {
	    studio.endWait();
	    app.alert(this.getDictionaryItem("ALERT_BUILDING_WAR_FAILED", {error: inError.message}));
	},
	//=====================================================================
	// Live Data
	//=====================================================================
	refreshLiveData: function() {
	    if (!wm.studioConfig.preventLiveData) {
		    this.deploy("", "studioProjectCompile", true);
        }

	},
	makeLiveDataCall: function(inCallback) {
		if (this.isLiveLayoutReady()) {
			return inCallback();
		} else {
			// update live data
			this.refreshLiveData();
            if (this.isCloud()) {
                this.userLabel.setSingleLine(false);
                dojo.addClass(this.userLabel.domNode, "wmjsonstatus wmStatusWaiting");
                this.userLabel.setCaption("<span style='display:inline-block;float:none;width:20px;height:20px;margin-right:5px;' class='wmjsonstatusicon'>&nbsp;</span>Editing/importing of services is disabled while enabling live layout");
                this.userLabel.setAlign("center");
            }
		    if (this.application && (this._deploying || this.application._deployStatus == "deploying") && this._deployer) {
				// deferred to return immediately
				var liveDataDeferred = new dojo.Deferred();
				// add our callback to deployer handling liveData update
				this._deployer.addCallbacks(dojo.hitch(this, function(inResult) {
                    if (this.isCloud()) {
                        this.userLabel.setCaption("");
                        dojo.removeClass(this.userLabel.domNode, "wmjsonstatus wmStatusWaiting");
                    }
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
				}),
                dojo.hitch(this, function() {
                    if (this.isCloud()) {
                        this.userLabel.setCaption("");
                        dojo.removeClass(this.userLabel.domNode, "wmjsonstatus wmStatusWaiting");
                    }
                }));
				return liveDataDeferred;
			}
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
        this.showProjectExportDialog();
	},
	showProjectExportDialog: function() {
	   var d = this.getProjectExportDialog();
	   d.show();
	   d.page.reset();
	},
	getProjectExportDialog: function() {
	   if (!studio.projectExportDialog) {
	       studio.projectExportDialog = new wm.PageDialog({
	           owner: studio,
	           name: "projectExportDialog",
	           width: "500px",
	           height: "400px",
	           title: "Export Project",
	           hideControls: true,
	           pageName: "ExportProjectPage",
	           _classes: {domNode: ["studiodialog"]},
	           deferLoad: false // load now, don't wait for showing
	       });
	   }
	   return studio.projectExportDialog;
	},
	exportClickCallback: function(inResponse) {
	    studio.endWait("Building ZIP File...");
	    app.alert(this.getDictionaryItem("ALERT_BUILDING_ZIP_SUCCESS", {inResponse: inResponse}));
	    app.alertDialog.setWidth("600px");
	    var b = new wm.Button({owner: this,
				   _classes: {domNode: ["StudioButton"]},
				   parent: app.alertDialog.buttonBar,
				   caption: this.getDictionaryItem("ALERT_DOWNLOAD_BUTTON_CAPTION"),
				   width: "140px"});
	    b.parent.moveControl(b,0);
	    app.alertDialog.buttonBar.reflow();
	    b.connect(b, "onclick", this, function() {
		app.alertDialog.hide();
		this.downloadInIFrame("services/resourceFileService.download?method=downloadFile&file=" + inResponse);
	    });
	    app.alertDialog.connectOnce(app.alertDialog, "onClose", function() {
		b.destroy();
	    });
	    //this.downloadInIFrame("services/deploymentService.download?method=downloadProjectZip");

	    studio.application.incSubversionNumber();
	    var src = studio.project.generateApplicationSource();
	    studio.project.saveProjectData(this.projectName + ".js", src);
	},
	exportClickError: function(inError) {
	    studio.endWait();
	    app.alert(this.getDictionaryItem("ALERT_BUILDING_ZIP_FAILED", {error: inError.message}));
	},

	//=====================================================================
	// Importi
	//=====================================================================
	getImportProjectDialog: function() {
	  if (!this.importProjectDialog) {
	      this.importProjectDialog = new wm.PageDialog({_classes: {domNode: ["studiodialog"]},
							    owner: studio,
							    pageName: "ImportFile",
							    width: "650px",
							    height: "400px",
							    hideControls: true,
							    title: this.getDictionaryItem("TITLE_IMPORT"),
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

    /* Replaced with importMultiple
    importClick: function(inSender) {
        var f = dojo.hitch(this, function() {
            var d = this.getImportProjectDialog();
		    d.setTitle(this.getDictionaryItem("TITLE_IMPORT_PROJECT"));
		    d.page._onSuccessConnect = d.connect(d.page, "onSuccess", this, function() {
			    d.dismiss();
				this.project.openProject(d.page.getPath());
		    });
		    d.page.setService("deploymentService", "uploadProjectZipFile");
		    d.show();
		});

        if (this.project.projectName) {
    	    this.confirmAppChange(
    	       this.getDictionaryItem("CONFIRM_CLOSE_PROJECT",{projectName: this.project.projectName}),
               undefined,
               dojo.hitch(this, function() {
                        this.project.closeProject();
                        f();

                    }));
        } else {
            f();
        }
          //this.importFileDialog = this.getImportFileDialog().show();
    },
    */
	//=====================================================================
	// Widget Deploy
	//=====================================================================
	deployComponent: function(inName, inNamespace, inDisplayName, inGroup, inData, inServices,inImages,inHtml) {
		var klass = inNamespace ? inNamespace + '.' + inName : inName;
		studio.deploymentService.requestAsync("deployClientComponent",
			[inName, inNamespace, inData, inServices,inImages,inHtml],
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
	    app.toastSuccess(this.getDictionaryItem("ALERT_DEPLOY_SUCCESS"));
		wm.fire(studio.inspector, "reinspect");
		wm.job("studio.navigation.setFullStructure", 50, function() {
		  studio.navigationMenu.renderDojoObj();
		});
	},
	deployComponentError: function(inName, inNamespace, inError) {
		try {
			studio.deploymentService.requestAsync("undeployClientComponent",
				[inName, inNamespace, true]);
		} catch(e) {
			console.debug(e);
		}
	    app.alert(this.getDictionaryItem("ALERT_DEPLOY_FAILED", {error: inError}));
	    app.alertDialog.setWidth("600px");
	},
	//=====================================================================
	// Widget Undeploy
	//=====================================================================
	undeployComponent: function(inName, inNamespace, inDisplayName, inGroup, inRemoveSource) {
		var klass = inNamespace + "." + inName;
        var module = "common.packages." + klass;
		studio.deploymentService.requestAsync("undeployClientComponent",
			[inName, inNamespace, inRemoveSource],
			dojo.hitch(this, "undeployComponentCallback", module, inDisplayName, inGroup),
			dojo.hitch(this, "undeployComponentError"));
	},
    undeployComponentCallback: function(inModule, inDisplayName, inGroup, inResponse) {
        if(inResponse == true) {
            studio.palette.removeItem(inGroup, inDisplayName);
            wm.fire(studio.inspector, "reinspect");
            var altModule = inModule + "." + inModule.substring(inModule.lastIndexOf(".") + 1);
            for (var i = __packageRegistry.length-1; i >= 0; i--) {
                if (__packageRegistry[i][3] == inModule || __packageRegistry[i][3] == altModule) wm.Array.removeElementAt(__packageRegistry, i);
            }
            app.toastSuccess(this.getDictionaryItem("ALERT_UNDEPLOY_COMPONENT_SUCCESS"));
        } else {
            app.alert(this.getDictionaryItem("ALERT_UNDEPLOY_COMPONENT_FAILED"));
        }
    },

	undeployComponentError: function(inError) {
	    app.alert(this.getDictionaryItem("ALERT_UNDEPLOY_COMPONENT_FAILED2", {error: inError}));

	},

	/* Now handled by importMultiple
	importComponent: function() {
		var d = this.getImportProjectDialog();
	    d.setTitle(this.getDictionaryItem("TITLE_IMPORT_COMPONENT"));
	    var path;
	    d.page._onSuccessConnect = d.connect(d.page, "onSuccess", this, function(inSender, inResponse) {
		    d.dismiss();
		    var module = inResponse[0].path;
		    // FIXME: Dojo has no re-require method, workaround:
    		// unflag this module
    		delete dojo._loadedModules[module];
    		// destroy Dojo's URL cache completely
    		dojo._loadedUrls = [];

		    dojo["require"](module);
    		// if we get here, no exceptions occured

            / * Needed in case items added to menubar * /
    		wm.job("studio.navigation.setFullStructure", 50, function() {
    		      studio.navigationMenu.renderDojoObj();
    		});



    		path = module.split(/\./);
    		if (path[0] == "common" && path[1] == "packages") {
    			path.shift();
    			path.shift();
    		}
    		if (path.length > 1 && path[path.length-1] === path[path.length-2]) {
    			path.pop();
    		}
            app.alert(this.getDictionaryItem("ALERT_IMPORT_COMPONENT_SUCCESS", {name: path[path.length-1]}));
		});
        d.page._onErrorConnect = d.connect(d.page, "onError", this, function(inSender, inError) {
    	       app.alert(this.getDictionaryItem("ALERT_IMPORT_COMPONENT_FAILED", {inError: inError}));
    	       if (app.toastDialog) app.toastDialog.hide();
        });
	    d.page.setService("deploymentService", "uploadClientComponent");
	    d.show();
	},
    */
	/* Now handled by importMultiple
	importTemplate: function() {
		var d = this.getImportProjectDialog();
	    d.setTitle(this.getDictionaryItem("TITLE_IMPORT_TEMPLATE"));
	    d.page._onSuccessConnect = d.connect(d.page, "onSuccess", this, function(inSender, inResponse) {
		    d.dismiss();

	       app.alert(this.getDictionaryItem("ALERT_IMPORT_TEMPLATE_SUCCESS"));
	    });
        d.page._onErrorConnect = d.connect(d.page, "onError", this, function(inSender, inError) {
    	       app.alert(this.getDictionaryItem("ALERT_IMPORT_TEMPLATE_FAILED", {inError: inError}));
    	       if (app.toastDialog) app.toastDialog.hide();
        });
        d.page.setService("deploymentService", "uploadTemplateZipFile");
	    d.show();
	},
	*/
	importMultiple: function() {
		var d = this.getImportProjectDialog();
        d.page.setService("deploymentService", "testMultiFile");
	    d.show();
	},

    /* Methods added here are new for the 6.4 deployment dialog */
    newDeployClick: function() {
        this.project.saveProject(true);
        if(!this.deploymentDialog.page){
         this.deploymentDialog.setPage("DeploymentDialog"); // insures the dialog is initialized, but does not show it
        }
        this.deploymentDialog.page.addButtonClick();
    },

    settingsDeployClick: function() {
        this.project.saveProject(true);
        this.deploymentDialog.show();
        this.deploymentDialog.page.selectFirst();
    },
    cloudJeeDeploymentsClick: function() {
        this.deploymentDialog.setPage("DeploymentDialog"); // insures the dialog is initialized, but does not show it
        this.deploymentDialog.page.showCloudJeeAppListDialog();
    },
    deploymentHelp: function() {
        window.open(studio.getDictionaryItem("URL_DOCS", {
            studioVersionNumber: wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/, "$1")
        }) + "Deploying");
    },
    _end: 0
});
