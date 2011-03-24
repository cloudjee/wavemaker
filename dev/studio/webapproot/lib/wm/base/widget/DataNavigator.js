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
dojo.provide("wm.base.widget.DataNavigator");
dojo.require("wm.base.widget.Panel");

dojo.declare("wm.DataNavigator", wm.Panel, {
        classNames: "wmdatanavigator",
	box: "h",
	lock: true,
	byPage: false,
	border: 0,
	height: "36px",
	_buttonWidth: "46px",
	layoutKind: "left-to-right",
	horizontalAlign: "right",
	verticalAlign: "middle",
	liveSource: "",
	init: function() {
		this.inherited(arguments);
		this.createNavComponents();
		this.connectNavComponents();
	},
	afterPaletteDrop: function() {
		this.inherited(arguments);
	    this.setLayoutKind("left-to-right");
	    this.setWidth("100%");
	},
	createNavComponents: function() {
		this.readComponents(this.getTemplate());
		dojo.mixin(this, this.widgets);
	},
	connectNavComponents: function() {
		this.connect(this.firstButton, "onclick", this, "setFirst");
		this.connect(this.prevButton, "onclick", this, "setPrevious");
		this.connect(this.nextButton, "onclick", this, "setNext");
		this.connect(this.lastButton, "onclick", this, "setLast");
		this.connect(this.recordEditor, "onchange", this, "recordEdited");
	},
	getTemplate: function() {
		return ['{',
		'firstButton: ["wm.Button", {caption: "&nbsp&laquo;&nbsp;", width: "',this._buttonWidth,'", height: "100%"}, {}],',
		'prevButton: ["wm.Button", {caption: "&nbsp&lt;&nbsp;", width: "',this._buttonWidth,'", height: "100%"}, {}],',
		'recordEditor: ["wm.Editor", {width: "65px", margin: 4, height: "100%"}, {}, {',
			'editor: ["wm._NumberEditor", {}, {}]',
		'}],',
		'totalLabel: ["wm.Label", {caption: "of 0", width: "50px", border: 0, height: "100%"}, {}, {',
			'format: ["wm.DataFormatter", {}, {}]',
		'}],',
		'nextButton: ["wm.Button", {caption: "&nbsp&gt;&nbsp;", width: "',this._buttonWidth,'", height: "100%"}, {}],',
		'lastButton: ["wm.Button", {caption: "&nbsp&raquo;&nbsp;", width: "',this._buttonWidth,'", height: "100%"}, {}]',
		'}'].join('');
	},
	setFirst: function() {
		wm.fire(this.liveSource, this.byPage ? "setFirstPage" : "setFirst");
		this.update();
	},
	setPrevious: function() {
		wm.fire(this.liveSource, this.byPage ? "setPreviousPage" : "setPrevious");
		this.update();
	},
	setNext: function() {
		wm.fire(this.liveSource, this.byPage ? "setNextPage" : "setNext");
		this.update();
	},
	setLast: function() {
		wm.fire(this.liveSource, this.byPage ? "setLastPage" : "setLast");
		this.update();
	},
	recordEdited: function() {
		var r = this.recordEditor;
		if (r.isValid() && !this._updating) {
			wm.fire(this.liveSource, this.byPage ? "setPage" : "setCursor", [this.recordEditor.getValue("dataValue") - 1]);
		}
		this._updating = false;
		
	},
	update: function(inDataSet) {
		var ls = this.liveSource;
		if (!ls)
			return;
		var
			c = (this.byPage ? ls.getPage() : ls.cursor)+1,
			d = this.liveSource.getCursorItem().getData(),
			t = (this.byPage ? ls.getTotalPages() : ls.getCount()) || 1;
			r = this.recordEditor;
		this._updating = c != r.getValue("dataValue");
		if (c > t) c = t;
		r.setValue("dataValue", c);
	    /* TODO: Localize */
		this.totalLabel.setValue("caption", "of " + t);
		this._doSetRecord(d, c);
	},
	setLiveSource: function(inLiveSource) {
		var s = inLiveSource;
		if (dojo.isString(s) && s) {
			this.components.binding.addWire("", "liveSource", s);
			return;
		}
		s = s instanceof wm.LiveForm ? s.dataSet : s;
		if (s instanceof wm.LiveVariable) {
			this.liveSource = s;
			this.connect(this.liveSource, "onSuccess", this, "update");
			this.update();
		} else
			this.liveSource = "";
	},
	getLiveSource: function() {
		return this.liveSource && this.liveSource.getId();
	},
	// bc
	setLiveForm: function(inLiveForm) {
		this.setLiveSource(inLiveForm);
	},
	// events
	_doSetRecord: function(inData, inIndex) {
		if (inIndex != this._lastRecord)
			this.onsetrecord(inData, inIndex);
		this._lastRecord = inIndex;
	},
	onsetrecord: function(inData, inIndex) {
		//console.log(arguments);
	},
	adjustChildProps: function(inCtor, inProps) {
		this.inherited(arguments);
		// this widget is owner so that children are not in part space
		dojo.mixin(inProps, {owner: this});
	},
	/*writeComponents: function(inIndent, inOptions) {
		return [this.components.binding.write(inIndent, inOptions)];
	},*/
	writeChildren: function() {
		// we don't want to stream our child widgets
		// since we create them at runtime.
		return [];
	}
});

// design-time only
wm.Object.extendSchema(wm.DataNavigator, {
	box: {ignore: 1},
	lock: {ignore: 1},
	liveForm: {ignore: 1},
	layoutKind: {ignore: 1},
	byPage: {group: "common", order: 250},
	liveSource: { readonly: 1, bindable: 1, type: "wm.LiveVariable", group: "common", order: 200},
	firstRecord: { group: "operation", order: 5},
	previousRecord: { group: "operation", order: 10},
	nextRecord: { group: "operation", order: 15},
    lastRecord: { group: "operation", order: 20},
    autoScroll: {ignore: true},
    scrollX: {ignore: true},
    scrollY: {ignore: true},
    touchScrolling: {ignore: true}
});

wm.DataNavigator.extend({
	_defaultClasses: {domNode: ["wm_Padding_4px"]},
	firstRecord: "(first record)",
	previousRecord: "(previous record)",
	nextRecord: "(next record)",
	lastRecord: "(last record)",
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "firstRecord":
			case "previousRecord":
			case "nextRecord":
			case "lastRecord":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
			case "liveSource":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, widgetDataSets: true, listMatch: true});
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "firstRecord":
				return this.setFirst();
			case "previousRecord":
				return this.setPrevious();
			case "nextRecord":
				return this.setNext();
			case "lastRecord":
				return this.setLast();
		}
		return this.inherited(arguments);
	}
});
