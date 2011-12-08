/*
 * Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
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
 

package com.wavemaker.studio.cloud;

import com.wavemaker.studio.clouddb.CloudDB;
import com.wavemaker.studio.clouddb.data.User;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.security.SecurityService;

/**
 * This is a client-facing service class. All public methods will be exposed to
 * the client. Their return values and parameters will be passed to the client
 * or taken from the client, respectively. This will be a singleton instance,
 * shared between all requests.
 */
public class UserService {

    private CloudDB clouddb;

    private SecurityService securityService;

    public UserService() {
	/*        clouddb = (CloudDB) RuntimeAccess.getInstance().getService(
		  CloudDB.class);*/
        clouddb = (CloudDB) RuntimeAccess.getInstance().getSpringBean(
                "CloudDB");
        securityService = (SecurityService) RuntimeAccess.getInstance()
                .getService(SecurityService.class);
    }

    public void changePassword(String oldPassword, String newPassword)
            throws Exception {
        String email = securityService.getUserId();
        if (email == null) {
            throw new Exception("No user found in session.");
        }
        User user = clouddb.getUserById(email);
        if (user.getPassword().equals(oldPassword)) {
            user.setPassword(newPassword);
            clouddb.update(user);
        } else {
            throw new Exception("Incorrect password.");
        }
    }

}
