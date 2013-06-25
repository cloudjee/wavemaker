/*
 *  Copyright (C) 2008-2013 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.security;

import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.security.schema.AuthenticationManager;
import com.wavemaker.tools.security.schema.Http;
import com.wavemaker.tools.security.schema.LdapServer;
import com.wavemaker.tools.security.schema.UserService;
import com.wavemaker.tools.spring.beans.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.memory.UserMap;
import org.springframework.security.core.userdetails.memory.UserMapEditor;

import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.ConstructorArg;
import com.wavemaker.tools.spring.beans.Property;
import com.wavemaker.tools.spring.beans.Ref;
import com.wavemaker.tools.spring.beans.Value;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.List;
import java.util.Map;

/**
 * @author Edward Callahan
 * @author Seung Lee
 */
public class SecuritySpringSupport {

    static final String NOTICE = "This file is managed by Studio. You can customize this file by hand, however use of Studio Security tooling might revert your customizations";

    static final String ROLE_PREFIX = "ROLE_";
    
    static final String AUTHENTICATON_MANAGER_BEAN_ID = "authenticationManager";
    
    static final String AUTHENTICATON_MANAGER_BEAN_ID_DEMO = "authenticationManagerDemo";    
    
    static final String USER_PASSWORD_AUTHENTICATION_FILTER_BEAN_ID = "WMSecAuthFilter";
    
    public static final String CONTEXT_SOURCE = "contextSource";

    public static final String AUTHENTICATON_MANAGER_BEAN_ID_CUSTOM = "authenticationManagerCustom";
    
    public static final String AUTHENTICATON_MANAGER_BEAN_ID_DB = "authenticationManagerDB";

    public static final String AUTHENTICATON_MANAGER_BEAN_ID_AD = "authenticationManagerAD";
    
    public static final String AUTHENTICATON_MANAGER_BEAN_ID_LDAP = "authenticationManagerLDAP";   
    
    public static final String AUTHENTICATON_MANAGER_BEAN_ID_LDAP_WITH_DB = "authenticationManagerLDAPwithDB";
    
    // Only used as a marker for DataSourceType
    public static final String AUTHENTICATON_MANAGER_BEAN_ID_CAS = "authenticationManagerCAS";

    public static final String WM_AUTH_ENTRY_POINT = "WMSecAuthEntryPoint";
    
    public static final String ROLE_PROVIDER_LDAP = "LDAP";
    
    public static final String ROLE_PROVIDER_DATABASE = "Database";

    public static final String IS_AUTHENTICATED_ANONYMOUSLY = "permitAll";

    public static final String IS_AUTHENTICATED_FULLY = "isAuthenticated()";   

    private static final String DEFAULT_NO_ROLES_ROLE = "DEFAULT_NO_ROLES";
    
    private static final String AUTH_PROVIDERS_PROPERTY = "providers";

    private static final String ANONYMOUS_AUTHENTICATION_PROVIDER_BEAN_ID = "anonymousAuthenticationProvider";

    private static final String AD_AUTH_PROVIDER_BEAN_ID = "adAuthProvider";

    private static final String LDAP_AUTH_PROVIDER_BEAN_ID = "ldapAuthProvider";

    private static final String IN_MEMORY_DAO_IMPL_BEAN_ID = "inMemoryDaoImpl";

    private static final String USER_MAP_PROPERTY = "userMap";

    private static final String JDBC_DAO_IMPL_BEAN_ID = "jdbcDaoImpl";

    private static final String JDBC_DAO_IMPL_BEAN_CLASSNAME = "com.wavemaker.runtime.security.EnhancedJdbcDaoImpl";

    private static final String DATA_SOURCE_PROPERTY = "dataSource";

    private static final String DEFAULT_DATA_SOURCE_BEAN_ID = "dummyDataSource";

    private static final String USERS_BY_USERNAME_QUERY_PROPERTY = "usersByUsernameQuery";

    private static final String AUTHORITIES_BY_USERNAME_QUERY_PROPERTY = "authoritiesByUsernameQuery";

    private static final String TABLE_MARKER = "table";

    private static final String UNAME_COLUMN_MARKER = "_unameColumn_";

    private static final String UID_COLUMN_MARKER = "_uidColumn_";

    private static final String PW_COLUMN_MARKER = "_pwColumn_";

    private static final String ROLE_COLUMN_MARKER = "_roleColumn_";

    private static final String SELECT_UID_COLUMN_MARKER = "SELECT " + UID_COLUMN_MARKER + ", ";

    private static final String AUTHORITIES_BY_UID_QUERY_SUFFIX = " FROM " + TABLE_MARKER + " WHERE " + UID_COLUMN_MARKER + " = ?";

    private static final String AUTHORITIES_BY_USERNAME_QUERY_SUFFIX = " FROM " + TABLE_MARKER + " WHERE " + UNAME_COLUMN_MARKER + " = ?";

    private static final String USERS_BY_USERNAME_QUERY = SELECT_UID_COLUMN_MARKER + PW_COLUMN_MARKER + ", 1, " + UNAME_COLUMN_MARKER
            + AUTHORITIES_BY_USERNAME_QUERY_SUFFIX;

    private static final String AUTHORITIES_BY_USERNAME_QUERY = SELECT_UID_COLUMN_MARKER + ROLE_COLUMN_MARKER
        + AUTHORITIES_BY_USERNAME_QUERY_SUFFIX;

    private static final String LDAP_DIR_CONTEXT_FACTORY_BEAN_ID = "initialDirContextFactory";

    private static final String LDAP_BIND_AUTHENTICATOR_CLASSNAME = "org.springframework.security.ldap.authentication.BindAuthenticator";

    private static final String LDAP_AUTHORITIES_POPULATOR_CLASSNAME = "com.wavemaker.runtime.security.LdapAuthoritiesPopulator";
    

    private static final String LDAP_MANAGER_DN_PROPERTY = "managerDn";

    private static final String LDAP_MANAGER_PASSWORD_PROPERTY = "managerPassword";

    private static final String LDAP_USERSEARCH_PROPERTY = "userSearch";

    private static final String LDAP_GROUP_SEARCHING_DISABLED = "groupSearchDisabled";

    private static final String LDAP_GROUP_ROLE_ATTRIBUTE = "groupRoleAttribute";

    private static final String LDAP_GROUP_SEARCH_FILTER = "groupSearchFilter";

    private static final String LDAP_ROLE_MODEL = "roleModel";

    private static final String LDAP_ROLE_ENTITY = "roleEntity";

    private static final String LDAP_ROLE_TABLE = "roleTable";

    private static final String LDAP_ROLE_USERNAME = "roleUsername";

    private static final String LDAP_ROLE_PROPERTY = "roleProperty";

    private static final String LDAP_ROLE_QUERY = "roleQuery";

    private static final String LDAP_ROLE_PROVIDER = "roleProvider";
    
    private static final String SECURITY_SERVICE = "securityService";

    private static final String ROLES = "roles";
    
    private static final String CONFIG_STORE_BEAN_ID = "WMSecurityConfigStore";
    
    private static final String ENFORCE_SECURITY_PROP = "enforceSecurity";
    
    private static final String ENFORCE_HTML_PROP = "enforceIndexHtml";
    
    // UserDetailsService providers.
    public static final String CAS_USERDETAILS_PROVIDER_DATABASE = "Database";
    public static final String CAS_USERDETAILS_PROVIDER_LDAP = "LDAP";
    public static final String CAS_USERDETAILS_SERVICE_DATABASE_ID = JDBC_DAO_IMPL_BEAN_ID;
    public static final String CAS_USERDETAILS_SERVICE_LDAP_ID = "casLdapUserDetailsService";

    // SpringConfig references.
    public static final String CAS_AUTH_ENTRY_POINT = "casEntryPoint";
    public static final String CAS_PROPERTY_PLACEHOLDER_CONFIGURER_ID = "casPropertyPlaceholderConfigurer";
    public static final String CAS_REQUEST_SINGLE_LOGOUT_FILTER = "casRequestSingleLogoutFilter";
    public static final String CAS_SINGLE_SIGN_OUT_FILTER = "casSingleSignOutFilter";
    public static final String CAS_AUTHENTICATION_FILTER = "casAuthenticationFilter";

    private static List<String> getSecurityResourceAttrs(Beans beans, String url) {
        Map<String, List<String>> urlMap = getSecurityInterceptUrls(beans);
        return urlMap.get(url);
    }

    static Map<String, List<String>> getSecurityInterceptUrls(Beans beans) {
        Map<String, List<String>> urlMap = new LinkedHashMap<String, List<String>>();
        List<Http.InterceptUrl> urls = SecurityXmlSupport.getInterceptUrls(beans);
        for (Http.InterceptUrl url : urls) {
            String key = url.getPattern();
            List<String> authzList = new ArrayList<String>();
            String accessStr = url.getAccess();
            if (StringUtils.hasText(accessStr)) {
                String[] accessArr = accessStr.split(",");
                for (String access : accessArr) {
                    authzList.add(access);
                }
            }

            urlMap.put(key, authzList);
        }
        return urlMap;
    }

    static String getRequiresChannel(Beans beans) {
        List<Http.InterceptUrl> urls = SecurityXmlSupport.getInterceptUrls(beans);
        for (Http.InterceptUrl url : urls) {
            String key = url.getPattern();
            if (key.equals("/**/*")) {
                return url.getRequiresChannel();
            }
        }
        return null;
    }

    static public void setRequiresChannel(Beans beans, String requiresChannel) {
        List<Http.InterceptUrl> urls = SecurityXmlSupport.getInterceptUrls(beans);
        for (Http.InterceptUrl url : urls) {
            String key = url.getPattern();
            if (key.equals("/**/*")) {
                url.setRequiresChannel(requiresChannel);
                return;
            }
        }

        Http.InterceptUrl newUrl = new Http.InterceptUrl();
        newUrl.setPattern("/**/*");
        newUrl.setRequiresChannel(requiresChannel);
        urls.add(newUrl);
        SecurityXmlSupport.setInterceptUrls(beans, urls);
    }


    static boolean getIndexHtmlEnforced(Beans beans) {
    	Bean confBean = beans.getBeanById(CONFIG_STORE_BEAN_ID);
    	String stringValue = getPropertyValueString(confBean, ENFORCE_HTML_PROP);
    	if(stringValue == null){
    		return false;
    	}
    	Boolean retBool = new Boolean(stringValue);
        return retBool.booleanValue();
    }

    static void setIndexHtmlEnforced(Beans beans, boolean isEnforced) {
    	Bean confBean = beans.getBeanById(CONFIG_STORE_BEAN_ID);
    	String newValue = new Boolean(isEnforced).toString();
    	setPropertyValueString(confBean, ENFORCE_HTML_PROP, newValue);
    }

    public static void setSecurityEnforced(Beans beans, boolean isEnforced) {
    	Bean confBean = beans.getBeanById(CONFIG_STORE_BEAN_ID);
    	String newValue = new Boolean(isEnforced).toString();
    	setPropertyValueString(confBean, ENFORCE_SECURITY_PROP, newValue);
    }
    
    static boolean getSecurityEnforced(Beans beans) {
    	Bean confBean = beans.getBeanById(CONFIG_STORE_BEAN_ID);
    	String stringValue = getPropertyValueString(confBean, ENFORCE_SECURITY_PROP);
    	if (stringValue == null){
    		return false;
    	}
    	Boolean retBool = new Boolean(stringValue);
        return retBool.booleanValue();
    }

    public static void setSecurityInterceptUrls(Beans beans, Map<String, List<String>> urlMap) {
        for (String url : urlMap.keySet()) {
            String access = "";
            Http.InterceptUrl iurl = new Http.InterceptUrl();
            List<String> authzList = urlMap.get(url);
            if (authzList.size() > 0) {
                access = authzList.get(0);
                for (int i = 1; i < authzList.size(); i++) {
                    access = access + ",";
                    access = access + authzList.get(i);
                }
                iurl.setPattern(url);
                iurl.setAccess(access);
                SecurityXmlSupport.setInterceptUrl(beans, iurl);
            }
        }
    }

    public static void setSecurityResources(Beans beans, boolean enforceSecurity, boolean enforceIndexHtml) {
        SecuritySpringSupport.setSecurityEnforced(beans,enforceSecurity);
        SecuritySpringSupport.setIndexHtmlEnforced(beans, enforceIndexHtml);
        if (enforceSecurity) {
            String indexHtmlAuthz = null;
            if (enforceIndexHtml) {
                indexHtmlAuthz = IS_AUTHENTICATED_FULLY;
            } else {
                indexHtmlAuthz = IS_AUTHENTICATED_ANONYMOUSLY;
            }
            List<Http.InterceptUrl> urls = new ArrayList<Http.InterceptUrl>();

            Http.InterceptUrl url = new Http.InterceptUrl();
            url.setPattern("/index.html");
            url.setAccess(indexHtmlAuthz);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/");
            url.setAccess(indexHtmlAuthz);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/pages/login/**");
            url.setAccess(IS_AUTHENTICATED_ANONYMOUSLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/securityservice.json");
            url.setAccess(IS_AUTHENTICATED_ANONYMOUSLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/*.download");
            url.setAccess(IS_AUTHENTICATED_FULLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/*.upload");
            url.setAccess(IS_AUTHENTICATED_FULLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/pages/**");
            url.setAccess(indexHtmlAuthz);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/*.json");
            url.setAccess(IS_AUTHENTICATED_FULLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/*/*.json");
            url.setAccess(IS_AUTHENTICATED_FULLY);
            urls.add(url);

            SecurityXmlSupport.setInterceptUrls(beans, urls);
        }
        else{
            List<Http.InterceptUrl> urls = new ArrayList<Http.InterceptUrl>();

            Http.InterceptUrl url = new Http.InterceptUrl();
            url.setPattern("/index.html");
            url.setAccess(IS_AUTHENTICATED_ANONYMOUSLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/");
            url.setAccess(IS_AUTHENTICATED_ANONYMOUSLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/pages/login/**");
            url.setAccess(IS_AUTHENTICATED_ANONYMOUSLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/securityservice.json");
            url.setAccess(IS_AUTHENTICATED_ANONYMOUSLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/*.download");
            url.setAccess(IS_AUTHENTICATED_ANONYMOUSLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/*.upload");
            url.setAccess(IS_AUTHENTICATED_ANONYMOUSLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/pages/**");
            url.setAccess(IS_AUTHENTICATED_ANONYMOUSLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/*.json");
            url.setAccess(IS_AUTHENTICATED_ANONYMOUSLY);
            urls.add(url);

            url = new Http.InterceptUrl();
            url.setPattern("/*/*.json");
            url.setAccess(IS_AUTHENTICATED_ANONYMOUSLY);
            urls.add(url);

            SecurityXmlSupport.setInterceptUrls(beans, urls);
        }
    }

    static void setAuthManagerProviderBeanId(Beans beans, String beanId) {
        Bean bean = beans.getBeanById(AUTHENTICATON_MANAGER_BEAN_ID);
        Property property = bean.getProperty(AUTH_PROVIDERS_PROPERTY);
        com.wavemaker.tools.spring.beans.List list = new com.wavemaker.tools.spring.beans.List();
        List<Object> refElements = new ArrayList<Object>();
        Ref ref = new Ref();
        ref.setBean(beanId);
        refElements.add(ref);

        // always add the Anonymous provider
        Ref anonyRef = new Ref();
        anonyRef.setBean(ANONYMOUS_AUTHENTICATION_PROVIDER_BEAN_ID);
        refElements.add(anonyRef);

        list.setRefElement(refElements);
        property.setList(list);
    }

    static String getDataSourceType(Beans beans) {
        Bean userPasswordAuthFilter = beans.getBeanById(USER_PASSWORD_AUTHENTICATION_FILTER_BEAN_ID);
        Property property = userPasswordAuthFilter.getProperty(AUTHENTICATON_MANAGER_BEAN_ID);
        String beanId = property.getRef();
        if (beanId.equals(AUTHENTICATON_MANAGER_BEAN_ID_DEMO)) {
            return GeneralOptions.DEMO_TYPE;
        } else if (beanId.equals(AUTHENTICATON_MANAGER_BEAN_ID_DB)) {
            return GeneralOptions.DATABASE_TYPE;
        } else if (beanId.equals(AUTHENTICATON_MANAGER_BEAN_ID_LDAP) || beanId.equals(AUTHENTICATON_MANAGER_BEAN_ID_LDAP_WITH_DB)) {
            return GeneralOptions.LDAP_TYPE;
        } else if (beanId.equals(AUTHENTICATON_MANAGER_BEAN_ID_AD)){
        	return GeneralOptions.AD_TYPE;
        } else if (beanId.equals(AUTHENTICATON_MANAGER_BEAN_ID_CAS)) {
            return GeneralOptions.CAS_TYPE;
        } else {
            throw new ConfigurationException("Unable to get data source type!");
        }
    }

    public static void setDataSourceType(Beans beans, String authMgrName) {
        Bean userPasswordAuthFilter = beans.getBeanById(USER_PASSWORD_AUTHENTICATION_FILTER_BEAN_ID);
        Property property = userPasswordAuthFilter.getProperty(AUTHENTICATON_MANAGER_BEAN_ID);
        property.setRef(authMgrName);
    }

    @Deprecated
    static List<DemoUser> getDemoUsers(Beans beans) {
        Bean bean = beans.getBeanById(IN_MEMORY_DAO_IMPL_BEAN_ID);
        Property property = bean.getProperty(USER_MAP_PROPERTY);
        Value valueElement = property.getValueElement();
        List<String> content = valueElement.getContent();
        List<DemoUser> demoUsers = new ArrayList<DemoUser>();
        if (content.size() == 1) {
            String value = content.get(0);
            value = value.trim();

            // user the property editor to parse the string value
            UserMapEditor e = new UserMapEditor();
            e.setAsText(value);
            UserMap userMap = (UserMap) e.getValue();

            String[] userStringArray = value.split("\n");
            for (String userString : userStringArray) {
                userString = userString.trim();
                int i = userString.indexOf('=');
                if (i > 0) {
                    String userid = userString.substring(0, i);
                    UserDetails user = userMap.getUser(userid);
                    DemoUser demoUser = new DemoUser();
                    demoUser.setUserid(userid);
                    demoUser.setPassword(user.getPassword());//TODO:This is empty
                    Collection<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
                    //GrantedAuthority[] authorities = user.getAuthorities();
                    List<String> userRoles = new ArrayList<String>();
                    for (GrantedAuthority authority : authorities) {
                        String role = authority.getAuthority();
                        if (role.startsWith(ROLE_PREFIX)) {
                            String realRole = role.substring(ROLE_PREFIX.length());
                            if (!realRole.equals(DEFAULT_NO_ROLES_ROLE)) {
                                userRoles.add(realRole);
                            }
                        } else {
                            SecurityToolsManager.logger.warn("Skipping Role " + role + ". It should be prefixed with " + ROLE_PREFIX
                                + ". This is probably an error !");
                        }
                    }
                    demoUser.setRoles(userRoles);
                    demoUsers.add(demoUser);
                }
            }
        }
        return demoUsers;
    }

    static void setDemoUsers(Beans beans, DemoUser[] demoUsers) {	
    	SecurityXmlSupport.setUserSvcUsers(beans, demoUsersToUsers(demoUsers));
    }
    

    static public List<UserService.User> demoUsersToUsers(DemoUser[] demoUsers){
    	List<UserService.User> usersList = new ArrayList<UserService.User>();
    	for(DemoUser u : demoUsers){
    		UserService.User user = new UserService.User();
    		String roles = new String();
    		List<String> userRoles = u.getRoles();
    		if(userRoles.isEmpty()){
    			roles = "";
    		}
    		else if(userRoles.size() == 1){
    			roles = ROLE_PREFIX + userRoles.get(0);
    		}
    		else{
    			for(String r : u.getRoles() ){
    				roles = ROLE_PREFIX + r + ",";
    			}
    		}
    		user.setName(u.getUserid());
    		user.setPassword(u.getPassword());
    		user.setAuthorities(roles);
    		usersList.add(user);
    	}
    	return usersList;
    }
	
    static DatabaseOptions constructDatabaseOptions(Beans beans) {
        DatabaseOptions options = new DatabaseOptions();
        Bean jdbcDaoBean = beans.getBeanById(JDBC_DAO_IMPL_BEAN_ID);

        Property property = jdbcDaoBean.getProperty(DATA_SOURCE_PROPERTY);
        String dataSourceBeanId = property.getRefElement().getBean();
        String modelName = dataSourceBeanId.substring(0, dataSourceBeanId.indexOf("DataSource"));
        options.setModelName(modelName);

        String value = getPropertyValueString(jdbcDaoBean, USERS_BY_USERNAME_QUERY_PROPERTY);
        value = value.substring(7).trim();
        String unameColumnName = value.substring(value.indexOf("WHERE") + 6, value.indexOf("= ?")).trim();
        String uidColumnName = value.substring(0, value.indexOf(','));
        String pwColumnName = value.substring(uidColumnName.length() + 1, value.lastIndexOf(',')).trim();
        String tableNameWithPrefix = value.substring(value.indexOf("FROM") + 4, value.indexOf("WHERE")).trim();
        String tableName = null;
        int tableNameIndex = tableNameWithPrefix.indexOf('.');
        if (tableNameIndex > -1) {
            tableName = tableNameWithPrefix.substring(tableNameIndex + 1);
        } else {
            tableName = tableNameWithPrefix;
        }
        options.setTableName(tableName);
        options.setUnameColumnName(unameColumnName);
        options.setUidColumnName(uidColumnName);
        options.setPwColumnName(pwColumnName);

        value = getPropertyValueString(jdbcDaoBean, AUTHORITIES_BY_USERNAME_QUERY_PROPERTY);
        options.setRolesByUsernameQuery(value);
        String authQueryPrefix = SELECT_UID_COLUMN_MARKER.replaceAll(UID_COLUMN_MARKER, uidColumnName);
        String authQuerySuffix = AUTHORITIES_BY_UID_QUERY_SUFFIX.replaceAll(TABLE_MARKER, tableNameWithPrefix);
        authQuerySuffix = authQuerySuffix.replaceAll(UID_COLUMN_MARKER, uidColumnName);
        if (value.indexOf(authQueryPrefix) != -1 && value.indexOf(authQuerySuffix) != -1) {
            // the query most likely not a custom query
            String roleColumnName = value.substring(value.indexOf(',') + 1, value.indexOf("FROM")).trim();
            options.setUseRolesQuery(false);
            if (!roleColumnName.equals("'" + DEFAULT_NO_ROLES_ROLE + "'")) {
                options.setRoleColumnName(roleColumnName);
            }
        } else {
            options.setUseRolesQuery(true);
        }

        return options;
    }

    static void updateJdbcDaoImpl(Beans beans, String modelName, String tableName, String unameColumnName, String uidColumnName,
        String uidColumnSqlType, String pwColumnName, String roleColumnName, String rolesByUsernameQuery) {
        Bean jdbcDaoBean = beans.getBeanById(JDBC_DAO_IMPL_BEAN_ID);
        String clazz = jdbcDaoBean.getClazz();
        if (clazz == null || !clazz.equals(JDBC_DAO_IMPL_BEAN_CLASSNAME)) {
            jdbcDaoBean.setClazz(JDBC_DAO_IMPL_BEAN_CLASSNAME);
        }
        Property property = jdbcDaoBean.getProperty(DATA_SOURCE_PROPERTY);
        if (property == null) {
            property = new Property();
            property.setName(DATA_SOURCE_PROPERTY);
        }
        Ref ref = new Ref();
        // TODO: should get this from DataService
        ref.setBean(modelName + "DataSource");
        property.setRefElement(ref);

        setPropertyValueString(jdbcDaoBean, USERS_BY_USERNAME_QUERY_PROPERTY,
            buildUsersByUsernameQuery(tableName, unameColumnName, uidColumnName, pwColumnName));

        if (rolesByUsernameQuery != null && rolesByUsernameQuery.length() != 0) {
            setPropertyValueString(jdbcDaoBean, AUTHORITIES_BY_USERNAME_QUERY_PROPERTY, rolesByUsernameQuery);
        } else {
            setPropertyValueString(jdbcDaoBean, AUTHORITIES_BY_USERNAME_QUERY_PROPERTY,
                buildAuthoritiesByUsernameQuery(tableName, unameColumnName, uidColumnName, roleColumnName));
        }
    }

    static public void resetJdbcDaoImpl(Beans beans) {
        Bean jdbcDaoBean = beans.getBeanById(JDBC_DAO_IMPL_BEAN_ID);
        Property property = jdbcDaoBean.getProperty(DATA_SOURCE_PROPERTY);
        if (property == null) {
            property = new Property();
            property.setName(DATA_SOURCE_PROPERTY);
        }
        Ref ref = new Ref();
        ref.setBean(DEFAULT_DATA_SOURCE_BEAN_ID);
        property.setRefElement(ref);
    }

    private static String buildUsersByUsernameQuery(String tableName, String unameColumnName, String uidColumnName, String pwColumnName) {
        String queryString = USERS_BY_USERNAME_QUERY;
        queryString = queryString.replaceAll(TABLE_MARKER, tableName);
        queryString = queryString.replaceAll(UNAME_COLUMN_MARKER, unameColumnName);
        queryString = queryString.replaceAll(UID_COLUMN_MARKER, uidColumnName);
        queryString = queryString.replaceAll(PW_COLUMN_MARKER, pwColumnName);
        return queryString;
    }

    private static String buildAuthoritiesByUsernameQuery(String tableName, String unameColumnName, String uidColumnName, String roleColumnName) {
        String queryString = AUTHORITIES_BY_USERNAME_QUERY;
        queryString = queryString.replaceAll(TABLE_MARKER, tableName);
        queryString = queryString.replaceAll(UID_COLUMN_MARKER, uidColumnName);
        if (roleColumnName == null || roleColumnName.length() == 0) {
            roleColumnName = "'" + DEFAULT_NO_ROLES_ROLE + "'";
        }
        queryString = queryString.replaceAll(ROLE_COLUMN_MARKER, roleColumnName);
        queryString = queryString.replaceAll(UNAME_COLUMN_MARKER, unameColumnName);
        return queryString;
    }

    public static LDAPOptions constructAdOptions(Beans beans) {
    	LDAPOptions options = new LDAPOptions();
    	Bean adAuthBean = beans.getBeanById(AD_AUTH_PROVIDER_BEAN_ID);
    	String domain = adAuthBean.getConstructorArgs().get(0).getValue();
    	options.setDomain(domain);
    	String url = adAuthBean.getConstructorArgs().get(1).getValue();
    	options.setUrl(url);
    	return options;
    }

	/**
     * Returns the current LDAP configuration in the form of a LDAPOptions Structure
     * @param beans
     * @return
     */
    static LDAPOptions constructLDAPOptions(Beans beans) {
    	LDAPOptions options = new LDAPOptions();
    	String activeAuthManAlias = SecurityXmlSupport.getActiveAuthManAlias(beans);
    	if(activeAuthManAlias.equals(AUTHENTICATON_MANAGER_BEAN_ID_LDAP)){
    		return getLdapConfig(beans, options);
    	}
    	else if(activeAuthManAlias.equals(AUTHENTICATON_MANAGER_BEAN_ID_LDAP_WITH_DB)){
    		Bean ldapDirContextBean = beans.getBeanById(CONTEXT_SOURCE);

    		ConstructorArg arg = ldapDirContextBean.getConstructorArgs().get(0);
    		String ldapUrl = arg.getValue();
    		options.setUrl(ldapUrl);

    		Bean ldapAuthProviderBean = beans.getBeanById(LDAP_AUTH_PROVIDER_BEAN_ID);
    		List<ConstructorArg> constructorArgs = ldapAuthProviderBean.getConstructorArgs();
    		for (ConstructorArg constructorArg : constructorArgs) {
    			if (constructorArg.getBean().getClazz().equals(LDAP_BIND_AUTHENTICATOR_CLASSNAME)) {
    				Bean bindAuthBean = constructorArg.getBean();

    				Property userSearchProperty = bindAuthBean.getProperty(LDAP_USERSEARCH_PROPERTY);
    				Bean userSearchBean = userSearchProperty.getBean();
    				List<ConstructorArg> userSearchCtorArgs = userSearchBean.getConstructorArgs();
    				String userSearchFilter = userSearchCtorArgs.get(1).getValue();
    				if(userSearchFilter.startsWith("(")){
    					userSearchFilter = userSearchFilter.substring(1, userSearchFilter.length()-1);
    				}    
    				options.setUserDnPattern(userSearchFilter);
    			} else if (constructorArg.getBean().getClazz().equals(LDAP_AUTHORITIES_POPULATOR_CLASSNAME)) {
    				Bean authzBean = constructorArg.getBean();
    				boolean isGroupSearchDisabled = Boolean.parseBoolean(getPropertyValueString(authzBean, LDAP_GROUP_SEARCHING_DISABLED));
    				options.setGroupSearchDisabled(isGroupSearchDisabled);
    				if (!isGroupSearchDisabled) {
    					List<ConstructorArg> authzArgs = authzBean.getConstructorArgs();
    					if (authzArgs.size() > 1) {
    						Value valueElement = authzArgs.get(1).getValueElement();
    						if (valueElement != null && valueElement.getContent() != null && !valueElement.getContent().isEmpty()) {
    							String groupSearchBase = valueElement.getContent().get(0);
    							options.setGroupSearchBase(groupSearchBase);
    						}
    					}
    					options.setGroupRoleAttribute(getPropertyValueString(authzBean, LDAP_GROUP_ROLE_ATTRIBUTE));
    					options.setGroupSearchFilter(getPropertyValueString(authzBean, LDAP_GROUP_SEARCH_FILTER));
    					options.setRoleModel(getPropertyValueString(authzBean, LDAP_ROLE_MODEL));

    					//Get the table name and, if any, strip away any schema prefixes
    					String tableName = getPropertyValueString(authzBean, LDAP_ROLE_TABLE);
    					if (tableName != null) { 
    						int hasSchemaPrefix = tableName.indexOf('.');
    						if (hasSchemaPrefix > -1) {
    							tableName = tableName.substring(hasSchemaPrefix + 1);
    						}
    					}
    					options.setRoleTable(tableName);
    					options.setRoleUsername(getPropertyValueString(authzBean, LDAP_ROLE_USERNAME));
    					options.setRoleProperty(getPropertyValueString(authzBean, LDAP_ROLE_PROPERTY));
    					options.setRoleQuery(getPropertyValueString(authzBean, LDAP_ROLE_QUERY));
    					options.setRoleProvider(getPropertyValueString(authzBean, LDAP_ROLE_PROVIDER));
    				}
    			}
    		}
    		return options;
    	}
    	else{
    		new ConfigurationException("LDAP is not the configured authentication source");
    	}
    	return options;
    }
    
    private static LDAPOptions getLdapConfig(Beans beans, LDAPOptions options) {
    	LdapServer ldapServer = SecurityXmlSupport.getLdapServer(beans);
    	options.setUrl(ldapServer.getUrl());
    	options.setManagerDn(ldapServer.getManagerDn());
    	options.setManagerPassword(ldapServer.getManagerPassword());
    	AuthenticationManager.LdapAuthenticationProvider ldapAuthProvider = SecurityXmlSupport.getLdapAuthProvider(beans);
    	String userSearchFilter = ldapAuthProvider.getUserSearchFilter();
    	if(userSearchFilter.startsWith("(")){
    		 userSearchFilter = userSearchFilter.substring(1, userSearchFilter.length()-1);
    	}
    	options.setUserDnPattern(userSearchFilter);
    	//TODO: option to add base restriction
    	//ldapAuthProvider.getUserSearchBase();   	
    	options.setGroupSearchFilter(ldapAuthProvider.getGroupSearchFilter());
    	options.setGroupSearchBase(ldapAuthProvider.getGroupSearchBase());
    	options.setGroupRoleAttribute(ldapAuthProvider.getGroupRoleAttribute());

    	options.setGroupSearchDisabled(getGroupSearchDisabled(beans)); 
    	options.setRoleProvider(ROLE_PROVIDER_LDAP);
    	return options;
	}

	static void updateLDAPDirContext(Beans beans, String ldapUrl, String managerDn, String managerPassword) {
        Bean ldapDirContextBean = beans.getBeanById(LDAP_DIR_CONTEXT_FACTORY_BEAN_ID);

        ldapDirContextBean.getConstructorArgs().get(0).setValue(ldapUrl);
        if (managerDn != null && managerDn.length() != 0) {
            setPropertyValueString(ldapDirContextBean, LDAP_MANAGER_DN_PROPERTY, managerDn);
            setPropertyValueString(ldapDirContextBean, LDAP_MANAGER_PASSWORD_PROPERTY, SystemUtils.encrypt(managerPassword));
        } else {
            List<Object> props = ldapDirContextBean.getMetasAndConstructorArgsAndProperties();
            Property prop = ldapDirContextBean.getProperty(LDAP_MANAGER_DN_PROPERTY);
            if (prop != null) {
                props.remove(prop);
            }
            prop = ldapDirContextBean.getProperty(LDAP_MANAGER_PASSWORD_PROPERTY);
            if (prop != null) {
                props.remove(prop);
            }
        }
    }	

	public static void setGroupSearchDisabled(Beans beans, boolean groupSearchDisabled){
		Bean ldapAuthProviderBean = beans.getBeanById(LDAP_AUTH_PROVIDER_BEAN_ID);
		List<ConstructorArg> constructorArgs = ldapAuthProviderBean.getConstructorArgs();
		for (ConstructorArg constructorArg : constructorArgs) {
			if (constructorArg.getBean().getClazz().equals(LDAP_AUTHORITIES_POPULATOR_CLASSNAME)) {
				Bean ldapAuthPop = constructorArg.getBean();
				Property groupSearchDisabledPop = ldapAuthPop.getProperty(LDAP_GROUP_SEARCHING_DISABLED);
				Boolean bGroupSearchDisabled = new Boolean(groupSearchDisabled);
				Value newValue = new Value();
				List<String> newContent = new ArrayList<String>();
				newContent.add(bGroupSearchDisabled.toString());
				newValue.setContent(newContent);
				groupSearchDisabledPop.setValueElement(newValue);	
			}
		}
	}

	public static boolean getGroupSearchDisabled(Beans beans){
		Bean ldapAuthProviderBean = beans.getBeanById(LDAP_AUTH_PROVIDER_BEAN_ID);
		List<ConstructorArg> constructorArgs = ldapAuthProviderBean.getConstructorArgs();
		for (ConstructorArg constructorArg : constructorArgs) {
			if (constructorArg.getBean().getClazz().equals(LDAP_AUTHORITIES_POPULATOR_CLASSNAME)) {
				Bean ldapAuthPop = constructorArg.getBean();
				Property groupSearchDisabledPop = ldapAuthPop.getProperty(LDAP_GROUP_SEARCHING_DISABLED);
				Boolean bGroupSearchDisabled = new Boolean(groupSearchDisabledPop.getValueElement().getContent().get(0));
				return bGroupSearchDisabled.booleanValue();		
			}
		}
		return false;
	}
	
	public static void updateAdAuthProvider(Beans beans, String serverUrl,String domain) {
		Bean adAuthProviderBean = beans.getBeanById(AD_AUTH_PROVIDER_BEAN_ID);
		List<ConstructorArg> ctorArgs = adAuthProviderBean.getConstructorArgs();
        	ctorArgs.get(0).setValue(domain);
        	ctorArgs.get(1).setValue(serverUrl);
	}

	public static void updateLdapAuthProvider(Beans beans, String ldapUrl, String userDnPattern,
			boolean groupSearchDisabled, String groupSearchBase,
			String groupRoleAttribute, String groupSearchFilter) {
		LdapServer ldapServer = SecurityXmlSupport.getLdapServer(beans);
		ldapServer.setUrl(ldapUrl);
		setGroupSearchDisabled(beans,groupSearchDisabled);
		SecurityXmlSupport.setLdapProviderProps(beans, groupSearchDisabled, userDnPattern, groupSearchBase, groupRoleAttribute, groupSearchFilter);	
	}

	static void updateLdapAuthProvider(Beans beans, String ldapUrl, String userDnPattern, boolean groupSearchDisabled, String groupSearchBase,
			String groupRoleAttribute, String groupSearchFilter, String roleModel, String roleEntity, String roleTable, String roleUsername,
			String roleProperty, String roleQuery, String roleProvider) {
		updateLdapAuthProvider(beans, ldapUrl, "", userDnPattern,
				groupSearchDisabled, groupSearchBase, groupRoleAttribute,
				groupSearchFilter, roleModel, roleEntity, roleTable,
				roleUsername, roleProperty, roleQuery, roleProvider);
	}

	public static void updateLdapAuthProvider(Beans beans, String ldapUrl, String searchBase, String userDnPattern, boolean groupSearchDisabled,
        String groupSearchBase, String groupRoleAttribute, String groupSearchFilter, String roleModel, String roleEntity, String roleTable,
        String roleUsername, String roleProperty, String roleQuery, String roleProvider) {

		Bean contextSource = beans.getBeanById(CONTEXT_SOURCE);
		List<ConstructorArg> contextConstructorArgs = contextSource.getConstructorArgs();
		contextConstructorArgs.get(0).setValue(ldapUrl);
		
        Bean ldapAuthProviderBean = beans.getBeanById(LDAP_AUTH_PROVIDER_BEAN_ID);
        List<ConstructorArg> constructorArgs = ldapAuthProviderBean.getConstructorArgs();

        for (ConstructorArg constructorArg : constructorArgs) {
            if (constructorArg.getBean().getClazz().equals(LDAP_BIND_AUTHENTICATOR_CLASSNAME)) {
                Bean bindAuthBean = constructorArg.getBean();
                Property userSearchProperty = bindAuthBean.getProperty(LDAP_USERSEARCH_PROPERTY);
                Bean userSearchBean = userSearchProperty.getBean();
                List<ConstructorArg> userSearchCtorArgs = userSearchBean.getConstructorArgs();
                userSearchCtorArgs.get(0).setValue(searchBase);
                userSearchCtorArgs.get(1).setValue("(" + userDnPattern + ")");
                userSearchCtorArgs.get(2).setRef(CONTEXT_SOURCE);
            } else if (constructorArg.getBean().getClazz().equals(LDAP_AUTHORITIES_POPULATOR_CLASSNAME)) {
                Bean authzBean = constructorArg.getBean();
                List<ConstructorArg> authzArgs = authzBean.getConstructorArgs();
                if (authzArgs.size() > 1) {
                    Value valueElement = authzArgs.get(1).getValueElement();
                    if (valueElement != null) {
                        List<String> content = new ArrayList<String>();
                        content.add(groupSearchBase);
                        valueElement.setContent(content);
                    }
                }

                // GD: blank out the properties first (it was getting too messy)
                authzBean.removeProperties();

                setPropertyValueString(authzBean, LDAP_GROUP_SEARCHING_DISABLED, Boolean.toString(groupSearchDisabled));
                setPropertyValueString(authzBean, LDAP_ROLE_PROVIDER, roleProvider);
                if (groupSearchDisabled == false) { // if group search is not disabled, we need to populate where we are
                                                    // getting the roles from
                    if (roleProvider.equals(ROLE_PROVIDER_LDAP)) {
                        setPropertyValueString(authzBean, LDAP_GROUP_ROLE_ATTRIBUTE, groupRoleAttribute);
                        setPropertyValueString(authzBean, LDAP_GROUP_SEARCH_FILTER, groupSearchFilter);
                    } else if (roleProvider.equals(ROLE_PROVIDER_DATABASE)) {
                        // GD: Adding values needed to get roles from database
                        setPropertyValueString(authzBean, LDAP_ROLE_MODEL, roleModel);
                        setPropertyValueString(authzBean, LDAP_ROLE_ENTITY, roleEntity);
                        setPropertyValueString(authzBean, LDAP_ROLE_TABLE, roleTable);
                        setPropertyValueString(authzBean, LDAP_ROLE_USERNAME, roleUsername);
                        setPropertyValueString(authzBean, LDAP_ROLE_PROPERTY, roleProperty);
                        setPropertyValueString(authzBean, LDAP_ROLE_QUERY, roleQuery);
                        if (roleModel != null && !(roleModel.length() == 0)) {
                            // GD: Need to have a reference to the dataSource as well, but only if the dataModel is
                            // selected
                            Property dataSourceProperty = authzBean.getProperty(DATA_SOURCE_PROPERTY);
                            if (dataSourceProperty == null) {
                                dataSourceProperty = new Property();
                                dataSourceProperty.setName(DATA_SOURCE_PROPERTY);
                                authzBean.addProperty(dataSourceProperty);
                            }
                            Ref ref = new Ref();
                            // TODO: should get this from DataService
                            ref.setBean(roleModel + "DataSource");
                            dataSourceProperty.setRefElement(ref);
                        }
                    }
                }
            }
        }
    }

    public static CASOptions constructCASOptions(Beans standardBeans, Beans casBeans) {
        CASOptions options = new CASOptions();
        Bean bean = casBeans.getBeanById(SecuritySpringSupport.CAS_PROPERTY_PLACEHOLDER_CONFIGURER_ID);
        if (bean != null) {
            Property property = bean.getProperty("properties");
            if (property != null) {
                Props props = property.getProps();
                if (props != null) {
                    for (Prop prop : props.getProps()) {
                        String key = prop.getKey();
                        List<String> values = prop.getContent();
                        String value = values.isEmpty() ? "" : values.get(0);
                        if (key.equals("cas.url")) {
                            options.setCasUrl(value);
                        } else if (key.equals("project.url")) {
                            options.setProjectUrl(value);
                        } else if (key.equals("userdetails.ref")) {
                            if (value.equals(SecuritySpringSupport.CAS_USERDETAILS_SERVICE_DATABASE_ID)) {
                                options.setUserDetailsProvider(SecuritySpringSupport.CAS_USERDETAILS_PROVIDER_DATABASE);
                                options.setOptions(constructDatabaseOptions(standardBeans));
                            } else if (value.equals(SecuritySpringSupport.CAS_USERDETAILS_SERVICE_LDAP_ID)) {
                                options.setUserDetailsProvider(SecuritySpringSupport.CAS_USERDETAILS_PROVIDER_LDAP);
                                options.setOptions(constructLDAPOptions(standardBeans));
                            } else {
                                // ERROR
                            }
                        }
                    }
                }
            }
        }
        return options;
    }

    public static List<String> getRoles(Beans beans) {
        Bean securityServiceBean = beans.getBeanById(SECURITY_SERVICE);
        Property rolesProperty = securityServiceBean.getProperty(ROLES);
        if (rolesProperty == null || rolesProperty.getList() == null) {
            return Collections.emptyList();
        }
        List<Object> refElements = rolesProperty.getList().getRefElement();
        List<String> roles = new ArrayList<String>(refElements.size());
        for (Object o : refElements) {
            roles.add(((Value) o).getContent().get(0));
        }
        return roles;
    }

    public static void setRoles(Beans beans, List<String> roles) {
        Bean securityServiceBean = beans.getBeanById(SECURITY_SERVICE);
        Property rolesProperty = securityServiceBean.getProperty(ROLES);
        com.wavemaker.tools.spring.beans.List list = rolesProperty.getList();
        List<Object> refElements = new ArrayList<Object>();
        if (roles != null) {
            for (String role : roles) {
                Value v = new Value();
                List<String> content = new ArrayList<String>();
                content.add(role);
                v.setContent(content);
                refElements.add(v);
            }
        }
        list.setRefElement(refElements);
    }

    private static String getPropertyValueString(Bean bean, String propertyName) {
    	if(bean == null){
    		return null;
    	}
        Property property = bean.getProperty(propertyName);
        if (property == null) {
            return null;
        }
        Value valueElement = property.getValueElement();
        if (valueElement.getContent().isEmpty() == false) { // GD: Added this check because sometimes the value in
                                                            // project-security.xml can be null
            return valueElement.getContent().get(0);
        } else {
            return null;
        }
    }

    private static void setPropertyValueString(Bean bean, String propertyName, String value) {
        Property property = bean.getProperty(propertyName);
        if (property == null) {
            property = new Property();
            property.setName(propertyName);
            bean.addProperty(property);
        }
        Value valueElement = new Value();
        List<String> content = new ArrayList<String>();
        content.add(value);
        valueElement.setContent(content);
        property.setValueElement(valueElement);
    }

}
