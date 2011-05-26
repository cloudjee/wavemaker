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
dojo.provide("wm.base.mobile.Number");
dojo.require("wm.base.mobile.Text");
//===========================================================================
// Number Editor
//===========================================================================
dojo.declare("wm.mobile.Number", wm.mobile.Text, {
        spinnerButtons: false,
	minimum: "",
	maximum: "",
	places: "",
	_messages: {
		rangeMin: "Minimum number must be less than the maximum setting of ${0}.",
		rangeMax: "Maximum number must be greater than the minimum setting of ${0}."
	},
	rangeMessage: "",
        validationEnabled: function() { return true;},
    connectEditor: function() {
	this.inherited(arguments);
	if (this.spinnerButtons)
	    this.addEditorConnect(this.editor, "onClick", this, "changed");
    },
	getEditorProps: function(inNode, inProps) {
		var constraints = {}, v = this.displayValue;
	    if (!isNaN(parseInt(this.minimum)))
			constraints.min = Number(this.minimum);
	    if (!isNaN(parseInt(this.maximum)))
			constraints.max = Number(this.maximum);

		// NOTE: for constraining decimal places use pattern instead of places
		// pattern is 'up to' while places is 'must be'
		if (this.places)
		{
			var places = this._getPlaces();
			if (places && places != '')
			{
			    constraints.places = parseInt(places) != NaN ? parseInt(places) : places;
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
	    var node = dojo.create("input", {type: "number"});
	    this.domNode.appendChild(node);
	    return node;
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
	},
    setSpinnerButtons: function(inSpinner) {
	if (this.spinnerButtons != inSpinner) {
	    this.spinnerButtons = inSpinner;
	    this.createEditor();
	}
    },
    themeableStyles: [{name: "wm.NumberSpinner-Down-Arrow_Image", displayName: "Down Arrow"}, {name: "wm.NumberSpinner-Up-Arrow_Image", displayName: "Up Arrow"}]
	
});

wm.Object.extendSchema(wm.mobile.Number, {
    resetButton: {ignore: 1},
    dataValue: {ignore: 1, bindable: 1, group: "editData", order: 3, simpleBindProp: true, type: "Number"},
    places: {group: "editor", order: 2, doc: 1},
    minimum:  { group: "editor", order: 3, emptyOK: true, doc: 1},
    maximum: { group: "editor", order: 4, emptyOK: true, doc: 1},
    rangeMessage: {  group: "editor", order: 5},
    spinnerButtons: {group: "editor", order: 6},
    regExp: { ignore: 1 },
    maxChars: { ignore: 1},
    setMaximum: {group: "method", doc: 1},
    setMinimum: {group: "method", doc: 1}
});
