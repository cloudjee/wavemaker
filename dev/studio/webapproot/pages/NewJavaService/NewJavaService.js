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
dojo.provide("wm.studio.pages.NewJavaService.NewJavaService");

dojo.declare("NewJavaService", wm.Page, {
	start: function() {
		this.newServiceId = null;
		this.newJavaCode = null;
	},
	clearAll: function() {
		this.newJavaServiceIdInput.clear();
		this.newJavaClassNameInput.clear();
	},
	okButtonClick: function(inSender) {
		var srvid = this.newJavaServiceIdInput.getValue("displayValue");
		var cls = this.newJavaClassNameInput.getValue("displayValue");
		this.newServiceId = null;
		this.newJavaCode = null;
		if (srvid && cls) {
		    studio.beginWait(this.getDictionaryItem("WAIT_CREATING"));
			studio.javaService.requestAsync("newClass", [srvid, cls],
				dojo.hitch(this, "newJavaClassCallback", srvid), dojo.hitch(this, "newJavaClassErrorCallback"));
		} else {
		    app.alert(this.getDictionaryItem("ALERT_NEED_INPUT"));
		}
	},
	cancelButtonClick: function(inSender) {
		wm.fire(this.owner, "dismiss");
	},
	newJavaClassCallback: function(inServiceId, inData) {
		studio.endWait();
		this.newServiceId = inServiceId;
		this.newJavaCode = inData;
		wm.fire(this.owner, "dismiss", ["OK"]);
	},
	newJavaClassErrorCallback: function(inError) {
		studio.endWait();
		app.alert(inError.message);
		wm.fire(this.owner, "dismiss");
	},
	_end: 0
});