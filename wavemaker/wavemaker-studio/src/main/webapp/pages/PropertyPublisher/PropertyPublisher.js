/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
		if(this.inspected instanceof wm.Variable) {
			var node = new wm.TreeNode(this.tree.root, {
				content: "Current Data",
				closed: false,
				hasChildren: true
			});
			var fieldsRoot = this.fieldsRoot = new wm.TreeCheckNode(node, {
				content: this.getNodeCaption("All Data", this.propComponentList[this.inspected.id] ? this.propComponentList[this.inspected.id].name : ""),
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
    				widgetName: prop.parent.getId(),
    				widgetPropertyName: prop.property.replace(/^.*\./, "")
    			});
    		} else if (prop.property.indexOf(".") != -1) {
    		  data.push({
    		      widgetName: prop.property.substring(0,prop.property.lastIndexOf(".")),
    		      widgetPropertyName: prop.property.substring(1+prop.property.lastIndexOf("."))
    		  });
    		} else {
    			data.push({
    				widgetName: prop.property,
    				widgetPropertyName: "All Data"
    			});
    		}
    		dojo.mixin(data[data.length-1], {
    			wmPropertyName: prop.name,
    			groupName: prop.group,
    			groupOrder: prop.order});
		});
		this.fullPropListVar.setDataSet(data);
	},
	listRowDeleted: function(inSender, rowId, rowData) {
		var wmpropname = rowData.wmPropertyName;
		var wmprop = this.inspected.owner[wmpropname];
		wmprop.destroy();
		/*
		var id = rowData.widgetName + (rowData.widgetPropertyName == "All Data" ? "" : "." + rowData.widgetPropertyName);
		var propComponentList = wm.listComponents([studio.page], wm.Property);
		dojo.forEach(propComponentList, function(inProp) {
			if (inProp.property == id) {
				inProp.destroy();
			}
		});
*/
		wm.job(this.getRuntimeId() + ".repopulate", 100, this, function() {
    		this.onChange();
    		this.populateTree();
    	});
	},
	onPropCellEdited: function(inSender, inValue, rowId, fieldId, isInvalid) {
		if (!isInvalid) {
			var rowData = inSender.getRow(rowId);
			var wmpropname = rowData.wmPropertyName;
			var wmprop = this.inspected.owner[wmpropname];
			switch(fieldId) {
				case "groupName":
					wmprop.group = inValue;
					break;
				case "groupOrder":
					wmprop.order = inValue;
					break;
			}
		}
	},
	generateFieldProps: function(inNode, inSchema) {
	   wm.forEachProperty(inSchema, dojo.hitch(this, function(inPropDef, inPropName) {
            var propertyComponent = this.propComponentList[this.inspected.id + "." + inPropName];
            if (propertyComponent && !propertyComponent.isDataField) propertyComponent = undefined;
    	   new wm.TreeCheckNode(inNode, {
    				content:this.getNodeCaption(inPropName, propertyComponent ? propertyComponent.name : ""),
    				data: inPropName,
    				closed: true,
    				hasChildren: false,
    				checked: Boolean(propertyComponent)
    			});

	   }));

	},
	generateProps: function(inNode, inProps) {
		dojo.forEach(inProps, dojo.hitch(this, function(prop) {
            var propertyComponent = this.propComponentList[this.inspected.id + "." + prop.name];
            if (propertyComponent && propertyComponent.isDataField) propertyComponent = undefined;
			new wm.TreeCheckNode(inNode, {
				content: this.getNodeCaption(prop.displayName || prop.name, propertyComponent ? propertyComponent.name : ""),
				data: prop.name,
				closed: true,
				hasChildren: false,
				checked: Boolean(propertyComponent)
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
					ignore: this.inspected instanceof wm.ServiceVariable && property.indexOf(".") == -1,
					name: name + (!inNode.data ? "Data" : "")
				});
				p.selectProperty(property);
				if (propDef && propDef.publishWithProps) {
				    dojo.forEach(propDef.publishWithProps, function(propName) {
				        var property = this.inspected.getId() + "." + propName;
				        if (!this.propComponentList[property]) {
               				var p2 = this.propComponentList[property] = new wm.Property({
            					owner: studio.page,
            					name: this.calcName(propName)
            				});
            				p2.selectProperty(property);

            		    }
				    }, this);
				}

                /* This whole block appears redundant with code in Property_design, except for the fieldsRoot test */
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
					p.bindSource = propDef.bindable || propDef.bindSource || false;
					p.bindTarget = propDef.bindable || propDef.bindTarget || false;
				}
				inNode.setContent(this.getNodeCaption(inNode.data, p.name));
			}
		} else {
			if (this.propComponentList[property]) {
				this.propComponentList[property].destroy();
				delete this.propComponentList[property];
                inNode.setContent(inNode.data);
			}
			if (propDef && propDef.publishWithProps) {
				dojo.forEach(propDef.publishWithProps, function(propName) {
    				var property = this.inspected.getId() + "." + propName;
				    if (this.propComponentList[property]) {
				        this.propComponentList[property].destroy();
        				delete this.propComponentList[property];
        			}
        		}, this);
        	}
		}
		this.onChange();
	},
    propertySelect: function(inSender, inNode) {
        if (inNode.getChecked && inNode.getChecked()) {
            var propertyId = inNode.data ? this.inspected.getId() + "." + inNode.data : this.inspected.getId();
            var propertyComponent = this.propComponentList[propertyId];
            var name;
            if (propertyComponent) {
                name = propertyComponent.name;
            } else {
                name = this.calcName(inNode.data);
                if (!inNode.data) name += "Data";
            }
            app.prompt("Pick a name for this property (what the user using your page/composite will see)", name, dojo.hitch(this,"onPropertyRename", inNode));
        }
    },
    onPropertyRename: function(inNode, inValue) {
        var propertyId = inNode.data ? this.inspected.getId() + "." + inNode.data : this.inspected.getId();
        var propertyComponent = this.propComponentList[propertyId];
        propertyComponent.set_name(inValue);
        inNode.setContent(this.getNodeCaption(inNode.data, propertyComponent.name));
        this.onChange();
    },
    getNodeCaption: function(inFieldName, inPropertyName) {
        if (inPropertyName) {
            return inFieldName + " <i>(" + inPropertyName + ")</i>";
        } else {
            return inFieldName;
        }
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