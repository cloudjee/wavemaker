/*
 *  Copyright (C) 2010 WaveMaker Software, Inc.
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
dojo.provide("wm.base.components.TypeDefinition");
dojo.require("wm.base.Component");

dojo.declare("wm.TypeDefinitionField", wm.Component, {
    type: "StringData",
    isObject: false,
    isList: false,
    fieldName: "",
    toTypeObj: function() {
        return {type: this.type, isObject: this.isObject, isList: this.isList};
    }

});

dojo.declare("wm.TypeDefinition", wm.Component, {
    
    fields: null,
    // not init; must wait for page loader to load all subcomponents (typedefinitionfields) which postInit waits for
    postInit: function() {
        this.fields = [];
        this.fieldsAsTypes = {};
        for (var i in this.$) {
            this.fields.push(this.$[i]);
            this.fieldsAsTypes[this.$[i].fieldName] = this.$[i].toTypeObj();
        }
        wm.typeManager.addType(this.name, {internal: true, fields: this.fieldsAsTypes});        
    }

});