/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.mobile.List");
dojo.require("dojox.mobile.app.List");

dojo.declare("wm.mobile.DojoList", dojox.mobile.app.List, {
    /* Bypasses the _loadTemplate logic which assumes itemTemplate contains a URL to a template file to be loaded */
    _loadTemplate: function(url, thisAttr, callback){
	callback();
    },
    applyTemplate: function(template, data){
	if (this.displayFunc) {
	    return dojo._toDom(this.displayFunc(data));
	} else {
	    return dojo._toDom(dojo.string.substitute(
		template, data, this._replaceToken, this.formatters || this));
	}
    }


});



dojo.declare("wm.mobile.BasicList", wm.mobile.Container, {    
    lock: true,
    scrim: true,
    selectionMode: "single",
    emptySelection: true,
    useSearchBar: false,
    useNewButton: true,
    width: "100%",
    height: "100%",
    updateNow: "(update now)",
    classNames: "wmmoblist wmmobbasiclist",

    displayField: "dataValue",
    dataField: "dataValue",
    displayExpression: "",
    imageIndexFieldExpression: "", // more efficient/less customizable alternative to photoField

    dataSet: null,
    selectedItem: null,

    rowArrows: true,
    nextLayer: "",

    horizontalAlign: "left",
    verticalAlign: "top",
    init: function() {
	this.inherited(arguments);
	if (this.useSearchBar) {
	    this.createSearchBar();
	}
	if (this.useNewButton) {
	    this.createNewButton();
	}

	this.scrollerControl = new wm.Control({owner: this,
					       name: "scrollerControl",					       
					       parent: this,
					       width: "100%",
					       height: "100%",
					       flags: {notInspectable: true}})
	var scrollNode = this.scrollerControl.domNode;
	var listNode = document.createElement("div");
	scrollNode.appendChild(listNode);
	this.domNode.appendChild(scrollNode);

	this.dojoObj = new wm.mobile.DojoList({
	    autoDelete: true,
	    enableHold: false,
	    itemTemplate: this.generateItemTemplate(),
	    onSelect: dojo.hitch(this, "rowSelected")
	}, listNode);
	this.scroller = new dojox.mobile.scrollable();
	this.scroller.init({
	    domNode: this.scrollerControl.domNode,
	    containerNode: this.dojoObj.domNode,
	    fixedHeaderHeight: 0,
	    fixedFooterHeight: document.body.clientHeight - this.scrollerControl.bounds.h
	});

	this.selectedItem = new wm.Variable({name: "selectedItem", owner: this});
	this.imageListChanged();
    },
    createHeaderBar: function() {
	    this._headerBar = new wm.mobile.Panel({owner: this,
						  parent: this,
						  width: "100%",
						  height: wm.mobile.Text.prototype.height,
						 border: "0,0,3,0",
						 borderColor: "#222222",
						  layoutKind: "left-to-right",
						  flags: {notInspectable: true}});
    },
    createSearchBar: function() {
	if (this.searchField) return;
	if (!this._headerBar)
	    this.createHeaderBar();
	this.searchField = new wm.mobile.Text({caption: "",
					       dontShiftFocusToTop: true,
						   placeHolder: "Search...",
						 owner: this,
						 parent: this._headerBar,
						 name: "searchBar",
						 emptyValue: "emptyString",
						 changeOnKey: true,
						   flags: {notInspectable: true},
						 onchange: dojo.hitch(this, function() {
						     this.setDataSet(this.dataSet);
						 }),
						 onEnterKeyPress:  dojo.hitch(this, function() {
						     // select the top option
						     if (this.dojoObj.items.length > 0) {
							 var inData = this.items[0];
							 this.setProp("emptySelection", false);
							 this.onSelect(inData, inData.getData(), 0, null);
						     }
						 })
						});
	this.moveControl(this._headerBar, 0);
	this._headerBar.moveControl(this.searchField,0);

    },
    createNewButton: function() {
	if (this.newButton) return;
	if (!this._headerBar)
	    this.createHeaderBar();
		this.newButton = new wm.mobile.ToolButton({owner: this,
							   parent: this._headerBar,
							   caption: "New",
							   slanted: false,
							   flags: {notInspectable: true},
							   onclick: dojo.hitch(this, function() {
							       this.selectedItem.setData(null);
							       this.setProp("emptySelection", true);
							       this.onNewClicked();
							   })
							  });
    },
    postInit: function() {
	this.inherited(arguments);
	if (this.dataSet)
	    this.setDataSet(this.dataSet); // causes items to be added to the list

    },
    setDataSet: function(inDataSet) {
	if (this.dataSet && !this.dataSet.isEmpty()) {
	    this.scroller.scrollTo({x: 0,y:0});// scroll to the top each time the dataset changes; later on we may just want to do this when the user enters input, but if I go from a long dataset to a small one, the user may face a blank screen so keeping the last scroll position is problematic.
	}

	this.dataSet = inDataSet;	

	if (this.selectedItem) {
	    var t = (inDataSet||0).type || "AnyData";
		this.selectedItem.setType(t);
	    if (inDataSet.liveView)
		this.selectedItem.liveView = inDataSet.liveView;


	}
	this.setProp("emptySelection", true);
	this.renderData();
    },
    updateDisplayFunc: function() {
	if (this.displayExpression || this.imageIndexFieldExpression) {
	    this.dojoObj.displayFunc = dojo.hitch(this, "displayFunc");
	} else {
	    delete this.dojoObj.displayFunc;
	}
    },
    renderData: function() {
	this.updateDisplayFunc();
	var filterText = this.searchField ? this.searchField.getDataValue().toLowerCase() : ""
	var dataIsSet = false;
	if (this.dojoObj && this.dataSet) {
	    var data = this.dataSet.getData() || [];
	    for (var i = 0; i < data.length; i++) {
		data[i]._wmVarIndex = i;
	    }
	    if (filterText) {
		var newdata = [];
		for (var i = 0; i < data.length; i++) {
		    if (this.getDisplayValue(data[i]).toLowerCase().indexOf(filterText) != -1) {
			newdata.push(data[i]);
		    }
		}
		data = newdata;
	    }	    
	    if (data.length) {
		this.dojoObj.set("items", data);
	    } else {
		this.dojoObj.displayFunc = function() {return "<div>Empty List</div>";};
		this.dojoObj.set("items", [{}]);
	    }
	}

    },
    renderBounds: function() {
	this.inherited(arguments);
	if (this.dojoObj) {
	    wm.job(this.getRuntimeId() + ".renderBounds", 50, dojo.hitch(this, function() {
	    var coords = dojo.coords(this.domNode);
	    this.scroller.init({
		domNode: this.scrollerControl.domNode,
		containerNode: this.dojoObj.domNode,
		fixedHeaderHeight: 0,
		fixedFooterHeight: document.body.clientHeight - this.scrollerControl.bounds.h
	    });

	    }));
	}

    },
    rowSelected: function(data, index, rowNode){
	if (!data || !data._wmVarIndex === undefined) return;
	var wmvar = this.dataSet.getItem(data._wmVarIndex)

	if (this.selectionMode == "single") {
	    dojo.query(".Selected", this.domNode).removeClass("Selected");
	    dojo.addClass(rowNode, "Selected");
	    this.selectedItem.setData(wmvar);
	} else if (this.selectionMode == "multiple") {
	    dojo.toggleClass(rowNode, "Selected");
	    // TODO: To support multiple selection, we need this var to be isList, and to add/remove items from the list
	    // this.selectedItem.setData(wmvar);
	}


	this.setProp("emptySelection", false);

	/* If there is a nextLayer, move it to be the layer after this list's layer, and activate it */
	if (this.nextLayer) {
	    var l = this.owner[this.nextLayer];
	    if (l) {
		var parentLayer = this.isAncestorInstanceOf(wm.mobile.Layer);
		if (parentLayer) {
		    l.parent.moveLayerIndex(l, parentLayer.getIndex() + 1);
		    l.activate();
		}
	    }
	}
	this.onSelect(wmvar, data, index, rowNode);
    },

    onSelect: function(inVariable, inData, inIndex, rowNode) {
    },
    onNewClicked: function() {
    },
    generateItemTemplate: function() {
	var classes = "";
	var arrowNode = "";
	if (this.rowArrows) {
	    classes += " ArrowRow";
	    arrowNode = "<div class='mblArrow'></div>";
	}
	var template = "<div class='" + classes + "' >${" + this.displayField + "}" + arrowNode + "</div>";
	if (this.dojoObj)
	    this.dojoObj.itemTemplate = template;
	return template;
    },
    setDataField: function(inField) {
	if (inField != this.dataField) {
	    this.dataField = inField;
	    this.generateItemTemplate();
	}
    },
    setRowArrows: function(inArrows) {
	this.rowArrows = inArrows;
	    if (this.dojoObj) {
		this.dojoObj.set("itemTemplate", this.generateItemTemplate());
		this.renderData();
	    }
    },
    setDisplayField: function(inField) {
	if (inField != this.displayField) {
	    this.displayField = inField;

	    if (this.dojoObj) {
		this.dojoObj.set("itemTemplate", this.generateItemTemplate());
		this.renderData();
	    }
	}
    },
    setDisplayExpression: function(inField) {
	if (inField != this.displayExpression) {
	    this.displayExpression = inField;
	    if (this.dojoObj) {
		this.dojoObj.set("itemTemplate", this.generateItemTemplate());
		this.renderData();
	    }
	}
	if (!this.displayExpression && this.dojoObj)
	    delete this.dojoObj.displayFunc;
	else if (this.displayExpression && this.dojoObj && !this.dojoObj.displayFunc)
	    this.dojoObj.displayFunc = dojo.hitch(this, "displayFunc");
    },

	findImageList: function() {
		var t = this;
		while (t && !t.imageList) {
			t = t.parent;
		}
		return t ? t.imageList : null;
	},
	imageListChanged: function() {
		var iln = this.findImageList();
		this._imageList = iln ? iln instanceof wm.ImageList ? iln : this.owner.getValueById(iln) : null;
		this.renderData();
	},
    	setImageList: function(inImageList) {
		this.imageList = inImageList;
		this.imageListChanged();
	},
    setImageIndexFieldExpression: function(inExpr) {
	this.imageIndexFieldExpression = inExpr;
	this.renderData();
    },
    setUseSearchBar: function(inUse) {
	this.useSearchBar = inUse;
	if (this.useSearchBar) {
	    this.createSearchBar();
	} else if (this.searchField) {
	    this.searchField.destroy();
	    delete this.searchField;
	}
	if (this._headerBar.c$.length == 0) {
	    this._headerBar.destroy();
	    delete this._headerBar;
	}
	if (this._headerBar)
	    this._headerBar.reflow();
    },
    setUseNewButton: function(inUse) {
	this.useNewButton = inUse;

	if (this.useNewButton) {
	    this.createNewButton();
	} else if (this.newButton) {
	    this.newButton.destroy();
	    delete this.newButton;
	}
	if (this._headerBar.c$.length == 0) {
	    this._headerBar.destroy();
	    delete this._headerBar;	    
	}

	if (this._headerBar)
	    this._headerBar.reflow();

    },
    getDisplayValue: function(inObj) {
	if (inObj._displayExpression) {
	    return inObj._displayExpression;
	}
        var inVariable;
        if (wm.isInstanceType(inObj, wm.Variable))
            inVariable = inObj;
        else {
            inVariable = new wm.Variable();
            inVariable.setType(this.dataSet.type);
            inVariable.setData(inObj);
        }

	var de = this.displayExpression, v = inVariable;
	var result = this.displayExpression ? wm.expression.getValue(de, v) : v.getValue(this.displayField);
	inObj._displayExpression = result;
	return String(result);
    },
    getImageIndex: function(inObj) {
	if (inObj._imageIndexExpression) {
	    return inObj._imageIndexExpression;
	}
	// result should be an index
	if (this._imageList) {
            var inVariable;
            if (wm.isInstanceType(inObj, wm.Variable))
		inVariable = inObj;
            else {
		inVariable = new wm.Variable();
		inVariable.setType(this.dataSet.type);
		inVariable.setData(inObj);
            }

	    var de = this.imageIndexFieldExpression, v = inVariable;
	    var result = wm.expression.getValue(de, v) ;
	    inObj._imageIndexExpression = result;
	    return inObj._imageIndexExpression;
	}
    },
    displayFunc: function(inObj) {
	var result = this.getDisplayValue(inObj);
	var classes = "";
	var arrowNode = "";
	if (this.rowArrows) {
	    classes += " ArrowRow";
	    arrowNode = "<div class='mblArrow'></div>";
	}
	var image = "";
	if (this.imageIndexFieldExpression && this._imageList) {
	    image = this.getImageIndex(inObj);
	    if (image !== "" && image !== undefined && image !== null) {
		image = this._imageList.getImageHtml(image);
	    }
	}

	return ["<div class='",
		classes,
		"'>",
		image,
		result,
		arrowNode,
		"</div>"].join("");
    },
    setSelectedIndex: function(inIndex) {
	dojo.query(".Selected", this.domNode).removeClass("Selected");
	if (inIndex == -1) {
	    this.selectedItem.setData(null);
	} else {
	    var rows = dojo.query(".row", this.domNode);
	    this.dojoObj._selectRow(rows[inIndex]); // doesn't do much
	    this.rowSelected(this.dojoObj.items[inIndex], inIndex, rows[inIndex]);
	    wm.job(this.getRuntimeId() + ".scrollTo", 5, dojo.hitch(this, function() {
		if (this.scroller) {
		    var box = dojo.marginBox(rows[inIndex]);
		    var y = -box.t;
		    if (y > 0) y = 0;
		    var maxHeight = dojo.marginBox(this.dojoObj.domNode).h;
		    var availHeight = this.bounds.h;
		    var maxY =  availHeight - maxHeight - box.h;
		    if (maxY > 0) maxY = 0;
		    if (y < maxY)
			y = maxY;
		    this.scroller.scrollTo({y: y, x: 0});
		}
	    }));
	}
    },
    setSelectedField: function(fieldName, fieldValue) {
	for (var i = 0; i < this.dojoObj.items.length; i++) {
	    var d = this.dojoObj.items[i];
	    if (d && d[fieldName] !== undefined && d[fieldName] == fieldValue)
		return this.setSelectedIndex(i);
	}
	this.setSelectedIndex(-1);
    },
    _end: 0
});

wm.mobile.BasicList.extend({
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
		        case "nextLayer":
		                var names = [""];
		    var parentLayer = this.isAncestorInstanceOf(wm.mobile.Layer);
		    if (parentLayer) {
			dojo.forEach(parentLayer.parent.layers, function(l) {
			    if (l != parentLayer)
				names.push(l.name);
			});
		    }
		        return new wm.propEdit.Select({component: this, name: inName, value: inValue, options: names});
			case "updateNow":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
			case "dataSet":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.dataSet ? this.dataSet.getId() : "", allowAllTypes: true, listMatch: true});
			case "displayField":
				var values = this._listFields();
		                return new wm.propEdit.Select({component: this, name: inName, value: inValue, options: values});
			case "dataField":
				var values = this._listFields();
		                return new wm.propEdit.Select({component: this, name: inName, value: inValue, options: values});

		}
		return this.inherited(arguments);
	},
    setPropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "displayField":
	    var editor1 = dijit.byId("studio_propinspect_displayField");

	    var store1 = editor1.store.root;

	    while (store1.firstChild) store1.removeChild(store1.firstChild);


	    var displayFields = this.makePropEdit("displayField");
	    displayFields = displayFields.replace(/^.*?\<option/,"<option");
	    displayFields = displayFields.replace(/\<\/select.*/,"");
	    store1.innerHTML = displayFields;
	    return true;
	case "dataField":
	    var editor1 = dijit.byId("studio_propinspect_dataField");

	    var store1 = editor1.store.root;

	    while (store1.firstChild) store1.removeChild(store1.firstChild);


	    var dataFields = this.makePropEdit("dataField");
	    dataFields = dataFields.replace(/^.*?\<option/,"<option");
	    dataFields = dataFields.replace(/\<\/select.*/,"");
	    store1.innerHTML = dataFields;
	    return true;
	}
	return this.inherited(arguments);
    },    

	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "updateNow":
				return this.update();
		}
		this.inherited(arguments);
	},
	update: function() {
		var ds = this.getValueById((this.components.binding.wires["dataSet"] || 0).source);
		wm.fire(ds, "update");
	},
	// FIXME: for simplicity, allow only top level , non-list, non-object fields.
	_addFields: function(inList, inSchema) {
		for (var i in inSchema) {
			var ti = inSchema[i];
			if (!(ti||0).isList && !wm.typeManager.isStructuredType((ti||0).type)) {
				inList.push(i);
			}
		}
	},
	_listFields: function() {
		var list = [ "" ];
		var schema = this.dataSet instanceof wm.LiveVariable ? wm.typeManager.getTypeSchema(this.dataSet.type) : (this.dataSet||0)._dataSchema;
		var schema = (this.dataSet||0)._dataSchema;
		this._addFields(list, schema);
		return list;
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



wm.Object.extendSchema(wm.mobile.BasicList, {
    selectedItem: { ignore: true, bindSource: true, isObject: true, bindSource: true, doc: 1},
    dataSet: { readonly: true, group: "data", order: 1, bindTarget: 1, type: "wm.Variable", isList: true},
    dataValue: {ignore: 1, bindable: 1, group: "editData", order: 3, type: "any"}, // use getDataValue()

    dataField: {group: "data"},
    displayField: {group: "data"},
    displayExpression: {group: "data"},
    rowArrows: {group: "display"},
    seletionMode: {group: "display"},
    useNewButton: {group: "display"},
    useSearchBar: {group: "display"},
    updateNow: {group: "operations"},

    /* Ignore all these... */
    searchField: {ignore: 1},
    newButton: {ignore: 1},
    horizontalAlign: {ignore: 1},
    verticalAlign: {ignore: 1},
    layoutKind: {ignore: 1},
    emptySelection: {ignore: 1, bindSource: true, type: "boolean"},
    fitToContentHeight: {ignore: 1},
    fitToContentWidth: {ignore: 1}
});



dojo.declare("wm.mobile.List", wm.mobile.BasicList, {
    classNames: "wmmoblist",
    titleField: "",
    titleExpression: "",

    bodyField: "",
    bodyExpression: "",

    photoField: "",
    photoExpression: "",
    photoWidth: "",
    photoHeight: "",

    buttons: "",
    init: function() {
	this._buttons = this.buttons ? String(this.buttons).split(/\s*,\s*/) : [];
	this.inherited(arguments);
    },
    updateDisplayFunc: function() {
	this.dojoObj.displayFunc = dojo.hitch(this, "displayFunc");
    },
    setTitleExpression: function(inTitle) {
	this.titleExpression = inTitle;
	this.renderData();
    },
    setBodyExpression: function(inBody) {
	this.bodyExpression = inBody;
	this.renderData();
    },
    setPhotoExpression: function(inPhoto) {
	this.photoExpression = inPhoto;
	this.renderData();
    },

    setTitleField: function(inTitle) {
	this.titleField = inTitle;
	this.renderData();
    },
    setBodyField: function(inBody) {
	this.bodyField = inBody;
	this.renderData();
    },
    setPhotoField: function(inPhoto) {
	this.photoField = inPhoto;
	this.renderData();
    },
    setButtons: function(inButtonList) {
	this.buttons = inButtonList;
	this._buttons = this.buttons ? String(this.buttons).split(/\s*,\s*/) : [];
	this.updateDisplayExpression();	
    },

    displayFunc: function(inObj) {
	if (inObj._displayExpression) {
	    return inObj._displayExpression;
	}

        var inVariable;
        if (wm.isInstanceType(inObj, wm.Variable))
            inVariable = inObj;
        else {
            inVariable = new wm.Variable();
            inVariable.setType(this.dataSet.type);
            inVariable.setData(inObj);
        }
	
	var photoString = "";
	if (this.photoExpression) {
	    photoString = wm.expression.getValue(this.photoExpression, inVariable);
	} else if (this.photoField) {
	    photoString = inVariable.getValue(this.photoField);
	}
	if (photoString) {
	    photoString = "<img " + ((this.photoWidth) ? " width='" + parseInt(this.photoWidth) + "'" : "") +
		((this.photoHeight) ? " height='" + parseInt(this.photoHeight) + "'" : "") +
		" class='ImageListIcon' src='" + photoString + "'/>";
	}
	if (!photoString && this._imageList && this.imageIndexFieldExpression) {
	    var imageIndex = wm.expression.getValue(this.imageIndexFieldExpression, inVariable);
	    photoString = this._imageList.getImageHtml(imageIndex);
	}

	var buttonString = "";
	for (var i = 0; i < this._buttons.length; i++) {
	    buttonString += "<button class='wmmobtoolbutton Slanted'>" + this._buttons[i] + "</button>";
	}

	var titleString = "";
	if (this.titleExpression) {
	    titleString = wm.expression.getValue(this.titleExpression, inVariable);
	} else if (this.titleField) {
	    titleString = inVariable.getValue(this.titleField);
	}

	var bodyString = "";
	if (this.bodyExpression) {
	    bodyString = wm.expression.getValue(this.bodyExpression, inVariable);
	} else if (this.bodyField) {
	    bodyString = inVariable.getValue(this.bodyField);
	}

	/* Unconfigured list; show all displayable fields */
	if (!titleString && !bodyString) {
	    var type = this.dataSet.type;
	    var fields = wm.typeManager.getType(type).fields;
	    var sortedFieldNames = wm.typeManager.getPropNames(fields)
	    for (var i = 0; i < sortedFieldNames.length; i++) {
		var f = fields[sortedFieldNames[i]];
		if (f.type == "java.lang.String") {
		    if (!titleString) 
			titleString = inVariable.getValue(sortedFieldNames[i]);
		    else {
			if (bodyString)
			    bodyString += ", ";
			bodyString += inVariable.getValue(sortedFieldNames[i]);
		    }
		}
	    }

	    var needsBody = Boolean(bodyString);
	    for (var i = 0; i < sortedFieldNames.length; i++) {
		var f = fields[sortedFieldNames[i]];
		if (f.type.match(/^java\.lang/) && f.type != "java.lang.String") {
		    if (!titleString) 
			titleString = inVariable.getValue(sortedFieldNames[i]);
		    else if (needsBody) {
			if (bodyString)
			    bodyString += ", ";
			bodyString += inVariable.getValue(sortedFieldNames[i]);
		    }
		}
	    }
	}

	if (titleString) {
	    titleString = "<div class='ListRowHeader'>" + titleString + (!bodyString ? buttonString : "") + "</div>";
	}

	if (bodyString) {
	    bodyString = "<div class='ListRowBody'>" + bodyString + buttonString + "</div>";
	}


	var classes = "";
	var arrowNode = "";
	if (this.rowArrows) {
	    classes += " ArrowRow";
	    arrowNode = "<div class='mblArrow'></div>";
	}
	var styles = "";
	if (this.photoHeight) {
	    var h = parseInt(this.photoHeight);
	    if (h > 40) {
		styles += "min-height:" + (h+1) + "px;";
	    }
	}

	return ["<div class='",
		classes,
		"' style='",
		styles,
		"'>",
		photoString,
		arrowNode,
		titleString,
		bodyString,
		"</div>"].join("");

    },
    renderData: function() {
	this.inherited(arguments);
	dojo.query("button", this.dojoObj.domNode).connect("onclick", dojo.hitch(this, function(e) {
	    var buttonText = e.target.innerHTML;
	    var row = e.target;
	    while (row && !dojo.hasClass(row, "row"))
		row = row.parentNode;
	    var rows = dojo.query(".row", this.dojoObj.domNode);
	    var index = dojo.indexOf(rows, row);
	    var item = this.dojoObj.items[index];
	    console.log(item);
	    dojo.stopEvent(e);
	    this.onButtonClick(buttonText, item);
	}));
    },
    onButtonClick: function(inButton, inItem) {},

    _end: 0
});

wm.Object.extendSchema(wm.mobile.List, {
    displayField: {ignore: 1},
    displayExpression: {hidden: 1}/*,
    imageList: {ignore: 1},
    imageIndex: {ignore: 1},
    imageIndexFieldExpression: {ignore: 1}*/
});    