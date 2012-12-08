/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.StringTokenizer;

import javax.annotation.security.RolesAllowed;

import com.wavemaker.tools.security.schema.UserService;

/**
 * @author Ed Callahan
 * @author Frankie Fu
 */
public class DemoOptions {

    private List<DemoUser> users;

    public List<DemoUser> getUsers() {
        if (this.users == null) {
            return Collections.emptyList();
        }
        return this.users;
    }
    
    /*
     * setUsers list of DemoUsers from list of UserService Users
     */
    public void setUsersByUserSvc(List<UserService.User> users) {
    	List<DemoUser> newUsers = new ArrayList<DemoUser>();
    	for(UserService.User u : users){
    		DemoUser user = new DemoUser();
    		List<String> roles = new ArrayList<String>();
    		user.setUserid(u.getName());
    		user.setPassword(u.getPassword());
    		StringTokenizer tokenizer = new StringTokenizer(u.getAuthorities(), ",");
    		while(tokenizer.hasMoreTokens()){
    			roles.add(tokenizer.nextToken());
    		}
    		user.setRoles(roles);
    		newUsers.add(user);
    	}
    	setUsers(newUsers);
    }
    public void setUsers(List<DemoUser> users) {
        this.users = users;
    }
}
