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
Grid_Column.widgets = {
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		panel50: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel51: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label38: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"border":"0","caption":"Calculated Columns","padding":"4","width":"190px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel57: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel59: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
					label39: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label40: ["wm.Label", {"border":"0","caption":"<b>Directions:</b> in this example, the \"First Half\" column is a calculated column from adding together the Q1 and Q2 columns.","height":"42px","padding":"4","singleLine":false,"width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel60: ["wm.Panel", {"height":"200px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						panel61: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
						deptGrid: ["wm.DojoGrid", {"columns":[{"show":false,"id":"deptid","title":"Deptid","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":true,"id":"name","title":"Name","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"location","title":"Location","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"dojoGrid1LocationFormat"},{"show":false,"id":"budget","title":"Budget","width":"120px","displayType":"Number","noDelete":true,"align":"right","formatFunc":"wm_currency_formatter"},{"show":true,"id":"q1","title":"Q1","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":"wm_currency_formatter"},{"show":true,"id":"q2","title":"Q2","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":"wm_currency_formatter"},{"show":false,"id":"q3","title":"Q3","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":false,"id":"q4","title":"Q4","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":false,"id":"deptcode","title":"Deptcode","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"tenantid","title":"Tenantid","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"id":"customField","isCustomField":true,"expression":"${q1}+${q2}","show":true,"width":"100%","title":"First Half","formatFunc":"wm_currency_formatter","align":"right"}],"localizationStructure":{},"margin":"4"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"app.deptLiveVar","targetProperty":"dataSet"}, {}]
							}]
						}]
					}],
					label41: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel62: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
						label42: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"You selected","padding":"4","width":"82px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						gridLabel4: ["wm.Label", {"border":"0","padding":"4"}, {}, {
							format: ["wm.DataFormatter", {}, {}],
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":false,"source":"deptGrid.selectedItem.name","targetProperty":"caption"}, {}]
							}]
						}]
					}]
				}],
				panel83: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
					fancyPanel12: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel84: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html11: ["wm.Html", {"border":"0","height":"100%","html":"<p>The developer can also create calculated columns. In this example, the First Half column is the total of the Q1 column plus the Q2 column.</p>\n<p>This example shows using the Column Properties Editor of a grid widget to create custom calculated columns and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/DojoGrid\" target=\"_blank\">DojoGrid</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\">Select Menu</a></li>\n</ul>","margin":"5","width":"100%"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}