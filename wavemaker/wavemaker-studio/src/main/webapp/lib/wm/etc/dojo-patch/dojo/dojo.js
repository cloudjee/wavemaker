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

// summary:
//		This is the "source loader" for Dojo. This dojo.js ensures that all
//		Base APIs are available once its execution is complete and attempts to
//		automatically determine the correct host environment to use.
// description:
//		"dojo.js" is the basic entry point into the toolkit for all uses and
//		users. The "source loader" is replaced by environment-specific builds
//		and so you should not assume that built versions of the toolkit will
//		function in all supported platforms (Browsers, Rhino, Spidermonkey,
//		etc.). In most cases, users will receive pre-built dojo.js files which
//		contain all of the Base APIs in a single file and which specialize for
//		the Browser platform. After loading dojo.js, you will be able to do the
//		following with the toolkit:
//			All platforms:
//				- load other packages (dojo core, dijit, dojox, and custom
//				  modules) to better structure your code and take advantage of
//				  the inventive capabilities developed by the broad Dojo
//				  community
//				- perform basic network I/O
//				- use Dojo's powerful language supplementing APIs
//				- take advantage of the Dojo event system to better structure
//				  your application
//			Browser only:
//				- use Dojo's powerful and blisteringly-fast CSS query engine to
//				  upgrade and active your web pages without embedding
//				  JavaScript in your markup
//				- get and set accurate information about element style 
//				- shorten the time it takes to build and manipulate DOM
//				  structures with Dojo's HTML handling APIs
//				- create more fluid UI transitions with Dojo's robust and
//				  battle-tested animation facilities

// NOTE:
//		If you are reading this file, you have received a "source" build of
//		Dojo. Unless you are a Dojo developer, it is very unlikely that this is
//		what you want. While functionally identical to builds, source versions
//		of Dojo load more slowly than pre-processed builds.
//
//		We strongly recommend that your applications always use a build of
//		Dojo. To download such a build or find out how you can create
//		customized, high-performance packages of Dojo suitable for use with
//		your application, please visit:
//
//			http://dojotoolkit.org
//
//		Regards,
//		The Dojo Team

if(typeof dojo == "undefined"){
	// only try to load Dojo if we don't already have one. Dojo always follows
	// a "first Dojo wins" policy.
	(function(){
		// we default to a browser environment if we can't figure it out
		var hostEnv = "browser";
		var isRhino = false;
		var isSpidermonkey = false;
		if(
			(typeof this["load"] == "function")&&
			(
				(typeof this["Packages"] == "function")||
				(typeof this["Packages"] == "object")
			)
		){
			// Rhino environments make Java code available via the Packages
			// object. Obviously, this check could be "juiced" if someone
			// creates a "Packages" object and a "load" function, but we've
			// never seen this happen in the wild yet.
			isRhino = true;
			hostEnv = "rhino";
		}else if(typeof this["load"] == "function"){
			// Spidermonkey has a very spartan environment. The only thing we
			// can count on from it is a "load" function.
			isSpidermonkey  = true;
			hostEnv = "spidermonkey";
		}

		// require a config object
		djConfig = this["djConfig"] || {};
		
		// try to parse the script tag for config (convenience notation)
		var root = '';
		if((this["document"])&&(this["document"]["getElementsByTagName"])){
			var rePkg = /dojo\.js([\?\.]|$)/i;
			var scripts = document.getElementsByTagName("script");
			for(var i=0, src, m, tag; tag=scripts[i]; i++){
				if((src=tag.getAttribute("src")) && (m=src.match(rePkg))){
					root = src.substring(0, m.index);
					var cfg = tag.getAttribute("djConfig")||"";
					cfg = eval("({ "+ cfg +" })");
					for(var x in cfg){ djConfig[x] = cfg[x]; }
					break;
				}
			}
		}
		// if the user explicitly tells us where Dojo has been loaded from
		// (or should be loaded from) via djConfig, ignore the auto-detection
		root = djConfig.baseUrl || root;
		if(!root){
			root = "./";
			if(isSpidermonkey){
				// auto-detect the base path via an exception. Hack!
				try{ throw new Error(""); }catch(e){ root = e.fileName.split("dojo.js")[0]; };
			}
		}
		djConfig.baseUrl = root;
		
		// bootstrap requires
		var libs = ["_loader/bootstrap", "_loader/loader", "_loader/hostenv_"+hostEnv];
		// more bootstrap for x-domain configuration
		if(djConfig.forceXDomain||djConfig.useXDomain){
			libs.push("_loader/loader_xd");
		}
		// more bootstrap for debugging configuration
		if (djConfig.debugBase){
			libs.push("lang", "array", "declare", "connect", "event", "html", "json", "Deferred", "NodeList", "query", "xhr", "fx");
		}

		// FIXME: should we be adding the lang stuff here so we can count on it
		// before the bootstrap stuff?
		for(var x=0; x < libs.length; x++){
			libs[x] = root+"_base/"+libs[x]+".js";
		}
		// the "_base.js" file ensures that the rest of Dojo Base is available.
		// It counts on the package system functioning in order to work, so add
		// it last
		libs.push(root+"_base.js");
	
		for(var x=0; x < libs.length; x++){
			if(isRhino||isSpidermonkey){
				load(libs[x]);
			}else{
				try{
					document.write("<scr"+"ipt type='text/javascript' src='"+libs[x]+"'></scr"+"ipt>");
				}catch(e){
					var script = document.createElement("script");
					script.src = libs[x];
					document.getElementsByTagName("head")[0].appendChild(script);
				}
			}
		}
	})();
};
