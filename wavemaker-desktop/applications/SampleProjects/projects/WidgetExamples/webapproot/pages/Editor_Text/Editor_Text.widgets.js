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
Editor_Text.widgets = {
	notificationCall1: ["wm.NotificationCall", {"operation":"toast"}, {}, {
		input: ["wm.ServiceInput", {"type":"toastInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire1: ["wm.Wire", {"expression":"\"center center\"","targetProperty":"dialogPosition"}, {}],
				wire: ["wm.Wire", {"expression":"\"Value changed to <b>\" + ${text12.dataValue} + \"</b><br/><br/>This popup shown by the editor's onChange event.\"","targetProperty":"text"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel24: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel34: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label24: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"autoSizeWidth":true,"caption":"Text Editor Widgets","padding":"4","width":"148px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel37: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel41: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"500px"}, {}, {
					label53: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label25: ["wm.Label", {"caption":"<b>Directions:</b> Explore some of the capabilities of the Text editor","height":"34px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					formPanel1: ["wm.FormPanel", {"captionSize":"160px","editorWidth":"351px","height":"100%","type":"wm.FormPanel"}, {}, {
						text1Panel: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							text1: ["wm.Text", {"caption":"Text w reset","captionSize":"160px","changeOnKey":true,"dataValue":undefined,"displayValue":"","placeHolder":"Enter username here","promptMessage":undefined,"resetButton":true,"width":"351px"}, {}],
							labelEquals: ["wm.Label", {"align":"center","caption":"=","padding":"4","width":"40px"}, {}],
							label1: ["wm.Label", {"padding":"4","width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"text1.dataValue","targetProperty":"caption"}, {}]
								}]
							}]
						}],
						text3Panel: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							text3: ["wm.Text", {"caption":"Password","captionSize":"160px","changeOnKey":true,"dataValue":undefined,"displayValue":"","password":true,"placeHolder":"Enter password here","width":"351px"}, {}],
							labelEquals1: ["wm.Label", {"align":"center","caption":"=","padding":"4","width":"40px"}, {}],
							label2: ["wm.Label", {"padding":"4","width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"text3.dataValue","targetProperty":"caption"}, {}]
								}]
							}]
						}],
						text2Panel: ["wm.Panel", {"height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							text2: ["wm.Text", {"caption":"Mouse over the \"?\"","captionSize":"160px","dataValue":undefined,"desktopHeight":"26px","displayValue":"","height":"26px","helpText":"The help text property automatically adds the \"?\" button and displays your text to users","width":"351px"}, {}],
							labelEquals2: ["wm.Label", {"align":"center","caption":"","padding":"4","width":"40px"}, {}],
							label3: ["wm.Label", {"caption":"","height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}]
						}],
						text4Panel: ["wm.Panel", {"height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							text4: ["wm.Text", {"caption":"Make text readonly","captionSize":"160px","dataValue":"Hello world","desktopHeight":"26px","displayValue":"Hello world","height":"26px","mobileHeight":"26%","readonly":true,"width":"351px"}, {}],
							toggleButtonPanel1: ["wm.ToggleButtonPanel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top"}, {"onChange":"toggleButtonPanel1Change"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"togglePanelButton1","targetProperty":"currentButton"}, {}]
								}],
								togglePanelButton1: ["wm.Button", {"caption":"Readonly","margin":"0","width":"100%"}, {}],
								button1: ["wm.Button", {"border":"0,1,0,0","caption":"Editable","margin":"0","width":"100%"}, {}]
							}]
						}],
						text8: ["wm.Panel", {"height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							text9: ["wm.Text", {"caption":"Disable Editor","captionSize":"160px","dataValue":"Hello world","desktopHeight":"26px","disabled":true,"displayValue":"Hello world","height":"26px","mobileHeight":"26%","width":"351px"}, {}],
							toggleButtonPanel2: ["wm.ToggleButtonPanel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top"}, {"onChange":"toggleButtonPanel2Change"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"togglePanelButton2","targetProperty":"currentButton"}, {}]
								}],
								togglePanelButton2: ["wm.Button", {"caption":"Disabled","margin":"0","width":"100%"}, {}],
								button2: ["wm.Button", {"border":"0,1,0,0","caption":"Enabled","margin":"0","width":"100%"}, {}]
							}]
						}],
						text5Panel: ["wm.Panel", {"height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							text5: ["wm.Text", {"caption":"MaxChars = 2","captionSize":"160px","changeOnKey":true,"dataValue":undefined,"desktopHeight":"26px","displayValue":"","height":"26px","maxChars":"2","placeHolder":"Enter 2 letter state","width":"351px"}, {}],
							labelEquals3: ["wm.Label", {"align":"center","caption":"=","padding":"4","width":"40px"}, {}],
							label4: ["wm.Label", {"padding":"4","width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"text5.dataValue","targetProperty":"caption"}, {}]
								}]
							}]
						}],
						text6Panel: ["wm.Panel", {"height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							text6: ["wm.Text", {"caption":"Click button to set value","captionSize":"160px","changeOnKey":true,"dataValue":undefined,"desktopHeight":"26px","displayValue":"","height":"26px","width":"351px"}, {}],
							labelEquals4: ["wm.Label", {"align":"center","caption":"","padding":"4","width":"40px"}, {}],
							setValueButton: ["wm.Button", {"caption":"+1","height":"100%","margin":"4"}, {"onclick":"setValueButtonClick"}]
						}],
						text7Panel: ["wm.Panel", {"height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							text7: ["wm.Text", {"caption":"RegExp Validation","captionSize":"160px","changeOnKey":true,"dataValue":undefined,"desktopHeight":"26px","displayValue":"","height":"26px","invalidMessage":"Enter text starting with \"abc\"","placeHolder":"abc.*","regExp":"abc.*","tooltipDisplayTime":5000,"width":"351px"}, {}],
							labelEquals5: ["wm.Label", {"align":"center","caption":"","padding":"4","width":"40px"}, {}],
							label5: ["wm.Label", {"padding":"4","width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"text7.dataValue","targetProperty":"caption"}, {}]
								}]
							}]
						}],
						text10Panel: ["wm.Panel", {"height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							text10: ["wm.Text", {"caption":"Binding the data value","captionSize":"160px","changeOnKey":true,"dataValue":undefined,"desktopHeight":"26px","displayValue":"","height":"26px","width":"351px"}, {}],
							labelEquals7: ["wm.Label", {"align":"center","caption":"=","padding":"4","width":"40px"}, {}],
							text11: ["wm.Text", {"caption":undefined,"captionSize":"160px","changeOnKey":true,"desktopHeight":"26px","displayValue":"","height":"26px","width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"text10.dataValue","targetProperty":"dataValue"}, {}]
								}]
							}]
						}],
						text12: ["wm.Text", {"caption":"Firing onChange events","captionSize":"160px","changeOnKey":true,"dataValue":undefined,"desktopHeight":"26px","displayValue":"","height":"26px","width":"351px"}, {"onchange":"notificationCall1"}],
						largeTextArea1Panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							largeTextArea1: ["wm.LargeTextArea", {"caption":"Large Text Area","captionAlign":"right","captionPosition":"left","captionSize":"160px","changeOnKey":true,"dataValue":undefined,"displayValue":"","height":"100%","width":"351px"}, {}],
							labelEquals6: ["wm.Label", {"align":"center","caption":"=","padding":"4","width":"40px"}, {}],
							label6: ["wm.Label", {"height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":"String(${largeTextArea1.displayValue}).replace(/\\n/g,\"<br/>\")","targetProperty":"caption"}, {}]
								}]
							}]
						}]
					}]
				}],
				panel73: ["wm.MainContentPanel", {"height":"734px","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"260px"}, {}, {
					fancyPanel9: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel74: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html5: ["wm.Html", {"height":"460px","html":"<p>Text editors are the most basic type of editor, and provide a variety of properties and behaviors shown here.</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/Text\" target=\"_blank\">Text Widget</a></li>\n</ul>\n","margin":"5","minDesktopHeight":15}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}