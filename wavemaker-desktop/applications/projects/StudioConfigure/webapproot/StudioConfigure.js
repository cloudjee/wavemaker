dojo.declare("StudioConfigure", wm.Application, {
	"dialogAnimationTime": 350, 
	"disableDirtyEditorTracking": false, 
	"eventDelay": 0, 
	"i18n": false, 
	"main": "Main", 
	"manageHistory": true, 
	"manageURL": true, 
	"name": "", 
	"phoneMain": "", 
	"projectSubVersion": 139, 
	"projectVersion": 1, 
	"saveCounter": 8, 
	"studioVersion": "6.5.0DevBuild", 
	"tabletMain": "", 
	"theme": "wm_studio", 
	"toastPosition": "br", 
	"touchToClickDelay": 500, 
	"touchToRightClickDelay": 1500,
	"widgets": {
		silkIconList: ["wm.ImageList", {"colCount":39,"height":16,"iconCount":90,"url":"lib/images/silkIcons/silk.png","width":16}, {}], 
		InstallService: ["wm.JsonRpcService", {"service":"InstallService"}, {}], 
		navigationService: ["wm.NavigationService", {"service":"navigationService"}, {}]
	},
	_end: 0
});

StudioConfigure.extend({

	_end: 0
});