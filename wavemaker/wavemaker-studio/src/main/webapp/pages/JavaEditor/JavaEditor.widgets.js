/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

JavaEditor.widgets = {
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
	layoutBox1: ["wm.Layout", {height: "100%", imageList: "smallToolbarImageList"}, {}, {
	    editorToolbar: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, border: "0,0,1,0", borderColor: "#959DAB", layoutKind: "left-to-right", height: "29px"}, {}, {
		toolbarBtnHolder: ["wm.Panel", {border: "0", padding: "0,4", width: "100%", layoutKind: "left-to-right", height: "100%", verticalAlign: "middle", horizontalAlign: "left"}, {}, {
				javaServiceSaveButton: ["wm.studio.ToolbarButton", {imageIndex: 8,   hint: "Save Java service"}, {onclick: "javaServiceSaveButtonClick"}],
				toolbarspacer1: ["wm.studio.ToolbarSpacer", {}, {}],
				newJavaBtn: ["wm.studio.ToolbarButton", {imageIndex: 25, hint: "New Java Service"}, {onclick: "newJavaBtnClick"}],
				delJavaBtn: ["wm.studio.ToolbarButton", {imageIndex: 0,  hint: "Delete Java Service"}, {onclick: "delJavaBtnClick"}],
				toolbarspacer2: ["wm.studio.ToolbarSpacer", {}, {}],
				openCmpOutBtn: ["wm.studio.ToolbarButton", {imageIndex: 22,  hint: "Open Compiler Output"}, {onclick: "openCmpOutBtnClick"}],
				closeCmpOutBtn: ["wm.studio.ToolbarButton", {imageIndex: 23,   hint: "Close Compiler Output"}, {onclick: "closeCmpOutBtnClick"}],
			    javaServiceRefreshButton: ["wm.studio.ToolbarButton", {imageIndex: 27, hint: "Refresh Java service from disk"}, {onclick: "javaServiceRefreshButtonClick"}],
			    toolbarspacer3: ["wm.studio.ToolbarSpacer", {}, {}],
		        findBtn: ["wm.studio.ToolbarButton", {hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findClick"}],
			    formatBtn: ["wm.studio.ToolbarButton", {hint: "Reformat Code", imageIndex: 29}, {onclick: "formatClick"}],
			    wordWrapBtn: ["wm.studio.ToolbarButton", {_classes: {domNode: ["ToggleWordWrap", "StudioToolbarButton"]}, hint: "Toggle line wrapping", imageIndex: 15,imageList: "studio.canvasToolbarImageList16"}, {onclick: "toggleWrapClick"}],
			    pageHelpBtn: ["wm.studio.ToolbarButton", { hint: "Help", imageIndex: 26}, {onclick: "showEditorHelp"}]
			}],
			javaEditAreaZoomWarningLabel: ["wm.Label", {_classes: {domNode:["StudioLabel","AceEditorZoomWarning"]},showing:false,width: "100px", height: "100%", caption: "Zoomed <div class='StudioWarningIcon'/>", hint: "<div class='StudioWarningIcon'></div>Zooming out or in your browser may cause the code editor selection to work improperly; Restoring your browser to its standard zoom level will fix this"}],
			logoBtmHolder: ["wm.Panel", {border: "0", width: "221px"}, {}]
		}],
		editorContainer: ["wm.Panel", {border: "0", width: "100%", layoutKind: "left-to-right", height: "100%"}, {}, {
			panel6: ["wm.Panel", {border: "0", width: "100%", height: "100%"}, {}, {
				javaServicePanel: ["wm.Panel", {border: "0", width: "100%", height: "100%"}, {}, {
				    javaCodeEditor: ["wm.AceEditor", {height: "100%", width: "100%", border: "0", syntax: "java"}, {onCtrlKey: "onCtrlKey", onChange: "setDirty"}],
					javaCodeSplitter: ["wm.Splitter", {layout: "bottom", border: "0"}, {}],
				    logTabs: ["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs", "StudioDarkLayers"]}, width: "100%", height: "200px",clientBorder: "1,0,0,0", clientBorderColor: "#959DAB", conditionalTabButtons:true}, {onchange: "changeLogTab"}, {
					    complierTab: ["wm.Layer", {caption: "Compiler Messages"}, {}, {
						    /*
						javaCompilerOutputPanel: ["wm.Panel", {border: "0", height: "150px"}, {}, {
						    javaServiceOutputLabel: ["wm.Label", {caption: "Compiler Output", width: "100%", height: "30px", border: "0"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						    }],
							    */
						    javaCompilerOutputEditor: ["wm.Html", {height: "100%", width: "100%", readonly: true, readOnly: true, border: "0", scrollY: true}, {}]
						}],
					    serverTab: ["wm.Layer", {caption: "Server Logs"}, {onclick: "updateLogs"}, {
						logViewer: ["wm.PageContainer", {pageName: "LogViewer",  width: "100%", height: "100%"}]
					    }]
					}]

				}]
			}],
			splitter1: ["wm.Splitter", {layout: "right"}, {}],
			panel5: ["wm.Panel", {_classes: {domNode: ["wm-darksnazzy"]}, border: "0", width: "220px"}, {}, {
                helpLink: ["wm.Label", {width: "100%", height: "40px", align: "right", caption: "Java Services Help", singleLine: false, padding: "4,20,4,4",
                                        link: "#",
                                        _classes: {domNode: ["StudioHelpIcon"]}}, {onclick: "openHelp"}],
				typeTree: ["wm.Tree", {height: "100%", border: "0"}, {}],
				tabLayers1: ["wm.studio.TabLayers", {border: "0", showing: false, width: "100%", height: "100%"}, {}, {
					typeRefLayer: ["wm.Layer", {caption: "Type Reference"}, {}],
					javaListLayer: ["wm.Layer", {caption: "Java Services"}, {}, {
						tree: ["wm.ServicesTree", {height: "584px", border: "0", width: "224px"}, {onselect: "treeSelect"}]
					}]
				}]
			}]
		}],
		benchbevel4: ["wm.Bevel", {border: "0"}, {}]
	}]
}
