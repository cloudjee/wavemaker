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

dojo.provide("wm.base.widget.DojoFileUpload");
dojo.require("wm.base.widget.Panel");
dojo.require("wm.base.widget.Html");
dojo.require("wm.base.widget.dijit.ProgressBar");
dojo.require("dojo.io.iframe");


dojo.declare("wm.DojoFileUpload", wm.Container, {

    // "Flash" allows you to select multiple files in the file dialog, but it does NOT send cookies
    // so any application that requires validation will fail.  And what application allows file upload without validation?
    _uploaderType: "html",

    // Evern file uploaded is assigned a unique ID as its possible that filenames may overlap.
    // Unfortunately, this usage isn't well supported by dojo which depends on a removeFile(filename)
    // and has no way of telling which index.html I want to remove from the upload list if there is more than one
    _tmpcounter: 0,

    // Show a list of files that were uploaded or that are to be uploaded.  The list allows the user to remove files.
    useList: true,

    autoDeleteDelay: 4, // Set to "" to turn off autoDeletion

    // Class to append to the domnode
    classNames: "wmdojofileupload",

    // Properties for controlling the button that opens the file browser.  Note that width and height are ignored
    // if useList is false in which case the width/height are the full width/height of this widget
    buttonCaption: "Upload...",
    buttonWidth: "80",
    buttonHeight: "32",

    // Stores the list of files to be uploaded, that are being uploaded or that have been uploaded.  Bindable.
    variable: "",
    _variable: "",
    _uploadedVariable: "",

    // for design time use in getting list of operations and services
    // for runtime use in defining types for the input variable
    _serviceVariable: "", 

    // Standard control/container properties 
    verticalAlign: "top",
    horizontalAlign: "top",
    width: "300px",
    height: "80px",
    scrim: true,
    lock: true,
    layoutKind: "left-to-right",


    // Label to go on the flash file browser; ignored for html widget
    //fileMaskLabel: "All Images",

    // List of file patterns to accept by flash file browser; ignored for html widget
    //fileMaskList: ".png;.jpg;.jpeg;.gif",

    // JavaService name and operation name
    service: "FileUploadDownload",
    operation: "uploadFile",

    // _state is one of "uploaded", "filestoupload" (has files waiting to upload) and "uploading"
    _state: "",


    destroy: function() {
        if (this.dijit) {
            this.dijit.destroy();
            dijit.registry.remove(this.button.getRuntimeId());
        }
        if (this.button)
            this.button.destroy();
        if (this.buttonPanel)
            this.buttonPanel.destroy();
        if (this.html)
            this.html.destroy();
        if (this.$ && this.$.input)
            delete this.$.input; // this widget doesn't really own input; the servicevariable does; let it do any destroying
	this.inherited(arguments);
    },

    // If there is no FileUploadDownload java service, create one when the user drops this into their project
    afterPaletteDrop: function() {
	this.inherited(arguments);
        try {
            var found = false;
            var components = studio.application.getServerComponents();
            for (var i = 0; i < components.length; i++) {
                if (components[i].name == this.service) 
                    found = true;
            }
            if (!found) {
                var javaservice = new wm.JavaService({owner: studio.application, initialNoEdit: true, javaTemplate: this.service + ".java"});
                var result = studio.studioService.requestSync("getJavaServiceTemplate", [javaservice.javaTemplate]).results[0];
                javaservice.connect(javaservice, "_onClassFirstSave", this, function() {
                    this._serviceVariable.setService("");
                    this._serviceVariable.setService(this.service);
                    studio.inspector.reinspect();
                });
                javaservice.newJavaServiceWithFunc(this.service, this.service, result);
            }
        } catch(e) {
            console.error("DojoFileUpload.js failed to create javaservice:" + e);
        }
    },


    // Load classes (our package loader should have already loaded the dijit if the widget has loaded)
    // initialize new types
    // setup design time parameters
    init: function() {

	    this.inherited(arguments);
            dojo.require("dojox.form.FileUploader");

            // Define the type output by this.variable if its not already defined
            if (!wm.typeManager.isType("wm.DojoFileUpload.FileData")) {
                wm.typeManager.addType("wm.DojoFileUpload.FileData", 
                                       {internal: true, 
                                        fields: {"name": {type: "String", isObject: false, isList: false},
                                                 "percent":{type: "Number", isObject: false, isList: false},
                                                 "uploaded":{type: "boolean", isObject: false, isList: false},
                                                 "tmpid": {type: "Number", isObject: false, isList: false},
                                                 
                                                 "path": {type: "String", isObject: false, isList: false},
                                                 "error":{type: "String", isObject: false, isList: false},
                                                 "width":{type: "String", isObject: false, isList: false},
                                                 "height":{type: "String", isObject: false, isList: false},
                                                 
                                                 "included": {type: "Boolean", isObject: false, isList: false}
                                                }});
            }

            // Create the subcomponents; may want to move this to postInit
            this._serviceVariable = new wm.ServiceVariable({owner: this, operation: this.operation, service: this.service});
            this.connect(this._serviceVariable, "onSuccess", this, "onSuccess");
            this.connect(this._serviceVariable, "onError", this, "onError");

            this.variable = new wm.Variable({name: "variable", owner: this, type: "wm.DojoFileUpload.FileData", isList: true});
            this.variable.isList= true; // this value got killed off by Variable.js:setType
            this.variable.setData([]);

            this._variable = new wm.Variable({name: "_variable", owner: this, type: "wm.DojoFileUpload.FileData", isList: true});
            this._variable.isList= true; // this value got killed off by Variable.js:setType
            this._variable.setData([]);


            this._uploadedVariable =  new wm.Variable({name: "_uploadedVariable", owner: this, type: "wm.DojoFileUpload.FileData", isList: true});

            this._uploadedVariable.setData([]);


            // If the design is loaded, strip out uneditable input fields that are managed by the flash widget... 
            // if we're using the flash widget
            if (this._uploaderType == "flash" && this.isDesignLoaded()) {
                try {
                    var methods = this._serviceVariable._service._service.smd.methods;
                    var methodIndex = wm.Array.indexOf(methods, "uploadFile", function(a,b) {return a.name == b;});
                    var params = methods[methodIndex].parameters;
                    var ignoreList = ["ignored", "Filename", "flashUploadFiles"];
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

        // this.input actually points to the servicevaraible's input.  This seemed a lot simpler
        // than copying all that servicevariable code... or dealing with multiple inheritance.
        if (this.$.input) {
            this._serviceVariable.$.input = this._serviceVariable.input = this.$.input;
            this._serviceVariable.operationChanged();
        } else {
            this.$.input = this._serviceVariable.$.input;
        }
        this.input = this.$.input;

        this.html = 
            new wm.Html({parent: this,
                         owner: this,
                         name: "html",
                         width: "100%",
                         height: "100%",
                         border: "1",
                         padding: "2",
                         html: wm.getDictionaryItem("wm.DojoFileUpload.MESSAGE_NO_FILES"),
                         showing: this.useList});

        this.progressBar = 
            new wm.dijit.ProgressBar({parent: this,
                                      owner: this,
                                      name: "progressBar",
                                      showing: false,
                                      width: "100%",
                                      height: "100%"});

        // This panel is here because dojo changes the style.position and left of this.button; 
        // but it won't matter if its position is determined by its parent panel
        this.buttonPanel = 
            new wm.Panel({layoutKind: "left-to-right",
                          width: (this.useList) ? this.buttonWidth + "px": "100%",
                          height: (this.useList) ? this.buttonHeight + "px" : "100%",
                          name: "buttonPanel",
                          owner: this,
                          parent: this,
                          horizontalAlign: "left",
                          verticalAlign: "top"});


        this.createButton();

        if (this._uploaderType == "flash") {
            // Without this, that flash widget will show up even if its not visible
            if (!this.button.isAncestorHidden()) {
                this.createDijit();
            } 

            // Do we need to recreate the dijit each time its shown, or only the first time???
            this.connectToAllLayers(this, dojo.hitch(this, function() {
                if (!this.dijit) this.createDijit();
            }));
        } else {
            this.createDijit();
        }
    },
    createButton: function() {
        // The real button gets clobbered by the dijit, so if there is a button object, it needs recreating
        if (this.button) this.button.destroy();

        this.button = new wm.Button({disabled: this.disabled,
				     /* Version of flash this was tested on requires us to set caption
				      * after flash widget is generated */
                                     caption: this._uploaderType == "flash" ? "." : this.buttonCaption,
                                     parent: this.buttonPanel,
                                     owner: this,
                                     name: "button",
                                     width: "100%",
                                     height: "100%",
                                     margin: this.useList ? "2,4,4,2" : "0",
                                     padding: "0"});


/*
        this.button.connect(this.button, "onclick", this, function() {
            console.log("JOB: createButton");
            this.createDijit();
        });
        */


        this.button.connect(this.button, "renderBounds", this, function() {
            if (!this.button.isAncestorHidden() && !this._inCreateDijit && this.dijit) {
                var b = this.button.getContentBounds();
                this.button.btnNode.style.lineHeight = b.h + "px";
                this.button.btnNode.style.height = b.h + "px";
                this.button.btnNode.style.width = b.w + "px";
                //this.dijit._fileInput.style.left = 0;
            }
        });
        
    },

    // Convenience method for those more accustomed to calling renderDojoObj
    renderDojoObj: function() {
        this.createDijit();
    },

    createDijit: function() {
            wm.job(this.getRuntimeId() + ": Create Dijit", 100,dojo.hitch(this, "createDijit2"));
    },
    createDijit2: function() {
        // clear any pending jobs which there shouldn't be any of as there should be no direct calls to createDijit2
        wm.job(this.getRuntimeId() + ": Create Dijit", 10,function(){});

        // Flag that any events triggered by the code that follows should NOT try recreating the dijit...
        this._inCreateDijit = true;

        // If there is already a dijit, then there must be something wrong with it; we need to destroy it and schedule
        // a new dijit to be created (not sure its necessary to schedule it vs just do it now)
        if (this.dijit) {
            try {
                this.dijit.destroy();
            } catch(e) {
                console.error(e);
            } finally {
                dijit.registry.remove(this.button.domNode.id);
            }

            this.createButton();
            this.buttonPanel.reflow();
            delete this.dijit;
            this._inCreateDijit = false;
            return this.createDijit();
        }

        // Used to help us track when the button's bounds have changed
        this._lastButtonBounds = dojo.clone(this.button.bounds);

        // Calculate the path/url that will submit the files
        // A different java service is needed to process the parameters and response of the flash uploader vs the html uploader
        var path = this.getPath();

            this.dijit = new dojox.form.FileUploader({isDebug: true,
                                                      uploadUrl: path,
                                                      uploadOnChange: false,
                                                      force: this._uploaderType,//(dojo.isChrome <= 6) ? "html" : "", // "html", "flash" or let it choose best approach.  As of dojo 1.4, chrome 6 isn't able to dojo.subscribe to flash (is this still true?  did upgrading to the dojo 1.5 swf fix it?).  Flash version does not get cookies/headers in chrome, FF or SF, making it useless for uploading files to sites that require login (almost all sites).
                                                      "class": "wmtoolbutton",
                                                      fileMask: [this.fileMaskLabel, this.fileMaskList],
                                                      fileList: this.html,
                                                      htmlFieldName: "file",
                                                      flashFieldName: "file",
                                                      selectMultipleFiles: this.multipleFiles,
                                                      showProgress: !this.useList,
                                                      progressWidgetId: this.useList ? this.progressBar.dijit.domNode.id : undefined
                                                     }, this.button.domNode);

        // The dijit just demolished our wm.Button dom structure, attempt to point to suitable nodes so that render still
        // works on our button.  And call render so that our "New" button nodes get all framework generated styles
        // and this also calls the button.renderbutton method
        if (this._uploaderType == "html") {
            this.dijit.insideNode.className += " " + this.button.btnNode.className;
            dojo.destroy(this.button.domNode);
            this.button.btnNode = this.dijit.insideNode;
            this.button.domNode = this.button.btnNode.parentNode;
            this.button.dom.node = this.button.domNode;
            this.button.invalidCss = true;
            this.button.render(true);


            // get control over the positioning of the submit button itself
            this.dijit._fileInput.style.position = "absolute";
            this.dijit._fileInput.style.left = "0";
        }

        // Connect to all the events 
        this.connect(this.dijit, "onChange", this, "change");
        this.connect(this.dijit, "onComplete", this, "success");
        this.connect(this.dijit, "onError", this, "onError");
        this.connect(this.dijit, "onProgress", this, "progress");
        if (this._uploaderType == "html") 
	    this.adjustButtonHeight();
        this._inCreateDijit = false;
    },
    getPath: function() {
        var l = window.location;
        var path = l.protocol + "//" + l.host + l.pathname.replace(/[^\/]*$/, ""); // strip out any index.html index.php myfile.xxx from the pathane; should end with "/"
        path += "services/" + this.service + ".upload?method=" + this.operation;
        return path;
    },
    // 
    upload: function() {
        var data = this.variable.getData();
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (!d.included)
                this.dijit.removeFile(d.name);
        }
        var submitData = this.input.getData();
        if (this.input.type == "AnyData")
            submitData = submitData.dataValue;
        //console.log("UPLOAD");console.log(data);
        this.dijit.upload(submitData);
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
/*
        var data = this.variable.getData();
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            this.dijit.removeFile(d.name);
        }
	*/
        this.variable.setData([]);
        this._variable.setData([]);
        this._uploadedVariable.setData([]);
        if (this.html)
            this.html.setHtml(wm.getDictionaryItem("wm.DojoFileUpload.MESSAGE_NO_FILES"));
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

    getAllFilePaths: function() {
        var paths = [];
        var data = this._variable.getData().concat(this.variable.getData());
        for (var i = 0; i < data.length; i++) {
            paths.push(data[i].path);
        }
        return paths;
    },
    deleteAllFiles: function() {
        var paths = this.getAllFilePaths();
	var oldOp = this._serviceVariable.operation;
        this._serviceVariable.setOperation("deleteFiles");
        this._serviceVariable.input.setValue("files", paths)
        this._serviceVariable.update();
        this._variable.setData([]);
        this.updateHtml();
	this._serviceVariable.setOperation(oldOp);
    },

    getRemovedFilePaths: function() {
        var paths = [];
        var data = this._variable.getData();
        for (var i = 0; i < data.length; i++) {
            paths.push(data[i].path);
        }
        return paths;
    },
    deleteRemovedFiles: function() {
        var paths = this.getRemovedFilePaths();
	var oldOp = this._serviceVariable.operation;
        this._serviceVariable.setOperation("deleteFiles");
        this._serviceVariable.input.setValue("files", paths)
        this._serviceVariable.update();
        this._variable.setData([]);
        this.updateHtml();
	this._serviceVariable.setOperation(oldOp);
    },
    deleteFileItem: function(item) {
	if (item instanceof wm.Variable)
	    item = item.getData();
	var data = this._variable.getData();
	var index = wm.Array.indexOf(data,item, function(a,b) {
	    return (a.tmpid == b);
	});
	if (index != -1) {
	    this._variable.removeItem(index);
	}
	var oldOp = this._serviceVariable.operation;
        this._serviceVariable.setOperation("deleteFiles");
        this._serviceVariable.input.setValue("files", [item.path]);
        this._serviceVariable.update();
        this._serviceVariable.setOperation(oldOp);
	var node = dojo.byId(this.getId() + "_checkbox" + item.tmpid).parentNode;
        if (!dojo.isIE || dojo.isIE >= 8)
            dojo.anim(node, {height: 0},350, null, function() {dojo.destroy(node);});
        else
            dojo.destroy(node);
        //this.updateHtml();
    },
    // if this is a flash widget, fileList is an array of "wm.DojoFileUpload.FileData" objects (see definition in init method)
    // if this is an html widget, fileList is an array of response objects from the server
    success: function(fileList) {
        if (!fileList)
            return this.onSuccess(this.variable.getData());
	if (fileList && fileList.length == 1 && fileList[0].result && fileList[0].result.error)
	    return this.onError(fileList[0].result.error);
        try {
            if (dojo.query("input", this.html.domNode).length == 0)
                this.html.setHtml(""); // remove the "no files selected" message
            this.updateVariable(fileList);
            var data = this._uploadedVariable.getData();
            var data2 = this.variable.getData();
            var data3 = data2.concat(data);
            this.variable.setData(data3);
            this._uploadedVariable.setData(data3);
            
            this.progressBar.hide();
            if (this.useList) {
		if (fileList.length == 1 && this._uploaderType == "html" && (!dojo.isIE || dojo.isIE >= 8)) {
		    var html = this.getHtmlForItem(this.variable.getItem(0).getData()).replace("div", "div style='height:0''");
/*
		    var div = document.createElement("div");
		    div.innerHTML = html;
		    var div2 = div.firstChild;
		    */
		    var newnode =dojo.place(html, this.html.domNode, "first");
		    dojo.connect(dojo.query("input", newnode)[0], "onchange", this, "checkboxchange");
		    //dojo.destroy(div);
		    dojo.animateProperty({node: newnode,
					  properties: {height: 16},
					  duration:450}).play(5);
		} else {
                    this.updateHtml();
		}
                this.html.show();
            }
	    if (fileList[0].error) {
		this.onError(fileList[0].error);
	    } else {
		this._state = "uploaded";
		if (this._uploaderType == "html") {
                    this.onSuccess(this.variable.getData());
		} else {
                    this.onSuccess(fileList);
		}
	    }
        } catch(e) {
            console.error(e);
        }
    },
// TODO: Calling setItem/addItem might be less disruptive to bound objects than setData over and over
    updateVariable: function(optionalInList) {
        var fileList = optionalInList || this.dijit.fileList;
        var oldData = this.variable.getData();
        var data = [];
        for (var i = 0; i < fileList.length; i++) {
            var f = fileList[i];
            if (this._uploaderType == "html" && !f.name) {
                data.push(dojo.mixin(oldData[i], f.result));
            } else {
                data.push({path: f.file, 
                           tmpid: this._tmpcounter++,
                           name: String(f.name).replace(/^C\:\\fakepath\\/,""), //
                           error: f.error,
                           width: f.width,
                           height: f.height,
                           percent: f.uploadTime !== undefined ? 100 : f.percent !== undefined ? f.percent : 0,
                           included: true,
                           uploaded: !f.error && (f.uploadTime !== undefined || this._uploaderType == "html" && f.percent == 100)}); // not flagged as uploaded until ALL files have been uploaded and the server stats (uploadTime) are gathered.  Use percent == 100 if you want to know that a file is done... but note you dont yet have the server response which will help you identiffy the file on the server
            }
        }        
        this.variable.setData(data);
    },
    change: function(fileList) {
        this.updateVariable();
	this.onChange();
        wm.job(this.getRuntimeId() + ": upload()", 100, dojo.hitch(this, "upload"));
    },
    getHtmlForItem: function(d) {
            var checkbox = (this._uploaderType == "html" || this.uploadImmediately || this._state == "filestoupload") ?  "<input type='checkbox' id='" + this.getId() + "_checkbox" + d.tmpid + "' " + ((d.included) ? "checked='checked'" : "") + "/> " : "";
        return "<div class='wmfileuploaderListItem'>" + checkbox + ((d.error) ? "<span style='color: red' class='FileUploaderError'>" + d.name + "</span>" : d.name) + "</div>";

    },
    updateHtml: function() {

        var html = "";
        var data = this.variable.getData();

        dojo.forEach(data, dojo.hitch(this,function(d,i) {
	    html += this.getHtmlForItem(d);
        }));
        this.html.setHtml(html);
        dojo.query("input", this.html.domNode).connect("onchange", this, "checkboxchange");
    },
    checkboxchange: function(event) {
            var node = event.target;
            var i = node.id.match(/\d+$/)[0];


            // checkbox has been unchecked
	if (!event.target.checked) {
            var data = this.variable.getData();
            var index = wm.Array.indexOf(data,i, function(a,b) {
		return (a.tmpid == b);
            });
            var item = this.variable.getItem(index);
                if (index != -1) {
                    if (this._state == "filestoupload")
                        this.variable.getItem(index).setValue("included", node.checked); 
                    else {

                        this.variable.removeItem(index);
                        this._variable.addItem(item);
			var itemData = item.getData();
			if (this.autoDeleteDelay && String(this.autoDeleteDelay).match(/^\d+$/)) {
			    console.log(this.getRuntimeId() + ":removeUncheckedFile:"+itemData.tmpid);
			    wm.job(this.getRuntimeId() + ":removeUncheckedFile:"+itemData.tmpid, this.autoDeleteDelay*1000, 
				   dojo.hitch(this, function() {
				       this.deleteFileItem(item);
				   }));
                        } else {
			    this.deleteFileItem(item);
                        }

                    }
                }
            } else {
            var data = this._variable.getData();
            var index = wm.Array.indexOf(data,i, function(a,b) {
		return (a.tmpid == b);
            });
		var item = this._variable.getItem(index).getData();
		console.log("CLEAR:"+this.getRuntimeId() + ":removeUncheckedFile:"+item.tmpid);
		wm.job(this.getRuntimeId() + ":removeUncheckedFile:"+item.tmpid, 0, function(){}); // remove the job

                var data = this._variable.getData();
                var index = wm.Array.indexOf(data,i, function(a,b) {
                    return (a.tmpid == b);
                });
                if (index != -1) {
                    var item = this._variable.getItem(index);
                    this._variable.removeItem(index);
                    this.variable.addItem(item);
                }
            }
},
    onSuccess: function(fileList) {
    },
    onError: function(inErrorMsg) {
        app.toastError(wm.getDictionaryItem("wm.DojoFileUpload.TOAST_ONERROR", {error: inErrorMsg}));
        this.progressBar.hide();
        if (this.useList) {
            this.updateHtml();
            this.html.show();
        }
    },
    progress: function(fileList) {
        this._state = "uploading";
        if (this.useList)
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
            // if we always reset these, then we blow away the fields of the input properties that we are trying to hide
            // from the user; it rerequests an smd and blows away our changes to the smd.
            if (this._serviceVariable.service != this.service)
                this._serviceVariable.setService(this.service);
            if (this._serviceVariable.operation != this.operation)
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
    getOrderedWidgets: function() {
	return [];
    },
        setButtonWidth: function(inWidth) {
            this.buttonWidth = parseInt(inWidth);
            this.buttonPanel.setWidth(inWidth + "px");
            this.adjustButtonWidth();
        },
        adjustButtonWidth: function(inWidth) {
                this.button.btnNode.parentNode.style.width = this.button.getContentBounds().w + "px";
                this.button.btnNode.style.width = this.button.getContentBounds().w + "px";                
        },
        setButtonHeight: function(inHeight) {
            this.buttonHeight = parseInt(inHeight);
            this.buttonPanel.setHeight(inHeight + "px");
            this.adjustButtonHeight();
        },
        adjustButtonHeight: function() {
                var newheight = this.button.getContentBounds().h + "px";
                this.button.btnNode.parentNode.style.height = newheight
                this.button.btnNode.style.height = newheight;
                this.button.btnNode.style.lineHeight = newheight;
                this.button.render(false,true);
        },
        setButtonCaption: function(inCaption) {
            this.buttonCaption = inCaption;
            this.button.setCaption(inCaption);
        },
    setUseList: function(inUse) {
        this.useList = inUse;
        this.html.setShowing(inUse);
        if (!inUse) {
            this.buttonPanel.setWidth("100%");
            this.buttonPanel.setHeight("100%");
            this.adjustButtonHeight();
            this.adjustButtonWidth();
        } else {
            this.buttonPanel.setWidth(this.buttonWidth);
            this.buttonPanel.setHeight(this.buttonHeight);
            this.adjustButtonHeight();
            this.adjustButtonWidth();
        }
/*
        if (this.isDesignLoaded()) {
            this.createDijit(); // must recreate the flash widget if size changes; this is why we don't support % sizing
        }
        */
    },
    setDisabled: function(inDisabled) {
        this.disabled = inDisabled;
        if (this.button) {
            try {
                this.button.setDisabled(inDisabled);
            } catch(e) {}
        }
    },
    _end: 0
});

wm.Object.extendSchema(wm.DojoFileUpload, {
    _variable: {ignore:1},
    _uploadedVariable: {ignore:1},
    useList: {group: "display", order: 1, type: "boolean"},
    buttonCaption: {group: "display", order: 2, type: "string"},
    service: {group: "Services", order: 38},
    operation: {group: "Services", order: 39},
    autoDeleteDelay: {group: "Services", order: 40, type: "number"},
    buttonWidth: {group: "layout", order: 50},
    buttonHeight: {group: "layout", order: 51},

    input: { ignore: 1 , writeonly: 1, componentonly: 1, categoryParent: "Properties", categoryProps: {component: "input", bindToComponent: true, inspector: "Data"}},
    variable: {bindSource: true, ignore: true},
    horizontalAlign: {ignore: true},
    verticalAlign: {ignore: true},
    autoScroll: {ignore: true},
    scrollX: {ignore: true},
    scrollY: {ignore: true},
    touchScrolling: {ignore: true},
    imageList: {ignore: true},
    lock:  {ignore: true},
    freeze:  {ignore: true},
    customGetValidate:  {ignore: true},
    autoSizeWidth: {ignore: true},
    autoSizeHeight: {ignore: true}
    
});

