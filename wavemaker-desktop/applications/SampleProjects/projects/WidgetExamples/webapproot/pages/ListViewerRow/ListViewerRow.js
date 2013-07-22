/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
dojo.declare("ListViewerRow", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		this.budgetVar.beginUpdate(); // prevents the grid from rerendering for each and every change
        this.budgetVar.addItem({name: "q1", dataValue: this.variable.getValue("q1")});
        this.budgetVar.addItem({name: "q2", dataValue: this.variable.getValue("q2")});
        this.budgetVar.addItem({name: "q3", dataValue: this.variable.getValue("q3")});
        this.budgetVar.addItem({name: "q4", dataValue: this.variable.getValue("q4")});
        this.budgetVar.addItem({name: "budget", dataValue: this.variable.getValue("budget")});
        this.budgetVar.endUpdate();
        this.budgetVar.notify(); // now the grid can rerender
	},
	
	infoButtonClick: function(inSender) {
		var data = this.variable.getData();
    	app.alert("<p>We <i>Could</i> give you more information about <b>" + data.name + "</b>, but we have chosen not to.</p><p>The important thing is that we know you clicked on the button for <b>" + data.name + "</b> and not some other department</p>");
	},
	_end: 0
});