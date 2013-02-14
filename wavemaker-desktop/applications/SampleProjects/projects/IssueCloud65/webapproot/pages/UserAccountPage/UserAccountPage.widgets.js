UserAccountPage.widgets = {
	userLVar: ["wm.LiveVariable", {"inFlightBehavior":"executeLast","type":"com.issuecloudv3db.data.User"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"app.userIdSVar.dataValue","targetProperty":"filter.uid"}, {}]
		}],
		liveView: ["wm.LiveView", {"dataType":"com.issuecloudv3db.data.User","view":[{"caption":"Uid","sortable":true,"dataIndex":"uid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Firstname","sortable":true,"dataIndex":"firstname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Lastname","sortable":true,"dataIndex":"lastname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Username","sortable":true,"dataIndex":"username","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Password","sortable":true,"dataIndex":"password","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Email","sortable":true,"dataIndex":"email","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null},{"caption":"Createdate","sortable":true,"dataIndex":"createdate","type":"java.util.Date","displayType":"Date","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":7,"subType":null},{"caption":"Role","sortable":true,"dataIndex":"role","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":8,"subType":null},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":9,"subType":null}]}, {}]
	}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"center","verticalAlign":"middle"}, {}, {
		liveForm1: ["wm.LiveForm", {"_classes":{"domNode":["curvedpanel"]},"border":"2","captionAlign":"left","captionSize":"100px","fitToContentHeight":true,"height":"192px","horizontalAlign":"left","readonly":true,"styles":{"backgroundColor":"#ffffff"},"verticalAlign":"top","width":"400px"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"userLVar","targetProperty":"dataSet"}, {}]
			}],
			uidEditor1: ["wm.Number", {"caption":"Uid","captionAlign":"left","changeOnKey":true,"dataValue":0,"emptyValue":"zero","formField":"uid","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
			tidEditor1: ["wm.Number", {"caption":"Tid","captionAlign":"left","changeOnKey":true,"dataValue":0,"emptyValue":"zero","formField":"tid","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
			firstnameEditor1: ["wm.Text", {"caption":"Firstname","captionAlign":"left","changeOnKey":true,"dataValue":"","emptyValue":"emptyString","formField":"firstname","height":"26px","readonly":true,"width":"100%"}, {}],
			lastnameEditor1: ["wm.Text", {"caption":"Lastname","captionAlign":"left","changeOnKey":true,"dataValue":"","emptyValue":"emptyString","formField":"lastname","height":"26px","readonly":true,"width":"100%"}, {}],
			usernameEditor1: ["wm.Text", {"caption":"Username","captionAlign":"left","changeOnKey":true,"dataValue":"","emptyValue":"emptyString","formField":"username","height":"26px","ignoreParentReadonly":true,"readonly":true,"width":"100%"}, {}],
			passwordEditor1: ["wm.Text", {"caption":"Password","captionAlign":"left","changeOnKey":true,"dataValue":"","emptyValue":"emptyString","formField":"password","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
			emailEditor1: ["wm.Text", {"caption":"Email","captionAlign":"left","changeOnKey":true,"dataValue":"","emptyValue":"emptyString","formField":"email","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
			createdateEditor1: ["wm.DateTime", {"caption":"Createdate","captionAlign":"left","dateMode":"Date","emptyValue":"zero","formField":"createdate","height":"26px","ignoreParentReadonly":true,"readonly":true,"required":true,"width":"100%"}, {}],
			roleEditor1: ["wm.Text", {"caption":"Role","captionAlign":"left","changeOnKey":true,"dataValue":"","emptyValue":"emptyString","formField":"role","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
			flagEditor1: ["wm.Number", {"caption":"Flag","captionAlign":"left","changeOnKey":true,"dataValue":0,"emptyValue":"zero","formField":"flag","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
			liveForm1EditPanel: ["wm.EditPanel", {"desktopHeight":"32px","height":"32px","isCustomized":true,"liveForm":"liveForm1","lock":false,"operationPanel":"operationPanel1","savePanel":"savePanel1"}, {}, {
				savePanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
					saveButton1: ["wm.Button", {"caption":"Save","height":"100%","margin":"4"}, {"onclick":"liveForm1EditPanel.saveData"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"liveForm1EditPanel.formInvalid","targetProperty":"disabled"}, {}]
						}]
					}],
					cancelButton1: ["wm.Button", {"caption":"Cancel","height":"100%","margin":"4"}, {"onclick":"liveForm1EditPanel.cancelEdit"}]
				}],
				operationPanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					updateButton1: ["wm.Button", {"caption":"Update","height":"100%","margin":"4"}, {"onclick":"liveForm1EditPanel.beginDataUpdate"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"liveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}