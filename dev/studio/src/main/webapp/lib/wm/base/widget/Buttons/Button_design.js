/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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
dojo.require("wm.base.Control_design");
wm.Object.extendSchema(wm.ToolButton, {
    imageIndex: {ignore:0},
    editImageIndex: { ignore:0},
    imageList: { ignore: 0},

	scrollX:  { ignore: 1 },
	scrollY:  { ignore: 1 },
        clicked: {ignore: 1, bindSource: true, type: "Boolean"},
    iconUrl: {group: "format", bindTarget: true, type: "String", subtype: "File", order: 102},
    iconWidth: {group: "format", order: 100, editor: "wm.prop.SizeEditor"},
    iconHeight: {group: "format", order: 101, editor: "wm.prop.SizeEditor"},
    iconMargin: {group: "format", order: 103}
});

wm.ToolButton.extend({
        scrim: true
});


wm.Object.extendSchema(wm.Button, {
    caption: { group: "display", bindable: 1, order: 10, focus: 1, type: "String" },
    setCaption: {method:1,doc: 1},
    setImageIndex: {method:1,doc: 1},
    setIconUrl: {method:1,doc: 1},
    setDisabled: {method:1, doc: 1},
    click:  {method:1,  doc: 1}
});

wm.Object.extendSchema(wm.ToggleButton, {
    captionUp: { group: "display", bindTarget: 1, order: 10, focus: 1, doc: 1},
    captionDown: { group: "display", bindTarget: 1, order: 11, doc: 1},
    clicked: { group: "display", type: "Boolean", bindTarget: 1, bindSource: 1, order: 12, simpleBindProp: true,doc: 1},
    caption: {ignore: 1},
    setClicked: {method:1, params: "(inClicked)", doc: 1},
    setCaptionUp: {method:1},
    setCaptionDown: {method:1}
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
    caption: { bindSource:1 },
    iconClass: {hidden: true},
    editMenuItems: {group: "operation", operation: 1},
    fullStructureStr: {ignore: true}, /* deprecated */
    fullStructure: {hidden: true},
    fullStructure: {hidden: true},
    hint: {ignore: true},
    iconUrl: {ignore: true},
    imageList:  {ignore: true},
    imageIndex: {ignore: true},
    iconMargin: {ignore: true},
    dojoMenu: {ignore: true, doc: 1},
    editImageIndex: {ignore: 1},
    setIconClass: {method:1, doc: 1}
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
    makePropEdit: function(inName, inValue, inEditorProps) {
	    var prop = this.schema ? this.schema[inName] : null;
	    var name =  (prop && prop.shortname) ? prop.shortname : inName;
	switch (inName) {
	case "caption":
	    var list = this.buildCaptionList(this.dojoMenu.fullStructure, false);
	    return new wm.SelectMenu(dojo.mixin(inEditorProps, {options: list}));
	}
	return this.inherited(arguments);
    },

    editMenuItems: function() {
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
});
