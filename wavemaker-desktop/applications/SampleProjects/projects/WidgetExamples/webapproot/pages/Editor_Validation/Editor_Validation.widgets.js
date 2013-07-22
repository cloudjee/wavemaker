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
Editor_Validation.widgets = {
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		panel40: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel50: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label41: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"autoSizeWidth":true,"border":"0","caption":"Editor Validation","padding":"4","width":"143px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel51: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel53: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
					label57: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label42: ["wm.Label", {"border":"0","caption":"<b>Directions:</b> enter data into editors. Note that editors have built-in validation.","height":"34px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel54: ["wm.Panel", {"height":"137px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						panel55: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
						panel56: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
							currency2: ["wm.Currency", {"caption":"currency (0-100)","captionSize":"125px","displayValue":"0","maximum":100,"minimum":0,"promptMessage":"Enter a number between 0 and 100","rangeMessage":"Enter number between 10 and 100","width":"350px"}, {}],
							text2: ["wm.Text", {"caption":"email address","captionSize":"125px","displayValue":"","invalidMessage":"Must enter valid email address","regExp":"^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$","width":"350px"}, {}],
							text4: ["wm.Text", {"caption":"zip code","captionSize":"125px","displayValue":"","invalidMessage":"Enter a 5 digit or 9 digit zip code","regExp":"^\\d{5}$|^\\d{5}-\\d{4}","width":"350px"}, {}],
							text5: ["wm.Text", {"caption":"max 5 chars","captionSize":"125px","displayValue":"","maxChars":"5","width":"350px"}, {}]
						}]
					}],
					label58: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Result","height":"34px","padding":"4","width":"646px"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel57: ["wm.Panel", {"height":"148px","horizontalAlign":"left","padding":"0,0,0,100","verticalAlign":"top","width":"100%"}, {}, {
						panel58: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label44: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Currency is","padding":"4","width":"75px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label45: ["wm.Label", {"border":"0","display":"Currency","padding":"4","width":"98px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":false,"source":"currency2.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.CurrencyFormatter", {}, {}]
							}]
						}],
						panel59: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label46: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Email is","padding":"4","width":"54px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label47: ["wm.Label", {"border":"0","padding":"4","width":"179px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":false,"source":"text2.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						panel60: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label48: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Zip code is","padding":"4","width":"72px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label49: ["wm.Label", {"border":"0","padding":"4","width":"111px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":false,"source":"text4.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.DataFormatter", {}, {}]
							}]
						}]
					}]
				}],
				panel75: ["wm.MainContentPanel", {"height":"734px","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
					fancyPanel10: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel76: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html6: ["wm.Html", {"border":"0","height":"444px","html":"Editors can perform sophisticated validation:<br>\n<ul>\n<li>Specialized editors such as currency accept only numeric input</li>\n<li>Complex validation can be performed using standard regular expressions</li>\n<li>Developer can specify min and max values as well as max length </li>\n</ul>\n<h3>Documentation</h3>\n<ul>\n<li><a href='http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/Text' target='_blank'>Text Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href='http://widgetexamples.cloudfoundry.com/?page=select&layer=list' target='_blank'>Select Menu/Combo Boxes</a></li>\n</ul>","margin":"5","width":"100%"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}