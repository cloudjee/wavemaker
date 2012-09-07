dojo.declare("Grid_Subtotals", wm.Page, {
    start: function() {
        try {

        } catch (e) {
            app.toastError(this.name + ".start() Failed: " + e.toString());
        }
    },
    // Called when startUpdate for deptTotalLiveVar completes
    deptTotalLiveVarSuccess: function() {
        try {
            // Add subtotals to grid
            this.addSubtotals();

        } catch (e) {
            app.toastError(this.name + "deptTotalLiveVarSuccess() Failed: " + e.toString());
        }
    },
    // Add row to grid with sub-totals
    // Actually adds data to live var which is then displayed in grid
    addSubtotals: function(inSender) {
        try {
            var totQ1 = 0;
            var totQ2 = 0;
            var totFirstHalf = 0;
            // getCount returns the number of rows in the live variable            
            var numRows = this.deptTotalLiveVar.getCount()

            for (i = 0; i < numRows; i++) {
                // getRow() returns a full row of data from the live var 
                var rowData = this.deptTotalLiveVar.getItem(i).data;
                // Access livar var data values based on the schema property name
                totQ1 = totQ1 + rowData["q1"];
                totQ2 = totQ2 + rowData["q2"];
            }
            totFirstHalf = totQ1 + totQ2;
            // Add row to live var
            this.deptTotalLiveVar.addItem({
                name: "Total",
                q1: totQ1,
                q2: totQ2,
                customField: totFirstHalf
            })
        } catch (e) {
            console.error('ERROR IN subtotalShow: ' + e);
        }
    },
});