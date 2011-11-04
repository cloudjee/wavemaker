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

package com.wavemaker.tools.service;

import java.io.File;

import com.wavemaker.common.util.ClassLoaderUtils;

/**
 * @author Simon Toens
 */
public class DefaultClassLoaderFactory implements ClassLoaderFactory {

    private final File[] paths;

    public DefaultClassLoaderFactory(File path) {
        this(new File[] { path });
    }

    public DefaultClassLoaderFactory(File... paths) {
        this.paths = paths;
    }

    @Override
    public ClassLoader getClassLoader() {
        return ClassLoaderUtils.getClassLoaderForFile(this.paths);
    }

}
