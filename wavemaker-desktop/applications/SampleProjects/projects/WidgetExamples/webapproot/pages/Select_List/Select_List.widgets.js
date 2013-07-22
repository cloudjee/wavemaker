/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
Select_List.widgets = {
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel12: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel20: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label13: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"caption":"Simple Select Widget","padding":"4","width":"220px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel13: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel15: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
					tabLayers1: ["wm.TabLayers", {"desktopHeaderHeight":"29px"}, {}, {
						layer1: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Select","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
							label12: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It! (Select Editor)","height":"32px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label16: ["wm.Label", {"caption":"<b>Directions:</b> select from a list of options \"red\", \"green\", \"blue\"","height":"34px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							panel16: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"596px"}, {}, {
								panel17: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
								staticSelectMenu: ["wm.SelectMenu", {"caption":"Select from list","captionSize":"120px","dataField":"dataValue","dataValue":undefined,"displayField":"dataValue","displayValue":"","options":"Red, Green, Blue"}, {}]
							}],
							label15: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							panel18: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
								label14: ["wm.Label", {"caption":"You selected","padding":"4","width":"151px"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								selectLabel: ["wm.Label", {"padding":"4"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":false,"source":"staticSelectMenu.dataValue","targetProperty":"caption"}, {}]
									}],
									format: ["wm.DataFormatter", {}, {}]
								}]
							}]
						}],
						layer2: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"RadioSet","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
							label17: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It! (RadioSet Editor)","height":"32px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label18: ["wm.Label", {"caption":"<b>Directions:</b> select from a list of options \"red\", \"green\", \"blue\"","height":"34px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							panel19: ["wm.Panel", {"height":"102px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"596px"}, {}, {
								panel21: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
								staticRadio1: ["wm.RadioSet", {"caption":"Select from list","captionSize":"120px","dataField":"dataValue","dataValue":undefined,"displayField":"dataValue","displayValue":"","options":"Red, Green, Blue"}, {}]
							}],
							label19: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							panel22: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
								label20: ["wm.Label", {"caption":"You selected","padding":"4","width":"151px"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								selectLabel1: ["wm.Label", {"padding":"4"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"staticRadio1.dataValue","targetProperty":"caption"}, {}]
									}],
									format: ["wm.DataFormatter", {}, {}]
								}]
							}]
						}],
						layer3: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"CheckboxSet","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
							label21: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It! (CheckboxSet Editor)","height":"32px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label22: ["wm.Label", {"caption":"<b>Directions:</b> select from a list of options \"red\", \"green\", \"blue\"","height":"34px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							panel23: ["wm.Panel", {"height":"98px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"596px"}, {}, {
								panel24: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
								staticCheckbox1: ["wm.CheckboxSet", {"caption":"Select from list","captionSize":"120px","dataField":"dataValue","displayField":"dataValue","displayValue":"","options":"Red, Green, Blue"}, {}]
							}],
							label23: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							panel25: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
								label24: ["wm.Label", {"caption":"You selected","padding":"4","width":"151px"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								selectLabel2: ["wm.Label", {"padding":"4"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"staticCheckbox1.dataValue","targetProperty":"caption"}, {}]
									}],
									format: ["wm.DataFormatter", {}, {}]
								}]
							}]
						}],
						layer4: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"ListSet","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
							label25: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It! (ListSet Editor)","height":"32px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label26: ["wm.Label", {"caption":"<b>Directions:</b> select from a list of options \"red\", \"green\", \"blue\"","height":"34px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							panel26: ["wm.Panel", {"height":"78px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"596px"}, {}, {
								panel27: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
								staticList1: ["wm.ListSet", {"caption":"Select from list","captionSize":"120px","dataField":"dataValue","displayField":"dataValue","displayValue":"","height":"100%","options":"Red, Green, Blue","showSearchBar":false}, {}]
							}],
							label27: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							panel28: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
								label28: ["wm.Label", {"caption":"You selected","padding":"4","width":"151px"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								selectLabel3: ["wm.Label", {"padding":"4"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"staticList1.dataValue","targetProperty":"caption"}, {}]
									}],
									format: ["wm.DataFormatter", {}, {}]
								}]
							}]
						}]
					}]
				}],
				panel73: ["wm.MainContentPanel", {"height":"734px","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
					fancyPanel7: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel74: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html6: ["wm.Html", {"height":"100%","html":"<p>DataSet Editors provide a list of choices for the user to select. </p>\n<p>This example shows using the options property of a DataSet editors to display choices and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/SelectMenu\" target=\"_blank\">Select Menu Widget</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/RadioSet\" target=\"_blank\">RadioSet Widget</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/CheckboxSet\" target=\"_blank\">CheckboxSet Widget</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/ListSet\" target=\"_blank\">ListSet Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=editor&amp;layer=radio\">Radio Button</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}