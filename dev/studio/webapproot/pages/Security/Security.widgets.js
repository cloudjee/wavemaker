/*
 * Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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
 
Security.widgets = {
	smallToolbarImageList: ["wm.ImageList", {"colCount":32,"height":16,"url":"images/smallToolbarBtns.png","width":16}, {}],
	varUrlMap: ["wm.Variable", {"isList":true,"type":"com.wavemaker.studio.SecurityConfigService$SecurityURLMap"}, {}],
	varServList: ["wm.Variable", {"isList":true,"type":"com.wavemaker.studio.SecurityServiceMap"}, {}],
	varRoleList: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
        
	layoutBox: ["wm.Layout", {"_classes":{"domNode":["wm-darksnazzy"]},"height":"100%"}, {}, {
		    editorToolbar: ["wm.Panel", {"border":"0","height":"29px","layoutKind":"left-to-right"}, {}, {
			toolbarBtnHolder: ["wm.Panel", {"border":"0","imageList":"smallToolbarImageList","layoutKind":"left-to-right","padding":"0,4","width":"100%"}, {}, {
			    saveButton: ["wm.ToolButton", {"border":"0","hint":"Save Security settings","imageIndex":8,"width":"24px"}, {"onclick":"saveButtonClick"}]
			}],
			logoBtmHolder: ["wm.Panel", {"border":"0","width":"221px"}, {}]
		    }],
	    tabs: ["wm.TabLayers", {width: "100%", height: "100%", clientBorder: "3,0,0,0",clientBorderColor: "#959DAB", "conditionalTabButtons":true}, {}, {
		securityLayer: ["wm.Layer", {caption: "Setup Security"}, {}, {
		    label1a: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_Padding_4px"]},"border":"0","caption":"Security Configuration","padding":"4"}],
		    panel1a: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left"}, {}, {
			secConfigPanel: ["wm.Panel", {"border":"0","height":"70px","horizontalAlign":"center","layoutKind":"left-to-right","width":"100%"}, {}, {
			    secConfigControls: ["wm.Panel", {"border":"0","width":"638px"}, {}, {
				panel16: ["wm.Panel", {"border":"0","height":"100%"}, {}, {
				    secProviderInput: ["wm.SelectMenu", {"border":"0","caption":"Security Provider","captionAlign":"left","captionSize":"120px","display":"Select","emptyValue":"null","padding":"2","width":"300px"}, {"onchange":"secProviderInputChange"}],
				    panel3: ["wm.Panel", {"border":"0","height":"56px"}, {}, {
					secEnableInput: ["wm.Checkbox", {"border":"0","caption":"Enable Security","captionAlign":"left","captionSize":"120px","displayValue":"1","margin":"0,0,0,30","padding":"2","width":"100%"}, {"onchange":"securityCheckboxChange"}],
					showLoginPageInput: ["wm.Checkbox", {"border":"0","caption":"Show Login Page","captionAlign":"left","captionSize":"120px","displayValue":"1","margin":"0,0,0,60","padding":"2","width":"100%"}, {"onchange":"setDirty"}]
				    }]
				}]
			    }]
			}],
			panel3a: ["wm.Panel", {"border":"0","height":"1px","layoutKind":"left-to-right","width":"100%"}, {}],
			panel4a: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","margin":"0,0,0,30","padding":"4","width":"100%"}, {}, {
			    secDetailsPanel: ["wm.Panel", {"border":"0","width":"638px"}, {}, {
				layers: ["wm.Layers", {"LayersType":"Layers","_classes":{"domNode":["wm_Padding_2px"]}}, {}, {
				    emptyLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"Empty"}, {}],
				    demoLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"Demo","imageList":"smallToolbarImageList"}, {"onShow":"showDemoLayer"}, {
					panel1: ["wm.Panel", {"border":"0","height":"86px","layoutKind":"left-to-right", horizontalAlign: "left", verticalAlign: "top"}, {}, {
					    panel6: ["wm.Panel", {"border":"0","width":"500px", height: "75px"}, {}, {
						demoUsernameInput: ["wm.Text", {captionSize: "150px",width: "100%","border":"0","caption":"Username","emptyValue":"null","padding":"2"}],	
						demoPasswordInput: ["wm.Text", {captionSize: "150px",width: "100%","border":"0","caption":"Password","emptyValue":"null","padding":"2"}],
						demoRoleInput: ["wm.SelectMenu", {captionSize: "150px",width: "100%", "border":"0","caption":"Role","display":"Select","emptyValue":"null","padding":"2"}]
					    }],
					    spacer2: ["wm.Spacer", {"width":"4px"}, {}],
					    panel8: ["wm.Panel", {"border":"0","width":"40px", height: "100%", verticalAlign: "top"}, {}, {
						demoAddUserButton: ["wm.ToolButton", {"border":"0","height":"28px","hint":"Add User","imageIndex":25,"margin":"0","width":"24px"}, {"onclick":"demoAddUserButtonClick"}]
					    }]
					}],
					panel2: ["wm.Panel", {"border":"0","height":"140px","layoutKind":"left-to-right", width: "100%", verticalAlign: "top", horizontalAlign: "left"}, {}, {
					    demoUserList: ["wm.List", {"border":"0","dataFields":"userid,password,roles","width":"500px", height: "100%", margin: "0,2,0,90"}, {"onformat":"demoUserListFormat"}],
					    spacer3: ["wm.Spacer", {"width":"4px"}, {}],
					    panel7: ["wm.Panel", {"border":"0","width":"40px", height: "100%"}, {}, {
						demoDeleteUserButton: ["wm.ToolButton", {"border":"0","height":"28px","hint":"Remove User","imageIndex":0,"margin":"0","width":"24px"}, {"onclick":"demoDeleteUserButtonClick"}]
					    }]
					}]
				    }],
				    databaseLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"Database",autoScroll:true, verticalAlign: "top", horizontalAlign: "left"}, {"onShow":"showDBLayer"}, {
					databasePanel: ["wm.Panel", {width: "100%", height: "300px", fitToContentHeight: true, margin: "10,50,0,50", horizontalAlign: "left", verticalAlign: "top"}, {}, {
					    dbDataModelInput: ["wm.SelectMenu", {required: true, captionSize: "150px", width: "500px", "border":"0","caption":"Data Model","display":"Select","emptyValue":"null","padding":"2", helpText: "Pick from one of the databases you have imported"}, {"onchange":"dbDataModelInputChange"}],
					    dbEntityInput: ["wm.SelectMenu", {required: true,captionSize: "150px", width: "500px", "border":"0","caption":"Entity","display":"Select","emptyValue":"null","padding":"2", helpText: "Pick a table from your database that contains your registered users"}, {"onchange":"dbEntityInputChange"}],
					    dbUsernameInput: ["wm.SelectMenu", {required: true,captionSize: "150px", width: "500px", "border":"0","caption":"Username Field","display":"Select","emptyValue":"null","padding":"2", helpText: "Select the column containing the username data. This will be the user name required for login"}, {"onchange":"setDirty"}],
					    dbUseridInput: ["wm.SelectMenu", {required: true,captionSize: "150px", width: "500px", "border":"0","caption":"User ID Field","display":"Select","emptyValue":"null","padding":"2", helpText: "Select the the column contaning the user id data"}, {"onchange":"setDirty"}],
					    dbPasswordInput: ["wm.SelectMenu", {required: true,captionSize: "150px", width: "500px", "border":"0","caption":"Password Field","display":"Select","emptyValue":"null","padding":"2", helpText: "Select the field that contains the user's password required for login"}, {"onchange":"setDirty"}],
					    dbRoleInput: ["wm.SelectMenu", {captionSize: "150px", width: "500px", "border":"0","caption":"Role Field","display":"Select","emptyValue":"null","padding":"2", helpText: "Select the field that contains the user's role.  This is optional if you aren't using roles"}, {"onchange":"setDirty"}]
					}],
					spacer30: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
					labelmt: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_Padding_4px"]},"border":"0","caption":"Multitenant Configuration","padding":"4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}],
					tenantPanel: ["wm.Panel", {width: "100%", height: "300px", fitToContentHeight: true, margin: "10,50,0,50", verticalAlign: "top", horizontalAlign: "left"}, {}, {
					    tenantIdField: ["wm.SelectMenu", {captionSize: "150px", width: "500px", "border":"0","caption":"Tenant ID Field Name","display":"Select","emptyValue":"null","padding":"2",helpText: "If your creating a multi-tenanted application, specify which field of the user's table contains that user's tenant id"}, {"onchange":"setDirty"}],
					    defTenantId: ["wm.Text", {captionSize: "150px", width: "500px", "border":"0","caption":"Default Tenant ID Value","emptyValue":"null","padding":"2", helpText: "The default tenant ID value is the value used when querying the database while you are in design; this has no effect on running your application"}, {"onchange":"setDirty"}],
					    spacer31: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
					}],
					dbRoleBySQLPanel: ["wm.Panel", {"border":"0","height":"100px", fitToContentHeight: true, width: "100%", margin: "10,50,0,50", verticalAlign: "top", horizontalAlign: "left"}, {}, {
					    panel14: ["wm.Panel", {"border":"0","height":"24px",width: "100%","layoutKind":"left-to-right"}, {}, {
						spacer1: ["wm.Spacer", {"width":"202px"}, {}],
						dbRoleBySQLCheckbox: ["wm.Checkbox", {"border":"0","caption":"Roles By SQL Query","captionAlign":"left","captionPosition":"right","captionSize":"380px","displayValue":"1","padding":"2","width":"100%"}, {"onchange":"dbRoleBySQLCheckboxChange"}]
					    }],
					    dbRoleBySQLEnablePanel: ["wm.Panel", {"border":"0","height":"100px", fitToContentHeight: true, verticalAlign: "top", horizontalAlign: "left", width: "100%", margin: "5"}, {}, {
						dbRoleBySQLInput: ["wm.LargeTextArea", {"border":"0","caption":"Enter Query",captionSize: "100px", captionPosition: "left", "emptyValue":"null","height":"48px", width:"100%", helpText: "Enter helptext here"}, {"onchange":"setDirty"}],
						panel22: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_2px"]},"border":"0","height":"24px",width: "100%", "layoutKind":"left-to-right"}, {}, {
						    spacer20: ["wm.Spacer", {"width":"100%"}, {}],
						    dbTestSQLInput: ["wm.Text", {"border":"0","caption":"User ID","emptyValue":"null","padding":"2","width":"250px"}, {"onchange":"setDirty"}],
						    dbTestSQLButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, "caption":"Test Query","margin":"2","width":"100px"}, {"onclick":"dbTestSQLButtonClick"}]
						}],
					    	panel18: ["wm.Panel", {padding: "0,0,4,0", "border":"0","height":"100px",width: "100%", "layoutKind":"left-to-right"}, {}, {
						    spacer5: ["wm.Spacer", {"width":"20px"}, {}],
						    dbTestSQLResultListPanel: ["wm.Panel", {verticalAlign: "top", horizontalAlign: "left", layoutKind: "top-to-bottom", width: "100%", height: "100%"}, {}, {
							dbTestSQLResultLabel: ["wm.Label", {caption: "Roles from query:", width: "100%", height: "18px"}],
							dbTestSQLResultList: ["wm.List", {"border":"1","width":"100%", height: "100%"}, {}],
						    }],
						    dbTestSQLErrorPanel: ["wm.Panel", {verticalAlign: "top", horizontalAlign: "left", layoutKind: "top-to-bottom", width: "100%", height: "100%"}, {}, {
							dbTestSQLErrorPanelLabel: ["wm.Label", {caption: "Errors from Query:", width: "100%", height: "18px"}],
							dbTestSQLErrorLabel: ["wm.Label", {"border":"1","caption":"dbTestSQLErrorLabel","padding":"4","width":"100%", height: "100%"}]
						    }],
						    spacer569: ["wm.Spacer", {"width":"20px"}, {}],
						}]
					    }]
					}]
				    }],
				    ldapLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"LDAP", autoScroll:true}, {"onShow":"showLDAPLayer"}, {
					ldapMainPanel: ["wm.Panel", {width: "100%", height: "300px", fitToContentHeight: true, margin: "10,50,0,50", horizontalAlign: "left", verticalAlign: "top"}, {}, {
					    ldapUrlInput: ["wm.Text", {width: "500px", captionSize: "150px", "border":"0","caption":"LDAP URL","emptyValue":"null","padding":"2",helpText: "The URL of the LDAP server to be used as the root node"}, {"onchange":"setDirty"}],
					    ldapManagerDnInput: ["wm.Text", {width: "500px", captionSize: "150px", "border":"0","caption":"Manager DN","emptyValue":"null","padding":"2",helpText: "Manager account DN, used only for testing conection"}, {"onchange":"setDirty"}],
					    ldapManagerPasswordInput: ["wm.Text", {width: "500px", captionSize: "150px", "border":"0","caption":"Manager Password","emptyValue":"null","padding":"2", password: true,helpText: "Manager account password"}, {"onchange":"setDirty"}],
					    ldapUserDnPatternInput: ["wm.Text", {width: "500px", captionSize: "150px", "border":"0","caption":"User DN Pattern","emptyValue":"null","padding":"2",helpText: "Replace {0} with username and combine with root node to form user DN"}, {"onchange":"setDirty"}],
					    panel5: ["wm.Panel", {"height":"24px", width: "500px", "layoutKind":"left-to-right"}, {}, {
						ldapConnectionResultLabel: ["wm.Label", {"caption":"ldapConnectionResultLabel","border":"0","height":"24px", width: "100%"}],
						spacer7: ["wm.Spacer", {"width":"100%"}, {}],
						ldapConnectionButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},"caption":"Test Connection","margin":"2","width":"150px"}, {"onclick":"ldapConnectionButtonClick"}],
						spacer4: ["wm.Spacer", {"width":"2px"}, {}]

					    }],
					    ldapSearchRoleCheckbox: ["wm.Checkbox", {width: "500px", captionSize: "150px", "caption":"Search User Role","emptyValue":"null"}, {"onchange":"ldapSearchRoleCheckboxChange"}],
					    ldapRoleProviderInput: ["wm.SelectMenu", {width: "500px", captionSize: "150px", "caption":"Select User Role Provider","emptyValue":"null","display":"Select"}, {"onchange":"ldapRoleProviderInputChange"}],
					    ldapRoleLdapPanel: ["wm.Panel", {"width":"100%", "height":"100px", horizontalAlign: "left", verticalAlign: "top"},{},{
						ldapGroupSearchBaseInput: ["wm.Text", {width: "500px", captionSize: "150px", "caption":"Group Search Base","emptyValue":"null",helpText: "Base from which group membership is searched"}, {onchange: "setDirty"}],
						ldapGroupRoleAttributeInput: ["wm.Text", {width: "500px", captionSize: "150px", "caption":"Group Role Attribute","emptyValue":"null",helpText: "Attribute containg role data in group base"}, {onchange: "setDirty"}],
						ldapGroupSearchFilterInput: ["wm.Text", {width: "500px", captionSize: "150px", "caption":"Group Search Filter","emptyValue":"null",helpText: "Filter used to find user's roles. {0} is replacd with user DN"}, {onchange: "setDirty"}]
					    }],
					    ldapRoleDBPanel: ["wm.Panel", {"width":"100%", "height":"200px", horizontalAlign: "left", verticalAlign: "top"},{},{
						ldapRoleDbDataModelInput: ["wm.SelectMenu", {width: "500px", captionSize: "150px", "caption":"Data Model","emptyValue":"null",helpText: "The datamodel to be used for roles"}, {"onchange":"ldapRoleDbDataModelInputChange"}],
						ldapRoleDbEntityInput: ["wm.SelectMenu", {width: "500px", captionSize: "150px", "caption":"Entity","emptyValue":"null",helpText: "The table of the datamodel containing the user info"}, {"onchange":"ldapRoleDbEntityInputChange"}],
						ldapRoleDbUsernameInput: ["wm.SelectMenu", {width: "500px", captionSize: "150px", "caption":"Username Field","emptyValue":"null",helpText: "The table column containing the username, must match LDAP username"}, {onchange: "setDirty"}],
						ldapRoleDbRoleInput: ["wm.SelectMenu", {width: "500px", captionSize: "150px", "caption":"Role Field","emptyValue":"null",helpText: "The table column containing the user role(s) to be used for access control"}, {onchange: "setDirty"}],
						ldapRoleBySQLPanel: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_RightNone","wm_Padding_LeftNone","wm_Padding_BottomNone","wm_Padding_4px"]},"height":"150px", width: "100%"}, {}, {
						    panel26: ["wm.Panel", {"height":"24px","layoutKind":"left-to-right"}, {}, {
							ldapRoleBySQLCheckbox: ["wm.Checkbox", {"captionSize":"150px","caption":"Roles By SQL Query","width":"500px"}, {"onchange":"ldapRoleBySQLCheckboxChange"}]
						    }],
						    ldapRoleBySQLEnablePanel: ["wm.Panel", {"height":"150px","width":"100%", fitContentToHeight: true, verticalAlign: "top", horizontalAlign: "left"}, {}, {
							ldapRoleBySQLInput: ["wm.LargeTextArea", {"width":"500px","emptyValue":"null","height":"68px","display":"TextArea", caption: "Enter Query", captionSize: "150px", captionPosition: "left", helpText: "Enter help here"}, {onchange: "setDirty"}]
						    }]
						}]								
					    }]	
					}]
				    }],
				    jossoLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"JOSSO"}, {"onShow":"showJossoLayer"}, {
					userNotice: ["wm.Html", {"border":"0","height":"142px","html":"<h3> Edit web.xml <BR> Register as partner app in agent config <BR> Copy jsp to webapproot</h3>","width":"359px", padding: "5"}, {}]
				    }]
				}]
			    }]
			}]
		    }]
		}],
				rolesLayer: ["wm.Layer", {caption: "Roles"}, {}, {
		panelBottom: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","width":"500px"}, {}, {
			spacer8a: ["wm.Spacer", {"height":"100%","showing":false,"width":"100%"}, {}],
			spacer8b: ["wm.Spacer", {"height":"100%","width":"57px"}, {}],
				panelRoles: ["wm.Panel", {"border":"0","height":"100%","width":"100%"}, {}, {
				    label2a: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_Padding_4px"]},"border":"0","caption":"Role Configuration","padding":"4"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				    }],
				    panela2: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left"}, {}, {
					panel8a: ["wm.Panel", {"border":"0","height":"1px","layoutKind":"left-to-right","width":"100%"}, {}],
					panel11a: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center",verticalAlign: "top", "layoutKind":"left-to-right","padding":"4","width":"100%"}, {}, {
					    panel14a: ["wm.Panel", {"border":"0","width":"638px", height: "100%", padding: "8"}, {}, {
						rolePanel: ["wm.Panel", {"border":"0","height":"100%","imageList":"smallToolbarImageList"}, {}, {
						    panel9: ["wm.Panel", {"border":"0","height":"38px","layoutKind":"left-to-right"}, {}, {
							spacer17: ["wm.Spacer", {"width":"96px"}, {}],
							panel12: ["wm.Panel", {"border":"0","width":"362px"}, {}, {
							    addRoleInput: ["wm.Text", {"border":"0","caption":"Role","captionSize":"50px","emptyValue":"null","padding":"2"}, {"onchange":"setDirty", onEnterKeyPress: "addRoleButtonClick"}, {
							    }]
							}],
							panel13: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_RightNone","wm_Padding_TopNone","wm_Padding_BottomNone","wm_Padding_24px"]},"border":"0","width":"40px"}, {}, {
							    addRoleButton: ["wm.ToolButton", {"border":"0","height":"24px","hint":"Add Role","imageIndex":25,"margin":"0,0,0,2","width":"30px"}, {"onclick":"addRoleButtonClick"}]
							}]
						    }],
						    panel10: ["wm.Panel", {"border":"0","height":"100%","layoutKind":"left-to-right"}, {}, {
							spacer19: ["wm.Spacer", {"width":"96px"}, {}],
							roleList: ["wm.List", {"_classes":{"domNode":["wm_BackgroundColor_White"]},"border":"0","columnWidths":"100%","headerVisible":false,"height":"100%","width":"360px"}, {}],
							panel11: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_RightNone","wm_Padding_TopNone","wm_Padding_24px"]},"border":"0","width":"40px"}, {}, {
							    deleteRoleButton: ["wm.ToolButton", {"border":"0","height":"28px","hint":"Remove Role","imageIndex":0,"margin":"0,0,0,4","width":"30px"}, {"onclick":"deleteRoleButtonClick"}]
							}]
						    }]
						}]
					    }]
					}],
					panel12a: ["wm.Panel", {"border":"0","height":"1px","layoutKind":"left-to-right","width":"100%"}, {}]
				    }]
				}],
			spacer39: ["wm.Spacer", {"width":"15px"}, {}],
			benchbevel5: ["wm.Bevel", {"height":"100%","showing":false,"width":"10px"}, {}],
			spacer40: ["wm.Spacer", {"width":"15px"}, {}],
			panelLiveLayout: ["wm.Panel", {"border":"0","height":"100px","showing":false,"width":"100%"}, {}, {
			    label1: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","caption":"Live Layout Login","height":"33px","padding":"4","width":"96px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			    }],
			    liveLayoutUser: ["wm.Text", {"border":"0","caption":"User","emptyValue":"null","padding":"2"}, {"onchange":"setDirty"}],
			    liveLayoutPassword: ["wm.Text", {"border":"0","caption":"Password","emptyValue":"null","padding":"2"}, {"onchange":"setDirty"}],
			    spacer9: ["wm.Spacer", {"height":"30px","width":"96px"}, {}],
			    label2: ["wm.Label", {"border":"0","caption":"The username/password here will be the account used by live layout to log on and access your database and javaservices","height":"93px","padding":"4","singleLine":false,"width":"96px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			    }]
			}]
		    }]
		}],
		servicesLayer: ["wm.Layer", {caption: "Setup Services"}, {"onShow":"servicesLayerShow"}, {
		    servicesOuterPanel: ["wm.Panel", {border: "3", borderColor: "#959DAB",  margin: "10", width: "100%", height: "100%", layoutKind: "left-to-right"}, {}, {
			serviceList: ["wm.List", {width: "300px", headerVisible: true, height: "100%", dataFields: "name, Settings", border: "0,2,0,0", borderColor:  "#959DAB"}, {onselect: "serviceListSelect"}, {
			    binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"varServList","targetProperty":"dataSet"}, {}]
			    }]
			}],
			servicesInnerPanel: ["wm.Panel", {width: "100%", height: "100%", verticalAlign: "top", horizontalAlign: "left", layoutKind: "top-to-bottom"}, {}, {
			    servicesInnerHeader: ["wm.Label", {caption: "", width: "100%", height: "24px"}],
			    servicesBevel: ["wm.Bevel", {}],
			    servicesSettingsPanel: ["wm.Panel", {width: "100%", height: "100%",verticalAlign: "top", horizontalAlign: "left", layoutKind: "top-to-bottom"},{},{
				selectAccess: ["wm.SelectMenu", {"caption":"Who can access","width":"260px", displayField: "name", dataField: "dataValue"}, {onchange: "serviceSettingsChange"}, {
				    binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"varRoleList","targetProperty":"dataSet"}, {}],
					wire2: ["wm.Wire", {"expression":undefined,"expression":"${serviceList.selectedItem.attributes} || ''","targetProperty":"dataValue"}, {}]
				    }]
				}]
			    }]
			}]
		    }]
		}]
	    }]
	}]
}