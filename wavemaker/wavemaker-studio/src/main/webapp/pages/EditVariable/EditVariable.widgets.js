/*
 * Copyright (C) 2011 VMware, Inc. All rights reserved.
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
 

EditVariable.widgets = {
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
    layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"},{}, {
	dialog: ["wm.Panel", {width:"100%",height:"100%",border: "10", borderColor: "#424A5A" }, {}, {
	    tabs: ["wm.TabLayers", {width: "100%", height: "100%", clientBorder: "3,0,0,0",clientBorderColor: "#959DAB"}, {}, {
		guiLayer: ["wm.Layer", {caption: "Field Editor"}, {onShow: "onGuiShow"}, {
		    panel1: ["wm.Panel", {"height":"20px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "2"}, {}, {
			AddButton: ["wm.ToolButton", {hint: "Add Menu Item", "caption":"","width":"18px", height: "16px", imageList: "smallToolbarImageList", imageIndex: 25}, {"onclick":"addButtonClick"}],
			DeleteButton: ["wm.ToolButton", {hint: "Delete Menu Item", "caption":"","width":"18px", height: "16px", imageList: "smallToolbarImageList", imageIndex: 0}, {"onclick":"deleteButtonClick"}]//,
			//DefaultItemButton: ["wm.ToolButton", {hint: "Make selected item the initial button value", "caption":"","width":"16px", height: "16px", imageList: "smallToolbarImageList", imageIndex: 2}, {"onclick":"DefaultButtonClick"}]

		    }],
		    panel2: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "10"}, {}, {
			tree: ["wm.Tree", {"border":"0","dropBetweenNodes":true,"height":"100%"}, {"ondblclick":"treeDblclick", ondeselect: "treeSelect", onselect: "treeSelect"}]/*,
																						    sample: ["wm.DojoMenu", {"eventList":[{"label":"File","children":[{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"}],"onClick":undefined},{"label":"Edit"},{"label":"Zoom"}],"height":"100%","structure":"{\"items\":[{\"label\":\"File\"},{\"label\":\"Edit\"},{\"label\":\"Zoom\"}]}","vertical":true,"width":"115px"}, {}]*/
		    }]
		}],
		textLayer: ["wm.Layer", {caption: "Text Editor"}, {onShow: "updateText"}, {
		    text: ["wm.AceEditor", {width: "100%", height: "100%"}, {onChange: "onAceChange"}]
		}]
	    }]
	}],
	    buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, height: "20px", "horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "2,0,2,0", border: "1,0,0,0", height: "34px", horizontalAlign: "right"}, {}, {
			 CancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel"}, {onclick: "cancelClick"}],
			 OKButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK"}, {onclick: "okClick"}]
		     }]
	}]
}