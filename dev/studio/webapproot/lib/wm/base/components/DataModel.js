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
	noInspector: true,
	dataModelName: "",
	userName: "",
	password: "",
	dbType: "",
	host: "",
	port: "",
	dbName: "",
	noPrompt: false,
        _type: "import",
	afterPaletteDrop: function() {
		this.newDataModelDialog();
		return true;
	},
	newDataModelDialog: function(inSender) {
	    if (this._type == "import") {
		var d = this.getCreateDataModelDialog();
		if (d.page)
		    d.page.update(this);
		d.show();
	    } else {
		app.prompt("Enter your data model name", "MyTestDatabase", dojo.hitch(this, "createDataModel"));
	    }
/*
	    if (this._type == "import") {
		d.page.tabs.setLayerIndex(0);
		d.setHeight("300px");
	    } else {
		d.page.tabs.setLayerIndex(1);
		d.setHeight("150px");
	    }
	    */
	},
	createDataModel: function(inValue) {
	        this._dataModelName = inValue;
		studio.beginWait("Adding " + inValue);
		studio.dataService.requestAsync(NEW_DATA_MODEL_OP, 
			[inValue], 
			dojo.hitch(this, "newDataModelResult"), 
			dojo.hitch(this, "newDataModelError"));
	},
	newDataModelError: function(inError) {
		app.alert(inError);
	},
	newDataModelResult: function() {
	    this.completeNewDataModel();  
	    studio.endWait("Adding " + this._dataModelName);
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
		    height: 340,
		    title: "New Data Model"
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
		if (this._dataModelName || p.dataModelName) {
			var n = this._dataModelName || p.dataModelName;
			var c = new wm.DataModel({name: n, dataModelName: n});
			studio.application.addServerComponent(c);
			studio.application.loadServerComponents("wm.Query");
		        var layers = studio.tabs.layers;
		    var done;
		    for (var i = 0; !done && i < layers.length; i++) {
			var l = layers[i];
			var widgets = l.c$;
			for (var j = 0; j < widgets.length; j++)
			    if (widgets[j] instanceof wm.PageContainer) {
				done = true;
				if (widgets[j].page instanceof QueryEditor)
				    widgets[j].page.updateDataModelInput();
				break;
			    }
		    }
			studio.refreshServiceTree();

		    // If designing a data model
		    if (this._dataModelName) {
			studio.select(c);
			this.editView();
			studio.navGotoComponentsTreeClick();
 			wm.fire(studio.getEditor("DataObjectsEditor", studio.databaseTab, this.getLayerName(), this.getLayerCaption()).page, "newDataModelResult");
 			var page = studio.getEditor("DataObjectsEditor", studio.databaseTab, this.getLayerName(), this.getLayerCaption()).page;
			page.objectPages.setLayer(page.DEFAULT_PAGE);
		    } 

		    // else we're importing a datamodel
		    else {
			app.toastSuccess(n + " has been imported");
		    }
		}
	},
	editView: function() {
	    var c = studio.navGotoEditor("DataObjectsEditor", studio.databaseTab, this.getLayerName(), this.getLayerCaption());
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
	    if (studio.tree.selected.component instanceof wm.DataModelEntity) return;
	    var c = studio.navGotoEditor("DataObjectsEditor", studio.databaseTab, this.getLayerName(), this.getLayerCaption());
	    studio.selected._studioTreeNode.setOpen(true);
	    c.page.setDataModel(this);
	    c.page._selectNode();
/*
	    if (studio.selected._studioTreeNode.kids.length) {
		var entityName = studio.selected._studioTreeNode.kids[0].content;
		c.page.objectPages.setLayer(c.page.OBJECT_PAGE);
	    } else {
		c.page.objectPages.setLayer(c.page.DEFAULT_PAGE);
	    }
*/
	},
    getLayerName: function() {
	return this.name + "DataModelLayer";
    },
    getLayerCaption: function() {
	return this.name + " (" + bundleStudio["TabCaption_DataModelEntity"] + ")";
    }

});

dojo.declare("wm.DataModelEntity", wm.Component, {
	noInspector: true,
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
	    var c = studio.navGotoEditor("DataObjectsEditor", studio.databaseTab, this.getLayerName(), this.getLayerCaption());
	    c.page.objectPages.setLayer(c.page.OBJECT_PAGE);
		if (this.entityName) {
			c.pageLoadedDeferred.addCallback(dojo.hitch(this, function() {
				c.page.selectEntity(this.dataModelName, this.entityName);
				return true;
			}));
		}
	},
    getLayerName: function() {
	return this.dataModelName + "DataModelLayer";
    },
    getLayerCaption: function() {
	return this.dataModelName + " (" + bundleStudio["TabCaption_DataModelEntity"] + ")";
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
