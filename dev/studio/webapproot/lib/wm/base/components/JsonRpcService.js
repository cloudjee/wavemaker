/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.components.JsonRpcService");
dojo.require("wm.base.components.Service");
dojo.require("dojo.rpc.JsonService");

wm.inflight = {
	_inflight: [],
	getCount: function() {
		return this._inflight.length;
	},
	change: function() {
	},
	add: function(inDeferred) {
		inDeferred._timeStamp = new Date().getTime();
		this._inflight.push(inDeferred);
		inDeferred.addBoth(dojo.hitch(this, "remove", inDeferred));
		this.change();
	},
	remove: function(inDeferred, inResult) {
		var i = dojo.indexOf(this._inflight, inDeferred);
		if (i==-1)
			return;
		var delta = new Date().getTime() - inDeferred._timeStamp;
		//console.info("deferred inflight for ", delta + "ms", inDeferred);
		this._inflight.splice(i, 1);
		this.change();
		return inResult;
	},
	cancel: function() {
		dojo.forEach(this._inflight, function(d) {
			if (!d.canceller)
				d.canceller = function() {};
			d.cancel();
		});
	}
}

dojo.subscribe("wm-unload-app", wm.inflight, "cancel");

dojo.declare("wm.JsonRpc", dojo.rpc.JsonService, {
	smd: null,
	required: false,
	sync: false,
        _designTime: false,
	bind: function(method, parameters, deferredRequestHandler, url){
		//console.log("method", method, "parameters", parameters || [], "url", url || this.serviceUrl);
		url = url || this.serviceUrl;
		if (!url)
			return;
		if (this._designTime) 
					url = url + "?designTime=true";
		var props = {
			url: url||this.serviceUrl,
			postData: this.createRequest(method, parameters || []),
			contentType: this.contentType,
			timeout: this.timeout, 
			handleAs: "json",
			sync: this.sync
		}
		var def = dojo.rawXhrPost(props);
		def.addCallbacks(this.resultCallback(deferredRequestHandler), this.errorCallback(deferredRequestHandler));
	},
	// override dojo default, we want full result object, not just {result: ...}
	parseResults: function(obj){
		return obj;
	}
});

dojo.declare("wm.JsonRpcService", wm.Service, {
	operations: "",
	ready: false,
	service: "",
	// 0 indicates no timeout.
	timeout: 0,
	errorLevel: 10,
	sync: false,
	url: "",
	_methods: [],
	_operations: {},
	_service: null,
	init: function() {
		//dojo.mixin(this.readonlyProps, { methods: 1, ready: 1 });
		this.inherited(arguments);
		this.initService();
	},
	setSync: function(inSync) {
		this.sync = inSync;
	},
	getServiceRoot: function() {
		return this.getPath() + "services/";
	},
	getJsonPath: function() {
		var p = '';
		// this window.studio test is needed for the login page to run when not in debug mode
		if(this.isDesignLoaded() && window.studio && studio.project) {
		    var projectPrefix = studio.projectPrefix;
		    p = '/' + projectPrefix + studio.project.getProjectPath() + '/';
		}
		return p;
	},
	// FIXME: we're making a new service object for every rpc service.
	// This is unnecessary and one side effect is that the smd is re-requested for each rpc service
	// at the least we could cache this smd data to avoid re-retrieving it.
	// it seems unnecessary to have more than one JsonRpc per service
	// and it may be unnecessary to have more than one JsonRpcService (ever) per service 
	// JsonRpcService has a few properties that make collapsing the number of them non-trivial (e.g. sync, timeout)
	initService: function() {
		var
			n = this.service || this.name,
		    url = this.url || (n && (this.getServiceRoot() + n + ".smd?rand=" + Math.floor(Math.random()*1000000)));
		this._service = null;
		if (url) {
			try{
			    this._service = wm.JsonRpcService.smdCache[url];
			    if (this._service) {
				this.listOperations();
			    } else {

				this._service = new wm.JsonRpc(url);
				if (this._designTime)
					this._service._designTime = true;
				this._service.timeout = this.timeout;
				this.ready = Boolean(this._service && this._service.smd);
				if (this.ready) {
				    this._service.serviceUrl = this.getJsonPath() + this._service.serviceUrl;
				    this.listOperations();
				}
			    }
			}catch(e){
				console.debug(e);
			}
		}
	},
	setName: function(inName) {
		this.inherited(arguments);
		if (!this.url)
			this.initService();
	},
	ensureArgs: function(inMethod, inArgs) {
		if (inMethod in this._operations && dojo.isArray(inArgs)) {
			var op = this._operations[inMethod], argCount=0;
			if (op) {
				for (var o in op.parameters)
					argCount++;
				for (var i=inArgs.length; i<argCount; i++)
					inArgs.push(null);
			}
		}
	},
       invoke: function(inMethod, inArgs, owner) {
		if (!this._service) 
			return null;
		this._service.sync = this.sync;
		this.ensureArgs(inMethod, inArgs);
		//if (wm.logging)
	        this.debugLastMethod = inMethod;
		if (djConfig.isDebug && !dojo.isFF) {
		    console.group("JsonRpcService.invoke method:", inMethod);
		    if (inArgs && inArgs.length) {
		      console.log("Arguments:");
		      console.log(inArgs); 
		    }
		    console.groupEnd();
		}
		this.result = null;
		this.error = null;

		var d = this._service.callRemote(inMethod, inArgs || []);
		d.addBoth(dojo.hitch(this, function(r) {
			this.inflight = false;
			return r;
		}));
		d.addCallbacks(dojo.hitch(this, "onResult"), dojo.hitch(this, "onError"));
		wm.inflight.add(d);
		this.inflight = true;
		return d;
	},
	request: function(inMethod, inArgs, inResult, inError) {
		var d = this.invoke(inMethod, inArgs);
		if (inResult) {
			if (dojo.isFunction(inResult))
				d.addCallback(inResult);
			else
				d.addCallback(this.owner, inResult);
		}
		if (inError) {
			if (dojo.isFunction(inError))
				d.addErrback(inError);
			else
				d.addErrback(this.owner, inError);
		}
		return d;
	},
	// force a sync call, irrespective of our sync setting
	requestSync: function(inMethod, inArgs, inResult, inError) {
		var s = this.sync;
		this.sync = true;
		var d = this.request.apply(this, arguments);
		this.sync = s;
		return d;
	},
	// force an async call, irrespective of our sync setting
	requestAsync: function(inMethod, inArgs, inResult, inError) {
		var s = this.sync;
		this.sync = false;
		var
			cb = inResult ? dojo.hitch(this, function() {
				this.sync = s;
				return inResult.apply(this, dojo._toArray(arguments));
			}) : null,
			eb = inError ? dojo.hitch(this, function() {
				this.sync = s;
				return inError.apply(this, dojo._toArray(arguments));
			}) : null;
		return this.request(inMethod, inArgs, cb, eb);
	},
	getResultSync: function(inMethod, inArgs) {
		var d = this.requestSync(inMethod, inArgs);
		return d.results[0];
	},
	onResult: function(inResult) {
		var r = this.fullResult = inResult;
		this.result = (r || 0).result;
		if (djConfig.isDebug && !dojo.isFF) {
			console.group("Service Call Completed: " + this.name + "." + this.debugLastMethod);
			if (this.result) {
			    console.log(this.result);
			} else {
			    console.log("Response was null");
			}
			console.groupEnd();
		}
		return this.result;
	},
	onError: function(inError) {
	    try {
	        console.group("Service Call Failed: " + this.name + "." + this.debugLastMethod);                              
		if (inError)
		  console.error(inError.message);                                                                               
                console.groupEnd();    
		var errCodes = inError.message.match(/(\d+)$/);
		var errCode = (errCodes) ? errCodes[0] : "";

		// If the failer is a security access error, AND if its NOT a security error that comes from live view 
		// (happens when a project accesses the server while running within studio), then tell the user to log back in.
		// Also don't repeat this alert more than once every 3 minutes (it takes 4 server accesses to open a page, so thats 4 alerts in a row!)
		if (errCode == 403) {
		      dojo.publish("session-expiration", []);
		} 	       
	    } catch(e) {		
		if (wm.logging) {
		    console.dir(e);
		    console.dir(inError);
		}
	    }
	    this.reportError(inError);
	    return this.error = inError;
	},
	reportError: function(inError) {
		var m = dojo.isString(inError) ? inError : (inError.message ? "Error: " + inError.message : "Unspecified Error");
		m = (this.name ? this.name + ": " : "") + m;
		if (this.errorLevel > 5) {
			if (!inError.dojoType == "cancel")
				console.error(m);
		} else if (this.errorLevel > 0)
			wm.logging && console.debug(m);
	},
	paramArrayToHash: function(inParams) {
		var hash = {};
		for (var i=0, p; (p=inParams[i]); i++)
		    hash[p.name] = { type: p.type, hidden: p.hidden };
		return hash;
	},
	listOperations: function() {
		this._methods = [];
		this._operations = {};
		var m = (this._service.smd||0).methods || [];
		for (var i=0, op; (op=m[i]); i++){
			this._methods.push(op.name);
			this._operations[op.name] = {
				parameters: this.paramArrayToHash(op.parameters || []),
				returnType: op.returnType || "any"
			};
		}
		this._methods.sort();
	}, 
	makePropEdit: function(inName, inValue, inDefault) {
		if (inName == "operations")
			return makeSelectPropEdit(inName, inValue, this._methods||[], inDefault);
		return this.inherited(arguments);
	}
});

wm.Object.extendSchema(wm.JsonRpcService, {
	ready: { ignore: 1 }
});

wm.JsonRpcService.description = "Any JsonRpc service.";
wm.JsonRpcService.smdCache = {};