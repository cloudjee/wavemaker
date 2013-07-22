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
Form_Related.widgets = {
	empViewLiveVar: ["wm.LiveVariable", {"liveSource":"app.empLiveView","maxResults":1}, {}],
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		panel36: ["wm.Panel", {"height":"600px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel37: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label22: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"border":"0","caption":"Forms With Related Data","padding":"4","width":"317px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel38: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel40: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
					label28: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label23: ["wm.Label", {"border":"0","caption":"<b>Directions:</b> select an employee and then click update to set related manager and department. Press cancel to move to another employee.","height":"34px","padding":"4","singleLine":false,"width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label31: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel41: ["wm.Panel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,0","verticalAlign":"top","width":"100%"}, {}, {
						dataNavigator1: ["wm.DataNavigator", {"border":"0","horizontalAlign":"center","width":"100%"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"empViewLiveVar","targetProperty":"liveSource"}, {}]
							}]
						}],
						liveForm3: ["wm.LiveForm", {"fitToContentHeight":true,"height":"236px","horizontalAlign":"left","readonly":true,"verticalAlign":"top"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"empViewLiveVar","targetProperty":"dataSet"}, {}],
								wire1: ["wm.Wire", {"expression":undefined,"source":"relatedEditor1.dataOutput","targetProperty":"dataOutput.employee"}, {}],
								wire2: ["wm.Wire", {"expression":undefined,"source":"relatedEditor2.dataOutput","targetProperty":"dataOutput.department"}, {}]
							}],
							eidEditor2: ["wm.Number", {"caption":"Eid","captionSize":"200px","formField":"eid","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
							firstnameEditor2: ["wm.Text", {"caption":"Firstname","captionSize":"200px","formField":"firstname","height":"26px","readonly":true,"width":"100%"}, {}],
							lastnameEditor2: ["wm.Text", {"caption":"Lastname","captionSize":"200px","formField":"lastname","height":"26px","readonly":true,"width":"100%"}, {}],
							streetEditor2: ["wm.Text", {"caption":"Street","captionSize":"200px","formField":"street","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
							cityEditor2: ["wm.Text", {"caption":"City","captionSize":"200px","formField":"city","height":"26px","readonly":true,"width":"100%"}, {}],
							stateEditor2: ["wm.Text", {"caption":"State","captionSize":"200px","formField":"state","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
							zipEditor2: ["wm.Text", {"caption":"Zip","captionSize":"200px","formField":"zip","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
							birthdateEditor2: ["wm.DateTime", {"caption":"Birthdate","captionSize":"200px","dateMode":"Date","formField":"birthdate","height":"26px","readonly":true,"width":"100%"}, {}],
							picurlEditor2: ["wm.Text", {"caption":"Picurl","captionSize":"200px","formField":"picurl","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
							label35: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","caption":"Department for this employee","padding":"4","singleLine":false,"width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							relatedEditor1: ["wm.RelatedEditor", {"fitToContentHeight":true,"formField":"employee","horizontalAlign":"left","verticalAlign":"top"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"empViewLiveVar.employee","targetProperty":"dataSet"}, {}],
									wire1: ["wm.Wire", {"expression":undefined,"source":"employeeLookup2.selectedItem","targetProperty":"dataOutput"}, {}]
								}],
								employeeLookup2: ["wm.Lookup", {"caption":"Manager (lookup)","captionSize":"200px","displayField":"firstname","displayValue":"Will","formField":"","height":"26px","readonly":true,"width":"100%"}, {}]
							}],
							label34: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","caption":"Manager for this employee","padding":"4","singleLine":false,"width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							twitteridEditor2: ["wm.Text", {"caption":"Twitterid","captionSize":"200px","formField":"twitterid","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
							tenantidEditor3: ["wm.Number", {"caption":"Tenantid","captionSize":"200px","formField":"tenantid","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
							relatedEditor2: ["wm.RelatedEditor", {"fitToContentHeight":true,"formField":"department","horizontalAlign":"left","verticalAlign":"top"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"empViewLiveVar.department","targetProperty":"dataSet"}, {}],
									wire1: ["wm.Wire", {"expression":undefined,"source":"departmentLookup2.selectedItem","targetProperty":"dataOutput"}, {}]
								}],
								departmentLookup2: ["wm.Lookup", {"caption":"Department (lookup)","captionSize":"200px","displayField":"name","displayValue":"Engineering","formField":"","height":"26px","readonly":true,"width":"100%"}, {}]
							}],
							liveForm3EditPanel: ["wm.EditPanel", {"height":"32px","isCustomized":true,"liveForm":"liveForm3","lock":false,"operationPanel":"operationPanel3","savePanel":"savePanel3"}, {}, {
								savePanel3: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
									cancelButton3: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"liveForm3EditPanel.cancelEdit"}]
								}],
								operationPanel3: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
									updateButton3: ["wm.Button", {"caption":"Update","margin":"4"}, {"onclick":"liveForm3EditPanel.beginDataUpdate"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":undefined,"source":"liveForm3EditPanel.formUneditable","targetProperty":"disabled"}, {}]
										}]
									}]
								}]
							}]
						}]
					}]
				}],
				panel78: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
					fancyPanel10: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel79: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html9: ["wm.Html", {"border":"0","height":"100%","html":"Form widgets provide an easy way to input data into a database. Supported features include<br>\n<ul>\n<li>Automatic validation of form fields</li>\n<li>Create, Update, Delete database records from form</li>\n<li>Manage required fields and required relationships</li>\n</ul>\n<p>This example shows using the update button for a live form to put the form into update mode where the user can select the related manager and department for an employee and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/LiveForm\" target=\"_blank\">Live Form Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=grid&amp;layer=basic\">Grid</a></li>\n</ul>","margin":"5","width":"100%"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}