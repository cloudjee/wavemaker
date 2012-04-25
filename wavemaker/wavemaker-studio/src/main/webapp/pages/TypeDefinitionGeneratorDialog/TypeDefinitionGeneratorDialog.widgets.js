TypeDefinitionGeneratorDialog.widgets = {
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","layoutKind":"top-to-bottom","verticalAlign":"top"}, {}, {
            mainPanel: ["wm.Panel", {_classes: {domNode: ["dialogcontainer"]},layoutKind: "top-to-bottom", width: "100%", height: "100%", horizontalAlign: "left", verticalAlign: "top", padding: "15", border: "10", borderColor: "#313743", backgroundColor: "#848c99"},{}, {
		largeTextArea1Panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		    typeName: ["wm.Text", {"caption":"Type Name",captionAlign: "left","dataValue":"SampleType","displayValue":"SampleType","width":"100%"}, {}],
		    label: ["wm.Label", {width: "100%", "caption":"Enter your javascript structure here"}],
		    jsonText: ["wm.LargeTextArea", {"displayValue":"{\n\t\"name\": \"Michael\", \n\t\"age\": [\n\t\t40, \n\t\t30, \n\t\t20\n\t], \n\t\"hasFoot\": true, \n\t\"friend\": {\n\t\t\"name\": \"Ed\", \n\t\t\"age\": [\n\t\t\t21, \n\t\t\t22, \n\t\t\t23\n\t\t], \n\t\t\"hasFoot\": false\n\t}\n}","height":"100%","width":"100%"}, {}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":"dojo.toJson({name: \"Michael\", \nage: [40,30,20], \nhasFoot: true, \nfriend: {\n    name: \"Ed\", \n    age: [21,22,23], \n    hasFoot: false\n    }\n},true)","targetProperty":"dataValue"}, {}]
				}]
			}]
		}]
	    }],
	    buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		generateButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, width: "100px", "caption":"Generate"}, {"onclick":"generateButtonClick"}],
		cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, width: "100px", "caption":"Close"}, {"onclick":"closeButtonClick"}]
	    }]
	}]
}