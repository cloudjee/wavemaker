Main.widgets = {
	layoutBox1: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		template1: ["wm.Template", {"_classes":{"domNode":["wm_SilverBlueTheme_MainOutsetPanel"]},"width":"100%","height":"96px","verticalAlign":"top","horizontalAlign":"left","border":"1","padding":"8","layoutKind":"left-to-right","borderColor":"#ffffff"}, {}, {
			appNameLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontSize_200percent","wm_FontColor_Blue","wm_TextAlign_Center","wm_Attribution_centerRight","wm_SilverBlueTheme_LightBlueInsetPanel","wm_FontSizePx_24px","wm_TextDecoration_Bold"]},"caption":"WebService Explorer","height":"75px","width":"100%","border":"1","borderColor":"#C3CFE3"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}],
		tabLayers1: ["wm.TabLayers", {"defaultLayer":0}, {}, {
			FeedReader: ["wm.Layer", {"caption":"Feed Reader (RSS & Atom)","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
				pageContainer1: ["wm.PageContainer", {"pageName":"FeedReaderPage","border":"0"}, {}]
			}],
			layer3: ["wm.Layer", {"caption":"Gmail Reader (Atom)","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
				pageContainer3: ["wm.PageContainer", {"pageName":"GmailPage","border":"0"}, {}]
			}],
			layer4: ["wm.Layer", {"caption":"Flickr Photo Search (REST)","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
				pageContainer4: ["wm.PageContainer", {"pageName":"FlirckPage","border":"0"}, {}]
			}],
			layer5: ["wm.Layer", {"caption":"Amazon Search (REST)","horizontalAlign":"center","verticalAlign":"middle","showing":false}, {}, {
				pageContainer5: ["wm.PageContainer", {"pageName":"AmazonPage","border":"0"}, {}]
			}],
			layer2: ["wm.Layer", {"caption":"Yahoo Traffic (REST)","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				pageContainer6: ["wm.PageContainer", {"pageName":"YahooPage","border":"0"}, {}]
			}],
			layer6: ["wm.Layer", {"caption":"Weather Forecast (SOAP)","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				pageContainer7: ["wm.PageContainer", {"pageName":"WeatherForecastPage","border":"0"}, {}]
			}]
		}],
		pie: ["wm.Template", {"_classes":{"domNode":["wm_Attribution_centerRight","wm_SilverBlueTheme_ToolBar"]},"width":"100%","height":"36px","verticalAlign":"middle","horizontalAlign":"center","border":"1","borderColor":"#ffffff"}, {}, {
			footerLabel: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_Attribution_centerRight","wm_FontColor_Blue"]},"caption":"Copyright (C) 2011 WaveMaker","height":"100%","width":"100%","border":"0","borderColor":"#3976B5","padding":""}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}]
	}]
}