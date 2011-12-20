/*
 * Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
 
dojo.provide("wm.studio.app.propertyEdit");

dojo.declare("wm.SetPropTask", null, {
	constructor: function(inComponent, inPropName, inOldValue, inNewValue) {
		dojo.mixin(this, { component: inComponent, propName: inPropName, oldValue: inOldValue, newValue: inNewValue});
		this.hint = 'change "' + inPropName + '"';
		this.redo();
	},
	_do: function(inValue) {
		this.component.setProp(this.propName, inValue);
		//projectMgr.setDirtyComponents(true);
		wm.onidle(studio.inspector, "reinspect");
	},
	redo: function() {
		this._do(this.newValue);
		wm.undo.push(this);
	},
	undo: function() {
	    this._do(this.oldValue instanceof wm.Component ? this.oldValue.getId() : this.oldValue);
	}
});

dojo.declare("wm.propEdit.Base", null, {
	constructor: function(inProps) {
		dojo.mixin(this, inProps);
		if (!("value" in inProps))
			this.value = this._getPropValue();
		if (!("defaultValue" in inProps))
			this.defaultValue = this._getPropDefaultValue();
	},
        applyProp: function(propName, value) {
	    this._setPropValue(value);
	},
        setPropEdit: function(propName, value) {
	    var editor = dijit.byId("studio_propinspect_" + propName);
	    editor.set("value", value, false);
	    editor._lastValueReported = value;
	},
	_getPropValue: function() {
		var v = this.component.getProp(this.name);
		return dojo.isFunction(v) ? ["(", this.name, ")"].join('') : v;
	},
	_getPropDefaultValue: function() {
		return this.component.constructor.prototype[this.name];
	},
	_setPropValue: function(inValue) {
	    if (this.createWire) {
		if (!inValue) {
		    this.component.$.binding.removeWire(this.name);
		} else if (inValue && typeof inValue == "string") {
		    this.component.$.binding.addWire("", this.name, inValue);
		}
	    } else {
		new wm.SetPropTask(this.component, this.name, this.value, inValue);
	    }
	}
});

dojo.declare("wm.propEdit.Select", wm.propEdit.Base, {
	constructor: function(inProps) {
		this.init();
	},
	init: function() {
		this.options = this.getOptions();
		this.values =  this.getValues() || this.options;
	},
        applyProp: function(propName, value) {
	    for (var i = 0; i < this.options.length; i++) {
		if (value == this.options[i]) {
		    this._setPropValue(this.values[i]);
		    break;
		}
	    }
	},
	getValues: function() {
	    return this.values;
	},
	getOptions: function() {
	    return this.options;
	},
	getHtml: function() {
		return makeSelectPropEdit(this.name, this.value, this.options, this.defaultValue, this.values);
	},
        setPropEdit: function(propName, value) {
	    /* Update the html */
	    this.options = this.getOptions(); 
	    this.values = this.getValues();
	    var html = this.getHtml();

	    /* Filter out garbage from the new html */
	    html = html.replace(/selected="selected"/,"");
	    html = html.replace(/^.*?\<option/,"<option");
	    html = html.replace(/\<\/select.*/,"");


	    /* Update the store with the new HTML */
	    var editor = dijit.byId("studio_propinspect_" + propName);
	    var store = editor.store.root;
	    while (store.firstChild) store.removeChild(store.firstChild);
	    store.innerHTML = html;

	    /* Update the editor value */
	    editor.set("value", value, false);
	    editor._lastValueReported = value;
	}
});

dojo.declare("wm.propEdit.UnitValue", wm.propEdit.Select, {
	lexer: /([\d]+)(.*)/,
	init: function() {
		this.values = this.values || this.options;
	},
	lex: function(inValue) {
		var parts = (inValue || "").match(this.lexer);
		return { value: parts && parts[1] || 0, units: parts && parts[2]};
	},
	getHtml: function() {
		var value = wm.splitUnits(this.value);
		var defaultValue = wm.splitUnits(this.defaultValue);
		var html = [
			'<table class="wminspector-property" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border: 0 none;">',
		    makeInputPropEdit(this.name + "_1", value.value, defaultValue.value),
			'</td><td style="width: 1px; border-left: 1px solid gray">&nbsp;</td><td width="44">',
		    makeSelectPropEdit(this.name + "_2", value.units, this.options, ""/*defaultValue.units*/, this.values),
			'</td></tr>',
			//'<tr><td>Hello more lines!</td></tr>',
			'</table>'
		];
		return html.join('');
	},
        applyProp: function(propName, value) {
	    var value = dijit.byId("studio_propinspect_" + propName + "_1").get("value");
	    var select = dijit.byId("studio_propinspect_" + propName + "_2").get("value");
	    var su = this.lex(value);
	    this.inspector._setInspectedProp(this.name, su.value + (su.units || select));
	},
        setPropEdit: function(propName, value) {
	    dijit.byId("studio_propinspect_" + propName + "_1").set("value", parseInt(value), false);
	    var matches = value.match(/%|px/);
	    dijit.byId("studio_propinspect_" + propName + "_2").set("value", matches && matches.length ? matches[0] : "px", false);
	}
});

dojo.declare("wm.propEdit.PagesSelect", wm.propEdit.Select, {
	getOptions: function() {
	    var pagelist = wm.getPageList(this.currentPageOK);
            if (this.newPage)
	        pagelist.push(studio.getDictionaryItem("wm.PageContainer.NEW_PAGE_OPTION"));
	    return pagelist;
	}
});

wm.getPageList = function(currentPageOK){
	    var pages = [""].concat(studio.project.getPageList()), current = studio.page.declaredClass;
	    if (!currentPageOK)
			return dojo.filter(pages, function(p) {
				return (p != current);
			});
	    else
			return pages;
}

dojo.declare("wm.propEdit.ImageListSelect", wm.propEdit.Select, {
	getOptions: function() {
	    return [""].concat(studio.getImageLists());
	}
});

dojo.declare("wm.propEdit.WidgetsSelect", wm.propEdit.Select, {
	setWidgetType: function(inWidgetType) {
		this.widgetType = inWidgetType;
	},
	getOptions: function() {
	    var options = [];
/*
		var layers = wm.listOfWidgetType(this.widgetType, true), options = [];
		for (var i=0, l; l = layers[i]; i++) { 
			options.push(l.name);
		}
		*/
	    var components = wm.listComponents([studio.page, studio.application], this.widgetType);
		for (var i=0, l; l = components[i]; i++) { 
		    options.push(l.getId());
		}
		return [""].concat(options);
	}
});

dojo.declare("wm.propEdit.FieldSelect", wm.propEdit.Select, {
	getSchemaOptions: function(inSchema) {
		return [""].concat(wm.typeManager[this.relatedFields ? "getStructuredPropNames" : "getSimplePropNames"](inSchema));
	},
	getOptions: function() {
		return this.getSchemaOptions(wm.typeManager.getTypeSchema(this.fromType));
	}
});

dojo.declare("wm.propEdit.FormFieldSelect", wm.propEdit.FieldSelect, {
	getOptions: function() {
	    var f = wm.getParentForm(this.component);
	    var ds = f && f.dataSet;
	    if (ds) {
	    return ds && ds.type ? this.component.getSchemaOptions && this.component.getSchemaOptions(ds._dataSchema) || this.getSchemaOptions(ds._dataSchema) : [""];
	    } else if (f && f.type) {
		var type = wm.typeManager.getType(f.type);
		return type ? this.getSchemaOptions(type.fields) : [""];
	    } else {
		return [];
	    }
	}
});

dojo.declare("wm.propEdit.DataFieldSelect", wm.propEdit.Select, {
	getOptions: function() {
		var ds = this.dataSource, r = [""];
		return ds && ds.type ? this.getSchemaOptions(ds._dataSchema) : [""];
	}
});

dojo.declare("wm.propEdit.DataTypesSelect", wm.propEdit.Select, {
	options: [""],
	values: [""],
	init: function() {
		this.inherited(arguments);		
	},
    getOptions: function() {
	this.options = [""];
	this.addOptionValues(this.getDataTypes(), true);
	return this.options;
    },
	addOptionValues: function(inOptionValues, inSort) {
	        this.sort = inSort;
		if (inSort)
			inOptionValues.sort(function(a, b) { return wm.data.compare(a.option, b.option); });
		this.options = (this.options || []).concat(dojo.map(inOptionValues, function(d) { return d.option; }));
		this.values = (this.values || []).concat(dojo.map(inOptionValues, function(d) { return d.value; }));
	},
	getDataTypes: function() {
		var
			types = this.liveTypes ? wm.typeManager.getLiveServiceTypes() : wm.typeManager.getPublicTypes(),
			dt = [];
		for (var i in types)
			dt.push({option: wm.getFriendlyTypeName(i), value: i});
		return dt;
	}/*,

        setPropEdit: function(propName, value) {
	    var editor = dijit.byId("studio_propinspect_" + propName);
	    var store = editor.store.root;
	    while (store.firstChild) store.removeChild(store.firstChild);
	    
	    var types = this.liveTypes ? wm.typeManager.getLiveServiceTypes() : wm.typeManager.getPublicTypes();
	    var options = [];
	    for (var i in types) {
		options.push({option: wm.getFriendlyTypeName(i), value: i});
	    }
	    if (this.sort)
		options.sort(function(a, b) { return wm.data.compare(a.option, b.option); });
	    for (var i = 0; i < options.length; i++) {
		var node = document.createElement("option");
		node.innerHTML = options[i].option;
		node.value = options[i].value;
		store.appendChild(node);
	    }

	    editor.set("value", value, false);
	    editor._lastValueReported = value;
	}
	*/
});

dojo.declare("wm.propEdit.AllDataTypesSelect", wm.propEdit.DataTypesSelect, {
	addOptionValues: function(inOptionValues, inSort) {
		if (inSort)
			inOptionValues.sort(function(a, b) { 
                            if (a.option.match(/Literal$/) && b.option.match(/Literal$/))
                                return wm.data.compare(a.option, b.option); 
                            else if (a.option.match(/Literal$/))
                                     return -1;
                            else if (b.option.match(/Literal$/))
                                     return -1;
                            else
                                return wm.data.compare(a.option, b.option); 
                        });
		this.options = (this.options || []).concat(dojo.map(inOptionValues, function(d) { return d.option; }));
		this.values = (this.values || []).concat(dojo.map(inOptionValues, function(d) { return d.value; }));
	},
    /* Localization TODO: At some point we may want to localize these, but we'd need to localize the entire type system to gain by that */
	getDataTypes: function() {
            var list = this.inherited(arguments);
            var extras = [{option: "String Literal", value: "String"}, {option: "Number Literal", value: "Number"}, {option: "Boolean Literal", value: "Boolean"}, {option: "Date Literal", value: "Date"}];
            return extras.concat(list);
	}
});
dojo.declare("wm.propEdit.AllDataTypesSelect", wm.propEdit.DataTypesSelect, {
	addOptionValues: function(inOptionValues, inSort) {
		if (inSort)
			inOptionValues.sort(function(a, b) { 
                            if (a.option.match(/Literal$/) && b.option.match(/Literal$/))
                                return wm.data.compare(a.option, b.option); 
                            else if (a.option.match(/Literal$/))
                                     return -1;
                            else if (b.option.match(/Literal$/))
                                     return -1;
                            else
                                return wm.data.compare(a.option, b.option); 
                        });
		this.options = (this.options || []).concat(dojo.map(inOptionValues, function(d) { return d.option; }));
		this.values = (this.values || []).concat(dojo.map(inOptionValues, function(d) { return d.value; }));
	},
    /* Localization TODO: At some point we may want to localize these, but we'd need to localize the entire type system to gain by that */
	getDataTypes: function() {
            var list = this.inherited(arguments);
            var extras = [{option: "String Literal", value: "String"}, {option: "Number Literal", value: "Number"}, {option: "Boolean Literal", value: "Boolean"}, {option: "Date Literal", value: "Date"}];
            return extras.concat(list);
	}
});


dojo.declare("wm.propEdit.LiveSourcesSelect", wm.propEdit.DataTypesSelect, {
	liveTypes: true,
    
	getOptions: function() {
	    this.inherited(arguments);
	    if (!this.skipLiveViews)
		this.addOptionValues(this.getLiveViews(), true);
	    return this.options;

	},

	getLiveViews: function() {
		var
			views = wm.listComponents([studio.application], wm.LiveView),
			lv = [];
		wm.forEach(views, dojo.hitch(this, function(v) {
			var dt = v.dataType || "", k = dt ? " (" + dt.split('.').pop() + ")" : "";
			lv.push({
				option: v.name + k,
				value: v.getId()
			});
		}));
		return lv;
	}
});

dojo.declare("wm.propEdit.DataSetSelect", wm.propEdit.Select, {
	getOptions: function() {
		var sp = studio.page, r = this.getDataSets([sp, sp.app]);
		if (this.widgetDataSets)
			wm.forEachWidget(sp.root, dojo.hitch(this, function(w) {
				if (w !== this && !(w instanceof wm.LiveFormBase) && !(w instanceof wm.Editor && w.formField))
					r = r.concat(this.getDataSets([w]));
			}));
		return [""].concat(r.sort());
	},
	getDataSets: function(inOwners) {
		var all = this.allowAllTypes, list = this.listMatch;
		return wm.listMatchingComponentIds(inOwners, function(c) {
			return (c instanceof wm.Variable &&
				c.name && c.name.indexOf("_") != 0 &&
				(all || wm.typeManager.isStructuredType(c.type)) &&
				(list !== undefined ? list == wm.fire(c, "isListBindable") : true)
			);
		});
	}
});

dojo.declare("wm.propEdit.LiveDataSetSelect", wm.propEdit.DataSetSelect, {
	getDataSets: function(inOwners) {
		var all = this.allowAllTypes, list = this.listMatch;
		return wm.listMatchingComponentIds(inOwners, function(c) {
		    if (c instanceof wm.Variable &&
			c.name && c.name.indexOf("_") != 0 &&
			(all || wm.typeManager.isStructuredType(c.type)) &&
			(list !== undefined ? list == wm.fire(c, "isListBindable") : true)
		       ) {
			var type = wm.typeManager.getType(c.type);
			return type.liveService;
		    }
		    
		});
	}
});

dojo.declare("wm.prop.SizeEditor", wm.AbstractEditor, {
    editorBorder: false,
    pxOnly: false,
    validationEnabled: function() {return false;},
    flow: function() {
	this.editor.flow();
    },
    _createEditor: function(inNode) {
	this.editor = new wm.Panel({layoutKind: "left-to-right",
				    owner: this,
				    parent: this,
				    width: "100%",
				    height: "100%",
				    name: "editor",
				    disabled: this.disabled,
				    readonly: this.readonly
				   });
	this.numberEditor = new wm.Text({owner: this,
					 regExp: "^\\d*(%|px|)",
					   parent: this.editor,
					   width: "100%",
					   name: "numberEditor",
					   padding: "0,1,0,0",
				    disabled: this.disabled,
				    readonly: this.readonly
					  });
	this.typeEditor = new wm.SelectMenu({owner: this,
					     parent: this.editor,
					     name: "typeEditor",
					     options: "px,%",
					     dataField: "dataValue",
					     displayField: "dataValue",
					     width: "55px",
					     padding: "0",
				    disabled: this.disabled,
				    readonly: this.readonly
					    });
	if (this.pxOnly) {
	    this.typeEditor.setReadonly(true);
	    this.typeEditor.setDataValue("px");
	}
	this.numberEditor.connect(this.numberEditor, "onchange", this, "numberChanged");
	this.typeEditor.connect(this.typeEditor, "onchange", this, "changed");
	return this.editor;
    },
    numberChanged: function() {
	var displayValue = this.numberEditor.getDisplayValue();
	if (this.pxOnly) {
	    displayValue = parseInt(displayValue);
	    this.changed();
	} else if (displayValue.match(/\%$/)) {
	    this.numberEditor.setDataValue(displayValue.replace(/\%$/,""));
	    this.typeEditor.setDataValue("%");
	} else if (displayValue.match(/px$/)) {
	    this.numberEditor.setDataValue(displayValue.replace(/px$/,""));
	    this.typeEditor.setDataValue("px");	    
	} else {
	    this.changed();
	}
    },
    getEditorValue: function() {
	return this.numberEditor.getDataValue() + this.typeEditor.getDataValue();
    },
    setEditorValue: function(inValue) {
	var result = String(inValue).match(/^(\d+)(.*)$/);
	if (result) {
	    this.numberEditor.setDataValue(result[1]);
	    this.typeEditor.setDataValue(result[2] || "px");
	} else {
	    this.numberEditor.setDataValue(100);
	    this.typeEditor.setDataValue("px");
	}
    }
});


// user passes in an options array (not a comma separated list) and a values array; getDataValue returns values[i]
// simple way to have separate display/datavalues without passing in a wm.variable
dojo.declare("wm.prop.SelectMenu", wm.SelectMenu, {
    dataField: "dataValue",
    displayField: "dataValue",
    values: null, 
    postInit: function() {
	this.inherited(arguments);
	this.refreshOptions();
    },
    getDataValue: function() {
	if (!this.values)
	    return this.inherited(arguments);
	var display = this.getDisplayValue();
	for (var i = 0; i < this.options.length; i++) {
	    if (display == this.options[i]) {
		return this.values[i];
	    }
	}
    },
    setEditorValue: function(inValue) {
	if (!this.values)
	    return this.inherited(arguments);
	for (var i = 0; i < this.values.length; i++) {
	    if (inValue == this.values[i]) {
		return this.inherited(arguments, [this.options[i]]);
	    }
	}
    },
    refreshOptions: function() {
	this.updateOptions();
	this.setOptions(this.options);
    },
    updateOptions: function() {
    }
});

dojo.declare("wm.prop.PagesSelect", wm.prop.SelectMenu, {
    currentPageOK: false,
    updateOptions: function() {
	this.inherited(arguments)
	var pagelist = wm.getPageList(this.currentPageOK);
        if (this.newPage)
	    pagelist.push(studio.getDictionaryItem("wm.PageContainer.NEW_PAGE_OPTION"));
	this.setOptions(pagelist);
    }
});


dojo.declare("wm.prop.DataSetSelect", wm.prop.SelectMenu, {
    matchComponentType: false,
    dataField: "dataValue",
    displayField: "dataValue",
    allowAllTypes: true,
    listMatch: true, /* True: only match lists; False: only match non-lists; undefined: match all */
    createWire: true,
    widgetDataSets: false,
    allowNone: true,
    servicesOnly: false,
    liveServicesOnly: false,
    includeLiveViews: false,
    noForms: false,
    showInputs: false,
    updateOptions: function() {
	this.inherited(arguments)
	var matchType = "";
	if (this.matchComponentType && this.propDef.treeBindField) {
	    matchType = this.inspected.getValue(this.propDef.name).type;
	}
	var sp = studio.page;
	var r = this.getDataSets([sp, sp.app], matchType);
	if (this.showInputs) {
	    var serviceVars = wm.listComponents([sp,sp.app], wm.ServiceVariable, true);
	    for (var i = 0; i < serviceVars.length; i++) {
		if (!matchType || matchType == serviceVars[i].type) {
		    r.push(serviceVars[i].name + ".input");
		}
	    }
	}
	if (this.widgetDataSets)
	    wm.forEachWidget(sp.root, dojo.hitch(this, function(w) {
		if (w !== this && !(w instanceof wm.LiveFormBase) && !(w instanceof wm.AbstractEditor && w.formField))
		    r = r.concat(this.getDataSets([w],matchType));
	    }));
	    if (this.includeLiveViews)
		r = r.concat(this.getLiveViews());
	r = r.sort();
	wm.Array.removeElement(r,this.inspected.getId());
	this.setOptions(r);
    },

	getLiveViews: function() {
		var
			views = wm.listComponents([studio.application], wm.LiveView),
			lv = [];
		wm.forEach(views, dojo.hitch(this, function(v) {
			var dt = v.dataType || "", k = dt ? " (" + dt.split('.').pop() + ")" : "";
		    lv.push(v.getId());

		}));
		return lv;
	},
    getDataSets: function(inOwners, matchType) {
	    return wm.listMatchingComponentIds(inOwners, dojo.hitch(this, function(c) {


			if (!c.name || c.name.indexOf("_") === 0) return false;

		if (matchType) {
		    return matchType == c.type;
		}

			if (!this.allowAllTypes && !wm.typeManager.isStructuredType(c.type)) return false;

			if (c instanceof wm.LiveVariable) return true; // always accept any LiveVariable no matter who owns it

			if (c instanceof wm.Variable && !this.servicesOnly || c instanceof wm.ServiceVariable) {
			    var typeDef = wm.typeManager.getType(c.type);

			    /* Handle liveServiceOnly */
			    if (this.liveServicesOnly) {
				if (!typeDef || !typeDef.liveService) {
				    return false;
				}
			    }

			    /* Handle noForms */
			    if (this.noForms && (wm.LiveFormBase && c.owner instanceof wm.LiveFormBase || wm.LiveFormBase && c.owner instanceof wm.DataForm)) {
				return false;
			    }

			    /* Handle listMatch */
			    if (this.listMatch !== undefined) {
				if (this.listMatch != wm.fire(c, "isListBindable")) {
				    return false;
				}
			    }

			    return true;
			}
	    }));
	}
});


dojo.declare("wm.prop.FieldSelect", wm.prop.SelectMenu, {
    dataField: "dataValue",
    displayField: "dataValue",
    dataSetProp: "dataSet",
    insepected: null,
    allowNone: true,
    emptyLabel: "",
    updateOptions: function() {
	this.inherited(arguments)
	var ds = this.inspected.getProp(this.dataSetProp);
	var options;
	if (ds) {
	    options = wm.typeManager.getSimplePropNames(ds._dataSchema);
	} else {
	    options = [];
	}
	if (this.emptyLabel) {
	    this.allowNone = false;
	    options.unshift(this.emptyLabel);
	}
	this.setOptions(options);
    },
    setEditorValue: function(inValue) {
	if (!inValue && this.emptyLabel) {
	    this.inherited(arguments, [this.emptyLabel]);
	} else {
	    this.inherited(arguments);
	}
    },
    setInitialValue: function() {
	this.beginEditUpdate();
	this.setEditorValue(this.dataValue);
	this.endEditUpdate();
    }
	    
});


dojo.declare("wm.prop.FormFieldSelect", wm.prop.SelectMenu, {
    dataField: "dataValue",
    displayField: "dataValue",    
    relatedFields: false,
    insepected: null,
    allowNone: false,   
    updateOptions: function() {
	this.inherited(arguments);
	var f = this.inspected.getParentForm();
	var ds;
	var type;

	if (f instanceof wm.ServiceInputForm) {
	    ds = f.serviceVariable.input;
	} else if (f && f.dataSet && wm.typeManager.getType(f.dataSet.type)) {
	    ds = f && f.dataSet;
	}
	var options;
	if (ds) {
	    options = ds && ds.type ? this.inspected.getSchemaOptions && this.inspected.getSchemaOptions(ds._dataSchema) || this.getSchemaOptions(ds._dataSchema) : [""];
	} else if (f && f.type) {
		var type = wm.typeManager.getType(f.type);
		options = type ? this.getSchemaOptions(type.fields) : [""];
	    } else {
		options = [];
	    }
	this.setOptions(options);
    },
	getSchemaOptions: function(inSchema) {
		return [""].concat(wm.typeManager[this.relatedFields ? "getStructuredPropNames" : "getSimplePropNames"](inSchema));
	}
});


dojo.declare("wm.prop.ImageListSelect", wm.prop.SelectMenu, {
    dataField: "dataValue",
    displayField: "dataValue",
    allowNone: true,
    updateOptions: function() {
	this.inherited(arguments);
	this.setOptions(studio.getImageLists());
    }
});

dojo.declare("wm.prop.WidgetSelect", wm.prop.SelectMenu, {
    dataField: "dataValue",
    displayField: "dataValue",
    allowNone: true,
    widgetType: null,
    excludeType: null,
    updateOptions: function() {
	if (this.widgetType && typeof this.widgetType == "string")
	    this.widgetType = dojo.getObject(this.widgetType);
	if (this.excludeType && typeof this.excludeType == "string")
	    this.excludeType = dojo.getObject(this.excludeType);

	this.inherited(arguments);


	var components = wm.listComponents([this.inspected.owner], this.widgetType);
	var result = [];
	if (this.excludeType) {
	    for (var i = 0; i < components.length; i++) {
		if (components[i] instanceof this.excludeType == false) {
		    result.push(components[i]);
		}
	    }
	} else {
	    result = components;
	}
	var ids = [];
	for (var i = 0; i < result.length; i++) {
	    ids.push(result[i].getId());
	}
	this.setOptions(ids);
    }
});

dojo.declare("wm.prop.DataTypeSelect", wm.prop.SelectMenu, {
    useLiterals:false,
    liveTypes: false,
    updateOptions: function() {
	this.inherited(arguments);
	if (this.useLiterals) {
	    this.options = ["","string", "number", "date", "boolean"];
	    this.values = ["", "string", "number", "date", "boolean"];
	} else {
	    this.options = [""];
	    this.values = [""];
	}
	this.addOptionValues(this.getDataTypes(), true);
    },
	addOptionValues: function(inOptionValues, inSort) {
	        this.sort = inSort;
		if (inSort)
			inOptionValues.sort(function(a, b) { return wm.data.compare(a.option, b.option); });
		this.options = (this.options || []).concat(dojo.map(inOptionValues, function(d) { return d.option; }));
		this.values = (this.values || []).concat(dojo.map(inOptionValues, function(d) { return d.value; }));
	},
	getDataTypes: function() {
		var
			types = this.liveTypes ? wm.typeManager.getLiveServiceTypes() : wm.typeManager.getPublicTypes(),
			dt = [];
	    for (var i in types) {
		if (wm.defaultTypes[i]) {
		    //i = wm.defaultTypes[i].fields.dataValue.type;
			dt.push({option: i, value: i});
		} else {
			dt.push({option: wm.getFriendlyTypeName(i), value: i});
		}
	    }
	    return dt;
	}
});


dojo.declare("wm.prop.EventEditorSet", wm.Container, {
    noBindColumn: true,
    inspected: null,
    verticalAlign: "top",
    horizontalAlign: "left",
    borderColor: "#3F3F3F",
    margin: "0,0,4,0",
    init: function() {
	this.inherited(arguments);
	this.setLayoutKind("top-to-bottom");
	var topPanel = new wm.Panel({owner: this,
				   parent: this,
				   width: "100%",
				   height: "28px",
				   layoutKind: "left-to-right",
				   verticalAlign: "top",
				   horizontalAlign: "left"});				     
	var title = new wm.Label({owner: this,
				  parent: topPanel,
				  width: "100%",
				  height: "20px",
				  caption: this.propName});
	this.plusButton = new wm.Label({owner: this,
					parent: topPanel,
					_classes: {domNode: ["wmPlusToolButton"]},
					caption: "+",
					align: "center",
					width: "20px",
					height: "18px",
					padding: "0",
					onclick: dojo.hitch(this, function() {
					    var index = this.editors[this.editors.length-1].propertyNumber+1;
					    this.addEditor(index, "-");
					    this.inspected.eventBindings[this.propName + index] = "-";
					    this.inspected[this.propName + index] = function(){};
					    this.panel.setHeight(this.panel.getPreferredFitToContentHeight() + "px");
					    this.setHeight(this.getPreferredFitToContentHeight() + "px");
					    this.parent.setHeight(this.parent.getPreferredFitToContentHeight() + "px");
					})});
	this.panel = new wm.Panel({owner: this,
				   parent: this,
				   width: "100%",
				   height: "28px",
				   layoutKind: "top-to-bottom",
				   verticalAlign: "top",
				   horizontalAlign: "left"});

	this.editors = [];
	this.addEditor(0,this.inspected.getProp(this.propName));
	for (var i = 1; i < 20; i++) {
	    if (this.inspected.getProp(this.propName + i)) {
		this.addEditor(i, this.inspected.getProp(this.propName + i));
	    }
	}
	this.panel.setHeight(this.panel.getPreferredFitToContentHeight() + "px");
	this.setHeight(this.getPreferredFitToContentHeight() + "px");
	this.parent.setHeight(this.parent.getPreferredFitToContentHeight() + "px");
    },
	addEditor: function(inIndex, inValue) {
	    var propertyName = this.propName + (inIndex == 0 ? "" : inIndex);
	this.editors.push(new wm.prop.EventEditor({owner: this,
						   parent: this.panel,
						   name: "propEdit_" + this.propName + "_" + inIndex,
						   propName: propertyName,
						   propertyNumber: parseInt(inIndex),
						   width: "100%",
						   height: "22px",
						   captionSize: inIndex > 0 ? "60px" : "0px",
						   caption: inIndex > 0 ? "And then" : "",
						   captionPosition: "left",
						   captionAlign: "left",
						   dataValue: inValue,
						   inspected: this.inspected}));
    }
});
dojo.declare("wm.prop.EventEditor", wm.SelectMenu, {
    restrictValues: false,
    displayField: "dataValue",
    dataField: "dataValue",
    constructor: function() {
	if (!wm.prop.EventEditor.eventActions) {
	    wm.prop.EventEditor.eventActions =  {
		noEvent: {caption: studio.getDictionaryItem("wm.EventEditor.NO_EVENTS")},
		jsFunc: {caption: studio.getDictionaryItem("wm.EventEditor.NEW_JAVASCRIPT")},
		jsSharedFunc: {caption: studio.getDictionaryItem("wm.EventEditor.NEW_JAVASCRIPT_SHARED")},
		newService: {caption: studio.getDictionaryItem("wm.EventEditor.NEW_SERVICE")},
		newLiveVar: {caption: studio.getDictionaryItem("wm.EventEditor.NEW_LIVEVAR")},
		newNavigation: {caption: studio.getDictionaryItem("wm.EventEditor.NEW_NAVIGATION")},
		serviceVariables: {caption: studio.getDictionaryItem("wm.EventEditor.LIST_SERVICE"), list: "serviceVariable"},
		navigations: {caption: studio.getDictionaryItem("wm.EventEditor.LIST_NAVIGATION"), list: "navigationCall"},
		existingCalls: {caption: studio.getDictionaryItem("wm.EventEditor.LIST_SHARED_JAVASCRIPT"), list: "sharedEventHandlers"},
		dialogs: {caption: studio.getDictionaryItem("wm.EventEditor.LIST_DIALOGS"), list: "dialogs"},
		layers: {caption: studio.getDictionaryItem("wm.EventEditor.LIST_LAYERS"), list: "layers"},
		dashboards: {caption: studio.getDictionaryItem("wm.EventEditor.LIST_DASHBOARDS"), list: "dashboards"},
		timers: {caption: studio.getDictionaryItem("wm.EventEditor.LIST_TIMERS"), list: "timers"}
	    };
	}
    },
    isEventAction: function(inValue) {
	var ea = wm.prop.EventEditor.eventActions;
	for (var i in ea)
	    if (inValue == ea[i].caption)
		return true;
    },
    //FIXME: cache this
    postInit: function() {
	this.inherited(arguments);

	var sc = wm.listComponents([studio.application, studio.page], wm.ServiceVariable).sort();
	var lightboxList = wm.listComponents([studio.application, studio.page], wm.DojoLightbox);
	var nc = wm.listComponents([studio.application, studio.page], wm.NavigationCall).sort();
	var sharedEventHandlers = eventList(this.inspected.getSharedEventLookupName(this.propName), wm.isInstanceType(studio.selected.owner, wm.Application) ? studio.appsourceEditor : studio.editArea);
	var dialogList = wm.listComponents([studio.application, studio.page], wm.Dialog);
	dialogList = dialogList.concat(wm.listComponents([studio.application, studio.page], wm.DojoLightbox));
	dialogList = dialogList.concat(wm.listComponents([studio.application, studio.page], wm.PopupMenu));
	dialogList = dialogList.sort();
	if (wm.PopupMenu && this.inspected instanceof wm.PopupMenu)
	    wm.Array.removeElement(dialogList, this.inspected);
	
	var layerList = wm.listComponents([studio.page], wm.Layer);
	layerList = layerList.sort();
	
	var dashboardList = wm.listComponents([studio.application, studio.page], wm.Dashboard).sort();
	//var lf = wm.listComponents([studio.application, studio.page], wm.LiveForm);
	var timers = wm.listComponents([studio.application, studio.page], wm.Timer).sort();
	var items=[];
	var eventSchema = this.inspected.schema[this.propName];

	wm.forEachProperty(wm.prop.EventEditor.eventActions, function(o, name) {
	    var n = o.caption, l = o.list;
	    if (l) {
		var a;
		switch(l) {
		case "navigationCall":
		    if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "navigation") == -1) return;
		    a = nc;
		    break;
		case "serviceVariable":
		    if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "service") == -1) return;
		    a = sc;
		    break;
		case "sharedEventHandlers":
		    if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "js") == -1) return;
		    a = sharedEventHandlers;
		    break;
		case "dialogs":
		    if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "dialog") == -1) return;
		    a = dialogList;
		    break;
		case "layers":
		    if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "layer") == -1) return;
		    a = layerList;
		    break;

		case "lightboxes":
		    if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "lightbox") == -1) return;
		    a = lightboxList;
		    break;
		case "liveForms":
		    /*
		      if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "liveForm") == -1) return;
		      a = lf;
		      break;
		    */
		case "dashboards":
		    if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "dashboards") == -1) return;
		    a = dashboardList;
		    break;
		case "timers":
		    if (eventSchema && eventSchema.events && dojo.indexOf(eventSchema.events, "timers") == -1) return;
		    a = timers;
		    break;
		}	
		
		if (a && a.length) {
		    items.push({name: n, dataValue: n});
		    dojo.forEach(a, function(obj) {
			var aa = (wm.isInstanceType(obj, wm.Component)) ? obj.getId() : obj;
			if (obj instanceof wm.Dialog){
			    items.push({name: aa + '.show', dataValue: aa + '.show', indent: 1});
			    items.push({name: aa + '.hide', dataValue: aa + '.hide', indent: 1});
                        } else {
			    items.push({name: aa, dataValue: aa, indent:1});
                        }
			/*
			  if (obj instanceof wm.LiveForm){
			  items.push({name: aa + '.beginDataInsert', dataValue: aa + '.beginDataInsert'});
			  items.push({name: aa + '.saveData', dataValue: aa + '.saveData'});
			  items.push({name: aa + '.beginDataUpdate', dataValue: aa + '.beginDataUpdate'});
			  //items.push({name: aa + '.updateData', dataValue: aa + '.updateData'});
			  items.push({name: aa + '.cancelEdit', dataValue: aa + '.cancelEdit'});
			  items.push({name: aa + '.deleteData', dataValue: aa + '.deleteData'});
			  } else if (obj instanceof wm.Timer){
			  items.push({name: aa + ".startTimer", dataValue: aa + ".startTimer"});
			  items.push({name: aa + ".stopTimer", dataValue: aa + ".stopTimer"});
			  } else {
			  items.push({name: aa, dataValue: aa});
			  }
			*/
		    })
		}
	    } else {
		if (eventSchema && eventSchema.events)
		    switch(name) {
		    case "noEvent":
			if ( dojo.indexOf(eventSchema.events, "disableNoEvent") != -1) return;
		    case "jsFunc":
			if (dojo.indexOf(eventSchema.events, "js") == -1) return;
			break;
		    case "jsSharedFunc":
			if (dojo.indexOf(eventSchema.events, "sharedjs") == -1) return;
			break;
		    case "newService":
			if ( dojo.indexOf(eventSchema.events, "service") == -1) return;
			break;
		    case "newLiveVar":
			if ( dojo.indexOf(eventSchema.events, "service") == -1) return;
			break;
		    case "newNavigation":
			if (dojo.indexOf(eventSchema.events, "navigation") == -1) return;
			break;
		    }
		items.push({name: n, dataValue: n});
	    }
	});
	/*
	  dojo.forEach(sharedEventHandlers, function(e) {
	  items.push({name: e, dataValue: e});
	  });
	*/
	var v = new wm.Variable({
	    owner:this,
	    type: "EntryData"
	});
	v.setData(items);
	this.setDataSet(v);
    },
    onchange: function() {
	this.inherited(arguments);
	var value = this.dataValue;
	var c = this.inspected;
	if (this.isEventAction(value))
	    this.doEventAction(value);
	else {
	    this.inherited(arguments);
	    this.inspected.setProp(this.propName, value);
	}
	wm.job("studio.updateDirtyBit",10, function() {studio.updateProjectDirty();});
    },

	doEventAction: function(inEventName) {
		var ea = wm.prop.EventEditor.eventActions, c = this.inspected, p = this.propName, v;
		switch (inEventName) {
		        case ea.noEvent.caption:
		    this.setDisplayValue("");
				break;
			case ea.jsFunc.caption:
				v = c.generateEventName(p);
		    window.setTimeout(dojo.hitch(this, function() {
		        this.setDisplayValue(v);
		    }), 50); // wait until after the whole clicking on an option has finished and menu been dismissed before we change the value
				try{c.updatingEvent(p,v);}catch (e){/*do nothing as this might happen if there's a component which does not extends wm.control class*/}
		                eventEdit(c, p.replace(/\d*$/,""), v, c == studio.application);
				break;
			case ea.jsSharedFunc.caption:
				v = c.generateSharedEventName(p);
		    window.setTimeout(dojo.hitch(this, function() {
			this.setDisplayValue(v);
		    }), 50);
				try{c.updatingEvent(p,v);}catch (e){/*do nothing as this might happen if there's a component which does not extends wm.control class*/}
				eventEdit(c, p, v, c == studio.application);
                                studio.inspector.reinspect();
				break;
			case ea.newService.caption:
				studio.newComponentButtonClick({componentType: "wm.ServiceVariable"});
		    this.setDisplayValue(studio.selected.name);
				break;
			case ea.newLiveVar.caption:
				studio.newComponentButtonClick({componentType: "wm.LiveVariable"});
		    this.setDisplayValue(studio.selected.name);
				break;
			case ea.newNavigation.caption:
				studio.newComponentButtonClick({componentType: "wm.NavigationCall"});
		    this.setDisplayValue(studio.selected.name);
				break;
		}
	},
    reinspect: function() {return true;} // not implemented yet; not very important either...
});


/* TODO: Figure out an upgrade script so we can treat border,borderColor, margin and padding as just more styles */
/* TODO: Figure out how to let the user pick a resources for backgroundImage; also need backgroundPosition and gradient */
dojo.declare("wm.prop.StyleEditor", wm.Container, {
    noBindColumn: true,
    noHelpButton: true,
    verticalAlign: "top",
    horizontalAlign: "left",
    height: "250px",
    inspected: null,
    /* name, editor, editorProps, postFix */
    commonStyles: [
/*	{name: "border", editor: "wm.Number", layerName: "basicLayer"},
	{name: "borderColor", editor: "wm.ColorPicker", layerName: "basicLayer"},
	{name: "margin", editor: "wm.Text", layerName: "basicLayer"},
	{name: "padding",editor: "wm.Text", layerName: "basicLayer"},*/
	{name: "backgroundColor", editor: "wm.ColorPicker"},
	{name: "backgroundRepeat", editor: "wm.SelectMenu", editorProps: {options: ["no-repeat","repeat-x","repeat-y","repeat"]}, advanced:1},
	{name: "color", editor: "wm.ColorPicker"},
	{name: "fontWeight", editor: "wm.SelectMenu", editorProps: {options: ["normal","bold","bolder","lighter"]}},
	{name: "fontSize", editor: "wm.Number", postFix: "px"},
	{name: "textAlign", editor: "wm.SelectMenu", editorProps: {options: ["left","center","right"]}},
	{name: "verticalAlign", editor: "wm.SelectMenu", editorProps: {options: ["baseline","sub","super", "top","text-top","middle","bottom","text-bottom"]}, advanced:1},
	{name: "textDecoration", editor: "wm.SelectMenu", editorProps: {options: ["none", "underline", "overline", "line-through", "blink"]}},
	{name: "fontStyle", editor: "wm.SelectMenu", editorProps: {options: ["normal", "italic", "oblique"]}},
	{name: "fontVariant", editor: "wm.SelectMenu", editorProps: {options: ["normal", "small-caps"]},advanced:1},
	{name: "fontFamily", editor: "wm.Text"},
	{name: "whiteSpace", editor:  "wm.SelectMenu", editorProps: {options: ["normal", "nowrap", "pre","pre-line","pre-wrap"]}},
	{name: "wordBreak",  editor:  "wm.SelectMenu", editorProps: {options: ["normal", "break-word"]},advanced:1},
	{name: "opacity", editor: "wm.Number", editorProps: {"minimum": 0, "maximum": 1},advanced:1},
	{name: "cursor", editor: "wm.SelectMenu", editorProps: {options: ["pointer", "crosshair", "e-resize","w-resize","n-resize","s-resize","ne-resize","nw-resize","se-resize","sw-resize","text","wait","help","move","progress"]},advanced:1},
	{name: "zIndex", editor: "wm.Number",advanced:1}
    ],
    postInit: function() {
	this.inherited(arguments);
	this.editors = {};

	this.tabs = this.createComponents({
	    tabs: ["wm.TabLayers", {conditionalTabButtons: 1, width: "100%", fitToContentHeight: true, height: "100px", clientBorder: "1,0,0,0",clientBorderColor: "#959DAB", margin: "0", padding: "0"}, {}, {
		basicLayer: ["wm.Layer", {caption: "Basic"}, {
		}],
		styleLayer: ["wm.Layer", {caption: "Styles"}, {},{
		}],
		classLayer: ["wm.Layer", {caption: "Classes"}, {}, {
		    classListEditor: ["wm.prop.ClassListEditor", {width: "100%", inspected: this.inspected}]
		}]
	    }]
	})[0];
	this.connect(this.tabs,"onchange",this, function() {
	    this.setHeight(this.getPreferredFitToContentHeight());
	    this.parent.setHeight(this.parent.getPreferredFitToContentHeight());
	    dojo.cookie(this.getRuntimeId() + ".layerIndex", this.tabs.layerIndex);
	});
	
	this.basicLayer = this.tabs.layers[0];
	this.styleLayer = this.tabs.layers[1];
	this.classListLayer = this.tabs.layers[2];
	this.classListEditor = this.classListLayer.c$[0];
	this.tabs.setLayerIndex(dojo.cookie(this.getRuntimeId() + ".layerIndex") || 0);
	var defaultProps = {
	    captionPosition: "top",
	    captionAlign: "left",
	    captionSize: "20px",
	    singleLine: false,
	    width: "100%",
	    height: "42px",
	    allowNone: true,
	    owner: this,
	    parent: this,
	    helpText: true
	};

	dojo.forEach(this.commonStyles, dojo.hitch(this, function(styleProp) {
	    if (styleProp.advanced && !studio.inspector.isAdvancedMode()) return;
	    var parent;
	    if (styleProp.layerName) {
		parent = this[styleProp.layerName];
	    } else {
		parent = this.styleLayer;
	    }
	    var ctor = dojo.getObject(styleProp.editor);
	    var props = styleProp.editorProps || {};
	    props.caption = styleProp.name;
	    props.name = "style_" + styleProp.name;
	    var e = new ctor(dojo.mixin(props, defaultProps, {parent: parent}));
	    e.connect(e,"onchange", this, function(inDisplayValue, inDataValue) {
		this.changed(e, inDisplayValue, inDataValue);
	    });
	    e.connect(e,"onHelpClick", this, function() {
		studio.helpPopup = studio.inspector.getHelpDialog();
		studio.inspector.beginHelp(e.caption, e.domNode, this.inspected.declaredClass);
	    });
	    this.editors[styleProp.name] = e;
	}));

	var propsHash = this.inspected.listProperties();
	var propsArray = [];
	for (var propName in propsHash) {
	    var prop = propsHash[propName];
	    if (prop.group == "style" && !prop.ignore && !prop.hidden && prop.editor != "wm.prop.StyleEditor" && (!prop.advanced || studio.inspector.isAdvancedMode())) {
		propsArray.push(dojo.mixin({name: propName},prop));
	    }
	}

	     var mysort = function(a, b) {
		 var o = a.order - b.order;
		 return o == 0 ? wm.compareStrings(a.name, b.name) : o;
	     };
	propsArray.sort(mysort);

	this.owner._generateEditors(this.inspected, this.basicLayer, propsArray);

	var b = new wm.Button({
	     owner: this,
	     parent: this.styleLayer,
	     width: "100%",
	     height: "30px",
	    caption: "Create Class",
	    hint: "Creates a css class based on these styles",
	    onclick: dojo.hitch(this, "generateCssRule")
	 });


	    /*
	var b = new wm.Button({
	     owner: this,
	     parent: this,
	     width: "100%",
	     height: "30px",
	     caption: "Add Style"
	 });
	 b.connect(b, "onclick", this, function() {
	     this.addEditor("","");
	 });*/

	this.setHeight(this.getPreferredFitToContentHeight() + "px");
	this.setDataValue(this.inspected.styles);
    },
    getDataValue: function() {return this.inspected.styles},
    reinspect: function() {
	this.setDataValue(this.inspected.styles);
	return true;
    },
    setDataValue: function(inValue) {
	dojo.forEach(this.commonStyles, dojo.hitch(this, function(styleProp) {
	    var styleName = styleProp.name;
	    var e = this.editors[styleName];
	    if (styleProp.postFix && inValue) {
		var value = this.inspected.getStyle(styleName);
		value = value.replace(new RegExp(styleProp.postFix + "$"),"");
	    }
	    if (this.editors[styleProp.name]) {
		this.editors[styleProp.name].setDataValue(value);
	    }
	}));
    },
    generateCssRule: function() {
	app.prompt("What do you want to name this css class?  NOTE: Clicking ok will create this rule based on the styles you've set for this widget, and replace your styles with the new CSS Class", this.inspected.name, dojo.hitch(this, function(inClassName) {
	    if (!inClassName) return;
	    var cssText = "." + inClassName + " {\n";
	    "You CAN set these styles for nodes inside of widgets, just not for the widgets themselves. */\n";
	if (this.inspected.styles) {
	    for (var styleName in this.inspected.styles) {
		cssText += styleName.replace(/([A-Z])/g, function(inText) {return "-" + inText.toLowerCase();}) + ": " + this.inspected.styles[styleName] + ";\n";
		delete this.inspected.styles[styleName];
	    }
	    cssText += "\n}\n";
	    this.setDataValue(this.inspected.styles);
	}
	    this.classListEditor.addClass(inClassName);
	    studio.cssLayer.activate();
	    studio.sourceTab.activate();
	    studio.appCssEditArea.setDataValue(studio.appCssEditArea.getDataValue() + "\n\n" + cssText);
	}));
    },
/*
    addEditor: function(inStyleName, inStyleValue) {
	     var p = new wm.Panel({width: "100%",
				   height: "30px",
				   layoutKind: "left-to-right",
				   horizontalAlign: "left",
				   verticalAlign: "top",
				   parent: this,
				   owner: this
				  });
	     
	var nameEditor = new wm.Text({width: "100%",
				      height: "100%",
				      caption: "",
				      emptyValue: "",
				      dataValue: inStyleName,
				      onchange: dojo.hitch(this, function(inDisplayValue, inDataValue) {
					  if (this.inspected.styles[
				      })
				     });
	var styleEditor = new wm.Text({width: "100%",
				      height: "100%",
				      caption: "",
				      emptyValue: "",
				      dataValue: inStyleValue
				     });

    },
    */
    changed: function(inEditor, inDisplayValue, inDataValue) {
	var styleName = inEditor.name.replace(/^style_/,"")
	var styleDef;
	for (var i = 0; i < this.commonStyles.length; i++) {
	    if (this.commonStyles[i].name == styleName) {
		styleDef = this.commonStyles[i];
		break;
	    }
	}
	var postFix = styleDef.postFix;
	if (postFix) {
	    inDataValue += postFix;
	}
	this.inspected.setStyle(styleName, inDataValue);
    },
    _end: 0
});

dojo.declare("wm.prop.ClassListEditor", wm.Container, {
    height: "200px",
    emptyList: ["<i>No Classes...</i>"],
    postInit: function() {
	this.inherited(arguments);
	new wm.Label({owner: this,
		      parent: this,
		      width: "100%",
		      caption: "Current CSS Classes:"});
	var grid = this.grid = 
	    new wm.ListSet({owner: this,
			    parent: this,
			    searchBar: false,
			    width: "100%",
			    height: "100%",
			    dataField: "dataValue",
			    displayField: "dataValue",
			    options: this.inspected._classes && this.inspected._classes.domNode && this.inspected._classes.domNode.length ? dojo.clone(this.inspected._classes.domNode) : this.emptyList
			   });
	grid.grid.setDeleteColumn(grid.options != this.emptyList);
	grid.grid.connect(grid.grid, "onRowDeleted", this, "removeClass");
	var addPanel = new wm.Panel({owner: this,
				     parent: this,
				     width: "100%", 
				     height: "30px",
				     layoutKind: "left-to-right",
				     verticalAlign: "top",
				     horizontalAlign: "left"
				    });
	this.textInput = new wm.Text({owner: this,
				parent: addPanel,
				      caption: "",
				placeHolder: "Class Name",
				captionSize: "80px",
				width: "100%",
				height: "100%",
				      onEnterKeyPress: dojo.hitch(this, "addClass")});
	this.addButton = new wm.Label({owner: this,
					    parent: addPanel,
					    name: "addButton",
					_classes: {domNode: ["wmPlusToolButton"]},
				    caption: "+",
				    width: "20px",
				    height: "20px",
				    onclick: dojo.hitch(this, "_addClass")});
	new wm.Label({owner: this, 
		      parent: this,
		      width: "100%",
		      height: "32px",
		      singleLine: false,
		      caption: "Add a CSS class to this widget to style it"});
	this.reflow();
    },
    addClass: function(inClassName) {
	this.textInput.setDataValue(inClassName);
	this._addClass();
    },
    _addClass: function() {
	var value = this.textInput.getDataValue();
	this.textInput.clear();
	if (value) {
	    var options = this.grid.options;
	    if (options == this.emptyList) {
		options = [];
		this.grid.grid.setDeleteColumn(true);
	    }
	    options.push(value);
	    this.grid.setOptions(options);
	    this.inspected.addUserClass(value);
	}
	this.textInput.focus();
    },
    removeClass: function(inRowId, inRowData) {
	var options = this.grid.options;
	if (options != this.emptyList) {
	    wm.Array.removeElement(options, inRowData.dataValue);
	    //this.grid.setOptions(options); // row already removed, and the removeElement updated the options array
	    if (options.length == 0) {
		this.grid.setOptions(this.emptyList);
		this.grid.grid.setDeleteColumn(false);
	    }
	    this.inspected.removeUserClass(inRowData.dataValue);
	} else {
	    this.setOptions(this.emptyList);
	    this.grid.grid.setDeleteColumn(false);
	}
    },
    getDataValue: function() {
	return this.inspected._classes && this.inspected._classes.domNode ? dojo.clone(this.inspected._classes.domNode) : [];
    },
    setDataValue: function(inValue) {
	this.grid.setOptions(this.inspected._classes && this.inspected._classes.domNode && this.inspected._classes.domNode.length ? dojo.clone(this.inspected._classes.domNode) : this.emptyList);
	this.grid.grid.setDeleteColumn(this.grid.options != this.emptyList);
    },
    _end: 0
});

dojo.declare("wm.prop.RolesEditor", wm.CheckboxSet, {
    noBindColumn: true,
    noReinspect: true,
    height: "80px",
    dataField: "dataValue",
    displayField: "dataValue",
    init: function() {
	this.inherited(arguments);
	/* Use studio.application._roles so we know we've got the latest set of roles for THIS project */
	if (!studio.application._roles) {
	    studio.securityConfigService.requestSync("getRoles", [], dojo.hitch(this, function(inData) {
		wm.roles = inData;
		studio.application._roles = inData;
	    }));
	}
    },
    postInit: function() {
	this.inherited(arguments);
	var options = ["Everyone"].concat(wm.roles);

	this.setOptions(options);
	var roles = this.inspected.roles || ["Everyone"];
	if (dojo.indexOf(roles, "Everyone") != -1) {
	    this.hadEveryone = true;
	}

	this.setDataValue(roles);
    },
    setDataValue: function(inValue) {
	if (wm.isEmpty(inValue)) {
	    this.inherited(arguments, [["Everyone"]]);
	} else {
	    this.inherited(arguments);
	}
    },
    getDataValue: function() {
	var value = this.inherited(arguments);
	if (value && value.length == 1 && value[0] === "Everyone") {
	    return null;
	} else {
	    return value;
	}
    },
    changed: function() {
	if (!this._inDoChange) {
	    this._inDoChange = true;
	    var count = 0;
	    for (var i = 0; i < this.dijits.length; i++) {
		count += (this.dijits[i].get("checked")) ? 1 : 0;
	    }
	    if (this.dijits[0]) {
		if (count ==  1) {
		    this.hadEveryone = this.dijits[0].checked;
		} else if (count == 0) {
		    this.dijits[0].set("checked", true, false);
		    this.dijits[0]._lastValueReported = true;
		    this.hadEveryone = true;
		} else if (this.hadEveryone && this.dijits[0].checked) {
		    this.hadEveryone = false;
		    this.dijits[0].set("checked", false, false);
		    this.dijits[0]._lastValueReported = false;
		} else if (this.dijits[0].checked) {
		    this.hadEveryone = true;
		    for (var i = 1; i < this.dijits.length; i++) {		
			this.dijits[i].set("checked", false, false);
			this.dijits[i]._lastValueReported = false;
		    }
		}
	    }
	    delete this._inDoChange;
	    this.inherited(arguments);
	    this.inspected.setRoles(this.getDataValue());
	}
    },
    reinspect: function() {return true;}
});

/*
dojo.declare("wm.prop.FieldGroupEditor", wm.Container, {
    indent: 0,
    noBindColumn: true,
    noHelpButton: true,
    inspected: null,
    groupEditorPropertyName: "",
    postInit: function() {
	this.inherited(arguments);

	studio.inspector.addSubGroupIndicator(this.propDef.name,this);

	if (this.groupEditorPropertyName) {
	    this.inspected = this.inspected.getProp(this.groupEditorPropertyName);
	}


	this.editors = {};

	if (this.propDef.advanced && !studio.inspector.isAdvancedMode()) {
	    this.setShowing(false);
	} else {
	    this.setShowing(true); // wm.PropertyInspector will set this to hidden if the entire thing is bound assuming a bind-editor will be shown instead; not applicable for this particular editor
	}

	this.generateEditors(this.inspected);
    },
    generateEditors: function(c) {
	var propDef = dojo.clone(this.propDef);
	if (propDef.treeBindField == "this") {
	    propDef.treeBindField = this.propDef.name;
	}
	delete propDef.editor;

	console.log("TODO: This should be a pulldown of matching objects to bind to");
	var e= studio.inspector.generateEditor(this.inspected, propDef, this,null,this.propDef.name);
	e.setDisabled(true);
	this.editors._ROOT = e;
	this.indent++;
	
	var type = c.type;
	var fields;
	if (wm.typeManager.getType(type)) {
	    fields = wm.typeManager.getType(type).fields;
	} else {
	    fields = c._dataSchema;
	}
	if (fields) {
	    this._generatedSchema = dojo.toJson(fields);
	    wm.forEachProperty(fields, dojo.hitch(this,function(fieldDef, fieldName) {
		var type = fieldDef.type;

		/ * dojo.mixin used this way insures we work on a copy of propDef and don't modify e.propDef before its onclick is fired * /
		propDef = dojo.mixin({}, propDef, {
		    name: fieldName,
		    displayName: fieldName,
		    type: type || propDef.type,
		    treeBindField: (this.propDef.treeBindField != "this" ? this.propDef.treeBindField + "." : "") + fieldName,
		    editorProps: {
		        createExpressionWire: true
		    },
		    createWire: true,
		    rootTreeBindField: this.propDef.treeBindField
		});

		var p = new wm.Panel({owner: this,
				      parent: 
		if (wm.typeManager.isStructuredType(type)) {
		    e = studio.inspector.generateEditor(c, propDef, this,null,this.propDef.name);
		    e.setDisabled(true);
		    var expandButton = new wm.ToolButton({owner: this,
							  parent: e.parent,
							  caption: ">",
							  width: "20px",
							  height: "20px",
							  onclick: dojo.hitch(this, function() {
							      this.generateEditors(c.getValue(fieldName));
							  })
							 });
		    e.parent.moveControl(expandButton,0);

		} else {
		    e = studio.inspector.generateEditor(c, propDef, this,null,this.propDef.name);
		    var expandButton = new wm.Spacer({owner: this,
						      parent: e.parent,
						      width: "20px",
						      height: "20px"});
		    e.parent.moveControl(expandButton,0);

		}
		this.editors[c.getId() + "." + fieldName] = e;
	    }));
	}
	this.setBestHeight();
	this.reflow();
    },
    reinspect: function() {
	if (this._generatedSchema != dojo.toJson(this.inspected._dataSchema)) {
	    this.removeAllControls();
	    this.generateEditors(this.inspected);
	    this.parent.setBestHeight();
	} else {
	    for(var editorName in this.editors) {
		var e = this.editors[editorName];
		studio.inspector.reinspectEditor(this.inspected,e, null, e.propDef,this.propDef.name);
	    }
	}
	return true;
    },
    removeAllControls: function() {
	    for(var editorName in this.editors) {
		var e = this.editors[editorName];
		delete this.editors[editorName];
		for (var editorName in studio.inspector.editorHash) {
		    if (e == studio.inspector.editorHash[editorName]) {
			delete studio.inspector.editorHash[editorName];
			delete studio.inspector.bindEditorHash[editorName];
		    }
		}
		e.parent.destroy();
	    }
	this.inherited(arguments);
    }
});*/