/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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
(function(){var a=dojo,i;a.mixin(a,{_loadedModules:{},_inFlightCount:0,_hasResource:{},_modulePrefixes:{dojo:{name:"dojo",value:"."},doh:{name:"doh",value:"../util/doh"},tests:{name:"tests",value:"tests"}},_moduleHasPrefix:function(b){var c=a._modulePrefixes;return!(!c[b]||!c[b].value)},_getModulePrefix:function(b){var c=a._modulePrefixes;if(a._moduleHasPrefix(b))return c[b].value;return b},_loadedUrls:[],_postLoad:!1,_loaders:[],_unloaders:[],_loadNotifying:!1});dojo._loadPath=function(b,c,d){b=
(b.charAt(0)=="/"||b.match(/^\w+:/)?"":a.baseUrl)+b;try{return i=c,!c?a._loadUri(b,d):a._loadUriAndCheck(b,c,d)}catch(e){return console.error(e),!1}finally{i=null}};dojo._loadUri=function(b,c){if(a._loadedUrls[b])return!0;a._inFlightCount++;var d=a._getText(b,!0);if(d){a._loadedUrls[b]=!0;a._loadedUrls.push(b);d=c?/^define\(/.test(d)?d:"("+d+")":a._scopePrefix+d+a._scopeSuffix;a.isIE||(d+="\r\n//@ sourceURL="+b);try{var e=a.eval(d)}catch(f){console.info("error while doing an eval on file loaded from "+
b),console.info("Error: "+f.message)}c&&c(e)}--a._inFlightCount==0&&a._postLoad&&a._loaders.length&&setTimeout(function(){a._inFlightCount==0&&a._callLoaded()},0);return!!d};dojo._loadUriAndCheck=function(b,c,d){var e=!1;try{e=a._loadUri(b,d)}catch(f){console.error("failed loading "+b+" with error: "+f)}return!(!e||!a._loadedModules[c])};dojo.loaded=function(){a._loadNotifying=!0;a._postLoad=!0;var b=a._loaders;a._loaders=[];for(var c=0;c<b.length;c++)try{b[c]()}catch(d){console.error(d)}a._loadNotifying=
!1;a._postLoad&&a._inFlightCount==0&&b.length&&a._callLoaded()};dojo.unloaded=function(){for(var b=a._unloaders;b.length;)b.pop()()};a._onto=function(b,c,a){if(a){if(a){var e=typeof a=="string"?c[a]:a;b.push(function(){e.call(c)})}}else b.push(c)};dojo.ready=dojo.addOnLoad=function(b,c){a._onto(a._loaders,b,c);a._postLoad&&a._inFlightCount==0&&!a._loadNotifying&&a._callLoaded()};var h=a.config.addOnLoad;if(h)a.addOnLoad[h instanceof Array?"apply":"call"](a,h);dojo._modulesLoaded=function(){a._postLoad||
(a._inFlightCount>0?console.warn("files still in flight!"):a._callLoaded())};dojo._callLoaded=function(){typeof setTimeout=="object"||a.config.useXDomain&&a.isOpera?setTimeout(a.isAIR?function(){a.loaded()}:a._scopeName+".loaded();",0):a.loaded()};dojo._getModuleSymbols=function(b){for(var b=b.split("."),c=b.length;c>0;c--){var d=b.slice(0,c).join(".");if(c==1&&!a._moduleHasPrefix(d))b[0]="../"+b[0];else{var e=a._getModulePrefix(d);if(e!=d){b.splice(0,c,e);break}}}return b};dojo._global_omit_module_check=
!1;dojo.loadInit=function(b){b()};dojo._loadModule=dojo.require=function(b,c){var c=a._global_omit_module_check||c,b=b.replace(/i18n\!/,""),d=a._loadedModules[b];if(d)return d;var e=a._getModuleSymbols(b).join("/")+".js";if(!a._loadPath(e,!c?b:null)&&!c)throw Error("Could not load '"+b+"'; last tried '"+e+"'");if(!c&&!a._isXDomain&&(d=a._loadedModules[b],!d))throw Error("symbol '"+b+"' is not defined after loading '"+e+"'");return d};dojo.provide=function(b){b+="";return a._loadedModules[b]=a.getObject(b,
!0)};dojo.platformRequire=function(b){for(var b=(b.common||[]).concat(b[a._name]||b["default"]||[]),c=0;c<b.length;c++){var d=b[c];d.constructor==Array?a._loadModule.apply(a,d):a._loadModule(d)}};dojo.requireIf=function(b){if(b===!0){for(var c=[],d=1;d<arguments.length;d++)c.push(arguments[d]);a.require.apply(a,c)}};dojo.requireAfterIf=a.requireIf;dojo.registerModulePath=function(b,c){a._modulePrefixes[b]={name:b,value:c}};dojo.requireLocalization=function(){a.require("dojo.i18n");a.i18n._requireLocalization.apply(a.hostenv,
arguments)};var m=/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/,n=/^((([^\[:]+):)?([^@]+)@)?(\[([^\]]+)\]|([^\[:]*))(:([0-9]+))?$/;dojo._Url=function(){for(var b=arguments,c=[b[0]],d=1;d<b.length;d++)if(b[d]){var e=new a._Url(b[d]+""),c=new a._Url(c[0]+"");if(e.path==""&&!e.scheme&&!e.authority&&!e.query){if(e.fragment!=null)c.fragment=e.fragment;e=c}else if(!e.scheme&&(e.scheme=c.scheme,!e.authority&&(e.authority=c.authority,e.path.charAt(0)!="/"))){for(var c=(c.path.substring(0,
c.path.lastIndexOf("/")+1)+e.path).split("/"),f=0;f<c.length;f++)c[f]=="."?f==c.length-1?c[f]="":(c.splice(f,1),f--):f>0&&!(f==1&&c[0]=="")&&c[f]==".."&&c[f-1]!=".."&&(f==c.length-1?(c.splice(f,1),c[f-1]=""):(c.splice(f-1,2),f-=2));e.path=c.join("/")}c=[];e.scheme&&c.push(e.scheme,":");e.authority&&c.push("//",e.authority);c.push(e.path);e.query&&c.push("?",e.query);e.fragment&&c.push("#",e.fragment)}this.uri=c.join("");b=this.uri.match(m);this.scheme=b[2]||(b[1]?"":null);this.authority=b[4]||(b[3]?
"":null);this.path=b[5];this.query=b[7]||(b[6]?"":null);this.fragment=b[9]||(b[8]?"":null);if(this.authority!=null)b=this.authority.match(n),this.user=b[3]||null,this.password=b[4]||null,this.host=b[6]||b[7],this.port=b[9]||null};dojo._Url.prototype.toString=function(){return this.uri};dojo.moduleUrl=function(b,c){var d=a._getModuleSymbols(b).join("/");if(!d)return null;d.lastIndexOf("/")!=d.length-1&&(d+="/");var e=d.indexOf(":");if(d.charAt(0)!="/"&&(e==-1||e>d.indexOf("/")))d=a.baseUrl+d;return new a._Url(d,
c)};define=function(b,c,a){function e(a){if(a.charAt(0)==="."){for(a=b.substring(0,b.lastIndexOf("/")+1)+a;c!==a;)var c=a,a=a.replace(/\/[^\/]*\/\.\.\//,"/");a=a.replace(/\/\.\//g,"/")}return a.replace(/\//g,".")}a||(c?(a=c,c=b):(a=b,c=typeof a=="function"?["require","exports","module"].slice(0,a.length):[]),b=i?i.replace(/\./g,"/"):"anon");var f=b.replace(/\//g,"."),h=dojo.provide(f);if(typeof a=="function"){for(var k=[],g,j=0;j<c.length;j++){g=e(c[j]);if(g.indexOf("!")>-1)g.match(/^(\.\.\/)?i18n\!/)&&
(g=g.match(/^(\.\.\/)?i18n\!(.+)\.nls\.([^\.]+)$/),dojo.requireLocalization(g[2],g[3])),g=null;else switch(g){case "require":g=function(a){return dojo.require(e(a))};break;case "exports":g=h;break;case "module":var l=g={exports:h};break;case "dojox":g=dojo.getObject(g);break;case "dojo/lib/kernel":case "dojo/lib/backCompat":g=dojo;break;default:g=dojo.require(g)}k.push(g)}c=a.apply(null,k)}else c=a;c&&(dojo._loadedModules[f]=c,dojo.setObject(f,c));if(l)dojo._loadedModules[f]=l.exports;return c};define.vendor=
"dojotoolkit.org";define.version=dojo.version;define("dojo/lib/kernel",[],dojo);define("dojo/lib/backCompat",[],dojo);define("dojo",[],dojo);define("dijit",[],this.dijit||(this.dijit={}))})();
	    }

try
{

        wm.libPath = wm.libPath.replace(/\/$/,""); // please remove this after we've gotten a few versions past 6.2

	dojo.registerModulePath("lib", wm.libPath);
	wm.registerPaths(
		["wm", wm.libPath + "/wm"],
		["wm.packages", wm.libPath + "/wm/common/packages"],
		["common", wm.libPath + "/wm/common"],
	    ["github", wm.libPath + "/github"],
	    ["wm.modules", wm.basePath + "modules/ep"],
	    //["wm.language", wm.libPath + "/wm/language"],
	    ["language", window.location.pathname.replace(/[^\/]*$/,"language")]
	);	



	// Load minified built version of libraries when not booting in debug mode
	if (!djConfig.debugBoot) 
	{
		// Register paths for compressed parts of dojo
		dojo.registerModulePath("dojo.nls", wm.libPath + "/build/nls");
	    //dojo.registerModulePath("dijit.themes.tundra", wm.libPath + "build/themes/tundra");
		dojo.registerModulePath("build", wm.libPath + "/build");
	    if (wm.isMobile) {
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
