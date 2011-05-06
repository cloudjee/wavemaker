/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
 
dojo.provide("wm.studio.app.keyconfig");

wm.studioConfig = wm.studioConfig || {};

// hotkey is always CTRL + key
wm.studioConfig.hotkeyMap = [
	{key: "X", action: "cutClick" },
	{key: "C", action: "copyClick" },
	{key: "V", action: "pasteClick" },
	{key: "W", action: "toggleWidthClick" },
	{key: "H", action: "toggleHeightClick" },
	{key: "F", action: "toggleFlexBcClick" },
	{key: "O", action: "toggleHorizontalAlignClick" },
	{key: "E", action: "toggleVerticalAlignClick" },
	{key: "B", action: "toggleLayoutClick" },
	{key: "Z", action: "undoClick" },
	{key: "M", action: "navGotoPaletteModelClick", always: true },
	{key: "S", action: "saveProjectClick", always: true, idleDelay: true },
	{key: "R", action: "runProjectClick", always: true, idleDelay: true}
];

wm.studioConfig.hotkeyCodeMap = [
	{ key: dojo.keys.ESCAPE, action: "selectParent" },
	// mac delete key
	{ key: 46, action: "deleteControl"},
	{ key: dojo.keys.DELETE, action: "deleteControl"},
        { key: dojo.keys.BACKSPACE, action: "nullAction"},
        { key: 191, action: "keyboardShortcutsDialog"} // "?" character
];
