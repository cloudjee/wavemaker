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
dojo.provide("wm.base.components.WebService");
dojo.require("wm.base.components.JavaService");

/**
	Component that provides information about Web service.
	@name wm.WebService
	@class
	@extends wm.JavaService
*/
dojo.declare("wm.WebService", wm.JavaService, {
	afterPaletteDrop: function() {
		this.newWebServiceDialog();
		return true;
	},
	newWebServiceDialog: function(inSender) {
		var d = this.getCreateWebServiceDialog();
		if (d.page)
			d.page.reset();
		d.show();
	},
	getCreateWebServiceDialog: function() {
		if (wm.WebService.newWebServiceDialog) {
			return wm.WebService.newWebServiceDialog;
		}
		var props = {
			owner: studio,
			pageName: "ImportWebService",
			hideControls: true,
			width: "800px",
		    height: "600px",
		    title: "Import Web Service"
		};
		var d = wm.WebService.newWebServiceDialog = new wm.PageDialog(props);
		d.onClose = dojo.hitch(this, function(inWhy) {
			if (inWhy == "Import")
				this.completeNewWebService();
		});
		return d;
	},
	completeNewWebService: function() {
		var p = this.getCreateWebServiceDialog().page;
		if (p.serviceId) {
			var n = p.serviceId;
			var c = new wm.WebService({name: n, serviceId: n});
			studio.updateServices();
			studio.application.addServerComponent(c);
			studio.refreshServiceTree();
			studio.select(c);
		        c.editView();
			studio.navGotoComponentsTreeClick();
		}
	},
	editView: function() {
	    var c = studio.navGotoEditor("Services", studio.webServiceTab,  this.getLayerName(), this.getLayerCaption());
		if (this.serviceId) {
			c.pageLoadedDeferred.addCallback(dojo.hitch(this, function() {
				c.page.selectService(this);
				return true;
			}));
		}
	},
    getLayerName: function() {
	return this.name + "WebServiceLayer";
    },
    getLayerCaption: function() {
	return this.name;// + " (" + bundleStudio["TabCaption_WebService"] + ")";
    }
});

dojo.declare("wm.WebServiceLoader", null, {
	getComponents: function() {
		var cs = []
		wm.services.forEach(function(s) {
			if (s.type == "WebService") {
				var c = new wm.WebService({name: s.name, serviceId: s.name});
				cs.push(c);
			}
		});
		return cs;
	}
});

wm.registerComponentLoader("wm.WebService", new wm.WebServiceLoader());
