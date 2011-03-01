/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;
import java.util.jar.JarFile;
import java.util.zip.ZipEntry;

import org.apache.commons.io.IOUtils;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;

/**
 * A ClassLoader that takes a File (as the root to search in), and searches
 * for classes within that root.  This does everything to avoid ever loading
 * classes into any other classloader.  It takes a parent classloader as an
 * option, but only delegates to it if the class cannot be found in the
 * local paths.
 * 
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class ThrowawayFileClassLoader extends ClassLoader {

    private final List<File> classPath;
    private final ClassLoader parentClassLoader;
    
    public ThrowawayFileClassLoader(List<File> classPath, ClassLoader parent) {
        
        super(null);
        this.classPath = classPath;
        this.parentClassLoader = parent;
    }
    
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        
        if (null==classPath) {
            throw new ClassNotFoundException("invalid search root: "+
                    classPath);
        } else if (null==name) {
            throw new ClassNotFoundException(Resource.NULL_CLASS.getMessage());
        }
        
        String classNamePath = name.replace('.', '/') + ".class";

        byte[] fileBytes = null;
        try {
            InputStream is = null;
            JarFile jarFile = null;
            
            for (File entry: classPath) {
                if (entry.getName().toLowerCase().endsWith(".jar")) {
                    jarFile = new JarFile(entry);
                    ZipEntry ze = jarFile.getEntry(classNamePath);
                    
                    if (null != ze) {
                        is = jarFile.getInputStream(ze);
                        break;
                    } else {
                        jarFile.close();
                    }
                } else {

                    File classFile = new File(entry, classNamePath);
                    if (classFile.exists()) {
                        is = new FileInputStream(classFile);
                        break;
                    }
                }
            }
            
            if (null!=is) {
                try {
                    fileBytes = IOUtils.toByteArray(is);
                    is.close();
                } finally {
                    if (null != jarFile) {
                        jarFile.close();
                    }
                }
            }
        } catch (IOException e) {
            throw new ClassNotFoundException(e.getMessage(), e);
        }
        
        if (name.contains(".")) {
            String packageName = name.substring(0, name.lastIndexOf('.'));
            if (null==getPackage(packageName)) {
                definePackage(packageName, "", "", "", "", "", "", null);
            }
        }

        Class<?> ret;
        if (null==fileBytes) {
            ret = ClassLoaderUtils.loadClass(name, this.parentClassLoader);
        } else {
            ret = defineClass(name, fileBytes, 0, fileBytes.length);
        }
        
        if (null==ret) {
            throw new ClassNotFoundException("Couldn't find class "+name+
                    " in expected classpath: "+this.classPath);
        }
        
        return ret;
    }
    
    @Override
    protected URL findResource(String name) {
        
        URL ret = null;
        JarFile jarFile = null;
        
        try {
            for (File entry : classPath) {
                if (entry.getName().toLowerCase().endsWith(".jar")) {
                    jarFile = new JarFile(entry);
                    ZipEntry ze = jarFile.getEntry(name);
                    jarFile.close();

                    if (null != ze) {
                        ret = new URL("jar:" + entry.toURI().toURL() + "!/" + name);
                        break;
                    }
                } else {
                    File file = new File(entry, name);
                    if (file.exists()) {
                        ret = file.toURI().toURL();
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
        if (null==url) {
            return null;
        }
        
        try {
            InputStream is = null;
            byte[] b;
            try {
                is = url.openStream();
                b = IOUtils.toByteArray(is);
            } finally {
                if (null!=is) {
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