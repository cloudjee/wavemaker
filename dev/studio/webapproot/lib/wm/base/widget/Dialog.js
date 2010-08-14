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

/* DIALOG TODO LIST:
 * 1. Are you sure you want to close project (confirm)
 * 2. Enter new project name (new project, copy project)
 * 3. Are you sure you want to delete (project name)
 * 4. Successfully exported project to zip file...
 */

dojo.provide("wm.base.widget.Dialog");
dojo.require("wm.base.widget.Box");

wm.dialog = {};

wm.dismiss = function(inWidget, inWhy) {
	var o = inWidget;
	while (o && !dojo.isFunction(o.dismiss))
		o = o.owner;
	wm.fire(o, "dismiss", [inWhy]);
}

wm.bgIframe = {
	create: function() {
		var html=[
				"<iframe src='javascript:\"\"'",
				" style='position: absolute; left: 0px; top: 0px;",
				" z-index: 2; filter:Alpha(Opacity=\"0\");'>"
			].join(''),
			f = this.domNode = dojo.isIE ? document.createElement(html) : document.createElement("IFRAME");
		document.body.appendChild(f);
		f.style.display = "none";
		if (dojo.isMoz) {
			f.style.position = "absolute";
			f.style.left = f.style.top = "0px";
			f.style.opacity = 0;
			f.style.zIndex = 2;
		}
		dojo.subscribe("window-resize", this, "size")
	},
    setShowing: function(inShowing,forceChange) {
		if (!this.domNode)
			return;
		if (forceChange || inShowing != this.showing) {
			this.domNode.style.display = inShowing ? "" : "none";
			this.showing = inShowing;
		}
		if (inShowing)
			this.size();
	},
	size: function(inNode) {
		if (!this.domNode || !this.showing)
			return;
		if (inNode)
			this.sizeNode = inNode;
		var sizeNode = this.sizeNode || document.body;
		dojo.marginBox(this.domNode, dojo.contentBox(sizeNode));
	}
};

dojo.addOnLoad(function() {
	// iframe covering required on IE6 and (wah) on FF2 Mac
	if ((dojo.isIE && dojo.isIE < 7) || (dojo.isMoz && dojo.isMoz < 6 && navigator.userAgent.indexOf("Macintosh") != -1))
		wm.bgIframe.create();
});

dojo.declare("wm.Dialog", wm.Container, {
    scrim: true,
    _minified: false,
    _maxified: false,
    noEscape: false,
	layoutKind: "top-to-bottom",
    horizontalAlign: "left",
    verticalAlign: "top",
	border: 2,
    titlebarBorder: 0,
    titlebarBorderColor: "black",
/*
	contentWidth: 640,
	contentHeight: 400,
	*/
    margin: "3",
    width: "640px",
    height: "400px",
	showing: false,
        dialogScrim: null,
	modal: true,
	init: function() {
		this.dialogScrim = new wm.Scrim({owner: this, _classes: {domNode: ["wmdialog-scrim"]}, waitCursor: false});
		this.inherited(arguments);
	    if (this.isDesignedComponent())
		studio.designer.domNode.appendChild(this.domNode);
	    else
		document.body.appendChild(this.domNode);
		dojo.addClass(this.domNode, "wmdialog");
/*
		this.setContentWidth(this.contentWidth);
		this.setContentHeight(this.contentHeight);
		*/
		this.domNode.style.position = "absolute";
		this.domNode.style.zIndex = 30;
		this.domNode.style.display = "none";		
		this._connections.push(this.connect(document, "onkeypress", this, "keyPress"));
		this._subscriptions.push(dojo.subscribe("window-resize", this, "reflow"));	    
	        this.createTitle();
	        if (this.useContainerNode) {
                    var owner = (this.declaredClass == "wm.Dialog") ? this.owner : this; // set the owner to wm.Page to allow othis to be written... IF its an instance not a subclass of wm.Dialog
	            this.containerWidget = new wm.Container({_classes: {domNode: ["wmdialogcontainer"]}, name: "containerWidget", parent: this, owner: owner, layoutKind: "top-to-bottom", padding: "0", margin: "0", border: "0", width: "100%", height: "100%", horizontalAlign: "left", verticalAlign: "top", autoScroll: true});
		    this.containerNode = this.containerWidget.domNode;
		} else {
	            this.containerNode = this.domNode;//this.container.domNode;
		}
	        this.setModal(this.modal);
            this.setTitlebarBorder(this.titlebarBorder);
            this.setTitlebarBorderColor(this.titlebarBorderColor);
	},
    setTitlebarBorder: function(inBorder) {
        this.titlebarBorder = inBorder;
        this.titleBar.setBorder(inBorder);
        this.titleBar.setHeight((34 + this.titleBar.padBorderMargin.t + this.titleBar.padBorderMargin.b) + "px");
    },
    setTitlebarBorderColor: function(inBorderColor) {
        this.titlebarBorderColor = inBorderColor;
        this.titleBar.setBorderColor(inBorderColor);
    },

    setModal: function(inModal) {
	dojo[inModal ? "removeClass" : "addClass"](this.domNode, "nonmodaldialog");
	this.modal = (inModal === undefined || inModal === null) ? true : inModal;
	if (this.dojoMoveable) {
	    this.dojoMoveable.destroy();
	    this.dojoMoveable = null;
	}
	if (!inModal) 
	    this.dojoMoveable = new dojo.dnd.Moveable(this.domNode, {handle: this.titleLabel.domNode});
	if (this.showing) {
	    this.dialogScrim.setShowing(this.modal);
	    wm.bgIframe.setShowing(!this.modal && !this.isDesignedComponent());
	}
	this.titleClose.setShowing(!this.modal && !this.noEscape);
	this.titleMinify.setShowing(!this.modal);
	this.titleMaxify.setShowing(!this.modal);
    },
    setNoEscape: function(inNoEscape) {
	this.noEscape = inNoEscape;
	this.titleClose.setShowing(!this.modal && !this.noEscape);
    },	
    minify: function() {
	this._minified = true;
	this.titleMinify.hide();
	this.titleMaxify.hide();
	this.titleClose.hide();
	this.renderBounds();
    },
    unminifyormove: function(inEvent) {
	this._unminifyMouseX = inEvent.x;
	this._unminifyMouseY = inEvent.y;
    },
    unminify: function(inEvent) {
	if (!this._minified) return;
	if (inEvent && (Math.abs(this._unminifyMouseX - inEvent.x) > 5 ||
			Math.abs(this._unminifyMouseY != inEvent.y) > 5)) return;

	this._minified = false;
	this.bounds.h = parseInt(this.height);
	this.bounds.w = parseInt(this.width);
	this.titleMinify.show();
	this.titleMaxify.show();
	this.titleClose.setShowing(!this.noEscape);
	this.renderBounds();
    },
    maxify: function() {
	if (this._maxified) {
	    this._maxified = false;
	    //this.titleMaxify.setCaption(" ");
	    this.bounds.h = parseInt(this.height);
	    this.bounds.w = parseInt(this.width);
	} else {
	    this._maxified = true;
	    //this.titleMaxify.setCaption("O");
	}
	this.renderBounds();
	this.reflow();
    },

	reflowParent: function() {
	},
	dismiss: function(e) {
		this.setShowing(false);
		var why = "" || dojo.isString(e) ? e : e && e.target && e.target.innerHTML;
		this.onClose(why);
		why = null;
	},
        destroy: function() {
	    this.dismiss();
	    if (this.dialogScrim)
                this.dialogScrim.destroy();
	    this.inherited(arguments);
	},
	flow: function() {
		if (this.showing) {
			// Dialog is responsible for rendering itself.
			this.renderBounds();
			this.inherited(arguments);
			this.dialogScrim.reflowParent();
		}
	},
 	renderBounds: function() {
		if (this.showing) {
		    if (this._minified) {
			var parentBox = dojo.contentBox(window.document.body);
			var t = parentBox.h - 30;
			var l = parentBox.w - 200;
			this.setBounds(l,t,200,30);
		    } else if (this._maxified) {
			var parentBox = dojo.contentBox(window.document.body);
			this.setBounds(20,20,parentBox.w-40,parentBox.h-40);
		    } else {
			// center within parent
			var parentBox = dojo.contentBox(this.domNode.parentNode);
			var bounds = this.getBounds();
                        if (!this._fixPosition) {
			    var t = (parentBox.h - bounds.h) / 2;
			    var l = (parentBox.w - bounds.w) / 2;
			    this.setBounds(l, t);
			    this.domNode.style.top = t + "px";
			    this.domNode.style.left = l + "px";
                        }
		        wm.bgIframe.size();
		    }
/*
		    if (this.isDesignedComponent()) 
			this.dialogScrim.size(studio.designer.domNode);
			*/
		    return this.inherited(arguments);
		}            
	},
	setContent: function(inContent) {
		this.containerNode.innerHTML = inContent;
	},
        setShowing: function(inShowing, forceChange) {
		if (inShowing != this.showing && this.modal)
			this.dialogScrim.setShowing(inShowing);
		this.inherited(arguments);
		// global flag for easily telling if a dialog is showing.
		wm.dialog.showing = this.showing;
		if (this.showing) {
		    if (this._minified)
			this.unminify();
			this.reflow();
		}/* else
			// FIXME: hide any tooltips that may be showing
			wm.hideToolTip(true);*/
	    wm.bgIframe.setShowing(inShowing && this.modal && !this.isDesignedComponent());
		if (this.showing)
			this.onShow();
	},
/*
	setContentWidth: function(inWidth) {
		this.contentWidth = inWidth;
		this.setWidth(inWidth + "px");
	},

	setContentHeight: function(inHeight) {
		this.contentHeight = inHeight;
		this.setHeight(inHeight + "px");
	},
	setContentSize: function(inWidth, inHeight) {
		this.setContentWidth(inWidth);
		this.setContentHeight(inHeight);
	},
	*/
	keyPress: function(inEvent) {
            if (!this.showing) return true;
            var dialogs = dojo.query(".wmdialog");
            var zindex = parseInt(this.domNode.style.zIndex);
            for (var i = 0; i < dialogs.length; i++) {
                if (dialogs[i].style.display != "none" && parseInt(dialogs[i].style.zIndex) > zindex) {
                    return true; // this isn't the foremost dialog
                }
            }

	    if (inEvent.keyCode == dojo.keys.ESCAPE && !this.noEscape) {
		if (this.showing) {
		    this.setShowing(false);
		    this.onClose("cancel");
		    //inEvent.stopPropagation(); // Else escape will also change what the selected canvas item is
		}
	    } else if (inEvent.keyCode == dojo.keys.ENTER) {
                if (this.$.textInput && this.$.textInput.getDataValue)
                    this.onEnterKeyPress(this.$.textInput.getDataValue());
                else
                    this.onEnterKeyPress();
            }
            return true;
	},
        onEnterKeyPress: function(inText) {
        },
	onShow: function() {
	},
	onClose: function(inWhy) {
	},
    createTitle: function() {
	this.titleBar = new wm.Container({_classes: {domNode: ["dialogtitlebar"]}, 
					  showing: this.title,
					  name: "titleBar", 
					  parent: this,
					  owner: this,
					  width: "100%",
					  height: "30px",
					  margin: "0",
					  padding: "0",
					  border: this.titlebarBorder,
					  borderColor: this.titlebarBorderColor,
					  layoutKind: "left-to-right"});
	this.titleClose = new wm.Button({_classes: {domNode: ["wm_FontSizePx_16px","wm_TextDecoration_Bold"]},
					 name: "titleClose",
					 caption: "X",
					 width: "30px",
					 height: "30px",
					 parent: this.titleBar,
					 owner: this,
					 showing: !this.modal && !this.noEscape });
	this.titleMinify = new wm.Button({_classes: {domNode: ["wm_FontSizePx_16px","wm_TextDecoration_Bold"]},
					  name: "titleMinify",
					  caption: "&ndash;",
					  width: "30px",
					  height: "30px",
					  parent: this.titleBar,
					  owner: this,
					  showing: !this.modal});	

	this.titleMaxify = new wm.Button({_classes: {domNode: ["wm_FontSizePx_16px","wm_TextDecoration_Bold"]},
					  name: "titleMinify",
					  caption: " ",
					  width: "30px",
					  height: "30px",
					  parent: this.titleBar,
					  owner: this,
					  showing: !this.modal});	
	this.titleLabel = new wm.Label({_classes: {domNode: ["wmdialog-title", "wm_FontSizePx_16px","wm_TextDecoration_Bold"]},
					parent: this.titleBar,
					owner: this,
					caption: this.title,
					showing: Boolean(this.title),
					margin: "0,0,0,10",
					width: "100%",
					height: "30px"});
	//this.titleBevel = new wm.Bevel({ parent: this, owner: this, showing: Boolean(this.title) });
	this.connect(this.titleClose, "onclick", this, "dismiss");
	this.connect(this.titleMinify, "onclick", this, "minify");
	this.connect(this.titleMaxify, "onclick", this, "maxify");
	this.connect(this.titleLabel, "onclick", this, "unminify");
	this.connect(this.titleLabel.domNode, "onmousedown", this, "unminifyormove");
    },
    setTitle: function(inTitle) {
	this.title = inTitle;
	if (this.titleLabel) {
	    this.titleLabel.setCaption(inTitle);
	    this.titleLabel.setShowing(true);
	}	
	if (this.titleBar)
	    this.titleBar.setShowing(Boolean(inTitle));
    },
    setSizeProp: function(n, v, inMinSize) {
	this.inherited(arguments);
	this.renderBounds();
	if(this.designWrapper) {
	    this.designWrapper.controlBoundsChange();
	    this.designWrapper.renderBounds();			
	}
        this.reflow();
    },

    // this is what is called when you bind an event handler to a dialog
    update: function() {
	this.show();
    },
    // design only; fired when dialog is selected; we want it to autoshow when selected in the designer
    activate: function() {
	this.show();
    },
    // design only; fired when dialog is selected; we want it to autohide when deselected in the designer
    deactivate: function() {
	this.hide();
    }
});


wm.Dialog.extend({
    themeableStyles: ["wm.Dialog_Inner-Radius"],
    // backward-compatibility fixups
	afterPaletteDrop: function() {
	    this.inherited(arguments);
	    this.setParent(null);
	    studio.designer.domNode.appendChild(this.domNode);
	    this.show();
	}

});


wm.Object.extendSchema(wm.Dialog, {
    title: {group: "Header and Footer", order: 1},
    titlebarBorder: {group: "Header and Footer", order: 5},
    titlebarBorderColor: {group: "Header and Footer", order: 6},
    noEscape: {group: "Dialog Keyboard", order: 1},
    enterKeyIsButton1: {group: "Dialog Keyboard", order: 2, ignore: 1},
    modal: {group: "Dialog Options", order: 1},
    fitToContentWidth: {ignore: 1},
    fitToContentHeight: {ignore: 1},
    useContainerNode: {ignore: 1},
    lock: {ignore: 1},
    freeze: {ignore: 1},
    padding: {ignore: 1},
    margin: {ignore: 1},
    scrollX: {ignore: 1},
    scrollY: {ignore: 1},
    layoutKind: {ignore: 1},
    horizontalAlign: {ignore: 1},
    verticalAlign: {ignore: 1},
    showing: {ignore: 1},
    owner: { group: "common", order: 1, readonly: true, options: ["Page", "Application"] }
});




dojo.declare("wm.WidgetsJsDialog", wm.Dialog, {
    border: "2",
    borderColor: "rgb(80,80,80)",
    margin: "0,4,4,0",
    useContainerNode: true,
    widgets_data: null,
    widgets_json: "",
    width: "400px",
    height: "150px",
    init: function() {
/*
	this.contentWidth = parseInt(this.width);
	this.contentHeight = parseInt(this.height);
	*/
	this.inherited(arguments);
	if (!this.widgets_data)
	    this.setWidgetsJson(this.widgets_json);
	this.generateContents();
	this.renderBounds();

    },
    setShowing: function(inShowing, forceChange) {
	this.inherited(arguments);
	if (this.isReflowEnabled() && !this._rendered) {
	    this.leafFirstRenderCss();
	    this._rendered = true;
	}
    },
    postInit: function() {
	this.inherited(arguments);
	this.reflow();
    },

    setWidgetsJson: function(inJson) {
	try {
	    this.widgets_json = inJson;
	    this.widgets_data = dojo.fromJson(this.widgets_json);
	    if (!this._cupdating)
		this.generateContents();
	} catch(e) {console.error(e);}
    },
    generateContents: function() {
	this.containerWidget._cupdating = true;
	this.containerWidget.createComponents(this.widgets_data, this);
	this.containerWidget._cupdating = false;
	this.containerWidget.reflow();
    }
});


dojo.declare("wm.RichTextDialog", wm.WidgetsJsDialog, {
    autoScroll: false,
    noEscape: true,
    footerBorder: "",
    footerBorderColor: "",
    title: "Write Your Documentation",
    padding: "0",
    width: "500px",
    height: "500px",
    modal: false,
    html: "", // initial html to show in the editor; use getHtml for current value
    prepare: function() {
        this.inherited(arguments);
        this.widgets_data = {documentation: ["wm.RichText", {width: "100%", height: "100%", "toolbarAlign":false,"toolbarLink":true,"toolbarColor":true, dataValue: this.html, displayValue: this.html}, {}],
		             dialogFooter: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, name: "dialogfooter", layoutKind: "left-to-right",  padding: "2,0,2,0", horizontalAlign: "right", height: "34px", width: "100%"}, {}, {
		                 okButton: ["wm.Button", {"height":"100%","width":"150px","caption": "OK"}, {"onclick":"onOkClick"}],
		                 cancelButton: ["wm.Button", {"height":"100%","width":"150px","caption": "Cancel"}, {"onclick":"onCancelClick"}]
	                     }]};
    },
    init: function() {
	this.inherited(arguments);
        this.setFooterBorder(this.footerBorder);
        this.setFooterBorderColor(this.footerBorderColor);
    },
    setFooterBorder: function(inBorder) {
        this.footerBorder = inBorder;
        if (this.$.dialogFooter) {
            this.$.dialogFooter.setBorder(inBorder);
            this.$.dialogFooter.setHeight((34 + this.$.dialogFooter.padBorderMargin.t + this.$.dialogFooter.padBorderMargin.b) + "px");
        }
    },
    setFooterBorderColor: function(inBorderColor) {
        this.footerBorderColor = inBorderColor;
        if (this.$.dialogFooter)
            this.$.dialogFooter.setBorderColor(inBorderColor);
    },

    setHtml: function(inHtml) {
        this.html = inHtml; // for design mode use only
        if (this.$.documentation)
	    this.$.documentation.setDataValue(inHtml);
    },
    getHtml: function() {
        if (this.$.documentation)
	    return this.$.documentation.getDataValue();
    },
    onOkClick: function() {
	this.dismiss();
    },
    onCancelClick: function() {
	this.dismiss();
    },
    setShowing: function(inShowing) {
        this.inherited(arguments);
        if (this.$.documentation && !this.$.documentation.editor)
            this.$.documentation.setShowing(true);
    }
});
wm.Object.extendSchema(wm.RichTextDialog, {
    html: {group: "Dialog Options", order: 2},
    enterKeyIsButton1: {group: "Dialog Keyboard", order: 2},
    footerBorder: {group: "style", order: 100},
    footerBorderColor:  {group: "style", order: 101}
});
wm.RichTextDialog.extend({
    themeable: false
});

dojo.declare("wm.GenericDialog", wm.WidgetsJsDialog, {
    enterKeyIsButton1: true,
    autoScroll: false,
    noEscape: true,
    title: "Generic Dialog",
    footerBorder: "",
    footerBorderColor: "",
    padding: "0",
    regExp: ".*",
    button1Caption: "",
    button2Caption: "",
    button3Caption: "",
    button4Caption: "",
    button5Caption: "",
    button6Caption: "",
    button1Close: false,
    button2Close: false,
    button3Close: false,
    button4Close: false,
    button5Close: false,
    button6Close: false,
    userPrompt: "Testing...",
    showInput: false,
    prepare: function() {
        this.inherited(arguments);
        this.widgets_data = {
	    genericInfoPanel: ["wm.Panel", {layoutKind: "top-to-bottom",  width: "100%", height: "100%", horizontalAlign: "left", verticalAlign: "top", autoScroll: true, fitToContentHeight: true, padding: "10,5,10,5"}, {}, {
		userQuestionLabel: ["wm.Html", {autoScroll: false, "height":"25px",autoSizeHeight: true, "width":"100%",html: ""}],
		textInput: ["wm.TextEditor", {"width":"100%","captionSize":"0%","showing":false}, {}, {
		    editor: ["wm._TextEditor", {}, {}]
		}]
	    }],
	dialogFooter: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]},
				    name: "dialogFooter",
				    layoutKind: "left-to-right",
				    padding: "2,6,2,6", 
				    horizontalAlign: "right",
				    height: "34px",
				    width: "100%"}, {}, {
		                        button6: ["wm.Button", {"height":"100%","width":"130px","showing":false}, {"onclick":"buttonClick"}],
		                        button5: ["wm.Button", {"height":"100%","width":"130px","showing":false}, {"onclick":"buttonClick"}],
		                        button4: ["wm.Button", {"height":"100%","width":"130px","showing":false}, {"onclick":"buttonClick"}],
		                        button3: ["wm.Button", {"height":"100%","width":"130px","showing":false}, {"onclick":"buttonClick"}],
		                        button2: ["wm.Button", {"height":"100%","width":"130px","showing":false}, {"onclick":"buttonClick"}],
		                        button1: ["wm.Button", {"height":"100%","width":"130px","showing":false}, {"onclick":"buttonClick"}]
	                            }]
        };

    },
    init: function() {
	this.inherited(arguments);
        this.setFooterBorder(this.footerBorder);
        this.setFooterBorderColor(this.footerBorderColor);

	var captionFound = false;
	for (var i = 1; i <= 6; i++) {
	    var caption = this["button" + i + "Caption"];
	    var button = this.$["button" + i];
	    if (caption) {
		captionFound = true;
		button.setCaption(caption);
		button.show();
	    }
            if (this.$.dialogFooter)
	        this.$.dialogFooter.setShowing(captionFound);
	    this.setShowInput(this.showInput);
	}
        if (this.$.userQuestionLabel)
	    this.$.userQuestionLabel.setHtml(this.userPrompt);
        this.containerWidget.setFitToContentHeight(true);
    },
    setFooterBorder: function(inBorder) {
        this.footerBorder = inBorder;
        if (this.$.dialogFooter) {
            this.$.dialogFooter.setBorder(inBorder);
            this.$.dialogFooter.setHeight((34 + this.$.dialogFooter.padBorderMargin.t + this.$.dialogFooter.padBorderMargin.b) + "px");
        }
    },
    setFooterBorderColor: function(inBorderColor) {
        this.footerBorderColor = inBorderColor;
        if (this.$.dialogFooter)
            this.$.dialogFooter.setBorderColor(inBorderColor);
    },
    // handle fitToContentHeight adjustments
    reflow: function() {
        try {
            if (!this._settingHeight) {
                var height = this.getPreferredFitToContentHeight();
                this._settingHeight = true;
                this.setHeight(height + "px");
                this._settingHeight = false;
                this.inherited(arguments);
            }
        } catch(e) {this._settingHeight = false;}
        
    },
    setShowing: function(inShowing,forceChange) {
        this.inherited(arguments);
        if (inShowing) {
            if (this.$.userQuestionLabel)
                this.$.userQuestionLabel.doAutoSize(true,true);
            if (this.showInput && this.$.textInput && this.$.textInput.focus)
                this.$.textInput.focus();
            wm.onidle(this, "reflow");
        }
    },
    setShowInput: function(inShowInput) {
	this.showInput = inShowInput;
        if (this.$.textInput)
	    this.$.textInput.setShowing(inShowInput);
    },
    setInputDefaultValue: function(inValue) {
        if (this.$.textInput)
	    this.$.textInput.setDataValue(inValue);
    },
    getInputDataValue: function(inValue) {
        if (this.$.textInput)
	    return this.$.textInput.getDataValue();
    },
    setUserPrompt: function(inPrompt) {
	this.userPrompt = inPrompt;
        if (this.$.userQuestionLabel)
	    this.$.userQuestionLabel.setHtml(inPrompt);
    },
    setButton1Caption: function(inCap) {this.setButtonCaption(1,inCap);},
    setButton2Caption: function(inCap) {this.setButtonCaption(2,inCap);},
    setButton3Caption: function(inCap) {this.setButtonCaption(3,inCap);},
    setButton4Caption: function(inCap) {this.setButtonCaption(4,inCap);},
    setButton5Caption: function(inCap) {this.setButtonCaption(5,inCap);},
    setButton6Caption: function(inCap) {this.setButtonCaption(6,inCap);},
    
    setButtonCaption: function(inButtonNumber, inButtonCaption) {
	var button = this.$["button" + inButtonNumber];
	this["button" + inButtonNumber + "Caption"] = inButtonCaption;
        if (!button) return;
	if (inButtonCaption) {
	    button.setCaption(inButtonCaption);
	    button.show();
	} else {
	    button.hide();
	}	
	this.$.dialogFooter.setShowing(this.button1Caption || this.button2Caption || this.button3Caption || this.button4Caption || this.button5Caption || this.button6Caption);
    },
    onEnterKeyPress: function(inText) {
        if (this.enterKeyIsButton1) {
            if (this.button1Close) this.dismiss();
            this.onButton1Click(this.button1, inText);
        }
    },
    buttonClick: function(inSender) {
	var name = inSender.name;
	var id = parseInt(name.match(/\d+/)[0]);
	if (this["button" + id + "Close"]) this.dismiss();

	var text = (this.$.textInput) ? this.$.textInput.getDataValue() : "";
	switch(id) {
	case 1:  this.onButton1Click(inSender, text);break;
	case 2:  this.onButton2Click(inSender, text);break;
	case 3:  this.onButton3Click(inSender, text);break;
	case 4:  this.onButton4Click(inSender, text);break;
	case 5:  this.onButton5Click(inSender, text);break;
	case 6:  this.onButton6Click(inSender, text); break;
	}
    },
    onButton1Click: function(inButton, inText) {},
    onButton2Click: function(inButton, inText) {},
    onButton3Click: function(inButton, inText) {},
    onButton4Click: function(inButton, inText) {},
    onButton5Click: function(inButton, inText) {},
    onButton6Click: function(inButton, inText) {}
});


wm.Object.extendSchema(wm.GenericDialog, {
    enterKeyIsButton1: {group: "Dialog Keyboard", order: 2},
    widgets_json: {ignore: 1},
    button1Caption: {group: "Buttons", order: 1},
    button1Close: {group: "Buttons", order: 2},
    button2Caption: {group: "Buttons", order: 3},
    button2Close: {group: "Buttons", order: 4},
    button3Caption: {group: "Buttons", order: 5},
    button3Close: {group: "Buttons", order: 6},
    button4Caption: {group: "Buttons", order: 7},
    button4Close: {group: "Buttons", order: 8},
    button5Caption: {group: "Buttons", order: 9},
    button5Close: {group: "Buttons", order: 10},
    button6Caption: {group: "Buttons", order: 11},
    button6Close: {group: "Buttons", order: 12},
    footerBorder: {group: "Header and Footer", order: 10},
    footerBorderColor: {group: "Header and Footer", order: 11},
    userPrompt: {group: "Dialog Options", order: 2},
    showInput: {group: "Dialog Options", order: 3},
    regExp: {group: "Dialog Options", order: 4},
    footerBorder: {group: "style", order: 100},
    footerBorderColor:  {group: "style", order: 101}
});

wm.GenericDialog.extend({

});


dojo.declare("wm.FileUploadDialog", wm.GenericDialog, {
    uploadService: "",
    uploadOperation: "",
    width: "500px",
    height: "120px",
    showInput: true,
    button1Caption: "Upload",
    button2Caption: "Cancel",
    button1Close: true,
    button2Close: true,
    init: function() {
        this.widgets_data.genericInfoPanel[3].textInput = ["wm.FileUpload", {  caption: "",
                                                                               uploadButton: false,
						   padding: "0,20,0,20",
						   width: "100%",
						   height: "28px",
						   captionSize: "100px",						   
						   captionAlign: "left",
						   captionPosition: "left",
						   uploadButtonPosition: "right",
						   uploadButtonWidth: "100px",
						   uploadButtonHeight: "30px",
						   service: "",
						   operation: ""}, 
                                                {  onUploadSuccess: "importClickCallback",
						   onUploadError: "importClickError",
						   onBegin:       "startImportClick"}, {}];
        this.inherited(arguments);
        this.fileUploader = this.$.textInput;
        this.setUploadService(this.uploadService);
        this.setUploadOperation(this.uploadOperation);
    },
    startImportClick: function(inSender) {
        if (window["studio"])
	    studio.beginWait("Importing File...");
    },			  
    importClickCallback: function(inSource, inResponse) {
        if (window["studio"])
	    studio.endWait();
	wm.fire(this.owner, "dismiss");
    },
    importClickError: function(inSource,inError) {
        if (window["studio"])
	    studio.endWait();
        app.toastDialog.showToast("Import failed!", 3000, "Warning");
	// any notification to user must be done by the component that requested the file
    },
    setUploadService: function(inService) {
	this.uploadService = inService;
	this.fileUploader.setService(inService);
    },
    setUploadOperation: function(inOperation) {
	this.uploadOperation = inOperation;
	this.fileUploader.setOperation(inOperation);
    },


    buttonClick: function(inSender) {
	var name = inSender.name;
	var id = parseInt(name.match(/\d+/)[0]);
	switch(id) {
	case 1:  this.onButton1Click(inSender);break;
	case 2:  this.onButton2Click(inSender);break;
	case 3:  this.onButton3Click(inSender);break;
	case 4:  this.onButton4Click(inSender);break;
	case 5:  this.onButton5Click(inSender);break;
	case 6:  this.onButton6Click(inSender); break;
	}
	if (this["button" + id + "Close"]) this.dismiss();
    },

    onButton1Click: function(inButton) {
        this.fileUploader.upload();
    },

    onButton2Click: function(inButton) {},
    onButton3Click: function(inButton) {},
    onButton4Click: function(inButton) {},
    onButton5Click: function(inButton) {},
    onButton6Click: function(inButton) {}
});


dojo.declare("wm.Toast", wm.WidgetsJsDialog, {
    classNames: "wmtoast wmtoastExtraSpecific",
    title: "",
    modal: false,
    useContainerNode: true,
    _timeoutId: 0,
    duration: 5000,
    content: "Toast",
    height: "100px",
    width: "350px",
    corner: "br",
    border: "5",
    margin: "0",
    prepare: function() {
        this.inherited(arguments);
        this.widgets_data = {img: ["wm.Picture", {_classes: {domNode: ["ToastLeft"]}, width: "30px", height: "30px"}, {}],
		             message: ["wm.Label", { height: "100px", width: "100%", singleLine: false, autoSizeHeight: true, margin: "5,10,5,10"}]};
    },
    init: function() {
	this.inherited(arguments);
        this.containerWidget.setLayoutKind("left-to-right");
        this.containerWidget.setVerticalAlign("middle");
        this.img = this.containerWidget.c$[0];
        this.message = this.containerWidget.c$[1];
	this.setContent(this.content);
	this.connectEvents(this.domNode, ["click"]);
    },
    click: function() {
        this.fadeaway(true);
        this.onToastClick();
    },
    onToastClick: function() {},
    postInit: function() {
	this.inherited(arguments);
    },
    setShowing: function(inShow, forceChange) {
        this.inherited(arguments);
        if (inShow)
            this.renderBounds();
    },
    renderBounds: function() {
	if (!this.showing) return;
        var w = parseInt(this.width); // assumes px
        var h = parseInt(this.height); // assumes px
        var W = app._page.root.bounds.w;
        var H = app._page.root.bounds.h;
        var buffer = 10;
        var t,l;
        
        var top  = this.corner.substring(0,1);
        var left = this.corner.substring(1,2);

        switch(left) {
        case "l":
            l = buffer;
            break;
        case "r":
            l = W - w - buffer;
            break;
        case "c":
            l = Math.floor((W - w)/2);
            break;
        }

        switch(top) {
        case "t":
            t = buffer;
            break;
        case "b":
            t = H - h - buffer;
            break;
        case "c":
            t = Math.floor((H - h)/2);
            break;
        }

	this.setBounds(l, t, w, h);
	wm.Control.prototype.renderBounds.call(this);
    },
    setContent: function(inContent) {
	this.content = inContent;
        if (this.message)
            this.message.setCaption(inContent);
    },

    // classes supported "Success", "Warning", "Info".  User may add their own classes via css file
    showToast: function(inContent,inDuration, inCssClasses, inPosition) {
        if (inPosition)
            inPosition = inPosition.replace(/top/, "t").replace(/bottom/,"b").replace(/left/,"l").replace(/right/,"r").replace(/center/,"c").replace(/ /,"");
        this.corner = inPosition || app.toastPosition || "br";
	if (this._timeoutId) {
	    window.clearTimeout(this._timeoutId);
	    this.hide();
	    this._timeoutId = 0;
	}
        inCssClasses = inCssClasses || "Info";
        var classes = (inCssClasses) ? inCssClasses.split(" ") : [];
        if (dojo.indexOf(classes, "Success") != -1) {
            this.setBorderColor("rgb(0,120,0)");
        } else if (dojo.indexOf(classes, "Warning") != -1) {
            this.setBorderColor("rgb(120,0,0)");
        } else {
            this.setBorderColor("rgb(0,0,0)");
        }

        this.message.autoSizeHeight = false;
	this.setContent(inContent);
        this.message.autoSizeHeight = true;
	this.duration = inDuration || this.duration;
	this.domNode.className = this.classNames + " " + ((inCssClasses) ? inCssClasses : "");

        // After a timeout, animate the toast away
	this._timeoutId = window.setTimeout(dojo.hitch(this, "fadeaway"), this.duration);

	this.domNode.style.opacity = "0.01";
	this.show();
        this.message.doAutoSize(true, true);
        this.setHeight((this.message.bounds.h + this.padBorderMargin.t + this.padBorderMargin.b) + "px" );
	dojo.anim(this.domNode, { opacity: 1}, 800);

    },
    fadeaway: function(fromClick) {
        if (!this._timeoutId) return;
	this._timeoutId = 0;
        if (fromClick) {
	    dojo.anim(this.domNode, { opacity: 0 }, 200, null, dojo.hitch(this, function() {
                this.hide();
                this.domNode.style.opacity = 1;
            }));
        } else {
	    dojo.anim(this.domNode, { opacity: 0.01 }, 500, null, dojo.hitch(this, function() {this.hide();}));
        }
    },
    // this is what is called when you bind an event handler to a dialog; call showToast so that the timer is triggered
    update: function() {
	this.showToast(this.content,this.duration, this.domNode.className);
    }

});

dojo.declare("wm.ToastFirstDraft", wm.Dialog, {
    classNames: "wmtoast wmtoastExtraSpecific",
    title: "",
    modal: false,
    useContainerNode: true,
    _timeoutId: 0,
    duration: 5000,
    content: "Toast",
    height: "50px",
    border: "0,0,5,0",
    margin: "0",
    init: function() {
	this.inherited(arguments);
	this.containerWidget.setPadding("2,20,2,20");
	this.setContent(this.content);
	this.connectEvents(this.domNode, ["click"]);
    },
    click: function() {
        this.fadeaway(true);
        this.onToastClick();
    },
    onToastClick: function() {},
    postInit: function() {
	this.inherited(arguments);
        this.containerWidget.setHeight("100px");
	this.containerWidget.renderCss();
    },
    renderBounds: function() {
	if (this.showing) {
	    var t = 0;
	    var l = 0;
	    var coords = dojo.coords(app.domNode);
	    this.setBounds(l, t, coords.w, this.height);
	    this.domNode.style.top = t + "px";
	    this.domNode.style.left = l + "px";
	    this.domNode.style.width = coords.w + "px";
	    this.domNode.style.height = this.height;
	    wm.Control.prototype.renderBounds.call(this);

	}
    },
    setContent: function(inContent) {
	this.inherited(arguments);
	this.content = inContent;
    },

    // classes supported "Success", "Warning", "Info".  User may add their own classes via css file
    showToast: function(inContent,inDuration, inCssClasses) {
	if (this._timeoutId) {
	    window.clearTimeout(this._timeoutId);
	    this.hide();
	    this._timeoutId = 0;
	}
        inCssClasses = inCssClasses || "Info";
        var classes = (inCssClasses) ? inCssClasses.split(" ") : [];
        if (dojo.indexOf(classes, "Success") != -1) {
            this.setBorderColor("rgb(0,120,0)");
        } else if (dojo.indexOf(classes, "Warning") != -1) {
            this.setBorderColor("rgb(120,0,0)");
        } else {
            this.setBorderColor("rgb(0,0,0)");
        }
        if (!inContent || !inContent.match(/\<img/)) 
            inContent = "<img src='" + wm.theme.getImagesPath() + "blank.gif' class='ToastLeft'/>" + inContent;

	this.toastHeight = parseInt(this.height);
	this.setContent(inContent);
	this.duration = inDuration || this.duration;
	this.domNode.className = this.classNames + " " + ((inCssClasses) ? inCssClasses : "");

        // After a timeout, animate the toast away
	this._timeoutId = window.setTimeout(dojo.hitch(this, "fadeaway"), this.duration);

	this.show();

	this.domNode.style.height = "1px";
	dojo.anim(this.domNode, { height: parseInt(this.height) }, 400);

    },
    fadeaway: function(fromClick) {
        if (!this._timeoutId) return;
	this._timeoutId = 0;
        if (fromClick) {
	    dojo.anim(this.domNode, { opacity: 0 }, 200, null, dojo.hitch(this, function() {
                this.hide();
                this.domNode.style.opacity = 1;
            }));
        } else {
	    dojo.anim(this.domNode, { height: 0 }, 800, null, dojo.hitch(this, function() {this.hide();}));
        }
    },
    // this is what is called when you bind an event handler to a dialog; call showToast so that the timer is triggered
    update: function() {
	this.showToast(this.content,this.duration, this.domNode.className);
    }

});


wm.Object.extendSchema(wm.Toast, {
    modal: {ignore: 1},
    backgroundColor: {}
});
// Any project can overwrite this array in their page.start method.
wm.Toast.classList = ["wm_FontSizePx_16px","wm_TextDecoration_Bold"];

dojo.declare("wm.pageContainerMixin", null, {
	pageName: "",
	hideControls: false,
	pageProperties: null,
	initPageContainer: function() {
	    this.pageContainer = new wm.PageContainer({loadParentFirst: false, parent: this, owner: this, flex: 1, pageProperties: this.pageProperties});
		this._connections.push(this.connect(this.pageContainer, "onPageChanged", this, "_pageChanged"));
		this.pageContainer.dismiss = dojo.hitch(this, "dismiss");
		if (this.pageName)
			this.setPage(this.pageName);
	    this.createControls();
	},
	setPage: function(inPageName) {
		if (inPageName) {
		    if (this.pageContainer.pageName != inPageName) {
                        if (this.page) 
                            this.page.root.hide();
		        this.pageContainer.setPageName(inPageName);
                    }
		    else
			this.onPageReady();
		}
	},
    showPage: function(inPageName, inHideControls, inWidth, inHeight, inTitle, inModal) {
	if (inTitle !== undefined) this.setTitle(inTitle);
	if (inModal !== undefined) this.setModal(inModal);
		this.setContainerOptions(inHideControls, inWidth, inHeight);
		this.setShowing(true);
		this.setPage(inPageName);
		// IE requires reflow here
		this.reflow();
	},
	setContainerOptions: function(inHideControls, inWidth, inHeight) {
		this.setHideControls(inHideControls);
	},
	_pageChanged: function() {
		this.page = this.pageContainer.page;
		this[this.page.name] = this.page;
		this.onPageReady();
		this.reflow();
		wm.focusContainer(this.page.root);
	},
	onPageReady: function() {
	},
	forEachWidget: function(inFunc) {
		return this.pageContainer.forEachWidget(inFunc);
	},
	createControls: function() {
	    var cp = this.controlsPanel = new wm.Panel({ parent: this,
							 owner: this,
							 layoutKind: "top-to-bottom",
							 horizontalAlign: "left",
							 verticalAlign: "top",
							 height: "40px",
							 width: "100%",
						         border: this.footerBorder || "",
							 borderColor: this.footerBorderColor || ""});
	    if (!this.noBevel)
		this.controlsBevel = new wm.Bevel({ parent: cp, owner: this });
		var bp = this.buttonPanel = new wm.Panel({ parent: cp, owner: this, width: "100%", height: "100%", layoutKind: "left-to-right", horizontalAlign: "right"});
		dojo.addClass(bp.domNode, "wmpagedialog-controlspanel");
		this.closeButton = new wm.Button({ parent: bp, owner: this, caption: "Close", width: "80px", height: "100%"})
		this._connections.push(this.connect(this.closeButton, "onclick", this, "dismiss"));
		cp.setShowing(!this.hideControls);
		cp = null;
		bp = null;
	},
	setHideControls: function(inHideControls) {
		if (inHideControls !== undefined) {
			this.hideControls = inHideControls;
			this.controlsPanel.setShowing(!inHideControls);
		}
	},
    destroy: function() {
		if (this.controlsPanel) 
		{
			this.controlsPanel.destroy();
			this.controlsPanel = null;
		}
		
		if (this.closeButton) 
		{
			this.closeButton.destroy();
			this.closeButton = null;
		}
		
		if (this.controlsBevel) 
		{
		    this.controlsBevel.destroy();
			this.controlsBevel = null;
		}
		
		if (this.buttonPanel) 
		{
		    this.buttonPanel.destroy();
			this.buttonPanel = null;
		}


		if (this.pageContainer) 
		{
			this.pageContainer.dismiss = null;
		    this.pageContainer.destroy();
			this.pageContainer = null;
		}
		
	    this.inherited(arguments);
	}
});

dojo.declare("wm.PageDialog", [wm.Dialog, wm.pageContainerMixin], {
        noBevel: false,
    footerBorder: "",
    footerBorderColor: "",
	postInit: function() {
		this.inherited(arguments);
		this.initPageContainer();
	},
        setPageName: function(inPageName) {return this.setPage(inPageName);},
        setPage: function(inPageName) {
	    this.pageName = inPageName;
            if (inPageName && this.pageContainer.pageName != inPageName) 
                this.showLoadingIndicator();
            this.inherited(arguments);
        },
	setContainerOptions: function(inHideControls, inWidth, inHeight) {
		inWidth = inWidth || wm.Dialog.prototype.contentWidth;
		inHeight = inHeight || wm.Dialog.prototype.contentHeight;
		this.setWidth(inWidth);
		this.setHeight(inHeight);
		this.inherited(arguments);
	},
	hideLoadingIndicator: function() {
            if (this._loader) {
	        dojo._destroyElement(this._loader);
                delete this._loader;
            }
	},
        showLoadingIndicator: function() {
            if (this.width < 150 || this.height < 80) return;
            var text = "&nbsp;Loading...";
            var imgsrc = wm.theme.getImagesPath() + "loadingThrobber.gif";
	    this._loader = wm.createElement("div", {
	        id: "_wm_loading_" + this.id,
	        innerHTML: '<div class="_wm_loading" style="position: absolute; font-weight: bold; font-size: 10pt; z-index: 100; top: 40%; left: 40%;"><img alt="loading" style="vertical-align: middle" src="' + imgsrc + '" />' + text + '</div>'});
	    this.domNode.appendChild(this._loader);
        },
    onPageReady: function() {
            this.hideLoadingIndicator();
    },
    makePropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "pageName":
	    return new wm.propEdit.PagesSelect({component: this, name: inName, value: inValue});
	}
	return this.inherited(arguments);
    },

    destroy: function() {
	    //this.pageContainerMixinDestroy();
	    this.inherited(arguments);
		if (this.containerNode)
		{
			dojo.destroy(this.containerNode);
			this.containerNode = null;
		}
		
		this.c$ =[];
	}
});

wm.PageDialog.extend({
    themeable: false
});

wm.Object.extendSchema(wm.PageDialog, {
    pageName: {group: "Dialog Options", bindable: 1, type: "string", order: 50},
    noBevel: {ignore: 1},
    footerBorder: {group: "style", order: 100},
    footerBorderColor:  {group: "style", order: 101}
});
// design-time
wm.Dialog.description = "Popup dialog.";

dojo.declare("wm.PopoutDialog", wm.Dialog, {
	popout: "",
	postInit: function() {
		this.inherited(arguments);
	},
        setShowing: function(inShow, forceChange) {
		this.inherited(arguments);
		if (this.getValueById(this.popout))
			this[this.showing ? "_addPopout" : "_removePopout"]();
	},
	_addPopout: function() {
		var p = this.getValueById(this.popout);
		this._popoutShowing = p.showing;
		this._popoutParent = p.parent;
		this._popoutIndex = dojo.indexOf(p.parent.c$, this);
		p.setParent(this);
		this.moveControl(p, 0);
		if (!this._popoutShowing)
			p.setShowing(true);
		if (this._popoutShowing)
			this._popoutParent.reflow();
		this.flow();
	},
	_removePopout: function() {
		var p = this.getValueById(this.popout);
		p.setShowing(this._popoutShowing);
		p.setParent(this._popoutParent);
		this._popoutParent.moveControl(p, this._popoutIndex);
		if (this._popoutShowing)
			this._popoutParent.reflow();
	}
});


dojo.declare("wm.ColorPickerDialog", wm.Dialog, {
    colorPicker: null,  
    colorPickerSet: false,
    border: "1",
    borderColor: "#888888",
    width: "325px",
    height: "210px",
    modal: false,
    colorPickerControl: null,
    init: function() {
	this.inherited(arguments);
        dojo.require("dojox.widget.ColorPicker");

        if (!wm.ColorPickerDialog.cssLoaded) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = dojo.moduleUrl("dojox.widget.ColorPicker").uri + "ColorPicker.css";
            document.getElementsByTagName("head")[0].appendChild(link);
            wm.ColorPickerDialog.cssLoaded = true;
        }
        this.colorPickerControl = new wm.Control({name: "colorPickerControl", width: "325px", height: "170px", owner: this, parent: this});
        this.buttonPanel = new wm.Panel({name: "buttonPanel", width: "100%", height: "100%", layoutKind: "left-to-right", owner: this, parent: this, horizontalAlign: "right"});
        this.BrightenButton = new wm.Button({caption: "Bright", width: "60px", height: "30px", parent: this.buttonPanel});
        this.DarkenButton = new wm.Button({caption: "Dark", width: "60px", height: "30px", parent: this.buttonPanel});
        this.CancelButton = new wm.Button({caption: "Cancel", width: "60px", height: "30px", parent: this.buttonPanel});
        this.OKButton = new wm.Button({caption: "OK", width: "60px", height: "30px", parent: this.buttonPanel});

        this.connect(this.BrightenButton, "onclick", this, "brighten");
        this.connect(this.DarkenButton, "onclick", this, "darken");
        this.connect(this.OKButton, "onclick", this, "onOK");
        this.connect(this.CancelButton, "onclick", this, "onCancel");
        this.domNode.style.backgroundColor = "white";
    },
    onCancel: function() {
    },
    onOK: function() {
        this.dismiss();
    },
    getValue: function() {
        if (this.colorPicker) {
            return this.colorPicker.getValue();
        } else {
            return this._tmpValue;
        }
    },
    setValue: function(inValue) {
        if (this.colorPicker) {
            this.colorPicker.setColor(inValue);
        } else {
            this._tmpValue = inValue;
        }
    },
    setShowing: function(inShowing, forceShow) {
        if (!this.colorPicker && inShowing && this.domNode) 
            this.colorPicker = new dojox.widget.ColorPicker({animatePoint: false, showHsv: false, showRtb: true, webSave: false, onChange: dojo.hitch(this, "valueChange")}, this.domNode);
        
        if (inShowing) {
            if (this._tmpValue) {
                this.setValue(this._tmpValue);
                delete this._tmpValue;
            }
            if (this.domNode.parentNode != document.body) {
                document.body.appendChild(this.domNode);
                this.colorPickerControl.domNode.appendChild(this.colorPicker.domNode);
            }
            if (this.owner.editorNode) {
		var o = dojo._abs(this.owner.editorNode);
                o.y += this.owner.bounds.h;
                this.bounds.t = o.y;
                this.bounds.l = o.x;
                this._fixPosition = true;
            }
        }
        this.inherited(arguments);
    },
    valueChange: function(inValue) {        
        this.onChange(inValue);
    },
    onChange: function(inValue) {

    },
    brighten: function() {
        var value = this.colorPicker.attr("value");
        var values = [parseInt(value.substr(1,2),16),
                      parseInt(value.substr(3,2),16),
                      parseInt(value.substr(5,2),16)];
        var result = "#";
        var zeroCount = 0;
        var maxCount = 0;
        for (var i = 0; i < 3; i++) {
            if (values[i] == 0) zeroCount++;
            else if (values[i] == 255) maxCount++;
        }

        var minValue = 0;
        if (maxCount + zeroCount == 3)
            minValue = 40;
        for (var i = 0; i < 3; i++) {
            values[i] = Math.max(minValue,Math.min(255,Math.floor(values[i] * 1.2)));
            var str = values[i].toString(16);            
            if (str.length < 2) str = "0" + str;
            result += str;
        }



        this.setValue(result);
        this.onChange(result);
    },
    darken: function() {
        var value = this.colorPicker.attr("value");
        var values = [parseInt(value.substr(1,2),16),
                      parseInt(value.substr(3,2),16),
                      parseInt(value.substr(5,2),16)];
        var result = "#";
        for (var i = 0; i < 3; i++) {
            values[i] = Math.floor(values[i] * 0.8);
            var str = values[i].toString(16);
            if (str.length < 2) str = "0" + str;
            result += str;
        }
        this.setValue(result);
        this.onChange(result);
    },
    destroy: function() {
        if (this.colorPicker) // doesn't exist if the dialog never shown
            this.colorPicker.destroyRecursive();
        this.inherited(arguments);
    }
    

});

wm.ColorPickerDialog.cssLoaded = false;
