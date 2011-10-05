/*
 * Copyright (C) 2010-2011 VMWare, Inc. All rights reserved.
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
 

ResourceManager.widgets = {  
    addFileDialog: ["wm.DesignableDialog", {title: "Add File", modal: false, "height":"120px",width: "350px", "containerWidgetId":"containerWidget"}, {}, {
	containerWidget: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
	    addFileOption1Panel: ["wm.Panel", {"border":"0","height":"42px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", borderColor: "#333333", border: "0,0,1,0"}, {}, {
		addFileOption1Label: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","caption":"Option 1: Upload a file","padding":"4"}, {}],
		addFileOption1Spacer: ["wm.Spacer", {"height":"48px","width":"100%"}, {}],

		    uploadButton: ["wm.DojoFileUpload", {_classes: {domNode: ["StudioButton"]},
							 operation: "uploadFile", service: "resourceFileService", 
							 buttonCaption: "Upload", height: "32px", width: "100px", 
							 uploadImmediately: true, useList: false, margin: "4"},
				   {onSuccess: "fileUploadCompleted"}]
	    }],
		addFileOption2Panel: ["wm.Panel", {"border":"0","height":"42px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		    addFileOption2Label: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","caption":"Option 2: Create an empty file","padding":"4"}, {}],
		addFileOption2Spacer: ["wm.Spacer", {"height":"48px","width":"100%"}, {}],
		addFileOption1Button: ["wm.Button", {_classes: {domNode: ["StudioButton"]},
						      width: "100px", 
						     "caption":"Create"}, {onclick: "addNewFile"}]
		}]
	}]
    }],
    layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top", layoutKind: "top-to-bottom"}, {}, {
	    buttonPanel: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "46px",padding: "2,10,2,10"}, {}, {
	    resourcesFolderToolBar: ["wm.Panel", { height: "46px", width: "600px", border: "", layoutKind: "left-to-right"}, {}, {
	      renameFolderButton: ["wm.Button", {disabled: true, caption: "<img src='/wavemaker/images/resourceManagerIcons/rename32.png'> Rename", height: "36px", width: "150px"},{onclick: "renameItem"}],
	      deleteFolderButton: ["wm.Button", {disabled: true, caption: "<img src='/wavemaker/images/resourceManagerIcons/f_delete32.png'> Delete", height: "36px", width: "150px"},{onclick: "deleteItem"}],
	      downloadFolderButton: ["wm.Button", {disabled: true, caption: "<img src='/wavemaker/images/resourceManagerIcons/f_download32.png'> Download", height: "36px", width: "150px"},{onclick: "downloadItem"}],
	      addFolderButton: ["wm.Button", {disabled: true, caption: "<img src='/wavemaker/images/resourceManagerIcons/f_add32.png'> Add Folder", height: "36px", width: "150px"},{onclick: "addNewFolder"}]
  	    }],
	    resourcesFileToolBar: ["wm.Panel", {showing: false, height: "46px", width: "450px", border: "", layoutKind: "left-to-right"}, {}, {
	      renameFileButton: ["wm.Button", {caption: "<img src='/wavemaker/images/resourceManagerIcons/rename32.png'> Rename", height: "36px", width: "150px"},{onclick: "renameItem"}],
	      deleteFileButton: ["wm.Button", {caption: "<img src='/wavemaker/images/resourceManagerIcons/d_delete32.png'> Delete", height: "36px", width: "150px"},{onclick: "deleteItem"}],
	      downloadFileButton: ["wm.Button", {caption: "<img src='/wavemaker/images/resourceManagerIcons/d_download32.png'> Download", height: "36px", width: "150px"},{onclick: "downloadItem"}]/*,
	      updateFileButton: ["wm.Button", {caption: "<img src='/wavemaker/images/resourceManagerIcons/d_update32.png'> Replace", height: "36px", width: "150px"},{onclick: "updateItem"}]*/
  	    }],
		openAddFileDialogButton: ["wm.Button", {caption: "<img src='/wavemaker/images/resourceManagerIcons/d_add32.png'> Add File", height: "36px", width: "150px"}, {onclick: "addFileDialog"}]
            }],
	    mainPanel: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "100%"}, {}, {
		shortcutPanel: ["wm.Panel", {width: "150px", height: "100%",layoutKind: "top-to-bottom"}, {}, {
		    shortcutHeader: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextDecoration_Bold"]},padding: "0", margin: "5,0,5,0", align: "center", caption: "Folder Shortcuts", width: "100%", height: "50px"}],
		    shortcutList: ["wm.List", {_classes: {domNode: ["StudioList"]}, margin: "0,5,10,5", padding: "0", width: "100%", height: "100%",headerVisible:false, dataFields: "name", _data: [{name: "Resources", path: "/webapproot/resources", description: "Use this folder to add your project resources such as images, custom javascript libraries, and html files.  This is the only folder you are likely to need when working with your project"}, {name: "Project", path: "", description: "Access all of your project files"}, {name: "Config Files", path: "/webapproot/WEB-INF", description: "Access your WEB-INF folder where your web.xml, security and other spring files are located; for advanced users only"}, {name: "Pages", path: "/webapproot/pages", description: "You can edit your pages here; be warned that if you edit a page that you have open in studio's designer, that changes you made in the designer will be lost"}, {name: "Common Folder", path: "/common", description: "These files are shared by all of your projects.  Put your custom themes and custom widgets here"}, {name: "Jar Folder", path: "/lib", description: "If you want to add jar files to your project, this is where they go"}]}, {onselect: "onShortcutSelect"}]
		}],
		treePanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom"}, {}, {
		    treeLabel: ["wm.Label", {width: "100%", height: "50px", caption: "", singleLine: false,margin: "5,20,5,20", padding: "0" }],
		    treeInnerPanel: ["wm.Panel", {width: "100%", height: "100%", margin: "0,5,10,5", padding: "5"}, {}, {
			tree: ["wm.Tree", {width: "100%", height: "100%", scrollY: true, scrollX: true, margin: "0", padding: "0"}, {onselect: "itemSelected", ondeselect: "clearSelectedItem", onmousedown: "itemMouseDown"}, {}]
		    }]
		}],
		resourcePropertiesContainer: ["wm.Panel", {_classes: {domNode: ["wm_BackgroundColor_Black"]}, height: "100%", width: "260px", verticalAlign: "top", margin: 0, layoutKind: "top-to-bottom"}, {}, {
		    resourcePropertiesHeader: ["wm.Panel", {height: "17px", width: "100%", verticalAlign: "bottom", layoutKind: "left-to-right", padding: "2,6,0,6", margin: "0,4,0,4"},{},{ 
			resourcePropertiesHeaderIcon: ["wm.Picture", {height: "15px", width: "15px", source: "", aspect: "h"}],
			resourcePropertiesHeaderLabel: ["wm.Label", {_classes: {domNode: ["wm_FontColor_White"]}, height: "15px", width: "100%", caption: "Properties"}]
		    }],
		    resourceProperties: ["wm.Panel", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%", verticalAlign: "top", horizontalAlign: "left", margin: 4, padding: 6, layoutKind: "top-to-bottom"}, {}, {}]
		}]
	    }],
	    splitter: ["wm.Splitter", {}],
	    editorPanel: ["wm.Panel", {width: "100%", height: "300px", verticalAlign: "top", horizontalAlign: "left", layoutKind: 'top-to-bottom'}, {}, {
		scriptRibbon: ["wm.Panel", {height: "29px", width: "100%", border: "0", layoutKind: "left-to-right", imageList: "studio.smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#000000"}, {}, {
		    saveBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Save", imageIndex: 8}, {onclick: "saveTextEditor"}],
		    findBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findScriptClick"}],
		    refreshBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Refresh from Server", imageIndex: 27}, {onclick: "refreshScriptClick"}],
		    formatBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Reformat Code", imageIndex: 29}, {onclick: "formatScriptClick"}],
		    wordWrapBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Toggle Line Wrapping", imageIndex: 15, imageList: "studio.canvasToolbarImageList16"}, {onclick: "toggleWrapScriptClick"}],
		    editorHelpBtn: ["wm.ToolButton", {width: "24px", margin: "0", hint: "Help", imageIndex: 26}, {onclick: "showEditorHelp"}]

		}],
		editor: ["wm.AceEditor", {width: "100%", height: "100%", dataValue: "", syntax: "text"}, {onChange: "editorChange"}]
	    }]
	}]
}
