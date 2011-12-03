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

dojo.provide("wm.base.components.LiveVariable_design");
dojo.require("wm.base.components.LiveVariable");

wm.Object.extendSchema(wm.LiveVariable, {
        downloadFile: {ignore: 1},
	related: { ignore: 1},
	view: { ignore: 1},
	service: { ignore: 1},
	dataType: { ignore: 1},
	type: { ignore: 0,  editor: "wm.prop.DataTypeSelect", editorProps: {liveTypes: 1}},
    operation: { group: "data", order: 0}, // do not try and set the options here; parent class overrides this usage by handling operation in makePropEdit
	input: {ignore: 1},
    liveSource: { group: "data", order: 1, editor: "wm.prop.DataSetSelect", editorProps: {servicesOnly: 1, includeLiveViews: true}, ignoreHint: "LiveSource is a deprecated property; it is only enabled for LiveVariables already using it"},
	liveView: { ignore: 1},
    sourceData: {readonly: 1, group: "data", createWire: 1, order: 3, bindTarget: 1, treeBindField: "sourceData", editor: "wm.prop.DataSetSelect", editorProps: {widgetDataSets: true, listMatch: false}},
    filter: {readonly: 1, group: "data", createWire: 1, order: 5, bindTarget: 1, treeBindField: "filter", editor: "wm.prop.DataSetSelect", editorProps: {widgetDataSets: true, listMatch: false}},
    matchMode: {group: "data", order: 10, options: ["start", "end", "anywhere", "exact"]},
	orderBy: {group: "data", order: 19},
	ignoreCase:  {group: "data", order: 20},
	configure: { ignore: 1 },
    dataSetCount: { ignore: 1 },
    editView: {group: "data",operation:1}
});

wm.LiveVariable.extend({
	_operations: ["read", "insert", "update", "delete"],
	makePropEdit: function(inName, inValue, inEditorProps) {
	    if (inName == "operation") {
		return new wm.SelectMenu(dojo.mixin(inEditorProps, {options: this._operations}));
	    }
	    return this.inherited(arguments);
	},
	listProperties: function() {
		var
			p = this.inherited(arguments),
			r = (this.operation == "read");
		p.matchMode.ignoretmp = !r;
		p.firstRow.ignoretmp = !r;
		p.maxResults.ignoretmp = !r;
		p.designMaxResults.ignoretmp = !r;
		p.orderBy.ignoretmp = !r;
		p.ignoreCase.ignoretmp = !r;
		p.filter.ignoretmp = !r;
	        p.sourceData.ignoretmp = r;

	    p.liveSource.ignoretmp = !this.liveSource; // if there's no liveSource, hide the prop because its deprecated 
	    p.editView.ignoretmp = Boolean(this.liveSource);


	        p.sourceData.categoryParent = !r ? "Properties" : "";
	        p.sourceData.ignoretmp = r;
		return p;
	},
	isListBindable: function() {
		return this.operation == "read" ? !(this.sourceData && !wm.isEmpty(this.sourceData.getData())) : false;
	},
	designCreate: function() {
		this.inherited(arguments);
		this.subscribe("wmwidget-idchanged", this, "componentNameChanged");
		
	},
	componentNameChanged: function(inOldId, inNewId, inOldRtId, inNewRtId) {
		if (inOldId == this.liveSource)
			this.setLiveSource(inNewId);
	},
	set_operation: function(inOperation) {
		this.operation = inOperation;
		// just a good idea for safety
		if (this.isDesignLoaded()) {
			// automatically set autoUpdate to true if we're reading, 
			// since this is the default anyway, otherwise set to false.
		        this.setStartUpdate(inOperation == "read");
			this.setAutoUpdate(inOperation == "read");

		}
	},

/* DEPRECATED */
	set_liveSource: function(inLiveSource) {
	    this.setLiveSource(inLiveSource);

	    if (studio.selected == this)
		studio.inspector.inspect(this);

	},
	set_sourceData: function(inSourceData) {
		this.setSourceData(inSourceData);
		if (this.isDesignLoaded() && studio.selected == this)
			studio.inspector.inspect(this);
	},
	set_filter: function(inFilter) {
		this.setFilter(inFilter);
/*
		if (this.isDesignLoaded() && studio.selected == this)
			studio.inspector.inspect(this);
			*/
	},
	checkOrderBy: function(inOrderBy) {
		var
			orderParts = (inOrderBy || "").split(','),
			re = new RegExp("^(?:asc|desc)\:", "i");
		for (var i=0, o; (o = orderParts[i]); i++)
			if (!dojo.trim(o).match(re)) {
			    app.alert(studio.getDictionaryItem("wm.LiveVariable.ALERT_INVALID_SORT_ORDER", {order: o}));
				return;
			}
		return true;
	},
	set_orderBy: function(inOrderBy) {
		this.checkOrderBy(inOrderBy);
		this.setOrderBy(inOrderBy);
	},
    editView: function() {
		    studio.liveViewEditDialog.show();
		    studio.liveViewEditDialog.page.setLiveView(this.liveView);
	},
    _isWriteableComponent: function(inName, inProperties) {
	if (inName == "liveView") {
	    return !this.liveSource;
	} else {
	    return this.inherited(arguments);
	}
    }

});

