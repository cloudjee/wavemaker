/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
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
		this._do(this.oldValue);
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
	applyProp: function(t) {
		if (t && t.name && ("value" in t)) {
			var v = t.type == "checkbox" ? t.checked : t.value;
			this._setPropValue(v);
		}
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
		this.options = this.options || this.getOptions();
		this.values = this.values || this.getValues() || this.options;
	},
	getValues: function() {
	},
	getOptions: function() {
	},
	getHtml: function() {
		return makeSelectPropEdit(this.name, this.value, this.options, this.defaultValue, this.values);
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
			makeInputPropEdit(this.name, value.value, defaultValue.value),
			'</td><td style="width: 1px; border-left: 1px solid gray">&nbsp;</td><td width="44">',
			makeSelectPropEdit(this.name, value.units, this.options, ""/*defaultValue.units*/, this.values),
			'</td></tr>',
			//'<tr><td>Hello more lines!</td></tr>',
			'</table>'
		];
		return html.join('');
	},
	applyProp: function(t) {
		var row = t.parentNode.parentNode;
		var edit = row.cells[0].firstChild;
		var select = row.cells[2].firstChild;
		var su = this.lex(edit.value);
		this.inspector._setInspectedProp(this.name, su.value + (su.units || select.value));
	}
});

dojo.declare("wm.propEdit.PagesSelect", wm.propEdit.Select, {
	getOptions: function() {
		return wm.getPageList(this.currentPageOK);
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
		var layers = wm.listOfWidgetType(this.widgetType, true), options = [];
		for (var i=0, l; l = layers[i]; i++) { 
			options.push(l.name);
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
		return ds && ds.type ? this.getSchemaOptions(ds._dataSchema) : [""];
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
		this.addOptionValues(this.getDataTypes(), true);
	},
	addOptionValues: function(inOptionValues, inSort) {
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
	}
});

dojo.declare("wm.propEdit.LiveSourcesSelect", wm.propEdit.DataTypesSelect, {
	liveTypes: true,
	init: function() {
		this.addOptionValues(this.getLiveViews(), true);
		this.inherited(arguments);
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
				(all || wm.typeManager.isStructuredType(c.type)) &&
				(list !== undefined ? list == wm.fire(c, "isListBindable") : true)
			);
		});
	}
});
