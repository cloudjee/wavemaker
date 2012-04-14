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
 

dojo.provide("wm.studio.pages.OpenProjectOptions.OpenProjectOptions");

dojo.declare("OpenProjectOptions", wm.Page, {
    i18n: true,
    start: function() {
    },
    setup: function(inProjectName, inDeferred) {
	this.radioOpen.setChecked(true);
	this.deferred = inDeferred;
	this.projectName = inProjectName;
	var newName = this.getUniqueProjectName(inProjectName + "_" + wm.studioConfig.studioVersion.replace(/\./g,""));
	this.newProjectName.setDataValue(newName);
    },
    getUniqueProjectName: function(inName) {
	if (this.isUniqueProjectName(inName)) {
	    return inName;
	}
	for (var i = 0; i < 500; i++) {
	    if (this.isUniqueProjectName(inName + "_" + i)) {
		return inName + "_" + i;
	    }
	}
	return "";
    },
    isUniqueProjectName: function(inName) {
        var projectNames = {};
	var projects = studio.startPageDialog.page.projectList;
	var l={};
	dojo.forEach(projects, dojo.hitch(this, function(p) {
	    projectNames[p] = true;
        }));
	return !(inName in projectNames);
    },
    okButtonClick: function(inSender) {
	if (this.radioOpen.getChecked()) {
	    this.deferred.callback(this.projectName);
	} else {
	    if (!this.isUniqueProjectName(this.newProjectName.getDataValue())) {
		app.alert(this.getDictionaryItem("NAME_TAKEN"));
		return;
	    }
	    this.deferred.callback(this.newProjectName.getDataValue());
	}
	this.owner.owner.hide();
    },
    cancelButtonClick: function(inSender) {
	this.deferred.errback("");
	this.owner.owner.hide();
    },
    _end: 0
});
