/*
 *  Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Dialogs.ColorPickerDialog");
dojo.require("wm.base.widget.Dialogs.Dialog");


dojo.declare("wm.ColorPickerDialog", wm.Dialog, {
    colorPicker: null,  
    colorPickerSet: false,
    border: "1",
    borderColor: "#888888",
    width: "325px",
    height: "235px",
    modal: false,
    colorPickerControl: null,
    init: function() {
	this.inherited(arguments);
        dojo.require("dojox.widget.ColorPicker");
    },
    postInit: function() {
	this.inherited(arguments);

        if (!wm.ColorPickerDialog.cssLoaded) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = dojo.moduleUrl("dojox.widget.ColorPicker").uri + "ColorPicker.css";
            document.getElementsByTagName("head")[0].appendChild(link);
            wm.ColorPickerDialog.cssLoaded = true;
        }
        this.colorPickerControl = new wm.Control({name: "colorPickerControl", width: "325px", height: "170px", owner: this, parent: this});
        this.textPanel = new wm.Panel({name: "buttonPanel", width: "100%", height: "26px", layoutKind: "left-to-right", owner: this, parent: this, horizontalAlign: "center"});

        this.BrightenButton = new wm.Button({caption: "Bright",//studio.getDictionaryItem("wm.ColorPickerDialog.BRIGHTEN"), 
					     width: "75px", height: "100%", parent: this.textPanel, owner: this});
        this.DarkenButton = new wm.Button({caption: "Dark",//studio.getDictionaryItem("wm.ColorPickerDialog.DARKEN"), 
					   width: "75px", height: "100%", parent: this.textPanel, owner: this});
	this.text = new wm.Text({
	    owner: this,
	    parent: this.textPanel,
	    name: "text",
	    width: "100%",
	    resetButton: true,
	    placeHolder: "Enter Color",
	    changeOnKey: true,
	    onchange: dojo.hitch(this, "textChange"),
	    onEnterKeyPress: dojo.hitch(this, "onOK")
	});


        this.buttonPanel = new wm.Panel({_classes: {domNode: ["dialogfooter"]}, name: "buttonPanel", width: "100%", height: "100%", layoutKind: "left-to-right", owner: this, parent: this, horizontalAlign: "right"});

        this.CancelButton = new wm.Button({caption: "Cancel",//studio.getDictionaryItem("wm.ColorPickerDialog.CANCEL"), 
					   width: "75px", height: "30px", parent: this.buttonPanel, owner: this});
        this.OKButton = new wm.Button({caption: "OK",//studio.getDictionaryItem("wm.ColorPickerDialog.OK"), 
				       width: "75px", height: "30px", parent: this.buttonPanel, owner: this});

        this.connect(this.BrightenButton, "onclick", this, "brighten");
        this.connect(this.DarkenButton, "onclick", this, "darken");
        this.connect(this.OKButton, "onclick", this, "onOK");
        this.connect(this.CancelButton, "onclick", this, "onCancel");
        this.domNode.style.backgroundColor = "white";
    },
    onCancel: function() {
    },
    onOK: function() {
        this.dismiss();
    },
    getValue: function() {
        if (this.colorPicker) {
            return this.colorPicker.getValue();
        } else {
            return this._tmpValue;
        }
    },
    setDijitValue: function(inValue) {
        if (this.colorPicker) {
	    if (inValue) {
		this.colorPicker.setColor(inValue);
	    }
        } else {
            this._tmpValue = inValue;
        }
	if (this.text && inValue != this.text.getDataValue()) {
	    this.text.setDataValue(inValue);
	}
	
    },
    setShowing: function(inShowing, forceShow) {
	var hasPicker = Boolean(this.colorPicker);
        if (!hasPicker && inShowing && this.domNode) {
            this.colorPicker = new dojox.widget.ColorPicker({animatePoint: true, 
							     showHsv: false, 
							     showRtb: true, 
							     webSave: false, 
							     onChange: dojo.hitch(this, "valueChange")},
							    this.domNode);       

            /* Hack because the colorpicker is beta and has problems getting these values correctly.  As the picker always appears in exactly the same place
             * in our dialog, we can always have these values be the same
             */
	    this.colorPicker.PICKER_SAT_VAL_H = 152;
	    this.colorPicker.PICKER_SAT_VAL_W = 152;
	    this.colorPicker.PICKER_HUE_H = 150;
/*
            this.colorPicker._shift.picker.x = 5;
            this.colorPicker._shift.picker.y = 5;
            */
        }
        
        if (inShowing) {

            // If it isn't currently showing, and we're now showing it, set _changed to false
            if (!this.showing)
                this._changed = false;

            if (this._tmpValue) {
                this.setDijitValue(this._tmpValue);
                delete this._tmpValue;
            }
            if (this.domNode.parentNode != document.body) {
                document.body.appendChild(this.domNode);
                this.colorPickerControl.domNode.appendChild(this.colorPicker.domNode);
            }
            if (this.owner.editorNode) {
		var o = dojo._abs(this.owner.editorNode);
                o.y += this.owner.bounds.h;
                this.bounds.t = o.y;
                this.bounds.l = o.x;
                this._fixPosition = true;
            }
        }
        this.inherited(arguments);
        if (!hasPicker && inShowing) {
	    wm.onidle(this, function() {
		this.colorPicker.startup();
	    });
	}
    },
    valueChange: function(inValue) {        
        this._changed = true;
	this.text.setDataValue(inValue);
        this.onChange(inValue);
    },
    textChange: function(inDisplayValue, inDataValue) {
	this._changed = true;
	this.setDijitValue(inDisplayValue);
        this.onChange(inDisplayValue);
    },
    onChange: function(inValue) {

    },
    brighten: function() {
        var value = this.colorPicker.attr("value");
        var values = [parseInt(value.substr(1,2),16),
                      parseInt(value.substr(3,2),16),
                      parseInt(value.substr(5,2),16)];
        var result = "#";
        var zeroCount = 0;
        var maxCount = 0;
        for (var i = 0; i < 3; i++) {
            if (values[i] == 0) zeroCount++;
            else if (values[i] == 255) maxCount++;
        }

        var minValue = 0;
        if (maxCount + zeroCount == 3)
            minValue = 40;
        for (var i = 0; i < 3; i++) {
            values[i] = Math.max(minValue,Math.min(255,Math.floor(values[i] * 1.2)));
            var str = values[i].toString(16);            
            if (str.length < 2) str = "0" + str;
            result += str;
        }



        this.setDijitValue(result);
        this.onChange(result);
    },
    darken: function() {
        var value = this.colorPicker.attr("value");
        var values = [parseInt(value.substr(1,2),16),
                      parseInt(value.substr(3,2),16),
                      parseInt(value.substr(5,2),16)];
        var result = "#";
        for (var i = 0; i < 3; i++) {
            values[i] = Math.floor(values[i] * 0.8);
            var str = values[i].toString(16);
            if (str.length < 2) str = "0" + str;
            result += str;
        }
        this.setDijitValue(result);
        this.onChange(result);
    },
    destroy: function() {
        if (this.colorPicker) // doesn't exist if the dialog never shown
            this.colorPicker.destroyRecursive();
        this.inherited(arguments);
    }
    

});
