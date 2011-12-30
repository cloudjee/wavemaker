/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.components.Application");
dojo.require("wm.base.Component");

wm.componentLoaders = wm.componentLoaders || {};

wm.registerComponentLoader = function(inType, inLoader){
	wm.componentLoaders[inType] = inLoader;
};

dojo.declare("wm.Application", wm.Component, {
    i18n: false,
	main: "Main",
        disableDirtyEditorTracking: false,
        deletionDisabled: 1,
        projectSubVersion: "Alpha",
        projectVersion: 1,
        studioVersion: "",
        dialogAnimationTime: 350,
        theme: "wm_notheme",
        toastPosition: "br",
        _lastTheme: "",
    //IERoundedCorners: false,
	init: function() {
	    if (wm.isMobile) {
		dojo.addClass(document.body, "wmmobile")
	    }
	    dojo["require"]("common." + wm.version.replace(/[^a-zA-Z0-9]/g,"") + "_patches",true);
		app = wm.application = wm.application || this;
		this.connectList = [];
		this.app = this;
	        if (this.i18n) {
		    try {
			dojo["requireLocalization"]("language", "app");
			this._i18nDictionary = dojo.i18n.getLocalization("language", "app");
		    } catch(e){}
		}

	    if (wm.branding) {
		this._brandingDictionary = dojo.fromJson(wm.load("branding/" + wm.branding + "/branding.js"));
		var style = document.createElement("link");
		style.type = "text/css";
		style.rel = "stylesheet";
		style.href = "branding/" + wm.branding + "/branding.css";
		document.getElementsByTagName("head")[0].appendChild(style);	
	    }
		this.inherited(arguments);
		wm.typeManager.initTypes();

	    this._isDesignLoaded = (window["studio"] && this != app);

	    /* There are times when we need to access studio.application before we've finished initializing the app in design mode;
	     * this gives us early access to it without mucking up existing logic for when its set/cleared
	     */
	    if (this._isDesignLoaded) {
		studio._application = this;
	    }

	    /* All Apps get a .WMApp parent class except for studio; this gives us extra hooks for styling apps without touching studio */
	    var node = this._isDesignLoaded ? null : document.body.parentNode;
	    if (node) {
		dojo.addClass(node, "WMApp");
	    }

	        var themematch = window.location.search.match(/theme\=(.*?)\&/) ||
		                 window.location.search.match(/theme\=(.*?)$/);

	        this.setTheme(themematch ? themematch[1] : this.theme, true);
	        if (dojo.isIE && dojo.isIE < 8) this.dialogAnimationTime = 0;

		this.components = {};
	        this.createPageContainer();

	    if (!this._isDesignLoaded) {
		if (djConfig.isDebug && !this.debugDialog) 
		    this.createDebugDialog();
		
		this.pageDialog = new wm.PageDialog({name: "pageDialog", owner: this});
		this.toastDialog = new wm.Toast({name: "toastDialog", owner: this});
	    }
	        //this.createPageLoader();


	        if (this._touchEnabled === undefined)
		    this._touchEnabled = navigator.userAgent.match(/AppleWebKit/) &&
		navigator.userAgent.match(/Mobile/);
	    //this.scrim = new wm.Scrim();
		this.loadComponents(this.constructor.widgets || this.widgets);

	    this._keys = {
		8:'BACKSPACE',
		9:'TAB',
		13:'ENTER',
		16:'SHIFT',
		17:'CTRL',
		18:'ALT',
		19:'BREAK',
		20:'CAPS',
		27:'ESC',
		33:'PAGE UP',
		34:'PAGE DOWN',
		35:'END',
		36:'HOME',
		37:'LEFT',
		38:'UP',
		39:'RIGHT',
		40:'DOWN',
		45:'INSERT',
		46:'DELETE',
		48:'0',
		49:'1',
		50:'2',
		51:'3',
		52:'4',
		53:'5',
		54:'6',
		55:'7',
		56:'8',
		57:'9',
		65:'a',
		66:'b',
		67:'c',
		68:'d',
		69:'e',
		70:'f',
		71:'g',
		72:'h',
		73:'i',
		74:'j',
		75:'k',
		76:'l',
		77:'m',
		78:'n',
		79:'o',
		80:'p',
		81:'q',
		82:'r',
		83:'s',
		84:'t',
		85:'u',
		86:'v',
		87:'w',
		88:'x',
		89:'y',
		90:'z',
		91:'LEFT WINDOW',
		92:'RIGHT WINDOW',
		93:'SELECT',
		96:'NUMPAD 0',
		97:'NUMPAD 1',
		98:'NUMPAD 2',
		99:'NUMPAD 3',
		100:'NUMPAD 4',
		101:'NUMPAD 5',
		102:'NUMPAD 6',
		103:'NUMPAD 7',
		104:'NUMPAD 8',
		105:'NUMPAD 9',
		106:'NUMPAD *',
		107:'NUMPAD +',
		108:'NUMPAD ENTER',
		109:'NUMPAD -',
		110:'NUMPAD .',
		111:'NUMPAD /',
		112:'F1',
		113:'F2',
		114:'F3',
		115:'F4',
		116:'F5',
		117:'F6',
		118:'F7',
		119:'F8',
		120:'F9',
		121:'F10',
		122:'F11',
		123:'F12',
		144:'NUMLOCK',
		145:'SCROLLLOCK',
		186:';',
		187:'=',
		188:',',
		189:'-',
		190:'.',
		191:'/',
		192:'`',
		219:'[',
		220:"\\",
		221:']',
		222:'"'};
	},
    createDebugDialog: function() {
		dojo.require("wm.base.debug.Dialog");
		dojo.require("wm.base.components.JsonRpcService");
	if (!this.debugDialog) {
	    this.debugDialog = new wm.debug.Dialog({owner: this, 
						       name: "debugDialog",
						       width: "700px", 
						       height: "400px",
						       corner: "cr"});
	}
    },
    setTheme: function(inTheme, isInit, optionalCss, optionalPrototype, noRegen, forceUpdate) {
	    var node = this._isDesignLoaded ? studio.designer.domNode : document.body;
	    dojo.removeClass(node, this.theme);
            this._lastTheme = this.theme;
	    this.theme = inTheme;
	    dojo.addClass(node, this.theme);

	var themematch = window.location.search.match(/theme\=(.*?)\&/) ||
	    window.location.search.match(/theme\=(.*?)$/);

	    if (this._isDesignLoaded || !isInit || themematch) {
		try {
		    this.loadThemeCss(this.theme, this._isDesignLoaded, optionalCss);
		    // write before we change the prototype so defaults are left blank
		    if (this._isDesignLoaded && !isInit) {
			this._themeChanged = true;
			this.cacheWidgets();
		    }
		    this.loadThemePrototype(this.theme, optionalPrototype);
		    if (this._isDesignLoaded && !isInit && !noRegen) {
			this.useWidgetCache();
		    }
		} catch(e) {
		    if (inTheme != "wm_notheme")  {
			this.setTheme("wm_notheme", isInit, optionalCss, optionalPrototype, noRegen);
			app.alert(wm.getDictionaryItem("wm.Application.ALERT_MISSING_THEME", {name: inTheme}));
		    } else  {
			app.alert(wm.getDictionaryItem("wm.Application.ALERT_MISSING_NOTHEME", {name: inTheme}));
		    }
		return;
		}
	    } else {
		    this.loadThemePrototype(this.theme, optionalPrototype);
	    }

    },
            // don't regenerate over and over; as long as the user remains in the theme designer,
            // widgetsjs shouldn't change except as prototypes change, 
            // and we don't want the design to change each time the prototype border changes...
    cacheWidgets: function() {
        if (!this._widgetsjs) {
            var dialogs = "";
            var components = studio.page.components;
            for (c in components) {
                if (components[c] instanceof wm.Dialog) {
                    dialogs += components[c].write("") + ",";
                }
            }
	        var widgetsjs = dojo.fromJson("{"+ dialogs + studio.page.root.write("") + "}");
            this._widgetsjs = widgetsjs;            
        }
    },
    useWidgetCache: function() {
	studio.page.root.destroy();
        delete studio.page.root;
        var components = studio.page.components;
        for (c in components) {
            if (components[c] instanceof wm.Dialog) {
                components[c].destroy();
            }
        }

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


	/* Localization of default properties */
	var ctorData = wm.locale.props[declaredClass];
	if (ctorData) {
	    for (var j in ctorData) {
                ctor.prototype[j] = ctorData[j];
		if (optionalWidget) optionalWidget[j] = ctorData[j];
            }
	}
	/* End localization of default properties */

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
                if (optionalCss) {
                    themecss = optionalCss;
                } else {
		    var results = dojo.xhrGet({url:path, sync:true, preventCache:false}).results;
		    if (results[1])
		        throw results[1];
		    themecss = results[0] || "";

		    var results = dojo.xhrGet({url:path.replace(/theme\.css/, "custom.css"), sync:true, preventCache:false}).results;
		    if (!results[1]) {
			themecss += results[0] || "";
		    }
                }
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
/*
		if (this._pageLoader)
		{
			this._pageLoader.destroy();
			this._pageLoader = null;
		}	
		*/
	    if (this.pageContainer) {
		this.pageContainer.destroy();
		this.pageContainer = null;
	    }
		if (this.domNode)
		{
			dojo.destroy(this.domNode);
			this.domNode = null;
		}		
		
                if (this.pageDialog)
		    this.pageDialog.destroy();
		delete this.pageDialog;
                if (this.scrim)
		    this.scrim.destroy();
		delete this.scrim;
		delete this.app;
		//dojo.publish('applicationDestroyed',[]);
	},
	createPageContainer: function() {
	    if (!this._isDesignLoaded) {
		this.appRoot = new wm.AppRoot({owner: this, name: "appRoot"});
		this.pageContainer = new wm.PageContainer({owner: this, parent: this.appRoot, width: "100%", height: "100%", getRuntimeId: function() {return ""}});
		this.connectList[this.connectList.length] = this.connect(this.pageContainer._pageLoader, "onBeforeCreatePage", this, "beforeCreatePage");
		this.connectList[this.connectList.length] = this.connect(this.pageContainer._pageLoader, "onPageChanged", this, "pageChanged");
	    }
	},
/*
	createPageLoader: function() {
		this._pageLoader = new wm.PageLoader({owner: this});
		this.connectList[this.connectList.length] = this.connect(this._pageLoader, "onBeforeCreatePage", this, "beforeCreatePage");
		this.connectList[this.connectList.length] = this.connect(this._pageLoader, "onPageChanged", this, "pageChanged");
	},
	*/
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

	//The following lines are not being used now.  They may be used in the future to differenciate requests from Studio from
	//requests deployed application.
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
	    this.appRoot.reflow();
	},
	reflowParent: function() {
		this.reflow();
	},
    loadComponent: function(inName, inParent, inType, inProps, inEvents, inChildren, isSecond) {
	return inParent.createComponent(inName, inType, inProps, inEvents, inChildren, this);
    },
	hideLoadingIndicator: function() {
	    var l = dojo.byId("_wm_loading");
	    if (l)
		dojo._destroyElement(l);
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
		this.appRoot.domNode = this.domNode = dojo.byId(this.domNode) || document.body;
	        this.reflow()
	    /* WM-2794: ENTER key in a text input causes focus to move to first button and fire it; make sure its a button that does nothing; only certain this is an issue in IE 8 
	    if (dojo.isIE <= 8) {
		var button = document.createElement("BUTTON");
		button.style.width = "1px";
		button.style.height = "1px";
		this.domNode.appendChild(button);
	    }*/
		this.loadPage(app.main);
	        this.hideLoadingIndicator();
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
		this.pageContainer._pageLoader.pageConnect("start", this, "start");
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
		    this.pageContainer.setPageName(inName);//_pageLoader.loadPage(inName, inName.toLowerCase());
		}
		catch (e)
		{
			// do nothing
		  if (djConfig.isDebug)
		    console.error("loadPage error: " + e);
		}		
	},
        // Provided for use in debugging. Note that when we do a better job of caching pages from server, we will need to deallocate them in this call
        forceReloadPage: function() {
            this.loadPage(this._pageName);
        },
	onPageChanged: function(inNewPage, inPreviousPage) {
	},
    onSessionExpiration: function() {

    },
        getFullVersionNumber: function() {
	    return this.projectVersion + "." + this.projectSubVersion;
	},

    // This sends a synchronous request. I don't like it, but a user calling
    // this expects to get a result.
        getSessionId: function() {
	    if (!this.sessionId) {
		var a = new wm.JsonRpcService({service: "waveMakerService", sync: true});
		a.requestSync("getSessionId", []);
		this.sessionId = a.result;
	    }
	    return this.sessionId;
	},
    echoFile: function(filecontents, filetype, filename) {
	    if (!this.echoFileService) {
		this.echoFileService =
		    new wm.ServiceVariable({owner: app, 
					    name: "echoFileService", 
					    downloadFile: true, 
					    service: "waveMakerService", 
					    operation: "echo"})
		this.echoFileService.input.setType("");
		wm.typeManager.addType("echoInputs", 
				       {internal: false, 
					fields: {contents: {type: "java.lang.String"}, 
						 fileType: {type: "java.lang.String"},
						 fileName: {type: "java.lang.String"}}
				       });        
		this.echoFileService.input.setType("echoInputs");
	    }
	
	this.echoFileService.input.setData({contents: filecontents, fileType: filetype,fileName: filename});
	this.echoFileService.update();
    },
        alert: function(inText, nonmodal) {
            if (!this.alertDialog) {
		    this.alertDialog = new wm.GenericDialog({name: "alertDialog",
                                                             _noAnimation: true,
							     owner: this,
							     title: wm.getDictionaryItem("wm.Application.TITLE_ALERT"),
							     noEscape: false,
							     width: "400px",
							     height: "180px",
							     button1Caption: wm.getDictionaryItem("wm.Application.CAPTION_ALERT_OK"),
							     button1Close: true,
							     userPrompt: ""});
                this.alertDialog.domNode.style.zIndex = 45;

            }

	    if (this.alertDialog.width != "400px") this.alertDialog.setWidth("400px"); // reset any width changes made by users
	    if (dojo.isObject(inText))
		inText = inText.toString();
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
                                                           _noAnimation: true,
						           owner: this,
						           noEscape: false,
						           width: "350px",
						           height: "180px",
							   button1Caption: wm.getDictionaryItem("wm.Application.CAPTION_CONFIRM_OK"),
						           button1Close: true,
						           button2Caption: wm.getDictionaryItem("wm.Application.CAPTION_CONFIRM_CANCEL"),
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
	    this.confirmDialog.setTitle( wm.getDictionaryItem("wm.Application.TITLE_CONFIRM"));
            this.confirmOKFunc = onOKFunc;
            this.confirmCancelFunc = onCancelFunc;
            this.confirmDialog.setButton1Caption(optionalOKText || wm.getDictionaryItem("wm.Application.CAPTION_CONFIRM_OK"));
            this.confirmDialog.setButton2Caption(optionalCancelText || wm.getDictionaryItem("wm.Application.CAPTION_CONFIRM_CANCEL"));
            if (!noshow)
	        this.confirmDialog.show();
        },
    prompt: function(inText, inDefaultValue, onOKFunc, onCancelFunc, optionalOKText,optionalCancelText) {
        this.confirm(inText, false, onOKFunc, onCancelFunc, optionalOKText, optionalCancelText, true);
        this.confirmDialog.setShowInput(true);
	this.confirmDialog.setTitle( wm.getDictionaryItem("wm.Application.TITLE_CONFIRM"));
        this.confirmDialog.setInputDataValue(inDefaultValue || "");
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
    toastError: function(inMsg, optionalDuration) {
        this.toastDialog.showToast(inMsg, optionalDuration || 8000, "Error");
    },
    toastWarning: function(inMsg, optionalDuration) {
        this.toastDialog.showToast(inMsg, optionalDuration || 8000, "Warning");
    },
    toastSuccess: function(inMsg, optionalDuration) {
        this.toastDialog.showToast(inMsg, optionalDuration || 5000, "Success");
    },
    toastInfo: function(inMsg, optionalDuration) {
        this.toastDialog.showToast(inMsg, optionalDuration || 5000, "Info");
    },
    
    createToolTip: function(message, node, event, source) {
	if (!this.toolTipDialog) {
	    this.toolTipDialog = new wm.Dialog({_classes: {domNode: ["AppToolTip"]},
						title: "",
						modal: false,
						width: "350px",
						height: "50px",
						fitToContentHeight: true,
						owner: this,
						corner: "tr",
						_fixPosition: true,
						useContainerWidget: true,
						margin: "0,0,4,4",
						padding: "4"});
	    this.toolTipDialog.containerWidget.destroy();
	    this.toolTipDialog.useContainerWidget = false;
	    delete this.toolTipDialog.containerWidget;
	    delete this.toolTipDialog.containerNode;
	    var html = new wm.Html({owner: this.toolTipDialog,
				    parent: this.toolTipDialog,
				    autoScroll:false,
				    name: "html",
				    width: "100%",
				    height: "100%",
				    margin: "0",
				    padding: "0",
				    autoSizeHeight: true});
	    this.toolTipDialog.html = html;
	}
	this.toolTipDialog.tipOwner = source;
	if (node) {
	    this.toolTipDialog.fixPositionNode = node;
	} else {
	    this.toolTipDialog.fixPositionNode = null;
	    var originalMouseX = this.toolTipDialog.bounds.l = event.mouseX;
	    var originalMouseY = this.toolTipDialog.bounds.t = event.mouseY;
	}
	this.toolTipDialog.html.setHtml();	
	this.toolTipDialog.show();
	this.toolTipDialog._cupdating = true;
	this.toolTipDialog.html.setAutoSizeWidth(false);
	this.toolTipDialog.html.setAutoSizeHeight(false);
	this.toolTipDialog.setFitToContentHeight(false);	    
	this.toolTipDialog.setFitToContentWidth(false);	    
	    this.toolTipDialog.setHeight("25px");
	    this.toolTipDialog.setWidth("350px");
	    this.toolTipDialog.html.setHeight("100%");
	    this.toolTipDialog.html.setWidth("100%");
	this.toolTipDialog._cupdating = false;
	this.toolTipDialog.renderBounds();
	this.toolTipDialog.html.setHtml(message);	
	if (String(message).length < 30) {
	    this.toolTipDialog.html.setAutoSizeWidth(true);
	    this.toolTipDialog.setFitToContentWidth(true);
	} else {
	    this.toolTipDialog.html.setAutoSizeHeight(true);
	    this.toolTipDialog.setFitToContentHeight(true);
	}

	var self = this;
	if (this._testHintConnect)
	    dojo.disconnect(this._testHintConnect);

	    this._testHintConnect = 
		this.connect(window.document.body, "onmousemove", this, function(evt) {
		    if (evt.target ===  this.toolTipDialog.domNode || dojo.isDescendant(evt.target, this.toolTipDialog.domNode)) return;

		    /* If there is a mouse-over node, and the mouse has left the node, dismiss the tooltip */
		    if (node) {
			if (evt.target != node && !dojo.isDescendant(evt.target, node)) {
			    this.hideToolTip();
			}
		    } 

		    /* If there is no node, then just dismiss the tooltip if the mouse moves at least 20px from the location that started this tooltip */
		    else if (Math.abs(evt.clientX-originalMouseX) > 20 ||
			       Math.abs(evt.clientY-originalMouseY) > 20) {
			this.hideToolTip();
		    }
		});


    },
    getToolTip: function() {
	if (this.toolTipDialog)
	    return this.toolTipDialog.userPrompt;
	return "";
    },
    hideToolTip: function() {
	dojo.disconnect(this._testHintConnect);
	delete 	this._testHintConnect;
	this.toolTipDialog.hide();
    },
    createMinifiedDialogPanel: function() {
	var dockHeight = parseInt(parseInt(wm.Button.prototype.height)*0.8);
	dockHeight += 3; // 2 for border, 1 for padding
	this.wmMinifiedDialogPanel = new wm.Panel({name: "wmMinifiedDialogPanel", width: "100%", height: dockHeight + "px", border: "2,0,0,0", padding: "1,0,0,0", autoScroll: false, verticalAlign: "top", horizontalAlign: "left", layoutKind: "left-to-right", owner: this, parent: this.appRoot});
	//document.body.appendChild(this.wmMinifiedDialogPanel.domNode);
	//this.wmMinifiedDialogPanel.subscribe("window-resize", this, "resizeMinifiedDialogPanel");
	//this.resizeMinifiedDialogPanel();
	this.appRoot.reflow();
    },
    createMinifiedDialogLabel: function(title) {
	var l = new wm.Button({caption: title, parent: app.wmMinifiedDialogPanel, owner: this, width: "100px", height: "100%", margin: "0", padding: "0", border:"1"});
	app.wmMinifiedDialogPanel.show();
	return l;
    },
    removeMinifiedDialogLabel: function(minifiedLabel) {
	minifiedLabel.destroy();
	if (this.wmMinifiedDialogPanel) {
	    this.wmMinifiedDialogPanel.setShowing(Boolean(this.wmMinifiedDialogPanel.c$.length));
	}
    },
    resizeMinifiedDialogPanel: function() {
	var b = {l: 0,
		 t: this._page.root.bounds.h - this.wmMinifiedDialogPanel.bounds.h,
		 w: this._page.root.bounds.w,
		 h: 25};
	this.wmMinifiedDialogPanel.setBounds(b);
	this.wmMinifiedDialogPanel.renderBounds();
    },
    createLeftToRightDockingPanel: function() {
	if (!this._leftToRightDockingPanel) {
	    this._leftToRightDockingPanel = new wm.Panel({name: "_leftToRightDockingPanel", width: "100%", height: "100%", border: "0", padding: "", layoutKind: "left-to-right", owner: this, parent: this.appRoot});
	    this.appRoot.moveControl(this._leftToRightDockingPanel, this.appRoot.indexOfControl(this.pageContainer));
	    this.pageContainer.setParent(this._leftToRightDockingPanel);	
	}
    },
    dockDialog: function(inDialog, inEdge) {
	if (inEdge == "l" || inEdge == "r") {
	    this.createLeftToRightDockingPanel();
	}
	var parentPanel;
	var created = false;
	switch(inEdge) {
	case "t":
	    if (this._topDock) {
		parentPanel = this._topDock;
	    } else {
		created = true;
		parentPanel = this._topDock = new wm.Panel({owner: this, name: "_topDock", width: "100%", height: "100px", border: "0", padding: "", layoutKind: "left-to-right", parent: this.appRoot});
		this.appRoot.moveControl(parentPanel,0);
		this._topSplitter = new wm.Splitter({_classes: {domNode: ["docksplitter"]}, owner: this, parent: this.appRoot});
		this.appRoot.moveControl(this._topSplitter,1);
		this._topSplitter.findLayout();
	    }
	    break;
	case "b":
	    if (this._bottomDock) {
		parentPanel = this._bottomDock;
	    } else {
		created = true;
		parentPanel = this._bottomDock = new wm.Panel({owner: this, name: "_bottomDock", width: "100%", height: "100px", border: "0", padding: "", layoutKind: "left-to-right", parent: this.appRoot});
		this._bottomSplitter = new wm.Splitter({_classes: {domNode: ["docksplitter"]}, owner: this, parent: this.appRoot});
		this.appRoot.moveControl(this._bottomSplitter,this.appRoot.c$.length-2);
		this._bottomSplitter.findLayout();
	    }		
	    break;
	case "l":
	    if (this._leftDock) {
		parentPanel = this._leftDock;
	    } else {
		created = true;
		parentPanel = this._leftDock = new wm.Panel({owner: this, name: "_leftDock", width: "150px", height: "100%", border: "0", padding: "", layoutKind: "top-to-bottom", parent: this._leftToRightDockingPanel});
		this._leftToRightDockingPanel.moveControl(parentPanel,0);
		this._leftSplitter = new wm.Splitter({_classes: {domNode: ["docksplitter"]}, owner: this, parent: this._leftToRightDockingPanel});
		this._leftToRightDockingPanel.moveControl(this._leftSplitter,1);
		this._leftSplitter.findLayout();
	    }		
	    break;
	case "r":
	    if (this._rightDock) {
		parentPanel = this._rightDock;
	    } else {
		created = true;
		this._rightSplitter = new wm.Splitter({_classes: {domNode: ["docksplitter"]}, owner: this, parent: this._leftToRightDockingPanel});
		parentPanel = this._rightDock = new wm.Panel({owner: this, name: "_rightDock", width: "150px", height: "100%", border: "0", padding: "", layoutKind: "top-to-bottom", parent: this._leftToRightDockingPanel});

		this._rightSplitter.findLayout();

	    }		
	    break;
	}
	inDialog.setParent(parentPanel);
	switch(inEdge) {
	case "t":
	case "b":
	    if (inDialog.minHeight > parentPanel.bounds.h)
		parentPanel.setHeight(inDialog.minHeight + "px");
	    inDialog.setWidth("100%");
	    break;
	case "l":
	case "r":
	    if (inDialog.minWidth > parentPanel.bounds.w)
		parentPanel.setWidth(inDialog.minWidth + "px");
	    inDialog.setHeight("100%");
	    break;
	}
	if (created) {
	    this.appRoot.reflow();
	} else if (!parentPanel.showing) {
	    parentPanel.show();
	    if (parentPanel == this._topDock)
		this._topSplitter.show();
	    else if (parentPanel == this._bottomDock)
		this._bottomSplitter.show();
	    else if (parentPanel == this._rightDock)
		this._rightSplitter.show();
	    else if (parentPanel == this._leftDock)
		this._leftSplitter.show();

	} else {
	    parentPanel.reflow();
	}
    },
    removeDockedDialog: function(inDialog) {
	var parent = inDialog.parent;
	inDialog.setParent(null);
	if (parent.c$.length == 0) {
	    parent.hide();
	    if (parent == this._topDock)
		this._topSplitter.hide();
	    else if (parent == this._bottomDock)
		this._bottomSplitter.hide();
	    else if (parent == this._rightDock)
		this._rightSplitter.hide();
	    else if (parent == this._leftDock)
		this._leftSplitter.hide();
	}
    },
    getDeviceSize: function() {
	return this.appRoot ? this.appRoot.deviceSize : "1000";
    }
});

wm.Application.themePrototypeData = {};
wm.Application.themeData = {};			    


