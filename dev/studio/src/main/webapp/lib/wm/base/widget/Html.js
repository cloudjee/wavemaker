/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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
	getHtml: function() {
		return this.domNode.innerHTML;
	},
	setHtml: function(inHtml) {
                var innerHTML = this.domNode.innerHTML;
	        if (inHtml && String(inHtml).indexOf('resources/') == 0)
		{
			if (!this.htmlLoader)
				this.htmlLoader = new wm.HtmlLoader({owner: this, relativeUrl: true});
			this.htmlLoader._htmlNode = this.domNode;
			this.htmlLoader.setUrl(inHtml);
			this.html = inHtml;
		        this.valueChanged("html", inHtml);
                        if ( innerHTML != this.domNode.innerHTML && (this.autoSizeHeight || this.autoSizeWidth)) {
		            this.scheduleAutoSize();
                        }
			return;
		}	
			
		if (inHtml && dojo.isArray(inHtml))
			inHtml = inHtml.join('');
		if (inHtml && inHtml.value)
			inHtml = inHtml.value;
		this.html = this.domNode.innerHTML = (inHtml == undefined ? "" : inHtml);
	        this.valueChanged("html", this.inHtml);
                if ( innerHTML != this.domNode.innerHTML && (this.autoSizeHeight || this.autoSizeWidth)) {
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

	    var divObj = wm.Label.sizingNode;
	    divObj.innerHTML = this.html
	    divObj.className = this.domNode.className;  // make sure it gets the same css selectors as this.domNode (we may need to handle ID as well, but most styling is done via classes)
	    var b = this.bounds;
  	    var s = divObj.style;
	    s.position = "absolute";
	    s.height = (!this.autoSizeHeight) ? (b.h - this.padBorderMargin.t - this.padBorderMargin.b) + "px" : "";
	    s.width = (!this.autoSizeWidth) ? (b.w - this.padBorderMargin.l - this.padBorderMargin.r) + "px" : "";

	    // If I have a 5px padding on the left or right, that will throw off the calculation unless we build that into our test div and force it to render with that as part of its width
	    s.paddingLeft = (this.autoSizeWidth) ?  (this.padBorderMargin.l + this.padBorderMargin.r) + "px" : "";
	    s.paddingTop = (this.autoSizeHeight) ?  (this.padBorderMargin.t + this.padBorderMargin.b) + "px" : "";

	    // wm.Label sets these, need to make sure they are unset for wm.Html
	    s.lineHeight = "normal";
	    s.whiteSpace = "";

	    // append to parent so that it gets the same css selectors as this.domNode.
	    this.parent.domNode.appendChild(divObj);

	    var captionWidth  = divObj.clientWidth;
	    var captionHeight = divObj.clientHeight;
	    divObj.parentNode.removeChild(divObj);

	    if (this.autoSizeHeight) {
		var newh =  captionHeight;
		if (newh < 14) newh = 14;
                if (setSize)
		    this.setHeight(newh + "px");
                else {
                    this.bounds.h = newh;
                    this.height = newh + "px";
                }
	    }
	    if (this.autoSizeWidth) {
		var neww = captionWidth;
		if (neww < 80) neww = 80;
                if (setSize)
		    this.setWidth(neww + "px");
                else {
                    this.bounds.w = neww;
                    this.width = neww + "px";
                }
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
	    this.domNode.innerHTML += (inHtml == undefined ? "" : inHtml);
	    this.html = this.domNode.innerHTML;
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
	makePropEdit: function(inName, inValue, inDefault) {
	    switch (inName) {
                case "autoSize": 
		    return makeSelectPropEdit(inName, (this.autoSizeHeight) ? "height" : (this.autoSizeWidth) ? "width" : "none", ["none", "width", "height"], inDefault);
		case "html":
		var wire = wm.data.getPropWire(this, "html");
		return makeTextPropEdit(inName, inValue, inDefault, 10, Boolean(wire));
	    }
	    return this.inherited(arguments);
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
    }
});

// design only...

wm.Html.description = "Container for any HTML content.";

wm.Object.extendSchema(wm.Html, {
	disabled: { ignore: 1 },
        autoSizeHeight: {type: "Boolean", group: "advanced layout", order: 31, writeonly: true, ignore: true},
    autoSizeWidth: {type: "Boolean", group: "advanced layout", order: 32, shortname: "Auto Size", writeonly: true, ignore: true},
    autoSize: {group: "advanced layout", order: 31},
        autoScroll: {group: "style", order: 100, ignore: 0},
    html: { type: "String", bindable: 1, group: "display", order: 100, focus: true },
    setHtml: {group: "method"}
});

wm.Html.extend({
        themeable: false
});