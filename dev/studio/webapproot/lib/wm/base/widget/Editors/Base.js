/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.


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
dojo.provide("wm.base.widget.Editors.Base");
dojo.require("wm.base.widget.Editors.dijit");

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

//===========================================================================
// Base Editor
//===========================================================================
dojo.declare("wm._BaseEditor", wm.Widget, {
        classNames: "wmeditor",
	width: "100%",
	height: "100%",
	editorBorder: true,
	border: 0,
	changeOnKey: false,
	changeOnEnter: false,
	required: false,
	showMessages: true,
	init: function() {
		this._editorConnects = [];
		// FIXME: set owner to parent. Owner is forced to page if we've been streamed.
		this.name = "editor";
		this.setOwner(this.parent);
		// owner defined properties
		this.singleLine = this.owner.singleLine;
		this.readonly = this.owner.readonly;
		//this.required = this.owner.required;
		this.disabled = this.owner.disabled;
		//
		this.inherited(arguments);
	},
	postInit: function() {
		this.createEditor();
		this.inherited(arguments);
	},
	destroy: function() {
		this.destroyEditor();
		this.inherited(arguments);
	},
	createEditor: function(inProps) {
		this.destroyEditor();
		var n = document.createElement('div');
		this.domNode.appendChild(n);
	    this.startTimerWithName("CreateDijit", this.declaredClass);
		this.editor = this._createEditor(n, inProps);
	    this.stopTimerWithName("CreateDijit", this.declaredClass);
		if (this.editor) {
			this.styleEditor();
			if (this.validationEnabled())
			    this.validatorNode = this._getValidatorNode();
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
		this.editor.owner = this;
		if (this.editor.displayMessage) {
			this.editor.displayMessage = function(message) {
				if (!this.owner.showMessages)
					return;
				var o = dojo.getObject(this.declaredClass);
				if (o)
					o.prototype.displayMessage.apply(this, arguments);
			}
		}
		return this.editor;
	},
	validationEnabled: function() {
		if (this.isLoading())
			return false;
		else
			return true;
	},
	_createEditor: function(inNode, inProps) {
		return new dijit.form.TextBox(this.getEditorProps(inNode, inProps));
	},
	destroyEditor: function() {
		this.disconnectEditor();
		wm.fire(this.editor, "destroy");
		this.editor = null;
	},
	styleEditor: function() {
	},
	sizeEditor: function() {
		if (this._cupdating)
			return;
		var e = this.editor;
		if (e) {
			var
				bounds = this.getContentBounds(),
				// note, subtract 2 from bounds for dijit editor border/margin
				height = bounds.h ? bounds.h - 2 + "px" : "",
				width = bounds.w ? bounds.w - 4 : "",
				d = e && e.domNode,
				s = d.style,
				fc = d && d.firstChild;

                    if (this._editorPaddingLeft) width -= this._editorPaddingLeft;
                    if (this._editorPaddingRight) width -= this._editorPaddingRight;
                    if (width) width += "px";

			if (!this.editorBorder) s.border = 0;
		        s.backgroundColor = this.editorBorder ? "" : "transparent";
			s.backgroundImage = this.editorBorder ? "" : "none";
			s.width = width;
			if (height) {
				if (fc) {
					dojo.forEach(fc.childNodes, function(c) {
						if (c.style)
						{
							c.style.height = height;
						}
					});
				}
				if (e.focusNode && e.focusNode.style)
					e.focusNode.style.height = height;

			}
		}
	},
	renderBounds: function() {
		this.inherited(arguments);
		this.sizeEditor();
	},
	setEditorBorder: function(inEditorBorder) {
		this.editorBorder = inEditorBorder;
		this.render();
	},
	addEditorConnect: function(inConnect) {
		this._editorConnects.push(dojo.connect.apply(dojo, arguments));
	},
	connectEditor: function() {
		this.disconnectEditor();
		this.addEditorConnect(this.editor, "onChange", this, "changed");
		this.addEditorConnect(this.editor, "onBlur", this, "blurred");
		this.addEditorConnect(this.editor, "_onFocus", this, "focused");
		this.addEditorConnect(this.editor.domNode, "onkeypress", this, "keypressed");
		this.addEditorConnect(this.editor.domNode, "onkeypress", this, "dokeypress");
		if (this.validationEnabled())
		  this.addEditorConnect(this.editor, "validate", this, "editorValidated");
	},
	disconnectEditor: function() {
		dojo.forEach(this._editorConnects, dojo.disconnect);
		this._editorConnects = [];
	},
	invalidate: function() {
		delete this._isValid;
	},
	keypressed: function(){
		this.validate();
	},
	blurred: function() {
		this.validate();
		this.owner.doOnblur();
	},
	doOnblur: function() {
		if (!this.disabled)
			this.onblur();
	},

	focused: function() {
		this.owner.doOnfocus();
	},
	changed: function() {
		this.validate();
		this.owner.doOnchange();
	},
	_getValidatorNode: function() {
		var n = this.editor && this.editor.domNode.firstChild;
		if (!n)
		{
			return null;
		}
		for (var i=0, c, children=n.childNodes; c=children[i]; i++)
			if (dojo.hasClass(c, "dijitValidationIcon"))
				return c;
	},
	editorValidated: function() {
		if (this.validatorNode)
			this.validatorNode.style.display = this.editor.state == "Error" ? "" : "none";
	},
	validate: function() {
            if (this.validationEnabled()) 
		this.invalidate();

            // just because the editor doesn't have validation doesn't mean that the container won't need to validate the sum of all inputs
	    wm.job(this.getRuntimeId(), 25, dojo.hitch(this, function() {
		wm.fire(this.owner, "validate");
	    }));
	},
	getEditorProps: function(inNode, inProps) {
		return dojo.mixin({srcNodeRef: inNode, owner: this, disabled: this.owner.disabled}, inProps || {});
	},

	getInvalid: function() {
	        if (!this.validationEnabled()) return false;
		if (this.editor && this.editor.isValid) {
			if (this._isValid === undefined)
				this._isValid = this.editor.isValid();
			return !(this.readonly || this._isValid);
		}
	},
	_getReadonlyValue: function() {
		return this.getDisplayValue() || "";
	},
	setReadonly: function(inReadonly) {
		this.readonly = inReadonly;
		var dn = this.domNode, pn = this.editor.domNode.parentNode;
		if (this.readonly) {
			if (pn == dn) {
				dn.removeChild(this.editor.domNode);
			}
			wm.fire(this.editor,"_hideTooltip");
		} else {
			if (pn != dn) {
				dn.innerHTML = "";
				dn.appendChild(this.editor.domNode);
				this.owner.reflow();
			}
		}
		this.updateReadonlyValue();
	},
	updateReadonlyValue: function() {
		if (this.readonly && (!this.editor.domNode.parentNode || !this.editor.domNode.parentNode.id))
			if (this instanceof wm._CheckBoxEditor)
			{
				this.setReadonlyValue();
			}
			else
			{
				this.domNode.innerHTML = this._getReadonlyValue();
			}
	},
 	getDisplayValue: function() {
		return this.editor && this.editor.declaredClass && this.editor.get && this.editor.get('displayedValue') ? this.editor.get('displayedValue') || "" : this.getEditorValue() || "";
	},
	makeEmptyValue: function() {
		switch (this.owner.emptyValue) {
			case "null": return null;
			case "false": return false;
			case "emptyString": return "";
			case "zero": return 0;
		}
	},
	getEditorValue: function() {
		var v;
		if (this.editor && this.editor.get)
			v = this.editor.get('value');
		return (v || v === 0) ? v : this.makeEmptyValue();
	},
	setEditorValue: function(inValue) {
		if (this.editor && this.editor.set) {
			inValue = inValue === undefined ? null : inValue;
		    var oldVal = this.editor.get('value');
		    this.editor.set('value',inValue, false);
		    if (oldVal != inValue)
			this.changed();
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
			  this.validate();
			  wm.fire(this.owner, "requireChanged");
			}
		}
	},
	setInitialValue: function() {
		var o = this.owner;
		o.beginEditUpdate();
		this.setEditorValue(wm.propertyIsChanged(o.dataValue, "dataValue", wm.Editor) ? o.dataValue : o.displayValue);
		o.endEditUpdate();
	},
	setDisabled: function(inDisabled) {
		this.disabled = inDisabled;
		if (this.editor && this.editor.set)
			this.editor.set("disabled", inDisabled);
	},
	// used to determine if the editor is ready to send and receive values
	isReady: function() {
		return Boolean(this.editor);
	},
	focus: function() {
		wm.fire(this.editor, "focus");
	},
	reset: function() {
		var e = this.editor;
		if (e) {
			e._hasBeenBlurred = false;
			wm.fire(e,"_hideTooltip");
		}
	},
	clear: function() {
		this.reset();
		this.setEditorValue(null);
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
    
    // Taken from wm.Editor; synonym for BaseEditor makeEmptyValue.
	setValueAsEmpty: function(){
	    this.makeEmptyValue();
	},	
	isLoading: function() {
		return this.owner._loading;
	},
	dokeypress: function(inEvent) {
		if (this.changeOnKey || (this.changeOnEnter && inEvent.keyCode == dojo.keys.ENTER))
			wm.onidle(this, "doChangeOnKey", arguments);
	        if (inEvent.keyCode == dojo.keys.ENTER)
	            wm.onidle(this, "onEnterKeyPress", [this]);
	},
	doChangeOnKey: function(inEvent) {
		var e = this.editor;
		//e.setValue(e.getValue());
	        //e.set("value",e.get("value"));
	        this.changed();
	},
        onEnterKeyPress: function() {}
});


wm.createFieldEditor = function(inParent, inFieldInfo, inProps, inEvents, inClass) {
	var props = dojo.mixin({}, wm.getFieldEditorProps(inFieldInfo), inProps);
	var name = wm.getValidJsName(props.name || "editor1");
	return inParent.owner.loadComponent(name, inParent, inClass ||"wm._TextEditor1", props, inEvents);
};



dojo.declare("wm.AbstractEditor", wm.Widget, {
    changeKeycodes: [dojo.keys.ENTER, dojo.keys.NUMPAD_ENTER, dojo.keys.DELETE, dojo.keys.BACKSPACE],
    classNames: "wmeditor",

    /* Formating */
	height: "24px",
	width: "300px",
	padding: 2,
	border: 0,
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
	captionSize: "100px",
        captionNode: null,
	captionAlign: "right",
	singleLine: true,

    /* Events */
        changeOnEnter: false,
        changeOnKey: false,
        _updating: 0,

    scrim: true,

	init: function() {
		this._editorConnects = [];
		this.inherited(arguments);
	},
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
		var labeldiv = document.createElement("div");
		var s = labeldiv.style;
		s["float"] = "left"; // some compilers have trouble with x.float
		s.padding = "0px";
		s.margin = "0px";

		dojo.addClass(labeldiv, "wmeditor-caption");
		dojo.addClass(labeldiv, "wmlabel");
		labeldiv.innerHTML = this.caption;
		this.domNode.appendChild(labeldiv);
		this.captionNode = labeldiv;
		this.setCaptionAlign(this.captionAlign);
		this.setSingleLine(this.singleLine);
	},
	postInit: function() {
	        this.createEditor();
		this.inherited(arguments);

		wm.fire(this, "ownerLoaded"); // TODO: Replace this with call in SelectEditor.postInit
		if (this.captionPosition != "left")
		  this.setCaptionPosition(this.captionPosition);
	    this.editorChanged();
	},

	afterPaletteDrop: function() {
		this.setCaption(this.name);
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
	if ((oldPos == "left" || oldPos == "right") && (pos == "bottom" || pos == "top"))
	    if (this.height.match(/px/) && parseInt(this.height) < 48)
		this.setHeight("48px");
	else if ((pos == "left" || pos == "right") && (oldPos == "bottom" || oldPos == "top"))
	    if (this.captionSize.match(/px/) && parseInt(this.captionSize) < 100)
		this.captionSize = "100px";
	this.sizeEditor();
    },
    setSingleLine: function(inSingleLine) {
	this.singleLine = inSingleLine;
	var s = this.captionNode.style;
	s.whiteSpace =  (inSingleLine) ? "nowrap" : "normal";
	s.overflow =  "hidden";	
	s.lineHeight = (this.singleLine) ? s.height : "normal";
	if (this.readOnlyNode)
		this.updateReadOnlyNodeStyle();
    },
	setDisabled: function(inDisabled) {
		var d = this.disabled;
		this.inherited(arguments);
	    if (d != this.disabled && this.editor) {
		if (this.editor instanceof wm.Control)
			this.editor.setDisabled(inDisabled);
		else
			this.editor.set("disabled", inDisabled);
		dojo[this.disabled ? "addClass" : "removeClass"](this.captionNode, "wmeditor-caption-disabled");
	    }
	    this.disabled = inDisabled;
	},

	destroy: function() {
		this.destroyEditor();
		this.inherited(arguments);
	},
    createEditor: function(inProps) {
		// Its possible for createEditor to be called before postInit where createCaption is called,
		// and we need it for styleEditor to work correctly.
		if (!this.captionNode) this.createCaption();
		this.destroyEditor();
		var n = document.createElement('div');
		this.domNode.appendChild(n);
	    this.startTimerWithName("CreateDijit", this.declaredClass);
		this.editor = this._createEditor(n, inProps);

/*
            if (this.editor._onChangeHandle) {
                window.clearTimeout(this.editor._onChangeHandle);
                this.editor._onChangeHandle = null;
            }
	    */
		this.editorNode = this.editor.domNode;
		this.editorNode.style.margin = "0"; // failure to explicitly set these is throwing off my bounds calculations
	        this.editorNode.style.padding = "0";
    	    this.stopTimerWithName("CreateDijit", this.declaredClass);
		// If using html widgets and replacing them with dijits use  "if (this.editor && this.editor.declaredClass) "
		if (this.editor) {
			this.styleEditor();
			if (this.validationEnabled())
			  this.validatorNode = this._getValidatorNode();
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

		if (this.editor.displayMessage) {
		    this.editor.displayMessage = dojo.hitch(this, function(message) {
				if (!this.showMessages)
					return;
				var o = dojo.getObject(this.editor.declaredClass);
				if (o)
					o.prototype.displayMessage.apply(this.editor, arguments);
		    });
		}
		return this.editor;
	},
	validationEnabled: function() { return true;},
	_createEditor: function(inNode, inProps) {
		return new dijit.form.TextBox(this.getEditorProps(inNode, inProps));
	},
	destroyEditor: function() {
		this.disconnectEditor();
		wm.fire(this.editor, "destroy");
		this.editor = null;
	},
	styleEditor: function() {
		if (this.isRelativePositioned){
			if (this.captionNode)
				dojo.addClass(this.captionNode, 'wmInlineDiv');
			return;
		}
	    dojo.style(this.editorNode, {position: "absolute"});
	    if (this.captionNode)
			dojo.style(this.captionNode, {position: "absolute"});
	},
	sizeEditor: function() {	     
		if (this._cupdating)
			return;
	        var e = (this.readonly) ? this.readOnlyNode : this.editor;
		if (e) {
		    var bounds = this.getContentBounds();
                    var position = this.captionPosition;
	            var captionEditorSpacing = (position == "left" || position == "right") ? wm.AbstractEditor.captionPaddingWidth : wm.AbstractEditor.captionPaddingHeight;
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
		    s.lineHeight = (s.lineHeight != "normal") ? s.height : "normal";
		    s.left = (position == "right") ? (bounds.w + bounds.l - labelWidthWithSpacing) + "px" : bounds.l + "px";
		    s.top  = (position == "bottom") ? (editorHeight + bounds.t - captionEditorSpacing) + "px" : bounds.t + "px"; 

                    var b = {w: editorWidth , 
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

                    if (e instanceof wm.Control) {			
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

                    } else {
			var setnode = (e["domNode"]) ? e.domNode : e;
			var s = setnode.style;

			if (this.editorBorder && b.w && b.h) {
			    s.borderWidth = "1px";
                            if (!this._editorBackgroundColor)
			        s.backgroundColor = "";
			    s.backgroundImage = "";
			    b.w -= 2;
			    b.h -= 2;
                            if (s.lineHeight != "normal")
                                s.lineHeight = (b.h) + "px"
			} else {
			    s.borderWidth = "0px";
                            if (!this._editorBackgroundColor)
			        s.backgroundColor = "transparent";
			    s.backgroundImage = "none";
                            if (s.lineHeight != "normal" && b.h)
                                s.lineHeight = b.h + "px"
			}
			s.width = b.w + "px";
			s.height= b.h + "px";
			s.left  = b.l + "px";
			s.top   = b.t + "px";			
			if (e == this.readOnlyNode)
			    this.updateReadOnlyNodeStyle(b.h);

/*
                        dojo.style(this.editorNode, {width:  b.w + "px",
                                                     height: b.h + "px",
                                                     left:   b.l + "px",
                                                     top:    b.t + "px"});
						     */
                    }

		}
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
	    if (this.singleLine)
		return parseInt(this.readOnlyNode.style.height) + ((this.editorBorder) ? 2 : 0);
	    else
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
	addEditorConnect: function(inConnect) {
		this._editorConnects.push(dojo.connect.apply(dojo, arguments));
	},
	connectEditor: function() {
		this.disconnectEditor();
		this.addEditorConnect(this.editor, "onChange", this, "changed");
		this.addEditorConnect(this.editor, "onBlur", this, "blurred");
		this.addEditorConnect(this.editor, "_onFocus", this, "focused");
		this.addEditorConnect(this.editor.domNode, "onkeypress", this, "keypressed");

/*
		this.addEditorConnect(this.editor.domNode, "onkeypress", this, "keypressed");
		this.addEditorConnect(this.editor.domNode, "onkeypress", this, "dokeypress");
*/
		if (this.validationEnabled())
		  this.addEditorConnect(this.editor, "validate", this, "editorValidated");
	},
	disconnectEditor: function() {
		dojo.forEach(this._editorConnects, dojo.disconnect);
		this._editorConnects = [];
	},
	invalidate: function() {
		delete this._isValid;
	},
	keypressed: function(inEvent){
	    if (inEvent.charCode || inEvent.keyCode == dojo.keys.BACKSPACE || inEvent.keyCode == dojo.keys.DELETE || dojo.indexOf(this.changeKeycodes, inEvent.keyCode) != -1) {
		this.validate();
	        this.dokeypress(inEvent);
	    }
	},
	blurred: function() {
		this.validate();
		this.doOnblur();
	},
	focused: function() {
        dojo.publish("wm.AbstractEditor-focused", [this]);
		this.doOnfocus();
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
	this.validate();
	this.doOnchange();
    },
    doOnchange: function() {
	this.editorChanged();
	var e = this.editor;
	if (!this._loading && !this.isUpdating() && !this.readonly && e && !this.isLoading())
	    this.onchange(this.getDisplayValue(), this.getDataValue());
    },
    onchange: function() {},
	_getValidatorNode: function() {
		var n = this.editor && this.editor.domNode.firstChild;
		if (!n)
		{
			return null;
		}
		for (var i=0, c, children=n.childNodes; c=children[i]; i++)
			if (dojo.hasClass(c, "dijitValidationIcon"))
				return c;
	},
	editorValidated: function() {
		if (this.validatorNode)
			this.validatorNode.style.display = this.editor.state == "Error" ? "" : "none";
	},
	validate: function() {
		if (this.validationEnabled())
		    this.invalidate();

            // just because the editor doesn't have validation doesn't mean that the container won't need to validate the sum of all inputs
		wm.job(this.getRuntimeId(), 25, dojo.hitch(this, function() {
			if (this.parent) 
				wm.fire(this.parent, "validate");
			this.valueChanged("invalid", this.getInvalid());
		}));
	},
	getEditorProps: function(inNode, inProps) {
		return dojo.mixin({srcNodeRef: inNode, owner: this, disabled: this.disabled}, inProps || {});
	},
	isValid: function() {
		return !this.getInvalid();
	}, 
	getInvalid: function() {
	        if (!this.validationEnabled()) return false;
		if (this.editor && this.editor.isValid) {
			if (this._isValid === undefined)
				this._isValid = this.editor.isValid();
			return !(this.readonly || this._isValid);
		}
	},
	_getReadonlyValue: function() {
		return this.getDisplayValue() || "";
	},
        createReadOnlyNode: function() {
	    var node = dojo.create("div");
	    var readstyle = node.style;
	    readstyle.lineHeight = "normal";
	    readstyle.position = "absolute";
	    readstyle.whiteSpace =  (this.singleLine) ? "nowrap" : "normal";
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
		return this.editor && this.editor.declaredClass &&  this.editor.get && this.editor.get('displayedValue') ? this.editor.get('displayedValue') || "" : this.getEditorValue() || "";
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
		    v = this.editor.get('value') ;
	    
		return (v || v === 0) ? v : this.makeEmptyValue();
	},
	setEditorValue: function(inValue) {
	    if (this.editor) {  // If using html widgets and replacing them with dijits use  if (this.editor && this.editor.declaredClass) {
			inValue = inValue === undefined ? null : inValue;
		        var oldValue = this.editor.get('value');
		        this.editor.set('value',inValue, false);
			this.updateReadonlyValue();
		        if (oldValue != inValue)
			    this.changed();
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
			    this.validate();
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
		this.valueChanged("displayValue", this.displayValue = this.getDisplayValue());
		this.valueChanged("dataValue", this.dataValue = this.getDataValue());
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
		var e = this.editor;
		if (e) {
			e._hasBeenBlurred = false;
			wm.fire(e,"_hideTooltip");
		    if (this.validatorNode && !this.getDisplayValue()) {
			this.validatorNode.style.display = "none";
			e.set("state", "Normal");
			e._setStateClass();
		    }
		}
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
	dokeypress: function(inEvent) {
		if (this.changeOnKey || (this.changeOnEnter && inEvent.keyCode == dojo.keys.ENTER))
			wm.onidle(this, "doChangeOnKey", arguments);
	        if (inEvent.keyCode == dojo.keys.ENTER)
		    wm.onidle(this, "onEnterKeyPress", [this]);
	},
	doChangeOnKey: function(inEvent) {
		var e = this.editor;
	        //e.set("value",e.get("value"));
	    this.changed();
	},
	setDefaultOnInsert:function(){
		if (this.editor && this.defaultInsert)
		    this.editor.set('value', this.defaultInsert, false);
	},
    onEnterKeyPress: function() {}
});

wm.AbstractEditor.captionPaddingWidth = 8;
wm.AbstractEditor.captionPaddingHeight = 2;
// design only...
wm.Object.extendSchema(wm._BaseEditor, {
	name: { ignore: 1 },
	showing: { ignore: 1 },
	disabled: { ignore: 1},
	singleLine: {ignore: 1},
	readonly: {ignore: 1},
	border: {ignore: 1},
	borderColor: {ignore: 1},
	margin: {ignore: 1},
	padding: {ignore: 1},
	scrollX: {ignore: 1},
	scrollY: {ignore: 1}
});


wm.AbstractEditor.extend({
        themeableDemoProps: {height: "24px"},
    themeableSharedStyles: ["-Editor Borders", "Editor-Border-Color", "Editor-Hover-Border-Color", "Editor-Focused-Border-Color",  "Editor-Radius",
                            "-Editor Backgrounds", "Editor-Background-Color", "Editor-Hover-Background-Color", "Editor-Focus-Background-Color",
                            "-Editor Fonts", "Editor-Font-Color","Editor-Hover-Font-Color","Editor-Focus-Font-Color",
                            "-Editor Background Image", "Editor-Image","Editor-Image-Position","Editor-Image-Repeat"

                           ],
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

wm.Object.extendSchema(wm.AbstractEditor, {
    formField: {writeonly: 1, group: "common", order: 500},
    caption: {group: "Labeling", order: 1, bindTarget:true, doc: 1},
    captionPosition: {group: "Labeling", order: 2, doc: 1},
    captionAlign: {group: "Labeling", order: 3, doc: 1},
    captionSize: {group: "layout", order: 4, doc: 1},
    singleLine: {group: "Labeling", order: 5},
    readonly: {group: "editor", order: 1, doc: 1},

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
    getInvalid: {group: "method", doc: 1, returns: "Boolean"},
    setReadonly: {group: "method", doc: 1},
    getDisplayValue: {group: "method",doc: 1, returns: "String"},
    getDataValue: {group: "method", doc: 1, returns: "Any"},
    setDisplayValue: {group: "method", doc: 1},
    setDataValue: {group: "method", doc: 1},

		   focus: {group: "method",doc: 1},
	    clear: {group: "method", doc: 1}
    
    
});
