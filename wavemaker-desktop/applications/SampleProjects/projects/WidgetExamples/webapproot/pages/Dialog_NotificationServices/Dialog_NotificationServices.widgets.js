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
Dialog_NotificationServices.widgets = {
	buttonPushVar: ["wm.Variable", {"type":"NumberData"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":"0","source":false,"targetProperty":"dataValue"}, {}]
		}]
	}],
	optionsVar: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"Button\",\"dataValue\":\"Button_Button\"},{\"name\":\"Editor\",\"dataValue\":\"Editor_Number\"},{\"name\":\"Grid\",\"dataValue\":\"Grid_Basic\"},{\"name\":\"DataSet Editor\",\"dataValue\":\"Select_Filter\"}]","type":"EntryData"}, {}],
	alertNot: ["wm.NotificationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"alertInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"text1.dataValue","targetProperty":"text"}, {}]
			}]
		}]
	}],
	confirmNot: ["wm.NotificationCall", {"operation":"confirm"}, {"onCancel":"confirmNotCancel","onOk":"confirmNotOk"}, {
		input: ["wm.ServiceInput", {"type":"confirmInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"text2.dataValue","targetProperty":"text"}, {}]
			}]
		}]
	}],
	promptNot: ["wm.NotificationCall", {"operation":"prompt"}, {"onCancel":"promptNotCancel","onOk":"promptNotOk"}, {
		input: ["wm.ServiceInput", {"type":"promptInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"text3.dataValue","targetProperty":"text"}, {}],
				wire1: ["wm.Wire", {"expression":"\"Blue\"","targetProperty":"defaultValue"}, {}]
			}]
		}]
	}],
	toastNot: ["wm.NotificationCall", {"operation":"toast"}, {}, {
		input: ["wm.ServiceInput", {"type":"toastInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"text4.dataValue","targetProperty":"text"}, {}],
				wire1: ["wm.Wire", {"expression":"\"Error\"","targetProperty":"cssClasses"}, {}]
			}]
		}]
	}],
	warnOnceNot: ["wm.NotificationCall", {"operation":"warnOnce"}, {}, {
		input: ["wm.ServiceInput", {"type":"warnOnceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"text5.dataValue","targetProperty":"text"}, {}],
				wire1: ["wm.Wire", {"expression":"\"demo\"","targetProperty":"cookieName"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel9: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel20: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label4: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"autoSizeWidth":true,"caption":"PageDialog Widget","padding":"4","width":"114px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel1: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel7: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					panel14: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"verticalAlign":"top","width":"100%"}, {}, {
						label14: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						label16: ["wm.Label", {"caption":"<b>Directions:</b> A Notification Service is a simple component for setting up code-free a variety of types of notification-type actions.  Select each button below to view the different types of Notifications Events.","height":"42px","padding":"4","singleLine":false,"width":"100%"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						panel3: ["wm.Panel", {"height":"56px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
							text1: ["wm.Text", {"caption":"Text to show in alert","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":"This is an alert dialog","desktopHeight":"56px","displayValue":"This is an alert dialog","height":"56px","width":"250px"}, {}],
							alertButton: ["wm.Button", {"caption":"Alert Service","margin":"4","width":"120px"}, {"onclick":"alertNot"}]
						}],
						panel4: ["wm.Panel", {"height":"56px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
							text2: ["wm.Text", {"caption":"Text to show in confirm","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":"Would you like to hit the OK button?","desktopHeight":"56px","displayValue":"Would you like to hit the OK button?","height":"56px","width":"250px"}, {}],
							confirmButton: ["wm.Button", {"caption":"Confirm Service","margin":"4","width":"120px"}, {"onclick":"confirmNot"}],
							confirmResponseLabel: ["wm.Label", {"caption":"","padding":"4","singleLine":false,"width":"100%"}, {}]
						}],
						panel5: ["wm.Panel", {"height":"56px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
							text3: ["wm.Text", {"caption":"Text to show in confirm","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":"What is your favorite color?","desktopHeight":"56px","displayValue":"What is your favorite color?","height":"56px","width":"250px"}, {}],
							promptButton: ["wm.Button", {"caption":"Prompt Service","margin":"4","width":"120px"}, {"onclick":"promptNot"}],
							promptResponseLabel: ["wm.Label", {"caption":"","padding":"4","singleLine":false,"width":"100%"}, {}]
						}],
						panel6: ["wm.Panel", {"height":"56px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
							text4: ["wm.Text", {"caption":"Text to show in Toast popup","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":"Your hair is on fire","desktopHeight":"56px","displayValue":"Your hair is on fire","height":"56px","width":"250px"}, {}],
							promptButton1: ["wm.Button", {"caption":"Toast Service","margin":"4","width":"120px"}, {"onclick":"toastNot"}]
						}],
						panel8: ["wm.Panel", {"height":"56px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
							text5: ["wm.Text", {"caption":"Text to show in alert","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":"This is an alert dialog","desktopHeight":"56px","displayValue":"This is an alert dialog","height":"56px","width":"250px"}, {}],
							alertButton1: ["wm.Button", {"caption":"Warn Once Service","margin":"4","width":"132px"}, {"onclick":"warnOnceNot"}]
						}]
					}],
					panel17: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
						fancyPanel2: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
							panel2: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								html2: ["wm.Html", {"height":"100%","html":"<p>The PageDialog allows developers to design a dialog as a single page and display it in dialogs from any other page its needed.  This results in a much more modular and reusable dialog.</p>\n<p>You can set the pageName for a PageDialog to a fixed page, or you can change it at runtime using\n</p><ul>\n<li>NavigationCall components</li>\n<li>Binding the pageName property to a value that may change at runtime</li>\n<li>Programatically calling this.mypageDialog.setPageName(\"MyPage\")</li>\n</ul>\n<p></p> \n<h4>Documentation</h4>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/PageDialog\" target=\"_blank\">PgaeDialog</a></li>\n</ul>\n","margin":"5","minDesktopHeight":15}, {}]
							}]
						}]
					}]
				}]
			}]
		}]
	}]
}