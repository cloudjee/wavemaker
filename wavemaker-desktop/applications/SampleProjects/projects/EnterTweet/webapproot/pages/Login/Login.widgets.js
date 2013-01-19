Login.widgets = {
	layoutBox: ["wm.Layout", {"height":"100%"}, {}, {
		TitleBar: ["wm.Template", {"_classes":{"domNode":["wm_SilverBlueTheme_MainOutsetPanel"]},"width":"100%","height":"96px","verticalAlign":"top","horizontalAlign":"left","layoutKind":"left-to-right","padding":"8","lock":true}, {}, {
			appNameLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontSize_200percent","wm_FontColor_Blue","wm_FontSizePx_24px"]},"caption":"EnterTweet","height":"100%","width":"100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel3: ["wm.Panel", {"_classes":{"domNode":["wm_SilverBlueTheme_WhiteInsetPanel"]},"width":"222px","height":"100%","border":"1","borderColor":"steelblue"}, {}, {
				picture1: ["wm.Picture", {"height":"100%","width":"100%","source":"resources/images/nest.jpg"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"targetProperty":"source","expression":"\"resources/images/nest.jpg\""}, {}]
					}]
				}]
			}]
		}],
		loginMainPanel: ["wm.Panel", {"height":"600px","padding":"10","layoutKind":"left-to-right"}, {}, {
			spacer5: ["wm.Spacer", {"width":"100%"}, {}],
			loginInputPanel: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved4px","wm_Border_StyleSolid","wm_Border_Size1px","wm_Border_ColorLightGray"]},"width":"340px","padding":"10"}, {}, {
				usernameInput: ["wm.Editor", {"caption":"Username","height":"28px","captionSize":"80px"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				passwordInput: ["wm.Editor", {"caption":"Password","height":"28px","captionSize":"80px"}, {}, {
					editor: ["wm._TextEditor", {"password":true}, {}]
				}],
				loginButtonPanel: ["wm.Panel", {"height":"34px","padding":"4","layoutKind":"left-to-right","horizontalAlign":"right"}, {}, {
					loginButton: ["wm.Button", {"caption":"Login","width":"60px","margin":"0","border":"0"}, {"onclick":"loginButtonClick"}]
				}],
				spacer3: ["wm.Spacer", {"height":"30px"}, {}],
				loginErrorMsg: ["wm.Label", {"caption":" ","height":"50px","border":"0"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				content1: ["wm.Content", {"height":"100%","content":"about"}, {}]
			}],
			spacer4: ["wm.Spacer", {"width":"100%"}, {}]
		}]
	}]
}