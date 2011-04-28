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
JavaEditor.widgets = {
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
	layoutBox1: ["wm.Layout", {height: "100%", imageList: "smallToolbarImageList"}, {}, {
		editorToolbar: ["wm.Panel", {border: "0", layoutKind: "left-to-right", height: "29px"}, {}, {
			toolbarBtnHolder: ["wm.Panel", {border: "0", padding: "0,4", width: "100%", layoutKind: "left-to-right", height: "100%"}, {}, {
				javaServiceSaveButton: ["wm.ToolButton", {imageIndex: 8, width: "24px", height: "100%",  hint: "Save Java service", border: "0", margin: "0"}, {onclick: "javaServiceSaveButtonClick"}],
				toolbarspacer1: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
				newJavaBtn: ["wm.ToolButton", {imageIndex: 25, width: "24px", height: "100%", hint: "New Java Service", border: "0", margin: "0"}, {onclick: "newJavaBtnClick"}],
				delJavaBtn: ["wm.ToolButton", {imageIndex: 0, width: "24px", height: "100%", hint: "Delete Java Service", border: "0", margin: "0"}, {onclick: "delJavaBtnClick"}],
				toolbarspacer2: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
				openCmpOutBtn: ["wm.ToolButton", {imageIndex: 22, width: "24px", height: "100%", hint: "Open Compiler Output", border: "0", margin: "0"}, {onclick: "openCmpOutBtnClick"}],
				closeCmpOutBtn: ["wm.ToolButton", {imageIndex: 23, width: "24px", height: "100%",  hint: "Close Compiler Output", border: "0", margin: "0"}, {onclick: "closeCmpOutBtnClick"}],
			    javaServiceRefreshButton: ["wm.ToolButton", {imageIndex: 27, width: "24px", height: "100%",hint: "Refresh Java service from disk", border: "0", margin: "0"}, {onclick: "javaServiceRefreshButtonClick"}],
			    toolbarspacer3: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
			    findBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findClick"}],
			    formatBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Reformat Code", imageIndex: 29}, {onclick: "formatClick"}],
			    wordWrapBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Toggle line wrapping", imageIndex: 15,imageList: "studio.canvasToolbarImageList16"}, {onclick: "toggleWrapClick"}],
			    pageHelpBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Help", imageIndex: 26}, {onclick: "showEditorHelp"}],

			}],
			logoBtmHolder: ["wm.Panel", {border: "0", width: "221px"}, {}]
		}],
		editorContainer: ["wm.Panel", {border: "0", width: "100%", layoutKind: "left-to-right", height: "100%"}, {}, {
			panel6: ["wm.Panel", {border: "0", width: "100%", height: "100%"}, {}, {
				javaServicePanel: ["wm.Panel", {border: "0", width: "100%", height: "100%"}, {}, {
				    javaCodeEditor: ["wm.AceEditor", {height: "100%", width: "100%", border: "0", syntax: "java"}, {onCtrlKey: "onCtrlKey", onKeyDown: "setDirty"}],
					javaCodeSplitter: ["wm.Splitter", {layout: "bottom", border: "0"}, {}],
				    logTabs: ["wm.TabLayers", {width: "100%", height: "200px",clientBorder: "2,0,0,0", clientBorderColor: "#959DAB"}, {onchange: "changeLogTab"}, {
					    complierTab: ["wm.Layer", {caption: "Compiler Messages"}, {}, {
						    /*
						javaCompilerOutputPanel: ["wm.Panel", {border: "0", height: "150px"}, {}, {
						    javaServiceOutputLabel: ["wm.Label", {caption: "Compiler Output", width: "100%", height: "30px", border: "0"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						    }],
							    */
						    javaCompilerOutputEditor: ["wm.TextArea", {height: "100%", width: "100%", readonly: true, readOnly: true, border: "0", scrollY: true}, {}]
						}],
					    serverTab: ["wm.Layer", {caption: "Server Logs"}, {onclick: "updateLogs"}, {
						logViewer: ["wm.PageContainer", {pageName: "LogViewer",  width: "100%", height: "100%"}]
					    }]
					}]
							
				}]
			}],
			splitter1: ["wm.Splitter", {layout: "right"}, {}],
			panel5: ["wm.Panel", {_classes: {domNode: ["wm-darksnazzy"]}, border: "0", width: "220px"}, {}, {
				typeTree: ["wm.Tree", {height: "100%", border: "0"}, {}],
				tabLayers1: ["wm.TabLayers", {border: "0", showing: false, width: "100%", height: "100%"}, {}, {
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
