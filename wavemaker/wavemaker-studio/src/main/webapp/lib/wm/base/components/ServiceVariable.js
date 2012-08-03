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

dojo.provide("wm.base.components.ServiceVariable");
dojo.require("wm.base.components.Variable");
dojo.require("wm.base.components.ServiceCall");


//===========================================================================
// Main service calling class: calls services with input data and returns data
//===========================================================================
/**
    Main service calling class: calls services with input data and returns data
    @name wm.ServiceVariable
    @class
    @extends wm.Variable
    @extends wm.ServiceCall
*/
dojo.declare("wm.ServiceVariable", [wm.Variable, wm.ServiceCall], {
    // Points to a widget to cover with a loading dialog while firing this call
    loadingDialog: null,

    // Instead of returning JSON response, return a downloadable file; NOTE: No onResult/onSuccess/onError callbacks
    downloadFile: false,

    /* Current page of data */
    _page: 0,

    /* Maximum number of results to return per page */
    maxResults: 0,
    designMaxResults: 50,
    transposeHashMap: function(inData) {
        var data = [];
        wm.forEachProperty(inData, function(inValue, inName) {
            data.push({name: inName, dataValue: inValue});
        });
        return data;
    },
    /* Handle a successful response to a service call */
    processResult: function(inResult) {
        if (wm.isHashMapType(this.type)) {
            inResult = this.transposeHashMap(inResult);
        }
        this.setData(inResult);
        if (this.service == "securityService" && this.operation == "logout") wm.logoutSuccess();
        this.inherited(arguments);
    },

    /* Handle an error returned by a service call */
    processError: function(inError) {
        /* WARNING: This is a bit sloppy; there is no gaurentee that the inputs have not changed between the last call and the response firing
         * this error handler.
         */
        if (inError && inError.message && inError.message.indexOf("Invalid Long Polling Request:") === 0) {
            this.request(); // connectionTimeout updated by JsonRpcService; we just have to refire the failed call
            return;
        }

        this.handleSecurityErrors(inError);
        this.inherited(arguments);
    },

    /* If the errors are security related, publish the fact so the app knows its no longer logged in */
    handleSecurityErrors: function(inError) {
        var errCodes = (dojo.isObject(inError) ? inError.message : inError).match(/(\d+)$/);
        var errCode = (errCodes) ? errCodes[0] : "";

        // If the failure is a security access error, AND if its NOT a security error that comes from live view
        // (happens when a project accesses the server while running within studio), then tell the user to log back in.
        // Also don't repeat this alert more than once every 3 minutes (it takes 4 server accesses to open a page, so thats 4 alerts in a row!)
        if (errCode == 403) {
            dojo.publish("session-expiration-servicecall", [this]);
            if (app && app.onSessionExpiration) app.onSessionExpiration();
        } else {
            dojo.publish("service-variable-error", [this, inError]);
        }
    },

    /* ServiceCall doesn't have a type; when the type is set, we need to update our service info
    * (i.e. our input fields) and reinspect */
    setType: function() {
        this.inherited(arguments);
        if (this._isDesignLoaded && this.input) {
            this.setService(this.service);
            if (this == studio.selected) studio.inspector.inspect(this);
        }

    },

    /* ServiceCall's operationChanged updates the input component type, but as ServiceCall itself lacks a type,
     * subclasses must update their own types
     */
    operationChanged: function(forceUpdate) {
        this.inherited(arguments);
        // output has named type matching operation returnType
        var op = this._operationInfo;
        if (op || forceUpdate) {
          this.setType(op.returnType);
          this.clearData();
        }
        if ((this.autoUpdate || this.startUpdate) && !this._loading && this.isDesignLoaded()) {
          this.update();
        }
    },

    /* If its an HQL Query, then getArgs has some extra stuff to add to the parameter list */
    getArgs: function() {
        var args = this.inherited(arguments);
        var operationType = this.getOperationType();
        if (operationType == "hqlquery") {
            var max = this.isDesignLoaded() ? this.designMaxResults : this.maxResults;
            var pagingOptions = max ? { maxResults: max, firstResult: this.firstRow || 0} : {};
            args.push(pagingOptions);
        }
        return args;
    },
    
    /* Extra info that the debugger wants about this call */
    getDebugArgs: function() {
        return this.input.getData();
    },

    /* Paging Methods */
    getTotal: function() {
        return this.getCount();
    },
    getPageCount: function() {
        return Math.ceil(this.getTotal() / (this.getCount() || 1));
    },
    setPage: function(inPage) {
        this._page = Math.max(0, Math.min(this.getPageCount() - 1, inPage));
        this.firstRow = this._page * this.maxResults;
        this.update();
    },
    getPage: function() {
        return this._page;
    },
    setFirstPage: function() {
        this.setPage(0);
    },
    setPreviousPage: function() {
        this.setPage(this._page-1);
    },
    setNextPage: function() {
        this.setPage(this._page+1);
    },
    setLastPage: function() {
        this.setPage(this.getPageCount());
    },

    /* Adds handling of the loadingDialog to ServiceCall._update() */
    _update: function() {
        if (this.loadingDialog && !this._isDesignLoaded) {
            if (this.loadingDialog instanceof wm.LoadingDialog == false) {
                this.loadingDialog = new wm.LoadingDialog({
                    owner: this,
                    name: "loadingDialog",
                    widgetToCover: this.loadingDialog
                });
                this.loadingDialog.setServiceVariableToTrack(this);
            }
        }
        return this.inherited(arguments);
    },


    /* DEBUGGING METHODS AND OVERRIDES */

    toString: function(inText) {
       var t = inText || "";
       t += "; " + wm.getDictionaryItem("wm.ServiceVariable.toString_FIRING", {
           isFiring: Boolean(this._requester)
       });
       return this.inherited(arguments, [t]);
   },
    
    log: function(eventType, /* autoUpdate, autoStart, eventHandler */
       callingMethod, /* optional; indicates who really called this */
       backlogObj, /* optional; used to provide an old eventChain */
       errorMsg /* optional; for processError only */ ) {
        if (!app.debugDialog) return;
        if (!this.debugId) this.debugId = [];

        /* STEP 1: Setup the _debug object used by the wm.debugger.ServicePanel */
        if (eventType != "serviceCall" && eventType != "serviceCallResponse") {
            this._debug = {
                trigger: callingMethod || eventType,
                eventName: eventType,
                request: "",
                lastUpdate: new Date()
            };
        }


        /* If the eventType is autoUpdate, then this is triggered by a change to the input/filter/sourceData value; in other words,
         * a change to a wm.Variable.  This means that the notification for the change came from a call to dataValueChanged;
         * See if we can find what called dataValueChanged and log that.
         * WARNING: Sometimes the callstack goes into a loop, so don't go deeper than 15 into the stack.
         */
        if (eventType == "autoUpdate") { /* This block logs it in wm.debugger.ServicePanel */
            try {
                var i = 0;
                var caller = arguments.callee.caller;
                while (caller && caller.nom != "dataValueChanged" && i < 15) {
                    caller = caller.caller;
                    i++;
                }
                if (caller && caller.nom == "dataValueChanged") {
                    var newValue = caller.arguments[1];
                    this._debug.eventName = "inputChanged: " + caller.arguments[0] + " set to " + (newValue instanceof wm.Component ? newValue.toString() : newValue);
                }
            } catch (e) {}

            /* This block logs it in wm.debugger.EventsPanel */
            this.debugId.push({
                eventType: eventType,
                id: app.debugDialog.newLogEvent({
                    eventType: "autoUpdate",
                    eventName: "autoUpdate",
                    method: "update",
                    affectedId: this.getRuntimeId(),
                    firingId: this.getRuntimeId()
                })
            });

        } else if (eventType == "startUpdate") {
            this.debugId.push({
                eventType: eventType,
                id: app.debugDialog.newLogEvent({
                    eventType: "startUpdate",
                    eventName: "startUpdate",
                    method: "update",
                    affectedId: this.getRuntimeId(),
                    firingId: this.owner.getRuntimeId()
                })
            });
        } else if (eventType == "autoUpdateOnStart") {
            var page = this.getParentPage() || app;
            this._debug.trigger = "autoUpdate" + (page && page._loadingPage ? ": onStart" : "unknown source");

            this.debugId.push({
                eventType: eventType,
                id: app.debugDialog.newLogEvent({
                    eventType: "autoUpdate",
                    eventName: "autoUpdate",
                    method: "update",
                    affectedId: this.getRuntimeId(),
                    firingId: this.owner.getRuntimeId()
                })
            });
        }

        /* Calls to "update" are typically made from user written methods (I've changed most internal calls to "updateInternal" */
        else if (eventType == "update") {
            this.debugId.push({
                eventType: eventType,
                id: app.debugDialog.newLogEvent({
                    eventType: "update",
                    eventName: callingMethod || "update",
                    method: "update",
                    affectedId: this.getRuntimeId(),
                    firingId: ""
                })
            });
        } else if (eventType == "serviceCall") {
            if (backlogObj && backlogObj.eventChain) {
                var currentEventChain = app.debugDialog.cacheEventChain();
                app.debugDialog.restoreEventChain(backlogObj.eventChain);
            }
            this.debugId.push({
                eventType: eventType,
                id: app.debugDialog.newLogEvent({
                    eventType: "serviceCall",
                    eventName: "update",
                    method: "<i>CallingServer</i>",
                    affectedId: this.getRuntimeId(),
                    firingId: this.getRuntimeId()
                })
            });
            this.debugEventChain = app.debugDialog.cacheEventChain(); // use this when the request is completed to stitch together the event sequence
            if (currentEventChain) {
                app.debugDialog.restoreEventChain(currentEventChain);
            }
        } else if (eventType == "serviceCallResponse") {
            app.debugDialog.restoreEventChain(this.debugEventChain);
            delete this.debugEventChain;
            this.debugId.push({
                eventType: eventType,
                id: app.debugDialog.newLogEvent({
                    eventType: "serviceCallResponse",
                    eventName: "<i>CallingServer</i>",
                    method: errorMsg ? "processError" : "processResult",
                    affectedId: this.getRuntimeId(),
                    firingId: this.getRuntimeId()
                })
            });
            if (this._debug && this._debug.lastUpdate) {
                this._debug.duration = new Date().getTime() - this._debug.lastUpdate.getTime();
            }
        }

        if (eventType != "serviceCall" && eventType != "serviceCallResponse" && this._debug) {
            this._debug.eventId = this.debugId[this.debugId.length - 1].id;
        }

    },
    endLog: function(eventType) {
        if (this.debugId && this.debugId.length) {
            var debugId = this.debugId.pop();
            if (debugId.eventType == eventType) {
                app.debugDialog.endLogEvent(this.debugId);
            }
        }
        if (eventType == "serviceCallResponse") {
            app.debugDialog.clearEventChain();
        }
    },
    inputChanged: function() {
        if (this.autoUpdate) {
            if (djConfig.isDebug && app.debugDialog) this.log("autoUpdate");
            this.inherited(arguments);
            if (djConfig.isDebug && app.debugDialog) this.endLog("autoUpdate");
        }
    },
    /* Add logging to doStartUpdate */
    doStartUpdate: function() {
        if (this.canStartUpdate()) {
            if (djConfig.isDebug && app.debugDialog) this.log("startUpdate");
            this.inherited(arguments);
            if (djConfig.isDebug && app.debugDialog) this.endLog("startUpdate");
        }
    },
    doAutoUpdate: function() {
        if (this.canAutoUpdate()) {
            if (djConfig.isDebug && app.debugDialog && !this._debug && this._inPostInit) this.log("autoUpdateOnStart");
        
            this.inherited(arguments);

            if (djConfig.isDebug && app.debugDialog) this.endLog("autoUpdateOnStart");
        }
    },
    request: function(inArgs, optionalOp, optionalDeferred) {
        if (djConfig.isDebug && app.debugDialog && this._debug) this._debug.request = this.getDebugArgs();
        if (djConfig.isDebug && app.debugDialog) {
            this.log("serviceCall", null, optionalOp);
            this.endLog("serviceCall", null, optionalOp);
        }

         if (!this.downloadFile) {
            return this.inherited(arguments);
        } else {
            var args = inArgs || this.input.getArgsHash();
            var baseurl = window.location.href;
            baseurl = baseurl.replace(/\?.*$/,"");
            baseurl = baseurl.replace(/\/[^\/]*$/,"/");
            var urlStr = baseurl + this._service._service.serviceUrl.replace(/\.json$/,".download");

            /* Delete the last iframe */
            var iframe = dojo.byId("downloadFrame");
            if (iframe) iframe.parentNode.removeChild(iframe);

            /* Create a new iframe */
            iframe = document.createElement("iframe");
            dojo.attr(iframe, {     id: "downloadFrame",
                                    name: "downloadFrame"});
            dojo.style(iframe, {    top: "1px",
                                    left: "1px",
                                    width: "1px",
                                    height: "1px",
                                    visibility: "hidden"
                                });
            dojo.body().appendChild(iframe);

            /* Get the document of the iframe */
            var iframedoc= iframe.contentDocument || iframe.contentWindow.document;
            iframedoc.open("text/html"); // required by ie8 and earlier so that iframedoc.body exists
            iframedoc.close();

            /* Create a form.  Add a "method" parameter to it using an input element */
            var form =  iframedoc.createElement("form");
            dojo.attr(form, {   id: "downloadForm",
                                method: "POST",
                                action: urlStr
                            });
            var method = iframedoc.createElement("input");
            dojo.attr(method, { name: "method",
                                value: optionalOp || this.operation});
            form.appendChild(method);

            /* Add one input per parameter */
            wm.forEachProperty(args, function(value, name) {
                var input = iframedoc.createElement("textarea");
                dojo.attr(input, {  name: name,
                                    value: value});
                form.appendChild(input);
            });

            iframedoc.body.appendChild(form);
            form.submit();

        }
    },

    /* Adds logging to result method */
    result: function(inResult) {
        delete this._lastError;
        if (app.debugDialog && djConfig.isDebug) this.log("serviceCallResponse");
        var result = this.inherited(arguments);
        if (app.debugDialog && djConfig.isDebug) this.endLog("serviceCallResponse");
        return inResult;
    },

 

    /* Adds logging to the error method */
    error: function(inError) {
        if (djConfig.isDebug) this.log("serviceCallResponse");
        this._lastError = inError;
        this.inherited(arguments);
        if (djConfig.isDebug) this.endLog("serviceCallResponse");
        return inError;
    }

});

