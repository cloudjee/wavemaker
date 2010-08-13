/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
dojo.provide("wm.studio.pages.LiveViewEditor.LiveViewEditor");


wm.forAllEditors = function(inParent, inFn) {
	var ws = inParent.widgets;
	for (var en in ws) {
		var e = ws[en];
		if (e instanceof wm.Editor) {
			inFn(e);
		} else if (e instanceof wm.Container) {
			wm.forAllEditors(e, inFn);
		}
	}
}

dojo.declare("LiveViewEditor", wm.Page, {
	start: function() {
		this.clearFieldForm();
	},
	setLiveView: function(inLiveView) {
		this.clientLiveView = inLiveView;
		this.liveVariable.setLiveView(this.clientLiveView);
		this.update();
	},
	update: function() {
		// FIXME: grrr
		this.liveVariable.owner = studio.wip;
		this.nameEdit.beginEditUpdate();
		this.nameEdit.setDataValue((this.clientLiveView || 0).name);
		var noView = Boolean(!this.clientLiveView);
		this.nameEdit.setDisabled(noView);
		this.nameEdit.endEditUpdate();
		if (noView) {
			this.previewBox.setChecked(false);
			this.dataGrid1.doClearColumns();
			
		}
		this.previewBox.setDisabled(noView);
		this.dataGrid1.setDataSet(this.liveVariable);
		this.tree1.clear();
		var t = (this.liveVariable.type || "").split(".").pop();
		if (t) {
			var node = new wm.TreeNode(this.tree1.root, {
				content: t,
				image: "images/index.png",
				hasChildren: true
			});
			this.schemaToNode(node, wm.typeManager.getTypeSchema(this.liveVariable.type));
		}
		this.clearFieldForm();
		this.runtimeServiceFetch();
	},
	accept: function() {
		if (this.clientLiveView) {
			this.clientLiveView.setProp("name", this.nameEdit.getDataValue());
			this.clientLiveView.setFields(this.listRelated(), this.listFields());
			this.clientLiveView.viewChanged();
		}
	},
	//
	// Utility
	//
	addFieldToView: function(inFieldInfo) {
		this.liveVariable.liveView.view.push(inFieldInfo);
		return inFieldInfo;
	},
	removeFieldFromView: function(inFieldInfo) {
		var view = this.liveVariable.liveView.view;
		if (inFieldInfo) {
			for (var i = 0,v; (v=view[i]); i++)
				if (v.dataIndex == inFieldInfo.dataIndex) {
					view.splice(i, 1);
					return;
				}
		}
	},
	findFieldInView: function(inField) {
		for (var i=0, v; (v=this.liveVariable.liveView.view[i]); i++) {
			if (v.dataIndex == inField)
				return v;
		}
		return null;
	},
	findFieldInRelated: function(inField) {
		for (var i=0, r; (r=this.liveVariable.liveView.related[i]); i++) {
			if (r == inField)
				return r;
		}
		return null;
	},
	getFullName: function(inNode) {
		var node = inNode, name = [];
		while (node && node.parent != node.tree.root) {
			name.unshift(node.name);
			node = node.parent;
		}
		return name.join(".");
	},
	//
	// Tree Population
	//
	tree1Initchildren: function(inSender, inNode) {
		if (inNode.hasChildren)
			this.schemaToNode(inNode, inNode.schema);
	},
	// populate a node with filtered property information
	_schemaToNode: function(inNode, inSchema, inAllow) {
		var s, st, ti, ts = [];
		// show all simple properties
		for (var i in inSchema) {
			s = inSchema[i];
			st = wm.typeManager.isStructuredType(s.type);
			if (inAllow(st, s))
				ts.push({name: i, info: s});
		}
		ts.sort(function(a, b) {
			//return wm.compareStrings(a.name, b.name);
			return (a.info.fieldOrder - b.info.fieldOrder);
		});
		for (i=0; (ti=ts[i]); i++) {
			this.typeInfoToNode(inNode, ti.name, ti.info);
		}
	},
	// populate a node with property information
	schemaToNode: function(inNode, inSchema) {
		var s, ti;
		// show all simple properties
		this._schemaToNode(inNode, inSchema, function(st) { return !st; });
		// show all (non-list) structured properties
		this._schemaToNode(inNode, inSchema, function(st, s) { return st && !s.isList; });
		// show all list properties
		this._schemaToNode(inNode, inSchema, function(st, s) { return st && s.isList; });
	},
	checkAncestors: function(inNode) {
		var n = inNode.parent;
			while (n) {
				if (n.setChecked)
					n.setChecked(true);
				n = n.parent;
			}
	},
	addRemoveNode: function(inNode) {
		var
			n = inNode.fullName,
			f = n ? this.findFieldInView(n) : null;
		if (inNode.getChecked()) {
			// If we are checked, make sure all ancestor nodes are also checked
			this.checkAncestors(inNode);
			// make sure we are in the view
			if (inNode.canAddField && !f)
				this.addFieldToView(this.populateField({}, inNode));
		} else if (f)
			this.removeFieldFromView(f);
	},
	leafChecked: function(inNode) {
		this.addRemoveNode(inNode);
		if (inNode.hasChildren && inNode instanceof wm.TreeCheckNode )
			this.checkChildren(inNode, inNode.getChecked());
		if (inNode instanceof wm.TreeCheckNode && inNode.getChecked())
			inNode.tree._select(inNode);
		this.fieldToForm(inNode);
	},
	_checkChildren: function(inNode, inCheck) {
		inNode.setOpen(true);
		// check / uncheck all children
		dojo.forEach(inNode.kids, function(n) {
			if (n instanceof wm.TreeCheckNode) {
				if (n.hasChildren) {
					if (n.getChecked() && !inCheck) {
						n.setChecked(inCheck);
						this.addRemoveNode(n);
						this._checkChildren(n, inCheck);
					}
				} else {
					n.setChecked(inCheck);
					this.addRemoveNode(n);
				}
			}
		}, this);
	},
	checkChildren: function(inNode, inCheck) {
	    if (!inCheck) {
                app.confirm("Are you sure you want to deselect all properties in this object?", false,
                            dojo.hitch(this, function() {
		                this._checkChildren(inNode, inCheck);
		                this.runtimeServiceFetch();
		                this.accept();
                            }));                                
	    } else {
                this._checkChildren(inNode, inCheck);
            }
        },


	allChildrenChecked: function(inNode) {
		inNode.setOpen(true);
		// check if all children are checked
		for (var i=0, kids = inNode.kids, n; (n=kids[i]); i++) {
			if (n instanceof wm.TreeCheckNode && !n.hasChildren)
				if (!n.getChecked())
					return;
		}
		return true;
	},
	// create a node from type information
	typeInfoToNode: function(inNode, inName, inTypeInfo) {
		var n = this.getFullName(inNode);
		n = n ? n + "." + inName : inName;
		var
			isList = inTypeInfo.isList,
			s = wm.typeManager.getTypeSchema(inTypeInfo.type),
			isInView = this.findFieldInView(n),
			isRelated = this.findFieldInRelated(n),
			// show that a field is required for data input.
			// FIXME: exclude currently indicates an autoGenerated pk which means
			// we don't need to indicate this to the user as a required field. =(
			showRequired = !isList && inTypeInfo.required && !inTypeInfo.exclude.length,
			image = inTypeInfo.isList ? "index.png" : (s ? "link.png" : ""),
			ctor = wm.TreeCheckNode;
		var node = new ctor(inNode, { 
			content: inName + (showRequired ? ' <span class="wmeditor-required">*</span>' : ''), 
			as: wm.decapitalize(inName),
			image: image ? "images/" + image : "",
			name: inName,
			caption: inName,
			fullName: n,
			schema: s,
			isList: isList,
			type: inTypeInfo.type,
			displayType: wm.getPrimitiveDisplayType(inTypeInfo.type),
			required: inTypeInfo.required,
			nodeOrder: inTypeInfo.fieldOrder, //xxx
			checked: isInView || isRelated,
			canAddField: !s,
			hasChildren: Boolean(s),
			closed: !isRelated
		});
	},
	//
	// UI to Data
	//
	listRelated: function() {
		var h = [], self = this;
		this.tree1.forEachNode(function(k) {
			if (k.schema && k.getChecked && k.getChecked()) {
				h.push(self.getFullName(k));
			}
		});
		return h;
	},
	listNodeFields: function(inNode, ioFields) {
		dojo.forEach(inNode.kids, function(node) {
			if (node.getChecked && node.getChecked() && !node.schema) {
				var f = this.findFieldInView(node.fullName) || {};
				// popuplate defaults
				ioFields.push(this.populateField(f, node));
			}
		}, this);
		dojo.forEach(inNode.kids, function(node) {
			this.listNodeFields(node, ioFields);
		}, this);
		return ioFields;
	},
	listFields: function() {
		return this.listNodeFields(this.tree1.root, []);
	},
	setViewFieldProp: function(inViewField, inProperty, inValue) {
		if (inViewField && inProperty)
			inViewField[inProperty] = inValue;
	},
	editorPropertyMap: {
		captionEdit: {name: "caption", defaultValue: "n/a"},
		//orderEdit: {name: "order", defaultValue: ""},
		typeEdit: {name: "displayType", defaultValue: "Text"},
		autoSizeBox: {name: "autoSize", defaultValue: false},
		widthEdit: {name: "width", defaultValue: ""},
		widthUnitsEdit: {name: "widthUnits", defaultValue: "px"},
		requiredBox: {name: "required", defaultValue: true},
		orderEdit: {name: "order"},
		/*,

		includedListsBox: {name: "includeLists", defaultValue: true},
		includedFormsBox: {name: "includeForms", defaultValue: true}*/
	},
	//
	// Field Details
	//
	clearFieldForm: function() {
		this.viewField = null;
		wm.forAllEditors(this.liveForm1, 
			function(e) {
				e.setDisabled(true);
				e.setValue("dataValue", "");
			});
		this.fieldLabel.setValue("caption", "Field Options");
	},
	populateField: function(inField, inNode) {
		var f = inField, node = inNode;
		f.caption = f.caption || wm.capitalize(node.name);
		f.sortable = "sortable" in f ? f.sortable : true;
		f.dataIndex = "dataIndex" in f ? f.dataIndex : this.getFullName(node);
		f.type = f.type || node.type;
		f.displayType = f.displayType || node.displayType;
		f.required = "required" in f ? f.required : node.required;
		f.widthUnits = f.widthUnits || "px";
		f.includeLists = "includeLists" in f ? f.includeLists : true;
		f.includeForms = "includeForms" in f ? f.includeForms : true;
		f.order = inNode.nodeOrder; //xxx
		return f;
	},
	fieldToForm: function(inNode) {
		this.clearFieldForm();
		if (inNode.fullName) {
			this.fieldLabel.setValue("caption", 'Options for "' + inNode.name + '"');
			//
			var v = this.findFieldInView(inNode.fullName);
			this.viewField = v;
			if (v) {
				wm.forAllEditors(this.liveForm1, dojo.hitch(this, function(e) {
					e.setDisabled(false);
					var field = this.editorPropertyMap[e.id];
					if (field) {
						var
							n = field.name,
							defaultValue = n in inNode ? inNode[n] : field.defaultValue;
						e.beginEditUpdate();
						e.setValue("dataValue", v[n] !== undefined ? v[n] : defaultValue);
						e.endEditUpdate();
					}
				}));
			}
		}
	},
	//
	// UI Actions
	//
	previewBoxChange: function(inSender, inDisplayValue, inDataValue) {
		// careful, this is a designtime only function
		this.dataGrid1.doClearColumns();
		if (inSender.getChecked()) {
			this.previewPanel.setHeight("186px");
			this.dataGrid1.doClearColumns();
			this.dataGrid1.setShowing(true);
			setTimeout(dojo.hitch(this, "runtimeServiceFetch"), 1);
		} else {
			this.dataGrid1.setShowing(false);
			this.previewPanel.setHeight("30px");
		}
	},
	tree1DblClick: function(inSender, inNode) {
		if (inNode.hasChildren) {
			var c = true;
			if (inNode instanceof wm.TreeCheckNode) {
				c = inNode.getChecked();
				inNode.setChecked(!c);
			} else
				c = this.allChildrenChecked(inNode);
			this.checkChildren(inNode, !c);
		}
	},
	tree1Checkboxclick: function(inSender, inNode) {
		// Update form
		//this.fieldToForm(inNode);
		// If we are checked, make sure all ancestor nodes are also checked
		this.leafChecked(inNode);
		// update preview
		this.runtimeServiceFetch();
		this.accept();
	},
	fieldEditorChanged: function(inSender, inDisplayValue, inDataValue) {
		if (!this.viewField)
			return;
		var f = this.editorPropertyMap[inSender.id];
		if (f) {
			var changed = this.viewField[f.name] != inDataValue;
			this.setViewFieldProp(this.viewField, f.name, inDataValue);
			if (changed) {
				this.runtimeServiceFetch();
				this.accept();
			}
		}
	},
	nameEditChanged: function() {
		this.accept();
	},
	//
	// Preview
	//
	runtimeServiceFetch: function() {
		if (this.previewBox.getChecked()) {
			var d = this.liveVariable;
			d.maxResults = d.designMaxResults = 10;
			d.liveView.setFields(this.listRelated(), this.listFields());
			d.update();
		}
	},
	updateSuccess: function() {
		if (this.previewBox.getChecked()) {
			// careful, this is a designtime only function
			this.dataGrid1.doClearColumns();
			this.dataGrid1.setDataSet(this.liveVariable);
		}
	},
	tree1Select: function(inSender, inNode) {
		this.fieldToForm(inNode);
	},
	saveLiveViewBtnClick: function(inSender) {
		studio.refreshWidgetsTree();
		studio.selected = null;
		studio.select(this.clientLiveView);
		studio.project.saveProject();
	},
	delLiveViewBtnClick: function(inSender) {
		var v = this.clientLiveView;
	        if (v) {
                    app.confirm(["Are you sure you want to delete ", v.name, "?"].join(''), false,
                                dojo.hitch(this, function() {
			            this.liveVariable.setLiveView(null);
			            v.destroy();
			            this.update();
			            studio.refreshDesignTrees();
			            if (studio.page.root)
				        studio.select(studio.page.root);
			            studio.navGotoDesignerClick();
		                    studio.project.saveProject();
                                }));
		}
	}
});
