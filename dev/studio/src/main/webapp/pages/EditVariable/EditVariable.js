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
 

dojo.declare("EditVariable", wm.Page, {
    i18n:true,
    start: function() {

	this.helpButton = new wm.ToolButton({_classes: {domNode: ["StudioHelpIcon"]},
					     width: "20px",
					     height: "20px",
					     parent: this.owner.owner.titleBar,
					     onclick: dojo.hitch(this, function() {
	studio.inspector.inspector._inspectors.Properties.beginHelp("json", this.helpButton.domNode, "wm.Variable");
						 studio.helpPopup.corner = "tr";
						 studio.helpPopup.renderBounds();
					     })
					    });
	this.owner.owner.titleBar.reflow();

    },
    onGuiShow: function() {
	this.reset(this.variable);
    },
    reset: function(inVariable) {
	this.guiLayer.activate();
	this.variable = inVariable;
	if (!this.variable) return;
	this.tree.clear();
	this.text.setDataValue("");
	this.tree.root.data = {variable: inVariable,
			       isList: inVariable.isList,
			       type: inVariable.type,
			       field: inVariable.type,
			       name: ""};
	if (inVariable.isList) {
	    this.addArrayNodes(this.variable, wm.typeManager.getType(this.variable.type), this.tree.root);
	} else {
	    this.generateNodes(this.variable, this.tree.root);
	}
	this.treeSelect();
    },
    generateNodes: function(inVariable, inNode) {
	    var fields = this.getFields(inVariable.type);
	    for(var fieldName in fields) {		
		this.addTreeNode(inVariable, fields[fieldName], fieldName,inNode);
	    }
    },
	    addArrayNodes: function(inVariable, inField, inNode) {
		var count = inVariable.getCount();
		if (count == 0) {
		    inVariable.addItem({});
		    count = 1;
		}
		for (var i = 0; i < count; i++) {
		    this.addArrayNode(inVariable.getItem(i), inField, inNode);
		}
	    },
    addArrayNode: function(inVariable, inField, inNode) {
	    new wm.TreeNode(inNode, 
			    {closed: true,
			     data: {type: inVariable.type,
				    field: inField,
				    variable: inVariable,
				    name: "",
				    isList: false},
			     hasChildren: true,
			     content: "Item " + inNode.kids.length,
			     initNodeChildren: dojo.hitch(this, function(inChildNode) {
				 this.generateNodes(inVariable, inChildNode);
			     })
			    });

    },
    addTreeNode: function(inVariable, inField, inFieldName, inNode) {
	if (inField.isList) {
	    new wm.TreeNode(inNode, 
			    {closed: true,
			     data: {type: inField.type,
				    variable: inVariable.getValue(inFieldName),
				    field: inField,
				    name: inFieldName,
				    isList: true},
			     hasChildren: true,
			     content: inFieldName,
			     initNodeChildren: dojo.hitch(this, function(inChildNode) {
				 this.addArrayNodes(inVariable.getValue(inFieldName), inField, inChildNode);
			     })
			    });
	} else if (!wm.typeManager.isStructuredType(inField.type)) {
	    var textNode = 
	    new wm.TreeTextNode(inNode, 
				{value: inVariable.getValue(inFieldName),
				 data: {type: inField.type,
					field: inField,
					variable: inVariable, 
					name: inFieldName,
					isList: false},				 
				 content: inFieldName,
				 onChange: function() {
				     wm.onidle(window, function() {
					 var value = textNode.getValue();
					 inVariable.setValue(inFieldName, value);
				     });
				 }
				});
	} else {
	    new wm.TreeNode(inNode, 
			    {closed: true,
			     data: {type: inField.type,
				    field: inField,
				    variable: inVariable.getValue(inFieldName),
				    name: inFieldName,
				    isList: false},
			     hasChildren: true,
			     content: inFieldName,
			     initNodeChildren: dojo.hitch(this, function(inChildNode) {
				 this.generateNodes(inChildNode.data.variable, inChildNode);
			     })
			    });
	}
    },
    getFields: function(inType) {
	var type = wm.typeManager.getType(inType);
	if (type) {
	    var fields = type.fields;
	    return fields;
	}
	if (!inType || inType == "wm.Variable") {
	    app.toastError(this.getDictionaryItem("NO_TYPE"));
	    this.owner.owner.hide();
	} else if (!type) {
	    app.toastError(this.getDictionaryItem("INVALID_TYPE"));
	    this.owner.owner.hide();
	}
    },
    cancelClick: function() {
	this.variable.setJson(this.variable.json); // reset its data
	this.owner.owner.hide();
    },
    okClick: function() {
	//this.writeData(this.tree.root, this.variable);
	if (this.guiLayer.isActive())
	    this.variable.json = dojo.toJson(this.variable.getData());
	else
	    this.variable.setJson(this.text.getDataValue());
	this.owner.owner.hide();
    },
    writeData: function(inNode, inVariable) {
	var data = inNode.data;
	if (data.isList) {
	    for (var i = 0; i < inNode.kids.length; i++) {
		var subVariable = data.name ? inVariable.getValue(data.name) : inVariable;
		if (!subVariable.isList)
		    subVariable.setIsList(true);
		if (subVariable.getCount() <= i)
		    subVariable.addItem({});
		this.writeData(inNode.kids[i], subVariable.getItem(i));
	    }
	} else if (!wm.typeManager.isStructuredType(data.type)) {
	    inVariable.setValue(data.name, inNode.getValue());
	} else {
	    for (var i = 0; i < inNode.kids.length; i++) {
		this.writeData(inNode.kids[i], data.name ? inVariable.getValue(data.name) : inVariable);
	    }
	}
    },
    addButtonClick: function() {
	var selected = this.tree.selected || this.tree.root;
	var data = selected.data;
	if (selected.data.isList) {
	    selected.setOpen(true);
	    data.variable.addItem({});
	    this.addArrayNode(data.variable.getItem(data.variable.getCount()-1), data.field, selected);
	} else if (wm.typeManager.isStructuredType(data.type)) {
	    if (selected.kids.length == 0) {
		this.addTreeNode(data.variable.getValue(data.name), data.field, data.name, selected);
	    }
	    selected.kids[0].setOpen(true);
	}
    },
    deleteButtonClick: function() {
	var selected = this.tree.selected;
	var data = selected.data;
	if (selected.parent.data.isList) {
	    selected.parent.data.variable.removeItem(selected.parent._findIndexInParent(selected));
	    selected.destroy();
	    this.treeSelect();
	} else if (wm.typeManager.isStructuredType(data.type)) {
	    selected.parent.data.variable.setValue(data.name, null);
	    selected.setOpen(false);
	    selected.removeChildren();
	    selected._childrenRendered = false;
	    selected.styleNode();
	} else {
	    selected.setValue("");
	}
    },
    treeSelect: function() {
	wm.onidle(this, function() {
	var selected = this.tree.selected;
	if (!selected) {
	    this.AddButton.setDisabled(!this.variable.isList);
	    this.DeleteButton.setDisabled(true);
	} else {
	    var data = selected.data;
	    this.AddButton.setDisabled(!selected.data.isList); // can only add if the node itself is a list
	    this.DeleteButton.setDisabled(!selected.parent.data.isList && !wm.typeManager.isStructuredType(data.type)); // can only delete if the node's parent is a list, or if its an object
	}
	});
    },
    updateText: function() {
	this.text.setDataValue(dojo.toJson(this.variable.getData(), true));
    },
    onAceChange: function(inSender,inText) {
	if (inSender.isAncestorHidden())
	    return;
	try {
	    var data = dojo.fromJson(inText);
	    if (data && typeof data == "object") {
		this.variable.setData(data);
	    }
	} catch(e) {}
    },
    _end: 0
});