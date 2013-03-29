/*
 *  Copyright (C) 2008-2013 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.components.LogoutVariable");
dojo.require("wm.base.components.ServiceVariable");

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
dojo.declare("wm.LogoutVariable", wm.ServiceVariable, {
    service: "securityService",
    operation: "logout",
    autoUpdate: 0,
    startUpdate: 0,
    clearDataOnLogout: true,
    logoutNavCall: null,
    init: function() {
        this.inherited(arguments);
        if(!this.clearDataOnLogout || window["PhoneGap"]) {
            this.logoutNavCall = new wm.NavigationCall({
                name: "logoutNavCall",
                owner: this,
                operation: "gotoPage"
            });
            this.logoutNavCall.input.setData({
                pageName: "Login"
            });
        }
    },
    onSuccess: function(inData) {
        if(window["PhoneGap"]) {
            window.localStorage.clear(); // remove any stored information, especially their login information
        }

        if(!this.clearDataOnLogout || window["PhoneGap"]) {
            this.logoutNavCall.update();
        } else {
            window.location.reload();
            /*
              var path = window.location.pathname;
              if (path.match(/[^\/]*\.html/)) {
                  path = path.replace(/[^\/]*\.html/, "login.html");
              } else {
                  if (!path.match(/\/$/)) path += "/";
                  path += "login.html";
              }

              window.location = window.location.protocol + "//" + window.location.host + path + window.location.search;
          */
        }
    },
    onError: function(inError) {
        this.inherited(arguments); /* TODO: Localize this */
        app.alert(wm.getDictionaryItem("wm.LogoutVariable.FAILED", {
            error: inError
        }));
    },
    _end: 0
});


dojo.declare("wm.LoginVariable", wm.ServiceVariable, {
    useDefaultSuccessHandler: true,
    service: "securityService",
    operation: "login",
    _setOperation: function(inOperation) {
	this._service._operations.login = {name: "login",
				     parameters: {
					 username: {type: "string"},
					 password: {type: "string"}
				     },
				     returnType: "java.lang.String"};
	this.inherited(arguments);
    },
    request: function() {
	var user = this.input.getValue("username");
	var pass = this.input.getValue("password");
	if (!user || !pass) {
	    var d = new dojo.Deferred();
	    var e = new Error("Username and Password are required");
	    d.errback(e);
	    this.onResult();
	    this.onError(e);
	    return d;
	}

	var deferred = wm.login([user,pass],
				this.useDefaultSuccessHandler ? null : function() {});
	deferred.addCallbacks(
	    dojo.hitch(this, function() {
		this.onResult();
		this.onSuccess();
	    }),
	    dojo.hitch(this, function(e) {
		this.onResult();
		this.onError(e);
	    })
	);

	return deferred;
    }

});