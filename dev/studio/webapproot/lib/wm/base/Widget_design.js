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
dojo.provide("wm.base.Widget_design");

// =======================================
// this is all designer stuff
// ideally this is only 
// mixed-in when designing
// =======================================

/*
wm.isDesignable = function(inControl) {
	// inControl is designable if it has a non-Widget owner
	return inControl.owner && !(inControl.owner instanceof wm.Widget);
}
*/

/*
wm.Widget.extend({
	publishClass: '',
	_defaultClasses: null,
	sizeable: true,
	scrim: false,
	designCreate: function() {
		this.inherited(arguments);
		if (wm.isDesignable(this))
			new wm.DesignWrapper({ surface: this._designer, control: this });
		if (this._studioCreating && this._defaultClasses)
			this._classes = dojo.mixin({}, this._defaultClasses);
	},
	getNodeStyles: function(inNodeName) {
		return getControlNodeStyles(this.name, inNodeName);
	},
	setNodeStyles: function(inStyles, inNodeName) {
		setControlNodeStyles(this.name, inStyles, inNodeName);
		if (!this._stylesUpdating)
			studio.cssChanged();
	},
	get_styles: function() {
		return getControlStyles(this.name);
	},
	set_styles: function(inStyles) {
		this._stylesUpdating = true;
		if (dojo.isArray(inStyles))
			for (var i=0, s; (s=inStyles[i]); i++)
				this.setNodeStyles(s.css, s.node);
		else
			this.setNodeStyles(inStyles);
		this._stylesUpdating = false;
		if (!this._cupdating)
			studio.cssChanged();
	},
	set_showing: function(inShowing) {
		this.setShowing(inShowing);
		// FIXME: review: can call controlBoundsChange, but need to mess with label so show/hiding directly.
		var dw = this.designWrapper;
		if (dw) {
			dw.domNode.style.display = inShowing ? "" : "none";
			dw.showHideHandles(inShowing);
		}
	},
	isParentLocked: function() {
		return this.parent && this.parent.container && this.parent.getLock();
	},
	isParentFrozen: function() {
		return this.parent && this.parent.container && this.parent.getFreeze();
	},
	isMoveable: function() {
		return this.isParentFrozen() ? false : this.moveable;
	},
	isSizeable: function() {
		return this.isParentFrozen() ? false : this.sizeable && !this.autoSize;
	},
	canResize: function() {
		return this.isSizeable() && !this.autoSize && !this.isFlex();
	},
	_sizeUnits: [ "px", "em", "pt", "flex" ],
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "styles":
				return makeTextPropEdit(inName, inValue, inDefault)
			case "sizing":
				return new wm.propEdit.UnitValue({
					value: this.size + this.sizeUnits,
					component: this, name: inName, options: this._sizeUnits
				});
			case "width":
			case "height":
				return new wm.propEdit.UnitValue({
					component: this, name: inName, value: inValue, options: this._sizeUnits
				});
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "flex":
				this.set_flex(this.flex == 0 ? 1 : 0);
				inInspector.reinspect();
				break;
			default:
				this.inherited(arguments);
				return;
		}
	},
*/	
	/*designMove: function(inTarget, inDropInfo) {
		this.designWrapper.surface.place(this, inTarget, inDropInfo);
	},*/
/*
	writeComponents: function(inIndent, inOptions) {
		var s = this.inherited(arguments);
		return s.concat(this.writeChildren(this.domNode, inIndent, inOptions));
	},
*/
	/*adjustChildProps: function(inCtor, inProps) {
		if (inCtor.prototype instanceof wm.Widget)
			dojo.mixin(inProps, {owner: this.owner, parent: this});
		else
			this.inherited(arguments);
	},*/
/*
	writeProps: function(inOptions) {
		var props = this.inherited(arguments);
		if (!this.autoSize && !(this.sizeUnits == "flex")) {
			var b = this.domNode.parentNode.box;
			if (b=='v') 
				props.height = this.height;
			else if (b=='h')
				props.width = this.width;
		}
		if ((inOptions||0).styles) {
			props.styles = this.get_styles();
		}
		return props;
	},
	writeChildren: function(inNode, inIndent, inOptions) {
		return [];
	}
});

wm.Object.extendSchema(wm.Widget, {
	classNames: { ignore: 1 },
	className: { ignore: 1 },
	_classes: { ignore: 1, category: "Styles", categoryProps: {content: "Styles", image: "images/colorwheel_16.png", inspector: "Styles"}},
	container: { ignore: 1 },
	flex: { ignore: 1 },
	group: { ignore: 1 },
	html: { ignore: 1 },
	id: { ignore: 1 },
	moveable: { ignore: 1 },
	scrim: { ignore: 1 },
	sizeable: { ignore: 1 },
	styles: { ignore: 1 },
	width: { group: "layout", order: 20},
	height: { group: "layout", order: 30},
	parent: { ignore: 1 },
	domNode: { ignore: 1 },
	parentNode: { ignore: 1 },
	widgets: { ignore: 1 },
	showing: { group: "common", order: 30},
	disabled: { bindTarget: true, type: "Boolean", group: "common", order: 40},
	autoSize: { ignore: true},
	size: { ignore: true },
	sizeUnits: { ignore: true }
});
*/
