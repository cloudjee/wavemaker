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
dojo.provide("wm.base.widget.RelatedEditor");
dojo.require("wm.base.widget.LiveForm");

dojo.declare("wm.RelatedEditor", wm.LiveFormBase, {
	height:'26px',
	editingMode: "lookup",
	_lookupCache: null,
	canChangeEditorReadonly: function(inEditor, inReadonly, inCanChangeFunc) {
		var m = this.editingMode;
		switch (m) {
			case "readonly": 
				// If related editor is in readonly mode:
				// operation is 'update': user should not be allowed to update the related editors values.
				// operation is 'insert': user should be allowed to add new values to related editors.
				if (this.parent && this.parent.operation && this.parent.operation == 'insert')
					return inReadonly || ((inEditor == this.findLookup() && this.inherited(arguments)));
				else			
					return inReadonly;
					
			case "lookup": return inReadonly || ((inEditor == this.findLookup() && this.inherited(arguments)));
			default: return this.inherited(arguments);
		}
	},
	findLookup: function() {
		var editors = this.getFormEditorsArray();
		for (var i = 0, e; (e=editors[i]); i++)
			if (e.display == "Lookup" || e instanceof wm.Lookup) // added e instanceof because e.display == undefined for my test case; not even clear where display is set.
				return e;
	},
	//===========================================================================
	// LiveVariable / View info
	//===========================================================================
	getLiveVariable: function() {
		var f = this._getLiveForm();
		return f && f.getLiveVariable();
	},
	_getLiveForm: function() {
		var p = wm.getParentForm(this);
		while (p && !(wm.isInstanceType(p, wm.LiveForm))) {
			p = wm.getParentForm(p);
		}
		return p;
	},
	// formField relative to this.
	_getRelativeFormField: function(inField) {
		var rootField = wm.getFormField(this) + ".";
		if (inField.indexOf(rootField) == 0)
			return inField.substring(rootField.length);
	},
	getViewDataIndex: function(inField) {
		var r = wm.getFormField(this);
		return (r ? r + "." : "") + inField;
	},
	//===========================================================================
	// Editing
	//===========================================================================
	// validation: propagate to parent, as editors do (grr)
	validate: function() {
		this.inherited(arguments);
		wm.fire(this.parent, "validate");
	},
	editStarting: function() {
		if (this.editingMode == "lookup")
			this._lookupCache = this.dataOutput.getData();
		this.inherited(arguments);
	},
	editCancelling: function() {
		if (this.editingMode == "lookup" && this._lookupCache !== undefined) {
			this.dataSet.beginUpdate();
			this.dataSet.setData(this._lookupCache);
			this.dataSet.endUpdate();
			this._lookupCache = null;
		}
		this.inherited(arguments);
	}
});
