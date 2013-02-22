/*
 * Copyright (C) 2011-2013 VMware, Inc. All rights reserved.
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
    smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
    fixedHeadersVar: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
    inputsType: ["wm.TypeDefinition", {internal: true},{}, {
    	inputNameField: ["wm.TypeDefinitionField", {fieldName: "name", fieldType: "string"}],
    	inputTypeField: ["wm.TypeDefinitionField", {fieldName: "type", fieldType: "string"}],
    	inputTransmitField: ["wm.TypeDefinitionField", {fieldName: "transmitType", fieldType: "string"}] // "header", "queryString", "path"
    }],
    inputsVar: ["wm.Variable", {"isList":true,"type":"inputsType"}, {}],
    layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"},{}, {
        toolbar: ["wm.Panel", {_classes: {domNode:["StudioToolBar"]}, showing: false, border: "0", height: "29px", width: "100%", layoutKind: "left-to-right", border: "0,0,1,0", borderColor: "#959DAB"}, {}, {
                toolbarBtnHolder: ["wm.Panel", {imageList: "smallToolbarImageList", border: "0", height: "100%", layoutKind: "left-to-right", width: "100%", padding: "0,4", horizontalAlign: "left", verticalAlign: "top"}, {}, {
                    saveQueryBtn: ["wm.studio.ToolbarButton", {imageIndex: 8, hint: "Save"}, {onclick: "okButtonClick"}],
                    delQueryBtn: ["wm.studio.ToolbarButton", {imageIndex: 0, hint: "Delete"}, {onclick: "onDeleteClick"}]
                }]
            }],
        mainPanel: ["wm.studio.DialogMainPanel", {height: "100%", autoScroll:false, border: "0"},{}, {
	    fancyPanel1: ["wm.FancyPanel", {"height":"190px","title":"Service Settings"}, {}, {
    		formPanel1: ["wm.FormPanel", {"desktopHeight":"157px","height":"157px","type":"wm.FormPanel"}, {}, {
    		    serviceName: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, "caption":"Service Name","captionSize":"120px","dataValue":undefined,"desktopHeight":"26px","displayValue":"","height":"26px","helpText":"Any component name is a valid name.  To control grouping of your XHR Services, you can also use dot notation: \"vmware.com.Login\"","required":true,"width":"100%"}, {onchange: "changed"}],
    		    serviceUrl: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, "caption":"URL","captionSize":"120px","dataValue":undefined,"desktopHeight":"26px","displayValue":"","height":"26px","helpText":"Do not include any parameters in the url such as ?arg1=value1","required":true,"width":"100%", changeOnKey:1, regExp: "[^?{}]*", invalidMessage: "No ?, { or } characters allowed"}, {onchange: "updateUrl", onchange1: "changed"}],
    		    serviceContentType: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, "caption":"Content Type","captionSize":"120px","dataValue":"application/x-www-form-urlencoded","desktopHeight":"26px","displayValue":"application/x-www-form-urlencoded","height":"26px","helpText":"Common values include<ul><li>application/x-www-form-urlencoded</li><li>application/json</li><ul>","required":true,"width":"100%"}, {onchange: "changed"}],
    		    serviceRequestType: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, "caption":"Request Type","captionSize":"120px","dataField":"dataValue","dataValue":"GET","desktopHeight":"26px","displayField":"dataValue","displayValue":"GET","height":"26px","options":"GET,POST,PUT,DELETE","required":true,"width":"200px"}, {onchange: "changed"}],
    		    useProxyCheckbox: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]}, "caption":"useProxy","displayValue":true,"startChecked":true}, {onchange: "changed"}],
                actualUrl: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, width: "100%", captionSize: "120px", readonly:1, caption: "Actual URL"}]
    		}]
	    }],
        mainInnerPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left", autoScroll: true}, {}, {
	    fancyPanel2: ["wm.FancyPanel", {"height":"250px","title":"Fixed Headers"}, {}, {
		fixedHeadersGridPanel: ["wm.Panel", {"height":"200px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		    fixedHeadersGrid: ["wm.DojoGrid", {_classes: {domNode: ["StudioGrid"]}, "columns":[{"show":true,"field":"name","title":"Header Name","width":"100%","align":"left","formatFunc":"","fieldType":"dojox.grid.cells._Widget","constraints":null,"editorProps":null,"mobileColumn":false},{"show":true,"field":"dataValue","title":"Header Value","width":"100%","align":"left","formatFunc":"","fieldType":"dojox.grid.cells._Widget","constraints":null,"editorProps":null,"mobileColumn":false}],"deleteColumn":true,"localizationStructure":{},"margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {onCellEdited: "changed"}, {
    binding: ["wm.Binding", {}, {}, {
	wire: ["wm.Wire", {"expression":undefined,"source":"fixedHeadersVar","targetProperty":"dataSet"}, {}]
    }]
}],
		    addHeaderButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, "caption":"Add Header","desktopHeight":"58px","height":"58px","margin":"4"}, {"onclick":"fixedHeadersGrid.addEmptyRow"}]
		}]
	    }],
	    fancyPanel3: ["wm.FancyPanel", {"height":"250px","title":"Inputs"}, {}, {
		inputsGridPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		    inputsGrid: ["wm.DojoGrid", {_classes: {domNode: ["StudioGrid"]}, "columns":[{"show":true,"field":"name","title":"Input Name","width":"100%","align":"left","formatFunc":"","mobileColumn":false, "fieldType": "dojox.grid.cells._Widget"},
							    {"show":true,"field":"type","title":"Type","width":"90px","align":"left","formatFunc":"","fieldType":"dojox.grid.cells.ComboBox","mobileColumn":false},
							    {"show":true,"field":"transmitType","title":"Input Type","width":"90px","align":"left","formatFunc":"","fieldType":"dojox.grid.cells.ComboBox","mobileColumn":false, "editorProps":{"options":"queryString,header,path", isSimpleType:true, displayField: "transmitType"}}],
						 "deleteColumn":true,"height":"100%","margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {onCellEdited: "updateUrl", onCellEdited1: "changed"}, {
    binding: ["wm.Binding", {}, {}, {
	wire: ["wm.Wire", {"expression":undefined,"source":"inputsVar","targetProperty":"dataSet"}, {}]
    }]
}],
		    addInput: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, "caption":"Add Input","desktopHeight":"58px","height":"58px","margin":"4"}, {"onclick":"addInputRow"}]
		}]
	    }],
	    fancyPanel4: ["wm.FancyPanel", {"height":"350px","title":"Return Type"}, {}, {
		serviceResponseType: ["wm.prop.DataTypeSelect", {_classes: {domNode: ["StudioEditor"]}, useLiterals: true, addNewOption: true, "caption":"Return Type","captionAlign":"left","dataField":"dataValue","dataValue":"","displayField":"dataValue","displayValue":"","width":"293px"}, {onchange: "changed"}],
		returnedJSONLabel: ["wm.Label", {_classes: {domNode: ["StudioLabel"]}, "caption":"Enter sample JSON response", width: "100%"}],
		returnedJSONEditor: ["wm.AceEditor", {_classes: {domNode: ["StudioEditor"]}, syntax: "json","dataValue":"","height":"100%","width":"100%"}, {}, {
		    binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":"${serviceResponseType.dataValue} == \"New Type\"","targetProperty":"showing"}, {}]
		    }]
		}]
	    }]
	}]/*,
	buttonBar: ["wm.studio.DialogButtonPanel", {showing: false}, {}, {
	    CancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel"}, {onclick: "cancelClick"}],
	    okButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},"caption":"Update Service","margin":"4","width":"172px"}, {"onclick":"okButtonClick"}]
	}]*/
    }]
}]
}