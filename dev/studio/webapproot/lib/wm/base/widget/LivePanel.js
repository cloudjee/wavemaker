/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
dojo.provide("wm.base.widget.LivePanel");

dojo.declare("wm.LivePanel", wm.Panel, {
	height: "100%",
	width: "100%",
	layoutKind: "top-to-bottom",
	liveDataName: "",
	afterPaletteDrop: function() {
		wm.Container.prototype.afterPaletteDrop.call(this);
	        var fancyPanel1 = new wm.FancyPanel({parent: this,
                                                     horizontalAlign: "left",
                                                     verticalAlign: "top",
						     owner: this.owner,
						     name: this.liveDataName + "GridPanel",
						     title: wm.capitalize(this.liveDataName)});
		this.dataGrid = new wm.DojoGrid({
                                border: "0", // wm.FancyPanel + theme change; fancy panel provides the border; ignore any default borders provided by theme
				name: studio.page.getUniqueName(this.liveDataName + "DojoGrid"),
				owner: this.owner,
				height:'100%',
				parent: fancyPanel1.containerWidget, // wm.FancyPanel change; revert to returning "this"
				_classes: {"domNode":["omgDataGrid"]}
			});
	        var fancyPanel2 = new wm.FancyPanel({parent: this,
                                                     horizontalAlign: "left",
                                                     verticalAlign: "top",
						     owner: this.owner,
						     name: this.liveDataName + "DetailsPanel",
						    title: "Details"});
		this.liveForm = new wm.LiveForm({
				name: studio.page.getUniqueName(this.liveDataName + "LiveForm1"),
				owner: this.owner,
		                parent: fancyPanel2.containerWidget, // wm.FancyPanel change; revert to returning "this"
				verticalAlign: "top",
				horizontalAlign: "left",
				_liveSource: this.liveSource
			});
	        this.reflow(); // added for fancypanel support
		this.liveForm.createLiveSource(this.liveSource);
		var lvar = this.liveForm.dataSet.name;
		this.dataGrid.set_dataSet(lvar);
		this.liveForm.set_dataSet(this.dataGrid.name + ".selectedItem");
		this.liveForm.eventBindings.onSuccess = lvar;
	}
});

wm.Object.extendSchema(wm.LivePanel, {
	liveDataName: {ignore: 1},
	liveSource: {ignore: 1}
});
