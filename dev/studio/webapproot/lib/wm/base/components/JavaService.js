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

    // initialCode or javaTemplate only used when creating a javaservice with prespecified java code; used only as an initialization property, do not expect to see actual code here any other time.
    initialCode: "", 
    javaTemplate: "",


    initialClassId: "",
    initialNoEdit: "",
	afterPaletteDrop: function() {
	    if (this.initialCode) {
		this.newJavaServiceWithFunc(this.serviceId, this.initialClassId, this.initialCode);		
	    } else if (this.javaTemplate) {
		var result = studio.studioService.requestSync("getJavaServiceTemplate", [this.javaTemplate]).results[0];
		this.newJavaServiceWithFunc(this.serviceId, this.initialClassId, result);		
	    } else {
		this.newJavaServiceDialog();
	    }
		return true;
	},
    getUniqueServiceId: function(serviceId) {
	var components = studio.application.getServerComponents();
	for (var i = 0; i < components.length; i++) {
	    if (components[i].name == serviceId) {
		if (serviceId.match(/\d+$/)) {
		    var numb = parseInt(serviceId.match(/\d+$/)[0]);
		    numb++;
		    return this.getUniqueServiceId(serviceId.replace(/\d+$/,numb));
		} else {
		    return this.getUniqueServiceId(serviceId + "1");
		}
	    }
	}
	return serviceId;
    },
    newJavaServiceWithFunc: function(serviceId, classId, javaFunctions) {

	var params = javaFunctions.match(/\$\{.*?\}/g);
	if (params) {
	    for(var i = 0; i < params.length; i++) {
		var param = params[i].substring(2,params[i].length-1);
		var paramParts = param.split(":");
		params[i] = {type: paramParts[0],
			     name: paramParts[1],
			     description: paramParts[2]};
	    }

	    var onOKFunc = dojo.hitch(this, function() {
		for (var i = 0; i < params.length; i++) {
		    javaFunctions = javaFunctions.replace(new RegExp("\\$\\{" + params[i].type + ":" + params[i].name + ":.*?\\}"), params[i].editor.getDataValue());
		}
		this.newJavaServiceWithFunc2(serviceId, classId, javaFunctions);
	    });
	    var onDoneFunc = dojo.hitch(this, function() {
		d.destroy();
		for (var i = 0; i < params.length; i++)
		    delete params[i].editor;
		params = null;
	    });
				      
	    var d = new wm.Dialog({owner: app, 
				   width: "400px",
				   height: "400px",
				   modal: true,
				   useContainerWidget: true,
				   fitToContentHeight: true,
				   title: "Create a Java Service"});
	    for(var i = 0; i < params.length; i++) {
		params[i].editor = 
		    new wm.Text({owner: d,
				 parent: d.containerWidget,
				 captionSize: "100px",
				 captionAlign: "left",
				 padding: "4,10,4,10",
				 height: "30px",
				 width: "100%",
				 emptyValue: "emptyString",
				 caption: params[i].name,
				 promptMessage: params[i].type + ": "+ params[i].description});
		params[i].editor.connect(params[i].editor, "onEnterKeyPress", this, function() {
		    onOKFunc();
		    onDoneFunc();
		});
	    }
	    var okButton = new wm.Button({owner:  d,
					  parent: d.buttonBar,
					  width: "100px",
					  height: "40px",
					  caption: "OK"});
	    var cancelButton = new wm.Button({owner:  d,
					  parent: d.buttonBar,
					  width: "100px",
					  height: "40px",
					  caption: "Cancel"});
	    d.show();
	    params[0].editor.focus();
	    d.connect(okButton, "onclick", this, function() {
		onOKFunc();
		onDoneFunc();
	    });

	    d.connect(cancelButton, "onclick", this, function() {
		onDoneFunc();
	    });

	    
	} else {
	    this.newJavaServiceWithFunc2(serviceId, classId, javaFunctions);
	}
    },
    newJavaServiceWithFunc2: function(serviceId, classId, javaFunctions) {
	studio.beginWait("Creating service");
	var newServiceId = this.getUniqueServiceId(serviceId);

	// if the service id has changed, also update the class name to match
	if (newServiceId != serviceId) {
	    var numb = newServiceId.match(/\d$/)[0];
	    if (classId.match(/\d+$/))
		classId = classId.replace(/\d+$/, numb);
	    else
		classId += numb;
	}
	serviceId = newServiceId;

	var onError = dojo.hitch(this, function(inError) {
	    app.toastWarning("Failed to create java service " + serviceId +": " + inError);
	    studio.endWait("Creating service");
	});


	var onSaveSuccess = dojo.hitch(this,function() {
	    app.toastSuccess("Created java service " + serviceId);
	    var c = new wm.JavaService({name: serviceId, serviceId: serviceId})
	    studio.application.addServerComponent(c);
	    studio.refreshWidgetsTree();
	    if (!this.initialNoEdit || studio.javaEditor.isActive()) {
		studio.select(c);
		c.editView();
		studio.navGotoModelTreeClick();
	    }
	    delete this.iintialNoEdit;
	    
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

