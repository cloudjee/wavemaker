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
dojo.provide("wm.studio.pages.PopupHelp.PopupHelp");


dojo.declare("PopupHelp", wm.Page, {
	//===========================================================================
	// Initialization / setup
	//===========================================================================
	     closeButton: null,
	start: function() {
	},

	moreButtonClick: function() {

	},
        examplesButtonClick: function() {

	},
        cancelButtonClick: function() {
	      wm.fire(this.owner.owner, "dismiss");
	},
	 setHeader: function(objectType, propName) {
	     //this.labelHeading.setCaption("Help: " + ((objectType) ? objectType + ": " : "") + propName);
             this.owner.owner.setTitle("Help: " + ((objectType) ? objectType + ": " : "") + propName);
	 },
	 setContent: function(text) {
	       this.labelBody.setCaption(text);	       
	       
	       if (text) {
		     this.buttonPanel.removeAllControls();
	       }
	       var popuphelp = this;
               dojo.query(".SynopsisNavButtons a").forEach(function(synopsislink) {
		     var newButton = new wm.Button({parent: popuphelp.buttonPanel, owner: popuphelp, caption: synopsislink.innerHTML, width: "100px"});
		     popuphelp.buttonPanel.addControl(newButton);
		     dojo.connect(newButton, "onclick", null, function() {
			   window.open(dojo.attr(synopsislink,"href"));
		     });
	       }).orphan();
	       dojo.query(".PopupHelp .PopupHelp-labelBody").addContent("&nbsp;"); // force an adequate bottom margin

	       var closeButton = new wm.Button({parent: this.buttonPanel, owner: this, caption: "Close", width: "100px"});
	       //this.buttonPanel.addControl(closeButton);
	       dojo.connect(closeButton, "onclick", this, "cancelButtonClick");
	       this.reflow();
	 }
	     });
