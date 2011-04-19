/*
 * Copyright (C) 2009-2011 WaveMaker Software, Inc.
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

	    // If we're running as a dialog, its scrim should not cover the menu bar
	    if (this.owner && this.owner.owner && this.owner.owner instanceof wm.Dialog) {
		dojo.connect(studio, "start", this, function() {
		    studio.panel1.domNode.appendChild(this.owner.owner.domNode);
		    studio.panel1.domNode.appendChild(this.owner.owner.dialogScrim.domNode);
		});
	    }
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
	    window.open(this.getDictionaryItem("URL_SCREENCAST"));
	},
	demoClick: function() {
		window.open(this.getDictionaryItem("URL_DEMO"));
	},
	communityClick: function() {
		window.open(this.getDictionaryItem("URL_COMMUNITY"));
	},
	userGuideClick: function() {
		window.open(this.getDictionaryItem("URL_USERGUIDE"));
	},
	tutorialClick: function() {
		window.open(this.getDictionaryItem("URL_TUTORIAL"));
	},
	documentationClick: function() {
		window.open(this.getDictionaryItem("URL_DOCS"));
	},	
	registerClick: function() {
		window.open(this.getDictionaryItem("URL_REGISTER"));
	},

        filterProjectList: function(inSender) {
	    var text = inSender.getDataValue().toLowerCase();
	    var list = [];
	    for (var i = 0; i < this.projectList.length; i++) {
		if (this.projectList[i].toLowerCase().match(text))
		    list.push(this.projectList[i]);
	    }
		this.existingProjectList.renderData(list);
		for (var i = 0; i < list.length; i++) 
		    this.existingProjectList.items[i].projectName = list[i];	    
	    this._showingList = list;
	},
	// Open Existing Project tab
	openProject: function(inSender) {
		var p = this.getSelectedProject();
		if (p)
		    studio.waitForCallback(this.getDictionaryItem("WAIT_OPENNING_PROJECT", {projectName: p}), dojo.hitch(studio.project, "openProject", p));
	},
        deleteProject: function(inSender) {
	    var projname = this.existingProjectList.selected.projectName;
	    if (projname) {
		app.confirm(this.getDictionaryItem("CONFIRM_DELETE", {projectName: projname}), false,
			   dojo.hitch(this, function() {
		               if (studio.project.projectName == projname)
			           studio.project.closeProject();
			       studio.project.deleteProject(projname);	       

			   }));
	    }
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
	    var data = [];

	        this.projectList = dojo.clone(inResult);
	        this.projectList = this.projectList.sort(function(a,b) {
		    a = a.toLowerCase();
		    b = b.toLowerCase();
		    return a.localeCompare(b);
		});
		this.existingProjectList.renderData(this.projectList);
	    for (var i = 0; i < this.projectList.length; i++) {
		    this.existingProjectList.items[i].projectName = this.projectList[i];
		data.push({dataValue: this.projectList[i]});
	    }
	    app.projectListVar.setData(data);
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
	},
    projectsTabOnShow: function() {
	this.projectSearch.setDataValue("");
	this.projectSearch.focus();
    },
    openFirstProject: function() {
	if (this._showingList && this._showingList.length) {
	    this.existingProjectList.selectByIndex(0);
	    this.openProject();
	}
    }
});
