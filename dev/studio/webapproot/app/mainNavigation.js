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
dojo.provide("wm.studio.app.mainNavigation");

Studio.extend({
	navGotoDesignerClick: function() {
		this.disableMenuBar(false);
		this.disableCanvasOnlyMenuItems(false);
		this.toggleCanvasSourceBtns(true, false, false);
		this.tabs.setLayer("workspace");
            if (this.page) {
                if (this._themeDesignerChange) {
                    this._themeDesignerChange = false;
                    studio.application.useWidgetCache();
                }
                if (this._reflowPageDesigner ) {
                    this._reflowPageDesigner = false;
                    wm.onidle(this.page, "reflow");
                }
            }
		//this.mainAndResourcePalettes.setLayer("mainPalettes");
		//wm.fire(this.page, "reflow");
	},
	navGotoSourceClick: function() {
		this.disableMenuBar(false);
		this.disableCanvasOnlyMenuItems(true);
		this.toggleCanvasSourceBtns(false, true, false);
		this.tabs.setLayer("sourceTab");
		//this.mainAndResourcePalettes.setLayer("mainPalettes");
	},
	navGotoResourcesClick: function() {
		this.disableMenuBar(false);
		this.disableCanvasOnlyMenuItems(true);
		this.toggleCanvasSourceBtns(false, false, true);
		this.tabs.setLayer("resourcesTab");
		//this.mainAndResourcePalettes.setLayer("resourcePaletteLayer");
		this.resourcesPage.getComponent("resourceManager").loadResources();
	},
	navGoToLoginPage: function() {
		this.disableCanvasOnlyMenuItems(true);
		this.disableMenuBar(true);
		if (this.loginPage.page != "Login")
		  this.loginPage.setPageName("Login");
		this.tabs.setLayer("loginLayer");
	},
	navGoToDeploymentPage: function() {
		this.disableMenuBar(false);
		this.disableCanvasOnlyMenuItems(true);
		this.toggleCanvasSourceBtns(false, false, false);
		if (this.deploymentPage.page != "DeploymentPage")
		  this.deploymentPage.setPageName("DeploymentPage");
		this.tabs.setLayer("deploymentLayer");
		if (this.deploymentPage.page && this.deploymentPage.page instanceof DeploymentPage)
		  this.deploymentPage.page.setup();
	  },
	isLoginShowing: function() {
	    return this.tabs.getLayer().name == "loginTab";
	},
	toggleCanvasSourceBtns: function(inCanvasOn, inSourceOn, inResourcesOn) {
		dojo.removeClass(this.designerCanvasBtn.domNode, (inCanvasOn ? "Studio-sourceCanvasBtn" : "Studio-designerCanvasBtn"));
		dojo.addClass(this.designerCanvasBtn.domNode, (inCanvasOn ? "Studio-designerCanvasBtn" : "Studio-sourceCanvasBtn"));
		dojo.removeClass(this.designerSourceBtn.domNode, (inSourceOn ? "Studio-designerSourceBtn" : "Studio-sourceSourceBtn"));
		dojo.addClass(this.designerSourceBtn.domNode, (inSourceOn ? "Studio-sourceSourceBtn" : "Studio-designerSourceBtn"));
		dojo.removeClass(this.designerResourcesBtn.domNode, (inResourcesOn ? "Studio-designerResourceBtn" : "Studio-sourceResourceBtn"));
		dojo.addClass(this.designerResourcesBtn.domNode, (inResourcesOn ? "Studio-sourceResourceBtn" : "Studio-designerResourceBtn"));

	},
	disableCanvasSourceBtns: function(inDisable) {
		this.leftToolbarButtons.setDisabled(inDisable);
		this.leftToolbarButtons.reflow();
	},
	navGotoEditor: function(inEditorName) {
		this.disableCanvasOnlyMenuItems(true);
		this.toggleCanvasSourceBtns(false, false);
		return this.getEditor(inEditorName, true);
	},
	getEditor: function(inEditorName, inNav) {
		var n = wm.decapitalize(inEditorName);
		var i = this.tabs.indexOfLayerName(n);
		if (i < 0) {
			return this.addEditor(inEditorName, inNav);
		} else {
			inNav && this.tabs.setLayerIndex(i);
			return this.tabs.getLayer(i).getOrderedWidgets()[0];
		}
	},
	addEditor: function(inEditorName, inNav) {
		var n = wm.decapitalize(inEditorName);
		var t = inNav ? this.tabs.addLayer(n) : this.tabs.createLayer(n);
		var editor = studio.createComponent(n + "Container", "wm.PageContainer", {
			parent: t,
			pageName: inEditorName,
			width: "100%",
			height: "100%"
		});
		editor.reflowParent();
		return editor;
	},
	navGotoPaletteModelClick: function() {
		var n = this.left.getLayerCaption();
		switch (n) {
			case "Palette":
				this.navGotoModelTreeClick();
				break;
			case "Model":
			default:
				this.navGotoPaletteTreeClick();
				break;
				
		}
	},
	navGotoPaletteTreeClick: function() {
		this.left.setLayer("mlpal");
	},
	navGotoModelTreeClick: function() {
		this.left.setLayer("leftObjects");
	},
	navGotoProjectTreeClick: function() {
		this.left.setLayer("projects");
	}
});
