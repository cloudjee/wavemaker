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

dojo.declare("wm.ToggleButtonPanel", wm.Container, {
    manageURL: false,
    manageHistory: false,
    classNames: "wmtogglebuttonpanel",
    layoutKind: "left-to-right",
    currentButton: -1,
    currentButtonName: "",
    currentButtonCaption: "",
    height: "40px",
    enableTouchHeight: true,
    width: "100%",
    buttonMargins: "0",
    init: function() {
	this._btns = [];
	this.inherited(arguments);
    },
    postInit: function() {
	this.inherited(arguments);
	if (this.manageURL && this.owner.locationState) {		
	    this.restoreFromLocationHash(this.owner.locationState[this.getRuntimeId()]);
	}
/*
	for (var i = 0; i < this.c$.length; i++) {
	    if (this.c$[i] instanceof wm.ToolButton) {
		this.c$[i].connect(this.c$[i], "onclick", dojo.hitch(this, "changed", this.c$[i]));
		this._btns.push(this.c$[i]);
	    }
	}
	*/
    },
    addWidget: function(inWidget) {
	this.inherited(arguments);
	if (inWidget instanceof wm.ToolButton) {
	    inWidget.setHeight("100%");
	    this._btns.push(inWidget);
	    inWidget.connect(inWidget, "onclick", dojo.hitch(this, "changed", inWidget));
	    inWidget.setMargin(this.buttonMargins);
	}
    },
    removeWidget: function(inWidget) {
	this.inherited(arguments);
	wm.Array.removeElement(this._btns, inWidget);
    },
    changed: function(inButton) {
	var currentButtonWas = this.currentButton;
	if (currentButtonWas instanceof wm.ToolButton && currentButtonWas != inButton) {
	    dojo.removeClass(currentButtonWas.domNode, "toggleButtonDown");
	    if (!this._isDesignLoaded && !this._inBack && this.manageHistory && inButton) {
		app.addHistory({id: this.getRuntimeId(),
				options: {name:currentButtonWas.name},
				title: inButton.caption + " Selected"});
	    }

	}
	if (inButton instanceof wm.ToolButton) {
	    this.currentButton = inButton;
	    this.currentButtonName = inButton.name;
	    this.currentButtonCaption = inButton.caption;
	    if (inButton) {
		dojo.addClass(inButton.domNode, "toggleButtonDown");
	    }
	    if (this.currentButton !== currentButtonWas) {
		if (currentButtonWas instanceof wm.ToolButton) {
		    currentButtonWas.setValue("clicked", false);
		}
		this.valueChanged("currentButton", this.currentButton); // currentButton is a bindSource
		this.onChange(this.currentButton);
	    }
	    this.currentButton.clicked = true; // there are paths where this fails to get set
	} else {
	    if (currentButtonWas instanceof wm.ToolButton) {
		currentButtonWas.setValue("clicked", false);
	    }
	    this.currentButton = null;	    
	    if (currentButtonWas instanceof wm.ToolButton) {
		this.valueChanged("currentButton", this.currentButton); // currentButton is a bindSource
		this.onChange(this.currentButton);
	    }	    
	}
	this.valueChanged("currentButtonName", this.currentButtonName);
	this.valueChanged("currentButtonCaption", this.currentButtonCaption);
    },
    setCurrentButton: function(inButton) { // currentIndex is a bindTarget
	// why wm.onidle? Without this, a button click event could be clicked before the layer or pagecontainer its trying trigger a navigation to is created
	var self = this;
	wm.job(this.getRuntimeId() + ".setCurrentButton", 1, function() {
	    if (inButton instanceof wm.ToolButton) {
		inButton.click({type: "click"});
	    } else {
		self.changed(null);
	    }
	});
    },


    onChange: function(inButton) {},
    handleBack: function(inOptions) {
	this._inBack = true;
	var name = inOptions ? inOptions.name : null;
	var button = this.owner[name];
	if (button && this.currentButton != button) {
	    button.click({type: "click"});
	}
	delete this._inBack;
	return true;
    },
    restoreFromLocationHash: function(inValue) {
	this.manageHistory = false;
	if (inValue !== undefined) {
	    if (this.owner[inValue]) {
		this.setCurrentButton(this.owner[inValue]);
	    }
	}
	this.manageHistory = true;
    },
    generateStateUrl: function(stateObj) {
	if (this.currentButton)
	    stateObj[this.getRuntimeId()] = this.currentButton.name;
    }
});