/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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


dojo.provide("wm.studio.pages.DataObjectsEditor.DataObjectsEditor");
wm.require("wm.DataGrid");
dojo.declare("DataObjectsEditor", wm.Page, {
    reservedWords: ["ACCESSIBLE",  "ADD", "ALL",
                    "ALTER",   "ANALYZE", "AND",
                    "AS",  "ASC", "ASENSITIVE",
"BEFORE","BETWEEN","BIGINT",
"BINARY","BLOB","BOTH",
"BY","CALL","CASCADE",
"CASE","CHANGE","CHAR",
"CHARACTER","CHECK","COLLATE",
"COLUMN","CONDITION","CONSTRAINT",
"CONTINUE","CONVERT","CREATE",
"CROSS","CURRENT_DATE","CURRENT_TIME",
"CURRENT_TIMESTAMP","CURRENT_USER","CURSOR",
"DATABASE","DATABASES","DAY_HOUR",
"DAY_MICROSECOND","DAY_MINUTE","DAY_SECOND",
"DEC","DECIMAL","DECLARE",
"DEFAULT","DELAYED","DELETE",
"DESC","DESCRIBE","DETERMINISTIC",
"DISTINCT","DISTINCTROW","DIV",
"DOUBLE","DROP","DUAL",
"EACH","ELSE","ELSEIF",
"ENCLOSED","ESCAPED","EXISTS",
"EXIT","EXPLAIN","FALSE",
"FETCH","FLOAT","FLOAT4",
"FLOAT8","FOR","FORCE",
"FOREIGN","FROM","FULLTEXT",
"GRANT","GROUP","HAVING",
"HIGH_PRIORITY","HOUR_MICROSECOND","HOUR_MINUTE",
"HOUR_SECOND","IF","IGNORE",
"IN","INDEX","INFILE",
"INNER","INOUT","INSENSITIVE",
"INSERT","INT","INT1",
"INT2","INT3","INT4",
"INT8","INTEGER","INTERVAL",
"INTO","IS","ITERATE",
"JOIN","KEY","KEYS",
"KILL","LEADING","LEAVE",
"LEFT","LIKE","LIMIT",
"LINEAR","LINES","LOAD",
"LOCALTIME","LOCALTIMESTAMP","LOCK",
"LONG","LONGBLOB","LONGTEXT",
"LOOP","LOW_PRIORITY","MASTER_SSL_VERIFY_SERVER_CERT",
"MATCH","MAXVALUE","MEDIUMBLOB",
"MEDIUMINT","MEDIUMTEXT","MIDDLEINT",
"MINUTE_MICROSECOND","MINUTE_SECOND","MOD",
"MODIFIES","NATURAL","NOT",
"NO_WRITE_TO_BINLOG","NULL","NUMERIC",
"ON","OPTIMIZE","OPTION",
"OPTIONALLY","OR","ORDER",
"OUT","OUTER","OUTFILE",
"PRECISION","PRIMARY","PROCEDURE",
"PURGE","RANGE","READ",
"READS","READ_WRITE","REAL",
"REFERENCES","REGEXP","RELEASE",
"RENAME","REPEAT","REPLACE",
"REQUIRE","RESIGNAL","RESTRICT",
"RETURN","REVOKE","RIGHT",
"RLIKE","SCHEMA","SCHEMAS",
"SECOND_MICROSECOND","SELECT","SENSITIVE",
"SEPARATOR","SET","SHOW",
"SIGNAL","SMALLINT","SPATIAL",
"SPECIFIC","SQL","SQLEXCEPTION",
"SQLSTATE","SQLWARNING","SQL_BIG_RESULT",
"SQL_CALC_FOUND_ROWS","SQL_SMALL_RESULT","SSL",
"STARTING","STRAIGHT_JOIN","TABLE",
"TERMINATED","THEN","TINYBLOB",
"TINYINT","TINYTEXT","TO",
"TRAILING","TRIGGER","TRUE",
"UNDO","UNION","UNIQUE",
"UNLOCK","UNSIGNED","UPDATE",
"USAGE","USE","USING","UTC_DATE","UTC_TIME","UTC_TIMESTAMP",
"VALUES","VARBINARY","VARCHAR",
"VARCHARACTER","VARYING","WHEN",
"WHERE","WHILE","WITH",
"WRITE","XOR","YEAR_MONTH",
"ZEROFILL","GENERAL","IGNORE_SERVER_IDS","MASTER_HEARTBEAT_PERIOD",
"MAXVALUE","RESIGNAL","SIGNAL",
"SLOW"],
        i18n: true,
    PK_ATTR: "isPk",
    FK_ATTR: "isFk",
    GENERATOR_ATTR: "generator",
    DEFAULT_PAGE: "defaultPage",
    OBJECT_PAGE: "objectPage",

    valueTypes: null, // dataModelName -> ValueTypeInfo
    currentDataModelName: null,
    currentEntity: null,
    currentEntityName: null,
        currentTableName: null,
    currentPropertyName: null,
    //propertiesAreDirty: false,
    //onlyEntityIsDirty: false,
    dataModelComponent: null,
    start: function() {
        this.dataObject = {name: "", table: ""};
        this.setDataTypes();
        this.update();
        this.subscribe("wm-project-changed", this, "update");
        this.connect(this.relationshipsList.dijit, "onApplyCellEdit", this, "setDirty");
        this.connect(this.columnList.dijit, "onApplyCellEdit", this, "setDirty");
        this.connect(this.columnList.dijit, "onApplyCellEdit", this, "onFieldNameChange");

        if (dojo.isIE <= 8) {
        wm.onidle(this, function() {
            this.saveButton1.setBorder("1");
            this.saveButton1.setBorder("0");
            this.addEntityButton.setBorder("1");
            this.addEntityButton.setBorder("0");
            this.removeButton.setBorder("1");
            this.removeButton.setBorder("0");
            this.dbSettingsButton.setBorder("1");
            this.dbSettingsButton.setBorder("0");
        });
        }
        if (studio.allowDisablingOfServiceItems && studio.isCloud()) {
            if (studio._runRequested) {
                this.toolbarBtnHolder.setDisabled(true);
            }
           this.subscribe("testRunStateChange", this, function() {
              this.toolbarBtnHolder.setDisabled(studio._runRequested);
           });
       }

    },
    onFieldNameChange: function(inValue, inRowIndex, inFieldIndex) {
        if (inFieldIndex === 0 && dojo.indexOf(this.reservedWords,inValue.toUpperCase()) != -1) {
            wm.onidle(this, function() {
                app.alert(inValue + " is a database reserved word, we recommend you chose a different name");
            });
        }
    },
    onShow: function() {
            //if (this.dataObject && this.dataObject.name) {
            var components = studio.application.getServerComponents();
            var componentIndex = wm.Array.indexOf(components, this.dataObject.name, function(c,name) {return c.name == name;});
            if (this.dataObject.table && componentIndex >= 0) {
            var node = components[componentIndex]._studioTreeNode;

            var kids = node.kids;
            for (var i = 0; i < kids.length; i++) {
                if (kids[i].component.entityName == this.dataObject.table) {
                kids[i].tree.deselect();
                kids[i].tree.addToSelection(kids[i]);
                return;
                }
            }
            node.tree.deselect();
            node.tree.addToSelection(node);
            } else if (this.dataModel && this.dataModel._studioTreeNode) {
            studio.tree.select(this.dataModel._studioTreeNode);
            }
        //}
    },


    update: function() {
        this.setSchemas();
        this.clearDetailDisplay();
        this.tree.clear();
        this.initData();
        setTimeout(dojo.hitch(this, "_selectNode"), 10);
    },
    setDataModel: function(inDataModel) {
        this.dataModel = inDataModel;
        this.currentDataModelName = this.dataModel.dataModelName;
    },
    setDataTypes: function() {
        // table columns
        wm.typeManager.addType("com.wavemaker.tools.data.ColumnInfo", {internal: true, fields: {
            name: {type: "java.lang.String", isObject: false, isList: false},
            isPk: {type: "boolean", isObject: false, isList: false},
            isFk: {type: "boolean", isObject: false, isList: false},
            notNull: {type: "boolean", isObject: false, isList: false},
            length: {type: "java.lang.Integer", isObject: false, isList: false},
            precision: {type: "java.lang.Integer", isObject: false, isList: false},
            generator: {type: "java.lang.String", isObject: false, isList: false},
            generatorParam: {type: "java.lang.String", isObject: false, isList: false},
            sqlType: {type: "java.lang.String", isObject: false, isList: false}
        }});
        // table relationships
        wm.typeManager.addType("com.wavemaker.tools.data.RelatedInfo", {internal: true, fields: {
            name: {type: "java.lang.String", isObject: false, isList: false},
            relatedType: {type: "java.lang.String", isObject: false, isList: false},
            cardinality: {type: "java.lang.String", isObject: false, isList: false},
            tableName: {type: "java.lang.String", isObject: false, isList: false},
            columnNames: {type: "java.lang.String", isObject: false, isList: false},
            cascadeOptions: {type: "java.lang.String", isObject: false, isList: false}
        }});
    },
    setSchemas: function() {
        // table columns
        this.columnListVar.setType("com.wavemaker.tools.data.ColumnInfo");
        this.columnList.setDataSet(this.columnListVar);
        // table relationships
        this.relationshipsListVar.setType("com.wavemaker.tools.data.RelatedInfo");
        this.relationshipsList.setDataSet(this.relationshipsListVar);
    },
    initData: function() {
        studio.dataService.requestSync(LOAD_DATA_TYPES_TREE_OP,
            null, dojo.hitch(this, "gotInitData"));
    },
    gotInitData: function(inData) {
        this.tree.renderData(inData.dataObjectsTree);
        this.valueTypes = inData.valueTypes;
    },
    reloadEntityNode: function(entity) {
        studio.dataService.requestSync("getTypesSubtree",
            [this.currentDataModelName],
            dojo.hitch(this, "gotDataToUpdateEntityNode", entity));
    },
    gotDataToUpdateEntityNode: function(entity, inData) {
        if (!entity) {
            entity = this.lastSelectedNode;
        }
        var entityNode = this.getEntityNode(entity);
        if (entityNode) {
            var entityData = null;
            for (var i in inData) {
                if (inData[i].data[1] == entityNode.data[1]) {
                    entityData = inData[i].children;
                    break;
                }
            }
            if (entityData) {
                var closed = entityNode.closed;

                // open all entityNode's children so
                // removeChildren will actually remove
                // node's kids
                entityNode.setOpen(true);
                entityNode.removeChildren();
                this.tree.renderDataNode(entityNode, entityData);
                entityNode.setOpen(!closed);
            }
        }
    },
    getConnectionsDialog: function() {
    var d = this.dbConnectDialog;
    if (d) {
        d.page.setup();
    } else {
        this.dbConnectDialog = d = new wm.PageDialog({
        _classes: {domNode: ["studiodialog"]},
        owner: app,
        pageName: "DBConnectionSettings",
        hideControls: true,
        width:720,
        height:510,
        title: this.getDictionaryItem("CONNECTIONS_DIALOG_TITLE")
        });
        this.connect(d, "onPageReady", dojo.hitch(d.page, "setup"));
    }
    return d;

    },
    dbSettingsButtonClick: function() {
        //studio.dbConnectionsClick();
        var d = this.getConnectionsDialog();
        d.show();
        d.page.setSelectedModel(this.currentDataModelName);
        d.page.modelIsDirty = this.dirty;
        d.page.openner = this;
        if (!this._connectReimport)
            this._connectReimport =this.connect(d.page, "_reImportResult", this, "reselectEntity");
    },
    resetPropertyEdit: function() {
        this.propertyName.setInputValue("");
        this.currentPropertyName = null;
    },
    clearDetailDisplay: function() {
        this.resetSelection();
        this.clearTableDetails();
        this.columnListVar.beginUpdate();
        this.columnListVar.setData([]);
        this.columnListVar.endUpdate();
        this.columnList.setDataSet(this.columnListVar);
        this.relationshipsListVar.beginUpdate();
        this.relationshipsListVar.setData([]);
        this.relationshipsListVar.endUpdate();
        this.relationshipsList.setDataSet(this.relationshipsListVar);
        setTimeout(dojo.hitch(this,'resetChanges'), 0);
    },
    getCachedData: function() {

    var relations = dojo.toJson(this.getRelatedProperties());
    var columns = "";
    var length = this.columnListVar.getCount();
    if (this.columnListVar.getData())
        for (var i = 0; i < length; i++) {
        var r = this.columnListVar.getItem(i);
        columns += "|" + i + ":" + dojo.toJson(r.getData());
        }


    return this.tableDetailSchemaName.getDataValue() + "|" +
        this.tableDetailCatalogName.getDataValue() + "|" +
        this.tableDetailEntityName.getDataValue() + "|" +
        this.tableDetailTableName.getDataValue() + "|" +
        this.tableDetailPackageName.getDataValue() + "|" +
        this.dynamicInsertCheckBox.getChecked() + "|" +
        this.dynamicUpdateCheckBox.getChecked() + "|" +
        this.refreshCheckBox.getChecked() + "|" +
        this.tableDetailTableName.getDataValue() + "|" +
        relations + "|" +
        columns;

    },
    setDirty: function() {
        wm.job(this.getRuntimeId() + "_hasChanged", 500, dojo.hitch(this, function() {
        if (this.isDestroyed) return;
        var changed = this._cachedData != this.getCachedData();
        var dirty = this.dirty = changed;

//      var oldCaption = this.owner.parent.caption;
//      var caption = (!changed ? "" : "<img class='StudioDirtyIcon'  src='images/blank.gif' /> ") +
//          oldCaption.replace(/^\<.*\>\s*/,"")
//      if (caption != this.owner.parent.caption) {
//          this.owner.parent.setCaption(caption);
//          studio.updateServicesDirtyTabIndicators();
//      }
        var layer = this.owner.parent;
        if (dojo.hasClass(layer.decorator.btns[layer.getIndex()], "StudioDirtyIcon")) {
            if (!dirty) {
            dojo.removeClass(layer.decorator.btns[layer.getIndex()], "StudioDirtyIcon");
            studio.updateServicesDirtyTabIndicators();
            }
        } else if (dirty) {
            dojo.addClass(layer.decorator.btns[layer.getIndex()], "StudioDirtyIcon");
            studio.updateServicesDirtyTabIndicators();
        }
        this.saveButton1.setDisabled(!changed);
        }));
    },
    /* getDirty, save, saveComplete are all common methods all services should provide so that studio can
     * interact with them
     */
    dirty: false,
    getDirty: function() {
    return this.dirty;
    },
    save: function() {
    this.saveEntity(null, false); // calls saveColumns and saveRelationships
    },
    getProgressIncrement: function(runtime) {
    return runtime ? 0 : 20; // saving data model is very slow...  1 tick is very fast; this is 20 times slower than that
    },

    clearTableDetails: function() {
        this.tableDetailSchemaName.setDataValue("");
        this.tableDetailCatalogName.setDataValue("");
        this.tableDetailTableName.setDataValue("");
        this.currentTableName = "";
        this.tableDetailEntityName.setDataValue("");
        this.tableDetailPackageName.setDataValue("");
        this.dynamicInsertCheckBox.setChecked(false);
        this.dynamicUpdateCheckBox.setChecked(false);
        this.refreshCheckBox.setChecked(false);
    },
    renderTableDetails: function(entity) {
        this.objectPages.setLayer(this.OBJECT_PAGE);
        this.tableDetailSchemaName.setDataValue(entity.schemaName);
        this.tableDetailCatalogName.setDataValue(entity.catalogName);
        this.tableDetailTableName.setDataValue(entity.tableName);
        this.currentTableName = entity.tableName;
        this.tableDetailEntityName.setDataValue(entity.entityName);
        this.tableDetailPackageName.setDataValue(entity.packageName);
        this.dynamicInsertCheckBox.setChecked(entity.dynamicInsert);
        this.dynamicUpdateCheckBox.setChecked(entity.dynamicUpdate);
        this.refreshCheckBox.setChecked(entity.refreshEntity);
    },
    isEntityDirty: function() {
        return this.tableDetailSchemaName.isDirty ||
        this.tableDetailCatalogName && this.tableDetailCatalogName.isDirty ||
        this.tableDetailTableName && this.tableDetailTableName.isDirty ||
        this.tableDetailPackageName && this.tableDetailPackageName.isDirty ||
        this.dynamicInsertCheckBox && this.dynamicInsertCheckBox.isDirty ||
        this.dynamicUpdateCheckBox && this.dynamicUpdateCheckBox.isDirty ||
        this.refreshCheckBox && this.refreshCheckBox.isDirty;
    },
    tableDetailSchemaNameChange: function(inSender) {
        this.setDirty();
    },
    tableDetailCatalogNameChange: function(inSender) {
        this.setDirty();
    },
    tableDetailTableNameChange: function() {
        this.setDirty();
    },
    tableDetailEntityNameChange: function() {
        this.setDirty();
    },
    tableDetailPackageNameChange: function(inSender) {
        this.setDirty();
    },
    dynamicInsertChange: function(inSender) {
        this.setDirty();
    },
    dynamicUpdateChange: function(inSender) {
        this.setDirty();
    },
    refreshChange: function(inSender) {
        this.setDirty();
    },
    columnsChange: function() {
        this.setDirty();
    },
    relationshipsChange: function() {
        this.setDirty();
    },
    propertyNameChange: function() {
        this.setDirty();
    },
    resetChanges: function() {
        this._cachedData = this.getCachedData();
        this.setDirty();
    },
    selectEntity: function(inDataModelName, inEntityName) {
        this.currentDataModelName = inDataModelName;
        this.setDataObject(inDataModelName, inEntityName);
    },
    reselectEntity: function() {
        var table = this.dataObject.table;
        this.dataObject.table = ""; // force it to refresh
        this.setDataObject(this.currentDataModelName,table);
    },
    treeSelect: function(inSender, inNode) {
        var d = inNode.data[0];
        var dmn = getDataModelName(inNode);
        var en = this.getEntityName(inNode);

        var changed = this.dataObject.name && this.dataObject.table && this.dataObjectSelectionChanged(dmn, en);
        if (changed) {
            if (this._askAboutLosingChanges()) {
                return;
            }
        }

        this.lastSelectedNode = inNode;
        this.currentDataModelName = dmn;

        //this.removeButton.setDisabled(false);

        this.resetPropertyEdit();

        if (d == ROOT_NODE) {
            this.currentDataModelName = null;
        }

        if (d == ROOT_NODE || d == DATA_MODEL_ROOT_NODE ||
            d == ENTITY_ROOT_NODE) {
            this.resetSelection();
            this.objectPages.setLayer(this.DEFAULT_PAGE);
            return;
        } else if (d == ENTITY_NODE) {
            this.columnList.dijit.selection.unselectAll();
        } else if (d == COLUMN_NODE) {
            var columnName = inNode.data[3];
            this.relationshipsList.dijit.selection.unselectAll();
            this.selectRow(this.columnList, columnName);
            this._setCurrentPropertyName(inNode);
        } else if (d == PROPERTY_NODE) {
            this._setCurrentPropertyName(inNode);
        } else if (d == RELATIONSHIP_NODE) {
            this.columnList.dijit.selection.unselectAll();
            this.selectRow(this.relationshipsList, inNode.data[1]);
        }

        this.objectPages.setLayer(this.OBJECT_PAGE);
        this.setDataObject(this.currentDataModelName,
            this.getEntityName(inNode));
        this._cachedData = this.getCachedData();
    },
    treeDeselect: function(inSender, inNode) {
        //this.removeButton.setDisabled(true);
    },
    expandCurrentTypesNode: function() {
        this.tree.forEachNode(dojo.hitch(this, function(inNode) {
            if (inNode.data && inNode.data[0] == ENTITY_ROOT_NODE) {
                if (inNode.parent.data[1] == this.currentDataModelName) {
                    inNode.setOpen(true);
                }
            }
        }));
    },
    selectTreeNode: function(data) {
        this.findAndSelectNode(this.tree.root, data);
    },
    selectEntityNode: function(entity) {
        setTimeout(dojo.hitch(this, "_selectCurrentEntityNode"), 100);
    },
    _selectCurrentEntityNode: function() {
        this.expandCurrentTypesNode();
        this.selectTreeNode(this.currentEntity.entityName);
    },
    findAndSelectNode: function(inNode, data) {
        var node = this.findNode(inNode, data);
        if (node != null) {
            this.tree.select(node);
        }
    },
    findNode: function(inNode, data) {
        if (inNode.data[1] == data) {
            return inNode;
        }
        for (var i = 0; i < inNode.kids.length; i++) {
            var rtn = this.findNode(inNode.kids[i], data);
            if (rtn != null) {
                return rtn;
            }
        }
    },
    constructEntity: function(entityName, tableName) {
        // if there's already another type node, default some values
        var otherTypeNode = null;
        var types = this.getDataModelTypeNodes();
        for (var i=0,j=types.length;i<j;i++) {
            if (types[i].data[1] != entityName) {
                otherTypeNode = types[i];
                break;
            }
        }

        var entity = {};

        if (otherTypeNode == null) {
            entity.packageName = DEFAULT_PACKAGE_ROOT +
                this.currentDataModelName.toLowerCase() + DATA_PACKAGE_NAME;
        } else {
            studio.dataService.requestSync(
                "getEntityWithoutProperties",
                [this.currentDataModelName,
                otherTypeNode.data[1]],
                dojo.hitch(this, "gotEntityAsTemplate",entity));
        }

        entity.entityName = entityName;
        if (tableName) {
            entity.tableName = tableName;
        } else {
            entity.tableName =
                this.getTableNameFromEntityName(entityName);
        }

        return entity;
    },
    gotEntityAsTemplate: function(entity, inData) {
        entity.schemaName = inData.schemaName;
        entity.catalogName = inData.catalogName;
        entity.packageName = inData.packageName;
        this.renderTableDetails(entity);
        this.getEntityOutputChanged(entity);
    },
    dataObjectSelectionChanged: function(inName, inTable) {
        var d = this.dataObject;
        return d && (d.name != inName || d.table != inTable);
    },
    setDataObject: function(inName, inTable) {
        var f = dojo.hitch(this, function() {
        var changed = this.dataObjectSelectionChanged(inName, inTable);
        this.dataObject.name = inName;
        this.dataObject.table = inTable;
        if (changed) {
            this.dataObjectChanged();
        }
        });
        if (!this._cachedData || this._cachedData == this.getCachedData())
        f();
        else {
        app.confirm(this.getDictionaryItem("CONFIRM_NO_SAVE"),
                false,f, function() {studio.tree.deselect();});
        }
    },
    getEntityOutputChanged: function(inData) {
        this.columnListVar.beginUpdate();
        this.columnListVar.setData(inData.columns || []);
        this.columnListVar.endUpdate();
        this.columnList.setDataSet(this.columnListVar);
        this.currentEntity = inData;
        this.currentEntityName = inData.entityName;
        this.resetChanges();
    },
    dataObjectChanged: function() {
        var d = this.dataObject, n = d.name, t = d.table;
        if (n || t) {
            var getEntityInput = [n || null, t || null];

            studio.dataService.requestSync("getEntity", getEntityInput, dojo.hitch(this, "getEntityResult"));

            /* Allow the progress bar to update its position with a moments idle time */
            wm.onidle(this, function() {
            studio.dataService.requestSync("getRelated", getEntityInput, dojo.hitch(this, "getRelatedResult"));
            });
        }
    },
    getEntityResult: function(inResponse) {
        this.renderTableDetails(inResponse);
        this.getEntityOutputChanged(inResponse);
    },
    getRelatedResult: function(inResponse) {
        this.relationshipsList._columns[1].selectOptions = this.getDataModelEntityNames();
        this.relationshipsListVar.beginUpdate();
        this.relationshipsListVar.setData(inResponse || []);
        this.relationshipsListVar.endUpdate();
        this.relationshipsList.setDataSet(this.relationshipsListVar);
            this.resetChanges();
    },
    typeUpdated: function(inData) {
        var s = this.tree.selected;
        if (!this.isTypeNode(s))
            return;
        var p = s.parent;
        p.removeChildren();
        this.tree.renderDataNode(p, inData);
    },
    selectRow: function(list, value) {
        for (var i = 0; i < list.dataSet.data._list.length; i++) {
            var it = list.dataSet.getItem(i);
            if (it.getValue("name") == value) {
                list.dijit.selection.select(i);
                break;
            }
        }
    },
    isTypeNode: function(inNode) {
        var p = inNode;
        while (p && p.contentNode) {
            if (p.data[0] == ENTITY_ROOT_NODE)
                return true;
            p = p.parent;
        }
    },
    getDataModelEntityNames: function(dataModelName) {
        var types = getDataModelTypeNames(this.tree, this.currentDataModelName, this.valueTypes);
        var allEntityNames = [];
        for (var shortName in types) {
            allEntityNames.push(shortName);
        }
        return allEntityNames;
    },
    getTypesNode: function(inNode) {
        return getAnnotatedNode(inNode, ENTITY_ROOT_NODE);
    },
    getEntityNode: function(inNode) {
        return getAnnotatedNode(inNode, ENTITY_NODE);
    },
    getEntityName: function(inNode) {
        return getNodeData(this.getEntityNode(inNode));
    },
    removeDataModelCompleted: function(inSender) {
        studio.updateFullServiceList();
        studio.endWait();
        var pageContainer = this.owner;
        var subtablayer = pageContainer.parent;
        var subtablayers = subtablayer.parent;
        var dblayer = subtablayers.parent;
        if (subtablayers.layers.length == 1)
        dblayer.hide();
        subtablayer.destroy();
    },
    removeDataModelFailed: function(inSender) {
        studio.endWait();
        this.clearDetailDisplay();
        this.initData();
    },
    saveRelationships: function(inSender) {
        this.relationshipsList.dijit.edit.apply();
        var relatedProperties = this.getRelatedProperties();
        studio.dataService.requestAsync("updateRelated",
                [this.currentDataModelName,
                this.tableDetailEntityName.getDataValue(),
                relatedProperties],
                dojo.hitch(this, "relUpdateCompleted"),
                dojo.hitch(this, "relUpdateError"));
    },
    detailRelSelect: function(inSender, inItem) {
        this.removeRelButton.setDisabled(false);
    },
    detailColDeselect: function(inSender, inItem) {

    },
    getRelatedProperties: function() {
        var rtn = [];
        var length = this.relationshipsListVar.getCount();
        for (var i = 0; i < length; i++) {
            var rel = this.relationshipsListVar.getData()[i];
            rel.fullyQualifiedType =
                this.currentEntity.packageName + "." +
                rel.relatedType;
            rtn.push(rel);
        }
        return rtn;
    },
    addRel: function(inSender) {
        if (this.columnList.dijit.selection.selectedIndex < 0) {
            app.alert(this.getDictionaryItem("ALERT_SELECT_KEY"));
            return;
        }
        this.applyGridEdits();
        var existingNames = [];
        var length = this.relationshipsListVar.getCount();
        for (var i = 0; i < length; i++) {
            existingNames.push(this.relationshipsListVar
                .getItem(i).getValue("name"));
        }

        var newRelName = "rel";
        newRelName = this.findUniqueName(existingNames, newRelName);

        var r = this.columnListVar.getItem(this.columnList.dijit.selection.selectedIndex);
        var newrel = {name: newRelName,
            relatedType: this.relationshipsList._columns[1].selectOptions[0],
            cardinality: r.getValue("notNull") ? ONE_TO_ONE : ONE_TO_ZERO_OR_ONE,
            tableName: this.tableDetailTableName.getDataValue(),
            columnNames: [r.getValue("name")]};

        this.relationshipsListVar.addItem(newrel);
        //this.relationshipsListVar.setItem(length, newrel);
        this.relationshipsList.setDataSet(this.relationshipsListVar);
        this.columnList.setDataSet(this.columnListVar);
        this.relationshipsChange();
    },
    removeRel: function(inSender) {
        var i = this.relationshipsList.dijit.selection.selectedIndex;
        if (i > -1) {
            var l = this.relationshipsListVar.getData();
            /*if (l[i].cardinality == ONE_TO_MANY) {
                alert("Please delete this relationship from " +
                    "the owning type " + l[i].relatedType);
                return;
            }*/
            this.relationshipsListVar.data._list.splice(i, 1);
            this.relationshipsList.setDataSet(this.relationshipsListVar);
            this.relationshipsChange();
        }
    },
    relUpdateCompleted: function(inSender) {
            studio.incrementSaveProgressBar(6); // second save step
            this.onSaveSuccess();
    },
    relUpdateError: function(inError) {
        var msg = this.getDictionaryItem("MESSAGE_RELATED_FAILED");
        if (inError.message) {
            msg += ": " + inError.message;
        }
        studio._saveErrors.push({owner: this,
                     message: msg});
        this.saveComplete();
    },
    saveComplete: function() {
        if (studio.loadingDialog.widgetToCover && studio.loadingDialog.widgetToCover.owner == this)
        studio.loadingDialog.hide();
    },
        onSaveSuccess: function() {
        this.clearDetailDisplay();
        this.initData();
        this.setForeignKeyOnColumns();
        studio.updateServices();
        this.selectEntityNode();
        studio.refreshServiceTree();
            //app.toastSuccess("Saved!");
        this.resetChanges(); // clears dirty flags
        this.saveComplete();
    },
    saveColumns: function(inSender) {
        // hack - set fk to false for all columns, add it back
        // to UI after update is complete
        var length = this.columnListVar.getCount();
        for (var i = 0; i < length; i++) {
            var r = this.columnListVar.getItem(i);
            r.setValue(this.FK_ATTR, false);
            this.columnListVar._setItem(i, r.getData());
        }
        try {
        this.columnList.dijit.edit.apply();
        } catch(e) {}


        var columns = this.columnListVar.getData();
        var entityName = this.tableDetailEntityName.getDataValue();

        // if precision and length are empty string, send null instead
        for (var i = 0, j = columns.length; i < j; i++) {
            this._resetPrecisionAndLength(columns[i]);
        }

        var props = this.getPropertiesForColumns();

        for (var i = 0, j = props.length; i < j; i++) {
            this._resetPrecisionAndLength(props[i].column);
        }

        studio.dataService.requestAsync("updateColumns",
                    [this.currentDataModelName,
                    entityName, columns, props],
                    dojo.hitch(this, "colUpdateCompleted"),
                    dojo.hitch(this, "colUpdateError"));
    },
    colUpdateCompleted: function(inSender) {
            studio.incrementSaveProgressBar(8); // first save step
        this.saveRelationships();
    },
    colUpdateError: function(inError) {
        var msg = "Failed to update columns";
        if (inError.message) {
            msg += ": " + inError.message;
        }
        studio._saveErrors.push({owner: this,
                     message: msg});
        this.saveComplete();
    },
    getPropertiesForColumns: function() {
        var n = this.findNode(this.tree.root, this.currentEntityName);
        if (n == null) {
            return [];
        }
        children = n._data.children;
        var rtn = [];
        var i = 0;
        for (var j=0,z=children.length;j<z;j++) {
            var child = children[j];

            if (child.data[0] == RELATIONSHIP_NODE) {
                continue;
            }
            rtn[i] = {name:null};
            this.populatePropertyInfo(rtn[i], child);
            i++;
        }
        return rtn;
    },
    populatePropertyInfo: function(propertyInfo, node) {
        propertyInfo.name = node.data[1];

        if (this.currentPropertyName != null &&
            propertyInfo.name == this.currentPropertyName) {
            propertyInfo.name = this.propertyName.getInputValue();
        }

        propertyInfo.type = node.data[2];
        propertyInfo.fullyQualifiedType = node.data[2];
        if (node.content.indexOf("* ") == 0) {
            propertyInfo.isId = true;
        } else if (node.content.indexOf("> ") == 0) {
            propertyInfo.isRelated = true;
            propertyInfo.isInverse = false;
        } else if (node.content.indexOf("< ") == 0) {
            propertyInfo.isRelated = true;
            propertyInfo.isInverse = true;
        }


        if (node.data[0] == COLUMN_NODE) {
            propertyInfo.column = this.getNamedColumn(node.data[3]);
        }

        if (node.children.length > 0) {
            propertyInfo.compositeProperties = [];
            for (var i in node.children) {
                propertyInfo.compositeProperties[i] = {name:null};
                this.populatePropertyInfo(propertyInfo.compositeProperties[i],
                            node.children[i]);
            }
        }
    },
    getNamedColumn: function(columnName) {
        var length = this.columnListVar.getCount();
        for (var i = 0; i < length; i++) {
            var c = this.columnListVar.getData()[i];
            if (c.name == columnName) {
                return c;
            }
        }
        return null;
    },
    saveAll: function(inSender) {
        studio.saveAll(this); // calls this.save
    },
/*
        exportClick: function(inSender) {
        var d = this.getConnectionsDialog();
        d.page.setSelectedModel(this.currentDataModelName);
        d.page.modelIsDirty = this.dirty;
        d.page.openner = this;
        d.page.exportBtnClick2();
    },
    */
    getEntityNameFromTableName: function(tableName) {
        return tableName.slice(0, 1).toUpperCase() + tableName.slice(1);
    },
    getTableNameFromEntityName: function(entityName) {
        return entityName.slice(0, 1).toLowerCase() + entityName.slice(1);
    },
        saveEntity: function(inSender, isNew) {

        var schemaName = this.tableDetailSchemaName.getDataValue();
        if (!schemaName) {
                schemaName = "";
        }
        var catalogName = this.tableDetailCatalogName.getDataValue();
        if (!catalogName) {
                catalogName = "";
        }

        var t = {entityName: this.tableDetailEntityName.getDataValue(),
            tableName: this.tableDetailTableName.getDataValue(),
            schemaName: schemaName,
            catalogName: catalogName,
            packageName: this.tableDetailPackageName.getDataValue(),
            dynamicInsert: this.dynamicInsertCheckBox.getChecked(),
            dynamicUpdate: this.dynamicUpdateCheckBox.getChecked(),
            refreshEntity: this.refreshCheckBox.getChecked()};
            this.updateEntity(t, isNew);
    },
    updateEntity: function(entity, isNew) {
            // var save = this.onlyEntityIsDirty;
            var save = this.isEntityDirty();
        studio.dataService.requestSync("updateEntity",
                        [this.currentDataModelName,
                        this.currentEntityName,
                        entity, save],
            dojo.hitch(this, "entityUpdateCompleted", entity),
            dojo.hitch(this, "entityUpdateError"));
    },
    entityUpdateCompleted: function(entity, inSender) {
        this.currentEntity = entity;
        var tn = this.tableDetailTableName.getDataValue();

        // update table name on all owning relationships
        var length = this.relationshipsListVar.getCount();
        for (var i = 0; i < length; i++) {
            var rel = this.relationshipsListVar.getData()[i];
            if (rel.cardinality == ONE_TO_ONE ||
                rel.cardinality == ONE_TO_ZERO_OR_ONE) {
                var r = this.relationshipsListVar.getItem(i);
                r.setValue("tableName", tn);
            }
        }

        //var saveColumns = this.propertiesAreDirty;
        var saveColumns = true; // honestly, if it takes a little longer to save, so what?

        this.resetChanges();

        if (saveColumns) {
            this.saveColumns();
        } else {
                this.onSaveSuccess();
        }
    },

    entityUpdateError: function(inError) {

        if (inError.message) {
            studio._saveErrors.push({owner: this,
                         message: this.getDictionaryItem("MESSAGE_UPDATE_FAILED", {error: inError.message})});
            this.saveComplete();
        }
    },
    detailColSelect: function(inSender, inItem) {
        this.addRelButton.setDisabled(false);
    },
    detailColDeselect: function(inSender, inItem) {
        this.addRelButton.setDisabled(true);
    },
    pagesCanChange: function() {
    },
    findUniqueName: function(existingNames, newName) {
        var l = {};
        dojo.forEach(existingNames, function(p) {
            l[p] = true;
        });
        return wm.findUniqueName(newName, [l]);
    },
    findUniqueEntityName: function() {
        return this.findUniqueName(this.getDataModelEntityNames(), "Table");
    },
    addButtonClick: function(inSender) {

        if (this._askAboutLosingChanges()) {
            return;
        }

        /*var s = this.tree.selected;
        if (s == null || s.data[0] == ROOT_NODE) {
            var f = prompt('New data model name');
            if (!f) {
                return;
            }
            studio.beginWait("Adding " + f);
            studio.dataService.requestAsync(NEW_DATA_MODEL_OP,
                [f],
                dojo.hitch(this, "newDataModelResult"),
                dojo.hitch(this, "newDataModelError"));
        } else {*/
            var types = this.getDataModelTypeNodes();
            var newEntityName = this.findUniqueEntityName();
                   app.prompt(this.getDictionaryItem("PROMPT_NEW_TABLE"), this.getTableNameFromEntityName(this.findUniqueEntityName()),
                                   dojo.hitch(this, function(t) {
                           var entity = this.constructEntity(
                           this.getEntityNameFromTableName(t), t);
                           this.clearDetailDisplay();
                           this.renderTableDetails(entity);
                                       studio.loadingDialog.widgetToCover = this.objectPages.getActiveLayer();
                       studio.loadingDialog.show();
                           this.getEntityOutputChanged(entity);

                           // add single column so we have a valid Hibernate
                           // mapping file
                           this.addColumn("id", true, false, true,
                                      DEFAULT_COL_LENGTH, DEFAULT_COL_PRECISION,
                                      IDENTITY_GENERATOR, HIBERNATE_INT_TYPE);

                           this.saveEntity(null, true);
                                   }));
        //}
    },
    newDataModelError: function(inError) {
        if (inError.message) {
        app.alert(this.getDictionaryItem("ALERT_CREATE_MODEL_FAILED", {error: inError.message}));
        }
        this.initData();
    },
    newDataModelResult: function() {
        this.clearDetailDisplay();
        this.pages.setLayer("objectquery");
        this.initData();
        studio.updateServices();
        this.setSchemas();
        this.resetChanges();
    },
    addColumn: function(name, isPk, isFk, notNull, length, precision,
        generator, sqlType)
    {
        var newcol = {name:name, isPk:isPk, isFk:isFk, notNull:notNull,
             length:length, precision:precision,
             generator:generator, sqlType:sqlType};
        this.columnListVar.addItem(newcol);
        /*this.columnListVar.setItem(
                this.columnListVar.getCount(), newcol);*/
        this.columnList.setDataSet(this.columnListVar);
        this.columnsChange();
    },
    removeButtonClick: function(inSender) {
        var dmn = this.currentDataModelName;
        var c = studio.tree.selected && studio.tree.selected.component;

        if (!c) {
            app.alert(this.getDictionaryItem("ALERT_SELECT_TO_DELETE"));
            return;
        }

        if (c instanceof wm.DataModel) {
            app.confirm(this.getDictionaryItem("CONFIRM_DELETE_MODEL", {modelName: dmn}), false,
                                dojo.hitch(this, function() {
                        studio.beginWait(this.getDictionaryItem("WAIT_DELETE_MODEL", {modelName: dmn}));
                        studio.dataService.requestAsync(
                    "removeDataModel",
                    [dmn],
                    dojo.hitch(this, "removeDataModelCompleted"),
                    dojo.hitch(this, "removeDataModelFailed"));
                                }));
        } else {
            var n = c.entityName;
            app.confirm(this.getDictionaryItem("CONFIRM_DELETE_ENTITY", {entityName: n}), false,
                                dojo.hitch(this, function() {
            var types = this.getDataModelTypeNodes();
            if (types == null) {
                return;
            }
            for (var i in types) {
                var t = types[i];
                if (t.data[0] == ENTITY_NODE && t.data[1] == n) {
                    studio.beginWait(this.getDictionaryItem("WAIT_DELETE_ENTITY", {entityName: n}));
                    studio.dataService.requestAsync(
                            "deleteEntity",
                            [dmn, n],
                            dojo.hitch(this, "deleteEntityCompleted"),
                            dojo.hitch(this, "deleteEntityFailed"));
                    return;
                }
            }
                                }));
        }
    },
    deleteEntityCompleted: function() {
        studio.endWait();
        this.clearDetailDisplay();
        this.initData();
        this.expandCurrentTypesNode();
            studio.updateServices();// this will update the database widgets in the palette, and remove the entity from the services tree
        this.saveComplete();
    },
    deleteEntityFailed: function(inError) {
        studio.endWait();
        app.alert(inError);
    },
    applyGridEdits: function() {
        this.columnList.dijit.edit.apply();
        this.relationshipsList.dijit.edit.apply();
    },
    addColButtonClick: function(inSender) {
        this.applyGridEdits();
        var defaultIsPk = true;
        var existingNames = [];
        var length = this.columnListVar.getCount();
        for (var i = 0; i < length; i++) {
            if (this.columnListVar.getItem(i)
                .getValue(this.PK_ATTR) == true) {
                defaultIsPk = false;
            }
            existingNames.push(this.columnListVar.getItem(i)
                .getValue("name"));
        }

        var newColName = "newcol";
        newColName = this.findUniqueName(existingNames, newColName);

        this.addColumn(newColName, defaultIsPk, false, true,
                DEFAULT_COL_LENGTH, DEFAULT_COL_PRECISION,
                "", HIBERNATE_INT_TYPE);
    },
    removeCol: function(inSender) {
        var i = this.columnList.dijit.selection.selectedIndex;
        if (i == -1) {
                return;
        }
        if (this.columnListVar.getData()[i].isFk) {
            app.alert(this.getDictionaryItem("ALERT_REMOVE_COLUMN_DELETE_FIRST"))
            return;
        }
        this.columnListVar.data._list.splice(i, 1);
        this.columnList.setDataSet(this.columnListVar);
        this.columnsChange();
    },
    getDataModelTypeNodes: function() {
        var name = this.currentDataModelName;
        return getDataModelTypeNodes(this.tree, name);
    },
    setForeignKeyOnColumns: function() {
        var fkColIndicies = []
        var length = this.relationshipsListVar.getCount();
        for (var i = 0; i < length; i++) {
            var rel = this.relationshipsListVar.getData()[i];
            for (var j in rel.columnNames) {
                var fkName = rel.columnNames[j];
                var k = this.setFkOnColumn(fkName);
                if (k) {
                    fkColIndicies.push(k);
                }
            }
        }

        // unset all other col fk settings
        var length = this.columnListVar.getCount();
        for (var i = 0; i < length; i++) {
            if (dojo.indexOf(fkColIndicies, i) == -1) {
                var c = this.columnListVar.getItem(i);
                c.setValue(this.FK_ATTR, false);
            }
        }
    },
    setFkOnColumn: function(colName) {
        var length = this.columnListVar.getCount();
        for (var i = 0; i < length; i++) {
            var c = this.columnListVar.getData()[i];
            if (c.name == colName) {
                var r = this.columnListVar.getItem(i);
                r.setValue(this.FK_ATTR, true);
                return i;
            }
        }
    },
    resetSelection: function() {
        this.dataObject = {name: "", table: ""};
    },
    columnListCanEdit: function(inSender, ioEdit, inCell, inRowIndex) {
        if (inCell.index < 7) {
            ioEdit.canEdit = true;
            return;
        }
        var row = this.columnListVar.getItem(inRowIndex);
        ioEdit.canEdit = row.getValue(this.PK_ATTR);
    },
    _setCurrentPropertyName: function(inNode) {
        this.currentPropertyName = inNode.data[1];
        this.propertyName.setInputValue(this.currentPropertyName);
    },
    getSelectedModelNode: function(inName) {
    try {
    var databases = this.tree.root.kids[0].kids;
    for (var i = 0; i < databases.length; i++) {
        if (databases[i].content == inName)
        return databases[i];
    }
    } catch(e) {}
    return null;
    },
    getLiveTablesNode: function(inNode) {
    var children = inNode.kids;
    for (var i = 0; i < children.length; i++) {
        if (children[i].content == "LiveTables")
        return children[i];
    }
    return null;
    },
    _selectNode: function() {
        var treeNode = studio.tree.selected;
        if (!treeNode) return;
        var comp = treeNode.component;

        while(!comp && treeNode && treeNode.parent) {
        treeNode = treeNode.parent;
        comp = treeNode.component;
        }
        var modelName = comp.dataModelName;
        var entityName = comp.entityName;
        var modelNode = this.getSelectedModelNode(modelName);
        if (!modelNode) return;
        var liveTableNode = this.getLiveTablesNode(modelNode);
        var entityNode;

        if (entityName) {
        for (i = 0; i < liveTableNode.kids.length; i++) {
            if (liveTableNode.kids[i].content == entityName) {
            entityNode = liveTableNode.kids[i];
            break;
            }
        }
        console.log("FOUND i=" + i);
        } else if (liveTableNode.kids.length > 0) {
        entityNode = liveTableNode.kids[0];
        entityName = entityNode.content;
        }

        if (entityNode)
        this.tree.select(entityNode);
        else
        this.tree.select(modelNode);
        //selectFirstChildNode(this.tree);
    },
    _askAboutLosingChanges: function() {
        if (this.getDirty()) {
            if (!askSaveChanges()) {
                this.tree._select(this.lastSelectedNode);
                return true;
            }
            this.resetChanges();
        }
        return false;
    },
    _resetPrecisionAndLength: function(column) {
        if (column == null) {
            return;
        }

        if (column.length == "") {
            column.length = null;
        }
        if (column.precision == "") {
            column.precision = null;
        }
    },
    _end: 0
});
