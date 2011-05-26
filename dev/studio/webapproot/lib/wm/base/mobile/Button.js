/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.mobile.Button");

dojo.declare("wm.mobile.ToolButton", wm.Control, {
    scrim: true,
    slanted: false,
    borderColor: "#444444",
    border: 1,
    width: "80px", 
    height: "50px",
    padding: "",
    margin: "0,2,4,0",
    caption: "",
    classNames: "wmmobtoolbutton",
    clicked: false,
    //alignInParent: "topLeft",
    build: function() {
	if (!this.domNode) {
	    this.domNode = document.createElement('button');
	}	
    },
    init: function() {
	this.inherited(arguments);
	if (this.domNode.ontouch === undefined)
	    this.connect(this.domNode, "onclick", this, "click");
	else
	    this.connect(this.domNode, "ontouch", this, "click");
	if (this.caption)
	    this.setCaption(this.caption);
	if (this.slanted)
	    this.setSlanted(this.slanted);
    },    
    click: function(inEvent) {
	if (!this.clicked) 
	    this.setProp("clicked", true);	
	var node = this.domNode;
	var id = this.getRuntimeId();

	/* If the user clicks in the middle of the animation, we must remove the clicked class AND pause
	 * so that the animation can be canceled before we restart it
	 */
	dojo.removeClass(this.domNode, "clicked");
	/* TODO: Replace with 	this.domNode.addEventListener('webkitAnimationEnd', dojo.hitch(this, "endShowingAnimation")); */
	window.setTimeout(function() {
	    dojo.addClass(node, "clicked");
	    wm.job(id + ".click", 600, function() {
		dojo.removeClass(node, "clicked");
	    });
	}, 1);
	this.onclick(inEvent, this);
    },
    onclick: function() {
    },
    setDisabled: function(inDisabled) {
	this.inherited(arguments);
	this.domNode.disabled = inDisabled ? "disabled" : "";
	dojo[inDisabled ? "addClass" : "removeClass"](this.domNode, "wmmobtoolbutton-disabled");
    },
    setCaption: function(inCaption) {
	this.caption = inCaption;
	this.domNode.innerHTML = inCaption;
    },
    setSlanted: function(inSlanted) {
	this.slanted = inSlanted;
	dojo[inSlanted ? "addClass" : "removeClass"](this.domNode, "Slanted");
    }
});

wm.Object.extendSchema(wm.mobile.ToolButton, {
        clicked: {ignore: 1, bindSource: true, type: "Boolean"}
});


dojo.declare("wm.mobile.Button", wm.mobile.ToolButton, {
    width: "100%",
    margin: 4,
    caption: "Button",
    classNames: "wmmobtoolbutton wmmobbutton"
});

dojo.declare("wm.mobile.ToggleButton", wm.mobile.ToolButton, {
	border: 1,
	borderColor: "#ABB8CF",
	margin: 4,
	captionUp: "Btn Up",
        captionDown: "Btn Down",
        classNames: "wmmobtoolbutton wmmobtogglebutton",
        init: function() {
	    this.caption = this.captionUp;
	    this.inherited(arguments);
            if (this.clicked)
                this.setClicked(true);
	    else
		dojo.addClass(this.domNode, "toggleButtonUp");
	},
        click: function() {
	    this.setProp("clicked", !this.clicked);
	    this.onclick();
	},
    setClicked: function(inClicked) {
	if (inClicked != this.clicked) {
	    this.clicked = inClicked;
	    this.valueChanged("clicked", inClicked);
	    this.setCaption(this.clicked ? this.captionDown : this.captionUp);
	    dojo[this.clicked ? "addClass" : "removeClass"](this.domNode, "toggleButtonDown");
	    dojo[this.clicked ? "removeClass" : "addClass"](this.domNode, "toggleButtonUp");
	}
    },
    setCaptionUp: function(inCaption) {
        this.captionUp = inCaption;
        this.setCaption(inCaption);
    }
});

wm.Object.extendSchema(wm.mobile.ToggleButton, {
    captionUp: { group: "display", bindTarget: 1, order: 10, focus: 1, doc: 1},
    captionDown: { group: "display", bindTarget: 1, order: 11, doc: 1},
    clicked: { group: "display", type: "Boolean", bindTarget: 1, bindSource: 1, order: 12, simpleBindProp: true,doc: 1},
    caption: {ignore: 1},
    setClicked: {group: "method", params: "(inClicked)", doc: 1}
});



dojo.declare("wm.mobile.ToggleButtonSet", wm.Control, {
    scrim: true,
    borderColor: "#444444",
    border: "0",
    width: "100%", 
    height: "50px",
    padding: "",
    margin: "4",
    caption0: "",
    caption1: "",
    caption2: "",
    caption3: "",
    classNames: "wmmobbuttonset",
    clicked: -1,
    init: function() {
	this.inherited(arguments);
	this._buttonNodes = [];
	this._buttonCount = 0;
	this.connectEvents(this.domNode, ["click"]);
    },
    postInit: function() {
	this.inherited(arguments);
	this._inPostInit = true;
	this.setCaption(this.caption0,0);
	this.setCaption(this.caption1,1);
	this.setCaption(this.caption2,2);
	this.setCaption(this.caption3,3);
	this.setClicked(this.clicked);
	delete this._inPostInit;
	dojo.addClass(this.domNode, "wmmobbuttonset-" + this._buttonCount);
	this._lastClass =  "wmmobbuttonset-" + this._buttonCount;
    },
    /* TODO: There's some dom manipulation to be done if a user adds the second button before the first; for now, ignore this case */
    setCaption: function(inCaption, buttonNumber) {
	if (inCaption) {
	    if (!this._buttonNodes[buttonNumber]) {
		this._buttonNodes[buttonNumber] = dojo.create("button", {className: "Unchecked"}, this.domNode);
		this._buttonCount++;
	    }
	    this._buttonNodes[buttonNumber].innerHTML = inCaption;
	    this._buttonNodes[buttonNumber].style.display = "";
	} else if (this._buttonNodes[buttonNumber]) {
	    this._buttonNodes[buttonNumber].style.display = "none";
	    delete this._buttonNodes[buttonNumber];
	    this._buttonCount--;
	}
	this["caption" + buttonNumber] = inCaption;
	if (!this._inPostInit) {
	    dojo.removeClass(this.domNode, this._lastClass);
	    dojo.addClass(this.domNode, "wmmobbuttonset-" + this._buttonCount);
	    this._lastClass =  "wmmobbuttonset-" + this._buttonCount;
	}
    },
    getCaption: function(buttonNumber) {
	return this["caption" + buttonNumber];
    },
    click: function(inEvent) {
	var oldButton = (this.clicked != -1) ? this._buttonNodes[this.clicked] : null;
	var newButtonIndex = this._buttonNodes.indexOf(inEvent.target); // change to dojo.indexOf if supporting IE 8
	if (newButtonIndex != this.clicked) {
	    this.setProp("clicked", newButtonIndex);	
	    this.onclick(newButtonIndex);
	}
    },
    setClicked: function(inClicked) {
	var oldButton = (this.clicked != -1) ? this._buttonNodes[this.clicked] : null;
	var newButton = inClicked != -1 ? this._buttonNodes[inClicked] : null;

	this.clicked = inClicked;
	if (oldButton && newButton != oldButton) {
	    dojo.removeClass(oldButton, "Clicked");
	    dojo.addClass(oldButton, "Unclicked");
	}
	if (newButton) {
	    dojo.removeClass(newButton, "Unclicked");
	    dojo.addClass(newButton, "Clicked");
	}
    },
    onclick: function(buttonIndex) {
    },
    setDisabled: function(inDisabled) {
	this.inherited(arguments);
	this.domNode.disabled = inDisabled ? "disabled" : "";
	dojo[inDisabled ? "addClass" : "removeClass"](this.domNode, "wmmobtoolbutton-disabled");
    },

});