/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.components.Binding");
dojo.require("wm.base.Component");
dojo.require("wm.base.data.expression");

dojo.declare("wm.Wire", wm.Component, {
	expression: "",
	source: "",
	targetProperty: "",
	targetId: "",
	destroy: function() {
		this.disconnectWire();
		this.inherited(arguments);
	},
	/*
	init: function() {
		this.inherited(arguments);
		this.target = this.targetId ? this.getRoot().getValueById(this.targetId) : this.owner.owner;
		if (!this.target) {
			console.info("wm.Wire.init(): bad target: " + this.targetId + " (" + this.owner.owner.name + ")");
			this.bad = true;
			return;
		}
		// make sure binding is fully added to owner before updating values.
		if (this.owner)
			this.owner._addWire(this);
		this.connectWire();
	},
	*/
	setExpression: function(inExpression) {
		this.expression = inExpression || "";
		this.connectWire();
	},
	setSource: function(inSource) {
		this.source = inSource;
		this.connectWire();
	},
	setTargetProperty: function(inTargetProperty) {
		this.targetProperty = inTargetProperty;
		this.connectWire();
	},
	getFullTarget: function() {
		return this.target.getId() + "." + this.targetProperty;
	},
	// FIXME: if one of our source is the target's targetProperty, then will generate an infinite loop
	// this should never happen unless the user sets up an expression.
	canSetValue: function() {
		if (this.expression) {
			var sources = wm.expression.getSources(this.expression), ft = this.getFullTarget();
			for (var i=0, s; (s=sources[i]); i++)
				if (s == ft) {
					wm.logging && console.debug("Wire:", ft, "cannot be set because the target is an expression source");
					return false;
				}
		}
		return true;
	},
    debugBindingEvent: function(inValue) {
			app.debugTree.newLogEvent({type: "bindingEvent",
						   component: this.target,
						   property: this.targetProperty,
						   value: inValue,
						   source: this.expression ? null : this.source,
						   expression: this.expression});
    },
	_sourceValueChanged: function(inValue) {
		if (wm.bindingsDisabled)
			return;

		inValue = this.expression ? wm.expression.getValue(this.expression, this.getRoot()) : inValue;
	        if (this.canSetValue()) {
		    // ignore expressions that don't reference any variables; presume these to be
		    // literals or otherwise uninteresting to log
		    // ignore if we are in refresh; this is not called by values changing,
		    // but rather by components insuring everyone knows their state
		    if (djConfig.isDebug && !this.owner._inRefresh && (!this.expression || this.expression.match(/\$/))) {
			this.debugBindingEvent(inValue);
		    }

		    this.target.setValue(this.targetProperty, inValue);
		}
	},
	sourceValueChanged: function(inValue, inV2) {
		wm.logging && console.info("==> (sourceValueChanged) ", this.getFullTarget(), " <= ", this.source, "(" + inValue + ")");
		this._sourceValueChanged(inValue);
		//wm.logging && console.groupEnd();
	},
	sourceTopUpdated: function(inSource, inId) {
		wm.logging && console.info("==> (sourceTopUpdated) ", this.getFullTarget(), " <= ", inSource);
		//if (wm.bindingsDisabled)
		//	return;
		//wm.logging && console.info("==> (top) ", this.source, "=>", this.getFullTarget(), " Wire.sourceTopUpdated");
		//if (this.expression || this.source.indexOf(inSource)==0) {
			this.refreshValue();
		//}
	},
	sourceRootUpdated: function() {
		// root updated is a special binding situation where we just want to check the value of the source
		// to give it a chance to create itself (this is currently necessary for Variable lazy loading)
	    // MK: 2/24/2011: I'm not seeing this called in a simple lazy loading project.  If this is in fact
	    // called, it should handle this.expression as well as this.source, but its likely obsolete
		wm.logging && console.info("==> (sourceRootUpdated)", this.source);
	        if (this.source)
		    this.getValueById(this.source);
	},
	refreshValue: function() {
		//wm.logging && console.info("==> (refresh) ", this.source, "=>", this.getFullTarget(), " Wire.refreshValue");
	    /* If we're in design mode, and the source is on a page that isn't loaded, we may find ourselves
	     * doing nasty stuff like calling set_dataSet(null) which actually clears the binding
	     * instead of transmitting binding data
	     */
	    if (this._isDesignLoaded && this.source && this.source.indexOf("[") == 0 && this.getValueById(this.source) === null)
		return;
	    this._sourceValueChanged(this.source ? this.getValueById(this.source) : "");
		//wm.logging && console.groupEnd();
	},
	disconnectWire: function() {
		//wm.logging && console.debug("Wire: ", this.target.getId() + "." + this.targetProperty, "[disconnected from]", this.source);
		this._disconnect();
		this._unsubscribe();
	},
	_watch: function(inSource, inRid) {
		wm.logging && console.info("Wire._watch: ", this.target.getId() + "." + this.targetProperty, "watching", inSource);
		// Rule 1: listen to "changed" on our source
	    if (inSource.match(/^\[.*\]\./)) {
		var pre = "";
		inSource = inSource.replace(/^\[(.*?)\]/, "$1");
	    } else {
		var pre = inSource.indexOf("app.") == 0 ? "" : inRid;
	    }

		var topic = pre + inSource + "-changed";
	    this.subscribe(topic, this, "sourceValueChanged");
		wm.logging && console.info("***", " subscribed to [", topic, "]");
		/*
		var p = inSource.split("."), top = p.shift();
		if (top == "app" && p.length)
			top += "." + p.shift();
		topic = pre + top + "-ownerChanged"
		*/
		// Rule 2: listen to "ownerChanged" on source's owner
		// (should be only for Variable sources, which we can't actually identify right now)
		var oid = inSource.split(".");
		oid.pop();
		oid = oid.join(".");
		if (oid && oid != "app") {
		    topic = pre + oid + "-ownerChanged";
		    this.subscribe(topic, this, "sourceTopUpdated");
		    wm.logging && console.info("***", " subscribed to [", topic, "]");

			//
			// Rule 3: listen to "rootChanged" on source's owner root
			// (again, should be only for Variable sources, to make sure objects exist for lazy loading...)
			var p = inSource.split("."), rootId = p.shift();
			if (rootId == "app" && p.length)
				rootId += "." + p.shift();
			if (rootId != oid) {
				topic = pre + rootId + "-rootChanged"
				this.subscribe(topic, this, "sourceRootUpdated")
				wm.logging && console.info("Wire._watch: ", this.source, " subscribed to ", topic);
			}
			//
		}
	},
	connectWire: function() {
		this.disconnectWire();
		this.target = this.target || (this.targetId ? this.getRoot().getValueById(this.targetId) : this.owner.owner);
		if (!this.target) {
			console.info("wm.Wire.init(): bad target: " + this.targetId + " (" + this.owner.owner.name + ")");
			this.bad = true;
			return;
		}
		if (this.targetProperty && (this.source || this.expression)) {
			this.subscribe("wmwidget-idchanged", this, "wireChanged");
			// Figure out runtimeId from context. Key: referenced object must be a child of target's root.
			var rid = this.getRootId();
			if (this.expression) {
				dojo.forEach(wm.expression.getSources(this.expression), dojo.hitch(this, function(s) {
					this._watch(s, rid);
				}));
			} else {
				this._watch(this.source, rid);
			}
			//if (this.targetProperty == "dataStoreName") 
			//	console.info("Wire: ", this.target.getId() + "." + this.targetProperty, "[connected to]", this.source, "via", rid + this.source + '-changed');
			this.refreshValue();
		}
	},
	changeExpressionId: function(inOldId, inNewId) {
		var
			e = this.expression;
			o = "\\${" + inOldId.replace(new RegExp("\\.", "g"), "\\.");
			n = "${" + inNewId,
			r = (e.match(o + "[\\.|}]"));
		e = e.replace(new RegExp(o + "\\.", "g"), n + ".");
		e = e.replace(new RegExp(o + "}", "g"), n + "}");
		this.expression = e;
		return r;
	},
	// check if a wire needs to be updated and redo it if necessary.
	// to match, the checkId should start 
	isPartialId: function(inId, inIdPart) {
		return (inId.indexOf(inIdPart) == 0) && (inIdPart.length == inId.length || inId.charAt(inIdPart.length) == ".");
	},
	// for id checking, convert id to rtId if it's not app level
	isPartialRootId: function(inId, inChangeRtId) {
		if (!inId)
			return;
		inId = inId.match("^app\.") ? inId : this.getRootId() + inId;
		return this.isPartialId(inId, inChangeRtId);
	},
	getWireId: function() {
		return (this.targetId ? this.targetId + "." : "") + this.targetProperty;
	},
	wireChanged: function(inOldId, inNewId, inOldRtId, inNewRtId) {
		var changed, wireId = this.getWireId();
		// expression
		if (this.expression)
			changed = this.changeExpressionId(inOldId, inNewId);
		// source
		if (this.isPartialRootId(this.source, inOldRtId)) {
			changed = true;
			this.source = inNewId + this.source.slice(inOldId.length);
		}
		// targetProperty
		if (this.isPartialRootId(this.targetProperty, inOldRtId)) {
			changed = true;
			this.targetProperty = inNewId + this.targetProperty.slice(inOldId.length);
		}
		// targetId
		if (this.isPartialRootId(this.targetId, inOldRtId)){
			changed = true;
			this.targetId = inNewId + this.targetId.slice(inOldId.length);
		}
		if (changed) {
			this.connectWire();
			if (this.owner && this.owner.wires) {
				delete this.owner.wires[wireId];
				this.owner.wires[this.getWireId()] = this;
			}
		}
	}
});

wm.Object.extendSchema(wm.Wire, {
	expression: {},
	source: {},
	targetProperty: {},
	targetId: {}
});

dojo.declare("wm.Binding", wm.Component, {
	constructor: function(inProps) {
		this.wires = {};
	},
	destroy: function() {
		this.removeWires();
		this.inherited(arguments);
	},
	loaded: function() {
		for (var i in this.components) {
			var c = this.components[i];
			this.wires[c.getWireId()] = c;
			c.connectWire();
		}
		this.inherited(arguments);
	},
	refresh: function() {
	    this._inRefresh = true;
		wm.forEachProperty(this.wires, function(w) { w.refreshValue(); });
	    this._inRefresh = false;
	},
	addWire: function(inTargetId, inTargetProperty, inSource, inExpression) {
		var id = (inTargetId ? inTargetId + "." : "") + inTargetProperty;
		this.removeWire(id);
		var props = {
			// FIXME: remove need for unique name here.
			name: this.getUniqueName("wire"),
			owner: this,
			targetId: inTargetId,
			targetProperty: inTargetProperty,
			source: inSource,
			expression: inExpression
		};
		var wire = this.wires[id] = new wm.Wire(props);
		wire.connectWire();
	        return wire;
	},
	// for greater control, optionally removal only occurs if source and/or expression match arguments
	removeWire: function(inWireId, inSource, inExpression) {
		var wire = this.wires[inWireId];
		if (wire) {
			var 
				s = inSource == undefined || inSource == wire.source,
				e = inExpression == undefined || inExpression == wire.expression;
			if (s && e) {
				wire.destroy();
				delete this.wires[inWireId];
			}
		}
	},
	findWiresByProps: function(inProps) {
		var match = function(w) {
			for (var i in inProps)
				if (inProps[i] != w[i])
					return;
			return true;
		};
		return this.findWires(match);
	},
	findWires: function(inMatchFunc) {
		var f = [];
		if (inMatchFunc)
			wm.forEachProperty(this.wires, function(w) {
				if (inMatchFunc(w))
					f.push(w);
			});
		return f;
	},
	removeWireByProps: function(inProps) {
		var wires = this.findWiresByProps(inProps);
		this.removeWiresList(wires);
	},
	removeWireByProp: function(inPropName) {
	    var result = false;
	    wm.forEachProperty(this.wires, dojo.hitch(this, function(w) { 
		    if (w.targetProperty == inPropName) {
			delete this.wires[inPropName];
			w.destroy(); 
			result = true;
		    }
	    }));
	    return result;
	},
	removeWireList: function(inWires) {
		dojo.forEach(inWires, dojo.hitch(this, function(w) {
			this.removeWire(w.getWireId());
		}));
	},
	removeWires: function() {
		wm.forEachProperty(this.wires, function(w) { w.destroy(); });
		this.wires = {};
	},
	write: function(inIndent) {
		return !wm.isEmpty(this.wires) ? this.inherited(arguments): null;
	}
});
