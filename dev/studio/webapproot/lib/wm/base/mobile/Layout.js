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
dojo.provide("wm.base.mobile.Layout");
dojo.provide("wm.base.mobile.LayoutBox");
dojo.require("dojox.mobile.scrollable");
/*
dojox.mobile.scrollable = function(){
    this.init = function() {};
    this.resizeView = function() {};
};*/
/*
dojo.declare("wm.mobile.Header", wm.Control, {
    width: "100%",
    height: "42px",
    title: "",
    back: false,
    isRelativePositioned: true,
    postInit: function() {
	this.inherited(arguments);
	this.domNode.fixed = "top";
	this.dijit = new dojox.mobile.Heading({back: this.back,
					       label: this.title,
					       iconBase: "",
					       href: "",
					       transition: ""}, this.domNode);
    },
    renderCss: function() {
	    this.invalidCss = false;
    },
    renderBounds: function() {
	if (this.dom) {
	    var b = this.getStyleBounds();
	    b.w = NaN;
	    b.h = NaN;
	    this.dom.setBox(b, wm.AbstractEditor && this.singleLine && this instanceof wm.AbstractEditor == false);
	}
    },
    setTitle: function(inTitle) {
	this.title = inTitle;
	if (this.dijit)
	    this.dijit.setLabel(this.title);
    },
    render: function() {
	this.inherited(arguments);
	if (this.dijit)
	    this.dijit.buildRendering();
    }

});
*/
dojo.declare("wm.mobile.Layout", wm.mobile.Container, {
    title: "Page Title",
    hideTitleBarHeight: 300,
    verticalOffset: 0,
	// useful properties
	classNames: 'wmlayout',
        //autoScroll: true,
	fit: false,
	width: "",
	height: "",
        layoutTouchScrolling: false, /* Important: This defaults to false; Layers are intended to handle scrolling.  A design that has no layers MUST turn this on! */
	create: function() {
		this.inherited(arguments);
	},
	build: function() {
		this.inherited(arguments);
		this.domNode.style.cssText += this.style + "overflow: hidden; position: relative;";
	},
	init: function() {
		this.inherited(arguments);
		/*
		// FIXME: detect ownership under app. Seems like it would be cleaner if, at least, part controlled this.
		var mainBox = (this.owner && this.owner.owner == window.app);
		if (mainBox) {
			this.fit = {
				w: (!this.width || wm.splitUnits(this.width).units == "flex"),
				h: (!this.height || wm.splitUnits(this.height).units == "flex")
			};
		}
		*/

	    this.subscribe("window-resize", this, "resize");

	    this.headerPanel = new wm.mobile.Container({layoutKind: "left-to-right", 
							parent: this, 
							owner: this, 
							name: "Heading", 
							width: "100%", 
							height: "42px",
							flags: {notInspectable: true},
							_classes: {domNode: ["mblHeading"]}});
	    this.header = new wm.mobile.Label({caption: this.title, 
					       width: "100%", 
					       align: "center", 
					       height: "100%", 
					       parent: this.headerPanel, 
					       owner: this});

	    this.headerDownButton = new wm.mobile.ToolButton({owner: this,
							    parent: this.headerPanel,
							    width: "30px",
							      height: "100%",
							      caption: '&dArr;',
							    showing: false,
							    onclick: dojo.hitch(app, "focusPrevEditor"),
							    _classes: {domNode: ["HeaderDownButton"]}}); 
	    this.headerUpButton = new wm.mobile.ToolButton({owner: this,
							    parent: this.headerPanel,
							    width: "30px",
							    height: "100%",
							    caption: "&uArr;",
							    showing: false,
							    onclick: dojo.hitch(app, "focusNextEditor"),
							    _classes: {domNode: ["HeaderUpButton"]}}); 

	 
	    dojo.attr(this.headerPanel.domNode, "fixed", "top"); // hint to the scroller

	    this.controlBar = this.getControlBar(); // create this before we set the containerWidget or this ends up in the containerWidget
	    this.containerWidget = new wm.mobile.Container({layoutKind: "top-to-bottom", 
							    parent: this,
							    owner: this,
							    name: "containerWidget",
							    touchScroll: this.layoutTouchScrolling,
							    width: "100%",
							    height: "100%"});
	    this.moveControl(this.controlBar,2);


	    dojo.attr(this.controlBar.domNode, "fixed", "bottom"); // hint to the scroller

	},

    postInit: function() {
	this.inherited(arguments);
	/* If this is a wm.Layout for the root page not a pagecontainer, recheck the window size and update bounds */
	if (!this.parent)
	    this.resize();
    },
    getControlBar: function() {
	if (this.controlBar) {
	    return this.controlBar;
	} else if (this.$.controlBar) {
	    this.controlBar = this.$.controlBar;
	} else {
	    this.controlBar = new
	    wm.mobile.Container({_classes: {domNode: ["mblTabBar"]},
				 flags: {notInspectable: true},
				 showing: false,
				 horizontalAlign: "center",
				 verticalAlign: "center",
				 layoutKind: "left-to-right", parent: this, owner: this,
				 name: "controlBar", width: "100%", height: "48px"});
	}
	return this.controlBar;
    },
    setTitle: function(inTitle) {
	this.title = inTitle;
	if (this.header) {
	    this.header.setCaption(inTitle);
	    if (window.innerHeight > this.hideTitleBarHeight)
		this.headerPanel.setShowing(Boolean(inTitle));
	}
    },
    getOrderedWidgets: function() {
	return this.containerWidget.getOrderedWidgets();
    },
    fitTo: function() {
	if(this.domNode === document.body) {
	    document.body.scrollTop = 0;
	}
	var pn = this.domNode.parentNode;
	if (pn && !wm.isEmpty(this.fit)) {
	    pn.scrollTop = 0;
	    var n = dojo.contentBox(pn), b = {}, f = this.fit;
	    b.l = n.l;
	    b.t = n.t;
	    for (var i in f)
		if (f[i])
		    b[i] = n[i];
	    dojo.marginBox(this.domNode, b);
	}
    },
    showBackButton: function(backCallback) {
	if (!this.backButton) {
	    this.backButton = new wm.Control({owner: this,
					      parent: this.headerPanel,
					      width: "65px",
					      height: "40px",
					      name: "BackButton",
					      _classes: {domNode: ["mblArrowButton"]}});
	    var node1 = document.createElement("div");
	    node1.className = "mblArrowButtonHead";
	    this.backButton.domNode.appendChild(node1);

	    var node2 = document.createElement("div");
	    node2.className = "mblArrowButtonBody mblArrowButtonText";
	    node2.innerHTML = "Back";
	    this.backButton.domNode.appendChild(node2);

	    var node3 = document.createElement("div");
	    node3.className = "mblArrowButtonNeck";
	    this.backButton.domNode.appendChild(node3);

	    var titleIndex = this.headerPanel.indexOfControl(this.header);
	    this.headerPanel.moveControl(this.backButton, titleIndex);
	    this.headerPanel.reflow();
	    dojo.connect(this.backButton.domNode, "onclick", this, function() {this._backCallback();});
	}
	this._backCallback = backCallback;
	this.backButton.show();
    },
    hideBackButton: function() {
	if (this.backButton)
	    this.backButton.hide();
    },
	resize: function() {
	    var isReflowed = false;

	    // mobile device switches to landscape mode; hide the title bar
	    // also triggered by onscreen keyboard
	    if (window.innerHeight < this.hideTitleBarHeight) {
		this.headerPanel.hide();
		isReflowed = true;
	    } else if (this.title && !this.headerPanel.showing) {
		this.headerPanel.show();
		isReflowed = true;
	    }


	    var controlBarShowing = this.controlBar && this.controlBar.showing;
	    if (controlBarShowing) {	    
		/* Screen resizes when the keyboard opens up */
		if (window.innerHeight < 200) {
		    this.controlBar.hide();
		    isReflowed = true;
		} else if (!this.controlBar.showing) {
		    this.controlBar.show();
		    isReflowed = true;
		}
	    }
	    // if we have a parent, they control our reflow
	    // so we ignore window-resize message
	    if (!this.parent )
		this.reflow();
	},
	updateBounds: function() {
		this._percEx = {w:100, h: 100};
		if (!this.parent) {
			var pn = this.domNode.parentNode;
		    pn.style.height = "100%";
		    this.setBounds(0, 0, pn.offsetWidth, pn.offsetHeight - this.verticalOffset);
			//this.setBounds(dojo.contentBox(pn));
		} else {
			this.setBounds(this.parent.getContentBounds());
		}
	},
        setVerticalOffset: function(inOffset) {
	    this.verticalOffset = inOffset;
	    this.reflow();
	},
	reflow: function() {
		if (this._cupdating)
			return;
	        this.updateBounds();
		this.renderBounds();
		//this.fitTo();
		this.inherited(arguments);
		//wm.layout.box.reflow(this.domNode);
	}/*,
	canResize: function() {
		return false;
	}*/
});

// design-time
wm.Object.extendSchema(wm.mobile.Layout, {
    themeStyleType: {group: "style", order: 150},
	fitToContent: { ignore: 1 },
	fitToContentWidth: { ignore: 1 },
	fitToContentHeight: { ignore: 1 },
	minWidth: { ignore: 1 },
	minHeight: { ignore: 1 },
	fit: { ignore: 1 }
});

// bc
if (!wm.studioConfig)
    wm.mobile.LayoutBox = wm.Layout = wm.mobile.Layout;
