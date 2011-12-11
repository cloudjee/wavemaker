/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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



dojo.provide("wm.base.widget.Trees.DebugTree");
dojo.require("wm.base.widget.Trees.Tree");
dojo.require("wm.base.widget.Trees.JSObjTreeNode");
dojo.require("wm.base.widget.Dialogs.Dialog");


dojo.declare("wm.DebugDialog", wm.Dialog, {
    noTopBottomDocking: true,
    noLeftRightDocking: true,
    useContainerWidget: true,
    useButtonBar: false,
    modal: false,
    title: "Debugger",
    commands: null,
    commandPointer: null,
    postInit: function() {
	this.inherited(arguments);
	this.commands = [];

	this.tabLayers = new wm.TabLayers({owner: this,
					   parent: this.containerWidget,
					   width: "100%",
					   height: "100%",
					   name: "tabLayers"});
	this.addEventsLayer();
	this.addServiceListLayer();
	this.tabLayers.setLayerIndex(0);
	this.minify();
    },
    addServiceListLayer: function() {
	this.servicesLayer = new wm.Layer({owner: this,
					   parent: this.tabLayers,
					   name: "servicesLayer",
					   caption: "Services",
					   onShow: dojo.hitch(this,function() {this.serviceGridPanel.activate();}),
					   onDeactivate: dojo.hitch(this, function() {this.serviceGridPanel.deactivate();})
					  });
	this.serviceGridPanel = new wm.ServiceGridPanel({owner: this,
							 name: "serviceGridPanel",
							 parent: this.servicesLayer,
							 width: "100%",
							 height: "100%",
							 autoScroll:true});

    },
    addEventsLayer: function() {
	this.eventsLayer = new wm.Layer({owner: this,
					 parent: this.tabLayers,
					 name: "eventsLayer",
					 caption: "Events"});

	this.debugTree = new wm.DebugTree({owner: this, 
					   parent: this.eventsLayer,
					   width: "100%", height: "100%",
					   name: "debugTree"});

	var commandLine = new wm.Text({width: "100%",
				       owner: this,
				       parent: this.eventsLayer,
				       name: "commandLineDebug"});
	var treeButtonBar = new wm.Panel({owner: this,
					  parent: this.eventsLayer,
					  horizontalAlign: "left",
					  verticalAlign: "top",
					  layoutKind: "left-to-right",
					  width: "100%",
					  height: "35px"});
	var bindButton = new wm.ToggleButton({owner: this,
					      parent: treeButtonBar,
					      name: "debugBindingButton",
					      captionUp: "Bindings",
					      captionDown: "Bindings"});
	var clearDebugButton = new wm.Button({owner: this,
					      parent: treeButtonBar,
					      name: "clearDebugButton",
					      caption: "Clear"});
	var executeDebugButton = new wm.Button({owner: this,
						parent: treeButtonBar,
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

dojo.declare("wm.ServiceGridPanel", wm.Container, {
    
    postInit: function() {
	this.inherited(arguments);

	wm.conditionalRequire("lib.github.beautify", true); 

	this.connect(wm.inflight, "add", this, "conditionalGenerateServicesLayer");
	this.connect(wm.inflight, "remove", this, "conditionalGenerateServicesLayer");


	var typeDef = this.createComponents({debuggerServicesType: ["wm.TypeDefinition", {internal: true, "name":"debuggerServicesType"}, {}, {
	    field6: ["wm.TypeDefinitionField", {"fieldName":"id","fieldType":"string","name":"field6"}, {}],
	    field0: ["wm.TypeDefinitionField", {"fieldName":"page","fieldType":"string","name":"field0"}, {}],
	    field1: ["wm.TypeDefinitionField", {"fieldName":"name","fieldType":"string","name":"field1"}, {}],
	    field2: ["wm.TypeDefinitionField", {"fieldName":"lastUpdate","fieldType":"date","name":"field2"}, {}],
	    field3: ["wm.TypeDefinitionField", {"fieldName":"firedBy","fieldType":"string","name":"field3"}, {}],
	    field4: ["wm.TypeDefinitionField", {"fieldName":"data","fieldType":"string","name":"field4"}, {}],
	    field5: ["wm.TypeDefinitionField", {"fieldName":"request","fieldType":"string","name":"field5"}, {}]
	}]}, this);
	wm.typeManager.types.debuggerServicesType.fields.id.include = ["update"];
	this.serviceListVar = new wm.Variable({owner: this,
					       isList: true,
					       name: "serviceListVar",
					       type: "debuggerServicesType"});


	this.tabs = this.createComponents({
	    tabs: ["wm.TabLayers", {name: "tabs", width: "100%", height: "100%"},{}, {
		gridLayer: ["wm.Layer", {name: "gridLayer", caption: "Grid"}, {}, {
		    serviceGrid: ["wm.DojoGrid", {width: "100%", height: "100%","columns":[
			{"show":true,"field":"page","title":"Page","width":"80px","align":"left","formatFunc":""},
			{"show":true,"field":"name","title":"Name","width":"100%","align":"left","formatFunc":""},
			{"show":true,"field":"lastUpdate","title":"Time","width":"80px","align":"left","formatFunc": "wm_date_formatter",
			 "formatProps": {
                             "dateType": "time",
			     formatLength: "medium"
			 }},
			{"show":true,"field":"firedBy","title":"FiredBy","width":"120px","align":"left","formatFunc":""},
			{"show":true,"field":"data","title":"Data","width":"80px","align":"left","formatFunc":"", expression: "if (dojo.isArray(${data})) { ${data}.length + ' items';} else if (wm.isEmpty(${data})) {'Empty';} else {'Has Data';}"},
			/*{"show":true,"field":"request","title":"Request","width":"100%","align":"left","formatFunc":""},*/
			{"show":true,"field":"update","title":"Update","width":"60px","align":"left","formatFunc":"wm_button_formatter","formatProps":null,"expression":"\"Update\"","isCustomField":true}
		    ],
						  "margin":"4",
						  "name":"serviceGrid"}, {onGridButtonClick: "updateGridButtonClick"}, {
						      binding: ["wm.Binding", {"name":"binding"}, {}, {
							  wire: ["wm.Wire", {"expression":undefined,"name":"wire","source":"app.debugDialog.serviceGridPanel.serviceListVar","targetProperty":"dataSet"}, {}]
						      }]
						  }]
		}],
		dataLayer: ["wm.Layer", {name: "dataLayer", caption: "Data"},{}, {
		    dataEditor: ["wm.AceEditor", {"height":"100%","name":"dataEditor","width":"100%"}, {}, {
			binding: ["wm.Binding", {"name":"binding"}, {}, {
			    wire: ["wm.Wire", {"name":"wire","expression":"${app.debugDialog.serviceGridPanel.serviceGrid.selectedItem};//causes subscribe to events\nvar data = app.debugDialog.serviceGridPanel.serviceGrid.selectedItem.getValue('data');\n var cleanData = [];\n dojo.forEach(data, function(item) {cleanData.push(wm.DojoGrid.prototype.itemToJSONObject(app.debugDialog.serviceGridPanel.serviceGrid.store,item));});\n js_beautify(dojo.toJson(cleanData));","targetProperty":"dataValue"}, {}]
			}]
		    }],
		    setDataButton: ["wm.Button", {name: "fireButton", caption: "setData()", width: "150px"}]
		}],
		requestLayer: ["wm.Layer", {name: "requestLayer", caption: "Request"},{}, {
		    requestEditor: ["wm.AceEditor", {"height":"100%","name":"requestEditor","width":"100%"}, {}, {
			binding: ["wm.Binding", {"name":"binding"}, {}, {
			    wire: ["wm.Wire", {"name":"wire","expression":"${app.debugDialog.serviceGridPanel.serviceGrid.selectedItem};//causes subscribe to events\nvar data = app.debugDialog.serviceGridPanel.serviceGrid.selectedItem.getValue('request');\n data = wm.DojoGrid.prototype.itemToJSONObject(app.debugDialog.serviceGridPanel.serviceGrid.store,data); js_beautify(dojo.toJson(data));","targetProperty":"dataValue"}, {}]
			}]
		    }],
		    fireButton: ["wm.Button", {name: "fireButton", caption: "update()", width: "150px"}]
		}]
	    }]
	},this)[0];
	this.serviceGrid = this.tabs.layers[this.tabs.indexOfLayerName("gridLayer")].c$[0];
	this.dataEditor = this.tabs.layers[this.tabs.indexOfLayerName("dataLayer")].c$[0];
	this.requestEditor = this.tabs.layers[this.tabs.indexOfLayerName("requestLayer")].c$[0];
	this.setDataButton = this.dataEditor.parent.c$[1];
	this.updateButton = this.requestEditor.parent.c$[1];
	this.connect(this.updateButton, "onclick", this, function wmdebugger() {
	    var data = this.requestEditor.getDataValue();
	    data = eval("(" + data + ")");
	    var c = app.getValueById(this.serviceGrid.selectedItem.getValue("id"));
	    if (c instanceof wm.LiveVariable && c.operation == "read") {
		c.filter.setData(data);
	    } else if (c instanceof wm.LiveVariable) {
		c.sourceData.setData(data);
	    } else if (c instanceof wm.ServiceVariable) {
		c.input.setData(data);
	    }
	    c.update();
	});
	this.connect(this.setDataButton, "onclick", this, function() {
	    var data = this.dataEditor.getDataValue();
	    data = eval("(" + data + ")");
	    var c = app.getValueById(this.serviceGrid.selectedItem.getValue("id"));
	    c.setData(data);
	});
    },
    updateGridButtonClick: function(inSender, fieldName, rowData, rowIndex) {
      try {
	  /* Causes this click to show as "debugger" in the grid */
	  (function wmdebugger() {
              var c = app.getValueById(rowData.id);
              c.update();
	  })();
      } catch(e) {
      } 
  },
    conditionalGenerateServicesLayer: function() {
	if (!this.isAncestorHidden()) {
	    this.generateServicesLayer();
	}
    },
    activate: function() {
	this.serviceGrid._renderHiddenGrid = true;
	this.generateServicesLayer();
    },
    deactivate: function() {
	this.serviceGrid._renderHiddenGrid = false;
    },
    generateServicesLayer: function() {
	this.serviceListVar.beginUpdate();
	for (var id in wm.Component.byId) {
	    var c = wm.Component.byId[id];
	    if (c instanceof wm.ServiceVariable == false)
		continue;
	    var page = c.getParentPage();
	    var pageName =  page ? page.declaredClass : "app";
	    var componentName = id.indexOf(wm.decapitalize(pageName)) == 0 ? id.substring(pageName.length+1) : id;
	    var firedBy = "";
	    if (c._debug) {
		if (c._debug.trigger) {
		    firedBy = c._debug.trigger;
		}
		if (c._debug.eventName) {
		    firedBy += "." + c._debug.eventName;
		}
	    }

	    var itemData = {page: pageName,
			    name: componentName,
			    id: c.getRuntimeId(),
			    lastUpdate: c._debug && c._debug.lastUpdate ? c._debug.lastUpdate :  undefined,
			    firedBy: firedBy,
			    data: c.getData(),
			    request: ""};

	    if (c instanceof wm.LiveVariable) {
		if (c.operation == "read") {
		    itemData.request = c.filter.getData();
		} else {
		    itemData.request = c.sourceData.getData();
		}
	    } else {
		itemData.request = c.input.getData();
	    }

	    // See if the item exists and update it if it does
	    var found = false;
	    var count = this.serviceListVar.getCount();
	    for (var i = 0; i < count; i++) {
		var item = this.serviceListVar.getItem(i);
		if (item.getValue("page") == pageName && item.getValue("name") == componentName) {
		    found = true;
		    item.beginUpdate();
		    item.setData(itemData);
		    item.endUpdate();
		    break;
		}
	    }
	    if (!found) {
		if (!itemData.lastUpdate) itemData.lastUpdate = new Date();
		this.serviceListVar.addItem(itemData);
	    }
	}

	this.serviceListVar.endUpdate();	    
	this.serviceListVar.notify();
    },
    newJsonEvent: function(inDeferred, inService, optName, inArgs, inMethod, invoker) {
	
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
	    this.description = inProps.args[0] + ": " + inProps.args[1] + " (" + inProps.method + ")";
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
	var response = dojo.clone(inResponse);
	this.setContent("<img src='" + dojo.moduleUrl("lib.images.boolean.Signage") + "OK.png'/> " + this.description);
	if (this.responseNode)
	    this.responseNode.setObject(response);
	else
	    this.responseData = response;
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






