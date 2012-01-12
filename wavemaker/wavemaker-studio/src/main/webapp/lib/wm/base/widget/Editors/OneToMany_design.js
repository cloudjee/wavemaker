/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Editors.OneToMany_design");
dojo.require("wm.base.widget.Editors.OneToMany");
dojo.require("wm.base.widget.Editors.DataSetEditor_design");
wm.OneToMany.extend({
    set_formField: function(inField) {
	this.inherited(arguments);
	if (!inField) return;

	var parentForm = this.getParentForm();
	if (!parentForm) return;

	var type = parentForm.type;
	var typeDef = wm.typeManager.getType(type);
	if (!typeDef) return;
	var service = typeDef.service;

	/* step 1: find the relationship represented by this editor */
	var def = studio.dataService.requestSync("getRelated", [service, parentForm.serviceVariable.type.replace(/^.*\./,"")]);
	var fieldName, tableName;
	def.addCallback(dojo.hitch(this, function(inData) {
	    for (var i = 0; i < inData.length; i++) {
		var relationship = inData[i];
		var relationshipName = relationship.name;
		if (relationshipName == this.formField && relationship.cardinality.match(/\-many/)) {
		    fieldName = relationship.columnNames.join(",");
		    tableName = relationship.tableName;
		    return;
		}
	    }
	}));

	/* Step 2: Match that fieldName to the related object's relationship definitions because we need the name of the related object's relationship
	 * to delete that relationship.*/
	def = studio.dataService.requestSync("getRelated", [service, this.dataSet.type.replace(/^.*\./,"")]);
	def.addCallback(dojo.hitch(this, function(inData) {
	    for (var i = 0; i < inData.length; i++) {
		var relationship = inData[i];
		var columnNames = relationship.columnNames.join(",");
		if (columnNames == fieldName && tableName == relationship.tableName  && relationship.cardinality.match(/\-one/)) {
		    this.relationshipName = relationship.name; // setting this is what all of this set_formField method is all about
		}
	    }
	}));
    }
});

wm.Object.extendSchema(wm.OneToMany, {
    /* Editor group; value subgroup */
    formField: {editor: "wm.prop.FormFieldSelect", editorProps: {relatedFields: true, oneToMany: true, liveTypes: true}},
    editorType: {options: ["Lookup", "FilteringLookup", "OneToMany"]},
    showSearchBar: {ignore:1},
    searchBar: {ignore: 1},
    /* Ignored group */
    options: {ignore: 1},
    dataField: {hidden: 1},
    relationshipName: {hidden:1},
    liveVariable: {ignore:1}
});