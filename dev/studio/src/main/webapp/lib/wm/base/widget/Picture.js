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

dojo.provide("wm.base.widget.Picture");

dojo.declare("wm.Picture", wm.Control, {
	aspect: "none",
	hint: "",
	width: "100px",
	height: "100px",
	link: "",
	source: "",
	init: function() {
		this.inherited(arguments);
		var d=this.domNode;
		d.innerHTML = '<a><img></a>';
		dojo.addClass(d, "wmpicture");
		this.linkNode = d.firstChild;
		this.img = this.linkNode.firstChild;
		dojo.addClass(this.img, "wmpicture-image");
		//this.connect(this.img, "load", this, "imageLoaded");
	        this.connect(this.img, "click", this, function(evt) {
		    dojo.stopEvent(evt);
		    wm.onidle(this,"onclick"); // don't pass evt which after a delay will become undefined in some browsers
		});
	        this.connect(this.linkNode, "click", this, function(evt) {
		    dojo.stopEvent(evt);
		    wm.onidle(this,"onclick"); // don't pass evt which after a delay will become undefined in some browsers
		});
		this.setSource(this.source);
		this.setAspect(this.aspect);
		this.setLink(this.link);
		this.setHint(this.hint);
	        if (this.imageList)
		    this.imageListChanged();
	},
	setSource: function(inSource) {
	    this.source = inSource || "";
	    this.valueChanged("source", this.source);
	    this.img.style.display = this.source ? "" : "none"; // hiding now done by className
	    var root;
	    if (this.source.slice(0, 4) == "http" || this.source.slice(0, 1) == "/") {
		root = "";
	    } else if (this.source.indexOf("lib/") == 0) {
		root = dojo.moduleUrl("lib").path.replace(/lib\/$/, "");
	    } else {
		root = this.getPath();
	    }
		this.img.src = root + this.source;
	},
	setHint: function(inHint) {
		this.domNode.title = this.hint = inHint;
	},
	setAspect: function(inAspect) {
		var s=this.img.style, w="width", h="height", a=this.aspect=inAspect;
		s.width = (a=="v" ? "100%" : "");
		s.height = (a=="h" ? "100%" : "");
	},
	setLink: function(inLink) {
	    this.link = inLink;
	    if (inLink) {
		this.linkNode.target = "_blank";
		this.linkNode.href = inLink;
	    } else
		this.linkNode.removeAttribute("href");

	    /* Make it bindable */
	    this.valueChanged("link", inLink);
	},
	onclick: function() {
	},


	imageListChanged: function() {
	    this.inherited(arguments);
	    if (this._imageList) {
		this.linkNode.style.display = "inline-block";
		this.linkNode.className = "wmpicture " + this._imageList.getImageClass(this.imageIndex);
	    }
	},
    toHtml: function() {
	return "<img class='wmpicture' style='width:" + this.bounds.w + "px;height:" + this.bounds.h + "px' src='" + this.img.src + "'/>";
    }
});

