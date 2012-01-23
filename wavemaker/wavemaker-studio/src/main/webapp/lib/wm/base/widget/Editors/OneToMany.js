/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

/* WARNING: This gets its data using synchronous lazyloading, and as such users should be warned not to use it with large datasets without picking a custom dataSet */

dojo.provide("wm.base.widget.Editors.OneToMany");
dojo.require("wm.base.widget.Editors.DataSetEditor");

dojo.declare("wm.OneToMany", wm.ListSet, {
    relationshipName: "",
    _multiSelect: false,
    showSearchBar: false,
    dataField: "",
    autoDataSet: true,
    startUpdate: true,
    deleteColumn: false,
    noItemsLabel: "No data",
/*
    addButtonWidth: "50px",
    addButtonCaption: "Add",
    */
    // this doesn't get its value set, it gets a dataSet only
    setEditorValue: function(inValue) {},
    calcIsDirty: function() {return false;},
    _createEditor: function(inNode) {
	var e = this.inherited(arguments);
	this.grid.setShowing(false);
	this.noRelatedObjectsLabel = new wm.Label({parent: e,
						   owner: this,
						   showing: true,
						   caption: this.noItemsLabel,
						   width: "100%"});	
	return e;
    },
    setDataSet: function(inValue) {
	if (this.grid) {
	    if (inValue && inValue.getCount()) {
		this.grid.show();
		this.noRelatedObjectsLabel.hide();
	    } else {
		this.grid.hide();
		this.noRelatedObjectsLabel.show();
	    }
	}
	this.inherited(arguments);
    },
    onRowDeleted: function(rowId, rowData) {
	this.selectedItem.setData(rowData); // so that users can easily bind a liveVariable's sourceData to this.selectedItem, and fire an update onRowDeleted
/*
	if (!this.liveVariable) {
	    this.liveVariable = new wm.LiveVariable({owner: this,
						     name: "liveVariable",
						     type: this.dataSet.type,
						     operation: "update",
						     autoUpdate: false,
						     autoStart: false
						    });
	}
	rowData[this.relationshipName] = {};
	this.liveVariable.setSourceData(rowData);
	this.liveVariable.update();
	*/
    }/*,

    createSearchBar: function() {
	if (this.formField && this.getParentForm()) {
	    if (!this.$.searchBarPanel) {
		this.searchBarPanel = new wm.Panel({
		    height: "28px",
		    width: "100%",
		    name: "searchBarPanel",
		    owner: this,
		    parent: this.editor,
		    layoutKind: "left-to-right",
		    horizontalAlign: "left",
		    verticalAlign: "top"		    
		});
		if (!this.addBarDisplayField) {
		    if (this.displayField) {
			this.addBarDisplayField = this.displayField;
		    } else if (this.displayExpression) {
			this.addBarDisplayField = this.displayExpression.replace(/^.*?\$\{(.*?)\}.*$/, "$1");
		    }
		}

		this.searchBar = new wm.FilteringLookup({owner: this,
							 parent: this.searchBarPanel,
							 formField: this.formField,
							 displayField: this.addBarDisplayField,
							  width: "100%",
							  caption: "",
							  placeHolder: "Add to list",
							  name: "searchBar",
							  onEnterKeyPress: dojo.hitch(this, "addItem")});
		this._addButton = new wm.Button({owner: this,
						 parent: this.searchBarPanel,
						 width: this.addButtonWidth,
						 height: "100%",
						 margin: "2",
						 caption: this.addButtonCaption,
						 onclick: dojo.hitch(this, "addItem")});

	    }
	}
    },
	// this is no good: grid writes an item not a related item
    addItem: function() {
	var value = this.searchBar.selectedItem.getData();
	if (value) {
	    this.grid.addRow(value,true);
	    wm.onidle(this, function() {
		this.grid.writeSelectedItem();
	    });
	}
    }
	*/
});

