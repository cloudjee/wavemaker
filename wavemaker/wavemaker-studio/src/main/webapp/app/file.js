/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
 
dojo.provide("wm.studio.app.file");

// load data from url
loadData = function(inFile, inCallback) {
    if (djConfig.isDebug && !dojo.isFF) {
	console.info("loadData: " + inFile);
    }
    var deferred = dojo.xhrGet({ url: inFile, sync: true, preventCache: true }).addCallback(inCallback);
    if (djConfig.isDebug && !dojo.isFF) {
      deferred.addCallback(function(inData) {
	console.log("Service Call Complete: " + inFile);
/*
	console.group("Service Call Complete: " + inFile);
	console.log(inData);
	console.groupEnd();
	*/
      });
    }
}
loadDataSync = function(inFile) {
    if (djConfig.isDebug && !dojo.isFF) {
	console.info("loadDataSync: " + inFile);
    }
	return dojo.xhrGet({url: inFile, sync: true, preventCache: true}).results[0];
}

// load data from project webapproot
loadWebData = function(inFile, inCallback) {
      //console.log('loadData from', inFile);
	studio.studioService.requestAsync("readWebFile", [inFile]).addCallback(inCallback);
}
loadWebDataSync = function(inFile) {
	//console.log('loadData from', inFile);
	return studio.studioService.getResultSync("readWebFile", [inFile]);
}

_initProjectTemplates = function() {
	var c = wm.studioConfig;
	dojo.mixin(c, {
		appIndexFileName: "index.html",
		appChromeFileName: "chromeframe.html",
		appConfigFileName: "config.js",
		appChromeTemplate: "",
		appCssFileName: "app.css",
		appDebugBootFileName: "lib_project.js",
		appIndexTemplate: "",
		appCssTemplate: "",
		appConfigTemplate: ""
	});
	var t = dojo.moduleUrl("wm.studio.app") + "templates/project/";
	loadData(t + c.appIndexFileName, function(t){ c.appIndexTemplate = t;});
	loadData(t + c.appCssFileName, function(t){ c.appCssTemplate = t;});
	loadData(t + c.appConfigFileName, function(t){ c.appConfigTemplate = t;});
	loadData(t + c.appChromeFileName, function(t){ c.appChromeTemplate = t;});
};

_initPalmProjectTemplates = function() {
	var c = wm.studioConfig;
	dojo.mixin(c, {
		appIndexFileName: "index.html",
		appConfigFileName: "config.js",
		appCssFileName: "app.css",
		appDebugBootFileName: "lib_project.js",
		appPalmAppInfoFileName: "appinfo.json",
		appPalmAppInfoTemplateFileName: "appinfo.template",
		appIndexTemplate: "",
		appCssTemplate: "",
		appConfigTemplate: "",
		appPalmAppInfoTemplate: ""
	});
	var t = dojo.moduleUrl("wm.studio.app") + "templates/palmproject/";
	loadData(t + c.appIndexFileName, function(t){ c.appIndexTemplate = t;});
	loadData(t + c.appCssFileName, function(t){ c.appCssTemplate = t;});
	loadData(t + c.appConfigFileName, function(t){ c.appConfigTemplate = t;});
	loadData(t + c.appPalmAppInfoTemplateFileName, function(t){ c.appPalmAppInfoTemplate = t;});
};

if (wm.studioConfig.isPalmApp)
	dojo.addOnLoad(_initPalmProjectTemplates);
else
	dojo.addOnLoad(_initProjectTemplates);
/*
_saveToFile = function(inPath, inData, inNoOverwrite) {
	// blocking
	return studio.studioService.requestSync("writeWebFile", [inPath, inData, inNoOverwrite||false]);
}
*/
_fileExists = function(inPath) {
	return studio.studioService.getResultSync("fileExists", [inPath]);
}

webFileExists = function(inPath) {
	return _fileExists("webapproot/" + inPath);
}

getPagesScriptTags = function() {
	if (djConfig.isDebug) {
		var n=[], p = studio.project.getPageList();
		tag = [ '<scrip', 't type="text/javascript" src="', 'pages/', '', '/', '', '.js"></scrip', 't>' ];
		for (var i=0, l; (l=p[i]); i++){
			tag[3] = tag[5] = l;
			n.push(tag.join(""));
		}
		return n.join("\n");
	}
}

makeDebugLoaderJs = function() {
	var n=[], p = studio.project.getPageList();
	tag = [ '\t\t"pages/', "", "/", "", '.js"'];
	for (var i=0, l; (l=p[i]); i++){
		tag[1] = tag[3] = l;
		n.push(tag.join(""));
	}
	var s = n.join(",\n");
	return [
		"if (djConfig.debugBoot) {",
		"\t" + "wm.loadScripts([", s, "\t]);",
		"}"
		].join('\n');
}

makeIndexHtml = function(inProjectName, themeUrl) {
	var macros = ['PROJECT'], data=[inProjectName], t = wm.studioConfig.appIndexTemplate;
	// change template to index
	for (var i=0, m, d; (m=macros[i]); i++){
		d=data[i] || "";
		t = t.replace(new RegExp(['{%', m, '}'].join(''), 'g'), d);
	}
	
    if (t.match(/var wmThemeUrl\s*=.*?;/)) {
    	t = t.replace(/var wmThemeUrl\s*=.*?;/, "var wmThemeUrl = \"" + themeUrl + "\";");
    	themeUrl = "";
    } else {
        t = t.replace(/\<\/title\s*\>/, "</title>\n<script>var wmThemeUrl = \"" + themeUrl + "\";</script>");
    }    

    return t;
}

makePalmAppInfo = function(inProjectName) {
	var macros = ['PROJECT'], data=[inProjectName.toLowerCase()], t = wm.studioConfig.appPalmAppInfoTemplate;
	// change template to index
	for (var i=0, m, d; (m=macros[i]); i++){
		d=data[i] || "";
		t = t.replace(new RegExp(['{%', m, '}'].join(''), 'g'), d);
	}
	return t;
}

packageData = function(inName, inData) {
	//prepareDocument(inName, inData);
	//return;
	var form = document.createElement("form");
	form.action = "php/package.php?t=" + new Date().getTime();
	form.method = "post";
	document.body.appendChild(form);
	// 
	var createInput = function(inName, inValue) {
		var input = document.createElement("input");
		input.type = "hidden";
		input.name = inName;
		input.value = inValue;
		form.appendChild(input);
	}
	// 
	for (var i=0,d; (d=inData[i]); i++) {
		createInput('name[]', inName);
		createInput('ext[]', d[0]);
		createInput('data[]', d[1]);
	}
	form.submit();
	document.body.removeChild(form);
}
