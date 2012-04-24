/*
 * Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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
 

I18nDictionaryEditor.widgets = {
        dictionaryTermListVar: ["wm.Variable", {type: "StringData"}],
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
            mainPanel: ["wm.studio.DialogMainPanel", {},{}, {
		dictionaryListPanel: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "100px", verticalAlign: "top", horizontalAlign: "left"},{}, {
		    dictionaryItemList: ["wm.List", {width: "200px", height: "100%", border: "1", borderColor: "black", headerVisible: false},{onselect: "dictionaryItemSelect"}, {
			binding: ["wm.Binding", {}, {}, {
			    wire: ["wm.Wire", {"expression":undefined,"source":"dictionaryTermListVar","targetProperty":"dataSet"}, {}]
			}]
		    }],
		    dictionaryListButtonPanel: ["wm.Panel", {layoutKind: "top-to-bottom", width: "120px", height: "100px", verticalAlign: "top", horizontalAlign: "left"},{}, {
			addTermButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Add Term", width: "100%"}, {onclick: "addTermClick"}],
			deleteTermButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Remove Term", width: "100%"}, {onclick: "deleteTermClick"}],
			insertScriptButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Add to Script", width: "100%"}, {onclick: "insertScriptClick"}],
		    }]
		}],
		termName: ["wm.Text", {caption: "Name", width: "100%"}, {onchange: "termNameChange"},{
		    binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"dictionaryItemList.emptySelection","targetProperty":"disabled"}, {}],
			wire1: ["wm.Wire", {"expression":undefined,"source":"dictionaryItemList.selectedItem.dataValue","targetProperty":"dataValue"}, {}]
		    }]
		}],
		    instructions: ["wm.Html", {width: "100%", height: "150px", html: "Enter a word or phrase below.  You can also add parameters like<code>My name is ${myname}, your name is ${yourname}</code> which can then be called from your script using <code>this.getDictionaryItem('DictionaryTerm', {myname: 'I forgot', yourname: 'you forgot'})</code>"}],
		splitter1: ["wm.Splitter", {border:"0",layout:"top"}],
		editTermPanel: ["wm.Panel", {layoutKind: "top-to-bottom", width: "100%", height: "100%", verticalAlign: "top", horizontalAlign: "left", autoScroll: true},{}, {
		    
		}]
	    }],
		     
	    buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, height: "20px", "horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "2,0,2,0", border: "1,0,0,0", height: "34px", horizontalAlign: "right"}, {}, {
		cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel"}, {onclick: "cancelClick"}],
		saveButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Save"}, {onclick: "saveClick"}]
	    }]
	}]
}