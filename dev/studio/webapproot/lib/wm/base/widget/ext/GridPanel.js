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
dojo.require("wm.base.widget.ext.Ext");
dojo.provide("wm.base.widget.ext.GridPanel");

dojo.declare("wm.ext.GridPanel", wm.Ext, {
	source: null,
	extClass: Ext.grid.GridPanel,
	extProps: {
		columns: [
			{header: "Country", sortable: true, dataIndex: "country.country"},
			{header: "City", sortable: true, dataIndex: "city"}
		],
		view: new Ext.grid.GroupingView({
			forceFit:true,
			groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
		})
	},
	initExt: function() {
		this.inherited(arguments);
	},
	setSource: function(inSource) {
		this.source = inSource;
		var source = this.getValueById(inSource);
		source.store.groupField = "country.country";
		//console.debug("ext.GridPanel.setSource: source = ", inSource, source);
		this.ext.reconfigure(source.store, this.ext.colModel);
	}
});

wm.Object.extendSchema(wm.ext.GridPanel, {
	source: { componentType: "wm.ServiceVariable" }
});


