/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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

dojo.provide("wm.base.mobile.Select");
dojo.require("wm.base.mobile.AbstractEditor");
//===========================================================================
// Select Editor
//===========================================================================
dojo.declare("wm.mobile.SelectMenu", wm.mobile.AbstractEditor, {
    showSearchBar: true,
    editorBorder: false,
    startUpdate: false,
    options: "",
    displayField: "",
    dataField: "",
    displayExpression: "",
    displayType:"Text",
    allowNone: false,
    restrictValues: true,
    selectedItem: null,
    init: function() {
	this.inherited(arguments);
	this.selectedItem = new wm.Variable({name: "selectedItem", owner: this});
    },
    postInit: function() {
	if (this.options) {
	    this.setOptions(this.options);
	}
	this.inherited(arguments);
	if (this.startUpdate)
	    this.update();

	this.connect(this.domNode, "onclick", this, function() {
	    if (!this.readonly && !this.disabled) {
		this.showListDialog();
	    }
	});
    },

    /* I think this and startUpdate are only used by wm.mobile.Lookup ?? */
    update: function() {
	if (this.dataSet instanceof wm.ServiceVariable) {
	    var d = this.dataSet.update();
	    return d;
	}
    },

    _createEditor: function(inNode, inProps) {
	var node = dojo.create("div", {className: "wmSelectMenuvalueNode"});
	this.domNode.appendChild(node);
	return node;
    },
    setRestrictValues: function(inValue) {
	this.restrictValues = inValue;
    },
    hasValues: function(){
	return this.dataSet && this.dataSet.getCount();
    },
    setInitialValue: function() {
	var dataValue = this.dataValue;
	var displayValue = this.displayValue;
	if (dataValue && this.haValues()) {
	    displayValue = this.lookupDisplayValue(dataValue);
	}
	if (displayValue || this.restrictValues) {
	    this.setDisplayValue(displayValue || "");
	} else {
	    this.setDisplayValue(dataValue);
	}
    },

    /*******************************
     * Working with display values *
     *******************************/
    lookupDisplayValue: function(inData) {
	if (!this.dataSet) return "";
	var count = this.dataSet.getCount();
	for (var i = 0; i < count; i++) {
	    var item = this.dataSet.getItem(i);
	    var val = item.getValue(this.dataField);
	    if (val == inData)
		return item.getValue(this.displayField);
	}
	return "";
    },
    setDisplayValue: function(inValue) {
	this.displayValue = inValue;
	this.editor.innerHTML = "<span class='wmSelectTextNode'>" + inValue + "</span>";
    },
    getDisplayValue: function() {
	return this.displayValue;
    },

    /*******************************
     * Working with data values *
     *******************************/
    setEditorValue: function(inValue) {
	var displayValue = this.lookupDisplayValue(inData);

	/* If inValue HAS a displayValue, then its a good value; else its only accepted if restrictValues is turned off */
	if (displayValue) {
	    this.setDisplayValue(displayValue);
	    this.dataValue = inValue;
	} else if (!this.restrictValues) {
	    this.setDisplayValue(inValue);
	    this.dataValue = null;
	} else {
	    this.setDisplayValue("");
	    this.dataValue = null;
	}
	if (!this.dataValue)
	    this.dataValue = this.makeEmptyValue();
	this.updateSelectedItem();
	this.editorChanged();
    },

    getEditorValue: function() {
	return this.dataValue;
    },


    setDataField: function(inDataField) {
	this.dataField = inDataField;
    },
    setDisplayField: function(inDisplayField) {
	this.displayField = inDisplayField;
    },

    /* If using a displayExpression, use this method to geneate the text from the variable item + displayExpression */
    _getDisplayData: function(inObj) {
        var inVariable;
        if (wm.isInstanceType(inObj, wm.Variable))
            inVariable = inObj;
        else {
            inVariable = new wm.Variable();
            inVariable.setType(this.dataSet.type);
            inVariable.setData(inObj);
            inVariable.data[this._storeNameField]  = String(this._getDisplayData(inVariable));
        }

	var de = this.displayExpression, v = inVariable;
	var result = de ? wm.expression.getValue(de, v) : inVariable.getValue(this._displayField);
        if (this.displayType && this.displayType != 'Text')
            result = this.formatData(result);
        return String(result);
    },

    setDataSet: function(inDataSet) {
	var ds = this.dataSet = inDataSet;
        if (inDataSet && inDataSet.type && inDataSet.type != "any" && inDataSet.type != this.selectedItem.type)
            this.selectedItem.setType(inDataSet.type);
	// whatever was selected is no longer selected
	this.selectedItem.setData(null);
    },

    /*******************************
     * Working with options list
     *******************************/
    setOptions: function(inOptions) {		
	this.options = inOptions;

	/* Parse the string */
	var data = [];
	if (!this.options) return data;
	for (var i=0, opts = this.options.split(','), l=opts.length, d; i<l; i++) {
	    d = dojo.string.trim(opts[i]);
	    if (d != "")
		data[i] = {name: d, dataValue: d };
	}

	/* Set the dataSet */
	var ds;
	if (this.dataSet && this.dataSet.owner == this)
	    ds = this.dataSet;
	else
	    ds = this.dataSet = new wm.Variable({name: "optionsVar",
						 owner: this,
						 type: "EntryData"});
	ds.setData(data);

	/* Set the fields for the new dataSet */
	this.setDisplayField = "name";
	this.setDataField    = "dataValue";
    },


    updateSelectedItem: function() {
	if (!this.dataSet) {
	    if (this.selectedItem.getData()) {
		this.selectedItem.setDataSet(null);
	    }
	}

	var count = this.dataSet.getCount();
	for (var i = 0; i < count; i++) {
	    var item = this.dataSet.getItem(i);
	    var val = item.getValue(this.dataField);
	    if (val == inData) {
		this.selectedItem.setData(item);
		return;
	    }
	}
	this.selectedItem.setDataSet(null);
    },

    showListDialog: function() {
	if (!this.dialog) {
	    this.filterDataSet = new wm.Variable({owner: this,
						  type: this.selectedItem.type,
						  isList: true});
	    this.dialog = new wm.mobile.Dialog({owner: this,
						title: this.caption,
						name: "dialog",
						fitToContentHeight: false,
						height: "90%"});
	    this.searchBar = new wm.mobile.Text({owner: this,
						 parent: this.dialog.containerWidget,
						name: "searchBar",
						 width: "100%",
						 caption: "Find",
						 captionSize: "50px",
						 changeOnKey: true,
						 border: "0,0,3,0",
						 borderColor: "#222222",
						 onEnterKeyPress:  dojo.hitch(this, function() {
						     // select the top option
						     if (this.filterDataSet.getCount() > 0) {
							   var inData = this.filterDataSet.getItem(0).getData();
							   this.dataValue = inData[this.dataField] || this.makeEmptyValue();
							   this.setDisplayValue(inData[this.displayField]);
							   this.selectedItem.setData(inData);
							   this.editorChanged();
							   this.dialog.hide();

						     }
						 }),
						 onchange: dojo.hitch(this, function() {
						     var val = this.searchBar.getDataValue().toLowerCase();
						     var data = this.dataSet.getData();
						     var newData = [];
						     for (var i = 0; i < data.length; i++) {
							 var item = data[i];
							 var displayVal = item[this.displayField].toLowerCase();
							 if (displayVal.indexOf(val) != -1)
							     newData.push(item);
						     }
						     this.filterDataSet.setData(newData);
						     this.searchList.setDataSet(this.filterDataSet);
						 })
						});
	    this.searchList = new wm.mobile.BasicList({owner: this,
						       parent: this.dialog.containerWidget,
						       name: "searchList",
						       onSelect: dojo.hitch(this, function(inItem, inData) {
							   this.dataValue = inData[this.dataField] || this.makeEmptyValue();
							   this.setDisplayValue(inData[this.displayField]);
							   this.selectedItem.setData(inItem);
							   this.editorChanged();
							   this.dialog.hide();
						       })
						      });
	}
	this.searchBar.setShowing(this.showSearchBar);
	this.searchList.setDisplayField(this.displayField);
	this.searchList.setDisplayExpression(this.displayExpression);
	this.searchList.setDataField(this.dataField);
	this.filterDataSet.setDataSet(this.dataSet);
	this.searchList.setDataSet(this.filterDataSet);
	this.dialog.show();
	this.searchBar.editor.focus();
    }
});



//===========================================================================
// Select Editor
//===========================================================================
wm.selectDisplayTypes = [
      "Text", "Date", "Time", "Number", "Currency"
];


//===========================================================================
// Lookup Editor
//===========================================================================
dojo.declare("wm.mobile.Lookup", wm.mobile.SelectMenu, {
	dataField: "All Fields",
	autoDataSet: true,
	startUpdate: true,
	init: function() {
		this.inherited(arguments);
		if (this.autoDataSet)
		    this.createDataSet();
            this.dataField = "All Fields"; // just in case someone somehow changed it, this must be all fields to work.
	},
	createDataSet: function() {
		wm.fire(this.$.liveVariable, "destroy");
		var v = wm.getFormLiveView(wm.getParentForm(this));
		if (v) {
			var ff = wm.getFormField(this);
			v.addRelated(ff);
			var lv = this.dataSet = new wm.LiveVariable({
				name: "liveVariable",
				owner: this,
				autoUpdate: false,
				startUpdate: false,
				_rootField: ff,
				liveView: v
			});
			this.selectedItem.setType(this.dataSet.type);
			this.createDataSetWire(lv);
		}
	},
	createDataSetWire: function(inDataSet) {
		var w = this._dataSetWire = new wm.Wire({
			name: "dataFieldWire",
			target: this,
			owner: this,
			source: inDataSet.getId(),
			targetProperty: "dataSet"
		});
		w.connectWire();
	},
	setAutoDataSet: function(inAutoDataSet) {
		this.autoDataSet = inAutoDataSet;
		if (this.autoDataSet) {
			this.createDataSet();
			this.update();
		}
	},
	_getFormSource: function(inForm) {
		var w = wm.data.getPropWire(inForm, "dataSet");
		return w && w.source && this.getRoot().getValueById(w.source);
		/*var o = this.owner, w = wm.data.getPropWire(o, "dataValue");
		return w && w.source && this.getRoot().getValueById(w.source);*/
	},
	// NOTE: lookups automatically push data back to their source
	changed: function() {
		// When loopup editor is changed by user only then we should change liveForms field values.
		// if value of loopupEditor is being initialized by the owner(not user) that means we should not change value of other fields in liveForm.
		if (this.isUpdating()) 
			return;

		this.inherited(arguments);
		var f = wm.getParentForm(this);
		var s = this._getFormSource(f);
		if (s) {
                        s.beginUpdate();
			//console.log(s.getId(), this.dataValue);
		        var v = this._selectedData;
			// update cursor
			if (this.autoDataSet && this.dataSet) {
                            // this is invalid; in some conditions, the objects in the datastore that populate _selectedData are no longer exact replicas of the objects in the datastore; for example, they have _selectMenuName property added to them
			    //var i = this.dataSet.getItemIndex(v);
                            var i = this.getItemIndex(v);
				if (i >=0)
					this.dataSet.cursor = i;
			}
			s.setData(v);
			this.endEditUpdate();
			//wm.fire(f, "populateEditors");
		}
	},

	setDefaultOnInsert:function(){
		if (this.editor && this.defaultInsert){
			this.setEditorValue(this.defaultInsert);
			this.changed();
		}
	}
});

// design only
wm.mobile.SelectMenu.extend({
    themeableStyles: ["wm.SelectMenu-Down-Arrow_Image", "wm.SelectMenu-Inner_Radius"],
	updateNow: "(updateNow)",
	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
			var ds = this.getValueById(inDataSet);
			if (ds)
				this.components.binding.addWire("", "dataSet", ds.getId());
		} else {
			this.setDataSet(inDataSet);
		}
	},
	// FIXME: for simplicity, allow only top level , non-list, non-object fields.
	_addFields: function(inList, inSchema) {
		for (var i in inSchema) {
			var ti = inSchema[i];
			if (!(ti||0).isList && !wm.typeManager.isStructuredType((ti||0).type)) {
				inList.push(i);
			}
		}
	},
	_listFields: function() {
		var list = [ "" ];
		var schema = this.dataSet instanceof wm.LiveVariable ? wm.typeManager.getTypeSchema(this.dataSet.type) : (this.dataSet||0)._dataSchema;
		var schema = (this.dataSet||0)._dataSchema;
		this._addFields(list, schema);
		return list;
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "displayField":
				return makeSelectPropEdit(inName, inValue, this._listFields(), inDefault);
			case "dataField":
				var values = this._listFields();
		                if (values.length) values[0] = this._allFields;
		                if (!inValue) inValue = this._allFields;
		                return new wm.propEdit.Select({component: this, name: inName, value: inValue, options: values});

			case "displayType":
				return makeSelectPropEdit(inName, inValue, wm.selectDisplayTypes, inDefault);
			case "dataSet":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.dataSet ? this.dataSet.getId() : "", allowAllTypes: true, listMatch: true});
			case "updateNow":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
		}
		return this.inherited(arguments);
	},
    setPropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "displayField":
	    var editor1 = dijit.byId("studio_propinspect_displayField");

	    var store1 = editor1.store.root;

	    while (store1.firstChild) store1.removeChild(store1.firstChild);


	    var displayFields = this.makePropEdit("displayField");
	    displayFields = displayFields.replace(/^.*?\<option/,"<option");
	    displayFields = displayFields.replace(/\<\/select.*/,"");
	    store1.innerHTML = displayFields;
	    return true;
	case "dataField":
	    var editor1 = dijit.byId("studio_propinspect_dataField");

	    var store1 = editor1.store.root;

	    while (store1.firstChild) store1.removeChild(store1.firstChild);


	    var dataFields = this.makePropEdit("dataField");
	    dataFields = dataFields.replace(/^.*?\<option/,"<option");
	    dataFields = dataFields.replace(/\<\/select.*/,"");
	    store1.innerHTML = dataFields;
	    return true;
	}
	return this.inherited(arguments);
    },    
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "updateNow":
				return this.update();
		}
	},
	setHasDownArrow: function(inValue){
		this.hasDownArrow = inValue;
		//this.editor.attr('hasDownArrow', this.hasDownArrow); does not work updates the editor instantly. Therefore wrote a hack to hide downArrowNode by updating style prop.
		if (this.editor.downArrowNode){
			this.editor.downArrowNode.style.display = this.hasDownArrow ? "" : "none";
		}
	}
});



wm.Object.extendSchema(wm.mobile.SelectMenu, {
    restrictValues: {type: "wm.Boolean", group: "editor", order: 40, doc: 1},
	changeOnKey: { ignore: 1 },
	changeOnEnter: { ignore: 1 },
    selectedItem: { ignore: true, bindSource: true, isObject: true, bindSource: true, doc: 1},
	dataSet: { readonly: true, group: "editor", order: 4, type: "wm.Variable", isList: true, bindTarget: true, doc: 1},
	startUpdate: { group: "editor", order: 5},
  pageSize: { order: 6, group: "editor"},
	liveVariable: {ignore: 1 },
	options: {group: "editor", order: 7},
        dataValue: {ignore: 1, bindable: 1, group: "editData", order: 3, simpleBindProp: true, type: "any"}, // use getDataValue()
	dataField: {group: "editor", order: 10, doc: 1},
	displayField: {group: "editor", order: 15,doc: 1},
	displayExpression: {group: "editor", order: 20, doc: 1},
	displayType:{group: "editor", order: 21},
  autoComplete: {group: "editor", order: 25},
	hasDownArrow: {group: "editor", order: 26},
  allowNone: {group: "editor", order: 30},
	updateNow: {group: "operation"},
  dataFieldWire: { ignore: 1},
  optionsVar: {ignore:1},
	_allFields: {ignore:1},
    defaultInsert:{ignore:1, bindTarget: 1, type:'wm.Variable', group: "editData", order: 10, dependency: '${parent.declaredClass} == "wm.LiveForm" || ${parent.declaredClass} == "wm.RelatedEditor"'},
    setRestrictValues: {group: "method", doc: 1},
    setDataSet: {group: "method", doc: 1},
    setOptions: {group: "method", doc: 1},
    getItemIndex: {group: "method", doc: 1, returns: "Number"}
});


wm.Object.extendSchema(wm.mobile.Lookup, {
	autoDataSet: {group: "data", order: 3},
	options: {ignore: 1},
	dataField: {ignore: 1}
});


wm.mobile.Lookup.extend({
	listProperties: function() {
		var props = this.inherited(arguments);
		props.dataSet.ignoretmp = this.autoDataSet;
		props.dataSet.bindTarget = !props.dataSet.ignoretmp;
		return props;
	}
});