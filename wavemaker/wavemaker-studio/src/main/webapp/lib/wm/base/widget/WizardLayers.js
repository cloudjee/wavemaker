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
dojo.provide("wm.base.widget.WizardLayers");
dojo.require("wm.base.widget.Layers");

/************************************************************************
 * FEATURES:
 * 1. Next/previous button built in to get user to next/previous step of wizard (or next/previous card)
 * 2. Turns tabs into breadcrumbs
 * 3. Manages state and clickability of each breadcrumb
 * 4. Manages carriage return, maps it to Next button.
 * 5. Autofocus on any invalid or missing required field and refuses to go to next step
 * 6. Autofocus on first editor after going to next step
 * 7. Introduces animated layer transitions
 * 8. The entire wizard comes with two events that fire if the user backs out of the wizard, or hits next after the wizard is complete (onCancelClick, onDoneClick)
 * 9. Added the ability to auto focus on a widget that fails validation or is required.
 * 10. Added animated transitions
 * 11. Custom validators per layer
 */
dojo.declare("wm.WizardLayers", wm.Layers, {
    themeStyleType: "ContentPanel",
    layersType: 'Wizard',
    transition: "fade",
    headerWidth: "50px",
    verticalButtons: false,
    bottomButtons: "",
    hasButtonBar: true,
    //useDesignBorder: 0,
    init: function() {
	this.generateBottomButtonEvents();

	this.inherited(arguments);
	this.decorator.addFooter();
	this.connect(this.domNode, "keydown", this, "keydown");
    },
    generateBottomButtonEvents: function() {
	var bottomButtons = this.bottomButtons ? this.bottomButtons.split(/\s*,\s*/) : [];
	for (var i = 0; i < bottomButtons.length; i++) {
	    this["onBottom" + i + "Button"] = function() {}; // gives event handler something to connect to
	}
    },
    keydown: function(e) {
	var keyCode = e.keyCode;
	if (e.keyCode == dojo.keys.ENTER || e.keyCode == dojo.keys.NUMPAD_ENTER) {
	    this.decorator.nextClick();
	    dojo.stopEvent(e);
	    return false;
	}
	return true;
    },
    onCancelClick: function() {

    },
    onDoneClick: function() {

    },
    /* This should really be an event of wm.Layer, but we should first discuss whether we want form
     * validation to be build into wm.Layer */
    onLayerValidation: function(inLayer, outResult) {

    }
});