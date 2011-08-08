/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.studio.pages.CustomWebServiceImporter.CustomWebServiceImporter");

dojo.declare("CustomWebServiceImporter", wm.Page, {
    i18n: true,
    start: function() {

    },
    onShow: function() {
	studio.componentModel.activate();
    },
    reset: function() {
    },
    scanClick: function() {
	var user = this.userInput.getDataValue();
	//if (user.indexOf("/") != 0)
	//    user = "/" + user;

	var pass = this.passInput.getDataValue();
	var host = this.importHost.getDataValue();
	var port = this.importPort.getDataValue();
	var domain = this.domainEditor.getDataValue();
	var d = this.flowListService.requestAsync("listAllFlows", [host, port, user, pass, domain]);
	d.addCallback(dojo.hitch(this, "listAllFlowsSuccess"));
	d.addErrback(dojo.hitch(this, "listAllFlowsError"));
    },
    listAllFlowsSuccess: function(inData) {
	this.data = dojo.fromJson(inData);
	this.buildTree();
    },
    listAllFlowsError: function(inError) {
	app.toastError(inError.message || inError);
    },
    filterResults: function(inSender) {
	var filter = this.searchBox.getDataValue() ;
	for (var i = 0; i < this.tree.root.kids.length; i++) {
	    var projectNode = this.tree.root.kids[i];
	    if (!projectNode.kids.length)
		projectNode.setOpen(true); // initialize its child list
	    for (var j = 0; j < projectNode.kids.length; j++) {
		var flowNode = projectNode.kids[j];
		var showing = (!filter || flowNode.data.name.toLowerCase().indexOf(filter.toLowerCase()) != -1) ;
		flowNode.domNode.style.display = showing ? "" : "none";
		if (projectNode.closed)
		    projectNode.setOpen(true);
	    }
	}

    },
    buildTree: function() {
	this.tree.clear();
	for (var i = 0; i < this.data.length; i++) {
	    var project = this.data[i].project;
	    project.flows = this.data[i].flows;
	    delete this.data[i].flows;
	    var node = new wm.TreeRadioNode(this.tree.root, {
		content: project.name + " (" + project.owner + ")",
		checked: false,
		closed: true,
		data: project,
		hasChildren: true,
		initNodeChildren: dojo.hitch(this, "initNodeChildren")
	    });
	}
    },
    initNodeChildren: function(inParentNode) {
	var project = inParentNode.data;
	var flows = project.flows;
	for (var i = 0; i < flows.length; i++) {
		new wm.TreeCheckNode(inParentNode,
				     {
					 content: flows[i].name,
					 checked: false,
					 data: flows[i],
					 hasChildren: false
				     });	    
	}	
    },
    nodeChecked: function(inSender, inNode) {
	if (inNode.parent == inNode.tree.root)
	    this.projectChecked(inNode);
	else
	    this.flowChecked(inNode);

    },
    projectChecked: function(inNode) {
	if (inNode.getChecked() && inNode.closed) {
	    inNode.setOpen(true);
	}
	for (var i = 0; i < inNode.kids.length; i++) {
	    inNode.kids[i].setChecked(inNode.getChecked());
	}
	for (var i = 0; i < this.tree.root.kids.length; i++) {
	    if (this.tree.root.kids[i].getChecked() == false) {
		dojo.forEach(this.tree.root.kids[i].kids, function(kid) {kid.setChecked(false);});
	    }
	}
	this.updateImportDisabled();
    },
    flowChecked: function(inNode) {
	if (inNode.getChecked() && !inNode.parent.getChecked())
	    inNode.parent.setChecked(true);
	else if (!inNode.getChecked() && dojo.every(inNode.parent.kids, function(node) {return !node.getChecked();}))
	    inNode.parent.setChecked(false);
	this.updateImportDisabled();
    },
    updateImportDisabled: function() {
	var disabled = true;
	this.tree.forEachNode(dojo.hitch(this, function(node) {
	    if (node.data && !wm.isEmpty(node.data) && node.data.flows === undefined && node.getChecked())
		disabled = false;
	}));
	this.importButton.setDisabled(disabled);
    },
    cancelClick: function() {
	this.owner.owner.hide();
    },
    importClick: function() {
	var user = this.userInput.getDataValue();
	//if (user.indexOf("/") != 0)
	//    user = "/" + user;

	var pass = this.passInput.getDataValue();
	var host = this.importHost.getDataValue();
	var port = this.importPort.getDataValue();
	var domain = this.domainEditor.getDataValue();

	var projects = {};
	var firstProjectName;
	this.tree.forEachNode(dojo.hitch(this, function(node) {
	    if (node.data && node.data.flows !== undefined && node.getChecked()) {
		projects[node.data.name] = [];
		if (!firstProjectName)
		    firstProjectName = node.data.name;
	    }
	}));

	this.tree.forEachNode(dojo.hitch(this, function(node) {
	    if (node.data && !wm.isEmpty(node.data) && node.data.flows === undefined && node.getChecked())
		projects[node.parent.data.name].push(node.data.name);
	}));

	var d = this.flowListService.requestAsync("importFlows", [host, port, user, pass, domain, firstProjectName, projects[firstProjectName],null],
						  dojo.hitch(this, "importFlowsSuccess"),
						  dojo.hitch(this, "importFlowsError"));
    },
    importFlowsSuccess: function() {
	studio.updateServices();
	studio.application.loadServerComponents();
	studio.refreshServiceTree(); 
	app.toastSuccess(this.getDictionaryItem("TOAST_IMPORT_SUCCESS"));
	this.owner.owner.hide();
    },
    importFlowsError: function(inError) {
	app.toastError(inError.message);
    },
    _end: 0
});
