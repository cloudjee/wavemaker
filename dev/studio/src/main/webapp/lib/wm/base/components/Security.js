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

dojo.provide("wm.base.components.Security");
dojo.require("wm.base.components.ServerComponent");
dojo.require("wm.base.components.Application");
dojo.require("dojo.cookie");

wm.disableUserPrincipalCookie = false;

wm.login = function(args, loginSuccessCallback, loginFailedCallback, properties, projectName) {
	if (properties === undefined || properties == null) {
		properties = {
			j_username : args[0],
			j_password : args[1]
		};
	}

	properties.acegiAjaxLogin = 'true';

	var def= dojo.xhrPost({
		url: (projectName ? '/' + projectName + '/' : '') + 'j_acegi_security_check',
		content : properties,
		handleAs: "json",
	    error: function(response) {
				if (loginFailedCallback) {
				    loginFailedCallback(response.toString());
				} else {
				    app.alert(response.toString());
				}
	    },
		load: function(response, ioArgs) {
			if (response.url) {
                            var pathname = location.protocol + "//" + location.host + location.pathname + location.search; // sometimes using search helps and sometimes it breaks this test; still working out what is going on
				if (dojo.cookie.isSupported() && !wm.disableUserPrincipalCookie) {
					var p = {username: properties.j_username, roles: wm.getUserRoles(true)};
					wm.setUserPrincipal(p);
				}
				if (loginSuccessCallback) {
					loginSuccessCallback(response.url);
				} else {
				    if (window.studio) {
					// studio.application is set to null on projectClose; studio.project seems to retain value
					if (studio.application && studio.page && studio.project) {
					    if (studio.studioService.requestSync("openProject", [studio.project.projectName]));
					    studio.navGotoDesignerClick();
					} else 
					    studio.startLayer.activate();
                                        // Typically this tests to see if we're on login.html and being directed to index.html
				    } else if (pathname != response.url) {
					location.href = response.url;

                                        // If the page name is login, but app.main is not login, then we're on the real project,
                                        // not the special project used for logging in.  If we're on the real project, a wm page nav is all that is needed
				    } else if (app._page.name == "login" && app.main != "login") {
                                        app.loadPage(app.main);
                                    }
				}
			} else if (response.error) {

				if (loginFailedCallback) {
					loginFailedCallback(response.error);
				} else {
					console.error(response.error);
				}
			}
		}
	});
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
	if (!force && wm.getUserPrincipal().roles) {
		return wm.getUserPrincipal().roles;
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

/**
	Component that provides information about security.
	@name wm.Security
	@class
	@extends wm.ServerComponent
*/
dojo.declare("wm.Security", wm.ServerComponent, {
	afterPaletteDrop: function() {
		this.editView();
		studio.navGotoComponentsTreeClick();
		return true;
	},
	editView: function() {
	    studio.navGotoEditor("Security", studio.securityTab, "SecurityLayer", studio.getDictionaryItem("wm.Security.TAB_CAPTION"));
	    //studio.securityPageDialog.show();
	},



	preNewComponentNode: function(inNode, inProps) {
		inProps.closed = true;
		inProps._data = {children: ["faux"]};
		inProps.initNodeChildren = dojo.hitch(this, "initNodeChildren");
	},

	initNodeChildren: function(inNode) {
		studio.scrim.scrimify(dojo.hitch(this, function() {
			// needs studio.application owner to resolve SMD path correctly
			var s = new wm.JsonRpcService({name: "securityService", owner: studio.application});
			this.dumpOperationList(inNode, s._operations, '', '');
			s.destroy();
		}));

		studio.addQryAndViewToTree(inNode); //xxx
	},
	dumpOperationList: function(inNode, inList) {
		var sorted = [];
		for (var o in inList)
			sorted.push(o);
		for (var i=0,o; o=sorted[i]; i++) {
			new wm.TreeNode(inNode, {
				content: o,
				image: "images/operation.png",
				closed: true,
			        component: this,
				isOperation: true,
				params: inList[o].parameters,
				returnType: inList[o].returnType,
				_data: { children: ["faux"] },
				initNodeChildren: dojo.hitch(this, "serviceInitNodeChildren")
			});
		}
	},
	dumpParamList: function(inNode, inList) {
		var sorted = [];
		for (var o in inList){
			sorted.push(dojo.mixin({name: o}, inList[o]));
		}
		for (var i=0, p; (p=sorted[i]); i++) {
			this.dumpType(inNode, p.name, p.type);
		}
	},
	dumpReturnType: function(inNode, inType) {
		this.dumpType(inNode, "(return)", inType);
	},
	dumpTypeList: function(inNode, inList) {
		for (var n in inList) {
			this.dumpType(inNode, n, inList[n].type, inList[n].isList);
		}
	},
	dumpType: function(inNode, inName, inType, isList) {
		var
			lt = inType.slice(-1) == "]",
			ty = lt ? inType.slice(1, -1) : inType,
			tn = ty.split(".").pop(),
		tn = lt ? "[" + tn + "]" : tn;
		if (isList) {
			tn = "[" + tn + "]";
		}
		var h = '<img width="16" height="16" src="images/dataobject.png">&nbsp;' + inName + ": <em>" + tn + "</em>";
		//
		var data = {}, ti = wm.typeManager.getType(ty);
		if (ti) {
			if (!ti.primitiveType)
				data = { children: ["faux"] };
		}
		new wm.TreeNode(inNode, {content: h, closed: true, isType: true, type: ty, _data: data,
			initNodeChildren: dojo.hitch(this, "serviceInitNodeChildren")});
	},
	serviceInitNodeChildren: function(inNode) {
		if (inNode.isOperation) {
			this.dumpParamList(inNode, inNode.params);
			this.dumpReturnType(inNode, inNode.returnType);
		} else if (inNode.isType) {
			this.dumpTypeList(inNode, wm.typeManager.getTypeSchema(inNode.type));
		}
	},

    hasServiceTreeDrop: function() {return true;},
    onServiceTreeDrop: function(inParent, inOwner, inNode) {
	var operation = inNode.isOperation ? inNode.content : "getUserName";
	if (operation == "logout") {
	var serviceVariable = new wm.LogoutVariable({owner: inOwner,
						     name: inOwner.getUniqueName("logoutSVar"),
						      service: "securityService",
						      operation: operation,
						     startUpdate: false});
	    var button = new wm.Button({owner: inOwner,
					  parent: inParent,
					name: inOwner.getUniqueName("logoutButton"),
					  caption: "Logout",
					  width: "100px"});
	    button.eventBindings.onclick = serviceVariable.name;
	    inParent.reflow();
	    return button;
	} else {
	    var name = this.name;
	    this.name = "securityService";
	    var result =this.inherited(arguments);
	    this.name = name;
	    return result; // returning will trigger a design tree refresh and a studio.select	
	}    
    }
});

dojo.declare("wm.SecurityLoader", null, {
	getComponents: function() {
		var cs = [];
		wm.services.forEach(function(s) {
			if (s.name == "securityService" || s.name == "securityServiceJOSSO") {
				var c = new wm.Security({name: "Security"});
				cs.push(c);
			}
		});
		return cs;
	}
});

wm.registerComponentLoader("wm.Security", new wm.SecurityLoader());
