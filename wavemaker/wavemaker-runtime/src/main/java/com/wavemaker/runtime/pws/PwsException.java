/*
 * Copyright (C) 2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.pws;

/**
 * Exception class for Partner Web Service module
 * 
 * @author Seung Lee
 */
public class PwsException extends RuntimeException {

    private static final long serialVersionUID = -1079899189574588869L;

    private String reason;

    /**
     * constructor
     * 
     * @param ex exception object
     */
    public PwsException(Exception ex) {
        super(ex);
    }

    /**
     * constructor
     * 
     * @param message exception message
     * @param reason exception code
     */
    public PwsException(String message, String reason) {
        super("PWS Error: " + message);
        this.reason = reason;
    }

    /**
     * Returns the reason code
     * 
     * @return the reason code
     */
    public String getReason() {
        return this.reason;
    }

    /**
     * Sets the reason code
     * 
     * @param reason reason code
     */
    public void setReason(String reason) {
        this.reason = reason;
    }
}
