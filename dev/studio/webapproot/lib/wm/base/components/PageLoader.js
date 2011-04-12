/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.components.PageLoader");

wm.load = function(inFile, allowCache) {
    if (djConfig.isDebug && !dojo.isFF) {
	console.info("wm.load: " + inFile);
    }
	
    return dojo.xhrGet({url: inFile, sync: true, preventCache: !allowCache}).results[0];
}

// this function will load script file on the fly and uses dojo method to this.
// if there's an error or any problem it returns false else returns true.
// Benefits of using this is that you dont have to do an eval on the js file
// as it is required for wm.load() function.
// And you dont have to put this in try catch block either since that is taken care of.
wm.dojoScriptLoader = function(uri){
	try{
		dojo._loadUri(uri);
	}catch(e){
		console.error(e);
		return false; // Boolean
	}
}

wm.gzScriptLoader = function(name){
	try{
		var path = 'resources/gzipped/';
		dojo._loadUri(path + name.replace(/[.]/g, '/') + '.js');
	}catch(e){
		console.error('error while loading gzipped file ', e);
		return false; // Boolean
	}
}

dojo.declare("wm.PageLoader", wm.Component, {
	init: function() {
		this.randomNum = new Date().valueOf();
		this.inherited(arguments);
		this._pageConnections = [];
		this.pageProps = {};
		this.cssLoader = new wm.CssLoader({owner: this, relativeUrl: false});
		this.htmlLoader = new wm.HtmlLoader({owner: this, relativeUrl: false});
	},
	// dojo.connect args without source object (first) argument.
	pageConnect: function() {
		var ctor = this.getPageCtor();
		if (ctor) {
			var args = [ctor.prototype].concat(dojo._toArray(arguments));
			this._pageConnections.push(dojo.connect.apply(dojo, args));
		}
	},
	_disconnectPage: function() {
		dojo.forEach(this._pageConnections, dojo.disconnect);
	},
	getPageCtor: function() {
		return dojo.getObject(this.className || "");
	},
	loadController: function(inName, inPath) {
		var ctor = dojo.getObject(inName);
		if (!ctor) {
			wm.dojoScriptLoader(inPath + ".js?dojo.preventCache="+ new Date().valueOf());
		        ctor = dojo.getObject(inName);
                }
                if (!ctor) {
		    if (!wm.disablePageLoadingToast)
			app.toastError(wm.getDictionaryItem("wm.Page.PAGE_ERRORS", {name: inName}));
                    console.error("Error parsing " + inPath + ".js");
                    this.onError("Error parsing " + inPath + ".js"); // if you localize onError, then developers can't do tests on the return value
                    ctor = dojo.declare(inName, wm.Page); // so at least we can display widgets.js
		}
		return ctor;
	},
	loadSupport: function(inCtor, inPath) {
		if (!inCtor._supported) {
		    this.cssLoader.setUrl(inPath + ".css");
			inCtor.css = this.cssLoader.css;
			this.htmlLoader.setUrl(inPath + ".html");
			inCtor.html = this.htmlLoader.html;
			inCtor.html = inCtor.css = "";
			
			// We do not propertly cache the widgets.js file after its been loaded... 
			// we delete it from memory.  But dojoScriptLoader assumes we keep it in memory and refuses to reload it.
			// By deleting it from its list of loaded urls, it should always reload.
			delete dojo._loadedUrls[inPath + ".widgets.js"];
			wm.dojoScriptLoader(inPath + ".widgets.js?rand=" + new Date().valueOf());
			inCtor._supported = true;
		}
	},
	unloadSupport: function(ctor) {
		//this.cssLoader.clearCss();
		//this.htmlLoader.clearHtml();
		if (!ctor)
			ctor = this.getPageCtor();
		if (ctor) {
			ctor.css = ctor.html = "";
			ctor._supported = false;
		}
	},
	loadPageCode: function(inName) {
		//console.info('this.getpath(): ' + this.getPath());		//console.info('wm.pagesFolder: ' + wm.pagesFolder);
		
		var path = this.getPath() + wm.pagesFolder + inName + "/" + inName;
		var ctor = this.loadController(inName, path);
		if (ctor)
			this.loadSupport(ctor, path);
		return ctor;
	},
        loadPage: function(inClassName, inName) {
	    inName = inName || inClassName;
	    if (!inName) {
	        wm.logging && console.debug("Invalid page name. Must load a valid page.");
	        return;
	    }

	    this.previousPage = this.page;
	    this.previousClassName = this.className;
	    this.className = inClassName;
            try {
	        var ctor = this.loadPageCode(inClassName);
	        if (ctor) {
		    this.onBeforeCreatePage();
		    this.createPage(ctor, inName);
		    this.pageChanged();
		    this.unloadSupport(ctor);
	        } else {
		    console.error("Page not found:", inClassName);
                    this.onError("Page not found:" + inClassName);// if you localize onError, then developers can't do tests on the return value
                }
                if (!this.page || !this.page.root) {
		    console.error("Page not found:", inClassName);
                    this.onError("Page not loaded:" + inClassName);// if you localize onError, then developers can't do tests on the return value
                }
	    } catch(e) { 
		console.error("Page not found:", inClassName);
                this.onError(e);
            }

        },
        onError: function(inErrorOrMessage) {},
	createPage: function(inCtor, inName) {
		var props = dojo.mixin({name: inName, owner: this.owner, domNode: this.domNode, isRelativePositioned: this.isRelativePositioned}, this.pageProps || {});
		this.page = new inCtor(props);
	},
	destroyPage: function(inPage) {
		this._disconnectPage();
		if (inPage)
			wm.fire(inPage, "destroy");
	},
	destroy: function(){
		this.destroyPage();
		delete this.cssLoader;
		delete this.htmlLoader;
		this.inherited(arguments);
		if (this.domNode)
		{
			dojo.destroy(this.domNode);
			this.domNode = null;
		}
	},
	pageChanged: function() {
		this.onPageChanged(this.page, this.previousPage);
		if (this.previousPage) {
			this.destroyPage(this.previousPage);
			delete this.previousPage;
			
			// since we are deleting previous page, we should also mark '_supported = false' because 
			// while deleting previous page we are deleting all html nodes too. 
			if (this.previousClassName)
			{
				try
				{
				var preObj = dojo.getObject(this.previousClassName);
				preObj._supported = false;
				}
				catch(e)
				{
					// do nothing.
				}
			}
		}
	},
	onBeforeCreatePage: function() {
	},
	onPageChanged: function(inNewPage, inPreviousPage) {
	}
});

