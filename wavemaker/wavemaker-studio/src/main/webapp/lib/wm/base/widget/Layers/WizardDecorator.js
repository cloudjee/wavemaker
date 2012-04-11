/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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
dojo.provide("wm.base.widget.Layers.WizardDecorator");
dojo.require("wm.base.widget.Layers.TabsDecorator");

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