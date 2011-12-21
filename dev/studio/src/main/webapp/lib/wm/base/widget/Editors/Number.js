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


dojo.provide("wm.base.widget.Editors.Number");
dojo.require("wm.base.widget.Editors.Text");
dojo.require("dijit.form.VerticalSlider");
dojo.require("dijit.form.HorizontalSlider");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.CurrencyTextBox");


/* Fixes handling of places property in wm.Number */
dijit.form.NumberTextBox.extend({
        	format: function(value,  constraints){
			// summary:
			//		Formats the value as a Number, according to constraints.
			// tags:
			//		protected
			var formattedValue = String(value);
			if(typeof value != "number"){ return formattedValue; }
			if(isNaN(value)){ return ""; }
			// check for exponential notation that dojo.number.format chokes on
			if(!("rangeCheck" in this && this.rangeCheck(value, constraints)) && constraints.exponent !== false && /de[-+]?d/i.test(formattedValue)){
				return formattedValue;
			}
			constraints = dojo.mixin({}, constraints, this.editOptions);
			return this._formatter(value, constraints);
		}
});





//===========================================================================
// Number Editor
//===========================================================================
dojo.declare("wm.Number", wm.Text, {
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

    getEditorConstraints: function() {
	var constraints = {};
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

	//constraints.pattern = this._getPattern();

	return constraints;
    },
     getEditorProps: function(inNode, inProps) {
    var v = this.displayValue;
	var constraints = this.getEditorConstraints();
	var p = dojo.mixin(this.inherited(arguments), {
	    constraints: constraints,
	    //editPattern: constraints.pattern,
	    rangeMessage: this.rangeMessage,
	    required: this.required,
	    value: v ? Number(v) : "",
	    editOptions: {}
	}, inProps || {});
	if (this.places) {
	    p.editOptions.places = Number(this.places);
	}
	return p;
     },

/*
    numberFormat: "",
    numberFormatter: function(inValue) {
	if (inValue === undefined ||
	    inValue === null ||
	    inValue === "") return inValue;

	inValue = String(inValue); // inValue is a number

	var result = "";
	/ * If inValue is different from _lastFormattedNumber only at the end of the string, then the user is doing normal changes; 
	 * If the user is NOT doing normal changes, stick '_' wherever characters were removed
	 * /
	if (this._lastFormattedNumber &&
	    this._lastFormattedNumber.indexOf(inValue) != 0 &&
	    inValue.indexOf(this._lastFormattedNumber) != 0) 
	{
	    var a = inValue;
	    var b = this._lastFormattedNumber;
	    var length = (this._lastFormattedNumber.length <= inValue.length) ? this._lastFormattedNumber.length : inValue.length;
	    inValue = "";
	    var iOffset = 0;	    
	    for (var i = 0; i < length; i++) {
		if (a.charAt(i) == b.charAt(i+iOffset) || b.charAt(i+iOffset).match(/\D/)) {
		    inValue += a.charAt(i);
		} else {
		    debugger;
		    inValue += "_";
		    iOffset++;
		}
	    }
	} 
	    var v = String(inValue||"").replace(/[^0-9\._]/g,"").split("");
	    var n = this.numberFormat;
	    var vIndex = 0;

	    for (var i = 0; i < n.length; i++) {
		if (n.charAt(i) == "?") {
		    result += v[vIndex] || "";
		    vIndex++;
		    if (vIndex >= v.length) break;
		} else {
		    result += n.charAt(i);
		}
	    }

	this._lastFormattedNumber = result.replace(/[^0-9\._]/g,"");
	return result;
    },
    numberParser: function(inValue) {
	inValue = String(inValue);
	if (inValue.indexOf("_") != -1) {
	    return inValue.replace(/[^0-9\._]/g,"");
	} else {
	    return parseInt(String(inValue).replace(/\D/g,""));
	}
    },
    */
	_getPlaces: function (){
		return '';
	},
	_createEditor: function(inNode, inProps) {
	    if (this.spinnerButtons)
		return new dijit.form.NumberSpinner(this.getEditorProps(inNode, inProps));
	    else
		return new dijit.form.NumberTextBox(this.getEditorProps(inNode, inProps));
	},
/*
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
	*/
	setMaximum: function(inMax) {
	        var v = (inMax === "") ? "" : Number(inMax);
		if (this.minimum === "" || this.minimum < v || v === "") {
			this.maximum = v;
		        if (this.editor) {
			    this.editor._setConstraintsAttr(this.getEditorConstraints());
			        this.editor.validate();
			}
		} else if (this.isDesignLoaded() && !(this.$.binding && this.$.binding.wires.maximum)) {
		    app.alert(dojo.string.substitute(this._messages.rangeMax, [this.minimum]));
		}
	},
	setMinimum: function(inMin) {
	        var v = (inMin === "") ? "" :  Number(inMin);
		if (this.maximum === "" || v < this.maximum || v === "") {
			this.minimum = v;
		        if (this.editor) {
			    this.editor._setConstraintsAttr(this.getEditorConstraints());
			    this.editor.validate();
			}
		} else if (this.isDesignLoaded() && !(this.$.binding && this.$.binding.wires.minimum)) {
		    app.alert(dojo.string.substitute(this._messages.rangeMin, [this.maximum]));
		}
	},
	_getReadonlyValue: function() {
	    return dojo.number.format(this.getDataValue(), this.getFormatProps());
	},
	getFormatProps: function() {
		var formatProps = {};
		if (this.places && this.places != '')
			formatProps.places = parseInt(this.places);
		return formatProps;
	},
    setSpinnerButtons: function(inSpinner) {
	if (this.spinnerButtons != inSpinner) {
	    this.spinnerButtons = inSpinner;
	    this.createEditor();
	}
    },
    calcIsDirty: function(a,b) {
	return a !== b;
    }

/*
    dokeypress: function(inEvent) {
	if (this.numberFormat) {
	    if (app._keys[inEvent.keyCode].match(/\d/)) {
	    var d =  this.editor.get("displayedValue");
	    var pos = this.getCursorPosition();
	    if (d.charAt(pos+1) == '_') {
		this.editor.textbox.value = d.substring(0, pos+1) + d.substring(pos+2);
		this.setCursorPosition(pos+1);
	    }
	    } else if ( app._keys[inEvent.keyCode] == "BACKSPACE") {
		
	    }
	}
	this.inherited(arguments);
    }

    changed: function() {
	if (this.numberFormat && this.editor && this.editor.textbox) {
	    var val = this.editor.get("displayedValue");
	    var formattedValue = this.editor.format(this.editor.parse(val));

	    if(formattedValue !== undefined) {
		var pos = this.getCursorPosition();
		pos += (formattedValue.length - val.length);		
		this.editor.textbox.value = formattedValue;
		this.setCursorPosition(pos+1);
	    }
	}
	this.inherited(arguments);
	  }*/

});

//===========================================================================
// Currency Editor
//===========================================================================
dojo.declare("wm.Currency", wm.Number, {
	currency: "",
	getEditorProps: function(inNode, inProps) {
		var prop = this.inherited(arguments);
		if (prop.constraints)
			delete prop.constraints.pattern;

		return dojo.mixin(prop, {
		    currency: this.currency || (this._isDesignLoaded ? studio.application.currencyLocale : app.currencyLocale) || "USD"
		}, inProps || {});
	},
	_createEditor: function(inNode, inProps) {
		return new dijit.form.CurrencyTextBox(this.getEditorProps(inNode, inProps));
	},
	_getReadonlyValue: function() {
	    return dojo.currency.format( this.dataValue, {currency: this.currency || (this._isDesignLoaded ? studio.application.currencyLocale : app.currencyLocale) || "USD",
							  places: parseInt(this.places)});
	},
	_getPlaces: function() {
		return this.places;
	},
    setEditorValue: function(inValue) {
	var v = inValue;
	if (this.editor)
	    v = dojo.currency.parse(dojo.currency.format(String(v).replace(/[^0-9\-\.]/g,""),
							 this.editor.constraints),
				    this.editor.constraints)
	wm.AbstractEditor.prototype.setEditorValue.call(this, v);
    },
    getDataValue: function() {return this.dataValue;},
    editorChanged: function() {
	var dataValue = this.dataValue;
	this.dataValue = this.getEditorValue();

	var displayValue = this.displayValue;
	this.displayValue = this._getReadonlyValue();
	
	var changed = false;

	if (dataValue != this._lastValue) {
	    this.valueChanged("dataValue", this.dataValue);
	    changed = true;
	}
	if (displayValue != this.displayValue) {
	    this.valueChanged("displayValue", this.displayValue);
	    changed = true;
	}
	if (changed) {
	    if (this._inPostInit) {		
		this._lastValue = this.dataValue;
	    }
	    this.updateIsDirty();
	}
	return changed;
    },

    setCurrency: function(inCurrency) {
	this.currency = inCurrency;
	this.createEditor();
    }

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
	setMaximum: function(inMax) {
	    this.maximum = (inMax === "") ? 100 : Number(inMax);
	    if (this.editor) {
		this.editor.maximum = this.maximum;
		this.editor._setValueAttr(this.dataValue, true);
	    }
	},

    setMinimum: function(inMin) {
	    this.minimum = (inMin === "") ? 0 : Number(inMin);
	    if (this.editor) {
		this.editor.minimum = this.minimum;
		this.editor._setValueAttr(this.dataValue, true);
	    }
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
