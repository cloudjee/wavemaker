/*
 * Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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
 
DataObjectsEditor.widgets = {
	columnListVar: ["wm.Variable", {type: "com.activegrid.tools.data.ColumnInfo"}, {}],
	relationshipsListVar: ["wm.Variable", {type: "com.activegrid.tools.data.RelatedInfo"}, {}],
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
	layoutBox: ["wm.Layout", {height: "1flex", layoutFlex: 1, width: "1flex", imageList: "smallToolbarImageList"}, {}, {
	    editorToolbar: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, border: "0", height: "29px", layoutKind: "left-to-right", border: "0,0,1,0", borderColor: "#959DAB"}, {}, {
			toolbarBtnHolder: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right", layoutFlex: 1, width: "100%", padding: "0,4"}, {}, {
				saveButton1: ["wm.ToolButton", {imageIndex: 8, title: "Save Entity", width: "24px", height: "100%", border: "", margin: "", hint: "Save Entity"}, {onclick: "saveAll"}],
				toolbarspacer1: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
				addEntityButton: ["wm.ToolButton", {imageIndex: 25, title: "New", width: "24px", height: "100%", border: "", margin: "", hint: "New"}, {onclick: "addButtonClick"}],
				removeButton: ["wm.ToolButton", {imageIndex: 0, title: "Delete", width: "24px", height: "100%", border: "", margin: "", hint: "Delete"}, {onclick: "removeButtonClick"}],
				toolbarspacer2: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
				importDBButton: ["wm.ToolButton", {imageIndex: 20, title: "Import Database", width: "24px", height: "100%", border: "", margin: "", hint: "Import Database"}, {onclick: "importDBButtonClick"}],
				dbSettingsButton: ["wm.ToolButton", {imageIndex: 21, title: "Database Connections", width: "24px", height: "100%", border: "", margin: "", hint: "Database Connections"}, {onclick: "dbSettingsButtonClick"}]
			}],
			logoBtmHolder: ["wm.Panel", {border: "0", width: "221px"}, {}]
		}],
		pages: ["wm.Layers", {layoutFlex: 1}, {oncanchange: "pagesCanChange"}, {
			objectquery: ["wm.Layer", {inFlow: true, layoutFlex: 1, layoutKind: "left-to-right", caption: "Objects"}, {}, {
				treePanel: ["wm.Panel", {border: "0", width: "182px", showing: false}, {}, {
					tree: ["wm.Tree", {height: "1flex", width: "1flex", layoutFlex: 1}, {onselect: "treeSelect", ondeselect: "treeDeselect"}]
				}],
				splitter: ["wm.Splitter", {layout: "left", border: "", layoutFlex: 0, showing: false}, {}],
				objectPages: ["wm.Layers", {layoutFlex: 1, border: ""}, {}, {
					defaultPage: ["wm.Layer", {inFlow: true, layoutFlex: 1, layoutKind: "left-to-right", caption: "Default"}, {}],
					objectPage: ["wm.Layer", {inFlow: false, layoutFlex: 1, layoutKind: "left-to-right", caption: "Objects"}, {}, {
						panel0: ["wm.Panel", {border: "0", height: "1flex", layoutFlex: 1, width: "1flex"}, {}, {
							panel001: ["wm.Panel", {_classes: {domNode: ["wmToolbar"]}, border: "1,0,0,0", borderColor: "#000000", height: "29px", layoutKind: "left-to-right"}, {}, {
								entityLabel: ["wm.Label", {_classes: {domNode: ["wm_Padding_6px"]}, width: "45px", border: "", caption: "General"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								entityLabelSpacer: ["wm.Spacer", {height: "24px", border: "", width: "16px"}, {}],
								saveButton: ["wm.ToolButton", {imageIndex: 8, title: "Save Entity", width: "24px", height: "100%", border: "", margin: "", hint: "Save Entity", showing: false}, {onclick: "saveAll"}],
								dataModelChangedWarningLabel: ["wm.Label", {width: "1flex", caption: "Data Model has been modified, please export the Data Model for changes to take effect.", layoutFlex: 1, height: "1flex", showing: false}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}]
							}],
							entityPanel: ["wm.Panel", {border: "0", height: "180px", layoutKind: "left-to-right", width: "800px"}, {}, {
								tableDetailPanel: ["wm.Panel", {border: "0", width: "400px"}, {}, {
								    tableDetailPackageName: ["wm.Text", {_classes: {domNode: ["StudioEditor"]},changeOnKey: true, caption: "Package", height: "26px", layoutKind: "left-to-right", readonly: true}, {onchange: "tableDetailPackageNameChange"}],
								    tableDetailSchemaName: ["wm.Text", {_classes: {domNode: ["StudioEditor"]},caption: "Schema", height: "26px", layoutKind: "left-to-right",changeOnKey:true, helpText: "The database schema container for this table such as public or dbo. Not used with all DB systems. "}, {onchange: "tableDetailSchemaNameChange"}],
								    tableDetailCatalogName: ["wm.Text", {_classes: {domNode: ["StudioEditor"]},caption: "Catalog", height: "26px", layoutKind: "left-to-right",changeOnKey: true, helpText: "The database catalog for this table. Can be the same as database name. Not used with all DB systems. Do not use when deploying to CloudFoundry with MySQL."}, {onchange: "tableDetailCatalogNameChange"}],
									spacer1: ["wm.Spacer", {height: "10px", border: ""}, {}],
								    tableDetailTableName: ["wm.Text", {_classes: {domNode: ["StudioEditor"]},caption: "Table Name", height: "26px", layoutKind: "left-to-right", changeOnKey: true, helpText: "The table name in the database. Must match table name in database."}, {onchange: "tableDetailTableNameChange"}],
								    tableDetailEntityName: ["wm.Text", {_classes: {domNode: ["StudioEditor"]},caption: "Entity Name", height: "26px", layoutKind: "left-to-right", changeOnKey: true, helpText: "The name of the table in the project datamodel. Can be different from table name in database."}, {onchange: "tableDetailEntityNameChange"}]
								}],
								tableSettingsPanel: ["wm.Panel", {padding: "5,0,0,0", width: "170px"}, {}, {
								    dynamicInsertCheckBox: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]},caption: "Dynamic Insert", display: "CheckBox", displayValue: "0", height: "26px", captionSize: "115px", layoutKind: "left-to-right", helpText: "Dynamic Insert: Don't include null values in insert statements"}, {onchange: "dynamicInsertChange"}],
								    dynamicUpdateCheckBox: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]},caption: "Dynamic Update", display: "CheckBox", displayValue: "0", height: "26px", captionSize: "115px", layoutKind: "left-to-right", helpText: "Dynamic Update: Don't include null values in update statements"}, {onchange: "dynamicUpdateChange"}],
								    refreshCheckBox: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]},caption: "Refresh Entity", display: "CheckBox", displayValue: "0", height: "26px", captionSize: "115px", layoutKind: "left-to-right", helpText: "Refresh Entity: Reload instance from database after insert/update"}, {onchange: "refreshChange"}],
								}],
								inlineHelpPanel: ["wm.Panel", {border: "0", borderColor: "#000000", layoutFlex: 1, width: "100%"}, {}, {
								}]
							}],
							panel002: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, border: "1,0,0,0", borderColor: "#959DAB", height: "29px", layoutKind: "left-to-right"}, {}, {
								tableLabel: ["wm.Label", {_classes: {domNode: ["wm_Padding_6px"]}, width: "80px", border: "", caption: "Columns"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								toolbarspacer3: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
								addColButton: ["wm.ToolButton", {imageIndex: 25, title: "Add Column", width: "24px", height: "100%", border: "", margin: "", hint: "Add Column"}, {onclick: "addColButtonClick"}],
								removeColButton: ["wm.ToolButton", {imageIndex: 0, title: "Delete Column", width: "24px", height: "100%", border: "", margin: "", hint: "Delete Column"}, {onclick: "removeCol"}]
							}],
							columnList: ["wm.DataGrid", {border: "", layoutFlex: 1}, {onCellClick: "columnsChange", onCanEdit: "columnListCanEdit"}, {
								name1: ["wm.DataGridColumn", {field: "name", index: 1, columnWidth: "150px", caption: "Name", editor: dojox.grid.editors.input}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								isPk: ["wm.DataGridColumn", {field: "isPk", index: 2, columnWidth: "100px", caption: "Primary Key", editor: dojox.grid.editors.bool}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								isFk: ["wm.DataGridColumn", {field: "isFk", index: 3, columnWidth: "100px", caption: "Foreign Key"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								sqlType: ["wm.DataGridColumn", {field: "sqlType", index: 4, columnWidth: "150px", caption: "Type", editor: dojox.grid.editors.select, selectOptions: ["big_decimal","big_integer","blob","boolean","byte","calendar","calendar_date","character","clob","currency","date","double","float","integer","locale","string","short","text","time","timestamp","timezone", "true_false", "yes_no"]}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								notNull: ["wm.DataGridColumn", {field: "notNull", index: 5, columnWidth: "100px", caption: "Not Null", editor: dojox.grid.editors.bool}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								length: ["wm.DataGridColumn", {field: "length", index: 6, columnWidth: "100px", caption: "Length", editor: dojox.grid.editors.input}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								precision: ["wm.DataGridColumn", {field: "precision", index: 7, columnWidth: "100px", caption: "Precision", editor: dojox.grid.editors.input}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								generator: ["wm.DataGridColumn", {field: "generator", index: 8, columnWidth: "100px", caption: "Generator", editor: dojox.grid.editors.select, selectOptions: [" ", "assigned","identity","sequence","native", "guid"]}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								param: ["wm.DataGridColumn", {field: "generatorParam", index: 9, columnWidth: "150px", caption: "Params", editor: dojox.grid.editors.input}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}]
							}],
							panel003: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, border: "1,0,0,0", borderColor: "#000000", height: "29px", layoutKind: "left-to-right", imageList: ""}, {}, {
								relationshipsLabel: ["wm.Label", {_classes: {domNode: ["wm_Padding_6px"]}, width: "80px", border: "", caption: "Relationships"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								toolbarspacer4: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
								addRelButton: ["wm.ToolButton", {imageIndex: 25, title: "Add Relationship", width: "24px", height: "100%", border: "", margin: "", hint: "Add Relationship"}, {onclick: "addRel"}],
								removeRelButton: ["wm.ToolButton", {imageIndex: 0, title: "Delete Relationship", width: "24px", height: "100%", border: "", margin: "", hint: "Delete Relationship"}, {onclick: "removeRel"}]
							}],
							relationshipsList: ["wm.DataGrid", {border: "", layoutFlex: 1}, {onCellClick: "relationshipsChange"}, {
								name1: ["wm.DataGridColumn", {field: "name", index: 1, columnWidth: "150px", caption: "Name", editor: dojox.grid.editors.input}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								relatedType: ["wm.DataGridColumn", {field: "relatedType", index: 2, columnWidth: "150px", caption: "Related Type", editor: dojox.grid.editors.select}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								cardinality: ["wm.DataGridColumn", {field: "cardinality", index: 3, columnWidth: "150px", caption: "Cardinality"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								tableName: ["wm.DataGridColumn", {field: "tableName", index: 4, columnWidth: "150px", caption: "Table Name"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								columnNames: ["wm.DataGridColumn", {field: "columnNames", index: 5, columnWidth: "150px", caption: "Column Names"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								cascadeOptions: ["wm.DataGridColumn", {field: "cascadeOptions", index: 5, columnWidth: "150px", caption: "Cascade Options",  editor: dojox.grid.editors.select, selectOptions: ["none", "save-update", "persist", "merge", "delete", "remove", "lock", "replicate", "evict", "refresh", "delete-orphan", "all"]}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}]
							}],
							changePropNamePanel: ["wm.Panel", {_classes: {domNode: ["wmChangeNamePanel"]}, padding: "4,0,0,0", border: "1,0,0,0", borderColor: "#000000", height: "28px", layoutKind: "left-to-right"}, {}, {
								propertyNameLabel: ["wm.Label", {width: "90px", border: "", caption: "Property Name:", padding: "4"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								propertyName: ["wm.Input", {caption: "", width: "200px", border: ""}, {onchange: "propertyNameChange"}]
							}]
						}]
					}]
				}]
			}]
		}],
		benchbevel4: ["wm.Bevel", {}, {}]
	}]
}