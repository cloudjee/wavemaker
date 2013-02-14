Issue.widgets = {
	ncManageIssue: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"layer","source":"layManageIssue"}, {}]
			}]
		}]
	}],
	ncSearchIssue: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"layer","source":"laySearchIssue"}, {}]
			}]
		}]
	}],
	svSearchIssue: ["wm.ServiceVariable", {"service":"issuecloudv2","operation":"searchIssue","startUpdate":true}, {}, {
		input: ["wm.ServiceInput", {"type":"searchIssueInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"quickvar","source":"teSQuick.dataValue"}, {}],
				wire1: ["wm.Wire", {"targetProperty":"priorityvar","source":"teSPriority.dataValue"}, {}],
				wire2: ["wm.Wire", {"targetProperty":"statusvar","source":"teSStatus.dataValue"}, {}],
				wire3: ["wm.Wire", {"targetProperty":"typevar","source":"teSType.dataValue"}, {}],
				wire4: ["wm.Wire", {"targetProperty":"projectvar","source":"teSProject.dataValue"}, {}],
				wire5: ["wm.Wire", {"targetProperty":"userassignedvar","source":"teSUserAssigned.dataValue"}, {}],
				wire6: ["wm.Wire", {"targetProperty":"userreportedvar","source":"teSUserReported.dataValue"}, {}],
				wire7: ["wm.Wire", {"targetProperty":"descriptionvar","source":"teSDescription.dataValue"}, {}],
				wire8: ["wm.Wire", {"targetProperty":"createdaftervar","source":"teSDateCreatedAfter.dataValue"}, {}],
				wire9: ["wm.Wire", {"targetProperty":"createdbeforevar","source":"teSDateCreatedBefore.dataValue"}, {}],
				wire10: ["wm.Wire", {"targetProperty":"closedbeforevar","source":"teSClosedBefore.dataValue"}, {}],
				wire11: ["wm.Wire", {"targetProperty":"closedaftervar","source":"teSClosedAfter.dataValue"}, {}],
				wire12: ["wm.Wire", {"targetProperty":"summaryvar","source":"teSSummary.dataValue"}, {}],
				wire13: ["wm.Wire", {"targetProperty":"versionreportedvar","source":"teSVersionReported.dataValue"}, {}],
				wire14: ["wm.Wire", {"targetProperty":"versionfixedvar","source":"teSVersionFixed.dataValue"}, {}]
			}]
		}]
	}],
	liveProject: ["wm.LiveVariable", {"liveSource":"com.data.Project","autoUpdate":false}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"targetProperty":"filter.flag","expression":"1"}, {}]
		}]
	}],
	liveUser: ["wm.LiveVariable", {"liveSource":"com.data.User","autoUpdate":false}, {"onSuccess":"liveUserSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"targetProperty":"filter.flag","expression":"1"}, {}]
		}]
	}],
	svGetVersions: ["wm.ServiceVariable", {"service":"issuecloudv2","operation":"getVersionByProject"}, {}, {
		input: ["wm.ServiceInput", {"type":"getVersionByProjectInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"projectvar","source":"teSProject.dataValue"}, {}]
			}]
		}]
	}],
	lbxIssue: ["wm.Layout", {"height":"100%","width":"1143px","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panSearch: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"center","verticalAlign":"top"}, {}, {
			panHeader: ["wm.Panel", {"width":"800px","height":"60px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
				labSearchHeader: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_20px"]},"height":"100%","width":"100%","caption":"Search Issues:","border":"0"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				labManageIssue: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"height":"100%","width":"150px","caption":"Manage Issues:","border":"0","borderColor":"#B1B1B1","align":"center"}, {"onclick":"labManageIssueClick"}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panSearchFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px","wm_FontSizePx_12px"]},"width":"800px","height":"100%","horizontalAlign":"center","border":"5","padding":"20,0,0,0","verticalAlign":"top"}, {}, {
				panSearchEditors: ["wm.Panel", {"width":"700px","height":"220px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
					panLeft: ["wm.Panel", {"width":"330px","height":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
						teSSummary: ["wm.TextEditor", {"width":"300px","emptyValue":"null","caption":"Summary"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						teSProject: ["wm.SelectEditor", {"caption":"Project","width":"300px","emptyValue":"null"}, {"onchange":"svGetVersions"}, {
							editor: ["wm._SelectEditor", {"displayField":"name","dataField":"pid","startUpdate":true}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveProject","expression":undefined}, {}]
								}]
							}]
						}],
						teSPriority: ["wm.SelectEditor", {"caption":"Priority","width":"300px","emptyValue":"null"}, {}, {
							editor: ["wm._SelectEditor", {"options":"minor, major, critical","startUpdate":true}, {}, {
								optionsVar: ["wm.Variable", {"type":"EntryData"}, {}],
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"app.vPriority","expression":undefined}, {}]
								}]
							}]
						}],
						teSType: ["wm.SelectEditor", {"caption":"Issue type","width":"300px","emptyValue":"null"}, {}, {
							editor: ["wm._SelectEditor", {"options":"bug, improvement, new feature","startUpdate":true}, {}, {
								optionsVar: ["wm.Variable", {"type":"EntryData"}, {}],
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"app.vType","expression":undefined}, {}]
								}]
							}]
						}],
						teSStatus: ["wm.SelectEditor", {"caption":"Status type","width":"300px","emptyValue":"null"}, {}, {
							editor: ["wm._SelectEditor", {"options":"open, in process, closed","startUpdate":true}, {}, {
								optionsVar: ["wm.Variable", {"type":"EntryData"}, {}],
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"app.vStatus","expression":undefined}, {}]
								}]
							}]
						}],
						teSUserReported: ["wm.SelectEditor", {"caption":"Reported by","width":"300px","emptyValue":"null"}, {}, {
							editor: ["wm._SelectEditor", {"dataField":"uid","displayExpression":"${firstname} +\" \"+${lastname}","startUpdate":true}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveUser","expression":undefined}, {}]
								}]
							}]
						}],
						teSUserAssigned: ["wm.SelectEditor", {"caption":"Assigned to","width":"300px","emptyValue":"null"}, {}, {
							editor: ["wm._SelectEditor", {"dataField":"uid","displayExpression":"${firstname} +\" \"+${lastname}","startUpdate":true}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveUser","expression":undefined}, {}]
								}]
							}]
						}],
						spacer5: ["wm.Spacer", {"height":"10px","width":"100%"}, {}],
						panControl: ["wm.Panel", {"width":"300px","height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
							btnSearch: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Search","iconUrl":"resources/images/buttons/search.png","iconWidth":"18px","iconHeight":"20px","iconMargin":"0 10px 1 0"}, {"onclick":"svSearchIssue"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/search.png\""}, {}]
								}]
							}],
							btnClear: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Clear","iconUrl":"resources/images/buttons/clear.png","iconWidth":"18px","iconHeight":"20px","iconMargin":"0 10px 1 0"}, {"onclick":"btnClearClick"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/clear.png\""}, {}]
								}]
							}]
						}]
					}],
					panRight: ["wm.Panel", {"width":"310px","height":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
						teSDescription: ["wm.TextEditor", {"width":"300px","emptyValue":"null","caption":"Description"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						teSDateCreatedBefore: ["wm.DateEditor", {"width":"300px","caption":"Created before","emptyValue":"null"}, {}, {
							editor: ["wm._DateEditor", {}, {}]
						}],
						teSDateCreatedAfter: ["wm.DateEditor", {"width":"300px","caption":"Created after","emptyValue":"null"}, {}, {
							editor: ["wm._DateEditor", {}, {}]
						}],
						teSClosedBefore: ["wm.DateEditor", {"width":"300px","caption":"Closed before","emptyValue":"null"}, {}, {
							editor: ["wm._DateEditor", {}, {}]
						}],
						teSClosedAfter: ["wm.DateEditor", {"width":"300px","caption":"Closed after","emptyValue":"null"}, {}, {
							editor: ["wm._DateEditor", {}, {}]
						}],
						teSVersionReported: ["wm.SelectEditor", {"caption":"Reported in","width":"300px","emptyValue":"null"}, {}, {
							editor: ["wm._SelectEditor", {"displayField":"name","dataField":"vid"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"svGetVersions","expression":undefined}, {}]
								}]
							}]
						}],
						teSVersionFixed: ["wm.SelectEditor", {"caption":"Fixed in version","width":"300px","emptyValue":"null"}, {}, {
							editor: ["wm._SelectEditor", {"displayField":"name","dataField":"vid"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"svGetVersions","expression":undefined}, {}]
								}]
							}]
						}],
						spacer6: ["wm.Spacer", {"height":"15px","width":"100%"}, {}],
						teSQuick: ["wm.TextEditor", {"width":"300px","emptyValue":"null","caption":"Quick Search"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}]
					}]
				}],
				grdIssues: ["wm.DataGrid", {"border":"0","width":"730px"}, {"onSelectionChanged":"grdIssuesSelectionChanged"}, {
					binding: ["wm.Binding", {}, {}, {
						wire1: ["wm.Wire", {"targetProperty":"dataValue","source":"grdIssues.selectedItem.iid","targetId":"app.vIssueId"}, {}],
						wire: ["wm.Wire", {"targetProperty":"dataSet","source":"svSearchIssue","expression":undefined}, {}]
					}],
					colSummary: ["wm.DataGridColumn", {"field":"summary","caption":"Summary","columnWidth":"230px"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					colKey: ["wm.DataGridColumn", {"field":"name","caption":"Issue Key","index":1}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					colType: ["wm.DataGridColumn", {"field":"issuetype","caption":"Issue Type","columnWidth":"150px","index":2}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					colStatus: ["wm.DataGridColumn", {"field":"status","caption":"Status","columnWidth":"80px","index":3}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					colPriority: ["wm.DataGridColumn", {"field":"priority","caption":"Priority","columnWidth":"91%","index":4}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}]
			}]
		}]
	}]
}