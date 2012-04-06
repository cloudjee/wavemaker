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

package com.wavemaker.common.util;

import java.io.File;
import java.io.FilenameFilter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConstructorArgumentValues;
import org.springframework.beans.factory.config.RuntimeBeanReference;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.support.GenericApplicationContext;

import com.wavemaker.common.WMRuntimeException;

/**
 * @author Simon Toens
 */
public class SpringConfigBuilder {

    private final GenericApplicationContext ctx;

    private Bean previousBean = null;

    private Bean savedBean = null;

    private Bean currentBean = null;

    private final Map<Bean, String> knownBeans = new HashMap<Bean, String>();

    public SpringConfigBuilder() {
        this(SpringUtils.initSpringConfig());
    }

    public SpringConfigBuilder(GenericApplicationContext ctx) {
        this.ctx = ctx;
    }

    public Bean getCurrentBean() {
        if (this.currentBean == null) {
            throw new IllegalStateException("no current bean");
        }
        return this.currentBean;
    }

    public Bean getPreviousBean() {
        if (this.previousBean == null) {
            throw new IllegalStateException("no previous bean");
        }
        return this.previousBean;
    }

    public Bean getSavedBean() {
        if (this.savedBean == null) {
            throw new IllegalStateException("no saved bean");
        }
        return this.savedBean;
    }

    public Bean addBean(String beanName, String beanClass) {
        try {
            return addBean(beanName, Class.forName(beanClass));
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Bean addBean(String beanName, Class<?> beanClass) {
        this.previousBean = this.currentBean;
        RootBeanDefinition beanDefinition = new RootBeanDefinition(beanClass);

        beanDefinition.setScope(BeanDefinition.SCOPE_SINGLETON);
        beanDefinition.setLazyInit(true);

        this.ctx.registerBeanDefinition(beanName, beanDefinition);
        this.currentBean = new Bean(beanDefinition);
        this.knownBeans.put(this.currentBean, beanName);
        return this.currentBean;
    }

    public class Bean {

        private final RootBeanDefinition def;

        private final MutablePropertyValues props = new MutablePropertyValues();

        private final ConstructorArgumentValues ctorArgs = new ConstructorArgumentValues();

        private Bean(RootBeanDefinition def) {
            this.def = def;

            def.setPropertyValues(this.props);
            def.setConstructorArgumentValues(this.ctorArgs);
        }

        public Bean setLazyInit(boolean b) {
            this.def.setLazyInit(b);
            return this;
        }

        public Bean addConstructorArg(Object value) {
            if (value instanceof Bean) {
                RuntimeBeanReference ref = new RuntimeBeanReference(SpringConfigBuilder.this.knownBeans.get(value));
                value = ref;
            }

            this.ctorArgs.addGenericArgumentValue(value);

            return this;
        }

        public Bean addFiles(String name, String path) {
            return addFiles(name, path, new FilenameFilter() {

                @Override
                public boolean accept(File dir, String name) {
                    return true;
                }
            });
        }

        public Bean addFiles(String name, String path, FilenameFilter filter) {
            return addFiles(name, path, filter, path);
        }

        public Bean addFiles(String name, String path, FilenameFilter filter, String root) {
            String[] filenames = new File(path).list(filter);
            String[] paths = new String[filenames.length];
            for (int i = 0; i < filenames.length; i++) {
                paths[i] = root + "/" + filenames[i];
            }
            addProperty(name, paths);
            return this;
        }

        public Bean save() {
            SpringConfigBuilder.this.savedBean = this;
            return this;
        }

        public Bean addProperty(String name, Object value) {

            if (value instanceof Bean) {
                value = new RuntimeBeanReference(SpringConfigBuilder.this.knownBeans.get(value));
            }

            this.props.addPropertyValue(name, value);
            return this;
        }

        public RootBeanDefinition unwrap() {
            return this.def;
        }
    }

}
