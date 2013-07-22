/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Editors.Date");
dojo.require("wm.base.lib.date");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.TimeTextBox");

//===========================================================================
// Date Editor
//===========================================================================
dojo.declare("wm.Date", wm.Text, {
    openOnClick: true,
    useLocalTime: false,
    promptMessage: "",
    invalidMessage: "",
    minimum: "",
    maximum: "",
    dateMode: "Date",
    formatLength: "short",
    datePattern: "",
    //locale: '',
    validationEnabled: function() {
        return true;
    },
    getEditorConstraints: function() {
        var constraints = {};
        if (this.minimum) constraints.min = this.convertValue(this.minimum);
        if (this.maximum) constraints.max = this.convertValue(this.maximum);
        if (this.datePattern) constraints.datePattern = this.datePattern;
        if (this.timePattern) constraints.timePattern = this.timePattern;
        return constraints;
    },
    getEditorProps: function(inNode, inProps) {
        var constraints = this.getEditorConstraints();

        var prop = dojo.mixin(this.inherited(arguments), {
            promptMessage: this.promptMessage,
            invalidMessage: this.invalidMessage || "$_unset_$",
            constraints: constraints,
            required: this.required,
            openOnClick: this.openOnClick,
            value: this.convertValue(this.displayValue)
        }, inProps || {});

        /*
        if (this.locale != '')
            prop.lang = this.locale;
*/
        return prop;
    },
    _createEditor: function(inNode, inProps) {
        var e = new wm.form.DateTextBox(this.getEditorProps(inNode, inProps));
        if (wm.isMobile) {
            var self = this;
            dojo.query("input", e.domNode).forEach(function(node) {
                dojo.attr(node, "readonly", true);
            })
        }
        return e;
    },
    convertValue: function(inValue) {
        return wm.convertValueToDate(inValue, {
            selector: this.dateMode.toLowerCase(),
            formatLength: this.formatLength,
            timePattern: this.use24Time ? "HH:mm" : "hh:mm a",
            datePattern: this.datePattern || undefined
        });
    },
    getEditorValue: function() {
        var d = this.inherited(arguments);
        if (d) {
            if (!this.useLocalTime) {

                    /* See WM-4490 to understand this calculation */
                    var adjustTwoHours = (this.owner instanceof wm.DateTime == false || this.owner.dateMode == "Date") ? 120 : 0;

                    /* Zero out minutes/seconds which have no bearing on a date-only calc */
                    d.setHours(0, -60 * wm.timezoneOffset + adjustTwoHours,0,0);

            }
            return d.getTime();
        }
        return this.makeEmptyValue();
    },
    setDisplayValue: function(inValue) {
        var tmp = this.useLocalTime;
        this.useLocalTime = true;
        this.setEditorValue(inValue);
        this.useLocalTime = tmp;
    },
    setEditorValue: function(inValue) {
        if (inValue === "") inValue = null;
        if (inValue === null || inValue === undefined) return this.inherited(arguments);

        var v = this.convertValue(inValue); // if inValue is just a date, returns unmodified date

        // don't modify the source data as the caller may still need it
        v = new Date(v);
        v.setHours(0,0);

        // If we assume that this is server time, then we need to add some number of hours to it so that instead of showing the date in local time, we show the date as it is according to the server
        if (!this.useLocalTime && v) {
             /* See WM-4490 to understand this calculation. */
            var adjustTwoHours = (this.owner instanceof wm.DateTime == false || this.owner.dateMode == "Date") ? 120 : 0;
            v.setHours(0, 60*v.getHours() + v.getMinutes() +60*wm.timezoneOffset + adjustTwoHours);
        }
        this.inherited(arguments, [v]);
    },
    setDefaultOnInsert: function() {
        if (this.defaultInsert) {
            if (this.$.binding && this.$.binding.wires.defaultInsert) this.$.binding.wires.defaultInsert.refreshValue();
            this.setDataValue(this.defaultInsert); // setDataValue knows how to handle Date and long; dijit.set apparently does not.
            this.invalidate();
        }
    },
    calcDisplayValue: function(inDate) {
        var d = inDate;
        if (d instanceof Date == false) d = new Date(inDate);
        return dojo.date.locale.format(d, {
            formatLength: this.formatLength,
            fullYear: true,
            selector: this.dateMode.toLowerCase(),
            timePattern: this.use24Time ? 'HH:mm' : "hh:mm a",
            datePattern: this.datePattern || undefined
        });

    },
    getDisplayValue: function() {
        if (this.editor) return this.editor.get("displayedValue");
        else if (this.dataValue) return this.calcDisplayValue(this.dataValue);
        else return "";
    },

    /* Note that the definition of what are legal values is based on the conversions done by getEditorConstraints */
    setMaximum: function(inMax) {
        if (!inMax) {
            this.maximum = null;
        } else {
            this.maximum = inMax;
        }
        if (this.editor) {
            this.editor._setConstraintsAttr(this.getEditorConstraints());
            this.editor.validate();
        }
    },
    setMinimum: function(inMin) {
        if (!inMin) {
            this.minimum = null;
        } else {
            this.minimum = inMin;
        }
        if (this.editor) {
            this.editor._setConstraintsAttr(this.getEditorConstraints());
            this.editor.validate();
        }
    },


    calcIsDirty: function(val1, val2) {
        if (val1 === undefined || val1 === null) val1 = 0;
        if (val2 === undefined || val2 === null) val2 = 0;

        if (val1 instanceof Date == false) {
            val1 = new Date(val1);
        }
        if (val2 instanceof Date == false) {
            var val2 = new Date(val2);
        }

        if (val1 && val2 && val1.getTime() == val2.getTime()) {
            return false;
        }
        val1 = dojo.date.locale.format(val1, {
            formatLength: this.formatLength || "short",
            selector: this.dateMode.toLowerCase(),
            timePattern: this.use24Time ? 'HH:mm' : "hh:mm a",
            datePattern: this.datePattern || undefined
        });
        val2 = dojo.date.locale.format(val2, {
            formatLength: this.formatLength || "short",
            selector: this.dateMode.toLowerCase(),
            timePattern: this.use24Time ? 'HH:mm' : "hh:mm a",
            datePattern: this.datePattern || undefined
        });

        return val1 != val2;
    }

});

//===========================================================================
// Time Editor
//===========================================================================
dojo.declare("wm.Time", wm.Date, {
    useLocalTime: true,
    use24Time: false,
    timePattern: 'hh:mm a',
    useWMDropDown: false,
    init: function() {
        this.inherited(arguments);
        if (this.use24Time) {
            this.timePattern = this.timePattern.replace(/h/g, "H").replace(/ a/, "");
        }
    },
    setDataValue: function(inValue) {
        if (inValue) {
            var d = new Date(inValue);
            d.setYear(1970);
            d.setMonth(0);
            d.setDate(1);
        }
        this.inherited(arguments, [inValue ? d.getTime() : null]);
    },
    getEditorProps: function(inNode, inProps) {
        var prop = dojo.mixin(this.inherited(arguments), {
            use24Time: this.use24Time,
            constraints: {
                timePattern: this.timePattern
            }
        }, inProps || {});
        return prop;
    },
    convertValue: function(inValue) {
        return wm.convertValueToDate(inValue, {
            selector: "time"
        });
    },
    _createEditor: function(inNode, inProps) {
        var e;
        if (this.useWMDropDown) {
            e = new wm.form.TimeTextBox(this.getEditorProps(inNode, inProps));
        } else {
            e = new dijit.form.TimeTextBox(this.getEditorProps(inNode, inProps));
        }
        if (wm.isMobile) {
            var self = this;
            dojo.query("input", e.domNode).forEach(function(node) {
                dojo.attr(node, "readonly", true);
            })

        }
        return e;
    },
    getEditorValue: function() {
        var d = wm.Text.prototype.getEditorValue.call(this);
        if (d) {
            if (!this.useLocalTime && (this.owner instanceof wm.DateTime === false)) {
                 /* See WM-4490 to understand this calculation */
                d.setHours(0, 60*d.getHours() + d.getMinutes() + 60*wm.timezoneOffset,0);
                //d.setHours(d.getHours() - wm.timezoneOffset);
            }
            return d.getTime();
        }
        return this.makeEmptyValue();
    },
    setEditorValue: function(inValue) {
        if (inValue === "") inValue = null;
        if (inValue === null || inValue === undefined) {
            return wm.AbstractEditor.prototype.setEditorValue.call(this, null);
        } else if (this.useLocalTime) {
            return wm.AbstractEditor.prototype.setEditorValue.call(this, new Date(inValue));
        }

        // don't modify the source data as the caller may still need it
        var v = new Date(inValue);

        // If we assume that this is server time, then we need to add some number of hours to it so that instead of showing the date in local time, we show the date as it is according to the server
        if (!this.useLocalTime && v && (this.owner instanceof wm.DateTime == false || this.owner.dateMode != "Date")) {
            v.setHours(0, 60*v.getHours() + v.getMinutes() +60*wm.timezoneOffset);
        }
        return wm.AbstractEditor.prototype.setEditorValue.call(this, new Date(v));
    },
    calcIsDirty: function(val1, val2) {
        if (val1 === undefined || val1 === null) val1 = 0;
        if (val2 === undefined || val2 === null) val2 = 0;

        if (val1 instanceof Date == false) {
            val1 = new Date(val1);
        }
        if (val2 instanceof Date == false) {
            var val2 = new Date(val2);
        }

        if (val1 && val2 && val1.getTime() == val2.getTime()) {
            return false;
        }
        val1 = dojo.date.locale.format(val1, {
            timePattern: this.timePattern,
            selector: "time"
        });
        val2 = dojo.date.locale.format(val2, {
            timePattern: this.timePattern,
            selector: "time"
        });

        return val1 != val2;
    }

});


dojo.declare("wm.DateTime", wm.Date, {
    editorBorder: false,
    use24Time: false,
    formatLength: "short",
    dateMode: "Date and Time",
    editorSpacing: "2",
    _createEditor: function(inNode, inProps) {
        this.containerWidget = new wm.Container({
            width: "100%",
            height: "100%",
            layoutKind: "left-to-right",
            horizontalAlign: "left",
            verticalAlign: "top",
            name: "containerWidget",
            owner: this,
            domNode: inNode
        });

        this.dateEditor = new wm.Date({
            owner: this,
            parent: this.containerWidget,
            name: "date",
            showing: this.dateMode != "Time",
            width: "100%",
            height: "100%",
            padding: "0",
            margin: this.dateMode == "Date and Time" ? "0," + this.editorSpacing + ",0,0" : "0",
            openOnClick: this.openOnClick,
            useLocalTime: this.useLocalTime,
            formatLength: this.formatLength,
            datePattern: this.datePattern,
            required: this.required,
            maximum: this.maximum,
            minimum: this.minimum,
            minHeight: 8,
            onchange: dojo.hitch(this, "changed")
        });
        this.timeEditor = new wm.Time({
            owner: this,
            useWMDropDown: true,
            name: "time",
            parent: this.containerWidget,
            showing: this.dateMode != "Date",
            width: "100%",
            height: "100%",
            padding: "0",
            openOnClick: this.openOnClick,
            useLocalTime: this.useLocalTime,
            formatLength: this.formatLength,
            use24Time: this.use24Time,
            timePattern: this.timePattern || wm.Time.prototype.timePattern,
            required: this.required,
            minHeight: 8,
            onchange: dojo.hitch(this, "changed")
        });
        if (this._disabled) this.setDisabled(this.disabled);
        return this.containerWidget;
    },
    flow: function() {
        if (this.containerWidget && !this.containerWidget.isDestroyed) this.containerWidget.flow();
    },
    sizeEditor: function() {
        this.inherited(arguments);
        this.flow();
    },

    setDisabled: function(inValue) {
        wm.Control.prototype.setDisabled.call(this, inValue);
        if (this.containerWidget) {
            this.containerWidget._parentDisabled = this._disabled;
            this.containerWidget.setDisabled(inValue);
        }
    },
    focus: function(inValue) {
        if (!this.editor) return;
        switch (this.dateMode) {
        case "Date and Time":
        case "Date":
            this.dateEditor.focus();
            break;
        case "Time":
            this.timeEditor.focus();
            break;
        }
    },
    _getValidatorNode: function() {
        return null;
    },
    setEditorValue: function(inValue) {
        if (!this.editor) {
            this.dataValue = inValue;
            return;
        }
        var d;
        if (inValue instanceof Date) {
            d = new Date(inValue); // else our date calculations modify the input object which can cause ugly side effects
        } else if (String(inValue).match(/^\d+$/)) {
            d = new Date(inValue); // its a long
        } else if (inValue) {
            d = wm.convertValueToDate(inValue, {
                formatLength: this.formatLength,
                selector: this.dateMode.toLowerCase(),
                timePattern: this.use24Time ? 'HH:mm' : "hh:mm a",
                datePattern: this.datePattern || undefined
            });
        }

        this.timeEditor.setDataValue(d);
        this.dateEditor.setDataValue(d);

        this.updateReadonlyValue();

    },
    setDisplayValue: function(inValue) {
        var tmp = this.useLocalTime;
        this.useLocalTime = true;
        this.dateEditor.useLocalTime = true;
        this.timeEditor.useLocalTime = true;
        this.setEditorValue(inValue);
        this.useLocalTime = tmp;
        this.dateEditor.useLocalTime = tmp;
        this.timeEditor.useLocalTime = tmp;
    },
    getEditorValue: function(inValue) {
        var d = new Date(0);
        if (this.dateMode == "Date" || this.dateMode == "Date and Time") {
            var v = this.dateEditor.getDataValue();
            if (v) {
                d = new Date(v);
            } else {
                return null;
            }
        }
        if (this.dateMode == "Time" || this.dateMode == "Date and Time") {
            var v = this.timeEditor.getDataValue(); // gets long
            if (v) {
                var datetmp = new Date(v);
                if (this.useLocalTime) {
                    d.setHours(datetmp.getHours(), datetmp.getMinutes(), datetmp.getSeconds());
                } else {
                    d.setHours(0, (datetmp.getHours() + d.getHours()) * 60 + d.getMinutes() +  datetmp.getMinutes(), datetmp.getSeconds());
                }
            } else if (this.useLocalTime) {
                d.setHours(0, 0, 0);
            }
        }
        return d.getTime();
    },
    setDateMode: function(inValue) {
        // must get value before changing formatLength because formatLength determines how to parse the value
        var value = this.getDataValue();
        this.dateMode = inValue;
        if (this.editor) {
            switch (this.dateMode) {
            case "Date and Time":
                this.dateEditor.show();
                this.timeEditor.show();
                break;
            case "Date":
                this.dateEditor.show();
                this.timeEditor.hide();
                break;
            case "Time":
                this.dateEditor.hide();
                this.timeEditor.show();
                break;
            }
        }
        this.setDataValue(value);
    },
    _getReadonlyValue: function() {
        var d = this.getDataValue();
        if (d) {
            d = new Date(d);
            if (!this.useLocalTime) {
                /* See WM-4490 to understand this calculation */
                var adjustTwoHours = (this.dateMode == "Date") ? 120 : 0;

                d.setHours(0, 60 * d.getHours() + d.getMinutes() + 60 * wm.timezoneOffset + adjustTwoHours);
            }
        }
        return d === null || d === undefined ? "" : this.calcDisplayValue(d);
    },

    getDisplayValue: function() {
        var v = this.getDataValue();
        if (v === null || v === undefined) return "";
        return this.calcDisplayValue(this.getDataValue());
    },
    setMaximum: function(inValue) {
        this.maximum = inValue;
        this.dateEditor.setMaximum(inValue);
    },
    setMinimum: function(inValue) {
        this.minimum = inValue;
        this.dateEditor.setMinimum(inValue);
    },
    getInvalid: function() {
        return this.editor ? this.editor.getInvalid() : false;
    },
    connectEditor: function() {
        this.disconnectEditor();
        this.timeEditor.onChange = this.dateEditor.onChange = dojo.hitch(this, "changed");
        this.timeEditor.onblur = this.dateEditor.onblur = dojo.hitch(this, "onblur");
        this.timeEditor.onfocus = this.dateEditor.onfocus = dojo.hitch(this, "onfocus");
    }

    /* OLD EDITOR
    getEditorConstraints: function() {
    var constraints = this.inherited(arguments);
    constraints.formatLength = this.formatLength;
    constraints.timePattern = this.use24Time ? "HH:mm" : "hh:mm a";
    switch(this.dateMode) {
    case "Date and Time":
        constraints.selector = "datetime";
        break;
    case "Date":
        constraints.selector = "date";
        break;
    case "Time":
        constraints.selector = "date";
        break;
    }
    return constraints;
    },
    getEditorProps: function(inNode, inProps) {
    var p = this.inherited(arguments);
    p._selector = this.dateMode == "Date and Time" ? "datetime" : this.dateMode.toLowerCase();
    p.use24Time = this.use24Time;
    return p;
    },
    _createEditor: function(inNode, inProps) {
    var e = dijit.form.DateTimeTextBox(this.getEditorProps(inNode, inProps));
    if (wm.isMobile) {
        dojo.attr(e.focusNode, "readonly", true);
        //this.connect(e.domNode, "ontouchstart", e, "openDropDown");
    }
    return e;
    },
/ *
    _createEditor: function(inNode, inProps) {
    var e = this.inherited(arguments);
    var node = document.createElement("div");
    node.innerHTML = "<div class='dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer' role='presentation' ><input class='dijitReset dijitInputField dijitArrowButtonInner' value='▼ ' type='text' tabindex='-1' readonly='readonly' role='presentation'></div>";
    e.domNode.appendChild(node.firstChild);
    this._arrowNode = e.domNode.firstChild;
    e.domNode.appendChild(e.domNode.firstChild); // make the first child the last child
    dojo.destroy(node);
    dojo.addClass(e.domNode, "dijitComboBox");
    return e;
    },
    * /
    */


    /*
    updateIsDirty: function() {
    var wasDirty = this.isDirty;
    var isDirty = true;
    var dataValue = this.calcDisplayValue(this.dataValue);
    var lastValue = this.calcDisplayValue(this._lastValue);
    if (dataValue == lastValue) {
        isDirty = false;
    } else if ((this.dataValue === "" || this.dataValue === null || this.dataValue === undefined) &&
           (this._lastValue === "" || this._lastValue === null || this._lastValue === undefined)) {
        isDirty = false;
    }
    this.valueChanged("isDirty", this.isDirty = isDirty);
    if (wasDirty != this.isDirty)
        dojo.toggleClass(this.domNode, "isDirty", this.isDirty);
    if (!app.disableDirtyEditorTracking)
        wm.fire(this.parent, "updateIsDirty");
    },
    setDisabled: function(inDisabled) {
    this.inherited(arguments);
    if (this.disabled && wm.DateTime.dialog && wm.DateTime.dialog._currentEditor == this)
        wm.DateTime.dialog.hide();
    },
    setShowing: function(inDisabled) {
    this.inherited(arguments);
    if (!this.showing && wm.DateTime.dialog && wm.DateTime.dialog._currentEditor == this)
        wm.DateTime.dialog.hide();
    },
    setReadonly: function(inDisabled) {
    this.inherited(arguments);
    if (this.readonly && wm.DateTime.dialog && wm.DateTime.dialog._currentEditor == this)
        wm.DateTime.dialog.hide();
    },
    destroy: function(inDisabled) {
    if (wm.DateTime.dialog && wm.DateTime.dialog._currentEditor == this)
        wm.DateTime.dialog.hide();
    this.inherited(arguments);
    },
    okClicked: function() {
    wm.DateTime.dialog.hide();
    this.changed();
    },
    cancelClicked: function() {
    wm.DateTime.dialog.hide();
    this.setDisplayValue(this._initialDisplayValue);
    },
    */


});

/* Overrides dojo's dijit to provide a popup that sizes itself for phones, and adds a close button */
dojo.declare("wm.form.DateTextBox", dijit.form.DateTextBox, {
    autoWidth: !Boolean(wm.isMobile),
    forceWidth: false,
    openDropDown: function( /*Function*/ callback) {
        this.inherited(arguments);
        if (wm.device == "phone") {
            var margin = 5;
            var h = app.appRoot.bounds.h - margin * 2;
            var w = app.appRoot.bounds.w - margin * 2;
            dojo.marginBox(this.dropDown.domNode.parentNode, {
                l: 3,
                t: 3,
                w: app.appRoot.bounds.w,
                h: app.appRoot.bounds.h
            });
            dojo.marginBox(this.dropDown.domNode, {
                l: 0,
                t: 0,
                w: w - 8,
                h: h - 5
            });
            if (!this.xNode) {
                var x = this.xNode = document.createElement("span");
                x.innerHTML = "X";
                dojo.addClass(x, "CalendarCloseButton");
                this.dropDown.domNode.appendChild(x)
                this.owner.connect(x, wm.isFakeMobile ? "onclick" : "onclick", this, function() {
                    this.closeDropDown(false);
                });
            } else {
                this.dropDown.domNode.appendChild(this.xNode)
            }
        }
    }
});

/* Overrides dojo's dijit to provide a popup that is more mobile friendly and less annoying on desktop */
dojo.declare("wm.form.TimeTextBox", dijit.form.TimeTextBox, {
    forceWidth: false,
    // Force the popup to use its own width and not match the editor width
    autoWidth: false,
    // Force the popup to use its own width and not match the editor width
    popupClass: "wm.TimePicker",
    // name of the class to use for the popup (since I have my own openDropDown this may be ignored)
    openDropDown: function( /*Function*/ callback) {
        try {
            this._openningDropDown = true;
            if (!wm.TimePicker.dialog) {
                wm.TimePicker.dialog = new wm.TimePicker({
                    owner: this,
                    name: "DateTimePopup"
                });
            }
            if (this.dropDown && this.dropDown._popupWrapper && !this.dropDown._popupWrapper.style.display) return;
            var phoneSize = Number(app.appRoot.deviceSize) <= 450;
            this.dropDown = wm.TimePicker.dialog;
            this.dropDown._cupdating = true;
            this.dropDown.okButton.setCaption("OK"); // TODO: Localize
            this.dropDown.cancelButton.setCaption("Cancel"); // TODO: Localize
            this.dropDown._updating = true;

            this.dropDown.setUse24Time(this.use24Time);


            this.dropDown._currentDijit = this;
            this._aroundNode = app.appRoot.domNode;
            this._preparedNode = true;
            var result = dijit._HasDropDown.prototype.openDropDown.call(this, callback);

            var noReposition = false;
            if (phoneSize) {
                noReposition = true;
                var margin = 5;
                var h = app.appRoot.bounds.h - margin * 2;
                var w = app.appRoot.bounds.w - margin * 2;
                dojo.marginBox(this.dropDown.domNode.parentNode, {
                    l: 5,
                    t: 5,
                    w: w,
                    h: h
                });
                this.dropDown.setWidth(w + "px");
                this.dropDown.setHeight(h + "px");
            } else if (wm.isMobile) {
                this.dropDown.setHeight("350px");
                this.dropDown.setWidth("253px");
            } else {
                //this.dropDown.setHeight(this.dropDown.getPreferredFitToContentHeight() + "px");
                this.dropDown.setHeight("240px");
                this.dropDown.setWidth("260px");
            }

            if (!noReposition) {
                var editorPos = dojo.coords(this.owner.editor.domNode);
                var position = {
                    h: this.dropDown.bounds.h,
                    w: this.dropDown.bounds.w
                };

                if (editorPos.y + editorPos.h + position.h < app.appRoot.bounds.h) {
                    position.t = editorPos.y + editorPos.h;
                } else if (position.h < editorPos.y) {
                    position.t = editorPos.y - position.h;
                } else {
                    position.t = 0;
                }
                position.l = editorPos.x;
                if (position.l + position.w > app.appRoot.bounds.w) {
                    position.l = app.appRoot.bounds.w - position.w;
                }
                dojo.marginBox(this.dropDown.domNode.parentNode, position);
            }

            this.dropDown.buttonPanel.setShowing(wm.isMobile);
            this.dropDown.callOnShowParent();
            this.dropDown.setDataValue(this.get("value"));
            this.dropDown._updating = false;
            /*
          else
          this.dropDown.hours.focus();*/

            app.addHistory({
                id: this.owner.getRuntimeId(),
                options: {},
                title: "Hide Popup"
            });

            this.dropDown._cupdating = false;
            wm.onidle(this.dropDown, "showContents");
            return result;
        } finally {
            this.dropDown.reflow();
            this._openningDropDown = false;
        }
    }
});

dojo.require("wm.base.widget.Container");
dojo.declare("wm.TimePicker", wm.Container, {
    use24Time: false,
    border: "1",
    borderColor: "#333",
    height: "452px",
    width: "220px", // appears to be ignored; see this.dropDown.setWidth() call above
    padding: "0",
    margin: "0",
    classNames: "wmdialog MainContent",
    horizontalAlign: "left",
    verticalAlign: "top",
    dataValue: null,

    prepare: function(inProps) {
        inProps.owner = app;
        this.inherited(arguments);
    },

    setUse24Time: function(inVal) {
        this.use24Time = inVal;
        this.ampm.setShowing(!inVal);
        if (this.hours.showing) {
            var hours = [];
            for (var i = inVal ? 0 : 1; i <= (inVal ? 23 : 12); i++) hours.push({
                dataValue: i
            });
            this.hours.renderData(hours);
        }
    },

    hideContents: function() {
        this.mainPanel.setShowing(false);
    },
    showContents: function() {
        if (!this.mainPanel.showing) {
            this._cupdating = true;
            this.mainPanel.setShowing(true);
            this.hours.renderDojoObj();
            this.minutes.renderDojoObj();
            this._cupdating = false;
            this.reflow();
            this.renderBounds();
        }
    },

    postInit: function() {
        var onchange = dojo.hitch(this, "changed");
        this.mainPanel = new wm.Panel({
            owner: this,
            parent: this,
            showing: false,
            name: "mainDateTimePickerPanel",
            layoutKind: "left-to-right",
            horizontalAlign: "left",
            verticalAlign: "center",
            width: "100%",
            height: "100%"
        });
        wm.require("wm.List");
        this.hours = new wm.List({
            owner: this,
            parent: this.mainPanel,
            selectionMode: wm.isMobile ? "radio" : "single",
            name: "hours",
            columns: [{
                "show": true,
                "title": "Hour",
                "width": "100%",
                "align": "left",
                "field": "dataValue",
                mobileColumn: 1
            }],
            _pkList: ["dataValue"],
            height: "100%",
            padding: "2",
            width: "100%",
            minWidth: 100,
            border: "0,2,0,0",
            padding: "0",
            margin: "0",
            onSelect: onchange
        });
        this.hours.selectedItem.setType("NumberData");
        var hours = [];
        for (var i = 0; i < 12; i++) hours.push({
            dataValue: i
        });
        this.hours.renderData(hours);

        this.minutes = new wm.List({
            owner: this,
            parent: this.mainPanel,
            selectionMode: wm.isMobile ? "radio" : "single",
            name: "minutes",
            columns: [{
                "show": true,
                "title": "Minute",
                "width": "100%",
                "align": "left",
                "field": "dataValue",
                mobileColumn: 1
            }],
            _pkList: ["dataValue"],
            height: "100%",
            padding: "2",
            width: "100%",
            minWidth: 100,
            border: "0,2,0,0",
            padding: "0",
            margin: "0",
            onSelect: onchange
        });
        this.minutes.selectedItem.setType("NumberData");
        var minutes = [];
        for (var i = 0; i < 60; i += 5) minutes.push({
            dataValue: i
        });
        this.minutes.renderData(minutes);
        /*
    this.hours = new wm.ListSet({owner: this,
                     parent: this.panel,
                     showSearchBar:false,
                     _multiSelect:false,
                     _selectionMode: wm.isMobile ? "radio" : "",
                     name:"hours",
                     caption: "Hour", // Localize
                     captionAlign: "left",
                     captionPosition: "top",
                     captionSize: "22px",
                     changeOnKey: true,
                     displayValue: "",
                     height: "100%",
                     options: ["1","2","3","4","5","6","7","8","9","10","11","12"],
                     padding: "2",
                     width: "100%",
                     onchange: onchange});

    this.minutes = new wm.ListSet({owner: this,
                       showSearchBar:false,
                     _multiSelect:false,
                       _selectionMode: wm.isMobile ? "radio" : "",
                    parent: this.panel,
                    caption: "Minute", // Localize
                    name:"minutes",
                    captionAlign: "left",
                    captionPosition: "top",
                    captionSize: "22px",
                    changeOnKey: true,
                    displayValue: "",
                       displayField: "dataValue",
                       dataField: "dataValue",
                    height: "100%",
                    padding: "2",
                    width: "100%",
                    onchange: onchange});

    var minutes = [];
    for (var min = 0; min < 60; min+=5) minutes.push(String(min));
    this.minutes.setOptions(minutes);
                    */
        /*
    this.ampm = new wm.ToggleButton({owner: this,
                     parent: this.panel,
                     name: "ampm",
                     captionDown: "PM",
                     captionUp: "AM",
                     height: "21px",
                     width: "50px",
                     margin: "0,4,2,0",
                     onclick: onchange});
                     */
        this.ampm = new wm.ToggleButtonPanel({
            owner: this,
            parent: this.mainPanel,
            name: "ampm",
            height: "90px",
            desktopHeight: "90px",
            // optimal size for iphone in landscape mode
            width: "60px",
            layoutKind: "top-to-bottom",
            verticalAlign: "middle",
            margin: "0,7,0,3",
            onChange: onchange
        });
        this.amButton = new wm.Button({
            owner: this,
            parent: this.ampm,
            height: "100%",
            desktopHeight: "100%",
            caption: "AM",
            name: "amButton"
        });
        this.pmButton = new wm.Button({
            owner: this,
            parent: this.ampm,
            height: "100%",
            desktopHeight: "100%",
            caption: "PM",
            name: "pmButton"
        });
        this.buttonPanel = new wm.Panel({
            owner: this,
            parent: this,
            _classes: {
                domNode: ["dialogfooter"]
            },
            showing: wm.isMobile,
            name: "dateTimePickerButtonPanel",
            layoutKind: "left-to-right",
            horizontalAlign: "right",
            verticalAlign: "bottom",
            width: "100%",
            mobileHeight: "45px",
            desktopHeight: "32px"
        });



        this.okButton = new wm.Button({
            owner: this,
            parent: this.buttonPanel,
            name: "okButton",
            caption: "OK",
            width: "80px",
            height: "100%",
            onclick: dojo.hitch(this, "onOkClick")
        });
        this.cancelButton = new wm.Button({
            owner: this,
            parent: this.buttonPanel,
            name: "cancelButton",
            caption: "Cancel",
            width: "80px",
            height: "100%",
            onclick: dojo.hitch(this, "onCancelClick")
        });
        this.inherited(arguments);
        //this.reflow();
    },

    changed: function() {
        if (this._updating) return;
        var date = new Date(0);
        var hour = this.hours.selectedItem.getValue("dataValue");
        if (hour == 12 && !this.use24Time) hour = 0;
        var minute = this.minutes.selectedItem.getValue("dataValue");
        var isPM = this.pmButton.clicked;
        date.setHours(hour + ((isPM && !this.use24Time) ? 12 : 0), minute);

        this.dataValue = date;
        if (this._currentDijit) {
            var tp = this._currentDijit.constraints.timePattern;
            if(isPM && !this.use24Time){
                this._currentDijit.constraints.timePattern = "hh:mm a";
            }
            this._currentDijit.set("value", date);
            //this._currentDijit.constraints.timePattern = tp;
        }
    },
    set: function(inName, inValue) {
        // ignore these calls
    },
    destroyRecursive: function() {},
    // ignore this; don't let dojo decide when to destroy a popup shared across many widgets
    reflowParent: function() {
        this.reflow();
        this.renderBounds();
    },


    getContentBounds: function() {
        var b = this.inherited(arguments);
        b.l += this.borderExtents.l;
        b.t += this.borderExtents.t;
        return b;
    },
    setDataValue: function(inValue) {

        this._initialValue = inValue;
        var value;
        if (inValue instanceof Date) {
            value = inValue;
        } else if (!inValue) {
            value = "";
        } else {
            value = wm.convertValueToDate(inValue);
        }
        this.dataValue = value;

        if (value) {
            var time = dojo.date.locale.format(value, {
                selector: 'time',
                timePattern: this.use24Time ? 'HH:mm' : "hh:mm a"
            });
            if (this.use24Time) {
                var timematches = time.match(/^(\d\d)\:(\d\d)$/);
            } else {
                var timematches = time.match(/^(\d\d)\:(\d\d) (.*)$/);
            }
            //this.minutes.setDataValue(timematches[2].replace(/^0*/,""));
            var minute = Number(timematches[2].replace(/^0*/, ""));

            this.minutes.deselectAll();
            this.minutes.selectItemOnGrid({
                dataValue: minute
            }, ["dataValue"]);

            var hour;
            if (this.use24Time) {
                hour = Number(timematches[1]);

            } else {
                var isPM = timematches[3].toLowerCase() == "pm";
                //this.hours.setDataValue(timematches[1].replace(/^0*/,""));
                hour = Number(timematches[1].replace(/^0*/, ""));
                if (isPM) {
                    this.pmButton.onclick(this.pmButton);
                } else {
                    this.amButton.onclick(this.amButton);
                }

            }
            this.hours.deselectAll();
            this.hours.selectItemOnGrid({
                dataValue: hour
            }, ["dataValue"]);

        }
    },
    onOkClick: function() {
        this._currentDijit._opened = true;
        this._currentDijit.closeDropDown();
    },
    onCancelClick: function() {
        this._currentDijit._opened = true;
        this._currentDijit.closeDropDown();
        this._currentDijit.set("value", this._initialValue);
    },
    onChange: function(inValue) {
    }
});