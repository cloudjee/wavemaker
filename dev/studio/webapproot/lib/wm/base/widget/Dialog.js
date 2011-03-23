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

dojo.provide("wm.base.widget.Dialog");
dojo.require("wm.base.widget.Container");
dojo.require("wm.base.widget.Picture");
dojo.require("wm.base.widget.PageContainer");
dojo.require("wm.base.widget.Button");

wm.dialog = {showingList: []};

wm.dialog.getNextZIndex = function(isDesignLoaded) {
    var index = 30;
    for (var i = 0; i < wm.dialog.showingList.length; i++) {
	if (!isDesignLoaded || isDesignLoaded && wm.dialog.showingList[i]._isDesignLoaded)
	    index = Math.max(index, wm.dialog.showingList[i].domNode.style.zIndex);
    }
    return index+1;
}

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
	    f = this.domNode = (dojo.isIE && dojo.isIE < 9) ? document.createElement(html) : document.createElement("IFRAME");
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
    containerClass: "MainContent",
    corner: "cc", // center vertical, center horizontal; this is almost always the desired default... but for some nonmodal dialogs, its useful to have other options
    scrim: true,

    useContainerWidget: false,  // if true, we create a container widget, if false we just use the dom node directly.  dom node is fine if you just want to set innerHTML or stick a 3rd party widget into the dialog.
    useButtonBar: false,
    _minified: false,
    _maxified: false,
    noEscape: false,
    noMinify: false,
    noMaxify: false,
	layoutKind: "top-to-bottom",
    horizontalAlign: "left",
    verticalAlign: "top",
	border: 2,
    borderColor: "rgb(80,80,80)",
    titlebarBorder: "1",
    titlebarBorderColor: "black",
    titlebarHeight: "23",
    footerBorder: "1,0,0,0",
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
        this.inherited(arguments);
	if (this._isDesignLoaded) {
	    this.flags.noModelDrop = true;
	}

	if (this._isDesignLoaded) 
	    studio.designer.domNode.appendChild(this.domNode);
	else
	    document.body.appendChild(this.domNode);

	this.dialogScrim = new wm.Scrim({owner: this, _classes: {domNode: ["wmdialog-scrim"]}, waitCursor: false});

	this.createTitle();
    },
	postInit: function() {
		this.inherited(arguments);

		dojo.addClass(this.domNode, "wmdialog");
/*
		this.setContentWidth(this.contentWidth);
		this.setContentHeight(this.contentHeight);
		*/
		this.domNode.style.position = "absolute";
	    this.domNode.style.zIndex = wm.dialog.getNextZIndex(this._isDesignLoaded);
            if (this.designWrapper)
                this.designWrapper.domNode.style.zIndex = this.domNode.style.zIndex+1;

		this.domNode.style.display = "none";		
		this._connections.push(this.connect(document, "keydown", this, "keydown"));
		this._subscriptions.push(dojo.subscribe("window-resize", this, "reflow"));	    


	    this.setModal(this.modal);

	    this.setTitlebarBorder(this.titlebarBorder); 
            this.setTitlebarBorderColor(this.titlebarBorderColor);


	    var containerWidget, containerNode;
	    
            // set the owner to wm.Page to allow othis to be written... IF its an instance not a subclass of wm.Dialog
            var owner = (this.declaredClass == "wm.Dialog" || this._pageOwnsWidgets) ? this.owner : this; 


            // If the dialog has only a single widget inside of it, thats the titlebar, and the rest of it hasn't yet been created and needs creating.
            // If the dialog has more than one widget inside of it, then its safe to assume everything this dialog needs has been created
            if (this.c$.length == 1) {
	        if (this.useContainerWidget) {
	            containerWidget = this.containerWidget ||  new wm.Container({
			_classes: {domNode: ["wmdialogcontainer", this.containerClass]}, 
			name: owner.getUniqueName("containerWidget"),
			parent: this,
			owner: owner,
			layoutKind: "top-to-bottom",
			padding: "5",
			fitToContentHeight: this.fitToContentHeight,
			margin: "0",
			border: "0",
			width: "100%",
			height: "100%",
			horizontalAlign: "left",
			verticalAlign: "top",
			autoScroll: true});
		    containerNode = containerWidget.domNode;
	        } else {
		    containerNode = this.domNode;
	        }
            }

            if (this.c$.length < 3) {
                // use of buttonbar is only accepted if useContainerWidget is true
               	if (this.useButtonBar && this.useContainerWidget) {		  
                    this.createButtonBar();
                }
            }


            this.containerWidget = this.c$[1]; // could be undefined
            this.buttonBar = this.c$[2];       // could be undefined
            if (this.containerWidget)
                this.containerWidget.noInspector = true;
            if (this.buttonBar)
                this.buttonBar.noInspector = true;

	    // must set this AFTER creating the button bar, or the button
	    // bar will be ADDED to the containerWidget
	    if (containerWidget) {
		this.containerWidget = containerWidget;
	    }
	    this.containerNode = containerNode;
	},
    setUseButtonBar: function(inUse) {
        this.useButtonBar = inUse;
        if (inUse && !this.buttonBar) {
            this.createButtonBar();
            this.reflow();
        } else if (!inUse && this.buttonBar) {
            this.buttonBar.destroy();
            delete this.buttonBar;
            this.reflow();
        }
    },
    createButtonBar: function() {
        var owner = (this.declaredClass == "wm.Dialog" || this instanceof wm.DesignableDialog) ? this.owner : this; 
	this.buttonBar = new wm.Panel({_classes: {domNode: ["dialogfooter"]},
				       name: "buttonBar",
				       owner: owner,
				       parent: this,
				       width: "100%",
				       height: wm.Button.prototype.height,
				       horizontalAlign: "right",
				       verticalAlign: "top",
				       layoutKind: "left-to-right",
                                       noInspector: true,
				       border: this.footerBorder,
				       borderColor: this.titlebarBorderColor});
    },
    setTitlebarBorder: function(inBorder) {
        this.titlebarBorder = inBorder;
	var border = (String(inBorder).match(",")) ? inBorder : "0,0," + inBorder + ",0";
        this.titleBar.setBorder(border);
        this.titleBar.setHeight((parseInt(this.titlebarHeight) + this.titleBar.padBorderMargin.t + this.titleBar.padBorderMargin.b) + "px");
    },
    setTitlebarBorderColor: function(inBorderColor) {
        this.titlebarBorderColor = inBorderColor;
        this.titleBar.setBorderColor(inBorderColor);
    },
    setFooterBorder: function(inBorder) {
        this.footerBorder = inBorder;
        if (this.buttonBar) {
            this.buttonBar.setBorder(inBorder);
            //this.$.buttonBar.setHeight((34 + this.$.buttonBar.padBorderMargin.t + this.$.buttonBar.padBorderMargin.b) + "px");
        }
    },
    setFooterBorderColor: function(inBorderColor) {
        this.footerBorderColor = inBorderColor;
        if (this.buttonBar)
            this.buttonBar.setBorderColor(inBorderColor);
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
	if (this.showing  && !this._isDesignLoaded) {
	    this.dialogScrim.setShowing(this.modal);
	    wm.bgIframe.setShowing(!this.modal && !this.isDesignedComponent());
	}
	this.titleClose.setShowing(!this.modal && !this.noEscape);
	this.titleMinify.setShowing(!this.modal && !this.noMinify);
	this.titleMaxify.setShowing(!this.modal && !this.noMaxify);
    },
    setNoEscape: function(inNoEscape) {
	this.noEscape = inNoEscape;
	this.titleClose.setShowing(!this.modal && !this.noEscape);
    },	
    minify: function() {
	this._minified = true;
	this.setShowing(false);
	if (!app.wmMinifiedDialogPanel) {
	    app.createMinifiedDialogPanel();
	}
	this.minifiedLabel = app.createMinifiedDialogLabel(this.title);
	this.minifiedLabel.connect(this.minifiedLabel, "onclick", this, function() {
	    app.removeMinifiedDialogLabel(this.minifiedLabel);
	    delete this.minifiedLabel;
	    app.wmMinifiedDialogPanel.reflow();
	    this._minified = false;
	    this.setShowing(true);
	});
	app.wmMinifiedDialogPanel.reflow();
    },
    unminifyormove: function(inEvent) {
	this._unminifyMouseX = inEvent.x;
	this._unminifyMouseY = inEvent.y;
    },
    unminify: function(inEvent, dontCallSetShowing) {
	if (!this._minified) return;
	app.removeMinifiedDialogLabel(this.minifiedLabel);
	delete this.minifiedLabel;
	    app.wmMinifiedDialogPanel.reflow();
	this._minified = false;
	if (!dontCallSetShowing) 
	    this.show();
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
	        this.setShowing(false, false, true);
		var why = "" || dojo.isString(e) ? e : e && e.target && e.target.innerHTML;
		this.onClose(why);
		why = null;
	},
        destroy: function() {
	    this.dismiss();
	    if (this.dialogScrim)
                this.dialogScrim.destroy();
	    if (this.minifiedLabel)
		this.minfiedLabel.destroy();
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
		    if (this.fitToContentHeight) 
			this.bounds.h = this.getPreferredFitToContentHeight();

		    if (this._minified) {
			var parentBox = dojo.contentBox(window.document.body);
			var t = parentBox.h - 30;
			var l = parentBox.w - 200;
			this.setBounds(l,t,200,30);
		    } else if (this._maxified) {
			var parentBox = dojo.contentBox(window.document.body);
			this.setBounds(20,20,parentBox.w-40,parentBox.h-40);
		    } else {
			//// center within parent
			//var parentBox = dojo.contentBox(this.domNode.parentNode);
			//var bounds = this.getBounds();
                        if (this.fixPositionNode) {
                            this.renderBoundsByPositionNode();
                        } else if (!this._fixPosition) {
                            this.renderBoundsByCorner();
/*
			    var t = (parentBox.h - bounds.h) / 2;
			    var l = (parentBox.w - bounds.w) / 2;
			    this.setBounds(l, t);
			    this.domNode.style.top = t + "px";
			    this.domNode.style.left = l + "px";
                            */
                        } else {
                            this.insureDialogVisible();
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
        // This should be able to take both the human readable value "top right", and also the streamlined "tr" and have it work regardless.
    // Note that vertical axis must always come before horizontal axis
    setCorner: function(inCorner) {
        this.corner = inCorner.replace(/top/, "t").replace(/bottom/,"b").replace(/left/,"l").replace(/right/,"r").replace(/center/,"c").replace(/ /,"");
        this.renderBoundsByCorner();
    },
/* if the dialog is off the edge of the screen, attempt to compensate */
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
    renderBoundsByCorner: function() {
	if (!this.showing) return;
        var w = this.width;
        var h = this.height;
/*
        var isDesigned =  (this.domNode.parentNode != document.body);
        var W = (isDesigned) ? studio.designer.bounds.w : app._page.root.bounds.w;
        var H = (isDesigned) ? studio.designer.bounds.h : app._page.root.bounds.h;
        */
        var W = this.domNode.parentNode.clientWidth;
        var H = this.domNode.parentNode.clientHeight;

	if (String(w).match(/\%/)) {
	    w = W * parseInt(w)/100;
	} else {
	    w = parseInt(w);
	}

	if (String(h).match(/\%/)) {
	    h = H * parseInt(h)/100;
	} else {
	    h = parseInt(h);
	}

	if (!this._isDesignLoaded) {
	    if (w + 2 > W) w = W-2;
	    if (h + 2 > H) h = H-2;
	}
        var buffer = 10;
        var t,l;
        
        var top  = this.corner.substring(0,1);
        var left = this.corner.substring(1,2);
	var showingList = [];
	var thisownerapp = this.getOwnerApp();
	for (var i = 0; i < wm.dialog.showingList.length; i++)
	    if (wm.dialog.showingList[i] != this && wm.dialog.showingList[i].getOwnerApp() == thisownerapp && (!window["studio"] || this != window["studio"].dialog))
		showingList.push(wm.dialog.showingList[i]);
	    h = parseInt(h);
	var last = wm.Array.last(showingList);

        switch(left) {
        case "l":
            l = buffer;
            break;
        case "r":
            l = W - w - buffer;
            break;
        case "c":
	    if (last && last.corner == this.corner)
		l = last.bounds.l + 15;
	    else
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
	    if (last && last.corner == this.corner)
		t = last.bounds.t + 15;
	    else
		t = Math.floor((H - h)/2);
            break;
        }

	this.setBounds(l, t, w, h);
	wm.Control.prototype.renderBounds.call(this);
    },
	setContent: function(inContent) {
		this.containerNode.innerHTML = inContent;
	},
        setShowing: function(inShowing, forceChange, skipOnClose) {
	    var animationTime = (this._cupdating || this.showing == inShowing || this._noAnimation || this._showAnimation && this._showAnimation.status() == "playing") ? 0 : app.dialogAnimationTime; 

	    // First show/hide the scrim if we're modal
	    if (inShowing != this.showing && this.modal && !this._isDesignLoaded)
		this.dialogScrim.setShowing(inShowing);

	    var wasShowing = this.showing;

	    // set it to showing so that rendering can happen
	    if (inShowing) {
		if (animationTime) {
		    this.domNode.opacity = 0.01;
		}
		this.inherited(arguments);
		if (this.modal && !this._noAutoFocus) {
                    this.domNode.tabIndex = -1;
                    this.domNode.focus(); // individual dialogs may override this to focus on something more specific, but at a minimum, I want focus somewhere on/in the dialog when it shows
		}
	    }


		// global flag for easily finding the most recently shown dialog
	        wm.Array.removeElement(wm.dialog.showingList, this);
	    if (inShowing && (!window["studio"] || this != window["studio"].dialog)) {
		    wm.dialog.showingList.push(this);
	        this.domNode.style.zIndex = wm.dialog.getNextZIndex(this._isDesignLoaded);
            }

		if (inShowing) {
		    if (this._minified)
			this.unminify(null, true);
		    //this.reflow();
		    delete this.showing; // stupid hack to fix bug in Safari Version 4.0.4 (6531.21.10)
		    this.showing = true;
		    this.flow();
		}/* else
			// FIXME: hide any tooltips that may be showing
			wm.hideToolTip(true);*/
	    wm.bgIframe.setShowing(inShowing && this.modal && !this.isDesignedComponent());

	    if (this.designWrapper)
		this.designWrapper.setShowing(inShowing);


	    if (inShowing && this._hideAnimation) {
		this._hideAnimation.stop();
		delete this._hideAnimation;

	    } else if (!inShowing && this._showAnimation) {
		this._showAnimation.stop();
		delete this._showAnimation;

	    }

	    if (inShowing && !wasShowing) {
		if (animationTime) {
		    this._showAnimation = this._showAnimation || 
			dojo.animateProperty({node: this.domNode, 
					      properties: {opacity: 1},
					      duration: animationTime,
					      onEnd: dojo.hitch(this, function() {
			                          this.domNode.style.opacity = 1; // needed for IE 9 beta
                                                  this.onShow();
                                              })});
			this._showAnimation.play();
		} else {
		    this.onShow();
		}

	    } else if (!inShowing && wasShowing) {
		
		if (animationTime) {
		    if (!this._hideAnimation) {
                        this._transitionToHiding = true;
			this._hideAnimation = 
			dojo.animateProperty({node: this.domNode, 
					      properties: {opacity: 0.01},
					      duration: animationTime,
					      onEnd: dojo.hitch(this, function() {
                                                  if (this.isDestroyed) return;
						      wm.Control.prototype.setShowing.call(this,inShowing,forceChange, skipOnClose);
                                                  delete this._transitionToHiding;
						      if (!skipOnClose && !this._minified) 
						          this.onClose("");
						      delete this._hideAnimation; // has no destroy method
					      })});
			    this._hideAnimation.play();
		    }
		} else {
		    this.inherited(arguments);		    
		    if (!skipOnClose && !this._minified) 
			this.onClose("");
		}
	    }



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
	keydown: function(inEvent) {
            if (!this.showing) return true;
            var dialogs = dojo.query(".wmdialog");
            var zindex = parseInt(this.domNode.style.zIndex);
            for (var i = 0; i < dialogs.length; i++) {
                if (dialogs[i].style.display != "none" && parseInt(dialogs[i].style.zIndex) > zindex) {
                    return true; // this isn't the foremost dialog
                }
            }

	    if (inEvent.keyCode == dojo.keys.ESCAPE && !this.noEscape) {
		if (this._isDesignLoaded && studio.selected.getParentDialog() == this) return;
		if (this.showing) {
		    this.setShowing(false);
		    this.onClose("cancel");
		    if (!this._isDesignLoaded)
			inEvent._wmstop = true;
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
    setTitlebarHeight: function(inHeight) {
        this.titlebarHeight = inHeight;
        if (this.titleBar) this.titleBar.setHeight(inHeight + "px");
    },
    createTitle: function() {
	var border = (String(this.titlebarBorder).match(",")) ? this.titlebarBorder : "0,0," + this.titlebarBorder + ",0";
	this.titleBar = new wm.Container({_classes: {domNode: ["dialogtitlebar"]}, 
					  showing: this.title,
					  name: "titleBar", 
					  parent: this,
					  owner: this,
					  width: "100%",
					  height: this.titlebarHeight + "px",
					  margin: "0",
					  padding: "0",
					  border: border,
					  borderColor: this.titlebarBorderColor,
					  verticalAlign: "middle",
					  layoutKind: "left-to-right",
					  flags: {notInspectable: true}});

	this.titleClose = new wm.ToolButton({_classes: {domNode: ["dialogclosebutton"]},
					     noInspector: true,
					     name: "titleClose",
                                             hint: "Close dialog",
					     width: "19px",
					     height: "19px",
					     margin: "3,0,0,3",
					     parent: this.titleBar,
					     owner: this,
					     showing: !this.modal && !this.noEscape });
	this.titleMinify = new wm.ToolButton({_classes: {domNode: ["dialogminifybutton"]},
					      noInspector: true,
                                              hint: "Minify dialog (Puts it into a taskbar on the bottom of the screen)",
					      name: "titleMinify",
					      width: "19px",
					      height: "19px",
					      margin: "3,0,0,3",
					      parent: this.titleBar,
					      owner: this,
					      showing: !this.modal && !this.noMinify});	

	this.titleMaxify = new wm.ToolButton({_classes: {domNode: ["dialogmaxifybutton"]},
					  noInspector: true,
                                              hint: "Enlarge dialog",
					      name: "titleMinify",
					      caption: " ",
					      width: "19px",
					      height: "19px",
					      margin: "3,0,0,3",
					      parent: this.titleBar,
					      owner: this,
					      showing: !this.modal && !this.noMaxify});	
    
	this.titleLabel = new wm.Label({
					  noInspector: true,
	                                name: "dialogTitleLabel",
					parent: this.titleBar,
					owner: this,
					caption: this.title,
					showing: Boolean(this.title),
					margin: "3,3,0,10",
					width: "100%",
					height: "100%"});
	//this.titleBevel = new wm.Bevel({ parent: this, owner: this, showing: Boolean(this.title) });
	this.connect(this.titleClose, "onclick", this, "dismiss");
	this.connect(this.titleMinify, "onclick", this, "minify");
	this.connect(this.titleMaxify, "onclick", this, "maxify");
	this.connect(this.titleLabel, "onclick", this, "unminify");
	this.connect(this.titleLabel.domNode, "onmousedown", this, "unminifyormove");

    },
    setNoMinify: function(val) {
        this.noMinify = val;
        if (this.titleMinify)
            this.titleMinify.setShowing(!val);
    },
    setNoMaxify: function(val) {
        this.noMaxify = val;
        if (this.titleMaxify)
            this.titleMaxify.setShowing(!val);
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


wm.Object.extendSchema(wm.Dialog, {
    title: {group: "display", order: 1, bindTarget: true},

    owner: { group: "common", order: 1, readonly: true, options: ["Page", "Application"] },

    titlebarBorder: {group: "style", order: 5},
    titlebarBorderColor: {group: "style", order: 6},
    titlebarHeight: {group: "style", order: 7},
    footerBorder: {group: "style", order: 8},
    footerBorderColor: {group: "style", order: 9},

    modal: {group: "display", order: 50},
    noEscape: {group: "display", order: 51},
    noMinify: {group: "display", order: 51},
    noMaxify: {group: "display", order: 51},
    corner: {group: "layout", order: 52},

    noBevel: {ignore: 1},
    imageList: {ignore: 1},
    fitToContentWidth: {ignore: 1},
    fitToContentHeight: {ignore: 1},
    useContainerWidget: {ignore: 1},
    containerClass: {ignore: 1},
    useButtonBar: {ignore: 1}, // user doesn't decide this; buttonbar is autosizing; if nothing in there, then it doesn't show.
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
    showing: {ignore: 1},
    setModal: {group: "method"},
    minify: {group: "method"}
});




dojo.declare("wm.WidgetsJsDialog", wm.Dialog, { 
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
	if (this.button_data) {
	    if (!this.buttonBar) {
		var containerWidget = this.containerWidget;
		var containerNode = this.containerNode;
		delete this.containerWidget;
		delete this.containerNode;
		this.createButtonBar();
		this.containerWidget = containerWidget;
		this.containerNode = containerNode;
	    }
	    this.buttonBar.createComponents(this.button_data, this);
	}
    }
});


dojo.declare("wm.RichTextDialog", wm.WidgetsJsDialog, {

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
        this.widgets_data = {documentation: ["wm.RichText", {width: "100%", height: "100%", "toolbarAlign":false,"toolbarLink":true,"toolbarColor":true, toolbarFormatName: true, dataValue: this.html, displayValue: this.html}, {}],
		             buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, name: "buttonBar", layoutKind: "left-to-right",  padding: "2,0,2,0", horizontalAlign: "right", height: "34px", fitToContentHeight: true, width: "100%", borderColor: this.footerBorderColor, border: this.footerBorder}, {}, {
		                 okButton: ["wm.Button", {"width":"150px","caption": "OK"}, {"onclick":"onOkClick"}],
		                 cancelButton: ["wm.Button", {"width":"150px","caption": "Cancel"}, {"onclick":"onCancelClick"}]
	                     }]};
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
    html: {group: "display", order: 54, bindable: true, simpleBindProp: true},
    footerBorder: {group: "style", order: 100},
    footerBorderColor:  {group: "style", order: 101}
});
wm.RichTextDialog.extend({
    themeable: false
});

dojo.declare("wm.GenericDialog", wm.WidgetsJsDialog, {
    enterKeyIsButton1: true,
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
    button1Close: false,
    button2Close: false,
    button3Close: false,
    button4Close: false,
    userPrompt: "Testing...",
    showInput: false,
    prepare: function() {
        this.inherited(arguments);
        this.widgets_data = {
	    genericInfoPanel: ["wm.Panel", {layoutKind: "top-to-bottom",  width: "100%", height: "100%", horizontalAlign: "left", verticalAlign: "top", autoScroll: true, fitToContentHeight: true, padding: "10,5,10,5"}, {}, {
		userQuestionLabel: ["wm.Html", {autoScroll: false, "height":"25px",autoSizeHeight: true, "width":"100%",html: ""}],
		textInput: ["wm.Text", {"width":"100%","captionSize":"0%","showing":false}, {}, {}]
	    }]
	};
	this.button_data = {
		                        button4: ["wm.Button", {"width":"130px","showing":false}, {"onclick":"buttonClick"}],
		                        button3: ["wm.Button", {"width":"130px","showing":false}, {"onclick":"buttonClick"}],
		                        button2: ["wm.Button", {"width":"130px","showing":false}, {"onclick":"buttonClick"}],
		                        button1: ["wm.Button", {"width":"130px","showing":false}, {"onclick":"buttonClick"}]
	};
    


    },
    postInit: function() {
	this.inherited(arguments);
        this.containerWidget = this.c$[1];
	this.containerWidget.flags.notInspectable = true;
	if (!this.buttonBar) {
            this.buttonBar = this.containerWidget.c$[this.containerWidget.c$.length-1];
	    this.buttonBar.flags.notInspectable = true;
            this.setFooterBorder(this.footerBorder);
            this.setFooterBorderColor(this.footerBorderColor);
	}
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
            if (this.buttonBar)
	        this.buttonBar.setShowing(captionFound);
	    this.setShowInput(this.showInput);
	}
        if (this.$.userQuestionLabel)
	    this.$.userQuestionLabel.setHtml(this.userPrompt);
        this.containerWidget.setFitToContentHeight(true);
    },
    setFooterBorder: function(inBorder) {
        this.footerBorder = inBorder;
        if (this.buttonBar) {
	    this.buttonBar.setBorder(inBorder);
            this.buttonBar.setHeight((34 + this.buttonBar.padBorderMargin.t + this.buttonBar.padBorderMargin.b) + "px");
        }
    },
    setFooterBorderColor: function(inBorderColor) {
        this.footerBorderColor = inBorderColor;
        if (this.buttonBar)
            this.buttonBar.setBorderColor(inBorderColor);
    },
    // handle fitToContentHeight adjustments
    reflow: function() {
        try {
            if (!this._settingHeight) {
                var height = this.getPreferredFitToContentHeight();
		if (dojo.isChrome) height--; // stupid chrome bug...
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
        if (this.buttonBar)
	    this.buttonBar.setShowing(this.button1Caption || this.button2Caption || this.button3Caption || this.button4Caption);
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


wm.Object.extendSchema(wm.GenericDialog, {
    
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

    footerBorder: {group: "style", order: 100},
    footerBorderColor:  {group: "style", order: 101},
    setShowInput: {group:"method"},
    setInputDataValue: {group:"method"},
    getInputDataValue: {group:"method", returns: "String"},
    setUserPrompt: {group:"method"},
    setButton1Caption: {group:"method"},
    setButton2Caption: {group:"method"},
    setButton3Caption: {group:"method"},
    setButton4Caption: {group:"method"}
});

wm.GenericDialog.extend({

});


/* Remove this for 6.4 */
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
    postInit: function() {
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
    useContainerWidget: true,
    _timeoutId: 0,
    duration: 5000,
    content: "Toast",
    height: "100px",
    width: "350px",
    corner: "br", // bottom right
    border: "2",
    margin: "0",
    prepare: function() {
        this.inherited(arguments);
        this.widgets_data = {
	    img: ["wm.Picture", {_classes: {domNode: ["ToastLeft"]}, width: "30px", height: "100%",margin: "4,0,0,4"}],
	    rightColumn: ["wm.Panel", {layoutKind: "top-to-bottom", width: "100%", height: "100%", fitToContentHeight: true, padding: "0"},{},{
		title: ["wm.Label", { height: "20px", width: "100%", singleLine: true}],
		message: ["wm.Label", { height: "100px", width: "100%", singleLine: false, autoSizeHeight: true}]
	    }]
	};
    },
    postInit: function() {
	this.inherited(arguments);
	this.containerWidget.setLayoutKind("left-to-right");
	this.containerWidget.setPadding("4");	
        this.img = this.containerWidget.c$[0];
        this.title = this.containerWidget.c$[1].c$[0];
        this.message = this.containerWidget.c$[1].c$[1];

	this.setContent(this.content);
	this.connectEvents(this.domNode, ["click"]);
    },
    click: function() {
        this.hide();
        this.onToastClick();
    },
    onToastClick: function() {},
    setShowing: function(inShow, forceChange) {
	if (!inShow) {
	    window.clearTimeout(this._timeoutId);
	    delete this._timeoutId;
	}

        this.inherited(arguments);
        if (inShow)
            this.renderBounds();
    },
    renderBounds: function() {
        this.renderBoundsByCorner();
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
	    window.clearTimeout(this._timeoutId);
	    this.hide();
	    this._timeoutId = 0;
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
        deferLoad: false, // I'd rather this were true, but projects (AND STUDIO!) will break until users go through and change deferLoad back to false
	initPageContainer: function() {
	    this.pageContainer = new wm.PageContainer({loadParentFirst: false, deferLoad: false, parent: this, owner: this, flex: 1, pageProperties: this.pageProperties});
		this._connections.push(this.connect(this.pageContainer, "onPageChanged", this, "_pageChanged"));
		this._connections.push(this.connect(this.pageContainer, "onError", this, "onError"));
		this.pageContainer.dismiss = dojo.hitch(this, "dismiss");
		if (this.pageName && !this.deferLoad)
			this.setPage(this.pageName);
	    this.createControls();
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
							 borderColor: this.footerBorderColor || "",
							 flags: {notInspectable: true}});
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
	setContainerOptions: function(inHideControls, inWidth, inHeight) {
		inWidth = inWidth || wm.Dialog.prototype.contentWidth;
		inHeight = inHeight || wm.Dialog.prototype.contentHeight;
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

wm.PageDialog.extend({
    themeable: false
});

wm.Object.extendSchema(wm.PageDialog, {
    pageName: {group: "display", bindable: 1, type: "string", order: 54, pageProperty: "page"},
    deferLoad:{group: "display", type: "boolean", order: 55},
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
    height: "235px",
    modal: false,
    colorPickerControl: null,
    init: function() {
	this.inherited(arguments);
        dojo.require("dojox.widget.ColorPicker");
    },
    postInit: function() {
	this.inherited(arguments);

        if (!wm.ColorPickerDialog.cssLoaded) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = dojo.moduleUrl("dojox.widget.ColorPicker").uri + "ColorPicker.css";
            document.getElementsByTagName("head")[0].appendChild(link);
            wm.ColorPickerDialog.cssLoaded = true;
        }
        this.colorPickerControl = new wm.Control({name: "colorPickerControl", width: "325px", height: "193px", owner: this, parent: this});
        this.buttonPanel = new wm.Panel({name: "buttonPanel", width: "100%", height: "100%", layoutKind: "left-to-right", owner: this, parent: this, horizontalAlign: "center"});
        this.BrightenButton = new wm.Button({caption: "Bright", width: "75px", height: "30px", parent: this.buttonPanel, owner: this});
        this.DarkenButton = new wm.Button({caption: "Dark", width: "75px", height: "30px", parent: this.buttonPanel, owner: this});
        this.CancelButton = new wm.Button({caption: "Cancel", width: "75px", height: "30px", parent: this.buttonPanel, owner: this});
        this.OKButton = new wm.Button({caption: "OK", width: "75px", height: "30px", parent: this.buttonPanel, owner: this});

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
        if (!this.colorPicker && inShowing && this.domNode) {
            this.colorPicker = new dojox.widget.ColorPicker({animatePoint: true, showHsv: false, showRtb: true, webSave: false, onChange: dojo.hitch(this, "valueChange")}, this.domNode);       
            /* Hack because the colorpicker is beta and has problems getting these values correctly.  As the picker always appears in exactly the same place
             * in our dialog, we can always have these values be the same
             */
	    this.colorPicker.PICKER_SAT_VAL_H = 152;
	    this.colorPicker.PICKER_SAT_VAL_W = 152;
	    this.colorPicker.PICKER_HUE_H = 150;
/*
            this.colorPicker._shift.picker.x = 5;
            this.colorPicker._shift.picker.y = 5;
            */
        }
        
        if (inShowing) {

            // If it isn't currently showing, and we're now showing it, set _changed to false
            if (!this.showing)
                this._changed = false;

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
        this._changed = true;
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


/* Use designable dialog if your planning to design it in studio; if programatically creating a dialog use wm.Dialog */
dojo.declare("wm.DesignableDialog", wm.Dialog, {
    _pageOwnsWidgets: true,
    useButtonBar: false, // its false so we can add it in paletteDrop, but then the user can delete it if they want
    border: "1",
    borderColor: "black",
    titlebarBorder: "1",
    titlebarBorderColor: "black",
    footerBorderColor: "black",
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
    },
    afterPaletteDrop: function() {
	this.inherited(arguments);
        this.createButtonBar();
    },
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
                case "createButtonBar":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
                }
		return this.inherited(arguments);
        },
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
                case "createButtonBar":
                    this.createButtonBar();
                    this.reflow();
                    return;
                }
		return this.inherited(arguments);
        }
});

wm.Object.extendSchema(wm.DesignableDialog, {
/*    owner: {ignore: true} */ // See JIRA-2118: Can't drag and drop to an app level container
    createButtonBar: {group: "operation", order: 20}
});
