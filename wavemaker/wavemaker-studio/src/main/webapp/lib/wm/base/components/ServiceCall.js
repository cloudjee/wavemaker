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

    /* Change to true once startUpdate has called update() */
    _startUpdateComplete: false,
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
        wm.fire(this._requester, "cancel");
        delete this._requester;
        this.inherited(arguments);
    },
    init: function() {
        this.inherited(arguments);
        this._inFlightBacklog = [];
        if (this._isDesignLoaded) {
            this.subscribe("wmservices-changed", dojo.hitch(this, "servicesChanged"));
        }
    },
    postInit: function() {
        this.inherited(arguments);
        this.connectStartUpdate();
        if (!this.$.queue) new wm.ServiceQueue({name: "queue", owner: this});

        this.initInput();
        this.setService(this.service);
        this._setOperation(this.operation);
    },
    initInput: function() {
        this.input = this.$.input;
        if (!this.input) this.input = this.createInput();
        this.subscribe(this.input.getRuntimeId() + "-changed", this, "inputChanged");
    },
    /* Shortcut for setting the input */
    setInput: function(inDataSet) {
        if (this.$.input) {
            this.$.input.setDataSet(inDataSet);
        }
    },
    /* Sets the service for the ServiceCall, and updates its operation and operationInfo and inputs */
    setService: function(inService) {
        if (this._inSetService) return; /* Avoid infinite recursion */
        try {
            this._inSetService = true;
            this.service = inService;
            var owner = this.getOwnerApp();

            this._service = wm.services.getService(this.service, owner && owner.declaredClass == "StudioApplication") || new wm.Service({});
            wm.fire(this._service, "setServiceCall", [this]);
            this._setOperation(this.operation, 1); // update the operation's type; forceUpdate needed so that if the type name is the same but fields have changed it will still get updated
                              
        } catch (e) {
        } finally {
            delete this._inSetService;
        }
    },

    /* If the types have changed, reobtain our type and input type and operations info.  Design time only */
    wmTypesChanged: function() {
        var owner = this.getOwnerApp();
        this._service = wm.services.getService(this.service, owner && owner.declaredClass == "StudioApplication") || new wm.Service({});
        wm.fire(this._service, "setServiceCall", [this]);
        this._setOperation(this.operation, 1); // update the operation's type; forceUpdate needed so that if the type name is the same but fields have changed it will still get updated
    },
    
    /* Set the operation and update the inputs */
    _setOperation: function(inOperation, forceUpdate) {
        this.operation = inOperation;
        this._operationInfo = this.getOperationInfo(this.operation);
        this.operationChanged(forceUpdate);
    },

    /* Sets the operation and updates the data if autoUpdate is set */
    setOperation: function(inOperation) {
        this._setOperation(inOperation);
        this.doAutoUpdate();
    },

    /* Get the parameters for the operation */
    getOperationInfo: function(inOperation) {
        return (this._service && this._service.getOperation(inOperation)) || {};
    },

    /* Force the input to update its fields */
    operationChanged: function(forceUpdate) {
        this.input.operationChanged(this.operation, this._operationInfo.parameters);
    },
    
    /* Create the ServiceInput component */
    createInput: function() {
        var i = new wm.ServiceInput({name: "input", owner: this });
        i.operationChanged(this.operation, this._operationInfo.parameters);
        return i;
    },
    
    /* Any time the input is changed, fire doAutoUpdate() */
    inputChanged: function() {
        this.doAutoUpdate();
    },
    
    /* Fire doStartUpdate when the page finishes loading.  
     * NOTE: If owner is a Composite or Application, this may not work
     */
    connectStartUpdate: function() {
        if (this.owner && this.owner.start)
            this.connectOnce(this.owner, "start", this, "doStartUpdate");
    },

    /* Changes autoUpdate, and optionally calls update() */
    setAutoUpdate: function(inAutoUpdate) {
        this.autoUpdate = inAutoUpdate;
        this.doAutoUpdate();
    },

    /* Chagnes startUpdate, and optionally cals update */
    setStartUpdate: function(inStartUpdate) {
        this.startUpdate = inStartUpdate;
        if (this.startUpdate && !this._loading && this.isDesignLoaded()) {
            this.updateInternal();
        }
    },

    /* Don't fire startUpdate if the component already has data saved from a previous session using the phonegap saveInPhoneGap property,
     * unless autoUpdate is also selected.
     * Not done for saveInCookie because saveInCookie is intended for saving much smaller chunks of data, and not entire server queries.
     * saveInCookie is probably disabled for ServiceVariables.
     */
    canStartUpdate: function() {
        return this.startUpdate && !this._loading && (!window["PhoneGap"] || !this.saveInPhoneGap || this.isEmpty() || this.autoUpdate);
    },

    /* Call udpate if startUpdate is true */
    doStartUpdate: function() {
        if (this.canStartUpdate()) {
            this.updateInternal();
            this._startUpdateComplete = true;
        }
    },

    /* Don't fire autoUpdate if startUpdate is true and hasn't yet set _startUpdateComplete to true */
    canAutoUpdate: function() {
        return (this.autoUpdate && !this._loading && (!this.startUpdate || this._startUpdateComplete || this.isDesignLoaded()));
    },

    /* Call update if autoUpdate is true */
    doAutoUpdate: function() {
        if (this.canAutoUpdate()) {
            /* wait 20ms so that UI events can finish firing and so other inputs have time to be set */
            wm.job(this.getRuntimeId() + ".doAutoUpdate", wm.isMobile ? 20 : 1, dojo.hitch(this, "updateInternal"));
        }
    },
    
    /* Public method for firing the service call */
    update: function() {
        // moved to RBacPlugin; if (djConfig.isDebug) try { this.log("update", arguments.callee.caller.nom || arguments.callee.caller.name || "anonymous");} catch(e) {}
        return this._isDesignLoaded ? this.doDesigntimeUpdate() : this._update();
    },

    /* Users call "update" event handlers and autoUpdate/startUpdate call updateInternal; used for tracking/debugging purposes */
    updateInternal: function() {
        return this._isDesignLoaded ? this.doDesigntimeUpdate() : this._update();
    },

    /* If the ServiceCall is already firing, it can't fire the current request; add it to our request queue
    * if inFlightBehavior specifies to do so.
    */
    addToBacklog: function() {
        var d;
        if (this.inFlightBehavior == "executeLast") this._inFlightBacklog.pop();
        if (this.inFlightBehavior == "executeLast" || this.inFlightBehavior == "executeAll") {
            d = new dojo.Deferred();
            this._inFlightBacklog.push({
                args: this.getArgs(),
                operation: this.operation,
                deferred: d,
                eventChain: app.debugDialog ? app.debugDialog.cacheEventChain() : undefined
            });
        }
    },

    /* Internal version of update method; please only call update() or updateInternal() */
    _update: function() {
        if (this._requester && !this._isDesignLoaded) {
            var d = this.addToBacklog();
            return d;
        }
        if (this.canUpdate()) {
            this.onBeforeUpdate(this.input);
            wm.cancelJob(this.getRuntimeId() + ".doAutoUpdate"); // just in case there's a job already scheduled
            return this.request();
        }
    },
    
    /* Sets info.canUpdate to false if the ServiceCall is unable to fire */
    canUpdate: function() {
        var info = {canUpdate: this._getCanUpdate() };
        this.onCanUpdate(info);
        return info.canUpdate;
    },

    /* ServiceCall can not fire if there isn't a service or operation */
    _getCanUpdate: function() {
        return this._service && this.operation;
    },

    /* Get the args from the input component. */
    getArgs: function() {
        return this.input.getArgs();
    },

    /* Lookup the operationType from the service definitions.   Values include "hqlQuery", "" */
   getOperationType: function() {
        var service = this._service;
        var operation;
        if (service) {
            operation = service._operations[this.operation];
        }
        if (operation) {
            return operation.operationType;
        } else {
            return "";
        }
   },

    /* inArgs optional too... typically provided by calls from the request backlog/inflight queue*/
    request: function(inArgs, optionalOp, optionalDeferred) {
        var args = inArgs || this.getArgs();
                
        if (djConfig.isDebug) {
            console.log("REQUEST   Component: " + this.getRuntimeId() + ";  Operation: " + (optionalOp || this.operation));
        }
        
        /* Tell the Service component to fire */
        var d = this._requester = this._service.invoke(optionalOp || this.operation, args, this.owner, this);

        /* If a custom deferred is passed in, tie its onResult/onError handling to the Service that is being fired */
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
    },

    /* The service is fired, take care of misc post-firing tasks like tieing the deferred to our result and error methods */
    processRequest: function(inDeferred) {
        var d = inDeferred;
        if (d) {
            d.addCallbacks(dojo.hitch(this, "result"), dojo.hitch(this, "error"));
            return d;
        }
    },
    
    /* This is called when the Service completes its call successfully.  This does cleanup, and calls processResult */
    result: function(inResult) {
        this._requester = false;
        this.processResult(inResult);

        /* Handle the backlog/request queue */
        this._updateNextInQueue();

        return inResult;
    },

    /* Fire the next call in the backlog.  We use wm.onidle mostly so that all of the side effects and cleanup have time to complete before firing the next call. */
    _updateNextInQueue: function() {
        if (!this._isDesignLoaded && this._inFlightBacklog && this._inFlightBacklog.length) {
            wm.onidle(this, function() {
                var backlog = this._inFlightBacklog.shift();
                this.request(backlog.args, backlog.operation, backlog.deferred);
            });
        }
    },

    /* Called by result(); calls onResult and onSuccess when the ServiceCall completes */
    processResult: function(inResult) {
        this.onResult(inResult);
        this.onSuccess(inResult);
        if (!this.isDestroyed && this.$.queue) this.$.queue.update();
    },

    /* Called when the service fails; calls processError and does cleanup */
    error: function(inError) {
        this._requester = false;
        this.processError(inError);

        /* Handle the backlog/request queue */
        this._updateNextInQueue();

        return inError;
    },

    /* Called by error(); calls onResult and onError */
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
    }
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
        _getSchemaForType: function(inType) {
        return this.owner && this.owner._operationInfo ? this.owner._operationInfo.parameters : null;
    },
    isDataProp: function(inProp) {
        // Note: it's important we assume all properties are data properties unless _dataSchema is set
        // Since the dataSchema is set externally, 
        // bindings may set data properties before data schema is set, creating errors.
        return wm.isEmpty(this._dataSchema) || (inProp in this._dataSchema) ;
    },

    /* When the operation changes, update the input schema.  ServiceVariable will override and add autoUpdate calls */
    operationChanged: function(inType, inSchema) {
        this.setType(inType + "Inputs");
        this.setDataSchema(inSchema);
        // input bindings may need to reinitialize after gleaning
        // operation type information (in light of constants)
        if (this.$.binding && inSchema)
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
            if (data) {
            if (data[p] instanceof Date) {
                d = data[p].getTime();
            } else {
                d = data[p];
            }
            } else {
            d = undefined;
            }
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



/* Design only code included here because dojo.extend doesn't work well with multiple-inheritance; this needs to be defined before the subclasses are created */
wm.ServiceCall.extend({
    clearInput: "(clear input)",
    updateNow: "(update now)",
    queue: "(serviceCalls)",
    servicesChanged: function() {
        if (this.service) {
            var owner = this.getOwnerApp();
            this._service = wm.services.getService(this.service, // name of service
                                                   owner && owner.declaredClass == "StudioApplication"); // hide from client
            if (!this._service) this._service = new wm.Service({});
            
            // update the operation's type; forceUpdate needed so that if the type name is the same but fields have changed it will still get updated   
            this._setOperation(this.operation, 1);
        }
    },
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

wm.ServiceInputVariable = wm.ServiceInput;
