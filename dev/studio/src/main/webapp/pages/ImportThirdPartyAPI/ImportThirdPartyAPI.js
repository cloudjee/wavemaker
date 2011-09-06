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
 

dojo.provide("wm.studio.pages.ImportThirdPartyAPI.ImportThirdPartyAPI");

dojo.declare("ImportThirdPartyAPI", wm.Page, {
    i18n: true,
    start: function() {
	this.layers.decorator.buttonPanel.setParent(this.root);
	dojo.addClass(this.layers.decorator.buttonPanel.domNode, "dialogfooter");
	this.layers.decorator.doneCaption = this.getDictionaryItem("DONE_CAPTION");
	if (navigator.platform == "MacIntel") {
	    this.adminWarningLabel.hide();
	    this.adminSpacer.hide();
	}
	if (!navigator.platform.match(/win/i)) {
	    this.adminWarningLabel2.hide();
	}
    },
    onShow: function() {
	this.layer.invalid = true;
	this.layer.activate();
	this.saveButton.setShowing(Boolean(studio.project && studio.project.projectName) && studio.isProjectDirty());
	this.label2b.setShowing(Boolean(studio.project && studio.project.projectName) && studio.isProjectDirty());
    },

    onSuccess: function(inSender) {
	this.layer.invalid = false;
	this.layer2.activate();
    },

    onError: function(inSender, inError) {
	if (inError == "Please upload a zip file")
	    app.alert(this.getDictionaryItem("UPLOAD_A_ZIP"));
	else if (inError.match(/Please upload a zip file, not a (.*) file/)) {
	    var result = inError.match(/Please upload a zip file, not a (.*) file/);
	    app.alert(this.getDictionaryItem("UPLOAD_A_ZIP_NOT_A", {fileType: result[1]}));
	} else
	    app.alert(this.getDictionaryItem("ONERROR"));
    },
    done: function() {
	this.close();


	var def = dojo.rawXhrPost({url: "/ConfigurationTool/InstallService.download",
				   postData: "method=restartStudioApp",
				   handleAs: "json",
				   sync: false});
	studio.beginWait(this.getDictionaryItem("RESTARTING"));
	def.addCallback(function() {
	    studio.endWait();
	    studio._forceExit = true;
	    studio.setUserSettings({reopenProject: studio.project.projectName});
	    window.location.reload(true);
	});
	def.addErrback(function(inError) {
	    studio.endWait();
	    app.toastError(inError.message);
	});
    },
    close: function() {
	this.owner.owner.hide();
    },
    saveProject: function() {
	studio.saveAll(null);
    },
    _end: 0
});
