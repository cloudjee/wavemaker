/*
 *  Copyright (C) 2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.mobile.LivePanel_design");
dojo.require("wm.base.mobile.LivePanel");

wm.mobile.LivePanel.extend({
	afterPaletteDrop: function() {
	    this.inherited(arguments);

	    this.createLiveSource();
	    this.setupLivePanel();
	},
        createLiveSource: function() {
	    var ti = wm.typeManager.getType(this.liveSource)
	    if (!ti)
		return;
	    var name = this.liveSource.split('.').pop().toLowerCase();
	    var lv = this._liveView = new wm.LiveView({owner: studio.application, 
						      name: wm.findUniqueName(name + "LiveView1", [studio.application]), 
						      service: ti.service, 
						      dataType: this.liveSource, 
						      _defaultView: true});
	    this.liveView = this._liveView.name;
	    var r = this.getRoot();
	    var d = this.liveVariable = r.createComponent(name + "LiveVariable1", "wm.LiveVariable", {liveSource: lv.getId()});

	},

    generateLivePanel: function() {
	for (var i = this.layers.length-1; i >= 0; i--)
	    this.layers[i].destroy();
	dojo.forEach(this.layers, function(l) {if (l) l.destroy();});
	var activities = dojo.clone(this._liveView.activities); // we clone it because we will be adding widgets into it, which will prevent it from being writable
	this.generatePanels(activities, null);
	this.stitchLayers(activities);
	studio.refreshDesignTrees();
	this.reflow();
	studio.leftObjects.activate();
    },
    stitchLayers: function(activityObj) {
	if (activityObj.activities && activityObj.activities.length) {
	    activityObj.widget.nextLayer = activityObj.activities[0].widget.isAncestorInstanceOf(wm.mobile.Layer).name;
	    for (var i = 0; i < activityObj.activities.length; i++)
		this.stitchLayers(activityObj.activities[i]);
	}
    },
    generatePanels: function(activityObj, parentActivity, addButtonToActivity) {
	var parentActivityLayer = parentActivity ? parentActivity.widget.isAncestorInstanceOf(wm.mobile.Layer) : null;

	if (activityObj.activity == "Edit") {
	    var name = (activityObj.filterId || "Main").replace(/\W/g, "") + "Edit";
	    var layer = new wm.mobile.Layer({parent: this,
                                             horizontalAlign: "left",
                                             verticalAlign: "top",
					     owner: this.owner,
					     caption: "Edit " + activityObj.caption,
					     name: name + "Layer"});

	    var liveForm = new wm.mobile.LiveForm({ 
		name: studio.page.getUniqueName(name + "Form"),
		owner: this.owner,
		parent: layer,
		verticalAlign: "top",
		horizontalAlign: "left",
		_liveSource: this.liveSource
	    });

	    liveForm.set_dataSet(parentActivity.widget.name + ".selectedItem");
	    liveForm.eventBindings.onSuccess = this.liveVariable.name; // reload the liveview/livevar whenever the entire live form changes the data
	    liveForm.eventBindings.onSuccess2 = parentActivityLayer.name;// return to the parent activity after any kind of LiveForm.onSuccess
	    liveForm.$.binding.addWire(null, "operation", "", "${" + parentActivity.widget.name + ".emptySelection} ? \"insert\" : \"update\"");
	    activityObj.widget = liveForm;

	    /* Now setup the New button of the parentActivity's list to navigate to this form */
	       parentActivity.widget.eventBindings.onNewClicked = layer.name;
	} else {
	    var name = (activityObj.filterId || "Main").replace(/\W/g, "") + "List";
	    var layer = new wm.mobile.Layer({parent: this,
                                                 horizontalAlign: "left",
                                                 verticalAlign: "top",
						 owner: this.owner,
						 caption: "List " + this.liveDataName,
						 name: name + "Layer"});


	    var list = new wm.mobile.List({
		name: studio.page.getUniqueName(name + "Widget"),
		owner: this.owner,
		parent: layer,
		rowArrows: true,
		useNewButton: true,
		useSearchBar: true		
	    });
	    activityObj.widget = list;
	    if (parentActivity)
		list.set_dataSet(parentActivity.widget.name + ".selectedItem." + activityObj.filterId.replace(/^.*\./,""));
	    else
		list.set_dataSet(this.liveVariable.name);

	    /* Setup the list 
	    var listTitleField = "";
	    var listBodyField = "";
	    var type = activityObj.type;
	    var typeDef = wm.typeManager.getType(this.liveSource);
	    var fields = typeDef.fields;
	    var sortedFieldNames = wm.typeManager.getPropNames(typeDef.fields)

	    for (var i = 0; i < sortedFieldNames.length; i++) {
		var f = fields[sortedFieldNames[i]];
		var readonly = dojo.indexOf(f.noChange||[], "read") >= 0;
		if (!readonly && f.displayType == "Text") {
		    if (!listTitleField) {
			listTitleField = f.dataIndex;
		    } else {
			listBodyField = v.dataIndex;
			break;
		    }
		}
	    }
	    if (!listTitleField) {
		listTitleField = sortedFieldNames[0];
	    }
	    list.setTitleField(listTitleField);
	    if (listBodyField)
		list.setBodyField(listBodyField);
	    */

	    for (var i = 0; i < activityObj.activities.length; i++) {
		this.generatePanels(activityObj.activities[i], activityObj, Boolean(i));
	    }
	}
	if (addButtonToActivity) {
	    var jumpToLayer =  parentActivity.activities[0].widget.isAncestorInstanceOf(wm.mobile.Layer);
	    var b = new wm.mobile.Button({owner: this.owner,
					  parent: jumpToLayer,
					  name: "goto" + wm.capitalize(name) + "Button",
					  caption: activityObj.activity + " " + activityObj.caption,
					  width: "100%"
					 });
	    b.eventBindings.onclick = layer.name;

	    var indexOfMainActivity = jumpToLayer.indexOfControl(parentActivity.activities[0].widget);
	    jumpToLayer.moveControl(b,indexOfMainActivity); // if you insert it at index of 0, then if there are many such buttons, they'll be in reverse order with the lowest priority (end of list) activity being the last one to stick its button at index 0
	}
    },
    setupLivePanel: function() {
	if (!this._setupDialog) {
	    this._setupDialog = new wm.PageDialog({owner: studio,
						   name: "LivePanelSetupDialog",
						   title: "Setup Live Panel",
						   modal: false,
						   hideControls: true,
						   width: "600px",
						   height: "400px",
						   pageName: "LivePanelEditor"});
	    this.connect(this._setupDialog.page, "accept", this, "generateLivePanel");
	}
	this._setupDialog.page.setLiveView(studio.application[this.liveView]);
	this._setupDialog.show();
    },

    _end: 0
});


wm.Object.extendSchema(wm.mobile.LivePanel, {
    themeStyleType: {ignore: 1},
	liveDataName: {ignore: 1},
    liveSource: {ignore: 1},
    dialog: {ignore: 1},
    saveButton: {ignore: 1},
    liveVariable: {ignore: 1},
    livevar: {ignore: 1}

});
