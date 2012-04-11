/*
 *  Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Buttons.RoundedButton");
dojo.require("wm.base.widget.Buttons.Button");


/* This class was created for 6.1; and is considered deprecated as of 6.2 */
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