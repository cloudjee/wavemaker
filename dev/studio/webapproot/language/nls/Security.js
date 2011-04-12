{
MENU_SELECT_ONE: "- Select One -",
MENU_NO_VALUE: "(no value)",
HELP_DIALOG_HEADER_USERNAME: "Username Field",
HELP_DIALOG_CONTENT_USERNAME: "Select the user name that the user will type in to log in.  Typically an email address or identifier that is based on the user's personal name.  You can find the value of the logged in user's username in your application by <ol><li>creating a new ServiceVariable</li><li>set its 'service' to 'securityService'</li><li>select the operation 'getUserName'</li></ol>",
HELP_DIALOG_HEADER_USERID: "User ID Field",
HELP_DIALOG_CONTENT_USERID: "Select the user ID that uniquely identifies the user in the database.  This is typically a number that the database has assigned to the user's entry in the database.  While you can use an email address, this tends to result in a database that bogs down badly as the size of your database goes up as this value is used by other database tables to identify the user account the data is associated with. You can  find out the ID when your project is running by <ol><li>creating a new ServiceVariable</li><li>set its 'service' to 'securityService'</li><li>select the operation 'getUserId'</li></ol>",
ERROR_DEMO_NO_USER: "At least one user needs to be added to the list!",
ERROR_DATABASE_INPUT_REQUIRED: "All required fields must be filled out!",
ERROR_LDAP_INPUT_REQUIRED: "All required fields must be filled out!",
ALERT_USERNAME_EXISTS: "Username already exists, please type in another one!",
ALERT_USER_INPUT_REQUIRED: "Username and Password fields cannot be empty!",
WAIT_TEST_SQL: "Running Query...",
WAIT_TEST_LDAP: "Testing LDAP Connection...",
TEST_LDAP_MESSAGE_SUCCESS: "Connection Successful.",
ALERT_ROLE_EXISTS: "Role already exists, please type in another one!",
ALERT_JOSSO_ONLY_ONE_ROLE: "JOSSO only allows one role.  Delete existing role before entering new one.",

ALERT_ROLE_EMPTY: "Role field cannot be empty!",
JOSSO_DETAILS: "<%--\n  ~ JOSSO: Java Open Single Sign-On\n  ~\n  ~ Copyright 2004-2009, Atricore, Inc.\n  ~\n  ~ This is free software; you can redistribute it and/or modify it\n  ~ under the terms of the GNU Lesser General Public License as\n  ~ published by the Free Software Foundation; either version 2.1 of  \n~ the License, or (at your option) any later version.  \n~  \n~ This software is distributed in the hope that it will be useful,  \n~ but WITHOUT ANY WARRANTY; without even the implied warranty of  \n~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU  \n~ Lesser General Public License for more details.  \n~  ~ You should have received a copy of the GNU Lesser General Public  \n~ License along with this software; if not, write to the Free  \n~ Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  \n~ 02110-1301 USA, or see the FSF site: http://www.fsf.org.  \n~  \n--%>\n\n<%@page contentType=\"text/html; charset=UTF-8\" language=\"java\" session=\"true\" %>\n<%\n response.sendRedirect(request.getContextPath() + \"/josso_login/\");\n%>",
DEMO_USER_USERNAME: "Username",
DEMO_USER_PASSWORD: "Password",
DEMO_USER_ROLE: "Role"
}