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


dojo.provide("wm.base.widget.DojoFisheye_design");
dojo.require("wm.base.widget.DojoFisheye");
dojo.require("wm.base.Control_design");

wm.DojoFisheye.description = "A dojo Fisheye.";

wm.DojoFisheye.extend({
    themeable: false,
	setImageUrlField: function(inValue){
		this.imageUrlField = inValue;
		this.renderDojoObj();
	},
	setImageLabelField: function(inValue){
		this.imageLabelField = inValue;
		this.renderDojoObj();
	},
	setItemMaxWidth: function(inValue){
		this.itemMaxWidth = inValue;
		this.renderDojoObj();
	},
	setItemMaxHeight: function(inValue){
		this.itemMaxHeight = inValue;
		this.renderDojoObj();
	},
	setItemHeight: function(inValue){
		this.itemHeight = inValue;
		this.renderDojoObj();
	},
	setItemWidth: function(inValue){
		this.itemWidth = inValue;
		this.renderDojoObj();
	}
});

// design only...
wm.Object.extendSchema(wm.DojoFisheye, {
	variable: {ignore: 1},
	connectEvents:{ignore:1},
	variableConnectEvents:{ignore:1},
    dataSet: {bindTarget: 1, group: "widgetName", subgroup: "data", order: 10, isList: true, createWire: 1, editor: "wm.prop.DataSetSelect", editorProps: {listMatch: true, widgetDataSets: true, allowAllTypes: true}},
	imageUrlField:{group: "widgetName", subgroup: "fields", order: 20, editor:"wm.prop.FieldSelect", editorProps: {}},
	imageLabelField:{group: "widgetName", subgroup: "fields", order: 30, editor:"wm.prop.FieldSelect", editorProps: {}},
	itemWidth:{group: "widgetName", subgroup: "layout", order: 40},
	itemHeight:{group: "widgetName", subgroup: "layout", order: 50},
	itemMaxWidth:{group: "widgetName", subgroup: "layout", order: 60},
	itemMaxHeight:{group: "widgetName", subgroup: "layout", order: 70},
    selectedItem: { ignore: true, isObject: true, bindSource: true, simpleBindProp: true },
    hint: {ignore:1},
    disabled: {ignore:1},
    
});

