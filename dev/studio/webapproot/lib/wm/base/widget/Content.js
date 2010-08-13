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
dojo.provide("wm.base.widget.Content");
dojo.require("wm.base.widget.Box");

dojo.declare("wm.Content", wm.Box, {
	width: "100%", 
	height: "200px",
	scrim: true,
	autoScroll: true,
	allowDuplicateContent: false,
	content: "",
	resource: "",
	/*build: function() {
		if (this.content)
			this.domNode = this._makeContentNode();
		this.inherited(arguments);
	},*/
	init: function() {
		this.inherited(arguments);
		this.setContent(this.content);
	},
	setContent: function(inContent) {
		this.content = inContent;
		this.contentChanged(true);
	},
	setResource: function(inResourcePath) {
	    this.resource = inResourcePath;
	    this.contentChanged();
	},
	_makeContentNode: function() {
		var
			c = this.content && dojo.byId(this.content),
			n = c ? (this.allowDuplicateContent ? c.cloneNode(true) : c) : document.createElement('div');

		dojo.addClass(n, "wmcontent");
		return n;
	},
	contentChanged: function(forceUpdate) {
	    // ignore publish events about markup changes if your stuck in a page container
	    if (!forceUpdate && this.isDesignedComponent() && this.owner != studio.page) return;
		var dn = this.domNode;
		if (dn.firstChild)
			dn.removeChild(dn.firstChild);
		if (this.resource) {
		    var root = this.resource.slice(0, 4) != "http" && this.resource.slice(0, 1) != "/" ? this.getPath() : "";
			if (!this.htmlLoader)
				this.htmlLoader = new wm.HtmlLoader({owner: this, relativeUrl: true});
			this.htmlLoader._htmlNode = this.domNode;
		        this.htmlLoader.setUrl(root + this.resource);
		} else {
		    var n = this._makeContentNode();
		    dn.appendChild(n);
		}
		/*var o=this.domNode, p=o&&o.parentNode;
		var n = this._makeContentNode();
		if (n) {
			var b = dojo._getMarginBox(o);
			if (p) {
				var ns = o.nextSibling;
				p.removeChild(o);
				n = n || document.createElement('div');
				p.insertBefore(n, ns);
			}
			// use box from the content node.
			//this.box = n.box;
			this.setDomNode(n);
			dojo.marginBox(n, b);
			this.reflowParent();
		}*/
	}
});

