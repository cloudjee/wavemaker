/*
 * Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
dojo.declare("SyntaxEditor", wm.Page, {
  start: function() {
    
  },
  update: function(inText, inSyntax) {
		if (!this.editArea.isStarted())
			this.editArea.initEdit();
		this.editArea.setText(inText);
		this.editArea.setSyntax(inSyntax);
  },
  getEditorText: function() {
		return this.editArea.getText();
  },
  closeEditor: function(inSender, e) {
		wm.dismiss(this, e);
  },
  _end: 0
});