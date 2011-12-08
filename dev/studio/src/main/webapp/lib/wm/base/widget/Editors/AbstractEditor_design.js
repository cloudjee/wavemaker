/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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
	    var liveform = this.isAncestorInstanceOf(wm.LiveFormBase) || this.isAncestorInstanceOf(wm.FormPanel);
	    if (liveform) {
		this.setCaptionPosition(liveform.captionPosition);
		this.setCaptionAlign(liveform.captionAlign);
		this.setCaptionSize(liveform.captionSize);
		if (this.height == wm.AbstractEditor.prototype.height)
		    this.setHeight(liveform.editorHeight);
		if (this.width == wm.AbstractEditor.prototype.width)
		    this.setWidth(liveform.editorWidth);

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
	    var hasForm = this.getParentForm() || this.formField;
	    
	    props.formField.ignoretmp = !Boolean(hasForm);
	    props.displayValue.readonly = this.formField;
	    props.defaultInsert.ignoretmp = !this.isAncestorInstanceOf(wm.LiveFormBase) && !this.isAncestorInstanceOf(wm.DataForm);
	    props.ignoreParentReadonly.ignoretmp = props.defaultInsert.ignoretmp;
	    props.minEditorWidth.ignoretmp = this.captionPosition == "top" || this.captionPosition == "bottom" || this.captionSize.match(/px/);
		return props;
	},
    set_minEditorWidth: function(inWidth) {
	this.minEditorWidth = inWidth;
	this.sizeEditor();
    },
	set_formField: function(inFieldName) {
		if (!inFieldName)
			delete this.formField;
		else
			this.formField = inFieldName;
		var f = this.getParentForm();
		if (f) {
		    var fieldInfo = f.addEditorToForm(this);
		    if (inFieldName) {
			this.setCaption(wm.capitalize(inFieldName));
		    }
		}
	},
        makePropEdit: function(inName, inValue, inEditorProps) {
	    switch (inName) {
	    case "formatter":
		var funcName = this.generateEventName("onReadOnlyNodeFormat");
		var customFunction = (this.formatter == funcName) ? funcName : "Custom Function";
		dojo.mixin(inEditorProps, {options: ["", customFunction].concat(wm.formatters),
					   restrictValues: false, /* Needed to allow changing between Custom Function and funcName */
					   dataField: "dataValue",
					   displayField: "dataValue"});
		return wm.SelectMenu(inEditorProps);
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
	},
    set_editorType: function(inType) {
        var widgetsjs = this.write("");
	widgetsjs = dojo.fromJson(widgetsjs.replace(/^.*?\:/,""));
	widgetsjs[1].captionPosition = this.captionPosition; // default values aren't written by write, but ugly stuff happens if this isn't copied around
	inType = "wm." + inType;
	var oldType = this.declaredClass;
	if (dojo.getObject(oldType).prototype.height != dojo.getObject(inType).prototype.height) {
	    widgetsjs[1].height = dojo.getObject(inType).prototype.height;
	}
	var name = this.name;	
        var parent = this.parent;
	var owner = this.owner;
        var indexInParent = dojo.indexOf(this.parent.c$, this);
        this.destroy();
	
        var clone = parent.createComponent(name, inType , widgetsjs[1], widgetsjs[2], widgetsjs[3], owner);
        parent.moveControl(clone, indexInParent);
        parent.reflow();
	studio.refreshVisualTree();
	studio.select(clone);
    },
    get_editorType: function() {
	return this.declaredClass.replace(/wm\./,"");
    }

});

wm.Object.extendSchema(wm.AbstractEditor, {
    hint: {ignore:true},
    imageList: {ignore: 1},
    formatter: { group: "format", order: 20, shortname: "readonlyFormatter" },
    format: { writeonly: 1, categoryParent: "Properties", categoryProps: {component: "format"}},
    formField: {group: "common", order: 500, editor: "wm.prop.FormFieldSelect", editorProps: {relatedFields: false}, ignoreHint: "This property is only available when the editor is in a Form"},
    editorType: {group: "common", order: 501, options: ["Text", "LargeTextArea", "RichText", "Currency", "Number", "Slider"]},
    caption: {group: "Labeling", order: 1, bindTarget:true, doc: 1},
    captionPosition: {group: "Labeling", order: 2, doc: 1, options: ["top", "left", "bottom", "right"]},
    captionAlign: {group: "Labeling", order: 3, doc: 1, options: ["left", "center", "right"]},
    captionSize: {group: "layout", order: 4, doc: 1, editor: "wm.prop.SizeEditor"},
    minEditorWidth: {group: "layout", order: 5, doc: 1, ignoreHint: "This property is only relevant for percent sized editors with captionPosition of left or right"},
    singleLine: {group: "Labeling", order: 5},
    helpText: {group: "Labeling", order: 10},
    invalid: {ignore: 1, bindSource: true},
    readonly: {group: "editor", order: 1, doc: 1, type: "boolean"},
    ignoreParentReadonly: {group: "editor", order: 2, doc: 1, ignoreHint: "This property is only relevant if the editor is in a form"},
    displayValue: {group: "editData", order: 2}, // use getDisplayValue()
    dataValue: {bindable: 1, group: "editData", order: 3, simpleBindProp: true, type: "String"}, // use getDataValue()
    isDirty: {ignore: 1, bindSource: 1, group: "editData", order: 10, type: "boolean"}, 
    emptyValue: {group: "editData", order: 4, doc: 1, options: ["unset", "null", "emptyString", "false", "zero"]},
    required: {group: "validation", order: 1, doc: 1},
    editorBorder: {group: "style", order: 100},


    scrollX: {ignore:1},
    scrollY: {ignore:1},
    display: {ignore:1},
    changeOnEnter: {ignore: 1},
    changeOnKey: {ignore: 1},
    onEnterKeyPress: {ignore: 1},

    defaultInsert:{type: "String", bindTarget: 1, group: "editData", order: 10, ignoreHint: "This property is only relevant if the editor is in a form"},
    setCaption: {method:1, doc: 1},
    setCaptionSize: {method:1, doc: 1},
    setCaptionAlign: {method:1,doc: 1},
    setCaptionPosition:{method:1, doc: 1},
    setDisabled: {method:1, doc: 1},
    getInvalid: {method:1, doc: 1, returns: "Boolean"},
    setReadonly: {method:1, doc: 1},
    getDisplayValue: {method:1,doc: 1, returns: "String"},
    getDataValue: {method:1, doc: 1, returns: "Any"},
    setDisplayValue: {method:1, doc: 1},
    setDataValue: {method:1, doc: 1},

		   focus: {method:1,doc: 1},
    clear: {method:1, doc: 1}
    
    
});
