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
	this.appName.setDataValue(studio.project.projectName);
	this.appId.setDataValue("com.mycompany." + studio.project.projectName.toLowerCase());
	this.appVersion.setDataValue(studio.application.getFullVersionNumber());
	var d = studio.phoneGapService.requestAsync("getDefaultHost", []);
	d.addCallback(dojo.hitch(this, function(inHost) {
	    alert(inHost);
	    var oldCaption = "Enter the network name or IP address of the server that this application will connect to. Add a port number to the address if needed (e.g. host.mydomain.com:8080)";

	}));
    },
    cancelClick: function() {
	this.owner.owner.hide();
    },
    okClick: function(inSender) {
	alert("What about wm.xhrPath?");

	var images = "";
	if (this.appIconUrl.getDataValue()) {
	    images += '<icon src="' + this.appIconUrl.getDataValue() + '" width="' + this.appIconWidth.getDataValue() + '" height="' + this.appIconHeight.getDataValue() + '"/>';
	}
	if (this.appSplashUrl.getDataValue()) {
	    images += '<gap:splash src="' + this.appSplashUrl.getDataValue() + '" width="' + this.appSplashWidth.getDataValue() + '" height="' + this.appSplashHeight.getDataValue() + '"/>';
	}

	var preferencesSet = this.permisionsSet.getDataValue();
	var preferences = "";
	if (preferencesSet && preferencesSet.length) {
	    preferences = "<feature name=\"" + preferencesSet.join('"/>\n<feature name="') + '"/>';
	}
	if (this.access1.getDataValue()) {
	    preferences += '<access origin="' + this.access1.getDataValue() + '" subdomains="' + String(this.accessSubDomains1.getChecked()) + '" />';
	}
	if (this.access2.getDataValue()) {
	    preferences += '<access origin="' + this.access2.getDataValue() + '" subdomains="' + String(this.accessSubDomains2.getChecked()) + '" />';
	}
	if (this.access3.getDataValue()) {
	    preferences += '<access origin="' + this.access3.getDataValue() + '" subdomains="' + String(this.accessSubDomains3.getChecked()) + '" />';
	}

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
	app.alert(xmlfile);return;
		var serverName, portNumb;
		inValue = inValue.replace(/^http.?\:\/\//,"");
		var results = inValue.split(/\:/);
		serverName = results[0];
		portNumb = results[1] || 80;
		studio.beginWait("Generating");
		var d = studio.phoneGapService.requestAsync("generateBuild", [serverName,portNumb,studio.application.theme]);
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