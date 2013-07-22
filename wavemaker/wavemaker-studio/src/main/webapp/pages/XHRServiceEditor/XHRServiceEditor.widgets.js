/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
    inputsType: ["wm.TypeDefinition", {internal: true},{}, {
    	inputNameField: ["wm.TypeDefinitionField", {fieldName: "name", fieldType: "string"}],
    	inputTypeField: ["wm.TypeDefinitionField", {fieldName: "type", fieldType: "string"}],
    	inputTransmitField: ["wm.TypeDefinitionField", {fieldName: "transmitType", fieldType: "string"}], // "header", "queryString", "path"
    	inputDefaultValue: ["wm.TypeDefinitionField", {fieldName: "defaultValue", fieldType: "string"}],
    	inputNoescapeParam:["wm.TypeDefinitionField", {fieldName: "noEscape", fieldType: "boolean"}],
    	inputHidden: ["wm.TypeDefinitionField", {fieldName: "hidden", fieldType: "boolean"}]
    }],
    inputsVar: ["wm.Variable", {"isList":true,"type":"inputsType"}, {}],
    inputsPathVar: ["wm.Variable", {"isList":true,"type":"inputsType"}, {}],
    inputsHeaderVar: ["wm.Variable", {"isList":true,"type":"inputsType"}, {}],
    layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"},{}, {
        toolbar: ["wm.Panel", {_classes: {domNode:["StudioToolBar"]}, showing: false, border: "0", height: "29px", width: "100%", layoutKind: "left-to-right", border: "0,0,1,0", borderColor: "#959DAB"}, {}, {
                toolbarBtnHolder: ["wm.Panel", {imageList: "smallToolbarImageList", border: "0", height: "100%", layoutKind: "left-to-right", width: "100%", padding: "0,4", horizontalAlign: "left", verticalAlign: "top"}, {}, {
                    saveQueryBtn: ["wm.studio.ToolbarButton", {imageIndex: 8, hint: "Save"}, {onclick: "okButtonClick"}],
                    delQueryBtn: ["wm.studio.ToolbarButton", {imageIndex: 0, hint: "Delete"}, {onclick: "onDeleteClick"}]
                }]
            }],
            mainPanel: ["wm.studio.DialogMainPanel", {height: "100%", autoScroll: true, border: "0"}, {}, {
        	    fancyPanel1: ["wm.FancyPanel", {"height":"190px","title": "Service Settings"}, {}, {
            		formPanel1: ["wm.FormPanel", {"desktopHeight":"157px","height":"157px","type":"wm.FormPanel"}, {}, {
            		    serviceName: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, "caption":"Service Name","captionSize":"120px","dataValue":undefined,"desktopHeight":"26px","displayValue":"","height":"26px","helpText":"Any component name is a valid name.  To control grouping of your XHR Services, you can also use dot notation: \"vmware.com.Login\"","required":true,"width":"100%"}, {onchange: "changed"}],
            		    serviceUrl: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, "caption":"URL","captionSize":"120px","dataValue":undefined,"desktopHeight":"26px","displayValue":"","height":"26px","helpText":"Do not include any parameters in the url such as ?arg1=value1","required":true,"width":"100%", changeOnKey:0}, {onchange: "regeneratePathGrid", onchange1: "updateUrl", onchange2: "changed"}],
            		    serviceContentType: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, "caption":"Content Type","captionSize":"120px","dataValue":"application/x-www-form-urlencoded","desktopHeight":"26px","displayValue":"application/x-www-form-urlencoded","height":"26px","helpText":"Common values include<ul><li>application/x-www-form-urlencoded</li><li>application/json</li><ul>","required":true,"width":"100%"}, {onchange: "changed"}],
            		    serviceRequestType: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, "caption":"Request Type","captionSize":"120px","dataField":"dataValue","dataValue":"GET","desktopHeight":"26px","displayField":"dataValue","displayValue":"GET","height":"26px","options":"GET,POST,PUT,DELETE","required":true,"width":"200px"}, {onchange: "changed"}],
            		    useProxyCheckbox: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]}, "caption":"useProxy","displayValue":true,"startChecked":true}, {onchange: "changed"}],
                        actualUrl: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, width: "100%", captionSize: "120px", readonly:1, caption: "Actual URL"}]
            		}]
        	    }],
                mainInnerPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left"}, {}, {
                    inputsFancyPanel: ["wm.FancyPanel", {width: "100%", height: "400px", title: "Service Inputs"}, {}, {
                    	tabs: ["wm.studio.TabLayers", {width: "100%", height: "100%", _classes: {domNode: ["StudioTabs", "StudioDarkLayers","NoRightMarginOnTab","StudioDarkerLayers"]}, clientBorder: "1,0,0,1"},{}, {
                    		pathLayer: ["wm.Layer", {caption: "Path Inputs"}, {}, {
            				    pathLabel: ["wm.Html", {autoScroll:1,height:"100px",width: "100%", padding:"10",
            				                            html: "<div class='wmXhrRequestParts'><li><b>Domain</b>: http://dev.wavemaker.com</li><li><b>Path</b>: /forums/search/</li><li><b>Query String</b>: ?q=my+search+term&format=json&...</li></div>" +
            				                                     "<div class='wmXhrInstructionsHeader'>Instructions</div>" +
            				                                     "<div class='wmXhrInstructionsBody'><p>This grid shows all inputs to the <b>Path</b> portion of your URL.</p>"+
            				                                     "<p>To add an input to your <b>Path</b> to this grid so that it can be changed dynamically, bracket terms in your <b>Path</b> with ${...}.</p>" +
            				                                     "<p>For example: dev.wavemaker.com/search/${searchWhere}/ will add searchWhere to the grid below and it will become an input to your Service Variables.</p>"}],
            				    pathInputsGrid: ["wm.DojoGrid", {_classes: {domNode: ["StudioGrid"]}, "columns":[
            				    	{"show":true,"field":"name","title":"Input Name","width":"100%","align":"left","formatFunc":"","mobileColumn":false},
            						{"show":true,"field":"type","title":"Type","width":"90px","align":"left","formatFunc":"","fieldType":"dojox.grid.cells.ComboBox","mobileColumn":false},
            						{"show":true,"field":"defaultValue","title":"Default Value","width":"100%","align":"left","formatFunc":"","mobileColumn":false, "fieldType": "dojox.grid.cells._Widget"}
            					],
            					"height":"100%","margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {onCellEdited: "updateUrl", onCellEdited1: "changed"}, {
            					    binding: ["wm.Binding", {}, {}, {
            							wire: ["wm.Wire", {"expression":undefined,"source":"inputsPathVar","targetProperty":"dataSet"}, {}]
            					    }]
            					}]
                    		}],
                    		headerLayer: ["wm.Layer", {caption: "Header Inputs", verticalAlign: "top", horizontalAlign: "right"}, {}, {
            					 headerLabel: ["wm.Html", {autoScroll:1,height:"100px",width: "100%", padding:"10",
        				                            html:    "<div class='wmXhrInstructionsHeader'>Instructions</div>" +
        				                                     "<div class='wmXhrInstructionsBody'><p>This grid shows all custom headers (except content-type which is set in 'Service Settings' above).</p>"+
        				                                     "<p>Mark an input as 'Not shown in SVar' if you don't want this to show up as an input in your Service Variables.</p>" +
        				                                     "<p>Default Values are what are sent for both hidden inputs, and any non-hidden input for which the Service Variable has no value.</p>"}],
            					 
            					 headerInputsGrid: ["wm.DojoGrid", {_classes: {domNode: ["StudioGrid"]}, "columns":[
            				    	{"show":true,"field":"name","title":"Header Name","width":"100%","align":"left","formatFunc":"","mobileColumn":false,"fieldType": "dojox.grid.cells._Widget"},
            						{"show":true,"field":"type","title":"Type","width":"90px","align":"left","formatFunc":"","fieldType":"dojox.grid.cells.ComboBox","mobileColumn":false},
            						{"show":true,"field":"defaultValue","title":"Default Value","width":"100%","align":"left","formatFunc":"","mobileColumn":false, "fieldType": "dojox.grid.cells._Widget"},
            						{"show":true,"field":"hidden","title":"Not shown in SVar","width":"100px","align":"left","formatFunc":"","mobileColumn":false, "fieldType": "dojox.grid.cells.Bool"}
            					],
            					"height":"100%","margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {onCellEdited: "updateUrl", onCellEdited1: "changed"}, {
            					    binding: ["wm.Binding", {}, {}, {
            							wire: ["wm.Wire", {"expression":undefined,"source":"inputsHeaderVar","targetProperty":"dataSet"}, {}]
            					    }]
            					}],
            					addHeaderButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, "caption":"Add Header",width: "180px", "height":"48px","margin":"4"}, {"onclick":"addHeaderButtonClick"}]
                    		}],
                    		queryLayer: ["wm.Layer", {caption: "Query String Inputs", verticalAlign: "top", horizontalAlign: "right"}, {}, {
            				    queryLabel: ["wm.Html", {autoScroll:1,height:"100px",width: "100%", padding:"10",
            				                            html: "<div class='wmXhrRequestParts'><li><b>Domain</b>: http://dev.wavemaker.com</li><li><b>Path</b>: /forums/search/</li><li><b>Query String</b>: ?q=my+search+term&format=json&...</li></div>" +
            				                                     "<div class='wmXhrInstructionsHeader'>Instructions</div>" +
            				                                     "<div class='wmXhrInstructionsBody'><p>This grid shows all inputs to the <b>Query String</b> portion of your URL.</p>"+
            				                                     "<p>Mark an input as 'Not shown in SVar' if you don't want this to show up as an input in your Service Variables.</p>" +
            				                                     "<p>Default Values are what are sent for both hidden inputs, and any non-hidden input for which the Service Variable has no value.</p>" +
            				                                     "<p>'Do not encode' option only applies to GET requests; it prevents the encoding of the value before sending it to the server.</p>"}],
            				    inputsGrid: ["wm.DojoGrid", {_classes: {domNode: ["StudioGrid"]}, "columns":[
            				    	{"show":true,"field":"name","title":"Input Name","width":"100%","align":"left","formatFunc":"","mobileColumn":false, "fieldType": "dojox.grid.cells._Widget"},
            						{"show":true,"field":"type","title":"Type","width":"90px","align":"left","formatFunc":"","fieldType":"dojox.grid.cells.ComboBox","mobileColumn":false},
            						{"show":true,"field":"defaultValue","title":"Default Value","width":"100%","align":"left","formatFunc":"","mobileColumn":false, "fieldType": "dojox.grid.cells._Widget"},
            						{"show":true,"field":"noEscape","title":"Do not encode value","width":"120px","align":"left","formatFunc":"","mobileColumn":false, "fieldType": "dojox.grid.cells.Bool"},
            						{"show":true,"field":"hidden","title":"Not shown in SVar","width":"100px","align":"left","formatFunc":"","mobileColumn":false, "fieldType": "dojox.grid.cells.Bool"}
            						],
            						 "deleteColumn":true,"height":"100%","margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {onCellEdited: "updateUrl", onCellEdited1: "changed"}, {
            					    binding: ["wm.Binding", {}, {}, {
            							wire: ["wm.Wire", {"expression":undefined,"source":"inputsVar","targetProperty":"dataSet"}, {}]
            					    }]
            					}],
            					addInput: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, "caption":"Add Input",width: "180px", "height":"48px","margin":"4"}, {"onclick":"addInputRow"}]
                    		}]
                    	}]
                    }],
                	responsePanel: ["wm.FancyPanel", {width:"100%", height:"350px", title: "Service Response"}, {}, {
        				serviceResponseType: ["wm.prop.DataTypeSelect", {_classes: {domNode: ["StudioEditor"]}, useLiterals: true, addNewOption: true, "caption":"Return Type","captionAlign":"left","dataField":"dataValue","dataValue":"","displayField":"dataValue","displayValue":"","width":"293px"}, {onchange: "changed"}],
        				returndJSONPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom"}, {}, {
        					binding: ["wm.Binding", {}, {}, {
        						wire: ["wm.Wire", {"expression":"${serviceResponseType.dataValue} == \"New Type\"","targetProperty":"showing"}, {}]
        				    }],
        					returnedJSONLabel: ["wm.Label", {_classes: {domNode: ["StudioLabel"]}, "caption":"Enter sample JSON response", width: "100%"}],
        					returnedJSONEditor: ["wm.AceEditor", {_classes: {domNode: ["StudioEditor"]}, syntax: "json","dataValue":"","height":"100%","width":"100%"}, {}, {}]
        				}]
            		}]	    
        	    }]
        	}]
    }]
}
