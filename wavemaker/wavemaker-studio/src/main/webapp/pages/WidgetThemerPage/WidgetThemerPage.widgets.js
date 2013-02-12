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
WidgetThemerPage.widgets = {
    sampleDataSet: ["wm.Variable", {type: "EntryData", isList: true, json:"[{name: 'Sunday', dataValue: 0},{name: 'Monday', dataValue: 1},{name: 'Tuesday', dataValue: 2},{name: 'Wednesday', dataValue: 3},{name: 'Thursday', dataValue: 4},{name: 'Friday', dataValue: 5},{name: 'Saturday', dataValue: 6}]"}],
	widgetListTypeDef: ["wm.TypeDefinition", {internal:1},{},{
		widgetListTypeDefField1: ["wm.TypeDefinitionField", {fieldName: "name", type: "String"}],
		widgetListTypeDefField2: ["wm.TypeDefinitionField", {fieldName: "templateFile", type: "String"}],
		widgetListTypeDefField3: ["wm.TypeDefinitionField", {fieldName: "classList", isList: true, type: "StringData"}],
		widgetListTypeDefField4: ["wm.TypeDefinitionField", {fieldName: "category", type: "Boolean"}],
		widgetListTypeDefField5: ["wm.TypeDefinitionField", {fieldName: "parentName", type: "String"}],
		widgetListTypeDefField6: ["wm.TypeDefinitionField", {fieldName: "customWidgetAddClass", type: "String"}],
		widgetListTypeDefField7: ["wm.TypeDefinitionField", {fieldName: "hide", type: "Boolean"}],
		widgetListTypeDefField8: ["wm.TypeDefinitionField", {fieldName: "customProps", type: "any"}]
	}],
	templateListVar: ["wm.Variable", {"isList":true,"type":"widgetListTypeDef"}, {}],
	parentClassListVar: ["wm.Variable", {"isList":true,"type":"widgetListTypeDef"}, {}],
    themeListVar: ["wm.Variable", {type: "themeListType"}, {}, {
                binding: ["wm.Binding", {}, {}, {
        			wire: ["wm.Wire", {"source":"studio.themesListVar","targetProperty":"dataSet"}, {}]
        		}]
    }],
    currentClassListVar: ["wm.Variable", {type: "StringData", isList:1},{}, {
                binding: ["wm.Binding", {}, {}, {
        			wire: ["wm.Wire", {"source":"parentClassSelect.selectedItem.classList","targetProperty":"dataSet"}, {}]
        		}]
    }],
    fontFaceVar: ["wm.Variable", {type: "StringData", isList: 1, json: "[{dataValue: 'Georgia, serif'}, {dataValue: '\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif'}, {dataValue: '\"Times New Roman\", Times, serif'}, {dataValue: 'Arial, Helvetica, sans-serif'}, {dataValue: '\"Arial Black\", Gadget, sans-serif'}, {dataValue: '\"Comic Sans MS\", cursive, sans-serif'}, {dataValue: 'Impact, Charcoal, sans-serif'}, {dataValue: '\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif'}, {dataValue: 'Tahoma, Geneva, sans-serif'}, {dataValue: '\"Trebuchet MS\", Helvetica, sans-serif'}, {dataValue: 'Verdana, Geneva, sans-serif'}, {dataValue: '\"Courier New\", Courier, monospace'}, {dataValue: '\"Lucida Console\", Monaco, monospace'}]"}],
    customClassDialog: ["wm.DesignableDialog", {_classes: {domNode: ["studiodialog"]}, title: "Add Custom Widget Style", "height":"220px","width":"500px","containerWidgetId":"containerWidget","buttonBarId":"buttonBar"}, {}, {
    	containerWidget: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","padding":"5","verticalAlign":"top","width":"100%"}, {"onEnterKeyPress": "customClassOKButtonClick"}, {
    		newCustomClassNameEditor: ["wm.Text", {emptyValue: "emptyString", "caption":"Name of Class","captionAlign":"left","captionPosition":"left","captionSize":"150px","dataValue":undefined,"displayValue":"","width":"100%", changeOnKey: true}, {onchange: "subclassNameChange"}],
    		parentClassSelect: ["wm.SelectMenu", {emptyValue: "emptyString", dataField: "name", displayField: "name", "caption":"Select Parent Class","captionAlign":"left","captionPosition":"left","captionSize":"150px","dataValue":undefined,"displayValue":"","width":"100%"}, {onchange: "parentClassSelectChange"}, {
                binding: ["wm.Binding", {}, {}, {
        			wire: ["wm.Wire", {"source":"parentClassListVar","targetProperty":"dataSet"}, {}]
        		}]
    		}],
    		subclassCheckboxSet: ["wm.CheckboxSet", {width: "100%", height: "100%", disabled:1, displayExpression: "${owner.owner.currentClassListVar.count} > 1 ? ${dataValue} + ': (' + ${dataValue}.replace(/^.*\\./,'') + ${owner.owner.newCustomClassNameEditor.dataValue} + ')': ${dataValue} + ' (' + ${owner.owner.newCustomClassNameEditor.dataValue} + ')'",displayField: "dataValue", dataField: "", "captionAlign":"left","captionPosition":"left","captionSize":"150px",caption: "Add to Palette"},{}, {
                binding: ["wm.Binding", {}, {}, {
        			wire: ["wm.Wire", {"source":"currentClassListVar","targetProperty":"dataSet"}, {}],
        			wire1:["wm.Wire", {"expression":"${currentClassListVar.count} <= 1","targetProperty":"disabled"}, {}]
        		}]
    		}]
    	}],
    	buttonBar: ["wm.ButtonBarPanel", {"border":"1,0,0,0","borderColor":"black","height":"109px"}, {}, {
    		customClassCancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, "border":"1","caption":"Cancel","height":"100px","margin":"4"}, {"onclick":"customClassCancelButtonClick"}],
    		customClassOKButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, "border":"1","caption":"OK","height":"100px","margin":"4"}, {"onclick":"customClassOKButtonClick"}]
    	}]
    }],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","layoutKind":"top-to-bottom","verticalAlign":"top"}, {}, {
		buttonBar: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, height: "29px", width: "100%", layoutKind: "left-to-right", imageList: "studio.smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#959DAB", verticalAlign: "middle"}, {}, {
		    themesPageSaveBtn: ["wm.studio.ToolbarButton", {hint: "Save", imageIndex: 8}, {onclick: "saveThemeClick"}, {
				binding: ["wm.Binding", {}, {}, {
        			wire: ["wm.Wire", {"expression":"!${themeSelect.dataValue}","targetProperty":"disabled"}, {}]
        		}]
		    }],
		    themesPageAddBtn: ["wm.studio.ToolbarButton", {hint: "New Theme...", imageIndex: 25}, {onclick: "addNewThemeClick"}],
		    themesPageCopyBtn: ["wm.studio.ToolbarButton", {hint: "Copy Theme...", imageIndex: 1}, {onclick: "copyThemeClick"}, {
				binding: ["wm.Binding", {}, {}, {
        			wire: ["wm.Wire", {"expression":"!${themeSelect.dataValue}","targetProperty":"disabled"}, {}]
        		}]
		    }],
		    themesPageDeleteBtn: ["wm.studio.ToolbarButton", {hint: "Delete Theme", imageIndex: 0}, {onclick: "deleteThemeClick"}, {
				binding: ["wm.Binding", {}, {}, {
        			wire: ["wm.Wire", {"expression":"!${themeSelect.dataValue}","targetProperty":"disabled"}, {}]
        		}]
		    }],
		    themesPageRevertBtn: ["wm.studio.ToolbarButton", {hint: "Revert to last saved theme", imageIndex: 6, imageList: "studio.canvasToolbarImageList16"}, {onclick: "revertThemeClick"}, {
				binding: ["wm.Binding", {}, {}, {
        			wire: ["wm.Wire", {"expression":"!${themeSelect.dataValue}","targetProperty":"disabled"}, {}]
        		}]
		    }],
		    themesPageExportBtn: ["wm.studio.ToolbarButton", {hint: "Export theme so you can share it",  iconUrl: "images/resourceManagerIcons/download16.png"}, {onclick: "exportThemeClick"}, {
				binding: ["wm.Binding", {}, {}, {
        			wire: ["wm.Wire", {"expression":"!${themeSelect.dataValue}","targetProperty":"disabled"}, {}]
        		}]
		    }],
            themesHelpBtn: ["wm.studio.ToolbarButton", {margin: "6,4,4,4", hint: "Help", caption: "",_classes: {domNode: ["StudioHelpIcon"]}}, {onclick: "themeHelp"}],
		    themeSelect: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, caption: "Theme:", captionAlign: "right", captionPosition: "left", captionSize: "80px", margin: "0,0,10,0", height: "30px", width: "250px", displayField: "name", dataField: "dataValue"}, {onchange: "themeselectChange"}, {
			    binding: ["wm.Binding", {}, {}, {
			        wire: ["wm.Wire", {"targetProperty":"dataSet","source":"themeListVar.queriedItems"}, {}]
			    }]
			}],
			codeToggleLabel: ["wm.Label", {_classes: {domNode: ["StudioLabel"]}, align: "right", caption: "View:",width: "80px", height: "100%"}],
		    codeTogglePanel: ["wm.ToggleButtonPanel", {width: "180px", height: "100%", layoutKind: "left-to-right", buttonMargins: "5,0,5,0", border: "0"}, {}, {
				binding: ["wm.Binding", {}, {}, {
        			wire: ["wm.Wire", {"expression":undefined,"source":"stylesToggleButton","targetProperty":"currentButton"}, {}]
        		}],
				stylesToggleButton: ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]}, "width": "80px", height: "100%", margin: "0", caption: "Styles", border: "0,1,0,0"}, {onclick: "editorLayer"}],
				codeToggleButton: ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]}, "width": "100px", height: "100%", margin: "0", caption: "Source Code", border: "0"}, {onclick: "cssLayer"}]
		    }]/*,
   			deviceToggleLabel: ["wm.Label", {_classes: {domNode: ["StudioLabel"]}, align: "right", caption: "Device:",width: "80px", height: "100%"}],
		    deviceTogglePanel: ["wm.ToggleButtonPanel", {width: "250px", height: "100%", layoutKind: "left-to-right", buttonMargins: "5,0,5,0", border: "0"}, {onChange: "deviceChange"}, {
				binding: ["wm.Binding", {}, {}, {
        			wire: ["wm.Wire", {"expression":undefined,"source":"allDevicesToggleButton","targetProperty":"currentButton"}, {}]
        		}],
				allDevicesToggleButton: ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]}, "width": "100%", height: "100%", margin: "0", caption: "All", border: "0,1,0,0"}, {onclick: "deviceTypeChange"}],
				desktopToggleButton: ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]}, "width": "100%", height: "100%", margin: "0", caption: "Desktop", border: "0,1,0,0"}, {onclick: "deviceTypeChange"}],
				tabletToggleButton: ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]}, "width": "100%", height: "100%", margin: "0", caption: "Tablet", border: "0,1,0,0"}, {onclick: "deviceTypeChange"}],
				phoneToggleButton: ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]}, "width": "100%", height: "100%", margin: "0", caption: "Phone", border: "0,1,0,0"}, {onclick: "deviceTypeChange"}]
		    }]*/

		}],
		mainPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right"}, {}, {
			leftPanel: ["wm.Panel", {width: "180px", height: "100%", layoutKind: "top-to-bottom"}, {}, {

				widgetGrid: ["wm.DojoGrid", {noHeader:true,_classes: {domNode: ["StudioGrid"]}, "columns":[
							{"show":true,"field":"name","title":"Name","width":"100%","align":"left","cssClass":"${category} ? \"CategoryRow\" : \"StyleEntry\"", expression: "${parentName} ? ${parentName} + ': ' + ${name} : ${name}"}],
							"dsType":"EntryData","height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":60,"singleClickEdit":true,"width":"150px"},
							{"onSelect":"widgetGridSelect"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"templateListVar.queriedItems","targetProperty":"dataSet"}, {}]
					}]
				}],
				addClassButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Add Custom Class", width: "120px"}, {onclick: "addCustomClassClick"}],
				removeClassButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Remove Class", width: "120px"}, {onclick: "removeCustomClassClick"}]
			}],
			tabs:["wm.Layers", {_classes: {domNode: ["StudioTabs"]}, "height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%",layoutKind: "top-to-bottom", border: "1", borderColor: "black"}, {},{
			    editorLayer: ["wm.Layer", {caption: "Editors"},{onShow: "onGeneratedLayerShow"}, {
    				editorPanelHeader: ["wm.Label", {width: "100%", _classes: {domNode: ["Header"]}}],
    				editorPanel: ["wm.Panel", {autoScroll:true,minWidth:500,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%",layoutKind: "top-to-bottom"}, {},{}]
    			}],
				cssLayer: ["wm.Layer", {caption: "Code", verticalAlign: "top", horizontalAlign: "right"},{onShow: "onCssLayerShow"}, {
				    editArea: ["wm.AceEditor", {syntax: "css", width: "100%", height: "100%"},{onChange: "editAreaChange"}],
				    applyStylesButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Apply Styles", width: "120px"}, {onclick: "onGeneratedLayerShow"}]
				}]
    		}],
    		splitter1: ["wm.Splitter", {}],
			demoOuterPanel:["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"400px",layoutKind: "top-to-bottom", border: "1", borderColor: "black"}, {},{
				demoPanelHeader: ["wm.Label", {width: "100%", caption: "Samples", _classes: {domNode: ["Header"]}}],
				demoPanelWithThemeName: ["wm.Panel", { height: "100%", horizontalAlign: "left", verticalAlign: "top", width: "100%"}, {}, {
				    demoPanelWithAppRoot: ["wm.Panel", {_classes: {domNode: ["wmapproot"]}, height: "100%", horizontalAlign: "left", verticalAlign: "top", width: "100%"}, {}, {
				    }]
				}]
			}]
		}]
	}]
}