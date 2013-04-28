dojo.provide("wm.base.MobilePlugin");
dojo.require("wm.base.Control");
dojo.require("wm.base.Plugin");


wm.Plugin.plugin("mobile", wm.Control, {
    deviceSizes: '',
    prepare: function(inProps) {
        this.mobileSocket(arguments);
        if (this.deviceSizes || inProps.deviceSizes || window["studio"] && this.deviceType) {
            this._mobileShowingRequested = this.showing;
            this.showing = this.updateMobileShowing(this.showing);
            this.subscribe("deviceSizeRecalc", this, "reshowMobile");
        }
    },
    reshowMobile: function() {
        this.setShowing(this._mobileShowingRequested || this.showing);
    },
    setShowing: function(inValue) {
        /* wm.Layer.setShowing calls TabDecorator.setShowing which calls wm.Control.setShowing, which would clobber our
         * _mobileShowingRequested value
         */
        if (this instanceof wm.Layer == false && this.deviceSizes || this._isDesignLoaded && this.deviceType) inValue = this.updateMobileShowing(inValue);
        this.mobileSocket(arguments);
    },
    updateMobileShowing: function(inValue) {
        if (!this._cupdating) this._mobileShowingRequested = inValue; // cache whether it should be showing even if we don't let it show
        if (this.deviceSizes && this.deviceSizes.length || this._isDesignLoaded && this.deviceType) {
            return inValue && this.isMobileShowAllowed();
        } else {
            return inValue;
        }
    },
    isMobileShowAllowed: function() {
        if (window["studio"] && this.isDesignLoaded()) {
            var deviceType = studio.currentDeviceType;
            if (deviceType && this.deviceType && dojo.indexOf(this.deviceType, deviceType) == -1) {
                return false;
            }

            var deviceSize = studio.deviceSizeSelect.getDataValue();
            if (!deviceSize) return true;
            if (deviceType == "desktop" || studio.portraitToggleButton.clicked) {
                deviceSize = deviceSize.width;
            } else {
                deviceSize = deviceSize.height;
            }
            if (deviceSize == "100%") return true;
            deviceSize = app.appRoot.calcDeviceSize(parseInt(deviceSize));
            var isOk = true;
            if (this.deviceSizes && dojo.indexOf(this.deviceSizes, deviceSize) == -1) return false;
            return true;
        } else {
            var deviceSize = app.appRoot.deviceSize;
            return (!deviceSize || dojo.indexOf(this.deviceSizes, deviceSize) != -1);
        }
    }
});

wm.Plugin.plugin("mobileLayer", wm.Layer, {
    deviceSizes: '',
    setShowing: function(inValue) {
        inValue = this.updateMobileShowing(inValue);
        this.mobileLayerSocket(arguments);
    }
});
