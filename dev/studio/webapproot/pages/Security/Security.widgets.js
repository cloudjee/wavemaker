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
		    label1a: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_Padding_4px"]},"border":"0","caption":"Security Configuration","padding":"4"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		    }],
		    panel1a: ["wm.Panel", {"border":"0","height":"350px","horizontalAlign":"left"}, {}, {
			secConfigPanel: ["wm.Panel", {"border":"0","height":"70px","horizontalAlign":"center","layoutKind":"left-to-right","width":"100%"}, {}, {
			    secConfigControls: ["wm.Panel", {"border":"0","width":"638px"}, {}, {
				panel16: ["wm.Panel", {"border":"0","height":"100%"}, {}, {
				    secProviderInput: ["wm.Editor", {"border":"0","caption":"Security Provider","captionAlign":"left","captionSize":"120px","display":"Select","emptyValue":"null","height":"20px","padding":"2","width":"300px"}, {"onchange":"secProviderInputChange"}, {
					editor: ["wm._SelectEditor", {}, {}]
				    }],
				    panel3: ["wm.Panel", {"border":"0","height":"56px"}, {}, {
					secEnableInput: ["wm.CheckBoxEditor", {"border":"0","caption":"Enable Security","captionAlign":"left","captionSize":"120px","displayValue":"1","margin":"0,0,0,30","padding":"2","width":"100%"}, {"onchange":"securityCheckboxChange"}, {
					    editor: ["wm._CheckBoxEditor", {}, {}]
					}],
					showLoginPageInput: ["wm.CheckBoxEditor", {"border":"0","caption":"Show Login Page","captionAlign":"left","captionSize":"120px","displayValue":"1","margin":"0,0,0,60","padding":"2","width":"100%"}, {"onchange":"setDirty"}, {
					    editor: ["wm._CheckBoxEditor", {}, {}]
					}]
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
					panel1: ["wm.Panel", {"border":"0","height":"86px","layoutKind":"left-to-right"}, {}, {
					    spacer11: ["wm.Spacer", {"width":"96px"}, {}],
					    panel6: ["wm.Panel", {"border":"0","width":"360px"}, {}, {
						demoUsernameInput: ["wm.Editor", {"border":"0","caption":"Username","emptyValue":"null","height":"20px","padding":"2"}, {}, {
						    editor: ["wm._TextEditor", {}, {}]
						}],
						demoPasswordInput: ["wm.Editor", {"border":"0","caption":"Password","emptyValue":"null","height":"20px","padding":"2"}, {}, {
						    editor: ["wm._TextEditor", {}, {}]
						}],
						demoRoleInput: ["wm.Editor", {"border":"0","caption":"Role","display":"Select","emptyValue":"null","height":"20px","padding":"2"}, {}, {
						    editor: ["wm._SelectEditor", {}, {}]
						}]
					    }],
					    spacer2: ["wm.Spacer", {"width":"4px"}, {}],
					    panel8: ["wm.Panel", {"border":"0","width":"40px"}, {}, {
						spacer13: ["wm.Spacer", {"height":"34px"}, {}],
						demoAddUserButton: ["wm.ToolButton", {"border":"0","height":"28px","hint":"Add User","imageIndex":25,"margin":"0","width":"24px"}, {"onclick":"demoAddUserButtonClick"}]
					    }]
					}],
					panel2: ["wm.Panel", {"border":"0","height":"140px","layoutKind":"left-to-right"}, {}, {
					    spacer12: ["wm.Spacer", {"width":"96px"}, {}],
					    demoUserList: ["wm.List", {"border":"0","dataFields":"userid,password,roles","width":"358px"}, {"onformat":"demoUserListFormat"}],
					    spacer3: ["wm.Spacer", {"width":"6px"}, {}],
					    panel7: ["wm.Panel", {"border":"0","width":"40px"}, {}, {
						demoDeleteUserButton: ["wm.ToolButton", {"border":"0","height":"28px","hint":"Remove User","imageIndex":0,"margin":"0","width":"24px"}, {"onclick":"demoDeleteUserButtonClick"}]
					    }]
					}]
				    }],
				    databaseLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"Database"}, {"onShow":"showDBLayer"}, {
					dbDataModelInput: ["wm.Editor", {"border":"0","caption":"Data Model","display":"Select","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"dbDataModelInputChange"}, {
					    editor: ["wm._SelectEditor", {}, {}]
					}],
					dbEntityInput: ["wm.Editor", {"border":"0","caption":"Entity","display":"Select","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"dbEntityInputChange"}, {
					    editor: ["wm._SelectEditor", {}, {}]
					}],
					dbUsernameInput: ["wm.Editor", {"border":"0","caption":"Username Field <span style='cursor:pointer;font-weight:bold;color: black;' id='HelpUID1'>?</a>","display":"Select","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
					    editor: ["wm._SelectEditor", {}, {}]
					}],
					dbUseridInput: ["wm.Editor", {"border":"0","caption":"User ID Field <span style='cursor:pointer;font-weight:bold;color: black;' id='HelpUID2'>?</a>","display":"Select","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
					    editor: ["wm._SelectEditor", {}, {}]
					}],
					dbPasswordInput: ["wm.Editor", {"border":"0","caption":"Password Field","display":"Select","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
					    editor: ["wm._SelectEditor", {}, {}]
					}],
					dbRoleInput: ["wm.Editor", {"border":"0","caption":"Role Field","display":"Select","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
					    editor: ["wm._SelectEditor", {}, {}]
					}],
					spacer30: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
					labelmt: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_Padding_4px"]},"border":"0","caption":"Multitenant Configuration","padding":"4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}],
					tenantIdField: ["wm.Editor", {"border":"0","caption":"Tenant ID Field Name","captionSize":"211px","display":"Select","emptyValue":"null","height":"20px","padding":"2","width":"100px"}, {"onchange":"setDirty"}, {
					    editor: ["wm._SelectEditor", {}, {}]
					}],
					defTenantId: ["wm.Editor", {"border":"0","caption":"Default Tenant ID Value","captionSize":"211px","emptyValue":"null","height":"20px","padding":"2","width":"100px"}, {"onchange":"setDirty"}, {
					    editor: ["wm._TextEditor", {}, {}]
					}],
					spacer31: ["wm.Spacer", {"height":"10px","width":"96px"}, {}],
					dbRoleBySQLPanel: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_RightNone","wm_Padding_LeftNone","wm_Padding_BottomNone","wm_Padding_4px"]},"border":"0","height":"210px"}, {}, {
					    panel14: ["wm.Panel", {"border":"0","height":"24px","layoutKind":"left-to-right"}, {}, {
						spacer1: ["wm.Spacer", {"width":"202px"}, {}],
						dbRoleBySQLCheckbox: ["wm.CheckBoxEditor", {"border":"0","caption":"Roles By SQL Query","captionAlign":"left","captionPosition":"right","captionSize":"380px","displayValue":"1","padding":"2","width":"100%"}, {"onchange":"dbRoleBySQLCheckboxChange"}, {
						    editor: ["wm._CheckBoxEditor", {}, {}]
						}]
					    }],
					    dbRoleBySQLEnablePanel: ["wm.Panel", {"border":"0","height":"100%"}, {}, {
						dbRoleBySQLInput: ["wm.Editor", {"border":"0","caption":" ","display":"TextArea","emptyValue":"null","height":"48px","padding":"2"}, {"onchange":"setDirty"}, {
						    editor: ["wm._TextAreaEditor", {}, {}]
						}],
						panel22: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_2px"]},"border":"0","height":"24px","layoutKind":"left-to-right"}, {}, {
						    spacer20: ["wm.Spacer", {"width":"100%"}, {}],
						    dbTestSQLInput: ["wm.Editor", {"border":"0","caption":"User ID","emptyValue":"null","padding":"2","width":"250px"}, {"onchange":"setDirty"}, {
							editor: ["wm._TextEditor", {}, {}]
						    }],
						    dbTestSQLButton: ["wm.Button", {"caption":"Test Query","margin":"2","width":"100px"}, {"onclick":"dbTestSQLButtonClick"}]
						}],
						panel18: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_2px","wm_Padding_LeftNone","wm_Padding_TopNone"]},"border":"0","height":"48px","layoutKind":"left-to-right"}, {}, {
						    spacer5: ["wm.Spacer", {"width":"206px"}, {}],
						    dbTestSQLResultList: ["wm.List", {"_classes":{"domNode":["wm_Border_Size1px","wm_Border_StyleSolid","wm_Border_ColorLightGray"]},"border":"0","width":"100%"}, {}]
						}],
						panel17: ["wm.Panel", {"border":"0","height":"30px","layoutKind":"left-to-right"}, {}, {
						    spacer15: ["wm.Spacer", {"width":"206px"}, {}],
						    dbTestSQLErrorLabel: ["wm.Label", {"border":"0","caption":"dbTestSQLErrorLabel","padding":"4","width":"100%"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						    }]
						}]
					    }]
					}]
				    }],
				    ldapLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"LDAP"}, {"onShow":"showLDAPLayer"}, {
					ldapUrlInput: ["wm.Editor", {"border":"0","caption":"LDAP URL","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
					    editor: ["wm._TextEditor", {}, {}]
					}],
					ldapManagerDnInput: ["wm.Editor", {"border":"0","caption":"Manager DN","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
					    editor: ["wm._TextEditor", {}, {}]
					}],
					ldapManagerPasswordInput: ["wm.Editor", {"border":"0","caption":"Manager Password","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
					    editor: ["wm._TextEditor", {"password":true}, {}]
					}],
					ldapUserDnPatternInput: ["wm.Editor", {"border":"0","caption":"User DN Pattern","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
					    editor: ["wm._TextEditor", {}, {}]
					}],
					ldapSearchRoleCheckbox: ["wm.CheckBoxEditor", {"border":"0","caption":"Search User Role","displayValue":"1","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"ldapSearchRoleCheckboxChange"}, {
					    editor: ["wm._CheckBoxEditor", {}, {}]
					}],
					ldapGroupSearchBaseInput: ["wm.Editor", {"border":"0","caption":"Group Search Base","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
					    editor: ["wm._TextEditor", {}, {}]
					}],
					ldapGroupRoleAttributeInput: ["wm.Editor", {"border":"0","caption":"Group Role Attribute","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
					    editor: ["wm._TextEditor", {}, {}]
					}],
					ldapGroupSearchFilterInput: ["wm.Editor", {"border":"0","caption":"Group Search Filter","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
					    editor: ["wm._TextEditor", {}, {}]
					}],
					spacer6: ["wm.Spacer", {"height":"2px"}, {}],
					panel5: ["wm.Panel", {"border":"0","height":"24px","layoutKind":"left-to-right"}, {}, {
					    spacer7: ["wm.Spacer", {"width":"100%"}, {}],
					    ldapConnectionButton: ["wm.Button", {"caption":"Test Connection","margin":"2","width":"150px"}, {"onclick":"ldapConnectionButtonClick"}],
					    spacer4: ["wm.Spacer", {"width":"2px"}, {}]
					}],
					ldapConnectionResultLabel: ["wm.Label", {"border":"0","caption":"ldapConnectionResultLabel","padding":"4"}, {}, {
					    format: ["wm.DataFormatter", {}, {}]
					}]
				    }],
				    jossoLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"JOSSO"}, {"onShow":"showJossoLayer"}, {
					userNotice: ["wm.Html", {"border":"0","height":"142px","html":"<h3> Edit web.xml <BR> Register as partner app in agent config <BR> Copy jsp to webapproot</h3>","width":"359px"}, {}]
				    }]
				}]
			    }]
			}],
			panel10a: ["wm.Panel", {"border":"0","height":"1px","layoutKind":"left-to-right","width":"100%"}, {}]
		    }],
		    splitter1a: ["wm.Splitter", {"height":"10px","width":"100%"}, {}],
		    panelBottom: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","width":"500px"}, {}, {
			spacer8a: ["wm.Spacer", {"height":"100%","showing":false,"width":"100%"}, {}],
			spacer8b: ["wm.Spacer", {"height":"100%","width":"57px"}, {}],
/*
			layersBottom: ["wm.Layers", {"width":"640px"}, {}, {
			    layerRoles: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"left","verticalAlign":"top"}, {}, {
			    */
				panelRoles: ["wm.Panel", {"border":"0","height":"100%","width":"100%"}, {}, {
				    label2a: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_Padding_4px"]},"border":"0","caption":"Role Configuration","padding":"4"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				    }],
				    panela2: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left"}, {}, {
					panel8a: ["wm.Panel", {"border":"0","height":"1px","layoutKind":"left-to-right","width":"100%"}, {}],
					panel11a: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","padding":"4","width":"100%"}, {}, {
					    panel14a: ["wm.Panel", {"border":"0","width":"638px"}, {}, {
						rolePanel: ["wm.Panel", {"border":"0","height":"100%","imageList":"smallToolbarImageList","padding":"4"}, {}, {
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
						    panel10: ["wm.Panel", {"border":"0","height":"280px","layoutKind":"left-to-right"}, {}, {
							spacer19: ["wm.Spacer", {"width":"96px"}, {}],
							roleList: ["wm.List", {"_classes":{"domNode":["wm_BackgroundColor_White"]},"border":"0","columnWidths":"100%","headerVisible":false,"height":"260px","width":"360px"}, {}],
							panel11: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_RightNone","wm_Padding_TopNone","wm_Padding_24px"]},"border":"0","width":"40px"}, {}, {
							    deleteRoleButton: ["wm.ToolButton", {"border":"0","height":"28px","hint":"Remove Role","imageIndex":0,"margin":"0,0,0,4","width":"30px"}, {"onclick":"deleteRoleButtonClick"}]
							}]
						    }]/*,
						    panel4: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"96px"}, {}, {
							buttonAdvanced: ["wm.Button", {"caption":"Advanced Role Configure ","margin":"4", width:"160px"}, {"onclick":"buttonAdvancedClick"}]
						    }]*/
						}]
					    }]
					}],
					panel12a: ["wm.Panel", {"border":"0","height":"1px","layoutKind":"left-to-right","width":"100%"}, {}]
				    }]
				}],
/*
			    }],
			    layerAdvanced: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"center","verticalAlign":"top"}, {"onShow":"layerAdvancedShow"}, {
				panel15: ["wm.Panel", {"border":"0","height":"34px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"center","width":"100%"}, {}, {
				    selectService: ["wm.SelectMenu", {"caption":"Service","width":"260px"}, {}, {
					binding: ["wm.Binding", {}, {}, {
					    wire: ["wm.Wire", {"expression":undefined,"source":"varServList","targetProperty":"dataSet"}, {}]
					}]
				    }],
				    spacer100: ["wm.Spacer", {"width":"20px"}, {}],
  				    buttonAddRule: ["wm.Button", {"caption":"Add Rule","margin":"4","width":"95px"}, {"onclick":"buttonAddRuleClick"}]
				}],
				listURLMap: ["wm.List", {"border":"0","columnWidths":"100%","headerVisible":false,"height":"200px","width":"100%"}, {"onselect":"listURLMapSelect","ondeselect":"listURLMapDeselect"}, {
				    binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"varUrlMap","targetProperty":"dataSet"}, {}]
				    }]
				}],
	   			buttonDelRule: ["wm.Button", {"caption":"Delete Selected","disabled":true,"margin":"4","width":"120px"}, {"onclick":"buttonDelRuleClick"}],
	   			labAdvInfo: ["wm.Label", {"align":"center","border":"0","height":"40px","width":"100%","padding":"4","singleLine":false}, {}, {
				    format: ["wm.DataFormatter", {}, {}]
				}],
	    			panel23: ["wm.Panel", {"border":"0","height":"60px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"center","width":"100%"}, {}, {	
				    buttonAdvExit: ["wm.Button", {"caption":"Close","margin":"4"}, {"onclick":"buttonAdvExitClick"}]
				}],
			    }]
			}],*/
			spacer39: ["wm.Spacer", {"width":"15px"}, {}],
			benchbevel5: ["wm.Bevel", {"height":"100%","showing":false,"width":"10px"}, {}],
			spacer40: ["wm.Spacer", {"width":"15px"}, {}],
			panelLiveLayout: ["wm.Panel", {"border":"0","height":"100px","showing":false,"width":"100%"}, {}, {
			    label1: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","caption":"Live Layout Login","height":"33px","padding":"4","width":"96px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			    }],
			    liveLayoutUser: ["wm.Editor", {"border":"0","caption":"User","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
				editor: ["wm._TextEditor", {}, {}]
			    }],
			    liveLayoutPassword: ["wm.Editor", {"border":"0","caption":"Password","emptyValue":"null","height":"20px","padding":"2"}, {"onchange":"setDirty"}, {
				editor: ["wm._TextEditor", {}, {}]
			    }],
			    spacer9: ["wm.Spacer", {"height":"30px","width":"96px"}, {}],
			    label2: ["wm.Label", {"border":"0","caption":"The username/password here will be the account used by live layout to log on and access your database and javaservices","height":"93px","padding":"4","singleLine":false,"width":"96px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			    }]
			}]
		    }],
		    benchbevel4: ["wm.Bevel", {"height":"10px","width":"100%"}, {}]
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