/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Editors.DataSetEditor");
dojo.require("wm.base.widget.Editors.AbstractEditor");

dojo.declare("wm.DataSetEditor", wm.AbstractEditor, {
    _multiSelect: false,
    dataSet: null,
    options: "",

    dataField: "",
    displayField: "",
    displayExpression: "",
    startUpdate: false,
    _allFields: "All Fields",
    selectedItem: null,

    init: function() {
	this.inherited(arguments);
	this.selectedItem = new wm.Variable({name: "selectedItem", owner: this});
	if (this._multiSelect)
	    this.selectedItem.setIsList(true);
    },

        postInit: function() {
	    if (this.options) this.setOptionsVariable();
	    if (!this.displayField) {
		this._setDisplayField();
		if (!this.dataField && this.dataSet && this.dataSet.type && wm.defaultTypes[this.dataSet.type]) {
		    this.dataField = "dataValue";
		}
	    }
	    this.inherited(arguments);

	    if (this.startUpdate)
		this.update();
	},
    /* find a best guess at an initial displayField */
    _setDisplayField: function() {
	var dataSet = this.dataSet;
	if (!dataSet && this.formField) {
	    var form = this.getParentForm();
	    if (form) {
		dataSet = form.dataSet;
	    }
	    if (dataSet) {
		var fields = dataSet._dataSchema;
		var field = fields[this.formField];
		var type = field.type;
		var fieldName = wm.typeManager.getDisplayField(type);
	    }
	} else if (dataSet && dataSet.type) {
	    var type = dataSet.type;
	    var fieldName = wm.typeManager.getDisplayField(type);
	}
	if (fieldName) {
	    return this.setDisplayField(fieldName);
	}
    },
    update: function() {
	if (this.dataSet instanceof wm.ServiceVariable) {
	    if (djConfig.isDebug) {
		var eventId = app.debugDialog.newLogEvent({eventType: "startUpdate",
							   eventName: "startUpdate",
							   method: "update",
							   affectedId: this.getRuntimeId(),
							   //firingId: this.getRuntimeId(),
							   method: "update"});
	    }
	    var d = this.dataSet.updateInternal(); // use internal because we're logging the cause of the update call here
	    if (eventId) app.debugDialog.endLogEvent(eventId);
	    return d;
	}
    },
	hasValues: function(){
	    return (this.options || this.dataSet && !this.dataSet.isEmpty());
	},
	isAllDataFields: function() {
		return (this.dataField == this._allFields || this.dataField == "");
	},

	setDefaultOnInsert:function(){
		if (this.editor && this.defaultInsert){
		    if (this.$.binding && this.$.binding.wires.defaultInsert)
			this.$.binding.wires.defaultInsert.refreshValue();
		    this.setEditorValue(this.defaultInsert);
		    this.changed();
		}
	},

	setInitialValue: function() {
		this.beginEditUpdate();
		this.selectedItem.setType(this.dataSet instanceof wm.Variable ? this.dataSet.type : "AnyData");
	        var dataValue = this.dataValue;
	        var displayValue = this.displayValue;
		if (this.dataValue !== null && wm.propertyIsChanged(dataValue, "dataValue", wm._BaseEditor))
			this.setEditorValue(dataValue)
		else
			this.setDisplayValue(displayValue);
		this.endEditUpdate();


	    /* WM-2515; setInitialValue is also called each time the editor is recreated -- such as when it gets a new dataSet; 
	     *          fire an onChange if we have a displayValue after setting initialValue as this counts as a change in value
	     *          from before it was recreated.
	     */
	    if (!this._cupdating) {
	        var displayValue = this.getDisplayValue();
		if (displayValue != this.displayValue)
		    this.changed();
	    }
	},

/*
	setInitialValue: function() {
		this.selectedItem.setType(this.dataSet instanceof wm.Variable ? this.dataSet.type : "AnyData");
	},
	*/
/*
	formatData: function(inValue){
		try
		{
			if (this._formatter){
				return this._formatter.format(inValue);
			}
			else if (this.displayType){
				var ctor = wm.getFormatter(this.displayType);
				this._formatter = new ctor({name: "format", owner: this});
				return this._formatter.format(inValue);
			}
			else
				return inValue;
		}
		catch(e)
		{
			console.info('error while getting data from formatData----- ', e);
		}
			
	},
	*/
	isReady: function() {
		return this.inherited(arguments) && this.hasValues();
	},
	editorChanged: function() {
	    /* WM-2515; Don't bother firing an onchange event if there are no options to choose from; this situation
	     *          presumably means that we're still waiting for the dataSet to get options from the server;
	     *          all changed actions will fire AFTER we have a displayValue to go with whatever dataValue we have.
	     */
	    if (this.dataSet && this.dataSet.getCount()) {
		return this.inherited(arguments);
	    }
	},
/* selectmenu only
	updateSelectedItem: function() {
		// FIXME: only if dataField is All Field should we update entire selectedItem.
		var v = this.getEditorValue(true);
		this.selectedItem.setData(v);
                this._selectedData = v;
	},
	*/
	isAllDataFields: function() {
		return (this.dataField == this._allFields || this.dataField == "");
	},
    setDataSet: function(inDataSet) {
	this.dataSet = inDataSet;
	var dataValue = this.dataValue;
	this.updateIsDirty();
    },



    setDisplayField: function(inField) {
	this.displayField = inField;
	if (!this._cupdating)
	    this.createEditor();
    },
    setDataField: function(inDataField) {
	if (inDataField == "All Fields")
	    this.dataField = "";
	else
	    this.dataField = inDataField;
    },


	_getOptionsData: function() {
	    var data = [];
	    if (!this.options) return data;
	    var opts = dojo.isArray(this.options) ? this.options :  this.options.split(',');
		for (var i=0, l=opts.length, d; i<l; i++) {
		    d = dojo.string.trim(opts[i]);
		    data[i] = {name: d, dataValue: d };
		}
		return data;
	},
	setOptionsVariable: function() {
		var opts = this._getOptionsData();

		var ds = this.dataSet = new wm.Variable({name: "optionsVar",
							 owner: this,
							 type: "StringData"});
		ds.setData(opts);
	    if (this._isDesignLoaded) {
		this.displayField = "dataValue";
		this.dataField    = "dataValue";
	    }
	},
	setOptions: function(inOptions) {		
	    if (!this.displayField) {
		this.displayField = "dataValue";
		if (!this.dataField) {
		    this.dataField = "dataValue";
		}
	    }

		this.options = inOptions;
		this.setOptionsVariable();
		var wasUpdating = this._cupdating;
		this._cupdating = true;
	    //this.createEditor();
	    
	    this.setDataSet(this.dataSet);
		if (!wasUpdating) {
		    this._cupdating = false;
		    if (!this.invalidCss)
			this.sizeEditor();
		    else
			this.render();
		}
	},


    _getDisplayData: function(inObj) {
        var inVariable;
        if (wm.isInstanceType(inObj, wm.Variable))
            inVariable = inObj;
        else {
            inVariable = new wm.Variable({_temporaryComponent: true});
	    if (this.dataSet)
                inVariable.setType(this.dataSet.type);
            inVariable.setData(dojo.clone(inObj));
        }
	var de = this.displayExpression, v = inVariable;
	var result = de ? wm.expression.getValue(de, v,this.owner) : inVariable.getValue(this.displayField);
        if (this.displayType && this.displayType != 'Text')
            result = this.formatData(result);
        return result == null ? "" : String(result);
    },
    calcIsDirty: function(val1, val2) {
	var string1 =  "";
	var string2 = "";
	if (val1 instanceof wm.Variable && val1.isList || dojo.isArray(val1)) {
	    var count = val1 instanceof wm.Variable ? val1.getCount() : val1.length;
	    for (var i = 0; i < count; i++) {
		if (i) string1 += ",";
		string1 += this._getDisplayData(val1 instanceof wm.Variable ? val1.getItem(i) : val1[i]);
	    }
	} else if (val1 !== null && typeof val1 == "object") {
	    string1 = this._getDisplayData(val1);
	} else if (val1 == null) {
	    string1 = "";
	} else {
	    string1 = val1;
	}

	if (val2 instanceof wm.Variable && val2.isList || dojo.isArray(val2)) {
	    var count = val2 instanceof wm.Variable ? val2.getCount() : val2.length;
	    for (var i = 0; i < count; i++) {
		if (i) string2 += ",";
		string2 += this._getDisplayData(val2 instanceof wm.Variable ? val2.getItem(i) : val2[i]);
	    }
	} else if (val2 !== null && typeof val2 == "object") {
	    string2 = this._getDisplayData(val2);
	} else if (val2 == null) {
	    string2 = "";
	} else {
	    string2 = val2;
	}

	return string1 != string2;
    },



    setEditorValue: function(inValue) {
	this._setEditorValue(inValue, false);
	this.updateReadonlyValue();
    },
    setDisplayValue: function(inValue) {
	this._setEditorValue(inValue, true);
	this.updateReadonlyValue();
    },
    _setEditorValue: function(inValue, inUseDisplay) {
	var self = this;

	if (!this.selectedItem || !this.dataSet) {
	    this.dataValue = inValue;
	    return;
	}
	this.beginEditUpdate();
	try {
	    var lastValue = this._lastValue;
	    var cupdatingWas = this._cupdating;
	    this._cupdating = true;
	    this.deselectAll();
	    this._cupdating = cupdatingWas;
	    this._lastValue = lastValue;

	    if (inValue instanceof wm.Variable) {
		inValue = inValue.getData();
	    }


	var comparisonField;
	if (!inUseDisplay && this.dataField) {
	    comparisonField = this.dataField;
	} else if (!this.displayExpression) {
	    comparisonField = this.displayField;
	}

	if (comparisonField || this.displayExpression) {
	    if (!dojo.isArray(inValue)) {
		inValue = inValue === undefined || inValue === null ? [] : [inValue];
	    }
/*
	    if (this.dataField && inValue.length && typeof inValue[0] != "object")
		comparisonField = this.displayExpression || this.displayField;
		*/
	    var inValueCount;
	    inValueCount =  inValue.length;

	    var count = this.dataSet.getCount();
	    if (count == 0) {
		this.dataValue = this._multiSelect ? inValue : inValue[0];
	    } else {
		for (var i = 0; i < inValueCount; i++) {
		    var currentItem = dojo.isArray(inValue) ? inValue[i] : inValue;
		    var inItemValue;
		    if (comparisonField && currentItem !== null && typeof currentItem == "object") {
			inItemValue = currentItem instanceof wm.Variable ? currentItem.getValue(comparisonField) : currentItem[comparisonField];
		    } else if (!comparisonField && currentItem !== null && typeof currentItem == "object") {
			inItemValue = this._getDisplayData(currentItem);
		    } else {
			inItemValue = currentItem; // currentItem is a literal
		    }
		    var found = false;
		    for (var j = 0; j < count; j++) {
			var item = this.dataSet.isList ? this.dataSet.getItem(j) : this.dataSet;
			var itemValue = comparisonField ? item.getValue(comparisonField) : this._getDisplayData(item);
			if (itemValue == inItemValue) {
			    found = true;
			    this.selectItem(j);
			    break;
			}
		    }
		    if (!found)
			this._onSetEditorValueFailed(inValue);
		}
	    }
	}
	} catch(e) {
	    console.error(e);
	}
	this.endEditUpdate();
	this.changed();
	if (this.isDataSetValueValid(this.dataValue))
	    this._lastValue = dojo.clone(this.dataValue);
	else
	    this.dataValue = "";
    },
    isDataSetValueValid: function(inData) {
	if (dojo.isArray(inData)) {
	    for (var i = 0; i < inData.length;i++) {
		if (inData[i] instanceof wm.Component) return false;
	    }
	    return true;
	} else {
	    return !(inData instanceof wm.Component);
	}
    },
    _onSetEditorValueFailed: function(inValue) {},
    getEditorValue: function() {
	if (!this.selectedItem)
	    return null;
	if (this._dataValueValid)
	    return this.dataValue;
	if (this.dataSet.getCount() == 0)
	    return this.dataValue;

	var result = [];
	if (this.dataField) {
	    var count = this.selectedItem.getCount();
	    for (var i = 0; i < count; i++) {
		result.push(this.selectedItem.isList ? this.selectedItem.getItem(i).getValue(this.dataField) : this.selectedItem.getValue(this.dataField));
	    }
	} else {
	    result = this.selectedItem.getData();
	    if (!dojo.isArray(result))
		result = [result];
	}
	if (!this._multiSelect && result) {
	    var result = result[0];
	    return (result || result === 0) ? result : this.makeEmptyValue();
	} else {
	    return result;
	}
    },
    validationEnabled: function() {return false;},
    getDisplayValue: function() {
	var value = "";
	var count = this.selectedItem.getCount();
	for (var i = 0; i < count; i++) {
	    if (i) value += ", ";
	    value += this._getDisplayData(this.selectedItem.isList ? this.selectedItem.getItem(i) : this.selectedItem);
	}
	return value;	
    },
    deselectAll: function() {
	this.clear();
    }

});

dojo.declare("wm.CheckboxSet", wm.DataSetEditor, {
    singleLine: false,
    _multiSelect: true,
    _focused: false,
    height: "100px",
    mobileHeight: "150px",
    editors: null,
    _dijitClass: "dijit.form.CheckBox",
    setDataSet: function(inDataSet) {
	this.inherited(arguments);
	this.createEditor();
    },
	connectEditor: function() {
	},
	destroyEditor: function() {
	    var editor = this.editor;
	    if (this.dijits) {
		dojo.forEach(this.dijits, function(d) {d.destroy();});
	    }
	    this.inherited(arguments);
	    dojo.destroy(editor);
	},

    _createEditor: function(inNode) {
	this.editor = inNode;
	this.editor.className = "wmCheckboxSet";


	var html = "";
	if (this.dataSet) {
	    var count = this.dataSet.getCount();
	    for (var i = 0; i < count; i++) {
		var item = this.dataSet.getItem(i);
		var id = this.getRuntimeId().replace(/\./g,"__") + "__" + i;
		//if (i) html += "<br/>";
		html += "<div class='wmCheckboxSetItem'><input id='" + id +"' name='" + this.getRuntimeId().replace(".","_") + "' dojoType='" + this._dijitClass + "' value='" + i + "'><label for='" + id + "'>" + this._getDisplayData(item) + "</label></div>";
	    }
	    this.editor.innerHTML = html;
	    this.dijits = dojo.parser.parse(this.editor);
	    if (wm.isMobile) {
		dojo.forEach(this.dijits, dojo.hitch(this, function(e,i) {
		    var a = document.createElement("div");
		    a.className = "wmcheckbox_x";
		    a.innerHTML = "X"
		    a.id = this.getRuntimeId() + "_x_" + i;
		    e.domNode.appendChild(a);
		    dojo.connect(a, "onclick", this, function(event) {
			e.set("checked", !e.checked);
		    });
		}));
	    }

	    var self = this;
	    dojo.forEach(this.dijits, function(dijit) {
		self.connect(dijit, "onChange", self, "changed");
		self.connect(dijit, "onFocus", self, "_onEditorFocused");
		self.connect(dijit, "onBlur", self, "_onEditorBlurred");
		dijit.domNode.style.lineHeight = "normal";
	    });
	}
	return this.editor;
    },
    _onEditorFocused: function() {
	if (!this._focused) {
	    this._focused = true;
	    this.focused();
	}
    },
    _onEditorBlurred: function() {
	/* Without a rather lengthy delay, going from one checkbox to the next has a time inbetween where focus is on document.body */
	wm.job(this.getRuntimeId() + ".Blurred", 100, dojo.hitch(this, function() {
	    if (this._focused && !dojo.isDescendant(document.activeElement, this.domNode)) {
		this._focused = false;
		this.blurred();
	    }
	}));
    },
    changed: function() {
	if (!this.dijits) return;
	var data = [];
	for (var i = 0; i < this.dijits.length; i++) {
	    if (this.dijits[i].checked) {
		data.push(this.dataSet.getItem(i));
	    }
	}
	this._dataValueValid = false;
	this.selectedItem.setData(data);
	this.inherited(arguments);
	this._dataValueValid = true;
    },
    destroy: function() {
	dojo.forEach(this.dijits, function(d) {d.destroy();});
	this.inherited(arguments);
    },

    setReadonly: function(inReadonly) {
	this.readonly = Boolean(inReadonly);
	if (!this.dijits) return;
	for (var i = 0; i < this.dijits.length; i++) {
	    var e = this.dijits[i];
	    var checked = e.get("checked");
	    e.set("disabled", this.readonly || this._disabled);
	    if (!checked) {
		e.domNode.parentNode.style.display = this.readonly ? "none" : "";
	    }
	}
    },
    setDisabled: function(inDisabled) {
	this.inherited(arguments);
	var d = this._disabled;
	if (!this.dijits) return;
	for (var i = 0; i < this.dijits.length; i++) {
	    var e = this.dijits[i];
	    e.set("disabled", this._disabled || this.readonly);
	}
    },
    deselectAll: function() {
	if (!this.dijits) return;
	for (var i = 0; i < this.dijits.length; i++) {
	    this.dijits[i].set("checked", false, false);
	    this.dijits[i]._lastValueReported = false;
	}
    },
    selectItem: function(rowIndex) {
	if (!this.dijits) return;
	this.dijits[rowIndex].set("checked", true, false);
	this.dijits[rowIndex]._lastValueReported = true;
    }
});

dojo.declare("wm.RadioSet", wm.CheckboxSet, {
    singleLine: false,
    _multiSelect: false,
    _dijitClass: "dijit.form.RadioButton",
    setDataSet: function(inDataSet) {
	this.inherited(arguments);
	this.createEditor();
    },
    changed: function() {
	if (!this.dijits) return;
	var data = [];
	for (var i = 0; i < this.dijits.length; i++) {
	    if (this.dijits[i].checked) {
		this.selectedItem.setData(this.dataSet.getItem(i));
		this._dataValueValid = false;
		wm.AbstractEditor.prototype.changed.call(this);
		this._dataValueValid = true;
		return;
	    }
	}
    }
});

/* TODO: onchange Events */
dojo.declare("wm.ListSet", wm.DataSetEditor, {
    singleLine: false,
    showSearchBar: true,
    _multiSelect: true,
    height: "100px",
    mobileHeight: "150px",
    editors: null,
    deleteColumn: false,
    deleteConfirm: "Are you sure you want to delete this?",
    prepare: function(inProps) {
	if (inProps && inProps.readonly) delete inProps.readonly;
	this.inherited(arguments);
    },
    setDataSet: function(inDataSet) {
	this.inherited(arguments);
	if (this.grid) {
	    var dataValue = this.dataValue;
	    this.grid.setDataSet(inDataSet);
	    this.setEditorValue(dataValue);
	}
    },
    changed: function() {
	this.selectedItem.setData(this.grid.selectedItem);
	this.inherited(arguments);
    },
    _onShowParent: function() {
	if (this.grid)
	    this.grid.renderDojoObj();
    },
    flow: function() {
	if (this.editor) {
	    this.editor.flow();
	}
    },
    setShowSearchBar: function(inShow) {
	this.showSearchBar = Boolean(inShow);
	if (this.searchBar) {
	    if (!this.searchBar) {
		this.createSearchBar();
		this.editor.moveControl(this.searchBar,0);
	    } else {
		this.searchBar.show();
	    }
	} else if (this.searchBar) {
	    this.searchBar.hide();
	}
    },
    createSearchBar: function() {
	    this.searchBar = new wm.Text({owner: this,
					   parent: this.editor,
					   width: "100%",
					   caption: "",
					   changeOnKey: true,
					   emptyValue: "emptyString",
					   name: "searchBar"});
	this.connect(this.searchBar, "onchange", this, "filterList");
    },
    filterList: function(inDisplayValue, inDataValue) {
	var count = this.grid.getRowCount();
	var rows = dojo.query(".dojoxGridRow", this.grid.domNode);
	var query = {};
	if (inDisplayValue)
	    query[this.grid.columns[0].field] = "*" + inDisplayValue + "*";
	this.grid.setQuery(query);
    },
    flow: function() {
	this.editor.flow();
    },
    _createEditor: function(inNode) {
	this.editor = new wm.Container({owner: this,
					parent: this,
					name: "ListSetContainer",
					width: "100%",
					height: "100%",
					layoutKind: "top-to-bottom",
					verticalAlign: "top",
					horizontalAlign: "left"});

	if (this.showSearchBar) {
	    this.createSearchBar();
	}
	
	    this.grid = new wm.DojoGrid({owner: this, 
					 parent: this.editor,
					   name: "editor",
					   width: "100%", 
					   height: "100%",
					   noHeader: true,
					   margin: "0",
					   padding: "0",
					   border: "0",
					 minWidth: 10,
					 deleteColumn: this.deleteColumn,
					 deleteConfirm: this.deleteConfirm,
					 selectionMode: this._multiSelect ? "multiple":"single"});
	if (this.grid.declaredClass == "wm.DojoGrid") {
	    this.grid.connect(this.grid, "renderDojoObj", this, "renderGrid");
	    this.grid.connect(this.grid, "onRowDeleted", this, "onRowDeleted");
	}
	    this.grid._isDesignLoaded = false;
	this.grid.setColumns([{show: true,
				    width: "100%",
				    field: this.displayExpression ? "_name" : this.displayField,
			       expression: this.displayExpression}]);
	if (this.dataSet) {
	    this.grid.setDataSet(this.dataSet);
	}
	return this.editor;
    },
    setReadonly: function(inValue){
	// does not have readonly mode
    },
    setDeleteColumn: function(inColumn) {
	this.deleteColumn = inColumn;
	if (this.grid) this.grid.setDeleteColumn(inColumn);
    },
    setDeleteConfirm: function(inConfirm) {
	this.deleteConfirm = inConfirm;
	if (this.grid) this.grid.deleteConfirm = inConfirm;
    },
    renderGrid: function() {
	if (this.grid.dojoObj) 
	    this.grid.dojoObj.scroller.contentNodes[0].parentNode.style.overflowX = "hidden";
    },
    connectEditor: function() {
	if (!this.$.binding) 
	    new wm.Binding({name: "binding", owner: this});
	this.selectedItem.$.binding.addWire("", "dataSet", this.name + ".editor.selectedItem");
	this.connect(this.grid, "onSelectionChange", this, "changed");
    },
    deselectAll: function() {
	this.grid.deselectAll();
    },
    selectItem: function(rowIndex) {
	this.grid.setSelectedRow(rowIndex);
    },

    setDisabled: function(inDisabled) {
	this.disabled = Boolean(inDisabled);
	var disabled = this.disabled || this._parentDisabled;
	if (this.grid) {
	    dojo.toggleClass(this.domNode, "Disabled", disabled);
	    this.grid.setSelectionMode(disabled ? "none" : "multiple");
	}
    },
    onRowDeleted: function(rowId, rowData) {}
});
