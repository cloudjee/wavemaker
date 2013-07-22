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
dojo.declare("FormDB_Lookups", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
filmactorLiveForm1BeforeServiceCall: function(inSender, inOperation, inData) {
// MUST DO INSERT NOT UPDATE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/*
//inData.film = this.filmSelect.selectedItem.getData();
//inData.actor= this.actorSelect.selectedItem.getData();
debugger;
delete inData.film;
delete inData.actor;
delete inSender.liveVariable.data.film;
delete inSender.liveVariable.data.actor;
*/
},
_end: 0
});

FormDB_Lookups.widgets = {
employeeLiveVariable2: ["wm.LiveVariable", {"type":"com.sampledatadb.data.Employee"}, {}, {
liveView: ["wm.LiveView", {"dataType":"com.sampledatadb.data.Employee","related":["employee","department"],"view":[{"caption":"Eid","sortable":true,"dataIndex":"eid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":1000,"subType":null,"widthUnits":"px"},{"caption":"Firstname","sortable":true,"dataIndex":"firstname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1001,"subType":null,"widthUnits":"px"},{"caption":"Lastname","sortable":true,"dataIndex":"lastname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1002,"subType":null,"widthUnits":"px"},{"caption":"Street","sortable":true,"dataIndex":"street","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1003,"subType":null,"widthUnits":"px"},{"caption":"City","sortable":true,"dataIndex":"city","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1004,"subType":null,"widthUnits":"px"},{"caption":"State","sortable":true,"dataIndex":"state","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1005,"subType":null,"widthUnits":"px"},{"caption":"Zip","sortable":true,"dataIndex":"zip","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1006,"subType":null,"widthUnits":"px"},{"caption":"Birthdate","sortable":true,"dataIndex":"birthdate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1007,"subType":null,"widthUnits":"px"},{"caption":"Picurl","sortable":true,"dataIndex":"picurl","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1008,"subType":null,"widthUnits":"px"},{"caption":"Twitterid","sortable":true,"dataIndex":"twitterid","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1009,"subType":null,"widthUnits":"px"},{"caption":"Tenantid","sortable":true,"dataIndex":"tenantid","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1010,"subType":null,"widthUnits":"px"},{"caption":"Eid","sortable":true,"dataIndex":"employee.eid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":2000,"subType":null,"widthUnits":"px"},{"caption":"Firstname","sortable":true,"dataIndex":"employee.firstname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2001,"subType":null,"widthUnits":"px"},{"caption":"Lastname","sortable":true,"dataIndex":"employee.lastname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2002,"subType":null,"widthUnits":"px"},{"caption":"Street","sortable":true,"dataIndex":"employee.street","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2003,"subType":null,"widthUnits":"px"},{"caption":"City","sortable":true,"dataIndex":"employee.city","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2004,"subType":null,"widthUnits":"px"},{"caption":"State","sortable":true,"dataIndex":"employee.state","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2005,"subType":null,"widthUnits":"px"},{"caption":"Zip","sortable":true,"dataIndex":"employee.zip","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2006,"subType":null,"widthUnits":"px"},{"caption":"Birthdate","sortable":true,"dataIndex":"employee.birthdate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2007,"subType":null,"widthUnits":"px"},{"caption":"Picurl","sortable":true,"dataIndex":"employee.picurl","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2008,"subType":null,"widthUnits":"px"},{"caption":"Twitterid","sortable":true,"dataIndex":"employee.twitterid","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2009,"subType":null,"widthUnits":"px"},{"caption":"Tenantid","sortable":true,"dataIndex":"employee.tenantid","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2010,"subType":null,"widthUnits":"px"},{"caption":"Deptid","sortable":true,"dataIndex":"department.deptid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3000},{"caption":"Name","sortable":true,"dataIndex":"department.name","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3001},{"caption":"Budget","sortable":true,"dataIndex":"department.budget","type":"java.lang.Integer","displayType":"Number","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3002},{"caption":"Q1","sortable":true,"dataIndex":"department.q1","type":"java.lang.Integer","displayType":"Number","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3003},{"caption":"Q2","sortable":true,"dataIndex":"department.q2","type":"java.lang.Integer","displayType":"Number","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3004},{"caption":"Q3","sortable":true,"dataIndex":"department.q3","type":"java.lang.Integer","displayType":"Number","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3005},{"caption":"Q4","sortable":true,"dataIndex":"department.q4","type":"java.lang.Integer","displayType":"Number","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3006},{"caption":"Deptcode","sortable":true,"dataIndex":"department.deptcode","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3007},{"caption":"Location","sortable":true,"dataIndex":"department.location","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3008},{"caption":"Tenantid","sortable":true,"dataIndex":"department.tenantid","type":"java.lang.Integer","displayType":"Number","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3009}]}, {}]
}],
vacationLiveVariable1: ["wm.LiveVariable", {"type":"com.sampledatadb.data.Vacation"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"oneToManyEmployeeGrid.selectedItem","targetProperty":"filter.employee"}, {}],
wire1: ["wm.Wire", {"expression":"${oneToManyEmployeeGrid.emptySelection} ? true : undefined","targetProperty":"filter.id"}, {}]
}],
liveView: ["wm.LiveView", {"dataType":"com.sampledatadb.data.Vacation","related":["employee"],"view":[{"caption":"Id","sortable":true,"dataIndex":"id","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Startdate","sortable":true,"dataIndex":"startdate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Enddate","sortable":true,"dataIndex":"enddate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Tenantid","sortable":true,"dataIndex":"tenantid","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Eid","sortable":true,"dataIndex":"employee.eid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Firstname","sortable":true,"dataIndex":"employee.firstname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Lastname","sortable":true,"dataIndex":"employee.lastname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Street","sortable":true,"dataIndex":"employee.street","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"City","sortable":true,"dataIndex":"employee.city","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"State","sortable":true,"dataIndex":"employee.state","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Zip","sortable":true,"dataIndex":"employee.zip","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null},{"caption":"Birthdate","sortable":true,"dataIndex":"employee.birthdate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":7,"subType":null},{"caption":"Picurl","sortable":true,"dataIndex":"employee.picurl","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8,"subType":null},{"caption":"Twitterid","sortable":true,"dataIndex":"employee.twitterid","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":9,"subType":null},{"caption":"Tenantid","sortable":true,"dataIndex":"employee.tenantid","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":10,"subType":null}]}, {}]
}],
actorLiveVariable1: ["wm.LiveVariable", {"type":"com.sampledatadb.data.Actor"}, {}, {
liveView: ["wm.LiveView", {"dataType":"com.sampledatadb.data.Actor","view":[{"caption":"ActorId","sortable":true,"dataIndex":"actorId","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"FirstName","sortable":true,"dataIndex":"firstName","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"LastName","sortable":true,"dataIndex":"lastName","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null}]}, {}]
}],
filmactorLiveVariable1: ["wm.LiveVariable", {"type":"com.sampledatadb.data.FilmActor"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"actorDojoGrid.selectedItem","targetProperty":"filter.actor"}, {}]
}],
liveView: ["wm.LiveView", {"dataType":"com.sampledatadb.data.FilmActor","related":["film","id","actor"],"view":[{"caption":"Id","sortable":true,"dataIndex":"id","type":"com.sampledatadb.data.FilmActorId","displayType":"Text","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"ActorId","sortable":true,"dataIndex":"id.actorId","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"FilmId","sortable":true,"dataIndex":"id.filmId","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"FilmId","sortable":true,"dataIndex":"film.filmId","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Title","sortable":true,"dataIndex":"film.title","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Description","sortable":true,"dataIndex":"film.description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"ReleaseYear","sortable":true,"dataIndex":"film.releaseYear","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"RentalDuration","sortable":true,"dataIndex":"film.rentalDuration","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"RentalRate","sortable":true,"dataIndex":"film.rentalRate","type":"java.math.BigDecimal","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Length","sortable":true,"dataIndex":"film.length","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null},{"caption":"ReplacementCost","sortable":true,"dataIndex":"film.replacementCost","type":"java.math.BigDecimal","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":7,"subType":null},{"caption":"Rating","sortable":true,"dataIndex":"film.rating","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8,"subType":null},{"caption":"SpecialFeatures","sortable":true,"dataIndex":"film.specialFeatures","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":9,"subType":null},{"caption":"ActorId","sortable":true,"dataIndex":"actor.actorId","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"FirstName","sortable":true,"dataIndex":"actor.firstName","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"LastName","sortable":true,"dataIndex":"actor.lastName","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null}]}, {}]
}],
filmsLiveVariable: ["wm.LiveVariable", {"type":"com.sampledatadb.data.Film"}, {}, {
liveView: ["wm.LiveView", {"dataType":"com.sampledatadb.data.Film","view":[{"caption":"FilmId","sortable":true,"dataIndex":"filmId","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Title","sortable":true,"dataIndex":"title","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"ReleaseYear","sortable":true,"dataIndex":"releaseYear","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"RentalDuration","sortable":true,"dataIndex":"rentalDuration","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"RentalRate","sortable":true,"dataIndex":"rentalRate","type":"java.math.BigDecimal","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Length","sortable":true,"dataIndex":"length","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null},{"caption":"ReplacementCost","sortable":true,"dataIndex":"replacementCost","type":"java.math.BigDecimal","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":7,"subType":null},{"caption":"Rating","sortable":true,"dataIndex":"rating","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8,"subType":null},{"caption":"SpecialFeatures","sortable":true,"dataIndex":"specialFeatures","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":9,"subType":null}]}, {}]
}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel12: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minDesktopHeight":570,"minHeight":570,"verticalAlign":"top","width":"100%"}, {}, {
panel20: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label13: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"caption":"Creating DB Relationships","padding":"4","width":"166px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel13: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel15: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"verticalAlign":"top","width":"100%"}, {}, {
label12: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel16: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
tabLayers1: ["wm.TabLayers", {}, {}, {
layer1: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"One to One","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
label1: ["wm.Label", {"caption":"<b>Directions:</b> Each employee is in a single department.  Use the Department editor to set which department the selected employee is in.  This sets a foreign key in the Employee Database.  This works for Many-to-one and One-to-one relationships.","height":"54px","padding":"4","singleLine":false,"width":"100%"}, {}],
employeeLivePanel1: ["wm.LivePanel", {"horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
employeeDojoGrid: ["wm.DojoGrid", {"columns":[{"show":false,"field":"eid","title":"Eid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":true,"field":"firstname","title":"Firstname","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"lastname","title":"Lastname","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"street","title":"Street","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"city","title":"City","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"state","title":"State","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"zip","title":"Zip","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"birthdate","title":"Birthdate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"picurl","title":"Picurl","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"twitterid","title":"Twitterid","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"tenantid","title":"Tenantid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Firstname: \" + ${firstname} + \"</div>\"\n+ \"<div class='MobileRow'>Lastname: \" + ${lastname} + \"</div>\"\n","mobileColumn":true},{"show":false,"field":"department.deptid","title":"Department.deptid","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":false,"field":"department.name","title":"Department.name","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":false,"field":"department.budget","title":"Department.budget","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":false,"field":"department.q1","title":"Department.q1","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":false,"field":"department.q2","title":"Department.q2","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":false,"field":"department.q3","title":"Department.q3","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":false,"field":"department.q4","title":"Department.q4","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":false,"field":"department.deptcode","title":"Department.deptcode","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":false,"field":"department.location","title":"Department.location","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":false,"field":"department.tenantid","title":"Department.tenantid","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":false,"field":"employee.eid","title":"Employee.eid","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":false,"field":"employee.firstname","title":"Employee.firstname","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":false,"field":"employee.lastname","title":"Employee.lastname","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":false,"field":"employee.street","title":"Employee.street","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":false,"field":"employee.city","title":"Employee.city","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":false,"field":"employee.state","title":"Employee.state","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":false,"field":"employee.zip","title":"Employee.zip","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":false,"field":"employee.birthdate","title":"Employee.birthdate","width":"80px","displayType":"Date","align":"left","formatFunc":"wm_date_formatter"},{"show":false,"field":"employee.picurl","title":"Employee.picurl","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":false,"field":"employee.twitterid","title":"Employee.twitterid","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":false,"field":"employee.tenantid","title":"Employee.tenantid","width":"80px","displayType":"Number","align":"right","formatFunc":""}],"dsType":"com.sampledatadb.data.Employee","height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":60,"width":"200px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"employeeLiveVariable2","targetProperty":"dataSet"}, {}]
}]
}],
employeeLiveForm1Panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
employeeLiveForm1: ["wm.LiveForm", {"autoScroll":true,"fitToContentHeight":true,"height":"110px","horizontalAlign":"center","readonly":true,"verticalAlign":"top"}, {"onSuccess":"employeeLiveVariable2"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"employeeDojoGrid.selectedItem","targetProperty":"dataSet"}, {}]
}],
firstnameEditor1: ["wm.Text", {"caption":"Firstname","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"firstname","height":"26px","readonly":true,"width":"100%"}, {}],
lastnameEditor1: ["wm.Text", {"caption":"Lastname","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"lastname","height":"26px","readonly":true,"width":"100%"}, {}],
lookup1: ["wm.Lookup", {"allowNone":true,"caption":"Department","captionSize":"140px","dataType":"com.sampledatadb.data.Department","dataValue":undefined,"desktopHeight":"26px","displayField":"name","formField":"department","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
employeeLiveForm1EditPanel: ["wm.EditPanel", {"desktopHeight":"32px","height":"32px","isCustomized":true,"liveForm":"employeeLiveForm1","lock":false,"operationPanel":"operationPanel1","savePanel":"savePanel1"}, {}, {
savePanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
saveButton1: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"employeeLiveForm1EditPanel.saveData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"employeeLiveForm1EditPanel.formInvalid","targetProperty":"disabled"}, {}]
}]
}],
cancelButton1: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"employeeLiveForm1EditPanel.cancelEdit"}]
}],
operationPanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
newButton1: ["wm.Button", {"caption":"New","margin":"4"}, {"onclick":"employeeLiveForm1EditPanel.beginDataInsert"}],
updateButton1: ["wm.Button", {"caption":"Edit","margin":"4"}, {"onclick":"employeeLiveForm1EditPanel.beginDataUpdate"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"employeeLiveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
}]
}]
}]
}]
}],
liveForm1: ["wm.LiveForm", {"border":"1","borderColor":"#565252","fitToContentHeight":true,"height":"208px","horizontalAlign":"left","margin":"0,0,0,40","readonly":true,"verticalAlign":"top"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"lookup1.selectedItem","targetProperty":"dataSet"}, {}]
}],
label2: ["wm.Label", {"padding":"4","width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"Adding \" + ${firstnameEditor1.displayValue} + \" into the department shown below\"","targetProperty":"caption"}, {}]
}]
}],
nameEditor1: ["wm.Text", {"caption":"Name","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"name","height":"26px","readonly":true,"width":"100%"}, {}],
budgetEditor1: ["wm.Number", {"caption":"Budget","captionSize":"140px","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"budget","height":"26px","readonly":true,"width":"100%"}, {}],
q1Editor1: ["wm.Number", {"caption":"Q1","captionSize":"140px","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"q1","height":"26px","readonly":true,"width":"100%"}, {}],
q2Editor1: ["wm.Number", {"caption":"Q2","captionSize":"140px","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"q2","height":"26px","readonly":true,"width":"100%"}, {}],
q3Editor1: ["wm.Number", {"caption":"Q3","captionSize":"140px","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"q3","height":"26px","readonly":true,"width":"100%"}, {}],
q4Editor1: ["wm.Number", {"caption":"Q4","captionSize":"140px","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"q4","height":"26px","readonly":true,"width":"100%"}, {}],
deptcodeEditor1: ["wm.Text", {"caption":"Deptcode","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"deptcode","height":"26px","readonly":true,"width":"100%"}, {}]
}]
}]
}]
}],
layer2: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Add a Relationship","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
label3: ["wm.Label", {"caption":"<b>Directions:</b> <p>Each employee can have many vacations.  You can edit or add new vacations below.</p><p>This design pattern can also be used for Many-to-Many relationships</p>","height":"86px","padding":"4","singleLine":false,"width":"100%"}, {}],
oneToManyEmployeeGridPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
oneToManyEmployeeGrid: ["wm.DojoGrid", {"columns":[{"show":true,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"\"<div class='MobileRowTitle'>FirstName: \" + ${firstName} + \"</div>\"\n+ \"<div class='MobileRow'>LastName: \" + ${lastName} + \"</div>\"\n","mobileColumn":false},{"show":true,"field":"eid","title":"Eid","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":true,"field":"firstname","title":"Firstname","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"lastname","title":"Lastname","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"street","title":"Street","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"city","title":"City","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"state","title":"State","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"zip","title":"Zip","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"birthdate","title":"Birthdate","width":"80px","displayType":"Date","align":"left","formatFunc":"wm_date_formatter"},{"show":true,"field":"picurl","title":"Picurl","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"twitterid","title":"Twitterid","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"tenantid","title":"Tenantid","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":true,"field":"department.deptid","title":"Department.deptid","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":true,"field":"department.name","title":"Department.name","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"department.budget","title":"Department.budget","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":true,"field":"department.q1","title":"Department.q1","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":true,"field":"department.q2","title":"Department.q2","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":true,"field":"department.q3","title":"Department.q3","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":true,"field":"department.q4","title":"Department.q4","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":true,"field":"department.deptcode","title":"Department.deptcode","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"department.location","title":"Department.location","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"department.tenantid","title":"Department.tenantid","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":true,"field":"employee.eid","title":"Employee.eid","width":"80px","displayType":"Number","align":"right","formatFunc":""},{"show":true,"field":"employee.firstname","title":"Employee.firstname","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"employee.lastname","title":"Employee.lastname","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"employee.street","title":"Employee.street","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"employee.city","title":"Employee.city","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"employee.state","title":"Employee.state","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"employee.zip","title":"Employee.zip","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"employee.birthdate","title":"Employee.birthdate","width":"80px","displayType":"Date","align":"left","formatFunc":"wm_date_formatter"},{"show":true,"field":"employee.picurl","title":"Employee.picurl","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"employee.twitterid","title":"Employee.twitterid","width":"100%","displayType":"Text","align":"left","formatFunc":""},{"show":true,"field":"employee.tenantid","title":"Employee.tenantid","width":"80px","displayType":"Number","align":"right","formatFunc":""}],"height":"100%","margin":"4","minDesktopHeight":60,"selectFirstRow":true,"singleClickEdit":true,"width":"150px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"employeeLiveVariable2","targetProperty":"dataSet"}, {}]
}]
}],
vacationLivePanel1: ["wm.LivePanel", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
vacationGridPanel: ["wm.FancyPanel", {"minDesktopHeight":220,"minHeight":220,"title":"Vacation"}, {}, {
vacationDojoGrid: ["wm.DojoGrid", {"_classes":{"domNode":["omgDataGrid"]},"border":"0","columns":[{"show":false,"field":"id","title":"Id","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"startdate","title":"Startdate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":true,"field":"enddate","title":"Enddate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"tenantid","title":"Tenantid","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"employee.eid","title":"Eid","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"employee.firstname","title":"Firstname","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"employee.lastname","title":"Lastname","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"employee.street","title":"Street","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"employee.city","title":"City","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"employee.state","title":"State","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"employee.zip","title":"Zip","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"employee.birthdate","title":"Birthdate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"employee.picurl","title":"Picurl","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"employee.twitterid","title":"Twitterid","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"employee.tenantid","title":"Tenantid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Startdate: \" + wm.DojoGrid.prototype.dateFormatter({}, null,null,null,${startdate}) + \"</div>\"\n+ \"<div class='MobileRow'>Enddate: \" + wm.DojoGrid.prototype.dateFormatter({}, null,null,null,${enddate}) + \"</div>\"\n","mobileColumn":true}],"dsType":"com.sampledatadb.data.Vacation","height":"100%","margin":"4","minDesktopHeight":60}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"vacationLiveVariable1","targetProperty":"dataSet"}, {}]
}]
}]
}],
vacationDetailsPanel: ["wm.FancyPanel", {"fitToContentHeight":true,"height":"164px","title":"Details"}, {}, {
vacationLiveForm1: ["wm.LiveForm", {"editorWidth":"90%","fitToContentHeight":true,"height":"134px","horizontalAlign":"center","readonly":true,"verticalAlign":"top"}, {"onSuccess":"vacationLiveVariable1"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"vacationDojoGrid.selectedItem","targetProperty":"dataSet"}, {}]
}],
employeeLookup1: ["wm.Lookup", {"caption":"Employee","captionSize":"140px","dataType":"com.sampledatadb.data.Employee","dataValue":undefined,"displayExpression":"${firstname} + \" \" + ${lastname}","displayField":"city","formField":"employee","ignoreParentReadonly":true,"readonly":true,"required":true,"width":"90%"}, {}, {
binding1: ["wm.Binding", {}, {}, {
dataFieldWire: ["wm.Wire", {"source":"employeeLookup1.liveVariable","targetProperty":"dataSet"}, {}],
wire: ["wm.Wire", {"expression":undefined,"source":"oneToManyEmployeeGrid.selectedItem","targetProperty":"defaultInsert"}, {}]
}]
}],
idEditor1: ["wm.Number", {"caption":"Id","captionSize":"140px","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"id","height":"26px","readonly":true,"required":true,"width":"90%"}, {}],
startdateEditor1: ["wm.DateTime", {"caption":"Startdate","captionSize":"140px","dateMode":"Date","desktopHeight":"26px","emptyValue":"zero","formField":"startdate","height":"26px","readonly":true,"width":"90%"}, {}],
enddateEditor1: ["wm.DateTime", {"caption":"Enddate","captionSize":"140px","dateMode":"Date","desktopHeight":"26px","emptyValue":"zero","formField":"enddate","height":"26px","readonly":true,"width":"90%"}, {}],
vacationLiveForm1EditPanel: ["wm.EditPanel", {"desktopHeight":"32px","height":"32px","isCustomized":true,"liveForm":"vacationLiveForm1","lock":false,"operationPanel":"operationPanel2","savePanel":"savePanel2"}, {}, {
savePanel2: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
saveButton2: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"vacationLiveForm1EditPanel.saveData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"vacationLiveForm1EditPanel.formInvalid","targetProperty":"disabled"}, {}]
}]
}],
cancelButton2: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"vacationLiveForm1EditPanel.cancelEdit"}]
}],
operationPanel2: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
newButton2: ["wm.Button", {"caption":"New","margin":"4"}, {"onclick":"vacationLiveForm1EditPanel.beginDataInsert"}],
updateButton2: ["wm.Button", {"caption":"Edit","margin":"4"}, {"onclick":"vacationLiveForm1EditPanel.beginDataUpdate"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"vacationLiveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
}]
}]
}]
}]
}]
}]
}]
}]
}],
layer3: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Many to Many","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
html1: ["wm.Html", {"height":"136px","html":"<b>Directions:</b> Typically, a many-to-many relationship would be handled using the same techniques as as shown in the previous tabs:\n<ul>\n<li>Use an editor such as the department pulldown to select a department to add as shown in the \"One to One\" tab</li>\n<li>Use a grid + form to add, edit and delete new objects to a relationship.</li>\n</ul>\nHowever, sometimes you need a single UI that can associate two tables:\t","minDesktopHeight":15}, {}],
sampledataDBLivePanel: ["wm.LivePanel", {"horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
actorDojoGrid: ["wm.DojoGrid", {"columns":[{"show":false,"field":"actorId","title":"ActorId","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":true,"field":"firstName","title":"FirstName","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"lastName","title":"LastName","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>FirstName: \" + ${firstName} + \"</div>\"\n+ \"<div class='MobileRow'>LastName: \" + ${lastName} + \"</div>\"\n","mobileColumn":true}],"dsType":"com.sampledatadb.data.Actor","height":"100%","margin":"4","minDesktopHeight":60,"width":"200px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"actorLiveVariable1","targetProperty":"dataSet"}, {}]
}]
}],
sampledataDBLivePanel1: ["wm.LivePanel", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
filmactorGridPanel: ["wm.FancyPanel", {"minDesktopHeight":220,"minHeight":220,"title":"Select a Relationship to Delete"}, {}, {
filmactorDojoGrid: ["wm.DojoGrid", {"_classes":{"domNode":["omgDataGrid"]},"border":"0","columns":[{"show":false,"field":"id","title":"Id","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"id.actorId","title":"ActorId","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"id.filmId","title":"FilmId","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"film.filmId","title":"FilmId","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"film.title","title":"Title","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"film.description","title":"Description","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"film.releaseYear","title":"ReleaseYear","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"film.rentalDuration","title":"RentalDuration","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"film.rentalRate","title":"RentalRate","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"film.length","title":"Length","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"film.replacementCost","title":"ReplacementCost","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"film.rating","title":"Rating","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"film.specialFeatures","title":"SpecialFeatures","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"actor.actorId","title":"ActorId","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"actor.firstName","title":"FirstName","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"actor.lastName","title":"LastName","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>FilmId: \" + ${id.filmId} + \"</div>\"\n+ \"<div class='MobileRow'>Title: \" + ${film.title} + \"</div>\"\n","mobileColumn":true}],"dsType":"com.sampledatadb.data.FilmActor","height":"100%","margin":"4","minDesktopHeight":60}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"filmactorLiveVariable1","targetProperty":"dataSet"}, {}]
}]
}]
}],
filmactorDetailsPanel: ["wm.FancyPanel", {"fitToContentHeight":true,"height":"114px","title":"Details"}, {}, {
filmactorLiveForm1: ["wm.LiveForm", {"editorWidth":"90%","fitToContentHeight":true,"height":"84px","horizontalAlign":"center","readonly":true,"verticalAlign":"top"}, {"onBeforeServiceCall":"filmactorLiveForm1BeforeServiceCall","onSuccess":"filmactorLiveVariable1"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"filmactorDojoGrid.selectedItem","targetProperty":"dataSet"}, {}],
wire1: ["wm.Wire", {"expression":undefined,"source":"idRelatedEditor1.dataOutput","targetProperty":"dataOutput.id"}, {}]
}],
idRelatedEditor1: ["wm.RelatedEditor", {"changeOnKey":true,"editingMode":"editable subform","fitToContentHeight":true,"formField":"id","height":"52px","width":"373px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"filmactorDojoGrid.selectedItem.id","targetProperty":"dataSet"}, {}]
}],
actorSelect: ["wm.SelectMenu", {"caption":"Actor","captionSize":"140px","dataField":"actorId","dataType":"com.sampledatadb.data.Actor","dataValue":undefined,"desktopHeight":"26px","displayExpression":"${firstName} + \" \" + ${lastName}","displayField":"firstName","formField":"actorId","height":"26px","width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"actorLiveVariable1","targetProperty":"dataSet"}, {}]
}]
}],
filmSelect: ["wm.SelectMenu", {"caption":"Film","captionSize":"140px","dataField":"filmId","dataType":"com.sampledatadb.data.Film","dataValue":undefined,"desktopHeight":"26px","displayField":"title","formField":"filmId","height":"26px","width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"filmsLiveVariable","targetProperty":"dataSet"}, {}]
}]
}]
}],
filmactorLiveForm1EditPanel: ["wm.EditPanel", {"desktopHeight":"32px","height":"32px","liveForm":"filmactorLiveForm1","operationPanel":"operationPanel3","savePanel":"savePanel3"}, {}, {
savePanel3: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
saveButton3: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"filmactorLiveForm1EditPanel.saveData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"filmactorLiveForm1EditPanel.formInvalid","targetProperty":"disabled"}, {}]
}]
}],
cancelButton3: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"filmactorLiveForm1EditPanel.cancelEdit"}]
}],
operationPanel3: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
newButton3: ["wm.Button", {"caption":"New","margin":"4"}, {"onclick":"filmactorLiveForm1EditPanel.beginDataInsert"}],
updateButton3: ["wm.Button", {"caption":"Update","margin":"4"}, {"onclick":"filmactorLiveForm1EditPanel.beginDataUpdate"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"filmactorLiveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
}]
}],
deleteButton1: ["wm.Button", {"caption":"Delete","margin":"4"}, {"onclick":"filmactorLiveForm1EditPanel.deleteData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"filmactorLiveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
}]
}]
}]
}]
}]
}]
}]
}]
}]
}]
}]
}],
panel73: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
fancyPanel7: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel74: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html6: ["wm.Html", {"height":"100%","html":"Form widgets provide an easy way to input data into a database. Supported features include<br>\n<ul>\n<li>Automatic validation of form fields</li>\n<li>Create, Update, Delete database records from form</li>\n<li>Manage required fields and required relationships</li>\n</ul>\n<p>This example shows a form widget set to create a new employee in the database with validation of each field and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/LiveForm\" target=\"_blank\">Live Form Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=grid&amp;layer=basic\">Grid</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

FormDB_Lookups.prototype._cssText = '';
FormDB_Lookups.prototype._htmlText = '';