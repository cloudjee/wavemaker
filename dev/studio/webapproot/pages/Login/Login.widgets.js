/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
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
