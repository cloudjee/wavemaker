/*
 * Copyright (C) 2011 VMWare, Inc. All rights reserved.
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

/**
 * 
 */

package com.wavemaker.desktop.launcher;

/**
 * @author rj
 */
public class InvalidServerConfigurationException extends Exception {

    // Constants
    private static final long serialVersionUID = 155181345858558693L;

    public static enum Parameter {
        SERIVCE_PORT, SHUTDOWN_PORT
    };

    // Variables
    // members
    protected Parameter parameter;

    /** Construction\Destruction */
    public InvalidServerConfigurationException(Parameter parameter, String message) {
        super(message);
        this.parameter = parameter;
    }

    public InvalidServerConfigurationException(Parameter parameter, String message, Throwable cause) {
        super(message, cause);
    }

    /** Instance Methods */
    public Parameter getParameter() {
        return this.parameter;
    }
}
