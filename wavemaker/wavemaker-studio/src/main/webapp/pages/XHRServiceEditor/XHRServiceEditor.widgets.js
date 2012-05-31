/*
 * Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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


XHRServiceEditor.widgets = {
    fixedHeadersVar: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
    inputsType: ["wm.TypeDefinition", {internal: true},{}, {
	inputNameField: ["wm.TypeDefinitionField", {fieldName: "name", fieldType: "string"}],
	inputTypeField: ["wm.TypeDefinitionField", {fieldName: "type", fieldType: "string"}],
	inputIsHeaderField: ["wm.TypeDefinitionField", {fieldName: "isHeader", fieldType: "boolean"}]
    }],
    inputsVar: ["wm.Variable", {"isList":true,"type":"inputsType"}, {}],
    layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"},{}, {
        mainPanel: ["wm.studio.DialogMainPanel", {height: "100%", autoScroll:true},{}, {
	    fancyPanel1: ["wm.FancyPanel", {"height":"190px","title":"Service Settings"}, {}, {
		formPanel1: ["wm.FormPanel", {"desktopHeight":"157px","height":"157px","type":"wm.FormPanel"}, {}, {
		    serviceName: ["wm.Text", {"caption":"Service Name","captionSize":"120px","dataValue":undefined,"desktopHeight":"26px","displayValue":"","height":"26px","helpText":"Any component name is a valid name.  To control grouping of your XHR Services, you can also use dot notation: \"vmware.com.Login\"","required":true,"width":"100%"}, {}],
		    serviceUrl: ["wm.Text", {"caption":"URL","captionSize":"120px","dataValue":undefined,"desktopHeight":"26px","displayValue":"","height":"26px","helpText":"Do not include any parameters in the url such as ?arg1=value1","required":true,"width":"100%"}, {}],
		    serviceContentType: ["wm.Text", {"caption":"Content Type","captionSize":"120px","dataValue":"application/x-www-form-urlencoded","desktopHeight":"26px","displayValue":"application/x-www-form-urlencoded","height":"26px","helpText":"Common values include<ul><li>application/x-www-form-urlencoded</li><li>application/json</li><ul>","required":true,"width":"100%"}, {}],
		    serviceRequestType: ["wm.SelectMenu", {"caption":"Request Type","captionSize":"120px","dataField":"dataValue","dataValue":"GET","desktopHeight":"26px","displayField":"dataValue","displayValue":"GET","height":"26px","options":"GET,POST,PUT,DELETE","required":true,"width":"200px"}, {}],
		    useProxyCheckbox: ["wm.Checkbox", {"caption":"useProxy","displayValue":true,"startChecked":true}, {}]
		}]
	    }],
	    fancyPanel2: ["wm.FancyPanel", {"height":"250px","title":"Fixed Headers"}, {}, {
		fixedHeadersGridPanel: ["wm.Panel", {"height":"200px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		    fixedHeadersGrid: ["wm.DojoGrid", {"columns":[{"show":true,"field":"name","title":"Header Name","width":"100%","align":"left","formatFunc":"","fieldType":"dojox.grid.cells._Widget","constraints":null,"editorProps":null,"mobileColumn":false},{"show":true,"field":"dataValue","title":"Header Value","width":"100%","align":"left","formatFunc":"","fieldType":"dojox.grid.cells._Widget","constraints":null,"editorProps":null,"mobileColumn":false}],"deleteColumn":true,"localizationStructure":{},"margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {}, {
    binding: ["wm.Binding", {}, {}, {
	wire: ["wm.Wire", {"expression":undefined,"source":"fixedHeadersVar","targetProperty":"dataSet"}, {}]
    }]
}],
		    addHeaderButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, "caption":"Add Header","desktopHeight":"58px","height":"58px","margin":"4"}, {"onclick":"fixedHeadersGrid.addEmptyRow"}]
		}]
	    }],
	    fancyPanel3: ["wm.FancyPanel", {"height":"250px","title":"Inputs"}, {}, {
		inputsGridPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		    inputsGrid: ["wm.DojoGrid", {"columns":[{"show":true,"field":"name","title":"Input Name","width":"100%","align":"left","formatFunc":"","mobileColumn":false, "fieldType": "dojox.grid.cells._Widget"},
							    {"show":true,"field":"type","title":"Type","width":"90px","align":"left","formatFunc":"","fieldType":"dojox.grid.cells.Select","mobileColumn":false},
							    {"show":true,"field":"isHeader","title":"Is Header","width":"90px","align":"left","formatFunc":"","fieldType":"dojox.grid.cells.Bool","mobileColumn":false}],
						 "deleteColumn":true,"height":"100%","margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {}, {
    binding: ["wm.Binding", {}, {}, {
	wire: ["wm.Wire", {"expression":undefined,"source":"inputsVar","targetProperty":"dataSet"}, {}]
    }]
}],
		    addInput: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, "caption":"Add Input","desktopHeight":"58px","height":"58px","margin":"4"}, {"onclick":"addInputRow"}]
		}]
	    }],
	    fancyPanel4: ["wm.FancyPanel", {"height":"350px","title":"Return Type"}, {}, {
		serviceResponseType: ["wm.prop.DataTypeSelect", {useLiterals: true, addNewOption: true, "caption":"Return Type","captionAlign":"left","dataField":"dataValue","dataValue":"","displayField":"dataValue","displayValue":"","width":"293px"}, {}],
		returnedJSONEditor: ["wm.LargeTextArea", {"caption":"Enter sample JSON response","dataValue":undefined,"displayValue":"","height":"100%","width":"100%"}, {}, {
		    binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":"${serviceResponseType.dataValue} != \"New Type\"","targetProperty":"disabled"}, {}]
		    }]
		}]
	    }]
	}],
	buttonBar: ["wm.studio.DialogButtonPanel", {showing: false}, {}, {
	    CancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel"}, {onclick: "cancelClick"}],
	    okButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},"caption":"Update Service","margin":"4","width":"172px"}, {"onclick":"okButtonClick"}]
	}]
    }]
}