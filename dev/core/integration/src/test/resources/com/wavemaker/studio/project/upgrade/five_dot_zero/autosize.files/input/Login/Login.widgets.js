Login.widgets = {
	layoutBox: ["wm.Layout", {box: "v", height: "1flex"}, {}, {
		loginMainPanel: ["wm.Panel", {_classes: {domNode: [
			"wm_Padding_16px"]}, box: "h", width: "", height: "280px"}, {}, {
			spacer5: ["wm.Spacer", {height: "", width: "1flex"}, {}],
			loginInputPanel: ["wm.Panel", {_classes: {domNode: [
			"wm_Padding_10px", 
			"wm_Border_StyleFirefoxCurved4px", 
			"wm_Border_StyleSolid", 
			"wm_Border_Size1px", 
			"wm_Border_ColorLightGray"]}, box: "v", width: "280px", height: ""}, {}, {
				usernameInput: ["wm.Editor", {caption: "Username", height: "24px", captionSize: "80px"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				passwordInput: ["wm.Editor", {caption: "Password", height: "24px", captionSize: "80px"}, {}, {
					editor: ["wm._TextEditor", {password: true}, {}]
				}],
				loginButtonPanel: ["wm.Panel", {_classes: {domNode: [
			"wm_Padding_4px"]}, box: "h", width: "", height: "24px", boxPosition: "bottomRight"}, {}, {
					loginButton: ["wm.Button", {_classes: {domNode: [
			"wm_Padding_4px"]}, caption: "Login", width: "42px", autoSize: false}, {onclick: "loginButtonClick"}]
				}],
				spacer3: ["wm.Spacer", {height: "30px", width: ""}, {}],
				loginErrorMsg: ["wm.Label", {caption: " ", height: "1flex", width: ""}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			spacer4: ["wm.Spacer", {height: "", width: "1flex"}, {}]
		}]
	}]
}