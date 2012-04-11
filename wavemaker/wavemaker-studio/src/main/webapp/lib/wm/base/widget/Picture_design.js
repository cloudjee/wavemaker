/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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
dojo.provide("wm.base.widget.Picture_design");
dojo.require("wm.base.widget.Picture");
dojo.require("wm.base.Control_design");
wm.Object.extendSchema(wm.Picture, {

    /* Display group; visual subgroup */
    source: {group: "display", subgroup: "visual", type: "String", bindable: 1, order: 1, focus: 1, subtype: "File", extensionMatch: ["jpg","jpeg","gif","png","tiff"], simpleBindTarget: true, requiredGroup: 1},
    imageList: {group: "display", subgroup: "visual", advanced:1},
    imageIndex: { group: "display", subgroup: "visual", advanced:1},
    editImageIndex: { group: "display", subgroup: "visual", advanced:1},


    /* Display group; misc subgroup */
    link: {group: "display", subgroup: "misc", type: "String", bindable: 1},

    /* Display group; layout subgroup */
    aspect: { group: "display", subgroup: "layout", order: 50, options: ["none","h","v"]},

    /* Methods group */
    setSource: {method:1},
    setLink: {method:1},
    setCaption: {method:1},
    setImageIndex: {method:1}

});

// design-time 
dojo.extend(wm.Picture, {
        scrim: true,
        themeable: false,
        themeableDemoProps: {source: "images/add.png"}
});
/*
makePictureSourcePropEdit = function(inName, inValue, inDefault) {
	var i = makeInputPropEdit(inName, inValue, inDefault);
	var f = '<form class="inspector-filebox"><input class="inspector-fileinput" onchange="inspectFileboxUrlChange.call(this)" size="1" type="file"/></form>';
	return '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td>' + i + '</td><td>' + f + '</td></tr></table>';
}

*/