/*
 *  Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Editors._SelectEditor");
dojo.require("wm.base.widget.Editors.Base");


//===========================================================================
// Select Editor
//===========================================================================


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
		    pageSize: this.pageSize ? this.pageSize + 1: Infinity // dijit requires 1 higher or it will still print the "more" link
		}, inProps || {});
	},
    createEditor: function() {
        var editor = this.inherited(arguments);
        if (this.isReflowEnabled())
            this.renderBounds();
        return editor;
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
	    if (this.editor && this.editor.domNode) {
		this.editor.domNode.style.height = this.getContentBounds().h + "px";
		if (this.editor.downArrowNode) {
		    this.editor.downArrowNode.style.height = this.editor.domNode.style.height;
                    if (this.editor.downArrowNode.childNodes.length == 1)
		        this.editor.downArrowNode.childNodes[0].style.height = this.editor.domNode.style.height ;
                }

                if (dojo.isIE && dojo.isIE < 8) {
	            var n = dojo.query(".dijitArrowButtonInner", this.domNode)[0];
                    var h = dojo.coords(this.editor.domNode).h;
                    var s = n.style;
                    var c = dojo.coords(n);
                    s.position = "relative";
                    s.top = Math.floor((h-c.h)/2) + "px";
                }
            }
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
			this.editor.set("value",inValue);
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
			e.set('displayedValue', inDisplayValue);
        else
		    e.set("value", inDisplayValue);
	},
	getDisplayValue: function() {
		if (this.hasValues())
			return this.inherited(arguments);
	},
	getEditorValue: function() {
		var v;
		if (this.editor && this.hasValues()) {
			var
				displayed = this.editor.get('value'),
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
				data[i] = {dataValue: d };
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
            if (inDataSet && inDataSet.type && inDataSet.type != "any" && inDataSet.type != this.owner.selectedItem.type)
                this.owner.selectedItem.setType(inDataSet.type);

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
					this.editor.set('value','');
				}
				catch(e){
					console.info('error while clearing editor value............', e);
				}
		    } else {
				this.editor.set("value", undefined);
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

    updateNow: function() {
	return this.update();
	}
});

wm.Object.extendSchema(wm._SelectEditor, {
	changeOnKey: { ignore: 1 },
	changeOnEnter: { ignore: 1 },
    selectedItem: { ignore: true, isObject: true, bindSource: true, isOwnerProperty: 1},
    dataSet: { readonly: true, group: "data", order: 5, type: "wm.Variable", isList: true, bindTarget: true, editor: "wm.prop.DataSetSelect"},
	startUpdate: { group: "data", order: 6},
	liveVariable: {ignore: 1 },
	formatter: {ignore:1},
	options: {group: "data", order: 7},
    dataField: {group: "data", order: 10, editor: "wm.prop.FieldSelect"},
    displayField: {group: "data", order: 15, editor: "wm.prop.FieldSelect"},
    lookupDisplay:{group: "data", order: 16, options: wm.selectDisplayTypes},
    displayExpression: {group: "data", order: 20},
	hasDownArrow: {group: "editor", order: 26},
        restrictValues: {type: "wm.Boolean", group: "data", order: 40},
	pageSize: { order: 0},
    updateNow: {group: "operation",operation:1},
	dataFieldWire: { ignore: 1}
});


wm._LookupEditor.extend({
	listProperties: function() {
		var props = this.inherited(arguments);
		props.dataSet.ignoretmp = this.autoDataSet;
		props.dataSet.bindTarget = !props.dataSet.ignoretmp;
		return props;
	}
});

wm.Object.extendSchema(wm._LookupEditor, {
	autoDataSet: {group: "data", order: 3},
	options: {ignore: 1},
	dataField: {ignore: 1}
});