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
 
Start.widgets = {
    layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "center", backgroundColor: "#ffffff", autoScroll: false}, {}, {
/*
		editorToolbar: ["wm.Panel", {height: "29px", width: "100%", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
			logoBtmHolder: ["wm.Panel", {height: "100%", width: "221px"}, {}]
		}],
		*/
		panel5: ["wm.Panel", {height: "100%", width: "100%", verticalAlign: "middle", horizontalAlign: "center"}, {}, {
			panel1: ["wm.Panel", {height: "100%", width: "100%", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left"}, {}, {
			    tabLayers1: ["wm.TabLayers", {_classes: {domNode: ["StudioTabs", "NoRightMarginOnTab","StudioTabsInverted"]}, margin: "4,8,8,8", clientBorder: "1", clientBorderColor: "#959DAB"}, {}, {
					layer1: ["wm.Layer", {caption: "Welcome", horizontalAlign: "left", verticalAlign: "top", padding: "8"}, {}, {
						panel3: ["wm.Panel", {height: "100%", width: "100%", verticalAlign: "middle", horizontalAlign: "left", borderColor: ""}, {}, {
							welcomeTitleLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center"]}, height: "50px", width: "100%", caption: "Welcome to WaveMaker Studio", border: "0"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							panel4: ["wm.Panel", {height: "160px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "center", padding: "0,0,0,0"}, {}, {
								screencast: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Center"]}, height: "100%", width: "100%", caption: "<div class=\"start_icon_label\">Screencast</div><div style=\"font-weight:normal;font-size:85%\">A short video of WaveMaker in action</div>", padding: "14,4,4,4", singleLine: false}, {onclick: "screencastClick"}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								demo: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Center"]}, height: "100%", width: "100%", caption: "<div class=\"start_icon_label\">Explore</div><div style=\"font-weight:normal;font-size:85%\">Demos & Samples</div>", padding: "14,4,4,4", singleLine: false}, {onclick: "demoClick"}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								community: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Center"]}, height: "100%", width: "100%", caption: "<div class=\"start_icon_label\">Community</div><div style=\"font-weight:normal;font-size:85%\">Find answers quickly</div>", padding: "14,4,4,4", singleLine: false}, {onclick: "communityClick"}, {
									format: ["wm.DataFormatter", {}, {}]
								}]
							}],
							panel6: ["wm.Panel", {height: "100%", width: "100%", layoutKind: "left-to-right", verticalAlign: "middle", horizontalAlign: "left"}, {}, {
								spacer1: ["wm.Spacer", {width: "15px"}, {}],
								panel7: ["wm.Panel", {height: "100%", width: "224px", verticalAlign: "top", horizontalAlign: "left", padding: "15,0,0,0"}, {}, {
									newProject: ["wm.Label", {height: "30px", width: "100%", caption: "Create a New Project...", padding: "0,0,0,20"}, {onclick: "newProjectClick"}, {
										format: ["wm.DataFormatter", {}, {}]
									}],
									tutorial: ["wm.Label", {height: "30px", width: "100%", caption: "Tutorials", padding: "0,0,0,20"}, {onclick: "tutorialClick"}, {
										format: ["wm.DataFormatter", {}, {}]
									}],
									documentation: ["wm.Label", {height: "30px", width: "100%", caption: "Documentation", padding: "0,0,0,20"}, {onclick: "documentationClick"}, {
										format: ["wm.DataFormatter", {}, {}]
									}],									
									register: ["wm.Label", {height: "30px", width: "100%", caption: "Register", padding: "0,0,0,20"}, {onclick: "registerClick"}, {
										format: ["wm.DataFormatter", {}, {}]
									}]
								}],
							    iframe: ["wm.IFrame", {source: "studioService.download?method=getContent&inUrl=http://wavemaker.com/splash", width: "100%", height: "100%", border: "1", borderColor: "#000F19", margin: "0,8,10,0", showing: false}]
								}]
							}]
					}],
				    layer2: ["wm.Layer", {caption: "Projects", horizontalAlign: "left", verticalAlign: "top", padding: "8"}, {onShow: "projectsTabOnShow"}, {
					projectSearch: ["wm.Text", {width: "100%", height: "24px", resetButton: true, placeHolder: "Search by Project Name", caption: "", changeOnKey: true, emptyValue: "emptyString"}, {onchange: "filterProjectList", onEnterKeyPress: "openFirstProject"}],
						panel8: ["wm.Panel", {height: "100%", width: "100%", verticalAlign: "top", horizontalAlign: "left"}, {}, {
							projlist: ["wm.Panel", {height: "100%", width: "100%", layoutKind: "left-to-right", padding: "0"}, {}, {
							    existingProjectList: ["wm.List", {_classes: {domNode: ["StudioList"]}, width: "100%", border: "1", borderColor:"#687585"}, {onselect: "projectListSelect", ondeselect: "projectListDeselect", ondblclick: "openProject"}]
							}],
							panel9: ["wm.Panel", {height: "34px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "center"}, {}, {
							    openProjectBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Open Project", width: "160px", height: "100%"}, {onclick: "openProject"}],
							    deleteProjectBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Delete Project", width: "160px", height: "100%"}, {onclick: "deleteProject"}, {
								binding: ["wm.Binding",{},{}, {
								    wire: ["wm.Wire", {"targetProperty":"disabled", "expression": "${existingProjectList.emptySelection}"}, {}]
								}]
							    }],
							    newProjectBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "New Project", width: "180px", height: "100%"}, {onclick: "newProjectClick"}]
							}]
						}]
					}]
				}],
			    copyright: ["wm.Html", {_classes: {domNode: ["wm_TextAlign_Center"]}, height: "20px", width: "100%", html: "Copyright &copy; 2008-2012 <a target='_blank' href='http://www.wavemaker.com' style='color:0000ff;'>WaveMaker Software</a>, Studio Version: "}, {}]
			}]
		}]
	}]

}
