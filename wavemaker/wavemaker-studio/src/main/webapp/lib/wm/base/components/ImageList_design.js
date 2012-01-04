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

dojo.provide("wm.base.components.ImageList_design");
dojo.require("wm.base.components.ImageList");


wm.Object.extendSchema(wm.ImageList, {
    url: { group: "widgetName", subgroup: "graphics", bindable: 1, type: "String", subtype: "File", order: 10, focus: 1, extensionMatch: ["jpg","jpeg","gif","png","tiff"]  },
    iconCount: {group: "widgetName", subgroup: "graphics", type: "number", order: 20},
    colCount: {group: "widgetName", subgroup: "graphics", type: "number", order: 30},

    width: {group: "widgetName", subgroup: "layout", type: "number", order: 20},
    height: {group: "widgetName", subgroup: "layout", type: "number", order: 21}
    
});

wm.ImageList.extend({
    set_width: function(inWidth) {
	this.width = inWidth;
	if (this._designPopupDialog)
	    this._designPopupDialog.setWidth((this.width + 35) + "px");
	this.createStyleSheet();
    },
    set_height: function(inHeight) {
	this.height = inHeight;
	this.createStyleSheet();
    },
    setUrl: function(inUrl) {
	this.url = inUrl;
	this.createStyleSheet();
    },
    getPopupDialog: function() {
	var d = this._designPopupDialog;
	if (!d) {
	    d = this._designPopupDialog = new wm.Dialog({owner: studio,
							     name: this.getRuntimeId() + "_designPopupDialog",
							 width: (this.width + 35) + "px",
							     height: "400px",
							     useContainerWidget: true,
							     modal: false,
							 noMinify: true,
							 noMaxify: true,
							     title: "-"});
	    d.containerWidget.setPadding("0");
	    dojo.addClass(d.domNode, "Studio-imageListPopupDialog");
	    var l = this._designList = new wm.List({owner: studio,
						    name: this.getRuntimeId() + "_designList",
						    parent: d.containerWidget,
						    headerVisible: false,
						    width: "100%",
						    height: "100%"});
	    var v = this._designVariable = new wm.Variable({owner: studio,
							    name: this.getRuntimeId() + "_designVariable",
							    type: "StringData"});
	    l.connect(l, "onselect", d, "dismiss");
	} else {
	    var l = this._designList;
	    var v = this._designVariable;
	}
	var data = [];
	for (var i = 0; i < this.iconCount; i++)
	    data.push({dataValue: this.getImageHtml(i)});
	v.setData(data);
	l.setDataSet(v);
	return this._designPopupDialog;

    },
    set_owner: function(inOwner) {
	this.inherited(arguments);
	if (this.domNode)
	    dojo.destroy(this.domNode);
	this.createStyleSheet();
    }
});