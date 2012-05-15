/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.util;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.Arrays;
import java.util.concurrent.Callable;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourceURL;

/**
 * Class Loader Utils specifically designed to work with {@link com.wavemaker.tools.io.Resource}s. Migrated from
 * {@link ClassLoaderUtils} in the common project for dependency reasons.
 */
public class ResourceClassLoaderUtils {

    public static ClassLoader getClassLoaderForResources(Resource... resources) {
        return getClassLoaderForResources(ClassLoaderUtils.getClassLoader(), resources);
    }

    public static ClassLoader getClassLoaderForResources(ClassLoader parent, Resource... resources) {
        try {
            final ClassLoader parentF = parent;
            final URL[] urls = ResourceURL.getForResources(Arrays.asList(resources)).toArray(new URL[resources.length]);

            URLClassLoader ret = AccessController.doPrivileged(new PrivilegedAction<URLClassLoader>() {

                @Override
                public URLClassLoader run() {
                    return new URLClassLoader(urls, parentF);
                }
            });
            return ret;
        } catch (MalformedURLException ex) {
            throw new AssertionError(ex);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public static void runInClassLoaderContext(Runnable runnable, Folder... folders) {
        runInClassLoaderContext(asCallable(runnable), getClassLoaderForResources(folders));
    }

    public static <V> V runInClassLoaderContext(Callable<V> callable, Folder... folders) {
        return runInClassLoaderContext(callable, getClassLoaderForResources(folders));
    }

    public static void runInClassLoaderContext(Runnable runnable, ClassLoader cl) {
        runInClassLoaderContext(asCallable(runnable), cl);
    }

    public static <V> V runInClassLoaderContext(Callable<V> task, ClassLoader cl) {
        ClassLoader c = Thread.currentThread().getContextClassLoader();
        try {
            Thread.currentThread().setContextClassLoader(cl);
            return task.call();
        } catch (Exception e) {
            if (e instanceof RuntimeException) {
                throw (RuntimeException) e;
            }
            throw new IllegalStateException(e);
        } finally {
            Thread.currentThread().setContextClassLoader(c);
        }
    }

    private static Callable<Object> asCallable(final Runnable runnable) {
        return new Callable<Object>() {

            @Override
            public Object call() throws Exception {
                runnable.run();
                return null;
            }
        };
    }

}
