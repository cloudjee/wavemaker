Main.widgets = {
	usersLiveVariable1: ["wm.LiveVariable", {"liveSource":"app.usersLiveView1"}, {}],
	logoutSvcVar: ["wm.ServiceVariable", {"operation":"logout","service":"securityService"}, {"onSuccess":"loginNav"}, {
		input: ["wm.ServiceInput", {"type":"logoutInputs"}, {}]
	}],
	loginNav: ["wm.NavigationCall", {"operation":"gotoPage"}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoPageInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":"\"Login\"","targetProperty":"pageName"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		TitleBar: ["wm.Template", {"_classes":{"domNode":["wm_SilverBlueTheme_MainOutsetPanel"]},"height":"96px","horizontalAlign":"left","layoutKind":"left-to-right","lock":true,"padding":"8","verticalAlign":"top","width":"100%"}, {}, {
			appNameLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontSize_200percent","wm_FontColor_Blue","wm_FontSizePx_24px"]},"border":"0","caption":"EnterTweet","height":"100%","padding":"4","width":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel3: ["wm.Panel", {"_classes":{"domNode":["wm_SilverBlueTheme_WhiteInsetPanel"]},"border":"1","borderColor":"steelblue","height":"100%","width":"222px"}, {}, {
				picture1: ["wm.Picture", {"border":"0","height":"100%","width":"100%"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":"\"resources/images/nest.jpg\"","targetProperty":"source"}, {}]
					}]
				}]
			}]
		}],
		usersLivePanel1: ["wm.LivePanel", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
			usersDataGrid1: ["wm.DataGrid", {"height":"209px"}, {"onSelected":"usersDataGrid1Selected"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"usersLiveVariable1","targetProperty":"dataSet"}, {}]
				}],
				firstname2: ["wm.DataGridColumn", {"autoSize":undefined,"caption":"Firstname","field":"firstname","index":1}, {}, {
					format: ["wm.DataFormatter", {}, {}],
					format1: ["wm.DataFormatter", {}, {}]
				}],
				lastname2: ["wm.DataGridColumn", {"autoSize":undefined,"caption":"Lastname","field":"lastname","index":2}, {}, {
					format: ["wm.DataFormatter", {}, {}],
					format1: ["wm.DataFormatter", {}, {}]
				}],
				phone2: ["wm.DataGridColumn", {"autoSize":undefined,"caption":"Phone","field":"phone","index":4}, {}, {
					format: ["wm.DataFormatter", {}, {}],
					format1: ["wm.DataFormatter", {}, {}]
				}],
				role2: ["wm.DataGridColumn", {"autoSize":undefined,"caption":"Role","field":"role","index":5}, {}, {
					format: ["wm.DataFormatter", {}, {}],
					format1: ["wm.DataFormatter", {}, {}]
				}],
				tenantid2: ["wm.DataGridColumn", {"autoSize":undefined,"caption":"Tenantid","display":"Number","field":"tenantid","index":6}, {}, {
					format: ["wm.NumberFormatter", {}, {}],
					format1: ["wm.NumberFormatter", {}, {}]
				}],
				twittername2: ["wm.DataGridColumn", {"autoSize":undefined,"caption":"Twittername","field":"twittername","index":7}, {}, {
					format: ["wm.DataFormatter", {}, {}],
					format1: ["wm.DataFormatter", {}, {}]
				}],
				username2: ["wm.DataGridColumn", {"autoSize":undefined,"caption":"Username","field":"username","index":8}, {}, {
					format: ["wm.DataFormatter", {}, {}],
					format1: ["wm.DataFormatter", {}, {}]
				}]
			}],
			usersLiveForm1: ["wm.LiveForm", {"height":"194px","horizontalAlign":"left","readonly":true,"verticalAlign":"top"}, {"onSuccess":"usersLiveVariable1"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"usersDataGrid1.selectedItem","targetProperty":"dataSet"}, {}]
				}],
				usernameEditor1: ["wm.Editor", {"caption":"Username","formField":"username","height":"26px","padding":"2","readonly":true,"width":"100%"}, {}, {
					editor: ["wm._TextEditor", {"required":true}, {}]
				}],
				firstnameEditor1: ["wm.Editor", {"caption":"Firstname","formField":"firstname","height":"26px","padding":"2","readonly":true,"width":"100%"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				lastnameEditor1: ["wm.Editor", {"caption":"Lastname","formField":"lastname","height":"26px","padding":"2","readonly":true,"width":"100%"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				passwordEditor1: ["wm.Editor", {"caption":"Password","formField":"password","height":"26px","padding":"2","readonly":true,"roles":["admin"],"width":"100%"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				tenantidEditor1: ["wm.Editor", {"caption":"Tenantid","display":"Number","formField":"tenantid","height":"26px","padding":"2","readonly":true,"width":"100%"}, {}, {
					editor: ["wm._NumberEditor", {}, {}]
				}],
				twitternameEditor1: ["wm.Editor", {"caption":"Twittername","formField":"twittername","height":"26px","padding":"2","readonly":true,"width":"100%"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				editPanel1: ["wm.EditPanel", {"liveForm":"usersLiveForm1","operationPanel":"operationPanel1","savePanel":"savePanel1"}, {}, {
					savePanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"width":"100%"}, {}, {
						saveButton1: ["wm.Button", {"caption":"Save","height":"100%","margin":"4","width":"70px"}, {"onclick":"editPanel1.saveData"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"editPanel1.formInvalid","targetProperty":"disabled"}, {}]
							}]
						}],
						cancelButton1: ["wm.Button", {"caption":"Cancel","height":"100%","margin":"4","width":"70px"}, {"onclick":"editPanel1.cancelEdit"}]
					}],
					operationPanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","width":"100%"}, {}, {
						newButton1: ["wm.Button", {"caption":"New","height":"100%","margin":"4","width":"70px"}, {"onclick":"editPanel1.beginDataInsert"}],
						updateButton1: ["wm.Button", {"caption":"Update","height":"100%","margin":"4","width":"70px"}, {"onclick":"editPanel1.beginDataUpdate"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"editPanel1.formUneditable","targetProperty":"disabled"}, {}]
							}]
						}],
						deleteButton1: ["wm.Button", {"caption":"Delete","height":"100%","margin":"4","width":"70px"}, {"onclick":"editPanel1.deleteData"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"editPanel1.formUneditable","targetProperty":"disabled"}, {}]
							}]
						}]
					}]
				}]
			}],
			label1: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_20px","wm_BackgroundChromeBar_LightGray"]},"border":"0","caption":"Twitter Feed","height":"32px","padding":"4","width":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			twitterFeed: ["wm.FeedList", {"height":"100%","width":"100%"}, {}, {
				getFeedServiceVariable: ["wm.ServiceVariable", {"operation":"getFeed","service":"FeedService"}, {}, {
					input: ["wm.ServiceInput", {"type":"getFeedInputs"}, {}]
				}]
			}],
			panel1: ["wm.Panel", {"height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				button1: ["wm.Button", {"caption":"Logout","margin":"4","width":"66px"}, {"onclick":"logoutSvcVar"}]
			}]
		}]
	}]
}