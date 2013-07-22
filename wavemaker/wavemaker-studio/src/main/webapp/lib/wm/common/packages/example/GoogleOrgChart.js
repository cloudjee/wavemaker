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

/*
 * GoogleOrgChart - An example Custom Widget using a third party library from
 * https://developers.google.com/chart/interactive/docs/gallery/orgchart
 */

/* This declares that the specified package has been loaded; and implies that the package
 * is located at common/packages/example/GoogleOrgChart.js
 */
dojo.provide("wm.packages.example.GoogleOrgChart");

/* This declares a new widget class called "example.GoogleOrgChart".  Do not use wm. as
 * your prefix.  It creates a subclass of wm.Control which is the most basic widget available.
 * All widgets are subclasses of wm.Control.
 */
dojo.declare("example.GoogleOrgChart", wm.Control, {

    /* The isReady flag is used to let each method know if everything is loaded, instantiated
     * and ready to access.  It is a convenience property, but not required for this class.
     */
    _isReady: false,

    /* Any time that a user provides a dataSet (wm.Variable, wm.ServiceVariable, wm.LiveVariable)
     * where different fields of the dataSet have specific meaning, you need to have a way to identify
     * which fields will mean what to the class.  The first pass at this had an idField, parentIdField,
     * and toolTipField.  However, after trying this, it became clear that using a displayExpression
     * rather than a simple field name would be needed to specify these values.  So the developer
     * will use these three fields to instruct the widget how to determine the id, parent id and tooltip.
     */
    idFieldExpr: "",
    parentIdFieldExpr: "",
    toolTipFieldExpr: "",

    /* The dataSet is a wm.Variable, wm.ServiceVariable or wm.LiveVariable. It should provide a list (isList = true).
     * Typically, this would be set via binding, though it can also be set at runtime by calling setDataSet().
     */
    dataSet: null,

    /* Set width and height to anything you want, these seemed like reasonable defaults for the data being displayed */
    width: "100%",
    height: "300px",

    /* Any time the user selects a block in the chart, we update the selectedItem.  This allows the developer
     * to bind form data, label captions, editor values, etc... to be updated with whatever the user selects
     */
    selectedItem: null,
    init: function() {
        this.inherited(arguments);
        /* Load the script: Adds a <script> tag to the header of the html document.
         * Why not just include the script tag in index.html?
         * 1. Users who import this composite may not remember to add the script tag
         *    to index.html (workaround: A design-time afterPaletteDrop event could trigger
         *    a service to update index.html for the user)
         * 2. The library should not be loaded until its actually needed.
         *    If the user has to navigate through the application to the page
         *    that uses the pubnub service, then why should they have to wait for the entire
         *    application to load before interacting with the main page?
         */

        // WM 6.6, use this line:
        wm.loadScript("https://www.google.com/jsapi",true);
        // WM 6.5, use this line:
        // wm.headAppend(wm.createElement("script", { type: "text/javascript", src: "https://www.google.com/jsapi" }));

        /* Create the selectedItem component */
        this.selectedItem = new wm.Variable({owner: this, name: "selectedItem"});
    },
    postInit: function() {
        this.inherited(arguments);
        if (!this._isReady) this.waitUntilReady();
    },

    /* Poll every 50 ms until the google libraries have successfully loaded. Probably
     * there is a better technique than this, but that technique would not work with
     * many different libraries
     */
    waitUntilReady: function() {
        if (!window["google"]) {
            wm.job("waitUntilReady", 50, this, "waitUntilReady");
            return;
        }

        /* Load google's orgchart package; when its finished loading, call this.drawChart() */
        google.load('visualization', '1', {packages:['orgchart'], callback: dojo.hitch(this, "drawChart")});
    },

    /* Generate the chart.  Most of this code is copied from
     * https://developers.google.com/chart/interactive/docs/gallery/orgchart
     */
    drawChart: function() {
        this._isReady = true;
        var data = this.dataTable = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('string', 'Manager');
        data.addColumn('string', 'ToolTip');
        if (this.dataSet && !this.dataSet.isEmpty()) {

            // Iterate over the dataSet and add items to the rows array
            var rows = [];
            this.dataSet.forEach(dojo.hitch(this, function(inItem) {
                // Evaluate the displayExpression for each item in the dataset and add a row for it.
                var idColumnValue = wm.expression.getValue(this.idFieldExpr || "", inItem,this.owner);
                var parentColumnValue = wm.expression.getValue(this.parentIdFieldExpr, inItem,this.owner);
                var toolTipColumnValue = wm.expression.getValue(this.toolTipFieldExpr, inItem,this.owner);

                rows.push([idColumnValue, parentColumnValue, toolTipColumnValue]);
            }));
            data.addRows(rows);
        } else if (this._isDesignLoaded) {
            /* Show some sample data at design time so the user knows its a chart; at runtime show nothing */
            data.addRows([
              [{v:'Mike', f:'Mike<div style="color:red; font-style:italic">President</div>'}, '', 'The President'],
              [{v:'Jim', f:'Jim<div style="color:red; font-style:italic">Vice President</div>'}, 'Mike', 'VP'],
              ['Alice', 'Mike', ''],
              ['Bob', 'Jim', 'Bob Sponge'],
              ['Carol', 'Bob', '']
            ]);
        }
        var chart = this.orgChart = new google.visualization.OrgChart(this.domNode);
        chart.draw(data, {allowHtml:true});

        /* Add a listener for the select event, and update selectedItem and call the onSelect
         * event handler when the user selects something
         */
        google.visualization.events.addListener(chart, 'select', dojo.hitch(this, function() {
            var row = chart.getSelection()[0].row;
            var selectedItem = this.dataSet.getItem(row);
            this.selectedItem.setDataSet(selectedItem);
            this.onSelect(selectedItem.getData());
        }));
      },

  /* These setters exist to store a new property value and rerender the chart.
   * It isn't required to have setters (the property would still be written)
   * but it makes the design time experience much better to display each
   * change as it is made.
   */
    setDataSet: function(inDataSet) {
        this.dataSet = inDataSet;
        if(this._isReady) {
            this.drawChart();
        }
        if(this.dataSet && this.selectedItem.type != this.dataSet.type) {
            this.selectedItem.setType(this.dataSet.type);
        }
    },
    setIdFieldExpr: function(inValue) {
        this.idFieldExpr = inValue;
        if(this._isReady) {
            this.drawChart();
        }
    },
    setParentFieldExpr: function(inValue) {
        this.parentFieldExpr = inValue;
        if(this._isReady) {
            this.drawChart();
        }
    },
    setToolTipFieldExpr: function(inValue) {
        this.toolTipFieldExpr = inValue;
        if(this._isReady) {
            this.drawChart();
        }
    },

    /* The existence of any onXXX method in the class automatically adds that to the Events
     * section of the property panel.
     */
    onSelect: function(inSelectedData) {

    },
    _end: null

});

// Add attributes to show in the WaveMaker Studio properties editor
wm.Object.extendSchema(example.GoogleOrgChart, {
    /* dataSet is readonly (means that it can only be written as a binding for a property, and not a value for a property.
     * Writing it as a property would cause an infinite recursion error trying to write:
     * chart: ["example.GoogleOrgChart", {dataSet: {name: "lvar1", data: xxx, owner: {name: "Main", components: {chart: {dataSet: ....
     *
     * wm.prop.DataSetSelect: Shows dropdown list of possible dataSets
     * editorProps: Properties for the DataSetSelect editor
     */
    dataSet: { readonly: true, group: "widgetName", subgroup: "data", order: 1, bindTarget: 1, type: "wm.Variable", isList: true, createWire: 1, editor: "wm.prop.DataSetSelect", editorProps: {listMatch: true, widgetDataSets: true, allowAllTypes: true}},

    /* Will default these properties to being edited using regular text editors.  editorProps specifies we use
     * "" instead of null if no value is specified.  Why? Because that is the default value of these fields defined
     * at the top of the class definition
     */
    idFieldExpr: {group: "widgetName", subgroup: "fields", order: 1, editorProps: {emptyValue: "emptyString"}},
    parentIdFieldExpr: {group: "widgetName", subgroup: "fields", order: 2, editorProps: {emptyValue: "emptyString"}},
    toolTipFieldExpr: {group: "widgetName", subgroup: "fields", order: 3, editorProps: {emptyValue: "emptyString"}},

    /* ignore, like readonly, means that the property is not written.  And for the same reasons.
     * ignore though also means that this property isn't shown in the property panel.
     * bindSource makes it show up as an option in the bind dialog.
     */
    selectedItem: { ignore: 1, bindSource: 1, isObject: true, simpleBindProp: true }
});

wm.registerPackage(["Example", "GoogleOrgChart", "example.GoogleOrgChart", "common.packages.example.GoogleOrgChart", "images/wm/widget.png", "", {},false,undefined]);