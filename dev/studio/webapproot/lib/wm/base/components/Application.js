/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and 
 *  limitations under the License.
 */
dojo.provide("wm.base.components.Application");
dojo.require("wm.base.Component");

wm.componentLoaders = wm.componentLoaders || {};

wm.registerComponentLoader = function(inType, inLoader){
	wm.componentLoaders[inType] = inLoader;
};

dojo.declare("wm.Application", wm.Component, {
	main: "Main",
        deletionDisabled: 1,
        projectSubVersion: 1,
        projectVersion: 1,
        studioVersion: "",
        theme: "wm_notheme",
        toastPosition: "br",
        _lastTheme: "",
    //IERoundedCorners: false,
	init: function() {
		app = wm.application = wm.application || this;
		this.connectList = [];
		this.app = this;
		this.inherited(arguments);
		wm.typeManager.initTypes();
	        this.setTheme(themematch ? themematch[1] : this.theme, true);
		this.pageDialog = new wm.PageDialog({name: "pageDialog", owner: this});
		this.toastDialog = new wm.Toast({name: "toastDialog", owner: this});
	       try{
		    this.alertDialog = new wm.GenericDialog({name: "alertDialog",
						     owner: this,
						     title: "Alert!",
						     noEscape: false,
						     width: "300px",
						     height: "180px",
						     button1Caption: "OK",
						     button1Close: true,
						     userPrompt: ""});
                this.alertDialog.domNode.style.zIndex = 45;
		   } catch(e){
		   	console.info('error while creating alert Dialog ', e);
		   }
				
		this.createPageLoader();
		this.components = {};
		this.scrim = new wm.Scrim();
	        var themematch = window.location.search.match(/theme\=(.*?)\&/) ||
		                 window.location.search.match(/theme\=(.*?)$/);

		this.loadComponents(this.constructor.widgets || this.widgets);
	},
    setTheme: function(inTheme, isInit, optionalCss, optionalPrototype, noRegen, forceUpdate) {
	    var isDesigned = (window["studio"] && this != app);
	    var node = isDesigned ? studio.designer.domNode : document.body;
	    dojo.removeClass(node, this.theme);
            this._lastTheme = this.theme;
	    this.theme = inTheme;
	    dojo.addClass(node, this.theme);
	    if (isDesigned || !isInit) {
		try {
		    this.loadThemeCss(this.theme, isDesigned, optionalCss);
		} catch(e) {
		    if (inTheme != "wm_notheme")  {
			this.setTheme("wm_notheme", isInit, optionalCss, optionalPrototype, noRegen);
			app.alert("The theme '" + inTheme + "' was not found.  This can happen when importing a project that uses a theme that is not in your library.  You can download that theme and copy it into your WaveMaker/common/themes folder or go to your model, select 'Project', and pick a new theme");
		    } else  {
			app.alert("Fatal error loading theme wm_notheme.  If you see this, please contact WaveMaker support.");
		    }
		return;
		}
	    }

	   // write before we change the prototype so defaults are left blank
	    if (isDesigned && !isInit) {
                this._themeChanged = true;
                this.cacheWidgets();
	    }
	    this.loadThemePrototype(this.theme, optionalPrototype);
	    if (isDesigned && !isInit && !noRegen) {
                this.useWidgetCache();
	    }
	},
            // don't regenerate over and over; as long as the user remains in the theme designer,
            // widgetsjs shouldn't change except as prototypes change, 
            // and we don't want the design to change each time the prototype border changes...
    cacheWidgets: function() {
        if (!this._widgetsjs) {
	    var widgetsjs = dojo.fromJson("{"+ studio.page.root.write("") + "}");
            this._widgetsjs = widgetsjs;            
        }
    },
    useWidgetCache: function() {
	studio.page.root.destroy();
        delete studio.page.root;
	studio.page.loadComponents(this._widgetsjs,null);
        delete this._widgetsjs;
	studio.page.reflow();
	studio.refreshWidgetsTree();
    },
    loadThemePrototype: function(inThemeName, optionalThemeData) {
        var themeData = wm.Application.themeData[inThemeName];
        if (!themeData || optionalThemeData) {
	    var path;
	    if (inThemeName.match(/^wm_/))
		path = dojo.moduleUrl("wm") + "base/widget/themes/" + inThemeName + "/Theme.js";
	    else
		path = dojo.moduleUrl("common") + "themes/" + inThemeName + "/Theme.js";
	    themeData = optionalThemeData || dojo.fromJson(dojo.xhrGet({url:path, sync:true, preventCache:true}).results[0]);
            wm.Application.themeData[inThemeName] = themeData || {};
        }

        var propHash = themeData["wm.Control"];
	for (var j in propHash) {
	    wm.Control.prototype[j] = propHash[j];
	}

        wm.Application.themePrototypeData = {"wm.Control":this.theme};
    
/*
	for (var i in themeData) {
	    try {
	    console.log("Set prototype of " + i);
	    var propHash = themeData[i];
	    var ctor = dojo.getObject(i);
	    if (ctor && ctor.prototype) {
		var prototype = ctor.prototype;
		for (var j in propHash) {
		    var property = propHash[j];
		    prototype[j] = propHash[j];
		}
	    } else {
		console.log("Theme Error: " + i + " not found");
	    }
	    } catch(e) {console.error("Uncaught error in themes: " + e);}
	    }
            */
    },
    loadThemePrototypeForClass: function(ctor, optionalWidget) {
        if (!this.theme || !ctor) return;

        var declaredClass = ctor.prototype.declaredClass;
        if (declaredClass == "wm.Template") declaredClass = "wm.Panel";
        if (!wm.Application.themePrototypeData[declaredClass] || wm.Application.themePrototypeData[declaredClass] != this.theme) {
            var p = ctor.prototype;
            var lastTheme = wm.Application.themePrototypeData[declaredClass];
            var oldThemeData = wm.Application.themeData[lastTheme]; // app not this; if studio is loaded, we have multiple apps; just have one of them manage this global

            // undo all changes from the last theme for this class
            if (oldThemeData) {
                var oldCtorData = oldThemeData[declaredClass];
                if (oldCtorData) 
                    for (var j in oldCtorData) {
                        delete p[j]; // deleting it lets its parent class prototype value come through (only tested in chrome...)
                        // however, for purposes of reflection/property inspection, if there is no parent class value coming through, lets give it some value.  TODO: Check its type and assign it something based on the property's type.
                        if (p[j] === undefined) 
                            p[j] = "";
			//if (optionalWidget) optionalWidget[j] = "";
                    }
            }

            // make all changes need for this theme for this class
            var themeData = wm.Application.themeData[this.theme];
            var ctorData = themeData[ctor.prototype.declaredClass];
            if (ctorData) {
	        for (var j in ctorData) {
                    ctor.prototype[j] = ctorData[j];
		    if (optionalWidget) optionalWidget[j] = ctorData[j];
                }
            }
            wm.Application.themePrototypeData[declaredClass] = this.theme;
        }
    },
    loadThemeCss: function(inThemeName, inDesign, optionalCss) {
	    var path;
	    var themecss;
	    if (inThemeName.match(/^wm_/))
		path = dojo.moduleUrl("wm") + "base/widget/themes/" + inThemeName + "/theme.css";
	    else
		   path = dojo.moduleUrl("common") + "themes/" + inThemeName + "/theme.css";
	    
	    if (inDesign) {
                var imagepath = path.replace(/\/[^\/]*$/,"/images");
                while (imagepath.match(/[^\/]+\/\.\.\//)) 
                    imagepath = imagepath.replace(/[^\/]+\/\.\.\//,"");
		var results = dojo.xhrGet({url:path, sync:true, preventCache:false}).results;
		if (results[1])
		    throw results[1];

		themecss = optionalCss || results[0] || "";
		themecss = themecss.replace(/url\s*\(\s*images/g,"url(" + imagepath);
		setCss("theme_ss", themecss);
	    } else {
		wm.headAppend(wm.createElement("link", {rel: "stylesheet", type: "text/css", href: path}));
	    }
	},
	postInit: function() {
		this.inherited(arguments);
		//this.getRuntimeService();
	},
	destroy: function() {
		wm.fire(this.scrim, "destroy");
		wm.fire(this._runtimeService, "destroy");
		this.inherited(arguments);
		dojo.forEach(this.connectList, dojo.disconnect);
		this.connectList = null;
		delete this._page;
		if (this._pageLoader)
		{
			this._pageLoader.destroy();
			this._pageLoader = null;
		}	
		
		if (this.domNode)
		{
			dojo.destroy(this.domNode);
			this.domNode = null;
		}		
		
		this.pageDialog.destroy();
		delete this.pageDialog;
		this.scrim.destroy();
		delete this.scrim;
		delete this.app;
		//dojo.publish('applicationDestroyed',[]);
	},
	createPageLoader: function() {
		this._pageLoader = new wm.PageLoader({owner: this});
		this.connectList[this.connectList.length] = this.connect(this._pageLoader, "onBeforeCreatePage", this, "beforeCreatePage");
		this.connectList[this.connectList.length] = this.connect(this._pageLoader, "onPageChanged", this, "pageChanged");
	},
	// avoid unique names when loading components
	loadComponents: function(inChildren) {
		this._loading = true;
		this.createComponents(inChildren);
		// bc only
		//this.createComponent("cssLoader", "wm.CssLoader", {owner: this, url: "app.css"});
		this._loading = false;
	},
	subPageLoaded: function(inPage) {
	  if (djConfig.isDebug) {
	    if (this.debugSubPageList === undefined) 	this.debugSubPageList = {};
	    this.debugSubPageList[inPage.name] = inPage;
	  }
	},
	subPageUnloaded: function(inPage) {
	  if (djConfig.isDebug && inPage) {
	    if (this.debugSubPageList != undefined)
	      delete(this.debugSubPageList[inPage.name]);
	  }
	},
	qualifyName: function(inName) {
		return inName;
	},
	addComponent: function(inComponent) {
		this.inherited(arguments);
		this[inComponent.name] = inComponent;
	},
	removeComponent: function(inComponent) {
		delete this[inComponent.name];
		this.inherited(arguments);
	},
	getRuntimeService: function(owner) {
		if (!this._runtimeService)
		    this._runtimeService = new wm.JsonRpcService({service: "runtimeService",
								  owner: owner});
		return this._runtimeService;
	},
	getRuntimeServiceDesignTime: function(owner) {
		if (!this._runtimeService)
		    this._runtimeService = new wm.JsonRpcService({service: "runtimeService",
								  owner: owner, designTime: true});
		return this._runtimeService;
	},
	getRoot: function() {
		return this;
	},

	getRuntimeId: function(inId) {
		return inId;
	},
	getId: function(inId) {
	    if (inId)
		return "app." + inId;
	    else
		return "app";
	},
	reflow: function() {
		var d = this.domNode;
		d.scrollTop = 0;
	},
	reflowParent: function() {
		this.reflow();
	},
	hideLoadingIndicator: function() {
		dojo._destroyElement("_wm_loading");
	},
	run: function() {
		// highlander when running
		app = wm.application = this;
		dojo.addOnLoad(dojo.hitch(this, "runOnLoad"));
	},
	runOnLoad: function() {
		// In IE6 addOnLoad is sometimes called before the dom is actually ready (bad Dojo)
		// correct here by adding a small delay.
		setTimeout(dojo.hitch(this, "doRun"), dojo.isIE < 7 ? 100 : 1);
	},
	doRun: function() {
		this._pageLoader.domNode = this.domNode = dojo.byId(this.domNode) || document.body;
		this.loadPage(app.main);
	},
	start: function() {
		//this.hideLoadingIndicator();
	},
	getServerComponents: function() {
		if (this.serverComponents === undefined) {
			this.loadServerComponents();
		}
		return this.serverComponents;
	},
	loadServerComponents: function(inComponentType) {
		if (inComponentType && this.serverComponents) {
			for (var i=0, c; c=this.serverComponents[i]; i++) {
				if (c.type == inComponentType)
					this.serverComponents.splice(i--, 1);
			}
			var cl = wm.componentLoaders[inComponentType];
			if (cl)
				this.serverComponents = this.serverComponents.concat(cl.getComponents());
		} else {
			this.serverComponents = [];
			for (var i in wm.componentLoaders) {
				this.serverComponents = this.serverComponents.concat(wm.componentLoaders[i].getComponents());
			}
		}
	},
	addServerComponent: function(inComponent) {
		this.serverComponents.push(inComponent);
	},
	removeServerComponent: function(inComponent) {
		for (var i=0, c; c=this.serverComponents[i]; i++){
			if (c == inComponent) {
				this.serverComponents.splice(i, 1);
				return i;
			}
		}
	},
	removeServerComponentByName: function(inComponentName, inComponentType) {
		for (var i=0, c; c=this.serverComponents[i]; i++){
			if (c.type == inComponentType && c.name == inComponentName) {
				this.serverComponents.splice(i, 1);
				return i;
			}
		}
	},
	beforeCreatePage: function() {
		this._pageLoader.pageConnect("start", this, "start");
		this.pageLoadedDeferred = new dojo.Deferred()
	},
	pageChanged: function(inPage, inPreviousPage) {
		// establish page reference
		this._page = inPage;
		var n = inPage.name, o = (inPreviousPage || 0).name;
		// clean up previous reference
		if (o) {
		    // delete window[o]; Kana reported problems with this in IE so replacing with setting it to undefined
		    window[o] = undefined;
		    delete this[o];
		}
		window[n] = this[n] = this._page;
		// change callback / event
		if (this.pageLoadedDeferred)
			this.pageLoadedDeferred.callback({page: inPage, previousPage: inPreviousPage});

            // Insures only the main page gets the keydown events unless end user hacks their own
	    this.connect(document, "keydown", inPage, "keydown");

		this.onPageChanged(inPage, inPreviousPage);
	},
	loadPage: function(inName) {
            this._pageName = inName;
		//this._pageLoader.unloadSupport();
		try 
		{
			this._pageLoader.loadPage(inName, inName.toLowerCase());
		}
		catch (e)
		{
			// do nothing
		  if (djConfig.isDebug)
		    console.error("loadPage error: " + e);
		}
		finally 
		{
			this.hideLoadingIndicator();
		}
	},
        // Provided for use in debugging. Note that when we do a better job of caching pages from server, we will need to deallocate them in this call
        forceReloadPage: function() {
            this.loadPage(this._pageName);
        },
	onPageChanged: function(inNewPage, inPreviousPage) {
	},
        getFullVersionNumber: function() {
	    return this.projectVersion + "." + this.projectSubVersion;
	},
        alert: function(inText, nonmodal) {
	    nonmodal = Boolean(nonmodal);
	    this.alertDialog.setUserPrompt(inText);
	    this.alertDialog.setModal(!nonmodal);
	    this.alertDialog.show();
	},

        confirmOKFunc: null,
        confirmCancelFunc: null,
    confirm: function(inText, nonmodal, onOKFunc, onCancelFunc, optionalOKText,optionalCancelText, noshow) {
            if (!this.confirmDialog) {
	        this.confirmDialog = new wm.GenericDialog({name: "confirmDialog",
						           owner: this,
						           noEscape: false,
						           width: "350px",
						           height: "180px",
						           button1Caption: "OK",
						           button1Close: true,
						           button2Caption: "Cancel",
						           button2Close: true,
						           userPrompt: "confirm..."});
                this.confirmDialog.domNode.style.zIndex = 50;
                this.confirmDialog.connect(this.confirmDialog, "onButton1Click", this,"confirmDialogOKClick");
                this.confirmDialog.connect(this.confirmDialog, "onButton2Click", this,"confirmDialogCancelClick");
            }
	    nonmodal = Boolean(nonmodal);
	    this.confirmDialog.setUserPrompt(inText);
	    this.confirmDialog.setModal(!nonmodal);
            this.confirmDialog.setShowInput(false);
	    this.confirmDialog.setTitle("Confirm..."),
            this.confirmOKFunc = onOKFunc;
            this.confirmCancelFunc = onCancelFunc;
            this.confirmDialog.setButton1Caption(optionalOKText || "OK");
            this.confirmDialog.setButton2Caption(optionalCancelText || "Cancel");
            if (!noshow)
	        this.confirmDialog.show();
        },
    prompt: function(inText, inDefaultValue, onOKFunc, onCancelFunc, optionalOKText,optionalCancelText) {
        this.confirm(inText, false, onOKFunc, onCancelFunc, optionalOKText, optionalCancelText, true);
        this.confirmDialog.setShowInput(true);
	    this.confirmDialog.setTitle("Prompt..."),
        this.confirmDialog.setInputDefaultValue(inDefaultValue || "");
        this.confirmDialog.show();
    },
    confirmDialogOKClick: function() {
        if (this.confirmDialog.showInput) {
            var val = this.confirmDialog.getInputDataValue();
            if (!val)
                return this.confirmDialogCancelClick();
            else if (this.confirmOKFunc)
                this.confirmOKFunc(val);
        } else {
            if (this.confirmOKFunc)
                this.confirmOKFunc();
        }
    },
    confirmDialogCancelClick: function() {
        if (this.confirmCancelFunc)
            this.confirmCancelFunc();
    },
    toastWarning: function(inMsg) {
        this.toastDialog.showToast(inMsg, 8000, "Warning");
    },
    toastSuccess: function(inMsg) {
        this.toastDialog.showToast(inMsg, 5000, "Success");
    },
    createMinifiedDialogPanel: function() {
	this.wmMinifiedDialogPanel = new wm.Panel({name: "wmMinifiedDialogPanel", width: this._page.root.bounds.w + "px", height: "25px", border: "2,0,0,0", padding: "2", autoScroll: true, verticalAlign: "top", horizontalAlign: "left", layoutKind: "left-to-right"});
	document.body.appendChild(this.wmMinifiedDialogPanel.domNode);
	this.wmMinifiedDialogPanel.subscribe("window-resize", this, "resizeMinifiedDialogPanel");
	this.resizeMinifiedDialogPanel();
    },
    createMinifiedDialogLabel: function(title) {
	var l = new wm.Button({caption: title, parent: app.wmMinifiedDialogPanel, owner: this, width: "100px", height: "100%", margin: "0", padding: "0"});
	app.wmMinifiedDialogPanel.show();
	return l;
    },
    removeMinifiedDialogLabel: function(minifiedLabel) {
	minifiedLabel.destroy();
	this.wmMinifiedDialogPanel.setShowing(Boolean(this.wmMinifiedDialogPanel.c$.length));
    },
    resizeMinifiedDialogPanel: function() {
	var b = {l: 0,
		 t: this._page.root.bounds.h - this.wmMinifiedDialogPanel.bounds.h,
		 w: this._page.root.bounds.w,
		 h: 25};
	this.wmMinifiedDialogPanel.setBounds(b);
	this.wmMinifiedDialogPanel.renderBounds();
    }
});

wm.Application.extend({
    firstThemeChange: true,
    set_theme: function(inTheme) {
        if (this.firstThemeChange) {
            app.confirm("Sometimes data can be lost when changing themes.  Do you want to save your project before changing themes?", true,
			dojo.hitch(this, function() {
			    studio.project.saveProject();
			    this.firstThemeChange = false;
			    this.setTheme(inTheme);
			}),
			dojo.hitch(this, function() {
			    this.firstThemeChange = false;
			    this.setTheme(inTheme);
			}),
			"Save and Change",
			"Change Only");

	} else {
	    this.setTheme(inTheme);
	}

    },
	write: function(inIndent) {
	    var props = dojo.toJson(this.writeProps(),true);
	    props = props.substring(1,props.length-2);


	    var compsArray = this.writeComponents(inIndent);

	    /* We should always put wm.TypeDefinitions before all other components as those components may 
	     * depend upon the type being defined.
	     */
	    compsArray = compsArray.sort(function(a,b) {
		var alist = a.match(/^(.*?)\:\s*\[\"(.*)?\"/);
		var blist = b.match(/^(.*?)\:\s*\[\"(.*)?\"/);		
		if (alist[2] == "wm.TypeDefinition" && blist[2] == "wm.TypeDefinition")
		    return (alist[1] <= blist[1]) ? -1 : 1;
		else if (alist[2] == "wm.TypeDefinition")
		    return -1;
		else if (blist[2] == "wm.TypeDefinition")
		    return 1;
		else
		    return (alist[1] <= blist[1]) ? -1 : 1;
	    });

	    var comps = compsArray.join(", " + sourcer_nl);
	
	    var customsrc = String(studio.getAppScript()).trim() || studio.project.projectName + ".extend({\n\n\t" + terminus + "\n});";
	    var src = 'dojo.declare("' + this.declaredClass + '", wm.Application, {' +
		props + ",\n\t" + 
		    '"widgets": {\n' +  (comps || "") + '\n\t},\n\t' +
		terminus + "\n});\n\n" + // terminus is defined in events.js
		customsrc;

	    return src;
	},
    setToastPosition: function(inPosition) {
        this.toastPosition = inPosition.replace(/top/, "t").replace(/bottom/,"b").replace(/left/,"l").replace(/right/,"r").replace(/center/,"c").replace(/ /,"");
    },
    makePropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "main":
	    return new wm.propEdit.PagesSelect({component: this, name: inName, value: inValue, currentPageOK: true});
	case "theme":
            var options = [];
            var data = studio.themesListVar.getData();
            dojo.forEach(data, function(item) {options.push(item.dataValue);});
	    return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: options});
        case "toastPosition":
            inValue = inValue.replace(/^c/, "center ").replace(/^t/, "top ").replace(/^b/, "bottom ").replace(/l$/, "left").replace(/r$/, "right").replace(/c$/, "center");
            return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: ["top left", "top center", "top right", "center left", "center center", "center right", "bottom left", "bottom center", "bottom right"]});
	}
	return this.inherited(arguments);
    },
    setMain: function(inMain) {
	this.main = inMain;
	studio.setProjectMainPage(inMain);
    },
    incSubversionNumber: function() {
	if (dojo.isString(this.projectSubVersion)) {
	    if (parseInt(this.projectSubVersion) + "" == this.projectSubVersion)
		this.projectSubVersion = parseInt(this.projectSubVersion) + 1;
	    else {
		var result = this.projectSubVersion.match(/\d+$/);
		if (result) {
		    this.projectSubVersion = this.projectSubVersion.replace(/\d+$/, "");
		    result = parseInt(result[0]) + 1;
		    this.projectSubVersion += result;
		} else {
		    this.projectSubVersion += "0";
		}
	    }
	} else
	    this.projectSubVersion++;
    }
});
wm.Object.extendSchema(wm.Application, {
    name: {ignore: 1}, // at some point, we might provide this as a way to rename the project... but renaming is really a server side op, so requires confirmation. 
    main: {shortname: "mainPageName"},
    promptChromeFrame: {shorname: "chromeFrame (NA)"},
    theme: {type: "string"},
    //IERoundedCorners: {type: "boolean"},
    studioVersion: {writeonly: true, type: "string"},
    projectVersion: {type: "string"},
    projectSubVersion: {type: "string"},
    firstThemeChange: {ignore: true},
    documentation: {ignore: true},
    generateDocumentation: {ignore: true}
});


wm.Application.themePrototypeData = {};
wm.Application.themeData = {};			    