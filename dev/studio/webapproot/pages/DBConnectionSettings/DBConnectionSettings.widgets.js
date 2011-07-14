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
 
DBConnectionSettings.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "1flex", border: "0", layoutFlex: 1, width: "1flex"}, {}, {
		importDBDialog: ["wm.Panel", {border: "0", height: "1flex", layoutKind: "left-to-right", layoutFlex: 1, width: "1flex"}, {}, {
			importDBDialogInner: ["wm.Panel", {border: "0", height: "1flex", layoutFlex: 1, width: "1flex"}, {}, {
				titleBar: ["wm.Panel", {border: "0", height: "29px", layoutKind: "left-to-right"}, {}, {
					dialogLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px", "wm_FontColor_White"]}, caption: "Database Connection Settings", layoutFlex: 1, width: "1flex", height: "1flex", border: "0"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				connectionSettingsPanel: ["wm.Panel", {padding: "10", border: "0", height: "1flex", layoutKind: "left-to-right", layoutFlex: 1, width: "1flex"}, {}, {
					panel1: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, padding: "5", height: "12flex", layoutFlex: 12, width: "12flex"}, {}, {
						dataModelList: ["wm.List", {_classes: {domNode: ["wm_Border_StyleSolid", "wm_Border_Size1px"]}, layoutFlex: 1, width: "1flex", height: "1flex"}, {onselect: "dataModelListSelect"}]
					}],
					panel2: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, padding: "5", border: "0", height: "20flex", layoutFlex: 20, width: "20flex"}, {}, {
						panel101: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							label101: ["wm.Label", {caption: "Username:", width: "200px", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conUserInput: ["wm.Input", {checked: true, width: "200px", border: "0"}, {onkeypress: "onConUsernameKeyPress", onchange: "conUsernameChanged"}]
						}],
						panel104: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							label102: ["wm.Label", {caption: "Password:", width: "200px", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conPasswordInput: ["wm.Input", {checked: true, width: "200px", border: "0", inputType: "password"}, {onkeypress: "onConPasswordKeyPress", onchange: "conPasswordChanged"}]
						}],
						conpanel501: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							conlabel301: ["wm.Label", {caption: "RDBMS:", width: "200px", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conDBdropdown: ["wm.SelectMenu", {display: "Select", height: "20px", width: "200px", layoutKind: "left-to-right"}, {onchange: "conDBdropdownChanged"}, {}]
						}],
						conpanel601: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							conHostLabel: ["wm.Label", {caption: "Hostname:", width: "200px", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conHostInput: ["wm.Input", {checked: true, width: "200px", border: "0"}, {onkeypress: "onConHostKeyPress", onchange: "conHostChanged"}]
						}],
						conpanel602: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							conPortLabel: ["wm.Label", {caption: "Port:", width: "200px", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conPortInput: ["wm.Input", {checked: true, width: "200px", border: "0"}, {onkeypress: "onConPortKeyPress", onchange: "conPortChanged"}]
						}],
						conpanel701: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							conExtraInputLabel: ["wm.Label", {caption: "conExtraInputLabel", width: "200px", border: "0", showing: false}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conExtraInput: ["wm.Input", {checked: true, width: "200px", border: "0", showing: false}, {onkeypress: "onConExtraKeyPress", onchange: "conExtraChanged"}]
						}],
						conextra2Panel: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							conExtra2InputLabel: ["wm.Label", {caption: "Instance", width: "200px", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conExtra2Input: ["wm.Input", {checked: true, width: "200px", border: "0"}, {onkeypress: "onConExtra2KeyPress", onchange: "conExtra2Changed"}]
						}],
						panel102: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							label103: ["wm.Label", {caption: "Connection URL:", width: "200px", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conConnectionUrlInput: ["wm.Input", {checked: true, width: "200px", border: "0", inputValue: "jdbc:mysql://localhost:3306"}, {onkeypress: "onConConnectionUrlKeyPress", onchange: "conConnectionUrlChanged"}]
						}],
						conpanel1802: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							conlabel8: ["wm.Label", {caption: "Table Filter:", width: "200px", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conTablePatternInput: ["wm.Input", {checked: true, width: "200px", border: "0"}, {onkeypress: "onConTablePatternKeyPress", onchange: "conTablePatternChanged"}]
						}],
						conpanel1801: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							conlabel7: ["wm.Label", {caption: "Schema Filter:", width: "200px", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conSchemaPatternInput: ["wm.Input", {checked: true, width: "200px", border: "0"}, {onkeypress: "onConSchemaPatternKeyPress", onchange: "conSchemaPatternChanged"}]
						}],
						conpanel20: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							conlabel16: ["wm.Label", {caption: "Driver Class:", width: "200px", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conDriverClassInput: ["wm.Input", {checked: true, width: "200px", border: "0"}, {onkeypress: "onConDriverClassKeyPress", onchange: "conDriverClassChanged"}]
						}],
						conpanel201: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							conlabel27: ["wm.Label", {caption: "Dialect:", width: "200px", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conDialectInput: ["wm.Input", {checked: true, width: "200px", border: "0"}, {onkeypress: "onConDialectKeyPress", onchange: "conDialectChanged"}]
						}],
						conpanel202: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
							conlabel28: ["wm.Label", {caption: "Reverse Naming Strategy:", width: "200px", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							conRevengNamingStrategyInput: ["wm.Input", {checked: true, width: "200px", border: "0"}, {onkeypress: "onConRevengKeyPress", onchange: "conRevengChanged"}]
						}],
						//newDatabaseInput: ["wm.CheckBoxEditor", {captionSize: "360px", caption: "New Database?", width: "100%", layoutKind: "left-to-right", 
						//		displayValue: true, emptyValue: "false"}, {onchange: "newDatabaseInputChanged"}, {
						//		editor: ["wm._CheckBoxEditor", {dataType: "boolean"}, {}]
						//}],
						overrideFlagInput: ["wm.CheckBoxEditor", {captionSize: "380px", caption: "If Exporting, Create New Database or Re-create Existing Database", width: "100%", layoutKind: "left-to-right", 
								displayValue: true, emptyValue: "false"}, {onchange: "overrideFlagInputChanged"}, {
								editor: ["wm._CheckBoxEditor", {dataType: "boolean"}, {}]
						}],
					}]
				}],
				footer: ["wm.Panel", {border: "0", height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
					testConnectionBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Test Connection", autoSize: false, width: "130px", margin: "4"}, {onclick: "testConnectionBtnClick"}],
					spacer1: ["wm.Spacer", {width: "10px", border: "0"}, {}],
					saveBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Save", autoSize: false, width: "80px", margin: "4"}, {onclick: "saveBtnClick"}],
					spacer2: ["wm.Spacer", {width: "10px", border: "0"}, {}],
					reimportBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Re-Import", autoSize: false, width: "100px", margin: "4"}, {onclick: "reimportBtnClick"}],
					spacer3: ["wm.Spacer", {width: "10px", border: "0"}, {}],
					exportBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Export", autoSize: false, width: "80px", margin: "4"}, {onclick: "exportBtnClick"}],
					spacer4: ["wm.Spacer", {width: "10px", border: "0"}, {}],
					cancelBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Close", autoSize: false, width: "80px", margin: "4"}, {onclick: "cancelBtnClick"}]
				}]
			}]
		}]
	}]
}
