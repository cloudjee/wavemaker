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


dojo.provide("wm.base.widget.Editors._RadioButtonEditor");
dojo.require("wm.base.widget.Editors._CheckBoxEditor");



//===========================================================================
// RadioButton Editor
//===========================================================================
dojo.declare("wm._RadioButtonEditor", wm._CheckBoxEditor, {
	radioGroup: "",
	_createEditor: function(inNode, inProps) {
		return new dijit.form.RadioButton(this.getEditorProps(inNode, inProps));
	},
	getEditorProps: function(inNode, inProps) {
		return dojo.mixin(this.inherited(arguments), {
			name: this.radioGroup
		}, inProps || {});
	},
	captionClicked: function() {
		if (!this.owner.readonly && !this.owner.disabled)
			this.setChecked(true);
	},
	setEditorValue: function() {
		this.inherited(arguments);
		this.updateGroupValue();
	},
	setRadioGroup: function(inGroup) {
		this.radioGroup = inGroup ? wm.getValidJsName(inGroup) : "";
		var group = this.getGroup();
		if (group.length)
			this.dataType = group[0].owner.dataType;
		this.createEditor();
		wm.fire(studio.inspector, "reinspect");
	},
	getGroup: function() {
		var groupList = [];
		var nList = dojo.query("input[type=radio][name="+this.radioGroup+"]");
		nList.forEach(function(DOMNode, index, nodeList){
			groupList[index] = dijit.getEnclosingWidget(DOMNode);
		});
		return groupList;
	},
	updateGroupValue: function() {
		var group = this.getGroup(), gv = this.getGroupValue();
		for (var i=0, v, o; (v=group[i]); i++) {
			o = (v.owner ||0).owner;
			if (o) {
				// avoid setter since we just want to process the update
				o.groupValue = gv;
				o.valueChanged("groupValue", gv);
			}
		}
	},
	setGroupValue: function(inValue) {
		var group = this.getGroup();
		for (var i=0, v; (v=group[i]); i++)
			if (v.owner.getDisplayValue() === inValue) {
				if (!v.checked)
					v.owner.setChecked(true);
				return;
			}
		// if not a good value, uncheck checked editor in group
		for (var i=0, v; (v=group[i]); i++)
			if (v.checked) {
				v.owner.setChecked(false);
				return;
			}
	},
	getGroupValue: function() {
		var group = this.getGroup();
		for (var i=0, v; (v=group[i]); i++)
			if (v.checked)
				return v.owner.getEditorValue();
		// if none checked, return an emptyValue; for consistency use the first editor in the group.
		for (var i=0, v; (v=group[i]); i++)
			return v.owner.makeEmptyValue();
	},
	isLoading: function() {
		var l = this.inherited(arguments);
		if (!l) {
			var group = this.getGroup();
			for (var i=0, v, gl; (v=group[i]); i++) {
				gl = v.owner.owner._rendering;
				if (gl)
					return true;
			}
		}
		return l;
	},
	setDataType: function(inType) {
		var group = this.getGroup();
		for (var i=0, v; (v=group[i]); i++)
			v.owner.dataType = inType;
	},
	setStartChecked: function(inChecked) {
		if (inChecked) {
			var group = this.getGroup();
			for (var i=0, v, r; (v=group[i]); i++)
				if (v.owner != this)
					v.owner.setStartChecked(false);
		}
		this.inherited(arguments);
	},
	// fired when owning editor widget processs change
	ownerEditorChanged: function() {
		this.updateGroupValue();
	}
});

// design only...
wm.Object.extendSchema(wm._RadioButtonEditor, {
	groupValue: { isOwnerProperty: 1, ignore: 1, bindable: 1, type: "any", group: "edit", order: 50 }
});
