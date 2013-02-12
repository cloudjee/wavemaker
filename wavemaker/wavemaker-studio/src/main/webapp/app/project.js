/*
 * Copyright (C) 2008-2013 VMware, Inc. All rights reserved.
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

dojo.provide("wm.studio.app.project");

dojo.declare("wm.studio.Project", null, {
    //=========================================================================
    // New
    //=========================================================================
    newProject: function(inName, optionalInTheme, optionalInTemplate) {
    // validate the safety of the name; reserved javascript words cause big trouble
    try {
        var tmp = dojo.declare(inName, wm.Application, {
        });
        eval(inName); // should do nothing, but if attempting to evaluate the name throws an error then its an invalid name
    } catch(e) {
        app.toastError(studio.getDictionaryItem("wm.studio.Project.TOAST_RESERVED_NAME"));
        throw "Reserved Keyword";
    }

    if (this.projectName) {
        this.closeProject(inName);
    }
    studio._loadingApplication = true;
    var n = inName || this.projectName || "Project";
    this.projectName = wm.getValidJsName(n);
    this.pageName = "Main";
        studio.beginWait(studio.getDictionaryItem("wm.studio.Project.WAIT_CREATING_PROJECT"));
        var d = studio.studioService.requestAsync("newProject", [this.projectName]);
            d.addCallbacks(
                    dojo.hitch(this, function(inResult) {
                        this.finishNewProject(inResult,optionalInTheme, optionalInTemplate);
                    }),
                    function(inResult) {
            console.log("New Project Failed: ", inResult);
            }
                );
        return d;
    },
    finishNewProject: function(inResult, optionalInTheme, optionalInTemplate) {
        studio.updateServices();
        this.projectChanging();
        this.createApplicationArtifacts();
            this.makeApplication({
              theme: optionalInTheme || "wm.base.widget.themes.wm_default",
              sessionExpirationHandler: "navigateToLogin" // move to Application.js once we no longer care about upgrading projects
            });
            new wm.ImageList({owner: studio.application,
                  name: "silkIconList",
                  url: "lib/images/silkIcons/silk.png",
                  width: 16,
                  height: 16,
                  colCount: 39,
                  iconCount: 90});

        var finalDeferred =
        this.newPage(this.pageName, "", {template: optionalInTemplate}).then(
            dojo.hitch(this, function() {
                 var d = this.saveProject(false);
                 return d;
            }), function() {}
        ).then(
            dojo.hitch(this, function() {
                 this.projectChanged();
                 this.projectsChanged();
                 studio.endWait(studio.getDictionaryItem("wm.studio.Project.WAIT_CREATING_PROJECT"));
                 studio._loadingApplication = false;
            }), function() {}
        );

        return finalDeferred;
    },
    // pageType and argHash are typically empty
    // argHash is a way to pass in custom parameters when creating a non-basic
    // page type
    newPage: function(inName, pageType, argHash, callback) {
        if (!this.projectName)
            return;
        this.pageList.push(inName);
        this.pageChanging();
        this.pageName = inName;
            this.createPageArtifacts(pageType, argHash);
        this.makePage();
        var def =
            this.savePage().then(
                dojo.hitch(this, function() {
                    this.pageChanged();
                    this.pagesChanged();
                    var d = this.updatePageList(true,true);
                    return d;
                })
            ).then(
                dojo.hitch(this, function() {
                    studio.pageSelect.setDataValue(inName);
                    if (callback) callback();
                })
            );
        return def;
    },
    createApplicationArtifacts: function() {
        var ctor = dojo.declare(this.projectName, wm.Application);
        this.projectData = {css: "",
                jscustom: this.projectName + ".extend({\n\n\t" + terminus + "\n});"};
        studio.setAppScript(this.projectData.jscustom); // this gets set elsewhere; but if not set here, then a project may get the previously open project's jscustom section because writeApplication takes whatever is currently in the script editor
    },
        createPageArtifacts: function(pageType, argHash) {
                if (!argHash) argHash = {};
        var ctor = dojo.declare(this.pageName, wm.Page);
        this.pageData = {};
            ctor.widgets = this.getPageTemplate(pageType, argHash);
            //this.pageData.widgets = this.getWidgets();
            var functionTemplate = this.getScriptTemplate(pageType, argHash);
            studio.setScript(this.pageData.js = pageScript(this.pageName, functionTemplate));
        this.pageData.css = this.pageData.html = "";
    },
        getPageTemplate: function(pageType, argHash) {
            var template_def = argHash.template;
            if (template_def) {
                var template = dojo.clone(template_def);

                var widgets = template._template;
        delete template.displayName;
        delete template.thumbnail;
                delete template._template;
                var hasLayout = false;
                for (var i in widgets)
                    if (widgets[i][0] == "wm.Layout")
                        hasLayout = true;

                var widgets_js;
                if (hasLayout) {
                    widgets_js = widgets;
                } else {
                    widgets_js =  {layoutBox1: ["wm.Layout", dojo.mixin(template, {name: "layout1"}), {}, {}]};
                    for (var i in template) {
                        widgets_js.layoutBox1[1][i] = template[i];
                    }
                    widgets_js.layoutBox1[3] = widgets;
                }
                if (argHash.editTemplate)
                    argHash.editTemplate(widgets_js);
                return widgets_js;
            } else {
            return {layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {}]};
        }
    },
/*
        return {
            variable: ["wm.Variable", {type: argHash.type, json: argHash.json}],
            layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {
            sampleRow: ["wm.FancyPanel", {title: "Sample Row", layoutKind: "left-to-right", width: "100%", height: "80px"},{}, {
                panel1: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left"},{}, {
                label1: ["wm.Label", {width: "200px", height: "100%", caption: "Bind me to a field in 'variable'", singleLine: false}],
                label2: ["wm.Label", {width: "100%", height: "100%", caption: "Bind me to another field in 'variable'. Or just delete me and create your own row!", singleLine: false}]
                }]
            }]
            }]};
                    */

        getScriptTemplate: function(pageType, argHash) {
            var text = "";
            if (argHash && argHash.template && argHash.template && argHash.template.preferredDevice) {
                text += "\"preferredDevice\": \"" + argHash.template.preferredDevice + "\",\n";
            } else {
                text += "\"preferredDevice\": \"" + studio.currentDeviceType + "\",\n";
            }

          // NOTE: could present list of choices here
           switch(pageType) {
               case "wm.ListViewerRow":
                    text += "\tbutton1Click: function(inSender) {\n" +
                        "\t\t/* Example of finding and triggering an action based on a button click */\n" +
                        "\t\tvar data = this.variable.getData();\n" +
                        "\t\tconsole.log(\"You have just clicked on a button in the row showing the following data:\");\n" +
                        "\t\tconsole.log(data);\n" +
                        "\t}";
                        break;
        }
        return text;
    },
    //=========================================================================
    // Open
    //=========================================================================
    openProject: function(inProjectName, inPageName) {
        var deferred = new dojo.Deferred();
        if (this.projectName && this.projectName != inProjectName)
        this.closeProject();
        if (!inProjectName) {
        return;
        }
        studio.beginWait(studio.getDictionaryItem("wm.studio.Project.WAIT_OPEN_PROJECT"));
        studio.neededJars = {};
        var d = studio.studioService.requestAsync("projectUpgradeRequired", [inProjectName]);
        d.addErrback(function(e) {
        app.alert(err.toString() || "Failed to open project");
        });
        d.addCallback(dojo.hitch(this, function(inNeedsUpgrade) {
        if (inNeedsUpgrade) {
            this.openProjectUpgradeDialog(inProjectName, inPageName, deferred);
            //deferred;
        } else {
            studio.studioService.requestAsync("openProject", [inProjectName],
                              dojo.hitch(this, function() {
                              this.openProject1(inProjectName, inPageName, deferred);
                              }),
                              dojo.hitch(this, function(err) {
                              studio.endWait(studio.getDictionaryItem("wm.studio.Project.WAIT_OPEN_PROJECT"));
                              /* Localization: I assume we'll always have an error message */
                              app.alert(err.toString() || "Failed to open project");
                              this.closeProject();
                              deferred.errback(err);
                              }));
        }
        }));

        deferred.addErrback(function() {
        studio.endWait();
        });

        return deferred;
    },
    openProjectUpgradeDialog: function(inProjectName, inPageName, deferred) {
        studio.openProjectOptionsDialog.show();
        studio.endWait();
        var d = new dojo.Deferred();
        studio.openProjectOptionsDialog.page.setup(inProjectName, d);
        d.addCallbacks(
            dojo.hitch(this, function(newProjectName) {
            studio.beginWait(studio.getDictionaryItem("wm.studio.Project.WAIT_OPEN_PROJECT"));
            if (newProjectName == inProjectName) {
                this.openProject1(inProjectName, inPageName, deferred);
            } else {
                studio.studioService.requestAsync("copyProject", [inProjectName, newProjectName],
                                  dojo.hitch(this, function() {
                                  this.openProject1(newProjectName, inPageName, deferred, true);
                                  }),
                                  dojo.hitch(this, function(e) {
                                  deferred.errback(e);
                                  })
                                 );


            }
            }),
            function(e) {
            deferred.errback(e);
            }
        );
    },
    openProject1: function(inProjectName, inPageName, deferred, skipUpgrade) {
        studio._themeDesignerChange = false;
        studio.studioService.requestAsync("openProject", [inProjectName],
                              dojo.hitch(this, function(o) {
                                  studio.endWait(studio.getDictionaryItem("wm.studio.Project.WAIT_OPEN_PROJECT"));
                                  studio._loadingApplication = true;
                                  this.projectName = inProjectName;

                                  // let openProject call cleanup before starting next set of calls
                                  wm.job("studio.openProject", 10, dojo.hitch(this, function() {
                                      studio.updateServices();


                                      var f = function() {
                                      this.projectChanging();
                                      try {
                                          this.loadingProject = true;
                                          var ctor = this.openApplication();
                                          this.pageName = inPageName || (ctor ? ctor.prototype.main : "Main");
                                          this.openPage(this.pageName);

                                          if (!wm.isEmpty(studio.neededJars)) {
                                          /* onidle insures it gets the higher z-index than the start page */
                                          wm.onidle(function() {
                                              studio.jarDownloadDialog.show();
                                          });
                                          throw "Missing Jar files are required for this project";
                                          }
                                          studio.startPageDialog.hide();
                                      } catch(e) {
                                          console.debug(e);
                                          this.loadError(studio.getDictionaryItem("wm.studio.Project.TOAST_OPEN_PROJECT_FAILED",
                                                              {projectName: this.projectName, error: e}));

                                          this.projectName = "";
                                          this.pageName = "";
                                          studio.application = studio.page = null;
                                      } finally {
                                          studio._loadingApplication = false;
                                          this.loadingProject = false;
                                          this.projectChanged();
                                          if (this.projectName) {
                                          deferred.callback();
                                          } else {
                                          deferred.errback();
                                          }
                                      }
                                      };
                                      if (o.upgradeMessages && !skipUpgrade) {
                                      this.showUpgradeMessage(o.upgradeMessages);
                                      app.alertDialog.connectOnce(app.alertDialog, "onClose", this, f);
                                      } else {
                                      dojo.hitch(this, f)();
                                      }
                                  }));
                              }),
                              dojo.hitch(this, function(err) {
                                  studio.endWait(studio.getDictionaryItem("wm.studio.Project.WAIT_OPEN_PROJECT"));
                                  /* Localization: I assume we'll always have an error message */
                                  app.alert(err.toString() || "Failed to open project");
                                  this.closeProject();
                              }));
        return deferred;
/*
        var o = studio.studioService.getResultSync("openProject", [inProjectName]);
            if (o) {
            this.projectName = inProjectName;
            if (o.upgradeMessages)
                this.showUpgradeMessage(o.upgradeMessages);
            this.projectChanging();
            try {
                this.loadApplication();
                var ctor = dojo.getObject(this.projectName);
                this.pageName = inPageName || (ctor ? ctor.prototype.main : "Main");
                this.makeApplication();
                this.openPage(this.pageName);
                    studio.startPageDialog.hide();

            } catch(e) {
                console.debug(e);
                this.loadError(bundleDialog.M_FailedToOpenProject + this.projectName + ". Error: " + e);
                this.projectName = "";
                this.pageName = "";
                studio.application = studio.page = null;
            } finally {
                this.projectChanged();
            }
        }

        // If we failed to open a project, then we still have sent a message to server closing the current project so we need to close it in studio
        // as well, and get back to the start screen.  Failure to do this will cause studio and server to be out of sync on what project is open.
        else {
            alert(studio.studioService.error || "Failed to open project");
            this.closeProject();
        }
        */
    },
    openApplication: function(inPageName) {
      this.loadApplication();
      var ctor = dojo.getObject(this.projectName);
      this.makeApplication();
      return ctor;
    },
    editProjectFiles: function() {

        studio.sourceTab.activate();
        studio.resourcesTab.activate();
        studio.workspace.hide();
        var layers = studio.sourceTabs.layers;
        for (var i = 0; i < layers.length; i++) {
            layers[i].setShowing(layers[i].name == "resourcesTab");
        }

        studio.startPageDialog.hide();
        app.alert("There were errors in your project that prevent it from being openned; you may edit your files here to try and fix these problems");
        studio.connectOnce(this, "closeProject", this, function() {
            for (var i = 0; i < layers.length; i++) {
                layers[i].setShowing(true);
            }
            studio.workspace.show();
        });
    },
    closeAllServicesTabs: function() {
        var layers = studio.tabs.layers;
        for (var i = layers.length - 1; i >= 0; i--)
        if (layers[i].closable) {
            var sublayers = layers[i].c$[0].layers;
            for (var j = sublayers.length - 1; j >= 0; j--) {
                sublayers[j].destroy();
            }
            layers[i].hide();
        }
    },
    closeAllDialogs: function() {
        for (var i = wm.dialog.showingList.length - 1; i >= 0; i--) {
            var d = wm.dialog.showingList[i];
            if (d._isDesignLoaded || d.owner && d.owner._isDesignLoaded || wm.isInstanceType(d, wm.ContextMenuDialog)) {
                d.hide();
            }
        }
    },
    openPage: function(inName, unsavedChanges) {
        this.closeAllServicesTabs();
        this.closeAllDialogs();
        if (studio.bindDialog.showing && !studio.bindDialog._hideAnimation) studio.bindDialog.dismiss();

        if (unsavedChanges) {
            studio.restoreCleanApp();
        }
        this.pageChanging();
        this.pageName = inName;
        try {
            this.loadingPage = true;
            this.loadPage();
            this.makePage();
            this.pageChanged();
            studio.pageSelect.setDataValue(inName);
        } catch (e) {
            console.debug(e);
            this.loadError(studio.getDictionaryItem("wm.studio.Project.TOAST_OPEN_PAGE_FAILED", {
                pageName: this.pageName,
                error: e
            }));
            this.pageName = "";
            studio.page = null;
            if (studio.application && studio.application.main && studio.application.main != inName) this.openPage(studio.application.main);
            else {
                this.editProjectFiles();
                //this.closeProject();
            }
        }
        this.loadingPage = false;
    },
    loadProjectData: function(inPath, async) {
        //return wm.load("projects/" + studio.projectPrefix + this.projectName + "/" + inPath);
             return wm.load("projects/" + this.projectName + "/" + inPath, false, async);
    },
    loadApplication: function() {
        this.projectData = {
            js: this.loadProjectData(this.projectName + ".js"),
            css: String(this.loadProjectData("app.css")).replace(/^\s*\n*/,""),
                documentation: dojo.fromJson(this.loadProjectData(this.projectName + ".documentation.json"))
        };
        if (!this.projectData.js) {
            throw studio.getDictionaryItem("THROW_PROJECT_NOT_FOUND", {projectPath: "projects/" + this.projectName + "/webapproot/" + this.projectName + ".js"});
        } else {
            var src = this.projectData.js;
            var endIndex = src.indexOf("_end: 0");

            // this may happen with older projects
            if (endIndex != -1)
            endIndex = src.indexOf(";", endIndex);

                    if (endIndex == -1) {
                this.projectData.js = src;
                this.projectData.jscustom = this.projectName + ".extend({\n\n\t_end: 0});";
                    } else {
            endIndex++;
                this.projectData.js = dojo.trim(src.substring(0,endIndex));
                this.projectData.jscustom = dojo.trim(src.substring(endIndex)) || this.projectName + ".extend({\n\n\t_end: 0});";
                    }
        }
        eval(this.projectData.js);
    },
    loadPage: function() {
        var n = this.pageName,
            f = wm.pagesFolder + n + "/",
            p = f + n;
        this.pageData = {
            js: this.loadProjectData(p + ".js"),
            widgets: this.loadProjectData(p + ".widgets.js"),
            css: this.loadProjectData(p + ".css"),
            html: this.loadProjectData(p + ".html"),
            documentation: dojo.fromJson(this.loadProjectData(p + ".documentation.json"))
        }
        var ctor;
        if (this.pageData.js) {
            try {
                eval(this.pageData.js);
                ctor = dojo.getObject(n);
            } catch (e) {}
        }
        if (!ctor) {
            ctor = dojo.declare(n, wm.Page);
        }
        eval(this.pageData.widgets);
        if (!this.htmlLoader) this.htmlLoader = new wm.HtmlLoader({
            owner: app,
            name: "projectHtmlLoader",
            relativeUrl: false
        });
        this.htmlLoader.setHtml(this.pageData.html);
    },
    makeApplication: function(inProps) {
        inProps = inProps || {};
        var ctor = dojo.getObject(this.projectName);
        if (ctor) {
            studio.application = new ctor(dojo.mixin({
                _designer: studio.designer
            }, inProps));

            /* Upgrading theme to WM 6.6 */
            if (studio.application.theme && studio.application.theme.indexOf(".") == -1) {
                studio.application.theme = studio.application.theme.match(/wm_/) ? "wm.base.widget.themes." + studio.application.theme : "common.themes." + studio.application.theme;
            }
            studio.application.loadComponents(studio.application.constructor.widgets || studio.application.widgets); // loadComponents happens in doRun; we don't want to call doRun.

            delete studio._application; // temporary property set in Application.init as placeholder for studio.application until the app has finished creating
            for (var i in this.projectData.documentation) {
                if (studio.application.components[i]) studio.application.components[i].documentation = this.projectData.documentation[i];
                else if (i == "__metaData") studio.application._metaData = this.projectData.documentation[i];
                else console.error("studio.application.components[" + i + "] not found for setting documentation: " + this.projectData.documentation[i]);
            }
            if (!studio.application._metaData) studio.application._metaData = {};
            studio.updatePagesMenu(); // now that we have a studio.application object
        }
    },
    makePage: function() {
        var ctor = dojo.getObject(this.pageName);
        if (ctor) {
            studio.connectOnce(ctor.prototype, "init", function() {
                studio.page = this;
            });
            studio.connectOnce(ctor.prototype, "start", function() {
                wm.fire(studio.application, "start");
            });
            studio.page = new ctor({
                name: "wip",
                domNode: studio.designer.domNode,
                owner: studio,
                _designer: studio.designer
            });
            if (!studio.page.root) throw studio.getDictionaryItem("wm.studio.Project.THROW_INVALID_PAGE");
            studio.page.root.parent = studio.designer;
            for (var i in this.pageData.documentation) {
                if (i == "wip") {
                    studio.page.documentation = this.pageData.documentation[i];
                } else {
                    var c = studio.page.components[i];
                    if (c) {
                        c.documentation = this.pageData.documentation[i];
                    }
                }
            }
            this.pageData.widgets = studio.getWidgets();
        }
    },
    loadError: function(inMessage) {
        app.toastError(inMessage, 15000);
    },
    //=========================================================================
    // Save
    //=========================================================================
    save: function() {
       this.saveProject(false);
   },
   saveProject: function(isDeployment, onSave) {
       var isFolded = studio.page && studio.page.root._mobileFolded;
       if (isFolded) {
           studio.page.root.unfoldUI();
       }
       this.deployingProject = isDeployment;
       var d =
           this.saveApplication().then(
                dojo.hitch(this, function() {
                    this.savePage().then(
                        dojo.hitch(this, function() {
                           studio.setSaveProgressBarMessage("login.html");
                           studio.incrementSaveProgressBar(1);
                           this.saveComplete();
                           this.updatePhonegapFiles();
                           if (onSave) onSave();
                           if (isFolded) {
                               studio.page.root.foldUI();
                           }
                       })
                    );
               })
            );
       /*
        studio.updatePagesMenu();

        // everything here is asynchronous; if we need to save all, then find all unsaved
        // content and prompt the user to save them using the listUnsavedDialog.
        if (saveAll) {
        var unsavedPages = [];
        var tabs = [studio.JavaEditorSubTab, studio.databaseSubTab, studio.webServiceSubTab, studio.securitySubTab];
        dojo.forEach(tabs, dojo.hitch(this, function(tab) {
            dojo.forEach(tab.layers, dojo.hitch(this, function(layer) {
            if (layer.c$.length) {
                var page = layer.c$[0].page;
                if (page.getDirty()) unsavedPages.push(page);
            }
            }));
        }));
        if (unsavedPages.length > 0) {
            studio.listUnsavedDialog.page.setUnsaved(unsavedPages);
            studio.listUnsavedDialog.page.onDone = dojo.hitch(this, function() {
            this.saveComplete();
            });
            studio.listUnsavedDialog.show();
            return;
        }
        }
        */

        return d;
   },
   updatePhonegapFiles: function() {
       return studio.phoneGapService.requestAsync("updatePhonegapFiles", [location.port || 80, studio.application.theme, studio.application.tabletTheme || "", studio.application.phoneTheme || ""]);
   },

    // finished saving the project files (but not necesarily the service files)
    saveComplete: function() {
/*
            app.toastSuccess("Project Saved!");
        */
        wm.job("studio.updateDirtyBit",10, function() {studio.updateProjectDirty();});
    },
    saveScript: function() {
           //this.savePageData(this.pageName + ".js", studio.getScript());
        this.saveProject(false);
    },
    saveAppScript: function() {
           //this.savePageData(this.pageName + ".js", studio.getScript());
        this.saveProject(false);
    },
    saveCss: function() {
           //this.savePageData(this.pageName + ".css", studio.getCss());
        this.saveProject(false);
    },
    saveMarkup: function() {
          //this.savePageData(this.pageName + ".html", studio.getMarkup());
        this.saveProject(false);
    },
        getProjectPath: function() {
        //return studio.projectPrefix + this.projectName;
         return this.projectName;
    },
    getProgressIncrement: function(runtime) {
    return runtime ? 0 : 16;
    },
    saveApplication: function(callback) {
        var f = [];
        var themeUrl, phoneThemeUrl, tabletThemeUrl;
        try {
            studio.application.setValue("studioVersion", wm.studioConfig.studioVersion);
        } catch (e) {
            console.error("Failed to write studio version to project file");
        }
        if (studio.tree.selected && studio.tree.selected.component == studio.application) studio.inspector.reinspect();

        var c = wm.studioConfig;

        var allProjectJS = "";
        var onError = function() {};
        /* Save Step: Make sure that the server knows which project is open, something that can be lost by restarting the server, clearing cookies, or
         * losing a cookie by opening studio in another tab
         */
        var d = studio.studioService.requestAsync("openProject", [this.projectName]);

        /* Save Step: Update the project timestamp file */
        var finalDeferred =

        d.then(dojo.hitch(this, function() {
            var d = this.saveProjectData("timestamp.txt", new Date().getTime(), false, true);
            return d;
        }), onError).then(
            /* Save Step: Load from server whether security is enabled and set app.isSecurityEnabled */
            dojo.hitch(this, function() {
                var d = studio.securityConfigService.requestAsync("isSecurityEnabled", []);
                d.addCallback(dojo.hitch(this, function(inResult) {
                    studio.application.isSecurityEnabled = inResult;
                }));
                return d;
            }),onError
        ).then(
            dojo.hitch(this, function() {
				studio.incrementSaveProgressBar(1);
				if (studio.application.isSecurityEnabled) {
                    var d = studio.securityConfigService.requestAsync("getGeneralOptions", []);
                    d.addCallback(dojo.hitch(this, function(inResult) {
                        studio.application.isSSLUsed = inResult.SSLUsed;
                    }));
                    return d;
                }
            }),onError
        ).then(
            /* Save Step: Load the SMD files and add them to project.js */
            dojo.hitch(this, function() {
                studio.incrementSaveProgressBar(1);
                var d = this.loadProjectData("services/runtimeService.smd", true);
                d.addCallback(function(inResult) {
                    allProjectJS += "wm.JsonRpcService.smdCache['runtimeService.smd'] = " + inResult + ";\n";
                });
                return d;
            }),onError
        ).then(
            /* Save Step: Load the SMD files and add them to project.js */
            dojo.hitch(this, function() {
                studio.incrementSaveProgressBar(1);
                var d = this.loadProjectData("services/waveMakerService.smd", true);
                d.addCallback(function(inResult) {
                    allProjectJS += "wm.JsonRpcService.smdCache['waveMakerService.smd'] = " + inResult + ";\n";
                });
                return d;
            }),onError
        ).then(
            /* Save Step: Load types.js so it can be added to project.a.js */
            dojo.hitch(this, function() {
                return this.loadProjectData("types.js", true)
            })
        ).then(
            dojo.hitch(this, function(inResult) {
                /* Save Step: Make sure we got types.js; doesn't exist when first creating a project*/
                if (!inResult) {
                    return wm.load("app/templates/project/types.js",true);
                }
                var d = new dojo.Deferred();
                d.callback(inResult);
                return d;
            })
        ).then(
            dojo.hitch(this, function(inResult) {
                allProjectJS += inResult + "\n";
                var themeText = "";
                var theme = studio.application.theme;
                if (theme.indexOf(".") == -1) {
                    if (theme.indexOf("wm_") == 0) {
                        theme = "wm.base.widget.themes." + theme;
                    } else {
                        theme = "common.themes" + theme;
                    }
                }
                var themeName = theme.replace(/^.*\./,"");
                var path;
                if (studio.application.tabletTheme && studio.application.tabletTheme != theme) {
                    path = dojo.moduleUrl(studio.application.tabletTheme) + "/Theme.js";
                    var themeData = wm.load(path);
                    themeText += "if (wm.device == 'tablet') {\n\t" +
                                 "wm.Application.themeData['" + studio.application.tabletTheme + "'] = " + dojo.toJson(dojo.fromJson(themeData)) + ";\n} else ";
                }

                // TODO: If phone and tablet are the same, we can optimize this
                if (studio.application.phoneTheme && studio.application.phoneTheme != theme) {
                    path = dojo.moduleUrl(studio.application.phoneTheme) + "/Theme.js";
                    var themeData = wm.load(path);
                    themeText += "if (wm.device == 'phone') {\n\t" +
                                 "wm.Application.themeData['" + studio.application.phoneTheme + "'] = " + dojo.toJson(dojo.fromJson(themeData)) + ";\n} else ";
                }
                var closeParenNeeded = Boolean(themeText);
                if (themeText) {
                    themeText += " {\n\t";
                }
                path = dojo.moduleUrl(theme) + "/Theme.js";
                var themeData = wm.load(path);
                themeText += "wm.Application.themeData['" + studio.application.theme + "'] = " + dojo.toJson(dojo.fromJson(themeData)) + ";\n";
                if (closeParenNeeded) themeText += "}\n";
                allProjectJS += themeText;
                studio.incrementSaveProgressBar(1);
            }), onError
        ).then(
            /* Save Step: Load from lib/boot.js and write a copy to project/webapproot/boot.js */
            dojo.hitch(this, function() {
                var bootJsPath = dojo.moduleUrl("lib.boot") + "boot.js";
                var d = wm.load(bootJsPath,false,true);
                return d;
            }),onError
        ).then(
            dojo.hitch(this, function(inResult) {
                var d = this.saveProjectData("boot.js", inResult, false, true);
                return d;
            }),onError
        ).then(
            /* Save Step: Save a WEB-INF/whitelist.txt of domains we can safely access via the useProxy XhrService webservice components */
            dojo.hitch(this, function() {
                var URLs = "";
                allComponents = studio.application.$;
                wm.forEachProperty(allComponents, function(p){
                    if(p instanceof wm.XhrDefinition){
                        URLs = URLs.concat(p.url + "\n");
                        }
                });
                var d = this.saveProjectData("WEB-INF/whitelist.txt", URLs, false, true);
                return d;
            }),onError
        ).then(
            /* Save Step: Call setupPhonegapFiles */
            dojo.hitch(this, function() {
                if (!studio.isCloud()) {
                    studio.setSaveProgressBarMessage("Initializing PhoneGap (Please wait...)");
                    var d = studio.phoneGapService.requestAsync("setupPhonegapFiles", []);
                    return d;
                }
                // if no d returned, immediately calls the next then()
            }),onError
        ).then(
            /* Add custom components to wm.componentList */
            dojo.hitch(this, function() {
                dojo.forEach(__packageRegistry, function(customComponent) {
                    allProjectJS += "wm.componentList['" + customComponent[2] + "'] = ['wm.base.widget.Composite','" + customComponent[3] + "'];\n";
                }, this);
            }), onError
        ).then(
            /* Save Step: Write application widgets, properties and custom code */
            dojo.hitch(this, function() {

                studio.incrementSaveProgressBar(1);
                studio.setSaveProgressBarMessage(this.projectName + ".js");
                var src = this.generateApplicationSource();
                allProjectJS += src;

                var d = this.saveProjectData(this.projectName + ".js", src, false, true);
                return d;
            }),onError
        ).then(
            /* Save Step: Write projectName.documentation.json file */
            dojo.hitch(this, function() {
                studio.incrementSaveProgressBar(1);
                studio.setSaveProgressBarMessage(this.projectName + ".documentation.json");
                var appdocumentation = studio.application.getDocumentationHash();
                var d = this.saveProjectData(this.projectName + ".documentation.json", dojo.toJson(appdocumentation, true), false, true);
                return d;
            }),onError
        ).then(
            /* Save Step: Update index.html */
            dojo.hitch(this, function() {
                studio.incrementSaveProgressBar(1);

                // save html file, config file, and debug loader + css
                studio.setSaveProgressBarMessage(c.appIndexFileName);
                var theme = studio.application.theme;
                var themeName = theme.replace(/^.*\./,"");
                /* Before WM 6.6, themes were stored only as theme names */
                var path;
                if (theme === themeName) {
                    if (this.deployingProject || wm.studioConfig.environment != "local") {
                        themeUrl = (themeName.match(/^wm_/)) ? "lib/wm/base/widget/themes/" + themeName + "/theme.css" : "lib/wm/common/themes/" + themeName + "/theme.css";
                    } else {
                        themeUrl = (themeName.match(/^wm_/)) ? "/wavemaker/lib/wm/base/widget/themes/" + themeName + "/theme.css" : "/wavemaker/lib/wm/common/themes/" + themeName + "/theme.css";
                    }
                } else {
                    if (theme.indexOf("project.") == 0) {
                      themeUrl = theme.replace(/^project\./,"").replace(/\./g,"/") + "/theme.css";
                    } else if (this.deployingProject || wm.studioConfig.environment != "local") {
                        themeUrl = dojo.moduleUrl(theme) + "/theme.css";
                    } else {
                        themeUrl = "../wavemaker/" + dojo.moduleUrl(theme) + "theme.css";
                    }
                }

                var tabletTheme = studio.application.tabletTheme;
                if (tabletTheme && tabletTheme != theme) {
                    if (tabletTheme.indexOf("project.") == 0) {
                      tabletThemeUrl = tabletTheme.replace(/^project\./,"").replace(/\./g,"/") + "/theme.css";
                    } else if (this.deployingProject || wm.studioConfig.environment != "local") {
                        tabletThemeUrl = dojo.moduleUrl(tabletTheme) + "/theme.css";
                    } else {
                        tabletThemeUrl = "../wavemaker/" + dojo.moduleUrl(tabletTheme ) + "theme.css";
                    }
                }

                var phoneTheme = studio.application.phoneTheme;
                if (phoneTheme && phoneTheme != theme) {
                    if (phoneTheme.indexOf("project.") == 0) {
                      phoneThemeUrl = phoneTheme.replace(/^project\./,"").replace(/\./g,"/") + "/theme.css";
                    } else if (this.deployingProject || wm.studioConfig.environment != "local") {
                        phoneThemeUrl = dojo.moduleUrl(phoneTheme) + "/theme.css";
                    } else {
                        phoneThemeUrl = "../wavemaker/" + dojo.moduleUrl(phoneTheme ) + "theme.css";
                    }
                }
                var d;
                if (webFileExists(c.appIndexFileName)) {
                    d = this.loadProjectData(c.appIndexFileName, true);
                } else {
                    var indexHtml = makeIndexHtml(this.projectName, themeUrl);
                    d = new dojo.Deferred();
                    d.callback(indexHtml);
                }

                return d;
            }),onError
        ).then(
            /* Save step: Take the result of loading index.html, revise the file and save it */
            dojo.hitch(this, function(indexHtml) {
                if (indexHtml.match(/var wmThemeUrl\s*=.*?;/)) {
                    indexHtml = indexHtml.replace(/var wmThemeUrl\s*=.*?;/, "var wmThemeUrl = \"" + themeUrl + "\";");
                } else {
                    indexHtml = indexHtml.replace(/\<\/title\s*\>/, "</title>\n<script>\nvar wmThemeUrl = \"" + themeUrl + "\";\n</script>");
                }


                if (tabletThemeUrl) {
                    if (indexHtml.match(/var wmThemeTabletUrl\s*=.*?;/)) {
                    	indexHtml = indexHtml.replace(/var wmThemeTabletUrl\s*=.*?;/, "var wmThemeTabletUrl = \"" + tabletThemeUrl + "\";");
                    } else {
                       	indexHtml = indexHtml.replace(/(var wmThemeUrl.*?|var wmThemePhoneUrl.*?)[\s\n]*\<\/script\>/m, "$1\nvar wmThemeTabletUrl = \"" + tabletThemeUrl + "\";\n</script>");
                    }
                } else {
                   	indexHtml = indexHtml.replace(/var wmThemeTabletUrl\s*=.*?;\s*\n/m, "");
                }

                if (phoneThemeUrl) {
                    if (indexHtml.match(/var wmThemePhoneUrl\s*=.*?;/)) {
                    	indexHtml = indexHtml.replace(/var wmThemePhoneUrl\s*=.*?;/, "var wmThemePhoneUrl = \"" + phoneThemeUrl + "\";");
                    } else {
                       	indexHtml = indexHtml.replace(/(var wmThemeUrl.*?|var wmThemeTabletUrl.*?)[\s\n]*\<\/script\>/m, "$1\nvar wmThemePhoneUrl = \"" + phoneThemeUrl + "\";\n</script>");
                    }
                } else {
                   	indexHtml = indexHtml.replace(/var wmThemePhoneUrl\s*=.*?;\s*\n/m, "");
                }


                var d = this.saveProjectData(c.appIndexFileName, indexHtml, false, true);
                return d;
            }),onError
        ).then(
            /* Save Step: Save login.html */
            dojo.hitch(this, function() {
                if (webFileExists("login.html")) {
                    var d = this.loadProjectData("login.html",true);
                    return d;
                }
            }),onError
        ).then(
            /* Save Step: receive login.html (or null) and write an updated login.html */
            dojo.hitch(this, function(t) {
                if (t) {
                    if (t.match(/var wmThemeUrl\s*=.*?;/)) {
                        t = t.replace(/var wmThemeUrl\s*=.*?;/, "var wmThemeUrl = \"" + themeUrl + "\";");
                    } else {
                        t = t.replace(/\<\/title\s*\>/, "</title>\n<script>\nvar wmThemeUrl = \"" + themeUrl + "\";\n</script>");
                    }


                    if (tabletThemeUrl) {
                        if (t.match(/var wmThemeTabletUrl\s*=.*?;/)) {
                        	indextHtml = t.replace(/var wmThemeTabletUrl\s*=.*?;/, "var wmThemeTabletUrl = \"" + tabletThemeUrl + "\";");
                        } else {
                           	t = t.replace(/(var wmThemeUrl.*?|var wmThemePhoneUrl.*?)[\s\n]*\<\/script\>/m, "$1\nvar wmThemeTabletUrl = \"" + tabletThemeUrl + "\";\n</script>");
                        }
                    } else {
                       	t = t.replace(/var wmThemeTabletUrl\s*=.*?;\s*\n/m, "");
                    }

                    if (phoneThemeUrl) {
                        if (t.match(/var wmThemePhoneUrl\s*=.*?;/)) {
                        	t = t.replace(/var wmThemePhoneUrl\s*=.*?;/, "var wmThemePhoneUrl = \"" + phoneThemeUrl + "\";");
                        } else {
                           	t = t.replace(/(var wmThemeUrl.*?|var wmThemeTabletUrl.*?)[\s\n]*\<\/script\>/m, "$1\nvar wmThemePhoneUrl = \"" + phoneThemeUrl + "\";\n</script>");
                        }
                    } else {
                       	t = t.replace(/var wmThemePhoneUrl\s*=.*?;\s*\n/m, "");
                    }

                    var theme = studio.application.theme;
                    var themeName = theme.replace(/^.*\./,"");
                    if (t.match(/wavemakerNode\",\s*theme\:/)) {
                        t = t.replace(/wavemakerNode\",\s*theme\:\s*\".*?\"/, "wavemakerNode\", theme: \"" + theme + "\"");
                    } else {
                        // first time we save login.html, it doesn't have a theme or projectName in the constructor
                        t = t.replace(/\wavemakerNode\"\}/, "wavemakerNode\", theme:\"" + theme + "\", name:\"" + studio.project.projectName + "\"}");
                    }

                    if (t.match(/,\s*tabletTheme\:/)) {
                        t = t.replace(/\s*tabletTheme\:\s*\".*?\"/, "tabletTheme: \"" + (studio.application.tabletTheme || "") + "\"");
                    } else {
                        // first time we save login.html, it doesn't have a theme or projectName in the constructor
                        t = t.replace(/(wm\.Application.*?)name\:/, "$1tabletTheme: \"" + (studio.application.tabletTheme || "") + "\", name:");
                    }

                    if (t.match(/,\s*phoneTheme\:/)) {
                        t = t.replace(/\s*phoneTheme\:\s*\".*?\"/, "phoneTheme: \"" + (studio.application.phoneTheme || "") + "\"");
                    } else {
                        // first time we save login.html, it doesn't have a theme or projectName in the constructor
                        t = t.replace(/(wm\.Application.*?)name\:/, "$1phoneTheme: \"" + studio.application.phoneTheme + "\", name:");
                    }


                    var d = this.saveProjectData("login.html", t, false, true);
                    return d;
                }
                // No return means go to next then statement
            }),onError
        ).then(
            /* Save Step: write the chromeframe file, but don't overwrite the file if it exists */
            /* TODO: This should be moved into the "new project template"... but is here as it simplifies project upgrades */
            dojo.hitch(this, function() {
                studio.incrementSaveProgressBar(1);
                // save html file, config file, and debug loader + css
                studio.setSaveProgressBarMessage(c.appChromeFileName);
                var d = this.saveProjectData(c.appChromeFileName, c.appChromeTemplate, true, true);
                return d;
            }),onError
        ).then(
            /* Save Step: Write config.js file, but don't overwrite the file if it exists */
            dojo.hitch(this, function() {
                studio.incrementSaveProgressBar(1);
                studio.setSaveProgressBarMessage(c.appConfigFileName);

                var d = this.saveProjectData(c.appConfigFileName, c.appConfigTemplate, true, true);
                return d;
            }),onError
        ).then(
            /* Save Step: Add css to allProjectJS, and save app.css */
            dojo.hitch(this, function() {
                studio.incrementSaveProgressBar(1);

                studio.setSaveProgressBarMessage(c.appCssFileName);
                var css = studio.getAppCss();

                var cssArray = [];
                dojo.forEach(css.split(/\n/), function(line) {
                    if (line.match(/\S/)) cssArray.push(line.replace(/^\s*/g, "").replace(/\'/g, "\"").replace(/\s+$/g, "") + "\\\n");
                });
                allProjectJS += "\n" + studio.project.projectName + ".prototype._css = '" + cssArray.join("") + "';";

                var d = this.saveProjectData(c.appCssFileName, css, false, true);
                return d;
            }),onError
        ).then(
            /* Save Step: Load patches.js and added it to allProjectJS */
            dojo.hitch(this, function() {
                studio.incrementSaveProgressBar(1);
                studio.setSaveProgressBarMessage("project.a.js");
                var d = wm.load("lib/wm/common/" + wm.version.replace(/[^a-zA-Z0-9]/g, "") + "_patches.js", false, true);
                return d;
            }),onError
        ).then(
            /* Save Step: Finish up prior step */
            dojo.hitch(this, function(inResponse) {
                allProjectJS += "\n" + inResponse;
            }),onError
        ).then(
            /* Save Step: Write project.a.js */
            dojo.hitch(this, function() {
                studio.incrementSaveProgressBar(1);
                studio.setSaveProgressBarMessage("project.a.js");
                var d = this.saveProjectData("project.a.js", allProjectJS, false, true);
                return d;
            }),onError
        ).then(
            dojo.hitch(this, function() {
                studio.incrementSaveProgressBar(1);
                studio.setCleanApp();
                if (callback) callback();
            }),onError
        );
        return finalDeferred;

    },


    // Right now, the documentation files are our only place for storing project meta data... stuff that should be widget level properties,
    // but which should not show up at runtime.  So we need a quick way to change them and save them
    setMetaDataFlag: function(key,value) {
    if (!studio.application._metaData)
        studio.application._metaData = {};
    if (studio.application._metaData[key] != value) {
        studio.application._metaData[key] = value;
        var appdocumentation = studio.application.getDocumentationHash();
        this.saveProjectData(this.projectName + ".documentation.json", dojo.toJson(appdocumentation, true));
    }
    },
    generateApplicationSource: function() {
/*
        var main = studio.application.main || "Main";
        var appClassName = (wm.studioConfig.isPalmApp ? "wm.PalmApplication" : "wm.Application");
        var src = [
            'dojo.declare("' + this.projectName + '", ' + appClassName + ', {',
                '\tmain: "' + main + '",',
                '\tprojectVersion: "' + studio.application.projectVersion + '",',
                '\tprojectSubVersion: "' + studio.application.projectSubVersion + '",',
                '\tstudioVersion: "' + studio.application.studioVersion + '",',
                '\twidgets: {',
                studio.application.write(sourcer_tab + sourcer_tab),
                '\t}',
            '});'
        ].join(sourcer_nl);
        return src;
*/
        return studio.application.write(sourcer_tab + sourcer_tab);

    },
    savePageAs: function(inName) {
        var previousName = this.pageName;
        this.pageName = inName;
        // if name changed update source
        if (this.pageName != previousName)
            studio.pageNameChange(previousName, this.pageName);

        var d =
            this.savePage().then(
                dojo.hitch(this, function() {
                    this.pageChanged();
                    this.pagesChanged();
                    this.openPage(this.pageName);
                }), function() {}
            );
        return d;
    },
    savePage: function(callback) {
        var self = this;

        var allPageTxt = "";

        // In order to update the progress bar, we need a moment of idle time between each step.  For the cost of some
        // extra code and changing a lot of sync calls to async, we get a progress bar.
        this.saveStateObj = {};

        var d = new dojo.Deferred();
        d.callback();
        var onError = function() {};

        var finalDeferred =
        d.then(
            dojo.hitch(this, function() {
                studio.setSaveProgressBarMessage(this.pageName + ".js");

                /* Change the page's i18n property to true if saving with non-default language */
                if (studio.languageSelect.getDisplayValue() != "default") {
                    studio.page.setI18n(true);
                }
                studio.page.setPreferredDevice(studio.currentDeviceType);

                var text = studio.getScript();

                var def = this.savePageData(this.pageName + ".js", text,false,true);

                var codeLines = [];
                dojo.forEach(text.split(/\n/), function(line) {
                    if (line.match(/\S/))
                    codeLines.push(line.replace(/^\s*/g,"").replace(/\s+$/g,""));
                });

                allPageTxt += codeLines.join("\n") + "\n\n";
                return def;
            }), onError
        ).then(
            dojo.hitch(this, function() {
                studio.setSaveProgressBarMessage(this.pageName + ".widgets.js");
                var lang = studio._designLanguage || studio.languageSelect.getDisplayValue();
                var d;
                if (studio._designLanguage === undefined) // hasn't been set by languageSelectChanged
                    studio._designLanguage = lang;
                    var widgets = studio.getWidgets();
                    this.savePageData(this.pageName + ".widgets.js", widgets);
                    var widgetLines = [];
                    dojo.forEach(widgets.split(/\n/), function(line) {
                        if (line.match(/\S/))
                        widgetLines.push(line.replace(/^\s*/g,"").replace(/\s+$/g,""));
                    });

                    allPageTxt += widgetLines.join("\n") + ";\n";
                    if (lang != "default") {
                        var dictionary = studio.page.getLanguageWidgets();
                        var oldDictionaryStr = wm.load("projects/" + studio.project.projectName + "/language/nls/" + lang + "/" + studio.project.pageName + ".js");
                        try {
                            var oldDictionary = dojo.fromJson(oldDictionaryStr);
                            for (var term in oldDictionary) {
                                /* Copy only strings... script terms; all properties are in objects/hashes */
                                if (typeof oldDictionary[term] == "string" && dictionary[term] === undefined)
                                    dictionary[term] = oldDictionary[term];
                            }
                        } catch(e){
                            console.error("Failed to load dictionary " + lang + "/" + studio.project.pageName);
                        }
                        d = studio.studioService.requestAsync("writeWebFile", ["language/nls/" + lang + "/" + studio.project.pageName + ".js", dictionary, false]);
                    }
                    delete studio._designLanguage;
                    if (!d) {
                        d = new dojo.Deferred();
                        wm.onidle(d, "callback");
                    }
                    return d;
                }), onError
            ).then(

                dojo.hitch(this, function() {
                    studio.setSaveProgressBarMessage(this.pageName + ".css");
                    var def = this.savePageData(this.pageName + ".css", studio.getCss(), false, true);
                    allPageTxt += "\n" + studio.project.pageName + ".prototype._cssText = '";
                    var cssArray = [];
                    dojo.forEach(studio.getCss().split(/\n/), function(line) {
                        if (line.match(/\S/))
                        cssArray.push(line.replace(/^\s*/g,"").replace(/\'/g,"\"").replace(/\s+$/g,"") + "\\\n");
                    });
                    allPageTxt += cssArray.join("") + "';";
                    return def;
                }), onError
            ).then(
                dojo.hitch(this, function() {
                    studio.setSaveProgressBarMessage(this.pageName + ".html");
                    this.savePageData(this.pageName + ".html", studio.getMarkup());
                    allPageTxt += "\n" + studio.project.pageName + ".prototype._htmlText = '";
                    var markupArray = [];
                    dojo.forEach(studio.getMarkup().split(/\n/), function(line) {
                        if (line.match(/\S/))
                        markupArray.push(line.replace(/^\s*/g,"").replace(/\'/g,"&#39;").replace(/\s+$/g,"") + "\\\n");
                    });
                    allPageTxt += markupArray.join("") + "';";
                    var d = new dojo.Deferred();
                    wm.onidle(d,"callback");
                    return d;
                }), onError
            ).then(
                dojo.hitch(this, function() {
                    studio.setSaveProgressBarMessage(this.pageName + ".html");
                    var d = this.savePageData(this.pageName + ".a.js", allPageTxt, false, true);
                    return d;
                }), onError
            ).then(
                dojo.hitch(this, function() {
                    studio.setSaveProgressBarMessage(this.pageName + ".documentation");
                    var documentation = studio.page.getDocumentationHash();
                    var def = this.savePageData(this.pageName + ".documentation.json", dojo.toJson(documentation, true), false, true);

                    // if there are no errors, set the page to clean
                    def.addCallback(function() {

                    });
                    return def;
                }), onError
            ).then(
                dojo.hitch(this, function() {
                    studio.setCleanPage();
                    if (callback) callback();
                }), onError
            );
            return finalDeferred;
    },
    saveProjectData: function(inPath, inData, inNoOverwrite, async) {
        dojo.publish("studio-saveProjectData");
        if (async) {
        return studio.studioService.requestAsync("writeWebFile", [inPath, inData, inNoOverwrite||false]);
        } else {
        return studio.studioService.requestSync("writeWebFile", [inPath, inData, inNoOverwrite||false]);
        }
    },
    savePageData: function(inPath, inData, inNoOverwrite, async) {
            var self = this;
        var path = wm.pagesFolder + this.pageName + "/" + inPath;
        var def = studio.studioService[async ? "requestAsync" : "requestSync"]("writeWebFile", [path, inData, inNoOverwrite||false]);
        def.addCallback(
            function() {
            studio.incrementSaveProgressBar(1);
            });
            def.addErrback(
            function(inError) {
            app.toastError(inError.message);
            self.saveStateObj.canceled = true;
            studio.progressDialog.hide();
            });
        return def;
    },
    copyProject: function(inName, inNewName) {
        if (inName && inNewName)
            this.saveProject(false);
        studio.beginWait(studio.getDictionaryItem("wm.studio.Project.WAIT_COPY_PROJECT"));
        studio.studioService.requestAsync("copyProject", [inName, inNewName], dojo.hitch(this, function() {
        this.projectsChanged();
        studio.endWait();
        app.toastSuccess(studio.getDictionaryItem("wm.studio.Project.TOAST_COPY_PROJECT_SUCCESS", {oldName: inName, newName: inNewName}));
        studio.startPageDialog.page.refreshProjectList();
        }));
    },
    //=========================================================================
    // Delete
    //=========================================================================
    deleteProject: function(inName) {
            var deleteCurrentProject = (inName == this.projectName);
        if  (deleteCurrentProject)
            this.closeProject();
        return studio.studioService.requestAsync("deleteProject", [inName], dojo.hitch(this, function() {
            this.projectChanged(inName);
            studio.startPageDialog.page.refreshProjectList();
        }));
    },
    deletePage: function(inName) {
        return studio.pagesService.requestAsync("deletePage", [inName],
            dojo.hitch(this, function() {
                if (inName == this.pageName)
                    this.openPage(studio.application.main);
                this.pagesChanged();
            }),
            function(inError) {
                app.alert(studio.getDictionaryItem("wm.studio.Project.ALERT_DELETE_PAGE_FAILED",
                                 {pageName: inName, error: inError}));
            }
        );
    },
    //=========================================================================
    // Close
    //=========================================================================
    closeProject: function(inProjectName) {
        this.projectData = {};
        if (studio.application)
        dojo.removeClass(studio.designer.domNode, studio.application.theme);
        if (studio.bindDialog && studio.bindDialog.showing && !studio.bindDialog._hideAnimation)
        studio.bindDialog.dismiss();
        this.closeAllServicesTabs();
        this.closeAllDialogs();
        wm.fire(studio._deployer, "cancel");
        this.pageChanging();
        this.projectChanging();
        studio.studioService.requestSync("closeProject");
        this.pageList = [];
        this.projectName = this.pageName = "";
        studio.application = studio.page = null;
        this.pageChanged();
        this.projectChanged(inProjectName);
    },
    //=========================================================================
    // Project info / util
    //=========================================================================
    showUpgradeMessage: function(inMessages) {
        var message = "<p>" + studio.getDictionaryItem("ALERT_BACKUP_OLD_PROJECT", {filePath: inMessages.backupExportFile}) + "</p>";
        if (inMessages.messages) {
            var firstElem = true;
            for (var key in inMessages.messages) {
                if (firstElem) {
                    message += "<p>" + studio.getDictionaryItem("ALERT_UPGRADE_HEADING")  + "<ul>";
                    firstElem = false;
                }

                /* TODO: Split the string on \n and if there is a slit, make each one an <li> */
                var m1 = inMessages.messages[key];

                for (var i = 0; i < m1.length; i++) {
                var m2 = m1[i];
                m2 = m2.replace(/^\s*/,"");
                m2 = m2.replace(/\s*$/,"");
                var m3 = m2.split(/\n+/);
                for (var j = 0; j < m3.length; j++) {
                    var m4 = m3[j];
                    m4 = m4.replace(/^\s*/,"");
                    m4 = m4.replace(/\n/g,"<br/>");
                    message += "<li>" + m4 + "</li>";
                }
                }

            }
        }
        if (!firstElem)
        message += "</ul></p>";
        app.alert(message);
        app.alertDialog.setWidth("500px");
    },
    updatePageList: function(hasOpenProject, async) {
        if (hasOpenProject) {
        var d = studio.pagesService[async ? "requestAsync" : "requestSync"]("listPages", null);
        d.addCallback(dojo.hitch(this, function(inResult) {
            inResult.sort();
            var result = [];
            for (var i = 0; i < inResult.length; i++)
            result.push({dataValue: inResult[i]});
            app.pagesListVar.setData(result);
            this.pageList = inResult;

            studio.updatePagesMenu();
            return inResult;
        }));
        return d;
        } else {
        app.pagesListVar.setData([]);
        }
    },
    getPageList: function() {
        return this.pageList || [];
    },
    // TODO: start page's  refreshProjectList and this call to listProjects should share
    // a single model.
/*
    updateProjectList: function() {
        var d = studio.studioService.requestSync("listProjects", null);
        d.addCallback(dojo.hitch(this, function(inResult) {
            inResult.sort();
            this.projectList = inResult;
            return inResult;
        }));
        return d;
    },
    getProjectList: function() {
        return this.projectList || [];
    },
    */
    getProjectList: function() {
        var data =  app.projectListVar.getData();
        var result = [];
        dojo.forEach(data, function(d) {result.push(d.dataValue);});
        return result;
    },
    projectsChanged: function() {
        studio.projectsChanged();
    },
    pagesChanged: function() {
        this.updatePageList(true);
        studio.pagesChanged();
            if (studio.application && studio.selected && !studio.selected.isDestroyed) {
            studio.reinspect();
        }
    },
    projectChanging: function() {
        if (this.projectName) {
            dojo.registerModulePath("project", wm.libPath + "/../projects/" + this.projectName);
        }
        this.updatePageList(studio._loadingApplication);
        studio.projectChanging();
    },
    projectChanged: function(optionalInName) {
            var name = (optionalInName || this.projectName);
        var projectData = (name == this.projectName) ? (this.projectData || {}) : {};
        studio.projectChanged(name, projectData);
    },
    pageChanging: function() {
        dojo.removeClass(studio.designer.domNode, this.pageName);
        studio.pageChanging();
    },
    pageChanged: function() {
        studio.pageChanged(this.pageName, this.pageData || {});
    },
    getDirty: function() {return studio.updateProjectDirty();},
    getDictionaryItem: function() {
        studio.getDictionaryItem(arguments);
    },
    errorCheck: function() {
        try {
            var errors = [];
            wm.forEachProperty(studio.page.$, function(w) {
                var e = w._errorCheck();
                if (e) errors = errors.concat(e);
            });
            studio.warningsListVar.setData(errors);
            studio.warningsButton.setShowing(errors.length);
            if (errors.length) {
                studio.statusBarLabel.setCaption("Errors were found");
            }
        } catch(e) {}
    },
});

//=========================================================================
// Project Clean / Dirty
//=========================================================================
Studio.extend({
    setCleanPage: function(inPageData) {
        this._cleanPageData = this.page ? {
            js: inPageData ? inPageData.js : this.getScript(),
                css: this.getCss(),
                widgets: inPageData ? inPageData.widgets : this.getWidgets(),
                html: this.getMarkup()
        } : {};
    },
    setCleanApp: function() {
        this._cleanAppData = this.application ? { script: this.project.generateApplicationSource(),
                              widgets: dojo.toJson(this.application.writeComponents("")),
                              js: this.appsourceEditor.getText(),
                              css: this.getAppCss()} : {};
    },
    restoreCleanApp: function() {
    try {
        this._inRestoreCleanApp = true;
    var d = this._cleanAppData;
    if (!d) return;
    this.setAppScript(d.js);
    this.setAppCss(d.css);
    var props = this.listProperties();
    for (var name in this.application.components) {
        var c = this.application.components[name];
        if (this.application._isWriteableComponent(name, props))
        c.destroy();
    }

    var restoreComponents = {};
    var compArray = dojo.fromJson(d.widgets);
    for (var i = 0; i < compArray.length; i++) {
        var tmp = dojo.fromJson("{"+compArray[i]+"}");
        restoreComponents = dojo.mixin(restoreComponents, tmp);
    }
    this.application.createComponents(restoreComponents, this.application);
    this.updateProjectDirty();
    } finally {
        this._inRestoreCleanApp = false;
    }
    },

    /* isPageDirty tells us when its safe to leave a page/change pages and when the user should
     * be warned of unsaved changes
     */
    isPageDirty: function() {
        var c = this._cleanPageData;
        if (!c)
            return;
        return this.page && (c.js != this.getScript() || c.css != this.cssEditArea.getDataValue() || c.html != studio.getMarkup() || c.widgets != this.getWidgets());
    },

    /* isAppDirty is only called from isProjectDirty */
    isAppDirty: function() {
        var c = this._cleanAppData;
        if (!c)
            return;
        return this.application && (c.script != this.project.generateApplicationSource() || c.css != this.appCssEditArea.getDataValue());
    },

    /* Called when the user tries to close their current project or unload studio itself */
    isProjectDirty: function() {
        return this.isAppDirty() || this.isPageDirty() || this.isServicesDirty();
    },

    /* Called only by isProjectDirty to report true/false to whether there are unsaved services */
    isServicesDirty: function() {

        var tabs = [this.JavaEditorSubTab, this.databaseSubTab, this.webServiceSubTab, this.securitySubTab];
        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            var isDirty = false;
            for (var j = 0; j < tab.layers.length; j++) {
                var layer = tab.layers[j];
                if (layer.c$.length == 0) continue;
                var page = layer.c$[0].page;
                if (page && page.getDirty && page.getDirty()) return true;
            }
        }
        return false;

    },
    /* Called whenever we want to update dirty indicators throughout studio as a result of some action such as
     * saving the project, or openning a new project
     */
    updateProjectDirty: function() {
        var dirty = false;
        dirty = this.updateCanvasDirty() || dirty;
        dirty = this.updateSourceDirty() || dirty;
        dirty = this.updateServicesDirtyTabIndicators() || dirty;
        return dirty;
    },

    /* Called by updateProjectDirty;
     * Updates the dirty indicator for canvas based on whether widgets at page or app level have any changes */
    updateCanvasDirty: function() {
        var c = this._cleanPageData;
        var caption = this.workspace.caption;
        if (!c || !this.application) {
            caption = caption.replace(/^\<.*\/\>\s*/, "");
            this.workspace.setCaption(caption);
            return;
        }
        var dirty = c.widgets != this.getWidgets();

        /* Flag the canvas as dirty if anything in the app level model has changed */
        if (!dirty) {
            var c = this._cleanAppData;
            if (!c) return;
            dirty = this.application && (c.widgets != dojo.toJson(this.application.writeComponents("")));
        }


        //      if (dirty && !caption.match(/\<img/)) {
        //      caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
        //      this.workspace.setCaption(caption);
        //      } else if (!dirty && caption.match(/\<img/)) {
        //      caption = caption.replace(/^.*\/\>\s*/,"");
        //      this.workspace.setCaption(caption);
        //      }
        dojo.toggleClass(this.tabs.decorator.btns[this.workspace.getIndex()], "StudioDirtyIcon", dirty);
        return dirty;
    },

    /* Called by updateProjectDirty; Updates the dirty indicators for each source tab based on whether or not the current value matches the saved value */
        updateSourceDirty: function() {
        var c = this._cleanPageData;
        var caption = this.sourceTab.caption;
        if (!c || !this.application) {
        caption = caption.replace(/^\<.*\/\>\s*/,"");
        this.sourceTab.setCaption(caption);
        return;
        }
        var dirty = false;

        dirty = this.updatePageCodeDirty() || dirty;
        dirty = this.updateCssCodeDirty() || dirty;
        dirty = this.updateAppCodeDirty() || dirty;
        dirty = this.updateMarkupCodeDirty() || dirty;



//      if (dirty && !caption.match(/\<img/)) {
//      caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
//      this.sourceTab.setCaption(caption);
//      } else if (!dirty && caption.match(/\<img/)) {
//      caption = caption.replace(/^.*\/\>\s*/,"");
//      this.sourceTab.setCaption(caption);
//      }
        dojo.toggleClass(this.tabs.decorator.btns[this.sourceTab.getIndex()], "StudioDirtyIcon", dirty);
        return dirty;
    },

    /* Called by updateSourceDirty;
     * Updates the dirty indicator for page code based on whether its changed from saved value */
        updatePageCodeDirty: function() {
        var c = this._cleanPageData;
        if (!c || !this.application)
        return;
        var dirty = c.js != this.getScript();

        var caption = this.scriptLayer.caption;
//      if (dirty && !caption.match(/\<img/)) {
//      caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
//      this.scriptLayer.setCaption(caption);
//      } else if (!dirty && caption.match(/\<img/)) {
//      caption = caption.replace(/^.*\/\>\s*/,"");
//      this.scriptLayer.setCaption(caption);
//      }
        dojo.toggleClass(this.sourceTabs.decorator.btns[this.scriptLayer.getIndex()], "StudioDirtyIcon", dirty);
        return dirty;
    },

    /* Called by updateSourceDirty;
     * Updates the dirty indicator for app and page CSS based on whether its changed from saved value */
        updateCssCodeDirty: function() {
        var c1 = this._cleanPageData;
        var c2 = this._cleanAppData;
        var caption = this.cssLayer.caption;
        if (!c1 || !c2  || !this.application) {
        caption = caption.replace(/^\<.*\/\>\s*/,"");
        this.cssLayer.setCaption(caption);
        return;
        }
        var dirty = c1.css != this.getCss() || c2.css != this.getAppCss();

//      if (dirty && !caption.match(/\<img/)) {
//      caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
//      this.cssLayer.setCaption(caption);
//      } else if (!dirty && caption.match(/\<img/)) {
//      caption = caption.replace(/^.*\/\>\s*/,"");
//      this.cssLayer.setCaption(caption);
//      }
        dojo.toggleClass(this.sourceTabs.decorator.btns[this.cssLayer.getIndex()], "StudioDirtyIcon", dirty);
        return dirty;
    },

    /* Called by updateSourceDirty;
     * Updates the dirty indicator for markup based on whether its changed from saved value */
        updateMarkupCodeDirty: function() {
        var c = this._cleanPageData;
        var caption = this.markupLayer.caption;
        if (!c || !this.application) {
        caption = caption.replace(/^\<.*\/\>\s*/,"");
        this.markupLayer.setCaption(caption);
        return;
        }
        var dirty = c.html != this.getMarkup()


//      if (dirty && !caption.match(/\<img/)) {
//      caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
//      this.markupLayer.setCaption(caption);
//      } else if (!dirty && caption.match(/\<img/)) {
//      caption = caption.replace(/^.*\/\>\s*/,"");
//      this.markupLayer.setCaption(caption);
//      }
        dojo.toggleClass(this.sourceTabs.decorator.btns[this.markupLayer.getIndex()], "StudioDirtyIcon", dirty);
        return dirty;
    },

    /* Called by updateSourceDirty;
     * Updates the dirty indicator for the custom app javascript code based on whether its changed from saved value */
        updateAppCodeDirty: function() {
        var c = this._cleanAppData;
        var caption = this.appsource.caption;
        if (!c || !this.application) {
        caption = caption.replace(/^\<.*\/\>\s*/,"");
        this.appsource.setCaption(caption);
        return;
        }
        var dirty = c.js != this.appsourceEditor.getText();


//      if (dirty && !caption.match(/\<img/)) {
//      caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
//      this.appsource.setCaption(caption);
//      } else if (!dirty && caption.match(/\<img/)) {
//      caption = caption.replace(/^.*\/\>\s*/,"");
//      this.appsource.setCaption(caption);
//      }
        dojo.toggleClass(this.sourceTabs.decorator.btns[this.appsource.getIndex()], "StudioDirtyIcon", dirty);
        return dirty;
    }
});

//=========================================================================
// Project UI
//=========================================================================
Studio.extend({
    updatePagesMenu: function() {

            var children = this.navigationMenu.fullStructure;
            var pagesMenu;
            for (var i = 0; i < children.length; i++) {
            if (children[i].idInPage == "pagePopupBtn") {
                pagesMenu = children[i];
                break;
            }
            }
            children = pagesMenu.children;
            var deleteMenu;
            for (var i = 0; i < children.length; i++) {
            if (children[i].idInPage == "deletePageItem") {
                deleteMenu = children[i];
                break;
            }
            }

            while(deleteMenu.children.length) deleteMenu.children.pop();
            dojo.forEach(this.project.pageList, dojo.hitch(this, function(page) {
            deleteMenu.children.push({label: page,
                        iconClass: this.application && page == this.application.main ? "setHomePageItem" : "",
                          onClick: function() {
                              studio.deletePage(page);
                          }
                         });
            }));

            var homeMenu;
            for (var i = 0; i < children.length; i++) {
            if (children[i].idInPage == "setHomePageItem") {
                homeMenu = children[i];
                break;
            }
            }

            while(homeMenu.children.length) homeMenu.children.pop();
            dojo.forEach(this.project.pageList, dojo.hitch(this, function(page) {
            homeMenu.children.push({label: page,
                        iconClass: this.application && page == this.application.main ? "setHomePageItem" : "",
                        onClick: function() {
                            if (studio.application.main != page)
                            studio.setProjectMainPage(page);
                        }
                           });
            }));
            this.navigationMenu.renderDojoObj();
    },
    updateDeploymentsMenu: function() {

            var children = this.navigationMenu.fullStructure;
            var fileMenu;
            for (var i = 0; i < children.length; i++) {
            if (children[i].idInPage == "projectPopupBtn") {
                fileMenu = children[i];
                break;
            }
            }
            children = fileMenu.children;
            var deployMenu;
            for (var i = 0; i < children.length; i++) {
            if (children[i].idInPage == "deployProjectItem") {
                deployMenu = children[i];
                break;
            }
            }

                while(deployMenu.children[0].onClick != "newDeployClick") deployMenu.children.shift();
                var deploymentsAdded = false;
                dojo.forEach(this._deploymentData, dojo.hitch(this, function(deployment,i) {
            if (!deploymentsAdded) {
                deployMenu.children.unshift({separator: true});
                deploymentsAdded = true;
            }

            deployMenu.children.unshift({label: this.getDictionaryItem("MENU_REDEPLOY", {deploymentName: deployment.name}),
                             onClick: dojo.hitch(this, function() {
                             if (!this.deploymentDialog.page) {
                                 this.deploymentDialog.setPage("DeploymentDialog");
                             }
                             studio.beginWait(this.deploymentDialog.page.getDictionaryItem("WAIT_DEPLOY", {deploymentName: deployment.name}));

                                         this.project.saveProject(true).then(
                                            dojo.hitch(this, function() {
                                                studio.beginWait(this.deploymentDialog.page.getDictionaryItem("WAIT_DEPLOY", {deploymentName: deployment.name}));
                                                this.deploymentDialog.page.deployAfterVerifyingNoChanges(deployment);
                                            })
                                        );

                             })
                            });
            }));
            this.navigationMenu.renderDojoObj();
    },

    newPageClick: function(inSender, inEvent, optionalPageType, optionalPageName) {
        var pageName = optionalPageName || "Page";
        if(!this.project.projectName) return;
        if(!this.isShowingWorkspace()) this.tabs.setLayer("workspace");
        this.confirmPageChange(this.getDictionaryItem("CONFIRM_NEW_PAGE"), pageName, dojo.hitch(this, function() {
            var pages = this.project.getPageList();
            var l = {};
            dojo.forEach(pages, function(p) {
                l[p] = true;
            });
            this.promptForName("page", wm.findUniqueName(pageName, [l]), pages, dojo.hitch(this, function(n) {
                n = wm.capitalize(n);
                studio.beginWait(this.getDictionaryItem("WAIT_CREATING_PAGE", {
                    pageName: n
                }));
                this.project.newPage(n, optionalPageType, {}).then(
                    function() {
                        studio.endWait();
                    }
                );
            }));
        }));
    },
    newProjectClick: function() {
        if (this.project.projectName) {
            this.confirmAppChange(this.getDictionaryItem("CONFIRM_CLOSE_PROJECT", {projectName: this.project.projectName}),
                      undefined, dojo.hitch(this, "_newProjectClick"));
        } else {
                    this._newProjectClick();
                }
        },
        _newProjectClick: function() {
            this.project.closeProject();
        var projects = this.project.getProjectList();
        var l={};
        dojo.forEach(projects, function(p) {
            l[p] = true;
        });
            if (!studio.newProjectDialog.pageName)
                studio.newProjectDialog.setPageName("NewProjectDialog");
            studio.newProjectDialog.page.projectName.setDataValue("Project");
            studio.newProjectDialog.page.reset();
            studio.newProjectDialog.show();
/*
        this.promptForName("project", wm.findUniqueName('Project', [l]), projects,
                               dojo.hitch(this, function(n) {
                           if (n) {
                           studio.studioService.requestSync("closeProject");
                           this.waitForCallback(bundleDialog.M_CreatingProject + n, dojo.hitch(this.project, "newProject", n));
                           }
                               }));
                               */
    },
    welcomeOpenClick: function() {
        this.projects.activate();
    },
    saveProjectClick: function() {
        this.saveAll(studio.project);
        //this.waitForCallback(bundleDialog.M_SavingProject + this.project.projectName, dojo.hitch(this.project, "saveProject", false, true));
    },
    saveCssClick: function() {
        this.saveAll(studio.project);
        //this.waitForCallback(bundleDialog.M_SavingCSS + this.project.projectName, dojo.hitch(this.project, "saveCss"));
    },
    saveMarkupClick: function() {
        this.saveAll(studio.project);
        //this.waitForCallback(bundleDialog.M_SavingMarkup + this.project.projectName, dojo.hitch(this.project, "saveMarkup"));
    },
    savePageAsClick: function() {
        this.promptForName("page", this.page.declaredClass, this.project.getPageList(),
                               dojo.hitch(this, function(n) {
                           if (n)
                           this.waitForCallback(this.getDictionaryItem("WAIT_SAVE_PAGE_AS", {pageName: n}),
                                dojo.hitch(this.project, "savePageAs", n));
                               }));
    },
        /* firstSaveCall: What we want is a short delay after we show the progress bar before we start saving.
     *                This delay allows the progress bar to render before we start saving.
     * Usage:         Typical usage follows these steps
     *     1: Figure out how many things need to be saved so that the progress bar can be given a suitable range of values
     *     2: Show the dialog with the progress bar
     *     3: call firstSaveCall which should save whatever service/page requested the save
     *     4: firstSaveCall will call setSaveProgressBarMessage
     *     5: If firstSaveCall is successful, it will then call save on everything else that is unsaved
     */
        saveAll: function(saveOwner) {
        if (!saveOwner) saveOwner = studio.project;
        this.saveDialogProgress.setProgress(0);
        this.saveDialogLabel.setCaption(this.getDictionaryItem("SAVE_DIALOG_START_LABEL"));
        this.progressDialog.show();
        this._saveErrors = [];

        /* If any source tab, canvas or app level variables are unsaved, then all source, canvas and app are saved at this time;
         * so if any of them are dirty, thats 10.
         * and 5 saves for the page level data; so if canvas or source are dirty, thats 15 save operations
         */
        var counter = 12;
        this._unsavedPages = [];

    var tabs = [this.JavaEditorSubTab, this.databaseSubTab, this.webServiceSubTab, this.securitySubTab];
    for (var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        for (var j = 0; j < tab.layers.length; j++) {
        var layer = tab.layers[j];
        if (layer.c$.length == 0) continue;
        var page = layer.c$[0].page;
        if (page && page.getDirty && page.getDirty()) {
            counter += page.getProgressIncrement();
            this._unsavedPages.push(page);
        }
        }
    }

        if (this.updateCanvasDirty() || this.updateSourceDirty()) {
        counter += this.project.getProgressIncrement();
        this._unsavedPages.push(this.project);
        }

        this._saveProgressMax = counter;
        this._saveProgressCurrent = 0;
        this.setSaveProgressBarMessage(saveOwner.owner ? this.getDictionaryItem("SAVE_DIALOG_UPDATE_MESSAGE", {componentName: saveOwner.owner.parent.caption.replace(/\<.*?\>\s*/,"")}) : "");
        this._saveNextConnection = dojo.connect(saveOwner, "saveComplete", this, function() {
        // if the first one fails, don't bother trying to save all the others
        if (this._saveErrors.length) {
            app.alert(this._saveErrors[0].message);
            this.progressDialog.hide();
            dojo.disconnect(this._saveNextConnection);
            return;
        }

        var inc = saveOwner.getProgressIncrement(true);
        this.incrementSaveProgressBar(inc);
        this.saveNext();
        });
        wm.Array.removeElement(this._unsavedPages, saveOwner);
        wm.onidle(saveOwner, "save");
    },
    setSaveProgressBarMessage: function(inMessage) {
        this.saveDialogLabel.setCaption(inMessage);
    },
    incrementSaveProgressBar: function(delta) {
    this._saveProgressCurrent += delta;
    this.saveDialogProgress.setProgress(this._saveProgressCurrent * 100 / this._saveProgressMax);
    },
/* TODO: if save fails, need to keep on saving next; so need to not only connect on saveComplete, but also saveError AND
 * store a log of all errors to show the user when done
 */
    saveNext: function() {
    if (this._saveNextConnection)
        dojo.disconnect(this._saveNextConnection);

    var page = this._unsavedPages.shift();
    if ((!page || !page.getDirty()) && this._unsavedPages.length == 0) {
        this.saveProjectComplete();
        return;
    }
    if (page && page.getDirty()) {
        this.setSaveProgressBarMessage(page.owner ? this.getDictionaryItem("SAVE_DIALOG_UPDATE_MESSAGE", {componentName: page.owner.parent.caption.replace(/\<.*?\>\s*/,"")}) : "");
        this._saveNextConnection = dojo.connect(page, "saveComplete", this, function() {
        var inc = page.getProgressIncrement(true);
        this.incrementSaveProgressBar(inc);
        this.saveNext();
        });
        page.save();
    } else {
        this.saveNext();
    }
    },
    saveProjectComplete: function() {
    this.progressDialog.hide();
    if (this._saveErrors.length) {
        var text = "";
        for (var i = 0; i < this._saveErrors.length; i++) {
        var owner = this._saveErrors[i].owner;
        text += "<b>";
        if (owner instanceof wm.Page) {
            text += owner.owner.parent.caption.replace(/\<.*?\>\s*/,"");
        } else {
            text += this.getDictionaryItem("SAVE_DIALOG_ERROR_REPORT_PROJECT_FILES");
        }
        text += "</b>: " + this._saveErrors[i].message + "<br/>";
        }
        app.alert(text);
    } else {
        app.toastSuccess(this.getDictionaryItem("TOAST_SAVE_PROJECT_SUCCESS"));
        this.saveProjectSuccess();
        this.project.errorCheck();
    }
    var activeLayer = this.tabs.getActiveLayer();
    while (activeLayer.c$[0] instanceof wm.Layers)
        activeLayer = activeLayer.c$[0].getActiveLayer();
    switch(activeLayer.name) {
    case "scriptLayer":
        this.editArea.focus();
        break;
    case "cssLayer":
        this.cssEditArea.focus();
        break;
    case "markupLayer":
        this.markupEditArea.focus();
        break;
    case "appsource":
        this.appsourceEditor.focus();
        break;
    default:
        switch(activeLayer.parent.name) {
        case "JavaEditorSubTab":
        activeLayer.c$[0].page.javaCodeEditor.focus();
        break;
        }
        break;
    }
    dojo.publish("Page-Saved");
    },
    saveProjectSuccess: function() {}, // for dojo.connect
    beginBind: function(inPropName, editArea, type, callback) {
    var bd = this.bindDialog;
            //p = this.getBindDialogProps(inPropName),
        var  p = {targetProperty: inPropName,
              object: editArea // random object
             };

        bd.positionLocation = "bl";
        bd.positionNode = editArea;
        if (p) {
        bd.page.update(p);
        // FIXME: wm.calcOffset fails for td/tr so use tr for now.

        bd.bindSourceDialog.resourceRb.editor.setChecked(true);
        bd.bindSourceDialog.treeControlsPanel.hide();
        if (bd.bindSourceDialog.applyButton.caption !== this.getDictionaryItem("IMPORT_RESOURCE_BUTTON_CAPTION")) {
            bd.bindSourceDialog.applyButton._oldCaption =  bd.bindSourceDialog.applyButton.caption;
        }
        bd.bindSourceDialog.applyButton.setCaption(this.getDictionaryItem("IMPORT_RESOURCE_BUTTON_CAPTION"));

        bd.bindSourceDialog.applyButtonClick = function() {
            var filepath = bd.bindSourceDialog.bindEditor.getValue("dataValue");
            if (callback) {
                callback(filepath);
            } else {
                var newtext = "";
                if (type == "css") {
                newtext = "@import \"" + filepath + "\";";
                editArea.setText(newtext + "\n" + editArea.getText());
                } else {
                   newtext = "dojo" + ".require(\"project." + filepath.replace(/\.js$/,"").replace(/\//g,".") + "\");";
                editArea.setText(editArea.getText() + "\n" + newtext);// goes at end so that errors don't stop class from being declared (also needed for current technique for extracting the editable part of the application.js file)
                }
            }
            bd.bindSourceDialog.cancelButtonClick();
        };
        var closeConnect = dojo.connect(bd, "onClose", this, function() {
            dojo.disconnect(closeConnect);
            bd.bindSourceDialog.applyButtonClick = bd.bindSourceDialog.constructor.prototype.applyButtonClick;
        });
        bd.show();
        bd.domNode.style.display = "block"; // Obviously I'm doing something wrong; this shouldn't be needed
        return true;
        }
    },
    endBind: function(inSender, inPropName, inNode) {
        if (this.bindDialog) {
        this.bindDialog.destroy();
        this.bindDialog = undefined;
        }
    },
/*  getBindDialog: function() {

        var
            props = {

            owner: this,
            pageName: "BindSourceDialog",
            mo dal: false,
            positionLocation: "tl",
            border: "1px",
            width: 650,
            height: 350,
            hideControls: true,
            title: this.getDictionaryItem("TITLE_BIND_DIALOG")
            },
            d = this.bindDialog = new wm.PageDialog(props);
        //d.setContainerOptions(true, 450, 300);
        var b = this.bindDialog;

        if (b._hideConnect)
        dojo.disconnect(b._hideConnect);
        b._hideConnect = dojo.connect(b, "onHide", this, "endBind");
        return b;
    },*/
    deleteSelectedProjectPageClick: function(inSender) {
        var n = this.projectsTree.selected;
        if (!n)
            return;
        if (n.page)
            this.deletePage(n.page);
        else if (n.project)
            this.deleteProject(n.project);
    },

       /* Method appears to be obsolete; from the days when we had a project list that also listed all pages and let users open any project of any page
    openSelectedProjectPageClick: function(inSender) {
        var n = this.projectsTree.selected;
        if (!n)
        return;
        var
        page = n.page, project = n.project,
        warnPage = this.getDictionaryItem("CONFIRM_OPEN_PAGE_LOSE_UNSAVED", {newPage: page, oldPage: this.project.pageName}), // dictionary term used in Studio.js also
        warnProject = bundleDialog.M_AreYouSureCloseProject;
        if (project == this.project.projectName) {
            if (page && page != this.project.pageName)
                        this.confirmPageChange(warnPage, page, dojo.hitch(this, function() {
                this.waitForCallback(this.getDictionaryItem("WAIT_OPENING_PAGE", {pageName: page}),
                         dojo.hitch(this.project, "openPage", page));
                        }));
        } else if (project) {
                    this.confirmAppChange(warnProject, undefined, dojo.hitch(this, function() {
            studio.studioService.requestSync("closeProject");
            var p = bundleDialog.M_OpeningProject + project + (page ? bundleDialog.M_AndPage + page : "") + ".";
            this.waitForCallback(p, dojo.hitch(this.project, "openProject", project, page));
                    }));
        }
    },
*/
    openProjectClick: function() {
            //this.navGotoEditor(this.startLayer.name);
        if (studio.application) {
        this.confirmAppChange(this.getDictionaryItem("CONFIRM_CLOSE_PROJECT", {projectName: this.project ? this.project.projectName : ""}),
                                      undefined, dojo.hitch(this, function() {
                      studio.beginWait(this.getDictionaryItem("WAIT_PROJECT_CLOSING"));
                      wm.onidle(this, function() {
                          try {
                          this.project.closeProject();
                          this.startPageDialog.show();
                          this.startPageDialog.page.openProjectTab();
                          } catch(e) {}
                          studio.endWait();
                      });
                                      }));
        } else {
        this.startPageDialog.show();
        this.startPageDialog.page.openProjectTab();
        }
    },
    deleteProjectClick: function() {
      if (studio.project) {
        this.deleteProject(studio.project.projectName);
      }
    },
    deleteProject: function(inName) {
        var p = inName;
        if (p) {
                app.confirm(this.getDictionaryItem("CONFIRM_DELETE_PROJECT", {projectName: p}), false,
                            dojo.hitch(this, function() {
                        if (studio.project.projectName == inName) {
                      studio.beginWait(this.getDictionaryItem("WAIT_PROJECT_DELETING"));
                      wm.onidle(this, function() {
                          try {
                          this.project.closeProject();
                          this.project.deleteProject(inName);
                          } catch(e) {}
                          studio.endWait();
                      });

                } else {
                        this.project.deleteProject(inName);
                }
                            }));
        }
    },
    deletePage: function(inName) {
        if (this.application.main == inName) {
            app.alert(this.getDictionaryItem("ALERT_CANT_DELETE_HOME_PAGE", {pageName: inName}));
            return;
        }
        app.confirm(this.getDictionaryItem("CONFIRM_DELETE_PAGE", {pageName: inName}), false,
            dojo.hitch(this, function() {
                            this.project.deletePage(inName);
                        }));
    },
    closeClick: function() {
        this.confirmAppChange(this.getDictionaryItem("CONFIRM_CLOSE_PROJECT", {projectName: this.project ? this.project.projectName : ""}),
                                  undefined, dojo.hitch(this, function() {
                      studio.beginWait(this.getDictionaryItem("WAIT_PROJECT_CLOSING"));
                      wm.onidle(this, function() {
                          try {
                          this.project.closeProject();
                          } catch(e) {}
                          studio.endWait();
                      });
                                  }));
    },
    copyProjectClick: function() {
      if (studio.project) {
          this.getNewProjectName(studio.project.projectName,
                                     dojo.hitch(this, function(n) {
                             if (n)
                         this.project.copyProject(studio.project.projectName, n);
                                     }));
        }
    },
    /* WARNING: Should have been named importPageClick */
    importProjectClick: function(inSender) {
        var d = this.importPageDialog;
        if (d) {
            d.page.update();
        } else {
            d = this.importPageDialog = new wm.PageDialog({
                _classes: {domNode: ["studiodialog"]},
                title: "Copy Page",
                owner: studio,
                name: "importPageDialog",
                pageName: "ImportPageDialog",
                hideControls: true
            });
            // once that returns, refresh our list
            d.onClose = function(inWhy) {
                if (inWhy == "OK")
                    studio.project.pagesChanged();
            };
        }
        d.show();
    },
    makeHomeClick: function() {
        this.setProjectMainPage(this.page.declaredClass);
    },
    makeSelectedHomeClick: function(inSender) {
        var n = this.projectsTree.selected;
        if (n && n.page)
            this.setProjectMainPage(n.page);
    },
    setProjectMainPage: function(inName) {
        this.application.main = inName;
        this.project.pagesChanged();
        this.saveProjectClick();
    },
    projectSettingsClick: function(inSender) {
        var d = this.preferencesDialog;
        if (d) {
            d.page.update();
        } else {
            this.preferencesDialog = d = new wm.PageDialog({
                _classes: {domNode: ["studiodialog"]},
                pageName: "PreferencesPane",
                title: this.getDictionaryItem("TITLE_PREFERENCES"),
                modal: false,
                owner: studio,
                hideControls: true,
                height: "130px",
                width: "500px"});
            d.onClose = function(inWhy) {
                /* Removal of projects tab
                if (inWhy == "OK")
                    studio.updateProjectTree();
                    */
            };
        }
        d.show();
    },
    clearProjectPages: function() {
        var pages = this.project.getPageList();
        dojo.forEach(pages, function(p) {
            this.removeClassCtor(p);
        }, this);
    },
    // Note: use with extreme care, blasts away a class
    removeClassCtor: function(inName) {
        var ctor = dojo.getObject(inName);
        if (ctor)
            delete ctor;
        window[inName] = null;
    },
        getNewProjectName: function(inName, onSuccess) {
        var projects = this.project.getProjectList();
        var l={};
        dojo.forEach(projects, function(p) {
            l[p] = true;
        });
           return this.promptForName("project", wm.findUniqueName(inName || 'Project', [l]), projects, onSuccess);
    },
        confirmPageChange: function(inMessage, inNewPage, onConfirm, onCancel) {
        var inMessage = dojo.string.substitute(inMessage, {page: '"' + this.project.pageName + '"', newPage: inNewPage});

        this.confirmSaveDialog.page.setup(
        inMessage,
        /* Save button followed by onConfirm */
        dojo.hitch(this, function() {
            this._saveConnect = dojo.connect(this,"saveProjectSuccess", this, function() {
            onConfirm();
            dojo.disconnect(this._saveConnect);
            });
            this.saveAll(studio.project);
        }),

        /* Confirm == dont save */
        onConfirm,
        onCancel,
        !this.isProjectDirty()); // svn -r31601: don't test for isPageDirty
    },
        confirmAppChange: function(inMessage, inNewProject, onConfirm, onCancel) {
        var inMessage = dojo.string.substitute(inMessage, {project: '"' + this.project.projectName + '"', newProject: inNewProject});

        this.confirmSaveDialog.page.setup(
        inMessage,
        /* Save button followed by onConfirm */
        dojo.hitch(this, function() {
            this._saveConnect = dojo.connect(this,"saveProjectSuccess", this, function() {
            onConfirm();
            dojo.disconnect(this._saveConnect);
            });
            this.saveAll(studio.project);
        }),

        /* onConfirm == dont save */
        onConfirm,
        onCancel,
        !this.isProjectDirty());
    },
    promptForName: function(inTarget, inDefault, inExistingList, onSuccess) {
    var newPrompt = this.getDictionaryItem("PROMPT_TARGET_NAME", {target: inTarget});
    app.prompt(newPrompt, inDefault,
                   dojo.hitch(this, function(name) {
               if (name !== null) {
                           name = dojo.trim(name);
               for (var i= 0, exists = false, lcn = name.toLowerCase(), n; (n=inExistingList[i]); i++)
                   if (n.toLowerCase() == lcn) {
                   exists = true;
                   break;
                   }
               if (exists) {
                                app.createToastDialog();
                               app.toastDialog.showToast(this.getDictionaryItem("TOAST_TARGET_EXISTS", {pageName: name, target: inTarget}),
                                                         5000, "Warning", "tc");
                   return wm.onidle(this, function() {
                                   this.promptForName(inTarget, name, inExistingList, onSuccess);
                               });
               }

               /* I think this stopped being a problem once we required page names start with upper case */
               else if (window[name] || wm.getValidJsName(name) != name) {
                                app.createToastDialog();
                               app.toastDialog.showToast(this.getDictionaryItem("TOAST_INVALID_TARGET_NAME", {target: inTarget, name: name}),
                                                         5000, "Warning", "tc");
                   return wm.onidle(this, function() {
                        this.promptForName(inTarget, name, inExistingList, onSuccess);
                               });
               }
                           if (onSuccess)
                               onSuccess(name);
                       }
                   }));
    },
    /* this was from before we added a "Test run" button
    getPreviewUrl: function() {
        var s = [], q="", c = wm.studioConfig;
        if (this.getUserSetting("previewDebug"))
            s.push("debug");
        if (c.previewPopup)
            s.push("popup");
        var projectPrefix = studio.projectPrefix;
        return "/" + projectPrefix + this.project.projectName + (s.length ? "/?" + s.join("&") : "");
    },
    */
    getPreviewUrl: function(inUrl, isTest) {
        var s = [], q="", c = wm.studioConfig;
        if (isTest)
        s.push("debug");
        if (c.previewPopup)
        s.push("popup");
        if (studio.languageSelect.getDisplayValue() != "default")
        s.push("dojo.locale=" + studio.languageSelect.getDisplayValue());

        if (studio.currentDeviceType == "phone" ||
        studio.currentDeviceType == "tablet") {
        s.push("wmmobile=" + studio.currentDeviceType);
        }

    return (inUrl||"/" + studio.project.projectName)  + (s.length ? "/?" + s.join("&") : "");

    },
    getPreviewWindowOptions: function() {
        var invert = wm.deviceType != "desktop" && this.landscapeToggleButton.clicked;
        var dimensions = studio.deviceSizeSelect.getDataValue();

    var width = dimensions ? dimensions[invert ? "height" : "width"] : 700;
    var height= dimensions ? dimensions[invert ? "width" : "height"] : 1000;
    var scrollbars = "scrollbars=" + (studio.deviceSizeSelect.getDataValue().deviceType == "desktop" ? 1 : 0);
    var widthStr = width.match(/px/) ? ",width=" + width.replace(/px/,"") : ",width=1000";
    var heightStr = height.match(/px/) ? ",height=" + height.replace(/px/,"") : ",height=700";
    return "resizable=1," + scrollbars + widthStr + heightStr;


    },
    runProjectChange: function(inSender, inLabel, inIconClass, inEvent) {
    if (inIconClass == "studioProjectCompile")
        inSender.setWidth(this.getDictionaryItem("COMPILE_BUTTON_WIDTH"));
    else if (inIconClass == "studioProjectTest") {
        inSender.setWidth(this.getDictionaryItem("TEST_BUTTON_WIDTH"));
    } else if (inIconClass == "studioProjectRun") {
        inSender.setWidth(this.getDictionaryItem("RUN_BUTTON_WIDTH"));
    }
    // else its in another language, and don't try tweaking the width at all
    },
    runProjectClick: function(inSender) {
        this.application._deployStatus == ""; // reset this so we can rerun if the button became enabled but this value failed to clear

        var operation = this.runPopup.iconClass;
        this._runRequested = (operation != "studioProjectCompile") ? operation : false;
        if (!this._runConnections) this._runConnections = [];
        console.log("CLICK: " + this._runRequested);
        /* Clear any prior connections... esp for runs that don't make it to projectSaveComplete */
        for (var i = 0; i < this._runConnections.length; i++) dojo.disconnect(this._runConnections[i]);
        this._runConnections.push(dojo.connect(this,"saveProjectSuccess", this, function() {

        /* Clear this connection */
        for (var i = 0; i < this._runConnections.length; i++) dojo.disconnect(this._runConnections[i]);
        this._runConnections = [];

        this.deploy(this.getDictionaryItem("WAIT_BUILD_PREVIEW"), operation, false);
        }));
        this.saveProjectClick();
    }
});

//=========================================================================
// Project Tree
//=========================================================================
Studio.extend({
    /* Removal of projects tab
    updateProjectTree: function() {
        var d = this.project.updateProjectList();
        d.addCallback(dojo.hitch(this, "_updateProjectTree"));
        if (this.startContainer && this.startContainer.page instanceof wm.Page) {
          d.addCallback(dojo.hitch(this.startContainer.page, "listProjectsResult"));
        }
    },
    updateProjectTreePages: function() {
        var n = this.projectsTree.findNode({project: this.project.projectName});
        if (n) {
            n.removeChildren();
            this._updateProjectNode(n, this.project.getPageList());
            this.selectInProjectTree(this.project.projectName, this.project.pageName);
        }
    },
    _updateProjectTree: function(inResult) {
        this.projectsTree.clear();
        dojo.forEach(inResult, function(t) {
            new wm.TreeNode(studio.projectsTree.root, {
                content: t,
                project: t,
                image: "images/project_16.png",
                closed: true,
                hasChildren: true,
                initNodeChildren: dojo.hitch(this, "initProjectNodeChildren")
            });
        }, this);
        this.selectInProjectTree(this.project.projectName, this.project.pageName);
    },
    _updateProjectNode: function(inNode, inResult) {
        dojo.forEach(inResult, function(t) {
            new wm.TreeNode(inNode, {
                content: t,
                project: inNode.project,
                page: t,
                image: "images/page.png",
                hasChildren: false
            });
        });
    },
    selectInProjectTree: function(inProjectName, inPageName) {
        var n = this.projectsTree.findNode({project: inProjectName});
        if (n && inPageName) {
            n.setOpen(true);
            n = this.projectsTree.findNode({project: inProjectName, page: inPageName}, n) || n;
        }
        if (n)
            this.projectsTree.select(n);
    },
    projectsTreeDblClick: function(inSender, inNode) {
        this.openSelectedProjectPageClick();
    },
    initProjectNodeChildren: function(inNode) {
        this.pagesService.requestSync("listPages", [inNode.content], dojo.hitch(this, "_updateProjectNode", inNode))
    },
    projectsTreeSelectionChange: function(inNode) {
      var n = this.projectsTree.selected;
      if (!n)
        return;

      var sameProject =  (this.project.projectName == n.project);

      // New page can only be created in currently open project
      this.projectNewPageButton.setDisabled(!sameProject);

      // Can only set the home page of the currently open project
      this.projectSetHomePageButton.setDisabled(!sameProject);

      if (n.page) {
        // Can only delete pages of the currently open project
        this.projectDeleteButton.setDisabled(!sameProject);     ;
      } else if (n.project) {
        this.projectSetHomePageButton.setDisabled(true);
        this.projectDeleteButton.setDisabled(false);
      }

      // Do not allow users to delete the last page of the project
      if (n.page && n.parent.kids.length == 1)
        this.projectDeleteButton.setDisabled(true);
    },
    */
    contextualMenuClick: function(inSender,inLabel, inIconClass, inEvent) {

    },


    /* User selects the menu item for installing third party extensions */
    importPartnerService: function() {
        this.ImportThirdPartyAPIDialog.show();
    },

    revertProjectClick: function(inSender) {
        app.confirm(this.getDictionaryItem("CONFIRM_REVERT_PROJECT"), false, function() {
            studio.project.openProject1(studio.project.projectName, studio.project.pageName, new dojo.Deferred());
        });
        //studio.revertProjectOptionsDialog.show();
    },
    getPhonegapBuild: function() {
        if (!this.phoneGapConfigDialog) {
            var dialog = this.phoneGapConfigDialog = new wm.PageDialog({
                _classes: {
                    domNode: ["studiodialog"]
                },
                owner: this,
                width: "600px",
                height: "780px",
                title: "Phonegap Build Config",
                pageName: "PhoneGapConfig",
                hideControls: true,
                modal: true
            });
        } else {
            var dialog = this.phoneGapConfigDialog;
            dialog.page.reset();
        }
        dialog.show();
    },
});


