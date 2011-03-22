/*
 *  Copyright (C) 2009-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.components.LiveView_Design");

wm.LiveView.extend({
	noInspector: true,
	afterPaletteDrop: function() {
		this.set_owner("Application");
		this._defaultView = true;
		this.newLiveViewDialog();
	},
	newLiveViewDialog: function(inSender) {
		var d = this.getCreateLiveViewDialog();
		if (d.page)
			d.page.update();
		d.show();
	},
	getCreateLiveViewDialog: function() {
		if (!wm.LiveView.newLiveViewDialog) {
			var props = {
				owner: studio,
				pageName: "CreateLiveView",
				hideControls: true,
				contentWidth: 500,
				contentHeight: 300
			};
			wm.LiveView.newLiveViewDialog = new wm.PageDialog(props);
		}
		var d = wm.LiveView.newLiveViewDialog;
		d.onClose = dojo.hitch(this, function(inWhy) {
			if (inWhy == "OK")
				this.completeNewLiveView();
			else {
				this.destroy();
				studio.refreshDesignTrees();
				studio.navGotoDesignerClick();
			}
		});
		return d;
	},
	completeNewLiveView: function() {
		var
			d = this.getCreateLiveViewDialog(),
			p = d.page,
			service = p.serviceSelectEditor.getDataValue(),
			dataTypeIndex = p.dataTypeList.getSelectedIndex(),
			dataType = (wm.dataSources.sources[service][dataTypeIndex] || 0).type;
		this.setService(service);
		this.setDataType(dataType);
		this.editView();
	},
    getLayerName: function() {
	return this.name + "LiveView";
    },
    getLayerCaption: function() {
	return this.name + " (" + studio.getDictionaryItem("wm.LiveView.TAB_CAPTION") + ")";
    },
	editView: function() {
	    var c = studio.navGotoEditor("LiveViewEditor", studio.databaseTab, this.getLayerName(), this.getLayerCaption());
		var ed = c.page;
		if (ed) {
			ed.setLiveView(this);
			ed.update();
		}
	},
	designSelect: function() {
		this.editView();
	}
});

/*
wm.Object.extendSchema(wm.LiveView, {
	edit: { group: "operation", order: 10, operation: "editView"}
});
*/
