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


/* Don't touch djConfig.locale if the user isn't overriding its behavior via the URL; leave it to system default behavior */
    try {
if (location.search.indexOf("dojo.locale=") != -1) {
    djConfig.locale = location.search.indexOf("dojo.locale=") + "dojo.locale=".length; // avoid unlocalized variables    
    djConfig.locale = location.search.substr(djConfig.locale);
    if (djConfig.locale.indexOf("&") != -1) {
	djConfig.locale = djConfig.locale.substring(0, djConfig.locale.indexOf("&"));
    }
} else if (wm.preferredLanguage) {
    djConfig.locale = wm.preferredLanguage.toLowerCase(); // wm.language is provided so that developers can override wm.localeString by putting it in config.js
} else if (wm.localeString) {
    djConfig.locale = wm.localeString.toLowerCase(); // wm.localeString is added to config.js by FileController.java using the "accept-language" header.
}
    } catch(e) {}
wm = window["wm"] || {};
wm.version = '6.4.3RC';

if (location.search.match(/(\?|\&)wmmobile=(.)/)) {
    wm.device = location.search.match(/(\?|\&)wmmobile=(.*)\b/)[2] || "desktop";
    wm.isMobile = wm.device != "desktop";
} else {
    wm.isMobile = navigator.userAgent.match(/mobile|android/i);
    if (!wm.isMobile) {
	wm.device = "desktop";
    } else {
	wm.device =  (window.screen && (window.screen.width > 450 || window.screen.height > 450)) ? "tablet" : "phone";
    }
}

if (location.search.match(/(\?|\&)wmdevicesize=(\d+)/)) {
    wm.deviceSize = location.search.match(/(\?|\&)wmdevicesize=(\d+)/)[2];
}


// loading via append element
wm.createElement = function(inTag, inAttrs) {
	var tag = document.createElement(inTag);
	for (var i in inAttrs) {
		if (!(0)[i])
			tag[i] = inAttrs[i];
	}
	return tag;
};

wm.headAppend = function(inElement) {
	var head= document.getElementsByTagName("head")[0];
	head.appendChild(inElement);
};

// loading via document.write
wm.tags = {
	js: [ '<scrip', 't type="text/javascript" src="', '', '"></scrip', 't>' ],
	css: [ '<link', ' rel="stylesheet" href="', '', '" />' ]
};

wm.writeTag = function(inTag, inUrl) {
	inTag[2] = inUrl;
	document.write(inTag.join(""));
};

wm.writeJsTag = function(inUrl) {
	wm.writeTag(wm.tags.js, inUrl);
};

wm.writeCssTag = function(inUrl) {
	wm.writeTag(wm.tags.css, inUrl);
};

// load JS
wm.loadScript = function(inUrl, inPreferHeadLoad) {
	// FIXME: FF 3 appears to load script tags appended to head asynchronously 
	// and potentially after dojo.addOnLoad is fired. Therefore not using this method for FF3.
	// NOTE: argh! FF3 requires head mode for files that rely on script tag inspection (EditArea)
	if (wm.isMoz && (wm.isFF < 3 || inPreferHeadLoad))
		wm.headAppend(wm.createElement("script", { type: "text/javascript", src: inUrl }));
	else
		wm.writeJsTag(inUrl);
};

// start up
wm.showLoading = function() {
	var e = wm.createElement("div", {
		id: "_wm_loading",
		innerHTML: '<div style="position: absolute; top: 40%; left: 40%;"><img alt="loading" style="vertical-align: middle" src="images/loadingThrobber.gif" />&nbsp;Loading...</div>'
	});
	e.style.cssText = "position: absolute; zIndex: 100; width: 80%; height: 80%;"
	document.body.appendChild(e);
};

// library loading (need Dojo to execute these)
wm.buildLibPath = function(inLib) {
	var n = inLib.pop();
	return dojo.moduleUrl(inLib.join(".")) + n;
};

wm.loadScripts = function(inUrls) {
	dojo.forEach(inUrls, function(url) {
		wm.loadScript(url);
	});
};

wm.loadLib = function(inLib) {
	var split = (inLib || "").split(".");
	var tail = split[split.length-1];
	if (split[0] == "css") {
		split.shift();
		wm.writeCssTag(wm.buildLibPath(split) + ".css");
	} else if (djConfig.debugBoot && (tail != "manifest")) {
		wm.loadScript(wm.buildLibPath(split) + ".js");
	} else {
		dojo.require(inLib, true);
	}
};

wm.loadDojoModules = function(inLib) {
	var split = (inLib || "").split(".");
	var tail = split[split.length-1];
	if (split[0] == "css") {
		split.shift();
		wm.writeCssTag(wm.buildLibPath(split) + ".css");
	} else {
		dojo.require(inLib, true);
	}
};

wm.loadLibs = function(inLibs) {
	dojo.forEach(inLibs, function(l) { if (l) wm.loadLib(l)});
};

wm.registerPaths = function() {
	// variable argument list of arrays of parameters to registerModulePath
	for (var i=0, a; a=arguments[i]; i++) {
		dojo.registerModulePath.apply(dojo, a);
	}
}

wm.registerPackage = registerPackage = function() {
	// stub
};

/* Load theme before loading page */
if (!djConfig.isDebug) {
    wm.writeCssTag(wm.relativeLibPath + "/dojo/dijit/themes/tundra/" + (wm.isMobile ? "mtheme.css" : "t.css"));
}

if (window["wmThemeUrl"]) {
    wm.writeCssTag(wm.device == "desktop" ? wmThemeUrl : wmThemeUrl.replace(/theme\.css/,"mtheme.css"));
}

(function(){
        if (window["wmChromeFramePath"]) return;
	// early browser sniff
	var n = navigator, ua = n.userAgent, av = n.appVersion;
	wm.isMoz = (ua.indexOf("Gecko")>=0 && av.indexOf("WebKit")<0 && av.indexOf("Safari")<0 && av.indexOf("Konqueror")<0);
	wm.isFF = parseFloat(ua.split("Firefox/")[1]);
	// force cache revalidation in debug mode
	// FIXME: test on multiple platforms
	if (djConfig.debugBoot) {
		wm.headAppend(wm.createElement("meta", { "httpEquiv": "cache-control", content: "must-revalidate" }));
	}
	// bootstrap dojo
	//var d = djConfig.debugBoot ? "dojo/dojo/dojo.js" : "build/dojo.js";
	var d = djConfig.debugBoot ? "dojo/dojo/dojo.js" : "dojo/dojo/dojo_build.js";
	djConfig.baseUrl = wm.relativeLibPath + "dojo/dojo/";
	
	wm.writeJsTag(wm.relativeLibPath + d);
})();
