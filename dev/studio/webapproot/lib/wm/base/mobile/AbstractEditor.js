/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.


 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.mobile.AbstractEditor");

// check if a property is not undefined or not same as in the object prototype
wm.propertyIsChanged = function(inValue, inProp, inCtor) {
	var p = (inCtor||0).prototype;
	return p && p[inProp] !== inValue;
}

wm.defaultEmptyValue = function(inType){
	switch(inType){
		case 'Text': return '';
		case 'Number': return 0;
		
	}
}


wm.createFieldEditor = function(inParent, inFieldInfo, inProps, inEvents, inClass) {
	var props = dojo.mixin({}, wm.getFieldEditorProps(inFieldInfo), inProps);
	var name = wm.getValidJsName(props.name || "editor1");
	return inParent.owner.loadComponent(name, inParent, inClass, props, inEvents);
};



dojo.declare("wm.mobile.AbstractEditor", wm.Control, {
    classNames: "wmmobeditor",
    _editorPaddingRight: 0,
    /* Formating */
    height: "50px",
    width: "100%",
    padding: "2",
    border: "0,0,1,0",
    borderColor: "#BBBBBB",
    editorBorder: true,

    /* Editor */
    dataValue: null,
    displayValue: null,
    emptyValue: "unset",
    required: false,
    readonly: false,
    editorNode: null,

    /* Caption */
    caption: "",
    captionPosition: "left",
    captionSize: "150px",
    captionNode: null,
    captionAlign: "left",
    singleLine: true,

    _updating: 0,
    scrim: true,


	// If I name it getMinHeight, then it will be used to show the "minHeight" property in the designer; this func is meant to use EITHER a user supplied value OR a best calculation, and that calculation varies at runtime based on various factors, so we do NOT want to write this calculation as a property to widgets.js
    getMinHeightProp: function() {	
	if (this.minHeight) return this.minHeight;
	if (this.captionPosition == "left" || this.captionPosition == "right" || !this.caption) return 24;
	else if (this.captionSize.match(/\%/)) return 40;
	else return 24 + parseInt(this.captionSize);
    },
    getMinWidthProp: function() {
	if (this.minWidth) return this.minWidth;
	if (this.captionPosition == "top" || this.captionPosition == "bottom" || !this.caption) return 80;
	else if (this.captionSize.match(/\%/)) return 120;
	else return 80 + parseInt(this.captionSize);
    },
    createCaption: function() {		 
	var labeldiv = this.captionNode = document.createElement("div");
	labeldiv.className = "wmmobeditor-caption";
	labeldiv.innerHTML = this.caption;
	this.domNode.appendChild(labeldiv);
	this.setCaptionAlign(this.captionAlign);
    },
    prepare: function(inProps) {
	console.log("PROPS:");
	console.log(inProps);
	var parent = inProps.parent;
	var owner = inProps.owner;
	delete inProps.parent;
	delete inProps.owner;
	this._props = dojo.clone(inProps);
	inProps.parent = parent;
	inProps.owner = owner;
	this.inherited(arguments);
    },
    postInit: function() {
	if (this.isAncestorInstanceOf(wm.mobile.FormContainer)) {
	    this.setPadding("0");
	    this.editorBorder = false;
	}
	this.createEditor();
	this.inherited(arguments);
	if (this.captionPosition != "left")
	    this.setCaptionPosition(this.captionPosition);
	this.editorChanged();
	//this.connect(this.domNode, "ontouchstart", this,"clicked");  // If the user clicks on an editor caption, focus on the editor itself.  Bad results when scrolling though
    },
    setCaption: function(inCaption) {
	var oldCap = this.caption;
	this.caption = inCaption;
	if (!this.captionNode) return;
	var cap = inCaption + ((this.required && !this.readonly) ? '&nbsp;<span class="wmeditor-required">*</span>' : "");
	this.captionNode.innerHTML = cap;
	if (oldCap && !inCaption || !oldCap && inCaption) {
	    dojo.style(this.captionNode, "display", (inCaption) ? "block" : "none");
	    this.sizeEditor();
	}
    },
    setCaptionSize: function(inCaptionSize) {
	this.captionSize = inCaptionSize;
	this.sizeEditor();
    },
    setCaptionAlign: function(inCaptionAlign) {
	this.captionAlign = inCaptionAlign;
	dojo.style(this.captionNode, "textAlign", this.captionAlign);
    },
    setCaptionPosition: function(pos) {
	var oldPos = this.captionPosition;
	this.captionPosition = pos;
	if ((oldPos == "left" || oldPos == "right") && (pos == "bottom" || pos == "top")) {
	    if (this.height.match(/px/) && parseInt(this.height) < 48)
		this.setHeight("48px");
	    this.setSingleLine(true);
	} else if ((pos == "left" || pos == "right") && (oldPos == "bottom" || oldPos == "top")) {
	    if (this.captionSize.match(/px/) && parseInt(this.captionSize) < 100)
		this.captionSize = "100px";
	    this.setSingleLine(false);
	}
	this.sizeEditor();
    },
    setSingleLine: function(inSingleLine) {
	this.singleLine = inSingleLine;
	var s = this.captionNode.style;
	s.whiteSpace =  (inSingleLine) ? "nowrap" : "normal";
    },
    setDisabled: function(inDisabled) {
	var d = this.disabled;
	this.inherited(arguments);
	if (d != this.disabled && this.editor) {
		this.editor.disabled = Boolean(inDisabled);
	}
	this.disabled = inDisabled;
    },

    connectEditor: function() {
	    this._disconnect();
	    this.connect(this.editor, "onchange", this, "changed");
	    this.connect(this.editor, "onblur", this, "blurred");
	    this.connect(this.editor, "onfocus", this, "focused");
	    this.connect(this.editor, "onkeypress", this, "keypressed");

    },
    clicked: function(evt) {
	if (!this.readonly && !this.disabled && this.editor && evt.target != this.editor) {
	    this.editor.focus();
	}
    },
    createEditor: function(inProps) {
	if (!this.captionNode) this.createCaption();
	this.editor = this._createEditor();
	if (this.editor) {
	    this.editorNode = (this.editor.declaredClass) ? this.editor.domNode : this.editor;
	    dojo.addClass(this.editorNode, "wmmobeditor-edit");
	    this.sizeEditor();
	    this.connectEditor();
	    this.setRequired(this.required);
	    this.setInitialValue();

/*
            if (this.editor._onChangeHandle) {
                window.clearTimeout(this.editor._onChangeHandle);
                this.editor._onChangeHandle = null;
            }
	    */
			this.setReadonly(this.readonly);
		}

		return this.editor;
	},
	_createEditor: function(inNode, inProps) {

		var node = dojo.create("input", {type: "text", placeholder: this.placeHolder});
	    if (this._highlightEditor) 
		node.id = "HighlightEditor";
	    this.domNode.appendChild(node);
	    return node;
	},
	destroyEditor: function() {
		wm.fire(this.editor, "destroy");
		this.editor = null;
	},
	styleEditor: function() {
		if (this.isRelativePositioned){
			if (this.captionNode)
				dojo.addClass(this.captionNode, 'wmInlineDiv');
			return;
		}
/*
	    dojo.style(this.editorNode, {position: "abolute"});
	    if (this.captionNode)
			dojo.style(this.captionNode, {position: "absolute"});
			*/
	},
	sizeEditor: function() {	     
		if (this._cupdating)
			return;
	        var e = (this.readonly) ? this.readOnlyNode : this.editor;
		if (e) {
		    var bounds = this.getContentBounds();
                    var position = this.captionPosition;
	            var captionEditorSpacing = (position == "left" || position == "right") ? wm.mobile.AbstractEditor.captionPaddingWidth : wm.mobile.AbstractEditor.captionPaddingHeight;
		    var w = bounds.w;
		    var h = bounds.h;
		    var labelWidth;
		    var editorWidth;
		    var height = bounds.h; //bounds.h ? bounds.h - ((bounds.h > 20) ? Math.floor(bounds.h * 0.1) : 2) : "";
		    var labelHeight;
		    var editorHeight;
		    if (!this.caption) {
			labelWidth = 0;
			editorWidth = w;
			editorHeight = h;
		    } else if (position == "left" || position == "right") {			
			labelWidth = (this.captionSize.match(/px/)) ? parseInt(this.captionSize) : Math.floor(parseInt(this.captionSize) * w/100);						
			editorWidth = w - labelWidth;			
//			if (labelWidth) editorWidth -=  18; // TODO: number 18 is a random number that worked out in FF, but needs testing elsewhere
			labelHeight = (height) ? height : "";
			editorHeight = labelHeight;			
		    } else {
			labelHeight = (this.captionSize.match(/px/)) ? parseInt(this.captionSize) : Math.floor(parseInt(this.captionSize) * height/100);
			if (labelHeight > height) {
			    labelHeight = height - 16;
			    if (this.captionSize.match(/px/)) this.captionSize = labelHeight + "px";
			}
			editorHeight =  (height - labelHeight);
			labelWidth = (w) ? w  : "";
			editorWidth = labelWidth;
		    }
		    labelWidth = Math.round(labelWidth);
		    editorWidth = Math.round(editorWidth);
                    if (this._editorPaddingLeft) editorWidth -= this._editorPaddingLeft;
                    if (this._editorPaddingRight) editorWidth -= this._editorPaddingRight;
		    var s = this.captionNode.style;
		    var labelWidthWithSpacing = (labelWidth - ((position == "right" || position == "left") ? captionEditorSpacing : 0));
		    labelWidthWithSpacing = (labelWidthWithSpacing) ? labelWidthWithSpacing : 0;
  		    if (labelWidthWithSpacing < 0) labelWidthWithSpacing = 0;		    
			s.width =  labelWidthWithSpacing + "px";
		    s.height = ((labelHeight && labelHeight > 0) ? labelHeight : 0) + "px";
		    
		     // if height changes, then lineHeight may have to change
		    //s.lineHeight = (s.lineHeight != "normal") ? s.height : "normal";
		    s.lineHeight = s.height;
		    s.left = (position == "right") ? (bounds.w + bounds.l - labelWidthWithSpacing) + "px" : bounds.l + "px";
		    s.top  = (position == "bottom") ? (editorHeight + bounds.t - captionEditorSpacing) + "px" : bounds.t + "px"; 

                    var b = {w: editorWidth - this._editorPaddingRight, 
                             h: editorHeight,
                             l: ((position == "left" &&  labelWidth) ? labelWidth : 0) + bounds.l,
                             t: ((position == "top" && labelHeight) ? labelHeight : 0) + bounds.t};
/*
		    if (this instanceof wm.Checkbox) {
			b.w = "16";
			b.h = "16";
		    }
		    */

		    if (!b.w || b.w < 0) b.w = 0;
		    if (!b.h || b.h < 0) b.h = 0;
		    this.renderEditorBounds(b);
		}
	},
        renderEditorBounds: function(b) {
	    var setnode = this.editor;
	    var s = setnode.style;

	    if (this.editorBorder && b.w && b.h) {
		s.borderWidth = "1px";
		b.w -= 2;
		b.h -= 2;
	    } else {
		s.borderWidth = "0px";
		b.w -= 2;
	    }
	    s.width = b.w + "px";
	    s.height= b.h + "px";
	    s.left  = b.l + "px";
	    s.top   = b.t + "px";			
/*
	    if (this._useEditorLineHeight)
		s.lineHeight = b.h + "px";
		*/
    },

        updateReadOnlyNodeStyle: function(h) {
	    var s = this.readOnlyNode.style;
	    var overflow = this.getReadOnlyNodeOverflow();
	    if (s.overflow != overflow) s.overflow = overflow;

	    var lineHeight = this.getReadOnlyNodeLineHeight();
	    if(s.lineHeight != lineHeight) s.lineHeight = lineHeight + "px";

	    var whiteSpace = this.getReadOnlyNodeWhiteSpace();
	    if (s.whiteSpace != whiteSpace) s.whiteSpace = whiteSpace;

	    var wordWrap = this.getReadOnlyNodeWordWrap();
	    if (s.wordWrap != wordWrap) s.wordWrap = wordWrap;
	},
        getReadOnlyNodeLineHeight: function() {
		return "normal";
	},
        getReadOnlyNodeOverflow: function() {
		return "hidden";
	},
        getReadOnlyNodeWhiteSpace: function() {
		return "nowrap";
	},
        getReadOnlyNodeWordWrap: function() {
		return "normal";
	},
	renderBounds: function() {
		this.inherited(arguments);
		this.sizeEditor();
	},
    // TODO: Changing this from true to false works, changing from false to true does not; this was true back when wm.Editor was in use as well.
	setEditorBorder: function(inEditorBorder) {
		this.editorBorder = inEditorBorder;
	        this.sizeEditor();
	},
	blurred: function() {
	    if (this._ignoreFocusEvents) return;
	    wm.job("ManageFocus", 10, dojo.hitch(this, "highlightFocus"));
		this.doOnblur();
	},
	focused: function() {
	    if (this._ignoreFocusEvents) return;
	    if (!this._highlightEditor) {
		wm.job("ManageFocus", 10, dojo.hitch(this, "highlightFocus"));
	    }
	    this.doOnfocus();
	},
/*
    highlightFocus: function() {
	if (app._focusedEditor) {
	    if (app._focusedEditor == this) return;
	    dojo.removeClass(app._focusedEditor.domNode, "ActiveEditor");
	    app._focusedParentNode.appendChild(app._focusedEditor.domNode);
	    app._focusedEditor.invalidCss = true;
	    app._focusedEditor.reflowParent();
	    app._focusedEditor.render(true);
	    delete app._focusedEditor;
	}
	if (document.activeElement.tagName == "INPUT") {
	    app._focusedEditor = this;
	    app._focusedParentNode = this.domNode.parentNode;
	    this._ignoreFocusEvents = true;
	    document.body.appendChild(app._focusedEditor.domNode);
	    dojo.addClass(app._focusedEditor.domNode, "ActiveEditor");
	    var style = app._focusedEditor.domNode.style;
	    style.top = "0px";
	    style.left = "0px";
	    style.margin = "0px";
	    style.padding = "0px";
	    style.width = app._page.bounds + "px";


	    this.editor.focus();
	    app._page.root.domNode.style.opacity =  "0.5";
	    delete this._ignoreFocusEvents;
	} else {
	    app._page.root.domNode.style.opacity =  "1.0";

	}
    },
    */
    highlightFocus: function() {
	if (app._focusedEditor) {
	    if (app._focusedEditor == this) return;
	    if (app._headerEditor)
		app._headerEditor.destroy();
	    console.log("HIGHLIGHT FOCUS:destroy");
	    app._page.root.header.show();
	    app._page.root.headerDownButton.hide();
	    app._page.root.headerUpButton.hide();
	    delete app._focusedEditor;
	}
	if (document.activeElement == this.domNode || dojo.isDescendant(document.activeElement, this.domNode) && !this.dontShiftFocusToTop) {
	    app._page.root.header.hide();
	    app.commandMenu.hide();
	    app._page.root.headerDownButton.show();
	    app._page.root.headerUpButton.show();
	    app._focusedEditor = this;
	    this._props._highlightEditor = true;
	    this._props.captionPosition = "left";
	    this._props.captionSize = "30%";
	    var editor = app._headerEditor = app._page.root.headerPanel.createComponent("headerEditor", this.declaredClass, this._props);
	    app._page.root.headerPanel.moveControl(editor, app._page.root.headerPanel.c$.length-3);
	    editor.reflowParent();
	    console.log("HIGHLIGHT FOCUS:focus");
	    editor.focus();

	    app._page.root.containerWidget.domNode.style.opacity =  "0.5";
	    delete this._ignoreFocusEvents;
	} else {
	    app._page.root.containerWidget.domNode.style.opacity =  "1.0";

	}
    },
    doOnblur: function() {
		if (!this.disabled)
		    this.onblur();
    },
    onblur: function() {},
    doOnfocus: function() {
		if (!this.disabled)
		    this.onfocus();
    },
    onfocus: function() {},
    changed: function() {
	wm.onidle(this, "doOnchange");
    },
    doOnchange: function() {
	this.editorChanged();
	var e = this.editor;
	if (!this._loading && !this.isUpdating() && !this.readonly && e && !this.isLoading())
	    this.onchange(this.getDisplayValue(), this.getDataValue());
    },
    onchange: function() {},
	getEditorProps: function(inNode, inProps) {
		return dojo.mixin({srcNodeRef: inNode, owner: this, disabled: this.disabled}, inProps || {});
	},
	_getReadonlyValue: function() {
		return this.getDisplayValue() || "";
	},
        createReadOnlyNode: function() {
	    var node = dojo.create("div");
	    var readstyle = node.style;
	    readstyle.lineHeight = "normal";
	    readstyle.position = "absolute";
	    readstyle.whiteSpace = "normal";
	    return node;
	},

    // TODO: If editor gets resized, what will the readOnlyNode do?
	setReadonly: function(inReadonly, hideOrShowEditor) {
		var r = this.readonly;
		this.readonly = inReadonly;
		if (r != this.readonly)
			this.setCaption(this.caption);
			
		var domNode = this.domNode;
		
		// Insure we have a readonly node, let each subclass override what the readonly node actually consists of
		if (!this.readOnlyNode && this.readonly)
			this.readOnlyNode = this.createReadOnlyNode();
		
		// If there is a readOnlyNode, then take care of adding/removing it from our domNode.
		if (this.readOnlyNode) {
			// If we're in readonly mode, and the readonly node is not in our domNode, add it in.
			if (this.readonly && this.readOnlyNode.parentNode != domNode)
				dojo.place(this.readOnlyNode, domNode,  "last");
			// If we are NOT in readonly mode, and the readonly node is within our domNode, remove it.
			else if (!this.readonly && this.readOnlyNode.parentNode == domNode)
				domNode.removeChild(this.readOnlyNode);
		} 
		
		if (hideOrShowEditor) {
	    if (this.readonly) 
	      this.editorNode.style.display = 'none';
	    else  
	      this.editorNode.style.display = 'block';
		} else {
			// Add or remove the editorNode from our domNode
			if (!this.readonly && this.editorNode.parentNode != domNode) 
				dojo.place(this.editorNode, domNode, "last");
			else 
				if (this.readonly && this.editorNode.parentNode == domNode) 
					domNode.removeChild(this.editorNode);
		}
			
		this.invalidCss = true;
		this.render();
		
		if (this.readonly)
			wm.fire(this.editor,"_hideTooltip");
		
		this.updateReadonlyValue();
	},

	updateReadonlyValue: function(inValue) {
	 	if (this.readonly && this.readOnlyNode){
			var value = inValue || this._getReadonlyValue();
			this.readOnlyNode.innerHTML = value;
		}
	},
	getDisplayValue: function() {
	    return this.editor.value || "";
	},
	makeEmptyValue: function() {
		// this.display is only set by LiveForm therefore will only work for fields in LiveForm and their emptyValue is not set yet.
		if (this.emptyValue == 'unset' && this.display)
			return wm.defaultEmptyValue(this.display);
		
		switch (this.emptyValue) {
			case "null": return null;
			case "false": return false;
			case "emptyString": return "";
			case "zero": return 0;
		}
	},
	getEditorValue: function() {
		var v;
	    // If using html widgets and replacing them with dijits use 
	    // v = (this.editor.declaredClass) ? this.editor.attr('value') : this.editor.value;
		if (this.editor)
		    v = this.editor.value;
	    
		return (v || v === 0) ? v : this.makeEmptyValue();
	},
	setEditorValue: function(inValue) {
	    if (this.editor) {  // If using html widgets and replacing them with dijits use  if (this.editor && this.editor.declaredClass) {
		inValue = inValue === undefined ? null : inValue;
		var oldValue = this.editor.value;
		this.editor.value = inValue;
		if (!inValue) 
		    this.updateReadonlyValue();
	    }
	},
	setDisplayValue: function(inValue) {
		this.setEditorValue(inValue);
	},
	setRequired: function(inValue) {
	        var oldValue = this.required;
		this.required = inValue;
		if (this.editor) {
			this.editor.required = inValue;
			if (this.required || oldValue) {
			    this.setCaption(this.caption);
			}
		}
	},
	
	getRequired: function(){
		return this.required;
	},

	beginEditUpdate: function(inProp) {
		this._updating++;
	},
	endEditUpdate: function(inProp) {
		this._updating--;
	},
	requireChanged: function() {
		this.setCaption(this.caption);
	},
	setInitialValue: function() {
	    this.beginEditUpdate();
	    this.setEditorValue(wm.propertyIsChanged(this.dataValue, "dataValue", wm.Editor) ? this.dataValue : this.displayValue);
	    this.endEditUpdate();
	},
	editorChanged: function() {
	    this.valueChanged("dataValue", this.dataValue = this.getDataValue());
	    this.valueChanged("displayValue", this.displayValue = this.getDisplayValue());
		//wm.fire(this.editor, "ownerEditorChanged");
	},
	getDataValue: function() {
		return this.isReady() ? this.getEditorValue() : this.dataValue;
	},
	setDataValue: function(inValue) {
		// for simplicity, treat undefined as null
		if (inValue === undefined)
			inValue = null;
		this.dataValue = inValue instanceof wm.Variable ? inValue.getData() : inValue;
	        this.setEditorValue(inValue);
	},
	isUpdating: function() {
		return this._updating > 0;
	},

	// used to determine if the editor is ready to send and receive values
	isReady: function() {
		return Boolean(this.editor);
	},
	canFocus: function() {
		return !this.readonly;
	},
	focus: function() {
		wm.fire(this.editor, "focus");
	},
	reset: function() {

	},
	clear: function() {
		this.beginEditUpdate();
		//this.setEditorValue(null);
	        this.setDataValue(null);  // changed from setEditorValue because setEditorValue does not handle readonly editor
		this.reset();
		this.endEditUpdate();
		this.editorChanged();
	},
	// design time
	listOwnerProperties: function() {
		var p = dojo.mixin({}, wm.Component.prototype.listProperties.apply(this) || {});
		// include properties intended for editor's owner
		for (var i in p) {
			if (!p[i].isOwnerProperty)
				delete p[i];
		}
		return p;
	},
	listProperties: function() {
		var p = dojo.mixin({}, this.inherited(arguments) || {});
		// exclude properties intended for editor's owner
		// This will exclude owner props from serialization by default.
		// If these properties are *not* serialized in the owner and should be serialized
		// then override isWriteableProp and serialize here.
		for (var i in p) {
			if (p[i].isOwnerProperty)
				delete p[i];
		}
		return p;
	},
	valueChanged: function(inProp, inValue) {
		if (this._updating)
			return;
		this.inherited(arguments);
		//if (this.isDesignLoaded() && inProp)
		//	this.createEditor();
	},
	isLoading: function() {
		return this._loading;
	},
	keypressed: function(inEvent) {
	    if (this._highlightEditor) {
		wm.onidle(this, function() {
		    app._focusedEditor.setDisplayValue(this.getDisplayValue());
		});
		return;
	    }
	    if (this.changeOnKey || (this.changeOnEnter && inEvent.keyCode == dojo.keys.ENTER))
		wm.onidle(this, "doChangeOnKey", arguments);
	    if (inEvent.keyCode == dojo.keys.ENTER)
		wm.onidle(this, "onEnterKeyPress", [this]);
	},
	doChangeOnKey: function(inEvent) {
	    var dataValue = this.dataValue;	    
	    this.editorChanged();
	    var newDataValue = this.getDataValue();
	    if (dataValue != newDataValue) {
		this.onchange(this.getDisplayValue(), newDataValue);
	    }
	},
	setDefaultOnInsert:function(){
		if (this.editor && this.defaultInsert)
		    this.setEditorValue( this.defaultInsert);
	},
    validate: function() {},
    onEnterKeyPress: function() {}
});

wm.mobile.AbstractEditor.captionPaddingWidth = 8;
wm.mobile.AbstractEditor.captionPaddingHeight = 2;

wm.mobile.AbstractEditor.extend({
        themeableDemoProps: {height: "24px"},
    themeableSharedStyles: ["-Editor Borders", "Editor-Border-Color", "Editor-Hover-Border-Color", "Editor-Focused-Border-Color",  "Editor-Radius",
                            "-Editor Backgrounds", "Editor-Background-Color", "Editor-Hover-Background-Color", "Editor-Focus-Background-Color",
                            "-Editor Fonts", "Editor-Font-Color","Editor-Hover-Font-Color","Editor-Focus-Font-Color",
                            "-Editor Background Image", "Editor-Image","Editor-Image-Position","Editor-Image-Repeat"

                           ],
/*    generateLoadingHtml: function() {
	return [];
    },*/
	addUserClass: function(inClass, inNodeName) {
		this.inherited(arguments);
		if (inNodeName == "captionNode")
		    dojo.addClass(this.captionNode, inClass);
	},
	removeUserClass: function(inClass, inNodeName) {
		this.inherited(arguments);
		if (inNodeName == "captionNode")
		    dojo.removeClass(this.captionNode, inClass);
	},
    afterPaletteDrop: function() {
	this.setCaption(this.name);
	var liveform = this.isAncestorInstanceOf(wm.mobile.FormContainer);
	if (liveform) {
	    this.setCaptionPosition(liveform.captionPosition);
	    this.setCaptionSize(liveform.captionSize);
	    this.setCaptionAlign(liveform.captionAlign);
	    this.setWidth(liveform.editorWidth);
	    if (this.constructor.prototype.height == wm.AbstractEditor.prototype.height)
		this.setHeight(liveform.editorHeight);
	}
    },

	// adds ability to merge in editor properties intended to be presented in owner.
	// note: these editor properties must be serialized in the editor.
	listProperties: function() {
	        var props = this.inherited(arguments);
		var f = wm.getParentForm(this);
		props.formField.ignoretmp = !Boolean(f);
		props.displayValue.readonly = this.formField;
		return props;
	},
	set_formField: function(inFieldName) {
		if (!inFieldName)
			delete this.formField;
		else
			this.formField = inFieldName;
		var f = wm.getParentForm(this);
		if (f) {
			var fieldInfo = f.addEditorToForm(this);
		    if (!this.caption) this.setCaption(inFieldName);
		}
	},

	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "formField":
				return new wm.propEdit.FormFieldSelect({component: this, name: inName, value: inValue});
			case "captionAlign":
				return makeSelectPropEdit(inName, inValue, ["left", "center", "right"], inDefault);
			case "captionSize":
				return new wm.propEdit.UnitValue({component: this, name: inName, value: inValue, options: this._sizeUnits});
			case "captionPosition":
				return makeSelectPropEdit(inName, inValue, ["top", "left", "bottom", "right"], inDefault);
			case "emptyValue":
				return makeSelectPropEdit(inName, inValue, ["unset", "null", "emptyString", "false", "zero"], inDefault);
			case "checkedValue":
				return this.editor.dataType == "boolean" ? makeCheckPropEdit(inName, inValue, inDefault) : this.inherited(arguments);
			case "resizeToFit":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
		}
		return this.inherited(arguments);
	}
});

wm.Object.extendSchema(wm.mobile.AbstractEditor, {
    formField: {writeonly: 1, group: "common", order: 500},
    caption: {group: "Labeling", order: 1, bindTarget:true, doc: 1},
    captionPosition: {group: "Labeling", order: 2, doc: 1},
    captionAlign: {group: "Labeling", order: 3, doc: 1},
    captionSize: {group: "layout", order: 4, doc: 1},
    readonly: {group: "editor", order: 1, doc: 1},
    singleLine: {ignore: 1},

    displayValue: {group: "editData", order: 2}, // use getDisplayValue()
    dataValue: {ignore: 1, bindable: 1, group: "editData", order: 3, simpleBindProp: true, type: "String"}, // use getDataValue()
    emptyValue: {group: "editData", order: 4, doc: 1},
    required: {group: "validation", order: 1, doc: 1},
    editorBorder: {group: "style", order: 100},
    scrollX: {ignore:1},
    scrollY: {ignore:1},
    changeOnEnter: {ignore: 1},
    changeOnKey: {ignore: 1},
    onEnterKeyPress: {ignore: 1},
    display:{ignore:1},
    defaultInsert:{type: "String", bindable: 1, group: "editData", order: 10, dependency: '${parent.declaredClass} == "wm.LiveForm" || ${parent.declaredClass} == "wm.RelatedEditor"'},
    setCaption: {group: "method", doc: 1},
    setCaptionSize: {group: "method", doc: 1},
    setCaptionAlign: {group: "method",doc: 1},
    setCaptionPosition:{group: "method", doc: 1},
    setDisabled: {group: "method", doc: 1},
    setReadonly: {group: "method", doc: 1},
    getDisplayValue: {group: "method",doc: 1, returns: "String"},
    getDataValue: {group: "method", doc: 1, returns: "Any"},
    setDisplayValue: {group: "method", doc: 1},
    setDataValue: {group: "method", doc: 1},

		   focus: {group: "method",doc: 1},
	    clear: {group: "method", doc: 1}
    
    
});


/* Uses a wavemaker container for its this.editor property */
dojo.declare("wm.mobile.ContainerEditor", wm.mobile.AbstractEditor, {
    _createEditor: function(inNode, inProps) {
	var panel = new wm.mobile.Container({layoutKind: "left-to-right",
				      width: "100%",
				      height: "100%",
				      owner: this});
	    this.domNode.appendChild(panel.domNode);
	    return panel;
    },
    reflow: function() {
	if (this.editor)
	    this.editor.reflow();
    },
    flow: function() {
	if (this.editor)
	    this.editor.flow();
    },    
    setDisabled: function(inDisabled) {
	var d = this.disabled;
	this.inherited(arguments);
	if (d != this.disabled && this.editor) {
	    this.editor.setDisabled(inDisabled);
	}
	this.disabled = inDisabled;
    },
    connectEditor: function() {
	this._disconnect();

	    dojo.query("input", this.editor.domNode).connect("onchange", this, "changed");
	    dojo.query("input", this.editor.domNode).connect("onblur", this, "blurred");
	    dojo.query("input", this.editor.domNode).connect("onfocus", this, "focused");
	    dojo.query("input", this.editor.domNode).connect("onkeypress", this, "keypressed");

    },
    renderEditorBounds: function(b) {
	var e = this.editor;
	var oldUpdatingValue = e._cupdating;
	e._cupdating = true; // make sure that we call render only once; setBorder should not call render.
	e.setBorder((this.editorBorder) ? "1" : "0");	  			 
        e.setBounds(b);
	e._cupdating = oldUpdatingValue;
	if (e.invalidCss)
	    e.render();
	else
	    e.renderBounds();
	e.reflow();
    },
	getDisplayValue: function() {
	    alert("getDisplayValue not implemented for " + this.declaredClass);
	    return "";
	},
	getEditorValue: function() {
	    alert("getEditorValue not implemented for " + this.declaredClass);
	    return "";
	},
	setEditorValue: function(inValue) {
	    alert("setEditorValue not implemented for " + this.declaredClass);
	    return "";
	},
	setRequired: function(inValue) {
	    var oldValue = this.required;
	    this.required = inValue;
	    if (this.required != oldValue) {
		this.setCaption(this.caption);
	    }
	},
    focus: function() {
	var input = dojo.query("input", this.domNode)[0];
	if (input) input.focus();
    }
});