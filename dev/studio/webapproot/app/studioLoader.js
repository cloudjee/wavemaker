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
 

dojo.registerModulePath("studio", wm.basePath);
dojo.registerModulePath("lib", wm.libPath);
dojo.registerModulePath("wm", wm.libPath + "/wm");
dojo.registerModulePath("wm.language", wm.libPath + "/wm/language");
dojo.registerModulePath("language", window.location.pathname.replace(/[^\/]*$/,"language"));

wm.locale = {};
dojo.requireLocalization("wm.language", "components");
wm.locale.phrases = dojo.i18n.getLocalization("wm.language", "components");

dojo.requireLocalization("wm.language", "properties");
wm.locale.props = dojo.i18n.getLocalization("wm.language", "properties");

dojo.requireLocalization("language", "package");
window.bundlePackage = dojo.i18n.getLocalization("language", "package");

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

