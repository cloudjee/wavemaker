/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.layout.box");

wm.inLayout = function(inNode) {
	var s = inNode.style;
	return s && s.zIndex >=0 && s.zIndex <= 1 && s.display != 'none' && s.visibility != 'hidden' && inNode.tagName != 'SCRIPT' && inNode.nodeType == 1;
}

;(function(){

/*
dojo.declare("wm.layout.box", null, {
	// abstract
	alignChildren: function(inChildren, inNode) {},
	measureContent: function(inNode) {},
	sorter: function(a, b) {
		return true;
	},
	//
	getAttribute: function(inNode, inAttribute) {
		return inNode.getAttribute && inNode.getAttribute(inAttribute);
	},
	reflow: function(inNode) {
		// Only arrive here from top level reflow, recursing reflows 
		// go into reflowNode.
		// Here we can prepare top nodes.
		// Child nodes are prepared as part of extent measuring.
		if (!inNode._reflowing) {
			this.reflowNode(inNode);
		}
	},
	prepareNode: function(inNode) {
		if (!inNode.reflow) {
			inNode.box = inNode.box || inNode.getAttribute('box');
			inNode.reflow = tl.box._reflower;
			inNode.boundschange = tl.box._boundschange;
		}
		// FIXME: pacify IE
		//if (inNode.parentNode) {
			if (!inNode._scrollCache)
				tl.box.cacheNodeScroll(inNode);
			//console.log("prepare:", inNode._scrollCache, inNode);
			inNode.scrollTop = inNode.scrollLeft = 0;
		//}
		var s = inNode.style;
		s.overflowY = s.overflowX = s.overflow = "hidden";
	},
	finishNode: function(inNode) {
		var s = inNode.style;
		if ((s.overflowX != "hidden" || s.overflowY != "hidden")) {
			// FIXME: whee, liable to cause race conditions, but both FF and IE
			// seem to have trouble with the scrollbar if they don't get a chance
			// to breathe.
			//setTimeout(function() {
				var sc=inNode._scrollCache, l=sc.left, t=sc.top;
				// FIXME: I suspect we have to check these for values for quality
				inNode.scrollLeft = l;
				inNode.scrollTop = t;
				inNode._scrollCache = null;
				//console.log("finish", sc, inNode);
			//}, 0);
		}
	},
	prepareChildNode: function(inNode) {
		if (!inNode._boxed) {
			var s = inNode.style;
			s.position = 'absolute';
			s.margin = 0; // doh
			inNode.box = inNode.box || inNode.getAttribute('box');
			inNode.boxPosition = inNode.boxPosition || inNode.getAttribute('boxPosition');
			inNode.flex = Number(isNaN(inNode.flex) ? inNode.getAttribute('flex') || 0 : inNode.flex);
			inNode._boxed = true;
			inNode._boxCache = { w:NaN, h:NaN};
		} 
		else inNode._boxCache = { w: inNode.offsetWidth, h: inNode.offsetHeight };
		return inNode;
	},
	reflowNode: function(inNode) {
		this.prepareNode(inNode);
		if (inNode.selfFlow) {
			inNode.selfFlow();
		} else {
			var children = this.listChildren(inNode);
			if (children.length) {
				console.log("layout.box: aligning children for", inNode);
				this.alignChildren(children, inNode);
				if (tl.box.recurse)
					this.reflowChildren(children);
				this.notifyChildren(children);
			}
		}
		this.finishNode(inNode);
	},
	reflowChildren: function(inChildren) {
		for (var i=0, n; (n=inChildren[i]); i++)
			if (n.box)
				//if (n._boxCache.w!=n.offsetWidth || n._boxCache.h!=n.offsetHeight)
					this.reflowChildBox(n);
				//else
				//	console.log("skipping ", n, n._boxCache);
	},
	reflowChildBox: function(inNode) {
		var f = tl[tl.box.getBox(inNode.box)];
		f && f.reflowNode(inNode);
		//node._rebox = false;
	},
	notifyChildren: function(inChildren) {
		for (var i=0, n; (n=inChildren[i]); i++)
			// onboundschange not boundschange to avoid auto reflow
			// everybody else should call boundschange
			n.onboundschange && n.onboundschange();
	},
	fit: function(n) {
		if (n.getAttribute('fitToContent')) {
			n.style.position = 'static';
			this.measureContent(n, this.listChildren(n));
			n.style.position = 'absolute';
		}
		else if (n.getAttribute('fit')) {
			dojo.marginBox(n, dojo.contentBox(n.parentNode));
		}
	},
	getExtents: function(inChildren) {
		var x = { 
			totalFlex: 0,
			totalExtentW: 0,
			totalExtentH: 0
		}
		for (var i=0, node, w; (node=inChildren[i]); i++) {
			if (!node.flex) {
				x.totalExtentW += node.offsetWidth;
				x.totalExtentH += node.offsetHeight;
			} else
				x.totalFlex += node.flex;
		}
		x.totalFlex = x.totalFlex;
		return x;
	},
	listChildren: function(inNode, inForceSort) {
		var result=[];
		for (var node=inNode.firstChild; node; node=node.nextSibling){
			if (wm.inLayout(node)){
				this.prepareChildNode(node);
				result.push(node);
			}
		}
		if (inForceSort || tl.box.sorting)
			result.sort(this.sorter);
		return result;
	},
	listBoxedChildren: function(inNode) {
		var result=[];
		for (var node=inNode.firstChild; node; node=node.nextSibling)
			if (node._boxed)
				result.push(node);
		return result;
	},
	*/
	/*arrange: function(inNode) {
		var list = this.listChildren(inNode, true), ulist = this.listBoxedChildren(inNode);
		for (var i=0, n, c; (n=list[i])&&(c=ulist[i]); i++)
			if (c!=n)
				inNode.appendChild(n);
	},*/
	/*
	listChildren2: function(inNode) {
		var result=[];
		for (var node=inNode.firstChild; node; node=node.nextSibling){
			if (wm.inLayout(node))
				result.push(node);
		}
		return result;
	},
	arrange: function(inNode) {
		var list = this.listChildren2(inNode);
		list.sort(this.sorter);
		for (var i=0, n; (n=list[i]); i++)
			inNode.appendChild(n);
	},
	dummy: 0
});
*/

/*
var tl = wm.layout;

tl.setBox = dojo._setMarginBox;

dojo.mixin(tl.box, {
	sorting: false,
	recurse: true,
	setBoxPosition: function(inNode, inTl, inHw, inExt) {
		var bp = inNode.boxPosition || inNode.getAttribute("boxPosition");
		if (!bp || bp == "topLeft")
			return inTl;
		else if (bp == "center")
			return inTl + Math.floor((inHw - inExt)/ 2);
		else
			return inTl + inHw -inExt;
	},
	getBox: function(inBox) {
		return inBox && (inBox.length < 2 ? inBox + "box" : inBox);
	},
	cacheNodeScroll: function(inNode) {
		inNode._scrollCache = { left: inNode.scrollLeft, top: inNode.scrollTop };
	},
	_dispatch: function(inNode, inFunc, inArgs) {
		var box = inNode.box || inNode.getAttribute("box");
		var f = tl[tl.box.getBox(box)];
		f && f[inFunc].apply(f, inArgs);
	},
	reflow: function(inNode) {
		tl.box._dispatch(inNode, "reflow", arguments);
		//var f = tl.box._getBoxMgr(inNode);
		//f && f.reflow(inNode);
	},
	rearrange: function(inNode) {
		tl.box._dispatch(inNode, "arrange", arguments);
		//var f = tl.box._getBoxMgr(inNode);
		//f && f.arrange(inNode);
	},
	suggest: function(inNode, inRect) {
		tl.box._dispatch(inNode, "suggest", arguments);
	},
	doboundschange: function(inNode) {
		if (inNode.onboundschange)
			inNode.onboundschange(); // everybody else should call boundschange
	},
	_boundschange: function() {
		tl.box.reflow(this);
		tl.box.doboundschange(this);
	},
	_reflower: function() {
		tl.box.reflow(this);
	}
});
*/

dojo._getBorderExtents = function(/*DomNode*/n, /*Object*/computedStyle){
	//	summary:
	//		returns an object with properties useful for noting the border
	//		dimensions.
	//			l/t = the sum of left/top border (respectively)
	//			w = the sum of the left and right border
	//			h = the sum of the top and bottom border
	//		The w/h are used for calculating boxes.
	//		Normally application code will not need to invoke this
	//		directly, and will use the ...box... functions instead.
	var
		tn = n.tagName,
		isBordered = (tn == 'INPUT' || tn == 'BUTTON'),
		ne='none',
		px=dojo._toPixelValue, 
		gcs=dojo.getComputedStyle,
		s=computedStyle||gcs(n), 
		bl=(s.borderLeftStyle!=ne || isBordered ? px(n, s.borderLeftWidth) : 0),
		bt=(s.borderTopStyle!=ne || isBordered ? px(n, s.borderTopWidth) : 0);
	return {
		l: bl,
		t: bt,
		w: bl + (s.borderRightStyle!=ne || isBordered ? px(n, s.borderRightWidth) : 0),
		h: bt + (s.borderBottomStyle!=ne || isBordered ? px(n, s.borderBottomWidth) : 0)
	};
}

/*
dojo.declare("wm.layout.vbox", tl.box, {
	measureContent: function(inNode, inChildren)	{
		inNode.style.width = ''; 
		var w = 0;
		for (var i=0, node; (node=inChildren[i]); i++) {
			this.prepareChildNode(node);
			node.style.width = '';
			w = Math.max(w, node.offsetWidth);
		}
		inNode.style.width = w + 'px';
	},
	sorter: function(a, b) {
		return a.offsetTop - b.offsetTop;
	},
	alignChildren: function(inChildren, inNode) {
		// get our container dimensions
		var box = dojo._getContentBox(inNode);
		// size all non-flex boxes so we know what their height will be at this width
		for (var i=0, node; (node=inChildren[i]); i++) {
			if (!node.flex) {
				//if (box.w != inNode.offsetWidth) {
					//inNode._rebox = true;
					tl.setBox(node, NaN, NaN, box.w);
				// some nodes may need to do work to size correctly
					wm.fire(node, "onautosize", [box.w, 0]);
				//}
			}
		}
		// manage overflow
		var style = inNode.style;
		// get extents
		var exts = this.getExtents(inChildren), scalar;
		if (exts.totalFlex) {
			scalar = Math.max(0, (box.h - exts.totalExtentH) / (exts.totalFlex || 1));
		} else {
			var th = exts.totalExtentH;
			if (th > box.h && !inNode._noscroll) {
				style.overflowY = "scroll";
				// need to recalculate box in case scrollbar appears
				box = dojo._getContentBox(inNode);
			} else
				box.t = tl.box.setBoxPosition(inNode, box.t, box.h, th);
		}
		// align everybody
		for (i=0; (node=inChildren[i]); i++) {
			var h = node.flex ? Math.round(node.flex * scalar) : NaN;
			//if (box.w != inNode.offsetWidth || (h>=0 && h!=inNode.offsetHeight))
			//	inNode._rebox = true;
			tl.setBox(node, box.l, box.t, box.w, h);
			//console.debug(box.w, node.offsetWidth, h, node.offsetHeight);
			box.t += node.offsetHeight;
		}
	},
	suggest: function(inNode, inRect) {
		var box = dojo.contentBox(inNode);
		inRect.l = box.l;
		inRect.w = box.w;
		var list = this.listChildren2(inNode);
		for (var i=0, node, y; (node=list[i]); i++) {
			if (inRect.t < node.offsetTop + node.offsetHeight / 2) {
				inRect.t = node.offsetTop - 1;
				return;
			}
			y = node.offsetTop + node.offsetHeight;
		}
		inRect.t = y;
	},
	dummy: 0
});

// singleton
tl.vbox = new tl.vbox();

dojo.declare("wm.layout.hbox", tl.box, {
	measureContent: function(inNode){
		inNode.style.height = '';
		var h = 0;
		for (var i=0, node; (node=inChildren[i]); i++) {
			node.style.height = '';
			this.prepareChildNode(node);
			h = Math.max(h, node.offsetHeight);
		}
		inNode.style.height = h + 'px';
	},
	sorter: function(a, b) {
		return a.offsetLeft - b.offsetLeft;
	},
	alignChildren: function(inChildren, inNode) {
		// get our container dimensions
		var box = dojo._getContentBox(inNode);
		// size all non-flex boxes so we know what their width will be at this height
		for (var i=0, node, h; (node=inChildren[i]); i++) {
			if (node.tagName == "BUTTON" && !node.style.width) {
				node.style.width = node.offsetWidth + "px";
			}
			if (!node.flex) {
				dojo._setMarginBox(node, NaN, NaN, NaN, box.h);
				// some nodes may need to do work to size correctly
				wm.fire(node, "onautosize", [0, box.h]);
			}
		}
		// manage overflow
		var style = inNode.style;
		// get extents
		var exts = this.getExtents(inChildren), scalar;
		if (exts.totalFlex) {
			var w = box.w - exts.totalExtentW;
			scalar = Math.max(0, (box.w - exts.totalExtentW) / (exts.totalFlex || 1));
		} else {
			var tw = exts.totalExtentW, bp = inNode.boxPosition;
			if (tw > box.w && !inNode._noscroll) {
				style.overflowX = "scroll";
				// need to recalculate box in case scrollbar appears
				box = dojo._getContentBox(inNode);
			} else
				box.l = tl.box.setBoxPosition(inNode, box.l, box.w, tw);
		}
		//
		// align everybody
		for (i=0; (node=inChildren[i]); i++) {
			var w = node.flex ? Math.round(node.flex * scalar) : NaN;
			dojo._setMarginBox(node, box.l, box.t, w, box.h);
			box.l += node.offsetWidth;
			//node._rebox = true;
		}
	},
	suggest: function(inNode, ioRect) {
		var box = dojo.contentBox(inNode);
		ioRect.t = box.t;
		ioRect.h = box.h;
		var list = this.listChildren2(inNode);
		//console.log(list);
		for (var i=0, x=0, node; (node=list[i]); i++) {
			if (ioRect.l < node.offsetLeft + node.offsetWidth / 2) {
				ioRect.l = node.offsetLeft - 1;
				return;
			}
			x = node.offsetLeft + node.offsetWidth;
		}
		ioRect.l = x;
	},
	dummy: 0
});

// singleton
tl.hbox = new tl.hbox();

// singleton
tl.free = new tl.box();

dojo.declare("wm.layout.flow", tl.box, {
	prepareChildNode: function(inNode) {
		if (!inNode._boxed) {
			inNode.style.position = 'relative'; //static';
			inNode._boxed = true;
		}
	}
});

// singleton
tl.flow = new tl.flow();
*/

})();