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


PropertyPublisher.widgets = {
	propertyPublisherType: ["wm.TypeDefinition", {internal: true}, {}, {
   		widgetNameField: ["wm.TypeDefinitionField", {"fieldName": "widgetName", fieldType: "string"}],
   		widgetPropertyNameField: ["wm.TypeDefinitionField", {"fieldName": "widgetPropertyName", fieldType: "string"}],
   		wmPropertyNameField: ["wm.TypeDefinitionField", {"fieldName": "wmPropertyName", fieldType: "string"}],
   		groupNameField:  ["wm.TypeDefinitionField", {"fieldName": "groupName", fieldType: "string"}],
   		groupOrderField:  ["wm.TypeDefinitionField", {"fieldName": "groupOrder", fieldType: "string"}]
   	}],

    fullPropListVar: ["wm.Variable", {isList: true, type: "propertyPublisherType"}],
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
            mainPanel: ["wm.studio.DialogMainPanel", {layoutKind: "left-to-right"},{}, {
				mainPanelOuter: ["wm.Panel", {width: "280px", height: "100%", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		    		treeHeader: ["wm.Label", {width: "100%", caption: ""}],
		    		mainPanelInner: ["wm.Panel", {_classes: {domNode: ["StudioDarkPanel"]},width: "100%", height: "100%",  border: "1", borderColor: "#959DAB"}, {}, {
						instructionsHtml: ["wm.Html", {padding: "0,3,8,3", width: "100%", height: "40px", autoSizeHeight: true, html: "Each property selected below can be editted in the properties panel of any PageContainer that contains this page", border: "0,0,1,0", borderColor: "#959DAB"}],
						tree: ["wm.Tree", {width: "100%", height: "100%"},{oncheckboxclick: "checkboxChange", onclick: "propertySelect"}]
				    }]
				}],
				listPanelOuter: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left",margin: "0,0,0,10"}, {}, {
				    listHeader: ["wm.Label", {width: "100%", caption: "All published properties; edit order and group to organize how properties are shown in your user's property panel", singleLine:false,height:"36px"}],
				    listPanelInner: ["wm.Panel", {_classes: {domNode: ["StudioDarkPanel"]},width:"100%", height: "100%", border: "1", borderColor: "#959DAB"}, {}, {
					fullList: ["wm.DojoGrid", {_classes: {domNode: ["StudioGrid"]}, width: "100%", height: "100%", margin: "0", deleteColumn: true, singleClickEdit:true,
												columns: [{show: true,title: "Widget", field: "widgetName", width: "100%"},
														  {show: true,title: "Property", field: "widgetPropertyName", width: "100%"},
														  {show: true,title: "Group", field: "groupName", width: "100%", width: "60px","fieldType":"dojox.grid.cells._Widget"},
														  {show: true,title: "Order", field: "groupOrder", width: "100%", width: "50px","fieldType":"dojox.grid.cells.NumberTextBox","editorProps":{"restrictValues":true}}
														  ]},
					   {onRowDeleted: "listRowDeleted", onCellEdited: "onPropCellEdited"},
					   {
					       binding: ["wm.Binding", {},{}, {
						   wire: ["wm.Wire", {"source":"fullPropListVar","targetProperty":"dataSet"}, {}]

					       }]
					   }]
				}]
			}]
	    }],

	    buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, height: "20px", "horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "2,0,2,0", border: "0", height: "34px", horizontalAlign: "right"}, {}, {
		okButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK"}, {onclick: "okClick"}]
	    }]
	}]
}