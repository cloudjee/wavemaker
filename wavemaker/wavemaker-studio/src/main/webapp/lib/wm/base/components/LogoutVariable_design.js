dojo.provide("wm.base.components.LogoutVariable_design");
dojo.require("wm.base.components.LogoutVariable");
wm.Object.extendSchema(wm.LogoutVariable, {
    clearDataOnLogout: {group: "widgetName", subgroup: "behavior"},
    downloadFile: {ignore: 1},
	logoutNavCall: {ignore: 1},
	operation: { ignore:1},
        clearInput: { ignore: 1},
	onSetData: {ignore: 1},
	service: {ignore: 1},
        autoUpdate: {ignore: 1},
        startUpdate: {ignore: 1},
        updateNow: {ignore: 1},
        queue: {ignore: 1},
        maxResults: {ignore: 1},
        designMaxResults: {ignore: 1}
  });


wm.LogoutVariable.description = "Data from a service.";

/**#@+ @design */
wm.LogoutVariable.extend({
	/** @lends wm.LogoutVariable.prototype */
  });
/**#@- @design */
