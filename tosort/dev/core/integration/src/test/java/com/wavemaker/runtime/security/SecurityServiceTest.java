/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.fail;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;

import com.wavemaker.runtime.service.ServiceConstants;
import com.wavemaker.runtime.service.ServiceManager;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;
import com.wavemaker.runtime.test.TestSpringContextTestCase;

/**
 * Test for the Security Service.
 * 
 * @author Frankie Fu
 * @version $Rev:22673 $ - $Date:2008-05-30 14:45:46 -0700 (Fri, 30 May 2008) $
 * 
 */
public class TestSecurityService extends TestSpringContextTestCase {

    private SecurityService securityService;

    @Before
    public void setUp() {

        Object serviceMgrObj = getApplicationContext().getBean(ServiceConstants.SERVICE_MANAGER_NAME);
        ServiceManager serviceManager = (ServiceManager) serviceMgrObj;
        this.securityService = (SecurityService) ((ReflectServiceWire) serviceManager.getServiceWire("securityService")).getServiceBean();
    }

    @Test
    public void testGetUserName() throws Exception {
        this.securityService.authenticate("demo", "demo");
        assertEquals("demo", this.securityService.getUserId());
    }

    @Test
    public void testGetUserRoles() throws Exception {
        this.securityService.authenticate("demo", "demo");
        String[] userRoles = this.securityService.getUserRoles();
        assertEquals(1, userRoles.length);
        assertEquals("ROLE_Employee", userRoles[0]);
    }

    @Test
    public void testGetRoleMap() {
        Map<String, List<Rule>> roleMap = this.securityService.getRoleMap();
        assertNotNull(roleMap);
        Set<String> roleNames = roleMap.keySet();
        assertEquals(1, roleNames.size());
        List<Rule> rules = roleMap.get(roleNames.iterator().next());
        assertEquals(1, rules.size());
        assertEquals(2, rules.get(0).getResources().size());
    }

    @Test
    public void testAuthUsingValidCredential() {
        try {
            this.securityService.authenticate("demo", "demo");
        } catch (InvalidCredentialsException e) {
            fail("The credentials are valid, should not throw an exception here.");
        } catch (SecurityException e) {
            fail("The credentials are valid, should not throw an exception here.");
        }
    }

    @Test
    public void testAuthUsingInvalidCredential() {
        try {
            this.securityService.authenticate("demo", "xxx");
            fail("Expected InvalidCredentialsException.");
        } catch (InvalidCredentialsException e) {
            // expected exception
        } catch (SecurityException e) {
            fail("Expected InvalidCredentialsException.");
        }
    }

    @Test
    public void testLogout() throws Exception {
        this.securityService.authenticate("demo", "demo");
        assertNotNull(this.securityService.getUserId());
        this.securityService.logout();
        assertNull(this.securityService.getUserId());
    }

    @Test
    public void testIsAllowed1() {
        String roleName = "ROLE_Employee";
        String action = "visibility";
        Set<Resource> resources = new HashSet<Resource>();
        SimpleResource resource = new SimpleResource();
        resource.setResourceName("salaryWidget");
        resources.add(resource);
        assertEquals(false, this.securityService.isAllowed(roleName, resources, action));
    }

    @Test
    public void testIsAllowed2() {
        String roleName = "ROLE_Employee";
        String action = "visibility";
        Set<Resource> resources = new HashSet<Resource>();
        SimpleResource resource = new SimpleResource();
        resource.setResourceName("searchWidget");
        resources.add(resource);
        assertEquals(true, this.securityService.isAllowed(roleName, resources, action));
    }

    @Test
    public void testIsAllowed3() {
        String roleName = "ROLE_Employee";
        String action = "visibility";
        Set<Resource> resources = new HashSet<Resource>();
        SimpleResource resource = new SimpleResource();
        resource.setResourceName("salaryWidget");
        resources.add(resource);
        resource = new SimpleResource();
        resource.setResourceName("searchWidget");
        resources.add(resource);
        assertEquals(false, this.securityService.isAllowed(roleName, resources, action));
    }

    @Test
    public void testIsAllowed4() {
        String roleName = "ROLE_Manager";
        String action = "visibility";
        Set<Resource> resources = new HashSet<Resource>();
        SimpleResource resource = new SimpleResource();
        resource.setResourceName("salaryWidget");
        resources.add(resource);
        assertEquals(true, this.securityService.isAllowed(roleName, resources, action));
    }
}
