/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
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
