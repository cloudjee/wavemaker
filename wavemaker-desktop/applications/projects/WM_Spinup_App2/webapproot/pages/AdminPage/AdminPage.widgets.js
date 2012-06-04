AdminPage.widgets = {
	svarGetKey: ["wm.ServiceVariable", {"operation":"createKey","service":"SpinUpService"}, {}, {
		input: ["wm.ServiceInput", {"type":"createKeyInputs"}, {}]
	}],
	svarUpdate: ["wm.ServiceVariable", {"operation":"checkForUpdate","service":"SpinUpService"}, {}, {
		input: ["wm.ServiceInput", {"type":"checkForUpdateInputs"}, {}]
	}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel1: ["wm.Panel", {"height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			keyGenButton: ["wm.Button", {"caption":"GenKey","margin":"4"}, {"onclick":"svarGetKey"}],
			updateButton: ["wm.Button", {"caption":"Update","margin":"4"}, {"onclick":"svarUpdate"}]
		}],
		KeyEditor: ["wm.Number", {"caption":"Key","dataValue":undefined,"displayValue":""}, {}]
	}]
}