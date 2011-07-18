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
		    studio.undoBtn.setHint(studio.getDictionaryItem("UNDO_MOUSEOVER_HINT", {hint: task.hint}));
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
	constructor: function(inProps) {	    
		var comp = studio.selected;
		if (!comp)
			return;
		this.setComponent(comp);
	        this.hint = studio.getDictionaryItem("UNDO_DELETE_HINT", {className: comp.declaredClass.split(".").pop()});
		this.clip = comp.serialize({styles: true});
		this.classType = comp.declaredClass;
		this.owner = comp.owner;
		this.isWidget = comp instanceof wm.Widget;
		this.parent = comp.parent;
	        this.redo(inProps && inProps.cutAction);
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
	redo: function(cutAction) {
		if (this.isWidget)
			this.cachePlacement();
	    /* Don't delete here if its a cut action, but we still want to push this onto the undo stack */
		if (cutAction || studio._deleteControl(this.getComponent())) {
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
	        this.hint = studio.getDictionaryItem("UNDO_DROP_HINT", {className: inComponent.declaredClass.split(".").pop()});
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
	        this.hint = studio.getDictionaryItem("UNDO_ADD_HINT", {className: inComponent.declaredClass.split(".").pop()});
		wm.undo.push(this);
	},
	undo: function() {
		studio._deleteControl(this.getComponent());
	}
});

/* WARNING: There is also a wm.SetPropTask in propertyEdit.js for undoing the specialized property editors */
dojo.declare("wm.PropTask", wm.ComponentTaskMixin, {
	hint: "Property Change",
        constructor: function(inComponent,inPropName, oldValue) {
	    this.setComponent(inComponent);
	    this.propertyName = inPropName;
	    this.oldValue = oldValue;
	    if (inPropName == "bounds") {
		this.hint = studio.getDictionaryItem("UNDO_PROP_HINT", {propName: "width/height", oldValue: "width:" + this.oldValue.w + ", height: " + this.oldValue.h});
	    } else {
		this.hint = studio.getDictionaryItem("UNDO_PROP_HINT", {propName: this.propertyName, oldValue: this.oldValue});
	    }
	    wm.undo.push(this);
	},
	undo: function() {
	    var c = this.getComponent();
	    if (c) {
		if (this.propertyName == "bounds") {
		    c.designResize(this.oldValue, true);
		} else {
		    c.setProp(this.propertyName, this.oldValue instanceof wm.Component ? this.oldValue.getId() : this.oldValue);
		}
		if (studio.selected == c) {
		    studio.inspector.reinspect();
		}
	    }
	}
});
