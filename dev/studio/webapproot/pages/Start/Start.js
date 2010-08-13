/*
 * Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
dojo.declare("Start", wm.Page, {
	start: function() {
		this.subscribe("wm-project-changed", this, "update");
		this.existingProjectList.connect(this.existingProjectList, "onformat", this, "existingProjectListFormatCell");
		this.update();
	},
	update: function() {
		this.refreshProjectList();
		this.disEnableProjectButtons(true);
	},
	welcomeTab: function() {
		this.tabLayers1.setLayer("layer1");
	},
	openProjectTab: function() {
		this.tabLayers1.setLayer("layer2");
	},
	highlightProject: function(inName) {
	    
	    },
	// Welcome tab
	newProjectClick: function() {
		studio.newProjectClick();
	},
	screencastClick: function() {
		window.open("http://www.wavemaker.com/product/screencasts.html");
	},
	demoClick: function() {
		window.open("http://www.wavemaker.com/product/demos.html");
	},
	communityClick: function() {
		window.open("http://dev.wavemaker.com/")
	},
	userGuideClick: function() {
		window.open("http://dev.wavemaker.com/wiki/bin/wmdoc/");
	},
	tutorialClick: function() {
		window.open("http://dev.wavemaker.com/wiki/bin/wmdoc/Tutorials");
	},
	documentationClick: function() {
		window.open("http://dev.wavemaker.com/wiki/bin/wmdoc/");
	},	
	registerClick: function() {
		window.open("http://www.wavemaker.com/community/dlreg.html");
	},
	// Open Existing Project tab
	openProject: function(inSender) {
		var p = this.getSelectedProject();
		if (p)
			studio.waitForCallback("Opening project: " + p, dojo.hitch(studio.project, "openProject", p));
	},
	selectProjectInList: function(projectName) {
	    var items = this.existingProjectList.items;
	    for (var i = 0; i < items.length; i++) {
		if (items[i].projectName == projectName) {
		    this.existingProjectList.selectByIndex(i);
		    return;
		}
	    }
	},
	getSelectedProject: function() {
		var i = this.existingProjectList.selected;
		if (i) {
			return this.existingProjectList.getItemData(i.index);
		}
	},
	refreshProjectList: function() {
	    var d = studio.studioService.requestSync("listProjects", null, dojo.hitch(this, "listProjectsResult"));
	    this.disEnableProjectButtons(this.existingProjectList.selected != true);	    
	},
	listProjectsResult: function(inResult) {
		this.existingProjectList.renderData(inResult);
		for (var i = 0; i < inResult.length; i++) 
		    this.existingProjectList.items[i].projectName = inResult[i];
	},
	existingProjectListFormatCell: function(inDataInfo) {
		var di = inDataInfo;
		di.data = '<img src="images/project_16.png"> ' + di.data;
	},
	projectListSelect: function(inSender, inItem) {
		this.disEnableProjectButtons(false);
	},
	projectListDeselect: function(inSender, inItem) {
		this.disEnableProjectButtons(true);
	},
	disEnableProjectButtons: function(inDisable) {
		/*this.openProjectButton.setDisabled(inDisable);
		this.deleteProjectButton.setDisabled(inDisable);
		this.copyProjectButton.setDisabled(inDisable);*/
	}
});
