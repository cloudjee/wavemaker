/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import org.acegisecurity.ui.webapp.AuthenticationProcessingFilter;

/**
 * Overrides standard Acegi filter's doFilter method, to
 * 
 * @author slee
 *
 */
public class WMAuthenticationProcessingFilter extends AuthenticationProcessingFilter {

    //public WMAuthenticationProcessingFilter() throws ServletException {
    //    super();
    //}

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException,
            ServletException {
        boolean designTime = false;
        Enumeration e = req.getParameterNames();
        while(e != null && e.hasMoreElements())
        {
            String name=(String)e.nextElement();
            if (name != null && name.equals("designTime")) {
                String [] values = req.getParameterValues(name);
                if (values != null && values.length > 0) {
                    designTime = values[0].equals("true");
                }
            }
        }

        if (designTime) {
            chain.doFilter(req, res);
        } else {
            super.doFilter(req, res, chain);
        }
    }

}
