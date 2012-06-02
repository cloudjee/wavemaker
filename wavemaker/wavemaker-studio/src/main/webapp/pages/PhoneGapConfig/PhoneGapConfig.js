 /*
 * Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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
 

dojo.declare("PhoneGapConfig", wm.Page, {
    i18n:true,
    template: '<?xml version="1.0" encoding="UTF-8" ?>\n \
    <widget xmlns = "http://www.w3.org/ns/widgets"\n \
        xmlns:gap = "http://phonegap.com/ns/1.0"\n \
        id        = "\${id}"\n \
        version   = "\${version}">\n \
    <name>${name}</name>\ \
    <description>\${description}</description>\n \
    <author href="\${authorUrl}" email="\${authorEmail}">\${authorName}</author>\n \
    \${images}\n \
    <preference name="orientation" value="${orientation}" />\n \
    <preference name="fullscreen" value="${fullscreen}" />\n \
    <preference name="prerendered-icon" value="${prerenderedIcon}" />\n \
    <preference name="ios-statusbarstyle" value="${iosStatusBarStyle}" />\n \
    \${preferences}\n \
</widget>',
    start: function() {
	this.reset();
    },
    reset: function() {
	this.requiredLayer.activate();
	var jsonData = studio.project.loadProjectData("phonegapconfig.json");
	try {
	    this.jsonData = dojo.fromJson(jsonData);
	} catch(e) {
	}
	if (!this.jsonData) this.jsonData = {xhrpaths: []};

	this.jsonData.appName = this.jsonData.appName || studio.project.projectName;
	this.jsonData.appId   =	this.jsonData.appId || "com.mycompany." + studio.project.projectName.toLowerCase();
	this.jsonData.appVersion  = studio.application.getFullVersionNumber();

	var d = studio.phoneGapService.requestAsync("getDefaultHost", []);
	d.addCallback(dojo.hitch(this, function(inHost) {
	    var localhost = "http://" + inHost + ":" + location.port + "/" + studio.project.projectName;
	    if (dojo.indexOf(this.jsonData.xhrpaths, localhost) == -1) wm.Array.insertElementAt(this.jsonData.xhrpaths, localhost,0);
		
	    var cfHost = "http://" + studio.project.projectName + ".cloudfoundry.com";
	    if (dojo.indexOf(this.jsonData.xhrpaths, cfHost) == -1) this.jsonData.xhrpaths.push(cfHost);

	    this.xhrPath.setOptions(dojo.clone(this.jsonData.xhrpaths));

	    this.jsonData.xhrPath = this.jsonData.xhrPath || localhost;

	    wm.forEachProperty(this.jsonData, dojo.hitch(this, function(value, key) {
		if (this[key] instanceof wm.AbstractEditor) {
		    this[key].setDataValue(value);
		}
	    }));
	    if (this.jsonData.iconList && this.jsonData.iconList.length) {
		this.iconListVar.setData(this.jsonData.iconList);
	    }
	    if (this.jsonData.splashList && this.jsonData.splashList.length) {
		this.splashListVar.setData(this.jsonData.splashList);
	    }
	}));
    },
    xhrPathChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {

    },
    cancelClick: function() {
	this.owner.owner.hide();
    },
    okClick: function(inSender) {
	var images = "";
	var iconList = this.iconListVar.getData();
	this.jsonData.iconList = [];
	for (var i = 0; i < iconList.length; i++) {
	    if (iconList[i].src) {
		images += dojo.string.substitute(iconList[i].template, iconList[i]) + "\n";
	    }

//'<icon src="' + iconList[i].src + '" width="' + iconList[i].width + '" height="' + iconList[i].height + '"/>\n';
	    this.jsonData.iconList.push(iconList[i]);
	}
	this.jsonData.splashList = [];
	var splashList = this.splashListVar.getData();
	for (var i = 0; i < splashList.length; i++) {
	    if (splashList[i].src) {
		images += dojo.string.substitute(splashList[i].template, splashList[i]) + "\n";
	    }

	    //images += '<gap:splash src="' + splashList[i].src + '" width="' + splashList[i].width + '" height="' + splashList[i].height + '"/>\n';
	    this.jsonData.splashList.push(splashList[i]);
	}

	var preferencesSet = this.permisionsSet.getDataValue();
	this.jsonData.features = dojo.clone(preferencesSet);
	var preferences = "";
	if (preferencesSet && preferencesSet.length) {
	    preferences = "<feature name=\"" + preferencesSet.join('"/>\n<feature name="') + '"/>';
	}


/*
  // this.jsonData.???
	var domainList = this.domainsVar.getData();
	if (domainList.length) {
	    for (var i = 0; i < domainList.length; i++) {
		preferences += '<access origin="' + domainList[i].name + '" subdomains="' + Boolean(domainList[i].dataValue) + '" />';
	    }
	} else {
	    app.toastWarning("You have no domains set in your permissions; your application will not be able to access ANY server");
	}
	*/

	this.jsonData.appId = this.appId.getDataValue();
	this.jsonData.appVersion =  this.appVersion.getDataValue();
	this.jsonData.appName = this.appName.getDataValue();
	this.jsonData.appDescription = this.appDescription.getDataValue();
	this.jsonData.appAuthorUrl = this.appAuthorUrl.getDataValue();
	this.jsonData.appAuthorEmail = this.appAuthorEmail.getDataValue();
	this.jsonData.appAuthorName = this.appAuthorName.getDataValue();
	this.jsonData.appOrientation = this.appOrientation.getDataValue();
	this.jsonData.appFullscreen = this.appFullscreen.getDataValue();
	this.jsonData.iosPrerenderedIcon = this.iosPrerenderedIcon.getDataValue();
	this.jsonData.iosStatusBarStyle = this.iosStatusBarStyle.getDataValue();

	var xhrPath = this.xhrPath.getDataValue();
	if (dojo.indexOf(this.jsonData.xhrpaths, xhrPath) == -1) {
	     wm.Array.insertElementAt(this.jsonData.xhrpaths, xhrPath,0);
	}
	studio.studioService.requestAsync("writeWebFile", ["phonegapconfig.json", dojo.toJson(this.jsonData,true), false]);

	var xmlfile = dojo.string.substitute(this.template, 
					     {
						 id: this.appId.getDataValue(),
						 version: this.appVersion.getDataValue(),
						 name: this.appName.getDataValue(),
						 description: this.appDescription.getDataValue(),
						 images: images,
						 authorUrl: this.appAuthorUrl.getDataValue(),
						 authorEmail: this.appAuthorEmail.getDataValue(),
						 authorName: this.appAuthorName.getDataValue(),
						 preferences: preferences,
						 orientation: this.appOrientation.getDataValue(),
						 fullscreen: this.appFullscreen.getChecked(),
						 prerenderedIcon: this.iosPrerenderedIcon.getChecked(),
						 iosStatusBarStyle: this.iosStatusBarStyle.getDataValue()
					     });

		studio.beginWait("Generating");
	        var d = studio.phoneGapService.requestAsync("generateBuild", [xhrPath,studio.application.theme, xmlfile]);
		d.addCallbacks(
		    dojo.hitch(this, function() {		
			app.alert("After the zip file has downloaded, login at https://build.phonegap.com and upload the zip file");
			studio.downloadInIFrame("services/phoneGapService.download?method=downloadBuild");
			studio.endWait();
			this.owner.owner.hide();
		    }),
		    dojo.hitch(this, function(inError) {
			studio.endWait();
			app.toastError(inError);
		    }));

    },
    _end: 0
});