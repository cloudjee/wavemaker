/*
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.components.Application_design");
dojo.require("wm.base.components.Application");

wm.Application.extend({
    firstThemeChange: true,
/*
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
*/

	write: function(inIndent) {
	    var props = dojo.toJson(this.writeProps(),true);
	    props = props.substring(1,props.length-2);


	    var compsArray = this.writeComponents(inIndent);

	    var classOrdering = ["wm.TypeDefinition", "wm.LiveView"];

	    compsArray = compsArray.sort(function(a,b) {
		var alist = a.match(/^(.*?)\:\s*\[\"(.*?)\"/);
		var blist = b.match(/^(.*?)\:\s*\[\"(.*?)\"/);
		var aindex = dojo.indexOf(classOrdering, alist[2]);
		var bindex = dojo.indexOf(classOrdering, blist[2]);
		if (aindex == -1) aindex = classOrdering.length;
		if (bindex == -1) bindex = classOrdering.length;
		if (aindex == bindex)
		    return (alist[1] <= blist[1]) ? -1 : 1;
		else
		    return (aindex < bindex) ? -1 : 1;

	    });

	    var comps = compsArray.join(", " + sourcer_nl);
	
	    var customsrc = dojo.trim(String(studio.getAppScript())) || studio.project.projectName + ".extend({\n\n\t" + terminus + "\n});";
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
	    /* TODO: Localize */
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
    },
    setPromptChromeFrame: function(inValue) {
	this.promptChromeFrame = inValue;
	var indexText = studio.project.loadProjectData("index.html");
	if (inValue == "Allow IE 6 and 7")
	    inValue = null;
	else
	    inValue = '"' + inValue + '"';
	indexText = indexText.replace(/var\s+wmChromeFramePath.*/, "var wmChromeFramePath = " + inValue + ";")
	studio.project.saveProjectData("index.html", indexText);
	var src = studio.project.generateApplicationSource();
	studio.project.saveProjectData(studio.project.projectName + ".js", src);
    }
});


wm.Object.extendSchema(wm.Application, {
    name: {ignore: 1}, // at some point, we might provide this as a way to rename the project... but renaming is really a server side op, so requires confirmation. 
    main: {shortname: "mainPageName", order: 5},
    promptChromeFrame: {order: 10, type: "string", options: ["chromeframe.html", "http://google.com/chrome", "Allow IE 6 and 7"]},
    i18n: {type: "boolean", order: 6},
    theme: {type: "string", order: 7},
    currencyLocale: {type: "string", order: 8},
    saveCounter: {writeonly: true},
    //IERoundedCorners: {ignore: true},
    studioVersion: {writeonly: true, type: "string", order: 105},
    dialogAnimationTime: {type: "number", order: 200},
    projectVersion: {type: "string", order: 100},
    projectSubVersion: {type: "string", order: 101},
    firstThemeChange: {ignore: true},
    documentation: {ignore: true},
    generateDocumentation: {ignore: true},
    loadPage: {group: "method"},
    forceReloadPage: {group: "method"},
    getFullVersionNumber: {group: "method"},
    getSessionId: {group: "method"},
    echoFile: {group: "method"},
    alert: {group: "method"},
    confirm: {group: "method"},
    prompt: {group: "method"},
    toastError: {group: "method"},
    toastWarning: {group: "method"},
    toastInfo: {group: "method"},
    toastSuccess: {group: "method"},
    createToolTip: {group: "method"},
    hideToolTip: {group: "method"}
});
