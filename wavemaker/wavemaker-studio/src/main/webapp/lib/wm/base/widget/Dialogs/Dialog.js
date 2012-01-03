/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Dialogs.Dialog");
dojo.require("wm.base.widget.Container");
dojo.require("wm.base.widget.Picture");
dojo.require("wm.base.widget.Buttons.ToolButton");
dojo.require("wm.base.widget.Buttons.Button");
dojo.require("wm.base.drag.drag");
dojo.require("dojo.dnd.Moveable");

wm.dialog = {showingList: []};

wm.dialog.getNextZIndex = function(isDesignLoaded, optionalThis) {
    var index = 30;
    if (!wm.dialog.showingList.length) return index;

    for (var i = 0; i < wm.dialog.showingList.length; i++) {
	if (!isDesignLoaded || isDesignLoaded && wm.dialog.showingList[i]._isDesignLoaded) {
	    if (wm.dialog.showingList[i] instanceof wm.Toast == false) {
		if (!optionalThis || wm.dialog.showingList[i] != this)
		    index = Math.max(index, wm.dialog.showingList[i].domNode.style.zIndex);
	    }
	}
    }
    return index+5;
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
	    app.appRoot.domNode.appendChild(f);
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


dojo.declare("wm.DialogResize", wm.MouseDrag, {
	beginResize: function(e, inSplitter) {
		this.dialog = inSplitter;
		this.mousedown(e);
	},
	drag: function() {
		this.inherited(arguments);
		this.dialog.drag(this.dx, this.dy);
	},
	finish: function() {
		this.inherited(arguments);
		this.dialog.drop();
	}
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
    mobileTitlebarHeight: "35",
    footerBorder: "1,0,0,0",
    containerPadding: "5",
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
    showTitleButtonsWhenDocked:false,
    constructor: function() {
	wm.Dialog.resizer = wm.Dialog.resizer || new wm.DialogResize();
    },
    init: function() {
	if (wm.isMobile) this.titlebarHeight = this.mobileTitlebarHeight;
        this.inherited(arguments);
	if (this._isDesignLoaded) {
	    this.flags.noModelDrop = true;
	}

	if (!this.docked) {
	    if (this._isDesignLoaded) 
		studio.designer.domNode.appendChild(this.domNode);
	    else
		app.appRoot.domNode.appendChild(this.domNode);
	}
	this.dialogScrim = new wm.Scrim({owner: this, _classes: {domNode: ["wmdialog-scrim"]}, waitCursor: false});

	this.createTitle();
	if (!this._isDesignLoaded)
	    this.connectEvents(this.domNode, ["mousedown"]);
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
	    if (!this.docked) 
		this.domNode.style.display = "none";		
	    this._connections.push(this.connect(document, "keydown", this, "keydown"));
	    this._subscriptions.push(dojo.subscribe("window-resize", this, "windowResize"));

	    this.setModal(this.modal);

	    this.setTitlebarBorder(this.titlebarBorder); 
            this.setTitlebarBorderColor(this.titlebarBorderColor);


	    var containerWidget, containerNode;
	    
            // set the owner to wm.Page to allow othis to be written... IF its an instance not a subclass of wm.Dialog
            var owner = (this.declaredClass == "wm.Dialog" || this._pageOwnsWidgets) ? this.owner : this; 


            // If the dialog has only a single widget inside of it, thats the titlebar, and the rest of it hasn't yet been created and needs creating.
            // If the dialog has more than one widget inside of it, then its safe to assume everything this dialog needs has been created

	    /* containerWidgetId is undefined if the page was last saved prior to adding support for this property. Currently the
	    * id is only used by designabledialog*/
	    if (this.containerWidgetId !== undefined) {
		// if its defined and empty, then there is no containerWidget
		if (this.containerWidgetId) {
		    containerWidget = this.owner.getValueById(this.containerWidgetId);
		    containerNode = containerWidget.domNode;
		} 
	    } else if (this.c$.length == 1) {
	        if (this.useContainerWidget) {
	            containerWidget = this.containerWidget ||  new wm.Container({
			_classes: {domNode: ["wmdialogcontainer", this.containerClass]}, 
			name: owner.getUniqueName("containerWidget"),
			parent: this,
			owner: owner,
			layoutKind: "top-to-bottom",
			padding: this.containerPadding,
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
            } else {
		containerWidget = this.c$[1]; // could be undefined
	    }


	    /* buttonBarId is undefined if the page was last saved prior to adding support for this property. Currently the
	    * id is only used by designabledialog */
	    if (this.buttonBarId !== undefined) {
		if (this.buttonBarId) {
		    this.buttonBar = this.owner.getValueById(this.buttonBarId);
		}
	    } else if (this.c$.length < 3) {
                // use of buttonbar is only accepted if useContainerWidget is true
               	if (this.useButtonBar && this.useContainerWidget) {		  
                    this.createButtonBar();
                }
            } else {
		this.buttonBar = this.c$[2];       // could be undefined
	    }

/*
            if (this.containerWidget)
                this.containerWidget.noInspector = true;
            if (this.buttonBar)
                this.buttonBar.noInspector = true;
		*/

	    // must set this AFTER creating the button bar, or the button
	    // bar will be ADDED to the containerWidget
	    if (containerWidget) {
		this.containerWidget = containerWidget;
	    }
	    this.containerNode = containerNode;
	    if (this.docked)
		this.show();
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
				       border: this.footerBorder,
				       borderColor: this.titlebarBorderColor});
        this.reflow();
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
	if (!inModal && !this.dojoMoveable) {
	    this.dojoMoveable = new dojo.dnd.Moveable(this.domNode, {handle: this.titleLabel.domNode});
	    this.connect(this.dojoMoveable, "onMouseDown", this, function() {
		if (!this.modal) {
		    if (this.docked) {
			this._userSized = true;
			this.setDocked(false);
		    }
		    var zindex =  wm.dialog.getNextZIndex(this._isDesignLoaded, this);
		    this.domNode.style.zIndex = zindex;
		}
	    });
	    this.connect(this.dojoMoveable, "onMoveStop", this, function() {
		if (this._openingTitleBarMenu) return;
		this._userSized = true;
		this.bounds.l = parseInt(this.domNode.style.left);
		this.bounds.t = parseInt(this.domNode.style.top);		
		if (!this.insureDialogVisible(true)) {
		    if (this.bounds.t < 0 && !this.noTopBottomDocking || this.bounds.t+this.bounds.h > app.appRoot.bounds.b && !this.noTopBottomDocking ||
			this.bounds.l < 0 && !this.noLeftRightDocking || this.bounds.w + this.bounds.l > app.appRoot.bounds.r && !this.noLeftRightDocking) {
			this.setDocked(true);
		    }
		} 
		this.setBounds(this.bounds); // recalcualtes right and bottom borders

		/* If user drags it above the top of the screen, the titlebar can't be reached to move it back, so don't allow this */
		if (!this.docked && this.bounds.t < 0) {
		    var oldT = this.bounds.t;
		    this.bounds.top = 0;
		    this.renderBounds();
		}	
	    });
	}
	if (this.showing  && !this._isDesignLoaded) {
	    this.dialogScrim.setShowing(this.modal);
	    wm.bgIframe.setShowing(!this.modal && !this.isDesignedComponent());
	}
	this.titleButtonPanel.setShowing(!this.modal && !this.docked);
    },
    setNoEscape: function(inNoEscape) {
	this.noEscape = inNoEscape;
	this.titleClose.setShowing(!this.modal && !this.noEscape  && !wm.isMobile);
    },	
    setDocked: function(inDock, optionalParent, optionalEdge) {
	var wasDocked = this.docked
	if (Boolean(wasDocked) == Boolean(inDock)) return;
	this.docked = inDock;
	if (inDock) {	    
	    this._dock(optionalParent, optionalEdge);
	} else {
	    this._undock();
	}
    },
    _dock: function(parent, edge) {
	var border = this.border;
	var margin = this.margin;
	if (!edge) {
	    if (this.bounds.t < 0 && !this.noTopBottomDocking)
		edge = "t";
	    else if (this.bounds.t+this.bounds.h > app.appRoot.bounds.b  && !this.noTopBottomDocking) 
		edge = "b";
	    else if (this.bounds.l < 0 && !this.noLeftRightDocking)
		edge = "l";
	    else if (!this.noLeftRightDocking)
		edge = "r";
	}
	if (!this.showTitleButtonsWhenDocked) {
	    this.titleButtonPanel.hide();
	}

	this._dockData = dojo.clone(this.bounds);
	this._dockData.edge = edge;
	this._dockData.border = border;
	this._dockData.margin = margin;
	this.setBorder("0");
	this.setMargin("0");
	if (!parent) {
	    if (edge == "t" && app.dockTop) {
		parent = app.dockTop;
	    } else if (edge == "b" && app.dockBottom) {
		parent = app.dockBottom;
	    } else if (edge == "l" && app.dockLeft) {
		parent = app.dockLeft;
	    } else if (edge == "r" && app.dockRight) {
		parent = app.dockRight;
	    } else {
		parent = app.appRoot;
	    }
	}

	if (parent == app.appRoot) {
	    app.dockDialog(this, edge);
	} else {
	    this.setParent(parent);
	    this.setWidth("100%");
	    this.setHeight("100%");
	    parent.show();
	    parent.reflow();
	}
    },
    _undock: function() {
	this.docked = false;
	if (!wm.isMobile) {
	    this.titleButtonPanel.show();
	}

	if (!this._dockData) {
	    this._dockData = dojo.clone(this.bounds);
	}
	if (this._dockData.edge == "t" || this._dockData.edge == "b") {
	    this._dockData.t = Math.floor(dojo.coords(this.domNode).y);
	} else {
	    this._dockData.l = Math.floor(dojo.coords(this.domNode).x);
	}
	this._cupdating = true;
	if (this._dockData.border !== undefined)
	    this.setBorder(this._dockData.border);
	else
	    this.setBorder(wm.Dialog.prototype.border);
	if (this._dockData.margin !== undefined)
	    this.setMargin(this._dockData.margin);
	else
	    this.setMargin(wm.Dialog.prototype.margin);

	this.setWidth( ((this._dockData.w||this.bounds.w) -20) + "px");
	this.setHeight(((this._dockData.h||this.bounds.h) -20) + "px");
	this.setBounds({t: this._dockData.t || this.bounds.t, l: this._dockData.l || this.bounds.l});
	this._cupdating = false;

	delete this._dockData;
	var parent = this.parent;
	app.removeDockedDialog(this); // TODO
	if (this._isDesignLoaded) 
	    studio.designer.domNode.appendChild(this.domNode);
	else
	    app.appRoot.domNode.appendChild(this.domNode);

	this.render();
	this.flow();

	if (parent.dockRight || parent.dockLeft || parent.dockTop || parent.dockBottom) {
	    if (parent.c$.length == 0) {
		parent.hide();
	    } else {
		parent.reflow();
	    }
	} else {
	    app.reflow();
	}
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
	if (this.docked) {
	    this._undock();
	}
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

    windowResize: function() {
	this.reflow();
	this.delayedRenderBounds();
    },
	reflowParent: function() {
	    if (this.docked && this.parent) {
		this.parent.reflow();
	    }
	},

	dismiss: function(e) {
	        this.setShowing(false, false, true);
		var why = "" || dojo.isString(e) ? e : e && e.target && e.target.innerHTML;
		this.onClose(why);
		why = null;
	},
        destroy: function() {
	    this._destroying = true;
	    if (this._minified) {
		app.removeMinifiedDialogLabel(this.minifiedLabel);
		delete this.minifiedLabel;
	    }
	    if (this.showing)
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
	// annoying hack
		    if (dojo.isChrome && this.buttonBar && !this._chromeButtonBarHack) {
			this._chromeButtonBarHack = true;
			this.buttonBar.bounds.h++;
			this.buttonBar.renderBounds();
		    }

		    this.dialogScrim.reflowParent();
		}
	},

    getPreferredFitToContentHeight: function() {
	var result = this.inherited(arguments);
	var min = this.minHeight;
	//result = result - this.marginExtents.t - this.marginExtents.b;
	return Math.max(min, result);
    },
    getPreferredFitToContentWidth: function() {
	var result = this.inherited(arguments);
	var min = this.minWidth;
	//result = result - this.marginExtents.l - this.marginExtents.r;
	return Math.max(min, result);
    },
	setFitToContentWidth: function(inFitToContent) {
	    this.inherited(arguments);
	    this.reflow();
	},
	setFitToContentHeight: function(inFitToContent) {
	    this.inherited(arguments);
	    this.reflow();
	},

    delayedRenderBounds: function() {
	wm.job(this.getRuntimeId() + ".renderBounds", 5, dojo.hitch(this, function() {
	    var bounds = dojo.clone(this.bounds);
	    this.renderBounds();
	    if (bounds.w != this.bounds.w || bounds.h != this.bounds.h)
		this.reflow();
	}));
    },
    renderBounds: function() {
	    if (this.docked)
		return this.inherited(arguments);

		if (this.showing) {
		    if (this.fitToContentHeight && !this._userSized) {
			this.bounds.h = this.getPreferredFitToContentHeight();
			this.height = this.bounds.h + "px";
		    }
		    if (this.fitToContentWidth && !this._userSized) {
			this.bounds.w = this.getPreferredFitToContentWidth();
			this.width = this.bounds.w + "px";
		    }
		    if (this._minified) {
			var parentBox = app.appRoot.bounds; //dojo.contentBox(window.document.body);
			var t = parentBox.h - 30;
			var l = parentBox.w - 200;
			this.setBounds(l,t,200,30);
		    } else if (this._maxified) {
			var parentBox = app.appRoot.bounds; //dojo.contentBox(window.document.body);
			this.setBounds(20,20,parentBox.w-40,parentBox.h-40);
		    } else {
			//// center within parent
			//var parentBox = dojo.contentBox(this.domNode.parentNode);
			//var bounds = this.getBounds();
			if (this._userSized) {
			    this.insureDialogVisible();
                        } else {
			    if (!this.fixPositionNode && this.positionNear) {
				var widget = this.owner.getValueById(this.positionNear);
				if (widget) this.fixPositionNode = widget.domNode;
			    }
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
	if (this.positionNear) {
	    this.renderBoundsByPositionNode();
	} else {
            this.renderBoundsByCorner();
	}
    },
/* if the dialog is off the edge of the screen, attempt to compensate */
    insureDialogVisible: function(testOnly) {
	if (!this.showing) return;
        var w = this.bounds.w;
        var h = this.bounds.h;
        //var isDesigned =  (this.domNode.parentNode != document.body);
	//var isDesigned =  (this.domNode.parentNode != app.appRoot.domNode);
	var isDesigned = this._isDesignLoaded;
        var W = (isDesigned) ? studio.designer.bounds.w : (app._page) ? app._page.root.bounds.w : window.clientWidth;
        var H = (isDesigned) ? studio.designer.bounds.h : (app._page) ? app._page.root.bounds.h : window.clientHeight;
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

	if (this._isDesignLoaded) {
	    var designerO = dojo._abs(studio.designer.domNode);
	    o.x -= designerO.x;
	    o.y -= designerO.y;
	}
	var corner = this.corner || "bc";
        var top  = corner.substring(0,1);
        var left = corner.substring(1,2);

	switch(left) {
	case "l":
	    this.bounds.l = o.x - this.bounds.w;
	    break;
	case "r":
	    this.bounds.l = o.x + o.w;
	    break;
	case "c":
	    this.bounds.l = o.x + (o.w-this.bounds.w)/2;
	}
	switch(top) {
	case "t":
	    this.bounds.t = o.y - this.bounds.h;
	    break;
	case "b":
            this.bounds.t = o.y + o.h;
	    break;
	case "c":
	    this.bounds.t = o.y + (o.h-this.bounds.h)/2;
	}
        this.insureDialogVisible();
	this.setBounds(this.bounds); // recalcualtes right and bottom borders
/*
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
	*/
    },
    renderBoundsByCorner: function() {
	if (!this.showing) return;
        var w = this.width;
        var h = this.height;

        var isDesigned = this._isDesignLoaded;
        var W = (isDesigned) ? studio.designer.bounds.w : this.domNode.parentNode.clientWidth;
        var H = (isDesigned) ? studio.designer.bounds.h : this.domNode.parentNode.clientHeight;


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

	//if (!this._isDesignLoaded) {
	    if (w + 2 > W) w = W-2;
	    if (h + 2 > H) h = H-2;
	//}
        var buffer = 10;
        var t,l;
        
        var top  = this.corner.substring(0,1);
        var left = this.corner.substring(1,2);
	var showingList = [];
	var thisownerapp = this.getOwnerApp();
	if (!this._percEx.h && !this._percEx.w) {
	    for (var i = 0; i < wm.dialog.showingList.length; i++)
		if (wm.dialog.showingList[i] != this && wm.dialog.showingList[i].getOwnerApp() == thisownerapp && (!window["studio"] || this != window["studio"].dialog))
		    showingList.push(wm.dialog.showingList[i]);
	    h = parseInt(h);
	    var last = wm.Array.last(showingList);
	}
        switch(left) {
        case "l":
            l = buffer;
            break;
        case "r":
            l = W - w - buffer;
            break;
        case "c":
	    l = Math.floor((W - w)/2);
	    if (last && last.corner == this.corner)
		l += 25; // offset it if its over another dialog so that there's a better (though not certain) chance of the dialog below being visible



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
	    if (last && last.corner == this.corner)
		t += 25;
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
		var zindex =  wm.dialog.getNextZIndex(this._isDesignLoaded);
		wm.dialog.showingList.push(this);
	        this.domNode.style.zIndex = zindex;
	    if (this.modal)
		this.dialogScrim.domNode.style.zIndex = zindex-1;
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
		this.domNode.style.opacity = 1;
		wasShowing = true; // its still showing, skip animating showing it again and just show it
		delete this._hideAnimation;

	    } else if (!inShowing && this._showAnimation) {
		this._showAnimation.stop();
		delete this._showAnimation;

	    }

	    if (inShowing && !wasShowing) {
		this.callOnShowParent();
		if (animationTime) {
		    if (!this._showAnimation) {
			if (app.debugDialog) {
			    var eventChain = app.debugDialog.cacheEventChain();
			}
			this._showAnimation =  
			    dojo.animateProperty({node: this.domNode, 
						  properties: {opacity: 1},
						  duration: animationTime,
						  onEnd: dojo.hitch(this, function() {
						      if (eventChain) {
							  app.debugDialog.restoreEventChain(eventChain);
						      }
			                              this.domNode.style.opacity = 1; // needed for IE 9 beta
                                                      this.onShow();
						  if (eventChain) {
						      app.debugDialog.clearEventChain();
						  }
						  })});
			this._showAnimation.play();
		    }
		} else {
		    this.onShow();
		}

	    } else if (!inShowing && wasShowing) {
		this.callOnHideParent();
		if (animationTime) {
		    if (!this._hideAnimation) {
			if (app.debugDialog) {
			    var eventChain = app.debugDialog.cacheEventChain();
			}
                        this._transitionToHiding = true;
			this._hideAnimation = 
			dojo.animateProperty({node: this.domNode, 
					      properties: {opacity: 0.01},
					      duration: animationTime,
					      onEnd: dojo.hitch(this, function() {
                                                  if (this.isDestroyed) return;
						  if (eventChain) {
						      app.debugDialog.restoreEventChain(eventChain);
						  }
						      wm.Control.prototype.setShowing.call(this,inShowing,forceChange, skipOnClose);
						  if (this.docked) this.setDocked(false);
                                                  delete this._transitionToHiding;
						      if (!skipOnClose && !this._minified) 
						          this.onClose("");
						      delete this._hideAnimation; // has no destroy method
						  if (eventChain) {
						      app.debugDialog.clearEventChain();
						  }
					      })});
			    this._hideAnimation.play();
		    }
		} else {
		    this.inherited(arguments);		    
		    if (this.docked) this.setDocked(false);
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
    canProcessKeyboardEvent: function(inEvent) {
        if (!this.showing || this.docked) return false;
            var dialogs = dojo.query(".wmdialog");
            var zindex = parseInt(this.domNode.style.zIndex);
            for (var i = 0; i < dialogs.length; i++) {
                if (dialogs[i].style.display != "none" && parseInt(dialogs[i].style.zIndex) > zindex) {
                    return false; // this isn't the foremost dialog
                }
            }
	return true;

    },
	keydown: function(inEvent) {
	    if (!this.canProcessKeyboardEvent(inEvent))
		return true;

	    if (inEvent.keyCode == dojo.keys.ESCAPE && !this.noEscape) {
		if (this._isDesignLoaded && studio.selected.getParentDialog() == this) return;
		if (this.showing) {
		    this.callOnHideParent();
		    this.setShowing(false);
		    this.onClose("cancel");
		    if (!this._isDesignLoaded)
			inEvent._wmstop = true;
		    dojo.stopEvent(inEvent);
		}
	    } else if (inEvent.keyCode == dojo.keys.ENTER) {
                if (this.$.textInput && this.$.textInput.getDataValue)
                    this.onEnterKeyPress(this.$.textInput.getDataValue(), inEvent);
                else
                    this.onEnterKeyPress("", inEvent);
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
	if (wm.isMobile) {
	    if (!wm.Dialog.titlebarMenu) {
		wm.Dialog.titlebarMenu = app.createComponents({	
		    _dialogTitlebarMenu: ["wm.PopupMenu", {}]
		},app)[0];
	    }
	}



	var buttonPanel = this.titleButtonPanel = new wm.Panel({parent: this.titleBar,
					owner: this,
					name: "titleButtonBar",
					width: wm.isMobile ? this.mobileTitlebarHeight + "px": (!this.noEscape ? 20 : 0) + (!this.noMinify ? 20 : 0) + (!this.noMaxify ? 20 : 0) + "px",
					height: "100%",
					layoutKind: "left-to-right",
					horizontalAlign: "left",
					verticalAlign: "top",
					showing: !this.modal && !this.docked
				       });
	if (wm.isMobile) {
	    this.menuButton = new wm.MobileIconButton({
		                                 direction: "down",
						 noInspector: true,
						 name: "menuButton",
						 width: this.mobileTitlebarHeight + "px",
						 height: "100%",
						 margin: "0",
						 parent: buttonPanel,
						 owner: this,
						 onclick: dojo.hitch(this, function(inEvent) {
						     wm.Dialog.titlebarMenu.setFullStructure([
							 {"label":"Close","separator":undefined,"defaultLabel":"Close","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":dojo.hitch(this,"hide"),"children":[]},
							 {"label":"Minimize","separator":undefined,"defaultLabel":"Minimize","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":dojo.hitch(this,"minify"),"children":[]},
							 {"label":"Full Size","separator":undefined,"defaultLabel":"Full Size","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":dojo.hitch(this,"maxify"),"children":[]},
							 {"label":"Normal Size","separator":undefined,"defaultLabel":"Normal Size","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":dojo.hitch(this,"maxify"),"children":[]}
						     ]);
						     wm.Dialog.titlebarMenu.renderDojoObj(); 
						     wm.Dialog.titlebarMenu.setItemShowing("Close", !this.noEscape);
						     wm.Dialog.titlebarMenu.setItemShowing("Minify", !this.noMinify);
						     wm.Dialog.titlebarMenu.setItemShowing("Full Size", !this.noMaxify && !this._maxified);
						     wm.Dialog.titlebarMenu.setItemShowing("Normal Size", this._maxified);
						     wm.Dialog.titlebarMenu.update(inEvent);
						 })
	    });
						 

	}
	this.titleClose = new wm.ToolButton({_classes: {domNode: ["dialogclosebutton"]},
					     noInspector: true,
					     name: "titleClose",
                                             hint: wm.getDictionaryItem("wm.Dialog.HINT_CLOSE"),
					     width: "19px",
					     height: "19px",
					     margin: "3,0,0,3",
					     parent: buttonPanel,
					     owner: this,
					     showing: !this.noEscape && !wm.isMobile});
	this.titleMinify = new wm.ToolButton({_classes: {domNode: ["dialogminifybutton"]},
					      noInspector: true,
                                             hint: wm.getDictionaryItem("wm.Dialog.HINT_MINIFY"),
					      name: "titleMinify",
					      width: "19px",
					      height: "19px",
					      margin: "3,0,0,3",
					     parent: buttonPanel,
					      owner: this,
					      showing:  !this.noMinify  && !wm.isMobile});	

	this.titleMaxify = new wm.ToolButton({_classes: {domNode: ["dialogmaxifybutton"]},
					  noInspector: true,
                                              hint: wm.getDictionaryItem("wm.Dialog.HINT_MAXIFY"),
					      name: "titleMinify",
					      caption: " ",
					      width: "19px",
					      height: "19px",
					      margin: "3,0,0,3",
					     parent: buttonPanel,
					      owner: this,
					      showing: !this.noMaxify && !wm.isMobile});	
    
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

    },
    setNoMinify: function(val) {
        this.noMinify = val;
        if (this.titleMinify)
            this.titleMinify.setShowing(!val && !wm.isMobile);
    },
    setNoMaxify: function(val) {
        this.noMaxify = val;
        if (this.titleMaxify)
            this.titleMaxify.setShowing(!val && !wm.isMobile);
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
	if (this.docked) return;
	if (this.isReflowEnabled())
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
    },


    /* Resizing */
	mousedown: function(e) {
	    if (!this.modal) {
		var zindex =  wm.dialog.getNextZIndex(this._isDesignLoaded, this);
		this.domNode.style.zIndex = zindex;
	    }

	    /* Can only target the dialog's node if hitting the border or if some bad rendering of content */
	    /* noMaxify is taken to mean that the dialog isn't designed to be resized, either to max size or any custom size */
	    if (!this.modal && !this.noMaxify && e.target == this.domNode) {

		this._initialPosition = dojo.clone(this.bounds);

		var leftTarget = e.clientX - this.marginExtents.l - this.borderExtents.l;
		var rightTarget = e.clientX;
		var topTarget = e.clientY - this.marginExtents.t - this.borderExtents.t;
		var bottomTarget = e.clientY;

		if (leftTarget - 12 <= this.bounds.l && leftTarget + 12 >= this.bounds.l) {
		    this._dragBorderX = "left";
		    console.log("LEFT");
		} else if (rightTarget - 12 <= this.bounds.r && rightTarget + 12 >= this.bounds.r) {
		    this._dragBorderX = "right";
		    console.log("RIGHT");
		} else {
		    this._dragBorderX = "";
		}
		if (topTarget - 12 <= this.bounds.t && topTarget + 12 >= this.bounds.t) {
		    this._dragBorderY = "top";
		} else if (bottomTarget - 12 <= this.bounds.b && bottomTarget + 12 >= this.bounds.b) {
		    this._dragBorderY = "bottom";
		} else {
		    this._dragBorderY = "";
		}
		switch(this._dragBorderX + this._dragBorderY) {
		case "lefttop":
		    wm.Dialog.resizer.setCursor("nw-resize");
		    break;
		case "leftbottom":
		    wm.Dialog.resizer.setCursor("sw-resize");
		    break;
		case "righttop":
		    wm.Dialog.resizer.setCursor("ne-resize");
		    break;
		case "rightbottom":
		    wm.Dialog.resizer.setCursor("se-resize");
		    break;
		case "top":
		    wm.Dialog.resizer.setCursor("n-resize");
		    break;
		case "bottom":
		    wm.Dialog.resizer.setCursor("s-resize");
		    break;
		case "left":
		    wm.Dialog.resizer.setCursor("w-resize");
		    break;
		case "right":
		    wm.Dialog.resizer.setCursor("e-resize");
		    break;
		}
		wm.Dialog.resizer.beginResize(e, this);
	    }
	},
	drag: function(inDx, inDy) {
	    this._userSized = true;
	    //console.log(inDx);
	    if (this._dragBorderX == "left") {
		this.setBounds(this._initialPosition.l + inDx, NaN, this._initialPosition.w - inDx, NaN);
	    } else if (this._dragBorderX == "right") {
		this.setBounds(NaN, NaN, this._initialPosition.r - this._initialPosition.l + inDx, NaN);
	    }


	    if (this._dragBorderY == "top") {
		this.setBounds(NaN, this._initialPosition.t + inDy, NaN, this._initialPosition.h - inDy, NaN);
	    } else if (this._dragBorderY == "bottom") {
		this.setBounds(NaN, NaN, NaN, this._initialPosition.b - this._initialPosition.t + inDy);
	    }

	    this.renderBounds();
	    if (!dojo.isIE || dojo.isIE >= 9) {
		if (this.docked) {
		    app.reflow();
		} else {
		    this.reflow();
		}
	    }

	},
	drop: function() {	    
	    this.reflow();
	},
    setPositionNear: function(inWidgetOrName) {
	if (inWidgetOrName instanceof wm.Component) {
	    this.positionNear = inWidgetOrName.getId();
	    this.fixPositionNode = inWidgetOrName.domNode;
	} else {
	    this.positionNear = inWidgetOrName;
	    var widget = this.owner.getValueById(inWidgetOrName);
	    this.fixPositionNode = widget ? widget.domNode : null;
	}
	this.renderBounds();
    }
});
