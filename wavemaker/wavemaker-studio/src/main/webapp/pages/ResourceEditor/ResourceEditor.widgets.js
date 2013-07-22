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
 

ResourceEditor.widgets = {  
    layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top", layoutKind: "top-to-bottom"}, {}, {
	scriptRibbon: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, height: "30px", width: "100%", border: "0", layoutKind: "left-to-right", imageList: "studio.smallToolbarImageList", padding: "0,4", border: "0,0,1,0", borderColor: "#959DAB"}, {}, {
	    saveBtn: ["wm.studio.ToolbarButton", {hint: "Save", imageIndex: 8}, {onclick: "saveTextEditor"}],
	    findBtn: ["wm.studio.ToolbarButton", { hint: "Search", iconUrl: "lib/images/silkIcons/magnifier.png"}, {onclick: "findScriptClick"}],
	    refreshBtn: ["wm.studio.ToolbarButton", { hint: "Refresh from Server", imageIndex: 27}, {onclick: "refreshScriptClick"}],
	    formatBtn: ["wm.studio.ToolbarButton", { hint: "Reformat Code", imageIndex: 29}, {onclick: "formatScriptClick"}],
	    wordWrapBtn: ["wm.studio.ToolbarButton", {_classes: {domNode: ["ToggleWordWrap", "StudioToolbarButton"]}, hint: "Toggle Line Wrapping", imageIndex: 15, imageList: "studio.canvasToolbarImageList16"}, {onclick: "toggleWrapScriptClick"}],
	    editorHelpBtn: ["wm.studio.ToolbarButton", {hint: "Help", imageIndex: 26}, {onclick: "showEditorHelp"}],
	    fullPath: ["wm.Label", {width: "100%", align: "right", height: "100%"}]	    
	}],
	editor: ["wm.AceEditor", {width: "100%", height: "100%", dataValue: "", syntax: "text"}, {onCtrlKey: "scriptEditorCtrlKey",onChange: "editorChange"}],
	picture: ["wm.Picture", {showing: false, width: "100%", height: "100%"}]
    }]
}
