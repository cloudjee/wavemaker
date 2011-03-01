/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.studio.pages.ServiceDialog.ServiceDialog");

dojo.declare("ServiceDialog", wm.Page, {
	start: function() {
		this.update();
	},
	update: function() {
		this.nameInput.setInputValue(this.binding.name);
		this.updateServicesSelect();
		this.updateOperationSelect();
	},
	updateBinding: function() {
		this.pageContainer.page.binding = this.binding.input.components.binding;
		this.pageContainer.page.bindingRoot = this.binding;
		this.pageContainer.page.update();
	},
	updateServicesSelect: function() {
		var d = this.binding.getServicesList();
		this.servicesSelect._setOptionData(d);
		this.servicesSelect.setInputValue(this.binding.service);
	},
	updateOperationSelect: function() {
		var 
			s = this.binding._service,
			o = this.binding.operation,
			valueOk = s && s.getOperation(o),
			methods = s && s.getOperationsList();
		if (!valueOk){
			o = methods ? methods[0] : "";
			if (o)
				this.binding.setOperation(o);
		}
		this.operationSelect._setOptionData(methods);
		this.operationSelect.setInputValue(o);
		this.updateHint();
		this.updateBinding();
		
	},
	updateHint: function() {
		var hint = this.binding.getOperationHint();
		this.hintLabel.setCaption(hint ? "Hint: " + hint : "");
	},
	nameInputBlur: function(inSender) {
		this.binding.set_name(inSender.getInputValue());
		this.nameInput.setInputValue(this.binding.name);
	},
	servicesSelectChange: function(inSender) {
		this.binding.setService(inSender.getInputValue());
		this.updateOperationSelect();
		this.binding.doClearInput();
		this.updateBinding();
	},
	operationSelectChange: function(inSender) {
		this.binding.setOperation(inSender.getInputValue());
		this.binding.doClearInput();
		this.updateHint();
		this.updateBinding();
	},
	closeButtonClick: function(inSender) {
		// make studio inspect again...
		inspect(this.binding);
		wm.fire(this.owner, "dismiss");
	},
	_end: 0
});
