/*
 * Copyright (C) 2011 VMware, Inc. All rights reserved.
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
 

dojo.declare("PropertyPublisher", wm.Page, {
    i18n: true,
    inspected: null,
    start: function() {

    },
    reset: function(inComponent) {
	this.inspected = inComponent;
	this.tree.clear();
	this.populateList();
	this.propComponentList = studio.inspector.gatherPropComponents(inComponent);
	this.treeHeader.setCaption(this.inspected.name + " Properties");
	var propsHash = this.inspected.listProperties();
	var props = [];
	 for (var i in propsHash) {
	     var p = propsHash[i];
	     if (p.ignore || p.hidden || p.writeonly || p.doNotPublish)
		 continue;
	     
	     p = dojo.mixin({name: i},p);
	     if (p.isEvent || inComponent.isEventProp(i)) {
		 p.group = "events";
		 if (i.match(/\d$/)) 
		     continue; // ignore events that end in numbers; these are the "and-then" events, which are handled by the event editor
	     } else if (p.isCustomMethod) {
		 p.group = "custommethods";
	     } else if (!p.group) {
		 p.group = "Properties";
	     }
	     props.push(p);
	 }

	var groups = studio.inspector.buildGroups(props, true);
	studio.inspector.sortGroups(groups);
	// remove required group
	groups.shift();
	dojo.forEach(groups, dojo.hitch(this, function(group) {
	    var node = new wm.TreeNode(this.tree.root, 
				       {content: group.displayName || group.name,
					data: group.name,
					closed: false,
					hasChildren: true});
	    this.generateProps(node, group.props);
	    this.generateSubGroups(node, group.subgroups);
	}));
    },
    populateList: function() {
	var propComponentList = wm.listComponents([studio.page], wm.Property);
	var data = [];
	dojo.forEach(propComponentList, function(prop) {
	    data.push({name: prop.parent.getId(),
		       dataValue: prop.property.replace(/^.*\./,"")});

	});
	this.fullPropListVar.setDataSet(data);
    },
    listRowDeleted: function(inSender, rowId, rowData) {
	var id = rowData.name + "." + rowData.dataValue;
	var propComponentList = wm.listComponents([studio.page], wm.Property);
	dojo.forEach(propComponentList, function(inProp) {
	    if (inProp.property == id) {
		inProp.destroy();
	    }
	});
	this.onChange();
    },
    generateProps: function(inNode, inProps) {
	dojo.forEach(inProps, dojo.hitch(this, function(prop) {
	    new wm.TreeCheckNode(inNode, {
		content: prop.displayName || prop.name,
		data: prop.name,
		closed: true,
		hasChildren: false,
		checked: this.propComponentList[this.inspected.getId() + "." + prop.name]
	    });
	}));
    },
    generateSubGroups: function(inNode, inGroups) {
	dojo.forEach(inGroups, dojo.hitch(this, function(group) {
	    var node = new wm.TreeNode(inNode, {
		content: group.displayName || group.name,
		data: group.name,
		closed: false,
		hasChildren: true
	    });
	    this.generateProps(node, group.props);
	}));
    },
    checkboxChange: function(inSender, inNode, inEvent) {
	var property = this.inspected.getId() + "." + inNode.data;
	var propDef = this.inspected.listProperties()[inNode.data];
	if (inNode.getChecked()) {
	    if (!this.propComponentList[property]) {
		var p = this.propComponentList[property] = new wm.Property({owner: studio.page,
									    name: wm.camelcase(property)});
		p.selectProperty(property);
		if (!p.isEvent) {
		    p.bindSource = propDef.bindable || propDef.bindSource;
		    p.bindTarget = propDef.bindable || propDef.bindTarget;
		}
	    }
	} else {
	    if (this.propComponentList[property]) {
		this.propComponentList[property].destroy();
		delete this.propComponentList[property];
	    }
	}
	this.onChange();
    },
    onChange: function() {
	studio.refreshDesignTrees();
	studio.reinspect(true);
	this.populateList();
    },
    okClick: function(inSender) {
	this.owner.owner.hide();
    },
    _end: 0
});