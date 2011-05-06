/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

import org.acegisecurity.ldap.DefaultInitialDirContextFactory;

import com.wavemaker.common.util.SystemUtils;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class PWEncryptedInitialDirContextFactory extends
        DefaultInitialDirContextFactory {

    /**
     * Create and initialize an instance to the LDAP url provided
     *
     * @param providerUrl a String of the form <code>ldap://localhost:389/base_dn<code>
     */
    public PWEncryptedInitialDirContextFactory(String providerUrl) {
        super(providerUrl);
    }

    /* (non-Javadoc)
     * @see org.acegisecurity.ldap.DefaultInitialDirContextFactory#setManagerPassword(java.lang.String)
     */
    public void setManagerPassword(String managerPassword) {
        // check if the password is encrypted, if so, decrypt it
        String pw = SystemUtils.isEncrypted(managerPassword) ? 
                SystemUtils.decrypt(managerPassword) : managerPassword;
        super.setManagerPassword(pw);
    }
}