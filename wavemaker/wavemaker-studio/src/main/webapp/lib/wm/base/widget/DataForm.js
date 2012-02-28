/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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

/* 
 * TODO: Determine when to generate a wm.Lookup and when a wm.SubForm

 */

dojo.provide("wm.base.widget.DataForm");
dojo.require('wm.base.lib.data');

/* Use this to search the given container for widgets matching the function inMatch; typically used to find
 * editors in the container
 */
wm.getMatchingFormWidgets = function(inForm, inMatch) {
	var match = [];
	wm.forEach(inForm.widgets, function(w) {
			if (inMatch(w))
				match.push(w);
	    if (w instanceof wm.Container && w instanceof wm.LiveFormBase == false && w instanceof wm.DataForm == false) 
				match = match.concat(wm.getMatchingFormWidgets(w, inMatch));
		});
		return match;
};


/* Used by RelatedEditor/SubForm and wm.Lookup */
wm.getDataFormLiveView = function(inForm) {
    var lv = inForm && (inForm.findLiveVariable && inForm.findLiveVariable() || inForm.getDataSetServiceVariable && inForm.getDataSetServiceVariable());
	return lv && lv.liveView;
}



/*************************************************************************
 * CLASS: wm.FormPanel
 * DESCRIPTION: Used to layout forms
 * USE CASES:
 *    1. A user wants to put editors on a page where different editors may be associated with different vars/servicevars
 *    2. A user wants to put editors on a page that are used for local effect rather than services
 *    3. A user wants to put inputs to a serviceVar in different parts of the page and just needs
 *       good rendering support
 *
 * NOTE: This form class does not support the formField property
 *
 * FUTURE WORK:
 *    1. This may migrate to becoming a part of wm.Container, and we could add a property to Container
 *       such as "enableFormProperties"
 *************************************************************************/
dojo.declare("wm.FormPanel", wm.Container, {
    margin: "0",
    padding: "2",
    editorHeight: "26px",
    editorWidth: "100%",
    captionSize: "150px",
    captionAlign: "right",
    captionPosition: "left",
    height: "250px",
    width: "100%",
    //fitToContent: true,
    layoutKind: "top-to-bottom",
    readonly: false,

    /****************
     * METHOD: getEditorsArray (PUBLIC)
     * DESCRIPTION: Returns an array of all editors inside of this form.
     * NOTE: Subclasses may override this method to only return editors with formFields
     ***************/
    getEditorsArray: function() {
	return wm.getMatchingFormWidgets(this, function(w) {
	    return w instanceof wm.AbstractEditor;
	});
    },

    /****************
     * METHOD: canChangeEditorReadonly (PRIVATE)
     * DESCRIPTION: Returns true if the Form is allowed to change the readonly state of the editor.
     *              Returns false if editor has ignoreParentReadonly property.
     *              Else returns value of inCanChangeFunc if provided
     ***************/
    canChangeEditorReadonly: function(inEditor, inReadonly, inCanChangeFunc) {
	if (inEditor.ignoreParentReadonly) return false;
	var c = dojo.isFunction(inCanChangeFunc);
	return !c || inCanChangeFunc(inEditor, this, inReadonly);
    },

    /****************
     * METHOD: _setReadonly (PRIVATE)
     * DESCRIPTION: Changes the readonly state for all editors in the form
     ***************/
    	_setReadonly: function(inReadonly, inCanChangeFunc) {
		dojo.forEach(this.getEditorsArray(), function(e) {
		    if (!e.ignoreParentReadonly) {
			if (this.canChangeEditorReadonly(e, inReadonly, inCanChangeFunc)) {
			    e.setReadonly(inReadonly);
			} else {
			    e.setReadonly(!inReadonly); // if its not allowed to change it to inReadonly, then presumably its supposed to be !inReadonly
			}
		    }
		}, this);
	},

    /****************
     * METHOD: setReadonly (PUBLIC)
     * DESCRIPTION: Changes the readonly state for all editors in the form
     ***************/
    setReadonly: function(inReadonly) {
	this.readonly = inReadonly;
	this._setReadonly(inReadonly);
    },


    /****************
     * METHOD: setCaptionSize (PUBLIC)
     * DESCRIPTION: Changes size of the caption measured in "px"
     ***************/
    setCaptionSize: function(inSize) {
	this.captionSize = inSize;
	dojo.forEach(this.getEditorsArray(), function(e) {
	    e.setCaptionSize(inSize);
	});
    },

    /****************
     * METHOD: setCaptionAlign (PUBLIC)
     * DESCRIPTION: Changes horizontal alignment of the caption
     ***************/
    setCaptionAlign: function(inAlign) {
	this.captionAlign = inAlign;
	dojo.forEach(this.getEditorsArray(), function(e) {
	    e.setCaptionAlign(inAlign);
	});
    },

    /****************
     * METHOD: setCaptionPosition (PUBLIC)
     * DESCRIPTION: Changes caption position to top, bottom, left, right
     ***************/
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

    /****************
     * METHOD: setEditorWidth (PUBLIC)
     * DESCRIPTION: Changes width of every editor
     ***************/
    setEditorWidth: function(inEditorWidth) {
	this.editorWidth = inEditorWidth;
	dojo.forEach(this.getEditorsArray(), function(e) {
            if (e.parent.horizontalAlign != "justified")
		e.setWidth(inEditorWidth);
	});
    },

    /****************
     * METHOD: setEditorHeight (PUBLIC)
     * DESCRIPTION: Changes height of every editor
     ***************/
    setEditorHeight: function(inEditorHeight) {
	this.editorHeight = inEditorHeight;
	dojo.forEach(this.getEditorsArray(), function(e) {
	    e.setHeight(inEditorHeight);
	});
    },

    // don't really need this...
	getEditorParent: function() {
		return this;
	},
    
    _end: 0
});




/*************************************************************************
 * CLASS: wm.DataForm
 * DESCRIPTION: Extends FormPanel to add support for
 *    1. type: setting the type generates editors for your form.  This field is optional.
 *             Binding the dataSet implicitly sets/changes type.  But devs
 *             who don't want to use dataSet (or aren't ready to yet) can just generate
 *             all editors by setting type.
 *    2. dataSet: Setting the dataSet sets the type and generates forms.  It
 *             also causes all editors to be populated with values from the dataSet
 *             any time the dataSet changes.  Developer can bind a dataSet to pass in new data.
 *    3. dataOutput: The Form has a dataOutput value corresponding to the current
 *             value of the form fields. Developer can bind dataOutput to Service/Live Vars 
 *             for easy passing of form data to the server.  Currently requires a call
 *             to getDataOutput to update the dataOutput with latest values so binding
 *             doesn't get fired onChange but does simplify making connections.
 *    4. onDataSetChanging: Event handler lets you change the data coming into your form before the editors
 *             are populated.
 *    5. onDataSetChanged: Lets you trigger events each time the form gets new data.
 * NOTE: This class does NOT come with a ServiceVariable/LiveVariable.  It is the developer's
 *       job to manage all client/server communications.
 * NOTE: This form class requires its editors to use the formField property
 * NOTE: Developers don't need to call any methods to allow the user to start editing, but
 *       calls to editNewObject and editCurrentObject will check type info for each editor's formField and
 *       make editors readonly if they have primary keys, autogen keys, etc... as per liveEditing. Will also trigger
 *       defaultInsert property for all editors.
 *
 * USE CASES:
 *    1. A user wants to edit a database entry, but wants to control the LiveVariable that is used
 *       to insert/update/delete.  This Form provides a dataSet bound to a source wm.Variable or 
 *       LiveVar for passing in values and a dataOutput for binding to your insert/update/delete Variable.
 *    2. A user wants a form with some typing information, but may not have a dataSet
 *
 * Essentially, this form class is designed to be our most flexible class for users who do not want to be 
 * constrained or do not want to figure out a lot of confusing properties.  The user must manage all client/server 
 * communication.
 *    
 *************************************************************************/

dojo.declare("wm.DataForm", wm.FormPanel, {
    dataSet: null,
    dataOutput: null,
    type: "",
    setReadonlyOnPrimaryKeys: true,
    confirmChangeOnDirty: "Unsaved changes will be lost; continue?",
    noDataSet: true,

    /* Deterimes whether populate methods or bindings are used for this form;
     * these are writeonly properties that advanced users can change, but are more commonly
     * going to be changed by subclassing.
     * Defaults chosen as follows:
     * generateInputBindings: The input bindings mean that the editor's are bound to the dataSet.  
     *   PROS: Using bindings means that the developer can easily manipulate these
     *   CONS: Each time a selected item changes, we fire every dataSet binding once, and because editor values change, we fire every dataOutput binding once as well. Populate method is more efficient
     *   CONS: Can't block changing editor values when in the middle of editing when the dataSet changes
     *   PHILOSOPHY BEHIND DECISION: DataForm is the do-it-yourself form.  Any inconveniences that come with DataForm err on the side
     *                               of putting the developer in control.
     *   Default value: true
     *
     *
     * generateOutputBindings: The output bindings mean that the editors are bound to dataOutput, 
     *                         and don't depend upon populateDataOutput methods.
     * PROS: Users expect the form value to update any time an editor value changes.
     * CONS: Each time the dataSet changes, we have many bindings that must fire
     */
    generateInputBindings: true,
    generateOutputBindings: true,

    /****************
     * METHOD: Init (PRIVATE)
     * DESCRIPTION: 
     *         Create our dataOutput wm.Variable.  Note that we don't create the dataSet wm.Variable;
     *         thats just a pointer to a source var owned by someone else
     ***************/
    init: function() {
	this.dataOutput = new wm.Variable({name: "dataOutput", owner: this, type: this.type, _allowLazyLoad: false});
	this.dataSet = new wm.Variable({name: "dataSet", owner: this, type: this.type});
	this.inherited(arguments);
    },


    /****************
     * METHOD: postInit (PRIVATE)
     * DESCRIPTION: When the form is loaded at runtime, populate the editors with their dataSet.
     *              postInit is called AFTER any bindings owned by this form are evaluated, so dataSet
     *              may well have been called already. 
     * TODO: Check if setDataSet call from binding makes calling populateEditors unnecessary.
     ***************/
    postInit: function() {
	this.inherited(arguments);
	if (wm.pasting)
	    wm.fire(this, "designPasted");
	if (!this.generateInputBindings)
	    this.populateEditors();
    },

    _setReadonly: function(inReadonly, inCanChangeFunc) {
	this.inherited(arguments);
	dojo.forEach(this.getRelatedEditorsArray(), function(e) {
	    e.setReadonly(inReadonly);
	});
    },

    doConfirmChangeOnDirty: function(inDataSet) {
	/* If there is a confirmChangeOnDirty message (no confirmation dialogs ever if no message);
	 * If the form has changes;
	 * And if inDataSet isn't the same as this.dataSet
	 * And if we haven't disabled the confirmation temporarily
	 * then ask the user to confirm and return true; else return false for no confirmation need
	 */
	if (!this._isDesignLoaded && !this._skipChangeOnDirty && this.confirmChangeOnDirty && this.getIsDirty()) {
		app.confirm(this.confirmChangeOnDirty, false, dojo.hitch(this, function() {
		    this.clearDirty();
		    this.setDataSet(inDataSet);
		}));
		return true;
	}
	return false;
    },

    setDataOutput: function(inDataSet) {
	if (this.dataOutput) {
	    this.dataOutput.setDataSet(inDataSet);
	}
    },

    /****************
     * METHOD: setDataSet (PUBLIC)
     * DESCRIPTION: Pass in a dataSet; editors should be updated to show that dataSet.
     ***************/
    setDataSet: function(inDataSet) {
	/* I don't know what this test is for, but something to do with RelatedEditors testing
	 * to see if they are in a parent form with its own operation.  Probably not needed
	 if (this.parent && this.parent.operation){
	 return;	
	 }*/

	if (this.doConfirmChangeOnDirty(inDataSet))
	    return;

	if (inDataSet) {
	    this.onDataSetChanging(inDataSet.getCursorItem().getData());
	}

	/* It used to be we'd pass in the entire dataSet, and then the developer could use the cursor to edit different items 
	 * in the dataSet.  But that was when this.dataSet == page.liveVariable1; instead we are copying all of the data from
	 * page.liveVariable1 INTO this.dataSet, and we don't need to copy 500 items to edit just the one item.
	 */
	this.dataSet.setDataSet(inDataSet ? inDataSet.getCursorItem() : null);

	if (inDataSet && this.dataOutput.type != inDataSet.type)
	    this.dataOutput.setType(this.dataSet.type);

	/* Get the current wm.Variable item */
	var d = this.dataSet;
	
	/* Disable binding and onchange events, put data in the editors and then reenable bindings/change events */
	if (!this.generateInputBindings) {
	    this.beginEditUpdate();
	    this.populateEditors();
	    this.endEditUpdate();
	}
	
	/* The outputData is the value of all of the editors; at the time of setDataSet, the outputData is either the same
	 * as inDataSet, or its an item from inDataSet... until the user starts making changes
	 */
	if (!this.generateOutputBindings) {
	    this.dataOutput.setData(d);
	    this.liveFormChanged();
	}
	this.updateNoDataSet(d.getData());
	this.onDataSetChanged(this.dataSet.getData());
    },
    updateNoDataSet: function(inData) {
	if (!inData) {
	    this.valueChanged("noDataSet", this.noDataSet = true);
	    return;
	}
	var typeDef = wm.typeManager.getType(this.type);
	var fields = typeDef && typeDef.fields;
	if (fields) {
	    for (var fieldName in fields) {
		if (inData[fieldName] !== undefined) {
		    this.valueChanged("noDataSet", this.noDataSet = false);
		    return;
		}
	    }
	    this.valueChanged("noDataSet", this.noDataSet = true);
	} else {
	    this.valueChanged("noDataSet", this.noDataSet = false);
	}
    },
    onDataSetChanged: function(inData) {},
    onDataSetChanging: function(inData) {},

    /****************
     * METHOD: clearData (PUBLIC)
     * DESCRIPTION: Overrides wm.Container.clearData to also clear the dataOutput field and disable onChange events until its done
     ***************/
    clearData: function() {
	/* TODO: Its not clear as long as these bindings can still be fired to provide data... but I'd like to try and just not fire them...
	   dojo.forEach(this.getRelatedEditorsArray(), function(e) {
	   e.clearDataOutput();
	   });
	*/
	this._skipChangeOnDirty = true;
	this.beginEditUpdate();
	this.dataOutput.setData({});
	this.inherited(arguments);
	this.endEditUpdate();
	this._skipChangeOnDirty = false;
    },

/*    
	_getDataType: function() {
	    if (wm.typeManager.isStructuredType(this.type))
		return t;
	},
	*/


    /****************
     * METHOD: beginEditUpdate/endEditUpdate/liveFormChanged (PUBLIC)
     * DESCRIPTION: Tell all editors to disable binding and onchange events; typically, if we are in readonly
     *              and the user is clicking around on a lot of grid rows, there are a lot of events we
     *              don't need to generate; so we disable events when we call setDataValue on each editClear
     *              the dataOutput variable.
     *              ALSO: By waiting to fire onchange events until ALL editors have changed, anything triggered
     *                    by the onchange will see all of the new values, not just those that were set before
     *                    the event fired and not those we're still waiting to iterate through.
     *              liveFormChanged() triggers all notifications to be fired when we are ready for them.
     ***************/
    beginEditUpdate: function() {
	this.dataOutput.beginUpdate();
	dojo.forEach(this.getEditorsArray(), function(e) {
	    wm.fire(e, "beginEditUpdate");
	});
    },
    endEditUpdate: function() {
	this.dataOutput.endUpdate();
	dojo.forEach(this.getEditorsArray(), function(e) {
	    wm.fire(e, "endEditUpdate");
	});
    },
    liveFormChanged: function() {
	dojo.forEach(this.getEditorsArray(), function(e) {
	    wm.fire(e, "changed");
	});
    },

    /****************
     * METHOD: populateEditors (PRIVATE)
     * DESCRIPTION: Maps the dataSet into any editors in this form that have a matching formField,
     *              setting the dataValue for each editor.
     ***************/
    populateEditors: function() {
	var item = this.dataSet;
	var data = item ? item.getData() : null;
	if (!data) data = {};
	dojo.forEach(this.getEditorsArray(), dojo.hitch(this, function(e) {
	    /* If we have a form inside of this form, call populateEditors on it */

                if (wm.Lookup && e instanceof wm.Lookup && (!e.dataSet || !e.dataSet.type)) 
                    e.setAutoDataSet(e.autoDataSet);
		wm.fire(e, "setDataValue", [e.formField && data ? data[e.formField] : data]);
	    
	}));
	dojo.forEach(this.getRelatedEditorsArray(), dojo.hitch(this, function(e) {
	    if (!this._operationSucceeded) {
		e.setDataSet(data[e.formField]);
	    }
	}));

    },

    /****************
     * METHOD: populateDataOutput (PRIVATE)
     * DESCRIPTION: We don't at this time use bindings to map data from the editors to the dataOutput.
     *              Why not? Don't recall; but certainly it requires creating, and tracking/managing
     *              fewer components. Instead, we populate dataOutput with new data from editors only on demand.
     * WHEN TO USE: Use this any time you need to access the dataOutput property, such as just before writing the data
     *              to the server
     ***************/
    populateDataOutput: function() {
	var d = this.dataOutput;
	dojo.forEach(this.getEditorsArray(), dojo.hitch(this, function(e) {
	    if (e instanceof wm.DataForm || e instanceof wm.SubForm || wm.isInstanceType(e, wm.SubForm)) {

	    } else if (e.formField) {
		d.setValue(e.formField, e.getDataValue());
            }
	}));
	dojo.forEach(this.getRelatedEditorsArray(), dojo.hitch(this, function(subform) {
	    subform.populateDataOutput();
	    d.setValue(subform.formField, subform.dataOutput);
	}));
        return this.dataOutput;
    },

    /****************
     * METHOD: getDataOutput (PUBLIC)
     * DESCRIPTION: This updates the value of dataOutput and then returns it
     ***************/
    getDataOutput: function() {
	if (!this.generateOutputBindings) {
	    this.populateDataOutput();
	}
	return this.dataOutput;
    },

    /****************
     * METHOD: getEditorsArray (PRIVATE)
     * DESCRIPTION: Overrides getEditorsArray to only return editors in this form with formFields that are set 
     ***************/
    getEditorsArray: function(includeRelated) {
	return wm.getMatchingFormWidgets(this, function(w) {
	    return (w instanceof wm.AbstractEditor || includeRelated && w instanceof wm.SubForm) && (w.formField !== undefined);
	});
    },


    /****************
     * METHOD: getRelatedEditorsArray (PRIVATE)
     * DESCRIPTION: Get all of the RelatedEditors 
     ***************/ 
    getRelatedEditorsArray: function() {
	return wm.getMatchingFormWidgets(this, function(w) {
	    return (wm.isInstanceType(w, wm.SubForm) && w.formField);
	});
    },

    /****************
     * METHOD: valueChanged (PRIVATE)
     * DESCRIPTION:
     *       disallow change messages from being called on our variable properties;
     *       they send these messages themselves when they change...
     * TODO: I really have no clue if this does anything anymore; should investigate some day...
     ***************/ 
    valueChanged: function(inProp, inValue) {
	if (this[inProp] instanceof wm.Variable) {
	    return;
	} else {
	    this.inherited(arguments);
	}
    },


    editNewObject: function() {
	this.beginEditUpdate();
	this.clearDirty();
	this.setDataSet(null);
	//this.clearData();
	this.setDefaultOnInsert();
	this.endEditUpdate();

	/* If we are readonly, then there's no choice here but to make the editors editable if someone calls
	 * editNewObject. But only make editable editors whose formField's type definition doesn't say "dont do that operation".
	 * Expected typical case here is that the user never turns on readonly for the Form so this code never gets executed.
	 * We also want to handle the case where even if this form  is NOT readonly, we may want to change primary keys and such
	 * to readonly because users shouldn't edit them.  Developer must explicitly disable that default behavior to manage
	 * all readonly themselves.
	 */
	if (this.readonly || this.setReadonlyOnPrimaryKeys) {
	    this.readonly = false;
  	    this._setReadonly(false, dojo.hitch(this, "_canChangeEditorReadonly", ["insert"]));
	}

	this.liveFormChanged();
	this.onEditNewObject();
	wm.onidle(this, "focusFirstEditor");
    },
    onEditNewObject: function(){},

    editCurrentObject: function() {
	/* If we are readonly, then there's no choice here but to make the editors editable if someone calls
	 * editNewObject. But only make editable editors whose formField's type definition doesn't say "dont do that operation".
	 * Expected typical case here is that the user never turns on readonly for the Form so this code never gets executed.
	 * We also want to handle the case where even if this form  is NOT readonly, we may want to change primary keys and such
	 * to readonly because users shouldn't edit them.  Developer must explicitly disable that default behavior and manage
	 * all readonly themselves.
	 */
	if (this.readonly || this.setReadonlyOnPrimaryKeys) {
  	    this._setReadonly(false, dojo.hitch(this, "_canChangeEditorReadonly", ["update"]));
	}
	this.onEditCurrentObject();
	wm.onidle(this, "focusFirstEditor");
    },
    onEditCurrentObject: function() {},

    setDefaultOnInsert: function() {
	dojo.forEach(this.getEditorsArray(), function(e) {
	    wm.fire(e, "setDefaultOnInsert");
	});
    },


    /****************
     * METHOD: _canChangeEditorReadonly (PRIVATE)
     * DESCRIPTION: Determines if for the given editor, based on the editor's formField type information and the operation,
     *              whether that editor can be safely edited or not
     ***************/
    _canChangeEditorReadonly: function(inOperations, inEditor, inForm, inReadonly) {
	if (!this.setReadonlyOnPrimaryKeys) return true;

	/* This test currently only supported for LiveVariables */
	if (wm.isInstanceType(inEditor, wm.AbstractEditor) && inEditor.formField && this.serviceVariable instanceof wm.LiveVariable) {
	    var formField = inEditor.formField;
	    var type = inForm.type;
	    var typeDef = wm.typeManager.getType(type) ;
	    if (typeDef) {
		var schema = typeDef.fields;
	    }
	    
	    var propertyInfo = wm.typeManager.getPropertyInfoFromSchema(schema, formField);
	    var ops = inOperations;
	    if (!formField)
		return true;
	    // NOTE: if an editor should be excluded or not changed 
	    // for given operation then it should remain read only.
	    //
	    // NOTE: exclude is use for inserts only so 
	    // we can simply leave it read only since the editor will be blank
	    var
	    // this field should not be changed for the given operations
	    noChange = propertyInfo && dojo.some(propertyInfo.noChange, function(i) { return (dojo.indexOf(ops, i) > -1)}),
	    // this field should not be excluded for the given operations
	    exclude = propertyInfo && dojo.some(propertyInfo.exclude, function(i) { return (dojo.indexOf(ops, i) > -1)});
	    if (!inReadonly && (noChange || exclude))
		return false;
	}
	return true;
    },


    cancelEdit: function() {
	this.clearDirty();
	if (this.$.binding && this.$.binding.wires.dataSet) {
	    this.$.binding.wires.dataSet.refreshValue();
	}
	this.onCancelEdit();
    },
    onCancelEdit: function() {},

    // LiveForm compatability
    beginDataInsert: function() {
	this.editNewObject();
    },
    beginDataUpdate: function() {
	this.editCurrentObject();
    },
    getFormEditorsArray: function() {
	return this.getEditorsArray();
    },
	findLiveVariable: function() {
		// Not sure why we were not checking for liveVariable instance in the object itself,
		// before digging deep and trying to find liveVariable elsewhere. 
		/*
		if (this.liveVariable && wm.isInstanceType(this.liveVariable, wm.LiveVariable))
			return this.liveVariable;
		*/
		var
			s = this.dataSet.dataSet,
			o = s && s.owner,
			ds = null;
		  o = o && !(wm.isInstanceType(o, wm.Variable)) ? o : null;
			
			if (o){
				try{
				    if (wm.isInstanceType(o, wm.DojoGrid)) {
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

    _end: 0
});


dojo.declare("wm.SubForm", wm.DataForm, {
    formField:"",

	_getFormField: function(inField) {
		if (inField.indexOf(".") == -1)
			return inField;
		var f = this._getRelativeFormField(inField);
		if (f && f.indexOf(".") == -1)
			return f;
	},
    _getRootFormField: function() {
	    var a = [];
	    var w = this;
            while (w) {
		if (w.formField)
		    a.unshift(w.formField);
		w = w.getParentForm();
	    }
	return a.join(".");
    },
	_getRelativeFormField: function(inField) {
	    var rootField = this._getRootFormField();
	    if (inField.indexOf(rootField) == 0)
		return inField.substring(rootField.length);
	},
	getViewDataIndex: function(inField) {
		var r =  this._getRootFormField();
		return (r ? r + "." : "") + inField;
	}
    
});


/* WHAT I'd LIKE TO DO HERE:
 * 1. A ServiceForm that generates a ServiceVariable/LiveVariable and does insert, update, delete
 * 1. A ReadOnlyLiveForm which comes with liveEditing, an EditPanel and has alwaysPopulateEditors off will NOT go here
 */

/*************************************************************************
 * CLASS: wm.DBForm
 * DESCRIPTION: Extends DataForm to add support client/server communication
 *    1. Owns its own LiveVariable
 *    3. Developer calls editNewObject; gets callback of onEditNewObject (a new button is automatically setup to do this)
 *    4. Developer calls editCurrentObject; gets callback of onEditCurrentObject (an edit button is automatically setup to do this)
 *    5. Developer calls saveData; if there is an invalid editor, calls onSaveInvalidated, else it procedes to save (a save button is automatically setup to do this)
 *    6. Developer calls deleteData; if the user cancels, calls onCancelDelete 
 *    7. onBeforeInsertCall/onBeforeUpdateCall/onBeforeDeleteCall gives developers chance to modify what is sent to the server
 *    8. onInsertSuccess/onUpdateSuccess/onDeleteSuccess/onSuccess gives developer chance to handle different success events
 *    9. NOTE: The default value of the generateOutputBindings = false property means that things run more efficiently, but it also means that removing an editor from the form that contains it will cause it not to be used when updating the dataOutput property and sending it to the server.  You can change generateOutputBindings to true to reduce performance and improve control/flexability.  Typically, you should tinker with dataOutput on DataForm where you are the one consuming the data in dataOutput, and leave it alone in DBForm where its intended to be consumed internally by the form's own LiveVariable.
 *
 * NOTES:
 *    1. This is Not wm.LiveForm; it does not default to being a readonly form.  Nor does it default to managing the readonly state of the form.  To make this form manage its readonly state automatically, turn on the readonlyManager property (which behaves much the same as liveEditing from wm.LiveForm)
 *    2. This form is only easy to use if editNewObject, editCurrentObject, saveData and deleteData are in the events menu or if we include
 *       generateButtons to create buttons with the necessary events baked in (generateButtons is how we do it today)
 *    3. There are a lot of event handlers to let the developer control the form, but very few properties for controlling the form.
 *
 *    1. Creating an insert-only DBForm:
 *       a. Drag DBForm onto canvas
 *       b. Set the type; there is no dataSet for insert-only forms; your editors do not need to be populated with values to edit.
 *       c. Go to the model and find your buttons; delete the Update and Delete buttons
 *       d. If you want the form to start off ready for the user to start entering a new value, you can call this.dbForm1.editNewObject() in your start method
 *       e. If the user will only ever add a single entry, and you called editNewObject() you can delete the new button
 *       f. Using the form's onInsertSuccess event handler, you can navigate away from this form, change its readonly state to true, 
 *          disable it, or perform some other action to prevent the user from editing this form any further.
 *       g. If you use the readonlyManager property, the form automatically becomes readonly after the save completes.
 *       h. If you want your user to enter a series of entries in the form, then you can use the onInsertSuccess to call editNewObject()
 *          and the user can start entering the next set of values (a message is usually helpful to notify the user that the
 *          insert was successful; calling focus on the top editor is also helpful to prompt the user to start the next entry.
 *
 *    2. Creating an update-only DBForm:
 *       a. Drag DBForm onto canvas
 *       b. Set the dataSet that the user is to edit. For example, you could set a grid.selectedItem, or you could set the
 *          currentUserLiveVar so that the user can edit their account information.
 *       c. Delete the "New" button; an update-only DBForm shouldn't be creating a new entry (i.e. the user should not be able
 *          to create a new entry in the User table, only edit their own entry.
 *       d. Delete the "Delete" button as well (unless you want an update-and-delete-only form)
 *       e. After a successful update, the form automatically attempts to find the dataSet and update it; the following should be noted:
 *          1. If the dataSet is a grid.selectedItem, then both the selectedItem AND the grid.dataSet will be updated;
 *             In most cases therefore, your grid's dataSet does not need to be reloaded from the server.  There are exceptions
 *             to watch out for: if there are related objects in your grid that aren't edited in your Form, then these may be
 *             lost and you may have to reload the grid data from the server in the form's onSuccess event handler.
 *             Anything bound to the dataSet or selectedItem should be updated.
 *             TODO: this will cause selectedItem to change twice, need to prevent that.
 *          2. If the dataSet is a Variable or subclass, it will update the data in that Variable, and anything bound to that Variable
 *             should be updated.
 *       f. After a successful save, the buttons should be automatically changed from save/cancel to update.
 *       g. If you have readonlyManager enabled, then after a save the form will automatically change to readonly.
 *       h. If you do not have readonlyManager enabled AND you do not have readonly on, then your form will appear to be 
 *          editable before the user clicks on the Edit button, this will cause confusion.  If you want your form to be 
 *          immediately editable, you need to call editCurrentObject().  For example, use the onDataSetChanged event
 *          to call editCurrentObject().
 *   
 *    3. Creating a full CRUD Form (insert/update/delete): Follow the steps in #2 but skip the deletion of buttons
 *       
 *    MY NOTES:
 *       USAGE TYPES:
 *       1. insert, update, CRUD (affects buttons available)
 *       2. either uses a readonly manager or its always ready to edit
 *************************************************************************/

dojo.declare("wm.DBForm", wm.DataForm, {
    noDataSet: true,
    useLoadingDialog: true,
    formBehavior: "standard", // values are standard, insertOnly and updateOnly
    serviceVariable: null,
    deleteConfirmation: "Are you sure you want to delete this data?",
    readonlyManager: false,
    insertOp: "insert",
    updateOp: "update",
    deleteOp: "delete",

    /* Using bindings is nice because its automatic; but it doesn't perform quite as well as calling
     * a populate method; as long as the only access to dataOutput comes from within the form component itself
     * for use by its livevar/servicevar,
     * there's no need for the user friendly approach. Makes it more of a black box, but ServiceForm is 
     * more of a black box -- it attempts to automate client/server communication after all
     */
    generateOutputBindings: true,


    /****************
     * METHOD: init (Lifecycle)
     * DESCRIPTION: Initialize the subcomponents 
     ***************/
    init: function() {
	this.inherited(arguments);
	this.initServiceVariable();
    },

    postInit: function() {
	this.inherited(arguments);
	if (!this.readonlyManager) {
	    this._editSomeObject();
	}
	if (this.useLoadingDialog) {
	    this._loadingDialog = new wm.LoadingDialog({owner: this, name: "_loadingDialog", caption: "Saving..."});
	    this._loadingDialog.widgetToCover = this;
	    this._loadingDialog.setServiceVariableToTrack(this.serviceVariable);
	    this._loadingDialog.domNode.style.opacity = "0.3";
	    if (dojo.isIE < 9) {
	    	    this._loadingDialog.domNode.style.filter = 'Alpha(Opacity="0.3")';
	    }
	}
    },

    /****************
     * METHOD: setDataSet (PUBLIC)
     * DESCRIPTION: Override parent setDataSet and update the serviceVariable as needed
     ***************/
    setDataSet: function(inDataSet) {
	if (this._updating) return;
	this.inherited(arguments);
	/* This call is only for the deprecated use of LiveVariable's whose LiveSource points to an app-owned live view */
	if (inDataSet && inDataSet.liveSource) {
	    this.serviceVariable.setLiveSource(inDataSet.liveSource);
	}

	if (!this.readonlyManager) {
	    this._editSomeObject();
	}
    },

    /****************
     * METHOD: initServiceVariable (PRIVATE)
     * DESCRIPTION: At initialization time we'll create a LiveVariable or ServiceVariable based our type info.
     *              If no type info, create a ServiceVariable.
     * ASSUMPTIONS: A form does not change type at runtime, and does not need a livevariable/servicevariable at designtime
     *
     * TODO: After merge, need to test getOperationType to see if its a Query that needs a ServiceVariable
     ***************/
    initServiceVariable: function() {
	if (this.type) {
	    this.serviceVariable = new wm.LiveVariable({
		name: "serviceVariable",
		owner: this,
		type: this.type,
		liveView: this.getSourceLiveView(),
		operation: this.operation || "insert",
		autoUpdate: false/*,
		inFlightBehavior: "executeAll" // needed for saving of subforms*/
	    });
	    this.insertOp = "insert";
	    this.updateOp = "update";
	    this.deleteOp = "delete";
	}

	var serviceVar = this.serviceVariable;

	this.connect(serviceVar, "onSuccess", this, "operationSucceeded");
	this.connect(serviceVar, "onResult", this, "operationResult");
	this.connect(serviceVar, "onError", this, "operationFailed");
    },

    /****************
     * METHOD: getSourceLiveView (PRIVATE)
     * DESCRIPTION: Sometimes its useful to get the dataSet for more information. 
     *              Unfortunately, the dataSet is often something like a selectedItem 
     *              which lacks the full richness of data sometimes available in the 
     *              original serviceVariable. So we dig and see what the best possible 
     *              dataSet we can find is.
     ***************/
    getSourceLiveView: function() {
	if (!this.dataSet) return;
	var dataSet = this.dataSet.dataSet || this.dataSet;
	var owner = this.dataSet;

	/* Iterate through the owner and dataSet properties until we find a ServiceVariable or give up */
	while (owner && (owner.owner instanceof wm.Variable && owner.owner instanceof wm.LiveVariable == false || 
			 owner.owner instanceof wm.Control) )
	{
	    if (owner == this) {
		break;
	    } else if (owner.owner instanceof wm.Variable) {
		owner = owner.owner;
	    } else if (owner.owner instanceof wm.Control && owner.owner.dataSet && owner.owner.dataSet != this.dataSet) {
		owner = owner.owner.dataSet;
	    } else {
		break;
	    }
	}
	if (owner instanceof wm.Control)
	    owner = null;
	if (owner instanceof wm.LiveVariable)
	    return owner.liveView;
    },


    /****************
     * METHOD: cancelEdit (PUBLIC)
     * DESCRIPTION: Called by developer or cancel button to reset editor values and if using the readonlyManager, 
     *              resets the readonly state (all work done in parent method and in endEdit)
    ****************/
    cancelEdit: function() {
	this.inherited(arguments);
	this.endEdit();
    },


    _editSomeObject: function() {
	if (this._inEditSomeObject) return;
	this._inEditSomeObject = true;
	try {
	    switch(this.formBehavior) {
	    case "insertOnly":
		this.editNewObject();
		break;
	    case "updateOnly":
		this.editCurrentObject();
		break;
	    default:
		if (this.noDataSet) {
		    this.editNewObject();
		} else {
		    this.editCurrentObject();
		}
	    }
	} catch(e) {}
	delete 	this._inEditSomeObject;
    },

    /****************
     * METHOD: editNewObject (PUBLIC)
     * DESCRIPTION: Call this when your user is going to start editing a new object.  
     *         This does no service calls, it just:
     *         1. insures readonly is true/false as needed
     *         2. sets the operation
     *         3. Updates the showing states of the buttons
     *         4. sets the dataSet to null so that all editors are cleared
     ***************/
    editNewObject: function() {
	this.operation = this.insertOp;
	this.serviceVariable.setOperation(this.operation);

	this.inherited(arguments);
	this.updateButtonShowingState(true);	
	return true;
    },


    /****************
     * METHOD: editCurrentObject (PUBLIC)
     * DESCRIPTION: Call this when your user is going to start editing the current object in dataSet.  
     *         This does no service calls, it just:
     *         1. insures readonly is true/false as needed
     *         2. sets the operation
     *         3. Updates the showing states of the buttons
     ***************/
    editCurrentObject: function() {
	this.operation = this.updateOp;
	this.serviceVariable.setOperation(this.operation);
	this.inherited(arguments);
	this.updateButtonShowingState(true);	
	return true;
    },

    /****************
     * METHOD: updateButtonShowingState (PRIVATE)
     * DESCRIPTION: Updates ths showing state of all buttons managed by this form
     ****************/
    updateButtonShowingState: function(inEditing) {
	if (this.readonlyManager) {
	    if (this.saveButton)
		this.saveButton.setShowing(inEditing);
	    if (this.cancelButton)
		this.cancelButton.setShowing(inEditing);
	    if (this.editButton)
		this.editButton.setShowing(!inEditing);
	    if (this.deleteButton)
		this.deleteButton.setShowing(!inEditing);
	    if (this.newButton)
		this.newButton.setShowing(!inEditing);
	} else {
	    if (this.newButton) {
		this.newButton.setShowing(this.operation != "insert");
	    }
	    if (this.deleteButton) {
		this.deleteButton.setShowing(this.operation != "insert");
	    }
	}
    },


    /****************
     * METHOD: endEdit (PRIVATE)
     * DESCRIPTION: After calling editNewObject or editCurrentObject, there is either a cancel or a save;
     *              Update which buttons are showing and update the readonly state of the editors (readonlyManager only)
     ***************/
    endEdit: function() {
	//this.operation = null;
	this.updateButtonShowingState(false);
	if (this.readonlyManager) {
  	    this.setReadonly(true);
	} else if (this.formBehavior == "insertOnly") {
	    this.editNewObject();
	}
    },

    /****************
     * METHOD: saveData (PUBLIC)
     * DESCRIPTION: When the user hits the save button, call saveData.
     *    1. You must have called editCurrentObject or editNewObject before calling saveData or the operation won't be set.
     *    2. If there is an invalid editor when we try to save, it will fail and report the invalid widget to onSaveInvalidated.  You can use the boolean true as an optional parameter to skip the validation test
     ***************/
    saveData: function(skipValidation) {
	if (skipValidation !== true) {
	    var invalidWidget = this.getInvalidWidget();
	    if (invalidWidget) {
		this.onSaveInvalidated(invalidWidget);
		return;
	    }
	}

	if (this.operation != this.insertOp && this.operation != this.updateOp) {
	    if (djConfig.isDebug) {
		app.toastError("Operation of '" + this.operation + "' is not valid");
		return;
	    }
	} 

/*
	if (this.operation != this.insertOp && this.operation != this.updateOp) {
	    this.saveDataGuessOperation();
	}
	*/
	this.doOperation(this.operation);
    },
    saveDataGuessOperation: function() {
	/* Attempt to guess the operation */
	var operation = "update";
	if (!this.generateOutputBindings)
	    this.populateDataOutput();
	var data = this.dataOutput.getData();

	/* If any fields that are excluded for insert have 0,"",null values, then assume its an insert operation */
	var fields = wm.typeManager.getType(this.type).fields;
	for (var fieldName in fields) {
	    if (fields[fieldName].exclude && dojo.indexOf(fields[fieldName].exclude, "insert") != -1 && !data[fieldName]) {
		operation = "insert";
	    }
	}
	this.operation = operation;
    },
    onSaveInvalidated: function(inInvalidWidget) {},

    /****************
     * METHOD: deleteData (PUBLIC)
     * DESCRIPTION: When the user hits the delete button, call deleteData
     *       If deleteConfirmation exists, ask the user to confirm deletion; 
     *       developers can clear deleteConfirmation and reset it if they need a quick delete.
     *       If user cancels deletion, an onCancelDelete event is called
     ***************/
    deleteData: function() {
	var deleteFunc = dojo.hitch(this,function() {
	    return this.doOperation("delete");
	});

	if (!this.deleteConfirmation) {
	    deleteFunc();
	} else {
	    app.confirm(this.deleteConfirmation, false,
			deleteFunc,
			dojo.hitch(this,function() {
			    this.onCancelDelete();
			}));
	    }
    },
    onCancelDelete: function() {},

    /****************
     * METHOD: doOperation (PRIVATE)
     * DESCRIPTION: Sends the data in dataOutput to the server with a service operation of inOperation
     *    1. Developers should call deleteData or saveData, not doOperation
     *    2. Calls onBeforeInsertCall/onBeforeUpdateCall/onBeforeDeleteCall to allow developers to modify what is sent to the server
     ***************/
    doOperation: function(inOperation) {
	if (!this.generateOutputBindings)
	    this.populateDataOutput();
	var data = this.dataOutput.getData();

	var serviceVar = this.serviceVariable;

	serviceVar.setOperation(inOperation);

	/* Give developers the javascript data hash to modify before we send it to the server */
	switch (this.operation) {
	case this.insertOp:
	    this.onBeforeInsertCall(data);
	    break;
	case this.updateOp:
	    this.onBeforeUpdateCall(data);
	    break;
	case this.deleteOp:
	    this.onBeforeDeleteCall(data);
	    break;
	}

	/* Any wm.SubForm in a DBForm must be a composite primary key;
	 * currently the server does not support updates on composite primary keys, such entries must be deleted and reinserted.
	 * Check to see if its dirty and in need of reinsertion.
	*/
	var isDirty = false;
	if (this.operation == "update") {
	    var subforms = this.getRelatedEditorsArray();
	    dojo.forEach(subforms, dojo.hitch(this, function(form) {
		if (form.getIsDirty()) {
		    isDirty = true;
		}
	    }));
	}

	this.setServerParams(data);
	if (!isDirty) {
	    this.serviceVariable.update();
	} else {
	    this._disableEventHandling = true;
	    this.serviceVariable.setOperation("delete");
	    this.serviceVariable.sourceData.setData(this.dataSet); // delete the original dataset
	    var def = this.serviceVariable.update();	    
	    def.addCallbacks(
		dojo.hitch(this, function() {		    
		    this.setServerParams(data); // onsuccess insert the new data values
		    this.serviceVariable.setOperation("insert");
		    this.serviceVariable.update();
		    wm.onidle(this, function() {
			delete this._disableEventHandling;
			this.serviceVariable.setOperation("update");
		    });
		}),
		dojo.hitch(this, function() {
		    wm.onidle(this, function() {
			delete this._disableEventHandling;
			this.serviceVariable.setOperation("update");
		    });
		}));
	}
    },
    setServerParams: function(inData) {
	this.serviceVariable.sourceData.setData(inData);
    },
    onBeforeInsertCall: function(inInsertData) {},
    onBeforeUpdateCall: function(inUpdateData) {},
    onBeforeDeleteCall: function(inDeleteData) {},

    /****************
     * METHOD: operationSucceeded (PRIVATE)
     * DESCRIPTION: Called any time this.serviceVariable has an onSuccess event call
     *    1. Developers should call deleteData or saveData, not doOperation
     *    2. Calls onBeforeInsertCall/onBeforeUpdateCall/onBeforeDeleteCall to allow developers to modify what is sent to the server
     ***************/
    operationSucceeded: function(inResult) {
	if (this._disableEventHandling) return;
	/* if we get result as an array, take the first one */
	if (dojo.isArray(inResult))
	    inResult = inResult[0];

	/* To be certain of what the serviceVariable just did, get its operation */
	var op = this.serviceVariable.operation;

	/* LiveVariable insert/update returns the object.  ServiceVariable could return absolutely anything. 
	 * Reflect upon the type information and see if the result can be passed into an item and into a form 
	 * or if the result is not a relevant type */
	var useReturnData = this.canApplyReturnedData();

	/* In order to put data in the form, we must call clearDirty or the user will be asked to confirm having their dataSet changed.
	 * Call setData on the data item which will cause the bindings to fire a setDataSet call to update the form itself. */
	if (useReturnData) {
	    this.applyReturnedData(this.dataSet, inResult);
	}

	switch (op) {
	    case this.insertOp:
		this.onInsertSuccess(inResult);
		break;
	    case this.updateOp:
		this.onUpdateSuccess(inResult);
		break;
	    case this.deleteOp:
		this.setDataSet(null);
		this.onDeleteSuccess(inResult);
		break;
	}

	this.onSuccess(inResult);
	this.endEdit();
    },
    canApplyReturnedData: function() {
	//return this.type === this.serviceVariable.type;
	return true;
    },
    applyReturnedData: function(inItem, inResult) {
	/* NOTE: inResult comes without any related items.  
	 *       Bindings from editors to the dataSet means that related editors will be calling getValue and trigger lazy load.
	 *       This means that once setData has finished all the lazy load side-effects, this.dataSet will have all related
	 *       objects, making it more complete than inResult; dont use inResult after this call.
	 */
/* NOTE 2: Updated implementation; instead of calling setData(inResult) and loosing related objects forcing a lazyload, we instead simply set each field we have a result for */
	    try {
		this.clearDirty();
		inItem.beginUpdate();
		var fields = this.serviceVariable._dataSchema;
		for (var fieldName in inResult) {
		    /* If inResult ever starts returning objects, we can update this, but for now, related objects are always {} */
		    if (!wm.typeManager.isStructuredType(fields[fieldName].type)) {
			inItem.setValue(fieldName, inResult[fieldName]);
		    } else {
			inItem.setValue(fieldName, this.dataOutput.getValue(fieldName));
		    }
		}
		inItem.endUpdate();
		inItem.notify();
		var d = this.dataSet.getData();
	    } catch(e) {}


	    /*
	    // PV: If item is equal to this.dataSet that means by calling setData on it, setData will have already called notify.
	    // Therefore, there's no need to call an extra notify.
	    if (item != this.dataSet)
	    wm.fire(this.dataSet, "notify");
	    */

	    /* The dataSet should be updated with the new data.  Among other things, this means that when we add a new item,
	     * a grid can select it */
	    if (this.$.binding.wires.dataSet) {
		/* Get the component that is our dataSet */
		var originalDataSet = this.owner.getValueById(this.$.binding.wires.dataSet.source);

		if (originalDataSet && wm.isInstanceType(originalDataSet, wm.Variable)) {

		    /* Update the data that our dataSet is bound to; for example, grid.selectedItem; if the dataSet is a list,
		     * update the current item in that list.  There is no need to update these editors based on this dataSet firing
		     * off a notify, however, there may be other things bound to selectedItem */
		    if (d) {
			this._updating = true;
			originalDataSet.getCursorItem().setData(d);
			this._updating = false;
		    }
		    /* Now see if the object bound to our dataSet has an owner with its own dataSet (grid.selectedItem has grid.dataSet). */
		    if (originalDataSet.owner && 
			originalDataSet.owner instanceof wm.Control && /* Right now, this logic only applies to widgets  */
			originalDataSet.owner.dataSet instanceof wm.Variable && /* and the widgets must have a dataSet */
			originalDataSet != originalDataSet.owner.dataSet) { /* And that dataSet can't be what we're already bound to */
			var dataSetToUpdate = originalDataSet.owner.dataSet; /* That widget's dataSet needs to be updated */
		    }
		}
	    }

	if (dataSetToUpdate) {
	    this._updating = true; /* don't let this update our editors */
	    try {

		/* To be certain of what the serviceVariable just did, get its operation */
		var op = this.serviceVariable.operation;

	    switch (op) {
	    case this.insertOp:
		/* The dataSet for the widget gets a new item; eg. we're bound to a grid.selectedItem; grid.dataSet gets a new item */
		if (d) {
		    dataSetToUpdate.addItem(d,0);
		}
		break;
	    case this.updateOp:
		/* We've already updated our originalDataSet, but we need to update the dataSetToUpdate; eg:
		 * grid.selectedItem was updated above, but the grid.dataSet needs to be updated */
		if (d) {
		    var subforms = this.getRelatedEditorsArray();
		    var item = dataSetToUpdate.getItem(originalDataSet.dataSet.itemIndex);
		    item.beginUpdate();
		    item.setData(d);
		    item.endUpdate();
		    dataSetToUpdate.notify(); // doing a notify on item messes with reselecting the grid.selectedItem, must be done on the whole dataset.
		}
		break;
	    case this.deleteOp:
		dataSetToUpdate.removeItem(originalDataSet.dataSet.itemIndex);
		this.onDeleteSuccess(inResult);
		break;
	    }
	    } catch(e) {
		console.error(e);
	    }
	    this._updating = false;
	}
    },
    onInsertSuccess: function(inResult) {},
    onUpdateSuccess: function(inResult) {},
    onDeleteSuccess: function(inResult) {},
    onSuccess: function(inResult) {},
    onResult: function(inResult) {},

    operationResult: function(inResult) {
	if (this._disableEventHandling) return;
	this.onResult(inResult);
    },
    operationFailed: function(inError) {
	switch (this.operation) {
	case this.insertOp:
	    this.onInsertError(inError);
	    break;
	case this.updateOp:
	    this.onUpdateError(inError);
	    break;
	case this.deleteOp:
	    this.clearData();
	    this.onDeleteError(inError);
	    break;
	}	
	this.onError(inError);
    },
    onInsertError: function(inError) {},
    onUpdateError: function(inError) {},
    onDeleteError: function(inError) {},
    onError: function(inError) {},


    _end: 0
});




    /* TODO: 1. When a LiveVariable changes its type; we need to kill the old LiveView and create a new one 
     *       2. When a Lookup/Related editor is added to a form, we need to add that field to the View; 
     *       3. We need to figure out when/if to automatically add lookup/related editors: I say always add Lookup; only add required related.
     */


dojo.declare("wm.ServiceForm", wm.DBForm, {
    saveData: function(skipValidation) {
	if (skipValidation !== true) {
	    var invalidWidget = this.getInvalidWidget();
	    if (invalidWidget) {
		this.onSaveInvalidated(invalidWidget);
		return;
	    }
	}

	/* TODO: Localize though this is only here to notify developers */
	if (this.formBehavior == "updateOnly" && this.noDataSet) {
	    return app.toastError("Can not insert with an updateOnly form");
	}

	if (this.operation != this.insertOp && this.operation != this.updateOp) {
	    if (djConfig.isDebug) {
		app.toastError("Operation of '" + this.operation + "' is not valid");
	    }
	} 
	this.doOperation(this.operation);
    },


    _end: 0
});



dojo.declare("wm.ServiceInputForm", wm.DataForm, {
    serviceVariable: null,
    setReadonlyOnPrimaryKeys: false,
    generateInputBindings: false,
    populateEditors: function() {}, // called because generateInputBindings is false
    getTypeDef: function() {
	if (this.serviceVariable && this.serviceVariable.input) {
	    return {fields: this.serviceVariable.input._dataSchema};
	}
	return null;
    },

    init: function() {
	this.inherited(arguments);
	this.dataOutput.destroy();
	this.dataOutput = new wm.ServiceInput({name: "dataOutput", owner: this });
    },


    setServiceVariable: function(inVar) {
	this.serviceVariable = inVar;
	if (inVar) {
	    this.dataOutput.operationChanged(inVar.operation, inVar._operationInfo.parameters);
	}
    },
    _end: 0
});

