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
dojo.provide("wm.studio.pages.RestUrlDialog.RestUrlDialog");

dojo.declare("RestUrlDialog", wm.Page, {
	start: function() {
		this.url = null;
		this.method = null;
		this.contentType = null;
		this.postData = null;
		this.basicAuth = null;
		this.userId = null;
		this.password = null;
		this.userIdInput.setDisabled(true);
		this.passwordInput.setDisabled(true);
		this.basicAuthCheckbox.setChecked(false)
	},
	clearAll: function() {
		this.urlInput.clear();
		this.responseTextArea.clear();
		this.errorMessageTextArea.clear();
		this.errorMessageTextArea.setShowing(false);
	},
	testBtnClick: function(inSender) {
		var u = this.urlInput.getValue("displayValue");
		var m = this.methodInput.getDataValue();
		var t = this.contentTypeInput.getDataValue();
		var p = this.requestTextArea.getDataValue();
		var b = this.basicAuthCheckbox.getChecked();
		var i = (this.userIdInput.getDataValue() == undefined ? "" : this.userIdInput.getDataValue());
		var w = (this.passwordInput.getDataValue() == undefined ? "" : this.passwordInput.getDataValue());
		if (u) {
		    studio.beginWait(this.getDictionaryItem("WAIT_TEST_CLICK"));
			if (m == "GET") {
				studio.webService.requestAsync("invokeRestCall", [u, b, i, w], 
					dojo.hitch(this, "invokeRestCallSuccess"), 
					dojo.hitch(this, "invokeRestCallError"));
			} else { //POST
				studio.webService.requestAsync("invokeRestCall", [u, m, t, p, b, i, w], 
					dojo.hitch(this, "invokeRestCallSuccess"), 
					dojo.hitch(this, "invokeRestCallError"));
			}
		}
	},
	invokeRestCallSuccess: function(inResponse) {
		studio.endWait();
		if (inResponse && inResponse.length > 0) {
			this.responseTextArea.setValue("displayValue", inResponse[0]);
		    this.errorMessageTextArea.setShowing((inResponse.length > 1));
		    this.responseTextArea.setShowing(!this.errorMessageTextArea.showing);
			if (inResponse.length > 1) {
				this.errorMessageTextArea.setValue("displayValue", inResponse[1]);
			}
		}
	},
	invokeRestCallError: function(inError) {
		studio.endWait();
	},
	populateBtnClick: function(inSender) {
		var u = this.urlInput.getValue("displayValue");
		if (u) {
			this.url = u;
			this.method = this.methodInput.getDataValue();
			this.contentType = this.contentTypeInput.getDataValue();
			this.postData = this.requestTextArea.getDataValue();
			this.basicAuth = this.basicAuthCheckbox.getChecked();
			this.userId = (this.userIdInput.getDataValue() == undefined ? "" : this.userIdInput.getDataValue());
			this.password = (this.passwordInput.getDataValue() == undefined ? "" : this.passwordInput.getDataValue());
			this.owner.owner.layers.setLayer("restBuilderLayer");
			this.owner.owner.importButton.setDisabled(false);
			this.owner.owner.restServiceBuilderPage.page.populate();
			//wm.fire(this.owner, "dismiss");
		}
	},
	cancelBtnClick: function(inSender) {
		this.url = null;
		this.owner.owner.layers.setLayer("restBuilderLayer");
		this.owner.owner.importButton.setDisabled(false);
		//wm.fire(this.owner, "dismiss");
	},

	basicAuthCheckboxChange: function(inSender, inDisplayValue, inDataValue) {
		this.userIdInput.setDisabled(!inDataValue);
		this.passwordInput.setDisabled(!inDataValue);
    },

	_end: 0
});
