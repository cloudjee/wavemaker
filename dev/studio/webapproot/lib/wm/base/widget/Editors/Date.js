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
dojo.provide("wm.base.widget.Editors.Date");
dojo.require("wm.base.lib.date");
dojo.require("wm.base.widget.Editors.Base");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.TimeTextBox");

//===========================================================================
// Date Editor
//===========================================================================
dojo.declare("wm.Date", wm.Text, {
        useLocalTime: false,
	promptMessage: "",
	invalidMessage: "",
	minimum: "",
	maximum: "",
	//locale: '',
    
	validationEnabled: function() { return true;},
	getEditorProps: function(inNode, inProps) {
		var constraints = {};
		if (this.minimum)
		    constraints.min = this.convertValue(this.minimum).getTime();
		if (this.maximum)
		    constraints.max = this.convertValue(this.maximum).getTime();
		var prop = dojo.mixin(this.inherited(arguments), {
			promptMessage: this.promptMessage,
			invalidMessage: this.invalidMessage || "$_unset_$",
			constraints: constraints,
			required: this.required,
			value: this.convertValue(this.displayValue)
		}, inProps || {});
		
/*
		if (this.locale != '')
			prop.lang = this.locale;
*/
		return prop;
	},
	_createEditor: function(inNode, inProps) {
		return new dijit.form.DateTextBox(this.getEditorProps(inNode, inProps));
	},
	convertValue: function(inValue) {
		return wm.convertValueToDate(inValue);
	},
	getEditorValue: function() {
	    var d = this.inherited(arguments);
	    if (d) {
		if (!this.useLocalTime)
		    d.setHours(-wm.serverTimeOffset - d.getTimezoneOffset()/60,0,0);
		return d.getTime();
	    }
	    return this.makeEmptyValue();
	},
	setEditorValue: function(inValue) {
	    var v = this.convertValue(inValue); // if inValue is just a date, returns unmodified date

	    // If we assume that this is server time, then we need to add some number of hours to it so that instead of showing the date in local time, we show the date as it is according to the server
	    if (!this.useLocalTime)
		v.setHours(v.getHours() + wm.serverTimeOffset + v.getTimezoneOffset()/60);
	    this.inherited(arguments, [v]);
	}
});

//===========================================================================
// Time Editor
//===========================================================================
dojo.declare("wm.Time", wm.Date, {
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


wm.Object.extendSchema(wm.Date, {
    changeOnKey: { ignore: 1 },
    minimum: {group: "editor", order: 2,  doc: 1},
    maximum: {group: "editor", order: 3, doc: 1}, 
    format:  {group: "editor", doc: 0, ignore: 1},
    invalidMessage: {group: "validation", order: 3},
    showMessages: {group: "validation", order: 4},
    promptMessage: {group: "Labeling", order: 6},
    password: {ignore:1},
    regExp: {ignore:1},
    maxChars: {ignore:1},
    changeOnKey: {ignore: 1}
});

wm.Object.extendSchema(wm.Time, {
    format: { ignore: 1 },
    minimum: {group: "editor", order: 2, ignore: 1},
    maximum: {group: "editor", order: 3, ignore: 1},
    timePattern:{group: "editor", order: 4,  doc: 1},
    invalidMessage: {group: "validation", order: 3},
    showMessages: {group: "validation", order: 4},
    promptMessage: {group: "Labeling", order: 6},
    password: {ignore:1},
    regExp: {ignore:1},
    maxChars: {ignore:1},
    changeOnKey: {ignore: 1}
});


dojo.declare("wm.DateTime", wm.Text, {
    useLocalTime: false,
    timePanelHeight: 38,
    formatLength: "short",
    dateElements: "Date and Time",
    doOnblur: function() {
	this.inherited(arguments);
	wm.onidle(this, function() {
	// If we lose focus on the datetime editor when only picking a date, then dismiss the dialog
	// unless the focus is now on the dialog itself
	if (this.dateElements == "Date" && wm.DateTime.dialog && wm.DateTime.dialog.showing) {
	    var node = document.activeElement;
	    if (!dojo.isDescendant(node, this.domNode) && !dojo.isDescendant(node, wm.DateTime.dialog.domNode))
		wm.DateTime.dialog.hide();
	}
	});
    },
    doOnfocus: function() {
	this.inherited(arguments);
	if (!wm.DateTime.dialog) {
	    var dialog = wm.DateTime.dialog = new wm.Dialog({_classes: {domNode: ["wmdatetimedialog"]}, owner: app, "height":"252px","title":"","width":"210px", modal: false, useContainerWidget:true, useButtonBar: true, name: "_DateTimeDialog"});
	    dialog.containerWidget.setPadding("1");
	    dialog.containerWidget.createComponent(	
		"mainPanel", "wm.Container", 
		{"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"border":"0","height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"},
		{},
		{
		    calendar: ["wm.dijit.Calendar", {"border":"0", width: "100%"}, {onValueSelected: "handleDateChange"}],
		    panel1: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
			hours: ["wm.Number", {"caption":"Hour","captionAlign":"left","captionPosition":"top","captionSize":"20px","changeOnKey":true,"displayValue":"","height":"43px","maximum":12,"minimum":1,"padding":"2","spinnerButtons":true,"width":"56px"}, {onchange: "handleDateChange"}],
			minutes: ["wm.Number", {"caption":"Minute","captionAlign":"left","captionPosition":"top","captionSize":"20px","changeOnKey":true,"displayValue":"","height":"43px","maximum":59,"minimum":0,"padding":"2","spinnerButtons":true,"width":"56px"}, {onchange: "handleDateChange"}],
			ampm: ["wm.ToggleButton", {"captionDown":"PM","captionUp":"AM","height":"21px",width: "50px", "margin":"0,0,2,0"}, {onclick: "handleDateChange"}]
		    }],
		    label: ["wm.Label", {"border":"0","caption":"","padding":"4","width":"100%"}]
		}, dialog);
	    new wm.Button({owner: dialog,
			   parent: dialog.buttonBar,
			   name: "okButton",
			   caption: "OK",
			   width: "100px"});
	    new wm.Button({owner: dialog,
			   parent: dialog.buttonBar,
			   name: "cancelButton",
			   caption: "Cancel",
			   width: "100px"});

	}
	
	var dialog = wm.DateTime.dialog;
	dialog._disconnect();
	dialog.connect(dialog.$.calendar, "onValueSelected", this,"handleDateChange");
	dialog.connect(dialog.$.hours, "onchange", this, "handleDateChange");
	dialog.connect(dialog.$.minutes, "onchange", this, "handleDateChange");
	dialog.connect(dialog.$.ampm, "onclick", this, "handleDateChange");
	dialog.connect(dialog.$.okButton, "onclick", this, "okClicked");
	dialog.connect(dialog.$.cancelButton, "onclick", this, "cancelClicked");
	wm.DateTime.dialog.fixPositionNode = this.editor.domNode;
	this._initialDisplayValue = this.getDisplayValue();
	var date = new Date(this.getDataValue());

	this._initializingDialog = true;
	wm.DateTime.dialog.$.calendar.setDate(date);
	if (this.dateElements != "Date") {
	    var time = dojo.date.locale.format(date, {selector:'time',timePattern: "hh:mm a"});
	    var timematches = time.match(/^(\d\d)\:(\d\d) (.*)$/);
	    wm.DateTime.dialog.$.hours.setDataValue(timematches[1]);
	    wm.DateTime.dialog.$.minutes.setDataValue(timematches[2]);
	    wm.DateTime.dialog.$.ampm.setClicked(timematches[3].toLowerCase() == "pm");
	}
	wm.DateTime.dialog.$.panel1.setShowing(this.dateElements != "Date");
	wm.DateTime.dialog.$.calendar.setShowing(this.dateElements != "Time");
	wm.DateTime.dialog.$.label.setShowing(this.dateElements == "Date and Time");
	wm.DateTime.dialog.buttonBar.setShowing(this.dateElements != "Date");
	
	switch(this.dateElements) {
	case "Time":
	    dialog.setHeight((this.timePanelHeight + 
			      dialog.buttonBar.bounds.h + 			      
			     dialog.padBorderMargin.t + 
			     dialog.padBorderMargin.b +
			     dialog.containerWidget.padBorderMargin.t + 
			     dialog.containerWidget.padBorderMargin.b) + "px");
	    break;
	case "Date":
	    dialog.setHeight((parseInt(wm.dijit.Calendar.prototype.height) +
			     //dialog.buttonBar.bounds.h + 
			     dialog.padBorderMargin.t + 
			     dialog.padBorderMargin.b +
			     dialog.containerWidget.padBorderMargin.t + 
			     dialog.containerWidget.padBorderMargin.b) + "px");
	    break;
	case "Date and Time":
	    dialog.setHeight((this.timePanelHeight + 
			     parseInt(wm.dijit.Calendar.prototype.height) +
			     dialog.buttonBar.bounds.h + 
			      dialog.$.label.bounds.h + 
			     dialog.padBorderMargin.t + 
			     dialog.padBorderMargin.b +
			     dialog.containerWidget.padBorderMargin.t + 
			      dialog.containerWidget.padBorderMargin.b) + "px");
	    break;
	}
	wm.DateTime.dialog.show();
	delete this._initializingDialog;
	var displayValue = dojo.date.locale.format(date, {formatLength: "medium", selector: this.dateElements.toLowerCase()});
	wm.DateTime.dialog.$.label.setCaption(displayValue);
    },
    handleDateChange: function() {
	if (this._initializingDialog) return;	
	if (this.dateElements != "Time") {
	    var date = wm.DateTime.dialog.$.calendar.getDateObject(this.dateElements == "Date");
	    if (this.dateElements == "Date and Time") {
		date.setUTCHours(0);
		date.setUTCMinutes(0);
		date.setUTCSeconds(0);
	    }
	} else {
	    var date = new Date(0);
	}
	if (this.dateElements != "Date") {

	    var hour = wm.DateTime.dialog.$.hours.getDataValue() || 1;
	    var minute = wm.DateTime.dialog.$.minutes.getDataValue() || 0;
	    hour = String(hour).length == 1 ? "0" + hour : String(hour);
	    minute = String(minute).length == 1 ? "0" + minute : String(minute);
	    var timestr = hour + ":" + minute + " " + (wm.DateTime.dialog.$.ampm.clicked ? "PM":"AM");
	    var time = dojo.date.locale.parse(timestr, {selector:'time',timePattern: "hh:mm a"});
	} else {
	    time = new Date(0);
	}
	var displayValue1 = dojo.date.locale.format(new Date(date.getTime() + time.getTime()), {formatLength: "medium", selector: this.dateElements.toLowerCase()});
	wm.DateTime.dialog.$.label.setCaption(displayValue1);

	if (this.dateElements == "Date") {
	    var displayValue2 = dojo.date.locale.format(new Date(date.getTime() + time.getTime()), {formatLength: this.formatLength, selector: this.dateElements.toLowerCase()});
	    this.setDisplayValue(displayValue2);
	    wm.DateTime.dialog.hide();
	} else {
	    var displayValue2 = dojo.date.locale.format(new Date(date.getTime() + time.getTime()), {formatLength: this.formatLength, selector: this.dateElements.toLowerCase()});
	    this.setDisplayValue(displayValue2);
	}

    },
	getDisplayValue: function() {
	    if (this.editor)
		return this.editor.get("displayedValue");
	    else if (this.dataValue)
		return dojo.date.locale.format(this.dataValue, {formatLength: this.formatLength, selector: this.dateElements.toLowerCase()});
	    else
		return "";
	},
    setEditorValue: function(inValue) {
	var d;
	if (inValue instanceof Date) {
	    d = inValue;
	} else if (String(inValue).match(/^\d+$/)) {
	    d = new Date(inValue); // its a long
	} else if (inValue) {
	    d =  wm.convertValueToDate(inValue, {formatLength: this.formatLength, selector: this.dateElements.toLowerCase()});
	}

	var displayValue = null;
	if (d && d.getTime() != NaN) {
	    displayValue = dojo.date.locale.format(d, {formatLength: this.formatLength, selector: this.dateElements.toLowerCase()});
	    if (this.dateElements == "Date" && !this.useLocalTime)
		d.setHours(d.getHours() + wm.serverTimeOffset + d.getTimezoneOffset()/60);
	} else
	    d = null;
	this.inherited(arguments, [displayValue]);
	this.dataValue = d;
    },
    getEditorValue: function() {
	var value = this.getDisplayValue();
	var date = dojo.date.locale.parse(value, {formatLength: this.formatLength, selector: this.dateElements.toLowerCase()});
	if (date) {
	    if (this.dateElements == "Date") {
		if (!this.useLocalTime)
		    date.setHours(-wm.serverTimeOffset - date.getTimezoneOffset()/60,0,0);
	    }

	    return date.getTime();
	}
	return null;
    },
    okClicked: function() {
	wm.DateTime.dialog.hide();
	this.changed();
    },
    cancelClicked: function() {
	wm.DateTime.dialog.hide();
	this.setDisplayValue(this._initialDisplayValue);
    },
    setDateElements: function(inValue) {
	// must get value before changing formatLength because formatLength determines how to parse the value
	var value = this.getDataValue();
	this.dateElements = inValue; 
	this.setDataValue(value);
	this.listProperties().useLocalTime.tmpignore = (inValue != "Date");
    }


});

wm.Object.extendSchema(wm.DateTime, {
    changeOnKey: { ignore: 1 },
    invalidMessage: {group: "validation", order: 3},
    showMessages: {group: "validation", order: 4},
    promptMessage: {group: "Labeling", order: 6},
    password: {ignore:1},
    regExp: {ignore:1},
    maxChars: {ignore:1},
    changeOnKey: {ignore: 1}
});

wm.DateTime.extend({
    makePropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "formatLength":
	    return makeSelectPropEdit(inName, inValue, ["short", "medium", "long"], inDefault);
	case "dateElements":
	    return makeSelectPropEdit(inName, inValue, ["Date and Time", "Date", "Time"], inDefault);
	}
	return this.inherited(arguments);
    },
    setFormatLength: function(inValue) {
	// must get value before changing formatLength because formatLength determines how to parse the value
	var value = this.getDataValue();
	this.formatLength = inValue; 
	this.setDataValue(value);
    }
});