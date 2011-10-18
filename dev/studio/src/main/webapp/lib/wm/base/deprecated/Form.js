/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Form");
dojo.require("wm.base.widget.Detail");

dojo.declare("wm.Form", wm.Detail, {
	init: function() {
		this.inherited(arguments);
		// Note: we could make List's dataSet prop non-virtual and have one in/out data property
		// however, we want to eventually support binding based on type only and
		// therefore we want to not have a set dataSet type because that would limit bindable sources.
		// so, have a dataOutput for output that has dataSet's type, while maintaining wm.Variable type
		// for the virtual dataSet (allowing any Variable to bind)
		new wm.Variable({name: "dataOutput", owner: this});
	},
	// rendering
	renderData: function(inData) {
		// hide while rendering, it blinks but it avoids the crazy dijit resizing =(
		this.domNode.style.visibility="hidden";
		this.inherited(arguments);
		this.postRender();
	},
	postRender: function() {
		this.createEditors();
	},
	createEditors: function() {
		var d = this.getDetailPosition();
		for (var i=0, li, n, b, td; (li=this.getItem(i)); i++) {
			td = wm.getTd(li.domNode&&li.domNode.firstChild, d.row, d.col);
			n = td && td.firstChild;
			dojo.setSelectable(li.domNode, true);
			if(!li.editor){
				var data = li.getData();
				li.editor = new dijit.form.TextBox({srcNodeRef: n, value: (data != undefined ? data : "")});
				li.editor.domNode.style.width = "100%";
				this.connect(li.editor, "_onBlur", this, "updateDataOutput");
			}
		}
		// reveal and reflow.
		this.domNode.style.visibility="";
		this.reflowParent();
	},
	// item rendering override.
	onformat: function(ioData, inRow, inData, inIsLabel) {
		if (!ioData.isLabel)
			ioData.data = '<div></div>';
	},
	getValues: function() {
		var v = {};
		dojo.forEach(this.items, dojo.hitch(this, function(i) {
			var f = this._dataFields[i.index], editor = i.editor;
			v[f] = editor&&editor.getValue();
		}));
		return v;
	},
	setDataSet: function(inDataSet) {
		this.inherited(arguments);
		var t = (inDataSet||0).type;
		this.components.dataOutput.setType(t || "any");
	},
	updateDataOutput: function() {
		// sending only values actually displayed data, no object data (less chance of db blow up)
		//var d = dojo.mixin({}, this._data, this.getValues());
		var 
			d = this.getValues();
			o = this.components.dataOutput;
		o._clearData();
		o.setData(d);
	}
});

// design only...
wm.Object.extendSchema(wm.Form, {
	dataOutput: {ignore: 1, group: "data", order: 100, bindSource: 1, isObject: true}
});

wm.Form.description = "Displays a detailed form.";