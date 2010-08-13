/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.components.JavaService");
dojo.require("wm.base.components.ServerComponent");

/**
	Component that provides information about Java service.
	@name wm.JavaService
	@class
	@extends wm.ServerComponent
*/
dojo.declare("wm.JavaService", wm.ServerComponent, {
	serviceId: "",
    initialCode: "", // only used when creating a javaservice with prespecified java code; used only as an initialization property, do not expect to see actual code here any other time.
    initialClassId: "",
    initialNoEdit: "",
	afterPaletteDrop: function() {
	    if (this.initialCode) {
		this.newJavaServiceSkipDialog(this.serviceId, this.initialClassId, this.initialCode);		
	    } else {
		this.newJavaServiceDialog();
	    }
		return true;
	},
    newJavaServiceSkipDialog: function(serviceId, classId, javaFunctions) {
	studio.beginWait("Creating service");

	var onError = dojo.hitch(this, function(inError) {
	    app.toastWarning("Failed to create java service " + serviceId +": " + inError);
	    studio.endWait("Creating service");
	});


	var onSaveSuccess = dojo.hitch(this,function() {
	    app.toastSuccess("Created java service " + serviceId);
	    var c = new wm.JavaService({name: serviceId, serviceId: serviceId})
	    studio.application.addServerComponent(c);
	    studio.refreshWidgetsTree();
	    if (!this.initialNoEdit) {
		studio.select(c);
		this.editView();
		studio.navGotoModelTreeClick();
	    }

	    studio.endWait("Creating service");
	});



	// STEP 3: After loading the class file from the server, add in the specified java code and save/compile it
	var onOpenSuccess = dojo.hitch(this,function(inData) {
	    inData = inData.substring(0, inData.indexOf("public String sampleJavaOperation"))
		+ javaFunctions + "\n}";
		studio.javaService.requestAsync("saveClass",
						[serviceId, inData], 
						onSaveSuccess,
						onError);


	});

	// STEP 2: After creating a new class, load the class file from the server
	var onNewSuccess = dojo.hitch(this,function() {
	    studio.javaService.requestAsync("openClass", [serviceId],
					    onOpenSuccess, onError);
	});


	// STEP 1: Create a new class
	studio.javaService.requestAsync(
	    "newClass", [serviceId, classId], onNewSuccess, onError);

    },
	newJavaServiceDialog: function(inSender) {
		var d = this.getCreateJavaServiceDialog();
		if (d.page)
			d.page.clearAll();
		d.show();
	},
	getCreateJavaServiceDialog: function() {
		if (wm.JavaService.newJavaServiceDialog) {
			return wm.JavaService.newJavaServiceDialog;
		}
		var props = {
			owner: studio,
			pageName: "NewJavaService",
			hideControls: true,
			width: 400,
			height: 200
		};
		var d = wm.JavaService.newJavaServiceDialog = new wm.PageDialog(props);
		d.onClose = dojo.hitch(this, function(inWhy) {
			if (inWhy == "OK")
				this.completeNewJavaService();
		});
		return d;
	},
	completeNewJavaService: function() {
		var p = this.getCreateJavaServiceDialog().page;
		if (p.newServiceId) {
			var n = p.newServiceId;
			var c = new wm.JavaService({name: n, serviceId: n})
			studio.updateServices();
			studio.application.addServerComponent(c);
			studio.refreshWidgetsTree();
			studio.select(c);
			this.editView();
			studio.navGotoModelTreeClick();
		
	    }
	},
	editView: function() {
		var c = studio.navGotoEditor("JavaEditor");
		if (this.serviceId) {
			c.pageLoadedDeferred.addCallback(dojo.hitch(this, function() {
				c.page.selectService(this);
				return true;
			}));
		}
	},
	preNewComponentNode: function(inNode, inProps) {
		inProps.closed = true;
		inProps._data = {children: ["faux"]};
		inProps.initNodeChildren = dojo.hitch(this, "initNodeChildren");
	},
	initNodeChildren: function(inNode) {
		studio.scrim.scrimify(dojo.hitch(this, function() {
			// needs studio.application owner to resolve SMD path correctly
			var s = new wm.JsonRpcService({name: this.serviceId, owner: studio.application});
			this.dumpOperationList(inNode, s._operations, '', '');
			s.destroy();
		}));
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
	}
});

dojo.declare("wm.JavaServiceLoader", null, {
	getComponents: function() {
		var cs = []
		wm.services.forEach(function(s) {
			if (s.type == "JavaService" && (s.name != "securityService" & s.name != "securityServiceJOSSO")) {
				var c = new wm.JavaService({name: s.name, serviceId: s.name});
				cs.push(c);
			}
		});
		return cs;
	}
});

wm.registerComponentLoader("wm.JavaService", new wm.JavaServiceLoader());

