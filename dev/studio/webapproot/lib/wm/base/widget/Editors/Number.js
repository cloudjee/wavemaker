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
dojo.provide("wm.base.widget.Editors.Number");
dojo.require("wm.base.widget.Editors.Text");
dojo.require("dijit.form.VerticalSlider");
dojo.require("dijit.form.HorizontalSlider");

//===========================================================================
// Number Editor
//===========================================================================
dojo.declare("wm._NumberEditor", wm._TextEditor, {
	minimum: "",
	maximum: "",
	places: "",
	_messages: {
		rangeMin: "Minimum number must be less than the maximum setting of ${0}.",
		rangeMax: "Maximum number must be greater than the minimum setting of ${0}."
	},
	rangeMessage: "",
	getEditorProps: function(inNode, inProps) {
		var constraints = {}, v = this.owner.displayValue;
		if (this.minimum)
			constraints.min = Number(this.minimum);
		if (this.maximum)
			constraints.max = Number(this.maximum);
		// NOTE: for constraining decimal places use pattern instead of places
		// pattern is 'up to' while places is 'must be'
		if (this.places)
		{
			var places = this._getPlaces();
			if (places && places != '')
			{
				constraints.places = places;
			}
		}

		constraints.pattern = this._getPattern();
		return dojo.mixin(this.inherited(arguments), {
			constraints: constraints,
			editPattern: constraints.pattern,
			rangeMessage: this.rangeMessage,
			required: this.required,
			value: v ? Number(v) : ""
		}, inProps || {});
	},
	_getPlaces: function (){
		return '';
	},
	_createEditor: function(inNode, inProps) {
		return new dijit.form.NumberTextBox(this.getEditorProps(inNode, inProps));
	},
	_getPattern: function() {
		var
			p = this.places !== "" ? Number(this.places) : 20,
			n = "#", d = ".",
			pattern = [n];
		if (p)
			pattern.push(d);
		for (var i=0; i<p; i++)
			pattern.push(n);
		return pattern.join('');
	},
	setMaximum: function(inMax) {
		var v = Number(inMax);
		if (this.minimum === "" || this.minimum < v) {
			this.maximum = v;
			if (this.editor)
				this.editor.constraints.max = v;
		} else if (this.isDesignLoaded())
			alert(dojo.string.substitute(this._messages.rangeMax, [this.minimum]));
	},
	setMinimum: function(inMin) {
		var v = Number(inMin);
		if (this.maximum === "" || v < this.maximum) {
			this.minimum = v;
			if (this.editor)
				this.editor.constraints.min = v;
		} else if (this.isDesignLoaded())
			alert(dojo.string.substitute(this._messages.rangeMin, [this.maximum]));
	},
	_getReadonlyValue: function() {
		return dojo.number.format(this.owner.dataValue, this.getFormatProps());
	},
	getFormatProps: function() {
		var formatProps = {};
		if (this.places && this.places != '')
			formatProps.places = Number(this.places);
		return formatProps;
	}
	
});

//===========================================================================
// Currency Editor
//===========================================================================
dojo.declare("wm._CurrencyEditor", wm._NumberEditor, {
	currency: "USD",
	getEditorProps: function(inNode, inProps) {
		var prop = this.inherited(arguments);
		if (prop.constraints)
			delete prop.constraints.pattern;
		return dojo.mixin(prop, {
			currency: this.currency
		}, inProps || {});
	},
	_createEditor: function(inNode, inProps) {
		return new dijit.form.CurrencyTextBox(this.getEditorProps(inNode, inProps));
	},
	_getReadonlyValue: function() {
		return dojo.currency.format( this.owner.dataValue, {currency: this.currency, places: this.places});
	},
	_getPlaces: function() {
		return this.places;
	}
});

//===========================================================================
// Slider Editor
//===========================================================================
dojo.declare("wm._SliderEditor", wm._BaseEditor, {
	minimum: 0,
	maximum: 100,
	showButtons: true,
	discreteValues: "",
	verticalSlider: false,
	reflow: function() {},
	setVerticalSlider: function(inVerticalSlider) {
		this.verticalSlider = inVerticalSlider;
		if (this.editor)
			this.createEditor();
	},
	getEditorProps: function(inNode, inProps) {
		// it is important to have this.owner.displayValue as an integer and should always be at least equal to minimum value
		// else sliders will throw exception on IE and will not show up.
		var v = this.owner.displayValue;
		var minV = Number(this.minimum) ? Number(this.minimum) : 0;
		if (!v || (Number(v) < minV))
			v = this.owner.displayValue = minV;

		return dojo.mixin(this.inherited(arguments), {
			minimum: Number(this.minimum),
			maximum: Number(this.maximum),
			showButtons: Boolean(this.showButtons),
			discreteValues: Number(this.discreteValues) || Infinity,
			value: v
		}, inProps || {});
	},
	_createEditor: function(inNode, inProps) {
		if (this.verticalSlider)
		{
			return new dijit.form.VerticalSlider(this.getEditorProps(inNode, inProps));
		}
		else
		{
			return new dijit.form.HorizontalSlider(this.getEditorProps(inNode, inProps));
		}
	},
	sizeEditor: function() {
		if (this._cupdating)
			return;
		var e = this.editor;
		if (e) {

			var
				bounds = this.getContentBounds(),
				// note, subtract 2 from bounds for dijit editor border/margin
				height = bounds.h ? bounds.h - 2 + "px" : "",
				width = bounds.w ? bounds.w - 4 + "px" : "",
				d = e && e.domNode,
				s = d.style,
				fc = d && d.firstChild;
			if (!this.editorBorder) s.border = 0;
			s.backgroundColor = this.editorBorder ? "" : "transparent";
			s.backgroundImage = this.editorBorder ? "" : "none";
			s.width = width;
			s.height = height;
			
			if (this.verticalSlider) {
				this.editor.incrementButton.style.width = "auto";
				this.editor.decrementButton.style.width = "auto";
			}
		}
	}
});



//===========================================================================
// Number Editor
//===========================================================================
dojo.declare("wm.Number", wm.Text, {
	minimum: "",
	maximum: "",
	places: "",
	_messages: {
		rangeMin: "Minimum number must be less than the maximum setting of ${0}.",
		rangeMax: "Maximum number must be greater than the minimum setting of ${0}."
	},
	rangeMessage: "",
        validationEnabled: function() { return true;},
	getEditorProps: function(inNode, inProps) {
		var constraints = {}, v = this.displayValue;
		if (this.minimum)
			constraints.min = Number(this.minimum);
		if (this.maximum)
			constraints.max = Number(this.maximum);
		// NOTE: for constraining decimal places use pattern instead of places
		// pattern is 'up to' while places is 'must be'
		if (this.places)
		{
			var places = this._getPlaces();
			if (places && places != '')
			{
				constraints.places = places;
			}
		}

		constraints.pattern = this._getPattern();
		return dojo.mixin(this.inherited(arguments), {
			constraints: constraints,
			editPattern: constraints.pattern,
			rangeMessage: this.rangeMessage,
			required: this.required,
			value: v ? Number(v) : ""
		}, inProps || {});
	},
	_getPlaces: function (){
		return '';
	},
	_createEditor: function(inNode, inProps) {
		return new dijit.form.NumberTextBox(this.getEditorProps(inNode, inProps));
	},
	_getPattern: function() {
		var
			p = this.places !== "" ? Number(this.places) : 20,
			n = "#", d = ".",
			pattern = [n];
		if (p)
			pattern.push(d);
		for (var i=0; i<p; i++)
			pattern.push(n);
		return pattern.join('');
	},
	setMaximum: function(inMax) {
	        var v = (inMax === "") ? "" : Number(inMax);
		if (this.minimum === "" || this.minimum < v || v === "") {
			this.maximum = v;
		        if (this.editor) {
				this.editor.constraints.max = v;
			        this.editor.validate();
			}
		} else if (this.isDesignLoaded())
			alert(dojo.string.substitute(this._messages.rangeMax, [this.minimum]));
	},
	setMinimum: function(inMin) {
	        var v = (inMin === "") ? "" :  Number(inMin);
		if (this.maximum === "" || v < this.maximum || v === "") {
			this.minimum = v;
		        if (this.editor) {
				this.editor.constraints.min = v;
			        this.editor.validate();
			}
		} else if (this.isDesignLoaded())
			alert(dojo.string.substitute(this._messages.rangeMin, [this.maximum]));
	},
	_getReadonlyValue: function() {
		return dojo.number.format(this.dataValue, this.getFormatProps());
	},
	getFormatProps: function() {
		var formatProps = {};
		if (this.places && this.places != '')
			formatProps.places = Number(this.places);
		return formatProps;
	}
	
});

wm.Object.extendSchema(wm.Number, {
    resetButton: {ignore: 1},
    dataValue: {ignore: 1, bindable: 1, group: "editData", order: 3, simpleBindProp: true, type: "Number"},
    places: {group: "editor", order: 2, doc: 1},
    minimum:  { group: "editor", order: 3, emptyOK: true, doc: 1},
    maximum: { group: "editor", order: 4, emptyOK: true, doc: 1},
    rangeMessage: {  group: "editor", order: 5},
    regExp: { ignore: 1 },
    maxChars: { ignore: 1},
    setMaximum: {group: "method", doc: 1},
    setMinimum: {group: "method", doc: 1}
});

//===========================================================================
// Currency Editor
//===========================================================================
dojo.declare("wm.Currency", wm.Number, {
	currency: "USD",
	getEditorProps: function(inNode, inProps) {
		var prop = this.inherited(arguments);
		if (prop.constraints)
			delete prop.constraints.pattern;
		return dojo.mixin(prop, {
			currency: this.currency
		}, inProps || {});
	},
	_createEditor: function(inNode, inProps) {
		return new dijit.form.CurrencyTextBox(this.getEditorProps(inNode, inProps));
	},
	_getReadonlyValue: function() {
		return dojo.currency.format( this.dataValue, {currency: this.currency, places: this.places});
	},
	_getPlaces: function() {
		return this.places;
	}
});

wm.Object.extendSchema(wm.Currency, {
    password: {ignore:1},
    currency: {group: "editor", order: 2, doc: 1},
    minimum:  { group: "editor", order: 3, emptyOK: true, doc: 1},
    maximum: { group: "editor", order: 4, emptyOK: true, doc: 1},
    places: {  group: "editor", order: 5, doc: 1},
    rangeMessage: {  group: "editor", order: 6}
});


//===========================================================================
// Slider Editor
//===========================================================================
dojo.declare("wm.Slider", wm.AbstractEditor, {
	minimum: 0,
	maximum: 100,
	showButtons: true,
	discreteValues: "",
	verticalSlider: false,
        editorBorder: false,
	reflow: function() {},
	setVerticalSlider: function(inVerticalSlider) {
		this.verticalSlider = inVerticalSlider;
		if (this.editor)
			this.createEditor();
	        if (this.verticalSlider) {
		    this.editor.incrementButton.style.width = "auto";
		    this.editor.decrementButton.style.width = "auto";
		}
	},
	getEditorProps: function(inNode, inProps) {
		// it is important to have this.displayValue as an integer and should always be at least equal to minimum value
		// else sliders will throw exception on IE and will not show up.
		var v = this.displayValue;
		var minV = Number(this.minimum) ? Number(this.minimum) : 0;
		if (!v || (Number(v) < minV))
			v = this.displayValue = minV;

		return dojo.mixin(this.inherited(arguments), {
			minimum: Number(this.minimum),
			maximum: Number(this.maximum),
			showButtons: Boolean(this.showButtons),
			discreteValues: Number(this.discreteValues) || Infinity,
			value: v
		}, inProps || {});
	},
	_createEditor: function(inNode, inProps) {
		var div = dojo.create('div');
		var dijitObj;
		if (this.verticalSlider)
		{
			dijitObj = new dijit.form.VerticalSlider(this.getEditorProps(inNode, inProps));
		}
		else
		{
			dijitObj = new dijit.form.HorizontalSlider(this.getEditorProps(inNode, inProps));
		}

		div.appendChild(dijitObj.domNode);
		dijitObj.domNode = div;
		return dijitObj;

	},

	sizeEditor: function() {
		if (this._cupdating)
			return;
	        this.inherited(arguments);
	    this.editor._setStyleAttr("height: " + this.editor.domNode.style.height + ";width:" +  this.editor.domNode.style.width);
	}
				       
/*
	sizeEditor: function() {
		if (this._cupdating)
			return;
	        this.inherited(arguments);

		var e = this.editor;
		if (e) {

			var
				bounds = this.getContentBounds(),
				// note, subtract 2 from bounds for dijit editor border/margin
				height = bounds.h ? bounds.h - 2 + "px" : "",
				width = bounds.w ? bounds.w - 4 + "px" : "",
				d = e && e.domNode,
				s = d.style,
				fc = d && d.firstChild;
			if (!this.editorBorder) s.border = 0;
			s.backgroundColor = this.editorBorder ? "" : "transparent";
			s.backgroundImage = this.editorBorder ? "" : "none";
			s.width = width;
			s.height = height;


		}
	}
			*/			
});

wm.Object.extendSchema(wm.Slider, {
    discreteValues: {group: "editor", order: 2},
    minimum:  { group: "editor", order: 3, doc: 1},
    maximum: { group: "editor", order: 4, doc: 1},
    showButtons: {  group: "editor", order: 5},
    verticalSlider: {  group: "editor", order: 6, ignore: 1},
    editorBorder: { ignore: 1 },
    changeOnKey: { ignore: 1 },
    changeOnEnter: { ignore: 1 }
});



// design only...
wm.Object.extendSchema(wm._NumberEditor, {
	regExp: { ignore: 1 },
	maxChars: { ignore: 1}
});

wm.Object.extendSchema(wm._SliderEditor, {
	changeOnKey: { ignore: 1 },
	changeOnEnter: { ignore: 1 }
});