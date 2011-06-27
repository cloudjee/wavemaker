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
RestUrlDialog.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%"}, {}, {
		dialog: ["wm.Panel", {border: "0", height: "100%", width: "100%", layoutKind: "left-to-right"}, {}, {
			dialogInner: ["wm.Panel", {border: "0", height: "100%", width: "100%"}, {}, {
				titleBar: ["wm.Panel", {border: "0", height: "25px", layoutKind: "left-to-right"}, {}, {
					dialogLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px", "wm_FontColor_White"]}, caption: "REST Service Call", height: "100%", border: "0", width: "100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				mainPanel: ["wm.Panel", {border: "0", height: "100%", width: "100%", padding: "10,0"}, {}, {
					spacer5: ["wm.Spacer", {height: "10px"}, {}],
					panel01: ["wm.Panel", {border: "0", height: "50px"}, {}, {
						panel1: ["wm.Panel", {border: "0", height: "22px", layoutKind: "left-to-right"}, {}, {
							//spacer2: ["wm.Spacer", {height: "100%", width: "100%"}, {}],
							urlInput: ["wm.Editor", {_classes: {captionNode: ["wm_FontColor_White"]}, caption: "URL", captionSize: "50px", width: "430px", layoutKind: "left-to-right"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							//spacer3: ["wm.Spacer", {height: "100%", width: "100%"}, {}]
							//spacer3: ["wm.Spacer", {height: "100%", width: "10px"}, {}],
							methodInput: ["wm.Editor", {caption: "Method", captionSize: "80px", width: "150px", dataValue: "GET", layoutKind: "left-to-right"}, {}, {
								editor: ["wm._SelectEditor", {options: "GET,POST"}, {}]
							}],
							contentTypeInput: ["wm.Editor", {caption: "Content Type", captionSize: "80px", width: "200px", dataValue: "text/xml", layoutKind: "left-to-right"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"disabled","expression":"${methodInput.dataValue} == 'GET'"}, {}]
								}],
								
								editor: ["wm._SelectEditor", {options: "text/xml,application/x-www-form-urlencoded"}, {}]
							}]
						}],
						panel11: ["wm.Panel", {border: "0", height: "22px", layoutKind: "left-to-right"}, {}, {
							//spacer2: ["wm.Spacer", {height: "100%", width: "100%"}, {}],
							basicAuthCheckbox: ["wm.Editor", {caption: "Basic Auth", displayValue: "0", height: "100%", captionSize: "80px", layoutKind: "left-to-right"}, {onchange: "basicAuthCheckboxChange"}, {
								editor: ["wm._CheckBoxEditor", {layoutFlex: 10}, {}]
							}],
							userIdInput: ["wm.Editor", {_classes: {captionNode: ["wm_FontColor_White"]}, caption: "User Id", captionSize: "60px", width: "200px", layoutKind: "left-to-right"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							spacer31: ["wm.Spacer", {height: "100%", width: "20px"}, {}],
							label1: ["wm.Label", {width: "100px", border: "0", caption: "Password"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							passwordInput: ["wm.Input", {checked: true, width: "200px", border: "0", inputType: "password"}, {}]
							//password: ["wm.Editor", {_classes: {captionNode: ["wm_FontColor_White"]}, caption: "Password", captionSize: "60px", width: //"200px", layoutKind: "left-to-right"}, {}, {
							//	editor: ["wm._TextEditor", {}, {}]
							//}]							
						}],
					}],
					spacer6: ["wm.Spacer", {height: "10px"}, {}],
					requestTextArea: ["wm.Editor", {width: "100%", layoutKind: "left-to-right", padding: "0", height: "100px", singleLine: false, display: "TextArea"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"targetProperty":"disabled","expression":"${methodInput.dataValue} == 'GET'"}, {}]
							}]}, 
						{
						editor: ["wm._TextAreaEditor", {}, {}]
					}],
					spacer61: ["wm.Spacer", {height: "5px"}, {}],
					responseTextArea: ["wm.Editor", {width: "100%", layoutKind: "left-to-right", padding: "0", height: "100%", singleLine: false, display: "TextArea"}, {}, {
						editor: ["wm._TextAreaEditor", {}, {}]
					}],
					errorMessageTextArea: ["wm.Editor", {width: "96px", layoutKind: "left-to-right", padding: "0", height: "100px", singleLine: false, display: "TextArea", showing: false}, {}, {
						editor: ["wm._TextAreaEditor", {}, {}]
					}]
				}],
				footer: ["wm.Panel", {border: "0", height: "26px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
					testBtn: ["wm.Button", {caption: "Test", border: "0", margin: "4", width: "96px"}, {onclick: "testBtnClick"}],
					spacer1: ["wm.Spacer", {width: "10px"}, {}],
					populateBtn: ["wm.Button", {caption: "Populate", border: "0", margin: "4", width: "96px"}, {onclick: "populateBtnClick"}],
					spacer4: ["wm.Spacer", {width: "10px"}, {}],
					cancelBtn: ["wm.Button", {caption: "Back", border: "0", margin: "4", width: "96px"}, {onclick: "cancelBtnClick"}]
				}]
			}]
		}]
	}]
}