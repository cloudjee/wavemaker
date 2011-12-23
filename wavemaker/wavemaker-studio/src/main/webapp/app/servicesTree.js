/*
 * Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
 


/* This widget is used within both the JavaEditor and (Web) Services editor; however it is hidden,
 * and should be obsolete as soon as we cleanup those two editors.
 */

dojo.provide("wm.studio.app.servicesTree");

dojo.declare("wm.ServicesTree", wm.Tree, {
	init: function() {
		this.inherited(arguments);
		this.serviceId = null;
	},
	prepare: function() {
		this.inherited(arguments);
	},
	setTreeData: function(inData) {
		this.clear();
		this.dumpServiceList(this.root, inData);
		this.selectLastSelectedNode();
		return this.serviceId;
	},
	dumpServiceList: function(inNode, inList) {
		for (var i=0, n; (n=inList[i]); i++) {
			new wm.TreeNode(inNode, {
				content: n,
				image: "images/service.png",
				closed: true,
				isService: true,
				name: n,
				_data: { children: ["faux"] }
			});
		}
	},
	dumpOperationList: function(inNode, inList) {
		var sorted = [];
		for (var o in inList)
			sorted.push(o);
		//sorted.sort();
		for (var i=0,o; o=sorted[i]; i++) {
			new wm.TreeNode(inNode, {
				content: o,
				image: "images/operation.png",
				closed: true,
				isOperation: true,
				params: inList[o].parameters,
				returnType: inList[o].returnType,
				_data: { children: ["faux"] }
			});
		}
	},
	dumpParamList: function(inNode, inList) {
		var sorted = [];
		for (var o in inList){
			sorted.push(dojo.mixin({name: o}, inList[o]));
		}
		//sorted.sort();
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
		new wm.TreeNode(inNode, {content: h, closed: true, isType: true, type: ty, _data: data});
	},
	treeInitNodeChildren: function(inNode) {
		if (inNode.isService) {
			studio.scrim.scrimify(dojo.hitch(this, function() {
				// needs studio.application owner to resolve SMD path correctly
				var s = new wm.JsonRpcService({name: inNode.name, owner: studio.application});
				this.dumpOperationList(inNode, s._operations, '', '');
				s.destroy();
			}));
		} else if (inNode.isOperation) {
			this.dumpParamList(inNode, inNode.params);
			this.dumpReturnType(inNode, inNode.returnType);
		} else if (inNode.isType) {
			this.dumpTypeList(inNode, wm.typeManager.getTypeSchema(inNode.type));
		}
	},
	selectLastSelectedNode: function() {
		if (this.serviceId) {
			var kids = this.root.kids;
			for (var i in kids) {
				if (kids[i].isService && kids[i].name == this.serviceId) {
					this.select(kids[i]);
					return;
				}
			}
		}
	},
	selectFirstService: function() {
		var kids = this.root.kids;
		for (var i in kids) {
			if (kids[i].isService) {
				this.serviceId = kids[i].name;
				this.select(kids[i]);
				return;
			}
		}
	}
});
