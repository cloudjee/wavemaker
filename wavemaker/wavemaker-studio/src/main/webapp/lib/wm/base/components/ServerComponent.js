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

dojo.provide("wm.base.components.ServerComponent");
dojo.require("wm.base.Component");

/**
	Base class for all server-side components.
	@name wm.ServerComponent
	@class
	@extends wm.Component
*/
dojo.declare("wm.ServerComponent", wm.Component, {
	noInspector: true,
	init: function() {
		this.inherited(arguments);
		this.publishClass = this.publishClass || this.declaredClass;
	},
	prepare: function() {
		this.inherited(arguments);
		this.setOwner(null);
	},
	write: function() {
		return "";
	},
	designSelect: function() {
		this.editView();
	},
	editView: function() {
	},

    onServiceTreeDrop: function(inParent, inOwner, inNode) {
	var operation = inNode.isOperation ? inNode.content : "";
	var result = new wm.ServiceVariable({owner: inOwner,
					   name: inOwner.getUniqueName(this.name + "SVar"),
					   service: this.name,
					   operation: operation,
					   startUpdate: false,
					   autoUpdate: false});

	return result; // returning will trigger a design tree refresh and a studio.select
    }

/*
    onServiceTreeDrop: function() {
	if  (!inNode.isOperation) {
	    return new wm.ServiceVariable({owner: inOwner,
					   name: inOwner.getUniqueName(this.name + "SVar"),
					   service: this.name,
					   startUpdate: false,
					   autoUpdate: false});
	}

	var operation = inNode.content;
	var service = this.name;
	var serviceVariable = new wm.ServiceVariable({owner: inOwner,
						      name: inOwner.getUniqueName(operation + wm.capitalize(service) + "SVar"),
						      service: service,
						      operation: operation,
						      startUpdate: false,
						      autoUpdate: false});
	var schema = serviceVariable._dataSchema;

	var i = 0;
	for (var name in schema) {
	    i++;
	}
	var isComplexType = i > 1;
	var isList = serviceVariable.isList;

	if (isComplexType || isList) {
	    var panel = new wm.Panel({name:  inOwner.getUniqueName(operation + wm.capitalize(service) + "Panel"),
				      width: "100%",
				      owner: inOwner,
				      parent: inParent,
				      layoutKind: "top-to-bottom",
				      horizontalAlign: "left",
				      verticalAlign: "top"});
	}

	if (isComplexType && isList) {
	    panel.setHeight("100%");
	    var grid = new wm.DojoGrid({width: "100%",
					height: "100%",
					name: inOwner.getUniqueName(operation + wm.capitalize(service) + "Grid"),
					owner: inOwner,
					parent: panel});
	    grid.$.binding.addWire(null, "dataSet", serviceVariable.name,"");

	    var form = new wm.DataForm({width: "100%",
					height: "100%",
					name: inOwner.getUniqueName(operation + wm.capitalize(service) + "Form"),
					owner: inOwner,
					parent: panel});			
	    form.$.binding.addWire(null, "dataSet", grid.name + ".selectedItem","");		
	    serviceVariable.setStartUpdate(true);
	} else if (isComplexType) {
	    var form = new wm.DataForm({width: "100%",
					height: "100%",
					name: inOwner.getUniqueName(operation + wm.capitalize(service) + "Form"),
					owner: inOwner,
					parent: panel});			
	    form.$.binding.addWire(null, "dataSet", serviceVariable.name,"");		
	    panel.setHeight(form.height);
	    serviceVariable.setStartUpdate(true);
	} else if (isList) {
	    var menu = new wm.SelectMenu({width: "100%",
					  name: inOwner.getUniqueName(operation + wm.capitalize(service) + "Menu"),
					owner: inOwner,
					parent: panel});
	    menu.$.binding.addWire(null, "dataSet", serviceVariable.name,"");
	    panel.setHeight(menu.height);
	    serviceVariable.setStartUpdate(true);
	}

	return panel || serviceVariable;

    }
    */

});
