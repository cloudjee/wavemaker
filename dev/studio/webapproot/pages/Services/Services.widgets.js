/*
 * Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
Services.widgets = {
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
	layoutBox: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", imageList: "smallToolbarImageList"}, {}, {
		editorToolbar: ["wm.Panel", {border: "0", layoutKind: "left-to-right", height: "29px"}, {}, {
			toolbarBtnHolder: ["wm.Panel", {border: "0", padding: "0,4", layoutKind: "left-to-right", height: "100%", width: "100%"}, {}, {
				webServiceSaveBtn: ["wm.ToolButton", {imageIndex: 8, width: "24px", height: "100%", hint: "Save Web Service configurations", border: "0", margin: "0", disabled: true}, {onclick: "webServiceSaveBtnClick"}],
				toolbarspacer1: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
				importWebServiceBtn: ["wm.ToolButton", {imageIndex: 25, width: "24px", height: "100%", hint: "Import Web Service", border: "0", margin: "0"}, {onclick: "importWebServiceBtnClick"}],
				delWebServiceBtn: ["wm.ToolButton", {imageIndex: 0, width: "24px", height: "100%", hint: "Delete Web Service", border: "0", margin: "0"}, {onclick: "delWebServiceBtnClick"}]
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
							panel2: ["wm.Panel", {border: "1,0,0,0", borderColor: "#000000", width: "100%", padding: "4"}, {}, {
								serviceNameInput: ["wm.Editor", {caption: "Service Name", captionSize: "240px", height: "20px", layoutKind: "left-to-right", readonly: true}, {}, {
								    editor: ["wm._TextEditor", {changeOnKey: true}, {}]
								}],
								feedDescInput: ["wm.Editor", {/*singleLine: false, */showing: false, caption: "Description", captionSize: "240px", height: "24px", layoutKind: "left-to-right", displayValue: "Supports all of the popular RSS and Atom formats including RSS 0.90, RSS 0.91 Netscape, RSS 0.91 Userland, RSS 0.92, RSS 0.93, RSS 0.94, RSS 1.0, RSS 2.0, Atom 0.3, and Atom 1.0.", readonly: true}, {}, {
									editor: ["wm._TextEditor", {changeOnKey: true}, {}]
								}],
								authUsernameInput: ["wm.Editor", {showing: false, caption: "HTTP Basic Auth Username", captionSize: "240px", height: "24px", emptyValue: "null", layoutKind: "left-to-right"}, {onchange: "editorChange"}, {
									editor: ["wm._TextEditor", {changeOnKey: true}, {}]
								}],
								authPasswordInput: ["wm.Editor", {showing: false, caption: "HTTP Basic Auth Password", captionSize: "240px", height: "24px", emptyValue: "null", layoutKind: "left-to-right"}, {onchange: "editorChange"}, {
								    editor: ["wm._TextEditor", {password: true,changeOnKey: true}, {}]
								}],
								wsConnectionTimeoutInput: ["wm.Editor", {showing: false, caption: "Connection Timeout (milliseconds)", captionSize: "240px", height: "24px", emptyValue: "null", layoutKind: "left-to-right", display: "Number"}, {onchange: "editorChange"}, {
									editor: ["wm._NumberEditor", {changeOnKey: true}, {}]
								}],
								wsRequestTimeoutInput: ["wm.Editor", {showing: false, caption: "Request Timeout (milliseconds)", captionSize: "240px", height: "24px", emptyValue: "null", layoutKind: "left-to-right", display: "Number"}, {onchange: "editorChange"}, {
									editor: ["wm._NumberEditor", {changeOnKey: true}, {}]
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
							wsdlCodeEditor: ["wm.TextArea", {readonly: true, border: "0", width: "100%", height: "100%", margin: "", padding: "2", readOnly: true, scrollY: true}, {}],
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