dojo.declare("IssueCloud61", wm.Application, {
	"dialogAnimationTime": 350, 
	"disableDirtyEditorTracking": false, 
	"eventDelay": 0, 
	"i18n": false, 
	"isLoginPageEnabled": true, 
	"isSecurityEnabled": true, 
	"main": "Main", 
	"manageHistory": true, 
	"manageURL": false, 
	"name": "", 
	"phoneGapLoginPage": "Login", 
	"phoneMain": "", 
	"projectSubVersion": 5, 
	"projectVersion": 1, 
	"studioVersion": "6.5.2.Release", 
	"tabletMain": "", 
	"theme": "wm_notheme", 
	"toastPosition": "br", 
	"touchToClickDelay": 500, 
	"touchToRightClickDelay": 1500,
	"widgets": {
		commentView: ["wm.LiveView", {"dataType":"com.data.Comment","related":["rel2Issue","rel2User"],"service":"issuecloudv2","view":[{"caption":"Iid","sortable":true,"dataIndex":"rel2Issue.iid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":0},{"caption":"Uid","sortable":true,"dataIndex":"rel2User.uid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":0},{"caption":"Cid","sortable":true,"dataIndex":"cid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"widthUnits":"px"},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"widthUnits":"px"},{"caption":"Firstname","sortable":true,"dataIndex":"rel2User.firstname","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":2},{"caption":"Createdate","sortable":true,"dataIndex":"createdate","type":"java.util.Date","displayType":"Date","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"widthUnits":"px"},{"caption":"Lastname","sortable":true,"dataIndex":"rel2User.lastname","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"widthUnits":"px"},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"widthUnits":"px"},{"caption":"Summary","sortable":true,"dataIndex":"rel2Issue.summary","type":"java.lang.String","displayType":"Text","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":6}]}, {}], 
		viewSearchProject: ["wm.LiveView", {"dataType":"com.data.Project","related":["versions"],"service":"issuecloudv2","view":[{"caption":"Pid","sortable":true,"dataIndex":"pid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"widthUnits":"px"},{"caption":"Vid","sortable":true,"dataIndex":"versions.vid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":0},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"widthUnits":"px"},{"caption":"Tid","sortable":true,"dataIndex":"versions.tid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":1},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"widthUnits":"px"},{"caption":"Name","sortable":true,"dataIndex":"versions.name","type":"java.lang.String","displayType":"Text","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":2},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"widthUnits":"px"},{"caption":"Description","sortable":true,"dataIndex":"versions.description","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3},{"caption":"Url","sortable":true,"dataIndex":"url","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"widthUnits":"px"},{"caption":"Releasedate","sortable":true,"dataIndex":"versions.releasedate","type":"java.util.Date","displayType":"Date","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":4},{"caption":"Prefix","sortable":true,"dataIndex":"prefix","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"widthUnits":"px"},{"caption":"Status","sortable":true,"dataIndex":"versions.status","type":"java.lang.String","displayType":"Text","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":5},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"widthUnits":"px"},{"caption":"Flag","sortable":true,"dataIndex":"versions.flag","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":6}]}, {}], 
		svGetID: ["wm.ServiceVariable", {"operation":"getUserId","service":"securityService","startUpdate":true}, {"onSuccess":"liveReporter"}, {
			input: ["wm.ServiceInput", {"type":"getUserIdInputs"}, {}]
		}], 
		vCommentId: ["wm.Variable", {"type":"NumberData"}, {}], 
		vIssueId: ["wm.Variable", {"type":"NumberData"}, {}], 
		vPriority: ["wm.Variable", {"isList":true,"json":"[{\n\"name\":\"Minor\"\n},{\n\"name\":\"Major\"\n},{\n\"name\":\"Critical\"\n},{\n\"name\":\"Blocker\"\n}]","type":"EntryData"}, {}], 
		vStatus: ["wm.Variable", {"isList":true,"json":"[{\n\"name\":\"Open\"\n},{\n\"name\":\"In Progress\"\n},{\n\"name\":\"Closed\"\n}]","type":"EntryData"}, {}], 
		vType: ["wm.Variable", {"isList":true,"json":"[{\n\"name\":\"Bug\"\n},{\n\"name\":\"Improvement\"\n},{\n\"name\":\"New feature\"\n}]","type":"EntryData"}, {}]
	},
	_end: 0
});

IssueCloud61.extend({

	_end: 0});