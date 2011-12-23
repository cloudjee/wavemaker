/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
dojo.require("wm.base.widget.Container_design");

// design-time
wm.Object.extendSchema(wm.Layer, {
    /* Display group; text subgroup */
    caption: { group: "display", subgroup: "text", order: 200, bindTarget: true},

    /* Display group; visual subgroup */
    closable:      {group: "display", subgroup: "visual", order: 250, advanced:1},
    destroyable:   {group: "display", subgroup: "visual", order: 251, advanced:1},
    showDirtyFlag: {group: "display", subgroup: "visual", order: 252, advanced:1},

    /* Style group */
    themeStyleType: {ignore: 0},

    /* Operations group */
    moveNext: { group: "operation", order: 1, contextMenu: false, operation: 1 },
    movePrevious: { group: "operation", order: 2, contextMenu: false, operation: 1 },

    /* Events/custom methods group */
    onCloseOrDestroy:     {advanced:1},
    customCloseOrDestroy: {advanced:1},

    /* Ignored group */
    title: { ignore: 1 },
    disabled: { ignore: 1 },
    flex: {ignore: 1},
    sizeUnits: {ignore: 1},
    size: {ignore: 1},
    inFlow: {ignore: 1},
    active: {ignore: 1},
    fitToContentWidth: { ignore: 1},
    fitToContentHeight: { ignore: 1},
    minWidth: { ignore: 1},
    minHeight: { ignore: 1},
    parent: {ignore: 1, prototype: "wm.Layers"},
    resizeToFit: {ignore:1},

    /* Methods group */
    activate: {method:1},
    isActive: {method:1, returns: "Boolean"},
    setCaption: {method:1},
    getIndex: {method:1, returns: "Number"}


});

wm.Layer.extend({
    themeable: false,
        sizeable: false,
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
        moveNext: function() {
	    this.moveLayer(1);
	    studio.refreshComponentOnTree(this.parent);
	    studio.select(null);
	    studio.select(this);
	},
        movePrevious: function() {
	    this.moveLayer(-1);
	    studio.refreshComponentOnTree(this.parent);
	    studio.select(null);
	    studio.select(this);
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
	    props.caption.requiredGroup = (this.parent.layersType == 'Tabs');
	    return props;
	}
});

wm.Object.extendSchema(wm.Layers, {
    /* Display group; visual subgroup */
    transition: {group: "display", subgroup: "visual", options: ["none","fade","slide"]},

    /* Display group; misc subgroup */
    defaultLayer: { group: "display", subgroup: "misc", order: 105, doc: 1},
    layersType:   { group: "display", subgroup: "misc", order: 110, options:["Layers", "RoundedTabs", "Tabs", "Accordion"] },

    /* Display group; layout subgroup */
    headerHeight: {ignore:1, group: "display", subgroup: "layout", order: 50, editor: "wm.prop.SizeEditor", editorProps: {pxOnly: 1}},
    headerWidth: {ignore:1,  group: "display", subgroup: "layout", order: 50, editor: "wm.prop.SizeEditor", editorProps: {pxOnly: 1}},


    /* Operations group */
	add: { group: "operation", order: 1, operation: 1 },

    /* Styles group */
    clientBorder: {group: "style", order: 1, shortname: "layerBorder"},
    clientBorderColor: {group: "style", order: 2, shortname: "layerBorderColor", editor: "wm.ColorPicker"},

    /* Events/custom methods group */
    oncanchange: {advanced:1, order: 100},
    onchange: {order: 50},
    onCloseOrDestroy:     {advanced:1, order: 150},
    customCloseOrDestroy: {advanced:1},

    /* Ignored group */
	lock: {ignore: 1},
	freeze: {ignore: 1},
	box: {ignore: 1},
	boxPosition: { ignore: 1},
	layoutKind: { ignore: 1},
	horizontalAlign: { ignore: 1},
	verticalAlign: { ignore: 1},
	layerIndex: {ignore: 1},
	lastLayerIndex: {ignore: 1},
	userDefHeaderHeight: {ignore:1},
	fitToContent: { ignore: 1},
        autoScroll: {ignore: 1}, // wm.Layer should have scrolling set, not the wm.Layers/TabLayers.  Accordion is an exception
    scrollX: {ignore: 1},
    scrollY: {ignore: 1},
    touchScrolling: {ignore: 1},
    resizeToFit: {ignore:1},

/* Methods group */
    addLayer: {method:1},
    getLayer: {method:1, returns: "wm.Layer"},
    removeLayer:{method:1},
    getLayerByCaption: {method:1, returns: "wm.Layer"},
    getActiveLayer: {method:1, returns: "wm.Layer"},
    indexOfLayer:  {method:1, returns: "Number"},
    indexOfLayerName:  {method:1, returns: "Number"},
    indexOfLayerCaption:  {method:1, returns: "Number"},
    setLayer: {method:1},
    setLayerIndex: {method:1},
    getCount: {method:1, returns: "Number"},
    moveLayerIndex: {method:1},
    clear: {method:1},
    setClientBorder: {method:1},
    setClientBorderColor: {method:1}
});

wm.Layers.extend({
    themeable: false,
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
	makePropEdit: function(inName, inValue, inEditorProps) {
	    switch (inName) {
	    case "defaultLayer":
		var options = [""], values = [-1];
		this.getLayerInfo(options, values);
		return new wm.prop.SelectMenu(dojo.mixin(inEditorProps, {options: options, values: values}));
	    }
	    return this.inherited(arguments);
	},
    add: function() {
				this.addLayer();
				// FIXME: need to refresh tree and select layer
				studio.refreshVisualTree();
				studio.select(null);
				studio.select(this);
	},
	listProperties: function() {
		var props = this.inherited(arguments);
		props.headerHeight.ignoretmp = (this.layersType != 'Tabs' && this.layersType != 'RoundedTabs' && this.layersType != "Wizard" || this.verticalButtons);
		props.headerWidth.ignoretmp = (this.layersType != 'Tabs' && this.layersType != 'RoundedTabs'  && this.layersType != "Wizard" || !this.verticalButtons);
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
    /* Display group; scrolling subgroup */
    autoScroll: {ignore: 0}, // Accordion should support vertical scrolling
    scrollY: {ignore: 0},

    /* Display group; visual subgroup */
    multiActive: {group: "display", subgroup: "visual"},

    /* Display group; layout subgroup */
    captionHeight: {group: "display", subgroup: "layout"},

    /* Styles group */
    layerBorder: {group: "style", order: 1},

    /* Ignored group */
    transition: {ignore: true},
    captionBorder: {ignore: 1},
    clientBorder: {ignore: 1}
});
wm.Object.extendSchema(wm.TabLayers, {
    conditionalTabButtons: {group: "display", subgroup: "visual"},
    verticalButtons: {group: "display", subgroup: "layout"},
    layoutKind: { writeonly: 1},
    headerHeight: {ignore: 0},
    headerWidth: {ignore: 0}
});

wm.Object.extendSchema(wm.WizardLayers, {
    layoutKind: { writeonly: 1},
    headerHeight: {ignore: 0},
    headerWidth: {ignore: 0},
    verticalButtons: {group: "display", subgroup: "layout"},
    bottomButtons: {group: "subwidgets", subgroup: "buttons"}
});


wm.TabLayers.extend({
    themeable: true,
    themeableProps: ["border", "borderColor", "clientBorder", "clientBorderColor", "headerHeight"],
    themeableStyles: [{name: "wm.TabLayers-Button_Height", displayName: "Tab Button Height"}, {name: "wm.TabLayers-Button_TextSize", displayName: "Tab Font Size"}, {name: "wm.TabLayers-BorderStyle_Shadow", displayName: "Shadow (Default)"}, {name: "wm.TabLayers-Hover-BorderStyle_Shadow", displayName: "Shadow (Hover)"}, {name: "wm.TabLayers-Active-BorderStyle_Shadow", displayName: "Shadow (Active)"}],
    set_verticalButtons: function(inValue) {
	this.verticalButtons = Boolean(inValue);
	if (inValue) {
	    this.setLayoutKind("left-to-right");
	} else {
	    this.setLayoutKind("top-to-bottom");
	}
	this.decorator.decorateContainer();
	this.reflow();
	this.decorator.decorateLayers();
    },
    set_headerWidth: function(inWidth) {
	this.headerWidth = inWidth;
	this.c$[0].setWidth(inWidth);
    }
});

wm.WizardLayers.extend({
    themeable: true,
    themeableProps: ["border", "borderColor", "clientBorder", "clientBorderColor"],
    set_bottomButtons: function(inValue) {
	this.bottomButtons = inValue;
	this.generateBottomButtonEvents();

	this.decorator.addFooter();
	this.reflow();
	studio.reinspect(true)
    },
    set_verticalButtons: function(inValue) {
	this.verticalButtons = Boolean(inValue);
	if (inValue) {
	    this.setLayoutKind("left-to-right");
	} else {
	    this.setLayoutKind("top-to-bottom");
	}
	this.decorator.decorateContainer();
	this.reflow();
	this.decorator.decorateLayers();
    },
    set_headerWidth: function(inWidth) {
	this.headerWidth = inWidth;
	this.c$[0].setWidth(inWidth);
    },
    listProperties: function() {
	var p = this.inherited(arguments);
	var bottomButtons = this.bottomButtons ? this.bottomButtons.split(/\s*,\s*/) : [];
	for (var i = 0; i < bottomButtons.length; i++) {
	    p["onBottomButton" + i] = {isEvent:true};
	}
	return p;
    }
});



wm.Layers.description = "Show widgets on layers.";

wm.TabLayers.description = "Layers with tab navigation.";

wm.AccordionLayers.description = "Expandable layers.";
