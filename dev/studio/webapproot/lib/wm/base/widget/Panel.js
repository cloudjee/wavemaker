/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
dojo.provide("wm.base.widget.Panel");

/**
	Container for widgets.
	@name wm.Panel
	@class
	@extends wm.Container
*/
dojo.declare("wm.Panel", wm.Container, {
	/** @lends wm.Panel.prototype */
	//border: 1,
    classNames: "wmcontainer wmpanel",    
    setThemeStyleType: function(inType) {        
        var widgetsjs = this.write("");
	widgetsjs = dojo.fromJson(widgetsjs.replace(/^.*?\:/,""));
	var name = this.name;	
        var parent = this.parent;
	var owner = this.owner;
        var indexInParent = dojo.indexOf(this.parent.c$, this);
        this.destroy();
	
        var clone = parent.createComponent(name, "wm." + inType + "Panel", widgetsjs[1], widgetsjs[2], widgetsjs[3], owner);
        parent.moveControl(clone, indexInParent);
        parent.reflow();
	studio.refreshWidgetsTree();
	studio.select(clone);
    },
    getThemeStyleType: function() {
        return this.declaredClass.replace(/^wm\.(.*)Panel/,"$1");
    }

});


dojo.declare("wm.MainContentPanel", wm.Panel, {
    classNames: "wmcontainer wmpanel MainContent"
});

dojo.declare("wm.EmphasizedContentPanel", wm.Panel, {
    classNames: "wmcontainer wmpanel EmphasizedContent"
});

dojo.declare("wm.HeaderContentPanel", wm.Panel, {
    classNames: "wmcontainer wmpanel HeaderContent"
});
wm.Object.extendSchema(wm.Panel, {
    themeStyleType: {group: "style", order: 150}
});
dojo.declare("wm.FancyPanel", wm.Panel, {
    //useDesignBorder: 0, // move this to a _design file if we ever create one
    freeze: true,
    classNames: "wmcontainer wmfancypanel",
    //_classes: 	{"domNode": ["wm_FontSizePx_16px", "wm_BackgroundGradient_Blue", "wm_Border_TopStyleCurved12px", "wm_Border_BottomStyleCurved4px", "wm_FontColor_White", "wm_TextDecoration_Bold", "wm_Border_DropShadow"]},
    title: "Panel Heading",
    labelWidget: null,
    containerWidget: null,
    layoutKind: "top-to-bottom",
    innerLayoutKind: "top-to-bottom",
    innerHorizontalAlign: "left",
    innerVerticalAlign: "top",
    margin: "6",
    padding: "0",    
    border: "0",
    innerBorder: "3",
    borderColor: "#404040",
    width: "100%",
    height: "100%",
    _topImgWidth: 0,
    _bottomImgWidth: 0,
    labelHeight: 30,
    themeStyleType: "ContentPanel",
    init: function() {
	var classes = this._classes;
	var containerClasses = {domNode:[]};
	for (var i = classes.domNode.length-1; i >= 0; i--) {
	    if (classes.domNode[i].match(/^wm_Border_(Bottom|Drop)/)) {
		containerClasses.domNode.push(classes.domNode[i]);
		wm.Array.removeElementAt(classes.domNode,i);
	    }
	}
	this._classes = {domNode:[]};
        try {
	    //var classes = this.captionClasses.split(/\s+/);
	    this.layout = wm.layout.cache["top-to-bottom"];
	    this.inherited(arguments);
	    this.labelWidget = new wm.Label({border: this.innerBorder,
                                             borderColor: this.borderColor,
                                             showing: Boolean(this.title),
		                             _classes: classes,
                                             name: "labelWidget",
                                             caption: this.title,
                                             width: "100%",
                                             height: this.labelHeight + "px",
                                             padding: "0,0,0,10",
                                             owner: this,
                                             parent: this,
                                             noInspector: true});
	    var innerBorder = String(this.innerBorder);
            innerBorder = this._parseExtents(innerBorder);
	    this.containerWidget = new wm.Container({
		                                     _classes: containerClasses,
                                                     name:           "containerWidget",
                                                     layoutKind:     this.innerLayoutKind,
                                                     width:          "100%",
                                                     height:         "100%",
                                                     owner:          this,
                                                     parent:         this,
                                                     noInspector:    true,
                                                     autoScroll:     true,
                                                     horizontalAlign:this.innerHorizontalAlign,
                                                     verticalAlign:  this.innerVerticalAlign,
                                                     fitToContentHeight: this.fitToContentHeight,
                                                     fitToContentWidth: this.fitToContentWidth,
                                                     /* margin: "0,0,7,0",*/
                                                     border:         "0,"+innerBorder.r+","+innerBorder.b+","+innerBorder.l,
                                                     borderColor: this.borderColor});

	    this.containerWidget.setLayoutKind(this.innerLayoutKind);
	    this.widgets.labelWidget = this.labelWidget;
	    this.widgets.containerWidget = this.containerWidget;
            this.setTitle(this.title);
/*
	    wm.onidle(this, function() {
                try {
		    this._readyForInitClasses = true;
		    if (dojo.isIE < 9) {
                        var namelist = ["topRightCornerImg","topLeftCornerImg","bottomRightCornerImg","bottomLeftCornerImg"];
                        for (var i = 0; i < namelist.length; i++) {
                            var name = namelist[i];
                            var div = document.createElement("div");
                            div.id = this.getRuntimeId() + "_" + name;
                            div.className = "FancyPanel" + name;
		            this.parent.domNode.appendChild(div);
                            this["_" + name] = div;
                        }
		        this.initUserClasses();
		        this.renderCorners();
                        console.log("initUserClasses: " + this.toString() + " has label: " + Boolean(this.labelWidget));
                    }
		    this.initUserClasses();
                    this.setShowing(this.showing, true);
                } catch(e) {
                    alert("onIdle Panel:" + e);
		}

	    });
            */
        } catch(e) {
            alert("PANEL:" + e);
        }
    },
    setFitToContentHeight: function(inValue) {
        this.inherited(arguments);
        if (this.containerWidget)
            this.containerWidget.setFitToContentHeight(inValue);
    },
    setFitToContentWidth: function(inValue) {
        this.inherited(arguments);
        if (this.containerWidget)
            this.containerWidget.setFitToContentWidth(inValue);
    },
    setBorder: function(inBorder) {
        wm.Control.prototype.setBorder.call(this, "0");
    },

    setShowing: function(inShowing) {
	this.inherited(arguments);
	if(dojo.isIE < 9) {
            if (this._topLeftCornerImg) {
	        this._topLeftCornerImg.style.display = (this.showing) ? "block" : "none";
	        this._topRightCornerImg.style.display = (this.showing) ? "block" : "none";
            }
            if (this._bottomLeftCornerImg) {
	        this._bottomLeftCornerImg.style.display = (this.showing) ? "block" : "none";
	        this._bottomRightCornerImg.style.display = (this.showing) ? "block" : "none";
            }
	}
    },
	getMinHeightProp: function() {
            if (this.minHeight) return this.minHeight;
            if (!this.containerWidget) return this.inherited(arguments);
            return this.containerWidget.getMinHeightProp() + ((this.labelWidget && this.labelWidget.showing) ? this.labelWidget.bounds.h : 0) + 30;
	},
	getPreferredFitToContentWidth: function() {
		// get the maximum width in this column; 
		// and get the sum of widths in this row... we'll worry later about whether its a row or column
                var extra = this.padBorderMargin.r + this.padBorderMargin.l;	
	        var max = 0;
	        var sum = 0;
		var v;
		for (var i=0, c; c=this.c$[i]; i++) {
			if (this.layout.inFlow(c)) {
			    if (c instanceof wm.Container) {
				if (c.fitToContentWidth || c._percEx.w) {
					v =  c.getPreferredFitToContentWidth();
				} else {
					v =  c.bounds.w;
				}
			    } else {
				if (c._percEx.w) {
				        v =  c.getMinWidthProp();
				} else {
					v =  c.bounds.w;
				}				
			    }
				max = Math.max(max, v);
				sum += v;				
			}
		}

                // Never return less than 30px wide; mostly this is for design mode where users still need to be able to find and drop widgets into the container.
	        var result = ((this.layoutKind == "top-to-bottom") ? max : sum) + extra;
                return Math.max(result, 30);
	},

    /* Get the preferred height of this container, for use if this is a fitToContentHeight container.
     * top-to-bottom container: height is the sum of the heights of all px sized children and the sum of all minHeights for % sized children.
     * left-to-right container: height is the max of the heights of all px sized children and the minHeights for % sized children
     */
	getPreferredFitToContentHeight: function() {
		// get the maximum width in this column; 
		// and get the sum of height in this row... we'll worry later about whether its a row or column
            var extra = this.padBorderMargin.t + this.padBorderMargin.b;	
	    var max = 0;
	    var sum = 0;
		var v;
		for (var i=0, c; c=this.c$[i]; i++) {
			if (this.layout.inFlow(c)) {
			    if (c instanceof wm.Container) {
				 if (c.fitToContentHeight || c._percEx.h) {
					v = c.getPreferredFitToContentHeight();
				 } else {
					v = c.bounds.h;
				}
			    } else {
				 if (c.fitToContentHeight || c._percEx.h) {
					v = c.getMinHeightProp();
				 } else {
					v = c.bounds.h;
				}
			    }
			    max = Math.max(max, v);
			    sum += v;
			}
		}
            // never return less than 15px height
            var result =  ((this.layoutKind == "left-to-right") ? max : sum) + extra;
	    return Math.max(result, 15);
	},

    destroy: function() {
	if(dojo.isIE < 9) {
            if (this._topLeftCornerImg) {
	        dojo.destroy(this._topLeftCornerImg);
	        dojo.destroy(this._topRightCornerImg);
            }
            if (this._bottomLeftCornerImg) {
	        dojo.destroy(this._bottomLeftCornerImg);
	        dojo.destroy(this._bottomRightCornerImg);
            }
	}
	this.inherited(arguments);
    },
    flow: function() {
	this.inherited(arguments);
	if (dojo.isIE < 9)
	    this.renderCorners();
    },
    renderCorners: function() {
	if (!this._topLeftCornerImg) return;
	if (this._topLeftCornerImg.className.match(/px/)) {
	    this._topLeftCornerImg.style.top =  this._topRightCornerImg.style.top = 
		(this.bounds.t + this.marginExtents.t) + "px";

	    this._topLeftCornerImg.style.left = (this.bounds.l + this.marginExtents.l) + "px";
	    this._topRightCornerImg.style.left = (this.bounds.r-this._topImgWidth-this.marginExtents.r) + "px";
	}

	if (this._bottomLeftCornerImg.className.match(/px/)) {
	    this._bottomLeftCornerImg.style.top =  this._bottomRightCornerImg.style.top = 
		(this.bounds.b - this.marginExtents.b - this._bottomImgHeight) + "px";

	    this._bottomLeftCornerImg.style.left = (this.bounds.l + this.marginExtents.l) + "px";
	    this._bottomRightCornerImg.style.left = (this.bounds.r-this._bottomImgWidth-this.marginExtents.r) + "px";
	}

	
    },
    postInit: function() {
	var changeParents = [];
	for (var i = 0; i < this.c$.length; i++) {
	    var c = this.c$[i];
	    if (this.$[c.name] != c && c instanceof wm.Control) {
		changeParents.push(c);
	    }
	}
	for (var i = 0; i < changeParents.length; i++) {
	    var c = changeParents[i];
	    c.setParent(this.containerWidget);
	    if (c.designWrapper)
		c.designWrapper.controlParentChanged();
	}
	this.inherited(arguments);
    },
    writeComponents: function(inIndent, inOptions) {
	var result = [];
	if (this.containerWidget)
	    result = result.concat(this.containerWidget.writeComponents(inIndent, inOptions));
	if (this.components.binding)
	    result = result.concat(this.components.binding.write(inIndent, inOptions));
	return result;
    },
    setInnerHorizontalAlign: function(inAlign) {
	this.innerHorizontalAlign = inAlign
	if (this.containerWidget)
	    this.containerWidget.setHorizontalAlign(inAlign);
    },    
    setInnerVerticalAlign: function(inAlign) {
	this.innerVerticalAlign = inAlign
	if (this.containerWidget)
	    this.containerWidget.setVerticalAlign(inAlign);
    },    
    setInnerLayoutKind: function(inKind) {
	this.innerLayoutKind = inKind;
	if (this.containerWidget)
	    this.containerWidget.setLayoutKind(inKind);
    },    
    setInnerBorder: function(inBorder) {
	inBorder = String(inBorder);
        this.innerBorder = inBorder;
        this.labelWidget.setBorder(inBorder);
        var b = this._parseExtents(inBorder);
        this.containerWidget.setBorder("0," + b.r + "," + b.b + "," + b.l);
    },
    setLayoutKind: function(inKind) {
	wm.Panel.prototype.setLayoutKind.call(this,"top-to-bottom");
	if (this.containerWidget) {
	    this.setInnerLayoutKind(inKind);
	}
	
	// noop
	/*
	this.innerLayoutKind = inKind;
	if (this.containerWidget)
	    this.containerWidget.setLayoutKind(inKind);
	    */
    },    

/*
	addUserClass: function(inClass, inNodeName) {
            if (!this._readyForInitClasses) return this.inherited(arguments);

		this.inherited(arguments);
		if (dojo.isIE < 9)
		    switch(inClass) {
		    case "wm_Border_TopStyleCurved12px":
			dojo.addClass(this._topRightCornerImg, "topright_wm_Border_TopStyleCurved12px");
			dojo.addClass(this._topLeftCornerImg, "topleft_wm_Border_TopStyleCurved12px");
			this._topImgWidth = 11;
			break;
		    case "wm_Border_TopStyleCurved8px":
			dojo.addClass(this._topRightCornerImg, "topright_wm_Border_TopStyleCurved8px");
			dojo.addClass(this._topLeftCornerImg, "topleft_wm_Border_TopStyleCurved8px");
			this._topImgWidth = 7;
			break;
		    case "wm_Border_TopStyleCurved4px":
			dojo.addClass(this._topRightCornerImg, "topright_wm_Border_TopStyleCurved4px");
			dojo.addClass(this._topLeftCornerImg, "topleft_wm_Border_TopStyleCurved4px");
			this._topImgWidth = 3;
			break;
		    case "wm_Border_BottomStyleCurved12px":
			dojo.addClass(this._bottomRightCornerImg, "bottomright_wm_Border_BottomStyleCurved12px");
			dojo.addClass(this._bottomLeftCornerImg, "bottomleft_wm_Border_BottomStyleCurved12px");
			this._bottomImgWidth = 11;
			this._bottomImgHeight = 10;
			break;
		    case "wm_Border_BottomStyleCurved8px":
			dojo.addClass(this._bottomRightCornerImg, "bottomright_wm_Border_BottomStyleCurved8px");
			dojo.addClass(this._bottomLeftCornerImg, "bottomleft_wm_Border_BottomStyleCurved8px");
			this._bottomImgWidth = 7;
			this._bottomImgHeight = 7;
			break;
		    case "wm_Border_BottomStyleCurved4px":
			dojo.addClass(this._bottomRightCornerImg, "bottomright_wm_Border_BottomStyleCurved4px");
			dojo.addClass(this._bottomLeftCornerImg, "bottomleft_wm_Border_BottomStyleCurved4px");
			this._bottomImgWidth = 3;
			this._bottomImgHeight = 3;
			break;
		    }
 		if (inClass.match(/_bottom/i)) {
		    this.containerWidget.addUserClass("wm_Border_BottomStyleCurved4px", inNodeName);
		}

            
	},
    	removeUserClass: function(inClass, inNodeName) {
            if (!this._readyForInitClasses) return this.inherited(arguments);

		this.inherited(arguments);
		if (dojo.isIE < 9) 
		    switch(inClass) {
		    case "wm_Border_TopStyleCurved12px":
			dojo.removeClass(this._topRightCornerImg, "topright_wm_Border_TopStyleCurved12px");
			dojo.removeClass(this._topLeftCornerImg, "topleft_wm_Border_TopStyleCurved12px");
			break;
		    case "wm_Border_TopStyleCurved8px":
			dojo.removeClass(this._topRightCornerImg, "topright_wm_Border_TopStyleCurved8px");
			dojo.removeClass(this._topLeftCornerImg, "topleft_wm_Border_TopStyleCurved8px");
			break;
		    case "wm_Border_TopStyleCurved4px":
			dojo.removeClass(this._topRightCornerImg, "topright_wm_Border_TopStyleCurved4px");
			dojo.removeClass(this._topLeftCornerImg, "topleft_wm_Border_TopStyleCurved4px");
			break;
		    case "wm_Border_BottomStyleCurved12px":
			dojo.removeClass(this._bottomRightCornerImg, "bottomright_wm_Border_BottomStyleCurved12px");
			dojo.removeClass(this._bottomLeftCornerImg, "bottomleft_wm_Border_BottomStyleCurved12px");
			break;
		    case "wm_Border_BottomStyleCurved8px":
			dojo.removeClass(this._bottomRightCornerImg, "bottomright_wm_Border_BottomStyleCurved8px");
			dojo.removeClass(this._bottomLeftCornerImg, "bottomleft_wm_Border_BottomStyleCurved8px");
			break;
		    case "wm_Border_BottomStyleCurved4px":
			dojo.removeClass(this._bottomRightCornerImg, "bottomright_wM_Border_BottomStyleCurved4px");
			dojo.removeClass(this._bottomLeftCornerImg, "bottomleft_wm_Border_BottomStyleCurved4px");
			break;
		    }
 		if (inClass.match(/_bottom/i)) {
		    if (dojo.indexOf(this._classes.domNode, "wm_Border_BottomStyleCurved12px") != -1 ||
			dojo.indexOf(this._classes.domNode, "wm_Border_BottomStyleCurved8px") != -1 ||
			dojo.indexOf(this._classes.domNode, "wm_Border_BottomStyleCurved4px") != -1)
			this.containerWidget.removeUserClass("wm_Border_BottomStyleCurved4px", inNodeName);
		}
	},
	initUserNodeClasses: function(inClasses, inNodeName) {
	    if (!this._readyForInitClasses) return;
	    this._classes.domNode = [];
	    var k = dojo.clone(inClasses) || [], n = this[inNodeName];	    
	    if (n) {
		for (var i = 0; i < k.length; i++) {
		    this.addUserClass(k[i]);
		}
	    }
	},
        */
    setTitle: function(inTitle) {
	var oldTitle = this.title;
	this.title = inTitle;
	if (this.containerWidget) {
	    this.labelWidget.setCaption(inTitle);
	    this.labelWidget.setShowing(Boolean(inTitle));
            //this.containerWidget.setOneMargin((inTitle) ? 0 : 7, "t"); // make room for the curved corners if there's no title showing
	}
    },

        setThemeStyleType: function(inMajor) {
	    this.containerWidget.setThemeStyleType(inMajor);
	    this.themeStyleType = inMajor;
	},
    setLabelHeight: function(inHeight) {
        this.labelHeight = inHeight;
        this.labelWidget.setHeight(inHeight);
    }
});

wm.Panel.extend({
    themeable: false,
    // backward-compatibility fixups
	afterPaletteDrop: function() {
		this.inherited(arguments);
	    if (this instanceof wm.FancyPanel) return;
	    var v = "top-to-bottom", h = "left-to-right", pv = (this.parent.layoutKind == v);
	    this.setLayoutKind(pv ? h : v);
		if (pv)
			this.setWidth("100%");
		else
			this.setHeight("100%");                 
	//        this.setIsRounded(true);
	}

});

 
wm.FancyPanel.extend({
    themeable: true,
    themeableProps: ["innerBorder","borderColor","labelHeight"],
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "innerLayoutKind":
				return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: wm.layout.listLayouts()});
			case "innerHorizontalAlign":
				return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: ["left", "center", "right"/*, "justified"*/]});
			case "innerVerticalAlign":
				return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: ["top", "middle", "bottom"/*, "justified"*/]});
		}
		return this.inherited(arguments);
	}
});

wm.Object.extendSchema(wm.FancyPanel, {
    title: { type: "String", bindTarget: 1, group: "display", order: 100, focus: true },
    labelWidget: {ignore: 1},
    themeStyleType:  {ignore: 1},
    containerWidget: {ignore: 1},
    layoutKind: {ignore: 1},
    innerLayoutKind: {group: "layout", order: 100, shortname: "layoutKind"},
    innerHorizontalAlign: {group: "layout", order: 101, shortname: "horizontalAlign"},
    innerVerticalAlign: {group: "layout", order: 101, shortname: "verticalAlign"},
    padding: {ignore: 1},
    labelHeight: {group: "layout", order: 90},
    border: {ignore: 1},
    innerBorder: {group: "style", shortname: "border"}
});


wm.Panel.description = "A container for widgets.";
