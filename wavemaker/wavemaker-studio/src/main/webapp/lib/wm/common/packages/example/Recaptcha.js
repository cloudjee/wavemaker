/*
 *  Copyright (C) 2013 VMware, Inc. All rights reserved.
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

/*
 * Recaptcha - An example Custom Widget using a third party library from
 *    https://developers.google.com/recaptcha
 * For details on this widget, go to
 *    http://dev.wavemaker.com/wiki/bin/edit/wmdoc_6.6/RecaptchaExample 
 */

/* This declares that the specified package has been loaded; and implies that the package
 * is located at common/packages/example/Recaptcha.js
 */
dojo.provide("wm.packages.example.Recaptcha");

/* This declares a new widget class called "example.Recaptcha".  Do not use wm. as
 * your prefix.  It creates a subclass of wm.Container because we want to have both
 * the recaptcha widget AND a submit button as part of this widget.
 */
dojo.declare("example.Recaptcha", wm.Container, {

    /* Set basic Container properties */
    layoutKind: "top-to-bottom",
    verticalAlign: "top",
    horizontalAlign: "left",
    lock: true, // don't allow developers to drag stuff INTO this container

    /* Set basic widget properties */
    width: "320px",
    height: "160px",

    /* These are the only Recaptcha properties */
    publicKey: "",
    themeName: "red",

    init: function() {
        this.inherited(arguments);
        /* Load the script: Adds a <script> tag to the header of the html document.
         * Why not just include the script tag in index.html?
         * 1. Users who import this composite may not remember to add the script tag
         *    to index.html (workaround: A design-time afterPaletteDrop event could trigger
         *    a service to update index.html for the user)
         * 2. The library should not be loaded until its actually needed.
         *    If the user has to navigate through the application to the page
         *    that uses the pubnub service, then why should they have to wait for the entire
         *    application to load before interacting with the main page?
         */

        // WM 6.6, use this line:
        wm.loadScript("http://www.google.com/recaptcha/api/js/recaptcha_ajax.js",true);
        // WM 6.5, use this line:
        // wm.headAppend(wm.createElement("script", { type: "text/javascript", src: "http://www.google.com/recaptcha/api/js/recaptcha_ajax.js" }));
    },

    /* Create all of the subcomponents needed for this widget, and then wait for the recaptcha
     * library to load
     */
    postInit: function() {
        this.inherited(arguments);
        this.recaptchaControl =
            new wm.Control({name: "recaptchaControl",
                            parent: this,
                            owner: this,
                            width: "100%",
                            height: "100%"});
        this.submitButton = new wm.Button({
                            name: "button",
                            parent: this,
                            owner: this,
                            width: "100px",
                            height: "40px",
                            caption: "Submit"});
        this.connect(this.submitButton, "onclick", this, "submit");
        this.svar = new wm.ServiceVariable({
            owner: this,
            name: "svar",
            service: "RecaptchaService",
            operation: "verify"});
        this.connect(this.svar, "onSuccess", this, "handleResponse");

        if (!this._isReady) this.waitUntilReady();
    },

    /* Poll every 50 ms until the google libraries have successfully loaded. Probably
     * there is a better technique than this, but that technique would not work with
     * many different libraries
     */
    waitUntilReady: function() {
        if (!window["Recaptcha"]) {
            wm.job("waitUntilReady", 50, this, "waitUntilReady");
            return;
        }
        this.createRecapcha();
    },

    /* This code is copied mostly from the recaptcha docs */
    createRecapcha: function() {
        if (!window["Recaptcha"]) return;
        Recaptcha.create(this.publicKey, this.recaptchaControl.domNode, {
             theme: this.themeName,
             callback: dojo.hitch(this, "completeCreateRecaptcha")})
    },

    /* After the recaptcha is created, put an onkeypress event so we can
     * submit when the user hits the ENTER key
     */
    completeCreateRecaptcha: function() {
        var input = dojo.query("#recaptcha_response_field", this.domNode)[0];
        if (input) {
            this.connect(input, "onkeypress", this, "keypressed");
        }

        // Focus on the recaptcha so the user can start typing
        Recaptcha.focus_response_field();
    },

    /* Fire our ServiceVariable to validate the user's input. */
    submit: function() {
        //Recaptcha.ajax_verify(dojo.hitch(this, "verificationResponse"));
        this.svar.input.setValue("challenge", Recaptcha.get_challenge());
        this.svar.input.setValue("response", Recaptcha.get_response());
        this.svar.update();
    },
    keypressed: function(inEvent) {
        if (inEvent.keyCode == dojo.keys.ENTER) this.submit();
    },

    /* Server either returns "Success" or "" */
    handleResponse: function(inResponse) {
        if (inResponse) {
            this.onSuccess();
        } else {
            Recaptcha.reload();
        }
    },

    /* Connect to this to know when the user has been validated.  Typically
     * you would do a layer navigation or pageLoad on detecting this event
     */
    onSuccess: function() {
    },

    /* Design-time only */
    setThemeName: function(inTheme) {
        this.themeName = inTheme;
        app.toastInfo("New theme will display the next time you reload studio");
    },
    afterPaletteDrop: function() {
        this.inherited(arguments);
        app.alert("Make sure you create the Java Service described in the <a href='http://dev.wavemaker.com/wiki/bin/wmdoc_6.6/RecaptchaExample'>Wiki</a>");
    },
    _end: null

});

// Add attributes to show in the WaveMaker Studio properties editor
wm.Object.extendSchema(example.Recaptcha, {
    // options generates a pulldown menu of options in the property panel
    themeName: {options: ["red", "white", "blackglass", "clean"]},

    // publicKey is just a generic text input
    publicKey: {},

    // Do not allow the user to edit these properties inherited from wm.Container or wm.Control.
    layoutKind: {ignore:1},
    horizontalAlign: {ignore:1},
    verticalAlign: {ignore:1},
    width: {ignore:1},
    height: {ignore:1},
    margin: {ignore:1},
    padding: {ignore:1},
    border: {ignore:1},
    borderColor: {ignore:1},
    autoScroll: {ignore:1},
    disabled: {ignore:1},
    resizeToFit: {ignore:1},
    lock: {ignore:1},
    freeze: {ignore:1}
});

wm.registerPackage(["Example", "Recaptcha", "example.Recaptcha", "common.packages.example.Recaptcha", "images/wm/widget.png", "", {},false,undefined]);