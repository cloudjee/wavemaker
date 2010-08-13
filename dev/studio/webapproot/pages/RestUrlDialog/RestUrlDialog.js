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
dojo.provide("wm.studio.pages.RestUrlDialog.RestUrlDialog");

dojo.declare("RestUrlDialog", wm.Page, {
	start: function() {
		this.url = null;
	},
	clearAll: function() {
		this.urlInput.clear();
		this.responseTextArea.clear();
		this.errorMessageTextArea.clear();
		this.errorMessageTextArea.setShowing(false);
	},
	testBtnClick: function(inSender) {
		var u = this.urlInput.getValue("displayValue");
		if (u) {
			studio.beginWait("Invoking REST Service...");
			studio.webService.requestAsync("invokeRestCall", [u], 
				dojo.hitch(this, "invokeRestCallSuccess"), 
				dojo.hitch(this, "invokeRestCallError"));
		}
	},
	invokeRestCallSuccess: function(inResponse) {
		studio.endWait();
		if (inResponse && inResponse.length > 0) {
			this.responseTextArea.setValue("displayValue", inResponse[0]);
			this.errorMessageTextArea.setShowing((inResponse.length > 1));
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
			this.url = u
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
	_end: 0
});
