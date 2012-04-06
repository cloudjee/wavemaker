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

dojo.provide("wm.base.widget.Layers.TabsDecorator");
dojo.require("wm.base.widget.Layers.Decorator");

dojo.declare("wm.TabsDecorator", wm.LayersDecorator, {
	decorationClass: "wmtablayers",
        decoratorPadding: "7, 0, 0, 0",
	undecorate: function() {
		this.inherited(arguments);
		this.tabsControl.destroy();
	},
	decorateContainer: function() {
		this.inherited(arguments);
		this.btns = [];
	    if (this.tabsControl)
		this.tabsControl.destroy();
		this.tabsControl = new wm.TabsControl({
			parent: this.decoree, 
		        owner: this.decoree,
		    padding: this.decoratorPadding,
		    name: "tabsControl"
		});
		this.decoree.moveControl(this.tabsControl, 0);
	    if (this.decoree.dndTargetName || this.decoree.isDesignLoaded()) {
		dojo.require("dojo.dnd.Source");
    		this.dndObj = new dojo.dnd.Source(this.tabsControl.domNode, {accept: [this.decoree.dndTargetName || "designMoveLayers"]});
		this.dndObjConnect = this.tabsControl.connect(this.dndObj, "onDndDrop", this, "onTabDrop");
	    }

	},
	createTab: function(inCaption, inIndex, inLayer) {
	    var b = this.btns[inIndex] = document.createElement("button");
	    dojo.attr(b,"id", this.decoree.domNode.id + "_decorator_button" + this.btns.length);
	    dojo.attr(b,"type", "button");
	    dojo.attr(b,"type", "button");
	        //b.style.outline = "none";
		b.style.display = inLayer.showing ? "" : "none";
	    this.setBtnText(b, inCaption, inLayer.closable || inLayer.destroyable);
	    
	    if (!wm.isMobile) {
		this.decoree.connect(b, "onclick", dojo.hitch(this, "onTabClick",inLayer));
	    } else if (wm.isFakeMobile) {
		this.decoree.connect(b,'onmousedown', dojo.hitch(this, "touchTabStart", inLayer));
		this.decoree.connect(b,'onmousemove', dojo.hitch(this, "touchTabMove",  inLayer));
		this.decoree.connect(b,'onmouseup',   dojo.hitch(this, "touchTabEnd",   inLayer));
	    } else {
		this.decoree.connect(b,'ontouchstart',dojo.hitch(this, "touchTabStart", inLayer));
		this.decoree.connect(b,'ontouchmove', dojo.hitch(this, "touchTabMove",  inLayer));
		this.decoree.connect(b,'ontouchend',  dojo.hitch(this, "touchTabEnd",   inLayer));
	    }

	    var tabstyleName = (this.decoree.verticalButtons) ? "-verticaltab" : "-tab";
	    b.className=this.decorationClass + tabstyleName +  (inLayer.closable || inLayer.destroyable ? " " + this.decorationClass + "-closabletab" : "");
	    if (!inCaption) b.style.display = "none";
	    this.tabsControl.domNode.appendChild(b);

	    if (this.dndObj) {
		this.dndObj.destroy()
		dojo.disconnect(this.dndObjConnect);
		dojo.addClass(b, "dojoDndItem");
		dojo.attr(b, "dndType", this.decoree.dndTargetName || "designMoveLayers");
    		this.dndObj = new dojo.dnd.Source(this.tabsControl.domNode, {accept: [this.decoree.dndTargetName || "designMoveLayers"]});
		this.dndObjConnect = this.tabsControl.connect(this.dndObj, "onDndDrop", this, "onTabDrop");
	    }
	},

		
    onTabClick: function(inLayer,evt) {
	// prevent designer click
	if (this.decoree.isDesignLoaded())
	    dojo.stopEvent(evt);

	/* IE 8 does not gaurentee that evt will still have its properties after a delay, so 
	 * we capture the event properties we need and pass that rather than the event object itself.
	 * Other browsers don't require this, but it seems like a good practice regardless.
	 */
	if (evt.type == "submit") return;
	var pseudoEvent = {target: evt.target,
			   clientX: evt.clientX,
			   clientY: evt.clientY};
		
	wm.onidle(this, function() {
	    this.tabClicked(inLayer,pseudoEvent);
	    pseudoEvent.target.style.borderWidth = null;
	});
    },
    touchTabStart: function(inLayer,evt) {
	if (!inLayer._touchStarted) {
	    inLayer._touchStarted = true;
	    inLayer._touchTarget = evt.target;
	    this.btns[inLayer.getIndex()].style.borderWidth = "3px";
	    wm.job(inLayer.getRuntimeId() + ".onClick", app.touchToClickDelay, dojo.hitch(this, "touchTabEnd", inLayer));
	}
    },
    touchTabMove: function(inLayer,evt) {
	if (inLayer._touchStarted) {
	    wm.cancelJob(inLayer.getRuntimeId() + ".onClick");
	    delete inLayer._touchStarted;
	    delete inLayer._touchTarget;
	    this.btns[inLayer.getIndex()].style.borderWidth = "";
	}
    },
    touchTabEnd: function(inLayer,evt) {
	if (inLayer._touchStarted) {
	    delete inLayer._touchStarted;
	    this.btns[inLayer.getIndex()].style.borderWidth = "";
	    this.tabClicked(inLayer, {target: inLayer._touchTarget});
	    delete inLayer._touchTarget;
	}
    },


	 onTabDrop: function(dndSource,nodes,copy,dndTarget,event) {
	     if (dojo.dnd.manager().target != this.dndObj) return;
	     var tabLayers = wm.getWidgetByDomNode(nodes[0]);

	     var indexWas = dojo.indexOf(tabLayers.decorator.btns, nodes[0]);
	     if (indexWas == -1) return;
	     var layer = tabLayers.layers[indexWas];
	     if (!layer) return;

	     var indexIs = dojo.indexOf(this.tabsControl.domNode.childNodes, nodes[0]);
	     var findNewIndex = false;
	     var changeParent = layer.parent != this.decoree;
	     if (changeParent) {
		 layer.setParent(this.decoree);
		 var selectedIndex = tabLayers.layerIndex;
		 tabLayers.layerIndex = -1;
		 tabLayers.setLayerIndex(tabLayers.layers.length > selectedIndex ? selectedIndex : tabLayers.layers.length-1);
    
		 var managedButtons = this.btns;
		 var currentButtons = this.tabsControl.domNode.childNodes;
		 if (indexIs == this.btns.length-1) {
		     findNewIndex = true;
		 }
		 // Find any buttons currently in the tabControl that aren't in this.btns; this is a new tab dragged in from elsewhere
		 // and needs to be handled
/*
		 for (var i = 0; i < currentButtons.length; i++) {
		     var b = currentButtons[i];
		     if (dojo.indexOf(managedButtons,b) == -1) {
			 draggedFromElsewhere = true;
			 this.decoree.moveLayerIndex(layer, i);
			 dojo.destroy(b);
			 break;
		     }
		 }
		 */
		 if (nodes[0].parentNode)
		     dojo.destroy(nodes[0]);
	     } else if (indexWas == indexIs) {
		 findNewIndex = true;
	     }

	     /* we generally need to find a new index when the user drops a tab between two tabs because dojo fails
	      * to handle this case
	      */
	     if (findNewIndex) {
		 // use the event to see if the index SHOULD have been changed but dojo just messed up.
		 var x = event.offsetX;
		 var found = false;
		 for (var i = 0; i < this.btns.length; i++) {
		     var b = this.btns[i];
		     var coords = dojo.marginBox(b);
		     coords.l += dojo._getContentBox(b).l;
		     if (coords.l > x) {
			 indexIs = i;
			 found = true;
			 break;
		     }
		 }
		 if (!found) {
		     indexIs = this.btns.length;
		 } else if (indexIs > indexWas && !changeParent) {
		     indexIs--;
		 }
	     }
	     this.decoree.moveLayerIndex(layer, indexIs);
	     if (this.decoree.isDesignLoaded()) {
		 studio.refreshWidgetsTree();
	     }
             layer.activate();
	     layer.onTabDrop();
	     if (tabLayers != this.decoree && tabLayers.onTabRemoved) {
		 tabLayers.onTabRemoved();
	     }
	     this.decoree.onTabDrop();
	 },
	tabClicked: function(inLayer, e) {
		var d = this.decoree;

	    var close = dojo.hasClass(e.target, "TabCloseIcon");
	    if (!close && (inLayer.closable || inLayer.destroyable)) {
		var closeIcon = dojo.coords(e.target.firstChild);
		var button = dojo.coords(e.target);
		if (e.clientX >= closeIcon.x &&
		    e.clientY <= closeIcon.y+closeIcon.h)
		    close = true;
	    }
	    if (close) {
		if (inLayer.customCloseOrDestroy != inLayer.constructor.prototype.customCloseOrDestroy)
		    return inLayer.customCloseOrDestroy(inLayer);
		inLayer.onCloseOrDestroy();

		if (inLayer.parent.customCloseOrDestroy != inLayer.parent.constructor.prototype.customCloseOrDestroy)
		    return inLayer.parent.customCloseOrDestroy(inLayer.parent, inLayer);
		var currentLayer = inLayer.parent.getActiveLayer();
		var currentIndex = currentLayer.getIndex();
		var parent = inLayer.parent;
		parent.onCloseOrDestroy(inLayer);
		if (inLayer.destroyable) 
		    inLayer.destroy();
		else
		    inLayer.hide();
		this.decoree.renderBounds(); // in case number of rows of tabs has changed
		if (!currentLayer.isDestroyed) {
		    currentLayer.activate();
		    currentLayer.parent.layerIndex = dojo.indexOf(currentLayer.parent.layers, currentLayer);
		} else if (currentIndex > 0) parent.setLayerIndex(currentIndex-1);
		else parent.setLayerIndex(0);
		    
	    } else {
		d.setLayer(inLayer);
	    }
	},
	decorateLayer: function(inLayer, inIndex) {
		this.inherited(arguments);
		this.createTab(inLayer.caption, inIndex, inLayer);
	},
	undecorateLayer: function(inLayer, inIndex) {
		dojo._destroyElement(this.btns[inIndex]);
		this.btns.splice(inIndex, 1);
	},
	setLayerShowing: function(inLayer, inShowing) {
		var i = inLayer.getIndex();
		if (i != -1)
			this.btns[i].style.display = inShowing ? "" : "none";
		this.inherited(arguments);
	},
	setLayerActive: function(inLayer, inActive) {
		var b=this.btns[inLayer.getIndex()];
		if (b)
		    dojo[inActive ? "addClass" : "removeClass"](b, this.decorationClass + '-selected');
		this.inherited(arguments);
	},
	applyLayerCaption: function(inLayer) {
		var d = this.decoree, i = inLayer.getIndex();
		if (i != -1)
		    this.setBtnText(this.btns[i], inLayer.caption, inLayer.closable || inLayer.destroyable);
	},
    setBtnText: function(inBtn, inCaption, closable) {
	var index = dojo.indexOf(this.btns, inBtn);
	var layer = this.decoree.layers[index];
	if (inCaption) {
	    if (inBtn.style.display && layer.showing)
		inBtn.style.display = "";
	    dojo[closable ? "addClass" : "removeClass"](inBtn, this.decorationClass + "-closabletab");
	    inBtn.innerHTML = (closable ? "<span class='TabCloseIcon'>x</span>" : "") +  (inCaption || '&nbsp;');
	} else {
	    inBtn.style.display = "none";
	}
	
	},
	getBtn: function(inCaption) {
		var d = this.decoree, i = d.indexOfLayerCaption(inCaption);
		if (i != -1)
			return this.btns[i];
	},
	disenableTab: function(inCaption, inDisable) {
		var b = this.getBtn(inCaption);
		if (b)
			b.disabled = inDisable ? "disabled" : "";
	},
	disableTab: function(inCaption) {
		this.disenableTab(inCaption, true);
	},
	enableTab: function(inCaption) {
		this.disenableTab(inCaption, false);
	},
	moveLayerIndex: function(inFromIndex, inToIndex) {
		this.inherited(arguments);
		var d = this.tabsControl.domNode, f = this.btns[inFromIndex], t = this.btns[inToIndex], c = this.decoree.getCount()-1;
		if (inToIndex < inFromIndex) {
			d.insertBefore(f, t);
		} else if (inToIndex > inFromIndex) {
			if (inToIndex == c)
				d.appendChild(f);
			else {
				var nl = this.btns[inToIndex + 1];
				if (nl)
					d.insertBefore(f, nl);
			}
		}
	    wm.Array.removeElement(this.btns, f);
	    wm.Array.insertElementAt(this.btns, f, inToIndex);
	}
});

/*
dojo.declare("wm.RoundedTabsDecorator", wm.TabsDecorator, {
	decorateContainer: function() {
		this.inherited(arguments);
		dojo.removeClass(this.tabsControl.domNode, "wmtablayers-tabbar");
		dojo.addClass(this.tabsControl.domNode, "wmtablayers-roundedtabbar");
		this.tabsControl.setPadding("0,0,0,15");
		this.tabsControl.domNode.style.paddingTop = "0px";								
		this.tabsControl.domNode.style.paddingLeft = "15px";
	},
	createTab: function(inCaption, inIndex, inLayer) {
		var b = this.btns[inIndex] = document.createElement("div");		
		b.style.display = inLayer.showing ? "" : "none";
		
		var divLeft = document.createElement("div");
		var divCenter = document.createElement("div");
		var divRight = document.createElement("div");
		
		divLeft.innerHTML = "&nbsp;";
		divCenter.innerHTML = "&nbsp;";
		divRight.innerHTML = "&nbsp;";
		
		this.setBtnText(divCenter, inCaption, inLayer.closable || inLayer.destroyable);
		this.decoree.connect(b, "onclick", dojo.hitch(this, "tabClicked", inLayer));
		this.decoree.connect(b, "onmouseover", dojo.hitch(this, "mouseoverout", inLayer, true));
		this.decoree.connect(b, "onmouseout", dojo.hitch(this, "mouseoverout", inLayer, false));

		b.className="wmtablayers-roundedtab";
		divLeft.className="wmtablayers-roundedtab-left";
		divCenter.className="wmtablayers-roundedtab-center";
		divRight.className="wmtablayers-roundedtab-right";

		b.appendChild(divLeft);
		b.appendChild(divCenter);
		b.appendChild(divRight);
		
		dojo.connect(b, "onselectstart", dojo, "stopEvent");
		this.tabsControl.domNode.appendChild(b);
	},
	tabClicked: function(inLayer){
		var b=this.btns[inLayer.getIndex()];
		var divLeft = b.childNodes[0];
		var divCenter = b.childNodes[1];
		var divRight = b.childNodes[2];		
		if (b){
			dojo.removeClass(divLeft, 'wmtablayers-roundedtab-left-hover');				
			dojo.removeClass(divCenter, 'wmtablayers-roundedtab-center-hover');
			dojo.removeClass(divRight, 'wmtablayers-roundedtab-right-hover');			
		}
		this.inherited(arguments);					
	},
	mouseoverout: function(inLayer, inActive){
		var inIndex = inLayer.getIndex();		
		if(this.decoree.layerIndex != inIndex){ // user has put mouse over an inactive tab
			var b=this.btns[inIndex];
			var divLeft = b.childNodes[0];
			var divCenter = b.childNodes[1];
			var divRight = b.childNodes[2];
			if (b){				
				dojo[inActive ? "addClass" : "removeClass"](divLeft, 'wmtablayers-roundedtab-left-hover');				
				dojo[inActive ? "addClass" : "removeClass"](divCenter, 'wmtablayers-roundedtab-center-hover');
				dojo[inActive ? "addClass" : "removeClass"](divRight, 'wmtablayers-roundedtab-right-hover');
			}							
		}
	},
	applyLayerCaption: function(inLayer) {
		var d = this.decoree, i = inLayer.getIndex();
		if (i != -1)
			this.setBtnText(this.btns[i].childNodes[1], inLayer.caption, inLayer.closable || inLayer.destroyable);
	}
	
});
*/
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



dojo.declare("wm.TabsControl", wm.Control, {
	height: "27px",
	width: "100%",
	border: 0,
	init: function() {
	    if (this.parent && this.parent.isRelativePositioned)
		this.isRelativePositioned = true;
	    dojo.addClass(this.domNode, "wmtablayers-tabbar");
	    if (this.owner) {
		if (this.owner.verticalButtons) {
		    this.height = "100%";
		    this.width = this.owner.headerWidth;
		} else {
		    this.height = this.owner.headerHeight;
		}
	    }
	    this.inherited(arguments);
	},
	updateHeaderHeight: function(){
		// dont do anything during design mode as designer decides what height should header have.
/* no longer relevant as this test now needs to be handled by the caller
		if (this.isDesignLoaded())
		  return false;
*/
	        //var _currHeight = dojo.marginBox(this.domNode).h;  these two lines are invoked by the caller before doing a short delay so that IE 6 can update its dom structure
		//this.domNode.style.height = 'auto';
		var domHeight = dojo.marginBox(this.domNode).h;
	    return domHeight;
		if (domHeight != _currHeight){
			dojo.marginBox(this.domNode, {h:_currHeight});
			return domHeight;
		}
		return false;
	}
});
