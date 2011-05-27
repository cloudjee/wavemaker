/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.layout.Box");

dojo.declare("wm.layout.Box", wm.layout.Base, {

    /* Call flow on each container whose contents we want to layout.
     * flow figures out the proper parameters to put into the call to _flow, and then after everything is flowed, we call renderControls
     * to update css to the sizes calculated in flow.
     */
	flow: function(inContainer,reflowTest) {
		if (this.direction == 'h') 
			this._flow(inContainer, "l", "t", "w", "h", inContainer.horizontalAlign, inContainer.verticalAlign, reflowTest);
		else
			this._flow(inContainer, "t", "l", "h", "w", inContainer.verticalAlign, inContainer.horizontalAlign, reflowTest);
		if (!reflowTest)
			inContainer.renderControls();
            
            if (inContainer._autoSizeList) {
                var c;
                while(c = inContainer._autoSizeList.pop()) {
                    c.doAutoSize(1,1);
                }
            }

	},

    /* Private method for calculating the width/height of each widget within a container; then calls flow on each subcontainer.
     * Parameters:
     *    inContainer: the container to layout
     *    inFlowOrd: "l" or "t" (left or top).
     *               inContainer.bounds[inFlowOrd] will give us the start point for our calculations along the axis of flow
     *    inFitOrd:  "l" or "t" (left or top),
     *               inContainer.bounds[inFlowOrd] will give us the start point for our calculations along the axis of "fit" (opposite of axis of flow)
     *    inFlowAxis: "w" or "h" (width or height),
     *               indicates if we are flowing the widgets based on their width or height; this determines if we are trying to find values for bounds.w or bounds.h
     *               so that all of the children fit inside of the parent.
     *    inFitAxis: "w" or "h" (width or height),
     *               indicates if we are fitting the widgets based on their width or height; this determines if we are trying to find values for bounds.w or bounds.h
     *               for each widget that may stretch across the flow of the container
     *    inFlowAlign: left, center, right, top, middle, bottom
     *               If there is extra space left over, then ajust how widgets are aligned within the flow of the container.  Does not work if % sized widgets are used
     *    inFitAlign:  left, center, right, top, middle, bottom
     *               Determines how to vertically align a column of widgets or horizontally align row of widgets within a container. Works fine for % sized widgets.
     *    reflowTest: Finds sizes for each widget without recursively calling flow on subcontainers; does not update bounds of widgets, just tests to see how much 
     *                space is needed. TODO: Maybe we don't need this anymore?  Used to see if we should turn on/off autoScroll before we layout a container.
     */  
	_flow: function(inContainer, inFlowOrd, inFitOrd, inFlowAxis, inFitAxis, inFlowAlign, inFitAlign, reflowTest) {
            if (inContainer.fitToContentHeight) {
                if (inContainer.layoutKind == "top-to-bottom")
                    inFlowAlign = "top";
            }
            if (inContainer.fitToContentWidth) {
                if (inContainer.layoutKind == "left-to-right")
                    inFlowAlign = "left";
            }

            /* Step 1: If any of the widgets inside of this container are autosizing, then now is the time for them to figure out their sizes, 
             *         before we lay out them and their siblings.  NOTE: if they size themselves based on the bounds of their siblings,
             *         they may not get accurate information at this point; autoSizing should be done with disregard for siblings! 
             *         Note also that a widget that autosizes based on the size of the parent may find the paren't available size changing
             *         if the parent adds/removes scrollbars from its content area.  But we autoSize widgets before adding scrollbars so that
             *         a widget may resize itself BEYOND the size of the parent and force it to add scrollbars.
             */
	    this.handleAutoSizingWidgets(inContainer);

            /* Step 2: If the container is autoScrolling, figure out if scrollbars will be needed, and update them if needed.  We need to know if scrollbars
             *         are on or not as they affect our bounds.
             */
            if (inContainer.autoScroll) {
                this.handleAutoScrollBars(inContainer);               
            }

            /* Step 3: Get the container's bounds; must be done after autoScroll modifies the bounds */
	    var b = inContainer.getContentBounds();

            /* Step 4: flowEx gives us two points of information:
             *         flowEx.free:  Find out how much free space is available for for % sized widgets.  If the number is negative, 
             *                       then hopefully scrollbars are enabled or widgets will not all be visible.  
             *         flowEx.ratio: This ratio can be multiplied against each c._percEx to get the desired width or height.  It accounts for two things:
             *                       1. how much free space is available in the container, 2. If the sum of the container widget's % sizes is over 100%, 
             *                       this is a modifier on each widget's % to normalize the total back to 100%.
             */
	    var flowEx = this.calcFlexRatio(inContainer.c$, inFlowAxis, b[inFlowAxis]);

            
            /* Step 5: Typically, we start laying out widgets at inContainer.bounds[inFlowOrd].  But if alignment is used, we may start somewhere else.  
             *         Find our starting point.
             *         NOTE: contentAlign only makes sense if there are no % children. 
             *         TODO: Invalid assumption; a 50% widget can still be aligned as its not taking up the full 100% of the container.  
             *               Back in wm 4.x when flex size was used, containers were always filled.
             */
	    if (flowEx.free) {
                var free = flowEx.free;
	        for (var i=0, c; c=inContainer.c$[i]; i++) {
		    if (this.inFlow(c)) {                
                        var size = c._percEx[inFlowAxis] ? (flowEx.ratio * c._percEx[inFlowAxis]) : 0;
                        if (size < c["min" + (inFlowAxis == "w" ? "Width":"Height")]) 
                            size = c["min" + (inFlowAxis == "w" ? "Width":"Height")];
                        free -= size;
                    }
                }
		switch (inFlowAlign) {
		case "bottom":
		case "right":
		    b[inFlowOrd] += free;
		    break;
		case "middle":
		case "center":
		    b[inFlowOrd] += free / 2;
		    if (b[inFlowOrd] < 0) b[inFlowOrd] = 0;
		    break;
		}
	    }
	    var fitOrd = b[inFitOrd];
	    var fitBound = b[inFitAxis];

            /* Step 6: We need the maximum size against the flow if we are doing a fitToContent against the flow; this will be the new width/height of inContainer,
             *         and will be used for all % calculations of width or height of the container's widgets.
             *         TODO: if autoScroll is on, then we've already called getPreferredFitToContentHeight AND Width; we should cache the results of the prior call
             * /
	    if (inContainer.fitToContentHeight  && inContainer.layoutKind == "left-to-right" ||
		inContainer.fitToContentWidth && inContainer.layoutKind == "top-to-bottom") 
            {
		fitBound = (inContainer.layoutKind == "left-to-right") ? inContainer.getPreferredFitToContentHeight() : inContainer.getPreferredFitToContentWidth();
                b[inFitAxis] = fitBound;
            }
            */
            /* Step 7: Iterate over each widget in this container, calculate its size and call setBounds on it. */
	    var maxFit = 0;
	    for (var i=0, c; c=inContainer.c$[i]; i++) {
		if (this.inFlow(c)) {

                    /* Step 7a: Calculate the bounds in flow of axis.
                     * If its % sized: bounds.w or bounds.h is now the %size * our ratio multiplier that builds in amount of free space and normalizes % to total of 100%
                     *                 for all children.  
                     * If px sized: We aren't calculating this bounds axis, its a fixed size, so just set it to NaN
                     */
		    b[inFlowAxis] = c._percEx[inFlowAxis] ? Math.round((flowEx.ratio * c._percEx[inFlowAxis])) : NaN;		
                    if (b[inFlowAxis] < c["min" + (inFlowAxis == "w" ? "Width":"Height")]) 
                        b[inFlowAxis] = c["min" + (inFlowAxis == "w" ? "Width":"Height")];

                    /* Step 7b: Calculate the bounds against the flow, and update the bounds and set cFitSize
                     * If its % sized: then set bounds and cFitSize to a size calculated from the parent's size * this widget's % size
                     * If its px sized: cFitSize is the control's bounds size, and then delete the bounds value; its fixed size so we won't be setting it.  
                     */
		    var cFitSize;
		    if (c._percEx[inFitAxis]) {
			    cFitSize = b[inFitAxis] = Math.min(100, c._percEx[inFitAxis]) * fitBound * 0.01;
		    } else {
                        cFitSize = c.bounds[inFitAxis];
			delete b[inFitAxis];
                    }

                    /* Step 7c: Find the left edge or top edge of the widget.  Typically goes at 0px (or if there's padding/border/margin, 
                     *          at inContainer.getContentBounds()[inFitOrd]).  But if alignement against the flow is specified, then we'll need to modify that
                     *          start value.  End result is that b["l" or "t"] has been updated.
                     */
		    b[inFitOrd] = fitOrd;  // bounds["l" or "t"] = the "l" or "t" inContainer.
		    switch (inFitAlign) {
		    case "justified": // no longer supported
            		if (djConfig.isDebug && !wm.isInstanceType(inContainer, wm.Editor) && inContainer.isDesignedComponent() && inFitAxis == "w" && !wm.isInstanceType(inContainer, wm.Layers) && !wm.isInstanceType(inContainer.owner, wm.Layers))
                	dojo.deprecated("justified", inContainer.owner.toString() + ":" + inContainer.toString() + "'s " + ((inFitAxis == "w") ? "horizontalAlign" : "verticalAlign") + " is set to 'justified', which may yield unexpected behaviors; please change this alignment in the property editor");
			b[inFitAxis] = fitBound;
			break;
		    case "center":
		    case "middle":
			b[inFitOrd] = (fitOrd + fitBound - cFitSize) / 2; 
			if (b[inFitOrd] < 0) b[inFitOrd] = 0;
			break;
		    case "bottom":
		    case "right":
			b[inFitOrd] = fitOrd + fitBound - cFitSize;  
			break;
		    }

                    /* Step 7d: Verify that sizes have not been reduced below user-set or widget-preferred minimums
                     * TODO: This may be the third time in this _flow that we've called getMinHeight/WidthProp; 
                     * definitely need to cache the result for the duration of this call
                     */
		    if (c._percEx.h) {
			var minHeight = c.getMinHeightProp();
			if (minHeight > b.h) b.h = minHeight;
		    }
		    if (c._percEx.w) {
			var minWidth  = c.getMinWidthProp();
			if (minWidth > b.w) b.w = minWidth;			    
		    }

                    /* Step 7e:  Update the bounds for the control; any bounds that were deleted or set to NaN will be left as is */
 		    c.setBounds(b.l, b.t, b.w, b.h);
                    c._renderEngineBoundsSet = true;

                    /* Step 7f: If the widget has a flow method (typically means its a wm.Container), call flow on it */
		    if (c.flow) {
			    c.flow();
		    }

                    /* Step 7g: The next widget's left or top will start after the edge of the widget just placed; so add the width to b["t" or "l"].
                       TODO: Couldn't we just set this to c.bounds["r" or "b"]?
                       */
		    b[inFlowOrd] += Math.max(0, c.bounds[inFlowAxis]);
		    maxFit = Math.max(maxFit, c.bounds[inFitAxis]);
		    wm.flowees++;
		}
            }

	    if (inContainer._touchScroll && inContainer instanceof wm.ListViewer == false) {
		var touchScrollChanged = false;
		if (inFlowAxis == "h") {
		    var scrollRequiredHeight = b.t;
		    var scrollRequiredWidth = maxFit;
		} else {
		    var scrollRequiredHeight = maxFit;
		    var scrollRequiredWidth = b.l;
		}
		if (
		    scrollRequiredHeight + "px" != inContainer._touchScroll.scrollers.inner.style.height) {
		    inContainer._touchScroll.scrollers.inner.style.height = scrollRequiredHeight + "px";
		    touchScrollChanged = true;
		}
		if (scrollRequiredWidth + "px" != inContainer._touchScroll.scrollers.inner.style.width) {
		    inContainer._touchScroll.scrollers.inner.style.width = scrollRequiredWidth + "px";
		    touchScrollChanged = true;
		}
		if (touchScrollChanged)
		    inContainer._touchScroll.setupScroller();
	    }

		/* Start of Frankie's new code
		if (inContainer.autoScroll && reflowTest) {
		    if (flowEx.free < 0) {
			if (inContainer.parent) {
			    inContainer.parent._xneedReflow = true;
			}
			inContainer._xneedReflow = true;
			inContainer[(inFlowAxis == "h" ? "_xscrollY" : "_xscrollX")] = true;
			inContainer.domNode.style["overflow" + ((inFlowAxis == "h") ? "Y" : "X")] = "auto";
		    } else {
			if (inContainer.domNode.style["overflow" + ((inFlowAxis == "h") ? "Y" : "X")] == "auto") {
			    inContainer.domNode.style["overflow" + ((inFlowAxis == "h") ? "Y" : "X")] = "hidden";
			    inContainer.domNode[(inFlowAxis == "h") ? "scrollTop" : "scrollLeft"] = 0;
			}
			inContainer[(inFlowAxis == "h" ? "_xscrollY" : "_xscrollX")] = false;
		    }
		    if (cFitSizeMax > fitBound) {
			if (inContainer.parent) {
			    inContainer.parent._xneedReflow = true;
			}
			inContainer._xneedReflow = true;
			inContainer[(inFitAxis == "h" ? "_xscrollY" : "_xscrollX")] = true;
			inContainer.domNode.style["overflow" + ((inFitAxis == "h") ? "Y" : "X")] = "auto";
		    } else {
			if (inContainer.domNode.style["overflow" + ((inFitAxis == "h") ? "Y" : "X")] == "auto") {
			    inContainer.domNode.style["overflow" + ((inFitAxis == "h") ? "Y" : "X")] = "hidden";
			    inContainer.domNode[(inFitAxis == "h") ? "scrollTop" : "scrollLeft"] = 0;
			}
			inContainer[(inFitAxis == "h" ? "_xscrollY" : "_xscrollX")] = false;
		    }
		}
		 End of Frankie's new code */


                /* Step 8: if we have a fitToContent container, resize it to fit its children's width and height.
                *          Never resize a container to less than 30px high and 50px wide as a fitToContent container could disappear entirely when removing its last
                *          control, and be imposible to select or even see.
                * /
                if (inContainer.fitToContent) {
		    var bx = {};
		    if (/ *flowEx.ratio == 0 && * /(inContainer.fitToContentWidth && inFlowAxis == "w" || inContainer.fitToContentHeight && inFlowAxis == "h")) 
                        
			bx[inFlowAxis] = Math.max(b[inFlowOrd],(inFlowAxis == "h") ? 30 : 50); // Containers with fitToContent set should never be resized below 30px high and 50px wide		    
		    if (inContainer.fitToContentWidth && inFlowAxis == "h" || inContainer.fitToContentHeight && inFlowAxis == "w") 
		        bx[inFitAxis] = Math.max(fitBound, (inFlowAxis == "h") ? 30 : 50);
		    inContainer.setContentBounds(bx);
                    inContainer.calcFitToContent();
                    inContainer.renderBounds();
		}
                */

	},
    
    handleAutoSizingWidgets: function(inContainer) {
	if (!inContainer.isAncestorHiddenLayer() && inContainer.showing && (!wm.isInstanceType(inContainer, wm.Layer) || inContainer.active)) {
            var hasAutoHeight;
            var hasAutoWidth;
	    for (var i = 0; i < inContainer.c$.length; i++) {			
		var c = inContainer.c$[i];
		if (c.showing) {

                    if (c._needsAutoSize && (c.autoSizeWidth || c.autoSizeHeight)) {
                        var topParent = (c.owner instanceof wm.Page) ? c.owner.root : c.owner;
                        if (!topParent._autoSizeList)
                            topParent._autoSizeList = [];
                        if (dojo.indexOf(topParent._autoSizeList, c) == -1)
                            topParent._autoSizeList.push(c);
/*
		        var cupdatingwas = c._cupdating;
		        c._cupdating = true;				
                        c.doAutoSize(false,false);
		        c._cupdating = cupdatingwas;
                        if (c.autoSizeWidth) hasAutoWidth = true;
                        if (c.autoSizeHeight) hasAutoHeight = true;
                        */
                    } else  if (c.fitToContent) {
                        if (c.fitToContentHeight) 
                            c.bounds.h = c.getPreferredFitToContentHeight();
                        if (c.fitToContentWidth)
                            c.bounds.w = c.getPreferredFitToContentWidth();
                        c.calcFitToContent();
                        if (c.fitToContentWidth) hasAutoWidth = true;
                        if (c.fitToContentHeight) hasAutoHeight = true;
                    }
		}
	    }
	}
    },

    /* Note: we must turn overflow between auto/hidden instead of leaving it on auto because chrome browser, once the scrollbars appear,
     * won't ever go away even if scrolling is no longer needed */
    handleAutoScrollBars: function(inContainer) {
        /* Vertical scrollbars */
        if (inContainer.fitToContentHeight) {
            inContainer._xscrollY = false;
            scrollY = "hidden";
        } else {
	    //var requiredHeight = (inContainer instanceof wm.Layout) ? inContainer.bounds.h : inContainer.getPreferredFitToContentHeight();
	    var requiredHeight = inContainer.getPreferredFitToContentHeight();
            var needsScrollY = requiredHeight > inContainer.bounds.h;
            var scrollY = (needsScrollY) ? "auto" : "hidden";
            inContainer._xscrollY = (scrollY=="auto");
        }
	if (inContainer._touchScroll) {
	    ;
	} else if (inContainer.domNode.style.overflowY != scrollY) {
	    inContainer.domNode.style.overflowY = scrollY;
            inContainer.domNode.scrollTop = 0;
        }


        /* Horizontal scrollbars */
        if (inContainer.fitToContentWidth) {
            inContainer._xscrollX = false;
            scrollX = "hidden";
        } else {
	    var requiredWidth = inContainer.getPreferredFitToContentWidth();
            var needsScrollX = requiredWidth > inContainer.bounds.w;
            var scrollX = (needsScrollX) ? "auto" : "hidden";
        }
        inContainer._xscrollX = (scrollX=="auto");
	if (inContainer._touchScroll) {
	    ;
	} else if (inContainer.domNode.style.overflowX != scrollX) {
	    inContainer.domNode.style.overflowX = scrollX;
            inContainer.domNode.scrollLeft = 0;
        }
    },
	calcFlexRatio: function(inC$, inAxis, inExtent) {
		var flex = 0;
		var free = inExtent;
		var minSizeSum = 0;
	        var minname = "getMin" + ((inAxis == "h") ? "Height" : "Width") + "Prop";
		for (var i=0, c; c=inC$[i]; i++) {
			if (this.inFlow(c)) {
				if (c._percEx[inAxis]) {
					flex += Number(c._percEx[inAxis]) || 0;
				        minSizeSum += c[minname]();
				} else
					free -= c.bounds[inAxis];
			}
		}

		// If this number is less than 0, then treat all minSized widgets as fixed size and factor in the minSize into the amount of free space
		if (free - minSizeSum < 0) free -= minSizeSum; 
		if (flex && flex < 100)
			flex = 100;
		return {
			free: free,
			ratio: (flex && free>0) ? (free / flex) : 0
		};
	},
        // TODO: This, and perhaps calcFlexRatio should probably use not just minHeight/minWidth, but getMinWidthProp/getMinHeightProp
        getMaxFreeSpace: function(inC$, inAxis, inExtent) {
                var free = inExtent;
                var minSizeSum = 0;
                var minname = "min" + ((inAxis == "h") ? "Height" : "Width");
                for (var i=0, c; c=inC$[i]; i++) {
                        if (this.inFlow(c)) {
                                if (c._percEx[inAxis]) {
                                        if (c[minname]) minSizeSum += c[minname];
                                } else
                                        free -= c.bounds[inAxis];
                        }
                }

                // If this number is less than 0, then treat all minSized widgets as fixed size and factor in the minSize into the amount of free space
                if (free - minSizeSum < 0) free -= minSizeSum;
                return free;
        }

});

dojo.declare("wm.layout.HBox", wm.layout.Box, {
	direction: "h",
	suggest: function(inContainer, inControl, ioRect) {
		var x = 0;
		for (var i=0, c; c=inContainer.c$[i]; i++) {
			if (this.inFlow(c)) {
				if (ioRect.l < c.bounds.l + c.bounds.w / 2) {
					x = c.bounds.l - 1;
					break;
				}
				x = c.bounds.r;
			}
		}
		var b = inContainer.getContentBounds();
		ioRect.l = x;
		ioRect.t = b.t;
		ioRect.h = b.h;
		ioRect.i = i;
	}
});

dojo.declare("wm.layout.VBox", wm.layout.Box, {
	direction: "v",
	suggest: function(inContainer, inControl, ioRect) {
		var y = 0;
		for (var i=0, c; c=inContainer.c$[i]; i++) {
			if (this.inFlow(c)) {
				if (ioRect.t < c.bounds.t + c.bounds.h / 2) {
					y = c.bounds.t - 1;
					break;
				}
				y = c.bounds.b;
			}
		}
		var b = inContainer.getContentBounds();
		ioRect.l = b.l;
		ioRect.t = y;
		ioRect.w = b.w;
		ioRect.i = i;
	}
});

wm.layout.register("left-to-right", wm.layout.HBox);
wm.layout.register("top-to-bottom", wm.layout.VBox);
wm.layout.addCache("left-to-right", new wm.layout.HBox());
wm.layout.addCache("top-to-bottom", new wm.layout.VBox());
