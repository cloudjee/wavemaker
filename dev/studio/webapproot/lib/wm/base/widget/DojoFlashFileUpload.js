/*
 *  Copyright (C) 2010-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.DojoFlashFileUpload");
dojo.require("wm.base.widget.DojoFileUpload");

dojo.declare("wm.DojoFlashFileUpload", wm.DojoFileUpload, {
    uploadImmediately: true,
    _uploaderType: "flash",

    // Label to go on the flash file browser; ignored for html widget
    fileMaskLabel: "All Images",

    // List of file patterns to accept by flash file browser; ignored for html widget
    fileMaskList: "*.png;*.jpg;*.jpeg;*.gif",

    // JavaService name and operation name
    service: "FlashUploadDownload",
    operation: "uploadFile",




    // Load classes (our package loader should have already loaded the dijit if the widget has loaded)
    // initialize new types
    // setup design time parameters
    init: function() {
	this.inherited(arguments);
        if (this.isDesignLoaded()) {
            try {
                var methods = this._serviceVariable._service._service.smd.methods;
                var methodIndex = wm.Array.indexOf(methods, "uploadFile", function(a,b) {return a.name == b;});
                var params = methods[methodIndex].parameters;
                var ignoreList = ["ignored", "Filename", "file"];
                for (var i = 0; i < params.length; i++) {
                    if (dojo.indexOf(ignoreList, params[i].name) != -1)
                        params[i].hidden = true;
                }
                for (var i = 0; i < ignoreList.length; i++)
                    if (this._serviceVariable._operationInfo.parameters[ignoreList[i]])
                        this._serviceVariable._operationInfo.parameters[ignoreList[i]].hidden = true;
            } catch(e) {}
        }
    },

    // We created the components in init; we don't need the widgets created until postInit
    // here we create the wm.Html, the progressbar and the button.
    postInit: function() {
	this.inherited(arguments);

        // Without this, that flash widget will show up even if its not visible
        if (!this.button.isAncestorHidden()) {
            this.createDijit();
        } 
    },
    setUploadImmediately: function(inVal) {
        this.uploadImmediately = inVal;
	if (this._isDesignLoaded) {
	    if (this.uploadImmediately) {
		this.setButtonCaption(studio.getDictionaryItem("wm.DojoFlashFileUpload.CAPTION_UPLOAD")); //"Upload..." : "Select Files");
	    } else {
		this.setButtonCaption(studio.getDictionaryItem("wm.DojoFlashFileUpload.CAPTION_SELECT")); //"Upload..." : "Select Files");
	    }
	}
    },
    createButton: function() {
        this.inherited(arguments);
        this.button.connect(this.button, "renderBounds", this, function() {
            if (!this.dijit) {
                this._buttonBounds = dojo.clone(this.button.bounds);
            } else if (!this.button.isAncestorHidden() && !this._inCreateDijit && this.dijit && 
                       (this._buttonBounds.l != this.button.bounds.l ||
                        this._buttonBounds.t != this.button.bounds.t ||
                        this._buttonBounds.w != this.button.bounds.w ||
                        this._buttonBounds.h != this.button.bounds.h)) {
                this.createDijit();
            }
        });
    },
    flashLoaded: function() {
        this._flashWidget = dojo.query("embed",this.domNode)[0];
        this.adjustButtonHeight();
        this.adjustButtonWidth();
    },
    createDijit2: function() {
        this.inherited(arguments);
        if (!this.dijit) return;
        this.connect(this.dijit, "onLoad", this, "flashLoaded");

        // Point the button to the new nodes created by the dijit, set the opacity
        // of the flash widget to 0.01, and make sure we reset the buttoncaption which was cleared
        // to minimize the text showing up in the flash widget hovering over the button we want users to see.        
            this.button.dom.node = this.button.btnNode = this.button.domNode = this.dijit.domNode;
            var div = document.createElement("div");
            var s = div.style;
            s.height = "100%";
            s.width = "100%";
            s.textAlign = "center";
        s.lineHeight = this.button.getContentBounds().h + "px"; // NOTE: This means button must have a single line caption
                this.button.domNode.appendChild(div);
                this.button.btnNode = div;

                this.dijit.insideNode.style.opacity = "0.01";
                this.dijit.insideNode.style.filter = "alpha(opacity=1)";

        this.button.caption = this.buttonCaption;
        this.button.render(true,true);      

    },
    getPath: function() {
        var l = window.location;
        var path = l.protocol + "//" + l.host + l.pathname.replace(/[^\/]*$/, ""); // strip out any index.html index.php myfile.xxx from the pathane; should end with "/"
        path += "services/" + this.service + ".flashUploader?method=" + this.operation + "&sessionid="+ app.getSessionId();
        return path;
    },
        adjustButtonWidth: function(inWidth) {
/*
            if (this._flashWidget) {
                this._flashWidget.width = this.button.bounds.w;
                this._flashWidget.parentNode.style.width =  this.button.bounds.w + "px";
            }
            */
        },
        adjustButtonHeight: function() {
/*
            if (this._flashWidget) {
                this._flashWidget.height = this.button.bounds.h;
                this._flashWidget.parentNode.style.height =  this.button.bounds.h + "px";
            }
            */
        },



    reset: function() {
        this.inherited(arguments);
        if (!this.uploadImmediately) {
            var data = this.variable.getData();
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                this.dijit.removeFile(d.name);
            }
        }
    },
    change: function(fileList) {
        this.updateVariable();
        if (!this.uploadImmediately) {
            this._state = "filestoupload";
            this.progressBar.hide();
            if (this.useList) {
                this.updateHtml();
                this.html.show();
            }
        } else {
	    this.onChange();
            wm.job(this.getRuntimeId() + ": upload()", 100, dojo.hitch(this, "upload"));
        }
    },
    _end: 0
});

wm.Object.extendSchema(wm.DojoFlashFileUpload, {
    fileMaskLabel: {group: "edit"},
    fileMaskList: {group: "edit"},
    uploadImmediately: {group: "edit"}
});

