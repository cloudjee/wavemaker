/*
 *  Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.components.TypeDefinition");
dojo.require("wm.base.Component");

dojo.declare("wm.TypeDefinitionField", wm.Component, {
    fieldType: "String", // options are "string/String", "Date", "Boolean", "any", "Number", as well as any more complex types.  Note that String/Number are not the same as StringType and NumberType; they are literals not objects.
    isObject: false, // boolean
    isList: false, // boolean 
    fieldName: "",

    toTypeObj: function() {
        return {type: this.fieldType, isObject: this.isObject, isList: this.isList};
    }
});

dojo.declare("wm.TypeDefinition", wm.Component, {
    internal: false,
    collection: "Fields",
    fields: null,
    // not init; must wait for page loader to load all subcomponents (typedefinitionfields) which postInit waits for
    postInit: function() {
	delete this.fields;
        this.doAddType();
    },
    doRemoveType: function() {
	if (!this.internal)
            wm.typeManager.removeType(this.name);
	if (this._isDesignLoaded)
	    studio.typesChanged();
    },
    doAddType: function() {
        this.fieldsAsTypes = {};
        for (var i in this.$) {
            this.fieldsAsTypes[this.$[i].fieldName] = this.$[i].toTypeObj();
        }
        wm.typeManager.addType(this.name, {internal: this.internal, fields: this.fieldsAsTypes});        
        //dojo.publish("TypeChange-" + this.name);
	if (this._isDesignLoaded) {
	    studio.typesChanged();
	    studio.refreshComponentTree();
	}
    }
});

