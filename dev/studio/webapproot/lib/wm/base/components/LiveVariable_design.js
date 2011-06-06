/* 
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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
    operation: { group: "data", order: 0}, // do not try and set the options here; parent class overrides this usage
	input: {ignore: 1},
	liveSource: { group: "data", order: 1},
	liveView: { ignore: 1},
    sourceData: {ignore: 1, group: "data", order: 3, bindTarget: 1, categoryParent: "Properties", categoryProps: {component: "sourceData", inspector: "Data"}, doc: 1},
    filter: { ignore: 1, group: "data", order: 5, bindTarget: 1, categoryParent: "Properties", categoryProps: {component: "filter", inspector: "Data"}, doc: 1},
	matchMode: {group: "data", order: 10},
	firstRow: {group: "data", order: 15},
	//maxResults: {group: "data", order: 17},
	//designMaxResults: {group: "data", order: 18},
	orderBy: {group: "data", order: 19},
	ignoreCase:  {group: "data", order: 20},
	configure: { ignore: 1 },
	dataSetCount: { ignore: 1 }
});

wm.LiveVariable.extend({
	_operations: ["read", "insert", "update", "delete"],
	_matchModes: ["start", "end", "anywhere", "exact"],
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
		p.filter.bindTarget = r;
		p.filter.categoryParent = r ? "Properties" : "";
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

			if (studio.selected == this)
			    studio.inspector.initTree(this);

		}
	},

	set_liveSource: function(inLiveSource) {
		this.setLiveSource(inLiveSource);
/*
		if (this.isDesignLoaded() && studio.selected == this)
			studio.inspector.inspect(this);
			*/
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
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "liveSource":
				return new wm.propEdit.LiveSourcesSelect({component: this, name: inName, value: inValue});
			case "matchMode":
				return makeSelectPropEdit(inName, inValue, this._matchModes, inDefault);
			case "operation":
		    return makeSelectPropEdit(inName, inValue, ["read", "insert", "update", "delete"], inDefault);
		}
		return this.inherited(arguments);
	},
    setPropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "operation":
	    var editor = dijit.byId("studio_propinspect_operation");
	    if (editor) editor.set(inValue, false);
	    return true;
	}
	return this.inherited(arguments);
    }

});

