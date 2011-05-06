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
	    addFileButton: ["wm.DojoFileUpload", {disabled: true, operation: "uploadFile", service: "resourceFileService", buttonCaption: "<img src='/wavemaker/images/resourceManagerIcons/d_add32.png'> Add File", height: "36px", width: "150px", uploadImmediately: true, useList: false, margin: 4}, {onSuccess: "fileUploadCompleted"}]
            }],

	    mainPanel: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "100%"}, {}, {
	      tree: ["wm.Tree", {width: "100%", height: "100%", scrollY: true, scrollX: true, margin: "0,5,10,5"}, {onselect: "itemSelected", ondeselect: "clearSelectedItem", onmousedown: "itemMouseDown"}, {}],
		resourcePropertiesContainer: ["wm.Panel", {_classes: {domNode: ["wm_BackgroundColor_Black"]}, height: "100%", width: "260px", verticalAlign: "top", margin: 0, layoutKind: "top-to-bottom"}, {}, {
		    resourcePropertiesHeader: ["wm.Panel", {height: "17px", width: "100%", verticalAlign: "bottom", layoutKind: "left-to-right", padding: "2,6,0,6", margin: "0,4,0,4"},{},{ 
			resourcePropertiesHeaderIcon: ["wm.Picture", {height: "15px", width: "15px", source: "", aspect: "h"}],
			resourcePropertiesHeaderLabel: ["wm.Label", {_classes: {domNode: ["wm_FontColor_White"]}, height: "15px", width: "100%", caption: "Properties"}]
		    }],
		    resourceProperties: ["wm.Panel", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%", verticalAlign: "top", horizontalAlign: "left", margin: 4, padding: 6, layoutKind: "top-to-bottom"}, {}, {}]
		}]
	    }]
	}]
}
