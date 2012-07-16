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

dojo.provide("wm.base.widget.Template");
dojo.require("wm.base.widget.Panel");

dojo.declare("wm.Template", wm.Panel, {
	layoutKind: "top-to-bottom",
    init: function() {
        this.readTemplate();
        if (!this.isDestroyed) {
            this.inherited(arguments);
        } else {
            throw "Template Created Successfully"; // abort the rest of this widget's lifecycle
        }
    },
    
    postInit: function() {
	    if (!this.isDestroyed) {
		this.inherited(arguments);
	    }
    },
    readTemplate: function() {
        if (this._template) {
            if (dojo.isObject(this._template)) this._template = dojo.toJson(this._template);
            var components = this.readComponents(this._template);
            if (this.destroyTemplate) {
                var index = this.getIndexInParent();
                dojo.forEach(components, dojo.hitch(this, function(c, i) {
                    if (c instanceof wm.Control && c instanceof wm.Dialog == false) {
                        c.setParent(this.parent);
                        c.setIndexInParent(index);
                    } 
                    if (c instanceof wm.Layout) {
                        while(c.c$.length > 0) {
                            c.c$[0].setParent(c.parent);
                        }
                        c.destroy();
                    }
                }));
                this.destroy();
            } else {
                /* Replace this with a panel so we don't need to include it in the build layers,
                 * the widget is still a wm.Tmeplate, but will be written to widgets.js as a Panel
                 */
                this.publishClass = this.declaredClass = "wm.Panel";
            }
        }
    },
    
        adjustChildProps: function(inCtor, inProps) {
	    if (wm.isClassInstanceType(inCtor, wm.Control))
                this.inherited(arguments);
            else
		dojo.mixin(inProps, {owner: this.owner});                
        }
});
wm.Template.extend({
    themeable: false,
    _noPaletteCopy: true,
    // block wm.Panel's afterPaletteDrop
    afterPaletteDrop: function() {
        wm.Container.prototype.afterPaletteDrop.call(this); 
	this.desktopHeight = this.height; // changed by Control_design.afterPaletteDrop
    }
});
wm.Template.description = "A set of built from a template.";
