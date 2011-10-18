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


dojo.provide("wm.base.widget.Editors._DateEditor");
dojo.require("wm.base.lib.date");
dojo.require("wm.base.widget.Editors.Base");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.TimeTextBox");


//===========================================================================
// Date Editor
//===========================================================================
dojo.declare("wm._DateEditor", wm._BaseEditor, {
	promptMessage: "",
	invalidMessage: "",
	minimum: "",
	maximum: "",
	format: '',
	dateEditorType: 'DateTextBox',
	getEditorProps: function(inNode, inProps) {
		var constraints = {};
		if (this.minimum)
			constraints.min = this.convertValue(this.minimum);
		if (this.maximum)
			constraints.max = this.convertValue(this.maximum);
		var prop = dojo.mixin(this.inherited(arguments), {
			promptMessage: this.promptMessage,
			invalidMessage: this.invalidMessage || "$_unset_$",
			constraints: constraints,
			required: this.required,
			value: this.convertValue(this.owner.displayValue)
		}, inProps || {});
		
		if (this.format != '')
			prop.lang = this.format;
		return prop;
	},
	_createEditor: function(inNode, inProps) {
		if (this.dateEditorType == 'DualCalendar')
		{
			dojo['require']("wm.base.components.DualCalendar");
			return new wm.DualCalendar(this.getEditorProps(inNode, inProps));
		}
		else if (this.dateEditorType == 'IslamicDateTextbox')
		{
			dojo['require']("wm.base.components.IslamicDateTextbox");
			return new wm.IslamicDateTextbox(this.getEditorProps(inNode, inProps));
		}	
		else
		{
			return new dijit.form.DateTextBox(this.getEditorProps(inNode, inProps));
		}
	},
	convertValue: function(inValue) {
		return wm.convertValueToDate(inValue);
	},
	getEditorValue: function() {
		var d = this.inherited(arguments);
		return d && d.getTime() || this.makeEmptyValue();
	},
	setEditorValue: function(inValue) {
		this.inherited(arguments, [this.convertValue(inValue)]);
	}
});

//===========================================================================
// Time Editor
//===========================================================================
dojo.declare("wm._TimeEditor", wm._DateEditor, {
	timePattern:'HH:mm a',
	getEditorProps: function(inNode, inProps) {
		var prop = dojo.mixin(this.inherited(arguments), {constraints:{timePattern: this.timePattern}}, inProps || {});
		return prop;
	},
	convertValue: function(inValue) {
		return wm.convertValueToDate(inValue, {selector: "time"});
	},
	_createEditor: function(inNode, inProps) {
		return new dijit.form.TimeTextBox(this.getEditorProps(inNode, inProps));
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "timePattern":
			    return makeSelectPropEdit(inName, inValue, ["HH:mm", "HH:mm:ss", "HH:mm a", "HH:mm:ss a"], inDefault);
		}
		return this.inherited(arguments);
	}
});

// design only...
wm.Object.extendSchema(wm._DateEditor, {
	changeOnKey: { ignore: 1 }
});

wm.Object.extendSchema(wm._TimeEditor, {
	format: { ignore: 1 }
});
