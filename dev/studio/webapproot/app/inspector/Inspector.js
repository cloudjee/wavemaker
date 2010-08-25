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
dojo.provide("wm.studio.app.inspector.Inspector");

wm.addPropertyGroups = function(propGroups) {
	dojo.mixin(wm.propertyGroups || (wm.propertyGroups = {}), propGroups);
}

// registry of groups to show in inspector
wm.addPropertyGroups({
	common: {displayName: "Common", order: 10},
	data: {displayName: "Data", order: 13},
	display: {displayName: "Display", order: 15},
	layout: {displayName: "Layout", order: 20},
	"advanced layout": {displayName: "Advanced Layout", order: 180},
	style: {displayName: "Style", order: 30},
	dataobjects: {displayName: "Data Objects", order: 35},
	format: {displayName: "Formatting", order: 40},
	Labeling: {displayName: "Labeling", order: 45},
	edit: {displayName: "Editing", order: 50},
	editor: {displayName: "Editor Options", order: 50},
	editData: {displayName: "Editor Data", order: 55},
	events: {displayName: "Events", order: 100},
	Events: {displayName: "General", order: 100},
	Properties: {displayName: "Other", order: 100},
	validation: {displayName: "Validation", order: 150},
	columns: {displayName: "Columns", order: 999},
	ungrouped: {displayName: "Other", order: 1000},
        operation: {displayName: "Operations", order: 2000},
        docs: {displayName: "Documentation", order: 3000}
});

dojo.declare("wm.InspectorBase", null, {
	flex: 1,
	box: 'v',
	_editors: null,
	init: function() {
		this.inherited(arguments);
		this.connect(this.domNode, "onmousemove", this, "propMove");
		this.connect(this.domNode, "onmouseleave", this, "propLeave");
		this.connect(this.domNode, "onmousedown", this, "propDown");
		this.connect(this.domNode, "onchange", this, "propChange");
		this.connect(this.domNode, "onclick", this, "propClick");
		this.connect(this.domNode, "_onblur", this, "propBlur", true);
		this.connect(this.domNode, "_onfocus", this, "propFocus", true);
		this.connect(this.domNode, "_onchange", this, "propChange", true);
		this.connect(this.domNode, "onkeypress", this, "propKey");

		studio.helpPopup = this.getHelpDialog();
	},
	reinspect: function() {
		this.owner.reinspect();
	},
	getHelpDialog: function() {
		if (!studio.helpPopup) {
			var
				props = {
					owner: this,
					pageName: "PopupHelp",
					scrimBackground: true,
					hideOnClick: false,
					positionLocation: " l"
				},
				d = studio.helpPopup = new wm.PagePopup(props);
			d.setContainerOptions(true, 500, 275);
		}
		var b = studio.helpPopup;
		return b;
	},
	finishProp: function() {
		var p = this.focusedProp;
		this.focusedProp = null;
		if (p && this.focusValue != p.value)
			this._applyProp(p);
	},
	_setInspectedProp: function(inProp, inValue) {
		if (!this.inspected)
			return;
		var type = this.inspected.getPropertyType(inProp);
		switch ((type || 0).type) {
			case "number":
		                inValue = (inValue === "" && type.emptyOK) ? "" : Number(inValue);
				break;
			case "boolean":
				inValue = Boolean(inValue);
				break;
		}
		this.inspected.setProp(inProp, inValue);
		wm.onidle(this, "reinspect");
	},
	_getInspectedProp: function(inProp) {
		if (!this.inspected)
			return;
		var v = this.inspected.getProp(inProp);
		return dojo.isFunction(v) ? ["(", inProp, ")"].join('') : v;
	},
	_applyProp: function(t) {
		if (t && t.name) {
			var e = this._editors && this._editors[t.name];
			if (e) 
				e.applyProp(t);
			else 
				this._setInspectedProp(t.name, t.type == "checkbox" ? t.checked : t.value);
		}
	},
	applyProp: function(e) {
		this._applyProp(e.target);
	},
	editProp: function(inTarget) {
		var t = inTarget, p= t && t.parentNode.previousSibling.firstChild;
		if (this.inspected && p && p.name && ("value" in p)) {
			this.inspected.editProp(p.name, p.value, this);
		}
	},
	propFocus: function(e) {
		dojo.fixEvent(e);
		var t = e.target;
		if (t && t.tagName=="OPTION")
			t = t.parentNode;
		if (t && t.name) {
			this.focusedProp = t;
			this.focusValue = t.value;
		}
	},
	propBlur: function(e) {
		dojo.fixEvent(e);
		var t = e.target;
		if (this.focusedProp == t){
				this.finishProp();
		}
	},
	propKey: function(e) {
		dojo.fixEvent(e);
		if (e.target == this.focusedProp && e.target.tagName != "TEXTAREA" && e.keyCode == dojo.keys.ENTER && !e.shiftKey) {
			this.finishProp();
			try{e.target.select();}catch(x){}
		}
	},
	propChange: function(e) {
		dojo.fixEvent(e);
		if (e.target == this.focusedProp) {
			this.finishProp();
		}
	},
	propDown: function(e) {
		if (this.selectMode) {
			console.log("propDown", e);
			dojo.stopEvent(e);
			return true;
		}
	},
	propClick: function(e) {
		if (this.selectMode) {
			this.endSelectMode(this.getPropNameByEvent(e));
			return true;
		}
		/*if (this.selectMode) {
			console.log("propClick", e);
			dojo.stopEvent(e);
			return true;
		}*/
	},
	hilite: function(inRow, inTrueToHilite) {
		if (inRow) {
			var bs = inTrueToHilite ? "4px solid lightgreen" : "";
			var bn = inTrueToHilite ? "0px" : "";
			var c = inRow.cells;
			c[0].style.border = bs;
			c[0].style.borderRight = bn;
			c[1].style.border = bs;
			c[1].style.borderLeft = bn;
			if (c[2]) {
				c[1].style.borderRight = bn;
				c[2].style.border = bs;
				c[2].style.borderLeft = bn;
			}
		}
	},
	getTargetRow: function(t) {
		while (t && (t.tagName != 'TR' || t.getAttribute("propname")==null))
			t = t.parentNode;
		return t;
	},
	propMove: function(e) {
		if (this.selectMode) {
			var r = this.getTargetRow(e.target);
			if (r && r != this.overRow) {
				this.hilite(this.overRow, false);
				this.hilite(this.overRow = r, true);
			}
		}
	},
	propLeave: function(e) {
		if (this.selectMode) {
			if (!this.getTargetRow(e.target))
				this.hilite(this.overRow, false);
		}
	},
	setSelectMode: function(inTrueForSelectMode) {
		if (this.selectMode && this.overRow && !inTrueForSelectMode)
			this.hilite(this.overRow, false);
		this.selectMode = inTrueForSelectMode;
	},
	endSelectMode: function(inPropName) {
		studio.propertySelected(this.inspected.getRuntimeId() + "." + inPropName);
	}
});

dojo.declare("wm.Inspector", [wm.Box, wm.InspectorBase], {
	flex: 1,
	box: 'v',
	html: [
		'<div style="overflow: auto; width: 100%; height: 100%;" flex="1" box="v">',
			'<table border="0" cellspacing="0" cellpadding="0">',
			'</table>',
		'</div>'
	].join(''),
	inspected: null,
	props: null,
	init: function() {
		this.inherited(arguments);
		this.domNode.className = "wminspector";
		this.domNode.innerHTML = this.html;
		this.tableContainer = this.domNode.firstChild;
		this.table = this.tableContainer.firstChild;
	},
	inspect: function(inComponent, inInspectorProps) {
		if (!this.active) {
			this.inspected = inComponent;
			return;
		}
		this.finishProp();
		this.nextFocusedPropName = null;
		this.inspected = inComponent; 
		// make sure inspector is scrolled back to top
		this.domNode.scrollTop = 0;
		this.preinspect(inInspectorProps);
		this._inspect();
	},
	getProps: function(inInspectorProps) {
		var
			c = this.inspected,
			allProps = c ? c.listProperties() : {},
			props = {};
		for (var i in allProps)
			props[i] = dojo.mixin({name: i}, allProps[i]);
		return props;
	},
	preinspect: function(inInspectorProps) {
		this.props = this.getProps(inInspectorProps);
	},
	_inspect: function() {
		this._editors = {};
		this.focusedProp = null;
		var c = this.inspected;
                if (c.isDestroyed) return;
		var headerCells = this.generateHeaderCells();

		// If the first group name is "Data", then we are looking at variable fields that were defined by the user rather than us.
		if (!this.groups || this.groups.length == 0 || this.groups[0].name != "Data")
		      headerCells.push('<th class="wminspector-header wminspector-help">?</th>');
		this.tableContainer.innerHTML = [
			'<table border="0" cellspacing="0" cellpadding="0" style="width: 100%;">',
			'<tr>', headerCells.join(''), '</tr>',
			this.generateTableContent(),
			'</table>'
		].join('');
		this.table = this.tableContainer.firstChild;
		// allow widgets to be inspectors (we need nodes first)
		this.editors = this.formatTable();
		this.reflow();
		//this.setupClickHandlers();
	},
	/*
	setupClickHandlers: function() {
	      var inspected = this.inspected;
	      dojo.query(".wm-inspector-help", this.tableContainer).onclick(function(e) {
		    var p = this.parentNode.getAttribute("propName");
		    alert(inspected.declaredClass + ": " + p);
		    });
        },
	*/
	generateHeaderCells: function() {
		return [
			'<th class="wminspector-header" style="width: 30%;">Property</th>',
			'<th class="wminspector-header">Value</th>'
		];
	},
	generateTableContent: function() {
		var rows = []
		wm.forEachProperty(this.props, dojo.hitch(this, function(p, n) {
			rows.push(
				'<tr propName="', n, '">',
				this.generateRowCells(n, p).join(''),
				'<td class="wminspector-help">?</td>',
				'</tr>'
			);
		}));
		return rows.join('');
	},
	generateRowCells: function(inName, inProp) {
		return [
			'<td class="wminspector-caption">', this.makeRowCaption(inName, inProp), '</td>',
			'<td class="wminspector-property">', this.makePropEdit(inName), '</td>'
		];
	},
	makeRowCaption: function(inName, inProp) {
	    if (inProp.shortname === undefined)
		return inName;
	    else
		return inProp.shortname;
	},
	makePropEdit: function(inName/*, inProp*/) {            
	    var c = this.inspected;
            if (c.isDestroyed) return;
            var d = c.constructor.prototype[inName], v = this._getInspectedProp(inName);

		var e = c.makePropEdit(inName, v, d) || makeInputPropEdit(inName, v, d);
		if (!dojo.isString(e)) {
			e.inspector = this;
			this._editors[inName] = e;
			e = e.getHtml();
		}
		return e;
	},
	formatTable: function() {
		var editors = [];
		for (var i=1, rows=this.table.rows, tr; (tr=rows[i]); i++){
			this.formatTableRow(tr, editors);
		}
		return editors;
	},
	formatTableRow: function(inTr, ioEditors) {
		var p = inTr.getAttribute("propName");
		if (p) {
		      // Dangerous change by michael to add "?" icon undisturbed...
		      var td = inTr.cells[inTr.cells.length - 2];
		      //var td = inTr.cells[inTr.cells.length - 1];
			var n = td&&td.firstChild;
		        var e = formatPropEdit(this.inspected, p, this._getInspectedProp(p), n, wm.isInstanceType(this, wm.BindInspector));
			if (e)
				ioEditors.push(e);
		}
	},
	reinspect: function() {
		this.inherited(arguments);
		if (this.nextFocusedPropName) {
			this.doFocusProp(this.nextFocusedPropName);
			this.nextFocusedPropName = null;
		}
	},
	// property groups
	propClick: function(e) {
		if (this.inherited(arguments))
			return true;
		studio.studioKeyPriority = false;
		this.propFocus(e);
		var t = e.target || 0;

		if (dojo.hasClass(e.target, "wminspector-help")) {
		    if (!dojo.hasClass(e.target, "wminspector-header")) {
			var propName = this.getPropNameByEvent(e); //e.target.parentNode.propname
			return this.beginHelp(propName, e.target, this.inspected.declaredClass);
		    } else
			return true;
		} else if (t.type == "checkbox") {
			this.applyProp(e);
			return true;
		} else {
			var t = this.getTargetByClass(t, "wminspector-prop-button");
			if (t) {
				this.editProp(t);
				return true;
			}
		}
	},
	beginHelp: function(inPropName, inNode, inType) {
	      var bd = studio.helpPopup;
	      bd.page.setHeader(inType,inPropName);

	      bd.sourceNode = inNode;
	      //bd.positionNode = inNode.parentNode;
	      bd.positionNode = dojo.byId("studio_designer");
	      bd.page.setContent(""); // clear previous content before showing
	      bd.show();
	      inType = inType.substring(inType.indexOf(".")+1);


	      if (inType.indexOf("gadget.") == 0)
		  inType = inType.substring(inType.indexOf(".")+1);

	      if (inType.indexOf("dijit.") == 0)
		  inType = inType.substring(inType.indexOf(".")+1);


	      inType = inType.replace(/\./g, "_");

	      studio.studioService.requestAsync("getPropertyHelp", [inType + "_" + inPropName + "?synopsis"], function(response) {
		    bd.page.setContent(response);
	      });

	      /*
	      dojo.xhrGet({
		    url: "http://dev.wavemaker.com/wiki/bin/view/WM5_Documentation/",
		    handleAs: "html",
		    load: function(response,ioArgs) {
			  alert("Loaded: " + response);
	            },
		    error: function(response,ioArgs) {
			  console.log("HELP SYSTEM: Failed to load!");
			  console.dir(ioArgs);
	            
}
	      });
	      */
	      return true;
	},

	getDefaultFocusProp: function() {
	},
	focusDefault: function() {
		this.doFocusProp(this.getDefaultFocusProp());
	},
	doFocusProp: function(inProp) {
		if (!inProp)
			return;
		var n = getPropNode(this.table, inProp, 1);
		wm.focusOnIdle(n);
		studio.studioKeyPriority = true;
	},
	getPropNameByEvent: function(e) {
		var d = this.domNode, t = e && e.target.parentNode, pn;
		while (t && t != d) {
			pn = t.getAttribute && t.getAttribute("propname");
			if (pn)
				return pn;
			t = t.parentNode;
		}
	},
	getTargetByClass: function(inTarget, inClass) {
		var t=inTarget;
		while (t && t != this.domNode) {
			if (dojo.hasClass(t, inClass))
				return t;
			t = t.parentNode;
		}
	},
	setSelectMode: function(inTrueForSelectMode) {
		this.inherited(arguments);
}});

dojo.declare("wm.GroupInspector", wm.Inspector, {
	autoScroll: true,
	//scrollY: true,
	colCount: 2,
	preinspect: function(inInspectorProps) {
		this.inherited(arguments);
		this.groups = this.inspected ? this.initGroups(this.props) : [];
	},
	generateTableContent: function() {
		var rows = [], c = this.inspected;
		dojo.forEach(this.groups, dojo.hitch(this, function(g) {
			rows.push(this.generateGroup(g));
		}));
		//rows.push(this.makeSpacerRow());
		return rows.join('');
	},
	// group formatting
	generateGroup: function(inGroup) {
		var rows = [], props = inGroup.props;
		if (inGroup.displayName)
			rows.push(this.generateGroupRow(inGroup));
		for (var i=0, p, n; (p=props[i]); i++){
			if (p.hidden)
				continue;
			if (p.dependency && !wm.expression.getValue(p.dependency, this.inspected))
				continue;
						
			n = p.name;
			rows.push(
				'<tr propName="', n, '"', inGroup.closed ? ' style="display: none;"' : '', '>',
				this.generateRowCells(n, p).join(''),
				// add a "?" button unless its a Data group.  Its assumed that a Data group contains variable/database/webservice 
				// specific information that would not reside on our wiki, but which the user should know better than us.
				(inGroup.name != "Data") ? '<td class="wminspector-help">?</td>' : "", 
				'</tr>'
			);
		}
		return rows.join('');
	},
	generateGroupRow: function(inGroup) {
		var
			closed = (wm.propertyGroups[inGroup.name] || 0).closed,
			img = ['<img src="images/group_', (closed ? 'closed' : 'open'), '.gif">&nbsp;'].join(''),
			cs = " colSpan=" + this.colCount;
		return [
			'<tr class="wminspector-grouprow" onclick="wm.bubble(event)" groupRow="', inGroup.name, '">',
			'<th', cs,' class="wminspector-group">', img, inGroup.displayName, '</th>',
		'</tr>'].join('');
	},
	formatTableRow: function(inTr, inEditors) {
		var tr = inTr, editors = inEditors;
		// skip group row
		if (tr.getAttribute("groupRow")) {
			dojo.setSelectable(tr, false);
			return;
		}
		this.inherited(arguments);
	},
	shouldShowProp: function(inName, inProp) {
		return !inProp.ignore;
	},
	// property groups
	initGroups: function(inProps) {
		var groups = this.buildGroups(inProps);
		// sort groups
		this.sortGroups(groups);
		// fill in extra properties
		dojo.forEach(groups, function(g) {
			dojo.mixin(g, wm.propertyGroups[g.name] || {displayName: g.name});
		});
		return groups;
	},
	buildGroups: function(inProps) {
		var groups = [], groupsArray = [], defaultGroup = this.name;
		wm.forEachProperty(inProps, dojo.hitch(this, function(o, n) {
			if (!this.shouldShowProp(n, o))
				return;
			var
				name = (o && o.group) || defaultGroup || "ungrouped",
				g = groups[name] || (groups[name] = []),
				order = o && o.order != undefined ? o.order : 1000,
				p = dojo.mixin({}, o, {name: n, order: order});
			g.push(p);
		}));
		for (var i in groups)
			groupsArray.push({name: i, props: groups[i]});
		return groupsArray;
	},
	sortGroups: function(inGroups) {
		// sort groups
		inGroups.sort(function(a, b) {
			return ((wm.propertyGroups[a.name] || 0).order || 0) - ((wm.propertyGroups[b.name] || 0).order || 0);
		});
		// sort props in each group
		dojo.forEach(inGroups, function(g) {
			if (g.props.sort)
				g.props.sort(function(a, b) {
					var o = a.order - b.order;
					return o == 0 ? wm.compareStrings(a.name, b.name) : o;
				});
		});
		return inGroups;
	},
	propClick: function(e) {
		if (!this.inherited(arguments))
			return this.toggleGroup(e.target);
	},
	getGroupRow: function(inTarget) {
		return this.getTargetByClass(inTarget, "wminspector-grouprow");
	},
	toggleGroup: function(inTarget) {
		var r = this.getGroupRow(inTarget);
		// is this a group row?
		if (!r)
			return;
		var
			img = r.cells[0].firstChild,
			isOpen = img.src.match("open"),
			gn = r.getAttribute('grouprow');
		// store expansion state
		(wm.propertyGroups[gn] || 0).closed = Boolean(isOpen);
		// set group image
		img.src = "images/group_" + (isOpen ? "closed.gif" : "open.gif");
		// show / hide group rows
		for (var rows=this.table.rows, i = dojo.indexOf(rows, r) + 1, row; (row=rows[i]); i++) {
			if (dojo.hasClass(row, "wminspector-grouprow"))
				break;
			else
				row.style.display = isOpen ? "none" : "";
		}
		return true;
	},
	getDefaultFocusProp: function() {
		if (!this.inspected)
			return;
		for (var i=0, g, groups=this.groups; (g=groups[i]); i++)
			for (var j=0, p; (p=g.props[j]); j++)
				if ((this.inspected.schema[p.name] || 0).focus)
					return p.name;
		return "name";
	}
});

dojo.declare("wm.EventInspector", wm.Inspector, {
	getProps: function(inInspectorProps) {
		var props = this.inherited(arguments);
		for (var i in props)
			if (!props[i].isEvent || props[i].ignore)
				delete props[i];
		return props;
	},
	hasEvents: function(inProps) {
		var list = inProps;
		for (var i in list)
			if (list[i].isEvent)
				return true;
	},
	canInspect: function(inInspected, inProps) {
/* MICHAEL 8/10/2010 (WM-1869): Commented out to enable application level event handlers 
		var appOwned = (inInspected && inInspected.isOwnedBy(studio.application));
		return !appOwned && this.hasEvents(inProps);
		*/
	    return this.hasEvents(inProps);
	}
});

getPropNode = function(inTable, inProp, inCellIndex) {
	for (var i=1, rows=inTable.rows, tr, n; inProp && (tr=rows[i]); i++)
		if (tr.getAttribute("propName") == inProp)
			return (tr.cells[inCellIndex]).firstChild;
}
