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
dojo.provide("wm.studio.pages.QueryEditor.QueryEditor");

dojo.declare("QueryEditor", wm.Page, {

	EOL: "\n",
	QUERY_COMMENT: "--",

	//selectedNode: null,
	selectedQueryName: null,
	dataModelName: null,
	valueTypes: null,
	primitivesLongNameLookup: null,
	primitivesShortNameLookup: null,
	typesLongNameLookup: {},
	typesShortNameLookup: {},
	hasChanges: false,
        _startCalled: false,
	start: function() {
            if (this._startCalled) return;
                this._startCalled = true;
		this.subscribe("wm-project-changed", this, "update");
		this.update();
	},
	update: function() {
		//this.selectedNode = null;
		this.selectedQueryName = null;
		this._enableAll(false);
		this._clear();
		this.updateDataModelInput();
		//this._loadQueries();
	},
	saveQuery: function(inSender) {
		if (this._canSaveQuery()) {
			this._saveQuery();
		}
		else {
			app.alert("Enter query details before saving.");
		}
	},
	removeQuery: function(inSender) {
		//var n = this.queriesTree.selected;
		//if (!n) {
		//	return;
		//}
		//var d = n.data[0];
		//if (d == ROOT_NODE || d == QUERY_ROOT_NODE) {
		//	return;
		//}

		var name = this.selectedQueryName;
		if (!name)
			return;

            app.confirm('Are you sure you want to delete "' + name + '"?', false, dojo.hitch(this, "_removeQuery"), null);
/*
		app.pageDialog.showPage("GenericDialog",true,350,140);
		app.pageDialog.page.setupPage("Confirm...", 'Are you sure you want to delete "' + name + '"?');
		app.pageDialog.page.setupButton(1, "OK", dojo.hitch(this, "_removeQuery"));
		app.pageDialog.page.setupButton(2, "Cancel", function() {app.pageDialog.dismiss();});
                */
	},
	_removeQuery: function() {
		var name = this.selectedQueryName;
	    //app.pageDialog.dismiss();

		//this.selectedNode = null;
		this.selectedQueryName = null;

		studio.beginWait("Deleting Query...");
		studio.dataService.requestSync(
			REMOVE_QUERY_OP, [this.dataModelName, name],
			dojo.hitch(this, "_removedQuery"));
	},
	addQuery: function(inSender) {
            if (!this._startCalled) this.start(); // fixes IE sequencing problem where selectQuery is called prior to page.start()
		this.query = null;
		this._clear();
		this._enableAll(true);
		this.saveQueryBtn.setDisabled(false);
		this.queryDataModelInput.setDisabled(false);
	},
	selectQuery: function(inQuery) {
            if (!this._startCalled) this.start(); // fixes IE sequencing problem where selectQuery is called prior to page.start()
		this.query = inQuery;
		this.dataModelName = this.query.dataModelName;
		this.selectedQueryName = this.query.queryName;
		this.updateDataModelInput();

		this._clear();

		this._loadTypes();

		this._enableAll(true);
		this.saveQueryBtn.setDisabled(true);

		var args = [this.dataModelName, this.selectedQueryName];
		studio.dataService.requestAsync(LOAD_QUERY_OP, args, 
			dojo.hitch(this, "_getQueryResult"));
	},
	/*queriesTreeSelected: function(inSender, inNode) {

		if (inNode != this.selectedNode && this.isDirty()) {
			if (!askSaveChanges()) {
				this.queriesTree._select(this.selectedNode);
				return;
			}
		}

		this.selectedNode = inNode;

		this.dataModelName = getDataModelName(inNode);

		this._clear();

		this._loadTypes();

		var d = inNode.data[0];
		if (d == ROOT_NODE || d == DATA_MODEL_ROOT_NODE || 
			d == QUERY_ROOT_NODE) {
			this._enableAll(false);
			this.newQueryBtn.setDisabled(false);
			return;
		}
		this._enableAll(true);
		this.saveQueryBtn.setDisabled(true);

		var args = [this.dataModelName, inNode.data[1]];
		studio.dataService.requestAsync(LOAD_QUERY_OP, args, 
			dojo.hitch(this, "_getQueryResult"));
	},*/
	queryNameKeyPress: function(inSender) {
		setTimeout(dojo.hitch(this, "queryNameChanged"), 0);		
	},
	queryNameChanged: function(inSender) {
		this._queryChanged();
	},
	queryCommentKeyPress: function(inSender) {
		setTimeout(dojo.hitch(this, "queryCommentChanged"), 0);		
	},
	queryCommentChanged: function(inSender) {
		this._queryChanged();
	},
	queryTextAreaKeyPress: function(inSender) {
		setTimeout(dojo.hitch(this, "queryTextAreaChanged"), 0);
	},
	queryTextAreaChanged: function(inSender) {
		this._queryChanged();
		this.runQueryBtn.setDisabled(false);
	},
	singleResultKeyPress: function(inSender) {
		setTimeout(dojo.hitch(this, "singleResultChanged"), 0);		
	},
	singleResultChanged: function(inSender) {
		this._queryChanged();
	},
	runQuery: function(inSender) {
		//this.bindValue();
		if (this._getQueryValue() == "") {
		    app.alert("Nothing to run, please enter a query");
		    return;
		}
		this.emptyResultSetLabel.setShowing(false);
		this.queryOutputList.setShowing(true);
		for (var i in DML_OPERATIONS) {
			var op = DML_OPERATIONS[i];
			if (this._getQueryValue().toLowerCase().indexOf(op) == 0) {
				if (!confirm('Are you sure you run a DML operation?')) {
					return;
				}
			}
		}
		this.queryOutputList.clear();
		var runQueryInput = [];
		var bindParamValues = this._buildBindParms();
		//var bindParamValues = null;
		//if (this.bindParamInput.getDataValue()) {
		//	bindParamValues = this.bindParamInput.getDataValue();
		//}
		runQueryInput = [
			this.dataModelName,
			this._getQueryValue(),
			this._getQueryInputs(),
			bindParamValues,
			this.maxResultsInput.getDataValue()];
		studio.beginWait("Running Query...");
		studio.dataService.requestAsync(RUN_QUERY_OP, runQueryInput, 
			dojo.hitch(this, "_runQueryResult"), 
			dojo.hitch(this, "_runQueryError"));
	},
	_buildBindParms: function() {
		var parms = "";
		for (var i = 0; i <	this.queryInputsList._data.length; i++) {
			var list = this.queryInputsList._data[i].list;
			var val = this.queryInputsList._data[i].value;

			if (val == null || val == undefined || val.length == 0) continue;
			if (list) val = "[" + val + "]";
			(i == 0) ? (parms = parms + val) : (parms = parms + ", " + val);
		}
		if (parms.length == 0)
			return null;
		else
			return parms;
	},
	isDirty: function() {
		return this.hasChanges;
	},
	updateDataModelInput: function() {
		var names = []
		var cs = studio.application && studio.application.getServerComponents();
		for (var i in cs) {
			var c = cs[i];
			if (c.declaredClass == "wm.DataModel") {
				names.push(c.dataModelName);
			} else if (c.id == SALESFORCE_SERVICE) {
				names.push(c.id);
			}
		}
		this.queryDataModelInput.editor.setOptions(names.join());
		if (names.length)
			this.queryDataModelInput.setDataValue(this.dataModelName || names[0]);
	},
	_saveQuery: function() {
		var name = dojo.string.trim(this.queryNameInput.getDataValue());
		
		// check existing query with the same name
		var cs = studio.application.getServerComponents();
		for (var i in cs) {
			var c = cs[i];
			if (c.declaredClass == "wm.Query" && c.dataModelName == this.dataModelName && c.queryName == name) {
                            app.confirm("Overwrite existing query \"" + name + "\"?", false, dojo.hitch(this, "_saveQuery2"), null);
/*
				app.pageDialog.showPage("GenericDialog",true,350,140);
				app.pageDialog.page.setupPage("Confirm...", 'Overwrite existing query "' + name + '"?');
				app.pageDialog.page.setupButton(1, "Overwrite", dojo.hitch(this, "_saveQuery2"));
				app.pageDialog.page.setupButton(2, "Cancel", function() {app.pageDialog.dismiss();});
                                */
				return;
			} 
		}
		this._saveQuery2();
	},
	_saveQuery2: function() {
	    //app.pageDialog.dismiss();
		var name = dojo.string.trim(this.queryNameInput.getDataValue());
		if (this.query) {
		  this.query.newName = name;
		}
		studio.beginWait("Saving Query: " + name);

		this._checkQuery();
	},
	_checkQuery: function() {
		var bindParamValues = this._buildBindParms();
		//var bindParamValues = null;
		//if (this.bindParamInput.getDataValue()) {
		//	bindParamValues = this.bindParamInput.getDataValue();
		//}
		checkQueryInput = [
			this.dataModelName,
			this._getQueryValue(),
			this._getQueryInputs(),
			bindParamValues];
		studio.dataService.requestAsync(CHECK_QUERY_OP, checkQueryInput,
			dojo.hitch(this, "_checkQueryCompleted"), 
			dojo.hitch(this, "_saveQueryError"));
	},
	_checkQueryCompleted: function() {
		this._updateQuery();
            app.toastSuccess("Query Saved");
	},
	_updateQuery: function() {
		var name = dojo.string.trim(this.queryNameInput.getDataValue());

		this.selectedQueryName = name;

		var comment = dojo.string.trim(this.queryCommentInput.getDataValue() || "");
		var sr = this.returnsSingleResultCheckBox.editor.getChecked();

		var fqOutputType = null;
		var queryInfo = { 
				name: name,
				comment: comment,
				query: this._getQueryValue(),
				isHQL: true,
				inputs: this._getQueryInputs(),
				outputType: fqOutputType,
				returnsSingleResult: sr
				};
		studio.dataService.requestAsync(SAVE_QUERY_OP,
			[this.dataModelName, queryInfo], 
			dojo.hitch(this, "_saveQueryCompleted"), 
			dojo.hitch(this, "_saveQueryError"));
	},
	_saveQueryCompleted: function() {
		studio.updateServices();
		studio.endWait();
		//this._loadQueries();
		this._resetChanges();
		this.saveQueryBtn.setDisabled(true);
		this.queryDataModelInput.setDisabled(true);
		if (!this.query || this.query.name != this.query.newName) {
			this.deleteQuery = this.query;
			var n = this.queryNameInput.getDataValue();
			this.query =  new wm.Query({
				name: n,
				dataModelName: this.dataModelName, 
				queryName: n
			});
			studio.application.addServerComponent(this.query);
			if (this.deleteQuery) {
                            app.confirm("Your new query has been saved; do you want to delete the original or keep both the new query and the original?", false, dojo.hitch(this, "_deleteOriginalQuery"), dojo.hitch(this, "_keepOriginalQuery"), "Delete", "Keep Original");
/*
			  app.pageDialog.showPage("GenericDialog",true,350,140);
			  app.pageDialog.page.setupPage("Prompt...", "Your new query has been saved; do you want to delete the original or keep both the new query and the original?");
			  
			  app.pageDialog.page.setupButton(1, "Delete Old Query", dojo.hitch(this, "_deleteOriginalQuery"));
			  app.pageDialog.page.setupButton(2, "Keep Old Query", dojo.hitch(this, "_keepOriginalQuery"));
                          */
			  return;
			}
		}
		studio.refreshWidgetsTree();
		studio.selected = null;
		studio.select(this.query);
	},
	_keepOriginalQuery: function() {
	    //app.pageDialog.page.dismiss();
		studio.refreshWidgetsTree();
		studio.selected = null;
		studio.select(this.query);
	},
	_deleteOriginalQuery: function() {
	    //app.pageDialog.page.dismiss();

		studio.beginWait("Deleting Query...");
		var _this = this;
		studio.dataService.requestSync(
		  REMOVE_QUERY_OP, [this.deleteQuery.dataModelName, this.deleteQuery.name],
		  function() {
		    studio.application.removeServerComponent(_this.deleteQuery);
		    studio.refreshWidgetsTree();
		    studio.selected = null;
		    studio.select(_this.query);		    
		    studio.endWait();
		  });
	},
	_saveQueryError: function(inError) {
		studio.endWait();
	    app.alert("Error saving query: " + inError.message);
	},
	/*_loadQueries: function() {
		studio.dataService.requestSync(LOAD_QUERIES_TREE_OP,
			[], dojo.hitch(this, "_loadedQueries"));
	},*/
	_queryChanged: function() {
		this.saveQueryBtn.setDisabled(false);
		this.hasChanges = true;
	},
	_getQueryInputs: function() {
		var qi = [];
		for (var i = 0; i <	this.queryInputsList._data.length; i++) {
			var q = this.queryInputsList._data[i];
			var type = this.typesLongNameLookup[q.type];
			qi.push({paramName:q.name,paramType:type,list:q.list});
		}
		return qi;
	},
	_getQueryValue: function() {
		var rtn = this.queryTextArea.getInputValue();
		if (rtn.charAt(rtn.length-1) == ';') {
			rtn = rtn.substring(0, rtn.length-1);
		}
		rtn = dojo.string.trim(rtn);

		var lines = rtn.split(this.EOL);
		rtn = "";
		for (var i = 0; i < lines.length; i++) {
			var line = dojo.string.trim(lines[i]);
			if (line.indexOf(this.QUERY_COMMENT) == 0) {
				continue;
			}
			rtn += line + this.EOL;
		}

		return rtn;
	},
	_runQueryResult: function(inResult) {
		studio.endWait();
		if (inResult.length == 0) {
			this.emptyResultSetLabel.setShowing(true);
			this.queryOutputList.setShowing(false);
		} else {
			this.queryOutputList.renderData(inResult);
		}
	},
	_runQueryError: function(inError) {
		studio.endWait();
	    app.alert("Run query error: " + inError.message);
	},
	_setTypes: function() {
		this.typesLongNameLookup = {}
		this.typesShortNameLookup = {}
		var names = [];

		for (var shortName in this.primitivesLongNameLookup) {
			names.push(shortName);
			var longName = this.primitivesLongNameLookup[shortName];
			this.typesLongNameLookup[shortName] = longName;
			this.typesShortNameLookup[longName] = shortName;
		}

		names.sort();

		var dataModelTypes = getDataModelTypeNames(
			this.typeRefTree, this.dataModelName, this.valueTypes);

		for (var shortName in dataModelTypes) {
			names.push(shortName);
			var longName = dataModelTypes[shortName];
			this.typesLongNameLookup[shortName] = longName;
			this.typesShortNameLookup[longName] = shortName;
		}

		this.bindTypeInput.editor.setOptions(names.join());
		// set an initial type value so it cannot be created blank.
		this.bindTypeInput.beginEditUpdate();
		this.bindTypeInput.setDisplayValue(JAVA_INT_TYPE);
		this.bindTypeInput.endEditUpdate();
	},
	addBindParam: function(inSender) {
		if (this.bindNameInput.getDataValue() == "") {
		    app.alert("The bind parameter name is required");
			return;
		}
/*
		var bp = {name:this.bindNameInput.getDataValue(), 
			  type:this.bindTypeInput.getDisplayValue(), 
			  list:this.isInputListCheckBox.editor.getChecked(),
			  value: this.bindParamInput.getDataValue()};
                          */
	    var bp = {name:"",
		      type:"Integer",
		      list:false,
		      value: null};
		this.queryInputsList._data.push(bp);
		this.queryInputsList._render();
		this._queryChanged();
            this.queryInputsList.eventSelect(this.queryInputsList.getItem(this.queryInputsList._data.length-1));
            this.bindNameInput.focus();
	},
	removeBindParam: function(inSender) {
		var s = this.queryInputsList.selected;
		if (s) {
			this.queryInputsList._data.splice(s.index, 1);
			this.queryInputsList._render();
			this._queryChanged();
		}
	},
	bindValue: function(inSender) {
		var s = this.queryInputsList.selected;
		if (s == null) return;
		var sIndex = s.index;
		s.list._data[sIndex].value = this.bindParamInput.getDataValue();
		this.queryInputsList._render();
		this.queryInputsList.selectByIndex(sIndex);
	},
	parmSelected: function(inSender) {
            this._paramSelecting = true;
		var s = this.queryInputsList.selected;
		var sIndex = s.index;
		this.bindNameInput.setDataValue(s.list._data[sIndex].name);
		this.bindTypeInput.setDataValue(s.list._data[sIndex].type);
		this.bindTypeInput.setDataValue(s.list._data[sIndex].type);
                this.isInputListCheckBox.editor.setChecked(s.list._data[sIndex].list);
	        this.bindParamInput.setDataValue(s.list._data[sIndex].value);
            this._paramSelecting = false;
	},
    parameterPropEdit: function(inSender) {
       	if (this._paramSelecting) return;
	    var bp = {name:this.bindNameInput.getDataValue(), 
		      type:this.bindTypeInput.getDisplayValue(), 
		      list:this.isInputListCheckBox.editor.getChecked(),
		      value: this.bindParamInput.getDataValue()};
        var selectedIndex = this.queryInputsList.getSelectedIndex();
	    this.queryInputsList._data[selectedIndex] = bp;
	    this.queryInputsList._render();
	    this._queryChanged();
		var item = this.queryInputsList.getItem(selectedIndex);
        if (item)
			this.queryInputsList.eventSelect(item);
   },
/*
    parmDblClick: function(inSender,inEvent,inItem) {
	var sIndex = inItem.index;
            var val = prompt("Enter new test value", inItem.list._data[sIndex].value || "");
            inItem.list._data[sIndex].value = val;
	    this.queryInputsList._render();
	    this.queryInputsList.selectByIndex(sIndex);
        },
        */
	_clear: function() {
		this.bindNameInput.setDataValue("");
		this.bindParamInput.setDataValue("");
		this.queryNameInput.setDataValue("");
		this.queryCommentInput.setDataValue("");
		this.queryTextArea.setInputValue("");
		this.queryInputsList.clear();
		this.queryInputsList._data = [];
		this.queryOutputList.clear();
		this._resetChanges();

		this.saveQueryBtn.setDisabled(true);
		this.runQueryBtn.setDisabled(true);
		this.delQueryBtn.setDisabled(true);
		this.newQueryBtn.setDisabled(true);
	},
	_resetChanges: function() {
		this.hasChanges = false;
	},
	/*_loadedQueries: function(inData) {
		this.queriesTree.renderData(inData.dataObjectsTree);
		setTimeout(dojo.hitch(this, "_selectNode"), 10);
	},*/
	_getQueryResult: function(inResponse) {
		this._getQueryOutputChanged(inResponse);
		if (inResponse) {
			this.queryDataModelInput.setDisplayValue(this.dataModelName);
			this.queryDataModelInput.setDisabled(true);
			this.queryNameInput.setDataValue(inResponse.name);
			this.queryTextArea.setInputValue(inResponse.query);
		}
	},
	_getQueryOutputChanged: function(inData) {
		this.queryInputsList._data = [];

		for (var i=0,j=inData.inputs.length; i < j; i++) {
			var name = inData.inputs[i]["paramName"];
			var typeName = inData.inputs[i]["paramType"];
			var list = inData.inputs[i]["list"];
			this.queryInputsList._data.push({name:name,
				type:this.typesShortNameLookup[typeName],
				list:list,
				value:""});
		}
		this.queryInputsList._render();
		this.returnsSingleResultCheckBox.editor.setChecked(
			inData.returnsSingleResult);
		this.queryNameInput.setDataValue(inData.name);
		this.queryCommentInput.setDataValue(inData.comment);
		this.queryTextArea.setInputValue(inData.query);
	},
	_canSaveQuery: function() {
		var qn = this.queryNameInput.getDataValue();
		var q = this._getQueryValue();
		return dojo.string.trim(qn) != "" && dojo.string.trim(q) != "";
	},
	_removedQuery: function() {
		studio.endWait();
		this._clear();
		//this._loadQueries();
		studio.application.removeServerComponent(this.query);
		studio.refreshWidgetsTree();
	},
	_loadTypes: function() {
		studio.servicesService.requestSync(LOAD_PRIMITIVES_OP, 
			[], dojo.hitch(this, "_primitivesLoaded"));
	},
	_primitivesLoaded: function(inData) {
		// inData: dict: short type name -> fully qualified type name
		this.primitivesShortNameLookup = {};
		for (var shortName in inData) {
			var longName = inData[shortName];
			this.primitivesShortNameLookup[longName] = shortName; 
		}
		this.primitivesLongNameLookup = inData;

		studio.dataService.requestSync(LOAD_DATA_TYPES_TREE_OP,
			[], dojo.hitch(this, "_loadedDataTypes"));
	},
	_loadedDataTypes: function(inData) {
		this.typeRefTree.renderData(inData.dataObjectsTree);
		this.valueTypes = inData.valueTypes;
		this._setTypes();
	},
	/*_selectNode: function() {
		if (this.selectedQueryName == null) {
			selectFirstChildNode(this.queriesTree);
		} else {
			if (this.dataModelName != null) {
				var n = this._findQueryNode(this.dataModelName,
					this.selectedQueryName);
				this.queriesTree.select(n);
			}
		}
	},*/
	_enableAll: function(enable) {
		this.newQueryBtn.setDisabled(!enable);
		this.delQueryBtn.setDisabled(!enable);
		this.saveQueryBtn.setDisabled(!enable);
		this.queryNameInput.setDisabled(!enable);
		this.queryCommentInput.setDisabled(!enable);
		this.queryTextArea.setDisabled(!enable);
		this.returnsSingleResultCheckBox.setDisabled(!enable);
		this.queryInputsList.setDisabled(!enable);
		this.deleteParamBtn.setDisabled(!enable);
		this.bindNameInput.setDisabled(!enable);
		this.addInputBtn.setDisabled(!enable);
		this.bindParamInput.setDisabled(!enable);
		this.runQueryBtn.setDisabled(!enable);
		this.maxResultsInput.setDisabled(!enable);
	},
	/*_findQueryNode: function(dataModelName, queryName) {
		var dataModelNode = this._findNodeByName(this.queriesTree.root, 
			dataModelName);

		if (dataModelNode == null) {
			return null;
		}
		var rtn = this._findNodeByName(dataModelNode, queryName);
		return rtn;
	},
	_findNodeByName: function(root, name) {
		if (root.content == name) {
			return root;
		}
		for (var i = 0; i < root.kids.length; i++) {
			var rtn = this._findNodeByName(root.kids[i], name);
			if (rtn != null) {
				return rtn;
			}
		}
		return null;
	},*/
	queryDataModelInputChange: function(inSender, inDisplayValue, inDataValue) {
		this.dataModelName = inDisplayValue;
		this._loadTypes();
	},
	_end: 0
});
