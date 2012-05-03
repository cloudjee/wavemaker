/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.spinup.web;

import java.io.IOException;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ServletContextAware;

import com.wavemaker.tools.cloudfoundry.spinup.ApplicationDetails;
import com.wavemaker.tools.cloudfoundry.spinup.ApplicationNamingStrategy;
import com.wavemaker.tools.cloudfoundry.spinup.UsernameWithRandomApplicationNamingStrategy;

/**
 * {@link ApplicationNamingStrategy} for WaveMaker.
 */
@Component
public class WavemakeApplicationNamingStrategy extends UsernameWithRandomApplicationNamingStrategy implements ServletContextAware {

    private static final String APPLICATION_NAME = "wavemaker-studio";

    private VersionProvider versionProvider;

    private String version;

    @Override
    public void setServletContext(ServletContext servletContext) {
        try {
            this.version = this.versionProvider.getVersion(servletContext);
            this.version = this.version.replace(".", "_");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected String getApplicationName() {
        return APPLICATION_NAME + "-" + this.version;
    }

    @Override
    public boolean isMatch(ApplicationDetails applicationDetails) {
        return applicationDetails.getName().startsWith(APPLICATION_NAME);
    }

    @Override
    public boolean isUpgradeRequired(ApplicationDetails applicationDetails) {
        return !applicationDetails.getName().equals(getApplicationName());
    }

    @Autowired
    public void setVersionProvider(VersionProvider versionProvider) {
        this.versionProvider = versionProvider;
    }

}
