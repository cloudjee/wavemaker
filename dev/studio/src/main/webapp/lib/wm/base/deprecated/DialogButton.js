/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.DialogButton");
dojo.require("wm.base.widget.Button");

dojo.declare("wm.DialogButton", wm.Button, {
	pageName: "",
	dialogWidth: "450",
	dialogHeight: "300",
	showControls: false,
	init: function() {
		this.inherited(arguments);
		this.dialog = new wm.PageDialog({name: "pageDialog", owner: this});
		this.connect(this.dialog, "onClose", this, "onclose");
		this.connect(this.dialog, "onPageReady", this, "pageReady");
	},
	setPageName: function(inName) {
		this.pageName = inName;
	},
	setPage: function(inName) {
		inName = inName || this.pageName;
		this.dialog.setPage(inName);
	},
	showDialog: function() {
		this.dialog.showPage(this.pageName, !this.showControls, this.dialogWidth, this.dialogHeight);
	},
	pageReady: function() {
		this.page = this.dialog.page;
		if (this.dialog.showing)
			this.onshow();
	},
	dialogCancelled: function(inWhy) {
		if (!inWhy || inWhy == "cancel")
			return true;
	},
	// events
	onclick: function() {
		this.showDialog();
	},
	onshow: function() {
	},
	onclose: function(inWhy) {
	},
	forEachWidget: function(inFunc) {
		return this.dialog && this.dialog.forEachWidget(inFunc);
	}
});

wm.createPage = function(inName, inDesignable) {
	var props = {
		name: inName,
		domNode: inDesignable ? studio.designer.domNode : document.createElement('div'),
		_designer: inDesignable ? studio.designer : true
	}
	var p = new wm.Page(props);
	p.loadComponent("layoutBox1", null, "wm.LayoutBox", { fit: true, box: "v", height: "1flex"})
	return p;
}

wm.savePage = function(inPage, inWidgets, inJs, inCss, inHtml) {
	var sp = studio.project, p = inPage, n = p.declaredClass + "/" + p.declaredClass;
	sp.saveProjectData(n + ".css", inCss || "");
	sp.saveProjectData(n + ".html", inHtml || "");
	sp.saveProjectData(n + ".js", inJs || pageScript(n));
	sp.saveProjectData(n + ".widgets.js", inWidgets || sourcer(n, p));
	sp.updatePageList();
}

// design-time
wm.DialogButton.extend({
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "pageName":
				return new wm.propEdit.PagesSelect({component: this, name: inName, value: inValue});
		}
		return this.inherited(arguments);
	},
	makePage: function(inName) {
		studio.beginWait("Creating page: " + inName);
		wm.onidle(this, function() {
			try {
				var
					n = inName,
					p = wm.createPage(n);
				// testing...
				p.loadComponent("label1", p.root, "wm.Label", {caption: p.name});
				
				pf = wm.getParentForm(this);
				
				var f = p.loadComponent("liveForm1", p.root, "wm.LiveForm", {_liveSource: pf.dataSet.type});
				console.log("makePage", f, f._generateDeferred);
				if (!f._generateDeferred)
					this.finishMakePage(p);
				else
					f._generateDeferred.addCallback(dojo.hitch(this, "finishMakePage", p));
			} finally {
				studio.endWait();
			}
		});
	},
	finishMakePage: function(inPage) {
		wm.savePage(inPage);
		studio.updatePageList();
		this.setPageName(inPage.name);

	}
});

wm.Object.extendSchema(wm.DialogButton, {
	pageName: {group: "common", order: 50}
});

wm.DialogButton.description = "A button that launches a modal dialog.";


// for a given variable attempt to get data necessary for a server write
// for example, if given a.b attempt to return b.a if b has an a property.
wm.getOperationData = function(inVariable, inOperation) {
	var v = inVariable, data = inOperation == "insert" ? {} : inVariable.getCursorItem().getData();
	if (v._subNard) {
		var schema = v._dataSchema;
		for (var i in schema) {
			var f = schema[i];
			if (f.type == v.owner.type && f.required && !data[i]) {
				var ownerData = v.owner.getData();
				// FIXME: want to exclude list data for efficiency; we should not get it in first place
				for (var j in ownerData) {
					if (dojo.isArray(ownerData[j]))
						delete ownerData[j];
				}
				data[i] = ownerData;
			}
		}
	}
	return data;
}

dojo.declare("wm.RelatedDataButton", wm.DialogButton, {
	operation: "update",
	pageForm: "",
	getFormData: function() {
		var data = wm.getOperationData(wm.getParentForm(this).dataSet, this.operation);
		this.onGetFormData(data);
		return data;
	},
	_getPageForm: function() {
		return this.page && this.page.getValueById(this.pageForm || "");
	},
	initPageForm: function() {
		var form = this._getPageForm();
		if (form) {
			form[this.operation == "update" ? "beginDataUpdate" : "beginDataInsert"]();
			form.dataSet.setData(this.getFormData());
			wm.focusContainer(form);
		}
	},
	// return list dataSet
	// FIXME: decouple data from lookup
	getListDataSet: function() {
		var form = wm.getParentForm(this);
		if (form.editingMode == "lookup") {
			var l = form.findLookup();
			return l && l.editor.dataSet;
		} else {
			return form.dataSet;
		}
	},
	processPageForm: function() {
		var
			form = this._getPageForm(),
			ds = this.getListDataSet();
		//console.log("processPageForm", this.operation, ds.getId(), formData.getData());
		switch (this.operation) {
			case "update":
				ds.setItem(ds.cursor, form.dataOutput);
				break;
			case "insert":
				ds.addItem(form.dataOutput, 0);
				break;
			case "delete":
				if (ds.isList)
					ds.removeItem(ds.cursor);
				break;
		}
		this.updateRelatedEditor(form.dataOutput);
	},
	updateRelatedEditor: function(inData) {
		var form = wm.getParentForm(this);
		if (form && form.editingMode == "lookup") {
			var l = form.findLookup();
			if (l)
				l.setDataValue(inData || null);
		}
	},
	// this works only for lists (1:M, not M:1)
	//FIXME: we have no way of processing this delete without another form.
	deleteData: function() {
		this.operation = "delete";
		this.setPage();
	},
	pageReady: function() {
		if (this._clicked) {
			if (this.operation == "delete") {
				wm.fire((this._getPageForm() || 0).dataSet, "setData", [this.getFormData()]);
				this.processPageForm();
			} else
				this.inherited(arguments);
		}
		this._clicked = false;
	},
	onshow: function() {
		this.initPageForm();
	},
	onclose: function(inWhy) {
		if (!this.dialogCancelled(inWhy))
			this.processPageForm();
	},
	onclick: function() {
		this._clicked = true;
		if (this.operation == "delete") {
			this.deleteData();
		} else
			this.inherited(arguments);
	},
	onGetFormData: function(inData) {
	
	}
});

wm.RelatedDataButton.extend({
	_operations: ["insert", "update", "delete"],
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "operation":
				return new wm.propEdit.Select({
					component: this, name: inName, options: this._operations
				});
		}
		return this.inherited(arguments);
	}
});

/*
registerPackage(["Form Elements", "RelatedDataButton", "wm.RelatedDataButton", "wm.base.widget.DialogButton", "images/wm/button.png", ""]);
*/
