WaitDialog.widgets = {
	lbxWait: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
		picWait: ["wm.Picture", {"height":"34px","width":"120px","source":"resources/images/logos/loadingblue.gif","aspect":"h","border":"0"}, {}],
		labWait: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"height":"50px","width":"225px","caption":"Sending data! Please wait ...","border":"0","align":"center"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}]
	}]
}