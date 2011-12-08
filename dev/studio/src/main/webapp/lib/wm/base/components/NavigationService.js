/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.components.NavigationService");
dojo.require("wm.base.components.Service");

/**
	Service for client side navigation.
	<br /><br />
	Navigation methods on this class are also
	available as service operations where noted.
	Service operation inputs match the
	arguments on the related method, and so they
	are not documented separately.
	<br />
	@name wm.NavigationService
	@class
	@extends wm.Service
*/
dojo.declare("wm.NavigationService", wm.Service, {
	/** @lends wm.NavigationService.prototype */
	layer: "",
	layers: "",
	operation: "",
	_operations: {
		gotoLayer: {
			parameters: {
			        layer: { type: "wm.Layer"},
				showOnlyParentLayer: {type: "boolean"}
			},
			returnType: "any",
			hint: "This operations displays the selected layer."
		},
		nextLayer: {
			parameters: {
				layers: { type: "wm.Layers"}
			},
			returnType: "any",
			hint: "The operation displays the next layer in the selected layers widget."
		},
		previousLayer: {
			parameters: {
				layers: { type: "wm.Layers"}
			},
			returnType: "any",
			hint: "The operation displays the previous layer in the selected layers widget."
		},
		gotoPage: {
			parameters: {
				pageName: { type: "string" }
			},
			returnType: "any",
			hint: "This operation displays a different page and requires a pageName."
		},
		gotoPageContainerPage: {
			parameters: {
				pageName: { type: "string" },
				pageContainer: { type: "wm.PageContainer" }
			},
			returnType: "any",
			hint: "This operation displays a page in a pageContainer and requires both a pageContainer and a pageName."
		},
		gotoDialogPage: {
			parameters: {
				pageName: {type: "string"},
				hideControls: {type: "boolean"},
				title: {type: "string"},
				modal: {type: "boolean"},
				width: {type: "number"},
				height: {type: "number"}
			},
			returnType: "any",
			hint: "This operation displays a page in a dialog."
		    },
		showToast: {
			parameters: {
				content: {type: "string"},
				duration: {type: "number"},
 			    cssClasses: {type: "string"},
                            dialogPosition: {type: "string"}
			},
			returnType: "any",
			hint: "This operation displays a page in a dialog."
		}
	},
	update: function() {
		this[this.operation || "gotoLayer"]();
	},
        invoke: function(inMethod, inArgs, inOwner) {
		var
			d = this._deferred = new dojo.Deferred(),
			m = this[inMethod];
	       
		if (m) {
		       inArgs.push(inOwner);
		       m.apply(this, inArgs);
		} else {
			this.onError();
		        /* TODO: Localize (probably not needed */
			d.errback("operation: " + inMethod + " does not exist.");
		}
		return d;
	},
	doResult: function() {
		if (this._resultConnect) {
			dojo.disconnect(this._resultConnect);
			this._resultConnect = null;
		}
		this.onResult();
		if (this._deferred && this._deferred.fired == -1)
			this._deferred.callback(true);
		this._deferred = null;
	},
	/**
		Shows a layer.
		<br /><br />
		This method is available as a configurable operation on this service.
		@param {wm.Layer} inLayer The layer to show.
	*/
	gotoLayer: function(inLayer,showParentOnly) {
		var l = inLayer instanceof wm.Layer ? inLayer : null;
		if (l)
		  this.showLayer(l,showParentOnly);
		this.doResult();
	},
	/**
		Show the next layer in a set of layers.
		<br /><br />
		This method is available as a configurable operation on this service.
		@param {wm.Layers} inLayers The set of layers to operate on.
	*/
	nextLayer: function(inLayers) {
		var l = inLayers instanceof wm.Layers ? inLayers : null;
		if (l)
			l.setNext();
		this.doResult();
	},
	/**
		Show the previous layer in a set of layers.
		<br /><br />
		This method is available as a configurable operation on this service.
		@param {wm.Layers} inLayers The set of layers to operate on.
	*/
	previousLayer: function(inLayers) {
		var l = inLayers instanceof wm.Layers ? inLayers : null;
		if (l)
			l.setPrevious();
		this.doResult();
	},
	showLayer: function(inLayer,showParentOnly) {
		var l = inLayer;
		while (l) {
			wm.fire(l, "activate");
			l = l.parent;
			if (showParentOnly) break;
		}
	},
	/**
		Dynamically load and show a top level page.
		<br /><br />
		This method is available as a configurable operation on this service.
		@param {String} inPageName The page to load.
	*/
        gotoPage: function(inPageName, inOwner) {
	    var page = inOwner.getParentPage();
	    // If no app level page exists yet (untested condition that probably never arises)
	    // Or if inOwner has no page (untested condition that implies the owner is app level or has an improperly set owner)
	    // Or if the page of inOwner is the app level page, then change the app level page
	    if (!app._page || !page || page == app._page) {
		this._resultConnect = dojo.connect(app, "onPageChanged", this, "doResult");

                // Delay openning the page as loading the page immediately will cause the widgets/components that triggered this to be destroyed in the
                // middle of calling this.  Use wm.job so that if another page request fires, this one is canceled
                wm.job(this.getRuntimeId() + ": PageChange", 1, function() {
		    app.loadPage(inPageName);
                });
	    } else if (page.owner instanceof wm.PageContainer || page.owner instanceof wm.PageContainerMixin) {
		this.gotoPageContainerPage(inPageName, page.owner);
	    }
	},
	/**
		Dynamically load and show a page inside of a page container.
		<br /><br />
		This method is available as a configurable operation on this service.
		@param {String} inPageName The page to load.
		@param {wm.PageContainer} inPageContainer The page container that will contain the page.
	*/
	gotoPageContainerPage: function(inPageName, inPageContainer) {
		if (inPageContainer) {
			// note, pageContainer does not call onPageChanged unless a page actually changed
			// to avoid confusion, we choose to process the navigation regardless
			// so call doResult manually if the page will not change.
			if (inPageName != inPageContainer.pageName) {
			    this._resultConnect = dojo.connect(inPageContainer, "onPageChanged", this, "doResult");
			    inPageContainer.setPageName(inPageName);

			} else
				this.doResult();
		} else
			wm.logging && console.debug("pageContainer not found", inPageContainer);
	},
	/**
		Dynamically load and show a page inside of dialog box.
		<br /><br />
		This method is available as a configurable operation on this service.
		@param {String} inPageName The page to load.
		@param {Boolean} inHideControls Set true to hide the default dialog controls.
		@param {Number} inWidth The width of the dialog content area in pixels.
		@param {Number} inHeight The height of the dialog content area in pixels.
	*/
	    gotoDialogPage: function(inPageName, inHideControls, inTitle, inModal, inWidth, inHeight) {
		this._resultConnect = dojo.connect(app.pageDialog, "onPageReady", this, "doResult");
		app.pageDialog.showPage(inPageName, inHideControls, String(inWidth || 450) +"px", String(inHeight || 300) +"px", inTitle, inModal);
	},
        showToast: function(inContent, inDuration, cssClasses, toastPosition) {
	    app.toastDialog.showToast(inContent, inDuration, cssClasses, toastPosition);
	    this._deferred.callback(); // the action is now complete; fire any deferred code (clears this._requester)
	}

});

wm.services.add({name: "navigationService", ctor: "wm.NavigationService", isClientService: true, clientHide: true});
