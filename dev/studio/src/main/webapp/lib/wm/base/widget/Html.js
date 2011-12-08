/*
 *  Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Html");

dojo.declare("wm.Html", wm.Control, {
    minHeight: 15,
    width: "100%",
    height: "200px",
	html: "",
        autoScroll: true,
	init: function() {
		dojo.addClass(this.domNode, "wmhtml");
		this.inherited(arguments);
	    this.connect(this.domNode, "onclick", this, function(evt) {
		wm.onidle(this, "onclick", evt);
	    });
	    this.setHtml(this.html);
	},
    build: function() {
	this.inherited(arguments);
	this.sizeNode = document.createElement("div");
	dojo.addClass(this.sizeNode, "wmSizeNode");
	this.domNode.appendChild(this.sizeNode);
    },
	getHtml: function() {
		return this.sizeNode.innerHTML;
	},
	setHtml: function(inHtml) {
                var innerHTML = this.sizeNode.innerHTML;
	        if (inHtml && String(inHtml).indexOf('resources/') == 0)
		{
			if (!this.htmlLoader)
				this.htmlLoader = new wm.HtmlLoader({owner: this, relativeUrl: true});
			this.htmlLoader._htmlNode = this.sizeNode;
			this.htmlLoader.setUrl(inHtml);
			this.html = inHtml;
		        this.valueChanged("html", inHtml);
                        if ( innerHTML != this.sizeNode.innerHTML && (this.autoSizeHeight || this.autoSizeWidth)) {
		            this.scheduleAutoSize();
                        }
			return;
		}	
			
		if (inHtml && dojo.isArray(inHtml))
			inHtml = inHtml.join('');
		if (inHtml && inHtml.value)
			inHtml = inHtml.value;
	    this.html = this.sizeNode.innerHTML = (inHtml == undefined ? "" : inHtml);
	        this.valueChanged("html", this.inHtml);
                if ( innerHTML != this.sizeNode.innerHTML && (this.autoSizeHeight || this.autoSizeWidth)) {
                    this.scheduleAutoSize();
                }
	},
    scheduleAutoSize: function() {
        this._needsAutoSize = true;
        return wm.job(this.getRuntimeId() + ": doAutoSize", 10,  dojo.hitch(this, function() {this.doAutoSize(true,true);}));
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

	appendHtml: function(inHtml) {
	    if (inHtml && dojo.isArray(inHtml))
		inHtml = inHtml.join('');
	    if (inHtml && inHtml.value)
		inHtml = inHtml.value;
	    this.sizeNode.innerHTML += (inHtml == undefined ? "" : inHtml);
	    this.html = this.sizeNode.innerHTML;
	    this.valueChanged("html", this.inHtml);
	},
	onclick: function() {
	},
        addUserClass: function(inClass, inNodeName) {
	    this.inherited(arguments);
	    if (this.isDesignLoaded())
                if (this.autoSizeHeight || this.autoSizeWidth)
	            this.doAutoSize(1,1);	
        },
    getAutoSize: function() {
	if (this.autoSizeWidth) return "width";
	if (this.autoSizeHeight) return "height";
	return "none";
    },
    /* This hack should only be called at design time */
    setAutoSize: function(inValue) {
        if (inValue == "none") {
	    if (this.autoSizeWidth)
		this.setAutoSizeWidth(false);
	    if (this.autoSizeHeight)
		this.setAutoSizeHeight(false);
        } else if (inValue == "width") {
	    if (!this.autoSizeWidth)
		this.setAutoSizeWidth(true);
	    if (this.autoSizeHeight)
		this.setAutoSizeHeight(false);

        } else if (inValue == "height") {
	    if (this.autoSizeWidth)
		this.setAutoSizeWidth(false);
	    if (!this.autoSizeHeight)
		this.setAutoSizeHeight(true);
        }
    },
    toHtml: function() {
	return this.html;
    }
});

