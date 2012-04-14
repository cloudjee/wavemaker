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
 

dojo.provide("wm.studio.app.editcommands");

Studio.extend({
    showEditorHelp: function() {
	studio.editArea.showHelp();
    },
    showAppScriptEditorHelp: function() {
	studio.appsourceEditor.showHelp();
    },
    showCssEditorHelp: function() {
	studio.cssEditArea.showHelp();
    },
    showMarkupEditorHelp: function() {
	studio.markupEditArea.showHelp();
    },

/*
    validateScriptCheckboxChange: function(inSender) {
	dojo.cookie(this.scriptPageCompileChkBtn.getRuntimeId(), inSender.getChecked());
    },
    */

	saveScriptClick: function() {
	    var errors = studio.editArea.hasJavascriptErrors();
	    if (errors)
		app.alert(errors);
/*
	    if (this.scriptPageCompileChkBtn.getChecked()) 
		this.validateScriptClick();
		*/
	    studio.saveAll(studio.project);
	    //this.waitForCallback(bundleDialog.M_SavingScript + this.project.projectName, dojo.hitch(this.project, "saveScript"));
	},
        saveAppSrcClick: function() {
	    var errors = studio.appsourceEditor.hasJavascriptErrors();
	    if (errors)
		app.alert(errors);

/*
	    if (this.appsrcPageCompileChkBtn.getChecked()) 
		this.validateAppScriptClick();
		*/
	    //this.waitForCallback(bundleDialog.M_SavingAppScript + this.project.projectName, dojo.hitch(this.project, "saveAppScript"));
	    studio.saveAll(studio.project);
	},


    toggleWrapScriptClick: function() {
	this.editArea.toggleWordWrap();
    },
    toggleWrapAppScriptClick: function() {
	this.appsourceEditor.toggleWordWrap();
    },
    toggleWrapCssClick: function() {
	this.cssEditArea.toggleWordWrap();
	this.appCssEditArea.toggleWordWrap();
    },
    toggleWrapMarkupClick: function() {
	this.markupEditArea.toggleWordWrap();
    },

    scriptEditorCtrlKey: function(inSender, letter) {
	switch(letter.toLowerCase()) {
	case "s":
	    return this.saveScriptClick();
/*	case "e":
	    return this.validateScriptClick();*/
	case "i":
	    return this.formatScriptClick();
/*
	case "o":
	    return this.toggleWrapScriptClick();

	case "g":
	    return this.editArea.promptGotoLine();
	    */
	case ".":
	case " ":
	    if (this.autoCompletionDialog && this.autoCompletionDialog.showing) {
		for (var i = 0; i < this.autoCompletionList.dataSet.getCount() && this.autoCompletionList.dataSet.getItem(i).getValue("name").match(/\</); i++) {;}
		this.autoCompletionList.select(i);
		this.insertCompletedText();
	    } else {
		return this.listCompletions();
	    }
	}
    },
    appScriptEditorCtrlKey: function(inSender, letter) {
	switch(letter.toLowerCase()) {
	case "s":
	    return this.saveAppSrcClick();
/*
	case "e":
	    return this.validateAppScriptClick();
	    */
	case "i":
	    return this.formatAppScriptClick();
/*
	case "o":
	    return this.toggleWrapAppScriptClick();
	case "g":
	    return this.appsourceEditor.promptGotoLine();
	    */
	}
    },
    cssEditorCtrlKey: function(inSender, letter) {
	switch(letter.toLowerCase()) {
	case "s":
	    return this.saveCssClick();
	case "e":
	    break;
	case "i":
	    break;
/*
	case "o":
	    return this.toggleWrapCssClick();
	case "g":
	    return this.cssEditArea.promptGotoLine();
	    */
	}
    },
    markupEditorCtrlKey: function(inSender, letter) {
	switch(letter.toLowerCase()) {
	case "s":
	    return this.saveMarkupClick();
	case "e":
	    break;
	case "i":
	    break;
	case "o":
	    break;
	case "g":
	    break;
	}
    },


    findScriptClick: function() {
	studio.editArea.showSearch();
    },
    findAppScriptClick: function() {
	studio.appsourceEditor.showSearch();
    },
    findCssClick: function() {
	studio.cssEditArea.showSearch();
	studio.appCssEditArea.showSearch();
    },
    findMarkupClick: function() {
	studio.markupEditArea.showSearch();
    },

/*
    validateScriptClick: function() {
	this.validate(this.editArea.getText(), this.editArea, this.scriptPageCompileBtn);
    },
    validateAppScriptClick: function() {
	this.validate(this.appsourceEditor.getText(), this.appsourceEditor, this.appsrcPageCompileBtn);
    },

    validate: function(inText, inEditor, inButton) {
	var imageIndex = 28;//inButton.imageIndex;
	inButton.setImageIndex(-1);
	inButton.domNode.style.background = "url(images/loadingThrobber.gif) no-repeat 0% 50%";
	if (!this.jsvalidateService)
	    this.jsvalidateService = new wm.JsonRpcService({owner: this, service: "studioService", sync: false});
	this.jsvalidateService.requestAsync("closurecompile", [inText],
					    dojo.hitch(this, function(response) {
						inButton.domNode.style.background = "";
						inButton.setImageIndex(imageIndex);

						console.log(dojo.fromJson(response));
						if (response)
						    responseObj = dojo.fromJson(response);
						
						if (!response || !responseObj.errors || !responseObj.errors.length) {
						    app.toastSuccess(this.getDictionaryItem("TOAST_CODE_VALIDATION_SUCCESS"));
						    if (this.jscompileErrorDialog)
							this.jscompileErrorDialog.hide();
						} else {
						    if (!this.jscompileErrorDialog) {
							this.jscompileErrorDialog = new wm.Dialog({
							    owner: this,
							    name: "jscompileErrorDialog",
							    useContainerWidget: true,
							    width: "220px",
							    height: "350px",
							    title: this.getDictionaryItem("TITLE_CODE_VALIDATION_DIALOG"),
							    corner: "tr",
							    modal: false});
							this.jscompileErrorList = new wm.List({
							    owner: this,
							    parent: this.jscompileErrorDialog.containerWidget,
							    dataFields: "dataValue, name",
							    columnWidths: "30px,190",
							    headerVisible: false,
							    width: "100%",
							    height: "100%"});
							this.jscompileErrorList.connect(this.jscompileErrorList, "onselect", this, function() {
							    inEditor.goToLine(this.jscompileErrorList.selectedItem.getData().dataValue, true);
							});
							this.jscompileErrorVar = new wm.Variable({
							    owner: this,
							    name: "jscompileErrorVar",
							    type: "EntryData"});
						    }
						    var data = [];
						    var errors = responseObj.errors;
						    for (var i = 0; i < errors.length; i++)
							data.push({name: errors[i].error,
								   dataValue: errors[i].lineno});
						    this.jscompileErrorVar.setData(data);
						    this.jscompileErrorList.setDataSet(this.jscompileErrorVar);
						    this.jscompileErrorDialog.show();
						}
					    }),
					    function(error) {
						inButton.domNode.style.background = "";
						inButton.setImageIndex(imageIndex);
						app.alert(error);
					    });

    },
    */
    formatScriptClick: function() {
	this.formatScript(this.editArea);
    },
    formatAppScriptClick: function() {
	this.formatScript(this.appsourceEditor);
    },

    formatScript: function(inEditor) {
	try {
	    wm.conditionalRequire("lib.github.beautify", true); 
	} catch(e){}

	var seltext = inEditor.getSelectedText();
	if (seltext) {
	    var selRange = inEditor.getSelectionRange();
	    selRange.start.column = 0;
	    selRange.end.column = 1000; // will go to the last available column
	    inEditor.setSelectionRange(selRange.start.row,selRange.start.column,selRange.end.row,selRange.end.column);
	    seltext = inEditor.getSelectedText();
	    var text = inEditor.getText();

	    // get the amount of space currently at the start of the line so we can maintain that spacing
	    var spaces = seltext.match(/^\s*/);
	    spaces = spaces[0] || "";
	    seltext = js_beautify(seltext);
	    seltext = spaces + seltext.replace(/\n/g, "\n" + spaces);
	    inEditor.replaceSelectedText(seltext);	    
	} else {
	    var text = js_beautify(inEditor.getDataValue());
	    inEditor.setText(text);
	    inEditor.setCursorPosition(0,0);
	}
    },

    refreshScriptClick: function() {
	app.confirm(this.getDictionaryItem("CONFIRM_REFRESH_SCRIPT"), false, dojo.hitch(this, function() {
            this.refreshScript();
        }));
    },	    
    refreshScript: function() {
	var updatedScript = studio.project.loadProjectData(wm.pagesFolder + studio.project.pageName + "/" + studio.project.pageName + ".js")
	studio.setScript(updatedScript);
    },



    importJavascriptLibrary: function() {
	this.beginBind(this.getDictionaryItem("TITLE_IMPORT_JAVASCRIPT"), studio.editArea, "js");
    },
    importAppJavascriptLibrary: function() {
	this.beginBind(this.getDictionaryItem("TITLE_IMPORT_JAVASCRIPT"), studio.appsourceEditor, "js");
    },
    importCssLibrary: function() {
	this.beginBind(this.getDictionaryItem("TITLE_IMPORT_JAVASCRIPT"), studio.cssEditArea, "css");
    },

    editDictionary: function() {
	if (studio.dictionaryDialog.page) {
	    studio.dictionaryDialog.page.reset();
	    studio.dictionaryDialog.show();
	} else {
	    studio.dictionaryDialog.show();
	}
    },
/*
    cssShow: function() {
	this.appCssEditArea.render();
    },
    */
/*
    getListCompletionTestObject: function(text) {
	console.log("TEST:" + text);
	if (text.match(/^this\.?$/)) return studio.page;
	text = text.replace(/^this\./,"");
	return studio.page.getValue(text);
    },
    getListCompletionObject: function(text) {
	var object = this.getListCompletionTestObject(text);
	var remainder = "";
	while (!object && text.indexOf(".") != -1) {
	    remainder += text.substring(text.lastIndexOf(".")+1);
	    text = text.substring(0,text.lastIndexOf("."));
	    object = this.getListCompletionTestObject(text);
	}
	this._autoCompletionRemainder = remainder;
	return object;
    },
    */
    getListCompletionTestObject: function(text) {
	if (text.match(/^this\.?$/)) return studio.page;
	text = text.replace(/^this\./,"");
	return studio.page.getValue(text);
    },

    /* See if this text refers to an object */
    getListCompletionObject: function(text) {
	var object = studio.page;

	// we only care about any characters starting from the last space
	// PROBLEM: There are other ways to start an expression:  ";this...."
	if (text.indexOf(" ") != -1 ) {
	    text = text.substring(text.lastIndexOf(" "));
	}

	// Strip out any trailing spaces
	text.replace(/\s*$/,""); 

	if (text == "") {
	    return object;
	} 

	// if there is a "." then either its this. or app. or its unknown.  If unknown just quit now.
	else if (text.indexOf(".") != -1 && !text.match(/(this|app)\./)) {
	    return {};
	}

	/* Remove this. as we already assume "this" refers to studio.page, and studio.page.this is meaningless */
	if (text.match(/^this\.?/)) {
	    text = text.replace(/^this\.?/,"");
	} else if (text.match(/^app\.?/)) {
	    text = text.replace(/app\.?/,"");
	    object = studio.application;
	}

	/* Remainder: text left unused */
	var remainder = "";

	/* Prefix: the part of text we are working on analyzing */
	var prefix = "";

	/* Keep working until text is empty */
	while (text.length) {

	    /* If text does not have a "." then prefix is the entire text, else its just the text until the first "." */
	    if (text.indexOf(".") == -1) {
		prefix = text;
		text = "";
	    } else {
		prefix = text.substring(0,text.indexOf("."));
		text = text.substring(text.indexOf(".")+1);
	    }

	    /* If the prefix contains a method call, we'll need to get the property definition for the method
	     * and find its return type
	     */
	    if (prefix.match(/\(/)) {
		var name = prefix.match(/^(.*)\(/)[1];
		var props = object.listProperties();
		if (props[name] && props[name].returns) {
		    if (props[name].returns.indexOf(".") != -1) {
			// see if there's an existing instance of this type; pick one at random
			object = wm.listOfWidgetType(dojo.getObject(props[name].returns))[0];
			if (!object) { // if not, grab the prototype instead
			    object = dojo.getObject(props[name].returns).prototype;
			    object._designee = object;
			}
		    } else
			object = eval("new " + props[name].returns + "()");
		} else if (props[name]) {
		    object = "-"; // if no return value, then its returning undefined
		} else {
		    remainder = prefix + (text ? "." + text : "");
		    break;
		}
	    } else {
		if (object[prefix])
		    object = object[prefix];
		else {
		    var name = prefix;
		    var props = object.listProperties();
		    if (props[name] && props[name].prototype) {		    
			if (props[name].prototype.indexOf(".") != -1) {
			// see if there's an existing instance of this type; pick one at random
			object = wm.listOfWidgetType(dojo.getObject(props[name].returns))[0];
			    if (!object) { // if not, grab the prototype instead
				object = dojo.getObject(props[name].prototype).prototype;
				object._designee = object;
			    }
			} else
			    object = eval("new " + props[name].prototype + "()");
		    } else {
			remainder = prefix + (text ? "." + text : "");
			break;
		    }
		}
	    }
	}
	this._autoCompletionRemainder = remainder;
	return object;
    },
    updateAutoComplete: function(inSender, inValue) {
	if (!inSender.isAncestorHidden()) {
	    this.listCompletions();
	}
    },
    listCompletionsAuto: function() {
	// commented this out; starting to get really really annoying...
	//this.listCompletions(true);
    },
    listCompletions: function() {
	/* Clear the description text if we're loading new completions */
	if (this.autoCompletionHtml)
	    this.autoCompletionHtml.setHtml("");

	/* Lets work with a trimmed version of the selected text...
	 * or if no selected text, a trimmed version of the text before the cursor
	 */
	var text = dojo.trim(this.editArea.getSelectedText());
	if (!text) 
	    text = dojo.trim(this.editArea.getTextBeforeCursor(true));

	/* If there is no text, then presume the user wants a "this." */
	if (!text) text = "this.";

	/* Cache our original search text so we can easily append completions to it */
	this._autoCompletionOriginalText = text;

	/* See if the text refers to a component */
	var object = this._autoCompletionObject = this.getListCompletionObject(text);

	if (object == "-") {	    
	    this._autoCompletionOriginalText = this._autoCompletionOriginalText.replace(/\.[^\.]*$/,"");
	    return;
	}
	var showprops = [];	
	if (object instanceof wm.Component) {
	    var props = object.listProperties();

	    for (var i in props) {
		var p = props[i];
		var params = "";
		if (p.group != "operation" && (p.method || !p.ignore && !p.tmpignore || p.doc)) {
			if (!this._autoCompletionRemainder || i.indexOf(this._autoCompletionRemainder) == 0) {
		    if (p.method) {
			    var methodstring = String(object[i]).toString();
			    var methodstringmatch = methodstring.match(/function\s*\(([^)]*)/);
			    params = "()";
			    if (methodstringmatch) 
				params = "(" + methodstringmatch[1] + ")";
			    //params = getArgs(object, i).substring(2);
			    //if (params == "*,args*/")
			//	params = "";
			  //  else
			//	params = "("+params + ")";

			showprops.push({name: i, 
					description: "_",
					returns: p.returns,
					params: params});
		    } else {
			showprops.push({name: i,
					description: "_"});
		    }
			}
		}
	    }

	    var classList = [object.constructor.prototype];
	    var superPrototype = object.constructor.superclass.constructor.prototype;
	    while (superPrototype) {	    
		classList.push(superPrototype);
		if (superPrototype.declaredClass == "wm.Object") break;
		superPrototype = 
		    superPrototype.constructor.superclass.prototype ||
		    superPrototype.constructor.superclass.constructor.prototype;
	    }

	    var newshowprops = [];	    
	    dojo.forEach(showprops, dojo.hitch(this, function(p) {
		if (p.prototype) {
		    if (!this._autoCompletionRemainder || p.name.indexOf(this._autoCompletionRemainder) == 0) 
			newshowprops.push(p);
		    return;
		}
		for (var i = classList.length-1; i >= 0; i--) {
		    if (classList[i].declaredClass == "wm.Bounds") {
			;
		    } else if (wm.Object.getSchemaClass(classList[i].constructor).prototype[p.name]) {			
			p.prototype = classList[i];
			if (!this._autoCompletionRemainder || p.name.indexOf(this._autoCompletionRemainder) == 0) 
			    newshowprops.push(p);			
			break;
		    }
		}
	    }));
	    showprops = newshowprops.sort(function(a,b) {
		var indexA;
		indexA = !a.prototype ? 0 : wm.Array.indexOf(classList,a.prototype, function(a,b) { if (a.declaredClass == b.declaredClass) return true;});
		var indexB;
		indexB = !b.prototype ? 0 : wm.Array.indexOf(classList,b.prototype, function(a,b) { if (a.declaredClass == b.declaredClass) return true;});

		if (indexA > indexB) return 1;
		if (indexA < indexB) return -1;

		var namea = a.name.replace(/^(set|get)/,"").toLowerCase();
		var nameb = b.name.replace(/^(set|get)/,"").toLowerCase();

		if (namea > nameb) return 1;
		if (namea < nameb) return -1;
		return 0;
	    });

	    var lastPrototype = null;
	    for (var i = 0; i < showprops.length; i++) {
		var prot = showprops[i].prototype;
		if (!lastPrototype || prot.declaredClass != lastPrototype.declaredClass) {
		    lastPrototype = prot;
		    if (lastPrototype)
			showprops.splice(i,0, {name: "<b>" + lastPrototype.declaredClass + "</b>",
					       description: "__"});
		    i++;
		}
	    }

	    if (object instanceof wm.Page) {
		var moreprops = [];
		for (var i in object) {
		    if (i.indexOf("_") != 0 && object[i] instanceof wm.Component && !props[i]) {
			if (!this._autoCompletionRemainder || i.indexOf(this._autoCompletionRemainder) == 0) {
			    if (moreprops.length == 0)
				moreprops.push({name: "<b>" + this.getDictionaryItem("AUTOCOMPLETION_LABEL_PAGE_COMPONENTS") + "</b>"});
			    if (!this._autoCompletionRemainder || i.indexOf(this._autoCompletionRemainder) == 0) 
				moreprops.push({name: i});
					    //description: object[i].declaredClass});
			}
		    }
		}
		if (moreprops.length)
		    showprops = moreprops.concat(showprops);
	    }

	} else {
	    if (object instanceof Number || typeof object == "number") {
		showprops.push({name: "<b>" + this.getDictionaryItem("AUTOCOMPLETION_LABEL_TYPE_NUMBER") + "</b>"});
	    } else if (object instanceof Boolean || typeof object == "boolean") {
		showprops.push({name: "<b>" + this.getDictionaryItem("AUTOCOMPLETION_LABEL_TYPE_BOOLEAN") + "</b>"});
	    } else if (object instanceof String || typeof object == "string") {
		showprops.push({name: "<b>" + this.getDictionaryItem("AUTOCOMPLETION_LABEL_TYPE_STRING") + "</b>"});
	    } else if (dojo.isFunction(object)) {
	   	;

	    } else {
		try {
		    console.log("OBJECT IS: " + object.toString());
		}catch(e) {}
		for (var i in object) 

		    showprops.push({name: i,
				    //description: (object[i] instanceof wm.Component) ? object[i].declaredClass : dojo.isFunction(object[i]) ? "Not a wavemaker method" : (object[i] || "").toString(),
				    params: dojo.isFunction(object[i]) ? "(???)" : ""});
	    }
	}
	if (!this.autoCompletionDialog) {
	wm.typeManager.addType("com.wavemaker.editor.completions", {internal: true, 	
		"fields": {
		    "name": {"type": "String"},
		    "description": {"type": "String"},
		    "returns": {type: "String"},
		    "params":{type: "String"}}});

	    this.autoCompletionDialog = new wm.Dialog({_classes: {domNode: ["studiodialog"]},
						       owner: this,
						       _noAutoFocus: true,
						       noTopBottomDocking: true,
						       title: this.getDictionaryItem("AUTOCOMPLETION_TITLE_DIALOG"),
						       name: "autoCompletionDialog",
						       useContainerWidget: true,
						       width: "350px",
						       height: "650px",
						       corner: "tr",
						       modal: false,
						       onDock: dojo.hitch(this, "onAutoCompletionDock"),
						       onUndock: dojo.hitch(this, "onAutoCompletionDock"),
						       });
	    this.autoCompletionDialog.containerWidget.setPadding("0,10,10,10");
	    this.autoCompletionDialog.containerWidget.setBackgroundColor("#424959");
	    var topPanel = new wm.Panel({owner: this,
				      parent: this.autoCompletionDialog.containerWidget,
				      layoutKind: "left-to-right",
				      width: "100%",
				      height: "100%"});
	    var listPanel = new wm.Panel({owner: this,
					  parent: topPanel,
					  name: "autoCompletionListPanel",
				      layoutKind: "top-to-bottom",
				      width: "150px",
				      height: "100%"});
	     new wm.Label({owner: this,
			   caption: this.getDictionaryItem("AUTOCOMPLETION_LABEL_PROPERTIES_METHODS"),
			   _classes:{domNode:["wm_FontColor_White"]},
			   parent: listPanel,
			   width: "100px",
			   height: "20px"});
	    this.autoCompletionList = new wm.FocusableList({owner: this,
							    name: "autoCompletionList",
							    _renderHiddenGrid:true,
							    parent: listPanel,
							    width: "100px",
							    height: "100%",
							    backgroundColor: "white",
							    headerVisible: false,
							    dataFields: "name"});
	    var propPanel = new wm.Panel({owner: this,
					  parent: topPanel,
					  name: "autoCompletePropPanel",
				      layoutKind: "top-to-bottom",
					  width: "100%",
					  height: "100%"});
	    var nameLabel = new wm.Label({owner: this,
					  parent: propPanel,
					  singleLine: false,
					  width: "100%",
					  height: "48px",
					  caption: this.getDictionaryItem("AUTOCOMPLETION_LABEL_NAME", {name:""})});
	    var typeLabel = new wm.Label({owner: this,
					  parent: propPanel,
					  singleLine: false,
					  width: "100%",
					  height: "48px",
					  caption: this.getDictionaryItem("AUTOCOMPLETION_LABEL_TYPE", {type:""})});
	    var paramsLabel = new wm.Label({owner: this,
					  parent: propPanel,
					  singleLine: false,
					  width: "100%",
					  height: "48px",
					    showing: false,
					    caption: this.getDictionaryItem("AUTOCOMPLETION_LABEL_PARAMS", {params:""})});
	    var returnsLabel = new wm.Label({owner: this,
					  parent: propPanel,
					  singleLine: false,
					  width: "100%",
					  height: "48px",
					    showing: false,
					     caption: this.getDictionaryItem("AUTOCOMPLETION_LABEL_RETURN", {returns: ""})});

	    new wm.Label({owner: this,
			  name: "autoCompletionHtmlLabel",
			  _classes:{domNode:["wm_FontColor_White"]},
			  caption: this.getDictionaryItem("AUTOCOMPLETION_LABEL_DESCRIPTION"),
			  padding: "4,4,4,10",
			  parent: this.autoCompletionDialog.containerWidget,
			  width: "100%",
			  height: "20px"});

	    this.autoCompletionHtml = new wm.Html({owner: this,
						   name: "autoCompletionHtml",
						   parent: this.autoCompletionDialog.containerWidget,
						   backgroundColor: "white",
						   html: this.getDictionaryItem("AUTOCOMPLETION_HTML"),
						   border: "0,0,0,0",
						   borderColor: "#424959",

						   width: "100%",
						   height: "100%"});

	    this.autoCompletionDialog.connect(this.autoCompletionDialog, "onClose", this, function() {
		if (!this.editArea.isAncestorHidden())
		    this.editArea.focus();
	    });
	
	    this.autoCompletionList.connect(this.autoCompletionList,"onselect", this, function() {
		if (this.autoCompletionList instanceof wm.Component == false) return;
		var item =  this.autoCompletionList.selectedItem.getData();
		if (!item) return;
		var itemDef = this._autoCompletionObject.listProperties()[item.name];
		var type;
		if (item.params)
		    type = "Method";
		else if (itemDef)
		    type = itemDef.type || "";
		else if (dojo.isObject(this._autoCompletionObject[item.name]))
		    type = this._autoCompletionObject[item.name].declaredClass || "Object";
		nameLabel.setCaption(this.getDictionaryItem("AUTOCOMPLETION_LABEL_NAME", {name: item.name||""}));
		typeLabel.setCaption(this.getDictionaryItem("AUTOCOMPLETION_LABEL_TYPE", {type: type||""}));
		paramsLabel.setCaption(this.getDictionaryItem("AUTOCOMPLETION_LABEL_PARAMS", {params: item.params || ""}));
		paramsLabel.setShowing(Boolean(item.params));
		returnsLabel.setCaption(this.getDictionaryItem("AUTOCOMPLETION_LABEL_RETURN", {returns: item.returns || ""}));
		returnsLabel.setShowing(Boolean(item.returns));
		if (item.description != "_")
		    this.autoCompletionHtml.setHtml(item.description);
		else {
		    var property = item.name;
		    studio.loadHelp(this._autoCompletionObject.declaredClass, property, dojo.hitch(this, function(inResponse) {
			this.autoCompletionHtml.setHtml(inResponse);			
		    }));
		}
	    });
	
	    this.autoCompletionList.connect(this.autoCompletionList,"ondblclick", this, "insertCompletedText");
	    this.autoCompletionVariable = new wm.Variable({owner: this,
						       name: "autoCompletionVariable",
						       type: "com.wavemaker.editor.completions"});

	    this.autoCompletionDialog.setDocked(true, studio.dockLeftPanel);
	}
	this.autoCompletionHtml.setHtml("<b>" + this.getDictionaryItem("AUTOCOMPLETION_HTML") + "</b>");
	//this.autoCompletionDialog.setTitle(object.toString().replace(/[\[\]]/g,""));
	this.autoCompletionVariable.setData(showprops);
	this.autoCompletionList.setDataSet(this.autoCompletionVariable);

	var count = 0;
	for (var i = 0; i < showprops.length; i++) {
	    if (showprops[i].data.name.match(/\<b\>/)) {
		dojo.addClass(this.autoCompletionList.getItem(i).domNode, "CompletionListHeader");
	    } else {
		count++;
	    }
	}
	if (count == 0)
	    this.autoCompletionHtml.setHtml(this.getDictionaryItem("AUTOCOMPLETION_TYPE_NOT_SUPPORTED"));

	this.autoCompletionDialog.setTitle(object && object.declaredClass && object instanceof wm.Page == false ? object.declaredClass : "Completions");
	this.autoCompletionDialog.show();
	window.setTimeout(dojo.hitch(this, "autoCompletionDialogAutoHide"), 5000);
    },
    hideAutoComplete: function() {
	if (this.autoCompletionDialog)
	    this.autoCompletionDialog.hide();
    },
    onAutoCompletionDock: function() {
	var show = !this.autoCompletionDialog.docked;
	this.$.autoCompletePropPanel.setShowing(show);
	this.autoCompletionHtml.setShowing(show);
	this.$.autoCompletionHtmlLabel.setShowing(show);
	this.$.autoCompletionListPanel.setWidth(show ? "150px" : "100%");
    },
    insertCompletedText: function() {
		var data = this.autoCompletionList.selectedItem.getData();
		if (data.description == "__") return;
		var text = this._autoCompletionOriginalText;
		text = text.substring(0,text.length-this._autoCompletionRemainder.length);
		
		var data = this.autoCompletionList.selectedItem.getData();
		text = text.replace(/\.?\s*$/, "." + data.name + (data.params || ""));
	if (!text.match(/^(this|app)/)) {
	    var newtext = this._autoCompletionObject == studio.page ? "this" : "app";
	    text = newtext + (text.indexOf(".") == 0 ? "" : ".") + text;
	}
		if (!this.editArea.getSelectedText()) {
		    var pos = this.editArea.getCursorPosition();
		    this.editArea.setSelectionRange(pos.row, Math.max(0,pos.column - this._autoCompletionOriginalText.length - 1), pos.row,pos.column);
		    var replaceText = this.editArea.getSelectedText();
		    var replaceTextTrim = replaceText.replace(/^\s*/,"");
		    var range = this.editArea.getSelectionRange();
		    this.editArea.setSelectionRange(range.start.row, range.start.column + replaceText.length-replaceTextTrim.length, range.end.row,range.end.column);
		}

		this.editArea.replaceSelectedText(text);
		this.listCompletions();
    },
    autoCompletionDialogAutoHide: function() {
	if (this.autoCompletionDialog.showing) {
	    if (this.editArea.isAncestorHidden())
		this.autoCompletionDialog.hide();
	    else 
		window.setTimeout(dojo.hitch(this, "autoCompletionDialogAutoHide"), 5000);
	}

    },
    setEditAreaDirty: function(inSender) {
	var name = inSender.name;
	var originalText = "";
	switch(name) {
	case "editArea":
	    originalText = this._cleanPageData ? this._cleanPageData.js : ""
	    break;
	case "cssEditArea":
	    originalText = this._cleanPageData ? this._cleanPageData.css : ""
	    break;
	case "appCssEditArea":
	    originalText = this._cleanAppData ? this._cleanAppData.css : ""
	    break;
	case "markupEditArea":
	    originalText = this._cleanPageData ? this._cleanPageData.html : ""
	    break;
	case "appsourceEditor":
	    originalText = this._cleanAppData ? this._cleanAppData.js : ""
	    break;
	}
	var changed = originalText != inSender.getText();
	var parent = inSender;
	while (parent instanceof wm.Layer == false) {
	    parent = parent.parent;
	}
	var caption = parent.caption;
	var newCaption = (changed ? "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " : "") + caption.replace(/^\<.*?\>\s*/,"");
	if (caption != newCaption) {
	    parent.setCaption(newCaption);
	    this.updateSourceDirty();
	}
    }
});