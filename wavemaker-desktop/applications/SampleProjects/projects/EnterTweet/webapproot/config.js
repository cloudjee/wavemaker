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
