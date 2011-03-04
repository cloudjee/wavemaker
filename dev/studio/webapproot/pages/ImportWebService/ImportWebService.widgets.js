/*
 * Copyright (C) 2009-2011 WaveMaker Software, Inc.
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
ImportWebService.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%"}, {}, {
		dialog: ["wm.Panel", {height: "565px", border: "0", width: "100%"}, {}, {
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
												usernameInput: ["wm.Input", {displayValue:"sammysm@wavemaker.com", checked: true, width: "300px", border: "0"}, {onkeypress: "onUsernameKeyPress", onchange: "usernameChanged", onenterkey: "importBtnClick"}]
											}],
											panel603a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right", width: "100%",horizontalAlign: "center"}, {}, {
												passwordLabel: ["wm.Label", {width: "120px", border: "0", caption: "Password"}, {}, {
													format: ["wm.DataFormatter", {}, {}]
												}],
												passwordInput: ["wm.Input", {displayValue:"Silver77Surfer", checked: true, width: "300px", border: "0", inputType: "password"}, {onenterkey: "importBtnClick"}]
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
				importButton: ["wm.Button", {width: "96px", caption: "Import", margin: "4"}, {onclick: "importButtonClick"}],
				spacer6: ["wm.Spacer", {width: "10px"}, {}],
				cancelButton: ["wm.Button", {width: "96px", caption: "Cancel", margin: "4"}, {onclick: "cancelButtonClick"}]
			}]
		}]
	}]
}