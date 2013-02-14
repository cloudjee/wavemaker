dojo.declare("IssueCloud65", wm.Application, {
	"dialogAnimationTime": 350, 
	"disableDirtyEditorTracking": false, 
	"eventDelay": 0, 
	"i18n": false, 
	"isLoginPageEnabled": true, 
	"isSecurityEnabled": true, 
	"main": "Main", 
	"manageHistory": true, 
	"manageURL": true, 
	"name": "", 
	"onclickdelay": 0, 
	"phoneGapLoginPage": "Login", 
	"phoneMain": "PhoneMain", 
	"projectSubVersion": "Alpha0", 
	"projectVersion": 1, 
	"studioVersion": "6.5.2.Release", 
	"tabletMain": "", 
	"theme": "wm_coolblue", 
	"toastPosition": "br", 
	"touchToClickDelay": 500, 
	"touchToRightClickDelay": 1500,
	"widgets": {
		silkIconList: ["wm.ImageList", {"colCount":39,"height":16,"iconCount":90,"url":"lib/images/silkIcons/silk.png","width":16}, {}], 
		userIdSVar: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getUserId","service":"securityService","startUpdate":true}, {}, {
			input: ["wm.ServiceInput", {"type":"getUserIdInputs"}, {}]
		}]
	},
	_end: 0
});

IssueCloud65.extend({

	_end: 0
});