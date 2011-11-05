/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import javax.naming.NamingException;
import javax.naming.directory.DirContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.UnmarshalException;

import org.acegisecurity.GrantedAuthority;
import org.acegisecurity.ldap.DefaultInitialDirContextFactory;
import org.acegisecurity.userdetails.jdbc.JdbcDaoImpl;
import org.apache.log4j.Logger;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.security.JOSSOSecurityService;
import com.wavemaker.runtime.security.SecurityService;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.DataModelConfiguration;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.webapp.WebXmlSupport;
import com.wavemaker.tools.webapp.schema.AuthConstraintType;
import com.wavemaker.tools.webapp.schema.AuthMethodType;
import com.wavemaker.tools.webapp.schema.FormLoginConfigType;
import com.wavemaker.tools.webapp.schema.HttpMethodType;
import com.wavemaker.tools.webapp.schema.LoginConfigType;
import com.wavemaker.tools.webapp.schema.RoleNameType;
import com.wavemaker.tools.webapp.schema.SecurityConstraintType;
import com.wavemaker.tools.webapp.schema.SecurityRoleType;
import com.wavemaker.tools.webapp.schema.TransportGuaranteeType;
import com.wavemaker.tools.webapp.schema.UrlPatternType;
import com.wavemaker.tools.webapp.schema.UserDataConstraintType;
import com.wavemaker.tools.webapp.schema.WarPathType;
import com.wavemaker.tools.webapp.schema.WebAppType;
import com.wavemaker.tools.webapp.schema.WebResourceCollectionType;

/**
 * @author Jeremy Grelle
 */
public class SecurityToolsManager {

    static final Logger logger = Logger.getLogger(SecurityToolsManager.class);

    private static final String ACEGI_SPRING_FILENAME = "project-security.xml";

    private static final String ACEGI_SPRING_TEMPLATE_CLASSPATH = "com/wavemaker/tools/security/project-security-template.xml";

    private static final String LOGIN_HTML_TEMPLATE_CLASSPATH = "com/wavemaker/tools/security/login-template.html";

    private final ProjectManager projectMgr;

    private final DesignServiceManager designServiceMgr;

    public SecurityToolsManager(ProjectManager projectMgr, DesignServiceManager designServiceMgr) {
        this.projectMgr = projectMgr;
        this.designServiceMgr = designServiceMgr;
    }

    /**
     * Returns the Acegi Spring template.
     */
    private Beans getAcegiSpringBeansTemplate() throws JAXBException, IOException {
        ClassPathResource securityTemplateXml = new ClassPathResource(ACEGI_SPRING_TEMPLATE_CLASSPATH);
        Reader reader = new InputStreamReader(securityTemplateXml.getInputStream());
        Beans ret = SpringConfigSupport.readBeans(reader);
        reader.close();
        return ret;
    }

    public synchronized File getAcegiSpringFile() throws IOException {
        return getAcegiSpringFile(this.projectMgr.getCurrentProject()).getFile();
    }

    private Resource getAcegiSpringFile(Project currentProject) {
        try {
            return currentProject.getWebInf().createRelative(ACEGI_SPRING_FILENAME);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * Returns the Acegi Security Spring beans in the current project.
     * 
     * @param create If this is set to true, it will create the Spring file using the template if the Acegi Spring file
     *        does not exist in current project.
     */
    private synchronized Beans getAcegiSpringBeans(boolean create) throws IOException, JAXBException {
        Project currentProject = this.projectMgr.getCurrentProject();
        Resource securityXml = getAcegiSpringFile(currentProject);
        Beans beans = null;
        if (securityXml.exists()) {
            try {
                beans = SpringConfigSupport.readBeans(securityXml, currentProject);
            } catch (JAXBException e) {
                if (create) {
                    beans = getAcegiSpringBeansTemplate();
                } else {
                    throw e;
                }
            }
        }
        if (create) {
            if (beans == null || beans.getBeanList().isEmpty()) {
                beans = getAcegiSpringBeansTemplate();

            }
            registerSecurityService();
        }
        return beans;
    }

    /**
     * Saves the specified Acegi Spring beans to the current project.
     */
    private synchronized void saveAcegiSpringBeans(Beans beans) throws JAXBException, IOException {
        Project currentProject = this.projectMgr.getCurrentProject();
        Resource securityXml = getAcegiSpringFile(currentProject);
        SpringConfigSupport.writeBeans(beans, securityXml, currentProject);
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

    /**
     * Registers JOSSOSecurityService to the current project.
     */
    public void registerJOSSOSecurityService() {
        Set<Service> services = this.designServiceMgr.getServices();
        boolean found = false;
        for (Service service : services) {
            if (service.getClazz().equals(JOSSOSecurityService.class.getName())) {
                found = true;
            }
        }
        if (!found) {
            try {
                String serviceId = JOSSOSecurityServiceDefinition.DEFAULT_SERVICE_ID;
                Set<String> serviceIds = this.designServiceMgr.getServiceIds();
                int i = 1;
                while (serviceIds.contains(serviceId)) {
                    serviceId = JOSSOSecurityServiceDefinition.DEFAULT_SERVICE_ID + i;
                    i++;
                }
                JOSSOSecurityServiceDefinition def = new JOSSOSecurityServiceDefinition(serviceId);
                this.designServiceMgr.defineService(def);
            } catch (LinkageError e) {
                throw new ConfigurationException(e);
            }
        }
    }

    public GeneralOptions getGeneralOptions() throws JAXBException, IOException {
        Beans beans = null;
        try {
            beans = getAcegiSpringBeans(false);
        } catch (UnmarshalException e) {
            return null; // project-security.xml must be setting to DTD
        }
        if (beans == null || beans.getBeanList().isEmpty()) { // project-security.xml
                                                              // is empty
            if (this.getJOSSORoles().isEmpty()) {
                return null; // no JOSSO either
            } else {
                GeneralOptions optionsJOSSO = new GeneralOptions();
                optionsJOSSO.setEnforceSecurity(true);
                optionsJOSSO.setEnforceIndexHtml(false);
                optionsJOSSO.setDataSourceType("JOSSO");
                return optionsJOSSO;
            }
        }
        GeneralOptions options = new GeneralOptions();
        options.setEnforceSecurity(SecuritySpringSupport.isSecurityEnforced(beans));
        options.setEnforceIndexHtml(SecuritySpringSupport.isIndexHtmlEnforced(beans));
        options.setDataSourceType(SecuritySpringSupport.getDataSourceType(beans));
        return options;
    }

    public void setGeneralOptions(boolean enforceSecurity, boolean enforceIndexHtml) throws IOException, JAXBException {
        Beans beans = getAcegiSpringBeans(true);
        SecuritySpringSupport.setSecurityResources(beans, enforceSecurity, enforceIndexHtml);
        saveAcegiSpringBeans(beans);
    }

    public void setGeneralOptions(boolean enforceSecurity) throws IOException, JAXBException {
        Beans beans = getAcegiSpringBeans(false);
        SecuritySpringSupport.setSecurityResources(beans, enforceSecurity, false);
        saveAcegiSpringBeans(beans);
    }

    public void setStandardOptions(boolean enforceSecurity) throws IOException, JAXBException {
        Beans beans = getAcegiSpringBeans(false);
        SecuritySpringSupport.setSecurityResources(beans, enforceSecurity, false);
        SecuritySpringSupport.setSecurityFilterChain(beans);
        saveAcegiSpringBeans(beans);
        logger.warn("Notice: Community Security settings applied to project, use Enteprise Edition.");
    }

    public DemoOptions getDemoOptions() throws JAXBException, IOException {
        Beans beans = getAcegiSpringBeans(false);
        DemoOptions options = new DemoOptions();
        options.setUsers(SecuritySpringSupport.getDemoUsers(beans));
        return options;
    }

    public List<String> getJOSSOOptions() throws JAXBException, IOException {
        List<String> jossoRoles = new ArrayList<String>();
        Resource webXml = this.projectMgr.getCurrentProject().getWebXml();
        WebAppType wat = WebXmlSupport.readWebXml(webXml);

        List<Object> watList = wat.getDescriptionAndDisplayNameAndIcon();
        Iterator<Object> itr = watList.iterator();
        while (itr.hasNext()) {
            Object element = itr.next();
            if (element instanceof SecurityConstraintType) {
                SecurityConstraintType secCon = (SecurityConstraintType) element;
                AuthConstraintType authCons = secCon.getAuthConstraint();
                List<RoleNameType> theRoles = authCons.getRoleName();// .clear();
                Iterator<RoleNameType> rIt = theRoles.iterator();
                while (rIt.hasNext()) {
                    RoleNameType thisRole = rIt.next();
                    jossoRoles.add(thisRole.getValue());
                }
            }
        }
        return jossoRoles;
    }

    /**
     * Adds the SecurityConstraint, login-config and security-role to web.xml
     * 
     * @param primaryRole The security-role role-name
     */
    public void setJOSSOOptions(String primaryRole) throws JAXBException, IOException {
        boolean exists = false;
        this.designServiceMgr.getDeploymentManager().generateRuntime();

        Resource webXml = this.projectMgr.getCurrentProject().getWebXml();
        WebAppType wat = WebXmlSupport.readWebXml(webXml);

        List<Object> watList = wat.getDescriptionAndDisplayNameAndIcon();
        Iterator<Object> itr = watList.iterator();
        while (itr.hasNext()) {
            Object element = itr.next();
            if (element instanceof SecurityConstraintType) {
                exists = true;
                SecurityConstraintType secCon = (SecurityConstraintType) element;
                AuthConstraintType authCons = secCon.getAuthConstraint();
                authCons.getRoleName().clear();
                RoleNameType roleName = new RoleNameType();
                roleName.setValue(primaryRole);
                authCons.getRoleName().add(roleName);
            }
            if (element instanceof SecurityRoleType) {
                exists = true;
                SecurityRoleType secRole = (SecurityRoleType) element;
                RoleNameType theRole = secRole.getRoleName();
                theRole.setValue(primaryRole);
                secRole.setRoleName(theRole);
            }
        }

        if (exists) {
            WebXmlSupport.writeWebXml(null, wat, webXml);
            return;
        }

        SecurityConstraintType secCons = new SecurityConstraintType();
        WebResourceCollectionType webResColl = new WebResourceCollectionType();

        com.wavemaker.tools.webapp.schema.String webString = new com.wavemaker.tools.webapp.schema.String();
        webString.setValue("protected-resource");

        webResColl.setWebResourceName(webString);
        UrlPatternType urlPat = new UrlPatternType();
        urlPat.setValue("/*");
        webResColl.getUrlPattern().add(urlPat);

        List<HttpMethodType> methods = new ArrayList<HttpMethodType>();
        HttpMethodType httpMetHead = new HttpMethodType();
        httpMetHead.setValue("HEAD");
        methods.add(httpMetHead);
        HttpMethodType httpMetGet = new HttpMethodType();
        httpMetGet.setValue("GET");
        methods.add(httpMetGet);
        HttpMethodType httpMetPost = new HttpMethodType();
        httpMetPost.setValue("POST");
        methods.add(httpMetPost);
        HttpMethodType httpMetPut = new HttpMethodType();
        httpMetPut.setValue("PUT");
        methods.add(httpMetPut);
        HttpMethodType httpMetDelete = new HttpMethodType();
        httpMetDelete.setValue("DELETE");
        methods.add(httpMetDelete);
        webResColl.getHttpMethod().addAll(methods);
        secCons.getWebResourceCollection().add(webResColl);

        AuthConstraintType authCons = new AuthConstraintType();
        RoleNameType roleName = new RoleNameType();
        roleName.setValue(primaryRole);
        authCons.getRoleName().add(roleName);

        UserDataConstraintType userDataCons = new UserDataConstraintType();
        TransportGuaranteeType transGuarantee = new TransportGuaranteeType();
        transGuarantee.setValue("NONE");
        userDataCons.setTransportGuarantee(transGuarantee);
        secCons.setAuthConstraint(authCons);
        secCons.setUserDataConstraint(userDataCons);
        wat.getDescriptionAndDisplayNameAndIcon().add(secCons);

        LoginConfigType loginConf = new LoginConfigType();
        AuthMethodType authMeth = new AuthMethodType();
        authMeth.setValue("FORM");
        loginConf.setAuthMethod(authMeth);
        FormLoginConfigType loginForm = new FormLoginConfigType();
        WarPathType loginPage = new WarPathType();
        loginPage.setValue("/login-redirect.jsp");
        loginForm.setFormLoginPage(loginPage);
        WarPathType errorPage = new WarPathType();
        errorPage.setValue("/login-redirect.jsp");
        loginForm.setFormErrorPage(errorPage);
        loginConf.setFormLoginConfig(loginForm);
        wat.getDescriptionAndDisplayNameAndIcon().add(loginConf);

        SecurityRoleType secRole = new SecurityRoleType();
        RoleNameType secRoleName = new RoleNameType();
        secRoleName.setValue(primaryRole);
        secRole.setRoleName(secRoleName);
        wat.getDescriptionAndDisplayNameAndIcon().add(secRole);

        WebXmlSupport.writeWebXml(null, wat, webXml);
    }

    public void configDemo(DemoUser[] demoUsers) throws JAXBException, IOException {
        Beans beans = getAcegiSpringBeans(true);
        SecuritySpringSupport.updateAuthProviderUserDetailsService(beans, SecuritySpringSupport.IN_MEMORY_DAO_IMPL_BEAN_ID);
        SecuritySpringSupport.setDemoUsers(beans, demoUsers);
        SecuritySpringSupport.resetJdbcDaoImpl(beans);
        saveAcegiSpringBeans(beans);
    }

    public DatabaseOptions getDatabaseOptions() throws IOException, JAXBException {
        Beans beans = getAcegiSpringBeans(false);
        return SecuritySpringSupport.constructDatabaseOptions(beans);
    }

    public void configDatabase(String modelName, String tableName, String unameColumnName, String uidColumnName, String uidColumnSqlType,
        String pwColumnName, String roleColumnName, String rolesByUsernameQuery) throws JAXBException, IOException {
        Beans beans = getAcegiSpringBeans(true);
        SecuritySpringSupport.updateAuthProviderUserDetailsService(beans, SecuritySpringSupport.JDBC_DAO_IMPL_BEAN_ID);
        SecuritySpringSupport.updateJdbcDaoImpl(beans, modelName, tableName, unameColumnName, uidColumnName, uidColumnSqlType, pwColumnName,
            roleColumnName, rolesByUsernameQuery);
        saveAcegiSpringBeans(beans);
    }

    public List<String> testRolesByUsernameQuery(DataModelConfiguration dataModel, String query, String username) {
        Properties properties = dataModel.readConnectionProperties();
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setUrl(properties.getProperty("connectionUrl"));
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

        @SuppressWarnings("unchecked")
        public List<String> loadUserRolesByUsername(String username) {
            List<GrantedAuthority> dbAuths = this.authoritiesByUsernameMapping.execute(username);
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

    public LDAPOptions getLDAPOptions() throws IOException, JAXBException {
        Beans beans = getAcegiSpringBeans(false);
        return SecuritySpringSupport.constructLDAPOptions(beans);
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
    public void configLDAP(String ldapUrl, String managerDn, String managerPassword, String userDnPattern, boolean groupSearchDisabled,
        String groupSearchBase, String groupRoleAttribute, String groupSearchFilter) throws IOException, JAXBException {
        configLDAP(ldapUrl, managerDn, managerPassword, userDnPattern, groupSearchDisabled, groupSearchBase, groupRoleAttribute, groupSearchFilter,
            "", "", "", "", "", "", "");
    }

    public void configLDAP(String ldapUrl, String managerDn, String managerPassword, String userDnPattern, boolean groupSearchDisabled,
        String groupSearchBase, String groupRoleAttribute, String groupSearchFilter, String roleModel, String roleEntity, String roleTable,
        String roleUsername, String roleProperty, String roleQuery, String roleProvider) throws IOException, JAXBException {
        Beans beans = getAcegiSpringBeans(true);
        SecuritySpringSupport.setAuthManagerProviderBeanId(beans, SecuritySpringSupport.LDAP_AUTH_PROVIDER_BEAN_ID);
        SecuritySpringSupport.updateLDAPDirContext(beans, ldapUrl, managerDn, managerPassword);
        SecuritySpringSupport.updateLDAAuthProvider(beans, userDnPattern, groupSearchDisabled, groupSearchBase, groupRoleAttribute,
            groupSearchFilter, roleModel, roleEntity, roleTable, roleUsername, roleProperty, roleQuery, roleProvider);
        SecuritySpringSupport.resetJdbcDaoImpl(beans);
        saveAcegiSpringBeans(beans);
    }

    /**
     * Tests if the LDAP connection could be established successfully using the supplied parameters. An exception will
     * be thrown if it can't connect to the LDAP server.
     * 
     * @param ldapUrl The LDAP URL like "ldap://localhost:389/dc=wavemaker,dc=com"
     * @param managerDn The manager DN
     * @param managerPassword The manager password
     * @throws org.acegisecurity.BadCredentialsException
     * @throws org.acegisecurity.ldap.LdapDataAccessException
     */
    public static void testLDAPConnection(String ldapUrl, String managerDn, String managerPassword) {
        DefaultInitialDirContextFactory dirContext = new DefaultInitialDirContextFactory(ldapUrl);
        if (managerDn != null && managerDn.length() != 0) {
            dirContext.setManagerDn(managerDn);
            if (SystemUtils.isEncrypted(managerPassword)) {
                managerPassword = SystemUtils.decrypt(managerPassword);
            }
            dirContext.setManagerPassword(managerPassword);
        }
        DirContext context = null;
        try {
            context = dirContext.newInitialDirContext();
        } finally {
            if (context != null) {
                try {
                    context.close();
                } catch (NamingException e) {
                    throw new ConfigurationException(e);
                }
            }
        }
    }

    public List<String> getRoles() throws IOException, JAXBException {
        Beans beans = getAcegiSpringBeans(false);
        if (beans == null || beans.getBeanList().isEmpty()) {
            return getJOSSORoles();
        }
        return SecuritySpringSupport.getRoles(beans);
    }

    public List<String> getJOSSORoles() throws IOException, JAXBException {
        List<String> roles = new ArrayList<String>();
        try {
            Resource webXml = this.projectMgr.getCurrentProject().getWebXml();
            WebAppType wat = WebXmlSupport.readWebXml(webXml);
            List<Object> watList = wat.getDescriptionAndDisplayNameAndIcon();
            Iterator<Object> itr = watList.iterator();
            while (itr.hasNext()) {
                Object element = itr.next();
                if (element instanceof SecurityConstraintType) {
                    SecurityConstraintType secCon = (SecurityConstraintType) element;
                    AuthConstraintType authCons = secCon.getAuthConstraint();
                    List<RoleNameType> roleTypes = authCons.getRoleName();
                    Iterator<RoleNameType> roleItr = roleTypes.iterator();
                    while (roleItr.hasNext()) {
                        Object roleElement = roleItr.next();
                        RoleNameType rnt = (RoleNameType) roleElement;
                        roles.add(rnt.getValue());
                    }
                }
            }
            return roles;
        } catch (java.io.FileNotFoundException FNE) {
            return roles;
        }

    }

    public void setJOSSORoles(List<String> roles) throws IOException, JAXBException {
        throw new UnsupportedOperationException("Method Not Implemented");
    }

    public void setRoles(List<String> roles) throws IOException, JAXBException {
        Beans beans = getAcegiSpringBeans(true);
        SecuritySpringSupport.setRoles(beans, roles);
        saveAcegiSpringBeans(beans);
    }

    public Resource getLoginHtmlTemplateFile() throws IOException {
        ClassPathResource resource = new ClassPathResource(LOGIN_HTML_TEMPLATE_CLASSPATH);
        if (resource.exists()) {
            return resource;
        } else {
            return null;
        }
    }

    public void removeJOSSOConfig() throws JAXBException, IOException {
        Resource webXml = this.projectMgr.getCurrentProject().getWebXml();
        WebAppType wat = WebXmlSupport.readWebXml(webXml);
        List<Object> watList = wat.getDescriptionAndDisplayNameAndIcon();
        Iterator<Object> itr = watList.iterator();
        SecurityConstraintType secCon = null;
        while (itr.hasNext()) {
            Object element = itr.next();
            if (element instanceof SecurityConstraintType) {
                secCon = (SecurityConstraintType) element;
                secCon.getWebResourceCollection().clear();
                AuthConstraintType authCons = null;
                secCon.setAuthConstraint(authCons);
                UserDataConstraintType userDataCons = null;
                secCon.setUserDataConstraint(userDataCons);
            }
        }
        wat.getDescriptionAndDisplayNameAndIcon().remove(secCon);
        LoginConfigType loginCon = null;
        Iterator<Object> itr2 = watList.iterator();
        while (itr2.hasNext()) {
            Object element2 = itr2.next();
            if (element2 instanceof LoginConfigType) {
                loginCon = (LoginConfigType) element2;
                AuthMethodType authMeth = null;
                loginCon.setAuthMethod(authMeth);
                FormLoginConfigType form = null;
                loginCon.setFormLoginConfig(form);
            }
        }
        wat.getDescriptionAndDisplayNameAndIcon().remove(loginCon);
        SecurityRoleType secRole = null;
        Iterator<Object> itr3 = watList.iterator();
        while (itr3.hasNext()) {
            Object element3 = itr3.next();
            if (element3 instanceof SecurityRoleType) {
                secRole = (SecurityRoleType) element3;
                RoleNameType roleName = null;
                secRole.setRoleName(roleName);
            }
        }
        wat.getDescriptionAndDisplayNameAndIcon().remove(secRole);
        WebXmlSupport.writeWebXml(null, wat, webXml);
    }

    /**
     * Returns the security filter object definition source map
     * 
     * @return The projects security filter object definition source map
     */

    public Map<String, List<String>> getSecurityFilterODS() {
        Beans beans = null;
        try {
            beans = getAcegiSpringBeans(false);
        } catch (Exception e) {
            return null;
        }
        if (beans == null || beans.getBeanList().isEmpty()) {
            return null;
        } else {
            return SecuritySpringSupport.getObjectDefinitionSource(beans);
        }
    }

    /**
     * Sets the project security filter object definition source map
     * 
     * @param urlMap The new object definition source map. Replaces existing map
     * @throws IOException
     * @throws JAXBException
     */
    public void setSecurityFilterODS(Map<String, List<String>> urlMap) throws IOException, JAXBException {
        Beans beans = null;
        try {
            beans = getAcegiSpringBeans(false);
        } catch (Exception e) {
        }
        if (beans == null || beans.getBeanList().isEmpty()) {
        } else {
            SecuritySpringSupport.setObjectDefinitionSource(beans, urlMap);
            saveAcegiSpringBeans(beans);
        }
    }

}
