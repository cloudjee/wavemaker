Editor_Dates.widgets = {
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		panel6: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel22: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label13: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"autoSizeWidth":true,"border":"0","caption":"Date Editor Widgets","padding":"4","width":"168px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel23: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel27: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
					label52: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label23: ["wm.Label", {"border":"0","caption":"<b>Directions:</b> enter data into editors. Note that editors have built-in validation.","height":"34px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel28: ["wm.Panel", {"height":"137px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						panel29: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
						panel30: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
							date2: ["wm.Date", {"caption":"Date","captionSize":"120px","displayValue":"","width":"345px"}, {}],
							dateTime2: ["wm.DateTime", {"caption":"DateTime","captionSize":"120px","displayValue":"","width":"345px"}, {}],
							date3: ["wm.Date", {"caption":"Date with default","captionSize":"120px","displayValue":"8/2/2011","width":"345px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":"new Date()","source":false,"targetProperty":"dataValue"}, {}]
								}]
							}],
							label5: ["wm.Label", {"border":"0","caption":"Date with min = today, max = today + 1 month","padding":"4","width":"313px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							dateMin: ["wm.Date", {"caption":"Date w validation","captionSize":"120px","displayValue":"","placeHolder":"Min = today, Max = today + 1 mo","width":"345px"}, {}]
						}]
					}],
					label51: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel31: ["wm.Panel", {"height":"148px","horizontalAlign":"left","padding":"0,0,0,100","verticalAlign":"top","width":"100%"}, {}, {
						panel35: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label30: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Date is","padding":"4","width":"49px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label31: ["wm.Label", {"border":"0","display":"Date","padding":"4","width":"111px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":false,"source":"date2.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.DateFormatter", {}, {}]
							}]
						}],
						panel36: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label32: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Date time is","padding":"4","width":"78px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label33: ["wm.Label", {"border":"0","display":"DateTime","padding":"4","width":"177px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":false,"source":"dateTime2.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.DateTimeFormatter", {}, {}]
							}]
						}],
						panel39: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label34: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Date with default is","padding":"4","width":"119px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label35: ["wm.Label", {"autoSizeWidth":true,"border":"0","display":"Date","padding":"4","width":"101px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":false,"source":"date3.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.DateFormatter", {}, {}]
							}]
						}],
						panel66: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label43: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Date with validation is","padding":"4","width":"135px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label59: ["wm.Label", {"border":"0","display":"Date","padding":"4","width":"149px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":false,"source":"dateMin.dataValue","targetProperty":"caption"}, {}]
								}],
								format: ["wm.DateFormatter", {}, {}]
							}]
						}]
					}]
				}],
				panel71: ["wm.MainContentPanel", {"height":"734px","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
					fancyPanel8: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel72: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html4: ["wm.Html", {"border":"0","height":"100%","html":"<p>Date editors provide a way to input calendar and time-based values.</p>\n<p>This example shows using date and date time editors to input validated information and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/Text\" target=\"_blank\">Text Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\" target=\"_blank\">Select Menu/Combo Boxes</a></li>\n</ul>","margin":"5","width":"100%"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}