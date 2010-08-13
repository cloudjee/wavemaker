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
dojo.provide("wm.studio.app.datautils");

isMySQL = function(inValue) {
	return inValue == MYSQL_DB_TYPE;
}

isPostgreSQL = function(inValue) {
	return inValue == POSTGRESQL_DB_TYPE;
}

isHSQLDB = function(inValue) {
	return inValue == HSQL_DB_TYPE;
}

isOracle = function(inValue) {
	return inValue == ORACLE_DB_TYPE;
}

isDB2 = function(inValue) {
	return inValue == DB2_DB_TYPE;
}

isSQLServer = function(inValue) {
	return inValue == SQL_SERVER_DB_TYPE;
}

buildInitialCxnUrl = function(dbtype, extra, inConnectionUrl, overrideFlag) {

	var rtn = "jdbc:";
    if (isHSQLDB(dbtype)) {
		if (overrideFlag == true)
			rtn += "hsqldb:file:" + extra + ";shutdown=true;"
		else
			rtn += "hsqldb:file:" + extra + ";shutdown=true;ifexists=true;"
	}
	else {
	    rtn = inConnectionUrl;
	}
	
	return rtn;
}
buildConnectionUrl = function(dbtype, host, port, extra, extra2) {

	var rtn = "jdbc:";

	if (isMySQL(dbtype)) {
		rtn += "mysql://" + host + ":" + port + "/" + extra;
	} else if (isHSQLDB(dbtype)) {
	    if (extra2 == false) {
		    rtn += "hsqldb:file:" + extra + ";shutdown=true;ifexists=true;"
		}
		else {
		    rtn += "hsqldb:file:" + extra + ";shutdown=true;"
		}
	} else if (isOracle(dbtype)) {
		rtn += "oracle:thin:@" + host + ":" + port + ":" + extra;
	} else if (isSQLServer(dbtype)) {
		rtn += "jtds:sqlserver://" + host;
		if (port) {
			rtn += ":" + port;
		}
		if (extra) {
			rtn += "/" + extra;
		}
		if (extra2) {
			rtn += ";instance=" + extra2;
		}
	} else if (isDB2(dbtype)) {
		rtn += "db2://" + host + "\:" + port + "/" + extra;
	} else if (isPostgreSQL(dbtype)) {
		rtn += "postgresql://" + host + ":" + port + "/" + extra;;
	}

	return rtn;
}

parseConnectionUrl = function(inConnectionUrl, inData) {
	if (inConnectionUrl.indexOf("jdbc:") == 0) {
		inConnectionUrl = inConnectionUrl.substring(5)
	}
	var c = inConnectionUrl.toLowerCase();
	if (c.indexOf("hsqldb") == 0) {
		return parseHSQLDBUrl(inConnectionUrl.substring(6), inData);
	} else if (c.indexOf("mysql") == 0) {
		return parseMySQLUrl(inConnectionUrl.substring(5));
	} else if (c.indexOf("oracle") == 0) {
		return parseOracleUrl(inConnectionUrl.substring(6));
	} else if (c.indexOf("db2") == 0) {
		return parseDB2Url(inConnectionUrl.substring(3));
	} else if (c.indexOf("jtds:sqlserver") == 0) {
		return parseSQLServerUrl(inConnectionUrl.substring(14));
	} else if (c.indexOf("postgresql") == 0) {
		return parsePostgreSQLUrl(inConnectionUrl.substring(10));
	} else {
		return null;
	}
}

parseHSQLDBUrl = function(inConnectionUrl, inData) {
	var c = removeConnectionUrlParams(inConnectionUrl);
	var i = c.indexOf("file:");
	var path = c.substring(i+5);
	var fileName = inData.hsqldbFile;
	return [HSQL_DB_TYPE, null, null, fileName, null];
}

parseMySQLUrl = function(inConnectionUrl) {
	var c = removeConnectionUrlParams(inConnectionUrl);
	return [MYSQL_DB_TYPE].concat(parseGenericHostPortDatabase(c)).concat(null);
}

parsePostgreSQLUrl = function(inConnectionUrl) {
	var c = removeConnectionUrlParams(inConnectionUrl);
	return [POSTGRESQL_DB_TYPE].concat(parseGenericHostPortDatabase(c)).concat(null);
}

parseOracleUrl = function(inConnectionUrl) {
	var c = removeConnectionUrlParams(inConnectionUrl);
	var i = c.indexOf("thin:@");
	if (i == -1) {
		return [ORACLE_DB_TYPE, null, null, null, null];
	}
	i += 6;
	var j = c.indexOf(":", i);
	var host = c.substring(i, j);
	j += 1;
	i = c.indexOf(":", j);
	if (i == -1) {
		i = c.length;
	}
	var port = c.substring(j, i);
	var sid = null;
	i += 1;
	if (i < c.length) {
		sid = inConnectionUrl.substring(i);
	}
	return [ORACLE_DB_TYPE, host, port, sid, null];
}

parseDB2Url = function(inConnectionUrl) {
	var c = removeConnectionUrlParams(inConnectionUrl);
	return [DB2_DB_TYPE].concat(parseGenericHostPortDatabase(c)).concat(null);
}

parseSQLServerUrl = function(inConnectionUrl) {
	var instance = null;
	var i = inConnectionUrl.indexOf("instance=");
	if (i != -1) {
		i += 9;
		var j = inConnectionUrl.indexOf(";", i);
		if (j == -1) {
			j = inConnectionUrl.length;
		}
		instance = inConnectionUrl.substring(i, j);
	}
	var c = removeConnectionUrlParams(inConnectionUrl);
	return [SQL_SERVER_DB_TYPE].concat(parseGenericHostPortDatabase(c)).concat(instance);
}

parseGenericHostPortDatabase = function(inConnectionUrl) {
	var i = inConnectionUrl.indexOf("://") + 3;
	var j = inConnectionUrl.indexOf(":", i);
	var db = null;
	var host = null;
	var port = null;
	if (j != -1) {
		host = inConnectionUrl.substring(i, j);
		i = inConnectionUrl.indexOf("/", j);
		if (i == -1) {
			i = inConnectionUrl.length;
		}
		port = inConnectionUrl.substring(j+1, i);
		i += 1
	} else {
		j = inConnectionUrl.indexOf("/", i);
		if (j == -1) {
			j = inConnectionUrl.length;
		}
		host = inConnectionUrl.substring(i, j);
		i = j + 1;
	}
	if (i < inConnectionUrl.length) {
		db = inConnectionUrl.substring(i);
	}
	return [host, port, db];
}

removeConnectionUrlParams = function(inConnectionUrl) {
	var rtn = inConnectionUrl;
	var i = inConnectionUrl.lastIndexOf("?");
	if (i != -1) {
		rtn = inConnectionUrl.substring(0, i);
	}
	i = inConnectionUrl.indexOf(";");
	if (i != -1) {
		rtn = inConnectionUrl.substring(0, i);
	}
	return rtn;
}

setupWidgetsForDatabaseType = function(
		inDBType, ip, hostLabel, hostInput, portLabel, portInput, 
		extraLabel, extraInput, extraLabel2, extraInput2, 
		tableFilterInput, schemaFilterInput,
		usernameInput, passwordInput) {

	var h = "localhost";
	var p = null;
	var e = "Database";
	var e2 = null;

	var tableFilter = DEFAULT_TABLE_FILTER;
	var schemaFilter = DEFAULT_SCHEMA_FILTER;

	var username = "";
	var password = "";

	if (isMySQL(inDBType)) {
		p = 3306;
		if (studio.isCloud()) 
		  h = "mysql.wavemaker.com";
	} else if (isHSQLDB(inDBType)) {
		h = null;
		p = null;
		e = "File: ";
		username = "sa";
	} else if (isPostgreSQL(inDBType)) {
		p = 5432;
		tableFilter = POSTGRESQL_DEFAULT_TABLE_FILTER;
		schemaFilter = POSTGRESQL_DEFAULT_SCHEMA_FILTER;
	} else if (isOracle(inDBType)) {
		h = ip;
		p = "1521";
		e = "SID:";
	} else if (isSQLServer(inDBType)) {
		p = 1433;
		e2 = "Instance:";
		schemaFilter = SQL_SERVER_DEFAULT_SCHEMA;
	} else if (isDB2(inDBType)) {
		p = 50000;
	}

	hostInput.setInputValue("");
	if (h == null) {
		hostLabel.setCaption("");
		hostInput.parent.setShowing(false);
	} else {
		hostLabel.setCaption("Host");
		hostInput.parent.setShowing(true);
		hostInput.setInputValue(h);
	}

	portInput.setInputValue("");
	if (p == null) {
		portLabel.setCaption("");
		portInput.parent.setShowing(false);
	} else {
		portLabel.setCaption("Port");
		portInput.parent.setShowing(true);
		portInput.setInputValue(p);
	}

	extraInput.setInputValue("");
	extraInput.setShowing(e != null);
	extraLabel.setShowing(e != null);
	if (e != null) {
		extraLabel.setCaption(e);
	}

	extraInput2.setInputValue("");
	extraInput2.setShowing(e2 != null);
	extraLabel2.setShowing(e2 != null);

	if (usernameInput) usernameInput.setInputValue(username);
	if (e2 != null) {
		extraLabel2.setCaption(e2);
	}

	if (tableFilter != null) {
		tableFilterInput.setInputValue(tableFilter);
	}

	if (schemaFilter != null) {
		schemaFilterInput.setInputValue(schemaFilter);
	}
}

getDataModelTypeNodes = function(dataModelTree, dataModelName) {
	return getDataModelNodes(dataModelTree, dataModelName, 0);
}

getDataModelQueryNodes = function(dataModelTree, dataModelName) {
	return getDataModelNodes(dataModelTree, dataModelName, 0);
}

getDataModelNodes = function(dataModelTree, dataModelName, nodesIndex) {
	var r = dataModelTree._data[0];
	for (var i in r.children) {
		if (r.children[i].data[1] == dataModelName) {
			return r.children[i].children[nodesIndex].children;
		}
	}
	return [];
}

getDataModelQueryNames = function(dataModelTree, dataModelName) {
	var queryNodes = getDataModelQueryNodes(dataModelTree, dataModelName);
	var rtn = [];
	for (var i in queryNodes) {
		var queryName = queryNodes[i].content;
		rtn.push(queryName);
	}
	return rtn;
}

// rtn: short name -> long name
getDataModelTypeNames = function(typeRefTree, dataModelName, valueTypes) {
	var rtn = {};
	var typeNodes = getDataModelTypeNodes(typeRefTree, dataModelName);
	for (var j = 0, node; node=typeNodes[j]; j++) {
		rtn[node.data[1]] = node.data[2];
	}
	var t = valueTypes[dataModelName];
	for (var i in t) {
		rtn[t[i]["name"]] = t[i]["fullyQualifiedName"];
	}
	return rtn;
}

getDataModelName = function(inNode) {
	var n = getDataModelNode(inNode);
	return getNodeData(n);
}

getNodeData = function(inNode) {
	return inNode&&inNode.data&&inNode.data[1];
},

getDataModelNode = function(inNode) {
	var rtn = getAnnotatedNode(inNode, DATA_MODEL_ROOT_NODE);
	return rtn;
}

getAnnotatedNode = function(inNode, inAnno) {
	if (inNode && inNode.data[0] == inAnno) {
		   return inNode;
	}
	if (inNode && inNode.parent != inNode.tree.root && 
		inNode.parent.data[0] != this.ROOT_NODE) {
		return getAnnotatedNode(inNode.parent, inAnno);
	}
}

initDBTypeDropdown = function(inDropdown) {
	var l = [HSQL_DB_TYPE, MYSQL_DB_TYPE, POSTGRESQL_DB_TYPE];
	if (studio) {
		if (studio.isModuleEnabled("jdbc-driver", "wm.oracle"))
			l.push(ORACLE_DB_TYPE);
		if (studio.isModuleEnabled("jdbc-driver", "wm.db2"))
			l.push(DB2_DB_TYPE);
		if (studio.isModuleEnabled("jdbc-driver", "wm.mssql"))
			l.push(SQL_SERVER_DB_TYPE);
	}
	l.sort();
	l = [OTHER_DB_TYPE].concat(l);
	inDropdown.editor.setOptions(l.join());
	inDropdown.setDisplayValue(DEFAULT_DB_TYPE);
}

selectFirstChildNode = function(tree) {
	var n = tree.root && tree.root.kids[0];
	if (n) {
		if (n.kids.length > 0) {
			n = n.kids[0].kids[0];
			if (n.kids.length > 0) {
				n = n.kids[0];
			}
		}
		tree.select(n);
	}
}

askSaveChanges = function() {
	return confirm('Discard unsaved changes?');
}
