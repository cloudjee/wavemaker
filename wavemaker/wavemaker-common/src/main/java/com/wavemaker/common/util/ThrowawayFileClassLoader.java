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

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;
import java.util.jar.JarFile;
import java.util.zip.ZipEntry;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.Resource;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;

/**
 * A ClassLoader that takes a File (as the root to search in), and searches for classes within that root. This does
 * everything to avoid ever loading classes into any other classloader. It takes a parent classloader as an option, but
 * only delegates to it if the class cannot be found in the local paths.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class ThrowawayFileClassLoader extends ClassLoader {

    private final List<Resource> classPath;

    private final ClassLoader parentClassLoader;

    public ThrowawayFileClassLoader(List<Resource> classPath, ClassLoader parent) {

        super(null);
        this.classPath = classPath;
        this.parentClassLoader = parent;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {

        if (this.classPath == null) {
            throw new ClassNotFoundException("invalid search root: " + this.classPath);
        } else if (name == null) {
            throw new ClassNotFoundException(MessageResource.NULL_CLASS.getMessage());
        }

        String classNamePath = name.replace('.', '/') + ".class";

        byte[] fileBytes = null;
        try {
            InputStream is = null;
            JarFile jarFile = null;

            for (Resource entry : this.classPath) {
                if (entry.getFilename().toLowerCase().endsWith(".jar")) {
                    jarFile = new JarFile(entry.getFile());
                    ZipEntry ze = jarFile.getEntry(classNamePath);

                    if (ze != null) {
                        is = jarFile.getInputStream(ze);
                        break;
                    } else {
                        jarFile.close();
                    }
                } else {

                    Resource classFile = entry.createRelative(classNamePath);
                    if (classFile.exists()) {
                        is = classFile.getInputStream();
                        break;
                    }
                }
            }

            if (is != null) {
                try {
                    fileBytes = IOUtils.toByteArray(is);
                    is.close();
                } finally {
                    if (jarFile != null) {
                        jarFile.close();
                    }
                }
            }
        } catch (IOException e) {
            throw new ClassNotFoundException(e.getMessage(), e);
        }

        if (name.contains(".")) {
            String packageName = name.substring(0, name.lastIndexOf('.'));
            if (getPackage(packageName) == null) {
                definePackage(packageName, "", "", "", "", "", "", null);
            }
        }

        Class<?> ret;
        if (fileBytes == null) {
            ret = ClassLoaderUtils.loadClass(name, this.parentClassLoader);
        } else {
            ret = defineClass(name, fileBytes, 0, fileBytes.length);
        }

        if (ret == null) {
            throw new ClassNotFoundException("Couldn't find class " + name + " in expected classpath: " + this.classPath);
        }

        return ret;
    }

    @Override
    protected URL findResource(String name) {

        URL ret = null;
        JarFile jarFile = null;

        try {
            for (Resource entry : this.classPath) {
                if (entry.getFilename().toLowerCase().endsWith(".jar")) {
                    jarFile = new JarFile(entry.getFile());
                    ZipEntry ze = jarFile.getEntry(name);
                    jarFile.close();

                    if (ze != null) {
                        ret = new URL("jar:" + entry.getURL() + "!/" + name);
                        break;
                    }
                } else {
                    Resource file = entry.createRelative(name);
                    if (file.exists()) {
                        ret = file.getURL();
                        break;
                    }
                }
            }
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }

        return ret;
    }

    @Override
    public InputStream getResourceAsStream(String name) {
        URL url = getResource(name);
        if (url == null) {
            return null;
        }

        try {
            InputStream is = null;
            byte[] b;
            try {
                is = url.openStream();
                b = IOUtils.toByteArray(is);
            } finally {
                if (is != null) {
                    is.close();
                }
                url = null;
                is = null;
            }

            return new ByteArrayInputStream(b);
        } catch (IOException e) {
            return null;
        }
    }
}