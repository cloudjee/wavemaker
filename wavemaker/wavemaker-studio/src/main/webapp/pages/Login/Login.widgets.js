/*
 * Copyright (C) 2010-2012 VMware, Inc. All rights reserved.
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
 

Login.widgets = {
	layoutBox: ["wm.Layout", {height: "100%"}, {}, {
		panel1: ["wm.Panel", {height: "100%", layoutKind: "left-to-right"}, {}, {
			panel2: ["wm.Panel", {width: "100%"}, {}],
			panel3: ["wm.Panel", {width: "891px"}, {}, {
				panel5: ["wm.Panel", {padding: "49", height: "544px"}, {}, {
					spacer1: ["wm.Spacer", {height: "80px"}, {}],
					contentpanel: ["wm.Panel", {height: "180px", layoutKind: "left-to-right"}, {}, {
						spacer7: ["wm.Spacer", {width: "30px"}, {}],
						content1: ["wm.Content", {content: "welcomeMsg", height: "100%"}, {}],
						spacer8: ["wm.Spacer", {width: "20px"}, {}]
					}],
					loginMainPanel: ["wm.Panel", {padding: "16", height: "155px", layoutKind: "left-to-right"}, {}, {
						spacer5: ["wm.Spacer", {width: "100%"}, {}],
						loginInputPanel: ["wm.Panel", {_classes: {domNode: ["wm_Border_StyleFirefoxCurved4px", "wm_Border_StyleSolid", "wm_Border_Size1px", "wm_Border_ColorLightGray"]}, pading: "10", width: "280px"}, {}, {
						    reloginLabel: ["wm.Label", {height: "28px", showing: false, caption: "Please log back in to continue working", padding: "10", width:"280px"}],
						    usernameInput: ["wm.Text", {caption: "Email", captionSize: "80px"}, {onEnterKeyPress: "loginButtonClick"}, {
							}],
						    passwordInput: ["wm.Text", {password: true, caption: "Password", captionSize: "80px"}, {onEnterKeyPress: "loginButtonClick"}, {
							}],
						    loginButtonPanel: ["wm.Panel", {height: "28px", width: "100%", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
						                loginButton: ["wm.Button", {caption: "Login", width: "52px"}, {onclick: "loginButtonClick"}],
								logoutButton: ["wm.Button", {showing: false, caption: "Logout", width: "52px"}, {onclick: "logoutButtonClick"}]
							}],
							registerLink: ["wm.Content", {_classes: {domNode: ["wm_TextAlign_Center"]}, content: "registerLink", height: "30px"}, {}],
						        pwdResetLink: ["wm.Label",   {_classes: {domNode: ["wm_TextAlign_Center"]}, caption: "Forgot My Password", height: "20px",width: "100%", link: "/StudioRegistration/?resetPassword" }, {}],
							loginErrorMsg: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Center"]}, caption: " ", height: "100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}],
						spacer4: ["wm.Spacer", {width: "100%"}, {}]
					}],
					spacer2: ["wm.Spacer", {height: "38px"}, {}]
				}]
			}],
			panel4: ["wm.Panel", {width: "100%"}, {}]
		}]
	}]
}
