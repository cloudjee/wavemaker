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

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.security.SecuritySpringSupport;
import com.wavemaker.tools.security.SecurityToolsManager;
import com.wavemaker.tools.security.SecurityXmlSupport;
import com.wavemaker.tools.security.schema.UserService;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Beans;

/**
 * @author Edward "EdC" Callahan
 */

public class AcegiToSpringSecurityUpgradeTask implements UpgradeTask {

	private SecurityToolsManager secToolsMan = null;

	private File secXmlFile = null;

	private String content = null;

	private boolean securityEnabled = false;

	private boolean usingLoginPage = false;

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

	private static final String SECURITY_SPRING_TEMPLATE_CLASSPATH = "com/wavemaker/tools/security/project-security-template.xml";

	public AcegiToSpringSecurityUpgradeTask(){
		super();
		//REMOVE ME if we never use sec tools manager
		this.secToolsMan = new SecurityToolsManager(null, null);
	}

	@Override
	/**
	 * Makes backup of file before changing.
	 * Determines previous security provider type.
	 * Sends off to provider specific function for upgrade. 
	 */
	public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
		secXmlFile = project.getSecurityXmlFile();
		content = secXmlFile.getContent().asString();
		if(!(content.length()>1)){
			System.out.println("Problem getting project-security.xml file !!!");
			upgradeInfo.addMessage("Problem getting project-security.xml file !!!");
			return;
		} 
		File backupFile = project.getRootFolder().getFile(BACKUP_FILE_NAME);
		backupFile.createIfMissing();
		backupFile.getContent().write(content);
		System.out.println("Acegi version of project-security.xml has been backed up as: " + BACKUP_FILE_NAME);
		upgradeInfo.addMessage("Acegi version of project-security.xml has been backed up as: " + BACKUP_FILE_NAME);	
		if(!(content.contains(AUTH_MAN))){
			//security was never enabled
			this.setNoSecurityConfig();
			return;
		}
		securityEnabled = this.isSecurityEnabled();
		usingLoginPage = this.isUsingLoginHtml();

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
				System.out.println("Unable to determine role provider !!!");
				upgradeInfo.addMessage("Unable to determine role provider  !!!");
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
				System.out.println("Unable to determine DAO provider type !!!");
				upgradeInfo.addMessage("Unable to determine DAO provider type !!!");
			}
		}
		else{
			System.out.println("Woah! Project security authentiation provider could not be determined or is not supported.\nSecurity Disabled!");
			upgradeInfo.addMessage("Woah! Project security authentiation provider could not be determined or is not supported.\nSecurity Disabled!");
			this.setNoSecurityConfig();
		}
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
		SecurityXmlSupport.setUserSvcUsers(beans, getDemoUsers());
	    SecuritySpringSupport.resetJdbcDaoImpl(beans);
		saveSecuritySpringBeans(beans);
	}


	private List<UserService.User> getDemoUsers() {
		List<UserService.User> demoUsers = new ArrayList<UserService.User>();
		int userMapStartIndex = content.indexOf("<property name=\"userMap\">");
		int userMapEndIndex = content.indexOf("</value>", userMapStartIndex);
		String userMapSubString = content.substring(userMapStartIndex, userMapEndIndex).trim();
		System.out.println(userMapSubString);
		return demoUsers;
	}

	private void saveSecuritySpringBeans(Beans beans) {
		try {
			SpringConfigSupport.writeSecurityBeans(beans, secXmlFile);
		} catch (JAXBException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private void ldapWithDbUpgrade(boolean securityEnabled, boolean usingLoginPage) {
		// TODO Auto-generated method stub

	}


	private void ldapUpgrade(boolean securityEnabled, boolean usingLoginPage) {
		// TODO Auto-generated method stub

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
			// TODO Auto-generated catch block
			e.printStackTrace();
		}catch (JAXBException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ret;
	}



}
