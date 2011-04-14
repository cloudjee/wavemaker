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
		this.tabsControl = new wm.TabsControl({
			parent: this.decoree, 
		        owner: this.decoree,
		    padding: this.decoratorPadding,
		    name: "tabsControl"
		});
		this.decoree.moveControl(this.tabsControl, 0);
	},
	createTab: function(inCaption, inIndex, inLayer) {
		var b = this.btns[inIndex] = document.createElement("button");
	        //b.style.outline = "none";
		b.style.display = inLayer.showing ? "" : "none";
	    this.setBtnText(b, inCaption, inLayer.closable || inLayer.destroyable);
		this.decoree.connect(b, "onclick", dojo.hitch(this, "tabClicked", inLayer));
	    b.className=this.decorationClass + "-tab" +  (inLayer.closable || inLayer.destroyable ? " " + this.decorationClass + "-closabletab" : "");
	    if (!inCaption) b.style.display = "none";
	    this.tabsControl.domNode.appendChild(b);
	},
	tabClicked: function(inLayer, e) {
		var d = this.decoree;
		// prevent designer click
		if (d.isDesignLoaded())
			dojo.stopEvent(e);
	    var close = dojo.hasClass(e.target, "TabCloseIcon");
	    if (!close && (inLayer.closable || inLayer.destroyable)) {
		var closeIcon = dojo.coords(e.target.firstChild);
		var button = dojo.coords(e.target);
		if (e.clientX >= closeIcon.x &&
		    e.clientY <= closeIcon.y+closeIcon.h)
		    close = true;
	    }
	    if (close) {
		if (inLayer.parent.customClose != inLayer.parent.constructor.prototype.customClose)
		    return inLayer.parent.customClose(inLayer);
		var currentLayer = inLayer.parent.getActiveLayer();
		var currentIndex = currentLayer.getIndex();
		var parent = inLayer.parent;
		parent.onClose(inLayer);
		if (inLayer.destroyable) 
		    inLayer.destroy();
		else
		    inLayer.hide();
		this.decoree.renderBounds(); // in case number of rows of tabs has changed
		if (!currentLayer.isDestroyed) currentLayer.activate();
		else if (currentIndex > 0) parent.setLayerIndex(currentIndex-1);
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
		this.btns[inToIndex] = f;
		this.btns[inFromIndex] = t;
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
	undecorate: function() {
	    this.inherited(arguments);
	    if (this.buttonPanel)
		this.buttonPanel.destroy();
	    this.buttonPanel = null;
	    this.nextButton  = null;
	    this.prevButton  = null;
	},
	addFooter: function() {
	    this.buttonPanel = new wm.Panel({name: "buttonPanel",
					     parent: this.decoree,
					     owner: this.decoree,
					     layoutKind: "left-to-right",
					     height: wm.Button.prototype.height,
					     width: "100%",
                                             freeze: true,
                                             lock: true,
					     verticalAlign: "top",
					     horizontalAlign: "right"});
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
		this.decoree.setLayerIndex(i+1);
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
	else
	    this.decoree.setLayerIndex(i-1);
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
        if (oldindex + 1 == newindex)
            return this.inherited(arguments);

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

	return this.inherited(arguments);
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
		this.height = this.owner && this.owner.headerHeight;
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
	    return domHeight;		    c
		if (domHeight != _currHeight){
			dojo.marginBox(this.domNode, {h:_currHeight});
			return domHeight;
		}
		return false;
	}
});
