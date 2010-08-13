/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.runtime.security;

import java.util.List;

import org.apache.log4j.Logger;
/**
 * The JOSSO Security Service provides interfaces to access authentication and
 * authorization information in the system when using JOSSO
 * 
 * @author Ed Callahan
 * @version $Rev: 26762 $ - $Date: 2009-06-23 10:54:57 -0700 (Wed, 23 June 2009) $
 * 
 */
public class JOSSOSecurityService {
  
    static final Logger logger = Logger.getLogger(JOSSOSecurityService.class);
       
    /**
    * Returns the user name of the principal in the current security context.
    * 
    * @return The user name.
    */
    public String getUserName() {
        System.out.println("\n*** Josso security feature is not avaliable in this package ***\n");
        return null;
    }

    /**
     * Returns the specified attribute from the session
     * @param name the attribute to be retrieved
     * @return the attributes value
     */

    public String getSessionAttributeName(String name){
        System.out.println("\n*** Josso security feature is not avaliable in this package ***\n");
        return null;
    }

    /**
     * Returns the names of all session attributes
     * @return the attribute names
     */
	public List<String> getSessionAttributeNames () {
        System.out.println("\n*** Josso security feature is not avaliable in this package ***\n");
        return null;
    }
	
	
	/**
	 * Returns the specified attribute from the request
	 * @param name The name of the attribute to be retrieved
	 * @return The attribute value
	 */

    public String getRequestAttributeName(String name){
        System.out.println("\n*** Josso security feature is not avaliable in this package ***\n");
        return null;
    }

    /**
     * Returns the names of all request attributes 
     * @return 
     */

	public List<String> getRequestAttributeNames () {
        System.out.println("\n*** Josso security feature is not avaliable in this package ***\n");
        return null;
    }
       

    
    /**
     * Checks whether the user has been authenticated.
     * 
     * @return true if the user was authenticated; otherwise, false.
     */
	
    public boolean isAuthenticated() {
    	System.out.println("\n*** Josso security feature is not avaliable in this package ***\n");
      	return false;
    } 
    
}       