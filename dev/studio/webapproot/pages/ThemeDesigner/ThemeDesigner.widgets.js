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
    themeGroupListVar: ["wm.Variable", {type: "EntryData"}],
    themeSubGroupListVar: ["wm.Variable", {type: "EntryData"}],
    shadowListVar: ["wm.Variable", {type: "EntryData", json: "[{dataValue: '0px 0px 0px #444444', name: 'No Shadow'}, {dataValue: '1px 0px 1px #444444', name: '1px Right Shadow'}, {dataValue: '0px 1px 1px #444444', name: '1px Bottom Shadow'}, {dataValue: '1px 1px 1px #444444', name: '1px Shadow'}, {dataValue: '2px 0px 2px #444444', name: '2px Right Shadow'}, {dataValue: '0px 2px 2px #444444', name: '2px Bottom Shadow'}, {dataValue: '2px 2px 2px #444444', name: '2px Shadow'}, {dataValue: '3px 0px 3px #444444', name: '3px Right Shadow'}, {dataValue: '0px 3px 3px #444444', name: '3px Bottom Shadow'}, {dataValue: '3px 3px 3px #444444', name: '3px Shadow'}, {dataValue: '4px 0px 4px #444444', name: '4px Right Shadow'}, {dataValue: '0px 4px 4px #444444', name: '4px Bottom Shadow'}, {dataValue: '4px 4px 4px #444444', name: '4px Shadow'}, {dataValue: '6px 0px 6px #444444', name: '6px Right Shadow'}, {dataValue: '0px 6px 6px #444444', name: '6px Bottom Shadow'}, {dataValue: '6px 6px 12px #444444', name: '6px Shadow'}]"}],
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top", layoutKind: "left-to-right"}, {}, {	    
            leftColumn: ["wm.Panel", {layoutKind: "top-to-bottom", width: "420px", height: "100%", horizontalAlign: "left", verticalAlign: "top"},{},{
                darkSnazzyPanelOuter: ["wm.Panel", {_classes: {domNode:["wm-darksnazzy"]}, height: "250px", width: "100%", layoutKind: "left-to-right"}, {}, {
                    darkSnazzyPanel: ["wm.Panel", {height: "100%", width: "100px", fitToContentWidth: true, layoutKind: "left-to-right", border: "0,4,0,0", borderColor: "black", autoScroll:true}, {}, {
			themeListPanel: ["wm.Panel", {height: "100%", width: "120px", layoutKind: "top-to-bottom"}, {}, {
                            themeListLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Themes"}],
                            themeList: ["wm.List", {height: "100%", width: "100%", dataFields: "dataValue", headerVisible: false}, {onselect: "themeselect"}, {
				binding: ["wm.Binding", {}, {}, {
		                    wire: ["wm.Wire", {"targetProperty":"dataSet","source":"themeListVar"}, {}]
				}]
		            }],
                            themeListButtonPanel: ["wm.Panel", {height: "40px", width: "100%", layoutKind: "left-to-right"}, {}, {
				copyThemeButton: ["wm.Button", {_classes: {domNode: ["themeButton"]}, caption: "Copy", height: "100%", width: "50%", border: 2, borderColor: "#262b34"}, {onclick: "copyThemeClick"}],
				removeThemeButton: ["wm.Button", {_classes: {domNode: ["themeButton"]}, caption: "Delete", height: "100%", width: "50%", border: 2, borderColor: "#262b34"}, {onclick: "removeThemeClick"}]
                            }]
			}],
			userLevelListPanel: ["wm.Panel", {height: "100%", width: "90px", layoutKind: "top-to-bottom", border: "0,0,0,4", borderColor: "black"}, {}, {
                            userLevelListLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Difficulty"}],
                            userLevelList: ["wm.List", {height: "100%", width: "100%", dataFields: "dataValue", headerVisible: false}, {onselect: "difficultySelect"}, {
				binding: ["wm.Binding", {}, {}, {
		                    wire: ["wm.Wire", {"targetProperty":"dataSet","source":"difficultyListVar"}, {}]
				}]
		            }]
			}],
			themeGroupListPanel: ["wm.Panel", {height: "100%", width: "120px", layoutKind: "top-to-bottom", border: "0,0,0,4", borderColor: "black"},{}, {
                            themeGroupListLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Categories"}],
                            themeGroupList: ["wm.List", {height: "100%", width: "100%", dataFields: "name", headerVisible: false}, {onselect: "themegroupselect"}, {
				binding: ["wm.Binding", {}, {}, {
		                    wire: ["wm.Wire", {"targetProperty":"dataSet","source":"themeGroupListVar"}, {}]
				}]
                            }]
			}],
			themeSubGroupListPanel: ["wm.Panel", {height: "100%", width: "85px", layoutKind: "top-to-bottom", border: "0,0,0,4", borderColor: "black"},{}, {
                            themeSubGroupListLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Style Group"}],
                            themeSubGroupList: ["wm.List", {height: "100%", width: "100%", dataFields: "name", headerVisible: false}, {onselect: "themegroupselect"}, {
				binding: ["wm.Binding", {}, {}, {
		                    wire: ["wm.Wire", {"targetProperty":"dataSet","source":"themeSubGroupListVar"}, {}]
				}]
                        }]
			}],
		
			widgetListPanel: ["wm.Panel", {showing: false, height: "100%", width: "150px", layoutKind: "top-to-bottom", border: "0,0,0,4", borderColor: "black"},{}, {
                            widgetListLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Widgets"}],
                            widgetList: ["wm.List", {height: "100%", width: "150px", dataFields: "dataValue", headerVisible: false}, {onselect: "widgetselect"}, {
				binding: ["wm.Binding", {}, {}, {
		                    wire: ["wm.Wire", {"targetProperty":"dataSet","source":"widgetListVar"}, {}]
				}]
                            }]
			}]
                    }]
		}],
                editSplitter: ["wm.Splitter", {}],
                widgetEditPanel: ["wm.Panel", {_classes: {domNode:["wm-darksnazzy"]},height: "100%", autoScroll: true, width: "100%", layoutKind: "top-to-bottom"}]
            }],
            demoPanelOuter: ["wm.Panel", {height: "100%", width: "100%", layoutKind: "top-to-bottom"}, {}, {
                demoPanel: ["wm.Panel", { height: "100%", width: "100%", layoutKind: "top-to-bottom"}]
            }]
        }]
}
