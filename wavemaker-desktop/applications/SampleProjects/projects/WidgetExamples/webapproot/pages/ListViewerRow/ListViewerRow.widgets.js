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
ListViewerRow.widgets = {
	variable: ["wm.Variable", {"json":"{\"budget\":\"50\",\"deptid\":\"3\",\"q2\":\"10\",\"location\":\"Somewhere\",\"q1\":\"10\",\"deptcode\":\"ENG\",\"q4\":\"10\",\"q3\":\"10\",\"name\":\"Engineering\",\"tenantid\":\"1\",\"employees\":null}","type":"com.sampledatadb.data.Department"}, {}],
	budgetVar: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		sampleRow: ["wm.FancyPanel", {"height":"156px"}, {}, {
			panel1: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				label1Panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"141px"}, {}, {
					label1: ["wm.Label", {"height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":"\"<b>Location:</b> \" + ${variable.location}","targetProperty":"caption"}, {}]
						}]
					}],
					infoButton: ["wm.Button", {"caption":"More Info","margin":"4","width":"100%"}, {"onclick":"infoButtonClick"}]
				}],
				dojoGrid1: ["wm.DojoGrid", {"columns":[{"show":true,"field":"name","title":"Name","width":"80px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"dataValue","title":"Value","width":"100%","align":"left","formatFunc":"wm_currency_formatter","formatProps":{"round":true,"dijits":0},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Name: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>Value: \" + wm.DojoGrid.prototype.currencyFormatter({\"round\":true,\"dijits\":0}, null,null,null,${dataValue}) + \"</div>\"\n","mobileColumn":true}],"dsType":"EntryData","height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"budgetVar","targetProperty":"dataSet"}, {}]
					}]
				}]
			}],
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"variable.name","targetProperty":"title"}, {}]
			}]
		}]
	}]
}