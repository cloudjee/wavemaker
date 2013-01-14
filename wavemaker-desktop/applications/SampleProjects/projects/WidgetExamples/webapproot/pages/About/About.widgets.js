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
About.widgets = {
	developerList: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"Chris Keene\",\"dataValue\":\"Created the first version of this project for WaveMaker 6.3, and provided the core demos, concepts and layouts\"},{\"name\":\"Michael Kantor\",\"dataValue\":\"Updated the demo for WaveMaker 6.5\"}]","type":"EntryData"}, {}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		html1: ["wm.Html", {"autoSizeHeight":true,"height":"46px","html":"This application demonstrates how to use WaveMaker widgets and data services. WaveMaker makes it easy to build a complete web application with minimal coding.","margin":"10","minDesktopHeight":15}, {}],
		dojoGrid1: ["wm.DojoGrid", {"columns":[{"show":true,"field":"name","title":"Developer","width":"120px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"dataValue","title":"Contributions","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Developer: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>Contributions: \" + ${dataValue} + \"</div>\"\n","mobileColumn":true}],"height":"118px","margin":"4","minDesktopHeight":60,"singleClickEdit":true,"width":"1000px"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"developerList","targetProperty":"dataSet"}, {}]
			}]
		}]
	}]
}