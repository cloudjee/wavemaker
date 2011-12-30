/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Editors.Base");
dojo.require("wm.base.widget.Editors.dijit");


// check if a property is not undefined or not same as in the object prototype
wm.propertyIsChanged = function(inValue, inProp, inCtor) {
	var p = (inCtor||0).prototype;
	return p && p[inProp] !== inValue;
}

wm.defaultEmptyValue = function(inType){
	switch(inType){
		case 'Text': return '';
		case 'Number': return 0;
		
	}
}


wm.createFieldEditor = function(inParent, inFieldInfo, inProps, inEvents, inClass) {
	var props = dojo.mixin({}, wm.getFieldEditorProps(inFieldInfo), inProps);
	var name = wm.getValidJsName(props.name || "editor1");
	return inParent.owner.loadComponent(name, inParent, inClass ||"wm._TextEditor1", props, inEvents);
};



//===========================================================================
// Base Editor
//===========================================================================
dojo.declare("wm._BaseEditor", wm.Widget, {
        classNames: "wmeditor",
	width: "100%",
	height: "100%",
	editorBorder: true,
	border: 0,
	changeOnKey: false,
	changeOnEnter: false,
	required: false,
	showMessages: true,
	init: function() {
		this._editorConnects = [];
		// FIXME: set owner to parent. Owner is forced to page if we've been streamed.
		this.name = "editor";
		this.setOwner(this.parent);
		// owner defined properties
		this.singleLine = this.owner.singleLine;
		this.readonly = this.owner.readonly;
		//this.required = this.owner.required;
		this.disabled = this.owner.disabled;
		//
		this.inherited(arguments);
	},
	postInit: function() {
		this.createEditor();
		this.inherited(arguments);
	},
	destroy: function() {
		this.destroyEditor();
		this.inherited(arguments);
	},
	createEditor: function(inProps) {
		this.destroyEditor();
		var n = document.createElement('div');
		this.domNode.appendChild(n);
	    this.startTimerWithName("CreateDijit", this.declaredClass);
		this.editor = this._createEditor(n, inProps);
	    this.stopTimerWithName("CreateDijit", this.declaredClass);
		if (this.editor) {
			this.styleEditor();
			if (this.validationEnabled())
			    this.validatorNode = this._getValidatorNode();
			this.sizeEditor();
			this.connectEditor();
			this.setRequired(this.required);
			this.setInitialValue();
/*
                    if (this.editor._onChangeHandle) {
                        window.clearTimeout(this.editor._onChangeHandle);
                        this.editor._onChangeHandle = null;
                    }          
		    */
			this.setReadonly(this.readonly);
		}
		this.editor.owner = this;
		if (this.editor.displayMessage) {
			this.editor.displayMessage = function(message) {
				if (!this.owner.showMessages)
					return;
				var o = dojo.getObject(this.declaredClass);
				if (o)
					o.prototype.displayMessage.apply(this, arguments);
			}
		}
		return this.editor;
	},
	validationEnabled: function() {
		if (this.isLoading())
			return false;
		else
			return true;
	},
	_createEditor: function(inNode, inProps) {
		return new dijit.form.TextBox(this.getEditorProps(inNode, inProps));
	},
	destroyEditor: function() {
		this.disconnectEditor();
		wm.fire(this.editor, "destroy");
		this.editor = null;
	},
	styleEditor: function() {
	},
	sizeEditor: function() {
		if (this._cupdating)
			return;
		var e = this.editor;
		if (e) {
			var
				bounds = this.getContentBounds(),
				// note, subtract 2 from bounds for dijit editor border/margin
				height = bounds.h ? bounds.h - 2 + "px" : "",
				width = bounds.w ? bounds.w - 4 : "",
				d = e && e.domNode,
				s = d.style,
				fc = d && d.firstChild;

                    if (this._editorPaddingLeft) width -= this._editorPaddingLeft;
                    if (this._editorPaddingRight) width -= this._editorPaddingRight;
                    if (width) width += "px";

			if (!this.editorBorder) s.border = 0;
		        s.backgroundColor = this.editorBorder ? "" : "transparent";
			s.backgroundImage = this.editorBorder ? "" : "none";
			s.width = width;
			if (height) {
				if (fc) {
					dojo.forEach(fc.childNodes, function(c) {
						if (c.style)
						{
							c.style.height = height;
						}
					});
				}
				if (e.focusNode && e.focusNode.style)
					e.focusNode.style.height = height;

			}
		}
	},
	renderBounds: function() {
		this.inherited(arguments);
		this.sizeEditor();
	},
	setEditorBorder: function(inEditorBorder) {
		this.editorBorder = inEditorBorder;
		this.render();
	},
	addEditorConnect: function(inConnect) {
		this._editorConnects.push(dojo.connect.apply(dojo, arguments));
	},
	connectEditor: function() {
		this.disconnectEditor();
		this.addEditorConnect(this.editor, "onChange", this, "changed");
		this.addEditorConnect(this.editor, "onBlur", this, "blurred");
		this.addEditorConnect(this.editor, "_onFocus", this, "focused");
		this.addEditorConnect(this.editor.domNode, "onkeypress", this, "keypressed");
		this.addEditorConnect(this.editor.domNode, "onkeypress", this, "dokeypress");
		if (this.validationEnabled())
		  this.addEditorConnect(this.editor, "validate", this, "editorValidated");
	},
	disconnectEditor: function() {
		dojo.forEach(this._editorConnects, dojo.disconnect);
		this._editorConnects = [];
	},
	invalidate: function() {
		delete this._isValid;
	},
	keypressed: function(){
		this.validate();
	},
	blurred: function() {
		this.validate();
		this.owner.doOnblur();
	},
	doOnblur: function() {
		if (!this.disabled)
			this.onblur();
	},

	focused: function() {
		this.owner.doOnfocus();
	},
	changed: function() {
		this.validate();
		this.owner.doOnchange();
	},
	_getValidatorNode: function() {
		var n = this.editor && this.editor.domNode.firstChild;
		if (!n)
		{
			return null;
		}
		for (var i=0, c, children=n.childNodes; c=children[i]; i++)
			if (dojo.hasClass(c, "dijitValidationIcon"))
				return c;
	},
	editorValidated: function() {
		if (this.validatorNode)
			this.validatorNode.style.display = this.editor.state == "Error" ? "" : "none";
	},
	validate: function() {
            if (this.validationEnabled()) 
		this.invalidate();

            // just because the editor doesn't have validation doesn't mean that the container won't need to validate the sum of all inputs
	    wm.job(this.getRuntimeId(), 25, dojo.hitch(this, function() {
		wm.fire(this.owner, "validate");
	    }));
	},
	getEditorProps: function(inNode, inProps) {
		return dojo.mixin({srcNodeRef: inNode, owner: this, disabled: this.owner.disabled}, inProps || {});
	},

	getInvalid: function() {
	        if (!this.validationEnabled()) return false;
		if (this.editor && this.editor.isValid) {
			if (this._isValid === undefined)
				this._isValid = this.editor.isValid();
			return !(this.readonly || this._isValid);
		}
	},
	_getReadonlyValue: function() {
		return this.getDisplayValue() || "";
	},
	setReadonly: function(inReadonly) {
		this.readonly = inReadonly;
		var dn = this.domNode, pn = this.editor.domNode.parentNode;
		if (this.readonly) {
			if (pn == dn) {
				dn.removeChild(this.editor.domNode);
			}
			wm.fire(this.editor,"_hideTooltip");
		} else {
			if (pn != dn) {
				dn.innerHTML = "";
				dn.appendChild(this.editor.domNode);
				this.owner.reflow();
			}
		}
		this.updateReadonlyValue();
	},
	updateReadonlyValue: function() {
		if (this.readonly && (!this.editor.domNode.parentNode || !this.editor.domNode.parentNode.id))
			if (wm._CheckBoxEditor && this instanceof wm._CheckBoxEditor)
			{
				this.setReadonlyValue();
			}
			else
			{
				this.domNode.innerHTML = this._getReadonlyValue();
			}
	},
 	getDisplayValue: function() {
		return this.editor && this.editor.declaredClass && this.editor.get && this.editor.get('displayedValue') ? this.editor.get('displayedValue') || "" : this.getEditorValue() || "";
	},
	makeEmptyValue: function() {
		switch (this.owner.emptyValue) {
			case "null": return null;
			case "false": return false;
			case "emptyString": return "";
			case "zero": return 0;
		}
	},
	getEditorValue: function() {
		var v;
		if (this.editor && this.editor.get)
			v = this.editor.get('value');
		return (v || v === 0) ? v : this.makeEmptyValue();
	},
	setEditorValue: function(inValue) {
		if (this.editor && this.editor.set) {
			inValue = inValue === undefined ? null : inValue;
		    var oldVal = this.editor.get('value');
		    this.editor.set('value',inValue, false);
		    if (oldVal != inValue)
			this.changed();
		    this.updateReadonlyValue();
		}
	},
	setDisplayValue: function(inValue) {
		this.setEditorValue(inValue);
	},
	setRequired: function(inValue) {
	        var oldValue = this.required;
		this.required = inValue;
		if (this.editor) {
			this.editor.required = inValue;
			if (this.required || oldValue) {
			  this.validate();
			  wm.fire(this.owner, "requireChanged");
			}
		}
	},
	setInitialValue: function() {
		var o = this.owner;
		o.beginEditUpdate();
		this.setEditorValue(wm.propertyIsChanged(o.dataValue, "dataValue", wm.Editor) ? o.dataValue : o.displayValue);
		o.endEditUpdate();
	},
	setDisabled: function(inDisabled) {
		this.disabled = inDisabled;
		if (this.editor && this.editor.set)
			this.editor.set("disabled", inDisabled);
	},
	// used to determine if the editor is ready to send and receive values
	isReady: function() {
		return Boolean(this.editor);
	},
	focus: function() {
		wm.fire(this.editor, "focus");
	},
	reset: function() {
		var e = this.editor;
		if (e) {
			e._hasBeenBlurred = false;
			wm.fire(e,"_hideTooltip");
		}
	},
	clear: function() {
		this.reset();
		this.setEditorValue(null);
	},
	// design time
	listOwnerProperties: function() {
		var p = dojo.mixin({}, wm.Component.prototype.listProperties.apply(this) || {});
		// include properties intended for editor's owner
		for (var i in p) {
			if (!p[i].isOwnerProperty)
				delete p[i];
		}
		return p;
	},
	listProperties: function() {
		var p = dojo.mixin({}, this.inherited(arguments) || {});
		// exclude properties intended for editor's owner
		// This will exclude owner props from serialization by default.
		// If these properties are *not* serialized in the owner and should be serialized
		// then override isWriteableProp and serialize here.
		for (var i in p) {
			if (p[i].isOwnerProperty)
				delete p[i];
		}
		return p;
	},
	valueChanged: function(inProp, inValue) {
		if (this._updating)
			return;
		this.inherited(arguments);
		//if (this.isDesignLoaded() && inProp)
		//	this.createEditor();
	},
    
    // Taken from wm.Editor; synonym for BaseEditor makeEmptyValue.
	setValueAsEmpty: function(){
	    this.makeEmptyValue();
	},	
	isLoading: function() {
		return this.owner._loading;
	},
	dokeypress: function(inEvent) {
		if (this.changeOnKey || (this.changeOnEnter && inEvent.keyCode == dojo.keys.ENTER))
			wm.onidle(this, "doChangeOnKey", arguments);
	        if (inEvent.keyCode == dojo.keys.ENTER)
	            wm.onidle(this, "onEnterKeyPress", [this]);
	},
	doChangeOnKey: function(inEvent) {
		var e = this.editor;
		//e.setValue(e.getValue());
	        //e.set("value",e.get("value"));
	        this.changed();
	},
        onEnterKeyPress: function() {}
});


// design only...
wm.Object.extendSchema(wm._BaseEditor, {
    onEnterKeyPress: {ignore:1},
	name: { ignore: 1 },
	showing: { ignore: 1 },
	disabled: { ignore: 1},
	singleLine: {ignore: 1},
	readonly: {ignore: 1},
	border: {ignore: 1},
	borderColor: {ignore: 1},
	margin: {ignore: 1},
	padding: {ignore: 1},
	scrollX: {ignore: 1},
	scrollY: {ignore: 1}
});

