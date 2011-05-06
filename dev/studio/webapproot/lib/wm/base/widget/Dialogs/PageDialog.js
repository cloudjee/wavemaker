/*
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Dialogs.PageDialog");
dojo.require("wm.base.widget.Dialogs.Dialog");
dojo.require("wm.base.widget.PageContainer");


dojo.declare("wm.pageContainerMixin", null, {
	pageName: "",
	hideControls: false,
	pageProperties: null,
        deferLoad: false, // I'd rather this were true, but projects (AND STUDIO!) will break until users go through and change deferLoad back to false
	initPageContainer: function() {
	    this.pageContainer = new wm.PageContainer({loadParentFirst: false, deferLoad: false, parent: this, owner: this, flex: 1, pageProperties: this.pageProperties});
		this._connections.push(this.connect(this.pageContainer, "onPageChanged", this, "_pageChanged"));
		this._connections.push(this.connect(this.pageContainer, "onError", this, "onError"));
		this.pageContainer.dismiss = dojo.hitch(this, "dismiss");
		if (this.pageName && !this.deferLoad)
			this.setPage(this.pageName);
	    this.createControls();
	},
        onError: function(inErrorOrMessage) {},
	setPage: function(inPageName) {
		if (inPageName) {
		    if (this.pageContainer.pageName != inPageName) {
                        if (this.page) 
                            this.page.root.hide();
		        this.pageContainer.setPageName(inPageName);
                    }
		    else
			this.onPageReady();
		}
	},
    showPage: function(inPageName, inHideControls, inWidth, inHeight, inTitle, inModal) {
	if (inTitle !== undefined) this.setTitle(inTitle);
	if (inModal !== undefined) this.setModal(inModal);
		this.setContainerOptions(inHideControls, inWidth, inHeight);
		this.setShowing(true);
		this.setPage(inPageName);
		// IE requires reflow here
		this.reflow();
	},
	setContainerOptions: function(inHideControls, inWidth, inHeight) {
		this.setHideControls(inHideControls);
	},
	_pageChanged: function() {
		this.page = this.pageContainer.page;
		this[this.page.name] = this.page;
		this.onPageReady();
		this.reflow();
		wm.focusContainer(this.page.root);
	},
	onPageReady: function() {
	},
	forEachWidget: function(inFunc) {
		return this.pageContainer.forEachWidget(inFunc);
	},
	createControls: function() {
	    var cp = this.controlsPanel = new wm.Panel({ parent: this,
							 owner: this,
							 layoutKind: "top-to-bottom",
							 horizontalAlign: "left",
							 verticalAlign: "top",
							 height: "40px",
							 width: "100%",
						         border: this.footerBorder || "",
							 borderColor: this.footerBorderColor || "",
							 flags: {notInspectable: true}});
	    if (!this.noBevel)
		this.controlsBevel = new wm.Bevel({ parent: cp, owner: this });
		var bp = this.buttonPanel = new wm.Panel({ parent: cp, owner: this, width: "100%", height: "100%", layoutKind: "left-to-right", horizontalAlign: "right"});
		dojo.addClass(bp.domNode, "wmpagedialog-controlspanel");
		this.closeButton = new wm.Button({ parent: bp, 
						   owner: this, 
						   caption:  wm.getDictionaryItem("wm.PageDialog.CAPTION_CLOSE"),
						   width: "80px", 
						   height: "100%"})
		this._connections.push(this.connect(this.closeButton, "onclick", this, "dismiss"));
		cp.setShowing(!this.hideControls);
		cp = null;
		bp = null;
	},
	setHideControls: function(inHideControls) {
		if (inHideControls !== undefined) {
			this.hideControls = inHideControls;
			this.controlsPanel.setShowing(!inHideControls);
		}
	},
    destroy: function() {
		if (this.controlsPanel) 
		{
			this.controlsPanel.destroy();
			this.controlsPanel = null;
		}
		
		if (this.closeButton) 
		{
			this.closeButton.destroy();
			this.closeButton = null;
		}
		
		if (this.controlsBevel) 
		{
		    this.controlsBevel.destroy();
			this.controlsBevel = null;
		}
		
		if (this.buttonPanel) 
		{
		    this.buttonPanel.destroy();
			this.buttonPanel = null;
		}


		if (this.pageContainer) 
		{
			this.pageContainer.dismiss = null;
		    this.pageContainer.destroy();
			this.pageContainer = null;
		}
		
	    this.inherited(arguments);
	}
});

dojo.declare("wm.PageDialog", [wm.Dialog, wm.pageContainerMixin], {
        noBevel: false,
    footerBorder: "",
    footerBorderColor: "",
	postInit: function() {
		this.inherited(arguments);
		this.initPageContainer();
	},
        setShowing: function(inShow, forceChange) {
	    this.inherited(arguments);
            if (this.deferLoad && inShow)
                this.setPage(this.pageName);
        },
        setPageName: function(inPageName) {
	    if (this._pageLoading)
		return;
	    if (this.isDesignLoaded()) {
		var newPage = studio.getDictionaryItem("wm.PageContainer.NEW_PAGE_OPTION");
		if (inPageName == newPage)
	            return this.pageContainer.createNewPage();
	    }

	    return this.setPage(inPageName);
	},
        setPage: function(inPageName) {
	    this.pageName = inPageName;
            if (inPageName && this.pageContainer.pageName != inPageName) 
                this.showLoadingIndicator();
            this.inherited(arguments);
        },
	setContainerOptions: function(inHideControls, inWidth, inHeight) {
		inWidth = inWidth || wm.Dialog.prototype.contentWidth;
		inHeight = inHeight || wm.Dialog.prototype.contentHeight;
	        if (!dojo.isString(inWidth)) inWidth += "px";
	        if (!dojo.isString(inHeight)) inHeight += "px";
		this.setWidth(inWidth);
		this.setHeight(inHeight);
		this.inherited(arguments);
	},
	hideLoadingIndicator: function() {
            if (this._loader) {
	        dojo._destroyElement(this._loader);
                delete this._loader;
            }
	},
        showLoadingIndicator: function() {
            if (this.width < 150 || this.height < 80) return;
            var text = "&nbsp;Loading...";
            var imgsrc = wm.theme.getImagesPath() + "loadingThrobber.gif";
	    this._loader = wm.createElement("div", {
	        id: "_wm_loading_" + this.id,
	        innerHTML: '<div class="_wm_loading" style="position: absolute; font-weight: bold; font-size: 10pt; z-index: 100; top: 40%; left: 40%;"><img alt="loading" style="vertical-align: middle" src="' + imgsrc + '" />' + text + '</div>'});
	    this.domNode.appendChild(this._loader);
        },
    onPageReady: function() {
            this.hideLoadingIndicator();
    },
    makePropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "pageName":
	    return new wm.propEdit.PagesSelect({component: this, name: inName, value: inValue, newPage: true});
	}
	return this.inherited(arguments);
    },

    destroy: function() {
	    //this.pageContainerMixinDestroy();
	    this.inherited(arguments);
		if (this.containerNode)
		{
			dojo.destroy(this.containerNode);
			this.containerNode = null;
		}
		
		this.c$ =[];
	}
});
