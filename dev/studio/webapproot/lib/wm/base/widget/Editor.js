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
dojo.provide("wm.base.widget.Editor");

wm.editors = [ 
      "Text", "Date", "Time", "Number", "Currency", "Select", "CheckBox", "TextArea", "RadioButton", "Lookup", "Slider"
];

wm.getEditor = function(inName) {
	var c = inName || "Text";
	if (c.slice(0, 5) != "wm")
		c = "wm._" + c + "Editor";
	return dojo.getObject(c) || wm._BaseEditor;
}

wm.getDataSet = function(inWidget) {
	var w = inWidget;
	while (w && !w.dataSet)
		w = w.parent;
	if (w && w.dataSet)
		return w.dataSet;
}

wm.getEditorType = function(inPrimitive) {
	var t = wm.typeManager.getPrimitiveType(inPrimitive) || inPrimitive;
	var map = {
		Boolean: "CheckBox"
	};
	if (t in map)
		t = map[t];
	return dojo.indexOf(wm.editors, t) != -1 ? t : "Text";
};

wm.getFieldEditorProps = function(inFieldInfo) {
	var
		f = inFieldInfo,
		props = {
			caption: f.caption,
			display: wm.getEditorType(f.displayType || f.type),
			readonly: f.readonly,
			editorInitProps: {required: f.required},
			required: f.required
		};
	// fixup: ensure checkbox is boolean type
	if (props.display == "CheckBox") {
		props.editorInitProps.dataType = "boolean";
		props.displayValue = true;
		props.emptyValue = "false";
	} 
	return props;
};

wm.createFieldEditor = function(inParent, inFieldInfo, inProps, inEvents, inClass) {
	var props = dojo.mixin({}, wm.getFieldEditorProps(inFieldInfo), inProps);
	var name = wm.getValidJsName(props.name || "editor1");
	return inParent.owner.loadComponent(name, inParent, inClass ||"wm.Editor", props, inEvents);
};

wm.updateFieldEditorProps = function(inEditor, inFieldInfo) {
	var
		e = inEditor,
		props = wm.getFieldEditorProps(inFieldInfo),
		editor = props.editorInitProps;
	delete props.formField;
	delete props.editorInitProps;
	//
	for (var i in props)
		e.setProp(i, props[i]);
	for (var i in editor)
		e.editor.setProp(i, editor[i]);
}

dojo.declare("wm.Editor", wm.Container, {
	height: "24px",
	width: "150px",
	padding: 2,
	displayValue: "",
	saveDisplayValue: false,
	dataValue: null,
	horizontalAlign: "justified",
	verticalAlign: "justified",
	emptyValue: "unset",
	caption: "",
	lock: true,
	box: "h",
	captionSize: "50%",
	resizeToFit: "(Resize to Fit)",
	// bc
	captionUnits: "flex",
	captionAlign: "right",
	captionPosition: "left",
	singleLine: true,
	display: "Text",
	readonly: false,
	_updating: 0,
	editingProps: {displayValue: 1, dataValue: 1, groupValue: 1},
	init: function() {
		this.inherited(arguments);
		this.createCaption();
	},
	postInit: function() {
	    this.startTimer("Editor.postInit", this.declaredClass);
	    this.startTimer("Editor.super.postInit", this.declaredClass);
		this.inherited(arguments);
	    this.stopTimer("Editor.super.postInit", this.declaredClass);
	    this.startTimer("Editor.Misc.postInit", this.declaredClass);
		// BC: if captionSize contains only digits, append units
		if (String(this.captionSize).search(/\D/) == -1) {
			this.captionSize += this.captionUnits;
		}
		// BC: caption size convert to % (editor defaults to 100% now and was 10flex)
		var su = wm.splitUnits(this.captionSize)
		if (su.units == "flex") {
			this.captionSize = (su.value * 10) + "%";
		}
		if (!this.$.editor)
			this.setDisplay(this.display);
		else
			this.editor = this.$.editor;
		wm.fire(this.editor, "ownerLoaded"); // TODO: Replace this with call in SelectEditor.postInit
		if (this.captionPosition != "left")
		  this.setCaptionPosition(this.captionPosition);

	    this.stopTimer("Editor.Misc.postInit", this.declaredClass);
	    this.startTimer("editorChanged", this.declaredClass);
		// populate default value
		this.editorChanged();
	    this.stopTimer("editorChanged", this.declaredClass);
	    this.stopTimer("Editor.postInit", this.declaredClass);
	},

	setDomNode: function(inDomNode) {
		this.inherited(arguments);
		dojo.addClass(this.domNode, "wmeditor");
	},
	createCaption: function() {
		var cs = String(this.captionSize);
		var classNames = {domNode: ["wmeditor-caption"].concat(this._classes.captionNode)};
		this.captionLabel = new wm.Label({parent: this, width: cs, height: cs, _classes: classNames, singleLine: this.singleLine, caption: this.caption, showing: Boolean(this.caption), margin: "0,4,0,0", border: 0});
		this.setCaptionAlign(this.captionAlign);
	},
	getRequiredHtml: function() {
		var e = this.editor;
		if (!e)
			e = this.$.editor;
		return !this.readonly && e && e.required ? '&nbsp;<span class="wmeditor-required">*</span>' : "";
	},
	setDisplay: function(inDisplay) {
		this.display = inDisplay;
		var e = this.editor || this.$.editor;
		if (e) {
			e.destroy();
			this.editor = null;
		}
		this.createEditor();
		this.reflow();
	},
	createEditor: function() {
		var ctor = wm.getEditor(this.display);
		var props = dojo.mixin({name: "editor", owner: this, parent: this, border: 0, readonly: this.readonly }, this.editorInitProps || {});
		this.editor = new ctor(props);
		this._editor = this.editor.editor;
	},
	setDisplayValue: function(inValue) {
		this.displayValue = inValue;
		wm.fire(this.editor, "setDisplayValue", [inValue]);
	},
	getDisplayValue: function() {
		var v = this.getEditorIsReady() ? this.editor.getDisplayValue() : this.displayValue;
		// make sure displayValue is display friendly: undefined, null, false become ""
		return (v === null || v === undefined || v === false) ? "" : v;
	},
	getEditorIsReady: function() {
		return this.editor && this.editor.isReady();
	},
	getDataValue: function() {
		return this.getEditorIsReady() ? this.editor.getEditorValue() : this.dataValue;
	},
	_getReadonlyValue: function() {
		var v = this.editor && this.editor._getReadonlyValue();
		return v === undefined ? "" : v;
	},
	setDataValue: function(inValue) {
		// for simplicity, treat undefined as null
		if (inValue === undefined)
			inValue = null;
		this.dataValue = inValue instanceof wm.Variable ? inValue.getData() : inValue;
		wm.fire(this.editor, "setEditorValue", [inValue]);
	},
	setCaption: function(inCaption) {
		var c = this.caption;
		this.caption = inCaption;
		this.captionLabel.setCaption(this.caption + this.getRequiredHtml());
		this.captionLabel.setShowing(Boolean(this.caption));
		// rebox if caption should be hidden / shown
		if (Boolean(c) != Boolean(this.caption))
			this.renderControls();
	},
	setCaptionSize: function(inCaptionSize) {
		this.captionLabel[this.layoutKind == "top-to-bottom" ? "setHeight" : "setWidth"](this.captionSize = inCaptionSize);
		this.reflow();
	},
	setCaptionAlign: function(inCaptionAlign) {
		this.captionAlign = inCaptionAlign;
	        this.captionLabel.setAlign(this.captionAlign);
	},
	setCaptionPosition: function(inCaptionPosition) {
		var cp = this.captionPosition = inCaptionPosition;
		this.removeControl(this.captionLabel);
		this.insertControl(this.captionLabel, (cp == "top" || cp == "left") ? 0 : 1);
		this.setLayoutKind((cp == "top" || cp == "bottom") ? "top-to-bottom" : "left-to-right");
		this.setCaptionSize(this.captionSize);
	},
	setSingleLine: function(inSingleLine) {
		this.singleLine = inSingleLine;
		this.captionLabel.setSingleLine(inSingleLine);
	},
	setDisabled: function(inDisabled) {
		var d = this.disabled;
		this.inherited(arguments);
		if (d != this.disabled)
			this.updateDisabled();
	},
	updateDisabled: function() {
		dojo[this.disabled ? "addClass" : "removeClass"](this.captionLabel.domNode, "wmeditor-caption-disabled");
		wm.fire(this.editor, "setDisabled", [this.disabled]);
	},
	setReadonly: function(inReadonly) {
		var r = this.readonly;
		this.readonly = inReadonly;
		if (r != this.readonly)
			this.setCaption(this.caption);
		wm.fire(this.editor, "setReadonly", [inReadonly]);
	},
	setRequired: function(inRequired) {
		wm.fire(this.editor, "setRequired", [inRequired]);
	},
	requireChanged: function() {
		this.setCaption(this.caption);
	},
	getInvalid: function() {
		return wm.fire(this.editor, "getInvalid");
	},
	isValid: function() {
		return !this.getInvalid();
	},
	validate: function(inInvalid) {
		wm.fire(this.parent, "validate");
		this.valueChanged("invalid", this.getInvalid());
	},
	// editor specific getters / setters
	getGroupValue: function() {
		var e = this.editor;
		return wm.fire(e, "getGroupValue");
	},
	setGroupValue: function(inValue) {
		this.groupValue = inValue;
		var e = this.editor;
		wm.fire(e, "setGroupValue", [inValue]);
	},
	getCheckedValue: function() {
		return this.getDisplayValue();
	},
	setCheckedValue: function(inValue) {
		this.setDisplayValue(inValue);
	},
	// called when editor has changed.
	editorChanged: function() {
		this.valueChanged("displayValue", this.displayValue = this.getDisplayValue());
		this.valueChanged("dataValue", this.dataValue = this.getDataValue());
		wm.fire(this.editor, "ownerEditorChanged");
	},
	isUpdating: function() {
		return this._updating > 0;
	},
	beginEditUpdate: function(inProp) {
		this._updating++;
	},
	endEditUpdate: function(inProp) {
		this._updating--;
	},
	valueChanged: function(inProp, inValue) {
		if (this._updating)
			return;
		this.inherited(arguments);
	},
	setValueAsEmpty: function(){
		this.setDataValue(dojo.hitch(this.editor, 'makeEmptyValue')());
	},	
	clear: function() {
		this.dataValue = null;
		this.beginEditUpdate();
		wm.fire(this.editor, "clear");
		this.endEditUpdate();
		this.editorChanged();
	},
    // NOTE: This only fires for Select.js
	update: function() {
		return wm.fire(this.editor, "update");
	},
	canFocus: function() {
		return !this.readonly;
	},
	focus: function() {
		this.editor.focus();
	},
	// events
	doOnchange: function() {
		this.editorChanged();
		var e = this.editor;
		if (!this._loading && !this.isUpdating() && !this.readonly && e && !e.isLoading())
			this.onchange(this.getDisplayValue(), this.getDataValue());
	},
	doOnblur: function() {
		if (!this.disabled)
			this.onblur();
	},
	doOnfocus: function() {
		if (!this.disabled)
			this.onfocus();
	},
	onchange: function(inDisplayValue, inDataValue) {
	},
	onfocus: function() {
	},
	onblur: function() {
	}
});

// design only...
wm.Editor.description = "A general purpose editor.";

wm.Editor.extend({
    themeable: false,
    scrim: true,
	// adds ability to merge in editor properties intended to be presented in owner.
	// note: these editor properties must be serialized in the editor.
	listProperties: function() {
		var
			e = this.editor,
			props =  dojo.mixin({}, this.inherited(arguments), e ? e.listOwnerProperties() : {}),
			f = wm.getParentForm(this);
		props.formField.ignore = !Boolean(f);
		props.displayValue.readonly = this.formField && !this.saveDisplayValue;
		props.saveDisplayValue.ignore = !this.formField;
		return props;
	},
	afterPaletteDrop: function() {
		this.setCaption(this.name);
	},
	set_formField: function(inFieldName) {
		if (!inFieldName)
			delete this.formField;
		else
			this.formField = inFieldName;
		var f = wm.getParentForm(this);
		if (f) {
			var fieldInfo = f.addEditorToForm(this);
		}
	},
	resizeLabel: function(){
		var divObj = dojo.doc.createElement('span');
		divObj.style.padding = '5px';
		divObj.innerHTML = this.captionLabel.caption;
		document.body.appendChild(divObj);
		var coords = dojo.coords(divObj);
		var captionWidth = coords.w;
		divObj.parentNode.removeChild(divObj);
		this.setCaptionSize('50%');
		var width = captionWidth * 4;
		this.setWidth(width + 'px');
		// the line underneath updates panel's width property. Therefore only required for studio.
	        if (this.isDesignLoaded() && studio.designer.selected == this)
			setTimeout(dojo.hitch(studio.inspector, "reinspect"), 100); 		
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "formField":
				return new wm.propEdit.FormFieldSelect({component: this, name: inName, value: inValue});
			case "display":
				return makeSelectPropEdit(inName, inValue, wm.editors, inDefault);
			case "captionAlign":
				return makeSelectPropEdit(inName, inValue, ["left", "center", "right"], inDefault);
			case "captionSize":
				return new wm.propEdit.UnitValue({component: this, name: inName, value: inValue, options: this._sizeUnits});
			case "captionPosition":
				return makeSelectPropEdit(inName, inValue, ["top", "left", "bottom", "right"], inDefault);
			case "emptyValue":
				return makeSelectPropEdit(inName, inValue, ["unset", "null", "emptyString", "false", "zero"], inDefault);
			case "checkedValue":
				return this.editor.dataType == "boolean" ? makeCheckPropEdit(inName, inValue, inDefault) : this.inherited(arguments);
			case "resizeToFit":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "resizeToFit":
				return this.resizeLabel();
		}
		return this.inherited(arguments);
	},
	writeChildren: function(inNode, inIndent, inOptions) {
		var s = this.inherited(arguments);
		// write editor; it would not otherwise be streamed
		s.push(this.editor.write(inIndent, inOptions));
		return s;
	},
	addUserClass: function(inClass, inNodeName) {
		this.inherited(arguments);
		if (inNodeName == "captionNode")
			this.captionLabel.addUserClass(inClass, "domNode");
	},
	removeUserClass: function(inClass, inNodeName) {
		this.inherited(arguments);
		if (inNodeName == "captionNode")
			this.captionLabel.removeUserClass(inClass, "domNode");
	}
});


// editor types
wm.FormEditor = wm.Editor;

dojo.declare("wm.TextEditor", wm.Editor, {});

dojo.declare("wm.DateEditor", wm.Editor, {
	display: "Date"
});

dojo.declare("wm.TimeEditor", wm.Editor, {
	display: "Time"
});

dojo.declare("wm.NumberEditor", wm.Editor, {
	display: "Number"
});

dojo.declare("wm.CurrencyEditor", wm.Editor, {
	display: "Currency"
});

dojo.declare("wm.SelectEditor", wm.Editor, {
	display: "Select"
});

dojo.declare("wm.CheckBoxEditor", wm.Editor, {
	displayValue: 1,
	display: "CheckBox",
	getChecked: function() {
		return this.editor.getChecked();
	},
	setChecked: function(inChecked) {
		this.editor.setChecked(inChecked);
	}
});


dojo.declare("wm.TextAreaEditor", wm.Editor, {
	display: "TextArea"
});
wm.TextAreaEditor.extend({

});
dojo.declare("wm.RadioButtonEditor", wm.Editor, {
	displayValue: 1,
	display: "RadioButton"
});

dojo.declare("wm.LookupEditor", wm.Editor, {
	display: "Lookup"
});

dojo.declare("wm.SliderEditor", wm.Editor, {
	display: "Slider"
});


wm.Object.extendSchema(wm.Editor, {
	disabled: { bindTarget: true, type: "Boolean", group: "common", order: 40},
	formField: {ignore: 1, writeonly: 1, group: "common", order: 500},
	singleLine: { group: "display", order: 200 },
	box: { ignore: 1 },
	horizontalAlign: { ignore: 1 },
	verticalAlign: { ignore: 1 },
	layoutKind: {ignore: 1},
	fitToContent: {ignore: 1},
	scrollX: {ignore: 1},
	scrollY: {ignore: 1},
	lock: {ignore: 1},
	imageList: {ignore: 1},
	caption: { bindable: 1, group: "display", type: "String", order: 0, focus: 1},
	readonly: { bindable: 1, type: "Boolean", group: "display", order: 5},
	captionSize: { group: "display", order: 200 },
	captionUnits: { ignore: 1 },
	captionAlign: { group: "display", order: 210 },
	captionPosition: { group: "display", order: 220 },
	display: { group: "edit", order: 20 },
	editor: { ignore: 1, writeonly: 1, componentonly: 1, categoryParent: "Properties", categoryProps: {component: "editor"}},
	displayValue: { bindable: 1, group: "edit", order: 40, type: "any"},
	dataValue: { ignore: 1, bindable: 1, group: "edit", order: 45, simpleBindProp: true},
	emptyValue: { group: "edit", order: 50},
	invalid: { ignore: 1,  bindSource: 1, type: "boolean" },
	groupValue: { ignore: 1 },
	selectedItem: { ignore: 1},
	resizeToFit:{ group: "layout", order: 200 },
	captionStyles: {ignore: 1, categoryParent: "Styles", categoryProps: {content: "caption", nodeName: "captionNode", nodeClass: "wmeditor-caption"}}
});
