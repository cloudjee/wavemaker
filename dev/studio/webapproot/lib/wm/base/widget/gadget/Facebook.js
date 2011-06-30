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


dojo.provide("wm.base.widget.gadget.Facebook");
dojo.require("wm.base.widget.gadget.Gadget");


dojo.declare("wm.gadget.Facebook", wm.Gadget, {});
wm.Object.extendSchema(wm.gadget.Facebook, {
    base_source: {ignore: 1}
});

/* For more info on the properties:
 * http://developers.facebook.com/docs/reference/plugins/like/ 
 */
dojo.declare("wm.gadget.FacebookLikeButton", wm.gadget.Facebook, {
    width: "400px",
    height: "100px",
    base_source: "http://www.facebook.com/plugins/like.php",
    href: "", //URL to like; we may want to control this
    layout: "standard",
    show_faces: true, // standard layout only
    action: "like",
    font: "arial",
    colorscheme: "dark",
    ref: "",
    updateSource: function() {
	var b = this.getContentBounds();
	this._width = b.w;
	this._height = b.h;
	this.source = this.base_source + "?" + 
	    "href=" + this.href + 
	    "&layout="+this.layout + 
	    "&show_faces=" + this.show_faces +
	    "&action=" + this.action +
	    "&font=" + this.font + 
	    "&width=" + this._width + 
	    "&height=" + this._height + 
	    "&ref=" + this.ref + 
	    "&colorscheme=" + this.colorscheme;
	    this.setSource(this.source);
    },
    renderBounds: function() {
	this.inherited(arguments);
	var b = this.getContentBounds();
	if (b.w != this._width || b.h != this._height)
	    this.updateSource();
    },
    setHref: function(inValue) {
	this.href = inValue;
	this.updateSource();
    },
    setLayout: function(inValue) {
	this.layout = inValue;
	switch(inValue) {
	case "box_count":
	    this.setWidth(87 + this.padBorderMargin.r + this.padBorderMargin.l + "px");
	    this.setHeight(62 + this.padBorderMargin.t + this.padBorderMargin.b + "px");
	    break;
	case "button_count":
	    this.setWidth(70 + this.padBorderMargin.r + this.padBorderMargin.l + "px");
	    this.setHeight(21 + this.padBorderMargin.t + this.padBorderMargin.b + "px");
	    break;
	case "standard":
	    if (this.bounds.w < 150) 
		this.setWidth(400 + this.padBorderMargin.r + this.padBorderMargin.l + "px");
	    if (this.bounds.h < 50)
	    this.setHeight(80 + this.padBorderMargin.t + this.padBorderMargin.b + "px");		
	    break;
	}
	this.updateSource();
    },
    setShow_Faces: function(inValue) {
	this.show_faces = inValue;
	this.updateSource();
    },
    setAction: function(inValue) {
	this.action = inValue;
	this.updateSource();
    },
    setFont: function(inValue) {
	this.font = inValue;
	this.updateSource();
    },
    setColorscheme: function(inValue) {
	this.colorscheme = inValue;
	this.updateSource();
    },
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
		case "layout":
			return makeSelectPropEdit(inName, inValue, ["standard", "button_count", "box_count"], inDefault);
		case "action":
			return makeSelectPropEdit(inName, inValue, ["like", "recommend"], inDefault);
		case "font":
		    return makeSelectPropEdit(inName, inValue, ["arial", "licida grande", "segoe ui", "tahoma", "trebuchet ms", "verdana"], inDefault);
		case "colorscheme":
		    return makeSelectPropEdit(inName, inValue, ["dark", "light"], inDefault);

		}
		return this.inherited(arguments);
	}

});


wm.Object.extendSchema(wm.gadget.FacebookLikeButton, {
    href: {bindTarget: true}
});

dojo.declare("wm.gadget.FacebookActivityFeed", wm.gadget.Facebook, {
    width: "200px",
    height: "400px",
    base_source: "http://www.facebook.com/plugins/activity.php",
    site: "http://wavemaker.com", //URL to like; we may want to control this
    showHeader: true, // actual parameter is "header"
    font: "arial",
    colorscheme: "dark",
    showRecommendations: false, // actual parameter is "recommendations"
    ref: "",    
    updateSource: function() {
	var b = this.getContentBounds();
	this._width = b.w;
	this._height = b.h;
	this.source = this.base_source + "?" + 
	    "site=" + this.site + 
	    "&header="+this.showHeader + 
	    "&recommendations=" + this.showRecommendations +

	    "&font=" + this.font + 
	    "&width=" + this._width + 
	    "&height=" + this._height + 
	    "&ref=" + this.ref + 
	    "&colorscheme=" + this.colorscheme;
	    this.setSource(this.source);
    },
    renderBounds: function() {
	this.inherited(arguments);
	var b = this.getContentBounds();
	if (b.w != this._width || b.h != this._height)
	    this.updateSource();
    },
    setSite: function(inValue) {
	this.site = inValue;
	this.updateSource();
    },
    setShowHeader: function(inValue) {
	this.showHeader = inValue;
	this.updateSource();
    },
    setShowRecommendations: function(inValue) {
	this.showRecommendations = inValue;
	this.updateSource();
    },
    setFont: function(inValue) {
	this.font = inValue;
	this.updateSource();
    },
    setColorscheme: function(inValue) {
	this.colorscheme = inValue;
	this.updateSource();
    },
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
		case "font":
		    return makeSelectPropEdit(inName, inValue, ["arial", "licida grande", "segoe ui", "tahoma", "trebuchet ms", "verdana"], inDefault);
		case "colorscheme":
		    return makeSelectPropEdit(inName, inValue, ["dark", "light"], inDefault);

		}
		return this.inherited(arguments);
	}

});

