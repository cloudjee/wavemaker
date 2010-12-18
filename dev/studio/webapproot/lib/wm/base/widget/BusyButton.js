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

/* BusyButton.js
 * What is a busy button?  Its a fancier version of our standard button that shows its state via icons
 * Differences from wm.Button
 * 1. All wm.Button icon controls are removed so that we can control the icon without conflicts
 * 2. User provides 3 urls; we provide 3 default values that should suffice.  A loading indicator, an error indicator and a success indicator
 * 3. User specifies a service variable that will be executed when the button is clicked (picks from a pulldown menu of variables)
 * 4. When the button is clicked, its disabled until the service variable returns (success/error doesn't matter)
 * 5. When the button is waiting for the service variable to get its result, it shows its Loading Icon
 * 6. When the button gets back an error from the service variable, it shows the error icon AND sets the button hint to have the error message returned (NOTE: if user removes the error icon, then no error icon is used)
 * 7. When the button gets back a success from the service variable, it shows the success icon.
 */

dojo.provide("wm.base.widget.BusyButton");

dojo.declare("wm.BusyButton", wm.Button, {

      // Three User configurable paths to icons that represent the state of the request the button has triggered
      iconLoadingUrl: wm.theme.getImagesPath() + "loadingThrobber.gif",
      iconErrorUrl:  wm.theme.getImagesPath() + "error.png",
      iconSuccessUrl:wm.theme.getImagesPath() + "success.png",

      // This is the icon to show when nothing else is happening.  Defaults to no icon, but a developer may
      // use an icon here much as they would for a regular button
      defaultIconUrl: null,

      // Space to allocate for the icon
      iconWidth: "22px",
      iconHeight: "22px",
      iconMargin: "0 10px 0 0",

      // the object of the variable we're bound to.  This is NOT safe to write to a widgets.js file
      clickVariable: null,

      init: function() {
	  this.inherited(arguments);
	  this.setDefaultIconUrl(this.defaultIconUrl);
	  this.setClickVariable(this.clickVariable);	  
      },

      /* The default icon url should always have an icon; this insures rendering
       * allocates space for the icon, and therefore doens't have to push text around 
       * to show status icons when they show up. */
      setDefaultIconUrl: function(inUrl) {
          if (!inUrl) inUrl = wm.theme.getImagesPath() + "blank.gif";
          this.defaultIconUrl = inUrl;
	  this.setIconUrl(this.defaultIconUrl);
       },

      /* Save the clickVariable; retrieve the clickVarObj and set it from the clickVariable */
       setClickVariable: function(inVar) {
	    if (typeof inVar == "string" )
		this.clickVariable = this.owner[inVar] || wm.Component.byId[inVar];
	    else 
		this.clickVariable = inVar;
       },

      /* Set the icon to currently show. Save inUrl as the defaultIconUrl unless noCache is passed in.
       * Developers should NOT use noCache; noCache is used to set the loading, success and error icons such that
       * they don't clobber the icon that the button restores to when its done. */
       setIconUrl: function(inUrl, noCache) {
	  this.inherited(arguments);
	  if (!noCache)
	      this.defaultIconUrl = this.iconUrl;
	},

	onclick: function(inEvent) {
          // If onError set the hint, restore the standard hint or "" the next time the user clicks the button
          this.setHint(this.standardHint || "");
	  delete this.standardHint;

	  // This shouldn't do anything; ideally, all events triggered should be in clickVariable
	  this.inherited(arguments);

	  // If there is a clickVariable, connect to the service variables events, and then fire the variable.
	  if (this.clickVariable) {
	     this.connect(this.clickVariable, "onSuccess", this, "onSuccess");
	     this.connect(this.clickVariable, "onError", this, "onError");
	     this.connect(this.clickVariable, "onResult", this, "onResult");
	     this.clickVariable.update();

	     // Also set the loading icon and disable the button
	     this.setIconUrl(this.iconLoadingUrl,true);
	     this.setDisabled(true);
	  }
	},

        /* If the operation is a success, show either the success icon or the default icon (if there is no success icon).
	 * Show the success icon for 5 seconds and then switch back to the default icon (skip this if no success icon or 
	 *  no default icon.
	 */
        onSuccess: function() {
	    this.setIconUrl(this.iconSuccessUrl || this.defaultIconUrl, true);
	    if (this.iconSuccessUrl && this.defaultIconUrl) {
		wm.job("ClearBusyButton" + this.name, 5000, 
		       dojo.hitch(this, function() {
			       this.setIconUrl(this.defaultIconUrl, true);
			   }));
	    }

	    // If we don't disconnect from the serviceVar, then anytime anyone/anything fires it, our 
	    // onSuccess/onError/onResult methods will fire. WARNING: If connected to any other types of events, 
	    // this will be disconnected.
	    this.disconnectEvent("onSuccess");
	    this.disconnectEvent("onError");
	    this.disconnectEvent("onResult");
	},

      /* If the operation fails, set the button hint to the error message, set the icon to either the error icon or default icon
       * and then disconnect all events */
	onError: function(inError) {
            this.standardHint = this.hint;
            this.setHint(inError);
	    this.setIconUrl(this.iconErrorUrl || this.defaultIconUrl, true);
	    this.disconnectEvent("onSuccess");
	    this.disconnectEvent("onError");
	    this.disconnectEvent("onResult");
	},

      /* When the service variable returns, enable the button again */
       onResult: function() {
	    this.setDisabled(false);
	}
  });

// design-time

wm.Object.extendSchema(wm.BusyButton, {
      iconUrl: {ignore: 1},
	    clickVariable:  {group: "BusyButton", bindTarget: 1, order: 29, type: "wm.ServiceVariable", readonly: true},
    defaultIconUrl: {group: "BusyButton", bindable: true, order: 30, type: "String", subtype: "File", doc: 1},
      iconLoadingUrl: {group: "BusyButton", bindable: true, order: 31, type: "String", subtype: "File",  doc: 1},
      iconSuccessUrl: {group: "BusyButton", bindable: true, order: 32, type: "String", subtype: "File",  doc: 1},
      iconErrorUrl:   {group: "BusyButton", bindable: true, order: 33, type: "String", subtype: "File",  doc: 1},
    iconWidth:      {group: "BusyButton", order: 34, doc: 1},
      iconHeight:      {group: "BusyButton", order: 35, doc: 1},
      iconMargin:      {group: "BusyButton", order: 36, doc: 1},
      imageList: {ignore: 1},
      imageIndex: {ignore: 1},
});

wm.BusyButton.extend({
	set_clickVariable: function(inVar) {
		// support setting dataSet via id from designer
		if (inVar && !(inVar instanceof wm.ServiceVariable)) {
			var ds = this.getValueById(inVar);
			if (ds)
				this.components.binding.addWire("", "clickVariable", ds.getId());
		} else
		    this.setClickVariable(inVar);
	},

	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "clickVariable":
			    return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.clickVariable ? this.clickVariable.getId() : "" , allowAllTypes: true});
		}
		return this.inherited(arguments);
	}
});

wm.BusyButton.description = "A button that indicates when its ServiceVariable/LiveVariable is processing the button's action";
