/*
 *  Copyright (C) 2008-2013 VMware, Inc. All rights reserved.
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


/* dojo 1.6 upgrade: When running without ?debug, define method fails to get declared as they assume EVERYTHING you need is preloaded.
 * since we don't know everything the user may need, we do not prebuild everything in;  the following is closure compressed version of
 * dojo/_base/_loader/loader.js */
	    if (!djConfig.debugBoot) {
(function(){var b=dojo,j;b.mixin(b,{_loadedModules:{},_inFlightCount:0,_hasResource:{},_modulePrefixes:{dojo:{name:"dojo",value:"."},tests:{name:"tests",value:"tests"}},_moduleHasPrefix:function(a){var c=b._modulePrefixes;return!(!c[a]||!c[a].value&&!c[a].fixed)},_modulePathLocked:function(a){var c=b._modulePrefixes;a=a&&a.replace(/\..*$/,"");return c[a]&&c[a].fixed},_getModulePrefix:function(a){var c=b._modulePrefixes;return b._moduleHasPrefix(a)?c[a].value:a},
_loadedUrls:[],_postLoad:!1,_loaders:[],_unloaders:[],_loadNotifying:!1});dojo._loadPath=function(a,c,d){a=(c&&b._modulePathLocked(c.split(/\./)[0])||"/"==a.charAt(0)||a.match(/^\w+:/)?"":b.baseUrl)+a;try{return j=c,!c?b._loadUri(a,d):b._loadUriAndCheck(a,c,d)}catch(e){return console.error(e),!1}finally{j=null}};dojo._loadUri=function(a,c){if(b._loadedUrls[a])return!0;b._inFlightCount++;var d=b._getText(a,!0);if(d){b._loadedUrls[a]=!0;b._loadedUrls.push(a);d=c?/^define\(/.test(d)?d:"("+d+")":b._scopePrefix+
d+b._scopeSuffix;b.isIE||(d+="\r\n//@ sourceURL="+a);try{var e=b.eval(d)}catch(f){console.info("error while doing an eval on file loaded from "+a),console.info("Error: "+f.message)}c&&c(e)}0==--b._inFlightCount&&(b._postLoad&&b._loaders.length)&&setTimeout(function(){0==b._inFlightCount&&b._callLoaded()},0);return!!d};dojo._loadUriAndCheck=function(a,c,d){var e=!1;try{e=b._loadUri(a,d)}catch(f){console.error("failed loading "+a+" with error: "+f)}return!(!e||!b._loadedModules[c])};dojo.loaded=function(){b._loadNotifying=
!0;b._postLoad=!0;var a=b._loaders;b._loaders=[];for(var c=0;c<a.length;c++)try{a[c]()}catch(d){console.error(d)}b._loadNotifying=!1;b._postLoad&&(0==b._inFlightCount&&a.length)&&b._callLoaded()};dojo.unloaded=function(){for(var a=b._unloaders;a.length;)a.pop()()};b._onto=function(a,c,b){if(b){if(b){var e="string"==typeof b?c[b]:b;a.push(function(){e.call(c)})}}else a.push(c)};dojo.ready=dojo.addOnLoad=function(a,c){b._onto(b._loaders,a,c);b._postLoad&&(0==b._inFlightCount&&!b._loadNotifying)&&b._callLoaded()};
var h=b.config.addOnLoad;if(h)b.addOnLoad[h instanceof Array?"apply":"call"](b,h);dojo._modulesLoaded=function(){b._postLoad||(0<b._inFlightCount?console.warn("files still in flight!"):b._callLoaded())};dojo._callLoaded=function(){"object"==typeof setTimeout||b.config.useXDomain&&b.isOpera?setTimeout(b.isAIR?function(){b.loaded()}:b._scopeName+".loaded();",0):b.loaded()};dojo._getModuleSymbols=function(a){a=a.split(".");for(var c=a.length;0<c;c--){var d=a.slice(0,c).join(".");if(1==c&&!b._moduleHasPrefix(d))a[0]=
"../"+a[0];else{var e=b._getModulePrefix(d);if(e!=d){a.splice(0,c,e);break}}}""===a[0]&&a.shift();return a};dojo._global_omit_module_check=!1;dojo.loadInit=function(a){a()};dojo._loadModule=dojo.require=function(a,c){c=b._global_omit_module_check||c;a=a.replace(/i18n\!/,"");var d=b._loadedModules[a];if(d)return d;var e=b._getModuleSymbols(a).join("/")+".js";if(!b._loadPath(e,!c?a:null)&&!c)throw Error("Could not load '"+a+"'; last tried '"+e+"'");if(!c&&!b._isXDomain&&(d=b._loadedModules[a],!d))throw Error("symbol '"+
a+"' is not defined after loading '"+e+"'");return d};dojo.provide=function(a){a+="";return b._loadedModules[a]=b.getObject(a,!0)};dojo.platformRequire=function(a){a=(a.common||[]).concat(a[b._name]||a["default"]||[]);for(var c=0;c<a.length;c++){var d=a[c];d.constructor==Array?b._loadModule.apply(b,d):b._loadModule(d)}};dojo.requireIf=function(a,c){if(!0===a){for(var d=[],e=1;e<arguments.length;e++)d.push(arguments[e]);b.require.apply(b,d)}};dojo.requireAfterIf=b.requireIf;dojo.registerModulePath=
function(a,c,d){b._modulePrefixes[a]={name:a,value:c,fixed:d}};dojo.requireLocalization=function(a,c,d,e){b.require("dojo.i18n");b.i18n._requireLocalization.apply(b.hostenv,arguments)};var n=/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/,p=/^((([^\[:]+):)?([^@]+)@)?(\[([^\]]+)\]|([^\[:]*))(:([0-9]+))?$/;dojo._Url=function(){for(var a=arguments,c=[a[0]],d=1;d<a.length;d++)if(a[d]){var e=new b._Url(a[d]+""),c=new b._Url(c[0]+"");if(""==e.path&&!e.scheme&&!e.authority&&!e.query)null!=
e.fragment&&(c.fragment=e.fragment),e=c;else if(!e.scheme&&(e.scheme=c.scheme,!e.authority&&(e.authority=c.authority,"/"!=e.path.charAt(0)))){for(var c=(c.path.substring(0,c.path.lastIndexOf("/")+1)+e.path).split("/"),f=0;f<c.length;f++)"."==c[f]?f==c.length-1?c[f]="":(c.splice(f,1),f--):0<f&&(!(1==f&&""==c[0])&&".."==c[f]&&".."!=c[f-1])&&(f==c.length-1?(c.splice(f,1),c[f-1]=""):(c.splice(f-1,2),f-=2));e.path=c.join("/")}c=[];e.scheme&&c.push(e.scheme,":");e.authority&&c.push("//",e.authority);c.push(e.path);
e.query&&c.push("?",e.query);e.fragment&&c.push("#",e.fragment)}this.uri=c.join("");a=this.uri.match(n);this.scheme=a[2]||(a[1]?"":null);this.authority=a[4]||(a[3]?"":null);this.path=a[5];this.query=a[7]||(a[6]?"":null);this.fragment=a[9]||(a[8]?"":null);null!=this.authority&&(a=this.authority.match(p),this.user=a[3]||null,this.password=a[4]||null,this.host=a[6]||a[7],this.port=a[9]||null)};dojo._Url.prototype.toString=function(){return this.uri};dojo.moduleUrl=function(a,c){var d=b._getModuleSymbols(a).join("/");
if(!d&&""!==d)return null;d.lastIndexOf("/")!=d.length-1&&(d+="/");var e=d.indexOf(":");if(!b._modulePathLocked(a)&&"/"!=d.charAt(0)&&(-1==e||e>d.indexOf("/")))d=b.baseUrl+d;return new b._Url(d,c)};define=function(a,c,b){function e(b){if("."===b.charAt(0)){for(b=a.substring(0,a.lastIndexOf("/")+1)+b;c!==b;){var c=b;b=b.replace(/\/[^\/]*\/\.\.\//,"/")}b=b.replace(/\/\.\//g,"/")}return b.replace(/\//g,".")}b||(c?(b=c,c=a):(b=a,c="function"==typeof b?["require","exports","module"].slice(0,b.length):
[]),a=j?j.replace(/\./g,"/"):"anon");var f=a.replace(/\//g,"."),h=dojo.provide(f);if("function"==typeof b){for(var l=[],g,k=0;k<c.length;k++){g=e(c[k]);if(-1<g.indexOf("!"))g.match(/^(\.\.\/)?i18n\!/)&&(g=g.match(/^(\.\.\/)?i18n\!(.+)\.nls\.([^\.]+)$/),dojo.requireLocalization(g[2],g[3])),g=null;else switch(g){case "require":g=function(a){return dojo.require(e(a))};break;case "exports":g=h;break;case "module":var m=g={exports:h};break;case "dojox":g=dojo.getObject(g);break;case "dojo/lib/kernel":case "dojo/lib/backCompat":g=
dojo;break;default:g=dojo.require(g)}l.push(g)}c=b.apply(null,l)}else c=b;c&&(dojo._loadedModules[f]=c,dojo.setObject(f,c));m&&(dojo._loadedModules[f]=m.exports);return c};define.vendor="dojotoolkit.org";define.version=dojo.version;define("dojo/lib/kernel",[],dojo);define("dojo/lib/backCompat",[],dojo);define("dojo",[],dojo);define("dijit",[],this.dijit||(this.dijit={}))})();
	    }

try
{

        wm.libPath = wm.libPath.replace(/\/$/,""); // please remove this after we've gotten a few versions past 6.2

	dojo.registerModulePath("lib", wm.libPath);
	wm.registerPaths(
		["wm", wm.libPath + "/wm"],
		["wm.packages", !wm.isPhonegap ? wm.libPath + "/wm/common/packages" : "common/packages", wm.isPhonegap],
		["common", !wm.isPhonegap ? wm.libPath + "/wm/common" : "common", wm.isPhonegap],
	    ["github", wm.libPath + "/github"],
	    ["wm.modules", wm.basePath + "modules/ep"],
	    //["wm.language", wm.libPath + "/wm/language"],
	    ["language", window.location.pathname.replace(/[^\/]*$/,"language")],
	    ["project", "", true]
	);


	// Load minified built version of libraries when not booting in debug mode
	if (!djConfig.debugBoot)
	{
		// Register paths for compressed parts of dojo
		dojo.registerModulePath("dojo.nls", wm.libPath + "/build/nls");
	    //dojo.registerModulePath("dijit.themes.tundra", wm.libPath + "build/themes/tundra");
		dojo.registerModulePath("build", wm.libPath + "/build");
        if (wm.isPhonegap) {
            dojo.require("build.Gzipped.lib_build_phonegap", true);
	    } else if (wm.isMobile) {
		  dojo.require("build.Gzipped.lib_build_mobile", true);
	    } else {
		  dojo.require("build.Gzipped.lib_build", true);
	    }
/*
	    wm.loadLibs([
		wm.isMobile ? "css.dijit.themes.tundra.tmobile" :  "css.dijit.themes.tundra.t"
	    ]);
	    */

	    wm.loadLibs(["css.wm.base.widget.themes.default." + (wm.isMobile ? "mtheme" : "theme")]);
	    if (dojo.isIE)
	    {
		wm.loadLibs([
	  "wm.base.lib.Silverlight"
		]);
	    }

	}
	else
	{
		// Load lib manifest, ensuring anything not included in build will be loaded explicitly
		dojo.require("lib.manifest", true);
	}
}
catch (e)
{
	console.info('error while loading runtime_loader.js file: ' + e.message);
}
