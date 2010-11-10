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
ImportDatabase.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%"}, {}, {
		importDBDialog: ["wm.Panel", {width: "100%", height: "100%"}, {}, {
			titleBar: ["wm.Panel", {height: "29px", layoutKind: "left-to-right"}, {}, {
				dialogLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px", "wm_FontColor_White"]}, height: "100%", width: "100%", border: "0", caption: "New Data Model"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			tabs: ["wm.TabLayers", {}, {}, {
				importDatabase: ["wm.Layer", {caption: "Import Data Model", horizontalAlign: "left", verticalAlign: "top"}, {}, {
					importDBDialogInner: ["wm.Panel", {width: "100%", height: "100%"}, {}, {
						panel5: ["wm.Panel", {width: "100%", height: "100%"}, {}, {
							benchbevel4: ["wm.Bevel", {border: "0", width: "100%", height: "4px"}, {}],
							panel1: ["wm.Panel", {height: "100%", padding: "10"}, {}, {
								label1: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, height: "18px", border: "0", caption: "Basic Options"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								panel2: ["wm.Panel", {width: "100%", height: "200px", layoutKind: "left-to-right", horizontalAlign: "center", padding: "4,0,0,0"}, {}, {
									basicOptions: ["wm.Panel", {width: "452px", padding: "0"}, {}, {
										panel501a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											label301: ["wm.Label", {width: "118px", border: "0", caption: "Database System"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
										    dbdropdown: ["wm.Editor", {display: "Select", height: "20px", width: "304px", margin: "0,0,1,0"}, {onchange: "importDBdropdownChanged"}, {
												editor: ["wm._SelectEditor", {}, {}]
											}]
										}],
										panel601a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											hostLabel: ["wm.Label", {width: "120px", border: "0", caption: "Hostname"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											hostInput: ["wm.Input", {checked: true, width: "300px", border: "0"}, {onkeypress: "onImportHostKeyPress", onchange: "importHostChanged"}]
										}],
										panel602a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											portLabel: ["wm.Label", {width: "120px", border: "0", caption: "Port"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											portInput: ["wm.Input", {checked: true, width: "300px", border: "0"}, {onkeypress: "onImportPortKeyPress", onchange: "importPortChanged"}]
										}],
										panel6a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											label4: ["wm.Label", {width: "120px", border: "0", caption: "Username"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											usernameInput: ["wm.Input", {checked: true, width: "300px", border: "0"}, {onkeypress: "onUsernameKeyPress", onchange: "usernameChanged"}]
										}],
										panel603a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											label5: ["wm.Label", {width: "120px", border: "0", caption: "Password"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											passwordInput: ["wm.Input", {checked: true, width: "300px", border: "0", inputType: "password"}, {}]
										}],
										panel701a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											extraInputLabel: ["wm.Label", {width: "120px", border: "0", caption: "extraInputLabel", showing: false}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											extraInput: ["wm.Input", {checked: true, width: "300px", border: "0", showing: false}, {onkeypress: "onImportExtraKeyPress", onchange: "importExtraChanged"}]
										}],
										panel5a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											label3: ["wm.Label", {width: "120px", border: "0", caption: "Service Name"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											serviceNameInput: ["wm.Input", {checked: true, width: "300px", border: "0"}, {onkeypress: "onServiceNameKeyPress", onchange: "serviceNameChanged"}]
										}],
										extra2Panel: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											extra2InputLabel: ["wm.Label", {width: "120px", border: "0", caption: "Instance"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											extra2Input: ["wm.Input", {checked: true, width: "300px", border: "0"}, {onkeypress: "onImportExtra2KeyPress", onchange: "importExtra2Changed"}]
										}]
									}]
								}],
								spacerMiddle: ["wm.Spacer", {height: "10px"}, {}],
								label2: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, height: "18px", border: "0", caption: "Advanced Options"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								panel4: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right", horizontalAlign: "center", padding: "4,0,0,0"}, {}, {
									advancedOptions: ["wm.Panel", {width: "452px"}, {}, {
										panel110a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											label6: ["wm.Label", {width: "120px", border: "0", caption: "Connection URL"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											connectionUrlInput: ["wm.Input", {checked: true, width: "300px", border: "0"}, {}]
										}],
										panel19a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											label7: ["wm.Label", {width: "120px", border: "0", caption: "Java Package"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											packageInput: ["wm.Input", {checked: true, width: "300px", border: "0"}, {}]
										}],
										panel18a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											label8: ["wm.Label", {width: "120px", border: "0", caption: "Table Filter"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											tablePatternInput: ["wm.Input", {checked: true, width: "300px", border: "0"}, {}]
										}],
										panel1801a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											label9: ["wm.Label", {width: "120px", border: "0", caption: "Schema Filter"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											schemaPatternInput: ["wm.Input", {checked: true, width: "300px", border: "0"}, {}]
										}],
										panel20a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											label16: ["wm.Label", {width: "120px", border: "0", caption: "Driver Class"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											driverClassInput: ["wm.Input", {checked: true, width: "300px", border: "0"}, {}]
										}],
										panel201a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											label27: ["wm.Label", {width: "120px", border: "0", caption: "Dialect"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											dialectInput: ["wm.Input", {checked: true, width: "300px", border: "0"}, {}]
										}],
										panel202a: ["wm.Panel", {height: "24px", layoutKind: "left-to-right"}, {}, {
											label28: ["wm.Label", {width: "120px", border: "0", caption: "Naming Strategy"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}],
											revengNamingStrategyInput: ["wm.Input", {checked: true, width: "300px", border: "0"}, {}]
										}]
									}]
								}]
							}]
						}],
						footer: ["wm.Panel", {height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
							testConnectionBtn: ["wm.Button", {caption: "Test Connection", width: "160px"}, {onclick: "testConnectionBtnClick"}],
							spacer1: ["wm.Spacer", {width: "10px"}, {}],
							importBtn: ["wm.Button", {caption: "Import", width: "96px", hint: "Import Database"}, {onclick: "importBtnClick"}],
							spacer2: ["wm.Spacer", {width: "10px"}, {}],
							cancelBtn: ["wm.Button", {caption: "Close", width: "96px"}, {onclick: "cancelBtnClick"}]
						}]
					}]
				}],
				newDatabase: ["wm.Layer", {caption: "New Data Model", horizontalAlign: "left", verticalAlign: "top"}, {}, {
					newDBDialogInner: ["wm.Panel", {width: "100%", height: "100%"}, {}, {
						panel6: ["wm.Panel", {width: "100%", height: "100%"}, {}, {
							benchbevel6: ["wm.Bevel", {border: "0", width: "100%", height: "4px"}, {}],
							panel3: ["wm.Panel", {height: "100%", padding: "10"}, {}, {
								panel22: ["wm.Panel", {width: "100%", height: "100px", layoutKind: "left-to-right", horizontalAlign: "center", verticalAlign: "center"}, {}, {
									panel7: ["wm.Panel", {width: "490px", height: "100%", horizontalAlign: "center", verticalAlign: "middle"}, {}, {
										newDataModelInput: ["wm.Editor", {width: "100%", caption: "Data Model Name"}, {}, {
											editor: ["wm._TextEditor", {}, {}]
										}]
									}]
								}]
							}]
						}],
						footer1: ["wm.Panel", {height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
							spacer3: ["wm.Spacer", {width: "10px"}, {}],
							newBtn1: ["wm.Button", {caption: "OK", width: "96px", hint: "New Database"}, {onclick: "newBtnClick"}],
							spacer4: ["wm.Spacer", {width: "10px"}, {}],
							cancelBtn1: ["wm.Button", {caption: "Cancel", width: "96px"}, {onclick: "cancelBtnClick"}]
						}]
					}]
				}]
			}]
		}]
	}]
}