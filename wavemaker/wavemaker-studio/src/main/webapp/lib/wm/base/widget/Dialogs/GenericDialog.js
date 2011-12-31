/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Dialogs.GenericDialog");
dojo.require("wm.base.widget.Dialogs.WidgetsJsDialog");

dojo.declare("wm.GenericDialog", wm.WidgetsJsDialog, {
    enterKeyIsButton: 1,
    noEscape: true,
    title: "Generic Dialog",
    footerBorder: "",
    footerBorderColor: "",
    padding: "0",
    regExp: ".*",
    button1Caption: "",
    button2Caption: "",
    button3Caption: "",
    button4Caption: "",
    button1Close: false,
    button2Close: false,
    button3Close: false,
    button4Close: false,
    userPrompt: "Testing...",
    showInput: false,
    prepare: function() {
        this.inherited(arguments);
	if ("enterKeyIsButton1" in this) {
	    this.enterKeyIsButton = this.enterKeyIsButton1 ? 1 : 0;
	    delete this.enterKeyIsButton1;
	}
        this.widgets_data = {
	    genericInfoPanel: ["wm.Panel", {layoutKind: "top-to-bottom", 
					    width: "100%", 
					    height: "100%", 
					    horizontalAlign: "left", 
					    verticalAlign: "top", 
					    autoScroll: true, 
					    fitToContentHeight: true, 
					    padding: "10,5,10,5"}, {},
			       {
				   userQuestionLabel: ["wm.Html", {autoScroll: false, 
								   "height":"25px",
								   autoSizeHeight: true, 
								   "width":"100%",
								   html: ""}],
				   textInput: ["wm.Text", {"width":"100%",
							   "captionSize":"0%",
							   "showing":false}, {}, {}]
	    }]
	};
	this.button_data = {
	    button4: ["wm.Button", {"width":"130px","showing":false}, {"onclick":"buttonClick"}],
	    button3: ["wm.Button", {"width":"130px","showing":false}, {"onclick":"buttonClick"}],
	    button2: ["wm.Button", {"width":"130px","showing":false}, {"onclick":"buttonClick"}],
	    button1: ["wm.Button", {"width":"130px","showing":false}, {"onclick":"buttonClick"}]
	};
    


    },
    postInit: function() {
	this.inherited(arguments);
        this.containerWidget = this.c$[1];
	this.containerWidget.flags.notInspectable = true;
	if (!this.buttonBar) {
            this.buttonBar = this.containerWidget.c$[this.containerWidget.c$.length-1];
	    this.buttonBar.flags.notInspectable = true;
            this.setFooterBorder(this.footerBorder);
            this.setFooterBorderColor(this.footerBorderColor);
	}
	if (this.regExp != ".*")
	    this.$.textInput.setRegExp(this.regExp);

	var captionFound = false;
	for (var i = 1; i <= 6; i++) {
	    var caption = this["button" + i + "Caption"];
	    var button = this.$["button" + i];
	    if (caption) {
		captionFound = true;
		button.setCaption(caption);
		button.show();
	    }
            if (this.buttonBar)
	        this.buttonBar.setShowing(captionFound);
	    this.setShowInput(this.showInput);
	}
        if (this.$.userQuestionLabel)
	    this.$.userQuestionLabel.setHtml(this.userPrompt);
        this.containerWidget.setFitToContentHeight(true);
    },
    setFooterBorder: function(inBorder) {
        this.footerBorder = inBorder;
        if (this.buttonBar) {
	    this.buttonBar.setBorder(inBorder);
            this.buttonBar.setHeight((34 + this.buttonBar.padBorderMargin.t + this.buttonBar.padBorderMargin.b) + "px");
        }
    },
    setFooterBorderColor: function(inBorderColor) {
        this.footerBorderColor = inBorderColor;
        if (this.buttonBar)
            this.buttonBar.setBorderColor(inBorderColor);
    },
    // handle fitToContentHeight adjustments
    reflow: function() {
        try {
	    if (this._userSized) {
                return this.inherited(arguments);
	    } else if (!this._settingHeight) {
                var height = this.getPreferredFitToContentHeight();
		if (dojo.isChrome) height--; // stupid chrome bug...
                this._settingHeight = true;
                this.setHeight(height + "px");
                this._settingHeight = false;

                this.inherited(arguments);
            }
        } catch(e) {this._settingHeight = false;}
        
    },
    setShowing: function(inShowing,forceChange) {
        this.inherited(arguments);
        if (inShowing) {
            if (this.$.userQuestionLabel)
                this.$.userQuestionLabel.doAutoSize(true,true);
            if (this.showInput && this.$.textInput && this.$.textInput.focus)
                this.$.textInput.focus();
            wm.onidle(this, "reflow");
        }
    },
    setShowInput: function(inShowInput) {
	this.showInput = inShowInput;
        if (this.$.textInput)
	    this.$.textInput.setShowing(inShowInput);
    },

    setInputDataValue: function(inValue) {
        if (this.$.textInput)
	    this.$.textInput.setDataValue(inValue);
    },
        getInputDataValue: function(inValue) {
        var result;
        if (this.$.textInput) {
	    result = this.$.textInput.getDataValue();
            if (dojo.isString(result))
                result = dojo.trim(result);
            return result;
        }
    },
    setUserPrompt: function(inPrompt) {
	this.userPrompt = inPrompt;
        if (this.$.userQuestionLabel)
	    this.$.userQuestionLabel.setHtml(inPrompt);
    },
    setButton1Caption: function(inCap) {this.setButtonCaption(1,inCap);},
    setButton2Caption: function(inCap) {this.setButtonCaption(2,inCap);},
    setButton3Caption: function(inCap) {this.setButtonCaption(3,inCap);},
    setButton4Caption: function(inCap) {this.setButtonCaption(4,inCap);},
    
    setButtonCaption: function(inButtonNumber, inButtonCaption) {
	var button = this.$["button" + inButtonNumber];
	this["button" + inButtonNumber + "Caption"] = inButtonCaption;
        if (!button) return;
	if (inButtonCaption) {
	    button.setCaption(inButtonCaption);
	    button.show();
	} else {
	    button.hide();
	}	
        if (this.buttonBar)
	    this.buttonBar.setShowing(this.button1Caption || this.button2Caption || this.button3Caption || this.button4Caption);
    },
    onEnterKeyPress: function(inText, inEvent) {
        if (this.enterKeyIsButton) {
	    this.buttonClick(this.$["button" + this.enterKeyIsButton]);
	    dojo.stopEvent(inEvent);
        }
    },
    buttonClick: function(inSender) {
	var name = inSender.name;
	var id = parseInt(name.match(/\d+/)[0]);
	if (this["button" + id + "Close"]) this.dismiss();

	var text = (this.$.textInput) ? this.$.textInput.getDataValue() : "";
	switch(id) {
	case 1:  this.onButton1Click(inSender, text);break;
	case 2:  this.onButton2Click(inSender, text);break;
	case 3:  this.onButton3Click(inSender, text);break;
	case 4:  this.onButton4Click(inSender, text);break;
	}
    },
    onButton1Click: function(inButton, inText) {},
    onButton2Click: function(inButton, inText) {},
    onButton3Click: function(inButton, inText) {},
    onButton4Click: function(inButton, inText) {}
});
