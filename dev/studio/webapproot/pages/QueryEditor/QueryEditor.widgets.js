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
 
QueryEditor.widgets = {
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", imageList: "smallToolbarImageList"}, {}, {
		editorToolbar: ["wm.Panel", {border: "0", height: "29px", layoutKind: "left-to-right"}, {}, {
			toolbarBtnHolder: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right", width: "100%", padding: "0,4"}, {}, {
				saveQueryBtn: ["wm.ToolButton", {imageIndex: 8, width: "24px", height: "100%", margin: "0", border: "0", disabled: true, hint: "Save Query"}, {onclick: "saveQuery"}],
				toolbarspacer1: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
				newQueryBtn: ["wm.ToolButton", {imageIndex: 25, width: "24px", height: "100%", margin: "0", border: "0", hint: "New Query"}, {onclick: "newQuery"}],
				delQueryBtn: ["wm.ToolButton", {imageIndex: 0, width: "24px", height: "100%",  margin: "0", border: "0", disabled: true, hint: "Delete Query"}, {onclick: "removeQuery"}]
			}],
			logoBtmHolder: ["wm.Panel", {border: "0", width: "221px"}, {}]
		}],
		editorContainer: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right", width: "100%"}, {}, {
			panel6a: ["wm.Panel", {border: "0", height: "100%", width: "100%"}, {}, {
				panel1: ["wm.Panel", {border: "0", height: "100%", width: "869px"}, {}, {
				    panelTopLayout: ["wm.Panel", {height: "100px", width: "100px", layoutKind: "left-to-right"}, {}, {
					    queryPropsPanel: ["wm.Panel", {border: "1,0,0,0", borderColor: "#000000", height: "100px", width: "400px", padding: "4", verticalAlign: "top", horizontalAlign: "left"}, {}, {
						    queryDataModelInput: ["wm.Editor", {layoutKind: "left-to-right", caption: "Data Model", display: "Select", width: "100%", height: "24px", disabled: true,emptyValue: "emptyString"}, {onchange: "queryDataModelInputChange"}, {
							    editor: ["wm._SelectEditor", {}, {}]
							}],
						queryNameInput: ["wm.Editor", {layoutKind: "left-to-right", caption: "Name", width: "100%", height: "24px",emptyValue: "emptyString"}, {onchange: "queryNameChanged"}, {
							    editor: ["wm._TextEditor", {changeOnKey: true}, {}]
							}],
						    queryCommentInput: ["wm.Editor", {layoutKind: "left-to-right", caption: "Comment", width: "100%", height: "24px",emptyValue: "emptyString"}, {onchange: "queryCommentChanged"}, {
							    editor: ["wm._TextEditor", {changeOnKey: true}, {}]
							}]
						}],
					    helpContainer: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", margin: "0,0,0,30"}, {}, {
						    helpSectionLabel: ["wm.Label", {caption: "Usage Notes", border: "0", height: "18px", padding: "0,0,0,5"}],
							helpPanel: ["wm.Panel", { width: "100%", height: "100%", layoutKind: "top-to-bottom"}, {}, {
							    helpCaption1: ["wm.Label", {width: "100%", height: "28px", caption: "1. Remember to save your query before leaving the editor"}],
							    helpCaption2: ["wm.Label", {width: "100%", height: "30px", singleLine: false, caption: "2. After you finish creating your query, create a new service variable to use it"}],						    
							    helpLink: ["wm.Label", {width: "100%", height: "25px", link: "http://dev.wavemaker.com/wiki/bin/view/Dev/HqlTutorial", caption: "Details on query syntax"}]
							    
							}]
						}]
					}],
					queryTopHalfPanel: ["wm.Panel", {border: "0", height: "100%", width: "100%"}, {}, {
						queryDefSpacing: ["wm.Panel", {border: "0", height: "100%", padding: "4"}, {}, {
							queryDefLabel: ["wm.Label", {caption: "Query Definition", border: "0", height: "18px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							queryPanel: ["wm.Panel", {border: "0", height: "100%", padding: "4"}, {}, {
								queryInputPanel: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right"}, {}, {
								    queryTextArea: ["wm.LargeTextArea", {readOnly: false, border: "0", width: "100%", height: "100%", changeOnKey: true}, {onchange: "queryTextAreaChanged"}]
								}],
								queryOptionsPanel: ["wm.Panel", {border: "0", height: "22px", layoutKind: "left-to-right"}, {}, {
									returnsSingleResultCheckBox: ["wm.Editor", {layoutKind: "left-to-right", caption: "Returns single result", display: "CheckBox", captionSize: "150px", width: "200px"}, {onchange: "singleResultChanged"}, {
										editor: ["wm._CheckBoxEditor", {}, {}]
									}]
								}]
							}]
						}],

					    queryParamsLabel: ["wm.Label", {caption: "Query Parameters", border: "0", height: "18px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
		                                editorToolbar2: ["wm.Panel", {border: "0", height: "29px", layoutKind: "left-to-right", margin:"4,0,0"}, {}, {
			                            toolbarBtnHolder2: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right", width: "100%", padding: "0,4"}, {}, {
							addInputBtn: ["wm.ToolButton", {imageIndex: 25, width: "24px", height: "24px", margin: "0", border: "0"}, {onclick: "addBindParam"}],
							deleteParamBtn: ["wm.ToolButton", {imageIndex: 0, width: "24px", height: "24px",  margin: "0", border: "0"}, {onclick: "removeBindParam"}]                                                    
                                                    }]
                                                }],
                                        
							paramsPanel: ["wm.Panel", { border: "0", height: "100%", padding: "4"}, {}, {
							    queryInputsList: ["wm.List", {height: "100%", width: "100%", border: "0"}, {onselect: "parmSelected"}],
                                                            
							    addNewParamPanel: ["wm.Panel", {border: "0", height: "28px", layoutKind: "left-to-right", padding: "0", verticalAlign: "center"}, {}, {
								addBindParamLabel: ["wm.Label", {caption: "Add bind parameter:", border: "0", height: "100%", width: "125px"}, {}, {
								    format: ["wm.DataFormatter", {}, {}]
								}],
								bindNameInput: ["wm.Editor", {layoutKind: "left-to-right", caption: "Name", padding: "", captionSize: "50px", width: "150px", height: "20px"}, {onchange: "parameterPropEdit"}, {
                                                                    binding: ["wm.Binding", {}, {}, {
					                                wire: ["wm.Wire", {"targetProperty":"disabled","source":"queryInputsList.emptySelection"}, {}]
				                                    }],
								    editor: ["wm._TextEditor", {}, {}]
								}],
								bindTypeInput: ["wm.Editor", {layoutKind: "left-to-right", caption: "Type", display: "Select", padding: "", captionSize: "50px", width: "150px", height: "20px"}, {onchange: "parameterPropEdit"}, {
                                                                    binding: ["wm.Binding", {}, {}, {
					                                wire: ["wm.Wire", {"targetProperty":"disabled","source":"queryInputsList.emptySelection"}, {}]
				                                    }],
								    editor: ["wm._SelectEditor", {}, {}]
								}],
								isInputListCheckBox: ["wm.Editor", {layoutKind: "left-to-right", caption: "List", display: "CheckBox", padding: "2,0,0,0", captionSize: "60px", width: "80px", height: "20px"}, {onchange: "parameterPropEdit"}, {
                                                                    binding: ["wm.Binding", {}, {}, {
					                                wire: ["wm.Wire", {"targetProperty":"disabled","source":"queryInputsList.emptySelection"}, {}]
				                                    }],
								    editor: ["wm._CheckBoxEditor", {padding: "1,0,0,0"}, {}]
								}],
						                bindParamInput: ["wm.Editor", {layoutKind: "left-to-right", caption: "Test Value:", width: "100%", minWidth: "180px", captionSize: "100px"}, {onchange: "parameterPropEdit"}, {
                                                                    binding: ["wm.Binding", {}, {}, {
					                                wire: ["wm.Wire", {"targetProperty":"disabled","source":"queryInputsList.emptySelection"}, {}]
				                                    }],
						                    editor: ["wm._TextEditor", {}, {}]
						                }]
							    }]
							}]
					}]
				}],
				splitter2: ["wm.Splitter", {border: "0"}, {}],
				queryTestPanel: ["wm.Panel", {border: "1,0,0,0", borderColor: "#000000", height: "120px", padding: "2", width: "100%"}, {}, {
					panel1a: ["wm.Panel", {border: "0", height: "26px", layoutKind: "left-to-right"}, {}, {
					    testLabel: ["wm.Label", {caption: "Test Query", border: "0", height: "26px", width: "100px"}, {}, {
					        format: ["wm.DataFormatter", {}, {}]
					    }],
					    maxResultsInput: ["wm.Editor", {layoutKind: "left-to-right", caption: "Max Results:", captionSize: "140px", width: "200px", displayValue: "10", emptyValue: "null"}, {}, {
						editor: ["wm._NumberEditor", {}, {}]
					    }],
					    spacer15: ["wm.Spacer", {width: "30px"}, {}],
					    runQueryBtn: ["wm.Button", {caption: "<img src=\"images/flash_16.png\"/>", margin: "0", width: "24px", border: "0", 
								        disabled: true, hint: "Test Query"}, {onclick: "runQuery"}]
					}],
					emptyResultSetLabel: ["wm.Label", {caption: "Empty Result Set", border: "0", width: "200px", showing: false}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					queryOutputList: ["wm.List", {height: "100%", width: "100%", border: "0"}, {}]
				}]
			}],
			splitter1: ["wm.Splitter", {border: "0", layout: "right", showing: false}, {}],
			panel5a: ["wm.Panel", {border: "0", width: "200px", showing: false}, {}, {
				typeRefTree: ["wm.Tree", {height: "100%", border: "0"}, {}]
			}]
		}],
		benchbevel4: ["wm.Bevel", {}, {}]
	}]
}