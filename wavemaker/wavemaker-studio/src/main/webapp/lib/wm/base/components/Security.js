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

dojo.provide("wm.base.components.Security");
dojo.require("dojo.cookie");

wm.disableUserPrincipalCookie = false;

wm.login = function(args, loginSuccessCallback, loginFailedCallback, properties, projectName) {
    if (properties === undefined || properties == null) {
	properties = {
	    j_username : args[0],
	    j_password : args[1],
        hash:args[2]
	    };
    }

    var deferred = new dojo.Deferred();

    var url = (projectName ? "/" + projectName + "/" : "") + "j_spring_security_check";
    if (wm.xhrPath) url = wm.xhrPath + url;
    var def= dojo.xhrPost({
	url: url,
	content : properties,
	handleAs: "json"});

    var onError = function(inError) {
	if (loginFailedCallback) {
	    loginFailedCallback(inError.toString());
	}
	deferred.errback(inError);
    };

    def.addErrback(onError);

    var onSuccess = function(inUrl) {
        if (app && app._loginDialog && app._loginDialog.showing) app._loginDialog.hide();

        /* Fire any custom onSuccess handlers BEFORE we do a navigation that will unload the developer's components */
        deferred.callback(inUrl);

        var pathname = location.protocol + "//" + location.host + location.pathname + location.search; // sometimes using search helps and sometimes it breaks this test; still working out what is going on
        if (dojo.cookie.isSupported() && !wm.disableUserPrincipalCookie) {
            var p = {
                username: properties.j_username,
                roles: wm.getUserRoles(true)
            };
            wm.setUserPrincipal(p);
        } else {
            wm.roles = wm.getUserRoles(true);
        }
        dojo.publish("wmRbacUpdate");
        if (window["PhoneGap"] && wm.serverTimeOffset === undefined) {
            app.getServerTimeOffset();
        }
        if (loginSuccessCallback) {
            loginSuccessCallback(inUrl);
        } else if (window["PhoneGap"]) {
            app.loadPage(app.pageContainer._initialPageName); // this is where tabletMain/phoneMain/main pageName are stored for now

            // Typically this tests to see if we're on login.html and being directed to index.html
        } else if (pathname != inUrl) {
            location.href = inUrl

            // If the page name is login, but app.main is not login, then we're on the real project,
            // not the special project used for logging in.  If we're on the real project, a wm page nav is all that is needed
        } else if (app._page.name == "login" && app.main != "login") {
            app.loadPage(app.main);
        }
    };

    def.addCallback(function(response, ioArgs) {
	if (response.url) {
	    onSuccess(response.url);
	} else if (response.error) {
	    onError(new Error(response.error));
	}
    });

    return deferred;
}

wm.getUserPrincipal = function() {
	return wm.disableUserPrincipalCookie ? {} :
		dojo.fromJson(dojo.cookie("wmUserPrincipal")) || {};
}

wm.setUserPrincipal = function(userPrincipal) {
	dojo.cookie("wmUserPrincipal", dojo.toJson(userPrincipal));
}

wm.clearUserPrincipal = function() {
	dojo.cookie("wmUserPrincipal", null, {expires: -1});
}

wm.getUserRoles = function(force) {
    if (!force) {
    	if (!wm.disableUserPrincipalCookie) {
    	    if (wm.getUserPrincipal().roles) {
    		return wm.getUserPrincipal().roles;
    	    }
    	} else if (wm.roles) {
    	    return wm.roles;
    	}
    }
	var s = wm.securityService || (wm.securityService =
		new wm.JsonRpcService({name: "securityService", sync: true}));
	try {
		if (s.ready) {
			s.request("getUserRoles", null);
			if (s.result) {
				return s.result;
			}
		}
	} catch(x) {}
}

wm.logoutSuccess = function() {
    if (dojo.cookie.isSupported() && !wm.disableUserPrincipalCookie) {
	wm.clearUserPrincipal();
    } else {
	wm.roles = [];
    }
    dojo.publish("wmRbacUpdate");
}

wm.logout = function() {
	var s = wm.securityService || (wm.securityService =
		new wm.JsonRpcService({name: "securityService", sync: true, errorLevel: 2}));
	try {
		if (s.ready) {
			s.request("logout", null);
			window.location.reload();
		}
	} catch(x) {}
}

