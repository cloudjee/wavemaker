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

dojo.provide("wm.base.widget.Label_design");
dojo.require("wm.base.widget.Label");


// design only...
wm.Object.extendSchema(wm.Label, {
    disabled: { ignore: 1 },
    imageList: {ignore: 1},
    caption: { type: "String", bindable: 1, group: "display", order: 100, focus: true, doc: 1},
    display: { group: "format", order: 20 },
    align: { group: "display", order: 25, doc: 1 },
    singleLine: { group: "display", order: 200,doc: 1},
    format: { ignore: 1, writeonly: 1, categoryParent: "Properties", categoryProps: {component: "format"}},
    link: { type: "String", bindable: 1, group: "format", order: 40, doc: 1 },
    autoSizeHeight: {type: "Boolean", group: "advanced layout", order: 31, writeonly: true, ignore: true},
    autoSizeWidth: {type: "Boolean", group: "advanced layout", order: 32, writeonly: true, ignore: true},
    autoSize: {group: "advanced layout"},
    setAlign: {group: "method"},
    setCaption: {group: "method"},
    setSingleLine: {group: "method"},
    resizeToFit:{ group: "layout", order: 30 }
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
/*
	afterPaletteDrop: function() {
		this.caption = this.caption || this.name;
		this.renderLabel();
	},
	*/
	setDisplay: function(inDisplay) {
		if (this.display == inDisplay)
			return;
		this.display = inDisplay;
		var ctor = wm.getFormatter(this.display);
	        if (this.components.format)
		    this.components.format.destroy();

	    var funcName = this.generateEventName("onReadOnlyNodeFormat");
	    if (this.display == "Custom Function" || this.display == funcName) {
		this.display = funcName;
		eventEdit(this, "onFormat", funcName, this.owner == studio.application, "inValue");
	    } else {
		var ctor = wm.getFormatter(this.display);
		new ctor({name: "format", owner: this});
		this.renderLabel();
	    }
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
			case "formatter":
		                var funcName = this.generateEventName("onReadOnlyNodeFormat");
		                var customFunction = (this.formatter == funcName) ? funcName : "Custom Function";
		                return makeSelectPropEdit(inName, inValue, ["", customFunction].concat(wm.formatters), inDefault);


			case "resizeToFit":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
                        case "autoSize": 
		                return makeSelectPropEdit(inName, (this.autoSizeHeight) ? "height" : (this.autoSizeWidth) ? "width" : "none", ["none", "width", "height"], inDefault);
			case "align":
				return makeSelectPropEdit(inName, inValue, ["none", "left", "center", "right", "justify"], inDefault);
		}
		return this.inherited(arguments);
	},
    editProp: function(inName, inValue) {
	switch (inName) {
	case "resizeToFit":
	    var was = this.autoSizeWidth;
	    this.setAutoSizeWidth(true);
	    this.setAutoSizeWidth(was);
	    return;
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
            if (inValue) {
                this.setSingleLine(true);
            }
	    if (!this.autoSizeWidth)
		this.setAutoSizeWidth(true);
	    if (this.autoSizeHeight)
		this.setAutoSizeHeight(false);

        } else if (inValue == "height") {
            if (inValue) {
                this.setSingleLine(false);
            }
	    if (this.autoSizeWidth)
		this.setAutoSizeWidth(false);
	    if (!this.autoSizeHeight)
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
