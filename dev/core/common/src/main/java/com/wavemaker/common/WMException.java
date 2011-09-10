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

package com.wavemaker.common;

/**
 * The root of ActiveGrid's checked Exception hierarchy.
 * 
 * @author Simon Toens
 * 
 */
public abstract class WMException extends Exception {
    
    private static final long serialVersionUID = 1L;
    
    private final String detailedMessage;
    
    public WMException(Throwable cause) {
        this((String)null, cause);
    }

    public WMException(String message) {
        this((String)message, (String)null);
    }

    public WMException(String message, Throwable cause) {
        this(message, (String) null, cause);
    }
    
    public WMException(String message, String detailedMessage) {
        this(message, detailedMessage, (Throwable)null);
    }
    
    public WMException(String message, String detailedMessage, Throwable cause) {
        super(message, cause);
        this.detailedMessage = detailedMessage;
    }

    public WMException(Resource resource) {
        this(resource.getMessage(), resource.getDetailMessage());
    }
    
    public WMException(Resource resource, Throwable cause) {
        this(resource.getMessage(), resource.getDetailMessage(), cause);
    }
    
    public WMException(Resource resource, Object... args) {
        this(resource.getMessage(args), resource.getDetailMessage(args));
    }
    
    public WMException(Resource resource, Throwable cause, Object... args) {
        this(resource.getMessage(args), resource.getDetailMessage(args), cause);
    }
    
    public String getDetailedMessage() {
        return detailedMessage;
    }
}
