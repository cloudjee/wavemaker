/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
dojo.provide("wm.studio.app.clipboard");

Studio.extend({
	//=========================================================================
	// Clipboard
	//=========================================================================
	copyControl: function(inControl) {
		var c = inControl || this.designer.selected;
		if (!c)
			return;
		this.clipboard = c.serialize({styles: true});
		this.clipboardClass = c.declaredClass;
		this.updateCutPasteUi();
	},
	cutControl: function(inControl) {
		var c = inControl || this.designer.selected;
		if (!c)
			return;
		this.copyControl(c);
		this._deleteControl(c);
	},
	pasteControl: function(inParent) {
		if (this.clipboard)
			this._pasteControl(inParent, this.clipboard, this.clipboardClass);
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
		p = inParent || this.findContainer(this.selected, inClass) || studio.page.root.findContainer(inClass);
	    }

		/* This might happen if the wm.Layout is locked; something one might do for a composite perhaps... */
	    if (!p) {
		app.alert(studio.getDictionaryItem("ALERT_PASTE_FAILED_PANEL_LOCKED"))
		return;
	    }

		// start pasting: set global pasting flag
		wm.pasting = true;
		var comps = p.readComponents(inClip);
		var comp = comps.length && comps.pop();
	        if (comp)
	            for (var prop in newProps) comp.setProp(prop, newProps[prop]);
	        if (comp instanceof wm.Layer)
		    comp.parent._setLayerIndex(comp.getIndex());
		this.refreshDesignTrees();
		this.page.reflow();

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
