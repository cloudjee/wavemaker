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

	navImageList: ["wm.ImageList", {width: 24, height: 28, colCount: 10, url: "images/navBtns.png"}, {}],
//	canvasToolbarImageList: ["wm.ImageList", {width: 24, height: 24, colCount: 20, url: "images/canvasToolbarBtns.png"}, {}],
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
	canvasToolbarImageList16: ["wm.ImageList", {width: "16", height: "16", colCount: 22, url: "images/canvasToolbarBtns16.png"}, {}],        
        genericDialog: ["wm.GenericDialog", {}],
	layout: ["wm.Layout", {height: "100%"}, {}, {
		dialog: ["wm.Dialog", {height: "400px", border: "1", borderColor: "#666E80"}, {}],
		
		navigationBar: ["wm.Panel", {_classes: {domNode: ["wm-darksnazzy"]}, height: "29px", border: "0", layoutKind: "left-to-right"}, {}, {
			navBtnHolder: ["wm.Panel", {width: "100%", border: "0", layoutKind: "left-to-right", imageList: "navImageList", horizontalAlign: "left"}, {}, {
			  navigationMenu: ["wm.DojoMenu", {height: "29px", width: "570px",
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
                                                              {"label":"Open Project...",
							       idInPage: "openProjectItem",
							       onClick: "openProjectClick",
							       iconClass: "openProjectItem"},
                                                              {"label":"Close Project",
							       idInPage: "closeProjectItem",
							       onClick: "closeClick",
							       iconClass: "closeProjectItem"},
                                                              {"label":"Copy Current Project...",
							       idInPage: "copyProjectItem",
							       onClick: "copyProjectClick",
							       iconClass: "copyProjectItem"},
                                                              {"label":"Delete Current Project",
							       idInPage: "deleteProjectItem",
							       onClick: "deleteProjectClick",
							       iconClass: "deleteProjectItem"},
                                                              {"label":"Export Project",
							       idInPage: "exportProjectItem",
							       onClick: "exportClick",
							       iconClass: "exportProjectItem"},
                                                              {"label":"Import Project...",
							       idInPage: "importProjectItem",
							       onClick: "importClick",
							       iconClass: "importProjectItem"},
                                                              {"label":"Deployment...",
							       idInPage: "deployProjectItem",
							       onClick: "deployClick",
							       iconClass: "deployProjectItem"},                                                          
                                                              {"label":"Preferences...",
							       idInPage: "preferencesItem",
							       onClick: "projectSettingsClick",
							       iconClass: "preferencesItem"}
							 ]},
                                                          {"label":"Edit",
							   idInPage: "editPopupBtn",
                                                            "children": [
                                                                {"label":"Cut",
								 idInPage: "cutItem",
								 onClick: "cutClick",
								 iconClass: "cutItem"},
							        {"label":"Copy",
								 idInPage: "copyItem",
								 onClick: "copyClick",
								 iconClass: "copyItem"},
                                                                {"label":"Paste",
								 idInPage: "pasteItem",
								 onClick: "pasteClick",
								 iconClass: "pasteItem"},
							        {"label":"Delete",
								 idInPage: "deleteItem",
								 onClick: "deleteClick",
								 iconClass: "deleteItem"},
							        {"label":"Undo",
								 idInPage: "undoItem",
								 onClick: "undoClick",
								 iconClass: "undoItem"}]},
							   {"label":"View",
							    idInPage: "viewPopupBtn",
							    "children":  [
								{"label":"Canvas",
								 idInPage: "canvasItem",
								 onClick: "navGotoDesignerClick",
								 iconClass: "canvasItem"},
							        {"label":"Source",
								 idInPage: "sourceItem",
								 onClick: "navGotoSourceClick",
								 iconClass: "sourceItem"},
							        {"label":"Resources",
								 idInPage: "resourceItem",
								 onClick: "navGotoResourcesClick",
								 iconClass: "resourceItem"},
							        {"label":"Outline",
								 idInPage: "outlineItem",
								 onClick: "outlinedClick",
								 iconClass: "outlineItem"}]},

							    {"label":"Insert",
							     idInPage: "insertPopupBtn",
							     "children":[
							     ]},
							   {"label":"Page",
							    idInPage: "pagePopupBtn",
							    "children":[
							        {"label":"New...",
								 idInPage: "newPageItem",
								 onClick: "newPageClick",
								 iconClass: "newPageItem"},
							        {"label":"Save As...",
								 idInPage: "saveAsPageItem",
								 onClick: "savePageAsClick",
								 iconClass: "saveAsPageItem"},
							        {"label":"Import Page...",
								 idInPage: "importPageItem",
								 onClick: "importProjectClick",
								 iconClass: "importPageItem"},
							        {"label":"Set As Home Page",
								 idInPage: "setHomePageItem",
								 onClick: "makeHomeClick",
								 iconClass: "setHomePageItem"}]},
							    {"label":"Services",
							     idInPage: "servicesPopupBtn",
							     "children":[
							     ]},

							    {"label":"Help",
							     idInPage: "helpPopupBtn",
							     "children":[
							         {"label":"Tutorials",
								  idInPage: "tutorialDocItem",
								  onClick: "linkButtonClick",
								  openLink: "http://dev.wavemaker.com/wiki/bin/wmdoc/Tutorials",
								  openLinkTitle: "WaveMaker Tutorial"
								 },
							         {"label":"Documentation",
								  idInPage: "documentationDocItem",
								  onClick: "linkButtonClick",
								  openLink: "http://dev.wavemaker.com/wiki/bin/wmdoc/",
								  openLinkTitle: "WaveMaker User Guide"
								 },
 							         {"label":"Community",
								  idInPage: "communityDocItem",
								  onClick: "linkButtonClick",
								  openLink: "http://dev.wavemaker.com",
								  openLinkTitle: "WaveMaker Community"
								 },
							         {"label":"Java (Server) Documentation",
								  idInPage: "javaServerDocItem",
								  onClick: "linkButtonClick",
								  openLink: "javadoc",
								  openLinkTitle: "WaveMaker Java (Server) Documentation"
								 },
							         {"label":"JavaScript (Client) Docs",
								  idInPage: "clientDocItem",
								  onClick: "linkButtonClick",
								  openLink: "jsdoc",
								  openLinkTitle: "WaveMaker JavaScript (Client) Documentation"
								 }
							     ]
							    }
						      ]
						     },  {},{}],
			  /*
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
				navTestBtn: ["wm.ToolButton", {width: "75px", hint: "Run in Debug mode with lots of FireBug/FireBug Lite output", caption: "<img src=\"images/runapp_24.png\"/><span style=\"font-weight:bold\"> Test </span>", height: "29px"}, {onclick: "runProjectClick"}],
				navRunBtn: ["wm.ToolButton", {width: "75px", hint: "Run Project", caption: "<img src=\"images/runapp_24.png\"/><span style=\"font-weight:bold\"> Run </span>", height: "29px"}, {onclick: "runProjectClick"}],
				navBarSpacer7: ["wm.Spacer", {width: "100%", border: "0"}, {}],
				userLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, width: "250px"}, {}],
				navEditAccountBtn: ["wm.ToolButton", {showing: false, width: "120px", hint: "Edit Account", caption: "<img src=\"images/user_settings24.png\"/><span style=\"font-weight:bold\"> Edit Account </span>", height: "29px"}, {onclick: "editAccountClick"}],
				navLogoutBtn: ["wm.ToolButton", {showing: false,width: "100px", hint: "Logout", caption: "<img src=\"images/close_24.png\"/><span style=\"font-weight:bold\"> Logout </span>", height: "29px"}, {onclick: "logoutClick"}]
			}]
		}],
		panel1: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}, {
			benchbevel11: ["wm.Bevel", {border: ""}, {}],
			panel2: ["wm.Panel", {height: "48px", width: "200px", border: "0", verticalAlign: "top", horizontalAlign: "left"}, {}, {
				leftToolbarButtons: ["wm.Panel", {height: "29px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", border: 0, padding: "0,4"}, {}, {
					nspcr4: ["wm.Spacer", {width: "2px"}, {}],
					designerCanvasBtn: ["wm.ToolButton", {border: "0", borderColor: "#294473", margin: "0", padding: "0,6", height: "100%", width: "56px", caption: "", hint: "Canvas"}, {onclick: "navGotoDesignerClick"}],
					designerSourceBtn: ["wm.ToolButton", {border: "0", borderColor: "#294473", margin: "0", padding: "0,6", height: "100%", width: "57px", caption: "", hint: "Source"}, {onclick: "navGotoSourceClick"}],
					designerResourcesBtn: ["wm.ToolButton", {border: "0", borderColor: "#294473", margin: "0", padding: "0,6", height: "100%", width: "79px", caption: "", hint: "Resources"}, {onclick: "navGotoResourcesClick"}]
				}],
				left: ["wm.TabLayers", {_classes: {domNode: ["wm-darksnazzy"]}, border: "0", width: "100%", height: "100%"}, {onchange: "leftTabsChange"}, {
				    mlpal: ["wm.Layer", {_classes: {domNode: ["wm-palette"]}, caption: "Palette"}, {}, {
					benchbevel6: ["wm.Bevel", {border: ""}, {}],
					palette: ["wm.Palette", {height: "100%", border: ""}, {}]
					/*
					paletteSplitter: ["wm.Splitter", {border: "0", layout: "bottom"}, {}],
					componentPalette: ["wm.Palette", {height: "300px", border: ""}, {}]*/
				    }],
				    leftObjects: ["wm.Layer", {caption: "Model"}, {}, {
					benchbevel5: ["wm.Bevel", {border: ""}, {}],
					label11: ["wm.Label", {height: "22px", width: "100%", caption: "Non-visual Components:", border: "", padding: "4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}],
					tree: ["wm.Tree", {height: "200px", border: "", padding: "4,0,0,0"}, {onselect: "treeSelect"}],
					splitter2: ["wm.Splitter", {border: "0", layout: "top"}, {}],
					label12: ["wm.Label", {height: "22px", width: "100%", caption: "Visual Components:", border: "", padding: "4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}],
					widgetsTree: ["wm.Tree", {height: "100%", border: "", padding: "4,0,0,0"}, {onselect: "treeSelect"}]
				    }],
				    projects: ["wm.Layer", {caption: "Projects"}, {}, {
					ptoolbar: ["wm.Panel", {height: "29px", border: "0", padding: "4,4", layoutKind: "left-to-right", imageList: "smallToolbarImageList", backgroundColor: "#959DAB"}, {}, {
						    /*projectMorePopupBtn: ["wm.PopupButton", {width: "32px", caption: "<img src=\"images/dropArrow.png\"/>", popupWidth: "150", imageIndex: 14}, {}, {
							newProjectItem: ["wm.Item", {imageIndex: 17, caption: "New Project..."}, {onclick: "newProjectClick"}],
							newPageItem: ["wm.Item", {imageIndex: 5, caption: "New Page..."}, {onclick: "newPageClick"}],
							closeItem: ["wm.Item", {caption: "Close Project", imageIndex: 13}, {onclick: "closeClick"}],
							getWarItem: ["wm.Item", {caption: "Deploy Project...", imageIndex: 3}, {onclick: "deployClick"}],
							exportProjItem: ["wm.Item", {caption: "Export Project...", imageIndex: 19}, {onclick: "exportClick"}],
							projectCopyItem: ["wm.Item", {caption: "Copy Project...", imageIndex: 1}, {onclick: "copyProjectClick"}],
							projectImportItem: ["wm.Item", {caption: "Import page...", imageIndex: 11}, {onclick: "importProjectClick"}],
							projectSettingsItem: ["wm.Item", {caption: "Preferences...", imageIndex: 3}, {onclick: "projectSettingsClick"}]
							}],*/
						projectNewProjectButton: ["wm.ToolButton", {width: "24px", imageIndex: 17, hint: "New Project..."}, {onclick: "newProjectClick"}],
						projectNewPageButton: ["wm.ToolButton", {width: "24px", imageIndex: 5, hint: "New Page..."}, {onclick: "newPageClick"}],
						projectOpenSelectedButton: ["wm.ToolButton", {width: "24px", imageIndex: 18, hint: "Open Selected"}, {onclick: "openSelectedProjectPageClick"}],
						projectDeleteButton: ["wm.ToolButton", {width: "24px", imageIndex: 0, hint: "Delete Selected..."}, {onclick: "deleteSelectedProjectPageClick"}],
						projectSetHomePageButton: ["wm.ToolButton", {width: "24px", imageIndex: 2, hint: "Set Selected As Home Page"}, {onclick: "makeSelectedHomeClick"}]
						/*projectMorePopupBtn: ["wm.PopupButton", {width: "32px", caption: "<img src=\"images/dropArrow.png\"/>", popupWidth: "150", imageIndex: 14}, {}, {
						    projectCopyItem: ["wm.Item", {caption: "Copy Project...", imageIndex: 1}, {onclick: "copyProjectClick"}],
						    projectImportItem: ["wm.Item", {caption: "Import page...", imageIndex: 11}, {onclick: "importProjectClick"}],
						    projectSettingsItem: ["wm.Item", {caption: "Settings...", imageIndex: 3}, {onclick: "projectSettingsClick"}]
						    }]*/
						}],
					projectsTree: ["wm.Tree", {height: "100%", border: "0"}, {ondblclick: "projectsTreeDblClick", oninitchildren: "projectsTreeInitChildren", onselect: "projectsTreeSelectionChange"}]
				    }]
				}],

				benchbevel12: ["wm.Bevel", {border: ""}, {}]
			}],
			splitter1: ["wm.Splitter", {border: "0", layout: "left"}, {}],
		tabs: ["wm.Layers", {border: "0", width: "100%", height: "100%"}, {oncanchange: "tabsCanChange", onchange: "tabsChange"}, {
				workspace: ["wm.Layer", {caption: "Design"}, {}, {
					ribbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", padding: "0,4"}, {}, {
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
							undoBtn: ["wm.ToolButton", {width: "24px", imageIndex: 6, disabled: true}, {onclick: "undoClick"}],
							toolbarspacer2: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
							/*liveLayoutBtn: ["wm.ToolButton", {width: "24px", imageIndex: 7, hint: "Live Layout"}, {onclick: "refreshLiveData"}],*/
							outlineBtn: ["wm.ToolButton", {width: "24px", imageIndex: 8, hint: "Toggle Outlined View"}, {onclick: "outlinedClick"}]
						}],
						logoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
					}],
					main: ["wm.Panel", {height: "100%", border: "", layoutKind: "left-to-right", borderColor: "#666E80"}, {}, {
						bench: ["wm.Panel", {width: "100%", border: "1, 0, 0, 0", backgroundColor: "silver", borderColor: "#666E80"}, {}, {
							designer: ["wm.Designer", {height: "100%", width: "100%", backgroundColor: "white", borderColor: "black", border: ""}, {onselect: "designerSelect", onmove: "designerMove"}],
							benchbevel: ["wm.Bevel", {border: ""}, {}],
							status: ["wm.Box", {height: "24px", border: "1, 0, 0, 0", borderColor: "#666E80", backgroundColor: "#424A5A", width: "767px"}, {}]
						}],
						splitter3: ["wm.Splitter", {border: "0", layout: "right"}, {}],
						right: ["wm.Panel", {_classes: {domNode: ["wm-darksnazzy"]}, width: "246px", border: "0"}, {}, {
							componentsTreePanel: ["wm.Panel", {height: "120px", border: "0", showing: false}, {}, {
								componentsToolbar: ["wm.Panel", {height: "31px", border: "0", padding: "1, 0, 0, 0", layoutKind: "left-to-right"}, {}, {
									newVariableButton: ["wm.ToolButton", {width: "32px", hint: "New Variable", caption: "<img src=\"images/wm/variable_24.png\"/>"}, {onclick: "newComponentButtonClick"}],
									newLiveVariableButton: ["wm.ToolButton", {width: "32px", hint: "New LiveVariable", caption: "<img src=\"images/wm/livevar_24.png\"/>"}, {onclick: "newComponentButtonClick"}],
									newServiceVariableButton: ["wm.ToolButton", {width: "32px", hint: "New ServiceVariable", caption: "<img src=\"images/wm/servicevar_24.png\"/>"}, {onclick: "newComponentButtonClick"}],
									newNavigationButton: ["wm.ToolButton", {width: "32px", hint: "New Navigation", caption: "<img src=\"images/wm/navigation_24.png\"/>"}, {onclick: "newComponentButtonClick"}],
									dashspacer1: ["wm.Spacer", {width: "2px"}, {}],
									deleteComponentButton: ["wm.ToolButton", {width: "32px", hint: "Delete Selected", caption: "<img src=\"images/delete_24.png\"/>"}, {onclick: "deleteComponentButtonClick"}]
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
												propsLayer: ["wm.Layer", {caption: "PropertiesHO"}, {}, {
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
				loginLayer: ["wm.Layer", {_classes: {domNode: ["wm-darksnazzy"]}, caption: "Login", margin: "100,60,0,60", height: "325px", width: "250px"}, {}, {
		  loginPage: ["wm.PageContainer", {pageName:  "", height: "100%", width: "100%"}, {}]
		}],
		deploymentLayer: ["wm.Layer", {caption: "Deployment"}, {}, {
		    deploymentPage: ["wm.PageContainer", {pageName:  "", height: "100%", width: "100%"}, {}]
		}],
		resourcesTab: ["wm.Layer", {caption: "Resources"}, {}, {
		                    resourcesPage: ["wm.PageContainer", {loadParentFirst: true, pageName: "ResourceManager", height: "100%", width: "100%"}, {}]
				}],
				sourceTab: ["wm.Layer", {_classes: {domNode: ["wm-darksnazzy"]}, caption: "IDE"}, {}, {
				    /*
					sourceRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
						sourcePageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveProjectClick"}],
						sourceToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
						sourceLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
					}],*/
					sourceTabs: ["wm.TabLayers", {border: "0", width: "100%", height: "100%"}, {onchange: "sourceTabsChange", oncanchange: "sourceTabsCanChange"}, {
					    scriptLayer: ["wm.Layer", {caption: "Script"}, {}, {
						benchbevel8: ["wm.Bevel", {}, {}],
						scriptRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#000000"}, {}, {
						    scriptPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveScriptClick"}],
						    scriptPageImportBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Import", imageIndex: 25}, {onclick: "importJavascriptLibrary"}],
						    scriptToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
						    scriptLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
						}],
						editArea: ["wm.EditArea", {width: "100%", height: "100%"}, {}]
					    }],
                                            themeLayer: ["wm.Layer", {_classes: {domNode: ["wm-darksnazzy"]}, caption: "Themes", width: "100%", height: "100%"}, {}, {
						themesbevel: ["wm.Bevel", {}, {}],
						themesRibbon: ["wm.Panel", {height: "29px", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
						    themesPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveThemeClick"}],
						    themesPageAddBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "New Theme (Copy Current Theme)", imageIndex: 25}, {onclick: "addNewThemeClick"}],
						    themesPageDeleteBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Delete Theme", imageIndex: 0}, {onclick: "deleteThemeClick"}],
						    themesPageRevertBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Revert Changes", imageIndex: 6, imageList: "canvasToolbarImageList16"}, {onclick: "revertThemeClick"}]
						}],
                                                themesPage: ["wm.PageContainer", {deferLoad: true, loadParentFirst: true, 
                                                                                  pageName: "ThemeDesigner"}]
                                            }],
					    cssLayer: ["wm.Layer", {caption: "CSS"}, {}, {
						benchbevel9: ["wm.Bevel", {}, {}],
						cssRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
						    cssPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveCssClick"}],
						    cssPageImportBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Import", imageIndex: 25}, {onclick: "importCssLibrary"}],
						    cssToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
						    cssLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
						}],
						cssPageLabel: ["wm.Label", {caption: "Page CSS", height: "18px", border: 0}, {}, {
						    format: ["wm.DataFormatter", {}, {}]
						}],
						cssEditArea: ["wm.EditArea", {width: "100%", height: "100%", syntax: "css"}, {}],
						cssSplitter: ["wm.Splitter", {layout: "bottom"}, {}],
						cssAppPanel: ["wm.Panel", {height: "300px", border: "0"}, {}, {
						    cssAppLabel: ["wm.Label", {caption: "Application CSS", height: "18px", border: 0}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						    }],
						    appCssEditArea: ["wm.EditArea", {width: "100%", height: "100%", syntax: "css"}, {}]
						}]
                                            }],
						markupLayer: ["wm.Layer", {caption: "Markup"}, {}, {
							benchbevel10: ["wm.Bevel", {}, {}],
							markupRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
							    markupPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveMarkupClick"}],
							    markupToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
							    markupLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
							}],
							markupEditArea: ["wm.EditArea", {width: "100%", height: "100%", syntax: "html"}, {}]
						}],
						widgets: ["wm.Layer", {caption: "Widgets"}, {}, {
							benchbevel13: ["wm.Bevel", {}, {}],
							widgetsHtml: ["wm.Html", {width: "100%", height: "100%", border: 0, padding: "4, 0, 0, 4"}, {}]
						}],
						appsource: ["wm.Layer", {caption: "Application"}, {}, {
						    appsrcbenchbevel9: ["wm.Bevel", {}, {}],
						    appsrcRibbon: ["wm.Panel", {height: "29px", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#000000"}, {}, {
							appsrcPageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveAppSrcClick"}],
							appsrcPageImportBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Import", imageIndex: 25}, {onclick: "importAppJavascriptLibrary"}],
							appsrcToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
							appsrcLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
						}],

						        appsourceHtml: ["wm.Html", {width: "100%", height: "100%", border: 0, padding: "4, 0, 0, 4"}, {}],
						        appsourceSplitter: ["wm.Splitter", {layout: "bottom"}, {}],
						        appsourceEditor: ["wm.EditArea", {width: "100%", height: "100%"}, {}]

						}],
					    logs: ["wm.Layer", {caption: "Server Logs"}, {}, {
							benchbevel14: ["wm.Bevel", {}, {}],
							logViewer: ["wm.PageContainer", {loadParentFirst: true, pageName: "LogViewer",  width: "100%", height: "100%"}]
						}],
						diagnosticsTab: ["wm.Layer", {caption: "Diagnostics"}, {}, {
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
