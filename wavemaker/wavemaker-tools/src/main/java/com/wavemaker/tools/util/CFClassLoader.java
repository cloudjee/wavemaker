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

package com.wavemaker.tools.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.jar.JarFile;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.Resource;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.runtime.RuntimeAccess;

/**
 * A ClassLoader that loads a list of resources
 * 
 * @author Seung Lee
 */
public class CFClassLoader extends ClassLoader {

    private final Resource[] resources;

    private final ClassLoader parentClassLoader;

    private final StudioFileSystem fileSystem;

    public CFClassLoader(Resource[] resources, ClassLoader parent) {

        super(null);
        this.resources = resources;
        this.parentClassLoader = parent;
        this.fileSystem = (StudioFileSystem) RuntimeAccess.getInstance().getSpringBean("fileSystem");
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {

        if (this.resources == null) {
            throw new ClassNotFoundException("invalid search root: " + this.resources);
        } else if (name == null) {
            throw new ClassNotFoundException(MessageResource.NULL_CLASS.getMessage());
        }

        String classNamePath = name.replace('.', '/') + ".class";

        List<Resource> files = new ArrayList<Resource>();
        for (int i = 0; i < this.resources.length; i++) {
            files.addAll(this.fileSystem.listAllChildren(this.resources[i], null));
        }

        byte[] fileBytes = null;
        try {
            InputStream is = null;
            JarFile jarFile = null;

            for (Resource entry : files) {
                String resourcePath = getPath(entry);
                int len1 = resourcePath.length();
                int len2 = classNamePath.length();
                if (len1 > len2) {
                    if (resourcePath.substring(len1 - len2, len1).equals(classNamePath)) {
                        is = entry.getInputStream();
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
        try {
            if (fileBytes == null) {
                ret = ClassLoaderUtils.loadClass(name, this.parentClassLoader);
            } else {
                ret = defineClass(name, fileBytes, 0, fileBytes.length);
            }
        } catch (WMRuntimeException ex) {
            ret = null;
        }

        if (ret == null) {
            throw new ClassNotFoundException("Couldn't find class " + name + " in expected classpath: " + this.resources);
        }

        return ret;
    }

    @Override
    public InputStream getResourceAsStream(String name) {
        List<Resource> files = new ArrayList<Resource>();
        for (int i = 0; i < this.resources.length; i++) {
            files.addAll(this.fileSystem.listAllChildren(this.resources[i], null));
        }

        InputStream ret;

        try {
            for (Resource entry : files) {
                String resourcePath = getPath(entry);
                int len1 = resourcePath.length();
                int len2 = name.length();
                if (len1 > len2) {
                    if (resourcePath.substring(len1 - len2, len1).equals(name)) {
                        return entry.getInputStream();
                    }
                }
            }
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }

        ret = this.parentClassLoader.getResourceAsStream(name);

        return ret;
    }

    private String getPath(Resource resource) {
        String path = this.fileSystem.getPath(resource);
        int len = path.length();
        if (path.substring(len - 1, len).equals("/")) {
            path = path.substring(0, len - 1);
        }
        return path;
    }
}