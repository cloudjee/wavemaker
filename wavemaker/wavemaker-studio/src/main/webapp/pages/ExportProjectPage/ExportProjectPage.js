/*
 * Copyright (C) 2008-2013 VMware, Inc. All rights reserved.
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


dojo.provide("wm.studio.pages.ExportProjectPage.ExportProjectPage");

dojo.declare("ExportProjectPage", wm.Page, {
    i18n: true,
    start: function() {
    },
    reset: function() {
        this.zipNameEditor.setDataValue(studio.project.projectName + "." + studio.application.getFullVersionNumber());
	   var items = [];
	   if (String(studio.application.theme).match(/^common\./)) {
	       items.push({name: "Theme: " + studio.application.theme.replace(/^.*\./,""), dataValue: {type: "theme", path: studio.application.theme.replace(/^.*\./,"")}});
	   }

	   if (studio.application.phoneTheme != studio.application.theme && String(studio.application.phoneTheme).match(/^common\./)) {
	       items.push({name: "Theme: " + studio.application.phoneTheme, dataValue: {type: "theme", path: studio.application.phoneTheme.replace(/^.*\./,"")}});
	   }

	   if (studio.application.tabletTheme != studio.application.theme &&
	       studio.application.phoneTheme != studio.application.tabletTheme &&
	       String(studio.application.tabletTheme).match(/^common\./)) {
	       items.push({name: "Theme: " + studio.application.tabletTheme, dataValue: {type: "theme", path: studio.application.tabletTheme.replace(/^.*\./,"")}});
	   }

       if (__packageRegistry && __packageRegistry.length) {
            dojo.forEach(__packageRegistry, function(module) {
                items.push({name: module[1], dataValue: {type: "component", path: module[2].replace(/\./g,"/")}});
            }, this);
       }
       this.variable.setData(items);
       this.includeList.setShowing(items.length > 0);
       this.owner.owner.setHeight(items.length > 0 ? "400px" : "230px");
       studio.studioService.requestSync("getPreferences", null, dojo.hitch(this, "getPreferencesCallBack"));
    },
    getPreferencesCallBack: function(inResult) {
        this.currentWaveMakerHome = inResult['wavemakerHome'];
    },
    cancelClick: function() {
        this.owner.owner.hide();
    },
    exportClick: function() {
        var themes = [];
        var components = [];
        var items = this.includeList.getDataValue();
        dojo.forEach(items, function(item) {
            var value = item.dataValue;
            switch(value.type) {
                case "theme":
                    themes.push(value.path);
                    break;
                case "component":
                    components.push(value.path);
                    break;
            }
        });

        var templateJson = "";
        if (this.templateExportCheckbox.getChecked()) {
            templateJson = dojo.toJson({name: this.templateName.getDataValue(),
                                        templateGroup: this.templateGroup.getDataValue(),
                                        theme: this.themeSelect.getDataValue(),
                                        thumbnail: this.templateThumbnail.getDataValue()},true);
        }

        var zipName = dojo.trim(this.zipNameEditor.getDataValue());
        if (!zipName.match(/\.zip$/)) zipName += ".zip";

  	    studio.beginWait("Building ZIP File...");
   	    studio.deploymentService.requestAsync("exportMultiFile", [
   	        zipName, // argument 1: zip file name
   	        !this.templateExportCheckbox.getChecked(), // argument 2: include the project for a project export
   	        this.templateExportCheckbox.getChecked(), // argument 3: build as a project template; ignored if building a project export
            templateJson, // argument 4: Pass in a template.json file contents if we are generating a project template
            themes, // array of theme paths to include
            components // array of components to include
   	        ], dojo.hitch(this, "exportClickCallback"), dojo.hitch(this, "exportClickError"));
    },
    exportClickCallback: function(inResponse) {
        studio.endWait("Building ZIP File...");
        if (studio.isCloud()) {
            app.alert(studio.getDictionaryItem("ALERT_BUILDING_ZIP_CLOUD_SUCCESS",
                                                {inResponse: inResponse}));

        } else {
            app.alert(studio.getDictionaryItem("ALERT_BUILDING_ZIP_SUCCESS",
                                                {inResponse: inResponse,
                                                 projectPath: this.currentWaveMakerHome + "/Projects/" + studio.project.projectName}));
        }
        app.alertDialog.setWidth("600px");
        var b = new wm.Button({owner: this,
                               _classes: {domNode: ["StudioButton"]},
                               parent: app.alertDialog.buttonBar,
                               caption: this.getDictionaryItem("ALERT_DOWNLOAD_BUTTON_CAPTION"),
                               width: "140px"});
        b.parent.moveControl(b,0);
        app.alertDialog.buttonBar.reflow();
        b.connect(b, "onclick", this, function() {
            app.alertDialog.hide();
            studio.downloadInIFrame("services/resourceFileService.download?method=downloadFile&file=" + inResponse);
        });
        app.alertDialog.connectOnce(app.alertDialog, "onClose", function() {
            b.destroy();
        });
        //this.downloadInIFrame("services/deploymentService.download?method=downloadProjectZip");

        studio.application.incSubversionNumber();
        var src = studio.project.generateApplicationSource();
        studio.project.saveProjectData(studio.project.projectName + ".js", src); // save incremented version
        this.owner.owner.hide();
    },
    exportClickError: function(inError) {
        studio.endWait();
        app.alert(studio.getDictionaryItem("ALERT_BUILDING_ZIP_FAILED", {error: inError.message}));
    },
    _end: 0
});
