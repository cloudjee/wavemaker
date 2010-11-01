/****

 * CTRL-shift-J: Joins current line with next line
 * CTRL-g: findnext
 * CTRL-shift-G: findprior
 * CTRL-z:undo
 ***/
dojo.provide("wm.base.widget.Bespin");


dojo.declare("wm.Bespin", wm.Control, {
    // design mode property
    scrim: true,

    // Access to bespin objects
    _editor: null,
    _env: null,

    // bespin props
    syntax: "js",
    fontSize: "10",
    fontFace: "Monaco, Lucida Console, monospace",
    dataValue: "dojo.declare('myclass', null, {\n});",
    tabSize: 4,

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
	if (wm.Bespin.onLoadFinished)
	    this.initBespinObject();
	else
	    this.connect(null, "onBespinLoad", this, "initBespinObject");
    },
    initBespinObject: function() {
	bespin.useBespin(this.domNode,
			 {stealFocus: true,
			  syntax:     this.syntax,
			  plugins: ["embedded", "command_line"],
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
	    this._editor.setLineNumber(4)
    },

    focus: function() {
	if (this._editor)
	    this._editor.focus = true;
    },
    renderBounds: function() {
	this.inherited(arguments);
	if (this._env) 
	    this._env.dimensionsChanged();
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
