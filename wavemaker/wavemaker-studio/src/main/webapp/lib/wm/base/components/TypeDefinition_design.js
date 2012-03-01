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
	if (!this._cupdating && studio.page)
	    studio.refreshComponentTree();
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
    afterPaletteDrop: function() {
	this.inherited(arguments);
	this.setOwner(studio.application);
    },

    set_name: function(inName) {
        this.doRemoveType();
        this.inherited(arguments);
        this.doAddType();
    },
    getCollection: function(inName) {
        if (!this.fields) {
            this.fields = [];
            for (var i in this.$) {
                this.fields.push(this.$[i]);
            }
        }
        return this.fields;
    },
        addField: function() {
            this.fieldsAsTypes = null;
	    var	defName = this.getUniqueName("field1");
            var field = new wm.TypeDefinitionField({name: defName, owner: this});

            this.fields = null; // force this to be recalculated
	    if (this._isDesignLoaded && !this._cupdating && studio.page) {
		studio.refreshComponentTree();
		studio.select(field);
	    }
            this.doRemoveType(); // old type def is missing this field
            this.doAddType(); // now we update the type def
        },
    removeComponent: function(inComponent) {
	if (this.$[inComponent.name]) {
	    this.inherited(arguments);
	    if (!this._isDestroyed) {
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

