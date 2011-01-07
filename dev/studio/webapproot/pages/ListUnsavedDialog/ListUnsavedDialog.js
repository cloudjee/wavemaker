/*
 * Copyright (C) 2010 WaveMaker Software, Inc.
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

dojo.declare("ListUnsavedDialog", wm.Page, {
    start: function() {
	
    },
    setUnsaved: function(pageList) {
	this.pageList = pageList;
	while (this.mainPanel.c$.length)
	    this.mainPanel.c$[0].destroy();

	dojo.forEach(pageList, dojo.hitch(this, function(page) {
	    var panel = new wm.Panel({layoutKind: "left-to-right",
				      parent: this.mainPanel,
				      owner: this,
				      width: "100%",
				      height: "24px",
				      border: "0,0,2,0",
				      margin: "2,0,2,0",
				      borderColor: "#666666"});

	    panel.connect(page, "saveComplete", this, function() {
		dojo.addClass(panel.domNode, "Saved");
	    });

	    var saveButton = new wm.ToolButton({parent: panel,
						owner: this,
						imageList: studio.smallToolbarImageList,
						imageIndex: 8,
						hint: "Save",
						margin: "0,0,0,4",
						width: "28px",
						height: "100%"});
	    saveButton.connect(saveButton, "onclick", this, function() {
		page.save();
		saveButton.setDisabled(true);
	    });
	    
	    var label = new wm.Label({parent: panel,
				      owner: this,
				      caption: page.owner.parent.caption.replace(/^\<.*?\>\s*/,""),
				      width: "100%",
				      height: "100%"});

	}));
	this.mainPanel.reflow();
    },
    doneClick: function() {
	this.owner.owner.dismiss();
	this.onDone();
    },
    cancelClick: function() {
	this.owner.owner.dismiss();
    },
    onDone: function() {},
    saveall: function() {
	this.unsavedPages = [];
	for (var i = 0; i < this.pageList.length; i++)
	    this.unsavedPages.push(this.pageList[i]);
	this.saveNext();
    },
    saveNext: function() {
	var page = this.unsavedPages.shift();
	if (!page) {
	    for (var i = 0; i < this.pageList.length; i++) {
		if (this.pageList[i].getDirty()) {

		    return;
		}
	    }

	    this.owner.owner.dismiss();
	    this.onDone();
	    return;
	}
	if (page.getDirty()) {
	    page.connect(page, "saveComplete", this, "saveNext");
	    page.save();
	} else {
	    this.saveNext();
	}
    },
  _end: 0
});
