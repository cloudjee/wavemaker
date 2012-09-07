dojo.declare("Form_Basic", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
// Initialize form
this.liveForm2.beginDataInsert();
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
_end: 0
});

Form_Basic.widgets = {
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel12: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel20: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label13: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"caption":"Form Widget","padding":"4","width":"166px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel13: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel15: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"verticalAlign":"top","width":"100%"}, {}, {
label12: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label16: ["wm.Label", {"caption":"<b>Directions:</b> enter required data until form is no longer invalid.","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel16: ["wm.Panel", {"height":"200px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel17: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
liveForm2: ["wm.LiveForm", {"captionSize":"130px","fitToContentHeight":true,"height":"136px","horizontalAlign":"left","readonly":true,"verticalAlign":"top","width":"300px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"app.empLiveVar","targetProperty":"dataSet"}, {}]
}],
eidEditor2: ["wm.Number", {"caption":"Eid","captionSize":"130px","dataValue":undefined,"desktopHeight":"26px","formField":"eid","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
firstnameEditor2: ["wm.Text", {"caption":"Firstname","captionSize":"130px","dataValue":undefined,"desktopHeight":"26px","formField":"firstname","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
lastnameEditor2: ["wm.Text", {"caption":"Lastname","captionSize":"130px","dataValue":undefined,"desktopHeight":"26px","formField":"lastname","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
streetEditor2: ["wm.Text", {"caption":"Street","captionSize":"130px","dataValue":undefined,"desktopHeight":"26px","formField":"street","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
cityEditor2: ["wm.Text", {"caption":"City","captionSize":"130px","dataValue":undefined,"desktopHeight":"26px","formField":"city","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
stateEditor2: ["wm.Text", {"caption":"State","captionSize":"130px","dataValue":undefined,"desktopHeight":"26px","formField":"state","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
birthdateEditor2: ["wm.DateTime", {"caption":"Birthdate","captionSize":"130px","dateMode":"Date","desktopHeight":"26px","formField":"birthdate","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
zipEditor2: ["wm.Text", {"caption":"Zip","captionSize":"130px","dataValue":undefined,"desktopHeight":"26px","formField":"zip","height":"26px","invalidMessage":"Must enter 5 or 9 digit zip code","promptMessage":"Enter 5 digit zip code","readonly":true,"regExp":"^(\\d{5}|\\d{5}\\-\\d{4})","required":true,"width":"100%"}, {}],
picurlEditor2: ["wm.Text", {"caption":"Picurl","captionSize":"130px","dataValue":undefined,"desktopHeight":"26px","formField":"picurl","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
twitteridEditor2: ["wm.Text", {"caption":"Twitterid","captionSize":"130px","dataValue":undefined,"desktopHeight":"26px","formField":"twitterid","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
tenantidEditor2: ["wm.Number", {"caption":"Tenantid","captionSize":"130px","dataValue":undefined,"desktopHeight":"26px","formField":"tenantid","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
liveForm2EditPanel: ["wm.EditPanel", {"desktopHeight":"32px","height":"32px","isCustomized":true,"liveForm":"liveForm2","lock":false,"operationPanel":"operationPanel2","savePanel":"savePanel2"}, {}]
}]
}],
label15: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel18: ["wm.Panel", {"height":"78px","horizontalAlign":"left","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
label14: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_BrightRed","wm_FontSizePx_16px"]},"caption":"Form is invalid!","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"liveForm2.invalid","targetProperty":"showing"}, {}]
}]
}],
label37: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_FontColor_Green"]},"caption":"Congratulations! Form is valid!","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"!${liveForm2.invalid}","source":false,"targetProperty":"showing"}, {}]
}]
}]
}]
}],
panel73: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
fancyPanel7: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel74: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html6: ["wm.Html", {"height":"100%","html":"Form widgets provide an easy way to input data into a database. Supported features include<br>\n<ul>\n<li>Automatic validation of form fields</li>\n<li>Create, Update, Delete database records from form</li>\n<li>Manage required fields and required relationships</li>\n</ul>\n<p>This example shows a form widget set to create a new employee in the database with validation of each field and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/LiveForm\" target=\"_blank\">Live Form Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=grid&amp;layer=basic\">Grid</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

Form_Basic.prototype._cssText = '';
Form_Basic.prototype._htmlText = '';