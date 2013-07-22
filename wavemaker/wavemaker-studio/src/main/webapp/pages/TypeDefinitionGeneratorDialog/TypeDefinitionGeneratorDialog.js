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
dojo.declare("TypeDefinitionGeneratorDialog", wm.Page, {
    i18n: true,
    start: function() {
        this.owner.owner.setTitle(this.getDictionaryItem("TITLE"));
        this.moreDefs = {};
    },
    setTypeDefinition: function(inTypeDef) {
        this.typeDef = inTypeDef;
        this.moreDefs = {};
    },
    /* optionalInText is used by other pages wanting to use this generator as a service */
    generateButtonClick: function(inSender, e, inSender2, optionalInText, optionalInName) {
        var text = optionalInText || this.jsonText.getDataValue();
        var obj = dojo.fromJson(text);
        wm.forEachProperty(this.typeDef.$, function(c) {
            c.destroy();
        });
        wm.forEach(this.moreDefs, function(def) {
            def.destroy();
        });
        this.moreDefs = {};
        var typeName = optionalInName || this.typeName.getDataValue();
        if (this.typeDef.name != typeName) {
            this.typeDef.setName(studio.application.getUniqueName(typeName));
        }
        this.parseObj(obj, this.typeDef);
        /*
      this.variable1.setType(this.typeDef.name);
      this.variable1.setData(obj);
      this.html1.setHtml("<pre>"+this.typeDef.write("") + "\nvariable1.getData() Generates:\n" +
                                 dojo.toJson(this.variable1.getData(),true) +"</pre>");
                 */
        studio.componentModel.activate();
        studio.refreshServiceTree("");
        this.typeDef._studioTreeNode.setOpen(true);
        wm.forEachProperty(this.moreDefs, function(typeDef) {
            typeDef._studioTreeNode.setOpen(true);
        });
        studio.select(this.typeDef);
        app.toastSuccess("Type generated");
    },
    closeButtonClick: function() {
        this.owner.owner.hide();
    },
    /*
    write: function(c, indent) {
        return indent +  c.name + ": [" + c.declaredClass + ",{" + this.writeProps(c) + "}, {}, {" + this.writeChildren(c.$, indent + "\t") + "}]";
    },
    writeProps: function(c) {
        if (c instanceof wm.TypeDefinitionField) {
            return "type: " + c.fieldType + ", isList: " + c.isList;
        } else {
            return "";
        }
    },
    writeChildren: function(children, indent) {
        var result = "";
        wm.forEachProperty(children, dojo.hitch(this, function(c) {

            result += "\n" + indent + this.write(c, "") + ",";}));
            if (!wm.isEmpty(children)) result += "\n";
        return result;
    },
    */
    parseObj: function(inObj, inTypeDef) {
      wm.forEachProperty(inObj, dojo.hitch(this,function(inValue, inKey) {
          var isList = dojo.isArray(inValue)
         var val = isList ? inValue[0] : inValue;
         var type;
         if (typeof val == "string") {
             type = isList ? "StringData" : "String";
         } else if (typeof val == "number") {
             type = isList ? "NumberData" : "Number";
         } else if (typeof val == "boolean") {
             type = isList ? "BooleanData" : "Boolean";
         } else if (val === null || val === undefined) {
             type = isList ? "StringData" : "String";
         } else if (typeof val == "object") {
             var typedef = new wm.TypeDefinition({owner: studio.application, name: inTypeDef.name + "_" + inKey});
             this.moreDefs[typedef.name] = typedef;
             var field = new wm.TypeDefinitionField({owner: inTypeDef, name: inKey, fieldName: inKey, fieldType: (inTypeDef == this.typeDef ? this.typeName.getDataValue() : inTypeDef.name) + "_" + inKey, isList: Boolean(isList)});
             this.parseObj(val, typedef);
         }
         if (type)
             new wm.TypeDefinitionField({owner: inTypeDef, name: inKey, fieldName: inKey, fieldType: type, isList: Boolean(isList)});
      }));
        inTypeDef.doAddType();
    },
  _end: 0
});