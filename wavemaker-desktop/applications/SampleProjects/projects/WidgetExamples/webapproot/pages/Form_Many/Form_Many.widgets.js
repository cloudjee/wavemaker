/*
 *  Copyright (C) 2013 VMware, Inc. All rights reserved.
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
Form_Many.widgets = {
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel36: ["wm.Panel", {"height":"600px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel37: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label22: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"caption":"One To Many Relationship","padding":"4","width":"317px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel38: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel40: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"verticalAlign":"top","width":"100%"}, {}, {
					label28: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label23: ["wm.Label", {"caption":"<b>Directions:</b> select an employee to see the vacations for that employee, each employee can have zero to many related vacations.","height":"34px","padding":"4","singleLine":false,"width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel41: ["wm.Panel", {"height":"200px","horizontalAlign":"left","margin":"0,0,0,0","verticalAlign":"top","width":"100%"}, {}, {
						empGrid: ["wm.DojoGrid", {"columns":[{"show":false,"title":"Tenantid","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":"","field":"tenantid"},{"show":false,"title":"Eid","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":"","field":"eid"},{"show":true,"title":"Firstname","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"firstname"},{"show":true,"title":"Lastname","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"lastname"},{"show":false,"title":"Street","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"street"},{"show":true,"title":"City","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"city"},{"show":false,"title":"State","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"state"},{"show":false,"title":"Zip","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"zip"},{"show":true,"title":"Birthdate","width":"80px","displayType":"Date","noDelete":true,"align":"left","formatFunc":"wm_date_formatter","field":"birthdate"},{"show":false,"title":"Picurl","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"picurl"},{"show":false,"title":"Twitterid","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"twitterid"},{"mobileColumn":true,"align":"left","field":"PHONE COLUMN","show":false,"title":"-","width":"100%","expression":"'<div class=\"MobileRowTitle\">Tenantid: ' + ${tenantid} + '</div>'"}],"localizationStructure":{},"margin":"4","minDesktopHeight":60,"selectFirstRow":true}, {"onClick":"vacationLiveVar"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"app.empLiveVar","targetProperty":"dataSet"}, {}]
							}]
						}]
					}],
					label31: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label1: ["wm.Label", {"caption":"View one-to-many relationships","padding":"4","width":"100%"}, {}],
					tabLayers1: ["wm.TabLayers", {}, {}, {
						layer1: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Vacations","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
							label35: ["wm.Label", {"caption":"Vacations taken by this employee","padding":"4","singleLine":false,"width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							dojoGrid2Panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								vacationsGrid: ["wm.DojoGrid", {"columns":[{"show":false,"title":"Id","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":"","field":"id"},{"show":true,"title":"Startdate","width":"80px","displayType":"Date","noDelete":true,"align":"left","formatFunc":"wm_date_formatter","field":"startdate"},{"show":true,"title":"Enddate","width":"80px","displayType":"Date","noDelete":true,"align":"left","formatFunc":"wm_date_formatter","field":"enddate"},{"show":false,"title":"Tenantid","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":"","field":"tenantid"},{"mobileColumn":true,"align":"left","field":"PHONE COLUMN","show":false,"title":"-","width":"100%","expression":"'<div class=\"MobileRowTitle\">Id: ' + ${id} + '</div>'"}],"height":"100%","margin":"4","minDesktopHeight":60,"width":"187px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"empGrid.selectedItem.vacations","targetProperty":"dataSet"}, {}]
									}]
								}],
								liveForm1: ["wm.LiveForm", {"fitToContentHeight":true,"height":"105px","horizontalAlign":"left","liveEditing":false,"verticalAlign":"top"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"vacationsGrid.selectedItem","targetProperty":"dataSet"}, {}]
									}],
									idEditor1: ["wm.Number", {"caption":"Id","captionSize":"140px","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"id","height":"35px","readonly":true,"required":true,"width":"100%"}, {}],
									startdateEditor1: ["wm.DateTime", {"caption":"Startdate","captionSize":"140px","dateMode":"Date","desktopHeight":"26px","emptyValue":"zero","formField":"startdate","height":"35px","width":"100%"}, {}],
									enddateEditor1: ["wm.DateTime", {"caption":"Enddate","captionSize":"140px","dateMode":"Date","desktopHeight":"26px","emptyValue":"zero","formField":"enddate","height":"35px","width":"100%"}, {}]
								}]
							}]
						}],
						layer2: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Manages","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
							label36: ["wm.Label", {"caption":"Employees who are managed by this employee","padding":"4","singleLine":false,"width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							panel1: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								managesGrid: ["wm.DojoGrid", {"columns":[{"show":false,"field":"eid","title":"Eid","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"firstname","title":"Firstname","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"lastname","title":"Lastname","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"street","title":"Street","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"city","title":"City","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"state","title":"State","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"zip","title":"Zip","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"birthdate","title":"Birthdate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"picurl","title":"Picurl","width":"100%","align":"left","formatFunc":"dojoGrid4PicurlFormat","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"twitterid","title":"Twitterid","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"tenantid","title":"Tenantid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Lastname: \" + ${lastname} + \"</div>\"\n","mobileColumn":true}],"height":"100%","margin":"4","minDesktopHeight":60,"width":"150px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"empGrid.selectedItem.employees","targetProperty":"dataSet"}, {}]
									}]
								}],
								liveForm2: ["wm.LiveForm", {"autoScroll":true,"height":"100%","horizontalAlign":"left","liveEditing":false,"verticalAlign":"top"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"managesGrid.selectedItem","targetProperty":"dataSet"}, {}]
									}],
									eidEditor1: ["wm.Number", {"caption":"Eid","captionSize":"140px","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"eid","height":"35px","readonly":true,"required":true,"width":"100%"}, {}],
									firstnameEditor1: ["wm.Text", {"caption":"Firstname","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"firstname","height":"35px","width":"100%"}, {}],
									lastnameEditor1: ["wm.Text", {"caption":"Lastname","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"lastname","height":"35px","width":"100%"}, {}],
									streetEditor1: ["wm.Text", {"caption":"Street","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"street","height":"35px","width":"100%"}, {}],
									cityEditor1: ["wm.Text", {"caption":"City","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"city","height":"35px","width":"100%"}, {}],
									stateEditor1: ["wm.Text", {"caption":"State","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"state","height":"35px","width":"100%"}, {}],
									zipEditor1: ["wm.Text", {"caption":"Zip","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"zip","height":"35px","width":"100%"}, {}],
									birthdateEditor1: ["wm.DateTime", {"caption":"Birthdate","captionSize":"140px","dateMode":"Date","desktopHeight":"26px","emptyValue":"zero","formField":"birthdate","height":"35px","width":"100%"}, {}],
									picurlEditor1: ["wm.Text", {"caption":"Picurl","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"picurl","height":"35px","width":"100%"}, {}],
									twitteridEditor1: ["wm.Text", {"caption":"Twitterid","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"twitterid","height":"35px","width":"100%"}, {}]
								}]
							}]
						}]
					}]
				}],
				panel78: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
					fancyPanel10: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel79: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html9: ["wm.Html", {"height":"100%","html":"Form widgets provide an easy way to input data into a database. Supported features include<br>\n<ul>\n<li>Automatic validation of form fields</li>\n<li>Create, Update, Delete database records from form</li>\n<li>Manage required fields and required relationships</li>\n</ul>\n<p>This example shows onSelected event for a grid to display the related vacations and employees managed by the selected employee and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/LiveForm\" target=\"_blank\">Live Form Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=grid&amp;layer=basic\">Grid</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}