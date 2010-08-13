dojo.declare("WMAPP_FinancialServices", wm.Application, {
	main: "MainPage",
	widgets: {
		getFeedFromRadioGroup: ["wm.ServiceVariable", {service: "FeedService", operation: "getFeed"}, {}, {
			input: ["wm.Variable", {type: "getFeedInputs"}, {}]
		}], 
		xigniteuserid: ["wm.Variable", {type: "StringData"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "stringValue", expression: "username@company.com"}, {}],
				wire1: ["wm.Wire", {targetProperty: "dataValue", expression: "\"pjasek@activegrid.com\""}, {}]
			}]
		}], 
		xignitepassword: ["wm.Variable", {type: "StringData"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "stringValue", expression: "password"}, {}],
				wire1: ["wm.Wire", {targetProperty: "dataValue", expression: "\"pjasek1\""}, {}]
			}]
		}]
	}
});