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
	destroy: function() {
		this.inherited(arguments);
		wm.fire(this._requester, "cancel");
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
	//=======================================================
	// Service
	//=======================================================
	setService: function(inService) {
		this.service = inService;
		this._service = wm.services.getService(this.service) || new wm.Service({});
		wm.fire(this._service, "setServiceCall", [this]);
	},
	//=======================================================
	// Operation
	//=======================================================
	_setOperation: function(inOperation) {
		this.operation = inOperation;
		this._operationInfo = this.getOperationInfo(this.operation);
		this.operationChanged();
	},
	setOperation: function(inOperation) {
		this._setOperation(inOperation);
		this.doAutoUpdate();
	},
	getOperationInfo: function(inOperation) {
		return (this._service && this._service.getOperation(inOperation)) || {};
	},
	operationChanged: function() {
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
		this.doAutoUpdate();
	},
	//=======================================================
	// Updating
	//=======================================================
	connectStartUpdate: function() {
		if (this.owner && this.owner.start)
			this.connect(this.owner, "start", this, "doStartUpdate");
	},
	setAutoUpdate: function(inAutoUpdate) {
		this.autoUpdate = inAutoUpdate;
		this.doAutoUpdate();
	},
	setStartUpdate: function(inStartUpdate) {
		this.startUpdate = inStartUpdate;
		if (this.startUpdate && !this._loading && this.isDesignLoaded()) {
		  this.update();
		}
	},
	doStartUpdate: function() {
	        if (this.startUpdate && !this._loading) {
			this.update();
			this.startUpdateComplete = true;
		}
	},
	doAutoUpdate: function() {
	        if (this.autoUpdate && !this._loading && (!this.startUpdate || this.startUpdateComplete || this.isDesignLoaded()))
			this.update();
	},
	/**
		Invoke the service.
		Use the <a href="onResult">onResult</a>,
		<a href="onSuccess">onSuccess</a>,
		and/or <a href="onError">onError</a> events 
		to monitor the outcome of the service call.
	*/
	update: function() {
		return this.isDesignLoaded() ? this.doDesigntimeUpdate() : this._update();
	},
	_update: function() {
		if (this.canUpdate()) {
			this.onBeforeUpdate(this.input);
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
		return this._service && this.operation && !Boolean(this._requester);
	},
	getArgs: function() {
		return this.input.getArgs();
	},
	request: function(inArgs) {
		inArgs = inArgs || this.getArgs();
		wm.logging && console.debug("request", this.getId(), "operation", this.operation, "args", inArgs);
		if (djConfig.isDebug)
		  console.log("REQUEST   Component: " + this.getRoot() + "." + this.name + ";  Operation: " + this.operation);
	          var d = this._requester = this._service.invoke(this.operation, inArgs, this.owner);
		return this.processRequest(d);
	},
	processRequest: function(inDeferred) {
		var d = inDeferred;
		if (d) {
			d.canceller = function(inDeferred) {
				inDeferred.fired = 1;
			}
			d.addBoth(dojo.hitch(this, function(r) {
				this._requester = false;
				return r;
			}));
			d.addCallbacks(dojo.hitch(this, "result"), dojo.hitch(this, "error"));
			return d;
		}
	},
	//=======================================================
	// Result Processing
	//=======================================================
	result: function(inResult) {
		var tmp = [];
		var max = this.isDesignLoaded() ? this.designMaxResults : this.maxResults;
		if ((this instanceof wm.ServiceVariable) && !(this instanceof wm.LiveVariable) && inResult 
		    && dojo.isArray(inResult) && inResult.length > 1 && max > 0) {
			var cnt = 0;
			for (var o in inResult) {
				tmp[cnt] = inResult[cnt];
				cnt++;
				if (max > 0 && cnt == max) break;
			}
			this.processResult(tmp);
			return tmp;
		} else {
			this.processResult(inResult);
			return inResult;
		}
	},
	processResult: function(inResult) {
		this.onResult(inResult);
		this.onSuccess(inResult);
		this.$.queue.update();
	},
	error: function(inError) {
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
		var errCodes = inError.message.match(/(\d+)$/);
		var errCode = (errCodes) ? errCodes[0] : "";

		// If the failer is a security access error, AND if its NOT a security error that comes from live view 
		// (happens when a project accesses the server while running within studio), then tell the user to log back in.
		// Also don't repeat this alert more than once every 3 minutes (it takes 4 server accesses to open a page, so thats 4 alerts in a row!)
		if (errCode == 403) {
		  dojo.publish("session-expiration-servicecall", [this]);
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
	/** @lends wm.ServiceCall.prototype */
	doDesigntimeUpdate: function() {
		this.designTime = true;
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
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "service":
				return makeSelectPropEdit(inName, inValue, this.getServicesList(), inDefault);
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
					return makeSelectPropEdit(inName, inValue, methods, inDefault);
				break;
			case "queue":
			case "updateNow":
			case "clearInput":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "updateNow":
				return this.update();
			case "queue":
				this.showQueueDialog();
				return;
			case "clearInput":
				return this.doClearInput();
		}
		return this.inherited(arguments);
	}
});
wm.Object.extendSchema(wm.ServiceCall, {
      startUpdateComplete: { ignore: 1}
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
	getArgs: function() {
		var data= this.getData(), args=[], d;
		// convert to array
		for (var p in this._dataSchema) {
			if (data !== undefined)
				d = data[p];
			args.push(d !== undefined ? d : null);
		}
		return args;
	}
});

wm.Object.extendSchema(wm.ServiceInput, {
	dataSet: { ignore: 1, defaultBindTarget: false, isObject: true, type: "any"}
});

wm.ServiceInputVariable = wm.ServiceInput;
