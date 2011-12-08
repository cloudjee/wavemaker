/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Dialogs.WidgetsJsDialog");
dojo.require("wm.base.widget.Dialogs.Dialog");



dojo.declare("wm.WidgetsJsDialog", wm.Dialog, { 
    margin: "0,4,4,0",// for shadow styles
    useContainerWidget: true,
    widgets_data: null,
    widgets_json: "",
    width: "400px",
    height: "150px",

    setShowing: function(inShowing, forceChange) {
	this.inherited(arguments);
	if (this.isReflowEnabled() && !this._rendered) {
	    this.leafFirstRenderCss();
	    this._rendered = true;
	}
    },
    postInit: function() {
	this.inherited(arguments);
	if (!this.widgets_data)
	    this.setWidgetsJson(this.widgets_json);
	this.generateContents();
	this.containerWidget.setPadding("0");
	this.renderBounds();
	this.reflow();
    },

    setWidgetsJson: function(inJson) {
	try {
	    this.widgets_json = inJson;
	    this.widgets_data = dojo.fromJson(this.widgets_json);
	    if (!this._cupdating)
		this.generateContents();
	} catch(e) {console.error(e);}
    },
    generateContents: function() {
	if (this._generated) return;
	this._generated = true;
	this.containerWidget._cupdating = true;
	this.containerWidget.createComponents(this.widgets_data, this);
	this.containerWidget._cupdating = false;
	this.containerWidget.reflow();
	if (this.button_data) {
	    if (!this.buttonBar) {
		var containerWidget = this.containerWidget;
		var containerNode = this.containerNode;
		delete this.containerWidget;
		delete this.containerNode;
		this.createButtonBar();
		this.containerWidget = containerWidget;
		this.containerNode = containerNode;
	    }
	    this.buttonBar.createComponents(this.button_data, this);
	}
    }
});
