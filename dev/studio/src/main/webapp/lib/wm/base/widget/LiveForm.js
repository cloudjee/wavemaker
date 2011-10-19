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

dojo.provide("wm.base.widget.LiveForm");
dojo.require('wm.base.lib.data');

wm.getLiveForms = function(inPage) {
	var forms = [];
	wm.forEachWidget(inPage.root, function(w) {
	    if (wm.isInstanceType(w, wm.LiveForm))
			forms.push(w);
	})
	return forms;
}

wm.getMatchingFormWidgets = function(inForm, inMatch) {
	var match = [];
	wm.forEach(inForm.widgets, function(w) {
			if (inMatch(w))
				match.push(w);
	    if ((wm.isInstanceType(w, wm.Container) && !(wm.isInstanceType(w, wm.LiveFormBase))))
				match = match.concat(wm.getMatchingFormWidgets(w, inMatch));
		});
		return match;
};

wm.getParentForm = function(inWidget) {
	var w = inWidget.parent;
	var r = inWidget.getRoot();
	r = r && r.root;
	while (w && w != r) {
	        if (wm.isInstanceType(w, wm.LiveFormBase)) {
			return w;
		}
		w = w.parent;
	}
}

wm.getFormLiveView = function(inForm) {
	var lv = inForm && inForm.getLiveVariable();
	return lv && lv.liveView;
}

wm.getFormField = function(inWidget) {
	var a = [], w = inWidget;
        while (w && !(wm.isInstanceType(w, wm.LiveForm))) {
		if (w.formField)
			a.unshift(w.formField);
		w = wm.getParentForm(w);
	}
	return a.join('.');
}

/**
	Base class for {@link wm.LiveForm}.
	@name wm.LiveFormBase
	@class
	@extends wm.Container
	@noindex
*/
dojo.declare("wm.LiveFormBase", wm.Container, {
	/** @lends wm.LiveFormBase.prototype */
	editorHeight: "26px",
	editorWidth: "100%",
	captionSize: "200px",
	captionAlign: "right",
	captionPosition: "left",
	height: "228px",
	width: "100%",
	//fitToContent: true,
	layoutKind: "top-to-bottom",
	readonly: false,
    //validateBeforeSave: false,
	/**
		The dataSet the LiveForm uses for source data.
		
		Typically dataSet is bound to a grid's <i>selectedItem</i> (where the grid is showing the output of a liveVariable) or directly to a liveVariable.
		
		When dataSet uses a LiveView, LiveForm generates editors for each of the fields in its related liveView.
		When dataSet uses a LiveTable, a default view is created which contains all top level properties in the data type (not including composite key fields).
		
		Although it is possible to setup a LiveForm to do automatic CRUD operations when using a LiveTable, it's easiest
		to set up a LiveView instead.
		
		@type Variable
	*/
	dataSet: null,
	/**
		Data as modified by the form editors is available as <i>dataOutput</i>.
		@type Variable
	*/
	dataOutput: null,
	init: function() {
		this.dataOutput = new wm.Variable({name: "dataOutput", owner: this});
		this.inherited(arguments);
	},
	postInit: function() {
		this.inherited(arguments);
		this.dataOutput = this.$.dataOutput;
		if (wm.pasting)
			wm.fire(this, "designPasted");
		this.populateEditors();
	},
	//===========================================================================
	// Form data
	//===========================================================================
	setDataSet: function(inDataSet) {

		if (this.parent && this.parent.operation && this.editingMode != "lookup") {
			return;	
		}

		this.beginEditUpdate();
		this.dataSet = inDataSet;
		var d = this.getItemData();
		this.populateEditors();
		this.endEditUpdate();
		this.setDataOutput(d);
		this.liveFormChanged();
	},
	getSourceId: function(){
		try{
			return this.components.binding.wires.dataSet.source;
		}
		catch(e){
			// do nothing.
		}

		return "";
	},
	setDataOutput: function(inDataSet) {
		this.dataOutput.setDataSet(inDataSet);
	},
	clearDataOutput: function() {
		dojo.forEach(this.getRelatedEditorsArray(), function(e) {
		    e.clearDataOutput();
		});
	    this.dataOutput.setData({});
	},
	getItemData: function() {
		return wm.fire(this.dataSet, "getCursorItem");
	},
	// FIXME: store this explicitly?
	_getDataType: function() {
		var t = (this.dataSet || 0).type;
		if (!wm.typeManager.isStructuredType(t)) {
			var v = this.getLiveVariable();
			t = v && v.type;
		}
		if (wm.typeManager.isStructuredType(t))
			return t;
	},
	// get the liveVariable related to this dataSet
	// currently just checks if dataSet is a liveVariable
	// currently does not check for subNards that may be part of a dataSet
	getLiveVariable: function() {
		// Not sure why we were not checking for liveVariable instance in the object itself,
		// before digging deep and trying to find liveVariable elsewhere. 
		/*
		if (this.liveVariable && wm.isInstanceType(this.liveVariable, wm.LiveVariable))
			return this.liveVariable;
		*/
		var
			s = this.dataSet,
			o = s && s.owner,
			ds = null;
		  o = o && !(wm.isInstanceType(o, wm.Variable)) ? o : null;
			
			if (o){
				try{
					if (o instanceof wm.DojoGrid){
						ds = o.variable;
					} else {
						ds = o.dataSet;
					}
				} catch(e) {
					// This might happen if wm.DojoGrid class itself is not loaded.
					ds = o.dataSet;
				}
			}
			// if source not owned by a variable but it has a dataSet, use it if it's a LiveVariable
	        
			if (o && ds && wm.isInstanceType(ds, wm.LiveVariable)) {
				return ds;
		}
		// otherwise walk owners to look for a LiveVariable
		while (s) {
			if (wm.isInstanceType(s, wm.LiveVariable)) {
				return s;
			}
			s = s.owner;
			if (!(wm.isInstanceType(s.owner, wm.Variable))) {
				break;
			}
		}
	},
	beginEditUpdate: function() {
		this.dataOutput.beginUpdate();
		dojo.forEach(this.getFormEditorsArray(), function(e) {
			wm.fire(e, "beginEditUpdate");
		});
	},
	endEditUpdate: function() {
		this.dataOutput.endUpdate();
		dojo.forEach(this.getFormEditorsArray(), function(e) {
			wm.fire(e, "endEditUpdate");
		});
	},
	liveFormChanged: function() {
		dojo.forEach(this.getFormEditorsArray(), function(e) {
		    wm.fire(e, "doOnchange");
		    wm.fire(e, "clearDirty");
		});
	},
	//===========================================================================
	// Editor management
	//===========================================================================
	populateEditors: function() {
		var i = this.getItemData(), data = i ? i.getData() : null;
	    dojo.forEach(this.getFormEditorsArray(), dojo.hitch(this, function(e) {
			if (wm.isInstanceType(e, wm.LiveFormBase)) {
			    /* Don't populate lookup related editors if we're in the middle of the owner's operationSucceeded method because
			     * this populates the editor with value="" which is invalid and shows the invalid indicator */
			    if (e.editingMode != "lookup" || !this._operationSucceeded)
				    wm.fire(e, "populateEditors");
			    }
			} else {
                            if (wm.Lookup && e instanceof wm.Lookup && (!e.dataSet || !e.dataSet.type)) 
                                e.setAutoDataSet(e.autoDataSet);

			    wm.fire(e, "setDataValue", [e.formField && data ? data[e.formField] : data]);
			} 
		        }));
	},
	populateDataOutput: function() {
                if (this.dataSet && this.dataOutput.type != this.dataSet.type)
                    this.dataOutput.setType(this.dataSet.type);
		var d = this.dataOutput;
	    d.setIsList(false); // sanity test
	    dojo.forEach(this.getFormEditorsArray(), dojo.hitch(this, function(e) {
			if (wm.isInstanceType(e, wm.LiveFormBase)) {
                            wm.fire(e, "populateDataOutput"); // this.dataOutput will be updated via bindings once e has been updated
			}else if (e.formField) {
				d.setValue(e.formField, e.getDataValue());
			} else if (this instanceof wm.RelatedEditor) {
                            d.setData(e.getDataValue());
                        }
	    }));
            return this.dataOutput;
	},
	editStarting: function() {
		dojo.forEach(this.getFormEditorsArray(), function(e) {
			wm.fire(e, "editStarting");
		});
	},
	editCancelling: function() {
		dojo.forEach(this.getFormEditorsArray(), function(e) {
			wm.fire(e, "editCancelling");
		});
	},
	/**
		Clear all editors.
		As usual, the data clear is a change propagated via 
		bindings. So, typically, <i>dataOutput</i> is cleared too.
	*/
	clearData: function() {
		dojo.forEach(this.getFormEditorsArray(), function(e) {
			wm.fire(e, "clear");
		});
		// FIXME: handle related editors specially
		dojo.forEach(this.getRelatedEditorsArray(), function(e) {
			wm.fire(e, "clearData");
		});
	},
	setDefaultOnInsert: function() {
		dojo.forEach(this.getFormEditorsArray(), function(e) {
			wm.fire(e, "setDefaultOnInsert");
		});
		/*
		// FIXME: handle related editors specially
		dojo.forEach(this.getRelatedEditorsArray(), function(e) {
			wm.fire(e, "setDefaultOnInsert");
		});
		*/
	},
	getEditorsArray: function() {
		return wm.getMatchingFormWidgets(this, function(w) {
		    return (wm.isInstanceType(w, wm.Editor) || wm.isInstanceType(w, wm.AbstractEditor));
		});
	},
	// FIXME: handle related editors specially
	getRelatedEditorsArray: function(inContainer) {
		return wm.getMatchingFormWidgets(this, function(w) {
			return (wm.isInstanceType(w, wm.RelatedEditor));
		});
	},
	getFormEditorsArray: function() {
		return wm.getMatchingFormWidgets(this, function(w) {
			//return ((w instanceof wm.Editor && w.formField !== undefined) || w instanceof wm.RelatedEditor);
			return (w.formField !== undefined);
		});
	},
	_getEditorBindSourceId: function(inSourceId) {
		var parts = (inSourceId || "").split(".");
		parts.pop();
		return parts.join('.');
	},
	_getEditorBindSource: function(inSourceId) {
		var parts = (inSourceId || "").split(".");
		parts.pop();
		var
			s = parts.join('.'),
			v = this.getValueById(s);
		if (wm.isInstanceType(v, wm.Editor) || wm.isInstanceType(v, wm.RelatedEditor))
			return v;
	},
	// get editors bound to dataOutput
	getBoundEditorsArray: function() {
		var editors = [];
		// get editors bound to dataOutput
		var wires = this.$.binding.wires;
		for (var i in wires) {
			w = wires[i];
			if (!w.targetId && w.targetProperty.indexOf("dataOutput") == 0) {
				e = this._getEditorBindSource(w.source);
				if (e)
					editors.push(e);
			}
		}
		return editors;
	},
	//===========================================================================
	// Editor setters
	//===========================================================================
	canChangeEditorReadonly: function(inEditor, inReadonly, inCanChangeFunc) {
	    if (inEditor instanceof wm.AbstractEditor && inEditor.ignoreParentReadonly ||
		inEditor instanceof wm.RelatedEditor   && inEditor.ignoreParentReadonly && inEditor.editingMode == "editable subform") {
		return false;
	    }
	    var c = dojo.isFunction(inCanChangeFunc);
	    return !c || inCanChangeFunc(inEditor, this, inReadonly);
	},
	_setReadonly: function(inReadonly, inCanChangeFunc) {
		dojo.forEach(this.getFormEditorsArray(), function(e) {
			if (this.canChangeEditorReadonly(e, inReadonly, inCanChangeFunc))
				e.setReadonly(inReadonly);
		}, this);
		// FIXME: handle related editors specially
		dojo.forEach(this.getRelatedEditorsArray(), function(e) {
			if (this.canChangeEditorReadonly(e, inReadonly, inCanChangeFunc))
				e._setReadonly(inReadonly, inCanChangeFunc);
		}, this);
	},
	setReadonly: function(inReadonly) {
		this.readonly = inReadonly;
		this._setReadonly(inReadonly);
	},
	setCaptionSize: function(inSize) {
		this.captionSize = inSize;
		dojo.forEach(this.getEditorsArray(), function(e) {
			e.setCaptionSize(inSize);
		});
		
		dojo.forEach(this.getRelatedEditorsArray(), function(e) {
			e.setCaptionSize(inSize);
		});
	},
	setCaptionUnits: function(inUnits) {
		this.captionUnits = inUnits;
		dojo.forEach(this.getEditorsArray(), function(e) {
			e.setCaptionUnits(inUnits);
		});
	},
	setCaptionAlign: function(inAlign) {
		this.captionAlign = inAlign;
		dojo.forEach(this.getEditorsArray(), function(e) {
			e.setCaptionAlign(inAlign);
		});
	},
	setCaptionPosition: function(pos) {
	    var oldPos = this.captionPosition;
	    this.captionPosition = pos;

	    if ((oldPos == "left" || oldPos == "right") && (pos == "bottom" || pos == "top")) {
		if (this.editorHeight.match(/px/) && parseInt(this.editorHeight) < 48)
		    this.editorHeight = "48px";
		this.captionSize = "28px";
	    } else if ((pos == "left" || pos == "right") && (oldPos == "bottom" || oldPos == "top")) {
		if (this.editorHeight.match(/px/) && parseInt(this.editorHeight) >= 48)
		    this.editorHeight = wm.AbstractEditor.prototype.height;
	    
		if (this.captionSize.match(/px/) && parseInt(this.captionSize) < 100) {
		    this.captionSize = "100px";
		}
	    }


		dojo.forEach(this.getEditorsArray(), function(e) {
		    e.setCaptionPositionLF(pos);
		});
	},
	setEditorWidth: function(inEditorWidth) {
		this.editorWidth = inEditorWidth;
		dojo.forEach(this.getEditorsArray(), function(e) {
                    if (e.parent.horizontalAlign != "justified")
			e.setWidth(inEditorWidth);
		});
		dojo.forEach(this.getRelatedEditorsArray(), function(e) {
			e.setWidth(inEditorWidth);
		});

	},
	setEditorHeight: function(inEditorHeight) {
		this.editorHeight = inEditorHeight;
		dojo.forEach(this.getEditorsArray(), function(e) {
			e.setHeight(inEditorHeight);
		});
	},
	valueChanged: function(inProp, inValue) {
		// FIXME: disallow change messages from being set on our variable properties
		// they send these messages themselves when they change...
		if (wm.isInstanceType(this[inProp], wm.Variable))
			return;
		else
			this.inherited(arguments);
	},
	getViewDataIndex: function(inFormField) {
		return inFormField;
	},
    // Deprecated
       validateData: function() {
	   var widget = this.getInvalidWidget();
	   if (!widget) return true;
	   app.alert(wm.getDictionaryItem("wm.LiveForm.INVALID_EDITOR", {caption: widget.caption}));
	       
	   return true;
       },
	//===========================================================================
	// Data Navigation API
	//===========================================================================
	getRecordCount: function() {
		return wm.fire(this.getDataSource(), "getCount");
	},
	getDataSource: function() {
		if (!this._dataSource) {
			var
				b = this.$ && this.$.binding,
				v = (b && b.wires["dataSet"] || 0).source;
			this._dataSource = v && this.getValueById(v);
		}
		return this._dataSource;
	},
	setRecord: function(inIndex) {
		wm.fire(this.getDataSource(), "setCursor", [inIndex]);
	},
	setNext: function() {
		wm.fire(this.getDataSource(), "setNext");
	},
	setPrevious: function() {
		wm.fire(this.getDataSource(), "setPrevious");
	},
	setFirst: function() {
		wm.fire(this.getDataSource(), "setFirst");
	},
	setLast: function() {
		wm.fire(this.getDataSource(), "setLast");
	},
	getIndex: function() {
		return (this.getDataSource() || 0).cursor || 0;
	}
});

dojo.declare("wm.SimpleForm", wm.LiveFormBase, {
});

/**
	LiveForm displays a set of editors for a data type.
	LiveForm's editors display the data in its <i>dataSet</i> property.
	Output data is provided via the <i>dataOutput</i> property.
	LiveForm can directly perform operations on the dataOuput without the need for additional services,
	it generates a set of editors automatically.
	An additional <i>editPanel</i> widget is added by default so that operations are available without additional user setup.
	@name wm.LiveForm
	@class
	@extends wm.LiveFormBase
*/
dojo.declare("wm.LiveForm", wm.LiveFormBase, {
	/**
		@lends wm.LiveForm.prototype
	*/
    saveOnEnterKey: true,
    alwaysPopulateEditors: false,
        margin: "0",
	defaultButton: "", /* deprecated */
	displayErrors: true,
	// process editing via liveData API
	// if this setting is off, users can manually handle editing events
	// and editor readonly/required states are not managed automatically
	// other than being toggled on/off when editing starts/stops
	liveEditing: true,
	liveSaving: true,
	liveVariable: null,
	liveDataSourceClass: null, //xxx
        //noButtonPanel: false,
        //editPanelStyle: "wm.Button",
    confirmDelete: "Are you sure you want to delete this data?",
	_controlSubForms: false,
	destroy: function() {
		this._cancelOnEnterKey();
		this.inherited(arguments);	    
	},
	init: function() {	    
		this.connect(this.domNode, "keypress", this, "formkeypress");
		// bc
		this.canBeginEdit = this.hasEditableData;
		this.inherited(arguments);
	},

	postInit: function() {
		this.inherited(arguments);
		this.initLiveVariable();
		// BC: if captionSize contains only digits, append units
		if (String(this.captionSize).search(/\D/) == -1)
			this.captionSize += this.captionUnits;
		// BC: if editorSize contains only digits, append units
		if (String(this.editorSize).search(/\D/) == -1)
			this.editorSize += this.editorSizeUnits;
		//
		if (this.liveEditing && !this.isDesignLoaded())
			this.setReadonly(this.readonly);
	},
	initLiveVariable: function() {
		var lv = this.liveVariable = new wm.LiveVariable({
			name: "liveVariable",
			owner: this,
			liveSource: (this.dataSet || 0).type,
			autoUpdate: false
		});

		this.connect(lv, "onBeforeUpdate", this, "beforeOperation");
		this.connect(lv, "onSuccess", this, "operationSucceeded");
		this.connect(lv, "onResult", this, "onResult");
		this.connect(lv, "onError", this, "onError");
	},
	setLiveEditing: function(inLiveEditing) {
	        this.liveEditing = inLiveEditing;
	},
	//===========================================================================
	// Form data
	//===========================================================================
	setDataSet: function(inDataSet) {
	    if (this.dataSet && this.operation && !this.alwaysPopulateEditors)
		return;
	    if (this.liveVariable && inDataSet && inDataSet.type)
		this.liveVariable.setLiveSource(inDataSet.type);
	    this._cancelOnEnterKey();
	    this.inherited(arguments, [inDataSet]);

	    if (!this.readonly) {
		wm.getMatchingFormWidgets(this, function(w) {
		    if (w instanceof wm.Editor || 
			w instanceof wm.AbstractEditor ||
			w instanceof wm.RelatedEditor) {
			w.validate();
		    }});
	    }
	},
	//===========================================================================
	// Edit API
	//===========================================================================
	/**
		Clear the form's editors and make them editable.
		Fires <i>onBeginInsert</i> event.
	*/
	beginDataInsert: function() {
		// Note: must clear dataOutput so that it's in a fresh state for insert
		// this is because we may have stale data from a previous setting that's not
		// cleared via clearing editors.
		// Because of this, any statically set / bound value to dataOutput will be blown away.
		this.clearDataOutput();
		this.beginEditUpdate();
		this.clearData();
		this.endEditUpdate();
		this.beginEdit("insert");
		this.setDefaultOnInsert();
		this.onBeginInsert();
		this.validate();
		return true;
	},
	/**
		Make the form's editors and editable.
		Fires <i>onBeginUpdate</i> event.
	*/
	beginDataUpdate: function() {
		this.beginEdit("update");
		this.populatePickList(); //xxx
		this.onBeginUpdate();
		return true;
	},
	beginEdit: function(inOperation) {
		this.editStarting();
		this.operation = inOperation;
		if (this.liveEditing) {
			if (this.hasLiveService())
				this._setReadonly(false, dojo.hitch(this, "_canChangeEditorReadonly", [inOperation]));
			else
				this.setReadonly(false);
		}
	},
	endEdit: function() {
		if (this.liveEditing)
			this.setReadonly(true);
	    this.operation = null;
	},
	/**
		Cancels an edit by restoring the editors to the data from the <i>dataSet</i> property.
	*/
	cancelEdit: function() {
		this.editCancelling();
		var d = this.getItemData();
		this.beginEditUpdate();
		//this.clearData();
		this.dataOutput.setData(d);
		this.endEditUpdate();
		//wm.fire(this.dataSet, "notify");
		this.populateEditors();
		this.onCancelEdit();
		this.endEdit();
	},
	// editors that should not be changed during an edit should remain readonly
	_canChangeEditorReadonly: function(inOperations, inEditor, inForm, inReadonly) {
	    if (inEditor instanceof wm.RelatedEditor && inEditor.editingMode == "editable subform" && inEditor.ignoreParentReadonly)
		return false; // devs must set readonly explicitly and must know what they are doing; some danger to editing subforms

	    if ((wm.isInstanceType(inEditor, wm.Editor) || wm.isInstanceType(inEditor, wm.AbstractEditor)) && inEditor.formField) {
			var
				f = inEditor.formField,
				dt = inForm.dataSet.type,
				s = wm.typeManager.getTypeSchema(dt),
				pi = wm.typeManager.getPropertyInfoFromSchema(s, f),
				ops = inOperations;
			if (!f)
				return true;
			// NOTE: if an editor should be excluded or not changed 
			// for given operation then it should remain read only.
			//
			// NOTE: exclude is use for inserts only so 
			// we can simply leave it read only since the editor will be blank
			var
				// this field should not be changed for the given operations
				noChange = pi && dojo.some(pi.noChange, function(i) { return (dojo.indexOf(ops, i) > -1)}),
				// this field should not be excluded for the given operations
				exclude = pi && dojo.some(pi.exclude, function(i) { return (dojo.indexOf(ops, i) > -1)});
			if (!inReadonly && (noChange || exclude))
				return false;
		}
		return true;
	},
	//===========================================================================
	// Data Verification
	//===========================================================================
	hasLiveService: function() {
		return Boolean(wm.typeManager.getLiveService((this.dataSet || 0).type));
	},
	hasEditableData: function() {
		var v = this.dataOutput;
		return !this.liveEditing || (v && wm.typeManager.getLiveService(v.type) && wm.data.hasIncludeData(v.type, v.getData()));
	},
	//===========================================================================
	// Editing server interaction
	//===========================================================================
	_getDeferredSuccess: function() {
		var d = new dojo.Deferred();
		d.callback(true);
		return d;
	},
		 
    saveDataIfValid: function() {
	if (this.getInvalid()) return;
	return this.saveData();
    },
	saveData: function() {
/* please use saveDataIfValid instead of validateBeforeSave
 	        if (this.validateBeforeSave)
		  if (!this.validateData()) 
		    return;
		    */  
		if (this.operation == "insert")
			return this.insertData();
		if (this.operation == "update")
			return this.updateData();
	},
	/**
		Performs an insert operation based on the data in the
		<i>dataOutput</i> property.
	*/
	insertData: function() {
		return this.doOperation("insert");
	},
	/**
		Performs an update operation based on the data in the
		<i>dataOutput</i> property.
	*/
	updateData: function() {
		return this.doOperation("update");
	},
	/**
		Performs a delete operation based on the data in the
		<i>dataOutput</i> property.
	*/
	deleteData: function() {
	    var f = dojo.hitch(this,function() {
		this.onBeginDelete()
		return this.doOperation("delete");
	    });

	    if (!this.confirmDelete) {
		f();
	    } else {
		app.confirm(this.confirmDelete, false,
			    f,
			    dojo.hitch(this,function() {
				this.cancelEdit();
			    }));

	    }
	},
	doOperation: function(inOperation) {
		this.populateDataOutput();
		var data = this.dataOutput.getData();
		if (this.liveSaving) {
			var lv = this.liveVariable;

                    // for whatever reason, the livevariable has not been properly setup
                    if (lv.type != this.dataOutput.type) {
			lv.setLiveSource(this.dataOutput.type);
                    }
			lv.setOperation(inOperation);
			lv.sourceData.setData(this.dataOutput.getData());
			return lv.update();
		} else {
			switch (this.operation) {
				case "insert":
					this.onInsertData();
					break;
				case "update":
					this.onUpdateData();
					break;
				case "delete":
					this.onDeleteData();
					break;
			}
			this.endEdit();
			return this._getDeferredSuccess();
		}
	},
	operationSucceeded: function(inResult) {
		// if we get result as an array, take the frist one
		if (dojo.isArray(inResult))
			inResult = inResult[0];
		var op = this.liveVariable.operation;
		//
		if (op == "insert" || op == "delete")
			this.dataSet.cursor = 0;
		if (op == "insert" || op == "update") {
			var item = this.getItemData();
		        this._operationSucceeded = true;
		        try {
			    wm.fire(item, "setData", [inResult]);
			} catch(e) {}
		        delete this._operationSucceeded;
			// PV: If item is equal to this.dataSet that means by calling setData on it, setData will have already called notify.
			// Therefore, there's no need to call an extra notify.
			if (item != this.dataSet)
				wm.fire(this.dataSet, "notify");
			
			//dojo.publish(this.dataSet.getRuntimeId()+'-liveform-'+op, [inResult]);
		}
		//
		switch (op) {
			case "insert":
				this.onInsertData(inResult);
				break;
			case "update":
				this.onUpdateData(inResult);
				break;
			case "delete":
				this.beginEditUpdate();
				this.clearData();
				this.endEditUpdate();
				this.onDeleteData(inResult);
				break;
		}
		this.onSuccess(inResult);
		this.endEdit();
	},
	beforeOperation: function() {
		this.onBeforeOperation(this.liveVariable.operation);
	},
	//===========================================================================
	// Form management
	//===========================================================================
	getSubFormsArray: function() {
		var forms = [], w;
		for (var i in this.widgets) {
			w = this.widgets[i];
			if (wm.isInstanceType(w, wm.LiveForm)) {
				forms.push(w);
				forms = forms.concat(w.getSubFormsArray());
			}
		}
		return forms;
	},
	clearData: function() {
		this.inherited(arguments);
		if (this._controlSubForms)
			dojo.forEach(this.getSubFormsArray(), function(f) {
				f.clearData();
			});
	},
	_setReadonly: function(inReadonly, inCanChangeFunc) {
		this.inherited(arguments);
		if (this._controlSubForms)
			dojo.forEach(this.getSubFormsArray(), function(f) {
				f.setReadonly(inReadonly);			    
			});
	},
	//===========================================================================
	// Default Button Processing
	//===========================================================================
	forceValidation: function() {
		dojo.forEach(this.getEditorsArray(), function(e) {
			wm.fire(e.editor, "changed");
		});
		this.validate();
	},
        formkeypress: function(e) {
		// don't process enter for textareas
		if (e.keyCode == dojo.keys.ENTER && e.target.tagName != "TEXTAREA") {  
		    this._onEnterKeyHandle = setTimeout(dojo.hitch(this, function() {
			this._onEnterKeyHandle = null;
			this._doOnEnterKey();
		    }), 50); 
		}
	},
	_doOnEnterKey: function() {

	    /* Deprecated */
	    var d = this.defaultButton;
	    if (d) {
		this.forceValidation();
		if (!d.disabled)
		    wm.fire(d, "onclick");
	    }
	    /* END Deprecated */

	    if (this.saveOnEnterKey)
		this.saveDataIfValid();
	},
        _cancelOnEnterKey: function() {
		if (this._onEnterKeyHandle) {
			clearTimeout(this._onEnterKeyHandle);
			this._onEnterKeyHandle = null;
		}
	},

	//===========================================================================
	// functions to support Salesforce
	//===========================================================================

	//populate options for pick list type fields for Salesforce
	populatePickList: function() { //xxx
		var targets = {};
		var targetElements = [];
		wm.forEach(this.widgets, function(e) {
			if (e.subType != null && e.subType != undefined && (e.subType == "picklist" || e.subType == "boolean")) {
				targetElements.push(e);
				var val = e.getDataValue();
				targets[e.formField] = val;
			}
		});	

		if (!wm.isEmpty(targets)) {
			var page = this.getParentPage();
			try {
				page.sforceRuntimeService.requestSync("getPickLists", [this.liveDataSourceClass, targets], 
											dojo.hitch(this, "updatePickList", targetElements),
											dojo.hitch(this, "sforceRuntimeServiceError"));         
			} catch(e) {
				console.error('ERROR IN populatePickList: ' + e); 
			} 			
		}
	},

	updatePickList: function(elements, inResult) { //xxx
		dojo.forEach(elements, function(e) {
			if (e.subType == "picklist") {
				var dataSet = inResult[e.formField];
				e.editor.setOptionSet(dataSet.options);
				e.setDataValue(dataSet["default"].dataValue);
			}
		});
	},

	sforceRuntimeServiceError: function(inError) { //xxx
	    /* TODO: Localize this... though probably not accessable to users */
	    app.alert("sforceRuntimeServiceError error = " + inError);
	},
	
	//===========================================================================
	// Events
	//===========================================================================
	onBeginInsert: function() {
	},
	onInsertData: function() {
	},
	onBeginUpdate: function() {
	},
	onUpdateData: function() {
	},
	onBeginDelete: function() {
	},
	onDeleteData: function() {
	},
	onCancelEdit: function() {
	},
	onBeforeOperation: function(inOperation) {
	},
	onSuccess: function(inData) {
	},
	onResult: function(inData) {
	},
	onError: function(inError) {
	    wm.logging && console.error(inError);
	    if (this.displayErrors) {
		app.alert(wm.getDictionaryItem("wm.LiveForm.ONERROR", {error: dojo.isString(inError) ? inError : inError.message || "??"}));
	    }
	}
});
