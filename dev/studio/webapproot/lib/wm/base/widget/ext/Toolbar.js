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
dojo.provide("wm.base.widget.ext.Toolbar");

Ext.reg('coloritem', Ext.menu.ColorItem);
Ext.reg('menubutton', Ext.Toolbar.MenuButton);

dojo.declare("wm.ext.Toolbar", wm.Ext, {
	extClass: Ext.Toolbar,
	extProps: {},
	buttons: [],
	/*init: function() {
		this.setParent(this.parent);
		this.setDomNode(this.domNode);
		this.initExt();
	},*/
	initExt: function() {
		this.inherited(arguments);
		//console.log(this.domNode);
		//this.ext = new this.extClass(this.domNode, dojo.mixin(this.extProps));
		//this.ext = new this.extClass(this.domNode, dojo.mixin({items: this.buttons}, this.extProps));
		this.ext.addButton({
			text:'File',
			menu: {
					id: 'basicMenu',
					items: [{
									text: 'Open',
									handler: null
							}, {
									text: 'Save',
									handler: null
							},
							'-',
							new Ext.menu.CheckItem({
									text: 'Option A',
									checkHandler: null
							}),
							new Ext.menu.CheckItem({
									text: 'Option B',
									checkHandler: null
							})/*,
							'-', {
									text: 'DateMenu as submenu',
									menu: dateMenu // assign the dateMenu we created above by variable reference,
							}, {
									text: 'Submenu with ColorItem',
									menu: 'colorMenu'    // we assign the submenu containing a ColorItem using it's id
							}*/
					]
			}
		});
		this.ext.addButton(this.buttons);
	}
});
