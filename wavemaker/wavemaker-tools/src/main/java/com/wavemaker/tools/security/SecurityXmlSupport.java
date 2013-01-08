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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.xml.bind.JAXBElement;

import org.hibernate.cfg.Mappings;
import org.springframework.util.Assert;

import com.wavemaker.tools.security.schema.*;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.Property;

/**
 * Helper class for handling security beans entities in project security config file
 * 
 * Provides access to security namespace elements given security xml file bean
 * 
 * Beans should be obtained using security bean methods, e.g. readSecurityBeans NOT readBeans 
 * to ensure security schema is included.
 * 
 * @author Ed Callahan
 */


public class SecurityXmlSupport {

	static List<UserService.User> getUserSvcUsers(Beans beans){
		List<UserService.User> demoUsers = null;
		try{
			UserService userSvc = getUserSvc(beans);
			if(userSvc != null){
				demoUsers = userSvc.getUser();
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return demoUsers;		
	}

	static void setUserSvcUsers(Beans beans, List<UserService.User> demoUsersNew){
		try{
			UserService userSvc = getUserSvc(beans);
			if(userSvc != null){
				List<UserService.User> demoUsersLive = userSvc.getUser();
				demoUsersLive.clear();
				demoUsersLive.addAll(demoUsersNew);
				setUserSvc(beans, userSvc);
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}

	/*
	 * Returns FIRST user-service found of all authentication-managers returned
	 */
	static UserService getUserSvc(Beans beans){
		UserService userSvc = null;
		try{
			List<AuthenticationManager.AuthenticationProvider> authProviderList = getAuthProviders(beans, SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID_DEMO);
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
	/*
	 * sets the FIRST user-service found of all authentication-managers to the provided userSvc
	 */
	static void setUserSvc(Beans beans, UserService userSvc){
		UserService userSvcOld = null;
		try{
			List<AuthenticationManager.AuthenticationProvider> authProviderList = getAuthProviders(beans, SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID_DEMO);
			for(AuthenticationManager.AuthenticationProvider authProvider : authProviderList){
				List<JAXBElement<?>> jeList = authProvider.getAnyUserServiceOrPasswordEncoder();
				for(JAXBElement<?> je : jeList){
					if(je.getDeclaredType().getName().equals("com.wavemaker.tools.security.schema.UserService")) {
						userSvcOld = (UserService)je.getValue();
						userSvcOld = userSvc;
						return;
					}
				}
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}

	static List<AuthenticationManager.AuthenticationProvider> getAuthProviders(Beans beans, String alias){
		Assert.notNull(alias, "Authentication manager alias must not be null");
		List<AuthenticationManager.AuthenticationProvider> authProviderList  = new ArrayList<AuthenticationManager.AuthenticationProvider>();
		try{
			List<Object> authProviderOrLdapProviders =  Collections.emptyList();
			AuthenticationManager authMan = getAuthMan(beans,alias);
			Assert.notNull(authMan, "Authentication Manager must not be null");
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

	static List<AuthenticationManager.LdapAuthenticationProvider> getLdapAuthProviders(Beans beans, String alias){
		List<AuthenticationManager.LdapAuthenticationProvider> ldapAuthProviderList  = new ArrayList<AuthenticationManager.LdapAuthenticationProvider>();
		try{
			List<Object> authProviderOrLdapProviders =  Collections.emptyList();
			AuthenticationManager authMan = getAuthMan(beans,alias);
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
	 * Returns Authentication Manager with given alias
	 * @param beans the beans to be parsed
	 * @param alias alias of Authentication Manager to return
	 * 
	 */
	static AuthenticationManager getAuthMan(Beans beans, String alias){
		try{
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
	
	static AuthenticationManager getActiveAuthMan(Beans beans){
		return getAuthMan(beans, getActiveAuthManAlias(beans));
	}
	
	static String getActiveAuthManAlias(Beans beans){
		String authManRef = null;
		try{
			Bean authFilter = beans.getBeanById(SecuritySpringSupport.USER_PASSWORD_AUTHENTICATION_FILTER_BEAN_ID);
			Property authMan = authFilter.getProperty(SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID);
			authManRef = authMan.getRef();
		} catch(Exception e){
			e.printStackTrace();
		}
		return authManRef;

	}

	static void setActiveAuthMan(Beans beans, String alias){
		if(alias.equals(getActiveAuthManAlias(beans))){
			return;
		}
		Bean authFilter = beans.getBeanById(SecuritySpringSupport.USER_PASSWORD_AUTHENTICATION_FILTER_BEAN_ID);
		Property authMan = authFilter.getProperty(SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID);
		authMan.setRef(alias);		
	}

	public static void setLdapProviderProps(Beans beans, boolean groupSearchDisabled, String userDnPattern, String groupSearchBase, String groupRoleAttribute, String groupSearchFilter){
		AuthenticationManager.LdapAuthenticationProvider ldapAuthProvider = getLdapAuthProvider(beans);
		ldapAuthProvider.setUserSearchFilter("(" + userDnPattern + ")");
		if(!groupSearchDisabled){
			ldapAuthProvider.setGroupSearchBase(groupSearchBase);
			ldapAuthProvider.setGroupSearchFilter(groupSearchFilter);
			ldapAuthProvider.setGroupRoleAttribute(groupRoleAttribute);			
		}
	} 
	
    static LdapServer getLdapServer(Beans beans){
        List<Object> importOrAliasOrBeanList = beans.getImportsAndAliasAndBean();
        for (Object o : importOrAliasOrBeanList) {
            if(o instanceof LdapServer){
                return (LdapServer)o;
            }
        }
        return null;
	}

    public static AuthenticationManager.LdapAuthenticationProvider getLdapAuthProvider(Beans beans) {
		AuthenticationManager authMan = getAuthMan(beans, SecuritySpringSupport.AUTHENTICATON_MANAGER_BEAN_ID_LDAP);
		List<Object> ldapProviders = authMan.getAuthenticationProviderOrLdapAuthenticationProvider();
        for (Object o : ldapProviders) {
            if(o instanceof AuthenticationManager.LdapAuthenticationProvider){
                return (AuthenticationManager.LdapAuthenticationProvider)o;
            }
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
                    url.setAccess(interceptUrl.getAccess());
                    url.setRequiresChannel(interceptUrl.getRequiresChannel());
                    return;
                }
            }
        }
        objs.add(0, interceptUrl);
    }

    static void setPortMapping(Beans beans, String httpPort, String httpsPort) {
        List<Object> objs = getHttp(beans).getInterceptUrlOrAccessDeniedHandlerOrFormLogin();
        boolean mappingsExist = false;
        Http.PortMappings mappings = null;
        for (Object obj : objs) {
            if (obj instanceof Http.PortMappings) {
                mappingsExist = true;
                mappings = (Http.PortMappings) obj;
                for (Http.PortMappings.PortMapping mapping : mappings.getPortMapping()) {
                    if (mapping.getHttp().equals(httpPort)) {
                        mapping.setHttps(httpsPort);
                        return;
                    }
                }
                break;
            }
        }

        Http.PortMappings.PortMapping newMapping = new Http.PortMappings.PortMapping();
        newMapping.setHttp(httpPort);
        newMapping.setHttps(httpsPort);

        List<Http.PortMappings.PortMapping> portMappings;
        if (mappingsExist) {
            portMappings = mappings.getPortMapping();
            portMappings.add(newMapping);
        } else {
            mappings = new Http.PortMappings();
            portMappings = mappings.getPortMapping();
            portMappings.add(newMapping);
            objs.add(0, mappings);
        }
    }
}
