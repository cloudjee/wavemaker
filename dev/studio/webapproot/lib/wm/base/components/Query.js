/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.components.Query");
dojo.require("wm.base.components.ServerComponent");

/**
	Component that provides information about HQL query.
	@name wm.Query
	@class
	@extends wm.ServerComponent
*/
dojo.declare("wm.Query", wm.ServerComponent, {
	dataModelName: "",
	queryName: "",
	afterPaletteDrop: function() {
	    var c = studio.navGotoEditor("QueryEditor",  studio.databaseTab, this.getLayerName(), this.getLayerCaption(), true);
		c.pageLoadedDeferred.addCallback(dojo.hitch(this, function() {
			c.page.addQuery();
			studio.navGotoComponentsTreeClick();
			return true;
		}));
		return true;
	},
    getLayerName: function() {
	return this.name + "QueryLayer";
    },
    getLayerCaption: function() {
	return this.name + " (" + studio.getDictionaryItem("wm.Query.TAB_CAPTION") + ")";
    },
    editView: function() {
	var c = studio.navGotoEditor("QueryEditor", studio.databaseTab, this.getLayerName(), this.getLayerCaption());
		if (this.dataModelName && this.queryName) {
			c.pageLoadedDeferred.addCallback(dojo.hitch(this, function() {
			    // Don't regenerate the query if we're actually returning to one we're in the middle of editing
			    if (c._isNewlyCreated) {
				c.page.selectQuery(this);
				delete c._isNewlyCreated;
			    }
				return true;
			}));
		}
	},
	preNewComponentNode: function(inNode, inProps){
//		var ret;
//		inNode.forEach(dojo.hitch(this, function(n) {
//			if (n.component && (n.component instanceof wm.DataModel) && n.component.dataModelName == this.dataModelName) {
//				ret = n;
//			}
//		}));
//		return ret;
	}
});

dojo.declare("wm.QueryLoader", null, {
	getComponents: function() {
		var cs = [];
		studio.dataService.requestSync("getQueriesTree", null, function(inData) {
			var dbs = inData.dataObjectsTree;
			if (dbs) {
				dbs = dbs[0].children;
				for (var i=0, d; d=dbs[i]; i++) {
					d.children = d.children[0].children;
					for (var ii=0, di; di=d.children[ii]; ii++) {
						var c = new wm.Query({
							name: di.content, 
							dataModelName: d.content, 
							queryName: di.content
						});
						cs.push(c);
					}
				}
			}
		});
		return cs;
	}
});

wm.registerComponentLoader("wm.Query", new wm.QueryLoader());
