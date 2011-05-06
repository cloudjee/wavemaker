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
 
dojo.provide("wm.studio.pages.PopupHelp.PopupHelp");


dojo.declare("PopupHelp", wm.Page, {
        i18n: true,
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
