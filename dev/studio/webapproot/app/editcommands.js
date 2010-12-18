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
	    this.waitForCallback(bundleDialog.M_SavingScript + this.project.projectName, dojo.hitch(this.project, "saveScript"));
	},
        saveAppSrcClick: function() {
	    if (this.appsrcPageCompileChkBtn.getChecked()) 
		this.validateAppScriptClick();
		this.waitForCallback(bundleDialog.M_SavingAppScript + this.project.projectName, dojo.hitch(this.project, "saveAppScript"));
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
	case "l":
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
	case "l":
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
	case "l":
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
	case "l":
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
	    dojo.require("lib.github.beautify");
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
	    dojo.require("lib.github.beautify");
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
    getListCompletionObject: function(text) {
	var object = studio.page;
	text = text.replace(/^this\.?/,"");
	var remainder = "";
	var prefix = "";
	while (text.length) {
	    if (text.indexOf(".") == -1) {
		prefix = text;
		text = "";
	    } else {
		prefix = text.substring(0,text.indexOf("."));
		text = text.substring(text.indexOf(".")+1);
	    }
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
    listCompletions: function(noAutoSelect) {
	if (this.autoCompletionHtml)
	    this.autoCompletionHtml.setHtml("");

	var text = dojo.trim(this.editArea.getSelectedText());
	if (!text) 
	    text = dojo.trim(this.editArea.getTextBeforeCursor(!noAutoSelect));
	if (!text && noAutoSelect) return;
	if (!text) text = "this.";
	this._autoCompletionOriginalText = text;
/*
	if (!text.match(/\s*this\.?$/)) {
	    text = text.replace(/^\s*this\./,"");
	    text = text.replace(/\.\s*$/,"");
	    var object = studio.page.getValue(text);
	} else {
	    object = studio.page;
	}
	*/

	var object = this.getListCompletionObject(text);


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
		if (p.description) {
		    if (!this._autoCompletionRemainder || i.indexOf(this._autoCompletionRemainder) == 0)
			showprops.push({name: i, 
					description: p.description,
					params: p.params});
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
			showprops.splice(i,0, {name: "<b>" + lastPrototype.declaredClass + "</b>"});
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
			    moreprops.push({name: i, 
					    description: object[i].declaredClass});
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
				    description: (object[i] instanceof wm.Component) ? object[i].declaredClass : dojo.isFunction(object[i]) ? "Not a wavemaker method" : (object[i] || "").toString(),
				    params: dojo.isFunction(object[i]) ? "(???)" : ""});
	    }
	}
	if (!this.autoCompletionDialog) {
	wm.typeManager.addType("com.wavemaker.editor.completions", {internal: true, 	
		"fields": {
		    "name": {"type": "String"},
		    "description": {"type": "String"},
		    "params":{type: "String"}}});


	    this.autoCompletionDialog = new wm.Dialog({owner: this,
						       _noAutoFocus: true,
						       title: "Completions",
						       name: "autoCompletionDialog",
						       useContainerWidget: true,
						       width: "255px",
						       height: "500px",
						       corner: "tr",
						       modal: false});
	    this.autoCompletionDialog.containerWidget.setPadding("0,10,10,10");
	    this.autoCompletionDialog.containerWidget.setBackgroundColor("#424959");
	    var panel = new wm.Panel({owner: this,
				      parent: this.autoCompletionDialog.containerWidget,
				      layoutKind: "left-to-right",
				      width: "100%",
				      height: "20px"});
	     new wm.Label({owner: this,
			   caption: "Methods",
			   _classes:{domNode:["wm_FontColor_White"]},
			   parent: panel,
			   width: "100px",
			   height: "100%"});
	    new wm.Label({owner: this,
			  _classes:{domNode:["wm_FontColor_White"]},
			  caption: "Description",
			  padding: "4,4,4,10",
			  parent: panel,
			  width: "100%",
			  height: "100%"});
	    var panel2 = new wm.Panel({owner: this,
				      parent: this.autoCompletionDialog.containerWidget,
				      layoutKind: "left-to-right",
				      width: "100%",
				      height: "100%"});
	    this.autoCompletionList = new wm.FocusableList({owner: this,
							    name: "autoCompletionList",
							    parent: panel2,
							    width: "100px",
							    height: "100%",
							    backgroundColor: "white",
							    headerVisible: false,
							    dataFields: "name"});
	    this.autoCompletionHtml = new wm.Html({owner: this,
						   name: "autoCompletionHtml",
						   parent: panel2,
						   backgroundColor: "white",
						   html: "Select a term to see description; double click to add it to your code",
						   border: "0,0,0,10",
						   borderColor: "#424959",

						   padding: "4",
						   width: "100%",
						   height: "100%"});

	    this.autoCompletionDialog.connect(this.autoCompletionDialog, "onClose", this, function() {
		if (!this.editArea.isAncestorHidden())
		    this.editArea.focus();
	    });

	    this.autoCompletionList.connect(this.autoCompletionList,"onselect", this, function() {
		this.autoCompletionHtml.setHtml(this.autoCompletionList.selectedItem.getData().description);
	    });

	    this.autoCompletionList.connect(this.autoCompletionList,"ondblclick", this, function() {
		var data = this.autoCompletionList.selectedItem.getData();
		if (!data.description) return;
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
	this.autoCompletionDialog.setTitle(object.toString().replace(/[\[\]]/g,""));
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

    }
});