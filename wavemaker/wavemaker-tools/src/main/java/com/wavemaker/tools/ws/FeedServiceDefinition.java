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

package com.wavemaker.tools.ws;

import java.util.ArrayList;
import java.util.List;

import com.sun.syndication.feed.synd.SyndContent;
import com.sun.syndication.feed.synd.SyndImage;
import com.sun.syndication.feed.synd.SyndLink;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.type.TypeState;
import com.wavemaker.json.type.reflect.ReflectTypeState;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.ws.Entry;
import com.wavemaker.runtime.ws.Feed;
import com.wavemaker.runtime.ws.SyndFeedService;
import com.wavemaker.runtime.ws.WebServiceType;
import com.wavemaker.tools.javaservice.JavaServiceDefinition;

/**
 * Service definition for <code>SyndFeedService</code>.
 * 
 * @author Frankie Fu
 */
public class FeedServiceDefinition extends JavaServiceDefinition {

    public static final String FEED_SERVICE_NAME = "FeedService";

    private static final Class<?>[] ALL_TYPES = new Class[] { Feed.class, Entry.class, SyndLink.class, SyndContent.class, SyndImage.class };

    private String runtimeConfiguration;

    private final List<TypeDefinition> types;

    public FeedServiceDefinition() {
        super(SyndFeedService.class, FEED_SERVICE_NAME);
        // TODO: the following is a workaround for bug 1192
        TypeState typeState = new ReflectTypeState();
        this.types = new ArrayList<TypeDefinition>();
        for (Class<?> c : ALL_TYPES) {
            TypeDefinition ft = ReflectTypeUtils.getTypeDefinition(c, typeState, false);
            this.types.add(ft);
        }
    }

    @Override
    public ServiceType getServiceType() {
        return new WebServiceType();
    }

    @Override
    public List<TypeDefinition> getLocalTypes() {
        return this.types;
    }

    @Override
    public List<TypeDefinition> getLocalTypes(String username, String password) { // salesforce
        return null;
    }

    @Override
    public String getRuntimeConfiguration() {
        return this.runtimeConfiguration;
    }

    public void setRuntimeConfiguration(String runtimeConfiguration) {
        this.runtimeConfiguration = runtimeConfiguration;
    }
}
