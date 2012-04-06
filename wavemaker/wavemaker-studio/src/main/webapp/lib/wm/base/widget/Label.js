/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Label");
dojo.require("wm.base.widget.Formatters");

dojo.declare("wm.Label", wm.Control, {
	width: "200px",
	height: "24px",
	caption: 'Label',
	link: '',
	display: '',
	//resizeToFit: "(Resize to Fit)",
	padding: 4,
	singleLine: true,
	align: "none",
	init: function() {
	    dojo.addClass(this.domNode, "wmlabel");
	    this.inherited(arguments);
	    this.connect(this.domNode, "onclick", this, function(evt) {
		window.setTimeout(dojo.hitch(this, "click",evt), 5);
	    });

		// this.connectEvents(this.domNode, ["dblclick"]);  WAVEMAKER: Uncomment this if we find a good use for this...
	},
    build: function() {
	this.inherited(arguments);
	this.sizeNode = document.createElement("div");
	dojo.addClass(this.sizeNode, "wmSizeNode");
	this.domNode.appendChild(this.sizeNode);
    },
	click: function(e) {
		this.onclick(e);
	},
	/* Uncomment this if/when we find a good use for it
	dblclick: function(e) {
		this.ondblclick(e);
	},
	ondblclick: function(inEvent) {
	}, */
	postInit: function() {
		this.inherited(arguments);
		this.caption = this.label || this.content || this.caption;
		// bc
		delete this.content;
		delete this.label;
		this.renderLabel();
		this.valueChanged("caption", this.caption);
		this.valueChanged("link", this.link);
	    if (this.onclick != this.constructor.prototype.onclick) {
		dojo.addClass(this.domNode, "onClickEvent");
	    }
	},
	renderLabel: function() {
		if (this._loading)
			return;

	    var c = this.caption;
	    if (this.$.format) {
		c = this.$.format.format(c);
	    } else if (this.display && dojo.isFunction(this.owner[this.display])) {
		try {
		    c = this.owner[this.display](this, c);
		} catch(e) {
		    console.error("Formatter error in " + this.toString() + ": " + e);
		}
	    }

		if (this.link)
			c = ['<a ', (this.link.indexOf("#") == -1 && this.link.indexOf("javascript") == -1)? 'target="_blank" ' : '', 'href="', this.link, '">', c, '</a>'].join('');
		if (this.domNode.innerHTML != c)
			this.sizeNode.innerHTML = c;
		var whitespace = (this.singleLine || this.autoSizeWidth) ? "nowrap" : "normal";
		if (this.domNode.style.whiteSpace != whitespace)
		        this.domNode.style.whiteSpace = whitespace;
                var align = (this.align == "none") ? "" : this.align;
		if (this.domNode.style.textAlign != align)
			this.domNode.style.textAlign = align;
		//this.reflowParent();
		//this.doAutoSize();
	},
	setCaption: function(inCaption) {
	    if (inCaption == undefined) inCaption = "";
            var innerHTML = this.sizeNode.innerHTML;
	    if (inCaption && dojo.isArray(inCaption))
		inCaption = inCaption.join(', ');
	    else if (inCaption && dojo.isObject(inCaption))
		inCaption = "";
	    this.caption = inCaption;
	    this.renderLabel();
            if ( innerHTML != this.sizeNode.innerHTML && (this.autoSizeHeight || this.autoSizeWidth)) {
		this.scheduleAutoSize();
            }

	    /* Make it bindable */
	    this.valueChanged("caption", inCaption);
	},

    scheduleAutoSize: function() {
        this._needsAutoSize = true;
        return wm.job(this.getRuntimeId() + ": doAutoSize", 10,  dojo.hitch(this, function() {this.doAutoSize(true,false);}));
    },
        doAutoSize: function(setSize, force) {
            if (this._doingAutoSize || !this.autoSizeHeight && !this.autoSizeWidth) return;
	    if (!force && !this._needsAutoSize) return;

	    if (this.isAncestorHidden()) {
		return;
	    }

            this._doingAutoSize = true;
	    this._needsAutoSize = false;

	    var sizeNode = this.sizeNode;
	    var contentHeight = sizeNode.offsetHeight;
	    var contentWidth = sizeNode.offsetWidth;
	    if (this.autoSizeHeight) {
		var newHeight = contentHeight + this.padBorderMargin.t + this.padBorderMargin.b;
		if (newHeight < this.minHeight) {
		    newHeight = this.minHeight;
		} 

		/* Account for space needed for scrollbars */
		if (contentWidth > this.bounds.w) {
		    newHeight += 17;
		}
		    this.bounds.h = newHeight;
		    this.height = newHeight + "px";		
/*
		if (setSize) {
		    this.setHeight(newHeight + "px");
		} else {
		    this.bounds.h = newHeight;
		    this.height = newHeight + "px";
		}
		*/

		var p = this.parent;
		while (p.parent && (p.autoSizeHeight || p.fitToContentHeight)) {
		    p = p.parent;
		}
		p.delayedReflow();

	    }
	    if (this.autoSizeWidth) {

		var newWidth = contentWidth + this.padBorderMargin.l + this.padBorderMargin.r;
		/* Account for space needed for scrollbars */
		if (contentHeight > this.bounds.h) {
		    newWidth += 17;
		}
		    this.bounds.w = newWidth;
		    this.width = newWidth + "px";
/*
		if (setSize) {
		    this.setWidth(newWidth + "px");
		} else {
		    this.bounds.w = newWidth;
		    this.width = newWidth + "px";
		}
		*/
		var p = this.parent;
		while (p.parent && (p.autoSizeWidth || p.fitToContentWidth)) {
		    p = p.parent;
		}
		p.delayedReflow();
	    }


	    // the line underneath updates panel's width property. Therefore only required for studio.
	    if (this.isDesignLoaded() && studio.designer.selected == this)
		studio.inspector.reinspect();

            this._doingAutoSize = false;
	},
	setLink: function(inLink) {
	    var oldLink = this.link;
	    this.link = inLink;
	    this.renderLabel();
	    
	    /* Make it bindable */
	    this.valueChanged("link", inLink);
	},
	setSingleLine: function(inSingleLine) {
            var oldSingleLine = this.singleLine;
	    this.singleLine = inSingleLine;
            if (oldSingleLine != inSingleLine)
                this.domNode.style.lineHeight = (inSingleLine) ? this.bounds.h + "px" : "normal";
	    this.renderLabel();
	    if (inSingleLine && this.autoSizeHeight) 
		this.autoSizeHeight = false;

	    if (inSingleLine != oldSingleLine && (this.autoSizeHeight || this.autoSizeWidth)) {
		this.scheduleAutoSize();
            }
	},
	setAlign: function(inAlign) {
		this.align = inAlign;
	    	this.renderLabel();
	},
	formatChanged: function() {
		this.renderLabel();
	},
	onclick: function(inEvent) {
	},

    toHtml: function() {
	return "<div style='text-align:" + (this.align || "left") + ";' id='" + this.domNode.id + "'>" + (this.sizeNode.innerHTML) + "</div>";
    }
});

// NOTE: This sizing node is used by ALL classes that need a sizing node (wm.Html, wm.Base, etc...)
wm.Label.sizingNode = document.createElement("div");