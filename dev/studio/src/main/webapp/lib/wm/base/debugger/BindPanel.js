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

dojo.provide("wm.base.debugger.BindPanel");

dojo.declare("wm.debugger.BindPanel", wm.Layer, {
    width: "100%",
    height: "100%",
    caption: "Bindings",
    layoutKind: "top-to-bottom",
    verticalAlign: "top",
    horizontalAlign: "left",
    autoScroll: true,



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
	this.createComponents({
	            bindingListVar:["wm.Variable", {type: "debuggerBindingType", isList: true}],
		    bindGrid: ["wm.DojoGrid", 
			   {width: "100%", height: "100%","columns":[
			       {"show":true,"field":"fieldName","title":"Bind List","width":"100%","align":"left","formatFunc":"",expression: "'<b>Field name</b>: ' +${fieldName} + '<br/><b>Bound to</b>: ' + (${boundTo} || ${expression}) + '<br/><b>Value</b>: ' + ${dataValue} + (${errors} ? ' <span style=\"color:red\">INVALID BINDING!</span>' : '')"},
			       {"show":true,"field":"fire","title":"-","width":"60px","align":"left","formatFunc":"wm_button_formatter","formatProps":null,"expression":"\"Update\"","isCustomField":true}
/*,
				 {"show":true,"field":"Value","title":"dataValue","width":"100px","align":"left","formatFunc":""},
			       {"show":true,"field":"boundTo","title":"Bound To","width":"100%","align":"left","formatFunc":"", expression: "${boundTo} || ${expression}"}*/
			     ],
			      "margin":"4",
			    "name":"bindGrid", selectionMode: "none"}, {onGridButtonClick: "fireBinding"}, {
				  binding: ["wm.Binding", {"name":"binding"}, {}, {
				      wire: ["wm.Wire", {"expression":undefined,"name":"wire","source":"bindingListVar","targetProperty":"dataSet"}, {}]
				  }]
			      }]
	}, this);
    },
    inspect: function(inComponent) {

	this.selectedItem = inComponent;
	this.bindingListVar.beginUpdate();
	this.bindingListVar.clearData();
	var b = this.selectedItem.$.binding;
	this.disconnectBindDebugConnections();
	this._debugBindConnections = [];
	if (b) {
	    for (var name in b.wires) {
		var w = b.wires[name];
		var dataValue = w.expression ? wm.expression.getValue(w.expression, w.getRoot()) : w.getValueById(w.source);
		if (dataValue instanceof wm.Component)
		    dataValue = dataValue.toString();

		var validBinding = this.isValidBinding(w);

		this.bindingListVar.addItem({fieldName: name,
					     dataValue: dataValue,
					     id: w.getRuntimeId(),
					     boundTo: w.source,
					     expression: w.expression,
					     errors: !validBinding});
		this._debugBindConnections.push(dojo.connect(w, "_sourceValueChanged", this, function() {
		    wm.job(this.getRuntimeId() + ".refreshGrid", 10, dojo.hitch(this, function() {this.inspect(this.selectedItem);}));
		}));
	    }
	}

	this.bindingListVar.endUpdate();	    
	this.bindingListVar.notify();
	this.setShowing(this.bindingListVar.getCount());
    },
/* Not gaurenteed to get it right 100% of the time; doesn't even try to evaluate expressions. Mostly good for detecting bindings to things that no longer exist */
    isValidBinding: function(inWire) {
	if (inWire.expression) return true;
	var parts = inWire.source.split(/\./);
	var r = inWire.getRoot();
	while (parts.length) {
	    if (!r) return true;
	    var property = parts.shift();
	    var newR = r[property];
	    if (newR === undefined && property in r.constructor.prototype == false) {
		return false;
	    }

	    r = newR;
	}
	return true;
    },
    fireBinding: function(inSender, fieldName, rowData, rowIndex) {
	var id = rowData.id;
	var wire = app.getValueById(id);
	if(wire)
	    wire.refreshValue();
    },
    disconnectBindDebugConnections: function() {
	if (this._debugBindConnections) {
	    for (var i = 0; i < this._debugBindConnections.length; i++) {
		dojo.disconnect(this._debugBindConnections[i]);
	    }
	}
    },
    destroy: function() {
	this.disconnectBindDebugConnections();
	this.inherited(arguments);
    }
});