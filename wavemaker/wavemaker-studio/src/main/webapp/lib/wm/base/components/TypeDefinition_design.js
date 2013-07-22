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
dojo.provide("wm.base.components.TypeDefinition_design");
dojo.require("wm.base.components.TypeDefinition");

wm.TypeDefinitionField.extend({
    set_fieldName: function(inFieldName) {
        this.fieldName = inFieldName;
        this._treeNodeName = inFieldName; // used by studio to show node in model tree
        if (!this._cupdating) {
            this.owner.doRemoveType();
            this.owner.doAddType();
        }
        if (!this._cupdating && studio.page) studio.refreshComponentTree();
    },
    set_fieldType: function(inType) {
        this.fieldType = inType || "String";
        if (!this._cupdating) {
            this.owner.doRemoveType();
            this.owner.doAddType();
        }
    },
    set_isObject: function(inIsObject) {
        this.isObject = inIsObject;
        if (!this._cupdating) {
            this.owner.doRemoveType();
            this.owner.doAddType();
        }
    },
    set_isList: function(inIsList) {
        this.isList = inIsList;
        if (!this._cupdating) {
            this.owner.doRemoveType();
            this.owner.doAddType();
        }
    },
    addField: function() {
	   this.owner.addField();
    }
});
wm.Object.extendSchema(wm.TypeDefinitionField, {
    name: {requiredGroup: 0, hidden: 1},
    owner: {ignore:1},
    fieldName: {group: "widgetName", subgroup: "fields", order: 1},
    fieldType: {group: "widgetName", subgroup: "fields", order: 2, editor: "wm.prop.DataTypeSelect", editorProps: {useLiterals:1}},
    isList:  {group: "widgetName", subgroup: "fields", order: 3},
    isObject:  {group: "widgetName", subgroup: "fields", order: 4},
    addField:  {group: "widgetName", subgroup: "fields", order: 5, operation: true},
    documentation: {ignore: true},
    generateDocumentation: {ignore: true}
});

wm.TypeDefinition.extend({
    getTypeDefinitionDialog: function() {
        if (!studio.TypeDefinitionGeneratorDialog) {
            studio.TypeDefinitionGeneratorDialog = new wm.PageDialog({
                owner: studio,
                _classes: {domNode: ["studiodialog"]},
                name: "TypeDefinitionGeneratorDialog",
                pageName: "TypeDefinitionGeneratorDialog",
                width: "600px",
                height: "500px",
                border: "2",
                borderColor: "white",
                modal: false,
                hideControls: true
            });
        }
        return studio.TypeDefinitionGeneratorDialog;
    },
    afterPaletteDrop: function() {
        this.inherited(arguments);
        this.setOwner(studio.application);
        this.getTypeDefinitionDialog();
        studio.TypeDefinitionGeneratorDialog.show();
        studio.TypeDefinitionGeneratorDialog.page.setTypeDefinition(this);

    },
    _isWriteableComponent: function(inName, inProperties) {return true;},
    set_name: function(inName) {
        this.doRemoveType();
        this.inherited(arguments);
        this.doAddType();
    },
    getCollection: function(inName) {
        this.fields = [];
        for (var i in this.$) {
            this.fields.push(this.$[i]);
        }
        return this.fields;
    },
    addField: function() {
        studio.componentModel.activate();
        this.fieldsAsTypes = null;
        var defName = this.getUniqueName("field1");
        var field = new wm.TypeDefinitionField({
            name: defName,
            fieldName: defName,
            _treeNodeName: defName,
            owner: this
        });

        this.fields = null; // force this to be recalculated
        this.doRemoveType(); // old type def is missing this field
        this.doAddType(); // now we update the type def
        if (this._isDesignLoaded) {
            studio.select(field);
        }

    },
    removeComponent: function(inComponent) {
        if (this._isDestroying) return;
        if (this.$[inComponent.name]) {
            this.inherited(arguments);
            if (!this.isDestroyed && !this._isDestroying || studio.application && studio.application._isDestroying) {
                delete this.fields;
                this.getCollection();
                this.doAddType();
            }
        }
    }
});

wm.Object.extendSchema(wm.TypeDefinition, {
    addField: {group: "operation", order: 1, operation:true, requiredGroup:1},
    internal: {ignore: true}, // only way to set something as internal is to hardcode it into widgets.js; should only be internal if in use by studio to define a type for use by studio but not by the user
    owner: {ignore: true}
});

