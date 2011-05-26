/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.mobile.Picture");

dojo.declare("wm.mobile.Picture", wm.Control, {
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
		this.connect(this.img, "click", this, "onclick");
		this.setSource(this.source);
		this.setAspect(this.aspect);
		this.setLink(this.link);
		this.setHint(this.hint);
	},
	setSource: function(inSource) {
		this.source = inSource || "";
		this.valueChanged("source", this.source);
		this.img.style.display = this.source ? "" : "none";
	    var root;
	    if (this.source.slice(0, 4) == "http" && this.source.slice(0, 1) == "/") {
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
	},
	onclick: function() {
	}
});

wm.Object.extendSchema(wm.mobile.Picture, {
    source: { type: "String", bindable: 1, group: "common", order: 1, focus: 1, subtype: "File", extensionMatch: ["jpg","jpeg","gif","png","tiff"], simpleBindTarget: true, doc: 1},
    hint: { group: "common", order: 2, doc: 1},
    link: { type: "String", bindable: 1, doc: 1},
    aspect: { group: "layout", order: 50},
    setSource: {group: "method", doc: 1},
    setHint: {group: "method", doc: 1},
    setLink: {group: "method", doc: 1}
});

// design-time 
dojo.extend(wm.mobile.Picture, {
        themeable: false,
        themeableDemoProps: {source: "images/add.png"},
	makePropEdit: function(inName, inValue, inDefault) {
		switch(inName){
			case "source": 
				return makePictureSourcePropEdit(inName, inValue, inDefault);
			case "aspect": 
				return makeSelectPropEdit(inName, inValue, ["h", "v", "none"], inDefault);
		}
		return this.inherited("makePropEdit", arguments);
	}
});

makePictureSourcePropEdit = function(inName, inValue, inDefault) {
	var i = makeInputPropEdit(inName, inValue, inDefault);
	var f = '<form class="inspector-filebox"><input class="inspector-fileinput" onchange="inspectFileboxUrlChange.call(this)" size="1" type="file"/></form>';
	return '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td>' + i + '</td><td>' + f + '</td></tr></table>';
}

