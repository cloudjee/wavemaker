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
        wm.typeManager.types.PhoneGapImage.fields.imageId.include = ["update"];
        this.iosPreviewPicture._isDesignLoaded = true;
        this.reset();
         this.helpButton = new wm.ToolButton({owner: this,
            parent: this.owner.owner.titleBar,
            _classes: {domNode: ["StudioHelpIcon"]},
            onclick: dojo.hitch(this, "openHelp"),
            width: "16px",
            height: "16px"
        });
    },
    reset: function() {
        this.requiredLayer.activate();
        var jsonData = studio.project.loadProjectData("phonegapconfig.json");
        try {
            this.jsonData = dojo.fromJson(jsonData);
        } catch (e) {}
        if (!this.jsonData) this.jsonData = {
            xhrpaths: []
        };

        this.jsonData.appName = this.jsonData.appName || studio.project.projectName;
        this.jsonData.appId = this.jsonData.appId || "com.mycompany." + studio.project.projectName.toLowerCase();
        this.jsonData.appVersion = studio.application.getFullVersionNumber().replace(/[^0-9\.]/g, ""); // windows only accepts numbers and "."
        var d = studio.phoneGapService.requestAsync("getDefaultHost", []);
        d.addCallback(dojo.hitch(this, function(inHost) {
            var localhost = "http://" + inHost + ":" + location.port + "/" + studio.project.projectName;
            if (dojo.indexOf(this.jsonData.xhrpaths, localhost) == -1) {
				if (this.jsonData.xhrpaths.length) {
	            	wm.Array.insertElementAt(this.jsonData.xhrpaths, localhost, 1);
	            } else {
		            this.jsonData.xhrpaths.push(localhost);
	            }
            }

            var cfHost = "http://" + studio.project.projectName + ".cloudfoundry.com";
            if (dojo.indexOf(this.jsonData.xhrpaths, cfHost) == -1) this.jsonData.xhrpaths.push(cfHost);

            var options = dojo.clone(this.jsonData.xhrpaths);
            if (options) options = dojo.filter(options, function(item) {
                return Boolean(item);
            }); // remove empty items
            this.xhrPath.setOptions(options);

            this.jsonData.xhrPath = options[0]; // this sets the editor using the loop below

            wm.forEachProperty(this.jsonData, dojo.hitch(this, function(value, key) {
                if (this[key] instanceof wm.AbstractEditor) {
                    this[key].setDataValue(value);
                } else if (this[key] instanceof wm.Variable && value && value.length) {
                    this[key].setData(value);
                }
            }));

        }));
        var foundXhrService = false;
        wm.forEachProperty(studio.application.$, function(c) {
            if (c instanceof wm.XhrDefinition) foundXhrService = true;
        });
        this.xhrServiceProxies.setShowing(foundXhrService);
    },
    xhrPathChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {

    },
    cancelClick: function() {
        this.owner.owner.hide();
    },
    okClick: function(inSender) {
        var images = "";
        this.jsonData.iosIconListVar = [];
        this.jsonData.androidIconListVar = [];
        this.jsonData.otherIconListVar = [];

        var iconList = this.iosIconListVar.getData();

        for (var i = 0; i < iconList.length; i++) {
            if (iconList[i].src) {
                images += "\t" + dojo.string.substitute(iconList[i].template, iconList[i]) + "\n";
            }
            this.jsonData.iosIconListVar.push(iconList[i]);
        }
        iconList = this.androidIconListVar.getData();

        for (i = 0; i < iconList.length; i++) {
            if (iconList[i].src) {
                images += "\t" + dojo.string.substitute(iconList[i].template, iconList[i]) + "\n";
            }
            this.jsonData.androidIconListVar.push(iconList[i]);
        }
        iconList = this.otherIconListVar.getData();

        for (i = 0; i < iconList.length; i++) {
            if (iconList[i].src) {
                images += "\t" + dojo.string.substitute(iconList[i].template, iconList[i]) + "\n";
            }
            this.jsonData.otherIconListVar.push(iconList[i]);
        }



        /*
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
*/
        var preferencesSet = this.features.getDataValue();
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
        this.jsonData.appVersion = this.appVersion.getDataValue();
        this.jsonData.appName = this.appName.getDataValue();
        this.jsonData.appDescription = this.appDescription.getDataValue();
        this.jsonData.appAuthorUrl = this.appAuthorUrl.getDataValue();
        this.jsonData.appAuthorEmail = this.appAuthorEmail.getDataValue();
        this.jsonData.appAuthorName = this.appAuthorName.getDataValue();
        this.jsonData.appOrientation = this.appOrientation.getDataValue();
        this.jsonData.appFullscreen = this.appFullscreen.getDataValue();
        this.jsonData.iosPrerenderedIcon = this.iosPrerenderedIcon.getDataValue();
        this.jsonData.iosStatusBarStyle = this.iosStatusBarStyle.getDataValue();
        this.jsonData.xhrServiceProxies = this.xhrServiceProxies.getChecked();

        var xhrPath = this.xhrPath.getDataValue();
        if (dojo.indexOf(this.jsonData.xhrpaths, xhrPath) == -1) {
            wm.Array.insertElementAt(this.jsonData.xhrpaths, xhrPath, 0);
        }
        studio.studioService.requestAsync("writeWebFile", ["phonegapconfig.json", dojo.toJson(this.jsonData, true), false]);
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
        var d = studio.phoneGapService.requestAsync("generateBuild", [xhrPath, studio.application.theme, xmlfile, this.xhrServiceProxies.getChecked()]);
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
            })
        );

    },
    onPermissionsChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        var hadFile, hadCamera;
        if (this._lastPermissions) {
            hadFile = dojo.indexOf(this._lastPermissions, "http://api.phonegap.com/1.0/file") != -1;
            hadCamera = dojo.indexOf(this._lastPermissions, "http://api.phonegap.com/1.0/camera") != -1;
        } else {
            hadCamera = hadFile = true;
        }

        var nowFile, nowCamera;
        if (!inSetByCode) {
            nowFile = dojo.indexOf(inDataValue, "http://api.phonegap.com/1.0/file");
            nowCamera = dojo.indexOf(inDataValue, "http://api.phonegap.com/1.0/camera");
            if (nowFile == -1 && nowCamera != -1 && hadFile) {
                wm.Array.removeElementAt(inDataValue, nowCamera);
            } else if (nowFile == -1 && !hadFile && !hadCamera && nowCamera != -1) {
                inDataValue.push("http://api.phonegap.com/1.0/file");
            }
            inSender.setDataValue(inDataValue);
        }
        this._lastPermissions = inDataValue;
    },
    iosGraphicsChange: function() {
        var row = this.iosIconGrid.getSelectedIndex();
        if (row === -1) return;
        this.iosIconGrid.selectedItem.beginUpdate();


        this.iosIconListVar.beginUpdate();
        this.iosIconListVar.getItem(row).setValue("width", this.iosWidthEditor.getDataValue());
        this.iosIconListVar.getItem(row).setValue("height", this.iosHeightEditor.getDataValue());
        this.iosIconListVar.getItem(row).setValue("src", this.iosSrcEditor.getDataValue());
        this.iosIconListVar.endUpdate();
        this.iosIconListVar.notify();

        this.iosIconGrid.selectedItem.endUpdate();
    },
    androidGraphicsChange: function() {
        var row = this.androidIconGrid.getSelectedIndex();
        if (row === -1) return;
        this.androidIconGrid.selectedItem.beginUpdate();


        this.androidIconListVar.beginUpdate();
        this.androidIconListVar.getItem(row).setValue("src", this.androidSrcEditor.getDataValue());
        this.androidIconListVar.endUpdate();
        this.androidIconListVar.notify();

        this.androidIconGrid.selectedItem.endUpdate();
    },
    otherGraphicsChange: function() {
        var row = this.otherIconGrid.getSelectedIndex();
        if (row === -1) return;
        this.otherIconGrid.selectedItem.beginUpdate();


        this.otherIconListVar.beginUpdate();
        this.otherIconListVar.getItem(row).setValue("src", this.otherSrcEditor.getDataValue());
        this.otherIconListVar.endUpdate();
        this.otherIconListVar.notify();

        this.otherIconGrid.selectedItem.endUpdate();
    },
    selectImage: function(inSender) {
       studio.beginBind(this.getDictionaryItem("TITLE_SELECT_IMAGE"),  inSender,"source",dojo.hitch(this, function(inPath) {
            inSender.parent.c$[0].setDataValue(inPath);
       }));
    },
    showPreviewDialog: function(inSender) {
        this.previewDialogPic.setSource(inSender.source);
        this.previewDialog.show();
    },
    onRenderData: function(inSender) {
        inSender.dojoObj.canSort = function() {return false;};
    },
      openHelp: function() {
        window.open(studio.getDictionaryItem("URL_DOCS", {studioVersionNumber: wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/,"$1")}) + "PhoneGapConfig");
    },
    _end: 0
});