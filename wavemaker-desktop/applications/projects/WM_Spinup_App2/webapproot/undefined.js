dojo.declare("WM_Spinup_App2", wm.Application, {
	"dialogAnimationTime": 350, 
	"disableDirtyEditorTracking": false, 
	"eventDelay": 0, 
	"i18n": false, 
	"main": "Main", 
	"manageHistory": true, 
	"manageURL": true, 
	"name": "", 
	"phoneMain": "", 
	"projectSubVersion": "Alpha9", 
	"projectVersion": 1, 
	"saveCounter": 266, 
	"studioVersion": "6.5.0.M1", 
	"tabletMain": "", 
	"theme": "wm_default", 
	"toastPosition": "br", 
	"touchToClickDelay": 500, 
	"touchToRightClickDelay": 1500,
	"widgets": {
		silkIconList: ["wm.ImageList", {"colCount":39,"height":16,"iconCount":90,"url":"lib/images/silkIcons/silk.png","width":16}, {}], 
		SpinUpService: ["wm.JsonRpcService", {"service":"SpinUpService"}, {}], 
		navigationService: ["wm.NavigationService", {"service":"navigationService"}, {}], 
		notificationService: ["wm.NotificationService", {"service":"notificationService"}, {}], 
		resourceFileService: ["wm.JsonRpcService", {"service":"resourceFileService"}, {}]
	},
	_end: 0
});

WM_Spinup_App2.extend({

	_end: 0
});