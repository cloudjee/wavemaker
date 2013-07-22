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



dojo.provide("wm.base.widget.Container_design");
dojo.require("wm.base.widget.Container");
dojo.require("wm.base.Control_design");

wm.Object.extendSchema(wm.Container, {
    /* Display group; layout subgroup */
/*
    layoutKind:         {group: "display", subgroup: "layout", order: 100, options: ["top-to-bottom","left-to-right","fluid"], requiredGroup: true},
    horizontalAlign:    {group: "display", subgroup: "layout", order: 110, options: ["left","center","right"]},
    verticalAlign:      {group: "display", subgroup: "layout", order: 120, options: ["top","middle","bottom"]},
    */
    fitToContentWidth:  {group: "display", subgroup: "layout", order: 150, shortname: "Auto Width", type: "Boolean", advanced: true},
    fitToContentHeight: {group: "display", subgroup: "layout", order: 151, shortname: "Auto Height", type: "Boolean", advanced: true},
    resizeToFit:        {group: "display", subgroup: "layout", order: 152, operation: true, doNotPublish:1, shortname: "Resize to Fit"},

    layoutKind:         {group: "display", subgroup: "panel", order: 100, options: ["top-to-bottom","left-to-right"], requiredGroup: true},
    horizontalAlign:    {group: "display", subgroup: "panel", order: 110, options: ["left","center","right"]},
    verticalAlign:      {group: "display", subgroup: "panel", order: 120, options: ["top","middle","bottom"]},


    /* Display group; scrolling subgroup */
    autoScroll: {writeonly: 0},
/*    touchScrolling: {group: "display", subgroup: "scrolling", order: 103, ignore: 0, advanced: true, ignore:1}, // now just uses autoScroll*/

    /* Style group */
    //themeStyleType: {ignore: true, group: "style", order: 20, options: ["", "MainContent", "EmphasizedContent", "HeaderContent"]},
    themeStyleType: {ignore: true, group: "style", order: 20, options: ["", "MainContent", "EmphasizedContent", "HeaderContent"]},

    /* Custom methods group */
    customGetValidate:     {group: "customMethods", advanced:1},

    /* BindSource properties that are not readable/writable */
    invalid: { ignore: 1, bindSource: 1, readonly: 1, type: "Boolean" },
    isDirty: { ignore: 1, bindSource: 1, readonly: 1, type: "Boolean" },

    /* Display group; misc subgroup */
    lock:   {group: "display", subgroup: "panel", order: 2000, type: "Boolean", advanced:1, doNotPublish:1 },
    freeze: {group: "display", subgroup: "panel", order: 2001, type: "Boolean", advanced:1, doNotPublish:1 },

    /* Methods group */
    setThemeStyleType: {method:1},
    getThemeStyleType: {method:1, returns: "String"},
    reflow: {method:1},
    getInvalidWidget: {method:1, returns: "wm.Control"},
    setHorizontalAlign:    {method:1},
    setVerticalAlign:      {method:1},
    clearData: {method:1},
    resetData: {method:1},
    clearDirty: {method:1},
    setBestWidth: {method:1},
    setBestHeight:{method:1},


    /* Ignored group */
    hint: {ignore:true},
    fitToContent:       {ignore: true},
    box: { ignore: 1 },
    boxPosition: { ignore: 1}
});


wm.Container.extend({
    // backward-compatibility fixups
    afterPaletteDrop: function() {
        this.inherited(arguments);
        if(this.verticalAlign == "justified") this.verticalAlign = "top";
        if(this.horizontalAlign == "justified") this.horizontalAlign = "left";
    },

    listProperties: function() {
        var p = this.inherited(arguments);
        p.freeze.ignoretmp = this.schema.freeze.ignore || this.getLock();
        p.resizeToFit.ignoretmp = this.percEx && this.percEx.w && this.percEx.h || this.fitToContent;
        p.minWidth.ignoretmp = !this.schema.minWidth || this.schema.minWidth.ignore || (!this._percEx.w && !this.fitToContentWidth); // minWidth only applies if width is % or autosize is on
        p.minHeight.ignoretmp = !this.schema.minHeight || this.schema.minHeight.ignore || (!this._percEx.h && !this.fitToContentHeight); // minWidth only applies if width is % or autosize is on
        return p;
    },
    writeChildren: function(inNode, inIndent, inOptions) {
        var s = [];
        wm.forEach(this.getOrderedWidgets(), function(c) {
            if(wm.isDesignable(c) && !c.flags.notStreamable) s.push(c.write(inIndent, inOptions));
        });
        return s;
    },
    suggestDropRect: function(inControl, ioInfo) {
        this.layout.suggest(this, inControl, ioInfo);
    },
    suggestSize: function(inControl, ioInfo) {
        this.layout.suggestSize(this, inControl, ioInfo);
    },
    designMoveControl: function(inControl, inDropInfo) {
        info = {
            l: inDropInfo.l,
            t: inDropInfo.t,
            i: inDropInfo.i
        };
        var container = this.containerWidget || this;
        if(inControl.parent == container) {
            // inDropInfo.index 'i' may be counting inControl
            var indexInParent = inControl instanceof wm.Layer ? inControl.getIndex() : inControl.getIndexInParent();
            container.moveControl(inControl, info.i > indexInParent ? info.i - 1 : info.i || 0);
        } else {
            var p = inControl.parent;
            inControl.setParent(container);
            if(inControl.designWrapper) inControl.designWrapper.controlParentChanged();
            // inDropInfo.index 'i' is never counting inControl
            container.removeControl(inControl);
            container.insertControl(inControl, info.i || 0);
            if(p) p.reflow();
        }
        if(container.layout.insert) {
            container.layout.insert(container, inControl, inDropInfo);
            //return;
        }
        container.reflow();
    },

    set_height: function(inHeight) {
        if(this.fitToContentHeight && !this._inDesignResize) {
            app.confirm(studio.getDictionaryItem("wm.Container.CONFIRM_DISABLE_FIT_TO_CONTENT_HEIGHT"), false, dojo.hitch(this, function() {
                this.fitToContentHeight = false;
                wm.Control.prototype.set_height.call(this, inHeight);
                studio.reinspect();
            }));
        } else {
            this.inherited(arguments);
        }
    },
    set_width: function(inWidth) {
        if(this.fitToContentWidth && !this._inDesignResize) {
            app.confirm(studio.getDictionaryItem("wm.Container.CONFIRM_DISABLE_FIT_TO_CONTENT_WIDTH"), false, dojo.hitch(this, function() {
                this.fitToContentWidth = false;
                this.setWidth(inWidth);
                studio.reinspect();                
            }));
        } else {
            this.setWidth(inWidth);
        }
    },
    resizeToFit: function() {
    	var w = this.width;
    	var h = this.height;
        this.designResizeForNewChild("left-to-right", true);
        this.designResizeForNewChild("top-to-bottom", true);
        this._inDesignResize = true;

        var changed = false;
        if (!this._percEx.h && this.height != h) {
        	this.set_height(this.bounds.h + "px"); // design version handles mobileHeight vs desktopHeight
        	changed = true;
        }
        if (!this._percEx.w && this.width != w) {
        	this.setWidth(this.bounds.w + "px");
        	changed = true;
        }
		if (!changed && (this._percEx.w || this._percEx.h)) {
			app.toastWarning(studio.getDictionaryItem("wm.Container.RESIZE_TO_FIT_PERCENT_SIZE"));
		}
        delete this._inDesignResize;
    },
    resizeUpdate: function(inBounds) {
        // update the boundary rectangle highlight only
        this.designWrapper._setBounds(inBounds);
    },
    designResizeForNewChild: function(layoutKind, reduceSize) {
        if(this.owner != studio.page) return;
        if(!this.autoScroll && !this.scrollX && !this.scrollY && !this.fitToContent) {
            if(!layoutKind) {
                layoutKind = this.layoutKind;
            }
            if(layoutKind == "left-to-right") {
                var preferredWidth = this.getPreferredFitToContentWidth();
                var width = this.bounds.w;
                if(preferredWidth > width) {
                    if(!this._percEx.w) {
                        this.setWidth(preferredWidth + "px");
                    } else {
                        if(this.parent && this.parent instanceof wm.Layout == false) {
                            this.parent.designResizeForNewChild(layoutKind);
                        }
                    }
                } else if(reduceSize && !this._percEx.w) {
                    this.setWidth(preferredWidth + "px");
                }
            } else {
                var preferredHeight = this.getPreferredFitToContentHeight();
                var height = this.bounds.h;
                if(preferredHeight > height) {
                    if(!this._percEx.h) {
                        this.set_height(preferredHeight + "px");
                    } else {
                        if(this.parent && this.parent instanceof wm.Container && this.parent instanceof wm.Layout == false) {
                            this.parent.designResizeForNewChild(layoutKind);
                        }
                    }
                } else if(reduceSize && !this._percEx.h) {
                    this.set_height(preferredHeight + "px");
                }


            }
        }
    },
    // FIXME: design only? vestigal?
    findContainer: function(inType) {
        if(!this.lock) {
            if(this.freeze || !this.isWidgetTypeAllowed(inType)) {
                for(var i in this.widgets) {
                    var w = this.widgets[i];
                    if(w.container) {
                        var r = w.findContainer(inType);
                        if(r) return r;
                    }
                }
            } else {
                return this;
            }
        }
    },

    _end: 0

});
