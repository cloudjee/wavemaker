/*
 * Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
 

dojo.provide("wm.studio.pages.UserSettings.UserSettings");

dojo.declare("UserSettings", wm.Page, {
        i18n: true,
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
		    app.alert(this.getDictionaryItem("ALERT_PASSWORD_MISMATCH"));
		}
	},
	changePasswordSuccess: function(inResponse) {
		wm.fire(this.owner, "dismiss");
		    app.alert(this.getDictionaryItem("ALERT_PASSWORD_UPDATED"));
		app.alert("");
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
