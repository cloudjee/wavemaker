/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.DojoMenu_design");
dojo.require("wm.base.widget.DojoMenu");


// design only...
wm.Object.extendSchema(wm.DojoMenu, {
    /* Display group; text subgroup */
    editMenuItems: {group: "widgetName", subgroup: "text", operation: 1, requiredGroup: 1, contextMenu: 1},

    /* Display group; layout subgroup */
    vertical: {group: "widgetName", subgroup: "display"},

    /* Display group; misc subgroup */
    openOnHover: {group: "widgetName", subgroup: "behavior", advanced:1},

    /* Style group */
    transparent: {group: "widgetName", subgroup: "display", order: 150, type: "Boolean"},

    /* Hidden group: These properties are generated through interactions and are not directly edited on the property panel; written but not shown */
    fullStructure: {hidden: true, nonlocalizable: true},
    localizationStructure: {hidden: true},



    /* Ignored group */
    menu: {ignore: true}, /* Originally contained string describing the menu */
    fullStructureStr: {ignore: true}, /* Originally contained string describing the menu */
    structure:{ignore: 1,  order:10}, /* Originally contained string describing the menu */
    eventList:{ignore:1}, /* No longer used; eventList should be read into fullStructure */
    disabled:{ignore:1},
    menuItems:{ignore:1},




    setItemDisabled: {method:1},// TODO: propdoc
    setItemShowing: {method:1}// TODO: propdoc
});

wm.DojoMenu.description = "A dojo menu.";

wm.DojoMenu.extend({
    scrim: true,
    editMenuItems: "(Edit Menu Items)",

    themeableStyles: [{name: "wm.DojoMenu-Right_Margin", displayName: "Right Margin"},
		      {name: "wm.DojoMenu-Down_Image", displayName: "Drop Icon (MenuBar)"},
		      {name: "wm.DojoMenu-Right_Image", displayName: "Drop Icon (SubMenu)"}],
    afterPaletteDrop: function() {
	this.inherited(arguments);
	this.setFullStructure(studio.getDictionaryItem("wm.PopupMenu.DEFAULT_STRUCTURE"));
	this.renderDojoObj();
    },
	designCreate: function() {
		// if this is being created in studio, supply a default caption
		if (this._studioCreating)
			this.studioCreate();
		this.inherited(arguments);
	},

    editMenuItems: function() {
		    if (!studio.menuDesignerDialog) {
			studio.menuDesignerDialog = 
			    new wm.PageDialog({pageName: "MenuDesigner", 
					       name: "MenuDesignerDialog",
					       title: studio.getDictionaryItem("wm.DojoMenu.MENU_DESIGNER_TITLE"),
					       hideControls: true,
					       owner: studio,
					       width: "250px",
					       height: "350px"});
		    }
		    studio.menuDesignerDialog.page.setMenu(this);
		    studio.menuDesignerDialog.show();
	},

	setOpenOnHover: function(inValue){
		this.openOnHover = inValue;
    if (this.dojoObj)
		  this.dojoObj.openOnHover = this.openOnHover;
			
    if (this.openOnHover && !this.vertical){
      this.hoverConnect = dojo.connect(this.dojoObj, 'onItemHover', this, '_onItemHover');  
    } else {
      if (this.hoverConnect)
			 dojo.disconnect(this.hoverConnect);  
		}
	},

	listProperties: function(){
		var props = this.inherited(arguments);
		for (evt in props)
		{
			if (props[evt].isMenuItem)
				delete props[evt];
		}
	    if (this.fullStructure) {
		this.addNodesToPropList(this.fullStructure, props);
	    } else {
		dojo.forEach(this.eventList, function(obj){
			props[this.getEventName(obj.defaultLabel || obj.label)] = {isEvent:true, isObject:false, noprop:false, type: 'string', isMenuItem:true};
		}, this);
	    }
		return props;
	},
    addNodesToPropList: function(struct, props) {
	for (var i = 0; i < struct.length; i++) {
	    if (!struct[i].separator) {
		if (!struct[i].children || struct[i].children.length == 0)
		    props[this.getEventName(struct[i].defaultLabel || struct[i].label)] = {isEvent: true, isObject: false, noprop: false, type: "string", isMenuItem: true};
		if (struct[i].children)// test for children; needed on upgraded projects
		    this.addNodesToPropList(struct[i].children,props);
	    }
	}

    },
	writeEvents:function(arg){
		var e = this.inherited(arguments);
		return e;
	},
	generateEventName: function(p){
		var name = this.inherited(arguments);
		return this.getCleanText(name);
	},
	updatingEvent: function (prop, inValue){
	    var evtObj = this.fullStructure ? this.getEventObjFull(this.fullStructure,prop) : this.getEventObj(prop);
	    if (evtObj != null)
		evtObj.onClick = inValue;
	    if (studio.languageSelect.getDisplayValue() != "default" && this._original_i18n_fullStructure) {
		evtObj = this.getEventObjFull(this._original_i18n_fullStructure, prop);
		if (evtObj != null)
		    evtObj.onClick = inValue;
	    }
	},
        getEventObjFull: function (struct,prop){
	    for (var i = 0; i < struct.length; i++) {
		if ((struct[i].defaultLabel || struct[i].label) && this.getEventName(struct[i].defaultLabel || struct[i].label) == prop) {
		    return struct[i];
		}
		if (struct[i].children) {// test for children needed on upgraded projects
		    var result = this.getEventObjFull(struct[i].children,prop);
		    if (result) return result;
		}
	    }
	},
	getEventObj: function (prop){
		prop = this.getCleanText(prop);
		for (var i = 0; i < this.eventList.length; i++)
		{
			if (prop == this.getEventName(this.eventList[i].defaultLabel || this.eventList[i].label))
			{
				return this.eventList[i];
			}
		}
		
		return null;
	},
	setVertical: function (inValue){
		this.vertical = inValue;
		if (this.vertical)
		{
			this.setHeight('100%');
			this.setWidth('95px');
		}
		else
		{
			this.setHeight('35px');
			this.setWidth('100%');
		}

		this.renderDojoObj();
	},
	getProp: function (inProp){
	    var evtObj = this.fullStructure ? this.getEventObjFull(this.fullStructure,inProp) : this.getEventObj(inProp);
		if (evtObj != null)
			return evtObj.onClick;
		else
			return this.inherited(arguments);
	},
	setProp: function(inProp, inValue){
	    var evtObj = this.fullStructure ? this.getEventObjFull(this.fullStructure,inProp) : this.getEventObj(inProp);
	    if (evtObj != null) 
			this.updatingEvent(inProp, inValue);
		else
			this.inherited(arguments);
	},
	getCleanText: function(text) {
		return text.replace(/[^a-zA-Z0-9]+/g, '_');
	},
	getEventName: function(label){
		return 'on' + this.getCleanText(label) + 'Click';	

	},
        getSharedEventLookupName: function(inProp) {
            if (inProp.match(/^on.*Click$/)) return "onClick";
            else return inProp;
	},
    renameComponentEvents: function(originalId, newId) {
	this.inherited(arguments); // handles non-menu-item events
	this.renameComponentEventsMenu(this.getFullStructure(),originalId, newId);
    },
    renameComponentEventsMenu: function(children,originalId, newId) {
	    for (var i = 0; i < children.length; i++)
	    {
		var item = children[i];
		if (item.onClick && item.onClick == originalId)
		    item.onClick = newId;
		if (item.children)
		    this.renameComponentEventsMenu(item.children,originalId,newId);
	    }
    },
    getFullStructure: function() {
	if (!this.fullStructure && this.fullStructureStr) {
	    this.setFullStructureStr(this.fullStructureStr);
	}
	return this.fullStructure;
    },
    setLocalizationStructure: function(inStruct) {
	this.localizationStructure = inStruct;
	/* To insure it gets written correctly, update the structure itself */
	this.forEachMenuItem(this.fullStructure, function(menuItem) {
	    if (inStruct[menuItem.defaultLabel])
		menuItem.label = inStruct[menuItem.defaultLabel];
	});


	this.renderDojoObj();
    },
    getLocalizationStructure: function(optionalInStruct) {
	    var l = this.localizationStructure = {};
	if (studio.languageSelect.getDisplayValue() == "default") {
	    return l;
	} else {
	    this.forEachMenuItem(optionalInStruct && typeof optionalInStruct == "object" ? optionalInStruct : this.fullStructure, function(menuItem) {
		l[menuItem.defaultLabel || menuItem.label] = menuItem.label;
	    });
	    return l;
	}
    },
/*
    write: function() {
	return this.inherited(arguments);
    },

    set_fullStructureStr: function(inStruct) {
	if (studio.languageSelect.getDisplayValue() != "default") {
	    var struct = dojo.fromJson(inStruct);
	    this.copyLocalizedEvents(struct, {children:this.fullStructure});
	    inStruct = dojo.toJson(struct);
	}
	this.setFullStructureStr(inStruct,true);
    },
    */
    set_fullStructure: function(inStruct) {
	if (studio.languageSelect.getDisplayValue() != "default") {
	    this.getLocalizationStructure(inStruct);
	}

	this.setFullStructure(inStruct);
	this.renderDojoObj();
	wm.onidle(this, function() {studio.reinspect(true);});
    },
    findItemInFullStructure: function(inStruct, inDefaultLabel) {
	for (var i = 0; i < inStruct.children.length; i++) {
	    var item = inStruct.children[i];
	    if (item.defaultLabel == inDefaultLabel)
		return item;
	    else if (item.children && item.children.length) {
		var itemResult = this.findItemInFullStructure(item, inDefaultLabel);
		if (itemResult)
		    return itemResult;
	    }
	}
	return null;
    }
/*
    copyLocalizedEvents: function(inStruct, inCurrentStruct) {
	for (var i = 0; i < inCurrentStruct.children.length; i++) {
	    var item = inCurrentStruct.children[i];
	    if (item.onClick) {
		var itemToCopyTo = this.findItemInFullStructure(inStruct, item.defaultLabel || item.label);
		if (itemToCopyTo) {
		    itemToCopyTo.onClick = item.onClick;
		}
	    }
	    if (item.children && item.children.length) {
		this.copyLocalizedEvents(inStruct, inCurrentStruct.children[i]);
	    }
	}
    }
    */
});


wm.PopupMenu.extend({
    afterPaletteDrop: function() {
	this.setParent(null);
	studio.designer.domNode.appendChild(this.domNode);

	this.inherited(arguments);
	this.activate();
    }
});

wm.Object.extendSchema(wm.PopupMenu, {


    /* Ignored group, basicaly strips out everything that makes this a widget */
    styles: {ignore:true},
    vertical: {ignore:true},
    isPopupMenu: {ignore:true},
    transparent: {ignore:true},
    openOnHover: {ignore: true},
    width: {ignore:true},
    height: {ignore:true},
    showing: {ignore:true},
    border: {ignore:true},
    borderColor: {ignore:true},
    margin: {ignore:true},
    padding: {ignore:true},
    scrollX: {ignore:true},
    scrollY: {ignore:true},
    onclick: {ignore: true},
    onRightClick: {ignore: true},
    onMouseOver: {ignore: true},
    onMouseOut: {ignore: true},
    minWidth: {ignore: true},
    minHeight: {ignore: true},
    hint: {ignore: true}
});
