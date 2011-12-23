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

dojo.provide('wm.base.lib.data');

wm.data = wm.data || {};

dojo.mixin(wm.data, {
	// returns fields that should be included for type
	getIncludeFields: function(inTypeName) {
		var
			pi, fields=[],
			schema = wm.typeManager.getTypeSchema(inTypeName);
		for (var i in schema) {
			pi = schema[i];
			if (pi.include && pi.include.length) {
				// composite key
				if (wm.typeManager.isStructuredType(pi.type)) {
					var compSchema = wm.typeManager.getTypeSchema(pi.type);
					for (var j in compSchema)
						fields.push(i + "." + j);
				} else
					fields.push(i);
			}
		}
		return fields;
	},
	// Reports if given data of type has include data.
	// This is equivalent to having primary key information
	// that is necessary for initiating update and delete operations.
	// By default related structured types are not checked for include data
	// That information is typically not required for update / delete operations.
	hasIncludeData: function(inTypeName, inData) {
		if (!inData || wm.isEmpty(inData))
			return false;
		var fields = this.getIncludeFields(inTypeName);
		for (var i=0, f; f=fields[i]; i++)
			if (dojo.getObject(f, false, inData) === undefined)
				return;
		return true;
	},
	// Reports if given data of type contains necessary contents
	// to perform given operation. 
	hasOperationData: function(inOperation, inTypeName, inData) {
		if (!wm.typeManager.getLiveService(inTypeName))
			return false;
		switch(inOperation) {
			// read ok if we provide no data or we have necessary root include data
			case "read":
				return !inData || wm.data.hasIncludeData(inTypeName, inData);
			// root include data is required for delete and update
			case "delete":
			case "update":
				return wm.data.hasIncludeData(inTypeName, inData);
			// for insert all required root and provided related required data is necessary
			case "insert":
				return wm.data.hasRequiredData(inOperation, inTypeName, inData, true);
		}
	},
	// Reports if given data of type contains all required data
	// This info is helpful for determining if there's enough data to perform an insert operation
	// In this case we want to check structured related data also.
	// Operation and the structured data flag are provided for additional flexibility...
	hasRequiredData: function(inOperation, inTypeName, inData, inCheckStructured) {
		var schema = wm.typeManager.getTypeSchema(inTypeName),
			s, d, isStructured, hasData, missingRequired, hasExcluded;
		for (var i in schema) {
			s = schema[i];
			isStructured = wm.typeManager.isStructuredType(s.type);
			d = inData && inData[i];
			// check structured type
			if (isStructured && inCheckStructured) {
				if ((d || s.required) && !s.isList && !this.hasRequiredData(s.type, d, inCheckStructured))
					return false;
			} else {
				hasData = (d !== undefined);
				missingRequired = s.required && !hasData;
				// return false if we have excluded data or missing required data.
				if (dojo.indexOf(s.exclude, inOperation) != -1 ? hasData : missingRequired)
					return false;
			}
		}
		return true;
	},
	// binding
	clearBinding: function(inObject, inTargetProperty) {
		var w = wm.data.getPropWire(inObject, inTargetProperty);
		if (w) {
			var b = w.owner, target = w.target, tp = w.targetProperty;
			// note: removing wire may have side-effects so reset value with care after removing.
			if (b)
				b.removeWire(w.getWireId());
			// reset value here.
			if (target && tp)
				target.setValue(tp, "");
		}
	},
	getPropWire: function(inTargetObject, inTargetProperty) {
		var
			tp = inTargetProperty,
			tobj = inTargetObject,
			binding = tobj && tobj.$.binding,
			// Note: target bindings are stored in wires hash by targetProperty
			// source bindings has targetId appended so they will be ignored below
			w = binding && binding.wires[tp];
		// if there's a target binding, return it
		if (w)
			return w;
		// FIXME: design check...
		var ownerApp = tobj && tobj.isDesignLoaded() ? studio.application : app;
		// otherwise, if the object is owned by the application try to return a source binding.
		if (tobj && tobj.isOwnedBy(ownerApp))
			return wm.data.findSourceWire((tobj||0).getId(), tp);
	},
	findSourceWire: function(inTargetId, inProp) {
		if (inTargetId) {
			var c, o, id, wires, w;
			// search all components, wee...
			for (var i in wm.Component.byId) {
				c = wm.Component.byId[i];
				// FIXME: design check...
				if ((c instanceof wm.Binding) && (c.isDesignLoaded() || !(window.studio && window.studio._isWaveMakerStudio))) {
					var wires = c.findWiresByProps({targetId: inTargetId, targetProperty: inProp});
					if (wires.length)
						return wires[0];
				}
			}
		}
	},
	// FIXME: deprecated
	/*getPropertyBindWire: function(inBinding, inTargetProperty) {
		var wires = inBinding.wires, w;
		for (var i in wires) {
			w = wires[i];
			if (w.targetProperty == inTargetProperty)
				return w;
		}
	},*/
	getPropBindSource: function(inTargetObject, inTargetProperty) {
		var w = wm.data.getPropWire(inTargetObject, inTargetProperty);
		if (w)
			return inTargetObject.getValueById(w.source);
	},
	// a simple comparator
	compare: function(a, b) {
		return a === b ? 0 :
			a === undefined ? -1 :
			b === undefined ? 1 :
			b === null ? 1 :
			a > b ? 1 :
			-1;
	}
});