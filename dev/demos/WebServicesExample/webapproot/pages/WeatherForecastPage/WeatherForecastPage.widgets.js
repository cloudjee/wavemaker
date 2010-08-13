WeatherForecastPage.widgets = {
	getWeatherForecast: ["wm.ServiceVariable", {"service":"WeatherForecast","operation":"getWeatherByZipCode"}, {}, {
		input: ["wm.ServiceInput", {"type":"getWeatherByZipCodeInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"parameters.zipCode","source":"editor2.dataValue"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		template1: ["wm.Template", {"width":"100%","height":"96px","verticalAlign":"top","horizontalAlign":"left","padding":"8","layoutKind":"left-to-right"}, {}, {
			appNameLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontSize_200percent","wm_FontColor_Blue"]},"caption":"Weather Forecast","height":"74px","width":"100%","borderColor":"#F4F4F4"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel3: ["wm.Panel", {"_classes":{"domNode":["wm_SilverBlueTheme_WhiteInsetPanel"]},"width":"222px","borderColor":"steelblue","border":"1"}, {}]
		}],
		panel1: ["wm.Panel", {"width":"500px","horizontalAlign":"left","verticalAlign":"top","height":"110px"}, {}, {
			panel2: ["wm.Panel", {"width":"100%","layoutKind":"left-to-right","horizontalAlign":"left","verticalAlign":"top","height":"42px"}, {}, {
				editor2: ["wm.Editor", {"caption":"Zip Code ","displayValue":"94105","width":"314px"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				panel4: ["wm.Panel", {"width":"100%","layoutKind":"left-to-right","horizontalAlign":"left","verticalAlign":"top","height":"33px"}, {}, {
					button1: ["wm.Button", {"width":"136px","height":"27px","caption":"Get Weather Forecast"}, {"onclick":"getWeatherForecast"}]
				}]
			}],
			editor1: ["wm.Editor", {"caption":"City","width":"100%","readonly":true}, {}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"targetProperty":"dataValue","source":"getWeatherForecast.getWeatherByZipCodeResult.placeName"}, {}]
				}],
				editor: ["wm._TextEditor", {}, {}]
			}],
			editor3: ["wm.Editor", {"caption":"State ","width":"100%","readonly":true}, {}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"targetProperty":"dataValue","source":"getWeatherForecast.getWeatherByZipCodeResult.stateCode"}, {}]
				}],
				editor: ["wm._TextEditor", {}, {}]
			}]
		}],
		list1: ["wm.List", {"height":"100%","dataFields":"day,weatherImage,minTemperatureF,maxTemperatureF","columnWidths":"100px,50px,60px,60px","width":"100%"}, {"onformat":"list1Format"}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"dataSet","source":"getWeatherForecast.getWeatherByZipCodeResult.details.weatherDatas"}, {}]
			}]
		}]
	}]
}