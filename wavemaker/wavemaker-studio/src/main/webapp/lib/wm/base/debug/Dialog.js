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

/* TODO:
 * 1. Cleanup areas where we do debugging tracking; esp ServiceCall and LiveVariable; the code is too messy
 * 2. Track svar calls
 */

dojo.provide("wm.base.debug.Dialog");
dojo.require("wm.base.debug.EventsPanel");
dojo.require("wm.base.debug.WidgetPanel");
dojo.require("wm.base.debug.ServicePanel");
dojo.require("wm.base.debug.PropertyPanel");
dojo.require("wm.base.debug.StylePanel");
dojo.require("wm.base.debug.BindPanel");
dojo.require("wm.base.debug.DataPanel");
dojo.require("wm.base.debug.RequestPanel");
dojo.require("wm.base.debug.EventDetailsPanel");

dojo.declare("wm.debug.Dialog", wm.Dialog, {
    manageHistory: false,
    manageURL: false,
    border: "4", // easy to resize!
    _noAnimation:true,
    showTitleButtonsWhenDocked: true,
    noEscape: true,
    minHeight: 300,
    noTopBottomDocking: false,
    noLeftRightDocking: true,
    useContainerWidget: true,
    useButtonBar: false,
    modal: false,
    title: "WM Debugger",
    commands: null,
    commandPointer: null,
    _lastDocked: true,
    containerPadding: "0",

/* This hack (providing getRoot and getRuntimeId) is needeed to be able to write event handlers such as onShow: "serviceGridPanel.activate"; without it, we'd need something like
 * app.debugDialog.serviceGridPanel.activate
 */
    getRoot: function() {
	return this;
    },
	getRuntimeId: function(inId) {
		inId = this.name + (inId ? "." + inId : "");
		return this.owner != app.pageContainer ? this.owner.getRuntimeId(inId) : inId;
	},
	getId: function(inName) {
		return inName;
	},



    postInit: function() {
	this.inherited(arguments);
	this.commands = [];
	this.containerWidget.createComponents({
	    tabLayers: ["wm.TabLayers", {width: "100%", height: "100%", headerHeight: "20px", clientBorder: "0", margin: "0"}, {}, {
		servicesLayer: ["wm.Layer", {caption: "Services",padding:"0",margin:"0"}, {onShow: "serviceGridPanel.activate", onDeactivate: "serviceGridPanel.deactivate"}, {
		    serviceGridPanel: ["wm.debug.ServicePanel", {width: "100%", height: "100%", autoScroll: true}]
		}],
		eventsLayer: ["wm.Layer", {caption: "Events",padding:"0",margin:"0"}, {onShow: "eventsPanel.activate", onDeactivate: "eventsPanel.deactivate"}, {
		    eventsPanel: ["wm.debug.EventsPanel", {width: "100%", height: "100%", autoScroll: true}]
		}],
		widgetLayer:  ["wm.Layer", {caption: "Widgets and Bindings",padding:"0",margin:"0"}, {onShow: "widgetPanel.activate", onDeactivate: "widgetPanel.deactivate"}, {
		    widgetPanel: ["wm.debug.WidgetPanel", {width: "100%", height: "100%", autoScroll:true}]
		}]
	    }]
	});

/*
	this.addEventsLayer();
	this.addServiceListLayer();
	this.addWidgetListLayer();
	this.tabLayers.setLayerIndex(0);
	*/
	this.minify();
    },
    addServiceListLayer: function() {
	this.servicesLayer = new wm.Layer({owner: this,
					   parent: this.tabLayers,
					   name: "servicesLayer",
					   caption: "Data & Services",
					   onShow: dojo.hitch(this,function() {this.serviceGridPanel.activate();}),
					   onDeactivate: dojo.hitch(this, function() {this.serviceGridPanel.deactivate();})
					  });
	this.serviceGridPanel = new wm.ServiceDebugPanel({owner: this,
							 name: "serviceGridPanel",
							 parent: this.servicesLayer,
							 width: "100%",
							 height: "100%",
							 autoScroll:true});

    },
    addWidgetListLayer: function() {
	this.widgetLayer = new wm.Layer({owner: this,
					 parent: this.tabLayers,
					 name: "widgetsLayer",
					 caption: "Widgets and Bindings",
					 onShow: dojo.hitch(this,function() {this.widgetPanel.activate();}),
					 onDeactivate: dojo.hitch(this, function() {this.widgetPanel.deactivate();})
					});
	this.widgetPanel = new wm.WidgetDebugPanel({owner: this,
						    name: "widgetPanel",
						    parent: this.widgetLayer,
						    width: "100%",
						    height: "100%",
						    autoScroll:true});
    },

    newLogEvent: function(inData) {
	return this.eventsPanel.newLogEvent(inData);
    },
    endLogEvent: function(inId) {
	this.eventsPanel.endLogEvent(inId);
    },
    cacheEventChain: function() {
	if (this.eventsPanel && this.eventsPanel.currentEventChain && this.eventsPanel.currentEventChain.length) {
	    return dojo.clone(this.eventsPanel.currentEventChain);
	} else {
	    return 0;
	}
    },

    // cloning insures that we don't maintain a memory link into the anonymous functino that provided this, keeping that block of code alive
    restoreEventChain: function(inChain) {
	this.eventsPanel.currentEventChain = dojo.clone(inChain);
    },

    clearEventChain: function() {
	this.eventsPanel.currentEventChain = [];
    },
    addEventsLayer: function() {
/*
	this.eventsLayer = new wm.Layer({owner: this,
					 parent: this.tabLayers,
					 name: "eventsLayer",
					 caption: "Events"});
					 */
	this.bindSearchBar = new wm.Text({owner: this,
					   parent: this.eventsLayer,
					  placeHolder: "Search bindings by property name",
					  width: "100%",
					  emptyValue: "emptyString",
					  resetButton: true,
					  changeOnKey: true,
					  showing: false});
	this.connect(this.bindSearchBar, "onchange", this, function() {
	    this.debugTree.filterBindings(this.bindSearchBar.getDataValue());
	});
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
					  fitToContentHeight: true,
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
	    this.bindSearchBar.setShowing(bindButton.clicked);
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
    },
    _loadedCss: false,
    setShowing: function(inShowing) {
	if (inShowing && !this._loadedCss) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = dojo.moduleUrl("wm.base.debug").uri + "debugger.css";
            document.getElementsByTagName("head")[0].appendChild(link);
	}
	if (!this.showing && inShowing && this._lastDocked) {
	    this.setDocked(true,null,"b");
	}
	this.inherited(arguments);
    },
    setDocked: function(inDock,optionalParent,optionalEdge) {
	this.inherited(arguments);
	if (this.showing) {
	    this._lastDocked = this.docked;
	}
    }
});

dojo.declare("wm.debug.Inspector", wm.Container, {
    width: "100%",
    height: "100%",
    layoutKind: "top-to-bottom",
    horizontalAlign: "left",
    verticalAlign: "top",
    showing: false,
    border: "0,0,0,1",
    borderColor: "#888",
    postInit: function() {
	this.createComponents({
	    tabs: ["wm.TabLayers", {width: "100%", height: "100%", headerHeight: "20px", clientBorder: "1,0,0,0", margin: "0", padding: "0"}, {}, {
		eventsPanel: ["wm.debug.EventDetailsPanel",{}],
		propertiesPanel: ["wm.debug.PropertyPanel", {},{},{}],
		bindPanel: ["wm.debug.BindPanel", {}],		
		presentationPanel: ["wm.debug.StylePanel", {},{},{}],
		dataPanel: ["wm.debug.DataPanel", {},{},{}],
		requestPanel: ["wm.debug.RequestPanel", {},{},{}]
	    }]
	}, this);
	this.inherited(arguments);
	var x = document.createElement("span");
	dojo.addClass(x, "TabCloseIcon DebuggerCloseButton");
	x.innerHTML = "x";
	this.tabs.decorator.tabsControl.domNode.insertBefore(x, this.tabs.decorator.tabsControl.domNode.firstChild);
	this.connect(x, "onclick", this, "onXClick");
    },
    inspect: function(inComponent, inRequestData, inEventItem) {
	for (var i = 0; i < this.tabs.layers.length; i++) {
	    try {
		this.tabs.layers[i].inspect(inComponent,inRequestData, inEventItem);
	    } catch(e) {
		app.toastError("Error in " + this.tabs.layers[i].declaredClass + ": " + e.toString());
	    }
	}
    },
    setShowing: function(inShowing) {
	if (inShowing && this.tabs.layerIndex == -1) {
	    this.tabs.setLayerIndex(0);
	}
	this.inherited(arguments);
    }

});