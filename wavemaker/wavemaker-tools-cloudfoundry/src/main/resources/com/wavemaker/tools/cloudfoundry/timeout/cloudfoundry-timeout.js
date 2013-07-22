/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
/*jshint dojo:true*/

(function() {
    "use strict";
    var TIMEOUT = 1000 * 60;

    dojo.require("dojox.uuid.generateRandomUuid");

    // Replace XHR methods with long poll aware versions
    dojo.xhrGet = xhrLongPollOnTimeout(dojo.xhrGet);
    dojo.xhrPost = xhrLongPollOnTimeout(dojo.xhrPost);
    dojo.xhrPut = xhrLongPollOnTimeout(dojo.xhrPut);
    dojo.xhrDelete = xhrLongPollOnTimeout(dojo.xhrDelete);
    dojo.rawXhrPost = xhrLongPollOnTimeout(dojo.rawXhrPost);

    /**
     * Create a new xhr function that switches to long-polling for a response on
     * a gateway timeout.
     * 
     * @param originalXhr
     *            the original xhr function
     * @return a xhr function that supports long poll on timeout
     */
    function xhrLongPollOnTimeout(originalXhr) {
        return function(args) {

            var requestId = dojox.uuid.generateRandomUuid();
            var newArgs = dojo.mixin({}, args);
            var requestHeader = {
                "X-CloudFoundry-Timeout-Protection-Initial-Request" : requestId
            };

            // Add a header, remove any load and error functions and attach our
            // own handle
            newArgs.headers = dojo.mixin(dojo.clone(args.headers),
                    requestHeader);
            delete newArgs.load;
            delete newArgs.error;
            newArgs.handle = handleXhr;
            newArgs.failOk = true;

            var deferred = new dojo.Deferred(); 
            
            // Call the original DOJO implementation with our new args
            originalXhr(newArgs);
            
            return deferred;

            function handleXhr(result, ioargs) {
                var timeout = null;
                if (ioargs.xhr.status === 504) {
                    // Handle 504 gateway timeout by switching to long polling
                    // Setup an ultimate timeout, this will be cleared on success
                    timeout = setTimeout(function() {
                        sendXhrResponse(result, ioargs);
                        timeout = null;
                    }, TIMEOUT);
                    // Start long polling for response
                    longPollForResult(timeout);
                } else {
                    // If we have no timeout, return the result
                    sendXhrResponse(result, ioargs);
                }
            }

            function longPollForResult(timeout) {
                originalXhr({
                    headers : {
                        "X-CloudFoundry-Timeout-Protection-Poll" : requestId
                    },
                    url : args.url,
                    handle : function(result, ioargs) {
                        if (ioargs.xhr.status === 204 && ioargs.xhr.getResponseHeader("X-CloudFoundry-Timeout-Protection-Poll") === requestId) {
                            // No content returned as yet, continue to poll
                            if (timeout) {
                                longPollForResult(timeout);
                            }
                        } else {
                            // Poll response received, cancel and timeouts and finish
                            clearTimeout(timeout);
                            sendXhrResponse(result, ioargs);
                        }
                    }
                });
            }

            function sendXhrResponse(result, ioargs) {
                var isError = (result instanceof Error);
                if (dojo.isFunction(args.handle)) {
                    args.handle(result, ioargs);
                }
                if(!isError) {
                    if (dojo.isFunction(args.load)) {
                        args.load(result, ioargs);
                    }
                    deferred.callback(result);
                } else {
                    if (dojo.isFunction(args.error)) {
                        args.error(result, ioargs);
                    }
                    deferred.errback(result);
                }
            }
        };
    }
})();
