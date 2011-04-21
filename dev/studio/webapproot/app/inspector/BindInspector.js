/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
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

        /* Properties that can be inspected are all the usual properties except for those that are events or methods */
	getProps: function() {
		var props = this.inherited(arguments);
		for (var i in props)
			if (props[i].isEvent || props[i].isCustomMethod)
				delete props[i];
		return props;
	},
/*
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
	*/

        /* Unlike the default inspector, we need a column for the bind buttons */
	generateHeaderCells: function() {
		var r = this.inherited(arguments);
		//r.unshift('<th class="wminspector-header wminspector-binding"></th>');
		r.push('<th class="wminspector-header wminspector-binding"></th>');		
		return r;
	},

        /* Unlike the typical row, we need to pass in bind information (shows readonly node)
	 * and the proper bind or clear button
	 */
	generateRowCells: function(inName, inProp) {
		var
			n = inName,
			bindable = this.isBindable(inProp),
			wire = bindable && this.getPropWire(inProp),
			c = " wminspector-bindProp" + (bindable ? "" : "-disabled"),
			bc = wire ? " wminspector-boundProp" : "",
			b = '';

	    var editor = this.makePropEdit(n, inProp, wire);
	    if (editor.match(/class="wminspector-prop-button"/)) {
		return [
			'<td></td><td>', editor, '</td><td></td>'
		];
	    } else {
		return [
			//'<td class="wminspector-binding', c, bc, '">', b, '</td>',
			'<td class="wminspector-caption">', this.makeRowCaption(n, inProp), '</td>',
			'<td class="wminspector-property">', editor, '</td>',
		    '<td class="wminspector-binding' + c  + '">', b, '</td>'
		];
	    }
	},
    getRowClasses: function(inName, inProp) {
	var bindable = this.isBindable(inProp);
	var wire = bindable && this.getPropWire(inProp);
	if (wire)
	    return "isBound";
	else
	    return "";
    },

    /* The parent method checks to see if "ignore" is true to determine if it can be shown.
     * If its set to be bindable though, then its meant to be editted by the user via the properties panel,
     * and the "ignore" really means "you can not set the value as a property, but you can bind it".
     * I don't actually understand WHY this is used; but it can be seen for dataValue for AbstractEditor/Editor
     */
	shouldShowProp: function(inName, inProp) {
		return this.inherited(arguments) || this.isBindable(inProp);
	},

    /* Get the value of this property in the widget we are inspecting.
     * If its bound, we'll get a formatted string to describe that binding
     * Else we'll let the parent method take care of it
     */
    _getInspectedProp: function(inProp) {
	   var bindable = this.isBindable(this.props[inProp]);
	   var wire = bindable && this.getPropWire(this.props[inProp]);
	if (wire)
	    return this.getFormattedValue(inProp, wire.source, wire.expression);
	else
	    return this.inherited(arguments);
    },

    /* Most of the time, we need the parent class's makePropEdit method to generate the property editor
     * which could be a checkbox, combobox or other UI element.  The only thing the parent method does not
     * handle is the case where the prop is bindable but ignored (if we're inspecting it, and its ignored, 
     * we know its bindable; see getProps())
     */
	canMakeDefaultPropEdit: function(inProp) {
		return !inProp.ignore;
	},
	makePropEdit: function(inName, inProp, inWire) {
/*
		if (inWire && inWire instanceof wm.Wire)
		    return this.makeBoundPropEdit(inName, inWire.source, inWire.expression)
		    */

	    if (this.canMakeDefaultPropEdit(inProp)) {
		var result = this.inherited(arguments, [inName, inProp]);
		return result;
	    }

	    // If the parent method isn't generating the UI, then create a 
	    //return this.makeBindPropEdit(inName, wm.typeManager.isStructuredType(inProp.type));

	    /* Ok, we have a property that is bindable but ignored; so we need a basic text editor, readonly=true, and if
	     * it has a binding we'll need to show its value.
	     */
	    console.log(inName + ": " + inProp.type);
	    var type = inProp.type.toLowerCase();
	    var isEditable = (type == "string" || type == "boolean" || type == "number" || type == "int" ||
			      type == "java.lang.string" || type == "java.lang.boolean" || type == "java.lang.integer" || 
			      type == "java.lang.boolean" || type == "java.lang.byte" || type == "java.lang.double" ||
			      type == "java.lang.float" || type == "java.lang.number" || type == "java.lang.short");
	    return makeInputPropEdit(inName, 
				     inWire && inWire instanceof wm.Wire ? this.getFormattedValue(inProp, inWire.source, inWire.expression) : "",
				     "", !isEditable, Boolean(inWire && inWire instanceof wm.Wire));
	},
/*
        makeBindPropEdit: function(inName, inReadOnly) {
	    var m = (inReadOnly) ? "(binding data)" : "";
	    return makeBoundEdit(inName,"");
	    //return makeInputPropEdit(inName, m, m, inReadOnly);
	    //return makeInputPropEdit(inName, m, m, true);
	},
	*/

    /* Reinspect uses this method to update the values of all editors.
     * Let the parent method handle the work of setting all of the values.
     * After its done, 
     * 1. Update the visibility of the readonly bind value vs the regular editable field.
     * 2. Update the state of the bind/reset button
     */
	setPropEdit: function(inName/*, inProp*/) {
	    var prop = this.props[wm.Array.last(inName.split("."))];
	    if (this.canMakeDefaultPropEdit(prop)) 
		this.inherited(arguments);
	   var bindable = this.isBindable(prop);
	   var wire = bindable && this.getPropWire(prop);
	   var row = dojo.byId("propinspect_row_" + prop.name);
	   var value = wire ? this.getFormattedValue(inName,wire.source, wire.expression) : "";
	   if (row && bindable) {
	       if (value)
		   dojo.addClass(row, "isBound");
	       else
		   dojo.removeClass(row, "isBound");

	       var readonly = dojo.query(".wminspector-readonly", row)[0];
	       var edit = dojo.query(".wminspector-edit", row)[0];
	       if (value) {
		   readonly.value = value;

		   //readonly.style.display = "block";
		   //edit.style.display = "none";
	       } else if (!prop.ignore && !prop.tmpignore) {

		    // get its nonbind value if it has one
	       	   var newval;
		   if (this.owner.inspected instanceof wm.Variable)
		       newval = this.owner.inspected._getDataValue(inName);
		   else
		       newval = this.owner.inspected.getProp(inName);
		   if (newval === null || newval === undefined) newval = "";
		   if (this.owner.inspected.owner instanceof wm.Variable && newval instanceof wm.Variable && newval.owner == this.owner.inspected)
		       newval = "";
		   var editor = dijit.byId(dojo.attr(edit,"widgetid"));
		   editor.set("value", newval, false);
		   if (newval === "")
		       editor._lastValueReported = ""; // dijit bug, without this won't fire change event if we restore last value
		   
		   //readonly.style.display = "none";
		   //edit.style.display = "block";
	       } else {
		   dijit.byId(dojo.attr(edit,"widgetid")).set("value", "", false);
	       }
	   }
       },

    /* Generate a friendly readable description of the bind value for a bound property */
    getFormattedValue: function(inName, inSource, inExpr) {
	var inValue = "";
	if (!inSource && !inExpr)
	    ;
	else if (inSource) 
	    inValue = "bind: " + inSource;
	else if (inExpr === undefined || inExpr === null || inExpr === "" || String(inExpr).match(/^\s*$/))
	    inValue = "";
	else if (inExpr == "true")
	    inValue = "bool: true";
	else if (inExpr == "false")
	    inValue = "bool: false";
	else if (inExpr == "null")
	    inValue = "null: null";
	else if (inExpr == "null")
	    inValue = "null: null";
	else if (String(inExpr).match(/\d/) && !isNaN(inExpr)) // isNaN("") == isNaN(" ") == false
	    inValue = "numb: " + inExpr;
	else if (inExpr == "(binding data)")
	    inValue = inExpr;
	else {
	    var matches = inExpr.match(/^\s*\"([^\"]*)\"\s*$/);
	    if (matches)
		inValue = "str: " + matches[1];
	    else
		inValue = "expr: " + inExpr;
	    inValue = String(inValue).replace(/\"/g, "'") || "";
	}
	return inValue;
    },

    /*
    makeBoundPropEdit: function(inName, inSource, inExpr) {	
	return makeBoundEdit(inName, this.getFormattedValue(inName,inSource,inExpr));

    },
    */

    /* If the user clicks on a property, let the parent inspector try handling it; if it finds nothing to handle,
     * we handle clicks on bind and reset bind buttons.
     * I think this.selectMode also lets us handle selecting properties when the wm.Property is trying to select
     * a property to associate itself with
     */
	propClick: function(e) {
		var
			handled = this.inherited(arguments),
			propName = this.getPropNameByEvent(e);
		if (this.selectMode)
			return this.endBind(propName, e.target);
	    else if (!handled && dojo.hasClass(e.target, "wminspector-bindProp")) {
			return this.beginBind(propName, e.target);
	    } else if (dojo.hasClass(e.target, "bound-prop-button")) {
			this.unbindProp(propName);
		this.reinspect(); //applyEdit doesn't handle bound values		
	    }
	},

    /* If the user clicks the unbind button, remove the binding and update this property editor's state */
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
		} else {
		    this._setPropEdit(inPropName, "","");
		}
	},
	isBindable: function(inProp) {
		return inProp && (inProp.bindable || inProp.bindTarget);
	},
	getBinding: function() {
		var i = this.owner.inspected;
	    return i && i.components.binding;
	},
	getTargetProperty: function(inPropName) {
		return inPropName;
	},

    /* Get the wm.Wire for this bindable property if there is one */
	getPropWire: function(inProp) {
		var
			b = this.getBinding(),
			tp = this.getTargetProperty(inProp.name);
		return b && b.owner && wm.data.getPropWire(b.owner, tp);
	},

    /* Setup the parameters for the bind dialog */
	getBindDialogProps: function(inPropName) {
		var
			o = this.owner.inspected,
			tp = this.getTargetProperty(inPropName),
			prop = this.props[tp];
		if (this.isBindable(prop))
			return dojo.mixin({object: o, targetProperty: tp}, prop || {});
	},

    /* Show the bind dialog, setup for binding the selected property */
	beginBind: function(inPropName, inNode) {
	    studio.bindDialog.page.initBinding();
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

    /* After 
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
	/* This is only used when wm.Property is selecting a property to edit.  I think... */
	endBind: function(inPropName, inNode) {
		//alert(inPropName);
		studio.onSelectProperty(this.inspected.getRuntimeId() + "." + inPropName);
		studio.testClick();
		// bindBind may have been performed by a different inspector
		studio.select(studio._bindTarget);
		//if (this.active)
		//	this._inspect();
	}

});



/* Data inspector, used to inspect data of wm.Variable subclasses such as
 * a navigationService's "input", a LiveVariable's sourceData and filter
 * and other things we think of as "properties" but which can't be set
 * like a property because they're part of the variable.data...[propertyName] instead of variable[propertyName]
 */
dojo.declare("wm.DataInspector", wm.BindInspector, {
	constructor: function() {
		this.initNodeChildren = dojo.hitch(this, this.initNodeChildren);
	},
	inspect: function(inComponent) {
	    var ip = this.parent.parent.inspectorProps;
	    var bindToComponent = ip ? ip.bindToComponent : null;
		// FIXME:
		// note: inspected is always the component we're inspecting
		// and ip.inspected is always the root object bding inspected

		this.bindingOwner = bindToComponent ? inComponent : ip && studio.page.getValueById(ip.inspected);
		this.bindPrefix = ip && ip.bindPrefix;
		this.dataProp = ip && ip.dataProp ? ip.dataProp : "";
		this.inherited(arguments);
	},
	getProps: function() {
		var c = this.owner.inspected, dp = this.dataProp;
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

	_setInspectedProp: function(inProp, inValue) {
		if (!this.owner.inspected)
			return;

	    var w = wm.data.getPropWire(this.owner.parent.inspected, inProp);
		if (w) w.destroy();
	    if (inValue === "") return;

		var type = this.owner.inspected.getPropertyType(inProp);
		switch ((type || 0).type) {
			case "number":
		                inValue = (inValue === "" && type.emptyOK) ? "" : Number(inValue);
				break;
			case "boolean":
				inValue = Boolean(inValue);
				break;
		}
	    //this.inspected.setProp(inProp, inValue);
/*
	    var b = bindTo.components.binding;
	    */
	    var origProp = inProp;
	    var b = this.bindingOwner.components.binding;
	    if (this.dataProp)
		inProp = this.dataProp + "." + inProp;
	    if (this.bindPrefix) {
		inProp = this.bindPrefix + "." + inProp;
		console.log(inProp);
	    }

	    if (inValue == "true" || inValue == "false" || !isNaN(inValue) || String(inValue).match(/\"/) || String(inValue).match(/\$\{.*\}/) || String(inValue).match(/(\+|\-|\*|\/|\w\.\w)/)) {
		inValue = String(inValue);
	    } else {
		inValue = '"' + inValue + '"';
	    }
	    try {
		var tmp = inValue;
		tmp = tmp.replace(/\$\{.*?\}/g, "''"); // remove the crazy stuff that we dont want to try evaluating right now (probably ok to evaluate it at design time, but its not needed to see if this will compile)
		// if its undefined, then presumably it failed to compile
		var tmp2 = eval(tmp);		
		if (tmp2 === undefined) {
		    this.beginBind(origProp, this.bindingOwner);
		    studio.bindDialog.bindSourceDialog.expressionRb.editor.setChecked(true);
		    studio.bindDialog.bindSourceDialog.expressionEditor.setDataValue(inValue);
		    app.toastError(studio.getDictionaryItem("wm.DataInspector.TOAST_EXPRESSION_FAILED"));
		    return;
		}
	    } catch(e) {
		    this.beginBind(origProp, this.bindingOwner);
		studio.bindDialog.bindSourceDialog.expressionRb.editor.setChecked(true);
		studio.bindDialog.bindSourceDialog.expressionEditor.setDataValue(inValue);
		    app.toastError(studio.getDictionaryItem("wm.DataInspector.TOAST_EXPRESSION_FAILED"));
		    return;
	    }
	    this.bindingOwner.components.binding.addWire("", inProp, "", inValue);

	    this.setPropEdit(inProp);
	    wm.job("studio.updateDirtyBit",10, function() {studio.updateProjectDirty();});
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
			o = this.bindingOwner || this.owner.inspected,
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
		var ins = this.owner.inspected.getValue(inName);
		switch (inName) {
			case "pageName":
				return (new wm.propEdit.PagesSelect({
						component: this, 
						name: inName, 
						value: ins
					})).getHtml();
                        case "cssClasses":
		    /* TODO: Localize this */
                                return (new wm.propEdit.Select({component: this,
                                                                value: ins || "Info",
                                                                name: inName,
                                                                defaultValue: "Info",
                                                                options: ["Success", "Error", "Warning", "Info", "Misc"]})).getHtml();
                        case "duration":
                                return (new wm.propEdit.Select({component: this,
                                                                value: ins || "5000",
                                                                name: inName,
                                                                defaultValue: "5000",
                                                                options: ["1000", "2000", "3000", "4000", "5000", "6000", "8000", "10000", "15000"]})).getHtml();
                        case "dialogPosition":
		    /* TODO: Localize this */
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
		   //return this.makeBoundPropEdit(inName, inWire.source, inWire.expression)
		   return makeInputPropEdit(inName, this.getFormattedValue(inName,inWire.source,inWire.expression), "", false, Boolean(inWire.source || inWire.expression));
		if (this.canMakeDefaultPropEdit(inProp)) 
			return this.inherited(arguments, [inName, inProp])
	    //return this.makeBindPropEdit(inName, false);

	    return makeInputPropEdit(inName, 
				     inWire && inWire instanceof wm.Wire ? this.getFormattedValue(inProp, inWire.source, inWire.expression) : "",
				     "", false, Boolean(inWire && inWire instanceof wm.Wire));
	},

	_setInspectedProp: function(inProp, inValue) {
		if (!this.owner.inspected)
			return;
		var w = wm.data.getPropWire(this.owner.inspected, inProp);
		if (w) w.destroy();
	    switch (inProp) {
				case "pageName":
				case "duration":
				case "cssClasses":
				case "dialogPosition":
					this.owner.inspected.components.binding.addWire("", inProp, "", '"' + inValue + '"');
					return;
				case "pageContainer":
				case "layer":
				case "layers":
					this.owner.inspected.components.binding.addWire("", inProp, inValue, "");
					return;
			}
	    return this.inherited(arguments);
	},
       _setPropEdit: function(inName, inValue, inDefault) {
			switch (inName) {
				case "pageName":
				case "duration":
				case "cssClasses":
				case "dialogPosition":
				case "pageContainer":
				case "layer":
				case "layers":
			    var bindable = this.isBindable(this.props[inName]);
			    var wire = bindable && this.getPropWire(this.props[inName]);
			    var editor = setInputPropEdit(inName, wire.expression.replace(/\"/g,""));

			    break;
			default:
			    this.inherited(arguments);
			}
       }
});
