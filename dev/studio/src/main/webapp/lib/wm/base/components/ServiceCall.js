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

dojo.provide("wm.base.components.ServiceCall");
dojo.require("wm.base.components.Service");
dojo.require("wm.base.components.ServiceQueue");

//===========================================================================
// Provides basic service calling infrastructure
//===========================================================================
// Note: wm.ServiceCall is not a component. This primarily so that it can be combined
// with components that have other capabilities.
/**
	Infrastructure for encapsulating a {@link wm.Service} configuration with a trigger 
	to invoke the configured service.
	@name wm.ServiceCall
	@class
	@noindex
*/
dojo.declare("wm.ServiceCall", null, {
	/** @lends wm.ServiceCall.prototype */
	/**
		Set true to automatically <a href="#update">update</a> this service when 
		the service configuration or input is modified.
		@type String
	*/
	autoUpdate: false,
	/**
		Set true to automatically <a href="#update">update</a> this service when it's created.
		@type String
	*/
	startUpdate: false,
	startUpdateComplete: false,
	/**
		Name of the service called by this object.
		@type String
	*/
	service: "",
	/**
		Name of the operation to invoke on the service.
		@type String
	*/
	operation: "",
	_operationInfo: {},

        inFlightBehavior: "executeLast",
	destroy: function() {
	        delete this._inFlightBacklog;
		this.inherited(arguments);
		wm.fire(this._requester, "cancel");
	},
    init: function() {
	this.inherited(arguments);
	this._inFlightBacklog = [];
    },
	postInit: function() {
		this.inherited(arguments);
		this.connectStartUpdate();
		if (!this.$.queue)
			new wm.ServiceQueue({name: "queue", owner: this});
		this.initInput();
		this.setService(this.service);
		this._setOperation(this.operation);
	},
	initInput: function() {
		this.input = this.$.input;
		if (!this.input)
			this.input = this.createInput();
		this.subscribe(this.input.getRuntimeId() + "-changed", this, "inputChanged");
	},
    /* Used when binding to input */
    setInput: function(inDataSet) {
	this.input.setDataSet(inDataSet);
    },
	//=======================================================
	// Service
	//=======================================================
	setService: function(inService) {
	    if (this._inSetService) return;
	    try {
		this._inSetService = true;
		this.service = inService;
		var owner = this.getOwnerApp();

		this._service = wm.services.getService(this.service, 	
						       owner && owner.declaredClass == "StudioApplication") || new wm.Service({});
		wm.fire(this._service, "setServiceCall", [this]);
		this._setOperation(this.operation, 1); // update the operation's type; forceUpdate needed so that if the type name is the same but fields have changed it will still get updated
/*
		if (this._isDesignLoaded && this.service) {
		    dojo.subscribe("ServiceTypeChanged-" +  this.service, dojo.hitch(this, function() {
			this._service = wm.services.getService(this.service, 	
							       owner && owner.declaredClass == "StudioApplication") || new wm.Service({});
			wm.fire(this._service, "setServiceCall", [this]);
			this._setOperation(this.operation, 1); // update the operation's type; forceUpdate needed so that if the type name is the same but fields have changed it will still get updated
		    }));
		}      
		*/
	    } catch(e) {
	    } finally {delete this._inSetService;}
	    
	},
	//=======================================================
	// Operation
	//=======================================================
    _setOperation: function(inOperation, forceUpdate) {
		this.operation = inOperation;
		this._operationInfo = this.getOperationInfo(this.operation);
		this.operationChanged(forceUpdate);
	},
	setOperation: function(inOperation) {
		this._setOperation(inOperation);
		this.doAutoUpdate();
	},
	getOperationInfo: function(inOperation) {
		return (this._service && this._service.getOperation(inOperation)) || {};
	},
	operationChanged: function(forceUpdate) {
		this.input.operationChanged(this.operation, this._operationInfo.parameters);
	},
	//=======================================================
	// Input
	//=======================================================
	createInput: function() {
		var i = new wm.ServiceInput({name: "input", owner: this });
		i.operationChanged(this.operation, this._operationInfo.parameters);
		return i;
	},
	inputChanged: function() {
	        if (djConfig.isDebug && this.autoUpdate) {
		    if (djConfig.isDebug) {
			this._autoUpdateFiring = "inputChanged";
			this._debug = {trigger: "autoUpdate",
				       lastUpdate: new Date()}; 
		    try {
			var i = 0;
			var caller = arguments.callee.caller;
			while (caller && caller.nom != "dataValueChanged" && i < 15) {
			    caller = caller.caller;
			    i++;
			}
			if (caller && caller.nom == "dataValueChanged") {
			    var newValue = caller.arguments[1];

			    this._debug.eventName = "sourceData: " + caller.arguments[0] + " set to " + (newValue instanceof wm.Component ? newValue.toString() : newValue);
			}
		    } catch(e) {}
		    }
		    this.doAutoUpdate();
		    if (djConfig.isDebug) {
			delete this._autoUpdateFiring;
		    }
		} else {
		    this.doAutoUpdate();
		}

	},
	//=======================================================
	// Updating
	//=======================================================
	connectStartUpdate: function() {
		if (this.owner && this.owner.start)
			this.connectOnce(this.owner, "start", this, "doStartUpdate");
	},
	setAutoUpdate: function(inAutoUpdate) {
		this.autoUpdate = inAutoUpdate;
		this.doAutoUpdate();
	},
	setStartUpdate: function(inStartUpdate) {
		this.startUpdate = inStartUpdate;
		if (this.startUpdate && !this._loading && this.isDesignLoaded()) {
		    this.updateInternal();
		}
	},
	doStartUpdate: function() {
	        if (this.startUpdate && !this._loading) {
		    if (djConfig.isDebug) {
			this._autoUpdateFiring = "startUpdate";
			this._debug = {trigger: "startUpdate",
				       lastUpdate: new Date()}; 
		    }
		    this.updateInternal();
		    if (djConfig.isDebug) {
			delete this._autoUpdateFiring;
		    }
		    this.startUpdateComplete = true;
		}
	},
	doAutoUpdate: function() {
	    if (this.autoUpdate && !this._loading && (!this.startUpdate || this.startUpdateComplete || this.isDesignLoaded())) {
		if (djConfig.isDebug && !this._debug && this._inPostInit) {
		    var page = this.getParentPage() || app;
		    this._debug = {trigger: "autoUpdate" + (page && page._loadingPage ? ": onStart" : "unknown source"),
				   lastUpdate: new Date()}; 
		}

		wm.job(this.getRuntimeId() + ".doAutoUpdate", 1, dojo.hitch(this, "updateInternal"));
	    }
	},
	/**
		Invoke the service.
		Use the <a href="onResult">onResult</a>,
		<a href="onSuccess">onSuccess</a>,
		and/or <a href="onError">onError</a> events 
		to monitor the outcome of the service call.
	*/
	update: function() {
	    if (djConfig.isDebug) {
		try {
		    this._debug = {trigger: arguments.callee.caller.nom || arguments.callee.caller.name || "anonymous",
				   lastUpdate: new Date()}
		} catch(e) {}
	    }
		return this._isDesignLoaded ? this.doDesigntimeUpdate() : this._update();
	},
    /* Users call "update" event handlers and autoUpdate/startUpdate call updateInternal; used for tracking/debugging purposes */
    updateInternal: function() {
	return this._isDesignLoaded ? this.doDesigntimeUpdate() : this._update();
    },
	_update: function() {
	    if (this._requester && !this._isDesignLoaded) {
		if (this.inFlightBehavior == "executeLast")
		    this._inFlightBacklog.pop();
		if (this.inFlightBehavior == "executeLast" || 
		    this.inFlightBehavior == "executeAll") {
		    var d = new dojo.Deferred();
		    this._inFlightBacklog.push({args: this.getArgs(),
					operation: this.operation,
					deferred: d});
		}
		return d;
	    }
	    if (this.canUpdate()) {
		this.onBeforeUpdate(this.input);
		wm.cancelJob(this.getRuntimeId() + ".doAutoUpdate"); // just in case there's a job already scheduled
		return this.request();
	    }
	},
        /**
		Return a boolean value used to determine if the service can be updated.
		Use the <a href="onCanUpdate">onCanUpdate</a>,
		event to control the output of canUpdate.
	*/
	canUpdate: function() {
		var info = {canUpdate: this._getCanUpdate() };
		this.onCanUpdate(info);
		return info.canUpdate;
	},
	_getCanUpdate: function() {
	    return this._service && this.operation;
	},
	getArgs: function() {
	    var args = this.input.getArgs();
	    var operationType = this.getOperationType();
	    if (operationType == "hqlquery") {
		var max = this.isDesignLoaded() ? this.designMaxResults : this.maxResults;
		var pagingOptions = max ? { maxResults: max, firstResult: this.firstRow || 0} : {};
		args.push(pagingOptions);
	    }
	    return args;
	},
    getDebugArgs: function() {
	return this.input.getData();
    },
   getOperationType: function() {
	    var service = this._service;
	    if (service) {
		var operation = service._operations[this.operation];
	    }
	    if (operation) {
		return operation.operationType;
	    } else {
		return "";
	    }
   },
    replaceAllDateObjects: function(item) {
        for (var i in item) {
            if (item[i] instanceof Date) item[i] = item[i].getTime();
            else if (typeof item[i] == "object") this.replaceAllDateObjects(item[i]);
        }
    },
    /* inArgs optional too... */
    request: function(inArgs, optionalOp, optionalDeferred) {
	if (djConfig.isDebug && this._debug) {
	    this._debug.request = this.getDebugArgs();
	}

	    /* Update all parameters to be current before we fire this 
	    if (this.$.binding) {
		this.$.binding.refresh();
	    }*/
            if (this.downloadFile) {
	        var args = inArgs || this.input.getArgsHash();
                this.replaceAllDateObjects(args);
/*
                var argString = "method=" + this.operation;
                for (i in args) {
                    argString += "&" + i + "=" + escape(args[i]);
                }
		*/

                var baseurl = window.location.href;
                baseurl = baseurl.replace(/\?.*$/,"");
                baseurl = baseurl.replace(/\/[^\/]*$/,"/");
		var urlStr = baseurl + this._service._service.serviceUrl.replace(/\.json$/,".download");

		var iframe = dojo.byId("downloadFrame");
		      if (iframe) iframe.parentNode.removeChild(iframe);

		      iframe = document.createElement("iframe");
		      dojo.attr(iframe, {id: "downloadFrame",
					 name: "downloadFrame"}); 
		      dojo.style(iframe, {top: "1px",
					  left: "1px",
					  width: "1px",
					  height: "1px",
					  visibility: "hidden"}); 
		      dojo.body().appendChild(iframe);


		var iframedoc= iframe.contentDocument || iframe.contentWindow.document;
		iframedoc.open("text/html"); // required by ie8 and earlier so that iframedoc.body exists
		iframedoc.close();

		var form =  iframedoc.createElement("form");
		dojo.attr(form, {id: "downloadForm",
				 method: "POST",
				 action: urlStr});
		var method = iframedoc.createElement("input");
		dojo.attr(method, {name: "method",
				   value: optionalOp || this.operation});
		form.appendChild(method);
                for (i in args) {
		    var input = iframedoc.createElement("textarea");
		    dojo.attr(input, {name: i,
				       value: args[i]});		    
		    form.appendChild(input);
                }

		iframedoc.body.appendChild(form);
		form.submit();

/*

				var iframedoc= iframe.contentDocument || iframe.contentWindow.document;
				iframedoc.open(); 
				iframedoc.write('<form method="post" action="');
				iframedoc.write(urlStr);
				iframedoc.write('">');
				iframedoc.write('    <textarea name="contents" id="contents"></textarea>');
				iframedoc.write('    <input type="text" name="fileType" id="fileType" />');
				iframedoc.write('    <input type="text" name="fileName" id="fileName" />');
				iframedoc.write('    <input type="text" name="method" id="method" />');
				iframedoc.write('</form>'); 
				iframedoc.close(); 
				iframedoc.getElementById('contents').value= args.contents; 
				iframedoc.getElementById('fileType').value= args.fileType; 
				iframedoc.getElementById('fileName').value= args.fileName; 
				iframedoc.getElementById('method').value= this.operation; 
				iframedoc.getElementsByTagName('form')[0].submit();
				*/
            } else {
	        var args = inArgs || this.getArgs();
                //this.replaceAllDateObjects(args);
		wm.logging && console.debug("request", this.getId(), "operation", optionalOp || this.operation, "args", args);
		if (djConfig.isDebug)
		    console.log("REQUEST   Component: " + this.getRoot() + "." + this.name + ";  Operation: " + (optionalOp || this.operation));

	        var d = this._requester = this._service.invoke(optionalOp || this.operation, args, this.owner, this);
		if (optionalDeferred) {
		    d.then(
			function(inValue) {
			    optionalDeferred.callback(inValue);
			},
			function(inError) {
			    optionalDeferred.errback(inError);
			}
		    );
		}
		return this.processRequest(d);
            }
	},
	processRequest: function(inDeferred) {
		var d = inDeferred;
		if (d) {
/*
		    d.canceller = function(inDeferred) {
			inDeferred.fired = 1;
		    }
		    */
			d.addCallbacks(dojo.hitch(this, "result"), dojo.hitch(this, "error"));
			return d;
		}
	},
	//=======================================================
	// Result Processing
	//=======================================================
	result: function(inResult) {
	    this._requester = false;
	    this.processResult(inResult);
	    if (this.updateOnResult) this.update();
	    this.processResult(inResult);
	    if (!this._isDesignLoaded && this._inFlightBacklog.length) {
		wm.onidle(this, function() {
		    var backlog = this._inFlightBacklog.shift();
		    this.request(backlog.args, backlog.operation, backlog.deferred);
		});
	    }
	    return inResult;
	},
	processResult: function(inResult) {
	    delete this._lastError;
		this.onResult(inResult);
		this.onSuccess(inResult);
	    if (!this.isDestroyed && this.$.queue)
		this.$.queue.update();
	},
	error: function(inError) {
	    this._lastError = inError;
	        this._requester = false;
		this.processError(inError);
		return inError;
	},
	processError: function(inError) {
		this.onResult(inError);
		this.onError(inError);
	},

	//=======================================================
	// Events
	//=======================================================
	/**
		onCanUpdate event fires before a service is invoked.
		@param {Any} ioUpdate An object containing a canUpdate flag.
		Setting this flag to false will prevent the service from updating.
		@event
	*/
	onCanUpdate: function(ioUpdate) {
	},
	/**
		onBeforeUpdate event fires before a service is invoked.
		@param {wm.ServiceInput} ioInput The input object used to determine what data 
		will be passed to the service.
		@event
	*/
	onBeforeUpdate: function(ioInput) {
	},
	/**
		onResult event fires whenever a service returns, whether the
		service returned successfully or reported an error.
		@param {Any} inData Result data. The format of this data on the service.
		@event
	*/
	// fires on success or error
	onResult: function(inDeprecated) {
	},
	/**
		onSuccess event fires whenever a service returns successfully.
		@param {Any} inData Result data. The format of this data on the service.
		@event
	*/
	// fires only on success
	onSuccess: function(inDeprecated) {
	},
	/**
		onError event fires whenever a service reports an error.
		@param {Any} inData Result data. The format of this data on the service.
		@event
	*/
	// fires only on error
	onError: function(inError) {
	    var errCodes = (dojo.isObject(inError) ? inError.message : inError).match(/(\d+)$/);
		var errCode = (errCodes) ? errCodes[0] : "";

		// If the failer is a security access error, AND if its NOT a security error that comes from live view 
		// (happens when a project accesses the server while running within studio), then tell the user to log back in.
		// Also don't repeat this alert more than once every 3 minutes (it takes 4 server accesses to open a page, so thats 4 alerts in a row!)
		if (errCode == 403) {
		    dojo.publish("session-expiration-servicecall", [this]);
		    if (app && app.onSessionExpiration)
			app.onSessionExpiration();
		} else {
		  dojo.publish("service-variable-error", [this, inError]);
		}
	}
});
	    
/**#@+ @design */
wm.ServiceCall.extend({
	clearInput: "(clear input)",
	updateNow: "(update now)",
	queue: "(serviceCalls)",
	getUniqueName: function(inName) {
	    if (inName === "input") return "input";
	    return this.inherited(arguments);
	},
	/** @lends wm.ServiceCall.prototype */
	doDesigntimeUpdate: function() {
		this._designTime = true; //The line is not being used now.  It may be used in the future to differenciate requests from 
		//Studio from requests deployed application.
		return studio.makeLiveDataCall(dojo.hitch(this, "_update"));
	},
	doClearInput: function() {
		this.input.destroy();
		this.input = this.createInput();
	},
	set_operation: function(inOperation) {
		this.setOperation(inOperation);
		if (this.isDesignLoaded() && studio.selected == this)
			studio.inspector.inspect(studio.selected);
	},
	getServicesList: function() {
		return [""].concat(wm.services.getNamesList()||[]);
	},
	showQueueDialog: function() {
		var d = wm.ServiceQueue.dialog, q = this.$.queue;
		if (d) {
			d.page.binding = q;
			d.page.update();
		}else{
		    /* TODO: Convert to new dialogs */
			wm.ServiceQueue.dialog = d = new wm.PageDialog({
				name: "queueDialog",
				owner: studio,
				contentWidth: 600,
				contentHeight: 400,
				hideControls: true,
				pageName: "QueueDialog",
				pageProperties: {binding: q}
			});
		}
		d.show();
	},


	makePropEdit: function(inName, inValue, inEditorProps) {
	    var prop = this.schema ? this.schema[inName] : null;
	    var name =  (prop && prop.shortname) ? prop.shortname : inName;
	    var prop = this.schema ? this.schema[inName] : null;
	    var name =  (prop && prop.shortname) ? prop.shortname : inName;
		switch (inName) {
			case "service":
		    return new wm.SelectMenu(dojo.mixin(inEditorProps, {options: this.getServicesList()}));
		case "operation":
				var
					s = this._service,
					valueOk = s && s.getOperation(inValue),
					methods = s && s.getOperationsList();
				if (!valueOk){
					inValue = methods ? methods[0] : "";
					if (inValue)
						this.set_operation(inValue);
				}
				if (methods)
				    return new wm.SelectMenu(dojo.mixin(inEditorProps, {options: methods}));
				break;
		}
		return this.inherited(arguments);
	}
});
wm.Object.extendSchema(wm.ServiceCall, {
    startUpdateComplete: { ignore: 1},
    setService: {group: "method"},
    setOperation: {group: "method"},
    update: {group: "method"},
    canUpdate: {group: "method"}
});

	     
//===========================================================================
// Variable used as a service input
//===========================================================================
/**
	Variable used as a service input
	@name wm.ServiceInput
	@class
	@noindex
	@extends wm.Variable
*/
dojo.declare("wm.ServiceInput", wm.Variable, {
	/** @lends wm.ServiceInput.prototype */
	_allowLazyLoad: false,
	isDataProp: function(inProp) {
		// Note: it's important we assume all properties are data properties unless _dataSchema is set
		// Since the dataSchema is set externally, 
		// bindings may set data properties before data schema is set, creating errors.
		return wm.isEmpty(this._dataSchema) || (inProp in this._dataSchema) ;
	},
	operationChanged: function(inType, inSchema) {
		this.setType(inType + "Inputs");
		this.setDataSchema(inSchema);
		// input bindings may need to reinitialize after gleaning
		// operation type information (in light of constants)
		if (this.$.binding)
		{
			this.$.binding.refresh();
		}

	},

    getArgsHash: function() {
	var data= this.getData(), args={}, d;

	for (var p in this._dataSchema) {
	    args[p] = (data[p] === undefined || data[p] === null) ? "" : data[p];
        }
	return args;
    },
	getArgs: function() {
		var data= this.getData(true), args=[], d;
		// convert to array
		for (var p in this._dataSchema) {
			if (data !== undefined)
				d = data[p];
			args.push(d !== undefined ? d : null);
/* Seung's temporary fix
			if (d) {
				args.push(d);
			}
			*/
		}
	    return args;
	}
});

wm.ServiceInput.extend({
    writeProps: function() {
	return {type: this.type};
    }
});

wm.Object.extendSchema(wm.ServiceInput, {
	dataSet: { ignore: 1, defaultBindTarget: false, isObject: true, type: "any"}
});

wm.ServiceInputVariable = wm.ServiceInput;
