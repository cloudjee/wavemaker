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
dojo.provide("wm.studio.pages.BindSourceDialog.BindSourceDialog");

dojo.require("wm.base.components.Binding");
dojo.require("wm.studio.app.binding");

dojo.declare("BindSourceDialog", wm.Page, {
	start: function() {
	    this.connect(this.owner.parent, "onClose", this, "onClose");
	},
	initBinding: function() {
		this.binderSource.initBinding();
	},
    onClose: function(inWhy) {
	var object = this.targetProps.object;

	// if the user clicked on any other components while binding, reselect the component that we're binding onClose
	// However, this results in bad behaviors if we try to reselect a subcomponent, like the input of a servicevariable
	if (object.owner == studio.page)
	    studio.select(object); 
    },
    update: function(inTargetProps, noRegen) {
		this.targetType = this._getTargetType(inTargetProps);
		var
			tp = this.targetProps = inTargetProps,
			w = wm.data.getPropWire(tp.object, tp.targetProperty);
		this.binderSource.initBinding(noRegen);
		this.binderSource.updateUiForWire(w);

	    //this.bindTargetLabel.setValue("caption", [(tp.object|| 0).getId(), tp.targetProperty].join('.'));
	    this.owner.owner.setTitle("Binding: " +  [(tp.object|| 0).getId(), tp.targetProperty].join('.'));
		var bindname = wm.getFriendlyTypeName(this.targetType.type, this.targetType.isList) ;
		if (bindname.length > 30) bindname = "..." + bindname.substring(bindname.length-30);
		this.bindTargetTypeLabel.setCaption('<span style="font-weight: bold">Type:</span> <span style="font-style: italic;">' + bindname + "</span>");

		if (tp.subtype == "File") {
		    this.resourceRb.editor.setChecked(true);
		}
	},
	_getTargetType: function(inTargetProps) {
		var 
			tp = inTargetProps,
			p = tp.targetProperty.split("."),
			l = p.pop(),
			v = tp.object.getValue(p.join(".")),
			ti = v && v.getDataTypeInfo(l),
			type, isObject, isList;
		if (tp.object.getDataTypeInfo && (!p || !p.length)) {
			ti = tp.object.getDataTypeInfo(l);
			if (!ti) {
				type = tp.object.type;
				isList = tp.isList;
			}
		}
		if (ti) {
			type = ti.type;
			isList = ti.isList;
		}
		type = type || tp.type;
		type = wm.typeManager.getPrimitiveType(type) || type;
		isObject = type == "wm.Variable" || wm.typeManager.isStructuredType(type);
		return {type: type, isObject: isObject, isList: isList || tp.isList};
	},
	bindNodeSelected: function(inSender, inNode) {
	    if (inNode) {
		var targetOwner = this.targetProps.object.getRoot();		
		var ownerString = "";
		if (inNode.object) {
		    var nodeOwner = inNode.object.getRoot();
		    if (targetOwner != nodeOwner) {
			if (nodeOwner == studio.page)
			    ownerString = wm.decapitalize(studio.project.pageName) + ".";
			else if (nodeOwner == studio.application)
			    ownerString == "app.";
			else
			    ownerString = nodeOwner.getRuntimeId();
		    }
		}
		this.binderSource.bindEditor.setValue("dataValue", ownerString + inNode.source);
	    }
	},
	applyButtonClick: function() {
		if (this.binderSource.applyBinding(this.targetProps))
			this.cancelButtonClick();
	},
	applyStayButtonClick: function() {
	    if (this.binderSource.applyBinding(this.targetProps))
		app.toastSuccess("Binding Added");
	    else
		app.toastWarning("Binding Failed");
	},
	cancelButtonClick: function() {
		wm.fire(this.owner.owner, "dismiss");
	}
});
