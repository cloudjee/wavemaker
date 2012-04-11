/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.data.spring;

import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.data.util.DataServiceConstants;

/**
 * @author Simon Toens
 */
public class WMPropertyPlaceholderConfigurer extends PropertyPlaceholderConfigurer {

    @Override
    protected String convertPropertyValue(String value) {
        if (SystemUtils.isEncrypted(value)) {
            return SystemUtils.decrypt(value);
        }

        // In case of HSQLDB, replace the web root token with the web application root path
        String path;
        if (value.contains(DataServiceConstants.WEB_ROOT_TOKEN)) {
            String appName = WMAppContext.getInstance().getAppName();
            if (appName.equals(DataServiceConstants.WAVEMAKER_STUDIO)) {
                path = (String) RuntimeAccess.getInstance().getSession().getAttribute(DataServiceConstants.CURRENT_PROJECT_APP_ROOT);
            } else {
                path = WMAppContext.getInstance().getAppContextRoot();
            }
            value = StringUtils.replacePlainStr(value, DataServiceConstants.WEB_ROOT_TOKEN, path);
        }
        return value;
    }
}
