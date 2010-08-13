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

dojo.provide("wm.studio.pages.DDLDialog.DDLDialog");

dojo.declare("DDLDialog", wm.Page, {

	showDDL: false,

	start: function() {
	},
	setup: function(showDDL) {
	    this.showDDL = showDDL;
		if (this.showDDL) {
			    this.label1.setCaption("Are you sure you want to export the data model to your database?<br>Running the following DDL will cause tables to get dropped and you will lose data.");
		} else {
		    this.label1.setCaption("Export Messages");
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
