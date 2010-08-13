/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 

dojo.provide("wm.studio.pages.DataRelationshipsDialog.DataRelationshipsDialog");

dojo.declare("DataRelationshipsDialog", wm.Page, {
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
