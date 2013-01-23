/*
 * Copyright (C) 2010-2013 VMware, Inc. All rights reserved.
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
 

ExportProjectPage.widgets = {
    variable: ["wm.Variable", {type: "EntryData", isList: true}],
    layoutBox1: ["wm.Layout", {_classes: {domNode: ["StudioDarkPanel"]}, layoutKind: "top-to-bottom", width: "100%", height: "100%"}, {onEnterKeyPress: "exportButton.click"}, {
        mainPanel: ["wm.studio.DialogMainPanel", {},{}, {
            zipNameEditor: ["wm.Text", {emptyValue: "emptyString", caption: "Zip file name", width: "100%", captionSize: "100px", captionAlign: "left", captionPosition: "left",
            _classes: {domNode: ["StudioEditor"]}}, {}],
            includeList: ["wm.CheckboxSet", {caption: "What do you want included in your project export?", 
                                            captionPosition: "top", captionAlign: "left", captionSize: "18px", 
                                            width: "100%", height: "100%", displayField: "name", dataField: "",
                                            _classes: {domNode: ["StudioEditor"]}}, {}, {
                binding: ["wm.Binding", {}, {}, {
                    wire: ["wm.Wire", {targetProperty: "dataSet", source: "variable"}]
                }]
            }],
            templateExportCheckbox: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]}, caption: "Export a project template?", 
                                                    captionPosition: "right", captionAlign: "left", captionSize: "100%", width: "100%",
                                                    helpText: "Users who import this project will have it show up in the New Project dialog instead of in their project list"}],
            templateExportPanel: ["wm.Panel", {layoutKind: "top-to-bottom", width: "100%", height: "100px", verticalAlign: "top", horizontalAlign: "left"}, {}, {
                binding: ["wm.Binding", {}, {}, {
                    wire: ["wm.Wire", {targetProperty: "showing", source: "templateExportCheckbox.checked"}]
                }],            
                templateName:  ["wm.Text", {_classes: {domNode: ["StudioEditor"]},caption: "Name", captionSize: "150px", captionPosition: "left", captionAlign: "left", width: "100%"}],
                templateGroup: ["wm.Text", {_classes: {domNode: ["StudioEditor"]},caption: "Template Tab Name", captionSize: "150px", captionPosition: "left", 
captionAlign: "left",width: "100%", dataValue: "Samples"}],
                themeSelect:   ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, caption: "Optional Theme:", captionSize: "150px", captionPosition: "left", 
captionAlign: "left", allowNone: true, width: "100%", displayField: "name", dataField: "dataValue", helpText: "This forces the user to start with this theme; leave blank if user should pick their own theme"}, {}, {
    			    binding: ["wm.Binding", {}, {}, {
    			        wire: ["wm.Wire", {"targetProperty":"dataSet","source":"studio.themesListVar"}, {}]
    			    }]
    			}],
                templateThumbnail: ["wm.Text", {_classes: {domNode: ["StudioEditor"]},caption: "Thumbnail", captionPosition: "left", 
                                                helpText: "This icon is shown for your template in New Project Dialog.  Path is relative to project root, so if the image is in your resources folder, enter 'webapproot/resources/images/myimage.png'.", 
                                                captionSize: "150px", captionAlign: "left", width: "100%", placeHolder: "webapproot/resources/images/sample.png"}]
            }]
    	}],
            footer: ["wm.studio.DialogButtonPanel", {}, {}, {            
    		  cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel", width: "160px"}, {onclick: "cancelClick"}],
    		  exportButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Export", width: "160px"}, {onclick: "exportClick"}, {}, {
    		      binding: ["wm.Binding", {}, {}, {
                    wire: ["wm.Wire", {targetProperty: "disabled", expression: "!${zipNameEditor.dataValue}"}]
                }]
    		  }]    		  
    	    }]
    	
    }]
}
