/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
	copyControl: function(inControl) {
		var c = inControl || this.designer.selected || this.selected;
		if (!c)
			return;
		this.clipboard = c.serialize({styles: true});
		this.clipboardClass = c.declaredClass;
		this.updateCutPasteUi();
	},
	cutControl: function(inControl) {
		var c = inControl || this.designer.selected || this.selected
		if (!c)
			return;
	        new wm.DeleteTask({cutAction: true});
		this.copyControl(c);
		this._deleteControl(c);
	},
	pasteControl: function(inParent) {
	    if (this.clipboard) {
		var comp = this._pasteControl(inParent, this.clipboard, this.clipboardClass);
		new wm.AddTask(comp);
	    }
	},
        _pasteControl: function(inParent, inClip, inClass) {
            this.renamedDuringPaste =  {}; // set in Component.js.createComponent()

	    var p;
	    var rootPasteCtor = dojo.getObject(inClass);
	    var newProps = {};
	    /* If its a dialog or fancy panel, paste into its containerWidget */
	    if (studio.selected instanceof wm.Dialog || studio.selected instanceof wm.FancyPanel) {
		p = studio.selected.containerWidget;
	    }

	    /* If pasting into a wm.Layers, then either paste in the new layer or paste the contents into the active layer */
	    else if (studio.selected instanceof wm.Layers) {
		if (inClass != "wm.Layer") {
		    p = studio.selected.getActiveLayer();
		} else {
		    p = studio.selected;
		}
	    } else {
		/* Else we are NOT pasting into a wm.Layers; so if we have a wm.Layer, replace it with a wm.Panel */
		if (inClass == "wm.Layer") { 
		    inClip = inClip.replace(/\["(.*?)"/, "[\"wm.Panel\"");
		    newProps.width = "100%";
		    newProps.height = "100%";
		}

		// findContainer will not return a locked panel
		if (rootPasteCtor.prototype instanceof wm.Control)
		    p = inParent || this.findContainer(this.selected, inClass) || studio.page.root.findContainer(inClass);
	    }

		/* This might happen if the wm.Layout is locked; something one might do for a composite perhaps... */
	    if (!p && rootPasteCtor.prototype instanceof wm.Control) {
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
	        if (comp)
	            for (var prop in newProps) comp.setProp(prop, newProps[prop]);
	        if (comp instanceof wm.Layer)
		    comp.parent._setLayerIndex(comp.getIndex());
		this.refreshDesignTrees();
                if (rootPasteCtor.prototype instanceof wm.Control) {
		    this.page.reflow();
		}
		this.select(comp);

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
	_deleteControl: function(inControl){
		var c = inControl, p = c.parent, o = c.owner;
		// FIXME: remove o check to delete sub-components.
		if (!c.deletionDisabled && (o == this.application || o == this.page || o instanceof wm.TypeDefinition) && c != this.page.root && !(c.isParentFrozen && c.isParentFrozen()) || (o==null)) {
		        (o || studio.page).removeComponent(c);
			this.inspector.inspected = null;
			c.destroy();
			wm.fire(p, "reflow");
			this.select(p || studio.page.root);
			this.removeComponentFromTree(c);
			return true;
		} else {
			console.debug('cannot delete subcomponent');
		}
	}
});
