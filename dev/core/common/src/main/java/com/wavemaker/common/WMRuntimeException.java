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
 * @author Simon Toens
 */
@SuppressWarnings("serial")
public class WMRuntimeException extends RuntimeException {

    private final String detailedMessage;

    private final Integer msgId;

    public WMRuntimeException(MessageResource resource) {
        this(resource.getMessage(), resource.getDetailMessage(), resource.getId());
    }

    public WMRuntimeException(MessageResource resource, Throwable cause) {
        this(resource.getMessage(), resource.getDetailMessage(), resource.getId(), cause);
    }

    public WMRuntimeException(MessageResource resource, Object... args) {
        this(resource.getMessage(args), resource.getDetailMessage(args), resource.getId());
    }

    public WMRuntimeException(MessageResource resource, Throwable cause, Object... args) {
        this(resource.getMessage(args), resource.getDetailMessage(args), resource.getId(), cause);
    }

    public WMRuntimeException(String message) {
        this(message, (String) null);
    }

    public WMRuntimeException(String message, Throwable cause) {
        this(message, (String) null, cause);
    }

    public WMRuntimeException(String message, String detailedMessage) {
        this(message, detailedMessage, (Throwable) null);
    }

    public WMRuntimeException(String message, String detailedMessage, Integer msgId) {
        this(message, detailedMessage, msgId, (Throwable) null);
    }

    public WMRuntimeException(String message, String detailedMessage, Throwable cause) {
        this(message, detailedMessage, null, cause);
    }

    public WMRuntimeException(String message, String detailedMessage, Integer msgId, Throwable cause) {
        super(message, cause);
        this.detailedMessage = detailedMessage;
        this.msgId = msgId;
    }

    public WMRuntimeException(Throwable cause) {
        this((String) null, cause);
    }

    public String getDetailedMesage() {
        return this.detailedMessage;
    }

    public Integer getMessageId() {
        return this.msgId;
    }
}
