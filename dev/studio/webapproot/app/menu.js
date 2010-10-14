/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
dojo.provide("wm.studio.app.menu");

Studio.extend({

		  // called by packageLoader.js for anything that is not an instanceof wm.Control
	addComponentMenuItem: function(inTab, inName, inDescription, inImage, inClass, inProps) {
	  try {
	  var menu = (inTab == bundleStudio.M_Services) ? this.servicesPopupBtn : this.insertPopupBtn;
	  var menuBar = this.navigationMenu;
	  var newId = inName + "MenuItem";

	  // Don't add it twice...
	  if (!this[newId]) {
	    menuBar.addNewMenuItem(menu, {label: inName,
					  info: {type: inClass, props: inProps}, // for callback to selectComponentMenuItem, not for the menu itself
					  type: inClass,                         // for callback to selectComponentMenuItem, not for the menu itself
					  onClick: "selectComponentMenuItem",
					  idInPage: inName + "MenuItem",
					  iconClass: inImage.substring(inImage.lastIndexOf("/")+1,inImage.indexOf("."))});
	  }
	} catch(e) {
	    console.error("disableMenuBar Failed");
	    console.log(e);
	}
	},
	// TODO: Palette has similar function; should only has one
	selectComponentMenuItem: function(menuObj, info) {
	  //var info = e.item.info;
		var props = dojo.clone(info.info.props || {});
		var ctor = dojo.getObject(info.type);
		dojo.mixin(props, {
			_designer: studio.page._designer,
			name: studio.page.getUniqueName(props.name || studio.makeName(info.type)),
			owner: studio.page,
			parent: studio.page.root
		});
		var comp = new ctor(props);
		if (comp) {
			if (!(comp instanceof wm.ServerComponent)) {
				// create an undo task
				new wm.AddTask(comp);
			}
			if (!wm.fire(comp, "afterPaletteDrop")) {
				// FIXME: should not refresh entire tree when dropping from palette.
				studio.refreshDesignTrees();
				studio.inspector.resetInspector();
				studio.select(comp);
			}
		}
	},

	disableMenuBar: function(inDisabled) {
	  try {
	  // attr for dojo menu items; setDisabled for wavemaker components.  At some point we'll want to put our own DojoMenuItem wrapper around the dojo menu items
		this.projectPopupBtn.set("disabled",false);
		this.editPopupBtn.set("disabled",inDisabled);
		this.viewPopupBtn.set("disabled",inDisabled);
		this.insertPopupBtn.set("disabled",inDisabled);
		this.servicesPopupBtn.set("disabled",inDisabled);
		this.pagePopupBtn.set("disabled",inDisabled);
		this.navTestBtn.setDisabled(inDisabled);
		this.leftToolbarButtons.setDisabled(inDisabled);
		this.navRunBtn.setDisabled(inDisabled);
		if (studio.isCloud()) {
		    this.navEditAccountBtn.setDisabled(false);
		    this.navLogoutBtn.setDisabled(false);
		}
		    this.closeProjectItem.set("disabled",inDisabled);
		    this.copyProjectItem.set("disabled",inDisabled);
		    this.deleteProjectItem.set("disabled",inDisabled);
		    this.exportProjectItem.set("disabled",inDisabled);
		    this.deployProjectItem.set("disabled",inDisabled);
	  } catch(e) {
	    console.error("disableMenuBar Failed");
	    console.log(e);
	  }

	},
	disableCanvasOnlyMenuItems: function(inDisabled) {
		var d = inDisabled;
		this.editPopupBtn.set("disabled",d);
		this.insertPopupBtn.set("disabled",d);
		this.pagePopupBtn.set("disabled",d);
		this.outlineItem.set("disabled",d);
		//this.liveLayoutItem.set("disabled",d);
		//this.navigationBar.reflow();
	}
})
