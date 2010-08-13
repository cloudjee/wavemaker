/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
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
