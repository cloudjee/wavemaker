/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.ComboBox");
//===========================================================================
// Select Editor
//===========================================================================
dojo.declare("wm.SelectMenu", wm.DataSetEditor, {
    indentField: "",
    comboBox: true,
        placeHolder: "",
        _storeNameField: "_selectMenuName",
	displayType:"Text",
	pageSize: 20,
	allowNone: false,
	autoComplete: true,
	hasDownArrow: true,
    restrictValues: true,
    _selectedData: null,
	init: function() {
	    if (wm.isMobile) this.comboBox = false;
	    this.inherited(arguments);
	},
        // STORE ACCESS
	generateStore: function() {
	    var data = [];
	    if (this.dataSet) {
		var count = this.dataSet.getCount();
		for (var i = 0; i < count; i++) {
		    var item = {id: i,
				name: this._getDisplayData(this.dataSet.getItem(i))};
		    if (this.indentField) {
			item.indent = Boolean(this.dataSet.getItem(i).getValue(this.indentField));
		    }
		    data.push(item);
		}
	    }
	    if (this.allowNone) {
		data.unshift({id: -1, name: ""});
	    }
	    
	    return new wm.base.data.SimpleStore(data, "name", this);
	},
	getEditorProps: function(inNode, inProps) {
		var store = this.generateStore();
		return dojo.mixin(this.inherited(arguments), {
		        placeHolder: this.placeHolder,
			required: this.required,
			store: store,
			autoComplete: this.autoComplete,
			hasDownArrow: this.hasDownArrow,
		    searchAttr: "name",
		    pageSize: this.pageSize ? this.pageSize : Infinity // dijit requires 1 higher or it will still print the "more" link
		}, inProps || {});
	},
    doOnfocus: function() {
	if (!this.comboBox && this.editor) {
	    this.editor.loadDropDown(function() {});
	}
	this.inherited(arguments);
    },
	
	_createEditor: function(inNode, inProps) {
	    var e;
	    if (this.restrictValues) {
		e =  new dijit.form.FilteringSelect(this.getEditorProps(inNode, inProps));
	    } else {
		e = new dijit.form.ComboBox(this.getEditorProps(inNode, inProps));
	    }
	    if (!this.comboBox) { 
		dojo.attr(e.focusNode, "readonly", true);
	    }
	    return e;
	},
        setPlaceHolder: function(inPlaceHolder) {
	    this.placeHolder = inPlaceHolder;
	    if (this.editor)
		this.editor.attr("placeHolder", inPlaceHolder);
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
		var h = this._editorHeight;
	    if (this.editor.containerNode) {
	    var s = this.editor.containerNode ? this.editor.containerNode.parentNode.style : this.editor.domNode.style;
		s.display = "block";
		s.lineHeight = s.height = h + "px";
		s.width = (this._editorWidth-24) + "px";
		var arrow = dojo.query(".dijitArrowButtonInner", this.domNode)[0];
		arrow.parentNode.style.position = "relative";
		arrow.parentNode.style.width = "24px";
		arrow.style.position = "absolute";
		arrow.style.top = "0px";
		arrow.parentNode.style.border = "0";
		arrow.style.height = (dojo.isIE ? h : (h+1)) + "px";
		arrow.style.width = "22px";
		arrow.style.margin = "0";
		arrow.style.border = "solid 1px " + this.borderColor;
		arrow.style.borderLeft = "solid 1px #999";
	    }


/*
	    var arrowNode = dojo.query(".dijitArrowButtonInner", this.domNode)[0];
	    if (arrowNode) arrowNode.style.height = (h-2) + "px";
*/
	},

	// name, value (where value may be an object)
        // STORE ACCESS (DONE)
/*
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
	*/
/*
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


	    / * WM-2515; setInitialValue is also called each time the editor is recreated -- such as when it gets a new dataSet; 
	     *          fire an onChange if we have a displayValue after setting initialValue as this counts as a change in value
	     *          from before it was recreated.
	     * /
	    if (!this._cupdating) {
	        var displayValue = this.getDisplayValue();
		if (displayValue != this.displayValue)
		    this.changed();
	    }
	},
	     */
	// our dijit doesn't have a displayValue v. editorvalue distinction
	// we're using displayValue for what the dijit calls its value.
        // STORE ACCESS (DONE)
/*
	setDisplayValue: function(inValue) {
		var i = this.getStoreItem(inValue, this._storeNameField);
		if (i !== undefined) {
			this._setEditorValue(this.editor.store.getValue(i, this._storeNameField))
		} else if (!this.restrictValues) {
                    this.editor.set("value", inValue);		    
		    this.editor._lastValueReported = inValue;
                } else {
			this.clear();
                }
	},
	*/
	// setting value based on dataField or dataObj; inValue can be either one.  If its a literal, we
    // find the data entry with that literal as its dataValue; if inValue is a wm.Variable, we compare the name fields. 
    // If inValue is a hash, we assume it is a data object recognizable to the store; turn it into a wm.Variable
    // and compare its name field to whats in the store. 
    // we'll do a lookup by
        // STORE ACCESS (DONE EXCEPT RESTRICT VALUES)
/*
	setEditorValue: function(inValue) {
	    if (!this.dataSet || this.dataSet.getCount() == 0) {
		if (typeof inValue == "object" && this.dataField == this._allFields) {
		    this.displayValue = this._getDisplayData(inValue);
		    this.dataValue = inValue;
		    this._setEditorValue(this.displayValue, inValue);
		} else if (this.displayField == this.dataField && !this.displayExpression) {
		    this.dataValue = this.displayValue = inValue;
		    this._setEditorValue(inValue);
		} else {
		    this.dataValue = inValue;
		}
		this.updateReadonlyValue();
		return;
	    }

	    this._inSetEditor = true;
	    try {
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
		    else if (this.editor) {
			this.editor.set("value",i);
			this.editor._lastValueReported = i;
		    }
		}
		this.updateReadonlyValue();
	    } catch(e){
	    } finally {
		delete this._inSetEditor;
		this.changed();
	    }
	},
	*/
	// Optimization: fast setting of select using internal dijit functionality
	// avoids re-getting items from store
/*
       _setEditorValue: function(inDisplayValue, optionalDataObjValue) {
	    if (!this.editor) return;
		inDisplayValue = String(inDisplayValue);
		var e = this.editor;
		delete this._isValid;
	   if (!e) {
	       this.displayValue = inDisplayValue;
	       return;
	   }
		e._isvalid=true;

	        if (!this.dataSet || this.dataSet.getCount() == 0) {
		    var item = optionalDataObjValue || {}
		    item[this._storeNameField] = inDisplayValue;
		    
		    this.editor.store.data.push(item);
		    var addedItem = true;
		}

		if (this.restrictValues)
		    e.set('displayedValue', inDisplayValue, this._inSetEditor ? false : !this._updating);
		else
		    e.set('value', inDisplayValue, this._inSetEditor ? false : !this._updating);
	        this.editor._lastValueReported = inDisplayValue;
	   if (addedItem)
	       this.editor.store.data.pop();
	},
	*/

/*
        // STORE ACCESS (DONE?)
	getEditorValue: function(getFullDataObj) {
		var v;
		if (this.editor && this.hasValues()) {
		    var displayed = this.editor.get('displayedValue');
		    var v = displayed && this.getStoreItem(displayed, this._storeNameField);
		}

            if (v && !(getFullDataObj || this.isAllDataFields()))
		v = v[this.dataField];

/ *
        if (!this.restrictValues && displayed && !v) 
		    return displayed;
		    * /
		return (v || v === 0) ? v : this.makeEmptyValue();
	},
	*/
/*
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
		if (this.dataSet)
                    inVariable.setType(this.dataSet.type);
                inVariable.setData(inObj);
                inVariable.data[this._storeNameField]  = String(this._getDisplayData(inVariable));
            }
	    var de = this.displayExpression, v = inVariable;
	    var result = de ? wm.expression.getValue(de, v) : inVariable.getValue(this._displayField);
            if (this.displayType && this.displayType != 'Text')
                result = this.formatData(result);
            return result === undefined || result === null ? "" : String(result);
	},
	*/
    _onSetEditorValueFailed: function(inValue) {
	if (!this.restrictValues)
	    this.editor.set("displayedValue", inValue);
    },
	formatData: function(inValue){
		try
		{
			if (this._formatter){
				return this._formatter.format(inValue);
			}
			else if (this.displayType){
				var ctor = wm.getFormatter(this.displayType);
				this._formatter = new ctor({name: "format", owner: this});
				return this._formatter.format(inValue);
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
/*
	_getDataSetData: function() {
		//var time = (new Date()).getTime();
	    var dataSet = this.dataSet;
	    var data = [];

		// argh, copy data from variable
	    for (var i=0, c=dataSet.getCount(), v; i < c && (v = dataSet.getItem(i)); i++) {
                var d = v.getData();
		if (d) {
                    d[this._storeNameField]  = String(this._getDisplayData(v));
		    data.push(d);
		}
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
	    var oldValue = this.dataValue;

		var ds = this.dataSet = inDataSet;
		// no data to render
		if (!ds || !ds.data || !ds.data.list)
			return;
	    if (!this.editor) {
		this.createEditor();
	    } else {
		this.editor.store = this.generateStore();		
	    }
            if (inDataSet && inDataSet.type && inDataSet.type != "any" && inDataSet.type != this.selectedItem.type)
                this.selectedItem.setType(inDataSet.type);
	    try {
	    / * If this is design time and we've cleared the dataSet, clear the fields as well * /
		if (this._isDesignLoaded && !inDataSet && !this._cupdating) {
		    this.dataField = this.displayField = "";
		}
	    } catch(e) {}
	    if (oldValue)
		this.setEditorValue(oldValue);
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
	*/
    setDataSet: function(inDataSet) {
	this._inSetDataSet = true;
	this.inherited(arguments);
	if (this.editor) {
	    this.editor.set("store", this.generateStore());
	    this.setEditorValue(this.dataValue);
	}
	delete 	this._inSetDataSet;
    },
	clear: function() {
		// note: hack to call internal dijit function to ensure we can
		// set a blank value even if this is not a valid value
	    if (this.editor) {
                 var valueWas = this.editor.get("displayedValue");
			if (this.restrictValues) {
			    this.editor.set('value', '', false);
			} else {
			    this.editor.set("value", undefined, false);
			}
		    this._lastValue = this.makeEmptyValue();

		// need to preserve the values if we're in the middle of a dataSet change or we'll be firing onchange events even though the value remains unchanged
		if (!this._inSetDataSet) {
		    this.displayValue = "";
		    this.dataValue = null;

                        // because we passed in false above so as to fire out own SYNCRHONOUS onchange
                        // _lastValueReported is not cleared, which means that trying to changing the value
                        // back to _lastValueReported will fail to fire an onchange event
                        this.editor._lastValueReported = "";
			this.updateReadonlyValue();
		    this.resetState(); 
		}
                    if (!this._cupdating && valueWas  && this.hasValues()) 
                        this.changed();
		} else {
		    this.resetState(); 
		}
	},
    validationEnabled: function() {return this.comboBox && !this.restrictValues;},
	_getValidatorNode: function() {
	    var result = dojo.query(".dijitValidationContainer", this.editor.domNode)[0];
	    result.firstChild.value = "";
	    return result;
	},
/*
	editorChanged: function() {
	    / * WM-2515; Don't bother firing an onchange event if there are no options to choose from; this situation
	     *          presumably means that we're still waiting for the dataSet to get options from the server;
	     *          all changed actions will fire AFTER we have a displayValue to go with whatever dataValue we have.
	     * /
	    if (this.dataSet && this.dataSet.getCount()) {
		var result = this.inherited(arguments);
		this.updateSelectedItem();
		return result;
	    }
	},
	*/
        blurred: function() {
	    this.inherited(arguments);
	    var displayValue = this.displayValue;
	    if (this.getDisplayValue() != displayValue) {
		this.doOnchange();
	    }
	},
        getInvalid: function() {
	    if (!this.validationEnabled()) {
		if (this.required && !this.getDataValue())
		    return true;
		return false;
	    }
	    var valid;
	    if (!this.editor || this.editor._focused) {
		valid = true;
	    } else {
		var dataValue = this.getDataValue();
		var hasValue = Boolean(dataValue);
		// always valid if !this.restrictValue
		// always valid if !this.displayValue, but if there is a displayValue there must be a dataValue /* May not be true in dojo 1.6 */
		var display = this.getDisplayValue();

		this._isValid = (!this.restrictValues || (display && hasValue || !display) );
		//console.log("_isValid:" + this._isValid + "; display="+display + "; data:"+this.dataValue);


		if (this.readonly) valid = true;
		else if (this.required) {
		    if (!this.restrictValues && !display) {
			valid = false;
		    } else if (this.restrictValues && !hasValue) {
			valid = false;
		    } else {
			valid = true;
		    }
		} else if (this.restrictValues && display && !hasValue){
		    valid = false;
		} else {
		    valid = true;
		}
/*
		else if (this.required && !this.dataValue) valid = false;
		else if (this.restrictValues && display && !this.dataValue) valid = false;
		else valid = true;
		*/
	    }
	    /* Clear invalid flag if its now valid; don't set invalid flag until dojo decides its time to set it */
	    if (valid )
		this.validatorNode.style.display = "none";
	    return !valid;
	},
/*
	updateSelectedItem: function() {
		// FIXME: only if dataField is All Field should we update entire selectedItem.
		var v = this.getEditorValue(true);
		this.selectedItem.setData(v);

	},
    */
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

    getEditorValue: function() {
	var result = this.inherited(arguments);

	if (!result && !this.restrictValues)
	    result = this.editor.get("displayedValue");
	return (result || result === 0) ? result : this.makeEmptyValue();
    },
	getDisplayValue: function() {
	    if (this.editor)
		return this.editor.get('displayedValue');	    
	    return null;
	},
    blurred: function() {
	this.changed();
	this.doOnblur();
    },
    changed: function() {
	if (!this.comboBox && this.editor && this.editor.focusNode == document.activeElement) {
	    this.editor.focusNode.blur();
	    return; // blur will trigger changed call
	}
	var item;
	var index;
	if (this.editor)
	    item = this.editor.get('item');
	    var result = null;
	if (this.editor)
	    var displayedValue = this.editor.get("displayedValue");

	    /* item may still be set in the dijit even though the displayed value no longer matches it */
	    if (item && displayedValue == item.name) {
		index =  item.id;
		var result = this.dataSet.getItem(index);
		this.selectedItem.setData(result);
	    } else {
		this.selectedItem.setData(null);
	    }
	    if (this.editor && this.editor._lastValueReported === "" && displayedValue !== "") {
		this.editor._lastValueReported = displayedValue;
	    }

	    return this.inherited(arguments);

    },
    selectItem: function(rowIndex) {
	if (!this.editor) return;
	var item = this.dataSet.getItem(rowIndex);
	this.selectedItem.setData(item);
	//this.editor.set("value", String(item.getIndexInOwner()), false);
	this.editor.set("value", item.getValue(this.displayField), false);
    }

/*
	setDefaultOnInsert:function(){
		if (this.editor && this.defaultInsert){
		    if (this.$.binding && this.$.binding.wires.defaultInsert)
			this.$.binding.wires.defaultInsert.refreshValue();
		    this.setEditorValue(this.defaultInsert);
		    this.changed();
		}
	},

    calcIsDirty: function(val1, val2) {
	if (val1 !== null && val2 !== null && typeof val1 == "object" && typeof val2 == "object") {
	    return val1[this._storeNameField] != val2[this._storeNameField];
	} else {
	    return val1 != val2;
	}
    }
	*/

});






//===========================================================================
// Lookup Editor
//===========================================================================
dojo.declare("wm.Lookup", wm.SelectMenu, {
    datatype: "",
	dataField: "",
	autoDataSet: true,
	startUpdate: true,
        maxResults: 500,
        ignoreCase: true,
	init: function() {
		this.inherited(arguments);
		if (this.autoDataSet && this.formField)
		    this.createDataSet();
	},
	createDataSet: function() {
	    wm.fire(this.$.liveVariable, "destroy");
	    var parentForm = this.getParentForm();
	    if (parentForm) {
		
		if (wm.isInstanceType(parentForm, wm.LiveForm) && !parentForm.dataSet)
		    return;
		if (wm.isInstanceType(parentForm, wm.DataForm) && !parentForm.dataSet && !parentForm.type)
		    return;
		if (!wm.getFormLiveView || !wm.getFormField) return;

		var view = wm.getFormLiveView(parentForm);
		var parentType = wm.isInstanceType(parentForm, wm.DataForm) ? parentForm.type : parentForm.dataSet && parentForm.dataSet.type;

		var ff = wm.getFormField(this);
		
		try {
		    var currentType;
		    if (this.dataType) {
			currentType = this.dataType;
		    } else if (parentType && parentType != "any") {
			currentType = wm.typeManager.getType(parentType).fields[ff].type ;
		    } else {
			currentType = "string";
		    }
		} catch(e) {}
		
		if (view && !this._isDesignLoaded) {
		    view.addRelated(ff);
		}
		var lv = this.dataSet = new wm.LiveVariable({
		    name: "liveVariable",
		    owner: this,
		    autoUpdate: false,
		    startUpdate: false,
		    _rootField: view ? ff : null,
		    liveView: view,
		    liveSource: view ? undefined : currentType,
		    maxResults: this.maxResults,
		    ignoreCase: this.ignoreCase,
		    refireOnDbChange: true,
		    orderBy: this.orderBy // right now, only FilteringSelect provides the orderBy property
		});
		this.selectedItem.setType(this.dataSet.type);
		this.createDataSetWire(lv);
	    }
	},
	

	createDataSetWire: function(inDataSet) {
	    if (!this.$.binding) {
		new wm.Binding({name: "binding", owner: this});
	    }
		var w = this._dataSetWire = new wm.Wire({
			name: "dataFieldWire",
			target: this,
			owner: this.$.binding,
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
		var lf = this.isAncestorInstanceOf(wm.LiveForm) || this.isAncestorInstanceOf(wm.DataForm);
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
	    if (wm.getParentForm) {
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

	    /* If this is a wm.Lookup within a composite key acting to select an id, we need to propagate its value up to the parent form's relationship */
	    if (this.relationshipName && !this.selectedItem.isEmpty()) {
		var subform = this.getParentForm();
		var mainform = subform.getParentForm();
		mainform.dataOutput.setValue(this.relationshipName, this.selectedItem);
	    }
	}
});

/* ignore displayExpresion and maxResults */
dojo.declare("wm.FilteringLookup", wm.Lookup, {
    startUpdate: false,
    restrictValues: true, // looking up up objects; partial match is useless
    changeOnKey: true,
    pageSize: 25,
    autoComplete: true,
    hasDownArrow: false,
    placeHolder: "Start typing to find matches",
    filterField: "", // right now we only support filtering upon a single field
    prepare: function() {
	this.inherited(arguments);
	this.maxResults = this.pageSize;
	this.filterField = this.displayField;
	this.orderBy = "asc: " + this.displayField;
    },
/*
    createDataSet: function() {
	this.inherited(arguments);
	if (this.dataSet) {
	    this.dataSet.connect(this.dataSet, "onSuccess", this, "onDataSetSuccess");
	}
	
    },
    */
    setDataSet: function(inDataSet) {
	this.inherited(arguments);
	if (this.dataSet) {
	    wm.onidle(this, function() {
		var item = this.editor.get("item");
		if (item) {
		    if (item[this._storeNameField] != this.editor.get("displayedValue"))
			item = null;
		}
		if (!item && this.editor.get("displayedValue")) {
		    this.editor._startSearchFromInput();
		}
		this._onchange(); // see if there have been any new characters since our last request was fired
	    });
	}
    },
    setDataValue: function(inData) {
	if (this.dataSet && inData) {
	    this.dataSet.setData(inData ? [inData] : null);
	}
	this.inherited(arguments);
    },
/*
    onDataSetSuccess: function() {
	wm.onidle(this, function() {
	    var item = this.editor.get("item");
	    if (item) {
		if (item.name != this.editor.get("displayedValue"))
		    item = null;
	    }
	    if (!item) {
		this.editor._startSearchFromInput();
	    }
	    this._onchange(); // see if there have been any new characters since our last request was fired
	});
    },
    */
    setPageSize: function(inValue) {
	this.maxResults = this.pageSize = inValue;
    },
    doOnchange: function() {
	this._onchange();
	if (this.editor.get("item")) {
	    this.inherited(arguments);
	}
    },
    _onchange: function() {
	if (this.disabled || this.readonly) return;
	var value = this.editor.get("displayedValue");
	var lastValue = this.dataSet.filter.getValue(this.filterField);

	/* Insure that oldValue doesn't get used in setDataSet if there is no current item */
	if (!this.editor.get("item")) {
	    this.dataValue = "";
	}

	/* Don't update the filter if its already firing; keep it at its last value so we'll know when it returns
	 * what was requested
	 */
	if (value != lastValue && !this.dataSet._requester) {
	    this.dataSet.filter.setValue(this.filterField, value);
	    if (value === undefined || value === null || value === "") {
		this.dataSet.setData([]);
	    } else {
		this.dataSet.update();
	    }
	}
    },
/*
    editorChanged: function() {
	if (this.dataSet) {
	    wm.AbstractEditor.prototype.editorChanged.call(this);
	    this.updateSelectedItem();
	    return true;
	}
    },
    */
	getDisplayValue: function() {
	    if (this.editor)
		return this.editor.get('displayedValue');	    
	    else
		return this.inherited(arguments);
	},
    _end: 0
});