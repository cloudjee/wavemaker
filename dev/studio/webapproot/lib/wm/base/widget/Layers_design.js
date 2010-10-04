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
dojo.provide("wm.base.widget.Layers_design");
dojo.require("wm.base.widget.Layers");

// design-time
wm.Object.extendSchema(wm.Layer, {
	title: { ignore: 1 },
	disabled: { ignore: 1 },
	moveNext: { group: "operation", order: 1 },
	movePrevious: { group: "operation", order: 2 },
	flex: {ignore: 1},
	sizeUnits: {ignore: 1},
	size: {ignore: 1},
        caption: { group: "display", order: 200, focus: true},
	inFlow: {ignore: 1},
	active: {ignore: 1},
    fitToContentWidth: { ignore: 1},
    fitToContentHeight: { ignore: 1},
    minWidth: { ignore: 1},
    minHeight: { ignore: 1}
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
		switch (inName) {
			case "moveNext":
				return makeReadonlyButtonEdit(inName, inValue, inDefault, '&raquo;');
			case "movePrevious":
				return makeReadonlyButtonEdit(inName, inValue, inDefault, '&laquo;');
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
	}
});

wm.Object.extendSchema(wm.Layers, {
	lock: {ignore: 1},
	freeze: {ignore: 1},
	box: {ignore: 1},
	boxPosition: { ignore: 1},
	layoutKind: { ignore: 1},
	horizontalAlign: { ignore: 1},
	verticalAlign: { ignore: 1},
	layerIndex: {ignore: 1},
	lastLayerIndex: {ignore: 1},
	defaultLayer: { group: "layout", order: 105 },
	layersType: { group: "layout", order: 110 },
	add: { group: "operation", order: 1 },
	fitToContent: { ignore: 1},
        headerHeight: { group: "layout", order: 50},
        clientBorder: {group: "style", order: "100"},
        clientBorderColor: {group: "style", order: "101"}
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
		switch (inName) {
		        case "transition":
		                return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: ["none", "fade", "slide"]});

			case "add":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
			case "layersType":
				return makeSelectPropEdit(inName, inValue, ["Layers", "RoundedTabs", "Tabs", "Accordion"], inDefault);
			case "defaultLayer":
				var options = [""], values = [-1];
				this.getLayerInfo(options, values);
				return makeSelectPropEdit(inName, inValue, options, inDefault, values);
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
				studio.refreshWidgetsTree();
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
		props.headerHeight.ignore = (this.layersType != 'Tabs' && this.layersType != 'RoundedTabs');
		return props;
	},
	getOrderedWidgets: function() {
		return this.layers;
	}
});

wm.AccordionLayers.extend({
    themeable: true,
    themeableProps: ["border","borderColor","layerBorder","captionHeight"],
    themeableStyles: [{name: "wm.AccordionLayers-Open_Image", displayName: "Open Arrow Icon"},
		      {name: "wm.AccordionLayers-Closed_Image", displayName: "Closed Arrow Icon"}]
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
