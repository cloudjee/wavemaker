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


dojo.provide("wm.base.widget.Buttons.Button_design");
dojo.require("wm.base.widget.Buttons.ToggleButton");
dojo.require("wm.base.widget.Buttons.RoundedButton");
dojo.require("wm.base.widget.Buttons.PopupMenuButton");

wm.Object.extendSchema(wm.ToolButton, {
	scrollX:  { ignore: 1 },
	scrollY:  { ignore: 1 },
        clicked: {ignore: 1, bindSource: true, type: "Boolean"},
        iconUrl: {group: "format", bindTarget: true, type: "String", subtype: "File"},
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
	    var prop = this.schema ? this.schema[inName] : null;
	    var name =  (prop && prop.shortname) ? prop.shortname : inName;
		switch (inName) {
		        case "editImageIndex":
		                return makeReadonlyButtonEdit(name, inValue, inDefault);		    
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
	}
});


wm.Object.extendSchema(wm.ToggleButton, {
    captionUp: { group: "display", bindTarget: 1, order: 10, focus: 1, doc: 1},
    captionDown: { group: "display", bindTarget: 1, order: 11, doc: 1},
    clicked: { group: "display", type: "Boolean", bindTarget: 1, bindSource: 1, order: 12, simpleBindProp: true,doc: 1},
    caption: {ignore: 1},
    setClicked: {group: "method", params: "(inClicked)", doc: 1},
    setCaptionUp: {group: "method"},
    setCaptionDown: {group: "method"}
});

wm.Object.extendSchema(wm.Button, {
    caption: { group: "display", bindable: 1, order: 10, focus: 1, type: "String" },
	hint: { group: "display", order: 20 },
	imageList: { group: "display",order: 50},
    imageIndex: { group: "display", order: 51, type: "Number",  doc: 1},
    editImageIndex: { group: "display", order: 52, type: "String", doc: 1},
    setCaption: {group: "method",doc: 1},
    setImageIndex: {group: "method",doc: 1},
    setIconUrl: {group: "method",doc: 1},
    setDisabled: {group: "method", doc: 1},
    click:  {group: "method",  doc: 1}
});
wm.Button.description = "A simple button.";

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



wm.PopupMenuButton.extend({
    themeableStyles: [{name: "wm.PopupMenuButton_Image", displayName: "Icon"}]
});

wm.Object.extendSchema(wm.PopupMenuButton, {
    caption: { group: "display", order: 10, focus: 1, type: "String", bindSource:1 },
    iconClass: {hidden: true},
    editMenuItems: {group: "operation"},
    fullStructureStr: {hidden: true},
    fullStructure: {hidden: true},
    hint: {ignore: true},
    iconUrl: {ignore: true},
    imageList:  {ignore: true},
    imageIndex: {ignore: true},
    iconMargin: {ignore: true},
    dojoMenu: {ignore: true, doc: 1},
    editImageIndex: {ignore: 1},
    setIconClass: {group: "method", doc: 1}
});   


wm.PopupMenuButton.extend({
    editMenuItems: "(Edit Menu Items)",
    afterPaletteDrop: function() {
	this.inherited(arguments);
	this.set_fullStructure(studio.getDictionaryItem("wm.PopupMenu.DEFAULT_STRUCTURE"));
    },

    set_fullStructure: function(inObj) {
	this.fullStructure = inObj;
	this.setFullStructure(inObj);
    },

    set_caption: function(inCaption) {
	var list = this.buildCaptionList(this.dojoMenu.fullStructure, true);
	for (var i = 0; i < list.length; i++) {
	    if (!inCaption || inCaption == list[i].label) {
		this.setIconClass(list[i].iconClass);
		return this.setCaption(inCaption);
	    }
	}
    },
    buildCaptionList: function(inNode, returnObj) {
	var list = [];
	dojo.forEach(inNode, dojo.hitch(this, function(struct) {
	    if (struct.children && struct.children.length) {
		list = list.concat(this.buildCaptionList(struct.children, returnObj));
	    } else {
		list.push(returnObj ? struct : struct.label);
	    }
	}));
	return list;
    },
    makePropEdit: function(inName, inValue, inDefault) {
	    var prop = this.schema ? this.schema[inName] : null;
	    var name =  (prop && prop.shortname) ? prop.shortname : inName;
	switch (inName) {
	case "editMenuItems":
	    return makeReadonlyButtonEdit(name, inValue, inDefault);
	case "caption":
	    var list = this.buildCaptionList(this.dojoMenu.fullStructure, false);
	    return makeSelectPropEdit("caption", this.caption, list, list[0]);
	}
	return this.inherited(arguments);
    },
    setPropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "caption":
	    var editor = dijit.byId("studio_propinspect_caption");
	    var store = editor.store.root;
	    while (store.firstChild) store.removeChild(store.firstChild);
	    var list = this.buildCaptionList(this.dojoMenu.fullStructure, false);
	    for (var i = 0; i < list.length; i++) {
		var node = document.createElement("option");
		node.innerHTML = list[i];
		var editor = dijit.byId("studio_propinspect_operation");
		if (editor) editor.set(inValue, false);
		store.appendChild(node);
	    }
	    editor.set(inValue, false);
	    return true;
	}
	return this.inherited(arguments);
    },
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
		case "editMenuItems":
		    if (!studio.menuDesignerDialog) {
			studio.menuDesignerDialog = new wm.PageDialog({pageName: "MenuDesigner", 
								       name: "MenuDesignerDialog",
								       title: studio.getDictionaryItem("wm.PopupMenuButton.MENU_DESIGNER_TITLE"),
								       hideControls: true,
								       owner: studio,
								       width: "250px",
								       height: "350px"});
		    }
		    studio.menuDesignerDialog.page.setMenu(this,{content: this.caption,
								 iconClass: this.iconClass},true);
		    studio.menuDesignerDialog.show();
		}
	}
});
