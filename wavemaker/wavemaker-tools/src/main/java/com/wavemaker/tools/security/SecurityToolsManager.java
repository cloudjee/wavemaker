/*
 *  Copyright (C) 2007-2013 VMware, Inc. All rights reserved.
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

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.security.SecurityService;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.DataModelConfiguration;
import com.wavemaker.tools.io.ClassPathFile;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.security.schema.CustomFilter;
import com.wavemaker.tools.security.schema.Http;
import com.wavemaker.tools.security.schema.NamedSecurityFilter;
import com.wavemaker.tools.security.schema.UserService;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.*;
import org.apache.log4j.Logger;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.jdbc.JdbcDaoImpl;

import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.ldap.InitialLdapContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.UnmarshalException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.*;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author Jeremy Grelle
 * @author Edward Callahan
 */
public class SecurityToolsManager {

    static final Logger logger = Logger.getLogger(SecurityToolsManager.class);

    private static final String SECURITY_SPRING_FILENAME = "project-security.xml";
    
    private static final String SECURITY_CAS_SPRING_FILENAME = "project-security-cas.xml";

    private static final String SECURITY_CUSTOM_SPRING_FILENAME = "project-custom-security.xml";

    private static final String SECURITY_SPRING_TEMPLATE_CLASSPATH = "com/wavemaker/tools/security/project-security-template.xml";

    private static final String SECURITY_SPRING_TEMPLATE_CAS_CLASSPATH = "com/wavemaker/tools/security/project-security-template-cas.xml";

    private static final String LOGIN_HTML_TEMPLATE_CLASSPATH = "com/wavemaker/tools/security/login-template.html";

    private final Lock lock = new ReentrantLock();

    private final ProjectManager projectMgr;

    private final DesignServiceManager designServiceMgr;

    private final StudioFileSystem fileSystem;

    public SecurityToolsManager(ProjectManager projectMgr, DesignServiceManager designServiceMgr, StudioFileSystem fileSystem) {
        this.projectMgr = projectMgr;
        this.designServiceMgr = designServiceMgr;
        this.fileSystem = fileSystem;
    }

    /**
     * Returns the Security Spring template.
     */
    private Beans getSecuritySpringBeansTemplate() throws JAXBException, IOException {
        ClassPathResource securityTemplateXml = new ClassPathResource(SECURITY_SPRING_TEMPLATE_CLASSPATH);
        Reader reader = new InputStreamReader(securityTemplateXml.getInputStream());
        Beans ret = SpringConfigSupport.readSecurityBeans(reader);
        reader.close();
        return ret;
    }

    /**
     * Returns the CAS Security Spring template.
     */
    private Beans getCASSecuritySpringBeansTemplate() throws JAXBException, IOException {
        ClassPathResource securityTemplateXml = new ClassPathResource(SECURITY_SPRING_TEMPLATE_CAS_CLASSPATH);
        Reader reader = new InputStreamReader(securityTemplateXml.getInputStream());
        Beans ret = SpringConfigSupport.readSecurityBeans(reader);
        reader.close();
        return ret;
    }

    @Deprecated
    public Resource getSecuritySpringResource() throws IOException {
        return getSecuritySpringResource(this.projectMgr.getCurrentProject());
    }

    @Deprecated
    private Resource getSecuritySpringResource(Project currentProject) {
        try {
            return currentProject.getWebInf().createRelative(SECURITY_SPRING_FILENAME);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public File getSecuritySpringFile() throws IOException {
        return getSecuritySpringFile(this.projectMgr.getCurrentProject());
    }

    private File getSecuritySpringFile(Project currentProject) {
        return currentProject.getWebInfFolder().getFile(SECURITY_SPRING_FILENAME);
    }
    
    public File getCustomSecuritySpringFile() throws IOException {
        return getCustomSecuritySpringFile(this.projectMgr.getCurrentProject());
    }

    private File getCustomSecuritySpringFile(Project currentProject) {
        return currentProject.getWebInfFolder().getFile(SECURITY_CUSTOM_SPRING_FILENAME);
    }

    public File getCASSecuritySpringFile() throws IOException {
        return getCASSecuritySpringFile(this.projectMgr.getCurrentProject());
    }

    private File getCASSecuritySpringFile(Project currentProject) {
        return currentProject.getWebInfFolder().getFile(SECURITY_CAS_SPRING_FILENAME);
    }

    private void setCustomSecurityContent(String content) throws IOException, JAXBException {
		File customSecurityXmlFile = getCustomSecuritySpringFile();
		customSecurityXmlFile.getContent().write(content);
    }

    /**
     * Returns the Spring Security Spring beans in the current project.
     * 
     * @param create If this is set to true, it will create the Spring file using the template if the Security Spring file
     *        does not exist in current project.
     */
    private Beans getSecuritySpringBeans(boolean create) throws IOException, JAXBException {
        File securityXml = getSecuritySpringFile();
        Beans beans = null;
        if (securityXml.exists()) {
            try {
                beans = SpringConfigSupport.readSecurityBeans(securityXml);
            } catch (JAXBException e) {
                if (create) {
                    beans = getSecuritySpringBeansTemplate();
                } else {
                    throw e;
                }
            }
        }
        if (create) {
            if (beans == null || beans.getBeanList().isEmpty()) {
                beans = getSecuritySpringBeansTemplate();

            }
            registerSecurityService();
        }
        return beans;
    }

    /**
     * Returns the CAS Spring Security Spring beans in the current project.
     *
     * @param create If this is set to true, it will create the Spring file using the template if
     *               the CAS Security Spring file does not exist in current project.
     */
    private Beans getCASSecuritySpringBeans(boolean create) throws IOException, JAXBException {
        File securityXml = getCASSecuritySpringFile();
        Beans beans = null;
        if (securityXml.exists()) {
            try {
                beans = SpringConfigSupport.readSecurityBeans(securityXml);
            } catch (JAXBException e) {
                if (create) {
                    beans = getCASSecuritySpringBeansTemplate();
                } else {
                    throw e;
                }
            }
        }
        if (create) {
            if (beans == null || beans.getBeanList().isEmpty()) {
                beans = getCASSecuritySpringBeansTemplate();

            }
        }
        return beans;
    }

    private synchronized void saveSecuritySpringBeans(Beans beans) throws JAXBException, IOException {
        File securityXml = getSecuritySpringFile();
        saveSecuritySpringBeans(securityXml, beans);
    }

    private synchronized void saveCASSecuritySpringBeans(Beans beans) throws JAXBException, IOException {
        File securityXml = getCASSecuritySpringFile();
        saveSecuritySpringBeans(securityXml, beans);
    }

    /**
     * Saves the specified Security Spring beans to the current project.
     */
    private static synchronized void saveSecuritySpringBeans(File securityXml, Beans beans) throws JAXBException, IOException {
        SpringConfigSupport.writeSecurityBeans(beans, securityXml);
    }

    /**
     * Registers SecurityService to the current project.
     */
    public void registerSecurityService() {
        Set<Service> services = this.designServiceMgr.getServices();
        boolean found = false;
        for (Service service : services) {
            if (service.getClazz().equals(SecurityService.class.getName())) {
                found = true;
            }
        }
        if (!found) {
            try {
                String serviceId = SecurityServiceDefinition.DEFAULT_SERVICE_ID;
                Set<String> serviceIds = this.designServiceMgr.getServiceIds();
                int i = 1;
                while (serviceIds.contains(serviceId)) {
                    serviceId = SecurityServiceDefinition.DEFAULT_SERVICE_ID + i;
                    i++;
                }
                SecurityServiceDefinition def = new SecurityServiceDefinition(serviceId);
                this.designServiceMgr.defineService(def);
            } catch (LinkageError e) {
                throw new ConfigurationException(e);
            }
        }
    }

    public boolean isSecurityEnabled() throws JAXBException, IOException {
    	return SecuritySpringSupport.getSecurityEnforced(getSecuritySpringBeans(false));
    }
    
    public GeneralOptions getGeneralOptions() throws JAXBException, IOException {
        Beans beans = null;
        try {
            beans = getSecuritySpringBeans(false);
        } catch (UnmarshalException e) {
            return null; // project-security.xml must be setting to DTD
        }

        if (beans == null || beans.getBeanList().isEmpty()) { 
            return null;
        }

        GeneralOptions options = new GeneralOptions();
        options.setEnforceSecurity(SecuritySpringSupport.getSecurityEnforced(beans));
        options.setEnforceIndexHtml(SecuritySpringSupport.getIndexHtmlEnforced(beans));
        options.setDataSourceType(SecuritySpringSupport.getDataSourceType(beans));
        String channel = SecuritySpringSupport.getRequiresChannel(beans);
        options.setUseSSL(channel != null && channel.equals("https"));
        Http.PortMappings.PortMapping mapping = SecurityXmlSupport.getPortMapping(beans, RuntimeAccess.getInstance().getRequest().getLocalPort()+"");
        options.setSslPort(mapping == null ? "" : mapping.getHttps());
        return options;
    }

    public Http.PortMappings.PortMapping getPortMapping() throws IOException, JAXBException {
        Beans beans;
        try {
            beans = getSecuritySpringBeans(false);
        } catch (UnmarshalException e) {
            return null; // project-security.xml must be setting to DTD
        }

        if (beans == null || beans.getBeanList().isEmpty()) {
            return null;
        }

        return SecurityXmlSupport.getFirstPortMapping(beans);
    }

    public void setGeneralOptions(boolean enforceSecurity, boolean enforceIndexHtml) throws IOException, JAXBException {
        setGeneralOptions(enforceSecurity, enforceIndexHtml, false);
    }

    public void setGeneralOptions(boolean enforceSecurity, boolean enforceIndexHtml, boolean useSSL) throws IOException, JAXBException {
        this.lock.lock();


        try {
            Beans beans = getSecuritySpringBeans(true);
            SecuritySpringSupport.setSecurityResources(beans, enforceSecurity, enforceIndexHtml);
            String channel = enforceSecurity && useSSL ? "https" : "http";
            SecuritySpringSupport.setRequiresChannel(beans, channel);
            if (useSSL) {
                String servicePort;
                String sslPort;
                TomcatConfig tomcatConfig = TomcatConfig.GetDefaultConfig(this.fileSystem);
                if (tomcatConfig == null) {
                    servicePort = RuntimeAccess.getInstance().getRequest().getLocalPort()+"";
                    sslPort = "8443";
                } else {
                    servicePort = tomcatConfig.getServicePort()+"";
                    sslPort = tomcatConfig.getSslPort() == -99 ? "8443" : tomcatConfig.getSslPort()+"";
                }
                SecurityXmlSupport.setPortMapping(beans, useSSL, servicePort, sslPort);
            }
            saveSecuritySpringBeans(beans);
        } finally {
            this.lock.unlock();
        }
    }

    public static void recreatePortMapping(File securityXml, String httpPort, String httpsPort) throws IOException, JAXBException {
        Beans beans = SpringConfigSupport.readSecurityBeans(securityXml);
        SecurityXmlSupport.recreatePortMapping(beans, httpPort, httpsPort);
        saveSecuritySpringBeans(securityXml, beans);
    }

    public void setGeneralOptions(boolean enforceSecurity) throws IOException, JAXBException {
        this.lock.lock();
        try {
            Beans beans = getSecuritySpringBeans(false);
            SecuritySpringSupport.setSecurityResources(beans, enforceSecurity, false);
            saveSecuritySpringBeans(beans);
        } finally {
            this.lock.unlock();
        }
    }

    public DemoOptions getDemoOptions() throws JAXBException, IOException {
    	Beans beans = getSecuritySpringBeans(false);
    	List<UserService.User> userList = SecurityXmlSupport.getUserSvcUsers(beans);
    	DemoOptions options = new DemoOptions();
    	options.setUsersByUserSvc(userList);
    	return options;
    }

    public void configDemo(DemoUser[] demoUsers) throws JAXBException, IOException {
        Beans beans = getSecuritySpringBeans(true);
        //SecuritySpringSupport.updateAuthProviderUserDetailsService(beans, SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID);
        SecuritySpringSupport.setDemoUsers(beans, demoUsers);
        SecuritySpringSupport.resetJdbcDaoImpl(beans);
        saveSecuritySpringBeans(beans);
    }

    public DatabaseOptions getDatabaseOptions() throws IOException, JAXBException {
        Beans beans = getSecuritySpringBeans(false);
        return SecuritySpringSupport.constructDatabaseOptions(beans);
    }

    public void configDatabase(String modelName, String tableName, String unameColumnName, String uidColumnName, String uidColumnSqlType,
        String pwColumnName, String roleColumnName, String rolesByUsernameQuery) throws JAXBException, IOException {
        Beans beans = getSecuritySpringBeans(true);
        //SecuritySpringSupport.updateAuthProviderUserDetailsService(beans, SecuritySpringSupport.JDBC_DAO_IMPL_BEAN_ID);
        SecuritySpringSupport.updateJdbcDaoImpl(beans, modelName, tableName, unameColumnName, uidColumnName, uidColumnSqlType, pwColumnName,
            roleColumnName, rolesByUsernameQuery);
        SecuritySpringSupport.setDataSourceType(beans, SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID_DB);
        saveSecuritySpringBeans(beans);
    }

    public List<String> testRolesByUsernameQuery(DataModelConfiguration dataModel, String query, String username) {
        Properties properties = dataModel.readConnectionProperties();
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        String connectionUrl = properties.getProperty("connectionUrl");
        connectionUrl = connectionUrl.replace(DataServiceConstants.WEB_ROOT_TOKEN, this.projectMgr.getCurrentProject().getWebAppRootFolderRawPath());
        dataSource.setUrl(connectionUrl);
        dataSource.setDriverClassName(properties.getProperty("driverClassName"));
        dataSource.setUsername(properties.getProperty("username"));
        String pwd = properties.getProperty("password");
        if (SystemUtils.isEncrypted(pwd)) {
            pwd = SystemUtils.decrypt(pwd);
        }
        dataSource.setPassword(pwd);
        JdbcDaoImplTest jdbcDaoImpl = new JdbcDaoImplTest();
        jdbcDaoImpl.setAuthoritiesByUsernameQuery(query);
        jdbcDaoImpl.setDataSource(dataSource);
        jdbcDaoImpl.setRolePrefix(SecuritySpringSupport.ROLE_PREFIX);
        jdbcDaoImpl.initTest();
        return jdbcDaoImpl.loadUserRolesByUsername(username);
    }

    private static class JdbcDaoImplTest extends JdbcDaoImpl {

        public void initTest() {
            initDao();
        }

        public List<String> loadUserRolesByUsername(String username) {
            List<GrantedAuthority> dbAuths = this.loadUserAuthorities(username);
            List<String> userRoles = new ArrayList<String>();
            for (GrantedAuthority dbAuth : dbAuths) {
                String dbAuthString = dbAuth.getAuthority();
                if (dbAuthString.startsWith(SecuritySpringSupport.ROLE_PREFIX)) {
                    userRoles.add(dbAuthString.substring(SecuritySpringSupport.ROLE_PREFIX.length()));
                }
            }
            return userRoles;
        }
    }

    public LDAPOptions getAdOptions() throws IOException, JAXBException {
        Beans beans = getSecuritySpringBeans(false);
        return SecuritySpringSupport.constructAdOptions(beans);
    }

    public LDAPOptions getLDAPOptions() throws IOException, JAXBException {
        Beans beans = getSecuritySpringBeans(false);
        return SecuritySpringSupport.constructLDAPOptions(beans);
    }
    
	public String getCustomAuthOptions() throws IOException, JAXBException {
		File customSecurityXmlFile = getCustomSecuritySpringFile();
		return customSecurityXmlFile.getContent().asString();
	}
	
	public void configCustomAuth(String customConfig) throws IOException, JAXBException {
		setCustomSecurityContent(customConfig);
		Beans beans = getSecuritySpringBeans(true);
		SecurityXmlSupport.setActiveAuthMan(beans, SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID_CUSTOM);
		saveSecuritySpringBeans(beans);
	}
    /**
     * Function for backwards compatibility (for functions that call this function without the DB authorization
     * parameters)
     * 
     * @param ldapUrl
     * @param managerDn
     * @param managerPassword
     * @param userDnPattern
     * @param groupSearchDisabled
     * @param groupSearchBase
     * @param groupRoleAttribute
     * @param groupSearchFilter
     * @throws IOException
     * @throws JAXBException
     */
    public void configLDAPwithDB(String ldapUrl, String managerDn, String managerPassword, String userDnPattern, boolean groupSearchDisabled,
        String groupSearchBase, String groupRoleAttribute, String groupSearchFilter) throws IOException, JAXBException {
        configLDAPwithDB(ldapUrl, managerDn, managerPassword, userDnPattern, groupSearchDisabled, groupSearchBase, groupRoleAttribute, groupSearchFilter,
            "", "", "", "", "", "", "");
    }

    public void configLDAPwithDB(String ldapUrl, String managerDn, String managerPassword, String userDnPattern, boolean groupSearchDisabled,
        String groupSearchBase, String groupRoleAttribute, String groupSearchFilter, String roleModel, String roleEntity, String roleTable,
        String roleUsername, String roleProperty, String roleQuery, String roleProvider) throws IOException, JAXBException {
        Beans beans = getSecuritySpringBeans(true);
        SecurityXmlSupport.setActiveAuthMan(beans, SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID_LDAP_WITH_DB);
               
        //Passing empty string for SearchBase
        SecuritySpringSupport.updateLdapAuthProvider(beans, ldapUrl, "", userDnPattern, groupSearchDisabled, groupSearchBase,
            groupRoleAttribute, groupSearchFilter, roleModel, roleEntity, roleTable, roleUsername, roleProperty, roleQuery, roleProvider);
        SecuritySpringSupport.resetJdbcDaoImpl(beans);
        saveSecuritySpringBeans(beans);
    }

    public void configAD(String ServerUrl, String Domain) throws IOException, JAXBException {
        Beans beans = getSecuritySpringBeans(true);
        SecurityXmlSupport.setActiveAuthMan(beans, SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID_AD);
        SecuritySpringSupport.updateAdAuthProvider(beans, ServerUrl, Domain);
            //SecuritySpringSupport.resetJdbcDaoImpl(beans);
            saveSecuritySpringBeans(beans);
    }
    
    public void configLDAP(String ldapUrl, String userDnPattern, boolean groupSearchDisabled,
            String groupSearchBase, String groupRoleAttribute, String groupSearchFilter) throws IOException, JAXBException {
            Beans beans = getSecuritySpringBeans(true);
            SecurityXmlSupport.setActiveAuthMan(beans, SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID_LDAP);
                   
            SecuritySpringSupport.updateLdapAuthProvider(beans, ldapUrl, userDnPattern, groupSearchDisabled, groupSearchBase,
                groupRoleAttribute, groupSearchFilter);
            SecuritySpringSupport.resetJdbcDaoImpl(beans);
            saveSecuritySpringBeans(beans);
        }
    
    /**
     * Tests if the LDAP connection could be established successfully using the supplied parameters. An exception will
     * be thrown if it can't connect to the LDAP server.
     * 
     * @param ldapUrl The LDAP URL like "ldap://localhost:389/dc=wavemaker,dc=com"
     * @param managerDn The test user DN
     * @param managerPassword The test user password
     * @throws NamingException
     */
    public static void testLDAPConnection(String ldapUrl, String managerDn, String managerPassword) throws NamingException {
        Hashtable<String,String> env = new Hashtable<String,String>();
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, managerDn);
        env.put(Context.PROVIDER_URL, ldapUrl);
        env.put(Context.SECURITY_CREDENTIALS, managerPassword);
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        @SuppressWarnings("unused")
		InitialLdapContext ctx = new InitialLdapContext(env, null);
    }

    public CASOptions getCASOptions() throws IOException, JAXBException {
        Beans standardBeans = getSecuritySpringBeans(false);
        Beans casBeans = getCASSecuritySpringBeans(false);
        return SecuritySpringSupport.constructCASOptions(standardBeans, casBeans);
    }

    public void configCAS(String casUrl, String projectUrl, String userDetailsProvider) throws IOException, JAXBException {
        Beans casBeans = getCASSecuritySpringBeans(true);
        // Set properties
        Bean bean = casBeans.getBeanById(SecuritySpringSupport.CAS_PROPERTY_PLACEHOLDER_CONFIGURER_ID);
        if (bean != null) {
            Property property = bean.getProperty("properties");
            if (property != null) {
                Props props = property.getProps();
                if (props != null) {
                    for (Prop prop : props.getProps()) {
                        String key = prop.getKey();
                        if (key.equals("cas.url")) {
                            prop.setContent(Arrays.asList(casUrl));
                        } else if (key.equals("project.url")) {
                            prop.setContent(Arrays.asList(projectUrl));
                        } else if (key.equals("userdetails.ref")) {
                            if (userDetailsProvider.equals(SecuritySpringSupport.CAS_USERDETAILS_PROVIDER_DATABASE)) {
                                prop.setContent(Arrays.asList(SecuritySpringSupport.CAS_USERDETAILS_SERVICE_DATABASE_ID));
                            } else if (userDetailsProvider.equals(SecuritySpringSupport.CAS_USERDETAILS_PROVIDER_LDAP)) {
                                prop.setContent(Arrays.asList(SecuritySpringSupport.CAS_USERDETAILS_SERVICE_LDAP_ID));
                            }
                        }
                    }

                    // Check and add import to main spring security file...
                    Beans standardBeans = getSecuritySpringBeans(true);
                    List<Object> importsAndAliases = standardBeans.getImportsAndAliasAndBean();
                    boolean found = false;
                    for (Object entry : importsAndAliases) {
                        if (entry instanceof Import) {
                            String resource = ((Import) entry).getResource();
                            if (resource != null && resource.equalsIgnoreCase(SECURITY_CAS_SPRING_FILENAME)) {
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                        Import casImport = new Import();
                        casImport.setResource(SECURITY_CAS_SPRING_FILENAME);
                        importsAndAliases.add(casImport);
                    }

                    // Point to CAS entry-point...
                    Http http = SecurityXmlSupport.getHttp(standardBeans);
                    http.setEntryPointRef(SecuritySpringSupport.CAS_AUTH_ENTRY_POINT);

                    // Remove custom-filter FORM_LOGIN_FILTER...
                    CustomFilter filter = new CustomFilter();
                    filter.setPosition(NamedSecurityFilter.FORM_LOGIN_FILTER);
                    filter.setRef(SecuritySpringSupport.USER_PASSWORD_AUTHENTICATION_FILTER_BEAN_ID);
                    SecurityXmlSupport.removeCustomFilter(standardBeans, filter);

                    // Add custom filters to http element...
                    List<CustomFilter> filters = new ArrayList<CustomFilter>();
                    filter = new CustomFilter();
                    filter.setBefore(NamedSecurityFilter.LOGOUT_FILTER);
                    filter.setRef(SecuritySpringSupport.CAS_REQUEST_SINGLE_LOGOUT_FILTER);
                    filters.add(filter);
                    filter = new CustomFilter();
                    filter.setBefore(NamedSecurityFilter.CAS_FILTER);
                    filter.setRef(SecuritySpringSupport.CAS_SINGLE_SIGN_OUT_FILTER);
                    filters.add(filter);
                    filter = new CustomFilter();
                    filter.setPosition(NamedSecurityFilter.CAS_FILTER);
                    filter.setRef(SecuritySpringSupport.CAS_AUTHENTICATION_FILTER);
                    filters.add(filter);
                    SecurityXmlSupport.setCustomFilters(standardBeans, filters);

                    // Add or alter the logout entry...
                    Http.Logout logout = new Http.Logout();
                    logout.setLogoutSuccessUrl("/j_spring_cas_security_logout");
                    SecurityXmlSupport.setLogout(standardBeans, logout);

                    // Set marker value. This bean is not used for CAS, just to allow system to decide which security provider we are using.
                    SecuritySpringSupport.setDataSourceType(standardBeans, SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID_CAS);

                    saveCASSecuritySpringBeans(casBeans);
                    saveSecuritySpringBeans(standardBeans);
                }
            }
        }
    }

    public List<String> getRoles() throws IOException, JAXBException {
        Beans beans = getSecuritySpringBeans(false);
        if (beans == null || beans.getBeanList().isEmpty()) {
            return null;
        }
        return SecuritySpringSupport.getRoles(beans);
    }

    public void setRoles(List<String> roles) throws IOException, JAXBException {
        this.lock.lock();
        try {
            Beans beans = getSecuritySpringBeans(true);
            SecuritySpringSupport.setRoles(beans, roles);
            saveSecuritySpringBeans(beans);
        } finally {
            this.lock.unlock();
        }
    }

    @Deprecated
    public Resource getLoginHtmlTemplateResource() throws IOException {
        ClassPathResource resource = new ClassPathResource(LOGIN_HTML_TEMPLATE_CLASSPATH);
        if (resource.exists()) {
            return resource;
        } else {
            return null;
        }
    }

    public File getLoginHtmlTemplateFile() {
        return new ClassPathFile(LOGIN_HTML_TEMPLATE_CLASSPATH);
    }

    /**
     * Sets the project security filter object definition source map
     * 
     * @param urlMap The new object definition source map. Replaces existing map
     * @throws IOException
     * @throws JAXBException
     */
    public void setSecurityInterceptUrls(Map<String, List<String>> urlMap) throws IOException, JAXBException {
        Beans beans = null;
        this.lock.lock();
        try {
            beans = getSecuritySpringBeans(false);
            if (beans == null || beans.getBeanList().isEmpty()) {
                throw new RuntimeException("Unable to get Security Bean");
            } else {
                SecuritySpringSupport.setSecurityInterceptUrls(beans, urlMap);
                SecuritySpringSupport.setSecurityEnforced(beans, true);
                saveSecuritySpringBeans(beans);
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        } finally {
            this.lock.unlock();
        }
    }

    public Map<String, List<String>> getSecurityInterceptUrls() {
        Beans beans = null;
        try {
            beans = getSecuritySpringBeans(false);
        } catch (Exception e) {
            return null;
        }
        if (beans == null || beans.getBeanList().isEmpty()) {
            return null;
        } else {
            return SecuritySpringSupport.getSecurityInterceptUrls(beans);
        }
    }

}
