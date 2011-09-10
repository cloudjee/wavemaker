/*
 *  Copyright (C) 2010-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.ListViewer");


dojo.declare("wm.ListViewerRow", wm.Container, {
    lock: true,
    layoutKind: "left-to-right",
    horizontalAlign: "left",
    verticalAlign: "top",
    border: "0,0,0,0",
    margin: "2,0,2,0",
    padding: "0",
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
        this.border = this.parent.rowBorder;
        this.borderColor = this.parent.borderColor;
	dojo.destroy(this.domNode);
        this.domNode = this.replacementNode;
        this.dom.node = this.domNode;
        delete this.replacementNode;
        
	if (!this.variable.$.binding)
	    new wm.Binding({name: "binding", owner: this.variable});

    },
	addComponent: function(inComponent) {
	    this[inComponent.name] = inComponent;
            this.inherited(arguments);
        },
    renderRow: function(inData, index) {

	// Prepare this object to represent a new row
	this.$ = this.components = {};
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
    start: function() {},
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
    _selectedIndex: -1,
    selectedItem: null,
    allowRowSelection: false,
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
        this.selectedItem = new wm.Variable({name: "selectedItem", owner: this});
	this.setDataSet(this.dataSet);

        if (this.dataSet && this.dataSet._requester) 
            this.setLoadingImageShowing(true);
        

        if (this.pageName)
	    this.setPageName(this.pageName);
	this.connect(this.domNode, "onscroll", this, "scheduleRenderRows");
    },
    setLoadingImageShowing: function(inShowing) {
        if (inShowing) {
            this.domNode.style.backgroundImage = "url(" + dojo.moduleUrl("wm.base.widget.themes.default.images") + "loadingThrobber.gif)";
            this.domNode.style.backgroundPosition = "50% 50%";
            this.domNode.style.backgroundRepeat = "no-repeat";
        } else {
            this.domNode.style.backgroundImage = "";
            this.domNode.style.backgroundPosition = "";
            this.domNode.style.backgroundRepeat = "";
        }
    },
    setBorderColor: function(inColor) {
        this.inherited(arguments);
        dojo.forEach(this.rowRenderers, function(r) {r.setBorderColor(inColor);});        
    },
    setRowBorder: function(inBorder) {
        this.rowBorder = inBorder;
        dojo.forEach(this.rowRenderers, function(r) {r.setBorder(inBorder);});
    },
    editTemplate: function(inWidgets) {
        // WARNING: This widget has already been destroyed before this call is made; be VERY careful what you put in here!
        var variable = inWidgets.variable;
        if (this.dataSet) {
            variable[1].type = this._type;
            variable[1].json = this._sample;
        }
    },
    setPageName: function(inPage) {
	if (inPage == "-New Page" && this.isDesignLoaded()) {
	    if (!this.dataSet) {
		app.toastWarning(studio.getDictionaryItem("wm.ListViewer.NO_DATASET"));
		return;
	    }
	    return this.createNewPage();
	}
	this.pageName = inPage;
        if (!inPage) {
            for (var i = 0; i < this.rowRenderers.length; i++)
                dojo.forEach(this.rowRenderers[i].c$, function(e) {e.destroy();});
            return;
        }
	var path = this.getPath() + wm.pagesFolder + inPage + "/" + inPage + ".widgets.js";
	try {
	    if (!dojo.getObject(inPage))
		window[inPage] = {};

	this._widgetsJson = dojo.fromJson(dojo._getText(path));
	path = this.getPath() + wm.pagesFolder + inPage + "/" + inPage + ".js";
	this._js = dojo._getText(path).replace(/dojo.declare\(\".*?\"\s*,\s*wm\.Page\s*,/,"(").replace(/;\s*$/,"");
	console.log(this._js);

	    this._js = dojo.fromJson(this._js);

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
		
	    } else if (i == "variable") {
		delete inComponents[i]; // get rid of the "variable" as that will be created as part of the listviewer row
	    }
	}
    },
    setDataSet: function(inDataSet) {
        if (app.dontdothat) return;
	if (this.dataSet && this.manageLiveVar) {
	    dojo.disconnect(this._dataSetConnection);
            dojo.disconnect(this._loaderConnection);
        }
	this.dataSet = inDataSet;
	if (inDataSet && inDataSet instanceof wm.Variable) {
            this.selectedItem.setType(inDataSet.type);
	    var h = this.avgHeight;

	    if (this.manageLiveVar)
		this._dataSetConnection = dojo.connect(this.dataSet, "onSuccess", this, "renderRows");

            if (this.dataSet.onBeforeUpdate)
                this.connect(this.dataSet, "onBeforeUpdate", this, function() {
                    this.setLoadingImageShowing(true);
                });

	    for (var i = 0; i < this.rowRenderers.length; i++) {
                if (this.rowRenderers[i].variable.type != inDataSet.type)
                    this.rowRenderers[i].variable.setType(inDataSet.type);
            }

	    var length;
	    if (this.manageLiveVar) {
		this.dataSet.maxResults = Math.max(20,this.bounds.h * 2 / h);
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
	this.renderRows(); 
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
    scheduleRenderRows: function() {
        wm.job(this.getRuntimeId() + ".renderRows", 10, dojo.hitch(this, "renderRows"));
    },
    addOnClickHandler: function(i) {
        this.connect(this.nodes[i], "onclick", this, function() {
            this.setSelectedIndex(i);
        });
    },
    setSelectedIndex: function(i) {
        if (this._selectedIndex != -1) {
            dojo.removeClass(this.nodes[this._selectedIndex], "ListViewerSelectedItem");
        }
        i = parseInt(i);
        if (!isNaN(i) && i >= 0) {
            this._selectedIndex = i;
            dojo.addClass(this.nodes[this._selectedIndex], "ListViewerSelectedItem");
            this.selectedItem.setData(this.rowRenderers[i].variable);
            this.onSelection(this.rowRenderers[i], this.rowRenderers[i].variable);

        } else {
            this._selectedIndex = -1;
        }
    },
    onSelection: function(inRowWidget, inRowVariable) {},
    onRenderRow: function(inRowWidget, inRowVariable) {},
    onRerenderRow: function(inRowWidget, inRowVariable) {},
    getSelectedIndex: function() {
        return this._selectedIndex;
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
        var realSum = 0;
	var heightCount = 0;
	var curAvg = this.avgHeight;
        var realAvg = 0;
        var realAvgCount = 0;
	var bounds = this.getContentBounds();
        var lastRenderedRowIndex = 0;

	var length;
	if (this.manageLiveVar) 
	    length = this.dataSet.dataSetCount-1; // fix to this also in setDataSet
	else
	    length = this.dataSet.getCount();

        /* Iterate over every row, creating each row, and then rendering each one that is scrolled into view */
	for (var i = 0; i < length; i++) {
	    this.currentRenderer = this.rowRenderers[i];	    

            /* If there is no rowRenderer, create one; so we'll have an empty rowRenderer for each row; row is empty until 
             * we call renderRow and variable.setDataSet 
             */
	    if (!this.currentRenderer) {
		var name = "rowRenderer" + i;
		this.currentRenderer = this[name] = this.rowRenderers[i] = dojo.mixin(new wm.ListViewerRow({name: name, owner: this, parent: this, replacementNode: this.nodes[i]}), this._js);
		this.currentRenderer.variable.setType(this.dataSet.type);
		this.nodes[i].id = this.currentRenderer.getId() + "_row" + i;
                if (this.allowRowSelection) {
                    this.addOnClickHandler(i);
                }
                this.currentRenderer._noData = true;
/*
                dojo.destroy(this.currentRenderer.domNode);
                this.currentRenderer.domNode = this.nodes[i];
                this.currentRenderer.dom.domNode = this.nodes[i];

                */
		this.currentRenderer.bounds.h = curAvg;
	    }

	    this.currentRenderer.bounds.w = bounds.w;

            // for each row that is visible, render it
	    if (this.isScrolledIntoView(heightSum, this.currentRenderer.bounds.h , bounds)) {

                // If there are no widgets in the rowRenderer, then it needs to be rendered.  If there's no data from the
                // server, insure that we have data from the server and call setData on the renderer's wm.Variable.
		if (this.currentRenderer._noData) {
		    if (!data[i] && !this.dataSet._requester) {
			    this.dataSet.firstRow = i;
                            this.dataSet.update();
                            //this.dataSet.setPage(Math.floor(i/(this.dataSet.maxResults || 1)));
                    } else if (data[i]) {
                        //this.currentRenderer.variable.$.binding.addWire("", "dataSet", this.dataSet.getItem(i).getId());
			this.currentRenderer.variable.setDataSet(this.dataSet.getItem(i));
			delete this.currentRenderer._noData;
		    }
                }

                // If the row has widgets in it, then call renderBounds and reflow; else call renderRow to load the widgets.
		this.currentRenderer.inFlow = true;
                var resetData = this.currentRenderer.c$.length && data[i] && data[i] != this.currentRenderer.__lookupData;
                //console.log("HEY:"+ resetData);
                if (resetData) {
                    this.currentRenderer.variable.setData(data[i]);
                    this.currentRenderer.start();
                    this.currentRenderer.__lookupData = data[i];
                    this.onRenderRow(this.currentRenderer, this.currentRenderer.variable);
                }
		else if (this.currentRenderer.c$.length || this.currentRenderer._noData) {
		    this.currentRenderer.renderBounds();
		    this.currentRenderer.reflow();
                    if (!this.currentRenderer._noData)
                        this.onRerenderRow(this.currentRenderer, this.currentRenderer.variable);
		} else {
		    this.currentRenderer.renderRow(data[i], i);
                    this.currentRenderer.start();
                    this.currentRenderer.__lookupData = data[i];
                    this.onRenderRow(this.currentRenderer, this.currentRenderer.variable);
                }
                lastRenderedRowIndex = i;
	    } else {
		this.currentRenderer.inFlow = false;
                if (this.currentRenderer.c$.length == 0 && !this.currentRenderer._avgHeightSet) {
                    var avg =  (realAvgCount >= 5) ? realAvg : curAvg;
		    this.currentRenderer.bounds.h = avg;
		    this.currentRenderer.height = avg + "px";
                    this.currentRenderer._avgHeightSet = true;
                }
            }
	    this.currentRenderer.bounds.w = bounds.w;
	    this.currentRenderer.bounds.t = heightSum;
	    this.currentRenderer.domNode.style.top = heightSum + "px";
	    this.currentRenderer.domNode.style.height = this.currentRenderer.bounds.h + "px";

            //console.log(i + ": " + heightSum + ", INC:" + this.currentRenderer.getPreferredFitToContentHeight());
            //var curHeight = this.currentRenderer.getPreferredFitToContentHeight();
            var curHeight = this.currentRenderer.bounds.h;
	    heightSum += curHeight;
	    heightCount++;
            if (this.currentRenderer.c$.length) {
                realSum += curHeight;
                realAvgCount++;
            }
            realAvg = Math.floor(realSum/realAvgCount);
	    curAvg = Math.floor(heightSum/heightCount);
	}
        this.setLoadingImageShowing(false);
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
    },
    setRowBorder: function(inBorder) {
        this.rowBorder = inBorder;
        dojo.forEach(this.rowRenderers, function(r) {r.setBorder(inBorder);});
    },

    _end: 0
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
                                 this._type = this.dataSet.type;
                                 var data = this.dataSet.getData();
                                 if (data && data.length)
                                     this._sample = dojo.toJson(data[0]);
				 studio.confirmSaveDialog.page.setup(
				     studio.getDictionaryItem("CONFIRM_OPEN_PAGE", {oldPage: studio.project.pageName, newPage: this.pageName}),
				     dojo.hitch(this,function() {
					 studio.project.saveProject(false, dojo.hitch(this, function() {
					     studio.project.newPage(n,"wm.ListViewerRow", {template: wm.widgetSpecificTemplate.ListViewerRow, editTemplate: dojo.hitch(this, "editTemplate")});
					 }));
				     }),
				     dojo.hitch(this,function() {
					 studio.project.newPage(n,"wm.ListViewerRow", {template: wm.widgetSpecificTemplate.ListViewerRow, editTemplate: dojo.hitch(this, "editTemplate")});
				     }));
			     }));						 
    }
});

wm.Object.extendSchema(wm.ListViewer, {
    dataSet: { readonly: true, group: "data", order: 1, bindTarget: 1, type: "wm.Variable", isList: true},
    pageName: {group: "common", type: "string", order: 50},
    customGetValidate:  {ignore: true},
    fitToContentWidth:  {ignore: true},
    fitToContentHeight:  {ignore: true},
    imageList: {ignore: true},
    lock: {ignore: true},
    selectedItem: { ignore: 1, bindSource: 1, isObject: true, simpleBindProp: true },    
    autoScroll: {ignore: true, writeonly: 1},
    scrollX: {ignore: true, writeonly: 1},
    scrollY: {ignore: true, writeonly: 1},
    touchScrolling: {ignore: true, writeonly: 1}
});

