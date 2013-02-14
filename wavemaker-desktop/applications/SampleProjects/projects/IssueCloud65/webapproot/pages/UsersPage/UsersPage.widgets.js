UsersPage.widgets = {
	userLiveVariable1: ["wm.LiveVariable", {"type":"com.issuecloudv3db.data.User"}, {}, {
		liveView: ["wm.LiveView", {"dataType":"com.issuecloudv3db.data.User","view":[{"caption":"Uid","sortable":true,"dataIndex":"uid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Firstname","sortable":true,"dataIndex":"firstname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Lastname","sortable":true,"dataIndex":"lastname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Username","sortable":true,"dataIndex":"username","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Password","sortable":true,"dataIndex":"password","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Email","sortable":true,"dataIndex":"email","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null},{"caption":"Createdate","sortable":true,"dataIndex":"createdate","type":"java.util.Date","displayType":"Date","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":7,"subType":null},{"caption":"Role","sortable":true,"dataIndex":"role","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":8,"subType":null},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":9,"subType":null}]}, {}]
	}],
	helpNotificationCall: ["wm.NotificationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"alertInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":"\"The Issues tab is a PageContainer with published properties.  We pass in the currently selected user so that the IssuesPage will filter on that user.\"","targetProperty":"text"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		issuecloudv3DBLivePanel: ["wm.LivePanel", {"horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
			userDojoGridPanel: ["wm.Panel", {"border":"0,1,0,0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"200px"}, {}, {
				userDojoGrid: ["wm.DojoGrid", {"border":"0","columns":[{"show":false,"field":"uid","title":"Uid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"tid","title":"Tid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"firstname","title":"Firstname","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"lastname","title":"Lastname","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"username","title":"User","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"expression":"${username} + (${role} == \"admin\" ? \" (admin)\" : \"\")","mobileColumn":false},{"show":false,"field":"password","title":"Password","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"email","title":"Email","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"createdate","title":"Createdate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"role","title":"Role","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"flag","title":"Flag","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"","mobileColumn":true}],"dsType":"com.issuecloudv3db.data.User","height":"100%","margin":"0"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"source":"userLiveVariable1","targetProperty":"dataSet"}, {}]
					}]
				}],
				panel1: ["wm.Panel", {"_classes":{"domNode":["ToolBar"]},"height":"40px","horizontalAlign":"right","layoutKind":"left-to-right","roles":["admin"],"verticalAlign":"top","width":"100%"}, {}, {
					helpButton: ["wm.Button", {"caption":"Help","desktopHeight":"40px","height":"40px","margin":"4"}, {"onclick":"helpNotificationCall"}],
					spacer1: ["wm.Spacer", {"height":"1px","width":"100%"}, {}],
					newButton1: ["wm.Button", {"caption":"New","height":"100%","margin":"4"}, {"onclick":"userLiveForm1EditPanel.beginDataInsert","onclick1":"tabLayers1.show"}]
				}]
			}],
			splitter1: ["wm.Splitter", {"height":"100%","width":"4px"}, {}],
			tabLayers1: ["wm.TabLayers", {"clientBorder":"1,0,0,1","margin":"0,0,0,1"}, {}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":"${userDojoGrid.isRowSelected} || Boolean(window[\"studio\"])","targetProperty":"showing"}, {}]
				}],
				userLayer: ["wm.Layer", {"border":"1,0,0,1","borderColor":"#999999","caption":"User","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
					userLiveForm1: ["wm.LiveForm", {"autoScroll":true,"captionAlign":"left","captionSize":"100px","editorHeight":"40px","enableTouchHeight":true,"height":"100%","horizontalAlign":"center","readonly":true,"verticalAlign":"top"}, {"onSuccess":"userLiveVariable1"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"userDojoGrid.selectedItem","targetProperty":"dataSet"}, {}]
						}],
						uidEditor1: ["wm.Number", {"caption":"Uid","captionAlign":"left","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"uid","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
						tidEditor1: ["wm.Number", {"caption":"Tid","captionAlign":"left","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"tid","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"1","targetProperty":"defaultInsert"}, {}]
							}]
						}],
						firstnameEditor1: ["wm.Text", {"caption":"Firstname","captionAlign":"left","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"firstname","height":"26px","readonly":true,"width":"100%"}, {}],
						lastnameEditor1: ["wm.Text", {"caption":"Lastname","captionAlign":"left","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"lastname","height":"26px","readonly":true,"width":"100%"}, {}],
						usernameEditor1: ["wm.Text", {"caption":"Username","captionAlign":"left","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"username","height":"26px","readonly":true,"width":"100%"}, {}],
						passwordEditor1: ["wm.Text", {"caption":"Password","captionAlign":"left","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"password","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
						emailEditor1: ["wm.Text", {"caption":"Email","captionAlign":"left","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"email","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
						createdateEditor1: ["wm.DateTime", {"caption":"Createdate","captionAlign":"left","dateMode":"Date","desktopHeight":"26px","emptyValue":"zero","formField":"createdate","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
						roleEditor1: ["wm.Text", {"caption":"Role","captionAlign":"left","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"role","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
						flagEditor1: ["wm.Number", {"caption":"Flag","captionAlign":"left","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"flag","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
						userSpacer: ["wm.Spacer", {"height":"100%","width":"10px"}, {}],
						userLiveForm1EditPanel: ["wm.EditPanel", {"_classes":{"domNode":["ToolBar"]},"desktopHeight":"32px","height":"32px","isCustomized":true,"layoutKind":"left-to-right","liveForm":"userLiveForm1","lock":false,"operationPanel":"operationPanel1","roles":["admin"],"savePanel":"savePanel1"}, {}, {
							savePanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
								saveButton1: ["wm.Button", {"caption":"Save","height":"100%","margin":"4"}, {"onclick":"userLiveForm1EditPanel.saveData"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"userLiveForm1EditPanel.formInvalid","targetProperty":"disabled"}, {}]
									}]
								}],
								cancelButton1: ["wm.Button", {"caption":"Cancel","height":"100%","margin":"4"}, {"onclick":"userLiveForm1EditPanel.cancelEdit"}]
							}],
							operationPanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								updateButton1: ["wm.Button", {"caption":"Edit","height":"100%","margin":"4"}, {"onclick":"userLiveForm1EditPanel.beginDataUpdate"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"userLiveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
									}]
								}],
								deleteButton1: ["wm.Button", {"caption":"Delete","height":"100%","margin":"4"}, {"onclick":"userLiveForm1EditPanel.deleteData"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"userLiveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
									}]
								}]
							}]
						}]
					}]
				}],
				issuesLayer: ["wm.Layer", {"border":"1,0,0,1","borderColor":"#999999","caption":"Issues","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
					pageContainer1: ["wm.PageContainer", {"deferLoad":true,"pageName":"IssuesPage","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{"assignedToMenuDataValue":"assignedToMenu.dataValue","hideSummaryVarDataSet":"hideSummaryVar.dataSet"}}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":"true","targetProperty":"hideSummaryVarDataSet.dataValue"}, {}],
							wire1: ["wm.Wire", {"expression":undefined,"source":"userDojoGrid.selectedItem","targetProperty":"assignedToMenuDataValue"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}