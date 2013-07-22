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
{
HSQLDB_DATABASE_NAME_CAPTION: "File name",
DATABASE_BOX_TITLE: "Database: ${databaseName}",
PORT_MAPPING_BOX_TITLE: "Port Mapping",
CONFIRM_DELETE_HEADER: "Are you sure you want to delete this deployment?",
SYNOPSIS_NAME: "Name:",
SYNOPSIS_TARGET: "Target:",
SYNOPSIS_TYPE: "Type:",
SYNOPSIS_HOST: "Host:",
CONFIRM_DEPLOY_HEADER: "Please confirm that you want to deploy using the following settings:",
CONFIRM_UNDEPLOY: "Are you sure you want to undeploy ${projectName} ?<br>Note: Stopping running appliations can be used to free memory for more deployments without undeploying applications.", 
WAIT_SAVE: "Saving...",
WAIT_DEPLOY: "Deploying ${deploymentName}; this may take a few minutes...",
WAIT_GENERATE: "Generating...",
TOAST_GENERATE_FAIL: "Unable to generate",
TOAST_SAVE_SUCCESS: "Deployment saved",
TOAST_SAVE_FAILED: "Error saving deployment: ${error}",
ALERT_DEPLOY_SUCCESS: "<center>Project deployed to<br/><br/><a target='_NewWindow' href='${url}'>${url}</a><br/><br/><b>Version</b>: ${version}</center>",
ALERT_FILE_DEPLOY_SUCCESS: "<center>Project files written to ${projectName}/dist.  If you need to download, use the button below.<br/><br/><b>Version</b>: ${version}",
TOAST_DEPLOY_FAILED: "Error deploying: ${error}",
WAIT_LOGGING_IN: "Logging in...",
ALERT_CF_NAME_TAKEN:  "${name} is already in use by another user; please pick a new url",
ALERT_INVALID_DB_TYPE: "Deployment of ${name} databases to Cloud Foundry is not supported",
DELETING: "Deleting...",
INVALID_USER_PASS: "The username or password was invalid",
WAIT_START: "Starting...",
WAIT_STOP: "Stopping...",
WAIT_UNDEPLOY: "Undeploying...",
ALERT_CF_OUT_OF_MEMORY: "Cloud Foundry only allows ${memory} of running applications.  Your application has been deployed, but can not be started until you stop some of your running Cloud Foundry applications",
CHECKBOX_UPDATE_SCHEMA: "Update database schemas?",
CHECKBOX_UPDATE_SCHEMA_HELP: "If checked, we will attempt to update your Cloud Foundry database schemas.  If your database is used by other applications, you may want to think carefully about whether this is safe.",
DBBOX_HSQLDB_HTML: "While you can deploy HSQLDB databases, there is no good way to update your databases when you deploy updates/fixes to your application. Each time you redeploy, all data in the old database is overwritten/lost and replaced with your current data.  We only recommend using HSQLDB to help design, develop and demo, and not to deploy finished applications",
DBBOX_CONNECTION_CAPTION: "Database Connection",
DBBOX_CONNECTION_HELPTEXT: "<ul><li>Settings: Setup the settings just as you do when importing databases</li><li>JNDI: The Java Naming and Directory Interface is a Java API for a directory service that allows Java clients to discover and lookup data and objects via a name</li></ul>",
DBBOX_TYPE_CAPTION: "Type",
DBBOX_USERNAME_CAPTION: "User name",
DBBOX_PASSWORD_CAPTION: "Password",
DBBOX_HOST_CAPTION: "Host/IP Address",
DBBOX_PORT_CAPTION: "Port",
DBBOX_NAME_CAPTION: "Database Name",
DBBOX_URL_CAPTION: "Connection URL",
DBBOX_JNDINAME_CAPTION: "JNDI Name",
DBBOX_CFTYPE_CAPTION: "Type",
DBBOX_CFNAME_CAPTION: "Database Name",
CF_DB_NODATA_WARNING: "NOTE: You can pick an existing database service in your Cloud Foundry account, or type in a new name.  If you type in a new name, WaveMaker will create the database schema in your Cloud Foundry account.  Your database will be available but empty of data.  If your using database security, this will mean nobody can login.  To copy data into your database, go to <a target='docs' href='http://dev.wavemaker.com/wiki/bin/wmdoc_6.4/Deploying#HPopulatingCloudFoundryDatabase'>Deployment Documentation</a>.",
CF_DB_NODATA_WARNING_HEIGHT: "85px"/*,
"CF_MULTIPLE_DB_WARNING": "<div class='DeploymentWarning'>WARNING: Multiple databases may not work reliably on Cloud Foundry</div>"*/
}