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
	//tempData used to show grid on FancyTemplate
	varTemplateData: ["wm.Variable", {"json":"[{name: \"Vestibulum\", dataValue: \"sodales magna mollis purus iaculis sagittis\"},\n{name: \"Lacinia\", dataValue: \" aliquam mauris nulla, consequat\"},\n{name: \"Consequat\", dataValue: \"rhoncus diam metus id arcu\"},\n{name: \"Elementum\", dataValue: \"quis odio sodales ornare quis eu\"},\n{name: \"Sagittis\", dataValue: \"torquent per conubia nostra, per inceptos\"},\n{name: \"Aliquam\", dataValue: \"molestie auctor tortor ac tincidunt\"},\n{name: \"Nullam\", dataValue: \"in orci eros, vitae convallis neque\"},\n{name: \"Mauris\", dataValue: \"luctus adipiscing ligula urna a nisl\"},\n{name: \"Pellentesque\", dataValue: \" ante lectus, mollis ut suscipit id\"}]","type":"EntryData"}, {}],
        silkIconImageList: ["wm.ImageList", {"colCount":35,"height":20,"iconCount":196,"url":"lib/images/silkIcons/silk.png","width":18}, {}],
	navImageList: ["wm.ImageList", {width: 24, height: 28, colCount: 10, url: "images/navBtns.png"}, {}],
//	canvasToolbarImageList: ["wm.ImageList", {width: 24, height: 24, colCount: 20, url: "images/canvasToolbarBtns.png"}, {}],
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
	canvasToolbarImageList16: ["wm.ImageList", {width: "16", height: "16", colCount: 22, url: "images/canvasToolbarBtns16.png"}, {}],        
    contextualMenu: ["wm.PopupMenu", {"fullStructureStr":"[{\"label\":\"Help\",\"iconClass\":undefined,\"imageList\":null,\"children\":[]}]"},{onclick: "contextualMenuClick"}],
        genericDialog: ["wm.GenericDialog", {}],
    newProjectDialog: ["wm.PageDialog", {width: "487px", height: "460px", title: "New Project", modal: true, hideControls: true, noEscape: false, pageName: "", border: "1", borderColor: "black", titlebarBorder: "0"}],
    helpDialog: ["wm.GenericDialog", {"height":"77px","modal":false,"noEscape":false,"title":"Help","userPrompt":"","width":"300px", modal: false,button1Caption: "OK", button1Close: true, corner: "tr"}, {}],
    pageManagerDialog: ["wm.PageDialog", {width: "250px", height: "400px", title: "Page Manager", modal: false, hideControls: true, noEscape: false, pageName: "PageManager", deferLoad: true}],
	layout: ["wm.Layout", {height: "100%"}, {}, {
	    dialog: ["wm.Dialog", {height: "400px", border: "1", borderColor: "#666E80", _noAnimation: true}, {}],
		
		navigationBar: ["wm.Panel", {_classes: {domNode: ["wm-darksnazzy"]}, height: "29px", border: "0", layoutKind: "left-to-right"}, {}, {
			navBtnHolder: ["wm.Panel", {width: "100%", border: "0", layoutKind: "left-to-right", imageList: "navImageList", horizontalAlign: "left"}, {}, {
			  navigationMenu: ["wm.DojoMenu", {height: "29px", width: "420px",
						      "fullStructure": 
						      [
							{"label" :bundleStudio.M_File,
							 idInPage: "projectPopupBtn",
							 "children": 
							 [
							      {"label":bundleStudio.M_NewProject,
							       idInPage: "newProjectItem",
							       onClick: "newProjectClick",
							       iconClass: "newProjectItem"},
                                                              {"label": bundleStudio.M_OpenProject,
							       idInPage: "openProjectItem",
							       onClick: "openProjectClick",
							       iconClass: "openProjectItem"},
                                                              {"label": bundleStudio.M_CloseProject,
							       idInPage: "closeProjectItem",
							       onClick: "closeClick",
							       iconClass: "closeProjectItem"},
                                                              {"label": bundleStudio.M_CopyCurrentProject,
							       idInPage: "copyProjectItem",
							       onClick: "copyProjectClick",
							       iconClass: "copyProjectItem"},
                                                              {"label": bundleStudio.M_DeleteCurrentProject,
							       idInPage: "deleteProjectItem",
							       onClick: "deleteProjectClick",
							       iconClass: "deleteProjectItem"},
                                                              {"label": bundleStudio.M_ExportProject,
							       idInPage: "exportProjectItem",
							       onClick: "exportClick",
							       iconClass: "exportProjectItem"},
                                                              {"label": bundleStudio.M_ImportProject,
							       idInPage: "importProjectItem",
							       onClick: "importClick",
							       iconClass: "importProjectItem"},
                                                              {"label": bundleStudio.M_Deployment,
							       idInPage: "deployProjectItem",
							       onClick: "deployClick",
							       iconClass: "deployProjectItem"},                                      
                                                              {"label": bundleStudio.M_Preferences,
							       idInPage: "preferencesItem",
							       onClick: "projectSettingsClick",
							       iconClass: "preferencesItem"}
							 ]},
								{"label": bundleStudio.M_Edit,
								idInPage: "editPopupBtn",
								"children": [
                                                                {"label": bundleStudio.M_Cut,
								 idInPage: "cutItem",
								 onClick: "cutClick",
								 iconClass: "cutItem"},
							        {"label": bundleStudio.M_Copy,
								 idInPage: "copyItem",
								 onClick: "copyClick",
								 iconClass: "copyItem"},
								{"label": bundleStudio.M_Paste,
								 idInPage: "pasteItem",
								 onClick: "pasteClick",
								 iconClass: "pasteItem"},
							        {"label": bundleStudio.M_Delete,
								 idInPage: "deleteItem",
								 onClick: "deleteClick",
								 iconClass: "deleteItem"},
							        {"label": bundleStudio.M_Undo,
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
							    {"label": bundleStudio.M_Insert,
							     idInPage: "insertPopupBtn",
							     "children":[
							     ]},
							   {"label": bundleStudio.M_Page,
							    idInPage: "pagePopupBtn",
							    "children":[
							        {"label": bundleStudio.M_New,
								 idInPage: "newPageItem",
								 onClick: "newPageClick",
								 iconClass: "newPageItem"},
							        {"label": bundleStudio.M_SaveAs,
								 idInPage: "saveAsPageItem",
								 onClick: "savePageAsClick",
								 iconClass: "saveAsPageItem"},
							        {"label": bundleStudio.M_ImportPage,
								 idInPage: "importPageItem",
								 onClick: "importProjectClick",
								 iconClass: "importPageItem"},
								{"label": bundleStudio.M_DeletePage,
								 idInPage: "deletePageItem",
								 iconClass: "deleteItem",
								 children: []},
							        {"label": bundleStudio.M_SetAsHomePage,
								 idInPage: "setHomePageItem",
								 //onClick: "makeHomeClick",
								 iconClass: "setHomePageItem",
								 children: []}]},
							    {"label": bundleStudio.M_Services,
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
			  /* The old menu bar
				nspcr5: ["wm.Spacer", {width: "15px"}, {}],
				projectPopupBtn: ["wm.PopupButton", {width: "55px", caption: "<span style=\"font-weight:bold;padding:4px;\">File</span><img src=\"images/dropArrow.png\"/> ", popupWidth: "180", hint: "Project Administration", imageList: "smallToolbarImageList", height: "29px"}, {}, {
					newProjectItem: ["wm.Item", {caption: "New Project...", imageIndex: 17}, {onclick: "newProjectClick"}],
					openProjectItem: ["wm.Item", {caption: "Open Project...", imageIndex: 18}, {onclick: "openProjectClick"}],
					closeProjectItem: ["wm.Item", {caption: "Close Project", imageIndex: 13}, {onclick: "closeClick"}],
					copyProjectItem: ["wm.Item", {caption: "Copy Current Project...", imageIndex: 1}, {onclick: "copyProjectClick"}],
					deleteProjectItem: ["wm.Item", {caption: "Delete Current Project", imageIndex: 0}, {onclick: "deleteProjectClick"}],
					exportProjectItem: ["wm.Item", {caption: "Export Project", imageIndex: 19}, {onclick: "exportClick"}],
					importProjectItem: ["wm.Item", {caption: "Import Project...", imageIndex: 19}, {onclick: "importClick"}],
					deployProjectItem: ["wm.Item", {caption: "Deployment...", imageIndex: 3}, {onclick: "deployClick"}],
					preferencesItem: ["wm.Item", {caption: "Preferences...", imageIndex: 3}, {onclick: "projectSettingsClick"}]
				}],
				editPopupBtn: ["wm.PopupButton", {width: "55px", caption: "<span style=\"font-weight:bold;padding:4px;\">Edit</span><img src=\"images/dropArrow.png\"/> ", popupWidth: "120", hint: "Page Edit", imageList: "canvasToolbarImageList16", height: "29px"}, {}, {
					cutItem: ["wm.Item", {caption: "Cut", imageIndex: 2}, {onclick: "cutClick"}],
					copyItem: ["wm.Item", {caption: "Copy", imageIndex: 3}, {onclick: "copyClick"}],
					pasteItem: ["wm.Item", {caption: "Paste", imageIndex: 4}, {onclick: "pasteClick"}],
					deleteItem: ["wm.Item", {caption: "Delete", imageIndex: 5}, {onclick: "deleteClick"}],
					undoItem: ["wm.Item", {caption: "Undo", imageIndex: 6}, {onclick: "undoClick"}]
				}],
				viewPopupBtn: ["wm.PopupButton", {width: "65px", caption: "<span style=\"font-weight:bold;padding:4px;\">View</span><img src=\"images/dropArrow.png\"/> ", popupWidth: "120", hint: "Page View", imageList: "canvasToolbarImageList16", height: "29px"}, {}, {
					canvasItem: ["wm.Item", {caption: "Canvas", imageIndex: 21}, {onclick: "navGotoDesignerClick"}],
					sourceItem: ["wm.Item", {caption: "Source", imageIndex: 20}, {onclick: "navGotoSourceClick"}],
					resourceItem: ["wm.Item", {caption: "Resource", imageIndex: 20}, {onclick: "navGotoResourcesClick"}],
					outlineItem: ["wm.Item", {caption: "Outline", imageIndex: 8}, {onclick: "outlinedClick"}]/ *,
					liveLayoutItem: ["wm.Item", {caption: "Live Layout", imageIndex: 7}, {onclick: "refreshLiveData"}]* /
				}],
				insertPopupBtn: ["wm.PopupButton", {width: "70px", caption: "<span style=\"font-weight:bold;padding:4px;\">Insert</span><img src=\"images/dropArrow.png\"/> ", popupWidth: "180", hint: "Insert New Component", imageList: "smallToolbarImageList", height: "29px"}, {}, {
					
				}],
				pagePopupBtn: ["wm.PopupButton", {width: "65px", caption: "<span style=\"font-weight:bold;padding:4px;\">Page</span><img src=\"images/dropArrow.png\"/> ", popupWidth: "200", hint: "Page Administration", imageList: "smallToolbarImageList", height: "29px"}, {}, {
					newPageItem: ["wm.Item", {caption: "New...", imageIndex: 5}, {onclick: "newPageClick"}],
					saveAsPageItem: ["wm.Item", {caption: "Save As...", imageIndex: 7}, {onclick: "savePageAsClick"}],
					importPageItem: ["wm.Item", {caption: "Import Page...", imageIndex: 11}, {onclick: "importProjectClick"}],
					setHomePageItem: ["wm.Item", {caption: "Set As Home Page", imageIndex: 2}, {onclick: "makeHomeClick"}]
				}],
				servicesPopupBtn: ["wm.PopupButton", {width: "85px", caption: "<span style=\"font-weight:bold;padding:4px;\">Services</span><img src=\"images/dropArrow.png\"/> ", popupWidth: "180", hint: "Create New Service", imageList: "smallToolbarImageList", height: "29px"}, {}, {
					
				}],
				helpPopupBtn: ["wm.PopupButton", {width: "60px", caption: "<span style=\"font-weight:bold;padding:4px;\">Help </span><img src=\"images/dropArrow.png\"/>", popupWidth: "250", hint: "Help"}, {}, {
					tutorialItem: ["wm.Item", {caption: "Tutorial", openLink: "http://dev.wavemaker.com/wiki/bin/view/WM5_Documentation/Tutorial", openLinkTitle: "WaveMaker Tutorial"}, {onclick: "linkButtonClick"}],
					documentationItem: ["wm.Item", {caption: "Documentation", openLink: "http://dev.wavemaker.com/wiki/bin/view/WM5_Documentation/", openLinkTitle: "WaveMaker User Guide"}, {onclick: "linkButtonClick"}],
					communityButtonClick: ["wm.Item", {caption: "Community", openLink: "http://dev.wavemaker.com", openLinkTitle: "WaveMaker Community"}, {onclick: "linkButtonClick"}],
					javaApiDocBtn: ["wm.Item", {caption: "Java (Server) Documentation", openLink: "javadoc", openLinkTitle: "WaveMaker Java (Server) Documentation"}, {onclick: "linkButtonClick"}],
					jsApiDocBtn: ["wm.Item", {caption: "JavaScript (Client) Documentation", openLink: "jsdoc", openLinkTitle: "WaveMaker JavaScript (Client) Documentation"}, {onclick: "linkButtonClick"}]
				}],
				navBarSpacer6: ["wm.Spacer", {width: "24px", margin: "0,10", border: "0"}, {}],
*/
						    runPopup: ["wm.PopupMenuButton", {iconWidth: "24px", iconHeight: "24px", iconClass: "studioProjectRun", caption: "Run", width: "90px", height: "29px", border: "0", margin: "0", padding: "0", fullStructure: [{label: "Run", iconClass: "studioProjectRun"},{label: "Test", iconClass: "studioProjectTest"},{label:"Compile", iconClass: "studioProjectCompile"}]},{onclick: "runProjectClick", onchange: "runProjectChange"}],
/*
				navTestBtn: ["wm.ToolButton", {width: "75px", hint: bundleStudio.T_TestTip, caption: "<img src=\"images/runapp_24.png\"/><span style=\"font-weight:bold\"> Test </span>", height: "29px"}, {onclick: "runProjectPopupClick"}],
				navRunBtn: ["wm.ToolButton", {width: "75px", hint: bundleStudio.T_RunTip, caption: "<img src=\"images/runapp_24.png\"/><span style=\"font-weight:bold\"> Run </span>", height: "29px"}, {onclick: "runProjectClick"}],
				*/
				navBarSpacer7: ["wm.Spacer", {width: "100%", border: "0"}, {}],
				userLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, width: "250px"}, {}],
				navEditAccountBtn: ["wm.ToolButton", {showing: false, width: "120px", hint: bundleStudio.T_EditAccountTip, caption: "<img src=\"images/user_settings24.png\"/><span style=\"font-weight:bold\"> Edit Account </span>", height: "29px"}, {onclick: "editAccountClick"}],
			        navLogoutBtn: ["wm.ToolButton", {showing: false,width: "100px", hint: bundleStudio.T_LogoutTip, caption: "<img src=\"images/close_24.png\"/><span style=\"font-weight:bold\"> Logout </span>", height: "29px"}, {onclick: "logoutClick"}],
                                trackerImage: ["wm.Picture", {height: "1px", width: "1px"}]
			}]
		}],
		panel1: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}, {
			benchbevel11: ["wm.Bevel", {border: ""}, {}],
			panel2: ["wm.Panel", {height: "48px", width: "200px", border: "0", verticalAlign: "top", horizontalAlign: "left"}, {}, {
				leftToolbarButtons: ["wm.Panel", {height: "29px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", border: 0, padding: "0,4"}, {}, {
					nspcr4: ["wm.Spacer", {width: "2px"}, {}],
					designerCanvasBtn: ["wm.ToolButton", {border: "0", borderColor: "#294473", margin: "0", padding: "0,6", height: "100%", width: "56px", caption: "", hint: bundleStudio.T_CanvasTip}, {onclick: "navGotoDesignerClick"}],
					designerSourceBtn: ["wm.ToolButton", {border: "0", borderColor: "#294473", margin: "0", padding: "0,6", height: "100%", width: "57px", caption: "", hint: bundleStudio.T_SourceTip}, {onclick: "navGotoSourceClick"}],
					designerResourcesBtn: ["wm.ToolButton", {border: "0", borderColor: "#294473", margin: "0", padding: "0,6", height: "100%", width: "79px", caption: "", hint: bundleStudio.T_ResourcesTip}, {onclick: "navGotoResourcesClick"}]
				}],
				left: ["wm.TabLayers", {_classes: {domNode: ["wm-darksnazzy"]}, border: "0", width: "100%", height: "100%"}, {onchange: "leftTabsChange"}, {
				    mlpal: ["wm.Layer", {_classes: {domNode: ["wm-palette"]}, caption: bundleStudio.Palette}, {onShow: "resetPaletteSearch"}, {
					benchbevel6: ["wm.Bevel", {border: ""}, {}],
					paletteSearch: ["wm.Text", {caption: "", width: "100%", placeHolder: "Find Component/Widget", padding: "2,5,2,5", changeOnKey: true, resetButton: true}, {onchange: "paletteSearchChange"}],
					benchbevel6_6: ["wm.Bevel", {border: ""}, {}],
					palette: ["wm.Palette", {height: "100%", border: ""}, {}],
					paletteTips: ["wm.Label", {width: "100%", height: "24px", border: "3,0,0,0", borderColor: "#666E80", backgroundColor: "#424A5A", autoSizeHeight: true,singleLine: false}]
					/*
					paletteSplitter: ["wm.Splitter", {border: "0", layout: "bottom"}, {}],
					componentPalette: ["wm.Palette", {height: "300px", border: ""}, {}]*/
				    }],
				    leftObjects: ["wm.Layer", {caption: bundleStudio.Model}, {onShow: "resetTreeSearch"}, {
					benchbevel5: ["wm.Bevel", {border: ""}, {}],
					treeSearch: ["wm.Text", {caption: "", width: "100%", placeHolder: "Find Component/Widget", padding: "2,5,2,5", changeOnKey: true, resetButton: true}, {onchange: "treeSearchChange"}],
					benchbevel5_5: ["wm.Bevel", {border: ""}, {}],
					label12: ["wm.Label", {height: "22px", width: "100%", caption: bundleStudio.Visual_Components, border: "", padding: "4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}],
					widgetsTree: ["wm.DraggableTree", {height: "100%", border: "", padding: "4,0,0,0", dropBetweenNodes: true}, {onselect: "treeSelect", onNodeDrop: "onWidgetTreeNodeDrop"}]
				    }],
				    componentModel: ["wm.Layer", {caption: "Components"}, {onShow: "resetCompTreeSearch"}, {
					benchbevel50_1: ["wm.Bevel", {border: ""}, {}],
					compTreeSearch: ["wm.Text", {caption: "", width: "100%", placeHolder: "Find Component/Widget", padding: "2,5,2,5", changeOnKey: true, resetButton: true}, {onchange: "compTreeSearchChange"}],
					benchbevel50_5: ["wm.Bevel", {border: ""}, {}],
					compLabel11: ["wm.Label", {height: "22px", width: "100%", caption: bundleStudio.M_Services, border: "", padding: "4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}],
					tree: ["wm.Tree", {height: "200px", border: "", padding: "4,0,0,0"}, {onselect: "treeSelect"}],
					splitter222: ["wm.Splitter", {border: "0", layout: "top"}, {}],
					label1222: ["wm.Label", {height: "22px", width: "100%", caption: bundleStudio.Non_visual_Components, border: "", padding: "4"}, {}, {
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
		tabs: ["wm.Layers", {border: "0", width: "100%", height: "100%"}, {oncanchange: "tabsCanChange", onchange: "tabsChange"}, {
				workspace: ["wm.Layer", {caption: bundleStudio.T_Design}, {}, {
					ribbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", padding: "0,4"}, {}, {
						studioToolbarButtons: ["wm.Panel", {height: "100%", width: "100%", border: "", layoutKind: "left-to-right", imageList: "canvasToolbarImageList16"}, {}, {
							/*pagePopupBtn: ["wm.PopupButton", {width: "32px", caption: "<img src=\"images/dropArrow.png\"/>", popupWidth: "150", imageIndex: 14, imageList: "smallToolbarImageList"}, {}, {
								pageBtnItem4: ["wm.Item", {caption: "New Page...", imageIndex: 5}, {onclick: "newPageClick"}],
								pageBtnItem16: ["wm.Item", {caption: "Save", imageIndex: 8}, {onclick: "saveProjectClick"}],
								pageBtnItem6: ["wm.Item", {caption: "Save As...", imageIndex: 7}, {onclick: "savePageAsClick"}],
								pageBtnItem9: ["wm.Item", {caption: "Set As Home Page", imageIndex: 2}, {onclick: "makeHomeClick"}]
							}],*/
							pageSaveBtn: ["wm.ToolButton", {width: "24px", imageIndex: 1, hint: bundleStudio.T_SaveTip}, {onclick: "saveProjectClick"}],
							toolbarspacer1: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
							cutBtn: ["wm.ToolButton", {width: "24px", imageIndex: 2, hint: bundleStudio.T_CutTip}, {onclick: "cutClick"}],
							copyBtn: ["wm.ToolButton", {width: "24px", imageIndex: 3, hint: bundleStudio.T_CopyTip}, {onclick: "copyClick"}],
							pasteBtn: ["wm.ToolButton", {width: "24px", imageIndex: 4, hint: bundleStudio.T_PasteTip}, {onclick: "pasteClick"}],
							deleteBtn: ["wm.ToolButton", {width: "24px", imageIndex: 5, hint: bundleStudio.T_DeleteTip}, {onclick: "deleteClick"}],
							undoBtn: ["wm.ToolButton", {width: "24px", imageIndex: 6, hint: bundleStudio.T_UndoTip, disabled: true}, {onclick: "undoClick"}],
							toolbarspacer2: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
							/*liveLayoutBtn: ["wm.ToolButton", {width: "24px", imageIndex: 7, hint: "Live Layout"}, {onclick: "refreshLiveData"}],*/
						    outlineBtn: ["wm.ToolButton", {width: "24px", imageIndex: 8, hint: bundleStudio.T_ToggleOutlinedViewTip}, {onclick: "outlinedClick"}],
						    pageSelect: ["wm.SelectMenu", {caption: "Open Page", margin:"4,0,4,20", width: "250px", height: "24px", captionSize: "70px", displayField: "dataValue", dataField: "dataValue"},{onchange: "pageSelectChanged"},{
							binding: ["wm.Binding",{},{}, {
							    wire: ["wm.Wire", {"source":"app.pagesListVar","targetProperty":"dataSet"}, {}]
							}]
						    }]
						}],
						logoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
					}],
					main: ["wm.Panel", {height: "100%", border: "", layoutKind: "left-to-right", borderColor: "#666E80"}, {}, {
						bench: ["wm.Panel", {width: "100%", border: "1, 0, 0, 0", backgroundColor: "silver", borderColor: "#666E80"}, {}, {
							designer: ["wm.Designer", {height: "100%", width: "100%", backgroundColor: "white", borderColor: "black", border: ""}, {onselect: "designerSelect", onmove: "designerMove"}],
							benchbevel: ["wm.Bevel", {border: ""}, {}],
						    statusPanel: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "24px", border: "1,0,0,0", borderColor: "#666E80", backgroundColor: "#424A5A", horizontalAlign: "left", verticalAlign: "top"},{}, {
							statusBarLabel: ["wm.Label", {width: "100%", height: "100%"}],
							status: ["wm.JsonStatus", {iconWidth: "26", height: "100%", border: "0, 0, 0, 1", borderColor: "#666E80", width: "300px"}, {}]
						    }]
						}],
						splitter3: ["wm.Splitter", {border: "0", layout: "right"}, {}],
						right: ["wm.Panel", {_classes: {domNode: ["wm-darksnazzy"]}, width: "246px", border: "0"}, {}, {
							componentsTreePanel: ["wm.Panel", {height: "120px", border: "0", showing: false}, {}, {
								componentsToolbar: ["wm.Panel", {height: "31px", border: "0", padding: "1, 0, 0, 0", layoutKind: "left-to-right"}, {}, {
									newVariableButton: ["wm.ToolButton", {width: "32px", hint: bundleStudio.T_NewVariableTip, caption: "<img src=\"images/wm/variable_24.png\"/>"}, {onclick: "newComponentButtonClick"}],
									newLiveVariableButton: ["wm.ToolButton", {width: "32px", hint: bundleStudio.T_NewLiveVariableTip, caption: "<img src=\"images/wm/livevar_24.png\"/>"}, {onclick: "newComponentButtonClick"}],
									newServiceVariableButton: ["wm.ToolButton", {width: "32px", hint: bundleStudio.T_NewServiceVariableTip, caption: "<img src=\"images/wm/servicevar_24.png\"/>"}, {onclick: "newComponentButtonClick"}],
									newNavigationButton: ["wm.ToolButton", {width: "32px", hint: bundleStudio.T_NewNavigationTip, caption: "<img src=\"images/wm/navigation_24.png\"/>"}, {onclick: "newComponentButtonClick"}],
									dashspacer1: ["wm.Spacer", {width: "2px"}, {}],
									deleteComponentButton: ["wm.ToolButton", {width: "32px", hint: bundleStudio.T_DeleteSelectedTip, caption: "<img src=\"images/delete_24.png\"/>"}, {onclick: "deleteComponentButtonClick"}]
								}],
								componentsTree: ["wm.Tree", {height: "100%"}, {onselect: "treeSelect", ondblclick: "componentsTreeDblClick"}]
							}],
							splitter3b: ["wm.Splitter", {border: "", showing: false}, {}],
							PIPanel: ["wm.Panel", {height: "100%", border: "0", padding: "5", layoutKind: "left-to-right"}, {}, {
								PIContents: ["wm.Panel", {width: "100%", border: "0"}, {}, {
									propInsContainer: ["wm.Panel", {height: "100%", border: "0"}, {}, {
										PILabelContainer: ["wm.Panel", {height: "25px", border: "0"}, {}, {
											insTop: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}, {
												inspected: ["wm.Label", {height: "100%", width: "100%", caption: "", border: "", padding: "2"}, {}, {
													format: ["wm.DataFormatter", {}, {}]
												}]
											}]
										}],
										PITopBorder: ["wm.Panel", {height: "4px", border: "0", layoutKind: "left-to-right"}, {}, {
											PITopBorderl: ["wm.Panel", {width: "4px", border: "0"}, {}],
											PITopBorderm: ["wm.Panel", {width: "100%", border: "0"}, {}],
											PITopBorderr: ["wm.Panel", {width: "4px", border: "0"}, {}]
										}],
										PIContainer: ["wm.Panel", {height: "100%", border: "0", layoutKind: "left-to-right"}, {}, {
											propsTabs: ["wm.Layers", {border: "0", width: "100%", height: "100%"}, {}, {
												propsLayer: ["wm.Layer", {caption: bundleStudio.PropertiesHO}, {}, {
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
							}]
							/*,spacer1: ["wm.Spacer", {height: "4px", width: "96px", border: "2", borderColor: "#666E80"}, {}]*/
						}]
					}],
					benchbevel4: ["wm.Bevel", {}, {}]
				}],
				loginLayer: ["wm.Layer", {_classes: {domNode: ["wm-darksnazzy"]}, caption: bundleStudio.Login, margin: "100,60,0,60", height: "325px", width: "250px"}, {}, {
		  loginPage: ["wm.PageContainer", {pageName:  "", height: "100%", width: "100%"}, {}]
		}],
		deploymentLayer: ["wm.Layer", {caption: bundleStudio.Deployment}, {}, {
		    deploymentPage: ["wm.PageContainer", {pageName:  "", height: "100%", width: "100%"}, {}]
		}],
		resourcesTab: ["wm.Layer", {caption: bundleStudio.Resources}, {}, {
		                    resourcesPage: ["wm.PageContainer", {loadParentFirst: true, pageName: "ResourceManager", height: "100%", width: "100%"}, {}]
				}],
		sourceTab: ["wm.Layer", {_classes: {domNode: ["wm-darksnazzy"]}, caption: bundleStudio.R_IDE}, {}, {
				    /*
					sourceRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
						sourcePageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveProjectClick"}],
						sourceToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
						sourceLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
					}],*/
					sourceTabs: ["wm.TabLayers", {border: "0", width: "100%", height: "100%"}, {onchange: "sourceTabsChange", oncanchange: "sourceTabsCanChange"}, {
					    scriptLayer: ["wm.Layer", {caption: bundleStudio.R_Script}, {}, {
						benchbevel8: ["wm.Bevel", {}, {}],
						scriptRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#000000"}, {}, {
						    scriptPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_Save, imageIndex: 8}, {onclick: "saveScriptClick"}],
						    scriptPageFindBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Find, iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findScriptClick"}],
						    scriptPageImportBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_Import, imageIndex: 25}, {onclick: "importJavascriptLibrary"}],
						    scriptPageRefreshBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Refresh, imageIndex: 27}, {onclick: "refreshScriptClick"}],
						    scriptPageFormatBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Format, imageIndex: 29}, {onclick: "formatScriptClick"}],
						    scriptPageWordWrapBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Wrap, imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapScriptClick"}],
						    scriptPageCompileBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Compile, imageIndex: 28}, {onclick: "validateScriptClick"}],
						    scriptPageCompletionsBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Completion, imageIndex: 7, imageList: "canvasToolbarImageList16"}, {onclick: "listCompletions"}],
						    scriptPageHelpBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Help, imageIndex: 26}, {onclick: "showEditorHelp"}],
						    scriptToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
						    scriptPageCompileChkBtn: ["wm.Checkbox", {caption: "Validate on Save", width: "120px"}, {onchange: "validateScriptCheckboxChange"}]
						}],
						editArea: ["wm.EditArea", {width: "100%", height: "100%"}, {onCtrlKey: "scriptEditorCtrlKey"}]
					    }],
                                            themeLayer: ["wm.Layer", {_classes: {domNode: ["wm-darksnazzy"]}, caption: bundleStudio.R_Themes, width: "100%", height: "100%"}, {}, {
						themesbevel: ["wm.Bevel", {}, {}],
						themesRibbon: ["wm.Panel", {height: "29px", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
						    themesPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_Save, imageIndex: 8}, {onclick: "saveThemeClick"}],
						    themesPageAddBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_NewTheme, imageIndex: 25}, {onclick: "addNewThemeClick"}],
						    themesPageCopyBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_CopyTheme, imageIndex: 1}, {onclick: "copyThemeClick"}],
						    themesPageDeleteBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_DeleteTheme, imageIndex: 0}, {onclick: "deleteThemeClick"}],
						    themesPageRevertBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_Revert, imageIndex: 6, imageList: "canvasToolbarImageList16"}, {onclick: "revertThemeClick"}]
						}],
                                                themesPage: ["wm.PageContainer", {deferLoad: true, loadParentFirst: true, 
                                                                                  pageName: "ThemeDesigner"}]
                                            }],
					    cssLayer: ["wm.Layer", {caption: bundleStudio.R_CSS}, {onShow: "cssShow"}, {
						benchbevel9: ["wm.Bevel", {}, {}],
						cssRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
						    cssPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_Save, imageIndex: 8}, {onclick: "saveCssClick"}],
						    cssPageFindBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Find, iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findCssClick"}],
						    cssPageImportBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_Import, imageIndex: 25}, {onclick: "importCssLibrary"}],
						    cssPageWordWrapBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Wrap, imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapCssClick"}],
						    cssPageHelpBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Help, imageIndex: 26}, {onclick: "showCssEditorHelp"}],
						    cssToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
						    cssLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
						}],
						cssPageLabel: ["wm.Label", {caption: bundleStudio.R_Page_CSS, height: "18px", border: 0}, {}, {
						    format: ["wm.DataFormatter", {}, {}]
						}],
						cssEditArea: ["wm.EditArea", {width: "100%", height: "100%", syntax: "css"}, {onCtrlKey: "cssEditorCtrlKey"}],
						cssSplitter: ["wm.Splitter", {layout: "bottom"}, {}],
						cssInnerPanel: ["wm.Panel", {width: "100%", height: "300px", layoutKind: "top-to-bottom"},{}, {
						cssAppLabel: ["wm.Label", {caption: bundleStudio.R_Application_CSS, height: "18px", border: 0}, {}, {
						    format: ["wm.DataFormatter", {}, {}]
						}],
						appCssEditArea: ["wm.EditArea", {width: "100%", height: "100%", syntax: "css"}, {onCtrlKey: "cssEditorCtrlKey"}]
					    }]
                                        }],
						markupLayer: ["wm.Layer", {caption: bundleStudio.R_Markup}, {}, {
							benchbevel10: ["wm.Bevel", {}, {}],
							markupRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
							    markupPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_Save, imageIndex: 8}, {onclick: "saveMarkupClick"}],
							    markupPageFindBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Find, iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findMarkupClick"}],
							    markupPageWordWrapBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Wrap, imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapMarkupClick"}],
							    markupPageHelpBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Help, imageIndex: 26}, {onclick: "showMarkupEditorHelp"}],
							    markupToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
							    markupLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
							}],
							markupEditArea: ["wm.EditArea", {width: "100%", height: "100%", syntax: "html"}, {onCtrlKey: "markupEditorCtrlKey"}]
						}],
						widgets: ["wm.Layer", {caption: bundleStudio.R_Widgets}, {}, {
							benchbevel13: ["wm.Bevel", {}, {}],
							widgetsHtml: ["wm.Html", {width: "100%", height: "100%", border: 0, padding: "4, 0, 0, 4"}, {}]
						}],
						appsource: ["wm.Layer", {caption: bundleStudio.R_Application}, {}, {
						    appsrcbenchbevel9: ["wm.Bevel", {}, {}],
						    appsrcRibbon: ["wm.Panel", {height: "29px", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#000000"}, {}, {
							appsrcPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_Save, imageIndex: 8}, {onclick: "saveAppSrcClick"}],
							appsrcPageFindBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Find, iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findAppScriptClick"}],
							appsrcPageImportBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_Import, imageIndex: 25}, {onclick: "importAppJavascriptLibrary"}],
						    appsrcPageFormatBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Format, imageIndex: 29}, {onclick: "formatAppScriptClick"}],
						    appsrcPageWordWrapBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Wrap, imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapAppScriptClick"}],
							appsrcPageCompileBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Compile, imageIndex: 28,iconWidth: "20px", iconHeight: "20px"}, {onclick: "validateAppScriptClick"}],
						    appsrcPageHelpBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.M_Help, imageIndex: 26}, {onclick: "showAppScriptEditorHelp"}],
						    scriptToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
						    appsrcPageCompileChkBtn: ["wm.Checkbox", {caption: "Validate on Save", width: "120px"}, {onchange: "validateScriptCheckboxChange"}]

						}],

						        appsourceHtml: ["wm.Html", {width: "100%", height: "300px", border: 0, padding: "4, 0, 0, 4"}, {}],
						        appsourceSplitter: ["wm.Splitter", {layout: "bottom"}, {}],
						        appsourceEditor: ["wm.EditArea", {width: "100%", height: "100%"}, {onCtrlKey: "appScriptEditorCtrlKey"}]

						}],

					    appDocs: ["wm.Layer", {caption: bundleStudio.R_App_Docs}, {}, {
							benchbevel14: ["wm.Bevel", {}, {}],
						appdocsRibbon: ["wm.Panel", {height: "29px", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#000000"}, {}, {
							appdocsPrintBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: bundleStudio.R_Print, imageIndex: 4}, {onclick: "printAppDocsClick"}]
						}],

						        appDocViewer: ["wm.Html", {width: "100%", height: "100%"}]
						}],

					    logs: ["wm.Layer", {caption: bundleStudio.R_Server_Logs}, {}, {
							benchbevel14: ["wm.Bevel", {}, {}],
							logViewer: ["wm.PageContainer", {loadParentFirst: true, pageName: "LogViewer",  width: "100%", height: "100%"}]
						}],
						diagnosticsTab: ["wm.Layer", {caption: bundleStudio.R_Diagnostics}, {}, {
							diagnosticsPane: ["wm.PageContainer", {loadParentFirst: true, pageName: "Diagnostics", width: "100%", height: "100%"}, {}]
						}]
					}]
				}]/*,
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
