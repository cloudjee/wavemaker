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

import org.acegisecurity.userdetails.UserDetails;
import org.acegisecurity.userdetails.UsernameNotFoundException;
import org.acegisecurity.userdetails.memory.InMemoryDaoImpl;
import org.acegisecurity.userdetails.memory.UserMap;
import org.springframework.dao.DataAccessException;
import com.wavemaker.runtime.WMAppContext;

/**
 * Created to set user name table so that getUserName() can return a proper value
 *  
 * @author slee
 *
 */
public class EnhancedInMemoryDaoImpl extends InMemoryDaoImpl {

    @Override
    public UserDetails loadUserByUsername(String username)
        throws UsernameNotFoundException, DataAccessException {
        UserMap userMap = super.getUserMap();

        UserDetails details = userMap.getUser(username);
        if (details != null) {
            WMAppContext.getInstance().setUserNameForUserID(username, username);
        }

        return details;
    }
}
