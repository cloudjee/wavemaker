/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
dojo.provide("wm.studio.app.inspector.SecurityInspector");
dojo.require("wm.studio.app.inspector.Inspector");

dojo.declare("wm.SecurityInspector", [wm.Box, wm.InspectorBase], {
	scrollY: true,
	flex: 1,
	box: 'v',
	_source: {
		roleLabel: ["wm.Label", {height: '20px', caption: 'Visible to:'}, {}, {}],
		roleTree: ["wm.Tree", {scrollY:false}, {}, {}]
	},
	init: function() {
		dojo.addClass(this.domNode, "wmstyleinspector");
		this.createComponents(this._source);
		// inherited init deals with showing layers so call after adding layers
		this.inherited(arguments);
		this.subscribe("wm-project-changed", this, "studioProjectChanged");
		this.roleTree = this.widgets.roleTree;
		this.initComponentStyle();
		this.connect(this.roleTree, "oncheckboxclick", this, "roleCheckboxClick");
	},
	initComponentStyle: function(){
		var roleLabel = this.widgets.roleLabel;
		roleLabel.domNode.style.position = '';
		roleLabel.domNode.style.width = '';
		this.roleTree.domNode.style.position = '';
		this.roleTree.domNode.style.width = '';
		this.roleTree.domNode.style.height = '';
	},
	initRoles: function() {
		this.roleTree.clear();
		var n = wm.roles || [];
		this.everyoneNode = new wm.TreeCheckNode(this.roleTree.root, {content: 'Everyone', closed: true, name: 'Everyone'});
		for (var i=0, c; (c=n[i]); i++) {
			new wm.TreeCheckNode(this.roleTree.root, {content: c, closed: true, name: c});
		}
	},
	studioProjectChanged: function() {
		this.getRoles();
	},
	getRoles: function() {
		studio.securityConfigService.requestSync("getRoles", [], dojo.hitch(this, "getRolesResult"));
	},
	getRolesResult: function(inData) {
		wm.roles = inData || [];
	},
	inspect: function(inInspected, inProps) {
		this.initRoles();
		var ins = inInspected, def = "domNode";
		var isWidget = ins instanceof wm.Widget;

		this.roleTree.setShowing(isWidget);
		if (!isWidget)
			return;
		
		this.nodeName = (inProps||0).nodeName || def;
		var c = ins.roles || [];
		if (!dojo.isArray(c)) {
			console.debug("inspector: ", ins, " has non-array roles");
			return;
		}
		
		this.everyoneNode.setChecked(!c.length);
		if (c.length) {
			this.roleTree.forEachNode(dojo.hitch(this, function(inNode) {
				if (inNode.setChecked) {
					inNode.setChecked(dojo.indexOf(c, inNode.name) >= 0);
				}
			}));
		}
	},
	roleCheckboxClick: function(inNode) {
		var i = this.owner.inspected;
		if (inNode == this.everyoneNode) {
			if (inNode.getChecked()) {
				i.removeAllRoles();
				this.roleTree.forEachNode(dojo.hitch(this, function(inNode) {
					if (inNode.setChecked && inNode != this.everyoneNode) {
						inNode.setChecked(false);
					}
				}));
			} else {
				inNode.setChecked(true);
			}
		} else {
			i[inNode.getChecked() ? "addRole" : "removeRole"](inNode.name);
			this.everyoneNode.setChecked(!i.roles);
		}
	}
});