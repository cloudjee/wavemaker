dojo.provide("wm.base.components.NavigationService_design");
dojo.require("wm.base.components.NavigationService");

wm.Object.extendSchema(wm.NavigationCall,{
    owner: {ignoreHint: "Owner only available for some types of operations"},
	autoUpdate: {ignore: 1},
        startUpdateComplete: { ignore: 1},
	startUpdate: {ignore: 1},
	service: {ignore: 1, writeonly: 1},
    name: {requiredGroup: 0}, // hide the required group; too few properties to justify it
    operation: { group: "data", order: 1},
	updateNow: { ignore: 1},
    queue: { group: "operation", operation:1, order: 20},
    clearInput: { group: "operation", operation:1, order: 30},
    input: {group: "data", order: 3, putWiresInSubcomponent: "input", bindTarget: 1, treeBindField: true, editor: "wm.prop.NavigationGroupEditor"},
    inFlightBehavior: {ignore:1}
});

// design only...
/**#@+ @design */
wm.NavigationCall.extend({
	listProperties: function() {
		var result = this.inherited(arguments);
		result.owner.ignoretmp = (this.operation == "gotoPage" || this.operation == "gotoDialogPage") ? 0 : 1;
		return result;
	},
	operationChanged: function() {
		this.inherited(arguments);
	    if (this.isDesignLoaded() && this.owner instanceof wm.Application && this.operation != "gotoPage" && this.operation != "gotoDialogPage" && studio.page) {
			this.set_owner("Page");
		}
	}

});
/**#@- @design */

wm.NavigationCall.description = "Navigation service call.";
