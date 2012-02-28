/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.provide('wm.base.lib.types');

wm.typeManager = {
	types: {},
	initialized: false,
	initTypes: function() {
	    if (wm.types && wm.types.types) {
		wm.typeManager.setTypes(wm.types.types);
	    } else {
		this.addDefaultTypes();
	    }
	},
	setTypes: function(inTypes) {
	    this.clearTypes();
	    if (inTypes) {
		dojo.mixin(this.types, inTypes);
	    }
	    this.addDefaultTypes();

	},
	clearTypes: function() {
		this._publicTypes = {};
		// clear all non-user types
		for (var i in this.types) {
			if (!this.types[i].userType)
				delete this.types[i];
		}
	},
        getPrimaryKey: function(inType) {
	    if (!inType || !inType.fields) return "";
	    for (var fieldName in inType.fields) {
		if (inType.fields[fieldName].include.length)
		    return fieldName;
	    }
	},
	getPrimitiveType: function(inTypeName) {
		return (this.types[inTypeName] || 0).primitiveType;
	},
	isStructuredType: function(inTypeName) {
		return this.types[inTypeName] && !this.getPrimitiveType(inTypeName);
	},
	getService: function(inTypeName) {
		var t = this.types[inTypeName];
		return (t && t.service);
	},
	getLiveService: function(inTypeName) {
		var t = this.types[inTypeName];
		return (t && t.liveService && t.service);
	},
	generatePublicTypes: function() {
		var types = {};
		for (var i in this.types)
			if (this.isPublicType(i))
				types[i] = this.types[i];
		return types;
	},
	getPublicTypes: function() {
		return wm.isEmpty(this._publicTypes) ?
			this._publicTypes = this.generatePublicTypes() : this._publicTypes;
	},
	getLiveServiceTypes: function() {
		var types = this.getPublicTypes(), liveServiceTypes = {};
		for (var i in types)
			if (this.getLiveService(i))
				liveServiceTypes[i] = types[i];
		return liveServiceTypes;
	},
	isPublicType: function(inTypeName) {
		var t = this.types[inTypeName];
		return (t && !t.internal && !t.primitiveType);
	},
	getTypeSchema: function(inTypeName) {
		return (this.types[inTypeName] || 0).fields;
	},
	getType: function(inTypeName) {
		return this.types[inTypeName];
	},
	isType: function(inTypeName) {
		return Boolean(this.getType(inTypeName));
	},
	getPropertyInfoFromSchema: function(inTypeSchema, inPropName) {
		var
			s = inTypeSchema,
			parts = dojo.isString(inPropName) ? inPropName.split(".") : inPropName,
			p = parts.shift(),
			f = s[p];
		if (!parts.length)
			return f;
		else {
			var
				t = (f || 0).type,
				ts = this.getTypeSchema(t);
			if (ts)
				return this.getPropertyInfoFromSchema(ts, parts);
		}
	},

	getFilteredPropNames: function(inTypeSchema, inFilterFunc) {
		var ts = [], u = [], t, hasFilter = dojo.isFunction(inFilterFunc);
		wm.forEach(inTypeSchema, function(o, i) {
			if (!hasFilter || inFilterFunc(o)) {
				var elem = {};
				elem.info = o;
				elem.name = i;
				ts.push(elem);
			}
		});

		ts.sort(function(a, b) {
			return (a.info.fieldOrder - b.info.fieldOrder);
		});
		for (i=0; (ti=ts[i]); i++) {
			u.push(ti.name);
		}

		return u;
	},
	getSimplePropNames: function(inTypeSchema) {
		return this.getFilteredPropNames(inTypeSchema, function(p) {
			return !wm.typeManager.isStructuredType((p || 0).type);
		});
	},
    getFieldList: function(inTypeSchema, inPath) {

	if (typeof inTypeSchema == "string")
	    inTypeSchema = this.getType(inTypeSchema).fields;

	var result = [];
	for (var i in inTypeSchema) {
	    if (wm.typeManager.isStructuredType(inTypeSchema[i].type)) {
		result = result.concat(this.getFieldList(inTypeSchema[i].type, i));
	    } else {
		result.push({dataIndex: (inPath ? inPath + "." : "") + i,
			     caption: wm.capitalize(i),
			     displayType: wm.capitalize(inTypeSchema[i].type)});
	    }
	}
	    return result;
	},

        getStructuredPropNames: function(inTypeSchema, includeIsList) {
		return this.getFilteredPropNames(inTypeSchema, function(p) {
			return wm.typeManager.isStructuredType((p || 0).type) || includeIsList && p.isList;
		});
	},
	getPropNames: function(inTypeSchema, inStructured) {
		var
			u = this.getSimplePropNames(inTypeSchema),
			s = inStructured ? this.getStructuredPropNames(inTypeSchema) : [];
		return u.concat(s);
	},
	// returns an array of each property part ordered in schema
	getPropertyOrder: function(inType, inPropName) {
		var
			o = [],
			parts = dojo.isString(inPropName) ? inPropName.split(".") : inPropName,
			p = parts.shift(),
			schema = this.getTypeSchema(inType),
			propertyArray = this.getPropNames(schema, true);
		var c, l = propertyArray.length;
		// find property in array
		for (var i=0, n; (n = propertyArray[i]); i++)
			if (p == n) {
				c = i;
				break;
			}
		o.push(c !== undefined ? c : l);
		var
			f = schema && schema[p],
			t = (f || 0).type;
		// if no properties to descend to, return array of indices
		if (!parts.length || !t)
			return o;
		// otherwise recurse
		else
			return o.concat(this.getPropertyOrder(t, parts));
	},
	hasStructuredType: function(inTypeName, inCondition) {
		var s = this.getTypeSchema(inTypeName), p, c = dojo.isFunction(inCondition) && inCondition;
		for (var i in s) {
			p = s[i];
			if (this.isStructuredType(p.type))
				if (c) {
					if (c(p))
						return true;
				} else
					return true;
		}
	},
	// these types can be added indepenedent of server types
	addType: function(inName, inTypeInfo) {
		if (!inTypeInfo || wm.isEmpty(inTypeInfo))
			return;
		inTypeInfo.userType = true;
		this.types[inName] = inTypeInfo;
		if (this.isPublicType(inName) && !wm.isEmpty(this._publicTypes))
			this._publicTypes[inName] = inTypeInfo;
	},
	removeType: function(inName) {
	    delete this._publicTypes[inName];
	},
	addDefaultTypes: function() {
	    if (!this.initialized) {
		this.initialized = true;
		var d = wm.defaultTypes || {};
		for (var i in d)
			this.addType(i, d[i]);
	    }
	},
	isPropInList: function(inTypeSchema, inPropName) {
		var
			s = inTypeSchema,
			parts = dojo.isString(inPropName) ? inPropName.split(".") : inPropName,
			p = parts.shift(),
			f = s[p];
		if (!f)
			return false;
		else if (f.isList)
			return true;
		else if (parts.length) {
			var
				t = (f || 0).type,
				ts = this.getTypeSchema(t);
			if (ts)
				return this.isPropInList(ts, parts);
		}
	},
    getDisplayField: function(inType) {
	    var typeDef = wm.typeManager.getType(inType);
	    if (!typeDef) return "";
	    var fields = typeDef.fields;
	    var stringFields = {};
	    var literalFields = {};
	    for (fieldName in fields) {
		var field = fields[fieldName];
		if (!field.exclude || field.exclude.length == 0) {
		    if (field.type == "java.lang.String" || field.type == "StringData") {
			stringFields[fieldName] = field;
		    } else if (!wm.typeManager.isStructuredType(field.type)) {
			literalFields[fieldName] = field;
		    }
		}
	    }
	    
	    for (var fieldName in stringFields) {
		var lowestFieldOrder = 100000;
		var lowestFieldName;
		if (!dojo.isFunction(stringFields[fieldName])) { // ace damned changes to object prototype
		    if (stringFields[fieldName].fieldOrder === undefined && !lowestFieldName) {
			lowestFieldName = fieldName;
		    }
		    else if (stringFields[fieldName].fieldOrder !== undefined && 
			stringFields[fieldName].fieldOrder < lowestFieldOrder) 
		    {
			lowestFieldOrder = stringFields[fieldName].fieldOrder;
			lowestFieldName = fieldName;
		    }
		}
	    }
	    if (lowestFieldName) {
		return lowestFieldName;
	    }


	    for (var fieldName in literalFields) {
		var lowestFieldOrder = 100000;
		var lowestFieldName;
		if (!dojo.isFunction(literalFields[fieldName])) { // ace damned changes to object prototype
		    if (literalFields[fieldName].fieldOrder === undefined && !lowestFieldName) {
			lowestFieldName = fieldName;
		    }
		    else if (literalFields[fieldName].fieldOrder !== undefined &&
			     literalFields[fieldName].fieldOrder < lowestFieldOrder) {
			lowestFieldOrder = literalFields[fieldName].fieldOrder;
			lowestFieldName = fieldName;
		    }
		}
	    }
	    if (lowestFieldName) {
		return lowestFieldName;
	    }
	    for (fieldName in fields) {
		return fieldName;
	    }
    }
        
};

wm.defaultTypes = {
	NumberData: {
		fields: {
			dataValue: {type: "Number"}
		}
	},
	BooleanData: {
		fields: {
			dataValue: {type: "Boolean"}
		}
	},
	StringData: {
		fields: {
			dataValue: {type: "String"}
		}
	},
	DateData: {
		fields: {
			dataValue: {type: "Date"}
		}
	},
	EntryData: {
		fields: {
			name: {type: "string"},
			dataValue: {type: "any"}
		}
	},
	AnyData: {
		fields: {
			dataValue: {type: "any"}
		}
	}
};
/*AnyData: {value: {type: "Any", isList: false, isObject: false}},
StringData: {stringValue: {type: "String", isList: false, isObject: false}},
NumericData: {numericValue: {type: "Number", isList: false, isObject: false}},
ListData: {listValue: {type: "Any", isList: true, isObject: false}}
*/
//wm.types = {};
//wm.primitives = {};

wm.isListType = function(inTypeName) {
	return inTypeName && inTypeName.charAt(0) == "[";
}

// use forceList to optionally force friendly type to show list.
wm.getFriendlyTypeName = function(inType, inForceList) {
	inType = inType || "(any)";
	var
		s = wm.typeManager.getService(inType),
		isList = wm.isListType(inType),
		t = s ? [s, inType.split(".").pop()].join('.') : inType;
	if (isList)
		t = t.slice(0,-1);
	if (inForceList || isList)
		t = t + " list";
	return t;
}

wm.getPrimitiveDisplayType = function(inPrimitiveName) {
	var t = wm.typeManager.getPrimitiveType(inPrimitiveName);
	if (t == "Boolean")
		t = "CheckBox";
	if (!t || t == "String")
		t = "Text";
	return t;
}

wm.getDisplayType = function(propInfo) { //xxx
	var t;
	var subType = propInfo.fieldSubType;
	if (subType != undefined && subType != null && subType.length > 0) {
		if (subType == "picklist")
			t = "Select";
		else if (subType == "textarea")
			t = "LargeTextArea";
		else if (subType == "boolean")
			t = "CheckBox";
		else if (subType == "date")
			t = "Date";
		else if (subType == "datetime")
			t = "Time";
		else if (subType == "currency")
			t = "Currency";
		else
			t = "Text";
	} else {
		t = wm.getPrimitiveDisplayType(propInfo.type);
	}

	return t;
}