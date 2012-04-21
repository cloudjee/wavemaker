/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

dojo.provide("wm.base.widget.Layers.Decorator");

dojo.declare("wm.LayersDecorator", null, {
	decorationClass: "",
	constructor: function(inDecoree) {
		this.decoree = inDecoree;
	},
	destroy: function() {
		this.decoree = null;
	},
	decorate: function() {
		this.decorateContainer();
		this.decorateLayers();
	},
	decorateContainer: function() {
		var d = this.decoree;
		dojo.addClass(d.domNode, this.decorationClass);
	},
	decorateLayers: function() {
		dojo.forEach(this.decoree.layers, function(l, i) {
			this.decorateLayer(l, i);
		}, this);
	},
	decorateLayer: function(inLayer, inIndex) {
		inLayer.decorator = this;
	},
	undecorate: function() {
		this.undecorateContainer();
	    var layers = this.decoree.layers;
	    for (var i = layers.length-1; i >= 0; i--) {
			this.undecorateLayer(layers[i], i);
	    }
	},
	undecorateContainer: function() {
		dojo.removeClass(this.decoree.domNode, this.decorationClass);
	},
	undecorateLayer: function() {
	},
	setLayerShowing: function(inLayer, inShowing) {
	    if (this.active) {
		wm.Control.prototype.setShowing.call(inLayer, inShowing);
	    } else {
		inLayer.showing = inShowing;
	    }
	},
	setLayerActive: function(inLayer, inActive) {
	    if (inLayer.active == inActive)
		return;

	    inLayer.inFlow = inActive;
	    inLayer.active = inActive;

	    var page = inLayer.getParentPage();
	    if (!(dojo.isIE <= 8) && !this.decoree._cupdating && page && !page._loadingPage && !window["studio"] && this.decoree.transition && this.decoree.transition != "none") {
		if (!inActive) {
		    /* FADE OUT */
		    this["anim" + wm.capitalize(this.decoree.transition)](inLayer, false);
		} else {
		    this["anim" + wm.capitalize(this.decoree.transition)](inLayer, true);
		}
	    } else {			    
		inLayer.domNode.style.display = inActive ? '' : 'none';
	    }
/*
	    if (inActive) {
		inLayer.reflowParent();
	    }
	    */
		// design only code: need to show / hide designwrapper
		wm.fire(inLayer, 'domNodeShowingChanged', [inActive]);
	},
        animSlide: function(inLayer, inShowing) {
	    if (inShowing) {

		// Need to render it so it will slide correctly; needs to be non-hidden (but set opacity as low as it will go so its not visible either)
		inLayer.domNode.style.opacity = "0.1"; 
		inLayer.domNode.style.display = "";

		// ok, now move it to its starting positino and reset opacity
		var left = inLayer.bounds.w + "px";
		inLayer.domNode.style.left = (inLayer._transitionNext) ? left : "-" + left;
		inLayer.domNode.style.opacity = 1;

	    }
	    var newleft = (inShowing) ? 0 : inLayer._transitionNext ? - parseInt(inLayer.domNode.style.width) : parseInt(inLayer.domNode.style.width);
	    var anim = dojo.animateProperty({
		node: inLayer.domNode,
		properties:{
		    left: newleft
		},
		duration: 350
	    });
	    dojo.connect(anim,"onEnd", function(){
		console.log("animation ended");
		if (!inShowing) {
		    inLayer.domNode.style.display = "none";
		    inLayer.domNode.style.left = 0;
		}
	    });
	    anim.play();

    },
    animFade: function(inLayer, inShowing) {
	    if (inShowing) {
		inLayer.domNode.style.opacity = 0.01; // can't fade in if its opacity starts at 1!
		inLayer.domNode.style.display = "";
	    }
	    var newopacity = (inShowing) ? 1 : 0.01;
	    var anim = dojo.animateProperty({
		node: inLayer.domNode,
		properties:{
		    opacity: newopacity
		},
		duration: 350
	    });
	    dojo.connect(anim,"onEnd", function(){
		console.log("animation ended");
		if (!inShowing) {
		    inLayer.domNode.style.display = "none";
		    inLayer.domNode.style.opacity = 1;
		} else {
		    inLayer.reflow();
		}
	    });
	    anim.play();

    },

	activateLayer: function(inLayer) {
		var d = this.decoree;
		var old = d.getLayer(d.lastLayerIndex);
	        if (old && old != inLayer) {
		        old._transitionNext = inLayer._transitionNext = inLayer.getIndex() > old.getIndex();
			this.setLayerActive(old, false);		    
		}
		this.setLayerActive(inLayer, true);
	    d.reflowParent();
	},
	// default decorator has no caption
	applyLayerCaption: function() {
	},
	moveLayerIndex: function(inFromIndex, inToIndex) {
		var d = this.decoree, l = d.getLayer(inFromIndex);
		// move in client
		d.client.removeControl(l);
		d.client.insertControl(l, inToIndex);
	}
});
