/*
 * Copyright (C) 2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 

ThemeDesigner.widgets = {  
    imageListVar: ["wm.Variable", {type: "EntryData"}],
    themeListVar: ["wm.Variable", {type: "StringData"}],
    widgetListVar: ["wm.Variable", {type: "StringData"}],
    difficultyListVar: ["wm.Variable", {type: "StringData", json: "[{dataValue: 'Basic'},{dataValue: 'Advanced'},{dataValue: 'Control Freak'}]"}],
    themeGroupListVar: ["wm.Variable", {type: "EntryData", json: "[{name: 'Quick Theme', dataValue: 'Basic'}, {name: 'Full Theme Settings'}, {name: 'Common', dataValue: 'Common'}, {name: 'Panels - Document', dataValue: 'Document'}, {name: 'Grids and Tables', dataValue: 'Tables'}, {name: 'Advanced Settings'}, {name: 'Widget Settings', dataValue: 'Widgets'}, {name: '<input type=\"checkbox\" id=\"MainContentEnabled\"/> Panels - Main Content', dataValue: 'MainContent'}, {name: '<input type=\"checkbox\" id=\"EmphasizedContentEnabled\"/> Panels - Emphasized', dataValue: 'EmphasizedContent'}, {name: '<input type=\"checkbox\" id=\"TOCContentEnabled\" /> Panels - TOC', dataValue: 'TOCContent'}, {name: '<input type=\"checkbox\" id=\"ToolbarContentEnabled\" /> Panels - Toolbar', dataValue: 'ToolbarContent'}]"}],
    themeSubGroupListVar: ["wm.Variable", {type: "EntryData"}],
    shadowListVar: ["wm.Variable", {type: "EntryData", json: "[{dataValue: '0px 0px 0px #444444', name: 'No Shadow'}, {dataValue: '1px 0px 1px #444444', name: '1px Right Shadow'}, {dataValue: '0px 1px 1px #444444', name: '1px Bottom Shadow'}, {dataValue: '1px 1px 1px #444444', name: '1px Shadow'},{dataValue: '1px 0px 1px #000000', name: '1px Right Shadow Black'}, {dataValue: '0px 1px 1px #000000', name: '1px Bottom Shadow Black'}, {dataValue: '1px 1px 1px #000000', name: '1px Shadow Black'}, {dataValue: '2px 0px 2px #444444', name: '2px Right Shadow'}, {dataValue: '0px 2px 2px #444444', name: '2px Bottom Shadow'}, {dataValue: '2px 2px 2px #444444', name: '2px Shadow'}, {dataValue: '2px 0px 2px #000000', name: '2px Right Shadow Black'}, {dataValue: '0px 2px 2px #000000', name: '2px Bottom Shadow Black'}, {dataValue: '2px 2px 2px #000000', name: '2px Shadow Black'}, {dataValue: '3px 0px 3px #444444', name: '3px Right Shadow'}, {dataValue: '0px 3px 3px #444444', name: '3px Bottom Shadow'}, {dataValue: '3px 3px 3px #444444', name: '3px Shadow'}, {dataValue: '3px 0px 3px #000000', name: '3px Right Shadow Black'}, {dataValue: '0px 3px 3px #000000', name: '3px Bottom Shadow Black'}, {dataValue: '3px 3px 3px #000000', name: '3px Shadow Black'}, {dataValue: '4px 0px 4px #444444', name: '4px Right Shadow'}, {dataValue: '0px 4px 4px #444444', name: '4px Bottom Shadow'}, {dataValue: '4px 4px 4px #444444', name: '4px Shadow'}, {dataValue: '4px 0px 4px #000000', name: '4px Right Shadow Black'}, {dataValue: '0px 4px 4px #000000', name: '4px Bottom Shadow Black'}, {dataValue: '4px 4px 4px #000000', name: '4px Shadow Black'}, {dataValue: '6px 0px 6px #444444', name: '6px Right Shadow'}, {dataValue: '0px 6px 6px #444444', name: '6px Bottom Shadow'}, {dataValue: '6px 6px 12px #444444', name: '6px Shadow'}, {dataValue: '6px 0px 6px #000000', name: '6px Right Shadow Black'}, {dataValue: '0px 6px 6px #000000', name: '6px Bottom Shadow Black'}, {dataValue: '6px 6px 12px #000000', name: '6px Shadow Black'}]"}],
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top", layoutKind: "left-to-right"}, {}, {	    
            leftColumn: ["wm.Panel", {layoutKind: "top-to-bottom", width: "330px", height: "100%", horizontalAlign: "left", verticalAlign: "top"},{},{
                themeSelect: ["wm.SelectMenu", {caption: "Select Theme", captionAlign: "right", captionSize: "90px", margin: "0,0,10,0", height: "30px", width: "250px", displayField: "dataValue", dataField: "dataValue", headerVisible: false}, {onchange: "themeselect"}, {
		    binding: ["wm.Binding", {}, {}, {
		        wire: ["wm.Wire", {"targetProperty":"dataSet","source":"themeListVar"}, {}]
		    }]
		}],
		optionsPanel: ["wm.Panel", {width: "100%", height: "265px", layoutKind: "left-to-right"}, {}, {
/*		    userLevelListPanel: ["wm.Panel", {height: "100%", width: "90px", layoutKind: "top-to-bottom", border: "0,0,0,4", borderColor: "black"}, {}, {
                        userLevelListLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Difficulty"}],
                        userLevelList: ["wm.List", {height: "100%", width: "100%", dataFields: "dataValue", headerVisible: false}, {onselect: "difficultySelect"}, {
			    binding: ["wm.Binding", {}, {}, {
		                wire: ["wm.Wire", {"targetProperty":"dataSet","source":"difficultyListVar"}, {}]
			    }]
		        }]
		    }],*/
		    themeGroupListPanel: ["wm.Panel", {height: "100%", width: "180px", layoutKind: "top-to-bottom", border: "0,4,0,0", borderColor: "black"},{}, {
			themeGroupListLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Categories"}],
			themeGroupList: ["wm.List", {height: "100%", width: "100%", dataFields: "name", headerVisible: false}, {onselect: "themegroupselect"}, {
			    binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"dataSet","source":"themeGroupListVar"}, {}]
			    }]
                        }]
		    }],
		    themeSubGroupListPanel: ["wm.Panel", {height: "100%", width: "150px", layoutKind: "top-to-bottom", border: "0,4,0,0", borderColor: "black"},{}, {
                        themeSubGroupListLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Style Group"}],
                        themeSubGroupList: ["wm.List", {height: "100%", width: "100%", dataFields: "name", headerVisible: false}, {onselect: "themegroupselect"}, {
			    binding: ["wm.Binding", {}, {}, {
		                wire: ["wm.Wire", {"targetProperty":"dataSet","source":"themeSubGroupListVar"}, {}]
			    }]
                        }],
                        widgetList: ["wm.List", {showing: false, height: "100%", width: "150px", dataFields: "dataValue", headerVisible: false}, {onselect: "widgetselect"}, {
			    binding: ["wm.Binding", {}, {}, {
		                wire: ["wm.Wire", {"targetProperty":"dataSet","source":"widgetListVar"}, {}]
			    }]
                        }]
		    }]	
                }],
                editSplitter: ["wm.Splitter", {}],
                widgetEditPanel: ["wm.Panel", {_classes: {domNode:["wm-darksnazzy"]},height: "100%", autoScroll: true, width: "100%", layoutKind: "top-to-bottom", padding: "0,0,10,0"}]
            }],

	    demoPanelTabLayers: ["wm.TabLayers", {height: "100%", width: "100%", clientBorder: "2"},{onchange: "regenerateADemo"},{
		    viewOneWidgetLayer: ["wm.Layer", {caption: "Widget"},{},{
			demoPanel4: ["wm.Panel", { height: "100%", width: "100%", layoutKind: "top-to-bottom", margin: "15", padding: "15",  border: "2", borderColor: "#F0F0F0"}]
		    }],
		    overviewLayer: ["wm.Layer", {caption: "Overview"},{},{
			demoPanel: ["wm.Panel", { height: "100%", width: "100%", layoutKind: "top-to-bottom", margin: "15", padding: "15",  border: "2", borderColor: "#F0F0F0"}]
		    }],
		    viewWidgetsLayer: ["wm.Layer", {caption: "Widgets"},{},{
			demoPanel2: ["wm.Panel", { height: "100%", width: "100%", layoutKind: "top-to-bottom", margin: "15", padding: "15",  border: "2", borderColor: "#F0F0F0"}]
		    }],
		    viewDialogsLayer: ["wm.Layer", {caption: "Dialogs"},{},{
			demoPanel3: ["wm.Panel", { height: "100%", width: "100%", layoutKind: "top-to-bottom", margin: "15", padding: "15", border: "2", borderColor: "#F0F0F0"}]
		    }]

	    }]
        }]
}
