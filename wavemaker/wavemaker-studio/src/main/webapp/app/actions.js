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
            studio.inspect(s);
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
        if (this.stack.length) {
            var task = this.stack[this.stack.length-1];
            for (var i = 0; i < (task.undoCount || 1); i++) {
                var t = this.stack.pop();
                t.undo();
            }
        }
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
    components: null,
    componentRootIds: null,
    getComponents: function() {
        if (this.components) {
            return dojo.map(this.components, function(c,i) {return studio.application.getValueById(this.componentRootIds[i] + c.getId());},this);
        } else {
            return [];
        }
    },
    setComponents: function(inComponents) {
        this.components = inComponents;
        this.componentRootIds = dojo.map(inComponents, function(c) {return c.getRootId();});
    },
    clearComponents: function() {
        this.components = [];
    }
});

dojo.declare("wm.DeleteTask", wm.ComponentTaskMixin, {
    constructor: function(inProps) {
        var comps = inProps && inProps.components || studio.selected;
        if (!comps || !comps.length)
            return;
        this.setComponents(comps);
        this.hint = studio.getDictionaryItem("UNDO_DELETE_HINT", {className: comps.length == 1 ? comps[0].declaredClass.split(".").pop() : "Multiple Widgets"});
        this.clips = dojo.map(comps, function(c) {  return c.serialize({});});

        this.classTypes = dojo.map(comps, function(c) {return c.declaredClass;});
        this.owners = dojo.map(comps, function(c) {return c.owner;});
        this.isWidgets = dojo.map(comps, function(c) {return c instanceof wm.Control;});
        this.parents = dojo.map(comps, function(c) {return c.parent;});
        this.redo(inProps && inProps.cutAction);
    },
    cachePlacement: function() {
        var comps = this.getComponents();
        // FIXME: nearly duped from code in Designer.js
        this.originalTargets = dojo.map(comps, function(c) {return c.parent;});
        this.originalRects = dojo.map(comps, function(c) {
            return c instanceof wm.Control ? dojo.marginBox(c.domNode) : null;
        });


        this.originalSiblings = dojo.map(this.originalTargets, function(originalTarget,i) {
                return (originalTarget && originalTarget.container) ? originalTarget.nextSibling(comps[i]) : null;
        });
    },
    restorePlacement: function() {
        var comps = this.getComponents();
        for (var i = 0; i < comps.length; i++) {
            if (comps[i] instanceof wm.Control && this.originalTargets[i]) {
                studio.designer.replace(comps[i], this.originalTargets[i], this.originalRects[i], this.originalSiblings[i]);
            }
        }
    },
    redo: function(cutAction) {
        this.cachePlacement();
        /* Don't delete here if its a cut action, but we still want to push this onto the undo stack */
        if (cutAction || studio._deleteControl(this.getComponents())) {
            this.clearComponents();
            wm.undo.push(this);
        }
    },
    undo: function() {
        var clips = this.clips;
        var components = [];
        for (var i = clips.length-1; i >= 0; i--) {
            var p = this.isWidgets[i] ? (this.parents[i].owner ? this.parents[i] : null) : this.owners[i];
            /* TODO: Paste of this.clip probably doesn't cut it here; need to paste each widget to the correct parent */
            var c = studio._pasteControl(p, clips[i], this.classTypes[i],true);
            components.unshift(c);
        }
        this.setComponents(components);
        this.restorePlacement();
        studio.refreshDesignTrees();
        studio.select(components);
    }
});

dojo.declare("wm.DropTask", wm.ComponentTaskMixin, {
    hint: "Drop Component",
    constructor: function(inComponents) {
        this.setComponents(inComponents);
        // abort if this is really an AddTask
        //if (this.component._draggedFromPalette)
        //  return;
        this.hint = studio.getDictionaryItem("UNDO_DROP_HINT", {className: inComponents.length == 1 ? inComponents[0].declaredClass.split(".").pop() : "Multiple Widgets"});
        this.boundsList = dojo.map(inComponents, function(c) {return dojo.marginBox(c.domNode);});
        this.targetIds = dojo.map(inComponents, function(c) {return c.parent ? c.parent.getRuntimeId() : c.owner.getRuntimeId();});
        this.siblingIds = dojo.map(inComponents, function(c) {
            var sibling;
            var parent = (c instanceof wm.Layer) ? c.parent.client : c.parent;
            if (parent) {
                sibling = parent.nextSibling(c);
            }
            return  sibling ? sibling.getRuntimeId() : "";
        });
        wm.undo.push(this);
    },
    undo: function() {
        studio.select(null);
        var comps = this.getComponents();
        for (var i = comps.length-1; i >= 0; i--) {
            var c = comps[i];
            var t = app.getValueById(this.targetIds[i]);
            var sib = app.getValueById(this.siblingIds[i]);
            var bounds = this.boundsList[i];
            studio.designer.replace(c, t, bounds, sib);
        }
        studio.refreshDesignTrees();
        studio.select(this.getComponents());
    }
});

dojo.declare("wm.AddTask", wm.ComponentTaskMixin, {
    hint: "Add Component",
    constructor: function(inComponent) {
        var inComponents = dojo.isArray(inComponent) ? inComponent : [inComponent];
        this.setComponents(inComponents);
        this.hint = studio.getDictionaryItem("UNDO_ADD_HINT", {className: inComponents.length == 1 ? inComponents[0].declaredClass.split(".").pop() : "Multiple Widgets"});
        wm.undo.push(this);
    },
    undo: function() {
        studio._deleteControl(this.getComponents());
    }
});

/* WARNING: There is also a wm.SetPropTask in propertyEdit.js for undoing the specialized property editors */
dojo.declare("wm.PropTask", wm.ComponentTaskMixin, {
    hint: "Property Change",
    /* TODO: oldValues needs to be an array */
    constructor: function(inComponent, inPropName, oldValues) {
        this.setComponents([inComponent]);
        this.propertyName = inPropName;
        this.oldValue = oldValues;
        if (inPropName == "bounds") {
            this.hint = studio.getDictionaryItem("UNDO_PROP_HINT", {
                propName: "width/height",
                oldValue: "width:" + this.oldValue.w + ", height: " + this.oldValue.h
            });
        } else {
            this.hint = studio.getDictionaryItem("UNDO_PROP_HINT", {
                propName: this.propertyName,
                oldValue: this.oldValue
            });
        }
        wm.undo.push(this);
    },
    undo: function() {
        var components = this.getComponents();
        if (components) {
            for (var i = 0; i < components.length; i++) {
                var c = components[i];
                if (this.propertyName == "bounds") {
                    c.designResize(this.oldValue, true);
                } else {
                    c.setProp(this.propertyName, this.oldValue instanceof wm.Component ? this.oldValue.getId() : this.oldValue);
                }
                if (studio.selected && studio.selected.indexOf(c) != -1) {
                    studio.inspector.reinspect();
                }
            }
        }
    }
});
