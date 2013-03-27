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

import java.util.*;
import java.util.List;

import javax.xml.bind.JAXBElement;

import com.wavemaker.tools.spring.beans.*;
import org.springframework.util.Assert;

import com.wavemaker.tools.security.schema.*;

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

	public static void setUserSvcUsers(Beans beans, List<UserService.User> demoUsersNew){
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

	static public void setActiveAuthMan(Beans beans, String alias){
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

    static List<CustomFilter>getCustomFilters(Beans beans) {
        return getCustomFilters(getHttp(beans));
    }

    static List<CustomFilter>getCustomFilters(Http http) {
        List<Object> objs = http.getInterceptUrlOrAccessDeniedHandlerOrFormLogin();
        List<CustomFilter> customFilters = new ArrayList<CustomFilter>();
        for (Object obj : objs) {
            if (obj instanceof CustomFilter) {
                customFilters.add((CustomFilter) obj);
            }
        }

        return customFilters;
    }

    static void setCustomFilters(Beans beans, List<CustomFilter> customFilters) {
        for (CustomFilter customFilter : customFilters) {
            setCustomFilter(beans, customFilter);
        }
    }

    static void setCustomFilter(Beans beans, CustomFilter customFilter) {
        List<Object> objs = getHttp(beans).getInterceptUrlOrAccessDeniedHandlerOrFormLogin();
        for (Object obj : objs) {
            if (obj instanceof CustomFilter) {
                CustomFilter filter = (CustomFilter) obj;
                if (customFilter.getRef().equals(filter.getRef())) {
                    filter.setBefore(customFilter.getBefore());
                    filter.setPosition(customFilter.getPosition());
                    filter.setAfter(customFilter.getAfter());
                    return;
                }
            }
        }
        objs.add(0, customFilter);
    }

    static CustomFilter removeCustomFilter(Beans beans, CustomFilter customFilter){
        List<Object> objs = getHttp(beans).getInterceptUrlOrAccessDeniedHandlerOrFormLogin();
        for (Object obj : objs) {
            if (obj instanceof CustomFilter) {
                CustomFilter filter = (CustomFilter) obj;
                // May need a more complex lookup, but this will do for now...
                if (customFilter.getRef().equals(filter.getRef())) {
                    objs.remove(obj);
                    return filter;
                }
            }
        }
        return null;
    }

    static Http.Logout getLogout(Beans beans) {
        return getLogout(getHttp(beans));
    }

    static Http.Logout getLogout(Http http) {
        Http.Logout logout = null;
        List<Object> objs = http.getInterceptUrlOrAccessDeniedHandlerOrFormLogin();
        for (Object obj : objs) {
            if (obj instanceof Http.Logout) {
                logout = (Http.Logout) obj;
                break;
            }
        }
        return logout;
    }

    static void setLogout(Beans beans, Http.Logout logout) {
        Http.Logout lo = getLogout(beans);
        List<Object> objs = getHttp(beans).getInterceptUrlOrAccessDeniedHandlerOrFormLogin();
        if (lo != null)
            objs.remove(lo);
        if (logout != null)
            objs.add(logout);
    }

    static void setPortMapping(Beans beans, boolean useSSL, String httpPort, String httpsPort) {
        List<Object> objs = getHttp(beans).getInterceptUrlOrAccessDeniedHandlerOrFormLogin();
        boolean mappingsExist = false;
        boolean portMappingFound = false;
        List<Http.PortMappings.PortMapping> mappingList = null;
        List<Http.PortMappings.PortMapping> newMappingList = null;
        Http.PortMappings mappings = null;
        for (Object obj : objs) {
            if (obj instanceof Http.PortMappings) {
                mappingsExist = true;
                mappings = (Http.PortMappings) obj;
                mappingList = mappings.getPortMapping();
                newMappingList = new ArrayList<Http.PortMappings.PortMapping>(mappingList);
                for (Http.PortMappings.PortMapping mapping : mappingList) {
                    if (mapping.getHttp().equals(httpPort)) {
                        portMappingFound = true;
                        if (useSSL) {
                            mapping.setHttps(httpsPort);
                            return;
                        } else {
                            newMappingList.remove(mapping);
                            break;
                        }
                    }
                }
                break;
            }
        }

        if (portMappingFound) {
            mappingList.remove(mappingList.size()-1);
            Collections.copy(mappingList, newMappingList);
            if (mappingList.size() == 0) {
                objs.remove(mappings);
            }
            return;
        }

        if (useSSL) {
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

    /*
     * Delete all existing port mapping info and re-create a single mapping line using the port info passed in.
     * This method is mostly used to configure the SSL port mapping info when deploying an application.
     */
    static void recreatePortMapping(Beans beans, String httpPort, String httpsPort) {
        List<Object> objs = getHttp(beans).getInterceptUrlOrAccessDeniedHandlerOrFormLogin();
        boolean mappingsExist = false;
        boolean portMappingFound = false;
        List<Http.PortMappings.PortMapping> mappingList = null;
        List<Http.PortMappings.PortMapping> newMappingList = null;
        Http.PortMappings mappings = null;
        for (Object obj : objs) {
            if (obj instanceof Http.PortMappings) {
                mappingsExist = true;
                mappings = (Http.PortMappings) obj;
                mappingList = mappings.getPortMapping();
                break;
            }
        }

        if (mappingsExist) {
            objs.remove(mappings);
        }

        if(!httpPort.equals("0") && !httpsPort.equals("0")){
        	Http.PortMappings.PortMapping newMapping = new Http.PortMappings.PortMapping();
        	newMapping.setHttp(httpPort);
        	newMapping.setHttps(httpsPort);

        	List<Http.PortMappings.PortMapping> portMappings;

        	mappings = new Http.PortMappings();
        	portMappings = mappings.getPortMapping();
        	portMappings.add(newMapping);
        	objs.add(0, mappings);
        }
    }

    static Http.PortMappings.PortMapping getPortMapping(Beans beans, String httpPort) {
        List<Object> objs = getHttp(beans).getInterceptUrlOrAccessDeniedHandlerOrFormLogin();
        Http.PortMappings mappings = null;
        for (Object obj : objs) {
            if (obj instanceof Http.PortMappings) {
                mappings = (Http.PortMappings) obj;
                for (Http.PortMappings.PortMapping mapping : mappings.getPortMapping()) {
                    if (mapping.getHttp().equals(httpPort)) {
                        return mapping;
                    }
                }
            }
        }
        return null;
    }
    /*
     * When there are multiple lines of port mapping defined in the project-security.xml, get the first mapping.
     *
     */
    static Http.PortMappings.PortMapping getFirstPortMapping(Beans beans) {
        List<Object> objs = getHttp(beans).getInterceptUrlOrAccessDeniedHandlerOrFormLogin();
        Http.PortMappings mappings = null;
        for (Object obj : objs) {
            if (obj instanceof Http.PortMappings) {
                mappings = (Http.PortMappings) obj;
                return mappings.getPortMapping().get(0);
            }
        }
        return null;
    }
}
