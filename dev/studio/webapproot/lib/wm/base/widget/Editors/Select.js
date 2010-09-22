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
dojo.provide("wm.base.widget.Editors.Select");
dojo.require("wm.base.widget.Editors.Base");
//===========================================================================
// Select Editor
//===========================================================================
dojo.declare("wm.SelectMenu", wm.AbstractEditor, {
    _storeNameField: "_selectMenuName",
	options: "",
	displayField: "",
	dataField: "",
	displayExpression: "",
	pageSize: 20,
	allowNone: false,
	autoComplete: true,
	startUpdate: false,
	hasDownArrow: true,
	binding: '(data binding)',
    restrictValues: true,
	_allFields: "All Fields",

	init: function() {
		this.inherited(arguments);
		this.selectedItem = new wm.Variable({name: "selectedItem", owner: this});
	},
        postInit: function() {
	    if (this.options) this.setOptionsVariable();
	    this.inherited(arguments);
	    if (this.startUpdate)
		this.update();
	},
	update: function() {
		if (this.dataSet instanceof wm.ServiceVariable) {
			var d = this.dataSet.update();
			return d;
		}
	},
        // STORE ACCESS
	generateStore: function() {
		this._initDataProps();
		var d = this._getData();
	        return new wm.base.data.SimpleStore(d, this._storeNameField, this);
	},
	getEditorProps: function(inNode, inProps) {
		var store = this.generateStore();
		return dojo.mixin(this.inherited(arguments), {
			required: this.required,
			store: store,
			autoComplete: this.autoComplete,
			hasDownArrow: this.hasDownArrow,
			searchAttr: this._storeNameField,
			pageSize: this.pageSize ? this.pageSize : Infinity
		}, inProps || {});
	},
	_createEditor: function(inNode, inProps) {
	    if (this.restrictValues) {
		return new dijit.form.FilteringSelect(this.getEditorProps(inNode, inProps));
	    } else {
		return new dijit.form.ComboBox(this.getEditorProps(inNode, inProps));
	    }
	},
        setRestrictValues: function(inValue) {
	    var dataval = this.getEditorValue();
	    var oldval = this.restrictValues;
	    this.restrictValues = inValue;
	    if (this.editor && oldval != inValue) {
		this.createEditor();
		this.setEditorValue(dataval);
	    }
	},
	sizeEditor: function() {
		if (this._cupdating)
			return;
		this.inherited(arguments);
            if (!this.editorNode.style.height) return;
	    var h = this.editorNode.style.height.match(/\d+/)[0];
            
		this.editorNode.style.lineHeight = '';
	    var arrowNode = dojo.query(".dijitArrowButtonInner", this.domNode)[0];
	        if (arrowNode) arrowNode.style.height = (h-2) + "px";
	},
	hasValues: function(){
		return (this.editor && this.editor.store.getCount());
	},
	// name, value (where value may be an object)
        // STORE ACCESS (DONE)
	getStoreItem: function(inValue, inStoreField) {
	    if (!this.hasValues())
		return;
	    var result;
	    var onItem = function(item) {
		result = item;
	    };
	    var query = {};
	    query[inStoreField] = inValue;
	    this.editor.store.fetch({query: query, queryOptions: {exactMatch: true}, count: 1, onItem: onItem});
	    // NOTE: callback will be called synchronously 
	    // because items are loaded so we can directly return result.
	    return result;
	},

	setInitialValue: function() {
		this.beginEditUpdate();
		this.selectedItem.setType(this.dataSet instanceof wm.Variable ? this.dataSet.type : "AnyData");
	        var dataValue = this.dataValue;
	        var displayValue = this.displayValue;
		if (wm.propertyIsChanged(dataValue, "dataValue", wm._BaseEditor))
			this.setEditorValue(dataValue)
		else
			this.setDisplayValue(displayValue);
		this.endEditUpdate();
	},
	// our dijit doesn't have a displayValue v. editorvalue distinction
	// we're using displayValue for what the dijit calls its value.
        // STORE ACCESS (DONE)
	setDisplayValue: function(inValue) {
		var i = this.getStoreItem(inValue, this._storeNameField);
		if (i !== undefined) {
			this._setEditorValue(this.editor.store.getValue(i, this._storeNameField))
		} else if (!this.restrictValues) {
                        this.editor.attr("value", inValue);
                } else {
			this.clear();
                }
	},
	// setting value based on dataField or dataObj; inValue can be either one.  If its a literal, we
    // find the data entry with that literal as its dataValue; if inValue is a wm.Variable, we compare the name fields. 
    // If inValue is a hash, we assume it is a data object recognizable to the store; turn it into a wm.Variable
    // and compare its name field to whats in the store. 
    // we'll do a lookup by
        // STORE ACCESS (DONE EXCEPT RESTRICT VALUES)
	setEditorValue: function(inValue) {
		// if the user has selected "all fields", then how and what do we compare inValue to?  
		// Answer: if we don't have a unique identifier from the user, then we compare on the displayname.
		var lookupFieldName = this._dataField;
		// STEP 1: Get the data out of the datastore based on inValue
		var i;
		// Optimization: if we're setting a wm.Variable or hash
		// get store item via name not value (should be faster searching data)
		if (inValue !== null && dojo.isObject(inValue)) {
			if (wm.isInstanceType(inValue, wm.Variable)) {
				if (this.isAllDataFields()) {
					var v = this._getDisplayData(inValue);
					i = this.getStoreItem(v, this._displayField);
				} else {
					var v = inValue;
					var lookupVal = v.getValue(lookupFieldName);
					i = this.getStoreItem(lookupVal, lookupFieldName);
					if (!i && !this.restrictValues) 
						i = lookupVal || inValue;
				}
			} else {
				i = inValue;
			}
		} else {
			i = this.getStoreItem(inValue,  lookupFieldName);
			if (!i && !this.restrictValues)
				i = inValue;
		}
		
		// STEP 2: Set the value to the datastore item; if no datastore item then either clear (restricted values) or set the inValue text as the value (TODO: what if inValue is a wm.Variable?)
		if (i !== undefined && i !== null && dojo.isObject(i)) {
			// why can't we just set the value to i??? Optimization??
			this._setEditorValue(i[this.displayField || this._displayField]);
			// allow any value not in store is treated as a clear
		} else {
			if (this.restrictValues)
				this.clear();
			else
				this.editor.attr("value",i);
		}
		this.updateReadonlyValue();
	},
	// Optimization: fast setting of select using internal dijit functionality
	// avoids re-getting items from store
	_setEditorValue: function(inDisplayValue) {
		inDisplayValue = String(inDisplayValue);
		var e = this.editor;
		delete this._isValid;
		e._isvalid=true;
		if (this.restrictValues)
			e.attr('displayedValue', inDisplayValue, !this._updating);
		else
			e.attr('value', inDisplayValue, !this._updating);
	},
	getDisplayValue: function() {
		if (this.hasValues())
			return this.inherited(arguments);
	},
        // STORE ACCESS (DONE?)
	getEditorValue: function(getFullDataObj) {
		var v;
		if (this.editor && this.hasValues()) {
		    var displayed = this.editor.attr('value');
		    var v = displayed && this.getStoreItem(displayed, this._storeNameField);
		}

        if (v && !(getFullDataObj || this.dataField == 'All Fields'))
            v = v[this.dataField];

        if (!this.restrictValues && displayed && !v) 
		    return displayed;
		return (v || v === 0) ? v : this.makeEmptyValue();
	},
	setDataField: function(inDataField) {
		this.dataField = inDataField;
	},
	setDisplayField: function(inDisplayField) {
		this.displayField = inDisplayField;
	},
	_getFirstDataField: function() {
		if (!this.dataSet)
			return;
		var schema = this.dataSet._dataSchema;
		for (var i in schema) {
			var ti = schema[i];
			if (!ti.isList && !wm.typeManager.isStructuredType(ti.type)) {
				return i;
			}
		}
	},
	_initDataProps: function() {
		if (this.dataSet) {
			var ff = this._getFirstDataField();
			this._displayField = this.displayField || ff || "name";
			this._dataField = this.dataField || ff || ("dataValue" in this.dataSet._dataSchema ? "dataValue" : "value");
		} else if (this.options) {
			this._displayField = this._dataField = "name";
		}
	},
	_getOptionsData: function() {
		var data = [];
		if (!this.options) return data;
		for (var i=0, opts = this.options.split(','), l=opts.length, d; i<l; i++) {
			d = dojo.string.trim(opts[i]);
			if (d != "")
				data[i] = {name: d, dataValue: d };
		}
		return data;
	},

	_getDisplayData: function(inObj) {
            var inVariable;
            if (wm.isInstanceType(inObj, wm.Variable))
                inVariable = inObj;
            else {
                inVariable = new wm.Variable();
                inVariable.setType(this.dataSet.type);
                inVariable.setData(inObj);
                inVariable.data[this._storeNameField]  = this._getDisplayData(inVariable);
            }
	    var de = this.displayExpression, v = inVariable;
	    return String(de ? wm.expression.getValue(de, v) : inVariable.getValue(this._displayField));
	},
/*
	_getDataByValue: function(inObj) {
            var inVariable;
            if (wm.isInstanceType(inObj, wm.Variable))
                inVariable = inObj;
            else {
                inVariable = new wm.Variable();
                inVariable.setType(this.dataSet.type);
                inVariable.setData(inObj);
            }
	    var de = this.displayExpression, v = inVariable;
	    return String(de ? wm.expression.getValue(de, v) : inVariable.getValue(this._dataField));
	},
        */

	_getDataSetData: function() {
		//var time = (new Date()).getTime();
	    var dataSet = this.dataSet;
	    var data = [];

		// argh, copy data from variable
	    for (var i=0, c=dataSet.getCount(), v; i < c && (v = dataSet.getItem(i)); i++) {
                var d = v.getData();
                d[this._storeNameField]  = this._getDisplayData(v);
		data.push(d);
            }
		//console.log("getDataSetData", (new Date()).getTime() - time);
		return data;
	},
	_getData: function() {
		var data = [];
		if (this.dataSet) {
			data = this._getDataSetData();
		} else if (this.options) {
			this.setOptionsVariable();
			data = this._getDataSetData();
			//data = this._getOptionsData();
		}
		if (this.allowNone) {
			//var o = {name: "", value: null};
                        var o = {};
                        o[this._storeNameField] = "";
			data.unshift(o);
		}
		
		return data;
	},
	setDataSet: function(inDataSet) {
		var ds = this.dataSet = inDataSet;
		// no data to render
		if (!ds || !ds.data || !ds.data.list)
			return;
		this.createEditor();
	},
	setOptionsVariable: function() {
		var opts = this._getOptionsData();

		var ds = this.dataSet = new wm.Variable({name: "optionsVar",
							 owner: this,
							 type: "EntryData"});
		ds.setData(opts);
		this.displayField = "name";
		this.dataField    = "dataValue";
	},
	setOptions: function(inOptions) {		
		this.options = inOptions;
		this.setOptionsVariable();
		var wasUpdating = this._cupdating;
		this._cupdating = true;
		this.createEditor();
		if (!wasUpdating) {
			this._cupdating = false;
			this.render();
		}
	},

	isReady: function() {
		return this.inherited(arguments) && this.hasValues();
	},
	clear: function() {
		this.reset();
		// note: hack to call internal dijit function to ensure we can
		// set a blank value even if this is not a valid value
		if (this.editor && this.hasValues()) {
			if (this.restrictValues) {
				this.editor.attr('value', '', false);
			} else {
				this.editor.attr("value", undefined, false);
			}
			this.updateReadonlyValue();
		}
	},
	editorChanged: function() {
	    this.inherited(arguments);
		this.updateSelectedItem();
	},
	updateSelectedItem: function() {
		// FIXME: only if dataField is All Field should we update entire selectedItem.
		var v = this.getEditorValue(true);
		this.selectedItem.setData(v);
	},
	isAllDataFields: function() {
		return (this.dataField == this._allFields);
	}
});



//===========================================================================
// Select Editor
//===========================================================================
wm.selectDisplayTypes = [
      "Text", "Date", "Time", "Number", "Currency"
];

dojo.declare("wm._SelectEditor", wm._BaseEditor, {
	options: "",
	displayField: "",
	dataField: "",
	displayExpression: "",
	lookupDisplay:"Text",
	pageSize: 20,
	allowNone: false,
	autoComplete: true,
	hasDownArrow: true,
	startUpdate: false,
	_allFields: "All Fields",
	binding: '(data binding)',
        restrictValues: true,
	init: function() {
		this.inherited(arguments);
		this.owner.selectedItem = new wm.Variable({name: "selectedItem", owner: this.owner});
	},
	ownerLoaded: function() {
		if (this.startUpdate)
			this.update();
	},
	update: function() {
		if (this.dataSet instanceof wm.ServiceVariable) {
			var d = this.dataSet.update();
			return d;
		}
	},
	generateStore: function() {
		this._initDataProps();
		var d = this._getData();
		return new wm.base.data.SimpleStore(d, "name", this);
	},
	getEditorProps: function(inNode, inProps) {
		var store = this.generateStore();
		return dojo.mixin(this.inherited(arguments), {
			required: this.required,
			store: store,
			autoComplete: this.autoComplete,
			hasDownArrow: this.hasDownArrow,
			searchAttr: "name",
			pageSize: this.pageSize ? this.pageSize : Infinity
		}, inProps || {});
	},
	_createEditor: function(inNode, inProps) {
	    if (this.restrictValues) {
		return new dijit.form.FilteringSelect(this.getEditorProps(inNode, inProps));
	    } else {
		return new dijit.form.ComboBox(this.getEditorProps(inNode, inProps));
	    }
	},
        setRestrictValues: function(inValue) {
	    var dataval = this.getEditorValue();
	    var oldval = this.restrictValues;
	    this.restrictValues = inValue;
	    if (this.editor && oldval != inValue) {
		this.createEditor();
		this.setEditorValue(dataval);		
	    }
	    if (!inValue && this.dataField == this._allFields) 
		this.dataField = "";
	},
	sizeEditor: function() {
		this.inherited(arguments);
		this.domNode.style.height = '';		
		this.domNode.style.lineHeight = '';		
	},
	hasValues: function() {
		return (this.editor && this.editor.store.getCount());
	},
	// name, value (where value may be an object)
	getStoreItem: function(inValue, inStoreField) {
		if (!this.hasValues())
			return;
		var
			result,
			onItem = function(item) {
				result = item;
			},
			query = {};
		query[inStoreField] = inValue;
		this.editor.store.fetch({query: query, queryOptions: {exactMatch: true}, count: 1, onItem: onItem});
		// NOTE: callback will be called synchronously 
		// because items are loaded so we can directly return result.
		return result;
	},
	isAllDataFields: function() {
		return (this.dataField == this._allFields);
	},
	setInitialValue: function() {
		this.owner.beginEditUpdate();
		this.owner.selectedItem.setType(this.dataSet instanceof wm.Variable ? this.dataSet.type : "AnyData");
		var dataValue = this.owner.dataValue, displayValue = this.owner.displayValue;
		if (wm.propertyIsChanged(dataValue, "dataValue", wm.Editor))
			this.setEditorValue(dataValue)
		else
			this.setDisplayValue(displayValue);
		this.owner.endEditUpdate();
	},
	// our dijit doesn't have a displayValue v. editorvalue distinction
	// we're using displayValue for what the dijit calls its value.
	setDisplayValue: function(inValue) {
		var i = this.getStoreItem(inValue, "name");
		if (i !== undefined) {
			this._setEditorValue(this.editor.store.getValue(i, "name"))
		} else
			this.clear();
	},
	// setting value based on dataField
	setEditorValue: function(inValue) {
		var i;
		// Optimization: if we're setting a variable, and dataValue is using all fields
		// get store item via name not value (should be faster searching data)
		if (this.isAllDataFields() && inValue instanceof wm.Variable) {
			var v = this._getDisplayData(inValue);
			i = this.getStoreItem(v, "name");
		// support setting object dataValues in editor
		} else {
			i = this.getStoreItem(inValue, "value");
		}
		if (i !== undefined) {
			this._setEditorValue(this.editor.store.getValue(i, "name"))
		// allow any value not in store is treated as a clear
		}  else {
		    if (this.restrictValues)
			this.clear();
		    else
			this.editor.attr("value",inValue);
		}
		this.updateReadonlyValue();
	},
	// Optimization: fast setting of select using internal dijit functionality
	// avoids re-getting items from store
	_setEditorValue: function(inDisplayValue) {
		inDisplayValue = String(inDisplayValue);
		delete this._isValid;
		var e = this.editor;
		e._isvalid=true;
        if (this.restrictValues)
			e.attr('displayedValue', inDisplayValue);
        else
		    e.attr("value", inDisplayValue);
	},
	getDisplayValue: function() {
		if (this.hasValues())
			return this.inherited(arguments);
	},
	getEditorValue: function() {
		var v;
		if (this.editor && this.hasValues()) {
			var
				displayed = this.editor.attr('value'),
				i = displayed && this.getStoreItem(displayed, "name");
			if (i) {
				v = this.editor.store.getValue(i, "value");
				v = v instanceof wm.Variable ? v.getData() : v;
			}
		}
	    if (!this.restrictValues && displayed && !v) 
		return displayed;
	    return (v || v === 0) ? v : this.makeEmptyValue();
	},
	setDataField: function(inDataField) {
		this.dataField = inDataField;
	},
	setDisplayField: function(inDisplayField) {
		this.displayField = inDisplayField;
	},
	_getFirstDataField: function() {
		if (!this.dataSet)
			return;
		var schema = this.dataSet._dataSchema;
		for (var i in schema) {
			var ti = schema[i];
			if (!ti.isList && !ti.isObject) {
				return i;
			}
		}
	},
	_initDataProps: function() {
		if (this.dataSet) {
			var ff = this._getFirstDataField();
			this._displayField = this.displayField || ff || "name";
			this._dataField = this.dataField || ff || ("dataValue" in this.dataSet._dataSchema ? "dataValue" : "value");
		} else if (this.options) {
			this._displayField = this._dataField = "name";
		}
	},
	_getOptionsData: function() {
		var data = [];
		if (!this.options) return data;
		for (var i=0, opts = this.options.split(','), l=opts.length, d; i<l; i++) {
			d = dojo.string.trim(opts[i]);
			if (d != "")
				data[i] = {name: d, dataValue: d };
		}
		return data;
	},
	_getDisplayData: function(inVariable) {
		var de = this.displayExpression, v = inVariable;
		var value = '';
		if (de)
			return wm.expression.getValue(de, v);
		else if (this.lookupDisplay && this.lookupDisplay != 'Text')
			return this.formatData(v.getValue(this._displayField))
		else 
			return v.getValue(this._displayField);
	},
	formatData: function(inValue){
		try
		{
			if (this.formatter){
				return this.formatter.format(inValue);
			}
			else if (this.lookupDisplay){
				var ctor = wm.getFormatter(this.lookupDisplay);
				this.formatter = new ctor({name: "format", owner: this});
				return this.formatter.format(inValue);
			}
			else
				return inValue;
		}
		catch(e)
		{
			console.info('error while getting data from formatData----- ', e);
		}
			
	},
	_getDataSetData: function() {
		//var time = (new Date()).getTime();
		var
			dataSet = this.dataSet,
			data = [],
			dataField = this._dataField,
			af = this.isAllDataFields();
		// argh, copy data from variable
		for (var i=0, c=dataSet.getCount(), v; i < c && (v = dataSet.getItem(i)); i++)
			data.push({name: this._getDisplayData(v), value: af ? v.getData() : v.getValue(dataField)});
		//console.log("getDataSetData", (new Date()).getTime() - time);
		return data;
	},
	_getData: function() {
		var data = [];
		if (this.dataSet) {
			data = this._getDataSetData();
		} else if (this.options) {
			this.setOptionsVariable();
			data = this._getDataSetData();
			//data = this._getOptionsData();
		}
		if (this.allowNone) {
			var o = {name: "", value: null};
			data.unshift(o);
		}
		return data;
	},
	setDataSet: function(inDataSet) {
		var ds = this.dataSet = inDataSet;
		// no data to render
		if (!ds || !ds.data || !ds.data.list)
			return;
		this.createEditor();
	},
	setOptionsVariable: function() {
		var opts = this._getOptionsData();

		var ds = this.dataSet = new wm.Variable({name: "optionsVar",
							 owner: this,
							 type: "EntryData"});
		ds.setData(opts);
		this.displayField = "name";
		this.dataField    = "dataValue";
	},
	setOptions: function(inOptions) {		
		this.options = inOptions;
		this.setOptionsVariable();
		this.createEditor();
	},

	setOptionSet: function(inOptions) {
		if (inOptions == null || inOptions == undefined || inOptions.length == 0) return;

		var obj = inOptions[0];
		var keys = []; 
		for(var key in obj){ 
			keys.push(key); 
		}
		
		var varParms = {};
		varParms.name = this.owner.name + "Var";
		varParms.owner = this;
		varParms.type = "EntryData";
		var ds = this.dataSet = new wm.Variable(varParms);
		var ds = this.dataSet = new wm.Variable(varParms);

		ds.setData(inOptions);
		this.displayField = keys[0];
		this.dataField    = keys[1];
		this.createEditor();
	},

	isReady: function() {
		return this.inherited(arguments) && this.hasValues();
	},
	clear: function() {
		this.reset();
		// note: hack to call internal dijit function to ensure we can
		// set a blank value even if this is not a valid value
		if (this.editor && this.hasValues())
	    	if (this.restrictValues) {
				//this.editor._setValue(undefined, "");
				try{
					//this.editor._setValue(undefined, "");
					this.editor.attr('value','');
				}
				catch(e){
					console.info('error while clearing editor value............', e);
				}
		    } else {
				this.editor.attr("value", undefined);
		    }
	},
	// fired when owning editor widget processs change
	ownerEditorChanged: function() {
		this.updateSelectedItem();
	},
	updateSelectedItem: function() {
		// FIXME: only if dataField is All Field should we update entire selectedItem.
		var v = this.getEditorValue();
		this.owner.selectedItem.setData(v);
	}
});

//===========================================================================
// Lookup Editor
//===========================================================================
dojo.declare("wm._LookupEditor", wm._SelectEditor, {
	dataField: "All Fields",
	autoDataSet: true,
	startUpdate: true,
	init: function() {
		this.inherited(arguments);
		if (this.autoDataSet)
			this.createDataSet();
	},
	createDataSet: function() {
		wm.fire(this.$.liveVariable, "destroy");
		var pf = wm.getParentForm(this.owner);
		var v = wm.getFormLiveView(pf);
		if (v) {
			var ff = wm.getFormField(this.owner);
			v.addRelated(ff);
			var lv = this.dataSet = new wm.LiveVariable({
				name: "liveVariable",
				owner: this,
				autoUpdate: false,
				startUpdate: false,
				_rootField: ff,
				liveView: v
			});
			this.owner.selectedItem.setType(this.dataSet.type);
			this.createDataSetWire(lv);
		}
		else if (pf){
			// This means that source of this editor is not created yet. 
			// Therefore we will create dataSet after source is created.
			var evt2 = pf._getEditorBindSourceId(pf.getSourceId()) + '-created';
			this._subscriptions.push(dojo.subscribe(evt2, this, '_onSourceCreated'));
		}
	},
	_onSourceCreated: function(){
		try{
			this.createDataSet();
			this.update();
		}
		catch(e){
			console.info('error while updating source in select.js', e);
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
		if (this.owner.isUpdating()) 
			return;
		this.inherited(arguments);
		var f = wm.getParentForm(this.owner);
		var s = this._getFormSource(f);
		if (s) {
			this.owner.beginEditUpdate();
			//console.log(s.getId(), this.owner.dataValue);
			var v = this.owner.dataValue;
			// update cursor
			if (this.autoDataSet) {
				var i = this.dataSet.getItemIndex(v);
				if (i >=0)
					this.dataSet.cursor = i;
			}
			s.setData(v);
			this.owner.endEditUpdate();
			wm.fire(f, "populateEditors");
		}
	}
});

// design only
wm._SelectEditor.extend({
	updateNow: "(updateNow)",
	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
			var ds = this.getValueById(inDataSet);
			if (ds)
				this.components.binding.addWire("", "dataSet", ds.getId());
		} else
			this.setDataSet(inDataSet);
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
				var l = this._listFields();
	  	  	        l.splice(1, 0, this._allFields);
				return makeSelectPropEdit(inName, inValue, l, inDefault);
			case "lookupDisplay":
				return makeSelectPropEdit(inName, inValue, wm.selectDisplayTypes, inDefault);
			case "dataSet":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.dataSet ? this.dataSet.getId() : "", allowAllTypes: true, listMatch: true});
			case "updateNow":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
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

wm._LookupEditor.extend({
	listProperties: function() {
		var props = this.inherited(arguments);
		props.dataSet.ignore = this.autoDataSet;
		props.dataSet.bindTarget = !props.dataSet.ignore;
		return props;
	}
});



//===========================================================================
// Lookup Editor
//===========================================================================
dojo.declare("wm.Lookup", wm.SelectMenu, {
	dataField: "All Fields",
	autoDataSet: true,
	startUpdate: true,
	init: function() {
		this.inherited(arguments);
		if (this.autoDataSet)
			this.createDataSet();
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
			this.beginEditUpdate();
			//console.log(s.getId(), this.dataValue);
			var v = this.selectedItem;
			// update cursor
			if (this.autoDataSet && this.dataSet) {
				var i = this.dataSet.getItemIndex(v);
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
wm.SelectMenu.extend({
    themeableStyles: ["wm.SelectMenu-Down-Arrow_Image", "wm.SelectMenu-Inner_Radius"],
	updateNow: "(updateNow)",
	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
			var ds = this.getValueById(inDataSet);
			if (ds)
				this.components.binding.addWire("", "dataSet", ds.getId());
		} else
			this.setDataSet(inDataSet);
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
				var l = this._listFields();
				return makeSelectPropEdit(inName, inValue, l, inDefault);
			case "dataSet":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.dataSet ? this.dataSet.getId() : "", allowAllTypes: true, listMatch: true});
			case "updateNow":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
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
		//this.editor.attr('hasDownArrow', this.hasDownArrow);
		if (this.editor.downArrowNode){
			this.editor.downArrowNode.style.display = this.hasDownArrow ? "" : "none";
		}
	}
});


wm.Object.extendSchema(wm._SelectEditor, {
	changeOnKey: { ignore: 1 },
	changeOnEnter: { ignore: 1 },
	selectedItem: { ignore: true, isObject: true, bindSource: true, isOwnerProperty: 1 },
	dataSet: { readonly: true, group: "data", order: 5, type: "wm.Variable", isList: true, bindTarget: true},
	startUpdate: { group: "data", order: 6},
	liveVariable: {ignore: 1 },
	formatter: {ignore:1},
	options: {group: "data", order: 7},
	dataField: {group: "data", order: 10},
	displayField: {group: "data", order: 15},
	lookupDisplay:{group: "data", order: 16},
	displayExpression: {group: "data", order: 20},
	hasDownArrow: {group: "editor", order: 26},
        restrictValues: {type: "wm.Boolean", group: "data", order: 40},
	pageSize: { order: 0},
	updateNow: {group: "operation"},
	dataFieldWire: { ignore: 1}
});

wm.Object.extendSchema(wm.SelectMenu, {
  restrictValues: {type: "wm.Boolean", group: "editor", order: 40},
	changeOnKey: { ignore: 1 },
	changeOnEnter: { ignore: 1 },
	selectedItem: { ignore: true, isObject: true, bindSource: true},
	dataSet: { readonly: true, group: "editor", order: 4, type: "wm.Variable", isList: true, bindTarget: true},
	startUpdate: { group: "editor", order: 5},
  pageSize: { order: 6, group: "editor"},
	liveVariable: {ignore: 1 },
	options: {group: "editor", order: 7},
	dataField: {group: "editor", order: 10},
	displayField: {group: "editor", order: 15},
	displayExpression: {group: "editor", order: 20},
  autoComplete: {group: "editor", order: 25},
	hasDownArrow: {group: "editor", order: 26},
  allowNone: {group: "editor", order: 30},
	updateNow: {group: "operation"},
  dataFieldWire: { ignore: 1},
  optionsVar: {ignore:1},
	_allFields: {ignore:1},
	defaultInsert:{ignore:1, bindTarget: 1, type:'wm.Variable', group: "editData", order: 10, dependency: '${parent.declaredClass} == "wm.LiveForm" || ${parent.declaredClass} == "wm.RelatedEditor"'}
});

wm.Object.extendSchema(wm._LookupEditor, {
	autoDataSet: {group: "data", order: 3},
	options: {ignore: 1},
	dataField: {ignore: 1}
});
