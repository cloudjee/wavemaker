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
dojo.provide("wm.base.components.CssLoader");

dojo.declare("wm.CssLoader", wm.Component, {
	url: "",
	css: "",
	relativeUrl: true,
	init: function() {
		this.inherited(arguments);
		if (this.url)
			this.setUrl(this.url);
		else
			this.setCss(this.css);
	},
	destroy: function () {
		this._sheet = null;
		this.inherited(arguments);
	},
	getStyleSheet: function() {
		// should we have a shared stylsheet or manage separate ones (IE has a 30 stylesheet limit)
		if (dojo.isIE && !this._sheet)
				this._sheet = wm.CssLoader.sheet || (wm.CssLoader.sheet = this.makeSheet());
		if (!this._sheet) {
			this._sheet = this.makeSheet();
		}
		return this._sheet;
	},
	makeSheet: function() {
		var sheet = document.createElement("style");
		sheet.setAttribute("type", "text/css");
	        document.getElementsByTagName("head")[0].appendChild(sheet);
	        //document.getElementbody.previousSibling.appendChild(sheet); in Firefox 4 beta, this come up as a <TextNode/>
		return sheet;
	},
	setUrl: function(inUrl) {
		this.url = inUrl || "";
		if (this.url) {
			var loadUrl = this.relativeUrl ? this.getPath() + this.url : this.url;
			this.setCss(wm.load(loadUrl, true));
		}
	},
	setCss: function(inCss) {
		this.clearCss();
		this.css = inCss || "";
		if (this.css)
			this.addCss(this.css);
	},
	/*installCss: function(inCss){
		this.removeCss();
		this.addCss(inCss);
	},*/
	clearCss: function() {
		this.css = "";
		this.removeCss();
	},
	removeCss: function() {
		// FIXME: IE uses global stylesheet so do not clear styles
		// this will be an IE limitation until addressed with better stripping logic
		if (dojo.isIE)
			return;
		var s=this.getStyleSheet();
		if (s)
			if(s.styleSheet)//IE
				s.styleSheet.cssText = "";
			else {
				while (s.firstChild)
					s.removeChild(s.firstChild);
			}
	},
	addCss: function(inCss) {
		if (this.isDesignLoaded()) {
			var p = this.getPath();
			// if relative paths to images are used in css, prepend the project design path
			// so that the image is resolved at designtime.
			inCss = inCss.replace(/url\s*\(\s*([^(http:)\/].*)\.*\)/g, "url(" + p + "$1)");
		}
		var s = this.getStyleSheet();
		if(s.styleSheet) {//IE
			s.styleSheet.cssText = [s.styleSheet.cssText, inCss].join("\n");
		} else {
			s.appendChild(document.createTextNode("\n"));
			s.appendChild(document.createTextNode(inCss));
		}
	},
	listProperties: function() {
		var p = this.inherited(arguments);
		p.css.ignore = this.url;
		return p;
	}
});

wm.getSyntaxEditorDialog = function() {
	if (!wm._syntaxEditorDialog) {
		wm._syntaxEditorDialog = new wm.PageDialog({
			name: "syntaxEditorDialog",
			owner: studio,
			contentWidth: 600,
			contentHeight: 500,
			hideControls: true,
			pageName: "SyntaxEditor"
		});
	}
	return wm._syntaxEditorDialog;
}

wm.CssLoader.extend({
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "css":
				return makeReadonlyButtonEdit(inName, "(css)", "(css)");
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "css":
				this.showCssDialog();
				return;
		}
		return this.inherited(arguments);
	},
	showCssDialog: function() {
		var d = wm.getSyntaxEditorDialog();
		this._dialogConnect = dojo.connect(d, "onClose", this, "cssDialogClosed");
		d.show();
		d.page.update(this.css, "css");
	},
	cssDialogClosed: function(inWhy) {
		dojo.disconnect(this._dialogConnect);
		this._dialogConnect = null;
		if (inWhy == "OK") {
			var d = wm.getSyntaxEditorDialog();
			this.setCss(d.page.getEditorText());
		}
	}
});

/*
wm.registerPackage(["Components", "CssLoader", "wm.CssLoader", "wm.base.components.CssLoader", "images/wm/content.png", ""]);
*/
