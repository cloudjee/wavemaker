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


dojo.provide("wm.base.widget.Dialogs.Toast");
dojo.require("wm.base.widget.Dialogs.WidgetsJsDialog");

dojo.declare("wm.Toast", wm.WidgetsJsDialog, {
    _manageBack: false,
    classNames: "wmtoast wmtoastExtraSpecific",
    title: "",
    modal: false,
    useContainerWidget: true,
    _timeoutId: 0,
    duration: 5000,
    content: "Toast",
    height: "100px",
    width: "350px",
    corner: "br", // bottom right
    border: "2",
    margin: "0",
    prepare: function() {
        this.inherited(arguments);
        this.widgets_data = {
	    img: ["wm.Picture", {_classes: {domNode: ["ToastLeft"]}, width: "30px", height: "100%",margin: "4,0,0,4"}],
	    rightColumn: ["wm.Panel", {layoutKind: "top-to-bottom", width: "100%", height: "100%", fitToContentHeight: true, padding: "0"},{},{
		title: ["wm.Label", { height: "20px", width: "100%", singleLine: true}],
		message: ["wm.Label", { height: "100px", width: "100%", singleLine: false, autoSizeHeight: true}]
	    }]
	};
    },
    postInit: function() {
	this.inherited(arguments);
	this.containerWidget.setLayoutKind("left-to-right");
	this.containerWidget.setPadding("4");	
        this.img = this.containerWidget.c$[0];
        this.title = this.containerWidget.c$[1].c$[0];
        this.message = this.containerWidget.c$[1].c$[1];

	this.setContent(this.content);
	this.connectEvents(this.domNode, ["click"]);
    },
    click: function() {
        this.hide();
        this.onToastClick();
    },
    onToastClick: function() {},
    setShowing: function(inShow, forceChange) {
	if (!inShow) {
	    window.clearTimeout(this._timeoutId);
	    delete this._timeoutId;
	}

        this.inherited(arguments);
        if (inShow) {
            this.renderBounds();
	    this.domNode.style.zIndex = 1000;
	}
    },
    renderBounds: function() {
        this.renderBoundsByCorner();
    },
    setContent: function(inContent) {
	this.content = inContent;
        if (this.message)
            this.message.setCaption(inContent);
    },
    setTitle: function(inTitle) {
	if (this.title)
	    this.title.setCaption(inTitle);
    },
    // classes supported "Success", "Error", "Warning", "Info".  User may add their own classes via css file
    showToast: function(inContent,inDuration, inCssClasses, inPosition, optionalTitle) {
	if (!inCssClasses)
	    inCssClasses = "Info";
        if (inPosition)
            inPosition = inPosition.replace(/top/, "t").replace(/bottom/,"b").replace(/left/,"l").replace(/right/,"r").replace(/center/,"c").replace(/ /,"");
        this.corner = inPosition || app.toastPosition || "br";
	if (this._timeoutId) {
	    window.clearTimeout(this._timeoutId);
	    this.hide();
	    this._timeoutId = 0;
	}

	var localizedCssClasses = wm.getDictionaryItem("wm.Toast.STATUS_" + (inCssClasses||"").toUpperCase()) || "";

	this.setTitle(optionalTitle || localizedCssClasses || inCssClasses);
        inCssClasses = inCssClasses || "Info";
        this._toastType = inCssClasses = inCssClasses || "Info";
        var classes = (inCssClasses) ? inCssClasses.split(" ") : [];

        if (dojo.indexOf(classes, "Success") != -1) {
            this.setBorderColor("rgb(0,120,0)");
        } else if (dojo.indexOf(classes, "Error") != -1) {
            this.setBorderColor("rgb(120,0,0)");
        } else if (dojo.indexOf(classes, "Warning") != -1) {
            this.setBorderColor("#f9a215");
        } else {
            this.setBorderColor("rgb(0,0,0)");
        }

        this.message.autoSizeHeight = false;
	this.setContent(inContent);
        this.message.autoSizeHeight = true;
	this.duration = inDuration || this.duration;
	this.domNode.className = this.classNames + " " + ((inCssClasses) ? inCssClasses : "");
	this.show();
	//this.setContent(inContent);
        this.message.doAutoSize(true, true);
	this.containerWidget.removeDelayedReflow()
	this.containerWidget.reflow();
        this.setHeight((this.containerWidget.padBorderMargin.t + this.containerWidget.padBorderMargin.b + this.message.parent.bounds.h + this.padBorderMargin.t + this
.padBorderMargin.b) + "px" );

        // After a timeout, animate the toast away
	this._timeoutId = window.setTimeout(dojo.hitch(this, "hide"), this.duration);
/*
	this.domNode.style.opacity = "0.01";
	this.show();
        this.message.doAutoSize(true, true);
        this.setHeight((this.containerWidget.padBorderMargin.t + this.containerWidget.padBorderMargin.b + this.message.parent.bounds.h + this.padBorderMargin.t + this.padBorderMargin.b) + "px" );
	dojo.anim(this.domNode, { opacity: 1}, 800);
        */
    },
/*
    fadeaway: function(fromClick) {
        if (!this._timeoutId) return;
	this._timeoutId = 0;
        if (fromClick) {
	    dojo.anim(this.domNode, { opacity: 0 }, 200, null, dojo.hitch(this, function() {
                this.hide();
                this.domNode.style.opacity = 1;
            }));
        } else {
	    dojo.anim(this.domNode, { opacity: 0.01 }, 500, null, dojo.hitch(this, function() {this.hide();}));
        }
    },
    */
    // this is what is called when you bind an event handler to a dialog; call showToast so that the timer is triggered
    update: function() {
	this.showToast(this.content,this.duration, this.domNode.className);
    }

});

