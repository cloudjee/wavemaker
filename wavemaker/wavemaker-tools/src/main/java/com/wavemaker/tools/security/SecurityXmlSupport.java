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

import com.wavemaker.tools.security.schema.*;
import com.wavemaker.tools.spring.beans.Beans;

/**
 * Helper class for handling security beans entities in project security config file
 * 
 * Provides access to security namespace elements given beans based security xml file
 * 
 * @author Ed Callahan
 */


public class SecurityXmlSupport {


	public static final String DEMO_AUTHMAN_ALIAS = "authenticationManagerDemo";

	public static final String DB_AUTHMAN_ALIAS = "authenticationManagerDB";


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
			List<AuthenticationManager.AuthenticationProvider> authProviderList = getAuthProviders(beans, DEMO_AUTHMAN_ALIAS);
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
			List<AuthenticationManager.AuthenticationProvider> authProviderList = getAuthProviders(beans, DEMO_AUTHMAN_ALIAS);
			for(AuthenticationManager.AuthenticationProvider authProvider : authProviderList){
				List<JAXBElement<?>> jeList = authProvider.getAnyUserServiceOrPasswordEncoder();
				for(JAXBElement<?> je : jeList){
					if(je.getDeclaredType().getName().equals("com.wavemaker.tools.security.schema.UserService"))
						userSvcOld = (UserService)je.getValue();
					userSvcOld = userSvc;
					return;
				}
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}

	static List<AuthenticationManager.AuthenticationProvider> getAuthProviders(Beans beans, String alias){
		List<AuthenticationManager.AuthenticationProvider> authProviderList  = new ArrayList<AuthenticationManager.AuthenticationProvider>();
		try{
			List<Object> authProviderOrLdapProviders =  Collections.emptyList();
			AuthenticationManager authMan = getAuthMan(beans,alias);
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
	 * @param secXmlFile the xml file to be parsed
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
}
