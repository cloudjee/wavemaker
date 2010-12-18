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

wm.Object.extendSchema(wm.ImageList, {
    url: { group: "display", bindable: 1, type: "String", subtype: "File", order: 10, focus: 1, extensionMatch: ["jpg","jpeg","gif","png","tiff"]  }
});

wm.ImageList.extend({
    set_width: function(inWidth) {
	this.width = inWidth;
	if (this._designPopupDialog)
	    this._designPopupDialog.setWidth((this.width + 35) + "px");
	this.createStyleSheet();
    },
    set_height: function(inHeight) {
	this.height = inHeight;
	this.createStyleSheet();
    },
    setUrl: function(inUrl) {
	this.url = inUrl;
	this.createStyleSheet();
    },
    getPopupDialog: function() {
	var d = this._designPopupDialog;
	if (!d) {
	    d = this._designPopupDialog = new wm.Dialog({owner: studio,
							     name: this.getRuntimeId() + "_designPopupDialog",
							 width: (this.width + 35) + "px",
							     height: "200px",
							     useContainerWidget: true,
							     modal: false,
							 noMinify: true,
							 noMaxify: true,
							     title: "-"});
	    d.containerWidget.setPadding("0");
	    dojo.addClass(d.domNode, "Studio-imageListPopupDialog");
	    var l = this._designList = new wm.List({owner: studio,
						    name: this.getRuntimeId() + "_designList",
						    parent: d.containerWidget,
						    headerVisible: false,
						    width: "100%",
						    height: "100%"});
	    var v = this._designVariable = new wm.Variable({owner: studio,
							    name: this.getRuntimeId() + "_designVariable",
							    type: "StringData"});
	    l.connect(l, "onselect", d, "dismiss");
	} else {
	    var l = this._designList;
	    var v = this._designVariable;
	}
	var data = [];
	for (var i = 0; i < this.iconCount; i++)
	    data.push({dataValue: this.getImageHtml(i)});
	v.setData(data);
	l.setDataSet(v);
	return this._designPopupDialog;

    },
    set_owner: function(inOwner) {
	this.inherited(arguments);
	if (this.domNode)
	    dojo.destroy(this.domNode);
	this.createStyleSheet();
    }
});