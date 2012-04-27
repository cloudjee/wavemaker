/*
 * Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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

ImportCloudFoundryDatabase.widgets = {
    "wm.studio.CloudFoundryService": ["wm.TypeDefinition", {}, {}, {
	meta: ["wm.TypeDefinitionField", {"fieldName":"meta","fieldType":"wm.studio.CloudFoundryService.meta"}, {}],
	name: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
	tier: ["wm.TypeDefinitionField", {"fieldName":"tier"}, {}],
	type: ["wm.TypeDefinitionField", {"fieldName":"type"}, {}],
	vendor: ["wm.TypeDefinitionField", {"fieldName":"vendor"}, {}],
	version: ["wm.TypeDefinitionField", {"fieldName":"version"}, {}]
    }], 
    "wm.studio.CloudFoundryService.meta": ["wm.TypeDefinition", {}, {}, {
	created: ["wm.TypeDefinitionField", {"fieldName":"created","fieldType":"Number"}, {}],
	version: ["wm.TypeDefinitionField", {"fieldName":"version","fieldType":"Number"}, {}]
    }],
    cloudFoundryService: ["wm.JsonRpcService", {service: "cloudFoundryService", sync: true}, {}],
    serviceListVar: ["wm.Variable", {type: "wm.studio.CloudFoundryService", isList:true}],
    layoutBox1: ["wm.Layout", {height: "100%", width: "100%"}, {}, {
        mainPanel: ["wm.studio.DialogMainPanel", {},{}, {
	    tabs: ["wm.TabLayers", {_classes: {domNode: ["StudioTabs", "TransparentTabBar", "StudioDarkLayers","NoRightMarginOnTab"]}, height: "100%",clientBorder: "1",clientBorderColor: "#959DAB"}, {}, {
		layer1: ["wm.Layer", {caption: "Basic Options", layoutKind: "top-to-bottom", horizontalAlign: "left", verticalAlign: "middle", padding: "10"}, {}, {
		    instructions: ["wm.Html", {width: "100%", height: "30px", html: "Select a database service you have setup in CloudFoundry, or <a target='caldecott' href='http://docs.cloudfoundry.com/tools/vmc/caldecott.html'>Setup a new database service</a>"}],
		    serviceList: ["wm.List", {_classes: {domNode: ["StudioList"]}, width: "100%", height: "100%", 
					      columns:[{show:true, field: "name", width: "100%", title: "Name"},
						       {show:true, field: "vendor", width: "80px", title: "Type"},
						       {show:true, field: "meta.created", width: "80px", title: "Created", "formatFunc":"wm_date_formatter"}]}, 
				  {onSelect: "selectedServiceChange"}, {
							   binding: ["wm.Binding",{},{},{
							       wire: ["wm.Wire", {source: "serviceListVar", targetProperty: "dataSet"}]
							   }]
						       }]
		}],
		layer2: ["wm.Layer", {caption: "Advanced Options", layoutKind: "top-to-bottom", horizontalAlign: "left", verticalAlign: "middle", padding: "10"}, {}, {
		    serviceNameInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Service Name", width: "100%", border: "0", emptyValue: "emptyString", helpText: "The service name is the name that is added to your service tree, and the name your ServiceVariables will use"}, {onchange: "serviceNameChanged", changeOnKey: true, onEnterKeyPress: "importBtnClick"}],
		    packageInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Java Package", width: "100%", border: "0", emptyValue: "emptyString", helpText: "WaveMaker Studio generates Java classes for you when you import a database. If you want a different Java package name than the default name we generate, type it in here."}, {onEnterKeyPress: "importBtnClick"}],
		    tablePatternInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Table Filter", width: "100%", border: "0", emptyValue: "emptyString", helpText: "By default WaveMaker Studio imports all the tables in the database. If you want to import only a subset of the tables, type in a comma-delimited list of regular expressions here."}, {onEnterKeyPress: "importBtnClick"}],
		    schemaPatternInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Schema Filter", width: "100%", border: "0", emptyValue: "emptyString",helpText: "When you are importing a database that supports schemas, WaveMaker Studio imports only the tables for the default schema. If you want to import tables from other schemas, add the schema names in this field."}, {onEnterKeyPress: "importBtnClick"}],
		    revengNamingStrategyInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Naming Strategy", width: "100%", border: "0", emptyValue: "emptyString", helpText: "Most users should leave this blank.  Enter the name of a java class you created for handling the naming strategy."}, {onEnterKeyPress: "importBtnClick"}],
		    dumpEditor: ["wm.Text", {showing: false}]
		}]
	    }]
	}],
	footer: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
		importBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Import", width: "96px", hint: "Import Database"}, {onclick: "importBtnClick"}, {
		    binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {targetProperty: "disabled", source: "panel1.invalid"}]
		    }]
		}],
		cancelBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Close", width: "96px"}, {onclick: "cancelBtnClick"}]
	}]

    }]
}

		   
    