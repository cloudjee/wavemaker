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
 
dojo.provide("wm.studio.pages.NewJavaService.NewJavaService");

dojo.declare("NewJavaService", wm.Page, {
        i18n: true,
	start: function() {
		this.newServiceId = null;
		this.newJavaCode = null;
	},
    onShow: function() {
	this.newJavaServiceIdInput.focus();
    },
	clearAll: function() {
		this.newJavaServiceIdInput.clear();
		this.newJavaClassNameInput.clear();
	},
	okButtonClick: function(inSender) {
	    var srvid = dojo.trim(this.newJavaServiceIdInput.getValue("displayValue"));
	    var cls = dojo.trim(this.newJavaClassNameInput.getValue("displayValue"));

	    if (!cls.match(/^\w[\w\d_.]*[\w\d]$/)) {
		app.alert(this.getDictionaryItem("ALERT_INVALID_CLASSNAME"));
		return;
	    }
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