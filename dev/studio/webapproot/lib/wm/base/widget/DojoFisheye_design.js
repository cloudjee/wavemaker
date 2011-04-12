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

dojo.provide("wm.base.widget.DojoFisheye_design");
dojo.require("wm.base.widget.DojoFisheye");

wm.DojoFisheye.description = "A dojo Fisheye.";

wm.DojoFisheye.extend({
    themeable: false,
	setImageUrlField: function(inValue){
		this.imageUrlField = inValue;
		this.renderDojoObj();
	},
	setImageLabelField: function(inValue){
		this.imageLabelField = inValue;
		this.renderDojoObj();
	},
	setItemMaxWidth: function(inValue){
		this.itemMaxWidth = inValue;
		this.renderDojoObj();
	},
	setItemMaxHeight: function(inValue){
		this.itemMaxHeight = inValue;
		this.renderDojoObj();
	},
	setItemHeight: function(inValue){
		this.itemHeight = inValue;
		this.renderDojoObj();
	},
	setItemWidth: function(inValue){
		this.itemWidth = inValue;
		this.renderDojoObj();
	}
});
