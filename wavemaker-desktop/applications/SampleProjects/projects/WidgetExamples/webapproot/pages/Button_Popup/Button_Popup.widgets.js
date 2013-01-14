/*
 *  Copyright (C) 2013 VMware, Inc. All rights reserved.
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
Button_Popup.widgets = {
	popupButtonDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget","corner":"cr","desktopHeight":"120px","height":"120px","modal":false,"positionNear":"popupMenuButton1","title":"Popup Button Dialog","width":"300px"}, {"onShow":"popupButtonDialogShow"}, {
		containerWidget: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"height":"100%","horizontalAlign":"left","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			label19: ["wm.Label", {"caption":"You clicked the Popup Button ","padding":"4"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel19: ["wm.Panel", {"height":"29px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				label21: ["wm.Label", {"caption":"Selected item = ","padding":"4","width":"116px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				popupLabel: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"1","padding":"4","width":"64px"}, {}, {
					format: ["wm.DataFormatter", {}, {}],
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"popupMenuButton1.caption","targetProperty":"caption"}, {}]
					}]
				}]
			}]
		}],
		buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			button4: ["wm.Button", {"caption":"OK","margin":"4"}, {"onclick":"popupButtonDialog.hide"}]
		}]
	}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel3: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel23: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label24: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"caption":"Popup Button","padding":"4","width":"120px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel33: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				panel35: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"padding":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
					label29: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label34: ["wm.Label", {"caption":"<b>Directions:</b> click on arrow to select operation. Click on button to invoke operation.","height":"42px","padding":"4","singleLine":false,"width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel36: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
						popupMenuButton1: ["wm.PopupMenuButton", {"caption":"Save","fullStructure":[{"label":"Save","separator":undefined,"defaultLabel":"Save","iconClass":"app_silkIconList_41","imageList":"app.silkIconList","idInPage":undefined,"isCheckbox":false,"onClick":undefined,"children":[]},{"label":"Print","separator":undefined,"defaultLabel":"Print","iconClass":"app_silkIconList_77","imageList":"app.silkIconList","idInPage":undefined,"isCheckbox":false,"onClick":undefined,"children":[]},{"label":undefined,"separator":true,"defaultLabel":"Separator","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":undefined,"onClick":undefined,"children":[]},{"label":"Delete","separator":undefined,"defaultLabel":"Delete","iconClass":"app_silkIconList_21","imageList":"app.silkIconList","idInPage":undefined,"isCheckbox":false,"onClick":undefined,"children":[]}],"iconClass":"app_silkIconList_41","margin":"4"}, {"onclick":"popupButtonDialog.show"}]
					}],
					label31: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel13: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
						label12: ["wm.Label", {"autoSizeWidth":true,"caption":"Iem selected is","padding":"4","width":"89px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						label13: ["wm.Label", {"border":"1","padding":"4","width":"59px"}, {}, {
							format: ["wm.DataFormatter", {}, {}],
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":false,"source":"popupMenuButton1.caption","targetProperty":"caption"}, {}]
							}]
						}]
					}]
				}],
				panel31: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
					fancyPanel5: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel18: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html5: ["wm.Html", {"height":"100%","html":"<p>The popup menu button allows a user to select a particular action from a drop-down menu, then perform that action when the button is clicked.</p>\n<p>This example shows <ul>\n<li><b>Binding</b>: The label below the button uses binding to always show the current caption.</li>\n<li><b>Event Handler</b>: Using the onClick event of a popup menu button to display a dialog window and was built using drag and drop, binding  and no code!</li>\n</ul></p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/PopupMenuButton\">Popup Menu Button Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=button\">Button</a></li>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=toggle\">Toggle Button</a></li>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=busy\">Busy Button</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}