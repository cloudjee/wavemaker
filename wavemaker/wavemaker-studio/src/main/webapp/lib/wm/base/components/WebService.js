/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.components.WebService");
dojo.require("wm.base.components.JavaService");

/**
	Component that provides information about Web service.
	@name wm.WebService
	@class
	@extends wm.JavaService
*/
dojo.declare("wm.WebService", wm.JavaService, {

    showJarDialog: function() {
	studio.handleMissingJar("wsdl4j.jar",
				studio.getDictionaryItem("wm.WebService.JAR_INSTRUCTIONS"));				
    },
	afterPaletteDrop: function() {	    
	    if (window["studio"] && studio.isJarMissing("wsdl4j.jar")) {
		this.showJarDialog();
		this.destroy();
		return;
	    }

		this.newWebServiceDialog();
		return true;
	},
	newWebServiceDialog: function(inSender) {
/*
		var d = this.getCreateWebServiceDialog();
		if (d.page)
			d.page.reset();
		d.show();
		*/
	    studio.webServiceTab.setShowing(true);
	    studio.webServiceTab.activate();
	    var layer = studio.webServiceSubTab.addPageContainerLayer(this.pageName || "ImportWebService", "New Service", true);
	    layer.setDestroyable(true);
	},
	getCreateWebServiceDialog: function() {
	    var pageName = this.pageName || "";
	    if (wm.WebService["newWebServiceDialog" + pageName]) {
		return wm.WebService["newWebServiceDialog" + pageName];
	    }
		var props = {
			owner: studio,
			pageName: pageName || "ImportWebService",
			hideControls: true,
			width: this.width || "800px",
		    //height: "612px",
		    height: this.height || "597px",
		    title: this.pageTitle || studio.getDictionaryItem("wm.WebService.IMPORT_TITLE")
		};
		var d = wm.WebService["newWebServiceDialog" + pageName] = new wm.PageDialog(props);
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
			    if (studio.isJarMissing("wsdl4j.jar")) {
				wm.WebService.prototype.showJarDialog();
			    } else {
				var c = new wm.WebService({name: s.name, serviceId: s.name});
				cs.push(c);
			    }
			}
		});
		return cs;
	}
});

wm.registerComponentLoader("wm.WebService", new wm.WebServiceLoader());
