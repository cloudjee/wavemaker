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
Select_Display.widgets = {
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		panel36: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel37: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label22: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"autoSizeWidth":true,"border":"0","caption":"Show Last name, First Name in Option List","padding":"4","width":"385px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel38: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel40: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
					label28: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label23: ["wm.Label", {"border":"0","caption":"<b>Directions:</b> select from a list of employees listed by last name, first name","height":"34px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel41: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						panel42: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"20px"}, {}],
						expressionSelectMenu: ["wm.SelectMenu", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"caption":"Select employee","captionSize":"120px","displayExpression":"${lastname}+\", \"+${firstname}+\" Lives in:\"+${city}","displayField":"city","displayValue":"","pageSize":0,"width":"100%"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"app.empLiveVar","targetProperty":"dataSet"}, {}]
							}]
						}]
					}],
					label31: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					liveForm1: ["wm.LiveForm", {"fitToContentHeight":true,"height":"302px","horizontalAlign":"left","readonly":true,"verticalAlign":"top"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"expressionSelectMenu.selectedItem","targetProperty":"dataSet"}, {}],
							wire1: ["wm.Wire", {"expression":undefined,"source":"relatedEditor1.dataOutput","targetProperty":"dataOutput.employee"}, {}]
						}],
						eidEditor1: ["wm.Number", {"caption":"Eid","captionSize":"200px","formField":"eid","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
						label21: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","caption":"Detailed information for selected Employee","height":"42px","margin":"10,0,0,20","padding":"4","width":"331px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						firstnameEditor1: ["wm.Text", {"caption":"Firstname","captionSize":"200px","formField":"firstname","height":"26px","readonly":true,"width":"100%"}, {}],
						lastnameEditor1: ["wm.Text", {"caption":"Lastname","captionSize":"200px","formField":"lastname","height":"26px","readonly":true,"width":"100%"}, {}],
						streetEditor1: ["wm.Text", {"caption":"Street","captionSize":"200px","formField":"street","height":"26px","readonly":true,"width":"100%"}, {}],
						cityEditor1: ["wm.Text", {"caption":"City","captionSize":"200px","formField":"city","height":"26px","readonly":true,"width":"100%"}, {}],
						stateEditor1: ["wm.Text", {"caption":"State","captionSize":"200px","formField":"state","height":"26px","readonly":true,"width":"100%"}, {}],
						zipEditor1: ["wm.Text", {"caption":"Zip","captionSize":"200px","formField":"zip","height":"26px","readonly":true,"width":"100%"}, {}],
						birthdateEditor1: ["wm.DateTime", {"caption":"Birthdate","captionSize":"200px","dateMode":"Date","formField":"birthdate","height":"26px","readonly":true,"width":"100%"}, {}],
						picurlEditor1: ["wm.Text", {"caption":"Picurl","captionSize":"200px","formField":"picurl","height":"26px","readonly":true,"width":"100%"}, {}],
						twitteridEditor1: ["wm.Text", {"caption":"Twitterid","captionSize":"200px","formField":"twitterid","height":"26px","readonly":true,"width":"100%"}, {}],
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
						}],
						relatedEditor1: ["wm.RelatedEditor", {"fitToContentHeight":true,"formField":"employee","horizontalAlign":"left","verticalAlign":"top"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"expressionSelectMenu.selectedItem.employee","targetProperty":"dataSet"}, {}],
								wire1: ["wm.Wire", {"expression":undefined,"source":"employeeLookup1.selectedItem","targetProperty":"dataOutput"}, {}]
							}],
							employeeLookup1: ["wm.Lookup", {"caption":"Related Manager","captionSize":"200px","displayField":"firstname","formField":"","height":"26px","readonly":true,"width":"100%"}, {}]
						}]
					}]
				}],
				panel79: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
					fancyPanel10: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel80: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html9: ["wm.Html", {"border":"0","height":"100%","html":"<p>The display value of a select menu can be customized, for example by combining two database columns, lastname and firstname. </p>\n<p>The value returned by the select menu can also be different than the display value. In this case, the value returned is the employeeid.</p>\n<p>This example shows using the displayExpression property of the select menu to format how the database information is displayed and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href='http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/SelectMenu' target='_blank'>Select Menu Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href='http://widgetexamples.cloudfoundry.com/?page=editor&layer=radio'>Radio Button</a></li>\n</ul>","margin":"5","width":"100%"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}