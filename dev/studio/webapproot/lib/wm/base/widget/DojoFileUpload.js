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
dojo.provide("wm.base.widget.DojoFileUpload");
dojo.require("wm.base.widget.Panel");
dojo.require("dojo.io.iframe");


dojo.declare("wm.DojoFileUpload", wm.Container, {
    _tmpcounter: 0,
    useList: true,
    className: "wmdojofileupload",
    uploadImmediately: true,
    buttonCaption: "Upload...",
    buttonWidth: "80",

    variable: "",
    _serviceVariable: "", // for design time use in getting list of operations and services
    input: "", // input variable to provide additional parameters to go with files

    verticalAlign: "top",
    horizontalAlign: "top",

    width: "300px",
    height: "80px",
    scrim: true,
    lock: true,
    layoutKind: "left-to-right",
    fileMaskLabel: "All Images",
    fileMaskList: ".png;.jpg;.jpeg;.gif",
    service: "FileUploadDownload",
    operation: "uploadFile",
    multipleFiles: true,
    _state: "",
    //noDeletionAfterLoad: false,
    destroy: function() {
        if (this.dijit)
            this.dijit.destroy();
        if (this.button)
            this.button.destroy();
        if (this.buttonPanel)
            this.buttonPanel.destroy();
        if (this.html)
            this.html.destroy();
        delete this.$.input; // this widget doesn't really own input; the servicevariable does
	this.inherited(arguments);
    },

    afterPaletteDrop: function() {
	this.inherited(arguments);
        try {
            var found = false;
            var components = studio.application.getServerComponents();
            for (var i = 0; i < components.length; i++) {
                if (components[i].name == "FileUploadDownload") 
                    found = true;
            }
            if (!found) {
                var javaservice = new wm.JavaService({owner: studio.application, initialNoEdit: true, javaTemplate: "FileUploadDownload.java"});
                var result = studio.studioService.requestSync("getJavaServiceTemplate", [javaservice.javaTemplate]).results[0];
                javaservice.newJavaServiceWithFunc("FileUploadDownload", "FileUploadDownload", result);
            }
        } catch(e) {
            console.error("DojoFileUpload.js failed to create javaservice:" + e);
        }
    },
	init: function() {
	    this.inherited(arguments);
            dojo.require("dojox.form.FileUploader");
            if (!wm.typeManager.isType("wm.DojoFileUpload.FileData")) {
                wm.typeManager.addType("wm.DojoFileUpload.FileData", 
                                       {internal: true, 
                                        fields: {"name": {type: "String", isObject: false, isList: false},
                                                 "path": {type: "String", isObject: false, isList: false},
                                                 "error":{type: "String", isObject: false, isList: false},
                                                 "width":{type: "String", isObject: false, isList: false},
                                                 "height":{type: "String", isObject: false, isList: false},
                                                 "percent":{type: "Number", isObject: false, isList: false},
                                                 "uploaded":{type: "boolean", isObject: false, isList: false},
                                                 "tmpid": {type: "Number", isObject: false, isList: false},
                                                 "included": {type: "Boolean", isObject: false, isList: false}
                                                }});
                                                                 
            }

            this.variable = new wm.Variable({name: "variable", owner: this, type: "wm.DojoFileUpload.FileData", isList: true});
            this.variable.isList= true; // this value got killed off by Variable.js:setType
            this._serviceVariable = new wm.ServiceVariable({owner: this, operation: this.operation, service: this.service});
        },
    postInit: function() {
	this.inherited(arguments);

        if (this.$.input) {
            this._serviceVariable.$.input = this._serviceVariable.input = this.$.input;
            this._serviceVariable.operationChanged();
        } else {
            this.$.input = this._serviceVariable.$.input;
        }
        this.input = this.$.input;
        
        this.html = new wm.Html({parent: this, owner: this, name: "html", width: "100%", height: "100%", border: "1", showing: this.useList});
        this.progressBar = new wm.dijit.ProgressBar({parent: this, owner: this, showing: false, width: "100%", height: "100%"});

        // This panel is here because dojo changes the style.position and left of this.button; but it won't matter if its position is determined by its parent panel
        this.buttonPanel = new wm.Panel({layoutKind: "left-to-right", width: (this.useList) ? this.buttonWidth + "px": "100%", height: wm.Button.prototype.height, owner: this, parent: this, horizontalAlign: "left", verticalAlign: "top"});
        this.createButton();

        // Style gets copied into the flash widget and the user just sees the flash widget (handled by dijit)
        // We have a hack for better browsers where not all styling is being shown; we have the style copied be
        // something trivial, and then we set the opacity for the flash to 0.01.  

            this.buttonClasses = this.button.domNode.className;
            this.button.domNode.className = "";

        
/*
        this.button.domNode.style.backgroundImage = "url(http://localhost:8080/wavemaker/lib/wm/base/widget/themes/default/images/attach.png) !important";
        this.button.domNode.style.backgroundRepeat = "no-repeat";
        this.button.domNode.style.backgroundPosition = "8px 8px";
        */
        wm.job(this.getId() + ": Create Dijit", 100,dojo.hitch(this, "createDijit"));
    },
    createButton: function() {
        this.button = new wm.Button({caption: ".", parent: this.buttonPanel, owner: this, name: "control", width: this.buttonPanel.width, height: this.buttonPanel.height, border: 1, margin: "2,4,4,2", padding: "0"});
    },
    createDijit: function() {
        if (this.dijit) {
            this.dijit.destroy();
            this.createButton();
            this.buttonPanel.reflow();
            delete this.dijit;
            return wm.job(this.getId() + ": Create Dijit", 100,dojo.hitch(this, "createDijit"));
        }
        var l = window.location;
        var path = l.protocol + "//" + l.host + l.pathname.replace(/[^\/]*$/, ""); // strip out any index.html index.php myfile.xxx from the pathane; should end with "/"
        path += "services/" + this.service + ".flashUploader?method=" + this.operation;

            this.dijit = new dojox.form.FileUploader({isDebug: true,
                                                      uploadUrl: path,
                                                      uploadOnChange: false,
                                                      force: "flash",//(dojo.isChrome <= 6) ? "html" : "", // "html", "flash" or let it choose best approach.  As of dojo 1.4, chrome 6 isn't able to dojo.subscribe
                                                      "class": "wmtoolbutton",
                                                      fileMask: [this.fileMaskLabel, this.fileMaskList],
                                                      fileList: this.html,
                                                      selectMultipleFiles: this.multipleFiles,
                                                      showProgress: false,
                                                      progressWidgetId: this.progressBar.dijit.domNode.id
                                                     }, this.button.domNode);
        this.connect(this.dijit, "onChange", this, "change");
        this.connect(this.dijit, "onComplete", this, "success");
        this.connect(this.dijit, "onError", this, "onError");
        this.connect(this.dijit, "onProgress", this, "progress");

            this.button.domNode = this.dijit.domNode;
            this.button.domNode.className = this.buttonClasses;
            var div = document.createElement("div");
            var s = div.style;
            s.height = "100%";
            s.width = "100%";
            s.textAlign = "center";


                this.button.domNode.appendChild(div);
                this.button.btnNode = div;

                this.dijit.insideNode.style.opacity = "0.01";
                this.dijit.insideNode.style.filter = "alpha(opacity=50)";

                this.button.setCaption(this.buttonCaption);

    },
    // 
    upload: function() {
        var data = this.variable.getData();
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (!d.included)
                this.dijit.removeFile(d.name);
        }
        this.dijit.upload(this.input.getData());
    },
    // Selecting the FileUploader from the event menu will fire the upload
    activate: function() {
        if (!this.isDesignLoaded())
            this.upload();
    },

/*
    fileListClicked: function() {
        var dialog = this.fileListDialog = this.getFileListDialog();
        dialog.setWidth(Math.max(200,this.html.bounds.w) + "px");
        dialog.containerWidget.removeAllControls();

        var data = this.variable.getData();
        if (!data || data.length <= 1) return;
        dojo.forEach(data, dojo.hitch(this, function(d,i) {

            var panel = new wm.Panel({"name": this.getId() + "_row" + i,
                                      width: "100%",
                                      height: "25px",
                                      layoutKind: "left-to-right",
                                      parent: dialog.containerWidget,
                                      owner: dialog});
            var del = new wm.Picture({"name": this.getId() + "_rowpic" + i,
                                      width: "19px",
                                      height: "19px",
                                      margin: "3,2,0,1",
                                      source: "/wavemaker/lib/wm/base/widget/themes/default/images/error.png",
                                      parent: panel,
                                      owner: dialog});
            var label = new wm.Label({"name": this.getId() + "_rowlabel" + i,
                                      caption: (d.error) ? "<span style='color: red' class='FileUploaderError'>" + d.name + "</span>" : d.name,
                                        width: "100%",
                                        height: "100%",
                                        parent: panel,
                                        owner: dialog});

            del.connect(del, "onclick", this, function() {
                this.removeFile(d);
                panel.destroy();
                dialog.containerWidget.reflow();
                this.updateHtml();
            });
        }));
        dialog.containerWidget.reflow();
        dialog.show();
    },
    */
    reset: function() {
        var data = this.variable.getData();
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            this.dijit.removeFile(d.name);
        }
        this.filesToUploadVariable.setData([]);
    },

    // parameter can either be just the tmpid field value, or the entire file object from which we extract tmpid
    // note that this tmpid thing is a hack that dojo's dijit does not yet support well
    // http://trac.dojotoolkit.org/ticket/11826
    removeFile: function(tmpid) {
        tmpid = dojo.isObject(tmpid) ? tmpid.tmpid : tmpid;
        var data = this.variable.getData();
        var index = wm.Array.indexOf(data,tmpid, function(a,b) {
            return (a.tmpid == b);
        });
        this.variable.removeItem(index);

        if (!d.uploaded) {
            this.dijit.removeFile(data[index].name);
            this.onChange();
        }
    },

    onChange: function() {
    },
    getDataValue: function(allData) {
        if (allData)
            return this.variable.getData();

        var data = this.variable.getData();
        for (var i = data.length-1; i >= 0; i--) {
            if (data[i].error)
                wm.Array.removeElementAt(data,i);
        }
        return data;
    },
    success: function(fileList) {
        this.updateVariable(fileList);
        this.progressBar.hide();
        if (this.useList) {
            this.updateHtml();
            this.html.show();
        }
        this._state = "uploaded";
        this.onSuccess(fileList);
    },
// TODO: Calling setItem/addItem might be less disruptive to bound objects than setData over and over
    updateVariable: function(optionalInList) {
        var fileList = optionalInList || this.dijit.fileList;
        var data = [];
        for (var i = 0; i < fileList.length; i++) {
            var f = fileList[i];
            data.push({path: f.file, 
                       tmpid: this._tmpcounter++,
                       name: f.name, 
                       error: f.error,
                       width: f.width,
                       height: f.height,
                       percent: f.uploadTime !== undefined ? 100 : f.percent !== undefined ? f.percent : 0,
                       included: true,
                       uploaded: !f.error && f.uploadTime !== undefined}); // not flagged as uploaded until ALL files have been uploaded and the server stats (uploadTime) are gathered.  Use percent == 100 if you want to know that a file is done... but note you don't yet have the server response which will help you identiffy the file on the server
        }        
        this.variable.setData(data);
    },
    change: function(fileList) {
        if (!this.uploadImmediately) {
            this._state = "filestoupload";
            this.updateVariable();
            this.progressBar.hide();
            if (this.useList) {
                this.updateHtml();
                this.html.show();
            }

        }
        if (this.uploadImmediately)
            wm.job(this.getId() + ": upload()", 100, dojo.hitch(this, "upload"));
    },
    updateHtml: function() {

        var html = "";
        var data = this.variable.getData();

        dojo.forEach(data, dojo.hitch(this,function(d,i) {
                if (html) html += "<br/>";
//            var img = (!d.uploaded || !this.noDeletionAfterLoad) ? "<img id='" + this.getId() + "_delete" + d.tmpid + "' src='/wavemaker/lib/wm/base/widget/themes/default/images/error.png' /> " : "";
            var checkbox = (this.uploadImmediately || this._state == "filestoupload") ?  "<input type='checkbox' id='" + this.getId() + "_checkbox" + d.tmpid + "' " + ((d.included) ? "checked='checked'" : "") + "/> " : "";
            html += "<div class='wmfileuploaderListItem'>" + checkbox + ((d.error) ? "<span style='color: red' class='FileUploaderError'>" + d.name + "</span>" : d.name) + "</div>";
        }));
        this.html.setHtml(html);
        dojo.query("input:", this.html.domNode).connect("onchange", this, function(event) {
            var node = event.target;
            var i = node.id.match(/\d+$/)[0];
            var data = this.variable.getData();
            var index = wm.Array.indexOf(data,i, function(a,b) {
                return (a.tmpid == b);
            });
            if (index != -1) {
                if (this._state == "filestoupload")
                    this.variable.getItem(index).setValue("included", node.checked); 
                else
                    this.variable.removeItem(index);
            }
        });
    },
    onSuccess: function(fileList) {
    },
    onError: function(evt) {
    },
    progress: function(fileList) {
        this._state = "uploading";
        this.progressBar.show();
        this.html.hide();
        var data = [];
        var completed = 0;
        this.updateVariable();
        for (var i = 0; i < fileList.length; i++) {
            if (fileList[i].percent == 100)
                completed++;
        }
        this.onProgress(data, completed, fileList.length);
    },

    // Check the % on each item inData to see if its uploaded, 
    onProgress: function(inData, inCompletionCount, inFileCount) {
    },
    makePropEdit: function(inName, inValue, inDefault) {
        if (!this._serviceVariable) {
            this._serviceVariable = new wm.ServiceVariable({owner: this, operation: this.operation, service: this.service});
        } else {
            this._serviceVariable.setService(this.service);
            this._serviceVariable.setOperation(this.operation);
        }

	switch (inName) {
	case "operation":
	    return this._serviceVariable.makePropEdit(inName, inValue, inDefault);
        case "service":
	    return this._serviceVariable.makePropEdit(inName, inValue, inDefault);
	}
	return this.inherited(arguments);
    },
        setButtonWidth: function(inWidth) {
            this.buttonWidth = parseInt(inWidth);
            this.buttonPanel.setWidth(inWidth + "px");
            if (this.isDesignLoaded()) {
                this.createDijit(); // must recreate the flash widget if size changes; this is why we don't support % sizing
            }
        },
        setButtonCaption: function(inCaption) {
            this.buttonCaption = inCaption;
            this.button.setCaption(inCaption);
        },
    setUseList: function(inUse) {
        this.useList = inUse;
        this.html.setShowing(inUse);
        if (!inUse)
            this.buttonPanel.setWidth("100%");
        else
            this.buttonPanel.setWidth(this.buttonWidth);
    },
    _end: 0
});

wm.Object.extendSchema(wm.DojoFileUpload, {
    input: { ignore: 1 , writeonly: 1, componentonly: 1, categoryParent: "Properties", categoryProps: {component: "input", bindToComponent: true, inspector: "Data"}},
    variable: {bindSource: true, ignore: true},
    autoScroll: {ignore: true},
    scrollX: {ignore: true},
    scrollY: {ignore: true},
    imageList: {ignore: true},
    lock:  {ignore: true},
    freeze:  {ignore: true},
    customGetValidate:  {ignore: true},
    autoSizeWidth: {ignore: true},
    autoSizeHeight: {ignore: true}
    
});

