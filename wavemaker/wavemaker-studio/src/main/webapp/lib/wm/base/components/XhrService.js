/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.components.XhrService");
dojo.require("wm.base.components.Service");

dojo.declare("wm.XhrService", wm.Service, {
    noInspector: true,
    /** @lends wm.PhoneGapService.prototype */
    operation: "",

    /* Static variable shared by all XhrServices */
    _operations: {
        basicRequest: {
            parameters: {
                url: { type: "string" },
                headers: {type: "EntryData", isList: 1},
                requestType: {type: "string"},
                contentType: {type: "string"},
                useProxy: {type: "boolean"}, /* Not yet handled */
                parameters: {type: "EntryData", isList: true} // List of name/value pairs

            },
            returnType: "string" // provide additional operations using some custom tooling in order to get typed return values, and typed parameter lists
        }
    },
    invoke: function(inMethod, inArgs, inOwner) {
        var op = this._operations[inMethod];
        var parameters, requestType, headers, url, contentType, useProxy;
        if (!op) return;
        if (op == this._operations.basicRequest) {
            url = inArgs[0];
            headers = inArgs[1];
            requestType = inArgs[2] || "GET";
             contentType = inArgs[3] || "application/x-www-form-urlencoded";
            useProxy = inArgs[4] === undefined ? true : inArgs[4];
            parameters = inArgs[5];

            var headersHash = {};
            dojo.forEach(headers, function(header) {
                headersHash[header.name] = header.dataValue;
            });

            var parametersHash = {};
            dojo.forEach(parameters, function(p) {
                parametersHash[p.name] = p.dataValue;
            });


            return this._invokeBasicRequest(url, headersHash, requestType, contentType, useProxy, parametersHash, "string", inOwner);
        } else {
            var parameterDef = op.parameters;

            /* Turn inArgs (array of parameters) into a hash of name/value pairs so that we know what name each argument is associated with */
            parameters = {};
            var i = 0;
            wm.forEachProperty(parameterDef, function(parameterObj, parameterName) {
                parameters[parameterName] = inArgs[i];
                i++;
            });
            url = op.url;
            headers = dojo.clone(op.headers) || {}; // headers can come from two places: a default headers structure, and parameters with isHeader
            if (op.requestType !== undefined) {
                requestType = op.requestType;
            } else if (parameters.requestType) {
                type = parameters.requestType;
                delete parameters.requestType;
            } else {
                type = "GET";
            }

            if (op.contentType) {
                contentType = op.contentType;
            } else if (parameters.contentType) {
                contentType = parameters.contentType;
                delete parameters.contentType;
            } else {
                contentType = "application/x-www-form-urlencoded";
            }

            if (op.useProxy !== undefined) {
                useProxy = op.useProxy;
            } else {
                useProxy = parameters.useProxy;
                delete parameters.useProxy;
            }

            var inputs = {};
            wm.forEachProperty(op.parameters, function(parameterDef, parameterName) {
                if (parameterDef.transmitType == "header") {
                    headers[parameterName] = parameters[parameterName];
                } else if (parameterDef.transmitType == "path") {
                    if (!url.match(/\/$/)) url += "/";
                    url += parameterName + "/" + parameters[parameterName];
                } else if (parameters[parameterName] !== undefined) {
                    inputs[parameterName] = parameters[parameterName];
                }
            });
            return this._invokeBasicRequest(url, headers, requestType, contentType, useProxy, inputs, op.returnType, op, inOwner);
        }
    },
    _invokeBasicRequest: function(url, headers, requestType, contentType, useProxy, parameters, returnType, op, inOwner) {
        var d = new dojo.Deferred();

        /* Turn the headers array into a headers hash */

        requestType = requestType.toUpperCase();

        var content;
        switch (contentType) {
        case "application/json":
            content = useProxy ? dojo.toJson(parameters) : parameters;
            break;
        case "application/x-www-form-urlencoded":
            if (!useProxy) {
                content = parameters;
            } else {
                content = "";
                wm.forEachProperty(parameters, function(value, key) {
                    if (content) content += "&";
                    content += escape(key) + "=" + escape(value);
                });
            }
            break;
        }

        /* Use the remoteRESTCall Proxy service */
        if (useProxy) {
            if (this.jsonRpcService && !this.jsonRpcService._service) {
                this.jsonRpcService.destroy();
                delete this.jsonRpcService;
            }
            if (!this.jsonRpcService) {
                this.jsonRpcService = new wm.JsonRpcService({
                    owner: inOwner,
                    service: "waveMakerService"
                });
                this.defaultHeaders = dojo.clone(this.jsonRpcService._service.requestHeaders);
            }
            this.jsonRpcService._service.requestHeaders = dojo.mixin(headers, this.defaultHeaders);
            var dInternal = this.jsonRpcService.requestAsync("remoteRESTCall", [url, content, requestType, contentType]);
        }

        /* No proxy needed, send the call directly */
        else {
            var xhrArgs = {
                headers: headers,
                handleAs: "text",
                contentType: contentType,
                url: url
            };
            switch (contentType) {
            case "application/json":
                xhrArgs.postData = dojo.toJson(parameters);
                break;
            default:
                xhrArgs.content = parameters;
            }
            var dInternal = this._deferred = dojo.xhr(requestType, xhrArgs);
        }

        dInternal.addCallbacks(dojo.hitch(this, "onResult", parameters, op, d), dojo.hitch(this, "onError", parameters, op, d));
        return d;
    },
    onResult: function(parameters, operation, deferred, inResult) {
        var result;
        try {
            if (inResult && inResult.match(/^\s*\{/) {
                result = dojo.fromJson(inResult);
            } else {
                result = {dataValue: inResult};
            }
        } catch (e) {
            result = inResult;
        }
        var typeDef = wm.typeManager.getType(operation.returnType);
        if (typeDef && typeDef.fields) {
            wm.forEachProperty(typeDef.fields, function(fieldDef, fieldName) {
                if (fieldDef.type.toLowerCase() == "date" && typeof result[fieldName] == "string") {
                    result[fieldName] = new Date(result[fieldName]).getTime();
                }
            });
        }
        deferred.callback(result);
    },
    onError: function(parameters, operation, deferred, inError) {
        deferred.errback(inError);
    },


    /* {name: operationName, -- Required
     *  url: operationUrl,   -- Required
     *  type: "GET",         -- If not specified, will be an input as with basicRequest
     *  headers: {name/value pair} -- use this to specify headers that never vary, stuff like contentType that we haven't baked in
     *  useProxy: true/false, -- If undefined, will be an input as with basicRequest
     *  parameters: standard parameters object for an operation specifying what parameters should be visible to the developer
     *  returnType: "EntryData" -- If unspecified, is set to "string"
     * }
     */
    addOperation: function(inOperation) {

        /* If the useProxy doesn't have a value, let the user set it */
        if (inOperation.useProxy === undefined) {
            inOperation.parameters.useProxy = this._operations.basicRequest.parameters.useProxy;
        }

        /* If there is no returnType specified, then the user will have to set it. This should really be set */
        if (!inOperation.returnType) {
            inOperation.returnType = "string";
        }

        /* If no contentType specified, then the user can set this.  This should really be set */
        if (!inOperation.contentType) {
            inOperation.contentType = "application/x-www-form-urlencoded"; // TODO: find the right name for this
        }
        this._operations[inOperation.name] = inOperation;
    },
    removeOperation: function(operationName) {
        delete this._operations[operationName];
    }
});

wm.services.add({name: "xhrService", ctor: "wm.XhrService", isClientService: true, clientHide: false});



dojo.declare("wm.XhrDefinition", wm.Component, {
    noInspector: true,
    url: "",
    requestType: "GET",
    headers: null,
    useProxy: true,
    parameters: null,
    returnType: "string",
    contentType: "application/x-www-form-urlencoded",

    postInit: function() {
       this.inherited(arguments);
       this.initType();
   },
   destroy: function() {
           wm.XhrService.prototype.removeOperation(this.name);
           this.inherited(arguments);
   },
   initType: function() {
       if (this.url) {
           wm.XhrService.prototype.addOperation({
               name: this.name,
               url: this.url,
               requestType: this.requestType,
               headers: this.headers,
               parameters: this.parameters,
               useProxy: this.useProxy,
               contentType: this.contentType,
               returnType: this.returnType
           });
       }
   },
   designSelect: function() {
       var d = studio.navGotoEditor("XHRServiceEditor", studio.webServiceTab, this.name + "Layer", this.name);
       /*
    var d = studio.xhrDesignerDialog || new wm.PageDialog({owner: studio,
                                   _classes: {domNode: ["studiodialog"]},
                                   name: "xhrDesignerDialog",
                                   modal: false,
                                   hideControls: true,
                                   pageName: "XHRServiceEditor",
                                   width: "800px",
                                   height: "800px",
                                   title: "XHR Service Editor"});
    d.show();
    */
       d.page.setService(this);
   }
});

wm.Object.extendSchema(wm.XhrDefinition, {
    returnType: {type: "string"},
    url: {type: "string"},
    useProxy: {type: "boolean"},
    requestType: {type: "string"},
    contentType: {type: "string"},
    parameters: {type: "any"},
    headers: {type: "any"}
});