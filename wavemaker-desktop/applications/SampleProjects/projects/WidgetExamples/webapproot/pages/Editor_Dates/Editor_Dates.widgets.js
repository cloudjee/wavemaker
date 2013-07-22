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
Editor_Dates.widgets = {
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel6: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel22: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label13: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"autoSizeWidth":true,"caption":"Date Editor Widgets","padding":"4","width":"142px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel23: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel27: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
					label52: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label23: ["wm.Label", {"caption":"<b>Directions:</b> enter data into editors. Note that editors have built-in validation.","height":"34px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel28: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						panel29: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
						formPanel1: ["wm.FormPanel", {"captionAlign":"left","captionPosition":"top","captionSize":"28px","editorHeight":"54px","height":"100%"}, {}, {
							panel1: ["wm.Panel", {"height":"58px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
								date1: ["wm.Date", {"caption":"wm.Date editor; with max and min values","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":undefined,"displayValue":"","height":"100%","helpText":"<li><b>minimum:</b> January 1, 2010</li><li><b>maximum:</b> July 15, 2013</li>","maximum":1373871600000,"minimum":1262332800000,"placeHolder":"min: January 1, 2010; max: July 15, 2013","singleLine":false,"width":"100%"}, {}],
								label1: ["wm.Label", {"align":"center","caption":"=","padding":"4","width":"40px"}, {}],
								label2: ["wm.Label", {"align":"left","display":"Date","padding":"4","width":"220px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"date1.dataValue","targetProperty":"caption"}, {}]
									}],
									format: ["wm.DateFormatter", {"formatLength":"full"}, {}]
								}]
							}],
							panel2: ["wm.Panel", {"height":"58px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
								date2: ["wm.DateTime", {"caption":"wm.DateTime editor; with max and min values","captionAlign":"left","captionPosition":"top","captionSize":"28px","displayValue":"","height":"100%","helpText":"<li><b>minimum:</b> January 1, 2010</li><li><b>maximum:</b> July 15, 2013</li>","maximum":1373871600824,"minimum":1262332800638,"singleLine":false,"width":"100%"}, {}],
								label3: ["wm.Label", {"align":"center","caption":"=","padding":"4","width":"40px"}, {}],
								label4: ["wm.Label", {"align":"left","display":"DateTime","padding":"4","width":"220px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"date2.dataValue","targetProperty":"caption"}, {}]
									}],
									format: ["wm.DateTimeFormatter", {}, {}]
								}]
							}],
							panel3: ["wm.Panel", {"height":"58px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
								date3: ["wm.Time", {"caption":"wm.Time editor","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":undefined,"displayValue":"","height":"100%","width":"100%"}, {}],
								label5: ["wm.Label", {"align":"center","caption":"=","padding":"4","width":"40px"}, {}],
								label6: ["wm.Label", {"align":"left","display":"Time","padding":"4","width":"220px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"date3.dataValue","targetProperty":"caption"}, {}]
									}],
									format: ["wm.TimeFormatter", {}, {}]
								}]
							}],
							label9: ["wm.Label", {"caption":"wm.Calendar editor with max and min values, default: 7/3/2013","padding":"4","width":"100%"}, {}],
							panel4: ["wm.Panel", {"height":"160px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
								calendar1: ["wm.dijit.Calendar", {"dateValue":1372834800000,"maximum":1373871600000,"minimum":1262332800000}, {}],
								label7: ["wm.Label", {"align":"center","caption":"=","padding":"4","width":"40px"}, {}],
								label8: ["wm.Label", {"align":"left","display":"Date","padding":"4","width":"220px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"calendar1.dateValue","targetProperty":"caption"}, {}]
									}],
									format: ["wm.DateFormatter", {"formatLength":"short"}, {}]
								}]
							}],
							panel5: ["wm.Panel", {"height":"58px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
								date4: ["wm.Date", {"caption":"wm.Date editor; value bound to calendar above","captionAlign":"left","captionPosition":"top","captionSize":"28px","displayValue":"7/3/2013","height":"100%","helpText":undefined,"maximum":1373871600000,"minimum":1262332800000,"placeHolder":undefined,"singleLine":false,"width":"100%"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"calendar1.dateValue","targetProperty":"dataValue"}, {}]
									}]
								}],
								label10: ["wm.Label", {"align":"center","caption":"=","padding":"4","width":"40px"}, {}],
								label11: ["wm.Label", {"align":"left","display":"Date","padding":"4","width":"220px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"date1.dataValue","targetProperty":"caption"}, {}]
									}],
									format: ["wm.DateFormatter", {"formatLength":"full"}, {}]
								}]
							}]
						}]
					}]
				}],
				fancyPanel8: ["wm.FancyPanel", {"labelHeight":"36","minWidth":280,"title":"Description","width":"50%"}, {}, {
					panel72: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						html4: ["wm.Html", {"height":"100%","html":"<p>Date editors provide a way to input calendar and time-based values.  There are four types of date editors.</p>\n<ul>\n<li><b>Calendar:</b> This is just a calendar on a page, and is the simplest way to ask a user to enter a date</li>\n<li><b>wm.Date: </b>An editor for entering only a date</li>\n<li><b>wm.Time: </b>An editor for entering only a time</li>\n<li><b>wm.DateTime: </b>This editor can be used to get both date and time, or just date or just time.  It reenvisions how a user can enter a Time, and can be used instead of wm.Time if you prefer this style of time entry.</li>\n</ul>\n<p>All Dates provide the following capabilities: </p>\n<ul>\n<li>A dataValue that can be given an initial value</li>\n<li>A dataValue that can be bound to another widget (see the bottom editor bound to the calendar)</li>\n<li>A dataValue that can be set by calling this.dateEditor.setDataValue(d)</li> <li>A maximum and minimum value that the user must enter a value between (Note: This applies to dates, but not to time)</li>\n</ul>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/Date\" target=\"_blank\">Date Editor</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/Time\" target=\"_blank\">Time Editor</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/DateTime\" target=\"_blank\">DateTime Editor</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/Calendar\" target=\"_blank\">Calendar</a></li>\n</ul>\n","margin":"5"}, {}]
					}]
				}]
			}]
		}]
	}]
}