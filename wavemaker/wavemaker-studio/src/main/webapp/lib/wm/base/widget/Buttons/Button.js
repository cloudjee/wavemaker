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


dojo.provide("wm.base.widget.Buttons.Button");
dojo.require("wm.base.widget.Buttons.ToolButton");


dojo.declare("wm.Button", wm.ToolButton, {
	height: "32px",
	border: 1,
	borderColor: "#ABB8CF",
	margin: 4,
    /* TODO: Localize This */
	caption: "Button",
    classNames: "wmbutton"
});

dojo.declare("wm.IconButton", wm.Button, {
    build: function() {
	this.inherited(arguments);
	var html = "<table class='dijitMenuTable' style='width:100%'><tbody class='dijitReset'><tr class='dijitMenuItem dijitReset'><td class='dijitReset dijitMenuItemIconCell' style='width:"+(parseInt(this.iconWidth)+4) + "px;'><" + (this._useIconUrl ? "img":"div") + " style='display:none;width:"+this.iconWidth + ";height:"+this.iconHeight+";'/></td><td class='dijitReset dijitMenuItemLabel'>"+this.caption + "</td><td class='dijitReset dijitMenuArrow'><div class='popupIcon'/></td></tr></tbody></table>";
	this.domNode.innerHTML = html;
    },
    // TODO: I want code that will change how we render a button and its icon if there is an icon... 
    render: function(forceRender) {
	if (!forceRender && (!this.invalidCss || !this.isReflowEnabled())) return;
	wm.Control.prototype.render.call(this, forceRender);
	dojo.query(".dijitMenuItemLabel",this.domNode)[0].innerHTML = this.caption;
	var img = this._iconImage = dojo.query(".dijitMenuItemIconCell " + (this._useIconUrl ? "img":"div"),this.domNode)[0];
	img.style.width = this.iconWidth;
	img.style.height = this.iconHeight;
	if (this.iconUrl) {
	    img.src = this.iconUrl;
	}
	img.style.display = this.iconUrl || this.iconClass ? "block" : "none";
	var width = parseInt(this.iconWidth) || 0;
	img.parentNode.style.width = (width+4) + "px";
/*
	var height = parseInt(this.iconHeight) || 0;
	img.parentNode.style.height = (height+4) + "px";
	*/
    }

});

dojo.declare("wm.MobileIconButton", wm.ToolButton, {
    direction: "down",
    height: "40px",
    build: function() {
	this.inherited(arguments);
	var icon = this.iconNode = document.createElement("div");
	dojo.addClass(icon, "mblArrow " + "mbl" + wm.capitalize(this.direction) + "Arrow");
	this.domNode.appendChild(icon);
    },
    render: function(forceRender, noInherited) {
	wm.Control.prototype.render.call(this, forceRender);
    }

});