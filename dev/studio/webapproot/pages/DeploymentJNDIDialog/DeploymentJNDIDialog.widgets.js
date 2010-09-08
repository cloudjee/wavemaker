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
DeploymentJNDIDialog.widgets = {
	appsVar: ["wm.Variable", {type: "com.wavemaker.tools.deployment.AppInfo"}, {}],
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", border: "0"}, {}, {
		titleBar: ["wm.Panel", {height: "29px", layoutKind: "left-to-right", border: "0"}, {}, {
			dialogLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px", "wm_FontColor_White"]}, caption: "JNDI Setup", width: "100%", height: "100%", border: "0"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}],
	    deplPanel: ["wm.Panel", {_classes: {domNode: ["wmDialogBody"]}, height: "100%", width: "100%", border: "0", margin: "5"}, {}, {
					deplDialog: ["wm.Panel", {height: "100%", layoutKind: "left-to-right", width: "100%", border: "0"}, {}, {
						deplDialogInner: ["wm.Panel", {height: "100%", width: "100%", border: "0"}, {}, {
							outerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0"}, {}, {
								topPanel: ["wm.Panel", {height: "100%", layoutKind: "left-to-right", width: "100%", border: "0"}, {}, {
								    panel1: ["wm.Panel", {height: "100%", width: "200px", border: "0",borderColor:"red"}, {}, {
										listLabel: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Center", "wm_FontColor_White"]}, caption: "Data Models", height: "24px", border: "0"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										dataModelList: ["wm.List", {headerVisible: false, _classes: {domNode: ["wm_BackgroundColor_VeryLightGray"]}, width: "100%", height: "100%", border: "0", margin: "0,0,0,4"}, {onselect: "dataModelListSelect"}]
									}],
								                panel2: ["wm.Panel", {height: "50px", width: "100%", border: "0", margin: "0,0,0,20"}, {}, {
										settingsLabel: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Center", "wm_FontColor_White"]}, caption: "Settings", height: "24px", border: "0"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										panel3: ["wm.Panel", {height: "100%", width: "100%", border: "0"}, {}, {
											dataModelNameEditor: ["wm.Editor", {caption: "Data Model", height: "20px", readonly: true, border: "0"}, {}, {
												editor: ["wm._TextEditor", {border: "0"}, {}]
											}],
											spacer5: ["wm.Spacer", {height: "15px", border: "0"}, {}],
/*
											useJNDICheckbox: ["wm.Editor", {caption: "Use JNDI", height: "26px", border: "0", displayValue: "1", display: "CheckBox"}, {onchange: "useJNDICheckboxChange"}, {
												editor: ["wm._CheckBoxEditor", {border: "0"}, {}]
											}],
                                                                                        */
											jndiEditor: ["wm.Editor", {caption: "JNDI Name", height: "26px", border: "0"}, {}, {
												editor: ["wm._TextEditor", {border: "0"}, {}]
											}],
											spacer1: ["wm.Spacer", {height: "10px", border: "0"}, {}],
											dbtypeEditor: ["wm.Editor", {caption: "Database System", height: "20px", readonly: true, border: "0", showing: false}, {}, {
												editor: ["wm._TextEditor", {border: "0"}, {}]
											}],
											hostEditor: ["wm.Editor", {caption: "Host", height: "20px", readonly: true, border: "0", showing: false}, {}, {
												editor: ["wm._TextEditor", {border: "0"}, {}]
											}],
											portEditor: ["wm.Editor", {caption: "Port", height: "20px", readonly: true, border: "0", showing: false}, {}, {
												editor: ["wm._TextEditor", {border: "0"}, {}]
											}],
											extraEditor1: ["wm.Editor", {caption: "Extra1", height: "20px", readonly: true, border: "0", showing: false}, {}, {
												editor: ["wm._TextEditor", {border: "0"}, {}]
											}],
											extraEditor2: ["wm.Editor", {caption: "Extra2", height: "20px", readonly: true, border: "0", showing: false}, {}, {
												editor: ["wm._TextEditor", {border: "0"}, {}]
											}],
											labJndiHelp: ["wm.Label", {"align":"center","border":"0","caption":"<br>JNDI Name is \"java:comp/env/\" and the resource name. <br> For a resource named \"jdbc/myDB\" use:<br> \"java:comp/env/jdbc/myDB\"","height":"104px","singleLine":false,"width":"96px"}, {}, {
												format: ["wm.DataFormatter", {}, {}]
											}]
										}]
									}]
								}]
							}]
						}]
					}],
					footer: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, height: "30px", layoutKind: "left-to-right", horizontalAlign: "right", border: "0"}, {}, {
						okButton: ["wm.Button", {caption: "OK", width: "80px"}, {onclick: "okButtonClick"}],
						spacer4: ["wm.Spacer", {border: "0", width: "10px"}, {}],
						cancelButton: ["wm.Button", {caption: "Cancel", width: "80px"}, {onclick: "cancelButtonClick"}]
					}]
				}]
			}]
}


