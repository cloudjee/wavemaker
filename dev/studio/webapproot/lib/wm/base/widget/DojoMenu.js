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
dojo.provide("wm.base.widget.DojoMenu");

/* We definitely want to move these out of the header, but currently this is our standard approach for handling dojo.requires statements; there is no handling of them in manifest.js */

dojo.declare("wm.DojoMenu", wm.Control, {
        _menuConnects: null,
	padding: 4,
	width:'100%',
	height:'35px',
	structure:'',
	fullStructure: null,
        fullStructureStr: "",// this varient of fullStructure can be written to widgets.js
	dojoObj:null,
	menu:'',
	vertical: false,
	openOnHover:false,
	eventList:[],
	menuItems: [],
	

	init: function() {
	    this._menuConnects = [];
/*
	    this.eventList = [];
	    this.menuItems = [];
*/
		dojo.require("dijit.Menu");
		dojo.require("dijit.MenuItem");
		dojo.require("dijit.PopupMenuItem");
		dojo.require("dijit.MenuBar");
		dojo.require("dijit.MenuBarItem");
		dojo.require("dijit.PopupMenuBarItem");
		dojo.require("dijit.MenuSeparator");
		dojo.require("dojox.html.styles");
		this.inherited(arguments);
		dojo.addClass(this.domNode, "dojoMenu");
	},
	postInit: function() {
		this.inherited(arguments);
		var thisObj = this;
		dojo.addOnLoad(function(){thisObj.renderDojoObj();});
	},
    setTransparent: function(inTrans) {
	this.transparent = inTrans;
	if (inTrans) {
	    this.addUserClass("TransparentDojoMenu");
	    this.removeUserClass("ClickableDojoMenu");
	} else {
	    this.addUserClass("ClickableDojoMenu");
	    this.removeUserClass("TransparentDojoMenu");
	}
    },
    getTransparent: function() {
	if (this._classes && this._classes.domNode)
	    return dojo.indexOf(this._classes.domNode, "ClickableDojoMenu") == -1;
	return true;
    },
    renderBounds: function() {
	this.inherited(arguments);
	if (this.dojoObj && this.dojoObj.domNode) {
	    var bounds = this.getContentBounds();
	    this.dojoObj.domNode.style.width = bounds.w + "px";
	}
    },
    createMenuBar: function() {


		if (this.vertical)
			this.dojoObj = new dijit.Menu({style:'width:0%', openOnHover:this.openOnHover});
		else
			this.dojoObj = new dijit.MenuBar({openOnHover:this.openOnHover});
	dojo.addClass(this.dojoObj.domNode, this.getRuntimeId().replace(/\./g,"_") + '_CSS');
		if (this.openOnHover && !this.vertical){
		  this.hoverConnect = dojo.connect(this.dojoObj, 'onItemHover', this, '_onItemHover');	
		}
		
	return this.dojoObj;
    },
    destroy: function() {
	dojo.forEach(this._menuConnects, function(c) {dojo.disconnect(c);});
	delete this._menuConnects;
	this.inherited(arguments);
    },
	renderDojoObj: function() {
	  /* WHAT IS THIS FOR PANKAJ?
		if (this._loading)
		{
			return;
		}
	  */
		if (this.dojoObj) {
		    try {
			this.dojoObj.destroyRecursive();
		    } catch(e) {}
		    dojo.forEach(this._menuConnects, function(c) {dojo.disconnect(c);})
		    if (this.hoverConnect)
			dojo.disconnect(this.hoverConnect);
	  }
		
		this.menuItems = [];
	        
	    this.dojoObj = this.createMenuBar();

	    dojo.addClass(this.dojoObj.domNode, this.getRuntimeId().replace(/\./g,"_") + '_CSS');

	        if (!this.isPopupMenu)
		    this.dojoObj.placeAt(this.domNode);

	        if (this.fullStructureStr) 
		    this.setFullStructureStr(this.fullStructureStr, 0);

	    // This block will upgrade menus built using the freetext "menu" property to use
	    // the new format
	        if (!this.fullStructure) {
		    var structure = this.getStructure();
		    this.fullStructure = structure.items;
		}
		if (this.fullStructure) {
			var structure = dojo.clone(this.fullStructure); // don't operate on original as we delete stuff that dojo shouldn't see from the datastructure
			for (var i = 0; i < structure.length; i++)
			{
				var menuData = structure[i];
				this.addAdvancedMenuChildren(this.dojoObj, menuData, true);
			}
		} else {
		    // this block should no longer be reachable.
			var structure = this.getStructure();
			for (var i = 0; i < structure.items.length; i++)
			{
				var menuData = structure.items[i];
				var menuItem = this.addMenuChildren(this.dojoObj, menuData, true);
				this.menuItems[this.menuItems.length] = menuItem;
			}
		}
		
		this.dojoRenderer();
	},
	_onItemHover: function(item){
		console.info('_onItemHover called .......');
		this.dojoObj.focusChild(item);
	},
	addMenuChildren: function(parentObj, data, isTop){
		var menuObj = null;
		if (isTop && !this.isPopupMenu)
		{
			if (this.vertical)
				menuObj = new dijit.MenuItem({label: data.label});
			else
				menuObj = new dijit.PopupMenuBarItem({label: data.label});
		}
		else if (dojo.trim(data.label) == 'separator')
		{
			menuObj = new dijit.MenuSeparator();
		}
		else if (!data.children)
		{
		    menuObj = new dijit.MenuItem({label: data.label, iconClass: data.iconClass});
		}
		else
		{
		    menuObj = new dijit.PopupMenuItem({label: data.label, iconClass: data.iconClass});
		}

		var evtObj = this.getEventObj(this.getEventName(data.label));
		
		if (!this.isDesignLoaded() && evtObj && evtObj.onClick && evtObj.onClick != '')
		{
		    if (dojo.isFunction(evtObj.onClick)) {
			menuObj.onClick = evtObj.onClick;
		    } else {
			var f = this.owner.getValueById(evtObj.onClick) || this.owner[evtObj.onClick];
			menuObj.onClick = this.owner.makeEvent(f, evtObj.onClick, this, "onClick");
		    }
		}
		
		if (data.children && data.children.length > 0)
		{
	                var subMenu = new dijit.Menu({});
			dojo.addClass(subMenu.domNode, this.owner.name + "_" + this.name  + "_PopupMenu");

			for (var i = 0; i < data.children.length; i++)
			{
				var subMenuData = data.children[i];
				var menuItem = this.addMenuChildren(subMenu, subMenuData, false);	
				this.menuItems[this.menuItems.length] = menuItem;
			}
			
			// Dojo upgrade TODO: menu items that have sub-menu does not show arrow (>) when creating dojo menu programmtically.
			// Fixed it using this hack but should be removed when this bug is resolved in dojo's newer version.
			if (menuObj.arrowWrapper)
				menuObj.arrowWrapper.style.visibility = '';
			
			menuObj.popup = subMenu;
		}
	    
	        parentObj.addChild(menuObj);
	        dojo.addClass(menuObj.domNode, this.getRuntimeId().replace(/\./g,"_")+ '_CSS');
		return menuObj;
	},

	/*
	* data can take any parameter that dijit.MenuItem can take; additional parameters and notes:
	* onClick: is supported, but is assumed to be executing a method on the current page object
	* idInPage: added parameter that specifies the name/property to set in the page object to directly refer to this menu item. 
	*           Useful for enable/disable of individual menu items
	* separator: Sets a MenuSeparator instead of a MenuItem
	* children: array of submenu data objects
	*
	* Check the docs on dijit.MenuItem for params they support; here are a few...
	* label: caption for your menu item
	* iconClass: a class to be set for the icon which allows you to specify in CSS what image to place next to the menu.
	* accelKey: Shortcut key for executing the menu
	* disabled: if true, disables your menu item
	*
	* Note that you can use this at runtime from your page code to add menus.
	*/
	addAdvancedMenuChildren: function(parentObj, data, isTop){

		var menuObj = null;

		var onClick = data.onClick;
		delete data.onClick;

		var idInPage = data.idInPage;;
		delete data.idInPage;

		if (isTop && !this._neverIsTop)
		{
		    menuObj = new dijit.PopupMenuBarItem({label: data.label, data: data});
		}
		else if (data.separator === true)
		{
			menuObj = new dijit.MenuSeparator();
		}
		else 
		{
		        menuObj = new dijit.MenuItem(data);
		}

		if (!this.isDesignLoaded() && this.eventList[data.label] && this.eventList[data.label] != '') 
		        menuObj.onClick = dojo.hitch(this.eventList[data.label]);

	    if (onClick) {
		if (dojo.isString(onClick)) {
		    var f = this.owner.getValueById(onClick);// || this.owner[evtObj.onClick];
		    menuObj.onClick = this.owner.makeEvent(f, onClick, this, "onClick");
		} else {
		    menuObj.onClick = dojo.hitch(this.owner, onClick, menuObj, data);
		}
		this._menuConnects.push(dojo.connect(menuObj, "onClick", this, function(e) {
		    this.onclick(menuObj.label, menuObj.iconClass, e);
		}));
	    } else {
		menuObj.onClick = dojo.hitch(this, function(e) {
		    this.onclick(menuObj.label, menuObj.iconClass, e);
		});
	    }

		if (idInPage) {
		  this.owner[idInPage] = menuObj;
		}

		if (data.children && data.children.length > 0) 
		{
		  var subMenu = new dijit.Menu({});
		  dojo.addClass(subMenu.domNode, this.owner.name + "_" + this.name  + "_PopupMenu");
		  dojo.addClass(subMenu.domNode, this.owner.name + "_" + idInPage  + "_PopupMenu");
		  for (var i = 0; i < data.children.length; i++)
		    {
		    var subMenuData = data.children[i];
		    this.addAdvancedMenuChildren(subMenu, subMenuData, false);	
		    }
		  
		  menuObj.popup = subMenu;
		    // shouldn't be needed, but is needed when I right click 
		    // on a layer and get the contextual menu with a submenu 
		    // of layers
		    var arrowNode = dojo.query(".dijitMenuArrowCell div", menuObj.domNode)[0];
		    if (arrowNode) arrowNode.style.visibility = "visible";
		}
	    if (parentObj.addChild)
		parentObj.addChild(menuObj);
	    return menuObj;
	},
    // fires every time any menu item is selected
        onclick: function(inLabel, inIconClass, inEvent) {
	    //alert(inLabel);
	},
	addNewMenuItem: function(parentObj, data) {
	    if (!parentObj.popup) {
		var subMenu = new dijit.Menu({});
		dojo.addClass(subMenu.domNode, this.owner.name + "_" + this.name  + "_PopupMenu");
		if (data.idInPage)
		    dojo.addClass(subMenu.domNode, this.owner.name + "_" + data.idInPage  + "_PopupMenu");
		parentObj.popup = subMenu;
	    }

	    //var subMenu = parentObj.popup;
	  this.addAdvancedMenuChildren(parentObj.popup, data, false);
	},
	dojoRenderer: function (){
	},
    setFullStructureStr: function(inStruct, setByDesigner) {
	    this.fullStructureStr = inStruct;
	    this.setFullStructure(dojo.fromJson(inStruct));	    
	if (setByDesigner)
	    this.renderDojoObj();
	},
	setFullStructure: function(inStruct) {
	    this.fullStructure = inStruct;
	    this.eventList = [];
	},
	getStructure: function(){
	  return this.structure == '' ? {items:[]} : dojo.fromJson(this.structure); 
	},

	setStructure: function(strStructure){
	        if (this.fullStructure) return;
		if (strStructure == '')
		{
			return;
		}
		
		var tempAllItems = [];
		var allMenuItems = [];
		var items = [];
		var sArray = strStructure.split('\n');
		for (var i = 0; i < sArray.length; i++)
		{
			if (dojo.trim(sArray[i]) == '')
				continue;
			var nArr = sArray[i].split('>');
			var obj = {label: dojo.trim(nArr[0])};
			var parent = this.findInItems(allMenuItems, obj.label);
			if (parent == null)
			{
				tempAllItems[tempAllItems.length] = obj;
			}
			
			this.addToEventList(obj);
			var children = [];
			if (nArr.length > 1)
			{
				var itemArray = nArr[1].split(',');
				for (var j = 0; j < itemArray.length; j++)
				{
					var itemObj = {label: dojo.trim(itemArray[j])};
					this.addToEventList(dojo.clone(itemObj));
					children[children.length] = itemObj;
					allMenuItems[allMenuItems.length] = itemObj;
					tempAllItems[tempAllItems.length] = dojo.clone(itemObj);
				}

				obj.children = children;
			}
			
			if (parent != null)
			{
				parent.children = children;
			}
			else
			{
				items[items.length] = obj;
			}
		}

		this.removeOldEvents(tempAllItems);
		this.structure = dojo.toJson({items:items});
	},
	findInItems: function (allMenuItems, label){
		for (var i = allMenuItems.length -1 ; i >= 0; i--)
		{
			if (allMenuItems[i].label == label)
			{
				return allMenuItems[i];
			}
		}

		return null;
	},
	addToEventList: function (obj){
		for (var i = 0; i < this.eventList.length; i++)
		{
			if (this.eventList[i].label == obj.label)
				return;
		}
		
		this.eventList[this.eventList.length] = obj;
	},
	removeOldEvents: function(newList){
		var updatedEventList = [];
		for (var i = 0; i < this.eventList.length; i++)
		{
			var eventObj = this.eventList[i];
			var exists = false;
			for (var j = 0; j < newList.length; j++)
			{
				if (eventObj.label == newList[j].label)
					updatedEventList[updatedEventList.length] = eventObj;
			}
		}
		
		this.eventList = updatedEventList;
	},
	/**
	 * menuType can be one of the following:
	 * 	MenuBar
	 * 	MenuItem
	 * 	MenuHover
	 * 	MenuPassiveHover
	 * 
	 * style is the css style that you want to add/change.
	 * 
	 * Example: I want to change the background color of MenuBar to #787878 (shade of gray)
	 * Solution: overrideCSS('MenuBar', 'background-color:#787878; padding:10px;'); 
	 * 
	 */
	overrideCSS:function(menuType, style){
		dojox.html.insertCssRule(this.getCSSMenuTypeClass(menuType) + this.id + '_CSS', style);	
	},
	getCSSMenuTypeClass: function(menuType){
		switch(menuType)
		{
			case 'MenuBar': return '.tundra .dijitMenuBar.';
			case 'MenuItem': return '.tundra .dijitMenuItem.';
			case 'MenuHover': return '.tundra .dijitMenuItemHover.';
			case 'MenuPassiveHover': return '.tundra .dijitMenuPassive .dijitMenuItemHover.';
		}
	}
});

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
        editMenuItems: {group: "operation"}
});

wm.DojoMenu.description = "A dojo menu.";

wm.DojoMenu.extend({

    editMenuItems: "(Edit Menu Items)",

    themeableStyles: [{name: "wm.DojoMenu-Right_Margin", displayName: "Right Margin"}, {name: "wm.DojoMenu-Down_Image", displayName: "Drop Icon (MenuBar)"}, {name: "wm.DojoMenu-Right_Image", displayName: "Drop Icon (SubMenu)"}],
	designCreate: function() {
		// if this is being created in studio, supply a default caption
		if (this._studioCreating)
			this.studioCreate();
		this.inherited(arguments);
	},
	afterPaletteDrop: function() {
		this.caption = this.caption || this.name;
		this.renderDojoObj();
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
		case "editMenuItems":
		    return makeReadonlyButtonEdit(inName, inValue, inDefault);
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
			studio.menuDesignerDialog = new wm.PageDialog({pageName: "MenuDesigner", 
								       name: "MenuDesignerDialog",
								       title: "Edit Menu",
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
	setMenu: function(inValue){
		this.menu = inValue;
		this.setStructure(inValue);
		this.renderDojoObj();
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
	this.renameComponentEventsMenu(this.eventList,originalId, newId);
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

dojo.declare("wm.PopupMenu", wm.DojoMenu, { 
    classNames: "wmpopupmenu",
    _neverIsTop:true,
    width: "0px",
    height: "0px",
    isPopupMenu: true,
    createMenuBar: function() {
	return new dijit.Menu({style:'width:0%'});
    },

    // Disable all framework rendering
    renderBounds: function() {},
    render: function() {},
    renderCss: function() {},
    renderDojoObj: function() {
	this.inherited(arguments);
	if (this.domNode != this.dojoObj.domNode) {
	    this.dojoObj.className += this.domNode.className;
	    dojo.destroy(this.domNode);
	    this.domNode = this.dojoObj.domNode;
	    dojo.addClass(this.domNode, this.classNames);
	}
    },
    // fired by studio.select
    activate: function(inNode) {
	if (this.isDesignLoaded()) {
	    this.dojoObj._scheduleOpen(studio.designer.domNode);
	} else if (inNode) {
	    this.setShowing(true, inNode);
	}
    },
    update: function(inEvt, inTarget, belowTarget) {
	this.target = inTarget;
	if (belowTarget || !inEvt) {
	    var coords = dojo.coords(inTarget.domNode);
	    var bounds = inTarget.getContentBounds();
	    var y = coords.y + bounds.h;
	    var x = coords.x;
	    this.dojoObj.domNode.style.width = (bounds.w + inTarget.borderExtents.l + inTarget.borderExtents.r) + "px";
	    this.dojoObj.domNode.style.borderTop = "solid 1px " + inTarget.borderColor;
	    this.dojoObj._scheduleOpen(inTarget.domNode, null, {x: x,y: y});
	} else {
	    this.dojoObj._scheduleOpen(inEvt.target, null, {x: inEvt.pageX, y: inEvt.pageY});
	}
    },
    setShowing: function(inShowing, inNode) {
	if (inShowing) 
	    this.dojoObj._scheduleOpen(inNode);
    },
    afterPaletteDrop: function() {
	this.inherited(arguments);
	this.setParent(null);
	studio.designer.domNode.appendChild(this.domNode);
	this.setMenu("File > New, Open, Save, Close\nEdit > Cut, Copy, Paste\nZoom > 25%, 50%, 100%, 150%\nHelp");
	this.activate();
    },
    setLabel: function(inIndex, inText) {
	this.dojoObj.getChildren()[inIndex].set("label", inText);
    },
    removeAllChildren: function() {
	var children = this.dojoObj.getChildren();
	for (var i = children.length-1; i >= 0; i--)
	    children[i].destroy();
    },
    _end: 0
});

wm.Object.extendSchema(wm.PopupMenu, {
    vertical: {ignore:true},
    isPopupMenu: {ignore:true},
    transparent: {ignore:true},
    width: {ignore:true},
    height: {ignore:true},
    showing: {ignore:true},
    border: {ignore:true},
    borderColor: {ignore:true},
    margin: {ignore:true},
    padding: {ignore:true},
    scrollX: {ignore:true},
    scrollY: {ignore:true}
});
