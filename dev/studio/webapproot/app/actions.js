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
dojo.provide("wm.studio.app.actions");

dojo.declare("wm.Action", null, {
	constructor: function(inProps) {
		dojo.mixin(this, inProps);
	},
	perform: function() {
		if (!this.disabled)
			this._perform();
	}
});

new wm.Action({
	name: "toggleBox",
	_perform: function() {
		var s = studio.selected;
		if (s) {
			s.setBox(s.box == "h" ? "v" : "h");
			inspect(s);
		}
	}
});

wm.undo = {
	stack: [],
	push: function(inTask) {
		if (inTask)
			this.stack.push(inTask);
		this.updateUi();
	},
	pop: function() {
		if (this.stack.length)
			this.stack.pop().undo();
		this.updateUi();
	},
	clear: function() {
		this.stack = [];
		this.updateUi();
	},
	canUndo: function() {
		return Boolean(this.stack.length);
	},
	updateUi: function() {
		var task = this.stack[this.stack.length-1];
		studio.undoBtn.setDisabled(!task);
		if (task)
			studio.undoBtn.setHint("Undo " + task.hint);
	}
};

dojo.declare("wm.ComponentTaskMixin", null, {
	component: null,
	componentRootId: "",
	getComponent: function() {
		if (this.component) {
			// note: components owned by studio.application are not in app.
		  var o;
		    if (this.component.owner && (
                        this.component.owner == studio.application ||
		            this.component.owner.app ==  studio.application ||
			    this.component.owner.owner == studio.application)) {
		    o = studio.application;
		  } else {
		    o = app;
		  }
		  return o.getValueById(this.componentRootId + this.component.getId());
		}
	},
	setComponent: function(inComponent) {
		this.component = inComponent;
		this.componentRootId = inComponent.getRootId();
	},
	clearComponent: function() {
		this.component = null;
	}
});

dojo.declare("wm.DeleteTask", wm.ComponentTaskMixin, {
	hint: "Delete Component",
	constructor: function() {
		var comp = studio.selected;
		if (!comp)
			return;
		this.setComponent(comp);
		this.hint = "Delete " + comp.declaredClass.split(".").pop();
		this.clip = comp.serialize({styles: true});
		this.classType = comp.declaredClass;
		this.owner = comp.owner;
		this.isWidget = comp instanceof wm.Widget;
		this.parent = comp.parent;
		this.redo();
	},
	cachePlacement: function() {
		var comp = this.getComponent();
		// FIXME: nearly duped from code in Designer.js
		this.originalTarget = comp.parent;
		this.originalRect = dojo.marginBox(comp.domNode);
		// FIXME: PITA, find the next sibling that actually participates in layout
	    if (this.originalTarget)
		this.originalSibling = this.originalTarget.container && this.originalTarget.nextSibling(comp);
	},
	restorePlacement: function() {
		studio.designer.replace(this.getComponent(), this.originalTarget, this.originalRect, this.originalSibling);
	},
	redo: function() {
		if (this.isWidget)
			this.cachePlacement();
		if (studio._deleteControl(this.getComponent())) {
			this.clearComponent();
			wm.undo.push(this);
		}
	},
	undo: function() {
		var p = this.isWidget ? (this.parent.owner ? this.parent : null) : this.owner;
		var c = studio._pasteControl(p, this.clip, this.classType);
		this.setComponent(c);
		if (this.isWidget)
			this.restorePlacement();
		// FIXME: think we need to do this, but its' slow because pasteControl is doing it
		//studio.refreshDesignTrees();
	}
});

dojo.declare("wm.DropTask", wm.ComponentTaskMixin, {
	hint: "Drop Component",
	constructor: function(inComponent) {
		this.setComponent(inComponent);
		// abort if this is really an AddTask
		//if (this.component._draggedFromPalette)
		//	return;
		this.hint = "Drop " + inComponent.declaredClass.split(".").pop();
		this.bounds = dojo.marginBox(inComponent.domNode);
		var t = inComponent.parent;
		this.targetId = inComponent.parent.getRuntimeId();
		var sib = t.nextSibling(inComponent)
		this.siblingId = sib && sib.getRuntimeId();
		wm.undo.push(this);
	},
	undo: function() {
		studio.select(null);
		var t = app.getValueById(this.targetId);
		var sib = app.getValueById(this.siblingId);
		var c = this.getComponent();
		studio.designer.replace(c, t, this.bounds, sib);
		studio.refreshDesignTrees();
		studio.select(this.getComponent());
	}
});

dojo.declare("wm.AddTask", wm.ComponentTaskMixin, {
	hint: "Add Component",
	constructor: function(inComponent) {
		this.setComponent(inComponent);
		this.hint = "Add " + inComponent.declaredClass.split(".").pop();
		wm.undo.push(this);
	},
	undo: function() {
		studio._deleteControl(this.getComponent());
	}
});
