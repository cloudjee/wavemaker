/*
 * Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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
 
RestServiceBuilder.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%"}, {}, {
		restBuilderToolbar: ["wm.Panel", {border: "0", height: "29px", layoutKind: "left-to-right", contentAlign: "center", padding: "2", horizontalAlign: "center"}, {}, {
			populateButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Populate From Sample Call", border: "0", margin: "0", hint: "Populate this dialog using a sample REST call", width: "200px"}, {onclick: "populateButtonClick"}]
		}],
		restPropsPanelSpacer: ["wm.Panel", {border: "0", height: "110px", padding: "4,10"}, {}, {
			restPropsLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, caption: "Web Service Properties", height: "18px", border: "0"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			restPropsPanel: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, border: "0", height: "100%", padding: "4,8"}, {}, {
				serviceNameInput: ["wm.Editor", {caption: "Service Name", captionSize: "120px", layoutKind: "left-to-right", height: "24px"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				panel1: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
					serviceOpInput: ["wm.Editor", {caption: "Operation Name", captionSize: "120px", width: "150%", layoutKind: "left-to-right"}, {}, {
						editor: ["wm._TextEditor", {}, {}]
					}],
					methodInput: ["wm.Editor", {caption: "Method", captionSize: "80px", width: "100%", layoutKind: "left-to-right"}, {}, {
						editor: ["wm._SelectEditor", {}, {}]
					}],
					contentTypeInput: ["wm.Editor", {caption: "Content Type", captionSize: "100px", width: "150%", layoutKind: "left-to-right"}, {}, {
						editor: ["wm._TextEditor", {}, {}]
					}]
				}],
				restURLPanel: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
					urlInput: ["wm.Editor", {caption: "Service URL", captionSize: "120px", width: "100%", layoutKind: "left-to-right"}, {}, {
						editor: ["wm._TextEditor", {}, {}]
					}],
					parameterizedButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Add Parameter to URL", border: "0", margin: "2", width: "200px"}, {onclick: "parameterizedButtonClick"}]
				}]
			}]
		}],
		restParamsPanelSpacer: ["wm.Panel", {border: "0", height: "150px", padding: "4,10"}, {}, {
			restParamsLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, caption: "Input Parameters", height: "18px", border: "0"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			restParamsPanel: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, border: "0", height: "100%", padding: "4,4,4,8"}, {}, {
				paramListPanel: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right"}, {}, {
					inParamsList: ["wm.List", {_classes: {domNode: ["wm_TextAlign_Center"]}, width: "100%", headerVisible: false, border: "0"}, {}],
					delBtnPanel: ["wm.Panel", {border: "0", width: "30px", padding: "0,0,0,4"}, {}, {
						removeInParamButton: ["wm.Button", {caption: "<img src='images/delete_24.png'/>", border: "0", margin: "0", height: "30px"}, {onclick: "removeInParamButtonClick"}]
					}]
				}],
				paramAddPanel: ["wm.Panel", {border: "0", height: "26px", layoutKind: "left-to-right"}, {}, {
					inParamNameInput: ["wm.Editor", {caption: "Name", captionSize: "60px", width: "100%", layoutKind: "left-to-right"}, {}, {
						editor: ["wm._TextEditor", {}, {}]
					}],
					inParamTypeInput: ["wm.Editor", {caption: "Type", captionSize: "60px", width: "100%", layoutKind: "left-to-right", display: "Select"}, {}, {
						editor: ["wm._SelectEditor", {}, {}]
					}],
					addInParamButton: ["wm.Button", {caption: "<img src='images/add_24.png'/>", border: "0", margin: "0", width: "26px"}, {onclick: "addInParamButtonClick"}]
				}]
			}]
		}],
		restOutputPanelSpacer: ["wm.Panel", {border: "0", height: "60px", padding: "4,10"}, {}, {
			restOutputLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, caption: "Service Output", height: "18px", border: "0"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			restOutputPanel: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, border: "0", height: "100%", padding: "4,8"}, {}, {
				panel10: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
					outTypeInput: ["wm.Editor", {caption: "Output Type", captionSize: "120px", width: "402px", layoutKind: "left-to-right", display: "Select"}, {}, {
						editor: ["wm._SelectEditor", {}, {}]
					}],
					outIsRawStringInput: ["wm.CheckBoxEditor", {caption: "Raw String", captionSize: "80px", width: "130px", layoutKind: "left-to-right"}, {onchange: "outIsRawStringInputChange"}, {
						editor: ["wm._CheckBoxEditor", {}, {}]
					}]
				}]
			}]
		}],
		restSchemaPanelSpacer: ["wm.Panel", {border: "0", height: "150px", padding: "4,10"}, {}, {
			restSchemaLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, caption: "XML Schema", height: "18px", border: "0"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			restSchemaPanel: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, border: "0", height: "100%", padding: "4,8"}, {}, {
				panel9: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
					xmlSchemaLabel: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Right"]}, caption: "XML Schema ", border: "0", width: "124px"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					schemaLabelSpacer: ["wm.Spacer", {width: "5px"}, {}],
					schemaFileRadioInput: ["wm.RadioButtonEditor", {width: "26px", layoutKind: "left-to-right", padding: "4"}, {onchange: "schemaFileRadioInputChange"}, {
						editor: ["wm._RadioButtonEditor", {radioGroup: "schemaInputType", startChecked: true}, {}]
					}],
					pathTypeInput: ["wm.Editor", {showing: false, captionSize: "0px", width: "90px", layoutKind: "left-to-right", margin: "0,0,0,2", display: "Select"}, {onchange: "pathTypeInputChange"}, {
						editor: ["wm._SelectEditor", {}, {}]
					}],
					xmlSchemaFileInput: ["wm.FileUpload", {uploadButton: false, operation: "getSchemaElementTypes", width: "260px", border: "0", layoutKind: "left-to-right"}, {}, {

					}],
					xmlSchemaUrlInput: ["wm.Editor", {caption: "URL or File Path", captionSize: "100px", width: "100%", layoutKind: "left-to-right", showing: false}, {}, {
						editor: ["wm._TextEditor", {}, {}]
					}],
					importXmlSchemaButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Refresh", border: "0", margin: "2", width: "100px"}, {onclick: "importXmlSchemaButtonClick"}]
				}],
				panel13: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right"}, {}, {
					panel14: ["wm.Panel", {border: "0", width: "133px"}, {}],
					schemaTextRadioInput: ["wm.RadioButtonEditor", {width: "24px", layoutKind: "left-to-right", padding: "", displayValue: "2"}, {onchange: "schemaFileRadioInputChange"}, {
						editor: ["wm._RadioButtonEditor", {radioGroup: "schemaInputType"}, {}]
					}],
					xmlSchemaTextInput: ["wm.TextAreaEditor", {width: "100%", layoutKind: "left-to-right"}, {}, {
						editor: ["wm._TextAreaEditor", {}, {}]
					}]
				}],
				panel11: ["wm.Panel", {showing: true, border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
					spacer8: ["wm.Spacer", {width: "100%"}, {}],
					xml2SchemaButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Sample XML Response -> XML Schema", border: "0", margin: "2", width: "250px"}, {onclick: "xml2SchemaButtonClick"}]
				}]
			}]
		}]
	}]
}