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

dojo.provide("wm.studio.pages.DataObjectsEditor.DataObjectsEditor");

dojo.declare("DataObjectsEditor", wm.Page, {

	PK_ATTR: "isPk",
	FK_ATTR: "isFk",
	GENERATOR_ATTR: "generator",
	DEFAULT_PAGE: "defaultPage",
	OBJECT_PAGE: "objectPage",

	valueTypes: null, // dataModelName -> ValueTypeInfo
	currentDataModelName: null,
	currentEntity: null,
	currentEntityName: null,
	currentPropertyName: null,
	propertiesAreDirty: false,
	onlyEntityIsDirty: false,
	dataModelComponent: null,
	start: function() {
		this.dataObject = {name: "", table: ""};
		this.setDataTypes();
		this.update();
		this.subscribe("wm-project-changed", this, "update");
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
	importDBButtonClick: function() {
		if (!studio.importDBDialog) {
			var d = studio.importDBDialog = new wm.PageDialog({
				owner: app,
				pageName: "ImportDatabase",
				hideControls: true,
			        width:700,
				height:550
			});
			d.onPageReady = dojo.hitch(d, function() {
				d.onShow = dojo.hitch(d.page, "update");
			})
		}
		studio.importDBDialog.show();
	},
	dbSettingsButtonClick: function() {
		//studio.dbConnectionsClick();
		var d = this.dbConnectDialog;
		if (d) {
			d.page.setup();
		} else {
			this.dbConnectDialog = d = new wm.PageDialog({
				owner: app,
				pageName: "DBConnectionSettings", 
				hideControls: true,
				width:700,
				height:510
			});
			this.connect(d, "onPageReady", dojo.hitch(d.page, "setup"));
		}
		d.show();
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
	clearTableDetails: function() {
		this.tableDetailSchemaName.setDataValue("");
		this.tableDetailCatalogName.setDataValue("");
		this.tableDetailTableName.setDataValue("");
		this.tableDetailEntityName.setDataValue("");
		this.tableDetailPackageName.setDataValue("");
		this.dynamicInsertCheckBox.components.editor.setChecked(false);
		this.dynamicUpdateCheckBox.components.editor.setChecked(false);
		this.refreshCheckBox.components.editor.setChecked(false);
	},
	renderTableDetails: function(entity) {
		this.tableDetailSchemaName.setDataValue(entity.schemaName);
		this.tableDetailCatalogName.setDataValue(entity.catalogName);
		this.tableDetailTableName.setDataValue(entity.tableName);
		this.tableDetailEntityName.setDataValue(entity.entityName);
		this.tableDetailPackageName.setDataValue(entity.packageName);
		this.dynamicInsertCheckBox.components.editor.setChecked(entity.dynamicInsert);
		this.dynamicUpdateCheckBox.components.editor.setChecked(entity.dynamicUpdate);
		this.refreshCheckBox.components.editor.setChecked(entity.refreshEntity);
	},
	tableDetailSchemaNameChange: function(inSender) {
		this.onlyEntityIsDirty = true;
	},
	tableDetailCatalogNameChange: function(inSender) {
		this.onlyEntityIsDirty = true;
	},
	tableDetailTableNameChange: function() {
		this.onlyEntityIsDirty = true;
	},
	tableDetailEntityNameChange: function() {
		// Force sending column and relationship info to the server
		// when renaming an Entity.
		this.propertiesAreDirty = true;
	},
	tableDetailPackageNameChange: function(inSender) {
		this.onlyEntityIsDirty = true;
	},
	dynamicInsertChange: function(inSender) {
		this.onlyEntityIsDirty = true;
	},
	dynamicUpdateChange: function(inSender) {
		this.onlyEntityIsDirty = true;
	},
	refreshChange: function(inSender) {
		this.onlyEntityIsDirty = true;
	},
	columnsChange: function() {
		this.propertiesAreDirty = true;
	},
	relationshipsChange: function() {
		this.propertiesAreDirty = true;
	},
	propertyNameChange: function() {
		this.propertiesAreDirty = true;
	},
	resetChanges: function() {
		this.onlyEntityIsDirty = false;
		this.propertiesAreDirty = false;
	},
	selectEntity: function(inDataModelName, inEntityName) {
		this.currentDataModelName = inDataModelName;
		this.setDataObject(inDataModelName, inEntityName);
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
				this.currentDataModelName + DATA_PACKAGE_NAME;
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
		var changed = this.dataObjectSelectionChanged(inName, inTable);
		this.dataObject.name = inName;
		this.dataObject.table = inTable;
		if (changed) {
			this.dataObjectChanged();
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
			studio.dataService.requestSync("getRelated", getEntityInput, dojo.hitch(this, "getRelatedResult"));
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
		for (var i = 0; i < list.dataSet.data.list.length; i++) {
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
		studio.endWait();
		studio.updateServices();
		this.setSchemas();
		this.objectPages.setLayer(this.DEFAULT_PAGE);
		this.clearDetailDisplay();
		this.initData();
		studio.application.removeServerComponent(this.dataModel);
		studio.application.loadServerComponents("wm.Query");
		studio.refreshWidgetsTree();
	},
	removeDataModelFailed: function(inSender) {
		studio.endWait();
		this.clearDetailDisplay();
		this.initData();
	},
	saveRelationships: function(inSender) {
		this.relationshipsList.dijit.edit.apply();
		var relatedProperties = this.getRelatedProperties();
		studio.dataService.requestSync("updateRelated", 
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
			app.alert("Please select a column to use as foreign key first");
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
			this.relationshipsListVar.data.list.splice(i, 1);
			this.relationshipsList.setDataSet(this.relationshipsListVar);
			this.relationshipsChange();
		}
	},
	relUpdateCompleted: function(inSender) {
		this.saveAllCompleted();
	},
	relUpdateError: function(inError) {
		studio.endWait();
		var msg = "Failed to update related";
		if (inError.message) {
			msg += ": " + inError.message;
		}
		app.alert(msg);
	},
	saveAllCompleted: function() {
		this.clearDetailDisplay();
		this.initData();
		this.setForeignKeyOnColumns();
		studio.updateServices();
		studio.endWait();
		this.selectEntityNode();
		studio.refreshWidgetsTree();
            app.toastSuccess("Saved!");
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
		this.columnList.dijit.edit.apply();



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

		studio.dataService.requestSync("updateColumns", 
					[this.currentDataModelName, 
					entityName, columns, props],
					dojo.hitch(this, "colUpdateCompleted"),
					dojo.hitch(this, "colUpdateError"));
	},
	colUpdateCompleted: function(inSender) {
		this.saveRelationships();
	},
	colUpdateError: function(inError) {
		studio.endWait();
		var msg = "Failed to update columns";
		if (inError.message) {
			msg += ": " + inError.message;
		}
		app.alert(msg);
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
		studio.beginWait("Saving " + this.currentDataModelName);
		this.saveEntity(); // calls saveColumns and saveRelationships
	},
	getEntityNameFromTableName: function(tableName) {
		return tableName.slice(0, 1).toUpperCase() + tableName.slice(1);
	},
	getTableNameFromEntityName: function(entityName) {
		return entityName.slice(0, 1).toLowerCase() + entityName.slice(1);
	},
	saveEntity: function(inSender) {

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
			dynamicInsert: this.dynamicInsertCheckBox.components.editor.getChecked(),
			dynamicUpdate: this.dynamicUpdateCheckBox.components.editor.getChecked(),
			refreshEntity: this.refreshCheckBox.components.editor.getChecked()};
		this.updateEntity(t);
	},
	updateEntity: function(entity) {
		var save = this.onlyEntityIsDirty;
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

		//var saveColumns = !this.onlyEntityIsDirty;
		var saveColumns = this.propertiesAreDirty;

		this.resetChanges();

		if (saveColumns) {
			this.saveColumns();
		} else {
			this.saveAllCompleted();
		}
	},
	isDirty: function() {
		return this.onlyEntityIsDirty || this.propertiesAreDirty;
	},
	entityUpdateError: function(inError) {
		studio.endWait();
		if (inError.message) {
			app.alert("Failed to update entity: " + inError.message);
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
	                app.prompt('New table name', this.getTableNameFromEntityName(this.findUniqueEntityName()), 
                                   dojo.hitch(this, function(t) {
			               var entity = this.constructEntity(
				           this.getEntityNameFromTableName(t), t);
			               this.clearDetailDisplay();
			               this.renderTableDetails(entity);
                                       
			               this.getEntityOutputChanged(entity);
                                       
			               // add single column so we have a valid Hibernate 
			               // mapping file
			               this.addColumn("id", true, false, true, 
				                      DEFAULT_COL_LENGTH, DEFAULT_COL_PRECISION, 
				                      IDENTITY_GENERATOR, HIBERNATE_INT_TYPE);
                                       
			               this.saveAll();
                                   }));
		//}
	},
	newDataModelError: function(inError) {
		studio.endWait();
		if (inError.message) {
			app.alert("Failed to create datamodel: " + inError.message);
		}
		this.initData();
	},
	newDataModelResult: function() {
		studio.endWait();
		this.clearDetailDisplay();
		this.pages.setLayer("objectquery");
		this.initData();
		studio.updateServices();
		this.setSchemas();
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
			app.alert("Please select an entity or a data model to delete.");
			return;
		}

		if (c instanceof wm.DataModel) {
		    app.confirm('Are you sure you want to delete data model "' + dmn + '"?', false,
                                dojo.hitch(this, function() {
			            studio.beginWait("Removing " + dmn);
			            studio.dataService.requestAsync(
					"removeDataModel", 
					[dmn],
					dojo.hitch(this, "removeDataModelCompleted"), 
					dojo.hitch(this, "removeDataModelFailed"));
                                }));
		} else {
			var n = c.entityName;
		    app.confirm('Are you sure you want to delete entity "' + n + '"?', false, 
                                dojo.hitch(this, function() {
			var types = this.getDataModelTypeNodes();
			if (types == null) {
				return;
			}
			for (var i in types) {
				var t = types[i];
				if (t.data[0] == ENTITY_NODE && t.data[1] == n) {
					studio.beginWait("Removing " + n);
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
		this.saveAllCompleted();
	},
	deleteEntityFailed: function() {
		studio.endWait();
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
			app.alert("Please delete the relationship using this " +
				"foreign key column first");
			return;
		}
		this.columnListVar.data.list.splice(i, 1);
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
	_selectNode: function() {
		selectFirstChildNode(this.tree);
	},
	_askAboutLosingChanges: function() {
		if (this.isDirty()) {
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
