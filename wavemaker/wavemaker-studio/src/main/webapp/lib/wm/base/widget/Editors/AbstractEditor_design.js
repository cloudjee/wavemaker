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


wm.editors = [ 
    "Text", "Date", "Time", "DateTime", "Number", "Currency", "SelectMenu", "Checkbox", "TextArea", "RadioButton", "Lookup", "Slider"
];

wm.createFieldEditor = function(inParent, inFieldInfo, inProps, inEvents, inClass) {
	var props = dojo.mixin({}, wm.getFieldEditorProps(inFieldInfo), inProps);
	var name = wm.getValidJsName(props.name || "editor1");
	return inParent.owner.loadComponent(name, inParent, inClass ||"wm._TextEditor1", props, inEvents);
};

wm.getFieldEditorProps = function(inFieldInfo) {
	var
		f = inFieldInfo,
		props = {
		    caption: f.caption || wm.capitalize(f.name),
			display: wm.getEditorType(f.displayType || f.type),
			readonly: f.readonly,
			editorInitProps: {required: f.required},
      required: f.required,
			subType: f.subType //xxx
		};
	// fixup: ensure checkbox is boolean type
	if (props.display == "CheckBox") {
		props.editorInitProps.dataType = "boolean";
		props.displayValue = true;
		props.emptyValue = "false";
	} else if (props.display == "Date") {
	    props.dateMode = "Date";
	}
	return props;
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

/*
		// don't set the height if the editor uses a custom height
		if (this.constructor.prototype.height == wm.AbstractEditor.prototype.height)
		    this.setHeight(liveform.editorHeight);
		    */
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
	    props.defaultInsert.ignoretmp = wm.LiveFormBase && !this.isAncestorInstanceOf(wm.LiveFormBase) && wm.DataForm && !this.isAncestorInstanceOf(wm.DataForm);
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
	    this.updateReadonlyValue();
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
    },
    formatChanged: function() {
	this.updateReadonlyValue();
    }

});

wm.Object.extendSchema(wm.AbstractEditor, {

    
    /* DISPLAY GROUP */
    /* Text subgroup */
/*
    caption: {group: "display", subgroup: "text", order: 1, bindTarget:true, requiredGroup:1},
    captionPosition: {group: "display", subgroup: "text", order: 2, options: ["top", "left", "bottom", "right"]},
    captionAlign: {group: "display", subgroup: "text", order: 3, options: ["left", "center", "right"]},
    captionSize: {group: "display",subgroup: "text", order: 4, editor: "wm.prop.SizeEditor"},
    singleLine: {group: "display", subgroup: "text", order: 5},
    */
    caption: {group: "editor text", subgroup: "caption", order: 1, bindTarget:true, requiredGroup:1},
    captionPosition: {group: "editor text", subgroup: "caption", order: 2, options: ["top", "left", "bottom", "right"]},
    captionAlign: {group: "editor text", subgroup: "caption", order: 3, options: ["left", "center", "right"]},
    captionSize: {group: "editor text",subgroup: "caption", order: 4, editor: "wm.prop.SizeEditor"},
    singleLine: {group: "editor text", subgroup: "caption", order: 5},

    /* Text subgroup */
    setCaption: {method:1},
    setCaptionSize: {method:1},
    setCaptionAlign: {method:1},
    setCaptionPosition:{method:1},

    /* Format subgroup */
/*
    formatter: { group: "display", subgroup: "format", order: 20, shortname: "readonlyFormatter", advanced:1 },
    format:     {group: "display", subgroup: "format", order: 21, editor: "wm.prop.FormatterEditor", advanced:1}, // shows the properties made available by the formatter property
	*/
    formatter: { group: "editor text", subgroup: "format", order: 20, shortname: "readonlyFormatter", advanced:1 },
    format:     {group: "editor text", subgroup: "format", order: 21, editor: "wm.prop.FormatterEditor", advanced:1}, // shows the properties made available by the formatter property

    /* Help subgroup */
    //helpText: {group: "display", subgroup: "help", order: 10},
    helpText: {group: "editor text", subgroup: "help", order: 10},

    /* Layout subgroup */
    //minEditorWidth: {group: "display", subgroup: "layout", order: 500, ignoreHint: "minEditorWidth is only relevant for percent sized editors with captionPosition of left or right", advanced: 1},
    minEditorWidth: {group: "editor text", subgroup: "caption", order: 500, ignoreHint: "minEditorWidth is only relevant for percent sized editors with captionPosition of left or right", advanced: 1},

    /* END DISPLAY GROUP */

    /* EDITOR GROUP */
    /* Behavior subgroup */
    readonly: {group: "editor", subgroup: "behavior", order: 1, type: "boolean"},
    ignoreParentReadonly: {group: "editor", subgroup: "behavior", order: 2, ignoreHint: "ignoreParentReadonly is only relevant if the editor is in a form", advanced:1},
    editorType: {group: "editor", subgroup: "behavior", order: 501, options: ["Text", "LargeTextArea", "RichText", "Currency", "Number", "Slider"]},
    
    /* Validation subgroup */
    required: {group: "editor", subgroup: "validation", order: 1},    

    /* Value subgroup */
    formField: {group: "editor", subgroup: "dataSet", order: 20, editor: "wm.prop.FormFieldSelect", editorProps: {relatedFields: false}, ignoreHint: "formField is only available when the editor is in a form", requiredGroup: 1},
    defaultInsert:{type: "String", bindTarget: 1, group: "editor", subgroup: "value", order: 21, ignoreHint: "defaultInsert is only relevant if the editor is in a form"},
    displayValue: {group: "editor", subgroup: "value", bindSource: 1, order: 10}, // use getDisplayValue()
    dataValue: {bindable: 1, group: "editor", subgroup: "value", order: 11, simpleBindProp: true, type: "String"}, // use getDataValue()
    emptyValue: {group: "editor", subgroup: "value",  order: 12, options: ["unset", "null", "emptyString", "false", "zero"]},

    /* END EDITOR GROUP */

    /* EVENTS GROUP */
    changeOnEnter: {ignore: 1},
    changeOnKey: {ignore: 1, group: "events", order: 0},
    onchange: { group: "events", order: 1},
    onEnterKeyPress: {ignore: 1, group: "events", order: 2},
    onfocus: {group: "events", order:3, advanced:1},
    onblur: {group: "events", order:4, advanced:1},
    onHelpClick: {group: "events", order:4, advanced:1},

    /* STYLE GROUP */
    editorBorder: {group: "style", order: 1},


    /* BIND SOURCE ONLY */
    isDirty: {ignore: 1, bindSource: 1, group: "editData", order: 10, type: "boolean"}, 
    invalid: {ignore: 1, bindSource: true},


    /* IGNORE LIST */
    hint: {ignore:true},
    imageList: {ignore: 1},
    scrollX: {ignore:1},
    scrollY: {ignore:1},
    display: {ignore:1},


    /* METHODS */
    setDisabled: {method:1},
    getInvalid: {method:1, returns: "Boolean"},
    setReadonly: {method:1},
    getDisplayValue: {method:1, returns: "String"},
    getDataValue: {method:1, returns: "Any"},
    setDisplayValue: {method:1},
    setDataValue: {method:1},
    focus: {method:1},
    clear: {method:1}
    
    
});
