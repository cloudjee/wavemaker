/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
RestUrlDialog.widgets = {
    headersVar: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%"}, {}, {
	    dialog: ["wm.Panel", {border: "2", borderColor: "black", height: "100%", width: "100%", layoutKind: "top-to-bottom"}, {}, {
		mainPanel: ["wm.Panel", {border: "0", height: "100%", width: "100%", padding: "10,0", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		    spacer5: ["wm.Spacer", {height: "10px"}, {}],
		    urlPanel: ["wm.Panel", {border: "0", height: "28px", width: "100%", verticalAlign: "top", horizontalAlign: "left", layoutKind: "left-to-right"}, {}, {
			urlInput: ["wm.Text", {_classes: {captionNode: ["wm_FontColor_White"]}, caption: "URL", captionSize: "100px", width: "100%", layoutKind: "left-to-right"}],
			advancedButton: ["wm.ToggleButton", {_classes: {domNode: ["StudioButton"]},captionDown: "Hide Settings", captionUp: "More Settings", width: "150px", height: "100%", margin: "2,4,6,4"},{"onclick":"advancedBtnClick"}]
		    }],
		    SettingsPanel: ["wm.Panel", {showing: "false",width: "100%", height: "340px", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left"}, {}, {
			    binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"showing","expression":"${advancedButton.clicked}"}, {}]
			    }],
				rowTwoPanel: ["wm.Panel", {"height":"140px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			    authPanel: ["wm.Panel", {width: "250px", height: "100%", horizontalAlign: "left", verticalAlign: "top", layoutKind: "top-to-bottom"}, {}, {
				basicAuthCheckbox: ["wm.Checkbox", {caption: "HTTP Basic Auth", displayValue: "0", width: "100%", captionSize: "100px"}, {onchange: "basicAuthCheckboxChange"}],
				userIdInput: ["wm.Text", {_classes: {captionNode: ["wm_FontColor_White"]}, caption: "User Id", captionSize: "100px", width: "100%", layoutKind: "left-to-right"}],
				passwordInput: ["wm.Text", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "100px", width: "100%", border: "0", caption: "Password","password":true}]
			    }],
			    contentTypePanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left", padding: "0,0,0,10"}, {}, {
				methodInput: ["wm.SelectMenu", {options: "GET,POST", caption: "Method", captionSize: "80px", width: "200px", dataValue: "GET", layoutKind: "left-to-right"}],
				contentTypeInput: ["wm.SelectMenu", {options: "text/xml,application/x-www-form-urlencoded", caption: "Content Type", captionSize: "80px", width: "200px", dataValue: "text/xml"}, {}, {
				    binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"targetProperty":"disabled","expression":"${methodInput.dataValue} == 'GET'"}, {}]
				    }]
				}],
				requestTextArea: ["wm.LargeTextArea", {captionAlign: "right", caption: "Sample POST Data", captionSize: "80px", captionPosition: "left", width: "100%", height: "100%","emptyValue":"null"}, {}, {
				    binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"targetProperty":"disabled","expression":"${methodInput.dataValue} == 'GET'"}, {}]
				    }]
				}]
			    }]
			}],
			headersLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, caption: "Headers", height: "18px", border: "0"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],			headersGridPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					headersGrid: ["wm.DojoGrid", {"columns":[{"show":true,"field":"name","title":"Header Name","width":"100%","align":"left","formatFunc":"","fieldType":"dojox.grid.cells._Widget","constraints":null,"editorProps":null,"mobileColumn":false},{"show":true,"field":"dataValue","title":"Header Value","width":"100%","align":"left","formatFunc":"","fieldType":"dojox.grid.cells._Widget","constraints":null,"editorProps":null,"mobileColumn":false}],"deleteColumn":true,"localizationStructure":{},"margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {}, {
					binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"headersVar","targetProperty":"dataSet"}, {}]
				}]
		}],
		    addHeaderButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, "caption":"Add Header","desktopHeight":"48px","height":"48px","margin":"4"}, {"onclick":"headersGrid.addEmptyRow"}]
		}]
		}],
		    spacer61: ["wm.Spacer", {height: "10px"}, {}],
			responseAreaLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_FontColor_White"]}, caption: "Response", height: "18px", border: "0"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
		    responseTextArea: ["wm.LargeTextArea", {width: "100%", layoutKind: "left-to-right", padding: "0", height: "100%", singleLine: false, display: "TextArea"}],
		    errorMessageTextArea: ["wm.LargeTextArea", {width: "100%", layoutKind: "left-to-right", padding: "0", height: "100%", singleLine: false, display: "TextArea", showing: false}]
		}],
		footer: ["wm.Panel", {border: "0", width: "100%", height: "26px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
		    testBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Test", border: "0", margin: "4", width: "96px"}, {onclick: "testBtnClick"}],
		    spacer1: ["wm.Spacer", {width: "10px"}, {}],
		    populateBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Populate", border: "0", margin: "4", width: "96px"}, {onclick: "populateBtnClick"}],
		    spacer4: ["wm.Spacer", {width: "10px"}, {}],
		    cancelBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Back", border: "0", margin: "4", width: "96px"}, {onclick: "cancelBtnClick"}]
		}]
	    }]
	}]
}