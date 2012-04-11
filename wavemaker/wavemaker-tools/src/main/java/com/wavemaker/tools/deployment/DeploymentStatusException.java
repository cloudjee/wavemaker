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

package com.wavemaker.tools.deployment;

/**
 * Exception thrown to indicate a status failure. Provides a means to return {@link #getStatusMessage() status message}
 * Strings to clients. Ideally this class should be removed and service calls should throw exceptions directly.
 * 
 * @author Phillip Webb
 */
public class DeploymentStatusException extends Exception {

    private static final long serialVersionUID = 1L;

    public DeploymentStatusException(String message) {
        super(message);
    }

    public DeploymentStatusException(String message, Throwable cause) {
        super(message, cause);
    }

    public String getStatusMessage() {
        return getMessage();
    }

}
