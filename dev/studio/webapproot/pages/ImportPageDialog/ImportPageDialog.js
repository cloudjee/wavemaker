/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
        i18n: true,
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
		    app.alert(this.getDictionaryItem("ALERT_NO_PROJECT_SELECTION"));
			return;
		}
		if(!this.panesList.selected) {
		    app.alert(this.getDictionaryItem("ALERT_NO_PAGE_SELECTION"));
			return;
		}
		var project = this.projectList.selected.getData();
		var sourcePage = this.panesList.selected.getData();
		var destPage = this.destPageName.getDataValue();
		
		if (dojo.indexOf(studio.project.getPageList(), destPage) != -1) {
		    app.alert(this.getDictionaryItem("ALERT_NAME_EXISTS"));
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
	    app.toastSuccess(this.getDictionaryItem("TOAST_SUCCESS", {pageName: this.destPageName.getDataValue(),
								      currentPageName: studio.project.pageName}));
		return inResponse;
	},
	copyPaneError: function(error) {
	    app.alert(this.getDictionaryItem("ALERT_FAILED", {error: error.message}));
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
