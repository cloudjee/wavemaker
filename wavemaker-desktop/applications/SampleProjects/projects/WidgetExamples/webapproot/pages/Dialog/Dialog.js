/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
dojo.declare("Dialog", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
	//	try {
            var layerName;
            // If layer is specified, go to that layer
/*
            if (app instanceof WidgetExamples) {
                layerName = app.layerNameVar.getValue('dataValue');
            } else {
                layerName = '';
            }

            if (layerName !== '') {
                app.layerNameVar.setValue('dataValue','');
                var layerArray = ['button','toggle','busy','popup','right'];
                if (dojo.indexOf(layerArray, layerName) >=0)                
                    this.tabLayers1.setLayer(layerName);
                else
                    app.toastError("Unrecognized Page parameter in url = "+ layerName);
            }
	//	} catch(e) {
	//		app.toastError(this.name + ".start() Failed: " + e.toString()); 
	//	}
	    */
	},
  _end: 0
});