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

import org.acegisecurity.AccessDeniedException;
import org.acegisecurity.Authentication;
import org.acegisecurity.BadCredentialsException;
import org.acegisecurity.DisabledException;
import org.acegisecurity.context.SecurityContextHolder;
import org.acegisecurity.context.SecurityContextImpl;
import org.acegisecurity.providers.AuthenticationProvider;
import org.acegisecurity.providers.UsernamePasswordAuthenticationToken;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.wavemaker.infra.WMTestCase;

/**
 * 
 * @author Frankie Fu
 */
public class MethodAccessControlTest extends WMTestCase {

    private static ApplicationContext ctx = new ClassPathXmlApplicationContext("com/wavemaker/runtime/security/security-test1.xml");

    private static void createSecureContext(final ApplicationContext ctx, final String username, final String password) {
        AuthenticationProvider provider = (AuthenticationProvider) ctx.getBean("authenticationProvider");
        Authentication auth = provider.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Override
    public void tearDown() {
        // clear the security context after each test.
        SecurityContextHolder.setContext(new SecurityContextImpl());
    }

    public void testManagerAccessForSet() {
        createSecureContext(ctx, "manager", "manager");
        ((Book) ctx.getBean("book")).setValue(100);
    }

    public void testWorkerAccessForSet() {
        createSecureContext(ctx, "worker", "worker");
        try {
            ((Book) ctx.getBean("book")).setValue(100);
            fail("Expected AccessDeniedException.");
        } catch (AccessDeniedException e) {
            // do nothing.
        }
    }

    public void testAnonymousAccessForSet() {
        createSecureContext(ctx, "anonymous", "anonymous");
        try {
            ((Book) ctx.getBean("book")).setValue(100);
            fail("Expected AccessDeniedException.");
        } catch (AccessDeniedException e) {
            // do nothing.
        }
    }

    public void testManagerAccessForChange() {
        createSecureContext(ctx, "manager", "manager");
        ((Book) ctx.getBean("book")).changeValue(100);
    }

    public void testWorkerAccessForChange() {
        createSecureContext(ctx, "worker", "worker");
        ((Book) ctx.getBean("book")).changeValue(100);
    }

    public void testAnonymousAccessForChange() {
        createSecureContext(ctx, "anonymous", "anonymous");
        try {
            ((Book) ctx.getBean("book")).changeValue(100);
            fail("Expected AccessDeniedException.");
        } catch (AccessDeniedException e) {
            // do nothing.
        }
    }

    public void testManagerAccessForGet() {
        createSecureContext(ctx, "manager", "manager");
        ((Book) ctx.getBean("book")).getValue();
    }

    public void testWorkerAccessForGet() {
        createSecureContext(ctx, "worker", "worker");
        ((Book) ctx.getBean("book")).getValue();
    }

    public void testAnonymousAccessForGet() {
        createSecureContext(ctx, "anonymous", "anonymous");
        ((Book) ctx.getBean("book")).getValue();
    }

    public void testDisabledUser() {
        try {
            createSecureContext(ctx, "disabled", "disabled");
            fail("Expected DisabledException.");
        } catch (DisabledException e) {
            // do nothing.
        }
    }

    public void testUnknownUser() {
        try {
            createSecureContext(ctx, "unknown", "unknown");
            fail("Expected BadCredentialsException.");
        } catch (BadCredentialsException e) {
            // do nothing.
        }
    }

}
