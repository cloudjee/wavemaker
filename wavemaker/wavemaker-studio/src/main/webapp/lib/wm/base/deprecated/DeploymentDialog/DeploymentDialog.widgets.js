/*
 * Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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
 
DeploymentDialog.widgets = {
	appsVar: ["wm.Variable", {type: "com.wavemaker.tools.deployment.AppInfo"}, {}],
	gotoLayer1: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {type: "gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "layer", source: "layer1"}, {}]
			}]
		}]
	}],
	gotoLayer2: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {type: "gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "layer", source: "layer2"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", border: "0"}, {}, {
/*
		titleBar: ["wm.Panel", {height: "29px", layoutKind: "left-to-right", border: "0"}, {}, {
			dialogLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px", "wm_FontColor_White"]}, caption: "Deployment", width: "100%", height: "100%", border: "0"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}],
		*/
		deplPanel: ["wm.Panel", {_classes: {domNode: ["wmDialogBody"]}, height: "100%", width: "100%", border: "0"}, {}, {
			layers1: ["wm.TabLayers", {border: "0"}, {}, {
				layer1: ["wm.Layer", {caption: "Generate War", border: "0"}, {}, {
					deplDialog: ["wm.Panel", {height: "100%", layoutKind: "left-to-right", width: "100%", border: "0"}, {}, {
						deplDialogInner: ["wm.Panel", {height: "100%", width: "100%", border: "0"}, {}, {
							outerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0"}, {}, {
								topPanel: ["wm.Panel", {height: "5000%", layoutKind: "left-to-right", width: "5000%", border: "0"}, {}, {
									panel1: ["wm.Panel", {height: "2000%", width: "2000%", border: "0"}, {}, {
										listLabel: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Center", "wm_FontColor_White"]}, caption: "Data Models", height: "24px", border: "0"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										dataModelList: ["wm.List", {headerVisible: false, _classes: {domNode: ["wm_BackgroundColor_VeryLightGray"]}, width: "100%", height: "100%", border: "0", margin: "0,0,0,4"}, {onselect: "dataModelListSelect"}]
									}],
									panel4: ["wm.Panel", {height: "100%", width: "100%", border: "0"}, {}],
									panel2: ["wm.Panel", {height: "4000%", width: "4000%", border: "0"}, {}, {
										settingsLabel: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Center", "wm_FontColor_White"]}, caption: "Settings", height: "24px", border: "0"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										panel3: ["wm.Panel", {height: "100%", width: "100%", border: "0"}, {}, {
											dataModelNameEditor: ["wm.Editor", {caption: "Data Model", height: "20px", readonly: true, border: "0"}, {}, {
												editor: ["wm._TextEditor", {border: "0"}, {}]
											}],
											spacer5: ["wm.Spacer", {height: "15px", border: "0"}, {}],
											useJNDICheckbox: ["wm.Editor", {caption: "Use JNDI", height: "26px", border: "0", displayValue: "1", display: "CheckBox"}, {onchange: "useJNDICheckboxChange"}, {
												editor: ["wm._CheckBoxEditor", {border: "0"}, {}]
											}],
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
				}],
				layer2: ["wm.Layer", {caption: "Live Deployment", border: "0"}, {}, {
					panel7: ["wm.Panel", {height: "50px", padding: "4", border: "0"}, {}, {
						panel5: ["wm.Panel", {height: "26px", layoutKind: "left-to-right", border: "0"}, {}, {
							deploymentTargetSelect: ["wm.Editor", {caption: "Target", border: "0", width: "300px", display: "Select"}, {onchange: "deploymentTargetSelectChange"}, {
								editor: ["wm._SelectEditor", {border: "0"}, {}]
							}],
							contextRoot: ["wm.Editor", {caption: "Context Root", border: "0", width: "314px"}, {}, {
								editor: ["wm._TextEditor", {border: "0"}, {}]
							}]
						}]
					}],
					propertiesPanel: ["wm.Panel", {height: "120px", border: "0"}, {}],
					panel6: ["wm.Panel", {height: "100%", width: "100%", border: "0"}, {}, {
						applist: ["wm.DataGrid", {border: "0"}, {onCellClick: "onAppGridCellClick"}, {
							name1: ["wm.DataGridColumn", {caption: "Name", field: "name", columnWidth: "150px", index: 1}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							url: ["wm.DataGridColumn", {caption: "URL", field: "href", columnWidth: "290px", index: 1}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							desc: ["wm.DataGridColumn", {caption: "Info", field: "description", columnWidth: "150px", index: 1}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}]
					}],
					footer2: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, height: "30px", layoutKind: "left-to-right", horizontalAlign: "right", border: "0"}, {}, {
						listAppsButton: ["wm.Button", {caption: "List Apps", width: "80px"}, {onclick: "listAppsButtonClick"}],
						spacer8: ["wm.Spacer", {border: "0", width: "10px"}, {}],
						deploy2Button: ["wm.Button", {caption: "Deploy", width: "80px"}, {onclick: "deployButtonClick"}],
						spacer9: ["wm.Spacer", {border: "0", width: "10px"}, {}],
						undeployButton: ["wm.Button", {caption: "Undeploy", width: "80px"}, {onclick: "undeployButtonClick"}],
						spacer10: ["wm.Spacer", {border: "0", width: "10px"}, {}],
						redeployButton: ["wm.Button", {caption: "Redeploy", width: "80px"}, {onclick: "redeployButtonClick"}],
						spacer11: ["wm.Spacer", {border: "0", width: "10px"}, {}],
						cancel2Button: ["wm.Button", {caption: "Close", width: "80px"}, {onclick: "cancelButtonClick"}]
					}]
				}]
			}]
		}]
	}]
}