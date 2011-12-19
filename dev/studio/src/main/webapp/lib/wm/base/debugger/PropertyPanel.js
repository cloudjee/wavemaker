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

dojo.provide("wm.base.debugger.PropertyPanel");

dojo.declare("wm.debugger.PropertyPanel", wm.Layer, {
    width: "100%",
    height: "100%",
    caption: "Properties",
    layoutKind: "top-to-bottom",
    verticalAlign: "top",
    horizontalAlign: "left",
    autoScroll: true,
    inspect: function(inComponent) {
	this.selectedItem = inComponent;
	this.removeAllControls();
	new wm.Label({owner: this,
		      parent: this,
		      width: "100%", 
		      singleLine: false, 
		      height: "40px", 
		      caption: "Access with<br/>" + this.selectedItem.getRuntimeId() });
	var ignoreProps = {margin:true,
			   border:true,
			   borderColor:true,
			   padding:true,
			   width: true,
			   height: true,
			   left:true,
			   top:true,
			   container:true,
			   rootId:true,
			   theme:true};
	for (var propName in this.selectedItem) {
	    if (propName.indexOf("_") == 0) continue;
	    if (this.selectedItem[propName] instanceof Node) continue;
	    if (typeof this.selectedItem[propName] == "function") continue;
	    if (typeof this.selectedItem[propName] == "object" && this.selectedItem[propName] instanceof wm.Component == false) continue;
	    if (ignoreProps[propName]) continue;
	    this.generateEditor(propName);
	}
	this.reflow();
    },
    generateEditor: function(inName) {
	var value = this.selectedItem[inName];
	var type = typeof value;
	var ctor;
	if (type == "boolean") {
	    ctor = wm.Checkbox;
	} else if (type == "number") {
	    ctor = wm.Number;
	} else if (type == "object") {
	    value = value.toString();
	    ctor = wm.Text;
	} else {
	    ctor = wm.Text;
	}
	var e = new ctor({owner: this,
			  parent: this,
			  readonly: type == "object",
			  width: "100%",
			  caption: inName,
			  dataValue: value,
			  startChecked: value,
			  captionSize: "100px"});
	
	e.onchange = dojo.hitch(this, function(inDisplayValue, inDataValue) {
	    if (this.selectedItem["set" + wm.capitalize(inName)]) {
		this.selectedItem["set" + wm.capitalize(inName)](inDataValue);
	    } else {
		this.selectedItem[inName] = inDataValue;
	    }
	});
    },
});