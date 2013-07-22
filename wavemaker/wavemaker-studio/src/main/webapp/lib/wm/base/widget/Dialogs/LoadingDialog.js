/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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


/* This dialog is designed to show whenever its "serviceVariableToTrack" is fired, and to cover the widget specified by widgetToCover when it shows.
 * This dialog can also be triggered via javascript:
 * call show/hide/setShowing to determine when its showing/hidden
 * set loadingdialog.widgetToCover = mywidget at any time; next call to show will cover the new widget. NOTE: Must have been hidden before next call to show.
 * Change the service variable to monitor at runtime with setServiceVariableToTrack.
 */
dojo.provide("wm.base.widget.Dialogs.LoadingDialog");
dojo.require("wm.base.widget.Dialogs.Dialog");

dojo.declare("wm.LoadingDialog", wm.Dialog, {
    caption: "Loading...",
    captionWidth: "60px",
    image: "",
    imageWidth: "20px",
    imageHeight: "20px",


    containerClass: "", // don't give the containerWidget any extra classes

    /* This is the widget that will be covered by this dialog */
    widgetToCover: null,

    /* OPTIONAL: Rather than calling show/hide, you may instead specify a servicevariable;
     * when that variable is firing, this is showing, when its not firing, this is not showing
     */
    serviceVariableToTrack: null,

    /* Do not use dialog class and styles */
    classNames: "wmloadingdialog wm_FontColor_White",

    useContainerWidget: true,

    /* This dialog will block clicking on the thing it covers, but does not block the rest of the page */
    modal: false,

    noMinify: true,
    noMaxify: true,
    noEscape: true,
    border: 0,
    title: "",
    _noAnimation: true,
/*
    _animationShowTime: 800,
    _opacity: 0.7,
    */
    postInit: function() {
	this.inherited(arguments);
	dojo.removeClass(this.domNode, "wmdialog");
	this.containerWidget.setLayoutKind("left-to-right");
	this.containerWidget.setVerticalAlign("middle");
	this.containerWidget.setHorizontalAlign("center");
	this.containerWidget.setFitToContentHeight();

	this.setImage(this.image);
	this.setCaption(this.caption);

	   this.setServiceVariableToTrack(this.serviceVariableToTrack);
    },
    setServiceVariableToTrack: function(inVars) {
	if (this._isDesignLoaded) return;
	
	if (inVars && inVars.length) {
        inVars = dojo.map(inVars, function(inVar) {
    	    if (dojo.isString(inVar)) {
    		  return this.owner.getValueById(inVar);
    		 } else {
    		  return inVar;
    		 }
  		 },this);    		 
	}
    if (inVars && !dojo.isArray(inVars)) inVars = [inVars];
	this.serviceVariableToTrack = inVars;
    if (this._onResultConnect) {
    	dojo.forEach(this._onResultConnect, function(c) {
    	   dojo.disconnect(c);
    	   wm.Array.removeElement(this._connections, c);	 
    	},this);
    	dojo.forEach(this._onRequestConnect, function(c) {
    	   dojo.disconnect(c);
    	   wm.Array.removeElement(this._connections, c);	 
    	},this);	
    }
      this._onResultConnect = [];
      this._onRequestConnect = [];
	  if (this.serviceVariableToTrack && this.serviceVariableToTrack.length) {	  
	       dojo.forEach(this.serviceVariableToTrack, function(svar) {
    	      this._onResultConnect.push(this.connect(svar, "onResult", dojo.hitch(this, "svarDone", svar)));
    	      this._onRequestConnect.push(this.connect(svar, "request", dojo.hitch(this, "svarStart", svar)));
    	   }, this);
	  }
    },
    svarDone: function(svar) {
        if (!this._currentSVars) this._currentSVars = [];
        wm.Array.removeElement(this._currentSVars, svar);
        if (this._currentSVars.length == 0) this.hide();
    },
    svarStart: function(svar) {
        if (!this._currentSVars) this._currentSVars = [];
        this._currentSVars.push(svar);
        if (!this.showing) this.show();
    },    
    show: function() {
	this._getWidgetToCover();
	if (this.widgetToCover && this.widgetToCover instanceof wm.Control && !this.widgetToCover.isAncestorHidden()) {
	    this.inherited(arguments);
	}
    },
    setImage: function(inUrl) {
	var image = this.image = inUrl;
	if (!image) {
	    image =  dojo.moduleUrl("lib.images.common").toString() +  "loadingThrobber.gif";
	}
	this._setImage(image);
    },
    _setImage: function(inUrl) {

	if (!this._picture) {
	    this._picture = new wm.Picture({owner: this,
					    parent: this.containerWidget,
					    name: "loadingPicture",
					    source: inUrl,
					    width: this.imageWidth,
					    height: this.imageHeight});
	} else {
	    this._picture.setSource(inUrl);
	}
    },
    setImageWidth: function(inWidth) {
	this.imageWidth = inWidth;
	if (this._picture) {
	    this._picture.setWidth(inWidth);
	}
    },
    setImageHeight: function(inHeight) {
	this.imageHeight = inHeight;
	if (this._picture) {
	    this._picture.setHeight(inHeight);
	}
    },
    setCaption: function(inCaption) {
	this.caption = inCaption;
	if (!this.caption)
	    return;
	if (!this._label) {
	    this._label = new wm.Label(
		{
		    owner: this,
		    parent: this.containerWidget,
		    name: "loadingLabel",
		    width: this.captionWidth,
		    height: "20px",
		    caption: inCaption,
		    singleLine: false,
		    autoSizeHeight: true
		});
	} else {
	    this._label.setCaption(this.caption);
	}
    },
    setShowing: function(inShowing, forceChange, skipOnClose) {
	this.inherited(arguments);
	if (inShowing) {
	    this._getWidgetToCover();
	    if (this.widgetToCover) {
	    this.setMargin(this.widgetToCover.margin);
		var node = this.widgetToCover.domNode;
        if (window.getComputedStyle) {
        	var roundedStyle, roundedStyleTL,roundedStyleTR, roundedStyleBL, roundedStyleBR;
            var computedStyle = window.getComputedStyle(node);
		    roundedStyle = computedStyle.getPropertyValue("border-radius") || computedStyle.getPropertyValue("-webkit-border-radius") || computedStyle.getPropertyValue("-moz-border-radius") || computedStyle.getPropertyValue("-ms-border-radius") || computedStyle.getPropertyValue("-o-border-radius");
			if (roundedStyle) {
			    this.domNode.style.borderRadius = roundedStyle;
			    if (dojo.isWebKit) {
			    	this.domNode.style.WebkitBorderRadius = roundedStyle;
				} else if (dojo.isFF) {
				    this.domNode.style.MozBorderRadius = roundedStyle;
				}
    		} else { /* else clause required by IE10 which only lets us access the individual corners and not the total value */
    			this.domNode.style.borderTopLeftRadius= computedStyle.getPropertyValue("border-top-left-radius");
    			this.domNode.style.borderTopRightRadius= computedStyle.getPropertyValue("border-top-right-radius");
    			this.domNode.style.borderBottomLeftRadius= computedStyle.getPropertyValue("border-bottom-left-radius");
    			this.domNode.style.borderBottomRightRadius= computedStyle.getPropertyValue("border-bottom-right-radius");    			
    		}
			
		}
		var zindex = node.style.zIndex || 0;
		while (node.parentNode && node.parentNode.tagName != "BODY") {
		    node = node.parentNode;
		    if (node.style.zIndex) {
			zindex = Math.max(zindex,node.style.zIndex);
		    }
		}
		this.domNode.style.zIndex = zindex+1;
	    }
	}
    },
    _getWidgetToCover: function() {
	if (this.widgetToCover) {
	    if (dojo.isString(this.widgetToCover))
		this.widgetToCover = this.owner.getValueById(this.widgetToCover);
	}
	return this.widgetToCover;
    },
    renderBounds: function() {
	this._getWidgetToCover();
	if (this.widgetToCover) {
	    try {
	    var parentNode = this.widgetToCover.domNode.parentNode;
	    if (this.domNode.parentNode != parentNode)
		parentNode.appendChild(this.domNode);
	    var b = dojo.clone(this.widgetToCover.bounds);
		b.l -= this.widgetToCover.borderExtents.l;
		b.r += this.widgetToCover.borderExtents.r;
		b.w = b.r-b.l;
		b.t -= this.widgetToCover.borderExtents.t;
		b.b += this.widgetToCover.borderExtents.b;
		b.h = b.b-b.t;
	    this.setBounds(b);
	    wm.Control.prototype.renderBounds.call(this);
	    } catch(e) {}
	}
    }
});

