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

package com.wavemaker.runtime.security;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;

/**
 * The JOSSO Security Service provides interfaces to access authentication and authorization information in the system
 * when using JOSSO
 * 
 * @author Ed Callahan
 */
@HideFromClient
public class JOSSOSecurityService {

    static final Logger logger = Logger.getLogger(JOSSOSecurityService.class);

    /**
     * Returns the user name of the principal in the current security context.
     * 
     * @return The user name.
     */
    @ExposeToClient
    public String getUserName() {
        HttpServletRequest req = RuntimeAccess.getInstance().getRequest();
        if (req != null & this.isAuthenticated()) {
            return req.getUserPrincipal().getName();
        }
        return null;
    }

    /**
     * Returns the specified attribute from the session
     * 
     * @param name the attribute to be retrieved
     * @return the attributes value
     */

    @ExposeToClient
    public String getSessionAttributeName(String name) {
        HttpSession sess = RuntimeAccess.getInstance().getSession();
        if (sess != null) {
            Object value = sess.getAttribute(name);
            return value.toString();
        }
        return null;
    }

    /**
     * Returns the names of all session attributes
     * 
     * @return the attribute names
     */
    @SuppressWarnings("unchecked")
    @ExposeToClient
    public List<String> getSessionAttributeNames() {
        List<String> result = new ArrayList<String>();
        HttpSession sess = RuntimeAccess.getInstance().getSession();
        if (sess != null) {
            Enumeration Attributes = sess.getAttributeNames();
            for (; Attributes.hasMoreElements();) {
                String name = (String) Attributes.nextElement();
                result.add(name);
            }
            return result;
        }
        return null;
    }

    /**
     * Returns the specified attribute from the request
     * 
     * @param name The name of the attribute to be retrieved
     * @return The attribute value
     */

    @ExposeToClient
    public String getRequestAttributeName(String name) {
        HttpServletRequest req = RuntimeAccess.getInstance().getRequest();
        if (req != null) {
            Object value = req.getAttribute(name);
            return value.toString();
        }
        return null;
    }

    /**
     * Returns the names of all request attributes
     * 
     * @return
     */

    @SuppressWarnings("unchecked")
    @ExposeToClient
    public List<String> getRequestAttributeNames() {
        List<String> result = new ArrayList<String>();
        HttpServletRequest req = RuntimeAccess.getInstance().getRequest();
        if (req != null) {
            Enumeration Attributes = req.getAttributeNames();
            for (; Attributes.hasMoreElements();) {
                String name = (String) Attributes.nextElement();
                result.add(name);
            }
            return result;
        }
        return null;
    }

    /**
     * Checks whether the user has been authenticated.
     * 
     * @return true if the user was authenticated; otherwise, false.
     */

    @HideFromClient
    public boolean isAuthenticated() {

        HttpServletRequest req = RuntimeAccess.getInstance().getRequest();
        if (req != null) {
            return req.getUserPrincipal() != null;
        }
        return false;
    }

}