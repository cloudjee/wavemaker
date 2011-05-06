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


dojo.provide("wm.base.widget.JsonStatus");
dojo.require("wm.base.Control");

dojo.declare("wm.JsonStatus", wm.Control, {
    scrim: true,
    classNames: "wmjsonstatus",
    width: "24px",
    height: "28px",
    border: "2",
    iconWidth: 20,
    iconHeight: 20,
    statusBar: false,
    argsList: null,
    minimize: false,
    build: function() {
	this.inherited(arguments);

	this.buttonNode = document.createElement("div");
	dojo.addClass(this.buttonNode, "wmjsonstatusicon");
	this.domNode.appendChild(this.buttonNode);

	this.messageNode = document.createElement("div");
	dojo.addClass(this.messageNode, "wmjsonstatuslabel");
	this.domNode.appendChild(this.messageNode);
    },
    init: function() {
	this.inherited(arguments);
	this.connect(wm.inflight, "add", this, "add");
	this.connect(wm.inflight, "remove", this, "remove");
	this.connect(this.domNode, "onclick", this, "onclick");
	this.argsList = [];
    },
    add: function(inDeferred, inService, optName, inArgs, inMethod, invoker) {
	this.updateSpinner();
	if (this.bounds.w > 40)
	    this.updateMessage();
    },
    remove: function(inDeferred, inResult) {
	this.updateSpinner();
	if (this.bounds.w > 40)
	    this.updateMessage();
    },
    updateSpinner: function() {
	if (wm.inflight._inflight.length)
	    dojo.addClass(this.domNode, "wmStatusWaiting");
	else
	    dojo.removeClass(this.domNode, "wmStatusWaiting");
    },
    updateMessage: function() {
	this.messageNode.innerHTML = wm.Array.last(wm.inflight._inflightNames) || "";
    },
    setMinimize: function(inMinimize) {
	if (inMinimize) {
	    this.setWidth((parseInt(this.iconWidth) + this.padBorderMargin.l + this.padBorderMargin.r) + "px");
	    this.setHeight((parseInt(this.iconHeight) + this.padBorderMargin.t + this.padBorderMargin.b) + "px");
	    this.messageNode.innerHTML = "";
	} else {
	    this.setWidth("80px");
	}
    },
    onclick: function() {
	if (djConfig.isDebug || window["studio"])
	    app.debugDialog.show();
    }
});
