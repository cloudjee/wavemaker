/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.mobile.Layers.Decorator");

dojo.declare("wm.mobile.LayersDecorator", null, {
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
		wm.Control.prototype.setShowing.call(inLayer, inShowing);
	},
	setLayerActive: function(inLayer, inActive) {
	    if (inLayer.active == inActive)
		return;

	    inLayer.inFlow = inActive;
	    inLayer.active = inActive;
	   
	    var page = inLayer.getParentPage();
	    if (!this.decoree._loading  && !page._loadingPage) {
		var classNames = inLayer.domNode.className.split(/\s+/);
		var transition = this.decoree.showingCount > 1 ? "fade" : this.decoree.transition || "fade";

		/*
 		  dojo[inActive ? "addClass" : "removeClass"](inLayer.domNode, "mblLayerShowing");
		  dojo[!inActive ? "addClass" : "removeClass"](inLayer.domNode, "mblLayerHiding");
		*/

		if (!transition || transition == "none") {
		    inLayer.domNode.style.display = inActive ? "" : "none";
		} else if (transition == "slide") {

		    // If this is the layer being activated, find the layer that was active so we can deterimne slideright or left
		    if (inActive) {
			var oldLayer = this.decoree.layers[this.decoree.lastLayerIndex];
			if (!oldLayer) {
			    transition = "fade";
			} else if (oldLayer.getIndex() > inLayer.getIndex()) {
			    transition = "SlideRight";
			} else {
			    transition = "SlideLeft";
			}
		    } else {
			// get the layer that has been activated
			var newLayer = this.decoree.getActiveLayer();

			// If dismissing this layer in favor of one with a higher index, we dismiss to the left
			if (newLayer.getIndex() > inLayer.getIndex()) {
			    transition = "SlideLeft";
			} else {
			    transition = "SlideRight";
			}
		    }
		    //alert(inActive + transition);
		    wm.Array.removeElement(classNames, "mblLayerSlideRightIn");
		    wm.Array.removeElement(classNames, "mblLayerSlideRightOut");
		    wm.Array.removeElement(classNames, "mblLayerSlideLeftIn");
		    wm.Array.removeElement(classNames, "mblLayerSlideLeftOut");
		    wm.Array.removeElement(classNames, "mblLayerFadeIn");
		}

		if (inActive) {
		    console.log(inLayer.toString() + "; transition: " + transition);

		    var removeName = "mblLayer" + wm.capitalize(transition) + "Out";
		    var addName = "mblLayer" + wm.capitalize(transition) + "In";
		    wm.Array.removeElement(classNames, removeName);
		    classNames.push(addName);
		    wm.job(inLayer.getRuntimeId() + ".animateHide", 0, function() {}); //cancel the inActive setTimeout
		} else {
		    var addName = "mblLayer" + wm.capitalize(transition) + "Out";
		    var removeName = "mblLayer" + wm.capitalize(transition) + "In";
		    wm.Array.removeElement(classNames, removeName);
		    classNames.push(addName);
		    wm.job(inLayer.getRuntimeId() + ".animateHide", 700, dojo.hitch(inLayer, "animationEnd")); // the webkit endAnimation callback sets display=none AFTER the animation resets; we need to hide it before it resets or there is flicker; set this to 100ms before animation ends; the fact that this doesn't fix the fi
		}
		inLayer.domNode.className = classNames.join(" ");
		inLayer.domNode.style.display = ""; // can't do animations if display == "none"
		
	    } else {
		inLayer.domNode.style.display = inActive ? "" : "none";
		console.log("DOM " + inLayer.toString() + inLayer.domNode.style.display);
	    }

	    if(inActive && this.decoree instanceof wm.mobile.SideBySideLayers == false)
		inLayer.reflow();

		// design only code: need to show / hide designwrapper
		wm.fire(inLayer, 'domNodeShowingChanged', [inActive]);
	},
        animSlide: function(inLayer, inShowing) {
	    if (inShowing) {

		// Need to render it so it will slide correctly; needs to be non-hidden (but set opacity as low as it will go so its not visible either)
		inLayer.domNode.style.opacity = "0.1"; 
		inLayer.domNode.style.display = "";
		inLayer.reflowParent();

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
		}
	    });
	    anim.play();

    },

	activateLayer: function(inLayer) {
		var d = this.decoree;
		var old = d.getLayer(d.lastLayerIndex);
	        if (old && old != inLayer && !d.multiActive) {
		        old._transitionNext = inLayer._transitionNext = inLayer.getIndex() > old.getIndex();
			this.setLayerActive(old, false);		    
		}
		this.setLayerActive(inLayer, true);
	    if(this.decoree instanceof wm.mobile.SideBySideLayers == false)
		d.reflow();
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
