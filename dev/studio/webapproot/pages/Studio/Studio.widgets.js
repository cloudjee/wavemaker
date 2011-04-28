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
Studio.widgets = {
        themesListVar: ["wm.Variable", {type: "StringData"}],
	studioService: ["wm.JsonRpcService", {service: "studioService", sync: true}, {}],
	servicesService: ["wm.JsonRpcService", {service: "servicesService", sync: true}, {}],
	pagesService: ["wm.JsonRpcService", {service: "pagesService", sync: true}, {}],
	deploymentService: ["wm.JsonRpcService", {service: "deploymentService", sync: true}, {}],
	dataService: ["wm.JsonRpcService", {service: "dataService", sync: true}, {}],
	runtimeService: ["wm.JsonRpcService", {service: "runtimeService", sync: true}, {}],
	webService: ["wm.JsonRpcService", {service: "webService", sync: true}, {}],
	javaService: ["wm.JsonRpcService", {service: "javaService", sync: true}, {}],
	securityConfigService: ["wm.JsonRpcService", {service: "securityConfigService", sync: true}, {}],
	securityService: ["wm.JsonRpcService", {service: "securityService", sync: true}, {}, {}],
	securityServiceJOSSO: ["wm.JsonRpcService", {service: "securityServiceJOSSO", sync: true}, {}, {}],
	//registrationService: ["wm.JsonRpcService", {service: "registrationService", sync: true}, {}],
	UserService: ["wm.JsonRpcService", {service: "UserService", sync: true}, {}],
	resourceManagerService: ["wm.JsonRpcService", {service: "resourceFileService", sync: true}, {}],
        jarListService: ["wm.JsonRpcService", {service: "studioService", sync: false}, {}],
    jarListVariable: ["wm.Variable", {type: "StringData"}, {}],
    jarDownloadDialog: ["wm.PageDialog", {pageName: "HandleRequiredJars", width: "400px", height: "340px", hideControls: true, modal: false, title: "Import Jar File"}],

	//tempData used to show grid on FancyTemplate
	varTemplateData: ["wm.Variable", {"json":"[{name: \"Vestibulum\", dataValue: \"sodales magna mollis purus iaculis sagittis\"},\n{name: \"Lacinia\", dataValue: \" aliquam mauris nulla, consequat\"},\n{name: \"Consequat\", dataValue: \"rhoncus diam metus id arcu\"},\n{name: \"Elementum\", dataValue: \"quis odio sodales ornare quis eu\"},\n{name: \"Sagittis\", dataValue: \"torquent per conubia nostra, per inceptos\"},\n{name: \"Aliquam\", dataValue: \"molestie auctor tortor ac tincidunt\"},\n{name: \"Nullam\", dataValue: \"in orci eros, vitae convallis neque\"},\n{name: \"Mauris\", dataValue: \"luctus adipiscing ligula urna a nisl\"},\n{name: \"Pellentesque\", dataValue: \" ante lectus, mollis ut suscipit id\"}]","type":"EntryData"}, {}],
        silkIconImageList: ["wm.ImageList", {"colCount":39,"height":16,"iconCount":90,"url":"lib/images/silkIcons/silk.png","width":16}, {}],
	paletteImageList: ["wm.ImageList", {"colCount":50,"height":16,"iconCount":50,"url":"images/palette_imagelist.png","width":16}, {}],

	navImageList: ["wm.ImageList", {width: 24, height: 28, colCount: 10, url: "images/navBtns.png"}, {}],
//	canvasToolbarImageList: ["wm.ImageList", {width: 24, height: 24, colCount: 20, url: "images/canvasToolbarBtns.png"}, {}],
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
	canvasToolbarImageList16: ["wm.ImageList", {width: "16", height: "16", colCount: 22, url: "images/canvasToolbarBtns16.png"}, {}],        
    contextualMenu: ["wm.PopupMenu", {"fullStructureStr":"[{\"label\":\"Help\",\"iconClass\":undefined,\"imageList\":null,\"children\":[]}]"},{onclick: "contextualMenuClick"}],
        genericDialog: ["wm.GenericDialog", {}],
    propertiesDialog: ["wm.Dialog", {_classes: {domNode: ["wm-darksnazzy"]}, width: "300px", height: "650px", modal: false, title: "Properties", noEscape: true, useContainerWidget:true, corner: "cr", border: "1", borderColor: "#222"}, {onClose: "toggleInspectorDialog"}],
    paletteDialog: ["wm.Dialog", {width: "250px", height: "650px", modal: false, title: "Palette / Model", noEscape: true, useContainerWidget:true, corner: "cl", border: "1", borderColor: "#222"}, {onClose: "togglePaletteDialog"}],
    startPageDialog: ["wm.PageDialog", {width: "764px", height: "460px", title: "", modal: true, hideControls: true, noEscape: true, pageName: "Start", border: "4", borderColor: "#222222", corner: "cc", }],
    deploymentDialog: ["wm.PageDialog", {width: "900px", height: "680px", title: "Deployment", modal: true, hideControls: true, noEscape: true, pageName: "DeploymentPage", deferLoad: true, border: "2", borderColor: "white"}],
    loginDialog: ["wm.PageDialog", {width: "250px", height: "325px", title: "Login", modal: true, hideControls: true, noEscape: true, pageName: "Login", deferLoad: true}],
    newProjectDialog: ["wm.PageDialog", {width: "487px", height: "460px", title: "New Project", modal: true, hideControls: true, noEscape: false, pageName: "", border: "4", borderColor: "#222222", titlebarBorder: "1"}],
    helpDialog: ["wm.GenericDialog", {"height":"77px","modal":false,"noEscape":false,"title":"Help","userPrompt":"","width":"300px", modal: false,button1Caption: "OK", button1Close: true, corner: "tr"}, {}],
    progressDialog: ["wm.DesignableDialog", {width: "350px", height: "100px", title: "", modal: true, noEscape: false}, {}, {
	progressDialogContainer: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"height":"100%","horizontalAlign":"left","margin":"0","padding":"10","verticalAlign":"top","width":"100%"}, {}, {
	    saveDialogProgress: ["wm.dijit.ProgressBar", {width: "100%", height: "48px", progress: 0}],
	    saveDialogLabel: ["wm.Label", {width: "100%", height: "30px", align: "center"}]
    }]
    }],
	layout: ["wm.Layout", {height: "100%"}, {}, {
	    dialog: ["wm.Dialog", {height: "400px", border: "1", borderColor: "#666E80", _noAnimation: true}, {}],
		
	    navigationBar: ["wm.Panel", {_classes: {domNode: ["wm-darksnazzy"]}, width: "100%", height: "29px", border: "0", layoutKind: "left-to-right"}, {}, {
			navBtnHolder: ["wm.Panel", {width: "100%", border: "0", layoutKind: "left-to-right", imageList: "navImageList", horizontalAlign: "left"}, {}, {
			  navigationMenu: ["wm.DojoMenu", {height: "29px", width: "420px",
						      "fullStructure": 
						      [
							  {"label" :"File",
							 idInPage: "projectPopupBtn",
							 "children": 
							 [
							     {"label":"New Project...",
							       idInPage: "newProjectItem",
							       onClick: "newProjectClick",
							       iconClass: "newProjectItem"},
							     {"label": "Save",
							       idInPage: "saveProjectItem",
							       onClick: "saveProjectClick",
							       iconClass: "Studio_canvasToolbarImageList16_1"},

                                                              {"label": "Open Project...",
							       idInPage: "openProjectItem",
							       onClick: "openProjectClick",
							       iconClass: "openProjectItem"},
                                                              {"label": "Close Project",
							       idInPage: "closeProjectItem",
							       onClick: "closeClick",
							       iconClass: "closeProjectItem"},
                                                              {"label": "Copy Current Project...",
							       idInPage: "copyProjectItem",
							       onClick: "copyProjectClick",
							       iconClass: "copyProjectItem"},
                                                              {"label": "Delete Current Project",
							       idInPage: "deleteProjectItem",
							       onClick: "deleteProjectClick",
							       iconClass: "deleteProjectItem"},
                                                             {"label": "Export Project",
							       idInPage: "exportProjectItem",
							       onClick: "exportClick",
							       iconClass: "exportProjectItem"},
                                                             {"label": "Import Project...",
							       idInPage: "importProjectItem",
							       onClick: "importClick",
							       iconClass: "importProjectItem"},
                                                              {"label": "Deployment...",
							       idInPage: "deployProjectItem",
							       onClick: "deployClick",
							       iconClass: "deployProjectItem"},                                      
                                                              {"label": "Preferences...",
							       idInPage: "preferencesItem",
							       onClick: "projectSettingsClick",
							       iconClass: "preferencesItem"}
							 ]},
							  {"label": "Edit",
								idInPage: "editPopupBtn",
								"children": [
                                                                    {"label": "Cut",
								 idInPage: "cutItem",
								 onClick: "cutClick",
								 iconClass: "cutItem"},
							            {"label": "Copy",
								 idInPage: "copyItem",
								 onClick: "copyClick",
								 iconClass: "copyItem"},
								{"label": "Paste",
								 idInPage: "pasteItem",
								 onClick: "pasteClick",
								 iconClass: "pasteItem"},
							            {"label": "Delete",
								 idInPage: "deleteItem",
								 onClick: "deleteClick",
								 iconClass: "deleteItem"},
							            {"label": "Undo",
								 idInPage: "undoItem",
								 onClick: "undoClick",
								 iconClass: "undoItem"}]},
/*
							   {"label": bundleStudio.M_View,
							    idInPage: "viewPopupBtn",
							    "children":  [
								{"label": bundleStudio.M_Canvas,
								 idInPage: "canvasItem",
								 onClick: "navGotoDesignerClick",
								 iconClass: "canvasItem"},
							        {"label": bundleStudio.M_Source,
								 idInPage: "sourceItem",
								 onClick: "navGotoSourceClick",
								 iconClass: "sourceItem"},
							        {"label": bundleStudio.M_Resources,
								 idInPage: "resourceItem",
								 onClick: "navGotoResourcesClick",
								 iconClass: "resourceItem"},
							        {"label": bundleStudio.M_Outline,
								 idInPage: "outlineItem",
								 onClick: "outlinedClick",
								 iconClass: "outlineItem"}]},
								 */
							  {"label": "Insert", 
							     idInPage: "insertPopupBtn",
							     "children":[
							     ]},
							  {"label": "Page",
							    idInPage: "pagePopupBtn",
							    "children":[
							        {"label": "New...",
								 idInPage: "newPageItem",
								 onClick: "newPageClick",
								 iconClass: "newPageItem"},
							        {"label": "Save As...",
								 idInPage: "saveAsPageItem",
								 onClick: "savePageAsClick",
								 iconClass: "saveAsPageItem"},
							        {"label": "Import Page...",
								 idInPage: "importPageItem",
								 onClick: "importProjectClick",
								 iconClass: "importPageItem"},
								{"label": "Delete",
								 idInPage: "deletePageItem",
								 iconClass: "deleteItem",
								 children: []},
							        {"label": "Set As Home Page",
								 idInPage: "setHomePageItem",
								 //onClick: "makeHomeClick",
								 iconClass: "setHomePageItem",
								 children: []}]},
							    {"label": "Services",
							     idInPage: "servicesPopupBtn",
							     "children":[
							     ]},
/*
							    {"label": bundleStudio.M_Help,
							     idInPage: "helpPopupBtn",
							     "children":[
							         {"label": bundleStudio.M_Tutorials,
								  idInPage: "tutorialDocItem",
								  onClick: "linkButtonClick",
								  openLink: "http://dev.wavemaker.com/wiki/bin/wmdoc/Tutorials",
								  openLinkTitle: "WaveMaker Tutorial"
								 },
							         {"label": bundleStudio.M_Documentation,
								  idInPage: "documentationDocItem",
								  onClick: "linkButtonClick",
								  openLink: "http://dev.wavemaker.com/wiki/bin/wmdoc/",
								  openLinkTitle: "WaveMaker User Guide"
								 },
 							         {"label": bundleStudio.M_Community,
								  idInPage: "communityDocItem",
								  onClick: "linkButtonClick",
								  openLink: "http://dev.wavemaker.com",
								  openLinkTitle: "WaveMaker Community"
								 },
							         {"label": bundleStudio.M_Java_Server_Documentation,
								  idInPage: "javaServerDocItem",
								  onClick: "linkButtonClick",
								  openLink: "javadoc",
								  openLinkTitle: "WaveMaker Java (Server) Documentation"
								 },
							         {"label": bundleStudio.M_JavaScriptClientDocs,
								  idInPage: "clientDocItem",
								  onClick: "linkButtonClick",
								  openLink: "jsdoc",
								  openLinkTitle: "WaveMaker JavaScript (Client) Documentation"
								 }
							     ]
							     }
							     */
						      ]
							  },  {},{}],
			    runPopup: ["wm.PopupMenuButton", {iconWidth: "24px", iconHeight: "24px", iconClass: "studioProjectRun", caption: "Run", width: "90px", height: "29px", border: "0", margin: "0", padding: "0", fullStructure: [{label: "Run", iconClass: "studioProjectRun"},{label: "Test", iconClass: "studioProjectTest"},{label:"Compile", iconClass: "studioProjectCompile"}]},{onclick: "runProjectClick", onchange: "runProjectChange"}],
/*
				navTestBtn: ["wm.ToolButton", {width: "75px", hint: bundleStudio.T_TestTip, caption: "<img src=\"images/runapp_24.png\"/><span style=\"font-weight:bold\"> Test </span>", height: "29px"}, {onclick: "runProjectPopupClick"}],
				navRunBtn: ["wm.ToolButton", {width: "75px", hint: bundleStudio.T_RunTip, caption: "<img src=\"images/runapp_24.png\"/><span style=\"font-weight:bold\"> Run </span>", height: "29px"}, {onclick: "runProjectClick"}],
				*/
			    projectNameLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, width: "150px", margin: "0,0,0,20",autoSizeWidth: true, caption: ""}, {}],
			    navBarSpacer7: ["wm.Spacer", {width: "100%", border: "0"}, {}],
			    userLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, width: "250px", autoSizeWidth: true, margin: "0,0,0,20", caption: ""}, {}],
			    navEditAccountBtn: ["wm.ToolButton", {showing: false, width: "150px", margin: "0,0,0,20", hint: "Edit Account", caption: "<img src=\"images/cloud_user_settings.png\"/><span style=\"font-weight:bold\"> Edit Account </span>", height: "29px"}, {onclick: "editAccountClick"}],
			    navLogoutBtn: ["wm.ToolButton", {showing: false,width: "100px", hint: "Sign Off", caption: "<img src=\"images/cloud_logout.png\"/><span style=\"font-weight:bold\"> Logout </span>", height: "29px"}, {onclick: "logoutClick"}],
			    menuBarHelp: ["wm.Label", {caption: "<span class='StudioHelpIcon'></span>Help", width: "50px", height: "100%"}, {onclick: "menuBarHelpClick"}],
                            trackerImage: ["wm.Picture", {height: "1px", width: "1px"}]
			}],



		}],
	    benchbevel11_11s: ["wm.Bevel", {border: "", bevelSize: "1"}, {}],
		panel1: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}, {
			benchbevel11: ["wm.Bevel", {border: ""}, {}],
			panel2: ["wm.Panel", {height: "48px", width: "200px", border: "0", verticalAlign: "top", horizontalAlign: "left"}, {}, {
/*
				leftToolbarButtons: ["wm.Panel", {height: "29px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", border: 0, padding: "0,4"}, {}, {
					nspcr4: ["wm.Spacer", {width: "2px"}, {}],
					designerCanvasBtn: ["wm.ToolButton", {border: "0", borderColor: "#294473", margin: "0", padding: "0,6", height: "100%", width: "56px", caption: "", hint: bundleStudio.T_CanvasTip}, {onclick: "navGotoDesignerClick"}],
					designerSourceBtn: ["wm.ToolButton", {border: "0", borderColor: "#294473", margin: "0", padding: "0,6", height: "100%", width: "57px", caption: "", hint: bundleStudio.T_SourceTip}, {onclick: "navGotoSourceClick"}]
				}],
				*/
			    left: ["wm.TabLayers", {_classes: {domNode: ["wm-darksnazzy"]}, border: "0", width: "100%", height: "100%", headerHeight: "32px", clientBorder: "3,0,0,0",clientBorderColor: "#959DAB"}, {onchange: "leftTabsChange"}, {
				    mlpal: ["wm.Layer", {_classes: {domNode: ["wm-palette"]}, caption: "Palette"}, {onShow: "resetPaletteSearch"}, {
					paletteSearch: ["wm.Text", {caption: "", width: "100%", height: "27px", placeHolder: "Find Component/Widget", padding: "2,5,2,5", margin: "2,0,2,0", changeOnKey: true, resetButton: true}, {onchange: "paletteSearchChange"}],
					benchbevel6_6: ["wm.Bevel", {border: ""}, {}],
					palette: ["wm.Palette", {height: "100%", border: ""}, {}],
					paletteTips: ["wm.Label", {width: "100%", height: "24px", border: "3,0,0,0", borderColor: "#666E80", backgroundColor: "#424A5A", autoSizeHeight: true,singleLine: false, showing: false}]
					/*
					paletteSplitter: ["wm.Splitter", {border: "0", layout: "bottom"}, {}],
					componentPalette: ["wm.Palette", {height: "300px", border: ""}, {}]*/
				    }],
				    leftObjects: ["wm.Layer", {caption: "Model"}, {onShow: "resetTreeSearch"}, {
					treeSearch: ["wm.Text", {caption: "", width: "100%",  height: "27px", placeHolder: "Find Component/Widget", padding: "2,5,2,5", margin: "2,0,2,0", changeOnKey: true, resetButton: true}, {onchange: "treeSearchChange"}],
					benchbevel5_5: ["wm.Bevel", {border: ""}, {}],
					label12: ["wm.Label", {height: "22px", width: "100%", caption: "Visual Components", border: "", padding: "4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}],
					widgetsTree: ["wm.DraggableTree", {height: "100%", border: "", padding: "3,0,0,0", dropBetweenNodes: true}, {onselect: "treeSelect", onNodeDrop: "onWidgetTreeNodeDrop"}]
				    }],
				    componentModel: ["wm.Layer", {caption: "Services"}, {onShow: "resetCompTreeSearch"}, {
					compTreeSearch: ["wm.Text", {caption: "", width: "100%",  height: "27px", placeHolder: "Find Component/Widget", padding: "2,5,2,5", margin: "2,0,2,0", changeOnKey: true, resetButton: true}, {onchange: "compTreeSearchChange"}],
					benchbevel50_5: ["wm.Bevel", {border: ""}, {}],
					compLabel11: ["wm.Label", {height: "22px", width: "100%", caption: "Services", border: "", padding: "4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}],
					tree: ["wm.Tree", {height: "200px", border: "", padding: "4,0,0,0"}, {onselect: "treeSelect"}],
					splitter222: ["wm.Splitter", {border: "0", layout: "top"}, {}],
					label1222: ["wm.Label", {height: "22px", width: "100%", caption: "Components", border: "", padding: "4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}],

					compTree: ["wm.Tree", {height: "100%", border: "", padding: "4,0,0,0"}, {onselect: "treeSelect"}]
				    }],
/*
				    projects: ["wm.Layer", {caption: bundleStudio.Projects}, {onShow: "resetProjectsSearch"}, {
					ptoolbar: ["wm.Panel", {height: "29px", border: "0", padding: "4,4", layoutKind: "left-to-right", imageList: "smallToolbarImageList", backgroundColor: "#959DAB"}, {}, {
						projectNewProjectButton: ["wm.ToolButton", {width: "24px", imageIndex: 17, hint: bundleStudio.NewProject}, {onclick: "newProjectClick"}],
						projectNewPageButton: ["wm.ToolButton", {width: "24px", imageIndex: 5, hint: bundleStudio.NewPage}, {onclick: "newPageClick"}],
						projectOpenSelectedButton: ["wm.ToolButton", {width: "24px", imageIndex: 18, hint: bundleStudio.OpenSelected}, {onclick: "openSelectedProjectPageClick"}],
						projectDeleteButton: ["wm.ToolButton", {width: "24px", imageIndex: 0, hint: bundleStudio.DeleteSelected}, {onclick: "deleteSelectedProjectPageClick"}],
						projectSetHomePageButton: ["wm.ToolButton", {width: "24px", imageIndex: 2, hint: bundleStudio.SetSelected}, {onclick: "makeSelectedHomeClick"}]
						}],
					projectsSearch: ["wm.Text", {caption: "", width: "100%", placeHolder: "Find Project", padding: "2,5,2,5", changeOnKey: true, resetButton: true}, {onchange: "projectsSearchChange"}],
					benchbevel5_6: ["wm.Bevel", {border: ""}, {}],
					projectsTree: ["wm.Tree", {height: "100%", border: "0"}, {ondblclick: "projectsTreeDblClick", oninitchildren: "projectsTreeInitChildren", onselect: "projectsTreeSelectionChange"}]
				    }]
				*/
				}],
				benchbevel12: ["wm.Bevel", {border: ""}, {}]
			}],
			splitter1: ["wm.Splitter", {border: "0", layout: "left"}, {}],
		    tabs: ["wm.TabLayers", {border: "0", width: "100%", height: "100%", headerHeight: "32px",clientBorder: "3,0,0,0", clientBorderColor: "#959DAB",customClose: "closeServiceParentTab"}, {oncanchange: "tabsCanChange", onchange: "tabsChange"}, {
		    workspace: ["wm.Layer", {caption: "Canvas", layoutKind: "top-to-bottom"}, {}, {
			workspaceInner: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right"}, {}, {
			    main: ["wm.Panel", {height: "100%", width: "100%", border: "", layoutKind: "top-to-bottom", borderColor: "#666E80"}, {}, {
					ribbon: ["wm.Panel", {height: "30px", border: "0", layoutKind: "left-to-right", padding: "0"}, {}, {
						studioToolbarButtons: ["wm.Panel", {height: "100%", width: "100%", border: "", layoutKind: "left-to-right", imageList: "canvasToolbarImageList16"}, {}, {
							/*pagePopupBtn: ["wm.PopupButton", {width: "32px", caption: "<img src=\"images/dropArrow.png\"/>", popupWidth: "150", imageIndex: 14, imageList: "smallToolbarImageList"}, {}, {
								pageBtnItem4: ["wm.Item", {caption: "New Page...", imageIndex: 5}, {onclick: "newPageClick"}],
								pageBtnItem16: ["wm.Item", {caption: "Save", imageIndex: 8}, {onclick: "saveProjectClick"}],
								pageBtnItem6: ["wm.Item", {caption: "Save As...", imageIndex: 7}, {onclick: "savePageAsClick"}],
								pageBtnItem9: ["wm.Item", {caption: "Set As Home Page", imageIndex: 2}, {onclick: "makeHomeClick"}]
							}],*/
							pageSaveBtn: ["wm.ToolButton", {width: "24px", imageIndex: 1, hint: "Save"}, {onclick: "saveProjectClick"}],
							toolbarspacer1: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
							cutBtn: ["wm.ToolButton", {width: "24px", imageIndex: 2, hint: "Cut"}, {onclick: "cutClick"}],
							copyBtn: ["wm.ToolButton", {width: "24px", imageIndex: 3, hint: "Copy"}, {onclick: "copyClick"}],
							pasteBtn: ["wm.ToolButton", {width: "24px", imageIndex: 4, hint: "Paste"}, {onclick: "pasteClick"}],
							deleteBtn: ["wm.ToolButton", {width: "24px", imageIndex: 5, hint: "Delete"}, {onclick: "deleteClick"}],
							undoBtn: ["wm.ToolButton", {width: "24px", imageIndex: 6, hint: "Undo", disabled: true}, {onclick: "undoClick"}],
							toolbarspacer2: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
							/*liveLayoutBtn: ["wm.ToolButton", {width: "24px", imageIndex: 7, hint: "Live Layout"}, {onclick: "refreshLiveData"}],*/
						    outlineBtn: ["wm.ToolButton", {width: "24px", imageIndex: 8, hint: "Toggle Outlined View"}, {onclick: "outlinedClick"}],
						    pageSelect: ["wm.SelectMenu", {caption: "Open Page", margin:"4,0,4,20", width: "250px", height: "24px", captionSize: "70px", displayField: "dataValue", dataField: "dataValue"},{onchange: "pageSelectChanged"},{
							binding: ["wm.Binding",{},{}, {
							    wire: ["wm.Wire", {"source":"app.pagesListVar","targetProperty":"dataSet"}, {}]
							}]
						    }]
						}]
					}],
			    bench: ["wm.Panel", {width: "100%", height: "100%", border: "1, 0, 0, 0", backgroundColor: "silver", borderColor: "#666E80"}, {}, {
							designer: ["wm.Designer", {height: "100%", width: "100%", backgroundColor: "white", borderColor: "black", border: ""}, {onselect: "designerSelect", onmove: "designerMove"}],
							benchbevel: ["wm.Bevel", {border: ""}, {}],
						    statusPanel: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "24px", border: "1,0,0,0", borderColor: "#666E80", backgroundColor: "#424A5A", horizontalAlign: "left", verticalAlign: "top"},{}, {
							statusBarLabel: ["wm.Label", {width: "100%", height: "100%", caption: ""}],
							status: ["wm.JsonStatus", {iconWidth: "26", height: "100%", border: "0, 0, 0, 1", borderColor: "#666E80", width: "300px"}, {}]
						    }]
						}]

					}],
			splitter3b: ["wm.Splitter", {border: ""}, {}],
						PIPanel: ["wm.Panel", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "250px", border: "0", padding: "0", layoutKind: "left-to-right"}, {}, {
						    PIContents: ["wm.Panel", {width: "100%", height: "100%", border: "0"}, {}, {
									propInsContainer: ["wm.Panel", {height: "100%", border: "0"}, {}, {
										PILabelContainer: ["wm.Panel", {height: "25px", border: "0"}, {}, {
											insTop: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}, {
												inspected: ["wm.Label", {height: "100%", width: "100%", caption: "", border: "", padding: "2"}, {}, {
													format: ["wm.DataFormatter", {}, {}]
												}],
											    inspectorDialogToggle: ["wm.ToolButton", {width: "20px", height: "100%", padding: "0", margin: "5,0,0,0"},{onclick: "toggleInspectorDialog"}]
											}]
										}],
										PITopBorder: ["wm.Panel", {height: "4px", border: "0", layoutKind: "left-to-right"}, {}, {
											PITopBorderl: ["wm.Panel", {width: "4px", border: "0"}, {}],
											PITopBorderm: ["wm.Panel", {width: "100%", border: "0"}, {}],
											PITopBorderr: ["wm.Panel", {width: "4px", border: "0"}, {}]
										}],
										PIContainer: ["wm.Panel", {height: "100%", border: "0", layoutKind: "left-to-right"}, {}, {
											propsTabs: ["wm.Layers", {border: "0", width: "100%", height: "100%"}, {}, {
												propsLayer: ["wm.Layer", {}, {}, {
													inspector: ["wm.ComponentInspectorPanel", {border: "0", height: "100%", width: "100%"}, {}, {

													}]
												}]
											}]
										}],
										PIBotBorder: ["wm.Panel", {height: "4px", border: "0", layoutKind: "left-to-right"}, {}, {
											PIBotBorderl: ["wm.Panel", {width: "4px", border: "0"}, {}],
											PIBotBorderm: ["wm.Panel", {width: "100%", border: "0"}, {}],
											PIBotBorderr: ["wm.Panel", {width: "4px", border: "0"}, {}]
										}]
									}]
								}]
							}],

					benchbevel4: ["wm.Bevel", {}, {}]
				}]
		    }],
		sourceTab: ["wm.Layer", {_classes: {domNode: ["wm-darksnazzy"]}, caption: "Source"}, {}, {
				    /*
					sourceRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
						sourcePageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveProjectClick"}],
						sourceToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
						sourceLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
					}],*/
					sourceTabs: ["wm.TabLayers", {border: "0", width: "100%", height: "100%",clientBorder: "4,0,0,0", clientBorderColor: "#959DAB"}, {onchange: "sourceTabsChange", oncanchange: "sourceTabsCanChange"}, {
					    scriptLayer: ["wm.Layer", {caption: "Script"}, {onShow: "editArea.focus"}, {
						scriptRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#000000"}, {}, {
						    scriptPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveScriptClick"}],
						    scriptPageFindBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findScriptClick"}],
						    scriptPageImportBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Import JS Library", imageIndex: 25}, {onclick: "importJavascriptLibrary"}],
						    scriptPageRefreshBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Refresh from Server", imageIndex: 27}, {onclick: "refreshScriptClick"}],
						    scriptPageFormatBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Reformat Code", imageIndex: 29}, {onclick: "formatScriptClick"}],
						    scriptPageWordWrapBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Toggle Line Wrapping", imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapScriptClick"}],
						    /*scriptPageCompileBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Validation", imageIndex: 28}, {onclick: "validateScriptClick"}],*/
						    scriptPageCompletionsBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Auto Completion", imageIndex: 7, imageList: "canvasToolbarImageList16"}, {onclick: "listCompletions"}],
						    scriptPageHelpBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Help", imageIndex: 26}, {onclick: "showEditorHelp"}],
						    scriptToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}]/*,
						    scriptPageCompileChkBtn: ["wm.Checkbox", {caption: "Validate on Save", width: "120px"}, {onchange: "validateScriptCheckboxChange"}]*/
						}],
						editArea: ["wm.AceEditor", {width: "100%", height: "100%"}, {onCtrlKey: "scriptEditorCtrlKey", onKeyDown: "setEditAreaDirty"}]
					    }],
					    cssLayer: ["wm.Layer", {caption: "CSS"}, {onShow: "cssEditArea.focus"}, {
						cssRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
						    cssPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveCssClick"}],
						    cssPageFindBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findCssClick"}],
						    cssPageImportBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Import CSS Resource", imageIndex: 25}, {onclick: "importCssLibrary"}],
						    cssPageWordWrapBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Toggle Line Wrapping", imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapCssClick"}],
						    cssPageHelpBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Help", imageIndex: 26}, {onclick: "showCssEditorHelp"}],
						    cssToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
						    cssLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
						}],
						cssPageLabel: ["wm.Label", {caption: "Page CSS", height: "18px", border: 0}, {}, {
						    format: ["wm.DataFormatter", {}, {}]
						}],
						cssEditArea: ["wm.AceEditor", {width: "100%", height: "100%", syntax: "css"}, {onCtrlKey: "cssEditorCtrlKey", onKeyDown: "setEditAreaDirty"}],
						cssSplitter: ["wm.Splitter", {layout: "bottom"}, {}],
						cssInnerPanel: ["wm.Panel", {width: "100%", height: "300px", layoutKind: "top-to-bottom"},{}, {
						cssAppLabel: ["wm.Label", {caption: "Application CSS", height: "18px", border: 0}, {}, {
						    format: ["wm.DataFormatter", {}, {}]
						}],
						appCssEditArea: ["wm.AceEditor", {width: "100%", height: "100%", syntax: "css"}, {onCtrlKey: "cssEditorCtrlKey", onKeyDown: "setEditAreaDirty"}]
					    }]
                                        }],
						markupLayer: ["wm.Layer", {caption: "Markup"}, {onShow: "markupEditArea.focus"}, {
							markupRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
							    markupPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveMarkupClick"}],
							    markupPageFindBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findMarkupClick"}],
							    markupPageWordWrapBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Toggle Line Wrapping", imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapMarkupClick"}],
							    markupPageHelpBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Help", imageIndex: 26}, {onclick: "showMarkupEditorHelp"}],
							    markupToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
							    markupLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
							}],
							markupEditArea: ["wm.AceEditor", {width: "100%", height: "100%", syntax: "html"}, {onCtrlKey: "markupEditorCtrlKey", onKeyDown: "setEditAreaDirty"}]
						}],
					    widgets: ["wm.Layer", {caption: "Widgets"}, {}, {
							widgetsHtml: ["wm.Html", {width: "100%", height: "100%", border: 0, padding: "4, 0, 0, 4"}, {}]
						}],
						appsource: ["wm.Layer", {caption: "Application"}, {onShow: "appsourceEditor.focus"}, {
						    appsrcRibbon: ["wm.Panel", {height: "29px", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#000000"}, {}, {
							appsrcPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveAppSrcClick"}],
							appsrcPageFindBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findAppScriptClick"}],
							appsrcPageImportBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Import JS Resource", imageIndex: 25}, {onclick: "importAppJavascriptLibrary"}],
						    appsrcPageFormatBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Reformat Code", imageIndex: 29}, {onclick: "formatAppScriptClick"}],
						    appsrcPageWordWrapBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Toggle Line Wrapping", imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapAppScriptClick"}],
							/*appsrcPageCompileBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Validation", imageIndex: 28,iconWidth: "20px", iconHeight: "20px"}, {onclick: "validateAppScriptClick"}],*/
						    appsrcPageHelpBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Help", imageIndex: 26}, {onclick: "showAppScriptEditorHelp"}],
						    scriptToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}]/*,
							appsrcPageCompileChkBtn: ["wm.Checkbox", {caption: "Validate on Save", width: "120px"}, {onchange: "validateScriptCheckboxChange"}]*/

						}],

						        appsourceHtml: ["wm.Html", {width: "100%", height: "300px", border: 0, padding: "4, 0, 0, 4"}, {}],
						        appsourceSplitter: ["wm.Splitter", {layout: "bottom"}, {}],
						        appsourceEditor: ["wm.AceEditor", {width: "100%", height: "100%"}, {onCtrlKey: "appScriptEditorCtrlKey", onKeyDown: "setEditAreaDirty"}]

						}],
                                            themeLayer: ["wm.Layer", {_classes: {domNode: ["wm-darksnazzy"]}, caption: "Themes", width: "100%", height: "100%"}, {}, {
						themesRibbon: ["wm.Panel", {height: "29px", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
						    themesPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveThemeClick"}],
						    themesPageAddBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "New Theme...", imageIndex: 25}, {onclick: "addNewThemeClick"}],
						    themesPageCopyBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Copy Theme...", imageIndex: 1}, {onclick: "copyThemeClick"}],
						    themesPageDeleteBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Delete Theme", imageIndex: 0}, {onclick: "deleteThemeClick"}],
						    themesPageRevertBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Revert Theme", imageIndex: 6, imageList: "canvasToolbarImageList16"}, {onclick: "revertThemeClick"}]
						}],
                                                themesPage: ["wm.PageContainer", {deferLoad: true, loadParentFirst: true, 
                                                                                  pageName: "ThemeDesigner"}]
                                            }],

					    appDocs: ["wm.Layer", {caption: "Documentation"}, {}, {
						appdocsRibbon: ["wm.Panel", {height: "29px", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#000000"}, {}, {
							appdocsPrintBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Print", imageIndex: 4}, {onclick: "printAppDocsClick"}]
						}],

						        appDocViewer: ["wm.Html", {width: "100%", height: "100%"}]
						}],

					    logs: ["wm.Layer", {caption: "Server Logs"}, {}, {
						        logViewer: ["wm.PageContainer", {deferLoad: true, pageName: "LogViewer",  width: "100%", height: "100%"}]
						}],
					    resourcesTab: ["wm.Layer", {caption: "Resources"}, {onShow: "loadResourcesTab"}, {
						resourcesPage: ["wm.PageContainer", {deferLoad: true, pageName: "ResourceManager", height: "100%", width: "100%"}, {}]
					    }]
/*
						diagnosticsTab: ["wm.Layer", {caption: bundleStudio.R_Diagnostics}, {}, {
							diagnosticsPane: ["wm.PageContainer", {loadParentFirst: true, pageName: "Diagnostics", width: "100%", height: "100%"}, {}]
						}]
						*/
					}]
		}],
			JavaEditorTab: ["wm.Layer", {caption: "Java", layoutKind: "top-to-bottom", showing: false, closable: true}, {}, {
			    JavaEditorSubTab: ["wm.TabLayers", {border: "0", width: "100%", height: "100%",conditionalTabButtons:true, clientBorder: "2,0,0,0", clientBorderColor: "#959DAB", customClose: "closeServiceTab"}, {onchange: "sourceTabsChange", oncanchange: "sourceTabsCanChange"}, {}]
			}],
			databaseTab: ["wm.Layer", {caption: "Database", layoutKind: "top-to-bottom", showing: false, closable: true}, {}, {
			    databaseSubTab: ["wm.TabLayers", {border: "0", width: "100%", height: "100%",conditionalTabButtons:true, clientBorder: "2,0,0,0", clientBorderColor: "#959DAB", customClose: "closeServiceTab"}, {onchange: "sourceTabsChange", oncanchange: "sourceTabsCanChange"}, {}]
			}],
			webServiceTab: ["wm.Layer", {caption: "WebServices", layoutKind: "top-to-bottom", showing: false, closable: true}, {}, {
			    webServiceSubTab: ["wm.TabLayers", {border: "0", width: "100%", height: "100%",conditionalTabButtons:true, clientBorder: "2,0,0,0", clientBorderColor: "#959DAB", customClose: "closeServiceTab"}, {onchange: "sourceTabsChange", oncanchange: "sourceTabsCanChange"}, {}]
			}],
			securityTab: ["wm.Layer", {caption: "Security", layoutKind: "top-to-bottom", showing: false, closable: true}, {}, {
			    securitySubTab: ["wm.TabLayers", {border: "0", width: "100%", height: "100%",conditionalTabButtons:true, clientBorder: "2,0,0,0", clientBorderColor: "#959DAB", customClose: "closeServiceTab"}, {onchange: "sourceTabsChange", oncanchange: "sourceTabsCanChange"}, {}]
			}]



/*,
				servicesTab: ["wm.Layer", {caption: "Services", layoutKind: "left-to-right"}, {}, {
					servicesPane: ["wm.PageContainer", {pageName: "Services", deferLoad: true, border: "0", width: "100%", height: "100%"}, {}]
				}],
				javaServiceEditor: ["wm.Layer", {caption: "Java Service Editor", layoutKind: "left-to-right"}, {}, {
					javaServicePage: ["wm.PageContainer", {pageName: "JavaEditor", deferLoad: true, border: "0", width: "100%", height: "100%"}, {}]
				}],
				dataObjectsTab: ["wm.Layer", {caption: "Data Model"}, {}, {
					dataObjectsPane: ["wm.PageContainer", {pageName: "DataObjectsEditor", deferLoad: true, border: "0", width: "100%", height: "100%"}, {}]
				}],
				liveViewsEditor: ["wm.Layer", {caption: "Live Views"}, {}, {
					liveViewPageContainer: ["wm.PageContainer", {pageName: "LiveViewEditor", deferLoad: true, border: "0", width: "100%", height: "100%"}, {}]
				}],
				hqlQueryEditor: ["wm.Layer", {caption: "HQL Query Editor"}, {}, {
					hqlQueryPage: ["wm.PageContainer", {pageName: "QueryEditor", deferLoad: true, border: "0", width: "100%", height: "100%"}, {}]
				}],
				securityTab: ["wm.Layer", {caption: "Security"}, {}, {
					securityPane: ["wm.PageContainer", {pageName: "Security", deferLoad: true, border: "0", width: "100%", height: "100%"}, {}]
				}],
				apiDocTab: ["wm.Layer", {caption: "IDE"}, {}, {
					apiRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right"}, {}, {
						apiToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
						apiLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
					}],
					apiTabs: ["wm.TabLayers", {border: "0", width: "100%", height: "100%"}, {}, {
						apiTab: ["wm.Layer", {caption: "JavaScript (Client) Reference"}, {}, {
							javadocFrame: ["wm.IFrame", {source: "/wavemaker/jsdoc/", width: "100%", height: "100%"}, {}]
						}],
						javadocTab: ["wm.Layer", {caption: "Java (Server) Reference"}, {}, {
							javadocFrame1: ["wm.IFrame", {source: "/wavemaker/javadoc/", width: "100%", height: "100%"}, {}]
						}],
						diagnosticsTab: ["wm.Layer", {caption: "Diagnostics"}, {}, {
							//diagnosticsPane: ["wm.PageContainer", {pageName: "Diagnostics", width: "100%", height: "100%"}, {}]
						}]
					}]
				}]
				*/
			}]
		}],
		console: ["wm.Box", {height: "96", showing: false}, {}],
		markup: ["wm.Html", {height: "0", showing: false}, {}]
		/*,
		footer: ["wm.Html", {height: "18px", html: "Copyright &copy; 2008 <a target=\"_blank\" href=\"http://www.wavemaker.com\" style=\"color:#b4d5f0;\">WaveMaker Software</a>, Studio Version: wmVersionNumber", showing: false}, {}]*/
	}]
}
