/*
 * Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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
 

dojo.provide("wm.studio.pages.HandleRequiredJars.HandleRequiredJars");

dojo.declare("HandleRequiredJars", wm.Page, {
    i18n: true,
    start: function() {
/*
	this.layers.decorator.buttonPanel.setHeight("42px")
	this.layers.decorator.buttonPanel.setMargin("10,0,0,0");
	*/
	this.layers.decorator.buttonPanel.setParent(this.root);
	this.layers.decorator.doneCaption = this.getDictionaryItem("DONE_CAPTION");
    },
    onShow: function() {
	this.layer2.invalid = this.layer4.invalid = this.layer6.invalid = true;
	this.layer1.activate();

	if (dojo.isIE <= 8) {
	    var layers = this.layers;
	    for (var i = 0; i < layers.layers.length; i++) {
		if (!layers.layers[i].active)
			layers.layers[i].domNode.style.display = "none";
		}
	    }
	this.saveButton.setShowing(Boolean(studio.project && studio.project.projectName) && studio.isProjectDirty());
	this.label7b.setShowing(Boolean(studio.project && studio.project.projectName) && studio.isProjectDirty());
    },

    onSuccess: function(inSender) {
	var layer = inSender.parent;
	layer.invalid = false;
	var index = layer.getIndex();
	var layers = layer.parent.layers;
	for (var i = index + 1; i < layers.length; i++) {
	    if (layers[i].showing) {
		layer.parent.setLayerIndex(i);
		break;
	    }
	}
    },
    onError: function(inSender, inError) {
	if (inError == "Please upload a jar file")
	    app.alert(this.getDictionaryItem("UPLOAD_A_JAR"));
	else if (inError.match(/Please upload a jar file, not a (.*) file/)) {
	    var result = inError.match(/Please upload a jar file, not a (.*) file/);
	    app.alert(this.getDictionaryItem("UPLOAD_A_JAR_NOT_A", {fileType: result[1]}));
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
	this.layer3.hide();
	this.layer4.hide();
	this.layer5.hide();
	this.layer6.hide();
	this.owner.owner.hide();
    },
    saveProject: function() {
	studio.saveAll(null);
    },
    _end: 0
});
