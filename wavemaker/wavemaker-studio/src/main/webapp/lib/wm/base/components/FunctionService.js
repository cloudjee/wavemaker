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

dojo.provide("wm.base.components.FunctionService");
dojo.require("wm.base.components.Service");

dojo.declare("wm.FunctionService", wm.Service, {
	operation: "",
	_operations: {
		componentFunction: {
			parameters: {
				component: { type: "wm.Component"},
				functionName: { type: "String" },
				functionArguments: { type: "String" }
			},
			returnType: "AnyData",
			hint: "This operation calls a function on a given component."
		},
		pageFunction: {
			parameters: {
				functionName: { type: "String" },
				functionArguments: { type: "String" }
			},
			returnType: "AnyData",
			hint: "This operation calls a function defined in the page or application Javascript source."
		}
	},
	setServiceCall: function(inServiceCall) {
		this.serviceCall = inServiceCall;
	},
	update: function() {
		this[this.operation || "componentFunction"]();
	},
	componentFunction: function(inComponent, inFunction, inArguments) {
		if (!(inComponent instanceof wm.Component))
			return;
		var args = String(inArguments || "").split(',');
		for (var i=0, l=args.length; i<l; i++)
			args[i] = dojo.trim(args[i]);
		var result = wm.fire(inComponent, inFunction, args);
		// to be an error, result must be something other than undefined
		result = result === undefined ? true: result;
		return result;
	},
	pageFunction: function(inFunction, inArguments) {
		return this.componentFunction((this.serviceCall ? this.serviceCall.getRoot() : this.getRoot()), inFunction, inArguments);
	}
});


wm.services.add({name: "functionService", ctor: "wm.FunctionService", isClientService: true});
