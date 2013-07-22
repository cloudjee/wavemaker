/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
 

dojo.declare("NewLiveFormDialog", wm.Page, {
    i18n: true,
    form: null,
    start: function() {
    },
    setForm: function(inForm) {
	this.form = inForm;
	this.root.clearData();
	this.typeSelect.refreshOptions();
	this.dataSetSelect.refreshOptions();
	this.formBehavior.setDataValue("standard");
	this.readonlyManager.setDataValue(true);
    },
    onCancelClick: function() {
        this.owner.owner.dismiss();
	this.form.destroy();
    },
    dataSetSelectChange: function(inSender, inDataValue, inDisplayValue) {
	var c = studio.page.getValueById(inDataValue);
	if (c && c.type) {
	    this.typeSelect.setDataValue(c.type);
	}
    },
    onOkClick: function(selectedName) {
	this.form.setName(studio.page.getUniqueName(wm.decapitalize(this.typeSelect.getDisplayValue().replace(/^.*\./,"")) + "DBForm"));
	this.form.set_formBehavior(this.formBehavior.getDataValue());
	if (this.typeSelect.getDataValue())
	    this.form.set_type(this.typeSelect.getDataValue());

	this.form.set_readonlyManager(this.readonlyManager.getDataValue());
	if (this.form.formBehavior != "insertOnly" && this.dataSetSelect.getDataValue()) {
	    this.form.$.binding.addWire(null, "dataSet", this.dataSetSelect.getDataValue(), "");
	}
	this.form.eventBindings.onEnterKeyPress = this.form.getId() + ".saveData";
        this.owner.owner.dismiss();
	studio.reinspect(true);
    },

  _end: 0
});
