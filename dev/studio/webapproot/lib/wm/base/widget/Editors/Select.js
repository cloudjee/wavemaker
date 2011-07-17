/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Editors.Select");
dojo.require("wm.base.widget.Editors.AbstractEditor");
//===========================================================================
// Select Editor
//===========================================================================
dojo.declare("wm.SelectMenu", wm.AbstractEditor, {
    _storeNameField: "_selectMenuName",
	options: "",
	displayField: "",
	dataField: "",
	displayExpression: "",
	displayType:"Text",
	pageSize: 20,
	allowNone: false,
	autoComplete: true,
	startUpdate: false,
	hasDownArrow: true,
	binding: '(data binding)',
    restrictValues: true,
	_allFields: "All Fields",
    selectedItem: null,
    _selectedData: null,
	init: function() {
	    this.inherited(arguments);
	    this.selectedItem = new wm.Variable({name: "selectedItem", owner: this});
            this._selectedData = {};
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
		    pageSize: this.pageSize ? this.pageSize : Infinity // dijit requires 1 higher or it will still print the "more" link
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
            
	    //this.editorNode.style.lineHeight = '';
            if (dojo.isIE && dojo.isIE < 8 && !this.readonly) { // tested for IE7
	        var n = dojo.query(".dijitArrowButtonInner", this.domNode)[0];
                var s = n.style;
                var c = dojo.coords(n);
                s.position = "relative";
                s.top = Math.floor((h-c.h)/2) + "px";
            }
/*
	    var arrowNode = dojo.query(".dijitArrowButtonInner", this.domNode)[0];
	    if (arrowNode) arrowNode.style.height = (h-2) + "px";
*/
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
		if (this.dataValue !== null && wm.propertyIsChanged(dataValue, "dataValue", wm._BaseEditor))
			this.setEditorValue(dataValue)
		else
			this.setDisplayValue(displayValue);
		this.endEditUpdate();


	    /* WM-2515; setInitialValue is also called each time the editor is recreated -- such as when it gets a new dataSet; 
	     *          fire an onChange if we have a displayValue after setting initialValue as this counts as a change in value
	     *          from before it was recreated.
	     */
	    if (!this._cupdating) {
	        var displayValue = this.getDisplayValue();
		if (displayValue != this.displayValue)
		    this.changed();
	    }
	},
	// our dijit doesn't have a displayValue v. editorvalue distinction
	// we're using displayValue for what the dijit calls its value.
        // STORE ACCESS (DONE)
	setDisplayValue: function(inValue) {
		var i = this.getStoreItem(inValue, this._storeNameField);
		if (i !== undefined) {
			this._setEditorValue(this.editor.store.getValue(i, this._storeNameField))
		} else if (!this.restrictValues) {
                        this.editor.set("value", inValue);
		        if (!inValue) 
			    this.editor._lastValueReported = "";
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
		    if (this.isAllDataFields()) {
			var v = this._getDisplayData(inValue);
			//i = this.getStoreItem(v, this._displayField);
			i = this.getStoreItem(v, this._storeNameField);
		    } else if (wm.isInstanceType(inValue, wm.Variable)) {
			var v = inValue;
			var lookupVal = v.getValue(lookupFieldName);
			i = this.getStoreItem(lookupVal, lookupFieldName);
			if (!i && !this.restrictValues) 
			    i = lookupVal || inValue;
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
			this._setEditorValue(i[this._storeNameField] || i[this.displayField || this._displayField]);
			// allow any value not in store is treated as a clear
		} else {
			if (this.restrictValues)
				this.clear();
		        else {
				this.editor.set("value",i);
		                if (!i) 
				    this.editor._lastValueReported = "";
			}
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
		    e.set('displayedValue', inDisplayValue, !this._updating);
		else
		    e.set('value', inDisplayValue, !this._updating);
	        if (!inDisplayValue)
		    this.editor._lastValueReported = "";
	},
	getDisplayValue: function() {
		if (this.hasValues())
			return this.inherited(arguments);
	},
        // STORE ACCESS (DONE?)
	getEditorValue: function(getFullDataObj) {
		var v;
		if (this.editor && this.hasValues()) {
		    var displayed = this.editor.get('displayedValue');
		    var v = displayed && this.getStoreItem(displayed, this._storeNameField);
		}

            if (v && !(getFullDataObj || this.isAllDataFields()))
		v = v[this.dataField];

/*
        if (!this.restrictValues && displayed && !v) 
		    return displayed;
		    */
		return (v || v === 0) ? v : this.makeEmptyValue();
	},
	setDataField: function(inDataField) {
		this.dataField = inDataField;
	},
	setDisplayField: function(inDisplayField) {
	    this.displayField = inDisplayField;
	    if (!this._cupdating)
		this.createEditor();
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
                inVariable = new wm.Variable({_temporaryComponent: true});
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
	formatData: function(inValue){
		try
		{
			if (this.formatter){
				return this.formatter.format(inValue);
			}
			else if (this.displayType){
				var ctor = wm.getFormatter(this.displayType);
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
                d[this._storeNameField]  = String(this._getDisplayData(v));
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
            if (inDataSet && inDataSet.type && inDataSet.type != "any" && inDataSet.type != this.selectedItem.type)
                this.selectedItem.setType(inDataSet.type);
	    try {
		/* If this is design time and we've cleared the dataSet, clear the fields as well */
		if (this._isDesignLoaded && !inDataSet) {
		    this.dataField = this.displayField = "";
		}
	    } catch(e) {}
	},
	setOptionsVariable: function() {
		var opts = this._getOptionsData();

		var ds = this.dataSet = new wm.Variable({name: "optionsVar",
							 owner: this,
							 type: "StringData"});
		ds.setData(opts);
		this.displayField = "dataValue";
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
		this.resetState(); 
		// note: hack to call internal dijit function to ensure we can
		// set a blank value even if this is not a valid value
		if (this.editor && this.hasValues()) {
                    var valueWas = this.editor.get("displayedValue");
			if (this.restrictValues) {
				this.editor.set('value', '', false);
			} else {
				this.editor.set("value", undefined, false);
			}
		    this.displayValue = "";
		    this.dataValue = null;

                        // because we passed in false above so as to fire out own SYNCRHONOUS onchange
                        // _lastValueReported is not cleared, which means that trying to changing the value
                        // back to _lastValueReported will fail to fire an onchange event
                        this.editor._lastValueReported = "";
			this.updateReadonlyValue();
                    if (valueWas)
                        this.changed();
		}
	},
	_getValidatorNode: function() {
	    var result = dojo.query(".dijitValidationContainer", this.editor.domNode)[0];
	    result.firstChild.value = "";
	    return result;
	},
	editorChanged: function() {
	    /* WM-2515; Don't bother firing an onchange event if there are no options to choose from; this situation
	     *          presumably means that we're still waiting for the dataSet to get options from the server;
	     *          all changed actions will fire AFTER we have a displayValue to go with whatever dataValue we have.
	     */
	    if (this.dataSet && this.dataSet.getCount()) {
		this.inherited(arguments);
		this.updateSelectedItem();
	    }
	},
        blurred: function() {
	    this.inherited(arguments);
	    var displayValue = this.displayValue;
	    console.log("D1: " + displayValue + "; D2: " + this.getDisplayValue());
	    if (this.getDisplayValue() != displayValue) {
		this.doOnchange();
	    }
	},
        getInvalid: function() {
	    var valid;
	    if (!this.editor || this.editor._focused) {
		valid = true;
	    } else {

		// always valid if !this.restrictValue
		// always valid if !this.displayValue, but if there is a displayValue there must be a dataValue /* May not be true in dojo 1.6 */
		var display = this.getDisplayValue();
		this._isValid = (!this.restrictValues || (display && this.dataValue || !display) );
		//console.log("_isValid:" + this._isValid + "; display="+display + "; data:"+this.dataValue);


		if (this.readonly) valid = true;
		else if (this.required && !this.dataValue) valid = false;
		else if (this.restrictValues && display && !this.dataValue) valid = false;
		else valid = true;
	    }
	    /* Clear invalid flag if its now valid; don't set invalid flag until dojo decides its time to set it */
	    if (valid)
		this.validatorNode.style.display = "none";
	    return !valid;
	},

	updateSelectedItem: function() {
		// FIXME: only if dataField is All Field should we update entire selectedItem.
		var v = this.getEditorValue(true);
		this.selectedItem.setData(v);
                this._selectedData = v;
	},
    getSelectedIndex: function() {
	return this.getItemIndex(this.selectedItem.getData());
    },
        getItemIndex: function(item) {
	    if (!item) return -1;
            var data = this.editor.store.data;
            for (var i = 0; i < data.length; i++)
                if (item == data[i] || item[this.dataField] == data[i][this.dataField]) return i;
            return -1;
        },
	isAllDataFields: function() {
		return (this.dataField == this._allFields || this.dataField == "");
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
	},

	setDefaultOnInsert:function(){
		if (this.editor && this.defaultInsert){
			this.setEditorValue(this.defaultInsert);
			this.changed();
		}
	}
});






//===========================================================================
// Lookup Editor
//===========================================================================
dojo.declare("wm.Lookup", wm.SelectMenu, {
	dataField: "All Fields",
	autoDataSet: true,
	startUpdate: true,
        maxResults: 500,
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
			        liveView: v,
			        maxResults: this.maxResults
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
	    if (this.isAncestorInstanceOf(wm.RelatedEditor)) {
		var w = wm.data.getPropWire(inForm, "dataSet");
		return w && w.source && this.getRoot().getValueById(w.source);
		/*var o = this.owner, w = wm.data.getPropWire(o, "dataValue");
		return w && w.source && this.getRoot().getValueById(w.source);*/
	    } else {
		var lf = this.isAncestorInstanceOf(wm.LiveForm);
		if (lf && this.formField) {
		    return lf.dataSet.getValue(this.formField);
		}
	    }
	},	
	// NOTE: lookups automatically push data back to their source
	changed: function() {
		// When loopup editor is changed by user only then we should change liveForms field values.
		// if value of loopupEditor is being initialized by the owner(not user) that means we should not change value of other fields in liveForm.
		if (this.isUpdating()) 
			return;

		this.inherited(arguments);
		var f = wm.getParentForm(this);
	    if (f instanceof wm.RelatedEditor) {
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
	    }
	}
});

