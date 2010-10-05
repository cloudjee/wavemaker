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
dojo.provide("wm.base.widget.Button");
dojo.require("wm.base.Widget");

dojo.declare("wm.ToolButton", wm.Widget, {
	width: "80px", 
	border: 0,
	padding: "",
	margin: "",
	caption: "",
	hint: "",
	imageList: "",
	classNames: "wmtoolbutton",
	imageIndex: -1,
	iconUrl: "",        
	iconWidth: "40px",
	iconHeight: "40px",
	iconMargin: "0 10px 0 0",
        clicked: false,
	//alignInParent: "topLeft",
	build: function() {
		if (!this.domNode)
		{

			this.domNode = document.createElement('button');
			// in IE8, type becomes submit and then acts weired everywhere.
			// therefore setting type to 'button'.
			dojo.attr(this.domNode, 'type', 'button'); 
		}	
		this.btnNode = this.domNode;
	},
	destroy: function(){
		if (this.btnNode)
		{
			dojo.destroy(this.btnNode);
			this.btnNode = null;
		}

		if (this.domNode)
		{
			dojo.destroy(this.domNode);
			this.domNode = null;
		}

		this.inherited(arguments);
	},
	init: function() {
		this.inherited(arguments);
		this.connectEvents(this.btnNode, ["click"]);
		this.setHint(this.title || this.hint);
		this.imageListChanged();
	},
	click: function(inEvent) {
		this.onclick(inEvent);
	        if (!this.clicked) 
		    this.setProp("clicked", true);
	},
	onclick: function(inEvent) {
	},
	findImageList: function() {
		var t = this;
		while (t && !t.imageList) {
			t = t.parent;
		}
		return t ? t.imageList : null;
	},
	setDisabled: function(inDisabled) {
		this.inherited(arguments);
		this.btnNode.disabled = inDisabled ? "disabled" : "";
		dojo[inDisabled ? "addClass" : "removeClass"](this.domNode, "wmbutton-disabled");
	        this.invalidCss = true;
		this.render();
	},
	setSelected: function(inSelected) {
		this.selected = inSelected;
	        this.invalidCss = true;
		this.render();
	},
	setCaption: function(inCaption) {
		this.caption = inCaption;
	        this.invalidCss = true;
		this.render();
	},
	setIconUrl: function(inUrl) {
		this.iconUrl = inUrl;
	        this.invalidCss = true;
		this.render();
	},
	setIconWidth: function(w) {
	        this.iconWidth = w;
	        this.invalidCss = true;
		this.render();
	},
	setIconHeight: function(h) {
	        this.iconHeight = h;
	        this.invalidCss = true;
		this.render();
	},
	setIconMargin: function(m) {
	        this.iconMargin = m;
	        this.invalidCss = true;
		this.render();
	},
	setContent: function(inContent) { // BC
		this.setCaption(inContent);
	},
	setHint: function(inHint) {
		this.btnNode.title = this.hint = inHint;
	},

	setImageList: function(inImageList) {
		this.imageList = inImageList;
		this.imageListChanged();
	},
	setImageIndex: function(inImageIndex) {
		if (inImageIndex !== undefined) {
			this.imageIndex = inImageIndex;
			this.imageListChanged();
		}
	},
	imageListChanged: function() {
		var iln = this.findImageList();
		this._imageList = iln ? iln instanceof wm.ImageList ? iln : this.owner.getValueById(iln) : null;
	        this.invalidCss = true;
		this.render();
	},
	render: function(forceRender) {
	    if (!forceRender && (!this.invalidCss || !this.isReflowEnabled())) return;
	    this.inherited(arguments);
		var il = this._imageList;
		if (il && il.getImageHtml && this.imageIndex >= 0) {
			var ii = this.imageIndex + (this.disabled ? il.colCount * 2 : 0) + (this.selected ? il.colCount : 0);
			var sl = this.singleLine ? "line-height: " + this.height + "; " : "";
			var captionHtml = this.caption ? '<span style="padding-left: 2px; ' + sl +'">' + this.caption + '</span>' : "";
			this.btnNode.innerHTML = il.getImageHtml(ii) + captionHtml;
			this.btnNode.style.padding = "0px";
		} else if (this.iconUrl) {
			var sl = this.singleLine ? "line-height: " + this.height + "; " : "";
			var captionHtml = this.caption ? '<span style="padding-left: 2px; ' + sl +'">' + this.caption + '</span>' : "";
			var root =  this.getPath() || "";

			this.btnNode.innerHTML = "<img src='" + wm.theme.getImagesPath() + "blank.gif' style='margin: " + this.iconMargin + "; width: " + this.iconWidth + "; height: " + this.iconHeight + "; vertical-align: middle; background:url(" + root + this.iconUrl + ") no-repeat; background-color: transparent;' />" + captionHtml;

			this.btnNode.style.padding = "0px";
		} else {
			this.btnNode.innerHTML = this.caption;
			this.btnNode.style.padding = "";
		}
	}
});

wm.Object.extendSchema(wm.ToolButton, {
	scrollX:  { ignore: 1 },
	scrollY:  { ignore: 1 },
        clicked: {ignore: 1, bindSource: true},
	iconUrl: {group: "format", bindable: true, type: "String", subtype: "File"},
	iconWidth: {group: "format"},
	iconHeight: {group: "format"},
	iconMargin: {group: "format"}
});

wm.ToolButton.extend({
        scrim: true,
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "iconWidth":
			case "iconHeight":
				return new wm.propEdit.UnitValue({
					component: this,
					name: inName,
					value: inValue,
					options: this._sizeUnits
				});
		}
		return this.inherited(arguments);
	},

	destroy: function(){
		if (this.btnNode)
		{
			dojo.destroy(this.btnNode);
			this.btnNode = null;
		}

		if (this.domNode)
		{
			dojo.destroy(this.domNode);
			this.domNode = null;
		}

		this.inherited(arguments);
	}
});

dojo.declare("wm.Button", wm.ToolButton, {
	height: "32px",
	border: 1,
	borderColor: "#ABB8CF",
	margin: 4,
	caption: "Button",
	classNames: "wmbutton"
});

dojo.declare("wm.ToggleButton", wm.ToolButton, {
	height: "32px",
	border: 1,
	borderColor: "#ABB8CF",
	margin: 4,
	captionUp: "Btn Up",
        captionDown: "Btn Down",
        classNames: "wmbutton wmtogglebutton",
        init: function() {
	    this.caption = this.captionUp;
	    this.inherited(arguments);
            if (this.clicked)
                this.setClicked(true);
	},
        click: function() {
	    this.onclick();
	    this.setProp("clicked", !this.clicked);
	},
    /* Sets the state, updates the css, does not fire events; useful in a set of toggle buttons where clicking one updates the states of the others, but firing events on each one would be bad */
    setClicked: function(inClicked) {
	if (inClicked != this.clicked) {
	    this.clicked = inClicked;
	    this.valueChanged("clicked", inClicked);
	    this.setCaption(this.clicked ? this.captionDown : this.captionUp);
	    dojo[this.clicked ? "addClass" : "removeClass"](this.domNode, "toggleButtonDown");
	}
    },
    setCaptionUp: function(inCaption) {
        this.captionUp = inCaption;
        this.setCaption(inCaption);
    }
});

wm.Object.extendSchema(wm.ToggleButton, {
        captionUp: { group: "display", bindTarget: 1, order: 10, focus: 1 },
	captionDown: { group: "display", bindTarget: 1, order: 11},
        clicked: { group: "display", bindTarget: 1, bindSource: 1, order: 12 },
        caption: {ignore: 1}
});

dojo.declare("wm.RoundedButton", wm.Button, {
        useDesignBorder: 0, // move this to a _design file if we ever create one
	classNames: "roundedwmbutton",
	margin: 2,
	padding: 0,
	border: 0,
	leftImgWidth: 12,
	rightImgWidth: 12,
        width: "110px",
        height: "40px",
	build: function() {
		if (!this.domNode){
			this.domNode = document.createElement('div');
			var buttonLeft = document.createElement('div');
			var buttonCenter = document.createElement('div');
			var buttonRight = document.createElement('div');
				
			dojo.addClass(buttonLeft, "button-gray-left");
			dojo.addClass(buttonCenter, "button-gray-center");
			dojo.addClass(buttonRight, "button-gray-right");
						
			buttonLeft.innerHTML = "&nbsp;";
			buttonRight.innerHTML = "&nbsp;";
			
			this.domNode.appendChild(buttonLeft);
			this.domNode.appendChild(buttonCenter);
			this.domNode.appendChild(buttonRight);
		}
			
		this.btnNode = this.domNode;
		
		this.connect(this.btnNode, "onmouseover", dojo.hitch(this, "mouseoverout", this, true));
		this.connect(this.btnNode, "onmouseout", dojo.hitch(this, "mouseoverout", this, false));		
		dojo.connect(this.btnNode, "onselectstart", dojo, "stopEvent");

		this.invalidCss = true;
	},
	mouseoverout: function(inButton, inActive){		
		if (inButton && !inButton.disabled){
			var btnNode = inButton.btnNode;
			var buttonLeft = btnNode.childNodes[0];
			var buttonCenter = btnNode.childNodes[1];
			var buttonRight = btnNode.childNodes[2];												
			dojo[inActive ? "addClass" : "removeClass"](buttonLeft, 'button-blue-left');				
			dojo[inActive ? "addClass" : "removeClass"](buttonCenter, 'button-blue-center');
			dojo[inActive ? "addClass" : "removeClass"](buttonRight, 'button-blue-right');
			dojo[inActive ? "addClass" : "removeClass"](inButton.btnNode, 'button-pointer');						
		}							
	},
	click: function(inEvent) {
		if(!this.disabled){
			this.onclick(inEvent);
		}		
	},	
	render: function(forceRender) {
	    if (!forceRender && (!this.invalidCss || !this.isReflowEnabled())) return;
	    dojo.hitch(this,wm.Control.prototype.render)(forceRender);
		var il = this._imageList;
		if (il && il.getImageHtml && this.imageIndex >= 0) {
			var ii = this.imageIndex + (this.disabled ? il.colCount * 2 : 0) + (this.selected ? il.colCount : 0);
			var sl = this.singleLine ? "line-height: " + this.height + "; " : "";
			var captionHtml = this.caption ? '<span style="padding-left: 2px; ' + sl +'">' + this.caption + '</span>' : "";
			this.btnNode.innerHTML = il.getImageHtml(ii) + captionHtml;
			this.btnNode.style.padding = "0px";
		} else if (this.iconUrl) {
			var sl = this.singleLine ? "line-height: " + this.height + "; " : "";
			var captionHtml = this.caption ? '<span style="padding-left: 2px; ' + sl +'">' + this.caption + '</span>' : "";
			var root =  this.getPath() || "";
			this.btnNode.innerHTML = "<img src='" + wm.theme.getImagesPath() + "blank.gif' style='margin: " + this.iconMargin + "; width: " + this.iconWidth + "; height: " + this.iconHeight + "; vertical-align: middle; background:url(" + root + this.iconUrl + ") no-repeat; background-color: transparent;' />" + captionHtml;
			this.btnNode.style.padding = "0px";
		} else {
			this.btnNode.childNodes[1].innerHTML = this.caption;
			//this.btnNode.childNodes[1].style.width = parseInt(this.width) - (this.leftImgWidth + this.rightImgWidth + (this.margin * 2)) + "px";								
			this.btnNode.style.padding = "";
		}
	},
	updateBounds: function(){
		this.inherited(arguments);
	    var bounds = this.getContentBounds();
	    var width = bounds.w;
	    this.btnNode.childNodes[1].style.width = width - (this.leftImgWidth + this.rightImgWidth) + "px";
	}	
});


// design-time

wm.Object.extendSchema(wm.Button, {
	caption: { group: "display", bindable: 1, order: 10, focus: 1 },
	hint: { group: "display", order: 20 },
	imageList: { group: "display",order: 50},
	imageIndex: { group: "display", order: 51 }

});


wm.Object.extendSchema(wm.RoundedButton, {
    imageList: {ignore: 1},
    imageIndex: {ignore: 1},
    iconHeight: {ignore: 1},
    iconWidth: {ignore: 1},
    iconUrl: {ignore: 1},
    iconMargin: {ignore: 1},
    leftImgWidth: {ignore: 1},
    rightImgWidth: {ignore: 1},
    border: {ignore: 1},
    borderColor: {ignore: 1},
    scrollX:  {ignore: 1},
    scrollY:  {ignore: 1},
    padding:  {ignore: 1}
});

wm.Button.description = "A simple button.";
