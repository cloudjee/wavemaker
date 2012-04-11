/*
 *  Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Editors.Select_design");
dojo.require("wm.base.widget.Editors.Select");
dojo.require("wm.base.widget.Editors.DataSetEditor_design");


// design only
wm.SelectMenu.extend({
    themeableStyles: ["wm.SelectMenu-Down-Arrow_Image", "wm.SelectMenu-Inner_Radius"],
	setHasDownArrow: function(inValue){
		this.hasDownArrow = inValue;
		//this.editor.attr('hasDownArrow', this.hasDownArrow); does not work updates the editor instantly. Therefore wrote a hack to hide downArrowNode by updating style prop.
		if (this.editor.downArrowNode){
			this.editor.downArrowNode.style.display = this.hasDownArrow ? "" : "none";
		}
	}
});



wm.Object.extendSchema(wm.SelectMenu, {
    /* DISPLAY GROUP; help subgroup */
    placeHolder: {group: "editor text", subgroup: "help"}, 

    /* DISPLAY GROUP; visual subgroup */
    hasDownArrow: {group: "editor",subgroup: "layout", order: 26},

    /* Events group */
    onEnterKeyPress: {ignore: 0},


    /* Editor group; validation subgroup */
    restrictValues: {type: "boolean", group: "editor", subgroup: "validation", order: 40},

    /* Editor group; dataSet subgroup */
    allowNone: {group: "editor",subgroup: "dataSet", order: 30},


    /* Editor group; behavior subgroup */
    autoComplete: {group: "editor", order: 25, subgroup: "behavior"},
    pageSize: { order: 100, group: "editor", subgroup: "behavior"},

    /* Ignored group */
    changeOnKey: { ignore: 1 },
    changeOnEnter: { ignore: 1 },

    /* Methods group */
    setRestrictValues: {method:1},
    getItemIndex: {method:1, returns: "Number"}
});


wm.Object.extendSchema(wm.Lookup, {
    /* Editor group; value subgroup */
    formField: {editor: "wm.prop.FormFieldSelect", editorProps: {relatedFields: true}},
    editorType: {options: ["Lookup", "FilteringLookup"]},

    /* Editor group; behavior subgroup */
    autoDataSet: {group: "editor", subgroup: "behavior", order: 10}, /* both of these could also be dataSet subgroup */
    maxResults: {group: "editor", subgroup: "behavior", order: 100},

    /* Ignored group */
    indentField: {hidden: 1}, // users can use it but its not designed to be meaningful for them
    relationshipName: {hidden:1},
    ignoreCase: {ignore: 1},
    options: {ignore: 1},
    dataField: {hidden: 1},
    dataType: {hidden: 1},
    liveVariable: {ignore: 1} /* else it writes its liveVariable subcomponent */
});


wm.Lookup.extend({
	afterPaletteDrop: function() {
	    this.inherited(arguments);
	    var ff = this.getUniqueFormField();	    
	    if (ff && ff != '') {
		this.set_formField(ff);
	    }
	},
	getUniqueFormField: function(){
			var lf = wm.getParentForm(this);
			if (!lf)
				return '';
			var arr = this.getOptions();
			if (arr.length < 2)
				return arr[0];
			for (var i = 0; i < arr.length; i++){
				if (!lf.isFormFieldInForm(arr[i]))
					return arr[i];
			}
			
			return arr[1];
	},
	getSchemaOptions: function(inSchema) {
		return wm.typeManager.getFilteredPropNames(inSchema, function(p) {
			return wm.typeManager.isStructuredType((p || 0).type) && !p.isList;
		});
	},
	getOptions: function() {
		var f = wm.getParentForm(this), ds = f && f.dataSet;
		return ds && ds.type ? this.getSchemaOptions(ds._dataSchema) : [""];
	},

	listProperties: function() {
		var props = this.inherited(arguments);
	    var parentForm = this.getParentForm();
	    props.autoDataSet.ignoretmp = !Boolean(parentForm);
		props.dataSet.ignoretmp = parentForm && this.autoDataSet;
		props.dataSet.bindTarget = !props.dataSet.ignoretmp;
	        props.maxResults.ignoretmp = !this.autoDataSet;
	        props.startUpdate.ignoretmp = !this.autoDataSet;
	        props.displayExpression.ignoretmp = this.autoDataSet && parentForm;
		return props;
	},
	set_formField: function(inFieldName) {
	    var formFieldWas = this.formField;
	    if (inFieldName) {
		this.formField = inFieldName;
		if (this.autoDataSet && this.formField)
		    this.createDataSet();	    
		this.inherited(arguments);
		if (this.formField && this.formField != formFieldWas) {
		    this._setDisplayField();
		}
	    } else {
		delete this.formField; // undefined used in getFormEditorsArray
	    }
	},
    set_autoDataSet: function(inValue) {
	this.startUpdate = Boolean(inValue);
	this.setAutoDataSet(inValue);
    }
});



wm.Object.extendSchema(wm.FilteringLookup, {
    ignoreCase: {group: "editor", subgroup: "dataSet"},

    /* Ignored group */
    orderBy: {ignore: true},
    filterField: {ignore: true}, // for now, this value will always be the same as displayField
    maxResults: {ignore: true}, // for now, this value will always be the same as pageSize
    restrictValues: {ignore: true}, // by definition, we must find objects; if no match, no data
    hasDownArrow: {ignore: true}, // Downarrow will not work with this
    displayType: {ignore: true}, // can only filter on text
    displayExpression: {ignoreHint: "Turn off autoDataSet to use displayExpression"}, // can only filter on a single field, can not filter on expression text
    startUpdate: {ignore: true} // only update when the user types
});