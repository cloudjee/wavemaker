/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Editors.Text");
dojo.require("wm.base.widget.Editors.AbstractEditor");
dojo.require("dijit.form.SimpleTextarea");

/* We may want to move this class to another file */
dojo.declare("wm.ResizableEditor", wm.AbstractEditor, {
	maxHeight: 96, // only used if autoSizeHeight is enabled; and height is in pixels

/*
	sizeEditor: function() {
		this.inherited(arguments);
		if(this._cupdating) return;
	        if ((this.autoResizeHeight || this.autoResizeWidth) && !this._autoResizing)
			this.scheduleAutoResize();

 	        if (this.readOnlyNode) 
			this.disruptChromeOverflow("readOnlyNode");
	},
        */
        getReadOnlyNodeLineHeight: function() {		
                if (this.autoSizeHeight)
			return "normal";
		else
			return this.inherited(arguments);
	},
        getReadOnlyNodeWhiteSpace: function() {
		// if autoSizeWidth, all text goes on a single line
		if (this.autoSizeWidth) 
			return "nowrap";
		// if autoReszieHeight, text must wrap
		else if (this.autoSizeHeight)
			return "normal";
                // else, autosize isn't used; revert to default behaviors
		else
			return this.inherited(arguments);
	},
        getReadOnlyNodeOverflow: function() {
		// doAutoResize adjusts this value
		if (this.autoSizeHeight || this.autoSizeWidth) 
		    return (this._autoSizeNeedsOverflow) ? "auto" : "hidden";
		else
		        return "hidden";
	},
	updateReadonlyValue: function() {
		this.inherited(arguments);
            // the test for width is actually a test to see if sizeEditor has been called; we can't autoSize if caption and readOnlyNode have not yet been assigned an initial size
	  	if (this.readonly && this.readOnlyNode && this.readOnlyNode.style.width && (this.autoSizeHeight || this.autoSizeWidth))
		    this.doAutoSize(1,1);
	},
/*
        setAutoResizeHeight: function(inValue, noupdate) {
	    this.autoSizeHeight = inValue;
	    if (inValue) {
		    this.autoSizeWidth = false;
		    this.height = this.bounds.h + "px"; // can't be % sized anymore
		    this._percEx.h = 0;  // Has to be done with setting width to px.
	    }
	    if (this.readOnlyNode) {
		    this.updateReadOnlyNodeStyle();
		    if (this.readOnlyNode && inValue && !noupdate && this.readonly)
			this.autoSize();
	    }
	    if (this.isDesignLoaded() && studio.inspector) wm.fire(studio.inspector, "reinspect");
	},

        setAutoResizeWidth: function(inValue, noupdate) {
	    if (inValue && this.isDesignLoaded()) {
		// Only one editor in a left-to-right layout can be autoSizeWidth; clear all others
		if (this.parent.layoutKind == "left-to-right") {
			var siblings = this.parent.c$;
			var length = siblings.length;
			for (var i = 0; i < length; i++) {
				if (siblings[i] != this && siblings[i].autoSizeWidth) this.setAutoResizeWidth(false);
			}
		}
		this.width = this.bounds.w + "px"; // can't be % sized anymore
		this._percEx.w = 0;  // Has to be done with setting width to px.
	    }
	    this.autoSizeWidth = inValue;
	    if (inValue)
		    this.autoSizeHeight = false;
	    if (this.readOnlyNode) {
		    this.updateReadOnlyNodeStyle();
	 	    if (this.readOnlyNode && inValue && !noupdate && this.readonly) 
			this.autoSize();
	    }
 	    if (this.isDesignLoaded() && studio.inspector) wm.fire(studio.inspector, "reinspect");
	},

        scheduleAutoResize: function() {
	    if (!this.autoSizeHeight && !this.autoSizeWidth || !this.readonly || this._autoSizeScheduled) return;
	    if (!this._autoSizeScheduled) {
		this._autoSizeScheduled = true;
		wm.onidle(this, "doAutoSize", true);
	    }
	},
        */
    // requireScheduled is for internal use only; call this without parameters
    // requireScheduled means that if autoResize is called, and scheduled has already been set to false, then we no longer need to perform this scheduled resize.
        doAutoSize: function(setSize, force) {
            if (!this.readonly) return;

            if (this._doingAutoSize || !this.autoSizeHeight && !this.autoSizeWidth) return;
	    if (!force && !this._needsAutoSize) return;

	    if (this.isAncestorHidden()) {
		return;
	    }


            this._doingAutoSize = true;
	    this._needsAutoSize = false;


	    var bases = this.readOnlyNode.style;
	    var divObj = wm.Label.sizingNode;
	    divObj.innerHTML = this.readOnlyNode.innerHTML;
	    divObj.className = this.readOnlyNode.className;  // make sure it gets the same css selectors as this.domNode (we may need to handle ID as well, but most styling is done via classes)

  	    var s = divObj.style;
	    s.position = "absolute";
	    
	    s.paddingLeft = (this.padBorderMargin.l + this.padBorderMargin.r) + "px";
	    s.paddingTop =  (this.padBorderMargin.t + this.padBorderMargin.b) + "px";

	    // wm.Label sets these, need to make sure they are unset for wm.Html
	    s.lineHeight = bases.lineHeight;
	    s.whiteSpace = bases.whiteSpace;

	    // append to parent so that it gets the same css selectors as this.domNode.
	    this.domNode.appendChild(divObj);

   	    // TODO: Does not yet handle case where current height is less than the captionSize
	    if (this.autoSizeHeight && !this._percEx.h) {
		s.height = "";
		s.width = bases.width;


		var readonlyHeight = divObj.clientHeight;

                var newHeight = readonlyHeight;
                if (this.caption)
                    if (this.captionPosition == "top" || this.captionPosition == "bottom")
                        newHeight += parseInt(this.captionNode.style.height) + wm.AbstractEditor.captionPaddingHeight;
                
                var minHeight = this.getMinHeightProp();
                if (minHeight > newHeight) newHeight = minHeight;
                if (this.maxHeight && this.maxHeight < newHeight) {
                    newHeight = this.maxHeight;
                    bases.overflow = "auto";
                    this._autoSizeNeedsOverflow = true;
                } else {
                    bases.overflow = "hidden";
                    this._autoSizeNeedsOverflow = false;
                }
                if (setSize)
		    this.setHeight(newHeight + "px");
                else {
                    this.bounds.h = newHeight;
		    this.height = newHeight + "px";
		}
	    } else if (this.autoSizeWidth && !this._percEx.w) {
		var maxWidth;
		if (this.parent.layoutKind == "left-to-right") {
			maxWidth = this.parent.layout.getMaxFreeSpace(this.parent.c$, "w",this.parent.bounds.w);
			maxWidth += this.bounds.w;
		} else {
			maxWidth = this.parent.getCurrentMaxWidth();
		}

		//this.domNode.style.width = maxWidth + "px"; // give it some room to work with
		s.height = bases.height;
		s.width = "";
		
		/*

		var targetHeight = parseInt(bases.height);
		s.height = "";
		s.width = bases.width;		    

		// STEP 0: Get the height of a single line
		divObj.innerHTML = "a";
		var lineHeight = divObj.clientHeight

		divObj.innerHTML = this.readOnlyNode.innerHTML;		
		var dif = parseInt(divObj.clientHeight) - targetHeight;

		// STEP 1: Make a coarse estimate
		// delta makes the following arbitrary assumptions (font size will screw with this)
		// 1. every line is lineHeight high
		// 2. If there are two lines of text, then to make things fit, we increase width by 2
		// 3. If there are three lines of text, then to make things fit, we increase the width by 1.5
		// 4. If there are n lines of text, then to make things fit, we increase the width by n/n-1
		if (dif > 0) {
		    var numLines = Math.floor(parseInt(divObj.clientHeight)/lineHeight);
		    var desiredLines = Math.floor(targetHeight/lineHeight);
		    var deltaLines = numLines - desiredLines;
		    var newwidth = parseInt(s.width) * (desiredLines/(desiredLines-1)); // Not right; need to repeat this once per line
		    s.width = newwidth + "px";
		}

		// STEP 2: GROW BY 20 PX UNTIL IT FITS
		dif = parseInt(divObj.clientHeight) - targetHeight;
		while (dif > 0) {
		    s.width = (parseInt(s.width) + 20) + "px";
		    dif = parseInt(divObj.clientHeight) - targetHeight;
		}

		// STEP 3: OPTIMIZE: SHIRINK WIDTH BY 5PX UNTIL WE REACH OPTIMAL WIDTH
		while (dif < 0) {
		    s.width = (parseInt(s.width) - 5) + "px";
		    dif = parseInt(divObj.clientHeight) - targetHeight;
		}
		
		// STEP 4: We probably overshot by 5px, in the optimize step; correct for that
		if (diff > 0) s.width =  (parseInt(s.width) + 5) + "px";
		*/
		var readonlyWidth = divObj.clientWidth;
                var newWidth = readonlyWidth;
                if (this.caption)
                    if (this.captionPosition == "left" || this.captionPosition == "right")
                        newWidth += parseInt(this.captionNode.style.width) + wm.AbstractEditor.captionPaddingWidth;

		if (newWidth > maxWidth) {
			newWidth = maxWidth;
                        bases.overflow = "auto";
                        this._autoSizeNeedsOverflow = true;
                } else {
                        bases.overflow = "hidden";
                        this._autoSizeNeedsOverflow = false;
                }
                var minWidth = this.getMinWidthProp();
                if (minWidth > newWidth) newWidth = minWidth;
                if (setSize)
		    this.setWidth(newWidth + "px");
                else {
                    this.bounds.w = newWidth;
		    this.width = newWidth + "px";
		}
	    }
	    divObj.parentNode.removeChild(divObj);
	    this.disruptChromeOverflow("readOnlyNode");
            this.updateReadOnlyNodeStyle();
            this._doingAutoSize = false;
	},
    /* This hack should only be called at design time */
    setAutoSizeWidth: function(inValue) {
        if (inValue == "none") {
            // we don't call this.inherited because arguments contains an inValue that isn't true/false
            wm.Control.prototype.setAutoSizeWidth.call(this, false);
            this.setAutoSizeHeight(false);
        } else if (inValue == "width") {
            this.setAutoSizeHeight(false);
            wm.Control.prototype.setAutoSizeWidth.call(this, true);
        } else if (inValue == "height") {
            wm.Control.prototype.setAutoSizeWidth.call(this, false);
            this.setAutoSizeHeight(true);
        }
        if (this.readOnlyNode && inValue == "none") // we already updateReadOnlyNodeStyle for any other value
            this.updateReadOnlyNodeStyle();
    },
    setMaxHeight: function(newMax) {
        if (this.isDesignLoaded()) {
            if (newMax < this.minHeight) {
                app.alert(studio.getDictionaryItem("wm.ResizableEditor.SET_MAX_HEIGHT", {minHeight: this.minHeight}));
                return;
            } else if (newMax < this.getMinHeightProp()) {
                app.alert(studio.getDictionaryItem("wm.ResizableEditor.SET_MAX_HEIGHT", {minHeight: this.getMinHeightProp()}));
                return;
            }
        }
        this.inherited(arguments);
        if (!this.maxHeight && this.readOnlyNode) this.readOnlyNode.style.overflow = "hidden";
        if (this.readOnlyNode) {
            this.updateReadOnlyNodeStyle();
            this.doAutoSize(1,1);
        }
    },
    // Any time the user changes the class for the label, recalculate autosize with the new styleing which may include font size changes	
    addUserClass: function(inClass, inNodeName) {
	this.inherited(arguments);
	if ((this.autoSizeHeight || this.autoSizeWidth) && this.isDesignLoaded()) {
	    this.doAutoSize(1,1);
        }
    },
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
                        case "autoSizeWidth": 
		                return makeSelectPropEdit(inName, (this.autoSizeHeight) ? "height" : (this.autoSizeWidth) ? "width" : "none", ["none", "width", "height"], inDefault);
		}
		return this.inherited(arguments);
	}
});

wm.Object.extendSchema(wm.ResizableEditor, {
    autoSizeHeight: {type: "Boolean", group: "advanced layout", order: 31, writeonly: true, ignore: true},
    autoSizeWidth: {type: "Boolean", group: "advanced layout", order: 32, shortname: "Auto Size"},
    maxHeight:     {type: "Number", group: "advanced layout", order: 60}
});

dojo.declare("wm.Text", wm.ResizableEditor, {
        resetButton: false,
        placeHolder: "",
	changeOnKey: false,
	changeOnEnter: true,

	showMessages: true,
	promptMessage: "",
	invalidMessage: "",
	password: false,
	maxChars: "",
	regExp: ".*",
	_passwordChar: "&#8226;",
	tooltipDisplayTime:2000,
	getEditorProps: function(inNode, inProps) {
		var p = dojo.mixin(this.inherited(arguments), {
			promptMessage: this.promptMessage,
			invalidMessage: this.invalidMessage || "$_unset_$",
		        placeHolder: this.placeHolder,
			regExp: this.regExp,
			value: this.displayValue,
			required: this.required,
			tooltipDisplayTime: this.tooltipDisplayTime
		});
		// this dijit supports setting password type at creation time only
		if (this.password)
			p.type = "password";
		
		// maxChar property should only be set if user sets a limit otherwise, textEditor and all its sub-class will not work in IE8(Compatible mode for IE7)
		if(this.maxChars)
			p.maxLength = this.maxChars;

		return dojo.mixin(p, inProps || {});
	},
	validationEnabled: function() {
	  return (this.regExp && this.regExp != ".*") || this.required;
	},
        setPlaceHolder: function(inPlaceHolder) {
	    this.placeHolder = inPlaceHolder;
	    if (this.editor)
		this.editor.attr("placeHolder", inPlaceHolder);
	},
	setPassword: function(inPassword) {
		this.password = inPassword;
		this.createEditor();
	        var pos = this.captionPosition;
	        this.captionPosition = "";
	        this.setCaptionPosition(pos);

	},
    setRegExp: function(inExpr) {
	this.regExp = inExpr;
	if (!this._cupdating)
	    this.createEditor();
    },
/* a way to create an html editor and transform it to a dijit onclick; this approach may still be desired at some point... for both performance and usability reasons.  Usability reasons though could be handled with a click to exit readonly mode
    __createEditor: function(node,inProps) {
	    if (this.fakeEditor) {
		dojo.destroy(this.fakeEditor);		
		delete this.fakeEditor;
		return this._createEditor2(node,inProps);
	    }
	  
	    var input = dojo.create("input", {type: "text",
					      id:    this.id + "_INPUT",
					      className: "dijit dijitReset dijitLeft dijitTextBox",
					      style: {width: "100%", height: "100%"}}, node, "first");
	    this.fakeEditor = input;
	    dojo.connect(input, "onfocus", this, function() {
		this.createEditor(inProps);
		this.editor.focus();
	    });
	    return {domNode: input};

    },
    */
	_createEditor: function(inNode, inProps) {
	    var result;
		  if (this.validationEnabled() || this.promptMessage)
		      result = new dijit.form.ValidationTextBox(this.getEditorProps(inNode, inProps));
		  else
		      result = new dijit.form.TextBox(this.getEditorProps(inNode, inProps));
	    if (this.resetButton) {
		dojo.addClass(this.domNode, "wmreseteditor");
		this._resetButtonNode = document.createElement("img");
		this._resetButtonNode.src = dojo.moduleUrl("lib.images.boolean.Signage") + "Close_gray.png";
		var s = this._resetButtonNode.style;
		s.position = "absolute";
		s.width = "16px";
		s.height = "16px";
		s.top = "1px";
		s.right = "1px";
		result.domNode.appendChild(this._resetButtonNode);
		this._resetButtonConnect = dojo.connect(this._resetButtonNode, "onclick", this, function() {
		    wm.onidle(this, function() {
			this.setDataValue("");
		    });
		});
	    }
	    return result;
	},
    sizeEditor: function() {
	this.inherited(arguments);
	if (this._cupdating)
	    return;
	if (dojo.isFF || dojo.isIE) {
	    var input = dojo.query("input.dijitInputInner", this.domNode)[0];
	    if (input) {
		input.style.height = this.editorNode.style.height;
		input.style.lineHeight = this.editorNode.style.lineHeight;
	    }
	}
    },
        destroy: function() {
	    if (this._resetButtonNode) 
		dojo.destroy(this._resetButtonNode);
	    if (this._resetButtonConnect)
		dojo.disconnect(this._resetButtonConnect);
	    this.inherited(arguments);
	},
	validator: function(inValue, inConstraints) {
		var l = Number(this.maxChars);
		return this.maxChars !== "" && !isNaN(l) ? inValue.length <= l : true;
	},
	_getReadonlyValue: function() {
		var v = this.inherited(arguments);
		if (this.password) {
			for (var i=0, a=[], l=v.length; i<l; i++)
				a.push(this._passwordChar);
			v = a.join('');
		}
		return v;
	},
    setResetButton: function(inReset) {
	if (this._resetButtonConnect) {
	    dojo.disconnect(this._resetButtonConnect);
	    delete this._resetButtonConnect;
	}
	this.resetButton = inReset;
	dojo[inReset ? "addClass":"removeClass"](this.domNode, "wmreseteditor");
	this.createEditor();
    }
});



dojo.declare("wm.LargeTextArea", wm.Text, {
        _editorPaddingLeft: 3,
        _editorPaddingRight: 3,
	width: "300px",
	height: "96px",
	captionSize: "24px",
	captionPosition: "top",
        captionAlign: "left",
	singleLine: false,

        changeOnEnter: false,
	_createEditor: function(inNode, inProps) {
	    var editor = new dijit.form.SimpleTextarea(this.getEditorProps(inNode, inProps));
            editor.domNode.style.lineHeight = "normal"; // we test for this style before setting it to height of height px; if its normal we leave it alone
            return editor;
	},
        validationEnabled: function() {return false;},
	sizeEditor: function() {
		this.inherited(arguments);
	},
        setSingleLine: function(inSingleLine) {
            this.inherited(arguments);
            this.captionNode.style.lineHeight = "normal";
        },
        getReadOnlyNodeLineHeight: function() {return "normal";},

        // readonly node always wraps unless autoResizeWidth is used
        getReadOnlyNodeWhiteSpace: function() {
		if (this.autoSizeWidth)
			return this.inherited(arguments);
		else
			return "normal";
	},
        getReadOnlyNodeOverflow: function() {
		if (this.autoSizeWidth || this.autoSizeHeight)
			return this.inherited(arguments);
		else
			return "auto";
	},
        getMinHeightProp: function() {
            return this.minHeight || 80; // scrollbars sometimes have trouble when an editor is too short
        }
});


dojo.declare("wm.ColorPicker", wm.Text, {
    className: "wmeditor wmcolorpickereditor",
    _editorBackgroundColor: true,
    colorPickerDialog: null,
    cancelValue: null,
    _empty: true,
    regExp: "\#[0-9a-fA-F]{6}",
    showMessages: false, // seems to mess up our color picker dialog when both are showing
    init: function() {
        this.inherited(arguments);
        this.subscribe("wm.AbstractEditor-focused", this, function(inEditor) {
            if (this != inEditor) {
                if (this.colorPickerDialog)
                    this.colorPickerDialog.dismiss();
            }
        });
    },
    postInit: function() {
        this.inherited(arguments);
        var v = this.getDataValue() || "#FFFFFF";
        this.setNodeColors(v);
    },
    createColorPicker: function() {
	wm.getComponentStructure("wm.ColorPickerDialog");
        this.colorPickerDialog = new wm.ColorPickerDialog({owner: this});
        this.colorPickerDialog.connect(this.colorPickerDialog, "onChange", this, function(inValue) {
	    if (this.colorPickerDialog.showing)
		this.setDataValue(inValue);
        });
        this.colorPickerDialog.connect(this.colorPickerDialog, "onCancel", this, function(inValue) {
            var val = this.getDataValue();
            if (val != this.cancelValue) {
                this.setDataValue(this.cancelValue);
                this.changed();
            }
            this.colorPickerDialog.dismiss();
        });
    },
    onfocus: function() {
        if (!this.colorPickerDialog || !this.colorPickerDialog.showing) {
            var v = this.getDataValue() || "#FFFFFF";
            this.cancelValue = this.getDataValue();
            if (!this.colorPickerDialog)
                this.createColorPicker();
            this.colorPickerDialog.setValue(v);
            this.colorPickerDialog.setShowing(true);
        }
    },
    setEditorValue: function(inValue) {
        this.inherited(arguments);
	this._empty = !Boolean(inValue);
        this.setNodeColors(inValue);
    },
    setNodeColors: function(inValue) {
        if (inValue) {
            this.editorNode.style.backgroundColor = inValue;
            this.editorNode.style.color = (parseInt(inValue.substr(1,2),16) + parseInt(inValue.substr(3,2),16) + parseInt(inValue.substr(5,2),16) < 200) ? "white" : "black";
        } else {
            this.editorNode.style.backgroundColor = "transparent";
            this.editorNode.style.color = "black";
        }
    },
    getDataValue: function() {
        if (this.getInvalid())
            return "#ffffff";
	return this.inherited(arguments) || "#ffffff";
    },
    onblur: function() {
        if (this.colorPickerDialog && this.getDataValue() && (this._empty || this.colorPickerDialog.getValue().toLowerCase() != this.getDataValue().toLowerCase() && this.colorPickerDialog._changed)) {
	    this._empty = false;
            this.changed();
        }
    },
    changed: function() {
        if (this.colorPickerDialog) {
            this.setNodeColors(this.getDataValue());
            return this.inherited(arguments);
        }
    }

});


wm.Object.extendSchema(wm.Text, {
    placeHolder: {group: "Labeling", doc: 1}, // TODO: ignoring this only for 6.2 as it needs polish, particularly if its to work with themes
    promptMessage: {group: "Labeling", order: 6},
    tooltipDisplayTime: {group: "Labeling", order: 7},
    password: {group: "editor", order: 5, doc: 1},
    maxChars: {group: "editor", order: 6, doc: 1},
    changeOnKey: {group: "events", order: 3},
    regExp: {group: "validation", order: 2, doc: 1},
    invalidMessage: {group: "validation", order: 3},
    showMessages: {group: "validation", order: 4},
    onEnterKeyPress: {ignore: 0},
    setPlaceHolder: {group: "method", doc: 1},
    setPassword: {group: "method", doc: 1},
    setRegExp: {group: "method", doc: 1}
});


wm.Object.extendSchema(wm.LargeTextArea, {
	changeOnEnter: { ignore: 1 },
        onEnterKeyPress: {ignore: 1},
	password: {ignore: 1}
});

wm.LargeTextArea.extend({
     themeableDemoProps: {height: "100%"}
});

wm.Object.extendSchema(wm.ColorPicker, {
    regExp: {ignore: true}
});