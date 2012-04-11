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
 
dojo.provide("wm.studio.pages.ServiceDialog.ServiceDialog");

dojo.declare("ServiceDialog", wm.Page, {
        i18n: true,
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
