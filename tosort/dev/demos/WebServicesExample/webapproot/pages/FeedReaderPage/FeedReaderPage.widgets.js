FeedReaderPage.widgets = {
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {
		template2: ["wm.Template", {width: "100%", height: "110px", verticalAlign: "top", horizontalAlign: "left", padding: "8", layoutKind: "left-to-right", fitToContent: true}, {}, {
			appNameLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSize_200percent", "wm_FontColor_White"]}, caption: "Feed Reader", height: "99px", width: "100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel5: ["wm.Panel", {_classes: {domNode: ["wm_SilverBlueTheme_WhiteInsetPanel"]}, width: "202px", height: "93px", fitToContent: true, borderColor: "white"}, {}, {
				picture1: ["wm.Picture", {height: "100%", width: "100%", border: "1", source: "rssfeedicons.png"}, {}]
			}]
		}],
		template1: ["wm.Template", {width: "100%", height: "100%", verticalAlign: "top", horizontalAlign: "left"}, {}, {
			bevel1: ["wm.Bevel", {_classes: {domNode: ["wm_BackgroundColor_White"]}, height: "4px", width: "100%", border: "0"}, {}],
			panel2: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right"}, {}, {
				panel3: ["wm.Panel", {_classes: {domNode: ["wm_SilverBlueTheme_LightBlueInsetPanel"]}, width: "338px", height: "100%"}, {}, {
					label1: ["wm.Label", {_classes: {domNode: ["wm_SilverBlueTheme_LightBlueOutsetPanel"]}, caption: "Enter the feed url:", height: "29px", width: "96px", padding: "10"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					editor1: ["wm.Editor", {_classes: {captionNode: ["wm_FontSizePx_12px"], domNode: ["wm_FontSizePx_12px", "wm_FontFamily_Courier"]}, caption: "url :", padding: "5", captionSize: "30px", displayValue: "http://feeds2.feedburner.com/ajaxian", height: "29px"}, {onchange: "editor1Change"}, {
						editor: ["wm._TextEditor", {changeOnEnter: true}, {}]
					}],
					spacer1: ["wm.Spacer", {height: "14px", width: "96px"}, {}],
					label2: ["wm.Label", {_classes: {domNode: ["wm_SilverBlueTheme_WhiteOutsetPanel"]}, caption: "Select a url from the list", height: "27px", width: "96px", padding: "10"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					list1: ["wm.List", {height: "100%", dataFields: "name"}, {onclick: "list1Click"}]
				}],
				splitter1: ["wm.Splitter", {width: "4px", height: "100%"}, {}],
				panel4: ["wm.Panel", {_classes: {domNode: ["wm_FontColor_Black"]}, width: "100%", height: "100%"}, {}, {
					feedList1: ["wm.FeedList", {_classes: {domNode: ["wm_FontColor_Black"]}, url: "http://feeds2.feedburner.com/ajaxian", height: "100%", expand: true, width: "100%"}, {}, {
						getFeedServiceVariable: ["wm.ServiceVariable", {service: "FeedService", operation: "getFeed"}, {}, {
							input: ["wm.ServiceInput", {type: "getFeedInputs"}, {}]
						}],
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {targetProperty: "url", source: "editor1.dataValue"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}