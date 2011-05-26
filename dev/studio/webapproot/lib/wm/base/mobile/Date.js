/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.mobile.Date");
dojo.require("wm.base.lib.date");
dojo.require("wm.base.mobile.Text");

/* TODO: Need to work on Time and the Time part of DateTime */

dojo.declare("wm.mobile.DateTime", wm.mobile.AbstractEditor, {
    classNames: "wmmobeditor wmmobeditor-datetime",
    useLocalTime: false,
    editorBorder: 0,
    timePanelHeight: 38,
    formatLength: "short",
    dateMode: "Date and Time", // "Date", "Time", "Date and Time"
    focused: function() {
	this.editor.blur();
	if (!this.dialog) {
	    this.dialog = new wm.mobile.Dialog({owner: this,
						title: this.caption,
						name: "dialog",
						animation: this._dialogAnimation || wm.mobile.Dialog.prototype.animation,
						height: "80%"});

	if (this.dateMode == "Date" ||
	    this.dateMode == "Date and Time") {
	    var panel = new wm.mobile.Container({owner: this,
						 parent: this.dialog.containerWidget,
						 name: "dialogPanel",
						 width: "100%", 
						 layoutKind: "left-to-right",
						 height: "100%"});

/*
	    this.monthSelector = new wm.mobile.SelectMenu({border: "1", borderColor: "#999999", owner: this, parent: panel, width: "50%", caption: "", captionSize: "", displayField: "name", dataField: "dataValue", onchange: dojo.hitch(this, "updateValues")});
	    this.dateSelector = new wm.mobile.SelectMenu({border: "1", borderColor: "#999999", owner: this, parent: panel, width: "25%", caption: "", captionSize: "", displayField: "dataValue", dataField: "dataValue", onchange: dojo.hitch(this, "updateValues")});
	    this.yearSelector = new wm.mobile.SelectMenu({border: "1", borderColor: "#999999", restrictValues: false, owner: this, parent: panel, width: "25%", caption: "", captionSize: "", displayField: "dataValue", dataField: "dataValue", onchange: dojo.hitch(this, "updateValueschanged")});
*/
	    this.monthSelector = new wm.mobile.BasicList({name: "monthSelector", 
							 selectionMode: "single",
							  useSearchBar: false,
							  useNewButton: false,
							  border: "1", 
							  borderColor: "#999999", 
							  owner: this,
							  parent: panel,
							  height: "100%",
							  width: "50%",
							  margin: "5",
							  border: "2",
							  borderColor: "#333333",
							  caption: "",
							  captionSize: "",
							  displayField: "name",
							  dataField: "dataValue",
							  onSelect: dojo.hitch(this, "updateValues")});
	    this.dateSelector = new wm.mobile.BasicList({name: "dateSelector",
							 selectionMode: "single",
							  useSearchBar: false,
							  useNewButton: false,
							 border: "1",
							 borderColor: "#999999",
							 owner: this,
							 parent: panel,
							 height: "100%",
							 width: "25%",
							  margin: "5",
							  border: "2",
							  borderColor: "#333333",
							 caption: "",
							 captionSize: "",
							 displayField: "dataValue",
							 dataField: "dataValue",
							 onSelect: dojo.hitch(this, "updateValues")});
	    this.yearSelector = new wm.mobile.BasicList({name: "yearSelector",
							 selectionMode: "single",
							 useSearchBar: false,
							  useNewButton: false,
							 border: "1",
							 borderColor: "#999999",
							 restrictValues: false,
							 owner: this,
							 parent: panel,
							 height: "100%",
							 width: "25%",
							  margin: "5",
							  border: "2",
							  borderColor: "#333333",
							 caption: "",
							 captionSize: "",
							 displayField: "dataValue",
							 dataField: "dataValue",
							 onSelect: dojo.hitch(this, "updateValues")});
	    
	    if (!wm.mobile.DateTime.MonthVar) {
		wm.mobile.DateTime.MonthVar = new wm.Variable({type: "EntryData", owner: this.getOwnerApp()});
		wm.mobile.DateTime.MonthVar.setData([{name: "Jan", dataValue: 0},
						     {name: "Feb", dataValue: 1},
						     {name: "Mar", dataValue: 2},
						     {name: "Apr", dataValue: 3},
						     {name: "May", dataValue: 4},
						     {name: "Jun", dataValue: 5},
						     {name: "Jul", dataValue: 6},
						     {name: "Aug", dataValue: 7},
						     {name: "Sep", dataValue: 8},
						     {name: "Oct", dataValue: 9},
						     {name: "Nov", dataValue: 10},
						     {name: "Dec", dataValue: 11}]);
	    }
	    this.monthSelector.setDataSet(wm.mobile.DateTime.MonthVar);

	    if (!wm.mobile.DateTime.DateVar) {	    
		wm.mobile.DateTime.DateVar = new wm.Variable({type: "NumberData", owner: this.getOwnerApp()});
		wm.mobile.DateTime.DateVar.setData([{dataValue: 1},
						    {dataValue: 2},
						    {dataValue: 3},
						    {dataValue: 4},
						    {dataValue: 5},
						    {dataValue: 6},
						    {dataValue: 7},
						    {dataValue: 8},
						    {dataValue: 9},
						    {dataValue: 10},
						    {dataValue: 11},
						    {dataValue: 12},
						    {dataValue: 13},
						    {dataValue: 14},
						    {dataValue: 15},
						    {dataValue: 16},
						    {dataValue: 17},
						    {dataValue: 18},
						    {dataValue: 19},
						    {dataValue: 20},
						    {dataValue: 21},
						    {dataValue: 22},
						    {dataValue: 23},
						    {dataValue: 24},
						    {dataValue: 25},
						    {dataValue: 26},
						    {dataValue: 27},
						    {dataValue: 28},
						    {dataValue: 29},
						    {dataValue: 30},
						    {dataValue: 31}]);
	    }						     
	this.dateSelector.setDataSet(wm.mobile.DateTime.DateVar);

	    if (!wm.mobile.DateTime.YearVar) {	    
		wm.mobile.DateTime.YearVar = new wm.Variable({type: "NumberData", owner: this.getOwnerApp(), isList: true});
		var currentYear = new Date().getFullYear();
		var yeardata = [];
		for (var i = currentYear - 50; i < currentYear + 50; i++)
		    yeardata.push({dataValue: i});
		wm.mobile.DateTime.YearVar.setData(yeardata);

	    }
	this.yearSelector.setDataSet(wm.mobile.DateTime.YearVar);
	}

	    if (this.dateMode == "Time" ||
		this.dateMode == "Date and Time") {
	    var panel = new wm.mobile.Container({owner: this,
						 parent: this.dialog.containerWidget,
						 name: "dialogPanel",
						 width: "100%", 
						 layoutKind: "left-to-right",
						 height: "100%"});

		this.hourSelector = new wm.mobile.BasicList({name: "hourSelector", 
							     selectionMode: "single",
							     useSearchBar: false,
							     useNewButton: false,
							     border: "1", 
							     borderColor: "#999999", 
							     owner: this,
							     parent: panel,
							     height: "100%",
							     width: "50%",
							     margin: "5",
							     border: "2",
							     borderColor: "#333333",
							     caption: "",
							     captionSize: "",
							     displayField: "name",
							     dataField: "dataValue",
							     onSelect: dojo.hitch(this, "updateValues")});
		
	    if (!wm.mobile.DateTime.HourVar) {
		wm.mobile.DateTime.HourVar = new wm.Variable({type: "EntryData", owner: this.getOwnerApp(), isList: true});
		
		for (var i = 1; i <= 12; i++) 
		    wm.mobile.DateTime.HourVar.addItem({name: i + " AM", dataValue: i == 12 ? 0 : i});
		for (var i = 1; i <= 12; i++) 
		    wm.mobile.DateTime.HourVar.addItem({name: i + " PM", dataValue: i == 12 ? 12 : 12 + i});
	    }
	    this.hourSelector.setDataSet(wm.mobile.DateTime.HourVar);


		this.minuteSelector = new wm.mobile.BasicList({name: "minuteSelector", 
							     selectionMode: "single",
							     useSearchBar: false,
							     useNewButton: false,
							     border: "1", 
							     borderColor: "#999999", 
							     owner: this,
							     parent: panel,
							     height: "100%",
							     width: "50%",
							     margin: "5",
							     border: "2",
							     borderColor: "#333333",
							     caption: "",
							     captionSize: "",
							     displayField: "name",
							     dataField: "dataValue",
							     onSelect: dojo.hitch(this, "updateValues")});
		
	    if (!wm.mobile.DateTime.MinuteVar) {
		wm.mobile.DateTime.MinuteVar = new wm.Variable({type: "EntryData", owner: this.getOwnerApp(), isList: true});
		
		for (var i = 0; i < 60; i+=5) 
		    wm.mobile.DateTime.MinuteVar.addItem({name: i < 10 ? "0" + i : i, dataValue: i});
	    }
	    this.minuteSelector.setDataSet(wm.mobile.DateTime.MinuteVar);





	    }

	this.labelValue = new wm.mobile.Label({owner: this,
					       parent: this.dialog.containerWidget,
					       name: "labelValue",
					       width: "100%",
					       height: "40px"});
	    this.labelValue.setDisplay(this.dateMode == "Date" ? "Date" : this.dateMode == "Time" ? "Time" : "DateTime");
	    this.labelValue.$.format.formatLength = "long";

	}
	this.labelValue.setCaption(this.dataValue);	

	this.selectDialogValues();
	this.dialog.show();
    },
    selectDialogValues: function() {
	var d = 0;
	try {
	    if (this.dataValue)
		d = new Date(this.dataValue);
	} catch(e) {}
	if (d) {
	    if (this.dateSelector)
		this.dateSelector.setSelectedField("dataValue", d.getDate());
	    if (this.monthSelector)
	    this.monthSelector.setSelectedField("dataValue", d.getMonth());
	    if (this.yearSelector)
		this.yearSelector.setSelectedField("dataValue", d.getFullYear());
	    if (this.hourSelector)	    
		this.hourSelector.setSelectedField("dataValue", d.getHours());
	    if (this.minuteSelector)	    
		this.minuteSelector.setSelectedField("dataValue", d.getMinutes());
	} else {
	    if (this.dateSelector)
		this.dateSelector.setSelectedIndex(-1);
	    if (this.monthSelector)
		this.monthSelector.setSelectedIndex(-1);
	    if (this.yearSelector)
		this.yearSelector.setSelectedField("dataValue", new Date().getFullYear());
	    if (this.hourSelector)	    
		this.hourSelector.setSelectedField("dataValue", 12);
	    if (this.minuteSelector)	    
		this.minuteSelector.setSelectedIndex(-1);
	}
    },
/*
    editorChanged: function() {
	this.inherited(arguments);
	this.setEditorValue(this.dataValue); // updates the display values
    },
    */
	convertValue: function(inValue) {
		return wm.convertValueToDate(inValue);
	},
    updateValues: function(inVariable, inData, inIndex, rowNode){
	try {
	    var d = new Date();
/*
	    d.setMonth(this.monthSelector.getDataValue());
	    d.setDate(this.dateSelector.getDataValue());
	    d.setFullYear(this.yearSelector.getDataValue());
	    */
	    if (this.monthSelector)
		d.setMonth(this.monthSelector.selectedItem.getValue("dataValue"));
	    else
		d.setMonth(0);
	    if (this.dateSelector)
		d.setDate(this.dateSelector.selectedItem.getValue("dataValue"));
	    else
		d.setDate(0);
	    if (this.yearSelector)
		d.setFullYear(this.yearSelector.selectedItem.getValue("dataValue"));
	    else
		d.setFullYear(0);
	    if (this.hourSelector)
		d.setHours(this.hourSelector.selectedItem.getValue("dataValue"));
	    else
		d.setHours(0);
	    if (this.minuteSelector)
		d.setMinutes(this.minuteSelector.selectedItem.getValue("dataValue"));
	    else
		d.setMinutes(0);
	    d.setSeconds(0);
	    this.dataValue = d.getTime();
	    this.editor.value = this.displayValue = dojo.date.locale.format(d, {selector:'date',formatLength: "long"});
	    this.editor.value = this.displayValue = this.dateMode == "Date and Time" ? dojo.date.locale.format(d, {formatLength: this.formatLength}) : dojo.date.locale.format(d, {selector: this.dateMode.toLowerCase(),formatLength: this.formatLength});
	    this.labelValue.setCaption(this.dataValue);
	} catch(e) {
	    this.dataValue = this.makeEmptyValue();
	    this.editor.value = this.displayValue = "";
	    this.labelValue.setCaption("Select a date");
	}
    },
	getEditorValue: function() {
	    return this.dataValue;
	},
	setEditorValue: function(inValue) {
	    var v = this.convertValue(inValue); // if inValue is just a date, returns unmodified date
	    if (!this.useLocalTime && v)
		v.setHours(v.getHours() + wm.timezoneOffset);
	    if (v) {
		this.dataValue = v.getTime() ;
		this.editor.value = this.displayValue = this.dateMode == "Date and Time" ? dojo.date.locale.format(v, {formatLength: this.formatLength}) : dojo.date.locale.format(v, {selector: this.dateMode.toLowerCase(),formatLength: this.formatLength});
	    } else {
		this.dataValue = this.makeEmptyValue();
		this.editor.value = this.displayValue = "";
	    }
	},
        setDisplayValue: function(inValue) {
	    this.setEditorValue(inValue);
	}

});
/*
dojo.declare("wm.mobile.DateTime", wm.mobile.ContainerEditor, {
    classNames: "wmmobeditor wmmobeditor-datetime",
    useLocalTime: false,
    editorBorder: 0,
    timePanelHeight: 38,
    formatLength: "short",
    dateMode: "Date and Time", // "Date", "Time", "Date and Time"
    _createEditor: function(inNode, inProps) {
	var panel = this.inherited(arguments);
	if (this.dateMode == "Date" ||
	    this.dateMode == "Date and Time") {
	    this.monthSelector = new wm.mobile.SelectMenu({border: "1", borderColor: "#999999", owner: this, parent: panel, width: "50%", caption: "", captionSize: "", displayField: "name", dataField: "dataValue", onchange: dojo.hitch(this, "changed")});
	    this.dateSelector = new wm.mobile.SelectMenu({border: "1", borderColor: "#999999", owner: this, parent: panel, width: "25%", caption: "", captionSize: "", displayField: "dataValue", dataField: "dataValue", onchange: dojo.hitch(this, "changed")});
	    this.yearSelector = new wm.mobile.SelectMenu({border: "1", borderColor: "#999999", restrictValues: false, owner: this, parent: panel, width: "25%", caption: "", captionSize: "", displayField: "dataValue", dataField: "dataValue", onchange: dojo.hitch(this, "changed")});
	    if (!wm.mobile.DateTime.MonthVar) {
		wm.mobile.DateTime.MonthVar = new wm.Variable({type: "EntryData", owner: this.getOwnerApp()});
		wm.mobile.DateTime.MonthVar.setData([{name: "Jan", dataValue: 0},
						     {name: "Feb", dataValue: 1},
						     {name: "Mar", dataValue: 2},
						     {name: "Apr", dataValue: 3},
						     {name: "May", dataValue: 4},
						     {name: "Jun", dataValue: 5},
						     {name: "Jul", dataValue: 6},
						     {name: "Aug", dataValue: 7},
						     {name: "Sep", dataValue: 8},
						     {name: "Oct", dataValue: 9},
						     {name: "Nov", dataValue: 10},
						     {name: "Dec", dataValue: 11}]);
	    }
	    this.monthSelector.setDataSet(wm.mobile.DateTime.MonthVar);

	    if (!wm.mobile.DateTime.DateVar) {	    
		wm.mobile.DateTime.DateVar = new wm.Variable({type: "NumberData", owner: this.getOwnerApp()});
		wm.mobile.DateTime.DateVar.setData([{dataValue: 1},
						    {dataValue: 2},
						    {dataValue: 3},
						    {dataValue: 4},
						    {dataValue: 5},
						    {dataValue: 6},
						    {dataValue: 7},
						    {dataValue: 8},
						    {dataValue: 9},
						    {dataValue: 10},
						    {dataValue: 11},
						    {dataValue: 12},
						    {dataValue: 13},
						    {dataValue: 14},
						    {dataValue: 15},
						    {dataValue: 16},
						    {dataValue: 17},
						    {dataValue: 18},
						    {dataValue: 19},
						    {dataValue: 20},
						    {dataValue: 21},
						    {dataValue: 22},
						    {dataValue: 23},
						    {dataValue: 24},
						    {dataValue: 25},
						    {dataValue: 26},
						    {dataValue: 27},
						    {dataValue: 28},
						    {dataValue: 29},
						    {dataValue: 30},
						    {dataValue: 31}]);
	    }						     
	this.dateSelector.setDataSet(wm.mobile.DateTime.DateVar);

	    if (!wm.mobile.DateTime.YearVar) {	    
		wm.mobile.DateTime.YearVar = new wm.Variable({type: "NumberData", owner: this.getOwnerApp()});
		var currentYear = new Date().getFullYear();
		wm.mobile.DateTime.YearVar.setData([{dataValue: currentYear - 5},
						    {dataValue: currentYear - 4},
						    {dataValue: currentYear - 3},
						    {dataValue: currentYear - 2},
						    {dataValue: currentYear - 1},
						    {dataValue: currentYear - 0},
						    {dataValue: currentYear + 1},
						    {dataValue: currentYear + 2},
						    {dataValue: currentYear + 3},
						    {dataValue: currentYear + 4},
						    {dataValue: currentYear + 5}]);

	}
	this.yearSelector.setDataSet(wm.mobile.DateTime.YearVar);
	}

	return panel;
	},
	convertValue: function(inValue) {
		return wm.convertValueToDate(inValue);
	},
	getEditorValue: function() {
	    var d = new Date();
	    try {
		d.setMonth(this.monthSelector.getDataValue());
		d.setDate(this.dateSelector.getDataValue());
		d.setFullYear(this.yearSelector.getDataValue());
	    } catch(e) {
		return this.makeEmptyValue();
	    }
	    return d.getTime();
	},
	setEditorValue: function(inValue) {
	    var v = this.convertValue(inValue); // if inValue is just a date, returns unmodified date
	    if (!this.useLocalTime && v)
		v.setHours(v.getHours() + wm.timezoneOffset);
	    if (v) {
		this.monthSelector.setDataValue(v.getMonth());
		this.dateSelector.setDataValue(v.getDate());
		this.yearSelector.setDataValue(v.getFullYear());
		this.dataValue = v.getTime();
		this.displayValue = dojo.date.locale.format(v, {selector:'date',formatLength: "medium"});
	    } else {
		this.monthSelector.setDataValue(null);
		this.dateSelector.setDataValue(null);
		this.yearSelector.setDataValue(null);
		this.dataValue = 0;
		this.displayValue = "";
	    }


	},
	getDisplayValue: function() {
	    return this.displayValue;
	}


});
*/
wm.Object.extendSchema(wm.mobile.DateTime, {
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

wm.mobile.DateTime.extend({
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