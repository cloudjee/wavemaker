/*
 * Copyright (C) 2011 WaveMaker Software, Inc.
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

MenuDesigner.widgets = {
	editMenuItemDialog: ["wm.DesignableDialog", {"height":"170px","title":"Edit Menu Item","width":"350px"}, {}, {
		containerWidget: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","margin":"0","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
		    menuItemName: ["wm.Text", {"caption":"Name","captionSize":"130px","displayValue":"", width:"100%"}, {"onEnterKeyPress":"onTextEnterKeyPress"}],
		        menuItemImageListPanel: ["wm.Panel", {layoutKind: "left-to-right", height: "24px", width: "100%"},{}, {
			    menuItemImageList: ["wm.SelectMenu", {"caption":"Image List (optional)","captionSize":"130px", width: "100%"}, {}],
			    menuItemImageListLabel: ["wm.Label", {width: "60px", height: "100%", caption: "Pick Icon:"}],
			    menuItemImageListBtn: ["wm.ToolButton", {width: "24px", height: "100%", margin: "2", padding: "0", border: "1"}, {onclick: "popupImageSelector"}]
			}],
		    menuItemIconClass: ["wm.Text", {"caption":"Icon Class","captionSize":"130px","displayValue":"",width:"100%"}, {"onEnterKeyPress":"onTextEnterKeyPress"}]
		}],
		buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			menuItemCancelButton: ["wm.Button", {"caption":"Cancel"}, {"onclick":"menuItemCancelButtonClick"}],
			menuItemOKButton: ["wm.Button", {"caption":"OK"}, {"onclick":"menuItemOKButtonClick"}]
		}]
	}],
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
	    panel1: ["wm.Panel", {"height":"20px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "2"}, {}, {
		AddButton: ["wm.ToolButton", {hint: "Add Menu Item", "caption":"","width":"18px", height: "16px", imageList: "smallToolbarImageList", imageIndex: 25}, {"onclick":"AddButtonClick"}],
		EditButton: ["wm.ToolButton", {hint: "Edit Menu Item (or double click item)", "caption":"","width":"18px", height: "16px", imageList: "studio.silkIconImageList", imageIndex: 75}, {"onclick":"EditButtonClick"}],
		DeleteButton: ["wm.ToolButton", {hint: "Delete Menu Item", "caption":"","width":"18px", height: "16px", imageList: "smallToolbarImageList", imageIndex: 0}, {"onclick":"DeleteButtonClick"}]//,
		//DefaultItemButton: ["wm.ToolButton", {hint: "Make selected item the initial button value", "caption":"","width":"16px", height: "16px", imageList: "smallToolbarImageList", imageIndex: 2}, {"onclick":"DefaultButtonClick"}]

		}],
	    panel3: ["wm.Panel", {height: "20px", "horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		treeLabel: ["wm.Label", {caption: "Use tree to design your dialog", height: "100%", width: "100%"}]/*,
		sampleLabel: ["wm.Label", {caption: "Your Menu", height: "100%", width: "115px"}]*/
	    }],
	    bevel1: ["wm.Bevel", {}],
		panel2: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			tree: ["wm.DraggableTree", {"border":"0","dropBetweenNodes":true,"height":"100%"}, {"ondblclick":"treeDblclick"}]/*,
			sample: ["wm.DojoMenu", {"eventList":[{"label":"File","children":[{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"}],"onClick":undefined},{"label":"Edit"},{"label":"Zoom"}],"height":"100%","structure":"{\"items\":[{\"label\":\"File\"},{\"label\":\"Edit\"},{\"label\":\"Zoom\"}]}","vertical":true,"width":"115px"}, {}]*/
		}],
	    buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, height: "20px", "horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "2,0,2,0", border: "1,0,0,0", height: "34px", horizontalAlign: "right"}, {}, {
			 CancelButton: ["wm.Button", {caption: "Cancel"}, {onclick: "mainCancelClick"}],
			 OKButton: ["wm.Button", {caption: "OK"}, {onclick: "mainOKClick"}]
		     }]
	}]
}