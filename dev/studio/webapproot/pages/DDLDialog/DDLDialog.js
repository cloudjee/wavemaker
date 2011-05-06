/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
 

dojo.provide("wm.studio.pages.DDLDialog.DDLDialog");

dojo.declare("DDLDialog", wm.Page, {
        i18n: true,
	showDDL: false,

	start: function() {
	},
	setup: function(showDDL) {
	    this.showDDL = showDDL;
		if (this.showDDL) {
		    this.label1.setCaption(this.getDictionaryItem("LABEL1_CONFIRM"));
		} else {
		    this.label1.setCaption(this.getDictionaryItem("LABEL1_EXPORT"));
		}

	},
	onOk: function() {
		this.owner.owner.dismiss();
		if (this.showDDL) {
			this.dataObjectEditor.onDDLOkClicked();
		}
	},
	onCancel: function() {
		this.owner.owner.dismiss();
		if (this.showDDL) {
			this.dataObjectEditor.onDDLCancelClicked();
		}
	},
	_end: 0
});
