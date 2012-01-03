/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Buttons.ToggleButton");
dojo.require("wm.base.widget.Buttons.ToolButton");



dojo.declare("wm.ToggleButton", wm.ToolButton, {
        mobileHeight: "40px",
	height: "32px",
	border: 1,
	borderColor: "#ABB8CF",
	margin: 4, 
    /* TODO: Localize This */
	captionUp: "Btn Up",
    /* TODO: Localize This */
        captionDown: "Btn Down",
        classNames: "wmbutton wmtogglebutton",
        init: function() {
	    this.caption = this.captionUp;
	    this.inherited(arguments);
            if (this.clicked)
                this.setClicked(true);
	},
	click: function(inEvent) {
	    this.setProp("clicked", !this.clicked);

	    /* Sometimes users go from an editor to clicking a button and some browsers don't update the editor value in time for
	     * our onclick handler to see it.  So build in a delay before firing onclick handlers
	     */
	    wm.onidle(this, function() {
	        this.onclick(inEvent, this);
	    });
	},
    /* Sets the state, updates the css, does not fire events; useful in a set of toggle buttons where clicking one updates the states of the others, but firing events on each one would be bad */
    setClicked: function(inClicked) {
	/* this._cupdating occurs when initializing a togglebutton whose clicked value is true */
	if (inClicked != this.clicked || this._cupdating) {
	    this.clicked = inClicked;
	    this.valueChanged("clicked", inClicked);
	    this.setCaption(this.clicked ? this.captionDown : this.captionUp);
	    dojo[this.clicked ? "addClass" : "removeClass"](this.domNode, "toggleButtonDown");
	}
    },
    setCaptionUp: function(inCaption) {
        this.captionUp = inCaption;
	if (!this.clicked)
            this.setCaption(inCaption);
    },
    setCaptionDown: function(inCaption) {
        this.captionDown = inCaption;
	if (this.clicked)
            this.setCaption(inCaption);
    }
});
