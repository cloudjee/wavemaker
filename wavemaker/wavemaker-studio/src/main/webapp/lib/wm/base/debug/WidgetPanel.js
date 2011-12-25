/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.debug.WidgetPanel");

dojo.declare("wm.debug.WidgetPanel", wm.Container, {
    layoutKind: "left-to-right",

/* This hack (providing getRoot and getRuntimeId) is needeed to be able to write event handlers such as onShow: "serviceGridPanel.activate"; without it, we'd need something like
 * app.debugDialog.serviceGridPanel.activate
 */
    getRoot: function() {
	return this;
    },
	getRuntimeId: function(inId) {
		inId = this.name + (inId ? "." + inId : "");
		return this.owner != app.pageContainer ? this.owner.getRuntimeId(inId) : inId;
	},
	getId: function(inName) {
		return inName;
	},

    postInit: function() {
	this.inherited(arguments);

	var typeDef = this.createComponents({debugWidgetType: ["wm.TypeDefinition", {internal: true}, {}, {
	    field100: ["wm.TypeDefinitionField", {"fieldName":"page","fieldType":"string"}, {}],
	    field101: ["wm.TypeDefinitionField", {"fieldName":"name","fieldType":"string"}, {}],
	    field102: ["wm.TypeDefinitionField", {"fieldName":"id","fieldType":"string"}, {}],
	    field104: ["wm.TypeDefinitionField", {"fieldName":"type","fieldType":"string"}, {}],
	    field105: ["wm.TypeDefinitionField", {"fieldName":"showing","fieldType":"boolean"}, {}]
	}]}, this)[0];
	//typeDef.setOwner(this);
	wm.typeManager.types.debugWidgetType.fields.id.include = ["update"];

	var typeDef = this.createComponents({debugBindingType: ["wm.TypeDefinition", {internal: true}, {}, {
	    field201: ["wm.TypeDefinitionField", {"fieldName":"fieldName","fieldType":"string"}, {}],
	    field202: ["wm.TypeDefinitionField", {"fieldName":"dataValue","fieldType":"string"}, {}],
	    field204: ["wm.TypeDefinitionField", {"fieldName":"boundTo","fieldType":"string"}, {}],
	     field205: ["wm.TypeDefinitionField", {"fieldName":"expression","fieldType":"boolean"}, {}],
	    field206: ["wm.TypeDefinitionField", {"fieldName":"id","fieldType":"boolean"}, {}],
	    field207: ["wm.TypeDefinitionField", {"fieldName":"errors","fieldType":"boolean"}, {}]
	}]}, this)[0];
	//typeDef.setOwner(this);
	wm.typeManager.types.debugBindingType.fields.fieldName.include = ["update"];


	var components = this.createComponents({
	    widgetListVar:  ["wm.Variable", {type: "debugWidgetType", isList: true}],
	    pageListVar: ["wm.Variable", {type: "StringData", isList: true}],

	    classListVar:["wm.Variable", {type: "StringData", isList: true}],
	    gridPanel: ["wm.Panel", {layoutKind: "top-to-bottom", width: "100%", height: "100%",  verticalAlign: "top", horizontalAlign: "left"},{},{
		searchPanel: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "30px", verticalAlign: "top", horizontalAlign: "left"},{},{
		    searchNameText: ["wm.Text", {resetButton: true, _resetButtonUrl: dojo.moduleUrl("lib.images.silkIcons").path + "arrow_undo.png", width: "100px", placeHolder: "Widget Name", changeOnKey: true},{onchange: "searchChange"}],
		    searchClassText: ["wm.SelectMenu", {allowNone: true, emptyValue: "emptyString", restrictValues: false, width: "100px", placeHolder: "Class Name", changeOnKey: true},{onchange: "searchChange"},{
			binding: ["wm.Binding", {"name":"binding"}, {}, {
			    wire: ["wm.Wire", {"expression":undefined,"name":"wire","source":"classListVar","targetProperty":"dataSet"}, {}]
			}]
		    }],
		    pagesMenu: ["wm.SelectMenu", {placeHolder: "Page name", width: "80px",displayField: "dataValue", dataField: "dataValue", allowNone:true},{onchange: "searchChange"},{
			binding: ["wm.Binding", {"name":"binding"}, {}, {
			    wire: ["wm.Wire", {"expression":undefined,"name":"wire","source":"pageListVar","targetProperty":"dataSet"}, {}]
			}]
		    }],		    
		    inspectParentButton: ["wm.Button",  {width: "80px", height: "20px", margin:"0",margin:"2",caption: "Inspect Parent",border:"1",borderColor:"#666"}, {onclick: "inspectParent"},{
			binding: ["wm.Binding", {"name":"binding"}, {}, {
			    wire: ["wm.Wire", {"expression":undefined,"name":"wire","source":"widgetGrid.emptySelection","targetProperty":"disabled"}, {}]
			}]
		    }]
		}],
		widgetGrid: ["wm.DojoGrid", 
			     {width: "100%", height: "100%","columns":[
				 {"show":true,"field":"page","title":"Page","width":"80px","align":"left","formatFunc":""},
				 {"show":true,"field":"name","title":"Name","width":"100%","align":"left","formatFunc":""},
				 {"show":true,"field":"type","title":"Class","width":"120px","align":"left","formatFunc":""}
			     ],
			      "margin":"4",
			      "name":"widgetGrid"}, {onSelectionChange: "showWidget"}, {
				  binding: ["wm.Binding", {"name":"binding"}, {}, {
				      wire: ["wm.Wire", {"expression":undefined,"name":"wire","source":"widgetListVar","targetProperty":"dataSet"}, {}]
				  }]
			      }]
	    }],
	    splitter: ["wm.Splitter",{showing:false, bevelSize: "4"}],
	    inspector: ["wm.debug.Inspector", {}, {onXClick: "XClick"}]
	},this);
    },
	XClick: function() {
	    this.widgetGrid.deselectAll();
	},
    inspectParent: function() {
	this.showWidget(null, this.selectedItem.parent.getRuntimeId());
    },
	showWidget: function(inSender, altId) {
	var id = altId || this.widgetGrid.selectedItem.getValue("id");
	if (!id) {
	    this.selectedItem = null;
	    this.widgetGrid.setColumnShowing("page",true, true);
	    this.widgetGrid.setColumnShowing("type",true, false); 
	    this.inspector.hide();
	    this.$.gridPanel.setWidth("100%");
	    this.searchNameText.show();
	    this.searchClassText.show();
	    this.pagesMenu.show();
	    return;
	}

	    this.searchNameText.hide();
	    this.searchClassText.hide();
	    this.pagesMenu.hide();

	this.selectedItem = app.getValueById(id);
	this.widgetGrid.setColumnShowing("page",false, true);
	this.widgetGrid.setColumnShowing("type",false, false);
	this.inspector.setShowing(true);	
	    this.$.gridPanel.setWidth("300px");
	this.inspector.inspect(this.selectedItem);

	if (!this.selectionNode) {
	    this.selectionNode = document.createElement("div");
	    dojo.addClass(this.selectionNode, "wmdebuggerSelectionNode");
	    document.body.appendChild(this.selectionNode);
	}
	if (!this.selectedItem.isAncestorHidden()) {
	    var coords = dojo.coords(this.selectedItem.domNode);
	    dojo.marginBox(this.selectionNode, {l: parseInt(coords.x),
						t: parseInt(coords.y),
						w: coords.w,
						h: coords.h});
	    this.selectionNode.style.display = "block";
	    var self = this;
	    wm.job(this.getRuntimeId() + ".dismissSelectionNode", 5000, function() {
		self.selectionNode.style.display = "none";
	    });
	}
    },

    searchChange: function(inSender) {
	var q = {};
	var name = this.searchNameText.getDataValue();
	if (name) {
	    q.name = "*" + name + "*";
	}

	var className = this.searchClassText.getDataValue();
	if (className) {
	    q.type = "*" + className + "*";
	}

	var page = this.pagesMenu.getDataValue();
	if (page) {
	    q.page = page;
	}
	this.widgetGrid.setQuery(q);
	inSender.focus();
    },
   activate: function() {
	this.generateWidgetList();
	this.generatePagesList();
    },
    deactivate: function() {
    },
    generateWidgetList: function() {
	this.widgetListVar.beginUpdate();
	this.widgetListVar.clearData();

	for (var id in wm.Component.byId) {
	    var c = wm.Component.byId[id];
	    //if (c instanceof wm.Control == false) continue; // allow nonvisual components so they can use the bind panel
	    if (c instanceof wm.Control) {
		if (c == app.debugDialog ||  c.isAncestor(app.debugDialog)) continue;
		if (c.isAncestor(app.pageDialog)) continue;
	    } else {
		if (c.isAncestorInstanceOf(wm.debug.Dialog)) {
		    continue;
		}
	    }
	    var page = c.getParentPage();
	    var pageName =  page ? page.declaredClass : "app";
	    var localId = c.getId();
	    if (c instanceof wm.Page) {
		componentName = c.declaredClass;
	    } else if (localId) {
		componentName = c.getId().replace(/^app\./,"");
	    } else {
		continue;
	    }
	    var itemData = {page: pageName,
			    name: componentName,
			    id: c.getRuntimeId(),
			    type: c.declaredClass,
			    showing: c.showing};
	    if (componentName) {
		this.widgetListVar.addItem(itemData);
	    }
	}

	this.widgetListVar.endUpdate();	    
	this.widgetListVar.notify();


	this.classListVar.beginUpdate();
	this.classListVar.clearData();
	for (name in wm) {
	    if (wm[name] && wm[name].prototype && wm[name].prototype instanceof wm.Component) {
		this.classListVar.addItem({dataValue: name});
	    }
	}
	this.classListVar.endUpdate();
	this.classListVar.notify();
    },
    generatePagesList: function() {
	this.pageListVar.beginUpdate();
	this.pageListVar.setData([{dataValue: "app"}]);

	for (var pageName in wm.Page.byName) {
	    this.pageListVar.addItem({dataValue: pageName});
	}

	this.pageListVar.endUpdate();	    
	this.pageListVar.notify();
    },
    showWidgetTabs: function(inSender) {
	var hasSelection = this.widgetGrid.hasSelection();
	this.widgetGrid.setColumnShowing("page",!hasSelection, true);
	    this.widgetGrid.setColumnShowing("type",!hasSelection, true);
	this.inspector.setShowing(hasSelection);	
	this.widgetGrid.setWidth(hasSelection ? "150px" : "100%");
	if (hasSelection) {

	    // shortcut; already know that 
	    
	    if (!data) {
		this.requestLayer.hide();
		this.dataLayer.hide();
	    } else if (app.getValueById(data.id) instanceof wm.ServiceVariable == false) {
		this.requestLayer.hide();
		this.dataLayer.setCaption("Data");
		this.dataLayer.show();
	    } else {
		this.requestLayer.show();
		this.dataLayer.setCaption("Response");
		this.dataLayer.show();

	    }
	    this.splitter.show();
	    this.splitter.findLayout();
	} else {
	    this.splitter.hide();
	}
    }
});
