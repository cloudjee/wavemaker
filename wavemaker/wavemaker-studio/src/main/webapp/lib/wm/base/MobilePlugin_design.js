
dojo.provide("wm.base.MobilePlugin_design");
dojo.require("wm.base.MobilePlugin");

wm.Component.extend({
    set_deviceSizes: function(inSize) {
        this.deviceSizes = inSize;
        var found = false;
        for (var i = 0; i < this._subscriptions.length; i++) {
            if (this._subscriptions[i][0] == "deviceSizeRecalc") {
                found = true;
                break;
            }
        }
        if (!found) {
            this.subscribe("deviceSizeRecalc", this, "reshowMobile");
        }
        this.reshowMobile();
    },
    set_deviceType: function(inType) {
        this.deviceType = inType;
        var deviceType = studio.currentDeviceType;
        this.setShowing(this._mobileShowingRequested || this.showing);

        var found = false;
        for (var i = 0; i < this._subscriptions.length; i++) {
            if (this._subscriptions[i][0] == "deviceSizeRecalc") {
                found = true;
                break;
            }
        }
        if (!found) {
            this.subscribe("deviceSizeRecalc", this, "reshowMobile");
        }
        this.reshowMobile();
    }
});


wm.Object.extendSchema(wm.Control, {
    deviceSizes: {group: "mobile", subgroup: "devices", shortname: "showForDeviceSizes", nonlocalizable:1, editor: "wm.prop.DeviceSizeEditor", order: 101},
    deviceType: {group: "mobile",  subgroup: "devices", nonlocalizable:1, editor: "wm.prop.DeviceListEditor",  order: 100}
}, true);