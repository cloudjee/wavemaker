/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

dojo.provide("wm.studio.app.clipboard");

Studio.extend({
    //=========================================================================
    // Clipboard
    //=========================================================================
    copyControl: function(inControls) {
        var components= inControls || this.selected;
        if (!components || !components.length)
            return;

        this.clipboard = dojo.map(components, function(c) {  return c.serialize({});});
        this.clipboardClasses = dojo.map(components, function(c) {return c.declaredClass;});
        this.updateCutPasteUi();
    },
    cutControl: function(inControls) {
        var components = inControls || this.selected;
        if (!components || !components.length)
            return;
        new wm.DeleteTask({cutAction: true, components: components});
        this.copyControl(components);
        this._deleteControl(components);
    },
    pasteControl: function(inParent) {
        if (!inParent) inParent = studio.selected[0];
        while (inParent && (inParent instanceof wm.Container === false || wm.isInstanceType(inParent, [wm.PageContainer, wm.Composite])) && inParent.parent) inParent = inParent.parent;
        /* If we are pasting into a wm.Layers, and ANY of the components being pasted is not a wm.Layer, then generate a wm.Layer to
         * put them all in
         */
         var altParent = inParent;
        if (inParent instanceof wm.Layers && this.clipboard.length > 1 &&
            dojo.some(this.clipboardClasses, function(inClassName) {
                var ctor = dojo.getObject(inClassName);
                return inClassName !=  "wm.Layer" && ctor.prototype instanceof wm.Control;
            }))
        {
            altParent = inParent.addLayer("Pasted Layer");
        }
        var components = [];
        if (this.clipboard) {
            dojo.forEach(this.clipboard, function(clip, i) {
                var c;
                var p = inParent;
                var ctor = dojo.getObject(this.clipboardClasses[i]);
                var prototype = (ctor) ? ctor.prototype : null;
                if (inParent instanceof wm.Layers && prototype instanceof wm.Layer) {
                    p = altParent;
                } else if (prototype instanceof wm.Dialog) {
                    p = null;
                } else if (prototype instanceof wm.Control === false) {
                    p = null; // nonvisual components
                }
                c = this._pasteControl(p, clip, this.clipboardClasses[i]);
                if (c) components.push(c);
            }, this);
            new wm.AddTask(components);
        }
        this.select(components);

    },

    /* TODO: Need to examine the class of EACH widget, and treat it appropriately, can't just do the tests if there is only one class */
    _pasteControl: function(inParent, inClip, inClass, noRefresh) {
        this.renamedDuringPaste = {}; // set in Component.js.createComponent()
        var p;
        var rootPasteCtor = dojo.getObject(inClass);
        var newProps = {}; /* If its a dialog or fancy panel, paste into its containerWidget */
        if (inParent instanceof wm.Dialog || inParent instanceof wm.FancyPanel) {
            p = studio.selected.containerWidget;
        }

        /* If pasting into a wm.Layers, then either paste in the new layer or paste the contents into the active layer */
        else if (inParent instanceof wm.Layers) {
            if (inClass != "wm.Layer") {
                p = inParent.getActiveLayer();
            } else {
                p = inParent;
            }
        } else { /* Else we are NOT pasting into a wm.Layers; so if we have a wm.Layer, replace it with a wm.Panel */
            if (inClass == "wm.Layer") {
                inClip = inClip.replace(/\["(.*?)"/, "[\"wm.Panel\"");
                newProps.width = "100%";
                newProps.height = "100%";
            }

            // findContainer will not return a locked panel
            if (rootPasteCtor.prototype instanceof wm.Control) p = inParent || this.findContainer(inParent, inClass) || studio.page.root.findContainer(inClass);

            if (rootPasteCtor.prototype instanceof wm.Dialog) p = studio.page;

        }


    /* This might happen if the wm.Layout is locked; something one might do for a composite perhaps... */
    if (!p && rootPasteCtor.prototype && rootPasteCtor.prototype instanceof wm.Control) {
        app.alert(studio.getDictionaryItem("ALERT_PASTE_FAILED_PANEL_LOCKED"))
        return;
    }

    // start pasting: set global pasting flag
    wm.pasting = true;
    if (p) {
        var comps = p.readComponents(inClip);
    } else {
        var inClipStruct = dojo.fromJson(inClip);
        var comps = studio.page.createComponents(inClipStruct);
    }
    var comp = comps.length && comps.pop();
    if (comp) for (var prop in newProps) comp.setProp(prop, newProps[prop]);
    if (comp instanceof wm.Layer) comp.parent._setLayerIndex(comp.getIndex());
    if (!noRefresh) this.refreshDesignTrees();
    if (rootPasteCtor.prototype instanceof wm.Control) {
	var d = comp.getParentDialog();
        if (d) {
            d.reflow();
        } else {
	    this.page.reflow();
        }
    }

    this.updateEventsForRenamedComponents();
    this.renamedDuringPaste = {}; // clean up memory usage/unneeded pointers
    // done pasting: set global pasting flag
    wm.pasting = false;
    return comp;
    },
    updateEventsForRenamedComponents: function() {

            var renamed = this.renamedDuringPaste;
            for (var i in renamed) {
                var comp = renamed[i];
                for (var event in comp.eventBindings) {
                    var isFunction = !Boolean(comp.owner.getValue(event));
                    var isFunctionForOldCopy = comp.eventBindings[event] == i + wm.capitalize(event.replace(/^on/,""));
                    // create a copy of this function if its a function...
                    if (isFunction && isFunctionForOldCopy) {
                        var oldname = comp.eventBindings[event];
                        var newname = oldname.replace(new RegExp("^" + i), comp.name);
                        eventCopy(wm.isInstanceType(comp.owner, wm.Application) ? studio.appsourceEditor : studio.editArea, oldname, newname);
                        comp.eventBindings[event] = newname;
                    }
                }

            }
        },
    //undoDeleteStack: [],
    deleteControl: function() {
        new wm.DeleteTask();
    },
    _deleteControl: function(inControls){
        var select;
        dojo.forEach(inControls, function(c) {
            var p = c.parent;
            var o = c.owner;
            if (!select) select = p;
        // FIXME: remove o check to delete sub-components.
        if (!c.deletionDisabled && (o == this.application || o == this.page || o instanceof wm.TypeDefinition) && c != this.page.root && !(c.isParentFrozen && c.isParentFrozen()) || (o==null)) {
                (o || studio.page).removeComponent(c);
            this.inspector.inspected = null;
            c.destroy();
            wm.fire(p, "reflow");
            this.removeComponentFromTree(c);
        } else {
            console.debug('cannot delete subcomponent');
        }
    },this);
        if (select && !select.isDestroyed) {
            this.select(select);
        } else {
            this.select(studio.page.root);
        }
        return true;
    }

});
