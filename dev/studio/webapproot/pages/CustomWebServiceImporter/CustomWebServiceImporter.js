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

    /* Nothing to be done until the user has entered in some account info */
    start: function() {

    },
    
    /* Any time this dialog shows, its nice for the users to be able to see the services tab to see what services they've already imported */
    onShow: function() {
	studio.componentModel.activate();
    },
    reset: function() {
    },

    /* What parameters do you need to send the server to get a list of all services and operations for those services?  Figure that out, and
     * use the requestAsync call to pass your parameters.  onSuccess will call listAllOperationsSuccess.  onError will call listAllOperationsError
     */
    scanClick: function() {
	var user = this.userInput.getDataValue();
	var pass = this.passInput.getDataValue();
	var host = this.importHost.getDataValue();
	var port = this.importPort.getDataValue();
	var domain = this.domainEditor.getDataValue();
	var loginInfo = {};
	loginInfo.host = host;
	loginInfo.port = port;
	loginInfo.userName = user;
	loginInfo.password = pass;
	loginInfo.miscInfo = domain;
	loginInfo.partnerName = "asteria";

	var d = this.operationListService.requestAsync("listAllOperations", [loginInfo]);
	d.addCallback(dojo.hitch(this, "listAllOperationsSuccess"));
	d.addErrback(dojo.hitch(this, "listAllOperationsError"));
    },

    /* onSuccess: Get the data from the json result and call buildTree to build the tree from that json */
    listAllOperationsSuccess: function(inData) {
	this.data = dojo.fromJson(inData);
	this.buildTree();
    },

    /* onError: toast the user wishing them better fortune next time */
    listAllOperationsError: function(inError) {
	app.toastError(inError.message || inError);
    },

    /* As the user types, filter the operation names that match the user's input */
    filterResults: function(inSender) {
	var filter = this.searchBox.getDataValue() ;
	for (var i = 0; i < this.tree.root.kids.length; i++) {
	    var serviceNode = this.tree.root.kids[i];
	    if (!serviceNode.kids.length)
		serviceNode.setOpen(true); // initialize its child list
	    for (var j = 0; j < serviceNode.kids.length; j++) {
		var operationNode = serviceNode.kids[j];
		var showing = (!filter || operationNode.data.name.toLowerCase().indexOf(filter.toLowerCase()) != -1) ;
		operationNode.domNode.style.display = showing ? "" : "none";
		if (serviceNode.closed)
		    serviceNode.setOpen(true);
	    }
	}
    },

    /* Build the tree from data stored in this.data.  For docs on tree building, see http://dev.wavemaker.com/wiki/bin/Tree */
    buildTree: function() {
	this.tree.clear();
	for (var i = 0; i < this.data.length; i++) {
	    var service = this.data[i].project;
	    service.operations = this.data[i].flows;
	    delete this.data[i].flows;
	    var node = new wm.TreeRadioNode(this.tree.root, {
		content: service.name + " (" + service.owner + ")",
		checked: false,
		closed: true,
		data: service,
		hasChildren: true,
		initNodeChildren: dojo.hitch(this, "initNodeChildren")
	    });
	}
    },

    /* Each service has nodes listing all of its operations */
    initNodeChildren: function(inParentNode) {
	var service = inParentNode.data;
	var operations = service.operations;

	for (var i = 0; i < operations.length; i++) {
	    new wm.TreeCheckNode(inParentNode,
				 {
				     content: operations[i].name,
				     checked: false,
				     data: operations[i],
				     hasChildren: false
				 });	    
	}	
    },

    /* If a node is checked, call either the serviceChecked or operationChecked handler based on the selected node */
    nodeChecked: function(inSender, inNode) {
	if (inNode.parent == inNode.tree.root)
	    this.serviceChecked(inNode);
	else
	    this.operationChecked(inNode);

    },


    /* When a service is checked, check all of its operations.  
     * If the service has previously been imported, reselect the currently imported operations */
    serviceChecked: function(inNode) {
	/* When a node is checked, open it */
	if (inNode.getChecked() && inNode.closed) {
	    inNode.setOpen(true);
	}

	/* See if the selected service is in the project's current services */
	var service = inNode.data;
	var services = studio.application.getServerComponents();
	var currentService;
	for (var i = 0; i < services.length; i++) {
	    var c = services[i];
	    if (c instanceof wm.WebService && c.name == service.name) {
		currentService = c;
		break;
	    }
	}

	/* If the service is in the project's current services, get a list of operations currently imported */
	var operations = [];
	if (currentService) {
	    // needs studio.application owner to resolve SMD path correctly
	    var s = new wm.JsonRpcService({name: currentService.name, owner: studio.application});
	    for (var op in s._operations) {
		operations.push(op);
		operations.push(wm.capitalize(op));
	    }
	    s.destroy();
	}

	/* If the service is in the project's current services and there are imported operations, set nodes for those operations to be checked */
	if (currentService && operations.length) {
	    for (var i = 0; i < inNode.kids.length; i++) {
		if (dojo.indexOf(operations, inNode.kids[i].data.name) != -1) {
		    inNode.kids[i].setChecked(true);
		}
	    }
	} else {
	    /* Else just select everything */
	    for (var i = 0; i < inNode.kids.length; i++) {
		inNode.kids[i].setChecked(inNode.getChecked());
	    }
	}

	/* deselect/uncheck all operations of all other services */
	for (var i = 0; i < this.tree.root.kids.length; i++) {
	    if (this.tree.root.kids[i].getChecked() == false) {
		dojo.forEach(this.tree.root.kids[i].kids, function(kid) {kid.setChecked(false);});
	    }
	}

	/* Update the import button's disabled state based on the new selections */
	this.updateImportDisabled();
    },

    /* When an operation is checked, update state */
    operationChecked: function(inNode) {
	/* If the parent/service isn't checked and the node/operation is checked, then check the parent/service, and let the serviceChecked event handler
	 * perform any necessary updates on child checked state 
	 */
	if (inNode.getChecked() && !inNode.parent.getChecked()) {
	    inNode.parent.setChecked(true);
	    this.serviceChecked(inNode.parent);
	} 

	/* If there are no checked children for the parent, uncheck the parent */
	 */
	else if (!inNode.getChecked() && dojo.every(inNode.parent.kids, function(node) {return !node.getChecked();})) {
	    inNode.parent.setChecked(false);
	    this.serviceChecked(inNode.parent);
	}

	/* Update the import button's disabled state based on the new selections */
	this.updateImportDisabled();
    },

    /* Update the import button's disabled state based on the new selections */
    updateImportDisabled: function() {
	var disabled = true;
	
	/* If there are any tree nodes that contain data, and the data doesn't contain an operations object, then its an operation rather than a service.
	 * If there is an operation that is checked, then we don't need to disable the button */
	this.tree.forEachNode(dojo.hitch(this, function(node) {
	    if (node.data && !wm.isEmpty(node.data) && node.data.operations === undefined && node.getChecked())
		disabled = false;
	}));
	this.importButton.setDisabled(disabled);
    },
    cancelClick: function() {
	this.owner.owner.hide();
    },
    importClick: function() {
	var user = this.userInput.getDataValue();
	var pass = this.passInput.getDataValue();
	var host = this.importHost.getDataValue();
	var port = this.importPort.getDataValue();
	var domain = this.domainEditor.getDataValue();

	var services = {};
	var firstServiceName;
	/* Find the first selected service; at this time, we can only handle a single service at a time */
	this.tree.forEachNode(dojo.hitch(this, function(node) {
	    if (node.data && node.data.operations !== undefined && node.getChecked()) {
		services[node.data.name] = [];
		if (!firstServiceName)
		    firstServiceName = node.data.name;
	    }
	}));

	/* Find all selected operations and add them to the import request; note that we are traversing the entire tree in
	 * hopes of some day supporting import of multiple services, so hopefully there is no way for the user to select
	 * any operations that are not in the selected service...
	 */
	this.tree.forEachNode(dojo.hitch(this, function(node) {
	    if (node.data && !wm.isEmpty(node.data) && node.data.operations === undefined && node.getChecked())
		services[node.parent.data.name].push(node.data.name);
	}));

	/* Generate the request parameters */
	var loginInfo = {};
	loginInfo.host = host;
	loginInfo.port = port;
	loginInfo.userName = user;
	loginInfo.password = pass;
	loginInfo.miscInfo = domain;
	loginInfo.partnerName = "asteria";

	/* Call the import service; onSuccess calls importOperationsSuccess; onError calls importOperationsError */
	var d = this.operationListService.requestAsync("importOperations", [loginInfo, firstServiceName, services[firstServiceName]],
						  dojo.hitch(this, "importOperationsSuccess"),
						  dojo.hitch(this, "importOperationsError"));
    },

    /* After successfully importing services, update studio's services tree */
    importOperationsSuccess: function() {
	studio.updateServices();
	studio.application.loadServerComponents();
	studio.refreshServiceTree(); 
	app.toastSuccess(this.getDictionaryItem("TOAST_IMPORT_SUCCESS"));
	this.owner.owner.hide();
    },

    /* After failing to import services, toast the user's good health and willingness to try again */
    importOperationsError: function(inError) {
	app.toastError(inError.message);
    },

    /* Does nothing; its here just to make sure we don't end with a comma, and is used if your editing this
     * page in studio to find the place to add new event handlers */
    _end: 0
});
