/*
 *  Copyright (C) 2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.widget.ListViewer");


dojo.declare("wm.ListViewerRow", wm.Container, {
    lock: true,
    layoutKind: "left-to-right",
    horizontalAlign: "left",
    verticalAlign: "top",
    border: "0,0,0,0",
    margin: "2,0,2,0",
    padding: "4",
    width: "100%",
    height: "40px",
/*
    widgetsJson: {	
	label1: ["wm.Label", {width: "100px", height: "20px"}, {}, {
	    binding: ["wm.Binding", {}, {}, {
		wire: ["wm.Wire", {"targetProperty":"caption","source":"variable.dataValue.hey"}, {}]
	    }]
	}],
	label2: ["wm.Label", {width: "100px", height: "20px"}, {}, {
	    binding: ["wm.Binding", {}, {}, {
		wire: ["wm.Wire", {"targetProperty":"caption","source":"variable.dataValue.you"}, {}]
	    }]
	}]},
	*/
    variable: null,
    itemNumber: null,
    init: function() {
	this.inherited(arguments);
	this.variable = new wm.Variable({name: "variable", owner: this});
	this.itemNumber = new wm.Variable({name: "itemNumber", owner: this, type: "NumberData"});
	this._first = true;
        this.border = this.parent.rowBorder;
    },
    renderRow: function(inData, inNode, index) {
	if (this._first) {
	    dojo.destroy(this.domNode);
	    this._first = false;
	}
	// Prepare this object to represent a new row
	this.domNode = inNode;
	this.dom.node = inNode;
	this.components = {};
	this.c$ = [];
	this.widgets = {};
	this.domNode.innerHTML = "";
	this.variable.setData(inData);
	this.itemNumber.setData({dataValue: index+1});
	
	var widgetsJson = dojo.clone(this.owner._widgetsJson);
	this.fixWireIds(widgetsJson);

	this.createComponents(widgetsJson, this);
	//this.destroyWires(this);
	this.invalidCss = true;
	this.render();

	this.reflow();
	this.renderBounds();

    },
    renderBounds: function() {
        this.inherited(arguments);
        this.parent.updateRowTops();
    },
    reflow: function() {
        this.inherited(arguments);
        this.bounds.h = this.getPreferredFitToContentHeight();
        this.renderBounds();
    },
    fixWireIds: function(inComponents) {
	for (var i in inComponents) {
	    var c = inComponents[i];
	    if (c[0] == "wm.Wire") {
		c[1].source = this.getId() + "." + c[1].source;
		if (c[1].expression) {
		    c[1].expression = c[1].expression.replace(this.owner._wireRegex, "${" + this.getId() + ".$1");
		}
	    }
	    this.fixWireIds(c[3]);
	}
    },
/*
    destroyWires: function(inComponent) {
	// don't want wires to modify individual rows when we don't have live components to listen to those wires
	if (inComponent instanceof wm.ListViewerRow == false)
	    for (var i in inComponent.components) {
		if (inComponent.components[i] instanceof wm.Binding) {
		    inComponent.components[i].destroy();
		    delete inComponent.components[i];
		}
	    }

	var length = (inComponent.c$) ? inComponent.c$.length : 0;
	for (var i = 0; i < length; i++) {
	    this.destroyWires(inComponent.c$[i]);
	}
    },

    makeEvents: function(inEvents, inComponent) {
	this.owner.owner.makeEvents(inEvents, inComponent); // pass event binding up to something whose owner is the page, as the page is where the functions and other handlers are
    }
    */
});




/* TODO: Only render rows that are visible
 * auto loading new rows from server?
 */
dojo.declare("wm.ListViewer", wm.Container, {
    lock: true,
    manageLiveVar: false,
    scrollX: false,
    scrollY: true,
    dataSet: null,
    pageName: "",
    width: "100%",
    height: "100%",
    avgHeight: 150,
    rowBorder: "0,0,0,0",
/*
    dataSet: [{hey: "there", you: "guys"},
	      {hey: "there2", you: "guys2"},
	      {hey: "there3", you: "guys3"}],
	      */
    // why use an object for this? So you can subclass it and change how 
    // your row is generated. Is this needed? Too early in this exploration to know.
    rowRenderers: null,
    currentRenderer: null,
    nodes: null,
    init: function() {
	this.inherited(arguments);
	this._wireRegex = new RegExp("\\$\\{(variable|itemNumber)", "g");

	this.nodes = [];
	this.rowRenderers = [];
	this.currentRenderer = this.rowRenderers[0];

	this.setDataSet(this.dataSet);
        if (this.pageName)
	    this.setPageName(this.pageName);
	this.connect(this.domNode, "onscroll", this, "renderRows");
    },
    setRowBorder: function(inBorder) {
        this.rowBorder = inBorder;
        dojo.forEach(this.rowRenderers, function(r) {r.setBorder(inBorder);});
    },
    createNewPage: function() {
	var pages = studio.project.getPageList();
	studio.project.variableType = this.dataSet.type;

	var l = {};
	dojo.forEach(pages, function(p) {
	    l[p] = true;
	});
        studio.promptForName("page", wm.findUniqueName("Row", [l]), pages,
                             dojo.hitch(this, function(n) {
				 n = wm.capitalize(n);
				 this.pageName = n;
				 app.confirm("Can we save this page before moving on to the next page?", 
					     false,
					     dojo.hitch(this,function() {
						 studio.project.saveProject();
						 studio.project.newPage(n,"wm.ListViewerRow", {type:this.dataSet.type, json: dojo.toJson(this.dataSet.getData()[0])});
					     }),
					     dojo.hitch(this,function() {
						 studio.project.newPage(n,"wm.ListViewerRow", {type:this.dataSet.type});
					     }));
			     }));						 
    },
    setPageName: function(inPage) {
	if (inPage == "-New Page" && this.isDesignLoaded()) {
	    return this.createNewPage();
	}
	this.pageName = inPage;
	var path = this.getPath() + wm.pagesFolder + inPage + "/" + inPage + ".widgets.js";
	try {
	    if (!dojo.getObject(inPage))
		window[inPage] = {};

	this._widgetsJson = dojo.fromJson(dojo._getText(path));
	path = this.getPath() + wm.pagesFolder + inPage + "/" + inPage + ".js";
	this._js = dojo._getText(path).replace(/dojo.declare\(\".*?\"\s*,\s*wm\.Page\s*,/,"(").replace(/;\s*$/,"");
	console.log(this._js);

	    this._js = dojo.fromJson(this._js);
	    delete this._js.start;
	} catch(e) {
	    console.error(e);
	    delete window[inPage]; // if we failed to assign it, the existence of this object will block project.findUniqueName from working. Especially if we're trying to recreate a page
	}
	
	this.cleanupWidgets(this._widgetsJson);
	this.renderRows(); 
    },
    cleanupWidgets: function(inComponents) {
	for (var i in inComponents) {
	    var c = inComponents[i];
	    if (c[0] == "wm.Layout") {
		c[0] = "wm.Panel";
		if (!c[1].layoutKind) 
		    c[1].layoutKind = "top-to-bottom"; // layout kind that is default for wm.Layout
		c[1].height = "100px";
		c[1].fitToContentHeight = true;
		c[1].verticalAlign = "top";
		c[1].horizontalAlign = "top";
		
	    } else {
		delete inComponents[i]; // get rid of all variables and nonvisual components that are outside of wm.Layout
	    }
	}
    },
    setDataSet: function(inDataSet) {
	if (this.dataSet && this.manageLiveVar)
	    dojo.disconnect(this._dataSetConnection);
	this.dataSet = inDataSet;
	if (inDataSet && inDataSet instanceof wm.Variable) {
	    var h = this.avgHeight;

	    if (this.manageLiveVar)
		this._dataSetConnection = dojo.connect(this.dataSet, "onSuccess", this, "renderRows");

	    for (var i = 0; i < this.rowRenderers.length; i++)
		this.rowRenderers[i].variable.setType(inDataSet.type);

	    var length;
	    if (this.manageLiveVar) {
		this.dataSet.maxResults = Math.max(20,this.bounds.h * 2 / h);
		this._totalPages = this.dataSet.getTotalPages() || 1;
		length = this.dataSet.dataSetCount-1; // fix to this also in renderRows
	    } else
		length = this.dataSet.getCount();


	    for (var i = 0; i < length; i++) {
		if (!this.nodes[i]) {
		    this.nodes[i] = document.createElement("div");		
		    var s = this.nodes[i].style;
		    s.position = "absolute";
		    s.top = (h * i) + "px";
		    s.height = h + "px";
                    s.width = this.bounds.w + "px";
		    this.domNode.appendChild(this.nodes[i]);
                    if (this.rowRenderers[i]) {
                        dojo.destroy(this.rowRenderers[i].domNode);
                        this.rowRenderers[i].domNode = this.nodes[i];
                    }
		}
	    }
		// if the list has shrunk, delete the excess dom nodes
		for (i = this.nodes.length-1; i >= length; i--) {
		    this.rowRenderers.pop().destroy();
                    dojo.destroy(this.nodes.pop());
		}
	    if (!this._cupdating)
		this.renderRows();
	}
    },
    destroy: function() {
	for (var i = 0; i < this.nodes.length; i++) dojo.destroy(this.nodes[i]);
	delete this.nodes;
	dojo.disconnect(this._dataSetConnection);
	this.inherited(arguments);
    },
    postInit: function() {
	this.inherited(arguments);
	//this.renderRows();
    },
    renderBounds: function() {
	this.inherited(arguments);
	this._hasBounds = true;
	this.renderRows(); // can't properly render the rows until we have a size of our own. keep in mind we can't just call reflow on all rows; all rows are rendered by a single renderer object
    },
    updateRowTops: function() {
        if (!this._renderingRows) {
	    var heightSum = 0;
	    for (var i = 0; i < length; i++) {
	        var r = this.rowRenderers[i];
                r.domNode.style.top = heightSum + "px";
                heightSum += r.bounds.h;
            }
        }
            
    },
    renderRows: function() {
	if (!this._hasBounds) return;
	if (!this.dataSet || this.dataSet instanceof wm.Variable == false || !this._widgetsJson) return;

	var data = this.dataSet.getData();
	if (!data || data.length == 0) return;
	if (this.dataSet.firstRow) {
	    var placeholder = [];
	    for (var k = 0; k< this.dataSet.firstRow; k++) placeholder.push("");
	    data = placeholder.concat(data);
	}
        this._renderingRows = true;	
	
	var heightSum = 0;
	var heightCount = 0;
	var curAvg = this.avgHeight;
	var bounds = this.getContentBounds();

	var length;
	if (this.manageLiveVar) 
		length = this.dataSet.dataSetCount-1; // fix to this also in setDataSet
	else
	    length = this.dataSet.getCount();

	for (var i = 0; i < length; i++) {
	    this.currentRenderer = this.rowRenderers[i];	    
	    if (!this.currentRenderer) {
		var name = "rowRenderer" + i;
		this.currentRenderer = this[name] = this.rowRenderers[i] = dojo.mixin(new wm.ListViewerRow({name: name, owner: this, parent: this}), this._js);
		this.currentRenderer.variable.setType(this.dataSet.type);
		this.nodes[i].id = this.currentRenderer.getId() + "_row" + i;
		this.currentRenderer.bounds.h = curAvg;
		this.currentRenderer.height = curAvg + "px";
	    }


	    this.currentRenderer.bounds.w = bounds.w;


	    if (this.isScrolledIntoView(heightSum, this.currentRenderer.bounds.h , bounds)) {
		if (this.currentRenderer.c$.length == 0) {
		    if (!data[i]) {
			if (!this.dataSet._requester) 
			    this.dataSet.setPage(Math.floor(i/(this.dataSet.maxResults || 1)));
			this.currentRenderer._noData = true;
		    }
		} else if (data[i] && this.currentRenderer._noData) {
			this.currentRenderer.variable.setData(data[i]);
			delete this.currentRenderer._noData;
		}

		this.currentRenderer.inFlow = true;
		if (this.currentRenderer.c$.length) {
		    this.currentRenderer.renderBounds();
		    this.currentRenderer.reflow();
		} else
		    this.currentRenderer.renderRow(data[i], this.nodes[i], i);
	    } else 
		    this.currentRenderer.inFlow = false;

	    this.currentRenderer.bounds.w = bounds.w;
	    this.currentRenderer.bounds.t = heightSum;
	    this.currentRenderer.domNode.style.top = heightSum + "px";
            console.log(i + ": " + heightSum + ", INC:" + this.currentRenderer.getPreferredFitToContentHeight());
	    heightSum += this.currentRenderer.getPreferredFitToContentHeight();
	    heightCount++;
	    curAvg = Math.floor(heightSum/heightCount);
	}
        delete this._renderingRows;

    },
    isScrolledIntoView: function(nodeTop, nodeHeight, bounds) {
	var top = this.domNode.scrollTop;
	var bottom = top + bounds.h;
	var nodeBottom = nodeTop + nodeHeight;
	return (nodeBottom >= top && nodeTop <= bottom);
    },
    getTargetItem: function(inSender) {
	var c = inSender;
	while (c != this && c instanceof wm.ListViewerRow == false)
	    c = c.parent;
	var index = dojo.indexOf(this.rowRenderers, c);
	if (index >= 0)
	    return this.dataSet.getItem(index);
    }

});

// design only
wm.ListViewer.extend({
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "pageName":
		    return new wm.propEdit.PagesSelect({component: this, name: inName, value: inValue, newPage: true});
			case "dataSet":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.dataSet ? this.dataSet.getId() : "", allowAllTypes: true, listMatch: true});
		}
		return this.inherited(arguments);
	},
	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
			var ds = this.getValueById(inDataSet);
			if (ds)
				this.components.binding.addWire("", "dataSet", ds.getId());
		} else
			this.setDataSet(inDataSet);
	}
});

wm.Object.extendSchema(wm.ListViewer, {
	dataSet: { readonly: true, group: "data", order: 1, bindTarget: 1, type: "wm.Variable", isList: true},
	pageName: {group: "common", bindable: 1, type: "string", order: 50}
});

