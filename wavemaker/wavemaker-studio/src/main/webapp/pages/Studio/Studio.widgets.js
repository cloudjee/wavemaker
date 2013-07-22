/*
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

Studio.widgets = {
    loadingDialog: ["wm.LoadingDialog", {_classes: {domNode: ["studiodialog"]}}],
    themeListType: ["wm.TypeDefinition", {}, {}, {
        themeListTypeField1: ["wm.TypeDefinitionField", {fieldName: "name", type: "String"}],
        themeListTypeField2: ["wm.TypeDefinitionField", {fieldName: "dataValue", type: "String"}],
        themeListTypeField3: ["wm.TypeDefinitionField", {fieldName: "designer", type: "String"}]
    }],
    themesListVar: ["wm.Variable", {type: "themeListType"}],
    /*deviceSizeVar: ["wm.Variable", {type: "EntryData", isList: 1, json: '[{name: "All", dataValue: ""}, {name: ">= 1150", dataValue: "1150"}, {name: "900px-1150px", dataValue: "900"}, {name: "750px-900px", dataValue: "750"}, {name: "600px-750px", dataValue: "600"}, {name: "450px-600px", dataValue: "450"}, {name: "300px-450px", dataValue: "300"}, {name: "< 300px", dataValue: "tiny"}]'}],*/
    deviceSizeType: ["wm.TypeDefinition", {internal: true}, {}, {
        "deviceSizeType.deviceName": ["wm.TypeDefinitionField", {fieldName: "name", type: "String"}],
        "deviceSizeType.deviceWidth": ["wm.TypeDefinitionField", {fieldName: "width", type: "String"}],
        "deviceSizeType.deviceHeight": ["wm.TypeDefinitionField", {fieldName: "height", type: "String"}],
        "deviceSizeType.deviceType": ["wm.TypeDefinitionField", {fieldName: "deviceType", type: "String"}]

    }],
/*    deviceSizeVar: ["wm.Variable", {type: "EntryData", isList: 1, json: '[{name: "All", dataValue: ""}, {name: "iPhone", dataValue: "320x480"}, {name: "iPad", dataValue: "768x1024"}, {name: "Galaxy Nexus", dataValue: "400x640"}, {name: "Galaxy Tab 7", dataValue: "600x1024"}, {name: "Galaxy Tab 10.1", dataValue: "800x1280"}]'}],*/
    deviceSizeVar: ["wm.Variable", {type: "deviceSizeType", isList: 1, json: dojo.toJson([
         {name: "All", width: "100%", height: "100%", deviceType: "desktop"},
         {name: "iPhone", width: "320px", height: "480px", deviceType: "phone"},
         {name: "iPad", width: "768px", height: "1024px", deviceType: "tablet"},
         {name: "Galaxy Nexus", width: "400px", height: "640px", deviceType: "phone"},
         {name: "HTC Thunderbolt", width: "320px", height: "508px", deviceType: "phone"},
         {name: "Galaxy Tab 7", width: "600px", height: "1024px", deviceType: "tablet"},
         {name: "Galaxy Tab 10.1", width: "800px", height: "1028px", deviceType: "tablet"},
         {name: "1920px", width: "1920px", height: "100%", deviceType: "desktop"},
         {name: "1440px", width: "1440px", height: "100%", deviceType: "desktop"},
         {name: "1150px", width: "1150px", height: "100%", deviceType: "desktop"},
         {name: "900px", width: "900px", height: "100%", deviceType: "desktop"},
         {name: "750px", width: "750px", height: "100%", deviceType: "desktop"},
         {name: "600px", width: "600px", height: "100%", deviceType: "desktop"},
         {name: "450px", width: "450px", height: "100%", deviceType: "desktop"},
         {name: "300px", width: "300px", height: "100%", deviceType: "desktop"},
         {name: "200px", width: "200px", height: "100%", deviceType: "desktop"}
         ])
    }],
    deviceTypeVar: ["wm.Variable", {type: "EntryData", isList: 1, json: '[{name: "All", dataValue: ""}, {name: "Desktop", dataValue: "desktop"}, {name: "Tablet", dataValue: "tablet"}, {name: "Phone", dataValue: "phone"}]'}],

    "com.wavemaker.editor.completions": ["wm.TypeDefinition", {internal: true}, {}, {
	"com.wavemaker.editor.completions.name":        ["wm.TypeDefinitionField", {fieldType: "String", fieldName: "name"}],
	"com.wavemaker.editor.completions.description": ["wm.TypeDefinitionField", {fieldType: "String", fieldName: "description"}],
	"com.wavemaker.editor.completions.returns":     ["wm.TypeDefinitionField", {fieldType: "String", fieldName: "returns"}],
	"com.wavemaker.editor.completions.params":      ["wm.TypeDefinitionField", {fieldType: "String", fieldName: "params"}]
    }],

    warningsListVar: ["wm.Variable", {type: "EntryData", isList: true}],
    autoCompletionVariable: ["wm.Variable", {type: "com.wavemaker.editor.completions", isList: true}],
	studioService: ["wm.JsonRpcService", {service: "studioService", sync: true}, {}],
	phoneGapService: ["wm.JsonRpcService", {service: "phoneGapService", sync: true}, {}],
	servicesService: ["wm.JsonRpcService", {service: "servicesService", sync: true}, {}],
	pagesService: ["wm.JsonRpcService", {service: "pagesService", sync: true}, {}],
	deploymentService: ["wm.JsonRpcService", {service: "deploymentService", sync: true}, {}],
	dataService: ["wm.JsonRpcService", {service: "dataService", sync: true}, {}],
	runtimeService: ["wm.JsonRpcService", {service: "runtimeService", sync: true}, {}],
	webService: ["wm.JsonRpcService", {service: "webService", sync: true}, {}],
	javaService: ["wm.JsonRpcService", {service: "javaService", sync: true}, {}],
	securityConfigService: ["wm.JsonRpcService", {service: "securityConfigService", sync: true}, {}],
	securityService: ["wm.JsonRpcService", {service: "securityService", sync: true}, {}, {}],
	//securityServiceJOSSO: ["wm.JsonRpcService", {service: "securityServiceJOSSO", sync: true}, {}, {}],
	resourceManagerService: ["wm.JsonRpcService", {service: "resourceFileService", sync: true}, {}],
    jarListService: ["wm.JsonRpcService", {service: "studioService", sync: false}, {}],
    publishedPropsDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, title: "Published Properties", pageName: "PropertyPublisher", modal: false, deferLoad: true,  width: "650px", height: "650px", hideControls: true, noEscape: false, minHeight: "200", noTopBottomDocking: true, noLeftRightDocking:true}],
    openProjectOptionsDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, title: "Open Project...", pageName: "OpenProjectOptions", modal: true, deferLoad: true,    width: "500px", height: "180px", hideControls: true}],
    revertProjectOptionsDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, title: "Revert Project...", pageName: "RevertProjectOptions", modal: true, deferLoad: true,width: "500px", height: "200px", hideControls: true}],
    gridDesignerDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, title: "Grid Designer", pageName: "GridDesigner", modal: false, deferLoad: true, width: "680px", height: "520px", hideControls: true, noEscape: true, minHeight: "300", noLeftRightDocking: true,noTopBottomDocking: false,   titlebarButtons: "StudioHelpIcon"},{onMiscButtonClick: "gridDesignerHelp"}],
    liveViewEditDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, title: "LiveView Editor", pageName: "LiveViewEditor", modal: true, deferLoad: true,    width: "300px", height: "500px", hideControls: true, noEscape: true, noLeftRightDocking: false,noTopBottomDocking: false}],
    editVariableDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, title: "Edit JSON", pageName: "EditVariable", modal: false, deferLoad: true,     width: "500px", height: "400px", minHeight: "300", hideControls: true, noEscape: true, noLeftRightDocking: false,noTopBottomDocking: false}],
    confirmSaveDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, pageName: "ConfirmSaveDialog", deferLoad: false,   width: "400px", height: "120px", hideControls: true, noEscape: true}],
    jarListVariable: ["wm.Variable", {type: "StringData"}, {}],
    addPatchDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, pageName: "AddPatch",  width: "90%", height: "90%", hideControls: true, modal: false, title: "Apply Patches for Studio", deferLoad: true}],
    jarDownloadDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, pageName: "HandleRequiredJars",   width: "400px", height: "340px", hideControls: true, modal: false, title: "Import Jar File", deferLoad: true}],
    ImportThirdPartyAPIDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, pageName: "ImportThirdPartyAPI",   width: "500px", height: "240px", hideControls: true, modal: false, title: "Import Partner Services", deferLoad: true}],
    dictionaryDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, pageName: "I18nDictionaryEditor",   width: "400px", height: "80%", hideControls: true, modal: false, title: "Dictionary Editor", deferLoad: true, corner: "cr", noLeftRightDocking: false,noTopBottomDocking: false}],
    editCodeDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, pageName: "CodeEditorDialog",   width: "800px", height: "400px", minHeight: "300", hideControls: true, modal: false, noEscape: true, title: "Edit Code", deferLoad: true, corner: "cl", positionNear: "PIContents", noLeftRightDocking: false,noTopBottomDocking: false}],

	//tempData used to show grid on FancyTemplate
	varTemplateData: ["wm.Variable", {"json":"[{name: \"Vestibulum\", dataValue: \"sodales magna mollis purus iaculis sagittis\"},\n{name: \"Lacinia\", dataValue: \" aliquam mauris nulla, consequat\"},\n{name: \"Consequat\", dataValue: \"rhoncus diam metus id arcu\"},\n{name: \"Elementum\", dataValue: \"quis odio sodales ornare quis eu\"},\n{name: \"Sagittis\", dataValue: \"torquent per conubia nostra, per inceptos\"},\n{name: \"Aliquam\", dataValue: \"molestie auctor tortor ac tincidunt\"},\n{name: \"Nullam\", dataValue: \"in orci eros, vitae convallis neque\"},\n{name: \"Mauris\", dataValue: \"luctus adipiscing ligula urna a nisl\"},\n{name: \"Pellentesque\", dataValue: \" ante lectus, mollis ut suscipit id\"}]","type":"EntryData"}, {}],
    silkIconImageList: ["wm.ImageList", {"colCount":39,"height":16,"iconCount":90,"url":"lib/images/silkIcons/silk.png","width":16}, {}],
	paletteImageList: ["wm.ImageList", {"colCount":50,"height":16,"iconCount":50,"url":"images/palette_imagelist.png","width":16}, {}],

	navImageList: ["wm.ImageList", {width: 24, height: 28, colCount: 10, url: "images/navBtns.png"}, {}],
//	canvasToolbarImageList: ["wm.ImageList", {width: 24, height: 24, colCount: 20, url: "images/canvasToolbarBtns.png"}, {}],
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
    canvasToolbarImageList16: ["wm.ImageList", {width: "16", height: "16", colCount: 22, url: "images/canvasToolbarBtns16.png"}, {}],
    contextualMenu: ["wm.PopupMenu", {"fullStructureStr":"[{\"label\":\"Help\",\"iconClass\":undefined,\"imageList\":null,\"children\":[]}]"},{onclick: "contextualMenuClick"}],
    genericDialog: ["wm.GenericDialog", {_classes: {domNode: ["studiodialog"]}}],
    startPageDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, width: "790px", height: "465px", title: "", modal: true, hideControls: true, noEscape: true, pageName: "Start", corner: "cc" }],
    deploymentDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, width: "900px", height: "680px", title: "Deployment", modal: true, hideControls: true, noEscape: true, pageName: "DeploymentDialog", deferLoad: true,   titlebarButtons: "StudioHelpIcon"},{onMiscButtonClick: "deploymentHelp"}],
    loginDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]},  width: "250px", height: "325px", title: "Login", modal: true, hideControls: true, noEscape: true, pageName: "Login", deferLoad: true}],
    bindDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, pageName: "BindSourceDialog", deferLoad: false, modal: false, positionLocation: "tl", width: "650px", height: "400px", hideControls: true, title: "Binding...", noLeftRightDocking: false,noTopBottomDocking: false}, {onHide: "endBind"}],
    newProjectDialog: ["wm.PageDialog", {_classes: {domNode: ["studiodialog"]}, width: "492px", height: "450px", title: "New Project", modal: true, hideControls: true, noEscape: false, pageName: ""}],
    helpDialog: ["wm.GenericDialog", {_classes: {domNode: ["studiodialog"]},   "height":"77px","modal":false,"noEscape":false,"title":"Help","userPrompt":"","width":"300px", modal: false,button1Caption: "OK", button1Close: true, corner: "tr", noLeftRightDocking: false,noTopBottomDocking: false}, {}],

    progressDialog: ["wm.DesignableDialog", {_classes: {domNode: ["studiodialog"]}, width: "350px", height: "120px", title: "Saving...", noMinify: true, noMaxify: true, modal: true, noEscape: false}, {}, {
	progressDialogContainer: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"height":"100%","horizontalAlign":"left","margin":"0","padding":"10","verticalAlign":"top","width":"100%"}, {}, {
	    saveDialogProgress: ["wm.dijit.ProgressBar", {width: "100%", height: "48px", progress: 0}],
	    saveDialogLabel: ["wm.Label", {_classes: {domNode:["StudioLabel"]},width: "100%", height: "30px", align: "center"}]
    }]
    }],
	layout: ["wm.Layout", {height: "100%"}, {}, {
	    dialog: ["wm.Dialog", {height: "400px", border: "1", borderColor: "#666E80", _noAnimation: true, noEscape: false}, {}],

	    navigationBar: ["wm.Panel", {_classes: {domNode: ["StudioMenuBar"]}, width: "100%", height: "28px", border: "0", layoutKind: "left-to-right"}, {}, {
			navBtnHolder: ["wm.Panel", {width: "100%", border: "0", layoutKind: "left-to-right", imageList: "navImageList", horizontalAlign: "left"}, {}, {
			    navigationMenu: ["wm.DojoMenu", {_classes: {domNode: ["StudioMenuBar", "StudioMenu"]},
height: "29px", width: "420px",
							   /* This property included as an example; not required unless localizing */
							   localizationStructure: {
							       "projectPopupBtn": "File",
							       "newProjectItem": "New Project...",
							       "saveProjectItem": "Save",
							       "openProjectItem": "Open Project...",
							       "closeProjectItem": "Close Project"
							   },
						      "fullStructure":
						      [
							  {"defaultLabel" :"File",
							 idInPage: "projectPopupBtn",
							 "children":
							 [
							     {"defaultLabel":"New Project...",
							       idInPage: "newProjectItem",
							       onClick: "newProjectClick",
							       iconClass: "newProjectItem"},
							     {"defaultLabel": "Save",
							       idInPage: "saveProjectItem",
							       onClick: "saveProjectClick",
							       iconClass: "Studio_canvasToolbarImageList16_1"},

                                                              {"defaultLabel": "Open Project...",
							       idInPage: "openProjectItem",
							       onClick: "openProjectClick",
							       iconClass: "openProjectItem"},
                                                              {"defaultLabel": "Close Project",
							       idInPage: "closeProjectItem",
							       onClick: "closeClick",
							       iconClass: "closeProjectItem"},
                                                              {"defaultLabel": "Revert  Project",
							       idInPage: "revertProjectItem",
							       onClick: "revertProjectClick",
							       iconClass: "openProjectItem"},
                                                              {"defaultLabel": "Copy Current Project...",
							       idInPage: "copyProjectItem",
							       onClick: "copyProjectClick",
							       iconClass: "copyProjectItem"},
                                                              {"defaultLabel": "Delete Current Project",
							       idInPage: "deleteProjectItem",
							       onClick: "deleteProjectClick",
							       iconClass: "deleteProjectItem"},
                                                             {"defaultLabel": "Export Project...",
							       idInPage: "exportProjectItem",
							       onClick: "exportClick",
							       iconClass: "exportProjectItem"},
                                                             {"defaultLabel": "Import...",
							       idInPage: "importProjectItem",
							       onClick: "importMultiple",
							       iconClass: "importProjectItem"},
                                                              {"defaultLabel": "Deploy Project",
							       idInPage: "deployProjectItem",
							       children: [
								   {label: "New Deployment...",
								    idInPage: "newProjectDeployItem",
								    onClick: "newDeployClick"},
								   {label: "Manage Deployments...",
								    idInPage: "deploySettingsItem",
								    onClick: "settingsDeployClick"},
								  /* {label: "Manage CloudFoundry Apps...",
								    idInPage: "cloudfoundryManagementItem",
								    onClick: "cloudFoundryDeploymentsClick"},*/
								   {separator:true},
								   {label: "Phonegap Build",
								    idInPage: "phonegapBuildItem",
								    onClick: "getPhonegapBuild"}
							       ],
							       iconClass: "deployProjectItem"},
                                                              {"defaultLabel": "Preferences...",
							       idInPage: "preferencesItem",
							       onClick: "projectSettingsClick",
							       iconClass: "preferencesItem"},
							     {"defaultLabel": "Modify Studio",
							      idInPage: "modifyStudioItem",
							      iconClass: "importProjectItem",
							      children: [
								  {"defaultLabel": "Apply Studio Patches...",
								    idInPage: "studioPatchesItem",
								   onClick: "uploadStudioPatches"},
								  {"defaultLabel": "Import Partner Services...",
								    idInPage: "partnerServicesItem",
								   onClick: "importPartnerService"}
							      ]
							     }
							 ]},
							  {"defaultLabel": "Edit",
								idInPage: "editPopupBtn",
								"children": [
                                {"defaultLabel": "Cut",
								 idInPage: "cutItem",
								 onClick: "cutClick",
								 iconClass: "cutItem"},
							            {"defaultLabel": "Copy",
								 idInPage: "copyItem",
								 onClick: "copyClick",
								 iconClass: "copyItem"},
								{"defaultLabel": "Paste",
								 idInPage: "pasteItem",
								 onClick: "pasteClick",
								 iconClass: "pasteItem"},
							            {"defaultLabel": "Delete",
								 idInPage: "deleteItem",
								 onClick: "deleteClick",
								 iconClass: "deleteItem"},
							            {"defaultLabel": "Undo",
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
							  {"defaultLabel": "Insert",
							     idInPage: "insertPopupBtn",
							     "children":[
							     ]},
							  {"defaultLabel": "Page",
							    idInPage: "pagePopupBtn",
							    "children":[
							        {"defaultLabel": "New...",
								 idInPage: "newPageItem",
								 onClick: "newPageClick",
								 iconClass: "newPageItem"},
							        {"defaultLabel": "Save As...",
								 idInPage: "saveAsPageItem",
								 onClick: "savePageAsClick",
								 iconClass: "saveAsPageItem"},
							        {"defaultLabel": "Import Page...",
								 idInPage: "importPageItem",
								 onClick: "importProjectClick",
								 iconClass: "importPageItem"},
								{"defaultLabel": "Delete",
								 idInPage: "deletePageItem",
								 iconClass: "deleteItem",
								 children: []},
							        {"defaultLabel": "Set As Home Page",
								 idInPage: "setHomePageItem",
								 //onClick: "makeHomeClick",
								 iconClass: "setHomePageItem",
								 children: []}]},
							    {"defaultLabel": "Services",
							     idInPage: "servicesPopupBtn",
							     "children":[
							     ]}
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
			    runPopup: ["wm.PopupMenuButton", {_classes: {domNode: ["StudioMenu"]},iconWidth: "24px", iconHeight: "24px", iconClass: "studioProjectRun", caption: "Run", width: "90px", height: "29px", border: "0", margin: "0", padding: "0", fullStructure: [{label: "Run", iconClass: "studioProjectRun"},{label: "Test", iconClass: "studioProjectTest"},{label:"Compile", iconClass: "studioProjectCompile"}]},{onclick: "runProjectClick", onchange: "runProjectChange"}],
/*
				navTestBtn: ["wm.ToolButton", {width: "75px", hint: bundleStudio.T_TestTip, caption: "<img src=\"images/runapp_24.png\"/><span style=\"font-weight:bold\"> Test </span>", height: "29px"}, {onclick: "runProjectPopupClick"}],
				navRunBtn: ["wm.ToolButton", {width: "75px", hint: bundleStudio.T_RunTip, caption: "<img src=\"images/runapp_24.png\"/><span style=\"font-weight:bold\"> Run </span>", height: "29px"}, {onclick: "runProjectClick"}],
				*/
			    projectNameLabel: ["wm.Label", {_classes: {domNode:["StudioLabel"]}, width: "150px", margin: "0,0,0,20",autoSizeWidth: true, caption: ""}, {}],
			    canvasSizeSelect: ["wm.SelectMenu", {_classes: {domNode:["StudioEditor"]},showing: false, caption: "Canvas", margin:"4,0,4,20", width: "250px", height: "24px", captionSize: "70px", displayField: "dataValue", dataField: "dataValue", options: "320x480 (iphone), 480x320 (iphone), 640x960 (iphone 4), 960x640 (iphone 4), 480x800 (HTC Desire), 800x480 (HTC Desire), 1024x768 (ipad), 768x1024 (ipad)" },{onchange: "canvasSelectChanged"}],
			    navBarSpacer7: ["wm.Spacer", {width: "100%", border: "0"}, {}],
			    userLabel: ["wm.Label", {_classes: {domNode:["StudioLabel"]},width: "250px", autoSizeWidth: true, margin: "0,0,0,20", caption: ""}, {}],
			    navEditAccountBtn: ["wm.ToolButton", {showing: false, width: "150px", margin: "0,0,0,20", hint: "Edit Account", caption: "<img src=\"images/cloud_user_settings.png\"/><span style=\"font-weight:bold\"> Edit Account </span>", height: "29px"}, {onclick: "editAccountClick"}],
			    navLogoutBtn: ["wm.ToolButton", {showing: false,width: "100px", hint: "Sign Off", caption: "<img src=\"images/cloud_logout.png\"/><span style=\"font-weight:bold\"> Logout </span>", height: "29px"}, {onclick: "logoutClick"}],
			    menuBarHelp: ["wm.Label", {_classes: {domNode:["StudioLabel"]},caption: "<span class='StudioHelpIcon'></span>Help", width: "60px", height: "100%"}, {onclick: "menuBarHelpClick"}],
                            trackerImage: ["wm.Picture", {height: "1px", width: "1px"}]
			}]



		}],
	    benchbevel11_11s: ["wm.Bevel", {border: "", bevelSize: "1"}, {}],
	    panel1: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		dockLeftPanel: ["wm.Panel", {height: "100%", width: "200px", border: "0", dockLeft: true, verticalAlign: "top",horizontalAlign: "left"}, {}, {
		    panel2: ["wm.Dialog", {_classes: {domNode: ["studiodialog","Docked"]}, title: "", height: "100%", width: "100%", border: "0", _dockData:{border:"3",edge:"l"}, margin: "0", verticalAlign: "top", horizontalAlign: "left", modal:false,docked: true, minHeight: "400", noTopBottomDocking: true, noLeftRightDocking:false}, {onClose: "dockPalette"}, {
/*
				leftToolbarButtons: ["wm.Panel", {height: "29px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", border: 0, padding: "0,4"}, {}, {
					nspcr4: ["wm.Spacer", {width: "2px"}, {}],
					designerCanvasBtn: ["wm.ToolButton", {border: "0", borderColor: "#294473", margin: "0", padding: "0,6", height: "100%", width: "56px", caption: "", hint: bundleStudio.T_CanvasTip}, {onclick: "navGotoDesignerClick"}],
					designerSourceBtn: ["wm.ToolButton", {border: "0", borderColor: "#294473", margin: "0", padding: "0,6", height: "100%", width: "57px", caption: "", hint: bundleStudio.T_SourceTip}, {onclick: "navGotoSourceClick"}]
				}],
*/
			left: ["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs", "StudioDarkLayers"]}, minWidth: 50, clientBorder: "1,1,0,0"}, {onchange: "leftTabsChange"}, {
			    mlpal: ["wm.Layer", {_classes: {domNode: ["StudioLeftLayer"]}, caption: "Palette", padding: "3,0,0,0"}, {onShow: "resetPaletteSearch"}, {
					paletteSearch: ["wm.Text", {_classes: {domNode:["StudioEditor"]},caption: "", width: "100%", height: "27px", placeHolder: "Find Component/Widget", padding: "2,5,2,5", margin: "2,0,2,0", changeOnKey: true, resetButton: true}, {onchange: "paletteSearchChange"}],
					benchbevel6_6: ["wm.Bevel", {border: ""}, {}],
					palette: ["wm.Palette", {height: "100%", border: ""}, {}],
					paletteTips: ["wm.Label", {_classes: {domNode:["StudioLabel"]},width: "100%", height: "24px", border: "3,0,0,0", borderColor: "#666E80", backgroundColor: "#424A5A", autoSizeHeight: true,singleLine: false, showing: false}]
					/*
					paletteSplitter: ["wm.Splitter", {border: "0", layout: "bottom"}, {}],
					componentPalette: ["wm.Palette", {height: "300px", border: ""}, {}]*/
				    }],
				    leftObjects: ["wm.Layer", {_classes: {domNode: ["StudioLeftLayer"]}, caption: "Model", padding: "3,0,0,0"}, {onShow: "resetTreeSearch"}, {
					treeSearch: ["wm.Text", {_classes: {domNode:["StudioEditor"]},caption: "", width: "100%",  height: "27px", placeHolder: "Widget", padding: "2,5,2,5", margin: "2,0,2,0", changeOnKey: true, resetButton: true}, {onchange: "treeSearchChange"}],
					benchbevel5_5: ["wm.Bevel", {border: ""}, {}],
					label12: ["wm.Label", {_classes: {domNode:["StudioLabel"]},height: "22px", width: "100%", caption: "Visual Components", border: "", padding: "4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}],
					widgetsTree: ["wm.DraggableTree", {multiSelect:1,height: "100%", border: "", padding: "3,0,0,0", dropBetweenNodes: true}, {onselect: "treeSelect", ondeselect: "treeSelect", onCanDropNode: "onCanDropNode", onNodeDrop: "onWidgetTreeNodeDrop"}]

				    }],
			    componentModel: ["wm.Layer", {_classes: {domNode: ["StudioLeftLayer"]}, caption: "Services", padding: "3,0,0,0"}, {onShow: "resetCompTreeSearch"}, {
					compTreeSearch: ["wm.Text", {_classes: {domNode:["StudioEditor"]},caption: "", width: "100%",  height: "27px", placeHolder: "Find Component", padding: "2,5,2,5", margin: "2,0,2,0", changeOnKey: true, resetButton: true}, {onchange: "compTreeSearchChange"}],
					benchbevel50_5: ["wm.Bevel", {border: ""}, {}],
					compLabel11: ["wm.Label", {_classes: {domNode:["StudioLabel"]},height: "22px", width: "100%", caption: "Services", border: "", padding: "4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}],
					tree: ["wm.DraggableServiceTree", {height: "200px", border: "", padding: "4,0,0,0"}, {onselect: "treeSelect", onNodeDrop: "onServiceNodeDrop"}],
					splitter222: ["wm.Splitter", {_classes: {domNode: ["StudioSplitter"]},border: "0", layout: "top"}, {}],
					label1222: ["wm.Label", {_classes: {domNode:["StudioLabel"]},height: "22px", width: "100%", caption: "Components", border: "", padding: "4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}],

					compTree: ["wm.Tree", {multiSelect:1,height: "100%", border: "", padding: "4,0,0,0"}, {onselect: "treeSelect", ondeselect: "treeSelect"}]
				    }]

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
				}]
			}]
		}],
		splitterPanel1: ["wm.Panel", {_classes: {domNode: ["StudioSplitterPanel"]}, border: "0", margin: "0", padding: "0", layoutKind: "top-to-bottom", width:"4px",height: "100%", horizontalAlign: "left", verticalAlign: "top"},{},{
		    splitterSpacer: ["wm.Spacer", {_classes: {domNode: ["StudioTabBarBackground"]}, height: "32px", width:"100%"}],
		    splitter1: ["wm.Splitter", {_classes: {domNode: ["StudioSplitter", "StudioMainVerticalSplitter"]},border: "0", layout: "left", parentIsSplitter:1, height: "100%", width: "4px"}, {}]
		}],
		tabs: ["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs", "StudioDarkLayers", "NoRightMarginOnTab"]}, conditionalTabButtons:true, customCloseOrDestroy: "closeServiceParentTab"}, {oncanchange: "tabsCanChange", onchange: "tabsChange"}, {
		    workspace: ["wm.Layer", {caption: "Canvas", layoutKind: "top-to-bottom"}, {}, {
			workspaceInner: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right"}, {}, {
			    main: ["wm.Panel", {height: "100%", width: "100%", border: "1,1,0,1", layoutKind: "top-to-bottom", borderColor: "#959DAB"}, {}, {
				ribbon: ["wm.Panel", {height: "30px", width: "100%", border: "0", layoutKind: "top-to-bottom", padding: "0"}, {}, {
				    ribbonInner: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, height: "30px", width: "100%", border: "0", layoutKind: "left-to-right", padding: "0"}, {}, {
					studioToolbarButtons: ["wm.Panel", {height: "100%", width: "100%", border: "", layoutKind: "left-to-right", imageList: "canvasToolbarImageList16", padding: "0,0,0,4", verticalAlign: "middle"}, {}, {
							/*pagePopupBtn: ["wm.PopupButton", {width: "32px", caption: "<img src=\"images/dropArrow.png\"/>", popupWidth: "150", imageIndex: 14, imageList: "smallToolbarImageList"}, {}, {
								pageBtnItem4: ["wm.Item", {caption: "New Page...", imageIndex: 5}, {onclick: "newPageClick"}],
								pageBtnItem16: ["wm.Item", {caption: "Save", imageIndex: 8}, {onclick: "saveProjectClick"}],
								pageBtnItem6: ["wm.Item", {caption: "Save As...", imageIndex: 7}, {onclick: "savePageAsClick"}],
								pageBtnItem9: ["wm.Item", {caption: "Set As Home Page", imageIndex: 2}, {onclick: "makeHomeClick"}]
							}],*/
					    pageSaveBtn: ["wm.studio.ToolbarButton", {imageIndex: 1, hint: "Save"}, {onclick: "saveProjectClick"}],
							toolbarspacer1: ["wm.studio.ToolbarSpacer", {}, {}],
					    cutBtn: ["wm.studio.ToolbarButton", {imageIndex: 2, hint: "Cut"}, {onclick: "cutClick"}],
					    copyBtn: ["wm.studio.ToolbarButton", {imageIndex: 3, hint: "Copy"}, {onclick: "copyClick"}],
					    pasteBtn: ["wm.studio.ToolbarButton", {imageIndex: 4, hint: "Paste"}, {onclick: "pasteClick"}],
					    deleteBtn: ["wm.studio.ToolbarButton", {imageIndex: 5, hint: "Delete"}, {onclick: "deleteClick"}],
					    undoBtn: ["wm.studio.ToolbarButton", {imageIndex: 6, hint: "Undo", disabled: true}, {onclick: "undoClick"}],
							toolbarspacer2: ["wm.studio.ToolbarSpacer", {}, {}],
							/*liveLayoutBtn: ["wm.ToolButton", {width: "24px", imageIndex: 7, hint: "Live Layout"}, {onclick: "refreshLiveData"}],*/
					    outlineBtn: ["wm.studio.ToolbarButton", {imageIndex: 8, hint: "Toggle Outlined View"}, {onclick: "outlinedClick"}],
						    pageSelect: ["wm.SelectMenu", {_classes: {domNode:["StudioEditor"]},caption: "Open Page", margin:"0,0,0,20", width: "50%", maxWidth: "250", height: "24px", captionSize: "70px", displayField: "dataValue", dataField: "dataValue"},{onchange: "pageSelectChanged"},{
							binding: ["wm.Binding",{},{}, {
							    wire: ["wm.Wire", {"source":"app.pagesListVar","targetProperty":"dataSet"}, {}]
							}]
						    }],
						    languageSelect: ["wm.SelectMenu", {_classes: {domNode:["StudioEditor"]},caption: "Language", margin:"0,0,0,20", width: "50%", maxWidth: "180", height: "24px", captionSize: "70px", displayField: "dataValue", dataField: "dataValue", dataValue: "default", options: "default", restrictValues: false},{onchange: "languageSelectChanged"},{
						    }],
						    deviceDesignToggle: ["wm.ToggleButton", {showing: false, _classes: {domNode: ["StudioButton"]},iconUrl: "lib/images/silkIcons/phone.png", captionUp: "", captionDown: "", clicked: true, width: "25px", height: "100%", "hint": "Multi-device design"}, {onclick: "devicesToggleClick"}]

						}]
					}],
				devicesRibbonInner: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, height: "30px", width: "100%", layoutKind: "left-to-right", border:"1,0,0,0", borderColor: "#999"}, {}, {
				    binding: ["wm.Binding",{},{}, {
					wire: ["wm.Wire", {"source":"deviceDesignToggle.clicked","targetProperty":"showing"}, {}]
				    }],
				    devicesTogglePanel: ["wm.ToggleButtonPanel", {width: "250px", height: "100%", layoutKind: "left-to-right", buttonMargins: "5,0,5,0", border: "0"}, {}, {
					    binding: ["wm.Binding",{},{}, {
					        wire: ["wm.Wire", {"source":"desktopToggleButton","targetProperty":"currentButton"}, {}]
					    }],
    					desktopToggleButton: ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]}, "width": "100%", height: "100%", margin: "0", caption: "Desktop", border: "0,1,0,0"}, {onclick: "designDesktopUI"}],
    					tabletToggleButton:  ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]},"width": "100%", height: "100%", margin: "0", caption: "Tablet", border: "0,1,0,0"},  {onclick: "designTabletUI"}],
    					phoneToggleButton:   ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]},"width": "100%", height: "100%", margin: "0", caption: "Phone", border: "0,0,0,0"},   {onclick: "designPhoneUIClick"}],
    					mobileFoldingToggleButton:   ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]},"width": "100%", height: "100%", margin: "0", caption: "Folding", hint: "Enable this button by enabling mobile folding in your Page's properties in the services tab", border: "0", showing:false},   {onclick: "designMobileFolding"}]
				    }],
				    deviceSettingSpacer: ["wm.Spacer", {width: "100%"}],
                    orientationTogglePanel: ["wm.ToggleButtonPanel", {width: "150px", height: "100%", layoutKind: "left-to-right", buttonMargins: "5,0,5,0", border: "0"}, {}, {
                         binding: ["wm.Binding",{},{}, {
                            wire: ["wm.Wire", {"source":"portraitToggleButton","targetProperty":"currentButton"}, {}]
                        }],
                        portraitToggleButton: ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]}, "width": "100%",  height: "100%", margin: "0", caption: "Portrait", border: "0,1,0,0"}, {onclick: "deviceSizeSelectChanged"}],
                        landscapeToggleButton:  ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]},"width": "100%", height: "100%", margin: "0", caption: "Landscape", border: "0,0,0,0"},  {onclick: "deviceSizeSelectChanged"}]
                    }],
				    deviceSizeSelect: ["wm.SelectMenu", {_classes: {domNode:["StudioEditor"]},caption: "Size", margin:"4,0,4,15", width: "180px", height: "24px", captionSize: "50px",  displayField: "name", dataField: ""},{onchange: "deviceSizeSelectChanged"},{
					binding: ["wm.Binding",{},{}, {
					    wire: ["wm.Wire", {"source":"deviceSizeVar.queriedItems","targetProperty":"dataSet"}, {}]
					}]
				    }],

				    deviceBarHelpBtn: ["wm.ToolButton", {width: "20px", height: "20px", margin: "5,0,0,0", hint: "Phone and Tablet sizes are not exact; you need the real device to see how it will really look.  Click for more help", _classes: {domNode: ["StudioHelpIcon"]}}, {onclick: "showDeviceBarHelp"}]
				}]
				}],
				bench: ["wm.Panel", {_classes: {domNode: ["WMApp"]}, width: "100%", height: "100%", border: "1, 0, 0, 0", backgroundColor: "silver", borderColor: "#666E80", verticalAlign: "middle", horizontalAlign: "center"}, {}, {
				    designerWrapper: ["wm.Panel", {width: "100%", height: "100%", autoScroll: true, horizontalAlign:"center", verticalAlign: "middle"}, {}, {
                        designer: ["wm.Designer", {_classes: {domNode: ["studio_tree_dropTarget", "wmapproot"]}, height: "100%", width: "100%", backgroundColor: "white", borderColor: "black", border: ""}, {onselect: "designerSelect", onmove: "designerMove"}]
                    }],
				    benchbevel: ["wm.Bevel", {border: ""}, {}],
						    statusPanel: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "24px", border: "1,0,0,0", borderColor: "#666E80", backgroundColor: "#424A5A", horizontalAlign: "left", verticalAlign: "top"},{}, {
                                warningsButton: ["wm.studio.ToolbarButton", {showing: false, iconUrl: "lib/images/boolean/Signage/Caution.png", hint: "Click for details on errors in your project"}, {onclick: "showProjectDesignWarnings"}],
    							statusBarLabel: ["wm.Label", {_classes: {domNode:["StudioLabel"]},width: "100%", height: "100%", caption: ""}],
    							status: ["wm.JsonStatus", {iconWidth: "26", height: "100%", border: "0, 0, 0, 1", borderColor: "#666E80", width: "300px"}, {}]
						    }]
						}]

					}],
			    splitter3b: ["wm.Splitter", {_classes: {domNode: ["StudioSplitter"]},border: "", minimum:200,maximum: 500}, {}],
			    PIPanel: ["wm.Panel", { height: "100%", width: "250px", border: "0", padding: "0", layoutKind: "top-to-bottom", dockRight:true, border: "1,0,0,1", borderColor: "#959DAB" }, {}, {
				PIContents: ["wm.DesignableDialog", {_classes: {domNode: ["studiodialog","Docked", "StudioDarkPanel"]},width: "100%", height: "100%", _dockData: {border:"3", edge: "r", w: 400,title: "Property Panel"}, border: "0", margin: "0", containerWidget:"inspector",modal:false,docked: true, minHeight: "300", noTopBottomDocking: true, noLeftRightDocking: false, titlebarButtons: "Studio-inspectorDialogToggle", noMinify: 1, noMaxify:1}, {onClose: "dockPropertyPanel", onMiscButtonClick: "togglePropertyDialogDock"}, {
				    inspectorToolbarOuter: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, width:"100%", height: "60px", layoutKind: "top-to-bottom", horizontalAlign: "left", verticalAlign: "top",padding:"3,0,2,0"},{},{
					inspectorToolbar2: ["wm.Panel", {width: "100%", height: "22px", layoutKind: "left-to-right", horizontalAlign: "left", verticalAlign: "top",padding:"0"},{},{
					    propertySearchBar: ["wm.Text", {_classes: {domNode:["StudioEditor"]},resetButton: true, width: "100%", changeOnKey: true, emptyValue: "emptyString", placeHolder: "Find Property"},{onchange: "inspector.propertySearch"}],
					    propertySearchBarSpacer: ["wm.Spacer", {width: "20px"}],
					    propertiesMenu: ["wm.PopupMenu", {
						_classes: {domNode: ["StudioMenu"]},
						"fullStructure":[
						{idInPage: "togglePropertiesMultiactiveItem", "label":"One Accordion Open","separator":undefined,"defaultLabel":"One Accordion Open","isCheckbox":true,"onClick":"toggleMultiactive"},
						{idInPage: "openPublishedPropsItem", "label":"Publish Properties...","separator":undefined,"defaultLabel":"Publish Properties...","isCheckbox":false,"onClick":"editPublishedProperties"}/*,
						{"separator":true,"defaultLabel":"Separator"},
						{"label":"Component Info","defaultLabel":"Component Info","isCheckbox":false,"onClick":"generateDiagnostics", onClick: "inspector.generateComponentInfo"},
						{idInPage: "writeDocumentationMenuItem", "label":"Write Documentation","defaultLabel":"Write Documentation","isCheckbox":true,"onClick":"selected.viewDocumentation"},

						{"separator":true,"defaultLabel":"Separator"}*/
					    ]}, {}],
					propMenuButton: ["wm.studio.ToolbarButton", {}, {onclick: "propertiesMenu"}]
				    }],

					inspectorToolbar: ["wm.ToggleButtonPanel", {_classes: {domNode: ["StudioToolBar"]},width: "100%", height: "100%", layoutKind: "left-to-right", horizontalAlign: "center", verticalAlign: "top",border: "0", margin:"3,0,0,0", buttonMargins: "5,0,5,0"},{},{
					    togglePropertiesRequiredButton: ["wm.Button", {_classes: {domNode: ["wmtogglebutton"]}, height: "100%", width: "100px", minWidth: 100, caption: "Required", border:"0,1,0,0",clicked:true, showing: false}, {onclick: "inspector.toggleRequiredProperties"}],
					togglePropertiesRecommendedButton: ["wm.Button", {_classes: {domNode: ["wmtogglebutton","toggleButtonDown"]}, height: "100%", width: "100px", minWidth: 100, caption: "Recommended", border:"0,1,0,0",clicked:true}, {onclick: "inspector.toggleAdvancedPropertiesSome"}],
					togglePropertiesAdvancedButton: ["wm.Button", {_classes: {domNode: ["wmtogglebutton"]}, height: "100%", width: "40px", caption: "All", border:"0"}, {onclick: "inspector.toggleAdvancedPropertiesAll"}]
				    }]
				    }],
				    inspectorWrapper: ["wm.Panel", {width: "100%", height: "100%", autoScroll:true, layoutKind: "top-to-bottom",padding: "2,0,2,0", verticalAlign: "top", horizontalAlign: "left"}, {}, {
					inspector: ["wm.PropertyInspector", {_classes: {domNode: ["Inspector"]},clientBorder: "0", clientBorderColor: "black", captionBorderColor: "", captionBorder: "1", height: "100px", width:"100%", border: "0", padding: "2",margin: "3"}, {}, {}]
				    }]
				}]/*,
				benchbevel4: ["wm.Bevel", {}, {}]*/
			    }]
		    }]
		    }],
		    sourceTab: ["wm.Layer", {caption: "Source" }, {}, {
				    /*
					sourceRibbon: ["wm.Panel", {height: "29px", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4"}, {}, {
						sourcePageSaveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveProjectClick"}],
						sourceToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
						sourceLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}]
					}],*/
			sourceTabs: ["wm.studio.TabLayers", {manageURL:1,_classes: {domNode: ["StudioTabs", "StudioDarkLayers", "StudioDarkerLayers"]},  border: "1,0,0,1", clientBorder: "1,0,0,0"}, {onchange: "sourceTabsChange", oncanchange: "sourceTabsCanChange"}, {
					    scriptLayer: ["wm.Layer", {caption: "Script"}, {onShow: "editArea.focus"}, {
							scriptRibbon: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, height: "29px", width: "100%", border: "0", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#959DAB", verticalAlign: "middle"}, {}, {
							    scriptPageSaveBtn: ["wm.studio.ToolbarButton", {hint: "Save", imageIndex: 8}, {onclick: "saveScriptClick"}],
							    scriptPageFindBtn: ["wm.studio.ToolbarButton", {hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findScriptClick"}],
							    scriptPageImportBtn: ["wm.studio.ToolbarButton", {hint: "Import JS Library", imageIndex: 25}, {onclick: "importJavascriptLibrary"}],
							    scriptPageRefreshBtn: ["wm.studio.ToolbarButton", {hint: "Refresh from Server", imageIndex: 27}, {onclick: "refreshScriptClick"}],
							    scriptPageFormatBtn: ["wm.studio.ToolbarButton", {hint: "Reformat Code", imageIndex: 29}, {onclick: "formatScriptClick"}],
							    scriptPageWordWrapBtn: ["wm.studio.ToolbarButton", {_classes: {domNode: ["ToggleWordWrap", "StudioToolbarButton"]}, hint: "Toggle Line Wrapping", imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapScriptClick"}],
							    /*scriptPageCompileBtn: ["wm.studio.ToolbarButton", {width: "24px", margin: "0,4,0,4", hint: "Validation", imageIndex: 28}, {onclick: "validateScriptClick"}],*/
							    scriptPageCompletionsBtn: ["wm.studio.ToolbarButton", {hint: "Auto Completion", imageIndex: 7, imageList: "canvasToolbarImageList16"}, {onclick: "listCompletions"}],
							    scriptPageDictionaryBtn: ["wm.studio.ToolbarButton", {hint: "Edit Localization Dictionary", imageIndex: 53, imageList: "silkIconImageList"}, {onclick: "editDictionary"}],
							    scriptPageHelpBtn: ["wm.studio.ToolbarButton", {hint: "Help", imageIndex: 26}, {onclick: "showEditorHelp"}],
							    scriptToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
							    /*scriptPageCompileChkBtn: ["wm.Checkbox", {caption: "Validate on Save", width: "120px"}, {onchange: "validateScriptCheckboxChange"}]*/
							    editAreaZoomWarningLabel: ["wm.Label", {_classes: {domNode:["StudioLabel","AceEditorZoomWarning"]},width: "100px", align: "center", height: "100%", caption: "Zoomed <div class='StudioWarningIcon'/>", showing: false, hint: "<div class='StudioWarningIcon'></div>Zooming your browser may cause the code editor selection to work improperly; Restoring your browser to its standard zoom level will fix this"}],
							    editAreaFullPath: ["wm.Label", {_classes: {domNode:["StudioLabel"]},width: "100%", align: "right", height: "100%"}]
							}],
							editAreaPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left"}, {}, {
							    editArea: ["wm.AceEditor", {width: "100%", height: "100%", minWidth: 20}, {onCtrlKey: "scriptEditorCtrlKey", onChange: "setEditAreaDirty", onChange1: "updateAutoComplete", onShow: "updateAutoComplete", onHide: "hideAutoComplete"}],
							    editAreaSplitter: ["wm.Splitter", {_classes: {domNode: ["StudioSplitter"]}}],
							    autoCompletionDialog: ["wm.Panel", {width: "200px", minWidth: 20, height: "100%", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left", margin: "5"}, {}, {
								listPanelLabel: ["wm.Label", {_classes: {domNode:["StudioLabel"]},width: "100%", height: "20px", caption: "Completions"}],
								autoCompletionList: ["wm.List", {_classes: {domNode: ["StudioList"]}, renderVisibleRowsOnly: false, width: "100%", height: "100%", headerVisible: false, dataFields: "name", columns: [{show:true,field:"name",cssClass:"if (${name}.match(/\<b\>/)) {'CompletionListHeader';}" }]}, {onSelect: "autoCompletionSelect", ondblclick: "insertCompletedText"}, {
								    binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {targetProperty: "dataSet", source: "autoCompletionVariable"}]
								    }]
								}],
								autoCompleteDetails: ["wm.Html", {width: "100%", height: "100px", autoSizeHeight: true}],
								autoCompletionHtmlLabel: ["wm.Label", {_classes: {domNode:["StudioLabel"]},width: "100%", height: "20px", caption: "Description"}],
								autoCompletionHtml: ["wm.Html", {width: "100%", height: "100%", padding: "4", backgroundColor: "white", html: "Select a term to see description; double click to add it to your code"}]
							    }]
							}]
					    }],
					    cssLayer: ["wm.Layer", {caption: "CSS"}, {}, {
						    cssTabs: ["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs", "StudioDarkLayers", "StudioDarkerLayers"]}, clientBorder: "1,0,0,0"}, {}, {
								appCssLayer: ["wm.Layer", {caption: "Application CSS"}, {onShow: "appCssEditArea.focus"}, {
        							appCssRibbon: ["wm.Panel", {_classes: {domNode: [""]}, height: "29px", width: "100%", border: "0,0,1,0", borderColor: "#959DAB", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", verticalAlign: "middle"}, {}, {
        							    appCssPageSaveBtn: ["wm.studio.ToolbarButton", {hint: "Save", imageIndex: 8}, {onclick: "saveCssClick"}],
        							    appCssPageFindBtn: ["wm.studio.ToolbarButton", {hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findAppCssClick"}],
        							    appCssPageImportBtn: ["wm.studio.ToolbarButton", {hint: "Import CSS Resource", imageIndex: 25}, {onclick: "importAppCssLibrary"}],
        							    appCssPageWordWrapBtn: ["wm.studio.ToolbarButton", {_classes: {domNode: ["ToggleWordWrap", "StudioToolbarButton"]},hint: "Toggle Line Wrapping", imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapAppCssClick"}],
        							    appCssPageHelpBtn: ["wm.studio.ToolbarButton", {hint: "Help", imageIndex: 26}, {onclick: "showCssEditorHelp"}],
        							    appCssToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
        							    appCssHelpLink: ["wm.Label", {_classes: {domNode:["StudioLabel"]},width: "80px", caption: "Styling Wiki"}, {}],
        							    appCssEditAreaZoomWarningLabel: ["wm.Label", {_classes: {domNode:["StudioLabel","AceEditorZoomWarning"]},width: "100px", align: "center", height: "100%", caption: "Zoomed <div class='StudioWarningIcon'/>", showing: false, hint: "<div class='StudioWarningIcon'></div>Zooming your browser may cause the code editor selection to work improperly; Restoring your browser to its standard zoom level will fix this"}],
        							    cssAppFilePathLabel: ["wm.Label", {_classes: {domNode:["StudioLabel"]},caption: "webapproot/app.css", height: "18px", width: "100%", align: "right", border: 0}]
        							}],


								    appCssEditArea: ["wm.AceEditor", {width: "100%", height: "100%", syntax: "css"}, {onCtrlKey: "cssEditorCtrlKey", onChange: "setEditAreaDirty"}]
								}],
								pageCssLayer: ["wm.Layer", {caption: "Page CSS"}, {onShow: "cssEditArea.focus"}, {
        							cssRibbon: ["wm.Panel", {_classes: {domNode: [""]}, height: "29px", width: "100%", border: "0,0,1,0", borderColor: "#959DAB", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", verticalAlign: "middle"}, {}, {
        							    cssPageSaveBtn: ["wm.studio.ToolbarButton", {hint: "Save", imageIndex: 8}, {onclick: "saveCssClick"}],
        							    cssPageFindBtn: ["wm.studio.ToolbarButton", {hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findCssClick"}],
        							    cssPageImportBtn: ["wm.studio.ToolbarButton", {hint: "Import CSS Resource", imageIndex: 25}, {onclick: "importCssLibrary"}],
        							    cssPageWordWrapBtn: ["wm.studio.ToolbarButton", {_classes: {domNode: ["ToggleWordWrap", "StudioToolbarButton"]},hint: "Toggle Line Wrapping", imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapCssClick"}],
        							    cssPageHelpBtn: ["wm.studio.ToolbarButton", {hint: "Help", imageIndex: 26}, {onclick: "showCssEditorHelp"}],
        							    cssToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
        							    cssHelpLink: ["wm.Label", {_classes: {domNode:["StudioLabel"]},width: "80px", caption: "Styling Wiki"}, {}],
        							    cssEditAreaZoomWarningLabel: ["wm.Label", {_classes: {domNode:["StudioLabel","AceEditorZoomWarning"]},width: "100px", align: "center", height: "100%", caption: "Zoomed <div class='StudioWarningIcon'/>", showing: false, hint: "<div class='StudioWarningIcon'></div>Zooming your browser may cause the code editor selection to work improperly; Restoring your browser to its standard zoom level will fix this"}],
									cssEditAreaFullPath: ["wm.Label", {_classes: {domNode:["StudioLabel"]},caption: "", height: "18px", width: "100%", align: "right", border: 0}],
        							}],
									cssEditArea: ["wm.AceEditor", {width: "100%", height: "100%", syntax: "css"}, {onCtrlKey: "cssEditorCtrlKey", onChange: "setEditAreaDirty"}]
							    }]
							}]
						}],
						markupLayer: ["wm.Layer", {caption: "Markup"}, {onShow: "markupEditArea.focus"}, {
						    markupRibbon: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, height: "29px", width: "100%", border: "0,0,1,0", borderColor: "#959DAB", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", verticalAlign: "middle"}, {}, {
							markupPageSaveBtn: ["wm.studio.ToolbarButton", {hint: "Save", imageIndex: 8}, {onclick: "saveMarkupClick"}],
							markupPageFindBtn: ["wm.studio.ToolbarButton", {hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findMarkupClick"}],
							markupPageWordWrapBtn: ["wm.studio.ToolbarButton", {_classes: {domNode: ["ToggleWordWrap", "StudioToolbarButton"]}, hint: "Toggle Line Wrapping", imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapMarkupClick"}],
							markupPageHelpBtn: ["wm.studio.ToolbarButton", {hint: "Help", imageIndex: 26}, {onclick: "showMarkupEditorHelp"}],
							    markupToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
							markupLogoBottomHolder: ["wm.Panel", {width: "221px", border: "0"}, {}],
							markupEditAreaZoomWarningLabel: ["wm.Label", {_classes: {domNode:["StudioLabel","AceEditorZoomWarning"]},width: "100px", align: "center", height: "100%", caption: "Zoomed <div class='StudioWarningIcon'/>", showing: false, hint: "<div class='StudioWarningIcon'></div>Zooming your browser may cause the code editor selection to work improperly; Restoring your browser to its standard zoom level will fix this"}],
							markupEditAreaFullPath: ["wm.Label", {_classes: {domNode:["StudioLabel"]},width: "100%", align: "right", height: "100%"}]
							}],
						    markupEditPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}, {
							    markupEditArea: ["wm.AceEditor", {width: "100%", height: "100%", syntax: "html"}, {onCtrlKey: "markupEditorCtrlKey", onChange: "setEditAreaDirty"}],
							    markupHtmlDesc: ["wm.Html", {width: "250px", height: "100%", html: "<p>HTML you enter here can be accessed by your wm.Content widgets if your highest level div has an ID.</p><p><b>The wm.Content widget is now deprecated</b>; we recommend using the wm.Html widget instead, and putting your html in a file in the resources folder.</p><p>To try this, out, copy the following HTML into the markup editor:<br/><pre>&lt;div id='HelloWorld'&gt;\n\tHello World\n&lt;/div&gt;\n\n&lt;div id='GoodbyeWorld'&gt;\n\tGoodbye World\n&lt;/div&gt;</pre><br/><p>Now drag a wm.Content widget onto your canvas, and look at the <b>content</b> property.  Each ID listed here shows up in the list of options for the property.  Selecting the ID shows all of that ID's contents in the wm.Content widget.</p><p>You can put as much HTML as you want within these divs.</p>"}]
							}]
						}],
					    widgets: ["wm.Layer", {caption: "Widgets"}, {}, {
							widgetsHtml: ["wm.Html", {width: "100%", height: "100%", border: 0, padding: "4, 0, 0, 4"}, {}]
						}],

					    appsource: ["wm.Layer", {caption: "App Script", autoScroll:true}, {onShow: "appsourceEditor.focus"}, {
						    appsrcRibbon: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, height: "29px", width: "100%", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#959DAB", verticalAlign: "middle"}, {}, {
							appsrcPageSaveBtn: ["wm.studio.ToolbarButton", { hint: "Save", imageIndex: 8}, {onclick: "saveAppSrcClick"}],
							appsrcPageFindBtn: ["wm.studio.ToolbarButton", {hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findAppScriptClick"}],
							appsrcPageImportBtn: ["wm.studio.ToolbarButton", {hint: "Import JS Resource", imageIndex: 25}, {onclick: "importAppJavascriptLibrary"}],
							appsrcPageFormatBtn: ["wm.studio.ToolbarButton", {hint: "Reformat Code", imageIndex: 29}, {onclick: "formatAppScriptClick"}],
							appsrcPageWordWrapBtn: ["wm.studio.ToolbarButton", {_classes: {domNode: ["ToggleWordWrap", "StudioToolbarButton"]}, hint: "Toggle Line Wrapping", imageIndex: 15, imageList: "canvasToolbarImageList16"}, {onclick: "toggleWrapAppScriptClick"}],
							/*appsrcPageCompileBtn: ["wm.studio.ToolbarButton", {width: "24px", height: "16px", margin: "0,4,0,4", hint: "Validation", imageIndex: 28,iconWidth: "20px", iconHeight: "20px"}, {onclick: "validateAppScriptClick"}],*/
							appsrcPageHelpBtn: ["wm.studio.ToolbarButton", { hint: "Help", imageIndex: 26}, {onclick: "showAppScriptEditorHelp"}],
						    scriptToolbarSpacerPanel: ["wm.Panel", {height: "100%", width: "100%", border: "0", layoutKind: "left-to-right"}, {}],
							/*appsrcPageCompileChkBtn: ["wm.Checkbox", {caption: "Validate on Save", width: "120px"}, {onchange: "validateScriptCheckboxChange"}]*/
							appsourceEditAreaZoomWarningLabel: ["wm.Label", {_classes: {domNode:["StudioLabel","AceEditorZoomWarning"]},width: "100px", align: "center", height: "100%", caption: "Zoomed <div class='StudioWarningIcon'/>", showing: false, hint: "<div class='StudioWarningIcon'></div>Zooming your browser may cause the code editor selection to work improperly; Restoring your browser to its standard zoom level will fix this"}],
							appsourceEditAreaFullPath: ["wm.Label", {_classes: {domNode:["StudioLabel"]},width: "100%", align: "right", height: "100%", caption: "webapproot/app.js"}]

						}],
						appsourceEditor: ["wm.AceEditor", {width: "100%", height: "100%"}, {onCtrlKey: "appScriptEditorCtrlKey", onChange: "setEditAreaDirty"}]

						}],
					    appWidgets: ["wm.Layer", {caption: "App Widgets", autoScroll:true}, {}, {
						        appsourceHtml: ["wm.Html", {width: "100%", height: "100%", border: 0, padding: "4, 0, 0, 4"}, {}]
					    }],
                        themeLayer: ["wm.Layer", {_classes: {domNode: []}, caption: "Themes", width: "100%", height: "100%"}, {}, {
                            themeTabs: ["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs", "StudioDarkLayers", "StudioDarkerLayers"]}}, {}, {
                                widgetThemeLayer: ["wm.Layer", {_classes: {domNode: []}, caption: "Theme Designer", width: "100%", height: "100%"}, {}, {
                                    themesPage: ["wm.PageContainer", {deferLoad: true, loadParentFirst: true,
                                                                      pageName: "WidgetThemerPage"}]
                                }],
                                themeGenerator: ["wm.Layer", {caption: "Theme Generator"}, {}, {
        							themesRibbon: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, height: "29px", width: "100%", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#959DAB", verticalAlign: "middle"}, {}, {
        							    themesPageSaveBtn: ["wm.studio.ToolbarButton", {hint: "Save", imageIndex: 8}, {onclick: "saveThemeClick"}],
        							    themesPageAddBtn: ["wm.studio.ToolbarButton", {hint: "New Theme...", imageIndex: 25}, {onclick: "addNewThemeClick"}],
        							    themesPageCopyBtn: ["wm.studio.ToolbarButton", {hint: "Copy Theme...", imageIndex: 1}, {onclick: "copyThemeClick"}],
        							    themesPageDeleteBtn: ["wm.studio.ToolbarButton", {hint: "Delete Theme", imageIndex: 0}, {onclick: "deleteThemeClick"}],
        							    themesPageRevertBtn: ["wm.studio.ToolbarButton", {hint: "Revert Theme", imageIndex: 6, imageList: "canvasToolbarImageList16"}, {onclick: "revertThemeClick"}]
        							}],
                                    themesPage: ["wm.PageContainer", {deferLoad: true, loadParentFirst: true,
                                                                      pageName: "ThemeDesigner"}]
                                }]
                            }]
                        }],
                        /*
                        theme2Layer: ["wm.Layer", {_classes: {domNode: []}, caption: "Themes", width: "100%", height: "100%"}, {}, {
                            widgetThemesPage: ["wm.PageContainer", {deferLoad: true, loadParentFirst: true,
                                                              pageName: "WidgetThemerPage"}]
					    }],*/
					    appDocs: ["wm.Layer", {caption: "Documentation"}, {}, {
						appdocsRibbon: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, height: "29px", width: "100%", layoutKind: "left-to-right", imageList: "smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#959DAB", verticalAlign: "middle"}, {}, {
						    appdocsPrintBtn: ["wm.studio.ToolbarButton", {hint: "Print", imageIndex: 4}, {onclick: "printAppDocsClick"}]
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
			    JavaEditorSubTab: ["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs", "StudioDarkLayers", "StudioDarkerLayers"]}, border: "1",conditionalTabButtons:true, customCloseOrDestroy: "closeServiceTab"}, {onchange: "sourceTabsChange", oncanchange: "sourceTabsCanChange"}, {}]
			}],
			databaseTab: ["wm.Layer", {caption: "Database", layoutKind: "top-to-bottom", showing: false, closable: true}, {}, {
			    databaseSubTab: ["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs", "StudioDarkLayers", "StudioDarkerLayers"]}, border: "1",conditionalTabButtons:true, customCloseOrDestroy: "closeServiceTab"}, {onchange: "sourceTabsChange", oncanchange: "sourceTabsCanChange"}, {}]
			}],
			webServiceTab: ["wm.Layer", {caption: "WebServices", layoutKind: "top-to-bottom", showing: false, closable: true}, {}, {
			    webServiceSubTab: ["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs","StudioDarkLayers", "StudioDarkerLayers"]}, border: "1",conditionalTabButtons:true,  customCloseOrDestroy: "closeServiceTab"}, {onchange: "sourceTabsChange", oncanchange: "sourceTabsCanChange"}, {}]
			}],
		    securityTab: ["wm.Layer", {caption: "Security", layoutKind: "top-to-bottom", showing: false, closable: true}, {}, {
			    securitySubTab: ["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs"]},  border: "1",conditionalTabButtons:true, customCloseOrDestroy: "closeServiceTab", border: "0"}, {onchange: "sourceTabsChange", oncanchange: "sourceTabsCanChange"}, {}]
			}]

			}]
		}],
		markup: ["wm.Html", {height: "0", showing: false}, {}]
		/*,
		footer: ["wm.Html", {height: "18px", html: "Copyright &copy; 2008 <a target=\"_blank\" href=\"http://www.wavemaker.com\" style=\"color:#b4d5f0;\">VMware, Inc.</a>, Studio Version: wmVersionNumber", showing: false}, {}]*/
	}]
}