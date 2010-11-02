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
    layoutKind: "top-to-bottom",
    horizontalAlign: "left",
    verticalAlign: "top",

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
        this.toolBar = new wm.Container({name: "toolBar", width: "100%", height: "25px", margin: "0,0,2,0", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left", parent: this, owner: this});
        this.bespinControl = new wm.Control({name: "bespinControl", width: "100%", height: "100%", parent: this, owner: this});
        this.bespinControl.connect(this.bespinControl, "renderBounds", this, function() {
	    if (this._env) 
	        this._env.dimensionsChanged();
        });

	if (wm.Bespin.onLoadFinished)
	    this.initBespinObject();
	else
	    this.connect(null, "onBespinLoad", this, "initBespinObject");
        this.buildToolbar();


	this.connect(this.domNode, "onkeydown", this, "handleKeyPress");
    },
    buildToolbar: function() {
	this.gotoLineButton = new wm.ToolButton({name: "gotoLineButton", 
						 caption: "L",
						 backgroundColor: "transparent", 
						 width: "20px", 
						 height: "100%", 
						 parent: this.toolBar, 
						 owner: this});
	this.gotoLineButton.connect(this.gotoLineButton, "onclick", this, function() {
	    this.promptGotoLine();
	});

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
		this.getFindDialog().setShowing(!this.getFindDialog().showing);
		if (this.searchText.getDataValue())
		    this.fullSearchText.setDataValue(this.searchText.getDataValue());
	    });
        }
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
	bespin.useBespin(this.bespinControl.domNode,
			 {stealFocus: true,
			  syntax:     this.syntax,
			  settings:   {
			      tabstop: this.tabSize,
			      fontsize: this.fontSize,
			      fontface: this.fontFace
			      //theme
			      //customKeymapping
			  }
			 }).then(dojo.hitch(this, function(env) {
			      console.log("Have ENV!");console.log(env);
			      this._editor = env.editor;
			      this._editor.value = this.dataValue;
			      this._env = env;

			      this._editor.syntax = this.syntax;
			      this._editor.textChanged.add(dojo.hitch(this, "_change"));
			      this._editor.selectionChanged.add(dojo.hitch(this, "_selectionChange"));
			  }));
	console.log("USE BESPIN DONE");
    },
    handleSearchKey: function(text, e) {
	if (e.keyCode == dojo.keys.TAB) return;
	if (e.ctrlKey && e.keyCode == 70) {
	    this.getFindDialog().show();
	    this.fullSearchText.focus();
	    return;
	}
	this._editor.setCursor(this._editor.selection.start);
	this.doFind(text, false);
    },
    handleKeyPress: function(e) {
	if (e.ctrlKey) {
	    switch(e.keyCode) {
	    case 70:
		this.searchEditor.focus();
		dojo.stopEvent(e);
		break;
	    case 71:
		this.promptGotoLine();
		dojo.stopEvent(e);
		break;
	    }
	}
    },
    promptGotoLine: function() {
	app.prompt("Enter line number", this._editor.selection.start.row, 
		   dojo.hitch(this, function(inValue) {this.setLineNumber(inValue);}));

    },
    setSyntax: function(inSyntax) {
	this.syntax = inSyntax;
	if (this._editor) {
	    this._editor.syntax = this.syntax;
	}
    },
    setDataValue: function(inValue) {
	this.dataValue = inValue;
	if (this._editor) {
	    this._editor.value = inValue;
	}
    },
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
	console.log("VALUE:"+newValue);
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
    _end:0
});

wm.Bespin.onLoadFinished = false;
window.onBespinLoad = function () { 
    wm.Bespin.onLoadFinished = true;
}; 
