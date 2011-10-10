/*
 * Copyright (C) 2007-2008 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.wavemaker.studio;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;

import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.security.DemoOptions;
import com.wavemaker.tools.security.DemoUser;
import com.wavemaker.tools.security.GeneralOptions;
import com.wavemaker.tools.security.LDAPOptions;
import com.wavemaker.tools.security.SecurityServiceDefinition;
import com.wavemaker.tools.service.DesignServiceManager;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class TestSecurityConfigService extends StudioTestCase {

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        makeProject(getClass().getName());
    }

    @Test
    public void testDemoConfig() throws Exception {
        List<DemoUser> demoUsers = new ArrayList<DemoUser>();
        DemoUser u = new DemoUser();
        u.setUserid("demo");
        u.setPassword("demo");
        List<String> roles = new ArrayList<String>();
        roles.add("manager");
        u.setRoles(roles);
        demoUsers.add(u);

        invokeService_toObject("securityConfigService", "configDemo", new Object[] { demoUsers, Boolean.TRUE, Boolean.TRUE });

        Object o = invokeService_toObject("securityConfigService", "getDemoOptions", null);

        DemoOptions options = (DemoOptions) o;
        assertEquals(1, options.getUsers().size());
        DemoUser user = options.getUsers().get(0);
        assertEquals("demo", user.getUserid());
        assertEquals("demo", user.getPassword());
        List<String> retRoles = user.getRoles();
        assertEquals(1, retRoles.size());
        assertEquals("manager", retRoles.get(0));

        DesignServiceManager dsm = (DesignServiceManager) getApplicationContext().getBean("designServiceManager");
        Set<String> serviceIds = dsm.getServiceIds();
        assertTrue("configDemo() should have added securityService to the project", serviceIds.contains(SecurityServiceDefinition.DEFAULT_SERVICE_ID));
    }

    @Test
    public void testLDAPConfig() throws Exception {
        String ldapUrl = "ldap://localhost:389";
        String managerDn = "cn=manager,dc=root";
        String managerPassword = "manager";
        String userDnPattern = "uid={0},ou=people,dc=root";
        boolean groupSearchDisabled = false;
        String groupSearchBase = "ou=groups,dc=root";
        String groupRoleAttribute = "cn";
        String groupSearchFilter = "(member={0})";

        invokeService_toObject("securityConfigService", "configLDAP", new Object[] { ldapUrl, managerDn, managerPassword, userDnPattern,
            groupSearchDisabled, groupSearchBase, groupRoleAttribute, groupSearchFilter, Boolean.TRUE, Boolean.TRUE });

        Object o = invokeService_toObject("securityConfigService", "getLDAPOptions", null);

        LDAPOptions options = (LDAPOptions) o;
        assertEquals(ldapUrl, options.getLdapUrl());
        assertEquals(managerDn, options.getManagerDn());
        assertEquals(managerPassword, SystemUtils.decrypt(options.getManagerPassword()));
        assertEquals(userDnPattern, options.getUserDnPattern());
        assertEquals(groupSearchDisabled, options.isGroupSearchDisabled());
        assertEquals(groupSearchBase, options.getGroupSearchBase());
        assertEquals(groupRoleAttribute, options.getGroupRoleAttribute());
        assertEquals(groupSearchFilter, options.getGroupSearchFilter());

        DesignServiceManager dsm = (DesignServiceManager) getApplicationContext().getBean("designServiceManager");
        Set<String> serviceIds = dsm.getServiceIds();
        assertTrue("configLDAP() should have added securityService to the project", serviceIds.contains(SecurityServiceDefinition.DEFAULT_SERVICE_ID));
    }

    @Test
    public void testGetGeneralOptions() throws Exception {
        List<DemoUser> demoUsers = new ArrayList<DemoUser>();
        DemoUser u = new DemoUser();
        u.setUserid("demo");
        u.setPassword("demo");
        demoUsers.add(u);

        invokeService_toObject("securityConfigService", "configDemo", new Object[] { demoUsers, Boolean.TRUE, Boolean.TRUE });

        Object o = invokeService_toObject("securityConfigService", "getGeneralOptions", null);

        assertTrue(o instanceof GeneralOptions);
        GeneralOptions options = (GeneralOptions) o;
        assertEquals("Demo", options.getDataSourceType());
        assertTrue(options.isEnforceSecurity());
    }

    @Test
    public void testGetGeneralOptionsNonExist() throws Exception {
        Object o = invokeService_toObject("securityConfigService", "getGeneralOptions", null);
        assertNull(o);
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testSetGetRoles() throws Exception {
        List<String> roles = new ArrayList<String>();
        roles.add("manager");
        roles.add("hr");
        invokeService_toObject("securityConfigService", "setRoles", new Object[] { roles });

        Object o = invokeService_toObject("securityConfigService", "getRoles", null);

        assertTrue(o instanceof List);
        List<String> retRoles = (List<String>) o;
        assertEquals(2, retRoles.size());
        for (String r : retRoles) {
            assertTrue(roles.contains(r));
        }
    }
}
