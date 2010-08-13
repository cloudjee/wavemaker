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
dojo.provide("wm.base.components.WebjitInstaller");

dojo.declare("wm.WebjitInstaller", wm.Component, {
	url: "http://localhost:8080/wavemaker/lib/wm/webjits/google-map3.xml",
	install: "(install)",
	uninstall: "(uninstall)",
	webjitName: "",
	write: function() {
		return "";
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "webjitName":
				var opts = studio.palette.getItemNames("Webjits");
				if (!inValue)
					inValue = opts ? opts[0] : "";
				this.webjitName = inValue;
				return makeSelectPropEdit(inName, inValue, opts, inDefault);
			case "install":
			case "uninstall":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "install":
				this.installWebjit();
				return;
			case "uninstall":
				this.uninstallWebjit();
				return;
		}
		return this.inherited(arguments);
	},
	parseWidgetXml: function(inDocument) {
		var def = {};
		var node = inDocument.firstChild.firstChild;
		while (node) {
			if (node.nodeType == 1) {
				switch (node.tagName) {
					case "property":
						break;
				default:
					def[node.tagName] = node.textContent;
					break;
				}
			}
		node = node.nextSibling;
		}
		return def;
	},
	installWebjit: function() {
		this.loadRemoteWebjit(this.url);
	},
	loadRemoteWebjit: function(inUrl) {
		this.url = inUrl;
		studio.webService.requestAsync("invokeRestCall", [inUrl], 
			dojo.hitch(this, "loadRemoteWebjitCallback"), 
			dojo.hitch(this, "loadRemoteWebjitError"));
	},
	loadRemoteWebjitCallback: function(inResponse) {
		if (inResponse && inResponse.length > 0) {
			if (inResponse.length > 1) {
				alert("Unable to load Webjit: " + inResponse[1]);
			} else {
				var d = wm.createDocument(inResponse[0]);
				this.installWebjitXml(d);
			}
		}
	},
	loadRemoteWebjitError: function(inError) {
		alert("Unable to load Webjit: " + inError);
	},
	installWebjitXml: function(inData) {
		var def = this.parseWidgetXml(inData);
		//
		def.name = def.name || this.url.split("/").pop().split("?").shift().split(".").shift().replace("-", "_").replace(" ", "_");
		def.icon = def.icon || "images/wm/template.png";
		def.title = def.title || def.name;
		//
		//console.log(def);
		var className = "dw." + def.name;
		data = [
			'dojo.provide("common.packages.', className, '");',
			'\n\n',
			def.script,
			'\n\n',
			'dojo.declare("', className, '_dw", wm.DW, DW);',
			'dojo.declare("', className, '", wm.Webjit, { dwClass: ', className, '_dw });',
			'\n\n',
			'registerPackage(["Webjits", ',
				'"' + def.name + '", ',
				'"' + className + '", ',
				'"wm.base.widget.Webjit", ',
				'"' + def.icon + '", ',
				'"' + def.title + '"',
				']);'
		].join('');
		//console.log(data);
		studio.deployComponent(def.name, "dw", def.name, "Webjits", data);
	},
	uninstallWebjit: function() {
		if (this.webjitName) {
			if (confirm("Are you sure you want to uninstall " + this.webjitName + "?")) {
				studio.undeployComponent(this.webjitName, "dw", this.webjitName, "Webjits", true);
				this.webjitName = "";
			}
		} else {
			alert("Please select the name of the Webjit you would like to uninstall.");
		}
	}
});

wm.addPropertyGroups({
	install: {displayName: "Install", order: 100}, 
	uninstall: {displayName: "Uninstall", order: 110}
});

wm.Object.extendSchema(wm.WebjitInstaller, {
	name: {ignore: 1},
	url: {group: "install", order: 10},
	install: {group: "install", order: 20},
	webjitName: {group: "uninstall", order: 10},
	uninstall: {group: "uninstall", order: 20}
});

// self-installing UI
dojo.addOnLoad(function() {
	dojo.connect(Studio.prototype, "start", function() {
		var p = this.studioToolbarButtons;
		p.createComponent("installWebjitBtn", "wm.Button", {imageList: "canvasToolbarImageList", imageIndex: 7, width: "36px", hint: "Install Webjit" }, {onclick: "installWebjitClick"});
		p.reflow();
	});
	Studio.prototype.installWebjitClick = function(inSender, info, text) {
		var wi = this.webjitInstaller;
		if (!wi)
			wi = new wm.WebjitInstaller({name: "webjitInstaller", owner: studio});
		studio.inspector.inspect(wi);
	}
});