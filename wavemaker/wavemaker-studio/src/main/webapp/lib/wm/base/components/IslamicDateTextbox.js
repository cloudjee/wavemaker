/*
 * Copyright (C) 2010-2012 VMware, Inc. All rights reserved.
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
 

dojo.provide("wm.base.components.IslamicDateTextbox");

dojo.require("dijit._Calendar");
dojo.require("dijit.form._DateTimeTextBox");
dojo.require("dojo.date.locale");
dojo.require("dojox.date.IslamicDate");
dojo.require("dojo.cldr.supplemental");

dojo.declare('wm._IslamicCalendar', dijit._Calendar, {
	templateString:'',
	templatePath: dojo.moduleUrl("wm.base", "templates/islamicCalendar.html"),
	dayWidth: "narrow",
	value: new dojox.date.IslamicDate(),
	_setValueAttr: function(/*Date*/ value){
		this.value = null;
		this.setValue(value);
	},
	_populateGrid: function(){
		var month = this.displayMonth;
		month.setDate(1);
		var firstDay = month.getDay();
		var daysInMonth = dojox.date.IslamicDate.getDaysInIslamicMonth(month);
		var preMonth = new dojox.date.IslamicDate(month.getFullYear(),(month.getMonth()-1), month.getDate());
		var daysInPreviousMonth = dojox.date.IslamicDate.getDaysInIslamicMonth(preMonth);
		var today = new dojox.date.IslamicDate();
		today.setHours(0,0,0,0);
		var selected = this.value;

		var dayOffset = dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
		if(dayOffset > firstDay){ dayOffset -= 7; }

		// Iterate through dates in the calendar and fill in date numbers and style info
		dojo.query(".dijitCalendarDateTemplate", this.domNode).forEach(function(template, i){
			i += dayOffset;
			var date = new dojox.date.IslamicDate(month.getFullYear(),month.getMonth(), month.getDate());
			var number, clazz = "dijitCalendar", adj = 0;

			if(i < firstDay){
				number = daysInPreviousMonth - firstDay + i + 1;
				adj = -1;
				clazz += "Previous";
			}else if(i >= (firstDay + daysInMonth)){
				number = i - firstDay - daysInMonth + 1;
				adj = 1;
				clazz += "Next";
			}else{
				number = i - firstDay + 1;
				clazz += "Current";
			}

			if(adj){
				date.setMonth(date.getMonth()+adj);
			}
			date.setDate(number);

			if(Number(date)==Number(today)){
				clazz = "dijitCalendarCurrentDate " + clazz;
			}

			if(Number(date)==Number(selected)){
				clazz = "dijitCalendarSelectedDate " + clazz;
			}

			if(this.isDisabledDate(date, this.lang)){
				clazz = "dijitCalendarDisabledDate " + clazz;
			}

			var clazz2 = this.getClassForDate(date, this.lang);
			if(clazz2){
				clazz += clazz2 + " " + clazz;
			}

			template.className =  clazz + "Month dijitCalendarDateTemplate";
			template.dijitDateValue = date.valueOf();
			template.dijitIslamicDateValue = date;
			var label = dojo.query(".dijitCalendarDateLabel", template)[0];
			this._setText(label, date.getDate());
		}, this);

		// Fill in localized month name
		var monthNames = dojox.date.IslamicDate._getNames('months', 'wide', 'format',this.lang);
		this._setText(this.monthLabelNode, monthNames[month.getMonth()]);

		// Fill in localized prev/current/next years
		var y = month.getFullYear() - 1;
		var d = new dojox.date.IslamicDate();
		dojo.forEach(["previous", "current", "next"], function(name){
			d.setYear(y++);
			this._setText(this[name+"YearLabelNode"],
				dojo.date.locale.format(d, {selector:'year', locale:this.lang}));
		}, this);

		// Set up repeating mouse behavior
		var _this = this;
		var typematic = function(nodeProp, dateProp, adj){
			dijit.typematic.addMouseListener(_this[nodeProp], _this, function(count){
				if(count >= 0){ _this._adjustDisplay(dateProp, adj); }
			}, 0.8, 500);
		};
		typematic("incrementMonth", "month", 1);
		typematic("decrementMonth", "month", -1);
		typematic("nextYearLabelNode", "year", 1);
		typematic("previousYearLabelNode", "year", -1);
		typematic("increment10Year", "year", 10);
		typematic("decrement10Year", "year", -10);
	},
	_adjustDisplay: function(/*String*/part, /*int*/amount){
		switch(part){
		case "month":
			if (amount <= 0)
			{
				var gDate = dojo.date.add(this.displayMonth.toGregorian(), part, 0);
				this.displayMonth = this.displayMonth.fromGregorian(gDate);
			}
			else
			{
				this.displayMonth.setMonth(this.displayMonth.getMonth()+amount);
			}
			break;
		case "year":
			this.displayMonth.setYear(this.displayMonth.getFullYear()+amount);
			break;
		}
		
		this._populateGrid();
	},
	_onDayClick: function(/*Event*/evt){
		var node = evt.target;
		dojo.stopEvent(evt);
		while(!node.dijitDateValue){
			node = node.parentNode;
		}
		if(!dojo.hasClass(node, "dijitCalendarDisabledDate")){
			this.value = null;
			this.setValue(node.dijitIslamicDateValue);
			this.onValueSelected(this.value);
		}
	},

	_onDayMouseOver: function(/*Event*/evt){
		var node = evt.target;
		if(node && (node.dijitDateValue || node == this.previousYearLabelNode || node == this.nextYearLabelNode) ){
			dojo.addClass(node, "dijitCalendarHoveredDate");
			this._currentNode = node;
		}
	},

	_onDayMouseOut: function(/*Event*/evt){
		if(!this._currentNode){ return; }
		for(var node = evt.relatedTarget; node;){
			if(node == this._currentNode){ return; }
			try{
				node = node.parentNode;
			}catch(x){
				node = null;
			}
		}
		dojo.removeClass(this._currentNode, "dijitCalendarHoveredDate");
		this._currentNode = null;
	},
	postCreate: function(){
		//this.inherited(arguments);
		
		var cloneClass = dojo.hitch(this, function(clazz, n){
			var template = dojo.query(clazz, this.domNode)[0];
			for(var i=0; i<n; i++){
				template.parentNode.appendChild(template.cloneNode(true));
			}
		});

		// clone the day label and calendar day templates 6 times to make 7 columns
		cloneClass(".dijitCalendarDayLabelTemplate", 6);
		cloneClass(".dijitCalendarDateTemplate", 6);

		// now make 6 week rows
		cloneClass(".dijitCalendarWeekTemplate", 5);

		// insert localized day names in the header
		var dayNames = dojox.date.IslamicDate._getNames('days', this.dayWidth, 'standAlone', this.lang);
		var dayOffset = dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
		dojo.query(".dijitCalendarDayLabel", this.domNode).forEach(function(label, i){
			this._setText(label, dayNames[(i + dayOffset) % 7]);
		}, this);

		// Fill in spacer element with all the month names (invisible) so that the maximum width will affect layout
		var monthNames = dojox.date.IslamicDate._getNames('months', 'wide', 'format', this.lang);

		dojo.forEach(monthNames, function(name){
			var monthSpacer = dojo.doc.createElement("div");
			this._setText(monthSpacer, name);
			this.monthLabelSpacer.appendChild(monthSpacer);
		}, this);

		var dateValue = this.value;
		this.value = null;
		if (dateValue)
		{
			this.setValue(dateValue);
		}
		else
		{
			this.setValue(new dojox.date.IslamicDate());
		}
	},
	setValue: function(/*Date*/ value){
		// summary: set the current date and update the UI.  If the date is disabled, the selection will
		//	not change, but the display will change to the corresponding month.
		if(!this.value || (Number(value)!=Number(value))){
			value = new dojox.date.IslamicDate(value.getFullYear(),value.getMonth(), value.getDate());
			this.displayMonth = new dojox.date.IslamicDate(value.getFullYear(),value.getMonth(), value.getDate());
			if(!this.isDisabledDate(value, this.lang)){
				this.value = value;
				this.value.setHours(0,0,0,0);
				this.onChange(this.value);
			}
			this._populateGrid();
		}
	},

	_setText: function(node, text){
		while(node.firstChild){
			node.removeChild(node.firstChild);
		}
		node.appendChild(dojo.doc.createTextNode(text));
	}


});

dojo.declare(
	"wm.IslamicDateTextbox",
	dijit.form._DateTimeTextBox,
	{
		// summary:
		//		A validating, serializable, range-bound date text box with a drop down calendar

		baseClass: "dijitTextBox dijitDateTextBox",
		popupClass: "wm._IslamicCalendar",
		_selector: "date",

		//	value: Date
		//		The value of this widget as a JavaScript Date object, with only year/month/day specified.
		//
		//		Example:
		// |	new dijit.form.DateTextBox({value: new Date(2009,1,20)})
		//
		//		When passed to the parser in markup, must be specified according to locale-independent
		//		`dojo.date.stamp.fromISOString` format.
		//
		//		Example:
		// |	<input dojotype='dijit.form.DateTextBox' value='2009-01-20'>
		value: new dojox.date.IslamicDate()

	}
);
