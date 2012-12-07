/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;


import org.springframework.core.io.Resource;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.security.schema.*;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;

/**
 * Helper class for handling security beans entities in project security config file
 * 
 * Provides access to security namespace elements given beans based security xml file
 * 
 * @author Ed Callahan
 */


public class SecurityXmlSupport {
	
	public static final String WEBAPP_SCHEMA_LOCATION = "http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd";

    public static final String WEBAPP_PACKAGE = "com.wavemaker.tools.webapp.schema";
	
    public static final String SECURITY_SCHEMA_LOCATION = "http://www.springframework.org/schema/security/spring-security-3.1.xsd";
    
    public static final String SPRING_SCHEMA_LOCATION = "http://schema.cloudfoundry.org/spring http://schema.cloudfoundry.org/spring/cloudfoundry-spring-0.8.xsd http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd";
    
    public static final String SECURITY_PACKAGE = "com.wavemaker.tools.spring.beans:com.wavemaker.tools.security.schema";

    private static JAXBContext jaxbContext;
    
	static List<UserService.User> getUserSvcUsers(File secXmlFile){
		 List<UserService.User> demoUsers = new ArrayList<UserService.User>();
		 try{
			 UserService userSvc = getUserSvc(secXmlFile);
			 if(userSvc != null){
				 List<UserService.User> userList = userSvc.getUser();
			 }
		 }
		 catch(Exception e){
			 e.printStackTrace();
		 }
		 return demoUsers;		
	}
	
	static void setUserSvcUsers(File xmlFile, DemoUser[] demoUsers){
		
	}
	
	static UserService getUserSvc(File SecXmlFile){
		 UserService userSvc = null;
		 try{
			 List<Object> authProviderList = getAuthProviders(SecXmlFile);
			 for(Object o : authProviderList){
				 if(o instanceof UserService){
					 userSvc = (UserService)o;
				 }
			 }
		 }
		 catch(Exception e){
			 e.printStackTrace();
		 }
		 return userSvc;
	}
	
	static List<Object> getAuthProviders(File SecXmlFile){
		List<Object> authProviderList  = new ArrayList<Object>();
		 try{
			 AuthenticationManager authMan = getAuthMan(SecXmlFile);
			 authProviderList = authMan.getAuthenticationProviderOrLdapAuthenticationProvider();
		 }
		 catch(Exception e){
			 e.printStackTrace();
		 }
		 return authProviderList;		
	}
	
	static AuthenticationManager getAuthMan(File SecXmlFile){
		 Beans beans = null;
		 try{
			 beans = readSecurityXml(SecXmlFile);
			 List<Object> importOrAliasOrBeanList = beans.getImportsAndAliasAndBean();
			 for (Object o : importOrAliasOrBeanList) {
				 if(o instanceof AuthenticationManager){
					 return (AuthenticationManager)o;
				 }
			 }
		 }
		 catch(Exception e){
			 e.printStackTrace();
		 }
		 return null;
	}
	
	static Http getHttp(File SecXmlFile){
		 Beans beans = null;
		 try{
			 beans = readSecurityXml(SecXmlFile);
			 List<Object> importOrAliasOrBeanList = beans.getImportsAndAliasAndBean();
			 for (Object o : importOrAliasOrBeanList) {
				 if(o instanceof Http){
					 return (Http)o;
				 }
			 }
		 }
		 catch(Exception e){
			 e.printStackTrace();
		 }
		 return null;
	}     
	
    public static Beans readSecurityXml(File SecXmlFile) throws JAXBException, IOException {
        BufferedInputStream bis = null;
        try {
            bis = new BufferedInputStream(SecXmlFile.getContent().asInputStream());
            return readSecurityXml(bis);
        } finally {
            try {
                bis.close();
            } catch (Exception ignore) {
            }
        }
    }
    
    public static Beans readSecurityXml(InputStream is) throws JAXBException {
        Unmarshaller unmarshaller = getJAXBContext().createUnmarshaller();
        Beans beans = (Beans)  unmarshaller.unmarshal(is);
        return beans;
    }
    
    public static synchronized JAXBContext getJAXBContext() throws JAXBException {
        if (jaxbContext == null) {
            jaxbContext = JAXBContext.newInstance(SECURITY_PACKAGE);
        }
        return jaxbContext;
    }

}
