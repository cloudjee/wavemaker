/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class GeneralOptions {

    public static final String DEMO_TYPE = "Demo";

    public static final String DATABASE_TYPE = "Database";

    public static final String LDAP_TYPE = "LDAP";

    private boolean enforceSecurity;

    private boolean enforceIndexHtml;

    private String dataSourceType;

    public boolean isEnforceSecurity() {
        return enforceSecurity;
    }

    public void setEnforceSecurity(boolean enforceSecurity) {
        this.enforceSecurity = enforceSecurity;
    }

    public boolean isEnforceIndexHtml() {
        return enforceIndexHtml;
    }

    public void setEnforceIndexHtml(boolean enforceIndexHtml) {
        this.enforceIndexHtml = enforceIndexHtml;
    }

    public String getDataSourceType() {
        return dataSourceType;
    }

    public void setDataSourceType(String dataSourceType) {
        this.dataSourceType = dataSourceType;
    }

}
