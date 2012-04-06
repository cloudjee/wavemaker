/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Formatters");

// FIXME: need formatter registry
wm.formatters = [ 
    "Number", 
    "Date", 
    "Time", 
    "DateTime", 
    "Currency", 
    //"Link",
    //"RegularExpression", 
    //"Evaluation",
    //"Image", 
    "Percent"
];

wm.getFormatter = function(inName) {
	var c = inName;
	if (c.slice(0, 5) != "wm")
		c = "wm." + c + "Formatter";
	return dojo.getObject(c) || wm.DataFormatter;
}

dojo.declare("wm.DataFormatter", wm.Component, {
	getColProps: function() {
		return {
			formatter: this.format
		}
	},
	format: function(inDatum) {
		return (inDatum !== undefined) ? inDatum : '&nbsp;';
	},
	valueChanged: function(inProp, inValue) {
		this.inherited(arguments);
		if (inProp)
			wm.fire(this.owner, "formatChanged");
	}
});

dojo.declare("wm.NumberFormatter", wm.DataFormatter, {
	digits: 0,
	locale: "",
	round: false,
	noFormat: false,
	// NB: called in 'cell' context
	format: function(inDatum) {
		return (inDatum === undefined) ? '-' : (this.wmNoFormat ? inDatum : dojo.number.format(inDatum, this.getFormatProps()));
	},
	getFormatProps: function() {
		return {
			places: Number(this.digits),
			locale: this.locale,
			round: this.round ? 0 : -1
		}
	},
	getColProps: function() {
		return {
			formatter: this.format,
			getFormatProps: dojo.hitch(this, "getFormatProps"),
			wmNoFormat: this.noFormat
		}
	}
});

dojo.declare("wm.CurrencyFormatter", wm.NumberFormatter, {
	digits: 2,
	currency: "",
	format: function(inDatum) {
		return (inDatum == undefined) ? '-' : dojo.currency.format(inDatum, this.getFormatProps());
	},
	getFormatProps: function() {
		var p = this.inherited(arguments);
	        p.currency = this.currency == "$" ? "USD" : this.currency || (this._isDesignLoaded ? studio.application.currencyLocale : app.currencyLocale) || "USD";
		return p;
	}
});


dojo.declare("wm.DateTimeFormatter", wm.DataFormatter, {
	useLocalTime: true,
	formatLength: "medium", // long, short, medium or full
	_selector: "",
	datePattern: "", // "M/d/yy",
	timePattern: "", // "h:m:s a",
	locale: "",
	// NB: called in 'cell' context
	format: function(inDatum) {
		var opts = {
			selector: this._selector,
			formatLength: this.formatLength,
			datePattern: this.datePattern,
			timePattern: this.timePattern,
			locale: this.locale
		}
		var d = new Date(inDatum);
		if (!this.useLocalTime)
		    d.setHours(d.getHours() + wm.timezoneOffset);
		if (isNaN(d.getTime()))
			d = new Date(Number(inDatum));
		return (inDatum == undefined) || isNaN(d.getTime()) ? '-' : dojo.date.locale.format(d, opts);
	},
	getColProps: function() {
		return {
			_selector: this._selector,
			formatLength: this.formatLength,
			datePattern: this.datePattern,
			timePattern: this.timePattern,
			locale: this.locale,
			formatter: this.format
		}
	}
});

dojo.declare("wm.DateFormatter", wm.DateTimeFormatter, {
	_selector: "date",
	useLocalTime: false
});

dojo.declare("wm.TimeFormatter", wm.DateTimeFormatter, {
	_selector: "time"
});


dojo.declare("wm.PercentFormatter", wm.NumberFormatter, {
        divideBy100: false,
	getFormatProps: function() {
	   var p = this.inherited(arguments);
	   p.type = "percent";
	   return p;
	},
	format: function(inDatum) {
	inDatum = Number(inDatum);
	if (this.divideBy100) inDatum = inDatum/100;
	return this.inherited(arguments,[inDatum]);
	}
});

// design only...

wm.Object.extendSchema(wm.DataFormatter, {
	name: { ignore: 1 }
});

wm.Object.extendSchema(wm.DateTimeFormatter, {
    formatLength: {options: ["short","medium","long","full"]},
    useLocalTime: { ignore: 1 }
});

wm.Object.extendSchema(wm.DateFormatter, {
	timePattern: { ignore: 1 },
	useLocalTime: { ignore: 0 }
});

wm.Object.extendSchema(wm.TimeFormatter, {
	datePattern: { ignore: 1 }
});