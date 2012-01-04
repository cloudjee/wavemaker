/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Buttons.BusyButton_design");
dojo.require("wm.base.widget.Buttons.BusyButton");
dojo.require("wm.base.widget.Buttons.Button_design");

wm.Object.extendSchema(wm.BusyButton, {

    /* display group; misc subgroup */
    clickVariable:  {group: "widgetName", subgroup: "data", bindTarget: 1, order: 29, type: "wm.ServiceVariable", createWire: 1, editor: "wm.prop.DataSetSelect", editorProps: {servicesOnly: true, listMatch: undefined}, requiredGroup:1},

    /* display group, layout subgroup */
    defaultIconUrl: {group: "widgetName", subgroup: "graphics", bindTarget: true, order: 30, type: "String", subtype: "File"},
    iconLoadingUrl: {group: "widgetName", subgroup: "graphics", bindTarget: true, order: 31, type: "String", subtype: "File"},
    iconSuccessUrl: {group: "widgetName", subgroup: "graphics", bindTarget: true, order: 32, type: "String", subtype: "File"},
    iconErrorUrl:   {group: "widgetName", subgroup: "graphics", bindTarget: true, order: 33, type: "String", subtype: "File"},

    iconWidth:       {group: "widgetName", subgroup: "graphics", order: 34},
    iconHeight:      {group: "widgetName", subgroup: "graphics", order: 35},
    iconMargin:      {group: "widgetName", subgroup: "graphics", order: 36},

    /* Events group */
    onError: {advanced:1},
    onResult:{advanced:1},
    onSuccess:{advanced:1},

    /* Ignored Group */
      iconUrl: {ignore: 1},
      imageList: {ignore: 1},
      imageIndex: {ignore: 1},
    editImageIndex: {ignore: 1}
});

wm.BusyButton.extend({
	set_clickVariable: function(inVar) {
		// support setting dataSet via id from designer
		if (inVar && !(inVar instanceof wm.ServiceVariable)) {
			var ds = this.getValueById(inVar);
			if (ds)
				this.components.binding.addWire("", "clickVariable", ds.getId());
		} else
		    this.setClickVariable(inVar);
	}

});

wm.BusyButton.description = "A button that indicates when its ServiceVariable/LiveVariable is processing the button's action";
