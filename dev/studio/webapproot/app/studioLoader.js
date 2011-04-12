/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
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

dojo.registerModulePath("studio", wm.basePath);
dojo.registerModulePath("lib", wm.libPath);
dojo.registerModulePath("wm", wm.libPath + "/wm");

// make sure package registration is available up front
dojo.require("studio.app.packageLoader", true);

// Load minified built version of libraries when not booting in debug mode
if (!djConfig.debugBoot) {
	// Note: re-register paths for compressed parts of dojo
	dojo.registerModulePath("dojo.nls", wm.libPath + "/../build/nls");
        //dojo.registerModulePath("dijit.themes.tundra", wm.libPath + "build/themes/tundra");
	//
	wm.loadLibs([
		"studio.build.studio_base",
		"studio.build.studio_wm",
		"studio.build.studio"
	]);
}
// Load all required runtime libraries.
// Note: anything not included in build will be loaded.
dojo.require("lib.manifest", true);

// Load studio code and design extensions
dojo.require("studio.app.manifest", true);

wm.locale = {};
dojo.requireLocalization("wm.language", "components");
wm.locale.phrases = dojo.i18n.getLocalization("wm.language", "components");

dojo.requireLocalization("wm.language", "properties");
wm.locale.props = dojo.i18n.getLocalization("wm.language", "properties");