Grid_Paging.widgets = {
	filmLiveVar: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"com.sampledatadb.data.Film","maxResults":10,"type":"com.sampledatadb.data.Film"}, {}],
	toastNewData: ["wm.NotificationCall", {"operation":"toast"}, {}, {
		input: ["wm.ServiceInput", {"type":"toastInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":"\"Loaded page \" + ${filmLiveVar.page} + \" of films\"","targetProperty":"text"}, {}],
				wire1: ["wm.Wire", {"expression":"\"Success\"","targetProperty":"cssClasses"}, {}],
				wire2: ["wm.Wire", {"expression":"\"bottom right\"","targetProperty":"dialogPosition"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel34: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel35: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label28: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"caption":"Grid Paging","padding":"4","width":"166px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			tabLayers1: ["wm.TabLayers", {}, {}, {
				layer1: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Data Navigator","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
					panel36: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
						panel38: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
							label29: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label30: ["wm.Label", {"caption":"<b>Directions:</b> this grid shows 10 films at a time.","height":"34px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							dataNavigator1: ["wm.DataNavigator", {"border":"0","height":"32px","horizontalAlign":"center","width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"filmLiveVar","targetProperty":"liveSource"}, {}]
								}]
							}],
							panel39: ["wm.Panel", {"height":"236px","horizontalAlign":"left","verticalAlign":"middle","width":"100%"}, {}, {
								dojoGrid4: ["wm.DojoGrid", {"columns":[{"mobileColumn":true,"align":"left","field":"PHONE COLUMN","show":true,"title":"-","width":"100%","expression":""}],"height":"100%","margin":"4","minDesktopHeight":60}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"filmLiveVar","targetProperty":"dataSet"}, {}]
									}]
								}]
							}],
							label31: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							panel41: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
								label32: ["wm.Label", {"autoSizeWidth":true,"caption":"You selected","padding":"4","width":"80px"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								gridLabel1: ["wm.Label", {"padding":"4"}, {}, {
									format: ["wm.DataFormatter", {}, {}],
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":false,"source":"dojoGrid4.selectedItem.title","targetProperty":"caption"}, {}]
									}]
								}]
							}]
						}],
						panel75: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
							fancyPanel8: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
								panel76: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
									html9: ["wm.Html", {"height":"100%","html":"<p>The Data Navigator makes it possible to page through a large set of rows without having to display all of them at once. This example shows 10 rows at a time from a 1,000 row table.</p>\n<p>This example shows using the data navigator widget tied to a database live variable to fetch 10 rows of data at a time and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/DataNavigator\" target=\"_blank\">Data Navigator</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\">Select Menu</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
								}]
							}]
						}]
					}]
				}],
				layer2: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Automatic Paging","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
					panel37: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
						panel40: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
							label33: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							label34: ["wm.Label", {"caption":"<b>Directions:</b> The Mobile List supports automatic paging, and will load more data as you scroll.","height":"34px","padding":"4","singleLine":false,"width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							list1: ["wm.List", {"_classes":{"domNode":["MobileListStyle"]},"border":"0","columns":[{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"","mobileColumn":true},{"show":false,"field":"dataValue","title":"DataValue","width":"100%","displayType":"String","align":"left","formatFunc":""},{"show":true,"controller":"rightarrow","width":"20px","title":"-","field":"_rightArrow","mobileColumn":true}],"headerVisible":false,"margin":"0","minDesktopHeight":60,"rightNavArrow":true,"styleAsGrid":false}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"filmLiveVar","targetProperty":"dataSet"}, {}]
								}]
							}],
							label35: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							panel44: ["wm.Panel", {"height":"39px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"top","width":"100%"}, {}, {
								jsonStatus1: ["wm.JsonStatus", {}, {}],
								label37: ["wm.Label", {"caption":"Page","padding":"4","width":"56px"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								gridLabel3: ["wm.Label", {"height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}, {
									format: ["wm.DataFormatter", {}, {}],
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":"${filmLiveVar.page}","targetProperty":"caption"}, {}]
									}]
								}]
							}],
							panel43: ["wm.Panel", {"height":"100px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"top","width":"100%"}, {}, {
								label36: ["wm.Label", {"caption":"You selected","padding":"4","width":"80px"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								gridLabel2: ["wm.Label", {"height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}, {
									format: ["wm.DataFormatter", {}, {}],
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":"${list1.selectedItem.title} + \": \" + ${list1.selectedItem.description}","targetProperty":"caption"}, {}]
									}]
								}]
							}]
						}],
						panel77: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
							fancyPanel9: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
								panel78: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
									html10: ["wm.Html", {"height":"100%","html":"<p>The MobileList supports automatic paging of its dataSet.  This behavior is automatically enabled for basic database requests and easily tooled for custom dataSets.</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/List\" target=\"_blank\">Data Navigator</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\">Select Menu</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
								}]
							}]
						}]
					}]
				}]
			}]
		}]
	}]
}