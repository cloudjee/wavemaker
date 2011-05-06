/*
 * Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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
 
dojo.declare("SyntaxEditor", wm.Page, {
        i18n: true,
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