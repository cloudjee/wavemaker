WidgetThemerPage.widgets = {
    sampleDataSet: ["wm.Variable", {type: "EntryData", isList: true, json:"[{name: 'Sunday', dataValue: 0},{name: 'Monday', dataValue: 1},{name: 'Tuesday', dataValue: 2},{name: 'Wednesday', dataValue: 3},{name: 'Thursday', dataValue: 4},{name: 'Friday', dataValue: 5},{name: 'Saturday', dataValue: 6}]"}],
	widgetListTypeDef: ["wm.TypeDefinition", {internal:1},{},{
		widgetListTypeDefField1: ["wm.TypeDefinitionField", {fieldName: "name", type: "String"}],
		widgetListTypeDefField2: ["wm.TypeDefinitionField", {fieldName: "templateFile", type: "String"}],
		widgetListTypeDefField3: ["wm.TypeDefinitionField", {fieldName: "classList", isList: true, type: "StringData"}]
	}],
	templateListVar: ["wm.Variable", {"isList":true,"type":"widgetListTypeDef"}, {}],
    themeListVar: ["wm.Variable", {type: "themeListType"}],
    fontFaceVar: ["wm.Variable", {type: "StringData", isList: 1, json: "[{dataValue: 'Georgia, serif'}, {dataValue: '\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif'}, {dataValue: '\"Times New Roman\", Times, serif'}, {dataValue: 'Arial, Helvetica, sans-serif'}, {dataValue: '\"Arial Black\", Gadget, sans-serif'}, {dataValue: '\"Comic Sans MS\", cursive, sans-serif'}, {dataValue: 'Impact, Charcoal, sans-serif'}, {dataValue: '\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif'}, {dataValue: 'Tahoma, Geneva, sans-serif'}, {dataValue: '\"Trebuchet MS\", Helvetica, sans-serif'}, {dataValue: 'Verdana, Geneva, sans-serif'}, {dataValue: '\"Courier New\", Courier, monospace'}, {dataValue: '\"Lucida Console\", Monaco, monospace'}]"}],    
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
		    themesPageRevertBtn: ["wm.studio.ToolbarButton", {hint: "Revert Theme", imageIndex: 6, imageList: "studio.canvasToolbarImageList16"}, {onclick: "revertThemeClick"}, {
				binding: ["wm.Binding", {}, {}, {
        			wire: ["wm.Wire", {"expression":"!${themeSelect.dataValue}","targetProperty":"disabled"}, {}]
        		}]		    
		    }],
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
				codeToggleButton: ["wm.Button", {_classes: {domNode: ["StudioButton","wmtogglebutton"]}, "width": "100px", height: "100%", margin: "0", caption: "Source Code", border: "0,1,0,0"}, {onclick: "cssLayer"}]				
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
			leftPanel: ["wm.Panel", {width: "150px", height: "100%", layoutKind: "top-to-bottom"}, {}, {
				
				widgetGrid: ["wm.DojoGrid", {_classes: {domNode: ["StudioGrid"]}, "columns":[
							{"show":true,"field":"name","title":"Name","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},
							],
							"dsType":"EntryData","height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":60,"singleClickEdit":true,"width":"150px"},
							{"onSelect":"widgetGridSelect"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"templateListVar","targetProperty":"dataSet"}, {}]
					}]
				}]
			}],
			tabs:["wm.Layers", {_classes: {domNode: ["StudioTabs"]}, "height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%",layoutKind: "top-to-bottom", border: "1", borderColor: "black"}, {},{
			    editorLayer: ["wm.Layer", {caption: "Editors"},{onShow: "onGeneratedLayerShow"}, {
    				editorPanelHeader: ["wm.Label", {width: "100%", _classes: {domNode: ["Header"]}}],
    				editorPanel: ["wm.Panel", {autoScroll:true,minWidth:500,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%",layoutKind: "top-to-bottom"}, {},{	}],
    			}],
				cssLayer: ["wm.Layer", {caption: "Code"},{onShow: "onCssLayerShow"}, {
				    editArea: ["wm.AceEditor", {syntax: "css", width: "100%", height: "100%"},{onChange: "editAreaChange"}]
				}] 				
    		}],
    		splitter1: ["wm.Splitter", {}],
			demoOuterPanel:["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"500px",layoutKind: "top-to-bottom", border: "1", borderColor: "black"}, {},{
				demoPanelHeader: ["wm.Label", {width: "100%", caption: "Samples", _classes: {domNode: ["Header"]}}],
				demoPanelWithThemeName: ["wm.Panel", { height: "100%", horizontalAlign: "left", verticalAlign: "top", width: "100%"}, {}, {
				    demoPanelWithAppRoot: ["wm.Panel", {_classes: {domNode: ["wmapproot"]}, height: "100%", horizontalAlign: "left", verticalAlign: "top", width: "100%"}, {}, {
				    }]
				}]
			}]
		}]
	}]
}