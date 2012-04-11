/*
 * Copyright (C) 2010-2012 VMware, Inc. All rights reserved.
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
 

/* Project specific configuration */
djConfig = { 
	usePlainJson: true
};

djConfig.debugBoot = location.search.indexOf("debug") >=0;
djConfig.popup = djConfig.debugBoot;//location.search.indexOf("popup") >= 0;
djConfig.isDebug = djConfig.debugBoot;
djConfig.gfxRenderer = 'svg,silverlight';

if (djConfig.isDebug) {
	djConfig.debugBase = true;
	djConfig.noFirebugLite = false;
}

wm = {};
wm.basePath = "../../../";
wm.libPath = wm.basePath + "lib/";
wm.relativeLibPath = "../wavemaker/lib/";
wm.images = wm.libPath + "wm/base/widget/themes/default/images/";
wm.logging = (location.search.indexOf("logging") >= 0);
wm.checkGoogleFrame = false;