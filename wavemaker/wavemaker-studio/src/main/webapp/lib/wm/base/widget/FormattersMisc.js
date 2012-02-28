/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.FormattersMisc");
dojo.require("wm.base.widget.Formatters");

dojo.declare("wm.RegularExpressionFormatter", wm.DataFormatter, {
	expression: ".*",
	global: false,
	caseSensitive: true,
	replace: "$&",
	// NB: called in 'cell' context
	init: function() {
		/*console.log(this.expression);
		this.expression = this.expression.replace(new RegExp(/\\/g), "\\\\");
		console.log(this.expression); */
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
