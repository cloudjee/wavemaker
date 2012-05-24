/*
 * Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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
 
dojo.provide("wm.studio.pages.BindSourceDialog.BindSourceDialog");

dojo.require("wm.base.components.Binding");
dojo.require("wm.studio.app.binding");

dojo.declare("BindSourceDialog", wm.Page, {
    i18n: true,
	start: function() {
	    this.connect(this.owner.parent, "onClose", this, "onClose");
	},
	initBinding: function(inProp) {
	    this.binderSource.initBinding(false, inProp);
	},
    onClose: function(inWhy) {
	var object = this.targetProps.object;

	// if the user clicked on any other components while binding, reselect the component that we're binding onClose
	// However, this results in bad behaviors if we try to reselect a subcomponent, like the input of a servicevariable
	if (object.owner == studio.page) {
	    if (object != studio.selected) {
		studio.select(object); 
	    }
	}
    },
    update: function(inTargetProps, noRegen) {
	this.binderSource.pageSelect.beginEditUpdate();
	this.binderSource.pageSelect.setDataValue(studio.project.pageName);
	this.binderSource.pageSelect.endEditUpdate();

	this.targetType = this._getTargetType(inTargetProps);
	var tp = this.targetProps = inTargetProps;
	var w;
        if (tp.targetProperty) {
            w = tp.object.$.binding ? tp.object.$.binding.wires[tp.targetProperty] : null;
        } else {
            w = tp.object.owner.$.binding ? tp.object.owner.$.binding.wires[tp.object.name] : null;
        }

	var propDef;
	if (inTargetProps.propDef) {
	    propDef = dojo.clone(inTargetProps.propDef);
	} else {
	    propDef = tp.object.listProperties()[inTargetProps.targetProperty];
	}
	if (!propDef && tp.object._dataSchema) {
	    var object = tp.object;
	    if (inTargetProps.targetProperty.indexOf(".") != -1) {
		var parts = inTargetProps.targetProperty.split(/\./);
		while (parts.length > 1) {
		    var currentPart = parts.shift();
		    object = object.getValue(currentPart);
		}
		propDef = object._dataSchema[parts[0]];
	    } else {
		propDef = tp.object._dataSchema[inTargetProps.targetProperty];
	    }
	}
	if (!propDef) propDef = {};
	this.binderSource.initBinding(noRegen,  propDef);
	this.binderSource.updateUiForWire(w, tp.displayExpression ? tp.object.getProp(tp.targetProperty) : "");
	
	    //this.bindTargetLabel.setValue("caption", [(tp.object|| 0).getId(), tp.targetProperty].join('.'));
	    this.owner.owner.setTitle("Binding: " +  [(tp.object|| 0).getId(), tp.targetProperty].join('.'));
		var bindname = wm.getFriendlyTypeName(this.targetType.type, this.targetType.isList) ;
		if (bindname.length > 30) bindname = "..." + bindname.substring(bindname.length-30);
		this.bindTargetTypeLabel.setCaption('<span style="font-weight: bold">Type:</span> <span style="font-style: italic;">' + bindname + "</span>");

		if (propDef.subtype == "File") {
		    this.resourceRb.editor.setChecked(true);
		} else if (tp.displayExpression) {
		    tp.displayExpressionObject = tp.object.getProp(tp.displayExpressionDataSet);
		    if (!tp.displayExpressionObject) 
			return app.toastWarning(this.getDictionaryItem("NEED_DATASET_FOR_DISPLAY_EXPR"));
		    this.displayExpressionRb.editor.setChecked(true);
		    this.binderSource.displayExpressionLayer.activate();
		    this.binderSource.updateBindSourceUi("displayExpression");
		}
	},
	_getTargetType: function(inTargetProps) {
	    var tp = inTargetProps;
	    var p = tp.targetProperty.split(".");
	    var l = p.pop();
	    var v = tp.object.getValue(p.join("."));
	    var ti;
	    try {
		ti = v && v.getDataTypeInfo(l);
	    } catch(e) {}
	    var type, isObject, isList;
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
    // a variant on 
    isAppLevel: function(inComponent) {
	var c = inComponent.getRoot();
	while(c.owner) {
	    c = c.owner;
	}
	while(c && c != studio.page && c != studio.application) {
	    var tmpc = c.getRoot();
	    c = (c == tmpc) ? c.parent : tmpc;
	}
	return c == studio.application;

    },
    getBindNodeSource: function(inNode) {
	if (inNode) {
	    var targetOwner = this.targetProps.object.getRoot();		
	    var ownerString = "";
	    if (inNode.object) {
		var nodeIsAppLevel = this.isAppLevel(inNode.object);
		var targetIsAppLevel = this.isAppLevel(this.targetProps.object);
		if (nodeIsAppLevel != targetIsAppLevel) {
		    if (nodeIsAppLevel)
			ownerString == "app.";
		    else
			ownerString = "[" + wm.decapitalize(studio.project.pageName) + "].";

		} else if (nodeIsAppLevel) {
		    //ownerString = "app.";
		}
	    }

	    var source = inNode.source;
	    var tmpPageContainer = "studioApplication.studio.bindSourceDialog.pageContainer.";
	    if (source.indexOf(tmpPageContainer) == 0) {
		source = source.substring(tmpPageContainer.length);
	    }
	    return ownerString + source;
	}
    },
	bindNodeSelected: function(inSender, inNode) {
	    if (inNode) {
		this.binderSource.bindEditor.setValue("dataValue",inNode.source ? this.getBindNodeSource(inNode) : "");
	    }
	},
	applyButtonClick: function() {
	    if (this.binderSource.applyBinding(this.targetProps)) {
		/* If the cancel button is NOT showing, then don't autoclose the dialog after applying a binding */
		if (this.cancelButton.showing) {
		    this.cancelButtonClick();
		}
	    } else {
		app.toastWarning(this.getDictionaryItem("TOAST_FAILED"));
	    }
	},
/*
	applyStayButtonClick: function() {
	    if (this.binderSource.applyBinding(this.targetProps)) {
		app.toastSuccess(this.getDictionaryItem("TOAST_SUCCESS"));
	    } else
		app.toastWarning(this.getDictionaryItem("TOAST_FAILED"));
	},
	*/
	clearButtonClick: function() {
	    this.binderSource.clearBinding();
	},
	cancelButtonClick: function() {
		wm.fire(this.owner.owner, "dismiss");
	}
});
