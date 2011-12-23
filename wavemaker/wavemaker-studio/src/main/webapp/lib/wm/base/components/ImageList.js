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

dojo.provide("wm.base.components.ImageList");
dojo.require("wm.base.Component");

dojo.declare("wm.ImageList", wm.Component, {
	width: 32,
	height: 32,
	colCount: 100,
        iconCount: 100, // needed so we can generate a UI presenting all of these icons
	url: "",
    postInit: function() {
	this.inherited(arguments);
	if (this.iconCount < this.colCount) this.iconCount = this.colCount;
	this.createStyleSheet();
    },

    createStyleSheet: function() {
	var id = this.getImageClass();
	var style = dojo.byId(id);
	if (!style) {
	    style = this.domNode = document.createElement("style");
	    style.id = id;
	    style.type = "text/css";
	    document.getElementsByTagName("head")[0].appendChild(style);	
	}

	var url = this.url;
	if (this.url.indexOf("lib/") == 0) 
	    url = dojo.moduleUrl("lib").path.replace(/lib\/$/, "") + url;
	else if(this.isDesignLoaded() && this.owner != studio) {
	    url = "/" + studio.projectPrefix + studio.project.getProjectPath() + "/" + url;
	}


	var text = "";
	for (var i = 0; i < this.iconCount; i++) {
	    if (text) text += ",";
	    text += "." + id + "_" + i;
	}
	text += "{background-image: url(" + url + ") !important;background-repeat:no-repeat !important;width:"+this.width + "px;height: " + this.height + "px;}\n";
	for (var i = 0; i < this.iconCount; i++) {
	    var col = i % this.colCount;
	    var row = Math.floor(i / this.colCount);
	    text += "." + id + "_" + i + " {background-position: -" + (this.width*col) + "px -" + (this.height * row) + "px !important;}\n";
	}

	setCss(style, text);
    },
    destroy: function() {
	dojo.destroy(this.domNode);
	this.inherited(arguments);
    },
    getImageClass: function(inIndex) {
	var id = "";
	if (this.owner instanceof wm.Application) {
	    id += "app";
	} else if (this.isDesignLoaded() && this.owner == studio.page) {
	    id += studio.project.pageName;  // pageName: "Main"
	} else if (this.owner instanceof wm.Page) {
	    id += this.owner.declaredClass; // name: "main", declaredClass: "Main"; don't use name
	} else {
	    id += this.owner.getRuntimeId().replace(/\./g,"_");
	}
	id += "_" + this.name;
	if (inIndex == undefined)
	    return id;
	else 
	    return id + "_" + inIndex;
    },
	getImageHtml: function(inIndex) {
		var col = inIndex % this.colCount;
		var row = Math.floor(inIndex / this.colCount);
	        var url = this.url;
	        if (this.url.indexOf("lib/") == 0) 
		    url = dojo.moduleUrl("lib").path.replace(/lib\/$/, "") + url;
	        else if(this.isDesignLoaded() && this.owner != studio) {
		    url = "/" + studio.projectPrefix + studio.project.getProjectPath() + "/" + url;
		}
		return '<image src="' + wm.theme.getImagesPath() + 'blank.gif"' +
			' width="' + this.width + '"' + 
			' height="' + this.height + '"' + 
			' style="' +
			'vertical-align: middle; ' + 
			'background:url(' + url + ') no-repeat ' + (-this.width * col) + 'px ' + (-this.height * row) + 'px;"' +
			'>';
	}    
});
