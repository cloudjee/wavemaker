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
import java.util.Collections;
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
    
    public static final String DEMO_AUTHMAN_ALIAS = "authenticationManagerDemo";
    
    public static final String DB_AUTHMAN_ALIAS = "authenticationManagerDB";

    private static JAXBContext jaxbContext;
    
	static List<UserService.User> getUserSvcUsers(File secXmlFile){
		 List<UserService.User> demoUsers = null;
		 try{
			 UserService userSvc = getUserSvc(secXmlFile);
			 if(userSvc != null){
				 demoUsers = userSvc.getUser();
				 }
		 }
		 catch(Exception e){
			 e.printStackTrace();
		 }
		 return demoUsers;		
	}
	
	static void setUserSvcUsers(File xmlFile, DemoUser[] demoUsers){
		
	}
	
	/*
	 * Returns FIRST user-service found of all authentication-managers returned
	 */
	static UserService getUserSvc(File secXmlFile){
		 UserService userSvc = null;
		 try{
			 List<AuthenticationManager.AuthenticationProvider> authProviderList = getAuthProviders(secXmlFile, DEMO_AUTHMAN_ALIAS);
			 for(AuthenticationManager.AuthenticationProvider authProvider : authProviderList){
				 List<JAXBElement<?>> jeList = authProvider.getAnyUserServiceOrPasswordEncoder();
				 for(JAXBElement<?> je : jeList){
					 if(je.getDeclaredType().getName().equals("com.wavemaker.tools.security.schema.UserService"))
						 return userSvc = (UserService)je.getValue();
				 }
			 }
		 }
		 catch(Exception e){
			 e.printStackTrace();
		 }
		 return userSvc; 
	}
	
	static List<AuthenticationManager.AuthenticationProvider> getAuthProviders(File secXmlFile, String alias){
		List<AuthenticationManager.AuthenticationProvider> authProviderList  = new ArrayList<AuthenticationManager.AuthenticationProvider>();
		 try{
			 List<Object> authProviderOrLdapProviders =  Collections.emptyList();
			 AuthenticationManager authMan = getAuthMan(secXmlFile,alias);
			 authProviderOrLdapProviders = authMan.getAuthenticationProviderOrLdapAuthenticationProvider();
			 for(Object o : authProviderOrLdapProviders){
				 if(o instanceof AuthenticationManager.AuthenticationProvider){
					 authProviderList.add((AuthenticationManager.AuthenticationProvider)o);
				 }
			 }
		 }
		 catch(Exception e){
			 e.printStackTrace();
		 }
		 return authProviderList;		
	}
	
	static List<AuthenticationManager.LdapAuthenticationProvider> getLdapAuthProviders(File secXmlFile, String alias){
		List<AuthenticationManager.LdapAuthenticationProvider> ldapAuthProviderList  = new ArrayList<AuthenticationManager.LdapAuthenticationProvider>();
		 try{
			 List<Object> authProviderOrLdapProviders =  Collections.emptyList();
			 AuthenticationManager authMan = getAuthMan(secXmlFile,alias);
			 authProviderOrLdapProviders = authMan.getAuthenticationProviderOrLdapAuthenticationProvider();
			 for(Object o : authProviderOrLdapProviders){
				 if(o instanceof AuthenticationManager.LdapAuthenticationProvider){
					 ldapAuthProviderList.add((AuthenticationManager.LdapAuthenticationProvider)o);
				 }
			 }
		 }
		 catch(Exception e){
			 e.printStackTrace();
		 }
		 return ldapAuthProviderList;		
	}
	
	/*
	 * Returns Authentiation Manager with given alias
	 * @param secXmlFile the xml file to be parsed
	 * @param alias alias of Authentication Manager to return
	 * 
	 */
	static AuthenticationManager getAuthMan(File secXmlFile, String alias){
		 Beans beans = null;
		 try{
			 beans = readSecurityXml(secXmlFile);
			 List<Object> importOrAliasOrBeanList = beans.getImportsAndAliasAndBean();
			 for (Object o : importOrAliasOrBeanList) {
				 if(o instanceof AuthenticationManager){
					 AuthenticationManager authMan =(AuthenticationManager)o;
					 String a = authMan.getAlias();
					 if(a!=null && a.equals(alias))
						 return authMan;
				 }
			 }
		 }
		 catch(Exception e){
			 e.printStackTrace();
		 }
		 return null;
	}

    static Http getHttp(File secXmlFile){
        Beans beans;
        try{
            beans = readSecurityXml(secXmlFile);
            return getHttp(beans);
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    static Http getHttp(Beans beans){
        List<Object> importOrAliasOrBeanList = beans.getImportsAndAliasAndBean();
        for (Object o : importOrAliasOrBeanList) {
            if(o instanceof Http){
                return (Http)o;
            }
        }
        return null;
	}

    static List<Http.InterceptUrl>getInterceptUrls(Beans beans) {
        return getInterceptUrls(getHttp(beans));
    }

    static List<Http.InterceptUrl>getInterceptUrls(Http http) {
        List<Object> objs = http.getInterceptUrlOrAccessDeniedHandlerOrFormLogin();
        List<Http.InterceptUrl> urls = new ArrayList<Http.InterceptUrl>();
        for (Object obj : objs) {
            if (obj instanceof Http.InterceptUrl) {
                urls.add((Http.InterceptUrl) obj);
            }
        }

        return urls;
    }

    static void setInterceptUrls(Beans beans, List<Http.InterceptUrl> interceptUrls) {
        for (Http.InterceptUrl url : interceptUrls) {
            setInterceptUrl(beans, url);
        }
    }

    static void setInterceptUrl(Beans beans, Http.InterceptUrl interceptUrl) {
        List<Object> objs = getHttp(beans).getInterceptUrlOrAccessDeniedHandlerOrFormLogin();
        for (Object obj : objs) {
            if (obj instanceof Http.InterceptUrl) {
                Http.InterceptUrl url = (Http.InterceptUrl) obj;
                if (interceptUrl.getPattern().equals(url.getPattern())) {
                    url = interceptUrl;
                    return;
                }
            }
        }
        objs.add(interceptUrl);
    }
	
    public static Beans readSecurityXml(File secXmlFile) throws JAXBException, IOException {
        BufferedInputStream bis = null;
        try {
            bis = new BufferedInputStream(secXmlFile.getContent().asInputStream());
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
