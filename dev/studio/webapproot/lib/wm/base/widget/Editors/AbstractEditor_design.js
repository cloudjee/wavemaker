/*
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Editors.AbstractEditor_design");
dojo.require("wm.base.widget.Editors.AbstractEditor");


wm.AbstractEditor.extend({
        themeableDemoProps: {height: "24px"},
    themeableSharedStyles: ["-Editor Borders", "Editor-Border-Color", "Editor-Hover-Border-Color", "Editor-Focused-Border-Color",  "Editor-Radius",
                            "-Editor Backgrounds", "Editor-Background-Color", "Editor-Hover-Background-Color", "Editor-Focus-Background-Color",
                            "-Editor Fonts", "Editor-Font-Color","Editor-Hover-Font-Color","Editor-Focus-Font-Color",
                            "-Editor Background Image", "Editor-Image","Editor-Image-Position","Editor-Image-Repeat"

                           ],
	addUserClass: function(inClass, inNodeName) {
		this.inherited(arguments);
		if (inNodeName == "captionNode")
		    dojo.addClass(this.captionNode, inClass);
	},
	removeUserClass: function(inClass, inNodeName) {
		this.inherited(arguments);
		if (inNodeName == "captionNode")
		    dojo.removeClass(this.captionNode, inClass);
	},
	afterPaletteDrop: function() {
	    this.setCaption(this.name);
	    var liveform = this.isAncestorInstanceOf(wm.LiveFormBase);
	    if (liveform) {
		this.setCaptionPosition(liveform.captionPosition);
		this.setCaptionAlign(liveform.captionAlign);
		this.setCaptionSize(liveform.captionSize);

		// don't set the height if the editor uses a custom height
		if (this.constructor.prototype.height == wm.AbstractEditor.prototype.height)
		    this.setHeight(liveform.editorHeight);

		if (this.constructor.prototype.width == wm.AbstractEditor.prototype.width)
		    this.setWidth(liveform.editorWidth);
		this.setReadonly(liveform.readonly);
	    }
	},
	// adds ability to merge in editor properties intended to be presented in owner.
	// note: these editor properties must be serialized in the editor.
	listProperties: function() {
	        var props = this.inherited(arguments);
		var f = wm.getParentForm(this);
		props.formField.ignoretmp = !Boolean(f);
		props.displayValue.readonly = this.formField;
	    props.defaultInsert.ignoretmp = !this.isAncestorInstanceOf(wm.LiveFormBase);
	    props.ignoreParentReadonly.ignoretmp = props.defaultInsert.ignoretmp;
		return props;
	},
	set_formField: function(inFieldName) {
		if (!inFieldName)
			delete this.formField;
		else
			this.formField = inFieldName;
		var f = wm.getParentForm(this);
		if (f) {
			var fieldInfo = f.addEditorToForm(this);
		    if (!this.caption) this.setCaption(inFieldName);
		}
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "formatter":
		                var funcName = this.generateEventName("onReadOnlyNodeFormat");
		                var customFunction = (this.formatter == funcName) ? funcName : "Custom Function";
		                return makeSelectPropEdit(inName, inValue, ["", customFunction].concat(wm.formatters), inDefault);
			case "formField":
				return new wm.propEdit.FormFieldSelect({component: this, name: inName, value: inValue});
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
	setFormatter: function(inDisplay) {
	    if (this.formatter == inDisplay)
		return;
	    this.formatter = inDisplay;
	    if (this.components.format)
		this.components.format.destroy();
	    var funcName = this.generateEventName("onReadOnlyNodeFormat");
	    if (this.formatter == "Custom Function" || this.formatter == funcName) {
		this.formatter = funcName;
		eventEdit(this, "onReadOnlyNodeFormat", funcName, this.owner == studio.application, "inValue");
	    } else {
		var ctor = wm.getFormatter(this.formatter);
		new ctor({name: "format", owner: this});
	    }
	}

});

wm.Object.extendSchema(wm.AbstractEditor, {
    imageList: {ignore: 1},
    formatter: { group: "format", order: 20 },
    format: { ignore: 1, writeonly: 1, categoryParent: "Properties", categoryProps: {component: "format"}},
    formField: {writeonly: 1, group: "common", order: 500},
    caption: {group: "Labeling", order: 1, bindTarget:true, doc: 1},
    captionPosition: {group: "Labeling", order: 2, doc: 1},
    captionAlign: {group: "Labeling", order: 3, doc: 1},
    captionSize: {group: "layout", order: 4, doc: 1},
    singleLine: {group: "Labeling", order: 5},
    helpText: {group: "Labeling", order: 10},
    readonly: {group: "editor", order: 1, doc: 1},
    ignoreParentReadonly: {group: "editor", order: 2, doc: 1},
    displayValue: {group: "editData", order: 2}, // use getDisplayValue()
    dataValue: {ignore: 1, bindable: 1, group: "editData", order: 3, simpleBindProp: true, type: "String"}, // use getDataValue()
    isDirty: {ignore: 1, bindable: 1, group: "editData", order: 10, type: "boolean"}, 
    emptyValue: {group: "editData", order: 4, doc: 1},
    required: {group: "validation", order: 1, doc: 1},
    editorBorder: {group: "style", order: 100},


    scrollX: {ignore:1},
    scrollY: {ignore:1},
    display: {ignore:1},
    changeOnEnter: {ignore: 1},
    changeOnKey: {ignore: 1},
    onEnterKeyPress: {ignore: 1},

    defaultInsert:{type: "String", bindTarget: 1, group: "editData", order: 10},
    setCaption: {group: "method", doc: 1},
    setCaptionSize: {group: "method", doc: 1},
    setCaptionAlign: {group: "method",doc: 1},
    setCaptionPosition:{group: "method", doc: 1},
    setDisabled: {group: "method", doc: 1},
    getInvalid: {group: "method", doc: 1, returns: "Boolean"},
    setReadonly: {group: "method", doc: 1},
    getDisplayValue: {group: "method",doc: 1, returns: "String"},
    getDataValue: {group: "method", doc: 1, returns: "Any"},
    setDisplayValue: {group: "method", doc: 1},
    setDataValue: {group: "method", doc: 1},

		   focus: {group: "method",doc: 1},
	    clear: {group: "method", doc: 1}
    
    
});
