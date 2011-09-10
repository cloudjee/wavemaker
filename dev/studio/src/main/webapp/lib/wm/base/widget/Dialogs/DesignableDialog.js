/*
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Dialogs.DesignableDialog");
dojo.require("wm.base.widget.Dialogs.Dialog");


/* Use designable dialog if your planning to design it in studio; if programatically creating a dialog use wm.Dialog */
dojo.declare("wm.DesignableDialog", wm.Dialog, {
    _pageOwnsWidgets: true,
    useButtonBar: false, // its false so we can add it in paletteDrop, but then the user can delete it if they want
    border: "1",
    borderColor: "black",
    titlebarBorder: "1",
    titlebarBorderColor: "black",
    footerBorderColor: "black",
    scrim: false,
    useContainerWidget: true,
    title: "Dialog",
    postInit: function() {
	this.inherited(arguments);
	delete this.containerNode; // containerNode is where child nodes get added to when appending children; just let the normal parent/child relationships prevail...
    }
});
