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
Security.widgets = {
	smallToolbarImageList: ["wm.ImageList", {"width":16,"height":16,"colCount":32,"url":"images/smallToolbarBtns.png"}, {}],
	layoutBox: ["wm.Layout", {"_classes":{"domNode":["wm-darksnazzy"]},"height":"100%"}, {}, {
		editorToolbar: ["wm.Panel", {"height":"29px","layoutKind":"left-to-right"}, {}, {
			toolbarBtnHolder: ["wm.Panel", {"width":"100%","layoutKind":"left-to-right","padding":"0,4","imageList":"smallToolbarImageList"}, {}, {
				saveButton: ["wm.ToolButton", {"width":"24px","imageIndex":8,"hint":"Save Security settings"}, {"onclick":"saveButtonClick"}]
			}],
			logoBtmHolder: ["wm.Panel", {"width":"221px"}, {}]
		}],
		label1a: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_Padding_4px"]},"caption":"Security Configuration","border":"0","height":"24px"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
		panel1a: ["wm.Panel", {"height":"350px","horizontalAlign":"left"}, {}, {
			secConfigPanel: ["wm.Panel", {"width":"100%","height":"70px","layoutKind":"left-to-right","horizontalAlign":"center"}, {}, {
				secConfigControls: ["wm.Panel", {"width":"638px"}, {}, {
					panel16: ["wm.Panel", {"height":"100%"}, {}, {
						secProviderInput: ["wm.Editor", {"captionSize":"120px","caption":"Security Provider","emptyValue":"null","captionAlign":"left","height":"20px","width":"300px","display":"Select"}, {"onchange":"secProviderInputChange"}, {
							editor: ["wm._SelectEditor", {}, {}]
						}],
						panel3: ["wm.Panel", {"height":"56px"}, {}, {
							secEnableInput: ["wm.CheckBoxEditor", {"captionSize":"120px","caption":"Enable Security","width":"100%","captionAlign":"left","margin":"0,0,0,30"}, {"onchange":"securityCheckboxChange"}, {
								editor: ["wm._CheckBoxEditor", {}, {}]
							}],
							showLoginPageInput: ["wm.CheckBoxEditor", {"captionSize":"120px","caption":"Show Login Page","width":"100%","captionAlign":"left","margin":"0,0,0,60"}, {}, {
								editor: ["wm._CheckBoxEditor", {}, {}]
							}]
						}]
					}]
				}]
			}],
			panel3a: ["wm.Panel", {"width":"100%","height":"1px","layoutKind":"left-to-right"}, {}],
			panel4a: ["wm.Panel", {"width":"100%","height":"100%","layoutKind":"left-to-right","margin":"0,0,0,30","padding":"4","horizontalAlign":"center"}, {}, {
				secDetailsPanel: ["wm.Panel", {"width":"638px"}, {}, {
					layers: ["wm.Layers", {"_classes":{"domNode":["wm_Padding_2px"]},"LayersType":"Layers"}, {}, {
						emptyLayer: ["wm.Layer", {"caption":"Empty"}, {}],
						demoLayer: ["wm.Layer", {"caption":"Demo","imageList":"smallToolbarImageList"}, {"onShow":"showDemoLayer"}, {
							panel1: ["wm.Panel", {"height":"86px","layoutKind":"left-to-right"}, {}, {
								spacer11: ["wm.Spacer", {"width":"96px"}, {}],
								panel6: ["wm.Panel", {"width":"360px"}, {}, {
									demoUsernameInput: ["wm.Editor", {"caption":"Username","emptyValue":"null","height":"20px"}, {}, {
										editor: ["wm._TextEditor", {}, {}]
									}],
									demoPasswordInput: ["wm.Editor", {"caption":"Password","emptyValue":"null","height":"20px"}, {}, {
										editor: ["wm._TextEditor", {}, {}]
									}],
									demoRoleInput: ["wm.Editor", {"caption":"Role","emptyValue":"null","height":"20px","display":"Select"}, {}, {
										editor: ["wm._SelectEditor", {}, {}]
									}]
								}],
								spacer2: ["wm.Spacer", {"width":"4px"}, {}],
								panel8: ["wm.Panel", {"width":"40px"}, {}, {
									spacer13: ["wm.Spacer", {"height":"34px"}, {}],
									demoAddUserButton: ["wm.ToolButton", {"width":"24px","imageIndex":25,"hint":"Add User","margin":"0","height":"28px"}, {"onclick":"demoAddUserButtonClick"}]
								}]
							}],
							panel2: ["wm.Panel", {"height":"140px","layoutKind":"left-to-right"}, {}, {
								spacer12: ["wm.Spacer", {"width":"96px"}, {}],
								demoUserList: ["wm.List", {"width":"358px","border":"0","dataFields":"userid,password,roles"}, {"onformat":"demoUserListFormat"}],
								spacer3: ["wm.Spacer", {"width":"6px"}, {}],
								panel7: ["wm.Panel", {"width":"40px"}, {}, {
									demoDeleteUserButton: ["wm.ToolButton", {"width":"24px","imageIndex":0,"hint":"Remove User","margin":"0","height":"28px"}, {"onclick":"demoDeleteUserButtonClick"}]
								}]
							}]
						}],
						databaseLayer: ["wm.Layer", {"caption":"Database"}, {"onShow":"showDBLayer"}, {
							dbDataModelInput: ["wm.Editor", {"caption":"Data Model","emptyValue":"null","height":"20px","display":"Select"}, {"onchange":"dbDataModelInputChange"}, {
								editor: ["wm._SelectEditor", {}, {}]
							}],
							dbEntityInput: ["wm.Editor", {"caption":"Entity","emptyValue":"null","height":"20px","display":"Select"}, {"onchange":"dbEntityInputChange"}, {
								editor: ["wm._SelectEditor", {}, {}]
							}],
							dbUsernameInput: ["wm.Editor", {"caption":"Username Field <span style='cursor:pointer;font-weight:bold;color: black;' id='HelpUID1'>?</a>","emptyValue":"null","height":"20px","display":"Select"}, {}, {
								editor: ["wm._SelectEditor", {}, {}]
							}],
							dbUseridInput: ["wm.Editor", {"caption":"User ID Field <span style='cursor:pointer;font-weight:bold;color: black;' id='HelpUID2'>?</a>","emptyValue":"null","height":"20px","display":"Select"}, {}, {
								editor: ["wm._SelectEditor", {}, {}]
							}],
							dbPasswordInput: ["wm.Editor", {"caption":"Password Field","emptyValue":"null","height":"20px","display":"Select"}, {}, {
								editor: ["wm._SelectEditor", {}, {}]
							}],
							dbRoleInput: ["wm.Editor", {"caption":"Role Field (Enterprise users only)","emptyValue":"null","height":"20px","display":"Select"}, {}, {
								editor: ["wm._SelectEditor", {}, {}]
							}],
							spacer30: ["wm.Spacer", {"width":"96px","height":"10px"}, {}],
							labelmt: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_Padding_4px"]},"caption":"Multitenant Configuration (Enterprise users only)","border":"0","height":"24px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
								}],
							tenantIdField: ["wm.Editor", {"captionSize":"211px","caption":"Tenant ID Field Name","emptyValue":"null","layoutKind":"left-to-right","height":"20px","width":"100px","display":"Select"}, {}, {
								editor: ["wm._SelectEditor", {}, {}]
							}],
							defTenantId: ["wm.Editor", {"captionSize":"211px","caption":"Default Tenant ID Value","emptyValue":"null","height":"20px","width":"100px"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							spacer31: ["wm.Spacer", {"width":"96px","height":"10px"}, {}],
							dbRoleBySQLPanel: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_RightNone","wm_Padding_LeftNone","wm_Padding_BottomNone","wm_Padding_4px"]},"height":"210px"}, {}, {
								panel14: ["wm.Panel", {"height":"24px","layoutKind":"left-to-right"}, {}, {
									spacer1: ["wm.Spacer", {"width":"202px"}, {}],
									dbRoleBySQLCheckbox: ["wm.CheckBoxEditor", {"captionSize":"380px","caption":"Roles By SQL Query","width":"100%","captionAlign":"left","captionPosition":"right"}, {"onchange":"dbRoleBySQLCheckboxChange"}, {
										editor: ["wm._CheckBoxEditor", {}, {}]
									}]
								}],
								dbRoleBySQLEnablePanel: ["wm.Panel", {"height":"100%"}, {}, {
									dbRoleBySQLInput: ["wm.Editor", {"caption":" ","emptyValue":"null","height":"48px","display":"TextArea"}, {}, {
										editor: ["wm._TextAreaEditor", {}, {}]
									}],
									panel22: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_2px"]},"height":"24px","layoutKind":"left-to-right"}, {}, {
										spacer20: ["wm.Spacer", {"width":"100%"}, {}],
										dbTestSQLInput: ["wm.Editor", {"caption":"User ID","emptyValue":"null","width":"250px"}, {}, {
											editor: ["wm._TextEditor", {}, {}]
										}],
										dbTestSQLButton: ["wm.Button", {"caption":"Test Query","margin":"2","width":"100px"}, {"onclick":"dbTestSQLButtonClick"}]
									}],
									panel18: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_2px","wm_Padding_LeftNone","wm_Padding_TopNone"]},"height":"48px","layoutKind":"left-to-right"}, {}, {
										spacer5: ["wm.Spacer", {"width":"206px"}, {}],
										dbTestSQLResultList: ["wm.List", {"_classes":{"domNode":["wm_Border_Size1px","wm_Border_StyleSolid","wm_Border_ColorLightGray"]},"width":"100%","border":"0"}, {}]
									}],
									panel17: ["wm.Panel", {"height":"30px","layoutKind":"left-to-right"}, {}, {
										spacer15: ["wm.Spacer", {"width":"206px"}, {}],
										dbTestSQLErrorLabel: ["wm.Label", {"caption":"dbTestSQLErrorLabel","border":"0","width":"100%"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}]
									}]
								}]
							}]
						}],
						ldapLayer: ["wm.Layer", {"caption":"LDAP"}, {"onShow":"showLDAPLayer"}, {
							ldapUrlInput: ["wm.Editor", {"caption":"LDAP URL","emptyValue":"null","height":"20px"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							ldapManagerDnInput: ["wm.Editor", {"caption":"Manager DN","emptyValue":"null","height":"20px"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							ldapManagerPasswordInput: ["wm.Editor", {"caption":"Manager Password","emptyValue":"null","height":"20px"}, {}, {
								editor: ["wm._TextEditor", {"password":true}, {}]
							}],
							ldapUserDnPatternInput: ["wm.Editor", {"caption":"User DN Pattern","emptyValue":"null","height":"20px"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							ldapSearchRoleCheckbox: ["wm.CheckBoxEditor", {"caption":"Search User Role","height":"20px","emptyValue":"null"}, {"onchange":"ldapSearchRoleCheckboxChange"}, {
								editor: ["wm._CheckBoxEditor", {}, {}]
							}],
							ldapGroupSearchBaseInput: ["wm.Editor", {"caption":"Group Search Base","emptyValue":"null","height":"20px"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							ldapGroupRoleAttributeInput: ["wm.Editor", {"caption":"Group Role Attribute","emptyValue":"null","height":"20px"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							ldapGroupSearchFilterInput: ["wm.Editor", {"caption":"Group Search Filter","emptyValue":"null","height":"20px"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							spacer6: ["wm.Spacer", {"height":"2px"}, {}],
							panel5: ["wm.Panel", {"height":"24px","layoutKind":"left-to-right"}, {}, {
								spacer7: ["wm.Spacer", {"width":"100%"}, {}],
								ldapConnectionButton: ["wm.Button", {"caption":"Test Connection","margin":"2","width":"150px"}, {"onclick":"ldapConnectionButtonClick"}],
								spacer4: ["wm.Spacer", {"width":"2px"}, {}]
							}],
							ldapConnectionResultLabel: ["wm.Label", {"caption":"ldapConnectionResultLabel","border":"0","height":"24px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						jossoLayer: ["wm.Layer", {"caption":"JOSSO"}, {"onShow":"showJossoLayer"}, {
							userNotice: ["wm.Html", {"height":"142px","width":"359px","html":"<h3> Edit web.xml <BR> Register as partner app in agent config <BR> Copy jsp to webapproot</h3>"}, {}]
						}]
					}]
				}]
			}],
			panel10a: ["wm.Panel", {"width":"100%","height":"1px","layoutKind":"left-to-right"}, {}]
		}],
		splitter1a: ["wm.Splitter", {"width":"100%","height":"4px","border":"0"}, {}],
		panelBottom: ["wm.Panel", {"width":"500px","height":"100%","layoutKind":"left-to-right","horizontalAlign":"center"}, {}, {
		        spacer8a: ["wm.Spacer", {showing: false, "width":"100%","height":"100%"}, {}],
			spacer8b: ["wm.Spacer", {"width":"57px","height":"100%"}, {}],
			panelRoles: ["wm.Panel", {"width":"638px","height":"100%"}, {}, {
				label2a: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_Padding_4px"]},"caption":"Role Configuration (Enterprise users only)","border":"0","height":"24px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				panela2: ["wm.Panel", {"height":"100%","horizontalAlign":"left"}, {}, {
					panel8a: ["wm.Panel", {"width":"100%","height":"1px","layoutKind":"left-to-right"}, {}],
					panel11a: ["wm.Panel", {"width":"100%","height":"100%","layoutKind":"left-to-right","padding":"4","horizontalAlign":"center"}, {}, {
						panel14a: ["wm.Panel", {"width":"638px"}, {}, {
							rolePanel: ["wm.Panel", {"height":"100%","padding":"4","imageList":"smallToolbarImageList"}, {}, {
								panel9: ["wm.Panel", {"height":"38px","layoutKind":"left-to-right"}, {}, {
									spacer17: ["wm.Spacer", {"width":"96px"}, {}],
									panel12: ["wm.Panel", {"width":"362px"}, {}, {
										addRoleInput: ["wm.Editor", {"captionSize":"50px","caption":"Role","emptyValue":"null"}, {}, {
											editor: ["wm._TextEditor", {}, {}]
										}]
									}],
									panel13: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_RightNone","wm_Padding_TopNone","wm_Padding_BottomNone","wm_Padding_24px"]},"width":"40px"}, {}, {
										addRoleButton: ["wm.ToolButton", {"width":"30px","imageIndex":25,"hint":"Add Role","margin":"0,0,0,2","height":"24px"}, {"onclick":"addRoleButtonClick"}]
									}]
								}],
								panel10: ["wm.Panel", {"height":"100%","layoutKind":"left-to-right"}, {}, {
									spacer19: ["wm.Spacer", {"width":"96px"}, {}],
									roleList: ["wm.List", {"_classes":{"domNode":["wm_BackgroundColor_White"]},"width":"360px","border":"0","headerVisible":false,"columnWidths":"100%"}, {}],
									panel11: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_RightNone","wm_Padding_TopNone","wm_Padding_24px"]},"width":"40px"}, {}, {
										deleteRoleButton: ["wm.ToolButton", {"width":"30px","imageIndex":0,"hint":"Remove Role","margin":"0,0,0,4","height":"28px"}, {"onclick":"deleteRoleButtonClick"}]
									}]
								}]
							}]
						}]
					}],
					panel12a: ["wm.Panel", {"width":"100%","height":"1px","layoutKind":"left-to-right"}, {}]
				}]
			}],
			spacer39: ["wm.Spacer", {"width":"15px"}, {}],
			benchbevel5: ["wm.Bevel", {showing: false, "width":"4px","height":"100%","border":"0"}, {}],
			spacer40: ["wm.Spacer", {"width":"15px"}, {}],
			panelLiveLayout: ["wm.Panel", {showing: false, "width":"100%","height":"100px"}, {}, {
				label1: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"caption":"Live Layout Login","height":"33px","width":"96px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				liveLayoutUser: ["wm.Editor", {"caption":"User","emptyValue":"null","height":"20px"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				liveLayoutPassword: ["wm.Editor", {"caption":"Password","emptyValue":"null","height":"20px"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				spacer9: ["wm.Spacer", {"width":"96px","height":"30px"}, {}],
				label2: ["wm.Label", {"caption":"The username/password here will be the account used by live layout to log on and access your database and javaservices","height":"93px","singleLine":false,"width":"96px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}]
		}],
		benchbevel4: ["wm.Bevel", {"width":"100%","height":"4px","border":"0"}, {}]
	}]
}
