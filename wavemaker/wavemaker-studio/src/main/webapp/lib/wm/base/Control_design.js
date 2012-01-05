/*
 *  Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.Control_design");

wm.isDesignable = function(inControl) {
	// inControl is designable if it has a non-Widget owner
        // return inControl.owner && !(inControl.owner instanceof wm.Control);
    // warning: can't use inControl.owner == studio.application as studio.application may not have been set yet if we're still creating app level dialogs and components
    return inControl.owner && inControl.owner == studio.page || inControl.owner instanceof wm.Application && (inControl instanceof wm.Dialog || inControl.isAncestorInstanceOf(wm.DesignableDialog));
}

wm.Control.extend({
        themeableProps: ["border", "borderColor"],
        hint: "",
        themeable: true,
	//publishClass: '',
	scrim: false,
        useDesignBorder: 1,
	sizeable: true,
	_defaultClasses: null,
	// design only
        getNumTabbableWidgets: function() {return 1;},
	designMove: function(inTarget, inMoveInfo) {
	    inTarget.designMoveControl(this, inMoveInfo);
	    wm.job("studio.updateDirtyBit",10, function() {studio.updateProjectDirty();});
	},
	resizeUpdate: function(inBounds) {
		// update the boundary rectangle highlight only
		this.designWrapper._setBounds(inBounds);
		// real time resize looks nice but
		// breaks _removeStaticBounds since
		// that method uses the dom size as
		// a cache
		/*
		this.designWrapper.setControlBounds(this.dropRect);
		//this.setBounds(inBounds);
		//this.render();
		*/
	},
	_removeStaticBounds: function(inBounds) {
		var domBox = dojo.marginBox(this.dom.node);
		if (domBox.w == inBounds.w) {
			delete inBounds.w;
		} else 
                    this.autoSizeWidth = false; // turn off autosize if user wants to resize in that axis
		if (domBox.h == inBounds.h) {
			delete inBounds.h;
		} else
                    this.autoSizeHeight = false; // turn off autosize if user wants to resize in that axis
	},
	_sizeFromNode: function(inBounds) {
		var domBox = dojo.marginBox(this.dom.node);
		if (("w" in inBounds) /*&& domBox.w != inBounds.w*/) {
			if (!this.fitToContentWidth)			
				this.width = domBox.w + "px";
                    this.autoSizeWidth = false;
		}
		if (("h" in inBounds) /*&& domBox.h != inBounds.h*/) {
			if (!this.fitToContentHeight)			
				this.height = domBox.h + "px";
                    this.autoSizeHeight = false;
		}

	        this._needsAutoResize = true; 
	},
    designResize: function(inBounds, isUndo) {
	        if (!isUndo) {
	            new wm.PropTask(this, "bounds", dojo.clone(this.bounds));
		}
		// Remove entries from inBounds that match DOM values
		this._removeStaticBounds(inBounds);
		// Make bounds changes
		this.setBounds(inBounds);
		// Render new bounds to DOM
		this.renderBounds();
		// Ensure size (width/height) values match DOM
		this._sizeFromNode(inBounds);
		// Update bounds from size (width/height) values
		this.updateBounds();

            // If its autosize, then when reflowParent is called, it will get autoResized based on changes to one or the other axis size;
            // Example: If I change the width, an autoSizeHeight widget needs to recalculate its height.
                this._needsAutoSize = true; 
            

		// Update our parent's layout
		this.reflowParent();
		// IE6 has trouble refreshing inspector when it contains SELECT
		setTimeout(dojo.hitch(studio.inspector, "reinspect"), 100);
	        wm.job("studio.updateDirtyBit",10, function() {studio.updateProjectDirty();});

	        if (this.parent && this.parent instanceof wm.Container) {
		    var parent = this.parent;
		    wm.job(parent.getRuntimeId() + ".designResize", 50, function() {
			parent.designResizeForNewChild();
		    });
		}
	},
	designCreate: function() {
		this.inherited(arguments);
	        //this.runtimeBorder = this.border;
	        //this.setBorder(this.getDesignBorder());
		if (wm.isDesignable(this))
			new wm.DesignWrapper({ surface: this._designer, control: this });
		if (this._studioCreating && this._defaultClasses)
			this._classes = dojo.mixin({}, this._defaultClasses);
	},
    set_owner: function() {
        this.inherited(arguments);
        if (this.designWrapper)
            this.designWrapper.controlNameChanged();
    },
	// Begin design border
	/*
		Gambit: store the real border in runtimeBorder and 
		toggle border between that and a default border based on studio setting
		This should replicate the 4x behavior. Unfortunately, every page widget 
		must be rendered to apply the change.
	*/
/*
	applyDesignBorder: function() {
		var db = this.getDesignBorder();
		if (db != this.border) {
			this.border = db;
			this.borderExtents = this._parseExtents(this.border);
			wm.Bounds.prototype.padBorderMarginChanged.call(this);
			this.render();
		}
	},
	*/
	getDesignBorder: function(optionalBorder) {
		var useDesignBorder = studio.useDesignBorder && this.useDesignBorder && wm.isDesignable(this) && studio.selected != this;
            //var border = this._parseExtents(this.runtimeBorder);
	    var border = this._parseExtents(optionalBorder || this.border);

            if (useDesignBorder) {
	    this.designBorderState = {t: !Boolean(border.t),
				   b: !Boolean(border.b),
				   l: !Boolean(border.l),
				   r: !Boolean(border.r)};
/*
                if (!border.t) border.t = 1;
                if (!border.b) border.b = 1;
                if (!border.l) border.l = 1;
                if (!border.r) border.r = 1;
                return border.t + "," + border.r + "," + border.b + "," + border.l;
		*/
            } else {
		delete this.designBorderState;
                //return this.runtimeBorder; // What the???
            }
	    //return useDesignBorder ? (Number(this.runtimeBorder) ? this.runtimeBorder : "1") : this.runtimeBorder;
	},

    set_margin: function(inMargin) {
	    inMargin = dojo.trim(String(inMargin));
	    inMargin = inMargin.replace(/\s*,\s*/g, ",");
	    inMargin = inMargin.replace(/px/g,"");
	    inMargin = inMargin.replace(/\s+/g,",");
	this.setMargin(inMargin);
    },
    set_padding: function(inPadding) {
	    inPadding = dojo.trim(String(inPadding));
	    inPadding = inPadding.replace(/\s*,\s*/g, ",");
	    inPadding = inPadding.replace(/px/g,"");
	    inPadding = inPadding.replace(/\s+/g,",");
	this.setPadding(inPadding);
    },
	set_border: function(inBorder) {
	    inBorder = dojo.trim(String(inBorder));
	    inBorder = inBorder.replace(/\s*,\s*/g, ",");
	    inBorder = inBorder.replace(/px/g,"");
	    inBorder = inBorder.replace(/\s+/g,",");
	    if (this.isDesignLoaded()) {
		//this.runtimeBorder = inBorder;
		//inBorder = this.getDesignBorder();
		this.getDesignBorder(inBorder); // calculates the designBorderState property
	    }

	    this.setBorder(inBorder);
	},
/*
	get_border: function() {
		return this.isDesignLoaded() ? this.runtimeBorder : this.border;
	},
	*/
/*
	writeProps: function() {
		var p = this.inherited(arguments);
		p.border = this.runtimeBorder;
		if (p.border == this.constructor.prototype.border)
			delete p.border
		return p;
	},
	// End design border
*/
/*
	getNodeStyles: function(inNodeName) {
		return getControlNodeStyles(this, inNodeName);
	},
	setNodeStyles: function(inStyles, inNodeName) {
	    setControlNodeStyles(this, inStyles, inNodeName);
		if (!this._stylesUpdating)
			studio.cssChanged();
	},
	get_styles: function() {
		return getControlStyles(this);
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
	*/
	set_showing: function(inShowing) {
		this.setShowing(inShowing);
		wm.fire(this.designWrapper, "setShowing", [inShowing]);
	},
    //=======================================================
    // Properties
    //=======================================================
    listProperties: function() {
	var p = this.inherited(arguments);
	p.autoSizeWidth.ignoretmp = (!this.isSizeable() && !this.autoSizeWidth) || (this.schema.autoSizeWidth && this.schema.autoSizeWidth.ignore);
	p.autoSizeHeight.ignoretmp = (!this.isSizeable() && !this.autoSizeHeight) || (this.schema.autoSizeHeight && this.schema.autoSizeHeight.ignore);
        p.minWidth.ignoretmp = !this.schema.minWidth || this.schema.minWidth.ignore || (!this._percEx.w && !this.autoSizeWidth); // minWidth only applies if width is % or autosize is on
        p.minHeight.ignoretmp = this.schema.minHeight.ignore || (!this._percEx.h && !this.autoSizeHeight); // minHeight only applies if height is % or autosize is on
	//p.width.ignore = p.width.writeonly = !this.isSizeable() || !this.canSetWidth();
	//p.height.ignore = p.height.writeonly = !this.isSizeable() || !this.canSetHeight();
	p.width.ignoretmp = p.width.writeonly = this.schema.width.ignore || !this.isSizeable() || this.autoSizeWidth;
	p.height.ignoretmp = p.height.writeonly = this.schema.height.ignore || !this.isSizeable() || this.autoSizeHeight;
	// _classes as array for bc; now an object that supports storing sets of classes
	if (p._classes)
	    p._classes.writeonly = (dojo.isArray(this._classes) && this._classes.length) || !wm.isEmpty(this._classes);
	    if (p.parent && p.parent.layoutKind == "fluid") {
		p.minWidth.advanced = false;
	    }
	return p;
    },
    showImageListDialog: function() {
	var imageList = this._imageList
	if (!imageList) {
	    var imageListName = studio.getImageLists()[0];
	    if (imageListName) {
		this.setImageList(imageListName);
		imageList = this._imageList;
	    }
	}
	if (imageList) {
	    var popupDialog = imageList.getPopupDialog();
	    popupDialog.fixPositionNode = dojo.query(".wminspector-prop-button",dojo.byId("propinspect_row_editImageIndex"))[0];
	    
	    this._designImageListSelectCon = dojo.connect(imageList._designList, "onselect", this, function() {		    
		    this.setImageIndex(imageList._designList.getSelectedIndex());
		    studio.inspector.reinspect();
	    });

	    popupDialog.show();
	    this._designImageListPopupCloseCon = dojo.connect(popupDialog, "setShowing", this, function(inShowing) {
		if (!inShowing || studio.selected != this) {
		    dojo.disconnect(this._designImageListPopupCloseCon);
		    delete this._designImageListPopupCloseCon;
		    dojo.disconnect(this._designImageListSelectCon);
		    delete this._designImageListSelectCon;
		}
	    });
	}
    },
    editImageIndex: function() {
	    this.showImageListDialog();
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
            return !this.isParentFrozen() && this.sizeable;
            /* mkantor: Commented out 4/14/2010; presumed WM 4.x only 
		return this.isParentFrozen() ? false : this.sizeable && !this.autoSize;
                */
	},
        /* Used by the design wrapper to determine if its control is resizable */
	canResize: function(box) {
	    return /* !(box=="v" && this.autoSizeWidth) && !(box == "h" && this.autoSizeHeight) && */ this.isSizeable();
            /* mkantor: Commented out 4/14/2010; presumed WM 4.x only 
		return this.isSizeable() && !this.autoSize && !this.isFlex();
                */
	},

	writeComponents: function(inIndent, inOptions) {
		var s = this.inherited(arguments);
		return s.concat(this.writeChildren(this.domNode, inIndent, inOptions));
	},
	/*adjustChildProps: function(inCtor, inProps) {
		if (inCtor.prototype instanceof wm.Widget)
			dojo.mixin(inProps, {owner: this.owner, parent: this});
		else
			this.inherited(arguments);
	},*/
	/*
	writeProps: function(inOptions) {
		var props = this.inherited(arguments);
		if (!this.autoSize && !this.fluidSize) {
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
	*/
	writeChildren: function(inNode, inIndent, inOptions) {
		return [];
	}
	// EXPERIMENTAL: use property ui to do binding...
	// NOTE: does not currently handle app bindings or Expressions
	/*makePropEdit: function(inName, inValue, inDefault) {
		var info = this.getPropertyType(inName);
		if (info && (info.bindable || info.bindTarget)) {
				var i = makeInputPropEdit(inName, inValue, inDefault);
				var b = '<img class="wminspector-prop-button" src="images/target.png" style="width:23px;height:21px">';
				return '<table class="prop-table" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td' + (inValue==inDefault ? ' class="prop-default"' : '') + '>' + i + '</td><td class="prop-button">' + b + '</td></tr></table>';
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		var info = this.getPropertyType(inName);
		if (info && (info.bindable || info.bindTarget)) {
				wm.onidle(this, "beginBind", inName);
		} else
			return this.inherited(arguments);
	},
	beginBind: function(inPropName) {
		studio.onSelectProperty = dojo.hitch(this, "selectProperty");
		studio.selectProperty(this, null, "Select bind source for " + this.getId() + "." + inPropName);
		this._bindProp = inPropName;
	},
	selectProperty: function(inId) {
		studio.onSelectProperty = null;
		var id = inId.replace("studio.wip.", "");
		var ids = id.split("."), c = ids.shift(), prop = ids.join(".");
		var c = studio.wip.getValue(c);
		var binding = this.$.binding;
		console.log("target", this.getId(), this._bindProp, "source", id);
		if (c && binding && this._bindProp) {
			if (c.isEventProp(prop))
				alert("Cannot bind to an event.");
			// bind
			else {
				binding.addWire("", this._bindProp, id);
				this._bindProp = null;
				studio.inspector.reinspect();
			}
		}
	}*/
});

wm.Object.extendSchema(wm.Control, {
    imageList: {ignore: 1, group: "widgetName", subgroup: "graphics", order: 50, editor: "wm.prop.ImageListSelect"},
    imageIndex: {ignore: 1, group: "widgetName", subgroup: "graphics", order: 51, type: "Number",  doc: 1},
    editImageIndex: {ignore: 1, group: "widgetName", subgroup: "graphics", order: 52, type: "String", doc: 1, operation: 1},
        noInspector: {ignore: 1}, // obsolete property, but still don't want it showing in property panels
        numTabbableWidgets: {ignore: 1},
        internalTabIndex: {writeonly: 1, ignore: 1},
        useDesignBorder: {ignore: 1},
	classNames: { ignore: 1 },
	className: { ignore: 1 },
    styles: {order: 50, group: "style", editor: "wm.prop.StyleEditor"},
    _classes: {writeonly:1},
    classes: {order: 100, group: "style", hidden:true}, // handled by StyleEditor
	container: { ignore: 1 },
	flex: { ignore: 1 },
	group: { ignore: 1 },
	html: { ignore: 1 },
	id: { ignore: 1 },
	owner: { ignore: 1 },
	moveable: { ignore: 1 },
	scrim: { ignore: 1 },
    autoSizeWidth:  { ignore: 1,  group: "display", subgroup: "layout", advanced: true },
    autoSizeHeight:  { ignore: 1,  group: "display", subgroup: "layout", advanced: true },
    autoSize: {type: "String", options: ["none", "width", "height"],  ignore: 1,  group: "display", subgroup: "layout", advanced: true },

	sizeable: { ignore: 1 }, // Property tells designer if a given class of widgets can be resized; splitter is an example of a widget where you might want this set to false

    onShow: {group: "events", order: 500, advanced:1},
    onHide: {group: "events", order: 500, advanced:1},
    onRightClick: {group: "events", order: 2000, advanced: 1},
    onMouseOver: {group: "events", order: 2001, advanced: 1},
    onMouseOut: {group: "events", order: 2002, advanced: 1},
    customToHtml: {advanced: 1},

    //runtimeBorder: { ignore: 1 },
    width: { group: "display", subgroup: "layout", order: 20, doc: 1, editor: "wm.prop.SizeEditor"},
    height: { group: "display", subgroup: "layout",  order: 30, doc: 1, editor: "wm.prop.SizeEditor"},
    minWidth: { group: "display", subgroup: "layout", order: 40, advanced: true, ignoreHint: "minWidth is only available when width is % sized"},
    minHeight: { group: "display", subgroup: "layout", order: 50, advanced: true, ignoreHint: "minHeight is only available when height is % sized"},
    mobileHeight:{ group: "display", subgroup: "layout",  order: 80, doc: 1, editor: "wm.prop.SizeEditor", advanced: true},

    parent: { ignore: 1, doc: 1, prototype: "wm.Control" },
    domNode: { ignore: 1, doc: 1 },
	parentNode: { ignore: 1 },
	widgets: { ignore: 1 },
    showing: { bindTarget: true, group: "common", order: 30, doc: 1, type: "Boolean"},
    disabled: { bindTarget: true, type: "Boolean", group: "common", order: 40, doc: 1},
	size: { ignore: true },
        sizeUnits: { ignore: true },
    hint: {group: "common", order: 1000, type: "String", bindTarget: true, advanced: true},
    setShowing: {method:1},

    setBorder: {method:1},
    setBorderColor: {method:1},
    setPadding: {method:1},
    setMargin: {method:1},
    setWidth: {method:1},
    setHeight: {method:1},

    isAncestorHidden: {method:1, returns: "Boolean"},
    setParent: {method:1},



    invalidCss: {ignore: 1},
    renderedOnce: {ignore: 1},
    bounds: {ignore: 1},

    /* These 4 are marked as hidden but are actually handled by the StyleInspector */
    border: {group: "style", order: 100},
    borderColor: {group: "style", editor: "wm.ColorPicker", order: 101},
    padding: {group: "style", order: 102},
    margin: {group: "style", order: 103},

		//backgroundColor: {group: "style"},
		backgroundColor: {ignore: 1},

    autoScroll: {group: "display", subgroup: "scrolling", order: 100, writeonly: 1, type: "Boolean"},
    scrollX: {group: "display", subgroup: "scrolling", order: 101, writeonly: 1, advanced: 1},
    scrollY: {group: "display", subgroup: "scrolling", order: 102, writeonly: 1, advanced: 1}
    
    
});
