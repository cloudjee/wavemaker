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

dojo.provide("wm.base.widget.FileUpload");
dojo.require("wm.base.widget.Panel");
dojo.require("dojo.io.iframe");

/* DEPRECATED; will move to deprecated folder for 6.4 or 7.0 */

dojo.declare("wm.FileUpload", [wm.Container, wm.ServiceCall], {
	scrim: true,
	box: "h",
	lock: true,
	caption: "Label",
	captionLabel: null,
	captionSize: "60px",
	//captionUnits: "flex",
	captionAlign: "right",
	captionPosition: "left",
	singleLine: true,

	uploadButton: true,
	uploadButtonCaption: "Upload",
	uploadButtonWidth: "100px",
	uploadButtonHeight: "48px",
	uploadButtonPosition: "right",
	//uploadButtonUnits: "flex",
	service: "",//"fileTransferService",
	operation: "",//"doUpload",
	formContainer: null,
	subPanel1:null,
	subPanel2:null,
	formWidth: "230px", // users should NOT set this... upload forms require some minimum amount of space that may vary from browser to browser
	width: "420px",
	destroy: function() {
		this.destroyUploadBtn();
		this.inherited(arguments);
	},
	destroyUploadBtn: function() {
		wm.fire(this.uploadBtn, "destroy");
	},
	init: function() {
	    this.inherited(arguments);


	    this.subPanel1 = new wm.Container({name: "SubPanel1", owner: this, parent: this, width: "100%", height: "100%",layoutKind: "top-to-bottom"});
	    this.subPanel2 = new wm.Container({name: "SubPanel2", owner: this, parent: this.subPanel1, width: "100%", height: "100%",layoutKind: "left-to-right"});
	    this.createCaption();

	    // Use a Control rather than a container, because other components do NOT go into this
	    // 230px width is chosen temporarily... but 100% was not an option because the file input button does not seem to like being restyled in some browsers
	    // 230px is good for FF 3
	    this.formContainer = new wm.Control({name: "FormContainer",
						 owner: this,
						 parent: this.subPanel2,
						 width: this.formWidth,
						 height: "100%"});
	    
	    var domHTML = 
		[
		    '<form style="width:100%;position:absolute;top:0;left:0" flex="1" box="v" enctype="multipart/form-data" method="post">',
		    '<input class="HiddenOperation" type="hidden" name="method" value="'+this.operation+'" />',
		    //'<input flex="1" type="file" name="file" />',
		    '<input id="' + this.name + '_FileInputElement" style="width:100%" type="file" name="file" />',
		    '</form>'
		].join('');
	    this.formContainer.domNode.innerHTML = domHTML;
	    this.formNode = this.formContainer.domNode.firstChild;
	    this.fileNode = this.formNode.lastChild;
	    this.setUploadButton(this.uploadButton);	 
	},
	setOperation: function(inOperation) {
	  this.inherited(arguments);
	  dojo.query(".HiddenOperation", this.formContainer.domNodeo).attr("value", inOperation);
	},
	postInit: function() {
		this.inherited(arguments);
		// BC: if captionSize contains only digits, append units
		if (String(this.captionSize).search(/\D/) == -1) {
		    this.captionSize += "px";
		}
		// BC: caption size convert to % (editor defaults to 100% now and was 10flex)
		var su = wm.splitUnits(this.captionSize)
		if (su.units == "flex") {
			this.captionSize = (su.value * 10) + "%";
		}
		this.setCaptionPosition(this.captionPosition,true);
		this.setUploadButtonPosition(this.uploadButtonPosition);
	},
	createCaption: function() {
		var cs = String(this.captionSize);
		var classNames = {domNode: ["wmeditor-caption"].concat(this._classes.captionNode)};
	    this.captionLabel = new wm.Label({parent: this.subPanel2, width: cs, height: cs, _classes: classNames, singleLine: this.singleLine, caption: this.caption, showing: Boolean(this.caption), margin: "0,4,0,0", border: 0, owner: this});
		this.setCaptionAlign(this.captionAlign);
	},
	setCaption: function(inCaption) {
		var c = this.caption;
		this.caption = inCaption;
		this.captionLabel.setCaption(this.caption);
		this.captionLabel.setShowing(Boolean(this.caption));
		// rebox if caption should be hidden / shown
		if (Boolean(c) != Boolean(this.caption))
			this.renderControls();
	},
	setCaptionSize: function(inCaptionSize) {
	    this.captionSize = inCaptionSize;
		if (this.layoutKind == "top-to-bottom") {
		    this.captionLabel.setHeight(this.captionSize);
		    this.captionLabel.setWidth("100%");
		} else {
		    this.captionLabel.setWidth(this.captionSize);
		    this.captionLabel.setHeight("100%");
		}
		this.reflow();
	},
	setCaptionAlign: function(inCaptionAlign) {
		this.captionAlign = inCaptionAlign;
		this.captionLabel.domNode.style.textAlign = this.captionAlign;
	},
	setCaptionPosition: function(inCaptionPosition,inKeepSize) {	    
		var cp = this.captionPosition = inCaptionPosition;

		this.subPanel2.setLayoutKind((cp == "top") ? "top-to-bottom" : "left-to-right");
		if (!inKeepSize)		
		    if (cp == "top") {
			this.captionSize = "20px";
			if (this.uploadButton && this.uploadButtonPosition == "bottom" && this.getDomHeight() < 90)
			    this.setHeight("90px");
			else if (this.getDomHeight() < 50)
			    this.setHeight("50px");
		    } else
			this.captionSize = "60px";
		this.setCaptionSize(this.captionSize);		
	},
	setSingleLine: function(inSingleLine) {
		this.singleLine = inSingleLine;
		this.captionLabel.setSingleLine(inSingleLine);
	},

	setUploadButtonPosition: function(inPosition) {	    
	     this.uploadButtonPosition = inPosition;	   

	    if (inPosition == "bottom") {
		this.subPanel1.setLayoutKind("top-to-bottom");		
		if (this.uploadButton) {
		    this.uploadBtn.setHeight("40px");
		    if (this.captionPosition == "top" && this.getDomHeight() < 90)
			    this.setHeight("90px");
		    else if (this.getDomHeight() < 65)
			    this.setHeight("65px");
		}
		this.setUploadButtonWidth("80px");
	    } else {
		this.subPanel1.setLayoutKind("left-to-right");		
		//if (this.uploadButton) this.uploadBtn.setHeight("100%");
		this.setUploadButtonWidth("100px");		
	    }		
	},
	setUploadButtonCaption: function(inCaption) {
		this.uploadButtonCaption = inCaption;
		if (this.uploadBtn) {
			this.uploadBtn.setCaption(this.uploadButtonCaption);
			this.reflow();
		}
	},
	setUploadButtonWidth: function(inCaptionSize) {
	    if (this.uploadButton) {
		this.uploadBtn.setWidth(inCaptionSize);
		this.uploadButtonWidth = inCaptionSize;
		this.reflow();
	    }
	},
	setUploadButtonHeight: function(inCaptionSize) {
	    if (this.uploadButton) {
		this.uploadBtn.setHeight(inCaptionSize);
		this.uploadButtonHeight = inCaptionSize;
		this.reflow();
	    }
	},
	setUploadButton: function(inUpload) {
		this.uploadButton = inUpload;
		if (this.uploadButton) {
		    var u = this.uploadBtn = new wm.Button({name: "UploadButton",
							    owner: this,
							    parent: this.subPanel1,
							    caption: this.uploadButtonCaption,
							    width: this.uploadButtonWidth,
							    height: this.uploadButtonHeight});
		    this.uploadBtn.connect(this.uploadBtn,"onclick",this,"upload");
		} else
			this.destroyUploadBtn();
		//this.assemblePanels();
		if (!this._loading)
			this.reflow();
	},
	assemblePanels: function() {
	    // 3 elements to place: label, form and upload button
	     this.removeAllControls();
	     if ((this.uploadButtonPosition == "right" || !this.uploadButton) && (this.captionPosition == "left" || this.captionPosition == "right" || !this.caption)) {
		 //console.log("Option 1");
		 var panel1 = new wm.Container({name: "SubPanel1", 
						owner: this,
						parent: this,
						width: "100%",
						height: "100%",
						layoutKind: "left-to-right"});
		 if (this.captionPosition == "left" && this.caption)
		     this.captionLabel.setParent(panel1);
		 this.formContainer.setParent(panel1);
		 if (this.captionPosition == "right" && this.caption)
		     this.captionLabel.setParent(panel1);
		 if (this.uploadButtonPosition == "right" && this.uploadButton)
		     this.uploadBtn.setParent(panel1);
		 if (this.uploadButton && this.caption) {
		     this.setUploadButtonWidth("60%");
		     this.setCaptionSize("40%");
		 } else if (this.uploadButton) this.setUploadButtonWidth("100%");
		  else if (this.caption) this.setCaptionSize("100%");
		 
	     } else if ((this.uploadButtonPosition == "bottom" || !this.uploadButton) && (this.captionPosition == "top" || this.captionPosition == "bottom" || !this.caption)) {
		 //console.log("Option 2");
		 var panel1 = new wm.Container({name: "SubPanel1", 
						owner: this,
						parent: this,
						width: "100%",
						height: "100%",
						layoutKind: "top-to-bottom"});
		 if (this.captionPosition == "top" && this.caption)
		     this.captionLabel.setParent(panel1);
		 this.formContainer.setParent(panel1);
		 if (this.captionPosition == "bottom" && this.caption)
		     this.captionLabel.setParent(panel1);
		 if (this.uploadButtonPosition == "bottom" && this.uploadButton)
		     this.uploadBtn.setParent(panel1);		
	     } else if (this.captionPosition == "left" || this.captionPosition == "right") {
		 //console.log("Option 3");
		 var panel1 = new wm.Container({name: "SubPanel1", 
						owner: this,
						parent: this,
						width: "100%",
						height: "100%",
						layoutKind: "top-to-bottom"});
		 var panel2 = new wm.Container({name: "SubPanel2", 
						owner: this,
						parent: panel1,
						width: "100%",
						height: "100%",
						layoutKind: "left-to-right"});		 
		 if (this.captionPosition == "left")
		     this.captionLabel.setParent(panel2);
		 this.formContainer.setParent(panel2);			 
		 if (this.captionPosition == "right")
		     this.captionLabel.setParent(panel2);
		 if (this.uploadButton)
		     this.uploadBtn.setParent(panel1);		
	     } else {
		 //console.log("Option 4");
		 var panel1 = new wm.Container({name: "SubPanel1", 
						owner: this,
						parent: this,
						width: "100%",
						height: "100%",
						layoutKind: "top-to-bottom"});
		 var panel2 = new wm.Container({name: "SubPanel2", 
						owner: this,
						parent: panel1,
						width: "100%",
						height: "100%",
						layoutKind: "left-to-right"});		 
		 if (this.captionPosition == "top" && this.caption)
		     this.captionLabel.setParent(panel1);
		 this.formContainer.setParent(panel2);
		 if (this.uploadButton) {
		     this.uploadBtn.setParent(panel2);		
		     this.setUploadButtonWidth("100%");
		 }
		 if (this.captionPosition == "bottom" && this.caption)
		     this.captionLabel.setParent(panel1);
	     }

	     this.formContainer.setWidth(this.formWidth);
	     this.reflow();

	},
	upload: function() {
		if (!this.fileNode.value) {
			wm.logging && console.debug("Please specify a file to upload.");
			return;
		}
		this.onBegin();
		dojo.io.iframe.send({
		    url: "services/"+this.service+".upload",
			content: this._uploadData,
			form: this.formNode,
			handleAs: "json",
			handle: dojo.hitch(this,"onComplete")
		});
	},
	onBegin: function() {
        },
	onComplete: function(inResponse) {
	    if (inResponse.error)
		this.onUploadError(inResponse.error);
	    else
		this.onUploadSuccess(inResponse.result);
	    wm.logging && console.debug("Uploaded: " + this.fileNode.value);
	},
	onUploadError: function(inResponse) {},
	onUploadSuccess: function(inError) {},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "uploadButtonWidth":
				return new wm.propEdit.UnitValue({component: this, name: inName, value: inValue, options: this._sizeUnits});
			case "uploadButtonHeight":
				return new wm.propEdit.UnitValue({component: this, name: inName, value: inValue, options: this._sizeUnits});
			case "captionSize":
				return new wm.propEdit.UnitValue({component: this, name: inName, value: inValue, options: this._sizeUnits});
			case "captionPosition":
				return makeSelectPropEdit(inName, inValue, ["top", "left"], inDefault);
			case "uploadButtonPosition":
			    return makeSelectPropEdit(inName, inValue, ["right", "bottom"], inDefault);
			case "captionAlign":
				return makeSelectPropEdit(inName, inValue, ["left", "center", "right"], inDefault);
			case "service":
				return makeSelectPropEdit(inName, inValue, this.getServicesList(), inDefault);
			case "operation":
				var
					s = this._service,
					valueOk = s && s.getOperation(inValue),
					methods = s && s.getOperationsList();
				if (!valueOk){
					inValue = methods ? methods[0] : "";
					if (inValue)
						this.set_operation(inValue);
				}
				if (methods)
					return makeSelectPropEdit(inName, inValue, methods, inDefault);
				break;
		}
		return this.inherited(arguments);
	}
});

wm.FileUpload.extend({
	writeComponents: function(inIndent, inOptions) {
		return [this.components.binding.write(inIndent, inOptions)];
	},
	writeChildren: function() {
		// we don't want to stream our child widgets
		// since we create them at runtime.
		return [];
	}
});

wm.Object.extendSchema(wm.FileUpload, {
	lock: {ignore: 1},
	box: {ignore: 1},
	boxPosition: {ignore: 1},
	name: {group: "common", order: 1},
	showing: {group: "common", order: 2},
	service: {group: "Upload Service", order: 3 },	
	operation: { group: "Upload Service", order: 4},
	updateNow: { group: "Upload Service", order: 5}, // remove this after we've finished testing it...
	uploadButton: {shortname: "Use Button", group: "Upload Button", order: 10},
	uploadButtonCaption: {shortname: "caption", group: "Upload Button", order: 11},
	uploadButtonWidth: {shortname: "width", group: "Upload Button", order: 12},
	uploadButtonHeight: {shortname: "height", group: "Upload Button", order: 13},
	uploadButtonPosition: {name: "position", group: "Upload Button", order: 14},
	caption: {group: "Upload Label", order: 20},
	captionSize: {name: "size", group: "Upload Label", order: 21 },
	captionAlign: {name: "align", group: "Upload Label", order: 22 },
	captionPosition: {name: "position", group: "Upload Label", order: 23},
	singleLine: { group: "Upload Label", order: 24},
	//updateNow: {ignore: 1},
	startUpdate: {ignore: 1},
	queue: {ignore: 1},
	clearInput: {ignore: 1},
	autoUpdate: {ignore:1},
	fitToContent: {ignore:1},
	layoutKind: {ignore:1},
	verticalAlign: {ignore:1},
	imageList: {ignore:1}
});
