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
		appConfigFileName: "config.js",
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

_saveToFile = function(inPath, inData, inNoOverwrite) {
	// blocking
	return studio.studioService.requestSync("writeWebFile", [inPath, inData, inNoOverwrite||false]);
}

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

makeIndexHtml = function(inProjectName) {
	var macros = ['PROJECT'], data=[inProjectName], t = wm.studioConfig.appIndexTemplate;
	// change template to index
	for (var i=0, m, d; (m=macros[i]); i++){
		d=data[i] || "";
		t = t.replace(new RegExp(['{%', m, '}'].join(''), 'g'), d);
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
