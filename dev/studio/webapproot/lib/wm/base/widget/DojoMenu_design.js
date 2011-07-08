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

dojo.provide("wm.base.widget.DojoMenu_design");
dojo.require("wm.base.widget.DojoMenu");


// design only...
wm.Object.extendSchema(wm.DojoMenu, {
    transparent: {group: "style", order: 150, type: "Boolean"},
	caption:{ignore:1},
        menu: {ignore: true},
        structure:{ignore: 1,  order:10},
        fullStructureStr: {hidden: true},
	eventList:{hidden:true},
	dataValue:{ignore:1},
	dataSet: { ignore:1},
	disabled:{ignore:1},
        menuItems:{ignore:1},
    editMenuItems: {group: "operation"},
    vertical: {group: "display"},
    openOnHover: {group: "display"}
});

wm.DojoMenu.description = "A dojo menu.";

wm.DojoMenu.extend({

    editMenuItems: "(Edit Menu Items)",

    themeableStyles: [{name: "wm.DojoMenu-Right_Margin", displayName: "Right Margin"},
		      {name: "wm.DojoMenu-Down_Image", displayName: "Drop Icon (MenuBar)"},
		      {name: "wm.DojoMenu-Right_Image", displayName: "Drop Icon (SubMenu)"}],
    afterPaletteDrop: function() {
	this.inherited(arguments);
	this.setFullStructureStr(studio.getDictionaryItem("wm.PopupMenu.DEFAULT_STRUCTURE"));
	this.renderDojoObj();
    },
	designCreate: function() {
		// if this is being created in studio, supply a default caption
		if (this._studioCreating)
			this.studioCreate();
		this.inherited(arguments);
	},
	makePropEdit: function(inName, inValue, inDefault) {
	    var prop = this.schema ? this.schema[inName] : null;
	    var name =  (prop && prop.shortname) ? prop.shortname : inName;
		switch (inName) {
		case "editMenuItems":
		    return makeReadonlyButtonEdit(name, inValue, inDefault);
		case "menu":
				return makeTextPropEdit(inName, inValue, inDefault);
		case "transparent":
		    return makeCheckPropEdit(inName, inValue, inDefault);
		}
		
		return this.inherited(arguments);
	},

	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
		case "editMenuItems":
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
		}
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
			props[this.getEventName(obj.label)] = {isEvent:true, isObject:false, noprop:false, type: 'string', isMenuItem:true};
		}, this);
	    }
		return props;
	},
    addNodesToPropList: function(struct, props) {
	for (var i = 0; i < struct.length; i++) {
	    if (!struct[i].children || struct[i].children.length == 0)
		props[this.getEventName(struct[i].label)] = {isEvent: true, isObject: false, noprop: false, type: "string", isMenuItem: true};
	    if (struct[i].children)// test for children needed on upgraded projects
		this.addNodesToPropList(struct[i].children,props);
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
	},
        getEventObjFull: function (struct,prop){
	    for (var i = 0; i < struct.length; i++) {
		if (this.getEventName(struct[i].label) == prop) return struct[i];
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
			if (prop == this.getEventName(this.eventList[i].label))
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
	this.renameComponentEventsMenu(this.fullStructure,originalId, newId);
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
    write: function() {
	if (this.fullStructure)
	    this.fullStructureStr = dojo.toJson(this.fullStructure);
	return this.inherited(arguments);
    }
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
    onMouseOut: {ignore: true}
});
