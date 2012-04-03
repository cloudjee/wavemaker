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

dojo.provide("wm.base.components.Service");
dojo.require("wm.base.Component");

/**
	Component that can be configured to perform a task.
	<br/><br/>
	@name wm.Service
	@class
	@extends wm.Component
*/
dojo.declare("wm.Service", wm.Component, {
	/** @lends wm.Service.prototype */
	_operations: {},
	/**
		Result data (if any) returned from the last invocation.
	*/
	result: null,
	/**
		Error data (if any) returned from the last invocation.
	*/
	error: null,
	getOperationsList: function() {
		var l = [];
		for (var i in this._operations)
			l.push(i);
		l.sort();
		return l;
	},
	makePropEdit: function(inName, inValue, inEditorProps) {
	    var prop = this.schema ? this.schema[inName] : null;
	    var name =  (prop && prop.shortname) ? prop.shortname : inName;
		switch (inName) {
		case "operation":
		    return new wm.SelectMenu(dojo.mixin(inEditorProps, {options: this.getOperationsList()}));
		}
	},
	getOperation: function(inOperation) {
		return this._operations[inOperation];
	},
	initService: function() {
	},
	/**
		Invoke a method on this service object with arguments.
		<br/><br/>
		Invocations may be asynchronous. Responses are available 
		via the returned Deferred object or from the 
		<a href="#onResult">onResult</a> and 
		<a href="#onError">onError</a> events.
		@param {String} inMethod The method to invoke on this object.
		@param {Array} inArgs An array of parameters for the method.
		@returns {dojo.Deferred} Response handler object.
	*/
        invoke: function(inMethod, inArgs, inOwner) {
		var
			d = new dojo.Deferred(),
			m = this[inMethod];
		if (m) {
			var result = m.apply(this, inArgs);
			this.onResult();
			wm.onidle(function() {
				d.callback(result);
			});
		} else {
			this.onError();
			wm.onidle(function() {
			    /* TODO: Localize */
			    d.errback("operation: " + inMethod + " does not exist.");
			});
		}
		return d;
	},
	/**
		Event that fires after a succesful service invocation.
		@param {Any} inResult Any result data returned from the service.
	*/
	onResult: function(inResult) {
		this.error = null;
		return this.result = inResult;
	},
	/**
		Event that fires after a service invocation has resulted in an error.
		@param {Any} inError Any error data returned from the service.
	*/
	onError: function(inError) {
		this.result = null;
		return this.error = inError;
	}
});

// FIXME: needs its own module
// ==========================================================
// Services registry (provides info about available services)
// ==========================================================

wm.services = {
	byName: {},
	_services: {},
	add: function(inService){
		return wm.services.byName[inService.name] = inService;
	},
	remove: function(inService){
		var n = inService.name;
		this._destroyService(n);
		delete wm.services.byName[n];
	},
	getNamesList: function() {
		var l = [], services = wm.services.byName, s;
		for (var i in services) {
			s = services[i];
			if (!s.clientHide) 
				l.push(i);
		}
		l.sort();
		return l;
	},
	forEach: function(inFunction) {
		wm.forEach(this.byName, function(s) {
			inFunction(s);
		});
	},
	clear: function() {
		var n = wm.services.byName, s;
		for (var i in n) {
			s = n[i];
			if (!s.isClientService)
				this.remove(s);
			else
				this._destroyService(s);
		}
	},
        getService: function(inName, hideFromClient) {
		var s;
		if (inName) {
		    s = this._services[inName] || this._createService(inName, hideFromClient);
			if (!s._service)
				s.initService();
		}
		return s;
	},
       _createService: function(inName, hideFromClient) {
		var
			defaultCtor = "wm.JsonRpcService",
			s = this.byName[inName];
		if (!s)
		    s = this.add({name: inName, ctor: defaultCtor, clientHide: hideFromClient});
		var ctor = dojo.getObject(s.ctor || defaultCtor);
		// FIXME: we don't want to be streamed so don't include owner
		// otoh without owner, we don't know how to resolve paths at designTime
	   var service = new ctor({name: inName, service: inName, owner: dojo.getObject("studio.wip.app") || app});
	   //service.owner = dojo.getObject("studio.wip.app") || app;
		return service;
	},
	_destroyService: function(inService) {
		wm.fire(this._services[inService.name], "destroy");
	}
};
wm.Object.extendSchema(wm.Service, {
    operation: {type: "string"}
});