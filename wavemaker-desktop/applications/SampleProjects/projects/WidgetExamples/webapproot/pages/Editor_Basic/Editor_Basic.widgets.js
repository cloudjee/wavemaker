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
Editor_Basic.widgets = {
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		panel9: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel20: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label4: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"autoSizeWidth":true,"border":"0","caption":"Basic Editor Widgets","padding":"4","width":"173px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel1: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel7: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
					label12: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label16: ["wm.Label", {"border":"0","caption":"<b>Directions:</b> enter data into editors. Note that editors have built-in validation.","height":"34px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel3: ["wm.Panel", {"height":"159px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
						panel14: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
							checkbox1: ["wm.Checkbox", {"caption":"Checkbox","displayValue":""}, {}],
							currency1: ["wm.Currency", {"caption":"Currency","displayValue":"0"}, {}],
							date1: ["wm.Date", {"caption":"Date","displayValue":"","placeHolder":"Enter a date"}, {}],
							number1: ["wm.Number", {"caption":"Number","displayValue":"","maximum":100,"minimum":1,"placeHolder":"Enter a number from 1 - 100","rangeMessage":"Enter a number from 1 - 100","spinnerButtons":true}, {}],
							colorPicker1: ["wm.ColorPicker", {"caption":"Color","displayValue":""}, {}],
							slider1: ["wm.Slider", {"caption":"Slider","displayValue":0,"height":"30px","margin":"4"}, {}]
						}]
					}],
					label37: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel8: ["wm.Panel", {"height":"148px","horizontalAlign":"left","padding":"0,0,0,100","verticalAlign":"top","width":"100%"}, {}, {
						panel17: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label1: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Checkbox is","padding":"4","width":"79px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label27: ["wm.Label", {"border":"0","padding":"4","width":"71px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":false,"source":"checkbox1.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panel18: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label3: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Currency is","padding":"4","width":"75px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label6: ["wm.Label", {"border":"0","padding":"4","width":"71px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":false,"source":"currency1.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panel26: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label2: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Date is","padding":"4","width":"49px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label7: ["wm.Label", {"border":"0","display":"Date","padding":"4","width":"111px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":false,"source":"date1.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.DateFormatter", {}, {}]
							}]
						}],
						panel38: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label17: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Number is","padding":"4","width":"68px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label18: ["wm.Label", {"border":"0","display":"Number","padding":"4","width":"71px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":false,"source":"number1.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.NumberFormatter", {}, {}]
							}]
						}],
						panel27: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label5: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Color is","padding":"4","width":"53px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label8: ["wm.Label", {"border":"0","padding":"4","width":"111px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"colorPicker1.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panel28: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label9: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Slider is","padding":"4","width":"56px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label10: ["wm.Label", {"border":"0","display":"Number","padding":"4","width":"111px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"slider1.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.NumberFormatter", {}, {}]
							}]
						}]
					}]
				}],
				panel67: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
					fancyPanel6: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel68: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html2: ["wm.Html", {"border":"0","height":"100%","html":"Editors take input from the user:<br>\n<ul>\n<li>Text editors accept any input</li>\n<li>Specialized editors accept validate input</li>\n<li>Radio buttons allow user to select from multiple values</li>\n</ul>\n<p>This example shows using the editor widgets to get validated input from the user and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/Text\" target=\"_blank\">Text Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\" target=\"_blank\">Select Menu/Combo Boxes</a></li>\n</ul>","margin":"5","width":"100%"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}