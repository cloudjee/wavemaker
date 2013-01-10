/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade.six_dot_six_dot_zero_dot_M2;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBException;

import org.springframework.core.io.ClassPathResource;

import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.security.SecuritySpringSupport;
import com.wavemaker.tools.security.SecurityXmlSupport;
import com.wavemaker.tools.security.schema.UserService;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.ConstructorArg;
import com.wavemaker.tools.spring.beans.Property;
import com.wavemaker.tools.spring.beans.Value;

/**
 * @author Edward "EdC" Callahan
 */

public class AcegiToSpringSecurityUpgradeTask implements UpgradeTask {

	private File secXmlFile = null;

	private String content = null;
	
	private Beans acegiBeans = null;
	
	private UpgradeInfo upgradeInfo = null;

	private static final String BACKUP_FILE_NAME = "Acegi-Project-Security-Backup.xml";

	private static final String AUTH_MAN = "<bean class=\"org.acegisecurity.providers.ProviderManager\" id=\"authenticationManager\">";

	private static final String SERVICES_PROTECTED  = "/*/*.json=IS_AUTHENTICATED_FULLY";

	private static final String SERVICES_PROTECTED2 = "/*.json=IS_AUTHENTICATED_FULLY";

	private static final String PROTECTED_INDEX ="/index.html=IS_AUTHENTICATED_FULLY";

	private static final String PROTECTED_ROOT = "/=IS_AUTHENTICATED_FULLY";			

	private static final String DAO_PROVIDER = "<ref bean=\"daoAuthenticationProvider\"/>";

	private static final String LDAP_PROVIDER = "<ref bean=\"ldapAuthProvider\"/>";

	private static final String ROLE_PROVIDER = "<property name=\"roleProvider\">";

	private static final String USER_DETAILS_SVC = "<property name=\"userDetailsService\">";

    private static final String IN_MEMORY_DAO_IMPL_BEAN_ID = "inMemoryDaoImpl";
    
    private static final String LDAP_DIR_CONTEXT_FACTORY_BEAN_ID = "initialDirContextFactory";
    
    private static final String LDAP_BIND_AUTHENTICATOR_CLASSNAME = 
            "org.acegisecurity.providers.ldap.authenticator.BindAuthenticator";
    
    private static final String LDAP_AUTHORITIES_POPULATOR_CLASSNAME = 
            "com.wavemaker.runtime.security.LdapAuthoritiesPopulator";
    
    private static final String LDAP_AUTH_PROVIDER_BEAN_ID = "ldapAuthProvider";
    
    private static final String LDAP_USERDN_PATTERNS_PROPERTY = "userDnPatterns";

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
    
    private static final String USER_MAP_PROPERTY = "userMap";
    
    static final String ROLE_PREFIX = "ROLE_";

	private static final String SECURITY_SPRING_TEMPLATE_CLASSPATH = "com/wavemaker/tools/security/project-security-template.xml";

	@Override
	/**
	 * Determines previous security provider type.
	 * Sends off to provider specific function for upgrade. 
	 */
	public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
		this.upgradeInfo = upgradeInfo;
		this.secXmlFile = project.getSecurityXmlFile();
		this.content = secXmlFile.getContent().asString();
		if(!(content.length()>1)){
			throw new ConfigurationException("Problem getting project-security.xml file !!!");
		} 		
		
		if(!(content.contains(AUTH_MAN))){
			//security was never enabled, this is the mini config 
			this.setNoSecurityConfig();
			return;
		}
		this.acegiBeans = getAcegiSpringBeans();
		Boolean securityEnabled = this.isSecurityEnabled();
		Boolean usingLoginPage = this.isUsingLoginHtml();
		try{
		//ldap also contains a DAO ref, check for ldap first
		if(content.contains(LDAP_PROVIDER)){
			if(content.contains(ROLE_PROVIDER)){
				int providerIndex = content.indexOf(ROLE_PROVIDER);
				if(content.indexOf("<value>LDAP</value>",providerIndex)>1){
					this.ldapUpgrade(securityEnabled,usingLoginPage);
				}
				else if(content.indexOf("<value>Database</value>",providerIndex)>1){
					this.ldapWithDbUpgrade(securityEnabled,usingLoginPage);
				}
			}
			else{
				throw new ConfigurationException("Unable to determine role provider !!!");
			}
		}
		else if(content.contains(DAO_PROVIDER)){
			if(content.contains(USER_DETAILS_SVC)){
				int userSvcIndx = content.indexOf(USER_DETAILS_SVC);
				if(content.indexOf("<ref bean=\"inMemoryDaoImpl\"/>",userSvcIndx)>1){
					this.demoUpgrade(securityEnabled,usingLoginPage);
				}
				else if(content.indexOf("<ref bean=\"jdbcDaoImpl\"/>",userSvcIndx)>1){
					this.databaseUpgrade(securityEnabled,usingLoginPage);
				}
			}
			else{
				throw new ConfigurationException("Unable to determine DAO provider type !!!");
			}
		}
		else{
			this.setNoSecurityConfig();
			throw new ConfigurationException("Unable to determine authentication provider");
		}
		} catch(ConfigurationException e){
			createAcegiBackup(project);
			this.setNoSecurityConfig();			
			System.out.println("Problem upgrading Security - Security has been DISABLED!\n" + e.getMessage());
			this.upgradeInfo.addMessage("Problem upgrading Security - Security has been DISABLED!\n " + e.getMessage());
			e.printStackTrace();
		}
	}


	private void createAcegiBackup(Project project) {
		File backupFile = project.getRootFolder().getFolder("export").getFile(BACKUP_FILE_NAME);
		backupFile.createIfMissing();
		backupFile.getContent().write(content);
		System.out.println("Acegi version of project-security.xml has been backed up as: " + BACKUP_FILE_NAME);
		this.upgradeInfo.addMessage("Acegi version of project-security.xml has been backed up as: export/" + BACKUP_FILE_NAME );	
		
	}


	private void databaseUpgrade(boolean securityEnabled, boolean usingLoginPage) {
		// TODO Auto-generated method stub

	}

	/**
	 * See SecurityConfigService.configDemo
	 */
	private void demoUpgrade(boolean enforceSecurity, boolean enforceIndexHtml) {
		Beans beans = getNewSecuritySpringBeansFromTemplate();
		SecuritySpringSupport.setSecurityResources(beans, enforceSecurity, enforceIndexHtml);
		SecuritySpringSupport.setRequiresChannel(beans, "http", "8443");
		List<UserService.User> userList =  getAcegiDemoUsers();
		if(userList.isEmpty()){
			System.out.print("No Users found !!! Adding demo user");
			UserService.User demoUser = new UserService.User();
			demoUser.setName("demo");
			demoUser.setPassword("demo");
			userList.add(demoUser);
		}
		SecurityXmlSupport.setUserSvcUsers(beans, userList);
	    SecuritySpringSupport.resetJdbcDaoImpl(beans);
		saveSecuritySpringBeans(beans);
	}


	private void saveSecuritySpringBeans(Beans beans) {
		try {
			SpringConfigSupport.writeSecurityBeans(beans, secXmlFile);
		} catch (JAXBException e) {
			e.printStackTrace();
			throw new ConfigurationException(e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			throw new ConfigurationException(e.getMessage());
		}

	}

	private void ldapWithDbUpgrade(boolean securityEnabled, boolean usingLoginPage) {
		Bean ldapDirContextBean = this.acegiBeans.getBeanById(LDAP_DIR_CONTEXT_FACTORY_BEAN_ID);
		ConstructorArg arg = ldapDirContextBean.getConstructorArgs().get(0);
        String ldapUrl = arg.getValue();
        
        Bean ldapAuthProviderBean =  this.acegiBeans.getBeanById(LDAP_AUTH_PROVIDER_BEAN_ID);
        List<ConstructorArg> constructorArgs = ldapAuthProviderBean.getConstructorArgs();
        
        String userDnPattern = "";
        boolean isGroupSearchDisabled = false;
        String groupSearchBase = "";
        String groupRoleAttribute  = "";
        String groupSearchFilter = "";
        String roleModel = "";
        String roleEntity  = "";
        String roleTable = "";
        String roleUsername = "";
        String roleProperty  = "";
        String roleQuery = "";
        String roleProvider = "";
        
        for (ConstructorArg constructorArg : constructorArgs) {
            if (constructorArg.getBean().getClazz().equals(LDAP_BIND_AUTHENTICATOR_CLASSNAME)) {
                Bean bindAuthBean = constructorArg.getBean();
                Property userDnPatternsProperty = bindAuthBean.getProperty(LDAP_USERDN_PATTERNS_PROPERTY);
                Value v = (Value) userDnPatternsProperty.getList().getRefElement().get(0);
                userDnPattern = v.getContent().get(0);
            } else if (constructorArg.getBean().getClazz().equals(LDAP_AUTHORITIES_POPULATOR_CLASSNAME)) {
                Bean authzBean = constructorArg.getBean();
                isGroupSearchDisabled = Boolean.parseBoolean(getPropertyValueString(authzBean,LDAP_GROUP_SEARCHING_DISABLED));
                if (!isGroupSearchDisabled) {
                    List<ConstructorArg> authzArgs = authzBean.getConstructorArgs();
                    if (authzArgs.size() > 1) {
                        Value valueElement = authzArgs.get(1).getValueElement();
                        if (valueElement != null && valueElement.getContent() != null  && !valueElement.getContent().isEmpty()) {
                            groupSearchBase = valueElement.getContent().get(0);
                            }
                    }
                    groupRoleAttribute = (getPropertyValueString(authzBean, LDAP_GROUP_ROLE_ATTRIBUTE));
                    groupSearchFilter = (getPropertyValueString(authzBean, LDAP_GROUP_SEARCH_FILTER));
                    roleModel = (getPropertyValueString(authzBean, LDAP_ROLE_MODEL));

                    String tableName = getPropertyValueString(authzBean, LDAP_ROLE_TABLE);
                    int hasSchemaPrefix = tableName.indexOf('.');
                    if (hasSchemaPrefix > -1) {
                    	tableName = tableName.substring(hasSchemaPrefix + 1);
                    }
                    roleTable = tableName; 
                    roleEntity = getPropertyValueString(authzBean, LDAP_ROLE_ENTITY);
                    roleUsername = getPropertyValueString(authzBean, LDAP_ROLE_USERNAME);
                    roleProperty = getPropertyValueString(authzBean, LDAP_ROLE_PROPERTY);
                    roleQuery = getPropertyValueString(authzBean, LDAP_ROLE_QUERY);
                    roleProvider = getPropertyValueString(authzBean, LDAP_ROLE_PROVIDER);                    
                }
            }
        }
            
		Beans beans = getNewSecuritySpringBeansFromTemplate();
		SecurityXmlSupport.setActiveAuthMan(beans, SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID_LDAP_WITH_DB);     
        SecuritySpringSupport.updateLdapAuthProvider(beans, ldapUrl, "", userDnPattern, isGroupSearchDisabled, groupSearchBase,
                groupRoleAttribute, groupSearchFilter, roleModel, roleEntity, roleTable, roleUsername, roleProperty, roleQuery, roleProvider);
        SecuritySpringSupport.resetJdbcDaoImpl(beans);
		saveSecuritySpringBeans(beans);
	}


	private void ldapUpgrade(boolean securityEnabled, boolean usingLoginPage) {
		Bean ldapDirContextBean = this.acegiBeans.getBeanById(LDAP_DIR_CONTEXT_FACTORY_BEAN_ID);
		ConstructorArg arg = ldapDirContextBean.getConstructorArgs().get(0);
        String ldapUrl = arg.getValue();
        
        Bean ldapAuthProviderBean =  this.acegiBeans.getBeanById(LDAP_AUTH_PROVIDER_BEAN_ID);
        List<ConstructorArg> constructorArgs = ldapAuthProviderBean.getConstructorArgs();
        
        String userDnPattern = "";
        boolean isGroupSearchDisabled = false;
        String groupSearchBase = "";
        String groupRoleAttribute  = "";
        String groupSearchFilter = "";
        
        for (ConstructorArg constructorArg : constructorArgs) {
            if (constructorArg.getBean().getClazz().equals(LDAP_BIND_AUTHENTICATOR_CLASSNAME)) {
                Bean bindAuthBean = constructorArg.getBean();
                Property userDnPatternsProperty = bindAuthBean.getProperty(LDAP_USERDN_PATTERNS_PROPERTY);
                Value v = (Value) userDnPatternsProperty.getList().getRefElement().get(0);
                userDnPattern = v.getContent().get(0);
            } else if (constructorArg.getBean().getClazz().equals(LDAP_AUTHORITIES_POPULATOR_CLASSNAME)) {
                Bean authzBean = constructorArg.getBean();
                isGroupSearchDisabled = Boolean.parseBoolean(getPropertyValueString(authzBean,LDAP_GROUP_SEARCHING_DISABLED));
                if (!isGroupSearchDisabled) {
                    List<ConstructorArg> authzArgs = authzBean.getConstructorArgs();
                    if (authzArgs.size() > 1) {
                        Value valueElement = authzArgs.get(1).getValueElement();
                        if (valueElement != null && valueElement.getContent() != null  && !valueElement.getContent().isEmpty()) {
                            groupSearchBase = valueElement.getContent().get(0);
                        }
                    }
                    groupRoleAttribute =(getPropertyValueString(authzBean, LDAP_GROUP_ROLE_ATTRIBUTE));
                    groupSearchFilter = (getPropertyValueString(authzBean, LDAP_GROUP_SEARCH_FILTER));
                }
            }
        }
            
		Beans beans = getNewSecuritySpringBeansFromTemplate();
		SecurityXmlSupport.setActiveAuthMan(beans, SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID_LDAP);     
        SecuritySpringSupport.updateLdapAuthProvider(beans, ldapUrl, userDnPattern, isGroupSearchDisabled, groupSearchBase,
            groupRoleAttribute, groupSearchFilter);
        SecuritySpringSupport.resetJdbcDaoImpl(beans);
		saveSecuritySpringBeans(beans);
	}


	private boolean isUsingLoginHtml() {
		if(content.contains(PROTECTED_INDEX) && content.contains(PROTECTED_ROOT)){
			return true;
		}
		return false;
	}

	private void setNoSecurityConfig() {
		Beans beans = getNewSecuritySpringBeansFromTemplate();
		SecuritySpringSupport.setSecurityResources(beans, false, false);
		SecuritySpringSupport.setRequiresChannel(beans, "http", "8443");
		saveSecuritySpringBeans(beans);
	}

	private boolean isSecurityEnabled() {
		if(content.contains(SERVICES_PROTECTED) && content.contains(SERVICES_PROTECTED2)){
			return true;
		}
		return false;
	}
  

	private Beans getNewSecuritySpringBeansFromTemplate() {
		ClassPathResource securityTemplateXml = new ClassPathResource(SECURITY_SPRING_TEMPLATE_CLASSPATH);
		Beans ret = null;
		try {
			Reader reader = new InputStreamReader(securityTemplateXml.getInputStream());
			ret = SpringConfigSupport.readSecurityBeans(reader);
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
			throw new ConfigurationException(e.getMessage());
		}catch (JAXBException e) {
			e.printStackTrace();
			throw new ConfigurationException(e.getMessage());
		}
		return ret;
	}

	private Beans getAcegiSpringBeans() {
		Beans beans = null;
		try {
			beans = SpringConfigSupport.readBeans(this.secXmlFile);
		} catch (JAXBException e) {
			e.printStackTrace();
		}catch (IOException e) {
			e.printStackTrace();
		}
		if(beans == null){
			throw new ConfigurationException("Problem getting Acegi Beans !!!");
		}
		return beans;
	}
		
	List<UserService.User> getAcegiDemoUsers() {
		List<UserService.User> demoUsers = new ArrayList<UserService.User>();
		Bean bean = this.acegiBeans.getBeanById(IN_MEMORY_DAO_IMPL_BEAN_ID);
		Property property = bean.getProperty(USER_MAP_PROPERTY);
		Value valueElement = property.getValueElement();
		List<String> content = valueElement.getContent();

		if (content.size() == 1) {
			String value = content.get(0);
			value = value.trim();

			String[] userStringArray = value.split("\n");
			for (String userString : userStringArray) {
				UserService.User user = new UserService.User();
				userString = userString.trim();
				int i = userString.indexOf('=');	         
				if (i > 0) {
					String userid = userString.substring(0, i);
					user.setName(userid);
				}
				int p = userString.indexOf(",", i + 1 );
				if(p > 0){
					String pass = userString.substring(i + 1, p);
					user.setPassword(pass);
				}
				String roles = userString.substring(p+1);
				if(roles.length() > 0){
					if(roles.indexOf(",") > 0) {
						throw new ConfigurationException("Multiple roles for user: " + user.getName()  + " !!!");
					}
					if(roles.startsWith(ROLE_PREFIX)){
						String role = roles.substring(ROLE_PREFIX.length());
						if(role.equals("DEFAULT_NO_ROLES")){
							role = "";
						}
						user.setAuthorities(role);
					}
				}
				demoUsers.add(user);
			} 
		}    
		return demoUsers;
	}
	
	
    private String getPropertyValueString(Bean bean, String propertyName) {
        Property property = bean.getProperty(propertyName);
        if (property == null) {
            return null;
        }
        Value valueElement = property.getValueElement();
        if(valueElement.getContent().isEmpty() == false){ // GD: Added this check because sometimes the value in project-security.xml can be null
        	return valueElement.getContent().get(0);	
        }else{
        	return null;
        }        
    }
}
