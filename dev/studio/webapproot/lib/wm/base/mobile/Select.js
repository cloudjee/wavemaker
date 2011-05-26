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
    useNativeSelect: false,
    classNames: "",
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
	this.setUseNativeSelect(this.useNativeSelect);
    },
    setUseNativeSelect: function(inNative) {
	if (this.useNativeSelect != inNative)
	    dojo.removeClass(this.domNode, !inNative ? "wmnativeselectmenu" : "wmselectmenu");
	this.useNativeSelect = inNative;
	dojo.addClass(this.domNode, inNative ? "wmnativeselectmenu" : "wmselectmenu");
    },
    postInit: function() {
	if (this.options) {
	    this.setOptions(this.options);
	}
	this.inherited(arguments);
	if (this.startUpdate)
	    this.update();
	if (this.dataSet && this.dataSet.getCount())
	    this.setDataSet(this.dataSet);
    },
    clicked: function() {
	if (!this.useNativeSelect && !this.readonly && !this.disabled) {
	    this.showListDialog();
	}
    },
    setReadonly: function(inReadonly, hideOrShowEditor) {
	this.readonlyNode = this.editor;
	var r = this.readonly;
	this.readonly = inReadonly;
	dojo[inReadonly ? "addClass" : "removeClass"](this.domNode, "Readonly");
	dojo[!inReadonly ? "addClass" : "removeClass"](this.domNode, "NotReadonly");
    },
    /* I think this and startUpdate are only used by wm.mobile.Lookup ?? */
    update: function() {
	if (this.dataSet instanceof wm.ServiceVariable) {
	    var d = this.dataSet.update();
	    return d;
	}
    },

    _createEditor: function(inNode, inProps) {
	if (this.useNativeSelect) {
	    var node = dojo.create("select", {className: "wmSelectMenuvalueNode"}, this.domNode);
	} else {
	    var node = dojo.create("div", {className: "wmSelectMenuvalueNode"});
	    this.domNode.appendChild(node);
	    this._arrowNode = dojo.create("div", {className: "mblArrow"});
	    this.domNode.appendChild(this._arrowNode);
	}
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
	if (this.displayExpression)
	    return this.evalDisplayExpression(inData);
	else if (inData && dojo.isObject(inData))
	    return inData[this.displayField];
    },
    renderEditorBounds: function(b) {
	this.inherited(arguments);
	if (this.editor && this.editor.firstChild) {
	    this.editor.firstChild.style.lineHeight = this.editor.style.height;
	    this._arrowNode.style.top = (parseInt(this.editor.style.height)/2 - 5) + "px";
	}
    },
    setDisplayValue: function(inValue) {
	this.displayValue = inValue;
	if (this.displayExpression) {	    
	    inValue = this.evalDisplayExpression(this.selectedItem.getData());
	}
	this.editor.innerHTML = "<div class='wmSelectTextNode'>" + inValue + "</div>";
    },
    getDisplayValue: function() {
	if (this.useNativeSelect) {
	    if (this.editor.selectedIndex != -1)
		return this.editor.childNodes[this.editor.selectedIndex].innerHTML;
	    else
		return "";
	} else {
	    return this.displayValue;
	}
    },

    /*******************************
     * Working with data values *
     *******************************/
    setEditorValue: function(inValue) {
	if (this.useNativeSelect) {
	    this.editor.value = inValue;
	    this.dataValue = inValue;
	    this.displayValue = this.editor.childNodes[this.editor.selectedIndex].innerHTML;
	} else {
	    var displayValue = this.lookupDisplayValue(inValue);

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
	}

	if (!this.dataValue)
	    this.dataValue = this.makeEmptyValue();
	this.updateSelectedItem();
	this.editorChanged();
    },

    getEditorValue: function() {
	if (this.useNativeSelect) {
	    return this.editor.value;
	} else {
	    return this.dataValue;
	}
    },


    setDataField: function(inDataField) {
	this.dataField = inDataField;
    },
    setDisplayField: function(inDisplayField) {
	this.displayField = inDisplayField;
    },
    setDisplayExpression: function(inDisplayExpression) {
	this.displayExpression = inDisplayExpression;
    },

    /* If using a displayExpression, use this method to geneate the text from the variable item + displayExpression */
    evalDisplayExpression: function(inObj) {
        var inVariable;
        if (wm.isInstanceType(inObj, wm.Variable))
            inVariable = inObj;
        else {
            inVariable = new wm.Variable();
            inVariable.setType(this.dataSet.type);
            inVariable.setData(inObj);
        }

	var de = this.displayExpression, v = inVariable;
	var result = wm.expression.getValue(de, v) ;
        return String(result);
    },

    setDataSet: function(inDataSet) {
	var ds = this.dataSet = inDataSet;
        if (inDataSet && inDataSet.type && inDataSet.type != "any" && inDataSet.type != this.selectedItem.type)
            this.selectedItem.setType(inDataSet.type);
	// whatever was selected is no longer selected
	this.selectedItem.setData(null);
	if (this.useNativeSelect && this.editor) {
	    while (this.editor.childNodes.length > 0)
		this.editor.removeChild(this.editor.childNodes[0]);
	    if (inDataSet && inDataSet.getCount()) {
		var data = inDataSet.getData();
		for (var i = 0; i < data.length; i++) {
		    var option = dojo.create("option", {value: data[i][this.dataField], innerHTML: data[i][this.displayField]}, this.editor);
		}
	    }
	}
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

	/* Set the fields for the new dataSet; clear the displayExpression if anything has changed */
	if (this.displayField != "name" || this.dataField != "dataValue") {
	    this.displayField = "name";
	    this.dataField    = "dataValue";
	    this.displayExpression = "";
	}
	this.setDataSet(ds);
    },


    updateSelectedItem: function() {
	if (!this.dataSet) {
	    if (this.selectedItem.getData()) {
		this.selectedItem.setData(null);
	    }
	    return;
	}
	
	var count = this.dataSet.getCount();
	for (var i = 0; i < count; i++) {
	    var item = this.dataSet.getItem(i);
	    var val = item.getValue(this.dataField);
	    if (val == this.dataValue) {
		this.selectedItem.setData(item);
		return;
	    }
	}
	this.selectedItem.setData(null);
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
						animation: this._dialogAnimation || wm.mobile.Dialog.prototype.animation,
						height: "90%"});
	    this.searchBar = new wm.mobile.Text({owner: this,
						 parent: this.dialog.containerWidget,
						name: "searchBar",
						 width: "100%",
						 caption: "Find",
						 captionSize: "50px",
						 emptyValue: "emptyString",
						 changeOnKey: true,
						 border: "0,0,3,0",
						 borderColor: "#222222",
						 onEnterKeyPress:  dojo.hitch(this, function() {
						     /* TODO: Need an "OK" button for restrictValues == false */

						     // select the top option
						     if (this.filterDataSet.getCount() > 0 || !this.restrictValues) {

							 if (this.filterDataSet.getCount() > 0) {
							   var inData = this.filterDataSet.getItem(0).getData();
							   this.dataValue = inData[this.dataField] || this.makeEmptyValue();
							   this.selectedItem.setData(inData); // must come before setDisplayValue or displayExpressions fail
							   this.setDisplayValue(inData[this.displayField]);
							 } else {
							     this.dataValue = this.searchBar.getDataValue();
							     this.setDisplayValue(this.dataValue);
							 }
							 this.changed();
							 this.dialog.hide();
						     }
						 }),
						 onchange: dojo.hitch(this, function() {
						     var val = this.searchBar.getDataValue().toLowerCase();
						     var count = this.dataSet.getCount();
						     var newData = [];
						     for (var i = 0; i < count; i++) {
							 var item = this.dataSet.getItem(i);
							 var displayVal = this.displayExpression ? this.evalDisplayExpression(item) : item.getValue(this.displayField);
							 if (String(displayVal).toLowerCase().indexOf(val) != -1)
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
							   this.selectedItem.setData(inItem); // must come before setDisplayValue or displayExpressions fail
							   this.setDisplayValue(inData[this.displayField]);
							   this.changed();
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
	autoDataSet: true,
	startUpdate: true,
	init: function() {
		this.inherited(arguments);
		if (this.autoDataSet)
		    this.createDataSet();
	},
    setDataSet: function() {
	if (this._isDesignLoaded)
	    this.inherited(arguments);
    },
	createDataSet: function() {
	    wm.fire(this.$.liveVariable, "destroy");

	    var f = wm.mobile.getParentForm(this);
	    var type = f.dataSet.getValue(this.formField).type;
	    var lv = this.dataSet = new wm.LiveVariable({
		name: "liveVariable",
		owner: this,
		autoUpdate: false,
		startUpdate: false,
		liveSource:  type
	    });
			this.selectedItem.setType(this.dataSet.type);
			this.createDataSetWire(lv);
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
    editorChanged: function() {
	// When loopup editor is changed by user only then we should change liveForms field values.
	// if value of lookupEditor is being initialized by the owner(not user) that means we should not change value of other fields in liveForm.
	if (this.isUpdating()) 
	    return;

	this.inherited(arguments);

	/* Now get the form and the wm.LiveVariable that is the form's dataSet */
		/* Removed for mobile; is this useful? Whats it for?
	var f = wm.getParentForm(this);
	var s = this._getFormSource(f);
	if (s) {

            s.beginUpdate();
	    //console.log(s.getId(), this.dataValue);
	    var v = this.selectedItem.getData();
	    // update cursor
	    if (this.autoDataSet && this.dataSet) {
                // this is invalid; in some conditions, the objects in the datastore that populate _selectedData are no longer exact replicas of the objects in the datastore; for example, they have _selectMenuName property added to them
		//var i = this.dataSet.getItemIndex(v);


                   var i = this.getItemIndex(v);
		   if (i >=0)
		   this.dataSet.cursor = i;

	    }
	    s.setData(this.selectedItem);
	    s.endUpdate();
	    this.endEditUpdate();

	    //wm.fire(f, "populateEditors");
	}
	    */
    },

    setDataValue: function(inValue) {
	var value;
	if (inValue != null && dojo.isObject(inValue)) {
	    this.selectedItem.setData(inValue);
	    value = this.dataField ? this.selectedItem.getValue(this.dataField) : inValue;
	} else {
	    value = inValue;
	}
	this.setEditorValue(value);

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
	options: {ignore: 1}
});


wm.mobile.Lookup.extend({
	listProperties: function() {
		var props = this.inherited(arguments);
		props.dataSet.ignoretmp = this.autoDataSet;
		props.dataSet.bindTarget = !props.dataSet.ignoretmp;
		return props;
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "formField":
				return new wm.propEdit.FormFieldSelect({component: this, name: inName, value: inValue, relatedFields: true});
		}
		return this.inherited(arguments);
	}
});