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

dojo.provide("wm.base.widget.LiveForm_design");
dojo.require("wm.base.widget.LiveForm");

wm.Object.extendSchema(wm.LiveFormBase, {
    liveSaving:{ ignore: 1},
    themeStyleType: {group: "style", order: 150},
	dataSet: { readonly: 1, group: "data", order: 1, bindTarget: 1, type: "wm.Variable"},
	dataOutput: { ignore: 1, group: "data", order: 2, bindable: 1, type: "wm.Variable", simpleBindProp: true, categoryParent: "Properties", categoryProps: {component: "dataOutput", inspector: "Data"} },
	clearData: { group: "operation", order: 2},
	addEditors: { group: "operation", order: 5},
	removeEditors: { group: "operation", order: 10},
	readonly: { group: "editor", order: 6},
    //validateBeforeSave: {group: "display", order: 7, type: "Boolean"},
	editorWidth: {group: "display", order: 200},
	editorHeight: {group: "display", order: 201},
	editorSize: { ignore: 1},
	captionSize: { group: "display", order: 210},
	captionUnits: { ignore: 1},
	captionAlign: { group: "display", order: 230},
    captionPosition: { group: "display", order: 240},
    setDataSet: {group: "method"},
    beginDataUpdate: {group: "method"},
    clearData: {group: "method"},
    setReadonly: {group: "method"}


});

// convert "foo.bar.spaz" of class wm.Editor to "fooBarSpazEditor1"
wm.makeNameForProp = function(inProp, inSuffix) {
	return inProp.replace(/\.(\S)/g, function(w) {return w.slice(1).toUpperCase();} ) + (inSuffix || "")+ "1";
}

wm.getEditorClassName = function(type){
	if (dojo.indexOf(wm.editors, type) == -1)
		type = 'Text';
    switch(type.toLowerCase()) {
    case "checkbox":
	type = "Checkbox";
	break;
    case "select":
	type = "SelectMenu";
	break;
    case "date":
	type = "DateTime";
	break;
    }
    return 'wm.'+type;
}

wm.LiveFormBase.extend({
	addEditors: "(addEditors)",
	removeEditors: "(removeEditors)",
	afterPaletteDrop: function() {
		wm.Container.prototype.afterPaletteDrop.call(this);
		this.createLiveSource(this._liveSource);
	},
	designPasted: function() {
		this._checkBindings();
	},
	//===========================================================================
	// Property management
	//===========================================================================
	listProperties: function() {
		var p = this.inherited(arguments);
		p.editorWidth.ignoretmp = p.editorWidth.writeonly = (this.box == "v");
		p.editorHeight.ignoretmp = p.editorHeight.writeonly = (this.box == "h");
		return p;
	},
	//===========================================================================
	// Form initialization
	//===========================================================================
	set_dataSet: function(inDataSet) {
		if (inDataSet instanceof wm.Variable) {
			this.setDataSet(inDataSet);
			if (this.canAddEditors()) {
				this.addEditors();
			}
		// set via drop down or cleared
		} else {
			var
				ds = this.getValueById(inDataSet),
				structured = ds && wm.typeManager.isStructuredType((ds || 0).type);
			if (structured)
				this.bindDataSet(ds);
			else if (!inDataSet)
				this.unsetDataSet();
		}
	},
	bindDataSet: function(inDataSet) {
		if (inDataSet instanceof wm.Variable)
			this.$.binding.addWire("", "dataSet", (inDataSet ||0).getId());
	},
	unsetDataSet: function() {
		this.dataSet = null;
	},

	//===========================================================================
	// Editor management / creation
	//===========================================================================
	destroyEditors: function() {
		this._currentEditors = null;
		for(var i=0, eds = this.getFormEditorsArray(), e; (e=eds[i]); i++) {
			this._removeBindingForEditor(e);
			e.destroy();
		}
	},
	removeEditors: function() {
		this.destroyEditors();
		this.setFitToContentHeight(false);
		this.reflow();
		wm.fire(this, "updateDesignTrees");
	},
	destroyGrid: function(){
		for(var i=0, eds = this.findGrid(), e; (e=eds[i]); i++) {
			this._removeBindingForEditor(e);
			e.destroy();
		}
	},
	removeGrid: function() {
		this.destroyGrid();
		this.setFitToContentHeight(false);
		this.reflow();
		wm.fire(this, "updateDesignTrees");
	},
	canAddEditors: function() {
		if (!this._loading && this.isDesignLoaded()) {
			if (!wm.typeManager.isStructuredType((this.dataSet || 0).type)) {
				wm.logging && console.log(this.name, "dataSet with known data type required before generating editors.");
			} else
				return (!this.getFormEditorsArray().length);
		}
	},
	addEditors: function() {
		var ds = this.dataSet;
		this._currentEditors = this.getFormEditorsArray();
		// we don't want updates while making editors
		ds.beginUpdate();
		this.makeEditors();
		this.finishAddEditors();
		this._currentEditors = null;
		ds.endUpdate();
	},
	finishAddEditors: function() {
		var eds = this.getFormEditorsArray();
		// tell editors they can reflow and then reflow
		dojo.forEach(eds, function(e) {
			e._doRenderReflow = true;
		});
		wm.fire(this, "updateDesignTrees");
		this.populateEditors();
		this.setFitToContentHeight(true);
		this.reflow();
	},
	makeEditors: function() {
		var
			lv = this.getLiveVariable(),
			fields = lv ? lv.getViewFields() : wm.getDefaultView((this.dataSet || 0).type);
		dojo.forEach(fields, dojo.hitch(this, "makeEditor"));
		// make a related editor for each relationship in relevant liveView
		if (lv) {
			if (lv.liveView)
				lv.liveView.getRequiredRelatedFields();
			dojo.forEach(lv.getViewRelated(), function(r) {
				var formField = this._getFormField(r);
				if (formField) {
					this.makeRelatedEditor(formField);
				}
			}, this);
		}
	},
	makeEditor: function(inFieldInfo) {
		var
			f = inFieldInfo,
			ff = this._getFormField(f.dataIndex);
		if (ff && !this._getEditorForField(ff)) {
			var
				props = dojo.mixin(this.getFormEditorProps() || {}, {
					formField: ff,
				        readonly: this.readonly,
					name: wm.makeNameForProp(ff, "Editor")
				}),
/*		    e = this.createEditor(f, props, {onEnterKeyPress: this.getId() + ".saveDataIfValid"}, wm.getEditorClassName(f.displayType));*/
		    e = this.createEditor(f, props, {}, wm.getEditorClassName(f.displayType));
			if (e)
			this._bindEditor(e);
			return true;
		}
	},
	makeRelatedEditor: function(inRelated) {
		var re = this._getEditorForField(inRelated);
		/*
		if (re) {
			if (re instanceof wm.RelatedEditor)
				re.addEditors();
		} else {
		*/
		if (!re){
			var list = wm.typeManager.isPropInList((this.dataSet || 0)._dataSchema, inRelated)
			//var e = this[list ? "createRelatedGrid" : "createRelatedEditor"](inRelated);
			var e = this.createRelatedEditor(inRelated);
			if (e)
				this._bindEditor(e);
		}
	},
	/*createRelatedGrid: function(inFormField) {
		var props = {};
		props.formField = inFormField;
		return this.owner.loadComponent(wm.makeNameForProp(inFormField, "Related"), this, "wm.RelatedGrid", props);
	},*/
	createRelatedEditor: function(inFormField) {
		var props = this.getFormEditorProps();
	        props.caption = wm.capitalize(inFormField);
		props.formField = inFormField;
                props.width = this.editorWidth;

	        var lv = this.getLiveVariable();
	        var typeDef = wm.typeManager.getType(lv.type);
	        if (typeDef)
		    var fieldDef = typeDef.fields[inFormField];
	        if (fieldDef)
		    var relatedTypeDef = wm.typeManager.getType(fieldDef.type);
	        if (relatedTypeDef && !relatedTypeDef.liveService) {
		    props.editingMode = "editable subform";
		    return this.owner.loadComponent(wm.makeNameForProp(inFormField, "RelatedEditor"), this, "wm.RelatedEditor", props);
		} else if (relatedTypeDef) {
		    props.name = wm.makeNameForProp(inFormField, "Lookup")
		    return wm.createFieldEditor(this.getEditorParent(), fieldDef, props, {}, "wm.Lookup");
		} else {
		    return this.owner.loadComponent(wm.makeNameForProp(inFormField, "RelatedEditor"), this, "wm.RelatedEditor", props);
		}
	},
	// formField that should be included here. not returned if should not included
	_getFormField: function(inField) {
		if (inField.indexOf(".") == -1)
		return inField;
	},
	_getEditorForField: function(inField) {
		var editors = this._currentEditors = this._currentEditors || this.getFormEditorsArray();
		for (var i=0, editors, e; (e=editors[i]); i++)
			if (e.formField == inField) {
				return e;
			}
	},
	_hasOutputBindingForProp: function(inProp) {
		var w = wm.data.getPropWire(this, "dataOutput" + (inProp ? "." : "") + inProp ||"");
		return Boolean(w);
	},
	getFormEditorProps: function() {
		return {
			size: this.editorSize,
			readonly: this.readonly,
			captionSize: this.captionSize,
			captionAlign: this.captionAlign,
			captionPosition: this.captionPosition
		}
	},
	getEditorParent: function() {
		return this;
	},
	createEditor: function(inFieldInfo, inProps, inEvents, inClass) {
		var e = wm.createFieldEditor(this.getEditorParent(), inFieldInfo, inProps, inEvents, inClass);
		if (e) {
		        if (e instanceof wm.Date && this.bounds.w > 400)
			    e.setWidth("400px");
                        else if (e.parent.horizontalAlign != "justified")
			    e.setWidth(this.editorWidth);
                        else 
                            e.setWidth("100%"); // because its going to be 100% anyway so why confuse the user?
			e.setHeight(this.editorHeight);
			//console.log(this.name, "createEditor", arguments, e);
			return e;
		}
	},
	//===========================================================================
	// Automatic data source creation via _liveSource prop
	//===========================================================================
	createLiveSource: function(inType) {
		var ti = wm.typeManager.getType(inType)
		if (!ti)
			return;
		var
			sa = studio.application,
			name = inType.split('.').pop().toLowerCase(),
			lv = new wm.LiveView({owner: sa, name: wm.findUniqueName(name + "LiveView1", [sa]), service: ti.service, dataType: inType, _defaultView: true});
	                lv.getRelatedFields(); // make sure its calculated its list of related fields before we create/fire a livevar
		var r = this.getRoot();
  	        var d = r.createComponent(name + "LiveVariable1", "wm.LiveVariable", {liveSource: lv.getId()});
		this.set_dataSet(d.name);
		if (r == studio.page)
			this.updateDesignTrees();
	},
	//===========================================================================
	// Add existing editors to form
	//===========================================================================
	addEditorToForm: function(inEditor) {
		var e = inEditor, ff = e.formField && this.getViewDataIndex(e.formField || "");
		if (ff) {
                    if (e instanceof wm.RelatedEditor)
			var f = this.addEditorToView(e, ff);
		    if (f)
			wm.updateFieldEditorProps(e, f)
		}
		inEditor.setReadonly(this.readonly);
		this._bindEditor(inEditor);
		this.populateEditors();
	},
	addEditorToView: function(inEditor, inField) {
		var
			ff = inField,
			lv = this.getLiveVariable(),
			v = lv && lv.liveView;
		if (v) {
			if (inEditor instanceof wm.Editor)
				return v.addField(ff);
			else {
				v.addRelated(ff);
				lv.update();
			}
		}
	},
	//===========================================================================
	// Editor binding (design + runtime due to load binding checking)
	//===========================================================================
	_checkBindings: function() {
		var editors = this.getFormEditorsArray();
		for (var i=0, ed; (ed=editors[i]); i++) {
			if (!this._isOkOutputBinding(ed))
				this._bindEditorOutput(ed);
			if (!this._isOkInputBinding(ed))
				this._bindEditorInput(ed);
		}
	},
	_isOkInputBinding: function(inEditor) {
		var
			info = this._getInputBindInfo(inEditor),
			b = inEditor && inEditor.components.binding,
			wires = b && b.wires,
			w = info && wires[info.targetProperty];
		return !info || (w && (w.source == info.source));
	},
	_isOkOutputBinding: function(inEditor) {
		var
			info = this._getOutputBindInfo(inEditor),
			b = this.components.binding,
			wires = b.wires,
			w = info && wires[info.targetProperty];
		return !info || (w && (w.source == info.source));
	},
	_removeBindingForEditor: function(inEditor) {
		// unbind form
		var
			wire,
			binding = this.components.binding,
			wires = binding.wires,
			n = inEditor && inEditor.getId();
		if (n) {
			for (var i in wires) {
				wire = wires[i];
				if (wire.source.indexOf(n) == 0)
					binding.removeWire(wire.getWireId());
			}
		}

		// unbind editor
		var binding = inEditor.components.binding;
		if (binding)
			binding.removeWire("dataValue");
	},
	// make binding from which editor gets data
	// FIXME: remove knowledge of editor type
	_getInputBindInfo: function(inEditor) {
		// FIXME: testing
		if (inEditor instanceof wm.Editor)
			return;
		var
			f = inEditor.formField,
			targetProperty = inEditor instanceof wm.Editor ? "dataValue" : (inEditor instanceof wm.RelatedEditor ? "dataSet" : null),
			ds = this.dataSet,
			source = ds ? (ds.getId() + (f ? "." + f : "")) : "";
		if (source)
			return f !== undefined && targetProperty ? {targetProperty: targetProperty, source: source} : false;
	},
	_getOutputBindInfo: function(inEditor) {
		// FIXME: testing
		if (inEditor instanceof wm.Editor)
			return;
		var
			f = inEditor.formField,
			targetProperty = "dataOutput" + (f ? "." + f : ""),
			p = inEditor instanceof wm.Editor ? "dataValue" : (inEditor instanceof wm.RelatedEditor ? "dataOutput" : null),
			source = inEditor.getId() + (p ? "." + p : "");
		return f !== undefined && p ? {targetProperty: targetProperty, source: source} : false;
	},
	_bindEditorInput: function(inEditor) {
		var info = this._getInputBindInfo(inEditor);
		if (info)
			inEditor.$.binding.addWire("", info.targetProperty, info.source);
	},
	// push data from editor to form
	_bindEditorOutput: function(inEditor) {
		var info = this._getOutputBindInfo(inEditor);
		if (info)
			this.components.binding.addWire("", info.targetProperty, info.source);
	},
	_bindEditor: function(inEditor) {
		if (!inEditor)
			return;
		this._removeBindingForEditor(inEditor);
		this._bindEditorInput(inEditor);
		this._bindEditorOutput(inEditor);
	},
	//===========================================================================
	// Inspector implementations
	//===========================================================================
	makePropEdit: function(inName, inValue, inDefault) {
	var prop = this.schema ? this.schema[inName] : null;
	var name =  (prop && prop.shortname) ? prop.shortname : inName;
		switch (inName) {
			case "addEditors":
			case "removeEditors":
			case "clearData":
		        case "generateButtons":
				return makeReadonlyButtonEdit(name, inValue, inValue);
			case "editorWidth":
			case "editorHeight":
			case "captionSize":
				return new wm.propEdit.UnitValue({component: this, name: inName, value: inValue, options: this._sizeUnits});
			case "captionAlign":
				return makeSelectPropEdit(inName, inValue, ["left", "center", "right"], inDefault);
			case "captionPosition":
				return makeSelectPropEdit(inName, inValue, ["top", "left", "bottom", "right"], inDefault);
/*
                        case "editPanelStyle":
				return makeSelectPropEdit(inName, inValue, ["wm.Button","wm.RoundedButton", "none"], inDefault);
				*/
			case "dataSet":
				var p = wm.getParentForm(this);
				return p ?
					new wm.propEdit.Select({component: this, name: inName, options: [""].concat(this.getFormSubDataSetNames(p))}) : 
					new wm.propEdit.LiveDataSetSelect({component: this, name: inName, widgetDataSets: true});
		}
		return this.inherited(arguments);
	},
        setName: function(inName) {
            var editPanel = this.getEditPanel();
	    if (!editPanel) 
		return this.inherited(arguments);
            if (!editPanel.isCustomized && editPanel.lock) {
                this.setName2(inName);
            } else {
                app.confirm(studio.getDictionaryItem("wm.LiveForm.SET_NAME_CONFIRM"), false, 
                            dojo.hitch(this, function() {
                                this.setName2(inName);
                                studio.inspector.reinspect();
                            }),
                            dojo.hitch(this, function() {
                                studio.inspector.reinspect();
                            }));
            }
        },
        setName2: function(inName) {
            wm.Container.prototype.setName.call(this, inName);
            var editPanel = this.getEditPanel();
            if (editPanel) {
                editPanel.destroy(); 
                this.addEditPanel();                
            }
        },
        editProp: function(inName, inValue, inInspector) {
	    switch (inName) {
	    case "addEditors":
		return this.addEditors();
	    case "removeEditors":
		app.confirm(studio.getDictionaryItem("wm.LiveForm.CONFIRM_REMOVE_EDITORS", {name: this.getId()}),
			    false, 
			    dojo.hitch(this, "removeEditors"));
		
		return;
	    case "clearData":
		return this.clearData();
	    case "generateButtons":
		return this.generateButtons();
	    }
	    return this.inherited(arguments);
	},
    generateButtons: function() {
	if (!this._generateButtonsDialog) {
	    var dialog = 
		this._generateButtonsDialog = 
		new wm.GenericDialog({modal: true,
				      footerBorder: "0",
				      title: studio.getDictionaryItem("wm.LiveForm.GENERATE_BUTTONS_TITLE"),
				      userPrompt: studio.getDictionaryItem("wm.LiveForm.GENERATE_BUTTONS_PROMPT"),
				      width: "400px",
				      height: "200px",
				      button1Caption: studio.getDictionaryItem("wm.LiveForm.GENERATE_BUTTONS_CAPTION1"),
				      button2Caption: studio.getDictionaryItem("wm.LiveForm.GENERATE_BUTTONS_CAPTION2"),
				      button3Caption: studio.getDictionaryItem("wm.LiveForm.GENERATE_BUTTONS_CAPTION3"),
				      button1Close: true,
				      button2Close: true,
				      button3Close: true,
				      owner: studio,
				      name: this.name + "_GenerateLiveFormButtonsDialog"});
	    dialog.connect(dialog, "onButton1Click", this, function() {
/*
		if (this.editPanelStyle == "none")
		    this.editPanelStyle = "wm.Button";
		    */
		this.addEditPanel();
	    });

	    dialog.connect(dialog, "onButton2Click", this, function() {
		var panel = this.owner.loadComponent(this.name + "ButtonPanel", this, "wm.Panel", 
						 {height: wm.Button.prototype.height,
						  layoutKind: "left-to-right",
						  width: "100%"});		

		/* Generate a save button that is only enabled if data is valid and calls saveDataIfValid */
		var saveButton = this.saveButton = new wm.Button({owner: studio.page,
								  name: studio.page.getUniqueName(this.name + "SaveButton"),
								  parent: panel,
								  caption:  studio.getDictionaryItem("wm.LiveForm.GENERATE_BUTTONS_SAVE")});
		saveButton.eventBindings.onclick = this.name + ".saveDataIfValid";
		this.saveButton.$.binding.addWire(null, "disabled", this.name + ".invalid","");


		/* Generate a cancel button which defaults to changing form to readonly. User may change this to a
		 dialog.hide or something else */
		var cancelButton = new wm.Button({owner: studio.page,
						  name: studio.page.getUniqueName(this.name + "CancelButton"),
						  parent: panel,
						  caption:  studio.getDictionaryItem("wm.LiveForm.GENERATE_BUTTONS_CANCEL")});
		cancelButton.eventBindings.onclick = this.name + ".cancelEdit";

		/* Generate a new button which defaults to calling beginDataInsert */
		var newButton = new wm.Button({owner: studio.page,
					       name: studio.page.getUniqueName(this.name + "NewButton"),
					       parent: panel,
					       caption:  studio.getDictionaryItem("wm.LiveForm.GENERATE_BUTTONS_NEW")});
		newButton.eventBindings.onclick = this.name + ".beginDataInsert";

		/* Generate a new button which defaults to calling beginDataInsert */
		var updateButton = new wm.Button({owner: studio.page,
						  name: studio.page.getUniqueName(this.name + "UpdateButton"),
						  parent: panel,
						  caption:  studio.getDictionaryItem("wm.LiveForm.GENERATE_BUTTONS_UPDATE")});
		updateButton.eventBindings.onclick = this.name + ".beginDataUpdate";


		/* Generate a delete button which defaults to calling beginDataInsert */
		var deleteButton = new wm.Button({owner: studio.page,
						  name: studio.page.getUniqueName(this.name + "DeleteButton"),
						  parent: panel,
						  caption:  studio.getDictionaryItem("wm.LiveForm.GENERATE_BUTTONS_DELETE")});
		deleteButton.eventBindings.onclick = this.name + ".deleteData";

		panel.reflow();
		studio.refreshVisualTree();
	    });

	}
	    this._generateButtonsDialog.show();
	
	},
	getFormSubDataSetNames: function(inForm) {
		var ds=[], id = inForm.getId() + ".dataSet.", schema = (inForm.dataSet || 0)._dataSchema;
		for (var i in schema) {
			var ti = schema[i];
			if (ti.isList) {
			} else if (wm.typeManager.isStructuredType(ti.type)) {
				ds.push(id + i);
			}
		}
		return ds;
	},
	updateDesignTrees: function() {
		wm.fire(studio, "refreshComponentOnTree", [this]);
		wm.fire(studio, "refreshWidgetsTrees");
	}
});

//===========================================================================
// LiveForm design extensions
//===========================================================================
wm.LiveForm.description = "Displays a detailed form.";

wm.Object.extendSchema(wm.LiveForm, {
	liveVariable: {ignore: 1},
	liveEditing: { group: "editor", order: 5, type: "Boolean"},
        operation: {group: "editor", order: 6, options: ["insert", "update", "delete"], type: "String"},     
        saveOnEnterKey: { group: "editor", order: 10, type: "Boolean"},
        alwaysPopulateEditors: { group: "editor", order: 15, type: "Boolean"},


	defaultButton: { ignore: 1, group: "deprecated", order: 5, bindTarget: 1, type: "wm.Button"},
        displayErrors: { group: "data", order: 15},
    //noButtonPanel: {group: "display", order: 8, type: "Boolean", ignore: 1},
    //editPanelStyle: {group: "display", order: 9, type: "String"},
    beginDataInsert: {group: "method"},
    saveData: {group: "method"},
    saveDataIfValid: {group: "method"},
    insertData: {group: "method"},
    updateData: {group: "method"},
    deleteData: {group: "method"},
    generateButtons: {group: "operation", order: 12},
    imageList: {ignore: 1},
    freeze: {ignore: 1},
    lock: {ignore: 1}
});

wm.LiveForm.extend({
	_defaultClasses: {domNode: ["wm_SilverBlueTheme_MainOutsetPanel", "wm_Padding_4px"]},
	//===========================================================================
	// Form initialization / binding
	//===========================================================================
    listProperties: function() {
	var p = this.inherited(arguments);
	p.operation.ignoretmp = this.liveEditing;
	return p;
    },
	addEditors: function() {
		this._generateDeferred = new dojo.Deferred();
		//console.log("addEditors", this._generateDeferred);
		// remove bindings (but not dataSet binding)
		// removing dataSet binding fails if triggered by the dataSet wire.
	    studio.beginWait(studio.getDictionaryItem("wm.LiveForm.WAIT_ADD_EDITORS", {widgetName: this.getId()}));
		wm.onidle(this, function() {
			try {
			    if (!this.getEditPanel() && !this._noEditPanel) {
				this.addEditPanel();
			  }
				wm.LiveFormBase.prototype.addEditors.call(this);
			} catch(e) {
				this.finishAddEditors();
			}
                        this.setHeight("500px"); // assuming fitToContentHeight is enabled, this will ignore the 500px and set to the preferred fitToContentHeight.
			studio.select(null);
			studio.select(this);
		});
	},
	//===========================================================================
	// Editor management / creation
	//===========================================================================
/*
	setNoButtonPanel: function(inValue) {
	  this.noButtonPanel = inValue;
	  if (!inValue) {
	    this.addEditPanel();
	  } else {
	    var e = this.getEditPanel();
	    e.destroy();
	  }
	},
        setEditPanelStyle: function(inStyle) {
            if (this.editPanelStyle == inStyle) return;

            this.editPanelStyle = inStyle;
            var e = this.getEditPanel();
            if (e)
                e.destroy();
            if (inStyle != "none") 
                this.addEditPanel();
            else
                this.reflow();
        },
	*/
	finishAddEditors: function() {
	    var p = this.getEditPanel();
	    if (p)
		p.parent.moveControl(p, p.parent.c$.length);
	    this.inherited(arguments);
	    studio.endWait();
	    if (this._generateDeferred && this._generateDeferred.fired == -1)
		wm.fire(this._generateDeferred, "callback", [true]);
	},
	// special handling for automatic binding to a source to refresh on success
	// if our dataSet is bound to a selectedItem or a LiveVariable with selectedItem as a source
	// attempt to see if the owner of that item has a dataSet that can be updated
	// if so, return it.
	getSuccessUpdateVariable: function() {
		var v = wm.data.getPropBindSource(this, "dataSet");
		if (v instanceof wm.LiveVariable) {
			var w = wm.data.getPropBindSource(v, "sourceData");
			if (w)
				v = w;
		}
		if (v && (v.getId() || "").split('.').pop() == "selectedItem") {
			var ds = v.owner && v.owner.dataSet;
			if (ds instanceof wm.ServiceVariable && ds.isList)
				v = ds;
		}
		if (v instanceof wm.ServiceVariable)
			return v.getId();
	},
	addSuccessRefresh: function() {
		if (!("onSuccess" in this.eventBindings)) {
			var s = this.getSuccessUpdateVariable();
			if (s)
				this.eventBindings.onSuccess = s;
		}
	},
	getEditPanel: function() {
		var w, widgets = this.widgets;
		for (var i in widgets) {
			w = widgets[i];
			if (w instanceof wm.EditPanel)
				return w;
		}
	},
	// add an edit panel if we have a type that supports liveEditing.
	addEditPanel: function() {
            //if (this.editPanelStyle == "none") return;
	    var r = this.getRoot();
	    if (!this.getEditPanel() && (wm.typeManager.getLiveService((this.dataSet || 0).type) || this.liveVariable)) {
		var e = this.owner.loadComponent(this.name + "EditPanel", this, "wm.EditPanel", {/*editPanelStyle: this.editPanelStyle, */height: wm.Button.prototype.height});
		if (e) {
		    e.set_liveForm(this.getId());
		}
	    }
            this.setHeight("500px"); // assuming fitToContentHeight is enabled, this will ignore the 500px and set to the preferred fitToContentHeight.

	},
	isFormFieldInForm: function(ff){
		var arr = this.getRelatedEditorsArray() || [];
		for(var i = 0; i < arr.length; i++){
			var e = arr[i];
			if (e.formField == ff)
				return true;
		}
		
		var arr = this.getFormEditorsArray() || [];
		for(var i = 0; i < arr.length; i++){
			var e = arr[i];
			if (e.formField == ff)
				return true;
		}

		return false;
	}
});

//===========================================================================
// SimpleForm design extensions
//===========================================================================
wm.SimpleForm.description = "Displays a simple form.";

wm.SimpleForm.extend({
	bindEditorDataSet: function(e) {
		if (this.dataSet instanceof wm.Variable && e.formField)
			e.$.binding.addWire("", "dataValue", this.dataSet.getId()+'.'+ e.formField);
	},
	_bindEditor: function(inEditor) {
		if (!inEditor)
			return;
		this._removeBindingForEditor(inEditor);
		this.bindEditorDataSet(inEditor);
		this._bindEditorOutput(inEditor);
	}
});

wm.Object.extendSchema(wm.SimpleForm, {
	readonly: {ignore: 1},
//	validateBeforeSave: {ignore: 1},
	lock: {ignore: 1},
    freeze: {ignore: 1}
});
