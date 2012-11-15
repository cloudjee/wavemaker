/*
 * Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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
		this.populateList();
		this.treeHeader.setCaption(this.inspected.name + " Properties");
		this.populateTree();
	},
	populateTree: function() {
		this.propComponentList = studio.inspector.gatherPropComponents(this.inspected);
		this.tree.clear();
		var propsHash = this.inspected.listProperties();
		var props = [];
		for (var i in propsHash) {
			var p = propsHash[i];
			if (!p.bindSource && (p.ignore || p.hidden || p.writeonly) || p.doNotPublish) continue;

			p = dojo.mixin({
				name: i
			}, p);
			if (p.isEvent || this.inspected.isEventProp(i)) {
				p.group = "events";
				if (i.match(/\d$/)) continue; // ignore events that end in numbers; these are the "and-then" events, which are handled by the event editor
			} else if (p.method) {
                p.group = "Methods";
            } else if (p.isCustomMethod) {
				p.group = "custommethods";
			} else if (p.bindSource) {
				p.group = "Bindings";			
			} else if (!p.group) {
				p.group = "Properties";
			}
			props.push(p);
		}

		var groups = studio.inspector.buildGroups(props, false, true);
		studio.inspector.sortGroups(groups);
		for (var i = 0; i < groups.length; i++) {
            if (groups[i].name == "Methods") {
                var methods = groups[i];
                wm.Array.removeElementAt(groups, i);
                //groups.push(methods); Tried to allow publishing of functions to PageContainers, but just too many flaws for too small a feature
                break;
            }
        }
		groups.shift();
		if (this.inspected instanceof wm.Variable) {
		var node = new wm.TreeNode(this.tree.root, {
		  content: "Current Data",
		  closed: false,
		  hasChildren: true
		  });
		var fieldsRoot = this.fieldsRoot = new wm.TreeCheckNode(node, {
				content: "All Data",
				data: "",
				closed: true,
				hasChildren: false,
				checked: this.propComponentList[this.inspected.id]
			});		
		  this.generateFieldProps(fieldsRoot, this.inspected._dataSchema);
		}
		dojo.forEach(groups, dojo.hitch(this, function(group) {
			var node = new wm.TreeNode(this.tree.root, {
				content: group.displayName || group.name,
				data: group.name,
				closed: false,
				hasChildren: true
			});
			this.generateProps(node, group.props);
			this.generateSubGroups(node, group.subgroups);
		}));
	},
	populateList: function() {
		var propComponentList = wm.listComponents([studio.page], wm.Property);
		var data = [];
		dojo.forEach(propComponentList, function(prop) {
            if (prop.parent) {
    			data.push({
    				name: prop.parent.getId(),
    				dataValue: prop.property.replace(/^.*\./, "")
    			});
    		} else if (prop.property.indexOf(".") != -1) {
    		  data.push({
    		      name: prop.property.substring(0,prop.property.lastIndexOf(".")),
    		      dataValue: prop.property.substring(1+prop.property.lastIndexOf("."))
    		  });
    		} else {
    			data.push({
    				name: prop.property,
    				dataValue: "All Data"
    			});    		    		
    		}

		});
		this.fullPropListVar.setDataSet(data);
	},
	listRowDeleted: function(inSender, rowId, rowData) {
		var id = rowData.name + (rowData.dataValue == "All Data" ? "" : "." + rowData.dataValue);
		var propComponentList = wm.listComponents([studio.page], wm.Property);
		dojo.forEach(propComponentList, function(inProp) {
			if (inProp.property == id) {
				inProp.destroy();
			}
		});
		wm.job(this.getRuntimeId() + ".repopulate", 100, this, function() {
    		this.onChange();
    		this.populateTree();
    	});
	},
	generateFieldProps: function(inNode, inSchema) {
	   wm.forEachProperty(inSchema, dojo.hitch(this, function(inPropDef, inPropName) {
    	   new wm.TreeCheckNode(inNode, {
    				content:inPropName,
    				data: inPropName,
    				closed: true,
    				hasChildren: false,
    				checked: this.propComponentList[this.inspected.id + "." + inPropName] && this.propComponentList[this.inspected.id + "." + inPropName].isDataField
    			});
	   
	   }));
	
	},
	generateProps: function(inNode, inProps) {
		dojo.forEach(inProps, dojo.hitch(this, function(prop) {
			new wm.TreeCheckNode(inNode, {
				content: prop.displayName || prop.name,
				data: prop.name,
				closed: true,
				hasChildren: false,
				checked: this.propComponentList[this.inspected.id + "." + prop.name] && !this.propComponentList[this.inspected.id + "." + prop.name].isDataField
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
	calcName: function(inPropName) {
		var isEvent = inPropName.match(/^on/);
		var name = (isEvent ? "on" + wm.capitalize(this.inspected.getId()) : this.inspected.getId()) + wm.capitalize(inPropName.replace(/^on/, ""));
		return name;
	},
	checkboxChange: function(inSender, inNode, inEvent) {
		var name = this.calcName(inNode.data);

		var property = inNode.data ? this.inspected.getId() + "." + inNode.data : this.inspected.getId();
		var propDef = inNode.data ? this.inspected.listProperties()[inNode.data] : undefined;
		if (inNode.getChecked()) {
			if (!this.propComponentList[property]) {
				var p = this.propComponentList[property] = new wm.Property({
					owner: studio.page,
					ignore: this.inspected instanceof wm.ServiceVariable,
					name: name + (!inNode.data ? "Data" : "")
				});
				p.selectProperty(property);
                if (!propDef || inNode.parent == this.fieldsRoot) {
                    p.isDataField = inNode.parent == this.fieldsRoot;
                    p.bindSource = true;
                    /* Owner might set the data of a wm.Variable, but only the server/service sets the value of a servicevar. */
                    p.bindTarget = this.inspected instanceof wm.Variable && 
                    
                    /* Don't expose a field in the property panel if its a field of an isList var */
                    (!this.inspected.isList || !p.isDataField) && 
                    
                    /* Don't let the owner set the data of a servicevar, only the server/service should do that */
                    this.inspected instanceof wm.ServiceVariable === false;
				} else if (!p.isEvent) {
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