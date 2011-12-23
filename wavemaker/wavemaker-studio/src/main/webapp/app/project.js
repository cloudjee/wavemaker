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
		this.projectChanging();
		this.createApplicationArtifacts();
	        this.makeApplication({theme: optionalInTheme || "wm_default"});
	        new wm.ImageList({owner: studio.application,
				  name: "silkIconList",
				  url: "lib/images/silkIcons/silk.png", 
				  width: 16,
				  height: 16, 
				  colCount: 39, 
				  iconCount: 90});
	    this.newPage(this.pageName, "", {template: optionalInTemplate},
			 dojo.hitch(this, function() {
			     this.saveProject(false);
			     this.projectChanged();
			     this.projectsChanged();
			     studio.endWait(studio.getDictionaryItem("wm.studio.Project.WAIT_CREATING_PROJECT"));
			     studio._loadingApplication = false;
			 }));
	    studio.resourceManagerService.requestAsync("getResourceFolder", []);
		//studio.deploy("Configuring Project...");
	},
    // pageType and argHash are typically empty
    // argHash is a way to pass in custom parameters when creating a non-basic
    // page type
    newPage: function(inName, pageType, argHash, callback) {
		if (!this.projectName)
			return;
		this.pageChanging();
		this.pageName = inName;
	        this.createPageArtifacts(pageType, argHash);
		this.makePage();
	this.savePage(dojo.hitch(this, function() {
	    this.pageChanged();
	    this.pagesChanged();
	    this.updatePageList(true);
	    studio.pageSelect.setDataValue(inName);
	    if (callback) callback();
	}));
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
		// NOTE: could present list of choices here
	    switch(pageType) {
	    case "wm.ListViewerRow":
		return "button1Click: function(inSender) {\n" +
		    "\t\t/* Example of finding and triggering an action based on a button click */\n" +
		    "\t\tvar data = this.variable.getData();\n" +
		    "\t\tconsole.log(\"You have just clicked on a button in the row showing the following data:\");\n" +
		    "\t\tconsole.log(data);\n" +
		    "\t}";
	    default: 
		return "";
	    }
    },
	//=========================================================================
	// Open
	//=========================================================================		 
	openProject: function(inProjectName, inPageName) {
	    if (this.projectName && this.projectName != inProjectName)
		this.closeProject();
	    if (!inProjectName) {
		return;
	    }
	    studio.beginWait(studio.getDictionaryItem("wm.studio.Project.WAIT_OPEN_PROJECT"));
	    studio.neededJars = {};
	    var o = studio.studioService.requestAsync("openProject", [inProjectName],
						      dojo.hitch(this, function(o) {
 							  studio.endWait(studio.getDictionaryItem("wm.studio.Project.WAIT_OPEN_PROJECT"));
							  studio._loadingApplication = true; 
							  this.projectName = inProjectName;

							  var f = function() {
							      this.projectChanging();
							      try {
								  this.loadingProject = true;
								  this.loadApplication();
								  var ctor = dojo.getObject(this.projectName);
								  this.pageName = inPageName || (ctor ? ctor.prototype.main : "Main");
								  this.makeApplication();
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
							      }
							  };
							  if (o.upgradeMessages) {
							      this.showUpgradeMessage(o.upgradeMessages);
							      app.alertDialog.connectOnce(app.alertDialog, "onClose", this, f);
							  } else {
							      dojo.hitch(this, f)();
							  }
						      }),
						      dojo.hitch(this, function(err) {
							  studio.endWait(studio.getDictionaryItem("wm.studio.Project.WAIT_OPEN_PROJECT"));
							  /* Localization: I assume we'll always have an error message */
							  app.alert(err.toString() || "Failed to open project");
							  this.closeProject();
						      }));
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
	for (var i = layers.length-1; i >= 0; i--) 
	    if (layers[i].closable) {
		var sublayers = layers[i].c$[0].layers;
		for (var j = sublayers.length-1; j >= 0; j--) {
		    sublayers[j].destroy();
		}
		layers[i].hide();
	    }
    },
    closeAllDialogs: function() {
	for (var i = wm.dialog.showingList.length-1; i >= 0; i--) {
	    var d = wm.dialog.showingList[i];
	    if (d._isDesignLoaded || d.owner && d.owner._isDesignLoaded || d instanceof wm.ContextMenuDialog)
		d.hide();
	}
    },
    openPage: function(inName, unsavedChanges) {
	this.closeAllServicesTabs();
	this.closeAllDialogs();
	if (studio.bindDialog.showing && !studio.bindDialog._hideAnimation) 
	    studio.bindDialog.dismiss();
	
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
		} catch(e) {
		    console.debug(e);
		    this.loadError(studio.getDictionaryItem("wm.studio.Project.TOAST_OPEN_PAGE_FAILED",
							  {pageName: this.pageName, error: e}));
			this.pageName = "";
			studio.page = null;
		    if (studio.application && studio.application.main && studio.application.main != inName)
			this.openPage(studio.application.main);
		    else {
			this.editProjectFiles();
			//this.closeProject();
		    }
		}
	this.loadingPage = false;
	},
	loadProjectData: function(inPath) {
	    //return wm.load("projects/" + studio.projectPrefix + this.projectName + "/" + inPath);
		     return wm.load("projects/" + this.projectName + "/" + inPath);
	},
	loadApplication: function() {
		this.projectData = {
			js: this.loadProjectData(this.projectName + ".js"),
		    css: String(this.loadProjectData("app.css")).replace(/^\@import.*theme.css.*/,"").replace(/^\s*\n*/,""), // remove theme import from editable part of app.css
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
		var n = this.pageName, f = wm.pagesFolder + n + "/", p = f + n ;
		this.pageData = {
			js: this.loadProjectData(p + ".js"),
			widgets: this.loadProjectData(p + ".widgets.js"),
			css: this.loadProjectData(p + ".css"),
		        html: this.loadProjectData(p + ".html"),
		        documentation: dojo.fromJson(this.loadProjectData(p + ".documentation.json"))
		}
		var ctor = dojo.declare(n, wm.Page);
		eval(this.pageData.widgets);	    
	    if (!this.htmlLoader)
		this.htmlLoader = new wm.HtmlLoader({owner: app, name: "projectHtmlLoader", relativeUrl: false});
	    this.htmlLoader.setHtml(this.pageData.html);
	},
	makeApplication: function(inProps) {
            inProps = inProps || {};
	    var ctor = dojo.getObject(this.projectName);
	    if (ctor) {
		studio.application = new ctor(dojo.mixin({ _designer: studio.designer }, inProps));
		delete studio._application; // temporary property set in Application.init as placeholder for studio.application until the app has finished creating
		for (var i in this.projectData.documentation) {
                    if (studio.application.components[i])
			studio.application.components[i].documentation = this.projectData.documentation[i];
		    else if (i == "__metaData")
			studio.application._metaData = this.projectData.documentation[i];
                    else
                        console.error("studio.application.components[" + i + "] not found for setting documentation: " + this.projectData.documentation[i]);
		}
		if (!studio.application._metaData)
		    studio.application._metaData = {};
		studio.updatePagesMenu(); // now that we have a studio.application object		
	    }
	},
	makePage: function() {
		var ctor = dojo.getObject(this.pageName);
		if (ctor) {
			studio.connect(ctor.prototype, "init", function() { studio.page = this; });
			studio.connect(ctor.prototype, "start", function() { wm.fire(studio.application, "start"); });
			studio.page = new ctor({
				name: "wip",
				domNode: studio.designer.domNode,
				owner: studio,
				_designer: studio.designer
			});
		    if (!studio.page.root) throw studio.getDictionaryItem("wm.studio.Project.THROW_INVALID_PAGE");
			studio.page.root.parent = studio.designer;
		        for (var i in this.pageData.documentation) {
                            if (i == "wip")
                                studio.page.documentation = this.pageData.documentation[i];
                            else
			        studio.page.components[i].documentation = this.pageData.documentation[i];
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
                this.deployingProject = isDeployment;
	    this.saveApplication(dojo.hitch(this, function() {
		this.savePage(dojo.hitch(this, function() {
	            studio.setSaveProgressBarMessage("login.html");
		    // in case the theme has changed, resave the login.html page (synchronous)
		    if (webFileExists("login.html")) {
			var templateFolder = dojo.moduleUrl("wm.studio.app") + "templates/security/";
			var loginhtml = loadDataSync(templateFolder + "login.html");
			studio.project.saveProjectData("login.html", wm.makeLoginHtml(loginhtml, studio.project.projectName, studio.application.theme));
		    }
	            studio.incrementSaveProgressBar(1);
		    this.saveComplete();
		    if (onSave) onSave();
		}));
	    }));
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
	return runtime ? 0 : 12;
    },
	saveApplication: function(callback) {

	    var f = [];

	        try {
		    studio.application.setValue("studioVersion", wm.studioConfig.studioVersion);
		}catch(e) {console.error("Failed to write studio version to project file");}
	        if (studio.tree.selected && studio.tree.selected.component == studio.application)
		    studio.inspector.reinspect();
		

	    var c = wm.studioConfig;

	    f.push(dojo.hitch(this, function() {
		    studio.application.saveCounter = (studio.application.saveCounter || 0) +1;
		    var src = this.generateApplicationSource()
	            studio.setSaveProgressBarMessage(this.projectName + ".js");
		    this.saveProjectData(this.projectName + ".js", src);
	            studio.incrementSaveProgressBar(1);
	    }));

	    f.push(dojo.hitch(this, function() {
			studio.setSaveProgressBarMessage(this.projectName + ".documentation.json");
			var appdocumentation = studio.application.getDocumentationHash();
			this.saveProjectData(this.projectName + ".documentation.json", dojo.toJson(appdocumentation, true));
			studio.incrementSaveProgressBar(1);
	    }));


	    f.push(dojo.hitch(this, function() {
		// save html file, config file, and debug loader + css
	        studio.setSaveProgressBarMessage(c.appIndexFileName);
	        this.saveProjectData(c.appIndexFileName, makeIndexHtml(this.projectName, studio.application.theme), true);
	        studio.incrementSaveProgressBar(1);
	    }));

	    f.push(dojo.hitch(this, function() {
		// save html file, config file, and debug loader + css
	        studio.setSaveProgressBarMessage(c.appChromeFileName);
	        this.saveProjectData(c.appChromeFileName, c.appChromeTemplate, true);
	        studio.incrementSaveProgressBar(1);
	    }));

	    f.push(dojo.hitch(this, function() {
		/* 
		// Fix config.js if there is a username associated with this project (projectdir contains username or is empty string)
		if (window.studio && studio.getProjectDir() &&  c.appConfigTemplate.indexOf('"../wavemaker/') != -1) {
		    c.appConfigTemplate = c.appConfigTemplate.replace('"../wavemaker/', '"../../wavemaker/');
		}	
		*/	
	        studio.setSaveProgressBarMessage(c.appConfigFileName);
		this.saveProjectData(c.appConfigFileName, c.appConfigTemplate, true);
	        studio.incrementSaveProgressBar(1);
	    }));

	    f.push(dojo.hitch(this, function() {
		var themename = studio.application.theme;
		var path;
		if (this.deployingProject)
                    path = (themename.match(/^wm_/)) ? "lib/wm/base/widget/themes/" + themename + "/theme.css" : "lib/wm/common/themes/" + themename + "/theme.css";
		else
                    path = (themename.match(/^wm_/)) ? "/wavemaker/lib/wm/base/widget/themes/" + themename + "/theme.css" : "/wavemaker/lib/wm/common/themes/" + themename + "/theme.css";

		studio.setSaveProgressBarMessage(c.appCssFileName);
		this.saveProjectData(c.appCssFileName, '@import "' + path + '";\n' +  studio.getAppCss());
		studio.incrementSaveProgressBar(1);
	    }));

	    f.push(dojo.hitch(this, function() {
		studio.setSaveProgressBarMessage(c.appDebugBootFileName);
		this.saveProjectData(c.appDebugBootFileName, '', true);
		studio.incrementSaveProgressBar(1);

		if (wm.studioConfig.isPalmApp) {
		    this.saveProjectData(c.appPalmAppInfoFileName, makePalmAppInfo(this.projectName), true);
		    this.saveProjectData("app/views/first/first-scene.html", "", true);
		}
		studio.setCleanApp();
	    }));
		   
	    f.push(callback);
	    
	    // In order to update the progress bar, we need a moment of idle time between each step.  For the cost of some 
	    // extra code and 12 extra miliseconds, we get a progres bar.
	    wm.onidleChain(f);
				       
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
	    this.savePage(dojo.hitch(this, function() {
		this.pageChanged();
		this.pagesChanged();
		this.openPage(this.pageName);
	    }));
	},
	savePage: function(callback) {
	    var f = [];
	    var self = this;

	    f.push(dojo.hitch(this, function() {
		studio.setSaveProgressBarMessage(this.pageName + ".js");

		/* Change the page's i18n property to true if saving with non-default language */
		if (studio.languageSelect.getDisplayValue() != "default") {
		    studio.page.setI18n(true);
		}

		var text = studio.getScript();

		var def = this.savePageData(this.pageName + ".js", text);
	    }));

	    f.push(dojo.hitch(this, function() {
		studio.setSaveProgressBarMessage(this.pageName + ".widgets.js");
		var lang = studio._designLanguage || studio.languageSelect.getDisplayValue();

		if (studio._designLanguage === undefined) // hasn't been set by languageSelectChanged
		    studio._designLanguage = lang;
		this.savePageData(this.pageName + ".widgets.js", studio.getWidgets());

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
		    studio.studioService.requestSync("writeWebFile", ["language/nls/" + lang + "/" + studio.project.pageName + ".js", dictionary, false]);
		}
		delete studio._designLanguage;
	    }));

	    f.push(dojo.hitch(this, function() {	    
		studio.setSaveProgressBarMessage(this.pageName + ".css");
		this.savePageData(this.pageName + ".css", studio.getCss());
	    }));

	    f.push(dojo.hitch(this, function() {
		studio.setSaveProgressBarMessage(this.pageName + ".html");
		this.savePageData(this.pageName + ".html", studio.getMarkup());
	    }));

	    f.push(dojo.hitch(this, function() {
		studio.setSaveProgressBarMessage(this.pageName + ".documentation");
		var documentation = studio.page.getDocumentationHash();
		var def = this.savePageData(this.pageName + ".documentation.json", dojo.toJson(documentation, true));

		// if there are no errors, set the page to clean
		def.addCallback(function() {
		    studio.setCleanPage();
		});
	    }));
	    
	    f.push(callback);

	    // In order to update the progress bar, we need a moment of idle time between each step.  For the cost of some 
	    // extra code and 12 extra miliseconds, we get a progres bar.
	    this.saveStateObj = {};
	    wm.onidleChain(f, this.saveStateObj);

	},
	saveProjectData: function(inPath, inData, inNoOverwrite) {
	    dojo.publish("studio-saveProjectData");
		return studio.studioService.requestSync("writeWebFile", [inPath, inData, inNoOverwrite||false]);
	},
	savePageData: function(inPath, inData, inNoOverwrite) {
	        var self = this;
		var path = wm.pagesFolder + this.pageName + "/" + inPath;
		var def = studio.studioService.requestSync("writeWebFile", [path, inData, inNoOverwrite||false]);
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
	    if (studio.bindDialog.showing && !studio.bindDialog._hideAnimation) 
		studio.bindDialog.dismiss();
	    this.closeAllServicesTabs();
	    this.closeAllDialogs();
		wm.fire(studio._deployer, "cancel");
		this.pageChanging();
		this.projectChanging();
		studio.studioService.requestSync("closeProject");
		this.pageList = [];
		this.projectName = this.pageName = "";
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
	updatePageList: function(hasOpenProject) {
	    if (hasOpenProject) {
		var d = studio.pagesService.requestSync("listPages", null);
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
    }
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
    },

    /* isPageDirty tells us when its safe to leave a page/change pages and when the user should
     * be warned of unsaved changes
     */
	isPageDirty: function() {
		var c = this._cleanPageData;
		if (!c)
			return;
		return this.page && (c.js != this.getScript() || c.widgets != this.getWidgets());
	},

    /* isAppDirty is only called from isProjectDirty */
	isAppDirty: function() {
		var c = this._cleanAppData;
		if (!c)
			return;
		return this.application && (c.script != this.project.generateApplicationSource());
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
		if (page && page.getDirty && page.getDirty()) 
		    return true;
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
		caption = caption.replace(/^\<.*\/\>\s*/,"");
		this.workspace.setCaption(caption);
		return;
	    }
	    var dirty = c.widgets != this.getWidgets();

	    /* Flag the canvas as dirty if anything in the app level model has changed */
	    if (!dirty) {
		var c = this._cleanAppData;
		if (!c)
			return;
		dirty = this.application && (c.widgets != dojo.toJson(this.application.writeComponents("")));
	    }


	    if (dirty && !caption.match(/\<img/)) {
		caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
		this.workspace.setCaption(caption);
	    } else if (!dirty && caption.match(/\<img/)) {
		caption = caption.replace(/^.*\/\>\s*/,"");
		this.workspace.setCaption(caption);
	    }
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



	    if (dirty && !caption.match(/\<img/)) {
		caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
		this.sourceTab.setCaption(caption);
	    } else if (!dirty && caption.match(/\<img/)) {
		caption = caption.replace(/^.*\/\>\s*/,"");
		this.sourceTab.setCaption(caption);
	    }
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
	    if (dirty && !caption.match(/\<img/)) {
		caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
		this.scriptLayer.setCaption(caption);
	    } else if (!dirty && caption.match(/\<img/)) {
		caption = caption.replace(/^.*\/\>\s*/,"");
		this.scriptLayer.setCaption(caption);
	    }
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

	    if (dirty && !caption.match(/\<img/)) {
		caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
		this.cssLayer.setCaption(caption);
	    } else if (!dirty && caption.match(/\<img/)) {
		caption = caption.replace(/^.*\/\>\s*/,"");
		this.cssLayer.setCaption(caption);
	    }
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


	    if (dirty && !caption.match(/\<img/)) {
		caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
		this.markupLayer.setCaption(caption);
	    } else if (!dirty && caption.match(/\<img/)) {
		caption = caption.replace(/^.*\/\>\s*/,"");
		this.markupLayer.setCaption(caption);
	    }
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


	    if (dirty && !caption.match(/\<img/)) {
		caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
		this.appsource.setCaption(caption);
	    } else if (!dirty && caption.match(/\<img/)) {
		caption = caption.replace(/^.*\/\>\s*/,"");
		this.appsource.setCaption(caption);
	    }
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
														     
				                         this.project.saveProject(true, dojo.hitch(this, function() {
							     studio.beginWait(this.deploymentDialog.page.getDictionaryItem("WAIT_DEPLOY", {deploymentName: deployment.name}));
							     this.deploymentDialog.page.deployAfterVerifyingNoChanges(deployment);
							 }));
						     
						     })
						    });
		    }));
		    this.navigationMenu.renderDojoObj();
    },

    newPageClick: function(inSender, inEvent, optionalPageType, optionalPageName) {
	   var pageName = optionalPageName || "Page";
		if (!this.project.projectName)
			return;
		if (!this.isShowingWorkspace())
			this.tabs.setLayer("workspace");
	this.confirmPageChange(this.getDictionaryItem("CONFIRM_NEW_PAGE"),
                                   pageName,
                                   dojo.hitch(this, function() {
		                       var pages = this.project.getPageList();
		                       var l = {};
		                       dojo.forEach(pages, function(p) {
			                   l[p] = true;
		                       });
                                       this.promptForName("page", wm.findUniqueName(pageName, [l]), pages,
                                                          dojo.hitch(this, function(n) {
	                                                      n = wm.capitalize(n);
							      studio.beginWait(this.getDictionaryItem("WAIT_CREATING_PAGE", {pageName: n}));
							      this.project.newPage(n, optionalPageType, {}, function() {studio.endWait();});
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
	     * so if any of them are dirty, thats 6 saves in saveApplication (7 if there is a login.html file),
	     * and 5 saves for the page level data; so if canvas or source are dirty, thats 12 save operations
	     */
	    var counter = 0;
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
    beginBind: function(inPropName, editArea, type) {
	    var bd = this.getBindDialog();
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
		    var newtext = "";
		    if (type == "css") {
			newtext = "@import \"" + filepath + "\";";
			editArea.setText(newtext + "\n" + editArea.getText());
		    } else {
		       newtext = "eval(wm.load(\"" + filepath + "\"));";
			editArea.setText(editArea.getText() + "\n" + newtext);// goes at end so that errors don't stop class from being declared (also needed for current technique for extracting the editable part of the application.js file)
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
	endBind: function(inPropName, inNode) {
	    if (this.bindDialog) {
		this.bindDialog.destroy();
		this.bindDialog = undefined;
	    }
	},
	getBindDialog: function() {

		var
		    props = {
			owner: this,
			pageName: "BindSourceDialog",
			modal: false,
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
	},
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
			this.preferencesDialog = d = new wm.PageDialog({pageName: "PreferencesPane", 
									title: this.getDictionaryItem("TITLE_PREFERENCES"),
									modal: false,
									owner: studio, 
									hideControls: true, 
									contentHeight: 250, 
									contentWidth: 500});
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
		!this.isPageDirty());
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
                               app.toastDialog.showToast(this.getDictionaryItem("TOAST_TARGET_EXISTS", {pageName: name, target: inTarget}),
                                                         5000, "Warning", "tc");
			       return wm.onidle(this, function() {
                                   this.promptForName(inTarget, name, inExistingList, onSuccess);
                               });
			   } 

			   /* I think this stopped being a problem once we required page names start with upper case */
			   else if (window[name] || wm.getValidJsName(name) != name) {
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
	getPreviewUrl: function(isTest) {
	    var s = [], q="", c = wm.studioConfig;
	    if (isTest)
		s.push("debug");
	    if (c.previewPopup)
		s.push("popup");
	    if (studio.languageSelect.getDisplayValue() != "default")
		s.push("dojo.locale=" + studio.languageSelect.getDisplayValue());
	    var projectPrefix = studio.projectPrefix;
	    return "/" + projectPrefix + this.project.projectName + (s.length ? "/?" + s.join("&") : "");
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
	    this.projectDeleteButton.setDisabled(!sameProject);	    ;
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
    }
});


