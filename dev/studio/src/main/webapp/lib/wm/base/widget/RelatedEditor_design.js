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

dojo.provide("wm.base.widget.RelatedEditor_design");
dojo.require("wm.base.widget.RelatedEditor");

wm.Object.extendSchema(wm.RelatedEditor, {
	dataSet: {ignore: 1},
	editingMode: { group: "common", order: 100},
	formField: {group: "common", order: 500},
	caption: {ignore: 1},
    readonly: {ignore: 1},
    ignoreParentReadonly: {group: "editor", order: 100, type: "Boolean"}
});

wm.RelatedEditor.extend({
	_editingModes: ["lookup", "readonly", "editable subform"],
	_cachedLookup: null,
	designCreate: function() {
		this.inherited(arguments);
		if (this._hasAncestorEditingMode(["lookup"]))
			this.editingMode = "readonly";
	},
	postInit: function(){
		this.inherited(arguments);
		this.initializeFormField();
	},
        initializeFormField: function(){
	    if (!this.formField)
	    {
		var ff = this.getUniqueFormField();
		if (ff && ff != '')
		    this.set_formField(ff);
	    }

	    var fieldSchema = this._getFieldSchema();
	    if (!this.editingMode){
		if(fieldSchema && fieldSchema.isList){
		    this._editingModes = ["readonly"];
		    this.editingMode = "readonly";
		} else {
		    this.set_editingMode("lookup");
		}
	    }	
	},
	getUniqueFormField: function(){
			var lf = wm.getParentForm(this);
			if (!lf)
				return '';
			var arr = this.getOptions();
			if (arr.length < 2)
				return arr[0];
			for (var i = 1; i < arr.length; i++){
				if (!lf.isFormFieldInForm(arr[i]))
					return arr[i];
			}
			
			return arr[1];
	},
	listProperties: function() {
		var
			props =  dojo.mixin({}, this.inherited(arguments)),
			f = wm.getParentForm(this);
		props.formField.ignoretmp = !Boolean(f);
	        props.ignoreParentReadonly.ignoretmp = (this.editingMode != "editable subform");
		return props;
	},
	set_formField: function(inFieldName) {
		if (!inFieldName)
			delete this.formField;
		else
			this.formField = inFieldName;

		if (this.hasGrid())
			this.removeGrid();
		else
			this.removeEditors();
			
		var f = wm.getParentForm(this);
		f.addEditorToForm(this);
	},
	set_editingMode: function(inMode) {
		if (this._hasAncestorEditingMode(["readonly", "lookup"]) && inMode != "readonly") {
		    app.alert(studio.getDictionaryItem("wm.RelatedEditor.BAD_EDIT_MODE"));
		    return;
		}
		this.editingMode = inMode;
		this._editModeChanged();
	},
	_editModeChanged: function() {
		// if we're not in lookup mode, remove object editor, 
		// but save it for later re-use
		var m = this.editingMode;
		this.removeEditors();
	        this.addEditors();
		// reflow and update design trees due to insert editor change.
		this.reflow();
		this.updateDesignTrees();
		this.bindFormEditors();
		// children can be editable only if we are in inline mode.
		if (m != "editable subform")
			this._disableChildrenEditing();
	},
	_disableChildrenEditing: function() {
		var related = this.getRelatedEditorsArray();
		dojo.forEach(related, function(r) {
			r.set_editingMode("readonly");
		});
	},
	_hasAncestorEditingMode: function(inModes) {
		var p = this.parent;
	    while (p && (p instanceof wm.RelatedEditor || p instanceof wm.Container)) {
		if (p instanceof wm.RelatedEditor) {
		    if (dojo.indexOf(inModes || [], p.editingMode) != -1)
			return true;
		} 
		p = p.parent;
	    }
	},
	//===========================================================================
	// Editor management / creation
	//===========================================================================
	// formField that should be included here. not returned if should not be included
	_getFormField: function(inField) {
		if (inField.indexOf(".") == -1)
			return inField;
		var f = this._getRelativeFormField(inField);
		if (f && f.indexOf(".") == -1)
			return f;
	},
	makeEditors: function() {
		try{
			var fieldSchema = this._getFieldSchema();
			if (fieldSchema && fieldSchema.isList)
				this.makeGrid();
			else {
				var lookupAdded = null;
				if (this.editingMode == "lookup")
					lookupAdded = this.makeLookup(fieldSchema);
				if (!lookupAdded){
					var	lv = this.getLiveVariable(),
						fields = wm.getDefaultView((this.dataSet || 0).type);
					for (var i = 0; i < fields.length; i++) {
						if (this.makeEditor(fields[i]) && this.editingMode != "editable subform" && i > 3)
							break;
					}
				}
			}
		}
		catch(e)
		{
			console.info('error while making editors for related editor', e);			
		}
	},
	//===========================================================================
	// Object Editor management / creation
	//===========================================================================
	getFormEditorProps: function() {
		return {
			size: this.editorSize,
			readonly: true,
			captionSize: this.captionSize,
			captionAlign: this.captionAlign,
			captionPosition: this.captionPosition
		}
	},
	cacheLookup: function() {
		var s = this.findLookup();
		if (s) {
			s.setParent(null);
			this._cachedLookup = s.id;
			s.parentNode.removeChild(s.domNode);
			this._removeBindingForEditor(s);
		}
	},
	insertLookup: function() {
		if (this.findLookup())
			return;
		var s = this.getValueById(this._cachedLookup) || this.makeLookup(this._getFieldSchema());
		if (s.parent != this)
			s.setParent(this);
		// insert as first widget
		if (s != this.c$[0]) {
			this.moveControl(s, 0);
		}
	},
	makeLookup: function(inFieldSchema) {
		if (this._getEditorForField(""))
			return;

	        var liveForm = wm.getParentForm(this);
		var lv = wm.getFormLiveView(liveForm);
		var relatedFields = wm.getDefaultView(lv.dataType, this.formField);
		var ff = "";
		if (relatedFields.length > 1)
			ff = relatedFields[1];
		else if (relatedFields.length == 1)
			ff = relatedFields[0];

		if (ff && ff.dataIndex)
			ff.dataIndex = ff.dataIndex.split('.').pop(); 
		var	props = dojo.mixin(this.getFormEditorProps(), {formField: "", displayField: ff.dataIndex});
		props.editorInitProps = {
			allowNone: !inFieldSchema.required,
			required: inFieldSchema.required,
			lookupDisplay: ff.displayType || 'Text',
			displayField: ff.dataIndex,
			formField: ff.dataIndex
		};
		props.name = wm.makeNameForProp(this.formField, "Lookup");
		var lookupProps = this._getLookupFieldInfo(inFieldSchema);
		if (lookupProps) { //xxx
			lookupProps.displayField = ff.dataIndex;
			var e = this.createEditor(lookupProps, props, null, "wm.Lookup");
			if (e) {
				this._bindEditor(e);
				return e;
			}
		}
	},
	_getFieldSchema: function() {
		var f = wm.getParentForm(this);
		if (!f) {
			console.debug('RelatedEditor "' + this.name + '" is not inside a live form.');
			return;
		}
		var
			dataType = f && f._getDataType(),
			schema = wm.typeManager.getTypeSchema(dataType);
		if (!schema)
			return;
		return wm.typeManager.getPropertyInfoFromSchema(schema, this.formField);
	},
	_getLookupFieldInfo: function(inFieldSchema) {
		if (inFieldSchema.type == "com.sforce.soap.enterprise.salesforceservice.QueryResultType") 
			return null; //xxx
		return {
		    caption: studio.getDictionaryItem("wm.RelatedEditor.LOOKUP_CAPTION", {fieldName: wm.capitalize(this.formField)}),
			displayType: "Lookup",
			required: inFieldSchema.required,
			includeLists: true,
			includeForms: true
		}
	},
	_getLookupDisplayExpression: function() {
		var
			fields = [],
			t = this._getDataType(),
			schema =  wm.typeManager.getTypeSchema(t);
		if (this.formField in schema && !(wm.typeManager.isStructuredType(schema[this.formField].type)))
			fields.push(this.formField);
		else
			fields = fields.concat(wm.data.getIncludeFields(t));
		return fields.length ? '${' + fields.join('} ${') + '}' : "";
	},
	hasGrid: function() {
		return wm.getMatchingFormWidgets(this, dojo.hitch(this, function(w) {
			return ((w instanceof wm.DojoGrid) && w.getDataSet().getId() == this.dataSet.getId());
		})).length;
	},
	// return a grid with same dataSet id as the relatedEditor
	findGrid: function() {
		return wm.getMatchingFormWidgets(this, dojo.hitch(this, function(w) {
			return ((w instanceof wm.DojoGrid) && w.getDataSet().getId() == this.dataSet.getId());
		}));
	},
	makeGrid: function() {
		if (this.hasGrid())
			return;
		var
			p = this.getEditorParent(),
			g = this.owner.loadComponent("dataGrid1", p, "wm.DojoGrid", {height: "100px"}),
			dsId = (this.dataSet || 0).getId();
		if (g && dsId)
			g.set_dataSet(dsId);
	},
	removeGrid: function(){
		this.inherited(arguments);
	},
	removeEditors: function() {
		this.inherited(arguments);
	},
	//===========================================================================
	// Editor binding
	//===========================================================================
	_getOutputBindInfo: function(inEditor) {
		var
			m = this.editingMode,
			isSelect = inEditor.display == "Lookup";
		if (m == "editable" && !isSelect)
			return this.inherited(arguments);
		else if (m == "lookup" && inEditor.display == "Lookup")
			return {targetProperty: "dataOutput", source: inEditor.getId() + ".selectedItem"};
	},
	bindFormEditors: function(inRecurse) {
		var editors = this.getFormEditorsArray();
		dojo.forEach(editors, function(e) {
			this._bindEditor(e);
			if (inRecurse && e instanceof wm.RelatedEditor)
				e.bindFormEditors(inRecurse);
		}, this);
	},
	//===========================================================================
	// Inspector implementations
	//===========================================================================
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "formField":
				return new wm.propEdit.FormFieldSelect({component: this, name: inName, value: inValue, relatedFields: true});
			case "editingMode":
				return makeSelectPropEdit(inName, inValue, this._editingModes, inDefault);
		}
		return this.inherited(arguments);
	},
	getSchemaOptions: function(inSchema) {
		return [""].concat(wm.typeManager["getStructuredPropNames"](inSchema));
	},
	getOptions: function() {
		var f = wm.getParentForm(this), ds = f && f.dataSet;
		return ds && ds.type ? this.getSchemaOptions(ds._dataSchema) : [""];
	}
	
});

