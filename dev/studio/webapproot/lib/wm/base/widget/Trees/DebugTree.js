/*
 *  Copyright (C) 2011 WaveMaker Software, Inc.
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


dojo.provide("wm.base.widget.Trees.DebugTree");
dojo.require("wm.base.widget.Trees.Tree");
dojo.require("wm.base.widget.Trees.JSObjTreeNode");
dojo.require("wm.base.widget.Dialogs.Dialog");


dojo.declare("wm.DebugDialog", wm.Dialog, {
    useContainerWidget: true,
    useButtonBar: true,
    modal: false,
    title: "Debugger",

    commands: null,
    commandPointer: null,
    postInit: function() {
	this.inherited(arguments);
	this.commands = [];
	this.debugTree = new wm.DebugTree({owner: this, 
					   parent: this.containerWidget,
					   width: "100%", height: "100%",
					   name: "debugTree"});

	var commandLine = new wm.Text({width: "100%",
				       owner: this,
				       parent: this.containerWidget,
				       name: "commandLineDebug"});

	var bindButton = new wm.ToggleButton({owner: this,
					      parent: this.buttonBar,
					      name: "debugBindingButton",
					      captionUp: "Bindings",
					      captionDown: "Bindings"});
	var clearDebugButton = new wm.Button({owner: this,
					      parent: this.buttonBar,
					      name: "clearDebugButton",
					      caption: "Clear"});
	var executeDebugButton = new wm.Button({owner: this,
						parent: this.buttonBar,
						name: "executeDebugButton",
						caption: "Execute"});

	this.connect(clearDebugButton, "onclick", this, function() {
	    this.debugTree.clear();
	});
	this.connect(bindButton, "onclick", this, function() {
	    this.debugTree.showBinding(bindButton.clicked);
	});
	this.connect(executeDebugButton, "onclick", this, function() {
	    var text = commandLine.getDataValue();
	    this.debugTree.logCommand(text,"dojo.hitch(app._page, function() {try {return " + text + "}catch(e){return e;}})()");
	    commandLine.clear();
	    this.commands.push(text);
	    while (this.commands.length > 50)
		this.commands.shift();
	    this.commandPointer = null;
	});
	commandLine.connect(commandLine, "keypressed", dojo.hitch(this, function(inEvent) {
	    if (inEvent.charCode) return;
	    if (inEvent.keyCode == dojo.keys.ENTER) {
		executeDebugButton.click();
		dojo.stopEvent(inEvent);
	    } else if (app._keys[inEvent.keyCode] == "UP") {
		if (this.commandPointer === null)
		    this.commandPointer = this.commands.length-1;
		else {
		    this.commandPointer--;
		    if (this.commandPointer < 0)
			this.commandPointer = this.commands.length-1;
		}
		commandLine.setDataValue(this.commands[this.commandPointer]);
		dojo.stopEvent(inEvent);
	    } else if (app._keys[inEvent.keyCode] == "DOWN") {
		if (this.commandPointer === null)
		    this.commandPointer = 0;
		else
		    this.commandPointer = this.commandPointer + 1 % this.commands.length;
		commandLine.setDataValue(this.commands[this.commandPointer]);	    
		dojo.stopEvent(inEvent);
	    }

	}));
    }



});

dojo.declare("wm.DebugTree", wm.Tree, {
    tmpRoot: null,
    showBindings: false,
    commands: null,
    init: function() {	
	this.inherited(arguments);
	this.tmpRoot = this.root;
	this.connect(wm.inflight, "add", this, "newJsonNode");
	this.subscribe("wmlog", dojo.hitch(this, "newLogEvent"));
	this.startEventImage =  "<img src='" + dojo.moduleUrl("lib.images.silkIcons") + "control_play.png' /> ",
	this.componentEventImage = "<img src='" + dojo.moduleUrl("lib.images.silkIcons") + "bullet_go.png' /> ";
	this.commands = [];
    },
    clear: function() {
	this.inherited(arguments);
	this.tmpRoot = this.root;
    },
    // used like console.log
    log: function(args,parent) {
	new wm.JSObjTreeNode(parent || this.tmpRoot, {prefix: "",
					 object: args});
    },
    error: function(args,parent) {
	new wm.JSObjTreeNode(parent || this.tmpRoot, {prefix: "<img src='" + dojo.moduleUrl("lib.images.boolean.Signage") + "Denied.png'/>",
					 object: args});
    },
    logCommand: function(inText, inEval) {
	var result = eval(inEval);
	if (!this.tmpRoot.tree)
	    this.tmpRoot = this.root;
	var node = new wm.TreeNode(this.tmpRoot, {content: inText,
					       hasChildren: true});
	if (result instanceof Error)
	    this.error(result,node);
	else
	    this.log(result,node);
    },
    showBinding: function(inShow) {
	this.showBindings = inShow;
	this.forEachNode(function(inNode) {
	    if (inNode instanceof wm.DebugBindingNode) 
		inNode.domNode.style.display = inShow ? "block" : "none";
	});
    },
    newLogEvent: function(inData) {
	var newNode;
	if (!this.tmpRoot.tree)
	    this.tmpRoot = this.root;
	if (inData.type == "componentEvent") {
	    var content = [this.componentEventImage,
			   inData.trigger.name || inData.trigger.declaredClass,
			   "'s ",
			   inData.eventName,
			   " fires ",
			   inData.firing.name || inData.firing.declaredClass, 
			   ".",
			   inData.method];
	    newNode = new wm.TreeNode(this.tmpRoot, {content:  content.join("")});
	} else if (inData.type == "javascriptEventStart") { 
	    var content = [this.startEventImage,
			   inData.trigger.name || inData.trigger.declaredClass,
			   "'s ",
			   inData.eventName,
			   inData.type == "javascriptEventStart" ? " fires page." : " finished firing page.",
			   inData.method];
	    newNode = new wm.TreeNode(this.tmpRoot, {content:  content.join(""), 
						     closed: false});
	    this.tmpRoot = newNode;
	} else if (inData.type == "javascriptEventStop") {
	    this.tmpRoot = this.tmpRoot.parent;

	} else if (inData.type == "bindingEvent") {
	    newNode = new wm.DebugBindingNode(this.tmpRoot, inData, this.showBindings);
	}
	this.cleanupTree();
	return newNode;
    },
    newJsonNode: function(inDeferred, inService, optName, inArgs, inMethod, invoker) {
	if (djConfig.isDebug || invoker && window["studio"] && invoker.isDesignLoaded()) 
	    new wm.DebugTreeJsonNode(this.tmpRoot, {deferred: inDeferred,
						name: optName,
						service: inService,
						invoker: invoker,
						method: inMethod,
						args: inArgs});
	this.cleanupTree();
    },
    cleanupTree: function() {
	var kids = [];
	for (var i = 0; i < this.root.kids.length; i++) {
	    if (this.root.kids[i].domNode.style.display != "none")
		kids.push(this.root.kids[i]);
	}
	while (kids.length > 40) {
	    kids.shift().destroy();
	}
	if (!this.tmpRoot.parent || !this.tmpRoot.parent.parent) this.tmpRoot = this.root;
    }
});

dojo.declare("wm.DebugTreeJsonNode", wm.TreeNode, {
    closed: true,
    jsonFiring: true,
    result: "",
    method: "",
    args: "",
    description: "",
    response: null,
    hasChildren: true,
    autoUpdate: "",
    constructor: function(inParent, inProps) {
	this.autoUpdate = inProps.invoker ? inProps.invoker._autoUpdateFiring : null;
	if (inProps.service != "runtimeService") {
	    this.description = inProps.service + "." + inProps.method; 
	} else if (inProps.name) {
	    this.description = inProps.name + "." + inProps.method;
	} else if (inProps.args[0]) {
	    this.description = inProps.args[0] + ": " + inProps.args[1];
	} else {
	    this.description = "LazyLoad: " + inProps.args[1];
	}
	    
	this.setContent("<img src='" + dojo.moduleUrl("wm.base.widget.themes.default.images") + "loadingThrobber.gif' style='width:16px;height:16px;'/> " + this.description); 
	var deferred = inProps.deferred;
	deferred.addCallback(dojo.hitch(this, "jsonResult"));
	deferred.addErrback(dojo.hitch(this, "jsonError"));
	delete this.deferred;
    },
    jsonResult: function(inResponse) {
	this.jsonFiring = false;
	this.result = "Success";
	this.response = inResponse;
	this.setContent("<img src='" + dojo.moduleUrl("lib.images.boolean.Signage") + "OK.png'/> " + this.description);
	if (this.responseNode)
	    this.responseNode.setObject(inResponse);
	else
	    this.responseData = inResponse;
    },
    jsonError: function(inResponse) {
	this.jsonFiring = false;
	this.result = "Error";
	this.response = inResponse;
	this.setContent("<img src='" + dojo.moduleUrl("lib.images.boolean.Signage") + "Denied.png'/> " + this.response);
    },

    // This node has the following children
    // 1. parameter obj
    // 2. Response obj
    initNodeChildren: function(inParentNode) {
	if (this.invoker && this.autoUpdate)
	    this.requestNode = new wm.JSObjTreeNode(this, {prefix: "AutoUpdate",
							   object: this.autoUpdate});
	if (this.invoker) 
	    this.requestNode = new wm.JSObjTreeNode(this, {prefix: "Invoker" + (this.invoker.operation ? " (" + this.invoker.operation + ")" : ""),
							   object: this.invoker});

	this.requestNode = new wm.JSObjTreeNode(this, {prefix: "Request",
						       object: this.args});
	this.responseNode= new wm.JSObjTreeNode(this, {prefix: "Response",
						       object: this.responseData});
    }

});



dojo.declare("wm.DebugBindingNode", wm.TreeNode, {
    component: null,
    property: "",
    value: "",
    source: "",
    expression: "",
    closed: true,
    hasChildren: true,
    constructor: function(inParent, inProps, inShowing) {
	if (!inShowing) this.domNode.style.display = "none";
	this.setContent("<img src='" + dojo.moduleUrl("lib.images.silkIcons") + "wrench.png' /> Bound '" + this.property + "' of " + this.component.getRuntimeId());
    },
    initNodeChildren: function(inParentNode) {
	this.requestNode = new wm.JSObjTreeNode(this, {prefix: this.property + " set to",
						       object: this.value});
	this.requestNode = new wm.JSObjTreeNode(this, {prefix: "For component",
						       object: this.component});

	this.requestNode = new wm.TreeNode(this, {content: "Changed by " + (this.expression || this.source)});
    }

});






