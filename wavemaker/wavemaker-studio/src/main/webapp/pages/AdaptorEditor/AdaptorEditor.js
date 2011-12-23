/*
 * Copyright (C) 2011 VMware, Inc. All rights reserved.
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
 

dojo.declare("AdaptorEditor", wm.Page, {
    i18n: true,
    //defaultItem: null,
    //defaultItemEnabled: false,
    start: function() {
    
    },
    setSourceType: function(inType) {
	var fields = wm.typeManager.getType(inType).fields;
	var data = [{dataValue: "(display expression)"}];
	for (var fieldName in fields) {
	    data.push({dataValue: fieldName});
	}
	this.sourceFieldsVar.setData(data);
    },
    setOutputType: function(inType) {
	this.fieldListPanel.removeAllControls();	
	var fields = wm.typeManager.getType(inType).fields;
	for (var fieldName in fields) {
	    if (!wm.typeManager.isStructuredType(fields[fieldName]))
		this.addRow(fieldName);
	}
	this.fieldListPanel.reflow();
    },
    addRow: function(fieldName) {
	var panel = new wm.Panel({owner: this,
				  parent: this.fieldListPanel,
				  layoutKind: "left-to-right",
				  height: "30px",
				  width: "100%"});
	var menu = new wm.SelectMenu({owner: this,
				      parent: panel,
				      caption: fieldName,
				      captionSize: "120px",
				      width: "50%",
				      allowNone: true
				     });
	var displayExpr = new wm.Text({showing: false,
				       owner: this,
				       parent: panel,
				       caption: "",
				       captionSize: "120px",
				       width: "50%",
				       margin: "0,2,0,2"});
	menu.setDataSet(this.sourceFieldsVar);
	menu.onchange = dojo.hitch(this, function() {
	    displayExpr.setShowing(menu.getDisplayValue() == "(display expression)");
	    this.editComponent._mapping[fieldName] = {fieldName: menu.getDisplayValue(),
						     displayExpr: ""};
	    this.editComponent.updateMapping();
	});
	displayExpr.onchange = dojo.hitch(this, function() {
	    this.editComponent._mapping[fieldName] = {fieldName: "",
						     displayExpr: displayExpr.getDataValue()};
	    this.editComponent.updateMapping();
	});
    },
    updateMapping: function() {
	
    },
    setComponent: function(inComponent) {
	this.editComponent = inComponent;
    },
  _end: 0
});