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
dojo.provide("wm.base.widget.Formatters");

// FIXME: need formatter registry
wm.formatters = [ 
	"Number", "Date", "Time", "DateTime", "Currency", "Link",
	"RegularExpression", "Evaluation","Image" 
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
	currency: "$",
	format: function(inDatum) {
		return (inDatum == undefined) ? '-' : dojo.currency.format(inDatum, this.getFormatProps());
	},
	getFormatProps: function() {
		var p = this.inherited(arguments);
		// Dojo uses an iso4217 currency code, but let's allow $ to mean U.S. dollars (see http://www.xe.com/iso4217.php)
		this.digits = 2;
		p.currency = this.currency == "$" ? "USD" : this.currency;
		return p;
	}
});

dojo.declare("wm.RegularExpressionFormatter", wm.DataFormatter, {
	expression: ".*",
	global: false,
	caseSensitive: true,
	replace: "$&",
	// NB: called in 'cell' context
	init: function() {
		/*console.log(this.expression);
		this.expression = this.expression.replace(new RegExp(/\\/g), "\\\\");
		console.log(this.expression);*/
		this.inherited(arguments);
	},
	format: function(inDatum) {
		var
			opts = (this.global ? "g" : "") + (this.caseSensitive ? "" : "i");
			re = new RegExp(this.expression, opts);
		return (inDatum != undefined) ? (this.expression ? String(inDatum).replace(re, this.replace) : inDatum) : '-';
	},
	getColProps: function() {
		return {
			expression: this.expression,
			global: this.global,
			caseSensitive: this.caseSensitive,
			replace: this.replace,
			formatter: this.format
		}
	}
});

dojo.declare("wm.EvaluationFormatter", wm.DataFormatter, {
	_field: "$&",
	expression: "",
	init: function() {
		this.expression = this.expression || this._field;
		this.inherited(arguments);
	},
	// NB: called in 'cell' context
	format: function(inDatum) {
		// FIXME: hack to support formatting object data
		// trick: eval is called in this scope so we can pass in any local variable names.
		var isObject = dojo.isObject(inDatum), _data;
		if (isObject) {
			if (inDatum instanceof wm.Variable) {
				var o = inDatum.getData();
				_data = wm.isEmpty(o) ? inDatum.data : o;
			} else
				_data = inDatum;
			inDatum = "_data";
		}
		var ev = this.expression.replace(new RegExp("\\" + this._field, "g"), isObject? inDatum : '\"' + inDatum + '\"');
		try {
			return String(eval("(" + ev + ")"));
		} catch(e) {
			console.log("evaluation error: ", e);
		}
	},
	getColProps: function() {
		return {
			expression : this.expression,
			_field: this._field,
			formatter: this.format
		}
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
		    d.setHours(d.getHours() + wm.Date.timezoneOffset);
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
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "formatLength":
				return makeSelectPropEdit(inName, inValue, ["medium", "short", "long", "full"], inDefault);
		}
		return this.inherited(arguments);
	}
});

dojo.declare("wm.DateFormatter", wm.DateTimeFormatter, {
	_selector: "date",
	useLocalTime: false
});

dojo.declare("wm.TimeFormatter", wm.DateTimeFormatter, {
	_selector: "time"
});

dojo.declare("wm.LinkFormatter", wm.DataFormatter, {
	link: "",
	// NB: called in 'cell' context
	format: function(inDatum) {
		if (inDatum === undefined)
			return '-';
		else {
			var l = this.link;
			return l.indexOf("<a") >=0 ? dojo.string.substitute(l, {data: inDatum}) : 
				['<a href="', this.link, this.link ? "#" : "", inDatum, '">', inDatum, '</a>'].join('');
		}
	},
	getColProps: function() {
		return {
			link: this.link,
			formatter: this.format
		}
	}
});

dojo.declare("wm.ImageFormatter", wm.DataFormatter, {
	imageWidth:'50px',
	imageHeight:'50px',
	
	format: function(src) {
		if (!src || src == '')
			return "-";
		return ['<img src="', src, "#", '" width="', this.imageWidth,'" height="', this.imageHeight, '"/>'].join('');
	},
	getColProps: function() {
		return {
			imageWidth: this.imageWidth,
			imageHeight: this.imageHeight,
			formatter: this.format
		}
	}
});

// design only...

wm.Object.extendSchema(wm.DataFormatter, {
	name: { ignore: 1 }
});

wm.Object.extendSchema(wm.DateTimeFormatter, {
	useLocalTime: { ignore: 1 }
});

wm.Object.extendSchema(wm.DateFormatter, {
	timePattern: { ignore: 1 },
	useLocalTime: { ignore: 0 }
});

wm.Object.extendSchema(wm.TimeFormatter, {
	datePattern: { ignore: 1 }
});