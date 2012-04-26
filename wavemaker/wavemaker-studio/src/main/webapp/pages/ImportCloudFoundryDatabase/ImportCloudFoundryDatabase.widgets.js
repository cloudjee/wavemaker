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
	    instructions: ["wm.Html", {width: "100%", height: "30px", html: "Select a database service you have setup in CloudFoundry, or <a target='caldecott' href='http://docs.cloudfoundry.com/tools/vmc/caldecott.html'>Setup a new database service</a>"}],
	    serviceList: ["wm.List", {_classes: {domNode: ["StudioList"]}, width: "100%", height: "100%", 
				      columns:[{show:true, field: "name", width: "100%", title: "Name"},
					       {show:true, field: "vendor", width: "80px", title: "Type"},
					       {show:true, field: "meta.created", width: "80px", title: "Created", "formatFunc":"wm_date_formatter"}]}, {}, {
		binding: ["wm.Binding",{},{},{
		    wire: ["wm.Wire", {source: "serviceListVar", targetProperty: "dataSet"}]
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

		   
    