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

//import org.hibernate.validator.constraints.NotEmpty;

import com.wavemaker.tools.cloudfoundry.spinup.authentication.LoginCredentials;

/**
 * Data holder used to collect {@link LoginCredentials}.
 */
public class LoginCredentialsBean implements LoginCredentials {

//    @NotEmpty
    private String username;

//    @NotEmpty
    private String password;

	public LoginCredentialsBean(String username, String password){
		this.username = username;
		this.password = password;
	}
	
	
//    @Override
    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
