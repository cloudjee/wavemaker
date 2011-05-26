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

/* DIALOG TODO LIST:
 * 1. Are you sure you want to close project (confirm)
 * 2. Enter new project name (new project, copy project)
 * 3. Are you sure you want to delete (project name)
 * 4. Successfully exported project to zip file...
 */

dojo.provide("wm.base.mobile.Dialog");
dojo.require("wm.base.mobile.Container");
dojo.require("wm.base.mobile.PageContainer");
dojo.require("wm.base.mobile.Button");

/* Studio may already have set this up with the desktop dialog class */
if (!wm.dialog) {
    wm.dialog = {showingList: []};

    wm.dialog.getNextZIndex = function(isDesignLoaded) {
	var index = 30;
	for (var i = 0; i < wm.dialog.showingList.length; i++) {
	    if (!isDesignLoaded || isDesignLoaded && wm.dialog.showingList[i]._isDesignLoaded)
		index = Math.max(index, wm.dialog.showingList[i].domNode.style.zIndex);
	}
	return index+1;
    }
}


dojo.declare("wm.mobile.Dialog", wm.mobile.Container, {
    animation: "bottomExpand",
    classNames: "wmmobdialog",
    modal: true,
    scrim: true,

	layoutKind: "top-to-bottom",
    horizontalAlign: "left",
    verticalAlign: "top",
	border: 2,
    borderColor: "rgb(80,80,80)",
    titlebarHeight: "32",
/*
	contentWidth: 640,
	contentHeight: 400,
	*/
    margin: "1",
    width: "640px",
    height: "400px",
	showing: false,
        dialogScrim: null,

    init: function() {
        this.inherited(arguments);
	if (dojo.isWebKit)
	    this.domNode.addEventListener('webkitAnimationEnd', dojo.hitch(this, "endShowingAnimation"));
	
	if (this._isDesignLoaded) {
	    this.flags.noModelDrop = true;
	}

	if (this._isDesignLoaded) 
	    studio.designer.domNode.appendChild(this.domNode);
	else
	    document.body.appendChild(this.domNode);

	if (this.modal) {
	    this.dialogScrim = new wm.mobile.Scrim({owner: this, _classes: {domNode: ["wmdialog-scrim"]}, waitCursor: false});
	    dojo.connect(this.dialogScrim.domNode, "onclick", this, "hide");
	}
	this.createTitle();
    },
	postInit: function() {
	    this.inherited(arguments);

	    dojo.addClass(this.domNode, "wmdialog");	    
	    this.domNode.style.display = "none";		


	    var containerWidget;
	    
            // set the owner to wm.Page to allow othis to be written... IF its an instance not a subclass of wm.Dialog
            var owner = (this.declaredClass == "wm.mobile.Dialog" || this._pageOwnsWidgets) ? this.owner : this; 


            // If the dialog has only a single widget inside of it, thats the titlebar, and the rest of it hasn't yet been created and needs creating.
            // If the dialog has more than one widget inside of it, then its safe to assume everything this dialog needs has been created
            if (this.c$.length == 1) {
	        containerWidget = this.containerWidget ||  new wm.mobile.Container({
			_classes: {domNode: ["wmmobdialogcontainer"]}, 
			name: owner.getUniqueName("containerWidget"),
			parent: this,
			owner: owner,
			layoutKind: "top-to-bottom",
			padding: "5",
			fitToContentHeight: this.fitToContentHeight,
			margin: "2",
			border: "0",
			width: "100%",
			height: "100%",
			horizontalAlign: "left",
			verticalAlign: "top"});
	    }


            this.containerWidget = this.c$[1]; // could be undefined
	    if (dojo.isWebKit)
		this.domNode.addEventListener('webkitAnimationEnd', function(e) {dojo.stopEvent(e);});
            if (this.containerWidget)
                this.containerWidget.noInspector = true;

	    // must set this AFTER creating the button bar, or the button
	    // bar will be ADDED to the containerWidget
	    if (containerWidget) {
		this.containerWidget = containerWidget;
	    }
            this.connect(dojo.global, "onorientationchange", this, "flow");
	    this.subscribe("window-resize", this, "flow");
	},

	reflowParent: function() {
	},

	dismiss: function(e) {
	        this.setShowing(false, false, true);
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
		if (this.dialogScrim)
		    this.dialogScrim.reflowParent();
	    }
	},
 	renderBounds: function() {
	    if (this.showing) {		    
		if (this.fitToContentHeight) 
		    this.bounds.h = this.getPreferredFitToContentHeight();
		else if (this._percEx.h) {
		    var h = window.innerHeight || window.document.body.clientHeight;
		    this.bounds.h = Math.floor(h * this._percEx.h/100);
		} else {
		    this.bounds.h = parseInt(this.height);
		}
		var s = this.domNode.style;
		switch(this.animation) {
		case "bottomExpand":
		    s.width = this.domNode.parentNode.clientWidth - this.padBorderMargin.l - this.padBorderMargin.r + "px";
		    s.left = 0;
		    s.bottom = 0;
		    s.height = this.bounds.h - this.padBorderMargin.t - this.padBorderMargin.b + "px";
		    this.bounds = {
			h: this.bounds.h,
			b: this.domNode.parentNode.clientHeight,
			t: this.domNode.parentNode.clientHeight - this.bounds.h,
			l: 0,
			r: this.domNode.parentNode.clientWidth,
			w: this.domNode.parentNode.clientWidth
		    };
		break;
	    case "topDropdown":
		    var baseWidth  = Math.floor(0.7 * this.domNode.parentNode.clientWidth);
		    var baseHeight = Math.floor(0.7 * this.domNode.parentNode.clientHeight);
		    s.width = (baseWidth - this.padBorderMargin.l - this.padBorderMargin.r) + "px";
		    s.left = 0;
		    s.top = 0;
		    s.height = (baseHeight - this.padBorderMargin.t - this.padBorderMargin.b) + "px";
		this.bounds = {
		    h: baseHeight,
		    l: 0,
		    t: 0,
		    b: baseHeight,
		    r: baseWidth,
		    w: baseWidth
		};
		break;
		}
	    }
	},
    insureDialogVisible: function(testOnly) {
	if (!this.showing) return;
        var w = this.bounds.w;
        var h = this.bounds.h;
        var isDesigned =  (this.domNode.parentNode != document.body);
        var W = (isDesigned) ? studio.designer.bounds.w : app._page.root.bounds.w;
        var H = (isDesigned) ? studio.designer.bounds.h : app._page.root.bounds.h;
        if (this.bounds.t + this.bounds.h > H) {
            if (testOnly) return false;
            else this.bounds.t = H - this.bounds.h;
        }
        if (this.bounds.l + this.bounds.w > W) {
            if (testOnly) return false;
            else this.bounds.l = W - this.bounds.w;
        }
        if (this.bounds.t < 0) {
            if (testOnly) return false;
            else this.bounds.t = 0;
        }
        if (this.bounds.l < 0) {
            if (testOnly) return false;
            else this.bounds.l = 0;
        }
        if (!testOnly)           
	    wm.Control.prototype.renderBounds.call(this);        
        return true;
    },

    // TODO: Update colorpickerdialog to use this
    // TODO: Add property to control whether dialog goes below, above, left or right
    renderBoundsByPositionNode: function() {
        if (!this.fixPositionNode) return;
	var o = dojo._abs(this.fixPositionNode);
        this.bounds.t = o.y + o.h; // position it directly under the specified node
        this.bounds.l = o.x;
        if (!this.insureDialogVisible(true)) {
            this.bounds.t = o.y - this.bounds.h;
            if (!this.insureDialogVisible(true)) {
                this.bounds.t = o.y;
                this.bounds.l = o.x + o.w;
                if (!this.insureDialogVisible(true)) {
                    this.bounds.l = o.x - this.bounds.w;
                    this.insureDialogVisible(false); // if all test up to this point have failed, force it to fit here.
                    return; // insureDialogVisible calls renderBounds
                }
            }
        }
	wm.Control.prototype.renderBounds.call(this);
    },
 

        setShowing: function(inShowing, forceChange, skipOnClose) {

	    // First show/hide the scrim 
	    if (inShowing != this.showing && !this._isDesignLoaded && this.dialogScrim)
		this.dialogScrim.setShowing(inShowing);

	    if (inShowing && !this.showing) {
		this.domNode.style.zIndex = wm.dialog.getNextZIndex(this._isDesignLoaded);
		wm.dialog.showingList.push(this);
	    } else if (!inShowing && this.showing) {
		wm.Array.removeElement(wm.dialog.showingList, this);
	    }

	    if (inShowing != this.showing) {
		this.domNode.style.display = "";
		this.showing = inShowing;	
		if (inShowing)
		    this.reflow();
		switch(this.animation) {
		case "bottomExpand":
 		    dojo[inShowing ? "addClass" : "removeClass"](this.domNode, "mblDialogShowing");
		    dojo[!inShowing ? "addClass" : "removeClass"](this.domNode, "mblDialogHiding");
		    break;
		case "topDropdown":
 		    dojo[inShowing ? "addClass" : "removeClass"](this.domNode, "mblTopDropDialogShowing");
		    dojo[!inShowing ? "addClass" : "removeClass"](this.domNode, "mblTopDropDialogHiding");
		    break;
		}
	    }
	    if (!inShowing && dojo.isDescendant(document.activeElement, this.domNode)) 
		document.activeElement.blur();

	},
    endShowingAnimation: function(e) {
	if (e.target != this.domNode) return;
	if (this.showing) {
	    this.onShow();
	} else {
	    this.onClose("");
	     this.domNode.style.display = "none";
	}
    },
    onShow: function(){},
    onClose: function(){},
    setTitlebarHeight: function(inHeight) {
        this.titlebarHeight = inHeight;
        if (this.titleBar) this.titleBar.setHeight(inHeight + "px");
    },
    createTitle: function() {
	this.titleBar = new wm.mobile.Container({_classes: {domNode: ["wmmobdialogtitlebar"]}, 
					  showing: this.title,
					  name: "titleBar", 
					  parent: this,
					  owner: this,
					  width: "100%",
					  height: this.titlebarHeight + "px",
					  margin: "0",
					  padding: "0",
					  verticalAlign: "middle",
					  layoutKind: "left-to-right",
					  flags: {notInspectable: true}});

	this.titleLabel = new wm.mobile.Label({
					  noInspector: true,
	                                name: "dialogTitleLabel",
					parent: this.titleBar,
					owner: this,
					caption: this.title,
					showing: Boolean(this.title),
					margin: "3,3,0,10",
					width: "100%",
					height: "100%"});


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


wm.mobile.Dialog.extend({
    themeableStyles: ["wm.Dialog_Inner-Radius"],
    // backward-compatibility fixups
	afterPaletteDrop: function() {
	    this.inherited(arguments);
	    this.setParent(null);
	    studio.designer.domNode.appendChild(this.domNode);
	    this.show();
	},
    makePropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
        case "corner":
            inValue = inValue.replace(/^c/, "center ").replace(/^t/, "top ").replace(/^b/, "bottom ").replace(/l$/, "left").replace(/r$/, "right").replace(/c$/, "center");
            return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: ["top left", "top center", "top right", "center left", "center center", "center right", "bottom left", "bottom center", "bottom right"]});
	}
	return this.inherited(arguments);
    }

});


wm.Object.extendSchema(wm.mobile.Dialog, {
    title: {group: "display", order: 1, bindTarget: true},

    owner: { group: "common", order: 1, readonly: true, options: ["Page", "Application"] },

    titlebarHeight: {group: "style", order: 7},

    corner: {group: "layout", order: 52},

    noBevel: {ignore: 1},
    imageList: {ignore: 1},
    fitToContentWidth: {ignore: 1},
    fitToContentHeight: {ignore: 1},
    useContainerWidget: {ignore: 1},
    containerClass: {ignore: 1},
    lock: {ignore: 1},
    freeze: {ignore: 1},
    padding: {ignore: 1},
    margin: {ignore: 1},
    autoScroll: {ignore: 1},
    scrollX: {ignore: 1},
    scrollY: {ignore: 1},
    touchScrolling: {ignore: 1},
    layoutKind: {ignore: 1},
    horizontalAlign: {ignore: 1},
    verticalAlign: {ignore: 1},
    showing: {ignore: 1}
});




dojo.declare("wm.mobile.WidgetsJsDialog", wm.mobile.Dialog, { 
    margin: "0,4,4,0",// for shadow styles
    useContainerWidget: true,
    widgets_data: null,
    widgets_json: "",
    width: "400px",
    height: "150px",

    setShowing: function(inShowing, forceChange) {
	this.inherited(arguments);
	if (this.isReflowEnabled() && !this._rendered) {
	    this.leafFirstRenderCss();
	    this._rendered = true;
	}
    },
    postInit: function() {
	this.inherited(arguments);
	if (!this.widgets_data)
	    this.setWidgetsJson(this.widgets_json);
	this.generateContents();
	this.containerWidget.setPadding("0");
	this.renderBounds();
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
	if (this._generated) return;
	this._generated = true;
	this.containerWidget._cupdating = true;
	this.containerWidget.createComponents(this.widgets_data, this);
	this.containerWidget._cupdating = false;
	this.containerWidget.reflow();
    }
});


dojo.declare("wm.mobile.GenericDialog", wm.mobile.WidgetsJsDialog, {
    enterKeyIsButton1: true,
    noEscape: true,
    title: "Generic Dialog",
    padding: "0",
    regExp: ".*",
    button1Caption: "",
    button2Caption: "",
    button3Caption: "",
    button4Caption: "",
    button1Close: false,
    button2Close: false,
    button3Close: false,
    button4Close: false,
    userPrompt: "Testing...",
    showInput: false,
    prepare: function() {
        this.inherited(arguments);
        this.widgets_data = {
	    genericInfoPanel: ["wm.mobile.Panel", {layoutKind: "top-to-bottom",  width: "100%", height: "100%", horizontalAlign: "left", verticalAlign: "top", autoScroll: true, fitToContentHeight: true, padding: "10,5,10,5"}, {}, {
		userQuestionLabel: ["wm.mobile.Html", {autoScroll: false, "height":"25px",autoSizeHeight: true, "width":"100%",html: ""}],
		textInput: ["wm.mobile.Text", {"width":"100%","captionSize":"0%","showing":false}, {}, {}]
	    }]
	};
	this.button_data = {
		                        button4: ["wm.mobile.Button", {"width":"130px","showing":false}, {"onclick":"buttonClick"}],
		                        button3: ["wm.mobile.Button", {"width":"130px","showing":false}, {"onclick":"buttonClick"}],
		                        button2: ["wm.mobile.Button", {"width":"130px","showing":false}, {"onclick":"buttonClick"}],
		                        button1: ["wm.mobile.Button", {"width":"130px","showing":false}, {"onclick":"buttonClick"}]
	};
    


    },
    postInit: function() {
	this.inherited(arguments);
        this.containerWidget = this.c$[1];
	this.containerWidget.flags.notInspectable = true;
	if (this.regExp != ".*")
	    this.$.textInput.setRegExp(this.regExp);

	var captionFound = false;
	for (var i = 1; i <= 6; i++) {
	    var caption = this["button" + i + "Caption"];
	    var button = this.$["button" + i];
	    if (caption) {
		captionFound = true;
		button.setCaption(caption);
		button.show();
	    }
	    this.setShowInput(this.showInput);
	}
        if (this.$.userQuestionLabel)
	    this.$.userQuestionLabel.setHtml(this.userPrompt);
        this.containerWidget.setFitToContentHeight(true);
    },
    // handle fitToContentHeight adjustments
    reflow: function() {
        try {
	    if (this._userSized) {
                return this.inherited(arguments);
	    } else if (!this._settingHeight) {
                var height = this.getPreferredFitToContentHeight();
		if (dojo.isChrome) height--; // stupid chrome bug...
                this._settingHeight = true;
                this.setHeight(height + "px");
                this._settingHeight = false;

                return this.inherited(arguments);
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

    setInputDataValue: function(inValue) {
        if (this.$.textInput)
	    this.$.textInput.setDataValue(inValue);
    },
        getInputDataValue: function(inValue) {
        var result;
        if (this.$.textInput) {
	    result = this.$.textInput.getDataValue();
            if (dojo.isString(result))
                result = dojo.trim(result);
            return result;
        }
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
	}
    },
    onButton1Click: function(inButton, inText) {},
    onButton2Click: function(inButton, inText) {},
    onButton3Click: function(inButton, inText) {},
    onButton4Click: function(inButton, inText) {}
});


wm.Object.extendSchema(wm.mobile.GenericDialog, {
    
    enterKeyIsButton1: {group: "Buttons", order: 60},
    widgets_json: {ignore: 1},
    button1Caption: {group: "Buttons", order: 61},
    button1Close: {group: "Buttons", order: 62},
    button2Caption: {group: "Buttons", order: 63},
    button2Close: {group: "Buttons", order: 64},
    button3Caption: {group: "Buttons", order: 65},
    button3Close: {group: "Buttons", order: 66},
    button4Caption: {group: "Buttons", order: 67},
    button4Close: {group: "Buttons", order: 68},

    userPrompt: {group: "display", order: 54, bindTarget: true},
    showInput: {group: "display", order: 55, bindTarget: true},
    inputDataValue: {group: "editData", order: 56, bindable: true, simpleBindProp: true},
    regExp: {group: "editData", order: 57},

    setShowInput: {group:"method"},
    setInputDataValue: {group:"method"},
    getInputDataValue: {group:"method", returns: "String"},
    setUserPrompt: {group:"method"},
    setButton1Caption: {group:"method"},
    setButton2Caption: {group:"method"},
    setButton3Caption: {group:"method"},
    setButton4Caption: {group:"method"}
});



// Any project can overwrite this array in their page.start method.
dojo.declare("wm.mobile.pageContainerMixin", null, {
	pageName: "",
	pageProperties: null,
        deferLoad: false, // I'd rather this were true, but projects (AND STUDIO!) will break until users go through and change deferLoad back to false
	initPageContainer: function() {
	    this.pageContainer = new wm.mobile.PageContainer({loadParentFirst: false, deferLoad: false, parent: this, owner: this, flex: 1, pageProperties: this.pageProperties});
		this._connections.push(this.connect(this.pageContainer, "onPageChanged", this, "_pageChanged"));
		this._connections.push(this.connect(this.pageContainer, "onError", this, "onError"));
		this.pageContainer.dismiss = dojo.hitch(this, "dismiss");
		if (this.pageName && !this.deferLoad)
			this.setPage(this.pageName);
	},
        onError: function(inErrorOrMessage) {},
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
    showPage: function(inPageName, inTitle) {
	if (inTitle !== undefined) this.setTitle(inTitle);
		this.setShowing(true);
		this.setPage(inPageName);
		// IE requires reflow here
		this.reflow();
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
    destroy: function() {

		if (this.pageContainer) 
		{
			this.pageContainer.dismiss = null;
		    this.pageContainer.destroy();
			this.pageContainer = null;
		}
		
	    this.inherited(arguments);
	}
});

dojo.declare("wm.mobile.PageDialog", [wm.mobile.Dialog, wm.mobile.pageContainerMixin], {
        noBevel: false,
	postInit: function() {
		this.inherited(arguments);
		this.initPageContainer();
	},
        setShowing: function(inShow, forceChange) {
	    this.inherited(arguments);
            if (this.deferLoad && inShow)
                this.setPage(this.pageName);
        },
        setPageName: function(inPageName) {
	    if (this._pageLoading)
		return;
	    if (inPageName == "-New Page" && this.isDesignLoaded()) {
	        return this.pageContainer.createNewPage();
	    }

	    return this.setPage(inPageName);
	},
        setPage: function(inPageName) {
	    this.pageName = inPageName;
            if (inPageName && this.pageContainer.pageName != inPageName) 
                this.showLoadingIndicator();
            this.inherited(arguments);
        },
	setContainerOptions: function(inWidth, inHeight) {
		inWidth = inWidth || wm.mobile.Dialog.prototype.contentWidth;
		inHeight = inHeight || wm.mobile.Dialog.prototype.contentHeight;
	        if (!dojo.isString(inWidth)) inWidth += "px";
	        if (!dojo.isString(inHeight)) inHeight += "px";
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
	    return new wm.propEdit.PagesSelect({component: this, name: inName, value: inValue, newPage: true});
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

wm.mobile.PageDialog.extend({
    themeable: false
});

wm.Object.extendSchema(wm.mobile.PageDialog, {
    pageName: {group: "display", bindable: 1, type: "string", order: 54, pageProperty: "page"},
    deferLoad:{group: "display", type: "boolean", order: 55},

});

/* Use designable dialog if your planning to design it in studio; if programatically creating a dialog use wm.Dialog */
dojo.declare("wm.mobile.DesignableDialog", wm.mobile.Dialog, {
    _pageOwnsWidgets: true,
    border: "1",
    borderColor: "black",
    scrim: false,
    useContainerWidget: true,
    title: "Dialog",
    postInit: function() {
	this.inherited(arguments);
	delete this.containerNode; // containerNode is where child nodes get added to when appending children; just let the normal parent/child relationships prevail...
    },
    set_owner: function(inOwner) {
        var oldOwner = this.owner;
        this.inherited(arguments);
        var owner = this.owner;
        wm.forEachWidget(this, function(w) {
            if (w.owner == oldOwner)
                w.setOwner(owner);
        });
    }
});



if (!wm.studioConfig) {
    wm.Dialog = wm.mobile.Dialog;
}

dojo.declare("wm.mobile.Toast", wm.mobile.WidgetsJsDialog, {
    modal: false,
    classNames: "wmmobtoast",
    title: "",
    _timeoutId: 0,
    margin: "2,2,0,2",
    duration: 5000,
    content: "",
    height: "40px",
    width: "100%",
    prepare: function() {
        this.inherited(arguments);
        this.widgets_data = {
	    img: ["wm.mobile.Picture", {_classes: {domNode: ["ToastLeft"]}, width: "30px", height: "100%",margin: "4,0,0,4"}],
	    rightColumn: ["wm.mobile.Panel", {layoutKind: "top-to-bottom", width: "100%", height: "100%", fitToContentHeight: true, padding: "0"},{},{
		title: ["wm.mobile.Label", { height: "20px", width: "100%", singleLine: true}],
		message: ["wm.mobile.Label", { height: "100px", width: "100%", singleLine: false, autoSizeHeight: true}]
	    }]
	};
    },
    postInit: function() {
	this.inherited(arguments);
	this.containerWidget.setLayoutKind("left-to-right");
        this.img = this.containerWidget.c$[0];
        this.title = this.containerWidget.c$[1].c$[0];
        this.message = this.containerWidget.c$[1].c$[1];
	this.setContent(this.content);
	this.connect(this.domNode, "onclick", this, "click");
    },
    click: function() {
        this.hide();
        this.onToastClick();
    },
    onToastClick: function() {},
    setShowing: function(inShow, forceChange) {
	if (!inShow && this._timeoutId) {
	    window.clearTimeout(this._timeoutId);
	    delete this._timeoutId;
	}

        this.inherited(arguments);
    },
    setContent: function(inContent) {
	this.content = inContent;
        if (this.message)
            this.message.setCaption(inContent);
    },
    setTitle: function(inTitle) {
	if (this.title)
	    this.title.setCaption(inTitle);
    },
    // classes supported "Success", "Error", "Warning", "Info".  User may add their own classes via css file
    showToast: function(inContent,inDuration, inCssClasses, inPosition, optionalTitle) {
        if (inPosition)
            inPosition = inPosition.replace(/top/, "t").replace(/bottom/,"b").replace(/left/,"l").replace(/right/,"r").replace(/center/,"c").replace(/ /,"");
        this.corner = inPosition || app.toastPosition || "br";
	if (this._timeoutId) {
	    this.hide();
	}
	this.setTitle(optionalTitle || inCssClasses);
        inCssClasses = inCssClasses || "Info";
        this._toastType = inCssClasses = inCssClasses || "Info";
        var classes = (inCssClasses) ? inCssClasses.split(" ") : [];

        if (dojo.indexOf(classes, "Success") != -1) {
            this.setBorderColor("rgb(0,120,0)");
        } else if (dojo.indexOf(classes, "Error") != -1) {
            this.setBorderColor("rgb(120,0,0)");
        } else if (dojo.indexOf(classes, "Warning") != -1) {
            this.setBorderColor("#f9a215");
        } else {
            this.setBorderColor("rgb(0,0,0)");
        }

        this.message.autoSizeHeight = false;
	this.setContent(inContent);
        this.message.autoSizeHeight = true;
	this.duration = inDuration || this.duration;
	this.domNode.className = this.classNames + " " + ((inCssClasses) ? inCssClasses : "");
	this.show();
	this.setContent(inContent);
        this.message.doAutoSize(true, true);
        this.setHeight((this.containerWidget.padBorderMargin.t + this.containerWidget.padBorderMargin.b + this.message.parent.bounds.h + this.padBorderMargin.t + this
.padBorderMargin.b) + "px" );

        // After a timeout, animate the toast away
	this._timeoutId = window.setTimeout(dojo.hitch(this, "hide"), this.duration);
/*
	this.domNode.style.opacity = "0.01";
	this.show();
        this.message.doAutoSize(true, true);
        this.setHeight((this.containerWidget.padBorderMargin.t + this.containerWidget.padBorderMargin.b + this.message.parent.bounds.h + this.padBorderMargin.t + this.padBorderMargin.b) + "px" );
	dojo.anim(this.domNode, { opacity: 1}, 800);
        */
    },
/*
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
    */
    // this is what is called when you bind an event handler to a dialog; call showToast so that the timer is triggered
    update: function() {
	this.showToast(this.content,this.duration, this.domNode.className);
    },
    endShowingAnimation: function(e) {
	if (e.target != this.domNode) return;
	this.inherited(arguments);
	if (this.showing) {
	    app._page.root.setVerticalOffset(this.bounds.h);
	} else {
	    app._page.root.setVerticalOffset(0);
	}
    }

});

