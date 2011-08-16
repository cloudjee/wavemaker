/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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


    /* optional ImageList methods */
	setImageList: function(inImageList) {
		this.imageList = inImageList;
		this.imageListChanged();
	},
	setImageIndex: function(inImageIndex) {
		if (inImageIndex !== undefined) {
		    this.imageIndex = Number(inImageIndex);
			this.imageListChanged();
		}
	},
	imageListChanged: function() {
	    var iln = this.findImageList();
	    this._imageList = iln ? iln instanceof wm.ImageList ? iln : this.owner.getValueById(iln) : null;
	    if (this._imageList) {
		this.linkNode.style.display = "inline-block";
		this.linkNode.className = "wmpicture " + this._imageList.getImageClass(this.imageIndex);
	    }
	},
	findImageList: function() {
		var t = this;
		while (t && !t.imageList) {
			t = t.parent;
		}
		return t ? t.imageList : null;
	}
});

wm.Object.extendSchema(wm.Picture, {
    source: { type: "String", bindable: 1, group: "common", order: 1, focus: 1, subtype: "File", extensionMatch: ["jpg","jpeg","gif","png","tiff"], simpleBindTarget: true, doc: 1},
    hint: { group: "common", order: 2, doc: 1},
    link: { type: "String", bindable: 1, doc: 1},
    aspect: { group: "layout", order: 50},
    setSource: {group: "method", doc: 1},
    setHint: {group: "method", doc: 1},
    setLink: {group: "method", doc: 1},


	imageList: { group: "display",order: 50},
    imageIndex: { group: "display", order: 51, type: "Number",  doc: 1},
    editImageIndex: { group: "display", order: 52, type: "String", doc: 1},
    setCaption: {group: "method",doc: 1},
    setImageIndex: {group: "method",doc: 1},

});

// design-time 
dojo.extend(wm.Picture, {
        scrim: true,
        themeable: false,
        themeableDemoProps: {source: "images/add.png"},
	makePropEdit: function(inName, inValue, inDefault) {
	    var prop = this.schema ? this.schema[inName] : null;
	    var name =  (prop && prop.shortname) ? prop.shortname : inName;
		switch(inName){
/*
			case "source": 
				return makePictureSourcePropEdit(inName, inValue, inDefault);
				*/
		        case "editImageIndex":
		                return makeReadonlyButtonEdit(name, inValue, inDefault);		    
			case "aspect": 
				return makeSelectPropEdit(inName, inValue, ["h", "v", "none"], inDefault);
		}
		return this.inherited("makePropEdit", arguments);
	},
    editProp: function(inName, inValue) {
	switch (inName) {
	case "editImageIndex":
	    this.showImageListDialog();
	    return;
	}
	return this.inherited(arguments);
    },
    showImageListDialog: function() {
	/* Make sure we have an ImageList */
	var imageList = this._imageList
	if (!imageList) {
	    var imageListName = studio.getImageLists()[0];
	    if (imageListName) {
		this.setImageList(imageListName);
		imageList = this._imageList;
	    }
	}
	if (imageList) {
	    var popupDialog = imageList.getPopupDialog();
	    popupDialog.fixPositionNode = dojo.query(".wminspector-prop-button",dojo.byId("propinspect_row_editImageIndex"))[0];
	    
	    this._designImageListSelectCon = dojo.connect(imageList._designList, "onselect", this, function() {		    
		    this.setImageIndex(imageList._designList.getSelectedIndex());
		    studio.inspector.reinspect();
	    });

	    popupDialog.show();
	    this._designImageListPopupCloseCon = dojo.connect(popupDialog, "setShowing", this, function(inShowing) {
		if (!inShowing || studio.selected != this) {
		    dojo.disconnect(this._designImageListPopupCloseCon);
		    delete this._designImageListPopupCloseCon;
		    dojo.disconnect(this._designImageListSelectCon);
		    delete this._designImageListSelectCon;
		}
	    });
	}
    }
});
/*
makePictureSourcePropEdit = function(inName, inValue, inDefault) {
	var i = makeInputPropEdit(inName, inValue, inDefault);
	var f = '<form class="inspector-filebox"><input class="inspector-fileinput" onchange="inspectFileboxUrlChange.call(this)" size="1" type="file"/></form>';
	return '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td>' + i + '</td><td>' + f + '</td></tr></table>';
}

*/