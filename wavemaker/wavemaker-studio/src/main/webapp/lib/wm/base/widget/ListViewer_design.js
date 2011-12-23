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

dojo.provide("wm.base.widget.ListViewer_design");
dojo.require("wm.base.widget.ListViewer");
dojo.require("wm.base.widget.Container_design");


// design only
wm.ListViewer.extend({
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "dataSet":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.dataSet ? this.dataSet.getId() : "", allowAllTypes: true, listMatch: true, createWire: true});
		}
		return this.inherited(arguments);
	},
/*
	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
			var ds = this.getValueById(inDataSet);
			if (ds)
				this.components.binding.addWire("", "dataSet", ds.getId());
		} else
			this.setDataSet(inDataSet);
	},
	*/
    createNewPage: function() {
	var pages = studio.project.getPageList();
	studio.project.variableType = this.dataSet.type;

	var l = {};
	dojo.forEach(pages, function(p) {
	    l[p] = true;
	});
        studio.promptForName("page", wm.findUniqueName("Row", [l]), pages,
                             dojo.hitch(this, function(n) {
				 n = wm.capitalize(n);
				 this.pageName = n;
                                 this._type = this.dataSet.type;
                                 var data = this.dataSet.getData();
                                 if (data && data.length)
                                     this._sample = dojo.toJson(data[0]);
				 studio.confirmSaveDialog.page.setup(
				     studio.getDictionaryItem("CONFIRM_OPEN_PAGE", {oldPage: studio.project.pageName, newPage: this.pageName}),
				     dojo.hitch(this,function() {
					 studio.project.saveProject(false, dojo.hitch(this, function() {
					     studio.project.newPage(n,"wm.ListViewerRow", {template: wm.widgetSpecificTemplate.ListViewerRow, editTemplate: dojo.hitch(this, "editTemplate")});
					 }));
				     }),
				     dojo.hitch(this,function() {
					 studio.project.newPage(n,"wm.ListViewerRow", {template: wm.widgetSpecificTemplate.ListViewerRow, editTemplate: dojo.hitch(this, "editTemplate")});
				     }));
			     }));						 
    }
});

wm.Object.extendSchema(wm.ListViewer, {
    avgHeight: {type: "Number"},
    dataSet: { readonly: true, group: "data", order: 1, bindTarget: 1, type: "wm.Variable", isList: true, editor: "wm.prop.DataSetSelect", editorProps: {listMatch: true, widgetDataSets: true, allowAllTypes: true}},
    pageName: {group: "common", type: "string", order: 50, editor: "wm.prop.PagesSelect"},
    customGetValidate:  {ignore: true},
    fitToContentWidth:  {ignore: true},
    fitToContentHeight:  {ignore: true},
    imageList: {ignore: true},
    lock: {ignore: true},
    selectedItem: { ignore: 1, bindSource: 1, isObject: true, simpleBindProp: true },    
    autoScroll: {ignore: true, writeonly: 1},
    scrollX: {ignore: true, writeonly: 1},
    scrollY: {ignore: true, writeonly: 1},
    touchScrolling: {ignore: true, writeonly: 1}
});

