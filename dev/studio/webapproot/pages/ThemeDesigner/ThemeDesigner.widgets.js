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
    "wm.Themes.EntryDataWithDescription": ["wm.TypeDefinition", {}, {}, {
        field1: ["wm.TypeDefinitionField", {type: "String", fieldName: "name"}],
        field2: ["wm.TypeDefinitionField", {type: "String", fieldName: "help"}],
        field3: ["wm.TypeDefinitionField", {type: "any", fieldName: "dataValue"}],
        field4: ["wm.TypeDefinitionField", {type: "String", fieldName: "description"}],
        field5: ["wm.TypeDefinitionField", {type: "any", fieldName: "sourceData"}]
    }],
    imageListVar: ["wm.Variable", {type: "EntryData"}],
    themeListVar: ["wm.Variable", {type: "StringData"}],
    widgetListVar: ["wm.Variable", {type: "StringData"}],
    panelTypeListVar: ["wm.Variable", {type: "StringData", json: "[{dataValue: ''},{dataValue: 'MainContent'},{dataValue: 'EmphasizedContent'},{dataValue: 'HeaderContent'}]"}],
    themeGroupListVar: ["wm.Variable", {type: "wm.Themes.EntryDataWithDescription", json: "[{name: '&nbsp;&nbsp;Quick Theme', dataValue: 'Basic', description: 'To whip up a quick theme, uncheck all of the checkboxes in the advanced section of the list, and everything you need to create a simple theme is right here.  If you flesh things out using the advanced settings, then you should be warned that changes you make here may overwrite your advanced changes.',help:'<a>?</a>'}, {name: 'Full Theme Settings',help:'<a>?</a>', description: 'Settings in this section allow you to further customize a theme designed using the Quick Theme above. It lets you set the basic behaviors of your document. Use Advanced Settings to customize different sections of your document; or just use Full Theme Settings and have a single look and feel for your document.'}, {name: '&nbsp;&nbsp;Borders', dataValue: 'Borders',help:'<a>?</a>', description: 'The Quick Theme specifies a single setting for all borders.  Customize your borders further by setting different values for panels, editors and other types of widgets.  Note that borders and borderColors are not handled via css files, but rather they are built into the prototype of the javascript objects.  Thus, if you set the borderColor to be red for all Headers/Clickables, wm.Button will have its default borderColor property set to red.  borderColor and border size can only be controlled via properties, not by style sheets (exceptions to this are any dom nodes that are inside of our widgets, rather than the widgets themselves).'}, {name: '&nbsp;&nbsp;Panels - Document', dataValue: 'Document',help:'<a>?</a>', description: 'Setup the styles for your document (Styles) Headers/Buttons (HeadersDefault, HeadersHover, HeadersActive) and your editors (EditorsDefault, EditorsHover, EditorsFocus).'}, {name: '&nbsp;&nbsp;Panels - Dialogs', dataValue: 'Dialogs',help:'<a>?</a>', description: 'If your project has a Dialog'}, {name: '&nbsp;&nbsp;Grids and Tables', dataValue: 'Tables',help:'<a>?</a>', description: 'Set the fonts and colors for your grids, lists and menus; set a different color for your Odd row to make every other row alternate different colors'}, {name: 'Advanced Settings',help:'<a>?</a>', description: 'Select a checkbox below to enable the style a specific type of panel.  If you want your Table of Contents to use your base document styles, uncheck <b>Panels - TOC</b>.  If you want to have a special table of contents style though, check it and start editting it'}, {name: '&nbsp;&nbsp;Widget Settings', dataValue: 'Widgets',help:'<a>?</a>', description: 'This section lets you edit and fine tune behaviors on a widget by widget basis.  Note that changes you make here may get overwritten by changes you make under Quick Theme and Full Theme Settings.  Its important to understand that changes you make to widgets are changing one of two things: <ol><li>Widget Properties: When you set a border width or border color, your setting the default property for all widgets of that class.</li><li>Styles that are set for a single widget.  For example, wm.TabLayers lets you set the font size, tab button height and other settings that could not be automated as part of the theme builder</li></ol> When you edit the default property of objects its important to understand what this means.  For example, you can set the borderWidth of all buttons to be 5.  Now, a designer can edit any given button and changes the border for that one button to 2.  Be warned though that if the designer then changes to a different theme where button borders are <b>all</b> 2, then that one button will no longer be differentiated from other buttons.  Each time a user changes themes, all borders, borderColors, and other properties may be changed.  This is why we recommnd saving a backup before changing themes for your project.' }, {name: '&nbsp;&nbsp;Panels - Main Content', dataValue: 'MainContent',help:'<a>?</a>', description: 'Sometimes its nice to have a main content section of your document, and to give it a different background from the rest of your document.  Designs of this kind will often let a darker document background draw a frame around a lighter content frame, focusin attention on the content.  In this section you can setup styles for any panel that are marked as <b>Main Content</b>, and allow the Headers/Buttons and the editors to style a little differently. Check the checkbox to enable the MainContent styling.'}, {name: '&nbsp;&nbsp;Panels - Emphasized', dataValue: 'EmphasizedContent',help:'<a>?</a>', description: 'Sometimes its nice to have a panel of content that is emphasized.  Typically this would appear in the middle of your MainContent section, but it can also be used anywhere a designer choses to set a panel of type EmphasizedContent. An example of use of this is a news article as the main content, but a quote that you want to highlight, or some important notes about the article might be highlighted to separate them from the content.  For an example of a theme designed to allow small sections of content to stand out from the document, see <a href=\"http://jqueryui.com/themeroller/#ffDefault=Segoe+UI%2C+Arial%2C+sans-serif&fwDefault=bold&fsDefault=1.1em&cornerRadius=8px&bgColorHeader=817865&bgTextureHeader=12_gloss_wave.png&bgImgOpacityHeader=45&borderColorHeader=494437&fcHeader=ffffff&iconColorHeader=fadc7a&bgColorContent=feeebd&bgTextureContent=03_highlight_soft.png&bgImgOpacityContent=100&borderColorContent=8e846b&fcContent=383838&iconColorContent=d19405&bgColorDefault=fece2f&bgTextureDefault=12_gloss_wave.png&bgImgOpacityDefault=60&borderColorDefault=d19405&fcDefault=4c3000&iconColorDefault=3d3d3d&bgColorHover=ffdd57&bgTextureHover=12_gloss_wave.png&bgImgOpacityHover=70&borderColorHover=a45b13&fcHover=381f00&iconColorHover=bd7b00&bgColorActive=ffffff&bgTextureActive=05_inset_soft.png&bgImgOpacityActive=30&borderColorActive=655e4e&fcActive=0074c7&iconColorActive=eb990f&bgColorHighlight=fff9e5&bgTextureHighlight=12_gloss_wave.png&bgImgOpacityHighlight=90&borderColorHighlight=eeb420&fcHighlight=1f1f1f&iconColorHighlight=ed9f26&bgColorError=d34d17&bgTextureError=07_diagonals_medium.png&bgImgOpacityError=20&borderColorError=ffb73d&fcError=ffffff&iconColorError=ffe180&bgColorOverlay=5c5c5c&bgTextureOverlay=01_flat.png&bgImgOpacityOverlay=50&opacityOverlay=80&bgColorShadow=cccccc&bgTextureShadow=01_flat.png&bgImgOpacityShadow=30&opacityShadow=60&thicknessShadow=7px&offsetTopShadow=-7px&offsetLeftShadow=-7px&cornerRadiusShadow=8px\">ThemeRoller</a>.  Check the checkbox to enable the EmphasizedContent styling.'}, {name: '&nbsp;&nbsp;Panels - Header', dataValue: 'HeaderContent',help:'<a>?</a>', description: 'If your document has a table of contents, and you want to use a style other than your basic document style to highlight this section, enable this section using the checkbox and setup a custom table of contents style.' }]"}],
    themeSubGroupListVar: ["wm.Variable", {type: "wm.Themes.EntryDataWithDescription"}],
    shadowListVar: ["wm.Variable", {type: "EntryData", json: "[{dataValue: '0px 0px 0px #444444', name: 'No Shadow'}, {dataValue: '1px 0px 1px #444444', name: '1px Right Shadow'}, {dataValue: '0px 1px 1px #444444', name: '1px Bottom Shadow'}, {dataValue: '1px 1px 1px #444444', name: '1px Shadow'},{dataValue: '1px 0px 1px #000000', name: '1px Right Shadow Black'}, {dataValue: '0px 1px 1px #000000', name: '1px Bottom Shadow Black'}, {dataValue: '1px 1px 1px #000000', name: '1px Shadow Black'}, {dataValue: '2px 0px 2px #444444', name: '2px Right Shadow'}, {dataValue: '0px 2px 2px #444444', name: '2px Bottom Shadow'}, {dataValue: '2px 2px 2px #444444', name: '2px Shadow'}, {dataValue: '2px 0px 2px #000000', name: '2px Right Shadow Black'}, {dataValue: '0px 2px 2px #000000', name: '2px Bottom Shadow Black'}, {dataValue: '2px 2px 2px #000000', name: '2px Shadow Black'}, {dataValue: '3px 0px 3px #444444', name: '3px Right Shadow'}, {dataValue: '0px 3px 3px #444444', name: '3px Bottom Shadow'}, {dataValue: '3px 3px 3px #444444', name: '3px Shadow'}, {dataValue: '3px 0px 3px #000000', name: '3px Right Shadow Black'}, {dataValue: '0px 3px 3px #000000', name: '3px Bottom Shadow Black'}, {dataValue: '3px 3px 3px #000000', name: '3px Shadow Black'}, {dataValue: '4px 0px 4px #444444', name: '4px Right Shadow'}, {dataValue: '0px 4px 4px #444444', name: '4px Bottom Shadow'}, {dataValue: '4px 4px 4px #444444', name: '4px Shadow'}, {dataValue: '4px 0px 4px #000000', name: '4px Right Shadow Black'}, {dataValue: '0px 4px 4px #000000', name: '4px Bottom Shadow Black'}, {dataValue: '4px 4px 4px #000000', name: '4px Shadow Black'}, {dataValue: '6px 0px 6px #444444', name: '6px Right Shadow'}, {dataValue: '0px 6px 6px #444444', name: '6px Bottom Shadow'}, {dataValue: '6px 6px 12px #444444', name: '6px Shadow'}, {dataValue: '6px 0px 6px #000000', name: '6px Right Shadow Black'}, {dataValue: '0px 6px 6px #000000', name: '6px Bottom Shadow Black'}, {dataValue: '6px 6px 12px #000000', name: '6px Shadow Black'}]"}],
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top", layoutKind: "left-to-right"}, {}, {	    
            leftColumn: ["wm.Panel", {layoutKind: "top-to-bottom", width: "330px", height: "100%", horizontalAlign: "left", verticalAlign: "top"},{},{
                themeSelect: ["wm.SelectMenu", {caption: "Select Theme", captionAlign: "right", captionSize: "90px", margin: "0,0,10,0", height: "30px", width: "250px", displayField: "dataValue", dataField: "dataValue", headerVisible: false}, {onchange: "themeselect"}, {
		    binding: ["wm.Binding", {}, {}, {
		        wire: ["wm.Wire", {"targetProperty":"dataSet","source":"themeListVar"}, {}]
		    }]
		}],
		optionsPanel: ["wm.Panel", {width: "100%", height: "275px", layoutKind: "left-to-right"}, {}, {
/*		    userLevelListPanel: ["wm.Panel", {height: "100%", width: "90px", layoutKind: "top-to-bottom", border: "0,0,0,4", borderColor: "black"}, {}, {
                        userLevelListLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Difficulty"}],
                        userLevelList: ["wm.List", {height: "100%", width: "100%", dataFields: "dataValue", headerVisible: false}, {onselect: "difficultySelect"}, {
			    binding: ["wm.Binding", {}, {}, {
		                wire: ["wm.Wire", {"targetProperty":"dataSet","source":"difficultyListVar"}, {}]
			    }]
		        }]
		    }],*/
		    themeGroupListPanel: ["wm.Panel", {height: "100%", width: "190px", layoutKind: "top-to-bottom", border: "0,4,0,0", borderColor: "black"},{}, {
			themeGroupListLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Categories"}],
			themeGroupList: ["wm.List", {height: "100%", width: "100%", dataFields: "name,help", columnWidths: "100%,10px", headerVisible: false}, {onselect: "themegroupselect"}, {
			    binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"dataSet","source":"themeGroupListVar"}, {}]
			    }]
                        }]
		    }],
		    themeSubGroupListPanel: ["wm.Panel", {height: "100%", width: "150px", layoutKind: "top-to-bottom", border: "0,4,0,0", borderColor: "black"},{}, {
                        themeSubGroupListLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Style Group"}],
                        themeSubGroupList: ["wm.List", {height: "100%", width: "100%", dataFields: "name,help", columnWidths: "100%,10px", headerVisible: false}, {onselect: "themegroupselect"}, {
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
		pageWithTopNavLayer: ["wm.Layer", {caption: "Preview Doc with Toolbar", themeWidgets: "themeGroupWidgets_TopNav"},{},{
			demoPanel: ["wm.Panel", { height: "100%", width: "100%", layoutKind: "top-to-bottom", margin: "15", padding: "15",  border: "2", borderColor: "#F0F0F0"}]
		    }],
		viewWidgetsLayer: ["wm.Layer", {caption: "Preview Widget Set", showing: false},{},{
			demoPanel2: ["wm.Panel", { height: "100%", width: "100%", layoutKind: "top-to-bottom", margin: "0", padding: "0",  border: "2", borderColor: "#F0F0F0"}]
		    }],
		viewOneWidgetLayer: ["wm.Layer", {caption: "Preview One Widget", showing: false},{},{
			demoPanel4: ["wm.Panel", {backgroundColor: "white", height: "100%", width: "100%", layoutKind: "top-to-bottom", margin: "15", padding: "15",  border: "2", borderColor: "#F0F0F0"}]
		    }],
	    }]
        }]
}
