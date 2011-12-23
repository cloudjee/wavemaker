/*
 * Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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
 
ImportWebService.widgets = {
    layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", autoScroll: false}, {}, {
		dialog: ["wm.Panel", {height: "100%", border: "0", width: "100%"}, {}, {
			panel: ["wm.Panel", {height: "100%", border: "0"}, {}, {
				typePanel: ["wm.Panel", {height: "30px", border: "0", padding: "4,0,4,0"}, {}, {
					panel4: ["wm.Panel", {height: "24px", border: "0", layoutKind: "left-to-right", contentAlign: "center", horizontalAlign: "center"}, {}, {
						typeInput: ["wm.Editor", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "240px", width: "470px", layoutKind: "left-to-right", caption: "Select the type of web service to import:", display: "Select"}, {onchange: "typeInputChange"}, {
							editor: ["wm._SelectEditor", {}, {}]
						}]
					}]
				}],
				layersSpacerPanel: ["wm.Panel", {_classes: {domNode: ["wm_Padding_8px"]}, height: "100%", border: "0"}, {}, {
					layers: ["wm.Layers", {border: "0", width: "100%", height: "100%"}, {}, {
					    wsdlLayer: ["wm.Layer", {caption: "layer1", padding: "10"}, {}, {
							wsdlGroupLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, caption: "WSDL Information", border: "0", height: "24px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							//panel1: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, height: "140px", border: "0", layoutKind: "left-to-right", contentAlign: "center", horizontalAlign: "center"}, {}, { //xxx
							panel1: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, height: "160px", border: "0", layoutKind: "left-to-right", contentAlign: "center", horizontalAlign: "center"}, {}, {
								panel2: ["wm.Panel", {border: "0", padding: "4", width: "606px"}, {}, {
									panel5: ["wm.Panel", {height: "24px", border: "0", layoutKind: "left-to-right"}, {}, {
										wsdlPathTypeInput: ["wm.Editor", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "100px", width: "200px", layoutKind: "left-to-right", caption: "WSDL Path", display: "Select"}, {onchange: "wsdlPathTypeInputChange"}, {
											editor: ["wm._SelectEditor", {}, {}]
										}],
										wsdlFileInput: ["wm.FileUpload", {uploadButton: false, operation: "uploadWSDL", width: "350px", showing: false, layoutKind: "left-to-right", border: "0"}, {}, {

										}],
										wsdlUrlInput: ["wm.Editor", {captionSize: "0px", width: "100%", layoutKind: "left-to-right"}, {}, {
											editor: ["wm._TextEditor", {}, {}]
										}]
									}],
									spacer1: ["wm.Spacer", {height: "14px"}, {}],
									//panel3: ["wm.Panel", {height: "78px", border: "0", layoutKind: "left-to-right"}, {}, {
									panel3: ["wm.Panel", {height: "110px", border: "0", layoutKind: "left-to-right"}, {}, { //xxx
										panel6: ["wm.Panel", {border: "0", width: "112px"}, {}, {
											label2: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Right", "wm_Padding_LeftNone", "wm_Padding_BottomNone", "wm_Padding_6px", "wm_FontColor_White"]}, caption: "Service Name", border: "0", height: "26px"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}]
										}],
										panel8: ["wm.Panel", {border: "0", width: "100%"}, {}, {
											panel9: ["wm.Panel", {height: "24px", border: "0", layoutKind: "left-to-right"}, {}, {
												serviceIdAutoYesRadio: ["wm.RadioButtonEditor", {width: "30px", layoutKind: "left-to-right", padding: "5"}, {onchange: "serviceIdAutoYesRadioChange"}, {
													editor: ["wm._RadioButtonEditor", {radioGroup: "serviceIdAutoGroup", dataType: "number", startChecked: true}, {}]
												}],
												label1: ["wm.Label", {_classes: {domNode: ["wm_FontColor_White"]}, caption: "Auto-generate", border: "0", width: "100%"}, {}, {
													format: ["wm.DataFormatter", {}, {}]
												}]
											}],
											panel10: ["wm.Panel", {height: "24px", border: "0", layoutKind: "left-to-right"}, {}, {
												serviceIdAutoNoRadio: ["wm.RadioButtonEditor", {width: "30px", layoutKind: "left-to-right", padding: "5"}, {}, {
													editor: ["wm._RadioButtonEditor", {radioGroup: "serviceIdAutoGroup", dataType: "number"}, {}]
												}],
												serviceIdInput: ["wm.Editor", {captionSize: "0px", width: "100%", layoutKind: "left-to-right"}, {}, {
													editor: ["wm._TextEditor", {}, {}]
												}]
											}],
											spacer2: ["wm.Spacer", {height: "14px"}, {}],
											panel6a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right", width: "100%",horizontalAlign: "center"}, {}, {
												usernameLabel: ["wm.Label", {width: "120px", border: "0", caption: "Username"}, {}, {
													format: ["wm.DataFormatter", {}, {}]
												}],
												usernameInput: ["wm.Input", {displayValue:"", checked: true, width: "300px", border: "0"}, {onkeypress: "onUsernameKeyPress", onchange: "usernameChanged", onenterkey: "importBtnClick"}]
											}],
											panel603a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right", width: "100%",horizontalAlign: "center"}, {}, {
												passwordLabel: ["wm.Label", {width: "120px", border: "0", caption: "Password"}, {}, {
													format: ["wm.DataFormatter", {}, {}]
												}],
												passwordInput: ["wm.Input", {displayValue:"", checked: true, width: "300px", border: "0", inputType: "password"}, {onenterkey: "importBtnClick"}]
											}]
										}]
									}]
								}]
							}]
						}],
					    restBuilderLayer: ["wm.Layer", {caption: "layer2"}, {}, {
							restServiceBuilderPage: ["wm.PageContainer", {pageName: "RestServiceBuilder", height: "100%", border: "0"}, {}]
						}],
					    feedLayer: ["wm.Layer", {caption: "layer1", padding: "10"}, {}, {
							feedGroupLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, caption: "Feed Service Information", border: "0", height: "24px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							feedMsgPanel: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, height: "140px", border: "0", contentAlign: "center", padding: "4"}, {}, {
								wsdlMsgSpacer: ["wm.Spacer", {height: "50px"}, {}],
								wsdlGroupLabel1: ["wm.Label", {caption: "Selecting Import below will add the generic Feed Service to your application. To use this service, add a ServiceVariable to your page, and configure it to use this service, supplying the URL for your service in the feedURL property of the getFeed operation.", border: "0", height: "100%", singleLine: false}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}]
							}]
						}],
					    restUrlLayer: ["wm.Layer", {caption: "layer1", padding: "10"}, {}, {
							restUrlPage: ["wm.PageContainer", {pageName: "RestUrlDialog", height: "100%", border: "0"}, {}]
						}]
					}]
				}]
			}],
			footer: ["wm.Panel", {height: "30px", border: "0", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
				importButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},width: "96px", caption: "Import", margin: "4"}, {onclick: "importButtonClick"}],
				spacer6: ["wm.Spacer", {width: "10px"}, {}],
				cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},width: "96px", caption: "Cancel", margin: "4"}, {onclick: "cancelButtonClick"}]
			}]
		}]
	}]
}