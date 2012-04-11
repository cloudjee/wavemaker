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

dojo.provide("wm.base.components.Security_design");
dojo.require("wm.base.components.ServerComponent");
dojo.require("wm.base.components.Application");

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
