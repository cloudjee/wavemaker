/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
	    new wm.SetPropTask(this.component, this.name, this.value, inValue);
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
	    var f = wm.getParentForm(this.component), ds = f && f.dataSet;
	    var result;
	    if (ds && ds.type) {
		result = this.component.getSchemaOptions && this.component.getSchemaOptions(ds._dataSchema) || this.getSchemaOptions(ds._dataSchema);
		result.unshift("");
	    } else {
		result = [""];
	    }
	    return result;
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


dojo.declare("wm.propEdit.LiveSourcesSelect", wm.propEdit.DataTypesSelect, {
	liveTypes: true,
	getOptions: function() {
	    this.inherited(arguments);
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
