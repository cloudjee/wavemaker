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

dojo.provide("wm.base.widget.Layers_design");
dojo.require("wm.base.widget.Layers");

// design-time
wm.Object.extendSchema(wm.Layer, {
    closable: {group: "display", order: 250},
    destroyable: {group: "display", order: 251},
    showDirtyFlag: {group: "display", order: 252},
    themeStyleType: {group: "style", order: 150},
	title: { ignore: 1 },
	disabled: { ignore: 1 },
    moveNext: { group: "operation", order: 1, contextMenu: false },
	movePrevious: { group: "operation", order: 2, contextMenu: false },
	flex: {ignore: 1},
	sizeUnits: {ignore: 1},
	size: {ignore: 1},
    caption: { group: "display", order: 200, focus: true, bindTarget: true, doc: 1},
	inFlow: {ignore: 1},
	active: {ignore: 1},
    fitToContentWidth: { ignore: 1},
    fitToContentHeight: { ignore: 1},
    minWidth: { ignore: 1},
    minHeight: { ignore: 1},
    activate: {group: "method"},
    isActive: {group: "method", returns: "Boolean"},
    setCaption: {group: "method"},
    getIndex: {group: "method", returns: "Number"},
    parent: {ignore: 1, doc: 1, prototype: "wm.Layers"}
});

wm.Layer.extend({
    themeable: false,
        sizeable: false,
	moveNext: "(move to next)",
	movePrevious: "(move to previous)",
	designCreate: function() {
		this.inherited(arguments);
		if (this.designWrapper)
			this.designWrapper.setShowing(false);
	},
	domNodeShowingChanged: function(inShowing) {
		var dw = this.designWrapper;
		if (dw && inShowing != dw.showing)
			dw.setShowing(inShowing);
	},
	moveLayer: function(inDelta) {
		var l = this.parent, i = this.getIndex();
		l.moveLayerIndex(this, i + inDelta);
	},
	makePropEdit: function(inName, inValue, inDefault) {
	        var prop = this.schema ? this.schema[inName] : null;
	        var name =  (prop && prop.shortname) ? prop.shortname : inName;
		switch (inName) {
			case "moveNext":
				return makeReadonlyButtonEdit(name, inValue, inDefault, '&raquo;');
			case "movePrevious":
				return makeReadonlyButtonEdit(name, inValue, inDefault, '&laquo;');
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "moveNext":
				this.moveLayer(1);
				studio.refreshComponentOnTree(this.parent);
				studio.select(null);
				studio.select(this);
				break;
			case "movePrevious":
				this.moveLayer(-1);
				studio.refreshComponentOnTree(this.parent);
				studio.select(null);
				studio.select(this);
				break;
			default:
				this.inherited(arguments);
				return;
		}
	},

    createDesignContextMenu: function(menuObj) {
	var data = {label: "Move Layer",
		    iconClass: "Studio_silkIconImageList_30",
		    children: []};

	data.children.push({label: "Previous", 
			    iconClass: "Studio_silkIconImageList_30",
			    onClick: dojo.hitch(this, function() {
				this.editProp("movePrevious");
			    })
			   });
	data.children.push({label: "Next", 
			    iconClass: "Studio_silkIconImageList_30",
			    onClick: dojo.hitch(this, function() {
				this.editProp("moveNext");
			    })
			   });
		var submenu = menuObj.addAdvancedMenuChildren(menuObj.dojoObj, data);	
    },
	listProperties: function() {
	    var props = this.inherited(arguments);
	    props.closable.ignoretmp = (this.parent.layersType != 'Tabs');
	    props.destroyable.ignoretmp = (this.parent.layersType != 'Tabs');
	    props.showDirtyFlag.ignoretmp = (this.parent.layersType != 'Tabs');
	    return props;
	},
});

wm.Object.extendSchema(wm.Layers, {
    transition: {group: "display"},
	lock: {ignore: 1},
	freeze: {ignore: 1},
	box: {ignore: 1},
	boxPosition: { ignore: 1},
	layoutKind: { ignore: 1},
	horizontalAlign: { ignore: 1},
	verticalAlign: { ignore: 1},
	layerIndex: {ignore: 1},
	lastLayerIndex: {ignore: 1},
        defaultLayer: { group: "layout", order: 105, doc: 1},
	layersType: { group: "layout", order: 110 },
	add: { group: "operation", order: 1 },
	userDefHeaderHeight: {ignore:1},
	fitToContent: { ignore: 1},
        headerHeight: { group: "layout", order: 50},
    
    clientBorder: {group: "style", order: "100", doc: 1, shortname: "layerBorder"},
    clientBorderColor: {group: "style", order: "101", doc: 1, shortname: "layerBorderColor"},
    addLayer: {group: "method"},
    getLayer: {group: "method", returns: "wm.Layer"},
    removeLayer:{group: "method"},

    getActiveLayer: {group: "method", returns: "wm.Layer"},

    indexOfLayer:  {group: "method", returns: "Number"},
    indexOfLayerName:  {group: "method", returns: "Number"},
    indexOfLayerCaption:  {group: "method", returns: "Number"},

    setLayer: {group: "method"},
    setLayerIndex: {group: "method"},
    
    getCount: {group: "method", returns: "Number"},

    moveLayerIndex: {group: "method"},
    clear: {group: "method"},

    setClientBorder: {group: "method"},
    setClientBorderColor: {group: "method"},
    autoScroll: {ignore: 1}, // wm.Layer should have scrolling set, not the wm.Layers/TabLayers.  Accordion is an exception
    scrollX: {ignore: 1},
    scrollY: {ignore: 1},
    touchScrolling: {ignore: 1}
});

wm.Layers.extend({
    themeable: false,
	add: '(add layer)',
	_noCreate: true,
	set_defaultLayer: function(inLayerIndex) {
		this.setDefaultLayer(inLayerIndex);
		if (this.defaultLayer != -1)
			this.set_layerIndex(this.defaultLayer);
	},
        set_layersType: function(inLayersType) {
            this.layersType = inLayersType;
            var newClass;
            switch(inLayersType) {
            case "Tabs":
            case "RoundedTabs":
                newClass = "wm.TabLayers";
                break;
            case "Accordion":
                newClass = "wm.AccordionLayers";
                break;
            case "Layers":
                newClass = "wm.Layers";
                break;
            }
            var widgetsjs = this.write("");
            widgetsjs = dojo.fromJson(widgetsjs.replace(/^.*?\:/,""));
	    var name = this.name;	
            var parent = this.parent;
	    var owner = this.owner;
            var indexInParent = dojo.indexOf(this.parent.c$, this);
            this.destroy();
            var clone = parent.createComponent(name, newClass, widgetsjs[1], widgetsjs[2], widgetsjs[3], owner);
            parent.moveControl(clone, indexInParent);
            parent.reflow();
	    studio.refreshVisualTree();
	    studio.select(clone);

        },
	set_layerIndex: function(inLayerIndex) {
		this.setLayerIndex(inLayerIndex);
		if (this.isDesignLoaded())
			studio.select(this.getLayer());
	},
	set_layerInactive: function(inLayer) {
		this.setLayerInactive(inLayer);
		if (this.isDesignLoaded())
			studio.select(this);
	},
	getLayerInfo: function(inNameList, inIndexList) {
		dojo.forEach(this.layers, function(l) {
			inNameList.push(l.name);
			inIndexList.push(this.indexOfLayer(l));
		}, this);
	},
	makePropEdit: function(inName, inValue, inDefault) {
	        var prop = this.schema ? this.schema[inName] : null;
	        var name =  (prop && prop.shortname) ? prop.shortname : inName;
		switch (inName) {
		        case "transition":
		                return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: ["none", "fade", "slide"]});

			case "add":
				return makeReadonlyButtonEdit(name, inValue, inDefault);
			case "layersType":
				return makeSelectPropEdit(inName, inValue, ["Layers", "RoundedTabs", "Tabs", "Accordion"], inDefault);
			case "defaultLayer":
				var options = [""], values = [-1];
				this.getLayerInfo(options, values);
				return new wm.propEdit.Select({
				    component: this,
				    name: inName,
				    value: inValue,
				    values: values,
				    options: options});

			case "headerHeight":
				return new wm.propEdit.UnitValue({
					component: this,
					name: inName,
					value: inValue,
					options: this._sizeUnits
				});
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "add":
				this.addLayer();
				// FIXME: need to refresh tree and select layer
				studio.refreshVisualTree();
				studio.select(null);
				studio.select(this);
				break;
			default:
				this.inherited(arguments);
				return;
		}
	},
	listProperties: function() {
		var props = this.inherited(arguments);
		props.headerHeight.ignoretmp = (this.layersType != 'Tabs' && this.layersType != 'RoundedTabs');
		return props;
	},
	getOrderedWidgets: function() {
		return this.layers;
	},
    createDesignContextMenu: function(menuObj, optionalSubmenuArray) {
	if (this.layers.length) {
	    var data = {label: "Show Layer",
			iconClass: "Studio_silkIconImageList_95",
			children: []};

	    for (var i = 0; i < this.layers.length; i++) {
		if (!this.layers[i].isActive())
		    data.children.push(this.addLayerToContextMenu(i));
	    }
	    if (optionalSubmenuArray) {
		optionalSubmenuArray.push({label: "add",
					   iconClass: "Studio_silkIconImageList_30",
					   onClick: dojo.hitch(this, function() {
					       this.editProp("add");
					   })});
		dojo.forEach(data.children, function(i) {optionalSubmenuArray.push(i);});
	    } else
		var submenu = menuObj.addAdvancedMenuChildren(menuObj.dojoObj, data);
	}
    },
    addLayerToContextMenu: function(i) {
	return 	{label:   this.layers[i].name,
		 iconClass: "Studio_paletteImageList_0",
		 onClick: dojo.hitch(this, function() {
		     this.setLayerIndex(i);
		 })
		};
    }
});

wm.AccordionLayers.extend({
    themeable: true,
    themeableProps: ["border","borderColor","layerBorder","captionHeight"],
    themeableStyles: [{name: "wm.AccordionLayers-Open_Image", displayName: "Open Arrow Icon"},
		      {name: "wm.AccordionLayers-Closed_Image", displayName: "Closed Arrow Icon"}]
});
wm.Object.extendSchema(wm.AccordionLayers, {
    transition: {ignore: true},
    captionBorder: {ignore: 1},
    autoScroll: {group: "scrolling", order: 100, ignore: 0}, // Accordion should support vertical scrolling
    scrollY: {group: "scrolling", order: 102, ignore: 0},
    multiActive: {group: "display"},
    captionHeight: {group: "display"},
    multiActive: {group: "display"},
    layerBorder: {group: "style", order: 1},
    clientBorder: {ignore: 1}
});
wm.Object.extendSchema(wm.TabLayers, {
    conditionalTabButtons: {group: "layout"}
});
wm.Object.extendSchema(wm.TabLayers, {
    conditionalTabButtons: {group: "layout"}
});
wm.Object.extendSchema(wm.TabLayers, {
    conditionalTabButtons: {group: "layout"}
});
wm.Object.extendSchema(wm.TabLayers, {
    conditionalTabButtons: {group: "layout"}
});
wm.TabLayers.extend({
    themeable: true,
    themeableProps: ["border", "borderColor", "clientBorder", "clientBorderColor", "headerHeight"],
    themeableStyles: ["wm.TabLayers-Button_Height", "wm.TabLayers-Button_TextSize", {name: "wm.TabLayers-BorderStyle_Shadow", displayName: "Shadow (Default)"}, {name: "wm.TabLayers-Hover-BorderStyle_Shadow", displayName: "Shadow (Hover)"}, {name: "wm.TabLayers-Active-BorderStyle_Shadow", displayName: "Shadow (Active)"}]
});

wm.WizardLayers.extend({
    themeable: true,
    themeableProps: ["border", "borderColor", "clientBorder", "clientBorderColor"]
});



wm.Layers.description = "Show widgets on layers.";

wm.TabLayers.description = "Layers with tab navigation.";

wm.AccordionLayers.description = "Expandable layers.";
