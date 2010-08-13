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
dojo.provide("wm.base.components.HtmlLoader");

wm.getNodeIds = function(inNode) {
	var ids = [];
	dojo.forEach(inNode.childNodes, function(n) {
		if (n.id)
			ids.push(n.id)
	});
	return ids;
}

dojo.declare("wm.HtmlLoader", wm.Component, {
	url: "",
	html: "",
	relativeUrl: true,
	init: function() {
		this.inherited(arguments);
		this.inherited(arguments);
		if (this.url)
			this.setUrl(this.url);
		else
			this.setHtml(this.html);
	},
	destroy: function() {
		this.html = null;
		dojo.destroy(this._htmlNode);
		this._htmlNode = null;
		this.inherited(arguments);
	},
	setUrl: function(inUrl) {
		this.url = inUrl || "";
		if (this.url) {
			var loadUrl = this.relativeUrl ? this.getPath() + this.url : this.url;
			this.setHtml(wm.load(loadUrl, true));
		}
	},
	setHtml: function(inHtml) {
		this.clearHtml();
		this.html = inHtml || "";
		if (this.html)
			this.addHtml(this.html);
		dojo.publish("wm-markupchanged");
	},
	clearHtml: function() {
		this.html = "";
		this.removeHtml();
	},
	getHtmlNode: function() {
		if (!this._htmlNode) {
			var n = this._htmlNode = document.createElement("div");
			n.style.display = "none";
			document.body.appendChild(n);
		}
		return this._htmlNode;
	},
	/*installHtml: function(inHtml) {
		var n = this.getHtmlNode();
		n.innerHTML = inHtml;
	},*/
	addHtml: function(inHtml) {
		if (this.isDesignLoaded()) {
			var p = this.getPath();
			// if relative paths to images are used in html, prepend the project design path
			// so that the image is resolved at designtime.
			inHtml = inHtml.replace(/<img([^>]*)src[^>]*=[^>]*(["'])([^(http:)\/][^>]*)\2/g, '<img$1src="' + p + '$3"');
		}
		var n = this.getHtmlNode();
		n.innerHTML = [n.innerHTML, inHtml].join("\n");
	},
	removeHtml: function() {
		var n = this.getHtmlNode();
		if (n)
			n.innerHTML = "";
	},
	listProperties: function() {
		var p = this.inherited(arguments);
		p.html.ignore = this.url;
		return p;
	},
	getNodeIds: function() {
		return wm.getNodeIds(this.getHtmlNode());
	}
});

wm.HtmlLoader.extend({
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "html":
				return makeReadonlyButtonEdit(inName, "(html)", "(html)");
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "html":
				this.showHtmlDialog();
				return;
		}
		return this.inherited(arguments);
	},
	showHtmlDialog: function() {
		var d = wm.getSyntaxEditorDialog();
		this._dialogConnect = dojo.connect(d, "onClose", this, "htmlDialogClosed");
		d.show();
		d.page.update(this.html, "html");
	},
	htmlDialogClosed: function(inWhy) {
		dojo.disconnect(this._dialogConnect);
		this._dialogConnect = null;
		if (inWhy == "OK") {
			var d = wm.getSyntaxEditorDialog();
			this.setHtml(d.page.getEditorText());
		}
	}
});

/*
wm.registerPackage(["Components", "HtmlLoader", "wm.HtmlLoader", "wm.base.components.HtmlLoader", "images/wm/content.png", ""]);
*/
