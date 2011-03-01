/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
Dashboard.widgets = {
	layoutBox: ["wm.LayoutBox", {fit: true, box: "v", flex: 1}, {}, {
		panel: ["wm.Panel", {box: "h", height: "622px"}, {}, {
			panel1: ["wm.Panel", {box: "v", flex: 1}, {}, {}],
			mainPanel: ["wm.Panel", {box: "v", width: "1100px"}, {}, {
				headerPanel: ["wm.Panel", {box: "", height: "81px"}, {}, {
					projectNameInput: ["wm.Input", {inputValue: "MyProject", readOnly: true, height: "16px", width: "193px", left: "91px", top: "4px"}, {}, {}]
				}],
				bodyPanel: ["wm.Panel", {box: "v", flex: 1}, {}, {
					topImagesPanel: ["wm.Panel", {box: "h", height: "107px"}, {}, {
						admininstrationImage: ["wm.Picture", {source: "images/dashboard/administration.png", aspect: "none"}, {}, {}],
						securityImage: ["wm.Picture", {source: "images/dashboard/security.png", aspect: "none"}, {}, {}],
						documentationImage: ["wm.Picture", {source: "images/dashboard/documentation.png", aspect: "none"}, {}, {}]
					}],
					topButtonsPanel: ["wm.Panel", {box: "h", height: "108px"}, {}, {
						administrationButtonsPanel: ["wm.Panel", {box: "h", flex: 1}, {}, {
							panel14: ["wm.Panel", {box: "v", flex: 1}, {}, {}],
							administrationButtonsGroup: ["wm.Panel", {box: "v", width: "165px"}, {}, {
								/*serverOptionsButton: ["wm.Button", {caption: "Server Options", height: "22px"}, {}, {}],
								dashspacer8: ["wm.Spacer", {height: "4px", width: ""}, {}, {}],*/
								importWebServiceButton: ["wm.Button", {caption: "Import Web Service", height: "22px"}, {onclick: "importWebServiceButtonClick"}, {}],
								dashspacer9: ["wm.Spacer", {height: "4px", width: ""}, {}, {}],
								projectDeployBtn: ["wm.Button", {height: "22px", caption: 'Generate WAR File', title: "Generate WAR File"}, {onclick: "deployClick"}, {}],
								dashspacer10: ["wm.Spacer", {height: "4px", width: ""}, {}, {}],
								exportProjectBtn: ["wm.Button", {height: "22px", caption: 'Export Project', title: "Export Project"}, {onclick: "exportClick"}, {}]
							}],
							panel16: ["wm.Panel", {box: "v", flex: 1}, {}, {}]
						}],
						securityButtonsPanel: ["wm.Panel", {box: "h", flex: 1}, {}, {
							panel21: ["wm.Panel", {box: "v", flex: 1}, {}, {}],
							securityButtonsGroup: ["wm.Panel", {box: "v", width: "165px"}, {}, {
								securityOptionsButton: ["wm.Button", {caption: "Security Options", height: "22px"}, {onclick: "securityOptionsButtonClick"}, {}]
							}],
							panel23: ["wm.Panel", {box: "v", flex: 1}, {}, {}]
						}],
						documentationButtonsPanel: ["wm.Panel", {box: "h", flex: 1}, {}, {
							panel24: ["wm.Panel", {box: "v", flex: 1}, {}, {}],
							documentationButtonsGroup: ["wm.Panel", {box: "v", width: "165px"}, {}, {
								startedGuideButton: ["wm.Button", {caption: "Tutorial", height: "22px"}, {onclick: "startedGuideButtonClick"}, {}],
								dashspacer10: ["wm.Spacer", {height: "4px", width: ""}, {}, {}],
								developerGuideButton: ["wm.Button", {caption: "User Guide", height: "22px"}, {onclick: "developerGuideButtonClick"}, {}],
								dashspacer10a: ["wm.Spacer", {height: "4px", width: ""}, {}, {}],
								communityButton: ["wm.Button", {caption: "Community", height: "22px"}, {onclick: "communityButtonClick"}, {}]
							}],
							panel26: ["wm.Panel", {box: "v", flex: 1}, {}, {}]
						}]
					}],
					bottomImagesPanel: ["wm.Panel", {box: "h", height: "125px"}, {}, {
						panesImage: ["wm.Picture", {source: "images/dashboard/pages.png", aspect: "none"}, {}, {}],
						servicesImage: ["wm.Picture", {source: "images/dashboard/services.png", aspect: "none"}, {}, {}],
						datamodelsImage: ["wm.Picture", {source: "images/dashboard/datamodels.png", aspect: "none"}, {}, {}]
					}],
					bottomListsPanel: ["wm.Panel", {box: "h", flex: 1}, {}, {
						panel17: ["wm.Panel", {box: "v", width: "11px"}, {}, {}],
						paneListPanel: ["wm.Panel", {box: "v", flex: 1}, {}, {
							paneListToolbar: ["wm.Panel", {box: "h", height: "26px"}, {}, {
								paneOpenButton: ["wm.Button", {caption: '<img src="images/toolbar_edit.png"/>', width: "32px", disabled: true}, {onclick: "paneOpenButtonClick"}, {}],
								dashspacer1: ["wm.Spacer", {height: "", width: "4px"}, {}, {}],
								paneAddButton: ["wm.Button", {caption: '<img src="images/toolbar_add.png"/>', width: "32px"}, {onclick: "paneAddButtonClick"}, {}],
								dashspacer2: ["wm.Spacer", {height: "", width: "4px"}, {}, {}],
								paneDeleteButton: ["wm.Button", {caption: '<img src="images/toolbar_delete.png"/>', width: "32px", disabled: true}, {onclick: "paneDeleteButtonClick"}, {}],
								dashspacer3: ["wm.Spacer", {height: "", width: "4px"}, {}, {}],
								paneHomeButton: ["wm.Button", {caption: '<img src="images/toolbar_makehome.png"/>', width: "32px", disabled: true}, {onclick: "paneHomeButtonClick"}, {}],
								dashspacer4: ["wm.Spacer", {height: "", width: "4px"}, {}, {}],
								paneCopyButton: ["wm.Button", {caption: '<img src="images/toolbar_copy.png"/>', width: "32px"}, {onclick: "paneCopyButtonClick"}, {}],
								panel27: ["wm.Panel", {box: "v", flex: 1}, {}, {}]/*,
								paneSearchField: ["wm.Input", {width: "160px"}, {}, {}]*/
							}],
							paneList: ["wm.List", {flex: 1, headerVisible: false}, {onselect: "paneListSelect", ondeselect: "paneListDeselect", ondblclick: "paneListDblClick"}, {}]
						}],
						panel20: ["wm.Panel", {box: "v", width: "11px"}, {}, {}],
						serviceListPanel: ["wm.Panel", {box: "v", flex: 1}, {}, {
							serviceListToolbar: ["wm.Panel", {box: "h", height: "26px"}, {}, {
								serviceEditButton: ["wm.Button", {caption: '<img src="images/toolbar_edit.png"/>', width: "32px"}, {onclick: "serviceEditButtonClick"}, {}],
								dashspacer4: ["wm.Spacer", {height: "", width: "4px"}, {}, {}],
								serviceAddButton: ["wm.Button", {caption: '<img src="images/toolbar_add.png"/>', width: "32px"}, {onclick: "serviceAddButtonClick"}, {}],
								dashspacer5: ["wm.Spacer", {height: "", width: "4px"}, {}, {}],
								serviceDeleteButton: ["wm.Button", {caption: '<img src="images/toolbar_delete.png"/>', width: "32px"}, {onclick: "serviceDeleteButtonClick"}, {}],
								panel32: ["wm.Panel", {box: "v", flex: 1}, {}, {}]/*,
								serviceSearchField: ["wm.Input", {width: "160px"}, {}, {}]*/
							}],
							serviceList: ["wm.List", {flex: 1}, {onselect: "serviceListSelect", ondeselect: "serviceListDeselect", ondblclick:"servicesListDblClick"}, {}]
						}],
						panel19: ["wm.Panel", {box: "v", width: "11px"}, {}, {}],
						datamodelListPanel: ["wm.Panel", {box: "v", flex: 1}, {}, {
							datamodelListToolbar: ["wm.Panel", {box: "h", height: "26px"}, {}, {
								datamodelEditButton: ["wm.Button", {caption: '<img src="images/toolbar_edit.png"/>', width: "32px"}, {onclick: "datamodelEditButtonClick"}, {}],
								dashspacer6: ["wm.Spacer", {height: "", width: "4px"}, {}, {}],
								datamodelAddButton: ["wm.Button", {caption: '<img src="images/toolbar_add.png"/>', width: "32px"}, {onclick: "datamodelAddButtonClick"}, {}],
								dashspacer7: ["wm.Spacer", {height: "", width: "4px"}, {}, {}],
								datamodelDeleteButton: ["wm.Button", {caption: '<img src="images/toolbar_delete.png"/>', width: "32px"}, {onclick: "datamodelDeleteButtonClick"}, {}],
								panel33: ["wm.Panel", {box: "v", flex: 1}, {}, {}]/*,
								datamodelSearchField: ["wm.Input", {width: "160px"}, {}, {}]*/
							}],
							datamodelList: ["wm.List", {flex: 1}, {onselect: "datamodelListSelect", ondeselect: "datamodelListDeselect", ondblclick: "datamodelListDblClick"}, {}]
						}],
						panel29: ["wm.Panel", {box: "v", width: "11px"}, {}, {}]
					}]
				}]
			}],
			panel3: ["wm.Panel", {box: "v", flex: 1}, {}, {}]
		}]
	}]
}
