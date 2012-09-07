Form_To_One.widgets = {
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		panel36: ["wm.Panel", {"height":"600px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel37: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label22: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"border":"0","caption":"One To One Relationship","padding":"4","width":"317px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel38: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel40: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
					label28: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label23: ["wm.Label", {"border":"0","caption":"<b>Directions:</b> select an employee to see the vacations for that employee, each employee can have zero to many related vacations.","height":"34px","padding":"4","singleLine":false,"width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel41: ["wm.Panel", {"height":"150px","horizontalAlign":"left","margin":"0,0,0,0","verticalAlign":"top","width":"100%"}, {}, {
						empGrid: ["wm.DojoGrid", {"columns":[{"show":false,"id":"tenantid","title":"Tenantid","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":false,"id":"eid","title":"Eid","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":true,"id":"firstname","title":"Firstname","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"lastname","title":"Lastname","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"street","title":"Street","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"city","title":"City","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"state","title":"State","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"zip","title":"Zip","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"birthdate","title":"Birthdate","width":"80px","displayType":"Date","noDelete":true,"align":"left","formatFunc":"wm_date_formatter"},{"show":false,"id":"picurl","title":"Picurl","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"twitterid","title":"Twitterid","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"height":"100%","localizationStructure":{},"margin":"4"}, {"onClick":"vacationLiveVar"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"app.empLiveVar","targetProperty":"dataSet"}, {}]
							}]
						}]
					}],
					label31: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label34: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","caption":"Manager for this employee","padding":"4","singleLine":false,"width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					liveForm1: ["wm.LiveForm", {"fitToContentHeight":true,"height":"78px","horizontalAlign":"left","readonly":true,"verticalAlign":"top"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"empGrid.selectedItem.employee","targetProperty":"dataSet"}, {}]
						}],
						eidEditor1: ["wm.Number", {"caption":"Eid","captionSize":"200px","formField":"eid","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
						firstnameEditor1: ["wm.Text", {"caption":"Firstname","captionSize":"200px","formField":"firstname","height":"26px","readonly":true,"width":"100%"}, {}],
						lastnameEditor1: ["wm.Text", {"caption":"Lastname","captionSize":"200px","formField":"lastname","height":"26px","readonly":true,"width":"100%"}, {}],
						streetEditor1: ["wm.Text", {"caption":"Street","captionSize":"200px","formField":"street","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						cityEditor1: ["wm.Text", {"caption":"City","captionSize":"200px","formField":"city","height":"26px","readonly":true,"width":"100%"}, {}],
						stateEditor1: ["wm.Text", {"caption":"State","captionSize":"200px","formField":"state","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						zipEditor1: ["wm.Text", {"caption":"Zip","captionSize":"200px","formField":"zip","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						birthdateEditor1: ["wm.DateTime", {"caption":"Birthdate","captionSize":"200px","dateMode":"Date","formField":"birthdate","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						picurlEditor1: ["wm.Text", {"caption":"Picurl","captionSize":"200px","formField":"picurl","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						twitteridEditor1: ["wm.Text", {"caption":"Twitterid","captionSize":"200px","formField":"twitterid","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						tenantidEditor1: ["wm.Number", {"caption":"Tenantid","captionSize":"200px","formField":"tenantid","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						liveForm1EditPanel: ["wm.EditPanel", {"height":"32px","liveForm":"liveForm1","operationPanel":"operationPanel1","savePanel":"savePanel1","showing":false}, {}, {
							savePanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
								saveButton1: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"liveForm1EditPanel.saveData"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"liveForm1EditPanel.formInvalid","targetProperty":"disabled"}, {}]
									}]
								}],
								cancelButton1: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"liveForm1EditPanel.cancelEdit"}]
							}],
							operationPanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								newButton1: ["wm.Button", {"caption":"New","margin":"4"}, {"onclick":"liveForm1EditPanel.beginDataInsert"}],
								updateButton1: ["wm.Button", {"caption":"Update","margin":"4"}, {"onclick":"liveForm1EditPanel.beginDataUpdate"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"liveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
									}]
								}],
								deleteButton1: ["wm.Button", {"caption":"Delete","margin":"4"}, {"onclick":"liveForm1EditPanel.deleteData"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"liveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
									}]
								}]
							}]
						}]
					}],
					label35: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","caption":"Department for this employee","padding":"4","singleLine":false,"width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					liveForm2: ["wm.LiveForm", {"fitToContentHeight":true,"height":"52px","horizontalAlign":"left","readonly":true,"verticalAlign":"top"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"empGrid.selectedItem.department","targetProperty":"dataSet"}, {}]
						}],
						deptidEditor1: ["wm.Number", {"caption":"Deptid","captionSize":"200px","formField":"deptid","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
						nameEditor1: ["wm.Text", {"caption":"Name","captionSize":"200px","formField":"name","height":"26px","readonly":true,"width":"100%"}, {}],
						budgetEditor1: ["wm.Number", {"caption":"Budget","captionSize":"200px","formField":"budget","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						q1Editor1: ["wm.Number", {"caption":"Q1","captionSize":"200px","formField":"q1","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						q2Editor1: ["wm.Number", {"caption":"Q2","captionSize":"200px","formField":"q2","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						q3Editor1: ["wm.Number", {"caption":"Q3","captionSize":"200px","formField":"q3","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						q4Editor1: ["wm.Number", {"caption":"Q4","captionSize":"200px","formField":"q4","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						deptcodeEditor1: ["wm.Text", {"caption":"Deptcode","captionSize":"200px","formField":"deptcode","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						locationEditor1: ["wm.Text", {"caption":"Location","captionSize":"200px","formField":"location","height":"26px","readonly":true,"width":"100%"}, {}],
						tenantidEditor2: ["wm.Number", {"caption":"Tenantid","captionSize":"200px","formField":"tenantid","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
						liveForm2EditPanel: ["wm.EditPanel", {"height":"32px","liveForm":"liveForm2","operationPanel":"operationPanel2","savePanel":"savePanel2","showing":false}, {}, {
							savePanel2: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
								saveButton2: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"liveForm2EditPanel.saveData"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"liveForm2EditPanel.formInvalid","targetProperty":"disabled"}, {}]
									}]
								}],
								cancelButton2: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"liveForm2EditPanel.cancelEdit"}]
							}],
							operationPanel2: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								newButton2: ["wm.Button", {"caption":"New","margin":"4"}, {"onclick":"liveForm2EditPanel.beginDataInsert"}],
								updateButton2: ["wm.Button", {"caption":"Update","margin":"4"}, {"onclick":"liveForm2EditPanel.beginDataUpdate"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"liveForm2EditPanel.formUneditable","targetProperty":"disabled"}, {}]
									}]
								}],
								deleteButton2: ["wm.Button", {"caption":"Delete","margin":"4"}, {"onclick":"liveForm2EditPanel.deleteData"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"liveForm2EditPanel.formUneditable","targetProperty":"disabled"}, {}]
									}]
								}]
							}]
						}]
					}]
				}],
				panel78: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
					fancyPanel10: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel79: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html9: ["wm.Html", {"border":"0","height":"100%","html":"Form widgets provide an easy way to input data into a database. Supported features include<br>\n<ul>\n<li>Automatic validation of form fields</li>\n<li>Create, Update, Delete database records from form</li>\n<li>Manage required fields and required relationships</li>\n</ul>\n<p>This example shows using onSelected event for a grid widget to display related employee and department for a selected employee and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href='http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/LiveForm' target='_blank'>Live Form Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href='http://widgetexamples.cloudfoundry.com/?page=grid&layer=basic'>Grid</a></li>\n</ul>","margin":"5","width":"100%"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}