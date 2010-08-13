/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
dojo.provide("wm.studio.pages.ImportPageDialog.ImportPageDialog");

dojo.declare("ImportPageDialog", wm.Page, {
	start: function() {
		this.update();
	},
	update: function(inResponse) {
		studio.studioService.requestAsync("listProjects", null, dojo.hitch(this, "listProjectsResult"));
		return inResponse;
	},
	listProjectsResult: function(inResponse) {
		this.projectList.renderData(inResponse);
	},
	projectListSelect: function(inSender, inItem) {
		studio.pagesService.requestAsync("listPages", [inItem.getData()], dojo.hitch(this, "listPanesResult"));
	},
	listPanesResult: function(inResponse) {
		this.panesList.renderData(inResponse);
	},
	panesListSelect: function(inSender, inItem) {
		this.destPageName.setDataValue(inItem.getData());
	},
	copyButtonClick: function(inSender) {
		if(!this.projectList.selected) {
			app.alert("Please select a project from which to import a page.");
			return;
		}
		if(!this.panesList.selected) {
			app.alert("Please select a page to import.");
			return;
		}
		var project = this.projectList.selected.getData();
		var sourcePage = this.panesList.selected.getData();
		var destPage = this.destPageName.getDataValue();
		
		if (dojo.indexOf(studio.project.getPageList(), destPage) != -1) {
			app.alert("Please select page name that does not exist in the current project.");
			return;
		}
		studio.pagesService.requestAsync("copyPage", [project, sourcePage, destPage],
				dojo.hitch(this, "copyPaneResult"), dojo.hitch(this, "copyPaneError"));

		return inSender;
	},
	copyPaneResult: function(inResponse) {
		this.projectList.deselectAll();
		this.panesList.clear();
		wm.fire(this.owner, "dismiss", ["OK"]);
		return inResponse;
	},
	copyPaneError: function(error) {
		app.alert('Copy page failed: '+error.message);
		return error;
	},
	cancelButtonClick: function(inSender) {
		this.projectList.deselectAll();
		this.panesList.clear();
		wm.fire(this.owner, "dismiss");

		return inSender;
	},
	_end: 0
});
