/*
 * Copyright (C) 2010-2012 VMware, Inc. All rights reserved.
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
 

NewLiveFormDialog.widgets = {
    behaviorsVar: ["wm.Variable", {type: "EntryData", isList: true, json: "[{name: 'Standard', dataValue: 'standard'}, {name: 'Insert Only', dataValue: 'insertOnly'},{name: 'Update Only', dataValue: 'updateOnly'}]"}],
    readonlyManagerVar: ["wm.Variable", {type: "EntryData", isList: true, json: "[{name: 'Readonly Manager', dataValue: true}, {name: 'Always Editable', dataValue: false}]"}],
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%"}, {}, {
        mainPanel: ["wm.Panel", {_classes: {domNode: ["dialogcontainer"]},layoutKind: "top-to-bottom", width: "100%", height: "100%", horizontalAlign: "left", verticalAlign: "top", padding: "15", border: "10", borderColor: "#313743", backgroundColor: "#848c99"},{}, {
	    typeSelect: ["wm.prop.DataTypeSelect", {liveTypes: true, width: "100%", captionSize: "130px", captionAlign: "left",caption: "Type", helpText: "The type of database object to edit with this form"}, {}, {
		binding: ["wm.Binding", {},{},{
		    wire: ["wm.Wire", {source: "typesVar", targetProperty: "dataSet"}]
		}]
	    }],
	    formBehavior: ["wm.RadioSet", {editorBorder: 0, width: "100%", captionSize: "130px", captionAlign: "left", dataValue: "standard", dataField: "dataValue", displayField: "name", height: "70px",caption: "Form Behavior", helpText: "<ul><li><b>Standard</b>: Sets up your form as full CRUD form with insert, update and delete; this is the standard form</li><li><b>insertOnly</b>: Sets up your form to only do inserts.  NOTE: insertOnly form with no readonly manager will immediately clear the form and prepare for another insert onSuccess. Examples: Registration pages typically only do an insert; forum pages typically only do an insert;</li><li><b>updateOnly</b>: Sets up your form to only do updates.  Examples: A page to edit account information should never do inserts; forms for reviewing other peoples entries should never do inserts</li></ul>"}, {}, {
		binding: ["wm.Binding", {},{},{
		    wire: ["wm.Wire", {source: "behaviorsVar", targetProperty: "dataSet"}]
		}]
	    }],
	    readonlyManager: ["wm.RadioSet", {editorBorder: 0, width: "100%", captionSize: "130px", captionAlign: "left",  dataValue: true, dataField: "dataValue", displayField: "name", height: "50px",caption: "Readonly Manager", helpText: "<ul><li><b>Readonly Manager</b>: Your form is uneditable until the user clicks the New or Edit buttons</li><li><b>Always Editable</b>: Your form is always editable and ready to do an insert or update operation.  Note that you can still programatically call setReadonly(true/false)</li></ul>"}, {}, {
		binding: ["wm.Binding", {},{},{
		    wire: ["wm.Wire", {source: "readonlyManagerVar", targetProperty: "dataSet"}]
		}]
	    }],
	    dataSetSelect: ["wm.prop.DataSetSelect", {width: "100%", captionSize: "130px", captionAlign: "left", caption: "dataSet", helpText: "Your form only needs a dataSet if you want to use it to edit existing entries; the dataSet provides an entry to edit", widgetDataSets: true, listMatch: undefined, noForms: true, allowAllTypes: false, liveServiceOnly: true, widgetDataSets: true}, {onchange: "dataSetSelectChange"}, {
		binding: ["wm.Binding", {},{},{
		    wire: ["wm.Wire", {expression: "${formBehavior.dataValue} == 'insertOnly'", targetProperty: "disabled"}]
		}]
	    }]
        }],
            buttonPanel: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, width: "100%", height: "35px", layoutKind: "left-to-right", horizontalAlign: "right", verticalAlign: "top"},{}, {
                CancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel", width: "100px", height: "100%"}, {onclick: "onCancelClick"}],
                OKButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK", width: "100px", height: "100%"}, {onclick: "onOkClick"}]
        }]
}]
}
