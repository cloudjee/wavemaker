/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
	{ key: dojo.keys.BACKSPACE, action: "nullAction"}
];
