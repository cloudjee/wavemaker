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
dojo.provide("wm.base.widget.Editors.DataSetEditor_design");
dojo.require("wm.base.widget.Editors.DataSetEditor");

wm.selectDisplayTypes = [
      "Text", "Date", "Time", "Number", "Currency"
];

wm.DataSetEditor.extend({
	updateNow: "(updateNow)",
    set_formField: function(inFormField) {
	this.inherited(arguments);
	if (!this.displayField && !this.displayExpression)
	    this._setDisplayField();
    },
    set_displayField: function(inField) {
	if (this.dataSet && this.dataSet._dataSchema && this.dataSet._dataSchema[inField]) {
	    var type = this.dataSet._dataSchema[inField].type;
	    switch(type.toLowerCase()) {
	    case "java.util.date":
	    case "date":
		this.displayType = "Date";
		break;
	    case "java.lang.integer":
	    case "number":
		this.displayType = "Number";
		break;
	    default:
		this.displayType = "Text";
	    }
	    this._formatter.destroy();
	    delete this._formatter;
	}
	this.setDisplayField(inField);
    },
    set_displayType: function(inType) {
	this.displayType = inType;
	if (this._formatter) {
	    this._formatter.destroy();
	    delete this._formatter;
	}
	this.createEditor();
    },
    /* Don't show optionsVar in the dataSet property field */
        get_dataSet: function() {
	    if (this.dataSet == this.$.optionsVar)
		return null;
	    return this.dataSet;
	},
	set_dataSet: function(inDataSet) {
	    // support setting dataSet via id from designer; DEPRECATED
	    if (inDataSet && !(inDataSet instanceof wm.Variable)) {
		var ds = this.getValueById(inDataSet);
		if (ds) {
		    this.components.binding.addWire("", "dataSet", ds.getId());
		}
	    } 

	     /* If the user triggers a set_dataSet(null) (user didn't trigger it if this._cupdating) then clear everything */    
            else if (!inDataSet && !this._cupdating) {            
		this.components.binding.removeWireByProp("dataSet");
		this.options = this.dataField = this.displayField = "";
		this.setDataSet(inDataSet);
	    } 

	    /* Else we have a dataSet and its a wm.Variable */
	    else {		    
		if (inDataSet) {
		    this.dataType = inDataSet.type;
		}
		var oldDataSet = this.dataSet;

		/* Clear the options property if setting a new dataSet */
		if (this.options && inDataSet != this.$.optionsVar) {
		    this.options = "";
		}
		this.setDataSet(inDataSet);

		/* If there is no displayExpression, and either no displayField or an invalid displayField, get a new displayField */
		if (!this.displayExpression && inDataSet && inDataSet.type &&
		    (!this.displayField || !wm.typeManager.getType(inDataSet.type) || !wm.typeManager.getType(inDataSet.type).fields || !wm.typeManager.getType(inDataSet.type).fields[this.displayField])) {
                    this._setDisplayField();                                                                                
                }

		else if (!this._cupdating && oldDataSet && inDataSet && inDataSet != this.$.liveVariable && (!this.displayField && !this.displayExpression || this._lastType != inDataSet.type))  {
		    if (wm.defaultTypes[inDataSet.type]) {
			this.dataField = "dataValue";
		    } else {
			this.dataField = "";
		    }
		    this._setDisplayField();
		}
	    }
	    if (inDataSet)
		this._lastType = inDataSet.type;
	},


    updateNow: function() {
	return this.update();
    },
    set_displayValue: function(inValue) {
	if (this._multiSelect) {
	    inValue =  inValue ? inValue.split(/\s*,\s*/) : [];
	}
	this.setDisplayValue(inValue);
    },
    set_dataValue: function(inValue) {
	if (this._multiSelect && typeof inValue == "string") {
	    inValue =  inValue ? inValue.split(/\s*,\s*/) : [];
	}
	this.setDataValue(inValue);
    },
    set_displayExpression: function(inExpr) {
	if (inExpr) {
		var ex2 = inExpr.replace(/\$\{.*?}/g, 1); // replace all ${...} with the value 1 for a quick and easy test to validate the expression
		try {
		    var result = eval(ex2);
		    if (typeof result == "object") {
			app.toastError("<" + ex2 + "> does not compile to a string value. Perhaps you need quotes?");
			return;
		    }
			
		} catch(e) {
		    app.toastError("Unable to compile this expression: " + e);
		    return;
		}
	}
	this.displayExpression = inExpr;
	this.createEditor();
    },
        listProperties: function() {
	    var props = this.inherited(arguments);
	    if (this.isAllDataFields()) {
		props.dataValue.simpleBindProp = false;
		props.selectedItem.simpleBindProp = true;
	    } else {
		props.dataValue.simpleBindProp = true;
		props.selectedItem.simpleBindProp = false;
	    }
	    return props;
	}

});

wm.Object.extendSchema(wm.DataSetEditor, {
    /* Editor group; value subgroup */
    defaultInsert:{type:'wm.Variable'},
    dataValue: {type: "any"}, // use getDataValue()

    /* Editor group; behavior subgroup */
    editorType: {options: ["ListSet", "SelectMenu", "RadioSet", "CheckboxSet"]},
    startUpdate: { group: "editor", subgroup: "behavior", order: 5, advanced: 1},

    /* Editor group; dataSet subgroup */
    dataSet: { group: "editor", subgroup: "dataSet", order: 4, type: "wm.Variable", isList: true, bindTarget: true, editor: "wm.prop.DataSetSelect", editorProps: {widgetDataSets: true}, requiredGroup:1},
    options: {group: "editor", subgroup: "dataSet", order: 7, requiredGroup: 1},
    dataField: {group: "editor", subgroup: "dataSet",order: 10, editor:"wm.prop.FieldSelect", editorProps: { emptyLabel: "All Fields"}, requiredGroup: 1},
    displayField: {group: "editor", subgroup: "dataSet",order: 15, editor:"wm.prop.FieldSelect", editorProps: {}, requiredGroup: 1},
    displayExpression: {group: "editor", subgroup: "dataSet",order: 20, displayExpression: "displayExpression", displayExpressionDataSet: "dataSet"}, /* displayExpressionDataSet is the name of the field that is used as a display expression */

    /* Editor group; display subgroup */
    displayType:{group: "editor", subgroup: "value", order: 21, options: wm.selectDisplayTypes},

    selectedItem: { ignore: 1, bindSource: true, isObject: true, bindSource: true, doc: 1},
    dataType: {hidden:1},

    /* Operations group */
    updateNow: {group: "operation", operation: 1},

    /* Ignored group */
    optionsVar: {ignore:1},    
    format: {ignore: 1},
    formatter: {ignore: 1},
    displayType: {ignore:1},
    emptyValue: {ignore: 1},
    optionsVar: {ignore:1},
    
    /* Methods */
    setDataSet: {method:1, doc: 1},
    setOptions: {method:1, doc: 1}
});


wm.Object.extendSchema(wm.ListSet, {
    selectionMode: {group: "editor", subgroup: "behavior", order: 101, options: ["single", "multiple", "checkbox", "radio"]},
    showSearchBar: {group: "editor", subgroup: "behavior", order: 100}, 
    deleteColumn:      {group: "editor", subgroup: "behavior",  order: 10, advanced:1},
    deleteConfirm:     {group: "editor", subgroup: "confirmation", order: 10, advanced:1},
    readonly: {ignore:1},
    searchBar: {ignore: 1},
    onblur: {ignore: 1},
    onfocus: {ignore: 1}

});