/*
 * Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
 
djConfig = { 
	usePlainJson: true
};

djConfig.debugBoot = location.search.indexOf("debug") >=0;
djConfig.popup = djConfig.debugBoot;//location.search.indexOf("popup") >= 0;
djConfig.isDebug = djConfig.debugBoot;
djConfig.gfxRenderer = 'svg,silverlight';
djConfig.modulePaths = {language : '../../../language'};


if (djConfig.isDebug) {
	djConfig.debugBase = true;
	djConfig.noFirebugLite = false;
}

wm = {};

wm.studioConfig = {
        studioVersion: '6.4.2Beta',
	preventUnloadWarning: true,
	previewPopup: false,
	preventLiveData: (location.search.indexOf("nolive") >= 0),
	preventSubPages: (location.search.indexOf("nopages") >= 0),
	isPalmApp: location.search.indexOf("palm") >= 0
};

wm.basePath = "../../../";
wm.libPath = wm.basePath + "lib";
wm.relativeLibPath = "lib/";
wm.logging = (location.search.indexOf("logging") >= 0)
wm.checkGoogleFrame = true;
//wm.branding = "infoteria";