/*
 * Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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
 

dojo.declare("I18nDictionaryEditor", wm.Page, {
    i18n: true,
    //defaultItem: null,
    //defaultItemEnabled: false,
    dictionaryList: null,
    dictionaryHash: null,
    start: function() {
	this.reset();
    },
    reset: function() {
	var d = studio.pagesService.requestSync("listDictionaries", null);
	studio.beginWait(this.getDictionaryItem("LOADING"));
	d.addCallback(dojo.hitch(this, function(inResult) {
	    inResult.sort();
	    this.dictionaryList = inResult;
	    this.dictionaryHash = {};
	    var data = wm.load("projects/" + studio.project.projectName + "/language/nls/" + studio.project.pageName + ".js");
	    try {
		this.dictionaryHash["default"] = dojo.fromJson(data);
		var itemList = [];
		for (var item in this.dictionaryHash["default"]) 
		    itemList.push({dataValue: item});
		this.dictionaryTermListVar.setData(itemList);
	    } catch(e) {}
	    for (var i = 0; i < this.dictionaryList.length; i++) {
		var l = this.dictionaryList[i];
		var data = wm.load("projects/" + studio.project.projectName + "/language/nls/" + l + "/" + studio.project.pageName + ".js");
		try {
		    this.dictionaryHash[l] = dojo.fromJson(data);
		} catch(e) {}
	    }
	    this.dictionaryList.unshift("default");
	    studio.endWait();
	}));
    },
    addTermClick: function(inSender) {
	var newName = "SCRIPT_New Term";
	var isUnique = false;
	for (var i = 1; i < 100 && !isUnique; i++) {
	    isUnique = true;
	    newName = "SCRIPT_New Term" + i;
	    for (var itemName in this.dictionaryHash.default) {
		if (itemName == newName) {
		    isUnique = false;
		    break;
		}
	    }
	}
	if (isUnique) {
	    this.dictionaryTermListVar.addItem({dataValue: newName});
	    if (!this.dictionaryHash.default)
		this.dictionaryHash.default = {};
	    this.dictionaryHash.default[newName] = "";
	}
	this.dictionaryItemList.selectByIndex(this.dictionaryTermListVar.getCount()-1);
	this.dictionaryItemSelect(this.dictionaryItemList);
    },
    deleteTermClick: function(inSender) {
	var index = this.dictionaryItemList.getSelectedIndex();
	if (index >= 0) {
	    var name = this.dictionaryItemList.selectedItem.getValue("dataValue");
	    this.dictionaryTermListVar.removeItem(index);
	    for (var language in this.dictionaryHash) {
		delete this.dictionaryHash[language][name];
	    }
	}
    },
    dictionaryItemSelect: function(inSender, inItem) {
	var name = inSender.selectedItem.getValue("dataValue");
	this.editTermPanel.removeAllControls();
	for (var i = 0; i < this.dictionaryList.length; i++) {
	    var lang = this.dictionaryList[i];
	    this.addText(lang, name);
	}
	this.editTermPanel.reflow();
    },
    addText: function(lang, name) {
	var t = new wm.Text({owner: this,
			     parent: this.editTermPanel,
			     caption: lang,
			     width: "100%",
			     dataValue: this.dictionaryHash[lang] ? this.dictionaryHash[lang][name] : null});
	t.onchange = dojo.hitch(this, function() {
	    this.onItemChange(t,lang);
	});

    },
    termNameChange: function(inSender, inValue) {
	var index = this.dictionaryItemList.getSelectedIndex();	
	if (index >= 0) {
	    var oldName = this.dictionaryItemList.selectedItem.getValue("dataValue");
	    if (inValue == oldName) 
		return;
	    if (inValue.indexOf("SCRIPT_") != 0)
		inValue = "SCRIPT_" + inValue;
	    for (var itemName in this.dictionaryHash.default) {
		if (itemName == inValue) {
		    inSender.reset();
		    app.toastError("That name is already taken");
		    return;
		}
	    }

	    for (var language in this.dictionaryHash) {
		var val = this.dictionaryHash[language][oldName];
		if (val !== undefined && val !== null) {
		    this.dictionaryHash[language][inValue] = val; 
		    delete this.dictionaryHash[language][oldName];
		}
	    }	 
	    this.dictionaryTermListVar.getItem(index).setValue("dataValue", inValue);
	    this.dictionaryItemList.select(this.dictionaryItemList.getItem(index));
	}
    },
    onItemChange: function(editor,inLang) {
	var index = this.dictionaryItemList.getSelectedIndex();	
	if (index >= 0) {
	    var name = this.dictionaryItemList.selectedItem.getValue("dataValue");
	    if (!this.dictionaryHash[inLang])
		this.dictionaryHash[inLang] = {};
	    this.dictionaryHash[inLang][name] = editor.getDataValue();
	}	
    },
    saveClick: function(inSender) {
	this.errors = false;
	studio.beginWait(this.getDictionaryItem("SAVING"));
	for (lang in this.dictionaryHash) {
	    var data = dojo.toJson(this.dictionaryHash[lang],true);	    
	    var path = (lang == "default") ? "language/nls/" + studio.project.pageName + ".js" : "language/nls/" + lang + "/" + studio.project.pageName + ".js"
	    var d = studio.studioService.requestSync("writeWebFile", [path, data, false]);
	    d.addErrback(dojo.hitch(this, function(result) {
		this.errors = true;
		app.toastError("Failed to save: " + result);
	    }));
	    if (this.errors) 
		break;
	}
	if (!this.errors)
	    this.owner.owner.hide();
	studio.page.setI18n(true);
	studio.endWait();
    },
    cancelClick: function() {
	this.owner.owner.hide();
    },
    insertScriptClick: function(inSender) {
	var name = this.dictionaryItemList.selectedItem.getValue("dataValue");	
	var value = this.dictionaryHash.default[name];
	var results = value.match(/\$\{(.*?)\}/g);
	if (results) {
	    var text = "this.getDictionaryItem(\"" + name + "\",{"
	    for (var i = 0; i < results.length; i++) {
		if (i) text += ", ";
		text += '"' + results[i].replace(/\$\{(.*)\}/, "$1") + '": ""';
	    }
	    text += "})";
	} else {
	    var text = "this.getDictionaryItem(\"" + name + "\")";
	}
	studio.editArea.replaceSelectedText(text);
    },
    _end: 0
});