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

package com.wavemaker.common.util;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.Arrays;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 * 
 */
public class ClassLoaderUtils {

    private ClassLoaderUtils() {
    }

    /**
     * Loads class specified by className from the ContextClassLoader.
     */
    public static Class<?> loadClass(String className) {
        return loadClass(className, getClassLoader());
    }

    /**
     * Loads class specified by className from the ContextClassLoader.
     */
    public static Class<?> loadClass(String className, boolean initialize) {
        return loadClass(className, initialize, getClassLoader());
    }

    /**
     * Loads class specified by className, using passed ClassLoader, and initializing the class.
     */
    public static Class<?> loadClass(String className, ClassLoader loader) {
        return loadClass(className, true, loader);
    }

    /**
     * Loads class specified by className, using passed ClassLoader.
     */
    public static Class<?> loadClass(String className, boolean initialize, ClassLoader loader) {
        try {
            Class<?> rtn = TypeConversionUtils.primitiveForName(className);
            if (rtn == null) {
                // On Windows, if the class has been loaded from a jar, this
                // may hold an open reference to the jar.
                rtn = Class.forName(className, initialize, loader);
            }
            return rtn;
        } catch (ClassNotFoundException ex) {
            String s = ex.getMessage();
            if (s == null || s.equals("")) {
                s = "Cannot find class " + className;
            }
            throw new WMRuntimeException(s, ex);
        }
    }

    /**
     * Returns the context ClassLoader.
     */
    public static ClassLoader getClassLoader() {
        return Thread.currentThread().getContextClassLoader();
    }

    /**
     * Returns path to resource, loaded from classpath.
     * 
     * @param path The relative path to the resource.
     * @return Path on disk to the resource, or null if not found.
     */
    public static String getResource(String path) {
        URL url = ClassLoaderUtils.getClassLoader().getResource(path);
        if (url == null) {
            return null;
        }
        return url.toString();
    }

    public static InputStream getResourceAsStream(String path) {
        return getClassLoader().getResourceAsStream(path);
    }

    public static InputStream getResourceAsStream(String path, ClassLoader cl) {
        return cl.getResourceAsStream(path);
    }

    public static ClassLoader getClassLoaderForResources(Resource... files) {
        return getClassLoaderForResources(getClassLoader(), files);
    }

    /**
     * @deprecated - use {@link #getClassLoaderForResources(Resource...)}
     */
    @Deprecated
    public static ClassLoader getClassLoaderForFile(java.io.File... files) {
        return getClassLoaderForResources(getClassLoader(),
            ConversionUtils.convertToResourceList(Arrays.asList(files)).toArray(new Resource[files.length]));
    }

    public static ClassLoader getClassLoaderForResources(ClassLoader parent, Resource... files) {
        try {
            final ClassLoader parentF = parent;
            final URL[] urls = new URL[files.length];
            for (int i = 0; i < files.length; i++) {
                urls[i] = files[i].getURL();
            }

            URLClassLoader ret = AccessController.doPrivileged(new PrivilegedAction<URLClassLoader>() {

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

    public static ClassLoader getClassLoaderForFile(ClassLoader parent, java.io.File... files) {
        return getClassLoaderForResources(parent, ConversionUtils.convertToResourceList(Arrays.asList(files)).toArray(new Resource[files.length]));
    }

    /**
     * Get a temporary classloader. By default, this will use the parent classloader as a base.
     * 
     * @param files
     * @return
     */
    public static ClassLoader getTempClassLoaderForResources(Resource... files) {

        final List<Resource> filesList = Arrays.asList(files);

        ClassLoader ret = AccessController.doPrivileged(new PrivilegedAction<ThrowawayFileClassLoader>() {

            public ThrowawayFileClassLoader run() {
                return new ThrowawayFileClassLoader(filesList, getClassLoader().getParent());
            }
        });
        return ret;
    }

    /**
     * @deprecated - use {@link #getTempClassLoaderForResources(Resource...)}
     */
    @Deprecated
    public static ClassLoader getTempClassLoaderForFile(java.io.File... files) {
        return getTempClassLoaderForResources(ConversionUtils.convertToResourceList(Arrays.asList(files)).toArray(new Resource[files.length]));
    }

    /**
     * Returns the File object associated with the given classpath-based path.
     * 
     * Note that this method won't work as expected if the file exists in a jar. This method will throw an IOException
     * in that case.
     * 
     * @param path The path to search for.
     * @return The File object associated with the given path.
     * @throws IOException
     */
    public static Resource getClasspathFile(String path) throws IOException {
        Resource ret = new ClassPathResource(path);
        if (!ret.exists()) {
            // must have come from a jar or some other obscure location
            // that we didn't expect
            throw new IOException("Cannot access " + ret.toString());
        }
        return ret;
    }

    public static Object runInClassLoaderContext(TaskType task, Resource... files) {
        return runInClassLoaderContext(task, getClassLoaderForResources(files));
    }

    public static Object runInClassLoaderContext(TaskType task, ClassLoader cl) {
        ClassLoader c = Thread.currentThread().getContextClassLoader();
        try {
            Thread.currentThread().setContextClassLoader(cl);

            if (task instanceof TaskRtn) {
                return ((TaskRtn) task).run();
            } else {
                ((TaskNoRtn) task).run();
                return null;
            }
        } finally {
            Thread.currentThread().setContextClassLoader(c);
        }
    }

    private static interface TaskType {
    }

    public static interface TaskNoRtn extends TaskType {

        void run();
    }

    public static interface TaskRtn extends TaskType {

        Object run();
    }
}
