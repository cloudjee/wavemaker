dojo.provide("wm.base.widget.BreadcrumbLayers");
dojo.require("wm.base.widget.Layers");

dojo.declare("wm.BreadcrumbLayers", wm.Layers, {
    conditionalTabButtons: true,
    themeStyleType: "ContentPanel",
    layersType: 'Breadcrumb',
    transition: "fade",
    headerWidth: "50px",
    layerBorder: 1,
    postInit: function() {
	this.inherited(arguments);
	this._inBreadcrumbPostInit = true;
	var active = this.getActiveLayer();
	if (!this._isDesignLoaded) {
	    for (var i= 0; i < this.layers.length; i++) {
		if (this.layers[i] != active) {
		    this.layers[i].setShowing(false);
		}
	    }
	}
	delete this._inBreadcrumbPostInit ;
    },
    oncanchange: function(inChangeInfo) {
	var l = this.getLayer(inChangeInfo.newIndex);
	inChangeInfo.canChange = l;
    },
    addWidget: function(inWidget) {
	this.inherited(arguments);	
	if (!this._isDesignLoaded && !this._loading && inWidget instanceof wm.Layer && !inWidget.isActive()) {
	    inWidget.setShowing(false);
	}
    },
    _setLayerIndex: function(inIndex) {
	var l = this.layers[inIndex];
	if (l) l.setShowing(true);
	this.inherited(arguments);
    }
});
