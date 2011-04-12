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
Start.widgets = {
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "center", backgroundColor: "#ffffff"}, {}, {
/*
		editorToolbar: ["wm.Panel", {height: "29px", width: "100%", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
			logoBtmHolder: ["wm.Panel", {height: "100%", width: "221px"}, {}]
		}],
		*/
		panel5: ["wm.Panel", {height: "100%", width: "100%", verticalAlign: "middle", horizontalAlign: "center"}, {}, {
			panel1: ["wm.Panel", {height: "450px", width: "750px", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left"}, {}, {
				tabLayers1: ["wm.TabLayers", {margin: "4,8,8,8"}, {}, {
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
								iframe: ["wm.IFrame", {source: "/wavemaker/studioService.download?method=getContent&inUrl=http://wavemaker.com/splash", width: "100%", height: "100%", border: "1", borderColor: "#000F19", margin: "0,8,10,0", showing: false}]
								}]
							}]
					}],
				    layer2: ["wm.Layer", {caption: "Projects", horizontalAlign: "left", verticalAlign: "top", padding: "8"}, {onShow: "projectsTabOnShow"}, {
					projectSearch: ["wm.Text", {width: "100%", height: "24px", resetButton: true, placeHolder: "Search by Project Name", caption: "", changeOnKey: true, emptyValue: "emptyString"}, {onchange: "filterProjectList"}],
						panel8: ["wm.Panel", {height: "100%", width: "100%", verticalAlign: "top", horizontalAlign: "left"}, {}, {
							projlist: ["wm.Panel", {height: "100%", width: "100%", layoutKind: "left-to-right", padding: "5,10,10,10"}, {}, {
								existingProjectList: ["wm.List", {width: "100%", border: "0"}, {onselect: "projectListSelect", ondeselect: "projectListDeselect", ondblclick: "openProject"}]
							}],
							panel9: ["wm.Panel", {height: "34px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "center"}, {}, {
							    openProjectBtn: ["wm.Button", {caption: "Open Project", width: "160px", height: "100%"}, {onclick: "openProject"}],
							    deleteProjectBtn: ["wm.Button", {caption: "Delete Project", width: "160px", height: "100%"}, {onclick: "deleteProject"}, {
								binding: ["wm.Binding",{},{}, {
								    wire: ["wm.Wire", {"targetProperty":"disabled", "expression": "${existingProjectList.emptySelection}"}, {}]
								}]
							    }],
							    newProjectBtn: ["wm.Button", {caption: "New Project", width: "180px", height: "100%"}, {onclick: "newProjectClick"}]
							}]
						}]
					}]
				}],
		content1: ["wm.Content", {_classes: {domNode: ["wm_TextAlign_Center"]}, height: "20px", width: "100%", content: "_studio_footer"}, {}]
			}]
		}]
	}]

}
