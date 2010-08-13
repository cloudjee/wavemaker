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
/**
 * @class Ext.layout.BoxLayout
 * @extends Ext.layout.ContainerLayout
 */
Ext.layout.BoxLayout = Ext.extend(Ext.layout.ContainerLayout, {
		// private
		monitorResize:true,
		// private
		extraCls: 'x-column',
		scrollOffset : 0,

		// private
		isValidParent : function(c, target){
			return c.getEl().dom.parentNode == this.innerCt.dom;
		},

		// private
		onLayout : function(ct, target){
			if(!this.innerCt){
				target.addClass('x-column-layout-ct');
				// the innerCt prevents wrapping and shuffling while
				// the container is resizing
				this.innerCt = target.createChild({cls:'x-column-inner'});
				this.innerCt.createChild({cls:'x-clear'});
			}
			//
			this.renderAll(ct, this.innerCt);
			//
			var size = target.getViewSize();
			if(size.width < 1 && size.height < 1){ // display none?
				return;
			}
			this.adjustSize(target, size);
			//
			this[ct.box == "v" ? "layoutY" : "layoutX"](ct.items.items, size);
		},

		// private
		adjustSize: function(target, size) {
			size.width -= target.getPadding('lr') - this.scrollOffset;
			size.height -= target.getPadding('tb');
		},

		// private
		layoutX: function(items, size){
			this.arrange(items, "width", size.width, "setWidth", size.height, "setHeight", "lr");
		},

		// private
		layoutY: function(items, size){
			this.arrange(items, "height", size.height, "setHeight", size.width, "setWidth", "tb");
		},

		// private
		arrange: function(inCs, inDimension, inSpace, inFlexSetter, inExtent, inSetter, inEdges) {
			this.innerCt[inFlexSetter](inSpace);
			// some boxes can be elastic while others are fixed
			// so we need to make 2 passes
			var flex = 0;
			for (var i=0, c; c=inCs[i]; i++) {
				flex += c.flex || 0;
				if(!c.flex){
					inSpace -= (c.getSize()[inDimension] + c.getEl().getMargins(inEdges));
				}
				c[inSetter](inExtent);
			}
			var scalar = inSpace < 0 || !flex ? 0 : inSpace / flex;
			for (i=0; c=inCs[i]; i++) {
				if(c.flex){
						c[inFlexSetter](Math.floor(c.flex*scalar) - c.getEl().getMargins(inEdges));
				}
			}
		}
});

Ext.Container.LAYOUTS['box'] = Ext.layout.BoxLayout;