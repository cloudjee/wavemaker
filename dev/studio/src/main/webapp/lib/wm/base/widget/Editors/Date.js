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
        getEditorConstraints: function() {
	    var constraints = {};	
		if (this.minimum)
		    constraints.min = this.convertValue(this.minimum);
		if (this.maximum)
		    constraints.max = this.convertValue(this.maximum);
	    return constraints;
	},
	getEditorProps: function(inNode, inProps) {
	    var constraints = this.getEditorConstraints();

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
		    d.setHours(-wm.timezoneOffset,0,0);
		return d.getTime();
	    }
	    return this.makeEmptyValue();
	},
	setEditorValue: function(inValue) {
	    var v = this.convertValue(inValue); // if inValue is just a date, returns unmodified date

	    // If we assume that this is server time, then we need to add some number of hours to it so that instead of showing the date in local time, we show the date as it is according to the server
	    if (!this.useLocalTime && v) {
		v = new Date(v); // don't modify the source data as the called may still need it 
		v.setHours(v.getHours() + wm.timezoneOffset);
	    }
	    this.inherited(arguments, [v]);
	},
        setDefaultOnInsert:function() {
	    if (this.defaultInsert) {
		if (this.$.binding && this.$.binding.wires.defaultInsert)
		    this.$.binding.wires.defaultInsert.refreshValue();
		this.setDataValue(this.defaultInsert); // setDataValue knows how to handle Date and long; dijit.set apparently does not.
		this.invalidate();
	    }
	},

    /* Note that the definition of what are legal values is based on the conversions done by getEditorConstraints */
	setMaximum: function(inMax) {
	    if (!inMax) {
		this.maximum = null;
	    } else {
		this.maximum = inMax;
	    }
	    if (this.editor) {
		this.editor._setConstraintsAttr(this.getEditorConstraints());
		this.editor.validate();
	    }
	},
	setMinimum: function(inMin) {
	    if (!inMin) {
		this.minimum = null;
	    } else {
		this.minimum = inMin;
	    }
	    if (this.editor) {
		this.editor._setConstraintsAttr(this.getEditorConstraints());
		this.editor.validate();
	    }
	},



    updateIsDirty: function() {
	var wasDirty = this.isDirty;
	var isDirty = true;
	if (this.dataValue) {
	    var dataValue = new Date(this.dataValue);
	    dataValue.setHours(0);
	    dataValue.setMinutes(0);
	    dataValue.setSeconds(0);
	}
	if (this._lastValue) {
	    var lastValue = new Date(this._lastValue);
	    lastValue.setHours(0);
	    lastValue.setMinutes(0);
	    lastValue.setSeconds(0);
	}

	if (dataValue && lastValue && dataValue.getTime() == lastValue.getTime()) {
	    isDirty = false;
	} else if ((this.dataValue === "" || this.dataValue === null || this.dataValue === undefined) &&
		   (this._lastValue === "" || this._lastValue === null || this._lastValue === undefined)) {
	    isDirty = false;
	}
	this.valueChanged("isDirty", this.isDirty = isDirty);
	if (wasDirty != this.isDirty)
	    dojo.toggleClass(this.domNode, "isDirty", this.isDirty);
	if (!app.disableDirtyEditorTracking)
	    wm.fire(this.parent, "updateIsDirty");
    }

});

//===========================================================================
// Time Editor
//===========================================================================
dojo.declare("wm.Time", wm.Date, {
	timePattern:'HH:mm a',
    setDataValue: function(inValue) {
	if (inValue) {
	    var d = new Date(inValue);
	    d.setYear(1970);
	    d.setMonth(0);
	    d.setDate(1);	    
	}
	this.inherited(arguments, [inValue ? d.getTime() : null]);
    },
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
	getEditorValue: function() {
	    var d = wm.Text.prototype.getEditorValue.call(this);
	    if (d) {
		if (!this.useLocalTime)
		    d.setHours(d.getHours()-wm.timezoneOffset);
		return d.getTime();
	    }
	    return this.makeEmptyValue();
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "timePattern":
			    return makeSelectPropEdit(inName, inValue, ["HH:mm", "HH:mm:ss", "HH:mm a", "HH:mm:ss a"], inDefault);
		}
		return this.inherited(arguments);
	},

    updateIsDirty: function() {
	var wasDirty = this.isDirty;
	var isDirty = true;
	var dataValue = this.dataValue ? dojo.date.locale.format(new Date(this.dataValue), {timePattern: this.timePattern, selector: "time"}) : null;
	var lastValue = this._lastValue ? dojo.date.locale.format(new Date(this._lastValue), {timePattern: this.timePattern, selector: "time"}) : null;

	isDirty =  (dataValue != lastValue);
	this.valueChanged("isDirty", this.isDirty = isDirty);
	if (wasDirty != this.isDirty)
	    dojo.toggleClass(this.domNode, "isDirty", this.isDirty);
	if (!app.disableDirtyEditorTracking)
	    wm.fire(this.parent, "updateIsDirty");
    }

});





wm.Object.extendSchema(wm.Date, {
    changeOnKey: { ignore: 1 },
    minimum: {group: "editor", order: 2,  doc: 1, bindTarget: true},
    maximum: {group: "editor", order: 3, doc: 1, bindTarget: true}, 
    format:  {group: "editor", doc: 0, ignore: 1},
    invalidMessage: {group: "validation", order: 3},
    showMessages: {group: "validation", order: 4},
    promptMessage: {group: "Labeling", order: 6},
    password: {ignore:1},
    regExp: {ignore:1},
    maxChars: {ignore:1},
    resetButton: {ignore: 1}
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
    dateMode: "Date and Time",
/*
    _createEditor: function(inNode, inProps) {
	var e = this.inherited(arguments);
	var node = document.createElement("div");
	node.innerHTML = "<div class='dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer' role='presentation' ><input class='dijitReset dijitInputField dijitArrowButtonInner' value='▼ ' type='text' tabindex='-1' readonly='readonly' role='presentation'></div>";
	e.domNode.appendChild(node.firstChild);
	this._arrowNode = e.domNode.firstChild;
	e.domNode.appendChild(e.domNode.firstChild); // make the first child the last child
	dojo.destroy(node);
	dojo.addClass(e.domNode, "dijitComboBox");
	return e;
    },
    */
    init: function( ){
	this.inherited(arguments);
        this.subscribe("wm.AbstractEditor-focused", this, function(inEditor) {
	    var dialog = wm.DateTime.dialog;
	    if (dialog) {
		if (this != inEditor && dialog.$.hours != inEditor && dialog.$.minutes != inEditor && dialog._currentEditor == this && inEditor instanceof wm.DateTime == false) {
                    wm.DateTime.dialog.dismiss();
		}
            }
        });
    },
    doOnblur: function() {
	this.inherited(arguments);

	// If we lose focus on the datetime editor when only picking a date, then dismiss the dialog
	// unless the focus is now on the dialog itself
	if (this.dateMode == "Date" && wm.DateTime.dialog && wm.DateTime.dialog.showing) {
	    var node = document.activeElement;
	    if (!dojo.isDescendant(node, this.domNode) && !dojo.isDescendant(node, wm.DateTime.dialog.domNode))
		wm.DateTime.dialog.hide();
	}
    },
    doOnfocus: function() {	
	this.inherited(arguments);
	wm.onidle(this, function() {
	    if (!wm.DateTime.dialog) {	    
		var dialog = wm.DateTime.dialog = new wm.Dialog({_classes: {domNode: ["wmdatetimedialog"]}, owner: app, "height":"252px","title":"","width":"210px", modal: false, useContainerWidget:true, useButtonBar: true, name: "_DateTimeDialog", corner: "bc"});
		dialog.containerWidget.setPadding("1");
		dialog.containerWidget.createComponent(	
		    "mainPanel", "wm.Container", 
		    {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"border":"0","height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"},
		    {},
		    {
			calendar: ["wm.dijit.Calendar", {useLocalTime: true, "border":"0", height: "180px", width: "100%"}, {onValueSelected: "handleDateChange"}],
			panel1: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
			    hours: ["wm.Number", {"caption":"Hour","captionAlign":"left","captionPosition":"top","captionSize":"20px","changeOnKey":true,"displayValue":"","height":"43px","maximum":12,"minimum":1,"padding":"2","spinnerButtons":true,"width":"56px"}, {}],
			    minutes: ["wm.Number", {"caption":"Minute","captionAlign":"left","captionPosition":"top","captionSize":"20px","changeOnKey":true,"displayValue":"","height":"43px","maximum":59,"minimum":0,"padding":"2","spinnerButtons":true,"width":"56px"}, {}],
			    ampm: ["wm.ToggleButton", {"captionDown":"PM","captionUp":"AM","height":"21px",width: "50px", "margin":"0,0,2,0"}, {}]
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

	    /* So as to not screw with default dialog connections such as keydown, we're going to connect everything to the containerWidget */
	    var containerWidget = dialog.containerWidget;
	    containerWidget._disconnect();
	    containerWidget.connect(dialog.$.calendar, "onValueSelected", this,"handleDateChange");
	    containerWidget.connect(dialog.$.hours, "onchange", this, "handleDateChange");
	    containerWidget.connect(dialog.$.minutes, "onchange", this, "handleDateChange");
	    dialog.$.minutes.editor.set("smallDelta", 5);
	    containerWidget.connect(dialog.$.ampm, "onclick", this, "handleDateChange");
	    containerWidget.connect(dialog.$.okButton, "onclick", this, "okClicked");
	    containerWidget.connect(dialog.$.cancelButton, "onclick", this, "cancelClicked");
	    wm.DateTime.dialog.fixPositionNode = this.editor.domNode;
	    this._initialDisplayValue = this.getDisplayValue();
	    dialog._currentEditor = this;

	    // Make the calendar focus on the date shown by the current value of the text; ignore timezone offset calcs for this
	    // or you risk showing the user a date in calendar other than what is shown in text
	    if (!this.useLocalTime && this.dateMode == "Date") {
		var value = this.getDisplayValue();
		var date = dojo.date.locale.parse(value, {formatLength: this.formatLength, fullYear: true, selector: this.dateMode.toLowerCase()});
	    } else {
		var date = new Date(this.getDataValue());
	    }


	    this._initializingDialog = true;
	    if (date && date.getTime())
		wm.DateTime.dialog.$.calendar.setDate(date);
	    else
		wm.DateTime.dialog.$.calendar.dijit.goToToday();
	    if (this.dateMode != "Date") {
		var time = dojo.date.locale.format(date, {selector:'time',timePattern: "hh:mm a"});
		var timematches = time.match(/^(\d\d)\:(\d\d) (.*)$/);
		wm.DateTime.dialog.$.hours.setDataValue(timematches[1]);
		wm.DateTime.dialog.$.minutes.setDataValue(timematches[2]);
		wm.DateTime.dialog.$.ampm.setClicked(timematches[3].toLowerCase() == "pm");
	    }
	    wm.DateTime.dialog.$.panel1.setShowing(this.dateMode != "Date");
	    wm.DateTime.dialog.$.calendar.setShowing(this.dateMode != "Time");
	    wm.DateTime.dialog.$.label.setShowing(this.dateMode == "Date and Time");
	    wm.DateTime.dialog.buttonBar.setShowing(this.dateMode != "Date");
	    
	    switch(this.dateMode) {
	    case "Time":
		dialog.setHeight((this.timePanelHeight + 
				  dialog.buttonBar.bounds.h + 			      
				  dialog.padBorderMargin.t + 
				  dialog.padBorderMargin.b +
				  dialog.containerWidget.padBorderMargin.t + 
				  dialog.containerWidget.padBorderMargin.b) + "px");
		break;
	    case "Date":
		dialog.setHeight((dialog.$.calendar.bounds.h +
				  //dialog.buttonBar.bounds.h + 
				  dialog.padBorderMargin.t + 
				  dialog.padBorderMargin.b +
				  dialog.containerWidget.padBorderMargin.t + 
				  dialog.containerWidget.padBorderMargin.b) + "px");
		break;
	    case "Date and Time":
		dialog.setHeight((this.timePanelHeight + 
				  dialog.$.calendar.bounds.h +
				  dialog.buttonBar.bounds.h + 
				  dialog.$.label.bounds.h + 
				  dialog.padBorderMargin.t + 
				  dialog.padBorderMargin.b +
				  dialog.containerWidget.padBorderMargin.t + 
				  dialog.containerWidget.padBorderMargin.b) + "px");
		break;
	    }
	    delete this._initializingDialog;	
	    wm.DateTime.dialog.show();
	    this._setupDialogValues = true;
	    this.handleDateChange();
	    delete this._setupDialogValues;
	    var editor = this.editor;
	    wm.job(this.getRuntimeId() + ".blur", 50, dojo.hitch(this, function() {
		if (wm.DateTime.dialog.$.calendar.showing)
		    wm.DateTime.dialog.$.calendar.focus();
		else
		    wm.DateTime.dialog.$.hours.focus();
	    }));
	});
    },
    handleDateChange: function() {
	if (this._initializingDialog) return;	
	if (this.dateMode != "Time") {
	    var date = new Date(wm.DateTime.dialog.$.calendar.getDateValue());
	} else {
	    var date = new Date(0);
	}
	if (this.dateMode != "Date") {
	    var hour = wm.DateTime.dialog.$.hours.getDataValue() || 1;
	    var minute = wm.DateTime.dialog.$.minutes.getDataValue() || 0;
	    var isPM = wm.DateTime.dialog.$.ampm.clicked;
	    date.setHours(hour + (isPM ? 12 : 0), minute);
	}

	var displayValue1 = dojo.date.locale.format(date, {formatLength: "medium", selector: this.dateMode.toLowerCase()});
	wm.DateTime.dialog.$.label.setCaption(displayValue1);

	if (this.dateMode == "Date") {
	    var displayValue2 = dojo.date.locale.format(new Date(date.getTime() ), {formatLength: this.formatLength, fullYear: true, selector: this.dateMode.toLowerCase()});
	    this.setDisplayValue(displayValue2);
	    if (!this._setupDialogValues)
		wm.DateTime.dialog.hide();
	} else {

	    var displayValue2 = dojo.date.locale.format(date, {formatLength: this.formatLength, fullYear: true, selector: this.dateMode.toLowerCase()});
	    this.setDisplayValue(displayValue2);
    }

    },
    calcDisplayValue: function(inDate) {
	var d = inDate;
	if (d instanceof Date == false)
	    d = new Date(inDate);
	return dojo.date.locale.format(d, {formatLength: this.formatLength, fullYear: true, selector: this.dateMode.toLowerCase()});
    },	
	getDisplayValue: function() {
	    if (this.editor)
		return this.editor.get("displayedValue");
	    else if (this.dataValue)
		return this.calcDisplayValue(this.dataValue);
	    else
		return "";
	},
    setEditorValue: function(inValue) {
	var d;
	if (inValue instanceof Date) {
	    d = new Date(inValue); // else our date calculations modify the input object which can cause ugly side effects
	} else if (String(inValue).match(/^\d+$/)) {
	    d = new Date(inValue); // its a long
	} else if (inValue) {
	    d =  wm.convertValueToDate(inValue, {formatLength: this.formatLength, selector: this.dateMode.toLowerCase()});
	}

	var displayValue = null;
	if (d && d.getTime() != NaN) {
	    if (this.dateMode == "Date" && !this.useLocalTime)
		d.setHours(d.getHours() + wm.timezoneOffset);
	    displayValue = dojo.date.locale.format(d, {formatLength: this.formatLength, fullYear: true, selector: this.dateMode.toLowerCase()});
	} else
	    d = null;
	this.inherited(arguments, [displayValue]);
    },
    setDefaultOnInsert:function(){
	if (this.defaultInsert) {
	    if (this.$.binding && this.$.binding.wires.defaultInsert)
		this.$.binding.wires.defaultInsert.refreshValue();
	    this.setDataValue(this.defaultInsert);
	    this.invalidate();
	}
    },
    getEditorValue: function() {
	var value = this.getDisplayValue();
	var date = dojo.date.locale.parse(value, {formatLength: this.formatLength, fullYear: true, selector: this.dateMode.toLowerCase()});
	if (date) {
	    if (this.dateMode == "Date") {
		if (!this.useLocalTime)
		    date.setHours(-wm.timezoneOffset,0,0);
		else
		    date.setHours(0,0,0);
	    }
	    return date.getTime();
	}
	return null;
    },
    updateIsDirty: function() {
	var wasDirty = this.isDirty;
	var isDirty = true;
	var dataValue = this.calcDisplayValue(this.dataValue);
	var lastValue = this.calcDisplayValue(this._lastValue);
	if (dataValue == lastValue) {
	    isDirty = false;
	} else if ((this.dataValue === "" || this.dataValue === null || this.dataValue === undefined) &&
		   (this._lastValue === "" || this._lastValue === null || this._lastValue === undefined)) {
	    isDirty = false;
	}
	this.valueChanged("isDirty", this.isDirty = isDirty);
	if (wasDirty != this.isDirty)
	    dojo.toggleClass(this.domNode, "isDirty", this.isDirty);
	if (!app.disableDirtyEditorTracking)
	    wm.fire(this.parent, "updateIsDirty");
    },
    setDisabled: function(inDisabled) {
	this.inherited(arguments);
	if (this.disabled && wm.DateTime.dialog && wm.DateTime.dialog._currentEditor == this)
	    wm.DateTime.dialog.hide();
    },
    setShowing: function(inDisabled) {
	this.inherited(arguments);
	if (!this.showing && wm.DateTime.dialog && wm.DateTime.dialog._currentEditor == this)
	    wm.DateTime.dialog.hide();
    },
    setReadonly: function(inDisabled) {
	this.inherited(arguments);
	if (this.readonly && wm.DateTime.dialog && wm.DateTime.dialog._currentEditor == this)
	    wm.DateTime.dialog.hide();
    },
    destroy: function(inDisabled) {
	if (wm.DateTime.dialog && wm.DateTime.dialog._currentEditor == this)
	    wm.DateTime.dialog.hide();
	this.inherited(arguments);
    },
    okClicked: function() {
	wm.DateTime.dialog.hide();
	this.changed();
    },
    cancelClicked: function() {
	wm.DateTime.dialog.hide();
	this.setDisplayValue(this._initialDisplayValue);
    },
    setDateMode: function(inValue) {
	// must get value before changing formatLength because formatLength determines how to parse the value
	var value = this.getDataValue();
	this.dateMode = inValue; 
	this.setDataValue(value);
    },
    listProperties: function() {
	var p = this.inherited(arguments);
	p.useLocalTime.ignoretmp = (this.dateMode != "Date");
	return p;
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
    changeOnKey: {ignore: 1},

    dateMode: {group: "editor", order: 2},
    formatLength: {group: "editor", order: 3},
    resetButton: {ignore: 1},
    timePanelHeight: {group: "style"},
    useLocalTime: {group: "editor", order: 4}
});

wm.DateTime.extend({
    makePropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "formatLength":
	    return makeSelectPropEdit(inName, inValue, ["short", "medium", "long"], inDefault);
	case "dateMode":
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