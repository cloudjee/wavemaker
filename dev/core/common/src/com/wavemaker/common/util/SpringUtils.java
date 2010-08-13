/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.wavemaker.common.util;


import java.io.File;

import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;


/**
 * Helper methods for initializing and configuring Spring.
 * 
 * @author Simon Toens
 * 
 */
public class SpringUtils {
    
    public static final String VALUE_ELEMENT = "value";

    private SpringUtils() {
        throw new UnsupportedOperationException();
    }

    public static Object getRuntimeBean(File webAppRoot, String beanName) {
        GenericApplicationContext ctx = new GenericApplicationContext();
        XmlBeanDefinitionReader xmlReader = new XmlBeanDefinitionReader(ctx);
        File f = new File(webAppRoot, "WEB-INF/project-springapp.xml");
        xmlReader.loadBeanDefinitions(new FileSystemResource(f));
        ctx.refresh();
        return ctx.getBean(beanName);
    }

    /**
     * Initializes Spring with config.xml. Statically initializes
     * com.wavemaker.common.ResourceManager, used for msg lookup.
     * 
     * When runnung outside of a webapp container, this method needs to run 
     * once at startup before accessing Resources defined in 
     * com.wavemaker.common.Resource.
     */
    public static GenericApplicationContext initSpringConfig() {
        return initSpringConfig(true);
    }
    
    public static Object getBean(File cfg, String beanName) {
        return getBean(new FileSystemResource(cfg), beanName);
    }

    public static Object getBean(String cfg, String beanName) {
        return getBean(new ClassPathResource(cfg), beanName);
    }
    
    public static Object getBean(Resource resource, String beanName) {
        GenericApplicationContext ctx = initSpringConfig(false);
        XmlBeanDefinitionReader xmlReader = new XmlBeanDefinitionReader(ctx);
        xmlReader.loadBeanDefinitions(resource);
        ctx.refresh();
        return ctx.getBean(beanName);
    }
    
    private static GenericApplicationContext initSpringConfig(boolean refresh) 
    {
        GenericApplicationContext ctx = new GenericApplicationContext();
        XmlBeanDefinitionReader xmlReader = new XmlBeanDefinitionReader(ctx);
        xmlReader.loadBeanDefinitions(new ClassPathResource(
                "config.xml"));

        if (refresh) {
            ctx.refresh();
        }

        return ctx;
    }

    public static void throwSpringNotInitializedError(
        Class<?> uninitializedBean) 
    {
        throw new AssertionError("Spring has not initialized "
                + uninitializedBean.getName());
    }

}
