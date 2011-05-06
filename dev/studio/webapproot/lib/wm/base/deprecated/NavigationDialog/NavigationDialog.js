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
 
dojo.provide("wm.studio.pages.NavigationDialog.NavigationDialog");

dojo.declare("NavigationDialog", wm.Page, {
        i18n: true,
//===========================================================================
// Inititialization
//===========================================================================
	start: function() {
		this.update();
	},
	update: function() {
		if (this.host) {
			this.input = this.host.components.input;
			this.binding = this.input.components.binding;
			this.updateLayerSelect();
			this.updatePageSelect();
			this.updatePageContainerList();
			this.updateSettings();
		}
	},
	getWidgetsOfType: function(inType) {
		var widgets = [];
		wm.forEachWidget(studio.page.root, function(w) {
			if (w instanceof inType)
				widgets.push(w.getId());
		});
		return widgets;
	},
	getPagesList: function() {
		var pages = [].concat(studio.project.getPageList()), i = dojo.indexOf(pages, studio.page.declaredClass);
		pages.splice(i, 1);
		return pages;
	},
	updateSelect: function(inSelect, inData) {
		var s = inSelect, o = inData.join(",");
		s.displayValue = "";
		s.editor.setOptions(o);
	},
	updateLayerSelect: function() {
		this.updateSelect(this.layerSelect, this.getWidgetsOfType(wm.Layer));
	},
	updatePageSelect: function() {
		this.updateSelect(this.pageSelect, this.getPagesList());
	},
	updatePageContainerList: function() {
		var d = ["Entire Screen"/*, "Modal Dialog"*/].concat(this.getWidgetsOfType(wm.PageContainer));
		this.pageContainerList.renderData(d);
	},
	updateSettings: function() {
		var
			l = this.input.getValue("layer"),
			p = this.input.getValue("pageName"),
			pa = this.input.getValue("pageContainer");
		l = l && l.getId();
		pa = pa && pa.getId();
		if (l) {
			this.layerRb.editor.setChecked(true);
			this.layerSelect.setValue("displayValue", l);
		} else if (p || pa) {
			this.pageRb.editor.setChecked(true);
			this.pageSelect.setValue("displayValue", p);
			var pl = this.pageContainerList, i = dojo.indexOf(pl._data, pa);
			pl.select(pl.getItem(i == -1 ? 0 : i));
		} else
			this.layerRb.setValue("dataValue", "layer");
		this.disEnableControls(!p);
	},
	disEnableControls: function(inLayerMode) {
		this.layerSelect.setValue("disabled", !inLayerMode);
		this.pageSelect.setValue("disabled", inLayerMode);
		this.wherePanel.setValue("showing", !inLayerMode)
	},
//===========================================================================
// User Settings
//===========================================================================
	layerRbChange: function(inSender, inDisplayValue, inDataValue) {
		if (inDataValue)
			this.disEnableControls(true);
	},
	pageRbChange: function(inSender, inDisplayValue, inDataValue) {
		if (inDataValue)
			this.disEnableControls(false);
	},
	getSelectedOperation: function() {
		var g = this.layerRb.getValue("groupValue"), s = this.pageContainerList.selected;
		if (g == "layer")
			return "gotoLayer";
		if (!s || s.index == 0)
			return "gotoPage";
		//if (s && s.index == 1)
		//	return "gotoDialogPage";
		else
			return "gotoPageContainerPage";
	},
	getSelectedLayer: function() {
		return this.layerSelect.getValue("displayValue");
	},
	getSelectedPage: function() {
		return this.pageSelect.getValue("displayValue");
	},
	getSelectedPageContainer: function() {
		var s = this.pageContainerList.selected;
		return s && s.index > 0 && s.getData();
	},
//===========================================================================
// Binding
//===========================================================================
	removeTargetBindings: function() {
		var f = function(ff) {
			if (!ff.targetId)
				return true;
		}
		var b = this.binding, wires = b.findWires(f);
		b.removeWireList(wires);
	},
	_removeSourceBinding: function(inBinding, inTargetId) {
		var wires = inBinding.findWires(function(w) {
			return (w.targetId.indexOf(inTargetId) == 0);
		});
		inBinding.removeWireList(wires);
	},
	// FIXME: For now, use input data to clear source bindings.
	// we could ensure better cleanup by looking at all bindings
	// if we do that, should be unified with binder.
	removeSourceBindings: function() {
		if (!this.isAppOwned())
			return;
		var 
			tid = this.host.getId(),
			data = this.input.data, 
			d, b, wires;
		// use current data to remove source bindings
		for (var i in data) {
			d = data[i];
			b = ((d || 0).components || 0).binding;
			if (!(b instanceof wm.Binding))
				continue;
			this._removeSourceBinding(b, tid);
		}
	},
	removeBindings: function() {
		this.removeTargetBindings();
		this.removeSourceBindings();
	},
	isAppOwned: function() {
		return (this.host.owner == studio.page.app);
	},
	setBindings: function() {
		var appOwned = this.isAppOwned();
		this.removeBindings();
		this.input.data = {};
		var
			ln = this.getSelectedLayer(),
			p = this.getSelectedPage(),
			pn = this.getSelectedPageContainer(),
			layer = studio.page.getValueById(ln),
			pageContainer = studio.page.getValueById(pn),
			targetId = appOwned ? this.input.getId() : "",
			binding;
		switch (this.host.operation) {
			case "gotoLayer":
				if (ln) {
					binding = appOwned ? layer.components.binding : this.binding;
					binding.addWire(targetId, "layer", ln);
				}
				break;
			default:
				if (p)
					this.binding.addWire("", "pageName", "", '"' + p + '"');
				if (pageContainer) {
					binding = appOwned ? pageContainer.components.binding : this.binding;
					binding.addWire(targetId, "pageContainer", pn);
				}
				break;
		};
	},
//===========================================================================
// Naming
//===========================================================================
	isDefaultName: function() {
		return this.host.name.indexOf("navigationCall") == 0;
	},
	getName: function() {
		var
			l = wm.capitalize((this.input.getValue("layer") || 0).name || ""),
			p = wm.capitalize(this.input.getValue("pageName") || ""),
			pa = wm.capitalize((this.input.getValue("pageContainer") || 0).name || "");
		return "goto" + l + p + pa;
	},
	updateName: function() {
		if (this.isDefaultName())
			this.host.setProp("name", this.getName());
	},
//===========================================================================
// Saving / Closing
//===========================================================================
	saveSettings: function() {
		this.host.setOperation(this.getSelectedOperation());
		this.setBindings();
		this.updateName();
	},
	saveButtonClick: function(inSender) {
		this.saveSettings();
		// make studio inspect again...
		inspect(this.host);
		wm.fire(this.owner, "dismiss");
	},
	cancelButtonClick: function(inSender) {
		inspect(this.host);
		wm.fire(this.owner, "dismiss");
	},
	_end: 0
});
