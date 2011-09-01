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
 
dojo.provide("wm.studio.app.inspector.Inspector");

wm.addPropertyGroups = function(propGroups) {
	dojo.mixin(wm.propertyGroups || (wm.propertyGroups = {}), propGroups);
}

// registry of groups to show in inspector
wm.addPropertyGroups({
	common: {displayName: "Common", order: 10},
	data: {displayName: "Data", order: 13},
	display: {displayName: "Display", order: 15},
	layout: {displayName: "Layout", order: 25},
	"advanced layout": {displayName: "Advanced Layout", order: 180},
	style: {displayName: "Style", order: 30},
	scrolling: {displayName: "Scrollbars", order: 32},
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
		this.connect(this.domNode, "onclick", this, "propClick");
	    if (this.name == "Properties") {
		// onidle because this might not yet have been created
		wm.onidle(this, function() {
		    var node = studio.inspector.inspector._inspectors.Styles.layers[0].domNode;
		    this.connect(node, "onmousemove", this, "propMove");
		    this.connect(node, "onmouseleave", this, "propLeave");
		    this.connect(node, "onmousedown", this, "propDown");
		    this.connect(node, "onclick", this, "propClick");
		});

	    }

		studio.helpPopup = this.getHelpDialog();
	},

	getHelpDialog: function() {
		if (!studio.helpPopup) {
		    var props = {
			owner: this,
			pageName: "PopupHelp",
	                width: "500px",
                        height: "275px",
                        modal: false,
                        noEscape: false,
                        useContainerWidget: false,
                        hideControls: true,
			corner: "tl"
		    };
		    var d = studio.helpPopup = new wm.PageDialog(props);
		}
		var b = studio.helpPopup;
		return b;
	},

	_setInspectedProp: function(inProp, inValue) {
	    new wm.PropTask(this.owner.inspected, inProp, this._getInspectedProp(inProp));
	    if (this instanceof wm.StyleInspector)
		return this.owner._inspectors.Properties._setInspectedProp(inProp,inValue);


		if (!this.owner.inspected)
			return;
		var type = this.owner.inspected.getPropertyType(inProp) || "";
	        if (type && type.type)
		    type = type.type.toLowerCase();

	        switch (type) {
			case "number":
		                inValue = (inValue === "" && type.emptyOK) ? "" : Number(inValue);
				break;
			case "boolean":
				inValue = Boolean(inValue);
				break;
		}
		this.owner.inspected.setProp(inProp, inValue);
	    this.reinspect();
	    wm.job("studio.updateDirtyBit",10, function() {studio.updateProjectDirty();});
	},
	_getInspectedProp: function(inProp) {
	    if (this instanceof wm.StyleInspector)
		return this.owner._inspectors.Properties._setInspectedProp(inProp,inValue);

	    if (!this.owner.inspected)
		return;
	    var v = this.owner.inspected.getProp(inProp);
	    return dojo.isFunction(v) ? ["(", inProp, ")"].join('') : v;
	},

	editProp: function(inTarget) {
	    var t = inTarget;
	    while (!dojo.attr(t, "propname"))
		t = t.parentNode;

	    var propName = dojo.attr(t, "propname");
	    var editor = dijit.byId("studio_propinspect_"+propName);
	    var v = "";
	    if (editor) 
		v = editor.get("value");
	    if (this.owner.inspected) {
		this.owner.inspected.editProp(propName, v, this);
	    }

	},

    propChange: function(propName,value,propEditorName) {
	var e = this._editors && this._editors[propName];
	if (e) {
	    e.applyProp(propName, value);
	} else {
	    this._setInspectedProp(propName, value);
	}
	    this.reinspect(); //applyEdit doesn't handle bound values
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
		studio.propertySelected(this.owner.inspected.getRuntimeId() + "." + inPropName);
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
    inspect: function(inComponent) {

		// make sure inspector is scrolled back to top
		this.domNode.scrollTop = 0;
		this.preinspect();
		this._inspect();
	},
	reinspect: function() {
	    this._inReinspect = true; // block all onChange events from firing while we start setting dijit values
	    try {
		this.preinspect(this.inspectorProps); // because based on last changes, some props may not have ignore settings changed
		for (var propname in this.props) {
		    var prop = this.props[propname];
		    if (this.shouldShowProp(propname, prop)) {
			// stuff that was moved into the style inspector may not have a generated node... 
			// or if we are in the style inspector viewing border/margin/padding, the rest of the props won't have nodes
			// So test if we have a node before doing anything
			var node = dojo.byId("propinspect_row_"+propname);
			if (node) {
			    this.setPropEdit(propname);
			    // neat hack... I first tried style.display = "none" and the table became unformatted
			    // position absolute removes it from the flow and visibility makes it hidden
			    node.style.position = prop.ignoretmp ? "absolute" : ""; 
			    node.style.visibility = prop.ignoretmp ? "hidden" : ""; 
			}
		    }
		}
	    } catch(e) {
		console.error(e);
	    }
	    this._inReinspect = false; // enable all onChange events to fire
	},
	getProps: function() {
	    
		var
			c = this.owner.inspected,
			allProps = c ? c.listProperties() : {},
			props = {};
		for (var i in allProps)
			props[i] = dojo.mixin({name: i}, allProps[i]);
		return props;
	},
	preinspect: function() {
		this.props = this.getProps();
	},
	shouldShowProp: function(inName, inProp) {
		return !inProp.ignore && !inProp.writeonly;
	},
	_inspect: function() {
		this._editors = {};
		this.focusedProp = null;
		var c = this.owner.inspected;
                if (c.isDestroyed) return;
		var headerCells = this.generateHeaderCells();

		// If the first group name is "Data", then we are looking at variable fields that were defined by the user rather than us.
		if (!this.groups || this.groups.length == 0 || this.groups[0].name != "Data")
		      headerCells.push('<th class="wminspector-header wminspector-help"></th>');
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

	setupClickHandlers: function() {

	    dojo.query(".wminspector-help", this.tableContainer).onclick(dojo.hitch(this,function(e) {
		  var inspected = this.owner.inspected;
		  if (!dojo.hasClass(e.target, "wminspector-header")) {
		      var propName = this.getPropNameByEvent(e); //e.target.parentNode.propname
		      return this.beginHelp(propName, e.target, this.owner.inspected.declaredClass);
		  }
	    }));
        },

	generateHeaderCells: function() {
		return [
		    '<th class="wminspector-header" style="width: 30%;">' + studio.getDictionaryItem("wm.Inspector.PROPERTIES_HEADER_CAPTION") + '</th>',
		    '<th class="wminspector-header">' + studio.getDictionaryItem("wm.Inspector.VALUES_HEADER_CAPTION") + '</th>'
		];
	},
	generateTableContent: function() {
	    var propArray = [];
	    wm.forEachProperty(this.props, function(p) {propArray.push(p);});
	    propArray = propArray.sort(function(a,b) {
		return wm.compareStrings(a.name.toLowerCase(),b.name.toLowerCase());
	    });
		var rows = []
	    for (var i = 0; i < propArray.length; i++) {
		var p = propArray[i];
		var n = p.name;
			rows.push(
			    '<tr id="propinspect_row_' + n + '" ' + (p.ignoretmp ? 'style="position:absolute;visibility:hidden" ' :'') +  'propName="', n, '">',
				this.generateRowCells(n, p).join(''),
				'<td class="wminspector-help"></td>',
				'</tr>'
			);
	    }
		return rows.join('');
	},
	generateRowCells: function(inName, inProp) {
	    var editor = this.makePropEdit(inName);
	    if (editor.match(/class="wminspector-prop-button"/)) {
		return [
			'<td></td><td>', editor, '</td>'
		];
	    } else {
		return [
			'<td class="wminspector-caption">', this.makeRowCaption(inName, inProp), '</td>',
			'<td class="wminspector-property">', editor, '</td>'
		];
	    }
	},
	makeRowCaption: function(inName, inProp) {
	    if (inProp.shortname === undefined)
		return inName;
	    else
		return inProp.shortname;
	},
        makePropEdit: function(inName/*, inProp*/, inProp, inWire) {
	    var c = this.owner.inspected;
            if (c.isDestroyed) return;
            var d = c.constructor.prototype[inName];
	    var v = this._getInspectedProp(inName);

		var e = c.makePropEdit(inName, v, d) || makeInputPropEdit(inName, v, d);
		if (!dojo.isString(e)) {
			e.inspector = this;
			this._editors[inName] = e;
			e = e.getHtml();
		}
		return e;
	},
	setPropEdit: function(inName/*, inProp*/) {            
	    var c = this.owner.inspected;
            if (c.isDestroyed) return;
            var d = c.constructor.prototype[inName], v = this._getInspectedProp(inName);

	    var e = this._editors && this._editors[inName];
	    if (e) {
		e.setPropEdit(inName, v);
	    } else {
		c.setPropEdit(inName, v, d) || this._setPropEdit(inName,v,d);
	    }
	},
    _setPropEdit: function(inName, inValue, inDefault) {
	setInputPropEdit(inName, inValue, inDefault);
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
		    var td;
		    dojo.forEach(inTr.cells, function(c) {
			if (dojo.hasClass(c, "wminspector-property"))
			    td = c;
		    });
		      //var td = inTr.cells[inTr.cells.length - 1];
			var n = td&&td.firstChild;
		        var e = formatPropEdit(this.owner.inspected, p, this._getInspectedProp(p), n, wm.isInstanceType(this, wm.BindInspector));
			if (e)
				ioEditors.push(e);
		}
	},
/*
	reinspect: function() {
		this.inherited(arguments);
		if (this.nextFocusedPropName) {
			this.doFocusProp(this.nextFocusedPropName);
			this.nextFocusedPropName = null;
		}
	},
	*/
	// property groups

	propClick: function(e) {
		if (this.inherited(arguments))
			return true;
		studio.studioKeyPriority = false;

		var t = e.target || 0;

		if (dojo.hasClass(e.target, "wminspector-help")) {
		    if (!dojo.hasClass(e.target, "wminspector-header")) {
			var propName = this.getPropNameByEvent(e); //e.target.parentNode.propname
			return this.beginHelp(propName, e.target, this.owner.inspected.declaredClass);
		    } else
			return true;
		} else if (dojo.hasClass(t, "wminspector-addevent")) {
		    var t = this.getTargetByClass(t, "wminspector-addevent");
		    if (t) {
			var eventName = dojo.attr(t.parentNode, "propname").replace(/\d*$/,"");
			var inspected = this.owner.inspected;
			for (var i = 1; inspected.eventBindings[eventName + i] !== undefined; i++) ;
			inspected.eventBindings[eventName + i] = "-";
			this.owner.inspected = null;
			this.owner.inspect(inspected, this.owner.inspectorProps);

		    }
		} else if (dojo.hasClass(t, "wminspector-prop-button")) {
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
	      bd.fixPositionNode = inNode.parentNode;
	      bd.corner = "tl";
	    if (window.location.search.match(/editpropdoc/)) {
		var classList = [];
		studio.palette.forEachNode(function(node) {
		    if (node.klass) {
			try {
			    var prototype = dojo.getObject(node.klass).prototype;
			    if (node.klass.match(/^wm\./) && node.klass != "wm.example.myButton" && prototype instanceof wm._BaseEditor == false && prototype instanceof wm.Editor == false && (!prototype.schema[inPropName] || !prototype.schema[inPropName].ignore)) {
				if (prototype[inPropName] !== undefined || prototype["get" + wm.capitalize(inPropName)] !== undefined) {
				    var name = node.klass.replace(/^.*\./,"");
				    if (dojo.indexOf(classList, name) == -1)
					classList.push(name);
				}
			    }
			} catch(e){}
		    }
		});

		dojo.forEach(classList, function(className,i) {
		    window.setTimeout(function() {
			var version = wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/,"$1");
			var url = studio.getDictionaryItem("wm.Palette.URL_CLASS_DOCS", {studioVersionNumber: version,
											 className: className.replace(/^.*\./,"") + "_" + inPropName});

			app.toastInfo("Testing " + className + "." + inPropName);
			studio.studioService.requestAsync("getPropertyHelp", [url + "?synopsis"], function(inResponse) {
			    if (inResponse.indexOf("No documentation found for this topic") != -1 || !inResponse) {
				window.open(studio.getDictionaryItem("URL_EDIT_PROPDOCS", {studioVersionNumber: wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/,"$1")}) + 
					    className + "_" + inPropName + 
					    "?parent=wmjsref_" + version + "&template=wmjsref_" + version + ".PropertyClassTemplate&name=" + className + "_" + inPropName + "&component=" + className + "&property=" + inPropName, "HelpEdit " + i);
			    }
			});
		    },
				      i * 1300);
		});
	    } else {
		if (inType == studio.application.declaredClass)
		    inType = "wm.Application";
		var url = studio.getDictionaryItem("wm.Palette.URL_CLASS_DOCS", {studioVersionNumber: wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/,"$1"),
										 className: inType.replace(/^.*\./,"") + "_" + inPropName});

		// clear previous content before showing.
		bd.page.setContent("");
		this._loadingContent = true;
		bd.show();
		studio.loadHelp(inType, inPropName, function(inResponse) {
		    wm.cancelJob("PropDoc");
		    this._loadingContent = false;
		    if (inResponse.indexOf("No documentation found for this topic") != -1 || !inResponse)
			inResponse = "<a href='" + url + "' target='docs'>Open Docs</a><br/>" + inResponse;
		    bd.page.setContent(inResponse);
		});

		//  And in case of proxy problems, show the link so the user can open it themselves
		wm.job("PropDoc", 1700, dojo.hitch(this, function() {
		    if (this._loadingContent)
			bd.page.setContent("<a href='" + url + "' target='docs'>Open Docs</a><br/>If docs fail to show here, this may be due to a proxy server; just click the link to open it in a new page"); 
		}));
	    }
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
    autoScroll: false,
	//scrollY: true,
	colCount: 3,
	preinspect: function() {
		this.inherited(arguments);
		this.groups = this.owner.inspected ? this.initGroups(this.props) : [];
	},
	generateTableContent: function() {
		var rows = [], c = this.owner.inspected;
		dojo.forEach(this.groups, dojo.hitch(this, function(g) {
		    if (g.name == "method") return;
		    if (g.name == "style") {
			var headerCells = this.generateHeaderCells();
			headerCells.push('<th class="wminspector-header wminspector-help"></th>');
			var html1 = ['<table border="0" cellspacing="0" cellpadding="0" style="width: 100%;">',
				    '<tr>', headerCells.join(''), '</tr>',
				    this.generateGroup(g),
				     '</table>'];
			var html = html1.join("");
			this.owner._inspectors.Styles.layers[0].c$[0].setHtml(html);
		    } else {
			rows.push(this.generateGroup(g));
		    }
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
						
			n = p.name;
			rows.push(
				'<tr class="',
			    this.getRowClasses(n,p),
			    '"',
			    (p.ignoretmp ? 'style="position:absolute;visibility:hidden" ' :''),
			    'id="propinspect_row_' + n + '" propName="', n, '"', inGroup.closed ? ' style="display: none;"' : '', '>',
				this.generateRowCells(n, p).join(''),
				// add a "?" button unless its a Data group.  Its assumed that a Data group contains variable/database/webservice 
				// specific information that would not reside on our wiki, but which the user should know better than us.
				(inGroup.name != "Data") ? '<td class="wminspector-help"></td>' : "", 
				'</tr>'
			);
		}
		return rows.join('');
	},
    getRowClasses: function(inName, inProp) {
	return "";
    },
	generateGroupRow: function(inGroup) {
	    var displayName = wm.extendSchemaDictionary["GROUP_"+inGroup.name] || inGroup.displayName;
	    var	closed = (wm.propertyGroups[inGroup.name] || 0).closed;
	    var img = ['<img src="images/group_', (closed ? 'closed' : 'open'), '.gif">&nbsp;'].join('');
	    var cs = " colSpan=" + this.colCount;
		return [
			'<tr class="wminspector-grouprow" onclick="wm.bubble(event)" groupRow="', inGroup.name, '">',
			'<th', cs,' class="wminspector-group">', img, displayName, '</th>',
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
		    if (name != "method")
			g.push(p);
		}));
	    for (var i in groups) {
		if (typeof(groups[i]) != "function") {
			groupsArray.push({name: i, props: groups[i]});
		}
	    }
		return groupsArray;
	},
	sortGroups: function(inGroups) {
		// sort groups
		inGroups.sort(function(a, b) {
			return ((wm.propertyGroups[a.name] || 0).order || 28) - ((wm.propertyGroups[b.name] || 0).order || 28); // things with no order go after layout and before style
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
		if (!this.owner.inspected)
			return;
		for (var i=0, g, groups=this.groups; (g=groups[i]); i++)
			for (var j=0, p; (p=g.props[j]); j++)
				if ((this.owner.inspected.schema[p.name] || 0).focus)
					return p.name;
		return "name";
	}
});

dojo.declare("wm.EventInspector", wm.Inspector, {
	preinspect: function() {
	    this.props = this.getProps();
	    for (var eventName in this.owner.inspected.eventBindings) {
		if (this.props[eventName] === undefined) {
		    this.props[eventName] = {isEvent: true, 
					     name: eventName
					    };
		    if (!dojo.isFunction(this.owner.inspected[eventName])) {
			this.owner.inspected[eventName] = function(){};
		    }
		}
	    }
	},
        reinspect: function() {this.inspect();},
	getProps: function() {
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
	},
	generateRowCells: function(inName, inProp) {
	    var editor = this.makePropEdit(inName);
	    return [
		'<td class="wminspector-caption">', this.makeRowCaption(inName.match(/\d+$/) ? "and then..." : inName, inProp), '</td>',
		'<td class="wminspector-property">', editor, '</td>',
		'<td class="wminspector-addevent">+</td>',
	    ];
	},
	generateHeaderCells: function() {
		var r = this.inherited(arguments);
		r.push('<th class="wminspector-header wminspector-addevent"></th>');		
		return r;
	}

});

dojo.declare("wm.CustomMethodInspector", wm.Inspector, {
    reinspect: function() {this.inspect();},
	getProps: function() {
		var props = this.inherited(arguments);
		for (var i in props)
			if (!props[i].isCustomMethod || props[i].ignore)
				delete props[i];
		return props;
	},
	hasCustomMethod: function(inProps) {
		var list = inProps;
		for (var i in list)
			if (list[i].isCustomMethod)
				return true;
	},
	canInspect: function(inInspected, inProps) {
/* MICHAEL 8/10/2010 (WM-1869): Commented out to enable application level event handlers 
		var appOwned = (inInspected && inInspected.isOwnedBy(studio.application));
		return !appOwned && this.hasEvents(inProps);
		*/
	    return this.hasCustomMethod(inProps);
	}
});


getPropNode = function(inTable, inProp, inCellIndex) {
	for (var i=1, rows=inTable.rows, tr, n; inProp && (tr=rows[i]); i++)
		if (tr.getAttribute("propName") == inProp)
			return (tr.cells[inCellIndex]).firstChild;
}
