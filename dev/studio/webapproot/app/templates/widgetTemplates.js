/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
dojo.provide("wm.studio.app.templates.widgetTemplates");

if (!wm.widgetTemplates) wm.widgetTemplates = {};
if (!wm.fullTemplates) wm.fullTemplates = {};
if (!wm.widgetSpecificTemplate) wm.widgetSpecificTemplate = {};


/*********************************************************************************************************************************************************************
 * NOTES: 
 *    Michael: Looks like the people who designed this originally intended for the wm.Template to have high level properties of contaner such as layoutKind,
 *             width, height, border, etc... but these now appear to be ignored.  Anything not in _template is NOT dropped onto the canvas when you drag
 *             a template from palette to canvas.
 *    Michael: While templates shown here sometimes have a wm.Template in _template, this seems to be completely unnecessary; all it does is place
 *             specially named panels into the canvas when dropped onto the canvas.
 *********************************************************************************************************************************************************************/
 /***** COMMENTING OUT OLD TEMPLATES ***/
 
 
 
 
 
wm.widgetTemplates.twoColumn = {
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "100%",
	_template: {
	    toolbarPanel: ["wm.Panel", {horizontalAlign: "left", verticalAlign: "top", _classes: {domNode: ["toolbar"]}, border: "0,0,2,0", layoutKind: "left-to-right", height: "36px", width: "100%"}, {}, {
		button1: ["wm.Button", {width: "80px", height: "100%"}, {}],
		button2: ["wm.Button", {width: "80px", height: "100%"}, {}],
		button3: ["wm.Button", {width: "80px", height: "100%"}, {}]
	    }],
            panel1: ["wm.Panel", {horizontalAlign: "left", verticalAlign: "top", layoutKind: "left-to-right", width: "100%", height: "100%"}, {}, {
	        leftSideBarTOC: ["wm.Panel", {horizontalAlign: "left", verticalAlign: "top", _classes: {domNode: ["TOC"]}, layoutKind: "top-to-bottom", width: "246px", height: "100%"}, {}],
	        splitter1: ["wm.Splitter", {layout: "left"}, {}],
	        mainContent: ["wm.Panel", {horizontalAlign: "left", verticalAlign: "top", isMajorContent: true, layoutKind: "top-to-bottom", width: "100%", height: "100%"}, {}]
            }]
	}
}
wm.fullTemplates.fancyTemplate = {
	displayName: bundlePackage.FancyTemplate,
        thumbnail: "/wavemaker/app/templates/widgetTemplateImages/fancyTemplate.png",
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "100%",
	verticalAlign: "top",
	horizontalAlign: "center",
    autoScroll: true,
	_template: {
	varTemplateUsername: ["wm.ServiceVariable", {"autoUpdate":true,"designTime":true,"operation":"getUserName","service":"securityService","startUpdate":true}, {}, {
		input: ["wm.ServiceInput", {"type":"getUserNameInputs"}, {}]
	}],
	varTemplateLogout: ["wm.LogoutVariable", {}, {}, {
		input: ["wm.ServiceInput", {"type":"logoutInputs"}, {}]
	}],	
	panel1: ["wm.Panel", {"border":"0,0","borderColor":"#999999","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"80%"}, {}, {
		panel2: ["wm.HeaderContentPanel", {"borderColor":"#004c68","height":"60px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,10","verticalAlign":"middle","width":"100%"}, {}, {
			picture1: ["wm.Picture", {"border":"0","height":"50px","source":"lib/wm/base/widget/themes/default/images/wmLogo.png","width":"62px"}, {}],
			label1: ["wm.Label", {"border":"0","caption":"Quisque Molestie Porta","width":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel10: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"middle","width":"300px"}, {}, {
				panel14: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
					label4: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"border":"0","caption":"Welcome, ","height":"20px","width":"100%"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":"\"Welcome, \" + ${varTemplateUsername.dataValue}","targetProperty":"caption"}, {}]
						}],
						format: ["wm.DataFormatter", {}, {}]
					}],
					button2: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"borderColor":"#666666","caption":"Log Out","height":"28px"}, {"onclick":"varTemplateLogout"}]
				}],
				panel15: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
					text1: ["wm.Text", {"displayValue":"Search","width":"100%"}, {}],
					picture5: ["wm.Picture", {"border":"0","height":"16px","source":"lib/images/silkIcons/zoom.png","width":"16px"}, {}]
				}]
			}]
		}],
		panel3: ["wm.Panel", {"height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			dojoMenu1: ["wm.DojoMenu", {"_classes":{"domNode":["ClickableDojoMenu"]},"borderColor":"#666666","eventList":[{"label":"File","children":[{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"}]},{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"},{"label":"Edit","children":[{"label":"Cut"},{"label":"Copy"},{"label":"Paste"}]},{"label":"Cut"},{"label":"Copy"},{"label":"Paste"},{"label":"Zoom","children":[{"label":"25%"},{"label":"50%"},{"label":"100%"},{"label":"150%"}]},{"label":"25%"},{"label":"50%"},{"label":"100%"},{"label":"150%"},{"label":"Help"}],"height":"100%","menu":"File > New, Open, Save, Close\nEdit > Cut, Copy, Paste\nZoom > 25%, 50%, 100%, 150%\nHelp","padding":"4,10,0,10","structure":"{\"items\":[{\"label\":\"File\",\"children\":[{\"label\":\"New\"},{\"label\":\"Open\"},{\"label\":\"Save\"},{\"label\":\"Close\"}]},{\"label\":\"Edit\",\"children\":[{\"label\":\"Cut\"},{\"label\":\"Copy\"},{\"label\":\"Paste\"}]},{\"label\":\"Zoom\",\"children\":[{\"label\":\"25%\"},{\"label\":\"50%\"},{\"label\":\"100%\"},{\"label\":\"150%\"}]},{\"label\":\"Help\"}]}","transparent":false}, {}]
		}],
		panel4: ["wm.MainContentPanel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			tabLayers1: ["wm.TabLayers", {}, {}, {
				layer1: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"layer1","horizontalAlign":"left","verticalAlign":"top"}, {}, {
					fancyPanel1: ["wm.FancyPanel", {"horizontalAlign":"left","innerBorder":"1","labelHeight":"30","verticalAlign":"top"}, {}, {
						dojoGrid1: ["wm.DojoGrid", {"borderColor":"#666666","dsType":"EntryData","height":"100%","columns":[{"show":true,"id":"name","title":"Name","width":"auto","displayType":undefined,"noDelete":true,"align":"left"},{"show":true,"id":"dataValue","title":"DataValue","width":"auto","displayType":undefined,"noDelete":true,"align":"left"}]}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"source":"studio.varTemplateData","targetProperty":"dataSet"}, {}]
							}]
						}],
						panel7: ["wm.Panel", {"height":"36px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							button1: ["wm.Button", {}, {}],
							toggleButton2: ["wm.ToggleButton", {"borderColor":"#666666","clicked":true,"width":"100px"}, {}]
						}],

					}],
					panel6: ["wm.Panel", {"height":"320px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						fancyPanel3: ["wm.FancyPanel", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
							panel12: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
								text3: ["wm.Text", {"caption":"text3","displayValue":""}, {}],
								checkbox1: ["wm.Checkbox", {"caption":"checkbox1","displayValue":""}, {}],
								currency1: ["wm.Currency", {"caption":"currency1","displayValue":""}, {}],
								date1: ["wm.Date", {"caption":"date1","displayValue":""}, {}],
								number1: ["wm.Number", {"caption":"number1","displayValue":""}, {}],
								radioButton1: ["wm.RadioButton", {"caption":"radioButton1","displayValue":""}, {}],
								slider1: ["wm.Slider", {"caption":"slider1","displayValue":""}, {}],
								richText1: ["wm.RichText", {"borderColor":"#666666","height":"100%","margin":"10"}, {}]
							}],

						}],
						panel11: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","padding":"10","verticalAlign":"top","width":"300px"}, {}, {
							panel8: ["wm.Panel", {"height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								text2: ["wm.Text", {"displayValue":"Curabitur quis nibh","width":"100%"}, {}]
							}],
							fancyPanel2: ["wm.FancyPanel", {"height":"230px","horizontalAlign":"left","margin":"3","title":"Calendar","verticalAlign":"top"}, {}, {
								calendar1: ["wm.dijit.Calendar", {"borderColor":"#666666","height":"100%","width":"100%"}, {}],

							}],
							panel9: ["wm.Panel", {"height":"36px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								button4: ["wm.Button", {}, {}],
								toggleButton1: ["wm.ToggleButton", {"clicked":true,"width":"100px"}, {}]
							}]
						}]
					}]
				}],
				layer2: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"layer2","horizontalAlign":"left","verticalAlign":"top"}, {}]
			}]
		}],
		panel5: ["wm.Panel", {"height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
			picture2: ["wm.Picture", {"border":"0","height":"20px","source":"lib/wm/base/widget/themes/default/images/wmSmallLogo.png","width":"25px"}, {}],
			label2: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"border":"0","caption":"Powered By Wavemaker","height":"100%","width":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			label3: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"align":"right","border":"0","caption":"Copyright [company name] 2010","height":"100%","width":"300px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}]
	}]}	
}

wm.fullTemplates.sideMenuTemplate = {
	displayName: bundlePackage.SideMenu,
        thumbnail: "/wavemaker/app/templates/widgetTemplateImages/sideMenuTemplate.png",
	layoutKind: "left-to-right",
	width: "100%",
	height: "100%",
	verticalAlign: "top",
	horizontalAlign: "left",
    autoScroll: true,
	_template: {
	varTemplateUsername: ["wm.ServiceVariable", {"autoUpdate":true,"designTime":true,"operation":"getUserName","service":"securityService","startUpdate":true}, {}, {
		input: ["wm.ServiceInput", {"type":"getUserNameInputs"}, {}]
	}],
	varTemplateLogout: ["wm.LogoutVariable", {}, {}, {
		input: ["wm.ServiceInput", {"type":"logoutInputs"}, {}]
	}],		
	panel1: ["wm.Panel", {"border":"0,1,0,0","borderColor":"#999999","height":"100%","horizontalAlign":"left","minWidth":900,"verticalAlign":"top","width":"75%"}, {}, {
		panel2: ["wm.HeaderContentPanel", {"border":"0,0,1,0","height":"65px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","padding":"0,10,0,10","verticalAlign":"middle","width":"100%"}, {}, {
			picture1: ["wm.Picture", {"border":"0","height":"50px","source":"lib/wm/base/widget/themes/default/images/wmLogo.png","width":"62px"}, {}],
			label3: ["wm.Label", {"border":"0","caption":"[Application Name]","width":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel10: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"middle","width":"300px"}, {}, {
				panel15: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
					text1: ["wm.Text", {"displayValue":"Search","width":"100%"}, {}],
					picture5: ["wm.Picture", {"border":"0","height":"16px","source":"lib/images/silkIcons/zoom.png","width":"16px"}, {}]
				}]
			}]
		}],
		panel3: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			panel5: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"120px"}, {}, {
				dojoMenu1: ["wm.DojoMenu", {"_classes":{"domNode":["ClickableDojoMenu"]},"eventList":[{"label":"Placerat","children":[{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"}]},{"label":"Tristique"},{"label":"Lacinia"},{"label":"Egestas"},{"label":"Viverra"},{"label":"Feugiat","children":[{"label":"Cut"},{"label":"Copy"},{"label":"Paste"}]},{"label":"Consequat"},{"label":"Facilisis"},{"label":"Convallis"},{"label":"Pulvinar"},{"label":"Bibendum"},{"label":"Bibendum"},{"label":"Curabitur"},{"label":"Phasellus"},{"label":"Habitasse"}],"height":"100%","menu":"Placerat > Tristique, Lacinia, Egestas, Viverra\nFeugiat > Consequat, Facilisis, Convallis\nBibendum > Pulvinar, Bibendum, Curabitur, Phasellus\nHabitasse","padding":"20,0,0,0","structure":"{\"items\":[{\"label\":\"Placerat\",\"children\":[{\"label\":\"Tristique\"},{\"label\":\"Lacinia\"},{\"label\":\"Egestas\"},{\"label\":\"Viverra\"}]},{\"label\":\"Feugiat\",\"children\":[{\"label\":\"Consequat\"},{\"label\":\"Facilisis\"},{\"label\":\"Convallis\"}]},{\"label\":\"Bibendum\",\"children\":[{\"label\":\"Pulvinar\"},{\"label\":\"Bibendum\"},{\"label\":\"Curabitur\"},{\"label\":\"Phasellus\"}]},{\"label\":\"Habitasse\"}]}","transparent":false,"vertical":true}, {}]
			}],
			panel4: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}]
		}],
		panel6: ["wm.HeaderContentPanel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			picture2: ["wm.Picture", {"border":"0","height":"100%","source":"lib/wm/base/widget/themes/default/images/wmSmallLogo.png","width":"24px"}, {}],
			label2: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"border":"0","caption":"Powered by WaveMaker","height":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			label1: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"align":"right","border":"0","caption":"Copyright [company name] 2010","height":"100%","width":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}]	
	}]}
}

wm.fullTemplates.tabTemplate = {
	displayName: bundlePackage.TabsTemplate,
        thumbnail: "/wavemaker/app/templates/widgetTemplateImages/tabLayersTemplate.png",
	layoutKind: "left-to-right",
	width: "100%",
	height: "100%",
	verticalAlign: "top",
	horizontalAlign: "center",
    autoScroll: true,
	_template: {
	varTemplateUsername: ["wm.ServiceVariable", {"autoUpdate":true,"designTime":true,"operation":"getUserName","service":"securityService","startUpdate":true}, {}, {
		input: ["wm.ServiceInput", {"type":"getUserNameInputs"}, {}]
	}],
	varTemplateLogout: ["wm.LogoutVariable", {}, {}, {
		input: ["wm.ServiceInput", {"type":"logoutInputs"}, {}]
	}],		
	panel3: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":900,"verticalAlign":"top","width":"75%"}, {}, {
		panel1: ["wm.HeaderContentPanel", {"border":"0,0,1,0","borderColor":"#333333","height":"65px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,10","verticalAlign":"middle","width":"100%"}, {}, {
			picture1: ["wm.Picture", {"border":"0","height":"50px","source":"lib/wm/base/widget/themes/default/images/wmLogo.png","width":"62px"}, {}],
			label3: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_20px","wm_FontSizePx_24px"]},"border":"0","caption":"[Application Name]","width":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel5: ["wm.Panel", {"height":"100%","horizontalAlign":"right","verticalAlign":"middle","width":"100%"}, {}, {
				dojoMenu1: ["wm.DojoMenu", {"eventList":[{"label":"Help"},{"label":"About"}],"height":"24px","menu":"Help\nAbout","structure":"{\"items\":[{\"label\":\"Help\"},{\"label\":\"About\"}]}","transparent":true,"width":"140px"}, {}]
			}]
		}],
		panel2: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			tabLayers1: ["wm.TabLayers", {}, {}, {
			    layer1: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Tab 1","horizontalAlign":"left","padding":"10","verticalAlign":"top"}, {},{
                            }],
			    layer2: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Tab 2","horizontalAlign":"left","verticalAlign":"top"}, {},{
                                pageContainer1: ["wm.PageContainer", {width: "100%", height: "100%", deferLoad: true}]
                            }],
			    layer3: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Tab 3","horizontalAlign":"left","verticalAlign":"top"}, {}, {
                                pageContainer2: ["wm.PageContainer", {width: "100%", height: "100%", deferLoad: true}]
                            }]
			}]
		}],
		panel6: ["wm.HeaderContentPanel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			picture2: ["wm.Picture", {"border":"0","height":"100%","source":"lib/wm/base/widget/themes/default/images/wmSmallLogo.png","width":"24px"}, {}],
			label2: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"border":"0","caption":"Powered by WaveMaker","height":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			label1: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"align":"right","border":"0","caption":"Copyright [company name] 2010","height":"100%","width":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}]	
	}]}
}

wm.fullTemplates.topMenuTemplate = {
	displayName: bundlePackage.TopMenu,
        thumbnail: "/wavemaker/app/templates/widgetTemplateImages/topMenuTemplate.png",
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "100%",
	verticalAlign: "top",
	horizontalAlign: "center",
    autoScroll: true,
	_template: {
	varTemplateUsername: ["wm.ServiceVariable", {"autoUpdate":true,"designTime":true,"operation":"getUserName","service":"securityService","startUpdate":true}, {}, {
		input: ["wm.ServiceInput", {"type":"getUserNameInputs"}, {}]
	}],
	varTemplateLogout: ["wm.LogoutVariable", {}, {}, {
		input: ["wm.ServiceInput", {"type":"logoutInputs"}, {}]
	}],		
	panelCenter: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"900px"}, {}, {
		panelHeader: ["wm.HeaderContentPanel", {"height":"65px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,10,0,10","verticalAlign":"middle","width":"100%"}, {}, {
			picture1: ["wm.Picture", {"border":"0","height":"50px","source":"lib/wm/base/widget/themes/default/images/wmLogo.png","width":"62px"}, {}],
			label2: ["wm.Label", {"border":"0","caption":"[Application Name]","width":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel10: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"middle","width":"300px"}, {}, {
				panel15: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
					text1: ["wm.Text", {"displayValue":"Search","width":"100%"}, {}],
					picture5: ["wm.Picture", {"border":"0","height":"16px","source":"lib/images/silkIcons/zoom.png","width":"16px"}, {}]
				}]
			}]
		}],
		panel2: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			dojoMenu1: ["wm.DojoMenu", {"_classes":{"domNode":["ClickableDojoMenu"]},"eventList":[{"label":"Placerat","children":[{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"}]},{"label":"Tristique"},{"label":"Lacinia"},{"label":"Egestas"},{"label":"Viverra"},{"label":"Feugiat","children":[{"label":"Cut"},{"label":"Copy"},{"label":"Paste"}]},{"label":"Consequat"},{"label":"Facilisis"},{"label":"Convallis"},{"label":"Pulvinar"},{"label":"Bibendum"},{"label":"Bibendum"},{"label":"Curabitur"},{"label":"Phasellus"},{"label":"Habitasse"}],"height":"24px","menu":"Placerat > Tristique, Lacinia, Egestas, Viverra\nFeugiat > Consequat, Facilisis, Convallis\nBibendum > Pulvinar, Bibendum, Curabitur, Phasellus\nHabitasse","structure":"{\"items\":[{\"label\":\"Placerat\",\"children\":[{\"label\":\"Tristique\"},{\"label\":\"Lacinia\"},{\"label\":\"Egestas\"},{\"label\":\"Viverra\"}]},{\"label\":\"Feugiat\",\"children\":[{\"label\":\"Consequat\"},{\"label\":\"Facilisis\"},{\"label\":\"Convallis\"}]},{\"label\":\"Bibendum\",\"children\":[{\"label\":\"Pulvinar\"},{\"label\":\"Bibendum\"},{\"label\":\"Curabitur\"},{\"label\":\"Phasellus\"}]},{\"label\":\"Habitasse\"}]}","transparent":false}, {}]
		}],
		panelContent: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			fancyPanel1: ["wm.FancyPanel", {"horizontalAlign":"left","verticalAlign":"top","width":"70%"}, {}, {

			}],
			panel1: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"30%"}, {}, {
				fancyPanel3: ["wm.FancyPanel", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {

				}]
			}]
		}],
		panelFooter: ["wm.HeaderContentPanel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			picture2: ["wm.Picture", {"border":"0","height":"100%","source":"lib/wm/base/widget/themes/default/images/wmSmallLogo.png","width":"24px"}, {}],
			label1: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"border":"0","caption":"Powered by WaveMaker","height":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			edFooterLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"align":"right","border":"0","caption":"Copyright [company name] 2010","height":"100%","width":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}]	
	}]}
}
/*
wm.fullTemplates.fancyCenteredTemplate = {
    layoutKind: "top-to-bottom",
    thumbnail: "/wavemaker/app/templates/widgetTemplateImages/template1.png",
    displayName: "Fancy Centered", // currently only used in new project dialog
    width: "100%",
    height: "100%",
    verticalAlign: "top",
    horizontalAlign: "left",
    _classes: {domNode: ["fancyCenteredTemplate"]},
    _template: {
	templateMain: ["wm.Template", {"layoutKind":"left-to-right","width":"100%","height":"100%","verticalAlign":"top","horizontalAlign":"center"}, {}, {
	    content: ["wm.Panel", {"height":"100%","width":"960px","verticalAlign":"top","horizontalAlign":"left","freeze":true}, {}, {
		panelHeader: ["wm.Panel", {"height":"80px","width":"100%","verticalAlign":"top","horizontalAlign":"left","layoutKind":"left-to-right"}, {}, {
		    pictureHeader: ["wm.Panel", {horizontalAlign: "left", verticalAlign: "top", "_classes":{"domNode":["wm_Attribution_new"]},"height":"100%","width":"300px","margin":"0,0,0,20"}, {}],
		    labelHeader: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_24px"]},"height":"100%","width":"100%","caption":"Application Name","border":"0","padding":"20", "align":"right"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		    }]
		}],
                        
		panel0: ["wm.Panel", {"height":"100%","width":"100%","verticalAlign":"top","horizontalAlign":"left","layoutKind":"top-to-bottom"}, {}, {
		    panel1: ["wm.Panel", {"height":"24px","width":"100%","verticalAlign":"top","horizontalAlign":"left","layoutKind":"left-to-right","lock":true}, {}, {
			templateTopLeft: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-top-left"]},"height":"100%","width":"24px","verticalAlign":"top","horizontalAlign":"left"}, {}],
			templateTop: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-top-center"]},"height":"100%","width":"100%","verticalAlign":"top","horizontalAlign":"left"}, {}],
			templateTopRight: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-top-right"]},"height":"100%","width":"24px","verticalAlign":"top","horizontalAlign":"left"}, {}]
		    }],
		    panel2: ["wm.Panel", {isMajorContent: true, "height":"100%","width":"100%","verticalAlign":"top","horizontalAlign":"left","freeze":true,"layoutKind":"left-to-right"}, {}, {
			templateLeft: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-left"]},"height":"100%","width":"24px","verticalAlign":"top","horizontalAlign":"left","freeze":true}, {}],
			templateContent: ["wm.Panel", {isMajorContent: true, "height":"100%","width":"100%","verticalAlign":"top","horizontalAlign":"left"}, {}],
			templateRight: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-right"]},"height":"100%","width":"24px","verticalAlign":"top","horizontalAlign":"left","freeze":true}, {}]
		    }],
		    panel3: ["wm.Panel", {"height":"24px","width":"100%","verticalAlign":"top","horizontalAlign":"left","freeze":true,"layoutKind":"left-to-right"}, {}, {
			templateBottomLeft: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-bottom-left"]},"height":"100%","width":"24px","verticalAlign":"top","horizontalAlign":"left","freeze":true}, {}],
			templateBottom: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-bottom-center"]},"height":"100%","width":"100%","verticalAlign":"top","horizontalAlign":"left","freeze":true}, {}],
			templateBottomRight: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-bottom-right"]},"height":"100%","width":"24px","verticalAlign":"top","horizontalAlign":"left","freeze":true}, {}]
		    }],
		    panelFooter: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"align":"right","height":"48px","width":"100%","caption":"Copyright 2010 Wavemaker Software<br>1000 Sansome Street, Suite 250 San Francisco, CA 94111","border":"0","padding":"10,20","margin":"0","singleLine":false}, {}, {}]
		}]
	    }]
        }]
    }
}

wm.fullTemplates.CenteredPageContainerWithHeaderFooter = {
	 height:"100%",
	 width:"100%",
	 horizontalAlign:"left",
	 _template: {
		CenteredLayout: ["wm.Template", {"width":"100%","height":"100%","verticalAlign":"top","horizontalAlign":"center"}, {}, {
		    contentPanel: ["wm.Panel", {"width":"800px","height":"100%","border":"0,1"}, {}, {
			TitleBar: ["wm.Template", {"_classes":{"domNode":["titlebar"]},"width":"100%","height":"96px","verticalAlign":"top","horizontalAlign":"left","layoutKind":"left-to-right","padding":"8", border: "0,0,4,0"}, {}, {
					appNameLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_24px"]},"caption":"Application Name","width":"100%","height":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
			    panel3: ["wm.Panel", {isMajorContent: true, "width":"284px","height":"100%","border":"1"}, {}]
				}],
			pageContainer1: ["wm.PageContainer", {_classes: {domNode: ["wmcontentarea"]}, "height":"100%"}, {}],
				Footer: ["wm.Template", {"_classes":{"domNode":["toolbar"]},"width":"100%","height":"36px","verticalAlign":"middle","horizontalAlign":"center","padding":"2"}, {}, {
				    footerLabel: ["wm.Label", {align: "center", "caption":"Copyright 2010 ACME, Inc.","width":"100%","height":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}]
			}]
		}]
	}
}
*/
wm.widgetTemplates.tabbedTwoColumn = {
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "100%",
	_template: {
		tabLayers1: ["wm.TabLayers", {height: "100%", width: "100%"}, {}, {
			layer1: ["wm.Layer", {caption: "Tab1", layoutKind: "left-to-right"}, {}, {
			    leftSideBarTOC: ["wm.Panel", {_classes: {domNode: ["TOC"]}, layoutKind: "top-to-bottom", width: "198px", height: "100%"}, {}],
				splitter1: ["wm.Splitter", {layout: "left"}, {}],
				panel2: ["wm.Panel", {box: "v", width: "1flex"}, {}, {
				    toolbarPanel: ["wm.Panel", {_classes: {domNode: ["toolbar"]}, border: "0,0,2,0", layoutKind: "left-to-right", height: "36px", width: "100%"}, {}, {
						button1: ["wm.Button", {width: "80px", height: "100%"}, {}],
						button2: ["wm.Button", {width: "80px", height: "100%"}, {}]
					}],
				    mainContent: ["wm.Panel", {isMajorContent: true, layoutKind: "left-to-right", width: "100%", height: "100%"}, {}]
				}]
			}],
			layer2: ["wm.Layer", {caption: "Tab2"}, {}],
			layer3: ["wm.Layer", {caption: "Tab3"}, {}]
		}]
	}
}

wm.widgetTemplates.toolbarWithGroupBox = {
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "100%",
	_template: {
		panel1: ["wm.Panel", {_classes: {domNode: ["wm_SilverBlueTheme_ToolBar"]}, width: "100%", height: "36px", border: "0", layoutKind: "left-to-right"}, {}, {
			button1: ["wm.Button", {width: "50px", height: "100%", border: "1"}, {}],
			button2: ["wm.Button", {width: "50px", height: "100%", border: "1"}, {}]
		}],
		panel2: ["wm.Panel", {_classes: {domNode: ["wm_SilverBlueTheme_LightBlueInsetPanel"]}, width: "100%", height: "100%", border: "0", layoutKind: "left-to-right", horizontalAlign: "center"}, {}, {
			panel3: ["wm.Panel", {width: "542px", height: "100%", border: "0"}, {}, {
				panel4: ["wm.Panel", {height: "45px", border: "0"}, {}, {
					panel6: ["wm.Panel", {width: "100%", height: "20px", border: "0", layoutKind: "left-to-right"}, {}],
					label1: ["wm.Label", {caption: "Group Box", height: "100%", border: "", width: "100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panel5: ["wm.Panel", {_classes: {domNode: ["wm_SilverBlueTheme_MainOutsetPanel"]}, width: "100%", height: "262px", border: "0", layoutKind: "left-to-right", horizontalAlign: "center"}, {}, {
					panel7: ["wm.Panel", {width: "430px", height: "100%", border: "0", verticalAlign: "middle"}, {}, {
						editor1: ["wm.Editor", {caption: "Foo:", height: "26px", border: "0", width: "100%"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						editor2: ["wm.Editor", {caption: "Bar:", height: "26px", border: "0", width: "100%"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						editor3: ["wm.Editor", {caption: "Foo:", height: "26px", border: "0", width: "100%"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						editor4: ["wm.Editor", {caption: "Bar:", height: "26px", border: "0", width: "100%"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						editor5: ["wm.Editor", {caption: "Foo:", height: "26px", border: "0", width: "100%"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						panel8: ["wm.Panel", {width: "100%", height: "36px", border: "0", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
							button3: ["wm.Button", {width: "50px", height: "100%", border: "1"}, {}],
							button4: ["wm.Button", {width: "50px", height: "100%", border: "1"}, {}]
						}]
					}]
				}]
			}]
		}]
	}
}
/*
wm.fullTemplates.complexLayout = {
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "100%",
	_template: {
		toolbar: ["wm.Panel", {_classes: {domNode: ["toolbar"]}, width: "100%", height: "36px", layoutKind: "left-to-right"}, {}, {
			button1: ["wm.Button", {width: "80px", height: "100%"}, {}],
			button2: ["wm.Button", {width: "80px", height: "100%"}, {}]
		}],
		panel2: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right"}, {}, {
			accordionLayers1: ["wm.AccordionLayers", {width: "214px"}, {}, {
				layer1: ["wm.Layer", {caption: "layer1"}, {}],
				layer2: ["wm.Layer", {caption: "layer2"}, {}],
				layer3: ["wm.Layer", {caption: "layer3"}, {}]
			}],
			splitter1: ["wm.Splitter", {height: "100%", width: "6px", layout: "left"}, {}],
			panel4: ["wm.Panel", {width: "100%", height: "100%"}, {}, {
				dataGrid1: ["wm.DataGrid", {height: "250px"}, {}, {
					column: ["wm.DataGridColumn", {autoSize: true}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				splitter2: ["wm.Splitter", {width: "100%"}, {}],
				contentPanelFrame: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right", padding: "48", horizontalAlign: "center", verticalAlign: "middle"}, {}, {
				    contentPanel: ["wm.Panel", {isMajorContent: true, width: "100%", height: "312px", border: "1", layoutKind: "left-to-right"}, {}]
				}]
			}]
		}]
	}
}
*/
wm.widgetTemplates.searchListDetail = {
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "100%",
	_template: {
		searchBarPanel: ["wm.Panel", {_classes: {domNode: ["toolbar"]}, width: "100%", height: "36px", layoutKind: "left-to-right"}, {}, {
			searchBox: ["wm.Editor", {width: "219px", margin: "4", padding: "0"}, {}, {
				editor: ["wm._TextEditor", {}, {}]
			}],
			searchBtn: ["wm.Button", {width: "55px", height: "100%", caption: "Search"}, {}]
		}],
		dataGrid1: ["wm.DataGrid", {height: "226px"}, {}, {
			column: ["wm.DataGridColumn", {autoSize: true}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}],
		splitter1: ["wm.Splitter", {layout: "top"}, {}],
		liveFormOuterPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right", padding: "48"}, {}, {
		    liveFormInnerPanel: ["wm.Panel", {isMajorContent: true, width: "100%", height: "100%", border: "1", padding: "32"}, {}, {
				liveForm1: ["wm.LiveForm", {height: "100%", fitToContent: false, horizontalAlign: "left", verticalAlign: "top"}, {}]
			}]
		}]
	}
}

wm.widgetTemplates.titleBar = {
	layoutKind: "left-to-right",
	width: "100%",
	height: "96px",
	padding: "8",
        border: "0,0,4,0",
	_classes: {domNode: ["titlebar"]},
	_template: {
		appNameLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_24px"]}, caption: "Application Name", height: "100%", width: "100%"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
	    panel3: ["wm.Panel", {isMajorContent: true, height: "100%", width: "222px", border: "1"}, {}]
	}
}
/*
wm.fullTemplates.centeredFixedLayout = {
	width: "100%",
	height: "100%",
	verticalAlign: "top",
	horizontalAlign: "center",
	layoutKind: "top-to-bottom",
	_template: {
	    contentPanel: ["wm.Panel", {isMajorContent: true, width: "600px", height: "100%", border: "0,1"}, {}]
	}
}
*/
wm.widgetTemplates.toolbar = {
	layoutKind: "left-to-right",
	width: "100%",
	height: "36px",
	_classes: {domNode: ["toolbar"]},
	_template: {
		button1: ["wm.Button", {width: "80px", height: "100%"}, {}],
		button2: ["wm.Button", {width: "80px", height: "100%"}, {}]
	}
}


wm.widgetTemplates.footer = {
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "36px",
	padding: "2",
	verticalAlign: "middle",
	horizontalAlign: "center",
	_classes: {domNode: ["toolbar"]},
	_template: {
	    footerLabel: ["wm.Label", {align: "center", caption: "Copyright 2010 ACME, Inc.", width: "100%", height: "100%"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}]
	}
}

wm.widgetTemplates.basic = {
	layoutKind: "top-to-bottom",
	height: "100%",
	width: "100%",
	_template: {
		headerLabel: ["wm.Label", {height: "40px", width: "100%", border: "0", padding: "10", caption: "Header", backgroundColor: "#C6D3E7"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
		mainPanel: ["wm.Panel", {height: "100%", width: "100%", layoutKind: "left-to-right", horizontalAlign: "left", verticalAlign: "top"}, {}, {
			tabs: ["wm.TabLayers", {height: "100%", width: "100%", border: "0", verticalAlign: "top", horizontalAlign: "left"}, {}, {
				layer1: ["wm.Layer", {caption: "layer1"}, {}],
				layer2: ["wm.Layer", {caption: "layer2"}, {}]
			}]
		}],
		footerLabel: ["wm.Label", {height: "30px", width: "100%", border: "0", padding: "10", caption: "Footer", backgroundColor: "#C6D3E7"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}]
	}
}



wm.widgetSpecificTemplate.ListViewerRow = {
    layoutKind: "top-to-bottom",
    height: "100%",
    width: "100%",
    horizontalAlign: "left",
    verticalAlign: "top",
    _template: {
	variable: ["wm.Variable", {}],
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {
	    sampleRow: ["wm.FancyPanel", {title: "Sample Row", layoutKind: "left-to-right", width: "100%", height: "80px"},{}, {
		panel1: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left"},{}, {
		    label1: ["wm.Label", {width: "200px", height: "100%", caption: "Bind me to a field in 'variable'", singleLine: false}],
		    label2: ["wm.Label", {width: "100%", height: "100%", caption: "Bind me to another field in 'variable'. Or just delete me and create your own row!", singleLine: false}]
		}]
	    }]
	}]}
};