/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

dojo.provide("wm.base.debug.ConsolePanel");

dojo.declare("wm.debug.ConsolePanel", wm.Container, {
    layoutKind: "top-to-bottom",
    htmlItems: [],
    isActive: false,

    postInit: function() {
		this.inherited(arguments);
		var components = this.createComponents({
		    html: ["wm.Html", {width: "100%", height: "100%", name: "html", border: "1", borderColor: "#333"}],
		    panel: ["wm.Panel", {width: "100%", height: "50px", layoutKind: "left-to-right", verticalAlign: "center"},{},{
			text: ["wm.LargeTextArea", {width: "100%", height: "100%", name: "text"}],
			button: ["wm.Button", {width: "50px", height: "100%", caption: "Send"}]
		    }]
		});
		this.html = components[0];
		this.text = components[1].c$[0];
		this.button = components[1].c$[1];
		this.connect(this.button, "onclick", this, "send");
    },
    send: function() {
    	var result;
    	try {
    		result = eval(this.text.getDataValue());
    	} catch (e) {
    		result = "<span style='color:red'>" + e.toString() + "</span>";
    	}
    	this.htmlItems.push(result);
    	while (this.htmlItems.length > 500) this.htmlItems.shift();
    	if (this.isActive) {
    		dojo.create("div", {
    			innerHTML: result
    		}, this.html.domNode);
    	}
    	this.text.setDataValue("");
    	this.text.focus();
    },
    activate: function() {
    	this.isActive = true;
    	if (this.htmlItems.length) {
    		this.html.setHtml("<div>" + this.htmlItems.join("</div><div>") + "</div>");
    	}
    },
    deactivate: function() {
    	this.isActive = false;
    	this.html.setHtml("");
    }});