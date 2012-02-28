dojo.provide("wm.base.widget.Layers.BreadcrumbDecorator");
dojo.require("wm.base.widget.Layers.TabsDecorator");

dojo.declare("wm.BreadcrumbDecorator", wm.TabsDecorator, {
    decorationClass: "wmbreadcrumblayers",
    decoratorPadding: "2",

    /* Whenever a layer is set to active, we need to show it, and make it the rightmost visible layer
     * Whenever a layer is set to inactive, we need to hide it if the current layer is left of this layer.
     */
    setLayerActive: function(inLayer, inActive) {
	var wasShowing = inLayer.showing;
	this.inherited(arguments);
	if (inLayer._isDesignLoaded || this.decoree._cupdating ) return;

	var layers = this.decoree.layers;

	/* If we're activating a hidden layer, show that layer and move it after the last visisible layer so
	 * that it appears to be the last breadcrumb/step. */
	if (inActive && !wasShowing) {
	    var layerIndex = inLayer.getIndex();
	    for (var i = layers.length-1; i > layerIndex; i--) {
		if (layers[i].showing)
		    break;
	    }
	    if (i > layerIndex) {
		this.decoree.moveLayerIndex(inLayer,i+1);
	    }
	    inLayer.show();
	    if (inLayer.showing) {
		inLayer.domNode.style.display = "";
		inLayer.reflow();
	    }
	}
	/* If activating a layer that is already showing, hide any layers that are after this layer */
	else if (inActive) {
	    for (var i = inLayer.getIndex()+1; i < layers.length; i++) {
		if (layers[i].showing) layers[i].setShowing(false);
	    }
	}

	/* If hide all layers after the layer that is activated */
	if (inActive) {
	    this.decoree.layerIndex = inLayer.getIndex();
	    var count = this.decoree.layers.length;
	    for (var i = inLayer.getIndex() + 1; i < count; i++) {
		if (this.decoree.layers[i].showing)
		    this.decoree.layers[i].hide();
	    }
	}
    }

});
