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
dojo.provide("wm.studio.app.project");

dojo.declare("wm.studio.Project", null, {
	//=========================================================================
	// New
	//=========================================================================
    newProject: function(inName, optionalInTheme, optionalInTemplate) {
		var n = inName || this.projectName || "Project";
		this.projectName = wm.getValidJsName(n);
		this.pageName = "Main";
        studio.beginWait("Setting up new project");
		var d = studio.studioService.requestAsync("newProject", [this.projectName]);
	        d.addCallbacks(
                    dojo.hitch(this, function(inResult) {
                        this.finishNewProject(inResult,optionalInTheme, optionalInTemplate);
                    }),
                    function(inResult) {
			console.log(bundleDialog.M_NewProjectFailed, inResult);
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
				  colCount: 35, 
				  iconCount: 90});
	        this.newPage(this.pageName, "", {template: optionalInTemplate});
                this.saveProject(false, false);
		this.projectChanged();
		this.projectsChanged();
	    studio.endWait("Setting up new project");
		//studio.deploy("Configuring Project...");
	},
    // pageType and argHash are typically empty
    // argHash is a way to pass in custom parameters when creating a non-basic
    // page type
        newPage: function(inName, pageType, argHash) {
		if (!this.projectName)
			return;
		this.pageChanging();
		this.pageName = inName;
	        this.createPageArtifacts(pageType, argHash);
		this.makePage();
		this.savePage();
		this.pageChanged();
		this.pagesChanged();
	        studio.pageSelect.setDataValue(inName);
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
	        this.pageData.widgets = ctor.widgets = this.getPageTemplate(pageType, argHash);
	        var functionTemplate = this.getScriptTemplate(pageType, argHash);
	        studio.setScript(this.pageData.js = pageScript(this.pageName, functionTemplate));
		this.pageData.css = this.pageData.html = "";
	},
        getPageTemplate: function(pageType, argHash) {
            var template_def = argHash.template;
            if (template_def) {
                var template = dojo.clone(template_def);

                var widgets = template._template;
                delete template._template;
                var hasLayout = false;
                for (var i in widgets)
                    if (widgets[i][0] == "wm.Layout")
                        hasLayout = true;

                var widgets_js;
                if (hasLayout) {
                    widgets_js = widgets;
                } else {
                    widgets_js =  {layoutBox1: ["wm.Layout", {name: "layout1"}, {}, {}]};
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
		if (!inProjectName) {
			this.closeProject();
			return;
		}

		if (this.projectName && this.projectName != null && this.projectName != '')
		{
			if (this.projectName != inProjectName)
			{
				this.closeProject(this.projectName);
			}
		}
		
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
	},
    closeAllServicesTabs: function() {
	var layers = studio.tabs.layers;
	for (var i = layers.length-1; i >= 0; i--) 
	    if (layers[i].closable) {
		dojo.forEach(layers[i].c$[0].layers, function(l) {l.destroy();})
		layers[i].hide();
	    }
    },
	openPage: function(inName) {
	    this.closeAllServicesTabs();
	    if (studio.bindDialog.showing && !studio.bindDialog._hideAnimation) 
		studio.bindDialog.dismiss();

		this.pageChanging();
		this.pageName = inName;
		try {
			this.loadPage();
			this.makePage();
		} catch(e) {
			console.debug(e);
			this.loadError(bundleDialog.M_FailedToOpenPage + this.pageName + ". Error: " + e);
			this.pageName = "";
			studio.page = null;
		} finally {
			this.pageChanged();
		        studio.pageSelect.setDataValue(inName);
		}
	},
	loadProjectData: function(inPath) {
	    //return wm.load("projects/" + studio.projectPrefix + this.projectName + "/" + inPath);
		     return wm.load("projects/" + this.projectName + "/" + inPath);
	},
	loadApplication: function() {
		this.projectData = {
			js: this.loadProjectData(this.projectName + ".js"),
		    css: this.loadProjectData("app.css").replace(/^\@import.*theme.css.*/,"").replace(/^\s*\n*/,""), // remove theme import from editable part of app.css
		        documentation: dojo.fromJson(this.loadProjectData(this.projectName + ".documentation.json"))
		};
		if (!this.projectData.js) {
		    alert(bundleDialog.M_WarningCouldNotFind + " projects/" + this.projectName + "/" + this.projectName + ".js");
		} else {
		    var src = this.projectData.js;
		    var extendIndex = src.indexOf(this.projectName + ".extend");

                    // project created prior to our enabling editting of the project.js file
                    if (extendIndex == -1) {
		        this.projectData.js = src;
		        this.projectData.jscustom = this.projectName + ".extend({\n\n\t_end: 0});";
                    } else {
		        this.projectData.js = dojo.trim(src.substring(0,extendIndex));
		        this.projectData.jscustom = dojo.trim(src.substring(extendIndex)) || this.projectName + ".extend({\n\n\t_end: 0});";
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
		        for (var i in this.projectData.documentation) {
                            if (studio.application.components[i])
			        studio.application.components[i].documentation = this.projectData.documentation[i];
                            else
                                console.error("studio.application.components[" + i + "] not found for setting documentation: " + this.projectData.documentation[i]);
			}
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
			studio.page.root.parent = studio.designer;
		        for (var i in this.pageData.documentation) {
                            if (i == "wip")
                                studio.page.documentation = this.pageData.documentation[i];
                            else
			        studio.page.components[i].documentation = this.pageData.documentation[i];
			}
		}
	},
	loadError: function(inMessage) {
	    app.toastError(inMessage, 15000);
		this.projectChanged();
	},
	//=========================================================================
	// Save
	//=========================================================================
        saveProject: function(isDeployment, saveAll) {
                this.deployingProject = isDeployment;
		this.saveApplication(); // synchronous
		this.savePage(); // synchronous

            // in case the theme has changed, resave the login.html page (synchronous)
	    if (webFileExists("login.html")) {
		var templateFolder = dojo.moduleUrl("wm.studio.app") + "templates/security/";
		var loginhtml = loadDataSync(templateFolder + "login.html");
		studio.project.saveProjectData("login.html", wm.makeLoginHtml(loginhtml, studio.project.projectName, studio.application.theme));
            }
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
			this.projectSaveComplete();
		    });
		    studio.listUnsavedDialog.show();
		    return;
		}
	    }
	    this.projectSaveComplete();
	},
    projectSaveComplete: function() {
            app.toastSuccess("Project Saved!");
	    wm.job("studio.updateDirtyBit",10, function() {studio.updateProjectDirty();});
    },
	saveScript: function() {
  	       //this.savePageData(this.pageName + ".js", studio.getScript());
	    this.saveProject(false, false);
	},
	saveAppScript: function() {
  	       //this.savePageData(this.pageName + ".js", studio.getScript());
	    this.saveProject(false, false);
	},
	saveCss: function() {
	       //this.savePageData(this.pageName + ".css", studio.getCss());
	    this.saveProject(false, false);
	},
	saveMarkup: function() {
   	      //this.savePageData(this.pageName + ".html", studio.getMarkup());
	    this.saveProject(false, false);
	},
        getProjectPath: function() {
	    //return studio.projectPrefix + this.projectName;
	     return this.projectName;
	},
	saveApplication: function() {
	        studio.application.incSubversionNumber();
	        try {
		    studio.application.setValue("studioVersion", wm.studioConfig.studioVersion);
		}catch(e) {console.error("Failed to write studio version to project file");}
	        if (studio.tree.selected && studio.tree.selected.component == studio.application)
		    studio.inspector.reinspect();

		var src = this.generateApplicationSource()
		this.saveProjectData(this.projectName + ".js", src);
	    //studio["_cachedEditDataappsourceEditor"] = studio.appsourceEditor.getText();
	        var appdocumentation = studio.application.getDocumentationHash();
	        this.saveProjectData(this.projectName + ".documentation.json", dojo.toJson(appdocumentation, true));
		// save html file, config file, and debug loader + css
		var c = wm.studioConfig;
		    this.saveProjectData(c.appIndexFileName, makeIndexHtml(this.projectName, studio.application.theme), true);

		/* 
		// Fix config.js if there is a username associated with this project (projectdir contains username or is empty string)
		if (window.studio && studio.getProjectDir() &&  c.appConfigTemplate.indexOf('"../wavemaker/') != -1) {
		    c.appConfigTemplate = c.appConfigTemplate.replace('"../wavemaker/', '"../../wavemaker/');
		}	
		*/	
		this.saveProjectData(c.appConfigFileName, c.appConfigTemplate, true);

            var themename = studio.application.theme;
            var path;
            if (this.deployingProject)
                path = (themename.match(/^wm_/)) ? "lib/wm/base/widget/themes/" + themename + "/theme.css" : "lib/wm/common/themes/" + themename + "/theme.css";
            else
                path = (themename.match(/^wm_/)) ? "/wavemaker/lib/wm/base/widget/themes/" + themename + "/theme.css" : "/wavemaker/lib/wm/common/themes/" + themename + "/theme.css";

	    this.saveProjectData(c.appCssFileName, '@import "' + path + '";\n' +  studio.getAppCss());
	    //studio["_cachedEditDataappCssEditArea"] = studio.appCssEditArea.getText();

		this.saveProjectData(c.appDebugBootFileName, '', true);
		if (wm.studioConfig.isPalmApp) {
			this.saveProjectData(c.appPalmAppInfoFileName, makePalmAppInfo(this.projectName), true);
			this.saveProjectData("app/views/first/first-scene.html", "", true);
		}
		studio.setCleanApp();
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
		this.savePage();
		this.pageChanged();
		this.pagesChanged();
		this.openPage(this.pageName);
	},
	savePage: function() {
		this.savePageData(this.pageName + ".js", studio.getScript());
	    //studio["_cachedEditDataeditArea"] = studio.getScript();
		this.savePageData(this.pageName + ".widgets.js", studio.getWidgets());
	    //studio["_cachedEditDatacssEditArea"] = studio.getCss();
	    
		this.savePageData(this.pageName + ".css", studio.getCss());
		this.savePageData(this.pageName + ".html", studio.getMarkup());
	    //studio["_cachedEditDatamarkupEditArea"] = studio.getMarkup();
	        var documentation = studio.page.getDocumentationHash();
	        this.savePageData(this.pageName + ".documentation.json", dojo.toJson(documentation, true));
		studio.setCleanPage();
	},
	saveProjectData: function(inPath, inData, inNoOverwrite) {
		return studio.studioService.requestSync("writeWebFile", [inPath, inData, inNoOverwrite||false]);
	},
	savePageData: function(inPath, inData, inNoOverwrite) {
		var path = wm.pagesFolder + this.pageName + "/" + inPath;
		return studio.studioService.requestSync("writeWebFile", [path, inData, inNoOverwrite||false]);
	},
	copyProject: function(inName, inNewName) {
		if (inName && inNewName)
			this.saveProject(false, true);
			studio.studioService.requestAsync("copyProject", [inName, inNewName], dojo.hitch(this, "projectsChanged"));
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
				alert(inName + bundleDialog.M_CouldNotBeDeleted + ", error: " + inError);
			}
		);
	},
	//=========================================================================
	// Close
	//=========================================================================
	closeProject: function(inProjectName) {
	    if (studio.bindDialog.showing && !studio.bindDialog._hideAnimation) 
		studio.bindDialog.dismiss();
	    this.closeAllServicesTabs();
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
		var message = bundleDialog.M_BackupOld + inMessages.backupExportFile;
		if (inMessages.messages) {
			var firstElem = true;
			for (var key in inMessages.messages) {
				if (firstElem) {
					message += bundleDialog.M_Important;
					firstElem = false;
				}
				message += "\t" + inMessages.messages[key] + "\n";
			}
		}
		alert(message);
	},
	updatePageList: function() {
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
	},
	getPageList: function() {
		return this.pageList || [];
	},
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
	projectsChanged: function() {
		studio.projectsChanged();
	},
	pagesChanged: function() {
		this.updatePageList();
		studio.pagesChanged();
	},
	projectChanging: function() {
		this.updatePageList();
		studio.projectChanging();
	},
	projectChanged: function(optionalInName) {
	        var name = (optionalInName || this.projectName);
		var projectData = (name == this.projectName) ? (this.projectData || {}) : {};
		studio.projectChanged(name, projectData);
	},
	pageChanging: function() {
	    studio.pageChanging();
	},
	pageChanged: function() {
		studio.pageChanged(this.pageName, this.pageData || {});
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
	    if (!studio.application) return;
	    this.updateCanvasDirty();
	    this.updateSourceDirty();
	    this.updateServicesDirtyTabIndicators();
	},

    /* Called by updateProjectDirty; 
     * Updates the dirty indicator for canvas based on whether widgets at page or app level have any changes */
        updateCanvasDirty: function() {
	    var c = this._cleanPageData;
	    if (!c)
		return;
	    var dirty = c.widgets != this.getWidgets();

	    /* Flag the canvas as dirty if anything in the app level model has changed */
	    if (!dirty) {
		var c = this._cleanAppData;
		if (!c)
			return;
		dirty = this.application && (c.widgets != dojo.toJson(this.application.writeComponents("")));
	    }

	    var caption = this.workspace.caption;
	    if (dirty && !caption.match(/\<img/)) {
		caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
		this.workspace.setCaption(caption);
	    } else if (!dirty && caption.match(/\<img/)) {
		caption = caption.replace(/^.*\/\>\s*/,"");
		this.workspace.setCaption(caption);
	    }
	},

    /* Called by updateProjectDirty; Updates the dirty indicators for each source tab based on whether or not the current value matches the saved value */
        updateSourceDirty: function() {
	    var c = this._cleanPageData;
	    if (!c)
		return;

	    var dirty = false;

	    dirty = this.updatePageCodeDirty() || dirty;
	    dirty = this.updateCssCodeDirty() || dirty;
	    dirty = this.updateAppCodeDirty() || dirty;
	    dirty = this.updateMarkupCodeDirty() || dirty;


	    var caption = this.sourceTab.caption;
	    if (dirty && !caption.match(/\<img/)) {
		caption = "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " + caption;
		this.sourceTab.setCaption(caption);
	    } else if (!dirty && caption.match(/\<img/)) {
		caption = caption.replace(/^.*\/\>\s*/,"");
		this.sourceTab.setCaption(caption);
	    }
	},

    /* Called by updateSourceDirty; 
     * Updates the dirty indicator for page code based on whether its changed from saved value */
        updatePageCodeDirty: function() {
	    var c = this._cleanPageData;
	    if (!c)
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
	    if (!c1 || !c2)
		return;
	    var dirty = c1.css != this.getCss() || c2.css != this.getAppCss();

	    var caption = this.cssLayer.caption;
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

	    if (!c)
		return;
	    var dirty = c.html != this.getMarkup()

	    var caption = this.markupLayer.caption;
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

	    if (!c)
		return;
	    var dirty = c.js != this.appsourceEditor.getText();

	    var caption = this.appsource.caption;
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

    newPageClick: function(inSender, inEvent, optionalPageType, optionalPageName) {
	   var pageName = optionalPageName || "Page";
		if (!this.project.projectName)
			return;
		if (!this.isShowingWorkspace())
			this.tabs.setLayer("workspace");
	    this.confirmPageChange(bundleDialog.M_AreYouSureAddNewPage,
                                   undefined,
                                   dojo.hitch(this, function() {
		                       var pages = this.project.getPageList();
		                       var l = {};
		                       dojo.forEach(pages, function(p) {
			                   l[p] = true;
		                       });
                                       this.promptForName("page", wm.findUniqueName(pageName, [l]), pages,
                                                          dojo.hitch(this, function(n) {
	                                                      n = wm.capitalize(n);
			                                      this.waitForCallback(bundleDialog.M_CreatePage + n, dojo.hitch(this.project, "newPage", n, optionalPageType));
                                                          }));
                                   }));
	},
	newProjectClick: function() {
		if (this.project.projectName) {
		    this.confirmAppChange(bundleDialog.M_AreYouSureCloseProject, undefined, dojo.hitch(this, "_newProjectClick"));
		} else {
                    this._newProjectClick();
                }
        },
        _newProjectClick: function() {
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
	    this.waitForCallback(bundleDialog.M_SavingProject + this.project.projectName, dojo.hitch(this.project, "saveProject", false, true));
	},
	saveCssClick: function() {
		this.waitForCallback(bundleDialog.M_SavingCSS + this.project.projectName, dojo.hitch(this.project, "saveCss"));
	},
	saveMarkupClick: function() {
		this.waitForCallback(bundleDialog.M_SavingMarkup + this.project.projectName, dojo.hitch(this.project, "saveMarkup"));
	},
	savePageAsClick: function() {
	    this.promptForName("page", this.page.declaredClass, this.project.getPageList(), 
                               dojo.hitch(this, function(n) {
		                   if (n)
			               this.waitForCallback(bundleDialog.M_SavingPageAs + n, dojo.hitch(this.project, "savePageAs", n));
                               }));                                         
	},
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
		bd.bindSourceDialog.applyButton.setCaption("Import");
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
			width: 550,
			height: 350,
			hideControls: true,
			title: "Binding..."
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
	openSelectedProjectPageClick: function(inSender) {
		var n = this.projectsTree.selected;
		if (!n)
			return;
		var
			page = n.page, project = n.project,
			warnPage = bundleDialog.M_AreYouSureOpenPage,
			warnProject = bundleDialog.M_AreYouSureCloseProject;
		if (project == this.project.projectName) {
		    if (page && page != this.project.pageName)
                        this.confirmPageChange(warnPage, page, dojo.hitch(this, function() {
			    this.waitForCallback(bundleDialog.M_OpeningPage + page + ".", dojo.hitch(this.project, "openPage", page));
                        }));
		} else if (project) {
                    this.confirmAppChange(warnProject, undefined, dojo.hitch(this, function() {
			studio.studioService.requestSync("closeProject");
			var p = bundleDialog.M_OpeningProject + project + (page ? bundleDialog.M_AndPage + page : "") + ".";
			this.waitForCallback(p, dojo.hitch(this.project, "openProject", project, page));
                    }));
		}
	},
	openProjectClick: function() {
	        //this.navGotoEditor(this.startLayer.name);
	    if (studio.application) {
		this.confirmAppChange(bundleDialog.M_AreYouSureCloseProject, 
                                      undefined, dojo.hitch(this, function() {
					  this.project.closeProject();
					  this.startPageDialog.show();
					  this.startPageDialog.page.openProjectTab();
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
                app.confirm(bundleDialog.M_AreYouSureDeleteProject + p + '?', false,
                            dojo.hitch(this, function() {
		                if (studio.project.projectName == inName)
			            this.project.closeProject();
			        this.project.deleteProject(inName);
			        this.left.setLayer("projects");
                            }));
		}
	},
	deletePage: function(inName) {
		if (this.application.main == inName) {
			alert(inName + bundleDialog.M_DeleteHomePage);
			return;
		}
	    app.confirm(bundleDialog.M_AreYouSureDeletePage + inName + '?', false,
			dojo.hitch(this, function() {
                            this.project.deletePage(inName);
                        }));
	},
	closeClick: function() {
	    this.confirmAppChange(bundleDialog.M_AreYouSureCloseProject, 
                                  undefined, dojo.hitch(this, function() {
		                      this.project.closeProject();
                                  }));
	},
	copyProjectClick: function() {
	  if (studio.project) {
	      this.getNewProjectName(studio.project.projectName, 
                                     dojo.hitch(this, function(n) {
			                 if (n)
					     this.waitForCallback(bundleDialog.M_CopyingProject + studio.project.projectName + bundleDialog.M_CopyProjectTo + n, dojo.hitch(this.project, "copyProject", studio.project.projectName, n));
                                     }));
		}
	},
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
		this.pagesChanged();
		this.saveProjectClick();
	},
	projectSettingsClick: function(inSender) {
		var d = this.preferencesDialog;
		if (d) {
			d.page.update();
		} else {
			this.preferencesDialog = d = new wm.PageDialog({pageName: "PreferencesPane", owner: studio, hideControls: true, contentHeight: 250, contentWidth: 500});
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
            if (this.isPageDirty())
                app.confirm(inMessage, false, onConfirm, onCancel);
            else if (onConfirm)
                onConfirm();
	},
        confirmAppChange: function(inMessage, inNewProject, onConfirm, onCancel) {
	    var inMessage = dojo.string.substitute(inMessage, {project: '"' + this.project.projectName + '"', newProject: inNewProject});
	    if (this.isProjectDirty())
                app.confirm(inMessage, false, onConfirm, onCancel);
            else if (onConfirm)
                onConfirm();
	},
    promptForName: function(inTarget, inDefault, inExistingList, onSuccess) {
	var newPrompt = bundleDialog.M_EnterNewName;
	var warnExists = bundleDialog.M_WarnAlreadExist;
	var warnNotValid = bundleDialog.M_WarnInvalidName;
	app.prompt(dojo.string.substitute(newPrompt, {target: inTarget}), inDefault, 
                   dojo.hitch(this, function(name) {
		       if (name !== null) {
                           name = dojo.trim(name);
			   for (var i= 0, exists = false, lcn = name.toLowerCase(), n; (n=inExistingList[i]); i++)
			       if (n.toLowerCase() == lcn) {
				   exists = true;
				   break;
			       }
			   if (exists) {
                               app.toastDialog.showToast(dojo.string.substitute(warnExists, {target: inTarget, name: name}),
                                                         5000, "Warning", "cc");
			       return wm.onidle(this, function() {
                                   this.promptForName(inTarget, name, inExistingList, onSuccess);
                               });
			   } else if (window[name] || wm.getValidJsName(name) != name) {
                               app.toastDialog.showToast(dojo.string.substitute(warnNotValid, {name: name}),
                                                         5000, "Warning");
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
	    var projectPrefix = studio.projectPrefix;
	    return "/" + projectPrefix + this.project.projectName + (s.length ? "/?" + s.join("&") : "");
	},

    runProjectChange: function(inSender, inLabel, inIconClass, inEvent) {
	if (inLabel == "Compile")
	    inSender.setWidth("100px");
	else
	    inSender.setWidth("75px");
    },
	runProjectClick: function(inSender) {	    
	    this._runRequested = inSender.name;

	    if (!this._runConnections) this._runConnections = [];

	    /* Clear any prior connections... esp for runs that don't make it to projectSaveComplete */
	    for (var i = 0; i < this._runConnections.length; i++) dojo.disconnect(this._runConnections[i]);
	    this._runConnections.push(dojo.connect(this.project,"projectSaveComplete", this, function() {

		/* Clear this connection */
		for (var i = 0; i < this._runConnections.length; i++) dojo.disconnect(this._runConnections[i]);
		this._runConnections = [];

		this.deploy(bundleDialog.M_BuildingPreview, dojo.hitch(this, function(result) {
		    this._runRequested = false;
		    if (inSender.caption != "Compile") 
			wm.openUrl(this.getPreviewUrl(inSender.caption == "Test"), this.project.projectName, "_wmPreview");
		    studio.endWait();
		    return result;
		}));
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

    }
});


