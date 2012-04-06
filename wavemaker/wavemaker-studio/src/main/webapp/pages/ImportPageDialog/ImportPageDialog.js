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
