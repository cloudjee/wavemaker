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

    validateScriptCheckboxChange: function(inSender) {
	dojo.cookie(this.scriptPageCompileChkBtn.getRuntimeId(), inSender.getChecked());
    },


	saveScriptClick: function() {
	    if (this.scriptPageCompileChkBtn.getChecked()) 
		this.validateScriptClick();
	    studio.saveAll(studio.project);
	    //this.waitForCallback(bundleDialog.M_SavingScript + this.project.projectName, dojo.hitch(this.project, "saveScript"));
	},
        saveAppSrcClick: function() {
	    if (this.appsrcPageCompileChkBtn.getChecked()) 
		this.validateAppScriptClick();
	    //this.waitForCallback(bundleDialog.M_SavingAppScript + this.project.projectName, dojo.hitch(this.project, "saveAppScript"));
	    studio.saveAll(studio.project);
	},


    toggleWrapScriptClick: function() {
	this._editAreaScriptWrapping = (this._editAreaScriptWrapping == undefined) ? false : !this._editAreaScriptWrapping;
	this.editArea.setWordWrap(this._editAreaScriptWrapping);
    },
    toggleWrapAppScriptClick: function() {
	this._editAreaAppScriptWrapping = (this._editAreaAppScriptWrapping == undefined) ? false : !this._editAreaAppScriptWrapping;
	this.appsourceEditor.setWordWrap(this._editAreaAppScriptWrapping);
    },
    toggleWrapCssClick: function() {
	this._editAreaCssWrapping = (this._editAreaCssWrapping == undefined) ? false : !this._editAreaCssWrapping;
	this.cssEditArea.setWordWrap(this._editAreaCssWrapping);
	this.appCssEditArea.setWordWrap(this._editAreaCssWrapping);
    },
    toggleWrapMarkupClick: function() {
	this._editAreaMarkupWrapping = (this._editAreaMarkupWrapping == undefined) ? false : !this._editAreaMarkupWrapping;
	this.markupEditArea.setWordWrap(this._editAreaMarkupWrapping);
    },

    scriptEditorCtrlKey: function(inSender, letter) {
	switch(letter.toLowerCase()) {
	case "s":
	    return this.saveScriptClick();
	case "e":
	    return this.validateScriptClick();
	case "i":
	    return this.formatScriptClick();
	case "o":
	    return this.toggleWrapScriptClick();
	case "g":
	    return this.editArea.promptGotoLine();
	case "n":
	    return this.listCompletions();
	}
    },
    appScriptEditorCtrlKey: function(inSender, letter) {
	switch(letter.toLowerCase()) {
	case "s":
	    return this.saveAppSrcClick();
	case "e":
	    return this.validateAppScriptClick();
	case "i":
	    return this.formatAppScriptClick();
	case "o":
	    return this.toggleWrapAppScriptClick();
	case "g":
	    return this.appsourceEditor.promptGotoLine();
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
	case "o":
	    return this.toggleWrapCssClick();
	case "g":
	    return this.cssEditArea.promptGotoLine();
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
	    return this.toggleWrapMarkupClick();
	case "g":
	    return this.markupEditArea.promptGotoLine();
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

    validateScriptClick: function() {
	this.validate(this.editArea.getText(), this.editArea, this.scriptPageCompileBtn);
    },
    validateAppScriptClick: function() {
	this.validate(this.appsourceEditor.getText(), this.appsourceEditor, this.appsrcPageCompileBtn);
    },

    validate: function(inText, inEditor, inButton) {
	var imageIndex = inButton.imageIndex;
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
						    app.toastSuccess("No errors found");
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
							    title: "Compiler Results",
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



    formatScriptClick: function() {
	try {
	    wm.conditionalRequire("lib.github.beautify", true); 
	} catch(e){}
	var start = editAreaLoader.getSelectionRange(this.editArea.area.textarea.id).start;
	var end = editAreaLoader.getSelectionRange(this.editArea.area.textarea.id).end;
	var seltext = this.editArea.getSelectedText() ;
	var text = this.editArea.getText();

	// If selected text, select all the way to the start of the line
	if (seltext) {
	    for (var i = start; i >=0; i--) {
		if (text.charAt(i) == "\n") {
		    i++;
		    break;
		}
	    }
	    this.editArea.setSelectionRange(i,end);
	    seltext = this.editArea.getSelectedText();
	    var spaces = seltext.match(/^\s*/);
	    spaces = spaces[0] || "";
	    seltext = js_beautify(seltext);
	    seltext = spaces + seltext.replace(/\n/g, "\n" + spaces);
	    this.editArea.replaceSelectedText(seltext);	    
	} else {
	    text = js_beautify(text);
	    this.editArea.setText(text);
	    this.editArea.setSelectionRange(start, start);
	}
    },
    formatAppScriptClick: function() {
	try {
	    wm.conditionalRequire("lib.github.beautify", true); 
	} catch(e){}
	var start = editAreaLoader.getSelectionRange(this.appsourceEditor.area.textarea.id).start;
	this.appsourceEditor.setText(js_beautify(this.appsourceEditor.getText()));
	this.appsourceEditor.setSelectionRange(start, start);
    },



    refreshScriptClick: function() {
	app.confirm(bundleDialog.M_AreYouSureReload, false, dojo.hitch(this, function() {
            this.refreshScript();
        }));
    },	    
    refreshScript: function() {
	var updatedScript = studio.project.loadProjectData(wm.pagesFolder + studio.project.pageName + "/" + studio.project.pageName + ".js")
	studio.setScript(updatedScript);
    },



    importJavascriptLibrary: function() {
	this.beginBind("Script Importer", studio.editArea, "js");
    },
    importAppJavascriptLibrary: function() {
	this.beginBind("Script Importer", studio.appsourceEditor, "js");
    },
    importCssLibrary: function() {
	this.beginBind("Css Importer", studio.cssEditArea, "css");
    },

    cssShow: function() {
	this.appCssEditArea.render();
    },

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
	console.log("TEST:" + text);
	if (text.match(/^this\.?$/)) return studio.page;
	text = text.replace(/^this\./,"");
	return studio.page.getValue(text);
    },

    /* See if this text refers to an object */
    getListCompletionObject: function(text) {
	var object = studio.page;

	/* Remove this. as we already assume "this" refers to studio.page, and studio.page.this is meaningless */
	text = text.replace(/^this\.?/,"");

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
		    if (props[name].returns.indexOf(".") != -1)
			object = dojo.getObject(props[name].returns).prototype;
		    else
			object = eval("new " + props[name].returns + "()");
		} else {
		    remainder = prefix + (text ? "." + text : "");
		    break;
		}
	    } else {
		if (object[prefix])
		    object = object[prefix];
		else {
		    remainder = prefix + (text ? "." + text : "");
		    break;
		}
	    }
	}
	this._autoCompletionRemainder = remainder;
	return object;
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


	if (!object) {
	    if (!text)
		app.alert("Please select text, such as 'this.button1', or 'button1', and if your page has a button1 in it, we will list suitable methods you can call on that object");
	    else
		app.alert("\"" + text + "\" not found. Please select text, such as 'this.button1', or 'button1', and if your page has a button1 in it, we will list suitable methods you can call on that object");
	    return;
	}
	var showprops = [];	
	if (object instanceof wm.Component) {
	    var props = object.listProperties();

	    for (var i in props) {
		var p = props[i];
		var params = "";
		if (p.doc) {
		    if (!this._autoCompletionRemainder || i.indexOf(this._autoCompletionRemainder) == 0) {
			 params = getArgs(object, i).substring(2);
		    if (params == "*,args*/")
			params = "";
		    else
			params = "("+params + ")";
		    }
			showprops.push({name: i, 
					description: "_",
					returns: p.returns,
					params: params});
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

	    dojo.forEach(showprops, function(p) {
		if (p.prototype) return;
		for (var i = classList.length-1; i >= 0; i--) {
		    if (wm.Object.getSchemaClass(classList[i].constructor).prototype[p.name]) {
			if (classList[i].declaredClass == "wm.Bounds")
			    i--;
			p.prototype = classList[i];
			break;
		    }
		}
	    });
	    showprops = showprops.sort(function(a,b) {
		var indexA;
		indexA = wm.Array.indexOf(classList,a.prototype, function(a,b) { if (a.declaredClass == b.declaredClass) return true;});
		var indexB;
		indexB = wm.Array.indexOf(classList,b.prototype, function(a,b) { if (a.declaredClass == b.declaredClass) return true;});

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
				moreprops.push({name: "<b>Page Components</b>"});
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
		console.log("OBJECT IS NUMBER");
		showprops.push({name: "<b>Number</b>"});
	    } else if (object instanceof Boolean || typeof object == "boolean") {
		console.log("OBJECT IS BOOLEAN");
		showprops.push({name: "<b>Boolean</b>"});
	    } else if (object instanceof String || typeof object == "string") {
		console.log("OBJECT IS STRING");
		showprops.push({name: "<b>String</b>"});

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


	    this.autoCompletionDialog = new wm.Dialog({owner: this,
						       _noAutoFocus: true,
						       title: "Completions",
						       name: "autoCompletionDialog",
						       useContainerWidget: true,
						       width: "350px",
						       height: "650px",
						       corner: "tr",
						       modal: false});
	    this.autoCompletionDialog.containerWidget.setPadding("0,10,10,10");
	    this.autoCompletionDialog.containerWidget.setBackgroundColor("#424959");
	    var topPanel = new wm.Panel({owner: this,
				      parent: this.autoCompletionDialog.containerWidget,
				      layoutKind: "left-to-right",
				      width: "100%",
				      height: "50%"});
	    var listPanel = new wm.Panel({owner: this,
					  parent: topPanel,
				      layoutKind: "top-to-bottom",
				      width: "150px",
				      height: "100%"});
	     new wm.Label({owner: this,
			   caption: "Properties/Methods",
			   _classes:{domNode:["wm_FontColor_White"]},
			   parent: listPanel,
			   width: "100px",
			   height: "20px"});
	    this.autoCompletionList = new wm.FocusableList({owner: this,
							    name: "autoCompletionList",
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
					  caption: "<b>Name:</b>"});
	    var typeLabel = new wm.Label({owner: this,
					  parent: propPanel,
					  singleLine: false,
					  width: "100%",
					  height: "48px",
					  caption: "<b>Type:</b>"});
	    var paramsLabel = new wm.Label({owner: this,
					  parent: propPanel,
					  singleLine: false,
					  width: "100%",
					  height: "48px",
					    showing: false,
					  caption: "<b>Parameters:</b>"});
	    var returnsLabel = new wm.Label({owner: this,
					  parent: propPanel,
					  singleLine: false,
					  width: "100%",
					  height: "48px",
					    showing: false,
					  caption: "<b>Returns:</b>"});

	    new wm.Label({owner: this,
			  _classes:{domNode:["wm_FontColor_White"]},
			  caption: "Description",
			  padding: "4,4,4,10",
			  parent: this.autoCompletionDialog.containerWidget,
			  width: "100%",
			  height: "20px"});

	    this.autoCompletionHtml = new wm.Html({owner: this,
						   name: "autoCompletionHtml",
						   parent: this.autoCompletionDialog.containerWidget,
						   backgroundColor: "white",
						   html: "Select a term to see description; double click to add it to your code",
						   border: "0,0,0,0",
						   borderColor: "#424959",

						   width: "100%",
						   height: "50%"});

	    this.autoCompletionDialog.connect(this.autoCompletionDialog, "onClose", this, function() {
		if (!this.editArea.isAncestorHidden())
		    this.editArea.focus();
	    });

	    this.autoCompletionList.connect(this.autoCompletionList,"onselect", this, function() {
		var item =  this.autoCompletionList.selectedItem.getData();
		var itemDef = this._autoCompletionObject.listProperties()[item.name];
		var type;
		if (item.params)
		    type = "Method";
		else if (itemDef)
		    type = itemDef.type || "";
		else if (dojo.isObject(this._autoCompletionObject[item.name]))
		    type = this._autoCompletionObject[item.name].declaredClass || "Object";
		nameLabel.setCaption("<b>Name:</b><br/>&nbsp;&nbsp;&nbsp;" + item.name);
		typeLabel.setCaption("<b>Type:</b><br/>&nbsp;&nbsp;&nbsp;" + type);
		paramsLabel.setCaption("<b>Parameters:</b><br/>&nbsp;&nbsp;&nbsp;" + (item.params || ""));
		paramsLabel.setShowing(Boolean(item.params));
		returnsLabel.setCaption("<b>Returns:</b><br/>&nbsp;&nbsp;&nbsp;" + (item.returns || ""));
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

	    this.autoCompletionList.connect(this.autoCompletionList,"ondblclick", this, function() {
		var data = this.autoCompletionList.selectedItem.getData();
		if (data.description == "__") return;
		var text = this._autoCompletionOriginalText;
		text = text.substring(0,text.length-this._autoCompletionRemainder.length);
		
		var data = this.autoCompletionList.selectedItem.getData();
		text = text.replace(/\.?\s*$/, "." + data.name + (data.params || ""));

		if (!this.editArea.getSelectedText())
		    this.editArea.getTextBeforeCursor(true);

		this.editArea.replaceSelectedText(text);
		this.listCompletions();
	    });
	    this.autoCompletionVariable = new wm.Variable({owner: this,
						       name: "autoCompletionVariable",
						       type: "com.wavemaker.editor.completions"});
	}
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
	    this.autoCompletionHtml.setHtml("We do not provide information on this kind of object");

	this.autoCompletionDialog.show();
	window.setTimeout(dojo.hitch(this, "autoCompletionDialogAutoHide"), 5000);
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