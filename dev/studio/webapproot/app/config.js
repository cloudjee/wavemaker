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
        studioVersion: '6.3.0DevBuild - community',
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
