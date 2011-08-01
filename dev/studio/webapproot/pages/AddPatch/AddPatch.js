/*
 * Copyright (C) 2011 VMWare, Inc. All rights reserved.
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
 


dojo.provide("wm.studio.pages.AddPatch.AddPatch");


dojo.declare("AddPatch", wm.Page, {
    i18n: true,
    start: function() {
	var text = loadDataSync(dojo.moduleUrl("wm.common.packages").path + "lib.js");
	this.fullText = text;

	var matches = text.match(/\/\* START WAVEMAKER PATCH \*\/([\s\S]*)\/\* END WAVEMAKER PATCH \*\//);
	if (matches) {
	    this.patchText = matches[1];
	} else {
	    this.patchText = "";
	}

	this.editor.setDataValue(this.patchText);
    },
    patchUrl: studio.getDictionaryItem("URL_DOCS", {studioVersionNumber: wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/,"$1")}) + "patches",
    loadPatchesClick: function() {
	var patches = 	studio.studioService.requestSync("getLatestPatches", [this.patchUrl]).results[0];
	this.editor.setDataValue(patches);
    },
    findCodeButtonClick: function() {
	wm.openUrl(this.patchUrl);
    },
    saveButtonClick: function() {
	var editorValue = this.editor.getDataValue();
	try {
	    eval(editorValue);
	} catch(e){
	    alert(e);
	    return;
	}
	var patch = "/* START WAVEMAKER PATCH */\n" + this.editor.getDataValue() + "\n/* END WAVEMAKER PATCH */\n";
	var text = this.fullText;
	if (text.match(/\/\* START WAVEMAKER PATCH[\s\S]*END WAVEMAKER PATCH \*\//)) {
	    text = text.replace(/\/\* START WAVEMAKER PATCH[\s\S]*END WAVEMAKER PATCH \*\//, patch);
	} else {
	    text += patch;
	}
	this.fullText = text;
	studio.studioService.requestSync("writeCommonFile", ["packages/lib.js", text]);
	app.toastSuccess(this.getDictionaryItem("SAVED"));
	this.owner.owner.hide();
    },
    cancelButtonClick: function() {
	this.owner.owner.hide();
    }
});