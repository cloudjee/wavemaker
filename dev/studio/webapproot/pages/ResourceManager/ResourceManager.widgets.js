/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
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

ResourceManager.widgets = {  
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top", layoutKind: "top-to-bottom"}, {}, {
	    buttonPanel: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "46px",padding: "2,10,2,10"}, {}, {
	    resourcesFolderToolBar: ["wm.Panel", { height: "46px", width: "600px", border: "", layoutKind: "left-to-right"}, {}, {
	      renameFolderButton: ["wm.Button", {disabled: true, caption: "<img src='/wavemaker/images/resourceManagerIcons/rename32.png'> " + bundleStudio.T_Rename, height: "36px", width: "150px"},{onclick: "renameItem"}],
	      deleteFolderButton: ["wm.Button", {disabled: true, caption: "<img src='/wavemaker/images/resourceManagerIcons/f_delete32.png'> " + bundleStudio.T_Delete, height: "36px", width: "150px"},{onclick: "deleteItem"}],
	      downloadFolderButton: ["wm.Button", {disabled: true, caption: "<img src='/wavemaker/images/resourceManagerIcons/f_download32.png'> " + bundleStudio.T_Download, height: "36px", width: "150px"},{onclick: "downloadItem"}],
	      addFolderButton: ["wm.Button", {disabled: true, caption: "<img src='/wavemaker/images/resourceManagerIcons/f_add32.png'> " + bundleStudio.T_Add_Folder, height: "36px", width: "150px"},{onclick: "addNewFolder"}]
  	    }],
	    resourcesFileToolBar: ["wm.Panel", {showing: false, height: "46px", width: "450px", border: "", layoutKind: "left-to-right"}, {}, {
	      renameFileButton: ["wm.Button", {caption: "<img src='/wavemaker/images/resourceManagerIcons/rename32.png'> " + bundleStudio.T_Rename, height: "36px", width: "150px"},{onclick: "renameItem"}],
	      deleteFileButton: ["wm.Button", {caption: "<img src='/wavemaker/images/resourceManagerIcons/d_delete32.png'> " + bundleStudio.T_Delete, height: "36px", width: "150px"},{onclick: "deleteItem"}],
	      downloadFileButton: ["wm.Button", {caption: "<img src='/wavemaker/images/resourceManagerIcons/d_download32.png'> " + bundleStudio.T_Download, height: "36px", width: "150px"},{onclick: "downloadItem"}]/*,
	      updateFileButton: ["wm.Button", {caption: "<img src='/wavemaker/images/resourceManagerIcons/d_update32.png'> " + bundleStudio.T_Replace, height: "36px", width: "150px"},{onclick: "updateItem"}]*/
  	    }],
	    addFileButton: ["wm.DojoFileUpload", {disabled: true, operation: "uploadFile", service: "resourceFileService", buttonCaption: "<img src='/wavemaker/images/resourceManagerIcons/d_add32.png'> " + bundleStudio.T_Add_File, height: "36px", width: "150px", uploadImmediately: true, useList: false, margin: 4}, {onSuccess: "fileUploadCompleted"}]
            }],

	    mainPanel: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "100%"}, {}, {
	      tree: ["wm.Tree", {width: "100%", height: "100%", scrollY: true, scrollX: true, margin: "0,5,10,5"}, {onselect: "itemSelected", ondeselect: "clearSelectedItem", onmousedown: "itemMouseDown"}, {}],
		resourcePropertiesContainer: ["wm.Panel", {_classes: {domNode: ["wm_BackgroundColor_Black"]}, height: "100%", width: "260px", verticalAlign: "top", margin: 0, layoutKind: "top-to-bottom"}, {}, {
		    resourcePropertiesHeader: ["wm.Panel", {height: "17px", width: "100%", verticalAlign: "bottom", layoutKind: "left-to-right", padding: "2,6,0,6", margin: "0,4,0,4"},{},{ 
			resourcePropertiesHeaderIcon: ["wm.Picture", {height: "15px", width: "15px", source: "", aspect: "h"}],
			resourcePropertiesHeaderLabel: ["wm.Label", {_classes: {domNode: ["wm_FontColor_White"]}, height: "15px", width: "100%", caption: bundleStudio.T_Properties}]
		    }],
		    resourceProperties: ["wm.Panel", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%", verticalAlign: "top", horizontalAlign: "left", margin: 4, padding: 6, layoutKind: "top-to-bottom"}, {}, {}]
		}]
	    }]
	}]
}
