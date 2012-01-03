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
        dateMode: "Date",
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
	    return wm.convertValueToDate(inValue, {selector: this.dateMode.toLowerCase(), formatLength: this.formatLength, timePattern: this.use24Time ? "HH:mm" : "hh:mm a"});
	},
	getEditorValue: function() {
	    var d = this.inherited(arguments);
	    if (d) {
		if (!this.useLocalTime) {
		    if (this.dateMode == "Date") {
			d.setHours(-wm.timezoneOffset,0,0);
		    } else {
			d = dojo.date.add(d,"hour",-wm.timezoneOffset);
		    }
		}
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
    calcDisplayValue: function(inDate) {
	var d = inDate;
	if (d instanceof Date == false)
	    d = new Date(inDate);
	return dojo.date.locale.format(d, {formatLength: this.formatLength, fullYear: true, selector: this.dateMode.toLowerCase(), timePattern: this.use24Time ?'HH:mm' : "hh:mm a"});

    },	
	getDisplayValue: function() {
	    if (this.editor)
		return this.editor.get("displayedValue");
	    else if (this.dataValue)
		return this.calcDisplayValue(this.dataValue);
	    else
		return "";
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


    calcIsDirty: function(val1, val2) {
	if (val1 === undefined || val1 === null)
	    val1 = 0;
	if (val2 === undefined || val2 === null)
	    val2 = 0;

	if (val1 instanceof Date == false) {
	    val1 = new Date(val1);
	}
	if (val2 instanceof Date == false) {
	    var val2 = new Date(val2);
	}

	if (val1 && val2 && val1.getTime() == val2.getTime()) {
	    return false;
	}
	val1 = dojo.date.locale.format(val1, {formatLength: this.formatLength || "short", selector: this.dateMode.toLowerCase(), timePattern: this.use24Time ?'HH:mm' :  "hh:mm a"});
	val2 = dojo.date.locale.format(val2, {formatLength: this.formatLength || "short", selector: this.dateMode.toLowerCase(), timePattern: this.use24Time ?'HH:mm'  : "hh:mm a"});

	return val1 != val2;
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

    calcIsDirty: function(val1, val2) {
	if (val1 === undefined || val1 === null)
	    val1 = 0;
	if (val2 === undefined || val2 === null)
	    val2 = 0;

	if (val1 instanceof Date == false) {
	    val1 = new Date(val1);
	}
	if (val2 instanceof Date == false) {
	    var val2 = new Date(val2);
	}

	if (val1 && val2 && val1.getTime() == val2.getTime()) {
	    return false;
	}
	val1 = dojo.date.locale.format(val1, {timePattern: this.timePattern, selector: "time"});
	val2 = dojo.date.locale.format(val2, {timePattern: this.timePattern, selector: "time"});

	return val1 != val2;
    }

});


dojo.declare("wm.DateTime", wm.Date, {
    use24Time: false,
    formatLength: "short",
    dateMode: "Date and Time",
    getEditorConstraints: function() {
	var constraints = this.inherited(arguments);
	constraints.formatLength = this.formatLength;
	constraints.timePattern = this.use24Time ? "HH:mm" : "hh:mm a";
	return constraints;
    },
    getEditorProps: function(inNode, inProps) {
	var p = this.inherited(arguments);
	p._selector = this.dateMode == "Date and Time" ? "datetime" : this.dateMode.toLowerCase();
	p.use24Time = this.use24Time;
	return p;
    },
    _createEditor: function(inNode, inProps) {
	var e = dijit.form.DateTimeTextBox(this.getEditorProps(inNode, inProps));
	if (wm.isMobile) {
	    dojo.attr(e.focusNode, "readonly", true);
	}
	return e;
    },
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

    setEditorValue: function(inValue) {
	var d;
	if (inValue instanceof Date) {
	    d = new Date(inValue); // else our date calculations modify the input object which can cause ugly side effects
	} else if (String(inValue).match(/^\d+$/)) {
	    d = new Date(inValue); // its a long
	} else if (inValue) {
	    d =  wm.convertValueToDate(inValue, {formatLength: this.formatLength, selector: this.dateMode.toLowerCase(), timePattern: this.use24Time ?'HH:mm'  : "hh:mm a"});
	}

	var displayValue = null;
	if (d && d.getTime() != NaN) {
	    if (!this.useLocalTime)
		d.setHours(d.getHours() + wm.timezoneOffset);
	    displayValue = this.calcDisplayValue(d);
	} else
	    d = null;
	this.inherited(arguments, [displayValue]);
    },

/*
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
    */
    setDateMode: function(inValue) {
	// must get value before changing formatLength because formatLength determines how to parse the value
	var value = this.getDataValue();
	this.dateMode = inValue; 
	this.setDataValue(value);
    }

});

dojo.declare(
	"dijit.form.DateTimeTextBox",
	dijit.form._DateTimeTextBox,
	{
	    forceWidth: false, // Force the popup to use its own width and not match the editor width
	    autoWidth: false,// Force the popup to use its own width and not match the editor width
	    baseClass: "dijitTextBox dijitComboBox dijitDateTextBox", // use these classes in the editor
	    popupClass: "wm.DateTimePicker", // name of the class to use for the popup (since I have my own openDropDown this may be ignored)
	    _selector: "datetime",  // used in dojo.date.parse/format
	    value: new Date(""),
	    openDropDown: function(/*Function*/ callback){
		    if (!wm.DateTimePicker.dialog) {
			wm.DateTimePicker.dialog = new wm.DateTimePicker({owner: this,
										name: "DateTimePopup"});
		    }
		    this.dropDown = wm.DateTimePicker.dialog;
		    this.dropDown._updating = true;
		switch(this._selector) {
		case "datetime":
		    this.dropDown.calendar.show();
		    this.dropDown.panel.show();
		    this.dropDown.currentValueEditor.setDateMode("Date and Time");
		    //this.dropDown.buttonPanel.show();
		    break;
		case "time":
		    this.dropDown.calendar.hide();
		    this.dropDown.panel.show();
		    this.dropDown.currentValueEditor.setDateMode("Time");
		    //this.dropDown.buttonPanel.show();
		    break;
		case "date":
		    this.dropDown.calendar.show();
		    this.dropDown.panel.hide();
		    this.dropDown.currentValueEditor.setDateMode("Date");
		    //this.dropDown.buttonPanel.hide();
		}
		this.dropDown.currentValueEditor.setDataValue(this.get("value"));
		this.dropDown.setUse24Time(this.use24Time);
		this.dropDown.setHeight(this.dropDown.getPreferredFitToContentHeight() + "px");

		
		    this.dropDown._currentDijit = this;

		var result = dijit._HasDropDown.prototype.openDropDown.call(this, callback);

		if (wm.isMobile && (app.appRoot.deviceSize == "tiny" || Number(app.appRoot.deviceSize) <= 450)) {		   
		    var h = (this._selector == "time") ? 190 :app.appRoot.bounds.h - 10;
			dojo.marginBox(this.dropDown.domNode.parentNode, {l: 5,
							      t: 5,
							      w:app.appRoot.bounds.w - 10,
									  h:h});
		    this.dropDown.setWidth(app.appRoot.bounds.w - 10 + "px");
		    this.dropDown.setHeight(h + "px");
		    this.dropDown.reflow();
		} else if (wm.isMobile) {
		    this.dropDown.setWidth(Math.min(350,app.appRoot.bounds.w) + "px");
		switch(this._selector) {
		case "datetime":
		    this.dropDown.setHeight(Math.min(490, app.appRoot.bounds.h) + "px");
		    break;
		case "date":
		    this.dropDown.setHeight(Math.min(340, app.appRoot.bounds.h) + "px");
		    break;
		case "time":
		    this.dropDown.setHeight(Math.min(190, app.appRoot.bounds.h) + "px");
		    break;
		}	
		    this.dropDown.reflow();
		}
		this.dropDown.buttonPanel.setShowing(wm.isMobile && this._selector != "date"); 
		this.dropDown.callOnShowParent();
		    this.dropDown.setDataValue(this.get("value"));
		if (this._selector != "time") {
		    this.dropDown.setMinimum(this.constraints.min);
		    this.dropDown.setMaximum(this.constraints.max);
		}
		    this.dropDown._updating = false;
		if (this.dropDown.calendar.showing)
		    this.dropDown.calendar.focus();
		else
		    this.dropDown.hours.focus();
		return result;
	    }
	});

dojo.require("wm.base.widget.Container");
dojo.declare("wm.DateTimePicker", wm.Container, {
    use24Time: false,
    border: "1",
    borderColor: "#333",    
    height: "452px",
    width: "210px",
    padding: "0",
    margin: "0",
    classNames: "wmdialog MainContent",
    horizontalAlign: "left",
    verticalAlign: "top",
    dataValue: null,
    prepare: function(inProps) {
	inProps.owner = app;
	this.inherited(arguments);
    },
    setUse24Time: function(inVal) {
	this.use24Time = inVal;
	this.ampm.setShowing(!inVal);
	var hours = [];
	for (var i = 1; i <= (inVal ? 24 : 12); i++) hours.push(String(i));
	this.hours.setOptions(hours);
    },
    postInit: function() {
	var onchange = dojo.hitch(this, "changed");
	this.calendar = new wm.dijit.Calendar({owner: this,
					       parent: this,
					       userLocalTime: true,
					       height: "180px",
					       mobileHeight: "100%",
					       width: "100%",
					       onValueSelected: onchange});
	this.panel = new wm.Panel({owner: this,
				   parent: this,
				   name: "dateTimePickerPanel",
				   layoutKind: "left-to-right",
				   horizontalAlign: "left",
				   verticalAlign: "center",
				   margin: "0,0,3,0",
				   width: "100%",
				   height: "150px"});
	
	this.hours = new wm.ListSet({owner: this,
					parent: this.panel,
				       searchBar:false,
				     _multiSelect:false,
				      name:"hours",
					caption: "Hour", // Localize
					captionAlign: "left",
					captionPosition: "top",
					captionSize: "22px",
					changeOnKey: true,
					displayValue: "",
					height: "100%",
					options: ["1","2","3","4","5","6","7","8","9","10","11","12"],
					padding: "2",					
					width: "100%",
					onchange: onchange});

	this.minutes = new wm.ListSet({owner: this,
				       searchBar:false,
				     _multiSelect:false,
				    parent: this.panel,
				    caption: "Minute", // Localize
					name:"minutes",
				    captionAlign: "left",
				    captionPosition: "top",
				    captionSize: "22px",
				    changeOnKey: true,
				    displayValue: "",
				       displayField: "dataValue",
				       dataField: "dataValue",
				    height: "100%",
				    padding: "2",
				    width: "100%",
				    onchange: onchange});
	var minutes = [];
	for (var min = 0; min < 60; min+=5) minutes.push(String(min));
	this.minutes.setOptions(minutes);
	this.ampm = new wm.ToggleButton({owner: this,
					 parent: this.panel,
					 name: "ampm",
					 captionDown: "PM",
					 captionUp: "AM",
					 height: "21px",
					 width: "50px",
					 margin: "0,4,2,0",
					 onclick: onchange});
	this.buttonPanel = new wm.Panel({owner: this,
				   parent: this,
			       _classes: {domNode: ["dialogfooter"]},
					 showing: wm.isMobile,
				   name: "dateTimePickerButtonPanel",
				   layoutKind: "left-to-right",
				   horizontalAlign: "left",
				   verticalAlign: "bottom",
				   width: "100%",
					 mobileHeight:  wm.Button.prototype.mobileHeight,
					 height: "32px"});
	this.okButton = new wm.Button({owner: this,
				       parent: this.buttonPanel,
			       name: "okButton",
			       caption: "OK",
			       width: "80px",
				       height: "100%",
				       onclick: dojo.hitch(this,"onOkClick")});
		new wm.Button({owner: this,
				       parent: this.buttonPanel,
			       name: "cancelButton",
			       caption: "Cancel",
			       width: "80px",
				       height: "100%",
			       onclick: dojo.hitch(this,"onCancelClick")});
	new wm.Spacer({owner: this,
		       parent: this.buttonPanel,
		       width: "100%"
		      });
	this.currentValueEditor = new wm.DateTime({owner: this,
						readonly: true,
						name: "currentValue",
						parent: this.buttonPanel,
						caption: "",
						height: "100%",
						width: "180px"
						  });
						   
	this.inherited(arguments);
	this.reflow();
    },

    changed: function() {
	if (this._updating) return;
	if (this.calendar.showing) {
	    var date = new Date(this.calendar.getDateValue());
	} else {
	    var date = new Date(0);
	}

	if (this.panel.showing) {
	    var hour = Number(this.hours.getDataValue()) || 1;
	    var minute = Number(this.minutes.getDataValue()) || 0;
	    var isPM = this.ampm.clicked;
	    date.setHours(hour + (isPM ? 12 : 0), minute);
	}
	this.dataValue = date;
	this.currentValueEditor.setDataValue(date);
	if (this._currentDijit) {
	    this._currentDijit.set("value", date);
	}
	if (this._currentDijit && this.calendar.showing && !this.panel.showing) {
	    this._currentDijit.closeDropDown();
	}
    },
    set: function(inName, inValue) {
	// ignore these calls
    },
    destroyRecursive: function() {}, // ignore this; don't let dojo decide when to destroy a popup shared across many widgets
    reflowParent: function() {
	this.reflow();
	this.renderBounds();
    },


    getContentBounds: function() {
	var b = this.inherited(arguments);
	b.l += this.borderExtents.l;
	b.t += this.borderExtents.t;
	return b;
    },
    setDataValue: function(inValue) {

	this._initialValue = inValue;
	var value;
	if (inValue instanceof Date) {
	    value = inValue;
	} else if (!inValue) {
	    value = "";
	} else {
	    value = wm.convertValueToDate(inValue);
	}
	this.dataValue = value;

	if (value) {
	    if (this.calendar.showing) {
		this.calendar.setDate(value);
	    }
	    if (this.panel.showing) {
		var time = dojo.date.locale.format(value, {selector:'time', timePattern: this.use24Time ?'HH:mm' : "hh:mm a"});
		if (this.use24Time) {
		    var timematches = time.match(/^(\d\d)\:(\d\d)$/);
		} else {
		    var timematches = time.match(/^(\d\d)\:(\d\d) (.*)$/);
		}
		this.minutes.setDataValue(timematches[2].replace(/^0*/,""));

		if (this.use24Time) {
		    this.hours.setDataValue(Number(timematches[1]));
		} else {
		    var isPM = timematches[3].toLowerCase() == "pm";
		    this.hours.setDataValue(timematches[1].replace(/^0*/,""));
		    this.ampm.setClicked(isPM);
		}
	    }		
	}
	this.currentValueEditor.setDataValue(value);
    },
    setMinimum: function(inMin) {this.calendar.setMinimum(inMin);},
    setMaximum: function(inMax) {this.calendar.setMaximum(inMax);},
    onOkClick: function() {
	if (this._currentDijit) {
	    this._currentDijit.closeDropDown();
	}
    },
    onCancelClick: function() {
	if (this._currentDijit) {
	    this._currentDijit.closeDropDown();
	    this._currentDijit.set("value",this._initialValue);
	}
    },
    onChange: function(inValue) {
    }
});