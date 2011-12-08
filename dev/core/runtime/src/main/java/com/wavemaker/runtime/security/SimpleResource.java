/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

/**
 * This class represents a simple string resource. The string "*" could be used to represent any resource string.
 * 
 * @author Frankie Fu
 */
public class SimpleResource implements Resource {

    private static final String ANY_RESOURCE = "*";

    private String resourceName;

    public SimpleResource() {
    }

    @Override
    public boolean matchResource(Resource resource) {
        if (resource instanceof SimpleResource) {
            if (getResourceName().equals(ANY_RESOURCE) || ((SimpleResource) resource).getResourceName().equals(ANY_RESOURCE)) {
                return true;
            }
            return this.getResourceName().equals(((SimpleResource) resource).getResourceName());
        } else {
            return false;
        }
    }

    public String getResourceName() {
        return this.resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

}
