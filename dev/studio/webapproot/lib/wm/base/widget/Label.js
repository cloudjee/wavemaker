/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
dojo.provide("wm.base.widget.Label");
dojo.require("wm.base.widget.Formatters");

dojo.declare("wm.Label", wm.Control, {
	width: "200px",
	height: "24px",
	caption: '',
	link: '',
	display: '',
	format: '(details)',
	//resizeToFit: "(Resize to Fit)",
	padding: 4,
	singleLine: true,
	align: "none",
	init: function() {
		dojo.addClass(this.domNode, "wmlabel");
		this.inherited(arguments);
		this.connectEvents(this.domNode, ["click"]);            
		// this.connectEvents(this.domNode, ["dblclick"]);  WAVEMAKER: Uncomment this if we find a good use for this...
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
		if (!this.$.format)
			new wm.DataFormatter({name: "format", owner: this});
		this.caption = this.label || this.content || this.caption;
		// bc
		delete this.content;
		delete this.label;
		this.renderLabel();
		this.valueChanged("caption", this.caption);
		this.valueChanged("link", this.link);
	},
	renderLabel: function() {
		if (this._loading)
			return;
		var c = this.$.format.format(this.caption);
		if (this.link)
			c = ['<a ', (this.link.indexOf("#") == -1 && this.link.indexOf("javascript") == -1)? 'target="_blank" ' : '', 'href="', this.link, '">', c, '</a>'].join('');
		if (this.domNode.innerHTML != c)
			this.domNode.innerHTML = c;
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
            var innerHTML = this.domNode.innerHTML;
	    if (inCaption && dojo.isArray(inCaption))
		inCaption = inCaption.join(', ');
	    else if (inCaption && dojo.isObject(inCaption))
		inCaption = "";
	    this.caption = inCaption;
	    this.renderLabel();
            if ( innerHTML != this.domNode.innerHTML && (this.autoSizeHeight || this.autoSizeWidth)) {
		this.scheduleAutoSize();
            }
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

	    var divObj = wm.Label.sizingNode;
	    divObj.innerHTML = this.caption;
	    divObj.className = this.domNode.className;  // make sure it gets the same css selectors as this.domNode (we may need to handle ID as well, but most styling is done via classes)
	    var b = this.bounds;
  	    var s = divObj.style;
	    s.position = "absolute";
	    s.height = (!this.autoSizeHeight) ? (b.h - this.padBorderMargin.t - this.padBorderMargin.b) + "px" : "";
	    s.width = (!this.autoSizeWidth) ? (b.w - this.padBorderMargin.l - this.padBorderMargin.r) + "px" : "";

	    // If I have a 5px padding on the left or right, that will throw off the calculation unless we build that into our test div and force it to render with that as part of its width
	    s.paddingLeft = (this.autoSizeWidth) ?  (this.padBorderMargin.l + this.padBorderMargin.r) + "px" : "";
	    s.paddingTop = (this.autoSizeHeight) ?  (this.padBorderMargin.t + this.padBorderMargin.b) + "px" : "";

	    // singleLine disabled if autoSizeHeight
	    s.lineHeight = (this.singleLine || this.autoSizeWidth) ? b.h + "px" : "normal";
	    s.whiteSpace = (this.singleLine || this.autoSizeWidth) ? "nowrap" : "";

	    // append to parent so that it gets the same css selectors as this.domNode.
	    this.parent.domNode.appendChild(divObj);

	    var captionWidth  = divObj.clientWidth;
	    var captionHeight = divObj.clientHeight;
	    divObj.parentNode.removeChild(divObj);

	    if (this.autoSizeHeight) {
		var newh = captionHeight;
                var minHeight = this.getMinHeightProp();
		if (newh < minHeight) newh = minHeight;
                if (setSize)
                    this.setHeight(newh + "px");
                else {
		    this.bounds.h = newh;
		    this.height = newh + "px";
		}
	    }
	    if (this.autoSizeWidth) {
		var neww = captionWidth;
                var minWidth = this.getMinWidthProp();
		if (neww < minWidth) neww = minWidth;
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
	setLink: function(inLink) {
		this.link = inLink;
		this.renderLabel();
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
	}
});

// design only...
wm.Object.extendSchema(wm.Label, {
    disabled: { ignore: 1 },
    caption: { type: "String", bindable: 1, group: "display", order: 100, focus: true },
    display: { group: "format", order: 20 },
    align: { group: "display", order: 25 },
    singleLine: { group: "display", order: 200 },
    format: { ignore: 1, writeonly: 1, categoryParent: "Properties", categoryProps: {component: "format"}},
    link: { type: "String", bindable: 1, group: "format", order: 40 },
    autoSizeHeight: {type: "Boolean", group: "advanced layout", order: 31, writeonly: true, ignore: true},
    autoSizeWidth: {type: "Boolean", group: "advanced layout", order: 32, shortname: "Auto Size"}
    //resizeToFit:{ group: "layout", order: 30 }
});

wm.Label.description = "A simple label.";

wm.Label.extend({
        themeable: false,
	designCreate: function() {
		// if this is being created in studio, supply a default caption
		if (this._studioCreating)
			this.studioCreate();
		this.inherited(arguments);
	},
	afterPaletteDrop: function() {
		this.caption = this.caption || this.name;
		this.renderLabel();
	},
	setDisplay: function(inDisplay) {
		if (this.display == inDisplay)
			return;
		this.display = inDisplay;
		var ctor = wm.getFormatter(this.display);
		this.components.format.destroy();
		new ctor({name: "format", owner: this});
		this.renderLabel();
	},
/*
	resizeLabel: function(){
		var divObj = dojo.doc.createElement('span');
		divObj.innerHTML = this.caption;
		divObj.style.padding = '5px';
		document.body.appendChild(divObj);
		var coords = dojo.coords(divObj);
		var captionWidth = coords.w;
		divObj.parentNode.removeChild(divObj);
		this.setWidth(captionWidth + 'px');
		// the line underneath updates panel's width property. Therefore only required for studio.
		if (this.isDesignLoaded())
			setTimeout(dojo.hitch(studio.inspector, "reinspect"), 100); 		
	},
        */
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "display":
				return makeSelectPropEdit(inName, inValue, [""].concat(wm.formatters), inDefault);
/*
			case "resizeToFit":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
                                */
                        case "autoSizeWidth": 
		                return makeSelectPropEdit(inName, (this.autoSizeHeight) ? "height" : (this.autoSizeWidth) ? "width" : "none", ["none", "width", "height"], inDefault);
			case "align":
				return makeSelectPropEdit(inName, inValue, ["none", "left", "center", "right", "justify"], inDefault);
		}
		return this.inherited(arguments);
	},

    /* This hack should only be called at design time */
    setAutoSizeWidth: function(inValue) {
        if (inValue == "none") {
            wm.Control.prototype.setAutoSizeWidth.call(this, false);
            this.setAutoSizeHeight(false);
        } else if (inValue == "width") {
            if (inValue) {
                this.setSingleLine(true);
            }
            this.setAutoSizeHeight(false);
            wm.Control.prototype.setAutoSizeWidth.call(this, true);
        } else if (inValue == "height") {
            if (inValue) {
                this.setSingleLine(false);
            }
            wm.Control.prototype.setAutoSizeWidth.call(this, false);
            this.setAutoSizeHeight(true);
        }
    },

    // Any time the user changes the class for the label, recalculate autosize with the new styleing which may include font size changes	
    addUserClass: function(inClass, inNodeName) {
	this.inherited(arguments);
        if (this.autoSizeHeight || this.autoSizeWidth) {
	    this.scheduleAutoSize();
        }
    }
});

// NOTE: This sizing node is used by ALL classes that need a sizing node (wm.Html, wm.Base, etc...)
wm.Label.sizingNode = document.createElement("div");