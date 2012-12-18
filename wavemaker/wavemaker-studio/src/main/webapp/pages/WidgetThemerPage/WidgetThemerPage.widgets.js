WidgetThemerPage.widgets = {
	widgetListTypeDef: ["wm.TypeDefinition", {internal:1},{},{
		widgetListTypeDefField1: ["wm.TypeDefinitionField", {fieldName: "name", type: "String"}],
		widgetListTypeDefField2: ["wm.TypeDefinitionField", {fieldName: "templateFile", type: "String"}],
		widgetListTypeDefField3: ["wm.TypeDefinitionField", {fieldName: "classList", isList: true, type: "StringData"}]
	}],
	templateListVar: ["wm.Variable", {"isList":true,"type":"widgetListTypeDef"}, {}],
    themeListVar: ["wm.Variable", {type: "StringData"}],
    fontFaceVar: ["wm.Variable", {type: "StringData", isList: 1, json: "[{dataValue: 'Georgia, serif'}, {dataValue: '\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif'}, {dataValue: '\"Times New Roman\", Times, serif'}, {dataValue: 'Arial, Helvetica, sans-serif'}, {dataValue: '\"Arial Black\", Gadget, sans-serif'}, {dataValue: '\"Comic Sans MS\", cursive, sans-serif'}, {dataValue: 'Impact, Charcoal, sans-serif'}, {dataValue: '\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif'}, {dataValue: 'Tahoma, Geneva, sans-serif'}, {dataValue: '\"Trebuchet MS\", Helvetica, sans-serif'}, {dataValue: 'Verdana, Geneva, sans-serif'}, {dataValue: '\"Courier New\", Courier, monospace'}, {dataValue: '\"Lucida Console\", Monaco, monospace'}]"}],    
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","layoutKind":"top-to-bottom","verticalAlign":"top"}, {}, {
		buttonBar: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, height: "29px", width: "100%", layoutKind: "left-to-right", imageList: "studio.smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#959DAB", verticalAlign: "middle"}, {}, {
		    themesPageSaveBtn: ["wm.studio.ToolbarButton", {hint: "Save", imageIndex: 8}, {onclick: "saveThemeClick"}],
		    themesPageAddBtn: ["wm.studio.ToolbarButton", {hint: "New Theme...", imageIndex: 25}, {onclick: "addNewThemeClick"}],
		    themesPageCopyBtn: ["wm.studio.ToolbarButton", {hint: "Copy Theme...", imageIndex: 1}, {onclick: "copyThemeClick"}],
		    themesPageDeleteBtn: ["wm.studio.ToolbarButton", {hint: "Delete Theme", imageIndex: 0}, {onclick: "deleteThemeClick"}],
		    themesPageRevertBtn: ["wm.studio.ToolbarButton", {hint: "Revert Theme", imageIndex: 6, imageList: "canvasToolbarImageList16"}, {onclick: "revertThemeClick"}]
		}],
		mainPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right"}, {}, {
			leftPanel: ["wm.Panel", {width: "150px", height: "100%", layoutKind: "top-to-bottom"}, {}, {
				themeSelect: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, caption: "Select Theme", captionAlign: "left", captionPosition: "top", captionSize: "18px", margin: "0,0,10,0", height: "30px", width: "250px", displayField: "dataValue", dataField: "dataValue", headerVisible: false}, {onchange: "themeselectChange"}, {
				    binding: ["wm.Binding", {}, {}, {
				        wire: ["wm.Wire", {"targetProperty":"dataSet","source":"themeListVar"}, {}]
				    }]
				}],
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
			tabs:["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs"]}, "height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%",layoutKind: "top-to-bottom", border: "1", borderColor: "black"}, {},{
			    editorLayer: ["wm.Layer", {caption: "Editors"},{}, {
    				editorPanelHeader: ["wm.Label", {width: "100%", _classes: {domNode: ["Header"]}}],
    				editorPanel: ["wm.Panel", {autoScroll:true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%",layoutKind: "top-to-bottom"}, {},{	}],
    			}],
				cssLayer: ["wm.Layer", {caption: "Code"},{onShow: "onCssLayerShow"}, {
				    editArea: ["wm.AceEditor", {syntax: "css", width: "100%", height: "100%"}]
				}]    			
    		}],
			demoOuterPanel:["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"300px",layoutKind: "top-to-bottom", border: "1", borderColor: "black"}, {},{
				demoPanelHeader: ["wm.Label", {width: "100%", caption: "Samples", _classes: {domNode: ["Header"]}}],
				demoPanel: ["wm.Panel", {height: "100%", horizontalAlign: "left", verticalAlign: "top", width: "100%", padding: "20"}, {}, {

				}]
			}]
		}]
	}]
}