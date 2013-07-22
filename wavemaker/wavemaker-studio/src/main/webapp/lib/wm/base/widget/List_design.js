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

dojo.provide("wm.base.widget.List_design");
dojo.require("wm.base.widget.List");
dojo.require("wm.base.Control_design");


wm.Object.extendSchema(wm.VirtualList, {

    /* wm.List group; selection subgroup */
    selectionMode:     {group: "widgetName", subgroup: "selection", order: 40, options: ["single", "multiple", "extended", "none", "checkbox", "radio"], ignoreHint: "You need to use the 'editColumns' dialog to setup columns before this feature becomes available"},
    toggleSelect: {group: "widgetName", subgroup: "selection", order: 41, ignoreHint: "Only available for single selection mode"},
    selectFirstRow:{group: "widgetName", subgroup: "selection", order: 42},

    deleteColumn:      {group: "widgetName", subgroup: "behavior",  order: 10, advanced:1},
    deleteConfirm:     {group: "widgetName", subgroup: "confirmation", order: 10, advanced:1},


    /* Behaviors */
    primaryKeyFields:      {group: "widgetName", subgroup: "behavior",  order: 200, advanced:1, editor: "wm.prop.FieldList"},
    scrollToTopOnDataChange:{group: "widgetName", subgroup: "behavior", order: 201, advanced:1, type: "boolean", bindTarget:1},

    /* Ignored Group */
    box: { ignore: 1 },

    /* Common Group */
    manageHistory: {ignore:0},

    /* Methods group */
    getCount: {method:1, returns: "Number"},
    getItem: {method:1, returns: "wm.ListItem"},
    getItemByCallback: {method:1, returns: "wm.ListItem"},
    getItemByFieldName: {method:1, returns: "wm.ListItem"},
    removeItem: {method:1},
    setHeaderVisible: {method:1},
    clear: {method:1},
    getSelectedIndex: {method:1, returns: "Number"},
    selectByIndex: {method:1},
    select: {method:1},
    eventSelect: {method:1},
    eventDeselect: {method:1},
    deselectAll: {method:1}
});


// design-time only
wm.Object.extendSchema(wm.List, {
    /* widgetName group; data subgroup */
    columns:           {group: "widgetName", subgroup: "data", order:5, shortname: "Edit Columns", requiredGroup: 1, contextMenu: true, operation: "editColumns", nonlocalizable: true},


    dataSet:           {group: "widgetName", subgroup: "data", order: 1, requiredGroup: 1, bindTarget: 1, isList: true, simpleBindTarget: true, type: "wm.Variable", editor: "wm.prop.DataSetSelect", editorProps: {listMatch: true, widgetDataSets: true, allowAllTypes: true}},
    dataFields:        {group: "widgetName", subgroup: "data", order: 50, advanced:1},
    columnWidths:      {group: "widgetName", subgroup: "layout", order: 51, advanced:1},

    renderVisibleRowsOnly: {group: "widgetName", subgroup: "behavior", type: "boolean", advanced: 1},
    styleAsGrid:        {group: "widgetName", subgroup: "layout", type: "boolean", doNotPublish:1},
    rightNavArrow:      {group: "widgetName", subgroup: "layout", type: "boolean", doNotPublish:1},
    isNavigationMenu:   {group: "widgetName", subgroup: "behavior", type: "boolean"},
    autoSizeHeight:     {group: "widgetName", subgroup: "layout", type: "boolean", advanced: 1},

    /* Display group; layout subgroup */
    headerVisible: {group: "display", subgroup: "layout", order: 1}, /* Or does this go in the style group? or in the widgetName group? */

    /* Events group; flagged as advanced any event NOT compatable with DojoGrid */
    onSelectionChange: {order: 1, group: "events", advanced:1},
    onselect: {order: 2, advanced:1, group: "events", hidden:1},
    ondeselect: {order: 3, advanced:1, group: "events",hidden:1},
    onSelect: {order: 2, advanced:0, group: "events"},
    onDeselect: {order: 3, advanced:0, group: "events"},
    onclick: {order: 4, advanced:1, group: "events"},
    ondblclick: {order: 5, advanced:1, group: "events"},
    onsetdata: {order: 10, advanced:1, group: "events"},
    onformat: {order:15, advanced:1, group: "events"},
    onGridButtonClick: {order: 20, group: "events"},

    /* Hidden/bindSource group */
    selectedItem: {group: "widgetName", subgroup: "selection", readonly:1, bindSource: 1, bindTarget: 1, simpleBindProp: true, doc: 1,editor: "wm.prop.DataSetSelect", editorProps: {listMatch: false, widgetDataSets: true, allowAllTypes: true}},
    emptySelection: { ignore: true, bindSource: 1, type: "Boolean" },

    /* Operations group */
    updateNow: {group: "operation", operation:1},

    /* Hidden/ignored group */
    nextRowId: {ignore:1},
    avgHeight: {ignore:1},
    isRowSelected: {ignore:1},

    /* Methods group */
    getEmptySelection: {method:1, returns: "Boolean"},
    setColumnWidths: {method:1},
    //getDataItemCount: {method:1, returns: "Number"},
    setDataSet: {method:1},
    getItemData: {method:1, returns: "Object"},
    select: {method:1},
    selectByQuery: {method:1}

});

wm.List.description = "Displays list of items.";

wm.List.extend({

    set_styleAsGrid: function(inValue) {
        this.styleAsGrid = Boolean(inValue);
        this[this.styleAsGrid ? "removeUserClass" : "addUserClass"]("MobileListStyle");
    },
    set_rightNavArrow: function(inValue) {
        this.rightNavArrow = inValue;
        this.setColumns(this.columns);
        this.renderDojoObj();
    },
    set_dataSet: function(inDataSet) {
        if (!this._isDesignLoaded) return this.setDataSet(inDataSet); // needed for showing lists in the WidgetThemerPage's demoPanel
        var typeWas = this.dataSet && this.dataSet._dataSchema ? dojo.toJson(this.dataSet._dataSchema) : null;
        this.setDataSet(inDataSet);
        var typeIs = this.dataSet && this.dataSet._dataSchema ? dojo.toJson(this.dataSet._dataSchema) : null;

        /* Setup some default columns */
        if (typeIs && typeIs != typeWas) {
            this.updateColumnData(false);
            this.renderDojoObj();
        }
    },
    set_autoSizeHeight: function(inValue) {
        this.autoSizeHeight = Boolean(inValue);
        this.renderVisibleRowsOnly = !inValue;
        this._render();
    },
    set_renderVisibleRowsOnly: function(inValue) {
        this.autoSizeHeight = !inValue;
        this.renderVisibleRowsOnly = Boolean(inValue);
        this._render();
    },
    updateNow: function() {
        /* Running in CloudFoundry, set LiveLayoutReady to 0 if its -1 (CF-only flag that its ready but out of date) */
        if (studio.isLiveLayoutReady() == -1) studio.setLiveLayoutReady(0);
        this.update();
    },
    _formatterSignature: function(inValue, rowId, cellId, cellField, cellObj, rowObj) {},
    showMenuDialog: function(e) {
        if (!this.columns) {
            this.columns = [];
            this.updateColumnData(false);
        }
        studio.gridDesignerDialog.show();
        studio.gridDesignerDialog.page.setGrid(this);
    },
    set_selectionMode: function(inMode) {
        this.selectionMode = inMode;
        this.setSelectionMode(inMode);
        this.selectedItem.setIsList(inMode == "multiple");
        this._render();
    },
    updateColumnData: function(updating) {
        if (!dojo.isArray(this.columns)) {
            this.columns = [];
        }
        var defaultSchema = {
            dataValue: {
                type: this.dataSet.type
            }
        }; // this is the schema to use if there is no schema (i.e. the type is a literal)
        var viewFields;
        if (wm.typeManager.getLiveService(this.dataSet.type)) {
            viewFields = this.getViewFields();
        } else {
            viewFields = wm.typeManager.getFieldList(this.dataSet._dataSchema, "", 2);
        }
        /*
    if (!viewFields || viewFields.length == 0) {
        viewFields =  [];
        wm.forEachProperty(defaultSchema, function(item, fieldName) {
        item = dojo.clone(item);
        item.name = fieldName;
        viewFields.push(item);
        });
    }
    */

        var newcolumns = [];
        dojo.forEach(this.columns, dojo.hitch(this, function(col) {
            // we don't update custom fields
            if (col.isCustomField || col.field == "PHONE COLUMN") {
                newcolumns.push(col);
                return;
            }
            // If the column is still in the viewFields after whatever change happened, add it to newcolumns
            if (dojo.some(viewFields, dojo.hitch(this, function(field) {
                return field.dataIndex == col.field;
            }))) {
                newcolumns.push(col);
                return;
            }

            // col is no longer relevant
            return;
        }));

        var hasShowingColumn = false;
        dojo.forEach(newcolumns, function(col) {
            if (col.show) hasShowingColumn = true;
        });

        dojo.forEach(viewFields, function(f, i) {
            // if the column already exists, skip it
            if (dojo.some(newcolumns, function(item) {
                return item.field == f.dataIndex;
            })) return;

            var schema = wm.typeManager.getTypeSchema(this.dataSet.type) || defaultSchema;
            // don't show one-to-many subentities in the grid
            if (wm.typeManager.isPropInList(schema, f.dataIndex)) return;

            var align = 'left';
            var width = '100%';
            var formatFunc = '';
            if (f.displayType == 'Number') {
                align = this.styleAsGrid ? 'right' : 'left';
                width = '80px';
            } else if (f.displayType == 'Date') {
                width = '80px';
                formatFunc = 'wm_date_formatter';
            }

            newcolumns.push({
                show: updating && hasShowingColumn ? false : i < 15,
                field: f.dataIndex,
                title: wm.capitalize(f.dataIndex),
                width: width,
                displayType: f.displayType,
                align: align,
                formatFunc: formatFunc
            });
        }, this);


        this.columns = newcolumns;
        this.regenerateMobileColumn(this.columns);
        this.setColumns(this.columns);
    },
    getViewFields: function() {
        var fields = [];
        if (this.dataSet instanceof wm.LiveVariable) {
            fields = this.dataSet.getViewFields();
        } else if  (this.dataSet.name && this.dataSet.owner instanceof wm.LiveVariable) {
            fields = this.dataSet.owner.getViewFields();
        } else if (this.dataSet instanceof wm.Variable) {
            fields = wm.getDefaultView(this.dataSet.type) || [];
        }
        return fields;
    },

    editColumns: function() {
        return this.showMenuDialog();
    },
    set_columns: function(inColumns) {
        this.setColumns(inColumns);
        this._render();
    },
    listProperties: function() {
        var props = this.inherited(arguments);
        props.toggleSelect.ignoretmp = Boolean(this.selectionMode == "multiple");
        props.selectionMode.ignoretmp = Boolean(!this.columns);
        return props;
    },
    writeProps: function() {
        var props = this.inherited(arguments);
        if (props.columns && props.columns[0].controller) {
            props.columns.shift();
        }
        return props;
    },
    regenerateMobileColumn: function(inColumns) {

        /* STEP 1: Make sure that there IS a phone column */
        var hasPhoneColumn = false;
        var phoneIndex = -1;
        for (var i = 0; i < inColumns.length; i++) {
            if (inColumns[i].field == "PHONE COLUMN") {
                hasPhoneColumn = true;
                phoneIndex = i;
            } else if (inColumns[i].mobileColumn) {
                hasPhoneColumn = true;
            }
        }
        if (!hasPhoneColumn) {
            inColumns.push({
                show: false,
                // does NOT show on desktop
                field: "PHONE COLUMN",
                title: "-",
                width: "100%",
                align: "left",
                expression: "",
                mobileColumn: true
            });
            phoneIndex = inColumns.length-1;
        }

        // user has configured some other column to be their phone column, or has taken charge of editing the PHONE COLUMN
        if (phoneIndex == -1 || inColumns[phoneIndex].isCustomField) return;

        var mobileExpr = "";
        dojo.forEach(inColumns, function(column, i) {
            if (column.mobileColumn || !column.show) return;
            var rowText = "";

            var value;
            if (column.expression || column.formatFunc) {
                value = "${wm.runtimeId}.formatCell(\"" + column.field + "\", ${" + column.field + "}, ${this}, ${wm.rowId})";
            } else {
                value = "\${" + column.field + "}";
            }

            if (value) {
                if (!mobileExpr) {
                    mobileExpr = "\"<div class='MobileRowTitle'>\" +\n\"" + wm.capitalize(column.title) + ": \" + " + value + " +\n\"</div>\"\n\n";
                } else {
                    mobileExpr += "+ \"<div class='MobileRow'>\" +\n\"" + wm.capitalize(column.title) + ": \" + " + value + "\n + \"</div>\"\n\n";
                }
            }

        });
        inColumns[phoneIndex].expression = mobileExpr;
        return inColumns;

        }

});


wm.Object.extendSchema(wm.FocusableList, {
	focusEventTime: { ignore: 1 },
	nextFocus: {bindable: 1, type: "wm.FocusableList"},
	priorFocus: {bindable: 1, type: "wm.FocusableList"},
	hasFocus: {ignore:1},
	focusOnStart: {type: "boolean"},
	defaultFocusListIndex: {}

});

wm.Object.extendSchema(wm.FocusablePanel, {
	focusEventTime: { ignore: 1 }
});



