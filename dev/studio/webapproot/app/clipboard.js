/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
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

		var
			isLayer = (inClass == "wm.Layer"),
			p = inParent || this.findContainer(this.selected, inClass) || studio.page.root.findContainer(inClass);
			// FIXME: layer must be pasted only into layers
			// could also generalize beyond layers and intercept this in createComponents
			rp = wm.getClassProp(inClass, "_requiredParent");
		if (!p) {
			alert("Unable to paste.  All containers are either locked or frozen.");
			return;
		}
		if (isLayer && rp && !(p instanceof dojo.getObject(rp))) {
			wm.logging && console.debug("Must paste a layer into a layers.");
			return;
		}
		// start pasting: set global pasting flag
		wm.pasting = true;
		var comps = p.readComponents(inClip);
		this.refreshDesignTrees();
		this.page.reflow();
		var comp = comps.length && comps.pop();
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
		if (!c.deletionDisabled && (o == this.application || o == this.page) && c != this.page.root && !(c.isParentFrozen && c.isParentFrozen()) || (o==null)) {
			this.page.removeComponent(c);
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
