/*
 * Copyright (C) 2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Enterprise.
 *  You may not use this file in any manner except through written agreement with WaveMaker Software, Inc.
 *
 */ 

dojo.provide("wm.base.components.DualCalendar");

dojo.require("wm.base.components.IslamicDateTextbox");
dojo.require("dijit.form.DateTextBox");

dojo.declare('wm._dualCalendar', dijit._Calendar, {
	templateString:'',
	templatePath: dojo.moduleUrl("wm.base", "templates/dualCalendar.html"),
	dayWidth: "narrow",
	dateObject:null,
	
	constructor: function(){
		var pObj = arguments[0].parentObj;
		this.defaultLabel = pObj.defaultLabel;
		this.secondLabel = pObj.secondLabel;
		this.defaultCalendar = pObj.defaultCalendar;
		this.secondCalendar = pObj.secondCalendar;
		this.currentCalendar = pObj.getCurrentCalendar();
		this.value = pObj.getDateValue();
		//this.dateObj = new (dojo.getObject(this.currentCalendar))();
		//this.value = this.dateObj.value;
	},
	onChange: function(){
		this.parentObj.updateDateType(this.currentCalendar);
	},
	_setValueAttr: function(/*Date*/ value){
		if (this.currentCalendar == "dijit.form.DateTextBox")
		{
			this.inherited(arguments);
			return;	
		}
		
		this.value = null;
		this.setValue(value);
	},
	_populateGrid: function(){
		this._setRadioButton();
		if (this.currentCalendar == "dijit.form.DateTextBox")
		{
			this.inherited(arguments);
			this.connectEvents(true);
			return;	
		}

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
		
		this.connectEvents();
	},
	connectEvents: function(onlyExtraEvents){
		// Set up repeating mouse behavior
		var _this = this;
		var typematic = function(nodeProp, dateProp, adj){
			dijit.typematic.addMouseListener(_this[nodeProp], _this, function(count){
				if(count >= 0){ _this._adjustDisplay(dateProp, adj); }
			}, 0.8, 500);
		};
		
		if (!onlyExtraEvents)
		{
			typematic("incrementMonth", "month", 1);
			typematic("decrementMonth", "month", -1);
			typematic("nextYearLabelNode", "year", 1);
			typematic("previousYearLabelNode", "year", -1);
		}

		typematic("increment10Year", "year", 10);
		typematic("decrement10Year", "year", -10);
		
		dijit.typematic.addMouseListener(_this.defCalendarSelected, _this, function(count){
				if(count >= 0){ _this.parentObj.showDefaultCalendar(); }
		}, 0.8, 500);
		dijit.typematic.addMouseListener(_this.secCalendarSelected, _this, function(count){
				if(count >= 0){ _this.parentObj.showSecondCalendar(); }
		}, 0.8, 500);
	},
	_adjustDisplay: function(/*String*/part, /*int*/amount){
		if (this.currentCalendar == "dijit.form.DateTextBox")
		{
			this.inherited(arguments);
			return;	
		}
		
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
		if (this.currentCalendar == "dijit.form.DateTextBox")
		{
			this.inherited(arguments);
			return;	
		}
		
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
		if (this.currentCalendar == "dijit.form.DateTextBox")
		{
			this.inherited(arguments);
			return;	
		}
		
		var node = evt.target;
		if(node && (node.dijitDateValue || node == this.previousYearLabelNode || node == this.nextYearLabelNode) ){
			dojo.addClass(node, "dijitCalendarHoveredDate");
			this._currentNode = node;
		}
	},

	_onDayMouseOut: function(/*Event*/evt){
		if (this.currentCalendar == "dijit.form.DateTextBox")
		{
			this.inherited(arguments);
			return;	
		}
		
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
		if (this.currentCalendar == "dijit.form.DateTextBox")
		{
			this.inherited(arguments);
			return;	
		}
		
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
	updateCalendarDays: function(){
		var dayNames = dojo.date.locale.getNames('days', this.dayWidth, 'standAlone', this.lang);
		console.info(dayNames);
		if (this.currentCalendar == 'wm.')
		{
			dayNames = dojox.date.IslamicDate._getNames('days', this.dayWidth, 'standAlone', this.lang);
		}
		// insert localized day names in the header
		var dayNames = dojox.date.IslamicDate._getNames('days', this.dayWidth, 'standAlone', this.lang);
		var dayOffset = dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
		console.info('dualCalendar dayOffset = ', dayOffset);
		dojo.query(".dijitCalendarDayLabel", this.domNode).forEach(function(label, i){
			this._setText(label, dayNames[(i + dayOffset) % 7]);
		}, this);
	},
	setValue: function(/*Date*/ value){
		if (this.currentCalendar == "dijit.form.DateTextBox")
		{
			this.inherited(arguments);
			return;	
		}
		
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
	},
	_setRadioButton: function(){
		if (this.currentCalendar == this.defaultCalendar)
			this.defCalendarRadio.checked = true;
		else
			this.secCalendarRadio.checked = true;
	}
});

dojo.declare("wm.DualCalendar",	dijit.form._DateTimeTextBox, {
		baseClass: "dijitTextBox dijitDateTextBox",
		popupClass: "wm._dualCalendar",
		_selector: "date",
		defaultLabel:"Hijri",
		secondLabel:"Gregorian",
		defaultCalendar:"wm.IslamicDateTextbox",
		secondCalendar:"dijit.form.DateTextBox",
		constructor: function(){
			this.currentCalendar = this.defaultCalendar;	
		},
		getDefaultDate: function(){
			if (this.currentCalendar == 'wm.IslamicDateTextbox')
				return new dojox.date.IslamicDate();
			else
				return new Date();
		},
		getCurrentCalendar: function(){
			return this.currentCalendar;
		},
		setCurrentCalendar: function(isDefaultCalendar){
			if (isDefaultCalendar)
				this.currentCalendar = this.defaultCalendar;
			else
				this.currentCalendar = this.secondCalendar;	
		},
		showDefaultCalendar: function(){
			this.setCurrentCalendar(true);
			this._onBlur();
			this._open();
		},
		showSecondCalendar: function(){
			this.setCurrentCalendar(false);
			this._onBlur();
			this._open();
		},
		getDateValue: function(){
			var val = this.attr('value');
			var newValue;
			if (val)
			{
				if (this.currentDateType == this.currentCalendar)
					return val;
				else if (this.currentCalendar == this.defaultCalendar)
					newValue = this.toIslamic(val);
				else
					newValue = this.toGregorian(val);

				this.attr('value', newValue);
				this.updateDateType(this.currentCalendar);					
				return this.value;
			}				
		},
		updateDateType: function (type){
			this.currentDateType = type;
		},
		toGregorian: function (dateObj){
			var islamicDate = new dojox.date.IslamicDate(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
			return islamicDate.toGregorian();
		},
		toIslamic: function(dateObj){
			var islamicDate = new dojox.date.IslamicDate();
			return islamicDate.fromGregorian(dateObj);
		},
		changeDateMode: function(mode){
			if (mode.toLowerCase() == 'hijri')
			{
				this.setCurrentCalendar(true);
			}
			else
			{
				this.setCurrentCalendar(false);
			}
			
			this.getDateValue();
		}
	}
);
