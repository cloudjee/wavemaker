/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Layers.TabsDecorator");
dojo.require("wm.base.widget.Layers.Decorator");

dojo.declare("wm.TabsDecorator", wm.LayersDecorator, {
	decorationClass: "wmtablayers",
        decoratorPadding: "7, 0, 0, 0",
	undecorate: function() {
		this.inherited(arguments);
		this.tabsControl.destroy();
	},
	decorateContainer: function() {
		this.inherited(arguments);
		this.btns = [];
	    if (this.tabsControl)
		this.tabsControl.destroy();
		this.tabsControl = new wm.TabsControl({
			parent: this.decoree, 
		        owner: this.decoree,
		    padding: this.decoratorPadding,
		    name: "tabsControl"
		});
		this.decoree.moveControl(this.tabsControl, 0);
	    if (this.decoree.dndTargetName) {
    		this.dndObj = new dojo.dnd.Source(this.tabsControl.domNode, {accept: [this.decoree.dndTargetName]});
		this.dndObjConnect = this.tabsControl.connect(this.dndObj, "onDndDrop", this, "onTabDrop");
	    }

	},
	createTab: function(inCaption, inIndex, inLayer) {
	    var b = this.btns[inIndex] = document.createElement("button");
	    dojo.attr(b,"id", this.decoree.domNode.id + "_decorator_button" + this.btns.length);
	    dojo.attr(b,"type", "button");
	    dojo.attr(b,"type", "button");
	        //b.style.outline = "none";
		b.style.display = inLayer.showing ? "" : "none";
	    this.setBtnText(b, inCaption, inLayer.closable || inLayer.destroyable);
	    this.decoree.connect(b, "onclick", dojo.hitch(this, function(evt) {
		// prevent designer click
		if (this.decoree.isDesignLoaded())
			dojo.stopEvent(evt);
		/* IE 8 does not gaurentee that evt will still have its properties after a delay, so 
		 * we capture the event properties we need and pass that rather than the event object itself.
		 * Other browsers don't require this, but it seems like a good practice regardless.
		 */
		if (evt.type == "submit") return;
		var pseudoEvent = {target: evt.target,
				   clientX: evt.clientX,
				   clientY: evt.clientY};
				   
		wm.onidle(this, function() {
		    this.tabClicked(inLayer,pseudoEvent);
		});
	    }));
	    var tabstyleName = (this.decoree.verticalButtons) ? "-verticaltab" : "-tab";
	    b.className=this.decorationClass + tabstyleName +  (inLayer.closable || inLayer.destroyable ? " " + this.decorationClass + "-closabletab" : "");
	    if (!inCaption) b.style.display = "none";
	    this.tabsControl.domNode.appendChild(b);

	    if (this.dndObj) {
		this.dndObj.destroy()
		dojo.disconnect(this.dndObjConnect);
		dojo.addClass(b, "dojoDndItem");
		dojo.attr(b, "dndType", this.decoree.dndTargetName);
    		this.dndObj = new dojo.dnd.Source(this.tabsControl.domNode, {accept: [this.decoree.dndTargetName]});
		this.dndObjConnect = this.tabsControl.connect(this.dndObj, "onDndDrop", this, "onTabDrop");
	    }
	},
	 onTabDrop: function(dndSource,nodes,copy,dndTarget,event) {
	     if (dojo.dnd.manager().target != this.dndObj) return;
	     var tabLayers = wm.getWidgetByDomNode(nodes[0]);
	     var index = dojo.indexOf(tabLayers.decorator.btns, nodes[0]);
	     if (index == -1) return;
	     var layer = tabLayers.layers[index];
	     if (!layer) return;
	     if (layer.parent != this.decoree) {
		 layer.setParent(this.decoree);
		 var selectedIndex = tabLayers.layerIndex;
		 tabLayers.layerIndex = -1;
		 tabLayers.setLayerIndex(tabLayers.layers.length > selectedIndex ? selectedIndex : tabLayers.layers.length-1);
	     }
    
	     var managedButtons = this.btns;
	     var currentButtons = this.tabsControl.domNode.childNodes;
	     for (var i = 0; i < currentButtons.length; i++) {
		 var b = currentButtons[i];
		 if (dojo.indexOf(managedButtons,b) == -1) {
		     this.decoree.moveLayer(layer, i);
		     dojo.destroy(b);
		     break;
		 }
	     }
             layer.activate();
	     layer.onTabDrop();
	     if (tabLayers != this.decoree) {
		 tabLayers.onTabRemoved();
	     }
	     this.decoree.onTabDrop();
	 },
	tabClicked: function(inLayer, e) {
		var d = this.decoree;

	    var close = dojo.hasClass(e.target, "TabCloseIcon");
	    if (!close && (inLayer.closable || inLayer.destroyable)) {
		var closeIcon = dojo.coords(e.target.firstChild);
		var button = dojo.coords(e.target);
		if (e.clientX >= closeIcon.x &&
		    e.clientY <= closeIcon.y+closeIcon.h)
		    close = true;
	    }
	    if (close) {
		if (inLayer.customCloseOrDestroy != inLayer.constructor.prototype.customCloseOrDestroy)
		    return inLayer.customCloseOrDestroy(inLayer);
		inLayer.onCloseOrDestroy();

		if (inLayer.parent.customCloseOrDestroy != inLayer.parent.constructor.prototype.customCloseOrDestroy)
		    return inLayer.parent.customCloseOrDestroy(inLayer.parent, inLayer);
		var currentLayer = inLayer.parent.getActiveLayer();
		var currentIndex = currentLayer.getIndex();
		var parent = inLayer.parent;
		parent.onCloseOrDestroy(inLayer);
		if (inLayer.destroyable) 
		    inLayer.destroy();
		else
		    inLayer.hide();
		this.decoree.renderBounds(); // in case number of rows of tabs has changed
		if (!currentLayer.isDestroyed) {
		    currentLayer.activate();
		    currentLayer.parent.layerIndex = dojo.indexOf(currentLayer.parent.layers, currentLayer);
		} else if (currentIndex > 0) parent.setLayerIndex(currentIndex-1);
		else parent.setLayerIndex(0);
		    
	    } else {
		d.setLayer(inLayer);
	    }
	},
	decorateLayer: function(inLayer, inIndex) {
		this.inherited(arguments);
		this.createTab(inLayer.caption, inIndex, inLayer);
	},
	undecorateLayer: function(inLayer, inIndex) {
		dojo._destroyElement(this.btns[inIndex]);
		this.btns.splice(inIndex, 1);
	},
	setLayerShowing: function(inLayer, inShowing) {
		var i = inLayer.getIndex();
		if (i != -1)
			this.btns[i].style.display = inShowing ? "" : "none";
		this.inherited(arguments);
	},
	setLayerActive: function(inLayer, inActive) {
		var b=this.btns[inLayer.getIndex()];
		if (b)
		    dojo[inActive ? "addClass" : "removeClass"](b, this.decorationClass + '-selected');
		this.inherited(arguments);
	},
	applyLayerCaption: function(inLayer) {
		var d = this.decoree, i = inLayer.getIndex();
		if (i != -1)
		    this.setBtnText(this.btns[i], inLayer.caption, inLayer.closable || inLayer.destroyable);
	},
    setBtnText: function(inBtn, inCaption, closable) {
	var index = dojo.indexOf(this.btns, inBtn);
	var layer = this.decoree.layers[index];
	if (inCaption) {
	    if (inBtn.style.display && layer.showing)
		inBtn.style.display = "";
	    dojo[closable ? "addClass" : "removeClass"](inBtn, this.decorationClass + "-closabletab");
	    inBtn.innerHTML = (closable ? "<span class='TabCloseIcon'>x</span>" : "") +  (inCaption || '&nbsp;');
	} else {
	    inBtn.style.display = "none";
	}
	
	},
	getBtn: function(inCaption) {
		var d = this.decoree, i = d.indexOfLayerCaption(inCaption);
		if (i != -1)
			return this.btns[i];
	},
	disenableTab: function(inCaption, inDisable) {
		var b = this.getBtn(inCaption);
		if (b)
			b.disabled = inDisable ? "disabled" : "";
	},
	disableTab: function(inCaption) {
		this.disenableTab(inCaption, true);
	},
	enableTab: function(inCaption) {
		this.disenableTab(inCaption, false);
	},
	moveLayerIndex: function(inFromIndex, inToIndex) {
		this.inherited(arguments);
		var d = this.tabsControl.domNode, f = this.btns[inFromIndex], t = this.btns[inToIndex], c = this.decoree.getCount()-1;
		if (inToIndex < inFromIndex) {
			d.insertBefore(f, t);
		} else if (inToIndex > inFromIndex) {
			if (inToIndex == c)
				d.appendChild(f);
			else {
				var nl = this.btns[inToIndex + 1];
				if (nl)
					d.insertBefore(f, nl);
			}
		}
	    wm.Array.removeElement(this.btns, f);
	    wm.Array.insertElementAt(this.btns, f, inToIndex);
	}
});

dojo.declare("wm.RoundedTabsDecorator", wm.TabsDecorator, {
	decorateContainer: function() {
		this.inherited(arguments);
		dojo.removeClass(this.tabsControl.domNode, "wmtablayers-tabbar");
		dojo.addClass(this.tabsControl.domNode, "wmtablayers-roundedtabbar");
		this.tabsControl.setPadding("0,0,0,15");
		this.tabsControl.domNode.style.paddingTop = "0px";								
		this.tabsControl.domNode.style.paddingLeft = "15px";
	},
	createTab: function(inCaption, inIndex, inLayer) {
		var b = this.btns[inIndex] = document.createElement("div");		
		b.style.display = inLayer.showing ? "" : "none";
		
		var divLeft = document.createElement("div");
		var divCenter = document.createElement("div");
		var divRight = document.createElement("div");
		
		divLeft.innerHTML = "&nbsp;";
		divCenter.innerHTML = "&nbsp;";
		divRight.innerHTML = "&nbsp;";
		
		this.setBtnText(divCenter, inCaption, inLayer.closable || inLayer.destroyable);
		this.decoree.connect(b, "onclick", dojo.hitch(this, "tabClicked", inLayer));
		this.decoree.connect(b, "onmouseover", dojo.hitch(this, "mouseoverout", inLayer, true));
		this.decoree.connect(b, "onmouseout", dojo.hitch(this, "mouseoverout", inLayer, false));

		b.className="wmtablayers-roundedtab";
		divLeft.className="wmtablayers-roundedtab-left";
		divCenter.className="wmtablayers-roundedtab-center";
		divRight.className="wmtablayers-roundedtab-right";

		b.appendChild(divLeft);
		b.appendChild(divCenter);
		b.appendChild(divRight);
		
		dojo.connect(b, "onselectstart", dojo, "stopEvent");
		this.tabsControl.domNode.appendChild(b);
	},
	tabClicked: function(inLayer){
		var b=this.btns[inLayer.getIndex()];
		var divLeft = b.childNodes[0];
		var divCenter = b.childNodes[1];
		var divRight = b.childNodes[2];		
		if (b){
			dojo.removeClass(divLeft, 'wmtablayers-roundedtab-left-hover');				
			dojo.removeClass(divCenter, 'wmtablayers-roundedtab-center-hover');
			dojo.removeClass(divRight, 'wmtablayers-roundedtab-right-hover');			
		}
		this.inherited(arguments);					
	},
	mouseoverout: function(inLayer, inActive){
		var inIndex = inLayer.getIndex();		
		if(this.decoree.layerIndex != inIndex){ // user has put mouse over an inactive tab
			var b=this.btns[inIndex];
			var divLeft = b.childNodes[0];
			var divCenter = b.childNodes[1];
			var divRight = b.childNodes[2];
			if (b){				
				dojo[inActive ? "addClass" : "removeClass"](divLeft, 'wmtablayers-roundedtab-left-hover');				
				dojo[inActive ? "addClass" : "removeClass"](divCenter, 'wmtablayers-roundedtab-center-hover');
				dojo[inActive ? "addClass" : "removeClass"](divRight, 'wmtablayers-roundedtab-right-hover');
			}							
		}
	},
	applyLayerCaption: function(inLayer) {
		var d = this.decoree, i = inLayer.getIndex();
		if (i != -1)
			this.setBtnText(this.btns[i].childNodes[1], inLayer.caption, inLayer.closable || inLayer.destroyable);
	}
	
});

dojo.declare("wm.WizardDecorator", wm.TabsDecorator, {
    decorationClass: "wmwizardlayers",
    decoratorPadding: "2",
    buttonPanel: null,
    nextButton: null,
    prevButton: null,
    constructor: function() {
	this.backCaption = wm.getDictionaryItem("wm.WizardDecorator.BACK");
	this.nextCaption = wm.getDictionaryItem("wm.WizardDecorator.NEXT");
	this.doneCaption = wm.getDictionaryItem("wm.WizardDecorator.DONE");
	this.cancelCaption = wm.getDictionaryItem("wm.WizardDecorator.CANCEL");

    },
	decorateContainer: function() {
	    this.inherited(arguments);
	    if (!this.wrapperContainer) {
	    this.wrapperContainer = new wm.Panel({owner: this.decoree, 
						  width: "100%", 
						  height: "100%", 
						  layoutKind: "top-to-bottom"});
	    if (this.decoree.client)
		this.setupWrapperContainer();
	    }
	},
    setupWrapperContainer: function() {
	    this.decoree.client.setParent(this.wrapperContainer);
	    this.wrapperContainer.moveControl(this.decoree.client,0);
	    this.wrapperContainer.setParent(this.decoree);
    },
    createTab: function(inCaption,inIndex,inLayer) {
	if (this.decoree.client && !this.wrapperContainer.parent)
	    this.setupWrapperContainer();
	this.inherited(arguments);
    },
	undecorate: function() {
	    this.inherited(arguments);
	    if (this.buttonPanel)
		this.buttonPanel.destroy();
	    this.buttonPanel = null;
	    this.nextButton  = null;
	    this.prevButton  = null;
	},
	addFooter: function() {
	    if (this.buttonPanel)
		this.buttonPanel.destroy();
	    var customButtons = this.decoree.bottomButtons ? this.decoree.bottomButtons.split(/\s*,\s*/) : [];

	    this.buttonPanel = new wm.Panel({name: "buttonPanel",
					     parent: this.wrapperContainer,
					     owner: this.decoree,
					     showing: this.decoree.hasButtonBar,
					     layoutKind: "left-to-right",
					     height: wm.Button.prototype.height,
					     width: "100%",
                                             freeze: true,
                                             lock: true,
					     verticalAlign: "top",
					     horizontalAlign:  customButtons.length ? "left" : "right"});

	    var self = this;
	    dojo.forEach(customButtons, function(caption,i) {
		var b = 
		new wm.Button({name: "custom" + i,
			       parent: self.buttonPanel,
			       owner: self.decoree,
			       width: "100px",
			       height: "100%",
			       caption: caption});
		/* Can't put i at the end or it looks like an event sequence of "and then..." events */
		b.connect(b, "onclick", self.decoree, "onBottom" + i + "Button");

	    });
	    if (customButtons.length) {
		new wm.Spacer({name: "spacer",
			       parent: this.buttonPanel,
			       owner: this.decoree,
			       width: "100%"});
	    }
			       

	    this.prevButton = new wm.Button({name: "prevButton",
					     parent: this.buttonPanel,
					     owner: this.decoree,
					     width: "80px",
					     height: "100%",
					     caption: this.cancelCaption});
	    this.nextButton = new wm.Button({name: "nextButton",
					     parent: this.buttonPanel,
					     owner: this.decoree,
					     width: "80px",
					     height: "100%",
					     caption: this.nextCaption});
	    dojo.connect(this.prevButton, "onclick", this, "backClick");
	    dojo.connect(this.nextButton, "onclick", this, "nextClick");	
	},
	setLayerActive: function(inLayer, inActive) {
	    this.inherited(arguments);
	    var i = inLayer.getIndex();

	    /*
	    this.prevButton.setShowing(i > 0);
	    this.nextButton.setShowing(i < inLayer.decorator.decoree.layers.length-1);
	    */

	    this.nextButton.setCaption(i < inLayer.decorator.decoree.layers.length-1 ? this.nextCaption : this.doneCaption);
	    this.prevButton.setCaption(i  == 0 ? this.cancelCaption : this.backCaption);
	},
    nextClick: function() {
	var i = this.decoree.layerIndex;
	var layer = this.decoree.getActiveLayer();
	var result = this.validateCurrentLayer();
	if (result) {
	    if (i == this.decoree.layers.length-1) {
		this.decoree.onDoneClick();
	    } else {
		for (i = i+1; i < this.decoree.layers.length; i++)
		    if (this.decoree.layers[i].showing) break;
		this.decoree.setLayerIndex(i);
		var layer = this.decoree.getActiveLayer();
		layer.focusFirstEditor();
	    }
	}
    },
    validateCurrentLayer: function(noWarn) {
	var i = this.decoree.layerIndex;
	var layer = this.decoree.getActiveLayer();

	// Mark as invalid before we start
	//layer.layerHasBeenValidated = false; 
	dojo.removeClass(this.btns[i], "done");

	var invalidWidget = layer.getInvalidWidget();
	if (invalidWidget && !noWarn) {

	    // focusing on an invalid editor will automatically show its invalid message without needing an alert
	    invalidWidget.focus();
	    invalidWidget.editor.displayMessage(invalidWidget.invalidMessage || wm.getDictionaryItem("wm.TabDecorator.VALIDATION_INVALID_INPUT"), true);

	    app.toastDialog.showToast(wm.getDictionaryItem("wm.WizardDecorator.TOAST_INVALID", {name: invalidWidget.caption || invalidWidget.name}), 3000, "Warning", "cc");
	    return false;
	}


	if (invalidWidget) return false;
	var result = {invalidMessage: null};
	this.decoree.onLayerValidation(layer, result);
	if (result.invalidMessage) {
	    if (!noWarn) 
		app.alert(result.invalidMessage);
	    return false;
	}

	if (layer.invalid) {
	    if (!noWarn)
		app.alert(wm.getDictionaryItem("wm.WizardDecorator.ALERT_INCOMPLETE"));
	    return false;
	}

	//layer.layerHasBeenValidated = true;
	dojo.addClass(this.btns[i], "done");
	return true;
    },
    backClick: function() {
	this.validateCurrentLayer(true);
	var i = this.decoree.layerIndex;
	if (i == 0)
	    this.decoree.onCancelClick();
	else {
	    for (i = i-1; i >= 0; i--)
		if (this.decoree.layers[i].showing) break;
	    this.decoree.setLayerIndex(i);
	    this.decoree.layers[i].focusFirstEditor();
	}
    },
    tabClicked: function(inLayer, e) {
	if (this.decoree.isDesignLoaded()) return this.inherited(arguments);
	var layer = this.decoree.getActiveLayer();
        
        var oldindex = layer.getIndex();
	var newindex = inLayer.getIndex();

        // If trying to skip ahead, validate the current layer
        if (oldindex < newindex && !this.validateCurrentLayer()) return;

        // If the user clicks on to the very next tab, then this is the same as clicking the "Next" button.
        // We've already validated the current layer so procede
        if (oldindex + 1 == newindex) {
            this.inherited(arguments);
	    this.decoree.getActiveLayer().focusFirstEditor();
	    return;
	}
        // So, the current layer is valid, and we're skipping ahead at least two layers, this is ONLY ok
        // if all layers between oldindex and newindex are valid AND if they are all tagged as "Done".
        if (oldindex < newindex) {
            for (var i = oldindex + 1; i < newindex; i++) {
	        if (this.decoree.layers[i].invalid) {                
		    app.toastDialog.showToast(wm.getDictionaryItem("wm.WizardDecorator.TOAST_PLEASE_FILL", {name: this.decoree.layers[i].caption}), 3000, "Warning", "cc");
		    return;
                } else if (!dojo.hasClass(this.btns[i], "done")) {
		    app.toastDialog.showToast(wm.getDictionaryItem("wm.WizardDecorator.TOAST_SKIP_LAYER", {name:  this.decoree.layers[i].caption}), 3000, "Warning", "cc");
		    return;
                }
            }
        } else {
            this.validateCurrentLayer(true);
        }
	 this.inherited(arguments);
	this.decoree.getActiveLayer().focusFirstEditor();
    }

});

dojo.declare("wm.BreadcrumbDecorator", wm.TabsDecorator, {
    decorationClass: "wmbreadcrumblayers",
    decoratorPadding: "2",

    /* Whenever a layer is set to active, we need to show it, and make it the rightmost visible layer
     * Whenever a layer is set to inactive, we need to hide it if the current layer is left of this layer.
     */
    setLayerActive: function(inLayer, inActive) {
	var wasShowing = inLayer.showing;
	this.inherited(arguments);
	if (inLayer._isDesignLoaded || this.decoree._cupdating ) return;

	var layers = this.decoree.layers;

	/* If we're activating a hidden layer, show that layer and move it after the last visisible layer so
	 * that it appears to be the last breadcrumb/step. */
	if (inActive && !wasShowing) {
	    var layerIndex = inLayer.getIndex();
	    for (var i = layers.length-1; i > layerIndex; i--) {
		if (layers[i].showing)
		    break;
	    }
	    if (i > layerIndex) {
		this.decoree.moveLayerIndex(inLayer,i+1);
	    }
	    inLayer.show();
	    if (inLayer.showing) {
		inLayer.domNode.style.display = "";
		inLayer.reflow();
	    }
	}
	/* If activating a layer that is already showing, hide any layers that are after this layer */
	else if (inActive) {
	    for (var i = inLayer.getIndex()+1; i < layers.length; i++) {
		if (layers[i].showing) layers[i].setShowing(false);
	    }
	}

	/* If hide all layers after the layer that is activated */
	if (inActive) {
	    this.decoree.layerIndex = inLayer.getIndex();
	    var count = this.decoree.layers.length;
	    for (var i = inLayer.getIndex() + 1; i < count; i++) {
		if (this.decoree.layers[i].showing)
		    this.decoree.layers[i].hide();
	    }
	}
    }

});



dojo.declare("wm.TabsControl", wm.Control, {
	height: "27px",
	width: "100%",
	border: 0,
	init: function() {
	    if (this.parent && this.parent.isRelativePositioned)
		this.isRelativePositioned = true;
	    dojo.addClass(this.domNode, "wmtablayers-tabbar");
	    if (this.owner) {
		if (this.owner.verticalButtons) {
		    this.height = "100%";
		    this.width = this.owner.headerWidth;
		} else {
		    this.height = this.owner.headerHeight;
		}
	    }
	    this.inherited(arguments);
	},
	updateHeaderHeight: function(){
		// dont do anything during design mode as designer decides what height should header have.
/* no longer relevant as this test now needs to be handled by the caller
		if (this.isDesignLoaded())
		  return false;
*/
	        //var _currHeight = dojo.marginBox(this.domNode).h;  these two lines are invoked by the caller before doing a short delay so that IE 6 can update its dom structure
		//this.domNode.style.height = 'auto';
		var domHeight = dojo.marginBox(this.domNode).h;
	    return domHeight;
		if (domHeight != _currHeight){
			dojo.marginBox(this.domNode, {h:_currHeight});
			return domHeight;
		}
		return false;
	}
});
