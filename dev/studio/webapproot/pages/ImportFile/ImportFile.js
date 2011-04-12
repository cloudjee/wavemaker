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

dojo.provide("wm.studio.pages.ImportFile.ImportFile");

dojo.declare("ImportFile", wm.Page, {
    start: function() {
	this.filename.editor.set("placeHolder", this.getDictionaryItem("PLACEHOLDER"));
    },
    openProject: function() {
	this.owner.dismiss();
	studio.project.openProject(this.fileUploader.variable.getData()[0].path);
    },
    selectLastItem: function() {
	wm.onidle(this, function() {
	    this.list.eventSelect(this.list.getItem(this.list.getCount()-1));
	});
    },
    onChange: function() {
	var data = this.fileUploader.variable.getData();
	this.fileUploader.reset();
	if (data) {
	    data = data[0];
	    this.fileUploader.variable.setData([data]);
	}
	
    },
    _end: 0
});
