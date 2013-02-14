Chart.widgets = {
	liveProject: ["wm.LiveVariable", {"liveSource":"com.data.Project","autoUpdate":false}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"targetProperty":"filter.flag","expression":"1"}, {}]
		}]
	}],
	svGetIssueByCritical: ["wm.ServiceVariable", {"service":"issuecloudv2","operation":"getIssueByCritical","startUpdate":true}, {}, {
		input: ["wm.ServiceInput", {"type":"getIssueByCriticalInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"projectvar","source":"seProject.dataValue"}, {}]
			}]
		}]
	}],
	svGetIssueByPriority: ["wm.ServiceVariable", {"service":"issuecloudv2","operation":"getIssueByPriority","startUpdate":true}, {}, {
		input: ["wm.ServiceInput", {"type":"getIssueByPriorityInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"projectvar","source":"seProject.dataValue"}, {}]
			}]
		}]
	}],
	svGetIssueByType: ["wm.ServiceVariable", {"service":"issuecloudv2","operation":"getIssueByType","startUpdate":true}, {}, {
		input: ["wm.ServiceInput", {"type":"getIssueByTypeInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"projectvar","source":"seProject.dataValue"}, {}]
			}]
		}]
	}],
	lbxChart: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panChart: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
			panChartControl: ["wm.Panel", {"width":"100%","height":"34px","horizontalAlign":"center","borderColor":"#B1B1B1","border":"0,0,2,0","layoutKind":"left-to-right","verticalAlign":"middle"}, {}, {
				seProject: ["wm.SelectMenu", {"_classes":{"domNode":["wm_FontSizePx_14px"]},"height":"26px","width":"370px","caption":"Select Project","captionAlign":"center","displayField":"name","dataField":"pid","emptyValue":"null"}, {"onchange":"seProjectChange"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveProject","expression":undefined}, {}]
					}]
				}],
				spacer3: ["wm.Spacer", {"height":"100%","width":"25px"}, {}],
				btnAllProject: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"26px","width":"110px","caption":"All Projects","iconUrl":"resources/images/buttons/search.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"btnAllProjectClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/search.png\""}, {}]
					}]
				}]
			}],
			panCharts: ["wm.Panel", {"width":"100%","height":"260px","horizontalAlign":"center","borderColor":"#B1B1B1","border":"0,0,2,0","layoutKind":"left-to-right","verticalAlign":"middle"}, {}, {
				picMain: ["wm.Picture", {"height":"90%","width":"164px","aspect":"h","border":"1","source":"resources/images/photos/cloud_main.jpg","borderColor":"#B8B8B8"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"targetProperty":"source","expression":"\"resources/images/photos/cloud_main.jpg\""}, {}]
					}]
				}],
				spacer2: ["wm.Spacer", {"height":"100%","width":"50px"}, {}],
				dojoChart1: ["wm.DojoChart", {"height":"100%","width":"300px","border":"0","theme":"IndigoNation","chartType":"Pie","xAxis":"type","yAxis":"number","padding":"10"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"targetProperty":"dataSet","source":"svGetIssueByType"}, {}]
					}]
				}],
				dojoChart2: ["wm.DojoChart", {"height":"100%","width":"300px","border":"0","theme":"IndigoNation","xAxis":"priority","yAxis":"number","padding":"10"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"targetProperty":"dataSet","source":"svGetIssueByPriority"}, {}]
					}]
				}]
			}],
			panGrid: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"center","border":"1","verticalAlign":"middle"}, {}, {
				label1: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_FontColor_White","wm_BackgroundColor_LightGray","wm_TextDecoration_Bold"]},"height":"28px","width":"733px","caption":"Open Issues With Status = Major, Critical or Blocker","border":"0"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				grdProject: ["wm.DataGrid", {"_classes":{"domNode":["wm_FontSizePx_14px"]},"border":"0","width":"733px","height":"80%"}, {"onSelected":"grdProjectSelected"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"targetProperty":"dataSet","source":"svGetIssueByCritical","expression":undefined}, {}]
					}],
					summary1: ["wm.DataGridColumn", {"field":"summary","caption":"summary","columnWidth":"545px","index":1}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					colIssueName: ["wm.DataGridColumn", {"field":"name","caption":"Issue Name","columnWidth":"150px"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}]
			}]
		}]
	}]
}