/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 

dojo.provide("wm.studio.pages.HandleRequiredJars.HandleRequiredJars");

dojo.declare("HandleRequiredJars", wm.Page, {
    start: function() {
/*
	this.layers.decorator.buttonPanel.setHeight("42px")
	this.layers.decorator.buttonPanel.setMargin("10,0,0,0");
	*/
	this.layers.decorator.buttonPanel.setParent(this.root);
	this.layers.decorator.doneCaption = "Reload";
    },
    onShow: function() {
	this.layer2.invalid = this.layer4.invalid = this.layer6.invalid = true;
	this.layer1.activate();
    },

    onSuccess: function(inSender) {
	var layer = inSender.parent;
	layer.invalid = false;
	var index = layer.getIndex();
	var layers = layer.parent.layers;
	for (var i = index + 1; i < layers.length; i++) {
	    if (layers[i].showing) {
		layer.parent.setLayerIndex(i);
		break;
	    }
	}
    },
    done: function() {
	this.close();
	window.location.reload(true);
    },
    close: function() {
	this.layer3.hide();
	this.layer4.hide();
	this.layer5.hide();
	this.layer6.hide();
	this.owner.owner.hide();
    },
    _end: 0
});
