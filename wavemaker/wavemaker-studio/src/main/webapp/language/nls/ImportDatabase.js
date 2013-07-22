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
WAIT_IMPORTING: "Importing Database...",
INFO_SAMPLE_ALREADY_IMPORTED: "Sample database already imported",
ALERT_CONNECTION_SUCCESS: "Connection successful",
ALERT_CONNECTION_FAILED: "Connection failed: ${error}",
ALERT_IMPORT_FAILED: "Import failed: ${error}\nSee wm.log for compiler output",
CONFIRM_MYSQL_MAC_IMPORT: "<p>When importing a MySQL database using a Macintosh, there is a known bug that occurs in setting up database relationships if your table names have any capital letters in them.</p><p>If your database table names are all lower case, you can ignore this warning.</p>  SOLUTIONS: <ul><li>Edit your database before importing it</li><li>Import your database on a different computer and then copy the project onto this computer</li></ul><p>For more info: <a target='jira' href='http://jira.wavemaker.com/browse/WM-3347'>WM-3347</a></p>Continue with import?",
CONFIRM_POSTGRES_IMPORT: "<p>When importing a Postgres database, there is a known bug that occurs when your table names have capital letters in them.</p><p>If your database table names are all lower case, you can ignore this warning.</p>  SOLUTION: <ul><li>Edit your database before importing it to remove upper case letters</li></ul><p>For more info: <a target='jira' href='http://jira.wavemaker.com/browse/WM-2068'>WM-2068</a></p>Continue with import?"
}