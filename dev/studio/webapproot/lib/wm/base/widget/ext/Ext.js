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
dojo.provide("wm.base.widget.ext.Ext");
dojo.require("wm.base.Widget");

// Load ext modularly. (note, this assumes ext in the lib folder)
wm.headAppend(wm.createElement("link", { rel: "stylesheet", href: dojo.moduleUrl("") + '../ext/resources/css/ext-all.css' }));
dojo.registerModulePath("ext", wm.libPath + "ext");
dojo.require("ext.adapter.ext.ext-base", true);
dojo.require("ext.ext-all", true);



dojo.declare("wm.Ext", wm.Box, {
	extClass: null,
	extProps: {},
	box: "v",
	setParent: function(inParent) {
		this.inherited(arguments);
		this.initExt();
	},
	initExt: function() {
		if (this.extClass)
			this.ext = this.ext || new this.extClass(this.extProps);
		if (this.ext) {
			if (this.ext.render)
				this.ext.render(this.domNode);
			else if (this.ext.show)
				this.ext.show(this.domNode);
			this.ext.el.dom.flex = "1";
			dojo.connect(this.ext.el.dom, "onboundschange", this, "syncExt", true);
		}
	},
	syncExt: function() {
		this.ext.syncSize();
		//console.log("syncExt");
	}
});

dojo.declare("wm.ext.Panel", wm.Ext, {
	extClass: Ext.Panel,
	extProps: { title: "Panel" }
});

dojo.declare("wm.ext.Button", wm.Ext, {
	extClass: Ext.Button,
	initExt: function() {
		this.ext = new this.extClass(this.domNode, this.extProps);
	}
});

dojo.declare("wm.ext.FormPanel", wm.Ext, {
	extClass: Ext.form.FormPanel
});

dojo.declare("wm.ext.Field", wm.Ext, {
	extClass: Ext.form.TextField,
	extProps: { fieldLabel: "Field", value: "300" }/*,
	initExt: function() {
		if (this.ext.render) 
			this.ext.render(this.domNode);
		else if (this.ext.show)
			this.ext.show(this.domNode);
	}
	*/
});

dojo.declare("wm.ext.Editor", wm.Ext, {
	extClass: Ext.Editor,
	extProps: { fieldLabel: "Field", value: "300" },
	initExt: function() {
		//this.field = 
		this.ext = new Ext.form.TriggerField({ fieldLabel: "field", value: "300" });
		//this.ext = new this.extClass(this.field, { fieldLabel: "Field" });
		if (this.ext.render)
			this.ext.render(this.domNode);
		else if (this.ext.show)
			this.ext.show(this.domNode);
	}
	/*,
	init: function() {
		this.ext = new this.extClass(this.extProps);
		this.domNode = this.ext.getEl().dom;
		this.setParent(this.parent);
		this.setDomNode(this.domNode);
	}*/
});

dojo.declare("wm.ext.Panel", wm.Ext, {
	extClass: Ext.Panel,
	extProps: { title: "Panel", collapsible : true, border: true }
});

dojo.declare("wm.ext.Tree", wm.Ext, {
	extClass: Ext.tree.TreePanel,
	extProps: {autoShow: true, autoScroll: true, enableDD:true, containerScroll: true },
	initExt: function() {
		if (this.extClass){
			this.ext = new this.extClass(this.extProps);
		}
	},
	render: function() {
		this.ext.render(this.domNode);
		var d = this.ext.getEl().dom;
		d.style.height = d.parentNode.style.height;
	}
});

/*
dojo.declare("wm.ext.ColorPalette", wm.Ext, {
	extClass: Ext.ColorPalette
});

dojo.declare("wm.ext.Edit", wm.Ext, {
	extClass: Ext.Edit
});

dojo.declare("wm.ext.DatePicker", wm.Ext, {
	extClass: Ext.DatePicker
});
*/


// Ext
registerPackage([ "Ext", "Panel", "wm.ext.Panel", "wm.base.widget.ext.Ext", "images/wm/panel.png", "Fancy pants panel"]);
registerPackage([ "Ext", "Field", "wm.ext.Field", "wm.base.widget.ext.Ext", "images/wm/edit.png", "Fancy pants field"]);
//registerPackage([ "Ext", "GridPanel", "wm.ext.GridPanel", "wm.base.widget.ext.GridPanel", "images/wm/data.png", "Fancy pants grid"]);
//[ "Ext", "ServiceVariable", "wm.ServiceVariable", "wm.base.components.Record", "images/wm/data.png", "Exty Service Data"],

registerPackage([ "Ext", "ExtTree", "wm.ext.Tree", "wm.base.widget.ext.Ext", "images/wm/tree.png", "An Ext tree."]);
registerPackage([ "Ext", "ExtToolbar", "wm.ext.Toolbar", "wm.base.widget.ext.Toolbar", "images/wm/panel.png", "An Ext toolbar."]);

