/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
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

dojo.provide("wm.studio.pages.UserSettings.UserSettings");

dojo.declare("UserSettings", wm.Page, {
	start: function() {
		this.connect(this.domNode, "keydown", this, "keydown");
		this.oldPasswordEditor.focus();
	},
	keydown: function(e) {
		if (e.keyCode == dojo.keys.ENTER) {
			this.okButton.domNode.focus();
		}
	},
	okButtonClick: function(inSender) {
		if (this.passwordEditor.getDataValue() == this.confirmPasswordEditor.getDataValue()) {
			studio.UserService.requestAsync("changePassword", 
				[this.oldPasswordEditor.getDataValue(), this.passwordEditor.getDataValue()], 
				dojo.hitch(this, "changePasswordSuccess"), 
				dojo.hitch(this, "changePasswordError"));
		} else {
			app.alert("The password does not match the confirm password.");
		}
	},
	changePasswordSuccess: function(inResponse) {
		wm.fire(this.owner, "dismiss");
		app.alert("The password has been successfully updated.");
		studio.startPageDialog.start.tabLayers1.setLayerIndex(0);
	},
	changePasswordError: function(inError) {
		app.alert(inError);
	},
	cancelButtonClick: function(inSender) {
		wm.fire(this.owner, "dismiss");
	},
	_end: 0
});
