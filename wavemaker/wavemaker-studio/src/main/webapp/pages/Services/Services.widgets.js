/*
 * Copyright (C) 2009-2013 VMware, Inc. All rights reserved.
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
 
Services.widgets = {
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
	layoutBox: ["wm.Layout", {_classes: {domNode: []}, height: "100%", imageList: "smallToolbarImageList"}, {}, {
	    editorToolbar: ["wm.Panel", {_classes: {domNode:["StudioToolBar"]}, border: "0", layoutKind: "left-to-right", height: "29px", border: "0,0,1,0", borderColor: "#959DAB"}, {}, {
			toolbarBtnHolder: ["wm.Panel", {border: "0", padding: "0,4", layoutKind: "left-to-right", height: "100%", width: "100%"}, {}, {
				webServiceSaveBtn: ["wm.studio.ToolbarButton", {imageIndex: 8, hint: "Save Web Service configurations", disabled: true}, {onclick: "webServiceSaveBtnClick"}],
				toolbarspacer1: ["wm.studio.ToolbarSpacer", {}, {}],
				importWebServiceBtn: ["wm.studio.ToolbarButton", {imageIndex: 25, hint: "Import Web Service"}, {onclick: "importWebServiceBtnClick"}],
				delWebServiceBtn: ["wm.studio.ToolbarButton", {imageIndex: 0, hint: "Delete Web Service",}, {onclick: "delWebServiceBtnClick"}]
			}],
			logoBtmHolder: ["wm.Panel", {border: "0", width: "221px"}, {}]
		}],
		servicesMainPanel: ["wm.Panel", {border: "0", layoutKind: "left-to-right", height: "100%", width: "100%"}, {}, {
			tree: ["wm.ServicesTree", {width: "182px", border: "0", showing: false}, {onselect: "treeSelect"}],
			splitter1: ["wm.Splitter", {border: "0", showing: false}, {}],
			servicesDetailPanel: ["wm.Panel", {border: "0", height: "100%", width: "100%"}, {}, {
				webServicePropsPanel: ["wm.Panel", {border: "0", layoutKind: "left-to-right", height: "154px"}, {}, {
					webServicePanel: ["wm.Panel", {border: "0", height: "100%", width: "100%"}, {}, {
						panel1: ["wm.Panel", {border: "0", layoutKind: "left-to-right", height: "100%"}, {}, {
							panel2: ["wm.Panel", {border: "0", borderColor: "#000000", width: "100%", padding: "4"}, {}, {
							    serviceNameInput: ["wm.Text", {_classes: {domNode: ["StudioLabel", "StudioEditor"]}, changeOnKey: true, caption: "Service Name", captionSize: "240px", height: "20px", layoutKind: "left-to-right", readonly: true}, {}, {
								    
								}],
								feedDescInput: ["wm.Text", {_classes: {domNode: ["StudioLabel", "StudioEditor"]}, /*singleLine: false, */changeOnKey: true, showing: false, caption: "Description", captionSize: "240px", height: "24px", layoutKind: "left-to-right", displayValue: "Supports all of the popular RSS and Atom formats including RSS 0.90, RSS 0.91 Netscape, RSS 0.91 Userland, RSS 0.92, RSS 0.93, RSS 0.94, RSS 1.0, RSS 2.0, Atom 0.3, and Atom 1.0.", readonly: true}, {}, {
								}],
 								authUsernameInput: ["wm.Text", {_classes: {domNode: ["StudioLabel", "StudioEditor"]}, changeOnKey: true, showing: false, caption: "HTTP Basic Auth Username", captionSize: "240px", height: "24px", emptyValue: "null", layoutKind: "left-to-right"}, {onchange: "editorChange"}, {
									
								}],
								authPasswordInput: ["wm.Text", {_classes: {domNode: ["StudioLabel", "StudioEditor"]}, password: true,changeOnKey: true, showing: false, caption: "HTTP Basic Auth Password", captionSize: "240px", height: "24px", emptyValue: "null", layoutKind: "left-to-right"}, {onchange: "editorChange"}, {
								}],
								wsConnectionTimeoutInput: ["wm.Number", {_classes: {domNode: ["StudioLabel", "StudioEditor"]}, changeOnKey: true, showing: false, caption: "Connection Timeout (milliseconds)", captionSize: "240px", height: "24px", emptyValue: "null", layoutKind: "left-to-right", display: "Number"}, {onchange: "editorChange"}, {
								}],
								wsRequestTimeoutInput: ["wm.Number", {_classes: {domNode: ["StudioLabel", "StudioEditor"]}, changeOnKey: true, showing: false, caption: "Request Timeout (milliseconds)", captionSize: "240px", height: "24px", emptyValue: "null", layoutKind: "left-to-right", display: "Number"}, {onchange: "editorChange"}, {									
								}],
								endpointAddressInput: ["wm.Text", {_classes: {domNode: ["StudioLabel", "StudioEditor"]}, changeOnKey: true, showing: false, caption: "Endpoint Address", captionSize: "240px", height: "24px", emptyValue: "null", layoutKind: "left-to-right", display: "Number"}, {onchange: "editorChange"}, {									
								}]
							}]
						}]
					}]
				}],
				wsdlSpacing: ["wm.Panel", {_classes: {domNode: ["wm_Padding_10px"]}, border: "0", height: "100%"}, {}, {
					wsdlLabel: ["wm.Label", {caption: "WSDL File", height: "24px", border: "0", padding: "10"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					wsdlPanel: ["wm.Panel", {border: "0", height: "100%", padding: "0"}, {}, {
						wsdlTextHolder: ["wm.Panel", {border: "0", layoutKind: "left-to-right", height: "100%"}, {}, {
						    wsdlCodeEditor: ["wm.LargeTextArea", {disabled: true, border: "0", width: "100%", height: "100%", margin: "", padding: "2", readOnly: true, scrollY: true}, {}],
							wsdlLink: ["wm.Label", {caption: "Download WSDL", height: "100%", border: "0", width: "100%", showing: false}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}]
					}]
				}]
			}]
		}],
		benchbevel4: ["wm.Bevel", {border: "0"}, {}]
	}]
}