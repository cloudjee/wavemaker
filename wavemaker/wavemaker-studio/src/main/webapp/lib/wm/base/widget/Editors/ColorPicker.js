dojo.provide("wm.base.widget.Editors.ColorPicker");
dojo.require("wm.base.widget.Editors.Text");
dojo.require("wm.base.widget.Dialogs.ColorPickerDialog");

dojo.declare("wm.ColorPicker", wm.Text, {
    className: "wmeditor wmcolorpickereditor",
    _editorBackgroundColor: true,
    defaultColor: "",
    colorPickerDialog: null,
    cancelValue: null,
    _empty: true,
    regExp: "\#[0-9a-fA-F]{6}",
    showMessages: false, // seems to mess up our color picker dialog when both are showing
    init: function() {
        this.inherited(arguments);
        this.subscribe("wm.AbstractEditor-focused", this, function(inEditor) {
            if (this != inEditor && (!this.colorPickerDialog || this.colorPickerDialog.text != inEditor)) {
                if (this.colorPickerDialog)
                    this.colorPickerDialog.dismiss();
            }
        });
    },
    postInit: function() {
        this.inherited(arguments);
        var v = this.getDataValue() || this.defaultColor;
        this.setNodeColors(v);
    },
    createColorPicker: function() {
	wm.getComponentStructure("wm.ColorPickerDialog");
        this.colorPickerDialog = new wm.ColorPickerDialog({owner: this});
        this.colorPickerDialog.connect(this.colorPickerDialog, "onChange", this, function(inValue) {
	    if (this.colorPickerDialog.showing)
		this.setDataValue(inValue);
        });
        this.colorPickerDialog.connect(this.colorPickerDialog, "onCancel", this, function(inValue) {
            var val = this.getDataValue();
            if (val != this.cancelValue) {
                this.setDataValue(this.cancelValue);
                this.changed();
            }
            this.colorPickerDialog.dismiss();
        });
    },
    onfocus: function() {
        if (!this.colorPickerDialog || !this.colorPickerDialog.showing) {
            var v = this.getDataValue();
	    if (v === "inherit" || !v) {
		v = this.defaultColor;
	    }

            this.cancelValue = this.getDataValue();
            if (!this.colorPickerDialog)
                this.createColorPicker();
            this.colorPickerDialog.setValue(v);
            this.colorPickerDialog.setShowing(true);
        }
    },
    setEditorValue: function(inValue) {
        this.inherited(arguments);
	this._empty = !Boolean(inValue);
        this.setNodeColors(inValue);
    },
    setNodeColors: function(inValue) {
        if (inValue) {
            this.editorNode.style.backgroundColor = inValue;
            this.editorNode.style.color = (parseInt(inValue.substr(1,2),16) + parseInt(inValue.substr(3,2),16) + parseInt(inValue.substr(5,2),16) < 200) ? "white" : "black";
        } else {
            this.editorNode.style.backgroundColor = "transparent";
            this.editorNode.style.color = "black";
        }
    },
    getDataValue: function() {
        if (this.getInvalid())
            return this.defaultColor;
	return this.inherited(arguments) || this.defaultColor;
    },
    onblur: function() {
        if (this.colorPickerDialog && this.getDataValue() && (this._empty || this.colorPickerDialog.getValue().toLowerCase() != this.getDataValue().toLowerCase() && this.colorPickerDialog._changed)) {
	    this._empty = false;
            this.changed();
        }
    },
    changed: function() {
        if (this.colorPickerDialog) {
            this.setNodeColors(this.getDataValue());
            return this.inherited(arguments);
        }
    }

});

