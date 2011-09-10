/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
 

dojo.provide("wm.studio.pages.DataRelationshipsDialog.DataRelationshipsDialog");

dojo.declare("DataRelationshipsDialog", wm.Page, {
        i18n: true,
	infoTemplate: "<div><strong>${formName}</strong> is displaying a <strong>${rootName}</strong> object. How would you like to display the <strong>${rootName}'s ${relatedName}</strong> relationship?</div><div>Note, automatic server processing is available only when a select editor is chosen.</div>",
	start: function() {
		// ug, access dialog
		this.dialog = this.owner.owner;
	},
	update: function(inDeferred, inFormName, inRootType, inRelated) {
		this.deferred = inDeferred;
		this.formName = inFormName;
		this.rootType = inRootType || "";
		this.rootName = inRootType.split('.').pop();
		// FIXME: needs to work for both getting a list of related and not.
		this.related = inRelated || [];
		this.choices = [];
		this.relatedIndex = 0;
		this.showNextChoice();
	},
	updateUi: function(inFormName, inRootName, relatedName) {
		var c = dojo.string.substitute(this.infoTemplate, {formName: inFormName, rootName: inRootName, relatedName: relatedName});
		this.infoLabel.setCaption(c);
		this.chooseRbEditor.editor.setChecked(true);
	},
	showNextChoice: function() {
		// related are in order so will process from highest level down
		var i = this.relatedIndex;
		if (this.choices[i] === undefined) {
			this.updateUi(this.formName, this.rootName, this.related[i]);
		}
	},
	processChoice: function() {
		var v = this.chooseRbEditor.getGroupValue();
		this.choices[this.relatedIndex] = v;
		// if none chosen, default to select...
		if (v != "fields") {
			var current = this.related[this.relatedIndex];
			for (var j=this.relatedIndex+1, related=this.related, r; (r=related[j]); j++) {
				if ((r.indexOf(current) == 0) && this.choices[j] === undefined) {
					this.relatedIndex = j;
					this.choices[j] = "select";
				}
			}
		}
	},
	okBtnClick: function(inSender) {
		this.processChoice();
		this.relatedIndex++;
		if (this.relatedIndex < this.related.length)
			this.showNextChoice();
		else {
			this.dialog.dismiss();
			this.deferred.callback(this.choices);
		}
	},
	cancelBtnClick: function(inSender) {
		this.dialog.dismiss();
		this.deferred.errback(true);
	},
	_end: 0
});
