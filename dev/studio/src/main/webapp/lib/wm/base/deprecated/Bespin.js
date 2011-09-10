/*
 *  Copyright (C) 2010-2011 VMWare, Inc. All rights reserved.
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


/****

 * CTRL-shift-J: Joins current line with next line
 * CTRL-g: findnext
 * CTRL-shift-G: findprior
 * CTRL-z:undo
 ***/
dojo.provide("wm.base.widget.Bespin");


dojo.declare("wm.Bespin", wm.Container, {
    // design mode property
    scrim: true,

    // container properties
    layoutKind: "left-to-right",
    horizontalAlign: "left",
    verticalAlign: "top",
    minWidth: "300",
    minHeight: "300",

    // Access to bespin objects
    _editor: null,
    _env: null,

    // bespin props
    syntax: "js",
    fontSize: "10",
    fontFace: "Monaco, Lucida Console, monospace",
    dataValue: "dojo.declare('myclass', null, {\n});",
    tabSize: 4,

    // toolbar props
    useSearchToolbar: true,
    _lastFind: "",
    prettyPrintButton: false,
    evalButton: false,
    toolbarId: "",

    // autocompletion props
    useAutoCompletion: false, // only works for javascript
    autoCompletionThisPointer: "main",    

    // wm.Control props
    width: "100%",
    height: "200px",
    margin: "6",
    init: function() {
	var head = document.getElementsByTagName("head")[0];
	
	var link = document.createElement("link");
	link.id = "bespin_base";
	link.href = "/wavemaker/lib/bespin/prebuilt";
	head.appendChild(link);

	var script = document.createElement("script");
	script.src = "/wavemaker/lib/bespin/prebuilt/BespinEmbedded.js"
	head.appendChild(script);

	this.inherited(arguments);
    },
    postInit: function() {
	this.inherited(arguments);
	this.leftContainer = new wm.Container({lock: true, name: "leftContainer", width: "100%", height: "100%", layoutKind: "top-to-bottom", horizontalAlign: "left", verticalAlign: "top", parent: this, owner: this});

	if (this.toolbarId) 
	    this.toolBar = this.owner.getValue(this.toolbarId);
	else
	    this.toolBar = new wm.Container({name: "toolBar", width: "100%", height: "25px", layoutKind: "left-to-right", owner: this, parent: this.leftContainer});
        this.bespinControl = new wm.Control({name: "bespinControl", width: "100%", height: "100%", parent: this.leftContainer, owner: this});
        this.bespinControl.connect(this.bespinControl, "renderBounds", this, function() {
	    if (this._env) {
		wm.job(this.getRuntimeId() + ":dimensionsChanged", 10, dojo.hitch(this, function() {
		    this._editor.dimensionsChanged();
		}));
	    }
        });

        this.buildToolbar();
	if (this.useAutoCompletion) {
	    this.autoCompletionList = new wm.List({name: "autoCompletionList",
						   width: "120px",
						   height: "100%",
						   headerVisible: false,
						   parent: this,
						   owner: this});
	    this.autoCompletionList.connect(this.autoCompletionList, "onselect", this, function() {

		var length = this._findRemainder.length + this._findToken.length;
		this._editor.selection = {end:   this._editor.selection.end,
					  start: {row: this._editor.selection.end.row,
						  col: this._editor.selection.end.col-length}};

		var newtext = this._findToken + 
		    ((this._findRemainder) ? "." + this._findRemainder : "") + 
		    this.autoCompletionList.selectedItem.getData().dataValue;
		this._editor.selectedText = newtext;

		this._editor.selection = {end:   this._editor.selection.end,
					  start: {row: this._editor.selection.end.row,
						  col: this._editor.selection.end.col-newtext.length}};


		//this._editor.setCursor(this._editor.selection.end);
		//this.focus();		
	    });
	    this.autoCompletionVar = new wm.Variable({name: "autoCompletionVar",
						      type: "StringData",
						      isList: true,
						      owner: this});
	    this.autoCompletionList.setDataSet(this.autoCompletionVar);
	    this.autoCompletionThisRegex = new RegExp("^this.");
	}

	this.connect(this.domNode, "onkeydown", this, "handleKeyPress");

    },
    renderBounds: function() {
	this.inherited(arguments);

	// return if we either aren't ready to generate the editor or we already have the editor
	if (this._cupdating || this.owner._loadingPage || this.isAncestorHidden() || !this.bespinControl || this._editor) 
	    return;
	if (wm.Bespin.onLoadFinished)
	    this.initBespinObject();
	else
	    this.connect(null, "onBespinLoad", this, "initBespinObject");
    },
    buildToolbar: function() {
	this.gotoLineButton = new wm.ToolButton({name: "gotoLineButton", 
						 caption: "C-L",
						 hint: "Goto Line",
						 backgroundColor: "transparent", 
						 width: "30px", 
						 height: "100%", 
						 parent: this.toolBar, 
						 owner: this});
	this.gotoLineButton.connect(this.gotoLineButton, "onclick", this, function() {
	    this.promptGotoLine();
	});

	this.saveButton = new wm.ToolButton({name: "saveButton", 
						 caption: "C-S",
						 hint: "Save",
						 backgroundColor: "transparent", 
						 width: "30px", 
						 height: "100%", 
						 parent: this.toolBar, 
						 owner: this});
	this.saveButton.connect(this.saveButton, "onclick", this, function() {
	    this.onSave();
	});

	if (this.prettyPrintButton) {
	    this.pretifyButton = new wm.ToolButton({name: "pretifyButton", 
						    caption: "C-i",
						    hint: "Indent/format javascript",
						    backgroundColor: "transparent", 
						    width: "30px", 
						    height: "100%", 
						    parent: this.toolBar, 
						    owner: this});
	    this.pretifyButton.connect(this.pretifyButton, "onclick", this, function() {
		this.prettyPrint();
	    });
	}

	if (this.evalButton) {
	    this.evalButton = new wm.ToolButton({name: "evalButton", 
						 caption: "C-E",
						 hint: "Evaluate Code",
						 backgroundColor: "transparent", 
						 width: "30px", 
						 height: "100%", 
						 parent: this.toolBar, 
						 owner: this});
	    this.evalButton.connect(this.evalButton, "onclick", this, function() {
		this.jsvalidate();
	    });
	}

        if (this.useSearchToolbar) {
            this.searchSpacer = new wm.Spacer({name: "searchSpacer", width: "100%", height: "1px", parent: this.toolBar, owner: this});

            this.searchEditor = new wm.Text({name: "searchEditor", caption: "Find", captionSize: "50px", width: "200px", height: "100%", changeOnKey: true, parent: this.toolBar, owner: this});
            this.searchEditor.connect(this.searchEditor, "dokeypress", this, function(e) {
		wm.onidle(this, function() {
		    this.handleSearchKey(this.searchEditor.getDataValue(), e);
		});
	    });

            this.replacePopupButton = new wm.ToolButton({name: "replacePopupButton", 
							 iconUrl: dojo.moduleUrl("wm.base.widget.themes.wm_default.images") + "comboArrowDownDark.png", 
							 backgroundColor: "transparent", 
							 width: "8px", 
							 height: "100%", 
							 margin: "8,0,0,0", 
							 parent: this.toolBar, 
							 owner: this});
	    this.replacePopupButton.domNode.tabIndex = -1;
	    this.replacePopupButton.connect(this.replacePopupButton, "onclick", this, function() {
		this.showFindDialog();

	    });
        }
    },
    showFindDialog: function() {
	this.getFindDialog().setShowing(!this.getFindDialog().showing);
	if (this.searchEditor.getDataValue())
	    this.fullSearchEditor.setDataValue(this.searchEditor.getDataValue());
	    this.fullSearchEditor.focus();
    },
    prettyPrint: function() {
	    try {
		dojo.require("lib.github.beautify");
	    } catch(e){}
	    this.setDataValue(js_beautify(this.getDataValue()));
    },
    getFindDialog: function() {
	if (this.findDialog) return this.findDialog;

	this.findDialog = new wm.Dialog({owner: this,
					 width: "350px",
					 height: "100px",
					 title: "",
					 modal: false,
					 noEscape: false,
					 border: "2",
					 useContainerWidget: true,
					 useButtonBar: true,
					 fixPositionNode: this.replacePopupButton.domNode
					});
	var container = this.findDialog.containerWidget;
	this.fullSearchEditor = new wm.Text({name: "fullSearchEditor", 
					     caption: "Find", 
					     captionSize: "80px", 
					     width: "100%",
					     changeOnKey: true, 
					     parent: container,
					     owner: this.findDialog});
        this.fullSearchEditor.connect(this.fullSearchEditor, "dokeypress", this, function(e) {
		wm.onidle(this, function() {
		    this.handleSearchKey(this.searchEditor.getDataValue(), e);
		});
	});


	this.fullReplaceEditor = new wm.Text({name: "fullReplaceEditor", 
					      caption: "Replace", 
					      captionSize: "80px", 
					      width: "100%",
					      emptyValue: "emptyString",
					      changeOnKey: false,
					      parent: container,
					      owner: this.findDialog});
	var buttonBar = this.findDialog.buttonBar;

	this.findPrevButton = new wm.Button({name: "findPrevButton",
					       caption: "Previous",
					       width: "80px",
					       parent: buttonBar,
					       owner: this.findDialog});
	this.findPrevButton.connect(this.findPrevButton, "onclick", this, function() {
	    this.doFind(this.fullSearchEditor.getDataValue(), true);
	});


	this.findNextButton = new wm.Button({name: "findNextButton",
					       caption: "Next",
					       width: "80px",
					       parent: buttonBar,
					       owner: this.findDialog});
	this.findNextButton.connect(this.findNextButton, "onclick", this, function() {
	    this.doFind(this.fullSearchEditor.getDataValue(), false);
	});



	this.replaceOneButton = new wm.Button({name: "replaceOneButton",
					       caption: "Replace",
					       width: "80px",
					       parent: buttonBar,
					       owner: this.findDialog});
	this.replaceOneButton.connect(this.replaceOneButton, "onclick", this, function() {
	    this._editor.selectedText = this.fullReplaceEditor.getDataValue();
	});


	this.replaceAllButton = new wm.Button({name: "replaceAllButton",
					       caption: "Replace All",
					       width: "100px",
					       parent: buttonBar,
					       owner: this.findDialog});
	this.replaceAllButton.connect(this.replaceAllButton, "onclick", this, function() {
	    while(this.doFind(this.fullSearchEditor.getDataValue())) {
		this._editor.selectedText = this.fullReplaceEditor.getDataValue();
	    }
	});
	return this.findDialog;
    },
					       
    initBespinObject: function() {
	if (this._initBespinCalled) return;
	this._initBespinCalled = true;
	while(this.bespinControl.domNode.childNodes.length)
	    dojo.destroy(this.bespinControl.domNode.childNodes[0]);
    
	bespin.useBespin(this.bespinControl.domNode,
			 {
			     syntax:     this.syntax			     
			 }).then(dojo.hitch(this, function(env) {
			      this._editor = env.editor;
			     this._editor.value = this.dataValue;


			     /* Important to understand that these settings are not widget specific,
			      * they will affect ALL bespin editors
			      */
			     this._env = env;
			     this._env.settings.set("tabstop", this.tabSize);
			     this._env.settings.set("fontsize", this.fontSize);
			     this._env.settings.set("fontface", this.fontFace);
			      //theme
			      //customKeymapping

			      this._editor.syntax = this.syntax;
			      this._editor.textChanged.add(dojo.hitch(this, "_change"));
			      this._editor.selectionChanged.add(dojo.hitch(this, "_selectionChange"));
			     console.log("CLIENT HEIGHT: " + this._editor.container.clientHeight + "; " + this.toString());
/*
			     if (!this._editor.container.clientHeight) {
				     delete this._initBespinCalled;
				     console.log("TRY AGAIN");
				 window.setTimeout(dojo.hitch(this, "initBespinObject"), 200);
			     }
			     */
			 }));
    },
    handleSearchKey: function(text, e) {
	if (e.keyCode == dojo.keys.TAB) return;
	if (e.ctrlKey && e.keyCode == 70) {
	    this.showFindDialog();
	    return;
	}
	if (e.keyCode == 13 || e.keyCode == 8 || e.keyCode >= 46 && e.keyCode <= 90 || e.keyCode >= 96 && e.keyCode <= 111 || e.keyCode >= 186 && e.keyCode <=222) {
	    this._editor.setCursor(this._editor.selection.start);
	    this.doFind(text, e.keyCode == 8 || e.keyCode == 46);
	}
    },
    handleKeyPress: function(e) {
	if (e.ctrlKey) {
	    switch(e.keyCode) {
	    case 69:
		if (this.evalButton) {
		    this.jsvalidate();
		    dojo.stopEvent(e);
		}
		break;
	    case 70:
		this.searchEditor.focus();
		dojo.stopEvent(e);
		break;
	    case 71:
		this.promptGotoLine();
		dojo.stopEvent(e);
		break;
	    case 73:
		if (this.prettyPrintButton) {
		    this.prettyPrint();
		    dojo.stopEvent(e);
		}
		break;
	    }
	} else {
	    if (this.useAutoCompletion) {
		wm.onidle(this, function() {
		    var text = this._editor.value;
		    var cursor = this._editor.selection.end;
		    var line = text.split(/\n/)[cursor.row];
		    var lastcol = cursor.col;
		    for (var i = lastcol; i >= 0 && line[i] != ' '; i--) ;
		    var token = line.substring(i+1,lastcol);
		    token = token.replace(this.autoCompletionThisRegex, this.autoCompletionThisPointer +".");
		    try {
			console.log("TOKEN TEST:"+token);
			var obj = dojo.getObject(token);
			var remainder = "";
			while (!obj && token.indexOf(".") != -1) {
			    remainder = token.substring(token.lastIndexOf(".")+1);
			    token = token.substring(0,token.lastIndexOf("."));
			    console.log("TOKEN TEST:"+token);
			    obj = dojo.getObject(token);
			}
			this._findRemainder = remainder;
			this._findToken = token;
			var keylist = [];
			if (obj) {
			    console.log("OBJ:"+obj.toString());
			    for (var i in obj) {
				if (i == "root") console.log(i.indexOf(remainder) + " | " + remainder);
				if (i[0] != "_" && i.indexOf(remainder) == 0) {
				    keylist.push({dataValue: i});
				}
			    }
			}
			this.autoCompletionVar.setData(keylist);
		    } catch(e) {
			this.autoCompletionVar.setData([]);
		    }
		    this.autoCompletionList.setDataSet(this.autoCompletionVar);
		});
	    }
	}
    },
    promptGotoLine: function() {
	app.prompt("Enter line number", this._editor.selection.start.row, 
		   dojo.hitch(this, function(inValue) {this.setLineNumber(inValue);}));

    },
    focus: function() {
	this._editor.focus = true;
    },
    setSyntax: function(inSyntax) {
	this.syntax = inSyntax;
	if (this._editor) {
	    this._editor.syntax = this.syntax;
	}
    },

    setText: function(inValue){ this.setDataValue(inValue);}, // for EditArea compatibility
    setDataValue: function(inValue) {
	this.dataValue = inValue;
	if (this._editor) {
	    this._editor.value = inValue;
	}
    },

    getText: function() {return this.getDataValue();}, // for EditArea compatibility
    getDataValue: function() {
	if (this._editor) 
	    this.dataValue = this._editor.value;
	return this.dataValue;
    },
    setFontSize: function(inSize) {
	this.fontSize = inSize;
	if (this._editor)
	    this._env.settings.set("fontsize", this.fontSize);
    },
    setFontFace: function(inFace) {
	this.fontFace = inFace;
	if (this._editor)
	    this._env.settings.set("fontface", this.fontFace);
    },
    setTabSize: function(inFace) {
	this.tabSize = inFace;
	if (this._editor)
	    this._env.settings.set("tabstop", this.tabSize);
    },
    getSelectedText: function() {
	if (this._editor)
	    return this._editor.selectedText;
    },
    replaceSelectedText: function(inText) {
	if (this._editor)
	    this._editor.selectedText = inText;
    },
    getSelection: function() {
	if (this._editor)
	    return this._editor.selection;
    },
    // This won't work until we figure out how to create a bespin Range object
    // at this time, 
    setSelection: function(startrow, startcol, endrow, endcol) {
	//if (this._editor)
	//   return this._editor.selection = inRangeObj;
    },
    setLineNumber: function(inNumber) {
	if (this._editor)
	    this._editor.setLineNumber(parseInt(inNumber));
    },

    focus: function() {
	if (this._editor)
	    this._editor.focus = true;
    },

    doFind: function(inText, isRev) {
	var hasChanged = (inText === null || inText === undefined || inText == this._editor.searchController.findText);
	var startPos;
	if (hasChanged) 
	    startPos = isRev ? this._editor.selection.end : this._editor.selection.start;
	else {
	    if (isRev) {
		var end = this._editor.selection.end;
		end.col--;
		startPos = end;
	    } else {
		var start = this._editor.selection.start;
		start.col++;
		startPos = start;
	    }
	}
	this._editor.searchController.setSearchText(inText);
        var range = (isRev) ? this._editor.searchController.findPrevious(startPos) : this._editor.searchController.findNext(startPos);
        if (range) {
	    this.setLineNumber(range.start.row);
            this._editor.selection = range;
	    return true;
        } else {
            var position = { row: 0, col: 0 }; 
            range = (isRev) ? this._editor.searchController.findPrevious(null,true) : this._editor.searchController.findNext(null,true);
            if (range) {
	    this.setLineNumber(range.start.row);
                this._editor.selection = range;
		return true;
	    }
        }
	return false;
    },
    _change: function() {
	this.onChange(this._editor.value);
    },
    onChange: function(newValue) {
	//console.log("VALUE:"+newValue);
    },
    _selectedText: "",
    _selectionChange: function() {
	var selectedText = this._editor.selectedText;
	if (selectedText != this._selectedText) {
	    this._selectedText = selectedText;
	    this.onSelectionChange(selectedText);
	}
    },
    onSelectionChange: function(newSelection) {
	console.log("SEL:"+newSelection);
    },
    onSave: function() {
    },
    jsvalidate: function() {
	if (!this.jsvalidateService)
	    this.jsvalidateService = new wm.JsonRpcService({owner: this, service: "studioService", sync: false});
	this.jsvalidateService.requestAsync("closurecompile", [this.getDataValue()],
					    dojo.hitch(this, function(response) {
						console.log(dojo.fromJson(response));
						if (response)
						    responseObj = dojo.fromJson(response);
						
						if (!response || !responseObj.errors || !responseObj.errors.length)
						    app.toastSuccess("No errors found");
						else {
						    if (!this.compileErrorDialog) {
							this.compileErrorDialog = new wm.Dialog({
							    owner: this,
							    name: "compileErrorDialog",
							    useContainerWidget: true,
							    width: "220px",
							    height: "350px",
							    title: "Compiler Results",
							    corner: "tr",
							    modal: false});
							this.compileErrorList = new wm.List({
							    owner: this,
							    parent: this.compileErrorDialog.containerWidget,
							    dataFields: "dataValue, name",
							    columnWidths: "30px,190",
							    headerVisible: false,
							    width: "100%",
							    height: "100%"});
							this.compileErrorList.connect(this.compileErrorList, "onselect", this, function() {
							    this.setLineNumber(this.compileErrorList.selectedItem.getData().dataValue);
							    var start = this._editor.selection.start;
							    var end = this._editor.selection.end;
							    end.col = 2000;
							    this._editor.selection = {start: start,end:end};
							});
							this.compileErrorVar = new wm.Variable({
							    owner: this,
							    name: "compileErrorVar",
							    type: "EntryData"});
						    }
						    var data = [];
						    var errors = responseObj.errors;
						    for (var i = 0; i < errors.length; i++)
							data.push({name: errors[i].error,
								   dataValue: errors[i].lineno});
						    this.compileErrorVar.setData(data);
						    this.compileErrorList.setDataSet(this.compileErrorVar);
						    this.compileErrorDialog.show();
						}
					    }),
					    function(error) {alert(error);});

    },
    _end:0
});

wm.Bespin.onLoadFinished = false;
window.onBespinLoad = function () { 
    wm.Bespin.onLoadFinished = true;
}; 


wm.Object.extendSchema(wm.Bespin, {
    dataValue: {ignore: 1, bindable: 1, group: "editData", order: 3, simpleBindProp: true, type: "String"}
});