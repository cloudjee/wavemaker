dojo.provide("wm.base.widget.Editors.DataSetEditor_design");
dojo.require("wm.base.widget.Editors.DataSetEditor");

wm.DataSetEditor.extend({
	updateNow: "(updateNow)",
    /* Don't show optionsVar in the dataSet property field */
        get_dataSet: function() {
	    if (this.dataSet == this.$.optionsVar)
		return null;
	    return this.dataSet;
	},
	set_dataSet: function(inDataSet) {
	    // support setting dataSet via id from designer
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
		var oldDataSet = this.dataSet;

		/* Clear the options property if setting a new dataSet */
		if (this.options && inDataSet != this.$.optionsVar) {
		    this.options = "";
		}
		this.setDataSet(inDataSet);

		/* If there is no displayExpression, and either no displayField or an invalid displayField, get a new displayField */
		if (!this.displayExpression &&
		    (!this.displayField || !wm.typeManager.getType(inDataSet.type) || !wm.typeManager.getType(inDataSet.type).fields[this.displayField])) {
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
    defaultInsert:{bindTarget: 1, type:'wm.Variable', group: "editData", order: 10},
  optionsVar: {ignore:1},    
    editorType: {group: "common", order: 501, options: ["ListSet", "SelectMenu", "RadioSet", "CheckboxSet"]},
    formatter: {ignore: true},
    selectedItem: { ignore: true, bindSource: true, isObject: true, bindSource: true, doc: 1},
    dataSet: { group: "editor", order: 4, type: "wm.Variable", isList: true, bindTarget: true, doc: 1, editor: "wm.prop.DataSetSelect"},
    startUpdate: { group: "editor", order: 5},
    options: {group: "editor", order: 7},
    dataValue: {type: "any"}, // use getDataValue()
    dataField: {group: "editor", order: 10, doc: 1, editor:"wm.prop.FieldSelect", editorProps: { emptyLabel: "All Fields"}},
    displayField: {group: "editor", order: 15,doc: 1, editor:"wm.prop.FieldSelect", editorProps: {}},
    displayExpression: {group: "editor", order: 20, doc: 1, displayExpression: "displayExpression", displayExpressionDataSet: "dataSet"}, /* last property is the name of the field that is used as a display expression */
    displayType:{ignore: 1,group: "editor", order: 21, options: wm.selectDisplayTypes},
    emptyValue: {ignore: 1},
    updateNow: {group: "operation", operation: 1},
    optionsVar: {ignore:1},

    setDataSet: {method:1, doc: 1},
    setOptions: {method:1, doc: 1}
});


wm.Object.extendSchema(wm.ListSet, {
    searchBar: {group: "editor", order: 100},
    onblur: {ignore: 1},
    onfocus: {ignore: 1}

});