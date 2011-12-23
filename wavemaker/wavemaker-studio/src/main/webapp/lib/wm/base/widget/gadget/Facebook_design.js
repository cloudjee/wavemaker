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


dojo.provide("wm.base.widget.gadget.Facebook_design");
dojo.require("wm.base.widget.gadget.Facebook");
dojo.require("wm.base.Control_design");
 


wm.Object.extendSchema(wm.gadget.Facebook, {
    base_source: {ignore: 1}
});


wm.Object.extendSchema(wm.gadget.FacebookLikeButton, {
    href: {bindTarget: true},
    layout: {group: "Facebook", options: ["standard", "button_count", "box_count"]},
    action: {group: "Facebook", options: ["like", "recommend"]},
    font: {group: "Facebook", options: ["arial", "licida grande", "segoe ui", "tahoma", "trebuchet ms", "verdana"]},
    colorscheme: {group: "Facebook", options: ["dark","light"]},
    href: {group:"Facebook"},
    ref: {group:"Facebook"},
    show_faces: {group:"Facebook"},
});
wm.Object.extendSchema(wm.gadget.FacebookActivityFeed, {
    colorscheme: {group:"display"},
    font:  {group:"display"},
    showHeader: {group: "Facebook"},
    showRecommendations: {group: "Facebook"},
    font: {group: "Facebook", options:["arial", "licida grande", "segoe ui", "tahoma", "trebuchet ms", "verdana"]},
    colorscheme: {group: "Facebook", options: ["dark","light"]}, 
    ref: {group: "Facebook"},
    site: {group: "Facebook"}

});