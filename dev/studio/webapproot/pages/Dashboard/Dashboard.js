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
dojo.provide("wm.studio.pages.Dashboard");

dojo.declare("Dashboard", wm.Page, {
	start: function() {
		// list cell formatting (no longer an event so must connect manually)
		this.paneList.connect(this.paneList, "onformat", this, "listPanesFormatCell");
		this.serviceList.connect(this.serviceList, "onformat", this, "serviceListFormatCell");
		this.datamodelList.connect(this.datamodelList, "onformat", this, "datamodelListFormatCell");
	},
	update: function() {
		this.projectNameInput.setInputValue(studio.getProjectName());
		this.getPaneList();
		this.refreshDatamodelList();
		this.refreshServiceList();
		this.disEnablePaneButtons(true);
		this.disEnableDatamodelButtons(true);
		this.disEnableServiceButtons(true);
	},
	saveProjectButtonClick: function(inSender) {
		studio.saveProject();
	},
	closeProjectButtonClick: function(inSender) {
		studio.closeProject();
	},
	getPaneList: function() {
		var d = studio.updatePagesList();
		d.addCallback(dojo.hitch(this, "listPanesResult"));
	},
	listPanesResult: function(inResponse) {
		this.mainPane = this.getMainPane();
		this.paneList.renderData(inResponse);
	},
	listPanesFormatCell: function(inDataInfo) {
		var di = inDataInfo;
		di.data = '<img src="images/' + (di.data == this.mainPane ? 'home.png' : 'page.png') + '"> ' + di.data;
	},
	serviceListFormatCell: function(inDataInfo) {
		var di = inDataInfo;
		di.data = '<img src="images/service.png"> ' + di.data;
	},
	datamodelListFormatCell: function(inDataInfo) {
		var di = inDataInfo;
		di.data = '<img src="images/datamodel.png"> ' + di.data;
	},
	getMainPane: function() {
		return projectMgr.mainPage || studio.application.main;
	},
	loadPane: function() {
		var n = this.getSelectedPane();
		if (n) {
			if (!projectMgr.confirmPageChange('Are you sure you want to open page "' + n + '"? Unsaved changes to ${page} will be lost.'))
				return;
			studio.loadPage(n);
			studio.tabs.setLayer("workspace");
		}
	},
	paneListDblClick: function(inSender, inEvent, inItem) {
		this.loadPane();
	},
	disEnablePaneButtons: function(inDisable) {
		this.paneDeleteButton.setDisabled(inDisable);
		this.paneOpenButton.setDisabled(inDisable);
		this.paneHomeButton.setDisabled(inDisable);
	},
	paneListSelect: function(inSender, inItem) {
		this.disEnablePaneButtons(false);
	},
	paneListDeselect: function(inSender, inItem) {
		this.disEnablePaneButtons(true);
	},
	getSelectedPane: function() {
		var s = this.paneList.selected;
		if (s)
			return this.paneList.getItemData(s.index);
	},
	paneAddButtonClick: function(inSender) {
		if (!projectMgr.confirmPageChange("Are you sure you want to add a new page? Unsaved changes to ${page} will be lost."))
			return;
		var pages = studio.getPagesList(), l={};
		dojo.forEach(pages, function(p) {
			l[p] = true;
		});
		var n = projectMgr.promptForName("page", wm.findUniqueName('Page', [l]), pages);
		if (n) {
			studio.newPage(n);
			studio.savePage(n);
			this.getPaneList();
		}
	},
	paneDeleteButtonClick: function(inSender) {
		if (this.paneList.selected && confirm('Are you sure you want to delete ' + this.getSelectedPane() + '?'))
			wm.studio.pagesService.requestAsync("deletePage", [this.getSelectedPane()], dojo.hitch(this, "deletePaneResult"));
	},
	deletePaneResult: function(inSender) {
		this.getPaneList();
	},
	paneOpenButtonClick: function(inSender) {
		this.loadPane();
	},
	paneHomeButtonClick: function(inSender) {
		studio.setProjectMainPage(this.getSelectedPane());
		this.getPaneList();
	},
	paneCopyButtonClick: function(inSender) {
		var d = this.paneCopyDialog;
		if (d) {
			d.editor.binding = this;
			d.editor.update();
		} else {
			this.paneCopyDialog = d = new wm.Dialog();

			var p = new wm.PageContainer({name: "copyDialogPage", pageName: "CopyPageDialog", parent: d, flex: 1, owner: studio});

			d.editor = p.page;
			d.editor.binding = this;
			p.page.dialogReference = d;

			// once that returns, refresh our list
			dojo.connect(d.editor, "start", dojo.hitch(this, function() {
				p.connect(d.editor.copyButton, "onclick", this, "getPaneList");
			}));
		}

		d.setShowing(true);
	},
	disEnableDatamodelButtons: function(inDisable) {
		this.datamodelDeleteButton.setDisabled(inDisable);
		this.datamodelEditButton.setDisabled(inDisable);
	},
	datamodelListSelect: function(inSender, inItem) {
		this.disEnableDatamodelButtons(false);
	},
	datamodelListDeselect: function(inSender, inItem) {
		this.disEnableDatamodelButtons(true);
	},
	getSelectedDatamodel: function() {
		var s = this.datamodelList.selected;
		if (s) {
			return this.datamodelList.getItemData(s.index);
		}
	},
	refreshDatamodelList: function() {
		studio.dataService.requestAsync("getDataModelNames", [], dojo.hitch(this, "getDataModelNamesResult"));
		this.disEnableDatamodelButtons(this.datamodelList.selected != true);
	},
	getDataModelNamesResult: function(inResponse) {
		this.datamodelList.renderData(inResponse);
	},
	datamodelAddButtonClick: function(inSender) {
		studio.tabs.setLayer("dataObjectsTab");
		studio.dataObjectsPane.page.pages.setLayer("importPage");
	},
	datamodelDeleteButtonClick: function(inSender) {
		var d = this.getSelectedDatamodel();
		if (d && confirm('Are you sure you want to delete ' + d + '?')) {
			studio.dataService.requestAsync("removeDataModel", [d], dojo.hitch(this, "removeDataModelResult"));
		}
	},
	removeDataModelResult: function(inResponse) {
		this.refreshDatamodelList();
		this.refreshServiceList();
		studio.dataObjectsPane.page.update();
		studio.updateServices();
	},
	datamodelEditButtonClick: function(inSender) {
		this.loadDatamodel();
	},
	datamodelListDblClick: function(inSender, inEvent, inItem) {
		this.loadDatamodel();
	},
	loadDatamodel: function() {
		studio.tabs.setLayer("dataObjectsTab");
		studio.dataObjectsPane.page.pages.setLayer("objectquery");
		var d = this.getSelectedDatamodel();
		if (d) {
			var treeRoot = studio.dataObjectsPane.page.tree.root.kids[0];
			for (var i = 0; i < treeRoot.kids.length; i++) {
				var s = treeRoot.kids[i];
				if (s.data && s.data[0] == d) {
					studio.dataObjectsPane.page.tree.select(s);
					return;
				}
			}
		}
	},
	disEnableServiceButtons: function(inDisable) {
		this.serviceDeleteButton.setDisabled(inDisable);
		this.serviceEditButton.setDisabled(inDisable);
	},
	serviceListSelect: function(inSender, inItem) {
		this.disEnableServiceButtons(false);
	},
	serviceListDeselect: function(inSender, inItem) {
		this.disEnableServiceButtons(true);
	},
	servicesListDblClick: function(inSender, inEvent, inItem) {
		studio.tabs.setLayer("servicesTab");
	},
	getSelectedService: function() {
		var s = this.serviceList.selected;
		if (s) {
			return this.serviceList.getItemData(s.index);
		}
	},
	refreshServiceList: function() {
		studio.servicesService.requestAsync("listServices", null, dojo.hitch(this, "listServicesResult"));
		this.disEnableServiceButtons(this.serviceList.selected != true);
	},
	listServicesResult: function(inResponse) {
		this.serviceList.renderData(inResponse);
	},
	serviceAddButtonClick: function(inSender) {
		studio.tabs.setLayer("servicesTab");
		studio.servicesPane.page.mainTabLayers.setLayer("addLayer");
	},
	serviceDeleteButtonClick: function(inSender) {
		var s = this.getSelectedService();
		if (this.serviceList.selected && confirm('Are you sure you want to delete ' + s + '?')) {
			studio.servicesService.requestSync("getServiceType", [s], dojo.hitch(this, "doDeleteService", s));
		}
	},
	doDeleteService: function(serviceId, serviceType) {
		if (serviceType == "DataService") {
			studio.dataService.requestAsync("removeDataModel", [serviceId], dojo.hitch(this, "removeDataModelResult"));
		} else {
			studio.servicesService.requestAsync("deleteService", [serviceId], dojo.hitch(this, "deleteServiceResult"));
		}
	},
	deleteServiceResult: function(inResponse) {
		this.refreshServiceList();
		studio.updateServices();
	},
	serviceEditButtonClick: function(inSender) {
		studio.tabs.setLayer("servicesTab");
	},
	importWebServiceButtonClick: function(inSender) {
		studio.tabs.setLayer("servicesTab");
		studio.servicesPane.page.mainTabLayers.setLayer("addLayer");
		studio.servicesPane.page.setAddServiceTypeSelectValue("Web Service");
	},
	securityOptionsButtonClick: function(inSender) {
		studio.tabs.setLayer("securityTab");
	},
	startedGuideButtonClick: function(inSender) {
		window.open('http://www.wavemaker.com/97435.html');
	},
	developerGuideButtonClick: function(inSender) {
		window.open('http://www.wavemaker.com/97436.html');
	},
	communityButtonClick: function(inSender) {
		window.open('http://dev.wavemaker.com');
	},
	deployClick: function(inSender) {
		studio.beginWait("Building WAR File...");
		studio.deploymentService.requestAsync("buildWar", null, dojo.hitch(this, "deployClickCallback"), dojo.hitch(this, "deployClickError"));
	},
	deployClickCallback: function(inResponse) {
		studio.endWait();
		alert("Succesfully created WAR file at " + inResponse + ".\n\nThis file can be deployed using standard deployment tools.");
	},
	deployClickError: function(inError) {
		studio.endWait();
		alert("Error occurred while building WAR File!\n" + inError.message);
	},
	exportClick: function(inSender) {
		studio.beginWait("Exporting Project...");
		studio.deploymentService.requestAsync("exportProject", null, dojo.hitch(this, "exportClickCallback"), dojo.hitch(this, "exportClickError"));
	},
	exportClickCallback: function(inResponse) {
		studio.endWait();
		alert("Successfully exported project to zip file at " + inResponse + ".\n\nTo import this project unzip it into the projects directory of another studio.");
	},
	exportClickError: function(inError) {
		studio.endWait();
		alert("Error occurred while exporting project!\n" + inError.message);
	},
	_end: 0
});
