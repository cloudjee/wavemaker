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
 

ImportFile.widgets = {
    ImportFileTypeDef: ["wm.TypeDefinition", {"internal": 1}, {}, {
        typefield1: ["wm.TypeDefinitionField", {fieldName: "name", fieldType: "string"}],
        typefield2: ["wm.TypeDefinitionField", {fieldName: "type", fieldType: "string"}],
        typefield3: ["wm.TypeDefinitionField", {fieldName: "exists", fieldType: "string"}],
        typefield4: ["wm.TypeDefinitionField", {fieldName: "dataValue", fieldType: "string"}],
        typefield5: ["wm.TypeDefinitionField", {fieldName: "moduleName", fieldType: "string"}]        
    }],
    variable: ["wm.Variable", {type: "ImportFileTypeDef", isList: true}],
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%", _classes: {domNode: ["StudioDarkPanel"]}}, {}, {    
        layers: ["wm.Layers", {width: "100%", height: "100%"},{}, {
            introLayer: ["wm.Layer", {}, {}, {
                mainPanel1: ["wm.studio.DialogMainPanel", {},{}, {
                    instructionLabel: ["wm.Html", {width: "100%", height: "100%", html: "<div class='InstructionHeader'>Use this dialog to import</div><ul><li>Projects</li><li>Project Templates</li><li>Themes</li><li>Custom Components</li></ul>"}]
                }],
                footer1: ["wm.studio.DialogButtonPanel", {}, {}, {            				 
                    cancelButton2: ["wm.Button", {caption: "Cancel", width: "100px", _classes: {domNode: ["StudioButton"]}}, {onclick: "owner.owner.hide"}],
    				 fileUploader: ["wm.DojoFileUpload", {  width: "100px",
    									height: "32px",
    									margin: "0",
    									border: "0",
    									width: "150px",
    									borderColor: "#323332",
    									useList: false,
    									buttonCaption: "Select Zipfile",
    									service: "deploymentService",
    									operation: "uploadProjectZipFile"},
    						{onChange: "onChange", onSuccess: "onSuccess", onError: "onError"}]
        		}]    	
        	}],
            confirmLayer: ["wm.Layer", {}, {}, {
                mainPanel2: ["wm.studio.DialogMainPanel", {padding: "0"},{}, {            
                    radioPanel: ["wm.Panel", {height: "112px",  margin: "10", width: "100%", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left"}, {}, {                        
                        radioRename: ["wm.RadioButton", {_classes: {domNode: ["StudioEditor"]},radioGroup: "ImportProjectOverwrite", width: "100%", caption: "-", captionSize: "100%", captionPosition: "right", captionAlign: "left"}],                        
                        renameEditorPanel: ["wm.Panel", {height: "24px", width: "100%", margin: "0,0,0,30",horizontalAlign: "left", verticalAlign: "top", layoutKind: "left-to-right"}, {}, {
                            renameEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]},caption: "", width: "200px", changeOnKey:true}, {onchange: "updateProjectTakenLabel"}, {
                                binding: ["wm.Binding", {}, {}, {
                                    wire: ["wm.Wire", {targetProperty: "disabled", expression: "!${radioRename.checked}"}]                        
                                }]    
                            }],                        
                            projectTakenLabel: ["wm.Label", {caption: "Project name already taken", _classes: {domNode: ["ProjectNameTaken"]}, width: "100%", showing: false}]
                        }],
                        radioOverwrite: ["wm.RadioButton", {_classes: {domNode: ["StudioEditor"]},radioGroup: "ImportProjectOverwrite", width:"100%",caption: "-", captionSize: "100%", captionPosition: "right", captionAlign: "left"}],                                                
                        radioNoImport: ["wm.RadioButton", {_classes: {domNode: ["StudioEditor"]},radioGroup: "ImportProjectOverwrite", width:"100%",caption: "Do not import project", captionSize: "100%", captionPosition: "right", captionAlign: "left"}]
                    }],       

                    bevel1: ["wm.Bevel", {}],
                    checkboxSet: ["wm.CheckboxSet", {_classes: {domNode: ["StudioEditor"]},
                                                    width: "100%", height: "100%", margin: "10",
                                                    caption: "The zip file contained the following; pick which ones you want to import",
                                                    singleLine: false,
                                                    captionPosition: "top", captionAlign: "left", captionSize: "20px", 
                                                    dataField: "dataValue",
                                                    editorBorder: false,
                                                    displayExpression: "(${newName} ? 'Rename imported project from ' + ${name} + ' to ' + ${newName} : (${exists} ? 'Overwrite ' : 'Import ') + wm.capitalize(${dataValue}) + ': ' + ${name})"}, {}, {
                        binding: ["wm.Binding", {}, {}, {
                            wire: ["wm.Wire", {targetProperty: "dataSet", source: "variable"}]                        
                        }]                    
                    }]

                }],
                footer2: ["wm.studio.DialogButtonPanel", {}, {}, {
                    cancelButton1: ["wm.Button", {caption: "Cancel", width: "100px", _classes: {domNode: ["StudioButton"]}}, {onclick: "owner.owner.hide"}],
                    okButton2: ["wm.Button", {caption: "OK", width: "100px", _classes: {domNode: ["StudioButton"]}}, {onclick: "finishImport"}]
                }]
            }]
        }]
    }]
}
