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
 
dojo.provide("wm.studio.pages.QueryEditor.QueryEditor");

dojo.declare("QueryEditor", wm.Page, {
        i18n: true,
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
        _startCalled: false,
	start: function() {
            if (this._startCalled) return;
                this._startCalled = true;
		this.subscribe("wm-project-changed", this, "update");
		this.update();

	    var buttons = [this.saveQueryBtn, this.newQueryBtn, this.delQueryBtn, this.addInputBtn, this.deleteParamBtn,this.runQueryBtn];
	    dojo.forEach(buttons, function(b) {
		b.disconnectEvent("onclick");
		dojo.connect(b.domNode, "onmousedown", function() {
		    b.click();
		});
	    });

	    if (dojo.isIE <= 8) {
		wm.onidle(this, function() {
		    dojo.forEach(buttons, function(b) {
			b.setBorder("1");
			b.setBorder("0");
		    });
		});
	    }
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
	    studio.saveAll(this);
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

            app.confirm(this.getDictionaryItem("CONFIRM_DELETE", {name: name}), false, dojo.hitch(this, "_removeQuery"), null);
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

	    studio.beginWait(this.getDictionaryItem("WAIT_DELETE"));
		studio.dataService.requestSync(
			REMOVE_QUERY_OP, [this.dataModelName, name],
			dojo.hitch(this, "_removedQuery"));
	},
    newQuery: function(inSender) {
	    var c = new wm.Query({queryName: "New_Query",
				  dataModelName: this.query && this.query.dataModelName || ""});
	c.afterPaletteDrop();
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
		this.setDirty();
	},
	queryCommentKeyPress: function(inSender) {
		setTimeout(dojo.hitch(this, "queryCommentChanged"), 0);		
	},
	queryCommentChanged: function(inSender) {
		this.setDirty();
	},
	queryTextAreaKeyPress: function(inSender) {
		setTimeout(dojo.hitch(this, "queryTextAreaChanged"), 0);
	},
	queryTextAreaChanged: function(inSender) {
	    this.setDirty();
	    this.runQueryBtn.setDisabled(false);
	    var text = this.queryTextArea.getDataValue();
	    this.joinWarningLabel.setShowing(text.match(/\bjoin\b/i));
	    this.updateInputList(inSender.getDataValue());
	},
	singleResultKeyPress: function(inSender) {
		setTimeout(dojo.hitch(this, "singleResultChanged"), 0);		
	},
	singleResultChanged: function(inSender) {
		this.setDirty();
	},
	runQuery: function(inSender) {
	    wm.onidle(this, function() {
		//this.bindValue();

	    // if its all white space, then no query is here
	       if (!this._getQueryValue().match(/\S/)) {
		    app.alert(this.getDictionaryItem("ERROR_NO_QUERY"));
		    return;
		}
	        if (!this.queryDataModelInput.getDataValue()) {
		    app.alert(this.getDictionaryItem("ERROR_NO_DATAMODEL"));
		    return;
		}
		this.emptyResultSetLabel.setShowing(false);
		this.queryOutputList.setShowing(true);
		for (var i in DML_OPERATIONS) {
			var op = DML_OPERATIONS[i];
			if (this._getQueryValue().toLowerCase().indexOf(op) == 0) {
			    if (!confirm(this.getDictionaryItem("CONFIRM_RUN"))) {
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
		studio.beginWait(this.getDictionaryItem("WAIT_RUN"));
		studio.dataService.requestAsync(RUN_QUERY_OP, runQueryInput, 
			dojo.hitch(this, "_runQueryResult"), 
			dojo.hitch(this, "_runQueryError"));
	    });
	},
	_buildBindParms: function() {
		var parms = "";
		for (var i = 0; i <	this.queryInputsList._data.length; i++) {
		    var list = this.queryInputsList._data[i].list;
		    var val = this.queryInputsList._data[i].value;
		    var type = this.queryInputsList._data[i].type;
		    if (val === null || val === undefined || val.length == 0) {
			switch(type) {
			case "Integer":
			case "Short":
			case "Long":
			case "Double":
			case "Float":
			case "BigInteger":
			case "BigDecimal":
			case "Byte":
			case "Date":
			case "Time":
			    val = "0";
			    break;
			default:
			    val = "a";
			}
		    }
			if (list) val = "[" + val + "]";
			(i == 0) ? (parms = parms + val) : (parms = parms + ", " + val);
		}
		if (i == 0)
			return null;
		else
			return parms;
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
	    this.queryDataModelInput.editor.allowNone = (names.length > 1);
	    this.queryDataModelInput.editor.setOptions(names.join());
	    if (names.length == 1)
		this.queryDataModelInput.setDataValue(this.dataModelName || names[0]);
	    this._cachedData = this.getCachedData();
	},
    getCachedData: function() {
	return dojo.string.trim(this.queryNameInput.getDataValue() || "") 
		+ "|" + this.queryDataModelInput.getDataValue() 
		+ "|" + this.queryCommentInput.getDataValue() 
		+ "|" + this.queryTextArea.getDataValue() 
		+ "|" + this.returnsSingleResultCheckBox.editor.getChecked()
	    + "|" + dojo.toJson(this._getQueryInputs());
    },

/* This finds all double quotes that aren't inside of single quoted strings and replaces them with single quotes.
 * It does not correctly fix expressions such as:
 *     from Employee where firstname="'michael'"
 * which becomes
 *     from Employee where firstname=''michael''
 */
    fixDoubleQuotes: function() {
	var query = this.queryTextArea.getDataValue();
	parts = query.split(/\'/);
	for (var i = 0; i < parts.length; i++) {
	    var p = parts[i];
	    if (p.indexOf('"') != -1) {
		/* If we see a double quote, and we are not between two single quotes, then change it into a single quote */
		if (i % 2 == 0) {
		    parts[i] = parts[i].replace(/\"/g,"'");
		}
	    }
	}
	query = parts.join("'");
	this.queryTextArea.setDataValue(query);
    },
	_saveQuery: function() {
	    this.fixDoubleQuotes();

		var name = dojo.string.trim(this.queryNameInput.getDataValue());
		
		// check existing query with the same name

		var cs = studio.application.getServerComponents();   
		for (var i in cs) {
			var c = cs[i];
			if (c.declaredClass == "wm.Query" && c != this.query && c.queryName == name) {
                            app.confirm(this.getDictionaryItem("CONFIRM_OVERWRITE", {name: name}), false, 
					dojo.hitch(this, function() {
					    studio.dataService.requestSync(
						REMOVE_QUERY_OP, [c.dataModelName, c.queryName],
						dojo.hitch(this, function() {
						    studio.application.removeServerComponent(c);
						}));
					    this._saveQuery2(c);
					}),
					dojo.hitch(this, "saveComplete"));
			    return; // when the user clicks, then we'll do something; we're finished until the user clicks
			} 
		}

		this._saveQuery2(c);
	},
	_saveQuery2: function(c) {
	    //app.pageDialog.dismiss();
		var name = dojo.string.trim(this.queryNameInput.getDataValue());
		if (this.query) {
		  this.query.newName = name;
		}
	    //studio.beginWait("Saving Query: " + name);

		if (c.id == SALESFORCE_SERVICE) //xxx
			this._updateQuery();
		else
			this._checkQuery()
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
			dojo.hitch(this, "_checkQueryError"));
	},
	_checkQueryCompleted: function() {
		this._updateQuery();
            app.toastSuccess(this.getDictionaryItem("TOAST_SAVED"));
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
	    //studio.endWait();
		//this._loadQueries();
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

	            this.owner.parent.setName(this.query.getLayerName());

		    studio.application.addServerComponent(this.query);

/*
		    if (this.deleteQuery) {

                            app.confirm("Your new query has been saved; do you want to delete the original or keep both the new query and the original?", false, dojo.hitch(this, "_deleteOriginalQuery"), dojo.hitch(this, "_keepOriginalQuery"), "Delete", "Keep Original");
/*
			  app.pageDialog.showPage("GenericDialog",true,350,140);
			  app.pageDialog.page.setupPage("Prompt...", "Your new query has been saved; do you want to delete the original or keep both the new query and the original?");
			  
			  app.pageDialog.page.setupButton(1, "Delete Old Query", dojo.hitch(this, "_deleteOriginalQuery"));
			  app.pageDialog.page.setupButton(2, "Keep Old Query", dojo.hitch(this, "_keepOriginalQuery"));

			  return;
			  }
                          */
		}

		studio.refreshServiceTree();
		studio.selected = null;
		studio.select(this.query);
	    this.onSaveSuccess();
		},
	_keepOriginalQuery: function() {
	    //app.pageDialog.page.dismiss();
		studio.refreshServiceTree();
		studio.selected = null;
		studio.select(this.query);
	    this.onSaveSuccess();
	},
	_deleteOriginalQuery: function() {
	    //app.pageDialog.page.dismiss();

	    studio.beginWait(this.getDictionaryItem("WAIT_DELETE"));
		var _this = this;
		studio.dataService.requestSync(
		  REMOVE_QUERY_OP, [this.deleteQuery.dataModelName, this.deleteQuery.name],
		    function() {
		    studio.application.removeServerComponent(_this.deleteQuery);
		    studio.refreshServiceTree();
		    studio.selected = null;
		    studio.select(_this.query);		    
		    studio.endWait();
			_this.onSaveSuccess();
		  });
	},
	_saveQueryError: function(inError) {
	    //studio.endWait();
	    studio._saveErrors.push({owner: this,
				     message: this.getDictionaryItem("ERROR_SAVING", {error: inError.message})});
	    this.saveComplete();
	},
	_checkQueryError: function(inError) {
	    //studio.endWait();
	    studio._saveErrors.push({owner: this,
				     message: this.getDictionaryItem("ERROR_CHECKING", {error: inError.message})});
	    this.saveComplete();
	},
	/*_loadQueries: function() {
		studio.dataService.requestSync(LOAD_QUERIES_TREE_OP,
			[], dojo.hitch(this, "_loadedQueries"));
	},*/
	setDirty: function() {
	    wm.job(this.getRuntimeId() + "_hasChanged", 500, dojo.hitch(this, function() {
		if (this.isDestroyed) return;
		var changed = this.getCachedData() != this._cachedData;
		var caption = (!changed ? "" : "<img class='StudioDirtyIcon'  src='images/blank.gif' /> ") +
		    this.queryNameInput.getDataValue() + " (" + studio.getDictionaryItem("wm.Query.TAB_CAPTION") + ")";
		this.dirty = changed;

		if (caption != this.owner.parent.caption) {
		    this.owner.parent.setCaption(caption);
		    studio.updateServicesDirtyTabIndicators();
		}
		this.saveQueryBtn.setDisabled(!changed);

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
		if (this._canSaveQuery()) {
			this._saveQuery();
		}
		else {
		    this.saveComplete();
		}
    },
    saveComplete: function() {
    },
    onSaveSuccess: function() {
	this._cachedData = this.getCachedData();
	this.setDirty();
	//dojo.publish("ServiceTypeChanged-" +  this.dataModelName);  turns out that the call to studio.typeChanged takes care of this...
	this.saveComplete();
    },
    getProgressIncrement: function() {
	return 5; //  1 tick is very fast; this is 10 times slower than that
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
		var rtn = this.queryTextArea.getDataValue() || "";
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
    updateInputList: function(inText) {
	var oldData = this.queryInputsList._data;
	var currentParams = {};
	var matches = inText.match(/:\w*/g);
	for (var i = 0; i < matches.length; i++) {
	    currentParams[matches[i].substring(1)] = true;
	}

	for (var j = oldData.length-1; j >= 0; j--) {
	    if (!currentParams[oldData[j].name]) {
		wm.Array.removeElementAt(oldData,j);
	    }
	}
	
	for (var name in currentParams) {
	    var found = false;
	    for (var i = 0; i < oldData.length; i++) {
		if (oldData[i].name == name) {
		    found = true;
		    break;
		}
	    }
	    if (!found) {
		oldData.push({"name": name,
			      type: "Integer",
			      list: false});
	    }
	}

	this.queryInputsList._render();
    },
	addBindParam: function(inSender) {
		if (this.bindNameInput.getDataValue() == "") {
		    app.alert(this.getDictionaryItem("ALERT_NO_BIND"));
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
		this.setDirty();
            this.queryInputsList.eventSelect(this.queryInputsList.getItem(this.queryInputsList._data.length-1));
            this.bindNameInput.focus();
	},
	removeBindParam: function(inSender) {
		var s = this.queryInputsList.selected;
		if (s) {
			this.queryInputsList._data.splice(s.index, 1);
			this.queryInputsList._render();
			this.setDirty();
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
                this.isInputListCheckBox.setChecked(s.list._data[sIndex].list);
	        this.bindParamInput.setDataValue(s.list._data[sIndex].value);
            this._paramSelecting = false;
	},
    parameterPropEdit: function(inSender) {
       	if (this._paramSelecting) return;
	    var bp = {name:this.bindNameInput.getDataValue(), 
		      type:this.bindTypeInput.getDisplayValue(), 
		      list:this.isInputListCheckBox.getChecked(),
		      value: this.bindParamInput.getDataValue()};
        var selectedIndex = this.queryInputsList.getSelectedIndex();
	    this.queryInputsList._data[selectedIndex] = bp;
	    this.queryInputsList._render();
	    this.setDirty();
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
		this.queryTextArea.setDataValue("");
		this.queryInputsList.clear();
		this.queryInputsList._data = [];
		this.queryOutputList.clear();
	        this._cachedData = this.getCachedData();

		this.saveQueryBtn.setDisabled(true);
		this.runQueryBtn.setDisabled(true);
		this.delQueryBtn.setDisabled(true);
		this.newQueryBtn.setDisabled(true);
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
			this.queryTextArea.setDataValue(inResponse.query);
		}
	        this._cachedData = this.getCachedData();
	    this.setDirty();
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
		this.queryTextArea.setDataValue(inData.query);
	},
	_canSaveQuery: function() {
	    var qn = this.queryNameInput.getDataValue();
	    var q = this._getQueryValue();
	    var dm = this.queryDataModelInput.getDataValue();
	    if (!qn.match(/\S/)) {
		studio._saveErrors.push({owner: this,
					 message: this.getDictionaryItem("ERROR_NO_NAME")});
		return false;
	    }
	    if (!q.match(/\S/)) {
		studio._saveErrors.push({owner: this,
					 message: this.getDictionaryItem("ERROR_NO_QUERY")});
		return false;
	    }
	    if (!dm.match(/\S/)) {
		studio._saveErrors.push({owner: this,
					 message: this.getDictionaryItem("ERROR_NO_DATAMODEL")});
		return false;
	    }
	    return true;
	},
	_removedQuery: function() {
	    studio.endWait();
	    studio.application.removeServerComponent(this.query);
	    studio.refreshServiceTree("");

	    var pageContainer = this.owner;
	    var subtablayer = pageContainer.parent;
	    var subtablayers = subtablayer.parent;
	    var dblayer = subtablayers.parent;
	    if (subtablayers.layers.length == 1)
		dblayer.hide();
	    subtablayer.destroy();

/*
		studio.endWait();
		this._clear();
		//this._loadQueries();
		studio.application.removeServerComponent(this.query);
		studio.refreshServiceTree();
		*/
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
