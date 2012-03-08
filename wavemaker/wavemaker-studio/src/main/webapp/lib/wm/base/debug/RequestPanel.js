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

dojo.provide("wm.base.debug.RequestPanel");

dojo.declare("wm.debug.RequestPanel", wm.Layer, {
    width: "100%",
    height: "100%",
    caption: "Request",
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
	    //	    dataEditor: [wm.isMobile ? "wm.LargeTextArea" : "wm.AceEditor", {"height":"100%","name":"dataEditor","width":"100%"}],
	    dataEditor: ["wm.LargeTextArea", {"height":"100%","name":"dataEditor","width":"100%"}],
	    setRequestButton: ["wm.Button", {name: "fireButton", caption: "setRequest()", width: "120px", height:"20px",margin:"2",border:"1",borderColor:"#666"},{onclick: "fireFromDebugger"}]
	}, this);
    },


    inspect: function(inComponent, inGridItem) {
	this.selectedItem = inComponent;
	if (!this.selectedItem || this.selectedItem instanceof wm.ServiceVariable == false) {
	    this.hide();
	    return;
	}
	this.show();
	if (inGridItem) {
	    var data = inGridItem.getValue('request');
	    var cleanData;
	    if (app.debugDialog.serviceGridPanel.declaredClass == "wm.DojoGrid") {
		cleanData = wm.DojoGrid.prototype.itemToJSONObject(app.debugDialog.serviceGridPanel.serviceGrid.store,data);
	    } else {
		cleanData = data;
	    }
	    this.dataEditor.setDataValue(js_beautify(dojo.toJson(cleanData||"")));
	} else {
	    var data;
	    if (inComponent instanceof wm.LiveVariable && inComponent.operation == "read") {
		data = inComponent.filter.getData();
	    } else if (inComponent instanceof wm.LiveVariable) {
		data = inComponent.sourceData.getData();
	    } else {
		data = inComponent.input.getData();
	    }
	    this.dataEditor.setDataValue(js_beautify(dojo.toJson(data)));
	}
	if (this.dataEditor.setLineNumber)
	    this.dataEditor.setLineNumber(0);
    },
    fireFromDebugger: function() {
	var data = this.dataEditor.getDataValue();
	data = eval("(" + data + ")");
	if (this.selectedItem instanceof wm.LiveVariable && this.selectedItem.operation == "read") {
	    this.selectedItem.filter.setData(data);
	} else if (this.selectedItem instanceof wm.LiveVariable) {
	    this.selectedItem.sourceData.setData(data);
	} else {
	    this.selectedItem.input.setData(data);
	}
	this.selectedItem.update();
    },
    onShow: function() {
	this.dataEditor.focus();
    }
});