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


dojo.provide("wm.base.widget.Editors.dijit");

// the requires below are not removed or made dojo['require'] because their class methods are changed and should be done initially.
dojo.require("dijit.form.ValidationTextBox");


// dojo customization: remove tooltip if destroyed
dijit.form._FormWidget.prototype.destroy = function() {
	try {
		wm.fire(this, "_hideTooltip");
		if(this._onChangeHandle){ // destroy called before last onChange has fired
			clearTimeout(this._onChangeHandle);
		}
		dijit._Widget.prototype.destroy.call(this);
	}
	catch(e){
		// do nothing.
		//console.info('error = ', t);
	}
}

// dojo customization: dijit hack to display invalid error only when box is blurred and show valid when focused.
dijit.form.ValidationTextBox.prototype.validate = function(isFocused){
	var message = "";
	var isValid = this.isValid(isFocused);
	var isEmpty = this._isEmpty(this.textbox.value);
	// CHANGE: state ok if is focused
	this.state = (isFocused || isValid || (!this._hasBeenBlurred && isEmpty)) ? "" : "Error";
	this._setStateClass();
	//this.domNode.firstChild.firstChild.style.display = this.state == "Error" ? "" : "none";
	if (isValid)
	dijit.setWaiState(this.focusNode, "invalid", isValid ? "false" : "true");
	// CHANGE: show prompt message if we're empty and focused
	if(isFocused && isEmpty){
		message = this.getPromptMessage(true);
	}
	// CHANGE: if not focused and in error state, show error message
	if(!isFocused && this._hasBeenBlurred){
		if(!message && this.state == "Error"){
			message = this.getErrorMessage(true);
		}
	}
	this.displayMessage(message);
	// CHANGE: return valid if focused or valid
	return isFocused || isValid;
}



// expose validation process to "owner" (this is a wm concept)
dijit.form.ValidationTextBox.prototype._defaultValidator = dijit.form.ValidationTextBox.prototype.validator;
dijit.form.ValidationTextBox.prototype.validator = function(value, constraints) {
	var
		validator = dijit.form.ValidationTextBox.prototype._defaultValidator,
		valid = validator.call(this, value, constraints);
	return valid && (this.owner && this.owner.validator ? this.owner.validator(value, constraints) : true);
}

// dojo customization: hide tooltip after a delay

dijit.form.ValidationTextBox.prototype.displayMessage = function(message){
	if(this._message == message){ return; }
	this._message = message;
	this._cancelHideTooltip();
	dijit.hideTooltip(this.domNode);
    if(message && (!this.owner || !this.owner.readonly)){
		dijit.showTooltip(message, this.domNode, this.tooltipPosition);
		dijit._hideTooltipHandle = setTimeout(dojo.hitch(this, function() {
			wm.fire(this, "_hideTooltip");
		}), this.tooltipDisplayTime);
	}
}

// dojo customization: hide tooltip

dijit.form.ValidationTextBox.prototype._hideTooltip = function() {
	this._cancelHideTooltip();
	wm.hideToolTip();
}
dijit.form.ValidationTextBox.prototype._cancelHideTooltip = function() {
	clearTimeout(dijit._hideTooltipHandle);
	dijit._hideTooltipHandle = null;
}

