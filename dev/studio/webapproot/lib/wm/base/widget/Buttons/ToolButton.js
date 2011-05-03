/*
 *  Copyright (C) 2011 WaveMaker Software, Inc.
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

dojo.provide("wm.base.widget.Buttons.ToolButton");
dojo.require("wm.base.Control");

dojo.declare("wm.ToolButton", wm.Control, {
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
	iconWidth: "16px",
	iconHeight: "16px",
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
	    /* Sometimes users go from an editor to clicking a button and some browsers don't update the editor value in time for
	     * our onclick handler to see it.  So build in a delay before firing onclick handlers.  Also sometimes a user enters a value,
	     * and that value enables the save button, but only onblur.  So, we need an onidle to determine if the button is disabled or enabled.
	     * Making matters worse, we had to remove the dom-level disabling of the button so that the click method can still fire, do an onidle,
	     * and THEN test if its disabled
	     */
	    wm.onidle(this, function() {
		if (!this.disabled) {
		    if (!this.clicked) 
			this.setProp("clicked", true);
	            this.onclick(inEvent, this);
		}
	    });
	},
        onclick: function() {
	},
	findImageList: function() {
		var t = this;
		while (t && !t.imageList) {
			t = t.parent;
		}
		return t ? t.imageList : null;
	},
	setDisabled: function(inDisabled) {
	    if (inDisabled != this.disabled) {
		this.inherited(arguments);
		this.btnNode.disabled = inDisabled ? "disabled" : "";
		dojo[inDisabled ? "addClass" : "removeClass"](this.domNode, "wmbutton-disabled");

		/* Used to always call render, which destroys and recreates the button. Unfortunately,
		 * it had an annoying tendency to do this while the user is trying to click on it, which often
		 * means the user's click fails.  Example: I go from an editor to a button.  Editor's onchange is bound to this button's
		 * disabled state.  Call to setDisabled rerendered the button while I click on it. Click fails. */
		if (this._imageList && this.imageIndex && this.declaredClass == "wm.ToolButton") 
		    this.updateImageListButtonHtml();
	    }
	},
	setSelected: function(inSelected) {
	    this.selected = inSelected;
	    if (this._imageList && this.imageIndex && this.declaredClass == "wm.ToolButton") {
		this.updateImageListButtonHtml();
	    }
	},
	setCaption: function(inCaption) {
		this.caption = inCaption;
	        if (!this._cupdating) {
	            this.invalidCss = true;
		    this.render(true,true);
		}
	},
	setIconUrl: function(inUrl) {
		this.iconUrl = inUrl;
	        this.invalidCss = true;
	    this.render(true,true);
	},
	setIconWidth: function(w) {
	        this.iconWidth = w;
	        this.invalidCss = true;
	    this.render(true,true);
	},
	setIconHeight: function(h) {
	        this.iconHeight = h;
	        this.invalidCss = true;
	    this.render(true,true);
	},
	setIconMargin: function(m) {
	        this.iconMargin = m;
	        this.invalidCss = true;
	    this.render(true,true);
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
		    this.imageIndex = Number(inImageIndex);
			this.imageListChanged();
		}
	},
	imageListChanged: function() {
		var iln = this.findImageList();
		this._imageList = iln ? iln instanceof wm.ImageList ? iln : this.owner.getValueById(iln) : null;
	        this.invalidCss = true;
	    this.render(true,true);
	},
    getCurrentImageIndex: function() {
	if (this.declaredClass != "wm.ToolButton")
	    return this.imageIndex;

	// straight up toolbutton uses state to adjust the imageIndex; this requires imageLists to have multiple rows of icons, each row representing 
	// a different state.  This is a pain for users, so is not a part of any of the subclasses.
	if (this.disabled)
	    return this.imageIndex + this._imageList.colCount * 2;
	if (this.selected)
	    return this.imageIndex + this._imageList.colCount;
	return this.imageIndex;
    },
    updateImageListButtonHtml: function() {
	var sl = this.singleLine ? "line-height: " + this.height + "; " : "";
	var captionHtml = this.caption ? '<span style="padding-left: 2px; ' + sl +'">' + this.caption + '</span>' : "";
	var ii = this.getCurrentImageIndex();
	this.btnNode.innerHTML = this._imageList.getImageHtml(ii) + captionHtml;
    },
    render: function(forceRender, noInherited) {
	    if (!forceRender && (!this.invalidCss || !this.isReflowEnabled())) return;
            if (!noInherited)
	        this.inherited(arguments);
	    var il = this._imageList;
		if (il && il.getImageHtml && this.imageIndex >= 0) {
		    this.btnNode.style.padding = "0px";
		    this.updateImageListButtonHtml();
		} else if (this.iconUrl) {
                    var url = this.iconUrl;
                    var root;
	            if (url.indexOf("lib/") == 0) {
		      root = dojo.moduleUrl("lib").path.replace(/lib\/$/, "");
                        url = root + url;
                    } else {
			 root =  this.getPath() || "";
                    }
			var sl = this.singleLine ? "line-height: " + this.height + "; " : "";
			var captionHtml = this.caption ? '<span style="padding-left: 2px; ' + sl +'">' + this.caption + '</span>' : "";


			this.btnNode.innerHTML = "<img src='" + wm.theme.getImagesPath() + "blank.gif' style='margin: " + this.iconMargin + "; width: " + this.iconWidth + "; height: " + this.iconHeight + "; vertical-align: middle; background:url(" + root + url + ") no-repeat; background-color: transparent;' />" + captionHtml;

			this.btnNode.style.padding = "0px";
		} else {
			this.btnNode.innerHTML = this.caption;
			this.btnNode.style.padding = "";
		}
    },
    renderBounds: function() {
        this.inherited(arguments);
        if (!this._IEButtonTrickUsed && dojo.isIE && dojo.isIE < 9 && this.btnNode && this.btnNode.firstChild && this.btnNode.firstChild.tagName) {
            this._IEButtonTrickUsed = true;
            this.btnNode.firstChild.style.padding = "1px";
            wm.onidle(this, function() {
                this.btnNode.firstChild.style.padding = "0px";
            });
        }
    }
});

wm.Object.extendSchema(wm.ToolButton, {
	scrollX:  { ignore: 1 },
	scrollY:  { ignore: 1 },
        clicked: {ignore: 1, bindSource: true, type: "Boolean"},
        iconUrl: {group: "format", bindable: true, type: "String", subtype: "File"},
	iconWidth: {group: "format"},
	iconHeight: {group: "format"},
        iconMargin: {group: "format"}
});

wm.ToolButton.extend({
        scrim: true,

    showImageListDialog: function() {
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
    },
    editProp: function(inName, inValue) {
	switch (inName) {
	case "editImageIndex":
	    this.showImageListDialog();
	    return;
	}
	return this.inherited(arguments);
    },
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
		        case "editImageIndex":
		                return makeReadonlyButtonEdit(inName, inValue, inDefault);		    
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
