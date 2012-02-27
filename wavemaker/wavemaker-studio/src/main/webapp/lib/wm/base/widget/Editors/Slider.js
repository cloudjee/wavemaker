dojo.provide("wm.base.widget.Editors.Slider");
dojo.require("wm.base.widget.Editors.Number");

dojo.require("dijit.form.VerticalSlider");
dojo.require("dijit.form.HorizontalSlider");


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
        integerValues: true,
        dynamicSlider: false,
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
		    dynamicSlider: this.dynamicSlider,
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
	},
    getEditorValue: function() {
	var value = this.inherited(arguments);
	if (this.integerValues)
	    return Math.round(value);
	else
	    return value;
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
