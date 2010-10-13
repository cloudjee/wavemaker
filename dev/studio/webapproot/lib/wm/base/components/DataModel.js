/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.components.DataModel");
dojo.require("wm.base.components.ServerComponent");

/**
	Component that provides information about Data Model.
	@name wm.DataModel
	@class
	@extends wm.ServerComponent
*/
dojo.declare("wm.DataModel", wm.ServerComponent, {
	dataModelName: "",
	userName: "",
	password: "",
	dbType: "",
	host: "",
	port: "",
	dbName: "",
	noPrompt: false,
	afterPaletteDrop: function() {
		this.newDataModelDialog();
		return true;
	},
	newDataModelDialog: function(inSender) {
		var d = this.getCreateDataModelDialog();
		if (d.page)
			d.page.update(this);
		d.show();
	},
	getCreateDataModelDialog: function() {
		if (studio.importDBDialog) {
			return studio.importDBDialog;
		}
		var props = {
			owner: app,
			pageName: "ImportDatabase",
			hideControls: true,
			width: 700,
			height: 550
		};
		var d = studio.importDBDialog = new wm.PageDialog(props);
		d.onPageReady = dojo.hitch(d, function() {
			d.onShow = dojo.hitch(d.page, "update", this);
		});
		d.onClose = dojo.hitch(this, function(inWhy) {
			if (inWhy == "Import" || inWhy == "New")
				this.completeNewDataModel();
		});
		return d;
	},
	completeNewDataModel: function() {
		var p = this.getCreateDataModelDialog().page;
		if (p.dataModelName) {
			var n = p.dataModelName;
			var c = new wm.DataModel({name: n, dataModelName: n});
			studio.application.addServerComponent(c);
			studio.application.loadServerComponents("wm.Query");
			wm.fire(studio.getEditor("QueryEditor").page, "update");
			studio.refreshWidgetsTree();
			studio.select(c);
			this.editView();
			studio.navGotoModelTreeClick();
		}
	},
	editView: function() {
		var c = studio.navGotoEditor("DataObjectsEditor");
		if (this.dataModelName) {
			c.pageLoadedDeferred.addCallback(dojo.hitch(this, function() {
				c.page.setDataModel(this);
				return true;
			}));
		}
	},
	preNewComponentNode: function(inNode, inProps) {
		inProps.closed = true;
		inProps._data = {children: ["faux"]};
		inProps.initNodeChildren = dojo.hitch(this, "initNodeChildren");
	},
	initNodeChildren: function(inNode) {
		studio.dataService.requestSync("getTypeRefTree", null, dojo.hitch(this, function(inData) {
			var dbs = inData.dataObjectsTree;
			if (dbs) {
				dbs = dbs[0].children;
				for (var i=0, d; d=dbs[i]; i++) {
					if (d.content == this.dataModelName) {
						d.children = d.children[0].children;
						for (var ii=0, di; di=d.children[ii]; ii++) {
							var c = new wm.DataModelEntity({
								dataModelName: this.dataModelName,
								entityName: di.content
							});
							var en = studio.newComponentNode(inNode, c, c.entityName, "images/wm/cubes.png");
							en.closed = true;
							inNode.tree.renderDataNode(en, di.children);
						}
						if (!this._studioTreeNode)
							inNode.closed = true;
						return;
					}
				}
			}
		}));
		studio.addQryAndViewToTree(inNode);
	},
	designSelect: function() {
	    var c = studio.navGotoEditor("DataObjectsEditor");
	    c.page.objectPages.setLayer(c.page.DEFAULT_PAGE);
	    c.page.setDataModel(this);
	},

});

dojo.declare("wm.DataModelEntity", wm.Component, {
	dataModelName: "",
	entityName: "",
	init: function() {
		this.inherited(arguments);
		this.publishClass = this.publishClass || this.declaredClass;
	},
	write: function() {
		return "";
	},
	designSelect: function() {
		var c = studio.navGotoEditor("DataObjectsEditor");
	    c.page.objectPages.setLayer(c.page.OBJECT_PAGE);
		if (this.entityName) {
			c.pageLoadedDeferred.addCallback(dojo.hitch(this, function() {
				c.page.selectEntity(this.dataModelName, this.entityName);
				return true;
			}));
		}
	}
});

dojo.declare("wm.DataModelLoader", null, {
	getComponents: function() {
		var cs = [];
		studio.dataService.requestSync("getDataModelNames", null, function(inData) {
			for (var i in inData) {
				var n = inData[i];
				var c = new wm.DataModel({name: n, dataModelName: n});
				cs.push(c);
			}
		});
		return cs;
	}
});

wm.registerComponentLoader("wm.DataModel", new wm.DataModelLoader());

/*
sakilalight_dataModel = {
	dataModelName: "sakilalight",
	userName: "root",
	password: "",
	dbType: "MySQL",
	host: "localhost",
	port: "3306",
	dbName: "sakilalight"
};

wm.registerPackage(["Components", "Sakilalight Data Model", "wm.DataModel", "wm.base.components.DataModel", "images/wm/data_blue.png", "", sakilalight_dataModel]);
*/
