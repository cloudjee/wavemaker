dojo.declare("IssuesPage", wm.Page, {
	"preferredDevice": "desktop",
    start: function() {
            
    },

    issuesGridSelect: function(inSender) {
        this.issueViewLayer.activate();		
	},
	issueListLVarSuccess: function(inSender, inDeprecated) {
		var typedata = [{name: "Bug", dataValue: 0}, 
                    {name: "New Feature", dataValue: 0},
                    {name: "Improvement", dataValue: 0}];
        var prioritydata = [{name: "Minor", dataValue: 0},
                            {name: "Major", dataValue: 0},
                            {name: "Critical", dataValue: 0},
                            {name: "Blocker", dataValue: 0}];
        inSender.forEach(function(inItem) {
           switch (inItem.getValue("issuetype")) {
               case "Bug":
                    typedata[0].dataValue++;
                    break;
                case "New Feature":
                    typedata[1].dataValue++;
                    break;
                case "Improvement":
                    typedata[2].dataValue++;
                    break;
           }
           switch (inItem.getValue("priority")) {
               case "Minor":
                    prioritydata[0].dataValue++;
                    break;
               case "Major":
                    prioritydata[1].dataValue++;
                    break;
               case "Critical":
                    prioritydata[2].dataValue++;
                    break;
               case "Blocker":
                    prioritydata[3].dataValue++;
                    break;
           }
        });
        this.issuesGraphVar.setData(typedata); 
        this.issuePriorityGraphVar.setData(prioritydata);
	},
	showCheckboxChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
		this.issuesGrid.renderDojoObj();
	},
	_end: 0
});