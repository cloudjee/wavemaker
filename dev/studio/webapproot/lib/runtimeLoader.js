/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

try
{
	dojo.registerModulePath("lib", wm.libPath);
	dojo.registerModulePath(
		["wm", wm.libPath + "wm"],
		["wm.packages", wm.libPath + "wm/common/packages"],
		["common", wm.libPath + "wm/common"],
		["wm.modules", wm.basePath + "modules/ep"]
	);

	// Load minified built version of libraries when not booting in debug mode
	if (!djConfig.debugBoot) 
	{
		// Register paths for compressed parts of dojo
		dojo.registerModulePath("dojo.nls", wm.libPath + "build/nls");
		dojo.registerModulePath("dijit.themes.tundra", wm.libPath + "build/themes/tundra");
		dojo.require("lib.build.Gzipped.lib_build", true);
		//dojo.require("lib.build.lib_build_uncompressed", true);  
		dojo.require("lib.runtime_manifest", true);
	}
	else
	{
		// Load lib manifest, ensuring anything not included in build will be loaded explicitly
		dojo.require("lib.manifest", true);
	}
}
catch (e)
{
	console.info('error while loading runtime_loader.js file: ' + e.message);
}
