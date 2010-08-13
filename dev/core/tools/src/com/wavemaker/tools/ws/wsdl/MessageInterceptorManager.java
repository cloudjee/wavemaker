/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.ws.wsdl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Provides interfaces to access message interceptors.  Message interceptors
 * are used to plug in to the Web Service runtime to do additional processing
 * of the inbound and outbound messages.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class MessageInterceptorManager {

    private Map<String, List<String>> interceptorMap;

    private static MessageInterceptorManager instance;

    private MessageInterceptorManager() {
        interceptorMap = new HashMap<String, List<String>>();
    }

    public static synchronized MessageInterceptorManager getInstance() {
        if (instance == null) {
            instance = new MessageInterceptorManager();
        }
        return instance;
    }

    /**
     * Returns a list of message interceptor class names for the specified
     * service ID.
     * 
     * @param serviceId The service ID.
     * @return A list of message interceptor class names.  This may return null.
     */
    public List<String> getInterceptorClassNames(String serviceId) {
        return interceptorMap.get(serviceId);
    }

    public Map<String, List<String>> getInterceptorMap() {
        return interceptorMap;
    }

    public void setInterceptorClassNames(String serviceId,
            List<String> classNames) {
        interceptorMap.put(serviceId, classNames);
    }

    public void setInterceptorMap(Map<String, List<String>> interceptorMap) {
        this.interceptorMap = interceptorMap;
    }

}
