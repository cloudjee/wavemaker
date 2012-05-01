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


dojo.provide("wm.base.widget.Editors.Checkbox");
dojo.require("wm.base.widget.Editors.AbstractEditor");
dojo.require("dijit.form.CheckBox");

dojo.declare("wm.Checkbox", wm.AbstractEditor, {
    _captionTagName: "label", // using this allows clicking the label to toggle the editor

    /* Formating */
    classNames: "wmeditor wmeditor-cbeditor",
	width: "180px",

	dataType: "boolean", /* TODO: WARNING, this may cause upgrade problems changing this from string to boolean */
	startChecked: false,
        checkedValue: true,
    touchStart: function() {
		    this._touched = true;
		    this.editorNode.style.backgroundColor = "black";
		    if (this.getChecked()) {
			this.editorNode.style.color = "white";
		    }
	    wm.job(this.getRuntimeId() + "." + ".touch", app.touchToClickDelay, dojo.hitch(this, "touchEnd"));
    },
    touchMove: function() {
	if (this._touched) {
	    wm.cancelJob(this.getRuntimeId() + "." + ".touch");
	    this.editorNode.style.backgroundColor = "";
	    this.editorNode.style.color = "";
	    this._touched = false;
	}
    },
    touchEnd: function(evt) {
	if (this._touched) {
	    wm.cancelJob(this.getRuntimeId() + "." + ".touch");
	    this.editorNode.style.backgroundColor = "";
	    this.editorNode.style.color = "";
	    this.setChecked(!this.getChecked());
	    this._touched = false;
	}
    },

	_createEditor: function(inNode, inProps) {
		var e = new dijit.form.CheckBox(this.getEditorProps(inNode, inProps));
	    if (wm.isMobile || this._isDesignLoaded && studio.currentDeviceType != "desktop") {
		e._connects.forEach(function(c) {
		    dojo.disconnect(c[0]);
		});
		e._connects = [];
		var a = document.createElement("div");
		a.className = "wmcheckbox_x";
		a.innerHTML = "X"
		e.domNode.appendChild(a);
		dojo.connect(this.domNode, wm.isFakeMobile ? "onmousedown" : "ontouchstart", this, "touchStart");		
		dojo.connect(this.domNode, wm.isFakeMobile ? "onmousemove" : "ontouchmove", this, "touchMove");
		dojo.connect(this.domNode, wm.isFakeMobile ? "onmouseup" : "ontouchend", this, "touchEnd");
/*
		if (this.captionSize.match(/px/)) {
		    this.captionSize = Math.max(0,parseInt(this.captionSize) - 16) + "px";
		}
		*/
	    }
	    return e;
	},
	setRequired: function() {
	},
	connectEditor: function() {
		this.inherited(arguments);
/*
		if (this.captionNode)
		    this.addEditorConnect(this.domNode, "onclick", this, "captionClicked");
		    */
	},
	// checkbox cannot be sized, but should be adjusted in container
	sizeEditor: function() {
	    if (this._cupdating)
		return;
	    this.inherited(arguments);
	    var node = this.editorNode;
	    var size = wm.isMobile || this._isDesignLoaded && studio.currentDeviceType != "desktop" ? 32 : 16;
	    node.style.width = size + "px";
	    node.style.height =  size + "px";
            var height = parseInt(node.style.lineHeight);
            node.style.marginTop = (Math.floor(height-size)/2) + "px";
	},

	styleEditor: function() {
		this.inherited(arguments);
	        var n = this.captionNode;
		if (n) {
			dojo.setSelectable(n, false);
		}
	},
	render: function() {
	        this.inherited(arguments);
		// when caption is on right, move editor next to it.
		this.domNode.style.textAlign=(this.captionPosition == "right") ? "right" : "";
	},
	setInitialValue: function() {
		this.beginEditUpdate();
	    // if setEditorValue has been called, then startChecked no longer controls the checkbox's initial state;
	    // the dataValue only controls the state now.
	        if (this.startChecked && !this._setEditorValueCalled || Boolean(this.dataValue))
			this.setChecked(true);
		this.endEditUpdate();
	},
    editorChanged: function() {
	if (this.inherited(arguments)) {
	    this.valueChanged("checked", this.getChecked());
	    return true;
	} 
	return false;
    },
    changed: function() {
	if (this.editor) 
            this.editor._lastValueReported = this.getChecked();
        this.inherited(arguments);
	this.valueChanged("checked", this.getChecked());
    },
	getChecked: function() {
	    if (this.editor)
		return Boolean(this.editor.checked);
	    else
		return Boolean(this.dataValue);
	},

    // pass in the false parameer so that there is no delayed firing of side-effects to the checking of the checkbox; fire our own changed event
    // handler instead so that it onchange fires now.
	setChecked: function(inChecked) {
	    this.editor.set('checked',inChecked, false);
	    if (!this._cupdating)
		this.changed();
	},
/*
	captionClicked: function(e) {
	    if (!this.readonly && !this.disabled && !this.isDesignLoaded() && !dojo.isDescendant(e.target, this.editor.domNode)) {
		var isChecked = this.getChecked();
		wm.onidle(this, function() {
		    this.setChecked(!isChecked);
		});
	    }
	},
	*/
	getDisplayValue: function() {
	    return this.getDataValue();
	},
	setDisplayValue: function(inValue) {
	},
	getEditorValue: function() {
	    var c = this.editor && this.editor.checked;
	    var v = this.checkedValue;

	    if (v === undefined)
		v = this.getTypedValue(1);
	    else
		v = this.getTypedValue(v);
	    return c ? v : this.makeEmptyValue();
	},
    makeEmptyValue: function() {
	return this.getTypedValue(this.inherited(arguments));
    },
	getTypedValue: function(inValue) {
		var v = inValue;
		switch (this.dataType) {
			case "string":
				// return "" for all false values but 0 which is "0"
		    if (v === false) 
			v = "false";
		    else if (v === 0)
			v = "0";
		    else if (!v)
			v = "";
		    else
			v = String(v);
		    return v;
			case "number": 
				// if not a number, return number value of boolean value
				var n = Number(v);
				return isNaN(n) ? Number(Boolean(v)) : n;
			default:
				return Boolean(v);
		}
	},
	setEditorValue: function(inValue) {
	        this._setEditorValueCalled = true;
		if (this.editor) {
		    this.editor.set('checked',Boolean(inValue));
		}
	},

        updateReadonlyValue: function(){
	},
	setStartChecked: function(inChecked) {
	    this.startChecked = inChecked;
	    this.createEditor();
	},
    set_startChecked: function(inChecked) {
	this.dataValue = Boolean(inChecked);
	this.setStartChecked(inChecked);
    },
	setDataType: function(inDataType) {
		this.dataType = inDataType;
	    if (inDataType == "boolean") {
		this.displayValue = true;
	    }

	    switch(inDataType) {
		/* Anything can convert to a string */
	    case "string":
		break;
	    case "number":
		if (typeof this.checkedValue == "number") {
		} else if (String(this.checkedValue).match(/^[0-9.]+$/)) {
		} else {
		    app.toastWarning(studio.getDictionaryItem("wm.Checkbox.TOAST_WARN_CHECKED_VALUE_NOT_A_NUMBER"));
		}
		break;
	    case "boolean":
		if (typeof this.checkedValue == "boolean") {
		} else if (this.checkedValue == "true") {
		    this.checkedValue = true;
		} else if (this.checkedValue == "false") {
		    this.checkedValue = false;
		} else {
		    app.toastWarning(studio.getDictionaryItem("wm.Checkbox.TOAST_WARN_CHECKED_VALUE_NOT_A_BOOLEAN"));
		}
		break;
	    }
	},
	setDisabled: function(inDisabled) {
	    this.inherited(arguments);
	    if (!this.editor) return;
	    this.editor.set("disabled",this.readonly || this._disabled);
	},
	setReadonly: function(inReadonly) {
	    this.readonly = inReadonly;
	    if (!this.editor) return;
	    if (!this.readOnlyNode) this.readOnlyNode = this.editor;	    
	    this.editor.set("disabled",this.readonly || this._disabled);
	},
	getMinWidthProp: function() {
		if (this.minWidth) return this.minWidth;
	    var editorSize = wm.isMobile || this._isDesignLoaded && studio.currentDeviceType != "desktop" ? 32 : 16;
	    var captionSize = 64;
		if (this.captionPosition == "top" || this.captionPosition == "bottom" || !this.caption) return 40;
	    else if (this.captionSize.match(/\%/)) return editorSize + captionSize;
	    else return editorSize + 4 + parseInt(this.captionSize);
	}

});



