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
dojo.provide("wm.studio.app.inspector.BindInspector");
dojo.require("wm.studio.app.inspector.Inspector");
dojo.require("wm.studio.app.binding");
dojo.require('wm.base.lib.data');

dojo.declare("wm.BindInspector", wm.GroupInspector, {
	colCount: 3,
	init: function() {
		this.inherited(arguments);
		studio.bindDialog = this.getBindDialog();
	},
	getProps: function(inInspectorProps) {
		var props = this.inherited(arguments);
		for (var i in props)
			if (props[i].isEvent)
				delete props[i];
		return props;
	},
	inspect: function() {
		this.inherited(arguments);
		studio.bindDialog.page.initBinding();
	},
	getBindDialog: function() {
		if (!studio.bindDialog) {
		    var
				props = {
					owner: this,
					pageName: "BindSourceDialog",
				    border: "1px",
				    positionLocation: "tl",
				    width: "550",
				    height: "350",
				    modal: false,
				    hideControls: true,
				    title: "Binding..."
				},
				d = studio.bindDialog = new wm.PageDialog(props);
 
		    //d.setContainerOptions(true, 450, 300);
		}
		var b = studio.bindDialog;

		if (b._hideConnect)
			dojo.disconnect(b._hideConnect);
		b._hideConnect = dojo.connect(b, "onHide", this, "endBind");
		return b;
	},
	generateHeaderCells: function() {
		var r = this.inherited(arguments);
		//r.unshift('<th class="wminspector-header wminspector-binding"></th>');
		r.push('<th class="wminspector-header wminspector-binding"></th>');		
		return r;
	},
	generateRowCells: function(inName, inProp) {
		var
			n = inName,
			bindable = this.isBindable(inProp),
			wire = bindable && this.getPropWire(inProp),
			c = " wminspector-bindProp" + (bindable ? "" : "-disabled"),
			bc = wire ? " wminspector-boundProp" : "",
			b = '';
		return [
			//'<td class="wminspector-binding', c, bc, '">', b, '</td>',
			'<td class="wminspector-caption">', this.makeRowCaption(n, inProp), '</td>',
			'<td class="wminspector-property">', this.makePropEdit(n, inProp, wire), '</td>',
			'<td class="wminspector-binding', c, bc, '">', b, '</td>'
		];
	},
	shouldShowProp: function(inName, inProp) {
		return this.inherited(arguments) || this.isBindable(inProp);
	},
	canMakeDefaultPropEdit: function(inProp) {
		return !inProp.ignore;
	},
	makePropEdit: function(inName, inProp, inWire) {
		if (inWire && inWire instanceof wm.Wire)
			return this.makeBoundPropEdit(inName, inWire.source || inWire.expression)
		if (this.canMakeDefaultPropEdit(inProp)) 
			return this.inherited(arguments, [inName, inProp])
		return this.makeBindPropEdit(inName);
	},
	makeBindPropEdit: function(inName) {
		var m = "(data binding)";
		return makeInputPropEdit(inName, m, m, true);
	},
	makeBoundPropEdit: function(inName, inSource) {
		return makeBoundEdit(inName, inSource)
	},
	propClick: function(e) {
		var
			handled = this.inherited(arguments),
			propName = this.getPropNameByEvent(e);
		if (this.selectMode)
			return this.endBind(propName, e.target);
		else if (!handled && dojo.hasClass(e.target, "wminspector-bindProp"))
			return this.beginBind(propName, e.target);
		else if (dojo.hasClass(e.target, "bound-prop-button"))
			this.unbindProp(propName);
	},
	unbindProp: function(inPropName) {
		var
			b = this.getBinding(),
			tp = this.getTargetProperty(inPropName),
			w = wm.data.getPropWire(b.owner, tp);
		if (tp && w) {
			var wireOwner = w.owner;
			//wireOwner.removeWire(wireOwner.getWireId(w));
			wireOwner.removeWire(w.getWireId());
			this._setInspectedProp(tp, "");
			this._inspect();
		}
	},
	isBindable: function(inProp) {
		return inProp && (inProp.bindable || inProp.bindTarget);
	},
	getBinding: function() {
		var i = this.inspected;
		return i && i.components.binding;
	},
	getTargetProperty: function(inPropName) {
		return inPropName;
	},
	getPropWire: function(inProp) {
		var
			b = this.getBinding(),
			tp = this.getTargetProperty(inProp.name);
		return b && b.owner && wm.data.getPropWire(b.owner, tp);
	},
	getBindDialogProps: function(inPropName) {
		var
			o = this.inspected,
			tp = this.getTargetProperty(inPropName),
			prop = this.props[tp];
		if (this.isBindable(prop))
			return dojo.mixin({object: o, targetProperty: tp}, prop || {});
	},
	beginBind: function(inPropName, inNode) {
		var
			bd = studio.bindDialog,
			p = this.getBindDialogProps(inPropName),
			coords = dojo.coords(inNode);

		bd.positionLocation = (coords.y > bd.contentHeight) ? "tl" : "bl"; 
		if (p) {

			bd.page.update(p);
			// FIXME: wm.calcOffset fails for td/tr so use tr for now.
			bd.positionNode = inNode.parentNode;
			bd.show();
			return true;
		}
	},
	endBind: function(inPropName, inNode) {
		//if (this.selectMode) {
		//	studio.propertySelected(this.inspected.getRuntimeId() + "." + inPropName);
		//}
		//else
		if (this.active)
			this._inspect();
	}
	/*
	beginBind: function(inPropName, inNode) {
		// may be a different inspector that does endBind
		studio._bindTarget = this.inspected;
		var
			p = this.getBindDialogProps(inPropName);
		if (p) {
			// SJM2008
			studio.testClick(this, p, "Select binding for<br/><b>" + this.inspected.name + "." + inPropName + "</b>");
		}
	},*/
	/*
	endBind: function(inPropName, inNode) {
		//alert(inPropName);
		studio.onSelectProperty(this.inspected.getRuntimeId() + "." + inPropName);
		studio.testClick();
		// bindBind may have been performed by a different inspector
		studio.select(studio._bindTarget);
		//if (this.active)
		//	this._inspect();
	}
	*/
});

// Data inspector
dojo.declare("wm.DataInspector", wm.BindInspector, {
	constructor: function() {
		this.initNodeChildren = dojo.hitch(this, this.initNodeChildren);
	},
	preinspect: function(inInspectorProps) {
		var
			ip = inInspectorProps,
			bindToComponent = ip && ip.bindToComponent;
		// FIXME:
		// note: inspected is always the component we're inspecting
		// and ip.inspected is always the root object bding inspected
		this.bindingOwner = bindToComponent ? this.inspected : ip && studio.page.getValueById(ip.inspected);
		this.bindPrefix = ip && ip.bindPrefix;
		this.dataProp = ip && ip.dataProp ? ip.dataProp : "";
		this.inherited(arguments);
	},
	getProps: function(inInspectorProps) {
		var c = this.inspected, dp = this.dataProp;
		if (!(c instanceof wm.Variable)) {
			return {};
		}
		var props = dojo.mixin({}, this.getSchema(c, c.type, dp));
		for (var i in props) {
			props[i].name = i;
		}
		return props;
	},
	getSchema: function(inInspected, inType, inDataProp) {
		// get root type, may be custom
		var
			s = wm.typeManager.isType(inType) ? wm.typeManager.getTypeSchema(inType) : (inInspected || 0)._dataSchema;
		// if there's a dataProp, get schema for that property's type
		if (inDataProp && s) {
			var
				pi = wm.typeManager.getPropertyInfoFromSchema(s, inDataProp),
				t = (pi||0).type,
				s = wm.typeManager.getTypeSchema(t);
		}
		return s;
	},
	getRootType: function(inPropInfo) {
		var i = this.getInspected(inPropInfo);
		return (i || 0).type;
	},
	getInspected: function(inPropInfo) {
		var
			pi = inPropInfo,
			n = pi.component ? [pi.inspected, pi.component].join('.') : pi.inspected;
		return studio.page.getValueById(n);
	},
	getBinding: function() {
		var i = this.bindingOwner;
		return i && i.components.binding;
	},
	getTargetProperty: function(inPropName) {
		var
			dp = this.dataProp,
			bp = this.bindPrefix,
			p = inPropName;
		if (dp)
			p = [dp, p].join('.');
		if (bp)
			p = [bp, p].join('.');
		return p;
	},
	getBindDialogProps: function(inPropName) {
		var
			o = this.bindingOwner || this.inspected,
			tp = this.getTargetProperty(inPropName);
		return {object: o, targetProperty: tp};
	},
	isBindable: function() {
		return true;
	},
	addTreeNode: function(inParent, inInspected, inNodeProps, inInspectorProps, inNodeList) {
		this.nodeList = inNodeList;
		var np = inNodeProps;
		np.type = this.getRootType(np);
		np.dataProp = "";
		np.bindPrefix = np.bindToComponent ? "" : np.component;
		np.content = this.getNodeContent(np.content, np.type);
		return this._addTreeNode(inParent, np);
	},
	_addTreeNode: function(inParent, inProps) {
		inProps.nodeInfos = this.listNodeChildren(inProps);
		inProps._hasChildren = Boolean(inProps.nodeInfos.length);
		inProps.initNodeChildren = this.initNodeChildren;
		inProps.closed = true;
		return new wm.TreeNode(inParent, inProps);
	},
	getNodeContent: function(inName, inTypeName) {
		var tn = (inTypeName || "").split('.').pop();
		tn = tn ? [" (", tn, ")"].join('') : "";
		return inName + tn;
	},
	getNodeProps: function(inProps, inNode, inName) {
		var p = inProps;
		p.component = inNode.component;
		p.inspected = inNode.inspected;
		p._nodeName = [inNode._nodeName, inName].join('.');
		p.content = this.getNodeContent(inName, inProps.type);
		p.bindToComponent = inNode.bindToComponent;
		p.bindPrefix = inNode.bindPrefix;
		p.inspector = inNode.inspector;
		p.image = inNode.image;
		p.dataProp = inNode.dataProp ? [inNode.dataProp, inName].join('.') : inName;
		return p;
	},
	getSortedSchema: function(inProps) {
		var ins = this.getInspected(inProps);
		// get a copy of the schema
		var s = dojo.mixin({}, this.getSchema(ins, inProps.type, ""));
		// convert to array for sorting
		var sa = [];
		for (var i in s) {
			s[i].name = i;
			sa.push(s[i]);
		}
		// sort by name
		sa.sort(function(a, b) { return wm.compareStrings(a.name, b.name)});
		return sa;
	},
	listNodeChildren: function(inProps) {
		var result = [];
		var ss = this.getSortedSchema(inProps);
		// iterate over props and create tree nodes
		for (var i=0, nodeProps, c, propInfo; (propInfo=ss[i]); i++) {
			if (propInfo.isList)
				continue;
			if (wm.typeManager.isStructuredType(propInfo.type)) {
				c = wm.typeManager.hasStructuredType(propInfo.type, function(ti) { return ti.isList == false });
				nodeProps = this.getNodeProps({type: propInfo.type, _hasChildren: c}, inProps, propInfo.name);
				result.push(nodeProps);
			}
		}
		//
		return result;
	},
	initNodeChildren: function(inNode) {
		var infos = inNode.nodeInfos;
		for (var i=0, info, n; (info=infos[i]); i++) {
			n = this._addTreeNode(inNode, info);
			// keep track of nodes added (this list may be used externally)
			this.nodeList[n._nodeName] = n;
		}
	},
	canMakeDefaultPropEdit: function(inProp) {
		return false;
	},
	// optional: make a special name for properties that are object types
	makeRowCaption: function(inName, inProp) {
		inName = inName + (wm.typeManager.isStructuredType(inProp.type) ? "*" : "");
		return this.inherited(arguments, [inName, inProp]);
	}
});

dojo.declare("wm.NavigationInspector", wm.DataInspector, {
	makePropEdit: function(inName, inProp, inWire) {
		var ins = this.inspected.getValue(inName);
		switch (inName) {
			case "pageName":
				return (new wm.propEdit.PagesSelect({
						component: this, 
						name: inName, 
						value: ins
					})).getHtml();
                        case "cssClasses":
                                return (new wm.propEdit.Select({component: this,
                                                                value: ins || "Info",
                                                                name: inName,
                                                                defaultValue: "Info",
                                                                options: ["Success", "Warning", "Info", "Misc"]})).getHtml();
                        case "duration":
                                return (new wm.propEdit.Select({component: this,
                                                                value: ins || "5000",
                                                                name: inName,
                                                                defaultValue: "5000",
                                                                options: ["1000", "2000", "3000", "4000", "5000", "6000", "8000", "10000", "15000"]})).getHtml();
                        case "dialogPosition":
                                return (new wm.propEdit.Select({component: this,
                                                                value: ins || "Info",
                                                                name: inName,
                                                                defaultValue: "Info",
                                                                options: ["", "top left", "top center", "top right", "center left", "center center", "center right", "bottom left", "bottom center", "bottom right"]})).getHtml();

			case "pageContainer":
				return (new wm.propEdit.WidgetsSelect({
						widgetType: wm.PageContainer, 
						component: this, 
						name: inName, 
						value: ins && ins.name
					})).getHtml();
			case "layer":
				return (new wm.propEdit.WidgetsSelect({
						widgetType: wm.Layer, 
						component: this, 
						name: inName, 
						value: ins && ins.name
					})).getHtml();
			case "layers":
				return (new wm.propEdit.WidgetsSelect({
						widgetType: wm.Layers, 
						component: this, 
						name: inName, 
						value: ins && ins.name
					})).getHtml();
		}
		if (inWire && inWire instanceof wm.Wire)
			return this.makeBoundPropEdit(inName, inWire.source || inWire.expression)
		if (this.canMakeDefaultPropEdit(inProp)) 
			return this.inherited(arguments, [inName, inProp])
		return this.makeBindPropEdit(inName);
	},
	_applyProp: function(t) {
		if (t && t.name) {
			switch (t.name) {
				case "pageName":
				case "duration":
				case "cssClasses":
				case "dialogPosition":
					this.inspected.components.binding.addWire("", t.name, "", '"' + t.value + '"');
					return;
				case "pageContainer":
				case "layer":
				case "layers":
					this.inspected.components.binding.addWire("", t.name, t.value, "");
					return;
			}
			var e = this._editors && this._editors[t.name];
			if (e) 
				e.applyProp(t);
			else 
				this._setInspectedProp(t.name, t.type == "checkbox" ? t.checked : t.value);
		}
	}
});
