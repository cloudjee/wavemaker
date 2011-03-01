/*
 *  Copyright (C) 2010-2011 WaveMaker Software, Inc.
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



Login.widgets = {
    layoutBox: ["wm.Layout", {height: "100%"}, {}, {
	loginMainPanel: ["wm.Panel", {verticalAlign: "center", horizontalAlign: "center", height: "100%", width: "100%", layoutKind: "top-to-bottom", border: "0", padding: "10", verticalAlign: "center", horizontalAlign: "center"}, {}, {
            wmTitle: ["wm.Label", {align: "center", width: "350px", height: "20px"}],
	    loginInputPanel: ["wm.EmphasizedContentPanel", {padding: "10", width: "350px", height: "140px", border: "2", verticalAlign: "center", horizontalAlign: "center"}, {}, {
		usernameInput: ["wm.Text", {caption: "Username", captionSize: "120px", layoutKind: "left-to-right"}], 
		passwordInput: ["wm.Text", {caption: "Password", captionSize: "120px", layoutKind: "left-to-right", password: true}],
		loginButtonPanel: ["wm.Panel", {height: "50px", width: "100%", layoutKind: "left-to-right", border: "0", padding: "4", horizontalAlign: "right"}, {}, {
		    loginErrorMsg: ["wm.Label", {align: "center", width: "100%", height: "100%", caption: " ", border: "0", singleLine: false}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		    }],
                    loginButton: ["wm.Button", {caption: "Login", height: "100%", width: "90px"}, {onclick: "loginButtonClick"}]
		}]
	    }]

        }]
    }]
}
