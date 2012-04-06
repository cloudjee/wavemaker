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


dojo.provide("wm.base.widget.Buttons.Button_design");
dojo.require("wm.base.widget.Buttons.ToggleButton");
dojo.require("wm.base.widget.Buttons.RoundedButton");
dojo.require("wm.base.widget.Buttons.PopupMenuButton");
dojo.require("wm.base.Control_design");


wm.Object.extendSchema(wm.ToolButton, {

    /* Display group; visual subgroup */
/*
    iconUrl:    {group: "display", subgroup: "visual", order: 100, bindTarget: true, type: "String", subtype: "File", advanced:1}, // resource manager
    iconWidth:  {group: "display", subgroup: "visual", order: 101, editor: "wm.prop.SizeEditor", advanced:1},
    iconHeight: {group: "display", subgroup: "visual", order: 102, editor: "wm.prop.SizeEditor", advanced:1},
    iconMargin: {group: "display", subgroup: "visual", order: 103, type: "String", advanced:1}, 
    */

    iconUrl:    {group: "widgetName", subgroup: "graphics", order: 100, bindTarget: true, type: "String", subtype: "File", advanced:1}, // resource manager
    iconWidth:  {group: "widgetName", subgroup: "graphics", order: 101, editor: "wm.prop.SizeEditor", advanced:1},
    iconHeight: {group: "widgetName", subgroup: "graphics", order: 102, editor: "wm.prop.SizeEditor", advanced:1},
    iconMargin: {group: "widgetName", subgroup: "graphics", order: 103, type: "String", advanced:1}, 

    /* Events group */
    onclick: {requiredGroup: 1, order: 50}, 

    /* Ignored Group */
    imageIndex: {ignore:0, advanced:1},
    editImageIndex: { ignore:0},
    imageList: { ignore: 0},
    scrollX:  { ignore: 1 },
    scrollY:  { ignore: 1 },
    clicked: {ignore: 1, bindSource: true, type: "Boolean"}

});

wm.ToolButton.extend({
        scrim: true
});


wm.Object.extendSchema(wm.Button, {

    /* Display group; text subgroup */
/*    caption: { group: "display", subgroup: "text", bindable: 1, order: 10, focus: 1, type: "String", requiredGroup: true },*/
    caption: { group: "widgetName", subgroup: "text", bindable: 1, order: 10, focus: 1, type: "String", requiredGroup: true },

    /* Methods group */
    setCaption: {method:1},
    setImageIndex: {method:1},
    setIconUrl: {method:1},
    setDisabled: {method:1},
    click:  {method:1}
});

wm.Object.extendSchema(wm.ToggleButton, {
    /* Display group; text subgroup */
    captionUp: { group: "widgetName", subgroup: "text", bindTarget: 1, order: 10, focus: 1, requiredGroup: true},
    captionDown: { group: "widgetName", subgroup: "text",  bindTarget: 1, order: 11, requiredGroup: true},

    /* Display group; misc subgroup */
    clicked: { group: "widgetName", subgroup: "editing", type: "Boolean", bindTarget: 1, bindSource: 1, order: 12, simpleBindProp: true},

    /* Ignored group */
    caption: {ignore: 1},

    /* Methods group */
    setClicked: {method:1},
    setCaptionUp: {method:1},
    setCaptionDown: {method:1}
});


wm.Button.description = "A simple button.";

/* DEPRECATED; REMOVE in WM 7.0 */
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


wm.Object.extendSchema(wm.IconButton, {
    iconUrl: {ignore: true},
    imageList:  {ignore: true},
    imageIndex: {ignore: true},
    iconMargin: {ignore: true},
    editImageIndex: {ignore: 1}
});

wm.PopupMenuButton.extend({
    themeableStyles: [{name: "wm.PopupMenuButton_Image", displayName: "Icon"}]
});

wm.Object.extendSchema(wm.PopupMenuButton, {
    /* Display group; text subgroup */
    caption: { bindSource:1 },
    editMenuItems: {group: "widgetName", subgroup: "text", operation: 1, order: 30, requiredGroup: true},    
    rememberWithCookie: {group: "widgetName", subgroup: "behavior", order: 40},

    /* Events group */
    onchangeNoInit: {advanced:1},

    /* Hidden/ignored group */
    iconClass: {hidden: true},
    fullStructureStr: {ignore: true}, /* deprecated */
    fullStructure: {hidden: true},
    fullStructure: {hidden: true},
    hint: {ignore: true},
    dojoMenu: {ignore: true, doc: 1},

    /* Method group */
    setIconClass: {method:1}
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

wm.ToggleButtonPanel.extend({
        afterPaletteDrop: function(){
	    this.inherited(arguments);
	    new wm.Button({owner: this.owner,
			   parent: this,
			   name: "togglePanelButton1",
			   caption: "Toggle1",
			   height: "100%",
			   width: "100%"
			  });
	    this.reflow();
	},
    set_buttonMargins: function(inMargin) {
	this.buttonMargins = inMargin;
	dojo.forEach(this._btns, function(b) {b.setMargin(inMargin);});
    },
    afterPaletteChildDrop: function(inButton) {
	inButton.setWidth("100%");
	inButton.setMargin("0");
	inButton.setPadding("0");
	inButton.setBorder("0,1,0,0");
    }
});

wm.Object.extendSchema(wm.ToggleButtonPanel, {
    currentButton: {group: "widgetName", subgroup: "behavior", bindable:1, readonly: 1, editor: "wm.prop.WidgetSelect", createWire: 1,editorProps: {widgetType: "wm.ToolButton", inspectedChildrenOnly: true}},
    currentButtonName: {ignore:1,bindSource:true, doc:1},
    currentButtonCaption: {ignore:1,bindSource:true, doc:1},
    themeStyleType: {group: "style", order: 150},
    
    setCurrentButton: {method:1},
    

});