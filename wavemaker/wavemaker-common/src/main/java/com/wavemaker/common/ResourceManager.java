/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

/**
 * Handles the logic for looking up values from resource bundles.
 * 
 * This class uses Spring's MesageSource, which is actually implemented by Spring's ApplicationContext. Therefore this
 * class is ApplicationContextAware and hence coupled to Spring.
 * 
 * @author Simon Toens
 */
public class ResourceManager {

    private static ResourceManager resourceManager = new ResourceManager();

    private final MessageSource messageSource;

    public static ResourceManager getInstance() {
        return resourceManager;
    }

    private ResourceManager() {
        this.messageSource = new ReloadableResourceBundleMessageSource();
        ((ReloadableResourceBundleMessageSource) this.messageSource).setBasename("wm_resource");
    }

    public String getMessage(String key) {
        return getMessage(key, (Object) null);
    }

    public String getMessage(String key, Object... args) {
        // passing null as default, so null is returned if msg can't be resolved
        return this.messageSource.getMessage(key, args, null, Locale.getDefault());
    }
}
